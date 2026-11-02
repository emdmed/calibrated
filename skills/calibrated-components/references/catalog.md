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
Ruled cells, a small legend over each value. `--tb-cols` sets the column count above 700px; narrower it is always 2, even when `--tb-cols` is set inline. Values wrap rather than cut off. `.name` spans the full width and sets its value in title caps. `.wide` spans two columns.

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
`.cal-rev` is a red revision triangle with the letter from `data-rev`. Put one in the revision table, in the title block, and beside anything on the page that changed in that revision. Where the letter is already written next to it (`B <span class="cal-rev" data-rev="B">`), add `aria-hidden="true"` so it isn't read twice.

### Stamp
`<span class="cal-stamp">superseded</span>` is a red markup stamp. Add `data-ink="ok"` for an approval (`approved for use`, green) or `data-ink="live"` for a pending verdict (lamp). Red is only for dropped, rejected or superseded. Use it once, for a verdict on the whole page, and only on document pages. Dropped cards get a SUPERSEDED stamp automatically (see Card).

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
    <label class="note" hidden>rework<input class="cal-input" placeholder="what isn’t good enough yet?"></label>   <!-- optional -->
    <button class="cal-btn" data-ink="ok" data-v="keep" aria-pressed="false">keep</button>
    <button class="cal-btn" data-ink="live" data-v="rework" aria-pressed="false">rework</button>   <!-- optional -->
    <button class="cal-btn" data-ink="fault" data-v="drop" aria-pressed="false">drop</button>
  </div>
</article>
```
- `.id` opens the info column: `.no` is an outlined number badge in ink, then where it lives, then an optional `.end` status on the right (`rev B`, or `✓ built` with `data-ink="ok"`). Put it first in `.info`, so it is read first too. The badge turns lamp only on the card in hand: while focus is inside it, or with `aria-current="true"` on the card.
- Then the title, the *why*, and the `cal-kv` sheet (faint keys, muted values) under a hairline.
- `data-state="ok"` turns the badge green. `data-state="dropped"` fades the card to about 60%, tapes it off: a band of oblique red/transparent stripes laid in its top padding (the height doesn't change) with a solid red SUPERSEDED stamp hung from it, and a red outline round the card; the pressed Drop button carries a matching tape swatch. `data-state="rework"` stamps it REWORK in lamp, for an item that stays but isn't good enough yet.
- The sign-off is wired by the kit, no page script. Pressing a button presses only it and sets the card's `data-verdict` (its `data-v`) and `data-state` (`ok`, `rework`, `dropped`); pressing it again clears both. A verdict with another name (`data-v="roll back"`) takes its state from `data-ink`: `fault` drops, `live` reworks. Each change fires `cal-signoff` on the card (`detail: { verdict }`). Call `Calibrated.signoff()` after adding cards, to recount the tally.
- The rework note (`.note`, first in `.cal-sign`) shows when rework is pressed and takes focus; its text goes into the copied sign-off.
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

<div class="cal-tabs" role="tablist" aria-label="Run views">
  <button role="tab" aria-selected="true" aria-controls="p-runs">runs<span class="cal-cnt">4</span></button>
  <button role="tab" aria-controls="p-alerts">alerts<span class="cal-cnt">1</span></button>
</div>
<div id="p-runs">…</div><div id="p-alerts" hidden>…</div>
```
`data-pad` zero-pads the number (no padding by default). Use `data-pad="2"` only for counts that change live, so the layout doesn't jump. Numbers of five digits or more are grouped (`1 234 567`), and an empty `data-n` leaves the markup as written. `data-ink="live"` sets the number and outline in lamp; `ok`/`fault` colour them green or red. In compact density the noun is hidden. After inserting counts dynamically, call `Calibrated.counts(root)`.

