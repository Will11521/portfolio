import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => ((window as any).__wos = 'alive'));
});

test('opens app as window', async ({ page }) => {
  await page.getByRole('navigation', { name: 'Apps' }).getByRole('link', { name: 'Projects' }).click();
  await expect(page.locator('[data-window="projects"]')).toBeVisible();
  await expect(page).toHaveURL(/\/projects\/$/);
  expect(await page.evaluate(() => (window as any).__wos)).toBe('alive');
  await expect(page).toHaveTitle(/Projects/);
});

test('history restores windows', async ({ page }) => {
  await page.getByRole('navigation', { name: 'Apps' }).getByRole('link', { name: 'Projects' }).click();
  await page.locator('[data-window="projects"]').getByRole('link', { name: /Mikey/ }).first().click();
  await expect(page.locator('[data-window="project-mikey"]')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.locator('[data-window="projects"][data-focus]')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/localhost:\d+\/?$/);
  await expect(page.locator('[data-window="front"][data-focus]')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__wos)).toBe('alive');
});

test('keyboard open and close returns focus', async ({ page }) => {
  const link = page.getByRole('navigation', { name: 'Apps' }).getByRole('link', { name: 'Projects' });
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-window="projects"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-window="projects"]')).toHaveCount(0);
  await expect(link).toBeFocused();
  await expect(page).toHaveURL(/localhost:\d+\/?$/);
});

test('drag stays on screen', async ({ page }) => {
  await page.getByRole('navigation', { name: 'Apps' }).getByRole('link', { name: 'Projects' }).click();
  const bar = page.locator('[data-window="projects"] > .tt');
  const box = (await bar.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(-2000, -2000, { steps: 5 });
  await page.mouse.up();
  const after = (await page.locator('[data-window="projects"]').boundingBox())!;
  expect(after.x + after.width).toBeGreaterThanOrEqual(80);
  expect(after.y).toBeGreaterThanOrEqual(26);
});
