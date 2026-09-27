import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_004 - Verify Password field is displayed', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await expect(login.password).toBeVisible();
    await expect(login.password).toHaveAttribute('placeholder', 'Enter your password');
    await expect(login.password).toHaveAttribute('type', 'password');
});
