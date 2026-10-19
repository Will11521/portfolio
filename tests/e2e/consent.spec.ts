import { test, expect } from '@playwright/test';

test('analytics never loads before consent, and loads after Sure', async ({ page }) => {
  const ga: string[] = [];
  page.on('request', (r) => { if (/googletagmanager|google-analytics/.test(r.url())) ga.push(r.url()); });
  await page.route(/googletagmanager|google-analytics/, (r) => r.fulfill({ status: 204, body: '' }));
  await page.goto('/');
  const clip = page.getByRole('region', { name: 'Cookie choice' });
  await expect(clip).toBeVisible();
  await page.waitForTimeout(3500);
  expect(ga).toEqual([]);
  await clip.getByRole('button', { name: 'Sure' }).click();
  await expect(clip).toBeHidden();
  await expect.poll(() => ga.length).toBeGreaterThan(0);
  await page.reload();
  await expect(page.getByRole('region', { name: 'Cookie choice' })).toBeHidden();
});

test('No thanks hides the clipping and keeps analytics off', async ({ page }) => {
  const ga: string[] = [];
  page.on('request', (r) => { if (/googletagmanager|google-analytics/.test(r.url())) ga.push(r.url()); });
  await page.goto('/');
  await page.getByRole('region', { name: 'Cookie choice' }).getByRole('button', { name: 'No thanks' }).click();
  await page.reload();
  await page.waitForTimeout(3500);
  await expect(page.getByRole('region', { name: 'Cookie choice' })).toBeHidden();
  expect(ga).toEqual([]);
});
