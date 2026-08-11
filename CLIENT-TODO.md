# Harrow & Thread — your list

Everything left that needs you rather than code. Ordered by what blocks launch.

---

## 1 · Blocks launch — legally or functionally

**Set up the enquiry pipeline.** Decided: Web3Forms **free** tier sends you the notification email, and everything — including the uploaded room photographs — goes to Supabase. Web3Forms never handles the files, so you do **not** need their $12/month Pro plan.

**Status: half done.** Supabase URL and key are in `.env`. Still needed, in this order — each one blocks the next:

1. **Set up the Harrow & Thread email.** This comes first because Web3Forms registers against a real mailbox. `enquiries@harrowandthread.com` is already written into the site as your contact address, so that is the one to create. Options: your domain registrar usually bundles mailboxes, or Google Workspace / Fastmail / Zoho if you want it properly.
2. **A Web3Forms access key** — free account at web3forms.com, registered against the mailbox from step 1. 250 submissions a month, no card needed. They email you a UUID.
3. ~~**Supabase project URL and anon key**~~ — **done**, both in `.env` (new-format `sb_publishable_` key, which is fine).

   **Cause of the earlier failure found: the project was suspended.** Free-tier Supabase projects pause after about a week idle, and a paused project's subdomain stops answering DNS entirely — which is exactly what we saw. Nothing was wrong with the keys or the ref.

   **Resumed, and coming back up.** DNS now resolves. The API is not serving yet — the REST root returns 401 and a table query returns a Cloudflare holding page instead of JSON, which means the project is still provisioning behind the edge. Supabase say minutes to hours. No action needed; it will start answering on its own.

   **Worth knowing for later:** this will happen again if the project sits idle for a week. Once the site is live and taking real enquiries it stays warm on its own, but during a quiet build period expect it. If it becomes a nuisance, a paid tier removes the auto-pause.

4. **Run `/mcp` in the terminal** to authenticate Supabase over OAuth. This is also the fastest way to settle the DNS problem above — once authenticated I can read your real project ref straight from the account instead of us guessing at a twenty-letter string. I've added the server to `.mcp.json` using the OAuth transport rather than the access-token version, because the token variant would write a secret into a committed file. Once you've authenticated I can create the table, the storage bucket and the security policies myself.

Per Supabase's own warning, point the MCP at a development project, not live production data.

**One thing I must not skip, and neither should you:** the Supabase anon key is public by design, so the `enquiries` table needs Row Level Security with an **insert-only** policy. Without it, anyone who views the page source can read every enquiry you have ever received. I'll set that up, but if you ever wire Supabase in yourself, that's the step that matters.

---

**Original note on why this is top of the list:** This is the single most important item and it needs you first — there is nothing to test yet. The form is static HTML with no backend, so something has to receive the POST and email it to you. In order:

1. **Create the mailbox.** `enquiries@harrowandthread.com` is already written into the site as your contact address, so that inbox has to exist.
2. **Pick a form service and open an account.** Netlify Forms (free tier, only works if you host on Netlify, handles file uploads), Formspree, or Basin. The form currently carries `data-netlify="true"`, which does nothing anywhere except Netlify.
3. **Paste the endpoint into `src/data/site.json`** — the field `formEndpoint` is already there and wired up. That is the entire change; nothing else needs touching. Leave it empty and it falls back to Netlify Forms, which only works on Netlify.
4. **Then** submit a real enquiry from the live site and confirm it lands with any attached images.

Note on the approach: your plan suggested an Astro API route or Resend. Both work, but both need a server adapter and an API key in the repo, which turns a static site into a hosted one. Formspree or Basin needs neither — one URL, no backend, no secret. If you'd rather do it properly with Resend later, that's a straightforward upgrade once you know where you're hosting.

Why this is top of the list: the failure is invisible from the front end. The page says "Received" whether or not anything was sent, and it did exactly that — silently discarding every enquiry — for weeks before it was caught.

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

- **Analytics** — Plausible or Fathom, currently commented out in `BaseLayout.astro`.
- **Delete the two old reference links** from `harrowandthread_core_Design.md` if they're still bothering you.
- **A second all-over geometric image** once the rate is settled, so the tier has its own picture.

---

## Where the build stands

Direction A rolled across all 12 pages. Every image slot filled. Accordions built. All rugs shown whole, never cropped — verified structurally, no `object-cover` anywhere. Zero horizontal overflow across 12 pages × 11 widths. One `h1` per page, no heading skips. Fonts confirmed rendering. Form validated both paths. 4.3 KB of JavaScript. Compliance greps clean.

**Done since this list was written:** design rights assigned to the client with IPO registration offered and the fee included; lead times qualified by scale and complexity; budget selector removed; room photographs invited on the enquiry upload; plate sizes corrected after your audit; `formEndpoint` wired so the form is one pasted URL from working; wall hangings redone with loops and a threaded pole.

**The code side is done.** What's left is the list above.
