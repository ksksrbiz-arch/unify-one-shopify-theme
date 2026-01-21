# UnifyOne Shopify Theme

Custom Liquid CSS theme for UnifyOne storefront at **1commerce.shop**. Migrated from GoDaddy with CI/CD deployment pipeline and automated performance monitoring.

## 📁 Project Structure

```
unify-one-shopify-theme/
├── assets/                      # Static files (images, JS, CSS)
│   ├── custom-styles.css       # Main theme stylesheet
│   └── theme.js                # Theme JavaScript
├── config/
│   └── settings_schema.json     # Shopify theme settings
├── layout/
│   └── theme.liquid            # Base layout template
├── sections/
│   ├── header.liquid           # Header section
│   ├── footer.liquid           # Footer section
│   └── product.liquid          # Product template
├── templates/
│   ├── product.liquid          # Product page
│   ├── collection.liquid       # Collection page
│   └── cart.liquid             # Shopping cart
├── snippets/
│   └── product-card.liquid     # Reusable product component
├── .github/workflows/
│   ├── deploy-staging.yml      # Staging deployment with Lighthouse CI
│   └── deploy-production.yml   # Production deployment
├── deploy-staging.ps1           # PowerShell staging deployment script
├── deploy-production.ps1        # PowerShell production deployment script
├── deploy-staging.bat           # Command Prompt staging deployment script
├── deploy-production.bat        # Command Prompt production deployment script
├── .shopifyignore              # Files to ignore during deployment
├── lighthouserc.json            # Performance budgets & assertions
├── theme.json                   # Theme metadata
└── package.json                 # Node.js dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Shopify CLI (`npm install -g @shopify/cli @shopify/theme`)
- GitHub access token

### Local Development

```bash
# Install dependencies
npm install

# Connect to Shopify store
shopify theme dev --store 1commerce.shop

# Watch for changes
npm run watch
```

### Deploy to Staging (One Command)

**PowerShell:**
```powershell
.\deploy-staging.ps1 "Your commit message"
```

**Command Prompt:**
```cmd
deploy-staging.bat "Your commit message"
```

**Manual:**
```bash
git add .
git commit -m "Update theme"
git push origin develop
```

### Deploy to Production (One Command)

**PowerShell:**
```powershell
.\deploy-production.ps1 -version 1.0.1 -message "Release: Add new features"
```

**Command Prompt:**
```cmd
deploy-production.bat 1.0.1 "Release: Add new features"
```

**Manual:**
```bash
git tag v1.0.1 -m "Release: Add new features"
git push origin v1.0.1
```

## 📋 Deployment Pipeline

### GitHub Actions Workflow

**Trigger Events:**
- Push to `develop` → Deploy to staging + Lighthouse CI audit
- Push tag `v*` → Deploy to production
- Manual trigger via workflow dispatch

**Process:**
1. Lint Liquid templates
2. Validate CSS/JS
3. Deploy to Shopify using theme API
4. Run Lighthouse CI (performance audit)
5. Post results to GitHub

## 📚 Documentation

| Document | Purpose |
|----------|----------|
| **[CLI Deployment Guide](./docs/CLI-DEPLOYMENT-GUIDE.md)** | Step-by-step commands for PowerShell/Command Prompt |
| **[Performance Monitoring](./docs/PERFORMANCE-MONITORING.md)** | Lighthouse CI setup and optimization |
| **[Setup Guide](./SETUP.md)** | Initial setup and configuration |

## 📊 Performance Monitoring

Every deployment to staging automatically audits performance metrics:

- **Performance** - LCP, FCP, CLS, TBT targets
- **Accessibility** - WCAG compliance, keyboard nav, contrast
- **Best Practices** - Browser compatibility, image optimization
- **SEO** - Meta tags, structured data, mobile-friendly

**Performance Targets:**
```
Performance:   ≥ 85/100
Accessibility: ≥ 90/100
Best Practice: ≥ 85/100
SEO:           ≥ 90/100

Core Web Vitals:
- LCP: < 2.5s
- FCP: < 2.0s
- CLS: < 0.1
```

See [Performance Monitoring Guide](./docs/PERFORMANCE-MONITORING.md) for details.

## 🎨 Customization

### CSS Variables (Design System)

Located in `assets/custom-styles.css`:

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --spacing-unit: 1rem;
  --border-radius: 0.25rem;
  --font-stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### Liquid Template Variables

All templates have access to:
- `shop` - Store information
- `product` - Product data
- `collection` - Collection data
- `cart` - Cart data

### Settings

Customize via `config/settings_schema.json` → Shopify Admin → Theme Settings

## 🔐 CI/CD Configuration

### Environment Variables

Add to GitHub Secrets:
- `SHOPIFY_STORE_NAME`: 1commerce.shop
- `SHOPIFY_THEME_TOKEN`: API access token
- `SHOPIFY_STAGING_THEME_ID`: Staging theme ID
- `SHOPIFY_PRODUCTION_THEME_ID`: Production theme ID

### Local Secrets

Create `.env.local`:
```
SHOPIFY_STORE_NAME=1commerce.shop
SHOPIFY_THEME_TOKEN=your_token_here
```

## 🐛 Troubleshooting

### Deployment Fails

```bash
# Clear local theme data
rm -rf node_modules/.cache

# Reinstall dependencies
npm ci

# Validate theme
shopify theme check
```

### Liquid Syntax Errors

```bash
# Run linter
npm run lint:liquid
```

### Performance Issues

See [Performance Monitoring Guide](./docs/PERFORMANCE-MONITORING.md#common-performance-issues--solutions) for troubleshooting.

### CLI Script Execution Issues

**PowerShell: "Cannot be loaded because running scripts is disabled"**
```powershell
# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run script
.\deploy-staging.ps1
```

**Command Prompt: Script not found**
```cmd
# Ensure you're in the theme root directory
cd C:\path\to\unify-one-shopify-theme

# Then run
deploy-staging.bat
```

## 📖 Learning Resources

- **[CLI Deployment Guide](./docs/CLI-DEPLOYMENT-GUIDE.md)** - Comprehensive git commands
- **[Performance Monitoring](./docs/PERFORMANCE-MONITORING.md)** - Lighthouse CI optimization
- **Shopify Docs:** https://shopify.dev/themes
- **Liquid Docs:** https://shopify.dev/liquid
- **GitHub Docs:** https://docs.github.com/

## 📄 License

Proprietary - UnifyOne Shopify Theme

## 👥 Contributors

- PNW Enterprises Development Team

---

**Last Updated:** January 21, 2026  
**Domain:** 1commerce.shop  
**Migration Date:** GoDaddy → Shopify (January 2026)  
**Theme Version:** 1.0.0+  
**CLI Scripts:** Included (PowerShell & Command Prompt)
