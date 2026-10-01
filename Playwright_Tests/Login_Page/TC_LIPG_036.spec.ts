import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_036 - Verify login after clearing and re-entering both fields', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.validPassword);

    // Clear both fields
    await login.email.clear();
    await login.password.clear();
    await expect(login.email).toHaveValue('');
    await expect(login.password).toHaveValue('');

    // Re-enter and submit
    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.validPassword);
    const response = await submitLogin(page, () => login.loginButton.click());

    expect(response.request().postDataJSON()).toMatchObject({
        username: loginData.validEmail,
        password: loginData.validPassword,
    });
    expect(response.ok()).toBe(true);
    await expect(page).not.toHaveURL(/\/login/);
});
