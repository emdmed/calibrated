# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Pure CSS + vanilla JS (classic scripts, custom elements). No build step, no framework, no dependencies. Packaged as Claude Code skills in a plugin marketplace repo.

## Users
Agent-first. The primary user is an agent (Claude) that reads the skills; the people it serves are non-technical or barely technical. They ask Claude for artifacts and UIs (reports, review boards, explainers, spec sheets, app screens) and want them to come out with a polished, technical look. Developers adopting the kit by hand are a secondary audience, served by demo/reference.html and the skill references.

## Product Purpose
Calibrated is a design language and kit that draws a count, a position, progress, a size, a duration or a structure as a small technical figure. Success: a reader understands the state at a glance, and any team can adopt the look in their own product.

## Positioning
Not a chart library and not a component library: a drawing grammar. Eight marks (leader + boxed value, ruler, dimension line, inset, hatch, nodes, numbered command, FIG. label), one scale per figure, a full form (scales, boxes, leaders) and a compact form (marks only). A figure replaces text the UI already shows, from data it already has.

## Operating Context
Used inside other people's products and inside Claude artifacts (sandboxed single-file pages, viewer sets data-theme light/dark). Must work from file://, inline, with system fonts.

## Capabilities and Constraints
- Seed-based theming: a few seed colours, everything else derived.
- API names are fixed: `cal-*` classes, `<cal-meter>`, `<cal-position>`, `<cal-progress>`, `<cal-diff>`, `<cal-durations>`, `<cal-ruler>`, `<cal-spin>`, `Calibrated.K`, `Calibrated.controls/toast/pager`, recipes.
- Fonts cannot be bundled unless their licence allows; system fallbacks must hold up.

## Brand Commitments
- Name: Calibrated.
- The eight marks and the full/compact forms are the product's core and stay.
- Origin: extracted from a design proposal for Lirah. On 2026-10-31 the owner chose that board's look as the default: quiet panels on a desk, all-monospace type, hairlines, and an amber lamp (line, text, outline, a small star node) for the one live thing. It replaced the high-contrast drafting sheet and yellow highlighter. Calibrated still keeps its own identity inside that look: its own seeds (not Lirah's "rivendell" values), its own fonts (IBM Plex Mono and Chivo Mono, not Typestar OCR, Departure Mono or Grenze Gotisch), the ruled mark (the star is a node, never the logo), no blackletter wordmark, and no Lirah example content (agents, chunks, auto-pilot, model race).
- Defaults, not a uniform (2026-11-02): generated pages kept coming out identical, so the look became five settings chosen per subject (palette, headline face, frame, layout, space), with at least two changed from the defaults. The grammar stays fixed. Headings may take one grotesk or condensed sans face; everything else stays monospace. Palettes come from the subject, not from a preset list.
- Avoid: editorial cream + italic serif + terracotta.
- The demo page (demo/index.html) is a showcase for non-technical visitors, built from the kit's own components (masthead, intro, ruled numbered sections, specimens) so Calibrated itself is the star: full-width example pages, each with a Plain / Calibrated before-and-after switch and the sentence that asks Claude for it, then parts, finishes and install. Revised 2026-11-09 (owner: "more minimalistic, more whitespace"): the home keeps two examples (status page, review board) under a one-column hero with the install lines; the six whole pages, motion and parts live on demo/examples.html. A bold red catalog and a busier catalog chrome were tried and rejected. Its job is to impress and get shared; install is secondary. The developer docs live at demo/reference.html. Chosen 2026-10-31, replacing the earlier docs-site demo, which read as bland.

## Evidence on Hand
No customers, testimonials or benchmarks. Example data in the demo and template is illustrative and must be labelled as such.

## Product Principles
1. A figure replaces text, never decorates it.
2. Adaptable before distinctive: the identity must survive being re-seeded into someone else's brand.
3. Works everywhere plain HTML works.
4. Accessible by default: every figure states its facts in words.
