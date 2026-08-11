# Agents — how to use subagents on Harrow & Thread

The point of a subagent here is **not** parallelism. It is to get a second pair of eyes
that has not already convinced itself the work is correct.

An agent that wrote the code cannot fairly test the code. It shares the assumptions that
produced the bug, so it writes the test that the bug passes. That is the whole reason this
file exists.

---

## The blind QA routine

Use it whenever a change needs to be *verified*, not just written: the enquiry pipeline,
the forms, the structured data, the compliance-sensitive copy, anything with a contract.

### 1. The blindfold — context isolation

The QA agent never sees the implementation. Spawn it fresh (`subagent_type: "Explore"` or
`"general-purpose"` — **not** `"fork"`, a fork inherits your context and defeats the point),
and give it only the spec.

**Enforce the blindfold, don't ask for it.** A sentence in a prompt is a request; a deny
rule is a wall. `.claude/qa-blindfold.json` denies `Read` on `src/**` and the config files,
and `Edit` on the same — so the QA agent physically cannot read the code or fix it. Launch
the QA session with:

```bash
claude --settings .claude/qa-blindfold.json
```

Verified working: with that file loaded, a read of `src/pages/index.astro` is refused
before the tool runs.

**Its one hole: `Bash` can still `cat` a file.** Deny rules on shell commands are trivially
routed around (`cat`, `sed`, `grep`, `<`), so don't pretend that half is sealed. Scan the
QA agent's transcript for shell reads of `src/` before you trust its report.

Do not put these denies in `.claude/settings.local.json` — that file loads for *every*
session, and it would blindfold the coding agent too.

**The spec files on this project are the client's documents, never a Claude-authored one:**

- `harrowandthread_core_Design.md` — the brief
- `COMPLIANCE.md` — the legal contract the site must satisfy
- `large_scale_luxury_rugs_mansion_guide.md` — positioning (mind the caveats in `CLAUDE.md` §1)
- the "Settled" section of `CLAUDE.md` — prices, tiers, no-cropped-rugs, trade placement

A spec written by the agent under test is not a spec. That failure has already happened
once on this project (see `CLAUDE.md` §1).

### 2. Black-box test generation

The agent tests contracts — input in, expected output out — because it does not know how
anything works inside.

- **Happy paths first.** The behaviour the client actually asked for.
- **Then chaos.** Null and undefined, wrong types (string where a number is expected),
  oversized payloads, empty arrays, missing keys, absent files, duplicate submits.

### 3. The execution wall — Playwright in a real browser

The QA agent may write test files under `tests/` and run them. It may not edit anything
under `src/`.

**This is a website, so almost every real check needs a real browser.** `CLAUDE.md` §5 is
the reason: the whole site fell back to Arial for several sessions because people verified
by reading config instead of rendering. A test that greps the built HTML would not have
caught it. A test that reads `getComputedStyle` does.

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
  Cloudflare 403s default headless Chromium on Web3Forms. Without these the enquiry-form
  tests fail for a reason that has nothing to do with the code.

What a browser-based black-box test can actually assert here: computed styles and fonts,
that no rug image is cropped (`object-fit`, and all four corners inside the frame — the
hard client rule), that every "from" price renders the word *from*, that JSON-LD parses and
uses `minPrice`, that the enquiry form's required fields reject empty and malformed input,
that no testimonial or rating markup exists anywhere (`COMPLIANCE.md`), and that a form
submission reaches `/enquire/success`.

Screenshots count as evidence; `page.screenshot()` into the scratchpad, then look at it.

**The enquiry form is tested with the backend stubbed** (client decision, 2026-08-11).
Intercept in the browser so nothing reaches Supabase or Web3Forms — no junk rows in
`enquiries`, no real emails:

```js
await page.route('**/*.supabase.co/**', r => r.fulfill({ status: 201, body: '[]' }));
await page.route('**/api.web3forms.com/**', r => r.fulfill({ status: 303, headers: { location: '/enquire/success' } }));
```

The adversarial cases are about our own validation, and a round-trip to a live database
adds nothing to them. The real pipeline was proven end to end in a live browser on
2026-08-11.

The cost of stubbing is drift: change the schema or the form and the stub keeps passing
against a fiction. So keep **one** live end-to-end test in the suite marked
`{ skip: true }`, and run it deliberately after any schema or form change — not on every
`npm test`.

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

---

## The rest of the agent rules on this project

- **Do not spawn agents the client did not ask for.** Every fresh agent starts cold and
  re-derives context this session already has. Blind QA is the case where that cost buys
  something; "let me farm this out" is not.
- **A subagent's verdict is not authorisation.** It cannot approve a price change, a copy
  change, or a design change — see `CLAUDE.md` §3. Bring its report to the client.
- **A quality score an agent generated is not evidence.** Only a rendered screenshot or a
  real HTTP response is (`CLAUDE.md` §5).
- **Agents inherit the hard rules.** Ponytail (§2), never invent a fact (§4), never edit
  `~/.claude/settings.json` (§7). State them in the prompt; a fresh agent has not read them.
