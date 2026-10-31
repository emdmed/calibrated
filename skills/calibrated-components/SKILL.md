---
name: calibrated-components
description: Pure CSS and vanilla JS (custom elements, no build, no framework) UI components in the Calibrated technical-drawing style, where every page is an engineering drawing sheet. Pure CSS covers the zone-framed sheet, title block, revision table and triangle, stamp, cards with before/after stages, ruled section heads, boxed counts, counted tabs, ruled-cell buttons, parts-list tables, key/value sheets, rows, form fields and a sign-off tally. Custom elements cover instruments that draw quantities: <cal-meter>, <cal-position>, <cal-progress>, <cal-diff>, <cal-durations>, <cal-ruler>, with full and compact density. Use when building dashboards, dialogs, status pages, review boards or settings in the Calibrated style, or when asked for reusable calibrated components that drop into any stack.
---

# Calibrated · components

UI parts that apply the Calibrated language to every quantity: a count, a position, progress, a size, a duration, a threshold. The page itself is a drawing sheet with a frame, zones, a title block and revisions. Change one shared part and every screen that uses it picks up the style, with no layout changes.

**Requires** calibrated-tokens (`calibrated.css`). The custom elements also need calibrated-figures (`calibrated-figures.js`). Copy the assets into the project. Don't edit them in the skill folder.

## Files
- `assets/calibrated-components.css`: every `cal-*` class. Load it after `calibrated.css`.
- `assets/calibrated-components.js`: the custom elements, plus `Calibrated.redraw()`, `Calibrated.counts()` and `Calibrated.sheets()`. Load it after `calibrated-figures.js`.
- `references/catalog.md`: markup, attributes and variants for every part. Read it before you write markup.

```html
<link rel="stylesheet" href="css/calibrated.css">
<link rel="stylesheet" href="css/calibrated-components.css">
<script src="js/calibrated-figures.js" defer></script>
<script src="js/calibrated-components.js" defer></script>
```

## Pick the part by the quantity

| the UI shows… | use |
|---|---|
| a loose number ("3 regions", "2 running") | `.cal-count` boxed + noun |
| "46.0k / 1.0M" against a limit | `<cal-meter>` |
| "3/7", "12/140" while stepping through a set | `<cal-position>` |
| "11/15 steps", a step list, a pipeline | `<cal-progress>` |
| "+184 −20" | `<cal-diff>` |
| several "4m 12s" in a list | `<cal-durations>` with `<cal-span>` |
| a bare scale or slider readout | `<cal-ruler>` |
| a feature, finding or change to review | `.cal-card` with `.cal-compare` and `.cal-sign` |
| a roll-up of items with status | `.cal-table` |
| what this page is, its number, version, date | `.cal-titleblock` |
| what changed since the last version | `.cal-revs` + `.cal-rev` triangles |
| a structure, process or comparison | a figure from **calibrated-figures** inside `.cal-figure` |

## Density
Put `data-density="full"` or `"compact"` on any ancestor, or `density` on the element.
- **Full** prints the scale, boxes the value and adds leaders.
- **Compact** keeps the marks only. The value moves to the tooltip/`aria-label`. Counts drop their noun.

Instruments redraw by themselves when an attribute or density changes. They also redraw once fonts load.

## Rules
- One highlighter per view. Use `data-ink="live"` on at most one count, button or status at a time. Live is a swipe behind ink, never coloured text.
- Status words use `data-ink="live|ok|fault"` (on `.cal-count`, `.cal-btn`, `.cal-table .st`). A live table status needs an inner `<span>` for the swipe. Never colour plain text for decoration.
- Counts that change are zero-padded (`data-pad="2"`), so the layout doesn't jump.
- Buttons are ruled cells with a short word. Pressed fills with ink (or ok/fault). Use `.quiet` for a secondary, underlined action.
- Two line weights: `--line-thick` for frames and rules under heads, `--line-thin` for cells. No shadows, no radius, no gradients.
- Every instrument draws an `<svg role="img">` with a sentence label. Add `label="…"` attributes so the sentence names the thing.

## Minimal example
```html
<div class="cal-sheet" data-zones="8x6" data-density="full">
  <section class="cal-sec">
    <div class="cal-sec-h"><b>1 · Deploys</b><span>last 24 hours</span><span>sheet 1/2</span></div>
    <div class="cal-framed" style="padding:16px 18px;display:grid;gap:14px">
      <cal-meter value="612" max="1000" warn="800" label="error budget used" format="raw" unit=" min"></cal-meter>
      <cal-progress done="4" total="6" live="5" live-label="canary · ap-south"></cal-progress>
      <cal-durations max="15" unit="m">
        <cal-span name="build" value="252"></cal-span>
        <cal-span name="rollout" value="485" live></cal-span>   <!-- or start="<epoch ms>" to tick live -->
      </cal-durations>
      <span class="cal-count" data-n="1" data-noun="rolling" data-ink="live"></span>
    </div>
  </section>
</div>
```

## Related skills
calibrated-tokens (required) · calibrated-figures (required for the elements, and for custom figures) · calibrated-artifacts (everything inlined into one file for Claude artifacts).
