---
name: calibrated-artifacts
description: Design and publish Claude artifacts (claude.ai/artifact pages) in the Calibrated style, a technical "drawing set" look: quiet panels on a darker desk, numbered cards and sections, all-monospace type, and quantities drawn as figures with rulers, leaders, boxed values, dimension lines and hatching, in warm ink with an amber lamp for the one live thing. Standalone: ships a single-file HTML template with the whole CSS + vanilla JS kit inlined, so it needs no other skill. Use when asked for a calibrated artifact or page, a design proposal or review board with keep/rework/drop sign-off, a technical explainer, a status or deploy report, a spec sheet, or any artifact that should explain numbers, progress, durations or structure with drawings instead of text.
---

# Calibrated · artifacts

A Calibrated artifact is a **drawing set**: quiet panels on a desk, one numbered drawing per item. Each drawing's figure replaces a sentence, a list or a column of numbers, and is built only from eight marks, in ink, with the lamp on the one live thing.

## What good looks like
A good page is **dense and measured**. Every drawing reads off a scale, boxes its values on leaders, magnifies the small part that matters, and lights one small thing with the lamp. It sits in a card beside a short title, a *why* and its facts. The first drawing is on the first screen.

A bad page is **a slide in a frame**: a big hero headline over empty space, then a box-and-arrow diagram of labelled rectangles with no numbers, one box filled with the accent colour, and the figure using half of a wide empty frame. The fonts and colours are right, but nothing is measured. Avoid every part of this.

A page is also bad when it's **pretty but hard to use**: a drawing that drops the names or prices the sentence had, buttons that look like labels, a form with SHEET numbers and a vim status line, a red "approved" stamp. Read `references/ux-rules.md` before you compose.

These are principles. Don't reuse one layout for every subject. Choose the page type and the drawings from the content.

This skill is self-contained. `assets/template.html` already holds the tokens, the components and the figure kit inlined, and works as a single published file.

## Files
- `assets/template.html`: the starting page, an example deploy review (mast, intro, figure cards with today/drawn, instruments, roll-up table, sticky sign-off tally). **Copy it, then replace the content.** Don't touch the generated block between the `calibrated … generated` comments.
- `assets/blocks.md`: copy-paste HTML for every block: mast, intro, section, figure card, revisions, specimen grid, instruments, table, tiers, sign-off, and the optional sheet and title block.
- `assets/calibrated-inline.css`, `assets/calibrated-inline.js`: the same kit without a page, for inlining into a page you write from scratch.
- `references/page-patterns.md`: the page types and which blocks each one uses. **Read it first.**
- `references/ux-rules.md`: when to draw and when not to, actions, forms, words, colour meaning, and the six-question check before delivering. **Read it second.**
- `references/drawing-quality.md`: the quality bar for every drawing, and the checklist for the screenshot. **Read it third.**
- `references/artifact-limits.md`: what an artifact page can and can't do, fonts, themes, and publishing.
- `references/marks.md`, `references/recipes.md`: how to draw figures (the `K` kit and the nine recipes).
- `references/catalog.md`: every CSS class and custom element, with attributes.
- `references/theming.md`: seeds, derived tokens, making a palette.

## Workflow
1. **Decide the page type** (proposal/review board, explainer, status report, spec sheet, app screen/form) from `page-patterns.md`. Write down who reads it, the page's single job and its one main action.
2. **List the drawings.** For each item, write the sentence or list that the UI or doc says today. That text becomes the figure's subject and its `aria-label`.
3. **Find the numbers.** Write down three or more values each drawing will show (counts, sizes, durations, limits, positions). If an item has none, it gets text or a table, not a drawing. Every name and value in the sentence must appear in the drawing. If it can't hold them, keep the text or a table.
4. **Pick the drawing** for each one: a recipe if one fits (`lanes`, `budget`, `merge`, `fanout`, `loop`, `measured`, `timeline`, `matrix`, `section`), an instrument element for a single quantity (`<cal-meter>`, `<cal-progress>`, `<cal-position>`, `<cal-diff>`, `<cal-durations>`), or a hand-drawn figure from the marks. Never a flowchart of labelled boxes (see `drawing-quality.md` §1 for what to draw instead).
5. **Copy `assets/template.html`** into the working folder as `<name>.html`. Replace the mast, headline, title block, sections and the page-figures script. Delete the example content you don't use. Keep the `<title>` a 2–4 word name. Put every drawing in a `cal-card` with its info column, on explainers and reports as well as proposals.
6. **Look once.** Take one screenshot if the session can (headless Chromium or a browser tool; pass `--force-prefers-reduced-motion`, since headless freezes the animation clock on the first frame), fix what it shows, then publish. Go through the checklist at the end of `drawing-quality.md` (values on every figure, no flowcharts, one small lamp, figures that fill their stage, the first drawing on the first screen, no clipping or crossing leaders) and the six questions at the end of `ux-rules.md` (what the page is in five seconds, one filled main action, figures that keep every fact, no jargon, clear hierarchy and separation, conventional colours and formats).
7. **Publish.** Call the artifacts server's `guide` (topic `pages`) once per session before the first publish, then `publish_files` with the file (or `publish_version` with the content), with a title and `icon: "chart"`. Give the user the link in one sentence.

