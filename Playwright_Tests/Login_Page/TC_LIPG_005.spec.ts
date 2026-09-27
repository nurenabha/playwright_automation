import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_005 - Verify Login button is displayed', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await expect(login.loginButton).toBeVisible();
    await expect(login.loginButton).toBeEnabled();
    await expect(login.loginButton).toHaveAttribute('type', 'submit');
});
