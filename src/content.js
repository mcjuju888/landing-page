// All page copy and configuration lives in this file.
// Edit text here; components read from it and never hard-code copy.
// Copy rule: no em dashes anywhere (a test enforces this).
// In headings, wrap a word in *asterisks* to show it in teal italics.

// Paste a YouTube, Vimeo or direct .mp4 link. Empty shows the placeholder.
export const VIDEO_URL = '';

// Paste your Cal.com or Calendly booking link. Empty shows the placeholder.
export const BOOKING_URL = '';

export const CONTACT_EMAIL = 'hello@belvoro.ai';

export const BRAND = {
  name: 'Belvoro',
  logoSrc: 'assets/logo.png',
  logoAlt: 'Belvoro',
  copyright: '© Belvoro AI',
};

export const META = {
  title: 'Belvoro for HVAC | Stop losing jobs to missed calls',
  description:
    'Every unanswered call is a job going to the next contractor on Google. See how much silence is costing your HVAC business.',
};

export const HEADER = {
  cta: 'Book a Demo',
};

export const HERO = {
  // Channel logos shown above the headline, in this order.
  channels: [
    { icon: 'phone', label: 'Phone' },
    { icon: 'sms', label: 'SMS' },
    { icon: 'gmail', label: 'Gmail' },
    { icon: 'instagram', label: 'Instagram' },
    { icon: 'facebook', label: 'Facebook' },
    { icon: 'whatsapp', label: 'WhatsApp' },
    { icon: 'website', label: 'Website' },
  ],
  heading: 'How much is *silence* costing your HVAC business?',
  sub: 'Every unanswered call is a job going to the next contractor on Google. See your number below.',
};

export const CHANNELS = {
  heading: 'Every way a homeowner reaches you. Answered in *seconds*, 24/7.',
  items: [
    { icon: 'phone', label: 'Phone calls' },
    { icon: 'callback', label: 'Missed call text back' },
    { icon: 'sms', label: 'SMS' },
    { icon: 'web', label: 'Website forms and chat' },
    { icon: 'social', label: 'Facebook and Instagram DMs' },
    { icon: 'google', label: 'Google Business messages' },
    { icon: 'email', label: 'Email' },
  ],
  footnote:
    'Emergency no-heat and no-AC calls get flagged and routed to your on-call tech. Every lead is logged in one inbox.',
};

export const VIDEO = {
  heading: 'See How Belvoro *Helps*',
  posterSrc: 'assets/demo-poster.svg',
  playLabel: 'Play the demo video',
  comingSoon: 'Demo video coming soon',
  iframeTitle: 'Belvoro HVAC call demo',
};

export const BOOKING = {
  heading: 'Book a 15 minute *demo*',
  sub: "We'll run your real numbers and show you Belvoro handling your calls.",
  placeholder: 'Your booking calendar will appear here.',
  iframeTitle: 'Book a demo with Belvoro',
};

// Calculator configs, one per vertical. The HVAC page uses "hvac".
// Slider values for percentages are whole numbers (27 means 27%).
// Result templates use {yearly}, {count} and {unit} placeholders.
export const CALCULATOR_CONFIGS = {
  hvac: {
    currency: 'CAD',
    locale: 'en-CA',
    sliders: {
      inquiries: {
        label: 'Calls, texts and web requests per month',
        default: 300, min: 50, max: 2000, step: 10, format: 'number',
      },
      missedRate: {
        label: 'Missed or answered too late',
        default: 27, min: 5, max: 70, step: 1, format: 'percent',
      },
      bookRate: {
        label: 'Of the calls you answer, how many book a job',
        default: 40, min: 10, max: 90, step: 1, format: 'percent',
      },
      avgJob: {
        label: 'Average job value',
        helper: 'Blend of service calls, repairs and replacements',
        default: 1200, min: 150, max: 15000, step: 50, format: 'currency',
      },
    },
    copy: {
      leakLabel: 'Revenue leaking every month',
      leakSub: 'from calls nobody answered in time',
      recoverLabel: 'Belvoro puts back',
      perMonth: '/month',
      result: "That's {yearly} a year or about {count} extra {unit} every month.",
      unitSingular: 'job',
      unitPlural: 'jobs',
      barLeak: 'Leaking /mo',
      barRecover: 'Belvoro puts back',
      cta: 'Recover It: Book a Demo',
      ctaHref: '#book',
    },
  },
  dealership: {
    currency: 'USD',
    locale: 'en-US',
    sliders: {
      inquiries: {
        label: 'Inquiries per month (calls, texts, DMs, emails)',
        default: 880, min: 50, max: 1000, step: 10, format: 'number',
      },
      missedRate: {
        label: 'Missed or answered too late',
        default: 28, min: 5, max: 60, step: 1, format: 'percent',
      },
      bookRate: {
        label: 'Of the leads you do reach, how many buy',
        default: 10, min: 5, max: 60, step: 1, format: 'percent',
      },
      avgJob: {
        label: 'Average sale / customer value',
        default: 32000, min: 1000, max: 60000, step: 500, format: 'currency',
      },
    },
    copy: {
      leakLabel: 'Revenue leaking every month',
      leakSub: 'from inquiries nobody answered in time',
      recoverLabel: 'Belvoro puts back',
      perMonth: '/month',
      result: "That's {yearly} a year or about {count} extra {unit} every month.",
      unitSingular: 'customer',
      unitPlural: 'customers',
      barLeak: 'Leaking /mo',
      barRecover: 'Belvoro puts back',
      cta: 'Recover It: Get Started',
      ctaHref: '#book',
    },
  },
};

export const DEFAULT_INDUSTRY = 'hvac';
