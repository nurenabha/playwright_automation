import { test, expect } from '@playwright/test'; 
import { reportingTool } from '../../config/config'; 

test('TC_FPWD_059 - Verify page renders consistently across supported browsers', async ({ page }) => { 
	await page.goto(reportingTool.forgotPasswordUrl); 

	await expect(page.getByRole('heading', { name: /reset your password/i })).toBeVisible(); 
	await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible(); 
	await expect(page.getByRole('button', { name: /send recovery link/i })).toBeVisible(); 
	await page.getByRole('textbox', { name: /email/i }).fill(reportingTool.validEmail); 
	await page.getByRole('button', { name: /send recovery link/i }).click(); 
	await expect(page.getByText(/check your email/i)).toBeVisible(); 

});