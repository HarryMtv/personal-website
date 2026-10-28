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

test('axe reports no serious or critical violations once routes settle', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ROUTES) {
    await page.goto(route);
    // Routes are code-split, so wait for the window (or the sticky note)
    // before sampling — axe on an empty shell hides in-window violations.
    await expect(page.locator('[data-window], [data-slot="sticky-note"]').first()).toBeVisible();
    // `reducedMotion: "user"` disables transform/layout animations but not
    // opacity fades; contrast measured mid-fade is bogus, so wait them out.
    await page.waitForFunction(() =>
      document.getAnimations().every((animation) => animation.playState !== 'running'),
    );
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? ''),
    );
    expect(serious, `route ${route}`).toEqual([]);
  }
});
