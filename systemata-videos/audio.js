// Soundtrack as a function of time: music bed + sfx synthesized from math. node audio.js <slug> -> $OUT_DIR/<slug>/audio.wav
const fs = require('fs'), path = require('path');
const slug = process.argv[2], V = require('./videos/' + slug + '.js');
const SR = 44100, N = Math.ceil(V.duration * SR), L = new Float32Array(N), R = new Float32Array(N), TAU = Math.PI * 2;
let seed = 7; const noise = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 * 2 - 1; };
function add(t, dur, fn, gain = 1, pan = 0) { const i0 = Math.floor(t * SR), n = Math.floor(dur * SR), l = Math.cos((pan + 1) * Math.PI / 4), r = Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < n && i0 + i < N; i++) { if (i0 + i < 0) continue; const s = fn(i / SR, i / n) * gain; L[i0 + i] += s * l; R[i0 + i] += s * r; } }
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const SFX = {
  tick: t => add(t, .08, x => Math.sin(TAU * 1900 * x) * Math.exp(-x * 110) * .5 + noise() * Math.exp(-x * 500) * .3, .5),
  click: t => SFX.tick(t),
  pop: t => { let ph = 0; add(t, .16, x => { ph += TAU * (350 + 450 * Math.min(1, x / .07)) / SR; return Math.sin(ph) * Math.exp(-x * 26); }, .32); },
  whoosh: t => { let y = 0; add(t, .6, (x, u) => { y += (.02 + .35 * Math.sin(Math.PI * u)) * (noise() - y); return y * Math.pow(Math.sin(Math.PI * u), 2) * 2.2; }, .4); },
  thump: t => { let ph = 0; add(t, .3, x => { ph += TAU * (45 + 110 * Math.exp(-x * 28)) / SR; return Math.sin(ph) * Math.exp(-x * 11); }, .7); },
  chime: t => [659.25, 830.61, 987.77, 1318.5].forEach((f, i) => add(t + i * .07, 1.6, x => (Math.sin(TAU * f * x) + .35 * Math.sin(TAU * f * 2.76 * x) * Math.exp(-x * 3)) * Math.exp(-x * 3.2), .16, (f % 7) / 7 - .5)),
  swell: t => { let y = 0; add(t, 1.6, (x, u) => { y += (.01 + .2 * u) * (noise() - y); return y * Math.sin(Math.PI * u) * 1.6; }, .35); },
};
const bpm = { pipeline: 98, method: 96, engagement: 92, join: 100 }[slug] || 96, beat = 60 / bpm, bar = beat * 4;
const chords = [[48, 52, 55, 59], [45, 48, 52, 55], [41, 45, 48, 52], [43, 47, 50, 52]];
for (let b = 0; b * bar < V.duration; b++) { const c = chords[b % 4], t0 = b * bar;
  c.forEach((m, k) => add(t0, bar + .6, x => { const a = Math.min(1, x / .6) * Math.min(1, (bar + .6 - x) / .6); return (Math.sin(TAU * hz(m + 12) * x) + .4 * Math.sin(TAU * hz(m + 12) * 1.004 * x)) * a * .5; }, .05, k / 3 - .5));
  add(t0, beat * 3, x => Math.sin(TAU * hz(c[0] - 12) * x) * Math.exp(-x * 1.4) * Math.min(1, x / .02), .16);
  for (let s = 0; s < 8; s++) { const m = c[[0, 2, 1, 3, 2, 1, 3, 2][s]] + 24, ts = t0 + s * beat / 2;
    add(ts, .6, x => (Math.sin(TAU * hz(m) * x) + .3 * Math.sin(TAU * hz(m) * 2 * x)) * Math.exp(-x * 7) * Math.min(1, x / .004), .06 * (s % 2 ? .7 : 1), s % 2 ? .3 : -.3); }
  for (let s = 0; s < 4; s++) add(t0 + s * beat + beat / 2, .05, x => noise() * Math.exp(-x * 90), .02); }
for (let i = 0; i < N; i++) { const f = Math.min(1, i / SR / 1.5, (V.duration - i / SR) / 2.2); L[i] *= f; R[i] *= f; }
for (const [t, name] of V.sfx) SFX[name](t);
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = .89 / peak, buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(Math.tanh(L[i] * g) * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Math.tanh(R[i] * g) * 32767), 46 + i * 4); }
const out = path.join(process.env.OUT_DIR || path.join(__dirname, 'out'), slug); fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'audio.wav'), buf); console.log(slug, 'audio ok');
