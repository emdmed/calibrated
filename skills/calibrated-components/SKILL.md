---
name: calibrated-components
description: Pure CSS and vanilla JS (custom elements, no build, no framework) UI components in the Calibrated technical-drawing style: quiet panels on a darker desk, hairlines, monospace type and an amber lamp for the one live thing. Pure CSS covers cards with an info column and before/after stages, ruled section heads, separators (rules in drafting line types: solid, dashed, centre, break, labelled, a lamp "new since" line; fact lists and vertical rules) and containers (labelled zones, grouping brackets), boxed counts, counted tabs, bracketed buttons, parts-list tables, key/value sheets, rows, a sign-off tally (keep/rework/drop), a revision table and triangle, a stamp, and an optional zone-framed drawing sheet and title block. Form controls: inputs, textarea (editor pane), select, radio, checkbox, switch, detent choice, range on a ruler, number with units, search, tag input, file drop, date/time, field groups. Overlays and feedback: menu, dialog, tooltip, callout, toast, empty state, spinners. Navigation: breadcrumb, pager, steps; plus status badges, code blocks and key caps. Custom elements cover instruments that draw quantities: <cal-meter>, <cal-position>, <cal-progress>, <cal-diff>, <cal-durations>, <cal-ruler>, with full and compact density, and the <cal-spin> spinner and <cal-elapsed> clock. Use when building dashboards, forms, dialogs, settings, status pages or review boards in the Calibrated style, or when asked for reusable calibrated components that drop into any stack.
---

# Calibrated · components

UI parts that apply the Calibrated language to every quantity: a count, a position, progress, a size, a duration, a threshold. The page is a run of quiet panels on a desk, with numbered sections and drawings; a framed drawing sheet with zones and a title block is there when a page wants it. Change one shared part and every screen that uses it picks up the style, with no layout changes.

**Requires** calibrated-tokens (`calibrated.css`). The custom elements also need calibrated-figures (`calibrated-figures.js`). Copy the assets into the project. Don't edit them in the skill folder.

## Files
- `assets/calibrated-components.css`: every `cal-*` class. Load it after `calibrated.css`.
- `assets/calibrated-components.js`: the custom elements, the wiring for the controls that need a hand (textarea status line, detent, range, number, tag input, file drop, dialog openers, menus), plus `Calibrated.redraw()`, `counts()`, `sheets()`, `controls()`, `toast()` and `pager()`. Load it after `calibrated-figures.js`.
- `references/ux-rules.md`: how to compose a page people can use: order of work, when to draw and when not to, actions, forms, words, colour meaning, and the check before you deliver. **Read it first.**
- `references/catalog.md`: markup, attributes and variants for every part. Read it before you write markup.
- calibrated-tokens `references/looks.md`: the six settings that change per page (palette, headline face, frame, layout, space, weight). The parts below work with every setting.

```html
<link rel="stylesheet" href="css/calibrated.css">
<link rel="stylesheet" href="css/calibrated-components.css">
<script src="js/calibrated-figures.js" defer></script>
<script src="js/calibrated-components.js" defer></script>
```

## Start from the usual pattern
Lay the screen out the way people expect (a form, a settings page, a table with filters, a report with the summary first), with one boxed `.cal-btn.primary` for the main action. Then swap in the parts below where they explain a quantity faster than text. On app screens, forms and dialogs, put `data-mode="app"` on the screen: it drops sheet numbers and sets section and table heads in sentence case. See `references/ux-rules.md`.

## Pick the part by the quantity

| the UI shows… | use | but not when… |
|---|---|---|
| a loose number ("3 regions", "2 running") | `.cal-count` boxed + noun | it's a plain fact in a sentence |
| "46.0k / 1.0M" against a limit | `<cal-meter>` | there's no limit to measure against |
| "3/7", "12/140" while stepping through a set | `<cal-position>` | the reader needs the items' names: use a list or `.cal-steps` |
| "11/15 steps", a step list, a pipeline | `<cal-progress>` | each step needs its own label: use `.cal-steps` |
| "+184 −20" | `<cal-diff>` | |
| several "4m 12s" in a list | `<cal-durations>` with `<cal-span>` | |
| a bare scale or slider readout | `<cal-ruler>` | the values have names (plans, tiers): label every mark, or use a table |
| a feature, finding or change to review | `.cal-card` with `.cal-compare` and `.cal-sign` | |
| a roll-up of items with status, or values people compare or copy | `.cal-table` | |
| what this page is, its number, version, date | the mast, or an optional `.cal-titleblock` | it's an app screen: use the mast only |
| what changed since the last version | `.cal-revs` + `.cal-rev` triangles | it's an app screen |
| a structure, process or comparison | a figure from **calibrated-figures** inside `.cal-figure` | the figure would hold fewer facts than the sentence |

## Pick the control by the task

