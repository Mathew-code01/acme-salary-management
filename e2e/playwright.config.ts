import { defineConfig, devices } from '@playwright/test';

const clientUrl = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: '.',

  fullyParallel: true,

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never',
      },
    ],
    ['list'],
  ],

  use: {
    baseURL: clientUrl,

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    navigationTimeout: 15_000,

    actionTimeout: 10_000,

    testIdAttribute: 'data-testid',
  },

  expect: {
    timeout: 5_000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',

    cwd: '../client',

    url: clientUrl,

    reuseExistingServer: !process.env.CI,

    timeout: 120_000,
  },
});
