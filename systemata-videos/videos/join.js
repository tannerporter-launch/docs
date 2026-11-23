// Video 4: Join Systemata (38s)
const VALUES = [
  ['Deliberate', 'Making intentional decisions and taking purposeful action.'],
  ['Clear', 'Prioritizing simplicity, transparency, and understanding.'],
  ['Innovative', 'Finding better ways to solve problems and improve systems.'],
  ['Proactive', 'Anticipating needs and addressing problems before they escalate.'],
  ['Respectful', 'Treating clients, partners, and others with consideration and professionalism.'],
  ['Humble', 'Remaining open to feedback, learning, and improvement.'],
  ['Reliable', 'Following through on commitments and consistently delivering results.'],
];
const V0 = 12.5, VD = 2.5;
const sfx = [[0.2, 'swell'], [0.9, 'pop'], [4.9, 'whoosh'], [5.6, 'pop'], [V0 - .2, 'whoosh']];
VALUES.forEach((_, i) => sfx.push([V0 + i * VD + .1, 'pop']));
sfx.push([V0 + 7 * VD, 'whoosh'], [31, 'chime'], [33.2, 'pop']);
module.exports = {
  name: 'join', duration: 38, sfx,
  draw(c, t, L) {
    const C = L.C, eo = L.eo, prog = L.prog;
    let a = L.env(t, 0, 5, .1, .5);
    if (a > 0) { c.save(); c.globalAlpha = a;
      L.words(c, [['Join ', C.ink], ['Systemata.', C.blue]], 960, 460, { size: 170 }, t, .3, .2);
      L.words(c, 'Help growing businesses trade chaos for clarity.', 960, 680, { size: 56, weight: 500, color: C.mut, maxW: 1500 }, t, 2.0, .1); c.restore(); }
    a = L.env(t, 5, 12.8, .5, .5);
    if (a > 0) { c.save(); c.globalAlpha = a;
      L.text(c, 'WHAT WE DO', 960, 260, { size: 26, weight: 800, color: C.blue, align: 'center', ls: 5, alpha: eo(prog(t, 5.2, 5.8)) });
      L.words(c, 'We build lead generation and client acquisition systems.', 960, 380, { size: 84, maxW: 1500 }, t, 5.6, .09);
      L.words(c, 'For established, service-based businesses ready to grow.', 960, 630, { size: 46, weight: 500, color: C.mut, maxW: 1400 }, t, 8.2, .06);
      // chaos -> clarity line
      const u = L.eio(prog(t, 9.2, 11.6)), y0 = 820, n = 60; c.beginPath();
      for (let i = 0; i <= n; i++) { const x = 260 + i * (1400 / n), k = (1 - u), yy = y0 + k * (Math.sin(i * .9 + 1) * 42 + Math.sin(i * 2.3) * 26 + Math.cos(i * .37) * 30); i ? c.lineTo(x, yy) : c.moveTo(x, yy); }
      c.lineWidth = 8; c.lineJoin = 'round'; c.lineCap = 'round'; c.strokeStyle = u > .98 ? C.blue : u > .5 ? '#8d6bd0' : C.warm; c.globalAlpha *= eo(prog(t, 9, 9.6)); c.stroke(); c.restore(); }
    a = L.env(t, V0 - .3, V0 + 7 * VD + .2, .5, .5);
    if (a > 0) { c.save(); c.globalAlpha = a;
      const idx = Math.min(6, Math.max(0, Math.floor((t - V0) / VD)));
      L.text(c, 'OUR VALUES', 140, 250, { size: 26, weight: 800, color: C.blue, ls: 5 });
      VALUES.forEach(([n, d], i) => { const e = L.env(t, V0 + i * VD, V0 + (i + 1) * VD, .35, .3); if (e <= 0) return; const s = t - (V0 + i * VD);
        c.save(); c.globalAlpha *= e; L.text(c, n, 140, 520, { size: 170, weight: 800, color: C.blue, alpha: 1 });
        L.words(c, d, 144, 640, { size: 46, weight: 500, color: C.ink, align: 'left', maxW: 840, lh: 1.3 }, t, V0 + i * VD + .25, .05, .35); c.restore(); });
      VALUES.forEach(([n], i) => { const on = i === idx, x = 1160, y = 180 + i * 98, e = eo(prog(t, V0 + i * .08, V0 + .5 + i * .08));
        c.save(); c.globalAlpha *= e; c.translate(on ? 14 : 0, 0); L.card(c, x, y, 560, 82, { r: 41, fill: on ? C.blue : C.card, shadow: on });
        L.dot(c, x + 41, y + 41, 14, on ? '#fff' : C.blue2); L.text(c, n, x + 80, y + 54, { size: 36, weight: 700, color: on ? '#fff' : C.ink }); c.restore(); });
      c.restore(); }
    a = L.env(t, V0 + 7 * VD, 38.4, .5, .1);
    if (a > 0) { c.save(); c.globalAlpha = a; const s0 = V0 + 7 * VD;
      L.words(c, [['If this sounds like you, ', C.ink], ['let’s talk.', C.blue]], 960, 420, { size: 118, maxW: 1500 }, t, s0 + .6, .14);
      const u = eo(prog(t, 33.2, 34)); c.save(); c.globalAlpha *= u; L.rrect(c, 960 - 330, 690 + (1 - u) * 30, 660, 110, 55); c.fillStyle = C.ink; c.fill();
      L.text(c, 'Learn more  ·  getsystemata.com', 960, 757 + (1 - u) * 30, { size: 38, weight: 700, color: '#fff', align: 'center' }); c.restore(); c.restore(); }
  }
};
