import { chromium } from 'playwright';
const browser = await chromium.launch();
for (const width of [320, 375, 414]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `scratchpad/hero-${width}.png` });
  await page.close();
}
await browser.close();
console.log('done');
