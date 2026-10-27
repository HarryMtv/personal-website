import { expect, test } from '@playwright/test';

test('serves the CV PDF with the right content type', async ({ request }) => {
  const response = await request.get('/cv/igor-martynov.pdf');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
});

test('Download PDF triggers a download with the friendly filename', async ({ page }) => {
  await page.goto('/cv');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: /download pdf/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Igor-Martynov-CV.pdf');
});
