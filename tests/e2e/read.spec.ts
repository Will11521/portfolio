import { test, expect } from '@playwright/test';

test('read mode is one plain article', async ({ page }) => {
  await page.goto('/read');
  await expect(page.locator('[data-window]')).toHaveCount(0);
  await expect(page.locator('.dock')).toHaveCount(0);
  const h2 = await page.locator('main h2').allTextContents();
  expect(h2.slice(0, 4)).toEqual(['Now', 'Case studies', 'Clippings', 'Résumé']);
  expect(h2).toContain('Contact');
  await expect(page.getByRole('heading', { level: 3, name: /POS ↔ ERP ↔ Marketplace/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Open WilliamOS/ })).toHaveAttribute('href', '/');
});

test('the first screen answers who, what and how to reach him', async ({ page }) => {
  await page.goto('/read');
  const fold = await page.evaluate(() => {
    const out: string[] = [];
    document.querySelectorAll('main *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0 && el.children.length === 0) out.push(el.textContent || '');
    });
    return out.join(' ');
  });
  expect(fold).toContain('Business Systems Analyst');
  expect(fold).toContain('williamjeetsingh2004@gmail.com');
});

test('?read on the front page goes to read mode', async ({ page }) => {
  await page.goto('/?read');
  await expect(page).toHaveURL(/\/read$/);
});
