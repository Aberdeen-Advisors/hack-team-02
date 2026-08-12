/**
 * POST /api/generate
 *
 * Vercel Node serverless function. Generates ONLY the per-role qualitative
 * content for a Change Impact Assessment one-pager:
 *
 *   { narrative, curriculum, comms, adoptionActions }
 *
 * Scoring and tier assignment are deterministic JavaScript in the client and
 * are never sent through a model — this endpoint receives the already-assigned
 * tier and axis scores as grounding.
 *
 * If ANTHROPIC_API_KEY is absent, or the Anthropic call fails for any reason,
 * this returns a deterministic template-generated version with HTTP 200 and
 * "source": "fallback". The stage demo never sees an error.
 *
 * CommonJS + global fetch on purpose: the repo has no package.json and no
 * build step (a hard constraint), so no SDK is installed and raw HTTPS against
 * the Messages API is the only option here.
 */

'use strict';

const MODEL = 'claude-sonnet-5';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const CALL_TIMEOUT_MS = 40000;

/* --------------------------------------------------------------- json shape */

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    narrative: {
      type: 'string',
      description:
        'Two to four short paragraphs, separated by a blank line. What the work becomes, what the real change is, and where resistance will come from.',
    },
    curriculum: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          module: { type: 'string' },
          format: { type: 'string', description: 'Delivery mode, e.g. "3-day sandbox, live data copy" or "On-shift micro-session at the line".' },
          duration: { type: 'string', description: 'e.g. "3h", "90m", "Reference".' },
          objective: { type: 'string', description: 'What the learner must be able to do afterwards.' },
        },
        required: ['module', 'format', 'duration', 'objective'],
        additionalProperties: false,
      },
    },
    comms: {
      type: 'object',
      properties: {
        headline: { type: 'string' },
        message: { type: 'string', description: 'One paragraph, addressed to the population in the second person.' },
        milestones: {
          type: 'array',
          description: 'The five supplied communications milestones, in order, each with its supplied objective and the channel this population actually reaches on.',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              objective: { type: 'string' },
              channel: { type: 'string' },
            },
            required: ['name', 'objective', 'channel'],
            additionalProperties: false,
          },
        },
        channels: { type: 'array', items: { type: 'string' } },
      },
      required: ['headline', 'message', 'milestones', 'channels'],
      additionalProperties: false,
    },
    adoptionActions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          action: { type: 'string' },
          owner: { type: 'string', description: 'A named accountable role, e.g. "Site lead", "Line manager".' },
          timing: { type: 'string', description: 'Relative to go-live, e.g. "Go-live minus 6 weeks".' },
        },
        required: ['action', 'owner', 'timing'],
        additionalProperties: false,
      },
    },
  },
  required: ['narrative', 'curriculum', 'comms', 'adoptionActions'],
  additionalProperties: false,
};

/* ------------------------------------------------------------------ prompts */

const SYSTEM_PROMPT = [
  'You are a senior change-management consultant at Aberdeen Advisors, writing the qualitative half of a',
  'role change one-pager for a consumer-products company deploying a new operating model and ERP to 5,000 employees.',
  '',
  'Audience: change-management consultants and the client-side change lead. Write the way a good consultant writes —',
  'specific, declarative, no filler, no motivational language, no exclamation marks, no emoji. British-neutral business English.',
  '',
  'Hard rules:',
  '1. Write for THIS role only, using the description, sub-factor scores, before/after task lists and constraints supplied.',
  '   Generic content that could apply to any role is a failure.',
  '2. The intervention tier and its package are already decided by a deterministic scoring model. Do not re-score the role,',
  '   do not argue with the tier, and do not propose interventions from a different tier. Work inside the given package and doses.',
  '3. Where the decision-rights sub-factor is 4.0 or higher, you MUST name the decision-rights shift explicitly and say what the',
  '   role used to decide and what the system now decides. Resistance is rarely "the software is hard" — it is',
  '   "I used to approve this, and now the system does".',
  '4. If the role is deskless, every intervention you describe must reach people who have no desk, no screen and no corporate inbox:',
  '   on-shift micro-training at the line, laminated job aids in local language, QR codes at the shift huddle. Never propose email or e-learning.',
  '5. Honour the doses supplied (sandbox days, super-user ratio, coaching weeks, hypercare weeks). Do not inflate them.',
  '5b. Hypercare is the FLOOR deliverable, not a top-tier extra: every tier gets it and only the duration scales, so include a',
  '   hypercare action sized to the supplied hypercare weeks whatever the tier — including Inform.',
  '6. Curriculum items must be built from what the work becomes, not from the ERP module list.',
  '7. Adoption actions must each carry a named accountable owner and a timing relative to go-live.',
  '8. The DELIVERY STANDARDS block supplies the training method, its duration, the job-aid count, the five communications',
  '   milestones with their objectives, the four-layer support escalation and the measurement cadence. Use exactly those:',
  '   name the supplied method and duration in the curriculum rather than generic advice, return the five milestones in order',
  '   with their given objectives, and reference the escalation and the adoption metrics in the adoption actions.',
  '   Do not substitute a different method, invent a duration, or add a milestone.',
  '',
  'Return JSON only, matching the supplied schema exactly.',
].join('\n');

