// Systemata video engine v3. Everything is a pure function of time. Design space 1920x1080 (rendered at 2x = 4K).
(function (root) {
  const L = { W: 1920, H: 1080, URL: 'getsystemata.com' };
  // Brand (from the site's CSS/favicon): emerald, mint, charcoal, Inter
  L.C = { paper: '#F5F8F6', ink: '#1C1F1E', mut: '#5D6663', blue: '#0F5A43', deep: '#0B3D2E', mint: '#3DDC97', tint: '#E1EFE8', warm: '#E8643C', warm2: '#FBE4DB', line: '#E3E8E5', card: '#FFFFFF' };
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  L.clamp = clamp; L.prog = (t, a, b) => clamp((t - a) / (b - a));
  L.eo = x => 1 - Math.pow(1 - x, 3); L.ei = x => x * x * x; L.eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  L.expo = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x); L.back = x => { const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  L.lerp = (a, b, u) => a + (b - a) * u; L.frac = x => x - Math.floor(x);
  L.rnd = (i, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  L.font = (w, s) => `${w} ${s}px Inter, system-ui, sans-serif`;
  L.col = d => d ? { ink: '#FFFFFF', mut: '#A3C2B6', acc: L.C.mint, strong: L.C.mint, card: 'rgba(255,255,255,.07)', line: 'rgba(255,255,255,.18)', dark: 1 }
                  : { ink: L.C.ink, mut: L.C.mut, acc: L.C.blue, strong: L.C.deep, card: '#FFFFFF', line: L.C.line, dark: 0 };

  // ---------- background: light/dark mix with slow drifting light blobs
  L.bg3 = (c, t, dark) => {
    const W = L.W, H = L.H; c.save();
    c.fillStyle = L.C.paper; c.fillRect(0, 0, W, H);
    for (let k = 0; k < 3; k++) { const x = W * (.5 + .38 * Math.sin(t * .13 + k * 2.1)), y = H * (.5 + .32 * Math.cos(t * .11 + k * 1.7)); const g = c.createRadialGradient(x, y, 0, x, y, 760);
      g.addColorStop(0, k === 1 ? 'rgba(61,220,151,.16)' : 'rgba(15,90,67,.07)'); g.addColorStop(1, 'rgba(61,220,151,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
    c.fillStyle = 'rgba(11,61,46,.06)'; for (let x = 60; x < W; x += 60) for (let y = 60; y < H; y += 60) { c.beginPath(); c.arc(x, y, 1.5, 0, 6.2832); c.fill(); }
    if (dark > 0) { c.globalAlpha = dark; const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0C4333'); g.addColorStop(.55, '#08281F'); g.addColorStop(1, '#051A14'); c.fillStyle = g; c.fillRect(0, 0, W, H);
      for (let k = 0; k < 3; k++) { const x = W * (.5 + .4 * Math.sin(t * .17 + k * 2.4 + 1)), y = H * (.5 + .34 * Math.cos(t * .13 + k * 1.9)); const g2 = c.createRadialGradient(x, y, 0, x, y, 820);
        g2.addColorStop(0, k === 0 ? 'rgba(61,220,151,.20)' : 'rgba(15,110,80,.34)'); g2.addColorStop(1, 'rgba(61,220,151,0)'); c.fillStyle = g2; c.fillRect(0, 0, W, H); }
      c.fillStyle = 'rgba(255,255,255,.05)'; for (let x = 60; x < W; x += 60) for (let y = 60; y < H; y += 60) { c.beginPath(); c.arc(x, y, 1.5, 0, 6.2832); c.fill(); } }
    c.restore();
  };
  L.logo = (c, x, y, size, a = 1) => { c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(size / 32, size / 32); L.rrect(c, 0, 0, 32, 32, 6); c.fillStyle = L.C.deep; c.fill();
    c.fillStyle = '#fff'; c.fillRect(6, 8, 20, 4); c.fillStyle = L.C.mint; c.fillRect(6, 14, 14, 4); c.fillStyle = '#fff'; c.fillRect(6, 20, 20, 4);
    if (size > 0) { c.lineWidth = .5; c.strokeStyle = 'rgba(61,220,151,.5)'; L.rrect(c, .25, .25, 31.5, 31.5, 6); c.stroke(); } c.restore(); };
  L.chrome3 = (c, t, dur, dark) => { const k = L.col(dark); c.save(); L.logo(c, 96, 60, 44); L.text(c, 'Systemata', 154, 94, { size: 30, weight: 700, color: dark ? '#fff' : L.C.deep });
    c.fillStyle = 'rgba(128,150,140,.25)'; c.fillRect(96, L.H - 58, L.W - 192, 3); c.fillStyle = L.C.mint; c.fillRect(96, L.H - 58, (L.W - 192) * clamp(t / dur), 3); c.restore(); };
  L.rrect = (c, x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  // glass / paper card with layered shadow
  L.card = (c, x, y, w, h, o = {}) => { c.save(); c.globalAlpha *= o.alpha ?? 1; const d = o.dark;
    if (!d && o.shadow !== false) { c.shadowColor = 'rgba(11,61,46,.10)'; c.shadowBlur = 70; c.shadowOffsetY = 28; L.rrect(c, x, y, w, h, o.r ?? 32); c.fillStyle = '#fff'; c.fill(); c.shadowColor = 'rgba(11,61,46,.08)'; c.shadowBlur = 8; c.shadowOffsetY = 2; L.rrect(c, x, y, w, h, o.r ?? 32); c.fill(); c.shadowColor = 'transparent'; }
    L.rrect(c, x, y, w, h, o.r ?? 32);
    if (d) { const g = c.createLinearGradient(x, y, x, y + h); g.addColorStop(0, 'rgba(255,255,255,.10)'); g.addColorStop(1, 'rgba(255,255,255,.04)'); c.fillStyle = o.fill || g; c.fill(); c.lineWidth = 2; c.strokeStyle = o.stroke || 'rgba(255,255,255,.16)'; c.stroke(); }
    else { c.fillStyle = o.fill || '#fff'; c.fill(); c.lineWidth = o.lw || 2; c.strokeStyle = o.stroke || 'rgba(11,61,46,.07)'; c.stroke(); } c.restore(); };
  // ---------- text
  L.text = (c, s, x, y, o = {}) => { c.save(); c.globalAlpha *= o.alpha ?? 1; c.font = L.font(o.weight || 600, o.size || 48); c.fillStyle = o.color || L.C.ink; c.textAlign = o.align || 'left'; c.textBaseline = 'alphabetic'; if (o.ls) c.letterSpacing = o.ls + 'px'; c.fillText(s, x, y); c.restore(); };
  // runs: string or [[text,color],...]. returns total width (and draws unless o.measure)
  L.runs = (c, runs, x, y, o = {}) => { if (typeof runs === 'string') runs = [[runs, o.color]]; c.save(); c.font = L.font(o.weight || 700, o.size || 80); if (o.ls) c.letterSpacing = o.ls + 'px';
    const ws = runs.map(r => c.measureText(r[0]).width), tot = ws.reduce((a, b) => a + b, 0); let x0 = o.align === 'center' ? x - tot / 2 : o.align === 'right' ? x - tot : x;
    if (!o.measure) runs.forEach((r, i) => { c.fillStyle = r[1] || o.color || L.C.ink; c.textAlign = 'left'; c.fillText(r[0], x0, y); x0 += ws[i]; }); c.restore(); return tot; };
  // masked slide-up line reveal (the premium "text rising out of a mask" look)
  L.line = (c, runs, x, y, o, t, t0, dur = .85) => { const u = L.expo(L.prog(t, t0, t0 + dur)); if (u <= 0) return; const size = o.size || 96; c.save(); c.globalAlpha *= o.alpha ?? 1;
    c.beginPath(); c.rect(0, y - size * 1.0, L.W, size * 1.42); c.clip(); c.globalAlpha *= clamp(u * 2.5); L.runs(c, runs, x, y + (1 - u) * size * 1.1, o); c.restore(); };
  L.kicker = (c, s, x, y, color, a = 1, align = 'left') => { c.save(); c.globalAlpha *= a; c.font = L.font(700, 24); c.letterSpacing = '6px'; const w = c.measureText(s).width; c.restore();
    const x0 = align === 'center' ? x - (w + 56) / 2 : x; c.save(); c.globalAlpha *= a; L.rrect(c, x0, y - 12, 40, 5, 2.5); c.fillStyle = L.C.mint; c.fill(); c.restore(); L.text(c, s, x0 + 56, y, { size: 24, weight: 700, color, ls: 6, alpha: a }); };
  L.pop = (t, t0, dur = .6) => { const u = L.prog(t, t0, t0 + dur); return { a: clamp(u * 2.2), s: .86 + .14 * L.back(u), y: (1 - L.eo(u)) * 36 }; };
  // ---------- icons (Lucide, ISC) preloaded as images
  L.IMG = {}; const norm = col => col === '#fff' ? '#ffffff' : col.toUpperCase();
  L.loadIcons = async colors => { for (const [n, svg] of Object.entries(window.ICONS)) for (const col of colors) { const im = new Image();
    im.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.replace(/currentColor/g, col).replace('width="24"', 'width="384"').replace('height="24"', 'height="384"').replace('stroke-width="2"', 'stroke-width="1.7"')); await im.decode(); L.IMG[n + norm(col)] = im; } };
  L.icon = (c, name, x, y, s, color, a = 1) => { const im = L.IMG[name + norm(color)]; if (!im) return; c.save(); c.globalAlpha *= a; c.drawImage(im, x - s / 2, y - s / 2, s, s); c.restore(); };
  // ---------- effects
  L.glowDot = (c, x, y, r, color, a = 1, glow = 3.2) => { c.save(); c.globalAlpha *= a; const g = c.createRadialGradient(x, y, 0, x, y, r * glow); g.addColorStop(0, color + '88'); g.addColorStop(1, color + '00'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * glow, 0, 6.2832); c.fill();
    c.fillStyle = color; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill(); c.restore(); };
  L.polyAt = (pts, u) => { const segs = []; let tot = 0; for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segs.push(d); tot += d; }
    let d = clamp(u) * tot; for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const k = segs[i] ? d / segs[i] : 0; return [L.lerp(pts[i][0], pts[i + 1][0], k), L.lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; } return pts[pts.length - 1]; };
  L.polyline = (c, pts, upto = 1) => { c.beginPath(); c.moveTo(...pts[0]); const n = 40; for (let i = 1; i <= n; i++) { if (i / n > upto) break; const p = L.polyAt(pts, i / n); c.lineTo(...p); } };
  // drifting "chaos" network backdrop
  L.net = (c, t, rgb, alpha, n = 30) => { const P = []; for (let i = 0; i < n; i++) P.push([L.W * (.05 + .9 * L.rnd(i, 1)) + Math.sin(t * .4 + i) * 40, L.H * (.05 + .9 * L.rnd(i, 2)) + Math.cos(t * .33 + i * 1.3) * 34]);
    c.save(); c.lineWidth = 1.6; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]); if (d < 330) { c.strokeStyle = `rgba(${rgb},${alpha * (1 - d / 330)})`; c.beginPath(); c.moveTo(...P[i]); c.lineTo(...P[j]); c.stroke(); } }
    for (let i = 0; i < n; i++) { c.fillStyle = `rgba(${rgb},${alpha * 2.2})`; c.beginPath(); c.arc(P[i][0], P[i][1], 4, 0, 6.2832); c.fill(); } c.restore(); };
  // tangled -> straight morph (u:0..1)
  L.tangle = (c, x, y, w, h, u, n, colA, colB, lw = 6) => { const perm = [3, 0, 5, 2, 4, 1, 6, 8, 7]; for (let i = 0; i < n; i++) { const yl = y + i * h / (n - 1), tgt = y + perm[i % 9] % n * h / (n - 1), yr = L.lerp(tgt, yl, u), amp = (1 - u) * h * .55 * (i % 2 ? 1 : -1);
    c.beginPath(); c.moveTo(x, yl); c.bezierCurveTo(x + w * .35, yl + amp, x + w * .65, yr - amp, x + w, yr); c.lineWidth = lw; c.strokeStyle = u > .85 ? colB : u > .35 ? '#8aa88f' : colA; c.stroke(); }
    for (let i = 0; i < n; i++) { const yl = y + i * h / (n - 1), tgt = y + perm[i % 9] % n * h / (n - 1); L.glowDot(c, x, yl, 9, '#1C1F1E', .9, 1); L.glowDot(c, x + w, L.lerp(tgt, yl, u), 9, '#1C1F1E', .9, 1); } };
  // iris wipe: circle floods in (cover) then opens at the new scene (reveal); cut happens at tc
  L.iris = (c, t, tc, cx, cy, half = .36) => { if (t < tc - half || t > tc + half) return; const R = 2600; c.save(); c.beginPath();
    if (t < tc) { const r = R * L.eio(L.prog(t, tc - half, tc)); c.arc(cx, cy, r, 0, 6.2832); c.fillStyle = L.C.deep; c.fill(); c.lineWidth = 10; c.strokeStyle = L.C.mint; c.stroke(); }
    else { const r = R * L.eio(L.prog(t, tc, tc + half)); c.rect(-10, -10, L.W + 20, L.H + 20); c.moveTo(cx + r, cy); c.arc(cx, cy, r, 0, 6.2832, true); c.fillStyle = L.C.deep; c.fill('evenodd'); c.beginPath(); c.arc(cx, cy, r, 0, 6.2832); c.lineWidth = 10; c.strokeStyle = L.C.mint; c.stroke(); } c.restore(); };
  // end card: logo lockup, tagline, CTA
  L.endcard = (c, t, t0, o = {}) => { const e = (d) => t0 + d;
    for (let i = 0; i < 36; i++) { const u = L.frac(t * .05 + L.rnd(i, 3)), x = L.W * L.rnd(i, 4), y = L.H * (1.05 - u * 1.2); L.glowDot(c, x, y, 2 + L.rnd(i, 5) * 3, L.C.mint, .35 * Math.sin(u * Math.PI), 3); }
    const a = L.expo(L.prog(t, e(.2), e(1))); L.logo(c, 960 - 250, 190 + (1 - a) * 30, 110, a); L.text(c, 'Systemata', 960 - 250 + 140, 275 + (1 - a) * 30, { size: 84, weight: 800, color: '#fff', alpha: a });
    L.line(c, [['Trading chaos ', L.C.warm], ['for clarity.', L.C.mint]], 960, 520, { size: 104, weight: 800, align: 'center' }, t, e(1.1), .9);
    const b = L.pop(t, e(2.4), .7); c.save(); c.globalAlpha *= b.a; c.translate(960, 700 + b.y); c.scale(b.s, b.s); L.rrect(c, -230, -54, 460, 108, 54); c.fillStyle = L.C.mint; c.fill();
    L.text(c, o.cta || 'Book a call', 0, 16, { size: 44, weight: 800, color: L.C.deep, align: 'center' }); c.restore();
    L.text(c, L.URL, 960, 840, { size: 40, weight: 600, color: '#fff', align: 'center', alpha: L.expo(L.prog(t, e(3), e(3.8))) }); };
  if (typeof module !== 'undefined' && module.exports) module.exports = L; else root.L = L;
})(this);
