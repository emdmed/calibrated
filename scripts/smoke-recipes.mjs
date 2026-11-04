#!/usr/bin/env node
/* Smoke test for the figure recipes: draws each one at both weights, at the start, middle and end
   of its motion, and fails if a figure has no size or its SVG holds NaN, undefined or Infinity.
   It runs without a browser, so it can't see the instruments or the CSS.
   Run before each release:  node scripts/smoke-recipes.mjs */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('../skills/calibrated-figures/assets/calibrated-figures.js');
require('../skills/calibrated-figures/assets/calibrated-recipes.js');
const { recipes } = globalThis.Calibrated;

/* each case reaches the edge branches: over max, a live and a failed item, a callout, a plate */
const cases = {
  lanes: { n: 1, title: 'lanes', max: 10, lanes: [{ name: 'a', end: 4, box: ['done', '4m'] }, { name: 'b', end: 12, live: true, box: ['live', '12m'] }] },
  budget: { n: 2, title: 'budget', max: 100, used: 120, pace: 150, at: '16:20', alerts: [{ v: 80, label: 'warn' }] },
  merge: { n: 3, branch: 'feat', commits: 15, baseAhead: 2, files: ['3 files', '+40'], steps: ['git switch main', 'git merge --no-ff feat', 'git branch -d feat'] },
  fanout: { n: 4, root: ['parent', 'run'], children: [{ task: 'a', state: 'live', time: '1m' }, { task: 'b', state: 'fault' }, { task: 'c' }], folded: '+3 more' },
  loop: { n: 5, stations: [{ name: 'plan', state: 'done' }, { name: 'build', state: 'live', cmd: 'make' }, { name: 'test' }], center: 'lap 2' },
  measured: { n: 6, max: 1000, zoomMax: 200, parts: [{ label: 'a', value: 60 }, { label: 'b', value: 60, ink: 'lv' }], plate: ['used', '120'] },
  timeline: { n: 7, steps: [3, 10, 2], live: 1 },
  matrix: { n: 8, cols: ['a', 'b'], rows: ['r1', 'r2'], hits: [[0], [1]], callout: { col: 1, l1: 'col b', l2: '1 row' } },
  section: { n: 9, boundary: { label: 'repo' }, regions: [{ kind: 'hatch', x: 20, y: 40, w: 100, h: 60, label: 'closed' }, { kind: 'island', x: 30, y: 120, label: 'lock' }], callouts: [{ l1: 'a', l2: 'b', region: 0 }] },
};

let failed = 0;
for (const [name, data] of Object.entries(cases)) {
  for (const weight of ['soft', 'strong']) {
    for (const t of [0, 300, Infinity]) {
      const r = recipes[name]({ ...data, weight, t, tt: t });
      const bad = /NaN|undefined|Infinity/.exec(r.markup);
      if (bad || !(r.w > 0 && r.h > 0)) {
        failed++;
        console.error(`${name} · ${weight} · t=${t}: ${bad ? `"${bad[0]}" in …${r.markup.slice(Math.max(0, bad.index - 60), bad.index + 20)}…` : `size ${r.w}×${r.h}`}`);
      }
    }
  }
}
console.log(failed ? `${failed} recipe draws failed` : `${Object.keys(cases).length} recipes × 2 weights × 3 times: ok`);
process.exit(failed ? 1 : 0);