function userPrompt(p) {
  const r = p.role || {};
  const sf = p.subFactors || { impact: {}, risk: {} };
  const lines = [
    `ROLE: ${r.name}`,
    `Value stream: ${r.valueStream} · Site archetype: ${r.siteArchetype} · Sites: ${r.siteCount} · Headcount: ${r.headcount}`,
    `Deskless: ${r.deskless ? 'YES' : 'no'} · New role: ${r.isNewRole ? 'YES — no incumbent population, no existing curriculum' : 'no'}`,
    '',
    `DESCRIPTION: ${r.summary || '(none supplied)'}`,
    '',
    'ASSIGNED TIER (deterministic — do not change): ' + p.tier,
    'Tier package (verbatim, prescribe within this): ' + (p.tierPackage || []).join(' · '),
    'Doses for this tier: ' + JSON.stringify(p.doses || {}),
    '',
    `AXIS SCORES — impact severity ${p.axisScores && p.axisScores.impact}, adoption risk ${p.axisScores && p.axisScores.risk} (threshold 3.5 on both, scale 1-5)`,
    'Impact sub-factors: '
      + `share of daily tasks changing ${sf.impact.taskShare}, `
      + `frequency and volume ${sf.impact.frequencyVolume}, `
      + `consequence of error ${sf.impact.errorConsequence}`,
    'Adoption-risk sub-factors: '
      + `change in decision rights ${sf.risk.decisionRights}, `
      + `capability delta ${sf.risk.capabilityDelta}, `
      + `local readiness gap ${sf.risk.localReadiness} (5 = least ready)`,
    '',
    `TASK CHANGE: ${r.tasksRemoved} removed · ${r.tasksChanged} changed · ${r.tasksNew} new · FTE delta ${r.fteDelta} per site`,
    '',
    'BEFORE:', ...(p.before || []).map((b) => '  - ' + b),
    'AFTER — with ERP:', ...(p.after || []).map((b) => '  - ' + b),
    '',
    'CONSTRAINTS ON THIS POPULATION:', ...((p.constraints || []).length ? p.constraints.map((c) => '  - ' + c) : ['  - (none recorded)']),
  ];
  if ((p.modifiers || []).length) {
    lines.push('', 'ACTIVE MODIFIERS (already triggered by the rules engine — reflect them):', ...p.modifiers.map((m) => '  - ' + m));
  }
  const dv = p.delivery;
  if (dv) {
    const t = dv.training || {};
    const prim = t.primary || {};
    lines.push(
      '',
      'DELIVERY STANDARDS (from Aberdeen OCM delivery material, already resolved for this role — use verbatim):',
      `  Training method: ${prim.method} · duration ${prim.duration} · selected for ${t.why} · ${t.trainTheTrainer ? 'train-the-trainer delivered' : 'self-driven'}`,
      `  Job aids: ${t.aids && t.aids.count} (${t.aids && t.aids.band} band, range ${t.aids && t.aids.range}) · ${t.jobAidMethod && t.jobAidMethod.duration} each`,
      '  Communications milestones, in order, each with its objective and this population\'s channel:',
      ...(dv.commsMilestones || []).map((m) => `    - ${m.name} — ${m.objective} · ${m.channel}`),
      `  Objective ladder: ${(dv.objectiveLadder || []).join(' -> ')}`,
      `  Support escalation after go-live: ${(dv.supportLayers || []).join(' -> ')}`,
      `  Readiness reassessed every ${dv.cadence && dv.cadence.readinessReassessMonths} months; adoption measured across the `
        + `${dv.cadence && dv.cadence.adoptionWindowMonths}-month window after go-live`,
      `  Adoption metrics: ${(dv.adoptionMetrics || []).join(', ')}`
    );
  }
  lines.push(
    '',
    'Write the four sections: the role redesign narrative, the training curriculum, the comms message for this population,',
    'and the adoption actions. Ground every one of them in the specifics above.'
  );
  return lines.join('\n');
}

