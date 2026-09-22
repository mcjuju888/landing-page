// Revenue leak calculator component.
// Usage: mountCalculator(el, { industry: 'hvac' }). Without an industry prop
// it falls back to ?industry= in the URL, then the default config.
import { CALCULATOR_CONFIGS } from './content.js';
import {
  calculate,
  fromSliderValues,
  resolveIndustry,
  formatCurrency,
  formatCompactCurrency,
  formatSliderValue,
} from './calculator.js';

const SLIDER_ORDER = ['inquiries', 'missedRate', 'bookRate', 'avgJob'];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function setFill(input) {
  const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
  input.style.setProperty('--fill', `${pct}%`);
}

export function mountCalculator(root, { industry } = {}) {
  const key = resolveIndustry(industry, window.location.search);
  const config = CALCULATOR_CONFIGS[key];
  const { copy } = config;
  const values = {};
  const outputs = {};

  const wrap = el('div', 'calc');
  const controls = el('div', 'calc__controls');

  SLIDER_ORDER.forEach((name) => {
    const slider = config.sliders[name];
    const id = `calc-${name}`;
    values[name] = slider.default;

    const field = el('div', 'calc__field');
    const head = el('div', 'calc__field-head');
    const label = el('label', 'calc__label', slider.label);
    label.htmlFor = id;
    const output = el('output', 'calc__value');
    output.htmlFor = id;
    head.append(label, output);

    const input = document.createElement('input');
    Object.assign(input, {
      type: 'range', id, className: 'calc__range',
      min: slider.min, max: slider.max, step: slider.step, value: slider.default,
    });
    input.addEventListener('input', () => {
      values[name] = Number(input.value);
      update();
    });

    field.append(head, input);
    if (slider.helper) field.append(el('p', 'calc__helper', slider.helper));
    controls.append(field);
    outputs[name] = { input, output, slider };
  });

  const results = el('div', 'calc__results');
  results.setAttribute('aria-live', 'polite');

  const leakCard = el('div', 'calc__leak');
  const leakValue = el('p', 'calc__leak-value');
  leakCard.append(el('p', 'calc__eyebrow calc__eyebrow--leak', copy.leakLabel), leakValue, el('p', 'calc__leak-sub', copy.leakSub));

  const recoverCard = el('div', 'calc__recover');
  const recoverValue = el('span', 'calc__recover-value');
  const recoverRow = el('p', 'calc__recover-row');
  recoverRow.append(recoverValue, el('span', 'calc__per', copy.perMonth));
  const sentence = el('p', 'calc__sentence');
  const cta = el('a', 'btn btn--teal', copy.cta);
  cta.href = copy.ctaHref;
  recoverCard.append(el('p', 'calc__eyebrow', copy.recoverLabel), recoverRow, sentence, cta);

  results.append(leakCard, recoverCard);
  wrap.append(controls, results);
  root.replaceChildren(wrap);

  function renderSentence(result) {
    const unit = result.extraJobs === 1 ? copy.unitSingular : copy.unitPlural;
    const [before, after = ''] = copy.result.split('{yearly}');
    const strong = el('strong', null, formatCompactCurrency(result.yearly, config));
    const fill = (s) => s.replace('{count}', result.extraJobs).replace('{unit}', unit);
    sentence.replaceChildren(fill(before), strong, fill(after));
  }

  function update() {
    SLIDER_ORDER.forEach((name) => {
      const { input, output, slider } = outputs[name];
      const text = formatSliderValue(values[name], slider, config);
      output.textContent = text;
      input.setAttribute('aria-valuetext', text);
      setFill(input);
    });
    const result = calculate(fromSliderValues(values));
    leakValue.textContent = formatCurrency(result.leak, config);
    recoverValue.textContent = formatCurrency(result.recovered, config);
    renderSentence(result);
  }

  update();
}
