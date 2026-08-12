# CONTEXT — Change Impact Assessment Tool

**Handover brief for Team 2 and for any fresh Claude Code session working on this repository.**
Aberdeen Advisors · AI Hackathon 2026 · Team 2 — Sarah Russell · Eptisam Ahmed · Harleen Arora.

Read this file first. It says what the tool is, what the methodology is, what is built, what we
authored versus what we inherited, which decisions are already settled, and what is still open.
Everything in it has been checked against the code, not just against earlier notes.

A formatted, shareable copy of this brief is published at
<https://claude.ai/code/artifact/7cbd7811-673b-4479-897d-414419004522>.

---

## 1. What this is

Hackathon prompt #7. A consumer-products company is rolling out a new operating model and a new ERP
platform to 5,000 employees across corporate and manufacturing. Leadership understands the
technology — the platform is selected, the sequence and go-live dates are set — but it does not know
the people impact: which roles actually change, where the capability gaps sit, where resistance will
come from, and whether each site can absorb it.

The tool answers that. It identifies stakeholder impacts role by role, shows how the affected work is
redesigned, and prescribes the training, communications and adoption interventions each population
needs — then costs the plan.

**Submission is due 6:00 PM ET on 12 August 2026.**

---

## 2. The methodology, as the source deck defines it

The source deck is `docs/team2_change_impact_assessment_tool.pptx` (16 slides). It is authoritative
for the method, and the method is deliberately small:

- **Unit of analysis: role × process × site.** The deck's reasoning (slide 5) is that this is the
  smallest thing that can own a training curriculum, a comms message, a super-user and a named
  accountable manager. Function level cannot; individual level does not scale.
- **Two axes, not one**, each scored 1–5, each with exactly three sub-factors (slide 7):
  - *Impact severity* — share of daily tasks changing; frequency and volume of the affected task;
    consequence of error (safety, financial control, service level).
  - *Adoption risk* — capability delta (skill required vs. current); change in decision rights;
    local readiness (site leadership capacity, change fatigue, digital maturity, deskless access).
- **Threshold 3.5 on both axes**, and in this build the rule is **inclusive** — exactly 3.5 counts as
  above the line.
- **Four intervention tiers from the quadrant** (slide 8), wording verbatim from the deck:
  *Rebuild* (high impact, high risk) — role redesign, sandbox training, on-site super-user, manager
  coaching. *Enable* (high impact, low risk) — role-based training, job aids, recruit as champions.
  *Reassure* (low impact, high risk) — manager cascade, address the fear not the skill.
  *Inform* (low impact, low risk) — broadcast comms only.

The exact formula the engine uses, with the weights, is:

```
impactSeverity = 0.45 × share of daily tasks changing
               + 0.25 × frequency and volume of the affected task
               + 0.30 × consequence of error

adoptionRisk   = 0.40 × change in decision rights
               + 0.35 × capability delta
               + 0.25 × local readiness gap        (5 = least ready)
```

Each axis is rounded to one decimal before the threshold is applied. Weights are normalised per axis,
so a score can never leave the 1–5 scale, and zeroing a whole axis degrades to an equal split rather
than dividing by zero. **The six weights are ours, not the deck's** — see §5.

---

## 3. Architecture, and why

**One static page, no build step.** `index.html` is the whole app: React 18 and ReactDOM UMD, Chart.js
for the charts, and Babel Standalone doing the JSX transform in the browser. All four libraries load
from CDN with a vendored local copy in `vendor/` as a synchronous fallback, so the demo survives a
hostile conference network or a machine with no connectivity. There is no `package.json`, no bundler
and no `npm install`. That is a deliberate constraint, not an accident — it means a judge can open the
file and it works.

**Scoring is deterministic JavaScript and is never a model call.** `scoreRole`, `assignTier` and the
axis arithmetic all run locally in the browser, instantly and identically every time. A model is used
for exactly four things, all qualitative and all per role: the role-redesign narrative, the training
curriculum, the comms message for that population, and the adoption actions.

**`api/generate.js`** is a Vercel Node serverless function (CommonJS, raw `fetch`, no SDK — because
there is no build step to install one). It takes the already-assigned tier, axis scores, sub-factor
scores, before/after task lists, constraints and resolved delivery standards, and returns those four
sections against a strict JSON schema. Behaviour:

