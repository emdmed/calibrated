---
name: Calibrated
description: A drawing grammar that sets quantities as small technical figures on quiet panels, with one lamp for the live thing.
colors:
  paper: "#f4f2ec"
  ink: "#262b2e"
  ink-muted: "#5d6061"
  title-ink: "#111314"
  lamp: "#8a5d05"
  check-green: "#2f6439"
  markup-red: "#ad3d2a"
  desk-shade: "#6e6d6a"
  night-slate: "#1b2225"
  night-ink: "#e5e0d3"
  night-muted: "#a2a19a"
  night-title: "#edebe4"
  night-lamp: "#dcb662"
  night-check: "#84bb8b"
  night-markup: "#e6715c"
typography:
  display:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "clamp(28px, 3.2vw, 42px)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "0.02em"
  title:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "19px"
    fontWeight: 500
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

Colour comes from meaning, not decoration. The lamp marks the one live thing. Red markup marks faults, limits and revisions, and green marks what passed. Everything else stays ink. Density is high but quiet: cells, strips and tables are separated by low-contrast hairlines. The identity has to survive re-seeding into another brand, so it lives in structure (panels on a desk, hairlines, monospace caps, numbered drawings, the lamp) rather than in a hue. Three seeds (`--bg`, `--fg`, `--live`) derive every other ink, surface and line through `color-mix()`, including the supporting inks (title, muted, check green, markup red) and the desk shade.

The engineering-drawing sheet (`.cal-sheet`: frame, zone markers, title block) is still in the kit as an optional extra for pages that want it. Most pages don't.

**Fixed grammar, chosen look.** What follows describes the default look, not the only one. The grammar is fixed: the eight marks, one scale per figure, figures that keep every fact, one lamp per view, red and green meanings, colours derived from three seeds, monospace for every label, legend and body text, hairlines with square corners and no shadows or gradients. Five settings change from page to page, chosen from the subject: palette, headline face, frame (desk, paper or sheet), layout (cards, full-width figures, side by side, one large drawing) and space (dense or open). Generated pages change at least two of them unless the user asked for the default look. See `skills/calibrated-tokens/references/looks.md`.

**Key Characteristics:**
- Panels on a desk, with gaps between them, by default (or flush on paper, or in a drawing sheet). No thick ink frames.
- Hairlines only: `--edge` inside, `--edge-strong` for heads and dividers, dashed between "today" and "drawn".
- Monospace for every label, legend and line of text; typewriter caps for headings by default, or a chosen headline face. Chivo Mono for legends and every figure label.
- The lamp marks the one live thing, as line, text, outline or a glowing star.
- No radius, no drop shadows, no gradients. The star's soft glow is the only blur.

## Colors

The base is warm ink on a paper or slate panel, plus three meaningful inks: lamp, check green and markup red.

### Primary
- **Ink** (`ink` / `night-ink`): Body text, figure strokes, measured things and done nodes.
- **Title Ink** (`title-ink` / `night-title`): Titles, the wordmark and the h1.

### Secondary
- **Lamp** (`lamp` / `night-lamp`): The one live thing. Used as stroke and text colour: the live lane, the live station name, the live value and its box outline, the live count, the live status cell, the `.live` word in running text, and the star node. On film it's a dark amber so lamp text stays readable on paper. A 16% lamp tint (`--swipe`) marks the one live region of a figure, when the live thing is an area rather than a line. `--glow` (55% lamp) is the halo behind the star.

### Tertiary
- **Markup Red** (`markup-red` / `night-markup`): Faults, limits, alert thresholds, invalid fields, revision triangles and the SUPERSEDED stamp. Never approvals: an "approved" stamp is green.
- **Check Green** (`check-green` / `night-check`): Passed, kept and approved: shipped statuses, the pressed `[keep]`, a kept card's number badge, an approval stamp.

