import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_006 - Verify login with valid credentials', async ({ page }) => {
    test.skip(!loginData.validPassword, 'Needs a real account: set LOGIN_EMAIL and LOGIN_PASSWORD environment variables');

    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.validPassword);
    await login.loginButton.click();

    // Authenticated: leaves the login page and the login form is gone
    await expect(page).not.toHaveURL(/\/login/);
    await expect(login.form).toBeHidden();
    //await expect(login.invalidCredentialsError).toBeHidden();
});
