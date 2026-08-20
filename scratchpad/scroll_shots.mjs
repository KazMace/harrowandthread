import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
const height = await page.evaluate(() => document.body.scrollHeight);
console.log('page height', height);
let y = 900;
let i = 2;
while (y < height) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `scratchpad/home-${i}.png` });
  y += 900;
  i++;
}
await browser.close();
