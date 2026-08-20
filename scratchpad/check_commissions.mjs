import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/commissions', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'scratchpad/commissions-check.png' });
await browser.close();
