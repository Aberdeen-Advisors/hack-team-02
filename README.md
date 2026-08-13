# Change Impact Assessment Tool

**Aberdeen Advisors · AI Hackathon 2026 · Team 2 — Sarah Russell · Eptisam Ahmed · Harleen Arora**

Turning any workforce-scale rollout into a targeted, role-by-role adoption plan.

Leadership usually knows the technology being deployed. It does not know the people impact: which
roles actually change, where the capability gaps sit, and what training, comms and support each
population needs. This tool scores every **Role × Site**, assigns an intervention tier, and generates
the redesign, training, communications and adoption package for each role.

The landing screen offers **three worked examples at three different scales and industries** — a
5,000-person consumer-products ERP rollout, an 800-person hospital EHR rollout, and a 150-person
insurance underwriting change — plus a **"Start new project"** wizard that scores a real engagement
live, with AI-assisted scoring suggestions from a free-text role description.

> All data in this repository is **synthetic**. All figures are illustrative.

---

## What it does

| Screen | What it gives you |
|---|---|
| **Project picker** | Three worked examples (same engine, three different scales/industries/change types) plus **Start new project**, which opens a two-step wizard: an engagement profile (company, sites, go-live date, sponsor), then role data — imported from a CSV template, added one at a time, or both. Each role gets a free-text description of what changes, and an **AI-suggested** first pass at the six sub-factor scores (or a flagged **placeholder** if no model is reachable) that a human reviews and edits before anything is added to the portfolio. |
| **Stakeholder Impact** (heat map) | Every role plotted on impact severity × adoption risk, with the 3.5 gridlines and four labelled quadrants. Points sized by headcount, coloured by tier. Filters by site archetype. A **Weighting — ours, and tunable** panel that re-tiers the whole portfolio live. Summary tiles for roles, people and share of change budget per tier, plus a sortable role table that shows incomplete rows as *incomplete* rather than scoring them. |
| **Redesign** | Before/after task counts (removed, changed, new) and the net FTE delta, scanned across the whole portfolio at once, filterable by tier. |
| **Training** | Method, duration and job-aid count per role, derived from tier, complexity and deskless status, next to the Aberdeen-derived delivery standards (method table, job-aid bands) those choices are built from. |
| **Communication** | A timed milestone plan per tier, anchored to the project's go-live date where one is set, plus the per-role go-live channel and whether a manager-cascade script is needed. |
| **Adoption** | Post-go-live tracking: re-score status by tier against each tier's cadence, simulated training-completion sliders, and simulated adoption metrics (sign-ons, processes completed, job-aid access, comms click-through, HR case volume, qualitative feedback). Everything here is simulated for the demo, not measured, with the rule behind each number stated alongside it. |
| **Role one-pager** | Reachable by clicking any role from any tab. Before/after task lists, both axis scores with their full sub-factor arithmetic shown so the number is auditable, the assigned tier and its package with doses, the delivery detail for that role, and four generated narrative sections. Copy to clipboard, or print to PDF. |

---

## The unit of analysis

