import test from 'node:test';
import assert from 'node:assert/strict';
import { CALCULATOR_CONFIGS } from '../src/content.js';
import { calculate, fromSliderValues, RECOVERY_RATE, resolveIndustry } from '../src/calculator.js';

const NAMES = ['inquiries', 'missedRate', 'bookRate', 'avgJob'];

// Every value a slider can take, from min to max by step.
function stops({ min, max, step }) {
  const out = [];
  for (let v = min; v <= max; v += step) out.push(v);
  if (out[out.length - 1] !== max) out.push(max);
  return out;
}

function check(values, label) {
  const r = calculate(fromSliderValues(values));
  assert.ok(r.recovered <= r.leak, `${label}: recovered ${r.recovered} > leak ${r.leak} at ${JSON.stringify(values)}`);
  assert.ok(r.recovered >= 0 && r.extraJobs >= 0, `${label}: negative result at ${JSON.stringify(values)}`);
  assert.equal(r.yearly, r.recovered * 12);
}

test('RECOVERY_RATE is 0.8', () => {
  assert.equal(RECOVERY_RATE, 0.8);
});

test('matches the spec formulas', () => {
  const r = calculate({ inquiries: 300, missedRate: 0.27, bookRate: 0.4, avgJob: 1200 });
  assert.ok(Math.abs(r.missed - 81) < 1e-9);
  assert.ok(Math.abs(r.leak - 38880) < 1e-6);
  assert.ok(Math.abs(r.recovered - 31104) < 1e-6);
  assert.equal(r.extraJobs, 26);
  assert.ok(Math.abs(r.yearly - 373248) < 1e-6);
});

for (const [industry, config] of Object.entries(CALCULATOR_CONFIGS)) {
  test(`${industry}: recovered <= leak across the full slider ranges`, () => {
    const all = Object.fromEntries(NAMES.map((n) => [n, stops(config.sliders[n])]));
    const anchors = Object.fromEntries(NAMES.map((n) => {
      const s = config.sliders[n];
      return [n, [s.min, s.default, s.max]];
    }));

    // Sweep each slider through every stop while the others sit at min, default and max.
    for (const moving of NAMES) {
      const fixed = NAMES.filter((n) => n !== moving);
      const combos = fixed.reduce((acc, n) => acc.flatMap((c) => anchors[n].map((v) => ({ ...c, [n]: v }))), [{}]);
      for (const combo of combos) {
        for (const v of all[moving]) check({ ...combo, [moving]: v }, industry);
      }
    }

    // Full grid over every stop of every slider, strided to keep the run fast.
    const stride = (arr, k) => arr.filter((_, i) => i % k === 0 || i === arr.length - 1);
    const grid = Object.fromEntries(NAMES.map((n) => [n, stride(all[n], Math.max(1, Math.ceil(all[n].length / 40)))]));
    for (const a of grid.inquiries)
      for (const b of grid.missedRate)
        for (const c of grid.bookRate)
          for (const d of grid.avgJob) check({ inquiries: a, missedRate: b, bookRate: c, avgJob: d }, industry);
  });

  test(`${industry}: defaults sit inside their slider range on a step`, () => {
    for (const n of NAMES) {
      const s = config.sliders[n];
      assert.ok(s.min <= s.default && s.default <= s.max, `${n} default out of range`);
      assert.equal((s.default - s.min) % s.step, 0, `${n} default is off-step`);
    }
  });
}

test('industry selection: prop, then URL param, then hvac', () => {
  assert.equal(resolveIndustry('dealership', '?industry=hvac'), 'dealership');
  assert.equal(resolveIndustry(undefined, '?industry=dealership'), 'dealership');
  assert.equal(resolveIndustry(undefined, '?industry=nope'), 'hvac');
  assert.equal(resolveIndustry(undefined, ''), 'hvac');
});
