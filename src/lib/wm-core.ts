export interface Point { x: number; y: number }
export interface Size { w: number; h: number }

/** Keep at least 80px of a window's title bar on screen, and never above the menu bar. */
export function clamp(pos: Point, size: Size, view: Size, bar = 26): Point {
  const minX = 80 - size.w;
  const maxX = view.w - 80;
  const minY = bar;
  const maxY = view.h - 28;
  return { x: Math.min(Math.max(pos.x, minX), maxX), y: Math.min(Math.max(pos.y, minY), maxY) };
}

/** Stacking order with `id` on top (last). */
export function bringToFront(order: string[], id: string): string[] {
  return [...order.filter((o) => o !== id), id];
}

/** Outer HTML of the `[data-window=id]` element in a fetched page, or null. */
export function extractWindow(html: string, id: string): string | null {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const el = doc.querySelector(`[data-window="${CSS.escape(id)}"]`);
  return el ? el.outerHTML : null;
}

/** The window id a URL path opens: `/` → front, `/projects/x` → project-x, else the first segment. */
export function windowIdForPath(path: string): string {
  const parts = path.replace(/\/+$/, '').split('/').filter(Boolean);
  if (parts.length === 0) return 'front';
  if (parts[0] === 'projects' && parts[1]) return `project-${parts[1]}`;
  return parts[0];
}

/** True when a link should open as a window instead of a full page load. */
export function isAppLink(a: HTMLAnchorElement, origin: string): boolean {
  if (a.hasAttribute('download')) return false;
  const target = a.getAttribute('target');
  if (target && target !== '_self') return false;
  let url: URL;
  try { url = new URL(a.href); } catch { return false; }
  if (url.origin !== origin) return false;
  if (url.hash) return false;
  if (url.pathname === '/read') return false;
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return false;
  return true;
}
