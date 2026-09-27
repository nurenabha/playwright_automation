import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_021 - Verify focus state of the email field', async ({ page }) => {

  // Open Forgot Password page
  await page.goto(reportingTool.forgotPasswordUrl);

  // Locate email field
  const emailInput = page.getByRole('textbox', { name: 'Email' });
  await expect(emailInput).toBeVisible();

  // Get focus indicator (box-shadow) before focus
  const styleBeforeFocus = await emailInput.evaluate((element) => {
    return window.getComputedStyle(element).boxShadow;
  });

  //Click into email field & Verify field is focused
  await emailInput.click();
  await expect(emailInput).toBeFocused();

  // Get focus indicator (box-shadow) after focus
  const styleAfterFocus = await emailInput.evaluate((element) => {
    return window.getComputedStyle(element).boxShadow;
  });

  // Focus state should change the border/highlight
  expect(styleAfterFocus).not.toBe(styleBeforeFocus);
});