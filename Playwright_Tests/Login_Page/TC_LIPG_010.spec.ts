import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';
import { loginPage, submitLogin } from '../../utils/loginPage';

test('TC_LIPG_010 - Verify login with both fields empty', async ({ page }) => {
    await page.goto(reportingTool.loginUrl);
    const login = loginPage(page);

    await submitLogin(page, () => login.loginButton.click());

    // Required-field validation is shown and the user is not logged in
    await expect(page.getByText(/must not be blank|required/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
    await expect(login.form).toBeVisible();
});
