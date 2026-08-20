# Build state

Session state, read on demand. Moved out of `CLAUDE.md` on 2026-08-12 — it was loading into
every session before anyone typed a word.

---

## Where work stopped (2026-08-20)

**The enquiry backend was replaced.** Supabase + Web3Forms are gone from the codebase.
Root cause: Supabase's free plan auto-paused (see the 2026-08-11 trap below — it happened
for real this time), and even once restored, the photo link in the notification email
couldn't be made clickable at any Web3Forms tier — confirmed against their own public
roadmap, not assumed. The client's call: consolidate on Google, which is already in hand
and doesn't have either problem. New pipeline: `google-apps-script/Code.gs`, a single Web
App that saves photos to Drive (link-sharing, no login to view), appends a row to a Sheet,
and emails an HTML notification with real clickable links. Setup steps for the client are
in `google-apps-script/README.md` — the script needs a Sheet ID and a Drive folder ID
pasted in before it's live; until then the form falls back to a native POST.

Deleted: `supabase/schema.sql`, `.mcp.json`, `.github/workflows/keep-supabase-awake.yml`
(written the same session, never deployed), `tests/enquiry-live.test.mjs` (asserted a
Supabase-specific URL — needs a replacement against the Apps Script endpoint, see
`AGENTS.md`). `tests/enquiry-adversarial.test.mjs` was rewritten for the new one-request
contract. `npm test` was also fixed this session — `node --test tests/` silently ran zero
tests on this Node version; it's now `node --test tests/*.test.mjs`.

**The section below (2026-08-11) is history, not current state** — kept because the traps
in it (Cloudflare, headless Chromium) still apply to whatever replaces Web3Forms's role.

## Where work stopped (2026-08-11, evening) — superseded, see above

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

**`public.images` on the Supabase project — client authorised removal, the harness blocks
it.** Left over from the Knightfall Rugs build on the same Supabase project. RLS is
*disabled*, so anyone with the publishable key can read and write it. Verified unused by
this codebase, and as of 2026-08-20 the codebase doesn't use that Supabase project for
anything at all. Both `drop table` and `alter table … enable row level security` were
refused by Claude Code's permission classifier, which blocks destructive DDL regardless.
Run it in the SQL editor, or — since nothing here uses the project any more — consider
just deleting the whole Supabase project instead; that's the client's call, not mine:

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

**Retired with Web3Forms/Supabase (2026-08-20), kept as institutional memory — the same
shape of trap is likely wherever a free third-party form/auth service sits behind a static
site:**

- Web3Forms needed a native hidden-form POST, not `fetch` — their free tier's CORS
  handling rejected both a JSON `fetch` (preflight) and a FormData `fetch` (no
  `Access-Control-Allow-Origin` on the response).
- Cloudflare 403'd default headless Chromium on Web3Forms; a realistic UA plus
  `--disable-blink-features=AutomationControlled` fixed it. Kept in `tests/smoke.test.mjs`
  regardless, since it's cheap insurance against the same bot-check anywhere else.
- Supabase free projects auto-pause after about a week idle, and a paused project returns
  no DNS at all. Cost half an hour to diagnose once, then happened for real and triggered
  this whole rebuild.

**Current, for the Google Apps Script pipeline:** Apps Script Web Apps can't answer a CORS
preflight either (different mechanism — their hosting 302-redirects to a
`googleusercontent.com` URL, and browsers won't follow a redirect for a preflight
`OPTIONS`). The fix is `Content-Type: text/plain;charset=utf-8` on the `fetch`, which is a
CORS "simple request" and skips preflight entirely. See `AGENTS.md`.
