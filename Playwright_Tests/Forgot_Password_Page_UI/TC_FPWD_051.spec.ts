import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_051 - Verify full keyboard operability of the page', async ({ page }) => {

  await page.goto(reportingTool.forgotPasswordUrl);
  const backToLoginLink = page.getByRole('button', {name: /back to login/i});
  const emailInput = page.getByRole('textbox', {name: /email/i});
  const sendRecoveryButton = page.getByRole('button', {name: /send recovery link/i});

  //Back to login - keyboard operability
  await backToLoginLink.focus();
	await expect(backToLoginLink).toBeFocused();

  //Verify Enter can activate the link
  await page.keyboard.press('Enter');

  //Verify user is navigated to Login page
  await expect(page).toHaveURL(reportingTool.loginUrl);


  //Return to Forgot Password using keyboard

  const forgotPasswordLink = page.getByRole('button', {name: /forgot password/i});
  await forgotPasswordLink.focus();
  await expect(forgotPasswordLink).toBeFocused();

  //Activate using Enter
  await page.keyboard.press('Enter');

  //Verify Forgot Password page
  await expect(page).toHaveURL(reportingTool.forgotPasswordUrl);


  //Email field - keyboard input
    await backToLoginLink.focus();

  //Tab → Email
  await page.keyboard.press('Tab');
	await expect(emailInput).toBeFocused();

  //Type email using keyboard
  await page.keyboard.type(reportingTool.validEmail);

  // Verify email was entered
  await expect(emailInput).toHaveValue(reportingTool.validEmail);

  //Send Recovery Link - keyboard operation
  await page.keyboard.press('Tab');
  await expect(sendRecoveryButton).toBeFocused();

  //Activate button using Space
  await page.keyboard.press('Space');

  //Verify success state
  await expect(page.getByText(/check your email/i)).toBeVisible();

  //Success state - Return to Login

  const successBackToLogin = page.getByRole('button', {name: /back to login/i});

  const returnToLoginButton = page.getByRole('button', {name: /return to login/i});

  //Focus Back to login
  await successBackToLogin.focus();

  //Verify focus
  await expect(successBackToLogin).toBeFocused();

  //Tab → Return to login
  await page.keyboard.press('Tab');

  await expect(returnToLoginButton).toBeFocused();

  //Activate button using Enter
  await page.keyboard.press('Enter');

  //Verify Login page
  await expect(page).toHaveURL(reportingTool.loginUrl);

});