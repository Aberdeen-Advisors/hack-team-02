/**
 * Local stand-in for Vercel: serves the static site and routes
 * POST /api/generate through the real api/generate.js serverless function.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

/* Repo root, resolved from this file's location: tools/verify -> repo root. */
const ROOT = path.resolve(__dirname, '..', '..');
const PORT = Number(process.argv[2] || 8123);
const handler = require(path.join(ROOT, 'api', 'generate.js'));

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.pptx': 'application/octet-stream',
};

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);

  // cleanUrls: /api/generate -> api/generate.js
  if (pathname === '/api/generate') {
    let raw = '';
    req.on('data', (c) => { raw += c; });
    req.on('end', async () => {
      try { req.body = raw ? JSON.parse(raw) : {}; } catch (e) { req.body = {}; }
      try { await handler(req, res); }
      catch (err) {
        console.error('handler threw:', err);
        if (!res.headersSent) res.statusCode = 500;
        res.end(JSON.stringify({ error: String(err && err.message) }));
      }
    });
    return;
  }

  if (pathname === '/') pathname = '/index.html';
  const file = path.join(ROOT, pathname);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    // SPA rewrite for anything not under /api/
    if (!pathname.startsWith('/api/')) {
      res.setHeader('content-type', TYPES['.html']);
      return res.end(fs.readFileSync(path.join(ROOT, 'index.html')));
    }
    res.statusCode = 404;
    return res.end('not found');
  }
  res.setHeader('content-type', TYPES[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
}).listen(PORT, '127.0.0.1', () => console.log('serving ' + ROOT + ' on ' + PORT));