### Neutral
- **Paper** (`paper`): The panel (`--bg`, `--panel`) on film. At night: **Night Slate** (`night-slate`), a deep blue-grey.
- **Ink Muted** (`ink-muted` / `night-muted`): Labels, section notes, captions, key/value values and secondary meta.
- **Desk Shade** (`desk-shade`): Never painted directly. Derived as the panel 45% of the way to black, then mixed into the panel by `--desk-depth` (14% on film, 70% at night) to make the desk around the panels (`--gutter`), and at 10% for the recessed `--well`.
- **Derived inks**: title ink pushes the ink further from mid-grey; ink muted is 70% ink; check green and markup red keep their hue at the lightness of a 75% and 66% ink mix. All hold 4.5:1 on panel, raised and well whenever ink on panel is 11:1, so a region that re-seeds only `--bg`/`--fg`/`--live` stays readable.
- **Derived lines**: `--edge` (14% ink) for inner rules and `--edge-strong` (30% ink) for table heads, section rules and note borders: structure only, never the one mark that carries a state. `--faint` (52% ink, at least 3:1) is for marks: scale ticks, leaders, open nodes, field lines and inactive strokes. It is never text. `--key` (72% ink) is for small text (keys, terms, scale numbers, quiet tags and statuses) so it holds 4.5:1 on both themes. `--hover` (5% ink) and `--current` (8% ink) are state washes.
- **Forced colours**: every ink maps to a system colour (ink, title, muted, key, status and `--edge-strong` to CanvasText; `--faint` and `--edge` to GrayText; the lamp to Highlight; surfaces to Canvas; glow and washes off), so figures follow the user's palette. Meaning never rests on green or red alone.

### Named Rules
**The One Lamp Rule.** Each figure, instrument and working view lights a single live item. Every recipe takes one `live` entry. Rarity is what makes the lamp readable.

**The Line-Not-Fill Rule.** The lamp is a line, a word, an outline or a star. It never fills a box or a region. The faint tint marks the one live region of a figure (the window being measured, the area in use), never emphasis or decoration.

**The Seed Rule.** A theme is three seeds (`--bg`, `--fg`, `--live`) plus `--desk-depth`. Every ink, surface, edge and wash derives from them through `color-mix()`, so theme work never adds a hard-coded hex. A theme may still override a derived ink after the kit's CSS.

## Typography

**Body and Title Font:** IBM Plex Mono (with ui-monospace, SF Mono, Menlo, Consolas)
**Legend Font:** Chivo Mono (with the same fallbacks)
**Headline Face (optional):** one grotesk or condensed sans for headings only, chosen from the subject (Barlow Condensed, IBM Plex Sans Condensed, Space Grotesk, Archivo, Chivo). See `looks.md`.

**Character:** A typewriter on a bench. Words are set in IBM Plex Mono; titles are the same face in uppercase at regular weight, tracked a little. Chivo Mono, tighter and smaller, carries every legend: labels, numbers, tags, table heads and every figure label, with tabular figures so values line up in boxes and columns.

### Hierarchy
- **Display** (500, `clamp(28px, 3.2vw, 42px)`, 1.12, 0.02em, uppercase): The page headline, one per page, set left beside a short lede.
- **Title** (500, 19px, 1.25, 0.03em, uppercase): Card headings and the title-block name (17px).
- **Section** (500, 16px, 1.2, sentence case): The name in a section head (`2 · Review board`), with its note at 12px muted and the sheet number in legend caps.
- **Block** (Chivo Mono 500, 12px, 0.05em, uppercase, ink): The head of one group inside a panel (`BUDGET`), with an optional muted note.
- **Body** (400, 14px, 1.6): Running text. Ledes cap at 62–72ch, card text at 46ch. Small text is 12–13px.
- **Legend** (Chivo Mono 400, 11px, 0.05em, uppercase for labels, tabular): Section heads, tags, keys, table heads, counts, the tally, the footer and every SVG label. Ligatures are off.
- **Control** (Chivo Mono 400, 12px): Buttons and tabs in caps; field labels, group legends and helper text in sentence case. What people click or fill in is never below 12px.

### Named Rules
**The Mono-Labels Rule.** Body text, labels, legends, numbers, table heads, controls and every figure label are monospace. Headings (the page headline, section names, card titles, the title-block name, the wordmark) are IBM Plex Mono caps by default and may take one chosen headline face instead: a grotesk or condensed sans set through `--font-display`, `--display-case` and `--display-weight`. Never a serif, a script or italic. Mono titles get their weight from caps, tracking and medium (500) weight, never bold; a sans headline face may use 500–700.

**The Four-Steps Rule.** Every view reads in four steps: headline (display), section (16px, medium), block (12px medium caps, ink), then labels and scales (11px, muted or faint). If two steps look alike, the lower one gets quieter.

**The Short-Caps Rule.** Caps are for short labels: titles, section heads, tags, table heads, buttons. Field labels, helper text, errors and anything longer than four words stay in sentence case, so forms read like forms.

**The Usable-First Rule.** A page works as an ordinary, well-made page before it looks like a drawing: the usual layout for its task, one main action that looks like a button, every fact still on the figure that replaces it. Drafting terms (FIG, SHEET, REV, title blocks, stamps) belong to document pages; app screens and forms use `data-mode="app"` and leave them out. See `skills/calibrated-components/references/ux-rules.md`.

