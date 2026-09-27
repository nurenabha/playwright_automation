import { test } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { checkContrast } from '../../utils/contrastCheck';

// ISSUE-62: Forgot Password page email placeholder colour fails WCAG 2.1 AA contrast on WebKit only.
// The app's custom placeholder colour is not applied in WebKit, so it falls back to the
// browser's default placeholder gray (rgb(169, 169, 169) on white = 2.35:1), well under the 4.5:1 minimum.
// Chromium/Firefox are unaffected (placeholder colour applies correctly there).

test('ISSUE-62 - Email placeholder meets WCAG 2.1 AA contrast', async ({ page }) => {
    await page.goto(reportingTool.forgotPasswordUrl);

    const emailInput = page.getByRole('textbox', { name: /email/i });

    await checkContrast(emailInput, 'Email placeholder', '::placeholder');
});
