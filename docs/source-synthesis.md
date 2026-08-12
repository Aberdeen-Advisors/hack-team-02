# The Evidence Underneath the Grid

**Source synthesis for Team 2's Change Impact Assessment Tool.** Aberdeen Advisors · AI Hackathon 2026 · 12 August 2026

This document is the evidence base beneath the tool, not a competing design. A separate session owns the app, the final scoring and the tier decisions. What follows is what the reference material actually says, where it is silent, and which sentences are safe to put in front of a client.

**How to read the markers.** Everything in this document is one of three things, and they are marked on every line:

- **[quoted]** — verbatim from a named source, with its own scale and its own document / slide / page reference. Safe to cite.
- **[ours]** — authored by us for this build. Defensible, but it is our judgement, not a source's. Never attribute it to Aberdeen or Prosci.
- **[silent]** — the source set says nothing. The silences are findings in their own right, and several of them matter more than the content.

**The single most useful thing in here** is §2: the spec deck defines no 1–5 anchors for any of the six sub-factors, and this document proposes a full set, built from source wording wherever source wording exists.

**Read §8.8 before reusing any Prosci item wording.** The Proxima workbook's Terms sheet restricts copying its content into another product, and all five assessment PDFs are marked "not intended for further distribution". This document quotes that text accurately and does not attempt to interpret it. The practical recommendation, which holds either way, is in §8.8: **write original items against the mechanics, and use Aberdeen's own material wherever a client-facing number is needed.**

**The Proxima workbook is the late arrival, and it is the most mechanically informative source in the set.** `Prosci Proxima Offline v1.0.2` — 78 sheets, 1.4 MB — was absent from the original extraction and arrived after this document was drafted. It is fully incorporated. Three of its findings changed conclusions that had already been written:

- **There are no weights anywhere in it.** Every axis is an equal-weighted sum or mean. No cell in 78 sheets holds a per-item or per-sub-factor weight, and `SUMPRODUCT`, `INDEX`, `MATCH`, `VLOOKUP` and `HLOOKUP` appear nowhere in the file.
- **Prosci's risk quadrant cuts at a per-item mean of exactly 3.0, while its Sponsor Competency "Good" floor sits at exactly 3.5** — and that 3.5 floor independently matches the Sponsor Assessment PDF, which was extracted separately. That contrast is the sharpest content in §3, and it is what our 3.5 threshold has to be argued against.
- **It supplies a full 0–5 verbal anchor ladder** (`DI1!C12`), the only source in the entire evidence base with words at every scale point. §2 was written on the assumption that no such ladder existed, and has been revised.

---

## 1. What these sources are

| Document | What it is | What it is good for here |
|---|---|---|
| **Team 2 spec deck** — `team2_change_impact_assessment_tool.pptx`, 16 slides | Team 2's own hackathon deck. Authoritative for the method. | Names the six sub-factors, the 1–5 scale, the 3.5 threshold and the four tiers. Defines nothing else about scoring. |
| **Aberdeen OCM Master (Batch 1–4)**, March 2024, 126 slides | Aberdeen's own change-management practice deck, spanning an HCM rollout and an S/4HANA finance transformation. | The most valuable source. Supplies the only written impact anchors, the only training-hours table, the only real client volumes, and every genuine differentiator. |
| **Prosci Risk Assessment** (Fillable v09), 4 pp. | 14 Change Characteristics + 14 Organizational Attributes items, 1–5, summed, plotted on a 2×2 risk grid. | The closest structural precedent for our whole design, and the source of most candidate sub-factors we omit. |
| **Prosci PCT Assessment** (Fillable v11), 4 pp. | 4 sides × 10 items, 1–3, summed, read against a 3-band table. | The only banded score→action-verb rubric in the set. Precedent for band tables. |
| **Prosci Sponsor Assessment** (Fillable v01), 1 p. | 20 items, 1–5, summed /100, three bands. | The sponsor action taxonomy, and the only threshold precedent that lands on 3.5. |
| **Prosci People Manager Assessment** (v001), 2 pp. | 4 categories × 5 items, 1–5, /25 per category. | The people-manager action ladder, and a two-level flag rule (item ≤3, category ≤15). |
| **Prosci Role Roster Canvas** (Fillable v03), 1 p. | ADKAR scored 1–5 per change role, plus Barrier Point and Activation Tactics. | The per-role register schema, and CLARC. |
| **Prosci Practitioner Presentation Template**, 29 slides | Prosci's reusable worksheet library — 10 Aspects of Change Impact, Define Impact, Risk Assessment, ADKAR Blueprint, Change Management Plan. | The best available quotes justifying a two-axis tiering tool, plus the 0–5 impact aspect list. |
| **Prosci ECM Journey infographic** (2020) | Three "Peaks" with question sets. No numbered maturity levels. | Limited. A posture ladder (motivating → energizing → sustaining), nothing scored. |
| **Prosci PM Value infographic** (2022) | Persuasion piece aimed at project managers. | The 71% / 81% / 600% statistics and "The Math is Clear". |
| **Openlink Change Control Plan** (`.docx`) | A client change-control template — populated narrative, unfilled tables. | The only 4-band criteria table and 4×4 lookup matrix in the set, plus a severity-banded approval gate. |
| **Prosci Proxima Offline v1.0.2** — 78 sheets | Prosci's own offline scoring workbook: five instruments, live formulas, data validation, conditional formatting. Ships unfilled. | **The only source that shows its arithmetic.** Every roll-up formula, every threshold, the only complete 0–5 anchor ladder, and the only genuine mean in the set. Also the only source whose licence terms need checking before reuse — see §8.8. |
| **Kotter, *8 Steps* eBook; Kotter, *Change*; Hiatt & Creasey, *The People Side of Change*** (Prosci, 2012) | Read earlier, outside this file set. | Framework lineage only — Kotter's 8 steps at programme level, ADKAR at individual level. **[silent]** No quotations, page numbers or statistics from these three books are available in this evidence base. Do not put any on a slide. |

---

## 2. Grounding the six sub-factors

The spec deck's slide 7 is the only place the six sub-factors appear. Each axis is a header shape plus one body shape containing exactly three paragraphs — three sub-factors per axis, no more. The deck states the 1–5 scale twice (slide 8, "Both axes scored 1–5"; slide 10, "Score 1–5") and **[silent]** never defines what a 1, 2, 3, 4 or 5 means, for any sub-factor or for either axis. The word "anchor" does not appear in the deck. Every scored value on slide 10 is footnoted "Illustrative figures", so the observed scores cannot be reverse-engineered into anchors either.

That is what §2 fills.

### The two scaffolds every anchor set below is built on

**Scaffold 1 — Proxima's magnitude ladder. This is the only place in the entire evidence base with a word at every scale point.** `DI1!C12`, verbatim: **[quoted]** "Use the scoring guide to help you score the impact: 0 = No Impact, 1 = Extremely Low Impact, 2 = Low, 3 = Moderate, 4 = High impact, 5 = Extremely High Impact." The scale is enforced at 0–5 by data validation on `DI1!G14:G23`.

| Proxima | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| **[quoted]** anchor | "No Impact" | "Extremely Low Impact" | "Low" | "Moderate" | "High impact" | "Extremely High Impact" |
| maps to our 1–5 | **[silent]** no home | 1 | 2 | 3 | 4 | 5 |

Two things to note. It is **0–5, not 1–5** — and the zero is deliberate, not an artefact: Proxima excludes zero-rated aspects from its severity mean entirely, on the stated reasoning **[quoted]** "Impacted individuals don't think about the job aspects that aren't affected, only those that are." Our 1–5 scale cannot express "this does not change at all", which is a real loss for an ERP rollout where Compensation and Location are untouched for most of the 38 roles. And the ladder is **generic** — pure magnitude words, applicable to any sub-factor, carrying no observable content.

**Scaffold 2 — Aberdeen's observable descriptors.** `Aberdeen s.18` gives written Low / Medium / High band text that says what actually differs in the job. Three bands, mapping naturally Low→1, Medium→3, High→5. Rich, but sparse.

**The method used throughout §2: Proxima supplies the rung, Aberdeen supplies the reason.** Where both exist, positions 1, 3 and 5 carry Aberdeen's observable wording and positions 2 and 4 carry Proxima's magnitude word plus a drafted observable gloss. Positions 2 and 4 therefore now have *source* wording — thin, single-word wording, but genuinely quoted — where the earlier draft of this document said none existed anywhere. The observable content at 2 and 4 remains ours.

> **Before reusing any Prosci item wording below.** Every **[quoted]** Prosci item, anchor and scale in §2 is quoted here for internal grounding. The Proxima Terms sheet restricts copying content into another product and the assessment PDFs are marked not for further distribution. See §8.8 — the recommendation is to write original items against the mechanics rather than lift the wording into the tool.

### Impact severity 1 — "Share of daily tasks changing"

Spec deck wording, verbatim `spec s.7`: **[quoted]** "Share of daily tasks changing". A bare noun phrase — the deck's whole definition.

Sources that measure something equivalent:

| Source | Item, verbatim | Scale | Reference |
|---|---|---|---|
| Prosci Risk | **[quoted]** "Degree of change impact on individual" — 1 = "No impact", 5 = "100% impact" | 1–5, poles labelled only | `RISK p.2, CC7` |
| Prosci Risk | **[quoted]** "Amount of change overall" — 1 = "Incremental", 5 = "Radical" | 1–5, poles only | `RISK p.2, CC8` |
| Prosci Risk | **[quoted]** "Type of change" — 1 = "Single aspect, simple change", 5 = "Many aspects, complex change" | 1–5, poles only | `RISK p.2, CC6` |
| Aberdeen | Process & Tasks row. Low: **[quoted]** "Limited process change / Minimal changes to process hand-offs / Minimal changes to number of process steps". Medium: **[quoted]** "Noticeable process change / Noticeable changes to process-hand offs / Noticeable changes to number of process steps". High: **[quoted]** "Large scale process change / Significant changes to process-hand offs / Significant changes to number of process steps" | 3 ordinal bands (Low / Medium / High) | `Aberdeen s.18` |
| Aberdeen | Taxonomy driver, verbatim: **[quoted]** "Implications of work being performed by a different role" | unscored driver | `Aberdeen s.17` |
| Prosci template | "10 Aspects of Change Impact" — aspects 1 Processes, 2 Systems, 3 Tools, 4 Job Roles, each rated in a **[quoted]** "Degree (0-5)" column | **0–5** (note the zero) | `template s.21` |
| Proxima | The same ten aspects, live, with the magnitude ladder from Scaffold 1 and a definition per aspect. **[quoted]** Processes = "The actions or steps taken to achieve a defined end or outcome"; **[quoted]** Job roles = "A description of what a person does including competencies essential to performing well in that job capacity" | 0–5, all six points labelled | `Proxima DI1!C14:C23`, `DI1!C12`, `DI help!B9`, `B18` |
| Proxima | Breadth measured separately from intensity: **[quoted]** "Aspects impacted: " = `COUNTIF(G14:G23,">0")`, with a highlight rule at **7 or more of 10** | count 0–10 | `Proxima DI1!G24`, `DI!E10:E29` |

CC7 is the single closest analogue Prosci has: it is a proportion scale with named poles, exactly what "share of daily tasks" needs. Aberdeen supplies the observable vocabulary. The spec deck's own slide 11 quantifies task share once — **[quoted]** "6 tasks removed · 11 tasks changed · 4 tasks new" for Plant Scheduler — but only for one role, and that is a count, not a share.

**[ours]** Proxima makes a design distinction worth stealing: it separates **intensity** (the mean over impacted aspects) from **breadth** (how many aspects are impacted at all), and reports both. Our "share of daily tasks changing" conflates the two. A role where one aspect changes totally and a role where all ten change totally both score 5.0 on Proxima's severity mean and are distinguished only by the aspect count.

**Proposed anchors:**

| Score | Anchor |
|---|---|
| **1** | **[quoted]** "No impact" (`RISK CC7` at 1) · **[quoted]** "Extremely Low Impact" (`Proxima DI1!C12`) · **[quoted]** "Limited process change" (`Aberdeen s.18` Low) · **[ours]** under 10% of the role's daily tasks change |
| **2** | **[quoted]** "Low" (`Proxima DI1!C12`) · **[quoted]** "Minimal changes to number of process steps" (`Aberdeen s.18` Low) · **[ours]** roughly 10–25% of daily tasks change; the shape of the day is recognisable |
| **3** | **[quoted]** "Moderate" (`Proxima DI1!C12`) · **[quoted]** "Noticeable process change / Noticeable changes to number of process steps" (`Aberdeen s.18` Medium) · **[ours]** roughly 25–50% of daily tasks change |
| **4** | **[quoted]** "High impact" (`Proxima DI1!C12`) · **[quoted]** "Large scale process change" (`Aberdeen s.18` High) · **[ours]** roughly 50–75% of daily tasks change; hand-offs in and out of the role move |
| **5** | **[quoted]** "100% impact" (`RISK CC7` at 5) · **[quoted]** "Extremely High Impact" (`Proxima DI1!C12`) · **[quoted]** "Significant changes to process-hand offs" (`Aberdeen s.18` High) · **[ours]** over 75% of daily tasks change, or the role is net-new |

**[ours]** The percentage bands are entirely ours. No source expresses task share as a percentage. They are offered because a deterministic scorer needs a countable rule and the spec's slide-11 task counts (removed / changed / new) make the numerator and denominator available from the to-be process designs.

### Impact severity 2 — "Frequency and volume of the affected task"

Spec deck wording, verbatim `spec s.7`: **[quoted]** "Frequency and volume of the affected task".

**This is the least grounded of the six sub-factors.** **[silent]** No source in the set scores transaction frequency or task volume. The nearest items measure different things and should not be presented as equivalents:

| Source | Item, verbatim | Scale | Reference | Why it is not the same thing |
|---|---|---|---|---|
| Aberdeen | Data driver: **[quoted]** "Change in the form frequency and speed of formal and informal communications" | unscored driver | `Aberdeen s.17` | The set's only use of "frequency", and it is about communications, not task execution |
| Prosci Risk | **[quoted]** "Number of people impacted" — 1 = "Less than 10", 5 = "Over 1,000" | 1–5, poles only | `RISK p.2, CC2` | Population volume, not task volume. Useful as a *style* precedent for order-of-magnitude poles |
| Aberdeen | Training modality selector, "Audience Size" row: **[quoted]** "Small, Medium" / "Medium, Large" / "Large" / "Varies" | 3 named sizes | `Aberdeen s.46` | Sizes the delivery, not the severity |

**Proposed anchors — the observable content is fully authored; only the magnitude words are quoted:**

| Score | Anchor |
|---|---|
| **1** | **[quoted]** "Extremely Low Impact" (`Proxima DI1!C12`) · **[ours]** the changed task runs less than monthly for a given post-holder |
| **2** | **[quoted]** "Low" · **[ours]** monthly |
| **3** | **[quoted]** "Moderate" · **[ours]** weekly |
| **4** | **[quoted]** "High impact" · **[ours]** daily, at low volume — a handful of transactions per shift |
| **5** | **[quoted]** "Extremely High Impact" · **[ours]** continuous — the changed task is the role's core throughput, many transactions per shift |

**[ours]** Every word of that ladder is ours. If a client asks for the provenance of this sub-factor, the honest answer is that Team 2 added it and the reference set does not measure it. The defence is that it is directly countable from the system transaction lists the spec already names as an input (`spec s.15`), which is stronger than a borrowed anchor would be. It is also the sub-factor most likely to be challenged, so it is worth deciding in advance whether to keep it or fold it into severity as a multiplier.

### Impact severity 3 — "Consequence of error — safety, financial control, service level"

Spec deck wording, verbatim `spec s.7`: **[quoted]** "Consequence of error — safety, financial control, service level".

The Openlink client plan is the best fit in the set, because it is the only source that bands consequence on four named levels with written descriptors.

