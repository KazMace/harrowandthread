// I3, I4 and I8 from docs/QA-CHECKLIST.md — the three adversarial cases the overnight
// run did not reach. Backend stubbed per docs/TESTING.md: nothing leaves the browser, so
// no real Drive uploads, Sheet rows or emails.
//
// Rewritten 2026-08-20 for the Google Apps Script pipeline (replaced Supabase +
// Web3Forms). One endpoint now, not two: the client POSTs fields + downscaled
// images as a single text/plain JSON body and gets back { ok: true|false }. There
// is no more separate "storage failed but the row saved" state — it's all one
// request, so I3's old per-leg warning assertions don't apply; what replaces them
// is below.
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
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';

let server, browser, tmp;

before(async () => {
  // astro itself, not `npm run` — see smoke.test.mjs.
  server = spawn('node_modules/.bin/astro', ['preview', '--port', String(PORT)], { stdio: 'ignore' });
  browser = await chromium.launch({ args: ['--disable-blink-features=AutomationControlled'] });
  tmp = mkdtempSync(join(tmpdir(), 'ht-qa-'));
  for (let i = 0; i < 40; i++) {
    try { await fetch(BASE); return; } catch { await new Promise(r => setTimeout(r, 250)); }
  }
  throw new Error('astro preview never came up — run `npm run build` first');
});

after(async () => { await browser?.close(); server?.kill(); });

// The real Apps Script reply carries Access-Control-Allow-Origin: *; the stubs match it.
// (fulfill() does not enforce CORS, so this does not test a missing header.)
const CORS = { 'Access-Control-Allow-Origin': '*' };
const OK_GAS = { status: 200, headers: CORS, contentType: 'application/json', body: JSON.stringify({ ok: true }) };

