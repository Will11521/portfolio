// Prints the built /resume/ page to public/Williamjeet Singh.pdf — the address the old site's résumé lived at.
// Run after editing the résumé: `npm run pdf`. The PDF is committed, like the OG cards.
import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = 4351;
const base = `http://localhost:${port}`;

const server = spawn('npx', ['astro', 'preview', '--port', String(port), '--ignore-lock'], { cwd: root, stdio: 'ignore' });
try {
  for (let i = 0; ; i++) {
    try { if ((await fetch(`${base}/resume/`)).ok) break; } catch {}
    if (i > 60) throw new Error('preview server did not start');
    await new Promise((r) => setTimeout(r, 500));
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${base}/resume/`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({ format: 'Letter', printBackground: false, preferCSSPageSize: true });
  await browser.close();
  await writeFile(join(root, 'public', 'Williamjeet Singh.pdf'), pdf);
  console.log(`pdf: ${(pdf.length / 1024).toFixed(0)} KB written`);
} finally {
  server.kill();
}
