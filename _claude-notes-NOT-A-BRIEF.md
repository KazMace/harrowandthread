> # ⚠️ THIS IS NOT THE CLIENT BRIEF. DO NOT BUILD FROM IT.
>
> This document was **written by Claude in an earlier session**, not by the client.
> Later sessions mistook it for the brief and built against it, which caused real
> instructions from the client to be dropped — most visibly the homepage accordions,
> which this document explicitly forbids in §10.1 while the client's own document
> explicitly requires them.
>
> **The brief is `harrowandthread_core_Design.md`.** That is the client's own
> writing and it is the only document with authority. See `CLAUDE.md`.
>
> Keep this file only as background reference for the UK-law constraints (DMCC 2024,
> CRA 2015, GDPR) and the business facts the client has since confirmed. Where this
> file and the client's document disagree, **the client's document wins, every time,
> without discussion.** Nothing in here may override, reinterpret or "supersede" it.
>
> Retitled and demoted 2026-08-11 at the client's instruction.

---

# Harrow & Thread — Website Build Spec *(superseded — Claude's notes, not a brief)*

Version 1.2 · Prompt-ready · ~~Supersedes the design/UX sections of `harrowandthread_core_Design.docx`~~ **(false — it supersedes nothing)**

**Changelog from v1.1:** Pricing rebuilt as a per-m² rate with three design tiers; the £6,000 minimum commission is removed. Wall hangings added as a third product. Wall-to-wall carpet measurement, waste and trimming rules defined. Shipping and customs position corrected. Samples and shade cards confirmed as not offered; clients are directed to the ARS colour system online. Two vendor figures outstanding — see Section 14.

This document defines **what to build and what "good" means**. Content bodies (FAQ answers, care guide, policies) live in a separate content library and are referenced here by slot, not reproduced.

---

## 1. Outcome

A site that converts a cold visitor into a qualified commission enquiry, and gives interior designers a reason to send it to their clients.

**Single job of the homepage:** get the right visitor to the enquiry form believing the work is worth £750 per square metre and up, and get the wrong visitor to leave quickly.

**Not the job of this site:** e-commerce, browsing a catalogue, running the rug generator. There is no checkout.

---

## 2. Hard constraints

Non-negotiable. A build that violates any of them is rejected regardless of quality elsewhere.

1. **No fabricated testimonials, reviews, ratings, client names, or client locations.** Under the Digital Markets, Competition and Consumers Act 2024 these are banned practices, strict liability, enforced directly by the CMA. If there is no real client quote, the section does not exist.
2. **No manufacturing location, supplier, workshop, or supply chain detail** appears in copy, alt text, image filenames, metadata, or structured data.
3. **AI-generated imagery is labelled as a design visualisation** wherever it appears, and is never presented as a photograph of a delivered client commission. See Section 8.
4. **The construction term is "hand-tufted".** Used everywhere. "Handwoven" and "woven" do not appear anywhere on the site as a product descriptor.
5. **No stock photography.** None. Not for texture, not for interiors, not for backgrounds.
6. **Every mandatory cost is disclosed before the enquiry, not after.** This covers shipping, customs and duties, charged area on carpets, and the design fee. See Section 6.
7. **The colour-variance statement appears before any commitment point.** See Section 5.
8. **The 1,400-colour system is not rebuilt on this site.** Clients are directed to `arscolors.com`. See Section 5.
9. **Performance budget in Section 10 is a build acceptance test**, not an aspiration.
10. **No cookies fire before consent** other than strictly necessary ones.

---

## 3. Products

Three products, one commission process. Rugs lead everywhere; the other two are variants, not competing propositions.

| Product | Where it lives | Minimum | Maximum |
|---|---|---|---|
| Rugs | `/commissions` | None | 15m × 10m |
| Wall hangings | `/commissions`, own section | 1.5m², shortest side 1m | Approx. 18m² (6m × 3m) |
| Wall-to-wall carpets | `/carpets` | See Section 7 | 15m × 10m |

Wall hangings are a section on `/commissions`, not a separate page. It is a variant of the same commission and a fourth nav item would cost more in dilution than it earns.

---

## 4. Sitemap

Five core pages at launch. Portfolio deferred deliberately: a "Work" page built entirely from AI renders reads as a portfolio of things that were never made, which is the exact trust failure this brand cannot afford.

### Launch (Phase 1)

