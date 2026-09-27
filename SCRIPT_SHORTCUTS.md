# How to run the tests (cheat sheet)

Run everything from the project folder: `E:\Playwright_Automation`

## Quick reference

| I want to... | Command |
|---|---|
| Run **Login Page** tests + open report | `run_login_tests.bat` (double-click) |
| Same, using cscript | `cscript //nologo run_login_tests.vbs` |
| Run **Login Page** tests (terminal only) | `npm run test:login` |
| Run **Login Page** tests, **browser visible + slow** (chromium) | `npm run test:login:headed` |
| Run **Forgot Password Page UI** tests | `npm run test:forgot` |
| Run **all** tests | `npm test` |
| Open the last HTML report | `npm run report` |

## Handy variations

| I want to... | Command |
|---|---|
| One browser only | `run_login_tests.bat --project=chromium` |
| One test only | `npx playwright test "Playwright_Tests/Login_Page/TC_LIPG_007.spec.ts"` |
| Tests matching a name | `npx playwright test -g "TC_LIPG_01"` |
| Watch the browser | add `--headed` (see the note below about `--`) |
| Slow it down so you can follow it | set `SLOWMO=700` (ms per action), e.g. `set SLOWMO=700` then `run_login_tests.bat --headed --project=chromium` |
| Pause and step through | `npx playwright test "<file>" --debug` |

Browsers (projects): `chromium`, `firefox`, `webkit`, `Microsoft Edge` (use quotes for the last one).

## Good to know

- **Extra flags with `npm run` need `--` before them.** Without it npm swallows the flag and Playwright never sees it.
  - Wrong: `npm run test:login --headed` (runs headless, all browsers)
  - Right: `npm run test:login -- --headed --project=chromium`
  - Easiest: `npm run test:login:headed`, or `run_login_tests.bat --headed --project=chromium` (no `--` needed with the .bat/.vbs)

- **Login tests use `--workers=1` on purpose.** The login API blocks repeated failed logins (429 `LOGIN_RATE_LIMITED`).
  When that happens the affected tests show as *skipped*, not failed. Wait a few minutes and rerun.
- **TC_LIPG_006 (valid login) is skipped** unless you set a real account first:
  - PowerShell: `$env:LOGIN_EMAIL='you@example.com'; $env:LOGIN_PASSWORD='yourpassword'`
  - cmd: `set LOGIN_EMAIL=you@example.com` then `set LOGIN_PASSWORD=yourpassword`
- **Site URL changes** (the trycloudflare tunnel): update `loginUrl` and `forgotPasswordUrl` in `config/config.ts`.
- **"No tests found" or "Cannot find module"**: a test file was moved. Imports must point at
  `../../config/config` and `../../utils/...` (two levels up from a subfolder).

## Where things are

| Path | What it is |
|---|---|
| `Playwright_Tests/Login_Page/` | `TC_LIPG_001` to `TC_LIPG_024` |
| `Playwright_Tests/Forgot_Password_Page_UI/` | `TC_FPWD_*` and `TC_ISSUE_*` |
| `config/config.ts` | URLs and test data |
| `utils/` | shared helpers (`loginPage.ts`, `contrastCheck.ts`) |
| `reports/` | bug tracker Excel |
| `playwright-report/` | HTML report output |
