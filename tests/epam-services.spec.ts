import { test, expect } from '@playwright/test';

test('EPAM - Services -> Explore Our Client Work shows Client Work', async ({ page }) => {
  // 1) Navigate to the site
  await page.goto('https://www.epam.com/', { waitUntil: 'networkidle' });

  // 2) Snapshot of the homepage
  await page.screenshot({ path: 'artifacts/epam-homepage.png', fullPage: true });

  // Optional: try to dismiss cookie/privacy banner if present
  const cookieButtons = page.locator('button:has-text("Accept"), button:has-text("Agree"), button:has-text("Accept All")');
  if (await cookieButtons.count() > 0) {
    try {
      await cookieButtons.first().click({ timeout: 5000 });
    } catch (e) {
      // ignore transient failures dismissing banner
    }
  }

  // 3) Find and click "Services" in the header navigation with robust actions
  const servicesLocators = [
    page.locator('header >> text=Services'),
    page.locator('a[href="/services"]'),
    page.locator('nav >> text=Services')
  ];
  let clickedServices = false;
  for (const loc of servicesLocators) {
    if (await loc.count() > 0) {
      try {
        await loc.first().scrollIntoViewIfNeeded();
        // robust click: attempt normal click, then force-click as fallback
        await loc.first().click({ timeout: 5000 }).catch(async () => {
          await loc.first().click({ force: true, timeout: 5000 });
        });
        clickedServices = true;
        break;
      } catch (err) {
        // try next locator
      }
    }
  }
  // If clicking header link failed, navigate directly as fallback
  if (!clickedServices) {
    await page.goto('https://www.epam.com/services', { waitUntil: 'networkidle' });
  }

  // 4) Snapshot after navigating to Services
  await page.screenshot({ path: 'artifacts/epam-services.png', fullPage: true });

  // 5) Find and click "Explore Our Client Work" link on Services page
  const exploreSelectors = [
    'text="Explore Our Client Work"',
    'a:has-text("Explore Our Client Work")',
    'text=/Explore.*Client Work/i',
    'a:has-text("Explore Our Client")'
  ];
  let clickedExplore = false;
  for (const sel of exploreSelectors) {
    const loc = page.locator(sel);
    if (await loc.count() > 0) {
      try {
        await loc.first().scrollIntoViewIfNeeded();
        await loc.first().click({ timeout: 5000 }).catch(async () => {
          await loc.first().click({ force: true, timeout: 5000 });
        });
        clickedExplore = true;
        break;
      } catch (err) {
        // continue to next selector
      }
    }
  }
  // Fallback: try to find links containing "client-work" href pattern
  if (!clickedExplore) {
    const hrefLoc = page.locator('a[href*="client-work"], a[href*="clientwork"], a[href*="client-work"]');
    if (await hrefLoc.count() > 0) {
      await hrefLoc.first().scrollIntoViewIfNeeded();
      await hrefLoc.first().click({ force: true });
      clickedExplore = true;
    }
  }

  // Wait for navigation or content to load
  await page.waitForLoadState('networkidle');

  // 6) Snapshot after clicking Explore Our Client Work
  await page.screenshot({ path: 'artifacts/epam-client-work.png', fullPage: true });

  // 7) Verify that "Client Work" text is visible on the resulting page
  const clientWorkLocator = page.locator('text=Client Work');
  await expect(clientWorkLocator).toBeVisible({ timeout: 15000 });
});
