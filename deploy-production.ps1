# UnifyOne Shopify Theme - Production Deployment Script
# Usage: .\deploy-production.ps1 -version 1.0.1 -message "Release: [description]"
# Or:    .\deploy-production.ps1

param(
    [string]$version = "",
    [string]$message = "Release production update"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 Deploying to Production (Create Tag)" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not a git repository" -ForegroundColor Red
    Write-Host "Run this script from the theme root directory" -ForegroundColor Red
    exit 1
}

# Check if working directory is clean
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  Warning: Working directory has uncommitted changes" -ForegroundColor Yellow
    Write-Host "📊 Please commit or stash changes first:" -ForegroundColor Yellow
    Write-Host "  git add . && git commit -m 'Your message'" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✅ Working directory is clean" -ForegroundColor Green
Write-Host ""

# Auto-generate version if not provided
if (-not $version) {
    $lastTag = git describe --tags --abbrev=0 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "📄 Latest version: $lastTag" -ForegroundColor Cyan
        $version = Read-Host "Enter new version (e.g., 1.0.1)"
    } else {
        $version = "1.0.0"
        Write-Host "📄 First release, using version: $version" -ForegroundColor Cyan
    }
}

# Check version format
if ($version -notmatch '^\d+\.\d+\.\d+$') {
    Write-Host "❌ Invalid version format: $version" -ForegroundColor Red
    Write-Host "Use format: major.minor.patch (e.g., 1.0.1)" -ForegroundColor Red
    exit 1
}

Write-Host "🎨 Version: v$version" -ForegroundColor Green
Write-Host "💬 Message: $message" -ForegroundColor Green
Write-Host ""

# Confirm before proceeding
$confirm = Read-Host "Create tag v$version? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "⏳ Creating and pushing tag..." -ForegroundColor Yellow

# Create annotated tag
git tag -a "v$version" -m $message
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create tag" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Tag created: v$version" -ForegroundColor Green

# Push tag to remote
git push origin "v$version"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push tag" -ForegroundColor Red
    Write-Host "Try: git push origin v$version" -ForegroundColor Gray
    exit 1
}
Write-Host "✅ Tag pushed to remote" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎆 Production deployment initiated!" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Monitor deployment: https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions"
Write-Host "  2. Check production: https://1commerce.shop"
Write-Host "  3. Verify all changes are live"
Write-Host ""
Write-Host "📄 Release details:" -ForegroundColor Yellow
Write-Host "  Version: v$version"
Write-Host "  Message: $message"
Write-Host ""
Write-Host "👁️  Release page: https://github.com/ksksrbiz-arch/unify-one-shopify-theme/releases/tag/v$version" -ForegroundColor Cyan
Write-Host ""
