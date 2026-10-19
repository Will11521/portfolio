import { runCommand, complete } from '../lib/terminal';
import { WALLPAPER_KEY } from '../lib/wallpaper';

const WIDE = () => matchMedia('(min-width: 1024px)').matches;

export function mountTerminal(win: Element) {
  const host = win.querySelector<HTMLElement>('[data-terminal]');
  if (!host || host.dataset.ready) return;
  host.dataset.ready = '1';
  host.innerHTML = `
    <div class="term-out" data-term-out role="log" aria-live="polite"></div>
    <form class="term-line" data-term-form>
      <span class="term-prompt" data-term-prompt aria-hidden="true">william@os ~ $</span>
      <label class="sr-only" for="term-input">Terminal command</label>
      <input id="term-input" autocomplete="off" autocapitalize="off" spellcheck="false" />
    </form>`;
  const out = host.querySelector<HTMLElement>('[data-term-out]')!;
  const input = host.querySelector<HTMLInputElement>('#term-input')!;
  const prompt = host.querySelector<HTMLElement>('[data-term-prompt]')!;
  const history: string[] = [];
  let cursor = 0;
  let cwd = '~';

  const print = (lines: string[], cls = '') => {
    for (const l of lines) {
      const p = document.createElement('p');
      if (cls) p.className = cls;
      p.textContent = l;
      out.append(p);
    }
    out.scrollTop = out.scrollHeight;
    host.scrollIntoView({ block: 'nearest' });
  };

  print(['WilliamOS terminal. Type help, or try: whoami · ls · open projects · theme night']);

  host.querySelector('form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const cmd = input.value;
    input.value = '';
    print([`${prompt.textContent} ${cmd}`], 'echo');
    if (cmd.trim()) { history.push(cmd); cursor = history.length; }
    const r = runCommand(cmd, { cwd });
    if (r.clear) out.replaceChildren();
    print(r.out);
    if (r.cwd) { cwd = r.cwd; prompt.textContent = `william@os ${cwd} $`; }
    if (r.theme) {
      document.documentElement.dataset.wallpaper = r.theme;
      try { localStorage.setItem(WALLPAPER_KEY, r.theme); } catch {}
      dispatchEvent(new Event('wos:wallpaper'));
    }
    if (r.close) win.querySelector<HTMLAnchorElement>('[data-close]')?.click();
    if (r.open) {
      if (r.open === '/read/' || !WIDE()) location.assign(r.open);
      else document.dispatchEvent(new CustomEvent('wos:open', { detail: { href: r.open } }));
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      cursor = Math.max(0, cursor - 1);
      input.value = history[cursor];
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault();
      cursor = Math.min(history.length, cursor + 1);
      input.value = history[cursor] ?? '';
    } else if (e.key === 'Tab' && input.value.trim()) {
      const options = complete(input.value.trimStart());
      if (options.length === 1) { e.preventDefault(); input.value = options[0]; }
      else if (options.length > 1) { e.preventDefault(); print([options.join('   ')]); }
    } else if (e.key === 'Escape') {
      e.stopPropagation();
    }
  });
  if (WIDE()) input.focus({ preventScroll: true });
}
