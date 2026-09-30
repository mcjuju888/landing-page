// Belvoro inbox / conversation console.
// Static demo UI: all data lives in this file, rendered with vanilla DOM.
// No build step and no runtime dependencies, matching the rest of the repo.
import { brandIcon } from './icons.js';

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/* ---------- Sidebar navigation ---------- */
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox' },
  { id: 'contacts', label: 'Contacts', icon: 'contacts' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'outreach', label: 'Target outreach', icon: 'target' },
  { id: 'campaigns', label: 'Campaigns', icon: 'campaign' },
];

/* ---------- Inbox filters ---------- */
const CHANNEL_TABS = [
  { id: 'all', label: 'All', icon: 'all' },
  { id: 'phone', label: 'Phone', icon: 'phone' },
  { id: 'email', label: 'Email', icon: 'email' },
  { id: 'chats', label: 'All Chats', icon: 'chats' },
  { id: 'sms', label: 'SMS', icon: 'sms' },
];

const STATUS_TABS = ['Any Status', 'New', 'Qualified', 'Not interested', 'Follow up'];

/* ---------- Conversations ---------- */
// score drives the progress bar (0-100); tone picks the bar + tag colour.
const CONVERSATIONS = [
  {
    id: 'daniel',
    name: 'Daniel Jovner',
    handle: '@daniel.jovner',
    channel: 'instagram',
    channelName: 'instagram',
    avatar: '#f6d2d9',
    time: 'just now',
    score: 97,
    tone: 'good',
    status: 'Appointment',
    messages: [
      { from: 'them', sender: 'Daniel Jovner', time: '10:15 AM',
        text: "Hi! i'd like to book a consultation. Do you have any availabilty this week?" },
      { from: 'us', sender: 'Bella', ai: true, time: '10:16 AM',
        text: 'Hello Daniel! Yes, we have availability this week, what type of consultation are you looking for?' },
      { from: 'them', sender: 'Daniel Jovner', time: '10:16 AM',
        text: "It's for a business automation consultation. Also, can you share your pricing?" },
      { from: 'us', sender: 'Bella', ai: true, time: '10:17 AM',
        text: 'Of course! our consultations start at $199. Would you prefer an in-person or virtual session?' },
      { from: 'them', sender: 'Daniel Jovner', time: '10:18 AM',
        text: 'Virtual is perfect. What time do you have Friday?' },
      { from: 'us', sender: 'Jhon', ai: true, time: '10:19 AM',
        text: 'We have 2:30 PM or 4:00 PM available. Does 2:30 PM work for you?' },
      { from: 'them', sender: 'Daniel Jovner', time: '10:19 AM',
        text: 'Yes lets do 2:30 PM on Friday. Thanks!' },
      { from: 'us', sender: 'Bella', ai: true, tag: 'appointment confirmation', time: '10:20 AM',
        text: "You're all set! i've booked you for Friday at 2:30 PM. You'll receive a confirmation email shortly." },
    ],
  },
  {
    id: 'mike',
    name: 'Mike Torres',
    handle: 'mike.torres@gmail.com',
    channel: 'gmail',
    channelName: 'email',
    avatar: '#f3d7cf',
    time: '18m ago',
    score: 49,
    tone: 'mid',
    status: 'Inquiry',
    messages: [
      { from: 'them', sender: 'Mike Torres', time: '9:58 AM',
        text: 'Hey, do you offer monthly retainers or is it project based only?' },
      { from: 'us', sender: 'Bella', ai: true, time: '9:59 AM',
        text: 'Great question Mike! We offer both. Can I ask what kind of work you need help with?' },
      { from: 'them', sender: 'Mike Torres', time: '10:02 AM',
        text: 'Mostly ongoing automation and reporting. What would that run per month?' },
    ],
  },
  {
    id: 'jai',
    name: 'Jai',
    handle: '+1 (415) 555 0132',
    channel: 'whatsapp',
    channelName: 'whatsapp',
    avatar: '#f6d2d9',
    time: '1d ago',
    score: 24,
    tone: 'low',
    status: 'Follow Up',
    messages: [
      { from: 'them', sender: 'Jai', time: 'Yesterday 4:11 PM',
        text: 'Saw your post, might be interested later this quarter.' },
      { from: 'us', sender: 'Bella', ai: true, time: 'Yesterday 4:12 PM',
        text: 'Thanks for reaching out Jai! Want me to check back in a few weeks?' },
    ],
  },
  {
    id: 'sam',
    name: 'Sam Sherman',
    handle: '+1 (206) 555 0148',
    channel: 'sms',
    channelName: 'SMS',
    avatar: '#e7d9f4',
    time: '1d ago',
    score: 35,
    tone: 'warn',
    status: 'Appointment',
    messages: [
      { from: 'them', sender: 'Sam Sherman', time: 'Yesterday 1:20 PM',
        text: 'Can we move my call to next week?' },
      { from: 'us', sender: 'Jhon', ai: true, time: 'Yesterday 1:21 PM',
        text: 'Absolutely Sam. I have Tuesday at 11 AM or Wednesday at 3 PM open, which works?' },
    ],
  },
  {
    id: 'lisa',
    name: 'Lisa bennett',
    handle: '+1 (312) 555 0177',
    channel: 'sms',
    channelName: 'SMS',
    avatar: '#f6d2d9',
    time: '2d ago',
    score: 17,
    tone: 'low',
    status: 'Inquiry',
    messages: [
      { from: 'them', sender: 'Lisa bennett', time: 'Mon 8:04 AM',
        text: 'What areas do you serve?' },
      { from: 'us', sender: 'Bella', ai: true, time: 'Mon 8:05 AM',
        text: 'Hi Lisa! We work with clients nationwide, fully remote. Where are you based?' },
    ],
  },
];

