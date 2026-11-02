---
target: reference page · groups 5 Overlays + 6 Navigation + 7 Theming
total_score: 75
max_score: 116
na_heuristics: "group 6 #9 Error recovery"
p0_count: 0
p1_count: 9
target_identity: "file:/home/enrique/projects/calibrated/demo/reference.html"
target_fingerprint: "sha256:170b9641a4caf06fab7b96cda9bc42142c7c81966fb8856dc63b11b69b995c64"
target_path: /home/enrique/projects/calibrated/demo/reference.html
timestamp: 2026-11-02T19-37-38Z
slug: demo-reference-html
---
Method: dual-agent per group (A: design review · B: detector + browser evidence), isolated subagents.

Scope: reference page groups 5 (Overlays and feedback, 27/40), 6 (Navigation and labels, 25/36, one n/a) and 7 (Theming, 23/40) only; groups 1–2 are in 2026-11-02T19-06-57Z, groups 3–4 in 2026-11-02T19-22-20Z. Full reports: .impeccable/review/reference/group-5-overlays.md, group-6-navigation.md and group-7-theming.md (gitignored).

Questions skipped: unattended plan run; findings go to the approval gate in chunk 5.

# Group 5 · Overlays and feedback (`#overlays`, demo/reference.html:649–752)

Review of the 8 entries: menu, dialog, tooltip and notes, separators, zones and brackets, detail callout, toast and
empty state, spinners (incl. `<cal-spin>`). CSS in `skills/calibrated-components/assets/calibrated-components.css`,
behaviour in `calibrated-components.js` (menu keys, toast, `<cal-spin>`). Read-only: no source file was changed.
Raw assessments: `<scratchpad>/raw/A5-overlays.md`, `raw/B5-overlays.md`; evidence in `<scratchpad>/A5/`, `B5/`
(session scratchpad, not kept): keyboard logs, contrast.json / fc.json, forced-colours / seed / 390 / open-dialog /
open-toast / reduced-motion screenshots, edge pages (long labels and heads, 60-character tips), each code tab pasted
into a kit-only page with and without JS, the live detector JSON.

Checked: desktop 1440 and mobile 390 (touch), film and night, dark / saturated blue / saturated pink seeds, forced
colours (light and dark system palettes × film and night), reduced motion, real keyboard walks (dialog trap, Esc and
focus return; menu keys; tooltip focus and Esc; toast undo by Tab), hover persistence (WCAG 1.4.13), touch taps, the
a11y tree, no-JS, console.

Short paths: `cc.js` = `skills/calibrated-components/assets/calibrated-components.js`,
`cc.css` = `skills/calibrated-components/assets/calibrated-components.css`,
`tok.css` = `skills/calibrated-tokens/assets/calibrated.css`, `ref` = `demo/reference.html`,
`cat` = `skills/calibrated-components/references/catalog.md`.

## Verdicts

| Component | Verdict | Reason |
|---|---|---|
| Menu (`#menus`) | polish | On-language (parts-list numbers, boxed value on hover, fault item below a rule); native popover opens, wraps and returns focus. Claims `role=menu` with half the pattern (no Home/End, no ArrowDown to open, Tab walks items with the menu open); the `r/d/l/⌫` key caps do nothing; every item looks boxed in forced colours. |
| Dialog (`#dialog`) | keep | Native modal: labelled, `cancel` focused first, Tab cycles inside, Esc closes, focus returns to the opener, backdrop click doesn't dismiss a destructive confirm. Gaps are P2/P3: edge vs backdrop under 3:1, no scroll lock, no description. |
| Tooltip and notes (`#tooltip`) | **rework** | Leader-to-box is the right mark, but the CSS-only tip fails WCAG 1.4.13 (no Esc, not hoverable), never shows on a touch tap, runs off screen at 390, loses its leader in forced colours, and is read inline in caps. The callout itself is fine. |
| Separators (`#separators`) | **rework** | New in 7a5d651. The line types read as drafting, but every line (solid, dashed, centre, break, labelled, lamp, `.cal-meta` ticks, `.cal-vr`) vanishes in forced colours, and labelled rules with `role="separator"` lose their text for AT, so the page's one lamp fact "new since 09:00" is silent. Centre line and `.cal-vr` are documented but not shown. |
| Zones and brackets (`#zones`) | keep | New in 7a5d651. Border-drawn, so every edge, dash and tick holds in all four forced-colour combos; contrast passes in film and night (fault edge 3.46 / 3.77). Long heads overflow (P2), zones have no accessible name (P3). |
| Detail callout (`#details`) | keep | Native `<details>`, keyboard, expanded state, lamp focus outline, reduced-motion gate, 390 all pass. P3 only (`[show]/[hide]` in the name, balloon fill in forced colours). |
| Toast and empty state (`#toast`) | **rework** (toast) · polish (empty) | The toast removes itself after 5 s while hovered or focused and while offering `undo`; keyboard users can't reach undo (Tab goes to the next page control) and focus drops to `<body>` when it goes. The live region is created with the first toast; "hide" is named "Dismiss". The empty state's full-panel hatch says "closed" in this language. |
| Spinners (`#spinners`, `<cal-spin>`) | polish | Drawn from the loop and measured figures, named `role=status`, one lamp each, reduced motion holds still. In forced colours the measured bar's run and lamp edge vanish ("3 of 8" = empty frame); under reduced motion the indeterminate bar freezes as a 30 % fill; the `aria-disabled` busy button looks enabled; the catalog hides the determinate value. |

## Agreement between A and B

- Both independently found: separators lose every line in forced colours (all four combos); labelled
  `role="separator"` rules have an empty name; the tooltip fails 1.4.13 (Esc, hover), doesn't show on a touch tap,
  overflows at 390 and loses its leader in forced colours; the toast's 5 s timer ignores hover and focus while
  offering undo; "hide" vs "Dismiss"; toast flush to the left edge at 390; the menu lacks Home/End, ArrowDown-to-open
  and close-on-Tab, and its key caps are dead; the measured bar empties in forced colours; the indeterminate bar
  freezes as 30 % under reduced motion; the catalog marks `.det` `aria-hidden`; dialog has no scroll lock; the empty
  hatch contradicts "hatch = closed"; `[show]/[hide]` in the details name; the separators example omits the centre line
  and `.cal-vr`; zones are unnamed; `--muted` on `--raised` is 4.38:1 in film. Dialog passes every keyboard check. High
  confidence.
