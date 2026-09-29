import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { checkContrast, ContrastCheck } from '../../utils/contrastCheck';

test(
    'TC_FPWD_054 - Verify colour contrast of all text meets WCAG 2.1 AA standards',
    async ({ page }) => {

        // Default State
        await page.goto(reportingTool.forgotPasswordUrl);

        const backToLoginButton = page.getByRole('button', { name: /back to login/i });
        const heading = page.getByRole('heading', { name: /reset your password/i });
        const description = page.getByText('Enter your account email to request a secure recovery link.');
        const emailLabel = page.getByText('Email', { exact: true });
        const emailInput = page.getByRole('textbox', { name: /email/i });
        const sendRecoveryButton = page.getByRole('button', { name: /send recovery link/i });

        const defaultStateChecks: ContrastCheck[] = [
            [backToLoginButton, 'Back to login button (default state)'],
            [heading, 'Reset your password heading'],
            [description, 'Recovery description'],
            [emailLabel, 'Email label'],
            [emailInput, 'Email placeholder', '::placeholder'],
            [sendRecoveryButton, 'Send recovery link button'],
        ];

        for (const [locator, elementName, pseudoElement] of defaultStateChecks) {
            await checkContrast(locator, elementName, pseudoElement);
        }

        // Success State
        await emailInput.fill(reportingTool.validEmail);
        await sendRecoveryButton.click();

        await expect(page.getByText(/check your email/i)).toBeVisible();

        const successMessage = page.getByText(/check your email/i);
        const eligibleText = page.getByText(/if this account is eligible/i);
        const returnToLoginButton = page.getByRole('button', { name: /return to login/i });

        const successStateChecks: ContrastCheck[] = [
            [successMessage, 'Success message'],
            [eligibleText, 'Success sub-text'],
            [backToLoginButton, 'Back to login button (success state)'],
            [returnToLoginButton, 'Return to login button'],
        ];

        for (const [locator, elementName, pseudoElement] of successStateChecks) {
            await checkContrast(locator, elementName, pseudoElement);
        }
    }
);
