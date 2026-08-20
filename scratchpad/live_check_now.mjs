import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle', timeout: 15000 });
await page.screenshot({ path: 'scratchpad/live-now-desktop.png' });

const page2 = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page2.goto('http://localhost:4321/', { waitUntil: 'networkidle', timeout: 15000 });
await page2.screenshot({ path: 'scratchpad/live-now-mobile.png' });
await browser.close();
console.log('done');
