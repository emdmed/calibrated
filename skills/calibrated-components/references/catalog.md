# Component catalogue

## Drawing sheet (optional)

Most pages are panels straight on the desk inside `.wrap`. Use the sheet and title block only when a page wants the engineering-drawing look: drawing numbers, zones, approvals.

### Sheet
```html
<div class="wrap">
  <div class="cal-sheet" data-zones="8x6">
    …the whole page…
  </div>
</div>
```
A hairline frame with a fainter outer rule 6px out, like a drawing sheet. `data-zones="8x6"` (columns × rows) makes `Calibrated.sheets()` add numbered column zones top and bottom and lettered row zones left and right. It runs on load; call it again after inserting a sheet. Without JS the frame still draws. Below 700px the side zones hide.

### Title block
```html
<dl class="cal-titleblock" style="--tb-cols:4">
  <div class="name"><dt>title</dt><dd>Checkout · deploy review</dd></div>
  <div><dt>dwg no.</dt><dd>CHK-044</dd></div>
  <div><dt>scale</dt><dd>1:1</dd></div>
  <div><dt>sheet</dt><dd>1 / 3</dd></div>
  <div><dt>rev</dt><dd>B <span class="cal-rev" data-rev="B"></span></dd></div>
  <div class="wide"><dt>owner</dt><dd>checkout team</dd></div>
  <div class="wide"><dt>date</dt><dd>2026-10-31</dd></div>
</dl>
```
Ruled cells, a small legend over each value. `--tb-cols` sets the column count (2 below 700px). `.name` spans the full width and sets its value in title caps. `.wide` spans two columns.

### Revisions
```html
<table class="cal-revs">
  <thead><tr><th>rev</th><th>description</th><th>date</th></tr></thead>
  <tbody>
    <tr><td><span class="cal-rev" data-rev="A"></span></td><td>First release.</td><td class="lg">2026-10-12</td></tr>
    <tr><td><span class="cal-rev" data-rev="B"></span></td><td>Rate-limit login.</td><td class="lg">2026-10-31</td></tr>
  </tbody>
</table>
```
`.cal-rev` is a red revision triangle with the letter from `data-rev`. Put one in the revision table, in the title block, and beside anything on the page that changed in that revision.

### Stamp
`<span class="cal-stamp">approved for use</span>` is a red markup stamp. Use it once, for a verdict on the whole page. Dropped cards get a SUPERSEDED stamp automatically (see Card).

## Page frame

### Masthead
```html
<header class="cal-mast">
  <svg class="cal-mark" aria-hidden="true"><use href="#cal-mark"/></svg>
  <span class="word">Checkout</span>
  <span class="lg up mut">deploy review · week 44</span>
  <span class="sp"></span>
  <span class="lg up fnt">v2.14.0 · 2026-10-31</span>
</header>
```
`.cal-mark` is the brand mark, a short ruler with one graduation lit in lamp, drawn in `currentColor` with the lamp from `--live`. Paste its `<symbol id="cal-mark">` (from `demo/index.html` or the artifact template) once at the top of `<body>`, or point `<use>` at the product's own mark. The mast ends in a hairline.

### Intro
```html
<section class="cal-intro">
  <h1>Three deploys this week. One still rolling out.</h1>
  <div><p>Lede, one or two short paragraphs.</p><p>…</p></div>
</section>
```
An uppercase typewriter headline (regular weight, tracked) beside a lede up to 440px wide. Stacks below 1100px.

### Section with a ruled head
```html
<section class="cal-sec" id="marks">
  <div class="cal-sec-h"><b>1 · Marks</b><span>eight, used the same way everywhere</span><span>sheet 1/6</span></div>
  <p class="cal-lede">One sentence on what this section shows.</p>
  …
</section>
```
A legend line between rules: a short rule, the number and title in ink, a muted note, a rule running right, and the sheet number in faint (the last span, when there are two). Number sections with arabic numerals followed by ` · `.

### Footer
`<footer class="cal-foot"><span>checkout · chk-044</span><span>example data · illustrative</span></footer>`

## Surfaces
`.cal-panel` (a panel on the desk) · `.cal-well` (recessed) · `.cal-raised` (note, with a strong hairline) · `.cal-framed` (kept as an alias of `.cal-panel`) · `.cal-stack` (vertical grid with the standard gap).

