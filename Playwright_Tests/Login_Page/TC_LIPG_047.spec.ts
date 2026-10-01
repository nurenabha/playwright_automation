import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_047 - Verify returning to Login from Forgot Password', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // 1. Click Forgot Password
    await login.forgotPassword.click();
    await expect(page).toHaveURL(reportingTool.forgotPasswordUrl);
    await expect(page.getByRole('heading', { name: 'Reset your password' })).toBeVisible();

    // 2. Click Back to login: the login page is shown again
    await page.getByRole('button', { name: 'Back to login' }).click();
    await expect(page).toHaveURL(reportingTool.loginUrl);
    await expect(login.heading).toBeVisible();
    await expect(login.form).toBeVisible();
    await expect(login.email).toBeEditable();
    await expect(login.password).toBeEditable();
    await expect(login.loginButton).toBeEnabled();
});
