import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin, LOGIN_API } from '../../utils/loginPage';

test('TC_LIPG_049 - Verify login when authentication response is delayed', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // 3. Delay the authentication response by 3s and count how many requests are sent
    let loginRequests = 0;
    await page.route(LOGIN_API, async (route) => {
        loginRequests++;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await route.continue();
    });

    // 1-2. Enter valid credentials
    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.validPassword);

    // The button's accessible name changes while processing, so use its class here
    const button = page.locator('.reporting-login-button');

    const response = await submitLogin(page, async () => {
        // 4. Click LOGIN
        await login.loginButton.click();

        // 5. While pending: loading state is shown and the button is disabled
        await expect(button).toBeDisabled();
        await expect(button).toHaveText(/authenticating/i);

        // Try to submit again while pending, by click and by Enter
        await button.click({ force: true });
        await login.password.press('Enter');
    });

    // Only one request was sent despite the repeated attempts
    expect(loginRequests).toBe(1);

    // After the response arrives the result is shown: user is logged in
    expect(response.ok()).toBe(true);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});
