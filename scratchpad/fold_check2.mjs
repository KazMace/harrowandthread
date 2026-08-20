import { chromium } from 'playwright';
const browser = await chromium.launch();
const sizes = [
  { name: 'laptop-1366x768', width: 1366, height: 768 },
  { name: 'laptop-1440x800', width: 1440, height: 800 },
  { name: 'laptop-1280x720', width: 1280, height: 720 },
  { name: 'laptop-short-1440x700', width: 1440, height: 700 },
  { name: 'laptop-veryshort-1440x650', width: 1440, height: 650 },
];
for (const s of sizes) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height } });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  const box = await page.locator('a:has-text("Start a commission")').first().boundingBox();
  const fits = box ? box.y + box.height <= s.height : null;
  console.log(s.name, 'button bottom:', box ? Math.round(box.y + box.height) : 'not found', '/ viewport:', s.height, '-> fits:', fits);
  await page.close();
}
await browser.close();
