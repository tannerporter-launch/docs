// Soundtrack as a function of t: music bed + UI sound effects, all synthesized from math. Writes out/audio.wav
const fs = require('fs'), path = require('path'), E = require('./timeline.js');
const SR = 44100, N = Math.ceil(E.duration * SR), L = new Float32Array(N), R = new Float32Array(N);
let seed = 7; const noise = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 * 2 - 1; };
const TAU = Math.PI * 2;
function add(t, dur, fn, gain = 1, pan = 0) {
  const i0 = Math.floor(t * SR), n = Math.floor(dur * SR), l = Math.cos((pan + 1) * Math.PI / 4), r = Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < n && i0 + i < N; i++) { const s = fn(i / SR, i / n) * gain; L[i0 + i] += s * l; R[i0 + i] += s * r; }
}
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
// ---- SFX
const click = (t, g = 1) => add(t, .08, (x) => Math.sin(TAU * 1900 * x) * Math.exp(-x * 110) * .5 + noise() * Math.exp(-x * 500) * .3, .5 * g);
const grab = t => add(t, .12, x => Math.sin(TAU * 520 * x) * Math.exp(-x * 45) * .6 + noise() * Math.exp(-x * 300) * .2, .5);
const key = (t, i) => add(t, .06, x => Math.sin(TAU * (1100 + 500 * ((i * 37) % 7) / 7) * x) * Math.exp(-x * 230) * .35 + noise() * Math.exp(-x * 700) * .25, .35, ((i * 13) % 5 - 2) / 12);
const whoosh = (t, dur = .55) => { let y = 0; add(t, dur, (x, u) => { y += (.02 + .35 * Math.sin(Math.PI * u)) * (noise() - y); return y * Math.pow(Math.sin(Math.PI * u), 2) * 2.2 }, .35); };
const thump = t => { let ph = 0; add(t, .3, x => { ph += TAU * (45 + 110 * Math.exp(-x * 28)) / SR; return Math.sin(ph) * Math.exp(-x * 11) }, .7); };
const bell = (t, f, g = .16) => add(t, 1.6, x => (Math.sin(TAU * f * x) + .35 * Math.sin(TAU * f * 2.76 * x) * Math.exp(-x * 3)) * Math.exp(-x * 3.2), g, (f % 7) / 7 - .5);
const chime = t => [659.25, 830.61, 987.77, 1318.5].forEach((f, i) => bell(t + i * .07, f));
const pop = t => { let ph = 0; add(t, .16, (x) => { ph += TAU * (350 + 450 * Math.min(1, x / .07)) / SR; return Math.sin(ph) * Math.exp(-x * 26) }, .3); };
const ding = t => bell(t, 1046.5, .1);

// ---- music bed: 96bpm, Cmaj7 - Am7 - Fmaj7 - G6, soft pad + plucked arpeggio + sub
const beat = 60 / 96, bar = beat * 4;
const chords = [[48, 52, 55, 59], [45, 48, 52, 55], [41, 45, 48, 52], [43, 47, 50, 52]];
const fadeIO = t => Math.min(1, t / 1.5, (E.duration - t) / 2.2);
for (let b = 0; b * bar < E.duration; b++) {
  const c = chords[b % 4], t0 = b * bar;
  c.forEach((m, k) => add(t0, bar + .6, (x) => { const a = Math.min(1, x / .6) * Math.min(1, (bar + .6 - x) / .6); return (Math.sin(TAU * hz(m + 12) * x) + .4 * Math.sin(TAU * hz(m + 12) * 1.004 * x)) * a * .5 }, .05, k / 3 - .5));
  add(t0, beat * 3, x => Math.sin(TAU * hz(c[0] - 12) * x) * Math.exp(-x * 1.4) * Math.min(1, x / .02), .16);
  for (let s = 0; s < 8; s++) { const m = c[[0, 2, 1, 3, 2, 1, 3, 2][s]] + 24, ts = t0 + s * beat / 2;
    add(ts, .6, x => (Math.sin(TAU * hz(m) * x) + .3 * Math.sin(TAU * hz(m) * 2 * x)) * Math.exp(-x * 7) * Math.min(1, x / .004), .06 * (s % 2 ? .7 : 1), s % 2 ? .3 : -.3); }
  for (let s = 0; s < 4; s++) add(t0 + s * beat + beat / 2, .05, x => noise() * Math.exp(-x * 90), .02);
}
for (let i = 0; i < N; i++) { const f = fadeIO(i / SR); L[i] *= 1; R[i] *= 1; if (i / SR < 1.5 || i / SR > E.duration - 2.2) { /* fades apply to music only below */ } }
// ---- apply music fade by rebuilding: simplest is to scale everything near ends (SFX are absent there)
for (let i = 0; i < N; i++) { const f = fadeIO(i / SR); L[i] *= f; R[i] *= f; }
// ---- sync SFX to the shared timeline
E.clicks().forEach(t => t === E.grab ? grab(t) : click(t));
[E.fName, E.fCo, E.fVal, E.note].forEach((f, j) => E.charTimes(f).forEach((t, i) => key(t, i + j * 3)));
[E.navPipe.click + .1, E.navCont.click + .1, E.navDash.click + .1, E.drawerOpen, E.drawerClose].forEach(t => whoosh(t, .5));
whoosh(1.6, .9); whoosh(E.endCard - .1, .9);
pop(E.modalOpen); pop(E.newDeal); pop(E.modalClose - .0, .1);
thump(E.drop); chime(E.drop + .05); ding(E.toasts[1].t); ding(E.toasts[2].t);

let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = .89 / peak, buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(Math.tanh(L[i] * g) * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Math.tanh(R[i] * g) * 32767), 46 + i * 4); }
const out = process.env.OUT_DIR || path.join(__dirname, 'out'); fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'audio.wav'), buf); console.log('audio.wav', (E.duration).toFixed(1) + 's, peak', peak.toFixed(2));
