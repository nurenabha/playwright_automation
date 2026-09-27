import {test, expect} from '@playwright/test';
import { reportingTool } from '../../config/config';

const forgotPasswordUrl = reportingTool.forgotPasswordUrl;

test('TC_FPWD_040 - Verify identical generic success message for registered and unregistered emails', async ({ page }) => {

  const submitEmail = async (email: string) => {
    await page.goto(forgotPasswordUrl);

    const emailInput = page.getByRole('textbox', { name: /email/i });
    const sendRecoveryButton = page.getByRole('button', {name: /Send recovery link/i,});

    await emailInput.fill(email);
    await sendRecoveryButton.click();

    const successMessage = page.locator('.success-panel');
    await expect(successMessage).toBeVisible();

    return await successMessage.innerText();
  };

  const registeredMessage = await submitEmail(reportingTool.validEmail);		  // Registered email
  const unregisteredMessage = await submitEmail('unregistered.email@organization.com');	 	 // Unregistered email

  // Both responses must be exactly identical
  expect(registeredMessage).toBe(unregisteredMessage);

  // Verify the expected generic confirmation
  expect(registeredMessage).toContain('Check your email');
  expect(registeredMessage).toContain('If this account is eligible, recovery instructions will be delivered shortly.');
	
});