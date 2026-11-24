// Storyboard / QA: node shot.js out.png t1 t2 ...  -> contact sheet of those moments
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
(async () => {
  const [out, ...ts] = process.argv.slice(2); const dir = path.join(path.dirname(path.resolve(out)), 'shots'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto('file://' + path.join(__dirname, 'index.html') + '#render'); await p.waitForFunction('window.__ready');
  for (let i = 0; i < ts.length; i++) { await p.evaluate(t => window.render(t), +ts[i]); await p.screenshot({ path: path.join(dir, String(i).padStart(3, '0') + '.png') }); }
  await b.close(); const cols = 3, rows = Math.ceil(ts.length / cols);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '1', '-i', path.join(dir, '%03d.png'), '-vf', `scale=640:-1,tile=${cols}x${rows}`, '-frames:v', '1', out]);
})();