- With `ANTHROPIC_API_KEY` set in the environment, it calls the Anthropic Messages API and returns
  `"source": "anthropic"`. The UI shows a green **live** marker.
- With no key, or on any error, refusal or timeout, it returns deterministic template-generated
  content with **HTTP 200** and `"source": "fallback"`. The UI shows a small **offline content**
  marker. A demo never shows an error.
- If the endpoint itself is unreachable — a plain static host, `file://`, no network — the client
  falls back again to its own local template generator in `index.html`.

The fallback is written to be presentable: it is driven by the same tier, doses, modifiers and
sub-factor scores the model receives, so it still names the decision-rights shift where one exists and
still switches to deskless delivery where the population has no inbox.

**Running it locally.** From the repo root, any static server:

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

Opening `index.html` straight off the filesystem also works — `data/roles.json` cannot be fetched over
`file://`, so the page uses the copy of the dataset embedded in it as a hard fallback. To exercise
`/api/generate` you need a host that runs the function (Vercel, or the small local stand-in described
in §9). After editing `data/roles.json`, run `node tools/embed-seed.js` so the embedded copy does not
go stale.

---

## 4. What is built

Five screens, all in `index.html`:

1. **Portfolio heat map.** Every role plotted on impact severity × adoption risk, with the 3.5
   gridlines and the four labelled quadrants. Points sized by headcount, coloured by tier. Filters by
   value stream and site archetype. Summary tiles for roles, people and share of change budget per
   tier. A sortable role table. A **Weighting — ours, and tunable** panel: drag any of the six weights
   and the whole portfolio re-tiers live, with one-click reset. Rows missing any sub-factor are listed
   as *incomplete* rather than scored.
2. **Role one-pager.** Before/after task lists, the removed/changed/new counts and FTE delta, both
   axis scores with the full sub-factor arithmetic shown so the number is auditable, the 1–5 anchor for
   each sub-factor with its provenance, the assigned tier and its package with doses, the resolved
   delivery detail for that role, and the four generated sections. Copy to clipboard, or print to PDF.
3. **Add a role.** Score a role live in the room. Each slider shows the 1–5 anchor for the value you
   are on, with the full ladder and its provenance one click away. Sub-factors start unset: the panel
   reads *incomplete*, with no score and no tier, and submit stays disabled until all six are set. On
   submit the role lands on the heat map and its one-pager opens.
4. **Costed plan / ROI.** The two productivity curves through go-live, dip depth and recovery tiles, a
   computed productivity-loss-avoided figure, the delivery standards the packages are built from, and
   the resourced plan — with the derivation rule printed beside every number.
5. **Reproduced, not hardcoded.** The deck's own published figures side by side with what the engine
   computes, live. Every verdict on the page is decided by comparing the two cells, so the panel
   cannot flatter itself, and each divergence prints the rule that produced it.

**The dataset** is `data/roles.json`: **38 roles, 5,000 people, entirely synthetic**. It carries five
ERP value streams plus a `Cross-cutting` label used by four roles the deck treats as spanning all
streams, and four base site archetypes (HQ, Plant, DC, Field/Commercial) plus three combined values for
roles that span more than one (`HQ + Plant`, `HQ + DC`, `Plant + DC`). Nine roles are flagged deskless;
one (Master Data Steward) is net-new.

**Decided: roles that span archetypes now say so.** The site estate is one HQ, six plants and two DCs,
so a row could claim more sites than its declared archetype can hold. Four rows did. All four were
audited against slide 10's own Sites column, and in every case the *count* was right and the
*archetype* was too narrow — the deck itself writes `HQ+6` for Master Data Steward and `HQ+2` for
Customer Service, so spanning roles are the deck's own model, not our invention. No site count was
changed:

| Role | Was | Now | Why the count was already right |
|---|---|---|---|
| Warehouse Team Lead | `DC`, 8 sites | `Plant + DC` | shifts run in the six plant warehouses and both DCs: 6 + 2 = 8. The row's own summary already said so |
| Master Data Steward | `HQ`, 7 sites | `HQ + Plant` | slide 10 prints `HQ+6`: HQ plus the six plants = 7 |
| Customer Service — Order Entry | `HQ`, 3 sites | `HQ + DC` | slide 10 prints `HQ+2`: the three service centres are one at HQ and one at each DC |
| Customer Service — Claims & Returns | `HQ`, 3 sites | `HQ + DC` | same three service centres as Order Entry; not in the deck, but modelled on the row that is |

