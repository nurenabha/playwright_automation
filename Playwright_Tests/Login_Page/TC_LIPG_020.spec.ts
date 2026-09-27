import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_020 - Verify login page uses HTTPS', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);

    expect(new URL(page.url()).protocol).toBe('https:');

    // The page loaded as a secure context (no mixed-content / insecure fallback)
    expect(await page.evaluate(() => window.isSecureContext)).toBe(true);
    await expect(loginPage(page).form).toBeVisible();
});
