import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://localhost:4321/commissions', { waitUntil: 'networkidle' });
await page.locator('h3:has-text("Size")').scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: 'scratchpad/verify-size.png' });

await page.locator('text=Worked examples').first().scrollIntoViewIfNeeded().catch(() => {});
await page.locator('h2:has-text("Rates")').scrollIntoViewIfNeeded().catch(() => {});
await page.waitForTimeout(300);
await page.screenshot({ path: 'scratchpad/verify-shipping-commissions.png' });

await browser.close();
