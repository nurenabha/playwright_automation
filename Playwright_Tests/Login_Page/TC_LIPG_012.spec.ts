import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_012 - Verify Password required validation', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.email.fill(loginData.validEmail);
    await submitLogin(page, () => login.loginButton.click());

    await expect(page.getByText(/password (must not be blank|is required)/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
});
