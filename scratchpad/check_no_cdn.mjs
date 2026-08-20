import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const externalRequests = [];
page.on('request', (req) => {
  if (!req.url().startsWith('http://localhost')) externalRequests.push(req.url());
});
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
console.log('External requests:', externalRequests.length ? externalRequests : 'none');
await browser.close();