| Source | Item, verbatim, with all four bands | Scale | Reference |
|---|---|---|---|
| Openlink | **[quoted]** "Operational Impact" — Critical = "High", High = "Medium", Medium = "Low", Low = "None" | 4 named bands | `Openlink image2.png, §Stakeholder Priority` |
| Openlink | **[quoted]** "Data Integrity" — Critical = "Data integrity issue is occurring", High = "Data integrity issue is imminent", Medium = "Data integrity issue is possible", Low = "Data integrity issue is not likely" | 4 named bands | `Openlink image2.png` |
| Openlink | **[quoted]** "Legal or Compliance Related" — Critical = "Must change for legal or compliance", High = "Potential risk of legal issue or noncompliance", Medium = "Proactive legal or compliance measures", Low = "N/A" | 4 named bands | `Openlink image2.png` |
| Openlink | **[quoted]** "Functional Areas Affected" — "4 or more groups" / "3 groups" / "2 groups" / "1 group" | 4 named bands, hard counts | `Openlink image2.png` |
| Aberdeen | Policies & Procedures row: **[quoted]** "Minimal changes to policies & procedures" / "Noticeable changes to policies & procedures" / "Significant change to policies & procedures" | 3 ordinal bands | `Aberdeen s.18` |
| Prosci template | Consequence library, not a scale: **[quoted]** "Impact on customers", **[quoted]** "Reduced quality of work", **[quoted]** "Regulations not met" | unscored list | `template s.20` |

**[silent]** No source in the set scores safety consequence. The spec's "safety" limb — the limb that matters most at six plants and two DCs — has no precedent anywhere in this material. Anchors below carry it, and it is ours.

**Proposed anchors:**

| Score | Anchor |
|---|---|
| **1** | **[quoted]** Operational Impact "None" · **[quoted]** "Data integrity issue is not likely" (`Openlink image2.png`) · **[ours]** an error is self-correcting within the shift and never leaves the team |
| **2** | **[quoted]** Operational Impact "Low" · **[quoted]** "Data integrity issue is possible" · **[quoted]** "Low" (`Proxima DI1!C12`) · **[ours]** a downstream control catches the error before it reaches a customer or the ledger |
| **3** | **[quoted]** Operational Impact "Medium" · **[quoted]** "Proactive legal or compliance measures" · **[quoted]** "Moderate" (`Proxima DI1!C12`) · **[ours]** the error degrades a service level or forces manual rework inside one group |
| **4** | **[quoted]** Operational Impact "High" · **[quoted]** "Data integrity issue is imminent" · **[quoted]** "Potential risk of legal issue or noncompliance" · **[ours]** the error reaches a customer, the ledger or the plant schedule |
| **5** | **[quoted]** "Data integrity issue is occurring" · **[quoted]** "Must change for legal or compliance" · **[ours]** the error creates a safety exposure, a reportable financial-control failure, or a line stoppage |

**[ours]** Two authored moves here. First, the Openlink table has four bands and we need five, so band 3 is an interpolation. Second, the safety limb at score 5 is entirely ours — say so before a plant manager asks.

### Adoption risk 1 — "Capability delta — skill required vs. current"

Spec deck wording, verbatim `spec s.7`: **[quoted]** "Capability delta — skill required vs. current". One of only two sub-factors carrying an em-dash gloss that reads as a definition.

**This is the best-supported of the six.** Aberdeen's slide 18 gives written, observable anchors that can be lifted almost intact.

| Source | Item, verbatim | Scale | Reference |
|---|---|---|---|
| Aberdeen | Knowledge & Skills row. Low: **[quoted]** "Minor changes to skills or knowledge required, no training specific training need". Medium: **[quoted]** "Some development of skills and knowledge. in specialist areas". High: **[quoted]** "Employees do not possess the skills and knowledge required to perform their daily role" | 3 ordinal bands | `Aberdeen s.18` |
| Aberdeen | Organization & Roles row. Low: **[quoted]** "Capabilities already present in your role". Medium: **[quoted]** "Some new capabilities required for your role". High: **[quoted]** "Significant number of new capabilities required for your role" | 3 ordinal bands | `Aberdeen s.18` |
| Prosci Risk | **[quoted]** "Impacted employee change competency" — 1 = "Highly effective at thriving in change", 5 = "Lack skills and knowledge" | 1–5, poles only | `RISK p.3, OA12` |
| Prosci template | ADKAR Ability, definition **[quoted]** "To implement required skills and behaviors"; triggers **[quoted]** "Size of the K-A gaps / Barriers/capacity / Practice/coaching" | reference table | `template s.15` |
| Prosci template | ADKAR Blueprint "Gauge: Gap" cell, pre-filled **[quoted]** "Small / Medium / Large" | 3-point ordinal | `template s.28` |
| Prosci People Manager | Measures whether the manager did the assessment, not the gap size: **[quoted]** "I assessed the gap between current job knowledge and skills, and the job knowledge and skills needed to support the change, to create professional development plans for each employee." | 1–5, 1 = "Not achieved", 5 = "Completely achieved" | `PEOPLEMGR p.2, MET3` |
| Aberdeen | Two proficiency levels per module per role band: **[quoted]** "B = Basic proficiency level", **[quoted]** "A = Advanced proficiency level" | 2-point | `Aberdeen s.73` |

Note the polarity trap in `OA12`: it scores *change competency* — how well someone copes with change in general — not the job-skill gap the spec means. Related, not the same, and 5 is the bad end in Prosci's direction as well as ours, which is convenient but coincidental.

**Proposed anchors:**

| Score | Anchor |
|---|---|
| **1** | **[quoted]** "Minor changes to skills or knowledge required, no training specific training need" · **[quoted]** "Capabilities already present in your role" (`Aberdeen s.18` Low) |
| **2** | **[quoted]** gap gauge "Small" (`template s.28`, `Proxima dropdowns!H6`) · **[quoted]** "Low" (`Proxima DI1!C12`) · **[ours]** existing skills transfer; navigation-level familiarisation only |
| **3** | **[quoted]** "Some development of skills and knowledge. in specialist areas" · **[quoted]** "Some new capabilities required for your role" (`Aberdeen s.18` Medium) · **[quoted]** gap gauge "Medium" (`template s.28`) |
| **4** | **[quoted]** gap gauge "Large" (`template s.28`) · **[quoted]** "High impact" (`Proxima DI1!C12`) · **[ours]** substantial new skills in a core part of the role, built on a recognisable base |
| **5** | **[quoted]** "Employees do not possess the skills and knowledge required to perform their daily role" · **[quoted]** "Significant number of new capabilities required for your role" (`Aberdeen s.18` High) |

**[ours]** Only the observable content at positions 2 and 4 is drafted. Positions 1, 3 and 5 are Aberdeen's own words, which makes this the one sub-factor where the anchor set is genuinely quotable to Aberdeen rather than to us.

**[silent]** One gap worth knowing about: Proxima enforces its ADKAR items at 1–5 by data validation and names each element in the input prompt — **[quoted]** "Enter a score for Ability of 1, 2, 3, 4 or 5" (`Proxima DI1!D30`) — but supplies **no verbal anchor for what a 1 or a 5 means on any ADKAR element**, anywhere in 78 sheets. Prosci scores ADKAR numerically without ever defining the numbers. Do not go looking for that ladder; it is not in the file set.

### Adoption risk 2 — "Change in decision rights"

Spec deck wording, verbatim `spec s.7`: **[quoted]** "Change in decision rights". The only one of the six with **no** em-dash gloss. The deck's expansion is rhetorical, on the same slide, under the header "The variable most assessments miss": **[quoted]** "Decision rights. Resistance is rarely 'the software is hard.' It is 'I used to approve this, and now the system does.'"

**The spec's claim survives contact with the sources, and the Proxima workbook strengthens it.** **[silent]** No instrument in this set scores decision rights as its own dimension. Aberdeen names it as a taxonomy driver but never bands it. Prosci scores restructuring and reporting structure, which are adjacent but different. Now that the workbook is available the claim can be made precisely rather than impressionistically: **none of Proxima's 28 risk items and none of its 10 impact aspects measures decision rights.** The nearest are aspect 7 "Reporting Structure" — who reports to whom — and risk item `D20` "Degree of organizational restructuring". Neither asks whether a role lost the authority to approve something. That makes slide 7's assertion defensible as stated, and it is the strongest honest differentiator in the whole document.

| Source | Item, verbatim | Scale | Reference |
|---|---|---|---|
| Aberdeen | Aberdeen's own wording for decision rights, as a driver under Organization & Roles: **[quoted]** "Change in authority levels, roles and responsibilities" | unscored driver — no band text | `Aberdeen s.17` |
| Aberdeen | The system-authorisation face of it, under Technology & Tools: **[quoted]** "New security and access rights" | unscored driver | `Aberdeen s.17` |
| Aberdeen | Under Ways of Working and Behaviors: **[quoted]** "Implications of work being performed by a different role" | unscored driver | `Aberdeen s.17` |
| Prosci Risk | **[quoted]** "Degree of organizational restructuring" — 1 = "No restructuring", 5 = "Complete restructuring" | 1–5, poles only | `RISK p.2, CC10` |
| Prosci Risk | **[quoted]** "Leadership style and power distribution" — 1 = "Centralized", 5 = "Distributed" | 1–5, poles only | `RISK p.3, OA9` |
| Prosci template | Aspect 7 of ten: **[quoted]** "Reporting Structure", rated in the **[quoted]** "Degree (0-5)" column | 0–5 | `template s.21` |
| Proxima | The same aspect, with a definition and a worked example: **[quoted]** "Reporting Structure: The authority relationships in a company or organization; who reports to whom. Example: the move from regional sales teams to a global client services team with a different executive leader." | 0–5 | `Proxima DI help!B27` |

Proxima's definition of Reporting Structure is the closest any source comes, and it lands next to rather than on the target — it defines **[quoted]** "authority relationships" as *who reports to whom*, which is org structure. The spec means something narrower and sharper: which decisions this role is still allowed to make. `OA9` is the trap in this row. It scores how power is distributed across the organisation, not whether an individual role loses authority, and its direction is not even obviously a risk direction — a distributed leadership style is not self-evidently worse. Do not cite it as a decision-rights measure.

**Proposed anchors — authored, using Aberdeen's driver vocabulary:**

| Score | Anchor |
|---|---|
| **1** | **[ours]** no change to what the role may approve, release or override. Nothing in Aberdeen's **[quoted]** "Change in authority levels, roles and responsibilities" applies |
| **2** | **[ours]** the same approvals, but new evidence or an audit trail is required — a reason code, a second signature. System access unchanged in substance. Aberdeen's **[quoted]** "New security and access rights" applies at the margin |
| **3** | **[ours]** approval limits or thresholds change, or an approval moves one level up or down. The role still decides |
| **4** | **[ours]** a decision the role used to make is now system-determined and the role validates it, or the decision moves to another role — Aberdeen's **[quoted]** "Implications of work being performed by a different role" |
| **5** | **[ours]** discretionary authority is removed and replaced by rules-based exception handling. The spec deck's own formulation is the anchor: **[quoted]** "I used to approve this, and now the system does." (`spec s.7`) |

**[ours]** The ladder is ours; the vocabulary at 1, 2 and 4 is Aberdeen's and the 5 anchor is the spec deck's own sentence, which is the neatest available outcome — the deck supplies the top anchor for the sub-factor it is proudest of.

**A caution on weight.** The build may be tempted to over-weight this sub-factor because slide 7 emphasises it. **[silent]** The deck states no weight for any sub-factor — a keyword sweep of all 16 slides returns zero hits for "weight", "weighted", "average", "mean", "formula" or "equal". Slide 7's emphasis is an argument for *including* decision rights at all, since others neglect it. Reading it as "heaviest weight" is an inference the build would have to own.

### Adoption risk 3 — "Local readiness — site leadership capacity, change fatigue, digital maturity, deskless access"

Spec deck wording, verbatim `spec s.7`: **[quoted]** "Local readiness — site leadership capacity, change fatigue, digital maturity, deskless access". Four named limbs inside one sub-factor. It is the richest in source support and the messiest to score, because each limb has a different source and only two of the four are measured anywhere.

**Limb 1 — site leadership capacity.** Well supported.

| Source | Item, verbatim | Scale | Reference |
|---|---|---|---|
| Prosci Risk | **[quoted]** "People manager change competency" — 1 = "Highly effective at managing change", 5 = "Lack skills and knowledge" | 1–5, poles only | `RISK p.3, OA11` |
| Prosci Risk | **[quoted]** "Executive / senior manager change competency" — 1 = "Highly effective at sponsoring change", 5 = "Lack skills and knowledge" | 1–5, poles only | `RISK p.3, OA10` |
| Prosci People Manager | A whole 20-item instrument that measures exactly this, with its own flag rule: **[quoted]** "Any category that has a total score of 15 or less should be viewed as an area for improvement." | 1–5 per item, /25 per category | `PEOPLEMGR p.2` |

**Limb 2 — change fatigue.** Well supported, and Prosci splits it into two items where the spec has one word.

| Source | Item, verbatim | Scale | Reference |
|---|---|---|---|
| Prosci Risk | **[quoted]** "Change saturation" — 1 = "Very few changes, under capacity", 5 = "Everything is changing, over capacity" | 1–5, poles only | `RISK p.3, OA3` |
| Prosci Risk | **[quoted]** "Management of past changes" — 1 = "Well-managed, successful changes", 5 = "Poorly managed, failed changes" | 1–5, poles only | `RISK p.3, OA2` |
| Prosci template | Named as an organisational risk of mishandling change: **[quoted]** "Change saturation"; and **[quoted]** "Stress, confusion, fatigue" | unscored list | `template s.20` |
| Proxima | The same two items, live and scored, with identical anchors — **[quoted]** "Change saturation" (`D32`) and **[quoted]** "Management of past changes" (`D31`) | 1–5, poles labelled `E10`/`F10` as "Min (1)" / "Max (5)" | `Proxima DA-Rk!D31:D32` |

**All 14 Organizational Attributes items appear identically in the Risk Assessment PDF and in the Proxima workbook**, with the same anchor pairs. Two independent Prosci products carrying the same wording is the strongest corroboration available in this set — these items are stable Prosci content, not one document's phrasing.

The spec's own slide 12 uses both limbs as evidence for Warehouse Team Lead — **[quoted]** "2 prior failed WMS attempts" and **[quoted]** "Highest change fatigue in the population" — without scoring either.

**Limb 3 — digital maturity.** **[silent]** No source scores a population's digital maturity. Two near-misses, neither usable as-is:

| Source | Item, verbatim | Scale | Reference | Why it is not the same thing |
|---|---|---|---|---|
| Aberdeen | Technology & Tools row. Low: **[quoted]** "Limited change to technology platforms already in place / Limited change to tooling already in place". High: **[quoted]** "New technology platforms introduced / New tooling introduced" | 3 ordinal bands | `Aberdeen s.18` | Measures how much the technology changes, not how capable the population is |
| Prosci Risk | **[quoted]** "Change management maturity" — 1 = "Well-established organizational competency", 5 = "Ad hoc or absent" | 1–5, poles only | `RISK p.3, OA13` | Change-management maturity, not digital maturity |

**Limb 4 — deskless access.** One source statement, and it is prose, not a scale — but it is the single most operationally useful sentence Aberdeen has on this population.

| Source | Item, verbatim | Scale | Reference |
|---|---|---|---|
| Aberdeen | **[quoted]** "Tailor approach to audience: Site employees (e.g, warehouse drivers) often did not have access to computers and some have lower literacy, communication vehicles like email messages were ineffective" | prose, unscored | `Aberdeen s.112` |
| Aberdeen | Nearest scored proxy, from the modality selector: **[quoted]** "Audience Type" — "Centralized" / "Distributed" | binary | `Aberdeen s.46` |

**Proposed anchors for the composite:**

| Score | Anchor |
|---|---|
| **1** | **[quoted]** "Very few changes, under capacity" (`RISK OA3` at 1) · **[quoted]** "Highly effective at managing change" (`RISK OA11` at 1) · **[ours]** all staff desk-based with individual system access |
| **2** | **[ours]** one concurrent change; the site manager is credible but stretched; desk access universal |
| **3** | **[ours]** several concurrent changes; the manager needs a script to run the cascade; mixed desk and shared-terminal access |
| **4** | **[quoted]** "Poorly managed, failed changes" in recent memory (`RISK OA2` at 5) · **[ours]** manager capacity is the binding constraint; most of the population shares terminals or works shifts |
| **5** | **[quoted]** "Everything is changing, over capacity" (`RISK OA3` at 5) · **[quoted]** "Lack skills and knowledge" (`RISK OA11` at 5) · **[quoted]** the population has no "access to computers" and email is "ineffective" (`Aberdeen s.112`) |

**[ours]** A roll-up choice the app session has to make and the spec does not answer: four limbs, one score. **[silent]** The spec deck states no rule. Our recommendation is to score each limb 1–5 and take the **maximum**, not the mean — a site where the manager is fine and the fatigue is low but nobody has a screen is not a moderate-risk site, it is a site where the training plan does not work. Taking the mean would hide exactly the failure the spec's slide 12 is built around. This is a recommendation, not a source position.

### Sub-factors the sources score that our model omits

