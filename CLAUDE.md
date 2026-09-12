# CLAUDE.md

Guidance for any Claude Code session working in this repository.

## What this is

A **client-facing consulting deliverable** for Aberdeen Advisors, presented to
external judges — not an internal prototype. Anything a client would not accept
in a printed deck does not belong on screen: no placeholder copy, no
lorem-ipsum plurals, no numbers that don't trace back to a stated rule.

The tool scores every Role × Site in an organization on two axes (Impact
Severity, Adoption Risk), assigns each row one of four intervention tiers
(Rebuild / Enable / Reassure / Inform), and generates training, communication
and adoption plans from those tiers. Three worked example projects ship with
it: Thornwood Consumer Products (38 roles, 5,000 people, manufacturing),
Bellcrest Health System (12 roles, 800 people, healthcare), and Ashford Mutual
Underwriting (10 roles, 150 people, insurance, single site).

For the full methodology, weight/threshold provenance, and what is inherited
vs. authored, read `docs/CONTEXT.md` — **but treat it as a design history, not
a current-state spec.** It documents a "Reproduced, not hardcoded" sixth tab
and a `DECK_FIGURES`/`DIVERGENCE`/`reproductionReport` comparison engine, and
a portfolio filter "by value stream and site archetype." **None of that exists
in the current `index.html`.** `ALL_TABS` has exactly five entries (Stakeholder
Impact / Redesign / Training / Communication / Adoption). `project.hasDeckReproduction`
is threaded into components as `citeDeck` and gates every claim that traces to
Team 2's own deck: the Rebuild super-user ratio (`onePagerText`), the
add-a-role site-scope hint (`AddRoleView`), the weights/threshold/anchors
provenance sentences on the weight tuner and the add-a-role form, and the
per-sub-factor `ANCHORS` origin/note text (`AxisBreakdown`, `Slider`).
`PlanView` alone still receives this same flag as `showDeckProvenance` and
reads nothing from it — that one prop is genuinely dead, the rest are live.
Every page-level "footnote" (Stakeholder Impact, Training, Communication, the
one-pager) reads exactly `"All figures illustrative. All data synthetic."` —
a "Method and provenance" accordion and per-tab provenance sentences used to
live there and were removed as a simplification pass; don't reintroduce them
without being asked. There is no "value stream" field in any data file and
no such filter in `PortfolioView`. Verify any claim in `docs/CONTEXT.md`
against the actual code before repeating it.

## Architecture

**One static HTML file, no build step, no `package.json`, no bundler.**
`index.html` is the entire app: React 18 + ReactDOM UMD, Chart.js, and Babel
Standalone doing the JSX transform live in the browser (`<script
type="text/babel">`). Every CDN `<script>` has a synchronous
`document.write` fallback to a vendored copy in `vendor/`, so the app still
runs on a hostile network or `file://`. This is deliberate — a judge can open
the file and it works. Do not introduce a bundler, a package manager, or a
build step to "fix" this.

`index.html` is organized in numbered comment banners — search for these,
not line numbers, since the file will keep growing. Grep for
`===========` to see the current list; each banner's own comment states
what it covers in more detail than a static summary here would stay
accurate for.

Other files:
- `styles.css` — design tokens, layout, print stylesheet.
- `api/generate.js`, `api/suggest-scores.js` — Vercel serverless functions
  (CommonJS, raw `fetch`, no SDK). Live Anthropic call if `ANTHROPIC_API_KEY`
  is set; otherwise a deterministic template fallback, HTTP 200, never an
  error shown to the user.
- `server.js` — dependency-free Node `http` server for local use; calls the
  same two `api/*.js` handlers unchanged, so prompts/schema/fallback logic
  are never forked between local and Vercel.
- `tools/embed-seed.js` — re-embeds `data/roles.json` into `index.html`'s
  hard fallback seed. **Run this after editing `data/roles.json`.**
- `data/roles.json`, `data/roles-healthcare.json`, `data/roles-financial.json`
  — the three example datasets, one schema (below).

