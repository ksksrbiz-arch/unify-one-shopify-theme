# UnifyOne Shopify Theme

Custom Liquid CSS theme for UnifyOne storefront at **1commerce.shop**. Migrated from GoDaddy with CI/CD deployment pipeline.

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
│   ├── deploy-staging.yml      # Staging deployment
│   └── deploy-production.yml   # Production deployment
├── .shopifyignore              # Files to ignore during deployment
├── theme.json                  # Theme metadata
└── package.json                # Node.js dependencies
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

### Deploy to Staging

```bash
git commit -am "Update theme"
git push origin develop
# GitHub Actions auto-deploys to staging
```

### Deploy to Production

```bash
git tag v1.0.0
git push origin v1.0.0
# GitHub Actions auto-deploys to production
```

## 📦 Deployment Pipeline

### GitHub Actions Workflow

**Trigger Events:**
- Push to `develop` → Deploy to staging
- Push tag `v*` → Deploy to production
- Manual trigger via workflow dispatch

**Process:**
1. Lint Liquid templates
2. Validate CSS/JS
3. Deploy to Shopify using theme API
4. Run smoke tests

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

## 🔄 CI/CD Configuration

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

## 📊 Performance

- Lazy-loaded images
- Minified CSS/JS
- Optimized Liquid rendering
- 90+ PageSpeed score target

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

## 📄 License

Proprietary - UnifyOne Shopify Theme

## 👥 Contributors

- PNW Enterprises Development Team

---

**Last Updated:** January 21, 2026  
**Domain:** 1commerce.shop  
**Migration Date:** GoDaddy → Shopify (January 2026)
