import { chromium } from 'playwright';
const browser = await chromium.launch();
const sizes = [
  { name: 'mobile-375x667', width: 375, height: 667 },   // iPhone SE — shortest common
  { name: 'mobile-390x844', width: 390, height: 844 },   // iPhone 12/13/14
  { name: 'mobile-360x800', width: 360, height: 800 },   // common Android
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'desktop-1920x1080', width: 1920, height: 1080 },
];
for (const s of sizes) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height } });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  const box = await page.locator('a:has-text("Start a commission")').first().boundingBox();
  const fits = box ? box.y + box.height <= s.height : null;
  console.log(s.name, 'button bottom:', box ? Math.round(box.y + box.height) : 'not found', '/ viewport:', s.height, '-> fits above fold:', fits);
  await page.screenshot({ path: `scratchpad/fold-${s.name}.png` });
  await page.close();
}
await browser.close();