Fourteen candidates, all measured somewhere in the set, all absent from our six. The verdict column is **[ours]** throughout.

| Omitted factor | Source, item and scale | Worth adding? |
|---|---|---|
| **Change saturation / concurrent-change load** | `RISK p.3, OA3`, 1–5: **[quoted]** "Very few changes, under capacity" → "Everything is changing, over capacity" | **Yes — promote it.** It is currently one word inside "local readiness". It is per-site, cheaply measurable, and this programme stacks an ERP and an operating model on one population. Cost: breaks the 3+3 symmetry. |
| **History of past changes at the site** | `RISK p.3, OA2`, 1–5: **[quoted]** "Well-managed, successful changes" → "Poorly managed, failed changes" | **Yes — cheapest addition available.** One question per site. The spec already uses it as evidence at slide 12 without scoring it. |
| **Clarity of future state** | `RISK p.2, CC5`, 1–5: **[quoted]** "Known and clear" → "Unknown and emergent" | **Yes.** It varies by value stream, which is already an axis of the grid, and it is what actually separates Rebuild from Enable — a role can face a big change that is well specified. |
| **Perceived need for change / dissatisfaction with current state** | `RISK p.3, OA1`, 1–5: **[quoted]** "People are dissatisfied with current state" → "People are satisfied with current state" | **Yes, if the pulse runs.** This is ADKAR Desire and it is genuinely distinct from capability. It is also the factor that makes Reassure a real tier rather than a leftover. |
| **Data availability and quality** | `Aberdeen s.18`, 3 bands. High: **[quoted]** "Significant changes to data structure and processing / Data is not readily available or may need high levels of adjustment" | **Probably yes.** The spec makes Master Data Steward a net-new role at 4.8 severity, so data is already material to the assessment; it just is not scored. |
| **Compensation impact** | `RISK p.2, CC9`, 1–5: **[quoted]** "No impact to pay and benefits" → "Large impact to pay and benefits". Also `template s.21` aspect 9 "Compensation", 0–5 | **Only if in scope.** If grading or pay moves with the new operating model, this is a severity amplifier we omit entirely. If it does not, say so on the slide, because clients ask. |
| **Reduction in staffing levels** | `RISK p.2, CC11`, 1–5: **[quoted]** "No reduction" → "Significant reduction" | **Only if in scope.** Same reasoning. Note it also interacts with the confidentiality item below. |
| **Timeframe adequacy** | `RISK p.2, CC13`, 1–5: **[quoted]** "Sufficient time to prepare, equip and support people" → "Insufficient time to prepare, equip and support people" | **Yes, but as a wave-level modifier.** It does not vary by role, so scoring it per cell would add a constant. Better as a per-wave multiplier on the whole tier plan. |
| **Reinforcement / reward alignment** | `RISK p.3, OA7`, 1–5: **[quoted]** "People are rewarded for taking risks and embracing change" → "People are rewarded for consistency and predictability" | **No for scoring — yes for the plan.** This is sustainment, after the go-live gate. Aberdeen's matching tactic is `s.116`: **[quoted]** "Linking training attendance with the rewards and/or KPIs". |
| **Manager change competency as an explicit input** | `RISK p.3, OA11`, 1–5, plus the whole `PEOPLEMGR` instrument | **Consider splitting it out.** We bury it in "local readiness"; Prosci scores it separately and ships a 20-item instrument to measure it. Splitting it gives the people-manager column in §4 a real input. |
| **Variation in groups impacted** | `RISK p.2, CC4`, 1–5: **[quoted]** "All groups are impacted the same way" → "All groups experience the change differently" | **No — it is our premise, not a factor.** Prosci scores *whether* groups differ; we decompose *how*. Scoring it would double-count the grid. Quote it as justification for the unit of analysis instead. |
| **Confidentiality constraint** | `RISK p.2, CC12`, 1–5: **[quoted]** "Open and transparent" → "Closed and confidential" | **No, but keep it visible.** It constrains which comms tactics are legal rather than scoring risk. Relevant only if headcount moves. |
| **Location change** | `template s.21`, aspect 10 **[quoted]** "Location", 0–5 | **No** for this programme unless sites consolidate — but note it is a real Prosci aspect we drop, and site consolidation would change that overnight. |
| **Critical behaviors; Mindset / attitudes / beliefs** | `template s.21`, aspects 5 and 6, 0–5 | **Partially — pulse only.** Not derivable from process design documents. This is the layer Aberdeen's `s.110` **[quoted]** "Behaviour First" and **[quoted]** "Nudging" material addresses, and the pulse in §5 is the only route to it. |
| **Scope; number of people impacted; entry point for change management** | `RISK p.2, CC1, CC2, CC3` | **No.** Programme-level constants for a single 5,000-person ERP. They would add the same number to all 760 cells. |
| **Breadth of impact, reported separately from intensity** | `Proxima DI1!G24` — **[quoted]** "Aspects impacted: " as `COUNTIF(...,">0")`, with an explicit highlight at **7 or more of 10** | **Yes — and it is close to free.** Proxima deliberately reports breadth alongside severity because its mean cannot distinguish one total change from ten. Our three sub-factors have the same blindness in miniature. A count of how many sub-factors exceed the threshold, emitted next to the axis score, costs nothing and directly answers "is this role a bit changed everywhere or transformed in one place" — which are different interventions. |
| **A "not applicable" state per sub-factor** | `Proxima DI1!C12` — the 0 rating, excluded from the mean, on the stated reasoning that **[quoted]** "Impacted individuals don't think about the job aspects that aren't affected" | **Worth a decision.** Our 1–5 scale forces a genuinely unaffected sub-factor to score 1, which drags the mean toward "low" rather than leaving the axis to the factors that matter. See §3, departure 2. |
| **Sponsor / leadership strength** | `PCT` Leadership-Sponsorship side, 10 items 1–3; `SPONSOR`, 20 items 1–5 scored /100 | **No at cell level — but the gap is real.** **[silent]** The spec deck has no sponsor track at all. §4's sponsor column has to be built from Aberdeen and Prosci because the deck supplies nothing. |

---

## 3. How the sources combine sub-factors into a score

The Proxima workbook is the only source that shows its arithmetic rather than describing it, so this section is largely built on it. Across the whole set there are exactly five roll-up mechanisms: **gated simple sum**, **mean over the non-zero items only**, **first-fail-in-sequence lookup**, **dual-threshold 2×2 quadrant lookup**, and **ordinal band picked from a written descriptor**.

**Three findings up front, because they settle three open questions in the spec.**

**1. There are no weights anywhere.** No cell in Proxima's 78 sheets holds a per-item or per-sub-factor weight, and `SUMPRODUCT`, `INDEX`, `MATCH`, `VLOOKUP` and `HLOOKUP` appear nowhere in the file. Every item inside every axis is equal-weighted. The only lookup-shaped logic in the workbook is nested `IF`. So the spec's silence on weights (§8.5) has a clean default available: **equal weights are what Prosci's own tool does**, and departing from that is the thing that needs an argument, not adopting it.

**2. A mean does have a precedent — one, and it is a peculiar one.** Proxima's severity axis is a genuine arithmetic mean, `DI1!G25` verbatim: `=IF(G24>0,SUM(G14:G23)/G24,"")` where `G24` is `=COUNTIF(G14:G23,">0")`. **The divisor is the count of impacted aspects, not the number of aspects.** Zero-rated aspects leave both numerator and denominator. The stated reasoning, `DI1!C12`: **[quoted]** "Impacted individuals don't think about the job aspects that aren't affected, only those that are. Removing them from the impact score more accurately reflects what the impacted individuals would perceive the impact to be." Consequence: one aspect at 5 with nine zeros scores **5.0**, identical to all ten at 5. Severity is intensity where it lands, deliberately not breadth — and breadth is carried separately as the aspect count, with its own threshold at **7 or more of 10**.

**3. The threshold contrast is the whole argument.** Prosci cuts at a per-item mean of **3.0** where it tiers risk, and at **3.5** where it grades sponsor competency. Both cuts are in the workbook, in different instruments, and the 3.5 is independently corroborated by the Sponsor Assessment PDF. Our 3.5 therefore matches Prosci's *competency* convention, not its *risk-tiering* convention — see the honesty note after the table.

| Instrument | Inputs | Combination | Threshold(s) as printed | Threshold as a mean item score on 1–5 | Output |
|---|---|---|---|---|---|
| **Prosci Risk** `RISK pp.2–4` | 14 Change Characteristics + 14 Organizational Attributes items, each 1–5, 5 = worst | **Sum** each battery: **[quoted]** "Sum of points for Change Characteristics Assessment (out of 70 total)". Range 14–70 per axis | Single split at **42** on both axes — the printed midpoint of 14–70. Ticks printed at **[quoted]** 14, 42, 70 | **3.0** | 2×2 grid, four cells, three labels: **[quoted]** "High Risk" (upper right), "Medium Risk" (both off-diagonals), "Low Risk" (lower left) |
| **Prosci Risk, item rule** `template s.23` notes | The same items | **No arithmetic** — an item-level escape hatch running in parallel to the sum | **[quoted]** "The 'Risk Drivers' are the key elements rated a '4' or '5' in your Change Characteristics and Organizational Attributes assessments and should be areas of focus" | **4.0** at item level | A named driver list, regardless of the axis total |
| **Prosci PCT** `PCT pp.2–4` | 4 sides × 10 items, **[quoted]** "1-3 scale: 1 = inadequate, 2 = adequate, 3 = exceptional" | **Sum** each side independently. Range 10–30. No cross-side roll-up | Three bands, **unequal widths (10 / 5 / 6)**: **[quoted]** "10-19" = "High risk/threat – needs immediate action"; "20-24" = "Alert/possible risk – needs further investigation"; "25-30" = "Strength – should be leveraged and maintained" | alert floor **≈3.33**, strength floor **≈4.17** | Three named bands with an action verb each, plotted one per triangle side |
| **Prosci Sponsor** `SPONSOR p.1` | 20 items, 1–5, **[quoted]** "1 is equal to 'Never' and 5 is equal to 'Always'" | **Sum** to /100 | **[quoted]** "High = 80–100; Moderate = 70–79; Low = < 70". Widths 21 / 10 / 56 — deliberately harsh. Plus an item rule: **[quoted]** "Any item you graded a 3 or less is an area of opportunity" | Low/Moderate boundary **3.5**; Moderate/High boundary **4.0**; item flag **≤3.0** | Three bands, no differentiated tactic per band |
| **Prosci People Manager** `PEOPLEMGR pp.1–2` | 4 categories × 5 items, 1–5, **[quoted]** 1 = "Not achieved", 5 = "Completely achieved" | **Sum** per category to /25. No overall roll-up | Two-level rule: **[quoted]** "any line item that you graded a 3 or less" and **[quoted]** "Any category that has a total score of 15 or less should be viewed as an area for improvement" | category flag **3.0**, item flag **≤3.0** | Per-category improvement flags |
| **Prosci Role Roster** `ROSTER p.1` | 5 ADKAR columns per role, each 1–5, **[quoted]** "1 to 5 with 1 being the lowest" | **Not summed.** The lowest-scoring element becomes the **[quoted]** "Barrier Point" — effectively a minimum | None | — | One barrier element per role, then free-text **[quoted]** "Activation Tactics" |
| **Prosci template, 10 Aspects** `template s.21` | 10 aspects, **[quoted]** "Degree (0-5)" — note the zero | **[silent]** Roll-up rule not stated | None | — | Ten independent degrees plus a Yesterday/Tomorrow narrative per aspect |
| **Prosci template, ADKAR Blueprint** `template s.28` | 5 ADKAR elements | **No arithmetic.** A gap gauge per element, **[quoted]** "Small / Medium / Large", circled | None | — | 5 elements × 3 activities = 15 planned activities with role and timeline |
| **Aberdeen rubric** `Aberdeen s.18` | 7 impact types across People / Process / Technology | **Ordinal band selected from a written descriptor.** No arithmetic anywhere | 3 bands: Low / Medium / High. The word ladder is consistently **[quoted]** Minimal → Noticeable → Significant | — | One band per impact type. **[silent]** How the seven produce the single "Degree of Impact" shown at `s.20` is never stated |
| **Aberdeen 2×2** `Aberdeen s.13` | **[quoted]** "Impact on Stakeholder Group" (Low/Medium/High) × **[quoted]** "Degree of Influence on the Program" (Low/Medium/High) | **Lookup.** A 3×3 input space collapsed onto 4 named quadrants — the middle band is absorbed, not assigned | None numeric | — | **[quoted]** "Involve Extensively" / "Address Concerns" / "Enlist as needed" / "Keep Informed", each with a prescribed action list |
| **Openlink client plan** `Openlink image2.png, image3.png` | 5 criteria in two blocks — Impact: Functional Areas Affected, Operational Impact; Urgency: Contractual Obligation, Data Integrity, Legal or Compliance — each on 4 named bands | **[silent]** How five criteria collapse to one Impact and one Urgency rating is deferred: **[quoted]** "Refer to the Change Request Register for detailed formulas." That register was not supplied. Then a **4×4 lookup matrix**, asymmetric | Hard counts only: **[quoted]** "4 or more groups" / "3 groups" / "2 groups" / "1 group"; **[quoted]** "More than 2 Contracts" / "2 Contracts" / "1 Contract" / "None"; effort **[quoted]** "< 20 hours" / "20 - 40 hours" / "> 40 hours" | — | **P1–P4**, then a banded approval gate: P1/P2 to the Change Control Board with an SME pre-read, P3/P4 handled by the project team |
| **Proxima — Change Impact severity** `DI1!G25` | 10 aspects, 0–5, all six points verbally anchored | **Mean over the non-zero items only** — `SUM(G14:G23)/COUNTIF(G14:G23,">0")`. Equal weights | **[silent]** No named bands. Encoded only as a 3-stop colour scale: green at 0, amber at **3**, red at 5 | pivot **3.0** | An unnamed 0–5 severity number, plus a separate aspect count |
| **Proxima — aspect breadth** `DI1!G24` | the same 10 aspects | `COUNTIF(...,">0")` — a count, not a score | One discrete highlight rule: **7 to 10 of 10 aspects impacted** | — | A breadth count 0–10 |
| **Proxima — ADKAR barrier** `DI1!E30`, `DA-Rl!N12` | 5 ADKAR elements, 1–5. **[silent]** No verbal anchors exist for these | **First-fail-in-sequence lookup — not a mean and not a minimum.** Walk A→D→K→A→R in fixed order, return the first element scoring ≤3 | **≤3 fails, ≥4 passes** | Six outcomes: Awareness / Desire / Knowledge / Ability / Reinforcement / **[quoted]** "No barrier" |
| **Proxima — Risk quadrant** `DA-Rk!B51` | 14 + 14 items, 1–5, **every item carries an explicit anchor pair** in columns **[quoted]** "Min (1)" and "Max (5)" | **Gated simple sum per axis, then a 2×2 lookup.** `IF(COUNTIF(B11:B24,">=1")=14,SUM(B11:B24),"NA")` — a **completeness gate**: no partial scoring, no imputation, returns "NA" until all 14 are answered. Then nested `IF` on both sums | **42 on both axes**, resolved as `>=42` is the high side. 42 = 14 × 3.0, a per-item mean of exactly **3.0** | **[quoted]** "High" / "Medium" / "Low" / "NA" — four cells, three band names |
| **Proxima — normalisation** `DA-Rk!G60`, `G61` | the same sums | `=F60/14` and `=F61/14` — **Prosci normalises its own sums to a 1–5 per-item mean**, which is exactly the axis score our model uses | the 42 cut on the sum *is* the 3.0 cut on this mean | Two 1–5 axis scores |
| **Proxima — PCT** `PCT!J9, J12, G14, M14` | 4 × 10 items, 1–3 | Gated simple sum, equal weights, range 10–30 | Conditional formatting places the real cut points on half-integers: **24.5** and **19.5**. As per-item means: green ≥ 2.45, amber 1.95–2.45, red < 1.95 | ≈**4.08** / ≈**3.25** on a 1–5 rescale | **[quoted]** "Strength - should be leveraged and maintained" / "Alert/possible risk - needs further investigation" / "High risk/threat - needs immediate action" |
| **Proxima — Sponsor Competency** `SpComp!C39` | 20 items, 1–5, **[quoted]** "1=least" … "5=most" | Plain simple sum to /100. No gate, no weights | **[quoted]** "Score interpretation: 80-100 = Excellent; 70-79 = Good; 69 and below = Fair to Poor)" | Excellent ≥ **4.0**; Good floor **3.5** | **[quoted]** Excellent / Good / Fair to Poor |
| **Proxima — Manager Competency** `MgrComp!C43` | 20 items, 1–5, **[quoted]** "1=not achieved" … "5=completely achieved" | Plain simple sum to /100 | **[silent]** No interpretation line and no conditional formatting on this sheet — the bands simply do not exist for the manager instrument, though they do for the sponsor one | — | **[silent]** None |
| **Team 2, our model** `spec s.7, s.8` | 3 sub-factors per axis, each 1–5 | **[silent]** The spec never states the aggregation method. Zero occurrences of "weight", "weighted", "average", "mean", "formula" or "equal" across all 16 slides. A mean is the natural reading of "both axes scored 1–5" but it is an inference | One shared threshold: **[quoted]** "Both axes scored 1–5. The threshold sits at 3.5." **[silent]** Inclusive or exclusive is undefined | **3.5** | Four tiers, four distinct names |

