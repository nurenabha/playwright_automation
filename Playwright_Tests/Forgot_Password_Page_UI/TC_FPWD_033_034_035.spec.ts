import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

const forgotPasswordUrl = reportingTool.forgotPasswordUrl;
const validEmail = reportingTool.validEmail;

// TC_FPWD_033
test('TC_FPWD_033 - Verify button shows loading/disabled state while request is processing', async ({ page, }) => {
  // Delay the recovery request so the loading/disabled state is observable
  await page.route('**/api/core/auth/password-recovery/requests', async (route) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  await route.continue();  
});

  await page.goto(forgotPasswordUrl);

  const emailInput = page.getByRole('textbox', { name: /email/i });
  // Use a locator that stays stable once clicked — the accessible name
  // changes from "Send recovery link" to "Submitting", so matching by
  // name would no longer find the button during the loading state.
  const sendRecoveryButton = page.locator('button[type="submit"]');

  // Enter valid email
  await emailInput.fill(validEmail);
  await sendRecoveryButton.click();

  // Verify button becomes disabled
  await expect(sendRecoveryButton).toBeDisabled();

  // Verify loading indicator is displayed
  await expect(sendRecoveryButton).toHaveText(/submitting/i);
});


// TC_FPWD_034
test('TC_FPWD_034 - Verify multiple rapid clicks do not trigger duplicate recovery-link requests', async ({ page, }) => {
  let requestCount = 0;

    // Delay the recovery request so rapid clicks land while the button is still present
  await page.route('**/api/core/auth/password-recovery/requests', async (route) => {
    requestCount++;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });

  await page.goto(forgotPasswordUrl);

  const emailInput = page.getByRole('textbox', { name: /email/i });
  // Accessible name changes to "Submitting" once clicked, so match by the
  // stable type="submit" attribute instead of the initial button text.
  const sendRecoveryButton = page.locator('button[type="submit"]');

  // Enter valid email
  await emailInput.fill(validEmail);

  // Click the button multiple times rapidly (force, since a real disabled
  // button swallows subsequent clicks instead of waiting for re-enable)
  await sendRecoveryButton.click();
  await sendRecoveryButton.click({ force: true }).catch(() => {});
  await sendRecoveryButton.click({ force: true }).catch(() => {});

  // Button should be disabled after the first submission
  await expect(sendRecoveryButton).toBeDisabled();

  // Verify success confirmation appears only once
  await expect( page.getByText('Check your email', { exact: true })).toBeVisible();

  // Verify only one request was actually sent to the backend
  expect(requestCount).toBe(1);
	console.log('Request Count: ', requestCount);
});


// TC_FPWD_035
test('TC_FPWD_035 - Verify pressing Enter key while focused in email field submits the form', async ({ page, }) => {
  await page.goto(forgotPasswordUrl);

  const emailInput = page.getByRole('textbox', { name: /email/i });
  await emailInput.fill(validEmail);

  // Press Enter while email field is focused
  await emailInput.press('Enter');

  // Verify successful submission
  await expect(page.getByText('Check your email', { exact: true })).toBeVisible();

  // Verify email field is replaced
  await expect(emailInput).not.toBeVisible();
});