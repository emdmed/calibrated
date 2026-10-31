---
name: calibrated-figures
description: Draw quantities as small technical figures in the Calibrated style (warm ink in hairlines on quiet panels, with an amber lamp for the one live thing) with a dependency-free vanilla JS SVG kit. It has rulers, leader lines to boxed values, dimension lines, detail insets ("DETAIL A 20:1"), hatching, status nodes, numbered commands, FIG. labels and centre lines, plus ready-made recipes (lanes on a time ruler, budget with pace, merge/branch plan, fan-out, loop, measured inset, timeline, matrix, section drawing). Use when a UI explains a number, progress, duration, size, threshold, structure or process with text and a drawing would say it faster, or when asked for "calibrated figures", technical-drawing charts, engineering-drawing or blueprint-style diagrams or annotated SVG in plain JS.
---

# Calibrated · figures

A figure replaces a sentence, a list or a column of numbers that the UI already shows, using data it already has. It's built only from eight marks, drawn in ink, with the lamp on the one live thing.

Needs **calibrated-tokens** (`calibrated.css`) on the page. All colours are CSS variables, so figures follow the theme without redrawing.

## Files (copy into the project)
- `assets/calibrated-figures.js`: the kit. Defines `window.Calibrated` with `K` (the marks), `draw`, `svg`, `ready`, `density`, `fmt` and `textWidth`.
- `assets/calibrated-recipes.js`: optional. Whole figures from data: `Calibrated.recipes.*`, plus `mount` and `render`.
- `references/marks.md`: every primitive, with its signature and geometry. Read it before you draw by hand.
- `references/recipes.md`: the data shape of each recipe, and when to use it.
- `references/drawing-quality.md`: the quality bar and the failures to avoid (flowcharts, lamp fills, figures lost in empty frames). Read it before drawing anything new.

Load as classic scripts (they work from `file://` and inside artifacts):
```html
<script src="js/calibrated-figures.js"></script>
<script src="js/calibrated-recipes.js"></script>
```

## The eight marks
| mark | call | means |
|---|---|---|
| leader + boxed value | `K.leader(pts)` + `K.box(x,y,w,name,value)` | a dot on what's measured, an elbow, the name over the value |
| ruler | `K.ruler(x0,x1,y,max,step,every,fmt)` | the one scale of the figure; numbers at major ticks only |
| dimension line | `K.dim(x1,x2,y,'4m 12s')` | a span with its length written into the gap |
| detail inset | `K.inset(sx0,sx1,sy,dx0,dx1,dy,20,'A')` | dashed projection to a magnified part, labelled `DETAIL A  20:1` |
| hatch | `K.hatchRect(...)`, `K.hatch()` | read-only, locked, out of reach, over the limit |
| nodes | `K.node(x,y,'done'│'todo'│'merge'│'live'│'fault'│'started')` | ■ done, □ next, ◇ merge, ✦ live (the lamp star), ■ fault (red) |
| numbered command | `K.cmd(x,y,'1','git switch main')` | a step number in a box, then the exact command |
| FIG. label | `K.fig(1,'load test · 3 regions')` | top-left of every figure; a stable number |

Helpers: `K.t` (text), `K.line`, `K.path`, `K.rect`, `K.circle`, `K.star` (the lamp star), `K.highlight` (a faint lamp tint behind an area, rarely needed), `K.centre` (dash-dot centre line), `K.count` (boxed zero-padded count), `K.plate` (double-ruled headline result), `K.vdim`, `K.bracket`, `K.cross`, `K.threshold`, `K.nodes`/`K.states`, `K.scale` (linear, or linear then log past a knee), `K.tag`.