| Page | Path | Job |
|---|---|---|
| Home | `/` | Blink test, credibility, price anchor, route to enquiry |
| Commissions | `/commissions` | Rugs and wall hangings: process, choices, pricing |
| Carpets | `/carpets` | Wall-to-wall: different buyer, different rules, different objections |
| Trade | `/trade` | Convert designers and architects |
| Enquire | `/enquire` | Qualified capture |

### Support pages (indexed, footer-linked only)

`/faq` · `/care` · `/terms` · `/privacy` · `/cookies`

### Phase 1.5 (trigger: first three commissions confirmed)

Client portal. Account creation, design sign-off, colour acknowledgement, progress updates. Sits behind the deposit, not in front of the enquiry. See Section 12.

### Phase 2 (trigger: six real commissions photographed)

`/work` — the portfolio. Replaces the homepage render grid. Ship nothing here until real photography exists.

**Navigation:** Commissions · Carpets · Trade · Enquire. `Enquire` is a button, visually distinct, present in the header on every page including mobile.

---

## 5. Colour

**No physical samples. No shade card.** Both are a deliberate commercial decision on cost. This is also the single largest conversion obstacle on the site and the most likely source of a dispute, so the site handles it head-on rather than hiding it.

**Requirements:**

1. A section on `/commissions` titled plainly — *"How colour works"* — not buried in the FAQ, not inside an accordion.
2. It states: colour is matched to the ARS 1400 dye system; the client selects a reference from that system; physical dyed wool may vary slightly from a screen render.
3. It explains in one honest sentence why samples are not offered, rather than leaving the client to assume corners are being cut.
4. It links out to `arscolors.com` so the client can browse references and note the codes they want.
5. The variance statement is repeated at sign-off and must be actively acknowledged before the deposit is taken. Not a footer line, not a pre-ticked box.

**Do not rebuild the 1,400-colour system on this site.** No searchable swatch library, no colour browser, no picker. That road has been travelled and it is long. The external system does that job.

**Colour rail — signature element.** A full-bleed static band of narrow colour columns sampled from the existing palette dataset. Decorative and atmospheric only.

- Homepage: static, between sections, one line of copy — *"1,400 dye colours. Yours is matched to one of them."* — and a quiet link to the ARS system.
- Sampled subset only, capped for page weight. The full dataset is never shipped to the client bundle.
- **Not interactive. Not searchable. Not a picker.** It does not imply a design tool or a colour library exists on this site.

---

## 6. Pricing model

This drives copy on three pages. Get it wrong and everything downstream is wrong.

### Rate card

Priced by area, by design tier. There is **no minimum commission value** — the rate does the work.

| Tier | Rate | What it is |
|---|---|---|
| **Plain** | £750/m² | A single colour across the whole piece |
| **Geometric** | £1,000/m² | A geometric pattern, either across the whole piece or as a border |
| **Pictorial** | £1,500/m² | A scene, painterly or photographic design |

**Worked examples** for the page:

| Size | Area | Plain | Geometric | Pictorial |
|---|---|---|---|---|
| 1.5 × 1m (hanging) | 1.5m² | £1,125 | £1,500 | £2,250 |
| 3 × 2m | 6m² | £4,500 | £6,000 | £9,000 |
| 4 × 3m | 12m² | £9,000 | £12,000 | £18,000 |
| 6 × 4m | 24m² | £18,000 | £24,000 | £36,000 |
| 15 × 10m | 150m² | £112,500 | £150,000 | £225,000 |

Same rates apply to rugs, wall hangings and wall-to-wall carpets.

**Homepage anchor copy:** *"Commissions from £750 per square metre. A 3m × 2m rug in a single colour is £4,500."* The rate filters and the worked example makes it concrete.

**Geometric caveat.** A border pattern and an all-over pattern do not cost the same to produce. The site quotes £1,000/m² as the geometric rate and states clearly that the exact figure is confirmed at quote once the design is specified. Do not present the geometric rate as final. See Outstanding Item O1.

### Design fee

£200 for a dedicated designer, **credited in full against the commission if the client proceeds.** Charged only if they take the design and walk away. This filters tyre-kickers without charging a serious buyer for the privilege of buying.

### Shipping

- **Included, fully insured:** UK, Europe, United States.
- **Everywhere else:** quoted at enquiry. Copy reads "contact us to confirm delivery to your country" — never "we ship worldwide" without qualification.

### Customs and duties

**Import duties, destination VAT and customs charges are the client's responsibility, not Harrow & Thread's.** This must be stated wherever shipping is mentioned — on `/commissions`, on `/carpets`, and in the FAQ.

