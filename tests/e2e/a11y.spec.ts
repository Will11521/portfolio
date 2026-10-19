import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = ['/', '/projects/', '/projects/erp-integration/', '/projects/mikey/', '/read/', '/resume/', '/contact/', '/ask/', '/terminal/', '/back-issues/', '/now/'];
const WALLPAPERS = ['sunset', 'paper', 'night'];

for (const wp of WALLPAPERS) {
  for (const path of PAGES) {
    test(`axe: ${path} on ${wp}`, async ({ page }) => {
      await page.addInitScript((w) => { localStorage.setItem('wos-wallpaper', w); localStorage.setItem('wos-consent', 'denied'); sessionStorage.setItem('wos-greeted', '1'); }, wp);
      await page.goto(path);
      await page.waitForTimeout(1200);
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
    });
  }
}

test('axe: the consent clipping and Mikey bubble are accessible', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: /Mikey/ }).click();
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
  expect(r.violations.map((v) => v.id)).toEqual([]);
});

test('negative control: axe does catch a planted violation', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const img = document.createElement('img');
    img.src = '/favicon.svg';
    document.querySelector('[data-window="front"] .body')!.append(img);
  });
  const r = await new AxeBuilder({ page }).withTags(['wcag2a']).analyze();
  expect(r.violations.map((v) => v.id)).toContain('image-alt');
});
