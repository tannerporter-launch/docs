// Frame-exact render: for every i, render(i/fps) in headless Chromium -> screenshot; then FFmpeg stitches frames + audio.
const { chromium } = require('playwright'), path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const E = require('./timeline.js');
const OUT = process.env.OUT_DIR || path.join(__dirname, 'out'), FR = path.join(OUT, 'frames');
fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
execFileSync('node', [path.join(__dirname, 'audio.js')], { stdio: 'inherit', env: { ...process.env, OUT_DIR: OUT } });
const total = Math.round(E.duration * E.fps), W = +process.env.WORKERS || Math.min(4, os.cpus().length);
(async () => {
  const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 }); // 1920x1080
  await Promise.all([...Array(W)].map(async (_, w) => {
    const p = await ctx.newPage(); await p.goto('file://' + path.join(__dirname, 'index.html') + '#render'); await p.waitForFunction('window.__ready');
    for (let i = w; i < total; i += W) { await p.evaluate(t => window.render(t), i / E.fps); await p.screenshot({ path: path.join(FR, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 94 }); }
  }));
  await b.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(E.fps), '-i', path.join(FR, '%05d.jpg'), '-i', path.join(OUT, 'audio.wav'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(__dirname, 'flowly-crm-demo.mp4')]);
  console.log('done', total, 'frames');
})();
