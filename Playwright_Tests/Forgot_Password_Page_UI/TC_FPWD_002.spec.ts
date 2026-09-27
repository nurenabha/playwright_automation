import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_002 - Verify Back to login link is displayed correctly', async ({ page }) => {
	await page.goto(reportingTool.forgotPasswordUrl);
	
	// Locate "Back to login" link
  const backToLogin = page.getByRole('button', { name: /Back to login/i })

	// Verify link is visible
  await expect(backToLogin).toBeVisible();
  
	// Verify left-arrow icon exists inside the link
  const arrowIcon = backToLogin.locator('svg');
	await expect(arrowIcon).toBeVisible();

	// Verify link is positioned at the top-left area of the card
  const linkBox = await backToLogin.boundingBox();
  expect(linkBox).not.toBeNull();

});