The open tab turns ink with a 1px underline, and its count box takes an ink outline. The kit wires the tab pattern: a click, ← → or Home / End selects, the tabs are one Tab stop, and the panel named by each tab's `aria-controls` shows only while its tab is selected. A change fires `cal-tab` on the tab. Call `Calibrated.tabs(root)` after inserting tabs. Name the tablist with `aria-label`. Many tabs scroll sideways rather than wrap. Tabs are for views of different content; to switch a property of the same content (density, units), use `aria-pressed` buttons.

## Block
A group inside a panel: the instruments, a figure, a table, the notes. A block head names it, and blocks are ruled apart so the panel reads as separate parts.
```html
<div class="cal-blocks">                                 <!-- side by side, a hairline between -->
  <div class="cal-block"><div class="cal-block-h">tasks<span>11 of 15</span></div><cal-progress …></cal-progress></div>
  <div class="cal-block"><div class="cal-block-h">budget</div><cal-meter …></cal-meter></div>
</div>
<div class="cal-block"><div class="cal-block-h">channels<span>days running</span></div><figure class="cal-figure">…</figure></div>
```
`.cal-block-h` is a 12px medium caps label in ink, with an optional muted note in a `<span>` (a last span goes to the right). Stacked `.cal-block`s get a hairline and 20px between them; inside `.cal-blocks` they sit side by side with a hairline between. Use them in any panel that holds more than one kind of thing.

## Separators and containers
Use these to split text or ideas apart inside a panel. Each line type has one meaning, taken from drafting, so pick by what the split says:

| the split says | use |
|---|---|
| next topic, same panel | `<hr class="cal-rule">` (`data-weight="strong"` between bigger parts) |
| an aside, a footnote, something proposed | `<hr class="cal-rule" data-line="dashed">` |
| two halves of one thing (before/after, in/out) | `<hr class="cal-rule" data-line="centre">` |
| something was left out here (skipped log lines, omitted rows) | `<hr class="cal-rule" data-line="break" aria-label="38 lines skipped">` |
| a choice between two paths, or a named break | a labelled rule: `<div class="cal-rule">or</div>` |
| everything below is new / over the limit | `<div class="cal-rule" data-ink="live">new since 09:00</div>` (`fault` for a cut-off) |
| a few facts on one line | `<ul class="cal-meta"><li>v2.14.0</li><li>3 regions</li><li>2026-10-31</li></ul>` |
| items in a toolbar row | `<span class="cal-vr" aria-hidden="true"></span>` |
| a named group with an edge (settings, a danger zone, today vs proposed) | `.cal-zone` |
| a few lines that belong together, no box | `.cal-bracket` |
| a group with a head in a panel of several kinds of thing | `.cal-block` (above) |

### Rule
```html
<hr class="cal-rule">                                             <!-- --edge hairline, 20px above and below -->
<hr class="cal-rule" data-line="dashed" data-space="tight">       <!-- data-space: tight 10px · loose 36px -->
<div class="cal-rule">or</div>                                      <!-- label centred in the line -->
<div class="cal-rule" data-align="start">limits<span>per account</span></div>
```
A bare rule must be an `<hr>` (or an empty element): any text inside turns it into a labelled rule. Don't give a labelled rule `role="separator"`: a separator's text isn't read, and the label is the point. A long label wraps between its lines. The label is legend caps in `--key`; a `<span>` after it is a muted sentence-case note. `data-line` (`dashed`, `centre`, `break`) and `data-weight="strong"` draw in `--faint`, since the line type carries the meaning. `data-ink="live"` sets line and label in lamp: use it once per view, for the "new since" line in a feed or log. `fault` and `ok` mark a limit or a passed line.

### Meta and vertical rule
`.cal-meta` is a list of facts split by short hairline ticks, in muted 12.5px. It wraps without starting a line on a tick. Use it in place of hand-typed `a · b · c` strings. `.cal-vr` is a hairline between items in a flex row (a toolbar, a status line); it stretches to the row's height.

