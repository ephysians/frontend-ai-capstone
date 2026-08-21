const playwright = require('playwright');
(async ()=>{
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://frontend-ai-capstone-two.vercel.app/chat',{waitUntil:'networkidle'});
  const ps = await page.$$('p');
  for (const p of ps) {
    const text = (await p.innerText()).trim();
    if (text.includes('Try one of these')) {
      const info = await p.evaluate(e => {
        const cs = window.getComputedStyle(e);
        return { outer: e.outerHTML.slice(0,200), color: cs.color, bg: cs.backgroundColor, fontSize: cs.fontSize };
      });
      console.log(info);
      break;
    }
  }
  await browser.close();
})();
