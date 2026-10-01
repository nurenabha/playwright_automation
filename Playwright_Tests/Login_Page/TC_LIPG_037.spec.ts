import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, LOGIN_API } from '../../utils/loginPage';

test('TC_LIPG_037 - Verify whitespace-only Email validation', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.email.fill('   ');
    await login.password.fill(loginData.validPassword);

    const responsePromise = page.waitForResponse(LOGIN_API, { timeout: 5000 }).catch(() => null);
    await login.loginButton.click();
    const response = await responsePromise;

    if (response) {
        // Chromium/WebKit/Edge send the email as blank; the app rejects it ("username must not be blank")
        test.skip(response.status() === 429, 'Login API is rate limited (429 LOGIN_RATE_LIMITED) - rerun later');
        expect(response.ok()).toBe(false);
        await expect(login.formError).toHaveText(/must not be blank/i);
    } else {
        // Firefox blocks the submit itself with its native email validation message
        const validationMessage = await login.email.evaluate((el: HTMLInputElement) => el.validationMessage);
        expect(validationMessage).not.toBe('');
    }

    // Either way, the user is not logged in
    await expect(page).toHaveURL(/\/login/);
});
