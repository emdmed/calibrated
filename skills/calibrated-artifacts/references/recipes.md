<!-- copied from skills/calibrated-figures/references/recipes.md by scripts/build-artifact-template.mjs -->
# Recipes

Each recipe takes plain data and returns `{ w, h, markup, label }`.
`Calibrated.mount(svg, result)` sizes the svg and draws into it. `Calibrated.render(result)` returns an `<svg>` string. If you don't pass a `label`, the recipe writes one from the data. Pass one yourself when you can say it better.

| recipe | use it for | replaces |
|---|---|---|
| `lanes` | several runs compared on one time ruler | per-item "done · 4m 12s" lines |
| `budget` | a limit, alert thresholds, current use and projected pace | "612/1000 min · alerts at 80% and 95%" |
| `merge` | a branch, its commits, how it lands and the commands | "merge commit" + a block of commands |
| `fanout` | one parent with children, some live | dot-and-metadata rows |
| `loop` | a repeating cycle of stations with the current one lit | "build ► test ► stage ► ship" |
| `measured` | a small amount on a huge scale, broken into parts | "46 GB of 1 TB · 18% saved" |
| `timeline` | consecutive steps with durations, slowest called out | "10/10 steps · complete in 21m 46s" |
| `matrix` | which items touch which things | lists of services per release |
| `section` | nested regions: what's inside, closed or outside | a list of rules |

---

### lanes
```js
recipes.lanes({
  n: 1, title: 'load test · v2.4 · 3 regions',
  max: 10, unit: 'm', step: 1, every: 5,           // ruler
  lanes: [
    { name: 'us-east',  end: 4.2,  label: '4m 12s', box: ['p99 212 ms', '0.02% errors'] },
    { name: 'eu-west',  end: 6.67, label: '6m 40s', box: ['p99 230 ms', '0.03% errors'] },
    { name: 'ap-south', end: 8.08, label: '8m 05s', live: true, box: ['running', '40% of traffic'] },
  ],
  w: 520, labelW: 70,
})
```
Moves with `Calibrated.play(svg, recipes.lanes, data)`: the lanes replay along the ruler and latch in the order they finished. `end` is in ruler units; with `unit` `s`, `m` or `h` the time above each lane counts up as it grows.

Lanes start at 0. A live lane is drawn in lamp, ends in the lamp star and has a dashed tail to the end of the ruler; its box gets a lamp outline and a lamp value. Height grows by 46 per lane.

### budget
```js
recipes.budget({
  n: 2, title: 'error budget · checkout · 30 days', max: 1000, step: 50, every: 4,
  used: 612, at: 'day 19', pace: 900,
  fmt: (v) => Math.round(v) + 'm',
  alerts: [{ v: 800, label: 'alert 80%' }, { v: 950, label: '95%' }],
  paceLabel: ['at this pace by day 30', '≈ 900m · 80% on day 25'],
})
```
Everything above the first alert is hatched in fault red. Pace is a dashed lamp line ending in an open ink circle, with a lamp-outlined box. Work out the pace yourself (used ÷ elapsed × period). Use `unit` instead of `fmt` for simple suffixes.

Moves with `Calibrated.play(svg, recipes.budget, data)`: the used bar fills, then the pace line runs on from it. Each latches as it lands, and the alert the pace crosses blinks.

### merge
```js
recipes.merge({
  n: 3, title: 'merge · release/2.4 → main', base: 'main', branch: 'release/2.4',
  commits: 5, baseAhead: 1,                 // 0 → fast-forward
  files: ['9 files', '+212 −38'],
  steps: ['git switch main', 'git merge --no-ff release/2.4', 'git tag v2.4.0'],
})
```
The merge to come is lit by the lamp: the dashed merge curve, the merge node, the verdict box and step 2's command. Step 1 hangs under the base, step 2 under the merge node and step 3 above the branch tip. The lamp-outlined verdict box says "merge commit" or "fast-forward" (override with `verdict: [l1, l2]`). `noun` renames what the dimension over the commits counts (default `commits`).

Moves with `Calibrated.play(svg, recipes.merge, data)`: main and its marks hold still, the branch draws in as one stroke from the fork to the merge with its commits appearing as it reaches them, then the branch name, boxes and commands appear together.

### fanout
```js
recipes.fanout({
  n: 4, title: 'ingest · scheduler · 4 workers', root: ['scheduler', 'queue · 12m'],
  children: [
    { task: 'resize product images', meta: 'worker 3 · 1 204 jobs', time: '1m 02s', live: true },
    { task: 'rebuild search index', meta: 'worker 1 · 88 jobs', time: '0m 41s', live: true },
    { task: 'expire stale sessions', meta: 'done · 9 340 rows', time: '2m 10s' },
  ],
  folded: '+1 finished earlier',
})
```
Live branches are drawn in ink with a started node and a lamp time. Finished ones settle to faint. The parent's node is live while any child is. Fold old ones into the count.

Moves with `Calibrated.play(svg, recipes.fanout, data)`: the parent holds still, its branches grow out together with each child node appearing as its branch arrives, then the child boxes and their text appear.

### loop
```js
recipes.loop({
  n: 5, title: 'release train · v2.4', center: 'train 4 of 9',
  stations: [
    { name: 'build', cmd: 'make release', state: 'done' },
    { name: 'test', cmd: 'make test-e2e', state: 'live' },
    { name: 'stage', cmd: 'deploy staging' },
    { name: 'ship', cmd: 'deploy prod --canary' },
  ],
})
```
Takes 3–6 stations, placed clockwise from the top. A done station is a solid square with a green ✓ name, a todo station a hollow square with a muted name. A `fault` station (a halted run) is a red square with a red name. In the step form, a station with `skip: true` stays open when the live one is past it (a detour not taken). An edge leaving a done station is drawn in ink. The live station is a live node, and its command gets `$ `.

