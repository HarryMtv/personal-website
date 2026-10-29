import { expect, test } from '@playwright/test';

test('a TOC click scrolls and highlights the item', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) < 900, 'desktop viewport only');
  await page.goto('/writing/telegram-pm-hub-in-5-days');
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

  const prose = page.locator('h1').locator('..');
  const proseBox = await prose.boundingBox();
  expect(proseBox?.width ?? 0).toBeGreaterThan(300);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);

  await page.locator('#day-3--development').evaluate((element) => {
    window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 100);
  });

  const toggle = page.getByRole('button', { name: /contents/i });
  await expect(toggle).toContainText('Day 3');
  const toggleBox = await toggle.boundingBox();
  expect(toggleBox?.y ?? -1).toBeGreaterThanOrEqual(0);
  expect(toggleBox?.y ?? 999).toBeLessThanOrEqual(120);

  await toggle.click();
  await page
    .getByRole('navigation', { name: 'Contents' })
    .getByRole('link', { name: /day 5/i })
    .click();

  await expect(page).toHaveURL(/#day-5/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toContainText('Day 5');
});
