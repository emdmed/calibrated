<!-- copied from skills/calibrated-figures/references/marks.md by scripts/build-artifact-template.mjs -->
# Marks: reference

All calls return SVG markup strings. Coordinates are in viewBox units: 1 unit = 1px at natural size. Ink arguments take a token name or any CSS colour:

| token | variable | typical use |
|---|---|---|
| `fg` | `--fg` | measured things, values, done nodes |
| `mu` | `--muted` | names in boxes, secondary labels |
| `ky` | `--key` | small text: scale numbers, FIG. numbers, quiet names and tags (holds 4.5:1) |
| `fa` | `--faint` | marks only, never text: major ticks, leaders, open nodes, centre lines (holds 3:1) |
| `ed` | `--edge-strong` | box outlines, ruler baseline, minor ticks |
| `e1` | `--edge` | grids, faint guide lines |
| `lv` | `--live` | the one live thing: the lamp |
| `ok` / `ft` | `--ok` / `--fault` | results, thresholds (green check, red markup) |
| `pn` / `bg` / `well` | panel / raised / well | box fills that knock out lines beneath |
| `swipe` | `--swipe` | a faint lamp tint, as a fill for a live area |
| `glow` | `--glow` | the halo behind the lamp star |
| `title` | `--title` | headline text |

**How `lv` works.** Pass `lv` to `K.t`, `K.line`, `K.path`, `K.rect` (as stroke) or `K.circle` (as stroke) and the text or stroke is drawn in the lamp colour. A live node is the lamp star. As a fill (`K.rect(…, 'lv', …)`), it's the faint `--swipe` tint, not solid lamp: the lamp lights lines, words and outlines, and never fills a box. For a solid lamp segment on a bar (a measured part), pass `'var(--live)'` as the fill.

Labels are 11px legend type. A label's baseline sits at `y`, and its cap height is about 8 units. `Calibrated.textWidth(s)` measures with the real font.

## Text and shapes
- `K.t(x, y, s, ink='mu', anchor='start', letterSpacing=0)`
- `K.line(x1, y1, x2, y2, ink='ed', { w, dash, opacity })`
- `K.path(d, ink='ed', { w, dash, cap, opacity, fill })`
- `K.rect(x, y, w, h, fill='none', stroke='ed', { w, dash, opacity })`
- `K.circle(cx, cy, r, fill='pn', stroke='fg')`
- `K.highlight(x, y, w, h)`: a faint lamp tint behind an area. For the one live region of a figure (the window being measured, the area in use), when lines, labels and outlines can't show it. Draw it before the ink it sits under.
- `K.star(x, y, r=7, ink='lv')`: the lamp, a four-point star with a soft glow. `K.node(…, 'live')` draws it. One per figure.
- `K.centre(x1, y1, x2, y2, ink='fa')`: an ISO long-dash-dot centre line (`10 3 2 3`) for axes and lines of symmetry.

## FIG. label
`K.fig(n, title, x=0, y=11)` draws `FIG.n` in key with the title in muted uppercase. Leave 26 units of headroom below it before the drawing starts.

## Leader + boxed value
- `K.leader([[x,y], [x,y2], [x2,y2]], dot=true)`: an open dot on the measured point, then an elbowed faint line. Use `dot=false` when the line starts on a node.
- `K.box(x, y, w|null, name, value?, valueInk='fg', stroke='ed')`: 19 units tall with one line, 32 with two. The name is muted on top and the value below in `valueInk`. The width grows to fit the text. Pass `null` to size it automatically. For the live callout, use `valueInk='lv', stroke='lv'`: a lamp outline and a lamp value, the name still muted.
- `K.boxWidth(name, value)`: the width a box will take, so you can place it.
- `K.plate(x, y, w|null, name, value, ink='fg')`: a double-ruled 40-unit plate for the one headline result. With `ink='lv'` both rules, the name and the value are in lamp.
- `K.count(x, y, n, ink='fg', pad=0)`: a boxed count, 16 units tall and centred on `y`. Use `pad=2` for zero-padding. With `ink='lv'` the outline and number are in lamp.

Place boxes in a column at the right edge, or under the drawing. Leaders should never cross each other.

## Ruler
`K.ruler(x0, x1, y, max, step, every=5, fmt, up=false, min=0)`: a baseline in `ed`. Minor ticks are 3 units in `ed`. Every `every`-th tick is major: 6 units in `fa`, numbered with `fmt(v)` in `ky` 17 units below the line (or 10 above with `up`). The first number is left-aligned. Ticks are placed by index, so a step of `0.1` prints `0.3`, not `0.30000000000000004`. A step of 0 or less, or `max ≤ min`, draws the baseline alone, and a step that would give more than about 200 ticks is coarsened by a whole multiple.

