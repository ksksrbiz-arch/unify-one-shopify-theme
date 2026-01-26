# ⚡ UnifyOne Theme - Deployment Cheatsheet

**Quick Reference for Common Tasks**

---

## 🎯 Start Here (First Time)

```bash
# 1. Clone repo
git clone https://github.com/ksksrbiz-arch/unify-one-shopify-theme.git
cd unify-one-shopify-theme

# 2. Install dependencies
npm install

# 3. Create .env.local with your Shopify token
echo "SHOPIFY_STORE_NAME=1commerce.shop" > .env.local
echo "SHOPIFY_THEME_TOKEN=your_token" >> .env.local

# 4. Authenticate
shopify auth login --store 1commerce.shop

# 5. Start development server
npm run dev
```

**Result:** Local theme dev server at `http://localhost:9000` ✅

---

## 🔄 Daily Development Workflow

```bash
# Create feature branch
git checkout -b features/add-newsletter-section

# Make changes to theme files
# (edit sections/, assets/, etc.)

# Run validation
npm run lint

# Test locally
npm run dev
# Open http://localhost:9000 in browser

# Commit changes
git add .
git commit -m "feat: add newsletter signup section"

# Push to GitHub
git push origin features/add-newsletter-section

# Create Pull Request on GitHub
# GitHub Actions will auto-validate
```

---

## 📤 Deploy to Staging (Testing)

```bash
# From your feature branch, after getting feedback:

# 1. Merge to develop branch
git checkout develop
git pull origin develop
git merge features/add-newsletter-section
git push origin develop

# GitHub Actions automatically:
# ✅ Validates theme
# ✅ Deploys to staging theme
# ✅ Ready for QA at https://1commerce.shop

# Monitor deployment
# GitHub Repo → Actions → Latest workflow run
```

---

## 🚀 Deploy to Production (Live)

```bash
# After QA approval on staging:

# 1. Create version tag
git tag v1.0.1 -m "Release: Add newsletter section"

# 2. Push tag
git push origin v1.0.1

# GitHub Actions automatically:
# ✅ Strict validation
# ✅ Creates GitHub Release
# ✅ Deploys to production theme
# ✅ NOW LIVE at https://1commerce.shop
```

---

## 🎓 Advanced Git Commands

### Stash Changes Temporarily

```bash
# Save work in progress
git stash push -m "Newsletter form - incomplete"

# List all stashes
git stash list

# Restore latest stash
git stash pop

# Apply stash without removing it
git stash apply
```

**When to use:** Need to switch branches but not ready to commit.

### Cherry-pick Specific Commits

```bash
# Find commit hash
git log --oneline features/bug-fix

# Apply specific commit to current branch
git cherry-pick a1b2c3d

# Apply multiple commits
git cherry-pick commit1 commit2 commit3
```

**When to use:** Apply critical fix to production without merging entire feature.

### Keep Feature Branch Updated

```bash
# Rebase feature branch on develop
git checkout features/your-feature
git rebase develop

# Resolve conflicts (if any)
git add .
git rebase --continue

# Update PR
git push --force-with-lease origin features/your-feature
```

**When to use:** Sync feature branch with latest team changes.

### Recover Lost Work

```bash
# View all recent actions
git reflog

# Restore lost commit
git checkout abc123
# Or create branch from it
git branch recover-work abc123
```

**When to use:** Accidentally deleted commits or reset too far.

### Clean Up Commit History

```bash
# Interactive rebase last 5 commits
git rebase -i HEAD~5

# In editor: change 'pick' to 'squash' to combine commits
# Save and exit

# Update PR with clean history
git push --force-with-lease origin features/your-feature
```

**When to use:** Combine small commits before creating PR.

**📖 Full Guide:** See [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) for comprehensive Git command reference.

---

## 🛠️ Common Commands

### Development
```bash
npm run dev              # Start local server (http://localhost:9000)
npm run watch            # Watch for changes
npm run lint             # Validate all (Liquid + CSS + JS)
npm run lint:liquid      # Validate Liquid only
npm run format           # Auto-format code
```

### Deployment
```bash
npm run deploy:staging   # Manual deploy to staging
npm run deploy:prod      # Manual deploy to production
```

### Shopify CLI (advanced)
```bash
shopify theme list --store 1commerce.shop          # List all themes
shopify theme check sections/header.liquid         # Validate specific file
shopify theme pull --allow-live                    # Pull current theme
shopify theme delete --store 1commerce.shop 123456 # Delete theme by ID
```

