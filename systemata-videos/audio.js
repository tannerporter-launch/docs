// Soundtrack as a function of time: music bed + sfx synthesized from math. node audio.js <slug> -> $OUT_DIR/<slug>/audio.wav
const fs = require('fs'), path = require('path');
const slug = process.argv[2], V = require('./videos/' + slug + '.js');
const SR = 44100, N = Math.ceil(V.duration * SR), L = new Float32Array(N), R = new Float32Array(N), TAU = Math.PI * 2;
let seed = 7; const noise = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 * 2 - 1; };
function add(t, dur, fn, gain = 1, pan = 0) { const i0 = Math.floor(t * SR), n = Math.floor(dur * SR), l = Math.cos((pan + 1) * Math.PI / 4), r = Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < n && i0 + i < N; i++) { if (i0 + i < 0) continue; const s = fn(i / SR, i / n) * gain; L[i0 + i] += s * l; R[i0 + i] += s * r; } }
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const SFX = {
  tick: t => add(t, .08, x => Math.sin(TAU * 1900 * x) * Math.exp(-x * 110) * .5 + noise() * Math.exp(-x * 500) * .25, .32),
  click: t => SFX.tick(t),
  pop: t => { let ph = 0; add(t, .16, x => { ph += TAU * (350 + 450 * Math.min(1, x / .07)) / SR; return Math.sin(ph) * Math.exp(-x * 26); }, .22); },
  // soft, dark "air" transition: low-passed noise, slow swell, quiet. (was loud and bright)
  whoosh: t => { let y = 0, z = 0; add(t, .5, (x, u) => { y += .035 * (noise() - y); z += .06 * (y - z); return z * Math.pow(Math.sin(Math.PI * u), 2) * 3; }, .11); },
  thump: t => { let ph = 0; add(t, .3, x => { ph += TAU * (45 + 110 * Math.exp(-x * 28)) / SR; return Math.sin(ph) * Math.exp(-x * 11); }, .4); },
  chime: t => [659.25, 830.61, 987.77, 1318.5].forEach((f, i) => add(t + i * .07, 1.6, x => (Math.sin(TAU * f * x) + .35 * Math.sin(TAU * f * 2.76 * x) * Math.exp(-x * 3)) * Math.exp(-x * 3.2), .11, (f % 7) / 7 - .5)),
  swell: t => { let y = 0, z = 0; add(t, 1.6, (x, u) => { y += .03 * (noise() - y); z += .05 * (y - z); return z * Math.sin(Math.PI * u) * 3; }, .1); },
};
for (const [t, name] of V.sfx) SFX[name](t);
const { execFileSync } = require('child_process');
const out = path.join(process.env.OUT_DIR || path.join(__dirname, 'out'), slug); fs.mkdirSync(out, { recursive: true });
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = Math.min(1, .8 / Math.max(peak, 1e-6)), buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
const p = f => path.join(out, f), run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'ignore', 'inherit'] });
fs.writeFileSync(p('sfx_dry.wav'), buf);
run('python3', [path.join(__dirname, 'music.py'), slug, String(V.duration), p('music.mid')]);
run('fluidsynth', ['-ni', '-q', '-g', '0.9', '-r', '44100', '-F', p('music_raw.wav'), '/usr/share/sounds/sf2/FluidR3_GM.sf2', p('music.mid')]);   // open-source synth + MIT soundfont
run('sox', [p('music_raw.wav'), p('music.wav'), 'trim', '0', String(V.duration), 'fade', 't', '1.5', String(V.duration), '2.5', 'reverb', '20', '50', '70', 'gain', '-n', '-3']);    // SoX reverb + fades
run('sox', [p('sfx_dry.wav'), p('sfx.wav'), 'reverb', '12', '40', '50', 'pad', '0', '0']);
run('sox', ['-m', '-v', '0.55', p('music.wav'), '-v', '1', p('sfx.wav'), p('mix.wav'), 'trim', '0', String(V.duration)]);
run('ffmpeg', ['-y', '-loglevel', 'error', '-i', p('mix.wav'), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=9', '-ar', '44100', p('audio.wav')]);                                              // FFmpeg loudness normalization
console.log(slug, 'audio ok');
