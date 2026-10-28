import { expect, test } from '@playwright/test';

test('the About hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /Frontend that stays fast at enterprise scale\./,
  );
});
