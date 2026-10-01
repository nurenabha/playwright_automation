import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_041 - Verify special characters in password', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);
    const specialPassword = 'P@ss#123!';

    // Special characters are sent unchanged and handled as a normal wrong password (no server error)
    await login.email.fill(loginData.validEmail);
    await login.password.fill(specialPassword);
    await expect(login.password).toHaveValue(specialPassword);
    const wrongResponse = await submitLogin(page, () => login.loginButton.click());

    expect(wrongResponse.request().postDataJSON().password).toBe(specialPassword);
    expect(wrongResponse.status()).toBe(401);
    await expect(login.invalidCredentialsError).toBeVisible();

    // The real password also contains a special character (@) and logs in
    expect(loginData.validPassword).toMatch(/[^A-Za-z0-9]/);
    await login.password.fill(loginData.validPassword);
    const validResponse = await submitLogin(page, () => login.loginButton.click());

    expect(validResponse.ok()).toBe(true);
    await expect(page).not.toHaveURL(/\/login/);
});
