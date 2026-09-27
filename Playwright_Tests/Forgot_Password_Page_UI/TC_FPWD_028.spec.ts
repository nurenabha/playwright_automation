import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_028 - Verify Send recovery link button is displayed correctly', async ({ page }) => {
	await page.goto(reportingTool.forgotPasswordUrl);

  const sendRecoveryButton = page.getByRole('button', {name: 'Send recovery link'});

  await expect(sendRecoveryButton).toBeVisible();	// Button is displayed
  await expect(sendRecoveryButton).toContainText('Send recovery link');	// Correct button label
  await expect(sendRecoveryButton).toHaveCSS('background-color','rgb(157, 16, 16)');	// Button has maroon background
  await expect(sendRecoveryButton).toHaveCSS('color','rgb(255, 255, 255)');	// Text is white
  await expect(sendRecoveryButton).toHaveCSS('font-weight','800');	// Text is bold

  // Button is full width
  const buttonBox = await sendRecoveryButton.boundingBox();
  const emailInput = page.getByRole('textbox', { name: 'Email' });
  const emailBox = await emailInput.boundingBox();

  expect(buttonBox).not.toBeNull();
  expect(emailBox).not.toBeNull();

  if (buttonBox && emailBox) {
    expect(buttonBox.width).toBeCloseTo(emailBox.width, -1);
  }

  // Paper-plane icon exists inside the button
  const paperPlaneIcon = sendRecoveryButton.locator('svg, i, [class*="plane"], [class*="send"]');
  await expect(paperPlaneIcon.first()).toBeVisible();
});