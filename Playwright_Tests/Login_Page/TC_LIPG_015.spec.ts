import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_015 - Verify password visibility toggle', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.password.fill(loginData.sampleMaskedPassword);
    await expect(login.password).toHaveAttribute('type', 'password');
    await expect(login.passwordToggle).toHaveAttribute('aria-label', 'Show password');

    // Show
    await login.passwordToggle.click();
    await expect(login.password).toHaveAttribute('type', 'text');
    await expect(login.password).toHaveValue(loginData.sampleMaskedPassword);
    await expect(login.passwordToggle).toHaveAttribute('aria-label', 'Hide password');

    // Hide again
    await login.passwordToggle.click();
    await expect(login.password).toHaveAttribute('type', 'password');
});
