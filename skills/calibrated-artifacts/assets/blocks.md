# Blocks

Copy-paste HTML for a Calibrated artifact. Everything here works inside `template.html`, or in any page with `calibrated-inline.css` and `calibrated-inline.js` inlined.

## Page
```html
<div class="wrap" data-density="full">
  … mast, intro, sections, tally, foot …
</div>
```
Panels sit straight on the desk inside `.wrap`. No frame is needed.

## Mast
```html
<header class="cal-mast">
  <svg class="cal-mark" aria-hidden="true"><use href="#cal-mark"/></svg>
  <span class="word">Name</span>
  <span class="cal-legend">deploy review · week 44</span>
  <span class="sp"></span>
  <span class="cal-legend fnt">v2.14.0 · 2026-10-31</span>
</header>
```
`#cal-mark` is the ruled-mark `<symbol>` (Calibrated's own logo) at the top of the template's `<body>`. Replace it with the product's own mark if it has one, drawn in `currentColor`.

## Intro
```html
<section class="cal-intro">
  <h1>Headline in plain words, two lines at most</h1>
  <div><p>What this page is and what the reader should do.</p></div>
</section>
```

## Sheet and title block (optional)
For a page that needs the engineering-drawing look (drawing numbers, zones, approvals), wrap everything inside `.wrap` in a sheet and put a title block at its end:
```html
<div class="cal-sheet" data-zones="8x4">
  … mast, intro, sections …
  <dl class="cal-titleblock" style="--tb-cols:4">
    <div class="name"><dt>title</dt><dd>Checkout · deploy review</dd></div>
    <div><dt>dwg no.</dt><dd>CHK-044</dd></div>
    <div><dt>version</dt><dd>2.14.0</dd></div>
    <div><dt>sheet</dt><dd>1 / 3</dd></div>
    <div><dt>rev</dt><dd>A</dd></div>
    <div class="wide"><dt>owner</dt><dd>checkout team</dd></div>
    <div class="wide"><dt>date</dt><dd>2026-10-31</dd></div>
  </dl>
</div>
```
`data-zones` is columns × rows; the zone labels are added by `Calibrated.sheets()` on load.

## Section
```html
<section class="cal-sec" id="limits">
  <div class="cal-sec-h"><b>2 · Limits</b><span>one note on what's in it</span><span>sheet 2/3</span></div>
  <p class="cal-lede">Optional one-sentence lede.</p>
  <div class="cal-stack"> … </div>
</section>
```

## Figure card · proposal (today → drawn)
```html
<article class="cal-card">
  <div class="info">
    <div class="id"><span class="no">03</span>where it lives<span class="end">rev A</span></div>
    <h3>What the figure is</h3>
    <p class="why">Why: what the text fails to show and what the drawing shows at a glance.</p>
    <dl class="cal-kv"><dt>where</dt><dd>…</dd><dt>replaces</dt><dd>…</dd><dt>data</dt><dd>…</dd></dl>
  </div>
  <div class="cal-compare">
    <div><div class="cal-tag">today</div><div class="stage"><div class="cal-note">
      <div class="cal-gl">group</div>
      <div class="r"><span class="k">key</span><span>value</span></div>
    </div></div></div>
    <div><div class="cal-tag on">drawn</div><div class="stage"><svg id="fig-3"></svg></div></div>
  </div>
  <div class="cal-sign" role="group" aria-label="Sign off 03">
    <button class="cal-btn" data-ink="ok" data-v="keep" aria-pressed="false">keep</button>
    <button class="cal-btn" data-ink="fault" data-v="drop" aria-pressed="false">drop</button>
  </div>
</article>
```
The `.id` line opens `.info`: an outlined lamp number badge, where it lives, and a status on the right (`rev A`, or `✓ built` with `data-ink="ok"`). A kept card's badge turns green; a dropped card fades and is stamped SUPERSEDED. For a report, drop `.cal-sign` and replace `.cal-compare` with `<div class="stage"><svg id="fig-3"></svg></div>`.

## Figure with caption (explainer)
```html
<figure class="cal-figure"><svg id="fig-4"></svg><figcaption><b>FIG.4</b>One line saying what to look at.</figcaption></figure>
```

## Full / compact comparison (shared parts)
```html
<div class="cal-figure"><svg id="p1" width="500" height="170"></svg></div>
<script>
Calibrated.ready(() => {
  const { K, draw } = Calibrated;
  let g = K.tag(46, 'full') + /* full drawing at y=46 */ '';
  g += K.line(0, 100, 500, 100, 'e1', { dash: '2 4' });
  g += K.tag(130, 'compact') + /* marks only at y=130 */ '';
  draw('#p1', g, 'Full and compact forms of …');
});
</script>
```

## Specimen grid
```html
<div class="cal-specimens" id="specimens"></div>
<script>
Calibrated.ready(() => {
  const { K, svg } = Calibrated;
  const specs = [
    ['Ruler', 'Numbered at major ticks only.', K.ruler(6, 144, 40, 50, 5, 5, (v) => (v ? v + 'k' : '0'))],
    ['Dimension line', 'A span with its length in the gap.', K.dim(8, 140, 34, '4m 12s')],
    ['Nodes', 'Done, next, merge, live.', K.node(16, 30, 'done') + K.node(52, 30, 'todo') + K.node(88, 30, 'merge') + K.node(126, 30, 'live')],
  ];
  document.getElementById('specimens').innerHTML = specs.map(([h, p, m]) => `<div class="cal-spec">${svg(156, 70, m)}<h4>${h}</h4><p>${p}</p></div>`).join('');
});
</script>
```
The full set of eight is in `references/marks.md` and in the repo's `demo/index.html`.

## Instruments panel
```html
<div class="cal-panel" style="display:grid;gap:16px;padding:16px 18px" data-density="full">
  <cal-meter value="46000" max="1000000" warn="800000" label="requests today"></cal-meter>
  <cal-position index="3" count="7" label="diff · files"></cal-position>
  <cal-progress done="11" total="15" live="12" live-label="step 12 · backfill" done-label="11 done · 1h 48m"></cal-progress>
  <cal-diff added="184" removed="20" label="release"></cal-diff>
  <cal-durations max="15" unit="m">
    <cal-span name="build" value="252"></cal-span>
    <cal-span name="rollout" value="485" live></cal-span>
  </cal-durations>
  <div style="display:flex;gap:16px;flex-wrap:wrap">
    <span class="cal-count" data-n="3" data-noun="deploys"></span>
    <span class="cal-count" data-n="1" data-noun="rolling" data-ink="live"></span>
  </div>
</div>
```

## Roll-up table
```html
<table class="cal-table">
  <thead><tr><th>no</th><th>service</th><th>change</th><th>diff</th><th>status</th></tr></thead>
  <tbody>
    <tr><td>01</td><td>checkout-api</td><td>rate-limit login</td><td><cal-diff added="212" removed="38" density="compact"></cal-diff></td><td class="st" data-ink="live">rolling</td></tr>
    <tr><td>02</td><td>payments</td><td>retry idempotency keys</td><td><cal-diff added="84" removed="12" density="compact"></cal-diff></td><td class="st" data-ink="ok">live</td></tr>
    <tr><td>03</td><td>search</td><td>reindex on deploy</td><td><cal-diff added="40" removed="6" density="compact"></cal-diff></td><td class="st">to do</td></tr>
  </tbody>
</table>
```
A live status is lamp text with a small star, and an ok status gets its check from the CSS. Add `<td class="effort">■■□</td>` for an effort column.

## Revisions
```html
<table class="cal-revs">
  <thead><tr><th>rev</th><th>description</th><th>date</th></tr></thead>
  <tbody>
    <tr><td><span class="cal-rev" data-rev="A"></span></td><td>First issue.</td><td class="lg">2026-10-24</td></tr>
    <tr><td><span class="cal-rev" data-rev="B"></span></td><td>Added the error budget drawing.</td><td class="lg">2026-10-31</td></tr>
  </tbody>
</table>
```
Put the same `<span class="cal-rev" data-rev="B"></span>` beside whatever changed in revision B. For a verdict on the whole page: `<span class="cal-stamp">approved for use</span>`.

## Tiers
```html
<div class="cal-tiers">
  <div><div class="tt">Draw next</div><p>…</p></div>
  <div><div class="tt">Leave alone</div><p>…</p></div>
</div>
```

## Sign-off tally
The template already wires this up: buttons set `data-v` on the card, the tally counts cards and `copy sign-off` copies `NN Title: keep|drop` lines.
```html
<div class="cal-tally"><span id="tally-n">0 of 6 signed</span><span class="sp"></span><span id="tally-msg" class="mut"></span><button class="cal-btn" id="tally-copy">copy sign-off</button></div>
```

## Commands as text (beside a merge or steps figure)
```html
<pre class="cal-pre">git switch main
git merge --no-ff release/2.4
git tag v2.4.0</pre>
```
