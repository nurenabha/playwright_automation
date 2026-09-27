import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_014 - Verify password is masked', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await login.password.fill(loginData.sampleMaskedPassword);

    // type="password" makes the browser render bullets instead of the characters
    await expect(login.password).toHaveAttribute('type', 'password');
    await expect(login.password).toHaveValue(loginData.sampleMaskedPassword);
});
