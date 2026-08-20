import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.locator('#rates').scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.locator('#rates').screenshot({ path: 'scratchpad/rates-desktop.png' });
await browser.close();