### Zone
```html
<section class="cal-zone">
  <div class="cal-zone-h">billing<span>owner only</span><span class="end">2 settings</span></div>
  …
</section>
<div class="cal-zones">                                             <!-- side by side, stacks on narrow screens -->
  <section class="cal-zone"><div class="cal-zone-h">today</div>…</section>
  <section class="cal-zone" data-line="dashed"><div class="cal-zone-h">proposed<span>not decided</span></div>…</section>
</div>
<section class="cal-zone" data-ink="fault"><div class="cal-zone-h">danger zone</div>…</section>
```
A hairline region with its name set into the top edge, like a boxed area on a drawing. It has no fill, so it sits on a panel, a well or the desk alike; don't put a zone around a whole panel (the panel already is one). The head is 11px medium caps in ink; a `<span>` is a muted note; `.end` goes to the right in `--key` caps. `data-line="dashed"` means optional, proposed or not decided yet. `data-ink="live"` outlines the one live group in lamp; `fault` is for destructive settings; `ok` for a group that passed. Without a head it's a plain hairline box. Don't nest zones more than one deep.

### Bracket
```html
<div class="cal-bracket">
  <div class="cal-bracket-h">before you deploy<span>3 checks</span></div>
  <p>Tests pass on main.</p><p>The changelog names the release.</p><p>Someone on call knows.</p>
</div>
```
A hairline `[` with a tick at its middle that binds a few lines into one idea without boxing them. Lighter than a zone: use it in running text, lists and notes. The head is optional. `data-ink` works as on the zone.

In app mode, rule labels and zone and bracket heads drop the caps and go to 12px, so write them in sentence case ("Danger zone").

## App mode
`data-mode="app"` on any ancestor (the screen, a dialog, a form) marks it as a tool rather than a document: section heads lose their sheet number, and section heads, table heads and key/value keys switch to sentence case. Use it on settings screens, forms and dialogs. Leave out FIG labels, title blocks, revision triangles and stamps there too.

## Buttons
Buttons come in tiers, so the main action always leads. All are 12px legend caps.
- `.primary`: the one main action in a view, **filled with ink** (panel-coloured text). Give it a verb label ("send for approval"). One per view.
- `.primary` with `data-ink="fault"`: a destructive main action, filled red.
- default `<button class="cal-btn">preview</button>`: every other action, **a hairline box** in `--edge-strong` that turns ink on hover. Keep / rework / drop, prev / next, open a dialog.
- `.inline`: a bracketed word, `[copy]`, for small actions in running text. Buttons inside toasts, affixed fields and code blocks get this look automatically.
- `.quiet`: an underlined word for cancel, back and navigation links. Put it on the side away from the primary. `aria-current="page"` turns it ink.
- `aria-pressed="false"` is muted; `aria-pressed="true"` turns text and box ink, or green, lamp or red with `data-ink="ok|live|fault"`.
- `disabled`: faint; a disabled primary loses its fill and goes dashed. For a busy button that must keep focus, use `aria-disabled="true"` (it looks disabled and ignores presses) and put a `.cal-wait` inside.
- Brackets on inline buttons are drawn, not read: the accessible name stays "copy".

## Tally (sign-off bar; add `.sticky` to pin it)
```html
<div class="cal-tally"><span data-tally="n">0 of 3 signed</span><span class="sp"></span><span data-tally="msg" class="mut" role="status"></span><button class="cal-btn primary" data-tally="copy">copy sign-off</button></div>
```
The kit fills `[data-tally="n"]` with "n of N signed" (N counts the cards that have sign-off buttons) and the copy button copies one line per card: number, title, verdict and the rework note. If the clipboard is blocked, the lines appear selected in a read-only text box under the tally and the message says so. The older `#tally-n`, `#tally-msg` and `#tally-copy` ids still work.

