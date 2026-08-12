# Build state

Session state, read on demand. Moved out of `CLAUDE.md` on 2026-08-12 — it was loading into
every session before anyone typed a word.

---

## Where work stopped (2026-08-11, evening)

Direction A is rolled out across all 12 pages. Lighthouse 100/100/100/100 on performance,
accessibility, best practices and SEO — real artifacts, mobile, simulated throttling, not
estimates.

**The enquiry pipeline is live and proven end to end.** Schema applied to project
`hvbqbtmosjbvwolyfkad`; both legs verified in a real browser (Playwright, realistic UA):
storage upload 200, row insert 201, Web3Forms 303, visitor landed on `/enquire/success`. Every
field arrived in the right column, `upload_paths` included. Neither warning line fired.

**Security was verified empirically, not assumed.** An empty `[]` from an empty table proves
nothing, so the test was: insert a row as anon, then try to read it. The row was invisible to
anon and survived an anon DELETE (204 means "zero rows matched", not "deleted"). The default
anon SELECT grant was then revoked, so reads fail 401 at the grant level before RLS is
consulted, and the table no longer appears in the GraphQL schema.

`enquiries` is back to **0 rows**. Three files remain in the `enquiry-uploads` bucket (two test
uploads and an 8-byte `probe.png`). Storage objects cannot be deleted with SQL — Supabase's
`storage.protect_delete()` trigger refuses it by design, so files never get orphaned. They come
out via the dashboard, the Storage API with a service-role key, or the CLI. Cosmetic; the
bucket is private and nothing reads it.

## Still open

**`public.images` — client authorised removal, the harness blocks it.** Left over from the
Knightfall Rugs build on the same Supabase project. RLS is *disabled*, so anyone with the
publishable key can read and write it. Verified unused by this codebase. Both `drop table` and
`alter table … enable row level security` were refused by Claude Code's permission classifier,
which blocks destructive DDL regardless. Run it in the SQL editor:

```sql
drop table if exists public.images;
```

**Do not implement these unilaterally:**

1. Homepage "Assurances" section — unrequested, added by an earlier session. The client is
   deciding whether to keep it. Leave it in place until they say.
2. Enquiry form fields — the client's instruction was "keep as many as we need, nothing extra".
   Currently 4 required: name, email, commission type, "I am". Whether size and design tier
   should also be required is awaiting confirmation.
3. Whether the client wants Privacy and Terms as full accordions on the homepage rather than
   links. Their brief listed them; links were used instead, because two copies of legal text
   drift apart and it matters which is live. Flagged, not yet answered.

**Done, do not reopen:** homepage accordions (built, native `<details>`), and `.btn-primary`
madder → ink, along with every other decorative use of red. Form error spans and required-field
asterisks deliberately stay red.

## Traps that have already cost time

**Do not "modernise" the Web3Forms call into a `fetch`.** It is a native hidden-form POST on
purpose. `fetch` with JSON fails the CORS preflight on their free tier; `fetch` with FormData
gets no `Access-Control-Allow-Origin`. A native form POST is not subject to CORS at all, which
is why their own documented example is a plain `<form>`. Both fetch versions fail silently from
the visitor's point of view. There is a comment saying so in `enquire.astro`.

**Cloudflare 403s headless Chromium on Web3Forms.** It passes with a realistic user agent plus
`--disable-blink-features=AutomationControlled`. That pattern lives in `tests/smoke.test.mjs`.

**Supabase free projects auto-pause after about a week idle**, and a paused project returns no
DNS at all. That cost half an hour to diagnose once already.
