/* Calibrated — figure recipes
   Whole figures built from the kit, driven by plain data.
   Each recipe returns { w, h, markup, label }; mount it with
     Calibrated.mount(svgEl, Calibrated.recipes.lanes({...}))
   or get a string with Calibrated.render(recipeResult).

   Needs calibrated-figures.js first. */
(function (root) {
  'use strict';
  const C = root.Calibrated;
  if (!C) throw new Error('calibrated-recipes.js needs calibrated-figures.js first');
  const { K, textWidth: tw, fmt } = C;

  const head = (o) => (o.n != null || o.title ? K.fig(o.n ?? '', o.title || '') : '');

  /* warnings · data a recipe can't draw faithfully (a second lamp, a value off
     its scale, a missing field) is drawn the safe way and said once on the
     console; the result lists it as r.warnings, for a check before publishing. */
  const said = new Set();
  function warner(name) {
    const list = [];
    const warn = (m) => {
      m = `${name}: ${m}`;
      if (!list.includes(m)) list.push(m);
      if (!said.has(m)) { said.add(m); if (root.console) console.warn('Calibrated.recipes.' + m); }
    };
    warn.done = (r) => (list.length ? Object.assign(r, { warnings: list }) : r);
    return warn;
  }
  const num = (v, d = 0) => (Number.isFinite(+v) && v !== null && v !== '' ? +v : d);
  /* niceStep · a ruler step of 1, 2 or 5 × 10ⁿ giving about n ticks */
  const niceStep = (span, n = 15) => {
    const raw = span / n, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
  };
  /* brk · the break mark in fault ink where a run goes on past the end of its scale (as the instruments draw it) */
  const brk = (x, y) => K.line(x - 3, y + 5, x + 1, y - 7, 'ft') + K.line(x + 1, y + 5, x + 5, y - 7, 'ft');
  /* hbrk · the break mark at strong weight */
  const hbrk = (x, y) => K.line(x - 4, y + 7, x + 1, y - 8, 'ft', { w: 2 }) + K.line(x + 2, y + 7, x + 7, y - 8, 'ft', { w: 2 });
  const LAMP = 'var(--live)';   /* a solid lamp fill: K.rect turns ink 'lv' into the faint tint */
  const n2 = (v) => Math.round(v * 100) / 100;

  /* pen(o) · the marks a recipe draws with, at the data's weight ('soft' or 'strong').
     Strong keeps every position and swaps each mark for its heavy form, as the
     instruments draw it: 3px scales with mitred ends, nameplates for boxes, chips
     for numbers, 2px leaders and dimensions, larger nodes, 600-weight legends.
     A box keeps its centre, so leaders still meet it. */
  function pen(o) {
    const S = o.weight === 'strong', W = K.W;
    if (!S) {
      return {
        S, ruler: K.ruler, box: K.box, boxWidth: K.boxWidth, plate: K.plate, plateWidth: (a, b) => Math.max(94, tw(a) + 18, tw(b) + 18),
        leader: K.leader, dim: K.dim, node: K.node, cmd: K.cmd, brk, L: K.t, rh: 0,
      };
    }
    const ink = (c2, s) => (c2 === 'lv' || s === 'lv' ? 'lv' : c2 === 'ft' || s === 'ft' ? 'ft' : 'fg');
    return {
      S,
      /* ruler · a 3px scale closed by mitred end posts; heavy majors, light minors */
      ruler(x0, x1, y, max, step, every = 5, f = (v) => String(v), up = false, min = 0) {
        const dir = up ? -1 : 1;
        let g = K.mitre([[x0, y + dir * 9], [x0, y], [x1, y], [x1, y + dir * 9]], 'fg', W.base);
        if (!(max > min) || !(step > 0) || !isFinite(max - min)) return g;
        step *= Math.max(1, Math.ceil((max - min) / step / 200));
        every = Math.max(1, Math.round(every) || 1);
        const X = K.scale(x0, x1, min, max), n = Math.floor((max - min) / step + 1e-9);
        for (let i = 0; i <= n; i++) {
          const v = Math.round((min + i * step) * 1e9) / 1e9, x = X(v), M = i % every === 0;
          if (i > 0 && x < x1 - 0.5) g += K.line(x, y + dir * 1.5, x, y + dir * (M ? 9 : 5), M ? 'fg' : 'fa', { w: M ? W.major : W.tick });
          if (M) g += K.t(x, up ? y - 14 : y + 21, f(v), 'ky', i === 0 ? 'start' : 'middle', 0, { wt: W.wt });
        }
        return g;
      },
      /* box · a nameplate 40px tall on the box's centre; a one-line box is a chip */
      box(x, y, w, l1, l2, c2 = 'fg', s = 'ed') {
        return l2 ? K.nameplate(x, y - 4, l1, l2, ink(c2, s), w || 0) : K.chip(x, y + 9.5, l1, ink(c2, s), 11, w || 0);
      },
      boxWidth: (l1, l2 = '') => (l2 ? K.plateWidth(l1, l2) : K.chipWidth(l1)),
      /* plate · the headline result keeps its double rule: a nameplate inside a second frame */
      plate(x, y, w, l1, l2, c = 'fg') {
        const pw = Math.max(w || 0, K.plateWidth(l1, l2));
        return K.nameplate(x, y, l1, l2, c, pw) + K.rect(x - 3, y - 3, pw + 6, 46, 'none', c === 'lv' ? 'lv' : 'fg', { w: 1 });
      },
      plateWidth: (a, b) => Math.max(94, K.plateWidth(a, b)),
      leader: (pts, dot = true) => K.mitre(pts, 'fa', 2) + (dot ? K.rect(pts[0][0] - 2.5, pts[0][1] - 2.5, 5, 5, 'fg', 'none') : ''),
      /* dim · a 2px span with heavy end ticks and arrowheads, its length at 600 */
      dim(x1, x2, y, label, c = 'mu') {
        const m = (x1 + x2) / 2, lw = tw(label) + 10, wt = { wt: W.wt };
        const ends = K.line(x1, y - 5, x1, y + 5, 'fg', { w: 2 }) + K.line(x2, y - 5, x2, y + 5, 'fg', { w: 2 });
        if (lw + 16 > Math.abs(x2 - x1)) return ends + K.line(x1, y, x2, y, 'fa', { w: 2 }) + K.t(m, y - 8, label, c, 'middle', 0, wt);
        const heads = `M${n2(x1 + 1)} ${y}l7 -3.5v7zM${n2(x2 - 1)} ${y}l-7 -3.5v7z`;
        return ends + K.line(x1, y, m - lw / 2, y, 'fa', { w: 2 }) + K.line(m + lw / 2, y, x2, y, 'fa', { w: 2 })
          + `<path d="${heads}" style="fill:var(--faint);stroke:none"/>` + K.t(m, y + 4, label, c, 'middle', 0, wt);
      },
      /* node · 2px larger: solid done and fault, a 2px open square to do, the star on a panel halo */
      node(x, y, st = 'todo', size = 8) {
        const s = size + 2, h = s / 2;
        switch (st) {
          case 'live': return K.star(x, y, s * 0.85 + 3, 'pn') + K.star(x, y, s * 0.85);
          case 'done': return K.rect(x - h, y - h, s, s, 'fg', 'none');
          case 'fault': return K.rect(x - h, y - h, s, s, 'ft', 'none');
          case 'merge': return K.path(`M${x} ${y - 7}L${x + 7} ${y}L${x} ${y + 7}L${x - 7} ${y}Z`, 'fg', { w: 2.5, fill: 'pn' });
          case 'started': return K.rect(x - h, y - h, s, s, 'pn', 'none') + K.outline(x - h, y - h, s, s, 'fg', 2) + K.rect(x - 2, y - 2, 4, 4, 'fg', 'none');
          default: return K.rect(x - h, y - h, s, s, 'pn', 'none') + K.outline(x - h, y - h, s, s, 'fa', 2);
        }
      },
      /* cmd · the step number on an inverted chip */
      cmd(x, y, n, s, c = 'fg') {
        return K.rect(x, y - 10, 14, 14, 'fg', 'none') + K.t(x + 7, y + 1, n, 'pn', 'middle', 0, { wt: 700 }) + K.t(x + 20, y + 1, '$ ' + s, c, 'start', 0, { wt: W.wt });
      },
      brk: hbrk,
      /* L · a legend: names, keys and scale words at 600 */
      L: (x, y, s, c, a, ls) => K.t(x, y, s, c, a, ls, { wt: W.wt }),
      /* rh · how much further the strong ruler's numbers reach below it */
      rh: 5,
    };
  }

  /* fit · text cut with … to fit room px */
  function fit(s, room) {
    s = String(s ?? '');
    if (tw(s) <= room) return s;
    while (s.length > 1 && tw(s + '…') > room) s = s.slice(0, -1);
    return s + '…';
  }

  /* the merge replay, in ms: the branch draws in, then after a beat the details appear */
  const MERGE = { draw: 700, flash: 780 };
  /* the fan-out replay, in ms: branches grow out, then after a beat the children appear */
  const FANOUT = { draw: 450, flash: 530 };
  /* the loop replay, in ms: each done edge traces in turn, then after a beat the text appears */
  const LOOP = { edge: 260, beat: 80, step: 420 };
  /* the measured replay, in ms: used bar, projection, inset fill, then after a beat the boxes */
  const MEASURED = { top: 220, proj: 440, fill: 900, flash: 980 };
  /* the timeline replay, in ms: the line runs out through its steps, then after a beat the dimension and callout */
  const TIMELINE = { draw: 900, flash: 980 };
  /* timeline ruler ticks, in seconds, finest first */
  const TIMELINE_TICKS = [1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 10800, 21600, 43200, 86400];
  /* a tick in seconds as 45s, 25m, 2m30, 1h30, 10h */
  const tickLabel = (s) => {
    if (!s) return '0';
    if (s < 60) return s + 's';
    if (s < 3600) return s % 60 ? `${Math.floor(s / 60)}m${String(s % 60).padStart(2, '0')}` : s / 60 + 'm';
    const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60);
    return m ? `${h}h${String(m).padStart(2, '0')}` : h + 'h';
  };

  /* polyLen · length of a polyline; polyPart · its first d px as points (null when d ≤ 0) */
  const polyLen = (pts) => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  function polyPart(pts, d) {
    if (d <= 0) return null;
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (d >= l) { out.push(b); d -= l; continue; }
      out.push([a[0] + (b[0] - a[0]) * d / l, a[1] + (b[1] - a[1]) * d / l]);
      break;
    }
    return out;
  }

  /* cubicPart · the first share q (by length) of a cubic Bézier, as its new
     control points and end point. Splits at the parameter that covers q of
     the length (de Casteljau). */
  const N = 48;
  function cubicLens(p0, p1, p2, p3) {
    const at = (u) => [0, 1].map((k) => {
      const a = 1 - u;
      return a * a * a * p0[k] + 3 * a * a * u * p1[k] + 3 * a * u * u * p2[k] + u * u * u * p3[k];
    });
    const len = [0];
    let prev = p0;
    for (let i = 1; i <= N; i++) { const pt = at(i / N); len.push(len[i - 1] + Math.hypot(pt[0] - prev[0], pt[1] - prev[1])); prev = pt; }
    return len;
  }
  const cubicLen = (...p) => cubicLens(...p)[N];
  function cubicPart(p0, p1, p2, p3, q) {
    if (q >= 1) return [p1, p2, p3];
    const len = cubicLens(p0, p1, p2, p3);
    const goal = q * len[N];
    let i = 1;
    while (i < N && len[i] < goal) i++;
    const u = (i - 1 + (goal - len[i - 1]) / ((len[i] - len[i - 1]) || 1)) / N;
    const mix = (a, b) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    const a1 = mix(p0, p1), b1 = mix(p1, p2), c1 = mix(p2, p3), a2 = mix(a1, b1), b2 = mix(b1, c1), a3 = mix(a2, b2);
    return [a1, a2, a3].map((pt) => pt.map((v) => +v.toFixed(2)));
  }

  const recipes = {
    /* ── lanes · several runs on one time ruler
       { n, title, max, unit:'m', lanes:[{ name, end, label, live, box:[l1, l2] }] }
       Motion (see play): t is the time cursor and tt the trail, in ruler units.
       A lane's end node rides the cursor and its line follows the trail; the
       time counts up. When the cursor passes the end, the node, label, leader
       and box latch (marked data-land) and a live lane's dashed tail appears
       (marked data-crawl). Without t, the lanes are drawn finished. */
    lanes(o) {
      const warn = warner('lanes'), P = pen(o), S = P.S, W = K.W;
      const ls = Array.isArray(o.lanes) ? o.lanes : (warn('needs a lanes array'), []);
      const ends = ls.map((l) => Math.max(0, num(l.end)));
      let max = num(o.max);
      if (!(max > 0)) { max = Math.max(1, ...ends); warn('max should be above 0; using the longest lane'); }
      /* the name column fits the longest name, up to a third of the width (longer names are cut with …) */
      const w = o.w || 520, nameW = Math.min(Math.round(w / 3), Math.ceil(Math.max(0, ...ls.map((l) => tw(l.name ?? ''))) + 14));
      /* strong boxes are nameplates: the column widens to the widest */
      const boxW = Math.max(112, ...(S ? ls.filter((l) => l.box).map((l) => P.boxWidth(l.box[0], l.box[1])) : []));
      const x0 = o.labelW || Math.max(70, nameW), x1 = w - boxW - 30;
      const X = K.scale(x0, x1, 0, max), unit = o.unit ?? 'm', per = { s: 1, m: 60, h: 3600 }[unit];
      const T = o.t ?? Infinity, TT = o.tt ?? T;
      /* one lamp: the first live lane is lit, any other is drawn in ink */
      const lit = ls.findIndex((l) => l.live);
      if (ls.some((l, i) => l.live && i !== lit)) warn('more than one live lane; only the first is lit');
      /* strong: a 10px bar from a 3px start post, an end tick on a finished run, and the lit run a solid lamp bar with the star at its tip */
      const tick = (x, y) => K.line(x, y - 7, x, y + 7, 'fg', { w: W.major });
      let g = head(o);
      ls.forEach((l, i) => {
        const y = 58 + i * 46, live = i === lit, c = live ? 'lv' : 'fg', end = ends[i], land = T >= end;
        /* past max the line stops at the end of the ruler and breaks off in red; the label keeps the real value */
        const over = end > max;
        const xe = X(Math.min(T, end, max)), xt = X(Math.max(0, Math.min(TT, end, max)));
        g += P.L(x0 - 10, y + 4, fit(l.name ?? '', x0 - 12), 'fg', 'end');
        if (S) g += K.line(x0, y - 9, x0, y + 9, 'fg', { w: W.major });
        if (xt > x0) g += S ? K.rect(x0, y - 5, xt - x0, 10, live ? LAMP : 'fg', 'none') : K.line(x0, y, xt, y, c, { w: 2 });
        if (over && land) g += P.brk(x1 + 9, y);
        if (live && land && xe < x1 - 1) g += K.line(xe, y, x1, y, 'fa', S ? { w: 2, dash: '3 3' } : { dash: '2 4' }).replace('<line', '<line data-crawl');
        /* the moving node is drawn under the start node, so at 0 only the start shows */
        if (!land) g += S && !live ? tick(xe, y) : P.node(xe, y, live ? 'live' : 'todo');
        if (!S) g += K.node(x0, y, 'done');
        const lab = land || !per ? (l.label ?? (per ? fmt.dur(end * per) : end + unit)) : fmt.dur(Math.min(T, end) * per);
        let k = '';
        if (land) k += S && !live ? tick(xe, y) : P.node(xe, y, live ? 'live' : 'done');
        if (xe - x0 > 1) k += P.dim(x0, xe, y - (S ? 17 : 14), lab, live ? 'fg' : 'mu');
        if (l.box && land) {
          k += P.box(w - boxW - 10, y - 16, boxW, l.box[0], l.box[1], live ? 'lv' : 'fg', live ? 'lv' : 'ed');
          if (!live && !over) k += K.line(xe + (S ? 9 : 6), y, w - boxW - 10, y, S ? 'fa' : 'e1', { dash: '1 3' });
        }
        g += land ? `<g data-land="${i}">${k}</g>` : k;
      });
      const ry = 58 + ls.length * 46 - 16;
      const step = o.step || Math.max(1, Math.round(max / 10));
      g += P.ruler(x0, x1, ry, max, step, o.every || 5, (v) => v + unit);
      const said1 = (l, i) => `${l.name} ${i === lit ? 'running at' : 'took'} ${l.label ?? (per ? fmt.dur(ends[i] * per) : ends[i] + unit)}${ends[i] > max ? `, past the ${max}${unit} scale` : ''}`;
      const label = o.label || `${o.title || 'Lanes'}: ` + (ls.length ? ls.map(said1).join('; ') : 'no lanes');
      return warn.done({ w, h: ry + 26 + P.rh, markup: g, label });
    },

    /* ── budget · a limit ruler with alerts, today's use and the pace to the end
       { n, title, max, used, at:'16:20', pace, alerts:[{ v, label }], unit:'k',
         usedLabel, paceLabel:[l1, l2], fmt } */
    budget(o) {
      const warn = warner('budget'), P = pen(o), S = P.S, W = K.W;
      const w = o.w || 520, x0 = 16, x1 = w - 20, y = 92, f = o.fmt || ((v) => v + (o.unit ?? ''));
      const used = Math.max(0, num(o.used));
      if (!Number.isFinite(+o.used) || o.used === null) warn('used is missing; drawn as 0');
      const pace = o.pace != null && Number.isFinite(+o.pace) ? +o.pace : null;
      const alerts = (o.alerts || []).filter((a) => a && Number.isFinite(+a.v));
      let max = num(o.max);
      if (!(max > 0)) { max = Math.max(1, used, pace ?? 0); warn('max should be above 0; using the larger of used and pace'); }
      const X = K.scale(x0, x1, 0, max);
      /* past the limit the bar stops at the end of the ruler and breaks off in red */
      const Xc = (v) => X(Math.min(v, max));
      /* motion (see play): the cursor t fills the used amount, then runs on
         along the pace line. Used and pace latch as it reaches them, and an
         alert latches as it is crossed (all marked data-land). */
      const T = o.t ?? Infinity, TT = o.tt ?? T;
      const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
      let g = head(o);
      const first = alerts.length ? Math.min(+alerts[0].v, max) : null;
      /* strong: a 12px recessed track, hazard stripes past the first alert, the used fill in ink (red past the alert) and a 4px needle */
      const bh = S ? 12 : 8;
      if (S) g += K.rect(x0, y - 6, x1 - x0, 12, 'well', 'none');
      if (first != null && first < max) {
        const H = S ? K.hazard() : K.hatch('ft', 4, 0.45);
        g += H.def + `<rect x="${X(first)}" y="${y - bh / 2}" width="${X(max) - X(first)}" height="${bh}" fill="${H.url}"/>`;
      }
      const xt = Xc(clamp(TT, 0, used));
      if (xt > x0) {
        if (!S) g += K.rect(x0, y - 2, xt - x0, 4, 'fg', 'none');
        else {
          const xa = first != null ? Math.min(xt, X(first)) : xt;
          g += K.rect(x0, y - 6, xa - x0, 12, 'fg', 'none') + (xt > xa ? K.rect(xa, y - 6, xt - xa, 12, 'ft', 'none') : '');
        }
      }
      if (pace != null && TT > used && used < max) g += K.line(Xc(used), y, Xc(clamp(TT, used, pace)), y, 'lv', S ? { w: 3, dash: '5 3' } : { dash: '4 3' });
      if (S) g += K.outline(x0, y - 6, x1 - x0, 12, 'ed', W.rule);
      g += P.ruler(x0, x1, y + (S ? 8 : 6), max, o.step || niceStep(max), o.every || 5, (v) => (v ? f(v) : '0'));
      alerts.forEach((a, i) => {
        const end = i === 0 && alerts.length > 1, ax = Xc(+a.v);
        const m = K.line(ax, y - 36, ax, y + (S ? 6 : 4), 'ft', S ? { w: W.major } : { opacity: 0.7 }) + P.L(ax + (end ? -5 : 5), y - 28, a.label ?? f(a.v), 'ft', end ? 'end' : 'start');
        g += T >= a.v ? `<g data-land="alert${i}">${m}</g>` : m;
      });
      const needle = (x, c = 'fg') => K.rect(x - 2, y - 10, 4, 20, c, 'none');
      /* a box sits left of its leader, or flips to the right when it would leave the frame */
      const boxAt = (x, bw, dx) => (x - dx - bw >= 2 ? [x - dx, x - dx - bw] : [x + dx, x + dx]);
      if (T < used) g += S ? needle(Xc(clamp(T, 0, used))) : K.node(Xc(clamp(T, 0, used)), y, 'todo');
      else {
        const over = used > max, ux = Xc(used);
        const ul = [o.usedLabel || 'used' + (o.at ? ' · ' + o.at : ''), over ? `${f(used)} · over by ${f(used - max)}` : f(used)];
        const uw = P.boxWidth(...ul), [lx, bx] = boxAt(ux, uw, 10);
        g += `<g data-land="used">` + (S ? needle(ux) : K.node(ux, y, 'done')) + (over ? P.brk(x1 + 9, y) : '')
          + P.leader([[ux, y - (S ? 10 : 6)], [ux, y - 42], [lx, y - 42]], false) + P.box(bx, y - 60, uw, ul[0], ul[1], over ? 'ft' : 'fg', over ? 'ft' : 'ed') + '</g>';
      }
      /* the pace mark: a hollow circle, or at strong weight a hollow needle */
      const paceMark = (x) => (S ? K.rect(x - 3, y - 10, 6, 20, 'pn', 'none') + K.outline(x - 3, y - 10, 6, 20, 'fg', 2) : K.circle(x, y, 3, 'pn', 'fg'));
      /* the strong ruler's numbers reach lower, so the pace box drops below them */
      const py = S ? y + 38 : y + 30;
      if (pace != null && used < max) {
        if (T > used && T < pace) g += paceMark(Xc(T));
        else if (T >= pace && pace > used) {
          const pl = o.paceLabel || ['at this pace', '≈ ' + f(pace)];
          const pw = P.boxWidth(...pl), px = Xc(pace), [lx, bx] = boxAt(px, pw, 40);
          g += `<g data-land="pace">` + paceMark(px) + (pace > max ? P.brk(x1 + 9, y) : '')
            + P.leader([[px, y + (S ? 10 : 4)], [px, py + 14], [lx, py + 14]], false) + P.box(bx, py, pw, pl[0], pl[1], 'lv', 'lv') + '</g>';
        }
      }
      const label = o.label || `${o.title || 'Budget'}: limit ${f(max)}.`
        + (alerts.length ? ` Alerts at ${alerts.map((a) => f(+a.v) + (a.label ? ` (${a.label})` : '')).join(', ')}.` : '')
        + ` Used ${f(used)}${o.at ? ' by ' + o.at : ''}${used > max ? `, over by ${f(used - max)}` : ''}.`
        + (pace != null && used < max ? ` At this pace about ${f(pace)}${pace > max ? `, over by ${f(pace - max)}` : ''}.` : '');
      return warn.done({ w, h: S ? 180 : 170, markup: g, label });
    },

    /* ── merge · a branch, its commits and the commands at each node (FIG.11)
       { n, title, base:'main', branch, commits:5, baseAhead:1, files:[l1,l2],
         verdict:[l1,l2], noun:'commits', steps:['git switch main', 'git merge --no-ff …', 'git worktree remove …'] } */
    merge(o) {
      const warn = warner('merge'), P = pen(o), S = P.S, lw = S ? 3 : 1.3;
      const h = 250, by = 170, fy = 70, steps = o.steps || [];
      const commits = Math.max(0, Math.round(num(o.commits)));
      if (!commits) warn('commits should be 1 or more');
      const branch = o.branch ?? (warn('branch is missing'), 'branch');
      const noun = (k) => o.noun || (k === 1 ? 'commit' : 'commits');
      /* up to 12 commits each get a node; more draw the first 5 and the last 5 with a break between */
      const n = Math.max(1, commits), cx0 = 130, cx1 = 330, many = n > 12;
      const slots = many ? 11 : n, cs = slots > 1 ? (cx1 - cx0) / (slots - 1) : 0;
      const cxs = many ? [0, 1, 2, 3, 4, 6, 7, 8, 9, 10].map((s) => cx0 + s * cs) : Array.from({ length: n }, (_, i) => (n > 1 ? cx0 + i * cs : cx1));
      const ff = !o.baseAhead;
      const v = o.verdict || (ff ? ['fast-forward', 'no merge commit'] : ['merge commit', `${o.base || 'main'} moved on`]);
      /* the verdict box keeps inside the frame however long its words are; a strong nameplate widens the frame instead, clear of the merge curve */
      const vw = Math.max(102, P.boxWidth(v[0], v[1])), w = S ? Math.max(520, Math.ceil(411 + vw)) : 520, vx = Math.min(410, w - vw - 1), xe = w - 50;
      /* motion (see play): t is ms on the MERGE timeline. The straight main
         line and its nodes and text hold still. The branch draws as one stroke
         along its length: up out of main, along its commits (each appearing as
         the stroke reaches it), then the dashed merge back into main. Then the
         branch name, boxes, dimension and commands appear at once (data-land). */
      const T = o.t ?? Infinity, M = MERGE;
      const fork = [[60, by], [60, fy], [80, fy], [110, fy]], join = [[cx1, fy], [380, fy], [390, by], [400, by]];
      const L1 = cubicLen(...fork), L2 = cx1 - 110, L3 = cubicLen(...join);
      const d = T >= M.draw ? Infinity : (L1 + L2 + L3) * Math.max(0, T) / M.draw;
      const curve = (p, q, c, o2) => { const [a, b2, e] = cubicPart(...p, q); return K.path(`M${p[0].join(' ')} C ${a.join(' ')}, ${b2.join(' ')}, ${e.join(' ')}`, c, o2); };
      let g = head(o);
      g += K.line(20, by, xe, by, 'fg', { w: lw }) + K.line(406, by, xe, by, 'fa', S ? { w: 2, dash: '3 3' } : { dash: '2 3' });
      if (d >= L1 + L2) g += K.path(`M60 ${by} C 60 ${fy}, 80 ${fy}, 110 ${fy} L ${cx1} ${fy}`, 'fg', { w: lw });
      else if (d > L1) g += K.path(`M60 ${by} C 60 ${fy}, 80 ${fy}, 110 ${fy} L ${(110 + d - L1).toFixed(2)} ${fy}`, 'fg', { w: lw });
      else if (d > 0) g += curve(fork, d / L1, 'fg', { w: lw });
      if (d > L1 + L2) g += curve(join, Math.min(1, (d - L1 - L2) / L3), 'lv', S ? { w: 3, dash: '6 4' } : { dash: '4 3' });
      /* main's own marks hold still; the commits appear as the branch reaches them */
      g += P.L(20, by - (S ? 10 : 8), o.base || 'main', 'fg') + P.node(60, by, 'done');
      if (!ff) g += P.node(250, by, 'done') + P.L(250, by - (S ? 12 : 10), `+${o.baseAhead} since branch`, 'ky', 'middle');
      /* one lamp, the merge to come: its dashed curve and the verdict box. The merge node and the commands are ink. */
      if (S) g += ff ? K.rect(395, by - 5, 10, 10, 'pn', 'none') + K.outline(395, by - 5, 10, 10, 'fg', 2.5) : P.node(400, by, 'merge');
      else g += ff ? K.rect(396, by - 4, 8, 8, 'pn', 'fg', { w: 1.3 }) : K.path(`M400 ${by - 6}L406 ${by}L400 ${by + 6}L394 ${by}Z`, 'fg', { w: 1.3, fill: 'pn' });
      cxs.forEach((x) => { if (d >= L1 + x - 110) g += P.node(x, fy, 'done'); });
      /* the break: the branch line cut by two strokes between the first and last commits */
      if (many && d >= L1 + cx0 + 5 * cs - 110) {
        const bx = cx0 + 5 * cs;
        g += K.rect(bx - 6, fy - 3, 12, 6, 'pn', 'none') + K.line(bx - 5, fy + 5, bx - 1, fy - 5, 'fg', { w: S ? 2 : 1 }) + K.line(bx + 1, fy + 5, bx + 5, fy - 5, 'fg', { w: S ? 2 : 1 });
      }
      const label = o.label || `Merge plan. ${branch} has ${commits} ${noun(commits)}. ${o.base || 'main'} ${ff ? 'has not moved, so this is a fast-forward' : `moved on by ${o.baseAhead}, so this is a merge commit`}.${steps.some(Boolean) ? ` Steps: ${steps.filter(Boolean).map((s, i) => `${i + 1} ${s}`).join(', ')}.` : ''}`;
      if (T < M.flash) return warn.done({ w, h, markup: g, label });
      /* steps keep their slot (1 under the base, 2 at the merge, 3 at the tip)
         but are numbered in run order, so an empty slot doesn't leave a gap */
      const no = (i) => String(steps.slice(0, i + 1).filter(Boolean).length);
      /* a command keeps inside the frame: it slides left of its node (its leader
         elbows over to the number box) and, past the full width, is cut with … */
      const room = w - 4 - 20 - tw('$ ');
      const cmd = (s) => { const t = fit(s, room); if (t !== String(s)) warn('a command is too long for the frame; cut with …'); return t; };
      const place = (x, s) => Math.max(2, Math.min(x - 7, w - 2 - 20 - tw('$ ' + s)));
      const lead = (x, y0, y1, bx, ye) => P.leader(bx + 7 === x ? [[x, y0], [x, ye]] : [[x, y0], [x, y1], [bx + 7, y1], [bx + 7, ye]], false);
      let k = '';
      if (n > 1) k += P.dim(cx0, cx1, fy + 22, `${commits} ${noun(commits)}`);
      if (o.files) k += P.leader([[230, fy + (S ? 28 : 26)], [230, S ? 100 : 104]], false) + P.box(180, 104, 100, o.files[0], o.files[1], 'fg');
      k += P.leader([[400, by - 7], [400, S ? 134 : 140], [vx, S ? 134 : 140]], false) + P.box(vx, S ? 118 : 124, vw, v[0], v[1], 'lv', 'lv');
      if (steps[0]) { const s = cmd(steps[0]), bx = place(250, s); k += lead(250, by + 6, 198, bx, 200) + P.cmd(bx, 212, no(0), s); }
      if (steps[1]) { const s = cmd(steps[1]), bx = place(400, s); k += lead(400, by + 7, 221, bx, 226) + P.cmd(bx, 238, no(1), s); }
      if (steps[2]) { const s = cmd(steps[2]), bx = place(cx1, s); k += lead(cx1, fy - 6, 50, bx, 46) + P.cmd(bx, 40, no(2), s); }
      /* the branch name goes over step 3's leader, on a panel-coloured ground, so a long name breaks the leader instead of being cut by it */
      k += K.rect(108, fy - 22, tw(branch) + 4, 14, 'pn', 'none') + P.L(110, fy - 12, branch, 'fg');
      g += `<g data-land="details">${k}</g>`;
      return warn.done({ w, h, markup: g, label });
    },

    /* ── fanout · one parent with live, queued and finished children (FIG.13)
       { n, title, root:[l1, l2], children:[{ task, meta, time, state }], folded:'+1 done earlier' }
       state is 'todo' (queued), 'done', 'live' or 'fault'; live: true still
       means 'live', and a child with neither is done. One lamp: the first live
       child is the star; any other live child is drawn running, in ink. */
    fanout(o) {
      const warn = warner('fanout'), P = pen(o), S = P.S, W = K.W;
      const w = o.w || 520, kids = Array.isArray(o.children) ? o.children : (warn('needs a children array'), []), gap = 52, top = 44;
      const rootL = Array.isArray(o.root) ? o.root : [o.root ?? 'parent'];
      const STATES = ['todo', 'done', 'live', 'fault'];
      let lit = -1;
      const states = kids.map((s, i) => {
        let st = s.state ?? (s.live ? 'live' : 'done');
        if (!STATES.includes(st)) { warn(`unknown state '${st}'; drawn as todo`); st = 'todo'; }
        if (st === 'live') { if (lit < 0) lit = i; else { warn('more than one live child; only the first is lit'); st = 'running'; } }
        return st;
      });
      const WORD = { todo: 'queued', done: 'done', live: 'running', running: 'running', fault: 'failed' };
      const h = Math.max(220, top + kids.length * gap + (o.folded ? 36 : 10));
      const oy = top + ((kids.length - 1) * gap) / 2 + 10, ox = 112;
      /* motion (see play): t is ms on the FANOUT timeline. The parent holds
         still. Its branches grow out together at one speed, each child's node
         appearing as its branch reaches it. Then the child boxes, their text and
         the folded note appear at once (data-land). */
      const T = o.t ?? Infinity, M = FANOUT;
      const fy = top + kids.length * gap + 6;
      const routes = kids.map((s, i) => ({ pts: [[ox + 8, oy], [160, oy], [176, top + i * gap + 10], [200, top + i * gap + 10]], from: 0 }));
      if (o.folded) routes.push({ pts: [[160, oy], [176, fy], [200, fy]], from: 160 - (ox + 8) });
      const far = Math.max(...routes.map((r) => r.from + polyLen(r.pts)));
      const d = T >= M.draw ? Infinity : far * Math.max(0, T) / M.draw;
      const grow = (r) => polyPart(r.pts, d - r.from);
      let g = head(o);
      /* strong: the parent is a nameplate, its name on the inverted strip */
      if (S) {
        const nm = String(rootL[0]).toUpperCase();
        g += K.rect(8, oy - 22, 96, 44, 'pn', 'none') + K.rect(8, oy - 22, 96, 16, 'fg', 'none') + K.outline(8, oy - 22, 96, 44, 'fg', W.plate)
          + K.t(15, oy - 10.5, fit(nm, 82 - 0.6 * nm.length), 'pn', 'start', 0.6, { fs: 10, wt: W.wt }) + K.t(15, oy + 12, fit(rootL[1] || '', 82), 'fg', 'start', 0, { wt: 700 });
      } else g += K.rect(8, oy - 22, 96, 44, 'pn', 'fg') + K.t(16, oy - 6, fit(rootL[0], 84), 'fg') + K.t(16, oy + 8, fit(rootL[1] || '', 84), 'ky');
      /* the parent is running (▣) while any child runs, done when all are, failed when one failed, else waiting (□) */
      const running = states.some((s) => s === 'live' || s === 'running');
      g += P.node(ox, oy, running ? 'started' : states.every((s) => s === 'done') ? 'done' : states.includes('fault') ? 'fault' : 'todo');
      let k = '';
      kids.forEach((s, i) => {
        const y = top + i * gap, nx = 200, st = states[i], on = st === 'live' || st === 'running', r = routes[i], pts = grow(r);
        /* a running branch is ink, a queued one dashed (not reached yet), a finished one faint, a failed one red */
        if (pts) g += K.path('M' + pts.map((p) => p.map((v) => +v.toFixed(2)).join(' ')).join(' L'), on ? 'fg' : st === 'fault' ? 'ft' : 'fa', S ? (st === 'todo' ? { w: 2, dash: '3 3' } : { w: on ? W.major : 2 }) : st === 'todo' ? { dash: '2 3' } : {});
        if (d >= polyLen(r.pts)) g += P.node(nx, y + 10, st === 'running' ? 'started' : st);
        const time = String(s.time ?? ''), room = w - 18 - 220;
        /* strong: a 2px outline, the lit child's in the lamp; task and time heavier */
        if (S) k += K.rect(212, y - 6, w - 222, 32, 'pn', 'none') + K.outline(212, y - 6, w - 222, 32, st === 'live' ? 'lv' : on ? 'fg' : st === 'fault' ? 'ft' : 'ed', st === 'live' ? W.lamp : on || st === 'fault' ? 2 : W.rule);
        else k += K.rect(212, y - 6, w - 222, 32, 'pn', on ? 'ed' : st === 'fault' ? 'ft' : 'e1');
        k += K.t(220, y + 7, fit(s.task ?? '', room), on ? 'fg' : 'mu', 'start', 0, S ? { wt: on ? 700 : W.wt } : {})
          + K.t(220, y + 20, fit(s.meta || '', room - (time ? tw(time) + 10 : 0)), 'ky')
          + K.t(w - 18, y + 20, time, st === 'live' ? 'lv' : st === 'fault' ? 'ft' : 'ky', 'end', 0, S ? { wt: 700 } : {});
      });
      if (o.folded) {
        const pts = grow(routes[kids.length]);
        if (pts) g += K.path('M' + pts.map((p) => p.map((v) => +v.toFixed(2)).join(' ')).join(' L'), S ? 'fa' : 'e1', S ? { w: 2, dash: '3 3' } : { dash: '2 3' });
        k += P.L(212, fy + 4, o.folded, 'ky');
      }
      if (T >= M.flash) g += `<g data-land="children">${k}</g>`;
      const label = o.label || `${rootL[0]} with ${kids.length} ${kids.length === 1 ? 'child' : 'children'}: `
        + (kids.length ? kids.map((c, i) => `${c.task}, ${WORD[states[i]]}${c.time ? ` (${c.time})` : ''}`).join('; ') : 'none') + (o.folded ? `; ${o.folded}` : '');
      return warn.done({ w, h, markup: g, label });
    },

    /* ── loop · stations on a cycle, the live one lit by the lamp
       { n, title, center:'train 4 of 9', stations:[{ name, cmd, state:'done'|'live'|'todo'|'fault' }] }
       Or step through it: give at (the live station's index) instead of states,
       lap and laps, and center as a function of the lap: (lap) => `train ${lap} of 9`.
       recipes.loop.step(data, ±1) returns the next data, to play() as a step. */
    loop(o) {
      const warn = warner('loop'), Pn = pen(o), S = Pn.S, W = K.W;
      const st = Array.isArray(o.stations) ? o.stations : (warn('needs a stations array'), []), N = st.length;
      /* the ring grows past 8 stations so their labels keep apart */
      const r0 = S ? 78 : 70, R = N > 8 ? Math.round(r0 * N / 8) : r0, cy = R + (S ? 74 : 68);   /* at strong weight the centre chip needs a little more room */
      const statesAt = (at) => st.map((s, i) => (at == null ? s.state || 'todo' : i < at && !s.skip ? 'done' : i === at ? 'live' : 'todo'));
      if (o.at == null && st.filter((s) => s.state === 'live').length > 1) warn('more than one live station');
      /* labels sit outside the ring: widen the frame (and move the centre) until the widest fits */
      const ang = (i) => -Math.PI / 2 + i * 2 * Math.PI / N;
      const sideOf = (a) => (Math.abs(Math.cos(a)) < 0.3 ? 0 : Math.cos(a) > 0 ? 1 : -1);
      const textW = (s, i) => Math.max(tw(`✓ ${i + 1} · ` + String(s.name).toUpperCase()) + 0.5 * String(s.name).length + 3, s.cmd ? tw('$ ' + s.cmd) : 0);
      let left = 0, right = 0;
      st.forEach((s, i) => {
        const a = ang(i), sd = sideOf(a), dx = R * Math.cos(a), tW = textW(s, i), gap = S ? 24 : 16;
        if (sd === 1) right = Math.max(right, dx + gap + tW);
        else if (sd === -1) left = Math.max(left, -dx + gap + tW);
        else { right = Math.max(right, dx + tW / 2); left = Math.max(left, -dx + tW / 2); }
      });
      const w0 = o.w || 420, half = Math.max(w0 / 2, R * 1.2 + 4);
      const padL = Math.max(0, left + 4 - half), padR = Math.max(0, right + 4 - half);
      const w = Math.ceil(w0 + padL + padR + Math.max(0, 2 * half - w0)), cx = half + padL;
      const h = o.h || Math.max(250, cy + R + (S ? 48 : 42));
      const P = st.map((_, i) => { const a = ang(i); return [cx + R * Math.cos(a), cy + R * Math.sin(a), a]; });
      const centre = (lap) => (typeof o.center === 'function' ? o.center(lap) : o.center);
      /* strong is a schematic: 3px mitred lines (faint to come, ink once run), a solid drafting head arriving at each
         station, the step number on a 20px chip at each station (lamp outline for the live one), the reading on a chip */
      const EW = S ? W.base : 1.4, run = new Set();   /* run: the edges drawn whole, whose heads turn to ink */
      const edge = (i, f, c = 'fg') => {
        const q = P[(i + 1) % N];
        if (f >= 1) run.add(i);
        return K.line(P[i][0], P[i][1], P[i][0] + (q[0] - P[i][0]) * f, P[i][1] + (q[1] - P[i][1]) * f, c, { w: EW });
      };
      /* motion (see play): t is ms. The frame holds still.
         Entry: the station nodes hold still; the done edges trace clockwise one
         after another (LOOP.edge ms each), then the names, commands and centre
         label appear at once (data-land).
         Step (from is set): one edge traces forward, or retracts going back, with
         the star riding its tip (LOOP.step ms). Then the labels that changed,
         and the centre label on a new lap, blink (data-land). Going forward past
         the last station closes the lap; the loop then clears for the next one. */
      const T = o.t ?? Infinity, stepping = o.from != null, moving = stepping && T < LOOP.step;
      let states = statesAt(o.at), tip = null, textStates = states, lap = o.lap;
      let g = head(o);
      const ring = `M${P.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' L')} Z`;
      g += S ? `<path d="${ring}" stroke-width="${EW}" stroke-linejoin="miter" style="fill:none;stroke:var(--faint)"/>`
        : K.circle(cx, cy, R * 1.2, 'none', 'e1') + K.path(ring, 'ed');
      if (moving) {
        const fwd = o.dir > 0, wrap = fwd ? o.from === N - 1 : o.from === 0, e = fwd ? o.from : o.at;
        const q = Math.max(0, T) / LOOP.step, f = fwd ? 1 - Math.pow(1 - q, 3) : Math.pow(1 - q, 3);
        states = statesAt(fwd && wrap ? o.from : o.at);
        states[o.from] = fwd ? 'done' : statesAt(o.at)[o.from];
        if (!(fwd && wrap)) states[o.at] = fwd ? 'todo' : 'done';   /* closing a lap: the first station keeps its edge until the lap clears */
        states.forEach((s, i) => { if (s === 'done' && i !== e) g += edge(i, 1); });
        g += edge(e, f);
        const nx = P[(e + 1) % N];
        tip = [P[e][0] + (nx[0] - P[e][0]) * f, P[e][1] + (nx[1] - P[e][1]) * f];
        textStates = statesAt(o.from); lap = o.lapFrom;
      } else if (stepping) {
        states.forEach((s, i) => { if (s === 'done') g += edge(i, 1); });
      } else {
        const done = states.map((s, i) => i).filter((i) => states[i] === 'done');
        done.forEach((i, j) => {
          const f = T >= Infinity ? 1 : Math.min(1, Math.max(0, (T - j * LOOP.edge) / LOOP.edge));
          if (f > 0) g += edge(i, f);
        });
      }
      /* the centre lines stop just past the ring, short of the station labels; at strong weight, short of the station chips */
      const cr = S ? R - 16 : R * 1.05;
      g += K.centre(cx - cr, cy, cx + cr, cy, 'fa') + K.centre(cx, cy - cr, cx, cy + cr, 'fa') + (S ? '' : K.cross(cx, cy, 4, 'fa'));
      /* direction: an open arrowhead mid-edge, so the reader sees which way the cycle runs; at strong weight a solid
         drafting head (8px by 9px) arriving at the next station's chip, in its edge's ink */
      P.forEach((p, i) => {
        const q = P[(i + 1) % N], an = Math.atan2(q[1] - p[1], q[0] - p[0]);
        if (S) {
          const c = Math.cos(an), sn = Math.sin(an), tx = q[0] - c * 15, ty = q[1] - sn * 15;
          const b = (o) => `${n2(tx - c * 8 - sn * o)} ${n2(ty - sn * 8 + c * o)}`;
          g += `<path d="M${n2(tx)} ${n2(ty)}L${b(4.5)}L${b(-4.5)}Z" style="fill:var(${run.has(i) ? '--fg' : '--faint'});stroke:none"/>`;
          return;
        }
        const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
        const wing = (d) => `${(mx + 5 * Math.cos(an + d)).toFixed(2)} ${(my + 5 * Math.sin(an + d)).toFixed(2)}`;
        g += K.path(`M${wing(Math.PI * 0.8)} L${mx.toFixed(2)} ${my.toFixed(2)} L${wing(-Math.PI * 0.8)}`, 'mu', { w: 1.2 });
      });
      const ns = 9;
      /* the strong station: its step number on a 20px chip, inverted once done, red on a fault, the lamp outline when live */
      const chipAt = (x, y, n, sn) => {
        const r = K.rect(x - 10, y - 10, 20, 20, sn === 'done' ? 'fg' : sn === 'fault' ? 'ft' : 'pn', 'none');
        if (sn === 'done' || sn === 'fault') return r + K.t(x, y + 4, n, 'pn', 'middle', 0, { wt: 700 });
        return r + K.outline(x - 10, y - 10, 20, 20, sn === 'live' ? 'lv' : 'fa', sn === 'live' ? W.lamp : W.plate) + K.t(x, y + 4, n, sn === 'live' ? 'lv' : 'mu', 'middle', 0, { wt: 700 });
      };
      const changed = (i) => stepping && !moving && (i === o.from || i === o.at);
      const c0 = centre(lap);
      /* the centre label sits on a panel-coloured ground, so the vertical centre line breaks behind it; at strong weight it is a reading on an inverted chip */
      const ck = !c0 ? '' : S ? K.chip(cx - K.chipWidth(c0) / 2, cy, c0, 'fg')
        : K.rect(cx - tw(c0) / 2 - 3, cy + 14, tw(c0) + 6, 14, 'pn', 'none') + K.t(cx, cy + 24, c0, 'mu', 'middle');
      let k = stepping && !moving && o.lap !== o.lapFrom ? `<g data-land="centre">${ck}</g>` : ck;
      st.forEach((s, i) => {
        const [x, y, a] = P[i], cos = Math.cos(a), sin = Math.sin(a), sn = states[i];
        /* done: a solid square and a green ✓ name; todo: a hollow square and a muted name */
        if (S) g += chipAt(x, y, String(i + 1), sn === 'live' && tip ? 'todo' : sn);
        else if (sn === 'live' && !tip) g += K.node(x, y, 'live', ns);
        else g += K.node(x, y, sn === 'done' || sn === 'fault' ? sn : 'todo', ns);
        const side = Math.abs(cos) < 0.3 ? 0 : cos > 0 ? 1 : -1;
        const off = S ? 22 : 16;
        const tx = side === 1 ? x + off : side === -1 ? x - off : x;
        const ty = side === 0 ? (sin < 0 ? y - (S ? 30 : 26) : y + (S ? 29 : 22)) : y - 4;
        const an = side === 1 ? 'start' : side === -1 ? 'end' : 'middle';
        const ts = textStates[i], live = ts === 'live', done = ts === 'done', fault = ts === 'fault';
        let m = Pn.L(tx, ty, (done ? '\u2713 ' : '') + (S ? '' : `${i + 1} \u00b7 `) + String(s.name).toUpperCase(), live ? 'lv' : done ? 'ok' : fault ? 'ft' : 'mu', an, 0.5);
        if (s.cmd) m += K.t(tx, ty + 13, (live ? '$ ' : '') + s.cmd, live ? 'fg' : 'ky', an);
        k += changed(i) ? `<g data-land="st${i}">${m}</g>` : m;
      });
      if (tip) g += S ? K.star(tip[0], tip[1], 13, 'pn') + K.star(tip[0], tip[1], 10) : K.node(tip[0], tip[1], 'live', ns);   /* strong: the star rides the tip, on a panel halo */
      if (stepping || T >= recipes.loop.duration(o)) g += stepping ? k : `<g data-land="text">${k}</g>`;
      const fin = statesAt(o.at), c1 = centre(o.lap);
      const WORD = { done: 'done', live: 'live', fault: 'halted', todo: 'to do' };
      const label = o.label || `${o.title || 'Loop'}: ` + (N ? st.map((s, i) => `${i + 1} ${s.name} ${WORD[fin[i]] || 'to do'}${s.cmd ? ` (${s.cmd})` : ''}`).join(', ') : 'no stations') + (c1 ? `. ${c1}` : '');
      return warn.done({ w, h, markup: g, label });
    },

    /* ── measured · a long ruler, a magnified inset of the used part, boxed parts (FIG.06)
       { title, max, zoomMax, factor, parts:[{ label, value, ink }], plate:[l1, l2], fmt } */
    measured(o) {
      const warn = warner('measured'), P = pen(o), S = P.S, W = K.W;
      const f = o.fmt || C.fmt.k;
      const parts = (Array.isArray(o.parts) ? o.parts : (warn('needs a parts array'), [])).map((p) => ({ ...p, value: Math.max(0, num(p.value)) }));
      const used = parts.reduce((a, p) => a + p.value, 0);
      let max = num(o.max), zoomMax = num(o.zoomMax);
      if (!(max > 0)) { max = Math.max(1, used); warn('max should be above 0; using the sum of the parts'); }
      if (!(zoomMax > 0)) { zoomMax = Math.max(used, max / 20); warn('zoomMax should be above 0'); }
      if (used > zoomMax) warn('the parts add up past zoomMax; the inset breaks off at its end');
      const pw = o.plate ? P.plateWidth(o.plate[0], o.plate[1]) : 0;
      /* the frame widens when the row of boxes and the plate wouldn't fit beside each other */
      const widest = parts.map((p, i) => Math.max(P.boxWidth(p.label, '≈ ' + f(p.value)), o.prev ? P.boxWidth(p.label, '≈ ' + f(o.prev[i] ?? 0)) : 0));
      const row = widest.reduce((a, b) => a + b, 0) + 10 * Math.max(0, parts.length - 1);
      const w = Math.ceil(Math.max(o.w || 460, 18 + row + (o.plate ? pw + 18 : 4))), h = 176;
      const x0 = 18, x1 = w - 20, y = 46, X = K.scale(x0, x1, 0, max);
      /* motion (see play): t is ms on the MEASURED timeline. The rulers, the
         inset frame and its scale hold still. The used bar fills on the long
         ruler, the dashed projection drops to the inset, and the inset fills
         left to right through the parts; as the fill passes a part, its dot
         appears and its leader and box flash in (data-land). Then the detail
         label and plate appear (data-land). */
      /* Change (prev is set, the old parts' values): the figure is whole; the
         used bar, the inset fills, the dots and leaders glide from the old
         values to the new ones (ease-out cubic, 220ms + 480ms × the largest
         change as a share of the inset), the box values count, and the boxes
         that changed blink on landing. */
      const T = o.t ?? Infinity, M = MEASURED, changing = !!o.prev;
      const ramp = (a, b) => (T >= b ? 1 : T <= a ? 0 : (T - a) / (b - a));
      const cms = changing ? recipes.measured.duration(o) : 0, cq = changing ? 1 - Math.pow(1 - Math.min(1, Math.max(0, T) / cms), 3) : 1;
      const vals = parts.map((p, i) => (changing ? (o.prev[i] ?? 0) + (p.value - (o.prev[i] ?? 0)) * cq : p.value));
      const now = vals.reduce((a, v) => a + v, 0);
      const qTop = changing ? 1 : 1 - Math.pow(1 - ramp(0, M.top), 3), qProj = changing ? 1 : ramp(M.top, M.proj);
      const fill = changing ? now : used * ramp(M.proj, M.fill);
      /* numbered like every figure when n is given; otherwise the title alone */
      let g = o.n != null ? head(o) : o.title ? K.t(12, 18, String(o.title).toUpperCase(), 'mu', 'start', 0.5) : '';
      g += P.ruler(x0, x1, y, max, max / 20, 4, (v) => (v ? f(v) : '0'), true);
      /* strong: the used bar hangs 7px under the 3px scale */
      if (qTop > 0) g += K.rect(x0, y - 1.5, (X(Math.min(now, max)) - x0) * qTop, S ? 7 : 3, 'fg', 'none');
      if (qTop >= 1 && now > max) g += P.brk(x1 + 8, y + (S ? 2 : 0));
      const ix0 = 18, ix1 = Math.round(w * 0.65), iy = 92, IX0 = K.scale(ix0, ix1, 0, zoomMax);
      /* past zoomMax the inset stops at its end and breaks off in red, clear of the detail label */
      const IX = (v) => IX0(Math.min(v, zoomMax)), past = now > zoomMax && fill > zoomMax;
      const factor = o.factor || Math.round(max / zoomMax);
      if (qProj > 0) {
        const sy = y + (S ? 7 : 3), dy = iy - 13, lerp = (a, b) => a + (b - a) * qProj;
        g += K.path(`M${X(0).toFixed(2)} ${sy}L${lerp(X(0), ix0).toFixed(2)} ${lerp(sy, dy).toFixed(2)}M${X(zoomMax).toFixed(2)} ${sy}L${lerp(X(zoomMax), ix1).toFixed(2)} ${lerp(sy, dy).toFixed(2)}`, 'fa', S ? { w: 2, dash: '3 3' } : { dash: '2 3' });
      }
      /* the inset: a hairline frame, or at strong weight a recessed 12px track filled edge to edge */
      if (S) g += K.rect(ix0, iy - 12, ix1 - ix0, 12, 'well', 'none');
      else g += K.rect(ix0, iy - 12, ix1 - ix0, 12, 'none', 'ed');
      let acc = 0; const mids = [];
      parts.forEach((p, i) => {
        const a = acc, b = Math.min(acc + vals[i], fill);
        if (IX(b) > IX(a)) g += K.rect(IX(a), iy - (S ? 12 : 11), IX(b) - IX(a), S ? 12 : 10, p.ink === 'lv' ? 'var(--live)' : p.ink || 'fg', 'none');
        mids.push(IX(acc + vals[i] / 2)); acc += vals[i];
      });
      if (S) g += K.outline(ix0, iy - 12, ix1 - ix0, 12, 'ed', W.rule);
      if (past) g += P.brk(ix1 + 6, iy - 6);
      for (let i = 0; i <= 10; i++) {
        const xx = IX(i * zoomMax / 10), M = i % 5 === 0;
        g += S ? K.line(xx, iy, xx, iy + (M ? 7 : 4), M ? 'fg' : 'fa', { w: M ? W.major : W.tick }) : K.line(xx, iy, xx, iy + (M ? 6 : 3), 'fa');
      }
      [0, 0.5, 1].forEach((r, i) => { g += P.L(IX(r * zoomMax), iy + (S ? 18 : 16), r ? f(r * zoomMax) : '0', 'ky', i ? 'middle' : 'start'); });
      acc = 0;
      /* each part's centre: a dot, or at strong weight a square cut out of the fill */
      parts.forEach((p, i) => { if (fill >= acc + vals[i] / 2) g += S ? K.rect(mids[i] - 2, iy - 8, 4, 4, 'pn', 'none') : K.circle(mids[i], iy - 6, 1.8, 'pn', 'fa'); acc += vals[i]; });
      let k = P.L(ix1 + (used > zoomMax ? 16 : 8), iy - 3, `${(o.detail ?? 'A') ? 'DETAIL ' + (o.detail ?? 'A') + '  ' : ''}${factor}:1`, 'mu');
      /* the row of boxes starts at 92, or further left (to the inset's edge)
         when the boxes and the plate wouldn't fit the width */
      let bx = Math.max(ix0, Math.min(92, (o.plate ? w - pw - 18 : w - 4) - row));
      const landed = changing && T >= cms;
      acc = 0;
      parts.forEach((p, i) => {
        const reached = fill >= acc + vals[i] / 2; acc += vals[i];
        /* while gliding, a box is as wide as the wider of its old and new value, so the row holds still */
        const val = '≈ ' + f(vals[i]), bw = changing && !landed ? Math.max(P.boxWidth(p.label, '≈ ' + f(o.prev[i] ?? 0)), P.boxWidth(p.label, '≈ ' + f(p.value))) : P.boxWidth(p.label, val);
        const m = (S ? K.line(mids[i], iy + 1, mids[i], 118, 'fa', { w: 2 }) : K.line(mids[i], iy, mids[i], 122, 'fa')) + P.box(bx, 122, bw, p.label, val, p.ink === 'lv' ? 'lv' : 'fg');
        if (changing) k += landed && (o.prev[i] ?? 0) !== p.value ? `<g data-land="part${i}">${m}</g>` : m;
        else if (reached) g += `<g data-land="part${i}">${m}</g>`;   /* entry: each box flashes in as the fill passes its part */
        bx += bw + 10;
      });
      if (o.plate) k += P.plate(Math.max(bx + 4, w - pw - 14), 118, 94, o.plate[0], o.plate[1]);
      if (changing) g += k;
      else if (T >= M.flash) g += `<g data-land="parts">${k}</g>`;
      const label = o.label || `${o.title || 'Measure'}: ${f(used)} of ${f(max)}.` + (parts.length ? ' ' + parts.map((p) => `${p.label} ${f(p.value)}`).join(', ') + '.' : ' Nothing measured.')
        + (o.plate ? ` ${o.plate[0]} ${o.plate[1]}.` : '');
      return warn.done({ w, h, markup: g, label });
    },

    /* ── timeline · consecutive steps with durations; the slowest called out (FIG.20)
       { n, title, steps:[seconds], total label auto, slowest:true,
         names:[per-step label, default 1…n], noun:'step' }
       The ruler picks its tick (1s … 1 day) so it holds at most 40 ticks,
       numbered every 5th, and ends at the tick after the total: a 20-minute run
       reads in minutes, a 28-hour one in hours.
       Step numbers that would touch their neighbour are skipped; the last always shows. */
    timeline(o) {
      const warn = warner('timeline'), P = pen(o), S = P.S, W = K.W;
      const w = o.w || 470, x0 = 14, x1 = w - 14, y = 70, noun = o.noun || 'step';
      const raw = Array.isArray(o.steps) ? o.steps : (warn('needs a steps array'), []);
      if (raw.some((d) => !(num(d, -1) >= 0))) warn('steps should be seconds, 0 or more; others drawn as 0');
      const steps = raw.map((d) => Math.max(0, num(d)));
      const total = steps.reduce((a, b) => a + b, 0);
      if (!steps.length) {
        /* nothing ran yet: the ruler and a quiet note, no NaN */
        const g0 = head(o) + P.L(x0, y + 4, `no ${noun}s yet`, 'ky') + P.ruler(x0, x1, 128, 5, 1, 5, tickLabel);
        return warn.done({ w, h: 150 + P.rh, markup: g0, label: o.label || `${o.title || 'Timeline'}: no ${noun}s yet.` });
      }
      /* a live step is still running: what comes after it is still to do */
      const live = Number.isInteger(o.live) && o.live >= 0 && o.live < steps.length ? o.live : -1;
      if (o.live != null && live < 0) warn('live is not a step index');
      const through = live < 0 ? total : steps.slice(0, live + 1).reduce((a, b) => a + b, 0);
      const tick = o.tick || TIMELINE_TICKS.find((s) => total / s <= 40) || TIMELINE_TICKS[TIMELINE_TICKS.length - 1];
      const max = Math.max(Math.ceil(total / tick), 5) * tick;
      /* the slowest finished step (all of them when nothing is live) */
      const ran = live < 0 ? steps : steps.slice(0, live);
      const X = K.scale(x0, x1, 0, max), slow = ran.length ? ran.indexOf(Math.max(...ran)) : -1;
      const name = (i) => String(o.names ? o.names[i] ?? i + 1 : i + 1);
      /* which step numbers fit: walk right to left so the last one always shows */
      const shown = new Set();
      let t = 0, room = Infinity;
      const mids = steps.map((d) => { const m = (X(t) + X(t + d)) / 2; t += d; return m; });
      for (let i = steps.length - 1; i >= 0; i--) {
        const half = tw(name(i)) / 2;
        if (mids[i] + half + 4 <= room) { shown.add(i); room = mids[i] - half; }
      }
      /* motion (see play): t is ms on the TIMELINE clock. The ruler holds
         still. A cursor runs along the line at an even pace through the
         total; the line trails it, each step's node latches and its number
         appears as the cursor passes its end, and a live step's star rides
         the tip. Then the dimension and the slowest callout appear (data-land). */
      const T = o.t ?? Infinity, TT = o.tt ?? T, M = TIMELINE;
      const cur = (q) => (q >= M.draw ? Infinity : total * Math.max(0, q) / M.draw);
      const c = cur(T), ct = cur(TT);
      let g = head(o), k = '';
      t = 0;
      g += P.node(x0, y, 'done');
      steps.forEach((d, i) => {
        const a = X(t), b = X(t + d), s = i === slow && o.slowest !== false, lit = i === live, todo = live >= 0 && i > live;
        const lineTo = X(Math.min(t + d, ct));
        /* a step still to do is a dashed faint line ending in an open node */
        /* strong: each step a solid bar between its nodes, the slowest thicker and in ink */
        if (ct > t && lineTo - a > (S ? 10 : 8)) {
          const xa = a + (S ? 5 : 4), xb = Math.min(b - (S ? 5 : 4), lineTo), bh = s ? 8 : 5;
          if (!S || todo) g += K.line(xa, y, xb, y, todo ? 'fa' : s ? 'fg' : 'mu', todo ? (S ? { w: 2, dash: '3 3' } : { dash: '2 3' }) : { w: s ? 2 : 1.3 });
          else g += K.rect(xa, y - bh / 2, xb - xa, bh, s ? 'fg' : 'mu', 'none');
        }
        if (c >= t + d) {
          g += P.node(b, y, lit ? 'live' : todo ? 'todo' : 'done');
          if (shown.has(i)) g += P.L(mids[i], y - (S ? 10 : 8), name(i), s ? 'fg' : 'ky', 'middle');
        } else if (c > t && lit) g += P.node(X(c), y, 'live');
        if (s) {
          const m = (a + b) / 2, l = [o.slowLabel || 'slowest', `${noun} ${name(i)} · ${fmt.dur(d)}`], bw = P.boxWidth(...l);
          const right = m + 14 + bw < w;
          k += P.leader([[m, y + (S ? 8 : 6)], [m, y + 28], [right ? m + 14 : m - 14, y + 28]], false) + P.box(right ? m + 14 : m - 14 - bw, y + 14, bw, l[0], l[1], 'fg');
        }
        t += d;
      });
      /* the dimension spans what has run: the whole run, or up to the live step */
      k += P.dim(x0, X(through), 36, `${o.totalLabel || (live < 0 ? 'complete' : 'running')} · ${fmt.dur(through)}`, 'fg');
      if (T >= M.flash) g += T >= Infinity ? k : `<g data-land="details">${k}</g>`;
      g += P.ruler(x0, x1, 128, max, tick, 5, tickLabel);
      /* the end of the ruler is numbered too, when it isn't a numbered tick and there is room */
      const nt = Math.round(max / tick), lastMajor = X(Math.floor(nt / 5) * 5 * tick), endLab = tickLabel(max);
      if (nt % 5 && lastMajor + tw(tickLabel(Math.floor(nt / 5) * 5 * tick)) / 2 + 8 < x1 - tw(endLab) / 2) g += P.L(x1, 145 + (S ? 4 : 0), endLab, 'ky', 'middle');
      const slowSaid = slow >= 0 ? ` slowest${live >= 0 ? ' so far' : ''} is ${noun} ${name(slow)} at ${fmt.dur(steps[slow])}.` : '';
      const label = o.label || (live < 0
        ? `${o.title || 'Timeline'}: ${steps.length} ${noun}s, ${fmt.dur(total)} in total;${slowSaid}`
        : `${o.title || 'Timeline'}: ${steps.length} ${noun}s; ${noun} ${name(live)} running, ${fmt.dur(through)} so far; ${steps.length - live - 1} to go.${slowSaid}`);
      return warn.done({ w, h: 150 + P.rh, markup: g, label });
    },

    /* ── matrix · which rows touch which columns; one column called out (FIG.22)
       { n, title, cols:[...], rows:[...], hits:[[colIdx…] per row], callout:{ col, l1, l2 } } */
    matrix(o) {
      const warn = warner('matrix'), P = pen(o), S = P.S, W = K.W;
      const rows = Array.isArray(o.rows) ? o.rows : (warn('needs a rows array'), []);
      const cols = Array.isArray(o.cols) ? o.cols : (warn('needs a cols array'), []);
      const R = rows.length, Cn = cols.length, cw = 42, rh = 14;
      /* hits outside the grid are dropped, not drawn in empty space */
      const hits = rows.map((_, i) => ((o.hits && o.hits[i]) || []).filter((j) => {
        const ok = Number.isInteger(j) && j >= 0 && j < Cn;
        if (!ok) warn(`row ${i} has a hit outside the columns`);
        return ok;
      }));
      /* the row-label column fits the longest label; the heads' room above the grid fits the longest head (rotated −50°) */
      const cx0 = Math.max(52, Math.ceil(Math.max(0, ...rows.map((r) => tw(r))) + 16));
      const sin = Math.sin(50 * Math.PI / 180), cos = Math.cos(50 * Math.PI / 180);
      const ry0 = Math.max(112, Math.ceil(30 + Math.max(0, ...cols.map((c) => tw(c))) * sin));
      const reach = Math.max(0, ...cols.map((c, j) => cx0 + j * cw + cw / 2 + 3 + tw(c) * cos + 4));
      const call = o.callout && Number.isInteger(o.callout.col) && o.callout.col >= 0 && o.callout.col < Cn ? o.callout : null;
      if (o.callout && !call) warn('callout.col is not a column; no callout drawn');
      const w = Math.ceil(Math.max(470, cx0 + Cn * cw + 20, reach)), h = ry0 + R * rh + (call ? (S ? 58 : 50) : 16);
      let g = head(o);
      cols.forEach((c, j) => { const x = cx0 + j * cw + cw / 2; g += `<text transform="translate(${x + 3} ${ry0 - 10}) rotate(-50)" style="fill:var(--muted)${S ? `;font-weight:${W.wt}` : ''}">${C.esc(c)}</text>`; });
      rows.forEach((r, i) => {
        const y = ry0 + i * rh;
        g += P.L(cx0 - 12, y + 4, r, 'ky', 'end') + K.line(cx0, y, cx0 + Cn * cw, y, 'e1');
        hits[i].forEach((j) => { const q = S ? 10 : 8; g += K.rect(cx0 + j * cw + cw / 2 - q / 2, y - q / 2, q, q, 'fg', 'none'); });
      });
      for (let j = 0; j <= Cn; j++) g += K.line(cx0 + j * cw, ry0 - 7, cx0 + j * cw, ry0 + (R - 1) * rh + 7, 'e1');
      if (call) {
        const j = call.col, x = cx0 + j * cw + cw / 2, yb = ry0 + (R - 1) * rh + 7;
        const bw = P.boxWidth(call.l1, call.l2);
        const bx = Math.min(x + 2 * cw - cw / 2, w - bw - 4);
        g = (S ? K.rect(cx0 + j * cw + 1, ry0 - 7, cw - 2, (R - 1) * rh + 14, 'well', 'none') + K.outline(cx0 + j * cw + 1, ry0 - 7, cw - 2, (R - 1) * rh + 14, 'fg', W.major)
          : K.rect(cx0 + j * cw + 1, ry0 - 7, cw - 2, (R - 1) * rh + 14, 'well', 'fg', { w: 1.6 })) + g;   /* under the hits */
        g += P.leader([[x, yb], [x, yb + (S ? 19 : 11)], [bx, yb + (S ? 19 : 11)]], false) + P.box(bx, yb + (S ? 7 : -1), bw, call.l1, call.l2, 'fg', 'fg');
      }
      /* the label lists the cells, row by row, so the grid can be read without seeing it */
      const label = o.label || `${o.title || 'Matrix'}: ${R} rows by ${Cn} columns.`
        + (R ? ' ' + rows.map((r, i) => `${r}: ${hits[i].length ? hits[i].map((j) => cols[j]).join(', ') : 'none'}`).join('; ') + '.' : '')
        + (call ? ` ${call.l1}${call.l2 ? ', ' + call.l2 : ''}.` : '');
      return warn.done({ w, h, markup: g, label });
    },

    /* ── section · nested regions drawn like a building section (FIG.10)
       Coordinates are yours; callouts stack in a right-hand column.
       { n, title, w, h, boundary:{ label }, regions:[{ x,y,w,h, kind:'hatch'|'clear'|'strong'|'dotted'|'island', label, sub }],
         callouts:[{ at:[x,y] | region:i | null, l1, l2, live }] }
       A callout leads to a point (at) or to a region's right edge (region, its
       index). Regions are kept inside the boundary, clear of the callouts. */
    section(o) {
      const warn = warner('section'), P = pen(o), S = P.S, W = K.W;
      const calls = o.callouts || [];
      /* the callout column starts where the soft one does: strong nameplates widen the frame, so region coordinates hold */
      const soft = Math.max(112, ...calls.map((c) => K.boxWidth(c.l1, c.l2))), boxW = Math.max(soft, ...calls.map((c) => P.boxWidth(c.l1, c.l2)));
      const w = (o.w || 520) + boxW - soft, h = Math.max(o.h || 266, 40 + calls.length * 54 + 4), colX = w - boxW - 2;
      /* closed is hatched in faint ink (a mark that carries meaning holds 3:1); locked islands in a finer faint hatch */
      /* strong: the same hatch in 2px stripes, wider apart */
      const H1 = S ? K.hatch('fa', 7, 1, 2) : K.hatch('fa', 6), H2 = S ? K.hatch('fa', 5, 1, 1.5) : K.hatch('fa', 4);
      const edge = o.boundary ? colX - 16 : colX - 8;
      const regions = (o.regions || []).map((r) => {
        const iw = r.kind === 'island' ? r.w || tw(r.label) + 10 : r.w;
        if (r.x + iw <= edge) return r;
        warn(`region '${r.label || r.kind}' reaches into the callout column; kept inside the boundary`);
        /* shrink it, but not below its words: past that it slides left */
        const need = Math.min(iw, Math.max(tw(r.label || ''), tw(r.sub || '')) + 16);
        const nw = Math.max(need, edge - r.x);
        return { ...r, x: Math.max(12, edge - nw), w: nw };
      });
      let g = H1.def + H2.def + head(o);
      if (o.boundary) {
        g += K.rect(8, 26, colX - 20, h - 52, 'none', 'fa', S ? { w: 2, dash: '6 4' } : { dash: '5 4' });
        if (o.boundary.label) g += K.path(`M16 ${h - 17}l6 6M22 ${h - 17}l-6 6`, 'fg', { w: S ? 2.5 : 1.4 }) + P.L(30, h - 10, o.boundary.label, 'mu');
      }
      regions.forEach((r) => {
        const L = r.label ? P.L(r.x + 8, r.y + 16, r.label, 'fg') : '', S = r.sub ? K.t(r.x + 8, r.y + 32, r.sub, 'ky') : '';
        if (r.kind === 'hatch') {
          g += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${H1.url}" style="stroke:var(--edge-strong)${S ? ';stroke-width:1.5' : ''}"/>`;
          if (r.label) g += K.rect(r.x + 4, r.y + 4, tw(r.label) + 8, 16, 'pn', 'none') + P.L(r.x + 8, r.y + 16, r.label, 'fg');
        } else if (r.kind === 'island') {
          const iw = r.w || tw(r.label) + 10;
          g += `<rect x="${r.x}" y="${r.y}" width="${iw}" height="17" fill="${H2.url}" style="stroke:var(--edge-strong)${S ? ';stroke-width:1.5' : ''}"/>` + K.rect(r.x + 2, r.y + 3, iw - 4, 11, 'pn', 'none') + P.L(r.x + 5, r.y + 12.5, r.label, 'mu');
        } else {
          const opt = r.kind === 'strong' ? { w: S ? W.major : 1.6 } : r.kind === 'dotted' ? (S ? { w: 2, dash: '2 3' } : { dash: '1 2' }) : S ? { w: W.rule } : {};
          g += K.rect(r.x, r.y, r.w, r.h, r.kind === 'strong' ? 'none' : 'pn', 'fg', opt) + L + S;
        }
      });
      calls.forEach((c, i) => {
        const y = 40 + i * 54;
        let at = c.at;
        if (!at && c.region != null) {
          const r = regions[c.region];
          if (!r) warn(`callout '${c.l1}' names region ${c.region}, which doesn't exist`);
          else at = [r.x + (r.kind === 'island' ? r.w || tw(r.label) + 10 : r.w), r.y + (r.kind === 'island' ? 8.5 : 12)];
        }
        if (at) c = { ...c, at };
        if (c.at) g += P.leader([c.at, [c.at[0], y + 16], [colX, y + 16]].filter((p, k) => k !== 1 || p[0] !== c.at[0] || p[1] !== c.at[1]));
        g += P.box(colX, y, boxW, c.l1, c.l2, c.live ? 'lv' : 'fg', c.live ? 'lv' : 'ed');
      });
      const label = o.label || `${o.title || 'Section'}: ` + (calls.length ? calls.map((c) => `${c.l1}: ${c.l2}`).join('; ')
        : regions.map((r) => r.label).filter(Boolean).join(', ') || 'empty');
      return warn.done({ w, h, markup: g, label });
    },
  };

  /* weighed · the data at the svg's weight (the nearest [data-weight]), unless the data names its own */
  const weighed = (svg, d) => (d && d.weight ? d : { ...d, weight: C.weight(svg) });

  /* mount a recipe result into an <svg>: mount(svg, result), or mount(svg, recipe, data),
     which draws at the svg's weight and redraws when a [data-weight] around it changes */
  function mount(svg, r, data) {
    if (typeof svg === 'string') svg = document.querySelector(svg);
    if (!svg) return null;
    if (typeof r === 'function') { svg._calFig = { recipe: r, data }; r = r(weighed(svg, data)); }
    C.attr(svg, 'width', r.w); C.attr(svg, 'height', r.h);
    C.attr(svg, 'viewBox', `0 0 ${r.w} ${r.h}`);
    return C.draw(svg, r.markup, r.label);
  }
  const render = (r) => C.svg(r.w, r.h, r.markup, r.label);

  /* extent · how far a recipe's time cursor runs, for recipes that move */
  recipes.lanes.extent = (o) => Math.max(0, ...o.lanes.map((l) => l.end));
  recipes.budget.extent = (o) => Math.max(o.used || 0, o.pace ?? 0);
  /* merge runs on its own timeline: t is ms, so extent and duration match */
  recipes.merge.extent = recipes.merge.duration = () => MERGE.flash;
  recipes.fanout.extent = recipes.fanout.duration = () => FANOUT.flash;
  recipes.timeline.extent = recipes.timeline.duration = () => TIMELINE.flash;
  recipes.loop.extent = recipes.loop.duration = (o) => {
    if (o.from != null) return LOOP.step;
    const done = o.at != null ? o.at : (o.stations || []).filter((s) => s.state === 'done').length;
    return done * LOOP.edge + LOOP.beat;
  };
  recipes.measured.extent = recipes.measured.duration = (o) => {
    if (!o.prev) return MEASURED.flash;
    const d = Math.max(0, ...(o.parts || []).map((p, i) => Math.abs(num(p.value) - (o.prev[i] ?? 0))));
    return Math.round(220 + 480 * Math.min(1, d / (o.zoomMax > 0 ? o.zoomMax : d || 1)));
  };
  /* step(data, ±1) · the data one station on (or back), wrapping into the next
     (or previous) lap; null at the ends. Play the result to animate the step. */
  recipes.loop.step = (o, dir) => {
    const st = o.stations || [], N = st.length, at = o.at ?? Math.max(0, st.findIndex((s) => s.state === 'live'));
    if (!N) return null;
    const lap = o.lap ?? 1, laps = o.laps ?? Infinity;
    let to = at + dir, l = lap;
    if (to >= N) { if (lap >= laps) return null; to = 0; l++; }
    if (to < 0) { if (lap <= 1) return null; to = N - 1; l--; }
    return { ...o, at: to, lap: l, from: at, lapFrom: lap, dir };
  };

  /* the landing blink: two hard offs of 30ms each (two frames at 60Hz;
     shorter and a blink can fall between frames), run as a Web Animation so
     dropped frames can't stretch or skip it */
  const OFF = 30, BLINK = 4 * OFF;
  const BLINK_FRAMES = [0, 0.5].flatMap((o) => [
    { opacity: 0.15, offset: o }, { opacity: 0.15, offset: o + 0.25 },
    { opacity: 1, offset: o + 0.2501 }, { opacity: 1, offset: o + 0.5 },
  ]);
  const reduced = () => !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* crawl(svg) · dashed live tails (data-crawl) move one dash period every
     1.2s: alive, never busy. Tails already crawling keep going. */
  function crawl(svg) {
    if (!svg.animate || reduced()) return;
    svg._calCrawl = (svg._calCrawl || []).filter((a) => a.effect && a.effect.target && a.effect.target.isConnected);
    svg.querySelectorAll('[data-crawl]').forEach((el) => {
      if (svg._calCrawl.some((a) => a.effect.target === el)) return;
      const p = (el.getAttribute('stroke-dasharray') || '2 4').split(/[\s,]+/).reduce((a, b) => a + +b, 0);
      svg._calCrawl.push(el.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -p }], { duration: p * 200, iterations: Infinity }));
    });
  }

  /* play(svg, recipe, data) · mount a recipe and replay it: when the figure is
     half in view, a time cursor sweeps the ruler at an even pace (700ms for
     the whole scale) and the recipe redraws each frame. Lines trail the
     cursor by 110ms. A recipe with a duration (ms) sets its own length.
     Each frame redraws only the parts that changed (see draw). Whatever
     latches (data-land) blinks twice on landing, and dashed live tails
     (data-crawl) then crawl slowly, for as long as the figure is shown. The
     clock is a Web Animation on the svg, so playbackRate and DevTools slow
     it like CSS motion. New data for a replay in flight goes through
     update(), which retargets it instead of cutting it short. Reduced
     motion, { still: true }, a recipe without an extent or no WAAPI: mount
     the finished figure. */
  function play(svg, recipe, data, opts = {}) {
    if (typeof svg === 'string') svg = document.querySelector(svg);
    if (!svg) return null;
    if (svg._calStop) svg._calStop();
    const ext0 = recipe.extent ? recipe.extent(data) : 0;
    if (opts.still || !ext0 || !svg.animate || !root.IntersectionObserver || reduced()) {
      mount(svg, recipe, data);
      crawl(svg);
      return svg;
    }
    const TRAIL = 110, ms = recipe.duration ? recipe.duration(data) : Math.round(700 * Math.min(1, ext0 / (data.max || ext0)));
    /* the replay draws `cur`, which update() may swap for newer data */
    let cur = data, draw = recipe;
    const at = (e) => {
      const ext = draw.extent(cur) || ext0;
      return ext * Math.min(1, Math.max(0, e / ms));
    };
    const landed = new Map();
    let clock = null, io = null;
    const stop = () => {
      if (io) io.disconnect();
      if (clock) clock.cancel();
      (svg._calCrawl || []).forEach((a) => a.cancel());
      io = clock = null; svg._calCrawl = []; svg._calStop = svg._calRetarget = null;
    };
    svg._calStop = stop;
    svg._calRetarget = (r, d) => {
      draw = r; cur = d; svg._calFig = { recipe: r, data: d };
      if (!clock) mount(svg, draw(weighed(svg, { ...cur, t: 0, tt: 0 })));   /* still waiting to be seen */
    };
    const frame = () => {
      if (!clock) return;
      if (!svg.isConnected) return stop();
      const e = clock.currentTime || 0;
      mount(svg, draw(weighed(svg, { ...cur, t: at(e), tt: at(e - TRAIL) })));
      let busy = e < ms + TRAIL;
      svg.querySelectorAll('[data-land]').forEach((g) => {
        const k = g.getAttribute('data-land');
        if (!landed.has(k)) landed.set(k, e);
        const q = e - landed.get(k);
        if (q >= BLINK) return;
        busy = true;
        /* a group redrawn mid-blink picks the blink up where it was */
        if (g._calLanded !== landed) { g._calLanded = landed; g.animate(BLINK_FRAMES, { duration: BLINK }).currentTime = q; }
      });
      if (busy) return requestAnimationFrame(frame);
      clock.cancel(); clock = null; svg._calRetarget = null;
      mount(svg, draw, cur);
      crawl(svg);
    };
    svg._calFig = { recipe, data };
    mount(svg, draw(weighed(svg, { ...cur, t: 0, tt: 0 })));
    io = new IntersectionObserver((es) => {
      if (!es.some((x) => x.isIntersecting)) return;
      io.disconnect(); io = null;
      clock = svg.animate([], { duration: ms + TRAIL + BLINK + 100 });
      requestAnimationFrame(frame);
    }, { threshold: 0.5 });
    io.observe(svg);
    return svg;
  }

  /* update(svg, recipe, data) · show new data without replaying. A replay in
     flight, or one still waiting to be seen, carries on and lands on the new
     data; otherwise the figure is redrawn still, keeping its crawl. Use it
     for live values (a running clock) between replays, so a tick never cuts
     a replay short. */
  function update(svg, recipe, data) {
    if (typeof svg === 'string') svg = document.querySelector(svg);
    if (!svg) return null;
    if (svg._calRetarget) { svg._calRetarget(recipe, data); return svg; }
    mount(svg, recipe, data);
    crawl(svg);
    return svg;
  }

  /* a [data-weight] change redraws every figure mounted from a recipe, at its new weight;
     a replay in flight picks the weight up on its next frame */
  if (typeof document !== 'undefined' && root.MutationObserver) {
    new MutationObserver(() => document.querySelectorAll('svg').forEach((svg) => {
      const f = svg._calFig;
      if (!f) return;
      if (svg._calRetarget) svg._calRetarget(f.recipe, f.data);
      else { mount(svg, f.recipe, f.data); crawl(svg); }
    })).observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-weight'] });
  }

  root.Calibrated = Object.assign(C, { recipes, mount, render, play, update });
})(typeof window !== 'undefined' ? window : globalThis);