`K.scale(x0, x1, min, max, { knee, kneeAt=0.4 })` returns `v → x`. With `knee`, it's linear up to the knee (which lands at `kneeAt` of the width), then log10 up to max. Mark the knee on the drawing with a dotted line and a note such as `200 · log beyond`.

## Dimension line
- `K.dim(x1, x2, y, label, ink='mu')`: end ticks of ±4, arrowheads, and the label centred in a gap in the line. If the label is wider than the span, it sits above an unbroken line. Put it 14–26 units above the span it measures.
- `K.vdim(x, y1, y2, label)`: the vertical version, with the label to the right.

## Detail inset
`K.inset(sx0, sx1, sy, dx0, dx1, dy, factor, name)`: two dashed (`2 3`) faint projection lines from a small span on the main scale to a magnified copy, labelled like a drawing detail beside the copy: `DETAIL A  20:1` with a name, `20:1` without. Draw the copy's frame and ticks yourself, or use the `measured` recipe.

## Hatch
- `K.hatch(ink='fa', gap=5, opacity=1)` returns `{ def, url }`. Add `def` once, then use `fill="${url}"`. Ids are unique per call.
- `K.hatchRect(x, y, w, h, ink='fa', stroke='ed', gap=5, opacity=1)`: the same in one call.
- Common hatches: `('fa', 6)` for big read-only regions, `('fa', 4)` for small locked islands, `('ft', 4, .5)` for an over-limit zone. A hatch that means "closed" is drawn in `fa`, not `e1`, so it holds 3:1.

## Nodes
`K.node(x, y, state, size=8)`
- `done`: filled ink square
- `todo`: outlined square in `fa` (next or pending)
- `started`: outlined square with an ink dot (in progress, not live)
- `merge`: outlined diamond, 1.3 stroke
- `live`: the lamp star (radius 0.85 × size) with a soft glow. **One per figure.**
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
  Redrawing swaps only the top-level elements whose markup changed (`Calibrated.patch(svg, markup)`), so a figure redrawn every frame keeps its still parts. Don't edit a drawn svg's children by hand; draw again instead.
- `Calibrated.svg(w, h, markup, label)` returns a complete `<svg>` string.
- `Calibrated.ready(fn)`: runs after fonts load, and again whenever a font loads later.
- `Calibrated.density(el)` returns `'full'` or `'compact'` from the nearest `[data-density]`.
- `Calibrated.weight(el)` returns `'soft'` or `'strong'` from the nearest `[data-weight]`.
- `Calibrated.fmt.k(46000)` → `46k`, `.pct(.046,1)` → `4.6%`, `.dur(252)` → `4m 12s`, `.pad(3)` → `03`.

## Strong weight
The instruments draw these at `data-weight="strong"`; hand-drawn figures can use them too.
- `K.W`: the strong sizes (`rule` 1.5, `tick` 2, `major` 3, `base` 3, `needle` 4, `plate` 2, `lamp` 2.5, `hatch` 2.5 at `pitch` 7, legend weight `wt` 600).
- `K.t(x, y, s, ink, anchor, ls, { fs, wt })`: text at a size and weight.
- `K.hazard(ink = 'ft')`: heavy alert stripes, `K.hatch(ink, 7, 1, 2.5)`. `K.hatch` takes a stroke width as its fourth argument.
- `K.mitre(points, ink, w)`: a polyline with mitred corners and square ends, for heavy scales and leaders that must close without a notch.
- `K.outline(x, y, w, h, ink, sw)`: a rectangle stroked inside its bounds.
- `K.nameplate(x, y, name, value, ink, minW)` / `K.plateWidth(name, value)`: the strong reading box, 40px tall, with an inverted name strip. Ink `fg` or `ft` fills the strip; `lv` only outlines it.
- `K.chip(x, y, s, ink, fs, minW)` / `K.chipWidth(s, fs)`: the strong count, an inverted value centred on `y`; `lv` only outlines it.
- `K.line(…, { cap })` sets a line cap.

The recipes draw their strong forms from the same marks (see `recipes.md`, *Weight*).

## Layout habits
- Natural widths are 420–520 units. Let CSS scale the svg down (`max-width:100%`).
- Leave 18–24 units between rows of a comparison, and 46 between lanes that carry a dimension line.
- Right-hand callout column: x = width − 116, boxes 112 wide, 54 units apart.
- Snap strokes to half-pixels (`x + .5`) only for long 1px frames. Elsewhere, whole numbers are fine.
