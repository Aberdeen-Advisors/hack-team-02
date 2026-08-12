# Change Impact Assessment Tool

**Aberdeen Advisors · AI Hackathon 2026 · Team 2 — Sarah Russell · Eptisam Ahmed · Harleen Arora**

Turning a 5,000-person ERP deployment into a targeted, costed adoption plan.

A consumer-products company is rolling out a new operating model and a new ERP to 5,000 employees.
Leadership knows the technology. It does not know the people impact. This tool scores every
**Role × Value Stream × Site**, assigns an intervention tier, and generates the training, comms and
adoption package for each role — then costs the plan.

> All data in this repository is **synthetic**. All figures are illustrative.

---

## What it does

| Screen | What it gives you |
|---|---|
| **Portfolio heat map** | Every role plotted on impact severity × adoption risk, with the 3.5 gridlines and four labelled quadrants. Points sized by headcount, coloured by tier. Filters by value stream and site archetype. A **Weighting — ours, and tunable** panel that re-tiers the whole portfolio live. Summary tiles for roles, people and share of change budget per tier, plus a sortable role table that shows incomplete rows as *incomplete* rather than scoring them. |
| **Role one-pager** | Before/after task lists, the removed/changed/new counts and FTE delta, both axis scores with their full sub-factor arithmetic shown so the number is auditable, the assigned tier and its package with doses, the delivery detail for that role (training method and duration, job-aid count, the five comms milestones with objectives, the four-layer support escalation, the measurement window) and four generated narrative sections. Copy to clipboard, or print to PDF. |
| **Add a role** | Score a role live, in the room. Every slider carries a **1–5 anchor** that says what the score means as you move it, with the whole ladder and its provenance one click away. Sub-factors start unset: the panel reads **incomplete** with no score and no tier until all six are set, and only then does submit unlock. On submit the role lands on the heat map and its one-pager opens. |
| **Costed plan / ROI** | The productivity-through-go-live curves, dip depth and recovery tiles, a productivity-loss-avoided figure computed from the current population, the **delivery standards** the packages are built from (method table, job-aid bands, five comms milestones, four-layer escalation, hypercare floor, cadences, adoption metrics) and the resourced plan (curricula, sandbox seats, deskless formats, message tracks, cascade scripts, super-users, site coaches, hypercare weeks) with the derivation rule printed beside every number. |
| **Reproduced, not hardcoded** | The deck's own published figures next to what the engine computes, live: slide 9's tier table, slide 10's axis scores for all seven named roles, slide 13's resourced plan and slide 14's $5.3M. **24 comparisons, 18 exact, 6 near misses** — and every verdict on the page is computed by comparing the two cells, so nothing can claim a match it does not have. Each near miss prints the rule that produced it. |

---

## The unit of analysis

**One row = one role scoped to a single value stream and a single site archetype — role × process ×
site.** This is *our* choice, and the tool says so on screen. The deck is ambiguous about it: slides 5
and 13 describe the unit as role × process × site, while slides 9 and 10 tier at role level. We tier at
the row level, because that is the smallest thing that can own a curriculum, a message, a super-user
and a named accountable manager.

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
either axis. So the tool supplies the anchors, and the Add-a-role sliders show the matching descriptor
as you drag — a score reads as a description rather than a bare number. The full ladder for each
sub-factor, with its provenance, is one click away under each slider, and the anchors also appear on
the one-pager's sub-factor breakdown and in the copied text.

**They are not equally well grounded, and each one says which it is.** The badge under each slider is
the honest label, not decoration:

