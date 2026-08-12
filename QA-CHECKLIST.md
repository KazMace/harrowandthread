# QA checklist — assertions derived from the client's documents

**This is not a brief and it does not supersede anything.** Every line below cites the
client document it came from. If a line and its source disagree, the source wins and the
line is wrong. Written to be handed to a blindfolded QA agent (see `AGENTS.md`) so it has
something testable to work from; the client's documents remain the specification.

Sources: `COMPLIANCE.md` (C), `harrowandthread_core_Design.md` (D),
`CLAUDE.md` Settled section (S).

---

## A. Legal — strict liability, test these first

| # | Assertion | Source |
|---|---|---|
| A1 | No testimonial, review, rating, client name or client location appears anywhere in the rendered HTML. Specifically absent: Sarah Mitchell, James Chen, Emma Richardson, Thomas Weber, Isabella Santos, Oliver Thompson. | C:10–14, D:197–226 |
| A2 | No `aggregateRating` and no `Review` type in any JSON-LD block. | C:13–14 |
| A3 | The word "handwoven" / "hand-woven" appears nowhere as a product descriptor. "Hand-tufted" only. | C:26–28 |
| A4 | No knot-density claim, and no invitation to inspect the reverse of a rug. | C:27–28 |
| A5 | The string "Ltd" does not appear as part of the company name. | C:18–19 |
| A6 | No VAT claim: no "VAT included", no VAT line, no implication VAT is collected. Destination VAT on exports is permitted. | C:20–22 |
| A7 | No manufacturing location, supplier, workshop or supply-chain detail — in copy, alt text, image filenames, `<meta>`, or JSON-LD. | C:15–17 |
| A8 | Every rate renders with the word "from". JSON-LD uses `minPrice`, never `price`. | S, C:36–38 |
| A9 | The three tiers read exactly: Plain from £600/m², Geometric from £900/m², Pictorial from £1,200/m². | S |
| A10 | No unconfirmed number, date or address renders unbracketed. `[Trading address]` and `[Date before launch]` are correct current states, not bugs. | CLAUDE.md §4 |

## B. Price transparency — disclosed before the enquiry, not after

| # | Assertion | Source |
|---|---|---|
| B1 | The per-m² rate, the £200 design fee **and its credit-back rule** are all visible before the enquiry form. | C:32–34 |
| B2 | Shipping inclusions *and* exclusions are stated. | C:32–34 |
| B3 | Customs responsibility is stated. | C:32–34 |
| B4 | Charged area on carpets is stated. | C:32–34, C:47 |

## C. Material information — must be prominent, never collapsed

These four must be **prominent on the page that sells the thing they concern** — not buried
as their only appearance inside an accordion or FAQ.

⚠ **Corrected 2026-08-11 after verification.** An earlier version of this section asserted
"outside any `<details>`" *globally*. That is wrong and would have failed the homepage for a
non-bug: the homepage FAQ accordions legitimately **repeat** disclosures that already appear
in the open on `/carpets`. The rule is about burying, not about repeating.

| # | Assertion | Where it must be open | Source |
|---|---|---|---|
| C1 | Colour-variance position (dyed wool differs from a screen; ARS 1400 reference governs) | `/carpets` **and** `/commissions` | C:45 |
| C2 | Customs and duties are the recipient's responsibility | `/carpets` **and** `/commissions` | C:46 |
| C3 | Charged area = the full rectangle including trimmed waste | `/carpets` (carpet-only concern) | C:47 |
| C4 | Pattern trimming cuts into the design at bays and chimney breasts | `/carpets` (carpet-only concern) | C:48 |

C3 and C4 are expected to be **absent** from `/commissions` — rugs are not trimmed to a room,
so stating it there would be noise, not disclosure.

**Test shape:** on the page that sells it, assert the text exists AND
`element.closest('details') === null`. Do **not** assert global absence from accordions.
Enforced in `tests/smoke.test.mjs`.

## D. Consumer rights

| # | Assertion | Source |
|---|---|---|
| D1 | No 48-hour defect or damage window anywhere. Removed as very likely unenforceable against consumers. Note the client's source document still contains it at D:87 and D:94 — it must not have reached the site. | C:54–57 |
| D2 | Nothing purports to cut short the Consumer Rights Act 2015 short-term right to reject, or the six-month latent-fault period. | C:54–57 |
| D3 | Terms carry an IP / design-rights clause. | C:59 |
| D4 | Terms cover client measurement responsibility, charged area, trimming, and client responsibility for hanging wall pieces and fixing suitability. | C:60–61 |

