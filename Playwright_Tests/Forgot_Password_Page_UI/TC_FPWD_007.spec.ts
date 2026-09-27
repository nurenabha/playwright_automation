import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';


test('TC_FPWD_007 - Verify color contrast and legibility', async ({ page }) => {

  await page.goto(reportingTool.forgotPasswordUrl);

  // Heading
  const heading = page.getByRole('heading', {name: 'Reset your password',exact: true});
	await expect(heading).toBeVisible();

  // Enter email
  await page.getByRole('textbox', { name: 'Email' }).fill('nurenabha@sysenact.com');
  await page.getByRole('button', {name: 'Send recovery link'}).click();

  // Success-state text
  const successText = page.getByText('Check your email', {exact: true});
  await expect(successText).toBeVisible();

});