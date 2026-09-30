import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, LOGIN_API } from '../../utils/loginPage';

test('TC_LIPG_029 - Verify authentication service unavailable handling', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // Simulate the authentication service being down (HTTP 503)
    await page.route(LOGIN_API, (route) =>
        route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"Service Unavailable"}' }),
    );

    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.validPassword);
    await login.loginButton.click();

    // An error is shown, and it does not wrongly blame the credentials
    await expect(login.formError).toBeVisible();
    await expect(login.formError).not.toBeEmpty();
    await expect(login.invalidCredentialsError).toBeHidden();

    // User stays on the login page and can try again
    await expect(page).toHaveURL(/\/login/);
    await expect(login.loginButton).toBeEnabled();
});
