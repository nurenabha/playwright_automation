import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_031 - Verify error state after consecutive invalid attempts', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // First invalid combination: existing email, wrong password
    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.wrongPassword);
    await submitLogin(page, () => login.loginButton.click());
    await expect(login.formError).toBeVisible();

    // Second invalid combination: unknown email, different password
    await login.email.fill(loginData.unknownEmail);
    await login.password.fill(loginData.validFormatPassword);
    const response = await submitLogin(page, () => login.loginButton.click());
    const { message } = await response.json();

    // Exactly one error, showing the latest server message (no stacked or stale errors)
    await expect(login.formError).toHaveCount(1);
    await expect(login.formError).toHaveText(message);
    await expect(page).toHaveURL(/\/login/);
});
