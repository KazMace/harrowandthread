# Launch readiness — Harrow & Thread

Audited 2026-09-13 against the built site (`npm run build`, served with `astro preview`, opened in Chrome at 390 px and 1440 px). Read-only session. Nothing in the code was changed.

## Verdict: **small fixes**

The site builds, runs and submits cleanly. Nothing is technically broken. What stands between it and launch is copy: placeholder text a customer can read, and two pages that contradict each other. All of it is text edits.

---

## Blockers (a customer would see these)

1. **Footer shows `[Trading address]` on every page.**
   `src/data/site.json:7`, rendered by `src/components/global/Footer.astro:29`.
   Appears on all 12 pages. Your call was to add the virtual office later. Until it exists, the bracketed text is live. The line could be hidden when the value is empty, the same way the company number already is on line 28.

2. **Three legal pages say `Last updated: [Date before launch]`.**
   `src/pages/terms.astro:14`, `src/pages/privacy.astro:15`, `src/pages/cookies.astro:14`.

3. **Privacy page claims a company that does not exist.**
   `src/pages/privacy.astro:22` renders as: "Registered in England and Wales. Company number: . Registered office: [Trading address]." You are a sole trader, and the number is blank.

4. **Trade page promises a discount you decided not to give.**
   `src/pages/trade.astro:51`: "Discounted rates for registered trade accounts." A designer will ask for it. Already on your Next list.

5. **Trade page and Terms disagree about who owns the design.**
   `src/pages/trade.astro:77` says "We keep the rights to the design we draw, and we licence it to your client alone."
   `src/pages/terms.astro:29` and `:113` and `src/pages/commissions.astro:286` say the rights are assigned to the client on final payment. A designer reading both sees a contradiction on the point they care about most.

6. **Every price on the site is a placeholder, by your own note.**
   `docs/PRICE-LIST-WORKED.md` open point 4 says the £600 / £900 / £1,200 tiers were never real. The real wool sell rate from that sheet starts around £255 to £330 per m², so the site's "from £600" is roughly double what a customer would actually be quoted.
   Where the numbers live: `src/data/pricing.json:8,15,22` and the worked examples; `src/pages/commissions.astro:39` (the page title says "From £600/m²"); `src/pages/index.astro:52` and the JSON-LD at `:34-45` (answer engines quote this); `src/layouts/BaseLayout.astro:49`; `src/components/home/PriceAnchor.astro:37-39`; `src/pages/carpets.astro:53,138`; the cost answer in `src/data/faq.ts`.
   This is a decision, not a bug. Launch with the placeholder numbers, or do the pricing-by-material job first. Recommendation: do the pricing job first. The numbers are in page titles and structured data that Google and AI tools will show.

---

## Nice to have (nobody would notice at a first visit)

- **Preselect on the enquiry form never works.** `src/pages/enquire.astro:8-9` reads the `?type=` query at build time, which is always empty on a static site. Links that rely on it: `src/pages/carpets.astro:200` (`?type=carpet`), `src/pages/trade.astro:88,119` (`?type=trade`, and "trade" is not an option in `src/lib/constants.ts:43-49`). Harmless, the visitor just picks from the list.
- **Button label changes after a failed send.** Starts as "Submit enquiry" (`src/pages/enquire.astro:268`), comes back as "Send enquiry" (`:525`).
- **Open Graph image size is declared wrong.** `src/layouts/BaseLayout.astro:118-119` says 768 × 1376. The file `public/images/og-hero.jpeg` is 1200 × 675. Most scrapers ignore the declared size, but some use it for layout.
- **Cookie banner asks consent for analytics that do not exist.** `src/components/global/CookieBanner.astro:14-15`, and `src/pages/cookies.astro:51` names Plausible or Fathom. Already on your Next list (fold cookies into Privacy, drop the banner).
- **Privacy page says "luxury".** `src/pages/privacy.astro:19`: "a bespoke luxury rug company". Your copy rule is never to use the word.
- **Negative sizes are accepted.** Forcing width `-50` submits as `-50` (`src/pages/enquire.astro:148-168`, `min="0"` is not enforced). Known open QA finding; the test for it is skipped.
- **No-JavaScript fallback goes nowhere.** With scripts off the form posts to `/enquire/success`, a static page (`src/pages/enquire.astro:40`). On most hosts that is a 405 or a "Received." page with nothing sent. The `data-netlify` attribute on `:36` only does anything on Netlify. Very few visitors run without JavaScript.
- **Hero eyebrow is hard to read on a phone.** `src/components/home/Hero.astro:29-31`: the small caps line "BESPOKE HAND-WOVEN RUGS, WALL HANGINGS AND CARPETS" sits over the brightest part of the picture (chandelier and windows) at 390 px. The headline and button are fine.
- **Favicon is SVG only.** `src/layouts/BaseLayout.astro:102`. No PNG or ICO fallback and no Apple touch icon, so Safari tabs and some search results may show a blank.
- **Home Lighthouse is 98, not 100.** Render-blocking CSS costs about half a second, and the hero is served at 1600 px on a phone (`src/components/home/Hero.astro:25`, `sizes="100vw"`). Not worth chasing before launch.
- **Uncommitted work in git.** The docs move into `docs/` and the `CLIENT-TODO.md` edit are staged but not committed.

