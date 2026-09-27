import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_048 - Verify direct URL access to Forgot Password page without prior login', async ({ page }) => {

    // Open Forgot Password page directly
    await page.goto(reportingTool.forgotPasswordUrl);

    // Verify user is not redirected to Login page
    await expect(page).toHaveURL(reportingTool.forgotPasswordUrl);
		
		//Observing the page
    await expect(page.getByRole('heading', { name: /reset your password|forgot password/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /send recovery link/i })).toBeVisible();

});

test('TC_FPWD_049 - Verify browser back button from Forgot Password to Login', async ({ page }) => {

    // Step 1: Open Login page
    await page.goto(reportingTool.loginUrl);

    // Verify Login page is displayed
    await expect(page).toHaveURL(reportingTool.loginUrl);

    // Step 2: Navigate from Login to Forgot Password
    await page.getByRole('button', { name: /forgot password/i }).click();

    // Verify Forgot Password page is displayed
    await expect(page).toHaveURL(reportingTool.forgotPasswordUrl);

    // Step 3: Click browser Back button
    await page.goBack();

    // Step 4: Verify user is returned to Login page
    await expect(page).toHaveURL(reportingTool.loginUrl);

    // Step 5: Verify Login page is in expected state
    await expect(page.getByRole('heading', { name: /welcome to reporting tool/i })).toBeVisible();

});