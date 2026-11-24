// node render3.js <slug> : 4K (3840x2160) @60fps, 5-sample motion blur, film grain; Pedalboard-mastered audio; 4K master + 1080p copy.
const { chromium } = require('playwright'), path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const slug = process.argv[2], V = require('./videos/' + slug + '.js'), FPS = 60, S = +process.env.S || 2, MB = +process.env.MB || 5, LIMIT = process.env.LIMIT ? +process.env.LIMIT : null;
const BASE = process.env.OUT_DIR || path.join(__dirname, 'out'), OUT = path.join(BASE, slug), FR = path.join(OUT, 'frames');
fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
if (!process.env.SKIP_AUDIO) execFileSync('node', [path.join(__dirname, 'audio3.js'), slug], { stdio: 'inherit', env: { ...process.env, OUT_DIR: BASE } });
const total = LIMIT || Math.round(V.duration * FPS), W = +process.env.WORKERS || Math.min(4, os.cpus().length);
(async () => {
  const b = await chromium.launch({ args: ['--disable-gpu-vsync'] }), ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } }), t0 = Date.now();
  await Promise.all([...Array(W)].map(async (_, w) => { const p = await ctx.newPage(); await p.goto('file://' + path.join(__dirname, 'player3.html') + `?v=${slug}&s=${S}&mb=${MB}#render`); await p.waitForFunction('window.__ready', null, { timeout: 60000 });
    for (let i = w; i < total; i += W) { const d = await p.evaluate(t => window.frame(t), i / FPS); fs.writeFileSync(path.join(FR, String(i).padStart(5, '0') + '.jpg'), Buffer.from(d.split(',')[1], 'base64')); if (w === 0 && i % 240 === 0) console.log(slug, 'frame', i, '/', total, Math.round((Date.now() - t0) / 1000) + 's'); } }));
  await b.close(); if (LIMIT) { console.log('limited run done', Math.round((Date.now() - t0) / 1000) + 's for', LIMIT, 'frames'); return; }
  const col = ['-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709'], inp = ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FR, '%05d.jpg'), '-i', path.join(OUT, 'audio.wav')];
  const dest = path.join(__dirname, '..', `systemata-${slug}-4k.mp4`), dest1080 = path.join(__dirname, '..', `systemata-${slug}-1080p.mp4`);
  execFileSync('ffmpeg', [...inp, '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-maxrate', '45M', '-bufsize', '90M', '-profile:v', 'high', ...col, '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', dest]);
  execFileSync('ffmpeg', [...inp, '-vf', 'scale=1920:1080:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-profile:v', 'high', ...col, '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', dest1080]);
  fs.rmSync(FR, { recursive: true, force: true });
  console.log('done', slug, total, 'frames', Math.round((Date.now() - t0) / 1000) + 's');
})();
