import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

const forgotPasswordUrl = reportingTool.forgotPasswordUrl;

// TC_FPWD_017
test('TC_FPWD_017 - Verify leading/trailing spaces are trimmed from email input', async ({ page }) => {

  await page.goto(forgotPasswordUrl);

  const emailInput = page.getByRole('textbox', { name: 'Email' });
  const submitButton = page.getByRole('button', {name: 'Send recovery link'});

  // Enter email with leading and trailing spaces
  const emailWithSpaces = '  user@organization.com  ';
  const trimmedEmail = 'user@organization.com';

  await emailInput.fill(emailWithSpaces);
  await submitButton.click();

  // Verify spaces are trimmed
  await expect(emailInput).toHaveValue(trimmedEmail);

  // Verify success confirmation
  await expect(page.getByText(/success|recovery|email sent/i)).toBeVisible();

});


// TC_FPWD_018
test('TC_FPWD_018 - Verify email field matching is case-insensitive', async ({ page }) => {

  await page.goto(forgotPasswordUrl);

  const emailInput = page.getByRole('textbox', { name: 'Email' });
  const submitButton = page.getByRole('button', {name: 'Send recovery link'});

  // Enter registered email using different casing
  const mixedCaseEmail = 'USER@Organization.COM';

  await emailInput.fill(mixedCaseEmail);
  await submitButton.click();

  // Verify success confirmation
  await expect(page.getByText(/success|recovery|email sent/i)).toBeVisible();

});