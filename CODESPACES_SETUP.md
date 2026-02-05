# GitHub Codespaces Setup for UnifyOne Shopify Theme

This guide will help you set up a GitHub Codespaces development environment for the UnifyOne Shopify Theme, enabling you to complete deployments successfully in a cloud-based development environment.

## 🚀 What is GitHub Codespaces?

GitHub Codespaces provides a complete, configurable dev environment in the cloud. You can code, build, test, and deploy right from your browser without needing to set up a local development environment.

## ⚡ Quick Start

### 1. Launch Codespace

1. Go to the [UnifyOne Shopify Theme repository](https://github.com/ksksrbiz-arch/unify-one-shopify-theme)
2. Click the green **"Code"** button
3. Select the **"Codespaces"** tab
4. Click **"Create codespace on main"** or select an existing codespace

Your development environment will be ready in ~2-3 minutes with all dependencies pre-installed!

### 2. Configure GitHub Repository Secrets

Before you can deploy from Codespaces or GitHub Actions, you need to configure the required secrets:

#### A. Add Repository Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add each of the following:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `SHOPIFY_STORE_NAME` | Your Shopify store domain | Example: `1commercesolutions.shop` |
| `SHOPIFY_THEME_TOKEN` | Shopify Theme Access API token | See instructions below |
| `SHOPIFY_STAGING_THEME_ID` | Theme ID for staging environment | Run `shopify theme list` |
| `SHOPIFY_PRODUCTION_THEME_ID` | Theme ID for live production theme | Run `shopify theme list` |
| `SLACK_WEBHOOK` (optional) | Slack webhook URL for notifications | From Slack workspace settings |

#### B. Get Shopify Theme Access Token

1. Log into your Shopify Admin panel: `https://admin.shopify.com/store/YOUR_STORE_NAME`
2. Go to **Settings** → **Apps and sales channels**
3. Click **"Develop apps"** (or **"Create an app"** if you don't see it)
4. Click **"Create an app"** and name it: `UnifyOne Theme CI/CD`
5. Click on your newly created app
6. Go to **Configuration** tab
7. Under **Theme templates** section, click **"Configure"**
8. Enable the following scopes:
   - `write_themes` - Required to push theme changes
   - `read_themes` - Required to list and pull themes
9. Click **"Save"**
10. Go to **API credentials** tab
11. Click **"Install app"** (if not already installed)
12. Click **"Reveal token once"** under **Admin API access token**
13. **Copy this token** - you'll need it for `SHOPIFY_THEME_TOKEN`

⚠️ **Important:** Save this token securely. You won't be able to see it again.

#### C. Get Theme IDs

In your Codespace terminal (or local terminal if authenticated):

```bash
# Authenticate with Shopify (first time only)
shopify auth login --store 1commercesolutions.shop

# List all themes to get their IDs
shopify theme list --store 1commercesolutions.shop
```

Output will look like:
```
ID             NAME          ROLE
123456789      Live          main         ← Use for SHOPIFY_PRODUCTION_THEME_ID
987654321      Staging       development  ← Use for SHOPIFY_STAGING_THEME_ID
```

#### D. Set Up Codespace Secrets (for Local Development)

For development within Codespaces, you can also set secrets at the Codespace level:

1. Go to your GitHub **Settings** (your personal settings, not repository)
2. Navigate to **Codespaces** → **Secrets**
3. Click **"New secret"**
4. Add the same secrets listed above
5. Select which repositories can access them

### 3. Authenticate Shopify CLI in Codespace

Once your Codespace is running:

```bash
# Set up environment variables (optional, for convenience)
export SHOPIFY_STORE_NAME="1commercesolutions.shop"

# Authenticate with Shopify
shopify auth login --store $SHOPIFY_STORE_NAME

# Verify authentication
shopify whoami
```

### 4. Start Development Server

```bash
# Start the Shopify theme dev server
npm run dev

# Or use the Shopify CLI directly
shopify theme dev --store 1commercesolutions.shop
```

The dev server will be accessible at the forwarded port (usually port 9000).

## 🔧 Available Commands in Codespace

```bash
# Install dependencies (already done in postCreateCommand)
npm install

# Start development server with live reload
npm run dev

# Run linting
npm run lint
npm run lint:liquid

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Run tests
npm test

# Format code
npm run format
```

## 📦 Deployment from Codespace

### Deploy to Staging

```bash
# Method 1: Use npm script
npm run deploy:staging

# Method 2: Use Shopify CLI directly (replace THEME_ID with your staging theme ID)
shopify theme push --store 1commercesolutions.shop --theme 987654321
```

### Deploy to Production

```bash
# Method 1: Use npm script (WARNING: This deploys to live store!)
npm run deploy:production

# Method 2: Use Shopify CLI directly (replace THEME_ID with your production theme ID)
shopify theme push --store 1commercesolutions.shop --theme 123456789 --allow-live
```

⚠️ **WARNING:** Production deployments should typically be done through the GitHub Actions workflow, not manually from Codespace.

## 🔄 GitHub Actions Deployment (Recommended)

The preferred deployment method is through GitHub Actions:

### Staging Deployment
```bash
# Push to main branch - triggers automatic staging deployment
git add .
git commit -m "Update theme"
git push origin main
```

### Production Deployment
```bash
# Create and push a version tag
git tag v1.0.1
git push origin v1.0.1
```

GitHub Actions will automatically:
- Run linting and validation
- Deploy to the appropriate theme
- Run Lighthouse CI performance tests
- Send Slack notifications (if configured)

## 🐛 Troubleshooting

### Issue: "Authorization is required"

**Solution:** Run `shopify auth login --store 1commercesolutions.shop` in the terminal.

### Issue: "Theme not found"

**Solution:** Verify your theme IDs with `shopify theme list --store 1commercesolutions.shop`

### Issue: GitHub Actions deployment fails with empty secrets

**Problem:** The secrets `SHOPIFY_STORE_NAME`, `SHOPIFY_THEME_TOKEN`, or theme IDs are not set or are empty.

**Solution:**
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Verify all required secrets are set with correct values
3. Re-run the failed workflow

### Issue: "ENOENT: no such file or directory, scandir 'locales'"

**Solution:** This is now fixed. The `locales` directory with `en.default.json` has been added to the repository.

### Issue: Codespace creation fails

**Solution:**
1. Check your GitHub account has Codespaces enabled
2. Verify you have available Codespaces hours/storage
3. Try deleting old Codespaces to free up resources

## 📁 What's Pre-Configured?

The Codespace comes with:

✅ Node.js 18  
✅ Shopify CLI & Theme tools  
✅ Git & GitHub CLI  
✅ VSCode extensions:
  - Shopify Liquid syntax highlighting
  - Theme Check (Liquid linter)
  - ESLint
  - Prettier
  - GitHub Copilot (if you have access)

✅ Port forwarding (port 9000 for theme dev server)  
✅ All npm dependencies pre-installed

## 🎯 Next Steps

1. ✅ Configure GitHub repository secrets (see section 2 above)
2. 🚀 Launch your Codespace
3. 🔐 Authenticate Shopify CLI
4. 💻 Start developing: `npm run dev`
5. 🚢 Deploy via GitHub Actions or directly from Codespace

## 📚 Additional Resources

- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)
- [Shopify Theme Development](https://shopify.dev/themes)
- [Shopify CLI Reference](https://shopify.dev/themes/tools/cli)
- [Repository Setup Guide](./SETUP.md)
- [Deployment Quick Reference](./DEPLOYMENT_QUICK_REF.md)

## 🆘 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the [SETUP.md](./SETUP.md) documentation
3. Check GitHub Actions logs for deployment failures
4. Contact the development team

---

**Last Updated:** January 26, 2026  
**Maintained By:** PNW Enterprises
