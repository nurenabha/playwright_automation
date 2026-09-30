import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_030 - Verify valid login after previous failed attempt', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // Failed attempt first
    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.wrongPassword);
    await submitLogin(page, () => login.loginButton.click());
    await expect(login.invalidCredentialsError).toBeVisible();

    // Correct the password and submit again
    await login.password.fill(loginData.validPassword);
    const response = await submitLogin(page, () => login.loginButton.click());

    expect(response.ok()).toBe(true);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(login.form).toBeHidden();
    await expect(login.invalidCredentialsError).toBeHidden();
});
