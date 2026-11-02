---
target: reference page · groups 3 Components + 4 Form controls
total_score: 51
max_score: 80
na_heuristics: none
p0_count: 0
p1_count: 12
target_identity: "file:/home/enrique/projects/calibrated/demo/reference.html"
target_fingerprint: "sha256:170b9641a4caf06fab7b96cda9bc42142c7c81966fb8856dc63b11b69b995c64"
target_path: /home/enrique/projects/calibrated/demo/reference.html
timestamp: 2026-11-02T19-22-20Z
slug: demo-reference-html
---
Method: dual-agent per group (A: design review · B: detector + browser evidence), isolated subagents.

Scope: reference page groups 3 (Components, 28/40) and 4 (Form controls, 23/40) only; groups 1–2 are in 2026-11-02T19-06-57Z, groups 5–7 follow. Full reports: .impeccable/review/reference/group-3-components.md and group-4-form-controls.md (gitignored).

# Group 3 · Components (`#components`, demo/reference.html:394–546)

Review of the 11 pure-CSS component entries in `skills/calibrated-components/assets/calibrated-components.css`
(+ the counts/controls helpers in `.js`), as shown on the reference page. Read-only: no source file was changed.
Raw assessments: `<scratchpad>/raw/A3-components.md`, `raw/B3-components.md`; evidence in `<scratchpad>/A3/`, `B3/`
(session scratchpad, not kept): edge-case pages (`A3/edge.html`, `B3/edge.html`, `B3/pasted.html` = every code
tab pasted as-is), screenshots per theme / 390 / forced colours / seeds, and the live detector JSON.

Checked: desktop 1440 and mobile 390, film and night, dark / saturated blue / saturated pink seeds, forced
colours (light and dark system palettes × film and night), reduced motion, a real Tab-key walk, hover / active /
pressed / disabled, the a11y tree, touch-target boxes at 390, no-JS, and every code tab pasted into a bare page.

Short paths: `cc.js` = `skills/calibrated-components/assets/calibrated-components.js`,
`cc.css` = `skills/calibrated-components/assets/calibrated-components.css`,
`tok.css` = `skills/calibrated-tokens/assets/calibrated.css`, `ref` = `demo/reference.html`,
`cat` = `skills/calibrated-components/references/catalog.md`, `tpl` = `scripts/artifact-template.src.html`.

## Verdicts

| Component | Verdict | Reason |
|---|---|---|
| Card + sign-off (`#card`) | **rework** | The strongest drawing-set piece, but sign-off (keep/drop/tally/copy) exists only in page scripts: the pasted code tab gives dead buttons, a "0 of 1 signed" tally and an empty `<svg>`. Copy fallback is a dead end; pressed state vanishes in forced colours; dropped text fades to 1.6–2.9:1; the page never shows its states. |
| Counts (`#counts`) | keep | Boxed number + noun, `role="img"`, good names ("3 regions"); holds at 0, 7 digits, long nouns, compact. Empty without JS (P2). |
| Tabs (`#tabs`) | **rework** | `role="tablist"/"tab"` with no behaviour: clicks and arrows change nothing, every tab is a Tab stop, no panels, `type=submit` default. Selected state is a box-shadow that forced colours erase; 20–22 px tall; many tabs overflow the page at 390. |
| Buttons (`#buttons`) | polish | Four tiers read clearly. Brackets enter the accessible name ("[ copy ]"), primary = default in forced colours, no `:active` feedback. |
| Marks in text (`#inline`) | polish | Words always carry the meaning. In forced colours every dot is the same hollow square, the live star and rev triangle vanish. |
| Form (`#form`) | polish | Write-in line suits the language and semantics are right (labels, describedby, `aria-invalid`). Checked box and focus lost in forced colours; long label squashes the checkbox; invalid+focus barely changes; copy says "caps labels". |
| Rows (`#rows`) | polish | The hover-moves-the-box hand-off is elegant. Selection is a class only (no `aria-current`/`aria-selected`), hover takes the box off the selected row, no keyboard path despite the docs claim. |
| Table (`#table`) | polish | Good parts list with named effort cells. "Compact form" claim is false (`cal-diff` renders full, 355 px); at 390 status is scrolled off with no cue; catalog snippet doubles the ✓. |
| Title block (`#titleblock`) | polish | Looks right in the demo, but the copied snippet's inline `--tb-cols` beats the kit's ≤700 px collapse, so values truncate on phones ("CH…", "20…"). Values ellipsize with no reveal. |
| Revisions (`#revisions`) | keep | Clean table semantics, letter 5.02/5.29:1. Two-character revs overflow the 22 px triangle; triangle vanishes in forced colours. |
| When to draw (`#tiers`) | keep | Quiet two-panel note, wraps fine at 390. Only the shared `--muted` seed issue applies. |

## Agreement between A and B

- Both independently found: tabs have ARIA without behaviour; the selected tab, pressed buttons and dot/star/rev marks
  vanish in forced colours; the docs shell's `.docs :focus-visible` hides the kit's focus ring in every preview;
  the card `.id` is out of DOM order; rows expose no selection and have no keyboard path; the table hides status at
  390; the catalog table snippet doubles ✓; tab overflow at 390; tally message `nowrap` clips at 390; title block
  "rev B B" in the a11y tree; two-character revs crowd the triangle. High confidence.
- **Severity, resolved:**
  - Tally copy fallback: A P1, B P3. **P1.** The message tells the reader to select text that isn't on the page, and
    the same dead end ships in the artifact template (`tpl:183`), where sandboxed iframes often block the clipboard.
  - Forced colours dots/rev/star: A P1, B P2. **P1.** The table's effort "2 of 3" draws as □□□, and the fix is the
    same token block group 1/2 already need.
  - Card verdict: A polish, B rework. **Rework.** B's finding (sign-off not in the kit) was verified: `cc.js:682`
    boots only `counts(); sheets(); controls();` and the keep/drop/tally code is in `ref:1072–1088` and `tpl:161–185`.
  - Rows: A polish, B rework. **Polish.** The fixes are an attribute, a hover rule and a docs sentence.
  - Form: A polish, B keep. **Polish** (forced-colours checkbox and focus loss).
- **Disputed, verified:** title block snippet. A says the pasted `style="--tb-cols:6"` survives at 390; B said it
  was copy-pasteable. Verified A: an inline custom property on the element beats `.cal-titleblock { --tb-cols: 2 }`
  in the `@media (max-width:700px)` block (`cc.css:863`); the demo hides it through a docs-only `.ex-prev` rule.
