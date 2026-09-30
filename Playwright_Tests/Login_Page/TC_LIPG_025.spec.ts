import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage, submitLogin, LOGIN_API } from '../../utils/loginPage';

test('TC_LIPG_025 - Verify multiple rapid clicks on LOGIN', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    let loginRequests = 0;
    page.on('request', (request) => {
        if (request.url().includes('/api/core/auth/login')) loginRequests++;
    });

    await login.email.fill(loginData.validEmail);
    await login.password.fill(loginData.wrongPassword);

    // Click the button's position 5 times back to back, without waiting between clicks
    const box = (await login.loginButton.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await submitLogin(page, async () => {
        for (let i = 0; i < 5; i++) await page.mouse.click(x, y);
    });

    // Give any duplicate request time to show up
    await page.waitForTimeout(1500);

    expect(loginRequests, `Expected 1 request to ${LOGIN_API}`).toBe(1);
    await expect(login.formError).toHaveCount(1);
    await expect(login.invalidCredentialsError).toHaveCount(1);
});
