# Verification suites

Three Playwright suites that drive the real app in a real browser, plus the static server they
need. Nothing here is hardcoded to a machine: every path resolves from this directory, so the
suites run wherever the repo is checked out.

| File | What it covers | Checks |
|---|---|---|
| `verify.js` | The core walkthrough: heat map, filters, one-pager, `POST /api/generate`, vendored-library fallback, clipboard copy, ROI chart, add-a-role, projector and narrow widths, print PDF, and a `file://` load with no server | 25 |
| `verify2.js` | The provenance and honesty pass: unit of analysis, weights-are-ours labelling, inclusive 3.5 threshold, completeness gating, weight-slider safety at the extremes, and the Aberdeen-derived delivery content | 20 |
| `verify3.js` | Adversarial: the add-a-role form at the exact threshold, one role per tier, 1-person and 2,000-person roles, hostile role names, the 1–5 anchor ladders and their badges, the hypercare floor, and the *Reproduced, not hardcoded* panel | 30 |

75 checks in total. All three exit `0` on success and non-zero on the first failure, so they can be
chained.

## Requirements

- Node 22 (`/opt/node22/bin/node` in this environment).
- **`NODE_PATH=/opt/node22/lib/node_modules` on every command.** Playwright is installed globally,
  not in this repo — there is no `node_modules/` here and no `package.json`, and without `NODE_PATH`
  the `require('playwright')` at the top of each suite fails.
- **`serve.js` must already be running on port 8123.** All three suites request
  `http://127.0.0.1:8123/`. `serve.js` is a local stand-in for Vercel: it serves the static site and
  routes `POST /api/generate` through the real `api/generate.js` function.

## Run them

From anywhere (paths inside the suites are resolved from the repo, not the working directory):

```bash
# 1. start the server — leave it running in its own shell, or background it
NODE_PATH=/opt/node22/lib/node_modules node tools/verify/serve.js
#    -> serving <repo> on 8123      (pass a port as argv[2] to override)

# 2. in another shell, run the suites in order
NODE_PATH=/opt/node22/lib/node_modules node tools/verify/verify.js
NODE_PATH=/opt/node22/lib/node_modules node tools/verify/verify2.js
NODE_PATH=/opt/node22/lib/node_modules node tools/verify/verify3.js
```

Backgrounded, in one shell:

```bash
NODE_PATH=/opt/node22/lib/node_modules node tools/verify/serve.js &
sleep 2
for f in verify verify2 verify3; do
  NODE_PATH=/opt/node22/lib/node_modules node "tools/verify/$f.js" || break
done
kill %1
```

## Notes on the output

- **`verify.js` writes screenshots and a print PDF** to `tools/verify/shots/` (git-ignored). Set
  `SHOTS=/some/other/dir` to send them elsewhere.
- **Blocked CDN loads are expected.** This sandbox has no outbound CDN access, so `verify.js`
  reports four blocked resource loads and then asserts the vendored copies in `vendor/` took over.
  That line is a pass, not a warning to fix.
- **`source=fallback reason=no_api_key` is expected** unless you have put a real key in `.env`.
  `api/generate.js` falls back to deterministic template content when `ANTHROPIC_API_KEY` is unset,
  and the suite asserts the client really made the round trip and got a 200 either way.
- **The one Babel warning is expected** — the app compiles JSX in the browser on purpose, so it has
  no build step to run before a demo.
- **`verify3.js` adds roles as it runs**, so the reproduction-panel counts it prints (`11 exact · 13
  near misses`, `curricula 18→22`) are the numbers for the mutated population, not the shipped
  38-role dataset. On a clean load that panel reads **24 comparisons, 18 exact, 6 near misses**. The
  suite computes every expectation from live state, which is why those figures move and still pass.
