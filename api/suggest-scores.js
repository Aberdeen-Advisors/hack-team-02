/**
 * POST /api/suggest-scores
 *
 * Vercel Node serverless function. Proposes the six 1-5 sub-factor scores for
 * ONE role from a free-text description of what changes for it — the assisted
 * on-ramp for the "Start new project" flow, where a client hands over a CSV or
 * a quick per-role form instead of already knowing where each slider sits.
 *
 * This is scoring ASSISTANCE only. It does not touch the scoring engine: the
 * six numbers it returns are just pre-fill values for the same sliders a human
 * would otherwise set by hand, and axis/tier arithmetic (scoreRole, assignTier,
 * the 3.5 threshold) stays entirely client-side and deterministic, exactly as
 * it already is for every other entry path. Every value returned here is
 * editable in the UI before the role is added to the portfolio, and the UI
 * marks it "AI-suggested — review before finalizing".
 *
 * Same fallback philosophy as api/generate.js: if ANTHROPIC_API_KEY is absent
 * or the call fails for any reason, this returns a flat, clearly-labelled
 * placeholder with HTTP 200 and "source": "fallback" rather than an error —
 * but unlike the narrative endpoint's fallback (which is a real deterministic
 * template), there is no honest deterministic way to infer a score from free
 * text without a model, so the fallback is a neutral 3.0 across all six,
 * explicitly flagged as a placeholder rather than passed off as an assessment.
 */

'use strict';

const MODEL = 'claude-sonnet-5';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const CALL_TIMEOUT_MS = 30000;

const SUB_FACTOR_KEYS = ['taskShare', 'frequencyVolume', 'errorConsequence', 'decisionRights', 'capabilityDelta', 'localReadiness'];

/* NOTE: number properties intentionally carry no minimum/maximum — the
   Anthropic structured-output schema rejects those keywords on 'number'
   ("properties maximum, minimum are not supported"). The 1-5 range is
   enforced server-side instead, by clampScore() below, on every value the
   model returns. */
const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    impact: {
      type: 'object',
      properties: {
        taskShare: { type: 'number' },
        frequencyVolume: { type: 'number' },
        errorConsequence: { type: 'number' },
      },
      required: ['taskShare', 'frequencyVolume', 'errorConsequence'],
      additionalProperties: false,
    },
    risk: {
      type: 'object',
      properties: {
        decisionRights: { type: 'number' },
        capabilityDelta: { type: 'number' },
        localReadiness: { type: 'number' },
      },
      required: ['decisionRights', 'capabilityDelta', 'localReadiness'],
      additionalProperties: false,
    },
    rationale: {
      type: 'object',
      description: 'One short sentence per sub-factor, citing something concrete from the description.',
      properties: SUB_FACTOR_KEYS.reduce((o, k) => { o[k] = { type: 'string' }; return o; }, {}),
      required: SUB_FACTOR_KEYS,
      additionalProperties: false,
    },
  },
  required: ['impact', 'risk', 'rationale'],
  additionalProperties: false,
};

const SYSTEM_PROMPT = [
  'You are a change-impact assessor at Aberdeen Advisors. You score ONE role on six sub-factors, each 1.0-5.0 on one',
  'decimal place, using the same anchor ladders a human reviewer sees on screen — you are supplied the exact band text',
  'for each sub-factor and must anchor your score against it, not against a generic sense of "high" or "low" impact.',
  '',
  'Hard rules:',
  '1. Base every score ONLY on the role information and free-text description supplied. Do not invent facts about the',
  '   role that are not stated or reasonably implied by the description.',
  '2. For each sub-factor, pick the anchor band (1-5) that best matches the description, then adjust by up to ±0.4 if',
  '   the description sits between two bands. Do not default to the middle of the scale out of caution — commit to a',
  '   score the description actually supports, high or low.',
  '3. decisionRights is specifically about authority moving from the person to the system (or to another role) — score',
  '   it low if the description does not mention any change in who approves, releases or overrides something.',
  '4. localReadiness is scored 5 = LEAST ready (most gap), 1 = most ready. If the description gives no signal on site',
  '   leadership capacity, change fatigue or deskless access, score it near the middle (2.5-3.0), not at either extreme.',
  '5. Every rationale is ONE short sentence, plain language, that names the specific phrase or fact in the description',
  '   that drove the score. If the description gives no real signal for a sub-factor, say so in the rationale and',
  '   explain why you still picked the score you did.',
  '6. These are a first-pass suggestion for a human to review and edit, not a final answer — calibrate honestly rather',
  '   than hedge everything to the middle.',
  '',
  'Return JSON only, matching the supplied schema exactly.',
].join('\n');

