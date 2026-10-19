import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/projects', '/projects/erp-integration', '/projects/mikey', '/projects/wyngaarden', '/projects/agentauth', '/projects/analytics', '/projects/nerve', '/projects/dreamsynth', '/resume', '/contact', '/ask', '/now', '/back-issues', '/mikey', '/terminal', '/read'];

for (const path of ROUTES) {
  test(`${path} has a working share preview`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    expect(og, 'og:image').toBeTruthy();
    const local = new URL(og!).pathname;
    const img = await request.get(local);
    expect(img.status(), local).toBe(200);
    expect(img.headers()['content-type']).toContain('image/png');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image"');
    expect(html).toMatch(/<script type="application\/ld\+json">\{/);
  });
}

test('robots, llms.txt and the sitemap are served', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Sitemap: https://williamdev.is-a.dev/sitemap-index.xml');
  const llms = await (await request.get('/llms.txt')).text();
  expect(llms).toContain('Business Systems Analyst');
  expect(llms).not.toMatch(/TireGuru|\+1 \(/);
  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
});
