/**
 * POST /api/derive
 *
 * Vercel Node serverless function. Derives ONE role's impact detail as one
 * of three states:
 *
 *   drafted    The uploaded documents specifically describe this role (or a
 *              group that clearly includes it). Every field is grounded in
 *              that evidence, and sourceFileName/sourceQuote cite it.
 *   assumed    The documents do not describe this role directly, but the
 *              role's title, the named systems, and (where the documents
 *              describe a related role, the same function, or the same
 *              site) that surrounding evidence are enough to draft a
 *              plausible before/after from general professional knowledge
 *              of this kind of change for this kind of role. assumptionBasis
 *              says what that draft rests on. sourceFileName/sourceQuote
 *              stay empty: an assumption is never dressed up as a document
 *              citation.
 *   needsInput Neither is reasonably possible, for example a role specific
 *              enough to this organization that nothing can responsibly be
 *              assumed about it. Every other field left empty.
 *
 * THE SAFETY MODEL, stated to the model twice below: drafted content must be
 * traceable to the documents, assumed content must be visibly labeled as an
 * assumption and never carry a document citation, and when even a
 * reasonable assumption is not possible the answer is needsInput, not a
 * guess dressed up as either of the other two. This is deliberately NOT the
 * same fallback philosophy as api/generate.js or api/suggest-scores.js:
 * those two derive from data the client already computed deterministically,
 * so a template fallback is honest. There is no honest template for "what
 * does this specific role's work become," so both the no-key path and the
 * on-error/on-timeout path here return needsInput, never placeholder
 * content, never a neutral mid-scale guess and never a fabricated
 * assumption.
 *
 * Scoring stays exactly as authoritative everywhere else in the app: the
 * six numbers this returns are pre-fill values for a practitioner to
 * accept, edit or reject on the review screen, whether the state is drafted
 * or assumed. scoreRole/assignTier/the 3.5 threshold never run inside this
 * function and are never asked to.
 *
 * CommonJS + global fetch on purpose, same as the other two endpoints: the
 * repo has no package.json and no build step, so no SDK is installed and
 * raw HTTPS against the Messages API is the only option here.
 *
 * Logging is deliberately narrow: role name, state and timing only. Never
 * log document text, the model's raw response, or any part of an error
 * body that could echo either back.
 */

'use strict';

const MODEL = 'claude-sonnet-5';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const CALL_TIMEOUT_MS = 45000;

// Generous but bounded: a practitioner could upload a genuinely long design
// document, and Sonnet 5's context window comfortably holds several of
// these per role, but an unbounded string is still one bad upload away from
// a pathological request. Per document, not per project.
const MAX_DOC_CHARS = 60000;
const MAX_EXAMPLE_CHARS = 8000;

const SUB_FACTOR_KEYS = ['taskShare', 'frequencyVolume', 'errorConsequence', 'decisionRights', 'capabilityDelta', 'localReadiness'];

const SUB_FACTOR_META = {
  taskShare: { label: 'Share of daily tasks changing', axis: 'impact' },
  frequencyVolume: { label: 'Frequency and volume of the task', axis: 'impact' },
  errorConsequence: { label: 'Consequence of error', axis: 'impact' },
  decisionRights: { label: 'Change in decision rights', axis: 'risk' },
  capabilityDelta: { label: 'New skills needed', axis: 'risk' },
  localReadiness: { label: 'Site readiness', axis: 'risk' },
};

/* NOTE: number properties intentionally carry no minimum/maximum, same
   reason as api/suggest-scores.js: the Anthropic structured-output schema
   rejects those keywords on 'number'. The 1-5 whole-band range is enforced
   server-side instead, by clampBand() below. */
