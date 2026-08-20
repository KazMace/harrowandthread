# Harrow & Thread — how to work on this project

## Where the facts live

Each fact has one home. This file is not it.

| What | Where |
|---|---|
| The brief | `harrowandthread_core_Design.md` — rough, contradicts itself, still the brief |
| Positioning | `large_scale_luxury_rugs_mansion_guide.md` — its §8/§18 thesis (*the rug is designed for the room and must look necessary to it*) is the spine of the site |
| Legal constraints | `COMPLIANCE.md` — read before touching copy or structured data |
| Prices | `pricing.json` — authoritative, including the rationale in its `_note` |
| Build state, open decisions | `STATUS.md` |
| CSS / Tailwind / responsive traps | `NOTES-codebase.md` |
| Subagents | `AGENTS.md` — read before spawning any |
| Client decisions and history | the project memory system |

⚠ The positioning guide was written for dealers in **antique hand-knotted** rugs. Ignore its
knot density, reverse-inspection, antique-category and provenance advice — all of it breaches
`COMPLIANCE.md` and none of it applies to hand-tufted work.

⚠ **A Claude-authored document is never a spec.** An earlier session wrote its own, claimed it
superseded the client's brief, and later sessions believed it. That is how the requested
homepage accordions never got built and an invented palette became "the design system".

## The rules that are genuinely hard

1. **Never invent a fact and ship it.** An earlier session invented £1,250/m² and shipped it to
   the rate card *and* to the JSON-LD that AI engines quote. If a number, date or address is
   not confirmed: `[bracket it]`, say so, keep it out of the build.
2. **The legal lines.** No testimonials, reviews or ratings (DMCC Act 2024, strict liability).
   No "Ltd" while unincorporated (Companies Act 2006 s.65). No VAT claims — not registered.
3. **No rug may be cropped. Ever.** All four corners inside the frame. This constrains the
   *design* as much as the image prompts: no full-bleed rug photography, no `object-cover` on
   a rug image, no aspect-ratio container that clips one.
4. **Don't decide what's theirs to decide.** Ask before adding, removing, reordering or
   reversing anything the client specified, and before touching prices, the design system or
   the enquiry form. A quality score you generated yourself is not authorisation.
5. **Never edit `~/.claude/settings.json`.** Read only — an earlier session broke it and the
   client repaired it by hand.
6. **Never print a full secret — API key, deployment URL, token — into chat or tool output.**
   Happened three times on 2026-08-20 reading `.env` and diagnosing a live URL. To check a
   secret without displaying it: `grep -c`, `awk` field counts, a suffix check, or comparing
   just the last few characters.
7. **Look at it before saying it works.** Screenshot in a real browser. The whole site fell
   back to Arial for several sessions because people verified by reading config.
8. **Commit at the end of any session that changed files.** Never `reset --hard`, force-push,
   rewrite history, or delete the client's `.md` files.

If you think the client is wrong, say so in two sentences, then do what they asked unless they
say otherwise.

## Build the laziest thing that works

Before writing anything, stop at the first rung that holds:

1. **Does this need to exist at all?** Speculative need → skip it and say so in one line.
2. **Already in this codebase?** Reuse it. This repo once had one grid pattern copied 22 times.
3. **Standard library or native platform feature?** CSS over JS, `<details>` over a custom
   accordion, a DB constraint over app code.
4. **An already-installed dependency?** Never add one for what a few lines can do.
5. Only then: the minimum that works.

Lazy means efficient, not careless — validation, security and error handling stay intact.

`/ponytail`, `/ponytail-review` and `/ponytail-audit` are installed and worth reaching for on a
coding task. The ladder above applies whether or not you load them.

## Settled — do not re-litigate

- **Pricing:** three "from" tiers, rates in `pricing.json`. Every rate renders with the word
  *from*; JSON-LD uses `minPrice`, never `price`. The client overrode a VAT-margin concern
  knowingly.
- **Price position:** stays as the lower "Rates" section on `/`.
- **Trade:** `/trade` is linked from the homepage trade strip
  (`src/components/home/TradeStrip.astro`) and stays indexed. Not in the nav. Avoid "trade
  specialist" phrasing.
- **Images:** generated via OpenRouter (`POST /api/v1/images`, key in `.env`). Do not reduce the
  image count to dodge the empty-slot problem — fill the slots.
