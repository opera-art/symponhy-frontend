import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');

  // Verifica se a página carregou
  await expect(page).toHaveTitle(/Symponhy/i);
});

test('health check - backend is running', async ({ request }) => {
  const response = await request.get('http://localhost:3001/health');

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.status).toBe('ok');
});
