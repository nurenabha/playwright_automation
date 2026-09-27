import { test } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { checkContrast } from '../../utils/contrastCheck';

// ISSUE-61: Forgot Password page subtext/label colour fails WCAG 2.1 AA contrast (4.5:1 minimum)

test('ISSUE-61 - Recovery description text meets WCAG 2.1 AA contrast', async ({ page }) => {
    await page.goto(reportingTool.forgotPasswordUrl);

    const description = page.getByText('Enter your account email to request a secure recovery link.');

    await checkContrast(description, 'Recovery description');
});

test('ISSUE-61 - Email label meets WCAG 2.1 AA contrast', async ({ page }) => {
    await page.goto(reportingTool.forgotPasswordUrl);

    const emailLabel = page.getByText('Email', { exact: true });

    await checkContrast(emailLabel, 'Email label');
});
