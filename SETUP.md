# UnifyOne Shopify Theme - Setup Guide

**Domain:** `1commerce.shop`  
**Migrated From:** GoDaddy  
**Last Updated:** January 21, 2026

## 📋 Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **npm** 9+ (comes with Node.js)
- **Shopify CLI** - Install with: `npm install -g @shopify/cli @shopify/theme @shopify/hydrogen`
- **Git** - For version control and GitHub integration
- **GitHub Account** - For CI/CD workflows

## 🔧 Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/ksksrbiz-arch/unify-one-shopify-theme.git
cd unify-one-shopify-theme
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create `.env.local` in the root directory:

```bash
# .env.local
SHOPIFY_STORE_NAME=1commerce.shop
SHOPIFY_THEME_TOKEN=your_theme_token_here
```

**How to get Shopify Theme Token:**

1. Go to Shopify Admin → Settings → Apps & integrations
2. Click "Develop apps" (or "Create an app")
3. Create a new app called "UnifyOne Theme CI/CD"
4. Under "Admin API scopes", enable:
   - `write_themes`
   - `read_themes`
5. Generate access token → Copy to `.env.local`

### 4. Authenticate with Shopify

```bash
shopify auth login --store 1commerce.shop
```

This creates a local authentication session.

### 5. Start Development Server (Optional)

```bash
npm run dev
```

This launches a local development server with live reload at `http://localhost:9000`

**Note:** The dev server is **optional**. See the "Working Without Dev Server" section below for offline development.

## 🚀 Deployment Pipeline

### GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets & variables → Actions):

| Secret Name | Description | Value |
|-----------|-------------|-------|
| `SHOPIFY_STORE_NAME` | Shopify store name | `1commerce.shop` |
| `SHOPIFY_THEME_TOKEN` | API access token | From Shopify Admin |
| `SHOPIFY_STAGING_THEME_ID` | Staging theme ID | From Shopify (e.g., 987654321) |
| `SHOPIFY_PRODUCTION_THEME_ID` | Production theme ID | From Shopify (e.g., 123456789) |
| `OXYGEN_DEPLOYMENT_TOKEN_1000088857` | (Optional) Oxygen deployment token for Hydrogen apps | From Shopify Oxygen |
| `SLACK_WEBHOOK` | (Optional) Slack webhook for notifications | https://hooks.slack.com/... |

### Finding Theme IDs

```bash
shopify theme list --store 1commerce.shop
```

Output example:
```
ID             NAME          ROLE
123456789      Live          main
987654321      Staging       development
```

### Staging Deployment

**Automatic:** Push to `develop` branch

```bash
git checkout develop
git commit -am "Update theme"
git push origin develop
```

**Manual:** Trigger workflow

```bash
gh workflow run deploy-staging.yml -R ksksrbiz-arch/unify-one-shopify-theme
```

### Production Deployment

**Automatic:** Create and push a version tag

```bash
git tag v1.0.1
git push origin v1.0.1
```

**Manual:** Trigger workflow with version input

```bash
gh workflow run deploy-production.yml -R ksksrbiz-arch/unify-one-shopify-theme -f version=v1.0.1
```

## 📁 Directory Structure

```
.
├── assets/                    # Static files
│   ├── custom-styles.css     # Main theme CSS
│   └── theme.js              # Theme JavaScript
├── config/
│   └── settings_schema.json   # Theme configuration
├── layout/
│   └── theme.liquid          # Base template
├── sections/
│   ├── header.liquid
│   └── footer.liquid
├── templates/
│   ├── product.liquid
│   ├── collection.liquid
│   └── cart.liquid
├── snippets/
│   └── product-card.liquid
├── .github/workflows/
│   ├── deploy-staging.yml
│   └── deploy-production.yml
├── .shopifyignore             # Shopify deployment ignore
├── .env.local                 # Local environment (git-ignored)
├── package.json
├── theme.json
├── README.md
└── SETUP.md                   # This file
```

## 🎨 Customization Guide

### CSS Variables

Edit `assets/custom-styles.css` to customize the design system:

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --accent-color: #28a745;
  /* ... more variables ... */
}
```

### Liquid Settings

Edit `config/settings_schema.json` to add theme customization options visible in Shopify Admin:

```json
{
  "name": "Colors",
  "settings": [
    {
      "type": "color",
      "id": "primary_color",
      "label": "Primary Color",
      "default": "#007bff"
    }
  ]
}
```

### Adding New Sections

1. Create `sections/new-section.liquid`
2. Add schema definition at the bottom of the file
3. Include in templates: `{% section 'new-section' %}`

## 🧪 Testing & Validation

### Working Without Dev Server

You can develop the theme **without running the Shopify dev server**. This is ideal for:
- Offline development
- Quick edits and commits
- CI/CD-based workflow (push to deploy)
- Working without Shopify authentication

#### What Works Without Server:

**✅ File Editing**
```bash
# Edit any theme file in your editor
code assets/custom-styles.css
code sections/header.liquid
code assets/theme.js
```

**✅ Linting & Validation**
```bash
# Lint Liquid templates
npm run lint:liquid

# Full theme check
npm run lint

# Format all code
npm run format
```

**✅ Testing**
```bash
# Run Jest tests
npm test

