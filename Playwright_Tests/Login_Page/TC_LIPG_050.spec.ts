import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_050 - Verify login after temporary network failure and recovery', async ({ page, context }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // 1-2. Enter valid credentials
    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.validPassword);

    // 3. Interrupt the network connection
    await context.setOffline(true);

    // 4. Click LOGIN
    await login.loginButton.click();

    // 5. A network error is shown, and it does not wrongly blame the credentials
    await expect(login.formError).toBeVisible();
    await expect(login.formError).not.toBeEmpty();
    await expect(login.invalidCredentialsError).toBeHidden();
    await expect(page).toHaveURL(/\/login/);

    // 6. Restore the network connection
    await context.setOffline(false);

    // 7. Submit the same credentials again, without refreshing the page
    await expect(login.email).toHaveValue(loginData.validEmail);
    await expect(login.loginButton).toBeEnabled();
    const response = await submitLogin(page, () => login.loginButton.click());

    // Login succeeds and the old network error does not linger
    expect(response.ok()).toBe(true);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    await expect(login.formError).toBeHidden();
});
