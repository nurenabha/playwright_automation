import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_044 - Verify top Back to login link remains visible and functional after success confirmation', async ({page,}) => {

  await page.goto(reportingTool.forgotPasswordUrl);

  // Locate top Back to login button
  const backToLogin = page.getByRole('button', {name: 'Back to login',});

  await expect(backToLogin).toBeVisible();

  // Submit forgot password request
  const emailInput = page.getByRole('textbox', { name: /email/i });
  const sendRecoveryButton = page.getByRole('button', {name: /Send recovery link/i,});

  await emailInput.fill(reportingTool.validEmail);
  await sendRecoveryButton.click();

  // Verify success panel is displayed
  const successPanel = page.locator('.success-panel');
  await expect(successPanel).toBeVisible();

  // Verify Back to login remains visible
  await expect(backToLogin).toBeVisible();

  // Verify Back to login remains enabled
  await expect(backToLogin).toBeEnabled();

  // Click Back to login
  await backToLogin.click();

  // Verify navigation to login page
  await expect(page).toHaveURL(reportingTool.loginUrl);

  // Verify login heading
  await expect(page.getByRole('heading', {name: 'Welcome to Reporting Tool',})).toBeVisible();

});