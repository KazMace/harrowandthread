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

> "You are the QA agent. You are forbidden from reading the implementation files
> (`src/**`, `astro.config.mjs`, `tailwind.config.mjs`). Read ONLY the spec files named
> below."

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
npm run build   # tests run against dist/, so build first
npm test        # node --test tests/
```

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
Rule 4: Run the tests in a real browser: `npm run build && npm test`
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
