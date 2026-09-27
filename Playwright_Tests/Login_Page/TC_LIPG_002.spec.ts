import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_002 - Verify login page heading', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await expect(login.heading).toBeVisible();
    await expect(login.heading).toHaveText('Welcome to Reporting Tool');
});
