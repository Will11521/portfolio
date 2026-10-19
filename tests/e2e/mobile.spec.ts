import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const ROUTES = ['/', '/projects/', '/projects/erp-integration/', '/projects/mikey/', '/resume/', '/contact/', '/ask/', '/terminal/', '/mikey/', '/now/', '/back-issues/', '/read/'];

test.describe('phone', () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
  for (const path of ROUTES) {
    test(`mobile has no horizontal scroll on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForTimeout(600);
      const w = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        iw: innerWidth,
        wide: [...document.querySelectorAll<HTMLElement>('.win > .body, .read')].filter((b) => b.scrollWidth > b.clientWidth + 1).map((b) => b.closest('[data-window]')?.getAttribute('data-window') ?? 'read'),
      }));
      expect(w.sw).toBeLessThanOrEqual(w.iw);
      expect(w.wide).toEqual([]);
    });
  }
  test('the tab bar reaches every app and nothing is draggable', async ({ page }) => {
    await page.goto('/');
    const tabs = page.getByRole('navigation', { name: 'Apps' });
    for (const name of ['Front Page', 'Projects', 'Mikey', 'Résumé', 'Terminal', 'Contact']) await expect(tabs.getByRole('link', { name })).toBeVisible();
    await expect(page.locator('[data-draggable]')).toHaveCount(0);
    await tabs.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/projects\/$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
  });
});

test('first-load JavaScript for the front page is under 80 KB gzipped', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  const srcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('');
  let bytes = gzipSync(inline).length;
  const seen = new Set<string>();
  const visit = (src: string) => {
    if (seen.has(src)) return;
    seen.add(src);
    const code = readFileSync(`dist${src}`, 'utf8');
    bytes += gzipSync(code).length;
    for (const m of code.matchAll(/import\s*(?:[^'"]*from\s*)?["'](\.\/[^"']+\.js)["']/g)) visit(new URL(m[1], `http://x${src}`).pathname);
  };
  srcs.forEach(visit);
  expect(bytes).toBeLessThan(80 * 1024);
});

test.describe('phone negative control', () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  test('the scroll check does catch a planted overflow', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { const d = document.createElement('div'); d.style.width = '900px'; d.style.height = '4px'; document.querySelector('[data-window="front"] > .body')!.append(d); });
    const w = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      iw: innerWidth,
      wide: [...document.querySelectorAll<HTMLElement>('.win > .body')].filter((b) => b.scrollWidth > b.clientWidth + 1).length,
    }));
    expect(w.sw > w.iw || w.wide > 0).toBe(true);
  });
});

test.describe('phone first screen', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test('nothing covers the masthead or the headline on first load', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1600);
    for (const sel of ['.masthead', 'h1']) {
      const covered = await page.locator(sel).first().evaluate((el) => {
        const r = el.getBoundingClientRect();
        const pts = [[r.left + 8, r.top + r.height / 2], [r.left + r.width / 2, r.top + r.height / 2], [r.right - 8, r.top + r.height / 2]];
        return pts.some(([x, y]) => { const hit = document.elementFromPoint(x, y); return !!hit && !el.contains(hit); });
      });
      expect(covered, sel).toBe(false);
    }
  });
  test('Mikey greets phone visitors and the greeting stays clear of the tab bar', async ({ page }) => {
    await page.goto('/');
    const bubble = page.locator('#mikey-bubble');
    await expect(bubble).toBeVisible({ timeout: 4000 });
    const b = (await bubble.boundingBox())!;
    const tabs = (await page.locator('.dock').boundingBox())!;
    expect(b.y + b.height).toBeLessThanOrEqual(tabs.y);
    expect(b.x).toBeGreaterThanOrEqual(0);
    expect(b.x + b.width).toBeLessThanOrEqual(390);
  });
  test('the cookie note waits for a first tap and never blocks the tab bar', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    await expect(page.getByRole('region', { name: 'Cookie choice' })).toBeHidden();
    await page.mouse.wheel(0, 300);
    await expect(page.getByRole('region', { name: 'Cookie choice' })).toBeVisible();
    const clip = (await page.getByRole('region', { name: 'Cookie choice' }).boundingBox())!;
    const tabs = (await page.locator('.dock').boundingBox())!;
    expect(clip.y + clip.height).toBeLessThanOrEqual(tabs.y);
  });
  test('the wallpaper dots are thumb-sized', async ({ page }) => {
    await page.goto('/');
    const box = (await page.getByRole('button', { name: 'Paper wallpaper' }).boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(28);
  });
});
