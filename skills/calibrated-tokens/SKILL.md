---
name: calibrated-tokens
description: Design tokens and base CSS for the Calibrated style, a technical-drawing look (quiet panels on a darker desk, warm ink in hairlines, all-monospace type in IBM Plex Mono and Chivo Mono, and an amber lamp for the one live thing). Use when starting any page, app or component in the Calibrated style, when theming it (new palette, the light "film" or dark "night" theme, brand colours), or when asked for the "calibrated" look, a "drawing set" or a technical / engineering-drawing UI in plain CSS. Read this before calibrated-figures or calibrated-components.
---

# Calibrated · tokens

Calibrated draws quantities as small technical figures and keeps everything else quiet. Pages are panels on a desk. This skill gives them the panels, the ink, the hairlines, the type and the lamp. Copy the file below into the project. Don't link it from the skill folder.

## Files
- `assets/calibrated.css`: tokens, the `film` (light, default) and `night` (dark) themes, the base reset and utilities. Copy it into the project and load it first.
- `references/theming.md`: how every colour is derived, how to make a theme from a few colours, and contrast checks.
- `references/fonts.md`: the type roles, the Google Fonts link, self-hosting, and how the fallbacks behave.

## Rules

1. **Seeds.** `--bg` (the panel), `--fg` (ink) and `--live` (the lamp) set the look, with `--desk-depth` for how far the desk sinks. Every other colour comes from them through `color-mix()`: the supporting inks `--title`, `--muted`, `--ok` (check green), `--fault` (markup red) and `--shade`, and the surfaces and lines (`--gutter`, `--panel`, `--well`, `--raised`, `--edge`, `--edge-strong`, `--legend`, `--faint`, `--key`, `--glow`, `--swipe`, `--hover`, `--current`). To re-theme, change the seeds and nothing else.
2. **Ink, and one lamp.** Draw everything in `--fg` and its derived tints. The one live or current thing per view (a running job, the selected value, the next step) is **lit by the lamp**: `--live` as a line, a word (`.live`), an outline or a small glowing star (`.star`). Never fill a box or region with it. `--swipe` is a faint lamp tint for the rare area that must read as live. `--ok` and `--fault` only state a result (passed, failed, over the limit) or a revision. Never use colour for decoration.
3. **Tone, not frames.** Surfaces are flat panels on a darker desk (`--gutter` desk < `--panel` < `--raised`; `--well` recessed), separated by gaps. The desk is dark enough (`--desk-depth`) that every panel edge is visible at a glance. Lines are hairlines: `--edge` inside, `--edge-strong` for heads and dividers. `--line-thick` (1.6px) is kept for the rare rule that must weigh more. No shadows, no rounded corners, no gradients.
4. **Type roles.** Every word is monospace.
   - body `--font-body` (IBM Plex Mono → `ui-monospace`) at 14px/1.6: prose and values.
   - display `--font-display` (the same face): headlines and titles in uppercase at medium weight (500), tracked `.03em` (`.title`); section heads at `--fs-h2` (16px, 500, sentence case), and the wordmark once per page (`.word`; add `.ruled` to set it on a scale of ten with a lamp tick at 7).
   - legend `--font-legend` (Chivo Mono → `ui-monospace`) at 11px, tracked `.05em`, uppercase for short labels: section heads, tags, table heads, numbers, every SVG label. Use class `.lg` (+ `.up`). Ligatures are off.
   - controls at `--fs-control` (12px): buttons, tabs and field labels. Field labels, helper text and anything longer than four words stay in sentence case. Caps are for short labels only.
5. **Numbers are tabular** (`font-variant-numeric: tabular-nums`, already on `.lg` and `svg[data-cal]`). Zero-pad only counts that update live, so they don't jump.
6. **Themes:** the default is light "film" (also `data-theme="light"`). Use `<html data-theme="night">` (or `"dark"`) for dark, or `data-theme="auto"` to follow the OS. Any element with `data-theme` becomes a themed section that recomputes its own derived colours.

## Utilities in the file
`.lg` legend type · `.up` uppercase · `.title` typewriter-caps headline · `.word` wordmark · `.mut` `.fnt` `.okc` `.flt` ink colours · `.live` lamp text · `.star` the lamp star, inline (`.star.ok` in green, no glow) · `.wrap` page column · `.cal-mark` the ruled brand mark (a scale with one lamp graduation) (`<svg class="cal-mark"><use href="#cal-mark"/></svg>`, the `<symbol>` is in `demo/index.html`) · `.cal-dot` status mark: outlined square (next), `.done` (ink square), `.on` (live: a lamp star), `.ok`, `.fault` · `svg[data-cal]` sets legend type on figures.

## Starter
```html
<!DOCTYPE html>
<html lang="en" data-theme="auto">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&family=Chivo+Mono:wght@300..700&display=swap">
  <link rel="stylesheet" href="css/calibrated.css">
</head>
<body>
  <div class="wrap">
    <h1 class="title">Release 2.4 · what changed</h1>
    <p class="mut">Ink for everything, <span class="live">the lamp for the one live thing</span>.</p>
  </div>
</body>
</html>
```

## Brand themes
To adapt the style to a brand, override the seeds on `:root` (or any container) after loading the file:
```css
:root { --bg: #f4f6fa; --fg: #14213d; --live: #0a7d93; }
```
Title, muted, green, red, the desk and every line derive from these three. Then check contrast as described in `references/theming.md` (ink on panel 11:1, lamp on panel 4.5:1).

## Related skills
- **calibrated-figures**: SVG marks (ruler, leader, boxed value, dimension line, hatch, nodes…) for drawing quantities.
- **calibrated-components**: cards, sections, blocks, tables, counts, tabs, tiered buttons, revisions, an optional drawing sheet and title block, and the meter/progress/diff/duration instruments.
- **calibrated-artifacts**: a standalone, single-file version for Claude artifacts.
