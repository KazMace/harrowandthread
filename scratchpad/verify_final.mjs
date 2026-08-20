import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'scratchpad/final-hero.png' });

await page.goto('http://localhost:4321/commissions', { waitUntil: 'networkidle' });
await page.locator('h2:has-text("How colour works")').scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: 'scratchpad/final-colour.png' });
await browser.close();