const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    state: { type: 'string', enum: ['drafted', 'assumed', 'needsInput'] },
    before: { type: 'array', items: { type: 'string' }, description: 'Empty array if state is needsInput.' },
    after: { type: 'array', items: { type: 'string' }, description: 'Empty array if state is needsInput.' },
    tasksRemoved: { type: 'number' },
    tasksChanged: { type: 'number' },
    tasksNew: { type: 'number' },
    impact: {
      type: 'object',
      description: 'The anchor band (1-5, whole number) each impact sub-factor matches. All 0 if state is needsInput.',
      properties: { taskShare: { type: 'number' }, frequencyVolume: { type: 'number' }, errorConsequence: { type: 'number' } },
      required: ['taskShare', 'frequencyVolume', 'errorConsequence'],
      additionalProperties: false,
    },
    risk: {
      type: 'object',
      description: 'The anchor band (1-5, whole number) each adoption-risk sub-factor matches. All 0 if state is needsInput.',
      properties: { decisionRights: { type: 'number' }, capabilityDelta: { type: 'number' }, localReadiness: { type: 'number' } },
      required: ['decisionRights', 'capabilityDelta', 'localReadiness'],
      additionalProperties: false,
    },
    rationale: {
      type: 'object',
      description: 'One short sentence per sub-factor naming the band and what it is based on. Empty strings if state is needsInput.',
      properties: SUB_FACTOR_KEYS.reduce((o, k) => { o[k] = { type: 'string' }; return o; }, {}),
      required: SUB_FACTOR_KEYS,
      additionalProperties: false,
    },
    constraints: { type: 'array', items: { type: 'string' }, description: 'Empty array if state is needsInput.' },
    summary: { type: 'string', description: 'One paragraph. Empty string if state is needsInput.' },
    sourceFileName: { type: 'string', description: 'ONLY for state drafted: the uploaded file this was drawn from. Empty string for assumed or needsInput.' },
    sourceQuote: { type: 'string', description: 'ONLY for state drafted: a short quote (under 200 characters) from that file supporting this. Empty string for assumed or needsInput.' },
    assumptionBasis: { type: 'string', description: 'ONLY for state assumed: one or two sentences naming the general knowledge (the role title, the named systems) and any related-role, related-function or same-site evidence the draft rests on. Empty string for drafted or needsInput.' },
  },
  required: ['state', 'before', 'after', 'tasksRemoved', 'tasksChanged', 'tasksNew', 'impact', 'risk', 'rationale', 'constraints', 'summary', 'sourceFileName', 'sourceQuote', 'assumptionBasis'],
  additionalProperties: false,
};