This is not optional. A client in the US or EU receiving an unexpected customs bill on a £9,000 delivery is precisely the late-fee scenario the DMCC price transparency rules target, and "it usually doesn't happen" is not a defence when it does. State it plainly once and it costs nothing.

---

## 7. Wall-to-wall carpets: rules

Supply only. These rules exist because a mis-measured, non-returnable carpet worth five figures is the worst failure mode on the site.

**Measurement**
- The client supplies the **two longest measurements** of the room. This is the standard trade method and it correctly accounts for bay windows, chimney breasts and alcoves.
- Harrow & Thread adds approximately **10cm to each dimension** as a trimming allowance.
- **The client is responsible for the accuracy of their measurements.** Stated on the page and re-confirmed at sign-off.
- A professional measure is recommended and the page says so.

**Charged area**
- The client is charged for the **full rectangle**, including the area trimmed away around a bay or chimney breast.
- The quote shows the charged area in m² and states that trimming waste is included in it, **before the deposit**.
- This is material information affecting the purchase decision. It cannot appear for the first time on the invoice.

**Fitting**
- Supply only. The carpet arrives oversized and requires a fitter.
- The page states this plainly. A client opening a £15,000 roll expecting it to lay flat is a complaint you cannot answer afterwards.
- Copy may note that UK fitting can be arranged on request. It commits to nothing and retains the UK buyer who needs it.

**Design on carpets**
- All three tiers are available: plain, geometric, pictorial.
- **The design is centred to the ordered rectangle, and trimming at a bay or chimney breast will cut into the pattern.** Stated in plain words on the page.
- A client who orders a pictorial carpet and finds the fitter has cut through the design has a complaint that cannot be answered after the fact.

---

## 8. Wall hangings: rules

- **Minimum 1.5m², shortest side at least 1m.** Expressed as an area, not fixed dimensions — a 2m × 0.75m piece for a stairwell is a legitimate commission that a rigid "1.5m × 1m" rule would refuse for no reason.
- The page explains the minimum as a craft standard: frame, design mapping, dye setup and finishing cost the same regardless of size, so below 1.5m² the piece cannot be made properly at a fair price.
- **Maximum approximately 18m² (6m × 3m)**, for weight. Larger pieces become impractical to hang safely.
- **No pole, rail, fixings or hardware are supplied.** Clients choose their own mounting to suit the piece and the wall. Stated on the page, not discovered on delivery.
- **The client is responsible for hanging the piece and for the suitability of their fixings and wall.** A large hand-tufted piece is heavy. Weight per m² at each pile height is confirmed at quote — see Outstanding Item O2.
- Care guide gains a wall-hanging section: rotation, dust, direct sunlight, and not hanging in bathrooms or over heat sources.

---

## 9. Imagery rules

1. Every AI-generated image carries a persistent visible caption in the utility style: **"Design visualisation"**. Not a tooltip. Not a hover state. Visible.
2. No AI image is captioned, titled, alt-texted, or arranged to imply it is a photograph of a delivered piece or a real client's home.
3. Every render must depict something actually producible: hand-tufted construction, a real pile height, colours that exist in the ARS 1400 system.
4. Formats: AVIF with WebP fallback. Responsive `srcset` at 640 / 1024 / 1600 / 2400. Explicit `width` and `height` on every image.
5. Alt text describes the design, not the brand. No keyword stuffing.
6. Phase 2 replaces renders with photography one for one. When a real photograph replaces a render, the caption is removed, not reworded.

---

## 10. Page specs

### 10.1 Home

Sections in order. Each has one job. If a section cannot state its job in one sentence, cut it.

**1. Hero**
- Full-viewport. One image, one line, one button.
- Headline is a claim about the visitor's outcome, not about the company. Working line: *"A rug that exists once."* Alternative to test: *"Your design. Your dimensions. Made once, for you."*
- Sub-line: one sentence, maximum 15 words, states bespoke, hand-tufted, made to your dimensions.
- Single CTA: `Start a commission` → `/enquire`.
- No scroll indicator, no carousel, no video.
- **Acceptance:** a first-time visitor can state what is sold and what to do next after 3 seconds of exposure.

**2. Price anchor** (immediately below hero, before anything else)
- *"Commissions from £750 per square metre, shipping included to the UK, Europe and the US. A 3m × 2m rug in a single colour is £4,500."*
- High on the page on purpose. It filters.

