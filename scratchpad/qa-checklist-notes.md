# QA-CHECKLIST.md — fresh-eyes read, 2026-08-11 23:01

Two questions asked of every line: **can a browser actually decide this?** and **does the
cited source actually say it?**

Nothing in `QA-CHECKLIST.md` was edited. These are notes for the client (§3 — the checklist
is theirs to review). Line references are to the files as they stand tonight: `C:` =
`COMPLIANCE.md`, `D:` = `harrowandthread_core_Design.md`, `S:` = the Settled section of
`CLAUDE.md`.

---

## 1. Citations that do not support the assertion

### I1–I6 — the whole adversarial form block cites `C:79–80`, which is about something else

`C:79–80` sits inside **"Still outstanding before launch"** and reads:

> Form endpoint configured **and a real test submission sent** — this failure mode is
> invisible from the front end.

That supports **I7** ("a valid submission reaches `/enquire/success`") and nothing else.
It says nothing about rejecting empty submissions, malformed emails, oversized uploads,
type coercion, script injection or double-submit. Six assertions are carrying a citation
that does not hold.

They are all good tests — they are just **not client requirements**, and the document's
opening promise is that every line cites the client document it came from. Cleanest fix:
re-cite I1–I6 to `AGENTS.md` §2 (the black-box chaos cases) and label the block "general
robustness, not a client requirement", so a future session does not treat a failure there
as a compliance breach. **Client's call — not changed.**

### H3 — "Nav and footer are consistent across all 12 pages", cited to `D:14, D:27`

- `D:14` is *Consolidate Pages*: "Fewer, high-impact pages are better than a dozen mediocre
  ones. Too many pages create confusion."
- `D:27` is "Declare war on clutter. Increase white space, simplify navigation…"

Neither asks for nav/footer consistency. And `D:14` is faintly awkward for an assertion
that takes 12 pages as given — if anything the brief argues *against* the page count. The
consistency test is still worth having; it needs an honest source or none.

### H1 — "Fonts render as specified", cited to `D:5–6`

`D:5` is the Blink Test (a professional look triggers the halo effect); `D:6` is page
speed. Neither names a typeface, and **no client document specifies Fraunces or Schibsted
Grotesk** — that lives in `tailwind.config.mjs`, which the QA agent is blindfolded from.

So a blind agent literally cannot evaluate "as specified". The only form it can test is the
one the existing smoke test uses: *not* Arial and *not* a bare `serif`/`sans-serif`
fallback. Reword to that. The real authority here is `CLAUDE.md` §5 (already cited), not
`D:5–6`.

### E3 — off by one

"The choice persists across a reload" is cited `C:65`; the persistence clause is on `C:66`.
Harmless.

### Section C has no Source column at all

Every other table cites. Section C's table replaced Source with "Where it must be open" and
"Verified". The source is `C:40–50` for all four items — worth putting back, because the
opening line of the document promises it.

### Everything else checks out

Verified against the files tonight: A1 (`C:10–14` ✅, and all six names sit at `D:204–226`,
inside the cited `D:197–226` ✅), A2, A3, A4, A5, A6, A7, A8, A9, A10, B1–B4, D1 (`D:87` and
`D:94` both carry a 48-hour window ✅), D2, D3 (`C:59` ✅), D4, E1, E4, E5, F1–F5, G3, H2,
H4. The "Known contradictions" section is exact: `D:119` and `D:140` do say "handwoven",
`D:12` does say £6k.

---

## 2. Assertions a browser cannot actually decide

### Not machine-testable at all

- **G3 — "No stock photograph of another company's finished rug presented as an H&T
  commission."** Provenance is not a property of the DOM. No test can establish it; it needs
  a human who knows where each image came from, or a reverse image search. Move it to a
  human sign-off item rather than leaving a test to "pass" by doing nothing.
- **D3 / D4 — Terms carry an IP clause / cover measurement, charged area, trimming,
  fixings.** A test can assert that the words appear. It cannot assert the clause is
  adequate or enforceable. `COMPLIANCE.md` already says a solicitor must review the policy
  pages; these two belong in that review, with the keyword check as a floor.
- **A7 — "No manufacturing location, supplier, workshop or supply-chain detail."** Absence
  of an open-ended category is unfalsifiable. Only a named deny-list is testable (country
  names, "workshop", "atelier", "factory", "mill", supplier names). Without one the test
  reduces to "we did not think of anything", which passes forever.

### Testable, but the assertion needs pinning down first

- **H2 — "Page load under 3 seconds."** Under what conditions? Against `astro preview` on
  localhost this passes unconditionally and measures nothing. `D:6` is about real visitors,
  so name the profile — the mobile + simulated-throttling Lighthouse run already used on
  this build is the obvious one, and its artifacts exist.
- **B1–B4 — "visible before the enquiry form."** "Before" is three different tests: earlier
  in DOM order, above it in the viewport, or on a page the visitor necessarily passes
  through. The rate, the £200 design fee, shipping and customs are on `/` and `/carpets`
  while the form is on `/enquire` — so a same-page DOM-order test is the wrong shape. Decide
  which reading the client means or the test is arbitrary.
- **A10 — "No unconfirmed number, date or address renders unbracketed."** A browser cannot
  know which numbers are confirmed. Testable only as a fixed list of known-pending items.
  **It will fail as written:** `/privacy` currently renders `Company number: .` — an empty
  value rather than a bracketed placeholder. That is client item (b), already flagged, not
  something to fix tonight.
- **G2 — "No image slot is empty."** Testable as `naturalWidth > 0` for every `<img>`. But a
  placeholder component that renders no `<img>` at all passes trivially. Define "slot" or
  the test misses the failure it was written for.
- **I3 — "Oversized and zero-byte uploads are handled without an unhandled error."** Define
  "unhandled": a console error, an unhandled promise rejection, a page crash, or a silent
  no-op? Each is a different assertion, and the silent no-op is the one that actually hurts.
- **I4 — "Wrong types where a number is expected are rejected, not coerced silently."** If
  the size fields are `type="number"` the browser blocks non-numeric typing and the test is
  vacuous unless it uses `fill()` or `evaluate()` to force the value in. Worth stating,
  since a blind agent cannot see the input type.
- **F1 — "WCAG 2.2 AA contrast on all text."** Computable for solid backgrounds; text over
  an image or a gradient needs a human. Do not add axe for this — Playwright plus
  `getComputedStyle` does the solid-background case in about twenty lines, and the mobile
  Lighthouse artifacts already cover the rest.

---

## 3. One structural point

Sections C and E carry **"✅ Verified 2026-08-11"** marks inside the assertion tables (C1–C4,
E1, E2). A checklist handed to a blind adversarial agent should not tell it the answer in
advance — that is an invitation to confirm rather than test. The verification history is
worth keeping; it belongs beside the table, not inside it.

E2 is the sharpest case: the assertion says *"compare computed size, weight and contrast,
not just presence"*, and then the ✅ note verifies it by observing that the two buttons
**carry identical classes**. That is a source-reading check of exactly the kind `CLAUDE.md`
§5 exists to stop. The assertion is right; the evidence attached to it is not.