- **A only:** title-block snippet truncation; rework → `ok` mapping in the page script (`ref:1079`, verified);
  checkbox squashed by long labels; invalid+focus; "caps labels" copy; catalog "tick" claim; DESIGN.md drift (dropped
  card, rows, button padding); table "compact form"; no `:active` on buttons; lamp count in one card.
- **B only:** sign-off JS missing from the kit (verified); `--title` not derived from seeds — dark seed puts the card
  title, title-block name and selected row label at **1.01:1** (new shared token finding, not in the group 1–2 list);
  dropped-card opacity contrast; brackets in the accessible name; counts empty without JS; hover steals the selected
  row's box; tabs `type=submit`; per-button sign-off binding; `.cal-gl` 4.38:1; title-block `dt` at 10.5 px.
- **Detector:** static pass — `side-tab` on `.cal-card[data-state="dropped"]::before` (**false positive**: a 12 px
  top band of hazard stripes, read as "taped off" drafting markup with the red outline and SUPERSEDED stamp; keep it)
  and `repeating-stripes-gradient` on rules / fault hatch / dropped band (intended drafting line types). Live in-page
  detector (film/night × 1440/390, filtered to `#components`): only `.cal-gl` low contrast 4.4:1 (film, real, P2)
  and `tiny-text` on the 10.5 px title-block `dt` (real inconsistency: below the 11 px legend size, P3). No console
  errors in any run.

## Findings

### Cross-cutting

- **[P1] State carried by `box-shadow` or `background` disappears in forced colours** (both system palettes, both
  themes): selected tab underline (`box-shadow: inset 0 -1px`, `cc.css:287`), text-input focus (`outline:none` +
  lamp line, `cc.css:394`), the checked checkbox square (`::after` background, `cc.css:405`), pressed keep/drop
  (colour only, `cc.css:314–317`), primary button fill. The only forced-colours block is the switch's (`cc.css:501`).
  Fix: extend it — selected tab `border-bottom: 1px solid CanvasText`; `.cal-input:focus` `outline: 1px solid
  Highlight`; checked `::after` `background: CanvasText; forced-color-adjust: none`; `[aria-pressed=true]`
  `outline: 1px solid Highlight`; `.primary` `background: ButtonText; color: ButtonFace`. `cc.css:501`
- **[P1] shared (token): `.cal-dot`, the `.on` star and `.cal-rev` paint with `background`**, so in forced colours
  done/next/ok/fault are identical hollow squares, the live star vanishes and the rev triangle vanishes; the table's
  effort dots read □□□ for 1, 2 and 3 of 3. Fix in the token forced-colours block (same block as groups 1–2):
  `forced-color-adjust: none` with `CanvasText`/`Highlight` fills. `tok.css:192–202`; `.cal-rev` `cc.css:53`
- **[P1] shared (token): seeds don't derive `--title`** (new) as well as `--muted/--ok/--fault` (known). Dark seed over
  film: card h3, title-block name and selected row label at **1.01:1** (#15191b on #14181b); sat. blue `--title`
  1.34; night + sat. pink 1.17. Sign-off text under the sat. seed 2.34–2.41:1. Fix: derive `--title` from `--fg`
  with the others. `tok.css:15`, `tok.css:29` (and the seed comment at `tok.css:7`, which lists `--title` as a seed
  input, while the reference seed UI sets only three)
- **[P2] The docs shell overrides every kit focus ring inside previews.** `.docs :focus-visible { outline: 2px solid
  var(--d-fg); border-radius: 4px }` beats the kit's 1 px lamp ring, rounds square controls and doubles the input
  indicator, so the page never shows the kit's real focus. Fix: `.docs :focus-visible:not(.ex-prev *)`. `ref:33`
- **[P2] shared (token): `--edge-strong` boundaries of interactive parts 1.82 film / 2.35 night** (default button
  box, count boxes, input underline). Known; fix once. `tok.css:75`
- **[P2] shared (token): film lamp text 4.19:1** — card `.no` badge, `.live` "e2e suite", table "in review". Known.
  `tok.css:16`
- **[P3] No `:active` state on any `.cal-btn` tier.** Add a one-step border or `--current` wash. `cc.css:304`
- **[P3] Kit focus ring is 1 px** (4.19 film / 8.38 night vs panel): passes 1.4.11, below the 2 px of 2.4.13 (AAA).
  `tok.css:107`, `cc.css:305`
- PASS — reduced motion: the token-level kill covers button and row transitions; `cal-diff` in the table shows
  final values immediately.
- PASS — Tab order follows the visual order (except card `.id`); disabled "export" is skipped; no console errors.
- PASS — every code tab's Copy writes exactly the shown code; all render identically pasted, except Card, Tabs and
  Counts (below).

### Card + sign-off
- **[P1] Sign-off isn't in the kit, so the Card code tab is dead.** Keep/drop/tally/copy live in `ref:1072–1088`;
  `cc.js:682` boots only counts, sheets and controls. Pasted (`B3/pasted.html`): buttons don't toggle, tally stuck at
  "0 of 1 signed", copy does nothing, and `<svg id="r-lanes-2">` is empty (no mount call in the snippet). The section
  intro says "plus a little JS for counts and sign-off" (`ref:396`); `cat:85–111`, `cat:214–217` show no JS.
  Fix: move the sign-off from `tpl:161–185` (which handles rework) into the kit as a delegated `Calibrated.signoff()`
  wired in `boot`, document it in the catalog, add the recipe mount line to the snippet. `cc.js:682`
- **[P1] The tally's copy fallback is a dead end and clips at 390.** On clipboard failure it says "copy blocked:
  select the text and copy it by hand", but the sign-off text isn't on the page. It's a 10-word sentence in legend
  caps with `white-space: nowrap`, clipped at 390 (tally scrollWidth 388 > 312). Fix: on failure reveal a
  `<textarea readonly>` holding the lines, word it "Copy blocked. Select the text below and copy it.", let the
  message wrap without caps. `ref:1086`, `tpl:183`, `cc.css:338`
- **[P2] Page script maps rework → `ok`.** `card.dataset.state = b.dataset.v === 'drop' ? 'dropped' : 'ok'`, so a
  copied rework button gets a green "kept" badge instead of the REWORK stamp. Use `{keep:'ok', rework:'rework',
  drop:'dropped'}[v]`. Moot if the kit takes the sign-off. `ref:1079`
- **[P2] The page shows none of the card's three states** (kept, rework, dropped are seen only by clicking; rework
  never). Add a state strip or two more cards. `ref:399–428`
