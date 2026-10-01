import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_039 - Verify email case handling', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // Email addresses are case-insensitive, so the upper-case form must log in too
    const upperCaseEmail = loginData.validEmail.toUpperCase();

    await login.email.fill(upperCaseEmail);
    await login.password.fill(loginData.validPassword);
    const response = await submitLogin(page, () => login.loginButton.click());

    expect(response.ok()).toBe(true);
    await expect(page).not.toHaveURL(/\/login/);
});
