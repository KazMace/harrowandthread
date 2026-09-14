# QA checklist — assertions derived from the client's documents

**This is not a brief and it does not supersede anything.** Every line below cites the
client document it came from. If a line and its source disagree, the source wins and the
line is wrong. Written to be handed to a blindfolded QA agent (see `docs/TESTING.md`) so it has
something testable to work from; the client's documents remain the specification.

Sources: `docs/COMPLIANCE.md` (C); the client's original brief `harrowandthread_core_Design.md`
(D — deleted 2026-09-13, read it from git history before that date); the client's settled
decisions (S — prices, no-cropped-rugs, trade placement).

---

## A. Legal — strict liability, test these first

| # | Assertion | Source |
|---|---|---|
| A1 | No testimonial, review, rating, client name or client location appears anywhere in the rendered HTML. Specifically absent: Sarah Mitchell, James Chen, Emma Richardson, Thomas Weber, Isabella Santos, Oliver Thompson. | C:10–14, D:197–226 |
| A2 | No `aggregateRating` and no `Review` type in any JSON-LD block. | C:13–14 |
| A3 | The general descriptor is "handmade"; "hand-woven" appears nowhere. Methods are named only as hand-tufted, hand-knotted or flatweave. (Client decision 2026-09-14.) | C:26–32 |
| A4 | Knot grades appear only as the mill lists them (9/25 to 10/55); no hand-knotted lead time is stated outside the proposal. | C:26–32 |
| A5 | The string "Ltd" does not appear as part of the company name. | C:18–19 |
| A6 | No VAT claim: no "VAT included", no VAT line, no implication VAT is collected. Destination VAT on exports is permitted. | C:20–22 |
| A7 | No manufacturing location, supplier, workshop or supply-chain detail — in copy, alt text, image filenames, `<meta>`, or JSON-LD. | C:15–17 |
| A8 | No price or fee amount appears anywhere on the site (client decision 2026-09-13). JSON-LD carries no `offers`. | S, C:31–41 |
| A9 | Retired 2026-09-13: prices removed from the site. The proposal carries the price. | S |
| A10 | No unconfirmed number, date or address renders unbracketed. `[Trading address]` and `[Date before launch]` are correct current states, not bugs. | Project rule |

## B. Price transparency — disclosed before the enquiry, not after

| # | Assertion | Source |
|---|---|---|
| B1 | Shipping, customs and charged area are visible before the enquiry form. No amounts anywhere. There is no design fee (client decision 2026-09-14). | C:31–41 |
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
| E1 | No cookie is set at all. Assert `document.cookie` and storage are clean after scrolling every page. | C:65 |
| ~~E2–E4~~ | Retired 2026-09-14 with the cookie banner and `/cookies`. Bring back if a cookie or tracker is ever added. | C:65 |
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
| H1 | The display font is neither Arial nor a bare `serif`/`sans-serif` fallback. **Not** "as specified" — no client document names a typeface, and the config that does is behind the blindfold. (Covered by `tests/smoke.test.mjs`.) | Project rule: verify by rendering |
| H2 | Page load under 3 seconds. | D:6 |
| H3 | Nav and footer are consistent across all 12 pages. | D:14, D:27 |
| H4 | Trade appears in the footer only — not in the nav, not on the homepage. `/trade` is indexed. | S |

## I. Enquiry form — adversarial

⚠ **Backend replaced 2026-08-20 — Supabase and Web3Forms are gone; see `google-apps-script/README.md`.**
The table below is a historical record against the *old* backend and cites specifics that
no longer exist (Supabase's 10MB storage cap, the `WARNING:` notification lines, a 413
from Supabase). **I3, I4 and I8 were re-run against the new Google Apps Script backend
the same day** — all passed then, see `tests/enquiry-adversarial.test.mjs`. **I3 failed on
2026-09-13** (a backend HTTP 500 still sent the visitor to `/enquire/success`, because
`mode: 'no-cors'` could not read the reply). Fixed the same day: the form now reads the reply
and only shows success on `{ ok: true }`. **I2, I5, I6 and I7
have NOT been re-verified against the new backend** — don't treat their old "PASS"/"FAIL"
marks below as current until someone actually re-runs them.

