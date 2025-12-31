import { test, expect } from '@playwright/test';

test('redirects to login page when not authenticated', async ({ page }) => {
  // 1. Open the main page
  await page.goto('/');

  // 2. Expect redirect to the login page
  await expect(page).toHaveURL(/.*login/);

  // 3. Check for presence of login form elements (temporary check until we see the login code)
  // Look for a heading or button indicating the login page
  // Use a more universal text search so the test won't fail if there isn't a specific ID
  await expect(page.getByText('Login to your account', { exact: true })).toBeVisible();
});
