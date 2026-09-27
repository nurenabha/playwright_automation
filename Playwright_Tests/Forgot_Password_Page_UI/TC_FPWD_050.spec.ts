import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_050 - Verify logical tab order across the page', async ({ page }) => {

    await page.goto(reportingTool.forgotPasswordUrl);

    //Click on the page to start keyboard navigation
    await page.getByRole('button', { name: /back to login/i }).focus();

    //Back to login should have focus
    await expect(page.getByRole('button', { name: /back to login/i })).toBeFocused();

    await page.keyboard.press('Tab');

    //Email field should receive focus
    const emailInput = page.getByRole('textbox', { name: /email/i });
    await expect(emailInput).toBeFocused();

    //Press Tab
    await page.keyboard.press('Tab');

    //Send recovery link button should receive focus
    const sendRecoveryButton = page.getByRole('button', {name: /send recovery link/i});
    await expect(sendRecoveryButton).toBeFocused();

		//Submit recovery request
    await emailInput.fill(reportingTool.validEmail);
    await sendRecoveryButton.click();

    //Wait for success state
    await expect(page.getByText(/check your email/i)).toBeVisible();

    //Locate links/buttons in success state
    const successBackToLogin = page.getByRole('button', {name: /back to login/i});
    const returnToLoginButton = page.getByRole('button', {name: /return to login/i});

    //Start focus from Back to login
    await successBackToLogin.focus();

    // Verify Back to login is focused
    await expect(successBackToLogin).toBeFocused();

    // Press Tab → Return to login
    await page.keyboard.press('Tab');

    await expect(returnToLoginButton).toBeFocused();

});