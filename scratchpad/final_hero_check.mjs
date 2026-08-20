import { chromium } from 'playwright';
const browser = await chromium.launch();
const page1 = await browser.newPage({ viewport: { width: 1440, height: 800 } });
await page1.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page1.screenshot({ path: 'scratchpad/hero-desktop-final.png' });
await page1.close();

const page2 = await browser.newPage({ viewport: { width: 375, height: 667 } });
await page2.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page2.screenshot({ path: 'scratchpad/hero-mobile-final.png' });
await page2.close();
await browser.close();
