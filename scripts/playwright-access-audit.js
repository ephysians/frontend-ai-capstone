const fs = require('fs');
const path = require('path');
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  // fallback to @playwright/test bundled playwright
  ({ chromium } = require('@playwright/test'));
}
const base = 'https://frontend-ai-capstone-two.vercel.app';
const pages = ['/', '/chat', '/experience', '/work'];
(async ()=>{
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 892 },
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36'
  });
  const out = {};
  const shotsDir = path.join(__dirname, '..', 'access-screenshots');
  if (!fs.existsSync(shotsDir)) fs.mkdirSync(shotsDir);
  for (const p of pages) {
    const slug = p === '/' ? 'home' : p.replace(/\W+/g,'').replace(/^\//,'');
    const url = new URL(p, base).toString();
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    } catch (e) {
      out[slug] = { error: 'navigation-failed', message: String(e) };
      await page.close();
      continue;
    }
    // take initial screenshot
    const pageShot = path.join(shotsDir, `page-${slug}.png`);
    await page.screenshot({ path: pageShot, fullPage: true });

    // keyboard-only navigation: start from body, then press Tab up to 120 times or until cycle
    await page.evaluate(()=>{document.body.focus();});
    const seen = new Set();
    const sequence = [];
    let cycleDetected = false;
    for (let i=0;i<120;i++){
      const info = await page.evaluate(() => {
        const el = document.activeElement || document.body;
        const snip = (el.innerText||el.textContent||'').trim().slice(0,40).replace(/\s+/g,' ');
        return {
          tag: el.tagName,
          id: el.id || null,
          role: el.getAttribute && el.getAttribute('role'),
          aria: el.getAttribute && (el.getAttribute('aria-label') || el.getAttribute('aria-describedby') || el.getAttribute('aria-hidden')),
          tabindex: el.getAttribute ? el.getAttribute('tabindex') : null,
          text: snip
        };
      });
      const key = `${info.tag}|${info.id||''}|${info.role||''}|${info.text||''}`;
      sequence.push(info);
      if (seen.has(key)) { cycleDetected = true; break; }
      seen.add(key);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(80);
    }
    // capture screenshot showing focus (attempt to highlight active element)
    // inject a CSS outline for :focus-visible to make it visible in screenshot
    await page.addStyleTag({ content: '*:focus{outline: 3px solid #ff0 !important; box-shadow: 0 0 0 3px rgba(255,255,0,0.3) !important;}' });
    const focusShot = path.join(shotsDir, `focus-${slug}.png`);
    await page.screenshot({ path: focusShot, fullPage: true });

    // Additional chat-specific interactions: type a message, ensure Send becomes enabled,
    // submit using keyboard, wait for streaming and Stop button, capture screenshots.
    if (slug === 'chat') {
      try {
        // try to find an input or textarea with aria-label 'Message'
        const inputHandle = await page.$('input[aria-label="Message"], textarea[aria-label="Message"], input[name=message], textarea[name=message]');
        if (inputHandle) {
          // focus and type
          await inputHandle.focus();
          await page.keyboard.type('Accessibility keyboard test message');
          await page.waitForTimeout(300);
          const typedShot = path.join(shotsDir, `page-${slug}-typed.png`);
          await page.screenshot({ path: typedShot, fullPage: true });

          // Tab until send button is active (max 20 tabs)
          let sendFound = false;
          for (let t=0;t<20;t++){
            const active = await page.evaluate(() => {
              const el = document.activeElement || document.body;
              const aria = el.getAttribute && (el.getAttribute('aria-label') || el.getAttribute('aria-describedby'));
              return { tag: el.tagName, aria };
            });
            if (active && active.aria && active.aria.toLowerCase().includes('send')) { sendFound = true; break; }
            await page.keyboard.press('Tab');
            await page.waitForTimeout(120);
          }
          const postTabShot = path.join(shotsDir, `focus-${slug}-posttype.png`);
          await page.screenshot({ path: postTabShot, fullPage: true });

          if (sendFound) {
            // press Space to activate send via keyboard
            await page.keyboard.press('Space');
            await page.waitForTimeout(500);
          } else {
            // fallback: attempt to click the send button programmatically (no code change to app)
            const sendBtn = await page.$('button[aria-label="Send message"], button[type=submit]');
            if (sendBtn) {
              await sendBtn.click();
              await page.waitForTimeout(500);
            }
          }

          // after submit, wait for streaming indicator or Stop button
          let stopBtn = null;
          try {
            await page.waitForSelector('button[aria-label="Stop generating"], button[aria-label*="Stop"]', { timeout: 5000 });
            stopBtn = await page.$('button[aria-label="Stop generating"], button[aria-label*="Stop"]');
          } catch (e) {
            // not found
          }
          const streamShot = path.join(shotsDir, `stream-${slug}.png`);
          await page.screenshot({ path: streamShot, fullPage: true });

          if (stopBtn) {
            // ensure keyboard reachability: tab until stop is focused
            let stopFocused = false;
            for (let t=0;t<20;t++){
              const active = await page.evaluate(() => {
                const el = document.activeElement || document.body;
                const aria = el.getAttribute && (el.getAttribute('aria-label') || el.getAttribute('aria-describedby'));
                return { tag: el.tagName, aria };
              });
              if (active && active.aria && active.aria.toLowerCase().includes('stop')) { stopFocused = true; break; }
              await page.keyboard.press('Tab');
              await page.waitForTimeout(120);
            }
            const stopShot = path.join(shotsDir, `stop-${slug}.png`);
            await page.screenshot({ path: stopShot, fullPage: true });
            // attempt to activate Stop via keyboard
            if (stopFocused) {
              await page.keyboard.press('Space');
              await page.waitForTimeout(300);
            }
          }
        }
      } catch (e) {
        // chat interaction best-effort; continue
      }
    }

    // attempt to capture WAVE report by visiting wave.webaim.org/report#/<url>
    const waveUrl = `https://wave.webaim.org/report#/${encodeURIComponent(url)}`;
    let waveShotPath = null;
    try {
      const wpage = await context.newPage();
      await wpage.goto(waveUrl, { waitUntil: 'networkidle', timeout: 60000 });
      await wpage.waitForTimeout(3000);
      waveShotPath = path.join(shotsDir, `wave-${slug}.png`);
      await wpage.screenshot({ path: waveShotPath, fullPage: true });
      await wpage.close();
    } catch (e) {
      waveShotPath = null;
    }

    out[slug] = {
      url,
      sequenceLen: sequence.length,
      cycleDetected,
      sequence,
      pageShot: path.relative(path.join(__dirname,'..'), pageShot),
      focusShot: path.relative(path.join(__dirname,'..'), focusShot),
      waveShot: waveShotPath ? path.relative(path.join(__dirname,'..'), waveShotPath) : null
    };
    await page.close();
  }
  await browser.close();
  const outPath = path.join(__dirname, '..', 'accessibility-audit.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log('Wrote', outPath);
})();
