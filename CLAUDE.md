# Harrow & Thread — rules for any Claude session on this project

## 1. The client's documents are the brief

- **`harrowandthread_core_Design.md`** — the original brief. Rough, contradicts itself in
  places, still the brief.
- **`large_scale_luxury_rugs_mansion_guide.md`** — the client's positioning research.
  Its §8/§18 thesis (the rug is designed *for the room*, and must look necessary to it) is
  the spine of the site. **But it was written for dealers in antique hand-knotted rugs** —
  ignore knot density, reverse inspection, antique categories, and its provenance advice,
  which would breach `COMPLIANCE.md`.
- **`COMPLIANCE.md`** — the legal constraints. Read before touching copy or structured data.

An earlier Claude wrote its own spec, claimed it superseded the client's brief, and later
sessions believed it — that is how the requested homepage accordions never got built and an
invented palette became "the design system". That file has been **deleted**, along with the
superseded `IMAGE_PROMPTS.md` (whose prompts produced the broken hero) and `pending.md`.

If you think the client is wrong, say so in two sentences, then do what they asked unless
they say otherwise.

## 2. Build the laziest thing that works (ponytail)

The client's standing instruction for all coding on this project. Before writing anything,
stop at the first rung that holds:

1. **Does this need to exist at all?** Speculative need → skip it and say so in one line.
2. **Already in this codebase?** Reuse it. Re-implementing what lives a few files over is
   the most common failure here — this repo once had one grid pattern copied 22 times.
3. **Standard library or native platform feature?** CSS over JS, `<details>` over a
   custom accordion, a DB constraint over app code.
4. **An already-installed dependency?** Never add one for what a few lines can do.
5. Only then: the minimum viable solution.

Lazy means efficient, not careless — validation, security and error handling stay intact.

Installed as user skills at `~/.claude/skills/ponytail*` — `/ponytail [lite|full|ultra]`,
`/ponytail-review` (flags over-engineering in the current diff), `/ponytail-audit` (scans
the repo for bloat). **Invoke `ponytail` before any coding task on this project.** The
ladder above applies whether or not the skill is loaded.

## 3. Don't decide what's theirs to decide

Ask before adding, removing, reordering or reversing anything the client specified — and
before touching prices, the design system, or the enquiry form. A quality score you
generated yourself is not authorisation.

## 4. Never invent a fact and ship it

An earlier session invented £1,250/m², shipped it to the rate card and to the JSON-LD that
AI engines quote. If a number, date or address isn't confirmed: `[bracket it]`, say so, keep
it out of the build.

Hard legal lines: no testimonials, reviews or ratings (DMCC Act 2024, strict liability); no
"Ltd" until Companies House registration exists (Companies Act 2006 s.65); no VAT claims —
not registered.

## 5. Look at it before saying it works

Screenshot in a real browser. The whole site fell back to Arial for several sessions
because nobody rendered it, and the "cheap and bitty" problem was only diagnosed once
someone finally took a screenshot. Verify by rendering, not by reading config.

## 6. Commit your work

Git exists here so the client can see and undo changes. Commit at the end of any session
that changed files. Never `reset --hard`, force-push, rewrite history, or delete the
client's `.md` files.

## 7. Never edit `~/.claude/settings.json`

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

## Where work stopped (2026-08-11, evening — READ THIS FIRST AFTER RESTART)

Direction A is rolled out across all 12 pages and Lighthouse is 100/100/100/100 on
performance, accessibility, best practices and SEO (real artifacts, mobile, simulated
throttling — not estimates).

**The enquiry pipeline is half live.** The email leg is PROVEN with a real submission:
Web3Forms delivered every field correctly, including both warning lines. The database leg
is not, because the schema has never been applied.

**Immediate next steps, in order:**

1. **Approve the `supabase` MCP server.** `claude mcp list` shows it as
   *"⏸ Pending approval"* — a project-scoped server needs the user to approve it, which is
   why the tools are not reachable. The user is restarting to do this, then running `/mcp`
   for OAuth.
2. **Apply `supabase/schema.sql`.** 81 lines, idempotent. Creates the `enquiries` table,
   the `enquiry-uploads` storage bucket, and three insert-only RLS policies. Already
   validated against a real submission: every field the form sends has a column, and there
   is deliberately **no SELECT policy** on the table.
3. **Verify the security, do not assume it.** With the publishable key from `.env`:
   `curl "$PUBLIC_SUPABASE_URL/rest/v1/enquiries?select=*" -H "apikey: $PUBLIC_SUPABASE_ANON_KEY"`
   must return 401/403 or empty — never rows. That key ships in the page source.
4. **Re-test the form in a real browser.** Both warning lines should disappear, a row
   should land in `enquiries`, and an attached image in `enquiry-uploads`.

**Do not "modernise" the Web3Forms call into a fetch.** It is a native hidden-form POST on
purpose. fetch with JSON fails the CORS preflight on their free tier; fetch with FormData
gets no Access-Control-Allow-Origin. A native form POST is not subject to CORS at all,
which is why their own documented example is a plain `<form>`. Both fetch versions fail
silently from the visitor's point of view. There is a comment saying so in `enquire.astro`.

**Testing notes.** Cloudflare 403s headless Chromium on Web3Forms; it passes with a
realistic user agent plus `--disable-blink-features=AutomationControlled` (see
`scratchpad/w3f.mjs` pattern). Supabase free projects auto-pause after ~a week idle and a
paused project returns no DNS at all — that cost half an hour to diagnose once already.

## Open — do not implement unilaterally

1. Homepage "Assurances" section — unrequested, added by an earlier session. The client is
   deciding whether to keep it. Leave it in place until they say.
2. Enquiry form fields — the client's instruction was "keep as many as we need, nothing
   extra". Proposed required set: name, email, what they're commissioning, size, design
   tier. Currently 4 are required. Awaiting confirmation.
3. Whether the client wants Privacy and Terms as full accordions on the homepage rather
   than links. Their brief listed them; I linked instead, because two copies of legal text
   drift apart and it matters which was live. Flagged to them, not yet answered.

Done today, do not reopen: homepage accordions (built, native `<details>`), and
`.btn-primary` madder → ink (done, along with every other decorative use of red; form
error spans and required-field asterisks deliberately stay red).

## Codebase traps

See `NOTES-codebase.md` before editing CSS, Tailwind config, or anything responsive.
