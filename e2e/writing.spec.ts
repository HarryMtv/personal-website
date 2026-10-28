import { expect, test } from '@playwright/test';

test('a TOC click scrolls and highlights the item', async ({ page }) => {
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
