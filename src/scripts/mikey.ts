import { FACTS, GREETING } from '../data/assistant';

const root = document.querySelector<HTMLElement>('[data-mikey]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (root) {
  const btn = root.querySelector<HTMLButtonElement>('.mikey-btn')!;
  const bubble = root.querySelector<HTMLElement>('.bubble')!;
  const line = root.querySelector<HTMLElement>('[data-bubble-line]')!;
  const pupils = [...root.querySelectorAll<SVGCircleElement>('[data-pupil]')];
  let idle: ReturnType<typeof setTimeout>;
  let raf = 0;
  let fact = 0;
  let touched = false;

  const setOpen = (open: boolean) => {
    bubble.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  };
  const wake = () => {
    root.dataset.state = 'awake';
    clearTimeout(idle);
    idle = setTimeout(() => (root.dataset.state = 'nap'), 20_000);
  };

  btn.addEventListener('click', () => {
    touched = true;
    wake();
    line.textContent = GREETING;
    setOpen(bubble.hidden !== false);
  });
  btn.addEventListener('dblclick', (e) => {
    e.preventDefault();
    line.textContent = FACTS[fact++ % FACTS.length];
    setOpen(true);
  });
  bubble.addEventListener('click', (e) => {
    const chip = (e.target as Element).closest<HTMLAnchorElement>('[data-chip]');
    if (chip && matchMedia('(min-width: 1024px)').matches) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      document.dispatchEvent(new CustomEvent('wos:ask', { detail: { q: chip.dataset.chip } }));
    } else if ((e.target as Element).closest('a')) {
      setOpen(false);
    }
  });
  document.addEventListener('click', (e) => {
    if (!bubble.hidden && !root.contains(e.target as Node)) setOpen(false);
  });
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && !bubble.hidden) {
        e.stopImmediatePropagation();
        setOpen(false);
        btn.focus();
      }
    },
    true,
  );

  if (!reduce) {
    addEventListener('pointermove', (e) => {
      wake();
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        for (const p of pupils) {
          const r = p.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const d = Math.hypot(dx, dy) || 1;
          const k = Math.min(3, d / 40);
          p.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k}px)`;
        }
      });
    });
    setInterval(() => {
      if (root.dataset.state !== 'awake' || document.hidden) return;
      root.classList.add('blink');
      setTimeout(() => root.classList.remove('blink'), 140);
    }, 4200);
  }
  addEventListener('keydown', wake);
  wake();

  try {
    if (location.pathname === '/' && !sessionStorage.getItem('wos-greeted')) {
      sessionStorage.setItem('wos-greeted', '1');
      const phone = !matchMedia('(min-width: 1024px)').matches;
      setTimeout(() => { if (!document.querySelector('.bubble:not([hidden])')) setOpen(true); }, reduce ? 0 : 900);
      setTimeout(() => { if (!touched) setOpen(false); }, phone ? 7000 : 12_000);
    }
  } catch {}
}
