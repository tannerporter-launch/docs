// Video A: The Systemata Audit (42.5s, 96 bpm = 17 bars). Content follows the owner's overview (Method stages 1-2, advisory/roadmap, three paths).
const CUTS = [5, 15, 22.5, 30, 37.5];
const NODES = [['Lead sources', 'search', [1160, 395]], ['Outreach', 'chat', [1400, 395]], ['Booking', 'calendar', [1640, 395]], ['Sales call', 'phone', [1640, 625]], ['Proposal', 'doc', [1400, 625]], ['Follow-up', 'send', [1160, 625]]];
const sfx = [[.5, 'tick'], [1.1, 'tick'], [1.7, 'tick'], [3.6, 'riser']];
CUTS.forEach(tc => sfx.push([tc - .4, 'swish']));
NODES.forEach((_, i) => sfx.push([5.55 + .3 * i, 'pop']));
sfx.push([7.9, 'swish'], [9.7, 'success'], [10.9, 'tick'], [11.5, 'tick'], [15.6, 'pop'], [16.4, 'pop'], [17.2, 'pop'], [19.4, 'tick'], [20.4, 'tick'], [21.4, 'tick'], [23.0, 'pop'], [23.8, 'pop'], [24.7, 'tick'],
  [31.2, 'swish'], [34.3, 'chime'], [37.5, 'impact'], [37.9, 'logo'], [40.3, 'pop'], [41, 'tick']);
