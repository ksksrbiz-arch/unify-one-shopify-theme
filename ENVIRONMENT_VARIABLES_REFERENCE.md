# Environment Variables Reference

This document provides a comprehensive reference for all environment variables used in the UnifyOne Shopify Theme project.

**Related Issues:**
- [Issue #11 - Production Uptime Issue](https://github.com/ksksrbiz-arch/unify-one-shopify-theme/issues/11)

**Last Updated:** January 28, 2026

---

## 📋 Table of Contents

1. [Core Shopify Configuration](#core-shopify-configuration)
2. [Customer Account API](#customer-account-api)
3. [Storefront API Configuration](#storefront-api-configuration)
4. [Shop and Session Configuration](#shop-and-session-configuration)
5. [Optional Integrations](#optional-integrations)
6. [Setting Up Environment Variables](#setting-up-environment-variables)

---

## Core Shopify Configuration

These variables are required for basic theme deployment and management.

### SHOPIFY_STORE_NAME
- **Type:** Required
- **Description:** Your Shopify store domain (without https://)
- **Example:** `1commerce.shop` or `jbghfe-hp.myshopify.com`
- **Where to find:** Shopify Admin → Settings → General → Store details

### SHOPIFY_THEME_TOKEN
- **Type:** Required (Secret)
- **Description:** Admin API access token for theme deployment
- **Example:** `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Permissions needed:** `write_themes`, `read_themes`
- **Where to get:** Shopify Admin → Settings → Apps → Create custom app → API credentials

### SHOPIFY_PRODUCTION_THEME_ID
- **Type:** Required
- **Description:** Numeric ID of your live production theme
- **Example:** `123456789`
- **Where to find:** `shopify theme list` or theme URL in Shopify Admin

### SHOPIFY_STAGING_THEME_ID
- **Type:** Required
- **Description:** Numeric ID of your staging/development theme
- **Example:** `987654321`
- **Where to find:** `shopify theme list` or theme URL in Shopify Admin

---

## Customer Account API

Required for customer authentication, account management, and personalized experiences.

### PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID
- **Type:** Required (Public)
- **Description:** OAuth 2.0 Client ID for Customer Account API
- **Example:** `f9f17494-22c2-4505-a329-2376b696994f`
- **Format:** UUID (Universally Unique Identifier)
- **Where to get:** Shopify Admin → Settings → Customer accounts → API credentials

### PUBLIC_CUSTOMER_ACCOUNT_API_URL
- **Type:** Required (Public)
- **Description:** Base URL for Customer Account API endpoints
- **Example:** `https://shopify.com/79233745145`
- **Format:** `https://shopify.com/[SHOP_ID]`
- **Where to get:** Constructed using your SHOP_ID

---

## Storefront API Configuration

Required for headless/API-based storefront operations, product queries, and cart management.

### PUBLIC_STORE_DOMAIN
- **Type:** Required (Public)
- **Description:** Full myshopify.com domain for your store
- **Example:** `jbghfe-hp.myshopify.com`
- **Format:** `[store-name].myshopify.com`
- **Where to find:** Shopify Admin → Settings → General → Primary domain

### PUBLIC_STOREFRONT_API_TOKEN
- **Type:** Required (Public)
- **Description:** Public access token for Storefront API (read operations)
- **Example:** `c23bebc0b43fc6fa5d37afb390028c34`
- **Format:** 32-character hexadecimal string
- **Permissions needed:** Storefront API scopes (unauthenticated_read_*)
- **Where to get:** Shopify Admin → Settings → Apps → Custom app → API credentials

### PRIVATE_STOREFRONT_API_TOKEN
- **Type:** Required (Secret)
- **Description:** Private token for secure Storefront API operations
- **Example:** `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`
- **Format:** Starts with `shpat_`
- **Usage:** Server-side operations only, never expose to client
- **Where to get:** Shopify Admin → Settings → Apps → Custom app → Admin API credentials

### PUBLIC_STOREFRONT_ID
- **Type:** Required (Public)
- **Description:** Unique numeric identifier for your storefront configuration
- **Example:** `1000089718`
- **Format:** Numeric string
- **Where to get:** Shopify API or admin app configuration

---

## Shop and Session Configuration

### SHOP_ID
- **Type:** Required (Public)
- **Description:** Unique numeric identifier for your Shopify shop
- **Example:** `79233745145`
- **Format:** Numeric string
- **Where to find:** 
  - Shopify Admin URL: `https://admin.shopify.com/store/[SHOP_ID]`
  - Settings → General (in page source)

### SESSION_SECRET
- **Type:** Required (Secret)
- **Description:** Secret key for session encryption and JWT signing
- **Example:** `bff8097d82fc3545402dc711765f05dcb9857d90`
- **Format:** Minimum 32 characters, hexadecimal recommended
- **Security:** Must be kept secret, rotate periodically
- **How to generate:**
  ```bash
  # Using Node.js
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  
  # Using OpenSSL
  openssl rand -hex 32
  
  # Using Python
  python3 -c "import secrets; print(secrets.token_hex(32))"
  ```

---

## Optional Integrations

### SLACK_WEBHOOK
- **Type:** Optional
- **Description:** Webhook URL for deployment notifications
- **Example:** `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX`
- **Where to get:** Slack App settings → Incoming Webhooks

### BACKEND_API_KEY
- **Type:** Optional (Secret)
- **Description:** API key for OneCommerce backend integration
- **Example:** `your_api_key_here`
- **Where to get:** Backend service provider

### BACKEND_API_URL
- **Type:** Optional
- **Description:** Base URL for backend API endpoints
- **Example:** `https://api.1commerce.shop/v1`
- **Where to get:** Backend service provider

---

## Setting Up Environment Variables

### For Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values in `.env.local`

3. **Never commit** `.env.local` to version control (already in `.gitignore`)

### For GitHub Actions / CI/CD

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add each variable as a separate secret

**See also:** [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) for detailed instructions

### For Production Deployment

- All secrets must be configured as GitHub Secrets
- Public variables can be embedded in theme code where needed
- Never hardcode sensitive values in theme files
- Use environment-specific values for staging vs. production

---

## 🔒 Security Best Practices

### Secret vs. Public Variables

**Secret Variables (Never expose to client):**
- `SHOPIFY_THEME_TOKEN`
- `PRIVATE_STOREFRONT_API_TOKEN`
- `SESSION_SECRET`
- `BACKEND_API_KEY`
- `SLACK_WEBHOOK`

**Public Variables (Can be client-facing):**
- `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`
- `PUBLIC_CUSTOMER_ACCOUNT_API_URL`
- `PUBLIC_STORE_DOMAIN`
- `PUBLIC_STOREFRONT_API_TOKEN`
- `PUBLIC_STOREFRONT_ID`
- `SHOP_ID`

### Security Checklist

- ✅ Use GitHub Secrets for all sensitive values
- ✅ Rotate tokens every 90 days
- ✅ Never commit `.env.local` or actual secret values
- ✅ Use different credentials for staging and production
- ✅ Monitor API usage in Shopify Admin
- ✅ Limit API token scopes to minimum required
- ✅ Use HTTPS for all API endpoints
- ✅ Validate and sanitize all user inputs

---

## 📚 Related Documentation

- [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) - Detailed setup guide
- [SETUP.md](./SETUP.md) - Local development setup
- [DEPLOYMENT_QUICK_REF.md](./DEPLOYMENT_QUICK_REF.md) - Deployment guide
- [SECURITY.md](./SECURITY.md) - Security guidelines
- [Shopify API Documentation](https://shopify.dev/api)

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Variables not loading in GitHub Actions
- **Solution:** Verify secrets are set in repository settings
- **Check:** Settings → Secrets and variables → Actions

**Issue:** "Invalid API credentials" error
- **Solution:** Verify token has correct scopes and is not expired
- **Check:** Shopify Admin → Apps → Your app → API credentials

**Issue:** Customer Account API not working
- **Solution:** Ensure new customer accounts are enabled
- **Check:** Shopify Admin → Settings → Customer accounts

**Issue:** CORS errors with Storefront API
- **Solution:** Verify domain is allowed in app settings
- **Check:** App configuration → Allowed domains

---

**Issue Reference:** Related to [Issue #11](https://github.com/ksksrbiz-arch/unify-one-shopify-theme/issues/11) - Production Uptime Configuration

**Last Updated:** January 28, 2026
