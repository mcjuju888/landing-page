import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { CALCULATOR_CONFIGS } from '../src/content.js';
import { resultSentence, calculate, fromSliderValues } from '../src/calculator.js';
import { videoEmbed, bookingEmbedSrc } from '../src/media.js';

const root = new URL('../', import.meta.url);
const files = ['index.html', ...readdirSync(new URL('src/', root)).map((f) => `src/${f}`)];

test('no em dashes anywhere in the UI source', () => {
  for (const f of files) {
    const text = readFileSync(new URL(f, root), 'utf8');
    assert.ok(!text.includes('—'), `${f} contains an em dash`);
  }
});

test('HVAC page copy never mentions other industries', () => {
  const hvacCopy = readFileSync(new URL('src/content.js', root), 'utf8').split('dealership: {')[0];
  const page = [hvacCopy, readFileSync(new URL('index.html', root), 'utf8'), readFileSync(new URL('src/main.js', root), 'utf8')].join('\n');
  for (const word of ['dealer', 'all businesses', 'any business', 'every industry']) {
    assert.ok(!page.toLowerCase().includes(word), `found "${word}"`);
  }
});

test('HVAC result sentence uses jobs and CAD formatting', () => {
  const config = CALCULATOR_CONFIGS.hvac;
  const values = Object.fromEntries(Object.entries(config.sliders).map(([k, s]) => [k, s.default]));
  const sentence = resultSentence(calculate(fromSliderValues(values)), config);
  assert.match(sentence, /^That's \$373(\.2)?K a year or about 26 extra jobs every month\.$/);
});

test('video links become lazy embeds', () => {
  assert.equal(videoEmbed(''), null);
  assert.match(videoEmbed('https://www.youtube.com/watch?v=abc123').src, /youtube-nocookie\.com\/embed\/abc123/);
  assert.match(videoEmbed('https://youtu.be/abc123').src, /embed\/abc123/);
  assert.match(videoEmbed('https://vimeo.com/76979871').src, /player\.vimeo\.com\/video\/76979871/);
  assert.deepEqual(videoEmbed('https://cdn.example.com/demo.mp4'), { type: 'video', src: 'https://cdn.example.com/demo.mp4' });
});

test('booking links embed inline', () => {
  assert.equal(bookingEmbedSrc(''), null);
  assert.match(bookingEmbedSrc('https://cal.com/belvoro/demo'), /embed=true/);
  assert.match(bookingEmbedSrc('https://calendly.com/belvoro/demo'), /hide_gdpr_banner=1/);
});
