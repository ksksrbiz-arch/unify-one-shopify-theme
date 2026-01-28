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

### Additional Shopify Configuration Secrets

These additional secrets are required for advanced Shopify features like customer account management and storefront API integration:

#### 6. PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID
- **Name:** `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`
- **Value:** Your Shopify Customer Account API Client ID
- **Description:** OAuth client ID for customer authentication

#### 7. PUBLIC_CUSTOMER_ACCOUNT_API_URL
- **Name:** `PUBLIC_CUSTOMER_ACCOUNT_API_URL`
- **Value:** `https://shopify.com/[SHOP_ID]`
- **Description:** Customer Account API endpoint URL

#### 8. PUBLIC_STORE_DOMAIN
- **Name:** `PUBLIC_STORE_DOMAIN`
- **Value:** Your Shopify store domain (e.g., `yourstore.myshopify.com`)
- **Description:** Full myshopify.com domain for your store

#### 9. PUBLIC_STOREFRONT_API_TOKEN
- **Name:** `PUBLIC_STOREFRONT_API_TOKEN`
- **Value:** Your Storefront API access token
- **Description:** Public token for Storefront API access

#### 10. PRIVATE_STOREFRONT_API_TOKEN
- **Name:** `PRIVATE_STOREFRONT_API_TOKEN`
- **Value:** Your private Storefront API access token (starts with `shpat_`)
- **Description:** Private token for secure Storefront API operations

#### 11. PUBLIC_STOREFRONT_ID
- **Name:** `PUBLIC_STOREFRONT_ID`
- **Value:** Your Storefront ID (numeric)
- **Description:** Unique identifier for your storefront

#### 12. SESSION_SECRET
- **Name:** `SESSION_SECRET`
- **Value:** A secure random string (minimum 32 characters)
- **Description:** Secret key for session encryption and management

#### 13. SHOP_ID
- **Name:** `SHOP_ID`
- **Value:** Your Shopify shop ID (numeric)
- **Description:** Unique numeric identifier for your Shopify shop

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

### Step 5: Get Additional Shopify API Credentials

#### Getting Storefront API Tokens

1. Log into Shopify Admin: `https://1commerce.shop/admin`
2. Go to **Settings** → **Apps and sales channels**
3. Click **"Develop apps"** (or find your existing app)
4. Create a new app or use existing: `UnifyOne Storefront API`
5. Go to **Configuration** tab
6. Under **Storefront API access scopes**, enable:
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_read_product_tags`
   - ✅ `unauthenticated_read_checkouts`
   - ✅ `unauthenticated_write_checkouts`
7. Click **"Save"**
8. Go to **API credentials** tab
9. Under **Storefront API access token**, you'll see:
   - **Public token** → Use for `PUBLIC_STOREFRONT_API_TOKEN`
   - **Admin API access token** → Use for `PRIVATE_STOREFRONT_API_TOKEN`

#### Getting Customer Account API Credentials

1. In Shopify Admin, go to **Settings** → **Customer accounts**
2. Enable **New customer accounts** (if not already enabled)
3. Go to **Settings** → **Apps and sales channels** → Your app
4. Under **Configuration**, enable **Customer Account API** scopes:
   - ✅ `openid`
   - ✅ `email`
   - ✅ `profile`
5. Copy the **Client ID** → Use for `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`
6. The API URL format is: `https://shopify.com/[YOUR_SHOP_ID]`

#### Getting Shop ID and Store Domain

1. In Shopify Admin, go to **Settings** → **General**
2. Under **Store details**, you'll find:
   - **Store name** section shows your Shop ID in the URL
   - **Primary domain** shows your myshopify.com domain
3. Alternatively, check the admin URL:
   - Format: `https://admin.shopify.com/store/[YOUR_SHOP_ID]`
   - Or: Look at admin page source for `Shopify.shop_id`

#### Getting Storefront ID

1. The Storefront ID is typically found in:
   - Your Shopify Admin → **Settings** → **Apps** → App details
   - Or via API: `GET /admin/api/2024-01/storefronts.json`
2. It's a numeric identifier unique to your storefront configuration

#### Generating Session Secret

Generate a secure random string (32+ characters) using one of these methods:

**Option A: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option C: Using Python**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### Step 6: Verify Secrets Are Set

1. Go back to **Settings** → **Secrets and variables** → **Actions**
2. You should see all secrets listed (values are hidden)
3. Verify you have:
   
   **Required for Basic Deployment:**
   - ✅ SHOPIFY_STORE_NAME
   - ✅ SHOPIFY_THEME_TOKEN
   - ✅ SHOPIFY_STAGING_THEME_ID
   - ✅ SHOPIFY_PRODUCTION_THEME_ID
   
   **Required for Advanced Features:**
   - ✅ PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID
   - ✅ PUBLIC_CUSTOMER_ACCOUNT_API_URL
   - ✅ PUBLIC_STORE_DOMAIN
   - ✅ PUBLIC_STOREFRONT_API_TOKEN
   - ✅ PRIVATE_STOREFRONT_API_TOKEN
   - ✅ PUBLIC_STOREFRONT_ID
   - ✅ SESSION_SECRET
   - ✅ SHOP_ID
   
   **Optional:**
   - ⭕ SLACK_WEBHOOK

### Step 7: Test Deployment

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