## Table
```html
<table class="cal-table">
  <thead><tr><th>no</th><th>figure</th><th>where</th><th>diff</th><th>effort</th><th>status</th></tr></thead>
  <tbody>
    <tr><td>01</td><td>Load test lanes</td><td>release checklist</td><td><cal-diff added="212" removed="38"></cal-diff></td><td class="effort" aria-label="effort 2 of 3"><span class="cal-dot done"></span><span class="cal-dot done"></span><span class="cal-dot"></span></td><td class="st" data-ink="live">in review</td></tr>
    <tr><td>02</td><td>Error budget ruler</td><td>SLO panel</td><td><cal-diff added="84" removed="12"></cal-diff></td><td class="effort" aria-label="effort 1 of 3"><span class="cal-dot done"></span><span class="cal-dot"></span><span class="cal-dot"></span></td><td class="st" data-ink="ok">shipped</td></tr>
  </tbody>
</table>
```
A parts list on a panel: legend heads over an `--edge-strong` hairline, the first column in muted legend type. Use `.num` for right-aligned numbers, `.effort` for effort as filled and open `.cal-dot`s (give the cell an `aria-label` like "effort 2 of 3"), and `.st` (+ `data-ink`) for status. A live status is lamp text with a small star; ok gets a check drawn by the CSS, so don't type one. Instruments in a cell draw in compact form unless a `[data-density]` is set around the table. Below 700px the table scrolls sideways, with the cut-edge cue.

## Tiers, rows, specimens, figure
```html
<div class="cal-tiers"><div><div class="tt">Draw next</div><p>…</p></div><div><div class="tt">Leave alone</div><p>…</p></div></div>

<div class="cal-rows"><div><span class="v">Resize product images</span><div class="meta lg">worker 3 · 1 204 jobs · 1m 02s</div></div><div class="sel"><span class="v">…</span></div></div>

<div class="cal-specimens" style="--cols:4"><div class="cal-spec"><svg>…</svg><h4>Ruler</h4><p>…</p></div></div>

<figure class="cal-figure"><svg id="fig"></svg><figcaption><b>Lanes</b>Runs on one time ruler.</figcaption></figure>
```
The selected row (`.sel`, `aria-selected="true"` or `aria-current="true"`) boxes its `.v` label in ink and keeps the box; hovering or focusing another row gives that one a faint box. A selected row with no `.v` label is boxed whole, inset. Rows don't tint on hover. When rows are links or buttons, mark the chosen one with `aria-current` so it is heard, not only seen.

## Form
```html
<div class="cal-field"><label for="lim">daily limit</label><input class="cal-input" id="lim" value="150 000"></div>
<div class="cal-field"><label for="own">owner</label><input class="cal-input" id="own" aria-invalid="true" aria-describedby="own-e"><span class="err" id="own-e">Enter a team name, like payments.</span></div>
<label class="cal-check"><input type="checkbox" checked> <span>Pause new runs at the limit</span></label>
```
Inputs are write-in lines, like the boxes of a title block. Labels are sentence case. `.hint` and `.err` sit under the field. A checked box is a hairline square with a small ink square inside; an indeterminate one shows a short ink bar. A `required` input adds a small REQUIRED word after its label (drawn, not read: the input is already announced as required). A `readonly` input has a dotted line and no lamp on focus. Invalid and focused keeps the red line and shows focus as the lamp outline. Selects, textareas, ranges and detents draw `disabled` and `aria-invalid` the same way.