Backend calls are intercepted with `page.route()`; nothing reaches the real Apps Script
endpoint. See `docs/TESTING.md` §3.

⚠ **I1–I6 are general robustness, NOT client requirements.** They were originally cited to
`C:79–80`, which reads *"Form endpoint configured and a real test submission sent"* — that
supports **I7 only**. It says nothing about empty submissions, malformed emails, oversized
uploads, type coercion, injection or double-submit. They are good tests; they are not the
client's stated requirements, and **a failure here is a robustness bug, not a compliance
breach.** Do not escalate one as the other.

| # | Assertion | Source |
|---|---|---|
| I1 | Submitting empty is rejected; every required field reports its own error. **✅ Verified 2026-08-12** — 4 visible errors (name, email, iam, commission-type), zero outbound requests, focus moves to the first invalid field. | `docs/TESTING.md` §2 (chaos cases) |
| I2 | Malformed emails are rejected (`a@`, `@b.com`, `a b@c.com`, 400-character local part). **⚠ PARTIAL FAIL — see finding below.** | `docs/TESTING.md` §2 |
| I3 | Oversized and zero-byte uploads are handled without an unhandled error. **Define "unhandled" before testing** — console error, unhandled rejection, crash, or silent no-op are four different assertions, and the silent no-op is the one that hurts. **✅ Verified 2026-08-12** — zero-byte uploads normally; a 55MB file is skipped by the form's own 10MB cap and the notification email carries `WARNING: one or more images the sender attached failed to upload.` No page errors, no crash, no silent no-op — the lead is never lost. One gap noted below. | `docs/TESTING.md` §2 (chaos cases) |
| I4 | Wrong types where a number is expected (size fields) are rejected, not coerced silently. **If the input is `type="number"` the browser blocks typing — force the value with `fill()`/`evaluate()` or the test is vacuous.** **✅ PASS on coercion, ❌ FAIL on range** — forcing `size-w = "abc"` via `evaluate()` reads back as `""`, so the browser's own sanitisation holds and no junk reaches the payload. But `-50` submits — see finding below. | `docs/TESTING.md` §2 |
| I5 | Script tags and SQL fragments in text fields are neither executed nor reflected unescaped. **✅ Verified 2026-08-12** — `<script>` and `<img onerror>` did not execute, nothing reflected raw, payload correctly JSON-encoded. SQL injection is not applicable: the backend takes a JSON body and writes to a Sheet, no SQL. | `docs/TESTING.md` §2 |
| I6 | Double-submit does not produce two submissions. **❌ FAILS — see finding below.** | `docs/TESTING.md` §2 |
| I7 | A valid submission reaches `/enquire/success`. ⚠ **Do not fill the hidden `website` honeypot** — doing so redirects to `/enquire/success` *without submitting*, producing a false pass. See `docs/TESTING.md` §3. | C:79–80, verified live 2026-08-11 |
| I8 | **Inverse honeypot test:** filling `website` produces **no** network request to the Apps Script endpoint, and still lands on `/enquire/success`. **✅ Verified** (re-run on the Apps Script backend 2026-08-20) — zero outbound requests, visitor still lands on `/enquire/success`. The anti-spam bounce works exactly as designed, which is also why a suite that fills every field reports a false pass on I7. | `docs/TESTING.md` §2 |

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
  rather than rendering — the exact failure verify-by-rendering exists to prevent.** Measured
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
  **Not changed — the design system is the client's call.** The minimal fix
  if they want it: give Reject the same `font-medium` and a solid or equally-weighted fill.

---

## ⚠ Open finding — double-click sends two notification emails (2026-08-12)

**Not fixed. The enquiry form is off-limits without the client's say-so.**

⚠ **Measured on the old Supabase + Web3Forms backend.** The form now makes one `fetch()` to
Apps Script, so the numbers below need a re-run before they are trusted.

Reproduced with the backend stubbed, at four different click timings:

| Interaction | Supabase rows | Web3Forms POSTs |
|---|---|---|
| Human double-click, 120 ms gap | 1 ✅ | **2 ❌** |
| Fast double-click, 40 ms gap | 1 ✅ | **2 ❌** |
| Native `dblclick()` | 1 ✅ | **2 ❌** |
| Same-tick triple click (artificial) | 1 ✅ | **2 ❌** |

