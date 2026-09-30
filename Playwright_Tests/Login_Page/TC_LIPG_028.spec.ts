import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, LOGIN_API } from '../../utils/loginPage';

test('TC_LIPG_028 - Verify login when network connection fails', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // Simulate the connection dropping when the login request is sent
    await page.route(LOGIN_API, (route) => route.abort('internetdisconnected'));

    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.validFormatPassword);
    await login.loginButton.click();

    // An error is shown, and it does not wrongly blame the credentials
    await expect(login.formError).toBeVisible();
    await expect(login.formError).not.toBeEmpty();
    await expect(login.invalidCredentialsError).toBeHidden();

    // Page remains usable: still on login, fields editable, button can be pressed again
    await expect(page).toHaveURL(/\/login/);
    await expect(login.email).toBeEditable();
    await expect(login.password).toBeEditable();
    await expect(login.loginButton).toBeEnabled();
});
