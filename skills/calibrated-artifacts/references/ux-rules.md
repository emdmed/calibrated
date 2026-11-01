<!-- copied from skills/calibrated-components/references/ux-rules.md by scripts/build-artifact-template.mjs -->
# UX rules

Calibrated is a way to style a page, not a way to lay it out. A page has to work as an ordinary, well-made page first: the reader knows what it is, finds the main action and reads every number without a key. Read this before you compose a page, and run the check at the end before you deliver.

## 1 · Compose in this order
1. **The reader and their task.** Who opens this, and what do they need to do or decide? Write it as one sentence.
2. **The content and the one main action.** List the facts the reader needs and the one thing they should do next.
3. **The conventional pattern.** Pick the layout people already know: a form, a settings screen, a table with filters, a report with a summary first, a review list. Keep its usual order and placement.
4. **Only then the Calibrated parts.** Swap in a meter, a ruler or a figure where it explains a quantity faster than text. Style everything else with the plain parts: field, table, button, card.

If a Calibrated part makes the conventional pattern harder to recognise, use the plain part.

## 2 · When to draw, and when not to
- **A drawing keeps every fact in the text it replaces.** If "today" says *Basic €9, Team €29, Business €79*, the drawing shows all three names and all three prices. A drawing with fewer facts than the sentence is a regression. Keep the sentence.
- **Label in place.** Put names and values next to the mark they belong to. Don't make the reader decode a legend, a hatch pattern or a colour code to find the answer. When a pattern has a meaning (hatched = closed), say it in words on the figure as well.
- **Exact values to compare → a table.** Prices, limits and settings people copy or compare stay in a table or a list. Draw alongside it if the drawing adds proportion or position.
- **Processes show direction.** A cycle or a pipeline has arrows or numbered steps, so it's clear where it starts and which way it runs.
- **One idea per figure.** If a figure needs a paragraph to explain how to read it, it's the wrong figure. Split it or use text.
- **Don't draw what has nothing to measure.** A status, a name or a yes/no is text.

## 3 · Actions
- **One primary action per view**, as `.cal-btn.primary` (boxed). Put it where people look for it: bottom right of a form, dialog or card, or top right of a screen for a page-level action.
- **Verb labels** that say what happens: "Send for approval", "Save changes", "Delete key". Not "OK" or "Submit".
- **Secondary actions** sit beside the primary as default (boxed) buttons. Cancel and back use `.quiet`, on the side away from the primary. Bracketed `.inline` words are only for small actions in running text ([copy], [show]).
- **Three tiers, never one.** If every action on a screen looks the same, the reader can't find the main one. One filled primary, a few boxed defaults, the rest quiet or inline.
- **Destructive actions** use `data-ink="fault"` and ask for confirmation in a `.cal-dialog` that names the thing being destroyed.
- **Menus** show ▾ and open on click. Every clickable thing looks clickable: a button, a link underline or a boxed control, never plain caps text.
- **Disabled buttons** say why nearby ("Add a VAT number to continue").

## 4 · Forms
- A label above every field, in sentence case ("Expires on", not "EXPIRES ON"). Mark the few optional fields "(optional)" rather than starring the many required ones.
- Units and currency sit next to the value: "€ 64", "150 000 msg / month". Don't push the unit to the far edge from the number.
- Dates, numbers and money use the reader's locale and a format they can't misread (`30 Jan 2027`, not `01/30/2027`).
- Helper text speaks to people: "Up to €64, the order total." Not "↑ ↓ steps by 1".
- Errors show inline under the field, in plain words, and say how to fix it. Keep what the user typed.
- Prefer native controls (`select`, radio, checkbox, switch). Use the detent or the range only when the scale itself matters (a frequency, a threshold). An on/off setting is a switch with its label on the left.
- Long forms go in steps (`.cal-steps`) with a review step before sending. Group related fields under a short heading.
- The textarea's editor status line (`data-status="editor"`) is for code and commit messages. A normal note shows only its character count.

## 5 · Words
- Plain language first. Write for the person who uses the page, not for whoever built it.
- **Drafting terms belong to document pages only.** FIG numbers, SHEET n/N, REV letters, DETAIL A 20:1, title blocks and stamps fit spec sheets, review boards and explainers, where readers cite them. App screens, forms and dialogs leave them out: put `data-mode="app"` on the screen and don't call `K.fig`.
- Headlines state the answer: "CI is at 82% with ten days left", not "CI usage overview".
- Counts aren't zero-padded unless they change live (`data-pad="2"`). Tabs say "Members 12", not "MEMBERS 012".

## 6 · Hierarchy and legibility
- Caps are for short labels: section heads, tags, table heads, buttons. Field labels, helper text, body and anything longer than four words stay in sentence case.
- Anything people click or fill in is at least 12px (`--fs-control`). Figure legends never go below 10px.
- Each view reads in four steps: the headline, section heads (16px medium), block heads (`.cal-block-h`, 12px medium caps in ink), then labels and scale numbers (11px, muted). If everything is caps at the same size, nothing leads: raise the headline, quiet the metadata.
- **Separate the groups.** A panel that holds several kinds of thing (instruments, a figure, a table, notes) gives each a `.cal-block` with a head; the blocks are ruled apart. Whitespace alone isn't enough on a busy page.
- Panels sit on a visibly darker desk. Don't lighten the desk or nest panels of the same tone.
- Put metadata (dates, ids, sources, versions) at the edges and in muted ink, never between the reader and the content.

## 7 · Colour meaning
- Red (`fault`) means wrong, over a limit or removed. Never use it for approval or for decoration.
- Green (`ok`) means passed, done or approved: `<span class="cal-stamp" data-ink="ok">approved for use</span>`.
- The lamp marks the one live or current thing per view. It isn't a highlight colour.
- Don't rely on colour alone. Pair it with a word or a mark (✓, ×, a status label).

## 8 · Check before you deliver
Render the page (headless Chromium with `--force-prefers-reduced-motion`), look at the screenshot and answer each question. Fix anything that fails.

1. **Five seconds:** can someone tell what this page is and what state things are in from the headline and the first screen?
2. **Main action:** is there one filled primary, does it stand out from the other buttons, and is it where they'd look?
3. **Figures:** can each figure be read without the text beside it? Does it keep every fact of the sentence it replaces? Is direction clear?
4. **Words:** is there jargon a non-engineer wouldn't know (vim modes, SHEET/FIG on a form, internal ids in the headline)?
5. **Hierarchy and separation:** can you see the four type steps, and where one group ends and the next begins?
6. **Conventions:** do the colours mean what people expect, are the units next to the values, and are dates unambiguous?
