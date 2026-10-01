import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_035 - Verify user can correct invalid password', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.email.fill(loginData.validEmail);

    // Type a wrong password, then replace it before submitting
    await login.password.fill(loginData.wrongPassword);
    await login.password.fill(loginData.validPassword);
    await expect(login.password).toHaveValue(loginData.validPassword);

    const response = await submitLogin(page, () => login.loginButton.click());

    // Only the corrected password is sent, and authentication succeeds
    expect(response.request().postDataJSON().password).toBe(loginData.validPassword);
    expect(response.ok()).toBe(true);
    await expect(page).not.toHaveURL(/\/login/);
});