**State is plain React state, mirrored into the URL hash, not a router
dependency.** `App()` owns `project`, `wizardActive`, `raw`, `dataSource`,
`tab`, `returnTab`, `selectedId`, `weights`, `filters` via plain `useState` —
none of it lives in a routing library. `THRESHOLD` is a fixed constant
(3.5), not state — there is no control anywhere in the app that changes it.
`buildHash`/`parseHash`/`syncRoute` encode the project, tab, open role,
filters and weights into
`#/:projectId/:tabId/[role/:roleId][?sa=&tier=&w=]` on
every navigation (`'replace'` for continuous edits like a slider drag,
`'push'` for a real navigation like a tab or project change), and a
`popstate` listener re-syncs every one of those pieces of state on Back/
Forward. A boot effect reads `window.location.hash` on first render, so **a
reload reproduces exactly what the hash encodes** — the project picker only
appears on a bare reload/link with no project segment, not on every reload.
This was deliberately built as hash-based (`#/...`), not
`history.pushState`-based path routing, so the app still works unmodified
from `file://` with no server. A "Copy link" control on the one-pager copies
the current `window.location.href` verbatim, so sending it reproduces the
sender's exact view.

## Role record shape

One schema, shared field-for-field across all three data files (only the
`siteArchetype` vocabulary differs per project):

| Field | Type | Notes |
|---|---|---|
| `id` | string | slug, used as React key / `selectedId` |
| `role` | string | display name |
| `siteArchetype` | string | a single archetype, or a `" + "`-joined combination (e.g. `"Plant + DC"`) |
| `siteCount` | number | drives super-user / site-coach counts |
| `headcount` | number | drives every per-head calculation |
| `deskless` | boolean | switches training/comms channel selection |
| `isNewRole` | boolean | display-only; does not change any formula |
| `summary` | string | one-paragraph before/after narrative |
| `impact` | `{ taskShare, frequencyVolume, errorConsequence }` | each 1–5, one decimal |
| `risk` | `{ decisionRights, capabilityDelta, localReadiness }` | each 1–5 |
| `before` / `after` | string[] | task lists on the one-pager |
| `tasksRemoved` / `tasksChanged` / `tasksNew` | numbers | feed the Rebuild "role redesign" dose and the redesign view |
| `fteDelta` | number | signed, shown as-is |
| `constraints` | string[] | one-pager display only, not scoring input |
| `deckNote` | string, optional | used once, on Plant Controller in Thornwood, to explain a deliberate score-vs-deck divergence |

`scores`, `tier`, `complete`, `missing` are **computed** by `scoreRole` at
load time — never stored in the data file.

## Scoring

Deterministic — never a model call. The weights, the 3.5 threshold (applied
**inclusively**, `>=`, on both axes), completeness gating, and tier
assignment are all directly readable in the SCORING ENGINE banner in
`index.html` (`scoreRole`, `assignTier`, `IMPACT_FACTORS`, `RISK_FACTORS`,
`effWeight`) — read those rather than trusting a restatement here.

## Derived plans

Everything is deterministic JS, driven off `DOSES`, `ASSUMPTIONS`, and the
Aberdeen delivery tables — never a model call. Training method, job-aid
counts, comms milestone dates, sandbox seats, cascade scripts and
supervisors-briefed are all short, directly-readable functions
(`trainingDesign`, `jobAidPlan`, `tierCommsTimeline`, `resourcedPlan`) — read
those rather than trusting a restatement here.

- **Budget share**: `aggregate()` weights headcount by the per-tier weight in
  `BUDGET_WEIGHT_PER_TIER` (derived from the `BUDGET_WEIGHTS` array, a
  module-level constant, not part of `ASSUMPTIONS`), calibrated against
  Thornwood's own 55/27/13/5 — see hard rules below on why this must not
  silently break for the other two projects. This percentage is the only
  cost-adjacent figure the app shows; there is no dollar-denominated cost
  model, rate card, or ROI computation anywhere in `index.html` — a prior
  version had one (`costModel`, `RateCardPanel`, `roiModel`/`RoiChart`) and
  it was removed entirely as a simplification pass. Don't reintroduce
  currency displays without being asked.

