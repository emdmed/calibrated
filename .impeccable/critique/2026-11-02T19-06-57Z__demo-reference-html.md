---
target: reference page · groups 1 Instruments + 2 Figures
total_score: 24
max_score: 36
na_heuristics: 3
p0_count: 1
p1_count: 14
target_identity: "file:/home/enrique/projects/calibrated/demo/reference.html"
target_fingerprint: "sha256:170b9641a4caf06fab7b96cda9bc42142c7c81966fb8856dc63b11b69b995c64"
target_path: /home/enrique/projects/calibrated/demo/reference.html
timestamp: 2026-11-02T19-06-57Z
slug: demo-reference-html
---
Method: dual-agent per group (A: design review · B: detector + browser evidence), isolated subagents.

Scope: reference page groups 1 (Instruments) and 2 (Figures) only; groups 3–7 follow in later runs. Full reports: .impeccable/review/reference/group-1-instruments.md and group-2-figures.md (gitignored).

# Group 1 · Instruments (`#instruments`, demo/reference.html:275–378)

Review of the 6 custom elements in `skills/calibrated-components/assets/calibrated-components.js` (+ `.css`),
drawn with `skills/calibrated-figures/assets/calibrated-figures.js`. Read-only: no source file was changed.
Raw assessments: `<scratchpad>/raw/A1-instruments.md`, `raw/B1-instruments.md`; evidence in `<scratchpad>/A1/`, `B1/`
(session scratchpad, not kept).

Checked: desktop 1440 and mobile 390, film and night, dark / saturated blue / saturated pink seeds, forced
colours (light and dark system palettes, Chromium emulation), reduced motion, print, and every element created
with edge attributes.

Short paths: `cc.js` = `skills/calibrated-components/assets/calibrated-components.js`,
`cc.css` = `skills/calibrated-components/assets/calibrated-components.css`,
`cf.js` = `skills/calibrated-figures/assets/calibrated-figures.js`,
`tok.css` = `skills/calibrated-tokens/assets/calibrated.css`, `ref` = `demo/reference.html`.

## Verdicts

| Component | Verdict | Reason |
|---|---|---|
| meter (`cal-meter`) | **rework** | Excellent drawing, but over-limit is clamped and announced as full (140/100 → "100 / 100 · 100%"); `max=0` → NaN; negative value draws off-canvas; needle is always lamp, so two meters = two lamps. |
| position (`cal-position`) | polish | Clean mark. Large counts turn ticks into a grey bar, `count=0` reads "1 of 1", compact has no visible reading. |
| progress (`cal-progress`) | polish | Strongest of the six. Name drops captions, `fault-label` suppressed by `live-label`, todo squares 1.82:1, `states` can draw two stars. |
| diff (`cal-diff`) | polish | Log-past-knee is smart. Names float ~200 px from bars, long label breaks the shared centre, `knee=0` throws. |
| durations (`cal-durations` / `cal-span`) | **rework** | Code tab ships a stale epoch (pasted: "running for 54h 57m"); long span name turns the ruler inside out; over-max clamped with no break mark; overflows at 390. |
| ruler (`cal-ruler`) | **rework** | `step=0`, negative step or `min==max` loops forever (P0); marker has no text reading; out-of-range value drawn pinned but announced raw; glow DESIGN reserves for the star; ignores `density`. |

## Agreement between A and B

- Both independently measured the same contrast table (identical ratios) and found: `--faint` text failing,
  `--edge-strong` marks failing, seeds not re-deriving `--muted/--ok/--fault`, no forced-colours rule for the
  instrument SVG, meter over-limit clamp, ruler hang, 390 px clipped readings, progress fault-label suppression.
  High confidence.
