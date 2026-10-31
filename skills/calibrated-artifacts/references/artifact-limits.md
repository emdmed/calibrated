# Artifact limits, fonts and publishing

From the artifacts server's `pages` guide. Call `guide` (topic `pages`) once per session before the first publish: it's the source of truth and may have changed.

## The page
- One complete HTML document starting with `<!DOCTYPE html>`, with a `<title>`. Up to 16 MiB. The template is about 90 KB.
- A content security policy blocks everything except inline code, a few script CDNs, Google Fonts, and the artifact's own files. The kit needs none of the CDNs: keep it inlined.
- Images: inline SVG or `data:` URIs only. Remote images don't load.
- No `fetch` to other hosts. Put the data in the page.

## Inside the viewer's frame
- `alert`, `confirm`, `prompt`, `window.print` and downloads are blocked. Build dialogs into the page. For sign-off, use the template's `copy sign-off` button.
- `navigator.clipboard.writeText` works only from a click and can be refused. The template catches the refusal and says so.
- `localStorage` may be missing. Use it only for conveniences (a remembered density or tab), inside try/catch. Never use it for sign-off state that must last.
- Only a plain `#name` hash passes through. Use `#fig-12`-style anchors for linking sections.
- Forms have nowhere to submit. Handle the event in script with `preventDefault()`.

## Themes
The viewer sets `data-theme="light"` or `"dark"` on `<html>`, or nothing. The kit handles all three:
- `light`: film, an alias of `data-theme="film"`
- `dark`: night, an alias of `data-theme="night"`
- nothing: follows the OS. Film by default, night through the template's `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { … } }` block.

To change the night seeds for your page, override them in both `[data-theme="dark"]` and that media block.

The body background comes from `--gutter` (the desk under the panels). Don't remove it, or the host's background shows through.

## Fonts
The kit uses IBM Plex Mono and Chivo Mono, both OFL. The template links them from Google Fonts, which the artifact policy allows. This is the default, and it's all you need:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&family=Chivo+Mono:wght@300..700&display=swap">
```
If the fonts don't load, the stacks fall back to Helvetica Neue/Arial and `ui-monospace`. The figure kit measures labels with the font that actually loaded, so boxes still fit.

To self-host instead (for example, a page that must not call Google), publish with `publish_files` and put the woff2 files next to `index.html`, declared with `@font-face` as in the tokens skill's `fonts.md`.

## Publishing
- **Single file** (the default): write `<name>.html`, then `publish_files` with `[{ as: "index.html", path: "/abs/path/<name>.html" }]`, a `title` and `icon: "chart"`. Without file publishing, use `publish_version` with `content`.
- **With self-hosted fonts**: `publish_files` with `index.html` plus `fonts/*.woff2`.
- **Small fix**: `edit_version` with `slug`, `base_version` and exact `old_text`/`new_text` pairs.
- **Republish**: pass `slug` + `base_version` (from the last result). If the artifact is shared, also pass `shared_live`.
- After publishing, tell the user in one sentence what the page is, and give the link.
- New artifacts are private to the owner. Sharing is done on claude.ai, not by tools.

## Accessibility
- Every figure gets `role="img"` and an `aria-label` sentence with its facts. `mount()` and the elements do this.
- Focus is a 1px lamp outline. The keep/drop buttons use `aria-pressed`.
- Live is shown in the lamp colour, which is chosen for at least 4.5:1 on the panel, and the figure's `aria-label` says which item is live.
- `prefers-reduced-motion` turns off transitions and instrument motion. Otherwise every instrument sweeps to its value when it comes into view and glides when it changes (`still` turns that off), the live duration counter ticks, and figures mounted with `Calibrated.play` replay once when they come into view.