/* ---------- Icons (Lucide-style line set) ---------- */
const LINE = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  analytics: '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6" rx="1"/><rect x="12" y="8" width="3" height="10" rx="1"/><rect x="17" y="5" width="3" height="13" rx="1"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  contacts: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  campaign: '<path d="M3 11l18-7-4 18-5-6-5-2z"/><path d="M12 16l3 3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  all: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  email: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  chats: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  sms: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  summary: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>',
  spark: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/>',
};
const line = (name, cls = 'ico') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${LINE[name] || ''}</svg>`;

const CHANNEL_BADGE = new Set(['instagram', 'gmail', 'whatsapp', 'phone', 'sms']);

// Maps a conversation's channel to the filter tab it belongs to.
const CHANNEL_GROUP = {
  instagram: 'chats', whatsapp: 'chats',
  gmail: 'email', phone: 'phone', sms: 'sms',
};

/* ---------- State ---------- */
const state = {
  activeNav: 'inbox',
  channel: 'all',
  status: 'Any Status',
  current: CONVERSATIONS[0].id,
  aiOn: true,
};

/* ---------- Render: sidebar ---------- */
function renderSidebar() {
  $('#sidebar').innerHTML = `
    <div class="brand">
      <img class="brand__mark" src="assets/logo-mark.png" alt="" width="28" height="28">
      <span class="brand__name">Belvoro</span>
    </div>
    <nav class="nav" aria-label="Primary">
      ${NAV.map((n) => `
        <button class="nav__item${n.id === state.activeNav ? ' is-active' : ''}" data-nav="${n.id}" type="button">
          ${line(n.icon, 'nav__ico')}
          <span>${esc(n.label)}</span>
        </button>`).join('')}
    </nav>`;
}

/* ---------- Render: inbox list ---------- */
function statusClass(status) {
  return { Appointment: 'tag--appt', Inquiry: 'tag--inq', 'Follow Up': 'tag--follow' }[status] || 'tag--inq';
}

function visibleConversations() {
  return CONVERSATIONS.filter((c) =>
    state.channel === 'all' || CHANNEL_GROUP[c.channel] === state.channel);
}

function renderList() {
  const items = visibleConversations();
  $('#list').innerHTML = `
    <div class="list__head">
      <h1 class="list__title">Inbox</h1>
      <label class="search">
        ${line('search', 'search__ico')}
        <input class="search__input" type="search" placeholder="Search, name, phone, email...">
      </label>
      <div class="tabs" role="tablist" aria-label="Channels">
        ${CHANNEL_TABS.map((t) => `
          <button class="tab${t.id === state.channel ? ' is-active' : ''}" data-channel="${t.id}" type="button">
            ${line(t.icon, 'tab__ico')}<span>${esc(t.label)}</span>
          </button>`).join('')}
      </div>
      <div class="chips" role="tablist" aria-label="Status">
        ${STATUS_TABS.map((s) => `
          <button class="chip${s === state.status ? ' is-active' : ''}" data-status="${esc(s)}" type="button">${esc(s)}</button>`).join('')}
      </div>
      <button class="new-convo" type="button">${line('plus', 'new-convo__ico')}<span>Start new conversation</span></button>
    </div>
    <div class="convos" role="listbox" aria-label="Conversations">
      ${items.map(convoRow).join('') || '<p class="convos__empty">No conversations in this view.</p>'}
    </div>`;
}

function convoRow(c) {
  const active = c.id === state.current;
  const badge = CHANNEL_BADGE.has(c.channel)
    ? `<span class="avatar__badge">${brandIcon(c.channel)}</span>` : '';
  return `
    <button class="convo${active ? ' is-active' : ''}" data-convo="${c.id}" type="button" role="option" aria-selected="${active}">
      <span class="avatar" style="--bg:${c.avatar}">${badge}</span>
      <span class="convo__body">
        <span class="convo__top">
          <span class="convo__name">${esc(c.name)}</span>
          <span class="convo__time">${esc(c.time)}</span>
        </span>
        <span class="convo__meter">
          <span class="meter meter--${c.tone}"><span class="meter__fill" style="width:${c.score}%"></span></span>
          <span class="convo__score">${c.score}</span>
          <span class="tag ${statusClass(c.status)}">${esc(c.status)}</span>
        </span>
      </span>
    </button>`;
}

/* ---------- Render: conversation thread ---------- */
function renderThread() {
  const c = CONVERSATIONS.find((x) => x.id === state.current) || CONVERSATIONS[0];
  const badge = CHANNEL_BADGE.has(c.channel)
    ? `<span class="peer__chan">${brandIcon(c.channel)}</span>` : '';
  $('#thread').innerHTML = `
    <header class="thread__head">
      <div class="peer">
        <h2 class="peer__name">${esc(c.name)}</h2>
        <div class="peer__meta">
          ${badge}
          <span class="peer__handle">${esc(c.handle)}</span>
          <span class="tag ${statusClass(c.status)}">${esc(c.status)}</span>
        </div>
      </div>
      <div class="thread__actions">
        <button class="ai-toggle${state.aiOn ? ' is-on' : ''}" type="button" aria-pressed="${state.aiOn}">
          <span class="ai-toggle__dot"></span><span>AI ${state.aiOn ? 'ON' : 'OFF'}</span>
        </button>
        <button class="summary-btn" type="button">${line('summary', 'summary-btn__ico')}<span>Conversation Summary</span></button>
      </div>
    </header>
    <div class="messages" id="messages">
      <div class="day"><span>Today</span></div>
      ${c.messages.map(bubble).join('')}
    </div>
    <form class="composer" id="composer" autocomplete="off">
      <button class="composer__icon" type="button" aria-label="Add attachment">${line('plus', 'composer__ico')}</button>
      <button class="composer__icon" type="button" aria-label="Add emoji">${line('smile', 'composer__ico')}</button>
      <input class="composer__input" id="composer-input" type="text" placeholder="Reply on ${esc(c.channelName)}...">
      <button class="composer__send" type="submit">Send ${line('send', 'composer__send-ico')}</button>
    </form>`;
  scrollMessages();
}

function bubble(m) {
  if (m.from === 'them') {
    return `
      <div class="msg msg--in">
        <div class="msg__meta"><span class="msg__sender">${esc(m.sender)}</span> · ${esc(m.time)}</div>
        <div class="msg__bubble">${esc(m.text)}</div>
      </div>`;
  }
  const tag = m.tag ? ` <span class="msg__tag">[${esc(m.tag)}]</span>` : '';
  const spark = m.ai ? `${line('spark', 'msg__spark')} ` : '';
  return `
    <div class="msg msg--out">
      <div class="msg__meta">${spark}<span class="msg__sender">${esc(m.sender)}</span>${tag} · ${esc(m.time)}</div>
      <div class="msg__bubble msg__bubble--dark">${esc(m.text)}</div>
    </div>`;
}

function scrollMessages() {
  const box = $('#messages');
  if (box) box.scrollTop = box.scrollHeight;
}

/* ---------- Interactions ---------- */
function selectConversation(id) {
  if (state.current === id) return;
  state.current = id;
  renderList();
  renderThread();
}

document.addEventListener('click', (e) => {
  const nav = e.target.closest('[data-nav]');
  if (nav) { state.activeNav = nav.dataset.nav; renderSidebar(); return; }

  const tab = e.target.closest('[data-channel]');
  if (tab) {
    state.channel = tab.dataset.channel;
    const stillVisible = visibleConversations().some((c) => c.id === state.current);
    if (!stillVisible) state.current = (visibleConversations()[0] || CONVERSATIONS[0]).id;
    renderList(); renderThread(); return;
  }

  const chip = e.target.closest('[data-status]');
  if (chip) { state.status = chip.dataset.status; renderList(); return; }

  const convo = e.target.closest('[data-convo]');
  if (convo) { selectConversation(convo.dataset.convo); return; }

  const ai = e.target.closest('.ai-toggle');
  if (ai) { state.aiOn = !state.aiOn; renderThread(); return; }
});

document.addEventListener('submit', (e) => {
  if (e.target.id !== 'composer') return;
  e.preventDefault();
  const input = $('#composer-input');
  const text = input.value.trim();
  if (!text) return;
  const c = CONVERSATIONS.find((x) => x.id === state.current);
  const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  c.messages.push(
    state.aiOn
      ? { from: 'us', sender: 'Bella', ai: true, time: now, text }
      : { from: 'us', sender: 'You', time: now, text },
  );
  input.value = '';
  renderThread();
});

/* ---------- Boot ---------- */
renderSidebar();
renderList();
renderThread();
