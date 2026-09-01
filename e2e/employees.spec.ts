import {
  test,
  expect,
} from './fixtures/test-fixtures';

test.describe(
  'Dashboard',
  () => {
    test(
      'loads the compensation dashboard',
      async ({ page }) => {
        await page.goto('/');

        await expect(
          page.getByRole(
            'heading',
            {
              name: /dashboard/i,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            /total employees/i,
          ),
        ).toBeVisible();
      },
    );

    test(
      'navigates to employees',
      async ({ page }) => {
        await page.goto('/');

        await page.getByRole(
          'link',
          {
            name: /employees/i,
          },
        ).click();

        await expect(
          page,
        ).toHaveURL(
          /\/employees/,
        );
      },
    );

    test(
      'navigates to analytics',
      async ({ page }) => {
        await page.goto('/');

        await page.getByRole(
          'link',
          {
            name: /analytics/i,
          },
        ).click();

        await expect(
          page,
        ).toHaveURL(
          /\/analytics/,
        );
      },
    );
  },
);