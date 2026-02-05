@echo off
REM UnifyOne Shopify Theme - Staging Deployment Script (Command Prompt)
REM Usage: deploy-staging.bat
REM Or:    deploy-staging.bat "Your commit message"

setlocal enabledelayedexpansion

REM Set default message
set "message=Update theme"
if not "%~1"==" " set "message=%~1"

echo.
echo ========================================
echo ^(D^ Package Deploying to Staging ^(Develop Branch^)
echo ========================================
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo [X] Error: Not a git repository
    echo Run this script from the theme root directory
    pause
    exit /b 1
)

REM Show current status
echo [*] Current Status:
git status --short
echo.

REM Stage changes
echo [*] Staging changes...
git add .
if errorlevel 1 (
    echo [X] Failed to stage changes
    pause
    exit /b 1
)
echo [+] Changes staged
echo.

REM Create commit
echo [*] Creating commit: %message%
git commit -m "%message%"
if errorlevel 1 (
    echo [!] No changes to commit
)
echo.

REM Push to develop
echo [*] Pushing to develop branch...
git push origin develop
if errorlevel 1 (
    echo [X] Push failed
    pause
    exit /b 1
)
echo [+] Pushed successfully
echo.

REM Show next steps
echo ========================================
echo [+] Staging deployment initiated!
echo ========================================
echo.
echo [*] Next steps:
echo    1. Check deployment: https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions
echo    2. View Lighthouse CI: Check the Actions tab
echo    3. Preview staging: https://1commercesolutions.shop
echo.
echo [*] Last commit:
git log --oneline -1
echo.
pause
