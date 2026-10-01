import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_044 - Verify input beyond maximum length', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    // Far beyond any sensible limit (email max is 254)
    const overLimitEmail = `${'a'.repeat(5000)}@example.com`;
    const overLimitPassword = 'P'.repeat(5000);

    await login.email.fill(overLimitEmail);
    await login.password.fill(overLimitPassword);
    const response = await submitLogin(page, () => login.loginButton.click());

    // Rejected cleanly: a client error with a message, never a server crash
    expect(response.status(), 'Over-limit input caused a server error').toBeLessThan(500);
    expect(response.ok()).toBe(false);
    await expect(login.formError).toBeVisible();

    // Application remains stable and usable
    await expect(page).toHaveURL(/\/login/);
    await expect(login.email).toBeEditable();
    await expect(login.password).toBeEditable();
    await expect(login.loginButton).toBeEnabled();
});
