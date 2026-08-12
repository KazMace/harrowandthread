# Harrow & Thread — your list

Everything left that needs you rather than code. Ordered by what blocks launch.

---

## 1 · Blocks launch — legally or functionally

~~**Set up the enquiry pipeline.**~~ **DONE — 2026-08-11. Both legs live and proven end to end.**

Web3Forms free tier sends you the notification email; everything, including the uploaded room photographs, goes to Supabase. Web3Forms never handles the files, so you do **not** need their $12/month Pro plan.

All four steps are finished: the mailbox, the Web3Forms key, the Supabase keys, and the MCP authentication. The schema is applied — `enquiries` table, `enquiry-uploads` storage bucket, insert-only security policies.

**It was tested for real, in a browser, not just read over.** A full submission with an attached image: photo uploaded to storage, row written to the database, notification email sent, visitor landed on the "Received" page. Every field arrived in the right place.

**The security was proved, not assumed.** The anon key is public by design — it ships in your page source — so the table has to be insert-only or anyone viewing the page could read every enquiry you have ever received. Tested by writing a row and then trying to read it back as a stranger: the write succeeded, the read failed, and a delete attempt left the row untouched. Same for the uploads — a stranger can send a file but cannot read one back, list the bucket, or reach it by URL.

**Still worth knowing:** free-tier Supabase pauses after about a week idle, and a paused project stops answering DNS entirely. If that happens mid-enquiry you still get the email, and it arrives stamped *"WARNING: this enquiry could NOT be saved to the database. This email is the only record of it."* So a lead is never lost silently — but treat the email as your real record and the database as the convenience. Once the site is taking real enquiries it stays warm on its own.

**Why this sat at the top for so long:** the failure is invisible from the front end. The page says "Received" whether or not anything was sent, and it did exactly that — silently discarding every enquiry — for weeks before it was caught. That is now closed.

---

**→ Confirm which contact address is actually live.** The site shows `enquiries@harrowandthread.com` on all 12 pages, in `/cookies`, on `/enquire`, and in the structured data search engines read. An earlier session switched everything to `meadow.mace@harrowandthread.com` on the grounds that it was "the mailbox that exists", and then the next session switched it straight back — so I can't tell from the code which of those is true, and I'm not going to guess.

If `enquiries@` is a real mailbox or an alias forwarding to you, nothing needs doing. If it isn't, **every contact address on the site is dead**, including the one `/enquire` tells people to use when the form fails. Send me a test email to it and tell me whether it arrives.

**→ Two minutes of tidying in the Supabase dashboard.** My test data is still there. Storage → `enquiry-uploads` holds three files (two test uploads and an 8-byte `probe.png`); select and delete them. The database rows are already cleared. Storage files can only be removed through the dashboard, not with SQL — Supabase blocks that deliberately so files can't be orphaned.

**→ Drop a leftover table.** `public.images` is left over from the Knightfall Rugs build on this same Supabase project. It has security switched off, so anyone with your public key can read *and write* it. Nothing on this site uses it. You approved removing it but my tooling refuses to run destructive commands, so paste this into the Supabase SQL editor:

```sql
drop table if exists public.images;
```

**→ Check your Web3Forms submission limit.** The free tier caps monthly submissions. That cap is now the single point of failure in the pipeline — hitting it costs you a commission enquiry, not pennies. Worth knowing the number and whether they warn you as you approach it.

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

**Done 2026-08-11:** the enquiry pipeline finished and proven end to end — database schema applied, insert-only security verified by attack rather than assumption, and a real submission with an attached photograph tested in a browser through to the "Received" page.

**The code side is done.** What's left is the list above — and apart from the three short dashboard jobs in section 1, none of it is code.
