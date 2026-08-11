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

These four must render **outside** any `<details>`, accordion or FAQ. This is the one place
where the client's accordion request (D:36) and `COMPLIANCE.md` actively conflict — compliance
wins, because burying them is a misleading-omission risk.

| # | Assertion | Source |
|---|---|---|
| C1 | Colour-variance position (dyed wool may differ from a screen render) is outside any `<details>`. | C:45 |
| C2 | Customs and duties are the recipient's responsibility — outside any `<details>`. | C:46 |
| C3 | Charged area on carpets = the full rectangle including trimmed waste — outside any `<details>`. | C:47 |
| C4 | Pattern trimming cuts into the design at bays and chimney breasts — outside any `<details>`. | C:48 |

**Test shape:** for each, assert the element exists AND `element.closest('details') === null`.

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
| E2 | Reject is as prominent as Accept — compare computed size, weight and contrast, not just presence. | C:65 |
| E3 | The choice persists across a reload. | C:65 |
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
| G2 | No image slot is empty. | S |
| G3 | No stock photograph of another company's finished rug is presented as an H&T commission. | C:23–25 |

## H. Craft and performance

| # | Assertion | Source |
|---|---|---|
| H1 | Fonts render as specified — no Arial/serif fallback. (Covered by `tests/smoke.test.mjs`.) | D:5–6, CLAUDE.md §5 |
| H2 | Page load under 3 seconds. | D:6 |
| H3 | Nav and footer are consistent across all 12 pages. | D:14, D:27 |
| H4 | Trade appears in the footer only — not in the nav, not on the homepage. `/trade` is indexed. | S |

## I. Enquiry form — adversarial

Backend calls are intercepted with `page.route()`; nothing reaches Supabase or Web3Forms.
See `AGENTS.md` §3.

| # | Assertion | Source |
|---|---|---|
| I1 | Submitting empty is rejected; every required field reports its own error. | C:79–80 |
| I2 | Malformed emails are rejected (`a@`, `@b.com`, `a b@c.com`, 400-character local part). | C:79–80 |
| I3 | Oversized and zero-byte uploads are handled without an unhandled error. | C:79–80 |
| I4 | Wrong types where a number is expected (size fields) are rejected, not coerced silently. | C:79–80 |
| I5 | Script tags and SQL fragments in text fields are neither executed nor reflected unescaped. | C:79–80 |
| I6 | Double-submit does not produce two submissions. | C:79–80 |
| I7 | A valid submission reaches `/enquire/success`. | CLAUDE.md, verified live 2026-08-11 |

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
   Consistent only at ~10m². The from-price must be genuinely achievable or it is drip
   pricing (C:36–38), so keep a real example you would actually make at £600/m².
5. **The brief's 48-hour damage and defect windows** (D:87, D:94) are removed by
   `COMPLIANCE.md` (C:54–57).
