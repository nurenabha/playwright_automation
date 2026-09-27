import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_005 - Verify Heading reads exactly Reset your password', async ({ page }) => {
	await page.goto(reportingTool.forgotPasswordUrl);

	// Verify Heading text
	await expect(page.locator('div.public-flow-heading h1')).toHaveText('Reset your password');

});
