/**
 * Second suite — covers the refinement pass only. verify.js (the original 25
 * checks) must keep passing unchanged; this file adds the new guarantees:
 * provenance wording, weights-are-ours labelling, inclusive threshold, unit of
 * analysis, completeness gating, weight-slider safety at the extremes, and the
 * Aberdeen-derived delivery content.
 */
const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://127.0.0.1:8123/';
const path = require('path');

/* Repo root, resolved from this file's location: tools/verify -> repo root. */
const ROOT = path.resolve(__dirname, '..', '..');
const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'roles.json'), 'utf8'));
const DATA = Array.isArray(doc) ? doc : doc.roles;
const N = DATA.length;
const TOTAL = DATA.reduce((s, r) => s + r.headcount, 0);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    const t = m.text();
    if (m.type() === 'error' && !/Failed to load resource: net::ERR/.test(t)) errors.push('console.error: ' + t);
  });

  const step = async (name, fn) => {
    try { await fn(); console.log('PASS  ' + name); }
    catch (e) { console.log('FAIL  ' + name + ' — ' + e.message); errors.push('step "' + name + '": ' + e.message); }
  };
  const bodyText = () => page.evaluate(() => document.body.innerText);
  const has = (hay, needle, label) => {
    if (!hay.toLowerCase().includes(needle.toLowerCase())) throw new Error('missing ' + (label || '"' + needle + '"'));
  };

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('.app');
  await page.waitForFunction(() => document.querySelectorAll('.pt').length > 0, { timeout: 15000 });

  /* ---- provenance + labelling on the portfolio ------------------------- */
  await step('portfolio states the unit of analysis is role × process × site, and that it is our choice', async () => {
    const t = await bodyText();
    has(t, 'one role scoped to one value stream and one site archetype');
    has(t, 'role × process × site');
    if (!/slides 5 and 13/.test(t) || !/slides 9 and 10/.test(t)) throw new Error('does not say where the deck is ambiguous');
  });
  await step('weights are labelled ours and tunable, and nothing cites the deck as their source', async () => {
    const t = await bodyText();
    has(t, 'The six sub-factor weights are ours');
    has(t, 'states no weights and no aggregation method');
    const bad = t.match(/weight[^.]{0,60}(from the deck|deck says|per the deck|slide \d+)/i);
    if (bad) throw new Error('weights attributed to the deck: "' + bad[0] + '"');
  });
  await step('threshold is stated inclusive, and 3.5 is sourced to the sponsor-assessment “good” floor', async () => {
    const t = await bodyText();
    has(t, 'inclusive');
    has(t, 'exactly 3.5 counts as above the line');
    has(t, 'floor used in the sponsor competency assessment');
    has(t, '70 of 100');
    if (!/not the midpoint of the 1–5 scale/.test(t)) throw new Error('does not deny the midpoint reading');
  });
  await step('tier → tactic mapping and the 1:15 ratio are attributed honestly', async () => {
    const t = await bodyText();
    has(t, 'the tier → tactic mapping is OURS');
    has(t, 'contains no tier-to-tactic mapping');
    has(t, '1:15 super-user ratio comes from Team 2’s own deck');
    has(t, 'Aberdeen’s material states no ratio');
  });
  await step('the dataset is declared synthetic beyond the 7 roles the deck names', async () => {
    has(await bodyText(), 'deck names 7 of the 38 roles');
  });

  /* ---- weight sliders: safety at the extremes -------------------------- */
  const tierCounts = () => page.evaluate(() => {
    const out = {};
    document.querySelectorAll('.tier-tile').forEach((el) => {
      const name = el.querySelector('.tier-name').innerText.trim();
      const rows = [...el.querySelectorAll('.row')].map((r) => r.innerText.replace(/\n/g, ' '));
      out[name] = { people: Number((rows[1] || '').replace(/[^\d]/g, '')), text: rows.join(' | ') };
    });
    return out;
  });
  const scoresOf = (role) => page.evaluate((r) => {
    const row = [...document.querySelectorAll('table.data tbody tr')]
      .find((tr) => tr.children[0].innerText.trim().startsWith(r));
    if (!row) return null;
    return { impact: row.children[5].innerText.trim(), risk: row.children[6].innerText.trim(), tier: row.children[7].innerText.trim() };
  }, role);
  const setW = async (label, v) => { await page.locator(`input[aria-label="Weight: ${label}"]`).fill(String(v)); };
  const sane = (o, where) => {
    ['impact', 'risk'].forEach((k) => {
      const n = Number(o[k]);
      if (!isFinite(n)) throw new Error(`${where}: ${k} is "${o[k]}" — not a number`);
      if (n < 1 || n > 5) throw new Error(`${where}: ${k}=${n} off the 1-5 scale`);
    });
    if (!['Rebuild', 'Enable', 'Reassure', 'Inform'].includes(o.tier)) throw new Error(where + ': tier "' + o.tier + '"');
  };

  await step('weight tuner opens and is labelled as our default', async () => {
    await page.locator('.tuner > summary').click();
    await page.waitForSelector('.wt-row input[type="range"]', { state: 'visible' });
    const s = await page.locator('.tuner > summary').innerText();
    if (!/ours/i.test(s)) throw new Error(s);
    const n = await page.locator('.wt-row input[type="range"]').count();
    if (n !== 6) throw new Error('expected 6 weight sliders, got ' + n);
  });

  let base = {};
  await step('baseline: the two rows nearest the line score as the deck has them', async () => {
    base.cs = await scoresOf('Customer Service - Order Entry');
    base.pb = await scoresOf('Plant Buyer');
    if (!base.cs || !base.pb) throw new Error('rows not found');
    if (base.cs.impact !== '4.5' || base.cs.risk !== '3.9') throw new Error('Customer Service ' + JSON.stringify(base.cs));
    if (base.pb.impact !== '3.8' || base.pb.risk !== '4.2') throw new Error('Plant Buyer ' + JSON.stringify(base.pb));
    console.log('        Customer Service - Order Entry ' + base.cs.impact + '/' + base.cs.risk + ' ' + base.cs.tier
      + ' · Plant Buyer ' + base.pb.impact + '/' + base.pb.risk + ' ' + base.pb.tier);
  });

  await step('one impact weight at 1.00 and the rest at 0 moves Plant Buyer over the line without breaking anything', async () => {
    await setW('Share of daily tasks changing', 0);
    await setW('Frequency and volume of the task', 0);
    await setW('Consequence of error', 1);
    await page.waitForTimeout(150);
    const pb = await scoresOf('Plant Buyer');
    sane(pb, 'Plant Buyer at extreme impact weighting');
    if (pb.impact !== '3.3') throw new Error('expected impact 3.3 (its own errorConsequence), got ' + pb.impact);
    if (pb.tier === base.pb.tier) throw new Error('tier did not react: still ' + pb.tier);
    const pts = await page.locator('.pt').count();
    if (pts !== N) throw new Error('heat map lost points: ' + pts);
    console.log('        Plant Buyer ' + base.pb.impact + '→' + pb.impact + ' · ' + base.pb.tier + ' → ' + pb.tier);
  });

  await step('risk weighting cannot push Customer Service - Order Entry off its own sub-factor range', async () => {
    for (const [l, v] of [['Change in decision rights', 1], ['Capability delta', 0], ['Local readiness gap', 0]]) await setW(l, v);
    await page.waitForTimeout(120);
    const hi = await scoresOf('Customer Service - Order Entry');
    sane(hi, 'Customer Service, all weight on decision rights');
    if (hi.risk !== '4.0') throw new Error('expected 4.0, got ' + hi.risk);
    for (const [l, v] of [['Change in decision rights', 0], ['Capability delta', 0], ['Local readiness gap', 1]]) await setW(l, v);
    await page.waitForTimeout(120);
    const lo = await scoresOf('Customer Service - Order Entry');
    sane(lo, 'Customer Service, all weight on local readiness');
    if (lo.risk !== '3.6') throw new Error('expected 3.6, got ' + lo.risk);
    if (Number(lo.risk) < 3.5) throw new Error('a convex weighting produced a score outside [3.6, 4.0]');
    console.log('        Customer Service risk stays inside its sub-factor range: ' + lo.risk + ' – ' + hi.risk);
  });

  await step('every weight dragged to zero degrades to an equal split — no NaN, no empty population', async () => {
    for (const l of ['Share of daily tasks changing', 'Frequency and volume of the task', 'Consequence of error',
      'Change in decision rights', 'Capability delta', 'Local readiness gap']) await setW(l, 0);
    await page.waitForTimeout(180);
    const pb = await scoresOf('Plant Buyer');
    sane(pb, 'all weights zero');
    // equal split of 3.9 / 4.2 / 3.3 = 3.8
    if (pb.impact !== '3.8') throw new Error('expected the equal-split 3.8, got ' + pb.impact);
    const counts = await tierCounts();
    const people = Object.values(counts).reduce((s, c) => s + c.people, 0);
    if (people !== TOTAL) throw new Error('tier tiles total ' + people + ' people, expected ' + TOTAL);
    const rows = await page.locator('table.data tbody tr').count();
    if (rows !== N) throw new Error('table rows ' + rows);
    const t = await bodyText();
    if (/NaN|undefined|Infinity/.test(t)) throw new Error('page text contains NaN/undefined/Infinity');
    console.log('        four tiers still account for all ' + people.toLocaleString() + ' people');
  });

  await step('one weight at maximum on both axes leaves the quadrant readable', async () => {
    await setW('Share of daily tasks changing', 1);
    await setW('Change in decision rights', 1);
    await page.waitForTimeout(150);
    const counts = await tierCounts();
    if (Object.keys(counts).length !== 4) throw new Error('tier tiles: ' + JSON.stringify(counts));
    Object.entries(counts).forEach(([k, v]) => { if (!/of population/i.test(v.text)) throw new Error(k + ': ' + v.text); });
    const people = Object.values(counts).reduce((s, c) => s + c.people, 0);
    if (people !== TOTAL) throw new Error('people ' + people);
    if (/NaN/.test(await bodyText())) throw new Error('NaN on screen');
  });

  await step('reset returns the six weights to our default', async () => {
    await page.locator('.tuner button', { hasText: 'Reset to our defaults' }).click();
    await page.waitForTimeout(150);
    const pb = await scoresOf('Plant Buyer');
    const cs = await scoresOf('Customer Service - Order Entry');
    if (pb.impact !== base.pb.impact || pb.risk !== base.pb.risk) throw new Error('Plant Buyer ' + JSON.stringify(pb));
    if (cs.impact !== base.cs.impact || cs.risk !== base.cs.risk) throw new Error('Customer Service ' + JSON.stringify(cs));
    const dis = await page.locator('.tuner button', { hasText: 'Reset to our defaults' }).isDisabled();
    if (!dis) throw new Error('reset button should be disabled once weights are back to default');
  });

  /* ---- completeness gating in the add-a-role form ---------------------- */
  await step('a half-filled add-a-role form reads incomplete: no score, no tier, submit disabled', async () => {
    await page.locator('.tab', { hasText: 'Add a role' }).click();
    await page.waitForSelector('#a-role');
    const big = await page.locator('.live-score .big').allInnerTexts();
    if (big.join('') !== '——') throw new Error('scores shown before any sub-factor is set: ' + big.join(','));
    const tier = await page.locator('.live-score .tierline .t').innerText();
    if (tier !== 'incomplete') throw new Error('tier reads "' + tier + '"');
    if (!(await page.locator('button', { hasText: 'Score it and open the one-pager' }).isDisabled()))
      throw new Error('submit is enabled on an unscored row');
    await page.locator('input[aria-label="Share of daily tasks changing"]').fill('4');
    await page.locator('input[aria-label="Frequency and volume of the task"]').fill('4');
    await page.locator('input[aria-label="Consequence of error"]').fill('3.4');
    await page.locator('input[aria-label="Change in decision rights"]').fill('4.4');
    await page.locator('input[aria-label="Capability delta"]').fill('4');
    await page.waitForTimeout(120);
    const lab = await page.locator('.live-score .lab').innerText();
    if (!/incomplete — 5 of 6/i.test(lab)) throw new Error('with five of six set the panel says "' + lab + '"');
    if ((await page.locator('.live-score .big').allInnerTexts()).join('') !== '——')
      throw new Error('five of six sub-factors produced a score');
    await page.locator('input[aria-label="Local readiness gap"]').fill('4.2');
    await page.waitForTimeout(120);
    const done = await page.locator('.live-score .big').allInnerTexts();
    if (done[0] !== '3.8' || done[1] !== '4.2') throw new Error('completed scores ' + done.join('/'));
    if (await page.locator('.live-score .tierline .t').innerText() !== 'Rebuild') throw new Error('tier after completion');
    if (await page.locator('button', { hasText: 'Score it and open the one-pager' }).isDisabled())
      throw new Error('submit still disabled with all six set');
    console.log('        5 of 6 → incomplete · 6 of 6 → 3.8 / 4.2 Rebuild');
  });

  /* ---- Aberdeen-derived delivery content on a one-pager ---------------- */
  await step('the one-pager package cites a real method, duration and job-aid band', async () => {
    await page.locator('.tab', { hasText: 'Portfolio' }).click();
    await page.waitForSelector('.pt');
    await page.locator('.pt[aria-label*="Plant Scheduler"]').click();
    await page.waitForSelector('.op-head h2');
    const t = await page.locator('.card', { hasText: 'Prescribed intervention' }).innerText();
    if (!/Instructor-led/.test(t)) throw new Error('no training method named');
    if (!/1-4 hrs/.test(t)) throw new Error('no duration from the method table');
    if (!/high complexity/.test(t)) throw new Error('complexity not stated');
    if (!/job aids/i.test(t) || !/high impact band|impact band/i.test(t)) throw new Error('job-aid band not stated');
    if (!/train-the-trainer/.test(t)) throw new Error('delivery route not stated');
  });
  await step('the five comms milestones each carry their objective', async () => {
    const t = await page.locator('.pkg-extra', { hasText: 'five milestones' }).innerText();
    for (const [m, o] of [['Kick-Off', 'promote awareness'], ['Cutover News', 'set expectations'],
      ['Training Awareness', 'provide resources'], ['Go-Live', 'drive adoption'], ['Post Go-Live Support', 'reinforce changes']]) {
      if (!t.includes(m)) throw new Error('missing milestone ' + m);
      if (!t.includes(o)) throw new Error('missing objective for ' + m + ': ' + o);
    }
    if (!/awareness → understanding → acceptance → commitment/.test(t)) throw new Error('objective ladder missing');
  });
  await step('four-layer support escalation and the measurement window are on the page', async () => {
    const esc = await page.locator('.pkg-extra', { hasText: 'four-layer escalation' }).innerText();
    for (const l of ['Job aids at the point of work', 'Project team', 'Trainers and implementation leads', 'Leadership'])
      if (!esc.includes(l)) throw new Error('escalation layer missing: ' + l);
    const meas = await page.locator('.pkg-extra', { hasText: 'Measurement' }).innerText();
    if (!/3-4 months/.test(meas)) throw new Error('readiness reassessment cadence missing');
    if (!/6-month window/.test(meas)) throw new Error('six-month adoption window missing');
    for (const m of ['unique sign-ons', 'job-aid access rates', 'HR case volume'])
      if (!meas.includes(m)) throw new Error('adoption metric missing: ' + m);
  });
  await step('the two modifier blocks are still exactly the two modifiers', async () => {
    await page.locator('.tab', { hasText: 'Portfolio' }).click();
    await page.locator('.pt[aria-label*="Warehouse Team Lead"]').click();
    await page.waitForSelector('.op-head h2');
    const mods = await page.locator('.mod h5').allInnerTexts();
    if (mods.length !== 2) throw new Error('mods: ' + mods.join(' | '));
  });
  await step('generated content cites the method and duration, and the milestones, not generic advice', async () => {
    await page.locator('.card-head button', { hasText: 'Generate' }).click();
    await page.waitForSelector('.gen-sec .msg', { timeout: 30000 });
    const cur = await page.locator('.gen-sec', { hasText: 'Training curriculum' }).innerText();
    if (!/Nano-learning/.test(cur)) throw new Error('deskless role did not get the nano-learning method: ' + cur.slice(0, 200));
    if (!/1-5 min/.test(cur)) throw new Error('no duration in the curriculum');
    if (!/Job aids/.test(cur) || !/1-30 min/.test(cur)) throw new Error('job aids missing their method/duration');
    const msg = await page.locator('.gen-sec .msg').innerText();
    for (const m of ['Kick-Off', 'Go-Live', 'Post Go-Live Support']) if (!msg.includes(m)) throw new Error('comms milestone missing: ' + m);
    if (/email/i.test(msg)) throw new Error('deskless role was given an email channel: ' + msg);
    const ad = await page.locator('.gen-sec', { hasText: 'Adoption actions' }).innerText();
    if (!/escalation/i.test(ad)) throw new Error('adoption actions do not mention the escalation');
    if (!/6-month window/.test(ad)) throw new Error('adoption actions do not mention the six-month window');
  });
  await step('the copied one-pager carries the delivery detail and the provenance', async () => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.locator('button', { hasText: 'Copy one-pager' }).click();
    await page.waitForTimeout(300);
    const txt = await page.evaluate(() => navigator.clipboard.readText());
    const want = ['DELIVERY DETAIL', 'Nano-learning', 'Kick-Off — promote awareness', 'Support escalation',
      'readiness reassessed every 3-4 months', '6-month window', 'Weights are ours', 'inclusive'];
    want.forEach((s) => { if (!txt.includes(s)) throw new Error('clipboard text missing "' + s + '"'); });
  });

  /* ---- costed plan: the delivery standards card ------------------------ */
  await step('the costed plan prints the Aberdeen delivery standards it draws on', async () => {
    await page.locator('.tab', { hasText: 'Costed plan' }).click();
    await page.waitForTimeout(400);
    const t = await page.locator('.card', { hasText: 'Delivery standards' }).innerText();
    [['Instructor-led', '1-4 hrs'], ['Virtual instructor-led', '0.5-1.5 hrs'], ['Web-based', '15-90 min'],
      ['Nano-learning', '1-5 min'], ['Job aids', '1-30 min']].forEach((pair) => {
      if (!t.includes(pair[0]) || !t.includes(pair[1])) throw new Error('method table row missing: ' + pair.join(' '));
    });
    for (const b of ['low impact', 'medium impact', 'high impact']) if (!t.includes(b)) throw new Error('job-aid band missing: ' + b);
    if (!/5-9 aids/.test(t) || !/6-9 aids/.test(t) || !/2 aids/.test(t)) throw new Error('job-aid ranges missing');
    if (!/every 3-4 months/.test(t)) throw new Error('readiness cadence missing');
    if (!/6 months post go-live/.test(t)) throw new Error('adoption window missing');
    if (!/mapping is OURS/.test(t)) throw new Error('mapping provenance missing from the standards card');
  });

  await browser.close();
  console.log('\n--- real console/page errors: ' + errors.length + ' ---');
  errors.forEach((e) => console.log('  ' + e));
  process.exit(errors.length ? 1 : 0);
})();