- **[P2] Dropped card text fades to 1.57–2.85:1** (opacity .34: film h3 2.12, kv 1.57; night 2.85/1.82). A reviewer
  can't read what they dropped. DESIGN.md says 42%. Use .55–.6 or recolour to `--key`. `cc.css:237`; `DESIGN.md:204`
- **[P2] `.id` is last in the DOM, drawn first by `order:-1`**: screen readers read "01 load test · v2.4" after the
  kv sheet (WCAG 1.3.2); the catalog says put it first. `ref:406`
- **[P2] Sign-off binds per button at load**: a rework button added later gets no listener. Delegate like
  `controls()`. `ref:1074`
- **[P2] DESIGN.md describes a different dropped card and sign-off**: "fades to 42%" (CSS .34), "SUPERSEDED (1px red
  outline …)" (CSS: solid red filled stamp), "a sign-off row of bracketed buttons" (hairline boxes), "`[copy sign-off]`"
  (filled primary). `DESIGN.md:204`, `DESIGN.md:232`
- **[P2] At 390 the drawn stage scrolls (468 > 276 px) with no cue**: the live lane and every boxed value are
  off-screen. Add an edge fade or "scroll →" hint. `cc.css:262`
- **[P2] `.cal-gl` "load test · 3 regions" 4.38:1** on the raised note (film; detector agrees). `tok.css` (`.cal-gl`)
- **[P3] Lamp count in one card**: `.no` badge, tag star, live lane, live node and live value box all lamp. Consider
  an ink badge until the card is the focused one. `cc.css:230`
- **[P3] Long place names wrap the `.id` line into three ragged pieces.** `flex:1; min-width:0` + ellipsis. `cc.css:226`
- **[P3] Page script writes `data-v` on the article**, the same attribute as the buttons; use `data-verdict`. `ref:1077`
- **[P3] Catalog tally snippet lacks `role="status"`** and uses a default copy button (reference: primary). `cat:216`
- Dropped band / detector `side-tab`: false positive, keep (see Detector above).
- PASS: exclusive `aria-pressed`; Space/Enter; tally 0↔1 with `role="status"`; pressed keep 4.96/9.82, drop and
  SUPERSEDED 5.02/5.29; the dropped card keeps the sign-off row at full opacity (undo works).

### Counts
- **[P2] Empty without JS** (no number, noun or name). Make the filled markup (`<b>3</b><span>regions</span>`,
  `cat:127`) the example default, with `data-n` as the live path. `ref:429–432`
- **[P3] `data-n=""` renders "0" while the name says "empty"; 1234567 ungrouped** (kit has `group()`). `cc.js:474–480`
- **[P3] DESIGN.md "a zero-padded number"** — padding is opt-in (`data-pad`). `DESIGN.md:199`
- **[P3] Catalog pads tab counts (`04`)**, contradicting "pad only live counts". `cat:130`
- PASS: `role="img"` names, HTML escaped, long noun wraps, fault 5.02.

### Tabs
- **[P1] ARIA tablist with no tab behaviour.** Clicking "alerts" leaves `aria-selected` on "runs"; no roving
  tabindex, no Arrow/Home/End, no `aria-controls`/tabpanels, buttons default to `type=submit`; the kit ships no tabs
  JS and the catalog doesn't say to bring your own. Fix: `Calibrated.tabs()` in `controls()` (select on click, arrows
  move and select, roving tabindex, toggle `hidden` on controlled panels — the page already has this for `.seg` at
  `ref:1057`), `type="button"` in the example; or drop the tab roles and document a nav variant with
  `aria-current`. `cc.js:682`; `ref:439–443`; `cat:122–134`
- **[P1] Forced colours erase the selected tab** (see cross-cutting). `cc.css:287`
- **[P2] Many tabs overflow**: 8–12 tabs at 390 push the page to 676–833 px, labels wrap to three lines. `overflow-x:
  auto` on `.cal-tabs`, `white-space: nowrap` on tabs. `cc.css:284–285`
- **[P2] Targets 20–22 px tall at 390** (pass 2.5.8 only via spacing). `padding: 6px 0` or `min-height: 24px`. `cc.css:285`
- **[P3] No kit `:focus-visible` / `:disabled` style for tabs.** `cc.css:286`
- **[P3] Tablist has no accessible name.** `ref:439`
- PASS: unselected 4.88/5.73, selected 12.78/12.24, hover to ink.

### Buttons
- **[P2] Inline brackets enter the accessible name** ("[ copy ]"). `content: "[" / ""`. `cc.css:320–321`
- **[P2] Primary loses its fill in forced colours** (see cross-cutting).
- **[P3] Inline brackets are gap-spaced ("[ COPY ]")** by the tier's `gap: 6px`. `gap: 0` for `.inline`. `cc.css:319`
- **[P3] Disabled primary looks close to an enabled default in night.** Give it a dashed box, like the input. `cc.css:310`
- **[P3] DESIGN.md frontmatter `button.padding: "3px 2px"`, textColor ink-muted, is stale** (CSS 6px 12px, ink). `DESIGN.md:60`
- PASS: tiers distinct; hover; disabled `not-allowed` and skipped; targets at 390 primary/default 28.4, inline 24.4,
  quiet 26.4 px (all ≥ 24); long labels wrap inside the box.

### Marks in text
- **[P2] Forced colours: dot fills, star and triangle vanish** (cross-cutting P1 token block); words keep the meaning here.
- **[P3] Two-character revs (`AA`, `12`) overflow the 22 px triangle.** Document one character or widen. `cc.css:53–60`
- PASS: every mark paired with a word; nothing announced twice; `.live` used once.

### Form
- **[P2] Long labels squash the checkbox to 5.4×12 px** (`.cal-check input` lacks `flex:none`); a wrapped label
  centres the box on the paragraph. `flex:none; align-self:start; margin-top:.3em`. `cc.css:401–402`
- **[P2] Invalid + focus barely changes** (red line 1→2 px). Give focus its own channel (lamp outline). `cc.css:395`
- **[P2] Item copy says "Write-in lines with caps labels"**; labels are sentence case by rule. `ref:476`
- **[P2] Catalog: "a filled ink square with a tick"** — CSS draws a 6 px square, no tick. `cat:249`
- **[P3] Checkbox label 21.4 px tall at 390.** `min-height: 24px` on `.cal-check`. `cc.css:401`
- **[P3] Indeterminate looks unchecked; `required` has no mark; `:invalid` unstyled** (only `aria-invalid`, deliberate —
  say so in the catalog). `cc.css:405`
- **[P3] shared (token): placeholder in `--faint`** ("80 %"). `tok.css:77`
- PASS: labels tied, hint described-by, `textbox "owner" [invalid]`, disabled (dashed, muted) vs readonly distinct,
  placeholder lighter than value, long value scrolls.