Moves with `Calibrated.play(svg, recipes.loop, data)`: the frame and nodes hold still, the done edges trace clockwise up to the live station, then the names and commands appear.

To step through it, give `at` (the live station's index) instead of states, plus `lap`, `laps` and `center` as a function of the lap. `recipes.loop.step(data, 1)` (or `-1`) returns the next data, or null at the first and last lap; play it to animate the step:
```js
let train = { ...data, at: 1, lap: 4, laps: 9, center: (lap) => `train ${lap} of 9` };
forward.onclick = () => { const next = recipes.loop.step(train, 1); if (next) { train = next; Calibrated.play(svg, recipes.loop, next); } };
```
Forward traces the next edge with the star riding its tip; back retracts it. Past the last station the lap closes and the loop clears for the next train. Replaying a stepped data object replays the step; drop `from` to replay the entry.

### measured
```js
recipes.measured({
  title: 'storage · bucket assets', max: 1e12, zoomMax: 5e10, factor: 20, detail: 'A',
  fmt: (v) => (v >= 1e12 ? v / 1e12 + ' TB' : Math.round(v / 1e9 * 10) / 10 + ' GB'),
  parts: [{ label: 'originals', value: 41.4e9 }, { label: 'thumbnails', value: 3.1e9, ink: 'mu' }, { label: 'uploads', value: 1.5e9, ink: 'lv' }],
  plate: ['DEDUP SAVED', '18% · 9.1 GB'],
})
```
Drawn on a raised plate. The row of part boxes starts at x 92, or as far left as the inset's edge when the boxes and the plate wouldn't fit `w`. The inset is labelled `DETAIL A  20:1` (`detail` sets the name, default `'A'`; `factor` defaults to `max / zoomMax`). A part with `ink: 'lv'` is filled in lamp on the inset bar and gets a lamp value in its box. Good as a tooltip. `zoomMax` must cover the sum of the parts.

Moves with `Calibrated.play(svg, recipes.measured, data)`: the used bar fills, the projection drops to the inset, the inset fills through the parts with each part's box flashing in as the fill passes it, then the label and plate appear. When the values change, play the new data with `prev` set to the old values (`{ ...next, prev: old.parts.map((p) => p.value) }`): the bars, dots and leaders glide to the new values, the box values count, and the boxes that changed blink. The plate is your text, so update it yourself.

### timeline
```js
recipes.timeline({ n: 6, title: 'migration · orders db · 10 steps', steps: [61, 95, 120, 130, 88, 250, 140, 160, 110, 152], slowLabel: 'slowest · backfill' })
```
Steps are in seconds. The ruler picks its tick (1s up to a day) so it holds at most 40 ticks, numbers every 5th and ends at the tick after the total: a 20-minute run reads in minutes, a 28-hour one in hours. Set `live: i` (0-based) to mark a running step, `totalLabel` to rename "complete", `slowest: false` to skip the callout. `names` labels each step (default 1…n) and `noun` names them in the callout and label (default `step`, e.g. `chunk`). Step numbers that would touch a neighbour are skipped; the last always shows.

Moves with `Calibrated.play(svg, recipes.timeline, data)`: the ruler holds still, the line runs out through the steps at an even pace with each node and number latching as it is reached (a live step's star rides the tip), then the dimension and the slowest callout appear.

### matrix
```js
recipes.matrix({
  n: 7, title: 'services by release', cols: ['gateway', 'auth', 'checkout', …], rows: ['2.1', '2.2', …],
  hits: [[0], [1], [1, 2, 3], …],                     // column indexes per row
  callout: { col: 0, l1: '3 releases touch gateway', l2: 'test 2.1, 2.7, 2.8 together' },
})
```
Column heads are rotated −50°. The callout column gets the lamp, never more than one.

### section
```js
recipes.section({
  n: 8, title: 'network · prod vpc', boundary: { label: 'egress through proxy only' },
  regions: [
    { x: 20, y: 38, w: 360, h: 190, kind: 'hatch', label: 'restricted' },        // closed
    { x: 40, y: 70, w: 230, h: 146, kind: 'clear', label: 'app subnet' },        // open
    { x: 132, y: 76, kind: 'island', label: 'secrets' },                       // closed inside open
    { x: 56, y: 132, w: 196, h: 68, kind: 'strong', label: 'api service', sub: 'read-write · port 443' },
    { x: 290, y: 132, w: 76, h: 52, kind: 'dotted', label: 'cache', sub: 'ephemeral' },
  ],
  callouts: [{ at: [350, 56], l1: 'closed', l2: 'restricted, secrets' }, { l1: 'outside', l2: 'batch jobs', live: true }],
})
```
You place the regions yourself. Draw outer regions first. Callouts stack in the right column, 54 units apart. Things outside the boundary are what it doesn't cover: say so in a `live: true` callout, which gets the lamp.

## Designing a new figure
1. Write the sentence the figure replaces. That sentence becomes its `aria-label`.
2. Choose the one scale (time, size, share, count) and draw it with `K.ruler`.
3. Place the measured things as spans, nodes or regions on that scale.
4. Box only the values a reader needs, and lead to them.
5. Light the one live thing with the lamp (ink `lv` or a `live` node).
6. Add the FIG. label. Then check the compact form: remove the boxes, leaders and scale numbers. Does it still read?