---

## What was checked and passed

| Area | Result |
|---|---|
| Build | Clean. 12 pages, sitemap and robots generated, no warnings. |
| Tests (`npm test`) | 7 pass, 1 skipped (the negative-size case above). |
| Console errors, failed requests, script errors | Zero, on all 12 pages plus the 404, at 390 px and 1440 px. |
| Horizontal overflow | None at 390 px or 1440 px. |
| Fonts | Cormorant Garamond and Schibsted Grotesk render. No Arial fallback. |
| Images | All 12 home images load after scrolling. No broken image, every image has alt text. |
| Page weight (home, phone) | 754 KB at load, 1.6 MB after scrolling the whole page. Load event fires well under a second locally. |
| Hero at 390 px | One image, one line, one button. Headline and "Start a commission" both sit inside the first screen (button top at 381 px of 844). |
| Mobile menu | Opens, shows Commissions, Carpets, Enquire, closes. Focus is trapped. |
| Cookie banner | Held back until scroll, then 125 px at the bottom. Does not cover the hero. |
| Lighthouse, mobile, Home | Performance 98, Accessibility 100, Best practices 100, SEO 100. LCP 2.3 s, CLS 0.004. |
| Lighthouse, mobile, Commissions | 100 / 100 / 100 / 100. LCP 1.5 s. |
| Lighthouse, mobile, Enquire | 100 / 100 / 100 / 100. LCP 1.5 s. |
| Titles, descriptions, canonical, Open Graph | Present and unique on all 12 pages. Success page and 404 carry `noindex`. |
| Placeholder sweep | No lorem ipsum, no TODO comments, no test data in `src/`. No "tuft" wording anywhere. The only bracketed placeholders are the ones listed as blockers. |
| Dead links | Every internal link and anchor resolves to a built page. One external link (arscolors.com). |
| 404 | Missing paths return status 404 with the styled page. |

## The enquiry form, traced end to end

1. The Google Apps Script URL from `.env` is baked into the built JavaScript (`dist/_astro/hoisted.*.js`). It is a real `/exec` address, not the placeholder.
2. A safe probe from the page (POST `{}`) got HTTP 200 and `{"ok":false,"error":"missing required fields"}`. The script is deployed, reachable, and the browser can read its reply. That probe writes nothing.
3. A real fill-in (name, email, who I am, rug) posted the full payload to that URL: name, email, phone, iam, commission_type, location, size_w, size_h, design_tier, timeline, design_source, notes, images.
4. With the network blocked, the page stayed on `/enquire`, showed the red "We could not send your enquiry…" message with your email address, and did not fake a success.
5. With the backend stubbed to reply `{"ok":true}`, the visitor lands on `/enquire/success`.
6. Empty submit shows four inline errors and does not send.
7. Two rapid clicks plus Enter sent exactly one request. The old double-email bug is fixed.
8. Honeypot: filling it sends nothing and still shows success (covered by the test suite).

## What could not be verified, and why

- **A real enquiry arriving in your inbox and Sheet.** I did not send one, because it would create a row and email you. Everything up to the script's door is proven; what the script does with a valid enquiry is only covered by the earlier end-to-end test on 2026-08-20.
- **The live host.** There is no deploy config in the repo and the host is not recorded anywhere I could find. So the 404 page, the no-JS POST behaviour, HTTPS, and the Search Console file were tested against the local preview only.
- **Lighthouse on the real domain.** Scores above are from the local preview server. A CDN usually scores the same or better, but it is not the same measurement.
- **A physical phone.** 390 px was Chrome's device emulation, not hardware.

## The three pages

Home, Commissions and Enquire are all present, reachable from the menu, and finished. The site also ships nine more pages: Carpets, Trade, FAQ, Care, Terms, Privacy, Cookies, the success page and the 404. The header menu shows Commissions, Carpets and Enquire. If the three-page structure is meant literally, the extras are a separate decision. None of them is broken.
