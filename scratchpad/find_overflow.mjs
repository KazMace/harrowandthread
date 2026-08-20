import { chromium } from 'playwright';
const browser = await chromium.launch();
for (const path of ['/commissions', '/carpets']) {
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`http://localhost:4321${path}`, { waitUntil: 'networkidle' });
    const details = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('body *').forEach((el) => {
        if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
          results.push({
            tag: el.tagName,
            cls: el.className.toString().slice(0, 100),
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            text: el.textContent.slice(0, 50),
          });
        }
      });
      return results;
    });
    console.log(`\n=== ${path} @ ${width} ===`);
    console.log(JSON.stringify(details, null, 2));
    await page.close();
  }
}
await browser.close();
