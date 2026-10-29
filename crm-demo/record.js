const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: __dirname + '/raw', size: { width: 1280, height: 720 } } });
  const p = await ctx.newPage();
  await p.goto('file://' + path.join(__dirname, 'index.html'));
  await p.waitForFunction(() => window.demoDone, null, { timeout: 120000 });
  await p.waitForTimeout(500);
  await ctx.close(); await b.close();
})();
