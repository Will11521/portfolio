// Renders a 1200×630 Open Graph card for every built page, using the site's real fonts.
// Run after a build: `npm run og`. Output: public/og/<slug>.png (committed) and dist/og/<slug>.png.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const font = (p) => pathToFileURL(join(root, 'node_modules', p)).href;

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const pathOf = (file) => {
  const rel = relative(dist, file).replace(/\\/g, '/').replace(/\.html$/, '');
  return rel === 'index' ? '/' : `/${rel}`;
};
const slugOf = (path) => path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'index';
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function card({ title, description }) {
  const [headline] = title.split(' — ');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: F; src: url(${font('@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2')}) format('woff2'); font-weight: 100 900; }
  @font-face { font-family: I; src: url(${font('@fontsource/inter-tight/files/inter-tight-latin-600-normal.woff2')}) format('woff2'); font-weight: 600; }
  html,body{margin:0;width:1200px;height:630px}
  body{background:radial-gradient(120% 90% at 20% 10%,#ffd9a8 0%,#f59e7b 35%,#7b5cc4 75%,#2d2a6e 100%);font-family:F,serif;color:#141210;position:relative;overflow:hidden}
  .win{position:absolute;left:64px;top:58px;width:1000px;height:470px;background:#f6f1e7;border:3px solid #141210;border-radius:6px;box-shadow:12px 12px 0 #141210}
  .tt{height:44px;border-bottom:3px solid #141210;background-image:repeating-linear-gradient(0deg,transparent 0 7px,#141210 7px 9px);display:flex;align-items:center;justify-content:center}
  .tt span{background:#f6f1e7;padding:0 16px;font-size:24px;font-weight:600}
  .in{padding:30px 46px}
  .k{font-family:I,sans-serif;font-weight:600;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:#b3261e}
  h1{font-size:${headline.length > 34 ? 60 : 76}px;line-height:1.02;margin:14px 0 18px;font-weight:750;letter-spacing:-.02em;font-variation-settings:'opsz' 144}
  p{font-size:27px;line-height:1.35;margin:0;max-width:880px}
  .f{position:absolute;left:46px;bottom:26px;font-family:I,sans-serif;font-weight:600;font-size:20px;letter-spacing:.06em}
  svg{position:absolute;right:58px;bottom:44px;width:150px;height:150px}
  </style></head><body><div class="win"><div class="tt"><span>The William</span></div><div class="in">
  <div class="k">WilliamOS · Williamjeet Singh</div><h1>${esc(headline)}</h1><p>${esc(description)}</p></div>
  <div class="f">williamdev.is-a.dev · Business Systems Analyst · Ottawa</div></div>
  <svg viewBox="0 0 64 64"><path d="M16 14l6 8M48 14l-6 8" stroke="#141210" stroke-width="3" stroke-linecap="round"/><path d="M12 26c0-8 9-13 20-13s20 5 20 13v16c0 9-9 15-20 15s-20-6-20-15z" fill="#f6f1e7" stroke="#141210" stroke-width="2.5"/><path d="M24 20h16l7 7v12l-7 7H24l-7-7V27z" fill="#c97b4a" stroke="#141210" stroke-width="2"/><circle cx="25.5" cy="33" r="6.5" fill="#fff7ea" stroke="#141210" stroke-width="2"/><circle cx="38.5" cy="33" r="6.5" fill="#fff7ea" stroke="#141210" stroke-width="2"/><circle cx="27" cy="32" r="2.6" fill="#141210"/><circle cx="40" cy="32" r="2.6" fill="#141210"/></svg>
  </body></html>`;
}

const files = await htmlFiles(dist);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await mkdir(join(root, 'public/og'), { recursive: true });
await mkdir(join(dist, 'og'), { recursive: true });
let n = 0;
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'WilliamOS');
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  await page.setContent(card({ title, description }), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const png = await sharp(await page.screenshot({ type: 'png' })).png({ palette: true, quality: 90, compressionLevel: 9 }).toBuffer();
  const slug = slugOf(pathOf(file));
  await writeFile(join(root, 'public/og', `${slug}.png`), png);
  await writeFile(join(dist, 'og', `${slug}.png`), png);
  n++;
}
await browser.close();
console.log(`og: ${n} cards written`);
