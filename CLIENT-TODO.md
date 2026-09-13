# Harrow & Thread — your list

Everything left that needs you rather than code. Ordered by what blocks launch.

---

## 1 · Blocks launch — legally or functionally

**OpenRouter key is dead (2026-09-13).** The key in `.env` gets "User not found" from OpenRouter, so no images can be generated until you put a working key in `.env` as `OPENROUTER_API_KEY`. Everything else in the image plan is ready: the generator script, the prompts, and the AI-metadata tag Google asks for (already inside every existing image file). Not a launch blocker on its own — the current images stay until then.

**Finish setting up the enquiry pipeline — 10 minutes, in your Google account.**
2026-08-20: Supabase and Web3Forms are gone. Both had the same shape of problem —
free-tier limits that would start costing money exactly as enquiries grew, and Supabase's
free plan kept falling asleep from disuse, which is what broke a live enquiry this
session. Replaced with one thing: a Google Apps Script that saves photos to Drive, logs
the enquiry to a Sheet, and emails you — using your existing free Gmail, nothing paid.

**The code side is done and tested.** What's left is entirely on your side, in your Google
account, not mine to do for you — I don't have login access to it. Full steps are in
`google-apps-script/README.md`, roughly: make a Sheet, make a Drive folder, paste
`google-apps-script/Code.gs` into script.google.com, deploy it, paste the resulting web
address into the site's `.env` file as `PUBLIC_GAS_URL`. Until that's done the form falls
back to not sending anywhere — same silent-failure shape as the old bug, so please don't
leave this one sitting for weeks.

**The photo link in the email now actually opens.** The old system's link showed as
plain, dead text in some email apps (a permanent Web3Forms limitation, not something more
money would have fixed). This one is a real clickable link, and the photo also shows
inline in the email itself.

**Trade-off you're accepting, same as before:** the Drive photo link opens straight away,
no login — a long random address, not something a stranger could guess or browse to, but
not access-controlled either. If you'd rather it required signing in, say so and I'll
switch it — costs you an extra click every time you open one.

---

**Contact address — settled 2026-08-21.** `enquiries@harrowandthread.com` is gone from the
whole site — it was never confirmed live. Every remaining direct-contact spot (`/cookies`,
`/privacy`'s data-deletion contact, the `/enquire` form's own failure message, and the
structured data search engines and AI tools read) now points at `meadow.mace@harrowandthread.com`,
confirmed as a real inbox. The footer link and the old redundant line on `/enquire` were dropped
entirely in favour of a plain link to the form — no email needed there at all.

**→ Old Supabase project — yours to close out or keep, your call.** Nothing in the codebase uses it any more. It still holds a leftover, insecure table (`public.images`, security switched off, from a different build on the same project) that I flagged and you already approved removing, but my tooling refuses to run destructive database commands. Since nothing here depends on that project any more, the simplest close-out is deleting the whole Supabase project rather than fixing one table in it — up to you. If you'd rather just drop the table: `drop table if exists public.images;` in their SQL editor.

---

**Trading address.** Down the road, when the virtual office exists: put it in `src/data/site.json` as `company.address` and it appears in the footer and Privacy by itself. Until then those lines render nothing.

**"Last updated" dates** on `/terms`, `/privacy` and `/cookies`: set to 13 September 2026 at launch.

**Solicitor review** — pay a solicitor to read `/terms`, `/privacy` and `/cookies` before launch. That's all it means. I've kept them compliant at build level, but I'm not qualified to give legal advice and you're taking £4,500+ non-refundable deposits on goods that cannot be returned. An hour of someone's time.

**Decide sole trader vs limited company, and plan for VAT.** Two separate decisions, often conflated:

- **VAT is not connected to company structure.** A sole trader registers for VAT at the same £90k threshold as a limited company. Going Ltd does not trigger it; staying sole trader does not avoid it.
- **Limited company accounts are annual, not quarterly.** Companies House wants accounts and a confirmation statement once a year, corporation tax likewise. The quarterly filing is **VAT returns** — which apply to a VAT-registered sole trader too. So the admin gap between the two options is smaller than it looks.
- At £600–£1,200/m² you will cross £90k on your third or fourth commission, and registering moves every published price by 20% or takes it out of margin. Settle it with an accountant **before** launch.
- **"Ltd" cannot appear anywhere on the site** until Companies House registration actually exists — criminal offence under the Companies Act 2006 s.65.

