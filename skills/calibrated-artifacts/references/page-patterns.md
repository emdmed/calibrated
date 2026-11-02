# Page patterns

The first four page types are documents people read and cite. They usually run **intro (headline beside a short lede) → sections → foot**, with a mast when the page belongs to a product or a set. They differ in what the sections hold, and the look (palette, headline face, frame, layout, space) comes from the subject: see `looks.md`. The section lists below are the usual content, not a fixed order; drop or merge sections the subject doesn't need. Wrap the page in `.cal-sheet` with zones and add a title block only when it needs drawing numbers and approvals.

## 1 · Proposal / review board
*"Here are N changes. Look at each, keep or drop."* This is the template's page.

- **Headline**: what this round decides. The mast carries the version and date; the foot carries the drawing number and revision.
- **1 · Marks**: a specimen grid of the marks this page uses (optional on later rounds).
- **2…**: one `cal-card` per item. The info column has the title, *why*, `where / replaces / data`, and the drawing-number strip at the foot. The stage has `cal-compare` with **today** (a `cal-note` of the current text) and **drawn** (the figure). **Drawn keeps every fact today has**: if today lists three plans with prices, the drawing labels all three with their prices. A drawing that loses facts is a worse proposal, not a better one. The card ends with `cal-sign` keep/drop, plus rework (with a note line) when the board will have another round. Dropped cards are stamped SUPERSEDED, rework cards REWORK.
- **Later rounds**: keep the drawing numbers. Mark reworked cards with a `.cal-rev` triangle in the `.id` line, quote the reviewer's note in the info column, and start kept cards already pressed keep (`data-v="keep" data-state="ok"` and `aria-pressed="true"`), so only the reworked ones need a decision.
- **Shared parts**: when several items reuse one part, show it once with **full** and **compact** rows (use `K.tag(y, 'FULL')`).
- **Roll-out**: a `cal-table` of every item, with figure, where, new data needed, effort ■□□ and status.
- **Tiers**: what's next, and what to leave alone.
- **Revisions**: a `cal-revs` table when the board has been through rounds; mark changed cards with `.cal-rev`.
- **Tally**: a `cal-tally` (add `.sticky` to pin it) with `n of N signed` and `copy sign-off`.

## 2 · Explainer / drawing set
*"How does X work?"* There's no sign-off. Each section answers one question with drawings that measure the answer.

- **Headline**: the question and a short answer, two or three lines beside the title. Not a hero: the first drawing goes on the first screen.
- Sections in reading order. A section holds `cal-card`s without `cal-compare` (the info column: number, title, *why*, `cal-kv` facts such as `input` / `output` / `cost` / `source`; and a stage the figure fills), or a full-width `cal-figure` with a caption for a wide drawing, or a `cal-grid` of figures. Explainers often read best on `data-frame="paper"` with `data-space="open"`.
- **Show direction.** A cycle or a pipeline numbers its steps or draws arrows, so the reader sees where it starts and which way it runs.
- **"How it works" isn't a flowchart.** Find what each part measures (how long it takes, how much it holds or passes, how many there are, what it can't reach) and draw that: `timeline` or `loop` for stages, with durations as dimension lines; `fanout` for hierarchies, with counts; `section` for boundaries, with hatch for what's out of reach; `merge` for branches; `matrix` for which-touches-what; `measured` for a total and its parts. A part with nothing to measure goes in the info column as text.
- Give the reader one worked example with real numbers (one request, one file, one run) and draw that, instead of an abstract box per component.
- End with a **legend** section: a specimen grid of only the marks used.

## 3 · Status / report
*"Where are we?"* Summary first, then detail.

- **Headline**: the one-line state, with the live thing in lamp (`<span class="live">`).
- **1 · Now**: instruments in a panel (`.cal-panel`): `cal-meter` against limits, `cal-progress` for pipelines, `cal-durations` for runs, and `cal-count` for queues.
- **2 · Detail**: `lanes`, `budget`, `timeline` figures, often side by side in a `cal-grid`.
- **3 · Roll-up**: a `cal-table` with `cal-diff` cells (full density, so the +/− numbers show) and `.st` statuses.
- No sign-off. The title block and foot show when the data was taken.

## 4 · Spec sheet
*"What is this thing?"* Dimensions, limits and rules for one object (an API, a network, a service).

- **Headline**: name and one-line purpose. Version and revision go in the title block.
- **1 · Section drawing**: the `section` recipe for what's inside or outside, closed or open. A spec can be one large drawing with its limits and notes beside it, instead of a run of cards.
- **2 · Limits**: `budget` or `cal-meter` per limit, with thresholds as fault lines.
- **3 · Commands**: a `merge`-style figure, or nodes with `K.cmd` in run order. Repeat the commands as selectable `<pre class="cal-pre">` text.
- **4 · Table**: parameters (`cal-table` with `.num` columns).
- **Revisions**: a `cal-revs` table, with `.cal-rev` triangles beside changed values.

## 5 · App screen / form
*"Do this task."* A settings screen, a form, a dialog, a list with actions. It's a tool, not a document.

- Put `data-mode="app"` on the screen. No sheet numbers, no FIG labels, no title block, no revision triangles, no stamps.
- Use the layout people already know: breadcrumb or title at the top, fields in a column or a two-column grid, the primary action bottom right.
- **One boxed `.cal-btn.primary`** with a verb label. Cancel is `.quiet`, on the other side.
- Field labels above fields, in sentence case. The unit or currency sits next to the value. Dates in an unambiguous format.
- A long form goes in `.cal-steps` with a review step. Errors show inline in plain words.
- Instruments are welcome where they measure something the user acts on (usage against a limit, an alert threshold on a range), but every other control is the plain one.
- Textareas show only their character count. The editor status line (`data-status="editor"`) is for code.

## Choosing the drawing

| the text says… | draw |
|---|---|
| "us-east done in 4m, eu-west in 6m, ap-south running 8m" | `lanes` |
| "612 of 1000 min used, alerts at 80% and 95%" | `budget` (or `<cal-meter>` inline) |
| "46 GB of 1 TB; 41 GB originals, 3 GB thumbnails, 1.5 GB uploads" | `measured` |
| "train 4 of 9: build → test → stage → ship" | `loop` (cyclic) or `<cal-progress>` (linear) |
| "5 commits, main moved on, will run: …" | `merge` |
| "scheduler with 4 workers, 2 running" | `fanout` |
| "10 steps, 21m 46s, step 6 slowest" | `timeline` |
| "these services change in these releases" | `matrix` |
| "open: X; closed: Y; not covered: Z" | `section` |
| "+184 −20" | `<cal-diff>` |
| "3 of 7" | `<cal-position>` |
| "2 running" | `.cal-count` with `data-ink="live"` |

| "A sends to B, which calls C" | not boxes and arrows: a `timeline` of the steps with how long each takes, or a `fanout`/`section` with counts and boundaries |

Prices, plans or settings that people compare or copy stay in a table. A ruler of prices only works when each mark is labelled with its name and price.

If none of these fits, draw by hand with the marks (see `marks.md`). Start from the sentence, choose the one scale, place spans and nodes on it, box only the values needed, then light one thing with the lamp.

## Numbering
- Sections: arabic numerals (`1 · Marks`), with the sheet number in the head (`sheet 1/6`).
- Cards and figures: two-digit drawing numbers (`01`) that match `FIG.1`. Never renumber after sharing, because readers cite them.
- Revisions: capital letters (`A`, `B`, `C`), in the revision table, the title block and beside what changed.
- Shared parts in a proposal: `P0`, `P1`, ….
