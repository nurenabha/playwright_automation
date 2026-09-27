import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_047 - Verify repeated recovery requests are rate-limited', async ({ page }) => {

    const emailInput = page.getByRole('textbox', { name: /email/i });
    const sendRecoveryButton = page.getByRole('button', {name: /Send recovery link/i,});

    const validEmail = reportingTool.validEmail;

    // Submit the same recovery request multiple times (form is replaced after each submit, so reload it)
    for (let i = 1; i <= 5; i++) {
        await page.goto(reportingTool.forgotPasswordUrl);
        await emailInput.fill(validEmail);

        const responsePromise = page.waitForResponse('**/api/core/auth/password-recovery/requests');
        await sendRecoveryButton.click();
        const response = await responsePromise;
        console.log(`Request ${i}: status ${response.status()}`);
    }

    // Verify rate-limit/throttle message
    await expect(page.getByText(/too many requests|too many attempts|try again later|rate limit|please wait/i)).toBeVisible();

});