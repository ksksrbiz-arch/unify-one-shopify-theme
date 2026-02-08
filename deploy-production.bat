@echo off
REM UnifyOne Shopify Theme - Production Deployment Script (Command Prompt)
REM Usage: deploy-production.bat
REM        deploy-production.bat 1.0.1
REM        deploy-production.bat 1.0.1 "Release: add new features"

setlocal enabledelayedexpansion

REM Set defaults
set "version=%~1"
set "message=%~2"
if "%message%"==" " set "message=Release production update"

echo.
echo ========================================
echo ^(D^ Package Deploying to Production ^(Create Tag^)
echo ========================================
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo [X] Error: Not a git repository
    echo Run this script from the theme root directory
    pause
    exit /b 1
)

REM Check if working directory is clean
git status --porcelain > temp_status.txt
set /p status=<temp_status.txt
if not "%status%"==" " (
    echo [!] Warning: Working directory has uncommitted changes
    echo Please commit changes first:
    echo    git add . ^&^& git commit -m "Your message"
    del temp_status.txt
    pause
    exit /b 1
)
del temp_status.txt
echo [+] Working directory is clean
echo.

REM Auto-generate version if not provided
if "%version%"==" " (
    echo [*] Latest version:
    git describe --tags --abbrev=0 2>nul
    if errorlevel 1 (
        set "version=1.0.0"
        echo [*] First release, using version: !version!
    ) else (
        set /p version="Enter new version (e.g., 1.0.1): "
    )
)

echo [D] Version: v%version%
echo [D] Message: %message%
echo.

REM Confirm before proceeding
set /p confirm="Create tag v%version%? (yes/no): "
if not "%confirm%"=="yes" (
    echo [X] Deployment cancelled
    exit /b 0
)

echo.
echo [*] Creating and pushing tag...

REM Create annotated tag
git tag -a "v%version%" -m "%message%"
if errorlevel 1 (
    echo [X] Failed to create tag
    pause
    exit /b 1
)
echo [+] Tag created: v%version%

REM Push tag to remote
git push origin "v%version%"
if errorlevel 1 (
    echo [X] Failed to push tag
    echo Try: git push origin v%version%
    pause
    exit /b 1
)
echo [+] Tag pushed to remote

echo.
echo ========================================
echo [+] Production deployment initiated!
echo ========================================
echo.
echo [*] Next steps:
echo    1. Monitor deployment: https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions
echo    2. Check production: https://1commercesolutions.shop
echo    3. Verify all changes are live
echo.
echo [*] Release details:
echo    Version: v%version%
echo    Message: %message%
echo.
echo [D] Release page: https://github.com/ksksrbiz-arch/unify-one-shopify-theme/releases/tag/v%version%
echo.
pause