The 8 on Warehouse Team Lead stays load-bearing — it is still what produces the engine's 8 site change
coaches — but it is now defensible on its face instead of needing a verbal patch. The divergence
against the deck's 6 is unchanged and still stated as a divergence on the Reproduced tab and in the
README: the deck counts plants, the engine counts every site carrying a Rebuild role, and this role
spans plants and DCs.

Filtering is component-aware to match: picking `Plant` returns the plant-only roles *and* the roles
that span plants, because a filter that hid Warehouse Team Lead from the plant view would be lying
about where those people work. Picking a combined value narrows to the spanning rows exactly.

**It reproduces the deck's published figures by computation, not by hardcoding.** On a clean load the
Reproduced tab runs **24 comparisons: 18 exact, 6 near misses**. The exact matches include slide 9's
whole tier table (9/620, 14/1,180, 11/1,340, 4/1,860 — 38 roles, 5,000 people), slide 10's axis scores
and tiers for all seven roles the deck names, slide 13's 42 super-users, 62 sandbox seats, 9 deskless
formats, 4 message tracks and 8 weeks hypercare, and slide 14's dip depth (22% → 11%), recovery
(14 → 6 weeks) and **$5.3M** loss avoided.

Four of the six near misses are plan numbers that land near but not on the deck, each from a printed
rule rather than an assertion:

| Figure | Deck | Engine | Rule |
|---|---|---|---|
| Role-based curricula | 18 | **14** | 1 per Rebuild role (9) + 1 shared per value stream in Enable (5) |
| Manager cascade scripts | 11 | **13** | 1 per Rebuild role + 1 per non-Rebuild role with decision rights ≥ 4 |
| Supervisors briefed | 340 | **314** | 1 per 10 people in Rebuild, Enable or Reassure roles |
| Site change coaches | 6 | **8** | 1 per site carrying a Rebuild role — the widest-spread Rebuild role is Warehouse Team Lead at 8 sites, where the deck's 6 counts plants only |

The other two near misses are Plant Controller's adoption risk (§6) and the budget share
(54/27/14/5 against the deck's 55/27/13/5, which falls out of our own per-head cost weighting and
lands within a rounding point).

The **$5.3M** is computed, and moves the moment a role is added: integrate the gap to baseline under
each curve across weeks 0–16 (trapezoidal) → 214 vs. 61 percentage-point-weeks; the difference / 100 =
1.53 productive weeks recovered per head; × a loaded cost of $100,000 / 52 = $2,942 per head; ×
the 1,800 people in Rebuild + Enable = $5.3M.

---

## 5. Provenance — read this before presenting

This is the section that matters most in front of a client or a judge. Be precise about what is
inherited and what we authored.

- **The weights are ours.** The source deck states no weights and no aggregation method anywhere. A
  keyword sweep of all 16 slides returns nothing for "weight", "weighted", "average", "mean" or
  "formula". Never cite the deck as the source of the six numbers. They are exposed as sliders in the
  UI precisely so that this is visible rather than hidden.
- **The tier-to-tactic mapping is ours.** Neither the source deck nor Aberdeen's OCM material contains
  one. Aberdeen's material supplies methods, durations, ranges, milestones, escalation layers,
  cadences and metrics; pairing them to Rebuild / Enable / Reassure / Inform is our extension of it.
- **The delivery specifics come from Aberdeen's own OCM material**, which is Aberdeen's to use: the
  training method table and durations (instructor-led 1–4 hrs, virtual 0.5–1.5 hrs, web-based
  15–90 min, nano-learning 1–5 min, job aids 1–30 min); job-aid counts scaling with impact (low 2,
  medium 5–9, high 6–9); the five communications milestones with their objectives (Kick-Off *promote
  awareness*, Cutover News *set expectations*, Training Awareness *provide resources*, Go-Live *drive
  adoption*, Post Go-Live Support *reinforce changes*); the four-layer support escalation (job aids →
  project team → trainers and implementation leads → leadership); the cadences (readiness reassessed
  every 3–4 months, adoption measured over a six-month window); and the adoption metrics (unique
  sign-ons, business processes opened and completed, job-aid access rates, go-live communication click
  rates, HR case volume, qualitative feedback).
