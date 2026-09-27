import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_017 - Verify login form submission using Enter key', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // Uses the real account when LOGIN_PASSWORD is set; otherwise a placeholder password,
    // which still proves Enter submits the form and an authentication result is shown.
    const password = loginData.validPassword || loginData.validFormatPassword;
    await login.email.fill(loginData.validEmail);
    await login.password.fill(password);

    // Press Enter in the password field instead of clicking Login
    const response = await submitLogin(page, () => login.password.press('Enter'));

    // Authentication result: success (redirect away from login) or an error message
    if (response.ok()) {
        await expect(page).not.toHaveURL(/\/login/);
    } else {
        await expect(login.invalidCredentialsError).toBeVisible();
    }
});
