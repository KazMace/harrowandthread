import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

// Scroll through so reveal/stagger content shows.
const height = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < height; y += 500) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(100);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);

await page.screenshot({ path: 'scratchpad/mobile-top.png' });
await page.screenshot({ path: 'scratchpad/mobile-full.png', fullPage: true });

// Check for actual horizontal overflow.
const overflowing = await page.evaluate(() => {
  const results = [];
  document.querySelectorAll('body *').forEach((el) => {
    if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        results.push({
          tag: el.tagName,
          cls: el.className.toString().slice(0, 80),
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          text: el.textContent.slice(0, 60),
        });
      }
    }
  });
  return results;
});
console.log(JSON.stringify(overflowing, null, 2));
await browser.close();
