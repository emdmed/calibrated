# Critique ignore list

Findings to drop silently on later critique runs. One entry per line: target · rule or finding · reason.
Added 2026-11-02 from the reference-page review (`.impeccable/review/reference/findings.md`).

- demo/reference.html · detector `side-tab` on `.cal-card[data-state="dropped"]::before` · intended hazard band ("taped off" drafting mark)
- skills/calibrated-components · detector `repeating-stripes-gradient` on `.cal-rule`, fault hatch, dropped band, range ticks · intended drafting line types
- skills/calibrated-figures · detector `tiny-text` on 11px SVG `<text>` · documented legend size (`--fs-legend`)
- skills/calibrated-components · detector `tiny-text` / `undersized-ui-text` on `.cal-steps .s` (10px) · within DESIGN.md's 10px legend floor
- skills/calibrated-components · detector `codex-grid-background` on the range track and `.word.ruled` scale · they are measurement rulers
- demo/reference.html · detector `overused-font` (Inter) · docs shell only, not the kit
