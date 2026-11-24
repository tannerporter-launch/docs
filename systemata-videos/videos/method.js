// Video 2: The Systemata Method (46s)
const STAGES = [
  ['Audit & Document', 'Audit and Document', 'Map how the business actually runs: every system, workflow and process.'],
  ['Identify & Diagnose', 'Identify and Diagnose', 'Find the bottlenecks, inefficiencies and unnecessary complexity.'],
  ['Simplify & Standardize', 'Simplify and Standardize', 'Fewer steps. Clear, consistent, repeatable workflows.'],
  ['Automate & Train', 'Automate and Train', 'Automate the clean process, then train your people to run it.'],
];
const T0 = 5, DUR = 8.5, END = T0 + 4 * DUR; // stages 5..39
const sfx = [[0.2, 'swell'], [0.9, 'pop']];
for (let i = 0; i < 4; i++) { const a = T0 + i * DUR; sfx.push([a, 'whoosh'], [a + .5, 'pop']); }
sfx.push([T0 + 3.0, 'tick'], [T0 + 3.8, 'tick'], [T0 + 4.6, 'tick'], [T0 + DUR + 3.2, 'thump'], [T0 + 2 * DUR + 3.5, 'chime'], [T0 + 3 * DUR + 3.2, 'tick'], [T0 + 3 * DUR + 4.4, 'tick'], [T0 + 3 * DUR + 5.6, 'chime'],
  [END, 'whoosh'], [END + .7, 'pop'], [END + 3.4, 'chime'], [END + 5.2, 'pop']);
module.exports = {
  name: 'method', duration: 46, sfx,
  draw(c, t, L) {
    const C = L.C, eo = L.eo, prog = L.prog, X = 1010, Y = 250, W = 830, H = 700;
    // ---- intro
    let a = L.env(t, 0, 5, .1, .5);
    if (a > 0) { c.save(); c.globalAlpha = a;
      L.words(c, [['The Systemata ', C.ink], ['Method', C.blue]], 960, 450, { size: 140, maxW: 1800 }, t, .3, .15);
      L.words(c, 'Four stages. One rule.', 960, 640, { size: 60, weight: 500, color: C.mut }, t, 2.2, .1);
      L.words(c, [['Simplify first, ', C.ink], ['automate last.', C.blue]], 960, 740, { size: 60, weight: 700 }, t, 3.0, .1); c.restore(); }
    // ---- stages
    const blk = L.env(t, T0, END + .4, .5, .5);
    if (blk > 0) {
      c.save(); c.globalAlpha = blk;
      const idx = Math.min(3, Math.floor((t - T0) / DUR)); let px = 110;
      STAGES.forEach(([short], i) => { const on = i === idx; px += L.pill(c, `${i + 1}  ${short}`, px, 140, { size: 24, h: 52, fill: on ? C.blue : C.card, color: on ? '#fff' : C.mut, stroke: on ? null : C.line }) + 16; });
      STAGES.forEach(([, title, line], i) => {
        const a0 = T0 + i * DUR, e = L.env(t, a0 + .05, a0 + DUR - .05, .5, .45); if (e <= 0) return; const s = t - a0;
        c.save(); c.globalAlpha *= e;
        L.text(c, '0' + (i + 1), 104, 420, { size: 210, weight: 800, color: C.blue2 });
        const th = L.words(c, title, 110, 560, { size: 78, weight: 800, align: 'left', maxW: 800, lh: 1.1 }, t, a0 + .35, .09);
        L.words(c, line, 112, 560 + th + 10, { size: 38, weight: 500, color: C.mut, align: 'left', maxW: 780, lh: 1.35 }, t, a0 + 1.0, .05, .4);
        L.card(c, X, Y, W, H, { r: 36, alpha: eo(prog(s, .1, .7)) });
        c.save(); c.translate(X, Y); c.globalAlpha *= eo(prog(s, .4, 1));
        [illus1, illus2, illus3, illus4][i](c, s, L, C); c.restore(); c.restore(); });
      c.restore();
    }
    // ---- closer
    a = L.env(t, END, 46.2, .5, .1);
    if (a > 0) { c.save(); c.globalAlpha = a;
      L.endLogo(c, t, END + .3);
      L.words(c, [["You can't automate ", C.ink], ['chaos.', C.warm]], 960, 430, { size: 118, maxW: 1700 }, t, END + .5, .13);
      L.words(c, 'Simplify first, automate last.', 960, 620, { size: 64, weight: 700, color: C.blue }, t, END + 2.2, .1);
      const u = eo(prog(t, END + 4.4, END + 5.2)); c.save(); c.globalAlpha *= u; L.rrect(c, 960 - 520, 760 + (1 - u) * 30, 1040, 110, 55); c.fillStyle = C.deep; c.fill();
      L.text(c, 'Book a free 15-minute call  ·  systematagrowth.com', 960, 827 + (1 - u) * 30, { size: 34, weight: 700, color: '#fff', align: 'center' }); c.restore(); c.restore(); }
  }
};