### Where our approach follows a precedent

1. **Two axes in, four named tiers out.** Direct precedent, and it is the strongest thing we have. Prosci's own instrument is the same shape — `template s.23` speaker notes, verbatim: **[quoted]** "The Risk Assessment looks at two key aspects of any given change initiative: Change Characteristics (the SIZE/SCOPE of a change) and Organizational Attributes (how READY/RESISTANT an organization is for adopting/ embracing a change). Looking at these two aspects will allow you to scale and customize your strategy appropriately based on your project's risk profile." Aberdeen's `s.13` and the Openlink 4×4 are two more instances.
2. **A single threshold applied to both axes.** Precedented: Prosci's risk grid splits at 42 on *both* axes (`RISK p.4`). Read the precedent carefully, though — both Prosci axes are 14-item sums on identical scales, whereas our two axes are 3-item composites of quite different content.
3. **Four distinct output bands.** Precedented in Aberdeen (`s.13`, four named quadrants) and Openlink (P1–P4). Not in Prosci's risk grid, which labels four cells with only three names.
4. **Scaling the intervention to the band.** `RISK p.4`, verbatim: **[quoted]** "Based on the risk profile for your change, you can make informed decisions to customize and scale your approach. High risk changes require more time, effort and resources to support than low risk changes." And `template s.23` notes: **[quoted]** "The location of your project in the Risk Grid impacts how to customize your plans." That is the tiering argument in Prosci's own words.
5. **Items scored 1–5 with named poles.** Precedented across four of the five Prosci instruments and all 28 Proxima risk items.
6. **A 1–5 per-item mean as the axis score.** Precedented, and this one was a surprise: `DA-Rk!G60 = B49/14` and `G61 = B50/14`. **Prosci itself normalises its 14-item sums into exactly the 1–5 axis mean our model uses.** Our axis arithmetic is not a departure at all — it is what Proxima computes in two otherwise unused cells.
7. **Equal weights.** Precedented uniformly. No weight exists anywhere in Proxima.

### Where we depart from all of them

