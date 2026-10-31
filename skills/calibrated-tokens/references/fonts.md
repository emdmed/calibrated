# Fonts

Calibrated uses two families, both under the SIL Open Font License and on Google Fonts. The repo bundles no font files. Each stack falls back to system fonts, and the style holds up with them.

| role | variable | font | use | fallback |
|---|---|---|---|---|
| body | `--font-body` | **Archivo** | prose, values | Helvetica Neue, Arial, sans-serif |
| display | `--font-display` | **Archivo**, condensed with `font-stretch: var(--stretch-title)` (72%) | headlines, card titles, section titles, the title-block name, the wordmark | Arial Narrow, Helvetica Neue, Arial, sans-serif |
| legend | `--font-legend` | **Chivo Mono** | 11px labels, tags, table heads, numbers, every SVG label | `ui-monospace`, SF Mono, Menlo, Consolas, monospace |

Archivo is a variable font with a width axis (62–125) and a weight axis (100–900), so one family covers body and condensed titles.

## Loading from Google Fonts (default)
Put this before `calibrated.css`. The demo and the artifact template do the same, and Claude artifacts allow Google Fonts.
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Chivo+Mono:wght@300..700&display=swap">
```

## Self-hosting
Download the variable woff2 files (both licences allow bundling), put them next to your CSS and declare them before `calibrated.css`:
```css
@font-face { font-family: "Archivo"; src: url(fonts/Archivo-Variable.woff2) format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; font-display: swap; }
@font-face { font-family: "Chivo Mono"; src: url(fonts/ChivoMono-Variable.woff2) format("woff2"); font-weight: 300 700; font-display: swap; }
```
Declare the `font-stretch` range, or condensed titles fall back to normal width.

The figure kit measures label widths with the real font: run your drawing code inside `Calibrated.ready(fn)`, which runs again when fonts finish loading, so boxed values always fit.

## Without the fonts
- Every label width is measured, so nothing overflows.
- Without Archivo's width axis, titles render at normal width in Arial. They wrap sooner but stay readable.
- System monos are a little wider than Chivo Mono at 11px. Leave about 10% slack in hand-placed layouts.
