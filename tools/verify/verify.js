const { chromium } = require('playwright');
const fs = require('fs');

const path = require('path');

/* Repo root, resolved from this file's location: tools/verify -> repo root. */
const ROOT = path.resolve(__dirname, '..', '..');
/* Screenshots land in tools/verify/shots (git-ignored); override with SHOTS=... */
const SHOTS = process.env.SHOTS || path.join(__dirname, 'shots');
const BASE = 'http://127.0.0.1:8123/';

// Expectations are derived from the installed dataset, not hardcoded, so this
// suite stays valid whichever roles.json ships.
const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'roles.json'), 'utf8'));
const DATA = Array.isArray(doc) ? doc : doc.roles;
const r1 = (n) => Math.round(n * 10) / 10;
const imp = (f) => r1(0.45 * f.taskShare + 0.25 * f.frequencyVolume + 0.30 * f.errorConsequence);
const rsk = (f) => r1(0.40 * f.decisionRights + 0.35 * f.capabilityDelta + 0.25 * f.localReadiness);
const tierOf = (r) => { const i = imp(r.impact), k = rsk(r.risk);
  return i >= 3.5 ? (k >= 3.5 ? 'Rebuild' : 'Enable') : (k >= 3.5 ? 'Reassure' : 'Inform'); };