## House rules
1. **A figure replaces text that already exists, from data that already exists.** Show the text beside it (`today` → `drawn`) when the page is a proposal. Drop it on reports.
2. **Ink for everything; the lamp for the one live thing** per figure: the running lane, the current step, the projected value. The lamp is amber line, text, an outline or the small star node (ink `lv`, `.live`, `.star`). Never fill a box or region with it. `ok`/`fault` only for results, thresholds and revisions.
3. **Eight marks only**: leader + boxed value, ruler, dimension line, detail inset, hatch, nodes (■ done, □ next, ◇ merge, ● live), numbered command, FIG. label. Don't add pie charts, gradients, icons or emoji. No flowcharts: a box always holds a value.
4. **One scale per figure.** Number the major ticks only. Units go on the numbers.
5. **Every figure has a stable `FIG.n`**, matching the card's drawing number when it lives in a card.
6. **Type:** all monospace, in four steps: IBM Plex Mono in uppercase at medium weight (500), tracked, for headlines and card titles; section heads at 16px medium in sentence case; block heads (`.cal-block-h`) at 12px medium caps in ink; 11px Chivo Mono legends in uppercase for section heads, tags, table heads and every figure label. Field labels and helper text are sentence case at 12px. The wordmark once, in the mast.
7. **Panels on a desk**: cards, tables and instrument panels sit straight on the desk inside `.wrap`, separated by gaps. Hairlines only (`--edge`, `--edge-strong`, dashed between today and drawn). No thick frames, no radius, no shadows, no gradients. The framed `.cal-sheet` with zones and a title block is optional, for pages that need drawing numbers and approvals.
8. **Numbered sections** (`1 · Name`, a short note, `sheet 1/3`). Numbers must mean something. App screens and forms drop the sheet number (`data-mode="app"`).
9. **Separate the groups.** Inside a panel or the sheet, each group (instruments, a figure, a table, notes) is a `.cal-block` with a head, ruled off from the next. Buttons are tiered: one filled `.primary`, boxed defaults, bracketed `.inline` words in text.
10. **Dense, not airy.** The headline is short; each card opens with its `.id` line. No empty bands. Each figure fills its stage, and its viewBox fits the drawing.
11. **Complete at rest**: everything readable on load; no reveal-on-scroll. Instruments sweep to their value once when they come into view (under a second) and glide when a value changes; that is their only motion. Mount figures with `Calibrated.mount`. Use `Calibrated.play` (see `recipes.md`) only when the replay is the point, for example a run's lanes or a loop the reader steps through with buttons, and on at most one figure per page.
12. **Words**: short, specific, active. Write *why* in the card, *where* / *replaces* / *data* in the key/value sheet.
13. **Leave alone**: terminal output, prompt text, menus. Don't draw where there's nothing to measure.

## Themes
The page follows the viewer: Claude sets `data-theme="light"` or `"dark"` on `<html>`, and the kit maps `light` to the film theme and `dark` to night. With neither, the template follows the OS. To re-colour, override the seeds (`--bg`, `--fg`, `--live`, `--ok`, `--fault`, `--muted`, `--title`) in the marked block after the inlined kit. For dark values, override them in `[data-theme="dark"]` and in the template's `prefers-color-scheme: dark` block (see `artifact-limits.md`).

## Without the template
If the page has to be written from scratch, link the Google Fonts stylesheet (see `artifact-limits.md`), put `calibrated-inline.css` in a `<style>` and `calibrated-inline.js` in a `<script>` before the page's own script, and paste the `<symbol id="cal-mark">` if you use the mark. Draw inside `Calibrated.ready(() => { … })`.
