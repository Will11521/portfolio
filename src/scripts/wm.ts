// WilliamOS window manager: progressive enhancement over real pages.
// Wide screens only; on phones and without JS every link is a normal page load.
import { clamp, bringToFront, extractWindow, windowIdForPath, isAppLink } from '../lib/wm-core';

const WIDE = matchMedia('(min-width: 768px)');
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)');
const POS_KEY = 'wos-pos';
const container = document.querySelector<HTMLElement>('[data-windows]')!;
let order: string[] = [];
const openers = new Map<string, HTMLElement>();

const winEl = (id: string) => container.querySelector<HTMLElement>(`[data-window="${CSS.escape(id)}"]`);
const allWins = () => [...container.querySelectorAll<HTMLElement>('[data-window]')];
const top = () => order[order.length - 1];

function readPositions(): Record<string, { x: number; y: number }> {
  try { return JSON.parse(sessionStorage.getItem(POS_KEY) || '{}'); } catch { return {}; }
}
function savePosition(id: string, x: number, y: number) {
  const all = readPositions();
  all[id] = { x, y };
  try { sessionStorage.setItem(POS_KEY, JSON.stringify(all)); } catch {}
}

function transition(fn: () => void) {
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (d.startViewTransition && !REDUCE.matches) d.startViewTransition(fn);
  else fn();
}

function applyStack() {
  order.forEach((id, i) => winEl(id)?.style.setProperty('--z', String(i + 1)));
}

