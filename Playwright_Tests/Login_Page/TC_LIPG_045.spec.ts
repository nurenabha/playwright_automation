import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_045 - Verify logout and subsequent login', async ({ page }) => {
    const login = loginPage(page);
    const logoutButton = page.getByRole('button', { name: 'Logout' });

    const logIn = async () => {
        await login.email.fill(loginData.validEmail);
        await login.password.fill(loginData.validPassword);
        const response = await submitLogin(page, () => login.loginButton.click());
        expect(response.ok()).toBe(true);
        await expect(page).not.toHaveURL(/\/login/);
        await expect(logoutButton).toBeVisible();
    };

    // 1. Login
    await page.goto(reportingTool.loginUrl);
    await logIn();

    // 2. Logout: back on the login page
    await logoutButton.click();
    await expect(page).toHaveURL(/\/login/);
    await expect(login.form).toBeVisible();

    // Session is really ended: the app's home page sends the user back to login
    await page.goto(new URL('/', reportingTool.loginUrl).href);
    await expect(page).toHaveURL(/\/login/);

    // 3. Login again
    await logIn();
});
