import { expect, test } from '@playwright/test';

test('filters update the URL and the rows', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('button', { name: 'Work' }).click();
  await expect(page).toHaveURL(/kind=work/);
  await expect(page.locator('a[data-selected]')).toHaveCount(1);
  await expect(page.locator('a[data-selected]')).toContainText('universal-tree');
});

test('a row click updates the preview', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('link', { name: /distill/ }).click();
  await expect(page).toHaveURL(/selected=distill/);
  await expect(page.getByRole('complementary', { name: 'Preview' })).toContainText('Distill');
});

test('keyboard filter activation keeps focus on the filter button', async ({ page }) => {
  await page.goto('/projects');
  const work = page.getByRole('button', { name: 'Work' });
  await work.focus();
  await work.press('Enter');
  await expect(page).toHaveURL(/kind=work/);
  await expect(work).toBeFocused();
});

test('opening the case study and closing back', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('link', { name: /open case study/i }).click();
  await expect(page).toHaveURL(/\/projects\/pm-telegram-hub$/);
  await expect(page.getByRole('heading', { level: 1, name: /pm telegram hub/i })).toBeVisible();
  await page.getByRole('link', { name: 'Close window' }).click();
  await expect(page).toHaveURL(/\/projects$/);
});