## E. Cookies and privacy

| # | Assertion | Source |
|---|---|---|
| E1 | No non-essential cookie is set before consent. Assert `document.cookie` and storage are clean on first paint. | C:65 |
| E2 | Reject is as prominent as Accept — compare computed size, weight, fill and contrast, not just presence. Note the banner is withheld until `scrollY > 120` or a 6s fallback, so a test must scroll or wait before measuring. | C:65 |
| E3 | The choice persists across a reload. | C:66 |
| E4 | `/cookies` exists and returns 200. | C:66 |
| E5 | Privacy policy has a data controller contact address, a retention period, and a working deletion route for enquiry uploads (assert the `mailto:` href actually resolves — it was literal template text until 2026-08-11). | C:66–67 |

## F. Accessibility floor

| # | Assertion | Source |
|---|---|---|
| F1 | WCAG 2.2 AA contrast on all text. | C:71 |
| F2 | Visible keyboard focus on every interactive element. `focus:outline-none` appears nowhere. | C:71–72 |
| F3 | Heading order is logical — no skipped levels. | C:71 |
| F4 | Every form input has a bound label. | C:72 |
| F5 | A skip link exists and works. | C:72 |

## G. Images — the hard client rule

| # | Assertion | Source |
|---|---|---|
| G1 | **No rug is cropped.** No rug image uses `object-fit: cover`; all four corners of every rug sit inside its frame. | S (client rule, 2026-08-11) |
| G2 | No image slot is empty. ⚠ **Every image on this site is `loading="lazy"`. A test that checks `naturalWidth` at `networkidle` reports every below-fold image as broken.** Scroll the full page height and wait before asserting, or the result is meaningless. | S |
| G3 | No stock photograph of another company's finished rug is presented as an H&T commission. | C:23–25 |

## H. Craft and performance

| # | Assertion | Source |
|---|---|---|
| H1 | The display font is neither Arial nor a bare `serif`/`sans-serif` fallback. **Not** "as specified" — no client document names a typeface, and the config that does is behind the blindfold. (Covered by `tests/smoke.test.mjs`.) | CLAUDE.md §5 |
| H2 | Page load under 3 seconds. | D:6 |
| H3 | Nav and footer are consistent across all 12 pages. | D:14, D:27 |
| H4 | Trade appears in the footer only — not in the nav, not on the homepage. `/trade` is indexed. | S |

## I. Enquiry form — adversarial

Backend calls are intercepted with `page.route()`; nothing reaches Supabase or Web3Forms.
See `AGENTS.md` §3.

⚠ **I1–I6 are general robustness, NOT client requirements.** They were originally cited to
`C:79–80`, which reads *"Form endpoint configured and a real test submission sent"* — that
supports **I7 only**. It says nothing about empty submissions, malformed emails, oversized
uploads, type coercion, injection or double-submit. They are good tests; they are not the
client's stated requirements, and **a failure here is a robustness bug, not a compliance
breach.** Do not escalate one as the other.

| # | Assertion | Source |
|---|---|---|
| I1 | Submitting empty is rejected; every required field reports its own error. | `AGENTS.md` §2 (chaos cases) |
| I2 | Malformed emails are rejected (`a@`, `@b.com`, `a b@c.com`, 400-character local part). | `AGENTS.md` §2 |
| I3 | Oversized and zero-byte uploads are handled without an unhandled error. **Define "unhandled" before testing** — console error, unhandled rejection, crash, or silent no-op are four different assertions, and the silent no-op is the one that hurts. | `AGENTS.md` §2 |
| I4 | Wrong types where a number is expected (size fields) are rejected, not coerced silently. **If the input is `type="number"` the browser blocks typing — force the value with `fill()`/`evaluate()` or the test is vacuous.** | `AGENTS.md` §2 |
| I5 | Script tags and SQL fragments in text fields are neither executed nor reflected unescaped. | `AGENTS.md` §2 |
| I6 | Double-submit does not produce two submissions. | `AGENTS.md` §2 |
| I7 | A valid submission reaches `/enquire/success`. ⚠ **Do not fill the hidden `website` honeypot** — doing so redirects to `/enquire/success` *without submitting*, producing a false pass. See `AGENTS.md` §3. | C:79–80, verified live 2026-08-11 |
| I8 | **Inverse honeypot test:** filling `website` produces **no** network request to Supabase or Web3Forms, and still lands on `/enquire/success`. | `AGENTS.md` §2 |

