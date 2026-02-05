# UnifyOne Shopify Theme - Staging Deployment Script
# Usage: .\deploy-staging.ps1
# Or:    powershell -ExecutionPolicy Bypass -File .\deploy-staging.ps1

param(
    [string]$message = "Update theme"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📦 Deploying to Staging (Develop Branch)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not a git repository" -ForegroundColor Red
    Write-Host "Run this script from the theme root directory" -ForegroundColor Red
    exit 1
}

# Show current status
Write-Host "📊 Current Status:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Stage changes
Write-Host "📝 Staging changes..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Changes staged" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to stage changes" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Create commit
Write-Host "💬 Creating commit: $message" -ForegroundColor Yellow
git commit -m $message
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit created" -ForegroundColor Green
} else {
    Write-Host "⚠️  Nothing to commit (no changes)" -ForegroundColor Yellow
}
Write-Host ""

# Push to develop
Write-Host "🚀 Pushing to develop branch..." -ForegroundColor Yellow
git push origin develop
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Pushed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Push failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Show next steps
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 Staging deployment initiated!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Check deployment: https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions"
Write-Host "  2. View Lighthouse CI: Check the 'Run Lighthouse CI' step in Actions"
Write-Host "  3. Preview staging: https://1commercesolutions.shop/?preview_theme_id=<STAGING_THEME_ID>"
Write-Host "  4. After QA approval, run deploy-production.ps1 to release"
Write-Host ""
Write-Host "Last commit:" -ForegroundColor Yellow
git log --oneline -1
Write-Host ""
