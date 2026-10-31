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

  const recipes = {
    /* ── lanes · several runs on one time ruler
       { n, title, max, unit:'m', lanes:[{ name, end, label, live, box:[l1, l2] }] } */
    lanes(o) {
      const w = o.w || 520, x0 = o.labelW || 70, boxW = 112, x1 = w - boxW - 30, max = o.max;
      const X = K.scale(x0, x1, 0, max), unit = o.unit ?? 'm';
      let g = head(o);
      o.lanes.forEach((l, i) => {
        const y = 58 + i * 46, live = !!l.live, c = live ? 'lv' : 'fg';
        g += K.t(x0 - 10, y + 4, l.name, 'fg', 'end');
        g += K.line(x0, y, X(l.end), y, c, { w: 2 });
        if (live) g += K.line(X(l.end), y, x1, y, 'fa', { dash: '2 4' });
        g += K.node(x0, y, 'done') + K.node(X(l.end), y, live ? 'live' : 'done');
        g += K.dim(x0, X(l.end), y - 14, l.label, live ? 'fg' : 'mu');
        if (l.box) {
          g += K.box(w - boxW - 10, y - 16, boxW, l.box[0], l.box[1], live ? 'lv' : 'fg', live ? 'lv' : 'ed');
          if (!live) g += K.line(X(l.end) + 6, y, w - boxW - 10, y, 'e1', { dash: '1 3' });
        }
      });
      const ry = 58 + o.lanes.length * 46 - 16;
      const step = o.step || Math.max(1, Math.round(max / 10));
      g += K.ruler(x0, x1, ry, max, step, o.every || 5, (v) => v + unit);
      const label = o.label || `${o.title || 'Lanes'}: ` + o.lanes.map((l) => `${l.name} ${l.live ? 'running at' : 'took'} ${l.label}`).join('; ');
      return { w, h: ry + 26, markup: g, label };
    },

    /* ── budget · a limit ruler with alerts, today's use and the pace to the end
       { n, title, max, used, at:'16:20', pace, alerts:[{ v, label }], unit:'k',
         usedLabel, paceLabel:[l1, l2], fmt } */
    budget(o) {
      const w = o.w || 520, x0 = 16, x1 = w - 20, y = 92, max = o.max;
      const X = K.scale(x0, x1, 0, max), f = o.fmt || ((v) => v + (o.unit ?? ''));
      let g = head(o);
      const first = o.alerts && o.alerts.length ? o.alerts[0].v : null;
      if (first != null) {
        const H = K.hatch('ft', 4, 0.45);
        g += H.def + `<rect x="${X(first)}" y="${y - 4}" width="${X(max) - X(first)}" height="8" fill="${H.url}"/>`;
      }
      g += K.rect(x0, y - 2, X(o.used) - x0, 4, 'fg', 'none');
      if (o.pace != null) g += K.line(X(o.used), y, X(o.pace), y, 'lv', { dash: '4 3' });
      g += K.ruler(x0, x1, y + 6, max, o.step || max / 15, o.every || 5, (v) => (v ? f(v) : '0'));
      (o.alerts || []).forEach((a, i) => {
        const end = i === 0 && o.alerts.length > 1;
        g += K.line(X(a.v), y - 36, X(a.v), y + 4, 'ft', { opacity: 0.7 }) + K.t(X(a.v) + (end ? -4 : 4), y - 28, a.label, 'ft', end ? 'end' : 'start');
      });
      g += K.node(X(o.used), y, 'done');
      const ul = [o.usedLabel || 'used' + (o.at ? ' · ' + o.at : ''), f(o.used)];
      const uw = K.boxWidth(...ul);
      g += K.leader([[X(o.used), y - 6], [X(o.used), y - 42], [X(o.used) - 10, y - 42]], false) + K.box(X(o.used) - 10 - uw, y - 60, uw, ul[0], ul[1], 'fg');
      if (o.pace != null) {
        const pl = o.paceLabel || ['at this pace', '≈ ' + f(o.pace)];
        const pw = K.boxWidth(...pl);
        g += K.circle(X(o.pace), y, 3, 'pn', 'fg');
        g += K.leader([[X(o.pace), y + 4], [X(o.pace), y + 44], [X(o.pace) - 40, y + 44]], false) + K.box(X(o.pace) - 40 - pw, y + 30, pw, pl[0], pl[1], 'lv', 'lv');
      }
      const label = o.label || `${o.title || 'Budget'} ${f(max)}. Used ${f(o.used)}${o.at ? ' by ' + o.at : ''}.` + (o.pace != null ? ` At this pace about ${f(o.pace)}.` : '');
      return { w, h: 170, markup: g, label };
    },

    /* ── merge · a branch, its commits and the commands at each node (FIG.11)
       { n, title, base:'main', branch, commits:5, baseAhead:1, files:[l1,l2],
         verdict:[l1,l2], steps:['git switch main', 'git merge --no-ff …', 'git worktree remove …'] } */
    merge(o) {
      const w = 520, by = 170, fy = 70, steps = o.steps || [];
      const n = Math.max(1, o.commits), cx0 = 130, cx1 = 330, cs = n > 1 ? (cx1 - cx0) / (n - 1) : 0;
      const ff = !o.baseAhead;
      let g = head(o);
      g += K.line(20, by, w - 50, by, 'fg', { w: 1.3 }) + K.t(20, by - 8, o.base || 'main', 'fg');
      g += K.node(60, by, 'done');
      if (!ff) g += K.node(250, by, 'done') + K.t(250, by - 10, `+${o.baseAhead} since branch`, 'fa', 'middle');
      g += K.path(`M60 ${by} C 60 ${fy}, 80 ${fy}, 110 ${fy} L ${cx1} ${fy}`, 'fg', { w: 1.3 });
      for (let i = 0; i < n; i++) g += K.node(n > 1 ? cx0 + i * cs : cx1, fy, 'done');
      g += K.t(110, fy - 12, o.branch, 'fg');
      g += K.path(`M${cx1} ${fy} C 380 ${fy}, 390 ${by}, 400 ${by}`, 'fg', { dash: '4 3' });
      g += K.node(400, by, ff ? 'done' : 'merge');
      g += K.line(406, by, w - 50, by, 'fa', { dash: '2 3' });
      if (n > 1) g += K.dim(cx0, cx1, fy + 22, `${n} commits`);
      if (o.files) g += K.leader([[230, fy + 26], [230, 104]], false) + K.box(180, 104, 100, o.files[0], o.files[1], 'fg');
      const v = o.verdict || (ff ? ['fast-forward', 'no merge commit'] : ['merge commit', `${o.base || 'main'} moved on`]);
      g += K.leader([[400, by - 7], [400, 140], [410, 140]], false) + K.box(410, 124, 102, v[0], v[1], 'fg', 'fg');
      if (steps[0]) g += K.leader([[250, by + 6], [250, 200]], false) + K.cmd(243, 212, '1', steps[0]);
      if (steps[1]) g += K.leader([[400, by + 7], [400, 226]], false) + K.cmd(412, 238, '2', steps[1], 'fg', 'end');
      if (steps[2]) g += K.leader([[cx1, fy - 6], [cx1, 46]], false) + K.cmd(Math.min(250, w - tw('$ ' + steps[2]) - 30), 40, '3', steps[2]);
      const label = o.label || `Merge plan. ${o.branch} has ${n} commits. ${o.base || 'main'} ${ff ? 'has not moved, so this is a fast-forward' : `moved on by ${o.baseAhead}, so this is a merge commit`}. Steps: ${steps.map((s, i) => `${i + 1} ${s}`).join(', ')}.`;
      return { w, h: 250, markup: g, label };
    },

    /* ── fanout · one parent with live and finished children (FIG.13)
       { n, title, root:[l1, l2], children:[{ task, meta, time, live }], folded:'+1 done earlier' } */
    fanout(o) {
      const w = o.w || 520, kids = o.children, gap = 52, top = 44;
      const h = Math.max(220, top + kids.length * gap + (o.folded ? 36 : 10));
      const oy = top + ((kids.length - 1) * gap) / 2 + 10, ox = 112;
      let g = head(o);
      g += K.rect(8, oy - 22, 96, 44, 'pn', 'fg') + K.t(16, oy - 6, o.root[0], 'fg') + K.t(16, oy + 8, o.root[1] || '', 'fa');
      g += K.node(ox, oy, kids.some((k) => k.live) ? 'live' : 'done');
      kids.forEach((s, i) => {
        const y = top + i * gap, nx = 200, live = !!s.live;
        g += K.path(`M${ox + 8} ${oy} L160 ${oy} L176 ${y + 10} L${nx} ${y + 10}`, live ? 'fg' : 'fa');
        g += K.node(nx, y + 10, live ? 'started' : 'done');
        g += K.rect(212, y - 6, w - 222, 32, 'pn', live ? 'ed' : 'e1');
        g += K.t(220, y + 7, s.task, live ? 'fg' : 'mu') + K.t(220, y + 20, s.meta || '', 'fa') + K.t(w - 18, y + 20, s.time || '', live ? 'lv' : 'fa', 'end');
      });
      if (o.folded) {
        const fy = top + kids.length * gap + 6;
        g += K.path(`M160 ${oy} L176 ${fy} L200 ${fy}`, 'e1', { dash: '2 3' }) + K.t(212, fy + 4, o.folded, 'fa');
      }
      const label = o.label || `${o.root[0]} with ${kids.length} children: ` + kids.map((k) => `${k.task}, ${k.live ? 'running' : 'done'}`).join('; ');
      return { w, h, markup: g, label };
    },

    /* ── loop · stations on a cycle, the live one highlighted
       { n, title, center:'train 4 of 9', stations:[{ name, cmd, state:'done'|'live'|'todo' }] } */
    loop(o) {
      const w = o.w || 420, h = o.h || 250, cx = w / 2, cy = 138, R = 70;
      const st = o.stations, N = st.length;
      const P = st.map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / N; return [cx + R * Math.cos(a), cy + R * Math.sin(a), a]; });
      let g = head(o);
      g += K.circle(cx, cy, R * 1.2, 'none', 'e1');
      g += K.path(`M${P.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' L')} Z`, 'ed');
      st.forEach((s, i) => { if (s.state === 'done') { const q = P[(i + 1) % N]; g += K.line(P[i][0], P[i][1], q[0], q[1], 'fg', { w: 1.4 }); } });
      g += K.centre(cx - R * 1.3, cy, cx + R * 1.3, cy) + K.centre(cx, cy - R * 1.3, cx, cy + R * 1.3) + K.cross(cx, cy, 4);
      if (o.center) g += K.t(cx, cy + 24, o.center, 'mu', 'middle');
      st.forEach((s, i) => {
        const [x, y, a] = P[i], cos = Math.cos(a), sin = Math.sin(a);
        g += s.state === 'live' ? K.node(x, y, 'live', 9) : K.node(x, y, s.state === 'done' ? 'started' : 'todo', 9);
        const side = Math.abs(cos) < 0.3 ? 0 : cos > 0 ? 1 : -1;
        const tx = side === 1 ? x + 16 : side === -1 ? x - 16 : x;
        const ty = side === 0 ? (sin < 0 ? y - 26 : y + 22) : y - 4;
        const an = side === 1 ? 'start' : side === -1 ? 'end' : 'middle';
        const live = s.state === 'live', done = s.state === 'done';
        g += K.t(tx, ty, String(s.name).toUpperCase(), live || done ? 'fg' : 'mu', an, 0.5);
        if (s.cmd) g += K.t(tx, ty + 13, (live ? '$ ' : '') + s.cmd, live ? 'fg' : 'fa', an);
      });
      const label = o.label || `${o.title || 'Loop'}: ` + st.map((s) => s.name + (s.state === 'live' ? ' (live)' : '')).join(', ') + (o.center ? `. ${o.center}` : '');
      return { w, h, markup: g, label };
    },

    /* ── measured · a long ruler, a magnified inset of the used part, boxed parts (FIG.06)
       { title, max, zoomMax, factor, parts:[{ label, value, ink }], plate:[l1, l2], fmt } */
    measured(o) {
      const w = o.w || 460, h = 176, f = o.fmt || C.fmt.k;
      const x0 = 18, x1 = w - 20, y = 46, X = K.scale(x0, x1, 0, o.max);
      const used = o.parts.reduce((a, p) => a + p.value, 0);
      let g = '';
      if (o.title) g += K.t(12, 18, String(o.title).toUpperCase(), 'mu', 'start', 0.5);
      g += K.ruler(x0, x1, y, o.max, o.max / 20, 4, (v) => (v ? f(v) : '0'), true);
      g += K.rect(x0, y - 1.5, X(used) - x0, 3, 'fg', 'none');
      const ix0 = 18, ix1 = Math.round(w * 0.65), iy = 92, IX = K.scale(ix0, ix1, 0, o.zoomMax);
      g += K.inset(X(0), X(o.zoomMax), y + 3, ix0, ix1, iy - 13, o.factor || Math.round(o.max / o.zoomMax), o.detail || 'A');
      g += K.rect(ix0, iy - 12, ix1 - ix0, 12, 'none', 'ed');
      let acc = 0; const mids = [];
      o.parts.forEach((p) => { g += K.rect(IX(acc), iy - 11, IX(acc + p.value) - IX(acc), 10, p.ink || 'fg', 'none'); mids.push(IX(acc + p.value / 2)); acc += p.value; });
      for (let i = 0; i <= 10; i++) { const xx = IX(i * o.zoomMax / 10); g += K.line(xx, iy, xx, iy + (i % 5 ? 3 : 6), 'fa'); }
      [0, 0.5, 1].forEach((r, i) => { g += K.t(IX(r * o.zoomMax), iy + 16, r ? f(r * o.zoomMax) : '0', 'fa', i ? 'middle' : 'start'); });
      let bx = 92;
      o.parts.forEach((p, i) => {
        const val = '≈ ' + f(p.value), bw = K.boxWidth(p.label, val);
        g += K.line(mids[i], iy, mids[i], 122, 'fa') + K.circle(mids[i], iy - 6, 1.8, 'pn', 'fa');
        g += K.box(bx, 122, bw, p.label, val, p.ink === 'lv' ? 'lv' : 'fg');
        bx += bw + 10;
      });
      if (o.plate) g += K.plate(Math.max(bx + 4, w - 108), 118, 94, o.plate[0], o.plate[1]);
      const label = o.label || `${o.title || 'Measure'}: ${f(used)} of ${f(o.max)}. ` + o.parts.map((p) => `${p.label} ${f(p.value)}`).join(', ') + '.';
      return { w, h, markup: g, label };
    },

    /* ── timeline · consecutive steps with durations; the slowest called out (FIG.20)
       { n, title, steps:[seconds], total label auto, slowest:true } */
    timeline(o) {
      const w = o.w || 470, x0 = 14, x1 = w - 14, y = 70;
      const total = o.steps.reduce((a, b) => a + b, 0), max = Math.ceil(total / 60 / 5) * 5 * 60 || 60;
      const X = K.scale(x0, x1, 0, max), slow = o.steps.indexOf(Math.max(...o.steps));
      let g = head(o), t = 0;
      g += K.node(x0, y, 'done');
      o.steps.forEach((d, i) => {
        const a = X(t), b = X(t + d), s = i === slow && o.slowest !== false;
        g += K.line(a + 4, y, b - 4, y, s ? 'fg' : 'mu', { w: s ? 2 : 1.3 }) + K.node(b, y, i === o.live ? 'live' : 'done');
        g += K.t((a + b) / 2, y - 8, String(i + 1), s ? 'fg' : 'fa', 'middle');
        if (s) {
          const m = (a + b) / 2, l = [o.slowLabel || 'slowest', `step ${i + 1} · ${fmt.dur(d)}`], bw = K.boxWidth(...l);
          const right = m + 14 + bw < w;
          g += K.leader([[m, y + 6], [m, y + 28], [right ? m + 14 : m - 14, y + 28]], false) + K.box(right ? m + 14 : m - 14 - bw, y + 14, bw, l[0], l[1], 'fg');
        }
        t += d;
      });
      g += K.dim(x0, X(total), 36, `${o.totalLabel || 'complete'} · ${fmt.dur(total)}`, 'fg');
      g += K.ruler(x0, x1, 128, max, 60, 5, (s) => (s ? s / 60 + 'm' : '0'));
      const label = o.label || `${o.title || 'Timeline'}: ${o.steps.length} steps, ${fmt.dur(total)} in total; slowest is step ${slow + 1} at ${fmt.dur(o.steps[slow])}.`;
      return { w, h: 150, markup: g, label };
    },

    /* ── matrix · which rows touch which columns; one column called out (FIG.22)
       { n, title, cols:[...], rows:[...], hits:[[colIdx…] per row], callout:{ col, l1, l2 } } */
    matrix(o) {
      const cw = 42, rh = 14, cx0 = 52, ry0 = 112, R = o.rows.length, Cn = o.cols.length;
      const w = Math.max(470, cx0 + Cn * cw + 20), h = ry0 + R * rh + (o.callout ? 50 : 16);
      let g = head(o);
      o.cols.forEach((c, j) => { const x = cx0 + j * cw + cw / 2; g += `<text transform="translate(${x + 3} ${ry0 - 10}) rotate(-50)" style="fill:var(--muted)">${C.esc(c)}</text>`; });
      o.rows.forEach((r, i) => {
        const y = ry0 + i * rh;
        g += K.t(cx0 - 12, y + 4, r, 'fa', 'end') + K.line(cx0, y, cx0 + Cn * cw, y, 'e1');
        (o.hits[i] || []).forEach((j) => { g += K.rect(cx0 + j * cw + cw / 2 - 4, y - 4, 8, 8, 'fg', 'none'); });
      });
      for (let j = 0; j <= Cn; j++) g += K.line(cx0 + j * cw, ry0 - 7, cx0 + j * cw, ry0 + (R - 1) * rh + 7, 'e1');
      if (o.callout) {
        const j = o.callout.col, x = cx0 + j * cw + cw / 2, yb = ry0 + (R - 1) * rh + 7;
        const bw = K.boxWidth(o.callout.l1, o.callout.l2);
        const bx = Math.min(x + 2 * cw - cw / 2, w - bw - 4);
        g = K.rect(cx0 + j * cw + 1, ry0 - 7, cw - 2, (R - 1) * rh + 14, 'well', 'fg', { w: 1.6 }) + g;   /* under the hits */
        g += K.leader([[x, yb], [x, yb + 11], [bx, yb + 11]], false) + K.box(bx, yb - 1, bw, o.callout.l1, o.callout.l2, 'fg', 'fg');
      }
      const label = o.label || `${o.title || 'Matrix'}: ${R} rows by ${Cn} columns.` + (o.callout ? ` ${o.callout.l1}.` : '');
      return { w, h, markup: g, label };
    },

    /* ── section · nested regions drawn like a building section (FIG.10)
       Coordinates are yours; callouts stack in a right-hand column.
       { n, title, w, h, boundary:{ label }, regions:[{ x,y,w,h, kind:'hatch'|'clear'|'strong'|'dotted'|'island', label, sub }],
         callouts:[{ at:[x,y]|null, l1, l2, live }] } */
    section(o) {
      const w = o.w || 520, h = o.h || 266;
      const boxW = Math.max(112, ...(o.callouts || []).map((c) => K.boxWidth(c.l1, c.l2))), colX = w - boxW - 2;
      const H1 = K.hatch('e1', 6), H2 = K.hatch('fa', 4);
      let g = H1.def + H2.def + head(o);
      if (o.boundary) {
        g += K.rect(8, 26, colX - 20, h - 52, 'none', 'fa', { dash: '5 4' });
        if (o.boundary.label) g += K.path(`M16 ${h - 17}l6 6M22 ${h - 17}l-6 6`, 'fg', { w: 1.4 }) + K.t(30, h - 10, o.boundary.label, 'mu');
      }
      (o.regions || []).forEach((r) => {
        const L = r.label ? K.t(r.x + 8, r.y + 16, r.label, 'fg') : '', S = r.sub ? K.t(r.x + 8, r.y + 32, r.sub, 'fa') : '';
        if (r.kind === 'hatch') {
          g += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${H1.url}" style="stroke:var(--edge-strong)"/>`;
          if (r.label) g += K.rect(r.x + 4, r.y + 4, tw(r.label) + 8, 16, 'pn', 'none') + K.t(r.x + 8, r.y + 16, r.label, 'fg');
        } else if (r.kind === 'island') {
          const iw = r.w || tw(r.label) + 10;
          g += `<rect x="${r.x}" y="${r.y}" width="${iw}" height="17" fill="${H2.url}" style="stroke:var(--edge-strong)"/>` + K.rect(r.x + 2, r.y + 3, iw - 4, 11, 'pn', 'none') + K.t(r.x + 5, r.y + 12.5, r.label, 'mu');
        } else {
          const opt = r.kind === 'strong' ? { w: 1.6 } : r.kind === 'dotted' ? { dash: '1 2' } : {};
          g += K.rect(r.x, r.y, r.w, r.h, r.kind === 'strong' ? 'none' : 'pn', 'fg', opt) + L + S;
        }
      });
      (o.callouts || []).forEach((c, i) => {
        const y = 40 + i * 54;
        if (c.at) g += K.leader([c.at, [c.at[0], y + 16], [colX, y + 16]].filter((p, k) => k !== 1 || p[0] !== c.at[0] || p[1] !== c.at[1]));
        g += K.box(colX, y, boxW, c.l1, c.l2, c.live ? 'lv' : 'fg', c.live ? 'lv' : 'ed');
      });
      const label = o.label || `${o.title || 'Section'}: ` + (o.callouts || []).map((c) => `${c.l1}: ${c.l2}`).join('; ');
      return { w, h, markup: g, label };
    },
  };

  /* mount a recipe result into an <svg> */
  function mount(svg, r) {
    if (typeof svg === 'string') svg = document.querySelector(svg);
    if (!svg) return null;
    svg.setAttribute('width', r.w); svg.setAttribute('height', r.h);
    svg.setAttribute('viewBox', `0 0 ${r.w} ${r.h}`);
    return C.draw(svg, r.markup, r.label);
  }
  const render = (r) => C.svg(r.w, r.h, r.markup, r.label);

  root.Calibrated = Object.assign(C, { recipes, mount, render });
})(typeof window !== 'undefined' ? window : globalThis);