const SYSTEM_PROMPT = [
  'You are a change-impact analyst at Aberdeen Advisors. You are given one role (name, site, headcount) and a set of',
  'documents describing an organizational change. Your job is to work out how this specific role\'s day-to-day work',
  'changes, and to score six 1-5 sub-factors against the anchor bands supplied, using exactly one of three states.',
  '',
  'STATE 1: "drafted". The documents specifically describe this role, or a group that clearly includes it, changing.',
  'Every field must be traceable to that evidence: quote or closely paraphrase it, and name the file it came from.',
  '',
  'STATE 2: "assumed". The documents do NOT specifically describe this role, but a reasonable draft is still possible',
  'from general professional knowledge of what a change like this typically does to a role like this, given the role\'s',
  'title and the named systems. Use this state when you can responsibly draft before/after tasks, task counts and all',
  'six sub-factor scores this way. You must still use anything the documents DO say about a related role, the same',
  'function, or the same site, even though none of it names this role directly, and your assumptionBasis should say',
  'so when it applies. An assumed draft is exactly as complete as a drafted one (full before/after, full task counts,',
  'all six scores) but is never accompanied by sourceFileName or sourceQuote: those two fields stay empty strings,',
  'because an assumption must never be dressed up as a document citation. Instead, assumptionBasis states in one or',
  'two sentences what general knowledge, and what related evidence if any, the draft rests on.',
  '',
  'STATE 3: "needsInput". Neither of the above is possible, for example because the role is specific enough to this',
  'organization (an internal-only title, a bespoke function) that even a general-knowledge assumption would not be',
  'responsible. Leave every other field at its empty value: empty arrays, zero counts, empty strings, all six scores',
  '0. Returning needsInput too often is a smaller failure than drafting or assuming content that is not warranted.',
  '',
  'THE RULE THAT MATTERS MOST, whichever state you pick: never invent evidence. A "drafted" role\'s sourceFileName and',
  'sourceQuote must both be real and verbatim from an uploaded document. An "assumed" role must never carry a',
  'sourceFileName or sourceQuote, because it has none: presenting an assumption as if it were a document finding is',
  'the one mistake this tool cannot afford; a human reviewing an assumed role must always be able to tell that it is',
  'one at a glance.',
  '',
  'If the state is drafted or assumed:',
  '1. List the before and after tasks (real, from the documents, if drafted; a plausible before/after for this kind of',
  '   role and change, if assumed). Count how many disappear (removed), how many change shape (changed) and how many',
  '   are genuinely new.',
  '2. For each of the six sub-factors, pick the ONE anchor band (a whole number, 1 to 5) from the supplied ladder that',
  '   best matches the evidence (drafted) or the typical case for this kind of role and change (assumed). Do not',
  '   interpolate between bands and do not default to the middle out of caution. decisionRights is specifically about',
  '   approval or override authority moving from the person to the system or to another role. localReadiness is',
  '   scored 5 = LEAST ready (most gap), 1 = most ready.',
  '3. For each sub-factor, write one short sentence naming the band you picked. If drafted, quote or closely',
  '   paraphrase the specific evidence for it. If assumed, say plainly that it is a typical assumption for this kind',
  '   of role, not a documented fact.',
  '4. List constraints affecting delivery for this role (for example: works on the floor, no desk or email, shift',
  '   coverage, a named regulatory or compliance requirement): from the documents if drafted, or only the ones',
  '   generally true of this kind of role if assumed.',
  '5. Write one paragraph, plain business English, addressed to a change-management practitioner, summarizing what',
  '   changes and why it matters for this role.',
  '6. If drafted, name the one file and a short supporting quote (under 200 characters, verbatim from that file) you',
  '   relied on most; leave sourceFileName and sourceQuote empty. If assumed, leave both of those empty and instead',
  '   fill assumptionBasis with what the draft rests on.',
  '',
  'If example impact records are supplied, match their tone and level of detail, not their specific content: they show',
  'how this client describes work, not facts about this role.',
  '',
  'Final reminder, because this is the entire safety model for this tool: drafted content must be grounded in the',
  'documents, assumed content must be visibly and honestly labeled as an assumption with no fake citation, and where',
  'even a responsible assumption is not possible the answer is needsInput. Never fabricate content to avoid an empty',
  'result, and never blend an assumption into a drafted answer or vice versa.',
  '',
  'Never use an em dash anywhere in any text field. Use a comma, a colon, a full stop, or restructure the sentence.',
  '',
  'Return JSON only, matching the supplied schema exactly.',
].join('\n');

function truncate(text, max) {
  const s = String(text || '');
  return s.length > max ? s.slice(0, max) + '\n[truncated]' : s;
}

