/**
 * Third suite — adversarial checks on the add-a-role form, plus the new
 * sub-factor anchors, the hypercare floor and the reproduction panel.
 *
 * verify.js (25 checks) and verify2.js (20 checks) must keep passing unchanged.
 * This file attacks the form: the exact-threshold boundary, one role per tier,
 * extreme headcounts, and text inputs chosen to break layout or escaping.
 *
 * Everything here is computed against live state — nothing is hardcoded to the
 * shipped 38 roles, because these tests add roles as they go.
 */
const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://127.0.0.1:8123/';
const path = require('path');

/* Repo root, resolved from this file's location: tools/verify -> repo root. */
const ROOT = path.resolve(__dirname, '..', '..');
const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'roles.json'), 'utf8'));
const DATA = Array.isArray(doc) ? doc : doc.roles;

/* Geometry of the heat map, mirrored from index.html so the test can predict
   where a score must land. If these drift the position checks will fail loudly,
   which is the intent. */
const MAP = { w: 940, h: 500, l: 62, r: 26, t: 24, b: 54 };
const px = (v) => MAP.l + ((v - 1) / 4) * (MAP.w - MAP.l - MAP.r);
const py = (v) => (MAP.h - MAP.b) - ((v - 1) / 4) * (MAP.h - MAP.t - MAP.b);
const TIER_HEX = { Rebuild: '#c0392b', Enable: '#c98500', Reassure: '#4a3aa7', Inform: '#7a8794' };

