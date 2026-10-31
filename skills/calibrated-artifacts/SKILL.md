---
name: calibrated-artifacts
description: Design and publish Claude artifacts (claude.ai/artifact pages) in the Calibrated style, a technical "drawing set" look where each page is an engineering drawing sheet (zone frame, title block, revisions) and quantities are drawn as figures with rulers, leaders, boxed values, dimension lines and hatching, in graphite ink with a highlighter for the one live thing. Standalone: ships a single-file HTML template with the whole CSS + vanilla JS kit inlined, so it needs no other skill. Use when asked for a calibrated artifact or page, a design proposal or review board with keep/drop sign-off, a technical explainer, a status or deploy report, a spec sheet, or any artifact that should explain numbers, progress, durations or structure with drawings instead of text.
---

# Calibrated · artifacts

A Calibrated artifact is a **drawing set**: a framed drawing sheet with a title block, one drawing per item. Each drawing's figure replaces a sentence, a list or a column of numbers, and is built only from eight marks, in ink, with a highlighter on the one live thing.

This skill is self-contained. `assets/template.html` already holds the tokens, the components and the figure kit inlined, and works as a single published file.

## Files
- `assets/template.html`: the starting page, an example deploy review (sheet with zones, mast, headline with title block, figure cards with today/drawn, instruments, roll-up table, sign-off tally). **Copy it, then replace the content.** Don't touch the generated block between the `calibrated … generated` comments.
- `assets/blocks.md`: copy-paste HTML for every block: sheet, title block, section, figure card, revisions, specimen grid, instruments, table, tiers, sign-off.
- `assets/calibrated-inline.css`, `assets/calibrated-inline.js`: the same kit without a page, for inlining into a page you write from scratch.
- `references/page-patterns.md`: the page types and which blocks each one uses. **Read it first.**
- `references/artifact-limits.md`: what an artifact page can and can't do, fonts, themes, and publishing.
- `references/marks.md`, `references/recipes.md`: how to draw figures (the `K` kit and the nine recipes).
- `references/catalog.md`: every CSS class and custom element, with attributes.
- `references/theming.md`: seeds, derived tokens, making a palette.

## Workflow
1. **Decide the page type** (proposal/review board, explainer, status report, spec sheet) from `page-patterns.md`. Write down the page's single job in one line.
2. **List the drawings.** For each item, write the sentence or list that the UI or doc says today. That text becomes the figure's subject and its `aria-label`.
3. **Pick the drawing** for each one: a recipe if one fits (`lanes`, `budget`, `merge`, `fanout`, `loop`, `measured`, `timeline`, `matrix`, `section`), an instrument element for a single quantity (`<cal-meter>`, `<cal-progress>`, `<cal-position>`, `<cal-diff>`, `<cal-durations>`), or a hand-drawn figure from the marks.
4. **Copy `assets/template.html`** into the working folder as `<name>.html`. Replace the mast, headline, title block, sections and the page-figures script. Delete the example content you don't use. Keep the `<title>` a 2–4 word name.
5. **Look once.** Take one screenshot if the session can (headless Chromium or a browser tool), fix what it shows, then publish. Check for: boxes that clip text, leaders that cross, more than one highlight per figure, empty stages.
6. **Publish.** Call the artifacts server's `guide` (topic `pages`) once per session before the first publish, then `publish_files` with the file (or `publish_version` with the content), with a title and `icon: "chart"`. Give the user the link in one sentence.

## House rules
1. **A figure replaces text that already exists, from data that already exists.** Show the text beside it (`today` → `drawn`) when the page is a proposal. Drop it on reports.
2. **Ink for everything; the highlighter for the one live thing** per figure: the running lane, the current step, the projected value. It's a swipe behind ink, never coloured text. `ok`/`fault` only for results, thresholds and revisions.
3. **Eight marks only**: leader + boxed value, ruler, dimension line, detail inset, hatch, nodes (■ done, □ next, ◇ merge, ● live), numbered command, FIG. label. Don't add pie charts, gradients, icons or emoji.
4. **One scale per figure.** Number the major ticks only. Units go on the numbers.
5. **Every figure has a stable `FIG.n`**, matching the card's drawing number when it lives in a card.
6. **Type:** Archivo for body, condensed Archivo caps for headlines and titles, 11px Chivo Mono legends in uppercase for labels and numbers. The wordmark once, in the mast.
7. **A drawing sheet**: the page sits in `.cal-sheet` with zones; a title block names it. Two line weights, no radius, no shadows, no gradients.
8. **Numbered sections** (`1 · Name`, a short note, `sheet 1/3`). Numbers must mean something.
9. **Complete at rest**: everything readable on load; no reveal-on-scroll.
10. **Words**: short, specific, active. Write *why* in the card, *where* / *replaces* / *data* in the key/value sheet.
11. **Leave alone**: terminal output, prompt text, menus. Don't draw where there's nothing to measure.

## Themes
The page follows the viewer: Claude sets `data-theme="light"` or `"dark"` on `<html>`, and the kit maps `light` to the film theme and `dark` to night. With neither, the template follows the OS. To re-colour, override the seeds (`--bg`, `--fg`, `--live`, `--ok`, `--fault`, `--muted`, `--title`) in the marked block after the inlined kit. For dark values, override them in `[data-theme="dark"]` and in the template's `prefers-color-scheme: dark` block (see `artifact-limits.md`).

## Without the template
If the page has to be written from scratch, link the Google Fonts stylesheet (see `artifact-limits.md`), put `calibrated-inline.css` in a `<style>` and `calibrated-inline.js` in a `<script>` before the page's own script, and paste the `<symbol id="cal-mark">` if you use the mark. Draw inside `Calibrated.ready(() => { … })`.
