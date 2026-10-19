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

const browser = await chromium.launch();
for (const s of SHOTS) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(s.url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const visible = await page.evaluate(() => {
    const out = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) {
      const r = walk.currentNode.parentElement?.getBoundingClientRect();
      if (r && r.bottom > 0 && r.top < innerHeight && r.width > 0) out.push(walk.currentNode.textContent);
    }
    return out.join(' ');
  });
  if (PHONE.test(visible)) throw new Error(`${s.out}: phone number visible in the capture — not saved`);
  const png = await page.screenshot({ type: 'png' });
  await sharp(png).resize(1200).webp({ quality: 72 }).toFile(s.out);
  console.log('saved', s.out);
  await page.close();
}
await browser.close();
