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

test('zoom controls step between 50% and 150% and disable at bounds', async ({ page }) => {
  await page.goto('/cv');
  const zoomIn = page.getByRole('button', { name: 'Zoom in' });
  const zoomOut = page.getByRole('button', { name: 'Zoom out' });
  await expect(page.getByText('100%')).toBeVisible();

  for (let i = 0; i < 5; i++) await zoomIn.click();
  await expect(page.getByText('150%')).toBeVisible();
  await expect(zoomIn).toBeDisabled();

  for (let i = 0; i < 10; i++) await zoomOut.click();
  await expect(page.getByText('50%')).toBeVisible();
  await expect(zoomOut).toBeDisabled();
});