**One row = one role at one site scope — role × site.** A site scope is either a single archetype
(HQ, Plant, DC, Field/Commercial, or a project's own site types) or a named combination of them
(`Plant + DC`), because some roles genuinely work across more than one — the source deck does this
too, printing `HQ+6` and `HQ+2` in slide 10's Sites column. This is *our* choice, and the tool says so
on screen. The deck is ambiguous about it: slides 5 and 13 describe the unit as role × process × site,
while slides 9 and 10 tier at role level. We tier at the row level, because that scope is the smallest
thing that can own a curriculum, a message, a super-user and a named accountable manager.

## How the scoring works

Two axes, three sub-factors each, every sub-factor scored 1.0–5.0. **The engine is deterministic
JavaScript — it is never an LLM call.** It runs instantly and identically every time.

```
impactSeverity = 0.45 × share of daily tasks changing
               + 0.25 × frequency and volume of the affected task
               + 0.30 × consequence of error            (safety, financial control, service level)

adoptionRisk   = 0.40 × change in decision rights
               + 0.35 × capability delta                (skill required vs. current)
               + 0.25 × local readiness gap             (site leadership capacity, change fatigue,
                                                         digital maturity, deskless access; 5 = least ready)
```

**The six weights are ours — our default, and tunable.** The source deck states no weights and no
aggregation method, so nothing in this repository may cite it as their source, and nothing on screen
does. The Portfolio tab carries a **Weighting — ours, and tunable** panel: drag any of the six and the
whole portfolio re-tiers live, with a one-click reset back to the default above. Weights are
normalised per axis, so a score can never leave the 1–5 scale, and zeroing an entire axis degrades to
an equal split rather than dividing by zero.

### What a score means — the 1–5 anchors

The deck states the 1–5 scale twice and **never defines a single point on it**, for any sub-factor or
either axis. So the tool supplies the anchors, and every slider in the app — the new-project wizard's
role-review sliders included — shows the matching descriptor as you drag, so a score reads as a
description rather than a bare number. The full ladder for each sub-factor, with its provenance, is one
click away under each slider, and the anchors also appear on the one-pager's sub-factor breakdown and
in the copied text.

**They are not equally well grounded, and each one says which it is.** The badge under each slider is
the honest label, not decoration:

| Sub-factor | Anchor provenance |
|---|---|
| **Capability delta** | The best-supported of the six. Anchors 1, 3 and 5 are **Aberdeen's own band wording** (Knowledge & Skills, Organization & Roles); only the observable content at 2 and 4 is ours. |
| **Consequence of error** | Bands follow the **Openlink client plan**, the only source that bands consequence on named levels with written descriptors. Two authored moves: it has four bands and we need five, so 3 is our interpolation — and **no source scores safety consequence at all**, so the safety limb at 5 is ours. |
| **Share of daily tasks changing** | Aberdeen's own process-change band wording, on a generic low-to-high magnitude ladder; **the percentage cut-offs are ours** — no source expresses task share as a percentage. |
| **Change in decision rights** | **Our ladder**, over Aberdeen's driver vocabulary at 1, 2 and 4, with our own deck's sentence as the anchor at 5. No instrument in the evidence base scores decision rights as its own dimension — which is why it is in our model. |
| **Local readiness gap** | The four limbs — site-leadership capacity, change fatigue and change history, digital maturity, deskless access — are **our own deck's definition** (slide 7); **all five band descriptions are our wording**, written against the construct rather than lifted from an instrument. The limbs are unevenly evidenced: leadership capacity and change fatigue are measured by published instruments (whose licensed wording we do not reproduce), **digital maturity is scored by no source**, and deskless access rests on a single Aberdeen sentence. Score each limb and take the highest, not the mean — that recommendation is ours. |
| **Frequency and volume** | **Ours end to end.** The least grounded of the six: no source in the evidence base scores task frequency or volume. Team 2 added this sub-factor. The honest defence is that it is countable from the system transaction lists our deck already names as an input — and it is the one most likely to be challenged. |

If someone asks where a 4 comes from, that table is the answer, and the tool prints it rather than
hiding it. See `docs/source-synthesis.md` §2 for the full derivation of every ladder.

**Completeness gating.** A role scores only when all six sub-factors are set. Anything less renders as
**incomplete** — no score, no tier, not plotted — in the role table and on the one-pager. The
new-project wizard's role-review list flags incomplete rows the same way before you finish the wizard,
so a half-filled row can never look authoritative on the heat map.

Each axis is rounded to one decimal. **The threshold sits at 3.5 on both axes, and the rule is
inclusive — a score of exactly 3.5 counts as above the line.** 3.5 is the “good” floor used in the
sponsor competency assessment we work from (70 of 100), **not** the midpoint of the 1–5 scale — that
would be 3.0. See `docs/source-synthesis.md` §8.4: every instrument that grades a named person's
competency cuts at 3.5, while the generic risk grids cut at 3.0, so our line is deliberately the
stricter of the two. Never say a source uses 3.5 for risk tiering. It gives the quadrant:

| | Adoption risk < 3.5 | Adoption risk ≥ 3.5 |
|---|---|---|
| **Impact severity ≥ 3.5** | **Enable** — role-based training · job aids · recruit as champions | **Rebuild** — role redesign · sandbox training · on-site super-user · manager coaching |
| **Impact severity < 3.5** | **Inform** — broadcast comms only | **Reassure** — manager cascade · address the fear, not the skill |

The quadrant does not label the role. It prescribes the intervention package — **and its dose**.

### Two modifiers, layered on top of the tier

These are what make the output specific rather than generic:

- `deskless === true` → on-shift micro-training at the line, laminated job aids in local language, the
  email channel dropped entirely, QR code at the shift huddle instead.
- `risk.decisionRights >= 4` → add a manager cascade script on decision rights, **whatever the tier**.
  Resistance is rarely "the software is hard". It is "I used to approve this, and now the system does."

### Tuning the doses on the day

Every dose the tool prescribes lives in one object, `DOSES`, near the top of the `<script>` block in
`index.html` — sandbox days, super-user ratio, coaching weeks, hypercare weeks, job aids, cascade
scripts, re-score cadence. Programme-level costing assumptions live next to it in `ASSUMPTIONS`.
Rebuild's numbers are the deck's own (3-day sandbox, 1 super-user per site, 1:15 in Rebuild roles,
6 weeks floor coaching, 8 weeks hypercare); Enable / Reassure / Inform are proportionally smaller.
The per-head cost weights used for share-of-change-budget are ours too, calibrated on the shipped
population — the deck states no cost weighting.

---

## What each tier actually gets, and where that content comes from

The tier packages are specific and defensible because they are built from Aberdeen's own OCM delivery
material, resolved per role:

| Element | Content | Source |
|---|---|---|
| Training method + duration | Instructor-led 1–4 hrs · Virtual instructor-led 0.5–1.5 hrs · Web-based 15–90 min · Nano-learning 1–5 min · Job aids 1–30 min. Instructor-led and virtual are train-the-trainer delivered; the rest self-driven. | Aberdeen method table |
| Method selection | High complexity → instructor-led; medium → virtual; low → web-based above 200 people, virtual below; **deskless → nano-learning on shift**; Inform → nano-learning only. Complexity is read off impact severity (≥ 4.0 high, ≥ 3.0 medium). | **Ours** |
| Job-aid volume | Low impact 2 · medium 5–9 · high 6–9, with the point inside the range scaling with impact severity | Ranges Aberdeen's; band cut-offs and the chosen number **ours** |
| Communications | Five milestones, each with its objective: Kick-Off *promote awareness* · Cutover News *set expectations* · Training Awareness *provide resources* · Go-Live *drive adoption* · Post Go-Live Support *reinforce changes*. Objective ladder: awareness → understanding → acceptance → commitment. | Aberdeen |
| Milestone channels | Deskless roles get huddle brief / QR board / line-side poster; desk-based get town hall, cascade, email, portal | **Ours** |
| Support after go-live | Four-layer escalation: job aids → project team → trainers and implementation leads → leadership (final escalation). | Aberdeen |
| Hypercare | **The floor deliverable in every tier, not a top-tier extra** — Aberdeen's lowest-ambition delivery tier is defined as training, go-live communications *and hypercare*. So all four tiers carry it and only the duration scales: **Rebuild 8 · Enable 4 · Reassure 2 · Inform 1 weeks.** It appears in every tier package, in the generated adoption actions for every tier, on the delivery-standards card and in the resourced plan, which reports the longest dose present. | Floor principle Aberdeen's; the 8 weeks is **our deck (slide 13)**; the step-down across the other three tiers is **ours** |
| Cadence | Readiness reassessed every 3–4 months; change network onboarded ~3 months pre go-live; role re-scored every 30–90 days by tier (the go-live gate) | Aberdeen (the 30-day re-score interval is the deck's, slide 16) |
| Adoption measurement | A six-month window after go-live, measured on unique sign-ons, business processes opened and completed, job-aid access rates, go-live communication click rates, HR case volume, qualitative feedback | Aberdeen |
| Super-user ratio | 1:15 in Rebuild roles | **Team 2's own deck, slide 13** |

### Provenance, stated plainly — and on screen

- **The tier → tactic mapping is ours.** Aberdeen's OCM delivery material contains *no* tier-to-tactic
  mapping. It supplies methods, durations, ranges, milestones, escalation layers, cadences and metrics;
  pairing them to Rebuild / Enable / Reassure / Inform is our extension of that material, and must never
  be presented as inherited from it.
- **The 1:15 super-user ratio is from our own deck (slide 13), not from Aberdeen's material**, which
  states no ratio anywhere. Do not attribute it to Aberdeen.
- **The six sub-factor weights and the aggregation method are ours.** The deck states neither.
- Aberdeen's stakeholder grid (impact × influence) is a useful "we did not invent this structure"
  reference, but influence is not the same axis as adoption risk, and the tool does not equate them.

The same three notes are printed in the UI: under the heat map, on the role one-pager beneath the
prescribed package, and on the Training and Communication tabs under their delivery-standards cards.

---

## Running it

No build step. No bundler. No `npm install`.

### Windows

Download the standalone `.exe` from this repo's **GitHub Releases** and run it directly — no Node
install required. Double-clicking `start.bat` from a checkout works the same way if you already have
Node on your machine: it launches `node server.js` and opens `http://localhost:3000` automatically.

### Mac (and Linux)

Clone the repo and run the server directly with Node:

```bash
node server.js
# then open http://localhost:3000
```

`server.js` is a small, dependency-free Node `http` server (no Express, no `npm install`). It serves
`index.html`, `styles.css`, `data/` and `vendor/`, and it runs `api/generate.js` and
`api/suggest-scores.js` **unchanged** for `POST /api/generate` and `POST /api/suggest-scores`, so the
prompts, schema and fallback logic are never forked between this local path and a Vercel deployment.

For the live model path, copy `.env.example` to `.env` and add your `ANTHROPIC_API_KEY` there — `.env`
is gitignored and must never be committed. `server.js` reads it from `.env` and keeps it only in its
own process; the key is never sent to or visible in the browser.

### Without Node at all

Any static file server works for the read-only parts of the app:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` straight off the filesystem also works — the role data is embedded in the page
as a fallback for exactly that case. Either way, `/api/generate` and `/api/suggest-scores` are not
served (there is no process running the functions), so the app falls back to its own local template
generator and placeholder scores respectively. **The demo never shows an error.**

### Deploying to Vercel

Vercel, framework preset **Other / none**. `vercel.json` sets `cleanUrls`, rewrites everything that
is not under `/api/` to `/index.html`, and raises both functions' timeout to 60s. Static files are
matched before rewrites, so `styles.css`, `data/` and `vendor/` are served normally.

The only environment variable is `ANTHROPIC_API_KEY`, and it is optional — see below.

> **As shipped, `ANTHROPIC_API_KEY` is unset.** It is not in the repository, so `/api/generate` and
> `/api/suggest-scores` answer **HTTP 200 with `"source": "fallback"`** and the app serves
> deterministic template content (or a flagged placeholder score) behind a small **offline content**
> marker. Everything works; the content is just written by local logic rather than by a model. To turn
> the live path on, set `ANTHROPIC_API_KEY` wherever you're running `server.js` or your Vercel project,
> and restart/redeploy — no code change.

---

## Where the LLM is, and is not

**Not** in the scoring. Scoring and tier assignment (`scoreRole`, `assignTier`, the 3.5 threshold) are
deterministic and always run locally in the browser, for every entry path — the three worked examples,
a role added through the new-project wizard, or one scored entirely by hand.

The LLM is used for two things, both of them assistive, never authoritative:

1. **The four qualitative sections of a role one-pager** — redesign narrative, training curriculum,
   comms message, adoption actions — grounded in that role's description, its sub-factor scores, its
   assigned tier and package, its before/after task lists and its constraints. `api/generate.js`.
2. **A first-pass suggestion for the six sub-factor scores** in the "Start new project" wizard, from a
   free-text description of what changes for a role — pre-filling the same sliders a human would
   otherwise set by hand, against the same anchor ladders, always labelled **"AI-suggested — review
   before finalizing"** and fully editable before the role is added. `api/suggest-scores.js`. It never
   touches `scoreRole`/`assignTier` — it only proposes numbers for the sliders.

`api/generate.js` is a Vercel Node serverless function:

```
POST /api/generate
  { role, tier, axisScores, subFactors, delivery, before, after, constraints }
→ { narrative, curriculum, comms, adoptionActions, source }
```

`delivery` carries the Aberdeen-derived design already resolved for that role — the chosen training
method and its duration, the job-aid count and band, the five comms milestones with their objectives and
this population's channels, the four-layer escalation, the cadences and the adoption metrics. The prompt
requires the model to use them verbatim, so the curriculum and comms sections cite a real method and a
real duration instead of generic advice. The local and server-side fallbacks do the same.

- With `ANTHROPIC_API_KEY` set it calls the Anthropic Messages API (`claude-sonnet-5`) with a strict
  JSON schema, and returns `"source": "anthropic"`. The client shows a green **live** marker.
- With no key, or on any failure or timeout, it returns a deterministic template-generated version
  with **HTTP 200** and `"source": "fallback"`. The client shows a small **offline content** marker.
- If the endpoint itself is unreachable (a plain static host, no network), the client falls back to
  its own local template generator. **The demo never shows an error.**

The fallback is written to be presentable on stage: it is driven by the same tier, doses, modifiers
and sub-factor scores the model receives, so it names the decision-rights shift where one exists and
switches to deskless delivery where the population has no inbox.

`api/suggest-scores.js` follows the same shape — `claude-sonnet-5`, strict JSON schema,
`"source": "anthropic" | "fallback"` — but its fallback is honestly a flat 3.0 across all six
sub-factors, not a deterministic estimate: there is no principled way to infer a score from free text
without a model, so it is labelled **placeholder** rather than passed off as an assessment.

---

## Repository layout

```
index.html                  the whole app — React 18 + ReactDOM UMD, JSX via Babel Standalone
styles.css                  design tokens and layout, including the print stylesheet
server.js                   dependency-free local Node server; run this directly (see Running it)
start.bat                   double-click launcher for server.js, Windows
data/roles.json             the flagship consumer-products dataset (synthetic); fetched at startup
data/roles-healthcare.json  the Bellcrest Health System example dataset
data/roles-financial.json   the Ashford Mutual Underwriting example dataset
data/role-import-template.csv  CSV template for the new-project wizard's role import
api/generate.js             serverless function for the four generated one-pager sections
api/suggest-scores.js       serverless function that AI-suggests the six sub-factor scores
vercel.json                 static config, cleanUrls, SPA rewrite that spares /api/
vendor/                     local copies of React, ReactDOM, Babel and Chart.js
assets/brand/               Aberdeen logo and favicon SVGs (light/dark variants)
tools/embed-seed.js         re-embeds data/roles.json into index.html as the offline fallback
tools/verify/                Playwright end-to-end suites — written against an earlier tab layout;
                             expect them to need updating before they pass against the current build
docs/                        the source deck, the evidence base and the team handover brief
```

**Libraries** load from CDN with a vendored local fallback, so the demo survives a hostile
conference network or a machine with no connectivity at all. Nothing here is compiled. There is no
`package.json` — the whole repo runs with nothing installed.

**After editing `data/roles.json`**, run `node tools/embed-seed.js` so the offline copy embedded in
`index.html` matches. The app works either way — the embedded copy just goes stale.

---

## What is synthetic, and what the deck actually gave us

The deck names **7 of the 38 roles** (slide 10) and gives **no 1–5 anchors for any sub-factor** — no
definition of what a 4.2 on capability delta means. The tool now supplies those anchors and labels each
one's provenance (see *What a score means* above); the dataset itself is still ours. So:

- the other **31 roles**, every headcount and site count outside those 7, and **every sub-factor value
  in the dataset** are our synthetic illustration, built to be internally consistent with the deck's
  tier table and its seven named roles;
- the seven named roles reproduce the deck's own axis scores exactly;
- no client data, real HRIS extract or real readiness-pulse result is present anywhere in this repository.

The two other worked examples (Bellcrest Health System, Ashford Mutual Underwriting) have no source
deck behind them at all — they are entirely our own synthetic illustration of the same engine at a
different scale and industry, and the app does not claim otherwise (`hasDeckReproduction` is `false`
for both).

### Licence hygiene

The shipped tool reproduces **no third-party licensed change-management content**. The assessment
sub-factors, the anchor and item wording, the tier packages and the tactic lists are our own or
Aberdeen's own delivery material; the dataset is synthetic.


## Notes for the presenters

- **Open on the project picker.** Three worked examples at three different scales and industries
  (5,000-person ERP, 800-person hospital EHR, 150-person insurance underwriting) show the same engine
  generalizes; **Start new project** shows it working live on a real engagement, not just the shipped
  data.
- **The new-project wizard is the money moment now.** Type a company, a couple of sites, and one role
  with a free-text description of what changes — the assistant proposes the six sub-factor scores
  against the same anchor ladders the manual sliders use, labelled **AI-suggested: review before
  finalizing**, and you can still drag every slider before finishing. Finish drops you straight onto
  that project's heat map.
- **If someone asks what a 4.2 on capability delta means, drag that slider** (on the one-pager, or in
  the wizard's role review). The anchor under it describes the score in Aberdeen's own words, and "All
  five anchors" opens the ladder with its provenance. Use **Frequency and volume** if you want to show
  the tool admitting a weakness: it is badged *OURS end to end — no source measures this*, in amber,
  and the note says it is the sub-factor most likely to be challenged. Volunteering that is more
  persuasive than being caught by it.
- **If someone challenges the weights, open the Weighting panel on Stakeholder Impact and hand it to
  them.** They are ours and they are tunable; drag one and the portfolio re-tiers live. Plant Buyer
  (in the consumer-products example) is the honest illustration: its impact severity is 3.8 on our
  default weighting but 3.3 if all the impact weight sits on consequence of error, which moves it out
  of Rebuild. Reset restores the default in one click.
- **If someone asks where the packages come from**, the answer is on the **Training** tab under
  *Delivery standards*: methods, durations, job-aid ranges, the five milestones, the four-layer
  escalation and the cadences are Aberdeen's own delivery material — **the mapping of tier to tactic
  is ours**, and the 1:15 super-user ratio is from our own deck, not Aberdeen's.
- **Plant Controller** (consumer-products example) carries an adoption risk of 3.4 in the dataset, so
  the fixed 3.5 threshold puts it in **Enable** — the tier the source deck's slide 10 assigns. Slide
  10's own 3.6 would tier it Rebuild; the dataset resolves the deck's internal inconsistency in favour
  of the tier the deck itself shows.
- **Warehouse Team Lead is the best role to demo.** It is the only role that trips both modifiers at
  once — deskless *and* a decision-rights shift — so the one-pager visibly rewrites the package:
  on-shift micro-training, laminated job aids, email dropped, plus a cascade script on decision
  rights.
- The four generated one-pager sections show an **offline content** marker until `ANTHROPIC_API_KEY`
  is set (in `.env` for `server.js`, or in the Vercel project). The fallback is presentable — it names
  the decision-rights shift and switches to deskless channels — so the demo is safe either way.
