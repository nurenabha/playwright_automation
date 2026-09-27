import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_024 - Verify logical tab order', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    // Wait for the form to render, otherwise the first Tab presses land on nothing
    await expect(loginPage(page).email).toBeVisible();

    // Focus order should follow the visual top-to-bottom order of the form
    const expectedOrder = [
        'Enter your email',
        'Enter your password',
        'Show password',
        'Forgot Password?',
        'Login',
        'Sign in with passkey',
        'Sign in with certificate',
        'Enterprise sign-in',
    ];

    const actualOrder: string[] = [];
    for (let i = 0; i < expectedOrder.length; i++) {
        await page.keyboard.press('Tab');
        actualOrder.push(await page.evaluate(() => {
            const el = document.activeElement as HTMLElement;
            return el.getAttribute('placeholder') || el.getAttribute('aria-label') || el.textContent?.trim() || '';
        }));
    }

    expect(actualOrder).toEqual(expectedOrder);

    // Tab order also matches on-screen position (each control sits below the previous one)
    const tops = await page.evaluate(() => {
        const selectors = ['input[type="email"]', '.reporting-input-box:has(input[placeholder="Enter your password"]) input', '.forgot-link', '.reporting-login-button'];
        return selectors.map(s => document.querySelector(s)!.getBoundingClientRect().top);
    });
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);
});
