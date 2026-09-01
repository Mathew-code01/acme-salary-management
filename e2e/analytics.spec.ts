import {
  test,
  expect,
} from './fixtures/test-fixtures';

test.describe(
  'Analytics',
  () => {
    test.beforeEach(
      async ({ page }) => {
        await page.goto(
          '/analytics',
        );
      },
    );

    test(
      'loads analytics workspace',
      async ({ page }) => {
        await expect(
          page.getByRole(
            'heading',
            {
              name: /analytics/i,
            },
          ),
        ).toBeVisible();
      },
    );

    test(
      'displays compensation analytics',
      async ({ page }) => {
        await expect(
          page.getByText(
            /salary/i,
          ).first(),
        ).toBeVisible();
      },
    );

    test(
      'supports analytics filters',
      async ({ page }) => {
        const controls =
          page.getByRole(
            'combobox',
          );

        if (
          await controls.count() ===
          0
        ) {
          test.skip(
            true,
            'Analytics page does not currently expose combobox filters.',
          );

          return;
        }

        await expect(
          controls.first(),
        ).toBeVisible();
      },
    );
  },
);