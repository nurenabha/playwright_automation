import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

const forgotPasswordUrl = reportingTool.forgotPasswordUrl;

// TC_FPWD_019
test('TC_FPWD_019 - Verify field behavior with excessively long email input', async ({ page }) => {

  await page.goto(forgotPasswordUrl);
  const emailInput = page.getByRole('textbox', { name: 'Email' });
	const submitButton = page.getByRole('button', {name: 'Send recovery link'});

  // Create excessively long email 
	const longEmail = 'a'.repeat(300) + '@organization.com'; 
	await emailInput.fill(longEmail); 
	console.log('Long Email:', longEmail); 
	
	// Verify entered value 
	const actualValue = await emailInput.inputValue(); 
	console.log(`Entered length: ${actualValue.length}`); 
	await expect(emailInput).toBeVisible(); 
	await submitButton.click(); 
	
	// Trigger field validation by leaving the input 
	//await emailInput.press('Tab'); 
	
	// Wait for validation message 
	const errorMessage = page.locator('.form-error');  
	await expect(errorMessage).toBeVisible(); 
	console.log( 'Validation/Error message:', await errorMessage.textContent() );
		
		// Verify input field is still usable 
		const box = await emailInput.boundingBox(); 
		expect(box).not.toBeNull(); 
		
		if (box) { 
			expect(box.width).toBeGreaterThan(0); 
			expect(box.height).toBeGreaterThan(0); 
		}

});

//TC_FPWD_020
test('TC_FPWD_020 - Verify copy-paste functionality works in email field', async ({ page, context, browserName }) => {
	// WebKit doesn't support granting clipboard permissions, and simulated Control+V does not
	// trigger a real paste under automation there - a Playwright/WebKit limitation, not an app bug.
	test.skip(browserName === 'webkit', 'Clipboard paste is not automatable under WebKit');

	await page.goto(forgotPasswordUrl);
	const emailInput = page.getByRole('textbox', { name: 'Email' });
	const email = 'user@organization.com';

	// Clipboard write requires explicit permission (Chromium/Edge only - Firefox/WebKit
	// don't support granting this permission via Playwright, and don't need it)
	try {
		await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	} catch {
		// not supported on this browser - proceed, the paste may still work natively
	}

	// Simulate copied value and paste it into the field
	await page.evaluate(async (value) => { await navigator.clipboard.writeText(value); }, email);
	await emailInput.click();
	await page.keyboard.press('Control+V');

	// Verify pasted email appears correctly 
  await expect(emailInput).toHaveValue(email);

});