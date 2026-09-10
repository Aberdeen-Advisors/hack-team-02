#!/usr/bin/env node
/**
 * Validates every role in every data file against the scoring rules the app
 * itself states and enforces in index.html:
 *
 *   - a role scores only when all six sub-factors are set ("incomplete" is a
 *     live-editing state for the Add-a-role form, not a state a shipped
 *     example dataset should ever be in)
 *   - every sub-factor that is set is a finite number on the 1-5 scale
 *   - a net-new role (isNewRole: true) scores 5 on "share of daily tasks
 *     changing" by definition - ANCHORS.taskShare's band 5 reads "Over 75%
 *     of daily tasks change, or the role is net-new" - never by data entry
 *   - basic structural integrity: non-empty id/role/siteArchetype, positive
 *     headcount and siteCount, unique ids within a file
 *
 * Run from the repo root: node tools/validate-data.js
 * Exits 1 if any contradiction is found, 0 if every role is clean.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const FILES = [
  'data/roles.json',
  'data/roles-healthcare.json',
  'data/roles-financial.json',
];

const IMPACT_KEYS = ['taskShare', 'frequencyVolume', 'errorConsequence'];
const RISK_KEYS = ['decisionRights', 'capabilityDelta', 'localReadiness'];

function isScore(v) {
  return typeof v === 'number' && isFinite(v);
}

function checkRole(role, errors) {
  const who = role.id || role.role || '(no id)';
  const fail = (msg) => errors.push(`${who}: ${msg}`);

  if (!role.id || typeof role.id !== 'string') fail('missing or non-string id');
  if (!role.role || typeof role.role !== 'string') fail('missing or non-string role name');
  if (!role.siteArchetype || typeof role.siteArchetype !== 'string') fail('missing or non-string siteArchetype');
  if (!isScore(role.headcount) || role.headcount <= 0) fail(`headcount is not a positive number (${role.headcount})`);
  if (!isScore(role.siteCount) || role.siteCount <= 0) fail(`siteCount is not a positive number (${role.siteCount})`);

  const impact = role.impact || {};
  const risk = role.risk || {};
  const allKeys = [...IMPACT_KEYS.map((k) => ['impact', k]), ...RISK_KEYS.map((k) => ['risk', k])];
  const valueOf = ([axis, k]) => (axis === 'impact' ? impact : risk)[k];
  const present = allKeys.filter((ak) => isScore(valueOf(ak)));
  const missing = allKeys.filter((ak) => !isScore(valueOf(ak)));

  if (present.length > 0 && missing.length > 0) {
    fail(`partially scored: missing ${missing.map((ak) => ak[1]).join(', ')} while `
       + `${present.map((ak) => ak[1]).join(', ')} ${present.length === 1 ? 'is' : 'are'} set. `
       + 'Shipped example data must be fully scored, not "incomplete".');
  }

  allKeys.forEach((ak) => {
    const v = valueOf(ak);
    if (isScore(v) && (v < 1 || v > 5)) fail(`${ak[0]}.${ak[1]} = ${v} is outside the 1-5 scale`);
  });

  if (role.isNewRole === true && isScore(impact.taskShare) && impact.taskShare !== 5) {
    fail(`isNewRole is true but impact.taskShare = ${impact.taskShare}, not 5. ANCHORS.taskShare band 5 reads `
       + '"Over 75% of daily tasks change, or the role is net-new" - a net-new role scores 5 on this sub-factor '
       + 'by definition, never by data entry.');
  }
}

let totalRoles = 0;
let totalErrors = 0;

FILES.forEach((rel) => {
  const file = path.join(__dirname, '..', rel);
  const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  const roles = Array.isArray(doc) ? doc : doc.roles;
  const errors = [];
  const seenIds = new Set();

  roles.forEach((role) => {
    if (role.id && seenIds.has(role.id)) errors.push(`${role.id}: duplicate id in this file`);
    if (role.id) seenIds.add(role.id);
    checkRole(role, errors);
  });

  totalRoles += roles.length;
  totalErrors += errors.length;

  console.log(`\n${rel} - ${roles.length} roles`);
  if (errors.length === 0) {
    console.log('  clean');
  } else {
    errors.forEach((e) => console.log(`  FAIL  ${e}`));
  }
});

console.log(`\n${totalRoles} roles checked, ${totalErrors} contradiction${totalErrors === 1 ? '' : 's'} found.`);
process.exit(totalErrors > 0 ? 1 : 0);
