// Video C: "Book a call. Here's what happens next." (30s, 12 bars). Steps are inferred from the owner's overview (qualified sales calls, fit criteria, fixed-scope projects) and flagged for confirmation.
const CUTS = [5, 10, 15, 20, 25];
const NODES = [['Lead sources', 'search', [1160, 395]], ['Outreach', 'chat', [1400, 395]], ['Booking', 'calendar', [1640, 395]], ['Sales call', 'phone', [1640, 625]], ['Proposal', 'doc', [1400, 625]], ['Follow-up', 'send', [1160, 625]]];
const FIT = ['Established, service-based business', 'Ambition to grow', 'Customers you can reach online'];
const sfx = [[.5, 'tick'], [1.2, 'tick'], [3.7, 'riser']];
CUTS.forEach(tc => sfx.push([tc - .4, 'swish']));
sfx.push([6.0, 'pop'], [6.9, 'tick'], [7.6, 'pop'], [8.3, 'tick'], [8.9, 'success'], [10.6, 'pop'], [10.9, 'pop'], [11.2, 'pop'], [11.5, 'pop'], [11.8, 'pop'], [12.1, 'pop'], [13.2, 'tick'], [15.8, 'pop'], [16.7, 'success'], [17.6, 'success'], [18.5, 'success'], [19.2, 'chime'], [20.7, 'pop'], [21.5, 'tick'], [22.3, 'tick'], [23.1, 'tick'], [24.0, 'chime'], [25, 'impact'], [25.4, 'logo'], [27.8, 'pop'], [28.4, 'tick']);
function cursor(c, x, y, a, press) { c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(press ? .88 : 1, press ? .88 : 1); c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 8; c.shadowOffsetY = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 30); c.lineTo(8, 23); c.lineTo(14, 36); c.lineTo(19, 34); c.lineTo(13, 21); c.lineTo(23, 21); c.closePath(); c.fillStyle = '#1C1F1E'; c.fill(); c.lineWidth = 2; c.strokeStyle = '#fff'; c.stroke(); c.restore(); }
module.exports = {
  name: 'call', duration: 30, bpm: 96, energy: [0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 1, 1], sfx,
  dark: t => (t < 5 ? 1 : t < 20 ? 0 : 1),
  draw(c, t, L) {
    const C = L.C, eo = L.eo, prog = L.prog, expo = L.expo;
    const sc = t < CUTS[0] ? 0 : t < CUTS[1] ? 1 : t < CUTS[2] ? 2 : t < CUTS[3] ? 3 : t < CUTS[4] ? 4 : 5, dark = [1, 0, 0, 0, 1, 1][sc], k = L.col(dark);
    L.bg3(c, t, dark);
    const left = (T0, num, kick, l1, l2, sub) => { // shared left column for the step scenes
      c.save(); L.text(c, num, 100, 985, { size: 340, weight: 800, color: dark ? 'rgba(255,255,255,.05)' : 'rgba(15,90,67,.06)', alpha: expo(prog(t, T0, T0 + .8)) }); c.restore();
      L.kicker(c, kick, 120, 300, k.mut, expo(prog(t, T0 + .05, T0 + .5)));
      L.line(c, l1, 120, 430, { size: 90, weight: 800, color: k.ink }, t, T0 + .15); L.line(c, [[l2, dark ? C.mint : C.blue]], 120, 535, { size: 90, weight: 800 }, t, T0 + .3);
      sub.forEach((s, i) => L.line(c, s, 120, 650 + i * 54, { size: 36, weight: 500, color: k.mut }, t, T0 + .6 + i * .12, .7)); };
    if (sc === 0) {
      L.net(c, t, '61,220,151', .20, 36);
      L.kicker(c, 'WHAT TO EXPECT', 960, 290, k.mut, expo(prog(t, .2, 1)), 'center');
      L.line(c, 'Book a call.', 960, 460, { size: 148, weight: 800, align: 'center', color: '#fff' }, t, .5);
      L.line(c, [["Here's what happens next.", C.mint]], 960, 600, { size: 84, weight: 800, align: 'center' }, t, 1.2);
    }
    if (sc === 1) {
      left(5.4, '01', 'STEP 1 OF 4', 'You pick', 'a time.', ['Choose a time that works for you.', 'It takes a minute.']);
      const cp = L.pop(t, 5.3, .7); c.save(); c.globalAlpha *= cp.a; c.translate(0, cp.y); L.card(c, 1000, 190, 800, 720, { r: 40 });
      L.text(c, 'Choose a day', 1048, 262, { size: 34, weight: 800, color: C.ink }); L.text(c, 'M     T     W     T     F     S     S', 1048, 322, { size: 22, weight: 700, color: C.mut, ls: 2 });
      const sel = 17, selT = 6.9; for (let d = 1; d <= 31; d++) { const i = d + 1, cx = 1090 + (i % 7) * 100, cy = 380 + Math.floor(i / 7) * 62, a = expo(prog(t, 5.7 + d * .015, 6.2 + d * .015)), on = d === sel && t > selT;
        c.save(); c.globalAlpha *= a; if (on) { L.glowDot(c, cx, cy, 25, C.blue, 1, 1.3); } L.text(c, String(d), cx, cy + 8, { size: 24, weight: on ? 800 : 600, color: on ? '#fff' : C.ink, align: 'center' }); c.restore(); }
      const sl = ['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM']; sl.forEach((s, i) => { const x = 1048 + (i % 2) * 340, y = 668 + Math.floor(i / 2) * 70, a = expo(prog(t, 7.4 + i * .08, 7.9 + i * .08)), on = i === 1 && t > 8.3;
        c.save(); c.globalAlpha *= a; L.card(c, x, y, 320, 54, { r: 27, fill: on ? C.blue : '#fff', stroke: on ? C.blue : 'rgba(11,61,46,.18)', shadow: false }); L.text(c, s, x + 160, y + 36, { size: 26, weight: 700, color: on ? '#fff' : C.ink, align: 'center' }); c.restore(); });
      const bk = L.pop(t, 8.6, .5), done = t > 9.0; c.save(); c.globalAlpha *= bk.a; L.rrect(c, 1048, 828, 704, 56, 28); c.fillStyle = done ? C.mint : C.deep; c.fill(); L.text(c, done ? 'Booked' : 'Confirm', 1400, 865, { size: 28, weight: 800, color: done ? C.deep : '#fff', align: 'center' }); if (done) L.icon(c, 'check', 1340, 856, 28, C.deep); c.restore();
      const path = [[1500, 150, 5.2], [1090 + (18 % 7) * 100, 380 + Math.floor(18 / 7) * 62, 6.7], [1218, 712, 8.2], [1400, 856, 8.9]]; let cx = path[0][0], cy = path[0][1]; for (let i = 0; i < path.length - 1; i++) { if (t >= path[i][2]) { const u = L.eio(prog(t, path[i][2], path[i + 1][2] - .25)); cx = L.lerp(path[i][0], path[i + 1][0], u); cy = L.lerp(path[i][1], path[i + 1][1], u); } }
      cursor(c, cx, cy, expo(prog(t, 5.6, 6)) * (1 - prog(t, 9.3, 9.6)), [6.9, 8.3, 8.95].some(x => Math.abs(t - x - .08) < .08)); c.restore();
    }
    if (sc === 2) {
      left(10.4, '02', 'STEP 2 OF 4', 'We look at how', 'you win clients.', ['Your lead generation and client', 'acquisition, as it works today.']);
      const cp = L.pop(t, 10.3, .7); c.save(); c.globalAlpha *= cp.a; c.translate(0, cp.y); L.card(c, 1000, 200, 800, 700, { r: 40 }); L.text(c, 'CLIENT ACQUISITION JOURNEY', 1048, 268, { size: 22, weight: 700, color: C.mut, ls: 4 });
      const P = NODES.map(n => n[2]); P.forEach((p, i) => { if (i < 5) { const u = expo(prog(t, 10.55 + .3 * (i + 1), 11.05 + .3 * (i + 1))); c.beginPath(); c.moveTo(...P[i]); c.lineTo(P[i][0] + (P[i + 1][0] - P[i][0]) * u, P[i][1] + (P[i + 1][1] - P[i][1]) * u); c.lineWidth = 5; c.strokeStyle = 'rgba(11,61,46,.16)'; c.lineCap = 'round'; c.stroke(); } });
      if (t > 13.2) for (let j = 0; j < 7; j++) { const p = L.polyAt(P, L.frac(t * .16 + j / 7)); L.glowDot(c, p[0], p[1], 8, C.blue, prog(t, 13.2, 13.8) * .9, 2.2); }
      const scan = prog(t, 11.6, 13.2), sx = L.lerp(1010, 1790, scan);
      NODES.forEach(([n, ic, [x, y]], i) => { const pp = L.pop(t, 10.55 + .3 * i, .6), docT = 11.6 + (x - 1010) / 780 * 1.6, d = prog(t, docT, docT + .35);
        c.save(); c.globalAlpha *= pp.a; c.translate(x, y + pp.y); c.scale(pp.s, pp.s); L.card(c, -105, -60, 210, 120, { r: 26, stroke: 'rgba(11,61,46,.16)', lw: 3 }); L.icon(c, ic, 0, -18, 44, C.blue); L.text(c, n, 0, 38, { size: 24, weight: 700, align: 'center', color: C.ink });
        if (d > 0) { c.save(); c.translate(98, -52); c.scale(.4 + .6 * L.back(d), .4 + .6 * L.back(d)); L.glowDot(c, 0, 0, 17, C.mint, 1, 1); L.icon(c, 'check', 0, 0, 22, C.deep); c.restore(); } c.restore(); });
      if (scan > 0 && scan < 1) { c.save(); const g = c.createLinearGradient(sx - 140, 0, sx, 0); g.addColorStop(0, 'rgba(61,220,151,0)'); g.addColorStop(1, 'rgba(61,220,151,.28)'); c.fillStyle = g; c.fillRect(sx - 140, 300, 140, 520); c.fillStyle = C.mint; c.fillRect(sx - 2, 300, 4, 520); c.restore(); }
      c.restore();
    }
    if (sc === 3) {
      left(15.4, '03', 'STEP 3 OF 4', 'We see if', "it's a fit.", ['A quick check that Systemata', 'is the right match for you.']);
      const cp = L.pop(t, 15.3, .7); c.save(); c.globalAlpha *= cp.a; c.translate(0, cp.y); L.card(c, 1000, 250, 800, 600, { r: 40 }); L.text(c, 'IS IT A FIT?', 1048, 330, { size: 22, weight: 700, color: C.mut, ls: 4 });
      FIT.forEach((s, i) => { const t0 = 15.7 + i * .9, p = L.pop(t, t0, .6), ck = L.eo(prog(t, t0 + .5, t0 + 1.0)), y = 400 + i * 120; c.save(); c.globalAlpha *= p.a; c.translate(0, p.y);
        L.card(c, 1048, y, 704, 96, { r: 28, shadow: false, stroke: 'rgba(11,61,46,.12)' }); c.beginPath(); c.arc(1108, y + 48, 26, 0, 6.2832); c.fillStyle = ck > .01 ? C.mint : '#EEF3F0'; c.fill(); if (ck > 0) { c.save(); c.translate(1108, y + 48); c.scale(ck, ck); L.icon(c, 'check', 0, 0, 30, C.deep); c.restore(); }
        L.text(c, s, 1160, y + 58, { size: 30, weight: 700, color: C.ink }); c.restore(); });
      const f = L.pop(t, 18.7, .6); c.save(); c.globalAlpha *= f.a; c.translate(0, f.y); L.rrect(c, 1048, 770, 704, 56, 28); c.fillStyle = C.deep; c.fill(); L.text(c, 'Looks like a fit', 1400, 807, { size: 28, weight: 800, color: C.mint, align: 'center' }); c.restore();
      L.text(c, 'Illustrative', 1048, 878, { size: 20, weight: 600, color: C.mut, alpha: .8 }); c.restore();
    }
    if (sc === 4) {
      left(20.4, '04', 'STEP 4 OF 4', 'If it is,', 'a clear project.', ['Fixed scope. Fixed price.', 'Delivered.']);
      const cp = L.pop(t, 20.3, .7); c.save(); c.globalAlpha *= cp.a; c.translate(0, cp.y); L.card(c, 1000, 250, 800, 600, { r: 40, dark: 1 }); L.kicker(c, 'THE SYSTEMATA GUARANTEE', 1048, 330, k.mut, 1);
      ['Fixed scope', 'Fixed price', 'Delivered'].forEach((s, i) => { const t0 = 21.4 + i * .8, p = L.pop(t, t0, .6), y = 380 + i * 96; c.save(); c.globalAlpha *= p.a; c.translate(0, p.y); c.beginPath(); c.arc(1100, y + 36, 26, 0, 6.2832); c.fillStyle = 'rgba(61,220,151,.18)'; c.fill(); L.icon(c, 'check', 1100, y + 36, 30, C.mint); L.text(c, s, 1150, y + 50, { size: 44, weight: 800, color: '#fff' }); c.restore(); });
      L.line(c, [['…or you ', '#fff'], ["don't pay.", C.mint]], 1048, 740, { size: 56, weight: 800 }, t, 23.9); c.restore();
    }
    if (sc === 5) L.endcard(c, t, 25.4);
    L.chrome3(c, t, 30, dark);
    [[1920, 1080], [0, 0], [1920, 0], [0, 1080], [960, 540]].forEach(([x, y], i) => L.iris(c, t, CUTS[i], x, y));
  }
};
