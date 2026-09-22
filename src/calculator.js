// Pure calculator logic. No DOM access so it can be unit tested in Node.
import { CALCULATOR_CONFIGS, DEFAULT_INDUSTRY } from './content.js';

export const RECOVERY_RATE = 0.8;

// Rates are fractions (0.27 for 27%).
export function calculate({ inquiries, missedRate, bookRate, avgJob }) {
  const missed = inquiries * missedRate;
  const leak = missed * bookRate * avgJob;
  const recovered = leak * RECOVERY_RATE;
  const extraJobs = Math.round(missed * bookRate * RECOVERY_RATE);
  const yearly = recovered * 12;
  return { missed, leak, recovered, extraJobs, yearly };
}

// Converts raw slider values (percent as whole numbers) into calculate() input.
export function fromSliderValues(values) {
  return {
    inquiries: values.inquiries,
    missedRate: values.missedRate / 100,
    bookRate: values.bookRate / 100,
    avgJob: values.avgJob,
  };
}

// Picks a config: explicit prop first, then ?industry= in the URL, then the default.
export function resolveIndustry(industry, search = '') {
  if (industry && CALCULATOR_CONFIGS[industry]) return industry;
  const fromUrl = new URLSearchParams(search).get('industry');
  if (fromUrl && CALCULATOR_CONFIGS[fromUrl]) return fromUrl;
  return DEFAULT_INDUSTRY;
}

export function formatCurrency(value, { locale, currency }) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatCompactCurrency(value, { locale, currency }) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatSliderValue(value, slider, config) {
  if (slider.format === 'percent') return `${value}%`;
  if (slider.format === 'currency') return formatCurrency(value, config);
  return new Intl.NumberFormat(config.locale).format(value);
}

export function resultSentence(result, config) {
  const { copy } = config;
  const unit = result.extraJobs === 1 ? copy.unitSingular : copy.unitPlural;
  return copy.result
    .replace('{yearly}', formatCompactCurrency(result.yearly, config))
    .replace('{count}', String(result.extraJobs))
    .replace('{unit}', unit);
}
