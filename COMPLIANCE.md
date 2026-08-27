# Compliance — the rules that carry legal risk

Extracted from the demoted `_claude-notes-NOT-A-BRIEF.md` before it was deleted, so the
genuinely load-bearing constraints survive. Everything here is grounded in UK law or in a
fact the client has confirmed. Build-level obligations, not legal advice — a solicitor
still needs to review the policy pages before launch.

## Never, under any circumstances

- **No fabricated testimonials, reviews, ratings, client names or locations.** Banned
  practices under the Digital Markets, Competition and Consumers Act 2024 — strict
  liability, enforced directly by the CMA. "It was only a placeholder" is not a defence
  once it is live. No `aggregateRating` or `Review` in structured data. If a reviews
  section is wanted before real ones exist, build it and leave it unrendered.
- **No manufacturing location, supplier, workshop or supply-chain detail** — in copy, alt
  text, image filenames, metadata or structured data. This is why the luxury-rug guide's
  "provenance: where it was made" advice cannot be followed.
- **No "Ltd"** until Companies House registration actually exists. Using it while
  unincorporated is a criminal offence under the Companies Act 2006 s.65.
- **No VAT claims.** Not registered, so never state "VAT included", show VAT, or imply it
  is collected. The only permitted mention is destination VAT on exports, which is
  accurate and unrelated.
- **No stock photograph of another company's finished rug** presented as an H&T
  commission — same DMCC exposure as a fake testimonial. Atmospheric stock (interiors,
  texture, materials) is permitted.
- **"Hand-woven" only.** (Reversed 2026-08-26 on client instruction — the rule used to be
  the exact opposite.) Never "hand-tufted" or "tufted" as a product descriptor. Also never
  claim knot density or invite inspection of the reverse — those belong to hand-knotted
  rugs and H&T does not make them.

## Price transparency

Every unavoidable cost must be disclosed before the enquiry, not after: the per-m² rate,
the £200 design fee and its credit-back rule, shipping inclusions and exclusions, customs
responsibility, and charged area on carpets.

Rates are **"from"** prices. A headline price that is rarely obtainable is drip pricing
under the DMCC — the from-price must be genuinely achievable, so keep a real example you
would actually make at £600/m².

## Material information — must be prominent, never collapsed

With no physical samples offered, four things materially affect the purchase decision and
must appear in the open rather than inside an accordion or the FAQ:

1. The colour-variance position (dyed wool may differ slightly from a screen render).
2. Customs and duties are the recipient's responsibility.
3. Charged area on carpets — the full rectangle, including trimmed waste.
4. Pattern trimming on carpets cuts into the design at bays and chimney breasts.

Omitting or burying any of them is a misleading-omission risk.

## Consumer rights

The returns and defect position must not purport to cut short the Consumer Rights Act 2015
short-term right to reject, or the six-month period for latent faults. The 48-hour defect
window in the original source document is very likely unenforceable against consumers and
has been removed.

B2C terms need an IP and design-rights clause. Terms need clauses covering client
measurement responsibility, charged area, trimming, and client responsibility for hanging
wall pieces and the suitability of their fixings.

## Cookies and privacy

No non-essential cookie fires before consent. Reject must be as prominent as accept, the
choice must persist, and `/cookies` must exist. Privacy policy needs a data controller
contact address, a retention period, and a deletion route for enquiry uploads.

## Accessibility floor

WCAG 2.2 AA contrast, visible keyboard focus on every interactive element, logical heading
order, form labels bound to inputs, skip link. Never `focus:outline-none`.

## Still outstanding before launch

- Company registration number and registered office (currently `[Trading address]`).
- "Last updated" dates on `/terms`, `/privacy`, `/cookies`.
- Solicitor review of the policy pages.
- Form endpoint configured **and a real test submission sent** — this failure mode is
  invisible from the front end.
- Fire-rating / contract certification (BS 4790, EN 13501). Without it no hotel or
  developer can specify the product at all.
- Finished weight per m² at 6mm, 12mm and 20mm pile — needed for the wall-hanging section,
  which currently says weight is confirmed at quote.
