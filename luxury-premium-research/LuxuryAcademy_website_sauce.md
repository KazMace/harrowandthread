# Luxury Academy sauce — filtered for website copy & design

Source: distilled from `LuxuryAcademy_sauce.md` in this folder, which is itself extracted from 29
Luxury Academy YouTube transcripts (`LuxuryAcademy_transcripts.md`). This file keeps only what
applies to a **static website** — copy, tone, pricing presentation, and visual/color choices. Cut:
body language, upselling-in-conversation, small talk, appearance/clothing, breathing/composure
training, in-person status tests. Those need a live person; a website doesn't have one.

⚠ Same warning as the parent file: claims here (stats, study attributions) are the presenter's
unverified claims. Use for voice/technique, not as citable fact. Cross-check against
`COMPLIANCE.md` before anything reaches copy — flags repeated at the bottom.

---

## 1. The language swap table (direct copy tool)

| Don't write | Write instead | Why |
|---|---|---|
| price / cost | investment | reframes as considered, not transactional |
| contract / terms | paperwork / agreement | softer, less adversarial |
| buy / purchase | own / acquire | ownership reads as accomplishment; "buy" reads as pressure |
| sell / for sale | help you acquire | removes the "being sold to" feel |
| deposit | initial investment | signals long-term value, not a bill |
| objections / concerns (FAQ framing) | areas of concern | invites dialogue instead of defensiveness |
| "luxury" (self-applied) | — don't say it, show it | see §4 |
| "affordable luxury" | — don't use this phrase at all | contradiction; dilutes the brand (see §4) |

Apply this table to every page: hero copy, pricing section, enquiry form, FAQ headings.

---

## 2. Never justify the price

Core claim from the source material: people don't evaluate value and then accept a price — they see
the price and build belief in the value to protect themselves from feeling foolish. Overexplaining
(heritage stories, technical specs, feature lists) signals insecurity and invites the reader to
interrogate the number instead of accepting it.

**For the website:** state the rate plainly (already true of H&T's "from £X/m²" tiers per
`pricing.json`). Do not surround the price with a paragraph of justification. One clean sentence of
context is fine; three paragraphs defending it is not.

---

## 3. Real scarcity vs. manufactured scarcity — a hard rule for web UX

Manufactured scarcity is detected and actively distrusted by the exact audience this site is for.
**Do not use:**
- Countdown timers
- "Only X left" claims that aren't literally, verifiably true
- Fake urgency copy ("Offer ends soon," "Limited time")

Real scarcity, if it exists, is a plain factual statement (e.g. genuine production capacity, a true
waitlist) — never a design trick. If nothing genuinely scarce exists to say, say nothing rather than
invent something. This lines up directly with `CLAUDE.md` rule 1 (never invent a fact and ship it).

---

## 4. Never discount, never call yourself "luxury"

Two separate rules from the source material, both directly applicable to site copy:

1. **Never frame anything as discounted or "affordable luxury."** The phrase itself is treated as
   self-defeating — if it's affordable to the general population, the positioning collapses. This
   matches H&T's settled "from" pricing model — never present it as a deal.
2. **Real luxury brands don't call themselves luxury in their own copy** — cited example: "Dior
   doesn't say luxury clothing." Show the standard through specificity (materials, process, imagery)
   rather than the adjective "luxury" itself. Worth an editing pass: search the site copy for the
   literal word "luxury" and ask whether each instance is doing real work or just asserting the
   claim it should be earning.

---

## 5. Cognitive load — how to structure a page so it doesn't lose the reader

Directly applicable to web copywriting and layout:

1. **2–3 points per section, not every feature.** Pick what matters to the reader, not everything
   you could say.
2. **Sequence, don't dump.** Broad and inviting first, specific detail later — matches a typical
   page scroll (hero → story → detail → price → enquiry), don't front-load specs.
3. **Plain language over "elaborate description."** Their own before/after:
   - Before: *"This piece represents the epitome of avant-garde design and unparalleled
     craftsmanship."*
   - After: *"This [item] is crafted by master artisans and its design is truly one of a kind."*
   Shorter, plainer, still confident.
