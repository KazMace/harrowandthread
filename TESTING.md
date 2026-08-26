# Testing — the blind QA routine

Moved out of `AGENTS.md` 2026-08-22 so it loads when someone is actually testing, not on
every session. `AGENTS.md` still holds the short list of agent rules and points here.

The point of a subagent here is **not** parallelism. It is to get a second pair of eyes
that has not already convinced itself the work is correct.

An agent that wrote the code cannot fairly test the code. It shares the assumptions that
produced the bug, so it writes the test that the bug passes. That is the whole reason this
file exists.

---

## The blind QA routine

Use it whenever a change needs to be *verified*, not just written: the enquiry pipeline,
the forms, the structured data, the compliance-sensitive copy, anything with a contract.

**Propose it first.** Spawning a fresh agent has a real cost — a cold context re-deriving
everything this session already knows. Say what you want to verify and why a blind pass is
worth it, get the go-ahead, then run it. Don't spawn it silently.

### 1. The blindfold — context isolation

The QA agent never sees the implementation. Spawn it fresh (`subagent_type: "Explore"` or
`"general-purpose"` — **not** `"fork"`, a fork inherits your context and defeats the point),
and give it only the spec.

**Preferred: enforce the blindfold with a deny rule, not just a prompt.** Launching a second
interactive `claude` CLI session from inside this one isn't something an agent can drive
well, so the in-session route is the default:

- State the deny list directly in the fresh agent's prompt — "do not open any file under
  `src/`, `astro.config.mjs`, `tailwind.config.mjs`, or `google-apps-script/`" — since the
  spawned agent has no way to load `.claude/qa-blindfold.json` itself.
- After it reports, scan its transcript for any shell read of those paths (`cat`, `sed`,
  `grep`, `<` all route around a prompt-only rule) before trusting the result.

If you do want the harder guarantee, `.claude/qa-blindfold.json` denies `Read`/`Edit` on
`src/**` and the config files at the tool level — launch that route with:

```bash
claude --settings .claude/qa-blindfold.json
```

The deny rules bite before the tool runs, not after — a read of `src/pages/index.astro` is
refused rather than returned. Its one hole is the same as above: `Bash` can still `cat` a
file, so scan the transcript regardless.

Do not put these denies in `.claude/settings.local.json` — that file loads for *every*
session, and it would blindfold the coding agent too.

**The spec files on this project are the client's documents, never a Claude-authored one:**

- `harrowandthread_core_Design.md` — the brief
- `COMPLIANCE.md` — the legal contract the site must satisfy
- `large_scale_luxury_rugs_mansion_guide.md` — positioning (mind the caveats in `CLAUDE.md`, "Where the facts live")
- the "Settled" section of `CLAUDE.md` — prices, tiers, no-cropped-rugs, trade placement

A spec written by the agent under test is not a spec. That failure has already happened
once on this project (see `CLAUDE.md`, "Where the facts live").

### 2. Black-box test generation

The agent tests contracts — input in, expected output out — because it does not know how
anything works inside.

- **Happy paths first.** The behaviour the client actually asked for.
- **Then chaos.** Null and undefined, wrong types (string where a number is expected),
  oversized payloads, empty arrays, missing keys, absent files, duplicate submits.

### 3. The execution wall — Playwright in a real browser

The QA agent may write test files under `tests/` and run them. It may not edit anything
under `src/`.

**This is a website, so almost every real check needs a real browser.** A test that greps the
built HTML cannot catch a font falling back to Arial. A test that reads `getComputedStyle`
can. Verify by rendering, not by reading config.

The harness is Node's built-in test runner driving Playwright — no framework, no config
file:

```bash
npm test        # astro build && node --test tests/
```

`npm test` rebuilds first, on purpose. Tests drive the built site in `dist/`, and a stale
build means you are testing code you already changed — which passes, and tells you nothing.

`tests/smoke.test.mjs` is the working template. Copy its shape: it starts `astro preview`,
launches Chromium, and asserts against the rendered page. Two details in it are not
optional —

- **Serve the site, never `file://`.** Astro emits absolute asset paths (`/_astro/…`), so
  under `file://` the stylesheet silently does not load and every visual assertion tests an
  unstyled page.
- **Use a realistic user agent plus `--disable-blink-features=AutomationControlled`.**
  Left over from the Web3Forms era (Cloudflare 403s default headless Chromium) but kept —
  cheap insurance against the same class of bot-check anywhere else in the stack.

