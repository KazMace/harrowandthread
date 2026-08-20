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

## Keep reads cheap

This project burns context faster than most because the work is visual. Measured on
2026-08-11: file/image reads accounted for ~2.1M tokens in one session, roughly double
everything else combined.

- **Every screenshot or generated image you Read costs ~3–4k tokens.** Look at the ones
  that decide something; don't review a whole batch out of habit. A montage
  (`montage a.png b.png -tile 4x2 -geometry 460x300 out.jpg`) puts eight images into one
  read — use it when surveying rather than judging.
- **Use `offset`/`limit` on Read** for long files. Never re-read a file you just edited;
  Edit fails loudly if it didn't apply, so a verification read tells you nothing.
- Prefer `grep -n` to locate, then Read the specific range.

## Screenshot harness

```
npm run preview                      # serves dist on :4321 (or next free port)
playwright: ~/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs
chromium:   ~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
```

Screenshot at viewport size and scroll, **not** full-page — full-page captures get
downscaled ~4× and make real content look blank, which has caused false "it's broken"
conclusions.

## Enquiry form architecture (rebuilt 2026-08-20, replaced Supabase + Web3Forms)

One destination, no server, no build step, nothing secret in the repo — because the
"server" is a Google Apps Script Web App, which runs as the client's own Google account
rather than needing a secret shipped to the browser.

```
browser
  └─ 1. POST { fields, images: [{name, mimeType, dataB64}] } as text/plain JSON
       -> Apps Script Web App (google-apps-script/Code.gs)
            ├─ Drive: save each photo, share "anyone with the link"
            ├─ Sheet: append one row (the enquiry log)
            └─ Gmail: HTML notification, real clickable links + inline thumbnails
```

**Why the switch.** Supabase's free plan auto-pauses after ~7 days idle and paused = no
DNS at all — it broke a live enquiry. Web3Forms' free tier caps monthly submissions and,
more decisively, cannot make an emailed link clickable at *any* paid tier — confirmed
against their own public roadmap ("custom email templates" is a pending, unbuilt feature
request). Google was already in the client's hands and has neither problem.

**Why `text/plain`, not `application/json`.** Apps Script Web Apps cannot answer a CORS
preflight — their hosting 302-redirects to a `googleusercontent.com` URL, and a browser
won't follow a redirect for a preflight `OPTIONS`. `text/plain` makes the POST a CORS
"simple request", which skips preflight entirely. `doPost` parses it with
`JSON.parse(e.postData.contents)`. Do not "modernise" this to `application/json` — see
the trap this exact phrasing describes in `AGENTS.md` for the *previous* backend; it's
the same class of mistake with a different mechanism.

**Downscale before sending, client-side, no dependency.** `createImageBitmap` +
`<canvas>` resize a phone photo to ~2000px on the long edge before base64-encoding it —
native platform API, per the laziness ladder in `CLAUDE.md`. This keeps the POST body
well under Apps Script's 50MB cap (base64 inflates bytes ~33%) and makes the form faster
on mobile data. `createImageBitmap` is picky about what it'll decode — a genuinely
invalid or empty file rejects; the client catches that and sends the enquiry anyway,
without photos, rather than losing the lead over one bad file.

**Link sharing, not access control.** The Drive photo link is "anyone with the link" —
the client's explicit choice, same trade-off already made once for the Supabase fix it
replaced: click and it opens, no login, but anyone holding the exact (long, random) URL
can view it. Nothing lets a stranger *list* the folder or guess a link.

**No SDK, still.** Plain `fetch`, one call. Current JS: **6.2KB raw / ~2.8KB gzipped**
across the two hoisted bundles — measure with `wc -c dist/_astro/*.js` then `gzip -c … |
wc -c`; `du` rounds to 4KB blocks and misreports. (Re-measured 2026-08-20; was 3.1KB
gzipped under the old architecture — the downscale function added a little.)

**Setup is now a client task, not a code task.** The script needs a Sheet ID and a Drive
folder ID pasted in, then a deployment — see `google-apps-script/README.md`. Until
`PUBLIC_GAS_URL` is set in `.env`, the form falls back to a native POST.

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
