import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_008 - Verify the login card is centered with consistent white background, corner radius, and spacing', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto(reportingTool.forgotPasswordUrl);
    await page.waitForLoadState('networkidle');

    const card = page.locator('main > section').first();

    await expect(card).toBeVisible();

    const cardStyle = await card.evaluate((element: HTMLElement) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        return {
            backgroundColor: style.backgroundColor,
            borderRadius: style.borderRadius,
            paddingTop: style.paddingTop,
            paddingRight: style.paddingRight,
            paddingBottom: style.paddingBottom,
            paddingLeft: style.paddingLeft,
            marginLeft: style.marginLeft,
            marginRight: style.marginRight,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        };
    });

    console.log('Card background:', cardStyle.backgroundColor);
    console.log('Card border radius:', cardStyle.borderRadius);
    console.log('Card padding:', {
        top: cardStyle.paddingTop,
        right: cardStyle.paddingRight,
        bottom: cardStyle.paddingBottom,
        left: cardStyle.paddingLeft
    });

    const horizontalCenter =
        Math.abs(
            cardStyle.x +
            cardStyle.width / 2 -
            cardStyle.viewportWidth / 2
        );

    const verticalCenter =
        Math.abs(
            cardStyle.y +
            cardStyle.height / 2 -
            cardStyle.viewportHeight / 2
        );

    expect(
        horizontalCenter,
        'Card is not horizontally centered'
    ).toBeLessThanOrEqual(2);

    expect(verticalCenter,'Card is not vertically centered').toBeLessThanOrEqual(2);
    expect(cardStyle.backgroundColor,'Card background is not white').toBe('rgb(255, 255, 255)');
    expect(cardStyle.borderRadius,'Card does not have a corner radius').not.toBe('0px');

    expect(parseFloat(cardStyle.paddingTop)).toBeGreaterThan(0);
    expect(parseFloat(cardStyle.paddingRight)).toBeGreaterThan(0);
    expect(parseFloat(cardStyle.paddingBottom)).toBeGreaterThan(0);
    expect(parseFloat(cardStyle.paddingLeft)).toBeGreaterThan(0);
});