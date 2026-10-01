import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_043 - Verify maximum Password length', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // The app defines no password limit, so use 128 characters (a common maximum)
    const maxPassword = 'Aa1@'.repeat(32);
    expect(maxPassword).toHaveLength(128);

    await login.email.fill(loginData.validEmail);
    await login.password.fill(maxPassword);
    await expect(login.password).toHaveValue(maxPassword);

    const response = await submitLogin(page, () => login.loginButton.click());

    // Sent in full and handled as a normal failed login (no server error)
    expect(response.request().postDataJSON().password).toBe(maxPassword);
    expect(response.status()).toBe(401);
    await expect(login.invalidCredentialsError).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
});