const SLIDERS = {
  taskShare: 'Share of daily tasks changing',
  frequencyVolume: 'Frequency and volume of the task',
  errorConsequence: 'Consequence of error',
  decisionRights: 'Change in decision rights',
  capabilityDelta: 'Capability delta',
  localReadiness: 'Local readiness gap',
};

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
  const tab = async (label) => {
    await page.locator('.tab', { hasText: label }).click();
    await page.waitForTimeout(250);
  };

  /* A range input only fires onChange when the value actually changes, and an
     unset slider already displays 3 — so nudge first, then land on the target. */
  const setSlider = async (label, v) => {
    const el = page.locator(`input[aria-label="${label}"]`);
    if ((await el.inputValue()) === String(v)) {
      await el.fill(String(Number(v) === 5 ? 4.9 : Number(v) + 0.1));
    }
    await el.fill(String(v));
  };
  const setAll = async (scores) => {
    for (const [k, label] of Object.entries(SLIDERS)) await setSlider(label, scores[k]);
    await page.waitForTimeout(150);
  };
  /* Same value on all three sub-factors of an axis => that value IS the axis
     score, whatever the weights, because the weights normalise to 1 per axis. */
  const flat = (impact, risk) => ({
    taskShare: impact, frequencyVolume: impact, errorConsequence: impact,
    decisionRights: risk, capabilityDelta: risk, localReadiness: risk,
  });

  const addRole = async (name, scores, opts = {}) => {
    await tab('Add a role');
    await page.waitForSelector('#a-role');
    await page.locator('button', { hasText: 'Reset' }).click();
    await page.waitForTimeout(120);
    await page.locator('#a-role').fill(name);
    if (opts.headcount !== undefined) await page.locator('#a-hc').fill(String(opts.headcount));
    if (opts.siteCount !== undefined) await page.locator('#a-sc').fill(String(opts.siteCount));
    await setAll(scores);
    const live = await page.locator('.live-score .big').allInnerTexts();
    const tier = await page.locator('.live-score .tierline .t').innerText();
    await page.locator('button', { hasText: 'Score it and open the one-pager' }).click();
    await page.waitForSelector('.op-head h2');
    return { live, tier };
  };

  const counts = () => page.evaluate(() => ({
    pts: document.querySelectorAll('.pt').length,
    rows: document.querySelectorAll('table.data tbody tr').length,
  }));
  const planNumbers = async () => {
    await tab('Costed plan');
    await page.waitForSelector('.plan-row');
    return page.evaluate(() => [...document.querySelectorAll('.plan-row .n')].map((n) => n.innerText.trim()));
  };
  const roiText = async () => {
    await tab('Costed plan');
    return page.evaluate(() => {
      const t = [...document.querySelectorAll('.tile')].find((x) => /loss avoided/i.test(x.innerText));
      return t ? t.innerText.replace(/\n/g, ' ') : '';
    });
  };
  const tierTiles = () => page.evaluate(() => {
    const out = {};
    document.querySelectorAll('.tier-tile').forEach((el) => {
      const rows = [...el.querySelectorAll('.row')].map((r) => r.innerText.replace(/\n/g, ' '));
      out[el.querySelector('.tier-name').innerText.trim()] = {
        roles: Number((rows[0] || '').replace(/[^\d]/g, '')),
        people: Number((rows[1] || '').replace(/[^\d]/g, '')),
        budget: Number((rows[3] || '').replace(/[^\d]/g, '')),
      };
    });
    return out;
  });
  const noBadNumbers = async (where) => {
    const t = await bodyText();
    const m = t.match(/NaN|Infinity|undefined|\$NaN/);
    if (m) throw new Error(`${where}: page text contains "${m[0]}"`);
  };
  const noHScroll = async (where) => {
    const o = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    }));
    if (o.sw > o.cw + 1) throw new Error(`${where}: body scrolls horizontally (${o.sw} > ${o.cw})`);
  };
  /* Read the plotted circle for a role, plus the drawn 3.5 threshold lines, so
     "the tier says X" and "the dot is in X's quadrant" can be compared. */
  const plotted = (name) => page.evaluate((n) => {
    const g = [...document.querySelectorAll('.pt')].find((el) => (el.getAttribute('aria-label') || '').startsWith(n));
    if (!g) return null;
    const c = g.querySelector('circle');
    const labels = [...document.querySelectorAll('svg text')].filter((t) => t.textContent.trim() === '3.5');
    const xLab = labels.find((t) => t.getAttribute('text-anchor') === 'middle');
    const yLab = labels.find((t) => t.getAttribute('text-anchor') === 'end');
    return {
      aria: g.getAttribute('aria-label'),
      cx: Number(c.getAttribute('cx')), cy: Number(c.getAttribute('cy')),
      r: Number(c.getAttribute('r')), fill: c.getAttribute('fill'),
      xm: xLab ? Number(xLab.getAttribute('x')) : null,
      ym: yLab ? Number(yLab.getAttribute('y')) - 3 : null,
    };
  }, name);

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('.app');
  await page.waitForFunction(() => document.querySelectorAll('.pt').length > 0, { timeout: 20000 });
  let n = DATA.length;

  /* ======================================================================
     1. THE BOUNDARY — exactly 3.5 / 3.5 must tier Rebuild, deterministically,
     and the screen must say that 3.5 is above the line, not on it.
     ====================================================================== */

  await step('exactly 3.5 / 3.5 tiers Rebuild in the live panel, and the form says 3.5 counts as above', async () => {
    await tab('Add a role');
    await page.waitForSelector('#a-role');
    const t = await bodyText();
    if (!/exactly 3\.5 counts as above the line/i.test(t)) throw new Error('the form does not state that exactly 3.5 counts as above');
    if (!/inclusive/i.test(t)) throw new Error('"inclusive" does not appear on the form');
    await page.locator('#a-role').fill('Boundary Case 3.5');
    await setAll(flat(3.5, 3.5));
    const big = await page.locator('.live-score .big').allInnerTexts();
    if (big[0] !== '3.5' || big[1] !== '3.5') throw new Error('live scores read ' + big.join('/') + ', expected 3.5/3.5');
    const tier = await page.locator('.live-score .tierline .t').innerText();
    if (tier !== 'Rebuild') throw new Error('3.5/3.5 tiered "' + tier + '", expected Rebuild');
    const thr = await page.locator('.live-score .thr').allInnerTexts();
    thr.forEach((s) => { if (!/inclusive/.test(s)) throw new Error('threshold caption omits "inclusive": ' + s); });
    console.log('        3.5 / 3.5 → Rebuild, with both axis captions marked inclusive');
  });

  await step('3.5 / 3.5 is deterministic — the same input scores the same way five times over', async () => {
    for (let i = 0; i < 5; i += 1) {
      await setAll(flat(1, 1));
      await setAll(flat(3.5, 3.5));
      const big = await page.locator('.live-score .big').allInnerTexts();
      const tier = await page.locator('.live-score .tierline .t').innerText();
      if (big[0] !== '3.5' || big[1] !== '3.5' || tier !== 'Rebuild') {
        throw new Error(`pass ${i + 1} gave ${big.join('/')} ${tier}`);
      }
    }
  });

  await step('the submitted 3.5 / 3.5 role reads Rebuild on its one-pager, with the ≥ shown explicitly', async () => {
    await page.locator('button', { hasText: 'Score it and open the one-pager' }).click();
    await page.waitForSelector('.op-head h2');
    n += 1;
    const badge = await page.locator('.op-head .tier-badge').first().innerText();
    if (!/Rebuild/.test(badge)) throw new Error('one-pager badge reads "' + badge + '"');
    const arith = await page.locator('.card', { hasText: 'Score, and why' }).innerText();
    if (!/impact 3\.5 ≥ 3\.5 and risk 3\.5 ≥ 3\.5/.test(arith)) {
      throw new Error('the one-pager does not print "3.5 ≥ 3.5" on both axes:\n' + arith.slice(0, 400));
    }
    if (!/→ Rebuild/.test(arith)) throw new Error('no tier conclusion in the arithmetic line');
  });

  await step('the plotted dot agrees with the tier: on both 3.5 lines, inside the Rebuild quadrant, in Rebuild red', async () => {
    await tab('Portfolio');
    await page.waitForSelector('.pt');
    const p = await plotted('Boundary Case 3.5');
    if (!p) throw new Error('the role is not on the heat map');
    if (!/tier Rebuild/.test(p.aria)) throw new Error('accessible label disagrees: ' + p.aria);
    if (Math.abs(p.cx - px(3.5)) > 0.5) throw new Error(`cx ${p.cx}, expected ${px(3.5)}`);
    if (Math.abs(p.cy - py(3.5)) > 0.5) throw new Error(`cy ${p.cy}, expected ${py(3.5)}`);
    if (p.xm === null || p.ym === null) throw new Error('could not find the drawn 3.5 threshold labels');
    if (Math.abs(p.cx - p.xm) > 0.5) throw new Error(`dot is not on the drawn vertical 3.5 line (${p.cx} vs ${p.xm})`);
    if (Math.abs(p.cy - p.ym) > 0.5) throw new Error(`dot is not on the drawn horizontal 3.5 line (${p.cy} vs ${p.ym})`);
    // Rebuild quadrant is x >= xm and y <= ym (the y axis is inverted).
    if (p.cx < p.xm - 0.5 || p.cy > p.ym + 0.5) throw new Error('dot falls outside the Rebuild quadrant');
    if (p.fill.toLowerCase() !== TIER_HEX.Rebuild) throw new Error(`dot is ${p.fill}, not Rebuild ${TIER_HEX.Rebuild}`);
    console.log(`        dot at (${p.cx}, ${p.cy}) sits exactly on both drawn 3.5 lines, filled Rebuild red`);
  });

  await step('a hair under the line tiers differently — 3.4 / 3.4 is Inform, so 3.5 is doing real work', async () => {
    const r = await addRole('Boundary Case 3.4', flat(3.4, 3.4));
    n += 1;
    if (r.live[0] !== '3.4' || r.live[1] !== '3.4') throw new Error('live scores ' + r.live.join('/'));
    if (r.tier !== 'Inform') throw new Error('3.4/3.4 tiered ' + r.tier + ', expected Inform');
    await tab('Portfolio');
    const p = await plotted('Boundary Case 3.4');
    if (p.cx >= p.xm) throw new Error('3.4 plotted at or right of the 3.5 line');
    if (p.fill.toLowerCase() !== TIER_HEX.Inform) throw new Error('3.4/3.4 dot is ' + p.fill);
    console.log('        3.4 / 3.4 → Inform · 3.5 / 3.5 → Rebuild · the boundary is inclusive and it matters');
  });

  /* ======================================================================
     2. ONE ROLE PER TIER, submitted in turn. Each must move the heat map, the
     role table, the one-pager and the costed-plan totals.
     ====================================================================== */

  /* `movesPlan` is a property of the engine, not a nicety: every resourced-plan
     rule keys off Rebuild, Enable, Reassure or deskless, so an Inform role
     correctly moves no line on it. That is the "Inform is nearly free" claim the
     deck makes, so the test asserts it rather than tolerating it. Its tier tile,
     its people and the budget split all still move. */
  const TARGETS = [
    { tier: 'Rebuild',  scores: flat(4.5, 4.5), hc: 40, movesPlan: true },
    { tier: 'Enable',   scores: flat(4.5, 2.0), hc: 40, movesPlan: true },
    { tier: 'Reassure', scores: flat(2.0, 4.5), hc: 40, movesPlan: true },
    { tier: 'Inform',   scores: flat(2.0, 2.0), hc: 40, movesPlan: false },
  ];

  for (const t of TARGETS) {
    await step(`a ${t.tier} role lands in ${t.tier} and updates the map, the table, the one-pager and the plan totals`, async () => {
      await tab('Portfolio');
      await page.waitForSelector('.pt');
      const before = await counts();
      const beforeTiles = await tierTiles();
      const beforePlan = await planNumbers();
      const beforeRoi = await roiText();

      const name = `Tier Probe ${t.tier}`;
      const r = await addRole(name, t.scores, { headcount: t.hc });
      n += 1;
      if (r.tier !== t.tier) throw new Error(`live panel tiered it ${r.tier}, expected ${t.tier}`);

      // one-pager
      const badge = await page.locator('.op-head .tier-badge').first().innerText();
      if (!badge.includes(t.tier)) throw new Error(`one-pager badge "${badge}"`);
      const h2 = await page.locator('.op-head h2').innerText();
      if (h2.trim() !== name) throw new Error(`one-pager title "${h2}"`);
      const pkg = await page.locator('.card', { hasText: 'Prescribed intervention' }).innerText();
      if (!/Hypercare/.test(pkg)) throw new Error(`${t.tier} package has no hypercare — it is the floor in every tier`);

      // heat map + table
      await tab('Portfolio');
      await page.waitForSelector('.pt');
      const after = await counts();
      if (after.pts !== before.pts + 1) throw new Error(`heat map ${before.pts} → ${after.pts}`);
      if (after.rows !== before.rows + 1) throw new Error(`table ${before.rows} → ${after.rows}`);
      const p = await plotted(name);
      if (!p) throw new Error('not plotted');
      if (p.fill.toLowerCase() !== TIER_HEX[t.tier]) throw new Error(`dot ${p.fill}, expected ${TIER_HEX[t.tier]}`);
      const rowText = await page.evaluate((nm) => {
        const tr = [...document.querySelectorAll('table.data tbody tr')].find((x) => x.children[0].innerText.trim().startsWith(nm));
        return tr ? tr.innerText.replace(/\n/g, ' | ') : null;
      }, name);
      if (!rowText) throw new Error('not in the role table');
      if (!rowText.includes(t.tier)) throw new Error(`table row does not say ${t.tier}: ${rowText}`);

      // tier tiles moved for this tier, and the population still adds up
      const afterTiles = await tierTiles();
      if (afterTiles[t.tier].roles !== beforeTiles[t.tier].roles + 1) {
        throw new Error(`${t.tier} tile roles ${beforeTiles[t.tier].roles} → ${afterTiles[t.tier].roles}`);
      }
      if (afterTiles[t.tier].people !== beforeTiles[t.tier].people + t.hc) {
        throw new Error(`${t.tier} tile people ${beforeTiles[t.tier].people} → ${afterTiles[t.tier].people}, expected +${t.hc}`);
      }
      const beforeTotal = Object.values(beforeTiles).reduce((s, x) => s + x.people, 0);
      const afterTotal = Object.values(afterTiles).reduce((s, x) => s + x.people, 0);
      if (afterTotal !== beforeTotal + t.hc) {
        throw new Error(`the population total went ${beforeTotal} → ${afterTotal}, expected +${t.hc}`);
      }
      const budget = Object.values(afterTiles).reduce((s, x) => s + x.budget, 0);
      if (budget < 97 || budget > 103) throw new Error('budget shares sum to ' + budget + '%');

      // costed plan re-costed
      const afterPlan = await planNumbers();
      const afterRoi = await roiText();
      if (afterPlan.length !== beforePlan.length) throw new Error('plan lost a row');
      const planMoved = afterPlan.join(',') !== beforePlan.join(',') || afterRoi !== beforeRoi;
      if (t.movesPlan && !planMoved) {
        throw new Error(`the costed plan did not react to a new ${t.tier} role (plan ${beforePlan.join(',')} unchanged, ROI ${beforeRoi})`);
      }
      if (!t.movesPlan && planMoved) {
        throw new Error(`an Inform role moved the resourced plan (${beforePlan.join(',')} → ${afterPlan.join(',')}), `
          + 'but every plan rule keys off Rebuild, Enable, Reassure or deskless — check whether a rule changed');
      }
      if (!/\$\d/.test(afterRoi)) throw new Error('ROI tile lost its figure: ' + afterRoi);
      await noBadNumbers(`after adding a ${t.tier} role`);
      await noHScroll(`after adding a ${t.tier} role`);
      console.log(`        ${t.tier}: map ${before.pts}→${after.pts} · tile +${t.hc} people · plan ${beforePlan.join(',')} → ${afterPlan.join(',')}`
        + (t.movesPlan ? '' : ' (unchanged, correctly — no plan rule touches Inform)'));
    });
  }

  await step('all four tiers are now present and the four tier tiles still account for the whole population', async () => {
    await tab('Portfolio');
    const tiles = await tierTiles();
    if (Object.keys(tiles).length !== 4) throw new Error('tiles: ' + JSON.stringify(tiles));
    const rows = await counts();
    const roleSum = Object.values(tiles).reduce((s, x) => s + x.roles, 0);
    if (roleSum !== rows.rows) throw new Error(`tier tiles count ${roleSum} roles, the table shows ${rows.rows}`);
    const budget = Object.values(tiles).reduce((s, x) => s + x.budget, 0);
    if (budget < 97 || budget > 103) throw new Error('budget shares sum to ' + budget + '%');
  });

  /* ======================================================================
     3. EXTREME HEADCOUNT — 1 person and 2,000 people.
     ====================================================================== */

  for (const hc of [1, 2000]) {
    await step(`a ${hc.toLocaleString()}-person role does not break the costed plan, the budget shares or the ROI figure`, async () => {
      const beforeRoi = await roiText();
      const r = await addRole(`Headcount Extreme ${hc}`, flat(4.5, 4.5), { headcount: hc, siteCount: 1 });
      n += 1;
      if (r.tier !== 'Rebuild') throw new Error('tiered ' + r.tier);

      await tab('Costed plan');
      await page.waitForSelector('.plan-row');
      const nums = await page.evaluate(() => [...document.querySelectorAll('.plan-row .n')].map((x) => x.innerText.trim()));
      nums.forEach((v, i) => {
        const num = Number(v.replace(/,/g, ''));
        if (!Number.isFinite(num)) throw new Error(`plan row ${i} reads "${v}"`);
        if (num < 0) throw new Error(`plan row ${i} is negative: ${v}`);
      });
      const roi = await roiText();
      if (!/\$\d/.test(roi)) throw new Error('ROI tile: ' + roi);
      const m = roi.match(/\$[\d.,]+[KMB]?/);
      if (!m) throw new Error('no parsable money figure in "' + roi + '"');
      if (hc === 2000 && roi === beforeRoi) throw new Error('2,000 people did not move the ROI figure at all');

      await tab('Portfolio');
      const tiles = await tierTiles();
      Object.entries(tiles).forEach(([k, v]) => {
        if (!Number.isFinite(v.budget) || v.budget < 0 || v.budget > 100) throw new Error(`${k} budget share ${v.budget}%`);
        if (!Number.isFinite(v.people) || v.people < 0) throw new Error(`${k} people ${v.people}`);
      });
      const budget = Object.values(tiles).reduce((s, x) => s + x.budget, 0);
      if (budget < 97 || budget > 103) throw new Error('budget shares sum to ' + budget + '%');

      const p = await plotted(`Headcount Extreme ${hc}`);
      if (!p) throw new Error('not plotted');
      if (!Number.isFinite(p.r) || p.r <= 0) throw new Error('dot radius ' + p.r);
      if (p.r > 30) throw new Error('dot radius ' + p.r + ' — bubble scaling is unbounded');

      await noBadNumbers(`with a ${hc}-person role`);
      await noHScroll(`with a ${hc}-person role`);
      console.log(`        ${hc} people → ROI ${m[0]} · dot radius ${p.r} · budget shares sum ${budget}%`);
    });
  }

  await step('the ROI figure is monotonic in the right direction — adding 2,000 Rebuild people raised it', async () => {
    const roi = await roiText();
    const v = Number((roi.match(/\$([\d.]+)M/) || [0, 0])[1]);
    if (!(v > 5.3)) throw new Error('loss avoided is ' + roi + ', expected above the shipped $5.3M after adding ~2,100 people');
  });

  /* ======================================================================
     4. AWKWARD TEXT — long, apostrophes, ampersands, stray whitespace.
     ====================================================================== */

  const LONG = 'Regional Cross-Functional Inbound Logistics and Inventory Reconciliation Coordinator for Ambient and Chilled Goods Across the Northern Distribution Network';
  const AWKWARD = [
    { name: LONG, why: 'a very long role name' },
    { name: "Buyer's & Planner's Assistant", why: 'apostrophes and an ampersand' },
    { name: '  Padded Role Name  ', why: 'leading and trailing spaces', expect: 'Padded Role Name' },
    { name: 'Claims & Returns <Tier 2> "Specialist"', why: 'ampersand, angle brackets and quotes' },
  ];

  for (const c of AWKWARD) {
    await step(`${c.why} renders correctly and does not break the layout`, async () => {
      const r = await addRole(c.name, flat(4.5, 4.5), { headcount: 25 });
      n += 1;
      const expect = c.expect || c.name;

      // rendered as text, exactly once, not escaped and not double-escaped
      const h2 = await page.locator('.op-head h2').innerText();
      if (h2.trim() !== expect.trim()) throw new Error(`one-pager title is "${h2}", expected "${expect}"`);
      const html = await page.locator('.op-head h2').innerHTML();
      if (/&amp;amp;|&amp;#39;|&amp;quot;|&amp;lt;/.test(html)) throw new Error('double-escaped in the DOM: ' + html);
      if (/[<>]/.test(c.name)) {
        const tagCount = await page.locator('.op-head h2 *').count();
        if (tagCount !== 0) throw new Error('angle brackets in the name produced ' + tagCount + ' child elements — markup injection');
      }

      await noHScroll(`one-pager with ${c.why}`);
      // the title must not spill out of its own card
      const fits = await page.evaluate(() => {
        const h = document.querySelector('.op-head h2');
        const card = h.closest('.card') || h.parentElement;
        return { hw: h.scrollWidth, cw: card.clientWidth, hOver: h.scrollWidth - h.clientWidth };
      });
      if (fits.hOver > 1) throw new Error(`title overflows its box by ${fits.hOver}px — it is not wrapping`);

      // and on the heat map + table
      await tab('Portfolio');
      await page.waitForSelector('.pt');
      await noHScroll(`heat map with ${c.why}`);
      const inTable = await page.evaluate((nm) => [...document.querySelectorAll('table.data tbody tr')]
        .some((tr) => tr.children[0].innerText.trim() === nm.trim()), expect);
      if (!inTable) throw new Error('not found in the role table under its expected name');
      const p = await plotted(expect.trim().slice(0, 30));
      if (!p) throw new Error('not plotted on the heat map');

      // the table must not blow the layout out either
      const tableOk = await page.evaluate(() => {
        const t = document.querySelector('table.data');
        const wrap = t.closest('.card') || t.parentElement;
        return t.scrollWidth <= wrap.scrollWidth + 1;
      });
      if (!tableOk) throw new Error('the role table is now wider than its container');
      console.log(`        "${expect.trim().slice(0, 44)}${expect.length > 44 ? '…' : ''}" ok`);
    });
  }

  await step('the awkward names survive a re-render at projector and narrow widths', async () => {
    for (const w of [1920, 1280, 760]) {
      await page.setViewportSize({ width: w, height: 1000 });
      await page.waitForTimeout(200);
      await noHScroll('portfolio at ' + w + 'px');
      await tab('Costed plan');
      await noHScroll('costed plan at ' + w + 'px');
      await tab('Reproduced');
      await noHScroll('reproduction panel at ' + w + 'px');
      await tab('Portfolio');
    }
    await page.setViewportSize({ width: 1600, height: 1000 });
  });

  /* ======================================================================
     5. THE NEW SURFACES — anchors, the hypercare floor, the claim panel.
     ====================================================================== */

  await step('every slider carries a live 1-5 anchor that changes as the score changes', async () => {
    await tab('Add a role');
    await page.locator('button', { hasText: 'Reset' }).click();
    await page.waitForTimeout(150);
    const unset = await page.locator('.anchor').allInnerTexts();
    if (unset.length !== 6) throw new Error('expected 6 anchor lines, got ' + unset.length);
    unset.forEach((s) => { if (!/Move the slider/.test(s)) throw new Error('unset anchor reads "' + s + '"'); });
    await setSlider(SLIDERS.capabilityDelta, 1);
    await page.waitForTimeout(150);
    const low = await page.locator('.slider', { hasText: 'Capability delta' }).locator('.anchor').innerText();
    if (!/Minor changes to skills or knowledge/.test(low)) throw new Error('anchor 1 for capability delta: ' + low);
    await setSlider(SLIDERS.capabilityDelta, 5);
    await page.waitForTimeout(150);
    const high = await page.locator('.slider', { hasText: 'Capability delta' }).locator('.anchor').innerText();
    if (!/do not possess the skills and knowledge/.test(high)) throw new Error('anchor 5 for capability delta: ' + high);
    if (low === high) throw new Error('the anchor did not change between 1 and 5');
    await setSlider(SLIDERS.capabilityDelta, 4.4);
    await page.waitForTimeout(150);
    const mid = await page.locator('.slider', { hasText: 'Capability delta' }).locator('.anchor').innerText();
    if (!/NEAREST ANCHOR 4/i.test(mid)) throw new Error('a value between anchors is not marked as nearest: ' + mid);
    console.log('        capability delta 1 → 4.4 → 5 all describe themselves');
  });

  await step('the two best-grounded anchors are attributed to their source, not to us', async () => {
    const cap = await page.locator('.slider', { hasText: 'Capability delta' }).locator('.anchor-all summary').innerText();
    if (!/Aberdeen/.test(cap)) throw new Error('capability delta provenance: ' + cap);
    if (!/1 · 3 · 5/.test(cap)) throw new Error('capability delta does not say which anchors are Aberdeen’s: ' + cap);
    const err = await page.locator('.slider', { hasText: 'Consequence of error' }).locator('.anchor-all summary').innerText();
    if (!/Openlink/.test(err)) throw new Error('consequence of error provenance: ' + err);
    if (!/safety limb ours/i.test(err)) throw new Error('the authored safety limb is not flagged: ' + err);
  });

  await step('frequency and volume is flagged as ours specifically, and says no source measures it', async () => {
    const s = page.locator('.slider', { hasText: 'Frequency and volume' });
    const sum = await s.locator('.anchor-all summary').innerText();
    if (!/OURS end to end/i.test(sum)) throw new Error('badge reads: ' + sum);
    if (!/no source measures this/i.test(sum)) throw new Error('badge does not deny a source: ' + sum);
    const flagged = await s.locator('.anchor-all .prov.ours').count();
    if (flagged !== 1) throw new Error('the "ours" badge is not visually distinguished (found ' + flagged + ')');
    await s.locator('.anchor-all summary').click();
    await page.waitForTimeout(150);
    const note = await s.locator('.anchor-note').innerText();
    if (!/least grounded/i.test(note)) throw new Error('note does not admit it is the least grounded: ' + note);
    if (!/most likely to be challenged/i.test(note)) throw new Error('note omits the challenge warning');
    // and nothing may attribute this one to Aberdeen or the deck
    if (/Aberdeen/.test(note)) throw new Error('frequency and volume cites Aberdeen: ' + note);
    console.log('        flagged "OURS end to end — no source measures this", and the note says so at length');
  });

  await step('all five anchors are listed for all six sub-factors, with the live one marked', async () => {
    const per = await page.evaluate(() => [...document.querySelectorAll('.slider')].map((s) => ({
      name: s.querySelector('.name').innerText,
      bands: s.querySelectorAll('.anchor-list li').length,
    })));
    if (per.length !== 6) throw new Error('sliders: ' + per.length);
    per.forEach((p) => { if (p.bands !== 5) throw new Error(`${p.name} has ${p.bands} anchors, expected 5`); });
    await setAll(flat(2, 2));
    await page.waitForTimeout(150);
    // textContent, not innerText: the ladder lives in a collapsed <details>.
    const on = await page.evaluate(() => {
      const s = [...document.querySelectorAll('.slider')].find((x) => x.querySelector('.name').textContent.includes('Capability delta'));
      const li = s.querySelectorAll('.anchor-list li');
      const hot = [...li].filter((x) => x.classList.contains('on'));
      return { count: hot.length, n: hot.length ? hot[0].querySelector('b').textContent.trim() : null };
    });
    if (on.count !== 1) throw new Error('expected exactly one highlighted anchor, got ' + on.count);
    if (on.n !== '2') throw new Error('the highlighted anchor is ' + on.n + ', expected 2');
  });

  await step('the one-pager sub-factor breakdown carries the anchors and their provenance', async () => {
    await tab('Portfolio');
    await page.locator('.pt[aria-label*="Plant Scheduler"]').click();
    await page.waitForSelector('.op-head h2');
    const ans = await page.locator('.sf-an').allInnerTexts();
    if (ans.length !== 6) throw new Error('expected 6 anchor lines on the one-pager, got ' + ans.length);
    const joined = ans.join(' ');
    if (!/core throughput/.test(joined)) throw new Error('frequency anchor text missing');
    if (!/OURS end to end/i.test(joined)) throw new Error('the "ours" provenance badge is missing from the one-pager');
    if (!/Aberdeen/.test(joined)) throw new Error('no Aberdeen attribution on the one-pager breakdown');
    const foot = await page.locator('.card', { hasText: 'Score, and why' }).innerText();
    if (!/never defines a single point on it|defines no point/i.test(foot)) {
      throw new Error('the one-pager does not say the deck defines no point on the scale');
    }
  });

  await step('the copied one-pager text carries the anchors and their provenance', async () => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.locator('button', { hasText: 'Copy one-pager' }).click();
    await page.waitForTimeout(350);
    const txt = await page.evaluate(() => navigator.clipboard.readText());
    ['WHAT EACH SCORE MEANS', 'provenance:', 'OURS end to end', 'Hypercare:', 'the floor in every tier']
      .forEach((s) => { if (!txt.includes(s)) throw new Error('clipboard text missing "' + s + '"'); });
  });

  /* Open a role of the given tier from the TABLE, not the map: by this point the
     suite has stacked several probe roles on identical coordinates and the dots
     overlap, so a map click gets intercepted. The table row is a real user path. */
  const openTierFromTable = async (tier) => {
    await tab('Portfolio');
    await page.waitForSelector('table.data tbody tr');
    const row = page.locator('table.data tbody tr').filter({ hasText: tier }).first();
    await row.click();
    await page.waitForSelector('.op-head h2');
  };

  await step('hypercare is in all four tier packages, scaling by tier, topping out at 8 weeks', async () => {
    const seen = {};
    for (const t of ['Rebuild', 'Enable', 'Reassure', 'Inform']) {
      await openTierFromTable(t);
      const got = await page.locator('.op-head .tier-badge').first().innerText();
      if (!got.includes(t)) throw new Error(`opened a ${got} role while looking for ${t}`);
      const pkg = await page.locator('.card', { hasText: 'Prescribed intervention' }).innerText();
      const m = pkg.match(/Hypercare[^\n]*?(\d+)\s*weeks?/);
      if (!m) throw new Error(`${t} package has no hypercare line:\n` + pkg);
      seen[t] = Number(m[1]);
      const esc = await page.locator('.pkg-extra', { hasText: 'four-layer escalation' }).innerText();
      if (!/floor/i.test(esc)) throw new Error(`${t} does not describe hypercare as the floor: ` + esc);
    }
    if (seen.Rebuild !== 8) throw new Error('Rebuild hypercare is ' + seen.Rebuild + ' weeks, expected 8 at the top of the range');
    const order = ['Rebuild', 'Enable', 'Reassure', 'Inform'];
    for (let i = 1; i < order.length; i += 1) {
      if (!(seen[order[i]] <= seen[order[i - 1]])) throw new Error('hypercare does not scale down by tier: ' + JSON.stringify(seen));
      if (!(seen[order[i]] >= 1)) throw new Error(order[i] + ' has no hypercare at all');
    }
    console.log('        ' + order.map((t) => `${t} ${seen[t]}w`).join(' · ') + ' — every tier carries it');
  });

  await step('the delivery-standards card and the plan rule both state the hypercare floor', async () => {
    await tab('Costed plan');
    const std = await page.locator('.card', { hasText: 'Delivery standards' }).innerText();
    if (!/Hypercare/.test(std)) throw new Error('hypercare is not in the delivery-standards card');
    if (!/every tier/i.test(std)) throw new Error('the card does not say every tier gets it');
    if (!/floor/i.test(std)) throw new Error('the card does not use the word floor');
    const plan = await page.locator('.card', { hasText: 'resourced plan' }).innerText();
    if (!/floor in every tier/i.test(plan)) throw new Error('the plan rule does not state the floor: ' + plan.slice(0, 300));
  });

  await step('generated adoption actions include hypercare for a non-Rebuild role', async () => {
    await openTierFromTable('Inform');
    await page.locator('.card-head button', { hasText: 'Generate' }).click();
    await page.waitForSelector('.gen-sec .msg', { timeout: 40000 });
    const ad = await page.locator('.gen-sec', { hasText: 'Adoption actions' }).innerText();
    if (!/hypercare/i.test(ad)) throw new Error('an Inform role got no hypercare action:\n' + ad);
    if (!/floor every tier gets|floor/i.test(ad)) throw new Error('the action does not describe it as the floor');
  });

  await step('the reproduction panel states the claim and computes every verdict', async () => {
    await tab('Reproduced');
    await page.waitForSelector('.repro-table');
    const t = await bodyText();
    if (!/Reproduced, not hardcoded/.test(t)) throw new Error('the claim is not stated');
    const rows = await page.evaluate(() => [...document.querySelectorAll('.rt-row')].map((r) => ({
      f: r.querySelector('.f').innerText, d: r.querySelector('.d').innerText,
      e: r.querySelector('.e').innerText, v: r.querySelector('.v').innerText,
      miss: r.classList.contains('miss'), rule: (r.querySelector('.r') || {}).innerText || '',
    })));
    if (rows.length < 20) throw new Error('only ' + rows.length + ' comparison rows');
    rows.forEach((r) => {
      const same = r.d === r.e;
      if (same && r.miss) throw new Error(`"${r.f}" matches but is flagged a near miss`);
      if (!same && !r.miss) throw new Error(`"${r.f}" differs (${r.d} vs ${r.e}) but is not flagged`);
      if (!/reproduced|near miss/i.test(r.v)) throw new Error(`"${r.f}" verdict "${r.v}"`);
      if (!r.rule.trim()) throw new Error(`"${r.f}" has no rule printed`);
    });
    console.log(`        ${rows.filter((r) => !r.miss).length} exact · ${rows.filter((r) => r.miss).length} near misses, every verdict computed from the two cells`);
  });

  await step('the three README near-misses are on screen as near-misses, with their rules', async () => {
    const want = [
      ['role-based curricula', '18', /1 per Rebuild role|one curriculum per Rebuild role/i],
      ['manager cascade scripts', '11', /decision-rights score is 4 or higher|decision.rights ≥ 4/i],
      ['supervisors briefed on decision rights', '340', /one per 10 people/i],
    ];
    const rows = await page.evaluate(() => [...document.querySelectorAll('.rt-row')].map((r) => ({
      f: r.querySelector('.f').innerText, d: r.querySelector('.d').innerText,
      e: r.querySelector('.e').innerText, miss: r.classList.contains('miss'),
      rule: (r.querySelector('.r') || {}).innerText || '',
    })));
    want.forEach(([label, deck, ruleRe]) => {
      const row = rows.find((r) => r.f === label);
      if (!row) throw new Error('no row for ' + label);
      if (!row.miss) throw new Error(label + ' is not shown as a near miss');
      if (row.d !== deck) throw new Error(`${label} deck value is ${row.d}, expected ${deck}`);
      if (row.d === row.e) throw new Error(label + ' deck and engine agree, so it is not a near miss');
      if (!ruleRe.test(row.rule)) throw new Error(`${label} does not print its derivation rule: ${row.rule}`);
    });
    console.log('        curricula 18→' + rows.find((r) => r.f === 'role-based curricula').e
      + ' · cascade scripts 11→' + rows.find((r) => r.f === 'manager cascade scripts').e
      + ' · supervisors 340→' + rows.find((r) => r.f === 'supervisors briefed on decision rights').e);
  });

  await step('the panel does not overstate — it names its own limits and refuses to validate the deck', async () => {
    const t = await page.locator('.card', { hasText: 'What this page is not claiming' }).innerText();
    if (!/not a validation of the deck/i.test(t)) throw new Error('does not disclaim validation');
    if (!/synthetic/i.test(t)) throw new Error('does not restate that the data is synthetic');
    if (!/built to be consistent with the deck/i.test(t)) throw new Error('does not admit the dataset was fitted to the deck');
    if (!/near misses are the honest part/i.test(t)) throw new Error('does not own the near misses');
  });

  await browser.close();
  console.log('\n--- real console/page errors: ' + errors.length + ' ---');
  errors.forEach((e) => console.log('  ' + e));
  process.exit(errors.length ? 1 : 0);
})();
