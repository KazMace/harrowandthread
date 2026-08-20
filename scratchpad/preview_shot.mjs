import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/preview-teal-gold', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: 'scratchpad/preview-teal-gold.png' });
await browser.close();
console.log('done');
