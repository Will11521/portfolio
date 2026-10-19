import { test, expect } from '@playwright/test';

test('home serves real html', async ({ request }) => {
  const res = await request.get('/');
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html).toContain('Williamjeet Singh');
  expect(html).toContain('Business Systems Analyst');
});
