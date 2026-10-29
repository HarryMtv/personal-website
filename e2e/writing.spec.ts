import { expect, test } from '@playwright/test';

test('a TOC click scrolls and highlights the item', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) < 900, 'desktop viewport only');
  await page.goto('/writing/telegram-pm-hub-in-5-days');
  await expect(page.getByRole('button', { name: /contents/i })).toBeHidden();
  const toc = page.getByRole('navigation', { name: 'Contents' });
  await expect(toc.getByRole('link', { name: /day 1/i })).toHaveAttribute(
    'aria-current',
    'location',
  );
  await toc.getByRole('link', { name: /day 5/i }).click();
  await expect(page).toHaveURL(/#day-5/);
  await expect(toc.getByRole('link', { name: /day 5/i })).toHaveAttribute(
    'aria-current',
    'location',
  );
  const headingBox = await page.locator('#day-5--deploy').boundingBox();
  expect(headingBox?.y ?? 0).toBeGreaterThanOrEqual(55);
});

test('the TOC stays in view and follows the scroll', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) < 900, 'desktop viewport only');
  await page.goto('/writing/telegram-pm-hub-in-5-days');
  const toc = page.getByRole('navigation', { name: 'Contents' });

  await page.locator('#day-3--development').evaluate((element) => {
    window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 100);
  });

  await expect(toc.getByRole('link', { name: /day 3/i })).toHaveAttribute(
    'aria-current',
    'location',
  );
  const box = await toc.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.y ?? -1).toBeGreaterThanOrEqual(0);
  expect(box?.y ?? 999).toBeLessThanOrEqual(120);
});

test('the article uses the full width and the contents bar sticks', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) >= 900, 'mobile viewport only');
  await page.goto('/writing/telegram-pm-hub-in-5-days');
  // Routes are code-split, so wait for the window to render before checking
  // running animations; otherwise `getAnimations()` runs on the empty shell.
  await expect(page.locator('[data-window]').first()).toBeVisible();
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.playState !== 'running'),
  );

  await expect(page.getByRole('navigation', { name: 'Contents' })).toBeHidden();

  const toggle = page.getByRole('button', { name: /contents/i });
  const prose = page.locator('h1').locator('..');
  const proseBox = await prose.boundingBox();
  const initialToggleBox = await toggle.boundingBox();
  expect(proseBox?.width ?? 0).toBeGreaterThan(300);
  expect(proseBox?.width).toBe(initialToggleBox?.width);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);

  await page.locator('#day-3--development').evaluate((element) => {
    window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 100);
  });

  await expect(toggle).toContainText('Day 3');
  const toggleBox = await toggle.boundingBox();
  expect(toggleBox?.y ?? -1).toBeGreaterThanOrEqual(54);
  expect(toggleBox?.y ?? 999).toBeLessThanOrEqual(56);

  const h1YBeforeOpen = (await page.locator('h1').boundingBox())?.y;
  await toggle.click();
  const h1YAfterOpen = (await page.locator('h1').boundingBox())?.y;
  expect(h1YAfterOpen).toBe(h1YBeforeOpen);

  await page
    .getByRole('navigation', { name: 'Contents' })
    .getByRole('link', { name: /day 5/i })
    .click();

  await expect(page).toHaveURL(/#day-5/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toContainText('Day 5');

  const headingBox = await page.locator('#day-5--deploy').boundingBox();
  const settledToggleBox = await toggle.boundingBox();
  expect(headingBox?.y ?? 0).toBeGreaterThanOrEqual(
    (settledToggleBox?.y ?? 55) + (settledToggleBox?.height ?? 38),
  );

  // Escape with dropdown open closes only the dropdown and focuses the toggle.
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await expect(page).toHaveURL(/\/writing\/telegram-pm-hub-in-5-days#day-5/);

  // Escape still only closes the dropdown once focus has left the bar.
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Shift+Tab');
  await expect(toggle).not.toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/\/writing\/telegram-pm-hub-in-5-days#day-5/);

  // Escape with dropdown closed closes the window.
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/writing$/);
});

test('switches cleanly between mobile bar (768x1024) and desktop column across 900px', async ({
  page,
}) => {
  test.skip((page.viewportSize()?.width ?? 1440) < 900, 'runs once in desktop project');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/writing/telegram-pm-hub-in-5-days');

  const toggle = page.getByRole('button', { name: /contents/i });
  await expect(toggle).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Contents' })).toBeHidden();

  const proseBox768 = await page.locator('h1').locator('..').boundingBox();
  const toggleBox768 = await toggle.boundingBox();
  expect(proseBox768?.width).toBe(toggleBox768?.width);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(toggle).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Contents' })).toBeVisible();
});
