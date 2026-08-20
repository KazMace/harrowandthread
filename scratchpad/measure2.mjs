import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/preview-teal-gold', { waitUntil: 'networkidle' });
const info = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const range = document.createRange();
  range.selectNodeContents(h1);
  const rects = Array.from(range.getClientRects()).map(r => ({ top: r.top, left: r.left, width: r.width }));
  return { h1Height: h1.offsetHeight, rects };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
