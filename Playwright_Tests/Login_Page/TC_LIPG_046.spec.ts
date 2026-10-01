import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_046 - Verify login after session expiration', async ({ page, context }) => {
    const login = loginPage(page);
    const logoutButton = page.getByRole('button', { name: 'Logout' });
    const homeUrl = new URL('/', reportingTool.loginUrl).href;

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

    // 2. Expire the session. Waiting for the real timeout is too slow, so replace the
    // session cookie (core_session) with an invalid value: the server now rejects it
    // exactly as it would an expired session.
    const sessionCookie = (await context.cookies()).find((c) => c.name === 'core_session');
    expect(sessionCookie, 'core_session cookie not set after login').toBeDefined();
    await context.addCookies([{ ...sessionCookie!, value: `expired-${Date.now()}` }]);

    // 3. Access a protected page: the server refuses the session and the app asks to log in again
    const [sessionCheck] = await Promise.all([
        page.waitForResponse('**/api/core/auth/me'),
        page.goto(homeUrl),
    ]);
    expect(sessionCheck.status()).toBe(401);
    await expect(page).toHaveURL(/\/login/);
    await expect(login.form).toBeVisible();

    // Authenticating again restores access
    await logIn();
});
