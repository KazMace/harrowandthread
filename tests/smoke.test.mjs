// Proves the QA harness works: real browser, real server, real stylesheet.
// Not a test suite — the blind QA agent writes those. See AGENTS.md.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';
// Cloudflare 403s a default headless UA on Web3Forms — see CLAUDE.md.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';

let server, browser;

before(async () => {
  server = spawn('npm', ['run', 'preview'], { stdio: 'ignore' });
  browser = await chromium.launch({ args: ['--disable-blink-features=AutomationControlled'] });
  for (let i = 0; i < 40; i++) {
    try { await fetch(BASE); return; } catch { await new Promise(r => setTimeout(r, 250)); }
  }
  throw new Error('astro preview never came up — run `npm run build` first');
});

after(async () => { await browser?.close(); server?.kill(); });

test('homepage renders with its real fonts, not an Arial fallback', async () => {
  const page = await browser.newPage({ userAgent: UA });
  await page.goto(BASE);
  const font = await page.locator('h1').first().evaluate(el => getComputedStyle(el).fontFamily);
  assert.doesNotMatch(font, /^(Arial|sans-serif|serif)$/, `h1 fell back to ${font} — the stylesheet did not load`);
});

// Hard client rule (CLAUDE.md, 2026-08-11): NO RUG MAY BE CROPPED, ever.
// Enforced here because it is a CSS property nobody notices regressing — one
// `object-cover` added for a layout fix silently breaks it on every page.
const PAGES = ['/', '/commissions', '/carpets', '/care', '/faq', '/trade', '/enquire'];

test('no image is cropped or distorted on any page', async () => {
  const page = await browser.newPage({ userAgent: UA });
  const failures = [];

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    failures.push(...await page.evaluate(() => {
      const bad = [];
      for (const img of document.querySelectorAll('img')) {
        if (!img.naturalWidth || !img.clientWidth) continue;      // not loaded / hidden
        const fit = getComputedStyle(img).objectFit;
        const natural = img.naturalWidth / img.naturalHeight;
        const rendered = img.clientWidth / img.clientHeight;
        const src = img.currentSrc.split('/').pop();
        if (fit === 'cover') bad.push(`${src}: object-fit:cover crops it`);
        // 2% tolerance absorbs sub-pixel layout rounding.
        else if (Math.abs(natural - rendered) / natural > 0.02)
          bad.push(`${src}: natural ${natural.toFixed(3)} vs rendered ${rendered.toFixed(3)}`);
      }
      return bad.map(m => `${location.pathname} — ${m}`);
    }));
  }

  assert.deepEqual(failures, [], `\n  ${failures.join('\n  ')}\n`);
});

// COMPLIANCE.md: four things materially affect the purchase decision and must be
// prominent on the page that sells them — not buried as their only appearance in
// an accordion. Repeating them in the homepage FAQ is fine; that is not burying.
const MATERIAL_INFO = {
  '/carpets': {
    customs: /import duties|customs/i,
    chargedArea: /full rectangle/i,
    trimming: /trimm/i,
    colourVariance: /ARS 1,?400|dyed to match/i,
  },
  '/commissions': {
    customs: /import duties|customs/i,
    colourVariance: /screens? vary|dye number/i,
  },
};

test('material information is open, not only inside an accordion', async () => {
  const page = await browser.newPage({ userAgent: UA });
  const failures = [];

  for (const [path, checks] of Object.entries(MATERIAL_INFO)) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    for (const [name, re] of Object.entries(checks)) {
      const state = await page.evaluate(src => {
        const rx = new RegExp(src, 'i');
        for (const el of document.querySelectorAll('p,li,dd')) {
          const t = (el.textContent || '').trim();
          if (t.length > 25 && rx.test(t)) return el.closest('details') ? 'buried' : 'open';
        }
        return 'absent';
      }, re.source);
      if (state !== 'open') failures.push(`${path} — ${name}: ${state}`);
    }
  }

  assert.deepEqual(failures, [], `\n  ${failures.join('\n  ')}\n`);
});