- **Severity, resolved:**
  - Labelled separator name: A P1, B P2 → **P1.** The documented pattern (`cat:156–169`) ships a silent separator, and on
    the page it silences the one lamp fact; the fix is one attribute.
  - Tooltip 1.4.13: A P1, B P2 → **P1** (WCAG AA failure in the kit's only tooltip, no workaround for keyboard users).
  - Spinners in forced colours: A P2, B P1 → **P1.** The determinate bar is a quantity, and it reads as an empty frame;
    this matches the range / meter forced-colour P1s in groups 1 and 4.
  - "hide" vs "Dismiss": A P3, B P2 → **P2** (2.5.3 Label in Name, level A).
  - Toast flush left at 390: A P2, B P3 → **P3** (no content clipped; message wraps).
  - Catalog `.det aria-hidden`: A P2, B P3 → **P2.** The catalog teaches hiding a known amount, against "state the
    quantity in text".
  - Separators example gaps: A P2, B P3 → **P3** (docs completeness).
  - B's cross-cutting "kit forced-colours block" P1 is the root of the separator, tooltip, spinner, steps (group 6) and
    form (group 4) findings; it is one fix location (`cc.css:501`), counted under each component here, not twice.
- **A only:** every menu item looks boxed in forced colours (transparent `.v` border forced visible); long labelled
  rules and long zone heads overflow (`nowrap`); `▼` in the opener's name; kit focus on `[data-tip]` is colour-only; the
  `aria-disabled` busy button looks and acts enabled; determinate ticks are tenths while the value is eighths; `esc`
  cap is a legend only; `<cal-spin size="sm">` not shown; zones example lacks `live/ok` inks and a headless zone.
- **B only:** dialog edge vs backdrop 2.02:1 film / 1.19:1 night; no `aria-describedby` on the dialog; no-JS dialog
  opener dead (native `commandfor` would work); the toast live region is created on demand (first message often
  missed); plain rule `--edge` 1.30:1 and dashed / break 1.82:1 (the jag is the only "skipped" cue); bracket head reads
  "before you deploy3 checks"; `<cal-spin>` renders nothing without JS and its arc is 1.3–1.5:1 when the system palette
  is opposite the page; `aria-haspopup` missing; the focused menu value takes `--title` (1.13:1 on the dark seed).
- **Detector:** static flags — `repeating-stripes-gradient` on `hr.cal-rule` is the dashed line type (false positive);
  on `.cal-empty` it is judged below (P3); on the callout glyph it is the fault hatch (a mark, intended). The 12.5 px
  inline size (`ref:695`, `:699`, `:701`) is `--fs-small` hard-coded (P3). Live run (film/night × 1440/390): film only,
  3 group findings — lamp rule 4.2:1 (shared `--live`) and two `.cal-gl` labels 4.4:1 (`--muted` on `--raised`, below);
  night 0. No console errors.

## Findings

### Cross-cutting

- **[P1] The kit's forced-colours block covers the switch only; everything drawn with `background` or a gradient
  vanishes.** In this group: every `.cal-rule` line, `.cal-meta` ticks, `.cal-vr`, the tooltip leader, the `.cal-scan`
  run and lamp edge, the `.cal-wait` star, the callout's fault hatch glyph, the empty-state hatch (fc.json; fc/*.png).
  One block, extended per component below (same block groups 3, 4 and 6 extend). `cc.css:501`
- **[P2] New shared (token): `--muted` on `--raised` is 4.38:1 in film.** `--muted` passes on `--panel` (4.88) but not on
  raised surfaces: menu key caps, toast `[undo]/[hide]`, the detail inset label `.cal-gl` (also a live-detector hit at
  4.4:1). Darken film `--muted` slightly (≈ `#5d6461`) or use `--key` on raised surfaces. `tok.css:14`
- **[P1] shared (token): seeds don't re-derive `--muted/--fault/--title`.** Dark seed: muted text 3.27, fault 2.78–3.18
  (menu delete item, callout, zone head, fault button), the focused menu value (`--title`) 1.13:1 (`cc.css:658`), and the
  "actions" primary opener fill 1.25:1 against the panel, invisible on hover (`cc.css:309`, seed-dark-menus.png).
- **[P3] shared (token):** `--faint` text (menu `.n` 2.32 / 3.10, tooltip underline 2.59, `<cal-spin>` centre line); film
  `--live` text 4.19:1 (lamp rule label); `--edge-strong` marks 1.82 film / 2.35 night (menu, zone and bracket edges,
  balloon and leader, empty dashed edge, toast border, `.cal-scan` frame, `.cal-wait` nodes); no forced-colours rule for
  `.star` / `.cal-dot` (toast `ink:'live'`). `tok.css:77`, `tok.css:192`
- **[P2] shared (docs shell):** `.ex-prev` has no font reset (preview text in Inter, `ref:91`); `.docs :focus-visible`
  (`ref:33`) masks the kit's own colour-only focus on `[data-tip]` and `.cal-details`; tooltip, zones, toast and
  spinner code tabs rely on `.row` / `.stack` (`ref:681`, `ref:712`, `ref:734`, `ref:743`).
- **shared (group 4):** without calibrated-figures.js, cc.js throws, so `<cal-spin>` doesn't render and
  `Calibrated.toast` is undefined (`cc.js:29`).
- PASS — no console errors; every code tab pasted into a kit-only page runs; no overflow at 390 except the tooltip.

### Menu
- **[P2] Half the `role="menu"` pattern.** Home / End do nothing; ArrowDown on the closed opener doesn't open it; items
  stay in the tab order, so Tab walks them and then leaves with the menu still open. Add Home/End, roving
  `tabindex="-1"` with Tab = `hidePopover()`, open on ArrowDown/Up from the invoker — or drop `role=menu/menuitem` and
  document a disclosure list of buttons. `cc.js:629`
- **[P2] Key caps `r d l ⌫` are drawn as shortcuts and do nothing.** Wire single-key activation inside the open menu
  (with `aria-keyshortcuts`) or say in the catalog they are display only. `ref:659`, `cat:376`
- **[P2] Forced colours box every item.** The transparent `.v` border is forced to CanvasText, so hover and focus can't
  be told apart (fc-light-night-menus.png). In the kit block: `.cal-menu .it .v { border-color: Canvas }`,
  `.cal-menu .it:is(:hover, :focus-visible, .on) .v { border-color: Highlight }` (shared with `.cal-list` in group 4).
  `cc.css:501` (rule `cc.css:656`)
- **[P3] Opener reads "actions black down-pointing triangle"; no `aria-haspopup="menu"`.** Wrap `▼` in
  `aria-hidden` span. `ref:657`, `cat:369`
- PASS: Enter / Space open with focus on item 1; arrows wrap; Esc and picking close and return focus; `menu "Run
  actions"` with 4 items and a separator; anchored at 390; opens without JS; fault item 4.50 / 4.58.

### Dialog
- **[P2] The modal's edge is under 3:1 against the backdrop:** panel vs backdrop 2.02:1 film / 1.19:1 night,
  `--edge-strong` border 1.11 / 2.79 (dialog-night.png). Border the dialog in `--fg` (as the tooltip box) or deepen the
  film backdrop. `cc.css:508`
- **[P3] No scroll lock** (page scrolled 17646 → 18246 under the modal). `html:has(dialog.cal-dialog[open]:modal) {
  overflow: hidden }` with `scrollbar-gutter: stable`. `cc.css:508`
- **[P3] No `aria-describedby`** to the body text, so AT reads only the title. `ref:671`
- **[P3] No-JS opener is dead;** document `commandfor="x-del" command="show-modal"` as the script-free path, and that the
  `esc` cap is a legend (Esc is native). `cat:387`
- PASS: native modal, `aria-labelledby`, `autofocus` on cancel, Tab / Shift+Tab cycle cancel ↔ delete (plus the native
  browser-chrome stop), Esc closes, focus returns, `returnValue` = "delete", backdrop click doesn't dismiss, 358 px at
  390, forced-colours border kept.

### Tooltip and notes
- **[P1] Fails WCAG 1.4.13:** Esc leaves the tip at opacity 1, and `pointer-events: none` hides it as the pointer moves
  onto the box. Add a small `keydown` Escape hook (`[data-tip-off]` until blur / mouseleave) and let the box take
  hover with the leader bridging the gap. `cc.css:521` (hook beside `cc.js:617`)
- **[P2] Never shows on a touch tap** (`:focus` true, `:focus-visible` false). Reveal on `:focus` under `(hover:
  none)`. `cc.css:528`
- **[P2] Overflows at 390:** `white-space: nowrap`; a 60-character tip is 475 px, the second demo tip runs to x = 415 and
  scrolls the preview. `max-width: min(36ch, 100vw - 32px); white-space: normal`, or auto-flip. `cc.css:524`
- **[P2] AT reads the tip inline, in caps, even while hidden** ("212 ms p99 · 212 MS · 3 REGIONS …"); the focusable span
  has no role, name or description. Wire `aria-describedby` to a visually hidden node, and document that `data-tip`
  must not hold the only copy of a fact. `cat:390`
- **[P2] Forced colours drop the leader** (`::before` background), leaving a floating box. `background: CanvasText;
  forced-color-adjust: none` in the kit block, or a `border-left` leader. `cc.css:522`
- **[P3] Kit focus on `[data-tip]` is colour only** (`outline: none; color: var(--live)`, 4.19:1 film). Add an underline
  or 1 px lamp outline. `cc.css:530`
- **[P3] The callout's fault hatch glyph drops in forced colours** (border stays). `cc.css:569`
- PASS: box 12.78 / 12.24:1; shows on hover and keyboard focus; pinned `.show`; reduced motion removes the fade; callout
  NOTES fit at 390, fault legend 4.50 / 4.58.

### Separators
- **[P1] Every line vanishes in forced colours** (all four combos): solid, dashed, centre and break (`background` /
  gradients / mask), the lines either side of a labelled rule (`::before/::after`), `.cal-meta` ticks and `.cal-vr`.
  Only label words remain; "38 lines skipped" has no mark. Draw lines as `border-top` per `data-line`, or
  `forced-color-adjust: none` with `--rule: CanvasText` (Highlight for `data-ink="live"`). `cc.css:501` (rules
  `cc.css:135–173`)
- **[P1] Labelled rules lose their text for AT.** `role="separator"` has presentational children, so "or", "build log ·
  checkout v2.14.0" and "new since 09:00" are announced as a bare separator. Drop the role on labelled rules (keep it on
  bare `<hr>`), or add `aria-label` with the same text. `ref:696`, `ref:698`, `ref:702`; `cat:156–169`
