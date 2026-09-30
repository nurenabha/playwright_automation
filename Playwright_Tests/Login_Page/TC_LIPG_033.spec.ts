import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_033 - Verify Password field can be cleared', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.password.fill(loginData.validPassword);
    await expect(login.password).toHaveValue(loginData.validPassword);

    await login.password.clear();
    await expect(login.password).toHaveValue('');

    // Accepts new input after clearing
    await login.password.fill(loginData.sampleMaskedPassword);
    await expect(login.password).toHaveValue(loginData.sampleMaskedPassword);
});
