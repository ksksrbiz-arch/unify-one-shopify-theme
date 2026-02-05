# Copilot Instructions for UnifyOne Shopify Theme

You are an expert Shopify theme developer working on the UnifyOne custom Shopify theme for 1commercesolutions.shop. This is a Liquid-based theme with custom CSS and vanilla JavaScript.

## Project Overview

**Store:** 1commercesolutions.shop  
**Technology Stack:**
- Shopify Liquid templates
- Custom CSS (design system with CSS variables)
- Vanilla JavaScript (no jQuery or frameworks)
- Shopify CLI for development and deployment
- GitHub Actions for CI/CD

## Project Structure

```
/
├── assets/              # CSS, JS, images, fonts
│   ├── custom-styles.css  # Main stylesheet (10KB+)
│   └── theme.js          # Main JavaScript file (8KB+)
├── config/              # Theme settings JSON
├── layout/              # Base HTML structure (theme.liquid)
├── sections/            # Reusable sections with JSON schema
├── snippets/            # Reusable components
├── templates/           # Page templates (product, collection, cart, etc.)
├── locales/             # Translation files
├── scripts/             # Build and optimization scripts
├── docs/                # Documentation
├── .github/workflows/   # CI/CD workflows
└── database/            # Database-related files
```

## Key Commands

### Development
```bash
npm run dev              # Start local development server
npm run watch            # Watch for changes
```

### Linting & Formatting
```bash
npm run lint             # Run all linters
npm run lint:liquid      # Lint Liquid templates only
npm run format           # Format code with Prettier
```

### Building & Deploying
```bash
npm run build            # Build and optimize assets
npm run optimize         # Optimize assets
npm run deploy:staging   # Deploy to staging theme
npm run deploy:production # Deploy to production theme
```

### Testing
```bash
npm test                 # Run Jest tests
```

## Code Style Guidelines

### Liquid Templates
- Use semantic HTML5 elements
- Include proper accessibility attributes (aria-*, role)
- Add JSON schema at the bottom of section files for customization
- Use Shopify's built-in filters and objects
- Reference settings with `{{ settings.setting_name }}`
- Keep templates modular and reusable

### CSS
- **ALWAYS** use existing CSS variables from `:root` in custom-styles.css
- Add new variables to `:root` if needed, following existing naming conventions
- Mobile-first responsive design
- Use semantic class names (BEM methodology preferred)
- Avoid inline styles
- Target performance: < 50KB CSS (< 10KB gzipped)
- Follow WCAG 2.1 AA accessibility standards

### JavaScript
- **Vanilla JavaScript ONLY** - No jQuery, React, or external frameworks
- Functions automatically exposed to window scope
- Use modern ES6+ syntax (const, let, arrow functions)
- Add event listeners responsibly (use delegation when possible)
- Test in browser console during development
- Target performance: < 20KB JS (< 5KB gzipped)

### Code Formatting
- Use Prettier for formatting (`.prettierrc` config)
- Follow ESLint rules (`.eslintrc.json` config)
- 2-space indentation for all files

## Performance Requirements

Every change must maintain or improve these performance targets:
- **Lighthouse Performance Score:** > 85
- **Accessibility Score:** > 90
- **Best Practices Score:** > 85
- **SEO Score:** > 90
- **First Contentful Paint:** < 2 seconds
- **Largest Contentful Paint:** < 2.5 seconds
- **Cumulative Layout Shift:** < 0.1
- **Total Blocking Time:** < 300ms

## Git Workflow

### Branch Strategy
- `main` - Production-ready code. Every push triggers staging deployment + performance checks
- `features/*` - Feature branches. Create PR to main before merging

### Commit Messages
Use conventional commits format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test additions or changes
- `chore:` - Build/tooling changes

### Deployment Process
**Staging (Automatic):**
```bash
git push origin main
# GitHub Actions automatically validates and deploys to staging
```

**Production (Manual):**
```bash
git tag v1.0.X -m "Release version 1.0.X: Description"
git push origin v1.0.X
# GitHub Actions automatically validates and deploys to production
```

## Boundaries - DO NOT MODIFY

**Never change these files unless explicitly required:**
- `.github/workflows/*` - CI/CD workflows (only modify if deployment process changes)
- `package.json` - Dependencies (only modify if adding/updating packages)
- `.gitignore` - Git ignore rules
- `.shopifyignore` - Shopify deployment ignore rules
- `theme.json` - Theme metadata (only modify if theme info changes)
- `.env.example` - Environment variable template

**Never commit:**
- `.env` or `.env.local` files (contains secrets)
- `node_modules/` directory
- Temporary or test files
- Shopify API tokens or keys
- Personal access tokens

