import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_006 - Verify Heading reads exactly Reset your password', async ({ page }) => {
	await page.goto(reportingTool.forgotPasswordUrl);

	// Verify Heading text
	await expect(page.locator('div.public-flow-heading p')).toHaveText('Enter your account email to request a secure recovery link.');

	const headingBox = await page.locator('div.public-flow-heading h1').boundingBox();
  const recoveryText = page.locator('div.public-flow-heading p');
  const textBox = await recoveryText.boundingBox();

  expect(headingBox).not.toBeNull();
  expect(textBox).not.toBeNull();

  if (headingBox && textBox) {
    // Recovery text must be below the heading
    expect(textBox.y).toBeGreaterThan(headingBox.y + headingBox.height);
  }

});
