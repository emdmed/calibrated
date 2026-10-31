---
name: Calibrated
description: A drawing grammar that sets quantities as small technical figures on an engineering drawing sheet.
colors:
  drafting-film: "#f6f7f3"
  graphite-ink: "#1d2126"
  graphite-muted: "#59616a"
  title-ink: "#0f1216"
  highlighter: "#f3dc3a"
  check-green: "#2c7a4b"
  markup-red: "#c5302a"
  desk-shade: "#6d7368"
  night-sheet: "#18191a"
  night-ink: "#e6e6e3"
  night-muted: "#9aa3a8"
  night-title: "#f4f6f1"
  night-highlighter: "#e9d43c"
  night-check: "#7cc493"
  night-markup: "#f0715f"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(34px, 5vw, 64px)"
    fontWeight: 650
    lineHeight: 0.95
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 72"
  headline:
    fontFamily: "Archivo, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 72"
  title:
    fontFamily: "Archivo, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.015em"
    fontVariation: "'wdth' 72"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.07em"
    fontVariation: "'wdth' 82"
  legend:
    fontFamily: "Chivo Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.06em"
    fontFeature: "'tnum'"
  wordmark:
    fontFamily: "Archivo, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.045em"
    fontVariation: "'wdth' 72"
rounded:
  none: "0px"
spacing:
  gap: "16px"
  pad: "20px"
  wrap: "1280px"
components:
  button:
    backgroundColor: "{colors.drafting-film}"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "6px 11px 5px"
  button-primary:
    backgroundColor: "{colors.graphite-ink}"
    textColor: "{colors.drafting-film}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "6px 11px 5px"
  button-pressed-ok:
    backgroundColor: "{colors.check-green}"
    textColor: "{colors.drafting-film}"
  button-pressed-fault:
    backgroundColor: "{colors.markup-red}"
    textColor: "{colors.drafting-film}"
  input:
    backgroundColor: "{colors.drafting-film}"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.legend}"
    rounded: "{rounded.none}"
    padding: "5px 2px 4px"
  tab:
    textColor: "{colors.graphite-muted}"
    typography: "{typography.label}"
    padding: "6px 10px 5px"
  tab-selected:
    backgroundColor: "{colors.drafting-film}"
    textColor: "{colors.graphite-ink}"
  count-box:
    backgroundColor: "{colors.drafting-film}"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.legend}"
    padding: "1px 4px"
  count-box-live:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.graphite-ink}"
  title-block-cell:
    backgroundColor: "{colors.drafting-film}"
    textColor: "{colors.graphite-ink}"
    padding: "5px 10px 6px"
  card:
    backgroundColor: "{colors.drafting-film}"
    rounded: "{rounded.none}"
    padding: "18px 20px"
  figure-caption:
    textColor: "{colors.graphite-muted}"
    padding: "7px 12px"
---

# Design System: Calibrated

## Overview

**Creative North Star: "The Drawing Sheet"**

Every Calibrated page is an engineering drawing sheet in the ISO 128 tradition. The page sits on a darker desk and is framed by a thick border with a thin outer rule 7px outside it. Lettered and numbered zone markers run along the margins, and a ruled title block carries name, drawing number, scale, sheet and revision. Content is laid out as numbered sheets inside that frame. Figures are drawn in graphite ink in two line weights, with dash-dot centre lines for axes. The sheet itself is drafting-film white by day and a neutral graphite sheet at night.

Colour comes from the checker, not the draftsman. A highlighter swipe sits *behind* the ink to mark the live thing. Red markup marks faults, limits and revisions, and a green check marks what passed. Everything else stays ink on film. Density is high but ruled: cells, strips and tables are separated by hairlines, never by gaps and floating cards. The identity has to survive re-seeding into another brand, so it lives in structure (frame, rules, title block, two weights, the swipe) rather than in a hue. Three seeds (`--bg`, `--fg`, `--live`) and four supporting inks derive every other surface and line through `color-mix()`.

The world refuses the dark dev-tool dashboard and the blueprint-blue cliché. It is square, flat and ruled.

**Key Characteristics:**
- A framed sheet with zone markers, a title block and numbered sheet strips.
- Two line weights: thick 1.6px for frames and section rules, thin 1px for cells and figure strokes.
- The highlighter swipe sits behind ink to mark the one live thing. Coloured text is never used for this.
- Condensed technical caps (Archivo, width axis) for titles and labels. Chivo Mono for numbers, values and code.
- No radius, no drop shadows, no gradients except the swipe band.

## Colors

