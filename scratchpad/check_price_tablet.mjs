import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 900 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.locator('#rates').scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.locator('#rates').screenshot({ path: 'scratchpad/rates-tablet.png' });
await browser.close();
