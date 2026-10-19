import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4329', ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
  webServer: { command: 'npm run build && npx astro preview --port 4329 --ignore-lock', port: 4329, reuseExistingServer: false, timeout: 180_000 },
});
