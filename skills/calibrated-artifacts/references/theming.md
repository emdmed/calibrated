<!-- copied from skills/calibrated-tokens/references/theming.md by scripts/build-artifact-template.mjs -->
# Theming Calibrated

## Seeds

| token | role | film (light, default) | night (dark) |
|---|---|---|---|
| `--bg` | the panel colour | `#f4f2ec` paper | `#1b2225` slate |
| `--fg` | ink: text, lines, filled nodes | `#262b2e` | `#e5e0d3` |
| `--live` | the lamp for the one live thing | `#9c6a06` | `#dcb662` |
| `--ok` | a result that passed (check green) | `#3b7449` | `#b2d49c` |
| `--fault` | a failure, an alert, a limit, a revision (markup red) | `#b5402e` | `#e3735f` |
| `--muted` | secondary text | `#646b68` | `#949c97` |
| `--title` | headlines | `#15191b` | `#eef0ec` |
| `--shade` | what the desk sinks towards | `#6f746a` | `#000` |
| `--desk-depth` | how far the desk sinks below the panels | `9%` | `24%` |

Film is the default on `:root` and answers to `data-theme="film"` and `"light"`. Night answers to `data-theme="night"` and `"dark"`. `data-theme="auto"` uses film, or night when the OS prefers dark.

`--muted` can also be derived: `color-mix(in srgb, var(--fg) 62%, var(--bg))`. It's a seed so a theme can tune its hue.

## Derived tokens

| token | formula | use |
|---|---|---|
| `--gutter` | bg + shade at `--desk-depth` | the desk: page background behind the panels |
| `--panel` | bg | cards, figures, tables, the tally |
| `--well` | bg 90% + shade | code, recessed areas |
| `--raised` | bg 94% + fg | the "today" note, raised printouts |
| `--edge` | bg 86% + fg | hairlines inside panels, dashed splits |
| `--edge-strong` | bg 70% + fg | section rules, table heads, note borders, box outlines, ruler baseline, minor ticks |
| `--legend` | fg 86% + bg | ledes, tally text |
| `--faint` | fg 45% + bg | keys, major ticks, scale numbers, FIG. labels, leaders |
| `--glow` | live 55% over transparent | the halo behind the lamp star |
| `--swipe` | live 16% over transparent | a faint lamp tint for the rare live area (`K.highlight`) |
| `--select-bg` | live 30% over transparent | text selection |
| `--hover` / `--current` | fg at 5% / 8% over transparent | row hover / the current row |

Line weights are tokens too: `--line-thick: 1.6px`, `--line-thin: 1px`.

The derivations depend only on the order of the seeds. So any dark-on-light or light-on-dark pair works, as long as `--bg` and `--fg` are far apart.

## Contrast
- `--fg` on `--bg`: at least 11:1. Ink must read at 11px.
- **The lamp is a text and line colour.** `--live` on `--bg` needs at least 4.5:1, because live values are set in it at 11px. On a light panel that means a dark amber (or a deep version of whatever hue you pick), not a bright yellow.
- `--ok` and `--fault` are used as text: at least 4.5:1 against `--bg`.
- `--muted` about 5:1. `--faint` (derived) must reach 3:1: it carries scale numbers. If it's too weak, override it: `--faint: color-mix(in srgb, var(--fg) 55%, var(--bg));`.
- The desk must read as darker than the panels. If panels and desk blur together, raise `--desk-depth`.

## Make a theme

1. Pick `--bg` (panel) and `--fg` (ink) with a contrast of at least 11:1.
2. Pick `--live`, a lamp hue that `--ok` and `--fault` don't already use: amber, cyan, pink or orange. Check it at 4.5:1 as text on `--bg`.
3. Set `--ok` and `--fault` with at least 4.5:1 against `--bg`, clearly apart from the lamp.
4. Set `--muted` and `--title`, then check `--faint`.
5. Set `--shade` to the desk tone (a warm grey for light panels, black for dark ones) and `--desk-depth` so the desk reads clearly darker.

Example "harbour" theme (white ink on navy panels, cyan lamp):
```css
[data-theme="harbour"] {
  --bg: #10223a; --fg: #e9eff6; --live: #45d3ea;
  --ok: #6fd39a; --fault: #ff8070; --muted: #9db0c6; --title: #ffffff;
  --shade: #000; --desk-depth: 26%;
  color-scheme: dark;
}
```

## Scoped themes
Derived tokens are declared on `:root`, on every `[data-theme]` element and on `.cal-theme`. So one section can carry its own theme, and its edges, faints, wells and glow recompute from its own seeds:

```html
<section data-theme="film">…</section>                         <!-- a film panel in a night page -->
<section data-theme="night">…</section>                        <!-- a night panel in a film page -->
<section class="cal-theme" style="--bg:#10223a;--fg:#e9eff6;--live:#45d3ea">…</section>
```
A themed section paints its own `--bg` and `--fg`.
