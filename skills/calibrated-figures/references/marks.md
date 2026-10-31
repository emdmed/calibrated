# Marks: reference

All calls return SVG markup strings. Coordinates are in viewBox units: 1 unit = 1px at natural size. Ink arguments take a token name or any CSS colour:

| token | variable | typical use |
|---|---|---|
| `fg` | `--fg` | measured things, values, done nodes |
| `mu` | `--muted` | names in boxes, secondary labels |
| `fa` | `--faint` | major ticks, scale numbers, leaders, FIG., centre lines |
| `ed` | `--edge-strong` | box outlines, ruler baseline, minor ticks |
| `e1` | `--edge` | grids, faint guide lines |
| `lv` | `--fg` + a `--swipe` underneath | the one live thing (highlighted, not coloured) |
| `ok` / `ft` | `--ok` / `--fault` | results, thresholds (green check, red markup) |
| `pn` / `bg` / `well` | panel / raised / well | box fills that knock out lines beneath |
| `swipe` | `--swipe` | the highlighter colour itself, as a fill |
| `title` | `--title` | headline text |

**How `lv` works.** Pass `lv` to `K.t`, `K.line`, `K.path`, `K.rect` (as stroke) or `K.circle` (as stroke) and the kit draws a highlighter swipe first (a band behind text, a wide stroke behind lines and paths, a halo behind circles), then the shape in plain ink on top. As a fill (`K.rect(…, 'lv', …)`), it fills with the swipe.

Labels are 11px legend type. A label's baseline sits at `y`, and its cap height is about 8 units. `Calibrated.textWidth(s)` measures with the real font.

## Text and shapes
- `K.t(x, y, s, ink='mu', anchor='start', letterSpacing=0)`
- `K.line(x1, y1, x2, y2, ink='ed', { w, dash, opacity })`
- `K.path(d, ink='ed', { w, dash, cap, opacity, fill })`
- `K.rect(x, y, w, h, fill='none', stroke='ed', { w, dash, opacity })`
- `K.circle(cx, cy, r, fill='pn', stroke='fg')`
- `K.highlight(x, y, w, h)`: a highlighter swipe behind any area. Draw it before the ink it sits under.
- `K.centre(x1, y1, x2, y2, ink='fa')`: an ISO long-dash-dot centre line (`10 3 2 3`) for axes and lines of symmetry.

## FIG. label
`K.fig(n, title, x=0, y=11)` draws `FIG.n` in faint with the title in muted uppercase. Leave 26 units of headroom below it before the drawing starts.

## Leader + boxed value
- `K.leader([[x,y], [x,y2], [x2,y2]], dot=true)`: an open dot on the measured point, then an elbowed faint line. Use `dot=false` when the line starts on a node.
- `K.box(x, y, w|null, name, value?, valueInk='fg', stroke='ed')`: 19 units tall with one line, 32 with two. The name is muted on top and the value below in `valueInk`. The width grows to fit the text. Pass `null` to size it automatically. For the live callout, use `valueInk='lv', stroke='lv'`: the box fills with the swipe and keeps an ink outline.
- `K.boxWidth(name, value)`: the width a box will take, so you can place it.
- `K.plate(x, y, w|null, name, value, ink='fg')`: a double-ruled 40-unit plate for the one headline result. With `ink='lv'` the plate sits on a highlight.
- `K.count(x, y, n, ink='fg', pad=0)`: a boxed count, 16 units tall and centred on `y`. Use `pad=2` for zero-padding.

Place boxes in a column at the right edge, or under the drawing. Leaders should never cross each other.

## Ruler
`K.ruler(x0, x1, y, max, step, every=5, fmt, up=false, min=0)`: a baseline in `ed`. Minor ticks are 3 units in `ed`. Every `every`-th tick is major: 6 units in `fa`, numbered with `fmt(v)` 17 units below the line (or 10 above with `up`). The first number is left-aligned.

`K.scale(x0, x1, min, max, { knee, kneeAt=0.4 })` returns `v → x`. With `knee`, it's linear up to the knee (which lands at `kneeAt` of the width), then log10 up to max. Mark the knee on the drawing with a dotted line and a note such as `200 · log beyond`.

## Dimension line
- `K.dim(x1, x2, y, label, ink='mu')`: end ticks of ±4, arrowheads, and the label centred in a gap in the line. If the label is wider than the span, it sits above an unbroken line. Put it 14–26 units above the span it measures.
- `K.vdim(x, y1, y2, label)`: the vertical version, with the label to the right.

## Detail inset
`K.inset(sx0, sx1, sy, dx0, dx1, dy, factor, name)`: two dashed (`2 3`) faint projection lines from a small span on the main scale to a magnified copy, labelled like a drawing detail beside the copy: `DETAIL A  20:1` with a name, `20:1` without. Draw the copy's frame and ticks yourself, or use the `measured` recipe.

## Hatch
- `K.hatch(ink='fa', gap=5, opacity=1)` returns `{ def, url }`. Add `def` once, then use `fill="${url}"`. Ids are unique per call.
- `K.hatchRect(x, y, w, h, ink='fa', stroke='ed', gap=5, opacity=1)`: the same in one call.
- Common hatches: `('e1', 6)` for big read-only regions, `('fa', 4)` for small locked islands, `('ft', 4, .5)` for an over-limit zone.

## Nodes
`K.node(x, y, state, size=8)`
- `done`: filled ink square
- `todo`: outlined square (next or pending)
- `started`: outlined square with an ink dot (in progress, not live)
- `merge`: outlined diamond, 1.3 stroke
- `live`: an ink dot (radius size/2) on a highlight disc (radius size). **One per figure.**
- `fault`: filled fault-red square (needs attention)

`K.nodes(x0, y, step, states, { size, line })` draws a row on a faint line. `K.states(n, done, liveIdx, faultIdx)` builds the array of states.

## Numbered command
`K.cmd(x, y, n, 'command', ink='fg', anchor='start'|'end')`: a 14-unit box with the step number, then `$ command`. Use `end` to right-align it against `x`. Join it to its node with a `leader(..., false)`.

## Others
- `K.bracket(x, y0, y1, n, ink='fg', side='left')`: groups rows, with a count tab halfway.
- `K.cross(x, y, r=6)`: an origin or centre mark.
- `K.threshold(x, yTop, yBot, label, anchor)`: a fault line at 70% opacity with its label.
- `K.tag(y, 'FULL')`: a faint uppercase row tag at the left edge, for full/compact comparisons.

## Mounting
- `Calibrated.draw(svgOrSelector, markup, label)`: fills the svg and sets `data-cal`, `viewBox` (from width/height when missing), `role="img"` and `aria-label`.
- `Calibrated.svg(w, h, markup, label)` returns a complete `<svg>` string.
- `Calibrated.ready(fn)`: runs after fonts load, and again whenever a font loads later.
- `Calibrated.density(el)` returns `'full'` or `'compact'` from the nearest `[data-density]`.
- `Calibrated.fmt.k(46000)` → `46k`, `.pct(.046,1)` → `4.6%`, `.dur(252)` → `4m 12s`, `.pad(3)` → `03`.

## Layout habits
- Natural widths are 420–520 units. Let CSS scale the svg down (`max-width:100%`).
- Leave 18–24 units between rows of a comparison, and 46 between lanes that carry a dimension line.
- Right-hand callout column: x = width − 116, boxes 112 wide, 54 units apart.
- Snap strokes to half-pixels (`x + .5`) only for long 1px frames. Elsewhere, whole numbers are fine.