function setCurrent(id: string) {
  document.querySelectorAll<HTMLAnchorElement>('.dock a[data-app]').forEach((a) => {
    if (a.dataset.app === id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function focusWin(id: string, opts: { moveFocus?: boolean } = {}) {
  const el = winEl(id);
  if (!el) return;
  allWins().forEach((w) => {
    if (w === el) { w.setAttribute('data-focus', ''); w.id = 'win'; }
    else { w.removeAttribute('data-focus'); if (w.id === 'win') w.removeAttribute('id'); }
  });
  order = bringToFront(order, id);
  applyStack();
  setCurrent(id);
  if (el.dataset.pageTitle) document.title = el.dataset.pageTitle;
  if (opts.moveFocus !== false) el.focus({ preventScroll: true });
}

function mount(el: HTMLElement) {
  const pos = readPositions()[el.dataset.window!];
  if (pos) { el.style.setProperty('--x', `${pos.x}px`); el.style.setProperty('--y', `${pos.y}px`); }
  el.querySelector('.tt')?.setAttribute('data-draggable', '');
  document.dispatchEvent(new CustomEvent('wos:mount', { detail: el }));
}

async function open(href: string, push: boolean, opener?: HTMLElement) {
  const url = new URL(href, location.href);
  const id = windowIdForPath(url.pathname);
  if (opener) openers.set(id, opener);
  if (winEl(id)) {
    transition(() => focusWin(id));
  } else {
    let html: string;
    try {
      const res = await fetch(url.pathname, { headers: { accept: 'text/html' } });
      if (!res.ok) throw new Error(String(res.status));
      html = await res.text();
    } catch {
      location.assign(url.href);
      return;
    }
    const markup = extractWindow(html, id);
    if (!markup) { location.assign(url.href); return; }
    const tpl = document.createElement('template');
    tpl.innerHTML = markup;
    const el = tpl.content.firstElementChild as HTMLElement;
    transition(() => {
      container.append(el);
      mount(el);
      focusWin(id);
    });
  }
  if (push) history.pushState({ wid: id }, '', url.pathname);
}

function close(id: string) {
  if (id === 'front') return;
  const el = winEl(id);
  if (!el) return;
  const opener = openers.get(id);
  transition(() => {
    el.remove();
    order = order.filter((o) => o !== id);
    const next = top() ?? 'front';
    focusWin(next, { moveFocus: !opener });
    const nextEl = winEl(next);
    history.replaceState({ wid: next }, '', nextEl?.dataset.url ?? '/');
  });
  if (opener && document.contains(opener)) opener.focus();
  openers.delete(id);
}

function onClick(e: MouseEvent) {
  if (!WIDE.matches || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const target = e.target as Element;
  const closer = target.closest<HTMLAnchorElement>('[data-close]');
  if (closer) {
    e.preventDefault();
    const w = closer.closest<HTMLElement>('[data-window]');
    if (w) close(w.dataset.window!);
    return;
  }
  const a = target.closest<HTMLAnchorElement>('a[href]');
  if (!a || !isAppLink(a, location.origin)) return;
  e.preventDefault();
  const url = new URL(a.href);
  if (url.pathname === location.pathname && winEl(windowIdForPath(url.pathname))) {
    focusWin(windowIdForPath(url.pathname));
    return;
  }
  open(a.href, true, a);
}

function onPointerDown(e: PointerEvent) {
  if (!WIDE.matches) return;
  const w = (e.target as Element).closest<HTMLElement>('[data-window]');
  if (!w) return;
  const id = w.dataset.window!;
  if (id !== top()) {
    focusWin(id, { moveFocus: false });
    history.replaceState({ wid: id }, '', w.dataset.url ?? location.pathname);
  }
  const bar = (e.target as Element).closest<HTMLElement>('.tt');
  if (!bar || (e.target as Element).closest('a')) return;
  e.preventDefault();
  const rect = w.getBoundingClientRect();
  const host = container.getBoundingClientRect();
  const dx = e.clientX - rect.left;
  const dy = e.clientY - rect.top;
  bar.setPointerCapture(e.pointerId);
  const move = (ev: PointerEvent) => {
    const p = clamp({ x: ev.clientX - dx, y: ev.clientY - dy }, { w: rect.width, h: rect.height }, { w: innerWidth, h: innerHeight });
    w.style.setProperty('--x', `${p.x - host.left}px`);
    w.style.setProperty('--y', `${p.y - host.top}px`);
  };
  const up = () => {
    bar.removeEventListener('pointermove', move);
    bar.removeEventListener('pointerup', up);
    bar.removeEventListener('pointercancel', up);
    savePosition(id, parseFloat(w.style.getPropertyValue('--x')) || 0, parseFloat(w.style.getPropertyValue('--y')) || 0);
  };
  bar.addEventListener('pointermove', move);
  bar.addEventListener('pointerup', up);
  bar.addEventListener('pointercancel', up);
}

function onKey(e: KeyboardEvent) {
  if (!WIDE.matches) return;
  const id = top();
  if (e.key === 'Escape' && id && id !== 'front') {
    e.preventDefault();
    close(id);
    return;
  }
  if (e.ctrlKey && e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && order.length > 1) {
    e.preventDefault();
    const next = e.key === 'ArrowRight' ? order[0] : order[order.length - 2];
    focusWin(next);
    history.replaceState({ wid: next }, '', winEl(next)?.dataset.url ?? '/');
    return;
  }
  const el = id ? winEl(id) : null;
  if (el && document.activeElement === el && e.key.startsWith('Arrow') && !e.ctrlKey && !e.altKey) {
    e.preventDefault();
    const rect = el.getBoundingClientRect();
    const host = container.getBoundingClientRect();
    const step = 16;
    const nx = rect.left + (e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0);
    const ny = rect.top + (e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0);
    const p = clamp({ x: nx, y: ny }, { w: rect.width, h: rect.height }, { w: innerWidth, h: innerHeight });
    el.style.setProperty('--x', `${p.x - host.left}px`);
    el.style.setProperty('--y', `${p.y - host.top}px`);
    savePosition(id!, p.x - host.left, p.y - host.top);
  }
}

function onPop(e: PopStateEvent) {
  if (!WIDE.matches) { location.reload(); return; }
  const id = (e.state && e.state.wid) || windowIdForPath(location.pathname);
  if (winEl(id)) transition(() => focusWin(id));
  else open(location.pathname, false);
}

function init() {
  const wins = allWins();
  const focused = wins.find((w) => w.hasAttribute('data-focus')) ?? wins[0];
  order = wins.map((w) => w.dataset.window!).filter((id) => id !== focused?.dataset.window);
  if (focused) order.push(focused.dataset.window!);
  if (WIDE.matches) wins.forEach(mount);
  applyStack();
  history.replaceState({ wid: top() }, '', location.pathname);
  document.addEventListener('click', onClick, true);
  document.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('keydown', onKey);
  addEventListener('popstate', onPop);
}

init();
