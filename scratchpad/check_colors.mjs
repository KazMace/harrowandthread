import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/index-redesign', { waitUntil: 'networkidle' });
const eyebrow = await page.locator('.eyebrow').first().evaluate(el => getComputedStyle(el).color);
const yours = await page.locator('h1 span.text-rust').first().evaluate(el => getComputedStyle(el).color);
console.log('eyebrow color:', eyebrow);
console.log('yours color:', yours);
await browser.close();
