// Video B: "More leads won't fix a broken system" (35s, 14 bars). Philosophy from the owner's overview: simplify first, automate last; you can't automate chaos.
const CUTS = [5, 20, 27.5], FIX = 12.8;
// dot schedule: arrivals accelerate (more leads) until the process is simplified, then flow steadily
const AR = []; { let t = 5.7, i = 0; while (t < 20) { AR.push(t); t += t < FIX ? Math.max(.12, .5 - i * .04) : .32; i++; } }
const SLOW_EXIT = i => 7.4 + 1.7 * i;                       // messy process: one lead escapes every ~1.7s
const stuck = AR.map((a, i) => a + 1 < FIX && SLOW_EXIT(i) > FIX), firstStuck = stuck.indexOf(true);
const DOT = AR.map((a, i) => { const tin = a + 1.0; if (tin < FIX) { const ex = SLOW_EXIT(i) <= FIX ? SLOW_EXIT(i) : FIX + .15 + .09 * (i - firstStuck); return { tin, ex, slow: true }; } return { tin, ex: tin + 1.1, slow: false }; });
const sfx = [[.5, 'tick'], [1.1, 'tick'], [1.7, 'tick'], [3.6, 'riser'], [4.6, 'swish'], [19.6, 'swish'], [27.1, 'swish']];
DOT.forEach((d, i) => { if (d.ex + 1.2 < 20 && i % 2 === 0 && d.ex > 12.9) sfx.push([d.ex + 1.2, 'tick']); });
sfx.push([FIX, 'swish'], [14.9, 'success'], [20.6, 'pop'], [21.4, 'pop'], [22.2, 'pop'], [23.0, 'pop'], [24.2, 'tick'], [25.4, 'chime'], [31.0, 'impact'], [31.2, 'logo'], [33.4, 'pop'], [34.0, 'tick']);
module.exports = {
  name: 'growth', duration: 35, bpm: 96, energy: [0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 1, 1, 1], sfx,
  dark: t => (t < 5 ? 1 : t < 20 ? 0 : 1),
  draw(c, t, L) {
    const C = L.C, eo = L.eo, prog = L.prog, expo = L.expo;
    const sc = t < CUTS[0] ? 0 : t < CUTS[1] ? 1 : t < CUTS[2] ? 2 : 3, dark = [1, 0, 1, 1][sc], k = L.col(dark);
    L.bg3(c, t, dark);
    if (sc === 0) {
      L.net(c, t, '232,100,60', .16, 34);
      L.kicker(c, 'GROWTH', 960, 290, k.mut, expo(prog(t, .2, 1)), 'center');
      L.line(c, 'More leads', 960, 450, { size: 128, weight: 800, align: 'center', color: '#fff' }, t, .5);
      L.line(c, "won't fix a", 960, 590, { size: 128, weight: 800, align: 'center', color: '#fff' }, t, 1.1);
      L.line(c, [['broken system.', C.warm]], 960, 730, { size: 128, weight: 800, align: 'center' }, t, 1.7);
    }
    if (sc === 1) {
      const ph = t < FIX ? 0 : 1, T0 = ph ? FIX - .2 : 5.4, fade = ph ? 1 : 1 - prog(t, FIX - .5, FIX - .15);
      c.save(); c.globalAlpha *= fade;
      L.kicker(c, ph ? 'STEP ONE' : 'CHAOS IN, CHAOS OUT', 120, 170, k.mut, expo(prog(t, T0 + .05, T0 + .5)));
      if (!ph) { L.line(c, 'Pour more leads into', 120, 262, { size: 86, weight: 800, color: k.ink }, t, T0 + .15); L.line(c, [['a messy process…', C.warm]], 120, 358, { size: 86, weight: 800 }, t, T0 + .3); }
      else { L.line(c, [['Simplify ', C.blue], ['first.', C.ink]], 120, 290, { size: 100, weight: 800 }, t, T0 + .25); }
      c.restore();
      if (!ph) L.line(c, '…and the mess just gets bigger.', 960, 960, { size: 46, weight: 600, color: C.mut, align: 'center' }, t, 9.2, .8);
      else L.line(c, 'Clear, repeatable steps. Then every new lead has somewhere to go.', 960, 960, { size: 42, weight: 600, color: C.mut, align: 'center' }, t, FIX + 1.9, .8);
      const pa = expo(prog(t, 5.2, 5.9));
      // source + output cards
      c.save(); c.globalAlpha *= pa; L.card(c, 120, 440, 270, 260, { r: 36 }); L.icon(c, 'users', 255, 530, 72, C.blue); L.text(c, 'More leads', 255, 625, { size: 32, weight: 800, align: 'center', color: C.ink });
      const pr = L.frac(t * (1 + Math.min(t - 5, 7) * .25)); c.beginPath(); c.arc(255, 530, 60 + 22 * pr, 0, 6.2832); c.strokeStyle = `rgba(15,90,67,${.35 * (1 - pr)})`; c.lineWidth = 4; c.stroke();
      L.card(c, 1530, 410, 280, 320, { r: 36 }); L.text(c, 'Booked calls', 1670, 470, { size: 30, weight: 800, align: 'center', color: C.ink });
      const got = DOT.filter(d => t > d.ex + 1.25).length;
      for (let i = 0; i < 6; i++) { const sx = 1558 + (i % 3) * 82, sy = 508 + Math.floor(i / 3) * 100, on = i < got; L.rrect(c, sx, sy, 68, 80, 14); c.fillStyle = on ? C.blue : '#F1F5F3'; c.fill(); if (on) L.icon(c, 'check', sx + 34, sy + 40, 36, '#fff', L.eo(prog(t, 0, 1))); } c.restore();
      // process: tangled -> straight
      const u = L.eio(prog(t, FIX, 15)); c.save(); c.globalAlpha *= pa; L.tangle(c, 640, 400, 620, 280, u, 6, C.warm, C.blue, 6); c.restore();
      L.text(c, u > .98 ? 'Simplified process' : 'Messy process', 950, 780, { size: 30, weight: 800, color: u > .98 ? C.blue : C.warm, align: 'center', alpha: pa });
      // dots
      const src = [392, 570], entry = [640, 540], knot = [950, 540], out = [1530, 560];
      DOT.forEach((d, i) => {
        const ta = AR[i]; if (t < ta) return; let p, col = d.slow && t < d.ex ? C.warm : C.blue;
        if (t < d.tin) { const u1 = eo(prog(t, ta, d.tin)); p = [L.lerp(src[0], entry[0], u1), L.lerp(src[1] + ((i * 29) % 9 - 4) * 4, entry[1], u1)]; col = d.slow ? C.warm : C.blue; }
        else if (t < d.ex) { if (d.slow) { const ang = i * 2.4 + t * (1.1 + (i % 5) * .15), r = 36 + (i % 7) * 16; p = [knot[0] + Math.cos(ang) * r * 1.5, knot[1] + Math.sin(ang) * r * .8]; } else { const u2 = (t - d.tin) / 1.1; p = [L.lerp(entry[0], 1260, u2), 540]; } }
        else { const u3 = eo(prog(t, d.ex, d.ex + 1.2)); const from = d.slow ? (() => { const ang = i * 2.4 + d.ex * (1.1 + (i % 5) * .15), r = 36 + (i % 7) * 16; return [knot[0] + Math.cos(ang) * r * 1.5, knot[1] + Math.sin(ang) * r * .8]; })() : [1260, 540]; if (u3 >= 1) return; p = [L.lerp(from[0], out[0], u3), L.lerp(from[1], out[1] - 20 + ((i * 17) % 5) * 10, u3)]; col = C.blue; }
        L.glowDot(c, p[0], p[1], 9, col, 1, 2.2); });
    }
    if (sc === 2) {
      const T = 20, a = expo(prog(t, T + .3, T + .9));
      L.kicker(c, 'STEP TWO', 120, 190, k.mut, a);
      L.line(c, [['Then ', '#fff'], ['automate.', C.mint]], 120, 320, { size: 104, weight: 800 }, t, T + .5);
      L.line(c, 'A clean process, running faster, not a messy one.', 120, 410, { size: 40, weight: 500, color: k.mut }, t, T + 1.0, .8);
      const labels = [['users', 'Capture'], ['target', 'Qualify'], ['send', 'Follow up'], ['calendar', 'Book call']];
      const xs = [280, 733, 1187, 1640]; c.save();
      for (let i = 0; i < 3; i++) { const x0 = xs[i] + 150, x1 = xs[i + 1] - 150, on = expo(prog(t, T + 1.9 + i * .25, T + 2.5 + i * .25)); c.strokeStyle = 'rgba(255,255,255,.16)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x0, 700); c.lineTo(x0 + (x1 - x0) * on, 700); c.stroke();
        if (t > T + 2.6) for (let j = 0; j < 4; j++) { const u = L.frac(t * .9 + j / 4 + i * .17); L.glowDot(c, x0 + (x1 - x0) * u, 700, 8, C.mint, L.eo(prog(t, T + 2.6, T + 3.2)), 3); } }
      labels.forEach(([ic, n], i) => { const p = L.pop(t, T + 1.5 + i * .25, .7), pulse = (Math.sin(t * 3 + i) + 1) / 2; c.save(); c.globalAlpha *= p.a; c.translate(xs[i], 700 + p.y); c.scale(p.s, p.s);
        L.card(c, -150, -105, 300, 210, { r: 34, dark: 1, stroke: `rgba(61,220,151,${.22 + .3 * pulse * (t > T + 2.6 ? 1 : 0)})` }); L.icon(c, ic, 0, -28, 62, C.mint); L.text(c, n, 0, 56, { size: 34, weight: 800, color: '#fff', align: 'center' });
        const bz = L.eo(prog(t, T + 3 + i * .3, T + 3.5 + i * .3)); c.save(); c.translate(112, -78); c.scale(bz, bz); L.glowDot(c, 0, 0, 20, C.mint, 1, 1.6); L.icon(c, 'bolt', 0, 0, 24, C.deep); c.restore(); c.restore(); });
      c.restore();
      L.line(c, 'Automate last.', 960, 960, { size: 40, weight: 700, color: C.mint, align: 'center' }, t, T + 4.6, .8);
    }
    if (sc === 3) {
      const fade = 1 - prog(t, 30.1, 30.7); c.save(); c.globalAlpha *= fade;
      L.line(c, 'Simplify first,', 960, 450, { size: 128, weight: 800, align: 'center', color: '#fff' }, t, 27.8); L.line(c, [['automate last.', C.mint]], 960, 600, { size: 128, weight: 800, align: 'center' }, t, 28.3);
      L.text(c, "You can't automate chaos.", 960, 740, { size: 48, weight: 600, color: k.mut, align: 'center', alpha: expo(prog(t, 29.2, 30)) }); c.restore();
      if (t >= 30.6) L.endcard(c, t, 31 - .0);
    }
    L.chrome3(c, t, 35, dark);
    [[1920, 1080], [0, 0], [960, 540]].forEach(([x, y], i) => L.iris(c, t, CUTS[i], x, y));
  }
};