- **Severity, resolved:** B rated film lamp text (4.19:1), the 390 px clipping and the ruler loop P2; A rated them
  P1/P1/P0. Kept A: the ruler freezes the tab on plain attribute values (P0); clipping hides a wrong reading
  ("12m" for "12m 40s") on mobile (P1); lamp text is the live reading (P1, and matches the group 2 call).
  `--edge-strong` marks: P1 (todo vs. done is Progress's whole message).
- **A only:** false zeros for instruments never scrolled into view (print, PDF, full-page screenshots — the baseline
  PNGs from chunk 1 show them empty); stale Durations epoch in the code tab; ruler glow vs. DESIGN.md.
- **B only:** `diff knee=0` uncaught TypeError; durations long name inverts the ruler; `position count=0`;
  forced colours with a dark system palette reverses done/todo in Progress.
- **Detector:** static pass — nothing kit-side in this group (6 `.ex` cramped-padding + 6 `a.anchor` low-contrast,
  docs shell; see `detector-by-group.md`). Live in-page detector (injected `detect-antipatterns-browser.js`, mutation
  preflight passed, 59 findings page-wide in film / 57 night, no console errors): in `#instruments` only
  `tiny-text` on the meter's 11 px reading — false positive (11 px is the legend size) — and `line-length` ~92 ch on
  a props-table cell (`ref:288`, docs shell, P3). The detector skips SVG fill/stroke, so all contrast findings
  come from hand measurement.

## Measured contrast (against the preview panel)

| Ink | film | night | dark seed | sat. blue | sat. pink |
|---|---|---|---|---|---|
| `--fg` text | 12.78 | 12.24 | 13.79 | 10.11 | 9.13 |
| `--muted` text | 4.88 | 5.73 | **3.27** | **2.41** | **4.09** |
| `--faint` text (scale numbers, position/diff names) | **2.59** | **3.58** | **3.74** | **3.14** | **2.38** |
| `--live` text | **4.19** | 8.38 | 9.34 | **3.86** | **3.67** |
| `--ok` text | 4.96 | 9.82 | **3.21** | **2.37** | **4.16** |
| `--fault` text | 5.02 | 5.29 | **3.18** | **2.34** | **4.20** |
| `--edge-strong` mark (todo nodes, minor ticks, box outlines) | **1.82** | **2.35** | **2.38** | **2.13** | **1.73** |
| `--edge` mark (baselines) | **1.30** | **1.46** | **1.43** | **1.39** | **1.27** |
| `--fault` @0.7 mark (meter alert line) | 3.02 | 3.25 | **2.14** | **1.69** | **2.68** |

Bold = below 4.5:1 (text) or 3:1 (marks).

## Findings

### Cross-cutting (all 6)

- **[P1] Text set in `--faint` fails 4.5:1 in every theme and seed** (2.38–3.74). Scale numbers and the only names on
  Position and Diff. `--key` (5.10 film / 6.68 night) exists for small labels but isn't in the figure ink map.
  Fix: add `ky: '--key'` to TOKENS and use it for text. `cf.js:26`, `cf.js:209`; `cc.js:182`, `cc.js:210`, `cc.js:242`,
  `cc.js:338`, `cc.js:339`, `cc.js:401`; token `tok.css:77–78`
- **[P1] Information-bearing marks in `--edge-strong` (1.73–2.38)**: todo squares, position ticks, meter baseline.
  Fix: draw todo outlines in `--faint` and raise `--faint` from 45% to ~55% (3.32 film / 4.69 night), or raise
  `--edge-strong` toward 3:1. `cf.js:175`; `tok.css:75`, `tok.css:77`
- **[P1] Film lamp text 4.19:1** ("step 12 · backfill", the live time). Fix: film `--live: #8a5d05` (5.14:1). `tok.css:16`
- **[P1] Unseen instruments show false zeros.** The sweep starts on intersection, so print/PDF/full-page captures read
  `0 / 1M · 0.0%`, `1/7`, `0/15`, `0s`, with fault captions and diff numbers missing (the aria-label is right, the
  drawing isn't). Fix: skip the sweep under print and add a `beforeprint` listener that halts and renders final.
  `cc.js:96`, `cc.js:464–465`
- **[P1] No forced-colours handling for `svg[data-cal]`.** Only the preview background is forced; inline SVG inks are
  left alone. Dark system palette + film inks: done nodes nearly vanish and todo nodes keep their paper fill, so done
  and todo read reversed; night inks on a light palette nearly vanish. Fix: `@media (forced-colors: active)` mapping
  tokens to CanvasText / GrayText / Canvas / Highlight (same block as group 2's finding). The only forced-colors rule
  today is the switch's at `cc.css:501`; add the token block after `tok.css:179`.
- **[P1] 390 px: fixed SVG widths clip readings.** Hosts are 312 px, SVGs 342–446 px (90% min-width floor). Hidden until
  scrolled: meter "100%", diff "+147k", durations "15m" and "12m 40s" (shows "12m"), ruler "150k". The scrolling hosts
  become unnamed tab stops. Fix: allow scale-down (`max-width:100%; height:auto`, floor ~80%) or fall back to compact;
  name the scroller if it stays. `cc.js:69–70`, `cc.css:844`
- **[P2] Seeds don't re-derive `--muted`, `--ok`, `--fault`.** The seed UI sets only `--bg/--fg/--live`; the other three
  stay film literals (blue seed: 2.3–2.4:1; pink seed: lamp and fault both read red). Fix: derive with `color-mix()`;
  note lamp/fault hue distance in the theming docs. `tok.css:14`, `tok.css:17`, `tok.css:18`; seed UI `ref:788–790`
- **[P2] Lamp discipline holds per element, not per view.** Two meters → two lamp needles (`ref:283–284`); several
  live spans; `states` with two `live` draws two stars. Fix: needle is ink unless `live` is set; Progress and Durations
  light only the first live. `cc.js:188`, `cc.js:262`, `cc.js:412`
- **[P3] Spoken sentence uses "/" and "·"** ("46k / 1M · 4.6%"). Use "46k of 1M, 4.6%". `cc.js:166`
- **[P3] Snippets use docs-only `.row` / `.stack`** (defined `ref:120–121`, used `ref:282`, `ref:300`, `ref:315`, `ref:333`).
- **[P3] Detector `line-length` ~92 ch** in a props-table cell. `ref:288`
- PASS — accessible name: every instrument is `svg role="img"` with `aria-label` = `<title>`, stating the final value, never a mid-glide frame.
- PASS — reduced motion: final value drawn immediately, 0 Web Animations; the durations 1 s tick is a clock, not motion.
- PASS — keyboard at 1440: no tab stops inside static instruments (correct).
- PASS — no reflow during motion: widths reserved for the widest reading.

### meter
- **[P1]** Over-limit clamped and announced as full (250/100 → "100 / 100 · 100.0%"). Keep the real value in label and
  box ("140 / 100 · 140%, over by 40"), clamp only the needle, add a break mark in fault ink. `cc.js:164`
- **[P2]** `max=0` → "NaN%" and NaN coordinates (8 console errors); `value=-20` → 19 negative-width errors, box outside the SVG. Clamp value and guard max. `cc.js:164`
- **[P2]** Long label's box overflows the right edge. `cc.js:202–203`
- **[P2]** Docs: `pct` format expects fractions (`value=96 max=100` renders "9600% / 10000%"), undocumented. `ref:291`; `skills/calibrated-components/references/catalog.md:469`
- **[P3]** `warn=0` or `width=120` → labels collide. `cc.js:182`, `cc.js:198`
- **[P3]** "alert 80" should read "alert 80%". `cc.js:196`
- **[P3]** Name doesn't say the value is past the alert line (colour only). `cc.js:166`
- PASS: line-only lamp, hatch alert zone, leader to box, red only past warn, compact form.

### position
- **[P2]** `count=100000` → 5,000 ticks in 160 px (grey bar). Pick major step from n, cap tick count. `cc.js:236`
- **[P2]** Compact form has no visible reading, only a mouse-only `<title>` (same for Progress `cc.js:300` and Diff `cc.js:341`). Keep a bare `3/7`. `cc.js:246`
- **[P2]** `count=0` shown as "1 of 1"; long label clipped. `cc.js:219`, `cc.js:242`
- **[P3]** Marker clips at index 1; set `x0 = 5`. `cc.js:235`
- **[P3]** Docs list `width` as "auto"; code uses 160. `ref:308`
- PASS: label, clamping, the 24/25 switch, no lamp.

### progress
- **[P2]** aria-label drops "backfill", "1h 48m", "needs review", and says "needs attention" where the drawing says "needs review". `cc.js:301`
- **[P2]** With both `live-label` and `fault`, the fault caption is never drawn. `cc.js:297–298`
- **[P2]** `done-label` silently vanishes when done=1. `cc.js:288`
- **[P3]** `total=0` draws a green "0/0" (reads as success). `cc.js:289`
- **[P3]** Fixed 18 px step: 40 steps → 772 px, 60 → 1132 px, no scale-down. `cc.js:261`
- PASS: shape + colour, even stepping, reduced motion.

### diff
- **[P2]** Names sit ~200 px from their bars. Dotted leader or right-aligned names. `cc.js:339`
- **[P2]** `nameW` grows with the label, breaking the shared centre the docs promise. `cc.js:324`; `ref:331`
- **[P2]** `knee=0` → uncaught TypeError from `animate`. `cc.js:312` (timing `cc.js:135`)
- **[P3]** Past `max` there is no break mark. `cc.js:311`
- PASS: colour redundant with direction and sign; "no changes" state; label sentence; 0/0 and huge diffs.

### durations
- **[P1]** Code tab ships `start="1793448000000"`; pasted, it reads "running for 54h 57m", pinned at max (the page only rewrites it at runtime, `ref:1009`). Use `value=` in the template. `ref:352`
- **[P2]** A long span name turns the ruler inside out (name column eats the scale width). `cc.js:393–394`
- **[P2]** Spans over `max` clamped with no break mark. `cc.js:413`
- **[P2]** 480 px default truncates values on mobile (see cross-cutting 390). `cc.js:394`
- **[P3]** Docs say "Rounded up to 5"; code picks a nice major (7s → 8s scale). `ref:355`; `skills/calibrated-components/references/catalog.md:494`
- **[P3]** Empty element announced "Durations: "; `unit="x"` ticks read "0x". `cc.js:428`, `cc.js:388`
- PASS: shared ruler, live line + star, 1 s tick redraws without glide or blink.

### ruler
- **[P0]** `step=0`, negative `step`, or `min==max` (default step becomes 0) loops forever and freezes the tab; `step=1` on 0–1e6 hangs >15 s. The loop is `for (v = min; v <= max; v += step)` with no guard. Guard `!(step > 0) || !(max > min)` and cap tick count. `cf.js:206`; `cc.js:437`
- **[P2]** Marker has no text value; box it on a leader like Meter. `cc.js:448`
- **[P2]** Out-of-range value drawn pinned but announced raw ("marker at 200°"). `cc.js:446`, `cc.js:450`
- **[P2]** Marker uses a `drop-shadow` glow, which DESIGN.md:108 and :175 reserve for the star. `cc.js:448`
- **[P3]** `density` ignored despite "All accept density". `cc.js:436`
- **[P3]** Large values print raw ("1000000"). `cc.js:439`
- **[P3]** Docs list `step` as 10 and `width` as auto; code uses (max−min)/10 and 320. `ref:369`, `ref:371`
- **[P3]** `min > max` renders empty, silently. `cf.js:206`

## Group level

**Design specificity: high.** Built from the language's own marks (leader to a box, hatch, star, dimension line,
knee ticks, shared ruler), with authored motion (needle leads, fill trails, reading latches). What drifts is
consistency between instruments: three over-range behaviours, a ruler glow, an always-lamp needle, a ruler that
ignores density.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 2 | Unseen instruments read 0; over-limit hidden |
| 2 | Match real world | 4 | Coherent drafting and instrument metaphors |
| 3 | User control | n/a | Display-only |
| 4 | Consistency | 2 | Over-range, density and lamp rules differ per instrument |
| 5 | Error prevention | 1 | NaN, negative geometry, frozen tab from plain attributes |
| 6 | Recognition vs recall | 3 | Except ruler marker and compact forms |
| 7 | Flexibility | 3 | full/compact, `still`, `states`; no `format` on Ruler/Diff |
| 8 | Minimalist design | 4 | Diff's label gap the one weakness |
| 9 | Error recovery | 2 | No visual language for over-limit / beyond scale |
| 10 | Help and docs | 3 | Wrong defaults, undocumented `pct`, stale epoch |
| **Total** | | **24/36** | **Acceptable (67%)** |

Applicable max 36 (heuristic 3 n/a).

**Cognitive load:** low per instrument; rises where Meter shows two scales (% beside units), where Diff's log knee
needs the docs paragraph, and where compact forms hide the number in a hover tooltip.

**Strengths**
1. Every instrument has `role="img"` and a full sentence stating the final value.
2. Widths reserved for the widest reading: nothing reflows during motion; stacked diffs align.
3. Colour is never the only channel: direction and sign on Diff, shape on Progress, hatch on Meter.

**Persona red flags**
- **Sam (screen reader / keyboard):** Progress loses its captions; clipped content sits in unnamed scrollers; ruler value exists only in the label.
- **Alex (power user):** a ruler bound to live data can freeze the tab; meters understate overruns; several lamps light at once; the pasted Durations snippet shows 55h.
- **Casey (390 px):** four of six instruments clip their readings, one shows a wrong number ("12m"); compact values sit in a tooltip touch can't reach.

**Questions**
1. Ruler is the one pure scale. Is a marker that never writes its value still a Calibrated figure?
2. Should the meter needle be lamp only with a `live` attribute, so a dashboard of eight meters isn't eight lamps?
3. Should over-limit be one first-class state across all instruments (and the budget figure): a single break mark in fault ink?

## Counts

| Severity | Count |
|---|---|
| P0 | 1 |
| P1 | 8 |
| P2 | 20 |
| P3 | 17 |

P1s: faint text, edge-strong marks, film lamp text, false zeros when unseen, forced colours, 390 clipping, meter over-limit, durations stale epoch.
Shared with group 2 (fix once in tokens): faint text, lamp text, forced colours, seed derivation, edge contrast.


# Group 2 · Figures (`#figures`, demo/reference.html:379–393)

Review of the 9 recipes drawn by `skills/calibrated-figures/assets/calibrated-recipes.js` on top of
`calibrated-figures.js`. Read-only: no source file was changed. Raw assessments:
`<scratchpad>/raw/A2-figures.md`, `raw/B2-figures.md`; evidence PNG/JSON in `<scratchpad>/A2/`, `B2/`
(session scratchpad, not kept).

Checked: desktop 1440 and mobile 390, film and night, dark / saturated (navy) / pink seeds,
forced colours (light and dark OS palettes), reduced motion, and every recipe called with edge data.

## Verdicts

| Recipe | Verdict | Reason |
|---|---|---|
| lanes | polish | Clean, one lamp, honest label. Long names clip, `end > max` runs off the ruler, two `live` lanes draw two stars, missing `lanes` throws. |
| budget | polish | Reads well, but the over-budget state it exists for runs off the frame; default step prints `333.333…m`; `max: 0` throws. |
| merge | polish | Best drawing in the set. Many commits fuse into a bar, long commands clip, `commits: 0` says "1 commits", lamp spread over 3 places. |
| fanout | **rework** | A queued child is drawn and announced as **done**; the star sits on the parent, not the live child; docs show two live children. |
| loop | polish | Centre lines cut through labels; left command spills 8 px outside the viewBox; collides past ~8 stations. |
| measured | polish | No FIG. label (numbering skips); parts over `zoomMax` overrun "DETAIL A"; lamp used as a category colour. |
| timeline | polish | With `live: i`, steps after the live one draw as done and the dimension says "complete"; empty data gives "NaNs". (Kept at polish: one localized fix.) |
| matrix | polish | Docs say the callout column gets the lamp, code draws none; aria-label lists no cells; long heads collide with the FIG. line. |
| section | **rework** | The page's own example is broken (hatched region pokes through the dashed boundary into the callout column); callouts float with no leader; no lamp, no quantity. |

## Agreement between A and B

- Both found `--faint` text failing contrast, the seeds breaking `--muted`/`--fault`, the fan-out "done" lie,
  loop label collisions, the section region/callout collision, and the edge-data crashes. High confidence.
- **Forced colours, disagreement resolved:** B reported strokes, hatching and lamp survive (it tested the OS
  palette matching the page theme). A tested a dark high-contrast OS over the film theme: ink drops to 1.47:1,
  the budget "used" bar nearly vanishes and panel boxes render as cream patches. Verified in A's
  `fc-darkOS-film--budget.png`. A is right; kept at P1.
- **Severity, resolved:** B rated the film lamp text (4.19:1) P2 and the fan-out lie P2; A rated both P1.
  Lamp text is the value the reader looks at, and fan-out states something false: both P1.
- **Detector:** the static pass finds nothing in figures (JS-drawn). Static over the serialised rendered DOM:
  1 `overused-font` (Inter, docs shell) — false positive. Live in-page detector (injected, mutation preflight
  passed): 16 `tiny-text` "11px body text" on SVG `<text>` in every figure but loop — false positive, 11 px is
  the documented legend size (`calibrated.css:55`). The detector does not read SVG `fill`, so it missed the
  real contrast failures that A and B measured by hand. No console errors.

## Findings

Paths relative to the repo; line numbers checked.

### Cross-cutting (all 9 figures)

- **[P1] Faint ink used for text fails 4.5:1 in every theme** — film 2.59, night 3.58, dark seed 3.74, navy 3.14,
  pink 2.38. Affects FIG. numbers, all ruler numbers (the quantities the figure exists for), matrix row labels,
  fan-out meta, timeline step numbers. `--key` (70%, ≥4.5:1) already exists but figures don't use it for text.
  Fix: draw figure text with `--key` (or a new `--faint-text`), keep 45% `--faint` for strokes and ticks.
  `skills/calibrated-tokens/assets/calibrated.css:77`; `skills/calibrated-figures/assets/calibrated-figures.js:78`, `:113`, `:209`
- **[P1] Film lamp text is 4.19:1**, below 4.5:1 at 11 px, although the comment says it reads as text.
  Affects live box values, live station name, merge step 2, fan-out time. Fix: darken film `--live` to ≈ `#8a5c00`
  (≈5:1) and recheck the seed-derived versions. `skills/calibrated-tokens/assets/calibrated.css:16`
- **[P1] Figures ignore forced colours.** Inks are inline `var()` styles; under a dark high-contrast OS the panel is
  forced dark and film ink falls to 1.47:1; budget "used" bar disappears; boxes show as cream patches.
  Fix: `@media (forced-colors: active)` block mapping `--fg/--muted/--key` → CanvasText, `--faint/--edge` → GrayText,
  `--edge-strong` → CanvasText, `--panel/--raised/--well` → Canvas, `--live` → Highlight, `--fault` → Mark,
  `--swipe/--glow` → transparent. Only the components CSS has a forced-colors block today
  (`skills/calibrated-components/assets/calibrated-components.css:501`). Add after `skills/calibrated-tokens/assets/calibrated.css:179`.
- **[P2] `--muted`, `--ok`, `--fault` are fixed hex per theme, not derived from the seeds.** Navy seed: muted 2.41:1,
  fault 2.34:1; dark seed: muted 3.27; pink: muted 4.09, lamp 3.67. Breaks the "three seeds, everything derives"
  promise. Fix: derive them with `color-mix()` from `--bg`/`--fg` (fault/ok mixed toward a hue, contrast-checked).
  `skills/calibrated-tokens/assets/calibrated.css:14`, `:17`, `:18` (night: `:28–31`)
- **[P2] Outlines and grid lines below 3:1.** `--edge-strong` 1.7–2.4, `--edge` 1.3–1.5 in every theme; todo nodes and
  box outlines rely on them alone; section's closed/open meaning rests on a 1.3:1 hatch.
  Fix: raise `--edge-strong` toward 3:1; draw the closed hatch in faint ink.
  `skills/calibrated-tokens/assets/calibrated.css:75`; `skills/calibrated-figures/assets/calibrated-recipes.js:484`
- **[P2] Every figure scrolls sideways at 390 px.** `draw()` floors the width at 90% of natural size, so 520-wide
  figures are 504 px in a 348 px preview; the right-hand lamp boxes (lanes values, merge verdict, section callouts)
  start off-screen. The scroll area has no tabindex/role/name or scroll cue. Text also renders at 9.9 px though the
  comment promises ≥10. Fix: `.ex-prev` gets `tabindex="0" role="region"` + name and a scroll cue; longer term let
  recipes stack the callout column under the drawing at narrow widths.
  `skills/calibrated-figures/assets/calibrated-figures.js:353–356`; `demo/reference.html:91`
- **[P2] One-lamp rule not enforced.** Two `live` lanes draw two stars; fan-out allows several live children. Fix: honour
  the first `live`, warn once. `skills/calibrated-figures/assets/calibrated-recipes.js:92`, `:237`
- **[P2] Bad data fails silently or throws.** `lanes` without `lanes` → TypeError; `budget`/`measured` with `max: 0` →
  RangeError; `lanes` `max: 0` → NaN attributes; `budget` without `used` → NaN and "undefined"; `merge` without
  `branch` → "undefined"; empty `timeline` → "…at NaNs". Fix: guard inputs, return warnings (turns the
  "look once before publishing" checklist into code).
  `skills/calibrated-figures/assets/calibrated-recipes.js:88`, `:110`, `:137`, `:206`, `:354`, `:449`; `skills/calibrated-figures/assets/calibrated-figures.js:203`
- **[P3] Docs promise motion the page never shows.** Intro says figures move with `play()`; `drawAll` uses `mount()`.
  Fix: play them, or add a replay control. `demo/reference.html:381`, `:1021`
- **[P3] Code tab omits the `<script src>` lines it needs.** `demo/reference.html:1003`
- **[P3] Page calls `Calibrated.redraw()`, which doesn't exist** (harmless no-op; seeds still recolour via CSS vars).
  Fix: drop the call or add `redraw()` to the kit. `demo/reference.html:1063–1064`
- **[P3] Desktop frames are wide**: a 520-unit figure fills ~60% of its preview (drawing-quality §3). `demo/reference.html:91`
- PASS — reduced motion: 0 animations; `play()`/`crawl()` mount still (`calibrated-recipes.js:559`, `:564`, `:590`).
- PASS — accessible name: every SVG has `role="img"` and a generated `aria-label` (no `<title>`/`<desc>`, acceptable).
- PASS — type and line: all monospace, hairlines, the star glow is the only glow; dark and pink seeds keep the drawing intact.

### lanes
- **[P2]** Long names clip at the left edge. Size `x0` from measured names. `calibrated-recipes.js:87`, `:94`
- **[P2]** `end > max` draws past the ruler and through the box column. Clamp and add a break mark. `calibrated-recipes.js:93`
- **[P3]** `lanes: []` labels as "empty: ". `calibrated-recipes.js:113`
- PASS: one lamp; label states every duration; dimension lines correct.

### budget
- **[P2]** No `step` → `max/15` → labels like `333.33333333333337`. Pick a 1/2/5×10ⁿ step. `calibrated-recipes.js:137`
- **[P2]** Over-limit use runs bar and box off the right edge; near-zero use pushes boxes off the left. Over budget is
  the state this figure is for. Clamp, break mark, "over by" plate, flip boxes at the frame. `calibrated-recipes.js:134–135`, `:148`, `:155`
- **[P3]** Label reads "…30 days 1000m." — say "limit 1000m" and include the alerts. `calibrated-recipes.js:157`
- PASS: one lamp; alert labels don't collide.

### merge
- **[P2]** 40 commits fuse into a solid bar. Above ~12 draw first/last with a break between. `calibrated-recipes.js:166`, `:189`
- **[P2]** Long commands overflow both sides. Measure or truncate. `calibrated-recipes.js:202–204`
- **[P3]** Leaders 2 and 3 land on command text, not the number box; in fast-forward step 1's leader hangs from bare main. `calibrated-recipes.js:202–204`
- **[P3]** `commits: 0` says "has 1 commits". `calibrated-recipes.js:166`, `:190`
- **[P3]** Lamp on 5 elements across curve/diamond, verdict box and step-2 command. Arguably one live thing (the
  pending merge); confirm in the approval gate. `calibrated-recipes.js:188`

### fanout
- **[P1]** Every non-live child is drawn and announced as **done** ("Rebuild search index · queued · next" gets a
  filled done square and "done" in the label). Add a `state` field (todo/done/live/fault); todo = hollow node,
  announced "queued". `calibrated-recipes.js:235`, `:245`
- **[P2]** Star on the parent, not the live child; `recipes.md` example lights two live children. `calibrated-recipes.js:230`, `:235`; `skills/calibrated-figures/references/recipes.md:69–70`
- **[P3]** Long task text overflows its box and rows collide; label omits times and the folded count. `calibrated-recipes.js:237`, `:245`

### loop
- **[P2]** Centre lines (1.3 × radius) cut through "make release", "train 4 of 9", "3 · STAGE". Stop at ~1.05 × r and
  knock out behind the centre label. `calibrated-recipes.js:297`, `:306`
- **[P2]** Left station's command `deploy prod --canary` sits 8 px outside the viewBox; long names/commands clip both sides. `calibrated-recipes.js:255`, `:313–318`
- **[P3]** Radius fixed at 70: labels collide past ~8 stations (16 tested). `calibrated-recipes.js:255`
- **[P3]** Label omits done states and commands. `calibrated-recipes.js:324`
- PASS: one lamp; arrowheads show direction.

### measured
- **[P2]** No FIG. label: never calls `head(o)`, writes its own title at x 12, so page numbering skips. Use `head(o)`,
  pass `n` in page data. `calibrated-recipes.js:353`; `demo/reference.html:975`
- **[P2]** Parts summing past `zoomMax` overrun the inset and cover "DETAIL A"; 8 parts push boxes past the plate. `calibrated-recipes.js:365–366`, `:379`
- **[P3]** Default formatter turns 1 TB into "1000000M"; `parts: []` gives "…. .". `calibrated-recipes.js:331`, `:394`
- **[P3]** Docs drift: `recipes.md:112` says "drawn on a raised plate" (none drawn); "≈" added to every value
  (`calibrated-recipes.js:385`); the lamp on "uploads" reads as a category colour, not a live thing (`demo/reference.html:977`).

### timeline
- **[P1]** With `live: i`, steps after the live one draw as done and the dimension says "complete": a running job
  is shown finished. Draw todo nodes and a faint line after live; label "running". `calibrated-recipes.js:432–438`, `:446`, `:449`
- **[P2]** `steps: []` → "slowest is step 0 at NaNs". `calibrated-recipes.js:407–410`, `:449`
- **[P3]** Last ruler tick (22m) has no number. `calibrated-recipes.js:448`; `calibrated-figures.js:209`
- PASS: no lamp when nothing is live; slowest callout flips side; label states count, total and slowest.

### matrix
- **[P2]** Docs say the callout column gets the lamp; code draws a tint and ink outline. Fix the docs (a callout
  isn't live). `skills/calibrated-figures/references/recipes.md:132`; `calibrated-recipes.js:470–471`
- **[P2]** aria-label "10 rows by 9 columns" gives no cells. List hits per row or add a visually hidden table. `calibrated-recipes.js:473`
- **[P2]** Long column heads climb into the FIG. line, long row labels clip, out-of-range hits draw in empty space. `calibrated-recipes.js:456`, `:463`
- Note: B's checkout/cart overlap is a false positive (rotated-label boxes); screenshot is clean.

### section
- **[P1]** The page example is broken: hatched region (x 20–380) sticks out of the dashed boundary (right ≈ 367) into
  the callout column, because the callout column widens to fit its text while regions are fixed. A first-timer
  copies the defect. Data fix: `w: 340` for "restricted", `w: 64` for cache; recipe: warn or clamp.
  `demo/reference.html:985`; `calibrated-recipes.js:483`, `:487`
- **[P2]** "rotated" and "outside" callouts float with no leader; "outside" isn't `live` as the docs show, so no lamp. `demo/reference.html:993–995`; `skills/calibrated-figures/references/recipes.md:145–148`
- **[P2]** Breaks the kit's "three checkable values" rule; only number is "port 443". Add counts, or document section as the exception. `skills/calibrated-figures/references/recipes.md:145`
- **[P3]** 8 callouts spill outside the viewBox; `section({})` labels "empty: ". `calibrated-recipes.js:508`

## Group level

**Design specificity: high.** Centre lines, `DETAIL A 20:1` insets, numbered `$` commands, dimension lines with
the value in the gap, one amber star on hairline ink — no chart library produces this. The weakness is
robustness, not taste: six of nine recipes break on plausible data and two state something false.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 3 | Lamp marks the live thing; fan-out and timeline misreport state |
| 2 | Match real world | 4 | Drafting conventions, real units |
| 3 | User control | n/a | Static figures |
| 4 | Consistency | 2 | Measured unnumbered; lamp handling drifts from docs (matrix, section, fan-out) |
| 5 | Error prevention | 1 | No clamps or input guards |
| 6 | Recognition vs recall | 3 | Node states learned from Marks, not keyed per figure |
| 7 | Flexibility | 3 | Data in, figure out; no narrow layout |
| 8 | Minimalist design | 4 | Quiet, dense, no chartjunk |
| 9 | Error recovery | 1 | NaN labels, clipping, throws, no warnings |
| 10 | Help and docs | 3 | Precise, three drifts from code |
| **Total** | | **24/36** | **Acceptable (67%)** |

Applicable max 36 (heuristic 3 n/a). 24/36 = 67%: **Acceptable**.

**Cognitive load:** low for lanes, budget, timeline, measured; medium for merge; loop costs more (labels vs
centre lines); matrix asks you to scan a 10×9 grid with faint row labels; section is hardest (four line types,
no key; the page caption does the legend's job).

**Strengths**
- Auto labels for lanes, merge and timeline state the quantity in a sentence.
- Lamp discipline in the shipped examples is mostly exact: line, star and box on one item, never a fill.
- Merge and measured are real drafting ideas a chart library can't produce.

**Persona red flags**
- **Sam (screen reader):** fan-out label calls a queued task done; matrix label has no cells; mobile scroll areas aren't focusable or named; no table alternative.
- **Casey (390 px):** every figure scrolls sideways with lamp boxes off-screen and no cue; text 9.9 px; faint labels 2.6:1.
- **Jordan (first-timer):** copies the broken section example; follows recipes.md and lights two live fan-out children; reads that the matrix callout gets the lamp and sees none; finds measured unnumbered; reads that figures move and sees no motion.

**Questions**
1. Should a recipe ever draw broken output silently? Returning warnings on overrun would make the "look once" checklist code.
2. Section has no scale and no count. Is it a figure, or a styled diagram?
3. The scale numbers are the values the figures exist to state, yet sit at 2.6:1. Should quietness come from size and weight while numbers stay ≥4.5:1?

## Counts

P1s: faint text, film lamp text, forced colours, fan-out state, timeline state, section example.

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 6 |
| P2 | 22 |
| P3 | 16 |
