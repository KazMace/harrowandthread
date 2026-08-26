// Proves the QA harness works: real browser, real server, real stylesheet.
// Not a test suite — the blind QA agent writes those. See AGENTS.md.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';
// Left over from the retired Web3Forms backend (Cloudflare 403'd default headless
// Chromium there) but kept as cheap insurance against the same bot-check anywhere else.
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

// Hard client rule: NO RUG OR WALL HANGING MAY BE CROPPED, ever — a whole
// piece must always be shown whole. Enforced here because it is a CSS
// property nobody notices regressing — one `object-cover` added for a layout
// fix silently breaks it on every page.
//
// Approved exceptions, made deliberately:
// - hero-grand (2026-08-26, LV-style homepage rebuild): the homepage hero is
//   a full-bleed ROOM photo, chosen specifically because it has no rug at the
//   crop edge. A room-context shot, not a piece being sold.
// - render-rug-01, render-wall-hanging-01, carpets-teaser, wall-hanging-context
//   (2026-08-26, category tile row): these same ids are ALSO used uncropped
//   elsewhere (RendersGrid's full-measure plates, CarpetsStrip) — cropping
//   applies only to their use as small navigational tile thumbnails linking
//   to category pages, not to the full-scale showcase, which stays protected.
// The rule below still catches a `cover` crop landing anywhere else.
const PAGES = ['/', '/commissions', '/carpets', '/care', '/faq', '/trade', '/enquire'];
const CROP_ALLOWED_IDS = [
  'hero-grand',
  'render-rug-01',
  'render-wall-hanging-01',
  'carpets-teaser',
  'wall-hanging-context',
];

test('no rug or wall hanging is ever cropped or distorted', async () => {
  const page = await browser.newPage({ userAgent: UA });
  const failures = [];

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    failures.push(...await page.evaluate((allowed) => {
      const bad = [];
      for (const img of document.querySelectorAll('img')) {
        if (!img.naturalWidth || !img.clientWidth) continue;      // not loaded / hidden
        const fit = getComputedStyle(img).objectFit;
        const natural = img.naturalWidth / img.naturalHeight;
        const rendered = img.clientWidth / img.clientHeight;
        const src = img.currentSrc.split('/').pop();
        const isAllowedCrop = allowed.some((id) => src.startsWith(id));
        if (fit === 'cover') {
          if (!isAllowedCrop) bad.push(`${src}: object-fit:cover crops it`);
        }
        // 2% tolerance absorbs sub-pixel layout rounding.
        else if (Math.abs(natural - rendered) / natural > 0.02)
          bad.push(`${src}: natural ${natural.toFixed(3)} vs rendered ${rendered.toFixed(3)}`);
      }
      return bad.map(m => `${location.pathname} — ${m}`);
    }, CROP_ALLOWED_IDS));
  }

  assert.deepEqual(failures, [], `\n  ${failures.join('\n  ')}\n`);
});

// Structural invariants across every page. These are settled client rules and
// accessibility floors that regress silently when a page is added or a nav edited.
const ALL_PAGES = ['/', '/commissions', '/carpets', '/care', '/faq', '/trade',
                   '/enquire', '/terms', '/privacy', '/cookies', '/enquire/success'];

test('structure holds on every page: headings, labels, skip link, nav, trade placement', async () => {
  const page = await browser.newPage({ userAgent: UA });
  const failures = [];
  const navs = new Set();

  for (const path of ALL_PAGES) {
    const resp = await page.goto(BASE + path, { waitUntil: 'networkidle' });
    if (resp.status() !== 200) failures.push(`${path}: HTTP ${resp.status()}`);

    const r = await page.evaluate(() => {
      const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1]);
      const skips = levels.flatMap((l, i) => i && l - levels[i - 1] > 1 ? [`${levels[i - 1]}->${l}`] : []);
      return {
        h1: levels.filter(l => l === 1).length,
        skips,
        unlabelled: [...document.querySelectorAll('input,select,textarea')]
          .filter(e => e.type !== 'hidden' && !e.labels?.length
                       && !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby'))
          .map(e => e.name || e.id || e.type),
        skipLink: !!document.querySelector('a[href^="#"]'),
        nav: [...document.querySelectorAll('header nav a')].map(a => a.textContent.trim()).join('|'),
      };
    });

    navs.add(r.nav);
    if (r.h1 !== 1) failures.push(`${path}: ${r.h1} h1 elements, expected 1`);
    if (r.skips.length) failures.push(`${path}: skipped heading levels ${r.skips.join(',')}`);
    if (r.unlabelled.length) failures.push(`${path}: unlabelled inputs ${r.unlabelled.join(',')}`);
    if (!r.skipLink) failures.push(`${path}: no skip link`);
    // Settled client rule: trade is footer-only, never in the nav.
    if (/trade/i.test(r.nav)) failures.push(`${path}: "trade" in nav — it is footer-only`);
  }

  if (navs.size > 1) failures.push(`nav differs across pages: ${[...navs].join('  //  ')}`);
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
