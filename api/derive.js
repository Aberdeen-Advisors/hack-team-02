/**
 * POST /api/derive
 *
 * Vercel Node serverless function. Derives ONE role's impact detail, either
 * from the project's uploaded documents (before/after task lists, the six
 * 1-5 sub-factor scores with the anchor band each matches, constraints, and
 * a one-paragraph narrative) or a plain "needsInput" result when the
 * documents do not describe what changes for this role.
 *
 * THE ENTIRE SAFETY MODEL IS ONE RULE, stated to the model twice below:
 * answer only from the supplied documents, and return "needsInput" - every
 * other field left empty - rather than inventing plausible-sounding content.
 * A role with no evidence in the documents must come back with nothing, not
 * a guess dressed up as a finding. This is deliberately NOT the same
 * fallback philosophy as api/generate.js or api/suggest-scores.js: those
 * two derive from data the client already computed deterministically, so a
 * template fallback is honest. There is no honest template for "what does
 * this specific role's work become," so both the no-key path and the
 * on-error/on-timeout path here return needsInput, never placeholder
 * content, never a neutral mid-scale guess.
 *
 * Scoring stays exactly as authoritative everywhere else in the app: the
 * six numbers this returns are pre-fill values for a practitioner to
 * accept, edit or reject on the review screen. scoreRole/assignTier/the 3.5
 * threshold never run inside this function and are never asked to.
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
    state: { type: 'string', enum: ['drafted', 'needsInput'] },
    before: { type: 'array', items: { type: 'string' }, description: 'Empty array if state is needsInput.' },
    after: { type: 'array', items: { type: 'string' }, description: 'Empty array if state is needsInput.' },
    tasksRemoved: { type: 'number' },
    tasksChanged: { type: 'number' },
    tasksNew: { type: 'number' },
    impact: {
      type: 'object',
      description: 'The anchor band (1-5, whole number) each impact sub-factor matches. All 3 if state is needsInput.',
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
      description: 'One short sentence per sub-factor naming the band and the evidence for it. Empty strings if state is needsInput.',
      properties: SUB_FACTOR_KEYS.reduce((o, k) => { o[k] = { type: 'string' }; return o; }, {}),
      required: SUB_FACTOR_KEYS,
      additionalProperties: false,
    },
    constraints: { type: 'array', items: { type: 'string' }, description: 'Empty array if state is needsInput.' },
    summary: { type: 'string', description: 'One paragraph. Empty string if state is needsInput.' },
    sourceFileName: { type: 'string', description: 'The uploaded file this was drawn from. Empty string if state is needsInput.' },
    sourceQuote: { type: 'string', description: 'A short quote (under 200 characters) from that file supporting this. Empty string if state is needsInput.' },
  },
  required: ['state', 'before', 'after', 'tasksRemoved', 'tasksChanged', 'tasksNew', 'impact', 'risk', 'rationale', 'constraints', 'summary', 'sourceFileName', 'sourceQuote'],
  additionalProperties: false,
};

const SYSTEM_PROMPT = [
  'You are a change-impact analyst at Aberdeen Advisors. You are given one role (name, site, headcount) and a set of',
  'documents describing an organizational change. Your job is to work out, from those documents alone, how this',
  'specific role\'s day-to-day work changes, and to score six 1-5 sub-factors against the anchor bands supplied.',
  '',
  'THE ONE RULE THAT MATTERS MOST: answer only from the documents you are given. If they do not describe, specifically',
  'for this role or for a group that clearly includes it, what tasks or decisions change, return state "needsInput"',
  'and leave every other field at its empty value: empty arrays, zero counts, empty strings, all six scores 0.',
  'Do not invent a task list, do not estimate scores from the role\'s title or headcount alone, and do not produce',
  'generic, plausible-sounding content to fill the fields. A role merely named in an org chart or a headcount table,',
  'with nothing said about what changes for it, is not covered and must come back as needsInput. Getting this wrong,',
  'by inventing content the documents do not support, is worse than returning needsInput too often.',
  '',
  'If, and only if, the documents genuinely describe this role\'s change:',
  '1. List the real before and after tasks the documents describe for this role. Count how many disappear (removed),',
  '   how many change shape (changed) and how many are genuinely new.',
  '2. For each of the six sub-factors, pick the ONE anchor band (a whole number, 1 to 5) from the supplied ladder that',
  '   the documents\' own evidence best matches. Do not interpolate between bands and do not default to the middle out',
  '   of caution. decisionRights is specifically about approval or override authority moving from the person to the',
  '   system or to another role. localReadiness is scored 5 = LEAST ready (most gap), 1 = most ready.',
  '3. For each sub-factor, write one short sentence naming the band you picked and quoting or closely paraphrasing the',
  '   specific evidence for it. A rationale with no real evidence behind it means the role should have been needsInput.',
  '4. List constraints affecting delivery for this role (for example: works on the floor, no desk or email, shift',
  '   coverage, a named regulatory or compliance requirement) only where the documents actually state them.',
  '5. Write one paragraph, plain business English, addressed to a change-management practitioner, summarizing what',
  '   changes and why it matters for this role. Ground it in specifics from the documents, not generic language.',
  '6. Name the one file and a short supporting quote (under 200 characters, verbatim from that file) you relied on',
  '   most. If several files were relevant, name the one with the clearest evidence.',
  '',
  'If example impact records are supplied, match their tone and level of detail, not their specific content: they show',
  'how this client describes work, not facts about this role.',
  '',
  'Second reminder, because this is the entire safety model for this tool: when the documents do not cover this role,',
  'return needsInput and nothing else. Never fabricate content to avoid an empty result.',
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
    constraints: [], summary: '', sourceFileName: '', sourceQuote: '',
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
    if (parsed.state !== 'drafted' && parsed.state !== 'needsInput') throw new Error('bad_shape');

    if (parsed.state === 'needsInput') {
      return { data: needsInputResult(), model: msg.model || MODEL };
    }

    const clamped = {
      state: 'drafted',
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
      sourceFileName: String(parsed.sourceFileName || ''),
      sourceQuote: String(parsed.sourceQuote || '').slice(0, 240),
    };
    // Any sub-factor left at 0 (the needsInput sentinel value) means the
    // model didn't actually pick a band for it - safer to treat the whole
    // role as needsInput than show a part-populated draft with a silent gap.
    const hasAllBands = [clamped.impact.taskShare, clamped.impact.frequencyVolume, clamped.impact.errorConsequence,
      clamped.risk.decisionRights, clamped.risk.capabilityDelta, clamped.risk.localReadiness].every((n) => n > 0);
    if (!hasAllBands) return { data: needsInputResult(), model: msg.model || MODEL };

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
      // Never surface an error to the practitioner, and never log the
      // document text or the model's own response - a category name only.
      const reason = (err && err.message) || 'unknown_error';
      console.log(`[derive] ${roleName}: error, serving needsInput (${Date.now() - startedAt}ms) reason=${reason}`);
      res.statusCode = 200;
      return res.end(JSON.stringify({ ...needsInputResult(), reason: 'api_error' }));
    }
  }

  console.log(`[derive] ${roleName}: needsInput, no API key (${Date.now() - startedAt}ms)`);
  res.statusCode = 200;
  return res.end(JSON.stringify({ ...needsInputResult(), reason: 'no_api_key' }));
};
