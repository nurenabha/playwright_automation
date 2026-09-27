import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_003 - Verify Email field is displayed', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await expect(login.email).toBeVisible();
    await expect(login.email).toHaveAttribute('placeholder', 'Enter your email');
    await expect(login.email).toHaveAttribute('type', 'email');
});
