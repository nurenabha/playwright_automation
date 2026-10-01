import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_038 - Verify password case sensitivity', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // Real password with every letter's case flipped (Admin@123 -> aDMIN@123)
    const wrongCasePassword = [...loginData.validPassword]
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join('');
    expect(wrongCasePassword).not.toBe(loginData.validPassword);

    await login.email.fill(loginData.validEmail);
    await login.password.fill(wrongCasePassword);
    const response = await submitLogin(page, () => login.loginButton.click());

    expect(response.status()).toBe(401);
    await expect(login.invalidCredentialsError).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
});
