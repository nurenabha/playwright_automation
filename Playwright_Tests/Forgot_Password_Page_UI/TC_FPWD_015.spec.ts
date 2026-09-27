import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

const invalidEmails = [
  'user@',
  'userorg.com',
  'user@org',
  'user @org.com',
];

for (const email of invalidEmails) {

  test(`TC_FPWD_015 - Invalid email: ${email}`, async ({ page }) => {

    await page.goto(reportingTool.forgotPasswordUrl);
    const emailTextbox = page.getByRole('textbox', { name: 'Email' });
    const submitButton = page.getByRole('button', {name: 'Send recovery link'});

    // Enter invalid email
    await emailTextbox.fill(email);
    await submitButton.click();

    // Check browser's native validation message
    const validationMessage = await emailTextbox.evaluate((el: HTMLInputElement) => el.validationMessage);

		// Log the email and validation message for debugging
    console.log(`Email: ${email}`);
    console.log(`Validation message: ${validationMessage}`);

    // Validation error should be present
    expect(validationMessage).not.toBe('');

  });
}

