import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_009 - Verify login with invalid email and valid password', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.email.fill(loginData.unknownEmail);
    await login.password.fill(loginData.validFormatPassword);

    const response = await submitLogin(page, () => login.loginButton.click());

    expect(response.status()).toBe(401);
    await expect(login.invalidCredentialsError).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
});