The base is graphite ink on drafting film plus three checker's inks: highlighter, check green and markup red. Each one carries a meaning, and none is used as decoration.

### Primary
- **Graphite Ink** (`graphite-ink`): Body text, every frame, rule, cell border and figure stroke. Also the fill of the primary button and of pressed toggles. At night its role passes to **Night Ink** (`night-ink`).
- **Title Ink** (`title-ink`): A deeper ink used only for condensed-caps titles, the wordmark and the h1 (`night-title` at night).

### Secondary
- **Checker's Highlighter** (`highlighter` / `night-highlighter`): Painted only as a swipe behind ink, mixed to `--swipe-strength`. That is 72% on film and 92% at night, so the yellow still reads as yellow on the dark sheet. Ink set on the swipe uses `--on-swipe`: graphite ink on film and the night sheet colour at night. The swipe marks live text spans, the live node, the live lane and boxed value in figures, live counts, live status cells and the text selection.

### Tertiary
- **Markup Red** (`markup-red` / `night-markup`): Faults, limits, alert thresholds, invalid fields, revision triangles and the SUPERSEDED stamp on a dropped card.
- **Check Green** (`check-green` / `night-check`): Passed and kept. Used for the drawn check on a shipped status, the ok node, the pressed "keep" button and an approved card's drawing number.

### Neutral
- **Drafting Film** (`drafting-film`): The sheet (`--bg`, `--panel`). At night: **Night Sheet** (`night-sheet`), a neutral graphite with no blue cast.
- **Graphite Muted** (`graphite-muted` / `night-muted`): Labels, section notes, captions, ledes and secondary meta.
- **Desk Shade** (`desk-shade`): Never painted directly. It is mixed into film to make the desk around the sheet (`--gutter`, 14%) and the recessed well for pasted printouts (`--well`, 6%). At night it is pure black.
- **Derived lines**: `--edge` (16% ink) for inner table rules and `--edge-strong` (38% ink) for row dividers, dashed separators and zone ticks. `--faint` (52% ink) is for placeholders, zone letters and inactive figure strokes. `--hover` (5% ink) and `--current` (8% ink) are state washes.

### Named Rules
**The Swipe-Behind-Ink Rule.** The highlighter is always a band behind dark ink, cut from 18% to 88% of the line box. It is never used as a text colour and never as a container fill. If yellow appears as glyph colour, it is wrong.

**The One Live Thing Rule.** Each figure, instrument and working view highlights a single live item. Every recipe takes one `live` entry. Rarity is what makes the swipe readable.

**The Seed Rule.** A theme is a handful of seeds. Every surface, edge and wash derives from `--bg`, `--fg`, `--live` and `--shade` through `color-mix()`, so theme work never adds a hard-coded hex.

## Typography

**Display Font:** Archivo variable (width 62–125), falling back to Arial Narrow, Helvetica Neue, Arial
**Body Font:** Archivo (with Helvetica Neue, Arial)
**Label/Mono Font:** Chivo Mono (with ui-monospace, SF Mono, Menlo, Consolas)

**Character:** Technical lettering. One sans family works at two widths: condensed (72%) for titles and the wordmark, semi-condensed (82%) for labels. A plain mono with tabular figures carries every number, so values line up in boxes and columns.

### Hierarchy
- **Display** (650, `clamp(34px, 5vw, 64px)`, 0.93–0.95, uppercase, width 72%): The sheet headline, one per page, set left.
- **Headline** (700, 22px, 1, uppercase, width 72%): Section strip titles ("1 · Marks") and the title-block name.
- **Title** (700, 21px, 1.05, uppercase, width 72%): Card headings.
- **Body** (400, 15px, 1.55): Running text. Ledes are capped at 60–68ch and card text at 46ch. Small text is 13–14px.
- **Label** (600, 12px, 0.07em, uppercase, width 82%): Plain-word labels, including section notes, group labels, tags, table heads, buttons, tabs, the tally and the footer. Title-block and key/value terms drop to 10.5px at weight 500.
- **Legend** (Chivo Mono 400, 11px, 0.06em, tabular): Every SVG figure label, plus counts, values, field input and code. Zone markers use 10px at weight 600 in faint ink.

### Named Rules
**The Words-in-Caps, Numbers-in-Mono Rule.** Labels are plain words in condensed Archivo caps. Chivo Mono is reserved for numbers, measured values and code.

**The Legible Legend Rule.** Figure legends never render below 10px. A figure wider than 200px sets a `min-width` of 90% of its natural size, and its container scrolls on narrow screens instead of shrinking the drawing.

## Layout

