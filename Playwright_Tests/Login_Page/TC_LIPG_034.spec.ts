import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_034 - Verify user can correct invalid email', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    const isEmailValid = () => login.email.evaluate((el: HTMLInputElement) => el.validity.valid);

    // Invalid email is rejected by the browser's validation
    await login.email.fill(loginData.malformedEmail);
    await login.password.fill(loginData.validPassword);
    await login.loginButton.click();
    expect(await isEmailValid()).toBe(false);
    await expect(page).toHaveURL(/\/login/);

    // Corrected email clears the validation error
    await login.email.fill(loginData.validEmail);
    expect(await isEmailValid()).toBe(true);
    expect(await login.email.evaluate((el: HTMLInputElement) => el.validationMessage)).toBe('');

    // Submitting now goes through and logs in
    const response = await submitLogin(page, () => login.loginButton.click());
    expect(response.ok()).toBe(true);
    await expect(page).not.toHaveURL(/\/login/);
});
