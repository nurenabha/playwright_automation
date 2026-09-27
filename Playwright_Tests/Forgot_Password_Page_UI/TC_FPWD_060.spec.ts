import { test, expect } from '@playwright/test'; 
import { reportingTool } from '../../config/config'; 

test('TC_FPWD_060 - Verify email field does not retain a value previously entered on the Login page', async ({ page }) => { 
	await page.goto(reportingTool.loginUrl); 

	const loginEmailField = page.getByRole('textbox', { name: /email/i });
	await loginEmailField.fill(reportingTool.validEmail);

	await page.getByRole('button', { name: /forgot password/i }).click();
	await page.waitForURL(reportingTool.forgotPasswordUrl);

	const forgotPasswordEmail = page.getByRole('textbox', { name: /email/i });

	await expect(forgotPasswordEmail).toBeVisible(); 
	await expect(forgotPasswordEmail).toHaveValue(''); 

});