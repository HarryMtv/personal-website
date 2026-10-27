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
