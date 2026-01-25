# UnifyOne Shopify Theme - Repository Management Guide

**Repository:** [github.com/ksksrbiz-arch/unify-one-shopify-theme](https://github.com/ksksrbiz-arch/unify-one-shopify-theme)  
**Store Domain:** 1commerce.shop  
**Last Updated:** January 21, 2026

---

## 📋 Quick Navigation

| Document | Purpose | For Who |
|----------|---------|----------|
| **[SETUP.md](./SETUP.md)** | Local dev setup & deployment | Developers |
| **[CSS_INTEGRATION_GUIDE.md](./CSS_INTEGRATION_GUIDE.md)** | CSS integration via GitHub connector | Frontend Developers |
| **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** | Connect to 19 revenue streams | Full-stack devs |
| **[ANALYTICS_PIXELS_SETUP.md](./ANALYTICS_PIXELS_SETUP.md)** | Multi-platform pixel tracking | Marketing & Analytics |
| **[Performance Workflows](./.github/workflows/performance-monitoring.yml)** | Lighthouse CI monitoring | DevOps |

---

## 📁 Repository Contents

### Core Files
```
├── README.md                      # This file - project overview
├── SETUP.md                       # Detailed setup & deployment instructions
├── CSS_INTEGRATION_GUIDE.md       # CSS integration via GitHub connector (NEW)
├── BACKEND_INTEGRATION.md         # Backend API endpoints for 19 revenue streams (NEW)
├── ANALYTICS_PIXELS_SETUP.md      # Multi-platform analytics configuration (NEW)
├── theme.json                     # Theme metadata
├── package.json                   # Dependencies & npm scripts
├── lighthouserc.json              # Performance budget configuration (NEW)
├── .shopifyignore                 # Files excluded from Shopify deployment
└── .gitignore                     # Files excluded from Git
```

### Theme Assets
```
assets/
├── custom-styles.css              # 10KB+ of production CSS
│                                  # - CSS variables (design system)
│                                  # - Typography system
│                                  # - Component library (buttons, forms, cards)
│                                  # - Responsive grid layout
│                                  # - Accessibility features
│                                  # - Print styles
│                                  # - Utility classes
│
└── theme.js                       # 8KB+ of vanilla JavaScript
                                   # - Cookie consent management
                                   # - Mobile menu toggle
                                   # - Product gallery
                                   # - Cart functionality
                                   # - Lazy image loading
                                   # - No jQuery/React dependency
```

### Liquid Templates
```
layout/
└── theme.liquid                   # Base HTML structure
                                   # - Meta tags (SEO, OG, Twitter)
                                   # - CSS/JS includes
                                   # - Section includes
                                   # - Structured data (JSON-LD)

sections/                          # [READY FOR CUSTOM SECTIONS]
- header.liquid
- footer.liquid
- Product display section
- Hero banner section
- etc.

templates/                         # [READY FOR PAGE TEMPLATES]
- product.liquid
- collection.liquid
- cart.liquid
- page.liquid
- etc.

snippets/                          # [READY FOR REUSABLE COMPONENTS]
- product-card.liquid
- button.liquid
- form-input.liquid
- etc.
```

### CI/CD Workflows
```
.github/workflows/
├── deploy-staging.yml             # Triggers on: git push origin main
│                                  # - Runs Liquid linter
│                                  # - Deploys to staging theme
│                                  # - Posts status to PR
│
├── deploy-production.yml          # Triggers on: git tag v*
│                                  # - Strict validation (fails on errors)
│                                  # - Deploys to production theme
│                                  # - Creates GitHub Release
│                                  # - Posts to Slack (optional)
│
└── performance-monitoring.yml     # Triggers on: git push origin main (NEW)
                                   # - Runs Lighthouse CI checks
                                   # - Monitors performance metrics
                                   # - Verifies performance budgets
                                   # - Posts results to PR comments
```

---

## 🚀 How to Deploy

### Staging Deployment (Auto)
**Trigger:** Push to `main` branch

```bash
# Make changes to theme files
git add .
git commit -m "Update theme: add new section"
git push origin main

# GitHub Actions automatically:
# 1. Validates Liquid syntax
# 2. Checks CSS/JS
# 3. Runs Lighthouse performance checks
# 4. Deploys to staging theme (ID from GitHub secrets)
# 5. Posts deployment status
# 6. Ready for QA testing at https://1commerce.shop
```

### Production Deployment (Manual)
**Trigger:** Create and push version tag

```bash
# After QA approval on staging:
git tag v1.0.1 -m "Release version 1.0.1: Add new product section"
git push origin v1.0.1

# GitHub Actions automatically:
# 1. Runs strict validation
# 2. Creates GitHub Release
# 3. Deploys to production theme (ID from GitHub secrets)
# 4. Updates documentation
# 5. Posts to Slack (if configured)
```

---

## 🔧 Common Operations

### Adding a New Section
1. Create file: `sections/my-section.liquid`
2. Add HTML + Shopify Liquid code
3. Add JSON schema at bottom for customization
4. Include in template: `{% section 'my-section' %}`
5. Push to GitHub → Auto-deploys to staging

### Updating Styles
1. Edit: `assets/custom-styles.css`
2. Use existing CSS variables for consistency
3. Add new variables to `:root` if needed
4. Test locally: `npm run dev`
5. Push → Auto-deploys

### Modifying JavaScript
1. Edit: `assets/theme.js`
2. Functions automatically exposed to window scope
3. Vanilla JS only (no dependencies)
4. Test in browser console
5. Push → Auto-deploys

### Theme Configuration
1. Edit: `config/settings_schema.json`
2. Add new settings groups/fields
3. These appear in Shopify Admin: Theme Settings
4. Reference in Liquid: `{{ settings.setting_name }}`
5. Push → Deploy

---

## 📊 GitHub Secrets Required

Add these to repository settings (Settings → Secrets & Variables → Actions):

| Secret | Value | Where to Get |
|--------|-------|---------------|
| `SHOPIFY_STORE_NAME` | `1commerce.shop` | N/A |
| `SHOPIFY_THEME_TOKEN` | `shptka_xxxxx...` | Shopify Admin → Develop apps → Token |
| `SHOPIFY_STAGING_THEME_ID` | `987654321` | `shopify theme list --store 1commerce.shop` |
| `SHOPIFY_PRODUCTION_THEME_ID` | `123456789` | `shopify theme list --store 1commerce.shop` |
| `SLACK_WEBHOOK` (optional) | `https://hooks.slack.com/...` | Slack workspace settings |
| `BACKEND_API_KEY` (optional) | `sk_live_xxxxx` | OneCommerce backend |

---

## 🔗 Backend Integration

### Connect to OneCommerce API (19 Revenue Streams)

Your theme can call backend endpoints for:
- Core transactions & product sync
- SaaS dashboard analytics
- Affiliate network tracking
- Shopify integration webhooks
- GoDaddy domain sync
- White-label hosting management
- Email automation
- Payment processing
- ... and 11 more revenue streams

**See**: [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for full endpoint documentation and examples.

**Key URLs**:
```
Production: https://api.1commerce.shop/v1
Staging:    https://staging-api.1commerce.shop/v1
```

---

## 📈 Analytics & Pixel Tracking

### Multi-Platform Analytics Setup

Your store automatically tracks conversions on:
- ✅ Google Analytics 4 + Google Ads
- ✅ Facebook & Instagram Ads
- ✅ TikTok Ads
- ✅ Pinterest
- ✅ Snapchat Ads
- ✅ Microsoft Advertising (Bing)
- ✅ Shopify Native Analytics
- ✅ Custom Analytics Funnel (tracking engagement)

**See**: [ANALYTICS_PIXELS_SETUP.md](./ANALYTICS_PIXELS_SETUP.md) for complete setup guide, pixel codes, and funnel creation.

**Quick Start**: Install 5 Shopify apps + create 1 custom pixel (30 minutes total).

---

## ⚡ Performance Monitoring

### Lighthouse CI Automation

Every push to `main` automatically runs Lighthouse CI performance checks:
- ✅ Performance score (target: > 85)
- ✅ Accessibility score (target: > 90)
- ✅ Best practices score (target: > 85)
- ✅ SEO score (target: > 90)
- ✅ Core Web Vitals (LCP, CLS, FID, TBT)

**Performance Budgets**:
- First Contentful Paint: < 2 seconds
- Largest Contentful Paint: < 2.5 seconds
- Cumulative Layout Shift: < 0.1
- Total Blocking Time: < 300ms

**See**: [lighthouserc.json](./lighthouserc.json) for detailed configuration.

**Results**: Posted to PR comments automatically. View full reports on Google Cloud Storage (temporary public URLs).

---

## 🌿 Branching Strategy

```
main (production-ready)
  ↑
features/feature-name (feature branches)
```

**Branch Rules:**
- `main` - Production. Tags trigger production deployments. Every push triggers staging deploy + performance checks.
- `features/*` - Development branches. Create PR to main before deploying.

---

## 📝 Development Checklist

Before pushing code:

- [ ] Code follows Shopify best practices
- [ ] No console errors: `npm run lint`
- [ ] CSS uses design system variables
- [ ] JavaScript is vanilla (no jQuery/external libs)
- [ ] Liquid syntax is valid
- [ ] Mobile responsive tested
- [ ] Accessibility tested (keyboard nav, contrast)
- [ ] Images optimized
- [ ] Comments added for complex code
- [ ] Performance budget targets met (check Lighthouse output)

---

## 🐛 Debugging Deployments

### Check Workflow Status
```
GitHub Repo → Actions → Latest Run
```

**Common Issues:**
- ❌ "Cannot authenticate" → Check SHOPIFY_THEME_TOKEN secret
- ❌ "Invalid theme ID" → Verify SHOPIFY_*_THEME_ID secrets match actual IDs
- ❌ "Liquid syntax error" → Run `npm run lint:liquid` locally to find issues
- ❌ "Deployment timeout" → Large themes may take longer; check logs
- ❌ "Performance budget exceeded" → Check Lighthouse report in PR comments

### Local Validation
```bash
# Lint Liquid templates
npm run lint:liquid

# Lint all (Liquid + CSS + JS)
npm run lint

# Test locally
npm run dev
# Visit http://localhost:9000

# Format code
npm run format

# Check performance (requires Lighthouse CLI)
npm run lighthouse:check
```

---

## 📚 File Permissions & Ownership

**Read**: Anyone with GitHub access  
**Write**: Dev team members  
**Deploy**: GitHub Actions (automated)  
**Admin**: PNW Enterprises leadership

---

## 🔐 Security Checklist

- ✅ `.env.local` is in `.gitignore` (never committed)
- ✅ GitHub Secrets are encrypted
- ✅ Shopify API token has minimum required scopes
- ✅ No sensitive data in code comments
- ✅ Theme files are validated before deployment
- ✅ Production deployments require version tag (prevents accidental pushes)

---

## 📈 Performance Targets

- CSS file size: < 50KB (gzipped < 10KB)
- JavaScript size: < 20KB (gzipped < 5KB)
- Page load time: < 3 seconds
- Lighthouse score: > 80 (all categories)
- First Contentful Paint: < 2 seconds
- Cumulative Layout Shift: < 0.1

---

## 🔄 Maintenance Schedule

| Task | Frequency | Owner |
|------|-----------|-------|
| Dependency updates | Quarterly | Dev Lead |
| Performance audit | Monthly | Dev Lead |
| Security check | Weekly | DevOps |
| Backup themes | Daily | Shopify (automatic) |
| Code review | Per PR | Dev Team |
| Analytics review | Weekly | Marketing |
| Lighthouse reports | Per deployment | CI/CD |

---

## 📞 Contacts & Escalation

- **Technical Issues**: Dev Team Slack
- **Shopify Questions**: Shopify Support (1commerce.shop admin)
- **Production Issues**: On-call engineer (escalate in Slack #critical)
- **Questions on CI/CD**: DevOps team
- **Analytics Questions**: Marketing team
- **Backend Integration**: Full-stack dev team

---

## 🎓 Learning Resources

- **Shopify Theme Dev**: https://shopify.dev/themes
- **Liquid Language Docs**: https://shopify.dev/liquid
- **Shopify CLI**: https://shopify.dev/themes/tools/cli
- **GitHub Actions**: https://github.com/features/actions
- **Lighthouse CI**: https://github.com/treosh/lighthouse-ci-action
- **Google Analytics 4**: https://support.google.com/analytics/
- **Meta Pixel**: https://www.facebook.com/business/help/952192354843008

---

## ✅ Pre-Launch Checklist

### Setup Phase
- [ ] Repository created and initialized
- [ ] Theme files uploaded (custom-styles.css, theme.js, liquid templates)
- [ ] GitHub Secrets configured
- [ ] CI/CD workflows tested (staging deploy works)
- [ ] Performance monitoring configured (Lighthouse CI)

### Store Configuration
- [ ] Staging theme created in Shopify
- [ ] Production theme configured
- [ ] Analytics apps installed (Google, Meta, TikTok, Pinterest, Snapchat)
- [ ] Custom pixel created and tested
- [ ] Backend API configured (if using OneCommerce backend)

### Testing & Validation
- [ ] Local development tested (`npm run dev`)
- [ ] Staging theme tested at https://1commerce.shop
- [ ] Performance budgets verified (Lighthouse scores > targets)
- [ ] Analytics funnel tested (make test purchase, verify events fire)
- [ ] Backend integration tested (if applicable)

### Team & Documentation
- [ ] Team trained on deployment process
- [ ] Documentation reviewed and updated
- [ ] Monitoring set up (alerts for failed deployments)
- [ ] Slack notifications configured

---

## 📊 What's New (January 21, 2026)

✨ **New Features**:
- 🔗 **Backend Integration Guide** - Connect to 19 OneCommerce revenue streams
- 📊 **Analytics & Pixels Setup** - Multi-platform conversion tracking
- ⚡ **Lighthouse CI Monitoring** - Automatic performance checks on every deploy
- 📈 **Performance Dashboard** - Track Core Web Vitals trends
- 🎯 **Conversion Funnel** - Track customer journey from sessions to purchases

🔄 **Updated**:
- Improved deployment workflows with performance validation
- Enhanced security configuration
- Expanded documentation

---

**Repository Created:** January 21, 2026  
**Theme Version:** 1.0.0+analytics+performance+backend-integration  
**Maintained By:** PNW Enterprises Development Team  
**Status**: ✅ Production Ready | 🚀 Ready for OneCommerce Backend