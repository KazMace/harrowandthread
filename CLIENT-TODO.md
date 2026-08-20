# Harrow & Thread — your list

Everything left that needs you rather than code. Ordered by what blocks launch.

---

## 1 · Blocks launch — legally or functionally

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

**Trading address.** Renders as `[Trading address]` in the footer of all 12 pages right now.

**"Last updated" dates** on `/terms`, `/privacy` and `/cookies`. Currently `[Date before launch]`.

**Phone number.** You said this was easy to sort. There isn't one anywhere on the site, and for a £90k purchase a buyer wants to speak to someone.

**Solicitor review** — pay a solicitor to read `/terms`, `/privacy` and `/cookies` before launch. That's all it means. I've kept them compliant at build level, but I'm not qualified to give legal advice and you're taking £4,500+ non-refundable deposits on goods that cannot be returned. An hour of someone's time.

**Decide sole trader vs limited company, and plan for VAT.** Two separate decisions, often conflated:

- **VAT is not connected to company structure.** A sole trader registers for VAT at the same £90k threshold as a limited company. Going Ltd does not trigger it; staying sole trader does not avoid it.
- **Limited company accounts are annual, not quarterly.** Companies House wants accounts and a confirmation statement once a year, corporation tax likewise. The quarterly filing is **VAT returns** — which apply to a VAT-registered sole trader too. So the admin gap between the two options is smaller than it looks.
- At £600–£1,200/m² you will cross £90k on your third or fourth commission, and registering moves every published price by 20% or takes it out of margin. Settle it with an accountant **before** launch.
- **"Ltd" cannot appear anywhere on the site** until Companies House registration actually exists — criminal offence under the Companies Act 2006 s.65.

---

## 2 · Blocks a real customer segment

**Fire-rating certification** — BS 4790 and EN 13501. Without it no hotel, developer or commercial project can specify your product, so this closes the whole contract market even though the site now sells to end customers.

Worth knowing: **wool is one of the better natural performers here**, not a problem material. High moisture and nitrogen content and a high oxygen index mean it chars and self-extinguishes rather than melting and dripping the way polypropylene and nylon do — which is why wool gets specified for aircraft and hotel interiors. BS 4790 is a *test method*, not a standard wool fails. Certification means sending a sample to a testing lab and getting a certificate you can hand to a specifier. Likely a fee-and-paperwork exercise rather than a product problem — but get it tested, because the certificate is what developers ask for, not the chemistry.

**The all-over geometric rate.** The card currently shows one Geometric rate at from £900/m². You told me a border and an all-over pattern genuinely cost different amounts. If that's still true, I need the second figure, or all-over work is being under-quoted.

**Trade terms.** `/trade` says "Trade pricing on registered accounts" and nothing more. If you want designers at all, that needs a real percentage, threshold and payment terms.

---

## 3 · The biggest quality lever left

**Photograph something real.** Every image on the site is AI-generated and labelled "Design visualisation", which tells every visitor they aren't looking at your work. In order of value:

1. **A finished commission in situ** — the single most valuable asset you could get. Ask permission in writing; some clients will say yes.
2. **A pile close-up.** A phone camera does this fine. Unfakeable, needs nobody's permission, and it's the shot that proves the craft.
3. **Process** — a frame, wool cones, dye lots, a tufting gun.
4. **A named human with a photo.** Right now the site has no person in it anywhere.

One genuine texture shot does more for trust than four more AI room scenes. And I can feed a real photograph in as a reference so the generated images inherit its material and light.

---

## 4 · Three decisions I've been holding

**The "Assurances" section** on the homepage — "What you're covered for", four guarantees. An earlier session added it without asking. Keep or cut?

**Enquiry form fields.** Budget is now removed as you asked. Four remain required: name, email, what they're commissioning, and who they are. Still open: should size and design tier also be required, and should timeline and design starting point be cut too?

**Privacy and Terms in the homepage accordions.** Your brief listed them. I linked to the pages instead, because two copies of legal text drift apart and it matters which one was live. Say the word if you want them inline.

---

## 5 · Confirm when you have a moment

**Plate sizes.** I recaptioned four plates after your scale audit, reading each size off the picture by measuring against the furniture: library 4×3m → **8×6m**, bedroom 5×4 → **6×4m**, wall hangings 3×2 → **4×3m** and 2.5×1.8 → **3.5×2.5m**. Those are my estimates from the imagery — worth your eye before launch.

**Registered office address.** Once you have the virtual address, it drops straight into the footer. Note that since ECCTA 2023 the registered office must be an "appropriate address" able to receive and acknowledge post — PO boxes don't qualify, virtual office providers do.

---

## 6 · Nice to have

- **Analytics** — **none is installed.** Corrected 2026-08-12: nothing in `src/` loads Plausible,
  Fathom, gtag or GTM. `CookieBanner.astro` has a bare `// Load analytics scripts here` comment
  and no script; `BaseLayout.astro` has nothing at all. ⚠ Meanwhile `/cookies` tells visitors in
  the present tense that the site *"uses privacy-first analytics (Plausible or Fathom)"* —
  describing a data practice that does not exist. Either install one or reword that page. This
  also gates any paid advertising: spending with no measurement is spending blind.
- **Delete the two old reference links** from `harrowandthread_core_Design.md` if they're still bothering you.
- **A second all-over geometric image** once the rate is settled, so the tier has its own picture.

---

## Where the build stands

Direction A rolled across all 12 pages. Every image slot filled. Accordions built. All rugs shown whole, never cropped — verified structurally, no `object-cover` anywhere. Zero horizontal overflow across 12 pages × 11 widths. One `h1` per page, no heading skips. Fonts confirmed rendering. Form validated both paths. 4.3 KB of JavaScript. Compliance greps clean.

**Done since this list was written:** design rights assigned to the client with IPO registration offered and the fee included; lead times qualified by scale and complexity; budget selector removed; room photographs invited on the enquiry upload; plate sizes corrected after your audit; wall hangings redone with loops and a threaded pole.

**Done 2026-08-11:** the enquiry pipeline finished and proven end to end on Supabase + Web3Forms — since replaced, see above.

**Done 2026-08-20:** enquiry backend rebuilt on Google (Apps Script + Drive + Sheet), the dead photo link fixed, and `npm test` repaired (it was silently running zero tests).

**The code side is done.** What's left is the list above — and apart from the Google setup step and the short Supabase close-out in section 1, none of it is code.
