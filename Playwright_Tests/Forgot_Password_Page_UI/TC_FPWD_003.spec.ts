import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_003 - Verify User is navigated back to the login page', async ({ page }) => {
	await page.goto(reportingTool.forgotPasswordUrl);

	// Click "Back to login"
  await page.getByRole('button', { name: 'Back to login' }).click();

  // Verify user is navigated to Login page
  await expect(page).toHaveURL(reportingTool.loginUrl);
  
});