---

## 1a · Booking calendar (added 2026-08-23)

Plan is in `docs/BOOKING-PLAN.md`. Your part, in the browser, no code:

- [ ] Create `cal.com/harrowandthread` on your existing Google account
- [ ] Connect Google Calendar, set working hours and minimum booking notice
- [ ] Upload logo, set brand colour
- [ ] Create two booking types: "Design consultation" (30 min) and "Home visit and measure" (90 min)
- [ ] Send the two Cal.com URLs back so `/book` can be finished

---

## 1b · Straight after deploy — Google Search Console (added 2026-09-06)

Harrowtech sat live for 11 days and Google never came: a new domain with no inbound
links is never crawled on its own. Do this the same day the site goes live, it takes
ten minutes:

- [ ] Go to https://search.google.com/search-console and add the property `harrowandthread.com`
- [ ] Pick the "HTML file" method, download the `google….html` file
- [ ] Drop it in `public/` (the deploy root) and deploy — it must answer 200 at `https://harrowandthread.com/google….html`
- [ ] Click Verify
- [ ] Sitemaps → submit `sitemap-index.xml` (Astro generates it, already named in `public/robots.txt`)
- [ ] URL inspection → `https://harrowandthread.com/` → Request indexing
- [ ] Leave the Google file in `public/` forever; deleting it un-verifies the site
- [ ] Bing too: go to https://www.bing.com/webmasters, sign in, pick **Import from Google Search Console** — that verifies the site and brings the sitemap across in one step
- [ ] Bing → URL Submission → `https://harrowandthread.com/`

---

## Next — site work (updated 2026-09-13, afternoon)

Done today, shown to you as it went: prices and the design-fee amount removed everywhere (written
proposal carries the investment); `/trade` discount line gone and design-rights line now matches
`/terms`; `/privacy` company-number line gone; three new pages (`/process`, `/wall-hangings`,
`/work`); "How it works" strip on the home page; Trade tile off the home page; AI-image label made
small and quiet; hero caption made legible on a phone; the AI-generated tag Google asks for written
into every image file.

Still to do, my side:

1. **Legal pages cut to the bare minimum.** Terms + Privacy only; `/cookies` folded into Privacy and the cookie banner removed (no analytics means nothing to consent to).
2. **AI images regenerated slot by slot** — blocked on a working OpenRouter key (see section 1). Slot list: `docs/PHOTO-SLOTS.md`, plus the new `/work` and `/wall-hangings` slots.
3. **Analytics** — after launch, not needed to go live.

**Settled, not coming back:** no phone number, no trade discounts, no fire-rating certification.

---

## 4 · Three decisions I've been holding

**~~The "Assurances" section~~ — resolved 2026-08-26.** It's no longer a standalone section: folded into the new closer block ("A commission is a significant commitment...") alongside the old Proposition/Process sections, as part of the homepage rebuild. Every guarantee it made still appears, either there or on `/commissions` and `/terms`.

**Enquiry form fields.** Budget is now removed as you asked. Four remain required: name, email, what they're commissioning, and who they are. Still open: should size and design tier also be required, and should timeline and design starting point be cut too?

**~~Privacy and Terms in the homepage accordions~~ — settled 2026-09-13:** they stay as links.

---

## 4a · Hand-woven rename (2026-08-26) — ~~real work still needed~~ finished 2026-08-27

**2026-08-27: the four leftover spots below are now rewritten** in neutral wording (no
invented weaving claims), so no "tufted" remains anywhere on the site. `docs/COMPLIANCE.md` and
QA rule A3 were reversed to match, on your instruction. The paragraphs below are history.

**What changed:** every general product description on the site now says "hand-woven"
instead of "hand-tufted" — titles, meta descriptions, the homepage, the schema.org data AI
tools read, alt text. Hand-tufted still exists as a real, offered construction option; this
was a rename of the headline description, not a removal. No pricing changed.