The page centres on a 1280px wrap (`--wrap`) with `clamp(16px, 3vw, 32px)` side padding. Inside it sits one sheet with `clamp(18px, 3vw, 40px)` interior padding, framed by the zone markers (`data-zones="8x6"`: columns 1–8 and rows A–F, drawn by script, with the frame still drawn without JS). The masthead has the mark, wordmark and caption on the left and the switches on the right, closed by a thick rule. The headline comes next, then numbered section strips. Each strip opens with a thick top rule, the boxed sheet number and title, a muted note, and "sheet n/N" right-aligned. Strips are separated by `clamp(48px, 6vw, 80px)`.

The title block sits bottom-right of the first sheet, beside the lede, or at the sheet's end in the artifact template. Cards are a two-column drawing, with a 300px info column beside a stage. The specimen grid is a hairline-ruled grid of 4 → 2 → 1 columns. The base gap is 16px (`--gap`) and panel padding 20px (`--pad`). Most internal padding steps through 5/6, 9/10, 14/16 and 18/20px.

Responsive: at ≤1100px cards stack and the specimen grid goes to 2 columns. At ≤960px the page-level two-column blocks stack. At ≤700px the compare panes stack, tables scroll, the sheet tightens (16px padding, 5px outer-rule offset), the side zone rails hide and the title block goes to 2 columns. At ≤520px the specimen grid goes to 1 column. Figures and instruments scroll horizontally (`overflow-x: auto`) instead of shrinking.

## Elevation & Depth

The system is flat. Depth comes from paper on a desk: the sheet (`--panel`) sits on a darker gutter, and pasted printouts sit in a slightly recessed `--well` with a dashed edge. Nothing floats. The only `box-shadow` in the system is an inset 1.6px ink bar on the selected row, which works as a ruled mark rather than a shadow.

### Named Rules
**The Paper-on-Desk Rule.** Hierarchy is drawn with line weight and tonal ground (desk → sheet → well), never with cast shadows or blur.

## Shapes

All containers and controls are square (0px radius). Borders are the form language. Thick 1.6px rules frame the sheet, the title block, section strips, the tally and table heads. Thin 1px rules make cells, cards, figures and fields. Dashed `--edge-strong` lines separate a "today" printout from its drawn version and outline pasted notes. Circles appear only where drafting uses them: nodes, the live dot (an ink dot ringed by a 3px swipe). The revision mark is a red-outlined triangle with its letter inside. The check is drawn as two 1.6px strokes rotated −45°, and is never a glyph.

## Components

### Buttons
A ruled cell that fills with ink when pressed.
- **Shape:** Square (0px), 1px ink border, label type.
- **Default:** Film ground and ink text. Hover takes the 5% ink wash and active the 8% wash, with a 0.12s ease-out on background and colour.
- **Primary:** Ink fill with film text. Hover mixes 14% film into the ink.
- **Pressed toggles:** `aria-pressed` fills with ink, or with green or red when `data-ink` is `ok` or `fault` (the keep/drop sign-off).
- **Quiet:** No border; underlined with an `--edge-strong` underline that darkens on hover.
- **Disabled:** Faint text and `--edge-strong` border.

### Tabs
Ruled tabs on a baseline. The selected tab takes ink borders on three sides and opens into the sheet below it. Unselected tabs are muted with an ink underline. Tab counts are boxed mono numbers.

### Counts
A zero-padded mono number boxed in a 1px ink cell, with its noun beside it in label caps. In compact density only the box shows. Live counts take the swipe, and fault or ok counts recolour both box and number.

### Cards / Containers
- **Corner Style:** Square.
- **Background:** Film (`--panel`).
- **Border:** 1px ink.
- **Card:** A 300px info column (title, why-text, key/value sheet) beside a stage. The foot is the drawing-number strip: boxed number, name, and revision cell. When a card is kept its number box fills green. When dropped, it is struck through in red and stamped SUPERSEDED (red 2px border, letter-spaced caps, set straight).
- **Figure:** The drawing with a ruled caption strip below, holding a bold label and a muted line.
- **Note:** A dashed, well-toned printout of the text a figure replaces.

### Inputs / Fields
- **Style:** A write-in line. Only a bottom 1px ink rule, mono value text, label caps above.
- **Focus:** The rule thickens to 2px and the hover wash appears. There is no glow.
- **Error:** The rule turns markup red and a red hint appears below.
- **Checkbox:** A 13px square box. When checked it fills with ink and shows a drawn film check.

