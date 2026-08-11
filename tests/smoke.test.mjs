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