// Route on the CONTEXT, not the page, so any navigation-triggered request is still
// covered. fulfill(), never abort() — aborting a request the page is waiting on
// tends to surface as the wrong kind of failure. Both traps carried over from the
// Supabase-era suite, still true here.
async function openForm(gas = OK_GAS) {
  const ctx = await browser.newContext({ userAgent: UA });
  const sent = [];
  await ctx.route('**://script.google.com/**', (r) => {
    sent.push({ url: r.request().url(), body: r.request().postData() });
    return r.fulfill(gas);
  });

  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('response', (r) => {
    if (r.status() >= 400 && !r.url().includes('script.google.com')) {
      errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url()}`);
    }
  });
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(`console: ${m.text()}`);
  });
  await page.goto(`${BASE}/enquire`, { waitUntil: 'networkidle' });
  return { page, sent, errors };
}

// The required set only. NEVER fill `website` — the honeypot bounces the visitor to
// /enquire/success without submitting, which fakes a pass (docs/TESTING.md). I8 is the
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
const outcome = (page) => page.evaluate(() => ({
  url: location.pathname,
  // #form-status sits just outside the form. Only count what is actually rendered and on
  // screen — hidden error spans and the sr-only live region would fake a visible message.
  visible: [...document.querySelectorAll('#form-status, #enquiry-form [id^="err-"], #enquiry-form [aria-live], #enquiry-form [role="alert"]')]
    .filter((e) => {
      if (e.classList.contains('sr-only') || !e.checkVisibility()) return false;
      const r = e.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight;
    })
    .map((e) => e.textContent.trim()).filter(Boolean),
  submitDisabled: document.querySelector('button[type="submit"]')?.disabled ?? null,
}));

const payload = (sent) => JSON.parse(sent[0]?.body ?? '{}');

test('I3 — a bad photo does not lose the enquiry, and a backend failure is never silent', async () => {
  const zero = join(tmp, 'zero.png');
  writeFileSync(zero, Buffer.alloc(0)); // not a decodable image — createImageBitmap rejects
  const five = Array.from({ length: 5 }, (_, i) => {
    const p = join(tmp, `ref${i}.png`);
    // A real, verified-decodable 1x1 PNG — createImageBitmap must succeed for the
    // 3-file-cap case to actually test what it claims to. Confirmed with a standalone
    // Playwright check during this rewrite: a hand-rolled "minimal PNG" byte sequence
    // used earlier in this session LOOKED structurally valid (correct chunk lengths,
    // correct CRCs by eye) but Chromium's decoder rejected it with "InvalidStateError:
    // The source image could not be decoded" — so this one is the well-known,
    // widely-used 1x1 transparent PNG, not hand-assembled.
    writeFileSync(p, Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'));
    return p;
  });

  const cases = [
    // label, files, GAS stub, expected outcome
    ['zero-byte (undecodable)', [zero], OK_GAS,
      { url: '/enquire/success', images: 0, note: 'downscale fails -> enquiry still sends, with no photos' }],
    ['5 files (over the 3-file cap)', five, OK_GAS,
      { url: '/enquire/success', images: 3, note: 'only the first 3 are ever read from the picker' }],
    ['backend returns 500', [], { status: 500, headers: CORS, contentType: 'application/json', body: '{"ok":false}' },
      { url: '/enquire', images: null, note: 'must tell the visitor, not silently drop the lead' }],
  ];

  const failures = [];
  const report = [];
  for (const [label, files, gas, expect] of cases) {
    const { page, sent, errors } = await openForm(gas);
    await fillRequired(page);
    if (files.length) await page.setInputFiles('#reference-images', files);
    await submit(page);
    const o = await outcome(page);
    const body = payload(sent);
    report.push(`  ${label}: url=${o.url} images=${body.images?.length ?? 'n/a'} visible=${JSON.stringify(o.visible)}`);

    if (errors.length) failures.push(`${label}: ${errors.join('; ')}`);
    if (o.url !== expect.url) failures.push(`${label}: landed on ${o.url}, expected ${expect.url}`);
    if (expect.images !== null && body.images?.length !== expect.images)
      failures.push(`${label}: sent ${body.images?.length ?? 0} images, expected ${expect.images}`);
    if (expect.url === '/enquire' && !o.visible.length)
      failures.push(`${label}: silent no-op — no navigation and nothing the visitor can see`);
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
  const body = payload(sent);

  console.log(`\nI4 observed:\n  forced values readback=${JSON.stringify(forced)}` +
    `\n  url=${o.url} visible=${JSON.stringify(o.visible)}` +
    `\n  payload=${JSON.stringify(body).slice(0, 400)}\n`);

  const failures = [...errors];
  // The browser's own value sanitisation should have emptied the text case.
  if (forced.text !== '') failures.push(`"abc" survived in size-w as ${JSON.stringify(forced.text)}`);
  assert.deepEqual(failures, [], `\n  ${failures.join('\n  ')}\n`);
  // Negative sizes are the open half of I4 — see the skipped test below.
  assert.equal(body.size_h, '-50', 'the -50 case did not reach the payload as expected');
});

// OPEN FINDING, awaiting the client. min="0" is declared on both size inputs, but the
// form is novalidate, so nothing enforces it and "-50" reaches the Sheet as a string.
// Un-skip once the client decides — the enquiry form is theirs, and a QA
// test must not fix what it finds (docs/TESTING.md §4).
test('I4b — negative sizes are rejected', { skip: 'open finding — see docs/QA-CHECKLIST.md' }, async () => {
  const { page, sent } = await openForm();
  await fillRequired(page);
  await page.evaluate(() => { document.getElementById('size-h').value = '-50'; });
  await submit(page);
  assert.notEqual(payload(sent).size_h, '-50');
});

test('I8 — filling the honeypot submits nothing and still lands on success', async () => {
  const { page, sent, errors } = await openForm();
  await fillRequired(page);
  // Hidden field: Playwright refuses to fill it, so set it the way a bot would.
  await page.evaluate(() => { document.querySelector('input[name="website"]').value = 'https://spam.example'; });

  await submit(page);
  const o = await outcome(page);
  console.log(`\nI8 observed:\n  url=${o.url} requests=${sent.length} ` +
    `urls=${JSON.stringify(sent.map((s) => s.url))}\n`);

  assert.deepEqual(sent.map((s) => s.url), [], 'honeypot submission escaped to the backend');
  assert.equal(o.url, '/enquire/success', 'honeypot submission did not land on /enquire/success');
  assert.deepEqual(errors, []);
});
