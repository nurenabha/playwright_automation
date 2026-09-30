import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_011 - Verify Email required validation', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.password.fill(loginData.validPassword);
    await submitLogin(page, () => login.loginButton.click());

    // The app reports the email as "username" ("username must not be blank")
    await expect(page.getByText(/(email|username) (must not be blank|is required)/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
});
