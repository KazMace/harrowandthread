# website.md — frontend rulebook

Lessons from the Harrow & Thread build, written so the next site starts where this one
finished rather than repeating it. Every rule here is a bug that actually shipped, a
decision that actually held, or a cost that was actually measured. Nothing aspirational.

**Source of truth for this project stays `CLAUDE.md`, `NOTES-codebase.md` and
`COMPLIANCE.md`.** This file generalises; those files govern.

---

## 1. Executive summary

**The philosophy that worked: ship the least machinery that renders correctly, then look
at it in a browser before believing anything.**

Four principles, in the order they saved time:

1. **The client's documents are the brief.** Not a spec you generate from them. On this
   build an earlier session wrote its own spec, declared it authoritative, and later
   sessions believed it — the client's requested homepage accordions never got built and
   an invented colour palette became "the design system". A document you wrote is
   evidence of what you thought, never of what was asked.
2. **Static by default.** 12 pages ship **4.3 KB of JavaScript** total. No client
   framework, no state library, no SDK. Every interactive element is a native platform
   feature (`<details>`, `<form>`, `<input type="file">`) until proven insufficient.
3. **Verify by rendering.** The whole site rendered in Arial for several sessions because
   people read the Tailwind config and concluded it was fine. Config is a claim;
   `getComputedStyle` is evidence.
4. **Build the laziest thing that works.** Before writing anything: does it need to exist?
   Is it already here? Does the platform do it? This repo once had one grid pattern copied
   22 times — the expensive failure is re-implementing, not under-building.

**The measurable outcome:** Lighthouse 100/100/100/100 (performance, accessibility, best
practices, SEO) on real mobile artifacts with simulated throttling — not estimates.

---

## 2. Project stack & architecture

### The stack that earned its place

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro 4 | Zero JS by default. Components without hydration cost. |
| Styling | Tailwind (theme **overridden**, not extended) | One vocabulary, no cascade archaeology. |
| Fonts | `@fontsource-variable/*` | Self-hosted, no external request, no CLS. |
| Data | `src/data/*.json` + `*.ts` | Content edits don't touch markup. |
| Backend | Plain `fetch` to REST endpoints | See below. |
| Tests | `node --test` + Playwright | Both effectively stdlib. No framework, no config file. |

### ✅ Do

- **Organise components by scope, not by type:** `global/` (Header, Footer, CookieBanner,
  SkipLink), `home/` (page-specific sections), `ui/` (genuinely reusable primitives). Flat
  `components/` becomes unnavigable at ~15 files; this stayed clear at 17.
- **Put content in `src/data/`.** `site.json` (company, nav, footer links), `pricing.json`,
  `colours.json`, `faq.ts`. Copy changes then never risk a markup regression.
- **One layout.** `BaseLayout.astro` owns `<head>`, JSON-LD, the skip link, and the inline
  `.js` class script. Per-page layouts fragment the head and the structured data drifts.
- **Talk to APIs with `fetch`.** Adding `@supabase/supabase-js` would have added **~30 KB
  gzipped to a site shipping 4.3 KB of JS**, to save a few lines. The REST endpoint is a
  URL and a header.
- **Order multi-step submissions by what's recoverable.** Upload files → insert the row →
  send the notification. If the notification fails the enquiry is still captured. Losing an
  email is recoverable; losing the enquiry is not.

### ❌ Don't

- **Don't add a dependency for what a few lines do.** The bar: would this be more code than
  the thing it replaces, in a year, including its upgrades?
- **Don't build an abstraction with one implementation.** No factory for one product, no
  config for a value that never changes, no wrapper "for later".
- **Don't re-implement what's a few files over.** Grep before you write. This is the single
  most common failure mode on a multi-session build, because each session starts without
  the memory of what the last one wrote.
- **Don't let a generated document outrank the client's.** If you write a spec, checklist
  or audit, label it as derived and cite the source line for every claim.
