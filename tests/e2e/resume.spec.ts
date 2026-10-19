import { test, expect } from '@playwright/test';

test('printing the résumé hides the OS and fits two pages', async ({ page }) => {
  await page.goto('/resume/');
  await page.emulateMedia({ media: 'print' });
  for (const sel of ['.menubar', '.dock', '.icons', '[data-mikey]', '[data-window="front"]']) {
    await expect(page.locator(sel).first()).toBeHidden();
  }
  await expect(page.getByRole('heading', { level: 1, name: 'Williamjeet Singh' })).toBeVisible();
  const pdf = await page.pdf({ format: 'Letter', printBackground: false });
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  expect(pages).toBeGreaterThanOrEqual(1);
  expect(pages).toBeLessThanOrEqual(2);
});

test('the printed résumé is plain black on white with link URLs', async ({ page }) => {
  await page.goto('/resume/');
  await page.emulateMedia({ media: 'print' });
  const body = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(body).toBe('rgb(255, 255, 255)');
  const after = await page.locator('.resume a[href^="https://www.linkedin"]').first().evaluate((a) => getComputedStyle(a, '::after').content);
  expect(after).toContain('linkedin.com');
});
