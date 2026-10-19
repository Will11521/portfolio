import { test, expect } from '@playwright/test';

test.describe('first visit, dark-mode phone', () => {
  test.use({ colorScheme: 'dark' });

  test('opens on the Sunset wallpaper', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-wallpaper', 'sunset');
  });

  test('a wallpaper the visitor picked still wins', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('wos-wallpaper', 'night'));
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-wallpaper', 'night');
  });
});

test('the résumé links a downloadable PDF at the old address', async ({ page, request }) => {
  await page.goto('/resume/');
  const link = page.getByRole('link', { name: 'Download PDF' });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/Williamjeet%20Singh.pdf');
  const res = await request.get('/Williamjeet%20Singh.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/pdf');
  expect((await res.body()).subarray(0, 5).toString()).toBe('%PDF-');
});
