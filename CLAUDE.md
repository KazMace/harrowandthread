# Harrow & Thread — rules for any Claude session working on this project

Read this file completely before touching anything. It overrides your defaults.

---

## 1. There is exactly one brief

**`harrowandthread_core_Design.md` is the brief.** The client wrote it. It is rough,
it has typos, it contradicts itself in places. It is still the brief.

`_claude-notes-NOT-A-BRIEF.md` is **not** a brief. A previous Claude wrote it, claimed
it "supersedes" the client's document, and later sessions believed that claim and built
against it. Consequences that reached the live site:

- The client asked for accordion menus at the bottom of the homepage. That file says
  "No FAQ accordions on the homepage." The accordions were never built.
- Its "Design System" section was one Claude's aesthetic invention presented as a
  requirement, and was defended across several sessions as if the client had asked for it.

Treat it as background notes on UK law and confirmed business facts. Nothing more.

**Where the two disagree, the client's document wins. Immediately, without argument.**

If you think the client's document is wrong about something: say so in one or two
sentences, then do what it says anyway unless the client tells you otherwise. You do not
get to resolve the disagreement by writing a document that agrees with you.

---

## 2. Do not decide things that are the client's to decide

Ask first — in the conversation, before writing code — for any of these:

- Adding a section, page or component that was not requested
- Removing or reordering anything the client asked for
- Reversing a factual or editorial line the client wrote (this happened: the client's
  "treat your rug with a professional fabric protector" was silently flipped to
  "we do not recommend aftermarket protectors")
- Changing prices, tiers, rates or any commercial term
- Changing the design system — palette, typefaces, layout scale
- Changing what the enquiry form asks for, or which fields are required
- Anything the client has already given an instruction about

A quality score you generated yourself is **not** authorisation. Several changes above
were made because Claude graded its own work and acted on the grade. The client's eye
outranks every score in this repo — they spotted a real design failure in seconds that
seven self-assessment passes had rated 7/10 around.

## 3. Never invent a fact and ship it

A previous session needed a rate for all-over geometric patterns, invented **£1,250/m²**
to space the ladder evenly, and shipped it — into the rate card, and into the structured
data that AI search engines quote.

If a number, date, address, certification or company detail is not confirmed:

- Write it as a `[bracketed placeholder]`
- Say so explicitly in your reply
- Never let it reach a page, `pricing.json`, or JSON-LD

Same rule, harder, for anything legally exposed: no testimonials, reviews, ratings or
`aggregateRating` — fabricating them is a banned practice under the DMCC Act 2024, strict
liability, and "it was a placeholder" is not a defence once it is live. No "Ltd" until
Companies House registration actually exists (Companies Act 2006 s.65). No VAT claims —
the client is not registered.

## 4. Commit your work

This repo is under git as of 2026-08-11 specifically so the client can see what changed
and undo it. Therefore:

- Commit at the end of any session where you changed files
- One commit per logical change, with a message saying what and why
- Never `git reset --hard`, `git checkout -- .`, force-push or rewrite history
- Never delete or overwrite the client's `.md` documents

## 5. Report honestly

- If something is not done, say it is not done. Do not describe intent as completion.
- Verify by rendering in a browser, not by reading the config. The whole site fell back
  to Arial for several sessions because the font family name in Tailwind matched nothing
  and nobody looked at it in a browser.
- Every fix on this codebase has a history of breaking something adjacent. Check the
  thing you changed *and* what is next to it.

## 6. Never edit `~/.claude/settings.json`

Read only. A previous session broke it and the client had to repair it by hand.

---

## Known traps in this codebase

- **The Tailwind theme is fully overridden, not extended.** Undefined classes resolve to
  nothing silently instead of erroring. Keep the spacing and font scales contiguous.
- **Never `focus:outline-none`.** It once made the only conversion form keyboard-invisible.
- **Motion must never gate content.** `.reveal`/`.stagger` hidden states are scoped to
  `.js`; without that a JS failure leaves sections permanently blank.
- **Responsive sweep is 320 / 375 / 414 / 480 / 600 / 768 / 834 / 1024 / 1280 / 1440 / 1920.**
  Testing only 375 and 1440 has repeatedly missed breakage that appears at intermediate
  widths. Diagnose with `el.scrollWidth > el.clientWidth` across `body *`.
- **`@astrojs/sitemap` must stay pinned to 3.2.1** — newer versions crash on Astro 4.
- **Split vendor and standard pseudo-elements into separate CSS rules.** Grouped in one
  selector list, the whole declaration is dropped from the build.
- **The word "fold" must not appear anywhere on the site**, in any construction. Pieces
  are always rolled around a core, at every size.
- **The construction term is "hand-tufted".** Never "handwoven" or "woven".

## Client decisions — settled 2026-08-11

- **Pricing model: three tiers, "from" rates — Plain from £600/m², Geometric from
  £900/m², Pictorial from £1,200/m².** The final rate is set at quote once the design is
  known, because a border, an all-over pattern and custom elements cost different amounts.
  This replaced the four-tier fixed model and retires vendor item O1.
  - **Every rate must be rendered with "from" in front of it.** A bare "£600/m²" is a
    fixed-price claim the business cannot stand behind. A headline price that is rarely
    obtainable is drip pricing under the DMCC Act 2024 — the from-price must be genuinely
    achievable, so keep an example you would actually make at it.
  - Structured data uses `minPrice`, never `price`. Answer engines quote it verbatim.
  - The invented £1,250/m² all-over rate is gone and must never be reintroduced.
- **The client raised, and overrode, a concern about this:** dropping ~20% before VAT
  registration compresses margin when they cross the £90k threshold. They decided anyway,
  for the sound reason that a price cannot be fixed before the design is known. Do not
  reopen it.
- **Price position on `/`:** stays as the lower "Rates" section. Settled. Do not move it
  back up, and note this means the old spec's "price above the fold" acceptance line no
  longer applies.
- **Trade:** the client sells to end customers. Trade lives in the footer only — not in
  the main nav, not on the homepage. `/trade` stays live and indexed. Do not re-promote it.
  Avoid "trade specialist" phrasing anywhere; the client dislikes it.

## Still open — do not implement unilaterally

1. **Homepage "Assurances" section** — unrequested, added by an earlier session. The
   client is deciding whether to keep it. Leave it in place until they say.
2. **Enquiry form fields** — the client's instruction was "keep as many as we need,
   nothing extra". The proposed required set is name, email, what they're commissioning,
   size (or "not sure"), design tier (or "not sure"); everything else optional or cut.
   Awaiting confirmation of the exact list.