function userPrompt(p) {
  const r = p.role || {};
  const ctx = p.context || {};
  const lines = [
    `ROLE: ${r.name || '(unnamed role)'}`,
    `Site: ${r.siteArchetype || '(not given)'} · Headcount: ${r.headcount ?? '(not given)'}`,
  ];
  if (ctx.whatIsChanging) lines.push(`Program-wide change: ${ctx.whatIsChanging}`);
  if (ctx.systems) lines.push(`Systems involved: ${ctx.systems}`);
  if (ctx.industry) lines.push(`Industry: ${ctx.industry}`);
  lines.push('', 'ANCHOR LADDERS: pick one band per sub-factor, 1 is the first line, 5 is the last:');
  SUB_FACTOR_KEYS.forEach((key) => {
    const factor = (p.anchors && p.anchors[key]) || {};
    lines.push('', `${SUB_FACTOR_META[key].label} (${key})`);
    (factor.bands || []).forEach((b, i) => lines.push(`  ${i + 1}. ${b}`));
  });

  const docs = Array.isArray(p.documents) ? p.documents : [];
  lines.push('', `UPLOADED DOCUMENTS (${docs.length}):`);
  if (!docs.length) {
    lines.push('  (none uploaded)');
  } else {
    docs.forEach((d) => {
      lines.push('', `--- FILE: ${d.name || '(unnamed file)'} ---`, truncate(d.text, MAX_DOC_CHARS));
    });
  }

  const examples = Array.isArray(p.examples) ? p.examples : [];
  if (examples.length) {
    lines.push('', 'EXAMPLE IMPACT RECORDS (style calibration only, not facts about this role):');
    examples.forEach((d) => {
      lines.push('', `--- EXAMPLE: ${d.name || '(unnamed file)'} ---`, truncate(d.text, MAX_EXAMPLE_CHARS));
    });
  }

  lines.push('', 'Derive this role\'s impact from the documents above, or return needsInput.');
  return lines.join('\n');
}

function clampBand(v) {
  const n = typeof v === 'number' && isFinite(v) ? Math.round(v) : 0;
  return Math.min(5, Math.max(0, n));
}

function needsInputResult() {
  return {
    state: 'needsInput',
    before: [], after: [],
    tasksRemoved: 0, tasksChanged: 0, tasksNew: 0,
    impact: { taskShare: 0, frequencyVolume: 0, errorConsequence: 0 },
    risk: { decisionRights: 0, capabilityDelta: 0, localReadiness: 0 },
    rationale: SUB_FACTOR_KEYS.reduce((o, k) => { o[k] = ''; return o; }, {}),
    constraints: [], summary: '', sourceFileName: '', sourceQuote: '', assumptionBasis: '',
  };
}

