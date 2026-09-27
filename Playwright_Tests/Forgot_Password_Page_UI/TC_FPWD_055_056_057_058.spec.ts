import { test, expect, Page } from '@playwright/test';
import { reportingTool } from '../../config/config';

const viewPorts = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 2560, height: 1440 },
    standard: [
        { width: 1366, height: 768 },
        { width: 1920, height: 1080 },
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 2560, height: 1440 }
    ]
};

async function loadPage(page: Page, viewport: { width: number; height: number }) {
    await page.setViewportSize(viewport);
    await page.goto(reportingTool.forgotPasswordUrl);
}

async function checkElements(page: Page) {
    await expect(page.getByRole('heading', { name: /reset your password/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /send recovery link/i })).toBeVisible();
}

async function checkNoHorizontalScroll(page: Page) {
    // 1px tolerance for sub-pixel rounding; anything beyond that is a real overflow
    const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    return overflow <= 1;
}

test('TC_FPWD_055 - Verify responsive layout on MOBILE', async ({ page }) => {
    await loadPage(page, viewPorts.mobile);
    await checkElements(page);
    expect(await checkNoHorizontalScroll(page)).toBe(true);
});

test('TC_FPWD_056 - Verify responsive layout on Tablet', async ({ page }) => {
    await loadPage(page, viewPorts.tablet);
    await checkElements(page);
    expect(await checkNoHorizontalScroll(page)).toBe(true);
});

test('TC_FPWD_057 - Verify layout on large desktop/wide-screen resolutions', async ({ page }) => {
    await loadPage(page, viewPorts.desktop);
    await checkElements(page);
    expect(await checkNoHorizontalScroll(page)).toBe(true);
});

test('TC_FPWD_058 - Verify no horizontal scrollbar appears at standard resolutions', async ({ page }) => {
    for (const viewport of viewPorts.standard) {
        await loadPage(page, viewport);
        expect(
            await checkNoHorizontalScroll(page),
            `Horizontal scrollbar is present at ${viewport.width}x${viewport.height}`
        ).toBe(true);
    }
});