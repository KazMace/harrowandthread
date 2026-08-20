import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/commissions', { waitUntil: 'networkidle' });
const loc = page.locator('text=Shipping').first();
await loc.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: 'scratchpad/verify-shipping-spec.png' });
await browser.close();
