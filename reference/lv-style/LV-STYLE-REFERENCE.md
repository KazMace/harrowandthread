# Louis Vuitton style reference — for Harrow & Thread

Made 2026-08-26. Pulled straight from `uk.louisvuitton.com/eng-gb/homepage` — colours, fonts, spacing, page links, and section layout. This is a **reference only**. Nothing on the live Harrow & Thread site was changed to make this doc.

> **Why this exists.** Kaiser does not like the current H&T look. If enough real photos come in to fill an image-heavy layout, we may switch styles. This doc is the "everything you'd need" reference for that switch — colours, type, link map, page order, screenshots. We are not building anything yet. We will talk through what to keep, drop, or soften before any of this touches code.

---

## Colours

LV's whole site is near-monochrome. Colour is used only inside photos and a few small accent moments — not in the layout itself.

| Hex | Role |
|---|---|
| `#1a1a1a` | main text ("ink") |
| `#ffffff` | page background |
| `#f8f8f8` | light panel |
| `#f2f2f2` | product-card background |
| `#e1e1e1` | hairline / border |
| `#727272` | secondary text |
| `#929292` | border, stronger |
| `#000000` | pure black (buttons, accent) |
| `#c87000` | "highlight" (rare, e.g. sale/flag) |
| `#c53929` | error red (form only) |
| `#5c7d0b` | success green (form only) |

**Reading:** this is a black/white/grey system. There is no "brand colour" the way H&T uses the dye range (madder, ochre, teal, etc). If we moved this direction, our 11 dye-range colours would need to become *photo content only* (in the rug images) rather than page-background colours — the `ColourRail` section as currently built (colour blocks as the design) would not fit this style at all.

---

## Type

| Role | Font stack | Size | Weight | Letter-spacing | Case |
|---|---|---|---|---|---|
| Body | `"Louis Vuitton Web", "Helvetica Neue", Helvetica, Arial, sans-serif` | 16px / 24px line-height | 400 | 0.4px | normal |
| H1 (hero headline) | same stack | 32px / 48px | 400 | 0.4px | normal (not uppercase) |
| H2 (section heading) | same stack | 24px | 400 | 0.4px | normal |
| Nav / links | same stack | 14–16px | 400 | 0.4px | normal |
| Buttons | same stack | 16px / 16px | 400 | 0.8px (wider) | normal |
| Small labels / eyebrow (e.g. "WOMEN", "MEN", "BEAUTY" tags above headlines) | same stack | ~10px (`--font-size-overline: .625rem`) | 400–500 | wide | **UPPERCASE** |

> **Font itself is not copyable.** "Louis Vuitton Web" is a private licensed font — it is not something we can install. Every element quietly falls back to `Helvetica Neue / Helvetica / Arial / system sans-serif`. So the honest target isn't "get their font," it's "get their *plain grotesque sans, no serif anywhere*" — which is a big swing from our current Cormorant Garamond serif display font. If we go this way, headings stop being a decorative serif and become the same clean sans as the body copy, just bigger.

Other size steps seen in their CSS tokens, for reference: `display-l: 4rem(64px)`, `display-m: 3rem(48px)`, `heading-l: 2rem(32px)`, `heading-m: 1.5rem(24px)`, `heading-s: 1.25rem(20px)`, `body-m: 1rem(16px)`, `body-s: .875rem(14px)`, `label-xs: .75rem(12px)`.

---

## Navigation & page links

### Top header bar (always visible)
- **Hamburger "Menu"** button, far left — opens a full category menu (see below), no visible top-level links otherwise.
- **Search** icon, next to menu.
- Logo/wordmark, centred.
- Right side (utility nav): **Contact us** (opens a panel, not a page) · **Wishlist** (`/eng-gb/mylv/wishlist`) · **My LV** (account) · **Shopping Bag**.

### Hamburger menu — full category list (this is their entire top-level site map)
- Women
- Men
- Monogram Anniversary
- Bags and Small Leather Goods
- Trunks and Travel
- Gifts and Personalisation
- Perfumes and Beauty
- Jewellery
- Watches
- Home, Lifestyle and Library
- Services
- The Maison Louis Vuitton → `/eng-gb/magazine`

Below that, small utility links inside the same panel: **Locate a store** (`/eng-gb/stores`) · **Ship to: United Kingdom** (country switcher) · **Sustainability** (`/eng-gb/magazine/articles/sustainability`) · an "Enhanced contrast" accessibility toggle.

**Pattern to borrow:** one flat list of top-level categories in a full-panel menu, not a dropdown mega-nav bar. For H&T (a tiny site, not a department store) this would collapse to something like: Carpets · Commissions · Trade · About/Process · Enquire — same "one clean list in an overlay" feeling, without pretending we have LV's number of sections.

### Footer — grouped into four labelled columns + legal strip

| Group | Links |
|---|---|
| **Help** | Contact us (+ phone number, WhatsApp) · FAQ (`/eng-gb/faq`) · Product Care (`/eng-gb/care-service`) · Stores (`/eng-gb/stores`) |
| **Services** | Repairs · Personalisation · Art of Gifting · Download LV Apps |
| **About Louis Vuitton** | Fashion Shows · Arts & Culture · The Maison Louis Vuitton · Sustainability · Latest News · Ethics & Compliance · Careers · Foundation Louis Vuitton |
| **Connect** | Email sign-up (newsletter) · Follow Us (social) |