- **Don't "modernise" a working integration.** The Web3Forms call is a native hidden-form
  POST *on purpose*: `fetch` with JSON fails the CORS preflight on their free tier, and
  `fetch` with `FormData` gets no `Access-Control-Allow-Origin`. A native form POST isn't
  subject to CORS at all. Both `fetch` versions fail **silently from the visitor's point of
  view** — the worst possible failure. Leave a comment saying so, or someone will "fix" it.

### Architecture pattern worth reusing: serverless enquiry capture

```
browser
  ├─ 1. POST files      -> Supabase Storage bucket (private)
  ├─ 2. POST row        -> Supabase table (incl. storage paths)
  └─ 3. POST text+links -> Web3Forms -> email notification
```

No server, no build step, nothing secret in the repo. Both keys involved (Web3Forms
*access key*, Supabase *anon* key) are designed to be public — **which is only true with
Row Level Security on.** Insert-only policy for `anon`, no select/update/delete, and the
same on the bucket. Without that, the anon key lets anyone read every enquiry.

---

## 3. Styling & UI/UX

### The Tailwind trap that cost the most: an overridden theme fails silently

Overriding `theme` (rather than `theme.extend`) is right — it forces one vocabulary. But
**undefined classes resolve to nothing instead of erroring.** `text-xs` and `gap-9` both
did this and produced invisible layout bugs that survived several reviews.

```js
// ✅ Keep every step of the scale defined and contiguous.
spacing: { 0:'0', 0.5:'0.125rem', 1:'0.25rem', 1.5:'0.375rem', /* … no gaps … */ }
```

- **Never leave a sparse scale.** A missing `9` is a bug that renders as "slightly wrong
  spacing" and reads as a design choice.
- **Add semantic spacing tokens** alongside the numeric scale: `gutter`, `gutter-mobile`,
  `section`, `section-mobile`. Section rhythm then changes in one place.

### Fonts

```js
// Family names MUST match what fontsource registers.
display: ['Fraunces Variable', 'Georgia', 'serif'],   // not 'Fraunces'
body:    ['Schibsted Grotesk Variable', 'system-ui', 'sans-serif'],
```

A mismatch **falls back to Arial with no error, no warning, and no build failure**. Check
`node_modules/@fontsource-variable/<name>` for the registered name before changing it, and
assert the computed value in a test:

```js
const font = await page.locator('h1').first().evaluate(el => getComputedStyle(el).fontFamily);
assert.doesNotMatch(font, /^(Arial|sans-serif|serif)$/);
```

### ✅ Do

- **Step display type up gradually:** `text-3xl xs:text-4xl sm:text-5xl lg:text-6xl`.
  Jumping straight to a large `sm:` value overflows the intermediate widths nobody tests.
- **Split vendor and standard pseudo-elements into separate rule blocks.** Grouped in one
  selector list, an engine that doesn't recognise one **drops the whole declaration** — it
  vanishes from the built CSS silently. Verify it appears in `dist/_astro/*.css`.
- **Scope motion to `.js`.** `.reveal` / `.stagger` hidden states apply only under a `.js`
  class set by an inline script in `<head>`, with an IntersectionObserver fallback. Without
  that, a JS failure leaves sections permanently blank.
- **Check contrast at definition time** and note it in the config:
  `graphite: '#6A6459', // Checked ≥4.5:1 on #F7F4EE`.

### ❌ Don't

- **Never `focus:outline-none`.** It once made the only conversion form keyboard-invisible
  across all 13 fields. There is no acceptable use. If the default ring is ugly, restyle it.
- **Never let motion gate content.** Animation may reveal; it may never be the reason
  content exists in the DOM but isn't visible.
- **Don't apply `overflow-wrap: break-word` to display type.** It fixes overflow by
  splitting words mid-glyph. Fix the type scale instead.
- **Don't test only 375 and 1440.** See below.

### Responsive: sweep the intermediate widths

```
320 · 375 · 414 · 480 · 600 · 768 · 834 · 1024 · 1280 · 1440 · 1920
```

Overflow appears *and disappears* as breakpoints engage. **The worst offender is 768px**,
where a multi-column grid first engages but the columns are still narrow. Testing only the
two obvious widths repeatedly missed real breakage.

