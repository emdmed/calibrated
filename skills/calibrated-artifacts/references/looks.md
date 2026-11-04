<!-- copied from skills/calibrated-tokens/references/looks.md by scripts/build-artifact-template.mjs -->
# Choosing the look

Calibrated is a drawing grammar, not one page. Two pages about different subjects should not look like the same page with new words. Before you build, choose the six settings below from the subject. Take the defaults only when nothing about the subject points elsewhere.

**Change at least two settings from the defaults**, unless the user asked for the default look or the page sits inside a product that already has its own. A palette taken from the subject counts as one.

## What never changes

The settings change the look. The grammar stays:

- The eight marks and what they mean. One scale per figure. Values boxed on leaders.
- A figure keeps every fact the text had. Measure, don't diagram.
- One live item per figure or working view, lit by the lamp as a line, a word, an outline or the star (at strong weight, a running bar is solid lamp).
- Red for faults, limits and revisions. Green for passed and approved. Never colour for decoration.
- Colours come from three base colours (`--bg`, `--fg`, `--live`) through `color-mix()`.
- Labels, legends, numbers, table heads, body text and every figure label are monospace (Chivo Mono and IBM Plex Mono).
- Hairlines for structure, square corners, no shadows, no gradients. Strong weight thickens the instruments and figures, never the panels, rules and frames.
- App screens and forms use the plain layout people expect (`data-mode="app"`).
- Contrast, the 10px floor for figure labels, `aria-label` sentences.

## 1 · Palette (from the subject)

Pick `--bg`, `--fg` and `--live` from what the page is about, for the light and the dark theme. Ask in this order:

1. **Does the subject have a brand?** Use its ink and accent. The brand accent usually becomes the lamp, if it isn't red or green.
2. **Does the subject have a material or a place?** Take the colours from it. A network map: blueprint (pale cyan ink on deep blue). A print or paper process: vellum (cool grey paper, graphite ink). A factory or hardware spec: machined steel (blue-grey panel, near-black ink, safety orange lamp). An ocean or shipping report: harbour (white ink on navy, cyan lamp). A lab or medical page: clean white with deep green-grey ink and a teal lamp. A night operations board: carbon (near-black, warm grey ink, amber lamp).
3. **Nothing points anywhere?** Use the defaults: film (paper, warm ink, amber) and night (slate, warm ink, gold).

Set them after the kit with this block, so the palette wins in every theme the viewer or the OS picks (a plain `:root { … }` loses to the dark theme):
```css
:root, :root[data-theme] { --bg: #eef3f7; --fg: #12324d; --live: #0a6f83; }                       /* light */
:root[data-theme="dark"], :root[data-theme="night"] { --bg: #0f2a44; --fg: #dbeaf5; --live: #5fd3e6; --desk-depth: 70%; color-scheme: dark; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) { --bg: #0f2a44; --fg: #dbeaf5; --live: #5fd3e6; --desk-depth: 70%; color-scheme: dark; }
}
```

Constraints:
- The lamp is never red or green, since those mean fault and pass. Amber, orange, cyan, teal, blue, violet and pink all work.
- `--fg` on `--bg` at least 11:1, and the lamp on `--bg` at least 4.5:1 (it's set as 11px text). See `theming.md`.
- Artifacts follow the viewer's light or dark setting, so give both themes seeds. A dark subject (blueprint, carbon) can use the same dark seeds for both.
- Avoid cream with an italic serif and terracotta. That's a different, overused look.
- One palette per page. A scoped section (`.cal-theme`) may differ when it shows something else, such as a terminal or a product screenshot.

## 2 · Headline face

Default: IBM Plex Mono in caps, the typewriter title. A headline face may replace it for **headings only**: the page headline, section names, card titles, the title-block name and the wordmark. Everything else stays monospace.

| face | character | fits |
|---|---|---|
| IBM Plex Mono (default) | typewriter caps | reviews, specs, anything that should feel typed |
| Barlow Condensed 500–600 | lettering template, road signs | engineering, infrastructure, field reports |
| IBM Plex Sans Condensed 500–600 | the default's sans sibling | product pages that need a calmer heading |
| Space Grotesk 500–600 | grotesk with odd details | technical explainers, research |
| Archivo 600 (width 112–125) | wide, mechanical | hardware, spec sheets, dashboards |
| Chivo 600–700 | sturdy grotesk, matches the legends | reports, status pages |

Set it after the kit, and add the font to the Google Fonts link:
```css
:root {
  --font-display: "Barlow Condensed", "Arial Narrow", sans-serif;
  --display-case: none;       /* or keep uppercase for a condensed face */
  --display-weight: 600;      /* mono titles stay 500 */
  --track-title: 0;
}
```
No serif or script heading faces, and never italic.

## 3 · Frame

| `<html>` setting | look | fits |
|---|---|---|
| (default) | panels on a darker desk, separated by gaps | reviews, reports with many items |
| `data-frame="paper"` | no desk; panels sit flush on the paper, each marked by a rule on top | explainers and long reading pages |
| `.cal-sheet` around the page | the bordered drawing sheet with zone markers and a title block | specs and anything with drawing numbers and approvals |

## 4 · Layout

Choose per section, from the content. Pages can mix them.

| layout | markup | fits |
|---|---|---|
| card with an info column | `.cal-card` (290px info + stage) | items to review, compare or sign off |
| full-width figure | `.cal-figure` with a `figcaption` | one wide drawing, a timeline, a section drawing |
| side by side | `.cal-grid` holding figures or panels (`--cal-grid-min` sets the column width) | status boards, comparisons of like things |
| one large drawing with notes | a `.cal-figure` and a `.cal-kv` or short notes beside it | spec sheets, a single object |
| instruments in a panel | `.cal-panel` with blocks | "now" summaries |

The `.id` number line on cards, `sheet n/m` in section heads and the header bar with the wordmark are optional. Use them when the page has several numbered items or is one sheet of a set.

## 5 · Space

| `<html>` setting | look | fits |
|---|---|---|
| (default) | dense: 14px gaps, sections close together | boards with many items, dashboards |
| `data-space="open"` | 28px gaps and wide section spacing | explainers, one big figure per screen, pages read once |

Open still means the first drawing is on the first screen, and each figure fills its stage.

## 6 · Weight

| setting | look | fits |
|---|---|---|
| (default) `data-weight="soft"` | hairline instruments: 1px scales, 4px bars, boxed readings | reviews, explainers, documents read up close |
| `data-weight="strong"` | heavy, industrial instruments and parts: 3px scales, solid 10–12px bars, nameplates and inverted chips for readings, hazard-striped alert zones, 600-weight legends; plated buttons and tabs, counter-window counts, pilot-light badges and dots, write-in slots and fader-style controls | operations, plant and field dashboards, wall screens, anything read from a distance or at a glance |

Set it on `<html>` for the page, or on one panel. `weight="strong"` on a single instrument overrides it. Strong keeps every instrument's geometry, attributes, motion and `aria-label`, and every part's markup and behaviour. It changes the parts that carry state or values: instruments, figure recipes, buttons, tabs, counts, badges, status dots, table statuses, stamps, section and block heads, the tally and the form controls (see the components catalog, *Strong weight*, and the figures' `recipes.md`, *Weight*). Panels, the desk, gaps and hairline separators stay as they are. At strong weight the running span in `<cal-durations>` and the running lane in the lanes recipe are solid lamp bars, the one place the lamp fills.

## Write it down

Before you build, note the six choices in one line in the page's `<style>` comment, e.g. `/* look: blueprint · Barlow Condensed · paper · full-width figures · open · strong */`. It makes the choice deliberate and easy to change.
