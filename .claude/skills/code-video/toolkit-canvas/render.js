// node render.js <slug> : draws every frame (60fps, 1920x1080) in headless Chromium, synthesizes audio, FFmpeg stitches to <slug>.mp4
const { chromium } = require('playwright'), path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const slug = process.argv[2], V = require('./videos/' + slug + '.js'), FPS = 60;
const OUT = path.join(process.env.OUT_DIR || path.join(__dirname, 'out'), slug), FR = path.join(OUT, 'frames');
fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
execFileSync('node', [path.join(__dirname, 'audio.js'), slug], { stdio: 'inherit', env: { ...process.env, OUT_DIR: process.env.OUT_DIR || path.join(__dirname, 'out') } });
const total = Math.round(V.duration * FPS), W = +process.env.WORKERS || Math.min(4, os.cpus().length);
(async () => {
  const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
  await Promise.all([...Array(W)].map(async (_, w) => {
    const p = await ctx.newPage(); await p.goto('file://' + path.join(__dirname, 'player.html') + '?v=' + slug + '#render'); await p.waitForFunction('window.__ready');
    for (let i = w; i < total; i += W) { const d = await p.evaluate(t => window.frame(t), i / FPS); fs.writeFileSync(path.join(FR, String(i).padStart(5, '0') + '.jpg'), Buffer.from(d.split(',')[1], 'base64')); }
  }));
  await b.close();
  const dest = path.join(__dirname, 'systemata-' + slug + '.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FR, '%05d.jpg'), '-i', path.join(OUT, 'audio.wav'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', dest]);
  console.log('done', slug, total, 'frames ->', dest);
})();
