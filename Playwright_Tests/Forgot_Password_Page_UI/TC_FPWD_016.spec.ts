import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_016 - Blank email field should show validation error', async ({ page }) => {
	await page.goto(reportingTool.forgotPasswordUrl);

	const emailInput = page.getByRole('textbox', { name: 'Email' });
	const submitButton = page.getByRole('button', { name: 'Send recovery link' });
	await submitButton.click();

	// Check browser's native validation message
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
		//console.log(`Validation message: ${validationMessage}`);

		// Validation error should be present
    expect(validationMessage).not.toBe('');
});