import { answer } from '../lib/assistant';
import { CHIPS, GREETING } from '../data/assistant';

const WIDE = () => matchMedia('(min-width: 1024px)').matches;
let pending: string | null = null;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function logOf(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-window="ask"] [data-ask-log]');
}

function post(q: string) {
  const log = logOf();
  if (!log) return;
  const clean = q.trim().slice(0, 200);
  if (!clean) return;
  const me = document.createElement('p');
  me.className = 'msg me';
  me.textContent = clean;
  const r = answer(clean);
  const bot = document.createElement('div');
  bot.className = 'msg bot';
  bot.innerHTML = `<p>${esc(r.text)}</p>${r.action ? `<a class="btn" href="${esc(r.action.href)}">${esc(r.action.label)} →</a>` : ''}`;
  log.append(me, bot);
  bot.scrollIntoView({ block: 'nearest' });
}

export function mountAsk(win: Element) {
  const host = win.querySelector<HTMLElement>('[data-ask]');
  if (!host || host.dataset.ready) return;
  host.dataset.ready = '1';
  host.innerHTML = `
    <div class="ask-log" data-ask-log role="log" aria-live="polite"><div class="msg bot"><p>${esc(GREETING)}</p></div></div>
    <div class="ask-chips">${CHIPS.map((c) => `<button type="button" class="chip" data-ask-chip="${esc(c)}">${esc(c)}</button>`).join('')}</div>
    <form class="ask-form" data-ask-form>
      <label class="sr-only" for="ask-input">Ask Mikey a question</label>
      <input id="ask-input" name="q" autocomplete="off" maxlength="200" placeholder="ask about William…" />
      <button class="btn" type="submit">Ask</button>
    </form>`;
  host.addEventListener('click', (e) => {
    const chip = (e.target as Element).closest<HTMLButtonElement>('[data-ask-chip]');
    if (chip) post(chip.dataset.askChip!);
  });
  host.querySelector<HTMLFormElement>('[data-ask-form]')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = host.querySelector<HTMLInputElement>('#ask-input')!;
    post(input.value);
    input.value = '';
  });
  const fromUrl = new URLSearchParams(location.search).get('q');
  if (fromUrl && location.pathname === '/ask/') post(fromUrl);
  if (pending) { post(pending); pending = null; }
}

export function ask(q: string) {
  if (document.querySelector('[data-window="ask"] [data-ask-log]')) {
    document.dispatchEvent(new CustomEvent('wos:open', { detail: { href: '/ask/' } }));
    post(q);
    return;
  }
  if (WIDE()) {
    pending = q;
    document.dispatchEvent(new CustomEvent('wos:open', { detail: { href: '/ask/' } }));
  } else {
    location.assign(`/ask/?q=${encodeURIComponent(q)}`);
  }
}
