import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_048 - Verify login after returning from Forgot Password', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // 1. Open Forgot Password
    await login.forgotPassword.click();
    await expect(page).toHaveURL(reportingTool.forgotPasswordUrl);

    // 2. Return to Login
    await page.getByRole('button', { name: 'Back to login' }).click();
    await expect(page).toHaveURL(reportingTool.loginUrl);

    // 3. Enter valid credentials
    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.validPassword);

    // 4. Submit: login works normally
    const response = await submitLogin(page, () => login.loginButton.click());
    expect(response.ok()).toBe(true);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});