**What I deliberately left alone, and why:** four spots describe the actual physical
*process* of tufting, not just the product label, and I don't have the equivalent facts for
hand-woven construction to safely rewrite them:
- `/faq` — "Pile is tufted yarn standing upright" (what pile physically is)
- `/faq` — "a hand-tufted pile holds a crease permanently" (a packing/rolling claim)
- `/faq` — "we source materials, set up dyes, and begin tufting" (the production-process answer)
- `/care` — "Use a cleaner who specialises in hand-tufted or antique rugs" (cleaning expertise)

These are all still accurate for the hand-tufted option, so nothing on the site is wrong
right now. But once you have real hand-woven construction details, these four spots need a
proper rewrite (or a second answer covering weaving specifically) so the FAQ doesn't lead
with tufting while the rest of the site leads with weaving. Flag this back to me when the
pricing and construction detail is ready and I'll do that pass alongside it.

**Customs copy updated too.** You mentioned a UK-India trade deal removing customs on these
pieces. I verified it: real, in effect from **15 July 2026**, and it removes UK import duty
on Indian-made textiles and carpets. It does **not** remove VAT, and it does **not** affect
customers outside the UK (EU/US still pay their own country's import duty as before) — so I
wrote the accurate, narrower version into `/terms`, `/carpets`, `/commissions` and the FAQ,
not a blanket "no customs" claim. Worth you double-checking this matches how your actual
shipping works (does the UK deal apply the way I've assumed, given the mill relationship?).

---

## 5 · Confirm when you have a moment

**Plate sizes.** I recaptioned four plates after your scale audit, reading each size off the picture by measuring against the furniture: library 4×3m → **8×6m**, bedroom 5×4 → **6×4m**, wall hangings 3×2 → **4×3m** and 2.5×1.8 → **3.5×2.5m**. Those are my estimates from the imagery — worth your eye before launch.

**Registered office address.** Once you have the virtual address, it drops straight into the footer. Note that since ECCTA 2023 the registered office must be an "appropriate address" able to receive and acknowledge post — PO boxes don't qualify, virtual office providers do.

---

## 6 · Nice to have

- Analytics and the `/cookies` wording are now in **Next** above.

---

## Where the build stands

Direction A rolled across all 12 pages. Every image slot filled. Accordions built. Every rug and wall hanging plate is shown whole, never cropped — verified structurally by an automated test. Zero horizontal overflow across 12 pages × 11 widths. One `h1` per page, no heading skips. Fonts confirmed rendering. Form validated both paths. 4.3 KB of JavaScript. Compliance greps clean.

**2026-08-26 — homepage rebuilt in an LV-influenced, photo-led style.** Full-bleed hero
with type overlaid, category tiles, larger catalogue plates, a merged closer section, and
an overlay-menu header. See `docs/PHOTO-SLOTS.md` for what each image needs to land
in which slot. **One thing to check when real photos replace the placeholders:** the hero
now uses `object-fit: cover` (the one approved exception to "never crop" — a room-context
shot, not a rug plate). I tested it against the current placeholder photo and its rug sits
close enough to the frame edge that cropping cuts it at most screen widths — flagged, not
fixed, since it's a placeholder. When the real hero photo is chosen, check it against
`docs/PHOTO-SLOTS.md`'s hero row before it ships: no rug edge may be visible right at the frame
boundary.

**Done since this list was written:** design rights assigned to the client with IPO registration offered and the fee included; lead times qualified by scale and complexity; budget selector removed; room photographs invited on the enquiry upload; plate sizes corrected after your audit; wall hangings redone with loops and a threaded pole.

**Done 2026-08-11:** the enquiry pipeline finished and proven end to end on Supabase + Web3Forms — since replaced, see above.

**Done 2026-08-20:** enquiry backend rebuilt on Google (Apps Script + Drive + Sheet), the dead photo link fixed, and `npm test` repaired (it was silently running zero tests).

**The code side is done.** What's left is the list above — and apart from the Google setup step and the short Supabase close-out in section 1, none of it is code.