| Sub-factor | Anchor provenance |
|---|---|
| **Capability delta** | The best-supported of the six. Anchors 1, 3 and 5 are **Aberdeen's own band wording** (Knowledge & Skills, Organization & Roles); only the observable content at 2 and 4 is ours. |
| **Consequence of error** | Bands follow the **Openlink client plan**, the only source that bands consequence on named levels with written descriptors. Two authored moves: it has four bands and we need five, so 3 is our interpolation — and **no source scores safety consequence at all**, so the safety limb at 5 is ours. |
| **Share of daily tasks changing** | Aberdeen's process-change band wording over Prosci's magnitude ladder; **the percentage cut-offs are ours** — no source expresses task share as a percentage. |
| **Change in decision rights** | **Our ladder**, over Aberdeen's driver vocabulary at 1, 2 and 4, with our own deck's sentence as the anchor at 5. No instrument in the evidence base scores decision rights as its own dimension — which is why it is in our model. |
| **Local readiness gap** | Site-leadership capacity and change fatigue carry Prosci wording corroborated across two products. **Digital maturity is scored by no source**, and deskless access rests on a single Aberdeen sentence. Score each limb and take the highest, not the mean — that recommendation is ours. |
| **Frequency and volume** | **Ours end to end.** The least grounded of the six: no source in the evidence base scores task frequency or volume. Team 2 added this sub-factor. The honest defence is that it is countable from the system transaction lists our deck already names as an input — and it is the one most likely to be challenged. |

If someone asks where a 4 comes from, that table is the answer, and the tool prints it rather than
hiding it. See `docs/source-synthesis.md` §2 for the full derivation of every ladder.

**Completeness gating.** A role scores only when all six sub-factors are set. Anything less renders as
**incomplete** — no score, no tier, not plotted — in the role table, on the one-pager and, most
importantly, in the Add-a-role form, where the submit button stays disabled until the sixth slider is
set. A half-filled row can never look authoritative on stage.

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
prescribed package, and on the Costed plan tab under **Delivery standards behind every package**.

---

## The money figure

The productivity-loss-avoided figure is **computed, not hardcoded**, and moves the moment a role is
added. Every input is printed on screen next to it:

1. Integrate the gap to baseline for each curve across weeks 0–16 (trapezoidal) →
   214 pp·wks untargeted, 61 pp·wks targeted.
2. The difference / 100 = **1.53 productive weeks recovered per head**.
3. × loaded cost per head per week (`$100,000 / 52`) = **$2,942 per head**.
4. × headcount in **Rebuild + Enable** — the roles whose daily work materially changes.

On the shipped 38-role, 5,000-person population (1,800 people in Rebuild + Enable) this lands on
**$5.3M**, matching slide 14. Recovery is computed the same way: the first week each curve is back
within 6% of baseline gives **14 weeks → 6 weeks**, matching the deck.

The curves themselves are the deck's illustrative workbook values and are labelled as such.

---

## Running it

No build step. No bundler. No `npm install`.

```bash
# any static server, from the repo root
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` straight off the filesystem also works — the role data is embedded in the page
as a fallback for exactly that case.

For local development against the live model path, copy `.env.example` to `.env` and add your
`ANTHROPIC_API_KEY` there — `.env` is gitignored and must never be committed. Note that
`/api/generate` is a serverless function: it only runs behind a dev server that executes it (e.g.
`vercel dev`) or in a deployment. Opening `index.html` directly serves the built-in fallback content
regardless of what is in `.env`.

### Deploying

Vercel, framework preset **Other / none**. `vercel.json` sets `cleanUrls`, rewrites everything that
is not under `/api/` to `/index.html`, and raises the function timeout. Static files are matched
before rewrites, so `styles.css`, `data/` and `vendor/` are served normally.

The only environment variable is `ANTHROPIC_API_KEY`, and it is optional — see below.

> **As shipped, `ANTHROPIC_API_KEY` is unset.** It is not in the repository and it is not configured in
> the Vercel project, so `/api/generate` answers **HTTP 200 with `"source": "fallback"`** and the app
> serves deterministic template content behind a small **offline content** marker. Everything works; the
> four narrative sections are just written by the local template library rather than by a model. To turn
> the live path on, add `ANTHROPIC_API_KEY` in the Vercel project settings and redeploy — no code change.

---

## Where the LLM is, and is not

**Not** in the scoring. Scoring and tier assignment are deterministic and always run locally in the
browser.

The LLM writes **only** the four qualitative sections of a role one-pager — redesign narrative,
training curriculum, comms message, adoption actions — grounded in that role's description, its
sub-factor scores, its assigned tier and package, its before/after task lists and its constraints.

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

---

## Repository layout

