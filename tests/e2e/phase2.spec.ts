import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';

test('the terminal runs commands and drives the OS', async ({ page }) => {
  await page.goto('/terminal/');
  const term = page.locator('[data-window="terminal"]');
  const input = term.getByLabel('Terminal command');
  await input.fill('whoami');
  await input.press('Enter');
  await expect(term.locator('[data-term-out]')).toContainText('business systems analyst');
  await input.fill('theme night');
  await input.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-wallpaper', 'night');
  await input.fill('open pro');
  await input.press('Tab');
  await expect(input).toHaveValue('open projects');
  await input.press('Enter');
  await expect(page.locator('[data-window="projects"]')).toBeVisible();
});

test('terminal history recalls the last command', async ({ page }) => {
  await page.goto('/terminal/');
  const input = page.locator('[data-window="terminal"]').getByLabel('Terminal command');
  await input.fill('date');
  await input.press('Enter');
  await input.press('ArrowUp');
  await expect(input).toHaveValue('date');
});

test('the Mikey window shows the 3D owl (or its picture)', async ({ page }) => {
  await page.goto('/mikey/');
  const mount = page.locator('[data-window="mikey"] [data-mikey3d]');
  await expect(mount.locator('canvas, img').first()).toBeVisible({ timeout: 15_000 });
});

test('three.js is not in the front page first load', async () => {
  const html = readFileSync('dist/index.html', 'utf8');
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  for (const src of scripts) expect(readFileSync(`dist${src}`, 'utf8')).not.toContain('WebGLRenderer');
  const modules = readdirSync('dist/_astro').filter((f) => f.endsWith('.js'));
  expect(modules.some((f) => readFileSync(`dist/_astro/${f}`, 'utf8').includes('WebGLRenderer'))).toBe(true);
});

test('back issues show captioned screenshots of earlier sites', async ({ page }) => {
  await page.goto('/back-issues/');
  const figs = page.locator('[data-window="back-issues"] figure');
  await expect(figs).toHaveCount(2);
  for (const f of await figs.all()) {
    await expect(f.locator('img')).toHaveAttribute('alt', /.+/);
    await expect(f.locator('figcaption')).toContainText(/20(25|26)/);
  }
});
