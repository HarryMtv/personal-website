import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const ROUTES = [
  '/',
  '/projects',
  '/projects/pm-telegram-hub',
  '/writing/telegram-pm-hub-in-5-days',
  '/cv',
  '/contact',
  '/desktop',
];

for (const route of ROUTES) {
  test(`axe: ${route}`, async ({ page }) => {
    await page.goto(route);
    // Dismiss nothing — the site uses no overlays.
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? ''),
    );
    expect(serious).toEqual([]);
  });
}

test('axe after route content mounts (settled DOM)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of [
    '/',
    '/projects',
    '/projects/pm-telegram-hub',
    '/writing/telegram-pm-hub-in-5-days',
    '/cv',
    '/desktop',
  ]) {
    await page.goto(route);
    await expect(page.locator('[data-window], [data-slot="sticky-note"]').first()).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? ''),
    );
    expect(serious, `route ${route}`).toEqual([]);
  }
});

test('axe after /contact mounts has zero serious contrast violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/contact');
  await expect(page.locator('[data-window]')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  );
  expect(serious).toEqual([]);
});
