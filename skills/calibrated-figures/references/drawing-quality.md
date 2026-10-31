# Drawing quality

The bar: a reader gets the numbers from the drawing before reading a word of prose. If the figure would work just as well as a slide, it isn't a Calibrated drawing yet.

These are principles, not a layout. Apply them to whatever the page is about. Don't copy one example page's arrangement onto every subject.

## 1 · Measure, don't diagram
- **Every figure reads off a scale or a count.** It carries at least three values that the reader could check: ticks on a ruler, dimension lines, boxed values on leaders, a count, a ratio. A figure with no numbers in it is a diagram: rebuild it from a recipe or replace it with a sentence.
- **No flowcharts.** Labelled rectangles joined by lines (the architecture-slide look) aren't figures, even drawn in ink. Turn the structure into the recipe that measures it:

  | the structure | draw |
  |---|---|
  | stages in order, each taking time or producing output | nodes on a centre line, with `K.dim` spans for durations and `K.cmd` for commands (`timeline`, or `loop` when it repeats) |
  | what's inside a boundary, what's outside, what's closed | `section`, with hatch for what can't be reached |
  | one thing feeding many, or many reporting to one | `fanout`, with counts in boxes |
  | branches that join | `merge` |
  | which part touches which | `matrix` |
  | a total split into parts | `measured`, with an inset on the small part |

  When the subject has no quantity at all, write it as text, a `cal-kv` sheet or a table. Don't draw boxes to make it look technical.
- **A box holds a value.** `K.box(x, y, null, name, value)`: the name on top, the value below. A name with no value is a plain label (`K.t`), not a box.
- **Magnify the part that matters.** When the interesting part is small compared with the whole (cache hits in a 1M context, 3 failing of 2,000), draw the whole on its scale and the part in a detail inset at `×N`, with its own ticks.
- **Put the reading on the drawing.** Thresholds as fault lines, the live position as a node, the result as a plate. The reader shouldn't need the caption to find the answer.

## 2 · One lamp, and a small one
- The lamp lights the **one** live thing: one segment, one node (the star), one boxed value, one row label. It's a line, a word or an outline. Never fill a box, a region or a whole stage with it.
- Rough check: if the lamp shows in more than one place that isn't the same item (its line, its star, its box), there's too much.
- To make the headline result stand out, use `K.plate` (double rule), not a fill. To group, use a bracket or a dashed frame, not a tint.
- `ok` and `fault` mark results and limits only. They aren't fills or decoration either.

## 3 · Fill the stage
- Size the `viewBox` to the drawing: at most about 24 units of empty margin on any side. Measure with `K.boxWidth` and `Calibrated.textWidth` instead of guessing a big canvas.
- A drawing should span most of the width it's given. A narrow figure (under about 380 units) alone in a full-width frame is the classic failure. Put it in a card beside its text, pair it with a second figure, or redraw it wider on a longer scale.
- Don't scale a small drawing up to fill the space either: the 11px legend type grows with it and stops looking like a drawing. Redraw at the right width instead.

## 4 · Text sits beside the drawing, and it's short
- Each drawing gets a stable number, a title of six words or fewer that names what's drawn, a *why* of one to three sentences, and its facts as key/value pairs (`where`, `replaces`, `data`, `source`). This is the card's info column. Use it on explainers and reports too, not only on proposals.
- The prose says what the numbers mean. It doesn't repeat them: they're on the drawing.
- Captions are one line. If a caption needs a second sentence, the drawing is missing a mark.

## 5 · Density
- The headline is two lines at most, with a short paragraph beside it. It introduces the page, it isn't a landing-page hero. **The first drawing should be on the first screen** (about 900px down at 1280 wide).
- No spacer regions. A rule separates sections, not a band of empty space.
- A section holding one small figure is too thin: merge it with its neighbour or give it the drawings that belong with it. Items of the same kind sit in a run of cards.
- Panels on the desk, separated by even gaps; inside a panel, hairlines divide cells, strips and table rows.

## 6 · Labels
- Inside figures, only legend type: names in uppercase, values as written, units on the numbers (`25k`, `4m 12s`).
- Line up label columns and box rows on a shared x or y. Leaders never cross, and they elbow at right angles.
- Abbreviate with the reader's units (`≈ 41.4k`, `90% · $0.03`), never with invented shorthand.

## Look once before publishing
Take a screenshot and check it against this list:
1. Can every figure be read without its caption? Does each show three or more values?
2. Are there any labelled boxes with no value, or rectangles joined by lines? Redraw them.
3. How many things does the lamp light in each figure? It should be exactly one, and never as a fill.
4. Does any figure sit in a frame much wider than itself? Is any stage more than a third empty?
5. Is the first drawing visible without scrolling? Are there tall empty bands between sections?
6. Does any text clip in a box, any leader cross another, any label overlap a mark?
