// I3, I4 and I8 from QA-CHECKLIST.md — the three adversarial cases the overnight
// run did not reach. Backend stubbed per AGENTS.md: nothing leaves the browser, so
// no junk rows in `enquiries` and no real notification emails.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

// smoke.test.mjs owns 4321 and `node --test` runs test files in parallel processes.
const PORT = 4322;
const BASE = `http://localhost:${PORT}`;
// Cloudflare 403s a default headless UA on Web3Forms — see CLAUDE.md.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';

let server, browser, tmp;

before(async () => {
  server = spawn('npm', ['run', 'preview', '--', '--port', String(PORT)], { stdio: 'ignore' });
  browser = await chromium.launch({ args: ['--disable-blink-features=AutomationControlled'] });
  tmp = mkdtempSync(join(tmpdir(), 'ht-qa-'));
  for (let i = 0; i < 40; i++) {
    try { await fetch(BASE); return; } catch { await new Promise(r => setTimeout(r, 250)); }
  }
  throw new Error('astro preview never came up — run `npm run build` first');
});

after(async () => { await browser?.close(); server?.kill(); });

const OK_SUPABASE = { status: 201, contentType: 'application/json', body: '[]' };

// Route on the CONTEXT, not the page, so the native form POST is covered too.
// fulfill(), never abort() — aborting navigates to chrome-error:// and every later
// assertion then fails for the wrong reason. Both traps are documented in AGENTS.md.
async function openForm(supabase = OK_SUPABASE) {
  const ctx = await browser.newContext({ userAgent: UA });
  const sent = [];
  const record = (r, response) => {
    sent.push({ url: r.request().url(), body: r.request().postData() });
    return r.fulfill(response);
  };
  await ctx.route('**://*.supabase.co/**', r => record(r, supabase));
  // The location MUST be absolute. A relative one resolves against api.web3forms.com,
  // so the browser then fetches their real server and Cloudflare 403s it — a leak out
  // of the stub, and a phantom error in the report.
  await ctx.route('**://api.web3forms.com/**', r =>
    record(r, { status: 303, headers: { location: `${BASE}/enquire/success` } }));

  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  // A bare "Failed to load resource: 403" tells you nothing about which resource.
  page.on('response', r => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url()}`);
  });
  page.on('console', m => {
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(`console: ${m.text()}`);
  });
  await page.goto(`${BASE}/enquire`, { waitUntil: 'networkidle' });
  return { page, sent, errors };
}

// The required set only. NEVER fill `website` — the honeypot bounces the visitor to
// /enquire/success without submitting, which fakes a pass (AGENTS.md). I8 is the
// one deliberate exception.
async function fillRequired(page) {
  await page.fill('#name', 'QA Adversarial');
  await page.fill('#email', 'qa@example.com');
  await page.selectOption('#iam', 'private-client');
  await page.selectOption('#commission-type', 'rug');
}

async function submit(page) {
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500); // observe the outcome; do not assume there is one
}

// Everything the visitor can actually perceive after a submit. Scoped to the form —
// the cookie banner is also an aria-live region and would otherwise be counted.
const outcome = page => page.evaluate(() => ({
  url: location.pathname,
  visible: [...document.querySelectorAll('#enquiry-form [id^="err-"], #enquiry-form [aria-live], #enquiry-form [role="alert"]')]
    .map(e => e.textContent.trim()).filter(Boolean),
  submitDisabled: document.querySelector('button[type="submit"]')?.disabled ?? null,
}));

// "Unhandled" needs defining before testing, per the note on I3. Four different things
// get called that, and the silent no-op is the one that hurts. The submission is
// deliberately designed never to lose a lead: when storage or the database fails, the
// notification email carries an explicit WARNING line. So the assertion is not "nothing
// went wrong" — it is that whatever went wrong reaches a human.
// The notification is a form-encoded POST body: decode it, or every phrase you look
// for is sitting there as `failed+to+upload` and quietly fails to match.
const notification = sent =>
  decodeURIComponent((sent.find(s => s.url.endsWith('/submit'))?.body ?? '').replace(/\+/g, ' '));
const uploads = sent => sent.filter(s => s.url.includes('/storage/v1/object/')).length;

test('I3 — upload failures are reported to the client, not silently dropped', async () => {
  const zero = join(tmp, 'zero.png');
  const huge = join(tmp, 'huge.png');
  writeFileSync(zero, Buffer.alloc(0));
  writeFileSync(huge, Buffer.alloc(55 * 1024 * 1024)); // over the form's own 10MB cap
  const five = Array.from({ length: 5 }, (_, i) => {
    const p = join(tmp, `ref${i}.png`);
    writeFileSync(p, Buffer.alloc(64));
    return p;
  });

  const cases = [
    // label, files, supabase stub, expected: uploads attempted, warning required
    ['zero-byte', [zero], OK_SUPABASE, { attempts: 1, warns: null }],
    ['55MB (over the 10MB cap)', [huge], OK_SUPABASE, { attempts: 0, warns: /failed to upload/i }],
    // Observed: 3 uploaded, 2 discarded, and NO warning to either party — `storageFailed`
    // is never set for files trimmed off the end. The page does say "Up to 3 images", so
    // the limit is disclosed; only the discarding is silent. Recorded in QA-CHECKLIST.md,
    // not asserted, because tightening it is the client's call (CLAUDE.md §3).
    ['5 files (over the 3-file cap)', five, OK_SUPABASE, { attempts: 3, warns: null }],
    ['storage and insert return 413', [zero],
      { status: 413, contentType: 'application/json', body: '{"error":"Payload too large"}' },
      { attempts: 1, warns: /could NOT be saved/i }],
  ];

  const failures = [];
  const report = [];
  for (const [label, files, supabase, expect] of cases) {
    const { page, sent, errors } = await openForm(supabase);
    await fillRequired(page);
    await page.setInputFiles('#reference-images', files);
    await submit(page);
    const o = await outcome(page);
    const mail = notification(sent);
    report.push(`  ${label}: url=${o.url} uploads=${uploads(sent)} visible=${JSON.stringify(o.visible)}` +
      `\n      warnings=${JSON.stringify(mail.match(/WARNING[^&]*/g) ?? [])}`);

    // The injected 413 is the fault under test, not a defect.
    const real = errors.filter(e => !/HTTP 413/.test(e));
    if (real.length) failures.push(`${label}: ${real.join('; ')}`);
    if (o.url === '/enquire' && !o.visible.length)
      failures.push(`${label}: silent no-op — no navigation and nothing the visitor can see`);
    if (uploads(sent) !== expect.attempts)
      failures.push(`${label}: ${uploads(sent)} upload attempts, expected ${expect.attempts}`);
    if (expect.warns && !expect.warns.test(mail))
      failures.push(`${label}: notification email carries no warning matching ${expect.warns} — the client is never told`);
    await page.context().close();
  }

  console.log('\nI3 observed:\n' + report.join('\n') + '\n');
  assert.deepEqual(failures, [], `\n  ${failures.join('\n  ')}\n`);
});

test('I4 — wrong types in the size fields are rejected, not coerced silently', async () => {
  const { page, sent, errors } = await openForm();
  await fillRequired(page);

  // size-w/size-h are type="number", so the browser blocks typing. Force the value
  // directly or this test is vacuous — the note on I4 says so explicitly.
  const forced = await page.evaluate(() => {
    const set = (id, v) => { const el = document.getElementById(id); el.value = v; return el.value; };
    return { text: set('size-w', 'abc'), negative: set('size-h', '-50') };
  });

  await submit(page);
  const o = await outcome(page);
  const payload = sent.map(s => s.body ?? '').join(' ');

  console.log(`\nI4 observed:\n  forced values readback=${JSON.stringify(forced)}` +
    `\n  url=${o.url} requests=${sent.length} visible=${JSON.stringify(o.visible)}` +
    `\n  payload=${payload.slice(0, 400)}\n`);

  const failures = [...errors];
  // The browser's own value sanitisation should have emptied the text case.
  if (forced.text !== '') failures.push(`"abc" survived in size-w as ${JSON.stringify(forced.text)}`);
  assert.deepEqual(failures, [], `\n  ${failures.join('\n  ')}\n`);
  // Negative sizes are the open half of I4 — see the skipped test below.
  assert.match(payload, /"size_h":"-50"/, 'the -50 case did not reach the payload as expected');
});

// OPEN FINDING, awaiting the client. min="0" is declared on both size inputs, but the
// form is novalidate, so nothing enforces it and "-50" reaches the database as a string.
// Un-skip once the client decides — the enquiry form is theirs (CLAUDE.md §3), and a QA
// test must not fix what it finds (AGENTS.md §4).
test('I4b — negative sizes are rejected', { skip: 'open finding — see QA-CHECKLIST.md' }, async () => {
  const { page, sent } = await openForm();
  await fillRequired(page);
  await page.evaluate(() => { document.getElementById('size-h').value = '-50'; });
  await submit(page);
  assert.doesNotMatch(sent.map(s => s.body ?? '').join(' '), /-50/);
});

test('I8 — filling the honeypot submits nothing and still lands on success', async () => {
  const { page, sent, errors } = await openForm();
  await fillRequired(page);
  // Hidden field: Playwright refuses to fill it, so set it the way a bot would.
  await page.evaluate(() => { document.querySelector('input[name="website"]').value = 'https://spam.example'; });

  await submit(page);
  const o = await outcome(page);
  console.log(`\nI8 observed:\n  url=${o.url} requests=${sent.length} ` +
    `urls=${JSON.stringify(sent.map(s => s.url))}\n`);

  assert.deepEqual(sent.map(s => s.url), [], 'honeypot submission escaped to the backend');
  assert.equal(o.url, '/enquire/success', 'honeypot submission did not land on /enquire/success');
  assert.deepEqual(errors, []);
});
