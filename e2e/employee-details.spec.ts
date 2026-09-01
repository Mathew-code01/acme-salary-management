import { test, expect } from './fixtures/test-fixtures';

test.describe('Employee details', () => {
  test('opens an employee details page', async ({ page }) => {
    await page.goto('/employees');

    const employeeLink = page
      .getByRole('link')
      .filter({
        hasText: /employee/i,
      })
      .first();

    if ((await employeeLink.count()) === 0) {
      test.skip(true, 'No employee link is available in the seeded test environment.');

      return;
    }

    await employeeLink.click();

    await expect(page).toHaveURL(/\/employees\/\d+/);

    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('displays salary information', async ({ page }) => {
    await page.goto('/employees');

    const employeeLinks = page.locator('a[href*="/employees/"]');

    if ((await employeeLinks.count()) === 0) {
      test.skip(true, 'No employee details link is available.');

      return;
    }

    await employeeLinks.first().click();

    await expect(page.getByText(/salary/i).first()).toBeVisible();
  });
});