**This is not a test artefact.** It reproduces at ordinary human double-click speed, which is
exactly what an impatient visitor does when a form appears not to respond.

**Impact is bounded but real:** the database is correctly guarded — one enquiry, one row, no
duplicate data. The *notification* is not, so the client receives **two emails for one
enquiry**. Annoying rather than dangerous, and it will look like two separate leads.

A guard does exist — `enquire.astro`'s submit handler sets `submitBtn.disabled = true` — but the second
click's handler is already queued before it runs, and the Web3Forms leg is a separately
constructed native form POST that the guard never reaches.

**Minimal fix, if the client wants it:** a module-scoped `let sending = false` checked at the
top of the submit handler, rather than relying on the button's disabled state. Does not
change the field set.

---

## ⚠ Open finding — no length cap on any form field (2026-08-12)

**Not fixed. The enquiry form is off-limits without the client's say-so.**

Reproduced in a browser with the backend stubbed:

| Input | Result |
|---|---|
| `a@` | ✅ rejected |
| `@b.com` | ✅ rejected |
| `a b@c.com` | ✅ rejected |
| **400-character local part** (`xxx…@y.com`) | ❌ **accepted — submitted and reached `/enquire/success`** |

**Root cause is broader than email.** `enquire.astro` validates with
`/^[^\s@]+@[^\s@]+\.[^\s@]+$/` — the common permissive pattern, with **no length bound** —
and **no field on the form carries a `maxlength` attribute at all.** The form is also
`novalidate`, so the HTML `required` attributes are inert and JS is the only gate.

So any text field accepts unbounded input, which goes straight into the enquiry Sheet.
RFC 5321 caps a local part at 64 characters and a whole address at 254.

**Minimal fix, if the client wants it:** a `maxlength` on the text inputs and a length check
in the email branch. Both are a few lines and neither changes the field set — which is the
part reserved to the client.

---

## ✅ Fixed 2026-09-14 — negative sizes are accepted (found 2026-08-12)

**Fixed on the client's go-ahead:** the submit handler now rejects a size of zero or below
with an inline error, and **I4b** runs un-skipped. The original finding follows.

Both size inputs declare `min="0"`, but the form is `novalidate`, so the attribute is inert
and nothing else checks the range. Forced through a browser with the backend stubbed:

| Forced value | Reads back as | Reaches the payload |
|---|---|---|
| `abc` in `size-w` | `""` — the browser's own sanitisation holds | no ✅ |
| `-50` in `size-h` | `-50` | **yes ❌** — `"size_h":"-50"` |

So type coercion is genuinely safe (that half of I4 passes and the credit belongs to the
browser, not to the form), but a negative dimension submits, lands in the enquiry Sheet
as a string, and appears in the notification email as a real measurement.

**Minimal fix, if the client wants it:** a range check alongside the existing email check.
Does not change the field set. The assertion is already written and sitting skipped in
`tests/enquiry-adversarial.test.mjs` as **I4b** — un-skip it once they decide.

---

## Noted, minor — two of five images are discarded without a word (2026-08-12)

Not a failure of I3, and not escalated to a finding: the page states the limit in the open
("Up to 3 images, 10MB each"), and the 10MB half of it is handled properly — an oversized
file is skipped **and** the notification email says so.

The count limit is not. Attaching five images uploads three and discards two, and neither
the visitor nor the client is told: the "some images failed" warning is only raised for
files that *fail*, not for files trimmed off the end before the loop runs. Verified
2026-08-12: 5 files in → 3 upload requests → zero warnings in the email.

Worth a sentence to the client, no more. The disclosed limit means nobody was misled.

---

## Known contradictions in the source documents

Not bugs in the build — places where the client's own documents disagree. Flagged rather
than resolved, because resolving them is the client's call.

1. **The brief contains six testimonials** (D:197–226) that `COMPLIANCE.md` forbids
   outright (C:10–14). They are correctly absent from the build.
2. **The brief's privacy policy says "handwoven"** (D:140) and its care guide recommends a
   cleaner specialising in "handwoven or antique rugs" (D:119). **Resolved 2026-08-26:**
   `docs/COMPLIANCE.md` now permits "hand-woven" only (C:26), matching the brief.
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
