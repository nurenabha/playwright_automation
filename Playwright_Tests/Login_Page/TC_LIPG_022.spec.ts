import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_022 - Verify focus state of input fields', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    const focusRing = (locator: typeof login.email) =>
        locator.evaluate((el: HTMLElement) => getComputedStyle(el).boxShadow);

    // Email field
    const emailBefore = await focusRing(login.email);
    await login.email.focus();
    await expect(login.email).toBeFocused();
    const emailFocused = await focusRing(login.email);
    expect(emailFocused, 'Email field shows no focus indicator').not.toBe(emailBefore);
    expect(emailFocused).not.toBe('none');

    // Password field
    const passwordBefore = await focusRing(login.password);
    await login.password.focus();
    await expect(login.password).toBeFocused();
    const passwordFocused = await focusRing(login.password);
    expect(passwordFocused, 'Password field shows no focus indicator').not.toBe(passwordBefore);
    expect(passwordFocused).not.toBe('none');

    // The indicator is only on the active field
    expect(await focusRing(login.email)).toBe(emailBefore);
});
