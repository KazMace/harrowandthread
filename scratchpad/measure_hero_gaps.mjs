import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 1200 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

const header = await page.locator('header.sticky').boundingBox();
const section = await page.locator('section').first().boundingBox();
const eyebrow = await page.locator('.eyebrow').first().boundingBox();
const h1 = await page.locator('h1').first().boundingBox();
const rule = await page.locator('h1').first().locator('xpath=following-sibling::div[1]').boundingBox();
const btn = await page.locator('a:has-text("Start a commission")').first().boundingBox();

console.log('header:', header);
console.log('hero section top:', section.y, 'height:', section.height);
console.log('eyebrow top:', eyebrow.y);
console.log('h1 top:', h1.y, 'bottom:', h1.y + h1.height);
console.log('cta row top:', rule.y);
console.log('button bottom:', btn.y + btn.height);
console.log('---gap analysis---');
console.log('gap header-bottom to eyebrow-top:', Math.round(eyebrow.y - (header.y + header.height)));
console.log('gap h1-bottom to cta-row-top:', Math.round(rule.y - (h1.y + h1.height)));
await browser.close();