/* ----------------------------------------------------------- fallback text */
/* Mirrors the client-side template generator so the two never disagree in
   shape. Deliberately deterministic: same input, same output, every time.    */

function fallback(p) {
  const r = p.role || {};
  const d = p.doses || {};
  const sf = p.subFactors || { impact: {}, risk: {} };
  const dv = p.delivery || {};
  const t = dv.training || {};
  const prim = t.primary || { method: 'Instructor-led', duration: '1-4 hrs' };
  const aids = t.aids || { count: d.jobAids || 2, band: 'medium impact', range: '5-9' };
  const aidMethod = t.jobAidMethod || { method: 'Job aids', duration: '1-30 min' };
  const cadence = dv.cadence || { readinessReassessMonths: '3-4', adoptionWindowMonths: 6 };
  const supportLayers = dv.supportLayers
    || ['Job aids at the point of work', 'Project team', 'Trainers and implementation leads', 'Leadership — final escalation'];
  const adoptionMetrics = dv.adoptionMetrics
    || ['unique sign-ons', 'business processes opened and completed', 'job-aid access rates',
        'go-live communication click rates', 'HR case volume', 'qualitative feedback'];
  const deskless = !!r.deskless;
  const drShift = Number(sf.risk && sf.risk.decisionRights) >= 4;
  const tier = p.tier;
  const site = r.siteCount > 1 ? `${r.siteCount} sites` : 'a single site';
  const num = (v, dp) => (typeof v === 'number' ? v.toFixed(dp === undefined ? 1 : dp) : String(v));

  const narrative = [
    `${r.name} sits in ${r.valueStream} across ${site}, covering ${Number(r.headcount || 0).toLocaleString()} people. `
      + `The assessment scores it ${num(p.axisScores && p.axisScores.impact)} on impact severity and `
      + `${num(p.axisScores && p.axisScores.risk)} on adoption risk, placing it in ${tier}. `
      + `${r.tasksRemoved} tasks leave the role, ${r.tasksChanged} change shape and ${r.tasksNew} are new, `
      + `an FTE delta of ${r.fteDelta > 0 ? '+' : ''}${r.fteDelta} per site.`,
    drShift
      ? `The load-bearing change is not the screen. Decision rights score ${num(sf.risk.decisionRights)}: authority this role `
        + `exercised on judgement now sits with configured system rules, and the role moves from deciding to validating and `
        + `clearing exceptions. That is where the resistance will come from, and it is a management conversation before it is a training one.`
      : `Decision rights move only modestly (${num(sf.risk.decisionRights)}), so the redesign changes the method rather than the `
        + `authority. The role keeps what it approves; the mechanism it approves through is what changes.`,
    deskless
      ? `The population is deskless. Capability delta is ${num(sf.risk.capabilityDelta)} against local readiness `
        + `${num(sf.risk.localReadiness)}, so the binding constraint is reach, not aptitude: any intervention that assumes a desk, `
        + `a screen or an inbox will not land here.`
      : `Capability delta is ${num(sf.risk.capabilityDelta)} against local readiness ${num(sf.risk.localReadiness)}. The population `
        + `can absorb the change; the plan has to give it the sequence and the time to do so.`,
  ].join('\n\n');

  const curriculum = [];
  if (tier === 'Rebuild' || tier === 'Enable') {
    curriculum.push({
      module: `${r.name}: the work after go-live`,
      format: `${prim.method}${deskless ? ' — on-shift, at the line' : ', role cohort'}`
        + `${t.complexity ? ` · ${t.complexity} complexity` : ''}`,
      duration: prim.duration,
      objective: `Walk the ${r.tasksChanged} changed and ${r.tasksNew} new tasks end to end, and name the ${r.tasksRemoved} that disappear.`,
    });
    curriculum.push({
      module: 'Exception handling in the sandbox',
      format: `${d.sandboxDays}-day sandbox, live data copy`,
      duration: `${(d.sandboxDays || 1) * (deskless ? 2 : 6)}h`,
      objective: 'Clear a full week of realistic exceptions unaided, to the standard the role will be held to.',
    });
  } else {
    curriculum.push({
      module: `What changes for ${r.name} — and what does not`,
      format: `${prim.method}${deskless ? ' — shift huddle, one page plus QR code' : ''}`,
      duration: prim.duration,
      objective: 'Set an accurate expectation of the day-one experience so the change is not over-read.',
    });
  }
  if (drShift) {
    curriculum.push({
      module: 'Working inside the rules: what the system decides now',
      format: 'Manager-led, role plus line manager together',
      duration: '90m',
      objective: 'Practise the escalation path when the system blocks something the role would previously have released.',
    });
  }
  if (aids.count > 0) {
    curriculum.push({
      module: `${aids.count} job aids at the point of work`,
      format: `${aidMethod.method}${deskless ? ' — laminated, local language, at the line' : ' — one-page desk aids'}`
        + ` · ${aids.band} band (${aids.range})`,
      duration: aidMethod.duration,
      objective: 'Carry the transactions the role performs least often, where recall fails first.',
    });
  }

  const channels = deskless
    ? ['Shift huddle brief', 'QR code on the huddle board', 'Line-side poster in local language']
    : ['Manager cascade', 'Team meeting', 'Email'];

  const comms = {
    headline: drShift
      ? `${r.name}: the system takes the decision, you take the exception`
      : tier === 'Reassure'
        ? `${r.name}: less changes for you than you have been told`
        : `${r.name}: what your day looks like after go-live`,
    message: drShift
      ? `From go-live you stop making this call one item at a time. The system applies the rule and holds anything it cannot `
        + `clear; your job is the exception queue and the judgement calls that reach it. You are not losing the decision — you `
        + `are being handed the ones that actually need a person. Your manager will walk you through what releases automatically `
        + `and what still comes to you, before go-live and not on the day.`
      : tier === 'Inform'
        ? `The platform behind your day changes at go-live. Your tasks, your cadence and your authority do not. You will see a `
          + `different screen in places and the same work behind it. If something looks wrong, raise it the way you raise anything else.`
        : `${r.tasksChanged} parts of your day change, ${r.tasksRemoved} disappear and ${r.tasksNew} are new. Training is `
          + `${String(prim.method).toLowerCase()}, ${prim.duration}, built from that list and not from a menu of system modules, `
          + `with ${aids.count} job aids at the point of work. `
          + `${deskless ? 'Everything reaches you at the line, on shift.' : 'Your manager will confirm your dates.'}`,
    milestones: dv.commsMilestones || [],
    channels,
  };

  const adoptionActions = [];
  if (tier === 'Rebuild') {
    adoptionActions.push({ action: `Name ${d.superUsersPerSite} super-user per site (${r.siteCount}) from the role itself, not from IT`, owner: 'Site lead', timing: 'Go-live minus 6 weeks' });
    adoptionActions.push({ action: 'Validate the redesigned task list with site leadership — 90 minutes per site', owner: 'Change lead', timing: 'Go-live minus 5 weeks' });
    adoptionActions.push({ action: `${d.floorCoachingWeeks} weeks of floor coaching, present on the shift the role actually works`, owner: 'Site change coach', timing: `Go-live to +${d.floorCoachingWeeks} weeks` });
  } else if (tier === 'Enable') {
    adoptionActions.push({ action: `Recruit ${Math.max(1, Math.ceil((r.headcount || 1) / (d.superUserRatio || 40)))} champions from the strongest performers and give them the sandbox first`, owner: 'Function lead', timing: 'Go-live minus 4 weeks' });
    adoptionActions.push({ action: 'Hold a peer-led drop-in clinic in the first two weeks after go-live', owner: 'Champions', timing: 'Go-live +1 to +2 weeks' });
  } else if (tier === 'Reassure') {
    adoptionActions.push({ action: `Run the manager cascade with ${d.cascadeScripts} scripts — address the fear, not the skill`, owner: 'Line manager', timing: 'Go-live minus 3 weeks' });
    adoptionActions.push({ action: 'Publish a plain answer to "why is this different from the last attempt"', owner: 'Change lead', timing: 'Go-live minus 3 weeks' });
  } else {
    adoptionActions.push({ action: `Include in the ${d.broadcasts || 3} programme broadcasts; no role-specific effort`, owner: 'Comms lead', timing: 'Go-live minus 4, minus 1, plus 1 weeks' });
  }
  if (drShift) {
    adoptionActions.push({ action: 'Brief the accountable supervisor line on the decision-rights shift, using the cascade script', owner: 'Line manager', timing: 'Go-live minus 2 weeks' });
  }
  if (deskless) {
    adoptionActions.push({ action: 'Confirm every shift pattern is covered by an on-shift session — including nights', owner: 'Site lead', timing: 'Go-live minus 2 weeks' });
  }
  adoptionActions.push({ action: `Publish the four-layer support escalation for this role — ${supportLayers.join(' → ').toLowerCase()}`, owner: 'Change lead', timing: 'Go-live minus 1 week' });
  // Hypercare is the floor deliverable in every tier, not a Rebuild extra —
  // Aberdeen's lowest-ambition tier is training, go-live comms and hypercare.
  const hw = d.hypercareWeeks || 1;
  adoptionActions.push({ action: `Staff ${hw} week${hw === 1 ? '' : 's'} of hypercare for this role — the floor every tier gets, scaled to this one`, owner: 'Change lead', timing: `Go-live to +${hw} week${hw === 1 ? '' : 's'}` });
  adoptionActions.push({ action: `Re-score this role at ${d.rescoreDays || 30}-day intervals; the dashboard is the go-live gate`, owner: 'Change lead', timing: `Every ${d.rescoreDays || 30} days` });
  adoptionActions.push({ action: 'Reassess site readiness for this role on the standing cadence', owner: 'Site lead', timing: `Every ${cadence.readinessReassessMonths} months` });
  adoptionActions.push({ action: `Measure adoption on ${adoptionMetrics.join(', ')}`, owner: 'Change lead', timing: `Across the ${cadence.adoptionWindowMonths}-month window after go-live` });

  return { narrative, curriculum, comms, adoptionActions };
}