**Note:** For foolproof deployments, Shopify CLI with Hydrogen support is installed globally in GitHub Actions via:
```bash
npm install -g @shopify/cli @shopify/hydrogen
```

---

## 🐛 Troubleshooting Quick Fixes

### Local dev server won't start
```bash
rm -rf node_modules/.cache
npm ci
npm run dev
```

### Liquid validation errors
```bash
npm run lint:liquid
# Review errors and fix in editor
```

### Deployment fails
```bash
# Check GitHub Actions logs:
# GitHub Repo → Actions → [workflow] → [run] → Logs

# Common causes:
# - Invalid SHOPIFY_THEME_TOKEN secret
# - Wrong theme ID
# - Liquid syntax error
# - Network timeout
```

### Can't authenticate
```bash
shopify auth logout --store 1commerce.shop
shopify auth login --store 1commerce.shop
# Paste the authorization code when prompted
```

---

## 📁 Where to Edit Files

| Task | File | Action |
|------|------|--------|
| Update styling | `assets/custom-styles.css` | Edit CSS variables or add rules |
| Add JavaScript | `assets/theme.js` | Add functions/event listeners |
| Edit header | `sections/header.liquid` | Edit HTML/Liquid |
| Edit footer | `sections/footer.liquid` | Edit HTML/Liquid |
| Product display | `templates/product.liquid` | Edit product page layout |
| Add theme settings | `config/settings_schema.json` | Add JSON configuration |
| Update docs | `README.md`, `SETUP.md` | Edit markdown |

---

## 🔐 GitHub Secrets (Admin Only)

Add to: GitHub Repo → Settings → Secrets & Variables → Actions

```
SHOPIFY_STORE_NAME=1commerce.shop
SHOPIFY_THEME_TOKEN=shptka_[token from Shopify Admin]
SHOPIFY_STAGING_THEME_ID=987654321
SHOPIFY_PRODUCTION_THEME_ID=123456789
OXYGEN_DEPLOYMENT_TOKEN_1000088857=[token from Shopify Oxygen] (optional, for Hydrogen apps)
SLACK_WEBHOOK=https://hooks.slack.com/... (optional)
```

**How to get theme IDs:**
```bash
shopify theme list --store 1commerce.shop
```

---

## 📊 Deployment Status Checks

### See all deployments
https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions

### See specific workflow
- Staging: `deploy-staging.yml`
- Production: `deploy-production.yml`

### Manual re-run (if needed)
```
GitHub Repo → Actions → [Workflow] → Re-run jobs
```

---

## 🎯 Git Workflow Simplified

```
Create Feature
      ↓
   git checkout -b features/your-feature
   [make changes]
   git add .
   git commit -m "description"
   git push origin features/your-feature
      ↓
Test Locally
      ↓
   npm run dev
      ↓
Create Pull Request
      ↓
   [GitHub] Create PR from features/your-feature → develop
      ↓
Merge to Develop
      ↓
   [GitHub] Review & Merge PR
      ↓
Auto-Deploy to STAGING
      ↓
   [GitHub Actions runs automatically]
   ✅ Staging theme updated
      ↓
QA Testing
      ↓
   [Test theme at https://1commerce.shop]
      ↓
Tag Release
      ↓
   git tag v1.0.1
   git push origin v1.0.1
      ↓
Auto-Deploy to PRODUCTION
      ↓
   [GitHub Actions runs automatically]
   🚀 Production theme LIVE
```

---

## 📞 Quick Links

- **GitHub Repo**: https://github.com/ksksrbiz-arch/unify-one-shopify-theme
- **GitHub Actions**: https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions
- **Shopify Admin**: https://admin.shopify.com/store/1commerce
- **Store Frontend**: https://1commerce.shop
- **Full Setup Guide**: See `SETUP.md` in repo
- **Full Docs**: See `README.md` in repo

---

## ✅ Pre-Deployment Checklist

Before pushing to production:

- [ ] Changes tested locally (`npm run dev`)
- [ ] Code validated (`npm run lint`)
- [ ] Styling uses CSS variables
- [ ] JavaScript is vanilla (no jQuery)
- [ ] Liquid syntax is correct
- [ ] Mobile responsive
- [ ] Images optimized
- [ ] Accessibility tested
- [ ] Documentation updated
- [ ] Staging tested on 1commerce.shop
- [ ] QA approval received

---

**Version**: 1.0.0  
**Last Updated**: January 21, 2026  
**Store**: 1commerce.shop
