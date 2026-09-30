import { test, Page } from '@playwright/test';

// Login form controls. Password is located by placeholder because its accessible name
// is "Password Show password" (the show/hide button sits inside the <label>).
export function loginPage(page: Page) {
    return {
        logo: page.getByRole('img', { name: 'Reporting Platform' }),
        heading: page.getByRole('heading', { name: 'Welcome to Reporting Tool' }),
        form: page.locator('form.login-panel'),
        email: page.getByPlaceholder('Enter your email'),
        password: page.getByPlaceholder('Enter your password'),
        passwordToggle: page.locator('.reporting-password-toggle'),
        forgotPassword: page.getByRole('button', { name: 'Forgot Password?' }),
        loginButton: page.getByRole('button', { name: 'Login', exact: true }),
        passkeyButton: page.getByRole('button', { name: 'Sign in with passkey' }),
        certificateButton: page.getByRole('button', { name: 'Sign in with certificate' }),
        enterpriseButton: page.getByRole('button', { name: 'Enterprise sign-in' }),
        invalidCredentialsError: page.getByText(/invalid username or password/i),
        // Any error shown under the form (bad credentials, server or network failure)
        formError: page.locator('form.login-panel .form-error'),
    };
}

export const LOGIN_API = '**/api/core/auth/login';

// Triggers a login attempt and returns the API response. The server locks out repeated
// attempts (429 LOGIN_RATE_LIMITED), which says nothing about the behaviour under test,
// so the test is skipped with a clear reason instead of failing.
export async function submitLogin(page: Page, trigger: () => Promise<void>) {
    const [response] = await Promise.all([page.waitForResponse(LOGIN_API), trigger()]);
    test.skip(response.status() === 429, 'Login API is rate limited (429 LOGIN_RATE_LIMITED) - rerun later');
    return response;
}
