# Codebase traps — read before editing CSS, Tailwind config, or responsive layout

Split out of `CLAUDE.md` to keep that file short. Every item here is a bug that actually
shipped and cost a session to find.

## Tailwind

- **The theme is fully overridden, not extended.** Undefined classes resolve to nothing
  silently instead of erroring — `text-xs` and `gap-9` both did this and caused invisible
  layout bugs that survived several reviews. Keep the spacing and fontSize scales contiguous.
- **Font family names must match what fontsource registers** (`'Inter Tight Variable'`, not
  `'Inter Tight'`). A mismatch silently falls back to Arial with no error. The entire site
  rendered in Arial for several sessions because of this. Check
  `getComputedStyle(document.body).fontFamily` in a browser, not the config.

## CSS

- **Never `focus:outline-none`.** It once made the only conversion form keyboard-invisible
  across all 13 fields.
- **Split vendor and standard pseudo-elements into separate rule blocks.** Grouped in one
  selector list, engines that don't recognise one drop the whole declaration — it vanished
  from the built CSS silently. Verify the declaration appears in `dist/_astro/*.css`.
- **Motion must never gate content.** `.reveal`/`.stagger` hidden states are scoped to `.js`
  (set by an inline script in `BaseLayout` head) with an IntersectionObserver fallback.
  Without that scoping, a JS failure leaves sections permanently blank.

## Responsive

- **Sweep 320 / 375 / 414 / 480 / 600 / 768 / 834 / 1024 / 1280 / 1440 / 1920.** Testing only
  375 and 1440 repeatedly missed real breakage. Overflow appears and disappears at
  intermediate widths as breakpoints engage — the worst offender was 768px, where a
  multi-column grid first engages but columns are still narrow.
- **Diagnose with `el.scrollWidth > el.clientWidth` across `body *`.** Bounding rects get
  clipped by ancestors and hide the culprit.
- Step display sizes up gradually (`text-3xl xs:text-4xl sm:text-5xl lg:text-6xl`) rather
  than jumping straight to a large `sm:` value.
- Large display type and non-breaking strings are the usual cause. `overflow-wrap:break-word`
  fixes overflow but splits words mid-glyph — don't apply it to `.display`.

## Build

- **`@astrojs/sitemap` must stay pinned to 3.2.1** — newer versions crash on Astro 4.
- Every fix on this codebase has a history of breaking something adjacent. Check the thing
  you changed *and* what sits next to it.

## Content rules baked into the copy

- **The construction term is "hand-tufted".** Never "handwoven" or "woven".
- **The word "fold" must not appear anywhere**, in any construction. Pieces are always rolled
  around a core, at every size — a hand-tufted pile holds a crease permanently.

## Screenshot harness

```
npm run preview                      # serves dist on :4321 (or next free port)
playwright: ~/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs
chromium:   ~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
```

Screenshot at viewport size and scroll, **not** full-page — full-page captures get
downscaled ~4× and make real content look blank, which has caused false "it's broken"
conclusions.

## Image generation

```
POST https://openrouter.ai/api/v1/images
Authorization: Bearer $OPENROUTER_API_KEY     # from .env, gitignored
body: {"model": ..., "prompt": ..., "aspect_ratio": "16:9", "n": 1}
response: {"created", "data":[{...b64...}], "usage":{"cost": ...}}
```

Measured costs and speeds (same prompt, 16:9): Seedream 4.5 — 4p, 11s · FLUX 2 Pro — 4.5p,
23s · GPT-Image-2 — 13p, 102s · Gemini 3 Pro — 13.5p, 39s.

`input_references` is supported on nearly every model — feed a real photograph to make
generated images inherit real material and light, and to keep the whole set consistent.

**Prompt lesson:** "a rug in a light-filled interior" produces room shots where the rug is
small and the wall dominates — that is what broke the original hero. Prompts must say the rug
fills the frame, shot low, bold saturated colour, raking light across the pile.
