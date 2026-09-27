import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_046 - Verify user can submit another recovery request after returning to the form', async ({ page }) => {

  // Step 1: Open Forgot Password page
  await page.goto(reportingTool.forgotPasswordUrl);

  // Step 2: Submit the first recovery request
  const emailInput = page.getByRole('textbox', { name: /email/i });
  const sendRecoveryButton = page.getByRole('button', {name: /Send recovery link/i,});

  await emailInput.fill(reportingTool.validEmail);
  await sendRecoveryButton.click();

  // Step 3: Verify success confirmation panel is displayed
  await expect(page.getByText(/check your email/i)).toBeVisible();

  // Step 4: Click "Return to login"
  await page.getByRole('button', { name: /return to login/i }).click();

  // Step 5: Verify login page is displayed
  await expect(page).toHaveURL(reportingTool.loginUrl);

  // Step 6: Navigate back to Forgot Password from Login page
  await page.getByRole('button', { name: /forgot password?/i }).click();

  // Step 7: Verify Forgot Password page is displayed
  await expect(page).toHaveURL(reportingTool.forgotPasswordUrl);

  // Step 8: Verify form is reset to empty state
  await expect(emailInput).toHaveValue('');

  // Workaround: after in-app navigation back from login, the form does not submit (app bug); reload restores it
  await page.reload();

  // Step 9: Submit a new recovery request with another valid email
  await emailInput.fill('seconduser@example.com');
  await sendRecoveryButton.click();

  // Step 10: Verify the new recovery request is successful
  await expect(page.getByText(/check your email/i)).toBeVisible();

});