**3. The proposition** — three points, no icons
- Exclusive to you: one-of-one, never remade
- Any design, any dimension, up to 15m × 10m
- Hand-tufted and dyed to match, from 1,400 colours

**4. Colour rail** — the signature element. See Section 5.

**5. Process** — three steps, numbered (order genuinely carries meaning here)
- 01 Design → 02 Sign-off and 50% deposit → 03 Made and shipped, approx. 4 weeks
- One sentence each. Link to `/commissions`.

**6. Renders grid** — 4 to 6 images, labelled per Section 9. Becomes the `/work` teaser in Phase 2.

**7. Carpets strip** — one line, one image, link to `/carpets`. Secondary to rugs. The homepage stays rug-led.

**8. Trade strip** — one line and a link to `/trade`. Small, quiet, easy to find.

**9. Enquiry CTA** — repeat of the hero action with the response-time promise.

**10. Footer** — nav, company details per Section 11, three FAQ links. **No FAQ accordions on the homepage.** Full FAQ lives at `/faq`, indexed, where search can reach it.

### 10.2 Commissions (rugs and wall hangings)

- Opening statement: what a commission is, in three sentences.
- **What you choose:** materials (wool, silk blend, bamboo silk, flatweave), pile height (6mm / 12mm / 20mm) with a plain-English "choose this if" line each, size, design tier, colour.
- **Design tiers:** plain, geometric, pictorial, each with a one-line "choose this if" and the rate. The client must be able to self-identify their tier before enquiring or the rate card does nothing.
- **How colour works** — Section 5. Prominent, not collapsed, with the ARS link.
- **Pricing:** the rate card, two or three worked examples, the geometric caveat, the design fee and its credit-back rule, shipping inclusions, and the customs position.
- **Sizing:** no minimum for rugs, maximum 15m × 10m.
- **Wall hangings** — own section per Section 8: minimum, maximum, no hardware, client responsible for hanging.
- **Timeline:** approximately 4 weeks from sign-off, with the named factors that extend it.
- **Terms in brief:** 50% deposit, balance before dispatch, bespoke goods cancellation position, insured shipping. Links to `/terms`.
- Closing CTA.

### 10.3 Carpets

Separate page because wall-to-wall is a different purchase: priced by area but specified around a room, measured by the client, trimmed on site, and carrying rules no rug buyer needs to read.

- What is offered: bespoke wall-to-wall, hand-tufted, all three design tiers, dyed to the same 1,400-colour system.
- **Supply only**, with the optional UK fitting line.
- **Measurement, charged area, fitting and pattern trimming** — all four rules from Section 7, stated plainly and not collapsed.
- Pricing: same rate card, with a worked example showing charged area including trimming allowance.
- Colour section per Section 5.
- Route into the same enquiry form with `Wall-to-wall carpet` preselected.

### 10.4 Trade

Separate page because it is a different buyer, a different sales cycle, and the highest-value channel at this price point. It also gives designers a single URL to bookmark.

- Who it is for: interior designers, architects, developers, hospitality.
- What is offered: trade terms, specification assistance, lead times, exclusivity guarantee, IP position.
- Deliverables designers need: a downloadable spec or tear sheet, scaled drawing support if offered, material data, the ARS colour reference.
- Trade enquiry route: same form with `Trade` preselected.

### 10.5 Enquire

Form only. No sidebar, no distractions, no navigation clutter. **No account creation.** See Section 12.

| Field | Type | Required |
|---|---|---|
| Name | text | yes |
| Email | email | yes |
| Phone | tel | no |
| I am | select: Private client / Interior designer or architect / Developer or hospitality / Other | yes |
| What are you commissioning | select: Rug / Wall hanging / Wall-to-wall carpet / Not sure | yes |
| Where is it going | text, one line | yes |
| Size | two numbers (m) + "Not sure yet" checkbox. If carpet is selected, label changes to "The two longest measurements of the room" with a link to the measuring guidance | yes |
| Design tier | select: Plain / Geometric / Pictorial / Not sure | yes |
| Budget | select: Under £5k / £5k–10k / £10k–25k / £25k–50k / £50k+ / Not sure | yes |
| Timeline | select: Within 3 months / 3–6 months / Exploring | yes |
| Design starting point | select: My own artwork or sketch / A reference image / I'd like your designer / Not sure | yes |
| Reference images | file, images only, up to 3 files, 10MB each | no |
| Anything else | textarea | no |
| Marketing consent | checkbox, unticked, separate from submit | no |