/* --------------------------------------------------------------- anthropic */

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
        max_tokens: 3000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt(payload) }],
        // Determinism / low variance comes from the JSON schema and the prompt.
        // NOTE: temperature / top_p / top_k are rejected with a 400 on
        // claude-sonnet-5 — do not add them back.
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
    if (typeof parsed.narrative !== 'string' || !Array.isArray(parsed.curriculum)
        || !parsed.comms || !Array.isArray(parsed.adoptionActions)) {
      throw new Error('unexpected shape');
    }
    return { data: parsed, model: msg.model || MODEL };
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------------------------------------------------------- handler */

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
  if (!payload || !payload.role || !payload.tier) {
    res.statusCode = 400;
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify({ error: 'expected { role, tier, axisScores, subFactors, before, after, constraints }' }));
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  res.setHeader('content-type', 'application/json');

  if (apiKey) {
    try {
      const { data, model } = await callAnthropic(payload, apiKey);
      res.statusCode = 200;
      return res.end(JSON.stringify({ ...data, source: 'anthropic', model }));
    } catch (err) {
      // Never surface an error to the stage. Fall through to the template.
      console.error('[generate] anthropic call failed, serving fallback:', err && err.message);
      res.statusCode = 200;
      return res.end(JSON.stringify({ ...fallback(payload), source: 'fallback', reason: 'api_error' }));
    }
  }

  res.statusCode = 200;
  return res.end(JSON.stringify({ ...fallback(payload), source: 'fallback', reason: 'no_api_key' }));
};
