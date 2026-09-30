import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin, LOGIN_API } from '../../utils/loginPage';

test('TC_LIPG_026 - Verify login button state while request is processing', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // Hold the request for 2s so the processing state can be observed
    await page.route(LOGIN_API, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
    });

    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.validPassword);

    // The button's accessible name changes while processing, so use its class here
    const button = page.locator('.reporting-login-button');

    await submitLogin(page, async () => {
        await login.loginButton.click();

        // Loading state: disabled (blocks duplicate submission) with a processing label
        await expect(button).toBeDisabled();
        await expect(button).toHaveText(/authenticating/i);
    });

    // Request finished: user is logged in
    await expect(page).not.toHaveURL(/\/login/);
});