Diagnose overflow with scroll metrics, not bounding rects — rects get clipped by ancestors
and hide the culprit:

```js
[...document.querySelectorAll('body *')].filter(el => el.scrollWidth > el.clientWidth)
```

---

## 4. Asset & image management

### The hard rule from this client, generalisable to any product photography

**No rug may be cropped. Ever. All four corners inside the frame.**

This constrains the *design*, not just the prompts — and that's the part that gets missed:

- ❌ No full-bleed product photography
- ❌ No `object-fit: cover` on a product image
- ❌ No tight aspect-ratio container that clips one
- ✅ Products sit as complete plates on a ground

Whenever a client gives a rule about their product's presentation, **trace it into the CSS
constraints it implies** before accepting a layout that violates it.

### Generated imagery

```
POST https://openrouter.ai/api/v1/images
body: {"model": …, "prompt": …, "aspect_ratio": "16:9", "n": 1}
```

Measured on identical prompts (16:9):

| Model | Cost | Time |
|---|---|---|
| Seedream 4.5 | 4p | 11s |
| FLUX 2 Pro | 4.5p | 23s |
| GPT-Image-2 | 13p | 102s |
| Gemini 3 Pro | 13.5p | 39s |

- **Use `input_references`.** Supported on nearly every model. Feed a real photograph so
  generated images inherit real material and light — and so the whole set stays consistent.
- **Prompt for scale explicitly.** "A rug in a light-filled interior" produces room shots
  where the product is small and the wall dominates. That is what broke the original hero.
  Say the product fills the frame, shot low, bold saturated colour, raking light.
- **Don't reduce the image count to dodge empty slots.** Fill the slots.

### Screenshots

**Capture at viewport size and scroll — never full-page.** Full-page captures get
downscaled ~4× and make real content look blank, which has caused false "it's broken"
conclusions more than once.

---

## 5. Troubleshooting & gotchas

### Astro: interpolation inside a quoted attribute ships literally

Found in production on `/privacy`, on the GDPR-required deletion route:

```astro
<!-- ❌ ships the literal string href="mailto:{site.company.email}" -->
<a href="mailto:{site.company.email}">{site.company.email}</a>

<!-- ✅ -->
<a href={`mailto:${site.company.email}`}>{site.company.email}</a>
```

The link *text* renders correctly, so it looks right in a screenshot. No error is raised.
Grep the **built** output after any build — a `{` inside an attribute value in `dist/`
means it never interpolated:

```bash
grep -rno '="[^"]*{[a-zA-Z_$][^"]*"' dist/ --include='*.html'   # expect 0 hits
```

Run it against `dist/`, not `src/` — in source, JS template literals inside `<script>`
blocks are legitimate matches and drown the signal.

### Build and dependency traps

| Trap | Symptom | Fix |
|---|---|---|
| `@astrojs/sitemap` > 3.2.1 | Crashes on Astro 4 | Pin to `3.2.1` |
| Stale `dist/` | Tests pass against code you already changed | `npm test` runs `astro build` first |
| Tests via `file://` | Absolute `/_astro/…` paths don't load; every visual assertion tests an unstyled page | Serve it (`astro preview`) |

### Third-party service traps

- **Cloudflare 403s default headless Chromium.** Web3Forms rejects it. Pass a realistic
  user agent **and** `--disable-blink-features=AutomationControlled`.
- **Supabase free projects auto-pause after ~a week idle**, and a paused project returns
  **no DNS at all**. That looks exactly like a typo in the hostname; it cost half an hour
  to diagnose once.
- **Storage objects cannot be deleted with SQL.** `storage.protect_delete()` refuses it by
  design, so files never get orphaned. Use the dashboard, the Storage API with a
  service-role key, or the CLI.
- **An empty `[]` from an empty table proves nothing about security.** Test it properly:
  insert a row as `anon`, then try to read it. Note that a `204` on an anon DELETE means
  "zero rows matched", not "deleted".