async function callAnthropic(payload, apiKey) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), CALL_TIMEOUT_MS);
  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      signal: ctl.signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt(payload) }],
        // Determinism / low variance comes from the JSON schema and the
        // prompt: temperature/top_p/top_k are rejected with a 400 on
        // claude-sonnet-5 (see api/suggest-scores.js) - do not add them.
        thinking: { type: 'disabled' },
        output_config: {
          effort: 'low',
          format: { type: 'json_schema', schema: OUTPUT_SCHEMA },
        },
      }),
    });

    if (!res.ok) {
      // Drain the body so the connection can be reused, but never log or
      // return it: it can echo request content back.
      await res.text().catch(() => '');
      throw new Error('http_' + res.status);
    }

    const msg = await res.json();
    if (msg.stop_reason === 'refusal') throw new Error('refusal');
    const text = (msg.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    if (!text) throw new Error('empty_completion');

    const parsed = JSON.parse(text);
    if (parsed.state !== 'drafted' && parsed.state !== 'assumed' && parsed.state !== 'needsInput') throw new Error('bad_shape');

    if (parsed.state === 'needsInput') {
      return { data: needsInputResult(), model: msg.model || MODEL };
    }

    const isAssumed = parsed.state === 'assumed';
    const clamped = {
      state: parsed.state,
      before: Array.isArray(parsed.before) ? parsed.before.map(String) : [],
      after: Array.isArray(parsed.after) ? parsed.after.map(String) : [],
      tasksRemoved: Math.max(0, Math.round(Number(parsed.tasksRemoved) || 0)),
      tasksChanged: Math.max(0, Math.round(Number(parsed.tasksChanged) || 0)),
      tasksNew: Math.max(0, Math.round(Number(parsed.tasksNew) || 0)),
      impact: {
        taskShare: clampBand(parsed.impact && parsed.impact.taskShare),
        frequencyVolume: clampBand(parsed.impact && parsed.impact.frequencyVolume),
        errorConsequence: clampBand(parsed.impact && parsed.impact.errorConsequence),
      },
      risk: {
        decisionRights: clampBand(parsed.risk && parsed.risk.decisionRights),
        capabilityDelta: clampBand(parsed.risk && parsed.risk.capabilityDelta),
        localReadiness: clampBand(parsed.risk && parsed.risk.localReadiness),
      },
      rationale: SUB_FACTOR_KEYS.reduce((o, k) => { o[k] = String((parsed.rationale && parsed.rationale[k]) || ''); return o; }, {}),
      constraints: Array.isArray(parsed.constraints) ? parsed.constraints.map(String) : [],
      summary: String(parsed.summary || ''),
      // Defensively scrubbed by state, not just prompted: an assumed role
      // must never carry a source citation even if the model filled one in
      // on a bad day, and an assumed role's own basis sentence has nothing
      // to say on a drafted (evidenced) role.
      sourceFileName: isAssumed ? '' : String(parsed.sourceFileName || ''),
      sourceQuote: isAssumed ? '' : String(parsed.sourceQuote || '').slice(0, 240),
      assumptionBasis: isAssumed ? String(parsed.assumptionBasis || '').slice(0, 400) : '',
    };
    // Any sub-factor left at 0 (the needsInput sentinel value) means the
    // model didn't actually pick a band for it - safer to treat the whole
    // role as needsInput than show a part-populated draft with a silent gap.
    // Same rule for both drafted and assumed: an assumption is still a full
    // six-score draft, never a partial one.
    const hasAllBands = [clamped.impact.taskShare, clamped.impact.frequencyVolume, clamped.impact.errorConsequence,
      clamped.risk.decisionRights, clamped.risk.capabilityDelta, clamped.risk.localReadiness].every((n) => n > 0);
    if (!hasAllBands) return { data: needsInputResult(), model: msg.model || MODEL };
    // An assumed role with no stated basis is indistinguishable from a
    // guess with no grounding at all - treat it the same as an incomplete
    // draft rather than show an unexplained assumption.
    if (isAssumed && !clamped.assumptionBasis) return { data: needsInputResult(), model: msg.model || MODEL };

    return { data: clamped, model: msg.model || MODEL };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = async (req, res) => {
  res.setHeader('cache-control', 'no-store');

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('allow', 'POST');
    return res.end(JSON.stringify({ error: 'POST only' }));
  }

  let payload = req.body;
  if (!payload || typeof payload === 'string') {
    try { payload = JSON.parse(payload || '{}'); } catch (e) { payload = {}; }
  }
  if (!payload || !payload.role || !payload.role.name) {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify({ error: 'expected { role: { name, siteArchetype, headcount }, documents, anchors }' }));
  }

  const roleName = String(payload.role.name);
  const apiKey = process.env.ANTHROPIC_API_KEY;
  res.setHeader('content-type', 'application/json');
  const startedAt = Date.now();

  if (apiKey) {
    try {
      const { data, model } = await callAnthropic(payload, apiKey);
      console.log(`[derive] ${roleName}: ${data.state} (${Date.now() - startedAt}ms)`);
      res.statusCode = 200;
      return res.end(JSON.stringify({ ...data, model }));
    } catch (err) {
      // Never surface the model's own response or the document text - but
      // the reason IS returned, as the same short category name it's
      // logged under (e.g. "http_401", "refusal", "timeout"), never a raw
      // error message: enough for the client to tell a systemic failure
      // (every role, same category) from ordinary needsInput, and to say
      // something more specific than "something went wrong" when it does.
      const reason = (err && err.message) || 'unknown_error';
      console.log(`[derive] ${roleName}: error, serving needsInput (${Date.now() - startedAt}ms) reason=${reason}`);
      res.statusCode = 200;
      return res.end(JSON.stringify({ ...needsInputResult(), reason }));
    }
  }

  console.log(`[derive] ${roleName}: needsInput, no API key (${Date.now() - startedAt}ms)`);
  res.statusCode = 200;
  return res.end(JSON.stringify({ ...needsInputResult(), reason: 'no_api_key' }));
};
