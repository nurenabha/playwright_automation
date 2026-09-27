import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_013 - Verify Email field is null after fresh load', async ({ page }) => {

	//Navigating from login page to forgot password page
	await page.goto(reportingTool.loginUrl);
	await page.getByRole('button', {name: 'Forgot Password?'}).click();

	const emailInput = page.getByRole('textbox', { name: 'Email' });

  // Verify input field is visible and null
  await expect(emailInput).toBeVisible();
	await expect(emailInput).toHaveValue('');

});