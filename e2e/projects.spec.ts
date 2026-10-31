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

  // TypeScript leaves six of the eight rows, so the page stays tall enough
  // that the browser cannot clamp the offset back to 0.
  const tag = page.getByRole('button', { name: 'TypeScript' });
  await page.evaluate(() => window.scrollTo(0, 120));
  const before = await page.evaluate(() => window.scrollY);
  expect(before).toBeGreaterThan(0);

  await tag.click();
  await expect(page).toHaveURL(/tag=typescript/);
  await expect(page.locator('a[data-selected]')).toHaveCount(6);
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

test('the preview screenshot opens full size and closes back in place', async ({ page }) => {
  const isMobile = (page.viewportSize()?.width ?? 1440) < 900;
  await page.goto('/projects?selected=pm-telegram-hub');
  await expect(page.getByRole('complementary', { name: 'Preview' })).toContainText(
    'PM Telegram Hub',
  );
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.playState !== 'running'),
  );

  const trigger = page.getByRole('button', { name: 'Open full-size screenshot' });
  await trigger.scrollIntoViewIfNeeded();
  const scrollBefore = await page.evaluate(() => window.scrollY);
  // On mobile the preview sits below the list, so the page must be scrolled.
  if (isMobile) expect(scrollBefore).toBeGreaterThan(0);
  const thumbWidth = (await trigger.locator('img').boundingBox())?.width ?? 0;
  const urlBefore = page.url();

  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const image = dialog.locator('img');
  await expect(image).toHaveAttribute('src', '/images/pm-telegram-hub.png');
  // Fades are WAAPI (seen by getAnimations); the shared-layout zoom runs on
  // motion's frame loop, so give it its 0.3s before measuring the box.
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.playState !== 'running'),
  );
  await page.waitForTimeout(350);
  const lightboxWidth = (await image.boundingBox())?.width ?? 0;
  if (isMobile) {
    // The viewport caps the image: it fills the backdrop minus its padding.
    const available = (page.viewportSize()?.width ?? 390) - 48;
    expect(lightboxWidth).toBeGreaterThan(available - 40);
  } else {
    expect(lightboxWidth).toBeGreaterThan(thumbWidth);
  }

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(urlBefore);
  await expect(page.getByRole('complementary', { name: 'Preview' })).toBeVisible();
  // The scroll lock restores the exact offset; poll so a late reset shows up.
  await expect
    .poll(() => page.evaluate((from) => Math.abs(window.scrollY - from), scrollBefore))
    .toBeLessThan(2);
  await expect(trigger).toBeFocused();
});

test('escape in the case-study lightbox keeps the window open', async ({ page }) => {
  await page.goto('/projects/pm-telegram-hub');
  await expect(page.getByRole('heading', { level: 1, name: /pm telegram hub/i })).toBeVisible();
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.playState !== 'running'),
  );

  const trigger = page.getByRole('button', { name: 'Open full-size screenshot' });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  // Escape closed only the lightbox: the window (a useEscapeToClose listener)
  // would have navigated back to /projects.
  await expect(page).toHaveURL(/\/projects\/pm-telegram-hub$/);
  await expect(page.getByRole('article')).toBeVisible();
});

test('the backdrop click closes the lightbox', async ({ page }) => {
  await page.goto('/projects?selected=pm-telegram-hub');
  await expect(page.getByRole('complementary', { name: 'Preview' })).toBeVisible();
  const trigger = page.getByRole('button', { name: 'Open full-size screenshot' });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Click near the bottom-right of the backdrop. The top-right holds the
  // close button, and the TanStack Router devtools badge (dev-only, z-99999)
  // lives in the bottom-left corner.
  const box = (await dialog.boundingBox())!;
  await page.mouse.click(box.x + box.width - 16, box.y + box.height - 16);
  await expect(dialog).toBeHidden();
});
