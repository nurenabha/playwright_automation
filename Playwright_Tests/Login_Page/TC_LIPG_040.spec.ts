import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_040 - Verify leading/trailing spaces in Email', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.email.fill(`  ${loginData.validEmail}  `);
    await login.password.fill(loginData.validPassword);
    const response = await submitLogin(page, () => login.loginButton.click());

    // Surrounding spaces are trimmed before sending, and the login succeeds
    expect(response.request().postDataJSON().username).toBe(loginData.validEmail);
    expect(response.ok()).toBe(true);
    await expect(page).not.toHaveURL(/\/login/);
});
