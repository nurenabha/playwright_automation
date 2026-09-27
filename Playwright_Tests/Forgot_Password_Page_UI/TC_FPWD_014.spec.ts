import {test, expect} from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_014 - Verify email field accepts a valid email address', async ({ page }) => {

	await page.goto(reportingTool.forgotPasswordUrl);
	const emailTextbox = page.getByRole('textbox', {name: 'Email'});

	//Click on the email field
	await emailTextbox.click();	

	// Enter a valid email address
	await emailTextbox.fill(reportingTool.validEmail);

	//Click elsewhere to remove focus from the email field
	await page.getByRole('heading', { name: 'Reset your password' }).click(); 

	// Verify email is displayed correctly await 
	expect(emailTextbox).toHaveValue(reportingTool.validEmail); 
	
	// Verify no validation error is displayed 
	await expect( page.getByText(/invalid|required|error/i) ).not.toBeVisible();
});
