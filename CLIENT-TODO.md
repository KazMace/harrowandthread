# Harrow & Thread — your list

Everything left that needs you rather than code. Ordered by what blocks launch.
Tidied 2026-09-14: finished items removed (git history keeps the old version).

---

## 1 · Before launch

**Say go on the deploy.** The build is ready and the FTP connection is checked. Nothing is
uploaded yet. The script is `scripts/deploy-ftp.sh` (`--check` lists the server and stops).

**Solicitor review.** Pay a solicitor to read `/terms` and `/privacy` before launch. You take
£4,500+ non-refundable deposits on goods that cannot be returned. An hour of their time.

**Accountant: VAT, and sole trader vs limited company.**

- VAT is not connected to company structure. A sole trader registers at the same £90k
  threshold as a limited company.
- Limited company accounts are annual. The quarterly filing is VAT returns, which apply to a
  VAT-registered sole trader too.
- You will likely cross £90k within the first few commissions. Registering moves every
  proposal price by 20% or takes it out of margin. Settle it before launch.
- "Ltd" cannot appear on the site until Companies House registration exists (Companies Act
  2006 s.65).

---

## 1b · Launch day — Google Search Console

A new domain with no inbound links is not crawled on its own. Do this the same day:

- [ ] Go to https://search.google.com/search-console and add the property `harrowandthread.com`
- [ ] Pick the "HTML file" method, download the `google….html` file
- [ ] Drop it in `public/` and deploy — it must answer 200 at `https://harrowandthread.com/google….html`
- [ ] Click Verify
- [ ] Sitemaps → submit `sitemap-index.xml`
- [ ] URL inspection → `https://harrowandthread.com/` → Request indexing
- [ ] Leave the Google file in `public/` forever; deleting it un-verifies the site
- [ ] Bing: https://www.bing.com/webmasters → **Import from Google Search Console**
- [ ] Bing → URL Submission → `https://harrowandthread.com/`

---

## 2 · When you can

**Trading address.** When the virtual office exists, put it in `src/data/site.json` as
`company.address`. It then appears in Privacy by itself. Since ECCTA 2023 a registered office
must be able to receive post: PO boxes do not qualify, virtual office providers do.

**Booking calendar.** Plan is in `docs/BOOKING-PLAN.md`.

- [ ] Create `cal.com/harrowandthread` on your Google account
- [ ] Connect Google Calendar, set working hours and minimum booking notice
- [ ] Upload logo, set brand colour
- [ ] Create "Design consultation" (30 min) and "Home visit and measure" (90 min)
- [ ] Send the two Cal.com URLs back so `/book` can be finished

**Old Supabase project.** Nothing uses it. It still holds an insecure leftover table
(`public.images`). Simplest: delete the whole project. Or run
`drop table if exists public.images;` in its SQL editor.

---

## 3 · Decisions

**Wall hangings: loops or rod pocket?** The mill says rod pocket. The site shows loops.

**Enquiry form fields.** Four are required: name, email, what they're commissioning, who they
are. Should size and design tier also be required? Should timeline and design starting point
be cut?

**Plate sizes.** Four plates were recaptioned by measuring against the furniture: library
**8×6m**, bedroom **6×4m**, wall hangings **4×3m** and **3.5×2.5m**. Worth your eye.

**Customs wording.** The UK–India deal (in effect 15 July 2026) removes UK import duty on
Indian-made textiles and carpets, not VAT, and not other countries' duties. That narrower
version is on `/terms`, `/carpets`, `/commissions` and the FAQ. Check it matches how your
shipping actually works.

**Drive photo links** open without a login (long random address, not guessable). Say if you
want them to need a sign-in; it costs an extra click each time.

---

## Next — site work, my side

1. **AI images regenerated slot by slot** — the OpenRouter key works again (checked 2026-09-14).
   The corridor wall hanging loops were fixed on 2026-09-14.
   Slot list: `docs/PHOTO-SLOTS.md`, plus the `/designs` and `/wall-hangings` slots.
2. **Analytics** — after launch. Adding it brings back a cookie banner and a cookie section
   in Privacy (`docs/COMPLIANCE.md`).

**Done 2026-09-14:** `/cookies` and the cookie banner removed (the site sets no cookies; Privacy
says so). Negative or zero sizes on the enquiry form now show an error and send nothing.
`/enquire?type=…&iam=…` links now preselect the form.

**Settled, not coming back:** no phone number, no trade discounts, no fire-rating
certification, no public prices, contact by form and email only, legal pages stay as links.