```
index.html          the whole app — React 18 + ReactDOM UMD, JSX via Babel Standalone
styles.css          design tokens and layout, including the print stylesheet
data/roles.json     the role dataset (synthetic); fetched at startup
api/generate.js     Vercel serverless function for the four generated sections
vercel.json         static config, cleanUrls, SPA rewrite that spares /api/
vendor/             local copies of React, ReactDOM, Babel and Chart.js
tools/embed-seed.js re-embeds data/roles.json into index.html as the offline fallback
docs/               the source deck
```

**Libraries** load from CDN with a vendored local fallback, so the demo survives a hostile
conference network or a machine with no connectivity at all. Nothing here is compiled.

**After editing `data/roles.json`**, run `node tools/embed-seed.js` so the offline copy embedded in
`index.html` matches. The app works either way — the embedded copy just goes stale.

---

## What the engine reproduces from the deck

Run against the shipped 38-role dataset, the deterministic engine lands on the deck's own numbers
without any of them being hardcoded:

**This is on screen, not just in this file.** The **Reproduced, not hardcoded** tab prints the whole
comparison live and computes every verdict by comparing the deck's cell against the engine's, so the
claim can be checked in front of an audience rather than taken on trust. Totals: **24 comparisons, 18
exact, 6 near misses.**

| Deck | Deck says | Tool computes |
|---|---|---|
| Slide 9 — tier table | 9 / 620 / 12% · 14 / 1,180 / 24% · 11 / 1,340 / 27% · 4 / 1,860 / 37% | identical |
| Slide 9 — budget share | 55% · 27% · 13% · 5% | 54% · 27% · 14% · 5% — *near miss, see below* |
| Slide 10 — Plant Scheduler | 4.6 / 4.4 · Rebuild | identical |
| Slide 10 — Warehouse Team Lead | 4.1 / 4.7 · Rebuild | identical |
| Slide 10 — AP Specialist | 4.4 / 4.5 · Rebuild | identical |
| Slide 10 — Master Data Steward | 4.8 / 4.1 · Rebuild | identical |
| Slide 10 — Customer Service, Order Entry | 4.5 / 3.9 · Rebuild | identical |
| Slide 10 — Plant Buyer | 3.8 / 4.2 · Rebuild | identical |
| Slide 10 — Plant Controller | 4.3 / 3.6 · Enable | 4.3 / **3.4** · Enable — *near miss, see below* |
| Slide 13 — super-users | 42, at 1:15 in Rebuild roles | 42 |
| Slide 13 — sandbox seats | 62 | 62 |
| Slide 13 — deskless formats | 9 | 9 |
| Slide 13 — message tracks | 4 | 4 |
| Slide 13 — hypercare | 8 weeks | 8 |
| Slide 14 — dip depth | 22% → 11% | identical |
| Slide 14 — recovery | 14 weeks → 6 weeks | identical |
| Slide 14 — loss avoided | ≈$5.3M | $5.3M |

Six figures **do not match the deck, and are not claimed to**, because the tool derives them from a
printed rule rather than asserting them — the rule is shown beside each figure on the Costed plan tab
and again on the Reproduced tab:

| Figure | Deck | Tool | Rule the tool applies |
|---|---|---|---|
| Role-based curricula | 18 | **14** | 1 per Rebuild role + 1 shared per value stream in Enable |
| Manager cascade scripts | 11 | **13** | 1 per Rebuild role + 1 per non-Rebuild role with decision rights ≥ 4 |
| Supervisors briefed | 340 | **314** | 1 per 10 people in Rebuild, Enable or Reassure roles |
| Site change coaches | 6 | **8** | one per site carrying a Rebuild role — the widest-spread Rebuild role is Warehouse Team Lead across 8 DCs, where the deck's 6 counts plants only |
| Plant Controller adoption risk | 3.6 | **3.4** | slide 10 contradicts itself: 3.6 is above our inclusive 3.5 line and would tier Rebuild, but the slide tiers the role Enable. The dataset resolves it in favour of the tier the deck assigns. |
| Budget share | 55 · 27 · 13 · 5 | **54 · 27 · 14 · 5** | not a deck-derived figure at all — it falls out of our own per-head cost weighting, which the deck does not state. Lands within one rounding point. |

