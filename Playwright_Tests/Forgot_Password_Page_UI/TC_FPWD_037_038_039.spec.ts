import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

const forgotPasswordUrl = reportingTool.forgotPasswordUrl;
const validEmail = reportingTool.validEmail;

test.beforeEach(async ({ page }) => {
	await page.goto(forgotPasswordUrl);
	const emailInput = page.getByRole('textbox', { name: /email/i });
	const sendRecoveryButton = page.getByRole('button', {name: /Send recovery link/i,});
	await emailInput.fill(validEmail);
	await sendRecoveryButton.click();
});

//TC_FPWD_037
test('TC_FPWD_037 - Verify success panel styling', async ({ page }) => {

	const successPanel = page.locator('.success-panel');
	//await expect(successPanel).toBeVisible();

  // Verify background color
  await expect(successPanel).toHaveCSS( 'background-color', 'rgb(227, 252, 239)');

  // Verify border color
  await expect(successPanel).toHaveCSS( 'border-color', 'rgb(87, 217, 163)');

  // Verify border is visible
  await expect(successPanel).toHaveCSS( 'border-style', 'solid');

});


//TC_FPWD_038
test('TC_FPWD_038 - Verify success panel heading text is correct', async ({ page }) => {
  const successHeading = page.locator('.success-panel strong');

  await expect(successHeading).toHaveText('Check your email');

});


//TC_FPWD_039
test('TC_FPWD_039 - Verify success panel message text is correct', async ({ page }) => {
  const successMessage = page.locator('.success-panel span');

  await expect(successMessage).toHaveText( 'If this account is eligible, recovery instructions will be delivered shortly.');

});