### Rows
- **[P2] Selection is visual only; no keyboard path.** `.sel` has no `aria-current`/`aria-selected` (the catalog's
  `aria-selected` is invalid without `role=option`); rows aren't focusable and there's no `:focus-within` rule,
  though the catalog and CSS comment say "or keyboard focus". Fix: `aria-current="true"` in the example (or
  listbox/option), add `.cal-rows > :focus-within .v` to the hover selectors, or narrow the docs to hover.
  `cc.css:680–688`; `ref:488–491`; `cat:241`, `cat:281`
- **[P2] Hover takes the box off the selected row**, so nothing marks the selection while pointing. Keep the selected
  box and draw hover lighter (`--edge-strong`). `cc.css:688`
- **[P3] DESIGN.md: "selected row takes the 8% wash and a 2px lamp bar"** — CSS/catalog: boxed `.v`, no tint. `DESIGN.md:229`
- PASS: long values wrap inside the box; the no-`.v` inset box works; meta 4.88/5.73.

### Table
- **[P2] "Compact form" claim is false.** `<cal-diff>` renders full (355 px in a 383 px column), squeezing text columns
  to 3-line wraps. `data-density="compact"` on the table, or default instruments to compact inside `.cal-table`. `ref:497`
- **[P2] At 390 the table is `display:block; overflow-x:auto` (866 in 312 px)**: diff, effort and status off-screen
  with no cue; `display:block` on `<table>` drops table semantics in Safari/VoiceOver. Wrap in a scroll container with
  an edge fade, or pin the first column. `cc.css:858–859`
- **[P2] Catalog snippet writes `✓ shipped`** while CSS adds `"✓ "` → "✓ ✓ SHIPPED"; it also documents ■□ glyph
  effort where the page uses named `.cal-dot`s. `cat:224–225`; `cc.css:353`
- PASS: headers, effort cells named "effort 2 of 3", diffs named "212 lines added, 38 removed", row hover tint.

### Title block
- **[P1] Copied snippet breaks on phones.** The code tab rewrites `.tb6` to `style="--tb-cols: 6"` (catalog uses
  `--tb-cols:4`); the inline property beats the kit's `@media (max-width:700px) { .cal-titleblock { --tb-cols: 2 } }`,
  so at 390 values ellipsize to "CH…", "1 …", "20…". Fix: read `--tb-cols` only above 700 px (`@media (min-width:
  701px) { grid-template-columns: repeat(var(--tb-cols,4), …) }`, 2 otherwise) or offer `data-cols`; then
  `cat:29` "(2 below 700px)" is true. `cc.css:33`, `cc.css:863`; `ref:905`; `cat:19`, `cat:29`
- **[P2] Values ellipsize with no way to read them** (`dd { white-space:nowrap; text-overflow:ellipsis }`: a long dwg
  no. shows 56 of 598 px). Let non-name cells wrap (`overflow-wrap:anywhere`). `cc.css:41`
