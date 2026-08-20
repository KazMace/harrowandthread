import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('console', (msg) => { errors.push(`[${msg.type()}] ${msg.text()}`); });
page.on('pageerror', (err) => errors.push('PAGEERROR: ' + String(err)));
page.on('requestfailed', (req) => errors.push('REQFAILED: ' + req.url() + ' ' + req.failure()?.errorText));
page.on('response', (res) => { if (res.url().includes('script.google') || res.url().includes('googleusercontent')) errors.push('RESPONSE: ' + res.status() + ' ' + res.url()); });

await page.goto('http://localhost:4321/enquire', { waitUntil: 'networkidle' });

await page.fill('#name', 'Browser Test FINAL — safe to delete');
await page.fill('#email', 'test-verification@example.com');
await page.selectOption('#iam', { index: 1 });
await page.selectOption('#commission-type', { index: 1 });
await page.fill('#location', 'Verification run — safe to delete');

await page.setInputFiles('#reference-images', '/home/kaiser_mace/harrowandthread/scratchpad/commissions-check.png');

await page.click('button[type="submit"]');

await page.waitForURL('**/enquire/success**', { timeout: 20000 }).catch(() => {});

const finalUrl = page.url();
const statusText = await page.locator('#form-status').textContent().catch(() => '(not found)');
console.log('FINAL_URL=' + finalUrl);
console.log('STATUS_TEXT=' + statusText);
console.log('LOG=\n' + errors.join('\n'));

await browser.close();
