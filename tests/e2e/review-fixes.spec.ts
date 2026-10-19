import { test, expect } from '@playwright/test';

const openCase = async (page: import('@playwright/test').Page) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Apps' }).getByRole('link', { name: 'Projects' }).click();
  await page.locator('[data-window="projects"]').getByRole('link', { name: /POS/ }).first().click();
  const win = page.locator('[data-window="project-erp-integration"]');
  await expect(win).toBeVisible();
  return win;
};

test('C1: the keyboard scrolls an open case study instead of moving the window', async ({ page }) => {
  const win = await openCase(page);
  const before = (await win.boundingBox())!;
  await page.keyboard.press('PageDown');
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => win.locator('.body').evaluate((b) => b.scrollTop)).toBeGreaterThan(0);
  const after = (await win.boundingBox())!;
  expect([after.x, after.y]).toEqual([before.x, before.y]);
});

test('C1: Alt+arrow still moves the focused window', async ({ page }) => {
  const win = await openCase(page);
  const before = (await win.boundingBox())!;
  await page.keyboard.press('Alt+ArrowRight');
  const after = (await win.boundingBox())!;
  expect(after.x).toBeGreaterThan(before.x);
});

test('I2: page load keeps the query string (campaign tags survive)', async ({ page }) => {
  await page.goto('/?utm_source=linkedin');
  await page.waitForTimeout(300);
  expect(new URL(page.url()).search).toBe('?utm_source=linkedin');
});

test('I2: a cold /ask/?q= link asks the question', async ({ page }) => {
  await page.goto('/ask/?q=What%20does%20he%20do%20now%3F');
  await expect(page.locator('[data-window="ask"] .msg.me')).toHaveText('What does he do now?');
});

test.describe('phone chips', () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  test('I2: tapping a Mikey chip on a phone answers it', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Mikey/ }).click();
    await page.locator('#mikey-bubble').getByRole('link', { name: 'What does he do now?' }).click();
    await expect(page).toHaveURL(/\/ask\/\?q=/);
    await expect(page.locator('[data-window="ask"] .msg.bot').last()).toContainText('Business Systems Analyst');
  });
  test('I5: a phone visitor can find Read the paper, Now and Back Issues', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href="/read/"]:visible').first()).toBeVisible();
    await expect(page.locator('a[href="/now/"]').first()).toBeAttached();
    await expect(page.locator('a[href="/back-issues/"]').first()).toBeAttached();
  });
});

for (const width of [768, 820, 1024]) {
  test(`I3: no sideways scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ['/', '/projects/', '/projects/erp-integration/', '/resume/', '/contact/', '/ask/']) {
      await page.goto(path);
      await page.waitForTimeout(300);
      const w = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(w, path).toBeLessThanOrEqual(width);
    }
  });
}

test.describe('storage blocked', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      for (const k of ['localStorage', 'sessionStorage']) Object.defineProperty(window, k, { get() { throw new DOMException('blocked', 'SecurityError'); } });
    });
  });
  test('I4: Ask, Terminal and Mikey still work when the browser blocks storage', async ({ page }) => {
    await page.goto('/ask/');
    await expect(page.locator('[data-window="ask"] #ask-input')).toBeVisible();
    await page.goto('/terminal/');
    await expect(page.locator('[data-window="terminal"] #term-input')).toBeVisible();
    await page.getByRole('button', { name: /Mikey/ }).click();
    await expect(page.locator('#mikey-bubble')).toBeVisible();
  });
});

test('I6: the Back Issues captions and alt text make no availability claim', async ({ page }) => {
  await page.goto('/back-issues/');
  for (const img of await page.locator('[data-window="back-issues"] figure img').all()) {
    expect(await img.getAttribute('alt')).not.toMatch(/available for work|open to work/i);
  }
});

test('I8: Back closes the windows it opened, Forward reopens them', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Apps' }).getByRole('link', { name: 'Projects' }).click();
  await page.locator('[data-window="projects"]').getByRole('link', { name: /Mikey/ }).first().click();
  await expect(page.locator('[data-window="project-mikey"]')).toBeVisible();
  await page.goBack();
  await expect(page.locator('[data-window="project-mikey"]')).toHaveCount(0);
  await expect(page.locator('[data-window="projects"][data-focus]')).toBeVisible();
  await page.goBack();
  await expect(page.locator('[data-window="projects"]')).toHaveCount(0);
  await expect(page.locator('[data-window="front"][data-focus]')).toBeVisible();
  await page.goForward();
  await expect(page.locator('[data-window="projects"][data-focus]')).toBeVisible();
});
