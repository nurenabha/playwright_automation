import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_043 - Verify heading and subtext remain visible above the success panel', async ({ page }) => {

	const forgotPasswordUrl = reportingTool.forgotPasswordUrl;
	await page.goto(forgotPasswordUrl);

	const validEmail = reportingTool.validEmail;

  // Locate heading and subtext
  const heading = page.getByRole('heading', {name: 'Reset your password'});
  const subtext = page.getByText('Enter your account email to request a secure recovery link.');
  await expect(heading).toBeVisible();
  await expect(subtext).toBeVisible();

  // Store original text
  const originalHeading = await heading.textContent();
  const originalSubtext = await subtext.textContent();

  // Submit forgot password request
  const emailInput = page.getByRole('textbox', { name: /email/i });
	const sendRecoveryButton = page.getByRole('button', {name: /Send recovery link/i,});
	await emailInput.fill(validEmail);
	await sendRecoveryButton.click();

  // Verify success panel is displayed
  const successPanel = page.locator('.success-panel');
  await expect(successPanel).toBeVisible();

  // Verify heading and subtext remain visible
  await expect(heading).toBeVisible();
  await expect(subtext).toBeVisible();

  // Verify heading and subtext remain unchanged
  await expect(heading).toHaveText(originalHeading!);
  await expect(subtext).toHaveText(originalSubtext!);

});