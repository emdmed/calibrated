<!-- copied from skills/calibrated-components/references/catalog.md by scripts/build-artifact-template.mjs -->
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
<article class="cal-card">                            <!-- data-state: ok | rework | dropped, set by the sign-off -->
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
    <button class="cal-btn" data-ink="live" data-v="rework" aria-pressed="false">rework</button>   <!-- optional -->
    <button class="cal-btn" data-ink="fault" data-v="drop" aria-pressed="false">drop</button>
  </div>
</article>
```
- `.id` opens the info column: `.no` is an outlined lamp number badge, then where it lives, then an optional `.end` status on the right (`rev B`, or `✓ built` with `data-ink="ok"`). It renders at the top wherever it sits in `.info`; put it first.
- Then the title, the *why*, and the `cal-kv` sheet (faint keys, muted values) under a hairline.
- `data-state="ok"` turns the badge green. `data-state="dropped"` fades the card and stamps it SUPERSEDED. `data-state="rework"` stamps it REWORK in lamp, for an item that stays but isn't good enough yet.
- A rework note: put `<label class="note" hidden>rework<input class="cal-input" placeholder="what isn’t good enough yet?"></label>` first in `.cal-sign`, show it when rework is pressed, and add its text to the copied sign-off.
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
- `aria-pressed="true"`: ink; with `data-ink="ok|live|fault"`, green, lamp or red.
- `.primary` with `data-ink="fault"`: a destructive main action, in red.
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

<div class="cal-rows"><div><span class="v">Resize product images</span><div class="meta lg">worker 3 · 1 204 jobs · 1m 02s</div></div><div class="sel"><span class="v">…</span></div></div>

<div class="cal-specimens" style="--cols:4"><div class="cal-spec"><svg>…</svg><h4>Ruler</h4><p>…</p></div></div>

<figure class="cal-figure"><svg id="fig"></svg><figcaption><b>Lanes</b>Runs on one time ruler.</figcaption></figure>
```
The selected row (`.sel` or `aria-selected="true"`) boxes its `.v` label in ink, and hovering another row moves the box there (see *The chosen value*). A selected row with no `.v` label is boxed whole, inset. Rows don't tint on hover.

## Form
```html
<div class="cal-field"><label for="lim">daily limit</label><input class="cal-input" id="lim" value="150 000"></div>
<div class="cal-field"><label for="own">owner</label><input class="cal-input" id="own" aria-invalid="true" aria-describedby="own-e"><span class="err" id="own-e">Enter a team name, like payments.</span></div>
<label class="cal-check"><input type="checkbox" checked> <span>Pause new runs at the limit</span></label>
```
Inputs are write-in lines, like the boxes of a title block. `.hint` and `.err` sit under the field. A checked box is a filled ink square with a tick.

### Textarea (editor pane)
```html
<div class="cal-field"><label for="notes">release notes</label>
  <div class="cal-term" data-max="200">
    <textarea class="cal-textarea" id="notes" spellcheck="false" aria-describedby="notes-h"></textarea>
    <div class="bar" aria-hidden="true"><span class="mode">-- normal --</span><span class="sp"></span><span class="pos">ln 1, col 1</span><span class="cal-count"><b>000</b><span>/ 200</span></span></div>
  </div>
  <span class="hint" id="notes-h">Up to 200 characters.</span>
</div>
```
A recessed pane with a block caret and no ruled lines. The status line reads like a terminal's: the mode (`-- insert --` in lamp while typing), the caret's line and column, and the boxed count, which turns red past `data-max` (the pane outline turns red too and the textarea gets `aria-invalid`). The JS keeps the bar current and fires `cal-count` on `.cal-term` (`detail: { length, max, over }`) so the page can swap its hint for an error. The bar is optional; without it the pane is just a quiet textarea.

### Select and option list
```html
<div class="cal-field"><label for="region">region</label>
  <select class="cal-select" id="region">
    <option><span class="v">us-east</span></option>
    <option selected><span class="v">eu-west</span></option>
  </select>
</div>

<div class="cal-list">                                  <!-- an always-open list, or a picker drawn at rest -->
  <div><span class="v">us-east</span> <span class="lg">4 nodes</span></div>
  <div class="sel"><span class="v">eu-west</span> <span class="lg">6 nodes</span></div>
</div>
```
A native select on the write-in line, ending in a ▼. Where the browser supports styled pickers (`appearance: base-select`), the open list is a hairline panel; elsewhere it is the browser's own list. Wrapping each label in `.v` lets the chosen option box its label (older browsers just show the text).