function illus1(c, s, L, C) { // messy boxes get scanned and documented
  const names = ['Lead intake', 'Sales calls', 'Follow-up', 'Proposals', 'Onboarding', 'Billing', 'Hiring', 'Reporting', 'Tools'];
  const scan = L.prog(s, 1.2, 5.6), sx = 60 + scan * 710;
  names.forEach((n, i) => {
    const col = i % 3, row = Math.floor(i / 3), bx = 60 + col * 250, by = 90 + row * 190, cx = bx + 105, d = L.eo(L.prog(sx, cx - 40, cx + 30));
    const rot = (L.rnd(i, 1) - .5) * .32 * (1 - d), ox = (L.rnd(i, 2) - .5) * 34 * (1 - d), oy = (L.rnd(i, 3) - .5) * 34 * (1 - d);
    c.save(); c.translate(bx + 105 + ox, by + 65 + oy); c.rotate(rot); L.rrect(c, -105, -65, 210, 130, 18); c.fillStyle = d > .5 ? C.blue2 : C.warm2; c.fill(); c.lineWidth = 3; c.strokeStyle = d > .5 ? C.blue : C.warm; c.stroke();
    L.text(c, n, 0, 8, { size: 28, weight: 700, align: 'center', color: C.ink });
    if (d > 0) L.icon(c, 'doc', 72, -38, 34 * d, C.blue, d); c.restore(); });
  if (scan > 0 && scan < 1) { c.save(); c.fillStyle = C.blue; c.globalAlpha *= .9; c.fillRect(sx - 2, 60, 4, 590); const g = c.createLinearGradient(sx - 120, 0, sx, 0); g.addColorStop(0, 'rgba(59,91,255,0)'); g.addColorStop(1, 'rgba(59,91,255,.18)'); c.fillStyle = g; c.fillRect(sx - 120, 60, 120, 590); c.restore(); }
  L.text(c, scan >= 1 ? 'Documented' : 'Scanning…', 415, 690, { size: 26, weight: 700, color: scan >= 1 ? C.blue : C.mut, align: 'center' });
}
function illus2(c, s, L, C) { // find the bottleneck
  const names = ['Lead', 'Qualify', 'Proposal', 'Approval', 'Close'], y = 280, ly = y + 105;
  const Q = { t0: .6, dt: .55, x0: 30, sp: 300, gateX: 440, gap: 30, p0: 2, pdt: 1.9, sp2: 300 };
  c.strokeStyle = C.line; c.lineWidth = 4; c.beginPath(); c.moveTo(30, ly); c.lineTo(800, ly); c.stroke();
  names.forEach((n, i) => { const bx = 40 + i * 150, hot = i === 3 && s > 2.4; L.rrect(c, bx, y - 50, 120, 100, 20); c.fillStyle = hot ? C.warm2 : C.blue2; c.fill(); c.lineWidth = 3; c.strokeStyle = hot ? C.warm : C.blue; c.stroke();
    L.text(c, n, bx + 60, y + 8, { size: 24, weight: 700, align: 'center' }); if (i < 4) { c.strokeStyle = C.line; c.lineWidth = 4; c.beginPath(); c.moveTo(bx + 120, y); c.lineTo(bx + 150, y); c.stroke(); } });
  for (let i = 0; i < 12; i++) { const q = L.queuePos(i, s, Q); if (!q || q.x > 800) continue; L.dot(c, q.x, ly, 11, q.passed ? C.blue : C.warm); }
  const r = L.eo(L.prog(s, 2.4, 3.4)); if (r > 0) { c.save(); c.globalAlpha *= r; c.beginPath(); c.arc(40 + 3 * 150 + 60, y, 40 + 55 * r, 0, 6.2832); c.lineWidth = 6; c.strokeStyle = C.warm; c.setLineDash([14, 10]); c.stroke(); c.restore();
    L.pill(c, 'Bottleneck', 40 + 3 * 150 + 60 - 90, y + 170, { size: 26, h: 52, fill: C.warm, color: '#fff', alpha: r }); }
  const r2 = L.eo(L.prog(s, 4.4, 5.2)); if (r2 > 0) { L.pill(c, 'Extra hand-offs', 90, y - 170, { size: 26, h: 52, fill: C.warm2, color: C.warm, stroke: C.warm, alpha: r2 }); c.save(); c.globalAlpha *= r2; c.strokeStyle = C.warm; c.lineWidth = 3; c.beginPath(); c.moveTo(200, y - 114); c.lineTo(205, y - 62); c.stroke(); c.restore(); }
  L.text(c, 'Unnecessary complexity, found.', 415, 640, { size: 28, weight: 600, color: C.mut, align: 'center', alpha: L.eo(L.prog(s, 5.6, 6.4)) });
}
function illus3(c, s, L, C) { // tangle straightens out
  const perm = [3, 0, 5, 2, 4, 1], u = L.eio(L.prog(s, 1.4, 5)), yy = i => 110 + i * 100;
  for (let i = 0; i < 6; i++) {
    const yl = yy(i), yr = L.lerp(yy(perm[i]), yy(i), u), amp = (1 - u) * 160, sgn = i % 2 ? 1 : -1;
    const p0 = [130, yl], p3 = [700, yr], p1 = [330, yl + sgn * amp], p2 = [500, yr - sgn * amp];
    c.beginPath(); c.moveTo(...p0); c.bezierCurveTo(...p1, ...p2, ...p3); c.lineWidth = 6; c.strokeStyle = u > .8 ? C.blue : u > .4 ? '#8d6bd0' : C.warm; c.globalAlpha *= 1; c.stroke(); }
  for (let i = 0; i < 6; i++) { L.dot(c, 130, yy(i), 24, C.ink); L.dot(c, 700, L.lerp(yy(perm[i]), yy(i), u), 24, C.ink); }
  L.text(c, u >= 1 ? 'One clear, repeatable flow' : 'Simplifying…', 415, 690, { size: 28, weight: 700, color: u >= 1 ? C.blue : C.mut, align: 'center' });
}
function illus4(c, s, L, C) { // automate, then train
  const y = 230, xs = [90, 270, 450, 630];
  for (let i = 0; i < 3; i++) { c.strokeStyle = C.line; c.lineWidth = 5; c.beginPath(); c.moveTo(xs[i] + 80, y); c.lineTo(xs[i + 1], y); c.stroke(); }
  xs.forEach((x, i) => { const on = L.eo(L.prog(s, 1 + i * .4, 1.6 + i * .4)); L.rrect(c, x, y - 60, 110, 120, 22); c.fillStyle = L.C.blue2; c.fill(); c.strokeStyle = C.blue; c.lineWidth = 3; c.stroke(); L.icon(c, 'bolt', x + 55, y, 56 * (.6 + .4 * on), C.blue, on); });
  if (s > 2.6) for (let m = 0; m < 5; m++) { const u = L.frac(s * .45 + m * .2); L.dot(c, 70 + u * 700, y, 10, C.blue, L.eo(L.prog(s, 2.6, 3.2))); }
  L.text(c, 'Automated', 415, 380, { size: 28, weight: 700, color: C.blue, align: 'center', alpha: L.eo(L.prog(s, 2.4, 3)) });
  const ppl = ['Sales', 'Ops', 'Admin'];
  ppl.forEach((n, i) => { const x = 175 + i * 240, a = L.eo(L.prog(s, 3.6 + i * .5, 4.2 + i * .5)), ck = L.eo(L.prog(s, 4.8 + i * .5, 5.3 + i * .5));
    L.dot(c, x, 520, 54, C.blue2, a); L.icon(c, 'person', x, 515, 70, C.blue, a); L.text(c, n, x, 620, { size: 26, weight: 600, align: 'center', alpha: a });
    L.dot(c, x + 40, 480, 20, C.ok, ck); L.icon(c, 'check', x + 40, 480, 26, '#fff', ck); });
  L.text(c, 'Your team, trained to run it', 415, 685, { size: 28, weight: 700, color: C.mut, align: 'center', alpha: L.eo(L.prog(s, 5.8, 6.4)) });
}