## Card
```html
<article class="cal-card">                            <!-- data-state: ok | dropped, set by the sign-off -->
  <div class="info">
    <div class="id"><span class="no">01</span>load test · v2.4<span class="end">rev B</span></div>
    <h3>Load test as lanes on one ruler</h3>
    <p class="why">Why the change, in two or three sentences.</p>
    <dl class="cal-kv"><dt>where</dt><dd>release checklist</dd><dt>replaces</dt><dd>three status lines</dd><dt>data</dt><dd>start, end, p99, errors</dd></dl>
  </div>
  <div class="cal-compare">
    <div><div class="cal-tag">today</div><div class="stage"><div class="cal-note">…</div></div></div>
    <div><div class="cal-tag on">drawn</div><div class="stage"><svg id="f1"></svg></div></div>
  </div>
  <div class="cal-sign" role="group" aria-label="Sign off 01">
    <button class="cal-btn" data-ink="ok" data-v="keep" aria-pressed="false">keep</button>
    <button class="cal-btn" data-ink="fault" data-v="drop" aria-pressed="false">drop</button>
  </div>
</article>
```
- `.id` opens the info column: `.no` is an outlined lamp number badge, then where it lives, then an optional `.end` status on the right (`rev B`, or `✓ built` with `data-ink="ok"`). It renders at the top wherever it sits in `.info`; put it first.
- Then the title, the *why*, and the `cal-kv` sheet (faint keys, muted values) under a hairline.
- `data-state="ok"` turns the badge green. `data-state="dropped"` fades the card and stamps it SUPERSEDED.
- `.cal-tag.on` draws its own lamp star; don't add one.
- With a single stage, use `<div class="stage">…</div>` in place of `.cal-compare`.
- Below 1100px the card stacks. Below 700px the compare stacks.

### Note (the text a figure replaces)
```html
<div class="cal-note">
  <div class="cal-gl">load test · 3 regions</div>
  <div class="r"><span class="k">us-east</span><span>done · 4m 12s</span></div>
  <pre>git switch main</pre>
</div>
```

## Counts and tabs
```html
<span class="cal-count" data-n="3" data-noun="regions"></span>             <!-- JS fills: boxed 03 + REGIONS -->
<span class="cal-count" data-n="2" data-noun="running" data-ink="live"></span>
<span class="cal-count" data-n="1" data-noun="failing" data-ink="fault"></span>
<span class="cal-count"><b>73</b><span>files</span></span>               <!-- no JS -->

<div class="cal-tabs" role="tablist">
  <button role="tab" aria-selected="true">runs<span class="cal-cnt">04</span></button>
  <button role="tab">alerts<span class="cal-cnt">01</span></button>
</div>
```
`data-pad` (default 2) sets the zero-padding. `data-ink="live"` sets the number and outline in lamp; `ok`/`fault` colour them green or red. In compact density the noun is hidden. After inserting counts dynamically, call `Calibrated.counts(root)`. The open tab turns ink with a 1px underline, and its count box takes an ink outline.

## Buttons
`<button class="cal-btn">copy</button>` renders as a bracketed legend word, `[COPY]`: muted, turning ink on hover. Variants:
- `.primary`: ink text, turning lamp on hover.
- `aria-pressed="true"`: ink; with `data-ink="ok|fault"`, green or red.
- `.quiet`: no brackets, underlined, for secondary actions.
- `disabled`: faint.

## Tally (sign-off bar; add `.sticky` to pin it)
```html
<div class="cal-tally"><span id="tally-n">0 of 3 signed</span><span class="sp"></span><span id="tally-msg" class="mut"></span><button class="cal-btn" id="tally-copy">copy sign-off</button></div>
```

## Table
```html
<table class="cal-table">
  <thead><tr><th>no</th><th>figure</th><th>where</th><th>diff</th><th>effort</th><th>status</th></tr></thead>
  <tbody>
    <tr><td>01</td><td>Load test lanes</td><td>release checklist</td><td><cal-diff added="212" removed="38" density="compact"></cal-diff></td><td class="effort">■■□</td><td class="st" data-ink="live">in review</td></tr>
    <tr><td>02</td><td>Error budget ruler</td><td>SLO panel</td><td><cal-diff added="84" removed="12" density="compact"></cal-diff></td><td class="effort">■□□</td><td class="st" data-ink="ok">✓ shipped</td></tr>
  </tbody>
</table>
```
A parts list on a panel: legend heads over an `--edge-strong` hairline, the first column in muted legend type. Use `.num` for right-aligned numbers, `.effort` for ■□ effort, and `.st` (+ `data-ink`) for status. A live status is lamp text with a small star; ok gets a check.

## Tiers, rows, specimens, figure
```html
<div class="cal-tiers"><div><div class="tt">Draw next</div><p>…</p></div><div><div class="tt">Leave alone</div><p>…</p></div></div>

<div class="cal-rows"><div>Resize product images<div class="meta lg">worker 3 · 1 204 jobs · 1m 02s</div></div><div class="sel">…</div></div>

<div class="cal-specimens" style="--cols:4"><div class="cal-spec"><svg>…</svg><h4>Ruler</h4><p>…</p></div></div>

<figure class="cal-figure"><svg id="fig"></svg><figcaption><b>Lanes</b>Runs on one time ruler.</figcaption></figure>
```
The selected row (`.sel` or `aria-selected="true"`) gets the current tint and a 2px lamp bar on the left.

