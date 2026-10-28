import { expect, test } from '@playwright/test';

test('filters update the URL and the rows', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('button', { name: 'Work' }).click();
  await expect(page).toHaveURL(/kind=work/);
  await expect(page.locator('a[data-selected]')).toHaveCount(3);
  await expect(page.locator('a[data-selected]').first()).toContainText('table-view');
  await expect(page.locator('a[data-selected]').nth(1)).toContainText('host-app');
  await expect(page.locator('a[data-selected]').nth(2)).toContainText('qa-automation-engine');
});

test('a row click updates the preview', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('link', { name: /telegram-content-engine/ }).click();
  await expect(page).toHaveURL(/selected=telegram-content-engine/);
  await expect(page.getByRole('complementary', { name: 'Preview' })).toContainText(
    'Telegram Content Engine',
  );
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
