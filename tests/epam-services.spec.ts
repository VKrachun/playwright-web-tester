import { test, expect } from '@playwright/test';

test.describe('EPAM Services Navigation', () => {
  test('should navigate to Services and verify Client Work page', async ({ page }) => {
    // Step 1: Navigate to EPAM homepage
    await page.goto('https://www.epam.com/');
    await page.waitForLoadState('domcontentloaded');

    // Step 2: Click Services in the header navigation
    await page.getByRole('navigation').getByText('Services').first().click();
    await page.waitForLoadState('domcontentloaded');

    // Step 3: Click Explore Our Client Work link
    await page.getByText('Explore Our Client Work').first().click();
    await page.waitForLoadState('domcontentloaded');

    // Step 4: Verify Client Work text is visible on the page
    await expect(page.getByText('Client Work').first()).toBeVisible();
  });
});
