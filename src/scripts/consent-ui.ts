import { readConsent, gtagConsentUpdate, CONSENT_DEFAULT, CONSENT_KEY, GA_ID } from '../lib/consent';

type W = Window & { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };
const w = window as unknown as W;
w.dataLayer = w.dataLayer || [];
w.gtag = function gtag() { w.dataLayer.push(arguments); } as W['gtag'];
w.gtag('consent', 'default', CONSENT_DEFAULT);

let loaded = false;
function loadAnalytics() {
  if (loaded) return;
  loaded = true;
  w.gtag('js', new Date());
  w.gtag('config', GA_ID);
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.append(s);
}

const clip = document.querySelector<HTMLElement>('[data-consent]');
const choice = readConsent(localStorage);
if (choice === 'granted') {
  w.gtag(...gtagConsentUpdate('granted'));
  ('requestIdleCallback' in window ? requestIdleCallback : setTimeout)(loadAnalytics as () => void);
} else if (choice === null && clip) {
  // Wait for a first sign of interest (scroll, tap, key) so the note never sits on the first screen.
  const show = () => {
    clip.hidden = false;
    for (const ev of ['scroll', 'pointerdown', 'keydown', 'wheel', 'touchstart']) removeEventListener(ev, show, true);
  };
  for (const ev of ['scroll', 'pointerdown', 'keydown', 'wheel', 'touchstart']) addEventListener(ev, show, { capture: true, passive: true });
}

clip?.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>('[data-consent-choice]');
  if (!btn) return;
  const c = btn.dataset.consentChoice as 'granted' | 'denied';
  try { localStorage.setItem(CONSENT_KEY, c); } catch {}
  w.gtag(...gtagConsentUpdate(c));
  if (c === 'granted') loadAnalytics();
  clip.hidden = true;
});