## Rules
1. **Every figure has a FIG. label** top-left: `FIG.n` in faint, the title in muted uppercase.
2. **One scale per figure.** Number the major ticks only (every 5th). Put the unit on the numbers (`10m`, `50k`), never in a separate axis title.
3. **Ink by role.** Measured things are `fg`. Scaffolding (ticks, leaders, grids) is `fa`/`ed`/`e1`. Secondary labels are `mu`. Axes and symmetry lines are centre lines (`K.centre`). **The lamp marks exactly one thing**: the running lane, the current step, the predicted value. Pass ink `lv` and the stroke, text or box outline turns lamp amber; a live node is a small glowing star. `ok`/`ft` only for results and thresholds.
4. **Box the value, lead to it.** Values sit in boxes (`K.box`) attached by leaders, and never float next to a mark. The headline result gets a `K.plate`.
5. **Lengths are lengths.** Durations and sizes are dimension lines or spans on the shared ruler. Don't use bars with numbers on top.
6. **Hatch means "can't".** Read-only, locked, beyond a limit, unaccounted for. Clear means writable or available.
7. **Commands are literal.** Show `$ exact command` beside the node it acts on, numbered in run order. Keep the selectable text version elsewhere in the UI too.
8. **Full and compact.** Full prints scales, boxes and leaders. Compact keeps only the marks and moves the value into `aria-label`/`<title>`. Read the mode with `Calibrated.density(el)`.
9. **Accessible.** Every figure gets `role="img"` and an `aria-label` sentence with the same facts (`draw()`/`mount()` set it). Decorative mini-figures get `aria-hidden`.
10. **Legend type only**: 11px `--font-legend` (Chivo Mono), set by `svg[data-cal]`. No other sizes inside figures.
11. **Leave alone**: terminals, prompt text, menus, pickers and command palettes. Only draw where there's a quantity to measure.
12. **Measure, don't diagram.** Each figure reads off a scale or a count, with at least three values. Labelled rectangles joined by lines are a flowchart, not a figure: use the recipe that measures the structure. A box always holds a value.
13. **A lamp, not a paint.** The lamp lights one segment, node, label or value as a line, text or outline. Never fill a box or a region with it.
14. **Fit the canvas.** Size the viewBox to the drawing, with no wide empty margins. Magnify the small part that matters with a detail inset.

## Drawing by hand
```html
<svg id="fig-build" width="520" height="120"></svg>
<script>
Calibrated.ready(() => {
  const { K, draw } = Calibrated;
  const X = K.scale(70, 480, 0, 10);              // minutes → x
  let g = K.fig(4, 'build · main · 2 stages');
  g += K.t(60, 54, 'compile', 'fg', 'end') + K.line(70, 50, X(3.2), 50, 'fg', { w: 2 }) + K.node(X(3.2), 50, 'done');
  g += K.dim(70, X(3.2), 36, '3m 12s');
  g += K.t(60, 84, 'test', 'lv', 'end') + K.line(70, 80, X(5.5), 80, 'lv', { w: 2 }) + K.node(X(5.5), 80, 'live');
  g += K.ruler(70, 480, 100, 10, 1, 5, (v) => v + 'm');
  draw('#fig-build', g, 'Build on main: compile took 3 minutes 12, tests running for 5 and a half minutes.');
});
</script>
```
Wrap drawing in `Calibrated.ready(fn)`. It runs once the fonts are in, and again if a font loads later, so boxes are measured with the real font.

## Using a recipe
```js
Calibrated.ready(() => Calibrated.mount('#load', Calibrated.recipes.lanes({
  n: 1, title: 'load test · v2.4 · 3 regions', max: 10,
  lanes: [
    { name: 'us-east', end: 4.2, label: '4m 12s', box: ['p99 212 ms', '0.02% errors'] },
    { name: 'ap-south', end: 8.08, label: '8m 05s', live: true, box: ['running', '40% of traffic'] },
  ],
})));
```
See `references/recipes.md` for all nine. To design a new figure, start from the recipe closest to it and change the layout. Don't invent new marks.

## Related skills
calibrated-tokens (required) · calibrated-components (instruments built on this kit) · calibrated-artifacts (single-file pages).
