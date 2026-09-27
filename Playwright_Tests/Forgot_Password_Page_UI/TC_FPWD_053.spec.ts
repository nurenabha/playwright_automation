import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_053 - Verify screen reader announces the heading, field label, and button names correctly', async ({ page }) => {

    await page.goto(reportingTool.forgotPasswordUrl);

    // Screen readers read from the accessibility tree (role + accessible name),
    // not the visible DOM - getByRole()/ariaSnapshot() query that same tree,
    // so this approximates what NVDA/VoiceOver would actually announce.

    // Heading should announce as "Reset your password"
    await expect(page.getByRole('heading', { name: 'Reset your password', level: 1 })).toBeVisible();

    // Email field's accessible name (from its <label>) should announce as "Email"
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();

    // Buttons should announce with their visible text, not blank/icon-only names
    await expect(page.getByRole('button', { name: 'Back to login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send recovery link' })).toBeVisible();

    // Full snapshot as a safety net: catches missing/renamed roles in one assertion
    await expect(page.locator('main')).toMatchAriaSnapshot(`
        - button "Back to login"
        - heading "Reset your password" [level=1]
        - textbox "Email"
        - button "Send recovery link"
    `);

    // Submitting replaces the form with a confirmation panel via client-side JS,
    // with no page navigation. A screen reader user needs to be told this happened -
    // either via an aria-live/role=alert/status region, or by focus moving into the
    // new content. Neither should be missing, or the success message is effectively
    // invisible to screen reader users even though it's visually on the page.
    await page.getByRole('textbox', { name: 'Email' }).fill(reportingTool.validEmail);
    await page.getByRole('button', { name: 'Send recovery link' }).click();
    await expect(page.getByText(/check your email/i)).toBeVisible();

    const announcement = await page.evaluate(() => {
        const live = document.querySelector('[aria-live], [role="alert"], [role="status"]');
        const active = document.activeElement;
        return {
            hasLiveRegion: !!live,
            focusMovedAwayFromBody: active !== document.body,
        };
    });

    expect(
        announcement.hasLiveRegion || announcement.focusMovedAwayFromBody,
        'Success message is not announced to screen readers: no aria-live/role="alert"/role="status" region, and focus was not moved into the confirmation content'
    ).toBe(true);
});
