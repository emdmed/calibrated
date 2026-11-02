# Fonts

Calibrated uses two monospace families, both under the SIL Open Font License and on Google Fonts. The repo bundles no font files. Each stack falls back to system monos, and the style holds up with them.

| role | variable | font | use | fallback |
|---|---|---|---|---|
| body | `--font-body` | **IBM Plex Mono** 400 | prose, values | `ui-monospace`, SF Mono, Menlo, Consolas, monospace |
| display | `--font-display` | **IBM Plex Mono** 400–500, uppercase, tracked | headlines, card titles, the title-block name, the wordmark | same |
| legend | `--font-legend` | **Chivo Mono** | 11px labels, tags, table heads, numbers, every SVG label | same |

Titles get their weight from caps and tracking, not from bold.

A page may swap the display face for one grotesk or condensed sans, for headings only (headline, section names, card titles, title-block name, wordmark). Body, labels, legends and figures stay monospace. See `looks.md` for the faces that fit and how to set `--font-display`, `--display-case` and `--display-weight`. Load it in the same Google Fonts link, e.g. `&family=Barlow+Condensed:wght@500;600`. Chivo Mono is tighter than Plex at small sizes, which is why it carries the legends and every figure label.

## Loading from Google Fonts (default)
Put this before `calibrated.css`. The demo and the artifact template do the same, and Claude artifacts allow Google Fonts.
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&family=Chivo+Mono:wght@300..700&display=swap">
```

## Self-hosting
Download the woff2 files (both licences allow bundling), put them next to your CSS and declare them before `calibrated.css`:
```css
@font-face { font-family: "IBM Plex Mono"; src: url(fonts/IBMPlexMono-Regular.woff2) format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "IBM Plex Mono"; src: url(fonts/IBMPlexMono-Medium.woff2) format("woff2"); font-weight: 500; font-display: swap; }
@font-face { font-family: "Chivo Mono"; src: url(fonts/ChivoMono-Variable.woff2) format("woff2"); font-weight: 300 700; font-display: swap; }
```

The figure kit measures label widths with the real font: run your drawing code inside `Calibrated.ready(fn)`, which runs again when fonts finish loading, so boxed values always fit.

## Without the fonts
- Every label width is measured, so nothing overflows.
- The page falls back to the system mono and keeps its look: all-mono was chosen partly because it survives without web fonts.
- System monos are a little wider than Chivo Mono at 11px. Leave about 10% slack in hand-placed layouts.
