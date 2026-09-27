import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

const forgotPasswordUrl = reportingTool.forgotPasswordUrl;

  // TC_FPWD_030
  test('TC_FPWD_030 - Verify successful transition to confirmation state with a valid email', async ({ page, }) => {
    await page.goto(forgotPasswordUrl);

    const emailInput = page.getByRole('textbox', { name: /email/i });
    const sendRecoveryButton = page.getByRole('button', { name: /send recovery link/i, });

    // Enter valid registered email
    await emailInput.fill('user@organization.com');
    await sendRecoveryButton.click();

    // Verify success confirmation panel
    await expect(page.getByText('Check your email', { exact: true })).toBeVisible();

    // Verify email field and button are replaced
    await expect(emailInput).not.toBeVisible();
    await expect(sendRecoveryButton).not.toBeVisible();
  });


  // TC_FPWD_031
  test('TC_FPWD_031 - Verify clicking Send recovery link with an empty field does not submit', async ({ page, }) => {
    await page.goto(forgotPasswordUrl);

    const emailInput = page.getByRole('textbox', { name: /email/i });
    const sendRecoveryButton = page.getByRole('button', {name: /send recovery link/i,});

    // Leave email field empty
    await emailInput.fill('');
    await sendRecoveryButton.click();

    // Verify required-field validation blocked submission
    expect(await emailInput.evaluate((el) => (el as HTMLInputElement).validity.valueMissing)).toBe(true);

    // Verify success panel is NOT displayed
    await expect(page.getByText('Check your email', { exact: true })).not.toBeVisible();
  });


  // TC_FPWD_032
  test('TC_FPWD_032 - Verify clicking Send recovery link with an invalid email format does not submit', async ({ page, }) => {
    await page.goto(forgotPasswordUrl);

    const emailInput = page.getByRole('textbox', { name: /email/i });
    const sendRecoveryButton = page.getByRole('button', {name: /send recovery link/i,});

    // Enter invalid email format
    await emailInput.fill(reportingTool.invalidEmail);
    await sendRecoveryButton.click();

    // Let the async submit response settle before asserting
    await page.waitForTimeout(2000);

    // Verify success panel is NOT displayed
    await expect(page.getByText('Check your email', { exact: true })).not.toBeVisible();
  });