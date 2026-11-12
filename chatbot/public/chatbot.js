/**
 * anahum chatbot widget (self-contained, no dependencies).
 *
 * Embed with one tag:
 *   <script src="https://YOUR-CHATBOT-DEPLOYMENT/chatbot.js" defer></script>
 *
 * Optional attributes on the script tag:
 *   data-endpoint   full URL of the chat API (default: /api/chat on the script's origin)
 *   data-title      panel title            (default: "anahum assistant")
 *   data-greeting   first assistant message
 *   data-position   "right" (default) or "left"
 *
 * The UI lives in a Shadow DOM, so the site's CSS cannot leak in and the widget's
 * CSS cannot leak out. Colors and fonts come from the site's design tokens
 * (CSS custom properties inherit into the shadow tree).
 */
(() => {
  if (window.__anahumChatbot) return;
  window.__anahumChatbot = true;

  const script = document.currentScript;
  const scriptUrl = script && script.src ? new URL(script.src, location.href) : new URL(location.href);
  const cfg = {
    endpoint: (script && script.dataset.endpoint) || new URL('/api/chat', scriptUrl).href,
    title: (script && script.dataset.title) || 'anahum assistant',
    greeting:
      (script && script.dataset.greeting) ||
      'Hi, I am the anahum assistant. Ask me about our services, pricing or how we work.',
    position: script && script.dataset.position === 'left' ? 'left' : 'right',
    cssUrl: new URL('./chatbot.css', scriptUrl).href,
  };
  const SUGGESTIONS = ['What services do you offer?', 'How much does it cost?', 'How does the process work?'];
  const STORAGE_KEY = 'anahum-chat-v1';
  const MAX_INPUT = 1000;

  /** @type {{role: 'user'|'assistant', content: string}[]} */
  let history = [];
  let busy = false;

  // ---------- storage (best-effort) ----------
  function load() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) history = saved.filter((m) => m && typeof m.content === 'string');
    } catch {
      history = [];
    }
  }
  function save() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-30)));
    } catch {
      /* storage can be blocked; the chat still works */
    }
  }

  // ---------- DOM ----------
  const host = document.createElement('div');
  host.id = 'anahum-chatbot';
  const root = host.attachShadow({ mode: 'open' });

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cfg.cssUrl;
  root.appendChild(link);

  const wrap = document.createElement('div');
  wrap.className = `ahc ahc--${cfg.position}`;
  wrap.innerHTML = `
    <button type="button" class="ahc-launcher" aria-label="Open chat" aria-expanded="false" aria-controls="ahc-panel">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z"/></svg>
    </button>
    <section class="ahc-panel" id="ahc-panel" role="dialog" aria-label="Chat with anahum" hidden>
      <header class="ahc-head">
        <span class="ahc-dot" aria-hidden="true"></span>
        <div class="ahc-head-text">
          <strong class="ahc-title"></strong>
          <span class="ahc-sub">AI assistant</span>
        </div>
        <button type="button" class="ahc-close" aria-label="Close chat">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>
      <div class="ahc-log" role="log" aria-live="polite" aria-relevant="additions"></div>
      <div class="ahc-chips"></div>
      <form class="ahc-form" autocomplete="off">
        <label class="ahc-sr" for="ahc-input">Your message</label>
        <textarea id="ahc-input" class="ahc-input" rows="1" maxlength="${MAX_INPUT}" placeholder="Type your question"></textarea>
        <button type="submit" class="ahc-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
        </button>
      </form>
    </section>`;
  root.appendChild(wrap);

  const $ = (sel) => wrap.querySelector(sel);
  const launcher = $('.ahc-launcher');
  const panel = $('.ahc-panel');
  const closeBtn = $('.ahc-close');
  const log = $('.ahc-log');
  const chips = $('.ahc-chips');
  const form = $('.ahc-form');
  const input = $('.ahc-input');
  const sendBtn = $('.ahc-send');
  $('.ahc-title').textContent = cfg.title;

  // ---------- rendering ----------
  const URL_RE = /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g;

  /** Safe renderer: only text nodes and https links, never innerHTML. */
  function fillText(el, text) {
    const lines = String(text).split('\n');
    lines.forEach((line, i) => {
      if (i > 0) el.appendChild(document.createElement('br'));
      let last = 0;
      for (const match of line.matchAll(URL_RE)) {
        if (match.index > last) el.appendChild(document.createTextNode(line.slice(last, match.index)));
        const a = document.createElement('a');
        a.href = match[0];
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = match[0];
        el.appendChild(a);
        last = match.index + match[0].length;
      }
      if (last < line.length) el.appendChild(document.createTextNode(line.slice(last)));
    });
  }

  function addMessage(role, text, extraClass) {
    const el = document.createElement('div');
    el.className = `ahc-msg ahc-msg--${role}${extraClass ? ` ${extraClass}` : ''}`;
    fillText(el, text);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'ahc-msg ahc-msg--assistant ahc-typing';
    el.setAttribute('aria-label', 'Assistant is typing');
    el.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function renderChips() {
    chips.textContent = '';
    if (history.length > 0) return;
    SUGGESTIONS.forEach((text) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ahc-chip';
      b.textContent = text;
      b.addEventListener('click', () => send(text));
      chips.appendChild(b);
    });
  }

  function renderAll() {
    log.textContent = '';
    addMessage('assistant', cfg.greeting);
    history.forEach((m) => addMessage(m.role, m.content));
    renderChips();
  }

  // ---------- chat ----------
  async function send(text) {
    const content = String(text || '').trim().slice(0, MAX_INPUT);
    if (!content || busy) return;
    busy = true;
    sendBtn.disabled = true;

    history.push({ role: 'user', content });
    addMessage('user', content);
    input.value = '';
    autosize();
    renderChips();
    save();

    const typing = showTyping();
    try {
      const res = await fetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json().catch(() => ({}));
      typing.remove();
      if (!res.ok || !data.reply) throw new Error(data.error || 'Request failed');
      history.push({ role: 'assistant', content: data.reply });
      addMessage('assistant', data.reply);
      save();
    } catch (err) {
      typing.remove();
      addMessage(
        'assistant',
        err && err.message && err.message !== 'Failed to fetch' && err.message !== 'Request failed'
          ? err.message
          : 'Something went wrong. Please try again in a moment.',
        'ahc-msg--error'
      );
    } finally {
      busy = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  function autosize() {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  }

  // ---------- open / close ----------
  function setOpen(open) {
    panel.hidden = !open;
    launcher.hidden = open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) {
      requestAnimationFrame(() => {
        log.scrollTop = log.scrollHeight;
        input.focus();
      });
    } else {
      launcher.focus();
    }
  }

  launcher.addEventListener('click', () => setOpen(true));
  closeBtn.addEventListener('click', () => setOpen(false));
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send(input.value);
  });
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      send(input.value);
    }
  });

  // ---------- boot ----------
  function boot() {
    load();
    renderAll();
    document.body.appendChild(host);
  }
  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot, { once: true });

  // Small public API: window.anahumChatbot.open() / .close()
  window.anahumChatbot = { open: () => setOpen(true), close: () => setOpen(false) };
})();