**The Legible Legend Rule.** Figure legends never render below 10px. A figure wider than 200px sets a `min-width` of 90% of its natural size, and its container scrolls on narrow screens instead of shrinking the drawing.

## Layout

The page centres on a 1240px wrap (`--wrap`) with `clamp(16px, 3vw, 32px)` side padding, straight on the desk. The masthead has the mark, wordmark and caption on the left and the version on the right, closed by a hairline. The intro sets the headline beside a lede of up to 440px. Then come numbered sections. Each section head is a legend line between rules: a short rule, `1 · NAME` in ink, a muted note, a rule running to the right, and `sheet 1/3` in faint. Sections sit `clamp(36px, 4vw, 52px)` apart.

That is the default frame. `data-frame="paper"` drops the desk so panels sit flush on the paper, each marked by a rule on top, and `data-space="open"` doubles the gaps and section spacing. The masthead, the `sheet n/m` numbers and the card `.id` line are optional, used when a page has several numbered items.

Cards stack with a 14px gap (`--gap`). A card is a 290px info column beside a stage, or beside a today / drawn comparison split by a dashed hairline. The specimen grid is a hairline-ruled grid of 4 → 2 → 1 columns. Panel padding is 16–18px (`--pad`). Sections don't all have to be cards: a wide drawing goes in a full-width `.cal-figure`, like things go side by side in a `.cal-grid`, and a spec can be one large drawing with its notes beside it.

Responsive: at ≤1100px cards stack and the specimen grid goes to 2 columns. At ≤700px the compare panes stack, tables scroll and the title block goes to 2 columns. At ≤520px the specimen grid goes to 1 column. Figures and instruments shrink to at most 80% (legends stay readable), then scroll horizontally with a dashed cut-edge cue and become a named Tab stop.

## Elevation & Depth

The system is flat. Depth comes from tone: panels (`--panel`) sit on a darker desk (`--gutter`), the "today" note sits on a slightly raised ground (`--raised`) with an `--edge-strong` hairline, and code sits in a recessed `--well`. Nothing casts a shadow. The only light effect is the glow behind the lamp star.

### Named Rules
**The Tone-Not-Frame Rule.** Surfaces separate by tone and gaps (desk → panel → raised or well), never by thick borders, cast shadows or blur.

## Shapes

All containers and controls are square (0px radius), except the radio balloon and the switch pill. Lines are hairlines: 1px `--edge` inside panels, `--edge-strong` for heads and note borders, dashed `--edge` between "today" and "drawn". A heavier 1.2px double rule is kept for the plate, the one headline result. Nodes are small squares and diamonds; the live node is a four-point star. The revision mark is a red-outlined triangle with its letter inside.

## Components

### Buttons
Four tiers in 12px legend caps, so the main action always leads.
- **Primary:** The one main action per view, filled with ink and set in panel-coloured text. Labelled with a verb. A destructive primary is filled red. Never filled with the lamp.
- **Default:** Every other action. Ink text in an `--edge-strong` hairline box that turns ink on hover.
- **Inline:** A bracketed word, `[copy]`, for small actions in running text, toasts, fields and code blocks.
- **Quiet:** An underlined word for cancel, back and navigation.
- **Pressed toggles:** Unpressed is muted. `aria-pressed` turns text and box ink, or green / lamp / red when `data-ink` is `ok` / `live` / `fault` (the keep / rework / drop sign-off).
- **Disabled:** Faint text, faint box.

### Tabs
Legend keys in a row. The open one turns ink with a 1px ink underline. Counts sit beside the key in a small outlined box.

### Counts
A number in a small hairline box, with its noun beside it in legend caps. Only counts that change live are zero-padded, so the layout doesn't jump. Compact density shows only the box. A live count has a lamp number and a lamp-tinted outline; ok and fault counts recolour the same way.

### Cards / Containers
- **Corner Style:** Square.
- **Background:** The panel (`--panel`), on the desk. No border.
- **Card:** A 290px info column beside the stage. The info column opens with the `.id` line: an outlined number badge in ink (lamp only on the card in hand), where it lives, and a status at the right (`rev A`, `✓ built`). Then the title, the *why*, and a key/value sheet (faint keys, muted values) under a hairline. A sign-off row of keep / rework / drop buttons closes the card, wired by the kit. When kept, the badge turns green. Rework stamps the card REWORK in lamp and opens a one-line note. When dropped, the card fades to about 60%, is taped off with a band of oblique red stripes in its top padding and a solid red SUPERSEDED stamp, and takes a 1px red outline.
- **Compare:** today (a note of the text the UI prints) beside drawn, split by a dashed hairline. The drawn tag carries a small lamp star.
- **Figure:** The drawing with a caption under a hairline: a legend label and a muted line.
- **Note:** The text a figure replaces, on a raised ground with an `--edge-strong` hairline.

