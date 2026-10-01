// Belvoro Inbox page. Static recreation of the inbox UI.
// Data lives at the top of this file; the render functions below read from it
// and never hard-code copy inline.
import { icon, brandIcon } from './icons.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const app = document.getElementById('app');

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const NAV = [
  { icon: 'home', label: 'Dashboard' },
  { icon: 'analytics', label: 'Analytics' },
  { icon: 'inbox', label: 'Inbox', active: true },
  { icon: 'contacts', label: 'Contacts' },
  { icon: 'calendar', label: 'Calendar' },
  { icon: 'target', label: 'Target outreach' },
  { icon: 'campaigns', label: 'Campaigns' },
];

// Channel filter row. `brand` uses the full-colour marks; `glyph` the line icons.
const CHANNEL_FILTERS = [
  { label: 'All', active: true },
  { label: 'Phone', brand: 'phone' },
  { label: 'Email', brand: 'gmail' },
  { label: 'All Chats', glyph: 'chat' },
  { label: 'SMS', glyph: 'message' },
];

const STATUS_FILTERS = [
  { label: 'Any Status', active: true },
  { label: 'New' },
  { label: 'Qualified' },
  { label: 'Not interested' },
  { label: 'Follow Up' },
];

// Conversation rows. `avatar` = circle colour; `channel` = badge brand mark;
// `score` drives the bar + number; `bar` = fill tone; `pipeline` = outlined chip;
// `status` = { label, tone }.
const BASE_ROWS = [
  { name: 'Daniel Jovner', avatar: '#fbd0dd', channel: 'instagram', flame: true, score: 97, bar: 'green', pipeline: 'New', status: { label: 'Appointment', tone: 'purple' }, active: true },
  { name: 'Adam Legerman', avatar: '#fbd4d4', channel: 'whatsapp', score: 49, bar: 'blue', status: { label: 'Inquiry', tone: 'pink' } },
  { name: 'Jai Patel', avatar: '#ddd9f6', channel: 'gmail', check: true, score: 24, bar: 'red', pipeline: 'Lost', status: { label: 'Follow up', tone: 'blue' } },
  { name: 'Dvir Hadida', avatar: '#fbd4d4', channel: 'facebook', score: 89, bar: 'green', pipeline: 'Won', status: { label: 'Inquiry', tone: 'pink' } },
  { name: 'Sam Sherman', avatar: '#cdeedd', channel: 'whatsapp', score: 95, bar: 'green', status: { label: 'Inquiry', tone: 'purple' } },
  { name: 'Lisa bennett', avatar: '#d2d4d7', channel: 'whatsapp', score: 12, bar: 'red', status: { label: 'Follow up', tone: 'blue' } },
];

// The screenshot shows the list continuing past the base set; repeat rows 2-6
// (with a couple of avatar-colour variations) to recreate the scroll.
const REPEAT_ROWS = [
  { name: 'Adam Legerman', avatar: '#fbe0cf', channel: 'whatsapp', score: 49, bar: 'blue', status: { label: 'Inquiry', tone: 'pink' } },
  { name: 'Jai Patel', avatar: '#fbd0dd', channel: 'gmail', score: 24, bar: 'red', status: { label: 'Follow up', tone: 'blue' } },
  { name: 'Dvir Hadida', avatar: '#fbecb5', channel: 'facebook', score: 89, bar: 'green', status: { label: 'Inquiry', tone: 'pink' } },
  { name: 'Sam Sherman', avatar: '#cdeedd', channel: 'whatsapp', score: 95, bar: 'green', status: { label: 'Inquiry', tone: 'pink' } },
  { name: 'Lisa bennett', avatar: '#cfe3f6', channel: 'whatsapp', score: 12, bar: 'red', status: { label: 'Follow up', tone: 'blue' } },
];

const ROWS = [...BASE_ROWS, ...REPEAT_ROWS];

// Open conversation header.
const CONVERSATION = {
  name: 'Daniel Jovner',
  avatar: '#fbd0dd',
  channel: 'instagram',
  handle: '@daniel.jovner',
};

// Chat transcript. side: 'in' (customer, left) | 'out' (team/AI, right).
// `author` + `time` render above each group; `avatar` picks the right-side mark.
const MESSAGES = [
  { side: 'out', author: 'Lumi', time: '10:17 AM', avatar: 'lumi', text: 'Hey Daniel how can I help you' },
  { side: 'in', author: 'Daniel Jovner', time: '10:19 AM', text: 'Hi! i’d like to book a consultation. Do you have any availabilty this week?' },
  { side: 'out', author: 'Lumi', time: '10:19 AM', avatar: 'lumi', text: 'Of course! our consultations start at $199.\nWould you prefer an in-person or virtual session?' },
  { side: 'in', author: 'Daniel Jovner', time: '10:21 AM', text: 'It’s for a business automation consultation.\nAlso, can you share your pricing?' },
  { side: 'out', author: 'Lumi', time: '10:21 AM', avatar: 'lumi', text: 'Of course! our consultations start at $199.\nWould you prefer an in-person or virtual session?' },
  { side: 'in', author: 'Daniel Jovner', time: '10:30 AM', text: 'Virtual is perfect. What time do you have Friday?' },
  { side: 'out', author: 'Jason Frank', time: '10:32 AM', avatar: 'jf', person: true, text: 'We have 2:30 PM or 4:00 PM available.\nDoes 2:30 PM work for you?' },
  { side: 'in', author: 'Daniel Jovner', time: '10:40 AM', text: 'Yes lets do 2:30 PM on Friday. Thanks!' },
  { side: 'out', author: 'Lumi [appointment confirmation]', time: '10:50 AM', avatar: 'lumi', text: 'You’re all set! i’ve booked you for Friday at 2:30 PM.\nYou’ll receive a confirmation email shortly.' },
];

