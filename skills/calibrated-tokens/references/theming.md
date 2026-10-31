# Theming Calibrated

## Seeds

| token | role | film (light, default) | night (dark) |
|---|---|---|---|
| `--bg` | the sheet: the panel colour | `#f6f7f3` drafting film | `#18191a` graphite |
| `--fg` | ink: text, lines, filled nodes | `#1d2126` | `#e6e6e3` |
| `--live` | the highlighter for the one live thing | `#f3dc3a` | `#e9d43c` |
| `--ok` | a result that passed (check green) | `#2c7a4b` | `#7cc493` |
| `--fault` | a failure, an alert, a limit, a revision (markup red) | `#c5302a` | `#f0715f` |
| `--muted` | secondary text | `#59616a` | `#9aa3a8` |
| `--title` | headlines | `#0f1216` | `#f4f6f1` |
| `--shade` | what the desk sinks towards | `#6d7368` | `#000` |
| `--swipe-strength` | how much of `--live` the swipe uses | `72%` | `92%` |
| `--on-swipe` | ink set on a highlight (live text, live node dot) | `var(--fg)` | `#18191a` |

Film is the default on `:root` and answers to `data-theme="film"` and `"light"`. Night answers to `data-theme="night"` and `"dark"`. `data-theme="auto"` uses film, or night when the OS prefers dark.

`--muted` can also be derived: `color-mix(in srgb, var(--fg) 62%, var(--bg))`. It's a seed so a theme can tune its hue.

## Derived tokens

| token | formula | use |
|---|---|---|
| `--gutter` | bg 86% + shade | the desk: page background behind the sheet |
| `--panel` | bg | the sheet: cards, figures, cells |
| `--well` | bg 94% + shade | inputs, code, notes, recessed areas |
| `--raised` | bg 96% + fg | plates, the measured figure's backing |
| `--edge` | bg 84% + fg | hairlines, faint grids |
| `--edge-strong` | bg 62% + fg | inner rules, box outlines, ruler baseline, minor ticks |
| `--legend` | fg 88% + bg | ledes, tally text |
| `--faint` | fg 52% + bg | major ticks, scale numbers, FIG. labels, leaders, zone labels |
| `--swipe` | live at `--swipe-strength`, over transparent | the highlighter swipe behind live text, nodes and lines; text selection |
| `--hover` / `--current` | fg at 5% / 8% over transparent | row hover / the current row, a pressed button |

Line weights are tokens too: `--line-thick: 1.6px`, `--line-thin: 1px`.

The derivations depend only on the order of the seeds. So any dark-on-light or light-on-dark pair works, as long as `--bg` and `--fg` are far apart.

## Contrast
- `--fg` on `--bg`: at least 11:1. Ink must read at 11px.
- **The highlighter is a background, not a text colour.** Anything set on it uses `--on-swipe`, so what matters is `--on-swipe` over `--swipe` (mixed onto `--bg`): at least 7:1. On a light sheet `--on-swipe` is the ink itself. On a dark sheet keep the swipe strong (about 90%) so yellow still reads as a highlighter, and set `--on-swipe` to a dark ink such as the sheet colour.
- The swipe must also show against the sheet. If it doesn't, raise `--swipe-strength` or pick a more saturated `--live`.
- `--ok` and `--fault` are used as text and fills: at least 4.5:1 against `--bg`.
- `--muted` about 5:1. `--faint` (derived) must reach 3:1: it carries scale numbers. If it's too weak, override it: `--faint: color-mix(in srgb, var(--fg) 60%, var(--bg));`.

## Make a theme

1. Pick `--bg` (sheet) and `--fg` (ink) with a contrast of at least 11:1.
2. Pick `--live`, a highlighter hue that `--ok` and `--fault` don't already use: yellow, cyan, pink or orange. Set `--swipe-strength` and check ink on the swipe (above).
3. Set `--ok` and `--fault` with at least 4.5:1 against `--bg`, clearly apart from the highlighter.
4. Set `--muted` and `--title`, then check `--faint`.
5. Set `--shade` to the desk tone: a grey-green or warm grey for light sheets, black for dark ones.

Example "blueprint" theme (white ink on a blue sheet):
```css
[data-theme="blueprint"] {
  --bg: #0f2c4a; --fg: #e8f1fb; --live: #ffd166; --swipe-strength: 90%; --on-swipe: #0f2c4a;
  --ok: #9be3b4; --fault: #ff8a7a; --muted: #9db4cc; --title: #ffffff; --shade: #031426;
  color-scheme: dark;
}
```

## Scoped themes
Derived tokens are declared on `:root`, on every `[data-theme]` element and on `.cal-theme`. So one section can carry its own theme, and its edges, faints, wells and swipe recompute from its own seeds:

```html
<section data-theme="film">…</section>                         <!-- a film panel in a night page -->
<section data-theme="night">…</section>                        <!-- a night panel in a film page -->
<section class="cal-theme" style="--bg:#0f2c4a;--fg:#e8f1fb;--live:#ffd166;--swipe-strength:90%;--on-swipe:#0f2c4a">…</section>
```
A themed section paints its own `--bg` and `--fg`.