- **The 1:15 super-user ratio comes from Team 2's own deck (slide 13)**, not from Aberdeen's material,
  which states no ratio anywhere. Do not attribute it to Aberdeen.
- **The 3.5 threshold.** The generic risk grids in the reference instruments cut at a per-item mean of
  **3.0**. 3.5 is where a source grades a **named person's competency** — the sponsor assessment's
  "good" floor, 70 of 100. So we tier risk one full point stricter than the generic convention, and we
  do it deliberately, because a 5,000-person go-live is less forgiving than a generic change. **Never
  claim that a source uses 3.5 for risk tiering.** It does not.
- **Prosci material.** The mechanics — two axes, item scores, a quadrant, band tables — are generic and
  safe to reimplement. The *item wording* is licensed and must not be embedded in the product. All
  item and anchor text in the app is original or Aberdeen's: the app's own files — `index.html`,
  `styles.css`, `api/`, `data/roles.json`, `tools/` — carry no Prosci item bank, assessment items or
  tactic lists. The local-readiness anchor ladder used to paraphrase two Prosci scale-pole phrases
  (change saturation, manager change competency); **all five of its bands have been rewritten in our
  own wording**, and its on-screen badge now attributes the construct to our own deck and the band
  wording to us. One caveat, so nobody is caught out: `docs/source-synthesis.md` is an internal cited
  evidence document and *does* quote Prosci items verbatim, with source references, for grounding.
  That is a different use from shipping wording in a product — it is not client-facing and nothing in
  it feeds the app. Keep the hygiene claim scoped to the product, not to the whole repository.
- **Most of the dataset is our illustration.** The deck names only **7 of the 38 roles** (slide 10) and
  gives **no 1–5 anchors for any sub-factor** — no definition of what a 4.2 on capability delta means.
  So the other 31 roles, every headcount and site count outside those seven, and every sub-factor value
  in the file are our synthetic illustration, built to be internally consistent with the deck's tier
  table and its seven named roles. The anchors are ours too, and each one carries a badge on screen
  saying how well grounded it is — capability delta is Aberdeen's own band wording at 1, 3 and 5;
  frequency and volume is ours end to end, because no source in the evidence base measures it at all.

---

## 6. Decisions already made — do not relitigate these

- **Scoring is deterministic, not a model call.** It has to be reproducible on stage and auditable on
  screen. The model writes prose only.
- **Plant Controller's adoption risk is 3.4 in the dataset, on purpose.** The deck prints 3.6 and
  labels the role *Enable* — which contradicts its own 3.5 threshold, since 3.6 would tier it Rebuild.
  The dataset resolves the deck's inconsistency in favour of the tier the deck assigns.
- **Completeness gating.** A role scores only when all six sub-factors are set. Anything less renders
  as *incomplete* — no score, no tier, not plotted — in the role table, on the one-pager, and in the
  add-a-role form, where submit stays disabled. A half-filled row must never look authoritative.
- **Weights are exposed as tunable sliders** rather than buried. If someone challenges them, hand them
  the panel.
- **The threshold is inclusive at 3.5** on both axes.
- **One row is one role in one value stream at one site archetype.** The deck is ambiguous — slides 5
  and 13 describe role × process × site while slides 9 and 10 tier at role level — and the tool states
  on screen that tiering at row level is our choice.

---

## 7. State, and what is open

- **A live deployment is not required for submission.** The organisers confirmed the GitHub repository
  *is* the submission, and judges can open the HTML directly. The app runs from a local file with no
  server.
