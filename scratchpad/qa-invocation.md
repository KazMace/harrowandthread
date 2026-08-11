# Blind QA run — ready to paste

Prepared 2026-08-11, 23:01 prep run. **Not run.** Waiting on the client's go.

The prompt lives in `scratchpad/qa-prompt.txt` as plain text so it can be piped straight
into the CLI. One file, not two copies — a markdown fence and a pasteable prompt drift
apart.

---

## The command

```bash
cd /home/kaiser_mace/harrowandthread
claude --settings .claude/qa-blindfold.json -p "$(cat scratchpad/qa-prompt.txt)"
```

Interactive instead, if you want to watch it work and interrupt:

```bash
cd /home/kaiser_mace/harrowandthread
claude --settings .claude/qa-blindfold.json
# then paste the contents of scratchpad/qa-prompt.txt
```

**It has to be a separate `claude` process, not the Agent tool.** A subagent spawned from a
coding session inherits that session's settings, so `--settings` is the only way the
blindfold actually applies. `AGENTS.md` says "not a fork" for the same reason — the point is
a context that has never seen the implementation.

---

## What the blindfold denies

`.claude/qa-blindfold.json`:

| Denied | |
|---|---|
| `Read` | `./src/**`, `./astro.config.mjs`, `./tailwind.config.mjs`, `./supabase/**` |
| `Edit` | `./src/**`, `./astro.config.mjs`, `./tailwind.config.mjs` |

Two gaps, both worth knowing before you trust the report:

1. **`Bash` can still read anything.** `cat`, `sed`, `grep`, `<` — documented in `AGENTS.md`
   and not fixable with deny rules. The prompt forbids it explicitly; scan the transcript
   for shell reads of `src/` before accepting the verdict.
2. **`Write` is not denied on `src/**` — only `Edit` is.** The agent could create or clobber
   a file under `src/` and the permission layer would allow it. The prompt says tests/ only.
   Adding `"Write(./src/**)"` and `"Write(./astro.config.mjs)"` to the deny list would close
   it; not changed tonight because nothing gets edited without the client's say-so.

Also note `tests/smoke.test.mjs` is readable (it is not under `src/`), and it does leak a
little implementation — its `MATERIAL_INFO` regexes were written against the live copy. The
prompt tells the agent to copy the harness shape and none of the assertions.

---

## Spec files handed to the agent

Client documents first. A Claude-authored document is never the spec (`CLAUDE.md` §1).

| # | File | Role |
|---|---|---|
| 1 | `harrowandthread_core_Design.md` | The brief |
| 2 | `COMPLIANCE.md` | The legal contract |
| 3 | `large_scale_luxury_rugs_mansion_guide.md` | Positioning — with the antique-rug caveats stated in the prompt |
| 4 | `CLAUDE.md`, **"Settled" section only** | Prices, tiers, no cropped rugs, trade placement |
| 5 | `QA-CHECKLIST.md` | Derived index. Cites 1–4 line by line; subordinate to them |
| 6 | `AGENTS.md`, **§3 only** | The harness rules |

`QA-CHECKLIST.md` is in the list, and it is Claude-authored — which `AGENTS.md` warns
about. It earns its place only because every line cites a client document, and the prompt
tells the agent the source wins on conflict. See `scratchpad/qa-checklist-notes.md`: some of
those citations do not hold up, and the client should read the checklist before this runs.

---

## Before you run it

- `npm test` must pass on its own first, so a failure in the QA run means the site, not the
  harness. **It could not be run in the 23:01 prep session** — the permission classifier
  refused `npm test`, `astro build` and `node --test` in a non-interactive context. Run it
  once by hand.
- `dist/` is current as of the 21:48 build; no file under `src/` is newer. `npm test`
  rebuilds anyway.
- Supabase is stubbed in-browser, so a paused free project cannot break the run.

## After it finishes

1. Read the transcript for Bash reads of `src/`.
2. Bring the bug report back here. **The QA agent fixes nothing** — that is the whole design.
3. Its verdict authorises no change to prices, copy or the design system (`CLAUDE.md` §3).
