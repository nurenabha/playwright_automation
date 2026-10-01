import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_042 - Verify maximum Email length', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // 254 characters: the maximum length of an email address (RFC 5321)
    const maxEmail = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(57)}.com`;
    expect(maxEmail).toHaveLength(254);

    await login.email.fill(maxEmail);
    await login.password.fill(loginData.wrongPassword);

    // Field keeps the whole value and the browser treats it as a valid email
    await expect(login.email).toHaveValue(maxEmail);
    expect(await login.email.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(true);

    const response = await submitLogin(page, () => login.loginButton.click());

    // Sent in full and handled as a normal failed login (no server error)
    expect(response.request().postDataJSON().username).toBe(maxEmail);
    expect(response.status()).toBe(401);
    await expect(login.invalidCredentialsError).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
});
