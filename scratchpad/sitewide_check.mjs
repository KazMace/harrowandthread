import { chromium } from 'playwright';
const browser = await chromium.launch();
const pages = ['/', '/commissions', '/carpets', '/enquire', '/faq', '/trade'];
const widths = [375, 1440];
for (const path of pages) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`http://localhost:4321${path}`, { waitUntil: 'networkidle' });
    const overflowing = await page.evaluate(() => {
      let bad = 0;
      document.querySelectorAll('body *').forEach((el) => {
        if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) bad++;
      });
      return bad;
    });
    console.log(path, width, 'overflow elements:', overflowing);
    await page.close();
  }
}
await browser.close();
