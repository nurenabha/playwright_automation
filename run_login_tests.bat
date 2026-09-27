@echo off
REM Runs every test in "Playwright_Tests\Login Page" and opens the HTML report.
REM Optional (needed only for TC_LIPG_006): set LOGIN_EMAIL and LOGIN_PASSWORD before running.
cd /d "%~dp0"

REM Never let Playwright auto-open/hold the report server; we open it ourselves below.
set PLAYWRIGHT_HTML_OPEN=never

REM --workers=1 keeps failed-login attempts under the server's rate limit (429).
call npx playwright test "Playwright_Tests/Login_Page" --workers=1 --retries=0 --reporter=list,html %*
set TEST_EXIT=%ERRORLEVEL%

call npx playwright show-report
exit /b %TEST_EXIT%