# Watch mode
npm test -- --watch
```

**✅ Git Operations**
```bash
# Commit and push (triggers CI/CD deployment)
git add .
git commit -m "Update header section"
git push origin main
```

**✅ Asset Optimization**
```bash
npm run optimize
```

#### When You Need the Dev Server:

The dev server (`npm run dev`) is **only required** for:
- Live preview in browser with real Shopify data
- Testing dynamic content (products, cart, checkout)
- Real-time hot-reload during development
- Debugging Liquid with store context

#### Recommended Offline Workflow:

1. **Make changes** - Edit theme files locally
2. **Validate** - Run `npm run lint`
3. **Test** - Run `npm test` (if applicable)
4. **Commit** - `git commit -am "Description"`
5. **Deploy** - `git push origin main` (auto-deploys to staging via GitHub Actions)
6. **Verify** - Check staging theme at https://1commerce.shop

This workflow eliminates the need for local Shopify authentication and leverages CI/CD for testing.

### Lint Liquid Templates

```bash
npm run lint:liquid
```

### Full Theme Check

```bash
npm run lint
```

### Local Preview

```bash
npm run dev
# Open http://localhost:9000 in browser
```

## 📦 Deployment Workflow Diagram

```
┌─────────────────────────────────────────┐
│  Git Feature Branch Development         │
│  (work on features/feature-name)        │
└────────────────────┬────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Create Pull Request   │
        │  to develop branch     │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  GitHub Actions runs   │
        │  lint & validation     │
        └────────────┬───────────┘
                     │
        ┌────────────▼───────────┐
        │  Merge to develop      │
        └────────────┬───────────┘
                     │
                     ▼
    ┌────────────────────────────────────┐
    │  Auto-Deploy to Staging Theme      │
    │  (GitHub Actions workflow)         │
    │  TEST: https://1commerce.shop      │
    └────────────┬───────────────────────┘
                 │
        ┌────────▼──────────┐
        │  QA Approval      │
        └────────┬──────────┘
                 │
        ┌────────▼──────────┐
        │  Tag Release      │
        │  git tag v1.0.0   │
        │  git push --tags  │
        └────────┬──────────┘
                 │
                 ▼
    ┌────────────────────────────────────┐
    │  Auto-Deploy to Production         │
    │  (GitHub Actions workflow)         │
    │  LIVE: https://1commerce.shop      │
    └────────────────────────────────────┘
```

## 🐛 Troubleshooting

### Quick Reference: Server vs No Server

| Development Task | Requires Dev Server? | Command/Action |
|-----------------|---------------------|----------------|
| **Edit Liquid files** | ❌ No | Open in VS Code/editor |
| **Edit CSS files** | ❌ No | Open in VS Code/editor |
| **Edit JavaScript** | ❌ No | Open in VS Code/editor |
| **Lint Liquid templates** | ❌ No | `npm run lint:liquid` |
| **Format code** | ❌ No | `npm run format` |
| **Run tests** | ❌ No | `npm test` |
| **Optimize assets** | ❌ No | `npm run optimize` |
| **Commit to Git** | ❌ No | `git commit` |
| **Push to GitHub** | ❌ No | `git push` |
| **Deploy to staging** | ❌ No | `git push origin main` (GitHub Actions) |
| **Deploy to production** | ❌ No | `git push origin v1.0.0` (GitHub Actions) |
| **Preview in browser** | ✅ **Yes** | `npm run dev` + visit localhost:9000 |
| **Test dynamic content** | ✅ **Yes** | `npm run dev` + Shopify store data |
| **Hot-reload development** | ✅ **Yes** | `npm run dev` |

**Summary:** Most development tasks can be done **without** running the Shopify dev server. The server is only needed for live browser preview with real Shopify store data.

### Issue: "Cannot find module '@shopify/cli'"

```bash
npm install -g @shopify/cli @shopify/theme @shopify/hydrogen
```

### Issue: "Theme deployment failed"

1. Verify `SHOPIFY_THEME_TOKEN` is valid
2. Check theme ID exists: `shopify theme list --store 1commerce.shop`
3. Review workflow logs in GitHub Actions

### Issue: Local development server won't start

```bash
# Clear cache and reinstall
rm -rf node_modules/.cache
npm ci
npm run dev
```

### Issue: Liquid syntax errors

```bash
# Run linter to identify issues
npm run lint:liquid

# Check specific file
shopify theme check sections/header.liquid
```

## 🌿 Advanced Git Workflows

### Using Git Stash

Save work in progress when you need to switch contexts:

```bash
# Save current changes temporarily
git stash push -m "Work in progress on product gallery"

# Switch to another branch to fix a bug
git checkout main
# Make your fix...

# Return and restore your work
git checkout features/product-gallery
git stash pop
```

**Use case:** You're editing `assets/custom-styles.css` but need to urgently fix a production issue.

### Cherry-picking Commits

Apply specific commits from one branch to another:

```bash
# Find the commit you need
git log --oneline features/new-feature

# Apply it to current branch
git cherry-pick a1b2c3d

# Push the change
git push origin main
```

**Use case:** Apply a critical bug fix from a feature branch to production without merging the entire feature.

### Keeping Feature Branches Updated

Use rebase to keep your branch synchronized with develop:

```bash
# Update your feature branch
git checkout features/newsletter-form
git fetch origin
git rebase origin/develop

# Resolve conflicts if any
git add .
git rebase --continue

# Update your PR
git push --force-with-lease origin features/newsletter-form
```

**Use case:** Keep your feature branch current with latest changes from the team.

**For more advanced Git commands and workflows**, see [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md)

---

## 📚 Resources

- [Shopify Theme Development](https://shopify.dev/themes/getting-started)
- [Liquid Template Language](https://shopify.dev/liquid)
- [Shopify CLI Documentation](https://shopify.dev/themes/tools/cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Advanced Git Workflows](./docs/GIT_WORKFLOW.md) - Comprehensive Git command guide

## 📞 Support

For issues or questions:

1. Check the README.md
2. Review GitHub Actions workflow logs
3. Contact PNW Enterprises Development Team

---

**Theme Version:** 1.0.0  
**Last Updated:** January 21, 2026  
**Maintained By:** PNW Enterprises
