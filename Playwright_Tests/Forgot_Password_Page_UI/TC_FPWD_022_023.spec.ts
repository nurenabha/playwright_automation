import { test, expect, Locator } from '@playwright/test';
import { reportingTool } from '../../config/config';

let emailInput: Locator;
test.beforeEach(async ({ page }) => { 
	await page.goto(reportingTool.forgotPasswordUrl); 
  emailInput = page.getByRole('textbox', { name: 'Email' });
});

test('TC_FPWD_022 - Verify email input field uses the correct input type', async ({ page }) => {

  await expect(emailInput).toBeVisible();

  // Verify input type is "email"
  await expect(emailInput).toHaveAttribute('type', 'email');
});

test('TC_FPWD_023 - Verify email field supports browser autofill via autocomplete attribute', async ({ page }) => {

  await expect(emailInput).toBeVisible();

  // Verify appropriate autocomplete attribute
  await expect(emailInput).toHaveAttribute('autocomplete', 'email');
});