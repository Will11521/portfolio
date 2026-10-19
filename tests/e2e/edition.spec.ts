import { test, expect } from '@playwright/test';

// A day the site was never built on, so a build-time date can't pass by accident.
const MON = 'Monday, March 15, 2027 · Ottawa Edition · Vol. 27';

for (const path of ['/', '/read/']) {
  test(`the ${path} dateline shows the visitor's day, not the build day`, async ({ page }) => {
    await page.clock.install({ time: new Date('2027-03-15T16:00:00Z') });
    await page.goto(path);
    await expect(page.locator('.fp-dateline').first()).toHaveText(MON);
  });
}

for (const path of ['/', '/read/']) {
  test(`an open ${path} tab turns the page at midnight in Ottawa`, async ({ page }) => {
    await page.clock.install({ time: new Date('2027-03-16T03:59:50Z') }); // 23:59:50 EDT, Mon 15
    await page.goto(path);
    await expect(page.locator('.fp-dateline').first()).toHaveText(MON);
    await page.clock.runFor(60_000);
    await expect(page.locator('.fp-dateline').first()).toHaveText('Tuesday, March 16, 2027 · Ottawa Edition · Vol. 27');
  });
}