// ---------------------------------------------------------------------------
// Partials
// ---------------------------------------------------------------------------

// Coloured avatar circle with a small channel badge at the lower-left.
function avatar(row) {
  return `
    <span class="av" style="background:${esc(row.avatar)}">
      ${row.channel ? `<span class="av__badge">${brandIcon(row.channel)}</span>` : ''}
    </span>`;
}

function sidebar() {
  return `
    <aside class="side">
      <div class="side__logo">
        <img src="assets/logo.png" alt="Belvoro" height="22">
      </div>
      <nav class="nav">
        ${NAV.map((n) => `
          <a class="nav__item${n.active ? ' is-active' : ''}" href="#">
            ${icon(n.icon, 'nav__icon')}
            <span>${esc(n.label)}</span>
          </a>`).join('')}
      </nav>
    </aside>`;
}

function channelChip(c) {
  const mark = c.brand ? brandIcon(c.brand) : (c.glyph ? icon(c.glyph, 'chan__glyph') : '');
  return `
    <button class="chan${c.active ? ' is-active' : ''}" type="button">
      ${mark ? `<span class="chan__mark">${mark}</span>` : ''}
      <span>${esc(c.label)}</span>
    </button>`;
}

function statusChip(s) {
  return `<button class="statf${s.active ? ' is-active' : ''}" type="button">${esc(s.label)}</button>`;
}

function listRow(row) {
  const pill = row.status
    ? `<span class="pill pill--${esc(row.status.tone)}">${esc(row.status.label)}</span>`
    : '';
  const chip = row.pipeline ? `<span class="chip">${esc(row.pipeline)}</span>` : '';
  return `
    <button class="row${row.active ? ' is-active' : ''}" type="button">
      ${avatar(row)}
      <div class="row__main">
        <div class="row__top">
          <span class="row__name">${esc(row.name)}${row.flame ? icon('flame', 'row__flame') : ''}${row.check ? icon('check', 'row__check') : ''}</span>
          <span class="row__time">just now</span>
        </div>
        <div class="row__bottom">
          <span class="bar bar--${esc(row.bar)}"><span class="bar__fill" style="width:${row.score}%"></span></span>
          <span class="row__score">${row.score}</span>
          <span class="row__tags">${chip}${pill}</span>
        </div>
      </div>
    </button>`;
}

function inboxColumn() {
  return `
    <section class="list">
      <header class="list__head">
        <h1 class="list__title">Inbox</h1>
        <div class="search">
          ${icon('search', 'search__icon')}
          <input class="search__input" type="text" placeholder="Search, name, phone, email...">
        </div>
        <div class="chans">${CHANNEL_FILTERS.map(channelChip).join('')}</div>
        <div class="statrow">${STATUS_FILTERS.map(statusChip).join('')}</div>
        <button class="newconv" type="button">${icon('plus', 'newconv__icon')}<span>Start new conversation</span></button>
      </header>
      <div class="rows">${ROWS.map(listRow).join('')}</div>
    </section>`;
}

function outAvatar(m) {
  if (m.person) return `<span class="msg__pic msg__pic--person">JF</span>`;
  return `<span class="msg__pic"><img src="assets/lumi.webp" alt="Lumi" width="34" height="34"></span>`;
}

function message(m) {
  const body = esc(m.text).replace(/\n/g, '<br>');
  const meta = `<span class="msg__meta">${m.person ? icon('contacts', 'msg__metaicon') : ''}${esc(m.author)} · ${esc(m.time)}</span>`;
  if (m.side === 'in') {
    return `
      <div class="msg msg--in">
        <span class="msg__pic msg__pic--cust"></span>
        <div class="msg__col">
          ${meta}
          <div class="bubble bubble--in">${body}</div>
        </div>
      </div>`;
  }
  return `
    <div class="msg msg--out">
      <div class="msg__col">
        ${meta}
        <div class="bubble bubble--out">${body}</div>
      </div>
      ${outAvatar(m)}
    </div>`;
}

function conversation() {
  return `
    <section class="conv">
      <header class="conv__head">
        <div class="conv__who">
          ${avatar(CONVERSATION)}
          <div class="conv__id">
            <span class="conv__name">${esc(CONVERSATION.name)}</span>
            <span class="conv__sub">
              <span class="conv__chan">${brandIcon(CONVERSATION.channel)}</span>
              <span class="conv__handle">${esc(CONVERSATION.handle)}</span>
              <span class="conv__takeover">${icon('flame', 'conv__flame')}Human Takeover</span>
            </span>
          </div>
        </div>
        <div class="conv__actions">
          <span class="aion"><span class="aion__dot"></span>AI ON</span>
          <button class="summary" type="button">Conversation Summary</button>
        </div>
      </header>
      <div class="thread">${MESSAGES.map(message).join('')}</div>
      <footer class="composer">
        <button class="composer__attach" type="button" aria-label="Attach a file">${icon('paperclip', 'composer__icon')}</button>
        <div class="composer__box">
          <input class="composer__input" type="text" placeholder="Type a message...">
          <button class="composer__emoji" type="button" aria-label="Insert emoji">${icon('smile', 'composer__icon')}</button>
        </div>
        <button class="composer__send" type="button" aria-label="Send">${icon('send', 'composer__sendicon')}</button>
      </footer>
    </section>`;
}

app.innerHTML = sidebar() + inboxColumn() + conversation();

// Keep the newest message in view, like a live chat.
const thread = app.querySelector('.thread');
if (thread) thread.scrollTop = thread.scrollHeight;