### Textarea (editor pane)
```html
<div class="cal-field"><label for="notes">release notes</label>
  <div class="cal-term" data-max="200">
    <textarea class="cal-textarea" id="notes" spellcheck="false" aria-describedby="notes-h"></textarea>
    <div class="bar" aria-hidden="true"><span class="sp"></span><span class="cal-count"><b>0</b><span>/ 200</span></span></div>
  </div>
  <span class="hint" id="notes-h">Up to 200 characters.</span>
</div>
```
A recessed pane with a block caret and no ruled lines. By default the status line shows only the boxed count, which turns red past `data-max` (the pane outline turns red too and the textarea gets `aria-invalid`). The JS keeps the bar current and fires `cal-count` on `.cal-term` (`detail: { length, max, over }`) so the page can swap its hint for an error. The count is drawn, not read, so name the limit in the hint ("Up to 200 characters.") and put the over-limit reason there too. The bar is optional; without it the pane is just a quiet textarea. For code, commit messages or prompts, add `data-status="editor"` to `.cal-term` and put `<span class="mode">-- normal --</span>` and `<span class="pos">ln 1, col 1</span>` in the bar: it then reads like a terminal's (the mode in lamp while typing, the caret's line and column, a zero-padded count). Without `data-status="editor"`, `.mode` and `.pos` stay hidden.

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
<label class="cal-switch caps"><span class="txt">Sandbox</span><input type="checkbox" role="switch" checked></label>
<label class="cal-switch"><span class="txt">Pause new runs at the limit</span><input type="checkbox" role="switch"></label>
```
A small hairline pill with a round knob. Off, a faint knob rests on the left; on, it slides right and turns ink, and the pill takes the faint wash. It is rounded, like the radio, so it never reads as the square checkbox. No lamp: a setting being on is not the live thing. `.caps` sets the label in legend caps for toolbars and status bars (`INDEX ( ●)`); leave it off in forms. OFF/ON words are optional: add `<span class="o off" aria-hidden="true">off</span>` before the input and `<span class="o on" aria-hidden="true">on</span>` after it, and the word for the current state turns ink. Keep `aria-hidden` on them: the switch already reports its state, and the words would join its name. A click on a word sets that state. A `disabled` switch fades to 50%. The whole label is the hit area (24px tall). Give the label `display:flex` and `.txt` `flex:1` to line switches up in a list. Size it with `--sw-w`, `--sw-h` and `--sw-knob`.

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
  <div class="cal-affixed cal-num"><input class="cal-input" id="lim" inputmode="numeric" value="150 000" data-step="10000" aria-describedby="lim-u lim-h"><span class="cal-affix" id="lim-u">req / day</span></div>
  <span class="hint focus-only" id="lim-h">↑ ↓ step 10 000 · shift ×10</span>
</div>
```
The value and its unit on one write-in line. `.cal-affixed` shares the line between the input and its prefix or suffix (`$`, `ms`, `.com`). In `.cal-num`, ↑ and ↓ step by `data-step` (Shift ×10, clamped by `data-min`, default 0, and `data-max`) at the step's precision, so 1.5 steps to 2.0. On blur the integer part is grouped, a typed value is clamped, and text that isn't a number gets `aria-invalid`. The kit makes the input a spinbutton (`aria-valuenow`, `-min`, `-max`, and the value with its unit). Name the unit with `aria-describedby`, as above. Touch keyboards can't step: give the field a sensible default. `.hint.focus-only` shows only while the field has focus. Invalid input: set `aria-invalid="true"` and the line turns red.

### Search
```html
<div style="display:flex;gap:12px;align-items:center">
  <div class="cal-affixed cal-search"><kbd class="cal-kbd" aria-hidden="true">/</kbd><input class="cal-input" placeholder="search runs" aria-label="Search runs" data-key="/" aria-keyshortcuts="/"><button type="button" class="cal-btn" aria-label="Clear search" hidden>×</button></div>
  <span class="cal-count"><b>05</b><span>runs</span></span>
</div>
<div class="cal-rows">
  <div><span class="v">Resize product images</span><div class="meta lg">worker 3 · 1 204 jobs</div></div>
  <div class="none" hidden><span>No runs match “<b>zzz</b>”.</span><button class="cal-btn quiet">clear search</button></div>
</div>
```
A write-in line with a `/` key hint, a clear button and a boxed count of matches. `data-key="/"` on the input (any field works) makes that key, pressed outside a text field, focus it; draw the key cap beside it. The `.cal-btn` in `.cal-search` is the clear button: the kit shows it while the input has text, and a press empties the input, fires `input` and returns focus. Filtering is the page's own: hide rows with `hidden`, wrap matches in `<mark>`, show the `.none` row when nothing matches, and update the count.

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
Boxed words on a write-in line. Enter or a comma adds one, × or Backspace on an empty line removes one, and a repeat lights the tag that is already there. Adds and removals are announced. Long tags wrap inside their box. Changes fire `cal-chips` (`detail: { values }`).

