import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => {
  test.skip(
    (page.viewportSize()?.width ?? 1440) < 900,
    'the rails only exist on desktop viewports',
  );
});

test('icon clicks change the window path', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Desktop, left' })
    .getByRole('link', { name: 'Projects' })
    .click();
  await expect(page.locator('[data-window]').getByText('projects/', { exact: true })).toBeVisible();

  await page
    .getByRole('navigation', { name: 'Desktop, right' })
    .getByRole('link', { name: 'CV.pdf' })
    .click();
  await expect(page.locator('[data-window]').getByText('CV.pdf', { exact: true })).toBeVisible();
});

test('the close button opens /desktop with the note', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('link', { name: 'Close window' }).click();
  await expect(page).toHaveURL(/\/desktop$/);
  await expect(page.getByText('note.txt')).toBeVisible();
  await expect(page.getByText(/all windows closed/i)).toBeVisible();
});

test('Escape closes the window', async ({ page }) => {
  await page.goto('/stack');
  await page.getByRole('article').focus();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/desktop$/);
});

test('the header clock shows Prague time', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Praha · \d{2}:\d{2}/)).toBeVisible();
});

test('focus moves to the window after client-side navigation and no Google Fonts requests occur', async ({
  page,
}) => {
  const externalFontUrls: string[] = [];
  page.on('request', (request) => {
    if (
      request.url().includes('fonts.googleapis.com') ||
      request.url().includes('fonts.gstatic.com')
    ) {
      externalFontUrls.push(request.url());
    }
  });

  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Desktop, left' })
    .getByRole('link', { name: 'Experience' })
    .click();

  await expect(page.locator('[data-window]')).toBeFocused();
  expect(externalFontUrls).toEqual([]);
});

test('window drag resets its position after navigating to another route', async ({ page }) => {
  await page.goto('/stack');
  const titleBar = page.locator('[data-window] > div').first();
  const box = await titleBar.boundingBox();
  expect(box).not.toBeNull();

  await page.mouse.move(box!.x + 120, box!.y + 16);
  await page.mouse.down();
  await page.mouse.move(box!.x + 180, box!.y + 56, { steps: 5 });
  await page.mouse.up();

  await page
    .getByRole('navigation', { name: 'Desktop, right' })
    .getByRole('link', { name: 'Now' })
    .click();
  await expect(page).toHaveURL(/\/now$/);
  const transformAfterNav = await page
    .locator('[data-window]')
    .evaluate((el) => (el as HTMLElement).style.transform);
  expect(transformAfterNav).toBe('');
});
