// storyboard / QA: node shot3.js <slug> sheet.png t1 t2 ...   (1080p, no motion blur, fast)
const { chromium } = require('playwright'), path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
(async () => {
  const [slug, out, ...ts] = process.argv.slice(2), dir = path.join(path.dirname(path.resolve(out)), 'shots3_' + slug); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.join(__dirname, 'player3.html') + '?v=' + slug + '&s=1&mb=1#render'); await p.waitForFunction('window.__ready');
  for (let i = 0; i < ts.length; i++) { const d = await p.evaluate(t => window.frame(t), +ts[i]); fs.writeFileSync(path.join(dir, String(i).padStart(3, '0') + '.jpg'), Buffer.from(d.split(',')[1], 'base64')); }
  await b.close(); const cols = 3, rows = Math.ceil(ts.length / cols);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '1', '-i', path.join(dir, '%03d.jpg'), '-vf', `scale=640:-1,tile=${cols}x${rows}`, '-frames:v', '1', out]);
})();
