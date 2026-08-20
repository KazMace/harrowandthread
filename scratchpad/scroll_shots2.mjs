import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
const positions = [1600, 3200, 5800, 9000, 12500];
let i = 1;
for (const y of positions) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `scratchpad/home-${i}.png` });
  i++;
}
await browser.close();
