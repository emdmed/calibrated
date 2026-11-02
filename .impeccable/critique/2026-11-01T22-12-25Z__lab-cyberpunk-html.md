---
target: the cyberpunk lab page
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/home/enrique/projects/calibrated/lab/cyberpunk.html"
target_fingerprint: "sha256:1e9cb4e19ef59b70b2f904ca07da19d6d3bbbf5408f9afbb70bd1bf8ddb08e16"
target_path: /home/enrique/projects/calibrated/lab/cyberpunk.html
timestamp: 2026-11-01T22-12-25Z
slug: lab-cyberpunk-html
---
Method: dual-agent. Score 24/40 (Acceptable). Heuristics: 1:3 2:3 3:2 4:2 5:2 6:3 7:1 8:3 9:3 10:2.
Specificity: structure authored (route on clock ruler, per-lane arrival preview, live headline); neon finish is genre stock; drifted from contract (route not full width, no confirm bar).
Detector: degraded regex mode, 3 advisory colours (false positives). Overlay: 8 (glow/cyan neon intended, scanline stripes intended, caps caption false positive). Faint 11px text 4.83:1.
Priority issues:
1. [P1] Tween has no lower clamp on progress; can draw negative legs ("-190 min"). Fix: clamp, t0 from first rAF, final show(to). harden.
2. [P1] Route min-width 810 > 734 panel; end of route + table columns off-screen on mobile. Fix: full-width route, jump panel below; compact mobile route, stacked table. layout, adapt.
3. [P1] Lamp on 8+ items, not on decision panel. Fix: lamp on drone + one decision cue; badges/needles ink; .pwr on jump; in-window green everywhere. quieter.
4. [P2] Late lane confirms like good; abort doesn't change board; re-pick silently unconfirms. harden.
5. [P2] No countdown; clock minute frozen. clarify, bolder.
Minor: late-state label collisions; .acts needs flex-wrap; disabled primary weak; comms sender/message run together, framed list; empty panel space; no temperature instrument; masthead badge redundant; corner marks on mobile; switch tap target 21px.
