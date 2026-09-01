import { test as base, expect } from '@playwright/test';

type AppFixtures = {
  dashboardPage: void;
};

export const test = base.extend<AppFixtures>({
  dashboardPage: async ({}, use) => {
    await use();
  },
});

export { expect };
