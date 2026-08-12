#!/usr/bin/env node
/**
 * Local standalone server — replaces the Vercel deployment.
 *
 * Serves index.html, styles.css, data/, vendor/ (and anything else under the
 * repo root) as static files, and reuses api/generate.js and
 * api/suggest-scores.js UNCHANGED as the handlers for POST /api/generate and
 * POST /api/suggest-scores, so neither function's prompts/schema/fallback
 * logic is ever duplicated or forked between the Vercel and local paths.
 *
 * ANTHROPIC_API_KEY is read from .env and lives only in process.env on this
 * process. It is used server-side inside api/generate.js's call to the
 * Anthropic API and is never written into any response sent to the browser.
 *
 * No dependencies — plain Node http, matching the rest of the repo's
 * no-build-step, no-npm-install constraint.
 *
 *   node server.js
 *
 * or double-click start.bat, which launches this and opens the browser.
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

/* ------------------------------------------------------------------- .env */
/* Minimal KEY=VALUE parser — no dotenv dependency, per the repo's no-install
   constraint. Only fills in vars not already set in the real environment. */

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    if (!key || process.env[key] !== undefined) continue;
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(path.join(ROOT, '.env'));

const apiHandlers = {
  '/api/generate': require('./api/generate.js'),
  '/api/suggest-scores': require('./api/suggest-scores.js'),
};

/* --------------------------------------------------------------- statics */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

function isBlocked(relPath) {
  // Never serve dotfiles/dot-directories (.env, .git, .gitignore, ...) or
  // anything under api/ — the only thing api/ exposes is the POST endpoint.
  const segments = relPath.split(/[/\\]/).filter(Boolean);
  if (segments.some((s) => s.startsWith('.'))) return true;
  if (segments[0] === 'api') return true;
  return false;
}

function serveStatic(req, res, pathname) {
  let relPath = decodeURIComponent(pathname);
  if (relPath === '/' ) relPath = '/index.html';
  relPath = relPath.replace(/^\/+/, '');

  if (isBlocked(relPath)) {
    res.statusCode = 404;
    return res.end('Not found');
  }

  const filePath = path.join(ROOT, relPath);
  if (!filePath.startsWith(ROOT)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      return res.end('Not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader('content-type', MIME[ext] || 'application/octet-stream');
    res.end(data);
  });
}

/* ------------------------------------------------------------------ body */

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/* ----------------------------------------------------------------- server */

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  const apiHandler = apiHandlers[url.pathname];
  if (apiHandler) {
    if (req.method === 'POST') {
      try {
        req.body = await readBody(req);
      } catch (err) {
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        return res.end(JSON.stringify({ error: 'could not read request body' }));
      }
      return apiHandler(req, res);
    }
    if (req.method === 'OPTIONS') return apiHandler(req, res);
    res.statusCode = 405;
    res.setHeader('allow', 'POST');
    return res.end('POST only');
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    return res.end('GET only');
  }

  return serveStatic(req, res, url.pathname);
});

server.listen(PORT, () => {
  const key = process.env.ANTHROPIC_API_KEY;
  console.log(`Change Impact Assessment Tool running at http://localhost:${PORT}`);
  console.log(key ? 'ANTHROPIC_API_KEY loaded — live generation enabled.' : 'No ANTHROPIC_API_KEY set — serving deterministic fallback content.');
});
