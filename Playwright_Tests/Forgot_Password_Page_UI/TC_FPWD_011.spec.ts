import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_011 - Verify Email label is displayed above input field', async ({ page }) => {

  await page.goto(reportingTool.forgotPasswordUrl);

  // Locate Email label and input field
  const emailLabel = page.getByText('Email', { exact: true });
  const emailInput = page.getByRole('textbox', { name: 'Email' });

  // Verify both are visible
  await expect(emailLabel).toBeVisible();
  await expect(emailInput).toBeVisible();

  // Get their positions
  const labelBox = await emailLabel.boundingBox();
  const inputBox = await emailInput.boundingBox();

  expect(labelBox).not.toBeNull();
  expect(inputBox).not.toBeNull();

  if (labelBox && inputBox) {

    // Verify label is above the input
    expect(labelBox.y + labelBox.height).toBeLessThanOrEqual(inputBox.y);
  }
});