- **[P2] The break jag is the only "skipped" cue and sits at 1.82:1** (dashed and break use `--edge-strong`; plain rule
  `--edge` 1.30:1 is decorative and exempt). Draw meaningful `data-line` rules in `--faint`/`--key`. `cc.css:141`
- **[P2] Long labels clip:** `white-space: nowrap`, a long label drops the trailing line (scrollWidth 567 in 296).
  Allow wrap with `text-wrap: balance`, or ellipsize. `cc.css:148`
- **[P3] Example omits the centre line, `.cal-vr`, `data-weight="strong"` and the fault / ok inks** the copy and Rev M
  name. `ref:690–706`
- **[P3] Inline `font-size: 12.5px` ×3 and `color: var(--muted)`** in the example; use `var(--fs-small)`. `ref:695`,
  `ref:699`, `ref:701`
- PASS: line types distinct and quiet in film, night and seeds; labels `--key` 5.10 / 6.68; notes 4.88 / 5.73; live rule
  is a lamp line plus a word (one lamp); break rule `aria-label="38 lines skipped"`; `.cal-meta` is a list and wraps
  without a leading tick at 390.

### Zones and brackets
- **[P2] Long zone head overflows:** `.cal-zone-h` is `nowrap` and only the note `<span>` ellipsizes; the head pushes
  `.end` and the closing tick out (scrollWidth 519 in 296). Ellipsize the name too, or allow wrap. `cc.css:184`