---

## Verification history — NOT part of the checklist

⚠ **Do not move these back into the assertion tables.** A checklist handed to a blind
adversarial agent must not tell it the expected answer in advance; that invites confirmation
instead of testing. Kept here for the client's benefit only.

Checked in a real browser on 2026-08-11:

- **C1–C4 — pass.** `/carpets` states all four in the open; `/commissions` states C1 and C2.
- **E1 — pass.** Zero cookies, zero `localStorage`, zero `sessionStorage` on first paint.
  The banner is deliberately withheld until `scrollY > 120` or a 6s fallback, so it is
  genuinely true that nothing is set before consent.
- **G1 — pass, and now enforced** in `tests/smoke.test.mjs` across 7 pages.
- **G2 — pass.** All 12 pages: 8 images total, all lazy, all load on scroll. Zero broken.
  The first run of this check reported 7 "broken" images on `/` — a false positive from not
  scrolling. See the warning on G2 above.
- **F3, F4, F5, H3, H4, E4 — pass**, swept across all 12 pages: exactly one `h1` per page and
  no skipped heading levels; every non-hidden input has a bound label; a skip link is present
  on every page; nav is byte-identical across all 12 (`Commissions|Carpets|Enquire`) as is
  the footer; **trade does not appear in the nav**; every page returns 200.
  Now enforced in `tests/smoke.test.mjs`.
- **E2 — ⚠ OPEN QUESTION, needs the client.** An earlier note in this file claimed the two
  buttons "carry identical classes". **That was wrong, and it was reached by reading source
  rather than rendering — the exact failure `CLAUDE.md` §5 exists to prevent.** Measured
  computed styles:

  | | Reject all | Accept all |
  |---|---|---|
  | Background | `transparent` | solid `rgb(247,244,238)` |
  | Font weight | 400 | 500 |
  | Border | `rgba(247,244,238,0.6)` | `rgb(247,244,238)` |
  | Size / font-size | identical | identical |

  Accept is a **filled** button; Reject is a **ghost** button. Same dimensions, different
  visual weight. `CookieBanner.astro:4` asserts in a comment that "Reject is as prominent as
  Accept (PECR/GDPR)" — that claim is stronger than the rendered evidence supports, and the
  filled-accept/ghost-reject pattern is the one regulators have criticised specifically.
  **Not changed — the design system is the client's call (`CLAUDE.md` §3).** The minimal fix
  if they want it: give Reject the same `font-medium` and a solid or equally-weighted fill.

---

## Known contradictions in the source documents

Not bugs in the build — places where the client's own documents disagree. Flagged rather
than resolved, because resolving them is the client's call.

1. **The brief contains six testimonials** (D:197–226) that `COMPLIANCE.md` forbids
   outright (C:10–14). They are correctly absent from the build.
2. **The brief's privacy policy says "handwoven"** (D:140) and its care guide recommends a
   cleaner specialising in "handwoven or antique rugs" (D:119). `COMPLIANCE.md` permits
   "hand-tufted" only (C:26).
3. **The brief asks for accordions** at the bottom of the homepage (D:36); `COMPLIANCE.md`
   requires four specific disclosures to sit outside any accordion (C:40–50). Both can hold
   — accordions for FAQ, those four in the open — but a test must enforce the split.
4. **"We start at around £6k for a basic design"** (D:12) versus Plain from £600/m² (S).
   **Resolved in the build's favour, verified 2026-08-11:** `/` and `/commissions` both carry
   *"A 3 × 2m rug in a single colour starts at £3,600"* (6 m² × £600 ✓, and the pictorial
   figure of £7,200 checks out at 6 m² × £1,200 ✓). So the real entry point is £3,600, not
   £6k, and that worked example is exactly the genuinely-achievable evidence `C:36–38`
   requires against a drip-pricing finding. **Do not reintroduce the £6k figure.**
5. **The brief's 48-hour damage and defect windows** (D:87, D:94) are removed by
   `COMPLIANCE.md` (C:54–57).
