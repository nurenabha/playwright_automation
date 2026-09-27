import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_012 - Verify email input field placeholder text', async ({ page }) => {

  await page.goto(reportingTool.forgotPasswordUrl);

  const emailInput = page.getByRole('textbox', { name: 'Email' });

  // Verify input field is visible
  await expect(emailInput).toBeVisible();

  // Verify placeholder text
  await expect(emailInput).toHaveAttribute('placeholder','name@organization.com');

  // Verify the input field is empty
  await expect(emailInput).toHaveValue('');

  // Verify placeholder is displayed inside the field
  const placeholder = await emailInput.getAttribute('placeholder');
  expect(placeholder).toBe('name@organization.com');
});