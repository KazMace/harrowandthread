import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321//', { waitUntil: 'networkidle' });

// Scroll the full page first so every IntersectionObserver-triggered
// .reveal/.stagger section gets its "visible" class before we screenshot.
const height = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < height; y += 700) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(120);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);

await page.screenshot({ path: 'scratchpad/redesign-viewport.png' });
await page.screenshot({ path: 'scratchpad/redesign-full.png', fullPage: true });
await browser.close();
console.log('done');
