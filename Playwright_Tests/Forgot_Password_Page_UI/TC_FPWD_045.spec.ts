import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_045 - Verify error state when recovery request fails', async ({ page }) => {

    // Simulate server error
    await page.route('**/api/core/auth/password-recovery/requests', async (route) => {
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({
                message: 'Internal Server Error'
            })
        });
    });

    // Open Forgot Password page
    await page.goto(reportingTool.forgotPasswordUrl);

    // Enter valid registered email
    const emailInput = page.getByRole('textbox', { name: /email/i });
  	const sendRecoveryButton = page.getByRole('button', {name: /Send recovery link/i,});

  	await emailInput.fill(reportingTool.validEmail);
  	await sendRecoveryButton.click();

    // Verify error message is displayed
    const errorMessage = page.getByText(/unable to|could not|failed|error|try again/i);
    await expect(errorMessage).toBeVisible();

    // Log the actual error text now that it has rendered
    console.log('Error message shown:', await errorMessage.innerText());

    // Verify success panel is NOT displayed
    await expect(page.getByText(/check your email/i)).not.toBeVisible();

});