/* Calibrated — figure kit
   Eight marks for drawing quantities as technical figures:
   leader + boxed value, ruler, dimension line, detail inset, hatch, nodes,
   numbered command, FIG. label. Plus a few helpers built from them.

   Ink rules: everything is ink in quiet hairlines. The one live thing is lit
   by the lamp: pass ink 'lv' and the stroke, text or box outline turns lamp
   amber, and a live node becomes a small glowing star.
   'ft' is red markup (faults, limits), 'ok' is the checker's green.

   Every primitive returns an SVG string. Compose them, then hand the result
   to Calibrated.draw(svgElement, markup, label).

   Colours are written as CSS variables (style="fill:var(--fg)"), so a theme
   switch recolours every figure without re-rendering. Pass a token name
   ('fg', 'mu', 'ky', 'fa', 'e1', 'ed', 'lv', 'ok', 'ft', 'pn', 'bg', 'well')
   or any CSS colour. 'ky' is for small text (scale numbers, FIG. numbers,
   quiet names); 'fa' is for marks only (ticks, leaders, open nodes).

   Needs calibrated.css (the tokens) on the page. No dependencies.
   Load as a classic script; it defines window.Calibrated. */
(function (root) {
  'use strict';

  /* ── ink */
  const TOKENS = {
    fg: '--fg', mu: '--muted', ky: '--key', fa: '--faint', e1: '--edge', ed: '--edge-strong',
    lv: '--live', ok: '--ok', ft: '--fault', pn: '--panel', bg: '--raised',
    well: '--well', title: '--title', swipe: '--swipe', on: '--on-swipe', glow: '--glow',
  };
  /* 'lv' is the lamp: strokes and text in --live; as a fill it's a faint tint */
  const ink = (c) => (c in TOKENS ? `var(${TOKENS[c]})` : c);
  const LIVE = 'lv';
  const fill = (c) => `fill:${c === 'none' ? 'none' : ink(c)}`;
  const stroke = (c) => `stroke:${c === 'none' ? 'none' : ink(c)}`;
  const paint = (f, s, extra = '') => ` style="${f != null ? fill(f) + ';' : ''}${s != null ? stroke(s) + ';' : ''}${extra}"`;

  /* ── text metrics
     Labels are set in the legend font at 11px. Widths are measured on a canvas
     with the page's real --font-legend, so boxes fit whatever font loaded.
     Without a DOM, fall back to 0.6em per character (true for most monos). */
  const FS = 11;
  const CH = FS * 0.6;
  let ctx = null, family = null;
  const widths = new Map();
  function textWidth(s, fs = FS) {
    s = String(s);
    if (typeof document === 'undefined') return s.length * fs * 0.6;
    if (!ctx) ctx = document.createElement('canvas').getContext('2d');
    if (family === null) family = getComputedStyle(document.documentElement).getPropertyValue('--font-legend').trim() || 'monospace';
    const key = fs + '|' + s;
    let w = widths.get(key);
    if (w === undefined) { ctx.font = `${fs}px ${family}`; w = Math.ceil(ctx.measureText(s).width * 10) / 10; widths.set(key, w); }
    return w;
  }
  function resetMetrics() { widths.clear(); family = null; }

  /* ready(fn) · run fn once fonts are in, and again whenever a font finishes
     loading later, so measured boxes always fit. */
  const readyFns = [];
  function ready(fn) {
    readyFns.push(fn);
    if (typeof document === 'undefined' || !document.fonts) { fn(); return; }
    document.fonts.ready.then(() => fn());
  }
  if (typeof document !== 'undefined' && document.fonts && document.fonts.addEventListener) {
    document.fonts.addEventListener('loadingdone', () => { resetMetrics(); readyFns.forEach((f) => f()); });
  }

  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const n2 = (v) => Math.round(v * 100) / 100;
  /* a solid lamp fill: K.rect turns ink 'lv' into the faint tint */
  const LAMP = 'var(--live)';
  /* fit · text cut with … to fit room px */
  function fit(s, room) {
    s = String(s ?? '');
    if (textWidth(s) <= room) return s;
    while (s.length > 1 && textWidth(s + '…') > room) s = s.slice(0, -1);
    return s + '…';
  }
  /* nice · the smallest 1, 2 or 5 × 10ⁿ at or above raw */
  const nice = (raw) => { const p = Math.pow(10, Math.floor(Math.log10(raw))); return [1, 2, 5, 10].map((m) => m * p).find((m) => m >= raw * (1 - 1e-9)); };

  /* blink(el, at) · the landing blink: two hard offs of 30ms each (two frames at
     60Hz; shorter and a blink can fall between frames), run as a Web Animation
     so dropped frames can't stretch or skip it. at: ms of it already past. */
  const BLINK = 120;
  const BLINK_FRAMES = [0, 0.5].flatMap((o) => [
    { opacity: 0.15, offset: o }, { opacity: 0.15, offset: o + 0.25 },
    { opacity: 1, offset: o + 0.2501 }, { opacity: 1, offset: o + 0.5 },
  ]);
  function blink(el, at = 0) {
    if (!el || !el.animate) return null;
    const a = el.animate(BLINK_FRAMES, { duration: BLINK });
    a.currentTime = at;
    return a;
  }

  /* ── unique ids for <pattern> so two figures never clash */
  let uid = 0;
  const id = (p = 'cal') => `${p}-${(++uid).toString(36)}`;

  /* the optional stroke attributes shared by line, path and rect */
  const strokeAttrs = (o) => `${o.w ? ` stroke-width="${o.w}"` : ''}${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.cap ? ` stroke-linecap="${o.cap}"` : ''}${o.opacity ? ` stroke-opacity="${o.opacity}"` : ''}`;
  /* poly · points [[x, y], …] as path data */
  const poly = (pts) => 'M' + pts.map((p) => n2(p[0]) + ' ' + n2(p[1])).join(' L');

  const K = {
    /* text label · t(x, y, 'label', ink, anchor, letterSpacing, { fs, wt }) · fs and wt set a size and weight */
    t(x, y, s, c = 'mu', a = 'start', ls = 0, o = {}) {
      const st = (o.fs ? `font-size:${o.fs}px;` : '') + (o.wt ? `font-weight:${o.wt};` : '');
      return `<text x="${n2(x)}" y="${n2(y)}" text-anchor="${a}"${ls ? ` letter-spacing="${ls}"` : ''}${paint(c, null, st)}>${esc(s)}</text>`;
    },

    /* plain line / path / rect / circle, painted with tokens */
    line(x1, y1, x2, y2, c = 'ed', o = {}) {
      return `<line x1="${n2(x1)}" y1="${n2(y1)}" x2="${n2(x2)}" y2="${n2(y2)}"${strokeAttrs(o)}${paint(null, c)}/>`;
    },
    path(d, c = 'ed', o = {}) {
      return `<path d="${d}"${strokeAttrs(o)}${paint(o.fill || 'none', c)}/>`;
    },
    rect(x, y, w, h, f = 'none', s = 'ed', o = {}) {
      if (f === LIVE) f = 'swipe';
      return `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}"${strokeAttrs(o)}${paint(f, s)}/>`;
    },
    circle(cx, cy, r, f = 'pn', s = 'fg') {
      if (f === LIVE) f = 'swipe';
      return `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${r}"${paint(f, s)}/>`;
    },

    /* star · the lamp: a four-point star with a soft glow. One per figure. */
    star(x, y, r = 7, c = LIVE) {
      const a = r * 0.2, d = `M${n2(x)} ${n2(y - r)}L${n2(x + a)} ${n2(y - a)}L${n2(x + r)} ${n2(y)}L${n2(x + a)} ${n2(y + a)}L${n2(x)} ${n2(y + r)}L${n2(x - a)} ${n2(y + a)}L${n2(x - r)} ${n2(y)}L${n2(x - a)} ${n2(y - a)}Z`;
      return `<path d="${d}"${paint(c, 'none', c === LIVE ? 'filter:drop-shadow(0 0 3px var(--glow))' : '')}/>`;
    },

    /* highlight · a faint lamp tint behind an area (use sparingly: lamp lines and text come first) */
    highlight(x, y, w, h) { return K.rect(x, y, w, h, 'swipe', 'none'); },

    /* centre line · ISO long-dash-dot, for axes and symmetry */
    centre(x1, y1, x2, y2, c = 'fa') { return K.line(x1, y1, x2, y2, c, { dash: '10 3 2 3' }); },

    /* FIG. label · top-left of every figure; the number is stable */
    fig(n, title, x = 0, y = 11) {
      const w = textWidth(`FIG.${n}`) + 2 + CH * 1.5;
      return K.t(x, y, `FIG.${n}`, 'ky', 'start', 0.5) + (title ? K.t(x + w, y, String(title).toUpperCase(), 'mu', 'start', 0.5) : '');
    },

    /* boxed value · name over value. w = null sizes to the text */
    box(x, y, w, l1, l2, c2 = 'fg', s = 'ed') {
      const W = Math.max(w || 0, Math.max(textWidth(l1), l2 ? textWidth(l2) : 0) + 14);
      return K.rect(x, y, W, l2 ? 32 : 19, 'pn', s) + K.t(x + 7, y + 13, l1, 'mu') + (l2 ? K.t(x + 7, y + 26, l2, c2) : '');
    },
    boxWidth(l1, l2 = '') { return Math.max(textWidth(l1), textWidth(l2)) + 14; },

    /* double-ruled box for the headline result (cache hit, total, verdict) */
    plate(x, y, w, l1, l2, c = 'fg') {
      const W = Math.max(w || 0, Math.max(textWidth(l1), textWidth(l2)) + 18);
      return K.rect(x, y, W, 40, 'pn', 'none')
        + K.rect(x, y, W, 40, 'none', c, { w: 1.2 }) + K.rect(x + 3, y + 3, W - 6, 34, 'none', c, { w: 0.6 })
        + K.t(x + 9, y + 17, l1, c === 'fg' ? 'mu' : c) + K.t(x + 9, y + 32, l2, c);
    },

    /* counted box · a zero-padded number in a tight box, vertically centred on y */
    count(x, y, n, c = 'fg', pad = 0) {
      const s = pad ? String(n).padStart(pad, '0') : String(n);
      const w = K.countWidth(s);
      return K.rect(x, y - 8, w, 16, 'pn', c === 'fg' ? 'ed' : c) + K.t(x + 4, y + 4, s, c);
    },
    countWidth(s) { return textWidth(s) + 8; },

    /* leader · a dot on what is measured, an elbowed line to the label */
    leader(pts, dot = true) {
      return K.path(poly(pts), 'fa') + (dot ? K.circle(pts[0][0], pts[0][1], 2, 'pn', 'fg') : '');
    },

    /* dimension line · a span with its length written into the gap */
    dim(x1, x2, y, label, c = 'mu') {
      const m = (x1 + x2) / 2, w = textWidth(label) + 8;
      if (w + 12 > Math.abs(x2 - x1)) {
        /* label wider than the span: draw the span whole and set the label above it */
        const d = `M${n2(x1)} ${y - 4}V${y + 4}M${n2(x2)} ${y - 4}V${y + 4}M${n2(x1)} ${y}H${n2(x2)}`;
        return K.path(d, 'fa') + K.t(m, y - 6, label, c, 'middle');
      }
      const d = `M${n2(x1)} ${y - 4}V${y + 4}M${n2(x2)} ${y - 4}V${y + 4}M${n2(x1)} ${y}H${n2(m - w / 2)}M${n2(m + w / 2)} ${y}H${n2(x2)}`;
      const heads = `M${n2(x1)} ${y}l5 -2.5v5zM${n2(x2)} ${y}l-5 -2.5v5z`;
      return K.path(d, 'fa') + `<path d="${heads}"${paint('fa', 'fa')}/>` + K.t(m, y + 3.5, label, c, 'middle');
    },

    /* vertical dimension line, label to the right */
    vdim(x, y1, y2, label, c = 'mu') {
      const d = `M${x - 4} ${n2(y1)}H${x + 4}M${x - 4} ${n2(y2)}H${x + 4}M${x} ${n2(y1)}V${n2(y2)}`;
      const heads = `M${x} ${n2(y1)}l-2.5 5h5zM${x} ${n2(y2)}l-2.5 -5h5z`;
      return K.path(d, 'fa') + `<path d="${heads}"${paint('fa', 'fa')}/>` + K.t(x + 8, (y1 + y2) / 2 + 4, label, c);
    },

    /* nodes · done ■  todo □  merge ◇  live ✦ (a lamp star with a glow)  fault ■ (red)  started ▣ */
    node(x, y, st = 'todo', size = 8) {
      const h = size / 2;
      switch (st) {
        case 'live':
          return K.star(x, y, size * 0.85);
        case 'done': return K.rect(x - h, y - h, size, size, 'fg', 'none');
        case 'fault': return K.rect(x - h, y - h, size, size, 'ft', 'none');
        case 'merge': return `<path d="M${x} ${y - 6}L${x + 6} ${y}L${x} ${y + 6}L${x - 6} ${y}Z" stroke-width="1.3"${paint('pn', 'fg')}/>`;
        case 'started': return K.rect(x - h - 0.5, y - h - 0.5, size + 1, size + 1, 'pn', 'fg') + K.rect(x - 2, y - 2, 4, 4, 'fg', 'none');
        default: return K.rect(x - h, y - h, size, size, 'pn', 'fa');
      }
    },
    /* a row of nodes on a faint line */
    nodes(x0, y, step, states, opts = {}) {
      const x1 = x0 + (states.length - 1) * step;
      let g = opts.line === false ? '' : K.line(x0, y, x1, y, 'e1');
      states.forEach((s, i) => { g += K.node(x0 + i * step, y, s, opts.size); });
      return g;
    },
    states(n, done, live = -1, fault = -1) {
      return Array.from({ length: n }, (_, i) => (i === fault ? 'fault' : i < done ? 'done' : i === live ? 'live' : 'todo'));
    },

    /* scale · value → x. Linear, or linear up to `knee` then log (P5 diff) */
    scale(x0, x1, min, max, o = {}) {
      if (o.knee) {
        const kx = o.kneeAt ?? 0.4;
        return (v) => {
          if (v <= o.knee) return x0 + (v - min) / (o.knee - min) * kx * (x1 - x0);
          return x0 + (kx + Math.log10(v / o.knee) / Math.log10(max / o.knee) * (1 - kx)) * (x1 - x0);
        };
      }
      /* an empty range maps everything to the start rather than to NaN */
      return max > min ? (v) => x0 + (v - min) / (max - min) * (x1 - x0) : () => x0;
    },

    /* ruler · numbered at major ticks only. One scale per figure.
       ruler(x0, x1, y, max, step, labelEvery, fmt, up, min) */
    ruler(x0, x1, y, max, step, every = 5, fmt = (v) => String(v), up = false, min = 0) {
      let g = K.line(x0, y, x1, y, 'ed');
      /* no span or no step: the baseline alone (a bad step would loop forever) */
      if (!(max > min) || !(step > 0) || !isFinite(max - min)) return g;
      /* at most ~200 ticks: a fine step on a long scale coarsens by whole multiples */
      step *= Math.max(1, Math.ceil((max - min) / step / 200));
      every = Math.max(1, Math.round(every) || 1);
      const X = K.scale(x0, x1, min, max), dir = up ? -1 : 1, n = Math.floor((max - min) / step + 1e-9);
      for (let i = 0; i <= n; i++) {
        /* each tick from its index, so float steps don't drift (0.30000000000000004) */
        const v = Math.round((min + i * step) * 1e9) / 1e9, x = X(v), M = i % every === 0;
        g += K.line(x, y, x, y + dir * (M ? 6 : 3), M ? 'fa' : 'ed');
        if (M) g += K.t(x, up ? y - 10 : y + 17, fmt(v), 'ky', i === 0 ? 'start' : 'middle');
      }
      return g;
    },

    /* hatch · read-only, locked, over the limit. Returns { def, url } */
    hatch(c = 'fa', gap = 5, opacity = 1, w = 1) {
      const pid = id('hatch'), x = w > 1 ? gap / 2 : 0;   /* a heavy stripe sits mid-tile so it isn't clipped */
      return {
        def: `<defs><pattern id="${pid}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="${x}" y1="0" x2="${x}" y2="${gap}" stroke-width="${w}"${opacity !== 1 ? ` stroke-opacity="${opacity}"` : ''}${paint(null, c)}/></pattern></defs>`,
        url: `url(#${pid})`,
      };
    },
    /* a hatched rectangle in one call */
    hatchRect(x, y, w, h, c = 'fa', s = 'ed', gap = 5, opacity = 1) {
      const H = K.hatch(c, gap, opacity);
      return H.def + `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}" fill="${H.url}"${paint(null, s)}/>`;
    },

    /* numbered command · step number in a box, then the exact command */
    cmd(x, y, n, s, c = 'fg', a = 'start') {
      const bx = a === 'end' ? x - textWidth('$ ' + s) - 20 : x;
      return K.rect(bx, y - 10, 14, 14, 'none', 'ed') + K.t(bx + 7, y + 1, n, 'fg', 'middle') + K.t(bx + 20, y + 1, '$ ' + s, c);
    },

    /* detail inset · a dashed projection from a span to a magnified copy, labelled
       with its scale like a drawing detail: "DETAIL A  20:1" (name optional) */
    inset(sx0, sx1, sy, dx0, dx1, dy, factor, name) {
      return K.path(`M${n2(sx0)} ${sy}L${n2(dx0)} ${dy}M${n2(sx1)} ${sy}L${n2(dx1)} ${dy}`, 'fa', { dash: '2 3' })
        + (factor ? K.t(dx1 + 8, dy + 10, `${name ? 'DETAIL ' + name + '  ' : ''}${factor}:1`, 'mu') : '');
    },

    /* bracket · groups rows on one side, with a count tab in the middle */
    bracket(x, y0, y1, n, c = 'fg', side = 'left') {
      const d = side === 'left' ? 7 : -7, my = (y0 + y1) / 2;
      let g = K.path(`M${x + d} ${y0}H${x}V${y1}H${x + d}`, c);
      if (n != null) {
        const w = textWidth(n) + 5;
        g += K.rect(x - w / 2, my - 7, w, 14, 'pn', c) + K.t(x, my + 4, n, c, 'middle');
      }
      return g;
    },

    /* centre cross · marks an origin or the middle of a loop */
    cross(x, y, r = 6, c = 'fa') {
      return K.path(`M${x - r} ${y - r}L${x + r} ${y + r}M${x + r} ${y - r}L${x - r} ${y + r}`, c);
    },

    /* threshold · a fault-coloured mark across a ruler with its label */
    threshold(x, yTop, yBot, label, a = 'middle', c = 'ft') {
      const dx = a === 'end' ? -4 : a === 'start' ? 4 : 0;
      return K.line(x, yTop, x, yBot, c, { opacity: 0.7 }) + (label ? K.t(x + dx, a === 'middle' ? yTop - 4 : yTop + 8, label, c, a) : '');
    },

    /* side tag used to label rows of a comparison (FULL / COMPACT) */
    tag(y, s, x = 0) { return K.t(x, y + 4, String(s).toUpperCase(), 'ky', 'start', 0.5); },

    /* ── strong weight · heavier forms of the same marks (see weight()). Sizes in px. */
    W: { rule: 1.5, tick: 2, major: 3, base: 3, needle: 4, plate: 2, lamp: 2.5, hatch: 2.5, pitch: 7, wt: 600 },

    /* brk · the break mark in fault ink where a run goes on past the end of its scale; hbrk at strong weight */
    brk(x, y) { return K.line(x - 3, y + 5, x + 1, y - 7, 'ft') + K.line(x + 1, y + 5, x + 5, y - 7, 'ft'); },
    hbrk(x, y) { return K.line(x - 4, y + 7, x + 1, y - 8, 'ft', { w: 2 }) + K.line(x + 2, y + 7, x + 7, y - 8, 'ft', { w: 2 }); },

    /* hazard · alert-zone stripes at strong weight: hatch(c, 7, 1, 2.5) */
    hazard(c = 'ft') { return K.hatch(c, K.W.pitch, 1, K.W.hatch); },

    /* mitre · a polyline with square corners and ends, so heavy strokes close without a notch */
    mitre(pts, c = 'fg', w = K.W.major) {
      return `<path d="${poly(pts)}" stroke-width="${w}" stroke-linejoin="miter" stroke-linecap="square"${paint('none', c)}/>`;
    },

    /* outline · a rectangle stroked inside its bounds */
    outline(x, y, w, h, c = 'fg', sw = K.W.plate) { return K.rect(x + sw / 2, y + sw / 2, w - sw, h - sw, 'none', c, { w: sw }); },

    /* nameplate · the strong reading box: an inverted name strip over the value. Ink 'fg' or 'ft'
       fill the strip; the lamp 'lv' only outlines it. 40px tall; w0 holds a minimum width. */
    nameplate(x, y, name, value, c = 'fg', w0 = 0) {
      const N = String(name).toUpperCase(), w = Math.max(w0, K.plateWidth(name, value)), band = 15;
      let g = K.rect(x, y, w, 40, 'pn', 'none');
      if (c === LIVE) g += K.outline(x, y, w, 40, LIVE, K.W.lamp) + K.line(x, y + band, x + w, y + band, LIVE, { w: 1.5 }) + K.t(x + 9, y + 11, N, LIVE, 'start', 0.9, { fs: 9.5, wt: 600 });
      else g += K.rect(x, y, w, band, c, 'none') + K.outline(x, y, w, 40, c, K.W.plate) + K.t(x + 9, y + 11, N, 'pn', 'start', 0.9, { fs: 9.5, wt: 600 });
      return g + K.t(x + 9, y + 32, value, c, 'start', 0, { fs: 13, wt: 700 });
    },
    plateWidth(name, value) { const N = String(name).toUpperCase(); return Math.max(textWidth(N, 9.5) + 0.9 * N.length, textWidth(value, 13)) + 18; },

    /* chip · the strong count: an inverted value, vertically centred on y. The lamp only outlines. */
    chip(x, y, s, c = 'fg', fs = 11, w0 = 0) {
      const w = Math.max(w0, K.chipWidth(s, fs));
      if (c === LIVE) return K.rect(x, y - 9, w, 18, 'pn', 'none') + K.outline(x, y - 9, w, 18, LIVE, 2) + K.t(x + 6, y + 4, s, LIVE, 'start', 0, { fs, wt: 700 });
      return K.rect(x, y - 9, w, 18, c, 'none') + K.t(x + 6, y + 4, s, 'pn', 'start', 0, { fs, wt: 700 });
    },
    chipWidth(s, fs = 11) { return textWidth(String(s), fs) + 12; },
  };

  /* ── mounting */

  /* attr(el, name, value) · sets an attribute only when it changes, so a
     figure redrawn every frame doesn't invalidate its own style */
  function attr(el, name, value) {
    value = String(value);
    if (el.getAttribute(name) !== value) el.setAttribute(name, value);
  }

  /* parts(markup) · the markup split into its top-level elements (and any
     text between them), or null when it can't be split cleanly */
  function parts(s) {
    const out = [], n = s.length;
    let i = 0, depth = 0, start = 0;
    while (i < n) {
      if (s[i] !== '<') {
        const j = s.indexOf('<', i), e = j < 0 ? n : j;
        if (!depth) out.push(s.slice(i, e));
        i = e;
        continue;
      }
      if (s.startsWith('<!--', i)) {
        const j = s.indexOf('-->', i);
        if (j < 0) return null;
        if (!depth) out.push(s.slice(i, j + 3));
        i = j + 3;
        continue;
      }
      let j = i + 1, q = '';
      for (; j < n; j++) {
        const c = s[j];
        if (q) { if (c === q) q = ''; } else if (c === '"' || c === "'") q = c; else if (c === '>') break;
      }
      if (j >= n) return null;
      if (s[i + 1] === '/') depth--;
      else {
        if (!depth) start = i;
        if (s[j - 1] !== '/') depth++;
      }
      if (depth < 0) return null;
      if (!depth) out.push(s.slice(start, j + 1));
      i = j + 1;
    }
    return depth ? null : out;
  }

  /* patch(svg, markup) · sets an <svg>'s contents like innerHTML, but keeps
     the top-level elements whose markup didn't change and parses only the
     rest. A figure replayed frame by frame then rebuilds just what moved
     (the line, the nodes), not the ruler and frame around it. */
  const SVG_NS = 'http://www.w3.org/2000/svg';
  function patch(svg, markup) {
    const next = parts(markup), prev = svg._calParts, kids = [...svg.childNodes];
    svg._calParts = next;
    if (!next || !prev || prev.length !== kids.length) { svg.innerHTML = markup; return svg; }
    /* unchanged parts are reused by their markup; the rest is parsed in one go */
    const pool = new Map();
    prev.forEach((p, i) => { const l = pool.get(p); if (l) l.push(kids[i]); else pool.set(p, [kids[i]]); });
    const nodes = new Array(next.length), freshAt = [];
    let fresh = '';
    next.forEach((p, i) => {
      const l = pool.get(p);
      if (l && l.length) nodes[i] = l.shift();
      else { fresh += p; freshAt.push(i); }
    });
    if (freshAt.length) {
      const scratch = document.createElementNS(SVG_NS, 'svg');
      scratch.innerHTML = fresh;
      /* adjacent text parts merge when parsed together: fall back to a full redraw */
      if (scratch.childNodes.length !== freshAt.length) { svg.innerHTML = markup; return svg; }
      const made = [...scratch.childNodes];
      freshAt.forEach((at, k) => { nodes[at] = made[k]; });
    }
    pool.forEach((l) => l.forEach((node) => node.remove()));
    nodes.forEach((node, i) => { if (svg.childNodes[i] !== node) svg.insertBefore(node, svg.childNodes[i] || null); });
    return svg;
  }

  /* scroll hosts · when a figure is wider than its box at 80%, the box it
     scrolls in becomes a Tab stop, so the cut-off part can be reached from
     the keyboard, and is named "figure, scrolls sideways" unless it has a
     name already. data-cal-scroll lists what was added; it is removed again
     once the figure fits. A host with its own tabindex is left alone. */
  function scrollHost(host) {
    if (!host || host.nodeType !== 1) return;
    const over = host.scrollWidth > host.clientWidth + 1, marked = host.hasAttribute('data-cal-scroll');
    if (over === marked) return;
    if (over) {
      if (host.hasAttribute('tabindex')) return;
      const added = ['tabindex'];
      host.tabIndex = 0;
      if (!host.hasAttribute('aria-label') && !host.hasAttribute('aria-labelledby')) {
        host.setAttribute('aria-label', 'figure, scrolls sideways'); added.push('aria-label');
        /* a name needs a role to be read on a plain box */
        if (!host.hasAttribute('role') && !/^(FIGURE|SECTION|ARTICLE|ASIDE|NAV|MAIN)$/.test(host.tagName)) { host.setAttribute('role', 'group'); added.push('role'); }
      }
      host.setAttribute('data-cal-scroll', added.join(' '));
    } else {
      host.getAttribute('data-cal-scroll').split(' ').forEach((a) => a && host.removeAttribute(a));
      host.removeAttribute('data-cal-scroll');
    }
  }
  /* both sides are watched: the host when it resizes, the svg when a remount changes its width */
  const hosts = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver((es) => es.forEach((e) => scrollHost(e.target.namespaceURI === SVG_NS ? e.target.parentElement : e.target)))
    : null;
  const watched = hosts ? new WeakSet() : null;
  function watchHost(svg) {
    const host = svg.parentElement;
    if (!hosts || !host || host === document.body || host === document.documentElement) return;
    [svg, host].forEach((el) => { if (!watched.has(el)) { watched.add(el); hosts.observe(el); } });
  }

  /* pick(svg) · an element, or the first match of a selector */
  const pick = (s) => (typeof s === 'string' ? document.querySelector(s) : s);

  /* draw(svg, markup, label) · fills an <svg>, marks it as a figure, sets role and label */
  function draw(svg, markup, label) {
    svg = pick(svg);
    if (!svg) return null;
    attr(svg, 'data-cal', '');
    if (!svg.getAttribute('viewBox') && svg.getAttribute('width')) {
      svg.setAttribute('viewBox', `0 0 ${svg.getAttribute('width')} ${svg.getAttribute('height')}`);
    }
    /* shrink to fit down to 80% of natural size (legends stay readable, as
       the instruments do); past that the container scrolls and is named */
    const nw = parseFloat(svg.getAttribute('width'));
    const minW = Math.round(nw * 0.8) + 'px';
    if (nw > 200 && svg.style.minWidth !== minW) svg.style.minWidth = minW;
    if (nw > 200) watchHost(svg);
    if (label) { attr(svg, 'role', 'img'); attr(svg, 'aria-label', label); }
    else if (!svg.hasAttribute('aria-label')) svg.setAttribute('aria-hidden', 'true');
    return patch(svg, markup);
  }

  /* svg(w, h, markup, label) · a complete <svg> string */
  function svg(w, h, markup, label) {
    const a11y = label ? ` role="img" aria-label="${esc(label)}"` : ' aria-hidden="true"';
    return `<svg data-cal width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"${a11y}>${markup}</svg>`;
  }

  /* density(el) · 'full' or 'compact', from the nearest [data-density] */
  function density(el) {
    const host = el && el.closest ? el.closest('[data-density]') : null;
    return host && host.getAttribute('data-density') === 'compact' ? 'compact' : 'full';
  }

  /* weight(el) · 'soft' or 'strong', from the nearest [data-weight] */
  function weight(el) {
    const host = el && el.closest ? el.closest('[data-weight]') : null;
    return host && host.getAttribute('data-weight') === 'strong' ? 'strong' : 'soft';
  }

  /* formatters */
  const fmt = {
    k(v, d = 1) {
      const a = Math.abs(v);
      if (a >= 1e12) return (v / 1e12).toFixed(d).replace(/\.0$/, '') + 'T';
      if (a >= 1e9) return (v / 1e9).toFixed(d).replace(/\.0$/, '') + 'G';
      if (a >= 1e6) return (v / 1e6).toFixed(d).replace(/\.0$/, '') + 'M';
      if (a >= 1e3) return (v / 1e3).toFixed(d).replace(/\.0$/, '') + 'k';
      return String(Math.round(v));
    },
    pct(v, d = 0) { return (v * 100).toFixed(d) + '%'; },
    dur(sec) {
      sec = Math.max(0, Math.round(sec));
      const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
      if (h) return `${h}h ${String(m).padStart(2, '0')}m`;
      if (!m) return `${s}s`;
      return `${m}m ${String(s).padStart(2, '0')}s`;
    },
    pad(n, w = 2) { return String(n).padStart(w, '0'); },
  };

  const api = { K, draw, patch, attr, svg, density, weight, ink, textWidth, resetMetrics, ready, esc, id, fmt, FS, CH, n2, LAMP, fit, nice, blink, BLINK, poly, pick };
  root.Calibrated = Object.assign(root.Calibrated || {}, api);
})(typeof window !== 'undefined' ? window : globalThis);