- **[P3] "rev B B" in the a11y tree** (value + the triangle's `::after`). `aria-hidden="true"` on the decorative
  `.cal-rev`, or `content: attr(data-rev) / ""`. `ref:515`; `cc.css:60`
- **[P3] `dt` at 10.5 px** (detector `tiny-text`), below the 11 px legend size; `--key` 4.31 on sat. pink. Use
  `--fs-legend`. `cc.css:40`

### Revisions
- **[P3] Triangle vanishes in forced colours** (token block above); **two-character revs crowd it** (Marks in text).
- PASS: table semantics, letter in the name, 5.02/5.29, long descriptions wrap, dates nowrap.

### When to draw
- PASS: auto-fit 280 px columns stack at 390; three tiers and long unbroken words wrap. Shared `--muted` seed only
  (2.41 sat. blue, 2.11 night + sat. pink).

## Group level

**Design specificity: high.** The card (info column, today/drawn compare, taped-off drop, stamps), the title block
and the revision triangle are drafting artefacts, not generic UI. What drifts is behaviour and documentation: two
components (sign-off, tabs) promise interaction the kit doesn't ship, state lives in channels forced colours
remove, and DESIGN.md / catalog / CSS disagree in six places.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 3 | Pressed, selected, checked vanish in forced colours |
| 2 | Match real world | 4 | Taped off, title block, rev triangle are apt |
| 3 | User control | 3 | Sign-off undo works; tabs can't be operated |
| 4 | Consistency | 2 | Tab ARIA without behaviour; DESIGN/catalog/CSS drift |
| 5 | Error prevention | 3 | Title-block snippet truncates on phones; tabs `type=submit` |
| 6 | Recognition vs recall | 2 | Card states invisible until clicked; hover steals the selected row's box |
| 7 | Flexibility | 3 | No arrows on tabs, no keyboard on rows |
| 8 | Minimalist design | 4 | Restrained; full-size diff in the table the one awkward spot |
| 9 | Error recovery | 2 | Copy fallback points to text that isn't there; form errors clear and linked |
| 10 | Help and docs | 2 | Card/Tabs code tabs don't work pasted; false claims (compact, caps, rows keyboard, tick) |
| **Total** | | **28/40** | **Good (70%)** |

(A scored 28, B 29.)

**Cognitive load:** low. The card asks the most (two stages, a kv sheet, three actions), but the info column reads top
to bottom once `.id` is first in the DOM.

**Strengths**
1. The card turns a review into a drawing-set act: compare today vs drawn, then sign it off.
2. Semantics are mostly right where the kit owns them: named counts, named effort cells, `aria-invalid` +
   describedby, `role="status"` tally, exclusive `aria-pressed`.
3. Lamp discipline holds across the group: lamp only on live rows, the live dot and focus.

**Persona red flags**
- **Sam (screen reader / keyboard):** tabs announced as tabs but inert; row selection silent; card info read out of
  order; "[ copy ]" and "rev B B" in names.
- **Alex (power user):** pastes the card and gets dead buttons and an empty figure; pastes the title block and it
  truncates on phones.
- **Casey (390 px):** table status scrolled away with no cue; drawn stage crops its values; tally message clipped.
- **Forced-colours user:** cannot tell which tab, which verdict, which checkbox or which effort level.

**Questions**
1. Should sign-off and tabs ship as kit JS (`Calibrated.signoff()`, `Calibrated.tabs()`), or should the catalog
   declare them markup-only with no ARIA promises?
2. Should the reference show the card in all three verdict states at rest?

## Counts

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 7 |
| P2 | 27 |
| P3 | 22 |

P1s: forced-colours state loss (kit CSS), forced-colours dots/star/rev (token), `--title` not seed-derived (token),
sign-off not in the kit, tally copy fallback, tabs without behaviour, title-block snippet on phones.
(Forced-colours selected tab is listed under Tabs and counted once, in cross-cutting.)
Shared with groups 1–2 (fix once in tokens): forced-colours block, seed derivation (now incl. `--title`),
`--edge-strong`, film lamp text, `--faint` placeholder.

Questions skipped: unattended plan run; findings go to the approval gate in chunk 5.

# Group 4 · Form controls (`#controls`, demo/reference.html:547–648)

Review of the 7 form-control entries: CSS in `skills/calibrated-components/assets/calibrated-components.css`, wiring
in `controls()` of `calibrated-components.js`. Read-only: no source file was changed.
Raw assessments: `<scratchpad>/raw/A4-form-controls.md`, `raw/B4-form-controls.md`; evidence in `<scratchpad>/A4/`,
`B4/` (session scratchpad, not kept): kit-only edge pages for every state (`A4/edge.html`), each code tab pasted into
a kit-only page, a no-JS page, forced-colours / seed / 390 screenshots, the live detector JSON.

Checked: desktop 1440 and mobile 390, film and night, dark / saturated blue / saturated pink seeds, forced colours
(light and dark system palettes × film and night), reduced motion, a real Tab walk with Space / Enter / arrows /
Escape, hover / focus-visible / active / disabled / readonly / invalid / required / placeholder, long labels and long
content, the CDP a11y tree, touch-target boxes at 390, no-JS, trusted file selection and drop.

Short paths: `cc.js` = `skills/calibrated-components/assets/calibrated-components.js`,
`cc.css` = `skills/calibrated-components/assets/calibrated-components.css`,
`tok.css` = `skills/calibrated-tokens/assets/calibrated.css`, `ref` = `demo/reference.html`,
`cat` = `skills/calibrated-components/references/catalog.md`.

## Verdicts

| Component | Verdict | Reason |
|---|---|---|
| Textarea (`#textarea`) | polish | Strong concept (editor pane, vim status line; count, ln/col, mode and over-limit all work). Status line fails 4.5:1 on the well in film, no disabled/readonly look, and screen readers never hear the max or why it's invalid. |
| Select + option list (`#select`) | polish | The base-select picker works fully by keyboard and options are named. No `:disabled` / `aria-invalid` style; in forced colours every `.cal-list` option looks chosen; hover and focus can box two options. |
| Radio / switch / detent (`#choices`) | **rework** (radio, detent) · switch: keep | The Rev N switch delivers everything it claims (below). The radio dot and the whole detent (rule, ticks, ▼) vanish in forced colours; with a dark seed the switch's active word and the chosen detent label drop to 1.01:1 so the visible word is the wrong state; long labels squash the radio; off states under 3:1 in film. |
| Range on a ruler (`#range`) | **rework** | Keyboard, `aria-valuetext` and the output work, but the whole ruler disappears in forced colours, no-JS shows a false reading (run at 50%, handle at 80%), the reading box overflows at 0 / 100%, and disabled isn't styled. |
| Number + search (`#number`) | **rework** | The stepper corrupts decimals (1.5 ↑ step .5 → "16"); typed values aren't clamped; unit missing from the accessible name; no spinbutton semantics; the `/` key cap and the catalog's clear button are never wired. |
| Group / tags / date (`#group`) | polish | Tag logic is good (Enter, comma, Backspace, case-insensitive duplicate). × targets are 13×16 px, changes are silent, a 120-character tag makes a 933 px chip, the placeholder is clipped at 390. Date/time are native and fine. |
| File drop (`#drop`) | polish | Keyboard opens the picker; oversize is flagged in text. Wrong types are listed as valid under a "csv or json" hint (no `accept`, no check), the list isn't announced, the size column wraps at 390. |

**Rev N switch (checked in depth by both): PASS.** Label hit area 24 px tall (72–196 px wide) at 390; input stays
24×12 when the label wraps (`flex:none`); on/off readable without colour (knob position + ink fill; on knob 11.05 /
9.98:1); focus ring 1 px lamp at 2 px offset, 4.19 film / 8.38 night; forced colours in both palettes (CanvasText
pill, Highlight knob when on); reduced motion → 0 s; disabled .5 + not-allowed; Space and label click toggle;
DESIGN.md:220, `cat:291–296` and the Rev N copy (`ref:818`) match the CSS (24×12, 8 px knob, `--current` wash, no lamp,
`.caps`, optional `.o`, `--sw-w/h/knob`). Remaining switch issues: off-state contrast in film, OFF/ON in the name,
`--title` under seeds (all below).

## Agreement between A and B

- Both independently found: forced colours erase the radio dot, checkbox square, detent marks and the range ruler;
  the docs shell's `.docs :focus-visible` paints a rounded dark ring over the kit's focus in every preview; disabled is
  styled only on `.cal-input`; select has no invalid style; long labels squash the radio/checkbox; OFF/ON words in the
  switch's name; textarea count/limit never reaches AT; the `/` hint is unwired; tag × 13×16 px; tag changes and file
  lists unannounced; drop has no `accept`; cc.js throws without figures.js; the Rev N switch passes. High confidence.
- **Severity, resolved:**
  - Docs focus ring / Inter in previews: A P1, B P2. **P2**, matching group 3 (docs shell, not kit; fix once at `ref:33`).
  - Long label squashes the radio: A P1, B P2. **P2**, matching the same checkbox finding in group 3.
  - Off-state contrast (switch knob 2.57, pill 1.81; radio ring 1.81): A P1, B P3. **P1.** The off state is the one the
    control must make readable, and the `.caps` variant has no words, so film relies on a 2.57:1 knob. The fix is
    component-level (`--muted` off knob) and independent of the token fix.
  - Tag × 13×16 px: A P1, B P2. **P2.** It passes 2.5.8 through the spacing exception (15.5 px to the nearest target);
    still well short of the 44 px comfort target.
  - Range verdict: A polish, B rework → **rework** (forced colours remove the whole control's drawing; false no-JS reading).
  - Number verdict: A polish, B rework → **rework** (decimal corruption, verified at `cc.js:520`).
- **A only:** textarea status line 3.90 / 3.35:1 on the well (film); `.ex-prev` doesn't reset the font (radio/switch
  labels in Inter); unit not in the number's name; typed negative survives blur; legend run-on; disabled detent;
  hidden file input lands 220 px right of the label; "0" vs "50%" scale labels; lamp ▼ on every detent at rest.
- **B only:** decimal stepper corruption (verified); `--title` not seed-derived hides the switch's active word and the
  chosen detent / list value (same token gap group 3 found); 4 of 7 code tabs depend on docs-only `.row`; detent rule
  overruns when not shrink-wrapped; no-JS range false reading; range box overflow at the ends; no spinbutton
  semantics; catalog clear button never un-hidden; 933 px tag; hover+focus double box in the picker; `isTrusted` guard
  ignores programmatic `change`; double announcement on the range output.
- **Detector:** static pass — no kit findings in `#controls` (range ticks are repeating gradients, intended). Live
  in-page detector (film/night × 1440/390): **0 findings** inside `#controls`. No console errors. No horizontal overflow
  from `#controls` at 390 (the page's 396 px overflow comes from `#instruments`).

## Findings

### Cross-cutting

- **[P1] Forced colours erase every state mark drawn as a pseudo-element background or gradient** (all four palette ×
  theme combinations): checked radio dot (`cc.css:461`) and checkbox square (`cc.css:405`) → "Canary" reads unchecked;
  detent rule, ticks and lamp ▼ (`cc.css:714–725`) → no chosen value; range track, ticks, run and output leader
  (`cc.css:730–756`) → a bare box; the date ▼. The switch's block proves the pattern. Fix: extend it — checked
  `::after { background: CanvasText; forced-color-adjust: none }`; detent `.mk` `Highlight`, rule/ticks `CanvasText`
  with `forced-color-adjust: none`; range `forced-color-adjust: none` with system-colour gradients and a `Highlight`
  thumb. `cc.css:501` (same block group 3 extends for tabs / pressed / focus)
- **[P1] shared (token): `--title` isn't seed-derived, and here it carries state.** Dark seed: 1.01:1 (sat. blue
  1.34). The switch's active OFF/ON word vanishes, so "Pause at the limit" shows only **OFF** while it is on; the
  chosen detent label ("24H") and the chosen `.cal-list` value (1.13:1) vanish. Fix once in the token (derive from
  `--fg`) or use `--fg` in these three rules. `tok.css:15`; `cc.css:478`, `cc.css:719`, `cc.css:657`
- **[P2] The docs shell misrepresents the kit's focus and type in previews.** `.docs :focus-visible` (2 px near-black,
  radius 4 px) beats the kit's `outline:none` on textarea, select, inputs, chips, × buttons, date and file input — the
  page contradicts its own lede ("focus is the lamp") and the square-corner rule. `.ex-prev` also doesn't reset the
  font, so radio / switch / checkbox / drop-hint labels render in Inter 15 px. Fix: `.docs :focus-visible:not(.ex-prev
  *)` and `.ex-prev { font: 400 var(--fs-body)/1.6 var(--font-body); color: var(--fg) }`. `ref:33`, `ref:91`
