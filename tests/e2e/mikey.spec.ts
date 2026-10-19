import { test, expect } from '@playwright/test';

test('clicking Mikey shows four chips', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Mikey/ }).click();
  const bubble = page.locator('#mikey-bubble');
  await expect(bubble).toBeVisible();
  await expect(bubble.locator('[data-chip]')).toHaveCount(4);
});

test('a chip opens Ask Mikey and its answer opens Contact', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Mikey/ }).click();
  await page.locator('#mikey-bubble').getByRole('link', { name: 'How do I contact him?' }).click();
  const ask = page.locator('[data-window="ask"]');
  await expect(ask).toBeVisible();
  await expect(ask.locator('.msg.me')).toHaveText('How do I contact him?');
  await ask.getByRole('link', { name: /Open Contact/ }).click();
  await expect(page.locator('[data-window="contact"]')).toBeVisible();
  await expect(page).toHaveURL(/\/contact\/$/);
});

test('typing a question gets an answer', async ({ page }) => {
  await page.goto('/ask/');
  const ask = page.locator('[data-window="ask"]');
  await ask.getByLabel('Ask Mikey a question').fill('what does he do now');
  await ask.getByRole('button', { name: 'Ask' }).click();
  await expect(ask.locator('.msg.bot').last()).toContainText('Business Systems Analyst');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('the pupils stay still', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2500);
    const pupil = page.locator('[data-pupil]').first();
    const before = await pupil.evaluate((el) => getComputedStyle(el).transform);
    await page.mouse.move(10, 10);
    await page.mouse.move(1400, 880, { steps: 4 });
    await page.waitForTimeout(200);
    expect(await pupil.evaluate((el) => getComputedStyle(el).transform)).toBe(before);
  });
});
