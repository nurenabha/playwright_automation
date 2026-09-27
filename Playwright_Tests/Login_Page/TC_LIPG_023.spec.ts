import { test, expect } from '@playwright/test';
import { reportingTool, loginData } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_023 - Verify keyboard-only navigation', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);
    await expect(login.email).toBeVisible();

    // Reachable: Tab through the page and record every control that receives focus
    const reached = new Set<string>();
    for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab');
        const label = await page.evaluate(() => {
            const el = document.activeElement as HTMLElement;
            return el.getAttribute('placeholder') || el.getAttribute('aria-label') || el.textContent?.trim() || '';
        });
        reached.add(label);
    }

    for (const control of [
        'Enter your email',
        'Enter your password',
        'Show password',
        'Forgot Password?',
        'Login',
        'Sign in with passkey',
        'Sign in with certificate',
        'Enterprise sign-in',
    ]) {
        expect(reached, `"${control}" cannot be reached with the keyboard`).toContain(control);
    }

    // Shift+Tab moves backwards
    await login.email.focus();
    await page.keyboard.press('Tab');
    await expect(login.password).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(login.email).toBeFocused();

    // Operable: type with the keyboard, toggle visibility with Space
    await page.keyboard.type(loginData.validEmail);
    await expect(login.email).toHaveValue(loginData.validEmail);
    await page.keyboard.press('Tab');
    await page.keyboard.type(loginData.sampleMaskedPassword);
    await page.keyboard.press('Tab');
    await expect(login.passwordToggle).toBeFocused();
    await page.keyboard.press('Space');
    await expect(login.password).toHaveAttribute('type', 'text');

    // Operable: Enter activates Forgot Password
    await page.keyboard.press('Tab');
    await expect(login.forgotPassword).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(reportingTool.forgotPasswordUrl);
});
