# Dev Container Configuration

This directory contains the configuration for GitHub Codespaces and VS Code Dev Containers.

## What's Configured

- **Base Image:** Node.js 18 (Official Microsoft Dev Container)
- **Shopify CLI:** Pre-installed globally
- **VS Code Extensions:**
  - ESLint (code linting)
  - Prettier (code formatting)
  - Shopify Theme Check (Liquid linting)
  - Shopify Liquid (syntax highlighting)
  - GitHub Copilot (AI pair programming)

## Features

- ✅ Automatic dependency installation on container creation
- ✅ Port 9000 forwarding for Shopify dev server
- ✅ Shopify CLI configuration persistence
- ✅ Format on save enabled by default
- ✅ Liquid file type associations

## Usage

### GitHub Codespaces
1. Click "Code" → "Codespaces" → "Create codespace on main"
2. Wait for container to build (~2-3 minutes)
3. Start coding!

### VS Code Dev Containers (Local)
1. Install "Dev Containers" extension in VS Code
2. Open repository in VS Code
3. Click "Reopen in Container" when prompted
4. Wait for container to build

## Customization

To modify the configuration:
1. Edit `devcontainer.json`
2. Rebuild container: Command Palette → "Dev Containers: Rebuild Container"

## Running Locally Without a Server

You can work on the Shopify theme locally **without running the dev server**. This is useful for:
- Editing theme files offline
- Working on documentation
- Running tests and linting
- Making quick changes without Shopify authentication

### What You Can Do Without Server

#### 1. Edit Theme Files Directly
Simply edit any Liquid, CSS, or JavaScript files in your editor:
```bash
# Just open and edit files in VS Code
code assets/custom-styles.css
code sections/header.liquid
code assets/theme.js
```

All changes are saved locally and can be committed to Git.

#### 2. Run Linting & Validation (No Server Needed)
```bash
# Lint Liquid templates
npm run lint:liquid

# Lint all files
npm run lint

# Format code
npm run format
```

#### 3. Run Tests (No Server Needed)
```bash
# Run Jest tests
npm test

# Watch mode for development
npm test -- --watch
```

#### 4. Optimize Assets (No Server Needed)
```bash
# Optimize CSS and JS files
npm run optimize
```

#### 5. View File Structure
Browse and understand the theme structure:
```bash
# View directory structure
tree -L 2

# Search for specific patterns
grep -r "product-card" sections/
```

### When You Need the Dev Server

The Shopify dev server (`npm run dev`) is **only needed** when you want to:
- Preview changes in a live browser connected to your Shopify store
- Test dynamic content (products, cart, checkout)
- Debug Liquid logic with real store data
- See real-time updates as you code

To use the dev server:
```bash
# Requires Shopify authentication
shopify auth login --store 1commercesolutions.shop

# Start dev server on port 9000
npm run dev
```

### Recommended Workflow for Offline Development

1. **Edit files** in VS Code (no server needed)
2. **Lint & format** your changes (no server needed)
3. **Run tests** to validate logic (no server needed)
4. **Commit to Git** (no server needed)
5. **Push to GitHub** - triggers CI/CD deployment
6. **Test on staging** theme automatically deployed by GitHub Actions

This workflow lets you develop entirely offline and use CI/CD to test on real Shopify stores.

### Quick Reference

| Task | Server Needed? | Command |
|------|----------------|---------|
| Edit files | ❌ No | Just open in VS Code |
| Lint code | ❌ No | `npm run lint` |
| Format code | ❌ No | `npm run format` |
| Run tests | ❌ No | `npm test` |
| Commit changes | ❌ No | `git commit -am "..."` |
| Preview in browser | ✅ Yes | `npm run dev` |
| Deploy to staging | ❌ No* | `git push origin main` |
| Deploy to production | ❌ No* | `git tag v1.0.0 && git push origin v1.0.0` |

*Deployments use GitHub Actions, not local server

## Resources

- [Dev Containers Documentation](https://containers.dev/)
- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
- [Shopify Theme Development](https://shopify.dev/themes)
- [Shopify CLI Documentation](https://shopify.dev/themes/tools/cli)
