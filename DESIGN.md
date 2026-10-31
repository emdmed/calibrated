---
name: Calibrated
description: A drawing grammar that sets quantities as small technical figures on quiet panels, with one lamp for the live thing.
colors:
  paper: "#f4f2ec"
  ink: "#262b2e"
  ink-muted: "#646b68"
  title-ink: "#15191b"
  lamp: "#9c6a06"
  check-green: "#3b7449"
  markup-red: "#b5402e"
  desk-shade: "#6f746a"
  night-slate: "#1b2225"
  night-ink: "#e5e0d3"
  night-muted: "#949c97"
  night-title: "#eef0ec"
  night-lamp: "#dcb662"
  night-check: "#b2d49c"
  night-markup: "#e3735f"
typography:
  display:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "clamp(28px, 3.2vw, 42px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "0.02em"
  title:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0.03em"
  body:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  legend:
    fontFamily: "Chivo Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.05em"
    fontFeature: "'tnum'"
  wordmark:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "19px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.14em"
rounded:
  none: "0px"
spacing:
  gap: "14px"
  pad: "18px"
  wrap: "1240px"
components:
  button:
    textColor: "{colors.ink-muted}"
    typography: "{typography.legend}"
    padding: "3px 2px"
  button-pressed-ok:
    textColor: "{colors.check-green}"
  button-pressed-fault:
    textColor: "{colors.markup-red}"
  input:
    textColor: "{colors.ink}"
    typography: "{typography.legend}"
    rounded: "{rounded.none}"
    padding: "5px 2px 4px"
  tab:
    textColor: "{colors.ink-muted}"
    typography: "{typography.legend}"
    padding: "0 0 5px"
  tab-selected:
    textColor: "{colors.ink}"
  count-box:
    textColor: "{colors.ink}"
    typography: "{typography.legend}"
    padding: "0 3px"
  count-box-live:
    textColor: "{colors.lamp}"
  card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "16px 18px"
  figure-caption:
    textColor: "{colors.ink-muted}"
    padding: "7px 14px"
---

# Design System: Calibrated

## Overview

**Creative North Star: "The Lamp on the Bench"**

A Calibrated page is a bench of drawings under one lamp. Quiet panels sit on a darker desk, separated by gaps rather than frames. Inside each panel, the drawing is set in warm ink with hairline rules: rulers, leaders to boxed values, dimension lines, detail insets, hatching and nodes. One lamp lights the live thing: an amber line, an amber word, an amber-outlined box, or a small glowing star where the work is happening right now.

Colour comes from meaning, not decoration. The lamp marks the one live thing. Red markup marks faults, limits and revisions, and green marks what passed. Everything else stays ink. Density is high but quiet: cells, strips and tables are separated by low-contrast hairlines. The identity has to survive re-seeding into another brand, so it lives in structure (panels on a desk, hairlines, monospace caps, numbered drawings, the lamp) rather than in a hue. Three seeds (`--bg`, `--fg`, `--live`) and four supporting inks derive every other surface and line through `color-mix()`.

The engineering-drawing sheet (`.cal-sheet`: frame, zone markers, title block) is still in the kit as an optional extra for pages that want it. Most pages don't.

**Key Characteristics:**
- Panels on a desk, with gaps between them. No thick ink frames.
- Hairlines only: `--edge` inside, `--edge-strong` for heads and dividers, dashed between "today" and "drawn".
- All monospace: typewriter caps at regular weight for titles, Chivo Mono for legends and every figure label.
- The lamp marks the one live thing, as line, text, outline or a glowing star.
- No radius, no drop shadows, no gradients. The star's soft glow is the only blur.

## Colors

The base is warm ink on a paper or slate panel, plus three meaningful inks: lamp, check green and markup red.

### Primary
- **Ink** (`ink` / `night-ink`): Body text, figure strokes, measured things and done nodes.
- **Title Ink** (`title-ink` / `night-title`): Titles, the wordmark and the h1.

### Secondary
- **Lamp** (`lamp` / `night-lamp`): The one live thing. Used as stroke and text colour: the live lane, the live station name, the live value and its box outline, the live count, the live status cell, the `.live` word in running text, and the star node. On film it's a dark amber so lamp text stays readable on paper. A 16% lamp tint (`--swipe`) exists for marking an area, and is used rarely. `--glow` (55% lamp) is the halo behind the star.

### Tertiary
- **Markup Red** (`markup-red` / `night-markup`): Faults, limits, alert thresholds, invalid fields, revision triangles and the SUPERSEDED stamp.
- **Check Green** (`check-green` / `night-check`): Passed and kept: shipped statuses, the pressed `[keep]`, a kept card's number badge.

