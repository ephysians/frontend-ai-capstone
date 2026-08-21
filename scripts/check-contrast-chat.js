const playwright = require('playwright');

function hexToRgb(hex) {
  const m = hex.replace('#','');
  const bigint = parseInt(m, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function srgbToLinear(v) {
  v = v / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(r,g,b){
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126*R + 0.7152*G + 0.0722*B;
}

function contrastRatio(rgb1, rgb2){
  const L1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  const L2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(L1,L2);
  const darker = Math.min(L1,L2);
  return (lighter + 0.05) / (darker + 0.05);
}

(async ()=>{
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  const url = 'https://frontend-ai-capstone-two.vercel.app/chat';
  console.log('Loading', url);
  await page.goto(url, { waitUntil: 'networkidle' });

  const results = await page.evaluate(() => {
    function getRgb(css) {
      const m = css.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const parts = m[1].split(',').map(s=>parseFloat(s.trim()));
      return [parts[0], parts[1], parts[2]];
    }

    const candidates = Array.from(document.querySelectorAll('p,span,button,a,label,div'));
    const out = [];
    for (const el of candidates) {
      if (!el.textContent || el.textContent.trim().length < 2) continue;
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bg = style.backgroundColor;
      const rgbColor = getRgb(color) || [0,0,0];
      const rgbBg = getRgb(bg) || [255,255,255];
      out.push({outer: el.outerHTML.slice(0,300), text: el.textContent.trim().slice(0,100), color, bg});
    }
    return out.slice(0,200);
  });

  // Post-process in Node to compute contrast (since CSS colors may be in rgb already)
  const filtered = [];
  const colorRegex = /rgba?\(([^)]+)\)/;

  for (const r of results) {
    const colMatch = r.color.match(colorRegex);
    const bgMatch = r.bg.match(colorRegex);
    if (!colMatch || !bgMatch) continue;
    const colParts = colMatch[1].split(',').map(s=>parseFloat(s.trim()));
    const bgParts = bgMatch[1].split(',').map(s=>parseFloat(s.trim()));
    const ratio = (function(){
      function srgbToLinear(v){ v = v/255; return v<=0.03928? v/12.92: Math.pow((v+0.055)/1.055,2.4); }
      const L1 = 0.2126*srgbToLinear(colParts[0]) + 0.7152*srgbToLinear(colParts[1]) + 0.0722*srgbToLinear(colParts[2]);
      const L2 = 0.2126*srgbToLinear(bgParts[0]) + 0.7152*srgbToLinear(bgParts[1]) + 0.0722*srgbToLinear(bgParts[2]);
      const lighter = Math.max(L1,L2);
      const darker = Math.min(L1,L2);
      return (lighter+0.05)/(darker+0.05);
    })();
    if (ratio < 4.5) {
      filtered.push({text: r.text, outer: r.outer, color: r.color, bg: r.bg, ratio});
    }
  }

  console.log('Low contrast elements:', JSON.stringify(filtered, null, 2));
  await browser.close();
})();