4. **Images over paragraphs where possible** — the brain processes visuals faster than text. (Note:
   for H&T specifically, every rug image must show all four corners per `CLAUDE.md` rule 3 — no
   full-bleed cropping, even in service of a cleaner layout.)
5. **Frame choices as a comparison, not a list.** If offering tiers/options, state the contrast
   directly rather than listing specs in parallel: "this is the more considered option, this is the
   more flexible one" — rather than two unconnected spec tables.
6. **Recap before the decision point.** Right before an enquiry form or pricing CTA, one plain
   sentence summarizing what's on offer helps more than repeating the pitch.

---

## 6. Emotional-then-rational page flow

Core structure: **lead with story/experience/emotional benefit — not features or price.** Once the
reader's rational brain engages (usually when they hit the price), the job shifts from persuading to
reassuring: reduce perceived risk rather than re-selling the emotional case.

**Applied to page structure:**
- Hero / opening: the feeling, the room, the outcome — not specs, not price.
- Middle: the craft, the process, the specifics — this is where detail earns its place.
- Near the price: value framing (what this is worth over time), not a defensive justification.
- Close to the enquiry form: reduce risk plainly — clear next steps, what happens after they
  enquire, no pressure language.

Loss-aversion framing is available but must stay factual per `CLAUDE.md` rule 1 — no invented
scarcity claims (see §3). A true fact framed as "what you'd be without" is fine; a fabricated one is
not.

---

## 7. Tone: state it, don't perform it

From the "real confidence vs. overperformance" material — applies to written copy as much as
spoken delivery. Copy that oversells reads as insecure, not confident.

- Avoid stacked enthusiasm: "absolutely stunning," "truly exceptional," "an honor to present" — this
  reads as trying too hard, not as authority.
- Avoid hedging in copy: "we believe," "we think this might," "hopefully" — state things plainly.
- Prefer the flat, specific sentence over the adjective-heavy one. Compare:
  - Weak: *"This might sound bold, but we believe this could be one of the finest rugs we've ever
    made."*
  - Strong: *"This rug took [X weeks] to make. It is the largest we have made this year."*
- Same logic as §5.3 — plain, confident, specific beats elaborate and enthusiastic.

---

## 8. Who you're writing to — wealth-origin framing (use lightly)

Four buyer types by wealth origin, each responding to different emphasis in copy:

| Type | Responds to |
|---|---|
| Inherited wealth | heritage, continuity, discretion, "this will last" |
| Self-made wealth | bespoke, innovation, uniqueness, "this reflects what you've built" |
| Earned wealth | craftsmanship, quality, professional-grade care |
| New/unexpected wealth | clarity, guidance, reassurance, low-pressure explanation |

**Use for:** deciding which register to lean on in different sections of copy (e.g. the process page
can lean craftsmanship/heritage; the enquiry-form copy can lean clarity/reassurance for a
first-time buyer). Don't build separate pages per segment — one page can carry more than one
register in different sections without contradiction.

---

## 9. Color — directional only, not settled science

The source material is explicit that color psychology is weakly evidenced ("about as accurate as a
tarot card reading" per the presenter) — treat every point below as a hypothesis to consider, not a
rule to enforce.

- Color effects are driven by learned association, not the color itself.
- Black + white together reads as a Western luxury signal (Chanel/Dior/Prada cited) — but the
  presenter explicitly doesn't resolve whether that's inherent or just repeated brand exposure.
  Worth knowing as context, not worth treating as proof a black/white palette is "correct."
  `NOTES-codebase.md` and the site's actual design system are the authority on current palette —
  this section is background reading only, not a directive to change it.
- Cultural variance is large: don't assume a color's Western meaning holds for every visitor.

---

## Compliance flags (unchanged from the parent sauce file)

- **No social proof / testimonials / "other clients loved this."** DMCC Act 2024 strict liability,
  per `COMPLIANCE.md`. The source material leans on this heavily (§2, §4 heuristics in the parent
  file) — it cannot be used on this site.
- **No manufactured urgency.** See §3 above — ties directly to DMCC pressure-selling rules.
- **No invented statistics or study claims** lifted from the source videos (Stanford wine study,
  percentages, wealth thresholds) — these are the presenter's claims, not verified facts, and
  `CLAUDE.md` rule 1 forbids shipping unconfirmed facts.
