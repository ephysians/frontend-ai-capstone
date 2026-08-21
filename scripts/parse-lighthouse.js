const fs = require('fs');
const path = require('path');
const files = [
  'lighthouse-home-mobile.html',
  'lighthouse-chat-mobile.html',
  'lighthouse-experience-mobile.html',
  'lighthouse-work-mobile.html',
];
function extractJSONFromHtml(html) {
  const marker = 'window.__LIGHTHOUSE_JSON__ = ';
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  const start = idx + marker.length;
  // Find the end: look for '\n  </script>' after start or '</script>' after start
  const endTag = '</script>';
  const endIdx = html.indexOf(endTag, start);
  if (endIdx === -1) return null;
  // The JSON text may end with a semicolon before </script>
  let jsonText = html.substring(start, endIdx).trim();
  if (jsonText.endsWith(';')) jsonText = jsonText.slice(0, -1);
  return jsonText;
}
function safeParse(jsonText) {
  try {
    return JSON.parse(jsonText);
  } catch (e) {
    // Try to recover common issues: unescaped control characters -> fail
    return null;
  }
}
function pickMetrics(report) {
  if (!report) return null;
  const out = {};
  out.fetchTime = report.fetchTime;
  out.requestedUrl = report.requestedUrl || report.finalUrl || null;
  out.categories = {};
  const cats = report.categories || {};
  ['performance','accessibility','best-practices','seo'].forEach(k=>{
    out.categories[k] = cats[k] && typeof cats[k].score === 'number' ? cats[k].score : (cats[k] && typeof cats[k].score === 'boolean' ? (cats[k].score?1:0) : null);
  });
  const audits = report.audits || {};
  function val(id){
    const a = audits[id];
    if(!a) return null;
    if(typeof a.numericValue === 'number') return a.numericValue;
    if(a.displayValue) return a.displayValue;
    return null;
  }
  out.metrics = {
    FCP: val('first-contentful-paint'),
    LCP: val('largest-contentful-paint'),
    TBT: val('total-blocking-time'),
    INP: val('experimental-inp') || val('interaction-to-next-paint') || null,
    CLS: val('cumulative-layout-shift')
  };
  return out;
}
(async function(){
  const results = {};
  for (const f of files) {
    const p = path.join(__dirname, '..', f);
    if (!fs.existsSync(p)) { results[f] = { error: 'file-not-found' }; continue; }
    const html = fs.readFileSync(p, 'utf8');
    const jsonText = extractJSONFromHtml(html);
    if (!jsonText) { results[f] = { error: 'json-not-found' }; continue; }
    const report = safeParse(jsonText);
    if (!report) { results[f] = { error: 'json-parse-failed' }; continue; }
    results[f] = pickMetrics(report);
  }
  const outPath = path.join(__dirname, '..', 'lighthouse-summary.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(JSON.stringify(results, null, 2));
})();