- **[P2] 4 of 7 code tabs depend on the docs-only `.row`** (defined only at `ref:120`). Pasted into a kit-only page:
  select and list stack full width, INDEX/SANDBOX switches butt together, number and date fields stack, the detent rule
  runs full width. Inline `display:flex; gap` in the snippets or add a kit layout class. `ref:566`, `ref:581`,
  `ref:588`, `ref:613`, `ref:618`, `ref:632` (same `.row`/`.stack` issue logged in group 1)
- **[P2] Disabled / readonly / required / invalid are drawn only for `.cal-input`.** Disabled select keeps fg text,
  pointer and the hover rule; disabled textarea, range and detent option look enabled (range keeps `grab`); readonly
  looks editable; `aria-invalid` on select does nothing; `required` has no mark. Fix: mirror `.cal-input:disabled`
  (`cc.css:396`) for `.cal-select:disabled` (after `cc.css:428`), `.cal-term:has(:disabled)` (after `cc.css:697`),
  `.cal-range:has(:disabled)` (after `cc.css:732`), `.cal-detent label:has(:disabled)` (after `cc.css:715`); add
  `:read-only` and `.cal-select[aria-invalid="true"]`.
- **[P2] Form-control wiring silently needs calibrated-figures.js.** cc.js throws at load without `Calibrated`, so a
  form-only page gets no count, detent glide, range reading, stepper, tags or drop list (and the range shows a false
  reading). SKILL.md says only "the custom elements also need calibrated-figures". Guard only the custom-element part,
  or document it. `cc.js:29`; `skills/calibrated-components/SKILL.md:10`
- **[P3] shared (token): `--faint` text** — textarea `.mode` 2.30, `.cal-list .lg` 2.32, search/tags placeholders 2.59
  (the tags placeholder carries the only "then enter" instruction); **`--edge-strong` lines** 1.82 film / 2.35 night on
  input, select, chips, drop; **`--muted` not seed-derived** (2.41 sat. blue on hints, affixes, `.nums`). Known; fix once.
- PASS — reduced motion: switch, knob, detent ▼ and ticks, chips and list boxes at 0 s.
- PASS — keyboard path is complete through all 7 entries; radiogroup and detent are single Tab stops with arrow keys.
- PASS — no horizontal overflow at 390 in any preview; dark seed holds except `--title`; no console errors.

### Textarea
- **[P2] Status line under 4.5:1 on the well (film):** `--muted` on `--well` 3.90:1 (ln/col, "/ 200"), lamp
  `-- insert --` 3.35:1, `-- normal --` (`--faint`) 2.06–2.30:1; all 11 px. Night passes (5.95 / 8.70). Use `--key` for
  the bar and `.mode`; lamp only where it passes. `cc.css:704`, `cc.css:707`, `cc.css:710`
- **[P2] AT gets no limit and no over-limit reason.** `.bar` is `aria-hidden`, the demo has no hint (the catalog's
  does), and at 205/200 `aria-invalid` flips with no description. Copy the catalog hint into the demo and show the
  `.err` swap, or mirror the count into a polite live node. `ref:555–559`
- **[P2] No disabled / readonly look** (cross-cutting). `cc.css:697`
- PASS: over-limit reddens pane and count with "51 / 20" in text; insert/normal and ln/col track the caret;
  `field-sizing` and `overflow-wrap:anywhere` handle a 205-character URL; focus border 4.19 / 8.38; no-JS degrades to a
  static bar.

### Select + option list
- **[P2] No `:disabled` or `aria-invalid` style** (cross-cutting). `cc.css:428`
- **[P2] Forced colours: every `.cal-list` option looks chosen** (the transparent `.v` border is forced to CanvasText).
  Under forced colours: `.v { border-color: Canvas }`, `.sel .v { border-color: Highlight }`. `cc.css:656`
