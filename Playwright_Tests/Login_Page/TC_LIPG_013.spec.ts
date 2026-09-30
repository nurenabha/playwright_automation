import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, LOGIN_API } from '../../utils/loginPage';

test('TC_LIPG_013 - Verify invalid email format validation', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    let loginRequestSent = false;
    await page.route(LOGIN_API, async (route) => {
        loginRequestSent = true;
        await route.continue();
    });

    await login.email.fill(loginData.malformedEmail);
    await login.password.fill(loginData.validPassword);
    await login.loginButton.click();

    // Browser's native email validation rejects the value and blocks submission
    const validationMessage = await login.email.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).not.toBe('');
    expect(await login.email.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);

    // Give a wrongly-sent request time to show up, then confirm none was made
    await page.waitForTimeout(1000);
    expect(loginRequestSent).toBe(false);
    await expect(page).toHaveURL(/\/login/);
});