## Form
```html
<div class="cal-field"><label for="lim">daily limit</label><input class="cal-input" id="lim" value="150 000"></div>
<div class="cal-field"><label for="own">owner</label><input class="cal-input" id="own" aria-invalid="true" aria-describedby="own-e"><span class="err" id="own-e">Enter a team name, like payments.</span></div>
<label class="cal-check"><input type="checkbox" checked> <span>Pause new runs at the limit</span></label>
```
Inputs are write-in lines, like the boxes of a title block. `.hint` and `.err` sit under the field. A checked box is a filled ink square with a tick.

## Labels and marks
`.cal-legend` (legend type, uppercase) · `.cal-gl` (legend with a rule to the edge) · `.cal-tag` (`.on` for the active side, with its own lamp star) · `.cal-dot` (outlined square = next, `.done`, `.on` live star, `.ok`, `.fault`) · `.cal-rev` (revision triangle) · `.live` (lamp text) · `.star` (the lamp star, inline) · `.cal-mark` (brand mark).

---

## Instruments (custom elements)

All instruments accept `density="full|compact"`, and otherwise follow the nearest `[data-density]`. Each one draws an `<svg role="img">` with a `<title>` and an `aria-label`.

Every instrument moves on one shared clock: it sweeps in when half in view, glides from where it is when an attribute changes (220–700ms, ease-out, unless noted), and its reading blinks twice when it settles. The `aria-label` and `<title>` always state the final value. `prefers-reduced-motion` or the `still` attribute draws the value at once.

### `<cal-meter>`
| attr | default | |
|---|---|---|
| `value`, `max` | 0, 100 | |
| `warn` | 0.8 × max | start of the red-hatched alert zone; the fill turns fault past it |
| `label` | `value` | name in the box and the aria sentence |
| `format` | `k` | `k` (46k, 1M) · `raw` · `pct` · `dur` |
| `unit` | | appended after `k`/`raw` |
| `width` | 420 full / 144 compact | |
| `still` | off | no motion: draw the value at once |

Full: ticks numbered 0/50/100%, alert line with value, a lamp needle, boxed reading on a leader. Compact: the meter plus `46k/1M`.

Motion: the first reading sweeps up from 0 when the meter is half in view; later changes to `value` glide from where the needle is (220–700ms, ease-out). The needle and reading lead and the fill trails 110ms behind; when it settles, the reading blinks twice. The `aria-label` always states the final value. `prefers-reduced-motion` or `still` skips all of it.

### `<cal-position>`
`index` (1-based), `count`, `label`, `width` (for long sets), `still`. Up to 24 items: one tick per item, the current one a filled square, past items muted. Above 24: a scale with a ▼ marker. Full adds the label above and a boxed `3/7`.

Motion: the marker sweeps from item 1, then glides between items; the ticks it passes darken behind it and the reading counts through.

### `<cal-progress>`
Either `states="done,done,live,todo,fault"` or `done`, `total`, `live` (1-based), `fault` (1-based). Optional: `live-label` (lamp caption under the live star), `fault-label` (default "needs you"), `done-label` (a dimension line over the done run, e.g. `11 done · 1h 48m`), `step` (default 18), `still`. Full adds the boxed `n/N`.

Motion: the live star steps node to node at an even 50ms per step, and the done squares latch behind it. A fault and its caption appear on landing. A `states="…"` list draws at once.

### `<cal-diff>`
`added`, `removed`, `label`, `knee` (200), `max` (100000), `name-width` (64). Added lines run right in ok ink, removed lines run left in fault ink, from a centre tick. Linear to the knee, log beyond, with the knee marked by dotted ticks. Stack several in a column: they share the centre line.

Motion: both bars grow out from the centre in drawn length (so the log part moves as evenly as the linear part); the end ticks and numbers lead, counting through.

### `<cal-durations>` + `<cal-span>`
Parent: `max` (auto, rounded up to 5), `unit` (`m`, `s`, `h`), `width` (480).
Span: `name`, then either `value` (seconds) or `start`/`end` (epoch ms), plus `live`. A live span with `start` ticks every second. Full: shared ruler on top, end ticks, the live span in lamp, ending in the lamp star with a dashed tail. Compact: thin lines with values aligned on the right.

Motion: bars grow out from the start line and glide to new values; the times count up. A live span's once-a-second tick just redraws, without a glide or a blink.

### `<cal-ruler>`
`min`, `max`, `step`, `every`, `unit`, `width`, `up` (labels above), `value` (a lamp ▼ marker), `still`.

Motion: the marker sweeps in from `min`, then glides to new values. The scale holds still; a ruler with no value has no motion.

### JS
- `Calibrated.redraw(scope?)`: force a redraw of every instrument (for example after changing CSS variables by hand).
- `Calibrated.counts(scope?)`: fill `.cal-count[data-n]`.
- `Calibrated.sheets(scope?)`: add zone labels to `.cal-sheet[data-zones]`.
- Elements are plain DOM, so frameworks can set attributes directly: `el.setAttribute('value', v)`.
