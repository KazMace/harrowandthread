import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/preview-teal-gold', { waitUntil: 'networkidle' });
const info = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const container = h1.parentElement;
  const cs = getComputedStyle(h1);
  return {
    h1_offsetWidth: h1.offsetWidth,
    h1_scrollWidth: h1.scrollWidth,
    container_offsetWidth: container.offsetWidth,
    fontSize: cs.fontSize,
    fontFamily: cs.fontFamily,
    lineHeight: cs.lineHeight,
    text: h1.textContent.trim(),
    linesRendered: h1.getClientRects().length,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