### Neutral
- **Paper** (`paper`): The panel (`--bg`, `--panel`) on film. At night: **Night Slate** (`night-slate`), a deep blue-grey.
- **Ink Muted** (`ink-muted` / `night-muted`): Labels, section notes, captions, key/value values and secondary meta.
- **Desk Shade** (`desk-shade`): Never painted directly. Mixed into the panel by `--desk-depth` (9% on film, 24% at night) to make the desk around the panels (`--gutter`), and at 10% for the recessed `--well`. At night it is pure black.
- **Derived lines**: `--edge` (14% ink) for inner rules and `--edge-strong` (30% ink) for table heads, section rules and note borders. `--faint` (45% ink) is for scale ticks, inactive strokes and placeholders. `--key` (70% ink) is for small label text (keys, terms, quiet tags and statuses) so it holds 4.5:1 on both themes. `--hover` (5% ink) and `--current` (8% ink) are state washes.

### Named Rules
**The One Lamp Rule.** Each figure, instrument and working view lights a single live item. Every recipe takes one `live` entry. Rarity is what makes the lamp readable.

**The Line-Not-Fill Rule.** The lamp is a line, a word, an outline or a star. It never fills a box or a region. The faint tint is for the rare area that must read as live, never for emphasis.

**The Seed Rule.** A theme is a handful of seeds. Every surface, edge and wash derives from `--bg`, `--fg`, `--live` and `--shade` through `color-mix()`, so theme work never adds a hard-coded hex.

## Typography

**Body and Title Font:** IBM Plex Mono (with ui-monospace, SF Mono, Menlo, Consolas)
**Legend Font:** Chivo Mono (with the same fallbacks)

**Character:** A typewriter on a bench. Words are set in IBM Plex Mono; titles are the same face in uppercase at regular weight, tracked a little. Chivo Mono, tighter and smaller, carries every legend: labels, numbers, tags, table heads and every figure label, with tabular figures so values line up in boxes and columns.

### Hierarchy
- **Display** (400, `clamp(28px, 3.2vw, 42px)`, 1.12, 0.02em, uppercase): The page headline, one per page, set left beside a short lede.
- **Title** (400, 19px, 1.25, 0.03em, uppercase): Card headings and the title-block name (17px).
- **Body** (400, 14px, 1.6): Running text. Ledes cap at 62–72ch, card text at 46ch. Small text is 12–13px.
- **Legend** (Chivo Mono 400, 11px, 0.05em, uppercase for labels, tabular): Section heads, tags, keys, table heads, buttons, tabs, counts, the tally, the footer and every SVG label. Ligatures are off.

### Named Rules
**The All-Mono Rule.** Every word on the page is monospace. Titles get their weight from caps and tracking, not from bold.

**The Legible Legend Rule.** Figure legends never render below 10px. A figure wider than 200px sets a `min-width` of 90% of its natural size, and its container scrolls on narrow screens instead of shrinking the drawing.

## Layout

The page centres on a 1240px wrap (`--wrap`) with `clamp(16px, 3vw, 32px)` side padding, straight on the desk. The masthead has the mark, wordmark and caption on the left and the version on the right, closed by a hairline. The intro sets the headline beside a lede of up to 440px. Then come numbered sections. Each section head is a legend line between rules: a short rule, `1 · NAME` in ink, a muted note, a rule running to the right, and `sheet 1/3` in faint. Sections sit `clamp(36px, 4vw, 52px)` apart.

Cards stack with a 14px gap (`--gap`). A card is a 290px info column beside a stage, or beside a today / drawn comparison split by a dashed hairline. The specimen grid is a hairline-ruled grid of 4 → 2 → 1 columns. Panel padding is 16–18px (`--pad`).

Responsive: at ≤1100px cards stack and the specimen grid goes to 2 columns. At ≤700px the compare panes stack, tables scroll and the title block goes to 2 columns. At ≤520px the specimen grid goes to 1 column. Figures and instruments scroll horizontally (`overflow-x: auto`) instead of shrinking.

## Elevation & Depth

The system is flat. Depth comes from tone: panels (`--panel`) sit on a darker desk (`--gutter`), the "today" note sits on a slightly raised ground (`--raised`) with an `--edge-strong` hairline, and code sits in a recessed `--well`. Nothing casts a shadow. The only light effect is the glow behind the lamp star.

### Named Rules
**The Tone-Not-Frame Rule.** Surfaces separate by tone and gaps (desk → panel → raised or well), never by thick borders, cast shadows or blur.

## Shapes

All containers and controls are square (0px radius). Lines are hairlines: 1px `--edge` inside panels, `--edge-strong` for heads and note borders, dashed `--edge` between "today" and "drawn". A heavier 1.2px double rule is kept for the plate, the one headline result. Nodes are small squares and diamonds; the live node is a four-point star. The revision mark is a red-outlined triangle with its letter inside.

## Components

