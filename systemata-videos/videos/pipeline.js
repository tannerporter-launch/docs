// Video 1: "My pipeline shouldn't depend on me" (34s)
const Q = { t0: .5, dt: .3, x0: -40, sp: 420, gateX: 800, gap: 34, p0: 1.4, pdt: 1.25, sp2: 520 }; // founder bottleneck
const passTimes = [0, 1, 2, 3, 4, 5].map(i => 4.8 + Q.p0 + i * Q.pdt);
const sfx = [[0.2, 'swell'], [4.8, 'whoosh'], [5.5, 'pop'], [12.4, 'whoosh'], [13.1, 'pop'], [21.4, 'whoosh'], [22.5, 'pop'], [23.3, 'pop'], [24.1, 'pop'], [26.3, 'whoosh'], [28.4, 'whoosh'], [29.4, 'chime'], [31.0, 'pop']];
passTimes.forEach(t => sfx.push([t + .45, 'tick']));
for (let k = 0; k < 6; k++) sfx.push([15.4 + k * .9, 'tick']);
module.exports = {
  name: 'pipeline', duration: 34, sfx,
  draw(c, t, L) {
    const C = L.C, eo = L.eo, prog = L.prog;
    const slots = (x, y, filled, a) => { // "Booked calls" box
      L.card(c, x, y, 320, 300, { alpha: a }); L.text(c, 'Booked calls', x + 160, y + 52, { size: 30, weight: 700, align: 'center', alpha: a });
      for (let i = 0; i < 6; i++) { const sx = x + 36 + (i % 3) * 98, sy = y + 90 + Math.floor(i / 3) * 100, on = i < filled; L.rrect(c, sx, sy, 80, 80, 16);
        c.save(); c.globalAlpha *= a; c.fillStyle = on ? C.blue : C.paper; c.fill(); c.strokeStyle = on ? C.blue : C.line; c.lineWidth = 3; c.stroke(); c.restore();
        if (on) L.icon(c, 'check', sx + 40, sy + 40, 52, '#fff', a); }
    };
    // ---- A: headline
    let a = L.env(t, 0, 4.8, .1, .5);
    if (a > 0) { c.save(); c.globalAlpha = a;
      L.words(c, [["My pipeline shouldn't depend", C.ink], ['on me.', C.warm]], 960, 470, { size: 128, maxW: 1500 }, t, .3, .12);
      L.text(c, 'Lead generation and client acquisition systems', 960, 800, { size: 38, weight: 500, color: C.mut, align: 'center', alpha: eo(prog(t, 2.6, 3.4)) }); c.restore(); }
    // ---- B + C: the YOU bottleneck, then the system
    const bC = L.env(t, 4.8, 21.4, .5, .5);
    if (bC > 0) {
      c.save(); c.globalAlpha = bC;
      const sB = t - 4.8, bA = 1 - prog(t, 12.0, 12.8);
      if (bA > 0) { c.save(); c.globalAlpha *= bA;
        L.words(c, 'Every lead goes through you.', 960, 190, { size: 72 }, t, 5.3, .1);
        L.words(c, [['Follow-ups slip. ', C.mut], ['Growth waits on your calendar.', C.mut]], 960, 930, { size: 44, weight: 500 }, t, 8.6, .08);
        for (let i = 0; i < 22; i++) { const q = L.queuePos(i, sB, Q); if (!q) continue; const y = 540 + ((i * 37) % 5 - 2) * 20; L.dot(c, q.x, y, 15, q.passed ? C.blue : C.warm); }
        slots(1480, 390, Math.min(6, passTimes.filter(p => t > p + 1.5).length), 1); c.restore(); }
      // C: system
      const cA = prog(t, 12.6, 13.6);
      if (cA > 0) { c.save(); c.globalAlpha *= cA;
        L.words(c, 'A pipeline that runs without you.', 960, 190, { size: 72 }, t, 13.1, .09);
        L.text(c, 'Built once. Working every day.', 960, 930, { size: 44, weight: 500, color: C.mut, align: 'center', alpha: eo(prog(t, 17, 17.8)) });
        const sC = t - 12.4, ch = [['Outbound email', 300], ['LinkedIn outreach', 470], ['Paid ads', 640]];
        ch.forEach(([n, y], k) => { L.card(c, 130, y, 360, 120, { r: 24, alpha: eo(prog(sC, .5 + k * .2, 1.1 + k * .2)) });
          L.icon(c, k === 0 ? 'chat' : k === 1 ? 'person' : 'bolt', 190, y + 60, 56, C.blue, eo(prog(sC, .7 + k * .2, 1.3 + k * .2)));
          L.text(c, n, 240, y + 72, { size: 32, weight: 600, alpha: eo(prog(sC, .7 + k * .2, 1.3 + k * .2)) }); });
        L.card(c, 760, 440, 340, 200, { r: 28, fill: C.blue, shadow: true, alpha: eo(prog(sC, 1.2, 1.9)) });
        L.text(c, 'Booking', 930, 560, { size: 44, weight: 700, color: '#fff', align: 'center', alpha: eo(prog(sC, 1.4, 2)) });
        const f = Math.min(6, Math.max(0, Math.floor((sC - 3.2) / .9) + 1)); slots(1480, 390, f, eo(prog(sC, 1.6, 2.3)));
        if (sC > 2.2) { const fl = eo(prog(sC, 2.2, 3));
          ch.forEach(([n, y], k) => { for (let m = 0; m < 4; m++) { const u = L.frac(sC * .5 + m * .25 + k * .13), p = L.bez([490, y + 60], [640, y + 60], [640, 540], [760, 540], u); L.dot(c, p[0], p[1], 12, C.blue, fl); } });
          for (let m = 0; m < 5; m++) { const u = L.frac(sC * .6 + m * .2), p = L.bez([1100, 540], [1250, 540], [1330, 540], [1480, 540], u); L.dot(c, p[0], p[1], 12, C.blue, fl); } }
        c.restore(); }
      // the founder, drawn once and moved
      const u = L.eio(prog(t, 12.4, 13.4)), x = L.lerp(960, 1700, u), y = L.lerp(540, 190, u), r = L.lerp(110, 52, u), st = 1 - u;
      if (st > 0) { const shake = Math.sin(sB * 34) * 3 * st * L.clamp(sB / 3); c.save(); c.globalAlpha *= st * .35; c.beginPath(); c.arc(x + shake, y, r + 22 + Math.sin(sB * 6) * 8, 0, 6.2832); c.strokeStyle = C.warm; c.lineWidth = 8; c.stroke(); c.restore(); }
      L.dot(c, x + (st > 0 ? Math.sin(sB * 34) * 3 * st * L.clamp(sB / 3) : 0), y, r, C.ink);
      L.text(c, 'YOU', x, y + r * .17, { size: r * .5, weight: 800, color: '#fff', align: 'center' });
      L.text(c, 'The founder', x, y + r + 44, { size: 30, weight: 600, color: C.mut, align: 'center', alpha: 1 - prog(t, 12.4, 13) });
      L.text(c, 'Free to lead', x, y + r + 44, { size: 30, weight: 600, color: C.blue, align: 'center', alpha: prog(t, 13.8, 14.6) });
      c.restore();
    }
    // ---- D: consult / design / implement
    a = L.env(t, 21.4, 28.4, .5, .5);
    if (a > 0) { c.save(); c.globalAlpha = a;
      const cards = 1 - prog(t, 26.0, 26.5);
      if (cards > 0) { c.save(); c.globalAlpha *= cards;
        L.words(c, 'We consult, design and implement it.', 960, 200, { size: 72 }, t, 21.9, .09);
        [['Consult', 'search', 'Diagnose how clients find you today.'], ['Design', 'doc', 'Map your lead generation and client acquisition system.'], ['Implement', 'gear', 'Build it: outbound, paid ads and booking, working together.']].forEach(([h, ic, d], i) => {
          const s = t - (22.6 + i * .8), u = eo(prog(s, 0, .6)), x = 190 + i * 520, y = 330 + (1 - u) * 50; c.save(); c.globalAlpha *= u;
          L.card(c, x, y, 460, 470, { r: 32 }); L.icon(c, ic, x + 230, y + 120, 110, C.blue);
          L.text(c, h, x + 230, y + 250, { size: 54, weight: 800, align: 'center' });
          L.words(c, d, x + 230, y + 320, { size: 30, weight: 500, color: C.mut, maxW: 380, lh: 1.3 }, t, 22.8 + i * .8, .04, .3); c.restore(); });
        c.restore(); }
      L.words(c, [['Designed. ', C.ink], ['Built. ', C.blue], ['Handed over.', C.ink]], 960, 520, { size: 112, maxW: 1700 }, t, 26.4, .25, .6);
      c.restore(); }
    // ---- E: tagline + CTA
    a = L.env(t, 28.4, 34.5, .5, .3);
    if (a > 0) { c.save(); c.globalAlpha = a;
      L.endLogo(c, t, 28.7);
      L.words(c, [['Trading chaos', C.warm], ['for clarity.', C.blue]], 960, 440, { size: 140, maxW: 1100 }, t, 28.9, .22, .7);
      const u = eo(prog(t, 31.0, 31.8)), w = 1040; c.save(); c.globalAlpha *= u;
      L.rrect(c, 960 - w / 2, 690 + (1 - u) * 30, w, 110, 55); c.fillStyle = C.deep; c.fill();
      L.text(c, 'Book a free 15-minute call  ·  systematagrowth.com', 960, 757 + (1 - u) * 30, { size: 34, weight: 700, color: '#fff', align: 'center' }); c.restore(); c.restore(); }
  }
};
