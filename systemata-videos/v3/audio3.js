// SFX synthesized from math at 48k (node) -> music composed as MIDI (music3.py) -> FluidSynth -> Pedalboard master (master.py).  node audio3.js <slug>
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const slug = process.argv[2], V = require('./videos/' + slug + '.js'), SR = 48000, N = Math.ceil(V.duration * SR), TAU = Math.PI * 2;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 11; const noise = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 * 2 - 1; };
function add(t, dur, fn, gain = 1, pan = 0) { const i0 = Math.floor(t * SR), n = Math.floor(dur * SR), l = Math.cos((pan + 1) * Math.PI / 4), r = Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < n && i0 + i < N; i++) { if (i0 + i < 0) continue; const s = fn(i / SR, i / n) * gain; L[i0 + i] += s * l; R[i0 + i] += s * r; } }
const bell = (t, f, g, pan = 0, dec = 3.2, len = 2.2) => add(t, len, x => (Math.sin(TAU * f * x) + .32 * Math.sin(TAU * f * 2.76 * x) * Math.exp(-x * 4) + .12 * Math.sin(TAU * f * 5.4 * x) * Math.exp(-x * 9)) * Math.exp(-x * dec) * Math.min(1, x / .004), g, pan);
let kc = 0;
const SFX = {
  tick: t => add(t, .07, x => Math.sin(TAU * 2600 * x) * Math.exp(-x * 150) * .5 + noise() * Math.exp(-x * 700) * .18, .30, ((kc++ * 37) % 9 - 4) / 14),
  pop: t => { let ph = 0; add(t, .2, x => { ph += TAU * (380 + 380 * Math.min(1, x / .06)) / SR; return (Math.sin(ph) + .25 * Math.sin(2 * ph)) * Math.exp(-x * 22) * Math.min(1, x / .002); }, .22); },
  swish: t => { let y = 0, z = 0; add(t, .6, (x, u) => { y += .05 * (noise() - y); z += .09 * (y - z); return z * Math.pow(Math.sin(Math.PI * u), 2.2) * 3.2; }, .075); },          // intentionally very quiet
  riser: t => { let ph = 0, y = 0; add(t, 1.4, (x, u) => { ph += TAU * (200 * Math.pow(5.5, u)) / SR; y += (.02 + .2 * u) * (noise() - y); return (Math.sin(ph) * .5 + y * 1.6) * Math.pow(u, 2.2); }, .12); },
  impact: t => { let ph = 0; add(t, 1.6, x => { ph += TAU * (38 + 36 * Math.exp(-x * 14)) / SR; return Math.sin(ph) * Math.exp(-x * 2.8) * .95 + noise() * Math.exp(-x * 14) * .22; }, .5); },
  chime: t => [880, 1108.7, 1318.5, 1760].forEach((f, i) => bell(t + i * .08, f, .12, (i - 1.5) / 4)),
  success: t => { bell(t, 783.99, .14, -.1); bell(t + .1, 1174.66, .14, .1); },
  logo: t => { [329.63, 440, 554.37, 659.25].forEach((f, i) => add(t, 3, (x, u) => Math.sin(TAU * f * x) * Math.min(1, x / .25) * Math.exp(-x * 1.1), .07, (i - 1.5) / 3)); [1318.5, 1760, 2217.5].forEach((f, i) => bell(t + .3 + i * .12, f, .08, (i - 1) / 2, 2.6, 2.8)); },
};
for (const [t, name] of V.sfx) SFX[name](t);
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); const g = Math.min(1, .9 / Math.max(peak, 1e-6)), buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
const out = path.join(process.env.OUT_DIR || path.join(__dirname, 'out'), slug), p = f => path.join(out, f); fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(p('sfx_dry.wav'), buf);
fs.writeFileSync(p('spec.json'), JSON.stringify({ slug, duration: V.duration, bpm: V.bpm, energy: V.energy, sfx_gain: g }));
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'ignore', 'inherit'] });
run('python3', [path.join(__dirname, 'music3.py'), p('spec.json'), p('music.mid')]);
run('fluidsynth', ['-ni', '-q', '-g', '0.8', '-r', String(SR), '-F', p('music_raw.wav'), '/usr/share/sounds/sf2/FluidR3_GM.sf2', p('music.mid')]);
run('python3', [path.join(__dirname, 'master.py'), p('spec.json'), p('music_raw.wav'), p('sfx_dry.wav'), p('audio.wav')]);
console.log(slug, 'audio mastered');
