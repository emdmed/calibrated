<!-- copied from skills/calibrated-tokens/references/theming.md by scripts/build-artifact-template.mjs -->
# Theming Calibrated

## Seeds

A theme is three colours and a desk depth:

| token | role | film (light, default) | night (dark) |
|---|---|---|---|
| `--bg` | the panel colour | `#f4f2ec` paper | `#1b2225` slate |
| `--fg` | ink: text, lines, filled nodes | `#262b2e` | `#e5e0d3` |
| `--live` | the lamp for the one live thing | `#8a5d05` | `#dcb662` |
| `--desk-depth` | how far the desk sinks below the panels | `14%` | `70%` |

Film is the default on `:root` and answers to `data-theme="film"` and `"light"`. Night answers to `data-theme="night"` and `"dark"`. `data-theme="auto"` uses film, or night when the OS prefers dark.

## Derived inks

The supporting inks follow `--bg` and `--fg`, so a region that re-seeds only the three colours keeps readable titles, secondary text and status colours:

| token | formula | use |
|---|---|---|
| `--title` | ink pushed further from mid-grey (relative `oklch`) | headlines, the chosen value |
| `--muted` | fg 70% + bg | secondary text |
| `--ok` | the lightness of fg 75% + bg, at a green hue | a result that passed (check green) |
| `--fault` | the lightness of fg 66% + bg, at a red hue | a failure, an alert, a limit, a revision (markup red) |
| `--shade` | bg 45% of the way to black | what the desk sinks towards |

All of them hold 4.5:1 on panel, raised and well whenever `--fg` on `--bg` is 11:1. A theme may still override any of them after `calibrated.css`, to tune a hue.

## Derived tokens

| token | formula | use |
|---|---|---|
| `--gutter` | bg + shade at `--desk-depth` | the desk: page background behind the panels |
| `--panel` | bg | cards, figures, tables, the tally |
| `--well` | bg 90% + shade | code, recessed areas |
| `--raised` | bg 94% + fg | the "today" note, raised printouts |
| `--edge` | bg 86% + fg | hairlines inside panels, dashed splits |
| `--edge-strong` | bg 70% + fg | structure only: section rules, table heads, note borders, box outlines |
| `--legend` | fg 86% + bg | ledes, tally text |
| `--faint` | fg 52% + bg | marks, never text: ticks, leaders, open nodes, field lines, line types (at least 3:1) |
| `--key` | fg 72% + bg | small text: keys, terms, scale numbers, FIG. labels, quiet tags (at least 4.5:1) |
| `--glow` | live 55% over transparent | the halo behind the lamp star |
| `--swipe` | live 16% over transparent | a faint lamp tint for the rare live area (`K.highlight`) |
| `--select-bg` | live 30% over transparent | text selection |
| `--hover` / `--current` | fg at 5% / 8% over transparent | row hover / the current row |

Line weights are tokens too: `--line-thick: 1.6px`, `--line-thin: 1px`.

The derivations depend only on the order of the seeds. So any dark-on-light or light-on-dark pair works, as long as `--bg` and `--fg` are far apart.

In forced-colours mode every ink maps to a system colour (ink, title, muted, key, ok, fault and `--edge-strong` to CanvasText; `--faint` and `--edge` to GrayText; the lamp to Highlight; surfaces to Canvas), so meaning never rests on green or red alone.

## Contrast
- `--fg` on `--bg`: at least 11:1. Ink must read at 11px, and the derived inks only reach 4.5:1 above it.
- **The lamp is a text and line colour.** `--live` on `--bg` needs at least 4.5:1, because live values are set in it at 11px. On a light panel that means a dark amber (or a deep version of whatever hue you pick), not a bright yellow.
- Text is never `--faint`; use `--key` for small labels.
- The desk must read as darker than the panels. If panels and desk blur together, raise `--desk-depth`.

## Make a theme

1. Pick `--bg` (panel) and `--fg` (ink) with a contrast of at least 11:1.
2. Pick `--live`, a lamp hue that green and red don't already use: amber, cyan, pink or orange. Check it at 4.5:1 as text on `--bg`.
3. Set `--desk-depth` so the desk reads clearly darker than the panels: around 14% for light panels, 70% for dark ones.
4. Override a derived ink only if its hue clashes with your lamp.

Example "harbour" theme (white ink on navy panels, cyan lamp):
```css
[data-theme="harbour"] {
  --bg: #10223a; --fg: #e9eff6; --live: #45d3ea;
  --desk-depth: 70%;
  color-scheme: dark;
}
```

## Scoped themes
Derived tokens are declared on `:root`, on every `[data-theme]` element and on `.cal-theme`. So one section can carry its own theme, and its inks, edges, wells and glow recompute from its own three seeds:

```html
<section data-theme="film">…</section>                         <!-- a film panel in a night page -->
<section data-theme="night">…</section>                        <!-- a night panel in a film page -->
<section class="cal-theme" style="--bg:#10223a;--fg:#e9eff6;--live:#45d3ea">…</section>
```
A themed section paints its own `--bg` and `--fg`.
