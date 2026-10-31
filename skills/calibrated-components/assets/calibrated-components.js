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

   Full or compact: the nearest [data-density="full|compact"], or a
   density="…" attribute on the element itself. Full prints scales, boxes
   values and adds leaders. Compact keeps the marks only and moves the
   value to the tooltip (the <title>).

   Needs calibrated.css and calibrated-figures.js loaded first. */
(function (root) {
  'use strict';
  const C = root.Calibrated;
  if (!C) throw new Error('calibrated-components.js needs calibrated-figures.js first');
  const { K, fmt, textWidth: tw, esc } = C;
  if (!root.customElements) return;

  const num = (el, a, d) => { const v = parseFloat(el.getAttribute(a)); return Number.isFinite(v) ? v : d; };
  const str = (el, a, d = '') => (el.hasAttribute(a) ? el.getAttribute(a) : d);
  const formatter = (name, unit = '') => {
    if (name === 'pct') return (v) => fmt.pct(v);
    if (name === 'raw') return (v) => String(Math.round(v * 100) / 100) + unit;
    if (name === 'dur') return (v) => fmt.dur(v);
    return (v) => fmt.k(v) + unit;
  };

  class CalElement extends HTMLElement {
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    get density() {
      const own = this.getAttribute('density');
      if (own === 'full' || own === 'compact') return own;
      return C.density(this);
    }
    surface() {
      let svg = this.querySelector(':scope > svg[data-cal]');
      if (!svg) { svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('data-cal', ''); this.prepend(svg); }
      return svg;
    }
    paint({ w, h, markup, label }) {
      const svg = this.surface();
      svg.setAttribute('width', w); svg.setAttribute('height', h);
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', label);
      if (w > 200) svg.style.minWidth = Math.round(w * 0.9) + 'px';   /* scroll, don't shrink legends */
      svg.innerHTML = `<title>${esc(label)}</title>` + markup;
    }
    render() { try { this.paint(this.draw(this.density === 'full')); } catch (e) { console.error(this.localName, e); } }
  }

  /* ── cal-meter · a meter with a printed scale, a hatched alert zone, a needle and a boxed reading */
  class CalMeter extends CalElement {
    static get observedAttributes() { return ['value', 'max', 'warn', 'label', 'format', 'unit', 'width', 'density']; }
    draw(full) {
      const max = num(this, 'max', 100), v = Math.min(num(this, 'value', 0), max), warn = num(this, 'warn', max * 0.8);
      const f = formatter(str(this, 'format', 'k'), str(this, 'unit')), name = str(this, 'label', 'value');
      const r = v / max, wr = warn / max, reading = `${f(v)} / ${f(max)} · ${fmt.pct(r, 1)}`;
      const label = `${name}: ${reading}${warn < max ? `, alert at ${fmt.pct(wr)}` : ''}`;
      const H = K.hatch('ft', 4, 0.55);
      const over = wr < 1 && r > wr;
      const meter = (x0, x1, y, labels) => {
        const X = (q) => x0 + q * (x1 - x0); let s = '';
        /* the alert label sits above the scale numbers; drop a number it would touch */
        const alertW = labels && wr < 1 ? tw(`alert ${Math.round(wr * 100)}`) : 0;
        for (let i = 0; i <= 10; i++) {
          const M = i % 5 === 0, x = X(i / 10);
          s += K.line(x, y - 6, x, y - (M ? 18 : 12), M ? 'fa' : 'ed');
          if (!labels || !M) continue;
          const txt = i === 10 ? '100%' : String(i * 10), a = i === 0 ? 'start' : i === 10 ? 'end' : 'middle';
          if (alertW && i === 5 && Math.abs(X(wr) - x) < (alertW + tw(txt)) / 2 + 6) continue;
          s += K.t(x, y - 24, txt, 'fa', a);
        }
        if (wr < 1) s += `<rect x="${X(wr)}" y="${y - 5}" width="${X(1) - X(wr)}" height="5" fill="${H.url}"/>`;
        /* the fill is ink up to the alert line and red only for the part past it */
        s += K.line(x0, y, x1, y, 'ed') + K.rect(x0, y - 4, X(Math.min(r, wr)) - x0, 4, 'fg', 'none');
        if (over) s += K.rect(X(wr), y - 4, X(r) - X(wr), 4, 'ft', 'none');
        s += K.line(X(r), y - 18, X(r), y + 2, 'lv', { w: 1.6 });
        return s;
      };
      if (full) {
        const w = num(this, 'width', 420), x0 = 4, x1 = w - 30, y = 44, X = (q) => x0 + q * (x1 - x0);
        let g = H.def + meter(x0, x1, y, true);
        if (wr < 1) {
          /* keep the alert label inside the drawing near either end */
          const al = `alert ${Math.round(wr * 100)}`, half = tw(al) / 2;
          const ax = Math.min(Math.max(X(wr), x0 + half), w - half - 2);
          g += K.line(X(wr), y - 30, X(wr), y, 'ft', { opacity: 0.7 }) + K.t(ax, y - 34, al, 'ft', 'middle');
        }
        /* box to the right of the needle; flip it to the left when it would run off the end */
        const bw = K.boxWidth(name, reading), nx = X(r), right = nx + 14 + bw <= w - 2;
        const bx = right ? nx + 14 : Math.max(2, nx - 14 - bw), lx = right ? bx : bx + bw;
        g += K.leader([[nx, y + 4], [nx, y + 24], [lx, y + 24]], false) + K.box(bx, y + 8, bw, name, reading, over ? 'ft' : 'fg');
        return { w, h: y + 44, markup: g, label };
      }
      const mw = num(this, 'width', 144), y = 22, vs = f(v), ms = '/' + f(max);
      const w = mw + 10 + tw(vs) + tw(ms) + 2;
      const g = H.def + meter(1, mw, y, false) + K.t(mw + 10, y + 1, vs, over ? 'ft' : 'fg') + K.t(mw + 10 + tw(vs), y + 1, ms, 'fa');
      return { w, h: y + 4, markup: g, label };
    }
  }

  /* ── cal-position · "3 of 7" as ticks; above 24 items a scale with a marker */
  class CalPosition extends CalElement {
    static get observedAttributes() { return ['index', 'count', 'label', 'width', 'density']; }
    draw(full) {
      const n = Math.max(1, Math.round(num(this, 'count', 1))), i = Math.min(n, Math.max(1, Math.round(num(this, 'index', 1))));
      const name = str(this, 'label'), read = `${i}/${n}`, top = full && name ? 18 : 0;
      const label = `${name ? name + ': ' : ''}${i} of ${n}`;
      let g = '', x1, y = top + 10;
      if (n <= 24) {
        const step = n > 12 ? 10 : 16, x0 = 5; x1 = x0 + (n - 1) * step;
        g += K.line(x0, y, x1, y, 'e1');
        for (let k = 1; k <= n; k++) { const x = x0 + (k - 1) * step; g += k === i ? K.rect(x - 4, y - 4, 8, 8, 'fg', 'none') : K.line(x, y - 4, x, y + 4, k < i ? 'mu' : 'ed'); }
        x1 += 5;
      } else {
        const x0 = 1; x1 = num(this, 'width', 160); const X = K.scale(x0, x1, 1, n);
        const major = n > 500 ? 100 : n > 100 ? 50 : 10, minor = major / 5;
        g += K.line(x0, y, x1, y, 'ed');
        for (let v = 0; v <= n; v += minor) if (v >= 1 || v === 0) { const xx = X(Math.max(1, v)), M = v % major === 0; g += K.line(xx, y, xx, y + (M ? 5 : 3), M ? 'fa' : 'ed'); }
        g += `<path d="M${X(i).toFixed(2)} ${y - 2}l-4 -7h8z" style="fill:var(--fg)"/>`;
      }
      if (full) {
        if (name) g += K.t(0, 11, name, 'fa');
        g += K.count(x1 + 10, y, read);
        return { w: x1 + 12 + K.countWidth(read), h: y + 10, markup: g, label };
      }
      return { w: x1 + 2, h: y + 10, markup: g, label };
    }
  }

  /* ── cal-progress · steps as nodes: done ■, to do □, needs you ■ (fault), running ✦ (the lamp star) */
  class CalProgress extends CalElement {
    static get observedAttributes() { return ['states', 'done', 'total', 'live', 'fault', 'live-label', 'fault-label', 'done-label', 'step', 'density']; }
    states() {
      if (this.hasAttribute('states')) return str(this, 'states').split(/[\s,]+/).filter(Boolean);
      const total = num(this, 'total', 1), done = num(this, 'done', 0);
      return K.states(total, done, num(this, 'live', 0) - 1, num(this, 'fault', 0) - 1);
    }
    draw(full) {
      const st = this.states(), n = st.length, step = num(this, 'step', 18);
      const done = st.filter((s) => s === 'done').length, live = st.indexOf('live'), fault = st.indexOf('fault');
      const ll = str(this, 'live-label'), dl = str(this, 'done-label');
      /* shift right if the done label is wider than the run it measures */
      const x0 = Math.max(9, full && dl && done > 1 ? tw(dl) / 2 + 2 - (done - 1) * step / 2 : 9);
      const top = full && dl ? 30 : 0, y = top + 10, x1 = x0 + (n - 1) * step;
      let g = K.nodes(x0, y, step, st, { size: 8 });
      const read = `${done}/${n}`;
      let w = x1 + 10, h = y + 12;
      if (full) {
        if (dl && done > 1) g += K.dim(x0, x0 + (done - 1) * step, y - 18, dl);
        g += K.count(x1 + 16, y, read, done === n ? 'ok' : 'fg'); w = x1 + 18 + K.countWidth(read);
        /* caption centred under its node, clamped so it never leaves the drawing */
        const caption = (i, text, ink) => {
          const half = tw(text) / 2, cx = Math.max(half, x0 + i * step);
          g += K.leader([[x0 + i * step, y + 6], [x0 + i * step, y + 12]], false) + K.t(cx, y + 24, text, ink, 'middle');
          w = Math.max(w, cx + half + 2); h = y + 28;
        };
        if (live >= 0 && ll) caption(live, ll, 'lv');
        else if (fault >= 0) caption(fault, str(this, 'fault-label', 'needs you'), 'ft');
        if (dl && done > 1) w = Math.max(w, x0 + (done - 1) * step / 2 + tw(dl) / 2 + 2);
      }
      const label = `${done} of ${n} done` + (live >= 0 ? `, step ${live + 1} running` : '') + (fault >= 0 ? `, step ${fault + 1} needs attention` : '');
      return { w, h, markup: g, label };
    }
  }

  /* ── cal-diff · added to the right, removed to the left of a centre tick; log past the knee */
  class CalDiff extends CalElement {
    static get observedAttributes() { return ['added', 'removed', 'knee', 'max', 'label', 'name-width', 'density']; }
    draw(full) {
      const a = Math.max(0, num(this, 'added', 0)), r = Math.max(0, num(this, 'removed', 0));
      const knee = num(this, 'knee', 200), max = num(this, 'max', 100000), name = str(this, 'label');
      const span = 130, kneePx = 50;
      const F = (v) => (v <= 0 ? 0 : v <= knee ? v / knee * kneePx : kneePx + Math.min(1, Math.log10(v / knee) / Math.log10(max / knee)) * (span - kneePx));
      const la = '+' + fmt.k(a), lr = '−' + fmt.k(r);
      /* fixed side widths so a column of diffs shares one centre line */
      const side = full ? span + 10 + Math.max(tw('+000.0k'), tw(la), tw(lr)) : span + 4;
      const nameW = full && name ? Math.max(num(this, 'name-width', 64), tw(name) + 12) : 0;
      const cx = nameW + side, y = 12, w = cx + side;
      let g = '';
      [cx - kneePx, cx + kneePx].forEach((x) => { g += K.line(x, y - 9, x, y + 9, 'ed', { dash: '1 3' }); });
      g += K.line(cx, y - 7, cx, y + 7, 'fa');
      if (a) g += K.line(cx, y, cx + F(a), y, 'ok', { w: 2 }) + K.line(cx + F(a), y - 4, cx + F(a), y + 4, 'ok');
      if (r) g += K.line(cx - F(r), y, cx, y, 'ft', { w: 2 }) + K.line(cx - F(r), y - 4, cx - F(r), y + 4, 'ft');
      if (full) {
        if (a) g += K.t(cx + F(a) + 8, y + 4, la, 'ok');
        if (r) g += K.t(cx - F(r) - 8, y + 4, lr, 'ft', 'end');
        if (!a && !r) g += K.t(cx + 8, y + 4, 'no changes', 'fa');
        if (name) g += K.t(0, y + 4, name, 'fa');
      }
      return { w, h: 24, markup: g, label: `${name ? name + ': ' : ''}${a} lines added, ${r} removed` };
    }
  }

  /* ── cal-durations · several runs on one shared ruler; a live run is lit by the lamp and grows a dashed tail */
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
    disconnectedCallback() { if (this._mo) this._mo.disconnect(); clearInterval(this._tick); }
    spans() {
      const now = Date.now();
      return [...this.querySelectorAll(':scope > cal-span')].map((s) => {
        const start = num(s, 'start', NaN), end = num(s, 'end', NaN);
        let v = num(s, 'value', NaN);
        if (!Number.isFinite(v) && Number.isFinite(start)) v = ((Number.isFinite(end) ? end : now) - start) / 1000;
        return { name: str(s, 'name'), v: Math.max(0, v || 0), live: s.hasAttribute('live') };
      });
    }
    render() {
      super.render();
      const ticking = [...this.querySelectorAll(':scope > cal-span[live][start]')].length > 0;
      if (ticking && !this._tick) this._tick = setInterval(() => this.isConnected ? CalElement.prototype.render.call(this) : clearInterval(this._tick), 1000);
      if (!ticking && this._tick) { clearInterval(this._tick); this._tick = null; }
    }
    draw(full) {
      const rows = this.spans(), unit = str(this, 'unit', 'm'), div = unit === 'h' ? 3600 : unit === 's' ? 1 : 60;
      const longest = Math.max(1, ...rows.map((r) => r.v / div));
      /* auto scale: the smallest round major that fits the longest run in 2–5 majors */
      const major = [1, 2, 5, 10, 15, 20, 30, 60, 120, 300, 600].find((m) => longest / m <= 5) || 1200;
      const max = num(this, 'max', Math.ceil(longest / major) * major);
      const nameW = Math.max(40, ...rows.map((r) => tw(r.name))) + 16;
      const w = num(this, 'width', 480), valW = 70, x0 = nameW, x1 = w - valW - (full ? 48 : 10), X = K.scale(x0, x1, 0, max);
      let g = '', y0;
      if (full) {
        const step = max <= 20 ? 1 : max <= 60 ? 5 : 10, lab = (v) => v + unit;
        /* number every major and always the end of the scale */
        const every = [5, 4, 2, 1].find((e) => max % (step * e) === 0 && max / (step * e) <= 6) || 5;
        g += K.ruler(x0, x1, 22, max, step, every, lab, true);
        if (max % (step * every)) g += K.line(x1, 22, x1, 16, 'fa') + K.t(x1, 12, lab(max), 'fa', 'middle');
        y0 = 44;
      } else y0 = 10;
      const gap = full ? 22 : 14;
      rows.forEach((r, i) => {
        const y = y0 + i * gap, xe = X(Math.min(max, r.v / div)), c = r.live ? 'lv' : full ? 'fg' : 'mu', lab = fmt.dur(r.v);
        g += K.t(x0 - 10, y + 4, r.name, 'fg', 'end');
        g += K.line(x0, y, xe, y, c, { w: full ? 1.6 : 1.3 });
        if (full) g += K.line(x0, y - 4, x0, y + 4, 'fa');
        if (r.live) {
          g += K.line(xe, y, full ? xe + 40 : Math.min(xe + 40, x1), y, 'fa', { dash: '2 3' });
          if (full) g += K.node(xe, y, 'live');
          g += K.t(full ? xe + 48 : x1 + 10, y + 4, lab, 'lv');
        } else {
          if (full) g += K.line(xe, y - 4, xe, y + 4, 'fg');
          g += K.t(full ? xe + 8 : x1 + 10, y + 4, lab, 'mu');
        }
      });
      const label = 'Durations: ' + rows.map((r) => `${r.name} ${r.live ? 'running for' : 'took'} ${fmt.dur(r.v)}`).join('; ');
      return { w, h: y0 + (rows.length - 1) * gap + 12, markup: g, label };
    }
  }

  /* ── cal-ruler · a standalone scale */
  class CalRuler extends CalElement {
    static get observedAttributes() { return ['min', 'max', 'step', 'every', 'unit', 'width', 'up', 'value', 'density']; }
    draw() {
      const min = num(this, 'min', 0), max = num(this, 'max', 100), step = num(this, 'step', (max - min) / 10);
      const every = num(this, 'every', 5), unit = str(this, 'unit'), w = num(this, 'width', 320), up = this.hasAttribute('up');
      const f = (v) => (v === 0 ? '0' : Math.round(v * 100) / 100 + unit), marked = this.hasAttribute('value');
      /* the marker sits on the side away from the numbers; leave room for it and for the last number */
      const mk = marked ? 12 : 0, y = up ? 22 : 4 + mk, x0 = 6, x1 = w - Math.max(8, tw(f(max)) / 2 + 2);
      let g = K.ruler(x0, x1, y, max, step, every, f, up, min);
      if (marked) {
        const X = K.scale(x0, x1, min, max), v = Math.min(max, Math.max(min, num(this, 'value', min)));
        g += `<path d="M${X(v).toFixed(2)} ${up ? y + 2 : y - 2}l-5 ${up ? 9 : -9}h10z" style="fill:var(--live);filter:drop-shadow(0 0 2px var(--glow))"/>`;
      }
      return { w, h: (up ? 30 : 26) + mk, markup: g, label: `Scale from ${f(min)} to ${f(max)}` + (this.hasAttribute('value') ? `, marker at ${f(num(this, 'value', min))}` : '') };
    }
  }

  const define = (n, c) => { if (!customElements.get(n)) customElements.define(n, c); };
  define('cal-meter', CalMeter);
  define('cal-position', CalPosition);
  define('cal-progress', CalProgress);
  define('cal-diff', CalDiff);
  define('cal-span', CalSpan);
  define('cal-durations', CalDurations);
  define('cal-ruler', CalRuler);

  /* redraw every instrument when any [data-density] changes */
  const ALL = 'cal-meter,cal-position,cal-progress,cal-diff,cal-durations,cal-ruler';
  const redraw = (scope = document) => scope.querySelectorAll(ALL).forEach((el) => el.render && el.render());
  new MutationObserver((ms) => { if (ms.some((m) => m.attributeName === 'data-density')) redraw(); })
    .observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-density'] });

  /* redraw once fonts are in, so measured boxes fit */
  C.ready(() => redraw());

  /* zero-padded boxed counts: <span class="cal-count" data-n="3" data-pad="2" data-noun="places"> */
  function counts(scope = document) {
    scope.querySelectorAll('.cal-count[data-n]').forEach((el) => {
      const pad = parseInt(el.dataset.pad || '2', 10), n = el.dataset.n;
      el.innerHTML = `<b>${esc(String(n).padStart(pad, '0'))}</b>` + (el.dataset.noun ? `<span>${esc(el.dataset.noun)}</span>` : '');
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

  const boot = () => { counts(); sheets(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  root.Calibrated = Object.assign(C, { redraw, counts, sheets });
})(typeof window !== 'undefined' ? window : globalThis);