### The chosen value (lists, menus, rows)
The chosen row boxes its `.v` label in an ink hairline, the boxed-value mark. No tint, no lamp bar. The box sits in the row's padding, so text never moves. Hover (or keyboard focus) moves the box: the row under the pointer takes it and the chosen row gives it up until the pointer leaves. A `.cal-rows` row with no `.v` label is boxed whole, inset. Works in `.cal-list`, `.cal-select` options, `.cal-menu` items and `.cal-rows` (`.sel` or `aria-selected="true"`).

### Radio
```html
<div role="radiogroup" aria-label="Rollout" class="cal-stack" style="gap:8px">
  <label class="cal-radio"><input type="radio" name="ro"><span>All at once</span><span class="meta">1 step</span></label>
  <label class="cal-radio"><input type="radio" name="ro" checked><span>Canary</span><span class="meta">5% → 50% → 100%</span></label>
</div>
```
A circle with an ink dot, like a drawing's balloon, so it never reads as the square checkbox. `.meta` adds a muted note.

### Switch
```html
<label class="cal-switch"><span class="txt">Pause new runs at the limit</span><span class="o off">off</span><input type="checkbox" role="switch" checked><span class="o on">on</span></label>
```
A lever on a short track: the square slides across and the word it lands on turns ink. No lamp: a setting being on is not the live thing. Give the label `display:flex` and `.txt` `flex:1` to line switches up in a list.

### Detent choice
```html
<div class="cal-field"><span class="lbl" id="rg-l">time range</span>
  <div class="cal-detent" role="radiogroup" aria-labelledby="rg-l"><i class="mk" aria-hidden="true"></i>
    <label><input type="radio" name="rg" value="1h"><span>1h</span></label>
    <label><input type="radio" name="rg" value="24h" checked><span>24h</span></label>
    <label><input type="radio" name="rg" value="7d"><span>7d</span></label>
  </div>
</div>
```
A choice among a few ordered values, drawn as a short ruler with one detent per value. The lamp ▼ sits over the chosen tick and glides to the next (the JS places `.mk`; without JS the marker still shows, without the glide). `--col` sets the column width (52px). For unordered views, use tabs. `.cal-field > .lbl` styles a label for a group that has no single input.

### Range on a ruler
```html
<div class="cal-field"><label for="alert">alert threshold</label>
  <div class="cal-range" data-unit="%"><output for="alert"></output><input type="range" id="alert" min="0" max="100" step="5" value="80">
    <div class="nums"><span>0</span><span>50%</span><span>100%</span></div></div>
</div>
```
The ticks stand on the slider's own line (minor every 10%, majors at 0, 50%, 100%), the run from zero to the value is drawn heavier, and the handle is a small box with grip lines: ink on hover, lamp while dragging, with a grab cursor. The reading is boxed on a leader above it. The JS sets `--p` and the reading; `data-unit` is appended to it.

### Number and units
```html
<div class="cal-field"><label for="lim">daily limit</label>
  <div class="cal-affixed cal-num"><input class="cal-input" id="lim" inputmode="numeric" value="150 000" data-step="10000" aria-describedby="lim-h"><span class="cal-affix">req / day</span></div>
  <span class="hint focus-only" id="lim-h">↑ ↓ step 10 000 · shift ×10</span>
</div>
```
The value and its unit on one write-in line. `.cal-affixed` shares the line between the input and its prefix or suffix (`$`, `ms`, `.com`). In `.cal-num`, ↑ and ↓ step by `data-step` (Shift ×10, clamped by `data-min`, default 0, and `data-max`), and digits are grouped on blur. `.hint.focus-only` shows only while the field has focus. Invalid input: set `aria-invalid="true"` and the line turns red.

### Search
```html
<div style="display:flex;gap:12px;align-items:center">
  <div class="cal-affixed cal-search"><kbd class="cal-kbd">/</kbd><input class="cal-input" placeholder="search runs" aria-label="Search runs"><button class="cal-btn" aria-label="Clear search" hidden>×</button></div>
  <span class="cal-count"><b>05</b><span>runs</span></span>
</div>
<div class="cal-rows">
  <div><span class="v">Resize product images</span><div class="meta lg">worker 3 · 1 204 jobs</div></div>
  <div class="none" hidden><span>No runs match “<b>zzz</b>”.</span><button class="cal-btn quiet">clear search</button></div>
</div>
```
A write-in line with a `/` key hint, a clear button and a boxed count of matches. Filtering is the page's own: hide rows with `hidden`, wrap matches in `<mark>`, and show the `.none` row when nothing matches.

### Field group
```html
<fieldset class="cal-group"><legend><b>1 · Limits</b><span>applies to every region</span></legend>
  …fields…
</fieldset>
```
A form section whose legend sits on a rule, numbered like a page section. No box around the group.