- **[P3] Hover and keyboard focus can box two options at once** in the open picker. Add
  `.cal-select:has(option:focus-visible) option:hover:not(:focus-visible) .v { border-color: transparent }`. `cc.css:687`
- **[P3] shared (token): `.cal-list .lg` in `--faint`** ("4 nodes"). `cc.css:445`
- PASS: Tab → Enter opens (lamp ▼), arrows move the box, Enter commits, Esc closes and returns focus; options named in
  the CDP tree; chosen box 12.8 / 12.2:1; picker flips near the viewport edge; long option and 20 options fine.

### Radio / switch / detent
- **[P1] Off states under 3:1 in film (WCAG 1.4.11).** Switch off knob `--faint` 2.57:1, pill border `--edge-strong`
  1.81:1 (night 3.59 / 2.34); on-pill border `--faint` 2.57:1; unchecked radio ring 1.81:1. The `.caps` switch has no
  words, so off is a barely-there grey blob. Fix: off knob and pill border `--muted` (4.88 film / 5.73 night).
  `cc.css:488`, `cc.css:491`; radio ring `cc.css:459`
- **[P1] Forced colours: radio dot and detent marks lost** (cross-cutting). `cc.css:461`, `cc.css:714–725`
- **[P1] Seeds: switch active word and chosen detent label vanish** (cross-cutting `--title`). `cc.css:478`, `cc.css:719`
- **[P2] A long label squashes the radio (5.2×13 px) and checkbox (6.7×12 px)**; the switch already has `flex:none`.
  Add `flex:none` and `align-items:flex-start` + a small top margin. `cc.css:459`, `cc.css:402`
- **[P2] OFF/ON words are in the switch's accessible name** ("Pause at the limit off on"). `aria-hidden="true"` on `.o`
  in markup and catalog. `ref:589–591`; `cat:296`
- **[P2] Detent rule overruns when the detent isn't shrink-wrapped** (`display:grid` stretches; `::before` runs past
  the last tick — visible in every pasted snippet). `display:inline-grid` or `width:max-content`. `cc.css:713`
- **[P2] A disabled detent option isn't drawn as disabled.** `cc.css:715`
- **[P2] Radio label hit area 21 px tall at 390** (passes 2.5.8 only via spacing; the switch has `min-height:24px`).
  `cc.css:458`
- **[P3] Detent labels over ~6 characters collide** in the fixed 52 px columns ("7 days" / "quarter" 3 px apart);
  nothing grows `--col`. `cc.css:713`
- **[P3] Detent radio names are abbreviations** ("1H", "7D", "30D"). `aria-label="7 days"` in the demo. `ref:595`
- **[P3] Lamp ▼ on every detent at rest**: three detents = three lamps, none live. Ink ▼ at rest, lamp while focused or
  gliding. `cc.css:723`; DESIGN.md "Inputs / Fields"
- **[P3] Clicking the "OFF" word turns an off switch on** (the word reads like a target). `pointer-events:none` on `.o`,
  or make OFF/ON set the state. `cc.css:477`
- PASS: detent arrow keys move the choice and the ▼ glides (`--x` 78→130 px); lamp ring on the label; detent label
  52×30 px; no-JS detent shows the marker via `::after`.

### Range on a ruler
- **[P1] Forced colours: the ruler, ticks, run and leader disappear** (cross-cutting). `cc.css:730–756`
- **[P2] False reading without JS** (or when cc.js throws): `--p` defaults to .5, so the run stops at 50% while the
  native handle sits at 80%, under an empty `<output>`. Have `range()` add `.js` (as `detent()` does) and hide run and
  output in `.cal-range:not(.js)`. `cc.css:729`; `cc.js:545`
- **[P2] The reading box overflows its container at the ends** (+15 px at 100%; −58.8 px at 0 with a long unit). Clamp
  `left` by half the box width. `cc.css:755`
- **[P2] Target 20 px tall, thumb 13 px wide** (< 24). `height:24px` on the input, keep the drawn track 20 px. `cc.css:730`
- **[P2] No disabled style; cursor stays `grab`** (cross-cutting). `cc.css:732`
- **[P3] Output and slider both announce** (`<output for>` is a status, the slider has `aria-valuetext`). `aria-hidden`
  on the output or drop `for`. `ref:605`
- **[P3] Scale labels mix "0" with "50%" and "100%".** `ref:606`; `cat:313`
- PASS: ←/→/PageUp/Home/End update value, `--p`, output and `aria-valuetext`; focus turns handle and output lamp;
  hover inks the handle.

### Number + search
- **[P1] The stepper corrupts decimals.** `digits = (s) => parseInt(String(s).replace(/[^\d-]/g, ''), 10)` strips the
  ".", so `value="1.5" data-step="0.5"` ↑ → "16" and "2.5" ↓ → "25"; `group()` rounds away fractional steps. Parse with
  `parseFloat` after removing grouping spaces, keep the step's precision, group only the integer part. `cc.js:519–520`
  (stepper `cc.js:591–598`)
- **[P2] Typed values aren't validated or clamped**: with `data-min=1 data-max=9`, typed 42 / −7 survive blur with no
  `aria-invalid`; "abc" + ↑ silently becomes 2. Clamp on blur or set `aria-invalid`. `cc.js:599`
- **[P2] No spinbutton semantics** (AX: `textbox "daily limit"`, no value/min/max). `role="spinbutton"` with
  `aria-valuenow/min/max/valuetext` kept by the JS, or document it. `cc.js:591`
- **[P2] Unit not in the accessible name** ("daily limit, 150 000", no "req / day"). Id the affix, add it to
  `aria-describedby`. `ref:615`; `cat:321`
- **[P2] The `/` key cap is a dead promise, and the catalog's clear button is never un-hidden.** Nothing binds `/`; the
  clear button stays `hidden` after typing. Wire an opt-in `data-key="/"` and the clear button in `controls()`, or say
  both are the page's job. `ref:612`, `ref:619`; `cat:328–336`; `cc.js:599`
- **[P3] Touch users can't step** (arrows only; `.cal-affixed .cal-btn` exists but the demo has no − / +). `ref:615`
- **[P3] Search count "05 runs" is not tied to the field or announced.** Show `aria-live="polite"` in the catalog. `cat:331`
- PASS: ↑ 150 000 → 160 000, Shift+↑ +100 000, floor clamps at 0, grouping on blur, focus-only hint stays in the AX
  description; disabled and invalid number lines work.

### Group / tags / date
- **[P2] Tag × buttons 13×16 px at 390** (pass 2.5.8 only by spacing). `min-width/min-height: 24px` with a negative
  margin so the chip doesn't grow. `cc.css:619`