### File drop
```html
<label class="cal-drop" data-list="files" data-max="20000000"><input type="file" multiple accept=".csv,.json"><span class="lead">drop files here · or <u>browse</u></span><span class="hint">csv or json · up to 20 MB each</span></label>
<div class="cal-rows" id="files"></div>
```
A dashed zone to drop files on or click to browse. The JS lists the chosen files into the `.cal-rows` named by `data-list`, with sizes, and makes that list a polite live region so the result is heard. A file over `data-max` bytes, or one that doesn't match the input's `accept` (dropped files skip the browser's own filter), is flagged in red with the reason. Set `accept` and say the same types in the hint. Uploading is the page's own (listen for `change` on the input).

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
A native popover anchored under its button. Items are numbered like a parts list, the one under the pointer or keyboard is boxed, shortcuts sit right in key caps, and the destructive item is red below a rule. Opens and closes with no script. The JS finishes the menu pattern: Enter, Space or ↓ on the button open it on the first item (↑ on the last); ↑ ↓ Home End move; the key in an item's `.cal-kbd` (or its `data-key`) picks it while the menu is open, and is set as its `aria-keyshortcuts`; Tab or a pick closes it; Esc closes and returns focus to the button. It also positions the menu where anchor positioning is missing. Without `popover` it renders in place.

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
`<span data-tip="p99 · 212 ms · 3 regions" tabindex="0">212 ms</span>`. The core mark as a tooltip: a leader up to a boxed value, on hover and keyboard focus. The box starts at the leader and runs right; the JS runs it left when it would leave the screen, and `data-tip-end` always does. The pointer can move onto the box, Esc hides it until the pointer or focus leaves, and the words are read through `aria-describedby` (the JS adds it), not from the drawing. `.show` pins it open. Keep tips to a short value: touch has no hover, so never hide the only copy of a fact in one.

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
`Calibrated.toast('Limit saved · 150 000 a day', { ink: 'ok', action: 'undo', onAction: () => … })`. A raised strip bottom right that reports and goes after 5 s (`timeout` to change, `0` to keep). A toast with an `action`, or with `ink: 'live'`, stays until dismissed unless you give a `timeout`, so the action can be reached. The timer pauses while the toast is hovered or holds focus, and when a focused toast goes, focus returns to where it was. `ink: 'live'` shows the lamp star (`el.remove()` on the returned element to end it); `ok` a green check; `fault` a red cross. Every toast has a `[hide]` button. Toasts share one polite live region, made at load so the first one is heard. Static markup: `<div class="cal-toast" data-ink="ok"><span class="ic">✓</span><span class="msg">…</span><button class="cal-btn">undo</button></div>`.

### Empty state
```html
<div class="cal-empty"><div><p class="ttl" role="heading" aria-level="3">no runs yet</p><p>Runs show up here as they start.</p><button class="cal-btn primary">start a run</button></div></div>
```
A dashed blank area, like space left on a drawing for something to come, with a boxed label and one way forward. No hatch: hatch means closed. Give `.ttl` the heading level that fits the page.

### Spinners
```html
<cal-spin></cal-spin>                       <!-- braille ring; size="sm" for inline, label="Loading runs" -->
<span class="cal-wait" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i></span>   <!-- braille row -->
<button class="cal-btn" aria-disabled="true"><span class="cal-wait" aria-hidden="true"><i></i><i></i><i></i><i></i></span>saving</button>
<div class="cal-readout" role="status">                                                  <!-- waiting line -->
  <span class="cal-wait" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="lb">fetching rows</span><span class="ld"></span><cal-elapsed></cal-elapsed>
</div>
<div class="cal-readout" data-ink="ok"><i class="nd"></i><span class="lb">fetched 1 204 rows</span><span class="ld"></span><span class="tm">00:03.4</span></div>
```
Braille, stepped in whole frames like a terminal redraw: 8 frames of 80 ms, the lamp dot is the head and two ink dots trail it. `<cal-spin>` is a 3×3 dot ring (48 px, or 16 px with `size="sm"`) for an empty panel or a loading area. `.cal-wait` is the braille cell on its side, four dots by two, for a line of text or inside a button; its four `<i>` are its columns. The readout is the waiting line for work that takes a while: the braille row, what is happening, a dotted leader and the time so far boxed by `<cal-elapsed>` (`mm:ss.t`, or `since="<epoch ms>"` to start from a known time). Give it `data-ink="ok"` or `"fault"` when the work ends: the clock stops on its last time and turns green or red; for a static result, swap the row for `<i class="nd"></i>` and the clock for `<span class="tm">`. The clock is hidden from screen readers while it runs, so the status line isn't read out every 100 ms. For a known amount, use `<cal-progress>` or `<cal-meter>`. Under `prefers-reduced-motion` the dots hold the first frame and the clock counts whole seconds. A busy button takes `aria-disabled="true"`, which keeps focus on it and makes it look and act disabled. The older measured bar (`.cal-scan`, `.cal-scan.det` with `--p`) still renders for pages that use it.

## Navigation and labels

### Breadcrumb
`<nav class="cal-crumbs" aria-label="Breadcrumb"><ol><li><a href="…">checkout</a></li><li><a href="…">deploys</a></li><li aria-current="page">v2.14.0</li></ol></nav>`. A sheet path in legend type with faint slashes; the current page is ink and not a link.

### Pager
`Calibrated.pager(document.querySelector('nav#pages'), { page: 3, pages: 12, onChange: (p) => … })` draws `[‹ prev]  1 2 [3] 4 … 12  [next ›]` into the nav: bracketed inline steps, underlined page numbers, the current page boxed and not a link, the middle folded into a faint ellipsis. It draws buttons by default; pass `href: (p) => '?page=' + p` to draw links instead. Focus stays where it was pressed: on the step (kept focusable with `aria-disabled` at the ends) or on the new current page. Out-of-range pages are clamped. Returns `{ set(page), page }`.

### Steps (wizard)
```html
<ol class="cal-steps"><li class="done"><span class="s">01</span>source</li><li aria-current="step"><span class="s">02</span>limits</li><li><span class="s">03</span>review</li></ol>
```
The progress nodes with names: done steps filled ink (read as "done"), the current one an ink star (a wizard step is where you are, not a running thing, so no lamp), the rest open squares. Many steps scroll sideways rather than squeeze.

### Status badge
`<span class="cal-badge" data-ink="live"><span class="star"></span>running</span>` · `<span class="cal-badge" data-ink="ok">✓ shipped</span>` · `<span class="cal-badge" data-ink="fault"><span class="cal-dot fault"></span>failed</span>` · `<span class="cal-badge"><span class="cal-dot"></span>queued</span>`. The table's status cell as a boxed word that can sit anywhere.

### Code block
```html
<div class="cal-code" data-lang="shell"><button type="button" class="cal-btn">copy</button><pre tabindex="0"><code><span class="cm"># deploy, about 6 min</span><span class="ln">git switch main</span><span class="ln">make deploy</span></code></pre></div>
```
A recessed well, no frame, no line numbers. `.ln` lines get a faint `$ ` prompt (not part of the text, so it isn't copied), `.cm` lines are muted, `data-lang` sits in the corner, and the button shows on hover or focus (always, on touch screens). `tabindex="0"` on the `pre` lets keyboard users scroll a long line. Copying is the page's own (join the `.ln` lines).

### Key cap
`<kbd class="cal-kbd">esc</kbd>`. A key as a small hairline box.

## Labels and marks
`.cal-kbd` (key cap) · `.cal-legend` (legend type, uppercase) · `.cal-gl` (legend with a rule to the edge) · `.cal-tag` (`.on` for the active side, with its own lamp star) · `.cal-dot` (outlined square = next, `.done`, `.on` live star, `.ok`, `.fault`) · `.cal-rev` (revision triangle) · `.live` (lamp text) · `.star` (the lamp star, inline) · `.cal-mark` (brand mark) · `.cal-sr` (read by screen readers, not drawn: for the words a mark stands for).

---

## Instruments (custom elements)

All instruments accept `density="full|compact"`, and otherwise follow the nearest `[data-density]`; inside a `.cal-table` with no density set they draw compact. Each one draws an `<svg role="img">` with a `<title>` and an `aria-label`, and compact keeps a bare reading beside the marks. A drawing wider than its box shrinks to 80%, then scrolls sideways with a cut-edge cue and becomes a named Tab stop. Bad attributes are drawn the safe way and reported once with `console.warn`.

**One lamp.** An instrument only lights what is live: a meter's needle is ink unless you add `live`, and progress and durations light only their first live item.

**Past the end.** A value past the scale stops at the end, breaks off in a red break mark and states its real value (a meter at 140 of 100 reads "140 / 100 · 140%" and says "over by 40").

Every instrument moves on one shared clock: it sweeps in when half in view, glides from where it is when an attribute changes (220–700ms, ease-out, unless noted), and its reading blinks twice when it settles. The `aria-label` and `<title>` always state the final value. `prefers-reduced-motion` or the `still` attribute draws the value at once.

### `<cal-meter>`
| attr | default | |
|---|---|---|
| `value`, `max` | 0, 100 | |
| `warn` | 0.8 × max | start of the red-hatched alert zone; the fill turns fault past it |
| `live` | off | the lamp needle, for the one meter that is live |
| `label` | `value` | name in the box and the aria sentence |
| `format` | `k` | `k` (46k, 1M) · `raw` · `pct` (value and max as fractions: 0.46 of 1) · `dur` |
| `unit` | | appended after `k`/`raw` |
| `width` | 420 full / 144 compact | |
| `still` | off | no motion: draw the value at once |

Full: ticks numbered 0/50/100%, alert line with value, a needle, boxed reading on a leader. Compact: the meter plus `46k/1M`.

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
`min`, `max`, `step`, `every`, `unit`, `width`, `up` (labels above), `value` (a lamp ▼ marker with its value boxed beside it), `still`. A value outside the scale pins the marker to the end, boxes the value in red and says it is beyond the scale. Ticks are capped at 200: a step too small for the range widens to a round one.

Instruments draw their final values when printed. Motion: the marker sweeps in from `min`, then glides to new values. The scale holds still; a ruler with no value has no motion.

### JS
- `Calibrated.redraw(scope?)`: force a redraw of every instrument (for example after changing CSS variables by hand).
- `Calibrated.counts(scope?)`: fill `.cal-count[data-n]`.
- `Calibrated.sheets(scope?)`: add zone labels to `.cal-sheet[data-zones]`.
- `Calibrated.controls(scope?)`: paint the resting state of `.cal-term`, `.cal-detent` and `.cal-range` (runs on load; call it after inserting them). Their behaviour, and that of `.cal-num`, `.cal-chips`, `.cal-drop`, `[data-dialog]` and `.cal-menu[popover]`, is wired once on the document, so parts added later work without setup.
- `Calibrated.tabs(scope?)`: paint the resting state of `.cal-tabs[role=tablist]` (runs on load). Fires `cal-tab`.
- `Calibrated.signoff()`: recount every `.cal-tally` (runs on load; call it after adding cards). Fires `cal-signoff`.
- `Calibrated.toast(message, { ink, action, onAction, timeout })` and `Calibrated.pager(nav, { page, pages, onChange, href })`: see Toast and Pager.
- The controls, toast, pager, tabs, sign-off, `<cal-spin>` and `<cal-elapsed>` work without `calibrated-figures.js`; the instruments need it loaded first.
- `<cal-spin>`: the braille ring spinner (see Spinners).
- `<cal-elapsed>`: the readout's clock; `since`, `stopped` (see Spinners).
- Elements are plain DOM, so frameworks can set attributes directly: `el.setAttribute('value', v)`.
