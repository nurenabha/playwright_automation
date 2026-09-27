import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage } from '../../utils/loginPage';

test('TC_LIPG_021 - Verify login card UI', async ({ page }) => {
    // The card is ~860px tall, so use a full-HD viewport where it fits without scrolling
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await expect(login.form).toBeVisible();

    const card = await login.form.evaluate((el: HTMLElement) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
            backgroundColor: style.backgroundColor,
            borderRadius: style.borderRadius,
            paddingTop: parseFloat(style.paddingTop),
            paddingRight: parseFloat(style.paddingRight),
            paddingBottom: parseFloat(style.paddingBottom),
            paddingLeft: parseFloat(style.paddingLeft),
            offsetX: Math.abs(rect.x + rect.width / 2 - window.innerWidth / 2),
            offsetY: Math.abs(rect.y + rect.height / 2 - window.innerHeight / 2),
        };
    });

    // Centered
    expect(card.offsetX, 'Card is not horizontally centered').toBeLessThanOrEqual(2);
    expect(card.offsetY, 'Card is not vertically centered').toBeLessThanOrEqual(2);

    // Background is set (not transparent) and corners are rounded
    expect(card.backgroundColor, 'Card has no background').not.toBe('rgba(0, 0, 0, 0)');
    expect(card.borderRadius, 'Card has no rounded corners').not.toBe('0px');

    // Spacing inside the card on every side
    expect(card.paddingTop).toBeGreaterThan(0);
    expect(card.paddingRight).toBeGreaterThan(0);
    expect(card.paddingBottom).toBeGreaterThan(0);
    expect(card.paddingLeft).toBeGreaterThan(0);

    // Expected layout: logo, heading, then the fields and buttons all inside the card
    for (const element of [login.logo, login.heading, login.email, login.password, login.loginButton]) {
        await expect(element).toBeVisible();
    }
});
