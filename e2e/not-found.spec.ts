import { expect, test } from '@playwright/test';

test('an unknown path opens the 404.md window', async ({ page }) => {
  await page.goto('/nope');
  await expect(page.getByText(/this file doesn.t exist/i)).toBeVisible();
  await expect(page.getByText('404.md')).toBeVisible();
});

test('a project without a case study is a 404', async ({ page }) => {
  await page.goto('/projects/splat-tours');
  await expect(page.getByText(/this file doesn.t exist/i)).toBeVisible();
});
