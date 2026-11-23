// Shared drawing toolkit. Everything is a pure function of time t (seconds). Canvas 1920x1080.
(function (root) {
  const L = { W: 1920, H: 1080 };
  L.C = { paper: '#F7F6F2', ink: '#101426', mut: '#6B7288', blue: '#3B5BFF', blue2: '#E3E8FF', warm: '#FF6B3D', warm2: '#FFE6DC', line: '#DEDBD2', card: '#FFFFFF', ok: '#12B886' };
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  L.clamp = clamp; L.prog = (t, a, b) => clamp((t - a) / (b - a));
  L.eo = x => 1 - Math.pow(1 - x, 3); L.ei = x => x * x * x; L.eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  L.back = x => { const c = 2.70158; return 1 + c * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2); };
  L.lerp = (a, b, u) => a + (b - a) * u; L.frac = x => x - Math.floor(x);
  L.rnd = (i, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  L.env = (t, a, b, fi = .5, fo = .5) => clamp((t - a) / fi) * clamp((b - t) / fo);
  L.font = (w, s) => `${w} ${s}px Inter, system-ui, sans-serif`;
  L.bez = (p0, p1, p2, p3, u) => { const v = 1 - u, f = k => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k]; return [f(0), f(1)]; };

  L.bg = (c, t) => {
    c.fillStyle = L.C.paper; c.fillRect(0, 0, L.W, L.H);
    const g = c.createRadialGradient(1700, 100, 0, 1700, 100, 900); g.addColorStop(0, 'rgba(59,91,255,.10)'); g.addColorStop(1, 'rgba(59,91,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, L.W, L.H);
    c.fillStyle = 'rgba(16,20,38,.08)'; const o = (t * 8) % 64;
    for (let x = -64 + o; x < L.W + 64; x += 64) for (let y = 32; y < L.H; y += 64) { c.beginPath(); c.arc(x, y, 1.6, 0, 6.2832); c.fill(); }
  };
  L.chrome = (c, t, dur) => {
    c.save(); L.rrect(c, 80, 56, 44, 44, 12); c.fillStyle = L.C.blue; c.fill();
    L.text(c, 'S', 102, 90, { size: 28, weight: 800, color: '#fff', align: 'center' });
    L.text(c, 'Systemata', 140, 90, { size: 30, weight: 700 });
    c.fillStyle = L.C.blue; c.fillRect(0, L.H - 8, L.W * clamp(t / dur), 8); c.restore();
  };
  L.rrect = (c, x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  L.card = (c, x, y, w, h, o = {}) => {
    c.save(); c.globalAlpha *= o.alpha ?? 1;
    if (o.shadow !== false) { c.shadowColor = 'rgba(16,20,38,.13)'; c.shadowBlur = 44; c.shadowOffsetY = 14; }
    L.rrect(c, x, y, w, h, o.r ?? 28); c.fillStyle = o.fill || L.C.card; c.fill(); c.shadowColor = 'transparent';
    if (o.stroke) { c.lineWidth = o.lw || 3; c.strokeStyle = o.stroke; c.stroke(); } c.restore();
  };
  L.text = (c, s, x, y, o = {}) => {
    c.save(); c.globalAlpha *= o.alpha ?? 1; c.font = L.font(o.weight || 600, o.size || 48); c.fillStyle = o.color || L.C.ink;
    c.textAlign = o.align || 'left'; c.textBaseline = o.base || 'alphabetic'; if (o.ls) c.letterSpacing = o.ls + 'px'; c.fillText(s, x, y); c.restore();
  };
  // word-by-word rising reveal. tok: string or [[text,color],...]. returns block height.
  L.words = (c, tok, x, y, o, t, t0, per = .09, dur = .55) => {
    const size = o.size || 80, weight = o.weight || 700, lh = o.lh || 1.18, maxW = o.maxW || 1500, align = o.align || 'center', rise = o.rise ?? 28;
    c.save(); const base = c.globalAlpha; c.font = L.font(weight, size);
    const items = typeof tok === 'string' ? tok.split(' ').map(w => [w, o.color]) : tok.flatMap(([s, col]) => s.split(' ').filter(Boolean).map(w => [w, col || o.color]));
    const sp = c.measureText(' ').width, lines = []; let cur = { w: [], width: 0 };
    for (const [w, col] of items) { const ww = c.measureText(w).width; if (cur.w.length && cur.width + sp + ww > maxW) { lines.push(cur); cur = { w: [], width: 0 }; } cur.width += (cur.w.length ? sp : 0) + ww; cur.w.push({ w, col, ww }); }
    lines.push(cur); let idx = 0;
    lines.forEach((ln, li) => { let x0 = align === 'center' ? x - ln.width / 2 : align === 'right' ? x - ln.width : x;
      for (const wd of ln.w) { const u = L.eo(L.prog(t, t0 + idx * per, t0 + idx * per + dur)); c.globalAlpha = base * (o.alpha ?? 1) * u;
        c.fillStyle = wd.col || L.C.ink; c.textAlign = 'left'; c.fillText(wd.w, x0, y + li * size * lh + (1 - u) * rise); x0 += wd.ww + sp; idx++; } });
    c.restore(); return lines.length * size * lh;
  };
  L.dot = (c, x, y, r, fill, a = 1) => { c.save(); c.globalAlpha *= a; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fillStyle = fill; c.fill(); c.restore(); };
  L.pill = (c, s, x, y, o = {}) => { // left-anchored pill; returns width
    c.save(); c.font = L.font(o.weight || 600, o.size || 28); const w = c.measureText(s).width + (o.pad ?? 44), h = o.h || 56; c.restore();
    c.save(); c.globalAlpha *= o.alpha ?? 1; L.rrect(c, x, y, w, h, h / 2); c.fillStyle = o.fill || L.C.card; c.fill();
    if (o.stroke) { c.lineWidth = 2; c.strokeStyle = o.stroke; c.stroke(); } c.restore();
    L.text(c, s, x + w / 2, y + h / 2 + (o.size || 28) * .35, { size: o.size || 28, weight: o.weight || 600, color: o.color || L.C.ink, align: 'center', alpha: o.alpha ?? 1 }); return w;
  };
  L.icon = (c, name, x, y, s, color, a = 1) => { // centered at x,y, size s
    c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s / 100, s / 100); c.strokeStyle = color; c.fillStyle = color; c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round';
    if (name === 'check') { c.beginPath(); c.moveTo(-30, 2); c.lineTo(-8, 24); c.lineTo(32, -22); c.stroke(); }
    else if (name === 'calendar') { L.rrect(c, -40, -36, 80, 76, 12); c.stroke(); c.beginPath(); c.moveTo(-40, -12); c.lineTo(40, -12); c.moveTo(-18, -48); c.lineTo(-18, -28); c.moveTo(18, -48); c.lineTo(18, -28); c.stroke(); c.fillRect(-22, 6, 16, 16); c.fillRect(6, 6, 16, 16); }
    else if (name === 'doc') { L.rrect(c, -30, -42, 60, 84, 10); c.stroke(); c.beginPath(); c.moveTo(-14, -14); c.lineTo(14, -14); c.moveTo(-14, 4); c.lineTo(14, 4); c.moveTo(-14, 22); c.lineTo(4, 22); c.stroke(); }
    else if (name === 'gear') { c.beginPath(); c.arc(0, 0, 18, 0, 6.2832); c.stroke(); for (let i = 0; i < 8; i++) { c.save(); c.rotate(i * Math.PI / 4); c.fillRect(-6, -42, 12, 16); c.restore(); } c.beginPath(); c.arc(0, 0, 30, 0, 6.2832); c.stroke(); }
    else if (name === 'bolt') { c.beginPath(); c.moveTo(8, -44); c.lineTo(-22, 6); c.lineTo(-2, 6); c.lineTo(-8, 44); c.lineTo(24, -10); c.lineTo(2, -10); c.closePath(); c.fill(); }
    else if (name === 'search') { c.beginPath(); c.arc(-8, -8, 26, 0, 6.2832); c.stroke(); c.beginPath(); c.moveTo(12, 12); c.lineTo(38, 38); c.stroke(); }
    else if (name === 'person') { c.beginPath(); c.arc(0, -16, 16, 0, 6.2832); c.fill(); c.beginPath(); c.arc(0, 38, 34, Math.PI, 0); c.fill(); }
    else if (name === 'chat') { L.rrect(c, -42, -34, 84, 56, 14); c.stroke(); c.beginPath(); c.moveTo(-14, 22); c.lineTo(-22, 42); c.lineTo(4, 22); c.stroke(); }
    c.restore();
  };
  // queue/gate dot position: dots arrive every dt, wait behind each other, pass the gate one by one.
  L.queuePos = (i, s, o) => {
    const ti = o.t0 + i * o.dt; if (s < ti) return null;
    const raw = o.x0 + (s - ti) * o.sp, pi = o.p0 + i * o.pdt; let k = 0;
    for (let j = 0; j < i; j++) k += 1 - clamp((s - (o.p0 + j * o.pdt)) / .35);
    if (s >= pi) return { x: o.gateX + (s - pi) * (o.sp2 || o.sp), passed: true, since: s - pi };
    return { x: Math.min(raw, o.gateX - o.gap * k), passed: false };
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = L; else root.L = L;
})(this);