- **The Vercel project does not exist**, and sessions cannot create one — but that no longer blocks the
  live model-generated path. **`server.js`** is a small dependency-free Node server (plain `http`, no
  Express, no build step) that serves the static app and, for `POST /api/generate`, calls
  `api/generate.js`'s exported handler directly and unchanged — so the prompts, schema and fallback
  logic are never forked. It reads `ANTHROPIC_API_KEY` from `.env` and keeps it only in the server
  process's environment; the key is never sent to or visible in the browser. **`start.bat`** in the repo
  root launches `node server.js` and opens `http://localhost:3000` automatically, so double-clicking it
  is the whole "run the app" experience. With a key in `.env` the app now calls Anthropic live and shows
  the green **live** marker; without one it serves the same deterministic fallback text behind the
  *offline content* marker as before. This is a local convenience only, not a deployment: an API key
  still goes only in `.env` (or a future Vercel project's environment variables) — **never in the
  repository**, and never in a commit, an issue or a slide. The repo carries a `.gitignore` and an
  `.env.example` with an empty value, so a key used for local testing cannot be committed by accident.
- **The final PowerPoint is to be 3–4 slides, and Sarah is handling it.** Do not build a deck.

---

## 8. How the work is judged

| Criterion | Weight |
|---|---|
| Build Quality / MVP | 30% |
| Path to Market | 25% |
| Business Value | 20% |
| Problem Understanding | 15% |
| Aberdeen Labs reusability | 10% |

The organisers **penalise submissions that are only frameworks or plans**. The working tool is the
submission; the strongest single thing to show is the *Reproduced, not hardcoded* tab, because it is
the argument that this is an engine rather than a slide.

---

## 9. How to work on it

**Where things live.** `index.html` is the whole app and is organised in numbered sections: (1) the
scoring engine — `THRESHOLD`, `IMPACT_FACTORS`, `RISK_FACTORS`, `ANCHORS`, `scoreRole`, `assignTier`;
(2) tier packages and **`DOSES`** — every dose the tool prescribes is in that one object, with
`ASSUMPTIONS` (costing and planning constants) beside it, and the Aberdeen delivery material
(`TRAINING_METHODS`, `JOB_AID_BANDS`, `COMMS_MILESTONES`, `SUPPORT_LAYERS`, `ADOPTION_METRICS`,
`CADENCE`) just after; (3) the aggregation, `roiModel` and `resourcedPlan`; (3b) `DECK_FIGURES`,
`DIVERGENCE` and `reproductionReport`; (4) the embedded dataset seed; (5) the generation client; then
the components and the five views. Short honest provenance strings live in one `NOTE` object near the
top and are rendered verbatim on screen, so the claims the tool makes are the claims it can defend.
`styles.css` holds the design tokens, the layout and the print stylesheet. `data/roles.json` is the
dataset. `api/generate.js` is the serverless function. `docs/source-synthesis.md` is the evidence base
with citations, marked `[quoted]` / `[ours]` / `[silent]` line by line — check a provenance claim there
before repeating it.

**Verification suites.** Three Playwright suites exist — `verify.js` (25 checks: rendering, filters,
tooltips, the arithmetic on screen, both modifiers, the API fallback path, the vendored-library
fallback, clipboard, ROI, the resourced plan, live re-scoring, responsive widths, print, and a
`file://` run), `verify2.js` (20 checks: provenance wording, the weights-are-ours labelling, the
inclusive threshold, completeness gating, weight-slider safety at the extremes, and the
Aberdeen-derived delivery content), and `verify3.js` (23 adversarial checks: the exact-threshold
boundary, one role per tier, extreme headcounts, hostile role names, the anchors, the hypercare floor
and the reproduction panel). All 68 checks pass on the current build.

They live in the working session's scratchpad rather than in the repository, so a fresh session will
not have them and should either re-create them or ask for them to be copied in. To run one you need a
static server on `127.0.0.1:8123` (a small `serve.js` stand-in also routes `POST /api/generate` through
the real function), Playwright available on `NODE_PATH`, and then `node verify.js`. Expect four blocked
CDN loads and a Babel in-browser warning; both are normal in a sandbox and the vendored fallback covers
them.

**Rules of the road.**

- **All data stays synthetic.** No client data, no real HRIS extract, no real readiness-pulse result
  goes into this repository, ever.
- No API key, token or credential in the repository, in a commit message, or on a slide.
- If you change a number the deck also publishes, check the Reproduced tab afterwards. If it starts
  failing, that is the panel being honest — fix the cause or print the rule, do not hide the row.
- If you change `data/roles.json`, run `node tools/embed-seed.js`.
- Keep every claim on screen defensible. If a figure is ours, the UI should say so.
