# Harrow & Thread — your list

Everything left that needs you rather than code. Ordered by what blocks launch.

---

## 1 · Blocks launch — legally or functionally

**Test the enquiry form end to end.** The single most important item. Deploy, then submit a real enquiry and confirm it arrives in your inbox with any attached images. The form currently carries `data-netlify="true"`, which only works if you host on Netlify — anywhere else and you need an endpoint (Formspree, Basin, Resend). This failure mode is invisible from the front end: the site will say "Received" while discarding everything. It did exactly that for weeks before it was caught.

**Trading address.** Renders as `[Trading address]` in the footer of all 12 pages right now.

**"Last updated" dates** on `/terms`, `/privacy` and `/cookies`. Currently `[Date before launch]`.

**Phone number.** You said this was easy to sort. There isn't one anywhere on the site, and for a £90k purchase a buyer wants to speak to someone.

**Solicitor review** of `/terms`, `/privacy` and `/cookies` before you go live. I've kept them compliant as far as build-level obligations go, but that isn't legal advice.

**Decide on incorporation and VAT with an accountant.** At £600–£1,200/m² you'll cross the £90k VAT threshold on your third or fourth commission. That changes every published price, so decide before launch rather than after. Note "Ltd" cannot appear anywhere until Companies House registration actually exists — it's a criminal offence under the Companies Act 2006 s.65.

---

## 2 · Blocks a real customer segment

**Fire-rating certification** — BS 4790 and EN 13501. Without it, no hotel, developer or commercial project can specify your product at all. Even though the site now sells to end customers, this closes the entire contract market.

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

**Enquiry form fields.** Four are required now: name, email, what they're commissioning, and who they are. My proposal was to also require size and design tier, and to cut budget, timeline and design starting point. Your call.

**Privacy and Terms in the homepage accordions.** Your brief listed them. I linked to the pages instead, because two copies of legal text drift apart and it matters which one was live. Say the word if you want them inline.

---

## 5 · Nice to have

- **Analytics** — Plausible or Fathom, currently commented out in `BaseLayout.astro`.
- **Delete the two old reference links** from `harrowandthread_core_Design.md` if they're still bothering you.
- **A second all-over geometric image** once the rate is settled, so the tier has its own picture.

---

## Where the build stands

Direction A rolled across all 12 pages. Every image slot filled. Accordions built. All rugs shown whole, never cropped — verified structurally, no `object-cover` anywhere. Zero horizontal overflow across 12 pages × 11 widths. One `h1` per page, no heading skips. Fonts confirmed rendering. Form validated both paths. 4.3 KB of JavaScript. Compliance greps clean.

**The code side is done.** What's left is the list above.
