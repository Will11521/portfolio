import { test, expect } from '@playwright/test';

const SITE = 'https://williamdev.is-a.dev';
const ROUTES = ['/', '/projects', '/projects/erp-integration', '/projects/mikey', '/projects/wyngaarden', '/resume', '/contact', '/ask', '/now', '/back-issues', '/mikey', '/terminal', '/read'];

for (const path of ROUTES) {
  test(`route ${path} is a complete page`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html.match(/<h1[\s>]/g)?.length).toBe(1);
    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toContain(`<link rel="canonical" href="${SITE}${path === '/' ? '' : path}"`);
    expect(html).toMatch(/<meta name="description" content="[^"]+"/);
  });
}

test('deep links render their own window', async ({ page }) => {
  await page.goto('/projects/mikey');
  await expect(page.locator('[data-window="project-mikey"][data-focus]')).toBeVisible();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('a case study is reachable from Projects', async ({ page }) => {
    await page.goto('/projects');
    await page.locator('[data-window="projects"]').getByRole('link', { name: /Mikey/ }).first().click();
    await expect(page).toHaveURL(/\/projects\/mikey$/);
    await expect(page.getByRole('heading', { level: 1, name: /Mikey/ })).toBeVisible();
  });
});
