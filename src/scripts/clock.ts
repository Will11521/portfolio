import { formatEdition, ottawaClock } from '../lib/edition';

function tick() {
  const now = new Date();
  document.querySelectorAll<HTMLTimeElement>('[data-clock]').forEach((t) => {
    t.textContent = `Ottawa · ${ottawaClock(now)}`;
    t.dateTime = now.toISOString();
  });
  document.querySelectorAll<HTMLElement>('[data-local-time]').forEach((t) => (t.textContent = `${ottawaClock(now).split(' ').pop()} in Ottawa`));
}

function stampEditions() {
  const text = formatEdition(new Date());
  document.querySelectorAll<HTMLTimeElement>('[data-edition]').forEach((t) => {
    if (t.textContent !== text) t.textContent = text;
  });
}

tick();
stampEditions();
setInterval(() => { tick(); stampEditions(); }, 30_000);
document.addEventListener('wos:mount', () => { tick(); stampEditions(); });
