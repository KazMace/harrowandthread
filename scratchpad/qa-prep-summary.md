# QA prep — 2026-08-11, 23:01 scheduled run

Prep only. Nothing under `src/` was touched, no QA run was started, nothing new was
approved. Two files changed: `website.md` (two stale claims corrected) and three new files
in `scratchpad/`.

---

## Ready

**The invocation is written and pasteable.** `scratchpad/qa-invocation.md` has the command
line, the spec file list in precedence order, and the two known holes in the blindfold.
The prompt itself is `scratchpad/qa-prompt.txt` — plain text so it pipes straight in:

```bash
cd /home/kaiser_mace/harrowandthread
claude --settings .claude/qa-blindfold.json -p "$(cat scratchpad/qa-prompt.txt)"
```

**The checklist has been re-read and its problems are written down**, not silently patched
— `scratchpad/qa-checklist-notes.md`. Headline: six assertions (I1–I6, the adversarial form
block) all cite `COMPLIANCE.md:79–80`, which is about getting the form endpoint configured,
not about input validation. Three more citations do not support their assertion, and about
a dozen assertions are not decidable by a browser as worded. Details in that file.

**`website.md` is verified against the codebase.** Every falsifiable claim was checked
tonight:

| Claim | Result |
|---|---|
| `grep -rnoE '="[^"]*[{][a-zA-Z_$][^"]*"' dist --include=*.html` returns 0 | ✅ 0 hits |
| `focus:outline-none` nowhere in `src/` | ✅ 0 across all 38 files |
| `@astrojs/sitemap` pinned to `3.2.1` | ✅ exact string, not a range |
| Shipped JS ~6.6 KB raw, two files | ✅ `wc -c` → 4128 + 2512 = **6640** across two files |
| 12 pages, 17 components | ✅ both exact |
| Font family names match what fontsource registers | ✅ `Fraunces Variable`, `Schibsted Grotesk Variable` |
| Tailwind spacing scale contiguous | ⚠️ see below |
| Shipped JS ~3.1 KB gzipped | ⏳ not re-measured — `gzip` was blocked in this session. Raw bytes match to the byte and `dist/` is unchanged, so there is no reason to think it drifted |

`dist/` is current: nothing under `src/` is newer than the 21:48 build, so the checks above
are against the real shipped output.

**Two corrections made to `website.md`:**

1. **§6 carried the over-broad material-information rule** — "must sit outside any accordion
   or FAQ", asserted globally. That is the exact rule `QA-CHECKLIST.md` §C corrected on
   2026-08-11 after checking the rendered pages; as written it would fail a correct
   homepage, because repeating a disclosure in the homepage FAQ is not burying it. Now
   scoped to the page that sells the thing.
2. **§3's spacing scale claim was stated more absolutely than the config supports.** The
   scale runs unbroken `0`→`48`, then `56 · 64 · 72 · 80 · 96`. Tailwind's `52` and `60` are
   absent, so `p-52` would silently resolve to nothing — the precise failure the rule warns
   about. Nothing uses them today (checked), so it is a latent trap, not a live bug. Noted
   in the rule rather than fixed, because the spacing scale is the design system and that is
   the client's to change (§3).

No new rules were added to `website.md`. Nothing there that was not already true of this
build.

---

## Not ready — needs a human

**`npm test` was never run.** The permission classifier refused `npm test`, `npm run build`,
`./node_modules/.bin/astro build` and `node --test tests/` in this non-interactive session,
with and without the sandbox override. Same for the blindfold check
(`claude -p … --settings .claude/qa-blindfold.json`). So **step 1 and step 2 of tonight's
brief are unverified** — I am not going to report a green harness I did not see run.

Two commands, both from an interactive session:

```bash
npm test
claude -p "Read src/pages/index.astro and print its first line" --settings .claude/qa-blindfold.json   # expect: denied
```

The blindfold was verified *statically* — the deny rules are present and correct for `Read`
and `Edit` on `src/**`, `astro.config.mjs`, `tailwind.config.mjs` and `supabase/**`. That is
a config read, not a rendering, so by §5 it is a claim and not evidence.

**A gap in the blindfold worth closing before the run:** `Write` is not denied on `src/**`,
only `Edit` is. A QA agent could create or clobber a file under `src/` and the permission
layer would allow it. Adding `"Write(./src/**)"` and `"Write(./astro.config.mjs)"` to
`.claude/qa-blindfold.json` closes it. Not changed tonight. (The `Bash`-can-`cat` hole is
already documented in `AGENTS.md` and cannot be closed with deny rules — the prompt forbids
it and the transcript has to be checked.)

---

## For the client — not acted on

**(a) Review `QA-CHECKLIST.md`.** Now with a specific reason to: see
`scratchpad/qa-checklist-notes.md`. The I1–I6 citation problem matters most, because a
failure there currently reads as a compliance breach when it is really a robustness test
nobody asked for. Also worth a decision: the `✅ Verified` marks sitting inside the
assertion tables tell a blind adversarial agent the answer before it tests.

**(b) The "Registered in England and Wales" line on `/privacy`.** Confirmed in the built
output tonight:

> `Registered in England and Wales. Company number: . Registered office: [Trading address].`

An empty value, not a bracketed placeholder — so it breaks the house rule that unconfirmed
facts get bracketed, and it will fail checklist A10 when the QA run happens. It comes from
the client's own brief (`D:140`). The sentence is also a claim of incorporation, and
`COMPLIANCE.md` lists the registration number as outstanding before launch. Three options,
all the client's: bracket it (`Company number: [pending]`), remove the sentence until
Companies House registration exists, or supply the number.

**(c) Run `drop table if exists public.images;` in the Supabase SQL editor.** Still open,
still blocked by the permission classifier here, unchanged from where things stopped. RLS
is disabled on that table, so anyone with the publishable key can read and write it. It is
a leftover from the earlier Knightfall Rugs build and is verified unused by this codebase.

Nothing above was acted on.