The derivation is the right answer here, not the deck's number: change an input and these move, which is
the whole point. Say "every number traces back to a role × process × site row" and point at the rule.

## What is synthetic, and what the deck actually gave us

The deck names **7 of the 38 roles** (slide 10) and gives **no 1–5 anchors for any sub-factor** — no
definition of what a 4.2 on capability delta means. The tool now supplies those anchors and labels each
one's provenance (see *What a score means* above); the dataset itself is still ours. So:

- the other **31 roles**, every headcount and site count outside those 7, and **every sub-factor value
  in the dataset** are our synthetic illustration, built to be internally consistent with the deck's
  tier table and its seven named roles;
- the seven named roles reproduce the deck's own axis scores exactly (see the table above);
- no client data, real HRIS extract or real readiness-pulse result is present anywhere in this repository.

### Licence hygiene

This tool reproduces **no third-party licensed change-management content**. The assessment sub-factors,
the item wording, the tier packages and the tactic lists are our own or Aberdeen's own delivery
material; the dataset is synthetic. The repository was grepped for Prosci-derived item wording,
assessment item banks and licensed tactic lists before shipping and came back clean — the Prosci
workbook licence forbids reproducing its content in another tool, and nothing here does.

## Notes for the presenters

- **"Add a role" is the money moment.** Sliders update both axis scores and the tier live; submit
  drops the role onto the heat map and opens its one-pager. Then switch to **Costed plan** — the
  resourced plan and the dollar figure have already moved. Adding a ~60-person Rebuild role takes
  the avoided loss from $5.3M to about $5.5M in front of the audience. Note the form starts
  **incomplete** by design — set all six sliders before you reach for submit.
- **The strongest single thing to show a judge is the Reproduced tab.** It is the claim that this is an
  engine and not a slide: 18 of the 24 figures our deck published fall out of it, and the 6 that do not
  are labelled near misses on screen with the rule that produced them. Every verdict on that page is
  computed by comparing the two cells, so say that out loud — it cannot flatter itself. If someone has
  been dragging weights, matches will start failing; that is the page being honest, and worth pointing at
  rather than hiding.
- **If someone asks what a 4.2 on capability delta means, drag that slider.** The anchor under it
  describes the score in Aberdeen's own words, and "All five anchors" opens the ladder with its
  provenance. Use **Frequency and volume** if you want to show the tool admitting a weakness: it is
  badged *OURS end to end — no source measures this*, in amber, and the note says it is the sub-factor
  most likely to be challenged. Volunteering that is more persuasive than being caught by it.
- **If someone challenges the weights, open the Weighting panel and hand it to them.** They are ours
  and they are tunable; drag one and the portfolio re-tiers live. Plant Buyer is the honest example:
  its impact severity is 3.8 on our default weighting but 3.3 if all the impact weight sits on
  consequence of error, which moves it out of Rebuild. Reset restores the default in one click.
- **If someone asks where the packages come from**, the answer is on the Costed plan tab under
  *Delivery standards behind every package*: methods, durations, job-aid ranges, the five milestones,
  the four-layer escalation and the cadences are Aberdeen's own delivery material — **the mapping of
  tier to tactic is ours**, and the 1:15 super-user ratio is from our own deck, not Aberdeen's.
- **Plant Controller** carries an adoption risk of 3.4 in the dataset, so the fixed 3.5 threshold
  puts it in **Enable** — the tier slide 10 assigns it. Slide 10's own 3.6 would tier it Rebuild;
  the dataset resolves the deck's internal inconsistency in favour of the tier, which is what the
  audience sees.
- **Warehouse Team Lead is the best role to demo.** It is the only role that trips both modifiers at
  once — deskless *and* a decision-rights shift — so the one-pager visibly rewrites the package:
  on-shift micro-training, laminated job aids, email dropped, plus a cascade script on decision
  rights.
- The four generated sections show an **offline content** marker until `ANTHROPIC_API_KEY` is set in
  Vercel. The fallback is presentable — it names the decision-rights shift and switches to deskless
  channels — so the demo is safe either way.