| the user… | use |
|---|---|
| types a line / a paragraph | `.cal-input` / `.cal-term` + `.cal-textarea` (editor pane with a status line) |
| picks one of many / one of a few ordered values / one of a few others | `.cal-select` / `.cal-detent` / `.cal-radio` |
| turns a setting on or off / ticks items | `.cal-switch` / `.cal-check` |
| sets an amount on a scale / types a number with a unit | `.cal-range` / `.cal-num` + `.cal-affix` |
| filters a list / adds several names / uploads files / picks a date | `.cal-search` / `.cal-chips` / `.cal-drop` / `.cal-date` |
| acts on one item / confirms something destructive | `.cal-menu` popover / `.cal-dialog` |
| needs a value explained in place / a standing note or warning | `[data-tip]` / `.cal-callout` |
| hears that something finished / waits for it | `Calibrated.toast()` / `<cal-spin>`, `.cal-wait`, `.cal-readout` with `<cal-elapsed>` |
| has nothing here yet | `.cal-empty` |
| moves through pages / steps / a hierarchy | `Calibrated.pager()` / `.cal-steps` / `.cal-crumbs` |
| reads a status / copies a command / a shortcut | `.cal-badge` / `.cal-code` / `.cal-kbd` |

## Density
Put `data-density="full"` or `"compact"` on any ancestor, or `density` on the element.
- **Full** prints the scale, boxes the value and adds leaders.
- **Compact** keeps the marks only. The value moves to the tooltip/`aria-label`. Counts drop their noun.

## Weight
Put `data-weight="soft"` (default) or `"strong"` on any ancestor, or `weight` on the element.
- **Soft** draws hairline instruments: 1px scales, 4px bars, boxed readings.
- **Strong** draws the same geometry heavier, for operations and wall screens: 3px scales with mitred ends, solid 10–12px bars, readings on nameplates and inverted chips, hazard stripes past an alert, a fader cap for `<cal-position>`, segmented cells for `<cal-progress>`, and a solid lamp bar for a running `<cal-span>`. The CSS parts that carry state or values follow the same attribute: plated buttons and tabs, counter-window counts, pilot-light badges and dots, table statuses, stamps, heads, the tally and the form controls (catalog, *Strong weight*). Panels, gaps and hairline separators stay soft.

Instruments redraw by themselves when an attribute, density or weight changes. They also redraw once fonts load.

## Motion
Every instrument moves, with nothing to set up. When it is half in view it sweeps to its value. When an attribute changes it glides from where it is (220–700ms, ease-out; `<cal-progress>` steps at 50ms a node). The reading blinks twice when it settles. The `aria-label` always states the final value, never a frame.
- To update a value, set the attribute (`el.setAttribute('value', v)`). Don't replace the element, or it sweeps in from zero again.
- Add `still` to an instrument to draw it at once: in print, in a long table of instruments, or wherever motion would distract. `prefers-reduced-motion` does the same for the whole page.
- A live `<cal-span>` ticks once a second without gliding.
- Headless Chromium freezes the animation clock, so screenshots catch the first frame. Take them with `--force-prefers-reduced-motion` to see the settled drawing.

## Rules
- One lamp per view. Use `data-ink="live"` on at most one count or status at a time. The lamp is text, a line, an outline or a star (`.star`), never a fill.
- Status words use `data-ink="live|ok|fault"` (on `.cal-count`, `.cal-table .st`, and `ok|fault` on pressed `.cal-btn`). Never colour plain text for decoration.
- Counts that change live are zero-padded (`data-pad="2"`), so the layout doesn't jump. Other counts (tabs, totals) are not.
- Buttons come in tiers: `.primary` is filled with ink, for the one main action in a view, with a verb label ("Send for approval"). The default `.cal-btn` is a hairline box for every other action. `.inline` is a bracketed word, `[copy]`, for small actions in text. `.quiet` is underlined, for cancel, back and navigation. Pressed toggles turn ink (or ok/fault).
- Hierarchy reads in four steps: the headline, section heads (16px medium), block heads (`.cal-block-h`, 12px medium caps in ink), then labels and scales (11px). Inside a panel, give each group (instruments, a figure, a table, notes) a `.cal-block` with a head, so the groups are ruled apart. To split text or ideas inside a group, use `.cal-rule` (its line type says what kind of split it is), `.cal-zone` for a named group with an edge, and `.cal-bracket` for a few lines that belong together; see the table in the catalog.
- Field labels, helper text and errors are sentence case. Caps are for section heads, tags, table heads and buttons. Anything people click or fill in is at least 12px (`--fs-control`).
- Drafting terms (FIG, SHEET, REV, DETAIL, title block, stamp) belong on document pages. Leave them off app screens and forms.
- Red means wrong or removed, green means passed or approved: an approval stamp is `<span class="cal-stamp" data-ink="ok">`.
- A chosen row or option is boxed in ink (its `.v` label), never tinted or barred; hover moves the box. Focus is the lamp: a lamp underline on write-in lines, a lamp outline elsewhere.
- Native elements first: `<select>`, `<dialog>`, `popover`, `<details>`, radios and checkboxes stay real, so the controls work without JS and from a file.
- Panels, not frames: surfaces separate by tone and gaps (or by a top rule with `data-frame="paper"`), lines are hairlines (`--edge`, `--edge-strong`). No shadows, no radius, no gradients.
- A card's `.id` line (number badge, where, status) opens its info column when the page has numbered items. Not every section needs a card: use `.cal-figure` full width, or `.cal-grid` for figures and panels side by side.
- Every instrument draws an `<svg role="img">` with a sentence label. Add `label="…"` attributes so the sentence names the thing.

## Minimal example
```html
<div class="wrap" data-density="full">
  <section class="cal-sec">
    <div class="cal-sec-h"><b>1 · Deploys</b><span>last 24 hours</span><span>sheet 1/2</span></div>
    <div class="cal-panel" style="padding:16px 18px;display:grid;gap:14px">
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
