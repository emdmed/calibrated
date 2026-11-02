/* Calibrated — components (custom elements)
   Instruments drawn in the figure language. Each one reads its attributes,
   draws an <svg> inside itself and redraws when an attribute changes.

   <cal-meter value="46000" max="1000000" warn="800000" label="context"></cal-meter>
   <cal-position index="3" count="7" label="files"></cal-position>
   <cal-progress done="11" total="15" live="12" live-label="step 12 · running"></cal-progress>
   <cal-diff added="184" removed="20"></cal-diff>
   <cal-durations max="15" unit="m">
     <cal-span name="build" value="252"></cal-span>
     <cal-span name="deploy" value="485" live></cal-span>   <!-- or start="<epoch ms>" to tick live -->
   </cal-durations>
   <cal-ruler min="0" max="150" step="10" every="5" unit="k"></cal-ruler>
   <cal-spin></cal-spin>                                    <!-- the braille ring spinner -->
   <cal-elapsed></cal-elapsed>                              <!-- the readout's clock, mm:ss.t -->

   Plus the wiring for the CSS controls (textarea status line, detent, range,
   number, file drop, tag input, dialog openers, menus) and Calibrated.toast()
   and Calibrated.pager(). See references/catalog.md.

   Full or compact: the nearest [data-density="full|compact"], or a
   density="…" attribute on the element itself. Full prints scales, boxes
   values and adds leaders. Compact keeps the marks and a bare reading
   beside them (3/7, +184 −20); the full sentence is in the <title>.

   Needs calibrated.css. The instruments also need calibrated-figures.js loaded
   first; without it the controls, toast, pager, tabs, sign-off, <cal-spin> and
   <cal-elapsed> still work. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  /* the instruments draw with the figure kit; the controls, toast, pager, tabs, sign-off,
     <cal-spin> and <cal-elapsed> work without it */
  const C = root.Calibrated || {};
  const FIG = !!C.K;
  const { K, fmt, textWidth: tw } = C;
  const esc = C.esc || ((t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'));
  const define = (n, c) => { if (root.customElements && !customElements.get(n)) customElements.define(n, c); };

  const num = (el, a, d) => { const v = parseFloat(el.getAttribute(a)); return Number.isFinite(v) ? v : d; };
  const str = (el, a, d = '') => (el.hasAttribute(a) ? el.getAttribute(a) : d);
  const group = (n) => Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
  /* nice · the smallest 1, 2 or 5 × 10ⁿ at or above raw */
  const nice = (raw) => { const p = Math.pow(10, Math.floor(Math.log10(raw))); return [1, 2, 5, 10].map((m) => m * p).find((m) => m >= raw * (1 - 1e-9)); };
  const KY = 'ky';   /* small text in --key: scale numbers and names (--faint 'fa' is for marks only) */
  const warned = new Set();
  const warn = (el, msg) => { const k = el.localName + msg; if (!warned.has(k)) { warned.add(k); console.warn(`<${el.localName}> ${msg}`); } };

  if (!FIG) console.warn('calibrated-components.js: load calibrated-figures.js first to draw the <cal-*> instruments');
  else {
  const formatter = (name, unit = '') => {
    if (name === 'pct') return (v) => fmt.pct(v);
    if (name === 'raw') return (v) => String(Math.round(v * 100) / 100) + unit;
    if (name === 'dur') return (v) => fmt.dur(v);
    return (v) => fmt.k(v) + unit;
  };
  /* fit · cut a label with … to fit px */
  const fit = (s, px) => { if (tw(s) <= px) return s; let t = s; while (t.length > 1 && tw(t + '…') > px) t = t.slice(0, -1); return t + '…'; };
  /* brk · the break mark across a run that goes on past the end of its scale (over the limit) */
  const brk = (x, y) => K.line(x - 3, y + 5, x + 1, y - 7, 'ft') + K.line(x + 1, y + 5, x + 5, y - 7, 'ft');

  /* a glide moves one number or a list of numbers (each part on the same clock) */
  const V = {
    zero: (t) => (Array.isArray(t) ? t.map(() => 0) : 0),
    same: (x, y) => (Array.isArray(x) ? Array.isArray(y) && x.length === y.length && x.every((v, i) => v === y[i]) : x === y),
    mix: (f, t, e) => (Array.isArray(t) ? t.map((v, i) => (f[i] || 0) + (v - (f[i] || 0)) * e) : f + (t - f) * e),
    dist: (f, t) => (Array.isArray(t) ? Math.max(0, ...t.map((v, i) => Math.abs(v - (f[i] || 0)))) : Math.abs(t - f)),
  };
  const media = (q) => !!(root.matchMedia && root.matchMedia(q).matches);

  /* a host too narrow for its drawing scrolls: it becomes a named Tab stop and shows the cue */
  const sized = root.ResizeObserver && new ResizeObserver((es) => es.forEach((e) => e.target.scrolls && e.target.scrolls()));

  class CalElement extends HTMLElement {
    connectedCallback() { this.render(); if (sized) sized.observe(this); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    get density() {
      const own = this.getAttribute('density');
      if (own === 'full' || own === 'compact') return own;
      /* in a table cell the marks are enough, unless a density is set around it */
      if (!this.closest('[data-density]') && this.closest('.cal-table')) return 'compact';
      return C.density(this);
    }
    surface() {
      let svg = this.querySelector(':scope > svg[data-cal]');
      if (!svg) { svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('data-cal', ''); this.prepend(svg); }
      return svg;
    }
    paint({ w, h, markup, label }) {
      const svg = this.surface();
      C.attr(svg, 'width', w); C.attr(svg, 'height', h);
      C.attr(svg, 'viewBox', `0 0 ${w} ${h}`);
      C.attr(svg, 'role', 'img');
      C.attr(svg, 'aria-label', label);
      /* shrink to fit down to 80% (legends stay readable), then scroll */
      const minW = w > 200 ? Math.round(w * 0.8) + 'px' : '';
      if (svg.style.minWidth !== minW) svg.style.minWidth = minW;
      /* each frame of a glide swaps only the parts that moved */
      C.patch(svg, `<title>${esc(label)}</title>` + markup);
    }
    scrolls() {
      const over = this.scrollWidth > this.clientWidth + 1;
      if (over === this.hasAttribute('data-scroll')) return;
      this.toggleAttribute('data-scroll', over);
      if (over) { this.tabIndex = 0; this.setAttribute('role', 'group'); this.setAttribute('aria-label', 'drawing, scrolls sideways'); }
      else ['tabindex', 'role', 'aria-label'].forEach((a) => this.removeAttribute(a));
    }
    render() { try { this.paint(this.draw(this.density === 'full')); } catch (e) { console.error(this.localName, e); } }
    disconnectedCallback() { this.halt(); if (sized) sized.unobserve(this); }

    /* ── motion · a reading glides to its new value, redrawing each frame.
       motion(target, scale) returns the value to draw now. The first reading
       sweeps up from 0 when the element scrolls into view; later changes ease
       from wherever the needle is. The clock is an empty Web Animation on the
       element, so playbackRate and DevTools slow it like CSS motion.
       Two values glide: the lead (needle, reading) and the trail (fill), which
       follows the same curve TRAIL ms later, so the line moves first and the
       bar catches up. Read the trail with this.trail.
       The target can be a number or a list of numbers (all on one clock).
       Reduced motion, print, a `still` attribute or no WAAPI: draw the value at once.
       Labels and titles must always state the target, never the frame. */
    get still() {
      return this.hasAttribute('still') || !this.animate || !root.IntersectionObserver ||
        media('(prefers-reduced-motion: reduce)') || media('print');
    }
    motion(target, scale = 1) {
      if (this._to === undefined) {
        this._to = target; this._scale = scale;
        if (this.still) return (this._at = this._tr = target);
        this._at = this._tr = V.zero(target);
        this._io = new IntersectionObserver((es) => {
          if (!es.some((e) => e.isIntersecting)) return;
          this._io.disconnect(); this._io = null; this.glide(V.zero(this._to), this._to);
        }, { threshold: 0.5 });
        this._io.observe(this);
        return this._at;
      }
      this._scale = scale;
      if (!V.same(target, this._to)) {
        this._to = target;
        if (this.still) { this.halt(); this._at = this._tr = target; }
        else if (!this._io) this.glide(this._at, target);   /* not seen yet: the sweep picks up the new target */
      }
      return this._at;
    }
    get trail() { return this._tr === undefined ? this._at : this._tr; }
    glide(from, to) {
      if (this._anim) this._anim.cancel();
      const TRAIL = 110, tFrom = this.trail, { ms, curve } = this.timing(from, to);
      const a = this.animate([], { duration: ms + TRAIL });
      this._anim = a; this._from = from;
      const ease = (e) => curve(Math.min(1, Math.max(0, e / ms)));
      const frame = () => {
        if (this._anim !== a) return;
        const e = a.currentTime || 0;
        this._at = V.mix(from, to, ease(e));
        this._tr = V.mix(tFrom, to, ease(e - TRAIL));
        const done = e >= ms + TRAIL;
        if (done) { this._at = this._tr = to; this._anim = null; }
        this.render();
        if (done) this.land();
        if (this._anim === a) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }
    /* timing · how long a glide takes and its curve. By default short hops are
       quick, a full-scale sweep takes 700ms, and it eases out: fast off the
       stop, settling on the value. An instrument can override it. */
    timing(from, to) {
      return { ms: Math.round(220 + 480 * Math.min(1, V.dist(from, to) / (this._scale || 1))), curve: (q) => 1 - Math.pow(1 - q, 3) };
    }
    /* moving · a glide is running, or the first sweep is still waiting to be seen */
    get moving() { return !!this._anim || !!this._io; }
    /* elapsed · ms into the running glide, or -1 when settled */
    get elapsed() { return this._anim ? this._anim.currentTime || 0 : -1; }
    /* land · once a glide settles, the reading blinks, hard on and off, like an
       instrument latching its value. Each off stays ~30ms (two frames at 60Hz);
       shorter and a blink can fall between frames. Marked by [data-cal-reading]. */
    land() {
      const el = this.querySelector('[data-cal-reading]');
      if (!el || !el.animate) return;
      const BLINKS = 2, OFF = 30, k = [];
      for (let i = 0; i < BLINKS; i++) { const o = i / BLINKS, h = 1 / (2 * BLINKS); k.push({ opacity: 1, offset: o }, { opacity: 0.15, offset: o + 0.001 }, { opacity: 0.15, offset: o + h }, { opacity: 1, offset: o + h + 0.001 }); }
      k.push({ opacity: 1, offset: 1 });
      el.animate(k, { duration: BLINKS * OFF * 2 });
    }
    halt() {
      if (this._anim) { this._anim.cancel(); this._anim = null; }
      if (this._io) { this._io.disconnect(); this._io = null; }
      if (this._to !== undefined) this._at = this._tr = this._to;
    }
  }

  /* ── cal-meter · a meter with a printed scale, a hatched alert zone, a needle and a boxed reading.
     The needle is ink; add `live` to light it with the lamp. Past max the needle stops at the end,
     the run breaks off in red and the box states the real value. */
  class CalMeter extends CalElement {
    static get observedAttributes() { return ['value', 'max', 'warn', 'label', 'format', 'unit', 'width', 'live', 'density']; }
    draw(full) {
      const m0 = num(this, 'max', 100), max = m0 > 0 ? m0 : 100;
      if (!(m0 > 0)) warn(this, 'needs max > 0');
      const val = Math.max(0, num(this, 'value', 0)), v = Math.min(val, max), past = val > max;
      const w0 = num(this, 'warn', max * 0.8), alert = w0 > 0 && w0 < max ? w0 : max;
      const f = formatter(str(this, 'format', 'k'), str(this, 'unit')), name = str(this, 'label', 'value');
      const wr = alert / max, al = `alert ${Math.round(wr * 100)}%`, needle = this.hasAttribute('live') ? 'lv' : 'fg';
      const label = `${name}: ${f(val)} of ${f(max)}, ${fmt.pct(val / max, 1)}`
        + (past ? `, over by ${f(val - max)}` : wr < 1 ? (v > alert ? `, past the alert at ${fmt.pct(wr)}` : `, alert at ${fmt.pct(wr)}`) : '');
      /* draw the gliding value (the needle stops at max); once landed the reading states the real one */
      const at = this.motion(v, max), r = at / max, landed = at === v && !this.moving;
      const shown = landed ? val : Number.isInteger(val) ? Math.round(at) : at;
      const read = (x) => `${f(x)} / ${f(max)} · ${fmt.pct(x / max, 1)}`, reading = read(shown);
      const H = K.hatch('ft', 4, 0.55);
      const fr = this.trail / max, over = (wr < 1 && r > wr) || (past && landed);   /* the fill trails the needle */
      const meter = (x0, x1, y, labels) => {
        const X = (q) => x0 + q * (x1 - x0), ends = x1 - x0 < 200; let s = '';
        /* the alert label sits above the scale numbers; drop a number it would touch */
        const alertW = labels && wr < 1 ? tw(al) : 0;
        for (let i = 0; i <= 10; i++) {
          const M = i % 5 === 0, x = X(i / 10);
          s += K.line(x, y - 6, x, y - (M ? 18 : 12), M ? 'fa' : 'ed');
          if (!labels || !M || (ends && i === 5)) continue;
          const txt = i === 10 ? '100%' : String(i * 10), a = i === 0 ? 'start' : i === 10 ? 'end' : 'middle';
          if (alertW && i === 5 && Math.abs(X(wr) - x) < (alertW + tw(txt)) / 2 + 6) continue;
          s += K.t(x, y - 24, txt, KY, a);
        }
        if (wr < 1) s += `<rect x="${X(wr)}" y="${y - 5}" width="${X(1) - X(wr)}" height="5" fill="${H.url}"/>`;
        /* the fill is ink up to the alert line and red only for the part past it */
        s += K.line(x0, y, x1, y, 'fa') + K.rect(x0, y - 4, X(Math.min(fr, wr)) - x0, 4, 'fg', 'none');
        if (wr < 1 && fr > wr) s += K.rect(X(wr), y - 4, X(fr) - X(wr), 4, 'ft', 'none');
        if (past && landed) s += K.rect(x1, y - 4, 8, 4, 'ft', 'none') + brk(x1 + 12, y - 2);
        s += K.line(X(r), y - 18, X(r), y + 2, needle, { w: 1.6 });
        return s;
      };
      if (full) {
        const w = num(this, 'width', 420), x0 = 4, x1 = w - 30, y = 44, X = (q) => x0 + q * (x1 - x0);
        let g = H.def + meter(x0, x1, y, true);
        if (wr < 1) {
          /* keep the alert label inside the drawing near either end */
          const half = tw(al) / 2, ax = Math.min(Math.max(X(wr), x0 + half), w - half - 2);
          g += K.line(X(wr), y - 30, X(wr), y, 'ft', { opacity: 0.7 }) + K.t(ax, y - 34, al, 'ft', 'middle');
        }
        /* box to the side the final value takes. Gliding toward a left box, ride on the
           right until there is room, so the box swaps sides once and early. A box too
           wide for either side widens the drawing instead of leaving it */
        const bw = Math.max(K.boxWidth(name, reading), K.boxWidth(name, read(val))), nx = X(r), fx = X(v / max);   /* no width wobble mid-glide */
        const right = fx + 14 + bw <= w - 2 || fx - 14 - bw < 2;
        const bx = right ? nx + 14 : Math.max(2, nx - 14 - bw), lx = right ? bx : bx + bw;
        g += K.leader([[nx, y + 4], [nx, y + 24], [lx, y + 24]], false) + `<g data-cal-reading>${K.box(bx, y + 8, bw, name, reading, over ? 'ft' : 'fg')}</g>`;
        return { w: right ? Math.max(w, fx + 14 + bw + 2) : w, h: y + 44, markup: g, label };
      }
      const mw = num(this, 'width', 144), y = 22, vs = f(shown), ms = '/' + f(max), gap = past ? 24 : 10;
      const vw = Math.max(tw(vs), tw(f(val))), w = mw + gap + vw + tw(ms) + 2;   /* width from the widest, so the row doesn't reflow */
      const g = H.def + meter(1, mw, y, false) + `<g data-cal-reading>${K.t(mw + gap + vw, y + 1, vs, over ? 'ft' : 'fg', 'end') + K.t(mw + gap + vw, y + 1, ms, KY)}</g>`;
      return { w, h: y + 4, markup: g, label };
    }
  }

  /* ── cal-position · "3 of 7" as ticks; above 24 items a scale with a marker */
  class CalPosition extends CalElement {
    static get observedAttributes() { return ['index', 'count', 'label', 'width', 'density']; }
    draw(full) {
      const c = Math.round(num(this, 'count', 1)), name = str(this, 'label'), top = full && name ? 18 : 0;
      if (c < 1) {
        const g = (top ? K.t(0, 11, name, KY) : '') + K.t(0, top + 14, 'none', KY);
        return { w: Math.max(tw('none'), top ? tw(name) : 0) + 2, h: top + 20, markup: g, label: `${name ? name + ': ' : ''}none` };
      }
      const n = c, i = Math.min(n, Math.max(1, Math.round(num(this, 'index', 1))));
      const label = `${name ? name + ': ' : ''}${i} of ${n}`;
      /* the marker glides between items (0-based, fractional mid-glide); the
         ticks it passes darken as the trail goes by; the reading counts through */
      const clamp = (q) => Math.min(n - 1, Math.max(0, q));
      const p = clamp(this.motion(i - 1, Math.max(1, n - 1))), t = clamp(this.trail);
      const read = `${Math.round(p) + 1}/${n}`, cw = K.countWidth(`${n}/${n}`);   /* widest reading, so nothing reflows */
      let g = '', x1, y = top + 10;
      if (n <= 24) {
        const step = n > 12 ? 10 : 16, x0 = 5, sx = x0 + p * step; x1 = x0 + (n - 1) * step;
        g += K.line(x0, y, x1, y, 'e1');
        for (let k = 0; k < n; k++) { const x = x0 + k * step; if (Math.abs(x - sx) >= 5) g += K.line(x, y - 4, x, y + 4, k < t - 0.5 ? 'mu' : 'fa'); }
        g += K.rect(sx - 4, y - 4, 8, 8, 'fg', 'none');
        x1 += 5;
      } else {
        /* a major tick every round step, about 8 of them, so a long list stays a scale */
        const x0 = 5; x1 = num(this, 'width', 160); const X = K.scale(x0, x1, 1, n);
        const major = Math.max(10, nice(n / 8)), minor = major / 5;
        g += K.line(x0, y, x1, y, 'fa');
        for (let v = 0; v <= n; v += minor) if (v >= 1 || v === 0) { const xx = X(Math.max(1, v)), M = v % major === 0; g += K.line(xx, y, xx, y + (M ? 5 : 3), M ? 'fa' : 'ed'); }
        g += `<path d="M${X(p + 1).toFixed(2)} ${y - 2}l-4 -7h8z" style="fill:var(--fg)"/>`;
      }
      if (full) {
        if (name) g += K.t(0, 11, name, KY);
        g += `<g data-cal-reading>${K.count(x1 + 10, y, read)}</g>`;
        return { w: Math.max(x1 + 12 + cw, name ? tw(name) + 2 : 0), h: y + 10, markup: g, label };
      }
      /* compact keeps a bare reading beside the marks */
      g += `<g data-cal-reading>${K.t(x1 + 8, y + 4, read, KY)}</g>`;
      return { w: x1 + 10 + tw(`${n}/${n}`), h: y + 10, markup: g, label };
    }
  }

  /* ── cal-progress · steps as nodes: done ■, to do □, needs you ■ (fault), running ✦ (the lamp star).
     One lamp: only the first running step is lit. */
  class CalProgress extends CalElement {
    static get observedAttributes() { return ['states', 'done', 'total', 'live', 'fault', 'live-label', 'fault-label', 'done-label', 'step', 'density']; }
    /* steps fill at one even pace, 50ms each, however far the jump */
    timing(from, to) { return { ms: Math.max(150, Math.round(Math.abs(to - from) * 50)), curve: (q) => q }; }
    states() {
      const s = this.hasAttribute('states') ? str(this, 'states').split(/[\s,]+/).filter(Boolean)
        : K.states(num(this, 'total', 1), num(this, 'done', 0), num(this, 'live', 0) - 1, num(this, 'fault', 0) - 1);
      const first = s.indexOf('live');
      return s.map((x, i) => (x === 'live' && i !== first ? 'todo' : x));
    }
    draw(full) {
      const fin = this.states(), n = fin.length, step = num(this, 'step', n > 30 ? Math.max(10, Math.floor(540 / n)) : 18);
      const done = fin.filter((s) => s === 'done').length, live = fin.indexOf('live'), fault = fin.indexOf('fault');
      /* motion · the live star leads, stepping node to node; done squares latch
         behind it on the trail; a fault shows once the glide lands. A states=""
         list can be any shape, so it draws at once. */
      let st = fin, shown = done, landed = true;
      if (!this.hasAttribute('states')) {
        const p = this.motion(done, n), t = this.trail, ql = Math.floor(p + 1e-6), qf = Math.floor(t + 1e-6);
        landed = p === done && t === done; shown = ql;
        if (!landed) {
          const star = live >= 0 ? Math.min(n - 1, ql + live - done) : -1;
          st = fin.map((_, k) => (k < qf && k !== star ? 'done' : k === star ? 'live' : 'todo'));
          /* filled squares being added or removed flicker until the count
             settles: every other 30ms they show empty. Empty ones hold still. */
          const from = this._from === undefined ? 0 : this._from, lo = Math.min(from, done), hi = Math.max(from, done);
          if (Math.floor(Math.max(0, this.elapsed) / 30) % 2 === 1)
            st = st.map((s, k) => (k >= lo && k < hi && s === 'done' ? 'todo' : s));
        }
      }
      const ll = str(this, 'live-label'), dl = str(this, 'done-label'), fl = str(this, 'fault-label', 'needs you');
      /* shift right if the done label is wider than the run it measures */
      const x0 = Math.max(9, full && dl && done >= 1 ? tw(dl) / 2 + 2 - (done - 1) * step / 2 : 9);
      const top = full && dl ? 30 : 0, y = top + 10, x1 = x0 + (n - 1) * step;
      let g = K.nodes(x0, y, step, st, { size: 8 });
      const read = `${shown}/${n}`;
      let w = x1 + 10, h = y + 12;
      if (full) {
        /* fixed at the final run: the nodes fill into it. One done step gets the label over its node */
        if (dl && done > 1) g += K.dim(x0, x0 + (done - 1) * step, y - 18, dl);
        else if (dl && done === 1) g += K.line(x0, y - 14, x0, y - 7, 'fa') + K.t(x0, y - 18, dl, 'mu', 'middle');
        g += `<g data-cal-reading>${K.count(x1 + 16, y, read, landed && n > 0 && done === n ? 'ok' : 'fg')}</g>`;
        w = x1 + 18 + K.countWidth(`${n}/${n}`);   /* widest reading, so nothing reflows */
        /* caption centred under its node, clamped so it never leaves the drawing; a second
           caption takes the row below */
        const caption = (i, text, ink, show, row) => {
          const half = tw(text) / 2, cx = Math.max(half, x0 + i * step), cy = y + 24 + row * 14;
          if (show) g += K.leader([[x0 + i * step, y + 6], [x0 + i * step, cy - 12]], false) + K.t(cx, cy, text, ink, 'middle');
          w = Math.max(w, cx + half + 2); h = Math.max(h, cy + 4);   /* room kept while hidden */
        };
        const lit = live >= 0 && ll;
        if (lit) caption(live, ll, 'lv', true, 0);
        if (fault >= 0) caption(fault, fl, 'ft', landed, lit ? 1 : 0);
        if (dl && done >= 1) w = Math.max(w, x0 + (done - 1) * step / 2 + tw(dl) / 2 + 2);
      } else {
        g += `<g data-cal-reading>${K.t(x1 + 12, y + 4, read, KY)}</g>`;
        w = x1 + 14 + tw(`${n}/${n}`);
      }
      const label = `${done} of ${n} done${dl ? ` (${dl})` : ''}`
        + (live >= 0 ? `, step ${live + 1} running${ll ? ` (${ll})` : ''}` : '') + (fault >= 0 ? `, step ${fault + 1}: ${fl}` : '');
      return { w, h, markup: g, label };
    }
  }

  /* ── cal-diff · added to the right, removed to the left of a centre tick; log past the knee.
     The name column is a fixed width (name-width, default 64), so a column of diffs shares one
     centre line; a longer name is cut with … and led to its bars by a dotted line. */
  class CalDiff extends CalElement {
    static get observedAttributes() { return ['added', 'removed', 'knee', 'max', 'label', 'name-width', 'density']; }
    draw(full) {
      const a = Math.max(0, num(this, 'added', 0)), r = Math.max(0, num(this, 'removed', 0)), name = str(this, 'label');
      const k0 = num(this, 'knee', 200), knee = k0 > 0 ? k0 : 200, m0 = num(this, 'max', 100000), max = m0 > knee ? m0 : knee * 10;
      const span = 130, kneePx = 50, decades = Math.log10(max / knee);
      const F = (v) => (v <= 0 ? 0 : v <= knee ? v / knee * kneePx : kneePx + Math.min(1, Math.log10(v / knee) / decades) * (span - kneePx));
      const inv = (px) => (px <= kneePx ? px / kneePx * knee : knee * Math.pow(10, (px - kneePx) / (span - kneePx) * decades));
      /* motion · both bars glide in drawn length (so the log part grows as evenly
         as the linear part). The end ticks and numbers lead, counting through the
         values they pass; the bars trail 110ms behind; the numbers blink on landing. */
      const [pa, pr] = this.motion([F(a), F(r)], span), [ta, tr] = this.trail;
      const landed = pa === F(a) && pr === F(r);
      const shownA = landed ? a : Math.round(inv(pa)), shownR = landed ? r : Math.round(inv(pr));
      const la = '+' + fmt.k(shownA), lr = '−' + fmt.k(shownR);
      /* fixed side widths so a column of diffs shares one centre line */
      const side = full ? span + 10 + Math.max(tw('+000.0k'), tw('+' + fmt.k(a)), tw('−' + fmt.k(r))) : span + 4;
      const nameW = full && name ? Math.max(24, num(this, 'name-width', 64)) : 0, nm = nameW ? fit(name, nameW - 12) : '';
      const cx = nameW + side, y = 12, w = cx + side, on = (px) => px > 0.05;
      let g = '';
      [cx - kneePx, cx + kneePx].forEach((x) => { g += K.line(x, y - 9, x, y + 9, 'ed', { dash: '1 3' }); });
      g += K.line(cx, y - 7, cx, y + 7, 'fa');
      if (on(ta)) g += K.line(cx, y, cx + ta, y, 'ok', { w: 2 });
      if (on(pa)) g += K.line(cx + pa, y - 4, cx + pa, y + 4, 'ok');
      if (on(tr)) g += K.line(cx - tr, y, cx, y, 'ft', { w: 2 });
      if (on(pr)) g += K.line(cx - pr, y - 4, cx - pr, y + 4, 'ft');
      /* past max the bar breaks off before its end tick */
      if (landed && a > max) g += brk(cx + span - 8, y);
      if (landed && r > max) g += brk(cx - span + 6, y);
      const label = `${name ? name + ': ' : ''}${a} lines added, ${r} removed` + (a > max || r > max ? `, beyond the scale at ${fmt.k(max)}` : '');
      if (full) {
        let txt = '';
        if (on(pa)) txt += K.t(cx + pa + 8, y + 4, la, 'ok');
        if (on(pr)) txt += K.t(cx - pr - 8, y + 4, lr, 'ft', 'end');
        if (txt) g += `<g data-cal-reading>${txt}</g>`;
        if (!a && !r && !on(pa) && !on(pr)) g += K.t(cx + 8, y + 4, 'no changes', KY);
        if (nm) {
          const x0 = tw(nm) + 6, x1 = cx - (on(pr) ? pr + 14 + tw(lr) : 6);
          g += K.t(0, y + 4, nm, KY) + (x1 - x0 > 8 ? K.line(x0, y, x1, y, 'fa', { dash: '1 3' }) : '');
        }
      } else {
        /* compact: the bare counts after the marks */
        const s = `+${fmt.k(shownA)} −${fmt.k(shownR)}`;
        g += `<g data-cal-reading>${K.t(w + 6, y + 4, s, KY)}</g>`;
        return { w: w + 8 + Math.max(tw(s), tw(`+${fmt.k(a)} −${fmt.k(r)}`)), h: 24, markup: g, label };
      }
      return { w, h: 24, markup: g, label };
    }
  }


  /* ── cal-durations · several runs on one shared ruler; a live run is lit by the lamp and grows a
     dashed tail. One lamp: only the first live span is lit; a run past max breaks off in red. */
  class CalSpan extends HTMLElement {
    static get observedAttributes() { return ['name', 'value', 'start', 'end', 'live']; }
    attributeChangedCallback() { const p = this.closest('cal-durations'); if (p && p.isConnected && p.render) p.render(); }
  }
  class CalDurations extends CalElement {
    static get observedAttributes() { return ['max', 'unit', 'width', 'density']; }
    connectedCallback() {
      super.connectedCallback();
      const isSpan = (n) => n.nodeType === 1 && n.localName === 'cal-span';
      this._mo = new MutationObserver((ms) => { if (ms.some((m) => [...m.addedNodes, ...m.removedNodes].some(isSpan))) this.render(); });
      this._mo.observe(this, { childList: true });
    }
    disconnectedCallback() { super.disconnectedCallback(); if (this._mo) this._mo.disconnect(); clearInterval(this._tick); this._tick = null; }
    /* grow · seconds a ticking span has run since this element first drew.
       Motion glides each span's length as of that moment (its base), and the
       ticking part is added on top, so the clock never starts a glide but a
       new start or value does. */
    spans() {
      const now = Date.now();
      if (this._t0 === undefined) this._t0 = now;
      return [...this.querySelectorAll(':scope > cal-span')].map((s) => {
        const start = num(s, 'start', NaN), end = num(s, 'end', NaN);
        let v = num(s, 'value', NaN), base;
        if (!Number.isFinite(v) && Number.isFinite(start)) {
          v = ((Number.isFinite(end) ? end : now) - start) / 1000;
          /* the base must come out identical every frame, or each frame
             reads as a new target and restarts the glide */
          if (!Number.isFinite(end)) base = Math.max(0, this._t0 - start) / 1000;
        }
        v = Math.max(0, v || 0);
        if (base === undefined) base = v;
        return { name: str(s, 'name'), v, base, grow: Math.max(0, v - base), live: s.hasAttribute('live') };
      });
    }
    render() {
      super.render();
      const ticking = [...this.querySelectorAll(':scope > cal-span[live][start]')].length > 0;
      if (ticking && !this._tick) this._tick = setInterval(() => this.isConnected ? CalElement.prototype.render.call(this) : clearInterval(this._tick), 1000);
      if (!ticking && this._tick) { clearInterval(this._tick); this._tick = null; }
    }
    draw(full) {
      const rows = this.spans(), u = str(this, 'unit', 'm'), unit = u === 'h' || u === 's' ? u : 'm', div = unit === 'h' ? 3600 : unit === 's' ? 1 : 60;
      const longest = Math.max(1, ...rows.map((r) => r.v / div));
      /* auto scale: the smallest round major that fits the longest run in 2–5 majors */
      const major = [1, 2, 5, 10, 15, 20, 30, 60, 120, 300, 600].find((m) => longest / m <= 5) || 1200;
      const max = num(this, 'max', Math.ceil(longest / major) * major);
      /* names take at most 30% of the width, cut with … past that, so the ruler keeps its room */
      const w = num(this, 'width', 480), names = rows.map((r) => fit(r.name, w * 0.3));
      const nameW = Math.max(40, ...names.map((s) => tw(s))) + 16;
      const valW = 70, x0 = nameW, x1 = w - valW - (full ? 48 : 10), X = K.scale(x0, x1, 0, max);
      let g = '', y0;
      if (full) {
        const step = max <= 20 ? 1 : max <= 60 ? 5 : 10, lab = (v) => v + unit;
        /* number every major and always the end of the scale */
        const every = [5, 4, 2, 1].find((e) => max % (step * e) === 0 && max / (step * e) <= 6) || 5;
        g += K.ruler(x0, x1, 22, max, step, every, lab, true);
        if (max % (step * every)) g += K.line(x1, 22, x1, 16, 'fa') + K.t(x1, 12, lab(max), KY, 'middle');
        y0 = 44;
      } else y0 = 10;
      const gap = full ? 22 : 14, lamp = rows.findIndex((r) => r.live);
      /* motion · bars grow out from the start line and glide to new values. A
         ticking span glides by its base (see spans), so a new start glides but
         the tick every second just redraws, without a glide or a blink. The end
         tick, star and time lead; the bar trails 110ms behind. */
      const at = this.motion(rows.map((r) => r.base), max * div), tr = this.trail;
      const len = (r, q) => q + r.grow;
      let txt = '';
      rows.forEach((r, i) => {
        const v = len(r, at[i] || 0), y = y0 + i * gap, xe = X(Math.min(max, v / div)), xt = X(Math.min(max, len(r, tr[i] || 0) / div));
        const lit = r.live && i === lamp, c = lit ? 'lv' : full ? 'fg' : 'mu', lab = fmt.dur(this.moving ? Math.round(v) : r.v);
        g += K.t(x0 - 10, y + 4, names[i], 'fg', 'end');
        if (xt > x0) g += K.line(x0, y, xt, y, c, { w: full ? 1.6 : 1.3 });
        if (full) g += K.line(x0, y - 4, x0, y + 4, 'fa');
        if (!this.moving && r.v / div > max) g += brk(x1 - 6, y);
        if (r.live) {
          g += K.line(xe, y, full ? xe + 40 : Math.min(xe + 40, x1), y, 'fa', { dash: '2 3' });
          if (full) g += lit ? K.node(xe, y, 'live') : K.line(xe, y - 4, xe, y + 4, 'fg');
          txt += K.t(full ? xe + 48 : x1 + 10, y + 4, lab, lit ? 'lv' : 'mu');
        } else {
          if (full) g += K.line(xe, y - 4, xe, y + 4, 'fg');
          txt += K.t(full ? xe + 8 : x1 + 10, y + 4, lab, 'mu');
        }
      });
      g += `<g data-cal-reading>${txt}</g>`;
      const label = 'Durations: ' + (rows.length ? rows.map((r) => `${r.name || 'run'} ${r.live ? 'running for' : 'took'} ${fmt.dur(r.v)}${r.v / div > max ? ' (past the scale)' : ''}`).join('; ') : 'none');
      return { w, h: y0 + (Math.max(1, rows.length) - 1) * gap + 12, markup: g, label };
    }
  }

  /* ── cal-ruler · a standalone scale. With value="…" a lamp marker sits on it and its value is
     boxed on a short leader (full density); a value past either end pins the marker and boxes the
     real value in red. Compact drops the numbers and the box. */
  class CalRuler extends CalElement {
    static get observedAttributes() { return ['min', 'max', 'step', 'every', 'unit', 'width', 'up', 'value', 'density']; }
    draw(full) {
      let min = num(this, 'min', 0), max = num(this, 'max', 100);
      if (min > max) { warn(this, 'has min > max; drawn swapped'); [min, max] = [max, min]; }
      if (!(max > min)) { warn(this, 'needs max > min'); max = min + 1; }
      /* never more than 200 ticks: a step that small widens to a round one */
      let step = num(this, 'step', (max - min) / 10);
      if (!(step > 0)) { warn(this, 'needs step > 0'); step = (max - min) / 10; }
      if ((max - min) / step > 200) { warn(this, 'step too small for the range; widened'); step = nice((max - min) / 100); }
      let every = Math.max(1, Math.round(num(this, 'every', 5)));
      const unit = str(this, 'unit'), w = num(this, 'width', 320), up = this.hasAttribute('up');
      const f = (v) => (v === 0 ? '0' : (Math.abs(v) >= 10000 ? fmt.k(v) : String(Math.round(v * 100) / 100)) + unit), marked = this.hasAttribute('value');
      /* the marker (and its box) sit on the side away from the numbers; leave room for them and for the last number */
      const mk = marked ? 12 + (full ? 22 : 0) : 0, y = up ? 22 : 4 + mk, x0 = 6, x1 = w - Math.max(8, tw(f(max)) / 2 + 2);
      /* numbers never closer than the widest one and a gap: number every 2nd, 4th … major instead */
      const room = (x1 - x0) / (Math.max(tw(f(min)), tw(f(max))) + 12);
      while ((max - min) / (step * every) > Math.max(1, room)) every *= 2;
      let g = K.ruler(x0, x1, y, max, step, every, full ? f : () => '', up, min), label = `Scale from ${f(min)} to ${f(max)}`;
      if (marked) {
        /* motion · the marker sweeps in from min when half in view, then glides
           to new values on the shared clock and blinks twice on landing. */
        const raw = num(this, 'value', min), X = K.scale(x0, x1, min, max), v = Math.min(max, Math.max(min, raw)), beyond = raw !== v;
        const at = min + this.motion(v - min, max - min), mx = X(at), landed = at === v && !this.moving;
        let m = `<path d="M${mx.toFixed(2)} ${up ? y + 2 : y - 2}l-5 ${up ? 9 : -9}h10z" style="fill:var(--live)"/>`;
        if (full) {
          const s = f(landed ? raw : at), cw = K.countWidth(s), bx = Math.min(Math.max(0, mx - cw / 2), w - cw - 1), by = up ? y + 23 : y - 23;
          m += K.line(mx, up ? y + 11 : y - 11, mx, up ? y + 15 : y - 15, 'fa') + K.count(bx, by, s, landed && beyond ? 'ft' : 'fg');
        }
        g += `<g data-cal-reading>${m}</g>`;
        label += `, marker at ${f(v)}` + (beyond ? `, the value ${f(raw)} is beyond the scale` : '');
      }
      return { w, h: up ? y + 8 + mk : y + 22, markup: g, label };
    }
  }

  define('cal-meter', CalMeter);
  define('cal-position', CalPosition);
  define('cal-progress', CalProgress);
  define('cal-diff', CalDiff);
  define('cal-span', CalSpan);
  define('cal-durations', CalDurations);
  define('cal-ruler', CalRuler);
  }

  /* redraw every instrument when any [data-density] changes */
  const ALL = 'cal-meter,cal-position,cal-progress,cal-diff,cal-durations,cal-ruler';
  const redraw = (scope = document) => scope.querySelectorAll(ALL).forEach((el) => el.render && el.render());
  if (FIG) {
    new MutationObserver((ms) => { if (ms.some((m) => m.attributeName === 'data-density')) redraw(); })
      .observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-density'] });
    /* redraw once fonts are in, so measured boxes fit */
    C.ready(() => redraw());
    /* print and PDF: every instrument shows its final value, seen or not */
    root.addEventListener('beforeprint', () => document.querySelectorAll(ALL).forEach((el) => { if (el.halt) { el.halt(); el.render(); } }));
  }

  /* boxed counts: <span class="cal-count" data-n="3" data-noun="places">; add data-pad="2" to
     zero-pad a count that changes live, so the layout doesn't jump. Long counts are grouped
     (1 234 567); an empty data-n leaves the markup as written. */
  function counts(scope = document) {
    scope.querySelectorAll('.cal-count[data-n]').forEach((el) => {
      const n = String(el.dataset.n).trim(); if (n === '') return;
      const pad = parseInt(el.dataset.pad || '1', 10), shown = /^\d{5,}$/.test(n) ? group(+n) : n.padStart(pad, '0');
      el.innerHTML = `<b>${esc(shown)}</b>` + (el.dataset.noun ? `<span>${esc(el.dataset.noun)}</span>` : '');
      el.setAttribute('role', 'img');   /* so the label is read, not "zero three" */
      el.setAttribute('aria-label', `${n} ${el.dataset.noun || ''}`.trim());
    });
  }
  /* sheet zones: <div class="cal-sheet" data-zones="8x6"> gets numbered columns
     (top and bottom) and lettered rows (left and right), as on a drawing sheet. */
  function sheets(scope = document) {
    scope.querySelectorAll('.cal-sheet[data-zones]').forEach((el) => {
      el.querySelectorAll(':scope > .zones').forEach((z) => z.remove());
      const [c, r] = String(el.dataset.zones).split(/x/i).map((n) => Math.max(1, Math.min(26, parseInt(n, 10) || 1)));
      const cols = Array.from({ length: c }, (_, i) => `<span>${i + 1}</span>`).join('');
      const rows = Array.from({ length: r }, (_, i) => `<span>${String.fromCharCode(65 + i)}</span>`).join('');
      el.insertAdjacentHTML('afterbegin',
        `<div class="zones top" aria-hidden="true">${cols}</div><div class="zones bottom" aria-hidden="true">${cols}</div>`
        + `<div class="zones left" aria-hidden="true">${rows}</div><div class="zones right" aria-hidden="true">${rows}</div>`);
    });
  }


  /* ── cal-spin · the braille ring spinner: eight dots round an empty centre, the lamp head
     stepping clockwise with two ink dots behind (the CSS steps it). size="sm" draws it at text
     size; label="…" names what is loading (default "Loading"). */
  class CalSpin extends HTMLElement {
    static get observedAttributes() { return ['size', 'label']; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      const sm = this.getAttribute('size') === 'sm', label = this.getAttribute('label') || 'Loading';
      if (!this.hasAttribute('role')) this.setAttribute('role', 'status');
      this.setAttribute('aria-label', label);
      this.innerHTML = `<span class="cal-spin${sm ? ' sm' : ''}" aria-hidden="true">${'<i></i>'.repeat(8)}</span>`;
    }
  }
  define('cal-spin', CalSpin);

  /* ── cal-elapsed · the readout's clock: mm:ss.t since it was added (or since="<epoch ms>"),
     stepping every 100 ms, whole seconds under reduced motion. It stops when it gets `stopped`
     or its .cal-readout takes data-ink, and keeps the final time. While it runs it is hidden
     from screen readers, so a status line around it isn't read out ten times a second. */
  const clocks = new Set();
  let clockTimer = 0;
  const clock = (ms, whole) => {
    const t = Math.max(0, Math.floor(ms / 100)), m = String(Math.floor(t / 600)).padStart(2, '0'), r = (t % 600) / 10;
    return `${m}:${whole ? String(Math.floor(r)).padStart(2, '0') : r.toFixed(1).padStart(4, '0')}`;
  };
  class CalElapsed extends HTMLElement {
    static get observedAttributes() { return ['since', 'stopped']; }
    connectedCallback() {
      if (!this.t0) this.t0 = num(this, 'since', Date.now());
      clocks.add(this); this.tick();
      if (!clockTimer) clockTimer = setInterval(() => clocks.forEach((c) => c.tick()), 100);
    }
    disconnectedCallback() { clocks.delete(this); if (!clocks.size) { clearInterval(clockTimer); clockTimer = 0; } }
    attributeChangedCallback(n) { if (n === 'since') this.t0 = num(this, 'since', this.t0 || Date.now()); if (this.isConnected) this.tick(); }
    tick() {
      const run = !this.hasAttribute('stopped') && !this.closest('.cal-readout[data-ink]');
      if (run) { this.setAttribute('aria-hidden', 'true'); this.textContent = clock(Date.now() - this.t0, !!root.matchMedia?.('(prefers-reduced-motion: reduce)').matches); }
      else { this.removeAttribute('aria-hidden'); if (!this.textContent) this.textContent = clock(0); }
    }
  }
  define('cal-elapsed', CalElapsed);

  /* ── controls · the few CSS parts that need a hand. Listeners sit on the document, so
     parts added later work too; controls(scope) paints their resting state (call it after
     inserting markup, like counts()). */
  /* numbers as written in a .cal-num field: grouped with spaces, '.' for decimals */
  const parseNum = (s) => { const t = String(s).replace(/[\s\u00a0\u202f]/g, ''); return /^-?(\d+\.?\d*|\.\d+)$/.test(t) ? parseFloat(t) : NaN; };
  const decimals = (x) => (String(x).split('.')[1] || '').length;
  const groupNum = (v, d = 0) => { const [i, f] = Math.abs(v).toFixed(d).split('.'); return (v < 0 ? '-' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (f ? '.' + f : ''); };
  /* a polite live node inside el, for short announcements */
  const say = (el, text) => {
    let n = el.querySelector(':scope > .cal-sr[aria-live]');
    if (!n) { n = document.createElement('span'); n.className = 'cal-sr'; n.setAttribute('aria-live', 'polite'); el.append(n); }
    n.textContent = ''; setTimeout(() => { n.textContent = text; }, 30);
  };
  const fileSize = (b) => (b >= 1e6 ? (b / 1e6).toFixed(1) + ' MB' : b >= 1e3 ? Math.round(b / 1e3) + ' KB' : b + ' B');

  /* textarea · .cal-term[data-max] > .cal-textarea + .bar (.mode, .pos, .cal-count > b) */
  function term(box) {
    const ta = box.querySelector('.cal-textarea'); if (!ta) return;
    const max = parseInt(box.dataset.max, 10), n = ta.value.length, over = max > 0 && n > max;
    const b = box.querySelector('.cal-count b'), cnt = box.querySelector('.cal-count');
    if (b) b.textContent = box.dataset.status === 'editor' ? String(n).padStart(String(max || n).length, '0') : String(n);
    if (cnt) cnt.dataset.ink = over ? 'fault' : '';
    box.toggleAttribute('data-over', over);
    ta.setAttribute('aria-invalid', String(over));
    const pos = box.querySelector('.pos');
    if (pos) { const before = ta.value.slice(0, ta.selectionStart).split('\n'); pos.textContent = `ln ${before.length}, col ${before[before.length - 1].length + 1}`; }
    const mode = box.querySelector('.mode');
    if (mode) mode.textContent = document.activeElement === ta ? '-- insert --' : '-- normal --';
    box.dispatchEvent(new CustomEvent('cal-count', { detail: { length: n, max, over } }));
  }
  /* detent · .cal-detent > .mk + label > input[type=radio]: the marker glides over the chosen tick */
  function detent(g) {
    g.classList.add('js');
    const ls = g.querySelectorAll('label'), mid = (l) => l.offsetLeft + l.offsetWidth / 2;
    if (ls.length) { g.style.setProperty('--r0', mid(ls[0]) + 'px'); g.style.setProperty('--r1', g.clientWidth - mid(ls[ls.length - 1]) + 'px'); }
    const l = g.querySelector('label:has(:checked)'); if (!l) return;
    g.style.setProperty('--x', mid(l) + 'px');
  }
  /* range · .cal-range > output + input[type=range]: --p and the boxed reading */
  function range(w) {
    const r = w.querySelector('input[type="range"]'); if (!r) return;
    const min = +r.min || 0, max = r.max === '' ? 100 : +r.max, unit = w.dataset.unit ?? '', p = (r.value - min) / (max - min || 1);
    w.classList.add('js');
    w.style.setProperty('--p', p);
    const o = w.querySelector('output');
    if (o) {
      o.textContent = r.value + unit;
      /* keep the box inside the control; the leader stays on the handle */
      const W = w.clientWidth, x = 6.5 + (W - 13) * p, half = o.offsetWidth / 2, ox = W ? Math.min(Math.max(x, half), W - half) : x;
      w.style.setProperty('--ox', ox + 'px'); w.style.setProperty('--lx', x - ox + 'px');
    }
    r.setAttribute('aria-valuetext', r.value + unit);
  }
  /* file drop · label.cal-drop > input[type=file], listing into the .cal-rows named by data-list.
     A file over data-max bytes, or not matching the input's accept, is flagged in red. The list
     is a polite live region, so the result is read out. */
  const accepts = (input, f) => {
    const a = (input?.accept || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
    if (!a.length) return true;
    const name = f.name.toLowerCase(), type = (f.type || '').toLowerCase();
    return a.some((x) => (x.startsWith('.') ? name.endsWith(x) : x.endsWith('/*') ? type.startsWith(x.slice(0, -1)) : type === x));
  };
  function listFiles(z, files) {
    const list = z.dataset.list && document.getElementById(z.dataset.list); if (!list) return;
    const max = parseFloat(z.dataset.max) || Infinity, input = z.querySelector('input[type="file"]');
    if (!list.hasAttribute('aria-live')) list.setAttribute('aria-live', 'polite');
    list.replaceChildren(...[...files].map((f) => {
      const r = document.createElement('div'), big = f.size > max, odd = !accepts(input, f);
      r.className = 'file' + (big || odd ? ' bad' : '');
      r.innerHTML = '<span></span><span class="lg"></span>';
      r.children[0].textContent = f.name;
      r.children[1].textContent = fileSize(f.size) + (odd ? ' · type not accepted' : '') + (big ? ` · over ${fileSize(max)}` : '');
      if (!big && !odd) r.children[1].classList.add('mut');
      return r;
    }));
  }
  /* tag input · .cal-chips > .chip* + input: Enter or comma adds, Backspace on empty removes, a repeat lights the original */
  function addChip(box, v) {
    const input = box.querySelector('input');
    const dup = [...box.querySelectorAll('.chip')].find((c) => c.firstChild.textContent.trim().toLowerCase() === v.toLowerCase());
    if (dup) { dup.classList.add('dup'); setTimeout(() => dup.classList.remove('dup'), 900); say(box, `${v} is already added`); return; }
    const c = document.createElement('span'), x = document.createElement('button');
    c.className = 'chip'; c.append(v);
    x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'Remove ' + v); c.append(x);
    box.insertBefore(c, input);
    say(box, `Added ${v}`);
    box.dispatchEvent(new CustomEvent('cal-chips', { bubbles: true, detail: { values: chipValues(box) } }));
  }
  const chipValues = (box) => [...box.querySelectorAll('.chip')].map((c) => c.firstChild.textContent.trim());

  /* number · .cal-num input[data-step] is a spinbutton: value, min, max and the value with its unit */
  function spin(t) {
    const v = parseNum(t.value), unit = t.closest('.cal-affixed')?.querySelector('.cal-affix')?.textContent.trim();
    t.setAttribute('role', 'spinbutton');
    if (t.dataset.min !== undefined) t.setAttribute('aria-valuemin', t.dataset.min); else t.setAttribute('aria-valuemin', '0');
    if (t.dataset.max !== undefined) t.setAttribute('aria-valuemax', t.dataset.max);
    if (Number.isFinite(v)) { t.setAttribute('aria-valuenow', v); t.setAttribute('aria-valuetext', t.value.trim() + (unit ? ' ' + unit : '')); }
    else { t.removeAttribute('aria-valuenow'); t.removeAttribute('aria-valuetext'); }
  }
  const bounds = (t) => [t.dataset.min !== undefined ? parseFloat(t.dataset.min) : 0, t.dataset.max !== undefined ? parseFloat(t.dataset.max) : Infinity];
  /* search · a .cal-btn in .cal-search clears it, shown only while there is text */
  const clearBtn = (box) => { const b = box.querySelector(':scope > .cal-btn'), i = box.querySelector('input'); if (b && i) b.hidden = !i.value; };

  function controls(scope = document) {
    scope.querySelectorAll('.cal-term').forEach(term);
    scope.querySelectorAll('.cal-detent').forEach(detent);
    scope.querySelectorAll('.cal-range').forEach(range);
    scope.querySelectorAll('.cal-num input[data-step]').forEach(spin);
    scope.querySelectorAll('.cal-search').forEach(clearBtn);
  }

  const on = (type, sel, fn, opts) => document.addEventListener(type, (e) => { const t = e.target.closest?.(sel); if (t) fn(t, e); }, opts);
  on('input', '.cal-term .cal-textarea', (t) => term(t.closest('.cal-term')));
  ['keyup', 'click', 'select', 'focusin', 'focusout'].forEach((ev) => on(ev, '.cal-term .cal-textarea', (t) => term(t.closest('.cal-term'))));
  on('change', '.cal-detent input', (t) => {
    const g = t.closest('.cal-detent'); detent(g);
    g.classList.add('moving'); clearTimeout(g._mv); g._mv = setTimeout(() => g.classList.remove('moving'), 340);
  });
  /* switch · a click on the OFF or ON word sets that state, it doesn't toggle */
  on('click', '.cal-switch .o', (o, e) => {
    const i = o.closest('.cal-switch').querySelector('input'); e.preventDefault();
    if (!i || i.disabled) return;
    const want = o.classList.contains('on');
    if (i.checked !== want) { i.checked = want; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  on('input', '.cal-range input[type="range"]', (t) => range(t.closest('.cal-range')));
  /* number · .cal-num input[data-step]: ↑ ↓ step it, Shift ×10, kept within data-min (default 0) and
     data-max at the step's precision; on blur the integer part is grouped, and a value that isn't a
     number or is out of range is marked aria-invalid (never changed behind the writer's back) */
  on('keydown', '.cal-num input[data-step]', (t, e) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const s0 = parseFloat(t.dataset.step) || 1, step = s0 * (e.shiftKey ? 10 : 1) * (e.key === 'ArrowUp' ? 1 : -1);
    const [min, max] = bounds(t), cur = parseNum(t.value), d = Math.max(decimals(s0), Number.isFinite(cur) ? decimals(cur) : 0);
    const next = Math.min(max, Math.max(min, (Number.isFinite(cur) ? cur : Number.isFinite(min) ? min : 0) + step));
    t.value = groupNum(+next.toFixed(d), d);
    if (t.dataset.calInvalid) { t.removeAttribute('aria-invalid'); delete t.dataset.calInvalid; }
    t.dispatchEvent(new Event('input', { bubbles: true }));
  });
  on('input', '.cal-num input[data-step]', spin);
  on('focusout', '.cal-num input[data-step]', (t) => {
    const raw = t.value.trim(), v = parseNum(raw), [min, max] = bounds(t);
    if (raw === '') return;
    const bad = !Number.isFinite(v) || v < min || v > max;
    if (bad) { t.setAttribute('aria-invalid', 'true'); t.dataset.calInvalid = '1'; }
    else { if (t.dataset.calInvalid) { t.removeAttribute('aria-invalid'); delete t.dataset.calInvalid; } t.value = groupNum(v, decimals(raw.replace(/\s/g, ''))); }
    spin(t);
  });
  on('input', '.cal-search input', (t) => clearBtn(t.closest('.cal-search')));
  on('click', '.cal-search > .cal-btn', (b) => {
    const i = b.closest('.cal-search').querySelector('input'); if (!i) return;
    i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); i.focus();
  });
  /* data-key="/" on a field: that key, pressed outside any text field, focuses it */
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    const a = document.activeElement;
    if (a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return;
    const f = [...document.querySelectorAll('[data-key]')].find((x) => x.dataset.key === e.key && !x.disabled && x.getClientRects().length);
    if (f) { e.preventDefault(); f.focus(); }
  });
  on('dragover', '.cal-drop', (z, e) => { e.preventDefault(); z.classList.add('over'); });
  on('dragleave', '.cal-drop', (z) => z.classList.remove('over'));
  on('drop', '.cal-drop', (z, e) => {
    e.preventDefault(); z.classList.remove('over');
    const input = z.querySelector('input[type="file"]');
    try { input.files = e.dataTransfer.files; } catch { /* read-only in old browsers */ }
    listFiles(z, e.dataTransfer.files);
    z._listed = true;   /* the change below is ours: already listed */
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  on('change', '.cal-drop input[type="file"]', (t) => { const z = t.closest('.cal-drop'); if (z._listed) { z._listed = false; return; } listFiles(z, t.files); });
  on('keydown', '.cal-chips input', (t, e) => {
    const box = t.closest('.cal-chips'), v = t.value.trim().replace(/,$/, '');
    if ((e.key === 'Enter' || e.key === ',') && v) { e.preventDefault(); addChip(box, v); t.value = ''; }
    else if (e.key === 'Backspace' && !t.value) { const last = [...box.querySelectorAll('.chip')].pop(); if (last) { say(box, `Removed ${last.firstChild.textContent.trim()}`); last.remove(); box.dispatchEvent(new CustomEvent('cal-chips', { bubbles: true, detail: { values: chipValues(box) } })); } }
  });
  on('click', '.cal-chips .chip button', (b) => { const box = b.closest('.cal-chips'); say(box, `Removed ${b.parentElement.firstChild.textContent.trim()}`); b.parentElement.remove(); box.querySelector('input')?.focus(); box.dispatchEvent(new CustomEvent('cal-chips', { bubbles: true, detail: { values: chipValues(box) } })); });
  on('click', '.cal-chips', (box, e) => { if (e.target === box) box.querySelector('input')?.focus(); });
  /* dialog · <button data-dialog="id"> opens <dialog class="cal-dialog" id="id"> as a modal */
  on('click', '[data-dialog]', (b) => { const d = document.getElementById(b.dataset.dialog); if (d?.showModal && !d.open) d.showModal(); });
  /* menu · a .cal-menu[popover] with role=menu, opened by its [popovertarget] button. Where anchor
     positioning is missing it sits under its button. Enter, Space or ↓ on the button open it on the
     first item (↑ on the last); ↑ ↓ Home End move; a key shown in an item's .cal-kbd (or its
     data-key) picks it; Tab or picking an item closes it; Esc closes and returns focus. Items are out
     of the Tab order. menus(scope) wires the resting state (aria-haspopup, key shortcuts). */
  const anchored = !!root.CSS?.supports?.('position-area: bottom');
  const opener = (m) => m.id && document.querySelector(`[popovertarget="${CSS.escape(m.id)}"]`);
  const menuItems = (m) => [...m.querySelectorAll('.it')].filter((x) => !x.disabled);
  const KEYS = { '⌫': 'Backspace', '⌦': 'Delete', '↵': 'Enter', esc: 'Escape' };
  const itemKey = (it) => it.dataset.key || it.querySelector('.cal-kbd')?.textContent.trim() || '';
  function menus(scope = document) {
    scope.querySelectorAll('.cal-menu[popover]').forEach((m) => {
      const b = opener(m); if (b) { b.setAttribute('aria-haspopup', 'menu'); b.setAttribute('aria-expanded', String(m.matches(':popover-open'))); }
      m.querySelectorAll('.it').forEach((it) => {
        it.tabIndex = -1;
        const k = itemKey(it); if (k && !it.hasAttribute('aria-keyshortcuts')) it.setAttribute('aria-keyshortcuts', KEYS[k] || k);
      });
    });
  }
  document.addEventListener('toggle', (e) => {
    const m = e.target; if (!m.matches?.('.cal-menu[popover]')) return;
    const b = opener(m), open = e.newState === 'open';
    if (b) b.setAttribute('aria-expanded', String(open));
    /* closed with focus inside (or lost): back to the button */
    if (!open) { const a = document.activeElement; if (b && (!a || a === document.body || m.contains(a))) b.focus(); return; }
    if (!anchored && b) { const r = b.getBoundingClientRect(); Object.assign(m.style, { position: 'fixed', inset: 'auto', left: r.left + 'px', top: r.bottom + 4 + 'px' }); }
    menus(m.parentElement || document);
    const items = menuItems(m); (m._last ? items[items.length - 1] : items[0])?.focus(); m._last = false;
  }, true);
  on('keydown', '[popovertarget]', (b, e) => {
    const m = document.getElementById(b.getAttribute('popovertarget'));
    if (!m?.matches('.cal-menu[popover]') || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    e.preventDefault(); m._last = e.key === 'ArrowUp';
    if (!m.matches(':popover-open')) m.showPopover({ source: b }); else { const items = menuItems(m); (m._last ? items[items.length - 1] : items[0])?.focus(); }
  });
  on('click', '.cal-menu[popover] .it', (it) => it.closest('.cal-menu').hidePopover?.());
  on('keydown', '.cal-menu .it', (it, e) => {
    const m = it.closest('.cal-menu'), items = menuItems(m), i = items.indexOf(it), n = items.length;
    const to = { ArrowDown: (i + 1) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to !== undefined) { e.preventDefault(); items[to].focus(); return; }
    if (e.key === 'Tab') { if (m.matches(':popover-open')) { m.hidePopover(); opener(m)?.focus(); } return; }   /* Tab goes on from the button */
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const hit = items.find((x) => { const k = itemKey(x); return k && (KEYS[k] || k).toLowerCase() === e.key.toLowerCase(); });
    if (hit) { e.preventDefault(); hit.click(); }
  });

  /* tooltip · [data-tip="…"] on a focusable element. The words go to a hidden node named by
     aria-describedby (the drawn box is not read); a tip that would run off the right edge opens to
     the left; Esc hides it until the pointer or focus leaves. tips(scope) wires them (also done
     lazily on first hover or focus). */
  let tipN = 0;
  function tip(el) {
    let d = el._tip;
    if (!d || !d.isConnected) {
      d = document.createElement('span'); d.hidden = true; d.id = `cal-tip-${++tipN}`; document.body.append(d); el._tip = d;
      el.setAttribute('aria-describedby', [el.getAttribute('aria-describedby'), d.id].filter(Boolean).join(' '));
    }
    d.textContent = el.dataset.tip;
  }
  const tips = (scope = document) => scope.querySelectorAll('[data-tip]').forEach(tip);
  const tipShow = (el) => {
    tip(el);
    if (el.hasAttribute('data-tip-end')) return;
    const r = el.getBoundingClientRect(), est = Math.min(String(el.dataset.tip).length * 7.2 + 14, 36 * 7.2 + 14);
    el.toggleAttribute('data-tip-flip', r.left + r.width / 2 - 7 + est > document.documentElement.clientWidth - 8);
  };
  on('pointerover', '[data-tip]', tipShow);
  on('focusin', '[data-tip]', tipShow);
  on('pointerout', '[data-tip]', (el, e) => { if (!el.contains(e.relatedTarget)) el.removeAttribute('data-tip-off'); });
  on('focusout', '[data-tip]', (el) => el.removeAttribute('data-tip-off'));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('[data-tip]:is(:hover, :focus, .show)').forEach((el) => el.setAttribute('data-tip-off', ''));
  });

  /* ── tabs · .cal-tabs[role=tablist] > button[role=tab]. A click, ← → or Home / End selects; the
     tabs are one Tab stop (roving tabindex) and the panel named by each tab's aria-controls shows
     only while its tab is selected. tabs(scope) paints the resting state; a change fires
     `cal-tab` on the tab. */
  const tabList = (list) => [...list.querySelectorAll(':scope > [role="tab"]')];
  function selectTab(t) {
    tabList(t.parentElement).forEach((x) => {
      const sel = x === t, p = x.getAttribute('aria-controls') && document.getElementById(x.getAttribute('aria-controls'));
      x.setAttribute('aria-selected', String(sel)); x.tabIndex = sel ? 0 : -1;
      if (p) p.hidden = !sel;
    });
  }
  function tabs(scope = document) {
    scope.querySelectorAll('.cal-tabs[role="tablist"]').forEach((list) => {
      const all = tabList(list); if (!all.length) return;
      all.forEach((x) => { if (x.localName === 'button' && !x.hasAttribute('type')) x.type = 'button'; });
      selectTab(all.find((x) => x.getAttribute('aria-selected') === 'true') || all[0]);
    });
  }
  on('click', '.cal-tabs[role="tablist"] > [role="tab"]', (t) => {
    if (t.disabled || t.getAttribute('aria-selected') === 'true') return;
    selectTab(t); t.dispatchEvent(new CustomEvent('cal-tab', { bubbles: true }));
  });
  on('keydown', '.cal-tabs[role="tablist"] > [role="tab"]', (t, e) => {
    const all = tabList(t.parentElement).filter((x) => !x.disabled), i = all.indexOf(t);
    const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: all.length - 1 }[e.key];
    if (k === undefined || !all.length) return;
    e.preventDefault();
    const to = all[(k + all.length) % all.length];
    to.focus(); to.click();   /* a click, so the page's own click handlers run too */
  });

  /* ── sign-off · .cal-card > .cal-sign > .cal-btn[data-v="keep|rework|drop"][aria-pressed]. Pressing
     one presses only it and sets the card's data-verdict and data-state (ok · rework · dropped; a
     verdict with another name, like data-v="roll back", takes its state from data-ink: fault · live);
     rework shows the card's .note line. Every .cal-tally counts the signed cards into its
     [data-tally="n"] and its [data-tally="copy"] button copies one line per card, with the rework
     note; if the clipboard is blocked the lines appear in a selected text box under the tally.
     signoff() repaints the tallies (call it after adding cards). A change fires `cal-signoff`. */
  const VERDICT = { ok: 'keep', live: 'rework', fault: 'drop' }, STATE = { keep: 'ok', rework: 'rework', drop: 'dropped' };
  const signed = () => [...document.querySelectorAll('.cal-card')].filter((c) => c.querySelector('.cal-sign .cal-btn[aria-pressed]'));
  const tallyPart = (t, k) => t.querySelector(`[data-tally="${k}"]`) || t.querySelector(`#tally-${k}`);
  function signoff() {
    const cards = signed(), n = cards.filter((c) => c.dataset.verdict).length;
    document.querySelectorAll('.cal-tally').forEach((t) => { const el = tallyPart(t, 'n'); if (el) el.textContent = `${n} of ${cards.length} signed`; });
  }
  on('click', '.cal-card .cal-sign .cal-btn[aria-pressed]', (b) => {
    if (b.disabled || b.getAttribute('aria-disabled') === 'true') return;
    const card = b.closest('.cal-card'), v = b.dataset.v || VERDICT[b.dataset.ink] || 'keep', press = b.getAttribute('aria-pressed') !== 'true';
    card.querySelectorAll('.cal-sign .cal-btn[aria-pressed]').forEach((x) => x.setAttribute('aria-pressed', String(press && x === b)));
    if (press) { card.dataset.verdict = v; card.dataset.state = STATE[v] || { fault: 'dropped', live: 'rework' }[b.dataset.ink] || 'ok'; }
    else { delete card.dataset.verdict; delete card.dataset.state; }
    const note = card.querySelector('.cal-sign .note');
    if (note) { note.hidden = card.dataset.state !== 'rework'; if (!note.hidden) note.querySelector('input')?.focus(); }
    signoff();
    card.dispatchEvent(new CustomEvent('cal-signoff', { bubbles: true, detail: { verdict: card.dataset.verdict || null } }));
  });
  on('click', '.cal-tally :is([data-tally="copy"], #tally-copy)', async (b) => {
    const t = b.closest('.cal-tally'), msg = tallyPart(t, 'msg');
    const text = signed().map((c) => {
      const no = c.querySelector('.id .no')?.textContent.trim(), h = c.querySelector('h3')?.textContent.trim() || '';
      const note = c.dataset.state === 'rework' ? c.querySelector('.cal-sign .note input')?.value.trim() : '';
      return `${no ? no + ' ' : ''}${h}: ${c.dataset.verdict || 'not signed'}${note ? ' — ' + note : ''}`;
    }).join('\n');
    let box = t.nextElementSibling?.matches('.cal-tally-text') ? t.nextElementSibling : null;
    try {
      await navigator.clipboard.writeText(text);
      if (msg) msg.textContent = 'copied';
      if (box) box.hidden = true;
    } catch {
      if (!box) {
        box = document.createElement('textarea'); box.className = 'cal-textarea cal-tally-text'; box.readOnly = true;
        box.setAttribute('aria-label', 'Sign-off lines'); t.after(box);
      }
      box.hidden = false; box.value = text; box.rows = Math.min(12, text.split('\n').length + 1);
      box.focus(); box.select();
      if (msg) msg.textContent = 'Copy blocked. Select the text below and copy it.';
    }
  });

  /* ── toast · Calibrated.toast('Limit saved', { ink: 'ok', action: 'undo', onAction, timeout })
     ink: 'live' (in progress, the lamp star) · 'ok' · 'fault' · none. A plain toast goes after 5s;
     one with an action, or ink 'live', stays until dismissed (timeout: 0) unless a timeout is
     given. The timer pauses while the toast is hovered or holds focus. Returns the element;
     .remove() it to dismiss early. When a toast that holds focus goes, focus returns to where it
     was. Toasts stack bottom right in one polite live region, made at load so the first is heard. */
  const toastBox = () => {
    let box = document.querySelector('.cal-toasts');
    if (!box && document.body) { box = document.createElement('div'); box.className = 'cal-toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.append(box); }
    return box;
  };
  function toast(message, o = {}) {
    const box = toastBox(), back = document.activeElement;
    const el = document.createElement('div'), ic = { live: '<span class="star"></span>', ok: '<span class="ic">✓</span>', fault: '<span class="ic">✕</span>' }[o.ink] || '';
    el.className = 'cal-toast'; if (o.ink) el.dataset.ink = o.ink;
    el.innerHTML = `${ic}<span class="msg">${esc(message)}</span>`
      + (o.action ? `<button class="cal-btn" type="button" data-act>${esc(o.action)}</button>` : '')
      + '<button class="cal-btn" type="button" data-hide>hide</button>';
    let timer = null, left = o.timeout ?? (o.ink === 'live' || o.action ? 0 : 5000), since = 0;
    const done = () => {
      clearTimeout(timer); const had = el.contains(document.activeElement); el.remove();
      if (had && back && back !== document.body && back.isConnected) back.focus();
    };
    const run = () => { if (left && !timer && el.isConnected) { since = Date.now(); timer = setTimeout(done, left); } };
    const pause = () => { if (timer) { clearTimeout(timer); timer = null; left = Math.max(1500, left - (Date.now() - since)); } };
    el.addEventListener('pointerenter', pause); el.addEventListener('focusin', pause);
    el.addEventListener('pointerleave', () => { if (!el.contains(document.activeElement)) run(); });
    el.addEventListener('focusout', (e) => { if (!el.contains(e.relatedTarget) && !el.matches(':hover')) run(); });
    el.querySelector('[data-act]')?.addEventListener('click', () => { o.onAction?.(); done(); });
    el.querySelector('[data-hide]').addEventListener('click', done);
    box.append(el);
    run();
    return el;
  }

  /* ── pager · Calibrated.pager(nav, { page, pages, onChange, href }) draws [‹ prev] 1 … 4 [5] 6 … 12 [next ›]
     into a <nav class="cal-pager">: bracketed steps, underlined pages, the current page boxed.
     Buttons by default (onChange(page) is called); pass href: (page) => url to draw links instead.
     Focus stays where it was pressed: on the step (kept focusable at the ends, aria-disabled) or on
     the new current page. Returns { set(page), page }. */
  function pager(nav, o = {}) {
    const N = Math.max(1, Math.round(o.pages || 1)), href = typeof o.href === 'function' ? o.href : null;
    let p = Math.min(N, Math.max(1, Math.round(o.page || 1)));
    const pages = () => {
      const list = [...new Set([1, N, p - 1, p, p + 1].filter((k) => k >= 1 && k <= N))].sort((a, b) => a - b), out = [];
      list.forEach((k, j) => { if (j && k - list[j - 1] > 1) out.push(0); out.push(k); });
      return out;
    };
    const step = (k, dir, txt, name) => {
      const off = k < 1 || k > N;
      if (href) return `<a class="cal-btn inline" data-step="${dir}"${off ? ' aria-disabled="true"' : ` href="${esc(href(k))}"`} aria-label="${name}">${txt}</a>`;
      return `<button class="cal-btn inline" type="button" data-step="${dir}" data-go="${k}"${off ? ' aria-disabled="true"' : ''} aria-label="${name}">${txt}</button>`;
    };
    const page = (k) => {
      if (k === 0) return '<span class="gap" aria-hidden="true">…</span>';
      if (k === p) return href ? `<a class="pg cur" href="${esc(href(k))}" aria-current="page" aria-label="Page ${k}, current">${k}</a>`
        : `<button class="pg cur" type="button" aria-current="page" aria-disabled="true" tabindex="-1" aria-label="Page ${k}, current">${k}</button>`;
      return href ? `<a class="pg" href="${esc(href(k))}" aria-label="Page ${k}">${k}</a>` : `<button class="pg" type="button" data-go="${k}" aria-label="Page ${k}">${k}</button>`;
    };
    const draw = (refocus) => {
      nav.innerHTML = step(p - 1, 'prev', '‹ prev', 'Previous page') + pages().map(page).join('') + step(p + 1, 'next', 'next ›', 'Next page');
      if (refocus) nav.querySelector(refocus)?.focus();
    };
    const set = (k, refocus) => { k = Math.min(N, Math.max(1, Math.round(k))); if (k === p && nav.childElementCount) return; p = k; draw(refocus); o.onChange?.(p); };
    nav.classList.add('cal-pager'); if (!nav.hasAttribute('aria-label')) nav.setAttribute('aria-label', 'Pages');
    if (!href) nav.addEventListener('click', (e) => {
      const b = e.target.closest('[data-go]'); if (!b || b.getAttribute('aria-disabled') === 'true') return;
      set(+b.dataset.go, b.dataset.step ? `[data-step="${b.dataset.step}"]` : '.cur');
    });
    draw();
    return { set: (k) => set(k), get page() { return p; } };
  }

  const boot = () => { counts(); sheets(); controls(); tabs(); signoff(); menus(); tips(); toastBox(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  root.Calibrated = Object.assign(C, { redraw, counts, sheets, controls, tabs, signoff, toast, pager });
})(typeof window !== 'undefined' ? window : globalThis);
