import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_032 - Verify Email field can be cleared', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.email.fill(loginData.validEmail);
    await expect(login.email).toHaveValue(loginData.validEmail);

    await login.email.clear();
    await expect(login.email).toHaveValue('');

    // Accepts new input after clearing
    await login.email.fill(loginData.unknownEmail);
    await expect(login.email).toHaveValue(loginData.unknownEmail);
});
