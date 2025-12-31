import { test, expect } from '@playwright/test';

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should display signup form correctly', async ({ page }) => {
    await expect(page.getByText('Create an account', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    // Fill the form with mismatching passwords
    await page.getByLabel('Full Name').fill('Test User');
    await expect(page.getByLabel('Email')).toBeVisible(); // Wait for animation if any
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm Password').fill('password456');

    // Click submit
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Expect error message
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should navigate to login page from link', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/.*login/);
  });
});
