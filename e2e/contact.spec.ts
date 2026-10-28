import { expect, test } from '@playwright/test';

const ENDPOINT = '**/__test/contact';

async function fillForm(page: import('@playwright/test').Page) {
  await page.getByLabel('From', { exact: true }).fill('recruiter@company.com');
  await page.getByLabel(/subject/i).fill('A frontend role');
  await page.getByLabel('Message', { exact: true }).fill('We have a role you might like.');
}

test('sends successfully through the endpoint', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.fulfill({ json: { success: true } }));
  await page.goto('/contact');
  await fillForm(page);
  await page.getByRole('button', { name: /send message/i }).click();
  await expect(page.getByTestId('contact-success')).toContainText(/message sent/i);
});

test('shows the error alert with the mailto fallback on failure', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.fulfill({ status: 500, body: '{}' }));
  await page.goto('/contact');
  await fillForm(page);
  await page.getByRole('button', { name: /send message/i }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('link', { name: /email me directly/i })).toHaveAttribute(
    'href',
    /^mailto:igor\.myv@gmail\.com\?/,
  );
});

test('validation errors appear on an empty submit', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: /send message/i }).click();
  await expect(page.getByText('Enter a valid email')).toBeVisible();
  await expect(page.getByText(/10\+ characters/i)).toBeVisible();
});

test('unsent contact draft survives navigation within the tab', async ({ page }) => {
  await page.goto('/contact');
  await page.getByLabel('From', { exact: true }).fill('draft@company.com');
  await page.getByLabel('Message', { exact: true }).fill('Draft message saved in sessionStorage.');

  await page.goto('/hobbies');
  await expect(page.getByRole('heading', { level: 1, name: /off the clock/i })).toBeVisible();

  await page.goto('/contact');
  await expect(page.getByLabel('From', { exact: true })).toHaveValue('draft@company.com');
  await expect(page.getByLabel('Message', { exact: true })).toHaveValue(
    'Draft message saved in sessionStorage.',
  );
});
