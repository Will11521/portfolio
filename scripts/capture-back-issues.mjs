// One-off: captures the first screen of earlier site versions for /back-issues.
// Refuses to save a capture whose visible text contains a phone number.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';

const SHOTS = [
  { out: 'public/back-issues/2025-accidental-therapist.webp', url: pathToFileURL(`${homedir()}/Code/web/portfolio/portolio/index.html`).href },
  { out: 'public/back-issues/2026-cinematic.webp', url: 'http://localhost:4380/' },
];
const PHONE = /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/;
const AVAILABILITY = /available for work|open to work|hire me/i; // the site makes no availability claim

const browser = await chromium.launch();
for (const s of SHOTS) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', bypassCSP: true });
  await page.goto(s.url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(7000); // let intro animations finish
  // Hide any availability badge from the old site before the capture (a stylesheet rule survives React re-renders).
  await page.addStyleTag({ content: '.availability-badge, [class*="availability"] { visibility: hidden !important; }' });
  await page.evaluate((src) => {
    const re = new RegExp(src, 'i');
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const hits = [];
    while (walk.nextNode()) if (re.test(walk.currentNode.textContent || '')) hits.push(walk.currentNode.parentElement);
    for (const el of hits) (el?.closest('a,button') || el)?.style.setProperty('visibility', 'hidden', 'important');
  }, AVAILABILITY.source);
  const visible = await page.evaluate(() => {
    const out = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) {
      const r = walk.currentNode.parentElement?.getBoundingClientRect();
      const el = walk.currentNode.parentElement;
      const shown = el && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none';
      if (shown && r && r.bottom > 0 && r.top < innerHeight && r.width > 0) out.push(walk.currentNode.textContent);
    }
    return out.join(' ');
  });
  if (PHONE.test(visible)) throw new Error(`${s.out}: phone number visible in the capture — not saved`);
  if (AVAILABILITY.test(visible)) {
    const m = visible.match(new RegExp(`.{0,40}(${AVAILABILITY.source}).{0,40}`, 'i'));
    throw new Error(`${s.out}: availability wording visible in the capture — not saved: "${m?.[0]}"`);
  }
  const png = await page.screenshot({ type: 'png' });
  await sharp(png).resize(1200).webp({ quality: 72 }).toFile(s.out);
  console.log('saved', s.out);
  await page.close();
}
await browser.close();