const N = DATA.length;
const O2C = DATA.filter((r) => r.valueStream === 'Order-to-Cash').length;
const BIGGEST = DATA.reduce((a, b) => (a.headcount > b.headcount ? a : b)).role;
const REBUILD_HEADS = DATA.filter((r) => tierOf(r) === 'Rebuild').reduce((s, r) => s + r.headcount, 0);
const EXP_SUPERUSERS = Math.ceil(REBUILD_HEADS / 15);
const EXP_SEATS = Math.ceil(REBUILD_HEADS / 10);
// a Rebuild role that is deskless AND has a decision-rights shift, for the modifier test
const MOD_ROLE = DATA.find((r) => tierOf(r) === 'Rebuild' && r.deskless && r.risk.decisionRights >= 4);
console.log(`dataset: ${N} roles · ${DATA.reduce((s, r) => s + r.headcount, 0).toLocaleString()} people`
  + ` · Rebuild heads ${REBUILD_HEADS} · modifier role "${MOD_ROLE && MOD_ROLE.role}"`);

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });

  const errors = [];
  const warnings = [];
  const cdnBlocked = [];
  page.on('console', (m) => {
    const t = m.text();
    if (m.type() === 'error') {
      // Chromium logs a bare "Failed to load resource: net::ERR_*" for each blocked
      // <script src="https://cdn..."> — expected here, the egress policy blocks CDNs.
      if (/Failed to load resource: net::ERR/.test(t)) { cdnBlocked.push(t); return; }
      errors.push('console.error: ' + t);
    } else if (m.type() === 'warning') warnings.push('console.warn: ' + t);
  });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  const apiCalls = [];
  page.on('response', async (r) => {
    if (!/\/api\/generate$/.test(new URL(r.url()).pathname)) return;
    let body = null;
    try { body = await r.json(); } catch (e) { /* ignore */ }
    apiCalls.push({ status: r.status(), source: body && body.source, reason: body && body.reason });
  });
  page.on('requestfailed', (r) => {
    const u = r.url();
    // CDN is blocked by egress policy in this sandbox; the vendored fallback covers it.
    if (/unpkg\.com|jsdelivr\.net|cdnjs/.test(u)) return;
    errors.push('requestfailed: ' + u + ' — ' + (r.failure() && r.failure().errorText));
  });

  const step = async (name, fn) => {
    try { await fn(); console.log('PASS  ' + name); }
    catch (e) { console.log('FAIL  ' + name + ' — ' + e.message); errors.push('step "' + name + '": ' + e.message); }
  };

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('.app', { timeout: 15000 });
  await page.waitForFunction(() => document.querySelectorAll('.pt').length > 0, { timeout: 15000 });

  // ---- 1. portfolio -------------------------------------------------------
  await step(`heat map draws all ${N} points`, async () => {
    const n = await page.locator('.pt').count();
    if (n !== N) throw new Error('expected ' + N + ' points, got ' + n);
  });
  await step('data loaded from data/roles.json (not the embedded seed)', async () => {
    const t = await page.locator('.topbar .sub').innerText();
    if (!t.includes('data/roles.json')) throw new Error('source = ' + t);
  });
  await step('four quadrants labelled', async () => {
    const labels = (await page.locator('.quad-label').allTextContents()).map((s) => s.toLowerCase());
    for (const t of ['rebuild', 'enable', 'reassure', 'inform'])
      if (!labels.includes(t)) throw new Error('missing quadrant ' + t + ' — got ' + labels.join(','));
  });
  await step('tier tiles show population and budget share', async () => {
    const txt = await page.locator('.tier-tile').first().innerText();
    if (!/share of change budget/i.test(txt)) throw new Error(txt);
  });
  await step('concentration banner computes', async () => {
    const t = await page.locator('.banner').first().innerText();
    if (!/of the population absorbs \d+% of the effort/i.test(t)) throw new Error(t);
    console.log('        banner: ' + t.split('\n')[0]);
  });
  await step(`table has ${N} rows and sorts`, async () => {
    let n = await page.locator('table.data tbody tr').count();
    if (n !== N) throw new Error('rows=' + n);
    await page.locator('table.data th', { hasText: 'People' }).click();
    const first = (await page.locator('table.data tbody tr td').first().innerText()).trim();
    if (!first.startsWith(BIGGEST)) throw new Error('sort by People desc gave "' + first + '", expected ' + BIGGEST);
  });
  await step('value-stream filter narrows the map', async () => {
    await page.selectOption('#f-vs', 'Order-to-Cash');
    await page.waitForTimeout(120);
    const n = await page.locator('.pt').count();
    if (n !== O2C) throw new Error('expected ' + O2C + ' Order-to-Cash roles, got ' + n);
    await page.selectOption('#f-vs', 'All');
    await page.waitForTimeout(120);
  });
  await step('hover tooltip appears', async () => {
    await page.locator('.pt').first().hover();
    await page.waitForSelector('.tip', { timeout: 3000 });
    await page.mouse.move(5, 5);
  });

  await page.locator('table.data th', { hasText: 'Impact' }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: SHOTS + '/01-portfolio-heatmap.png', fullPage: true });

  // ---- 2. one-pager -------------------------------------------------------
  await step('clicking a heat-map point opens its one-pager', async () => {
    await page.locator(`.pt[aria-label*="${MOD_ROLE.role}"]`).click();
    await page.waitForSelector('.op-head h2', { timeout: 5000 });
    const h = await page.locator('.op-head h2').innerText();
    if (!h.includes(MOD_ROLE.role)) throw new Error('opened ' + h);
  });
  await step('sub-factor arithmetic is shown and sums correctly', async () => {
    const t = (await page.locator('.sf-total').first().innerText()).replace(/\s+/g, ' ');
    const f = MOD_ROLE.impact;
    const want = `0.45×${f.taskShare.toFixed(1)} + 0.25×${f.frequencyVolume.toFixed(1)} + 0.30×${f.errorConsequence.toFixed(1)}`;
    if (!t.includes(want)) throw new Error('impact breakdown "' + t + '" lacks "' + want + '"');
    if (!t.includes('= ' + imp(f).toFixed(1))) throw new Error('impact total: ' + t + ' expected ' + imp(f).toFixed(1));
  });
  await step('tier is Rebuild and the package carries doses', async () => {
    const badge = await page.locator('.tier-badge.lg').innerText();
    if (!/Rebuild/.test(badge)) throw new Error(badge);
    const doses = await page.locator('.pkg-list .dose').allInnerTexts();
    if (!doses.some((d) => /3-day sandbox/.test(d))) throw new Error(doses.join(' | '));
    if (!doses.some((d) => /1:15/.test(d))) throw new Error(doses.join(' | '));
  });
  await step('both modifiers fire for this role (deskless + decision rights)', async () => {
    const mods = await page.locator('.mod h5').allInnerTexts();
    if (mods.length !== 2) throw new Error('mods: ' + mods.join(' | '));
    if (!/deskless/i.test(mods[0])) throw new Error(mods[0]);
    if (!/decision-rights/i.test(mods[1])) throw new Error(mods[1]);
  });
  await step('Generate returns content via the fallback path', async () => {
    await page.locator('.card-head button', { hasText: 'Generate' }).click();
    await page.waitForSelector('.gen-sec .msg', { timeout: 30000 });
    const secs = (await page.locator('.gen-sec h4').allInnerTexts()).map((s) => s.toLowerCase());
    for (const want of ['role redesign narrative', 'training curriculum', 'comms message', 'adoption actions'])
      if (!secs.includes(want)) throw new Error('missing section ' + want + ' — got ' + secs.join(', '));
    const marker = await page.locator('.mark').first().innerText();
    console.log('        source marker: "' + marker + '"');
    const narrative = await page.locator('.gen-sec').first().innerText();
    if (!/decision rights/i.test(narrative)) throw new Error('narrative does not name the decision-rights shift');
    const comms = await page.locator('.gen-sec .msg').innerText();
    if (/email/i.test(comms.split('Channels:')[1] || '')) throw new Error('deskless role still lists email as a channel');
  });
  await step('the client really called POST /api/generate and it answered 200 + fallback', async () => {
    if (!apiCalls.length) throw new Error('no request to /api/generate was made');
    const c = apiCalls[apiCalls.length - 1];
    if (c.status !== 200) throw new Error('status ' + c.status);
    if (c.source !== 'fallback') throw new Error('source ' + c.source);
    console.log('        /api/generate -> ' + c.status + ' source=' + c.source + ' reason=' + c.reason);
    const marker = (await page.locator('.mark').first().innerText()).toLowerCase();
    if (!/offline content/.test(marker)) throw new Error('marker was "' + marker + '"');
  });
  await step('vendored library fallback engaged (CDN blocked)', async () => {
    const ok = await page.evaluate(() => ({
      React: !!window.React, ReactDOM: !!window.ReactDOM, Chart: !!window.Chart, Babel: !!window.Babel,
    }));
    for (const k of Object.keys(ok)) if (!ok[k]) throw new Error(k + ' did not load');
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: SHOTS + '/02-role-one-pager.png', fullPage: true });

  await step('Copy one-pager writes plain text to the clipboard', async () => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.locator('button', { hasText: 'Copy one-pager' }).click();
    await page.waitForTimeout(300);
    const txt = await page.evaluate(() => navigator.clipboard.readText());
    if (!txt.includes(MOD_ROLE.role + ' — Rebuild')) throw new Error('clipboard: ' + txt.slice(0, 120));
    if (!/PRESCRIBED \(Rebuild\)/.test(txt)) throw new Error('no package in clipboard text');
  });

  // ---- 4. ROI (before adding, to compare) --------------------------------
  await page.locator('.tab', { hasText: 'Costed plan' }).click();
  await page.waitForTimeout(700);
  let before = {};
  await step('ROI chart renders and tiles compute', async () => {
    await page.waitForSelector('.chart-box canvas', { timeout: 8000 });
    const drawn = await page.evaluate(() => {
      const c = document.querySelector('.chart-box canvas');
      if (!c || !c.width) return false;
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let ink = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i] > 8) ink += 1;
      return ink > 4000;
    });
    if (!drawn) throw new Error('canvas appears blank');
    const tiles = await page.locator('.tile').allInnerTexts();
    const dip = tiles.find((t) => /dip depth/i.test(t));
    const rec = tiles.find((t) => /recovery/i.test(t));
    const loss = tiles.find((t) => /loss avoided/i.test(t));
    if (!/22% → 11%/.test(dip)) throw new Error('dip tile: ' + dip);
    if (!/14 wks → 6 wks/.test(rec)) throw new Error('recovery tile: ' + rec);
    before.loss = loss.match(/\$[\d.]+M/)[0];
    console.log('        dip ' + dip.split('\n')[1] + ' · recovery ' + rec.split('\n')[1] + ' · loss avoided ' + before.loss);
  });
  await step('resourced plan numbers derive from the population', async () => {
    const rows = await page.locator('.plan-row').allInnerTexts();
    const su = rows.find((r) => /super-users/.test(r));
    if (!su.trim().startsWith(String(EXP_SUPERUSERS)))
      throw new Error('super-users row "' + su.replace(/\n/g, ' / ') + '" expected ' + EXP_SUPERUSERS);
    const seats = rows.find((r) => /sandbox seats/.test(r));
    if (!seats.trim().startsWith(String(EXP_SEATS)))
      throw new Error('sandbox seats row "' + seats.replace(/\n/g, ' / ') + '" expected ' + EXP_SEATS);
    console.log('        super-users ' + EXP_SUPERUSERS + ' · sandbox seats ' + EXP_SEATS
      + ' (deck slide 13: 42 super-users, 62 seats)');
  });
  before.plan = await page.locator('.plan-row .n').allInnerTexts();
  await page.screenshot({ path: SHOTS + '/03-costed-plan-roi.png', fullPage: true });

  // ---- 3. add a role live -------------------------------------------------
  await page.locator('.tab', { hasText: 'Add a role' }).click();
  await page.waitForSelector('#a-role');
  await step('axis scores and tier update live as sliders move', async () => {
    await page.fill('#a-role', 'Plant Buyer');
    await page.selectOption('#a-vs', 'Procure-to-Pay');
    await page.fill('#a-hc', '58');
    await page.fill('#a-sc', '6');
    await page.fill('#a-sum', 'Raises and expedites plant-level purchase orders against local supplier relationships; after go-live requisitions are system-generated and released against contract.');
    const before0 = await page.locator('.live-score .big').first().innerText();
    const setSlider = async (label, v) => {
      await page.locator(`input[aria-label="${label}"]`).fill(String(v));
    };
    await setSlider('Share of daily tasks changing', 4.0);
    await setSlider('Frequency and volume of the task', 4.0);
    await setSlider('Consequence of error', 3.4);
    await setSlider('Change in decision rights', 4.4);
    await setSlider('Capability delta', 4.0);
    await setSlider('Local readiness gap', 4.2);
    await page.waitForTimeout(150);
    const impact = await page.locator('.live-score .big').first().innerText();
    const risk = await page.locator('.live-score .big').nth(1).innerText();
    const tier = await page.locator('.live-score .tierline .t').innerText();
    if (impact === before0) throw new Error('impact score did not react to the sliders');
    if (impact !== '3.8') throw new Error('expected impact 3.8, got ' + impact);
    if (risk !== '4.2') throw new Error('expected risk 4.2, got ' + risk);
    if (tier !== 'Rebuild') throw new Error('expected Rebuild, got ' + tier);
    console.log('        live: impact ' + impact + ' · risk ' + risk + ' · ' + tier);
  });
  await page.screenshot({ path: SHOTS + '/04-add-a-role.png', fullPage: true });

  await step('submitting places it on the map and opens its one-pager', async () => {
    await page.locator('button', { hasText: 'Score it and open the one-pager' }).click();
    await page.waitForSelector('.op-head h2', { timeout: 5000 });
    const h = await page.locator('.op-head h2').innerText();
    if (!/Plant Buyer/.test(h)) throw new Error('one-pager shows ' + h);
    const badge = await page.locator('.tier-badge.lg').innerText();
    if (!/Rebuild/.test(badge)) throw new Error('tier badge ' + badge);
    await page.locator('.tab', { hasText: 'Portfolio' }).click();
    await page.waitForTimeout(200);
    const n = await page.locator('.pt').count();
    if (n !== N + 1) throw new Error('expected ' + (N + 1) + ' points after adding, got ' + n);
    const rows = await page.locator('table.data tbody tr').count();
    if (rows !== N + 1) throw new Error('expected ' + (N + 1) + ' table rows, got ' + rows);
  });
  await step('the costed plan re-costs itself after the new role', async () => {
    await page.locator('.tab', { hasText: 'Costed plan' }).click();
    await page.waitForTimeout(600);
    const loss = (await page.locator('.tile', { hasText: 'loss avoided' }).innerText()).match(/\$[\d.]+M/)[0];
    const plan = await page.locator('.plan-row .n').allInnerTexts();
    if (loss === before.loss) throw new Error('loss avoided did not move: still ' + loss);
    if (JSON.stringify(plan) === JSON.stringify(before.plan)) throw new Error('resourced plan did not move');
    console.log('        loss avoided ' + before.loss + ' → ' + loss);
    console.log('        plan numbers ' + before.plan.join(',') + ' → ' + plan.join(','));
  });

  // ---- responsive + print -------------------------------------------------
  await step('projector width (1920) has no horizontal body scroll', async () => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.locator('.tab', { hasText: 'Portfolio' }).click();
    await page.waitForTimeout(250);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 2) throw new Error('overflow ' + over + 'px');
  });
  await step('narrow width (760) has no horizontal body scroll', async () => {
    await page.setViewportSize({ width: 760, height: 1000 });
    await page.waitForTimeout(250);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 2) throw new Error('overflow ' + over + 'px');
    await page.setViewportSize({ width: 1600, height: 1000 });
  });
  await step('print stylesheet produces a one-pager PDF', async () => {
    await page.locator('.tab', { hasText: 'Role one-pager' }).click();
    await page.waitForSelector('.op-head h2');
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: SHOTS + '/05-one-pager-print.pdf', format: 'A4', printBackground: true });
    await page.emulateMedia({ media: 'screen' });
  });

  // ---- offline / file:// resilience --------------------------------------
  await step('runs from file:// on the embedded seed with no server', async () => {
    const p2 = await browser.newPage();
    const errs = [];
    p2.on('pageerror', (e) => errs.push(e.message));
    await p2.goto('file://' + path.join(ROOT, 'index.html'));
    await p2.waitForFunction(() => document.querySelectorAll('.pt').length > 0, { timeout: 15000 });
    const n = await p2.locator('.pt').count();
    const src = await p2.locator('.topbar .sub').innerText();
    if (n !== N) throw new Error('points=' + n + ' (embedded seed should carry all ' + N + ')');
    if (!/embedded seed/.test(src)) throw new Error('source=' + src);
    await p2.locator('.pt').first().click();
    await p2.waitForSelector('.op-head h2');
    await p2.locator('.card-head button', { hasText: 'Generate' }).click();
    await p2.waitForSelector('.gen-sec .msg', { timeout: 20000 });
    if (errs.length) throw new Error('file:// pageerrors: ' + errs.join('; '));
    await p2.close();
  });

  await browser.close();

  console.log('\n--- blocked CDN resource loads (expected in this sandbox, vendored fallback covers them): '
    + cdnBlocked.length + ' ---');
  console.log('--- real console/page errors: ' + errors.length + ' ---');
  errors.forEach((e) => console.log('  ' + e));
  if (warnings.length) {
    console.log('--- warnings: ' + warnings.length + ' ---');
    warnings.slice(0, 8).forEach((w) => console.log('  ' + w));
  }
  process.exit(errors.length ? 1 : 0);
})();