### Navigation
The masthead holds the ruled mark (30×24), the wordmark and a caption. The mark is a short scale with one graduation picked out by the swipe: long ticks at the ends and middle, short ticks between, and one live long tick past the middle. Calibrated's own wordmark sets `.word.ruled`, which draws the same scale of ten under the name with the swipe at 7. Other products keep a plain `.word`. Theme (film/night) and density (full/compact) switches are tab rows at the right.

### Title Block (signature)
A ruled grid of cells with a thick outer border and thin inner rules. Each cell has a small caps term over a mono value. The name spans the full row in condensed headline caps. Wide cells span two columns. The column count is set by `--tb-cols` and drops to 2 on phones.

### Tables, Rows, Revisions
Tables work like parts lists. Heads are in label caps over a thick ink rule, body rows over `--edge-strong` hairlines, and the first column is a mono number. Status cells use plain words: live statuses get the swipe, shipped gets the drawn check, and faults are red. The selected row in a list uses the 8% wash plus the inset ink bar. The revision table pairs each red triangle with a description and date.

### Tally
A thick-ruled strip at the foot of a sign-off page that reads "n of N signed" and offers a copy action. It is static by default and sticky only when opted in.

### Figures (signature)
SVG drawn from the eight marks: leader + boxed value, ruler, dimension line, detail inset (dashed `2 3` projection with a scale like 20:1), hatch (45° lines = closed), nodes, numbered command, and a FIG. label above a long-dash-dot centre line (`10 3 2 3`). There is one scale per figure. Live strokes get a +7px swipe underlay with ink on top. Each figure states its facts in an `aria-label`.

## Docs Shell (demo page)

The demo (`demo/index.html`) is not a drawing sheet. It is a conventional component-docs site at the Radix / Tailwind docs bar, so the kit's figures carry the identity and the page around them recedes. The drawing-sheet world above applies inside each example preview, and nowhere else on the docs page.

- **Chrome:** white page (`#ffffff`), near-black at night (`#0d0d0e`), hairline neutral borders (`#e9e9ec` / `#222326`). Ink is the only accent. The highlighter appears only as the underline under the current sidebar item, and as the text selection.
- **Type:** Inter for all chrome (H1 44px/700, group H2 30px/650, item H3 20px/600, body 15px/1.65, lede 19px). Chivo Mono for code. The ruled mark and the condensed `.word` wordmark sit in the top bar.
- **Structure:** sticky 60px top bar (mark, wordmark, version pill, a few links, theme toggle); a sticky 264px sidebar of groups that follows the reader; one content column up to 1000px. Groups: Getting started, Marks, Instruments, Figures, Components, Theming, Changelog. No numbered sections.
- **Example frame:** 10px-radius bordered box with Preview / Code tabs and a Copy button. The preview is a `.cal-theme` region on the kit's own sheet colour. Code is generated from the example's source, so it always matches what renders. Instruments carry attribute tables.
- **Themes:** one toggle switches the docs (light/dark) and the kit (film/night) together. It is set before first paint and remembered per browser.
- **Narrow screens:** below 960px the sidebar becomes a full-screen menu behind a button; cards use their stacked layout; wide figures scroll inside their preview.

## Do's and Don'ts

### Do:
- **Do** frame every page as a sheet: thick border, thin outer rule at 7px, zone markers and a title block.
- **Do** draw with two weights only: 1.6px for frames, section rules and table heads, and 1px for everything inside.
- **Do** mark the live item with the swipe behind ink (72% on film, 92% at night) and set ink on it with `--on-swipe`.
- **Do** keep red for faults, limits and revisions, and green for passed and kept.
- **Do** set labels as plain words in condensed Archivo caps (12px, 600, 0.07em) and numbers in Chivo Mono with tabular figures.
- **Do** let figures scroll on narrow screens rather than drawing them below 90% of natural size.
- **Do** re-theme by changing seeds only, and let `color-mix()` derive the rest.

### Don't:
- **Don't** use yellow as a text colour or a container fill. It is only ever a swipe.
- **Don't** highlight more than one live item in a figure or working view.
- **Don't** round containers or controls. Circles are reserved for nodes, the live dot and the mark.
- **Don't** add drop shadows, blur or glows. Separate surfaces with rules and tone.
- **Don't** use blueprint blue or a dark dev-dashboard palette. The night sheet is neutral graphite (#18191a), not navy.
- **Don't** draw checks or stars with text glyphs. Draw the check as two strokes.
- **Don't** put mono-set eyebrows or kickers above headlines. The headline sits directly under the masthead rule.
- **Don't** tilt the SUPERSEDED or verdict stamp. Markup stamps sit square.
