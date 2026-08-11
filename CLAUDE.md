# Harrow & Thread — rules for any Claude session on this project

## 1. There is one brief

**`harrowandthread_core_Design.md` is the brief.** The client wrote it. It's rough and
contradicts itself in places. It's still the brief.

`_claude-notes-NOT-A-BRIEF.md` was written by an earlier Claude, claimed to supersede the
client's document, and later sessions believed it. That's how the client's homepage
accordions never got built and how an invented palette became "the design system". It is
background notes on UK law only. **Where they disagree, the client's document wins.**

If you think the client is wrong, say so in two sentences, then do what they asked unless
they say otherwise.

## 2. Don't decide what's theirs to decide

Ask before adding, removing, reordering or reversing anything the client specified — and
before touching prices, the design system, or the enquiry form. A quality score you
generated yourself is not authorisation.

## 3. Never invent a fact and ship it

An earlier session invented £1,250/m², shipped it to the rate card and to the JSON-LD that
AI engines quote. If a number, date or address isn't confirmed: `[bracket it]`, say so, keep
it out of the build.

Hard legal lines: no testimonials, reviews or ratings (DMCC Act 2024, strict liability); no
"Ltd" until Companies House registration exists (Companies Act 2006 s.65); no VAT claims —
not registered.

## 4. Look at it before saying it works

Screenshot in a real browser. The whole site fell back to Arial for several sessions
because nobody rendered it, and the "cheap and bitty" problem was only diagnosed once
someone finally took a screenshot. Verify by rendering, not by reading config.

## 5. Commit your work

Git exists here so the client can see and undo changes. Commit at the end of any session
that changed files. Never `reset --hard`, force-push, rewrite history, or delete the
client's `.md` files.

## 6. Never edit `~/.claude/settings.json`

Read only. An earlier session broke it and the client repaired it by hand.

---

## Settled — do not re-litigate

- **Pricing: three "from" tiers** — Plain from £600/m², Geometric from £900/m², Pictorial
  from £1,200/m². Final rate set at quote. **Every rate renders with "from"**; JSON-LD uses
  `minPrice`, never `price`. The client overrode a VAT-margin concern knowingly.
- **Price position:** stays as the lower "Rates" section on `/`.
- **Trade:** footer only. Not in the nav, not on the homepage. `/trade` stays indexed.
  Avoid "trade specialist" phrasing.
- **Images:** generated via OpenRouter (`POST /api/v1/images`, key in `.env`). Do not reduce
  the image count to dodge the empty-slot problem — fill the slots.
- **NO RUG MAY BE CROPPED. Ever.** Client rule, 2026-08-11. Every rug image must show the
  whole piece, all four corners inside the frame. This constrains the *design* as much as
  the prompts: no full-bleed rug photography, no `object-cover` on a rug image, no tight
  aspect-ratio container that clips one. Rugs sit as complete plates on a ground.

## Where work stopped (2026-08-11)

Three throwaway homepage directions are built at `src/pages/lab/direction-{a,b,c}.astro`
and the client is choosing between them. Comparison page (update this URL, don't make a
new one): `https://claude.ai/code/artifact/97523aaa-ae34-4940-959e-cb9be921f6f4`

Next, in order: (1) research what rugs real mansions and stately homes actually have;
(2) generate mansion-scale imagery per `IMAGE-PROMPT-mansion.md`, feeding the client's
own `/mnt/c/Smash IT 2026/new images/Hero large rug 4.webp` in as `input_references`;
(3) re-screenshot the three directions with it; (4) client picks; (5) roll across all 12
pages and delete `src/pages/lab/` and `public/images/lab/`.

**Scale is the commercial point:** 15×10m at these rates is £90k–£180k. Imagery must
fish for that buyer, not for a 3×2m rug in a suburban lounge.

## Open — do not implement unilaterally

1. Homepage "Assurances" section — unrequested, client deciding whether to keep.
2. Enquiry form fields — proposed required set: name, email, what they're commissioning,
   size, design tier.
3. Homepage accordions at the bottom (the client asked for these; still not built).
4. `.btn-primary` madder red → ink — agreed with the client, still not done.

## Codebase traps

See `NOTES-codebase.md` before editing CSS, Tailwind config, or anything responsive.