- **Revoke the default anon SELECT grant** as well as setting RLS. Reads then fail 401 at
  the grant level before RLS is consulted, and the table stops appearing in the GraphQL
  schema.

### Context economics on visual builds

Measured 2026-08-11: file and image reads accounted for **~2.1M tokens in one session,
roughly double everything else combined.**

- Every screenshot or generated image you read costs **~3–4 k tokens**. Read the ones that
  decide something.
- Surveying a batch? Montage them into one read:
  `montage a.png b.png -tile 4x2 -geometry 460x300 out.jpg`
- Use `offset`/`limit` on long files. `grep -n` to locate, then read the range.
- **Never re-read a file you just edited.** Edit fails loudly if it didn't apply, so a
  verification read tells you nothing and costs full price.

---

## 6. Developer workflow & code hygiene

### Verification is a rendering step, not a reading step

Before saying anything works:

1. `npm test` — builds, then asserts in a real browser.
2. Screenshot at viewport size, and **look at it**.
3. For anything responsive, sweep the 11 widths.
4. For anything legal or compliance-bearing, grep the **built** output, not the source.

### The QA rule that changes outcomes: the tester must not be the coder

An agent that wrote the code cannot fairly test it — it shares the assumptions that
produced the bug, so it writes the test the bug passes. Enforce it structurally rather than
by instruction:

- Spawn a **fresh** context, never a fork of the coding context.
- Deny reads of the implementation at the permission layer, not in the prompt
  (`.claude/qa-blindfold.json` here). A sentence is a request; a deny rule is a wall.
- Feed it **only** the specification, and never a spec the coding agent authored.
- **The QA agent reports failures; it does not fix them.** Allowed to patch, it will patch
  until its own test passes, and you learn nothing.
- Known hole: a shell can still `cat` a file. Deny rules on `Bash` are trivially routed
  around — check the transcript.

### Naming and structure

- Components `PascalCase.astro`, grouped by scope (`global/`, `home/`, `ui/`).
- Data files lowercase (`site.json`, `pricing.json`, `faq.ts`).
- Docs `SCREAMING-KEBAB.md` for governance (`CLAUDE.md`, `COMPLIANCE.md`,
  `NOTES-codebase.md`), lowercase for guides.
- Keep `CLAUDE.md` short — split traps into `NOTES-codebase.md` or it stops being read.

### Comment the non-obvious decision, not the obvious code

Every "why is this weird" gets a comment naming the failure it prevents:

```js
// Family names must match what fontsource registers, or the browser
// silently falls back to Arial. Verify in node_modules before changing.
```

Without it, the next session "cleans it up" and reintroduces the bug. On this repo that
happened often enough to be the default assumption.

### Never invent a fact and ship it

An earlier session invented a price of £1,250/m² and shipped it to the rate card **and to
the JSON-LD that AI engines quote**. If a number, date or address isn't confirmed:
`[bracket it]`, say so, and keep it out of the build. `[Trading address]` rendering on a
live page is a correct current state, not a bug.

### Compliance is a build concern, not a copy concern

On any commercial site, know which rules carry **strict liability** before writing markup.
Here: no fabricated testimonials, reviews or ratings (DMCC Act 2024 — enforced by the CMA,
"it was only a placeholder" is not a defence); no `aggregateRating` or `Review` in
structured data; no "Ltd" before Companies House registration exists (Companies Act 2006
s.65); no VAT claims when not registered.

Two structural habits follow:

- **Headline prices must be genuinely achievable.** A "from" price nobody can obtain is
  drip pricing. Keep a real example you'd actually sell at the headline rate. Use
  `minPrice` in JSON-LD, never `price`.
- **Material information may not be collapsed.** Anything that materially affects the
  purchase decision must sit outside any accordion or FAQ. Assert it:
  `element.closest('details') === null`.

### Git

- Commit at the end of any session that changed files — the client's ability to see and
  undo the work depends on it.
- Never `reset --hard`, force-push, rewrite history, or delete the client's documents.
- Commit messages say **why**, and name the failure being prevented.
