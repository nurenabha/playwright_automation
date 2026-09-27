import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_018 - Verify generic authentication error for wrong password', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.wrongPassword);
    await submitLogin(page, () => login.loginButton.click());

    await expect(login.invalidCredentialsError).toBeVisible();

    // The error must not single out the password (which would confirm the account exists)
    const errorText = (await login.invalidCredentialsError.innerText()).toLowerCase();
    expect(errorText).not.toMatch(/(wrong|incorrect) password|password (is )?(wrong|incorrect)|user exists|account exists/);
    expect(errorText).toContain('username or password');
});
