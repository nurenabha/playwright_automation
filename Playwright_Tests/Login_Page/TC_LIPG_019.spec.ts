import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_019 - Verify generic error for nonexistent account', async ({ page }) => {
    const login = loginPage(page);

    const submitAndReadError = async (email: string) => {
        await page.goto(reportingTool.loginUrl);
        await login.email.fill(email);
        await login.password.fill(loginData.wrongPassword);
        await submitLogin(page, () => login.loginButton.click());
        await expect(login.invalidCredentialsError).toBeVisible();
        return (await login.invalidCredentialsError.innerText()).trim();
    };

    const nonexistentError = await submitAndReadError(loginData.nonexistentEmail);
    const existingAccountError = await submitAndReadError(loginData.validEmail);

    // No wording that reveals the account is missing
    expect(nonexistentError.toLowerCase()).not.toMatch(/not found|does not exist|no account|unknown user|not registered|no such user/);

    // Same response as a wrong password on a real account, so accounts can't be enumerated
    expect(nonexistentError).toBe(existingAccountError);
});
