import {
  VIDEO_URL, BOOKING_URL, CONTACT_EMAIL,
  BRAND, META, HERO, CHANNELS, VIDEO, BOOKING,
} from './content.js';
import { mountCalculator } from './calculator-ui.js';
import { videoEmbed, bookingEmbedSrc } from './media.js';
import { icon, brandIcon } from './icons.js';

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
// Escapes text, then turns *word* into an accented <em>.
const rich = (s) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

document.title = META.title;
document.querySelector('meta[name="description"]')?.setAttribute('content', META.description);

$('#header').innerHTML = `
  <div class="container header__inner">
    <img class="logo" src="${esc(BRAND.logoSrc)}" alt="${esc(BRAND.logoAlt)}" width="160" height="32">
  </div>`;

$('#hero').innerHTML = `
  <div class="container hero__inner">
    <h1>${rich(HERO.heading)}</h1>
    <p class="lede">${esc(HERO.sub)}</p>
  </div>`;

mountCalculator($('#calculator-root'), { industry: 'hvac' });

$('#channels').innerHTML = `
  <div class="container channels-block">
    <h2>${rich(CHANNELS.heading)}</h2>
    <ul class="channels">
      ${CHANNELS.items.map((c) => `
        <li class="channel" title="${esc(c.label)}">${brandIcon(c.icon)}<span class="sr-only">${esc(c.label)}</span></li>`).join('')}
    </ul>
    <p class="channels__note">${esc(CHANNELS.footnote)}</p>
  </div>`;

$('#demo').innerHTML = `
  <div class="container demo">
    <h2>${rich(VIDEO.heading)}</h2>
    <div class="video">
      <button class="video__poster" type="button" aria-label="${esc(VIDEO.playLabel)}"
        style="background-image:url('${esc(VIDEO.posterSrc)}')">
        <span class="video__play" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
        </span>
      </button>
    </div>
  </div>`;

const embed = videoEmbed(VIDEO_URL);
const poster = $('.video__poster');
if (!embed) {
  poster.disabled = true;
  poster.insertAdjacentHTML('beforeend', `<span class="video__soon">${esc(VIDEO.comingSoon)}</span>`);
} else {
  poster.addEventListener('click', () => {
    const frame = embed.type === 'iframe'
      ? Object.assign(document.createElement('iframe'), {
          src: embed.src, title: VIDEO.iframeTitle, allowFullscreen: true,
          allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
        })
      : Object.assign(document.createElement('video'), {
          src: embed.src, controls: true, autoplay: true, playsInline: true, poster: VIDEO.posterSrc,
        });
    poster.replaceWith(frame);
  }, { once: true });
}

const bookingSrc = bookingEmbedSrc(BOOKING_URL);
$('#book').innerHTML = `
  <div class="container">
    <h2>${rich(BOOKING.heading)}</h2>
    ${BOOKING.sub ? `<p class="lede">${esc(BOOKING.sub)}</p>` : ''}
    <div class="booking">
      ${bookingSrc
        ? `<iframe src="${esc(bookingSrc)}" title="${esc(BOOKING.iframeTitle)}" loading="lazy"></iframe>`
        : `<div class="booking__placeholder">${icon('calendar')}<p>${esc(BOOKING.placeholder)}</p></div>`}
    </div>
  </div>`;

$('#footer').innerHTML = `
  <div class="container footer__inner">
    <span>${esc(BRAND.copyright)}</span>
    <span>${esc(CONTACT_EMAIL)}</span>
  </div>`;
