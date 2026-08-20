import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const font = await page.locator('h1').first().evaluate(el => getComputedStyle(el).fontFamily);
console.log('h1 font-family:', font);
await page.screenshot({ path: 'scratchpad/cormorant-hero.png' });
await browser.close();
