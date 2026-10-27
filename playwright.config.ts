import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config — separate layer from Vitest (src/**). `pnpm test` runs only unit
 * tests; `pnpm test:e2e` runs these. Browsers: `npx playwright install`.
 * The contact form POSTs to a path Playwright intercepts, so no test ever
 * reaches Web3Forms.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_CONTACT_ENDPOINT: 'http://localhost:5173/__test/contact',
      VITE_CONTACT_ACCESS_KEY: 'test',
    },
  },
});
