#!/usr/bin/env node
/**
 * Re-embeds data/roles.json into index.html as the offline hard fallback.
 *
 * index.html fetches data/roles.json at startup. The embedded copy is only used
 * when that fetch fails (file:// or no network). Run this after editing the
 * dataset so the two never drift:
 *
 *   node tools/embed-seed.js
 *
 * Not a build step — the site runs fine without ever running this; the embedded
 * copy just goes stale.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const jsonPath = path.join(root, 'data', 'roles.json');

const doc = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
// Accept either a bare array or { meta, roles: [...] }.
const roles = Array.isArray(doc) ? doc : doc && doc.roles;
if (!Array.isArray(roles) || !roles.length) {
  console.error('data/roles.json must be an array, or an object with a non-empty "roles" array');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const marker = /const SEED_ROLES = \/\*__SEED__\*\/[\s\S]*?;\n/;
if (!marker.test(html)) {
  console.error('marker "const SEED_ROLES = /*__SEED__*/...;" not found in index.html');
  process.exit(1);
}

const literal = JSON.stringify(roles, null, 2).replace(/<\//g, '<\\/');
const out = html.replace(marker, `const SEED_ROLES = /*__SEED__*/${literal};\n`);
fs.writeFileSync(htmlPath, out);
console.log(`embedded ${roles.length} roles (${literal.length.toLocaleString()} chars) into index.html`);
