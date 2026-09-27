import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_001 - Verify login page loads successfully', async ({ page }) => {
    const response = await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(reportingTool.loginUrl);

    // Login form is displayed with its core controls
    await expect(login.form).toBeVisible();
    await expect(login.email).toBeVisible();
    await expect(login.password).toBeVisible();
    await expect(login.loginButton).toBeVisible();
});