**Rules**
- Uploaded images arrive attached to or linked from the enquiry email. This is the requirement; it is met without an account.
- Consent to marketing is never bundled into the submit action.
- Spam control is a honeypot plus server-side rate limiting. No visible captcha.
- Uploads restricted to image MIME types with server-side verification. Never trust the client-side accept attribute.
- On submit: inline success state on the same page, not a redirect. Message states what happens next and by when.
- **Response promise displayed above the form and honoured:** one working day.
- Errors are specific and inline, never a summary box at the top.

---

## 11. Design system

Editorial, modern luxury. High contrast, generous space, type doing the heavy lifting.

### Colour

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#17181C` | Text, dark sections |
| `--paper` | `#FBFAF8` | Default ground |
| `--wool` | `#DCD6C9` | Large quiet fields, section breaks |
| `--madder` | `#8A2E2A` | Single accent. Links, focus rings, one hero detail. Nothing else. |
| `--graphite` | `#6B6C70` | Captions, meta, form hints |

Five values. No gradients. No shadows except a single 1px hairline (`--ink` at 8%) for separation.

### Type

- **Display:** a high-contrast editorial serif, used only at 40px+ and only for section-opening statements. Licensed first choice: Editorial New or Canela. Self-hostable fallback: Instrument Serif.
- **Body and UI:** a neutral grotesque. Licensed first choice: Suisse Int'l or Söhne. Self-hostable fallback: Inter Tight.
- **Utility:** same grotesque, uppercase, 11px, 0.14em tracking, `--graphite`. Eyebrows, image labels, form labels.

Scale: 11 / 14 / 16 / 20 / 28 / 40 / 64 / 96. Body 16px minimum, line-height 1.6. Measure capped at 68 characters.

Two families maximum, self-hosted as WOFF2 subsets, `font-display: swap`, preloaded. No Google Fonts CDN.

### Layout

12-column, 1440px max content width, 120px gutters at desktop and 20px at mobile. Vertical rhythm on an 8px base. Section padding 120px desktop / 64px mobile. Breakpoints: 480 / 768 / 1024 / 1440.

### Motion

- Hover: 150ms ease-out, opacity and underline only.
- Scroll reveal: one type only, a 300ms fade with 12px rise, applied to section headers and nothing else.
- Zero parallax, zero autoplay, zero looping ambient animation.
- `prefers-reduced-motion: reduce` disables all of it.

---

## 12. Technical direction

**Recommended stack: Astro + Tailwind, statically generated.**

⚠️ **A departure from your existing React/Vite setup.** Flagging it before you commit. This is a five-page marketing site whose primary acceptance criterion is a hard performance budget. Astro ships zero JS by default and islands only the form; React/Vite ships a runtime on every page for interactivity you need in one place. If you would rather keep one stack across all properties, React/Vite with Vite SSG will hit the budget, but it costs more effort to get under 100KB.

**Forms and uploads.** Your existing Web3Forms integration is proven but does not handle file attachments on the free tier. Options, cheapest first:

1. Form endpoint with native attachment support (Formspark + Uploadcare, Basin, or Netlify Forms with file uploads). Keeps the site static. **Recommended.**
2. Supabase Storage for the upload plus a serverless function to email the link. More control, more build, and you already know Supabase.

**On account creation.** Your requirement was that the image arrives with the enquiry. Option 1 delivers that without auth, without a user database, and without leaving static hosting. An account at the enquiry stage puts a signup wall in front of your only conversion event.

The account still gets built — in Phase 1.5, behind the deposit, where it earns its keep: design sign-off, the colour acknowledgement required by Section 5, the measurement confirmation required by Section 7, progress updates, and the balance payment. A portal for confirmed clients, not a gate for strangers.

**Other**
- Host: static. Cloudflare Pages or Netlify.
- Analytics: privacy-first, cookieless (Plausible or Fathom).
- Structured data: `Organization` and `LocalBusiness`, plus `FAQPage` on `/faq`. No `Product` markup, no `AggregateRating`.
- Fonts, images and palette data self-hosted. No third-party CDN in the critical path.

---

## 13. Performance budget

Measured on a throttled 4G mobile profile, cold cache, on the deployed URL. All pass/fail.

| Metric | Target |
|---|---|
| LCP | ≤ 2.0s |
| CLS | < 0.05 |
| INP | < 200ms |
| JS shipped (gzipped) | ≤ 100KB |
| Hero image | ≤ 200KB |
| Total homepage weight | ≤ 1.2MB |
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |

Accessibility floor: WCAG 2.2 AA contrast, visible keyboard focus on every interactive element, logical heading order, form labels bound to inputs, skip link.

---

## 14. Compliance requirements

Build-level obligations, not legal advice. Have a solicitor review the policy bodies before launch.

- **Footer must carry:** registered company name, company registration number, registered office address, contact email. Required for a limited company.
- **Reviews:** none published unless genuine and attributable. If incentivised in any way, the incentive is disclosed on the review itself.
- **Price transparency:** every unavoidable cost is disclosed before enquiry — the rate, the design fee, shipping inclusions and exclusions, customs responsibility, and charged area on carpets.
- **Material information.** With no samples offered, four things are material to the purchase decision and must appear prominently rather than in an FAQ: the colour-variance position, customs responsibility, charged area on carpets, and pattern trimming on carpets. Omitting or burying any of them is a misleading omission risk.
- **Consumer rights:** the returns and defect position must not purport to cut short the Consumer Rights Act 2015 short-term right to reject or the six-month period for latent faults. The 48-hour defect window in the source document is very likely unenforceable against consumers and needs redrafting.
- **Cookie banner:** reject as prominent as accept, non-essential cookies blocked until consent, choice persists, `/cookies` page exists and is written.
- **Privacy policy:** remove all rug generator references. Fix the two sentences truncated mid-clause. Add a data controller contact address. Add a retention period and deletion route for enquiry uploads.
- **B2C terms need an IP and design-rights clause.** The source has one for B2B only.
- **Terms need clauses for** client measurement responsibility, charged area, trimming, and client responsibility for hanging and fixings.

---

## 15. Acceptance criteria

The build is done when every line is true.

- [ ] Five-second test: three people who have never seen the site can state what is sold and roughly what it costs.
- [ ] Every performance and accessibility number in Section 13 passes on the deployed URL.
- [ ] Zero fabricated testimonials, ratings, or client names anywhere in the codebase.
- [ ] Every AI image carries a visible "Design visualisation" caption.
- [ ] Grep confirms zero instances of "handwoven" or "woven" as a product descriptor.
- [ ] Zero supply chain or manufacturing location references in copy, alt text, filenames, or metadata.
- [ ] Zero references to the rug generator, including in the privacy policy.
- [ ] Price appears above the fold on `/` on mobile without scrolling past the hero, states the per-m² rate, gives one worked example, and states shipping inclusions.
- [ ] Customs responsibility appears on `/commissions`, `/carpets` and `/faq`.
- [ ] Colour-variance statement appears on `/commissions` and `/carpets` outside any collapsed element, with the ARS link.
- [ ] No searchable colour library, picker, or swatch browser exists on the site.
- [ ] Carpet page states measurement responsibility, charged area, fitting requirement and pattern trimming, none of them collapsed.
- [ ] Wall hanging section states the 1.5m² minimum, the size cap, no hardware supplied, and client responsibility for hanging.
- [ ] Enquiry form submits, validates inline, accepts image uploads, changes the size label for carpets, shows an inline success state, and delivers to the inbox with the images.
- [ ] Marketing consent is a separate unticked checkbox.
- [ ] Response-time promise is displayed and operationally deliverable.
- [ ] Footer carries company number and registered address.
- [ ] No non-essential cookie fires before consent.
- [ ] Full keyboard traversal of every page with visible focus.
- [ ] `prefers-reduced-motion` removes all motion.
- [ ] All copy is UK English. No US spellings.

---

## 16. Outstanding items

Neither blocks the build. Both block a line of copy being accurate, so get them from the vendor before launch.

| # | Item | Where it lands |
|---|---|---|
| **O1** | Cost differential between a geometric border and an all-over geometric pattern. | The geometric rate on `/commissions` and `/carpets` is presented as indicative and confirmed at quote until this is known. Once known, either split the tier or keep one rate. |
| **O2** | Finished weight per m² at 6mm, 12mm and 20mm pile. | The wall hanging section states weight is confirmed at quote. With the figure, the page can state it directly, which is a better answer for a client working out whether their wall will take it. |

---

## 17. What this spec replaces

The design principles, FAQ, care guide, and policy text in `harrowandthread_core_Design.md` are not deleted. They move to a separate **content library** document and are pulled into the slots defined above. The testimonials section of that source is retired entirely and does not carry over. The FAQ answers on production time, sizes, materials, shipping and returns all need editing against the decisions in Sections 6, 7 and 8 before they are reused.