Bottom legal strip (small text, one line): Sitemap · Legal & privacy · Accessibility statement · Cookies · MSA Transparency · Ship-to country switcher (repeated).

**Pattern to borrow:** Help / Services / About / Connect is a clean 4-bucket footer shape. H&T's current footer (Trade, FAQ, Care, Terms, Privacy, Cookies) could map onto 2–3 of those buckets instead of one flat list, which would read more considered without adding pages.

---

## Homepage — section order

Everything on the LV homepage is a full-width image or video block with a short label + one headline + one link, stacked one after another. No text-only sections, no icon grids, no numbered-steps sections.

| # | Section | Contents |
|---|---|---|
| 1 | Hero | Full-bleed image. Small uppercase label ("WOMEN"). One headline ("App Prelaunch: Back to School"). One link ("Pre-order the collection"). |
| 2 | Category shortcuts | Heading ("Explore a Selection of the Maison's Creations") + row of 8 image tiles, each one link to a category (Women's Handbags, Women's Accessories, Women's Shoes, Perfumes, Men's Handbags, Men's Eyewear, Men's Shoes, Men's Wallets & SLG). |
| 3 | Editorial banner (Beauty) | Big image + label ("BEAUTY") + headline + a small row of 4 product cards + one "Discover the collaboration" link. |
| 4 | Editorial banner (Women / new handbags) | Same pattern: image, label, headline, 4 product cards, "Discover the creations" link. |
| 5 | Editorial banner (Men / video) | Autoplaying video with a "Stop All Animations" / "Activate the sound" control, label ("MEN"), headline, 4 product cards, "Discover the creations" link. |
| 6 | "The Maison" closer | Heading + one paragraph of brand copy, then 3 tiles: History of the House / Fashion Shows / Arts & Culture Program, each with its own "Explore / Discover / The program" link. |
| 7 | Footer | As mapped above. |

**Repeating pattern (sections 1, 3, 4, 5):** full-bleed image or video → small uppercase category label → one headline → a short row of items → exactly one text link out. Never a button-heavy section, never more than one call-to-action per block.

> **This is the part that needs real photos.** Every one of those sections is one huge image doing all the work. Text is minimal and sits on top of or beside the image, never instead of it. This layout can't be built with placeholder colour blocks the way H&T's `ColourRail`/`RendersGrid` sections currently can — it needs a real photo per section, full quality, no crop compromises.

---

## Spacing, shape & interaction rules

- **Corners:** square. No rounded corners on buttons, cards, or images anywhere observed.
- **Borders:** hairline only, `#e1e1e1` at 1px, used sparingly (card edges, dividers) — never a heavy border.
- **Buttons:** plain text or thin-outline rectangles, black or white, no drop shadow, no gradient.
- **Motion:** section transitions and hover states use eased curves (`cubic-bezier(.215,.61,.355,1)` in, `cubic-bezier(.55,.055,.675,.19)` out), roughly 0.15–0.5s — subtle, not bouncy.
- **Video:** at least one homepage section autoplays muted video instead of a static image, with a visible pause control.
- **Labels:** every editorial section is tagged with a short uppercase department label (WOMEN / MEN / BEAUTY) sitting above the headline, small and wide-tracked.

---

## Screenshots (captured 2026-08-26)

- `reference/lv-style/lv-homepage-full.png` — full homepage, scrolled top to bottom.
- `reference/lv-style/lv-menu-open.png` — the hamburger menu open, showing the full category-list pattern.

---

## How this differs from Harrow & Thread right now

**H&T today**
- Display font: Cormorant Garamond (serif), body: Schibsted Grotesk (sans)
- Warm paper background (`#F7F4EE`), ink text (`#17150F`)
- 11-colour dye range used as page-background colour blocks (`ColourRail` section is 76 CSS colour swatches, no photos)
- Homepage hero has **no image on purpose**
- Only 7 real photos on the whole homepage today
- Square corners already (this one already matches LV)

**LV style**
- One sans-serif everywhere, no serif
- Near white/black/grey only; colour lives inside photos
- No colour-block sections — colour comes from real product/room photography
- Every hero and major section is a full photo or video
- Needs 7+ full-bleed high-quality photos just for the homepage sections above, plus more for category tiles
- Square corners (matches)

> **Bottom line:** this style needs a lot more real, high-quality photography than we currently have (we have 7 usable images; grand/ folder has 27 more but they're not wired into any page yet). That's the "waiting on enough real pics" blocker Kaiser mentioned — this doc is ready for when that's solved.

---

## Open questions for later (not decided — discuss before building)

- Keep the dye-range colours at all, or retire the `ColourRail` section entirely and let colour live only in photos?
- Drop Cormorant Garamond (serif) completely, or keep it for one small accent (e.g. pull-quotes) while headings go sans?
- Do we have (or can we get) enough photography to fill 5–7 full-bleed sections at LV's quality bar, or do we adapt the pattern to fewer, larger sections instead of matching LV's section count 1:1?
- LV's own custom font is legally theirs — confirm we're happy sourcing a similar neutral grotesque (e.g. a font already installed: Schibsted Grotesk, Inter Tight) rather than trying to buy/license something closer.
- Video hero: yes/no? Needs a video asset, not just stills, if we want to match section 5's pattern.
