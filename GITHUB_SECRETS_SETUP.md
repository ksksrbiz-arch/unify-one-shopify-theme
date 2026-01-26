# GitHub Actions Secrets Configuration Guide

This guide explains how to configure the required GitHub secrets to enable successful CI/CD deployments for the UnifyOne Shopify Theme.

## 🚨 Current Issue

The deployment workflow is failing because required GitHub secrets are not configured or are empty:
- `SHOPIFY_STORE_NAME` 
- `SHOPIFY_THEME_TOKEN`
- `SHOPIFY_STAGING_THEME_ID`
- `SHOPIFY_PRODUCTION_THEME_ID`

**Error Message:** "Authorization is required to continue, but the current environment does not support interactive prompts."

## ✅ Solution: Configure GitHub Secrets

### Step 1: Navigate to Repository Secrets

1. Go to your GitHub repository: https://github.com/ksksrbiz-arch/unify-one-shopify-theme
2. Click **Settings** (top navigation)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Step 2: Add Required Secrets

Add each of the following secrets by clicking "New repository secret":

#### 1. SHOPIFY_STORE_NAME
- **Name:** `SHOPIFY_STORE_NAME`
- **Value:** `1commerce.shop`
- **Description:** Your Shopify store domain without https://

#### 2. SHOPIFY_THEME_TOKEN
- **Name:** `SHOPIFY_THEME_TOKEN`
- **Value:** Your Shopify Theme Access API token (see instructions below)
- **Description:** API token for theme deployment authentication

#### 3. SHOPIFY_STAGING_THEME_ID
- **Name:** `SHOPIFY_STAGING_THEME_ID`
- **Value:** Your staging theme ID (e.g., `987654321`)
- **Description:** The ID of your staging/development theme

#### 4. SHOPIFY_PRODUCTION_THEME_ID
- **Name:** `SHOPIFY_PRODUCTION_THEME_ID`
- **Value:** Your production theme ID (e.g., `123456789`)
- **Description:** The ID of your live production theme

#### 5. SLACK_WEBHOOK (Optional)
- **Name:** `SLACK_WEBHOOK`
- **Value:** Your Slack webhook URL (e.g., `https://hooks.slack.com/services/...`)
- **Description:** Slack webhook for deployment notifications

### Step 3: Get Shopify Theme Access Token

To get your `SHOPIFY_THEME_TOKEN`:

1. Log into Shopify Admin: `https://1commerce.shop/admin` (or `https://admin.shopify.com/store/1commerce`)
2. Go to **Settings** → **Apps and sales channels**
3. Click **"Develop apps"** (or **"Create an app"**)
4. Click **"Create an app"** 
5. Name it: `UnifyOne Theme CI/CD`
6. Click on the app you just created
7. Go to **Configuration** tab
8. Under **Admin API access scopes**, find **Theme templates**
9. Click **"Configure"** and enable these scopes:
   - ✅ `write_themes` - Push theme changes
   - ✅ `read_themes` - List and pull themes
10. Click **"Save"**
11. Go to **API credentials** tab
12. Click **"Install app"** (if not already installed)
13. Under **Admin API access token**, click **"Reveal token once"**
14. **Copy the token** - This is your `SHOPIFY_THEME_TOKEN`

⚠️ **Important:** You can only see this token once. Save it securely!

### Step 4: Get Theme IDs

To get your theme IDs, you have two options:

#### Option A: Using Shopify CLI (Recommended)

```bash
# First, authenticate
shopify auth login --store 1commerce.shop

# List all themes
shopify theme list --store 1commerce.shop
```

Output example:
```
ID             NAME          ROLE
123456789      Live          main         ← Production theme
987654321      Staging       development  ← Staging theme
```

#### Option B: Using Shopify Admin

1. Go to Shopify Admin
2. Navigate to **Online Store** → **Themes**
3. Click on a theme name
4. Look at the URL: `https://admin.shopify.com/store/1commerce/themes/[THEME_ID]`
5. The number at the end is your theme ID

### Step 5: Verify Secrets Are Set

1. Go back to **Settings** → **Secrets and variables** → **Actions**
2. You should see all secrets listed (values are hidden)
3. Verify you have:
   - ✅ SHOPIFY_STORE_NAME
   - ✅ SHOPIFY_THEME_TOKEN
   - ✅ SHOPIFY_STAGING_THEME_ID
   - ✅ SHOPIFY_PRODUCTION_THEME_ID
   - ✅ SLACK_WEBHOOK (optional)

### Step 6: Test Deployment

Once secrets are configured:

1. Make a small change to any file (e.g., update a comment in `README.md`)
2. Commit and push to main branch:
   ```bash
   git add .
   git commit -m "Test deployment after secrets configuration"
   git push origin main
   ```
3. Go to **Actions** tab in GitHub
4. Watch the "Deploy to Staging with Lighthouse CI Performance Check" workflow
5. The deployment should now succeed! ✅

## 🔒 Security Best Practices

- ✅ Never commit secrets to the repository
- ✅ Use GitHub Secrets for all sensitive values
- ✅ Rotate tokens periodically (every 90 days recommended)
- ✅ Use different tokens for staging and production if possible
- ✅ Limit token permissions to only what's needed (write_themes, read_themes)
- ✅ Monitor token usage in Shopify Admin

## 🐛 Troubleshooting

### Issue: "Invalid theme token"
**Solution:** 
1. Regenerate the token in Shopify Admin
2. Update the `SHOPIFY_THEME_TOKEN` secret in GitHub
3. Re-run the workflow

### Issue: "Theme not found"
**Solution:**
1. Verify theme IDs with `shopify theme list`
2. Update `SHOPIFY_STAGING_THEME_ID` and/or `SHOPIFY_PRODUCTION_THEME_ID`
3. Make sure the theme still exists in Shopify

### Issue: "Unauthorized access"
**Solution:**
1. Check that your Shopify app has the correct scopes (`write_themes`, `read_themes`)
2. Verify the app is installed in your store
3. Regenerate the token if needed

### Issue: Deployment still fails after setting secrets
**Solution:**
1. Check the GitHub Actions logs for specific error messages
2. Verify all secret values are correct (no extra spaces)
3. Ensure the store name is just the domain (no https://)
4. Make sure theme IDs are numeric values without quotes

## 📚 Related Documentation

- [CODESPACES_SETUP.md](./CODESPACES_SETUP.md) - GitHub Codespaces setup guide
- [SETUP.md](./SETUP.md) - Local development setup
- [DEPLOYMENT_QUICK_REF.md](./DEPLOYMENT_QUICK_REF.md) - Deployment commands
- [Shopify API Documentation](https://shopify.dev/api/admin-rest)

## 🆘 Need Help?

If you continue to experience issues:
1. Review GitHub Actions workflow logs
2. Check this guide again for missed steps
3. Verify Shopify Admin app configuration
4. Contact the development team

---

**Last Updated:** January 26, 2026  
**Issue Reference:** [GitHub Actions Run #21366843496](https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions/runs/21366843496)
