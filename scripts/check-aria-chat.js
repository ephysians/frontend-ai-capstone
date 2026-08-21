const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  const url = 'https://frontend-ai-capstone-two.vercel.app/chat';
  console.log('Loading', url);
  await page.goto(url, { waitUntil: 'networkidle' });

  const results = await page.evaluate(() => {
    const elems = Array.from(document.querySelectorAll('[aria-describedby]'));
    return elems.map(el => {
      const desc = el.getAttribute('aria-describedby');
      const has = !!(desc && document.getElementById(desc));
      return {
        tag: el.tagName,
        role: el.getAttribute('role') || null,
        ariaLabel: el.getAttribute('aria-label') || null,
        ariaDescribedBy: desc,
        describedElementPresent: has,
        outer: el.outerHTML.slice(0, 300)
      };
    });
  });

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