1. **The averaging risk is real, but it is a small-n problem, not an averaging problem.** The earlier reading — that every source sums and none averages — was wrong: Proxima's severity axis is a genuine mean. The real difference is **n**. Proxima averages over up to 10 aspects and Prosci's risk axes sum 14 items; we average **3** sub-factors. One sub-factor at 5 moves our axis by 0.67, enough to cross 3.5 on its own, which no 14-item instrument can do. **[ours]** If a defence is needed, it is that our three sub-factors are deliberately chosen and individually meaningful rather than a broad battery — but the sensitivity is genuine and the mitigations in points 4 and 5 matter more because of it.
2. **We take the mean over all three sub-factors; Proxima takes it over the impacted ones only.** Its zero-exclusion rule has no analogue in our model, because our 1–5 scale has no zero. A role where decision rights genuinely do not change scores our minimum, 1, and that 1 still drags the axis mean down. On Proxima's logic it should have been excluded from the calculation entirely. **[ours]** This is the most substantive mechanical difference between our model and Prosci's, and it is worth a deliberate decision rather than an accident: either accept it, or add a "not applicable" state to each sub-factor and divide by the count of applicable ones.
3. **3.5 is Prosci's competency convention, not its risk convention.** Expressed as a per-item mean on 1–5, the set's cuts are **3.0** (Proxima's risk quadrant at 42/70, the Risk PDF's grid, and the People Manager category flag), **≤3.0** (item flags in Sponsor and People Manager), **≈3.25** (Proxima's PCT amber floor at 19.5/30), **3.5** (**Proxima's Sponsor Competency "Good" floor at 70/100, and the Sponsor Assessment PDF's Low/Moderate line at the same 70/100**), **4.0** (Sponsor "Excellent" floor, and Prosci's Risk Driver item promotion), **≈4.08** (Proxima's PCT green floor at 24.5/30). **The contrast is exact and it is the sharpest thing in this section: where Prosci tiers risk it cuts at 3.0; where Prosci grades a person's competency it cuts at 3.5.** Our tool tiers risk and cuts at 3.5. So 3.5 is a real Prosci number — twice over, from two independently extracted products — but it comes from the wrong instrument for what we are doing, and it is **stricter than the convention of the instrument our design actually copies**. That is defensible and it is a choice. The honest line for a client room: "we deliberately set a higher bar than Prosci's risk grid, because a 5,000-person ERP go-live is less forgiving than a generic risk screen." Never "Prosci uses 3.5".
4. **We have no item-level escape hatch.** Prosci runs one in parallel with its sum — any single item at 4 or 5 becomes a named Risk Driver regardless of the axis total (`template s.23` notes). We have nothing equivalent, so a cell averaging 3.4 with one sub-factor at 5 lands in a low tier and its landmine is invisible. **[ours]** Recommendation: adopt the rule verbatim. It is cheap, deterministic, cites cleanly to Prosci, and given point 1 it matters more for a 3-item mean than it does for Prosci's 14.
5. **Nobody resolves the boundary cleanly, and Proxima shows the seam.** Its printed guidance says **[quoted]** "A score of 14 to 42 is considered low risk" and **[quoted]** "A score of 42 to 70 is medium-to-high risk" — 42 appears in both ranges — and only the formula settles it, `>=42` landing on the high side. The spec says nothing about whether 3.5 counts as high or low. **[ours]** Recommendation: follow Proxima and make the threshold inclusive upward (≥3.5 is high), state it in the code, and add a flagged review band of ±0.15 for human validation. The spec already supplies the mechanism at `s.16` — **[quoted]** "Validate the 9 Rebuild roles with site leadership — 90 minutes per site" — and §8.6 shows why the band is needed.
6. **We have no completeness gate; Proxima refuses to score without one.** Both risk axes return the string **[quoted]** "NA" unless all 14 items are answered — no partial scoring, no imputation, no silent treatment of a blank as a zero. **[ours]** Strong recommendation to copy this. Across 760 cells populated partly by LLM extraction from process design documents, a missing sub-factor silently scored as 1 would systematically under-tier exactly the roles nobody has documented yet.
7. **We compute where Aberdeen and Openlink judge.** Both of those sources pick an ordinal band from a written descriptor; neither does arithmetic. Deterministic code buys reproducibility across 760 cells and loses the analyst's judgement the rubric approach preserves. §2's written anchors are the mitigation.
8. **We wire the score to the action; Prosci's own tool does not.** This is the largest structural departure in the set and it is in our favour. In Proxima, **every score is a dead end.** The risk quadrant `DA-Rk` is a terminal island — nothing feeds it and nothing reads it, so the risk band never scales a plan, never sets a cadence and never gates an activity. `DI!F` (Degree of Impact) is read by no formula. `DI!M` (Barrier Point) is read by no formula. `DI!C` (number of people in group) is captured and **never referenced anywhere**, so there is no headcount weighting of any kind. The instrument diagnoses and displays; a human reads the colour and picks a tactic. **[silent]** There is therefore **no source precedent for any automated band-to-action rule** beyond the barrier-to-tactic-column correspondence described in §4. Our deterministic tier-to-package mapping is genuinely new work, not a reimplementation — and the 12%-of-people-absorbing-55%-of-budget concentration on `spec s.9` has no precedent at all, because no source ever multiplies a score by a headcount.
9. **We use one factor on both axes.** In Aberdeen's rubric, Knowledge & Skills is an **impact** sub-factor (`s.18`); in our model capability sits on **adoption risk**. Neither Aberdeen, Openlink nor Proxima ever uses a factor on two axes. If the build lets capability influence both, that double-use is ours and is unsupported by these sources.
10. **Our four tiers do not correspond to Proxima's diagnosis.** Proxima selects an intervention by **which ADKAR element fails first**, not by how severe the change is — a fundamentally different routing key. See the note in §4.

**[ours]** One consequence of the workbook shipping unfilled: **there is no worked example anywhere in it.** Every score cell is empty and the cached values are `0`, `""`, `"NA"` or `#VALUE!`. There is no reference dataset to test a reimplementation against, so the build will need its own fixtures and cannot claim numerical agreement with Prosci's tool.

---

## 4. What each tier gets

**Read the provenance note under the table before using any of this.** Cells marked **[quoted]** carry a source number; cells marked **[ours]** do not, and cells marked **[silent]** mean no source supplies a number and we have not invented one.

| | **Rebuild**<br>high impact · high risk | **Enable**<br>high impact · low risk | **Reassure**<br>low impact · high risk | **Inform**<br>low impact · low risk |
|---|---|---|---|---|
| **Training** | **[quoted]** Instructor-Led Training, **"1-4 Hours"**, complexity **"High, Medium"**, audience **"Centralized"**, **"Small, Medium"**, led by **"Local TTT Participants (Functional and Business SMEs)"** `Aberdeen s.46`.<br>**[quoted]** Job-aid inventory at High-impact volume: **6–9** named aids per functional area `Aberdeen s.20`.<br>**[quoted]** Practice is not optional — ADKAR Ability triggers are **"Size of the K-A gaps / Barriers/capacity / Practice/coaching"** `template s.15`.<br>**[ours]** Team 2's own dose: **"3-day sandbox"** `spec s.11`; for deskless roles **"on-shift micro-training at the line"** `spec s.12`. | **[quoted]** ILT **"1-4 Hours"** or Virtual ILT **"0.5-1.5 Hours"**, complexity **"Low, Medium"**, audience **"Distributed"**, **"Medium, Large"** `Aberdeen s.46`.<br>**[quoted]** Job aids at Medium-impact volume: **5–9** `Aberdeen s.20`.<br>**[ours]** Spec package: **"Role-based training · job aids"** `spec s.8`. | **[quoted]** Web-based Training **"15-90 minutes"** or Nano-Learning **"1-5 minutes"**, complexity **"Low"**, **"N/A - Self Driven"** `Aberdeen s.46`.<br>**[quoted]** Aberdeen's all-employee tier: **"On-demand resources for basic needs"** `Aberdeen s.87`.<br>**[ours]** Skill is not the constraint — **"address the fear, not the skill"** `spec s.8`. Training here exists to remove an excuse, not to close a gap. | **[quoted]** Support Materials only — Job Aids, BPPs, QRGs — **"1-30 minutes"**, **"Low"** complexity, self-driven `Aberdeen s.46`.<br>**[quoted]** Job aids at Low-impact volume: **2** `Aberdeen s.20`.<br>**[ours]** No role-specific curriculum. |
| **Super-user / change-agent structure** | **[silent] No source in the set gives any super-user ratio.** Aberdeen contains no 1:X figure anywhere.<br>**[quoted]** What Aberdeen does give: process partners **"were already appointed a year prior to go live"**, and the role was **"formalized by e.g having exceptions from work time included, their workload was measured from the outset and their efforts celebrated outside of the project team"** `Aberdeen s.111`.<br>**[quoted]** **"On board the Change Network approximately 3 months prior to go-live"** `Aberdeen s.117`.<br>**[quoted]** TTT participants **"Serve as Super-Users for individual organizations"** `Aberdeen s.58`.<br>**[quoted]** Network sized off the assessment: **"Define Business Advocate Network (BAN) distribution functionally and geographically based on Impact assessment results"** `Aberdeen s.118`.<br>**[quoted]** Prosci names both structures as first-class plan types, selectable from a dropdown: **"Change Agent Network Plan"** and **"Super-User Plan"** `Proxima dropdowns!L6:L11`, offered at `Plan-I!D20:D29`.<br>**[ours]** The ratios **1:15**, **1 per site** and **1 per 12 leads** are Team 2's own `spec s.11, s.12, s.13` — do not cite them to Aberdeen, and note that **[silent]** Proxima quantifies no dosage of any kind either. | **[quoted]** This is the tier champions are recruited *from*: **"Help individuals understand critical role as change agents"** `Aberdeen s.13`, Address Concerns quadrant.<br>**[quoted]** One change lead per value stream: **"Each workstream e.g., OTC, P2P, ATR and so forth should have a dedicated change person"** `Aberdeen s.110`.<br>**[ours]** Spec package: **"recruit as champions"** `spec s.8`.<br>**[silent]** No ratio. | **[silent]** No dedicated structure in any source, and Aberdeen's nearest quadrant is not a real analogue — its **"Enlist as needed"** is high-*influence*, low-impact, while our Reassure is high-*risk*, low-impact.<br>**[quoted]** The action Aberdeen attaches to that quadrant: **"Maintain awareness of changes to support and/or influence"** `Aberdeen s.13`.<br>**[ours]** Cover this tier from the site change coach rather than a dedicated network. | **[silent]** None.<br>**[quoted]** The only participation offered: **"Provide opportunity to participate in or contribute to program"** `Aberdeen s.13`, Keep Informed quadrant. |
| **Communications** | **[quoted]** **"Provide individualized attention to educate on benefits through 1:1 meetings"** · **"Fully understand and address individual's suggestions and concerns"** · **"Formalize role as program champion"** · **"Coach individual to be a change leader"** `Aberdeen s.13`, Involve Extensively.<br>**[quoted]** Full 5-comm milestone sequence: Kick-Off Announcement, Cutover News, Training Awareness, Go-Live Announcement, Post Go-Live Support `Aberdeen s.31`.<br>**[quoted]** Channel constraint for deskless sites: email is **"ineffective"** where staff have no **"access to computers"** `Aberdeen s.112`. | **[quoted]** **"Hold regularly scheduled meetings to provide updated program information and status"** `Aberdeen s.13`, Address Concerns.<br>**[quoted]** Webinar format with real run-of-show: session **"45 minutes to 1 hour"**, invitation **"5 to 7 business days ahead of the session"**, **"might need to offer two or more sessions"**; components ~5 min welcome, ~10 min project update, ~10–20 min demos, ~15–20 min Q&A, ~5 min close `Aberdeen s.34`. | **[quoted]** Cascade through managers: **"Created a sponsorship cascade with managers; ensured that they were building support with their direct reports"** `SPONSOR item 10`.<br>**[quoted]** Fear-directed FAQ, ready-made: **"What is changing? What is not changing?"** · **"What should I not worry about?"** `Aberdeen s.33`.<br>**[quoted]** Objective ladder for this tier sits between **"Build Awareness"** and **"Drive Acceptance"** `Aberdeen s.28`.<br>**[ours]** Spec package: **"Manager cascade"** `spec s.8`; **11** cascade scripts, **340** supervisors briefed on decision rights `spec s.13`. | **[quoted]** **"Inform of program status, major program milestones, and potential risks/issues through general communications"** `Aberdeen s.13`, Keep Informed.<br>**[ours]** Of Aberdeen's five milestone comms, this tier needs three — Kick-Off, Go-Live, Post Go-Live Support `Aberdeen s.31`; the Cutover and Training comms have no addressee here.<br>**[ours]** Spec package: **"Broadcast comms only"** `spec s.8`. |
| **People-manager actions** | **[quoted]** **"I conducted one-on-one sessions with employees to identify how they would be impacted by the change, to link the change to their job role, and to listen to their concerns."** `PEOPLEMGR MET1` — the highest-touch tactic in the set.<br>**[quoted]** **"I assessed the gap between current job knowledge and skills, and the job knowledge and skills needed to support the change, to create professional development plans for each employee."** `PEOPLEMGR MET3`.<br>**[quoted]** **"I mentored employees during the implementation of the change and provided a safe environment for employees to practice, make mistakes, and adapt to the change."** `PEOPLEMGR MET5`.<br>**[quoted]** **"I identified any areas of resistance to the change and effectively managed this resistance."** `PEOPLEMGR MET2`.<br>**[ours]** Team 2's dose: **"6-week floor coaching"** and a **"manager script on decision rights"** `spec s.11`. | **[quoted]** **"I assessed the gap between current job knowledge and skills..."** `PEOPLEMGR MET3`.<br>**[quoted]** Protect the time: **"I provided ongoing information about the change and ensured that employees had the time necessary to attend training."** `PEOPLEMGR MET4`.<br>**[quoted]** Managers get their own training tier: **"On demand training for high priority management tasks"** `Aberdeen s.87`. | **[quoted]** This is the tier where the manager *is* the intervention. **"I explained 'why' the change was happening, including the risk of not changing."** `PEOPLEMGR IC2`.<br>**[quoted]** **"I corrected misinformation that may have been circulating about the change."** `PEOPLEMGR IC4`.<br>**[quoted]** **"I formally encouraged dialogue with my employees by asking them to provide feedback and to raise their questions and concerns about the change."** `PEOPLEMGR IC3`.<br>**[quoted]** The named role: CLARC's **"Resistance Manager"** `template s.24`. | **[quoted]** Awareness relay only: **"I shared with employees the nature of the change in context with the broader vision and direction of the organization."** `PEOPLEMGR IC1`.<br>**[silent]** No source assigns a lighter manager action than this. |
| **Sponsor actions** | **[silent] The spec deck has no sponsor track at all** — every leadership reference in all 16 slides is manager- or supervisor-facing. This whole row is built from Aberdeen and Prosci.<br>**[quoted]** **"Held direct, face-to-face meetings with front-line supervisors to explain 'what, why and how.'"** `SPONSOR item 12`.<br>**[quoted]** **"Was involved in critical decision making (at critical milestones, at steering committee meetings, in one-on-one sessions)."** `SPONSOR item 4`.<br>**[quoted]** **"Effectively responded to enduring or persistent resistance."** `SPONSOR item 9`.<br>**[quoted]** **"I recommend pairing key leaders with the project team members as their point of contact"** `Aberdeen s.117`.<br>**[quoted]** The sign-off event: **"a formal 'sign off' event where all the leaders signed their name to the blueprint design and we published it online."** `Aberdeen s.115`.<br>**[quoted]** Attendance lever: **"daily reports of training attendance"** shown to senior leaders `Aberdeen s.116`. | **[quoted]** **"Was present to kick off special events and training sessions."** `SPONSOR item 2`.<br>**[quoted]** **"Sponsored the change with direct reports (created awareness of the need for change, built support, and followed up)."** `SPONSOR item 7`.<br>**[quoted]** **"Active support in driving the importance of training, providing resources to support the training program, and encouraging training attendance"** `Aberdeen s.41`.<br>**[silent]** No source assigns sponsor effort by tier. | **[quoted]** **"Was visible to employees; effectively communicated why the change was happening, the risks of not changing, and the vision for the organization."** `SPONSOR item 15`.<br>**[quoted]** **"Spoke face-to-face at townhall meetings, road shows and key presentations."** `SPONSOR item 18`.<br>**[quoted]** Arm them or lose them: **"Provide leaders with talking points and engagement activities to demonstrate leadership of the solution. If you don't provide it to them, they will make things up or not communicate at all. Make it simple as possible."** `Aberdeen s.106` and `s.117` — Aberdeen states this twice. | **[quoted]** Programme-level only, not tier-specific: **"Communicated frequently throughout the project and with multiple media (not just during the kickoff of the project)."** `SPONSOR item 19`.<br>**[silent]** No tier-specific sponsor action exists for a low-impact, low-risk population, and inventing one would be the wrong answer anyway. |
| **Support after go-live** | **[quoted]** The full four-layer escalation ladder: **1. Job Aids** — "always available for access"; **2. Project Teams** — "on demand support"; **3. Trainers & Implementation Leads** — "available to support end users with emerging challenges"; **4. Leadership** — **"Leaders play the critical role in sustaining the change and serve as an escalation point for challenges that cannot be addressed through other channels"** `Aberdeen s.88`.<br>**[quoted]** Measurement window: **"assess adoption and system feedback over a 6-month period post Go-Live"** `Aberdeen s.89`.<br>**[quoted]** **"Reinforcement Trainings"** in the Deploy phase `Aberdeen s.103`.<br>**[ours]** Team 2's dose: **8 weeks** hypercare `spec s.13`; **4 weeks** floor presence at go-live for deskless roles `spec s.12`. | **[quoted]** Hypercare is the floor deliverable in every tier — even Aberdeen's lightest ambition tier gets **"Focus on delivering training Go-Live communications and Hypercare support"** `Aberdeen s.107`.<br>**[quoted]** Layers 1–3 of the escalation ladder `Aberdeen s.88`.<br>**[quoted]** **"Reinforcement Trainings"** `Aberdeen s.103`. | **[quoted]** Hypercare floor `Aberdeen s.107`, job-aid layer `Aberdeen s.88`.<br>**[quoted]** For this tier the re-measure *is* the deliverable, because the risk is sentiment rather than skill: **"Organization readiness assessment ... To be conducted every 3 - 4 months to access readiness & change effectiveness"** `Aberdeen s.103`.<br>**[quoted]** Adoption metrics available without a survey: **"Unique Sign-Ons"**, **"Open/Completed Business processes"**, **"Job Aids click/access rates"**, **"Click rates on Go Live communications"**, **"HR Case Volume"** `Aberdeen s.90`. | **[quoted]** Hypercare floor still applies `Aberdeen s.107`.<br>**[quoted]** Layer 1 only: job aids **"will be always available for access"** `Aberdeen s.88`.<br>**[quoted]** Passive measurement only — **"Click rates on Go Live communications"** `Aberdeen s.90`. |

### Prosci's own tactic library, and why it is keyed differently

Proxima ships the one real intervention library in the set — `BP-T`, **[quoted]** "ADKAR Tactics and Activities Examples", five columns of tactics, one per ADKAR element. **It is selected by the barrier point, not by a severity tier.** That is a genuinely different routing key from ours, and it is worth understanding before borrowing from it: Prosci asks *which element failed*, we ask *how bad is this and how likely is it to fail*.

The tactics are usable regardless, and they map onto our tiers cleanly enough to be worth the cross-reference. All verbatim from `Proxima BP-T!B8:F8`:

| ADKAR column | Tactics, verbatim | Closest tier |
|---|---|---|
| **[quoted]** "Awareness tactics:" | "Provide repetitive face-to-face communication of the business reasons for the change and the risks of not changing" · "Use a variety of communication channels, such as team meetings, emails, bulletin board postings, posters, etc." · "Provide employees with ready access to business information, such as external drivers of change" · "Share customer feedback and develop effective responses" · **"Surface and address rumors"** | **[ours]** Inform, and the comms floor of every tier. "Surface and address rumors" is the single best-aimed tactic in the library for Reassure |
| **[quoted]** "Desires tactics:" | "Help employees identify the personal benefits of the change (WIIFM)" · "Acknowledge the losses and opportunities associated with the change" · **"Address negative history with change – discuss why previous mistakes occurred and how current and future changes can be implemented differently to ensure success"** · "Engage employees in the change process at the earliest possible stages of the change" · "Align incentive and performance management systems to support the change" | **[ours]** Reassure. The negative-history tactic is aimed exactly at the spec's Warehouse Team Lead population with its **"2 prior failed WMS attempts"** (`spec s.12`) |
| **[quoted]** "Knowledge tactics:" | "Ensure employees have access to and time to attend training" · "Use job aids to assist employees in the learning process" · "Provide open and ready access to information to support learning" · "Identify employees that others can go to for assistance" · "Share problems and lessons learned as a team" | **[ours]** Enable. Note "Identify employees that others can go to for assistance" is the super-user concept stated without a ratio |
| **[quoted]** "Ability tactics:" | "Provide one-on-one coaching" · "Help employees apply what they have learned to real work situations" · "Ensure that employees have the time and opportunities to develop new skills" · **"Provide solutions when the 'real work' does not match what they learned in training"** · "Be a role model for how to act in the new environment" · **"Identify when 'more time' is not the answer and external intervention is required"** | **[ours]** Rebuild. This column is the strongest external support for the Rebuild package — Prosci's own answer to a capability gap is coaching and real-work application, not more course hours |
| **[quoted]** "Reinforcement tactics:" | "Celebrate successes" · "Recognize employees for successfully implementing change" · "Gather feedback from employees" · **"Identify root causes for low adoption and implement corrective action"** · "Build accountability mechanisms into day-to-day business operations" | **[ours]** The post-go-live column of every tier |

**[silent]** Note what the library still does not give us: **no dosage.** `BP-T` says **[quoted]** "repetitive face-to-face communication" and the blueprint sheets provide 15 dated activity rows per ADKAR element, but no rule anywhere sets the number, the hours, the ratio or the cadence. Aberdeen remains the only source in the set with real numbers, which is why the table above is built on Aberdeen and not on Prosci.

**[ours]** One design option this opens up: run **both** keys. Our two axes decide the *dose* — how much intervention this cell gets — and an ADKAR barrier point, if the readiness pulse is scored A/D/K/A/R per §5, decides the *kind*. That is additive rather than competing, it uses each source for what it actually measures, and it means a Rebuild cell blocked on Desire gets different content from a Rebuild cell blocked on Ability. The spec is silent on anything like this, so it is an offer to the app session, not a requirement.

### Provenance of this table

**This table is authored by us.** **[silent]** None of the five Prosci instruments contains a tier-to-tactic mapping, and neither does the Proxima workbook — in Proxima the risk band is a terminal island that drives nothing at all (§3, departure 8). All five were checked: there is no Rebuild/Enable/Reassure/Inform-style matrix, no training-hours table, no super-user or change-agent ratio, and no communication cadence in any of them. Every prescriptive element in the Prosci set is one of three things — "scale effort to risk", "flag anything rated 3 or less", or a free-text action box the practitioner fills in.

What the table actually is: **Aberdeen's own delivery material, re-cut into four tiers, standing on Prosci's scale-your-approach principle.** Aberdeen supplies the numbers — the modality-and-hours decision table at `s.46`, the job-aid volumes at `s.20`, the webinar run-of-show at `s.34`, the milestone comms sequence at `s.31`, the escalation ladder at `s.88`, the measurement window at `s.89`, the network timing at `s.117` and `s.111`. Prosci supplies the warrant for differentiating at all, and says it three times across three products: **[quoted]** "High risk changes require more time, effort and resources to support than low risk changes." (`RISK p.4`); **[quoted]** "The location of your project in the Risk Grid impacts how to customize your plans." (`template s.23` notes); and in the workbook itself, **[quoted]** "High risk changes require more time, effort " / "and resources than medium or low risk changes." (`Proxima DA-Rk!B57:B58`). Three independent instances of the same principle is as well-supported as anything in this evidence base gets.

Three honest limits on the table. First, **Aberdeen's four quadrants are not our four tiers** — its second axis is influence over the programme, not adoption risk, so the mapping (Involve Extensively ≈ Rebuild, Address Concerns ≈ Enable, Enlist as needed ≈ Reassure, Keep Informed ≈ Inform) inverts on one axis and must not be presented as validation. Second, **no source supplies a super-user ratio**, so the 1:15 in the spec deck is Team 2's number and Aberdeen's material must not be cited behind it. Third, **Aberdeen's job-aid-count pattern is not clean** — Low impact draws 2 aids, but Recruiting at Medium draws 9, the same as Core HCM at High (`s.20`). Use the volumes as an order of magnitude, not a formula.

---

## 5. Readiness pulse questions

The spec deck specifies the instrument at `s.15`: **[quoted]** "12 questions across understanding, capability confidence, decision-rights comfort, and local support — keyed to the same taxonomy, so live survey data drops straight into the model", deployed **[quoted]** "email at HQ · shift-huddle QR code in plants · manager-led for supervisors", over **[quoted]** "5 working days, 3 channels" (`s.16`).

**Three things to say plainly before the item list.** **[silent]** Aberdeen's 126-slide deck contains no verbatim readiness-survey or pulse item bank and no survey response scale — no Likert wording, no anchors, no item text. Surveys are referenced as an activity roughly nine times and never instantiated. Do not attribute any pulse item to Aberdeen. **[silent]** No source in the set contains a single decision-rights survey item, which makes group 3 below the most exposed part of this instrument. **[silent]** And there is no employee pulse instrument in the Proxima workbook either — `Info!G19` lists **[quoted]** "Integration with data collection around ADKAR and PCT (future release of Proxima Pulse)" as online-only, unbuilt functionality. Prosci's own pulse did not exist at the version we hold.

> **Before reusing any Prosci item wording below.** Several items in this section are adapted from Prosci's Manager Competency and Sponsor Competency banks, which appear in both the assessment PDFs and the Proxima workbook. Those instruments carry distribution restrictions — see §8.8. **The recommendation is the one that makes the question moot: write original items against the mechanics.** The items below marked **[ours]** already do that; the ones marked **[quoted]** show what they were derived from and should not themselves be shipped in the tool.

What the sources *do* supply is a set of first-person stems that read as pulse items almost unaltered — Prosci's ADKAR "What you hear" column (`template s.15`), verbatim: **[quoted]** "I understand why…" / "I have decided to…" / "I know how to…" / "I am able to…" / "I will continue to…". Those five stems anchor the instrument.

**Scale, and the one decision the app session must make.** **[ours]** Recommended: a single 1–5 agreement scale for all employee items, 1 = strongly disagree, 5 = strongly agree, with **5 = good**. This is Prosci's direction in the Sponsor, People Manager and Role Roster instruments and the *opposite* of the Risk Assessment's direction, where 5 = worst. Any item lifted from the Risk Assessment must be flipped before it enters an adoption-risk score. See §8.

### Group 1 — Understanding · ADKAR Awareness

| # | Item | Provenance |
|---|---|---|
| 1 | "I understand why we are changing to the new system and the new operating model." | **[quoted]** stem "I understand why…" `template s.15` · **[ours]** completion |
| 2 | "I can explain what changes in my own daily work, not just what changes in the system." | **[ours]** drafted. Written to test the spec's central claim at `s.3` that function-level assessment **[quoted]** "funds nothing and trains no one" |
| 3 | "Someone has explained to me why this is happening, including the risk of not changing." | **[quoted]** source item, manager voice, past tense: "I explained 'why' the change was happening, including the risk of not changing." `PEOPLEMGR IC2`, scale 1–5, 1 = "Not achieved", 5 = "Completely achieved" · **[ours]** rewritten to employee voice and present tense |

**[quoted]** Free-text prompt available as-is, from Aberdeen's pre-baked FAQ list: "What is changing? What is not changing?" `Aberdeen s.33`.

### Group 2 — Capability confidence · ADKAR Knowledge and Ability

| # | Item | Provenance |
|---|---|---|
| 4 | "I know how to do my job in the new system." | **[quoted]** stem "I know how to…" `template s.15` · **[ours]** completion |
| 5 | "I have had enough hands-on practice to do my job on day one." | **[quoted]** stem "I am able to…" `template s.15`, plus its Ability trigger **[quoted]** "Size of the K-A gaps ... Practice/coaching" · **[ours]** completion. This item exists to separate Knowledge from Ability, which is Prosci's own distinction and the argument for sandboxes over courses |
| 6 | "The training I have had matches the tasks I actually do." | **[ours]** drafted. Justified by Aberdeen's blended-learning principle, **[quoted]** training should be "role specific and 'fit-to-purpose'" `Aberdeen s.44` |

**[quoted]** Available as a leader-rated item rather than self-report: "Impacted employee change competency", 1 = "Highly effective at thriving in change", 5 = "Lack skills and knowledge" `RISK p.3, OA12`. Note this scores general change competency, not job skill, and its direction is inverted.

### Group 3 — Decision-rights comfort

**[silent]** No source in the set contains a decision-rights survey item. All three items are ours. This is the group to have an answer ready about.

| # | Item | Provenance |
|---|---|---|
| 7 | "I am clear about which decisions I will still make myself after go-live." | **[ours]** drafted |
| 8 | "I am comfortable with the system deciding things I used to decide." | **[ours]** drafted, from the spec deck's own formulation: **[quoted]** "I used to approve this, and now the system does." `spec s.7` |
| 9 | "When the system's answer looks wrong, I know what I am allowed to do about it." | **[ours]** drafted. This is the exception-handling limb, and it is the item most likely to predict a Plant Scheduler failure at go-live |

Nearest source measures, both rater-scored rather than self-reported, neither a pulse item: **[quoted]** "Degree of organizational restructuring", 1 = "No restructuring", 5 = "Complete restructuring" `RISK p.2, CC10`; and **[quoted]** aspect 7 "Reporting Structure" on a "Degree (0-5)" scale `template s.21`.

### Group 4 — Local support · site leadership, saturation, access

| # | Item | Provenance |
|---|---|---|
| 10 | "My manager has talked with me about how this change affects my job specifically." | **[quoted]** source item, manager voice: "I conducted one-on-one sessions with employees to identify how they would be impacted by the change, to link the change to their job role, and to listen to their concerns." `PEOPLEMGR MET1`, scale 1–5, 1 = "Not achieved", 5 = "Completely achieved" · **[ours]** rewritten to employee voice |
| 11 | "I have had the time I need to attend training." | **[quoted]** source item, manager voice: "I provided ongoing information about the change and ensured that employees had the time necessary to attend training." `PEOPLEMGR MET4`, same scale · **[ours]** rewritten to employee voice |
| 12 | "I know where to go for help when something goes wrong after go-live." | **[ours]** drafted, mapped to Aberdeen's four-layer escalation ladder `Aberdeen s.88` so a low score points at a specific missing layer |

### Site-leader companion items — asked of the site lead, not the population

These are **quotable as-is** and need no rewriting, which makes them the most defensible items in the instrument. All four are `RISK p.3`, scale 1–5 with only the poles labelled, and all four run **5 = worst** — flip them before use.

| Item, verbatim | Anchor at 1 | Anchor at 5 | Reference |
|---|---|---|---|
| **[quoted]** "Change saturation" | "Very few changes, under capacity" | "Everything is changing, over capacity" | `RISK p.3, OA3` |
| **[quoted]** "Management of past changes" | "Well-managed, successful changes" | "Poorly managed, failed changes" | `RISK p.3, OA2` |
| **[quoted]** "People manager change competency" | "Highly effective at managing change" | "Lack skills and knowledge" | `RISK p.3, OA11` |
| **[quoted]** "Perceived need for change among impacted people" | "People are dissatisfied with current state" | "People are satisfied with current state" | `RISK p.3, OA1` |

### Routing question — not scored

| Item | Provenance |
|---|---|
| "I have reliable access to a computer or device at work during my shift." | **[ours]** drafted as a routing screener, not a scored item. Justified by the only source statement on deskless populations: **[quoted]** "Site employees (e.g, warehouse drivers) often did not have access to computers and some have lower literacy, communication vehicles like email messages were ineffective" `Aberdeen s.112` |

### Optional 13th item, beyond the spec's twelve

| Item | Provenance |
|---|---|
| "I expect to still be working this way in six months." | **[quoted]** stem "I will continue to…" `template s.15`, ADKAR Reinforcement · **[ours]** completion. Worth adding only for the post-go-live waves, since Aberdeen recommends measuring adoption **[quoted]** "over a 6-month period post Go-Live" `Aberdeen s.89` |

**Cadence conflict, flagged here and in §8.** The spec re-scores at **[quoted]** "30-day intervals" (`s.16`); Aberdeen's own recommendation is **[quoted]** "every 3 - 4 months" (`s.103`). A monthly cadence is three to four times Aberdeen's, and Prosci warns about exactly this: **[quoted]** "How do you avoid multiple data gathering initiatives that will irritate your people?" (`Aberdeen s.120`, DCV Essential Phase 2). Twelve questions is short enough to survive monthly, but the tension should be a decision rather than an accident.

---

## 6. Credibility lines for the deck

### Aberdeen's own material

All from `Change Management Materials MASTER (Batch 1-4)`, March 2024.

| Line | Reference |
|---|---|
| **[quoted]** "Change Management is a structured approach for preparing, equipping, and supporting individuals to successfully adopt change. It helps drive change commitment and organizational success." | `Aberdeen s.3` |
| **[quoted]** "Proactive change management increases engagement, minimizes organizational disruption, risk, and productivity losses, and prepares the organization for long-term, sustainable results." | `Aberdeen s.3` |
| **[quoted]** "Different stakeholders will experience change(s), sometimes the exact same change, differently. Picture a teenager and their grandparent trying to operate a new iPhone the first time… do they have the same needs?" — the best single line for justifying Role × Process × Site over process alone | `Aberdeen s.7` |
| **[quoted]** "When you buy a new car, you don't have to relearn to drive…but you might need to learn to drive a stick shift, or where the gas cap release is." — partial familiarity within one role | `Aberdeen s.7` |
| **[quoted]** "Top-3 reasons why transformation programs fail to deliver results are people factors: 82% Resistance by employees · 72% Inadequate sponsorship · 65% Unrealistic expectations" | `Aberdeen s.99` |
| **[quoted]** "To capture the full value potential organizations need to see this as a technology-enabled transformation, not a technology implementation" | `Aberdeen s.100` |
| **[quoted]** "Change Management drives project ROI through faster speed of adoption, higher ultimate utilization, and higher proficiency" | `Aberdeen s.5` |
| **[quoted]** "Projects with established and effective change management programs are more likely to meet objectives, stay on schedule, and stay on budget" | `Aberdeen s.5` |
| **[quoted]** "Leadership Alignment — Drives everything · Change Impacts — Orchestrates Everything · Communication & Stakeholders Engagement — Informs Everything · Training — Enables Everything · Driving change — Inspires Everything" | `Aberdeen s.104` |
| **[quoted]** "By collecting low/medium/high impacts in one visual overview, it can be easier for the business to understand the changes that are coming and help to prioritize resources and time" — direct justification for the heat-map output | `Aberdeen s.110` |
| **[quoted]** "Provide leaders with talking points and engagement activities to demonstrate leadership of the solution. If you don't provide it to them, they will make things up or not communicate at all. Make it simple as possible." — stated twice in the deck | `Aberdeen s.106`, `s.117` |
| **[quoted]** "Site employees (e.g, warehouse drivers) often did not have access to computers and some have lower literacy, communication vehicles like email messages were ineffective" | `Aberdeen s.112` |
| **[quoted]** "the process partners role was formalized by e.g having exceptions from work time included, their workload was measured from the outset and their efforts celebrated outside of the project team" | `Aberdeen s.111` |
| **[quoted]** "Without open lines of communication, a vacuum appears, and misinformation is quickly spread." | `Aberdeen s.117` |
| **[quoted]** "Aberdeen's change management approach integrates directly with our hybrid agile delivery methodology to maintain a sharp focus on user awareness and adoption." | `Aberdeen s.8` |
| **[quoted]** "Identify risk and key attention points early and put your focus here... Major changes identified should always be dealt with accordingly and brought to the attention of the right stakeholders already during Explore and Design" | `Aberdeen s.110` |
| **[quoted]** "Our recommendation is to assess adoption and system feedback over a 6-month period post Go-Live." | `Aberdeen s.89` |
| **[quoted]** "Do people find loop holes to continue working in their old way?" · "Have people really 'got it' - that they are in a new reality with a new set of expected behaviors, skills and accountabilities?" | `Aberdeen s.121` |

**Aberdeen's real numbers**, all from actual engagements rather than illustration:

| Number | What it is | Reference |
|---|---|---|
| **[quoted]** Low **36%** / Medium **50%** / High **14%** | Observed impact distribution on a real HCM phase-1 assessment. Half of all impacts land in the middle band — a useful prior against a top-heavy heat map | `Aberdeen s.19` |
| **[quoted]** Process **67%** / Technology **26%** / People **7%** | Impacts by category on the same assessment. Process changes outnumber people changes roughly 10:1 in raw count | `Aberdeen s.19` |
| **[quoted]** "Change Impacts Captured¹ = 28", "Change Impacts Validated² = 28", with group × level counts totalling 43 | Aberdeen already fans one impact across multiple groups — the same many-to-many Role × Process × Site produces | `Aberdeen s.19` |
| **[quoted]** "Over 1200 change impacts were documented impacting multiple business areas" | Realistic order of magnitude for an ERP impact log, ~1,200-employee agricultural client | `Aberdeen s.112` |
| **[quoted]** ILT "1-4 Hours" · vILT "0.5-1.5 Hours" · WBT "15-90 minutes" · Nano-Learning "1-5 minutes" · Support Materials "1-30 minutes" | The complexity → modality → hours decision table. The highest-value numeric table in the deck | `Aberdeen s.46` |
| **[quoted]** Low impact = **2** job aids; Medium = **5–9**; High = **6–9** | Real job-aid volumes by impact rating. The correlation is imperfect — Recruiting at Medium also draws 9 | `Aberdeen s.20` |
| **[quoted]** "1700+ employees" · "3000+ employees", "a leading $120 billion US media company" · "450 employees" · "~1200 employees" | Four named-industry case studies with headcounts, all S/4 or finance transformation | `Aberdeen s.108`, `s.109`, `s.111`, `s.112` |
| **[quoted]** "~70 virtual practice labs to give hands on experience"; "enabling ~2,000 employees and 1,000 external users" | Delivery volumes from the global media case | `Aberdeen s.109` |
| **[quoted]** "30,000+ Global SAP ERP customers" · "12,500+ S/4HANA licenses procured" · "6,800+ S/4HANA projects ongoing" · "4,500+ Customers are live on S/4HANA" | Burning-platform market sizing | `Aberdeen s.97` |
| **[quoted]** "On board the Change Network approximately 3 months prior to go-live" · process partners "appointed a year prior to go live" | The only two network-timing figures in the deck | `Aberdeen s.117`, `s.111` |
| **[quoted]** "To be conducted every 3 - 4 months to access readiness & change effectiveness" | Aberdeen's own readiness re-measurement cadence | `Aberdeen s.103` |

### Prosci's material

| Line or figure | Reference |
|---|---|
| **[quoted]** "The Risk Assessment looks at two key aspects of any given change initiative: Change Characteristics (the SIZE/SCOPE of a change) and Organizational Attributes (how READY/RESISTANT an organization is for adopting/ embracing a change). Looking at these two aspects will allow you to scale and customize your strategy appropriately based on your project's risk profile." — **the single best quote for justifying a two-axis tiering tool** | `template s.23`, speaker notes |
| **[quoted]** "The location of your project in the Risk Grid impacts how to customize your plans." | `template s.23`, speaker notes |
| **[quoted]** "The 'Risk Drivers' are the key elements rated a '4' or '5' in your Change Characteristics and Organizational Attributes assessments and should be areas of focus as your Change Management plan is developed to manage these key risks." — Prosci's own numeric promotion threshold | `template s.23`, speaker notes |
| **[quoted]** "Based on the risk profile for your change, you can make informed decisions to customize and scale your approach. High risk changes require more time, effort and resources to support than low risk changes." | `RISK p.4` |
| **[quoted]** "Organizational Outcomes are the Collective Result of Individual Change" — one line justifying a per-cell unit of analysis over a programme-level score | `template s.16`, title |
| **[quoted]** "If a project is weak in any of the four elements, it will struggle or fail. PCT Assessment scores are a leading indicator of the potential for a successful implementation." | `PCT p.2` |
| **[quoted]** "Project management + Change management = Project success", under the heading "The Math is Clear" | PM infographic, p.1 |
| **[quoted]** "Think beyond simply installing your project. You can improve project outcomes by focusing more on people." — "installing" versus adopting, good framing for a go-live audience | PM infographic, p.1 |
| **[quoted]** "71% more likely to stay on schedule" · "81% more likely to stay on budget" · "600% more likely to meet project objectives", introduced by "Prosci research shows that projects with excellent change management are:" | PM infographic, p.1 |
| **[quoted]** "Projects that had an excellent change management approach met objectives 93% of the time or six times as often as those with a poor change management approach." — cited to "Prosci 2020 Benchmarking Data from 2007, 2009, 2011, 2013, 2015, 2017, 2019" | `template s.19`, chart alt-text and citation line |
| **[quoted]** "Speed of adoption, ultimate utilization, proficiency" — the three adoption measures, usable as our outcome metrics | `template s.7` |
| **[quoted]** "Change saturation" · "Productivity plunges (deep and sustained)" · "Stress, confusion, fatigue" — the consequence library, and "change saturation" names the ERP-plus-operating-model double-change risk in two words | `template s.20` |
| **[quoted]** "People managers contribute to successful change outcomes by supporting direct reports in their own change journeys by fulfilling five key roles: Communicator, Liaison, Advocate, Resistance Manager and Coach (CLARC)." | `ROSTER p.1`, field tooltip |
| **[quoted]** ABCs of sponsorship — "Actively and visibly participate" / "Build a coalition" / "Communicate directly" | `template s.24`, `s.25` |
| **[quoted]** ADKAR "What you hear" phrasebook — "I understand why…" / "I have decided to…" / "I know how to…" / "I am able to…" / "I will continue to…" | `template s.15` |
| **[quoted]** ADKAR Ability triggers — "Size of the K-A gaps / Barriers/capacity / Practice/coaching" — the argument that training alone does not produce Ability | `template s.15` |
| **[quoted]** "Apply structure and intent to change" — a concise mission statement for the tool itself | `template s.24`, Change Practitioner role |

**Prefer 6x over 600%.** The PM infographic (2022) prints "600% more likely to meet project objectives"; the Practitioner template (2021) gives the same claim as "6x increase in likelihood" with the underlying "93% of the time … six times as often" and a named data vintage. When precision matters, use the 6x/93% formulation and cite `template s.19`. **[silent]** The PM infographic states no sample size, study year or benchmarking edition for the 71% / 81% / 600% figures.

**From the Proxima workbook.** Three lines worth having, all verbatim:

| Line | Reference |
|---|---|
| **[quoted]** "Impacted individuals don't think about the job aspects that aren't affected, only those that are. Removing them from the impact score more accurately reflects what the impacted individuals would perceive the impact to be." — the methodological justification for scoring what changed rather than everything, and a good answer to "why not just score all ten aspects" | `Proxima DI1!C12` |
| **[quoted]** "Transition from 'Knowledge' to 'Ability' as you go beyond in-program learning to in-practice application." — the sandbox argument in one sentence | `Proxima Info!B8` |
| **[quoted]** "Proxima follows a structured, adaptable, and repeatable approach to help change leaders and practitioners achieve change success throughout a project or initiative." | `Proxima Info!D8` |

**[silent]** And the useful negative: the workbook contains **no research statistic, benchmark, correlation, sample size or study citation** anywhere in 78 sheets. It is a blank instrument, not a research report. Every Prosci statistic quoted above comes from the infographics or the Practitioner template, not from Proxima.

> **Rights and distribution — a caution to check, not a conclusion.** All five Prosci fillable instruments carry, verbatim: **[quoted]** "Not intended for further distribution. Prosci is a registered trademark of Prosci Inc. © Prosci Inc. All rights reserved." (`RISK p.4`, near-identical on `PCT p.4`, `ROSTER p.1`, `PEOPLEMGR p.2`, `SPONSOR p.1`). Both infographics carry **[quoted]** "© Prosci, Inc. All rights reserved." and ADKAR appears as **ADKAR®**. The Proxima workbook adds its own Terms sheet, quoted in full in §8.8.
>
> This document quotes that text accurately and **does not attempt to interpret what it permits.** That is not a question this evidence base can answer. The practical route, which is the recommendation either way: **paraphrase and attribute in the deck, write original items in the tool, and reach for Aberdeen's own material whenever a client-facing number is needed.** See §8.8.

### Kotter, and framework lineage

**[silent]** No quotation, page number or statistic from Kotter's *8 Steps* eBook, Kotter's *Change*, or Hiatt & Creasey's *Change Management: The People Side of Change* (Prosci, 2012) is available in this evidence base. Those three PDFs were read outside this file set and nothing citable from them was captured. **Put nothing Kotter-attributed on a slide beyond naming the lineage.**

**[ours]** The lineage claim that is safe to make out loud, because it is structural rather than quotational: Kotter's eight steps sequence the *programme* — one ordered path for the whole organisation. ADKAR models the *individual* — five internal states one person moves through. Neither operates at the level where a training budget is actually spent. Our unit of analysis sits between them: **the segment**, at Role × Process × Site, which is the smallest thing that can own a curriculum, a message, a super-user and a named accountable manager (`spec s.5`). Prosci's own template makes the same point in a title we can quote — **[quoted]** "Organizational Outcomes are the Collective Result of Individual Change" (`template s.16`) — and Aberdeen's `s.13` and `s.18` already operate at segment level. That is the argument. It needs no Kotter quote to land.

**[silent]** Note also that Aberdeen's own deck never names Prosci, ADKAR or Kotter and contains no comparison claim of any kind. Any "we beat framework X" framing is ours to own, not Aberdeen's to be cited for.

---

## 7. Where Aberdeen's material beats the generic frameworks

Six arguments, each with citations, written to be said out loud. The first four rest on Aberdeen's material; the fifth rests on what Prosci's own workbook demonstrably does not do. **[silent]** The honesty caveat first: Aberdeen's deck never names Prosci, ADKAR or Kotter, and contains no explicit comparison of any kind. These are structural differences we assert on the evidence of specific slides and cells — not quoted comparisons.

**1. Aberdeen scores the change; the generic frameworks score the person.**

ADKAR rates an individual on five internal states — Awareness, Desire, Knowledge, Ability, Reinforcement. Aberdeen's `s.18` rates the *change object* on seven observable, work-content dimensions — Knowledge & Skills, Organization & Roles, Ways of Working & Behaviors, Policies & Procedures, Process & Tasks, Data, Technology & Tools — each with written Low/Medium/High anchors that describe what actually differs in the job: **[quoted]** "Significant changes to process-hand offs / Significant changes to number of process steps". That is a rubric an analyst can apply from a to-be process design without interviewing anybody, which is precisely what a deterministic scorer across 760 cells requires. It is also the only source of written anchors in this entire evidence base — §2 exists because `s.18` exists. `Aberdeen s.17`, `s.18`.

**2. Every tier lands on a named intervention with a duration attached.**

Kotter's eight steps prescribe a sequence for the programme and prescribe nothing per segment. Aberdeen's material chains all the way through: a 2×2 quadrant with a named strategy list (`s.13`) → a complexity × audience-size × audience-distribution decision table that outputs a modality *and its hours* — **[quoted]** ILT "1-4 Hours", vILT "0.5-1.5 Hours", WBT "15-90 minutes", Nano-Learning "1-5 minutes", job aids "1-30 minutes" (`s.46`) → audience-specific content recommendations (`s.87`) → a job-aid inventory per impact rating, 2 at Low and 6–9 at High (`s.20`) → an ambition-tier tactic set where the lightest tier gets exactly **[quoted]** "training, Go-Live communications and Hypercare support" and the heaviest adds **[quoted]** "Higher need for stakeholder engagement and coaching for leaders" (`s.107`). Generic frameworks give you a sequence. Aberdeen gives you a menu with a price tag. `Aberdeen s.13`, `s.20`, `s.46`, `s.87`, `s.107`.

**3. Aberdeen already resolves change to role, then position, then person, then learning path.**

This is the strongest structural differentiator, because it is exactly the granularity our 38-role grid assumes. Aberdeen ships a **[quoted]** "Role Mapping Engine" to **[quoted]** "map Contacts or Positions to Business Roles" and to **[quoted]** "Link Business Roles to Learning Paths to facilitate role-based learning" (`s.118`); an **[quoted]** "R2PM (Role to Position Mapping) Template" as a client deliverable (`s.112`); R2PM as a required input to training needs analysis — **[quoted]** "Maps the business roles required to perform the identified tasks to positions (and people)" (`s.52`); a curriculum computed from three inputs, **[quoted]** "Change Impacts + Stakeholder Analysis + Role-to-Position Mapping" (`s.49`); first-person role personas (`s.69`); and a Basic/Advanced proficiency level assigned per module per role band (`s.73`). Prosci and Kotter both stop at "stakeholder group". `Aberdeen s.49`, `s.52`, `s.69`, `s.73`, `s.112`, `s.118`.

**4. Site is a first-class dimension in Aberdeen's material, not an afterthought.**

Role × Process × **Site** is not something we bolted onto Aberdeen — Aberdeen's own deliverables already vary by site. The change-agent network is sized **[quoted]** "functionally and geographically based on Impact assessment results" (`s.118`). A **[quoted]** "Local Training Coordinator will be identified at each training location" and sessions are **[quoted]** "hosted at each site" (`s.43`, `s.60`). A **[quoted]** "Site Readiness Checklist" is a named deliverable (`s.112`). And the deskless finding is stated outright: **[quoted]** "Site employees (e.g, warehouse drivers) often did not have access to computers and some have lower literacy, communication vehicles like email messages were ineffective" (`s.112`) — which is the entire justification for our fourth site archetype and for the deskless-access limb of local readiness. One worked programme is even scoped as a genuine multi-dimensional grid: **[quoted]** "6 roles in total ... 10 countries in total ... 8 curricula in total / 11 modules in total" (`s.70`). `Aberdeen s.43`, `s.60`, `s.70`, `s.112`, `s.118`.

**A fifth argument, and it is now the most concrete of all — because we can point at the file.** The generic frameworks do not connect the score to the plan, and the Proxima workbook proves it rather than merely suggesting it. In Prosci's own offline tool, **every score is a dead end.** The risk quadrant sheet `DA-Rk` is a terminal island: nothing feeds it and no formula reads it, so the High/Medium/Low band never scales a plan, never sets a cadence and never gates an activity. `DI!F`, the Degree of Impact, is read by nothing. `DI!M`, the Barrier Point, is read by nothing. And `DI!C`, **[quoted]** "Number of People in Group", is captured on the register and **referenced by no formula anywhere in 78 sheets** — there is no headcount weighting in Prosci's instrument at all. A practitioner reads a colour and picks a tactic by hand.

That is the gap the tool closes, and it is worth saying in exactly those terms: *"Prosci's own workbook stops at the diagnosis. It will tell you a group is high risk and it will not tell you what that costs, who staffs it, or how many people it touches. We score 760 cells deterministically and emit the plan."* Two supporting details make the same point on scale: Proxima's unit of analysis is a single flat **[quoted]** "Impacted Group Name", **capped at 20** because the twenty group sheets are hard-coded — with **no process dimension and no site dimension of any kind.** Our 38 × 5 × 4 grid has no analogue in it. `Proxima DA-Rk`, `DI!C`, `DI!F`, `DI!M`, `DI1`…`DI20`.

**A sixth, if the room is technical.** Aberdeen is ERP-native rather than change-generic: 36 slides — nearly a third of the deck — are SAP/S/4HANA-specific and would be meaningless in a generic change course, including a process inventory (`s.113`) that already lists Procure to Pay, Order to Cash and Record to Report as first-class objects. **Aberdeen already thinks in ERP value streams, which is our process spine.** And `s.110` assigns **[quoted]** "a dedicated change person" per workstream — **[quoted]** "OTC, P2P, ATR and so forth" — which is one change lead per value stream, exactly the five-stream structure at `spec s.6`. `Aberdeen s.110`, `s.113`.

---

## 8. Conflicts and cautions

This section exists so that nothing in the deck falls over under a question.

### 8.1 Scale directions and ranges disagree across every instrument

| Instrument | Range | Direction | Anchors labelled | Reference |
|---|---|---|---|---|
| Prosci Risk — Change Characteristics, Organizational Attributes | 1–5 | **5 = worst** (high risk) | Poles only. 2, 3 and 4 carry no verbal label at all | `RISK pp.2–3` |
| Prosci PCT | **1–3** | 3 = best | All three labelled: **[quoted]** "1 = inadequate, 2 = adequate, 3 = exceptional" | `PCT p.2` |
| Prosci Sponsor | 1–5 | 5 = best | Poles: **[quoted]** 1 = "Never", 5 = "Always" | `SPONSOR p.1` |
| Prosci People Manager | 1–5 | 5 = best | Poles: **[quoted]** 1 = "Not achieved", 5 = "Completely achieved" | `PEOPLEMGR p.1` |
| Prosci Role Roster | 1–5 | 5 = best | **[quoted]** "1 to 5 with 1 being the lowest" | `ROSTER p.1` |
| Prosci template — 10 Aspects | **0–5** | higher = more change | **[quoted]** "Degree (0-5)". A zero exists, meaning the aspect does not change at all | `template s.21` |
| Proxima — 10 Aspects | **0–5**, non-integers permitted (validation is `decimal`) | higher = more change, **red = bad** | **All six points labelled** — the only complete ladder in the set | `Proxima DI1!C12`, `G14:G23` |
| Proxima — ADKAR | 1–5, whole numbers only | 5 = best, **green = good — polarity reversed against its own impact axis on the same sheet** | **[silent]** None. Range enforced, meaning never defined | `Proxima DI1!D27:D31` |
| Proxima — Sponsor Competency | 1–5 | 5 = best | **[quoted]** "1=least" … "5=most" | `Proxima SpComp!C7:C8` |
| Proxima — Manager Competency | 1–5 | 5 = best | **[quoted]** "1=not achieved" … "5=completely achieved" | `Proxima MgrComp!C7:C8` |
| Proxima — CM performance status | 5-point ordinal | — | **[quoted]** "No Progress; Well Behind Target; Behind Target; On Target; Ahead of Target" — a ready-made status vocabulary, the only 5-point ordinal in the workbook | `Proxima dropdowns!H12:H16` |
| Prosci template — ADKAR Blueprint gap gauge | 3-point ordinal | larger = worse | **[quoted]** "Small / Medium / Large" | `template s.28` |
| Prosci template — Role Roster support and influence | two 3-point ordinals | — | **[quoted]** "supportive, neutral, opposed" and "high, medium, low" | `template s.27` |
| Aberdeen impact rubric | 3 ordinal bands | higher = more impact | Full written descriptors per band, Low / Medium / High | `Aberdeen s.18` |
| Aberdeen stakeholder 2×2 | 3 ordinal levels per axis | — | Written descriptors per level | `Aberdeen s.13` |
| Openlink criteria | 4 named bands | Critical = worst | Written descriptors per band | `Openlink image2.png` |
| **Team 2** | 1–5 | **5 = more impact / more risk** | **[silent]** None defined anywhere in the deck | `spec s.7, s.8` |

Three consequences. **Our direction matches the Risk Assessment and is the reverse of Sponsor, People Manager, Role Roster and both Proxima competency sheets** — any item lifted from those must be flipped before it enters a score. **The 0–5 impact scale is not our 1–5**: if the build reuses the ten aspects, say explicitly that it rescaled, and note what is lost — a genuine zero, meaning "Compensation does not change for this role at all", which is a useful state in an ERP rollout and which our 1 cannot express. And note that **Prosci reverses polarity between two axes on the same sheet**: on `DI1`, impact is red-at-5 and ADKAR is green-at-5. Our two axes are both bad-at-5, which is more internally consistent than the source — worth knowing, because a reviewer familiar with Proxima may expect the readiness axis to run the other way.

### 8.2 Band counts disagree, and that is why §2's anchors are part-authored

| Band count | Where | Consequence for us |
|---|---|---|
| 2 | Aberdeen proficiency levels, **[quoted]** "B = Basic" / "A = Advanced" `s.73`; audience type "Centralized"/"Distributed" `s.46` | Too coarse to anchor a 1–5 scale |
| 3 | Aberdeen impact rubric `s.18`; Aberdeen 2×2 axes `s.13`; PCT scale and PCT band table; ADKAR gap gauge `template s.28` and `Proxima dropdowns!H6:H8`; support and influence `template s.27`, `Proxima dropdowns!E10:E12`, `E17:E19`; Proxima's RAG colour scales | **The central problem for observable anchors.** Aberdeen's rubric text maps cleanly to 1, 3 and 5 and gives nothing for 2 and 4 |
| 4 | Openlink criteria bands and P1–P4 output; Aberdeen's four quadrants `s.13`; **our four tiers** | Our tier granularity matches Openlink's, not Aberdeen's rubric |
| 4 cells / 3 labels | Prosci risk grid — two cells both labelled **[quoted]** "Medium Risk" `RISK p.4`, and the same collapse hard-coded in Proxima's formula `DA-Rk!B51` | **Prosci does not distinguish our Enable from our Reassure. It calls both Medium** — in the PDF and again in the workbook |
| 4 outputs incl. a null | Proxima's risk quadrant emits **[quoted]** "High" / "Medium" / "Low" / **"NA"** | The fourth output is *unscorable*, not a tier. We have no equivalent |
| 5 | All four 1–5 Prosci item batteries; both Proxima competency sheets; Proxima's CM performance status; our axes | — |
| 6 | **[quoted]** "Degree (0-5)" `template s.21`, `Proxima DI1!C12` | Zero has no home in our scale |

**The corrected statement of the problem.** The earlier draft of this document said positions 2 and 4 had no source wording anywhere and never could. That was wrong, and the workbook is why: **Proxima's ladder labels all six points** — "No Impact / Extremely Low Impact / Low / Moderate / High impact / Extremely High Impact" (`DI1!C12`). So §2 now carries quoted words at 2 and 4. What remains true, and is the real limitation, is that **those words are pure magnitude and carry no observable content.** "Low" tells an analyst nothing about what to look for in a process design document. The only source with observable descriptors — Aberdeen `s.18` — still has three bands. So the split in §2 stands: the rung is quoted, the reason at 2 and 4 is ours.

### 8.3 The second axis means something different in every scheme

| Scheme | Axis 1 | Axis 2 | Output | Reference |
|---|---|---|---|---|
| **Team 2** | Impact severity | **Adoption risk** | Rebuild / Enable / Reassure / Inform | `spec s.7, s.8` |
| Prosci Risk Grid | Change Characteristics — size and scope | **Organizational Attributes** — ready versus resistant | High / Medium / Medium / Low risk | `RISK p.4`, `template s.23` |
| Aberdeen stakeholder map | Impact on Stakeholder Group | **Degree of Influence on the Program** | Involve Extensively / Address Concerns / Enlist as needed / Keep Informed | `Aberdeen s.13` |
| Openlink priority matrix | Impact | **Urgency** | P1 / P2 / P3 / P4 | `Openlink image3.png` |
| Prosci Role Roster | Support | **Influence** | **[silent]** No named quadrants | `template s.27` |

**Four different second axes.** The 2×2 shape is a genuine, citable precedent. The semantics are not. Two specific traps:

- **Never present Aberdeen's quadrant names as validating our tier names.** Its second axis is influence over the programme. A high-influence, low-impact stakeholder is an executive to keep on side; a high-risk, low-impact population is a group that is frightened for reasons unrelated to skill. Those are different people needing different things. The rough mapping (Involve Extensively ≈ Rebuild, Address Concerns ≈ Enable, Enlist as needed ≈ Reassure, Keep Informed ≈ Inform) **inverts on one axis** and is offered in this document as a structural analogy only.
- **Polarity differs too.** Prosci's grid puts **[quoted]** "Change Resistant" at the *top* of the y-axis with low risk at bottom-left; our impact severity increases upward and adoption risk increases rightward, with Rebuild top-right. Both are internally consistent and they do not look alike on a slide. State our orientation whenever the Prosci grid is shown alongside it.
- **Openlink's matrix is asymmetric** and ours is not. Impact = Critical with Urgency = Low still lands **P3**, and Impact = Low with Urgency = Critical also lands **P3** (`Openlink image3.png`). If someone argues our four tiers should be asymmetric, that is the precedent they will cite, and they will be citing it correctly.

### 8.4 Threshold precedents disagree, and 3.5 is nearly unprecedented

Expressed as a mean item score on a 1–5 scale so the cuts are comparable:

| Cut | Instrument, as printed | What it is grading | Reference |
|---|---|---|---|
| **3.0** | **Risk quadrant split — 42 on both axes**, hard-coded as `IF(B49>=42,...)`. 42 = 14 × 3.0, the scale midpoint | **risk tiering** | `Proxima DA-Rk!B51`, corroborated by `RISK p.4` |
| **3.0** | Impact-axis colour pivot — amber stop at 3 on a 0–5 scale | severity display | `Proxima DI1!G25` conditional formatting |
| **3.0** | ADKAR barrier trigger — **first element scoring ≤3** fails | readiness diagnosis | `Proxima DI1!E30`, `DA-Rl!N12` |
| **3.0** | People Manager category flag — **[quoted]** "a total score of 15 or less" of 25 | competency | `PEOPLEMGR p.2` |
| **≤3.0** | Item flags in both Sponsor and People Manager — **[quoted]** "graded a 3 or less" | competency | `SPONSOR p.1`, `PEOPLEMGR p.2` |
| **≈3.25** | PCT amber floor — the real cut point is 19.5 of a 10–30 range | project health | `Proxima PCT` conditional formatting |
| **≈3.33** | PCT alert floor as printed — 20 of 10–30 | project health | `PCT p.4` |
| **3.5** | **Sponsor Competency "Good" floor — 70 of 100.** The only 3.5 in the workbook | **competency** | `Proxima SpComp!B40` |
| **3.5** | **Sponsor Assessment Low/Moderate line — 70 of 100.** Independently extracted, identical boundary | **competency** | `SPONSOR p.1` |
| **4.0** | Sponsor "Excellent" / "High" floor — 80 of 100 | competency | `Proxima SpComp!B40`, `SPONSOR p.1` |
| **4.0** | Risk Driver item promotion — **[quoted]** "rated a '4' or '5'" | risk escalation | `template s.23` notes |
| **≈4.08** | PCT green floor — the real cut point is 24.5 of 10–30 | project health | `Proxima PCT` conditional formatting |
| **≈4.17** | PCT strength floor as printed — 25 of 10–30 | project health | `PCT p.4` |
| **3.5** | **Ours**, on both axes | **risk tiering** | `spec s.8` |

**Read the third column, because it is the whole finding.** The cuts are not scattered at random — they sort by what is being graded. **Every instrument that tiers or diagnoses risk cuts at 3.0**: the risk quadrant on both axes, the impact colour pivot, the ADKAR barrier trigger. **Every instrument that grades a named person's competency cuts at 3.5 and 4.0.** Prosci is stricter about people than about risk.

Our tool tiers risk and cuts at **3.5**. So 3.5 is a genuine Prosci number — appearing twice, in two independently extracted products, at the same 70/100 boundary — but **it comes from the competency instruments, not from the risk instrument our design actually copies.** Against the closest precedent we are one full scale point stricter.

That is defensible and it is a choice. The line for a client room: *"we deliberately set a higher bar than Prosci's risk grid, because a 5,000-person ERP go-live is less forgiving than a generic risk screen — and note that where Prosci grades a named individual rather than a change, it uses our number."* Never "Prosci uses 3.5 for this."

**[ours]** If the team would rather stand entirely on precedent than on judgement, moving to **3.0** would put every axis, every threshold and the aggregation method on Prosci's own conventions — at the cost of a substantially larger Rebuild population, which cuts against the spec's whole concentration argument on `s.9`. That trade is the app session's to make; it should be made knowingly.

**Boundary handling.** Proxima shows the seam and then resolves it. Its printed guidance overlaps — **[quoted]** "A score of 14 to 42 is considered low risk. " and **[quoted]** "A score of 42 to 70 is medium-to-high risk." (`DA-Rk!B55:B56`) — while the formula settles it at `>=42` on the high side. **[silent]** The spec says nothing about whether 3.5 counts as high or low. Follow the formula, not the prose: make it inclusive upward. §8.6 shows what happens when the boundary is left undefined.

### 8.5 The spec deck's silences

Every one of these is something the build had to decide for itself, and every one is a question a client might ask.

| The deck is silent on | Why it matters here |
|---|---|
| **The 1–5 anchors, for all six sub-factors and both axes** | The single largest gap, and the reason §2 exists. The scale is stated twice — `s.8`, `s.10` — and defined never. The word "anchor" does not appear in the deck |
| **The sub-factor → axis aggregation method** | Mean, weighted mean, max, something else: never stated. A keyword sweep of all 16 slides returns **zero** hits for "weight", "weighted", "average", "mean", "formula" or "equal". `s.15` names a "Scoring model" and does not define it |
| **Sub-factor weights, including for decision rights** | None stated, for any sub-factor. Slide 7's "The variable most assessments miss" framing is rhetorical — an argument for including decision rights at all, not a numeric weight. Do not present it as one |
| **Whether 3.5 is inclusive or exclusive** | No boundary convention anywhere. See §8.6 |
| **Formal definitions of the six sub-factors** | No glossary, no measurement definition, no data-source mapping. The bullet strings on `s.7` are the whole definition |
| **How the six sub-factors are populated from the five named inputs** | `s.15` lists the inputs and `s.7` lists the sub-factors; nothing connects them |
| **A sponsor track** | No sponsor or steering-committee content exists anywhere in the deck. Every leadership reference is manager- or supervisor-facing. §4's sponsor column is built entirely from Aberdeen and Prosci |
| **The "dose" function** | `s.11` and `s.12` are both Rebuild and differ substantially — 3-day sandbox versus on-shift micro-training, 1 super-user per site versus 1 per 12 leads, 6 weeks versus 4 weeks. So tier alone does not determine the package, and the deck never says what else does. `s.15` names an "Intervention rules library" containing no visible rules |
| **Unit costs** | No rates, day rates or per-seat costs, despite `s.4`, `s.15` and `s.16` all promising a costed plan. Only budget shares |
| **The derivation of ≈$5.3M** | No salary rate, headcount conversion or baseline output figure. The area between the two curves on `s.14` cannot be converted to currency from anything in the deck |
| **Tool and programme cost** | Therefore no true ROI ratio, payback period or NPV. Only gross avoided loss. `s.14` claims "It costs less" and gives no before/after budget total |
| **The recovery-time definition** | "14 weeks → 6 weeks" does not land on the plotted grid and neither series returns to 100 |
| **The full list of 38 roles; a formal site list** | Seven roles are named, all on `s.10`, explicitly the highest-scoring. The four site archetypes appear only as the compressed string "HQ · 6 plants · 2 DCs · field / commercial", and `s.10`'s Sites column mixes counts and names ("6", "8", "HQ", "HQ+6", "HQ+2") with no stated mapping |
| **The grid's cell count and sparsity** | 38 × 5 × 4 = 760 is never asserted as populated |
| **Which parts are deterministic code and which are LLM-generated** | The one relevant phrase is "AI-assisted extraction of task-level change from process design docs" (`s.15`). No model, provider, prompt, validation step or human review gate |
| **Architecture and the data model** | Zero hits across all 16 slides for "architect", "python", "database", "schema", "API" or "LLM". No entities, fields, keys or formats. The "taxonomy" that survey data is "keyed to" is referenced and never specified |
| **Speaker notes** | The deck has none at all — confirmed four independent ways. Any report claiming to quote speaker notes from this file is not quoting this file |

### 8.6 The spec deck contradicts itself

**1. Plant Controller is tiered wrongly by the deck's own rule, on the row nearest the line.**

`s.10` gives Plant Controller impact severity **4.3**, adoption risk **3.6**, tier **"Enable"**. Both scores exceed the 3.5 threshold, and `s.8`'s quadrant makes high/high = **Rebuild**. Enable requires *low* adoption risk, and 3.6 > 3.5. This is the deck contradicting itself, not an extraction artefact — the values and the string "Enable" are all in the same table on `s.10`, and the threshold and quadrant geometry are all on `s.8`. Six of the seven rows follow the rule, including Plant Buyer at 3.8/4.2 and Customer Service at 4.5/3.9.

**It is also the only row whose margin over the threshold is under 0.3.** Two readings, and the deck chooses neither: the tier label is an error, or tier assignment involves an undocumented near-boundary override. Note this connects to the weighting silence — a weighted mean could pull that 3.6 below 3.5 and dissolve the contradiction, but no weights exist to check. **[ours]** Whatever the app session decides, someone should be able to answer this in a client room in one sentence, and the ±0.15 review band recommended in §3 is the cleanest answer available.

**2. Rebuild headcount is tight across two slides.** `s.9` puts **620** people in **9** Rebuild roles. The six rows tiered Rebuild on `s.10` already total **518** people across 6 roles, leaving **102** people for the remaining 3 roles. Not strictly contradictory, and both slides are footnoted illustrative, but it will not survive arithmetic from an attentive client.

**3. The scored unit is genuinely ambiguous.** `s.5` and `s.13` insist the unit is Role × Process × Site. `s.9` and `s.10` score and tier at **role** level, with one role mapped to a single value stream — or "All", for Master Data Steward. Whether one role can hold different scores across processes and sites is never resolved. This is the most consequential ambiguity in the deck, because it determines whether the grid has 38 rows or 760.

**4. The recovery statistic does not reconcile with its own chart.** The dip depths check out — untargeted troughs at 78 (a 22-point dip, matching "22%"), targeted at 89 (11 points, matching "11%"). The recovery figures do not: neither series returns to 100 anywhere, so "14 weeks → 6 weeks" uses an unstated definition of recovery.

### 8.7 Citation hazards — check these before anything reaches a client

**1. Slide numbers drift between the two extractions of the Aberdeen deck, by roughly one to two.** The same verbatim quotes are cited to different slides in the two readings of the same 126-slide file:

| Quote | Cited as | Also cited as |
|---|---|---|
| Process-partner concept, "appointed a year prior to go live" | `s.111` | `s.112` |
| "On board the Change Network approximately 3 months prior to go-live" | `s.117` | `s.116` |
| "Over 1200 change impacts were documented" | `s.112` | `s.114` |
| The "$120 billion US media company" case | `s.109` | `s.107` |
| The Tableau low/medium/high visual-overview line | `s.110` | `s.111` |
| "a dedicated change person" per workstream | `s.110` | `s.111` |

The quoted text is consistent across both readings; only the slide numbers are not. **This document uses the first column throughout. Verify any slide number against the file before it appears on a client slide** — an incorrect citation on an otherwise correct quote is worse than no citation.

**2. The Aberdeen master deck is not one client.** It spans at least two programmes — an HCM rollout around slides 16–20 and an S/4HANA finance transformation around slides 99–115 — plus unresolved placeholders throughout ("<Platform/Project name>", "Platform X", "[CLIENT]"). Do not present `s.19`'s impact distribution and `s.99`'s failure statistics as the same engagement.

**3. The 82% / 72% / 65% failure statistics carry no underlying source.** `Aberdeen s.99` states them and cites nothing. Attribute them as "Aberdeen's own material states", never as research findings.

**4. 600% and 6x are the same claim in different dress.** Use 6x with the 93% underlying figure and the "Prosci 2020 Benchmarking Data" citation (`template s.19`) when precision matters. **[silent]** The 600% figure has no stated sample size, study year or edition.

**5. The Prosci instruments are marked not for further distribution.** See the warning in §6. Paraphrase and attribute.

**6. Aberdeen supplies no super-user ratio at all.** No 1:X figure appears anywhere in 126 slides. The 1:15, 1-per-site and 1-per-12-leads figures are Team 2's own (`spec s.11`, `s.12`, `s.13`). Citing Aberdeen behind them would be a fabrication.

**7. Aberdeen supplies no survey item bank and no response scale.** Do not attribute any pulse item to Aberdeen. See §5.

**8. Three of our six sub-factors have a limb with zero source support** — safety consequence, task frequency and volume, and population digital maturity. None is measured anywhere in this set. Own them as ours.

**9. Aberdeen's job-aid volumes are not a clean function of impact rating.** Low draws 2, but Recruiting at Medium draws 9, the same as Core HCM at High (`s.20`). Present the volumes as an order of magnitude.

**10. The Prosci Risk PDF has internal bugs**, relevant only if the build parses filled forms. The `OA14` tooltip duplicates `OA13`'s text, so both read "Change management maturity" — the page text is almost certainly right and the tooltip is a copy-paste error. Item 4 of Organizational Attributes carries the field name `QA4`, not `OA4`. The `CC2` tooltip prints "Over 1.000" where the page prints "Over 1,000". The `OA13`/`OA14` tooltips omit the "5" from the range entirely.

**11. Aberdeen's slide 15 does not tell you where its stakeholders sit.** The 2×2 at `s.15` plots eleven named stakeholder groups as shape positions on an image-backed canvas. The group names and the quadrant labels are recoverable; **which group sits in which quadrant is not.** Do not reconstruct it from memory.

**12. Cadence conflict, live.** The spec re-scores at 30-day intervals (`s.16`); Aberdeen recommends readiness re-assessment "every 3 - 4 months" (`s.103`) and warns about survey fatigue (`s.120`). Pick one and say why.

**13. Where "capability" lives differs from Aberdeen.** In Aberdeen's rubric, Knowledge & Skills is an **impact** sub-factor (`s.18`); in our model capability delta sits on **adoption risk**. Neither Aberdeen nor Openlink ever uses one factor on two axes. If the build lets capability influence both, that is our design decision and these sources do not support it.

**14. Prosci's own item wording differs between the PDF and the workbook.** The same 28 risk items appear in both, and two anchors do not match:

| Item | Assessment PDF | Proxima workbook |
|---|---|---|
| Degree of change impact on individual — anchor at 1 | **[quoted]** "No impact" (`RISK p.2, CC7`) | **[quoted]** "No change" (`DA-Rk!D17`) |
| Impact on compensation — anchor at 5 | **[quoted]** "Large impact to pay and benefits" (`RISK p.2, CC9`) | **[quoted]** "Large impact on pay and benefits" (`DA-Rk!D19`) |

Trivial in substance, but if the deck quotes an anchor, quote one source and name it. §2 uses the PDF wording for CC7 and flags this here.

**15. The band names for the same numbers differ between the two Prosci sponsor instruments.** Identical boundaries at 80 and 70 of 100, different vocabulary:

| Score | Sponsor Assessment PDF | Proxima `SpComp` |
|---|---|---|
| 80–100 | **[quoted]** "High" | **[quoted]** "Excellent" |
| 70–79 | **[quoted]** "Moderate" | **[quoted]** "Good" |
| below 70 | **[quoted]** "Low" | **[quoted]** "Fair to Poor" |

The numbers corroborate each other, which is the useful part. The labels do not, so do not present either set as "Prosci's band names" without saying which product.

**16. The Proxima workbook has its own internal bugs.** Relevant if the build reimplements from it. `DA-Rk!D44` reads **[quoted]** "Sum of points for Change Characteristics Assessment (out of 70 total)" but sits under Organizational Attributes — a copy-paste error, and `D25` carries the same text correctly. The PCT Success block validates eleven cells (`B16:B26`) but sums only ten (`B16:B25`), so `B26` accepts a score that is never counted. `SpComp` has **no data validation at all** on its score column; the 1–5 range exists only as text. And the `shirtsize` and `plans` named ranges are defined but wired to nothing — the ADKAR gap gauge uses a separate three-value list, not the five-value `shirtsize`.

**17. The workbook ships unfilled, so there is nothing to test against.** **[silent]** Every score cell is empty; cached values are `0`, `""`, `"NA"` or `#VALUE!`. No worked example and no reference dataset exists, so a reimplementation cannot be validated against Prosci's own numbers. The build needs its own fixtures, and should not claim agreement with Prosci's tool.

### 8.8 Rights and reuse — a caution, not a conclusion

**This is flagged for a human with authority to decide. It is not a reading of what the terms permit, and this document does not offer one.**

The Proxima workbook carries a Terms sheet. `Terms!B19`, verbatim:

> **[quoted]** "You agree not to copy or distribute any content, materials, templates or checklists from this application. You agree not to copy and make available any content from this tool onto another tool or product, whether in paper or electronic format. You agree not to extract content for use in training materials or to create derivative products for internal or external use."

`Terms!B6`, verbatim: **[quoted]** "The Prosci Digital Product you are accessing is a licensed product. Prosci's content is protected by copyright laws and treaties... This license is for a single user." And `Terms!B9` addresses reproduction of the instruments, verbatim: **[quoted]** "the limited reproduction and distribution of data gathering assessments or instruments for the sole purpose of collecting information that is used by the license holder for the development of his or her change management plans or activities."

Separately, all five assessment PDFs carry **[quoted]** "Not intended for further distribution. Prosci is a registered trademark of Prosci Inc. © Prosci Inc. All rights reserved."

**What this document does with that.** It quotes the terms accurately and stops there. Whether any particular reuse falls inside or outside them is a judgement this evidence base cannot make, and nobody should treat a sentence in this document — or the absence of one — as clearance.

**[ours]** **The recommendation, which is the same whichever way that judgement goes, and which is the point to act on:**

1. **Write original items against the mechanics, not the wording.** The mechanisms are generic and independently arrived at all over the field — a two-axis threshold quadrant, an equal-weighted mean, a first-fail sequence, a completeness gate. The **item text and the item banks** are the distinctive part. §2 and §5 are already structured this way: the anchors and pulse items marked **[ours]** are ours to ship, and the **[quoted]** material sits beside them to show the derivation. Keeping that separation makes the question moot rather than answered.
2. **Use Aberdeen's own material wherever a client-facing number is needed.** Every number in §4 that matters — ILT 1–4 hours, job aids 2 at Low and 6–9 at High, the 45-to-60-minute webinar, the 3-months-before-go-live network onboarding, the 6-month adoption window — is Aberdeen's. The tier table does not depend on Prosci content for a single figure, which is not an accident and is worth preserving.
3. **Attribute and paraphrase in the deck; do not reproduce instruments in a client deliverable.** Short attributed quotes for grounding are what this document contains. Shipping a battery is a different thing, and if anyone wants to do it, that is the decision to escalate rather than infer.
4. **Escalate before the tool ships, not after.** The person to ask is whoever owns Aberdeen's Prosci relationship. This is a five-minute conversation held early and an expensive one held late.

---

*Prepared for Team 2 — Sarah Russell, Eptisam Ahmed, Harleen Arora. Aberdeen Advisors, 12 August 2026. All quoted material remains the property of its source; the Prosci instruments are marked not intended for further distribution and are excerpted here for internal grounding only.*
