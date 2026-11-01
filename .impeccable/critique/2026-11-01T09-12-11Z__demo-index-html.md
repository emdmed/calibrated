---
target: demo/index.html section separation
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
target_identity: "file:/home/enrique/projects/calibrated/demo/index.html"
target_fingerprint: "sha256:1214121d79b1d9a5a30a8157fe9427c2eb5cb027e276a41d24afeb808d68cca1"
target_path: /home/enrique/projects/calibrated/demo/index.html
timestamp: 2026-11-01T09-12-11Z
slug: demo-index-html
---
# Critique: demo/index.html (section separation)
Method: dual-agent. Score 21/32 (7, 10 n/a). P1 x4, P2 x1.

Heuristics: 1=3, 2=3, 3=3, 4=2, 5=3, 6=2, 7=n/a, 8=2, 9=3, 10=n/a.

Priority issues
- [P1] No desk: body and .ba share var(--bg) (index.html:18, :45), so examples sit on the page plane; specimen cell rules are removed (index.html:199-204). Fix: body on --gutter, examples on --panel with padding.
- [P1] Section gap 52px (36 at 390) vs 36px inside-section row gap: ratio 1.4 (1.0 on mobile). Fix: main > .cal-sec margin-top clamp(72px,9vw,128px); head margin-bottom 28px; ask line closes section with hairline.
- [P1] Dead bands inside examples: .ba takes taller plain height; section 5 has a 127px hole, section 3 57px, then only 52px to next head. Fix: take hidden plain layer out of flow.
- [P1] Mobile: inline --cols:3/--cols:4 override kit breakpoints; 75px-wide marks, unreadable legends; sticky bar 88px > scroll-padding 76px.
- [P2] Parts: "the eight marks" legend 28px below grid (< 36 row gap), 12px above its grid; Parts has no headline or ask line, so it runs into Motion's 28px caps headline.

Detector: 48 CLI advisories (44 on the intentional .plain layer); browser 41 at 1440 (heading-rhythm x8 on #marks, all-caps heads, tiny text; text-occlusion is the wipe stack, false positive).
