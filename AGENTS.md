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

### 3. The execution wall

The QA agent may write test files and run them. It may not edit anything under `src/`.

There is no test runner installed and we are not adding one — use Node's built-in
`node --test` (stdlib, rung 3), or drive a real browser with the existing Playwright
pattern in `scratchpad/w3f.mjs`. See `CLAUDE.md` §5: verification on this project means
rendering, not reading config.

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
Rule 4: Run the tests (node --test, or a real browser).
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