### Buttons
A bracketed word: `[keep]`, `[roll back]`, `[copy sign-off]`.
- **Default:** Muted legend text in brackets, no border, no fill. Hover turns ink.
- **Primary:** Ink text; hover turns lamp.
- **Pressed toggles:** `aria-pressed` turns ink, or green / red when `data-ink` is `ok` / `fault` (the keep/drop sign-off).
- **Quiet:** No brackets; an `--edge-strong` underline that darkens on hover.
- **Disabled:** Faint text.

### Tabs
Legend keys in a row. The open one turns ink with a 1px ink underline. Counts sit beside the key in a small outlined box.

### Counts
A zero-padded number in a small hairline box, with its noun beside it in legend caps. Compact density shows only the box. A live count has a lamp number and a lamp-tinted outline; ok and fault counts recolour the same way.

### Cards / Containers
- **Corner Style:** Square.
- **Background:** The panel (`--panel`), on the desk. No border.
- **Card:** A 290px info column beside the stage. The info column opens with the `.id` line: an outlined lamp number badge, where it lives, and a status at the right (`rev A`, `✓ built`). Then the title, the *why*, and a key/value sheet (faint keys, muted values) under a hairline. A sign-off row of bracketed buttons closes the card. When kept, the badge turns green. When dropped, the card fades to 42% and is stamped SUPERSEDED (1px red outline, letter-spaced caps, set square).
- **Compare:** today (a note of the text the UI prints) beside drawn, split by a dashed hairline. The drawn tag carries a small lamp star.
- **Figure:** The drawing with a caption under a hairline: a legend label and a muted line.
- **Note:** The text a figure replaces, on a raised ground with an `--edge-strong` hairline.

### Inputs / Fields
- **Style:** A write-in line: a bottom `--edge-strong` hairline, mono value text, a legend label above.
- **Focus:** The line turns lamp. No glow.
- **Error:** The line turns markup red and a red hint appears below.
- **Checkbox:** A 12px hairline square; checked shows a small ink square inside.

### Navigation
The masthead holds the ruled mark, the wordmark and a caption. The mark is a short scale with one graduation lit in lamp. Calibrated's own wordmark sets `.word.ruled`, which draws the same scale of ten under the name with a lamp tick at 7. Other products keep a plain `.word`.

### Title Block (optional)
A ruled grid of hairline cells, a small `--key` term over a mono value. The name spans the full row in title caps. Use it when a page needs drawing numbers, versions and approvals in one place.

### Tables, Rows, Revisions
Tables work like parts lists on a panel: legend heads over an `--edge-strong` hairline, body rows over `--edge` hairlines, a muted mono number in the first column. Status cells are plain words: live statuses are lamp with a small star, shipped is green with a check, faults are red. The selected row in a list takes the 8% wash and a 2px lamp bar on its left edge. The revision table pairs each red triangle with a description and date.

### Tally
A panel strip at the foot of a sign-off page, under an `--edge-strong` hairline: "n of N signed" and a `[copy sign-off]` action. Add `.sticky` to pin it.

### Figures (signature)
SVG drawn from the eight marks: leader + boxed value, ruler, dimension line, detail inset (dashed `2 3` projection with a scale like 20:1), hatch (45° lines = closed), nodes, numbered command, and a FIG. label, with long-dash-dot centre lines (`10 3 2 3`) for axes. One scale per figure. Live strokes, labels and box outlines take the lamp; the live node is the lamp star. Each figure states its facts in an `aria-label`.

## Docs Shell (demo page)

The demo (`demo/index.html`) and the reference (`demo/reference.html`) are docs pages around the kit. The kit's figures carry the identity; the chrome around them recedes. The panel world above applies inside each example preview.

## Do's and Don'ts

### Do:
- **Do** set pages as panels on a desk, separated by gaps and hairlines.
- **Do** light the one live thing with the lamp: a line, a word, an outline or the star.
- **Do** keep red for faults, limits and revisions, and green for passed and kept.
- **Do** set every word in monospace: IBM Plex Mono for text and titles, Chivo Mono for legends and numbers.
- **Do** open each card with its `.id` line and number badge.
- **Do** let figures scroll on narrow screens rather than drawing them below 90% of natural size.
- **Do** re-theme by changing seeds only, and let `color-mix()` derive the rest.

### Don't:
- **Don't** fill boxes or regions with the lamp. It's a line, not a paint.
- **Don't** light more than one live item in a figure or working view.
- **Don't** frame panels in thick ink borders or round their corners.
- **Don't** add drop shadows or gradients. The star's glow is the only one.
- **Don't** use bold for titles. Caps and tracking carry them.
- **Don't** draw checks or stars with text glyphs inside figures. Use the kit's marks.
- **Don't** tilt the SUPERSEDED or verdict stamp. Markup stamps sit square.