### Tag input
```html
<div class="cal-chips"><span class="chip">payments<button type="button" aria-label="Remove payments">×</button></span><input aria-label="Add a team" placeholder="add a team, then enter"></div>
```
Boxed words on a write-in line. Enter or a comma adds one, × or Backspace on an empty line removes one, and a repeat lights the tag that is already there. Changes fire `cal-chips` (`detail: { values }`).

### File drop
```html
<label class="cal-drop" data-list="files" data-max="20000000"><input type="file" multiple><span class="lead">drop files here · or <u>browse</u></span><span class="hint">csv or json · up to 20 MB each</span></label>
<div class="cal-rows" id="files"></div>
```
A dashed zone to drop files on or click to browse. The JS lists the chosen files into the `.cal-rows` named by `data-list`, with sizes; a file over `data-max` bytes is flagged in red. Uploading is the page's own (listen for `change` on the input).

### Date and time
`<input type="date" class="cal-input cal-date">` · `<input type="time" class="cal-input cal-date">`. The native inputs on the write-in line in legend type, with the calendar icon swapped for a ▼. The browser's own picker opens.

## Overlays and feedback

### Menu
```html
<button class="cal-btn primary" popovertarget="run-menu">actions ▼</button>
<div popover id="run-menu" class="cal-menu" role="menu" aria-label="Run actions">
  <button class="it" role="menuitem"><span class="n">01</span><span class="v">rerun</span><kbd class="cal-kbd">r</kbd></button>
  <button class="it" role="menuitem"><span class="n">02</span><span class="v">duplicate</span><kbd class="cal-kbd">d</kbd></button>
  <hr><button class="it" role="menuitem" data-ink="fault"><span class="n">03</span><span class="v">delete run</span><kbd class="cal-kbd">⌫</kbd></button>
</div>
```
A native popover anchored under its button. Items are numbered like a parts list, the one under the pointer or keyboard is boxed, shortcuts sit right in key caps, and the destructive item is red below a rule. Opens and closes with no script; the JS adds arrow keys, closes on pick and positions it where anchor positioning is missing. Without `popover` it renders in place.

### Dialog
```html
<button class="cal-btn primary" data-dialog="del">delete run</button>
<dialog class="cal-dialog" id="del" aria-labelledby="del-t"><form method="dialog">
  <header><b id="del-t">delete run 0412</b><span class="sp"></span><kbd class="cal-kbd">esc</kbd></header>
  <div class="bd"><p>The run and its logs are removed.</p><dl class="cal-kv"><dt>jobs</dt><dd>1 204</dd></dl></div>
  <footer><button class="cal-btn" value="cancel" autofocus>cancel</button><button class="cal-btn primary" data-ink="fault" value="delete">delete run</button></footer>
</form></dialog>
```
A panel over the shaded desk with a ruled head, the facts in a key/value sheet and the actions bottom right. `data-dialog="id"` on any button opens it as a modal; `form method="dialog"` closes it and reports the button's `value` in `dialog.returnValue`. A destructive primary takes `data-ink="fault"`. Use it in artifacts in place of `confirm()`, which is blocked.

### Tooltip
`<span data-tip="p99 · 212 ms · 3 regions" tabindex="0">212 ms</span>`. The core mark as a tooltip: a leader up to a boxed value, on hover and keyboard focus, in pure CSS. The box starts at the leader and runs right; `data-tip-end` runs it left (for values near the right edge). `.show` pins it open.

### Callout (notes)
```html
<div class="cal-callout"><div class="cal-gl">notes</div><ol><li>Limits apply per account.</li><li>Retries count.</li></ol></div>
<div class="cal-callout" data-ink="fault"><div class="cal-gl">warning</div><ol><li>Lowering the limit pauses runs at once.</li></ol></div>
```
A drawing's NOTES block with numbered lines. `data-ink="fault"` outlines it in red and keys the legend with the alert hatch.

### Detail callout (disclosure)
```html
<details class="cal-details" open>
  <summary><span class="bl">A</span><b>what counts as a request</b><span class="ld"></span><span class="tg"></span></summary>
  <div class="bd"><div class="inset"><div class="cal-gl">detail A</div>Every call that reaches the API, including retries.</div></div>
</details>
```
Each question is called out like a detail on a drawing: a lettered balloon and a dotted leader running to `[show]`. Open, the balloon fills and a dashed leader drops into an inset labelled DETAIL A. The native element, no script; it animates open where the browser supports it.

