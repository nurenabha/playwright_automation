import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_052 - Verify visible focus indicator on every focusable element', async ({ page }) => {

	// Open Forgot Password page
	await page.goto(reportingTool.forgotPasswordUrl);

	const backToLoginLink = page.getByRole('button', {name: /back to login/i});
	const emailInput = page.getByRole('textbox', {name: /email/i});
	const sendRecoveryButton = page.getByRole('button', {name: /send recovery link/i});

  //Back to login - Focus indicator

  await backToLoginLink.focus();
  await expect(backToLoginLink).toBeFocused();

  // Verify focus indicator
  await expect(backToLoginLink).toHaveCSS('outline-style',/solid|dotted|dashed/);

  //Email field - Focus indicator

  await page.keyboard.press('Tab');
	await expect(emailInput).toBeFocused();
	await expect(emailInput).toHaveCSS('box-shadow',/.+/);


  //Send Recovery Link - Focus indicator
	await page.keyboard.press('Tab');
	await expect(sendRecoveryButton).toBeFocused();
	await expect(sendRecoveryButton).toHaveCSS('outline-style',/solid|dotted|dashed/);

  //Success State
  await emailInput.fill(reportingTool.validEmail);
  await sendRecoveryButton.click();

  //Wait for success panel
  await expect(page.getByText(/check your email/i)).toBeVisible();
	const successBackToLogin = page.getByRole('button', {name: /back to login/i});
	const returnToLoginButton = page.getByRole('button', {name: /return to login/i});


  //Success state - Back to login
  // Reach it via keyboard (Shift+Tab from Return to login) so :focus-visible applies after the mouse click
  await returnToLoginButton.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(successBackToLogin).toBeFocused();
  await expect(successBackToLogin).toHaveCSS('outline-style',/solid|dotted|dashed/);
	//await expect(emailInput).toHaveCSS('box-shadow',/.+/);

  //Success state - Return to login
    await page.keyboard.press('Tab');
    await expect(returnToLoginButton).toBeFocused();
    await expect(returnToLoginButton).toHaveCSS('outline-style',/solid|dotted|dashed/);

});