- **[P3] Zones have no accessible name** ("danger zone" isn't a group). `aria-labelledby` on the section or a heading
  in `.cal-zone-h`, in the catalog pattern. `ref:714`; `cat:178–186`
- **[P3] Bracket head reads "before you deploy3 checks"** (gap is margin only). `cc.css:210`
- **[P3] Example lacks `data-ink="live"`, `ok` and a headless zone.** `ref:712–719`
- PASS: forced colours keep every edge, dash and tick (all four combos); head 12.78 / 12.24, notes 4.88 / 5.73, `.end`
  5.10 / 6.68, fault head 5.02 / 5.29, fault edge 3.46 / 3.77; stacks at 390; no fill, sits on the panel in both themes.
  Dark seed: fault edge 2.67 (shared token).

### Detail callout
- **[P3] Name includes the generated `[show]/[hide]`** on top of the native expanded state. `content: "[show]" / ""`.
  `cc.css:768`
- **[P3] Open balloon loses its fill in forced colours** (state still readable from the words). `cc.css:772`
- Inset label `.cal-gl` 4.38:1 in film — the cross-cutting `--muted` on `--raised` P2.
- PASS: native `<details>`, Enter / Space toggle, expanded exposed, lamp focus outline, leader and inset drawn right,
  long summary wraps at 390, open animation gated on `no-preference`.

### Toast and empty state
- **[P1] Undo is out of reach.** The 5 s timer runs while the toast is hovered or focused (gone at 5.3–5.4 s); the toast
  is appended at the end of `<body>`, so the next Tab after "send a toast" goes to "start a run"; a focused `[undo]` is
  removed and focus drops to `<body>` (WCAG 2.1.1, 2.2.1, 2.4.3). Pause on `pointerenter`/`focusin`, resume on leave;
  default `timeout: 0` (or ≥ 10 s) when `action` is set; return focus to the previous element on removal. `cc.js:649–650`
- **[P2] The live region is created with the first toast,** so many screen readers miss the first message. Create
  `.cal-toasts[role=status]` at boot. `cc.js:640`
- **[P2] Visible "hide", name "Dismiss"** (2.5.3). Drop the `aria-label` or make it "hide notification". `cc.js:645`
- **[P3] At 390 the toast spans x = 0 → 380, flush with the left edge.** `left: 16px` and `min-width: min(300px, 100%)`
  under a narrow query. `cc.css:579` (min-width `cc.css:574`)
- **[P3] Empty state: the full-panel 45° hatch (`--edge`, 1.30:1, every 7 px) reads as texture and means "closed"**
  (DESIGN.md:235, marks.md) where an empty list is open; with the dashed frame and the inner box it is three layers.
  Keep the dashed blank area and drop the hatch (or reserve it for "no access" empties). `cc.css:584`
- **[P3] Empty `.ttl` isn't a heading;** `.cal-toast .msg` and `.cal-empty p` hard-code 12.5 px. `ref:736`; `cc.css:575`,
  `cc.css:587`
- Bracket glyphs in inline button names ("[ undo ]") — kit-wide, logged in group 3 (`cc.css:320`).
- PASS: one polite `role=status` region; message 11.47 / 10.6:1; ✓ glyph ≥ 3:1; `toast-in` off under reduce
  (`tok.css:204`); buttons 64×24; message escaped. Empty: title 12.78, copy 4.88 / 5.73, one way forward.

### Spinners (`<cal-spin>`, `.cal-scan`, `.cal-wait`)
- **[P1] Forced colours empty the measured bar.** `.cal-scan > i` and its lamp edge are backgrounds → Canvas, so `.det`
  "3 of 8 loaded" and the indeterminate bar are identical empty frames; the `.cal-wait` star vanishes; the `<cal-spin>`
  arc keeps theme ink and drops to 1.3–1.5:1 on the opposite system palette. In the kit block: `.cal-scan > i {
  background: CanvasText }`, lamp edge and `.cal-wait > i:first-child` `Highlight`, `forced-color-adjust: none`;
  `.cal-spin .tr { stroke: CanvasText }`, `.cal-spin .st rect { fill: Canvas; stroke: CanvasText }`. `cc.css:501` (rules
  `cc.css:810–829`)
- **[P2] Reduced motion freezes the indeterminate bar as a 30 % fill,** the same picture as a determinate bar beside it
  (spinners-reduced-film.png). Under reduce, draw the run full width hatched or as the lamp edge alone. `cc.css:834–838`
- **[P2] The `aria-disabled="true"` busy button looks and acts enabled** (full opacity, pointer, hover border). Add it to
  the `:disabled` rule and exclude it from hover. `cc.css:304`, `cc.css:306`; `ref:748`
- **[P2] The catalog marks the determinate bar `aria-hidden="true"`;** the reference (rightly) states "3 of 8 loaded".
  Use the reference markup (or `role="progressbar"` with values). `cat:421`
- **[P3] Determinate ticks are tenths while the value is eighths.** `ref:746`
- **[P3] `<cal-spin>` renders nothing without JS (0×0);** `size="sm"` and `label` aren't shown in the example.
  `cc.css:803`; `ref:744`
- PASS: `<cal-spin>` is `status "Loading"` (label respected), SVG `aria-hidden`; scan and wait rows `role=status` named;
  every animation stops under reduce and a static frame remains (`cc.css:834`, `tok.css:204`); one lamp per spinner;
  wraps at 390.

## Group level

**Design specificity: high.** A menu as a parts list, a tooltip as a leader to a boxed value, drafting line types,
zones and brackets from drawing sheets, a spinner from the loop figure: these are the language's own overlays. The
faults are robustness: forced colours (lines drawn as backgrounds), timing (toast), dismissal (tooltip) and AT names.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 3 | Frozen indeterminate bar reads as 30 %; forced colours empty the measured bar |
| 2 | Match real world | 3 | Drafting metaphors land; the empty-state hatch says "closed" |
| 3 | User control | 2 | Toast undo vanishes at 5 s; tooltip can't be dismissed |
| 4 | Consistency | 2 | `role=menu` without the pattern; labelled `role=separator`; "hide" vs "Dismiss"; catalog vs reference `.det` |
| 5 | Error prevention | 4 | Destructive dialog focuses cancel, red primary, no backdrop dismiss |
| 6 | Recognition vs recall | 3 | Shortcut caps drawn but not wired; labelled rules and zones named only visually |
| 7 | Flexibility | 2 | No Home/End, no single-key shortcuts |
| 8 | Minimalist design | 3 | Quiet and on-brand; the empty state's three layers |
| 9 | Error recovery | 2 | Undo unreachable by keyboard and under time pressure |
| 10 | Help and docs | 3 | Centre rule, `.cal-vr`, zone inks, `size=sm` not demoed; `.det` catalog mismatch |
| **Total** | | **27/40** | **Good (68%)** |

(A scored 28, B 26.)

**Cognitive load:** low. Each overlay has one job; the dialog's single safe default is a model.

**Strengths**
1. The dialog is complete: native modal, safe initial focus, Esc, focus return, no backdrop dismiss.
2. Zones and brackets are border-drawn and hold everywhere, including all forced-colour combos.
3. Reduced motion is handled kit-wide; every spinner keeps a static, meaningful frame (except the indeterminate bar).

**Persona red flags**
- **Sam (keyboard / screen reader):** can't reach toast undo; hears "separator" for "new since 09:00"; hears tooltips
  inline in caps; can't dismiss a tooltip; tabs out of an open menu.
- **Forced-colours user:** sees no separators, no tooltip leader, an empty "3 of 8" bar, every menu item boxed.
- **Casey (390 px, touch):** tooltips never appear on tap and overflow when forced; the toast hugs the left edge.

## Counts

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 5 |
| P2 | 17 |
| P3 | 18 |

P1s (component): tooltip 1.4.13, separators in forced colours, labelled separator names, toast undo / timing / focus,
spinners in forced colours (the forced-colours block, `cc.css:501`, is the shared root of three of them). New shared
token finding: `--muted` on `--raised` 4.38:1 in film (`tok.css:14`). Shared, counted once elsewhere: seed derivation
(`--title/--muted/--fault`), `--faint` / `--live` / `--edge-strong`, `.star`/`.cal-dot` forced colours, `.ex-prev` font,
`.docs :focus-visible`, `.row`/`.stack`, cc.js figures dependency, inline-button brackets.

# Group 6 · Navigation and labels (`#navigation`, demo/reference.html:753–778)

Review of the 6 components in `#pager` (breadcrumb, pager, steps) and `#badges` (badges, code blocks, key caps): CSS in
`skills/calibrated-components/assets/calibrated-components.css`, the pager in `pager()` of `calibrated-components.js`.
Read-only: no source file was changed.
Raw assessments: `<scratchpad>/raw/A6-navigation.md`, `raw/B6-navigation.md`; evidence in `<scratchpad>/A6/`, `B6/`
(session scratchpad, not kept): live detector JSON, contrast tables, forced-colours / seed / 390 screenshots, kit-only
pages for every code tab, an edge page (8 steps, page 99 of 12, 5-digit pages, long badge), keyboard scripts.

Checked: desktop 1440 and mobile 390, film and night, dark / saturated blue / saturated pink seeds, forced colours
(light and dark system palettes × film and night), reduced motion, a real Tab walk with Enter / Space through the
pager, the a11y tree, touch-target boxes at 390, no-JS, every code tab pasted into a kit-only page.

Short paths: `cc.js` = `skills/calibrated-components/assets/calibrated-components.js`,
`cc.css` = `skills/calibrated-components/assets/calibrated-components.css`,
`tok.css` = `skills/calibrated-tokens/assets/calibrated.css`, `ref` = `demo/reference.html`,
`cat` = `skills/calibrated-components/references/catalog.md`.

## Verdicts

| Component | Verdict | Reason |
|---|---|---|
| Breadcrumb | polish | Right shape (sheet path in legend caps, `nav` + `ol`, `aria-current`). Links aren't underlined although the item copy says "underlined means pressable", so links and the current crumb differ by colour only; "/" is read aloud. |
| Pager | **rework** | Focus drops to `<body>` after every page-number press, and at the ends it jumps to the opposite step so repeated Enter reverses direction. The current page vanishes in forced colours (every page gets boxed) and on a dark seed (`--title` 1.01:1); its `aria-label` on a span is ignored; 20 px targets; no init clamp; the code tab renders nothing. |
| Steps | **rework** | In forced colours done, current and todo collapse into identical empty squares and the connectors vanish. "Done" isn't exposed to AT. No wrap or scroll: 8 steps at 390 make a 449 px list in a 312 px box. |
| Badges | keep | The word carries the meaning in every theme; glyphs back it up. Only shared token issues and a `nowrap` overflow for very long text. |
| Code blocks | polish | Quiet well, prompt not copied, ligatures off. The demo `[copy]` is dead and defaults to `type=submit`, it covers line 1 on touch at 390, and comments are 4.34:1 on `--well` in film. |
| Key caps | keep | Semantic `<kbd>`, readable in both themes and all forced-colour combos. 10 px is off the ramp (P3). |

## Agreement between A and B

- Both independently found: pager focus falls to `<body>` after a page-number press (`cc.js:676`); every page is boxed
  in forced colours so the current one is lost; the steps lose all state in forced colours; the pager `.cur`
  `aria-label` is ignored on a span; page targets 20×20 px; the pager code tab renders an empty nav; "done" isn't
  exposed; steps clip at 390 with 5+ steps; crumbs not underlined against the item copy; "/" in the a11y tree; dead
  `[copy]` without `type`; copy button over line 1 at 390; `.cm` 4.34:1 on the well; "bracketed" in the docs vs boxed
  prev/next; `--title` on the dark seed hides the current page. High confidence.
- **Severity, resolved:**
  - Ends reverse direction (B P1; A logged the fallback as a PASS): **P1**, folded into the focus finding. B's log shows
    Enter on "next" at page 12 lands focus on "prev" (`cc.js:670`), so a keyboard user pressing Enter again walks back
    12→11→10. One fix covers both: always refocus the same control or the new `.cur`.
  - Breadcrumb "/" read aloud: A P2, B P3 → **P3** (noise, not a barrier; `content: "/" / ""`).
  - Prev/next boxed vs "bracketed" in the docs: A P2, B P3 → **P3** (docs/visual consistency; decide in chunk 5 whether
    to draw prev/next as `.cal-btn inline` or correct the copy).
- **A only:** dead helper `two()`; no `href` option for real links; lamp star for "current step" vs ink box for
  "current page" (two vocabularies, a second lamp on the page); step node fill `--panel` shows on wells; kbd and
  `.s` 10 px, code 12.5 px off the ramp; brackets in the inline button's name (kit-wide, logged in group 3); ✓ glyph vs
  look-alike dots in the badge example.
- **B only:** ends reverse direction (verified); no clamp at init (page 99 of 12 → no current page); disabled steps
  stay CanvasText in forced colours; long badge overflows (443 px in 348 px); `pre` scroller not focusable outside
  Chromium; crumb link targets 13 px tall.
- **Detector:** live run (film/night × 1440/390) found only `undersized-ui-text` ×4 on `.cal-steps .s` (10 px, a false
  positive under DESIGN.md:163's 10 px legend floor; the `--faint` colour is the real issue) and a docs-shell
  `text-overflow` on the item copy at 390 (`ref:759`, inline `<code>`). No console errors.

## Findings

### Cross-cutting

- **[P1] shared (token): `--title` isn't seed-derived; here it hides the current page.** Pager `.cur` text is 1.01:1 on
  the dark seed, 1.34:1 on the blue seed (empty box in `nav-film-dark.png`). Fix once in tokens; local stopgap
  `color: var(--fg)`. `tok.css:15`; `cc.css:788`
- **[P1] Forced colours: pager and steps lose "where you are"** (all four palette × theme combos). See Pager and Steps
  below; both fixes go in the kit block at `cc.css:501`.
- **[P2] shared (token): seeds don't re-derive `--muted/--ok/--fault`.** Crumb links, page numbers, todo labels, plain
  badge, kbd and comments drop to 3.27:1 (dark seed) / 2.41:1 (blue); ok/fault badges 3.21/3.18 (dark), 2.37/2.34
  (blue). `tok.css` seed block.
- **[P3] shared (token):** `--faint` text — crumb "/", pager "…", step numbers `.s` 2.59:1, code `$` prompt and
  `data-lang` 2.30:1 on the well (film); film `--live` text 4.19:1 on the current step label and the running badge;
  `--edge-strong` marks 1.82 film / 2.35 night on badge/kbd borders, open step squares, connectors, pager underline;
  no forced-colours rule for `.star` / `.cal-dot` (running star vanishes, failed dot = queued dot; words still carry
  the meaning, `tok.css:192`).
- **[P2] shared (docs shell):** code tabs use docs-only `.stack`/`.row` (`ref:760`, `ref:770`); pasted kit-only the
  badges touch. `.docs :focus-visible` (`ref:33`) paints every focus ring in this group.
- PASS — reduced motion: the only motion is the copy button's 0.12 s fade, removed under `reduce`.
- PASS — no overflow at 390 in the shipped examples; no console errors.

### Breadcrumb
- **[P2] Links aren't underlined, against the item copy ("Underlined means pressable", `ref:759`) and the base `a`
  rule (`tok.css:114`).** Links are `--muted`, the non-link current crumb is ink, so the one thing you can't press
  looks heaviest and links differ by colour only. Fix: drop `text-decoration: none`; keep the base hairline underline.
  `cc.css:592`
- **[P3] "/" separators are read aloud** (`text: /` in the tree; current reads "/v2.14.0"). `content: "/" / "";`
  `cc.css:591`
- **[P3] Link targets 13 px tall** (60×13, 53×13). Passes 2.5.8 via spacing today. `cc.css:592`
- PASS: `nav[aria-label=Breadcrumb] > ol`, `aria-current="page"` on a non-link; current crumb 12.78 / 12.24:1.

### Pager
- **[P1] Keyboard focus is lost or reversed.** A page-number press (Enter, Space, click) redraws through `innerHTML`
  with `refocus = null`, so focus drops to `<body>` (WCAG 2.4.3). At the ends the refocus selector hits a disabled
  step and falls back to the first enabled button, the opposite step: Enter on "next" at 12 moves focus to "prev", so
  the next Enter goes 12→11→10. Fix: give `.cur` `tabindex="-1"` and refocus it after a number press and when the
  wanted step is disabled (or keep the step focusable with `aria-disabled`). `cc.js:676`, `cc.js:670`
- **[P1] Forced colours: every page is boxed.** The transparent `.pg` border is forced to CanvasText, so the current
  page looks like the others (fc-*.png, all four combos). Fix: `.cal-pager .pg:not(.cur) { border-color: Canvas }`,
  `.cal-pager .cur { border-color: Highlight; forced-color-adjust: none }`. `cc.css:501` (rules at `cc.css:785–788`)
- **[P1] Current page invisible on a dark seed** (`--title`, cross-cutting). `cc.css:788`
- **[P2] The current page's name is ignored.** `aria-label="Page 3, current"` on a role-less `<span>` is prohibited, so
  the tree reads plain "3". Put the words in content (visually hidden "page … current") or render `.cur` as a button
  with `aria-current="page" aria-disabled="true"`. `cc.js:667`
- **[P2] Page targets 19.6×20 px with a 2 px gap** (two-digit pages 27×20), below 2.5.8's 24 px. `min-width: 24px;
  line-height: 22px`. `cc.css:785`
- **[P2] No clamp at init:** `pager(n, { page: 99, pages: 12 })` draws `1 … 12` with no current page and both steps
  enabled (edge-390.png). Clamp `p` after `N`. `cc.js:657`
- **[P2] Disabled steps stay CanvasText in forced colours.** `.cal-pager .cal-btn:disabled { color: GrayText;
  border-color: GrayText }`. `cc.css:501`
- **[P2] The code tab renders nothing pasted:** it's an empty `<nav>`; the `Calibrated.pager()` call lives in docs JS
  (`ref:1010`). Add the `<script>` line to the snippet. `ref:762`
- **[P3] Docs say "bracketed steps"** (`cat:432`, the `cc.js:654` comment `[‹ prev]`) but prev/next render as boxed
  `.cal-btn`, heavier than the boxed current page, against "boxed means where you are". Draw them `inline`, or fix the
  copy. `cc.js:665`, `cat:432`
- **[P3] Buttons only, no `href` option** for real multi-page navigation. `cc.js:656`
- **[P3] Dead helper `two = (k) => String(k)`** implies padding it doesn't do. `cc.js:658`
- **[P3] 4–5 digit pages at 390 orphan "next ›" on its own line** (m390-stress.png, edge-390.png). `cc.css:782`
- PASS: `<nav aria-label="Pages">`, real buttons, ellipsis `aria-hidden`, disabled ends leave the tab order, Tab order
  prev → pages → next, Space and Enter work; page numbers 4.88 / 5.73:1, current 15.81 / 14.06:1 (film / night).

### Steps
- **[P1] Forced colours erase every state.** `::before` fills (done = `--fg`, current = lamp star via `clip-path`) and
  `::after` connectors are backgrounds, forced to Canvas: done = todo (empty squares), the current star disappears,
  connectors vanish (fc-*.png). Fix: in the kit block, `forced-color-adjust: none` on `.cal-steps li::before/::after`
  with CanvasText fills and a Highlight star, or border-drawn connectors. `cc.css:501` (rules at `cc.css:627–634`)
- **[P2] "Done" isn't exposed:** "01 source" reads the same done or todo; only current has `aria-current="step"`. Add a
  visually hidden "done" to the markup pattern. `cat:436`, `ref:763`
- **[P2] No wrap or scroll:** equal `1fr` columns; 8 steps at 390 make a 449 px list in a 312 px box ("deploy" clipped,
  "announce" off screen), long labels stack one word per line (edge-390.png, m390-stress.png). `overflow-x: auto` with
  `grid-auto-columns: minmax(64px, 1fr)`, or a vertical fallback under a container query. `cc.css:625`
- **[P3] Current step is a lamp star; current page is an ink box.** Two vocabularies for "where you are", and a second
  lamp beside any running badge; a wizard step isn't a running thing. Consider an ink star. `cc.css:633–634`
- **[P3] Node fill `--panel` shows as panel squares on a well or the desk.** `cc.css:627`
- **[P3] `.s` 10 px off the ramp** (no 10 px token; within DESIGN.md's legend floor). `cc.css:635`
- PASS: shape (filled / star / open square) separates states in normal colours; 4 steps fit at 390 (78 px each).

### Badges
- **[P3] `white-space: nowrap` with no max:** "failed: quota exceeded…" is 443 px in a 348 px preview at 390.
  `max-width: 100%` with wrapping or ellipsis + `title`. `cc.css:597`
- **[P3] Mixed icon conventions in the example:** ✓ is a glyph in the name ("✓ shipped"); failed and queued use
  `.cal-dot`, identical in forced colours. Consider "✕ failed" as the toast does. `ref:771`, `cat:441`
- PASS: the status is a word in every badge; text ≥ 4.5:1 in night for all inks and ≥ 4.88 in film except live
  (shared); wraps cleanly at 390.

### Code blocks
- **[P2] Dead `[copy]` button with no `type`** (computed `submit`). Clicking copies nothing; `cat` says copying is the
  page's own, but the reference ships a dead control. Wire it in the docs (join `.ln`) and add `type="button"` to both
  snippets. `ref:772`, `cat:445`
- **[P2] At 390 / touch (`hover: none`) the always-visible button covers the comment line** ("min" hidden,
  m390-film.png). Reserve `padding-right` on `pre` when a button is present, or move it to the `data-lang` corner.
  `cc.css:793`
- **[P2] `--muted` on `--well` is 4.34:1 in film** for `.cm` and the hovered button (2.97:1 on the dark seed). Use
  `--fg` or `--key` in the well. `cc.css:796`
- **[P3] `pre` scroller has no `tabindex="0"`** (only Chromium makes scrollers focusable). `cc.css:793`
- **[P3] 12.5 px hard-coded where `--fs-small` exists; `data-lang` 10 px.** `cc.css:793`
- PASS: `$` prompt is `::before`, not copied; button appears on `:focus-within`; no page overflow at 390; line text
  11.36 / 12.68:1.

### Key caps
- **[P3] 10 px off the type ramp;** use `--fs-legend` (11 px) with a tighter line-height. `cc.css:416`
- PASS: `<kbd>`, 4.88 / 5.73:1, visible in all four forced-colour combos. Shared `--edge-strong` border only.

## Group level

**Design specificity: high.** A sheet path, a boxed current page and key caps belong to the drawing set. The faults
are in the pager's behaviour and in forced colours, not in the look.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 2 | Current page invisible on a dark seed and in forced colours; current step lost in forced colours |
| 2 | Match real world | 4 | Sheet path, pager, wizard and key caps read as expected |
| 3 | User control | 2 | Focus thrown to body after paging; repeated Enter at the end reverses direction |
| 4 | Consistency | 2 | Crumbs not underlined; "bracketed" steps are boxed; lamp vs box for "current" |
| 5 | Error prevention | 3 | No clamp on an out-of-range page; copy button defaults to submit |
| 6 | Recognition vs recall | 3 | Done steps not announced |
| 7 | Flexibility | 3 | Buttons only, no `href`; re-tab after every page press |
| 8 | Minimalist design | 4 | Quiet, on-language |
| 9 | Error recovery | n/a | Nothing in this group fails at run time |
| 10 | Help and docs | 2 | Pager code tab renders nothing; dead copy button; catalog says "bracketed" |
| **Total** | | **25/36** (n/a ×1) | **Good (69%)** |

(A scored 25/36, B 25/36.)

**Cognitive load:** low.

**Strengths**
1. Breadcrumb and pager use the right landmarks; disabled ends leave the tab order.
2. Badges state their status in words, so every forced-colour and seed failure still leaves the meaning.
3. The code block's prompt is drawn, not copied, and the copy button appears on keyboard focus.

**Persona red flags**
- **Sam (keyboard / screen reader):** loses focus on every page change; hears "3" for the current page; never hears
  which steps are done; hears "/" between crumbs.
- **Forced-colours user:** can't tell the current page or any step state.
- **Casey (390 px):** 20 px page targets; copy button over line 1; 6+ steps clip.

## Counts

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 3 |
| P2 | 11 |
| P3 | 14 |

P1s (distinct, component): pager focus loss / reversal, pager current page in forced colours, steps state in forced
colours. Shared, counted once elsewhere: `--title` seed derivation (P1, token, group 4), `--muted/--ok/--fault` seeds,
`--faint` text, film `--live` text, `--edge-strong`, `.star`/`.cal-dot` forced colours, `.row`/`.stack` code tabs,
`.docs :focus-visible`.

# Group 7 · Theming (`#theming`, demo/reference.html:779–814)

Review of `#seeds` (judged on how well the kit re-seeds through the page's own pickers) and `#density`, plus the two
detector findings filed under this group (wordmark lamp glow and scale). Read-only: no source file was changed.
Raw assessments: `<scratchpad>/raw/A7-theming.md`, `raw/B7-theming.md`; evidence in `<scratchpad>/A7/`, `B7/`
(session scratchpad, not kept): seeds.json / seeds2.json (token ratios and a page-wide scan of ≈490 preview text
elements per seed), dens.json, kit-only pages with each code tab pasted, theme-toggle-while-seeded and reset runs,
forced-colours, 390 and 4× wordmark screenshots, a replay of the detector's static rules.

Checked: the real `#s-bg/#s-fg/#s-live` pickers (`locator.fill`, which fires `input`) and `#seed-reset`, five seeds
(dark `#14181b/#e8e2d0/#f0b03c`, saturated blue `#1d2a6b/#ffe14d/#ff2fa0`, saturated pink `#f7d6e6/#0b3d2e/#e0004d`,
low contrast `#808080/#9a9a9a`, identical) × film and night, theme toggle while seeded, reload, keyboard, forced
colours (4 combos), reduced motion, 390 px, no-JS, live detector (film/night × 1440/390, plus index.html).

Short paths: `cc.js` = `skills/calibrated-components/assets/calibrated-components.js`,
`cc.css` = `skills/calibrated-components/assets/calibrated-components.css`,
`tok.css` = `skills/calibrated-tokens/assets/calibrated.css`, `ref` = `demo/reference.html`,
`thm` = `skills/calibrated-tokens/references/theming.md`, `tsk` = `skills/calibrated-tokens/SKILL.md`.

## Verdicts

| Component | Verdict | Reason |
|---|---|---|
| Seeds (`#seeds`) | **rework** | The derived layer re-seeds well: every `color-mix` token follows, figures and instruments repaint from vars (0 literal colours in any preview SVG) and keep their structure on saturated seeds. But the page promises "three colours" and four inks (`--title/--muted/--ok/--fault`) don't follow: with a dark seed failing preview text goes 145 → 293 elements, titles 1.0:1. The code tab's 3-seed `.cal-theme` pasted alone gives 1.10:1 titles. The demo pickers show film values in night, keep stale values after reset, and seeds outlive a theme switch (297 failing elements). |
| Density (`#density`) | polish | Full ↔ compact redraws all three instruments, accessible names are identical in both forms, the pasted code tab works, no overflow at 390. The control is a `tablist` without the tab pattern; its selected mark vanishes in forced colours; the "per element" snippet has no `density`. |
| Wordmark lamp tick + scale (`.word.ruled`, detector) | polish | Not rendered on reference.html (the header uses plain `.word`, `ref:177`); it ships on index.html and the artifact template. The scale is a real ruler, so codex-grid is a false positive. The tick's glow is a second blur DESIGN.md rules out; the tick misses graduation 7 by ~1.5 px; forced colours drop the ticks. All P3. |

## Agreement between A and B

- Both independently found: seeds don't re-derive `--title/--muted/--ok/--fault` (measured page-wide by B); the code
  tab's 3-seed `.cal-theme` (`ref:1005`) and `thm:73` give unreadable titles pasted alone, and the copy says "three
  colours" against `tsk:17`; pickers show film values in night and stay stale after reset; seeds survive a theme
  switch and mix inks; labels print `--Bg/--Fg/--Live` (`cc.css:391`); density is a tablist without tab behaviour;
  the selected tab vanishes in forced colours; the wordmark glow breaks "the star's glow is the only blur"
  (DESIGN.md:108); codex-grid is a false positive; no guard for low-contrast or identical seeds; compact copy is
  inaccurate about numbers. High confidence.
- **Severity / verdict, resolved:**
  - Seeds verdict: A polish, B rework → **rework.** The item is judged on re-seeding, and the documented three-seed
    contract fails for four inks page-wide. The token fix (chunk 6) and the copy + code tab fix (chunk 9) both belong to
    it; the demo pickers need their own fix.
  - "Three colours" copy: A P2 on its own, B folded into the P1 → **one P1** (copy + code tab + `thm:73`).
  - Wordmark forced colours and off-graduation tick: A P2 → **P3.** `.word.ruled` isn't on the reference page, the
    scale is ornamental beside the word (the name is still read), and the miss is ~1.5 px at 1×.
  - Density tab targets 30×20 / 53×20 (B P2) and the forced-colours selected tab: **shared with group 3** (tabs, same
    rules `cc.css:285`, `cc.css:287`), listed here once and not re-counted.
- **A only:** seeds leak into the docs header (`.cal-mark` at ≈1.3:1 on the white header); `thm` out of date (desk depth
  9% / 24% vs 14% / 42% in `tok.css`, `--key` missing, `--faint` still "keys"); density "per element" snippet lacks
  `density`; tick off graduation 7; no announcement on density change; seeds not persisted.
- **B only:** night pickers start from film ink, so committing the shown ink gives `--fg` 1.26:1 on the night panel;
  page-wide counts per seed (sat-blue 315, sat-pink 331 failing; night + light seed also fails `--key`); detector
  attribution corrected (below); no-JS instruments 0 px tall (shared, group 1).
- **Detector (corrected):** the live detector reports **0** dark-glow / codex-grid findings on reference.html and
  index.html in either theme; both are static-scan hits only (`detector.json:619`, `:639`). `detector-by-group.md` §7 is
  wrong twice: `.word.ruled` doesn't render in the reference header or sidebar, and the codex-grid rule matches the
  range track (`cc.css:735`, `cc.css:742`), not the wordmark scale (its `100% 7px` shorthand fails the rule's px-cell
  regex). Both matches are measurement scales, which the rule exempts.

## Findings

### Cross-cutting

- **[P1] shared (token): seeds don't re-derive `--title/--muted/--ok/--fault`** (nor `--shade/--desk-depth`). Film +
  dark seed through the real pickers: `--muted` 153/153 text elements < 4.5 (baseline 8), `--title` 9/9 (min 1.0),
  `--fault` 10/10 (min 2.78), `--ok` 3/3 (min 3.21); failing preview text 145 → 293 (sat-blue 315, sat-pink 331). Night +
  light seed: same, plus `--key` 24/24 (min 3.9). Already the chunk-6 token fix; this group is where it shows most.
  `tok.css:15` (supporting inks), `tok.css:47` (seed block)
- **[P3] shared (token):** `--faint` text 107/107 < 4.5 in every theme/seed; film `--live` text 4.19:1; picker/button
  borders `--edge-strong` 1.82:1; no forced-colours block for `svg[data-cal]` (progress box stays paper on black,
  fc-film-dark.png). `tok.css:192`
- **[P2] shared (docs shell):** `.docs :focus-visible` (`ref:33`) is the only focus ring on every theming control,
  2 px near-black, near-invisible on night or a dark seed.
- **shared (group 1):** no-JS instruments are 0 px tall; at 390 hosts scroll by design (`cc.js:69`).
- PASS — reduced motion: the density glide is skipped (`still`), `getAnimations()` 0.
- PASS — no console errors in any seed, theme or density run.

### Seeds
- **[P1] Copy and code tab promise a three-seed theme that isn't one.** `ref:785`: "Three colours; every surface, line
  and wash derives from them". `ref:1005` shows `.cal-theme { --bg; --fg; --live }` "to scope a theme to one region";
  pasted into a kit-only page it measures title 1.10:1, muted 2.95, ok 2.90, fault 2.87 (kit-seeds.png). `tsk:17` and
  DESIGN.md:99 name three seeds plus `--ok/--fault/--muted/--title/--shade/--desk-depth`; `thm:73` repeats the 3-seed
  snippet. Fix: once the tokens derive (chunk 6) the copy can stand; until then say "three seeds set the look;
  `--muted`, `--title`, `--ok` and `--fault` complete it" and show `data-theme="night"` or the full set for a region.
  `ref:785`, `ref:1005`, `thm:73`
- **[P2] Pickers don't reflect state.** Values are hard-coded film seeds (`ref:788–790`) and never synced: in night they
  show `#f4f2ec/#262b2e/#9c6a06` over a `#1b2225` panel; committing the shown ink sets `--fg` 1.26:1, the shown lamp
  3.44:1. After `#seed-reset` the tokens return (PASS) but all three inputs keep the seeded colour (10/10 runs). Fix:
  set each `input.value` from the computed seed on load, in `setTheme` and on reset. `ref:1063`, `ref:1064`
- **[P2] Seeds outlive a theme switch.** Seeds are inline on `<html>` and outrank both theme blocks while the supporting
  inks flip with `data-theme`: night + dark seed → film gives 297 failing elements (`--title #15191b` on `#14181b`).
  Clear the seeds (or keep them per theme) in `setTheme` and re-sync the pickers. `ref:1029`
- **[P2] Seeds leak into the docs header.** `rs = html.style` seeds all of `:root`, so the header `.cal-mark` (ink
  `--fg`) goes ≈1.3:1 on the white header with a dark seed (film-dark-header.png). Scope seeds to the previews or pin
  the brand mark to `--d-fg`. `ref:1062`, `ref:38`
- **[P2] Labels print `--Bg · panel`, `--Fg · ink`, `--Live · lamp`:** the kit's `label::first-letter { uppercase }`
  capitalises the case-sensitive property the item is teaching. `.seeds label::first-letter { text-transform: none }`
  or lead with the word ("panel · `--bg`"). `ref:123` (rule `cc.css:391`)
- **[P2] `thm` disagrees with the CSS:** `--desk-depth` listed 9% / 24% (`tok.css` 14% / 42%); the derived table has no
  `--key` and still gives `--faint` to "keys". `thm:15`, `thm:32`
- **[P3] Bad seeds are accepted silently:** low contrast gives fg/bg 1.14:1 (506 failing elements), identical seeds 1:1
  everywhere, with no readout. On-language fix: boxed `fg/bg 12.8:1` and `live/bg 4.2:1` readings beside the pickers,
  in fault ink under 4.5 / 3. `ref:791`
- **[P3] Seeds don't persist across reload** while the theme does; fine for a demo, worth one line of copy. `ref:1063`
- PASS: every `color-mix` token follows (`--panel/--gutter/--well/--raised/--edge/--edge-strong/--legend/--faint/--key/
  --glow/--swipe`); figures re-seed live; reset clears `html[style]` in both themes; night + dark seed composes (title
  15.6, muted 6.3, ok 10.9); inputs labelled via `<label for>`, Tab order bg → fg → live → reset, 26 px targets; no
  overflow at 390; swatches and reset render in all four forced-colour combos.

### Density
- **[P2] `role="tablist"` without the tab pattern:** no arrow keys, both tabs at `tabindex=0`, no `aria-controls`, no
  `tabpanel`. It switches a property of the same content, so use `aria-pressed` buttons or the detent / radio group,
  or finish the pattern. `ref:801` (JS `ref:1067`)
- **[P2] The "per element" snippet has no `density`:** `<cal-diff added="184" removed="20">` shows nothing about
  density. Add `density="compact"`. `ref:1006`
- **[P3] "Compact keeps only the marks" isn't quite true:** the meter keeps `46k / 1M`, progress and diff drop their
  numbers (which then live only in the accessible name). Say so, and that compact expects the number in a neighbouring
  cell. `ref:799`
- **[P3] No announcement on density change** (names don't change, so only sighted keyboard users get feedback). `ref:805`
- shared (group 3, `.cal-tabs`): selected tab invisible in forced colours (inset `box-shadow`) → add a
  `border-bottom: 1px solid Highlight` rule in the kit block `cc.css:501` (rule `cc.css:287`); tab targets 30×20 and
  53×20 px (`cc.css:285`).
- PASS: `[data-density]` MutationObserver redraws all three; names identical in both forms; compact keeps the marks
  (meter scale + value, progress fault square, diff bars); pasted code tab renders 3 compact + 1 full; 390 fits; Space
  and Enter activate.

### Wordmark lamp tick + scale (`.word.ruled`)
- **[P3] The tick's glow is a second blur:** `box-shadow: 0 0 5px var(--glow)` against DESIGN.md:108 ("the star's soft
  glow is the only blur"); on film it reads as a brown smudge. Drop the glow (colour alone says lamp) or name the
  exception in DESIGN.md. `tok.css:152`
- **[P3] The lamp tick misses graduation 7:** it sits at `70%` of the element (103.1 px of 148) while the scale spans
  `100% - .14em` (145.2 px), so 7 is at 101.6 px; at 4× a grey tick shows beside the lamp. `left: calc((100% - .14em) *
  .7 - .8px)`. `tok.css:151`
- **[P3] Forced colours drop the scale ticks** (background gradients) and paint the lamp as a notch in the baseline.
  `forced-color-adjust: none` with CanvasText ticks and a Highlight tick. `tok.css:150–160`
- PASS (detector false positive): codex-grid-background — the scale is a ruler (long ticks at 0/5/10), one of the
  eight marks; the rule's live match is the range track, also a ruler. No change; correct `detector-by-group.md` §7.

## Group level

**Design specificity: high.** Re-seeding from three colours is the language's strongest theming idea, and the derived
layer (surfaces, lines, washes, every figure) proves it. The gap is the four supporting inks, which the page and its
code tab present as derived when they aren't, and a demo whose pickers don't track the theme.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 2 | Pickers show film values in night and stale values after reset; no contrast readout |
| 2 | Match real world | 3 | Token names miscased (`--Bg`) |
| 3 | User control | 2 | Reset leaves pickers; seeds stick across a theme switch |
| 4 | Consistency | 2 | Tablist without tab keys; "three colours" vs ten seeds in SKILL.md |
| 5 | Error prevention | 1 | Identical / low-contrast seeds accepted; night pickers start at 1.26:1; 3-seed snippet yields 1.1:1 titles |
| 6 | Recognition vs recall | 3 | Labels name the token and its role |
| 7 | Flexibility | 3 | Per-element `density` and `[data-density]`; seeds not persisted |
| 8 | Minimalist design | 3 | Clean; wordmark glow and off-graduation tick |
| 9 | Error recovery | 2 | Nothing explains why inks fail after re-seeding; reset is partial |
| 10 | Help and docs | 2 | Copy overclaims; `theming.md` stale; code tab wrong |
| **Total** | | **23/40** | **Acceptable (58%)** |

(A scored 24, B 24; the merged score takes the lower of the two on 8 for the wordmark faults A found.)

**Cognitive load:** low. Three pickers and a two-way switch.

**Strengths**
1. Every derived surface, line and wash, and every figure, follows the seeds live with no literal colours.
2. Reset fully clears the inline seeds; night + a dark seed composes cleanly.
3. Density changes the drawing and never the accessible name.

**Persona red flags**
- **Theme author (pastes the code tab):** gets 1.1:1 headlines and 2.9:1 fault text.
- **Docs reader in night:** picks the ink they see and gets 1.26:1 text.
- **Forced-colours user:** can't tell which density is selected.
- **Keyboard user:** arrow keys do nothing on a control announced as tabs.

## Counts

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 1 |
| P2 | 7 |
| P3 | 7 |

P1 (component): the three-seed copy and code tab. Shared, counted once elsewhere: seed derivation of
`--title/--muted/--ok/--fault` (P1, token, groups 1–4; measured page-wide here), `--faint`/`--live`/`--edge-strong`,
`svg[data-cal]` forced colours, `.docs :focus-visible`, `.cal-tabs` forced colours and target size (group 3).