### Toast
`Calibrated.toast('Limit saved · 150 000 a day', { ink: 'ok', action: 'undo', onAction: () => … })`. A raised strip bottom right that reports and goes (5 s; `timeout` to change, `0` to keep). `ink: 'live'` shows the lamp star and stays until removed (`el.remove()` on the returned element); `ok` a green check; `fault` a red cross. Toasts share one polite live region. Static markup: `<div class="cal-toast" data-ink="ok"><span class="ic">✓</span><span class="msg">…</span><button class="cal-btn">undo</button></div>`.

### Empty state
```html
<div class="cal-empty"><div><span class="ttl">no runs yet</span><p>Runs show up here as they start.</p><button class="cal-btn primary">start a run</button></div></div>
```
A hatched zone, like an area left blank on a drawing, with a boxed label and one way forward.

### Spinners
```html
<cal-spin></cal-spin>                       <!-- loop dial; size="sm" for inline, label="Loading runs" -->
<span class="cal-scan" role="status" aria-label="Loading"><i></i></span>              <!-- measured bar -->
<span class="cal-scan det" style="--p:.375" aria-hidden="true"><i></i></span>       <!-- filled to 3/8 -->
<span class="cal-wait" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i></span>   <!-- node row -->
```
Drawn from the figures. The loop dial is the loop recipe in small: four square stations on a hairline circle and the lamp star stepping clockwise with an ink arc behind. The measured bar is a hairline frame with an ink run sliding inside and a lamp leading edge; `.det` with `--p` fills it to a known amount. The node row is the progress nodes with the star stepping along, for a line of text or inside a button. Each holds still under `prefers-reduced-motion`.

## Navigation and labels

### Breadcrumb
`<nav class="cal-crumbs" aria-label="Breadcrumb"><ol><li><a href="…">checkout</a></li><li><a href="…">deploys</a></li><li aria-current="page">v2.14.0</li></ol></nav>`. A sheet path in legend type with faint slashes; the current page is ink and not a link.

### Pager
`Calibrated.pager(document.querySelector('nav#pages'), { page: 3, pages: 12, onChange: (p) => … })` draws `[‹ prev] 01 02 [03] 04 … 12 [next ›]` into the nav: bracketed steps, underlined page numbers, the current page boxed and not a link, the middle folded into a faint ellipsis. Returns `{ set(page), page }`.

### Steps (wizard)
```html
<ol class="cal-steps"><li class="done"><span class="s">01</span>source</li><li aria-current="step"><span class="s">02</span>limits</li><li><span class="s">03</span>review</li></ol>
```
The progress nodes with names: done steps filled ink, the current one the lamp star, the rest open squares.

### Status badge
`<span class="cal-badge" data-ink="live"><span class="star"></span>running</span>` · `<span class="cal-badge" data-ink="ok">✓ shipped</span>` · `<span class="cal-badge" data-ink="fault"><span class="cal-dot fault"></span>failed</span>` · `<span class="cal-badge"><span class="cal-dot"></span>queued</span>`. The table's status cell as a boxed word that can sit anywhere.

### Code block
```html
<div class="cal-code" data-lang="shell"><button class="cal-btn">copy</button><pre><code><span class="cm"># deploy, about 6 min</span><span class="ln">git switch main</span><span class="ln">make deploy</span></code></pre></div>
```
A recessed well, no frame, no line numbers. `.ln` lines get a faint `$ ` prompt (not part of the text, so it isn't copied), `.cm` lines are muted, `data-lang` sits in the corner, and the button shows on hover or focus. Copying is the page's own (join the `.ln` lines).

### Key cap
`<kbd class="cal-kbd">esc</kbd>`. A key as a small hairline box.

## Labels and marks
`.cal-kbd` (key cap) · `.cal-legend` (legend type, uppercase) · `.cal-gl` (legend with a rule to the edge) · `.cal-tag` (`.on` for the active side, with its own lamp star) · `.cal-dot` (outlined square = next, `.done`, `.on` live star, `.ok`, `.fault`) · `.cal-rev` (revision triangle) · `.live` (lamp text) · `.star` (the lamp star, inline) · `.cal-mark` (brand mark).

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
- `Calibrated.controls(scope?)`: paint the resting state of `.cal-term`, `.cal-detent` and `.cal-range` (runs on load; call it after inserting them). Their behaviour, and that of `.cal-num`, `.cal-chips`, `.cal-drop`, `[data-dialog]` and `.cal-menu[popover]`, is wired once on the document, so parts added later work without setup.
- `Calibrated.toast(message, { ink, action, onAction, timeout })` and `Calibrated.pager(nav, { page, pages, onChange })`: see Toast and Pager.
- `<cal-spin>`: the loop dial spinner (see Spinners).
- Elements are plain DOM, so frameworks can set attributes directly: `el.setAttribute('value', v)`.