module.exports = {
  dark: t => (t < 5 ? 1 : t < 15 ? 0 : t < 22.5 ? 1 : t < 30 ? 0 : 1),
  name: 'audit', duration: 42.5, bpm: 96, energy: [0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1], sfx,
  draw(c, t, L) {
    const C = L.C, eo = L.eo, prog = L.prog, expo = L.expo;
    const sc = t < CUTS[0] ? 0 : t < CUTS[1] ? 1 : t < CUTS[2] ? 2 : t < CUTS[3] ? 3 : t < CUTS[4] ? 4 : 5, dark = [1, 0, 1, 0, 1, 1][sc], k = L.col(dark);
    L.bg3(c, t, dark);
    if (sc === 0) {
      L.net(c, t, '61,220,151', .20, 36);
      L.kicker(c, 'THE SYSTEMATA AUDIT', 960, 290, k.mut, expo(prog(t, .2, 1)), 'center');
      L.line(c, 'Where does your', 960, 450, { size: 118, weight: 800, align: 'center', color: '#fff' }, t, .5);
      L.line(c, 'client acquisition', 960, 585, { size: 118, weight: 800, align: 'center', color: '#fff' }, t, 1.1);
      L.line(c, [['actually break?', C.mint]], 960, 720, { size: 118, weight: 800, align: 'center' }, t, 1.7);
    }
    if (sc === 1) {
      const ph = t < 10 ? 0 : 1, T0 = ph ? 10 : 5.45, fade = ph ? 1 : 1 - prog(t, 9.6, 9.95);
      c.save(); c.globalAlpha *= fade;
      L.kicker(c, ph ? 'STAGE 02' : 'STAGE 01', 120, 300, k.mut, expo(prog(t, T0 + .05, T0 + .5)));
      L.line(c, ph ? 'Identify and' : 'Audit and', 120, 430, { size: 104, weight: 800, color: k.ink }, t, T0 + .15);
      L.line(c, [[ph ? 'Diagnose' : 'Document', C.blue]], 120, 545, { size: 104, weight: 800 }, t, T0 + .3);
      (ph ? ['We find the bottlenecks,', 'inefficiencies and unnecessary', 'complexity.'] : ['We document how you win clients', 'today: every channel, step', 'and hand-off.']).forEach((s, i) => L.line(c, s, 120, 650 + i * 56, { size: 38, weight: 500, color: k.mut }, t, T0 + .6 + i * .12, .7));
      c.restore();
      // journey map
      const cp = L.pop(t, 5.3, .7); c.save(); c.globalAlpha *= cp.a; c.translate(0, cp.y); L.card(c, 1000, 200, 800, 700, { r: 40 });
      L.text(c, 'CLIENT ACQUISITION JOURNEY', 1048, 268, { size: 22, weight: 700, color: C.mut, ls: 4 });
      const P = NODES.map(n => n[2]); P.forEach((p, i) => { if (i < 5) { const u = expo(prog(t, 5.55 + .3 * (i + 1), 5.55 + .3 * (i + 1) + .5)); const q = [P[i], P[i + 1]]; c.beginPath(); c.moveTo(...q[0]); c.lineTo(q[0][0] + (q[1][0] - q[0][0]) * u, q[0][1] + (q[1][1] - q[0][1]) * u); c.lineWidth = 5; c.strokeStyle = 'rgba(11,61,46,.16)'; c.lineCap = 'round'; c.stroke(); } });
      if (t > 9.4) for (let j = 0; j < 7; j++) { const u = L.frac(t * .16 + j / 7), p = L.polyAt(P, u); L.glowDot(c, p[0], p[1], 8, C.blue, prog(t, 9.4, 10) * .9, 2.2); }
      const scan = prog(t, 7.9, 9.7), sx = L.lerp(1010, 1790, scan);
      NODES.forEach(([n, ic, [x, y]], i) => {
        const pp = L.pop(t, 5.55 + .3 * i, .6), tw = [3, 5].includes(i) ? (i === 3 ? 10.9 : 11.5) : 1e9, w = prog(t, tw, tw + .4), docT = 7.9 + (x - 1010) / 780 * 1.8, d = prog(t, docT, docT + .35);
        c.save(); c.globalAlpha *= pp.a; c.translate(x, y + pp.y); c.scale(pp.s, pp.s);
        L.card(c, -105, -60, 210, 120, { r: 26, fill: w > 0 ? C.warm2 : '#fff', stroke: w > 0 ? C.warm : 'rgba(11,61,46,.16)', lw: 3, shadow: true });
        L.icon(c, ic, 0, -18, 44, w > 0 ? C.warm : C.blue); L.text(c, n, 0, 38, { size: 24, weight: 700, align: 'center', color: C.ink });
        if (d > 0) { c.save(); c.translate(98, -52); c.scale(.4 + .6 * L.back(d), .4 + .6 * L.back(d)); L.glowDot(c, 0, 0, 17, C.mint, 1, 1); L.icon(c, 'check', 0, 0, 22, C.deep); c.restore(); }
        c.restore();
        if (w > 0) { const rr = L.frac(t * 1.1); c.save(); c.globalAlpha *= (1 - rr) * .6 * w; c.beginPath(); c.arc(x, y, 70 + 48 * rr, 0, 6.2832); c.lineWidth = 4; c.strokeStyle = C.warm; c.stroke(); c.restore();
          const tg = L.pop(t, tw + .2, .5); c.save(); c.globalAlpha *= tg.a; L.card(c, x - 118, y + 76 + tg.y, 236, 44, { r: 22, fill: C.warm2, stroke: C.warm, lw: 2, shadow: false }); L.text(c, i === 3 ? 'Founder-dependent' : 'Manual hand-off', x, y + 106 + tg.y, { size: 21, weight: 700, color: C.warm, align: 'center' }); c.restore(); } });
      if (scan > 0 && scan < 1) { c.save(); const g = c.createLinearGradient(sx - 140, 0, sx, 0); g.addColorStop(0, 'rgba(61,220,151,0)'); g.addColorStop(1, 'rgba(61,220,151,.28)'); c.fillStyle = g; c.fillRect(sx - 140, 300, 140, 520); c.fillStyle = C.mint; c.fillRect(sx - 2, 300, 4, 520); c.restore(); }
      const lens = prog(t, 10.2, 12.0) * (1 - prog(t, 12.4, 12.9)); if (lens > 0 && t > 10.2) { const pth = [P[0], P[3], P[5]], lp = L.polyAt([P[1], P[2], P[3], P[4], P[5]], L.eio(prog(t, 10.2, 12.0))); c.save(); c.globalAlpha *= Math.min(1, lens * 4); c.beginPath(); c.arc(lp[0], lp[1], 74, 0, 6.2832); c.lineWidth = 6; c.strokeStyle = C.mint; c.stroke(); L.icon(c, 'search', lp[0] + 64, lp[1] + 64, 36, C.deep); c.restore(); }
      L.text(c, 'Illustrative example', 1048, 872, { size: 20, weight: 600, color: C.mut, alpha: .8 });
      c.restore();
    }
    if (sc === 2) {
      L.kicker(c, 'THE DELIVERABLES', 120, 190, k.mut, expo(prog(t, 15.4, 15.9)));
      L.line(c, 'What you get', 120, 320, { size: 100, weight: 800, color: '#fff' }, t, 15.5);
      [['01', 'doc', 'A documented picture', ['How your lead generation and', 'client acquisition really work', 'today.']], ['02', 'search', 'A clear diagnosis', ['Where the bottlenecks and', 'unnecessary complexity are', 'hiding.']], ['03', 'route', 'A roadmap', ['The strategy and steps to', 'execute the improvements.']]].forEach(([n, ic, h, ds], i) => {
        const x = 120 + i * 580, p = L.pop(t, 15.6 + i * .8, .8), hi = L.clamp(1 - Math.abs(t - (19.9 + i)) / .6), bob = Math.sin(t * 1.3 + i * 1.7) * 5;
        c.save(); c.globalAlpha *= p.a; c.translate(0, p.y * 2 + bob); L.card(c, x, 410, 520, 470, { r: 36, dark: 1, stroke: hi > 0 ? `rgba(61,220,151,${.25 + .6 * hi})` : undefined });
        c.beginPath(); c.arc(x + 84, 500, 44, 0, 6.2832); c.fillStyle = 'rgba(61,220,151,.16)'; c.fill(); L.icon(c, ic, x + 84, 500, 44, C.mint);
        L.text(c, n, x + 480, 520, { size: 84, weight: 800, color: 'rgba(255,255,255,.10)', align: 'right' });
        L.text(c, h, x + 44, 650, { size: 42, weight: 800, color: '#fff' }); ds.forEach((s, j) => L.text(c, s, x + 44, 712 + j * 44, { size: 30, weight: 500, color: k.mut })); c.restore(); });
    }
    if (sc === 3) {
      L.kicker(c, 'THEN CHOOSE YOUR PATH', 960, 190, k.mut, expo(prog(t, 22.9, 23.4)), 'center');
      L.line(c, 'Done for you,', 960, 300, { size: 88, weight: 800, align: 'center', color: k.ink }, t, 23.0); L.line(c, [['or with your team.', C.blue]], 960, 395, { size: 88, weight: 800, align: 'center' }, t, 23.15);
      [['gear', 'DONE FOR YOU', 'We build it', ['Premium, white-glove implementation.', 'We consult, design and build the', 'system, start to finish.']], ['map', 'ADVISORY AND ROADMAP', 'Your team builds it', ['The strategy, diagnosis and roadmap', 'your team needs to execute the', 'improvements in-house.']]].forEach(([ic, tag, h, ds], i) => {
        const x = i ? 1010 : 150, p = L.pop(t, 23.6 + i * .8, .8); c.save(); c.globalAlpha *= p.a; c.translate((i ? 1 : -1) * (1 - L.eo(prog(t, 23.6 + i * .8, 24.4 + i * .8))) * 80, 0); L.card(c, x, 470, 760, 430, { r: 40 });
        c.beginPath(); c.arc(x + 90, 565, 46, 0, 6.2832); c.fillStyle = C.tint; c.fill(); L.icon(c, ic, x + 90, 565, 46, C.blue);
        L.text(c, tag, x + 170, 573, { size: 22, weight: 800, color: C.blue, ls: 4 }); L.text(c, h, x + 56, 680, { size: 54, weight: 800, color: C.ink }); ds.forEach((s, j) => L.text(c, s, x + 56, 742 + j * 44, { size: 29, weight: 500, color: C.mut })); c.restore(); });
      const o = L.pop(t, 24.6, .5); c.save(); c.globalAlpha *= o.a; c.translate(960, 685); c.scale(o.s, o.s); c.beginPath(); c.arc(0, 0, 46, 0, 6.2832); c.fillStyle = C.deep; c.fill(); L.text(c, 'OR', 0, 11, { size: 30, weight: 800, color: '#fff', align: 'center' }); c.restore();
    }
    if (sc === 4) {
      const u = L.eio(prog(t, 31.2, 34.4)), a0 = expo(prog(t, 30.4, 31));
      c.save(); c.globalAlpha *= a0; L.tangle(c, 130, 330, 780, 520, u, 7, C.warm, C.mint, 7); c.restore();
      L.text(c, u > .98 ? 'Clear, repeatable flows' : 'Simplifying…', 520, 925, { size: 26, weight: 700, color: u > .98 ? C.mint : k.mut, align: 'center', alpha: a0 });
      L.kicker(c, 'THE SYSTEMATA METHOD', 1010, 300, k.mut, expo(prog(t, 30.5, 31)));
      L.line(c, 'Simplify first.', 1010, 450, { size: 100, weight: 800, color: '#fff' }, t, 30.7); L.line(c, [['Automate last.', C.mint]], 1010, 570, { size: 100, weight: 800 }, t, 31.0);
      const a = expo(prog(t, 34.2, 35)); L.text(c, 'Trading chaos for clarity.', 1010, 700, { size: 46, weight: 600, color: k.mut, alpha: a });
      c.save(); c.globalAlpha *= a; c.fillStyle = C.mint; c.fillRect(1010, 724, 330 * a, 4); c.restore();
    }
    if (sc === 5) L.endcard(c, t, 37.9);
    L.chrome3(c, t, 42.5, dark);
    [[1920, 1080], [0, 0], [1920, 0], [0, 1080], [960, 540]].forEach(([x, y], i) => L.iris(c, t, CUTS[i], x, y));
  }
};