What a browser-based black-box test can actually assert here: computed styles and fonts,
that no rug image is cropped (`object-fit`, and all four corners inside the frame — the
hard client rule), that every "from" price renders the word *from*, that JSON-LD parses and
uses `minPrice`, that the enquiry form's required fields reject empty and malformed input,
that no testimonial or rating markup exists anywhere (`COMPLIANCE.md`), and that a form
submission reaches `/enquire/success`.

Screenshots count as evidence; `page.screenshot()` into the scratchpad, then look at it.

**The enquiry form is tested with the backend stubbed.** Since 2026-08-20 the backend is a
single Google Apps Script Web App (`google-apps-script/Code.gs`), replacing Supabase +
Web3Forms — see `STATUS.md` for why. Intercept in the browser so no real Drive uploads,
Sheet rows, or emails happen:

```js
await context.route('**://script.google.com/**', r =>
  r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }));
```

**Two traps carried over from the old suite, both still real:**

1. **`fulfill()`, never `abort()`.** Aborting a request the page is waiting on tends to
   surface as the wrong kind of failure — assert on what the page actually renders, not on
   the network error text.
2. **Route on the `context`, not the page**, so a navigation-triggered request is still
   covered.

**One request, not three.** The old pipeline made a storage POST, a database POST, and a
Web3Forms POST, and a failure in any leg needed its own assertion. Now there's exactly one
`fetch()` (`enquire.astro`'s submit handler) carrying fields *and* downscaled images as a
single `text/plain` JSON body, and the whole outcome is `{ ok: true | false }`. Assert
against the parsed body, not string-matching a form-encoded payload:

```js
const body = JSON.parse(sent[0]?.body ?? '{}');
```

The live submission path is one call: `POST https://script.google.com/macros/s/<id>/exec`.

**`text/plain`, not `application/json`, is deliberate — don't "fix" it.** Apps Script Web
Apps can't answer a CORS preflight (their hosting 302-redirects to a
`googleusercontent.com` URL, and browsers won't follow a redirect for a preflight `OPTIONS`).
`text/plain` makes it a CORS "simple request", which skips preflight entirely. If you see a
CORS error on this endpoint, check the `Content-Type` header first before assuming the
script's `doOptions()` needs work.

### ⚠ The honeypot will fake a passing test

`/enquire` carries a hidden honeypot field, `name="website"`, inside a
`class="hidden" aria-hidden="true"` wrapper. `enquire.astro:468` bounces any submission that
fills it **straight to `/enquire/success` without submitting anything**:

```js
if (fd.get('website')) { window.location.assign('/enquire/success'); return; }
```

That is correct anti-spam behaviour — and a trap for an adversarial agent. **An agent that
fills every field it can find will fill the honeypot, land on `/enquire/success`, and report
the form as working when nothing was sent.** A green result on this rung obtained that way
is a false pass.

**Rule: never fill `website`.** And a good adversarial suite should include the inverse
test — fill the honeypot deliberately and assert that **no** network request is made.

The adversarial cases are about our own validation, and a round-trip to a live database adds
nothing to them.

The cost of stubbing is drift: change the script or the form and the stub keeps passing
against a fiction. So keep **one** live end-to-end test in the suite marked
`{ skip: true }`, and run it deliberately after any script or form change — not on every
`npm test`. (`tests/enquiry-live.test.mjs` filled this role for the Supabase pipeline and
was deleted with it on 2026-08-20 — recreate its equivalent against the Apps Script `/exec`
URL before the next backend-touching change, rather than skipping this rung. Tracked as an
open item in `STATUS.md`.)

### 4. The no-fix feedback loop

**The QA agent does not fix anything.** On failure it reports only:

> Test *name* failed. Input sent: *X*. Expected: *Y*. Actually got: *Z*.

That report comes back to the coding context, which does the fix. If the tester is allowed
to patch the code, it will patch the code until its own test passes, and you have learned
nothing.

---

## Copy-paste QA prompt

```
Role: You are an adversarial QA testing agent.

Rule 1: You are strictly forbidden from reading the implementation code. Do not open
        any file under src/, or astro.config.mjs, or tailwind.config.mjs.
Rule 2: Read ONLY the specification files listed below.
Rule 3: From the specs alone, write a test suite covering the happy paths and the
        adversarial cases — nulls, wrong data types, boundary limits, oversized and
        empty inputs, missing keys.
Rule 4: Run the tests in a real browser: `npm test`
        (node --test + Playwright; copy the shape of tests/smoke.test.mjs).
Rule 5: If a test fails, DO NOT edit the source. Output a bug report: what input was
        sent, what was expected, what actually returned.

Spec files: <list them>

Start by reading the spec files.
```
