import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_016 - Verify Forgot Password navigation', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.forgotPassword.click();

    await expect(page).toHaveURL(reportingTool.forgotPasswordUrl);
    await expect(page.getByRole('heading', { name: 'Reset your password' })).toBeVisible();
});
