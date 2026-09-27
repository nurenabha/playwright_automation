import { test, expect, Locator } from '@playwright/test';
import { reportingTool } from '../../config/config';

const forgotPasswordUrl = reportingTool.forgotPasswordUrl;

let emailInput: Locator;
let errorMessage: Locator;
let submitButton: Locator;

test.beforeEach(async ({ page }) => {
  await page.goto(forgotPasswordUrl);
  emailInput = page.getByRole('textbox', { name: 'Email' });
  errorMessage = page.getByText('Please enter a valid email address');
  submitButton = page.getByRole('button', {name: 'Send recovery link'});
});

//TC_FPWD_024
test('TC_FPWD_024 - Verify inline validation error message is positioned directly below/adjacent to the email field', async ({ page }) => {
  await emailInput.fill('user.com');
  await submitButton.click();

  await expect(errorMessage).toBeVisible();
  console.log(`Error message 24: ${errorMessage}`);

  // Error message should be close to the email field
  const emailBox = await emailInput.boundingBox();
  const errorBox = await errorMessage.boundingBox();

  expect(emailBox).not.toBeNull();
  expect(errorBox).not.toBeNull();

  if (emailBox && errorBox) {
    // Error should start at or near the email field's left side
    expect(Math.abs(errorBox.x - emailBox.x)).toBeLessThan(50);

    // Error should appear below or adjacent to the email field
    expect(errorBox.y).toBeGreaterThanOrEqual(emailBox.y);
  }
});

//TC_FPWD_025
test('TC_FPWD_025 - Verify validation error message wording is clear and accurate', async () => {
  await emailInput.fill('user@');
  await submitButton.click();

  console.log(`Error message 25: ${errorMessage}`);
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText('Please enter a valid email address');
});