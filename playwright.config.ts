import { defineConfig, devices } from '@playwright/test';
import { AUTH_FILE } from './e2e/global-setup';

/**
 * Playwright E2E test configuration for BusMate Web Frontend.
 *
 * By default tests run against the local Next.js dev server (port 3000).
 * Set the BASE_URL env var to override, e.g. for CI against a preview deploy.
 *
 * Authentication:
 *   The global setup logs in to Asgardeo once and saves the session to
 *   .playwright/user.json. All tests reuse that session automatically.
 *   Credentials are read from .env.e2e (gitignored).
 *   See .env.e2e.example for the required variables.
 *
 * Usage:
 *   npm run test:e2e           – run all e2e tests (headless)
 *   npm run test:e2e:ui        – run with the Playwright UI
 *   npm run test:e2e:headed    – run with a visible browser
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',

  /* Global setup: logs in once and saves session; teardown: no-op (session reused). */
  globalSetup: './e2e/global-setup',
  globalTeardown: './e2e/global-teardown',

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Limit parallel workers on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter */
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
  ],

  /* Shared settings for all projects */
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    /**
     * Inject the saved Asgardeo session into every test browser context.
     * This means each test starts already authenticated — no repeated logins.
     * The file is produced by e2e/global-setup.ts.
     */
    storageState: AUTH_FILE,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* Uncomment to test in additional browsers:
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],

  /* Start the Next.js dev server before running tests (unless BASE_URL is set) */
  ...(process.env.BASE_URL
    ? {}
    : {
        webServer: {
          command: 'npm run dev',
          url: 'http://localhost:3000',
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),

  /* Output directory for test artifacts */
  outputDir: 'test-results',
});
