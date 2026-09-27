import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

const forgotPasswordUrl = reportingTool.forgotPasswordUrl;
const validEmail = reportingTool.validEmail;

test.beforeEach(async ({ page }) => {
	await page.goto(forgotPasswordUrl);
	const emailInput = page.getByRole('textbox', { name: /email/i });
	const sendRecoveryButton = page.getByRole('button', {name: /Send recovery link/i,});
	await emailInput.fill(validEmail);
	await sendRecoveryButton.click();
});

//TC_FPWD_041
test('TC_FPWD_041 - Verify "Return to login" button is displayed inside the success panel', async ({ page }) => {

  const successPanel = page.locator('.success-panel');
  const returnToLoginButton = successPanel.getByRole('button', {name: 'Return to login'});

  await expect(successPanel).toBeVisible();
  await expect(returnToLoginButton).toBeVisible();

  // Red background
  await expect(returnToLoginButton).toHaveCSS('background-color', 'rgb(157, 16, 16)');

  // Solid background
  await expect(returnToLoginButton).toHaveCSS('background-image', 'none');

  // White text
  await expect(returnToLoginButton).toHaveCSS('color', 'rgb(255, 255, 255)');

  // Bold text
  await expect(returnToLoginButton).toHaveCSS('font-weight', '800');

  // Full width
    const isFullWidth = await returnToLoginButton.evaluate((button) => {
      const parent = button.parentElement;

      if (!parent) return false;

      const buttonWidth = button.getBoundingClientRect().width;

      const parentStyle = window.getComputedStyle(parent);

      const parentContentWidth =
        parent.clientWidth -
        parseFloat(parentStyle.paddingLeft) -
        parseFloat(parentStyle.paddingRight);

      return Math.abs(buttonWidth - parentContentWidth) < 1;
    });

    expect(isFullWidth).toBe(true);
});


//TC_FPWD_042
test('TC_FPWD_042 - Verify clicking "Return to login" navigates back to the login page', async ({ page }) => {

  const successPanel = page.locator('.success-panel');
  const returnToLoginButton = successPanel.getByRole('button', {name: 'Return to login'});

  await expect(returnToLoginButton).toBeVisible();
  await returnToLoginButton.click();

  await expect(page).toHaveURL(reportingTool.loginUrl);

  await expect(page.getByRole('heading', {name: 'Welcome to Reporting Tool'})).toBeVisible();

});