// Video 3: How a Systemata engagement works (48s)
const STEPS = [
  ['calendar', 'Book a call', 'A short conversation about your lead generation and client acquisition goals.'],
  ['doc', 'Lock the scope', 'We define exactly what gets built, and the price, before work begins.'],
  ['gear', 'We build it', 'We consult, design and implement your system using The Systemata Method.'],
  ['check', 'Delivered', 'A working system, handed over and your team trained to run it.'],
];
const S0 = 6, SD = 7;
const sfx = [[0.2, 'swell'], [0.9, 'pop'], [5.5, 'whoosh']];
STEPS.forEach((_, i) => sfx.push([S0 + i * SD, 'pop'], [S0 + i * SD + .15, 'tick']));
sfx.push([34.5, 'whoosh'], [36.0, 'thump'], [36.2, 'chime'], [43, 'whoosh'], [44.6, 'chime'], [45.8, 'pop']);
module.exports = {
  name: 'engagement', duration: 48, sfx,
  draw(c, t, L) {
    const C = L.C, eo = L.eo, prog = L.prog;
    let a = L.env(t, 0, 5.6, .1, .5);
    if (a > 0) { c.save(); c.globalAlpha = a;
      L.words(c, [['How a ', C.ink], ['Systemata ', C.blue], ['engagement works', C.ink]], 960, 440, { size: 110, maxW: 1600 }, t, .3, .13);
      L.words(c, 'Fixed scope. Fixed price. Delivered.', 960, 700, { size: 56, weight: 500, color: C.mut }, t, 2.6, .12); c.restore(); }
    a = L.env(t, 5.6, 35.2, .5, .5);
    if (a > 0) { c.save(); c.globalAlpha = a;
      const cw = 380, ch = 520, gap = 50, x0 = (1920 - (4 * cw + 3 * gap)) / 2, cy = 330;
      // progress line
      const lineY = 270, total = 4 * cw + 3 * gap, prg = L.clamp((t - S0) / (3 * SD + 1.5));
      c.strokeStyle = C.line; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0 + cw / 2, lineY); c.lineTo(x0 + total - cw / 2, lineY); c.stroke();
      c.strokeStyle = C.blue; c.beginPath(); c.moveTo(x0 + cw / 2, lineY); c.lineTo(x0 + cw / 2 + (total - cw) * prg, lineY); c.stroke();
      STEPS.forEach(([ic, h, d], i) => {
        const st = S0 + i * SD, s = t - st, u = eo(prog(s, 0, .7)), x = x0 + i * (cw + gap), cx = x + cw / 2, active = t >= st && t < st + SD, y = cy + (1 - u) * 60;
        if (u <= 0) return; const dim = i < Math.floor((t - S0) / SD) ? .6 : 1;
        L.dot(c, cx, lineY, 26, C.blue, u); L.text(c, String(i + 1), cx, lineY + 10, { size: 28, weight: 800, color: '#fff', align: 'center', alpha: u });
        c.save(); c.globalAlpha *= u * dim; const sc = active ? 1 + .02 * Math.sin(Math.min(1, s) * Math.PI) : 1;
        c.translate(cx, y + ch / 2); c.scale(sc, sc); c.translate(-cx, -(y + ch / 2));
        L.card(c, x, y, cw, ch, { r: 32, stroke: active ? C.blue : null, lw: 4 });
        L.dot(c, cx, y + 110, 70, C.blue2); L.icon(c, ic, cx, y + 110, 90, C.blue);
        L.text(c, 'STEP ' + (i + 1), cx, y + 240, { size: 24, weight: 800, color: C.blue, align: 'center', ls: 3 });
        L.text(c, h, cx, y + 300, { size: 44, weight: 800, align: 'center' });
        L.words(c, d, cx, y + 368, { size: 29, weight: 500, color: C.mut, maxW: 310, lh: 1.35 }, t, st + .5, .035, .3); c.restore(); });
      c.restore(); }
    // guarantee
    a = L.env(t, 35.2, 43.2, .6, .5);
    if (a > 0) { c.save(); c.globalAlpha = a; const u = eo(prog(t, 35.4, 36.2));
      L.card(c, 260, 260 + (1 - u) * 40, 1400, 520, { r: 44, alpha: u });
      L.dot(c, 960, 350 + (1 - u) * 40, 54, C.blue, u); L.icon(c, 'check', 960, 350 + (1 - u) * 40, 70, '#fff', u);
      L.text(c, 'THE SYSTEMATA GUARANTEE', 960, 470, { size: 26, weight: 800, color: C.blue, align: 'center', ls: 4, alpha: u });
      L.words(c, [['Fixed scope, fixed price, delivered', C.ink], [' or you don’t pay.', C.blue]], 960, 580, { size: 74, maxW: 1200, lh: 1.15 }, t, 36.6, .16, .55); c.restore(); }
    a = L.env(t, 43.2, 48.4, .5, .1);
    if (a > 0) { c.save(); c.globalAlpha = a;
      L.words(c, [['Trading chaos', C.warm], ['for clarity.', C.blue]], 960, 430, { size: 130, maxW: 1100 }, t, 43.6, .2, .7);
      const u = eo(prog(t, 45.6, 46.4)); c.save(); c.globalAlpha *= u; L.rrect(c, 960 - 330, 700 + (1 - u) * 30, 660, 110, 55); c.fillStyle = C.ink; c.fill();
      L.text(c, 'Book a call  ·  getsystemata.com', 960, 767 + (1 - u) * 30, { size: 38, weight: 700, color: '#fff', align: 'center' }); c.restore(); c.restore(); }
  }
};