### Separators and Containers
- **Rule:** A hairline that splits topics in a panel. The line type carries the meaning, as on a drawing: solid for the next topic, dashed for an aside or a proposal, the centre line (`10 3 2 3`) for two halves of one thing, and the break line (a small jag) where something was left out. A labelled rule sets a legend word in the line (`── or ──`). The lamp rule marks the one "new since" line in a feed.
- **Meta:** Facts on one line split by short hairline ticks, never hand-typed middots.
- **Zone:** A hairline region with its name set into the top edge, no fill, so it works on any surface. Dashed means optional or not decided; a red zone holds destructive settings.
- **Bracket:** A hairline `[` with a middle tick that binds a few lines into one idea without a box.

### Inputs / Fields
- **Style:** A write-in line: a bottom `--edge-strong` hairline, mono value text, a legend label above.
- **Focus:** The line turns lamp. No glow.
- **Error:** The line turns markup red and a red hint appears below.
- **Checkbox:** A 12px hairline square; checked shows a small ink square inside.
- **Switch:** A 24×12px hairline pill with an 8px round knob. Off, the knob is faint and rests left; on, it slides right in ink over the faint wash. With the radio, the only rounded controls. No lamp.

### Navigation
The masthead holds the ruled mark, the wordmark and a caption. The mark is a short scale with one graduation lit in lamp. Calibrated's own wordmark sets `.word.ruled`, which draws the same scale of ten under the name with a lamp tick at 7. Other products keep a plain `.word`.

### Title Block (optional)
A ruled grid of hairline cells, a small `--key` term over a mono value. The name spans the full row in title caps. Use it when a page needs drawing numbers, versions and approvals in one place.

### Tables, Rows, Revisions
Tables work like parts lists on a panel: legend heads over an `--edge-strong` hairline, body rows over `--edge` hairlines, a muted mono number in the first column. Status cells are plain words: live statuses are lamp with a small star, shipped is green with a check, faults are red. The chosen row in a list boxes its label in an ink hairline (the boxed-value mark), with no wash and no lamp; hovering another row gives that one a faint box. The revision table pairs each red triangle with a description and date.

### Tally
A panel strip at the foot of a sign-off page, under an `--edge-strong` hairline: "n of N signed" and a copy sign-off action, both kept by the kit. If the clipboard is blocked, the lines appear selected in a text box under it. Add `.sticky` to pin it.

### Figures (signature)
SVG drawn from the eight marks: leader + boxed value, ruler, dimension line, detail inset (dashed `2 3` projection with a scale like 20:1), hatch (45° lines = closed), nodes, numbered command, and a FIG. label, with long-dash-dot centre lines (`10 3 2 3`) for axes. One scale per figure. Live strokes, labels and box outlines take the lamp; the live node is the lamp star. Each figure states its facts in an `aria-label`.

## Docs Shell (demo page)

The demo (`demo/index.html`) and the reference (`demo/reference.html`) are docs pages around the kit. The kit's figures carry the identity; the chrome around them recedes. The panel world above applies inside each example preview.

## Do's and Don'ts

### Do:
- **Do** choose the look from the subject (palette, headline face, frame, layout, space) and change at least two settings from the defaults.
- **Do** keep the grammar the same on every page: the marks, one scale, one lamp, the red and green meanings.
- **Do** light the one live thing with the lamp: a line, a word, an outline or the star.
- **Do** keep red for faults, limits and revisions, and green for passed and kept.
- **Do** set text in monospace: IBM Plex Mono for text, Chivo Mono for legends and numbers. Only headings may take another face.
- **Do** open a card with its `.id` line and number badge when the page has numbered items to review or cite.
- **Do** let figures scroll on narrow screens rather than drawing them below 90% of natural size.
- **Do** re-theme by changing seeds only, and let `color-mix()` derive the rest.

### Don't:
- **Don't** fill boxes or regions with the lamp. It's a line, not a paint.
- **Don't** light more than one live item in a figure or working view.
- **Don't** frame panels in thick ink borders or round their corners.
- **Don't** add drop shadows or gradients. The star's glow is the only one.
- **Don't** use bold (600+) for mono titles. Caps, tracking and medium weight carry them.
- **Don't** reuse the template's layout for every subject, or use a serif, script or italic headline face.
- **Don't** let a panel hold several groups without block heads or rules between them.
- **Don't** draw checks or stars with text glyphs inside figures. Use the kit's marks.
- **Don't** tilt the SUPERSEDED or verdict stamp. Markup stamps sit square.
