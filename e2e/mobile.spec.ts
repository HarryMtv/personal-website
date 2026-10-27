import { expect, test } from '@playwright/test';

// Runs in the mobile project only (see playwright.config.ts projects).
test('the mobile icon grid replaces the rails', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) >= 900, 'mobile viewport only');
  await page.goto('/');
  const grid = page.getByRole('navigation', { name: 'Desktop' });
  await expect(grid.getByRole('link')).toHaveCount(8);
  await expect(page.getByRole('navigation', { name: 'Desktop, left' })).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Desktop, right' })).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden();
});

test('no horizontal scroll', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) >= 900, 'mobile viewport only');
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
