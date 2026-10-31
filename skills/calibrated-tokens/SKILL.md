---
name: calibrated-tokens
description: Design tokens and base CSS for the Calibrated style, a technical-drawing look (an ISO engineering drawing sheet: graphite ink on drafting film, two line weights, Archivo and Chivo Mono type, a highlighter swipe for the one live thing). Use when starting any page, app or component in the Calibrated style, when theming it (new palette, the light "film" or dark "night" theme, brand colours), or when asked for the "calibrated" look, a "drawing set", "drawing sheet" or "blueprint / engineering drawing" UI in plain CSS. Read this before calibrated-figures or calibrated-components.
---

# Calibrated · tokens

Calibrated draws quantities as small technical figures and keeps everything else quiet. Every page is a drawing sheet. This skill gives it the sheet, the ink, the line weights, the type and the highlighter. Copy the file below into the project. Don't link it from the skill folder.

## Files
- `assets/calibrated.css`: tokens, the `film` (light, default) and `night` (dark) themes, the base reset and utilities. Copy it into the project and load it first.
- `references/theming.md`: how every colour is derived, how to make a theme from a few colours, and contrast checks.
- `references/fonts.md`: the type roles, the Google Fonts link, self-hosting, and how the fallbacks behave.

## Rules

1. **Seeds.** `--bg` (the sheet), `--fg` (ink) and `--live` (the highlighter) set the look. `--ok` (check green), `--fault` (markup red), `--muted`, `--title`, `--shade` and `--swipe-strength` complete it. Every other colour (`--gutter`, `--panel`, `--well`, `--raised`, `--edge`, `--edge-strong`, `--legend`, `--faint`, `--swipe`, `--hover`, `--current`) comes from `color-mix()` over the seeds. To re-theme, change the seeds and nothing else.
2. **Ink, not colour.** Draw everything in `--fg` and its derived tints. The one live or current thing per view (a running job, the selected value, the next step) is **highlighted, not coloured**: a `--swipe` behind ink that stays `--fg`. `--ok` and `--fault` only state a result (passed, failed, over the limit) or a revision. Never use colour for decoration.
3. **Lines, not fills.** Surfaces are flat. Two line weights, as on an ISO drawing: `--line-thick` (1.6px) for frames, rules under heads and outlines that matter; `--line-thin` (1px) for everything else. Steps in background (`--gutter` desk < `--well` < `--panel` sheet < `--raised`) separate areas. No shadows, no rounded corners, no gradients.
4. **Type roles.**
   - body `--font-body` (Archivo → Helvetica Neue, Arial): prose and values.
   - legend `--font-legend` (Chivo Mono → `ui-monospace`) at 11px, tracked `.06em`, uppercase for labels: names, tags, table heads, numbers, every SVG label. Use class `.lg` (+ `.up`).
   - display `--font-display` (Archivo condensed via `font-stretch: var(--stretch-title)`): headlines and titles in uppercase (`.title`), and the wordmark once per page in the same condensed caps (`.word`; add `.ruled` to set it on a scale of ten with one live graduation).
5. **Numbers are tabular** (`font-variant-numeric: tabular-nums`, already on `.lg` and `svg[data-cal]`). Zero-pad counts that update, so they don't jump.
6. **Themes:** the default is light "film" (also `data-theme="light"`). Use `<html data-theme="night">` (or `"dark"`) for dark, or `data-theme="auto"` to follow the OS. Any element with `data-theme` becomes a themed section that recomputes its own derived colours.

## Utilities in the file
`.lg` legend type · `.up` uppercase · `.title` condensed caps headline · `.word` wordmark · `.mut` `.fnt` `.okc` `.flt` ink colours · `.live` highlighter swipe behind text · `.wrap` page column · `.cal-mark` the ruled brand mark (a scale with one swiped graduation) (`<svg class="cal-mark"><use href="#cal-mark"/></svg>`, the `<symbol>` is in `demo/index.html`) · `.cal-dot` status mark: outlined square (next), `.done` (ink square), `.on` (live: ink dot on a highlight), `.ok`, `.fault` · `svg[data-cal]` sets legend type on figures.

## Starter
```html
<!DOCTYPE html>
<html lang="en" data-theme="auto">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Chivo+Mono:wght@300..700&display=swap">
  <link rel="stylesheet" href="css/calibrated.css">
</head>
<body>
  <div class="wrap">
    <h1 class="title">Release 2.4 · what changed</h1>
    <p class="mut">Ink for everything, <span class="live">the highlighter for the one live thing</span>.</p>
  </div>
</body>
</html>
```

## Brand themes
To adapt the style to a brand, override the seeds on `:root` (or any container) after loading the file:
```css
:root { --bg: #f4f6fa; --fg: #14213d; --live: #7fe3f0; --ok: #2c7a4b; --fault: #c5302a; --muted: #55607a; --title: #0b1428; }
```
Then check contrast as described in `references/theming.md`.

## Related skills
- **calibrated-figures**: SVG marks (ruler, leader, boxed value, dimension line, hatch, nodes…) for drawing quantities.
- **calibrated-components**: the drawing sheet, title block, revisions, cards, tables, counts, tabs, and the meter/progress/diff/duration instruments.
- **calibrated-artifacts**: a standalone, single-file version for Claude artifacts.