- **[P2] Tag adds, removals and duplicates are silent** (0 live regions; Backspace deletes with no announcement or undo;
  duplicate cue is a 0.9 s colour flash). Polite live node per `.cal-chips`. `cc.js:567`, `cc.js:610–615`
- **[P2] A 120-character tag renders as one 933 px chip**, widening the box and its parent. `max-width:100%;
  min-width:0; overflow-wrap:anywhere` on `.chip`. `cc.css:618`
- **[P3] Placeholder clipped at 390** ("add a team, the…"); it carries the only "then enter" instruction. Shorter
  placeholder or a `.hint`. `ref:630–631`
- **[P3] Legend reads as one phrase** ("1 · Limits applies to every region"). Mute the span (`--key`) or add a
  separator. `cc.css:555`
- **[P3] Duplicate `.cal-group > legend b` rule** (500/`--title`, then 400/`--fg`; the first is dead). `cc.css:556`
- **[P3] A long, wrapping legend loses its rule** (`::after` collapses to 0). `cc.css:558`
- **[P3] Date picker indicator is a 10×10 4th Tab stop** with only the UA focus box; the lamp underline drops while it's
  focused. `cc.css:639`
- PASS: Enter/comma add, empty/whitespace ignored, case-insensitive duplicate lights the original, Backspace removes,
  × returns focus to the input, `cal-chips` fires; fieldset exposed as a named group; disabled fieldset dashes its
  inputs; date/time native spinbuttons with lamp underlines.

### File drop
- **[P2] Wrong types are listed as valid** under a "csv or json" hint: the demo input has no `accept`, and `listFiles`
  doesn't check type (a synthetic drop ignores `accept` anyway). Add `accept=".csv,.json"`, and flag mismatches in
  `listFiles` like oversize files. `ref:643`; `cc.js:553`; `cat:357`
- **[P2] The file list isn't announced** (no `aria-live`). `aria-live="polite"` on the target rows. `cc.js:553`; `ref:644`
- **[P3] Size column wraps ("2" / "B") beside a long name at 390.** `flex:none; white-space:nowrap` on `.lg`,
  `min-width:0; overflow-wrap:anywhere` on the name. `cc.css:648`
- **[P3] Hidden input is `position:absolute` in a non-positioned label** (lands ~220 px right of the label).
  `position:relative` on `.cal-drop`. `cc.css:604`
- **[P3] The `isTrusted` guard ignores programmatic `change`** (frameworks/tests get no listing). Use a flag set in the
  drop handler instead. `cc.js:609`
- **[P3] No cap on the list** (30 files → 1 165 px). Consider a count row. `cc.js:553`
- PASS: Tab focuses the input with a lamp ring on the label; Space opens the picker; 312×88 px hit area; 25 MB reads
  "25.0 MB · over 20.0 MB" in red text; `.over` outline on drag; AX `button "drop files here · or [browse] …"`.

### Docs accuracy
- **[P3] `cat:249` "a filled ink square with a tick"** — CSS and DESIGN.md:219 draw a 6 px square, no tick (also in group 3).
- PASS: item copy for textarea, select, choices, range, group and drop matches behaviour; catalog matches the JS for
  textarea events, tags, drop `data-max`, range ticks and handle states, and the no-JS detent marker.

## Group level

**Design specificity: high.** The editor pane with a vim status line, the detent ruler, the range on a ruler with a
boxed reading on a leader, write-in lines and boxed tags are this language's own controls, not a generic kit
recoloured. The faults are robustness faults: forced colours, the full set of states, AT wiring, and one data bug.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 2 | Count, tag changes and file list unannounced; no-JS range shows a false 50% |
| 2 | Match real world | 3 | Drawing metaphors read well; `/` key cap implies a shortcut; "7D/30D" |
| 3 | User control | 2 | Backspace silently deletes tags with no undo |
| 4 | Consistency | 2 | Disabled / readonly / invalid only on `.cal-input`; radio lacks the switch's 24 px min |
| 5 | Error prevention | 1 | Decimal corruption, unclamped typed numbers, wrong file types accepted |
| 6 | Recognition vs recall | 3 | Unit missing from the name; instruction placeholder clipped at 390 |
| 7 | Flexibility | 3 | Shift ×10 stepping; touch can't step; `/` unwired |
| 8 | Minimalist design | 3 | Strong language; detent overrun, long tag, run-on legend, lamp on every detent |
| 9 | Error recovery | 2 | Oversize flagged but wrong type isn't; over-limit textarea doesn't say why |
| 10 | Help and docs | 2 | Docs shell leaks focus ring and Inter; code tabs need `.row`; figures.js dependency unstated |
| **Total** | | **23/40** | **Acceptable (58%)** |

(A scored 25, B 24.)

**Cognitive load:** low. Each control does one job; the textarea's status line and the detent's ruler add information
without adding decisions.

**Strengths**
1. The Rev N switch is a model for the rest: hit area, forced colours, reduced motion and docs all match.
2. Keyboard path is complete: single-stop radio groups, arrow keys on detent and range, full base-select support.
3. Errors are stated in text, not only colour: "51 / 20", "25.0 MB · over 20.0 MB".

**Persona red flags**
- **Sam (screen reader / keyboard):** never hears the textarea limit, a removed tag, the dropped files, the number's
  unit; switch names read "off on".
- **Alex (power user):** a decimal stepper silently multiplies values by ten; typed out-of-range values pass; pasted
  snippets lose their layout without `.row`.
- **Casey (390 px):** tag × at 13×16 px; placeholder instruction clipped; size column wraps.
- **Forced-colours user:** cannot tell which radio, which detent value or where the range sits.

**Questions**
1. Should every control share one disabled / readonly / invalid treatment (dashed line, muted, not-allowed), stated
   once in the catalog?
2. Should the detent ▼ be ink at rest and lamp only while focused, so a settings page isn't three lamps?

## Counts

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 5 |
| P2 | 27 |
| P3 | 21 |

P1s (distinct): forced-colours state marks (radio, checkbox, detent, range), `--title` seed derivation hiding state
words (token), off-state contrast of switch and radio, decimal stepper corruption. (Forced colours and `--title` are
repeated under their components and counted once.)
Shared with groups 1–3 (fix once in tokens): forced-colours block, seed derivation incl. `--title`, `--faint` text,
`--edge-strong` lines. Shared with group 3 (fix once): `.docs :focus-visible` override at `ref:33`, checkbox `flex:none`,
catalog "tick".

Questions skipped: unattended plan run; findings go to the approval gate in chunk 5.