## `PROJECTS` registry

Everything that is not a role record — `name`, `industry`, `employeeCount`,
`oneLiner`, `dataPath`, `siteArchetypeBase`/`siteArchetypeCombos`,
`hasDeckReproduction`, `goLiveDate` — lives in the `PROJECTS` array in
`index.html`, one entry per example project. The data files' own `meta` block
carries only `totalHeadcount`/`roleCount`/`generated`. `SITE_ARCHETYPE_BASE`,
`SITE_ARCHETYPE_COMBOS`, and `SITE_CAPACITY` (the "one HQ, six plants, two
DCs" estate) are Thornwood-specific constants — Bellcrest and Ashford supply
their own `siteArchetypeBase` in their `PROJECTS` entry instead.

---

## Hard rules

- **NO project-specific facts hard-coded in components.** Role counts, site
  names, industry vocabulary, example site scopes, and provenance footnotes
  must all derive from the active project's data / `PROJECTS` entry. Every
  string rendered must be correct for both a 10-role single-site insurance
  firm (Ashford) **and** a 38-role multi-site manufacturer (Thornwood). Before
  writing a string in a component, ask: does this sentence still make sense
  if `siteArchetypeCombos` is empty, or `siteCount` is 1, or there is only one
  value in `siteArchetypeBase`?
- **Every derived number on screen must be traceable to a rule stated near
  it, and that rule must be true.** If copy says "see the X tab", tab X must
  actually contain X — check this explicitly; `showDeckProvenance` is a
  cautionary example of copy/wiring that outlived the feature it pointed to.
- **Tier colors are fixed and mean one thing only**: Rebuild = Jasper
  (`#DB504A` / `--chart-red` / `--t-rebuild-*`), Enable = Gold (`#F7D002` /
  `--chart-gold` / `--t-enable-*`), Reassure = Deep Sky Blue (`#5CC8FF` /
  `--chart-sky` / `--t-reassure-*`), Inform = Jade (`#00A676` /
  `--chart-jade` / `--t-inform-*`) — the Aberdeen brand's own chart-only
  secondary palette, defined once in `styles.css`'s `:root` and read from
  there by every tier badge, card, quadrant point and legend; `TIERS[*].hex`
  in `index.html` must stay a literal mirror of the same four values (canvas
  and inline SVG can't read CSS custom properties), not an independent
  second set of numbers. Never reuse these hues to encode anything else
  (status, health, completion, re-score freshness, etc.) anywhere in the
  app — pick a distinct palette for any other semantic (e.g. `rescoreStatus`'s
  green/yellow/red already needs to stay visually distinct from the tier
  wash).
- **Singular/plural, zero states and empty collections must render as
  deliberate copy, never as a raw templated string.** `"1 role"` vs `"38
  roles"`, `"0 incomplete roles"` vs a blank/undefined, an empty
  `siteArchetypeCombos` array producing no stray "Spans more than one
  archetype" group in a dropdown — every one of these needs an explicit
  branch, not `${n} thing${s}`-and-hope.
- **No em dash, anywhere in interface copy.** That covers every string a
  user reads: component JSX, the explainer's answers, the generated
  message drafts, the one-pagers, tooltips, and the prompts sent to the
  model in `api/suggest-scores.js` (so the model doesn't pattern-match the
  prompt's own punctuation into its output). Use a comma, a colon, a full
  stop, or restructure the sentence instead. Hyphens in compound words and
  number ranges are unaffected. Reason: an em dash is a common tell of
  machine-written prose, and this product's whole pitch is that its output
  reads like a person wrote it.

## Verification standard

After any change, check **all three projects** (Thornwood, Bellcrest, Ashford)
on **all five tabs** (Stakeholder Impact, Redesign, Training, Communication,
Adoption). Bellcrest and Ashford are where template assumptions written
against Thornwood's shape (multi-site combos, 5,000-person budget
calibration, deck-provenance footnotes) are most likely to break — Ashford in
particular has one site archetype (`HQ`) and no combos, so it is the sharpest
test of whether copy and filters degrade gracefully to a single-value case.
