import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_008 - Verify login with valid email and invalid password', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.wrongPassword);

    const response = await submitLogin(page, () => login.loginButton.click());

    expect(response.status()).toBe(401);
    await expect(login.invalidCredentialsError).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
});