**Production Safety:**
- Always test changes in staging before production
- Never commit directly to `main` without testing
- Production deployments require version tags (prevents accidental pushes)
- Never remove or edit unrelated tests

## Shopify Best Practices

### Theme Development
- Use Shopify's built-in objects and filters when available
- Leverage theme settings for customization (avoid hardcoding)
- Optimize images (use Shopify's image filters for responsive images)
- Use lazy loading for images below the fold
- Implement proper meta tags for SEO and social sharing

### API Integration
- Backend API URL: `https://api.1commercesolutions.shop/v1` (production)
- Staging API URL: `https://staging-api.1commercesolutions.shop/v1`
- See `BACKEND_INTEGRATION.md` for endpoint documentation

### Analytics
- Multi-platform tracking: GA4, Facebook, TikTok, Pinterest, Snapchat, Microsoft
- See `ANALYTICS_PIXELS_SETUP.md` for setup details

## Documentation

Before changing code, review these key documents:
- `README.md` - Main project overview and quick start
- `SETUP.md` - Detailed setup and deployment instructions
- `DEPLOYMENT_QUICK_REF.md` - Quick deployment reference
- `CSS_INTEGRATION_GUIDE.md` - CSS integration guidelines
- `BACKEND_INTEGRATION.md` - Backend API documentation
- `UPTIME_MONITORING.md` - Production monitoring and incidents
- `docs/GIT_WORKFLOW.md` - Advanced Git workflows

## Testing Requirements

- **Always lint before pushing:** `npm run lint`
- **Test locally:** `npm run dev` and verify in browser
- **Run existing tests:** `npm test`
- **Check accessibility:** Test keyboard navigation and screen reader compatibility
- **Verify mobile responsive:** Test on different screen sizes
- **Performance check:** Verify Lighthouse scores meet targets

## Security Checklist

- [ ] No sensitive data in code or comments
- [ ] Secrets stored in GitHub Secrets, not code
- [ ] API tokens have minimum required scopes
- [ ] Validate user inputs
- [ ] Use Shopify's built-in security features
- [ ] Follow Content Security Policy (CSP) guidelines

## Common Tasks

### Adding a New Section
1. Create file: `sections/my-section.liquid`
2. Add HTML + Liquid code
3. Add JSON schema at bottom for theme customization
4. Include in template: `{% section 'my-section' %}`
5. Test locally, then push to trigger staging deployment

### Updating Styles
1. Edit: `assets/custom-styles.css`
2. Use existing CSS variables for consistency
3. Add new variables to `:root` if needed
4. Test locally: `npm run dev`
5. Push to deploy

### Modifying JavaScript
1. Edit: `assets/theme.js`
2. Use vanilla JavaScript only
3. Test in browser console
4. Push to deploy

### Adding Theme Settings
1. Edit: `config/settings_schema.json`
2. Add new settings groups/fields
3. These appear in Shopify Admin → Theme Settings
4. Reference in Liquid: `{{ settings.setting_name }}`

## Debugging

### Common Issues
- **Liquid syntax errors:** Run `npm run lint:liquid` locally
- **Deployment failures:** Check GitHub Actions logs
- **Performance issues:** Review Lighthouse report in PR comments
- **Authentication errors:** Verify GitHub Secrets are correctly set

### Local Validation
```bash
npm run lint           # Lint all files
npm run format         # Auto-format code
npm run dev            # Test locally at http://localhost:9000
```

## AI Assistant Guidelines

When assisting with this codebase:
1. **Always** check existing code patterns before suggesting changes
2. **Prefer** using existing CSS variables and JavaScript functions
3. **Maintain** the vanilla JavaScript approach (no external libraries)
4. **Follow** Shopify Liquid best practices
5. **Test** suggestions against performance budgets
6. **Document** any complex logic or workarounds
7. **Keep** changes minimal and focused
8. **Validate** accessibility and mobile responsiveness
9. **Review** related documentation before making changes
10. **Ensure** all tests pass before considering work complete

## Questions or Issues?

- **Technical Issues:** Dev Team Slack
- **Shopify Questions:** Shopify Support (1commercesolutions.shop admin)
- **Production Issues:** On-call engineer (escalate in Slack #critical)
- **CI/CD Questions:** DevOps team

## Additional Resources

- Shopify Theme Dev: https://shopify.dev/themes
- Liquid Language: https://shopify.dev/liquid
- Shopify CLI: https://shopify.dev/themes/tools/cli
- GitHub Actions: https://github.com/features/actions
- Lighthouse CI: https://github.com/treosh/lighthouse-ci-action
