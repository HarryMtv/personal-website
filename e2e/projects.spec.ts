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

test('selecting a row on mobile keeps the scroll position', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) >= 900, 'mobile viewport only');
  await page.goto('/projects');
  // Routes are code-split, so wait for the window to render before checking
  // running animations; otherwise `getAnimations()` runs on the empty shell.
  await expect(page.locator('a[data-selected]').first()).toBeVisible();
  // Motion animations block taps on mobile for ~300ms.
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.playState !== 'running'),
  );

  const row = page.locator('a[data-selected]').last();
  await row.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  expect(before).toBeGreaterThan(0);

  await row.click();
  await expect(page).toHaveURL(/selected=create-frontstack/);
  await expect(row).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('complementary', { name: 'Preview' })).toContainText(
    'create-frontstack',
  );
  // Selection is in-place state: the router must not reset the scroll. Poll
  // so a post-commit reset would have had time to land.
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(50);
});

test('changing a filter on mobile keeps the scroll position', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) >= 900, 'mobile viewport only');
  await page.goto('/projects');
  await expect(page.locator('a[data-selected]').first()).toBeVisible();
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.playState !== 'running'),
  );

  // TypeScript leaves five of the seven rows, so the page stays tall enough
  // that the browser cannot clamp the offset back to 0.
  const tag = page.getByRole('button', { name: 'TypeScript' });
  await page.evaluate(() => window.scrollTo(0, 120));
  const before = await page.evaluate(() => window.scrollY);
  expect(before).toBeGreaterThan(0);

  await tag.click();
  await expect(page).toHaveURL(/tag=typescript/);
  await expect(page.locator('a[data-selected]')).toHaveCount(5);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(50);
});

test('opening the case study and closing back', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('link', { name: /open case study/i }).click();
  await expect(page).toHaveURL(/\/projects\/pm-telegram-hub$/);
  await expect(page.getByRole('heading', { level: 1, name: /pm telegram hub/i })).toBeVisible();
  await page.getByRole('link', { name: 'Close window' }).click();
  await expect(page).toHaveURL(/\/projects$/);
});