function userPrompt(p) {
  const r = p.role || {};
  const a = p.anchors || {};
  const lines = [
    `ROLE: ${r.name || '(unnamed role)'}`,
    `Value stream / process area: ${r.valueStream || '(not given)'} · Site: ${r.siteArchetype || '(not given)'} · Headcount: ${r.headcount ?? '(not given)'}`,
    '',
    `DESCRIPTION OF WHAT CHANGES: ${r.summary || '(none supplied)'}`,
    '',
    'ANCHOR LADDERS — score against these band definitions, 1 is the first line, 5 is the last:',
  ];
  SUB_FACTOR_KEYS.forEach((key) => {
    const factor = a[key] || {};
    lines.push('', `${factor.label || key}${factor.hint ? ' — ' + factor.hint : ''}`);
    (factor.bands || []).forEach((b, i) => lines.push(`  ${i + 1}. ${b}`));
  });
  lines.push('', 'Score all six sub-factors and give a one-sentence rationale for each.');
  return lines.join('\n');
}

function clampScore(v, fallback) {
  const n = typeof v === 'number' && isFinite(v) ? v : fallback;
  return Math.round(Math.min(5, Math.max(1, n)) * 10) / 10;
}

/* No source can honestly infer a score from free text without a model — this
   is a flagged placeholder, not a deterministic estimate. */
function fallback() {
  const flat = 3.0;
  const rationale = SUB_FACTOR_KEYS.reduce((o, k) => {
    o[k] = 'No AI scoring available — placeholder mid-scale value, not derived from the description. Review and adjust.';
    return o;
  }, {});
  return {
    impact: { taskShare: flat, frequencyVolume: flat, errorConsequence: flat },
    risk: { decisionRights: flat, capabilityDelta: flat, localReadiness: flat },
    rationale,
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
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt(payload) }],
        thinking: { type: 'disabled' },
        output_config: {
          effort: 'low',
          format: { type: 'json_schema', schema: OUTPUT_SCHEMA },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`anthropic ${res.status}: ${body.slice(0, 400)}`);
    }

    const msg = await res.json();
    if (msg.stop_reason === 'refusal') throw new Error('anthropic refusal');
    const text = (msg.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    if (!text) throw new Error('empty completion');

    const parsed = JSON.parse(text);
    if (!parsed.impact || !parsed.risk) throw new Error('unexpected shape');

    // Clamp defensively even though the schema constrains range — a model can
    // still return an out-of-band or non-numeric value on a bad day.
    const clamped = {
      impact: {
        taskShare: clampScore(parsed.impact.taskShare, 3),
        frequencyVolume: clampScore(parsed.impact.frequencyVolume, 3),
        errorConsequence: clampScore(parsed.impact.errorConsequence, 3),
      },
      risk: {
        decisionRights: clampScore(parsed.risk.decisionRights, 3),
        capabilityDelta: clampScore(parsed.risk.capabilityDelta, 3),
        localReadiness: clampScore(parsed.risk.localReadiness, 3),
      },
      rationale: parsed.rationale || {},
    };
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
  if (!payload || !payload.role || !payload.role.summary) {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify({ error: 'expected { role: { name, valueStream, siteArchetype, headcount, summary }, anchors }' }));
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  res.setHeader('content-type', 'application/json');

  if (apiKey) {
    try {
      const { data, model } = await callAnthropic(payload, apiKey);
      res.statusCode = 200;
      return res.end(JSON.stringify({ ...data, source: 'anthropic', model }));
    } catch (err) {
      console.error('[suggest-scores] anthropic call failed, serving placeholder:', err && err.message);
      res.statusCode = 200;
      return res.end(JSON.stringify({ ...fallback(), source: 'fallback', reason: 'api_error' }));
    }
  }

  res.statusCode = 200;
  return res.end(JSON.stringify({ ...fallback(), source: 'fallback', reason: 'no_api_key' }));
};
