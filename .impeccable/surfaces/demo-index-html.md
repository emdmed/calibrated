---
version: 1
slug: "demo-index-html"
primary_target: "demo/index.html"
related_targets: []
---

Scope: demo/index.html only, rebuilt as a showcase. The previous docs page moves to demo/reference.html (unchanged world, linked from the showcase). Mode: persuade (success = impressed and shares).
Audience: non-technical or barely technical people who ask an agent (Claude) for artifacts and UIs and want them to look polished and technical. Job: see what their pages will look like, believe it, install it in seconds, share the link. Install is a first-viewport action (revised 2026-10-31, owner: "people should be able to install it easily and fast"): the two plugin lines with [copy] sit in the intro's right column, [install] and the GitHub link sit in the top bar, and Get it at the foot keeps every method.

## Direction contract
THESIS: Calibrated sold like a precision-tool catalog: every artifact type is a numbered catalog item with a plate, a part number, a spec table and the sentence that orders it. Refuses the docs site and the dev-tool landing hero.
OWN-WORLD (revised twice 2026-10-31; user: "too much noise, the star must be calibrated's own components and style"): the page is assembled from the kit itself (cal-mast with the ruled wordmark, cal-intro, numbered cal-sec strips, cal-specimens, cal-tiers, cal-btn, cal-foot) on the kit tokens. Custom chrome is limited to the Plain/Calibrated layering. No index rail, balloons, feature lists or order boxes. Examples stand unframed on the sheet (no frames, figure borders or caption strips; page-level grids open); only components that are ruled by nature (cards, tables) keep rules.
STORY: the visitor sees finished reports, review boards, explainers and spec sheets, flips them Plain ↔ Calibrated, tries a brand finish, copies the order sentence, shares.
FIRST VIEWPORT: kit masthead (mark, ruled wordmark, caption, plain/calibrated pair, [install], github, theme); cal-intro headline and lede left, the install order (two lines, [copy], github, other ways) and the plain/calibrated switch right; the live status example full width below. Sheet 7 · Motion shows the instruments gliding ([new values]), the loop stepping and the measured figure resizing; example figures replay via Calibrated.play as each plate calibrates.
FORM: pick (position 1 of 7), seed df87a6b5. Signature: one Plain ↔ Calibrated switch flips every plate.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Revision 2026-11-09
Owner: "more minimalistic, more whitespace, leave a couple of examples in the main page and the rest in examples". Home is now: quiet bar (mark, wordmark, examples, reference, github, theme; hairline only once scrolled), one-column hero (headline, lede, install lines), the plain/calibrated + soft/strong row, two plates (status page, review board), a link block to examples, a short Get it, foot. Chapter gaps clamp(120px, 16vw, 220px). Catalog plates 1 and 3–6 were dropped (examples.html has a whole page of each type); Motion and Parts moved to examples.html as sections 7–8; the Looks sheet was dropped (examples has its own chosen-looks switch).
Same day, examples.html got the same treatment: one-column hero (headline, lede, chosen looks / all default), a plain two-column index in place of the table, section heads without numbers or counters, each example's pasted data and parts list folded under "how it's made", and "Make your own" cut to one install block.
