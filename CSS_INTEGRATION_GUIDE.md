# CSS Integration Guide for Shopify GitHub Connector

**Last Updated:** January 25, 2026  
**Theme Version:** 1.0.0  
**Shopify Store:** 1commerce.shop

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [CSS File Types & Scoping](#css-file-types--scoping)
3. [GitHub Integration Setup](#github-integration-setup)
4. [CSS Rendering & Debugging](#css-rendering--debugging)
5. [Testing Workflow](#testing-workflow)
6. [Liquid Variable Integration](#liquid-variable-integration)
7. [Responsive Breakpoints](#responsive-breakpoints)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This guide explains how to integrate CSS files with Shopify using the GitHub connector. The UnifyOne theme uses a combination of global and section-specific CSS to optimize performance and maintainability.

### File Sync Process

```
Local Development → Git Commit → GitHub Repository → Shopify GitHub Integration → Theme Files
```

**Key Points:**
- CSS files in `assets/` folder sync automatically via GitHub integration
- Changes are reflected in the theme after successful sync
- Test changes in a duplicate/staging theme before production
- CSS is cached by Shopify's CDN (use versioning for cache busting)

---

## CSS File Types & Scoping

### Global CSS (custom-styles.css)

**Purpose:** Site-wide styles, design system variables, base styles  
**Location:** `assets/custom-styles.css`  
**Loading:** Added to `layout/theme.liquid` head section  
**Scope:** Applies globally across all pages

```liquid
<!-- In layout/theme.liquid -->
{{ 'custom-styles.css' | asset_url | stylesheet_tag }}
```

**Contains:**
- CSS Variables (design system)
- Reset & base styles
- Typography system
- Reusable components (buttons, forms, cards)
- Utility classes
- Responsive grid system

**When to use:**
- Styles needed across multiple pages/sections
- Design system tokens and variables
- Base HTML element styles
- Reusable component classes

### Section-Specific CSS

**Purpose:** Styles scoped to individual sections  
**Location:** `assets/section-{name}.css`  
**Loading:** Added to specific section files  
**Scope:** Limited to that section via data attributes

**Examples:**
- `assets/section-header.css` - Header section only
- `assets/section-footer.css` - Footer section only
- `assets/section-hero.css` - Hero section only

```liquid
<!-- In sections/header.liquid -->
{{ 'section-header.css' | asset_url | stylesheet_tag }}

<header class="site-header" data-section-type="header">
  <!-- Section content -->
</header>
```

**CSS Scoping Pattern:**
```css
/* ✅ CORRECT - Scoped to section */
[data-section-type="header"] .header__logo {
  /* styles */
}

/* ❌ INCORRECT - Global scope, affects all .header__logo */
.header__logo {
  /* styles */
}
```

**When to use:**
- Styles specific to one section
- Complex section layouts
- Section-specific interactions
- Reduces CSS bloat on pages not using the section

### Inline Section Styles

**Purpose:** Small, dynamic styles generated from section settings  
**Location:** Directly in section `.liquid` files  
**Loading:** Via `<style>` tags in section schema  
**Scope:** Limited to that section instance

```liquid
{% comment %}
  Example in sections/hero.liquid
{% endcomment %}

{% style %}
  #shopify-section-{{ section.id }} {
    background-color: {{ section.settings.bg_color }};
    padding-top: {{ section.settings.padding_top }}px;
  }
{% endstyle %}
```

**When to use:**
- Dynamic styles based on section settings (colors, spacing)
- Styles that change per section instance
- Small amount of CSS (< 20 lines)

---

## GitHub Integration Setup

### Prerequisites

1. **GitHub Repository:** Connected to Shopify store
2. **Shopify CLI:** Installed locally for development
3. **Theme Access Scope:** Set in Shopify app configuration

### Step 1: Connect GitHub to Shopify

#### Via Shopify Admin:

1. Go to **Shopify Admin → Online Store → Themes**
2. Click **Add theme → Connect from GitHub**
3. Authorize GitHub access
4. Select repository: `ksksrbiz-arch/unify-one-shopify-theme`
5. Choose branch (e.g., `main` for production, `develop` for staging)

#### Via Shopify CLI:

```bash
# Already configured in this repository
# See .github/workflows/deploy-staging.yml
shopify theme push --store 1commerce.shop
```

### Step 2: Verify File Paths

CSS files must be in the `assets/` directory to be recognized by Shopify:

```
✅ CORRECT:
assets/custom-styles.css
assets/section-header.css
assets/section-footer.css

❌ INCORRECT:
css/styles.css
styles/custom.css
assets/css/styles.css (subdirectories not supported)
```

### Step 3: Reference CSS in Liquid

**Global CSS (theme.liquid):**
```liquid
{{ 'custom-styles.css' | asset_url | stylesheet_tag }}
```

**Section CSS (section files):**
```liquid
{{ 'section-header.css' | asset_url | stylesheet_tag }}
```

**With cache busting:**
```liquid
{{ 'custom-styles.css' | asset_url | stylesheet_tag: preload: true }}
```

### Step 4: Update .shopifyignore

Ensure `.shopifyignore` excludes non-theme files:

```
# Already configured in .shopifyignore
node_modules/
.github/
*.md
package*.json
```

---

## CSS Rendering & Debugging

### How CSS is Loaded

1. **Browser Request** → Shopify Theme
2. **Liquid Processes** → Generates HTML with asset URLs
3. **CDN Serves CSS** → From `https://cdn.shopify.com/.../assets/custom-styles.css`
4. **Browser Renders** → Applies styles

### Debugging CSS Issues

#### Issue: CSS Not Applying

**Check 1: File Path**
```liquid
<!-- Verify in browser DevTools → Network tab -->
{{ 'custom-styles.css' | asset_url | stylesheet_tag }}

<!-- Should generate: -->
<link href="https://cdn.shopify.com/.../assets/custom-styles.css" rel="stylesheet">
```

**Check 2: CSS Specificity**
```css
/* Section-scoped styles need higher specificity */
[data-section-type="header"] .nav-link { } /* ✅ Works */
.nav-link { } /* ❌ May be overridden */
```

**Check 3: Liquid Syntax Errors**
```liquid
<!-- ❌ INCORRECT - Syntax error -->
{{ 'custom-styles.css' | asset_url | stylesheet_tag }

<!-- ✅ CORRECT - Closing braces -->
{{ 'custom-styles.css' | asset_url | stylesheet_tag }}
```

#### Issue: Changes Not Reflecting

**Solution 1: Clear Shopify CDN Cache**
```liquid
<!-- Add version parameter -->
{{ 'custom-styles.css' | asset_url | append: '?v=' | append: 'now' | stylesheet_tag }}

<!-- Or use theme version -->
{{ 'custom-styles.css' | asset_url | append: '?v=1.0.0' | stylesheet_tag }}
```

**Solution 2: Hard Refresh Browser**
- **Chrome/Edge:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- **Firefox:** Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- **Safari:** Cmd+Option+R

**Solution 3: Check GitHub Sync Status**
```bash
# Via Shopify CLI
shopify theme list

# Verify last updated timestamp
```

#### Issue: Global vs Section Conflict

**Problem:** Section styles being overridden by global styles

**Solution:** Use data attributes for section scoping
```css
/* Global CSS - Lower specificity */
.button { 
  background: blue; 
}

/* Section CSS - Higher specificity wins */
[data-section-type="header"] .button {
  background: green; /* ✅ This applies */
}
```

### Browser DevTools Inspection

**Step 1:** Right-click element → Inspect  
**Step 2:** Check "Styles" panel for:
- Which CSS file is applying
- Order of CSS rules
- Overridden styles (crossed out)

**Step 3:** Check "Computed" tab for:
- Final applied values
- Source of each property

---

## Testing Workflow

### Duplicate Theme Strategy

**Why:** Test CSS changes without affecting live store

#### Create Duplicate Theme:

**Via Shopify Admin:**
1. Go to **Online Store → Themes**
2. Find your live theme
3. Click **Actions → Duplicate**
4. Name it: "Testing - [Feature Name]"

**Via Shopify CLI:**
```bash
# List themes
shopify theme list --store 1commerce.shop

# Push to specific theme
shopify theme push --theme-id 987654321 --store 1commerce.shop
```

#### CI/CD Workflow (Already Configured):

```
1. Create feature branch: git checkout -b features/css-improvements
2. Make CSS changes locally
3. Test with: npm run dev
4. Commit & push to GitHub
5. Automated workflow deploys to STAGING theme
6. Review & test on staging URL
7. Merge to main → Deploys to PRODUCTION
```

**Staging Theme URL:**
```
https://1commerce.shop/?preview_theme_id=987654321
```

### Testing Checklist

Before deploying CSS changes to production:

- [ ] **Desktop Testing**
  - [ ] Chrome (latest)
  - [ ] Safari (latest)
  - [ ] Firefox (latest)
  - [ ] Edge (latest)

- [ ] **Mobile Testing**
  - [ ] iOS Safari
  - [ ] Android Chrome
  - [ ] Responsive design mode

- [ ] **Breakpoint Testing**
  - [ ] 1920px (Large desktop)
  - [ ] 1440px (Standard desktop)
  - [ ] 1024px (Tablet landscape)
  - [ ] 768px (Tablet portrait)
  - [ ] 480px (Mobile landscape)
  - [ ] 375px (Mobile portrait)

- [ ] **Accessibility**
  - [ ] Contrast ratios (WCAG AA)
  - [ ] Keyboard navigation
  - [ ] Screen reader compatibility

- [ ] **Performance**
  - [ ] CSS file size < 50KB (compressed)
  - [ ] No render-blocking CSS
  - [ ] Critical CSS inline (optional)

### Automated Testing (GitHub Actions)

```yaml
# Already configured in .github/workflows/deploy-staging.yml

- name: Lint Liquid templates
  run: npx shopify theme check --fail-level info

- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://1commerce.shop/?preview_theme_id=${{ secrets.SHOPIFY_STAGING_THEME_ID }}
```

---

## Liquid Variable Integration

### CSS Variables from Theme Settings

**Step 1: Define in settings_schema.json**
```json
{
  "name": "Colors",
  "settings": [
    {
      "type": "color",
      "id": "color_primary",
      "label": "Primary color",
      "default": "#007bff"
    }
  ]
}
```

**Step 2: Output in CSS**
```liquid
{% style %}
  :root {
    --primary-color: {{ settings.color_primary }};
  }
{% endstyle %}
```

**Step 3: Use in CSS Files**
```css
.button {
  background-color: var(--primary-color);
}
```

### Section Settings in CSS

**Section Schema:**
```liquid
{% schema %}
{
  "name": "Header",
  "settings": [
    {
      "type": "checkbox",
      "id": "sticky_header",
      "label": "Sticky header",
      "default": true
    }
  ]
}
{% endschema %}
```

**Apply in Section HTML:**
```liquid
<header 
  data-section-type="header" 
  data-sticky="{{ section.settings.sticky_header }}">
  <!-- Content -->
</header>
```

**CSS Responds to Setting:**
```css
[data-section-type="header"][data-sticky="true"] {
  position: sticky;
  top: 0;
}

[data-section-type="header"][data-sticky="false"] {
  position: relative;
}
```

### Avoiding Liquid Conflicts

**❌ INCORRECT - Liquid in CSS file:**
```css
/* This won't work in .css files */
.header {
  color: {{ settings.text_color }};
}
```

**✅ CORRECT - Use CSS variables:**
```liquid
<!-- In theme.liquid -->
{% style %}
  :root {
    --text-color: {{ settings.text_color }};
  }
{% endstyle %}
```

```css
/* In custom-styles.css */
.header {
  color: var(--text-color);
}
```

---

## Responsive Breakpoints

### Shopify Standard Breakpoints

```css
/* Desktop First Approach */

/* Large Desktop: 1440px+ (default) */
.container {
  max-width: 1200px;
}

/* Standard Desktop: 1024px - 1439px */
@media screen and (max-width: 1439px) {
  .container {
    max-width: 960px;
  }
}

/* Tablet: 768px - 1023px */
@media screen and (max-width: 1023px) {
  .container {
    max-width: 720px;
  }
}

/* Mobile: 480px - 767px */
@media screen and (max-width: 767px) {
  .container {
    max-width: 100%;
    padding: 0 var(--space-md);
  }
}

/* Small Mobile: < 480px */
@media screen and (max-width: 479px) {
  .container {
    padding: 0 var(--space-sm);
  }
}
```

### Mobile First Approach (Alternative)

```css
/* Mobile: Default (320px+) */
.grid {
  grid-template-columns: 1fr;
}

/* Tablet: 768px+ */
@media screen and (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 1024px+ */
@media screen and (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Testing Responsive Breakpoints

**Browser DevTools:**
1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select device or set custom dimensions
4. Test at each breakpoint

**Common Test Devices:**
- iPhone SE: 375 x 667
- iPhone 12 Pro: 390 x 844
- iPad: 768 x 1024
- iPad Pro: 1024 x 1366
- Desktop: 1920 x 1080

---

## Best Practices

### 1. CSS Organization

```css
/* Use clear section comments */
/* ============================================
   SECTION NAME
   ============================================ */

/* Group related styles */
.component { }
.component__element { }
.component__element--modifier { }
```

### 2. CSS Naming (BEM Convention)

```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier */
.card--featured { }
.card--large { }
```

### 3. CSS Variables

```css
/* Define in :root */
:root {
  --color-primary: #007bff;
  --spacing-unit: 1rem;
}

/* Use throughout CSS */
.button {
  background: var(--color-primary);
  padding: var(--spacing-unit);
}
```

### 4. Performance Optimization

**Minimize CSS file size:**
```bash
# Use CSS minification in production
npx cssnano custom-styles.css custom-styles.min.css
```

**Reduce specificity:**
```css
/* ❌ Too specific */
body div.container ul.list li.item a.link { }

/* ✅ Better */
.nav-link { }
```

**Avoid @import:**
```css
/* ❌ Blocks rendering */
@import url('other-styles.css');

/* ✅ Use Liquid instead */
{{ 'other-styles.css' | asset_url | stylesheet_tag }}
```

### 5. Accessibility

```css
/* Focus visible states */
:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

/* Sufficient color contrast */
.button {
  /* Ensure 4.5:1 contrast ratio */
  background: #007bff;
  color: #ffffff;
}
```

### 6. Version Control

**Commit messages:**
```bash
git commit -m "feat(css): add responsive grid system"
git commit -m "fix(css): correct button hover state"
git commit -m "style(css): improve header spacing"
```

**Track CSS changes:**
```bash
# View CSS changes before commit
git diff assets/custom-styles.css

# Review CSS history
git log --follow assets/custom-styles.css
```

---

## Troubleshooting

### CSS Not Syncing from GitHub

**Check 1: GitHub Integration Status**
1. Shopify Admin → Online Store → Themes
2. Check theme source shows "GitHub"
3. Verify last sync timestamp

**Check 2: File in assets/ folder**
```bash
# Verify file location
ls -la assets/*.css

# Should show:
# assets/custom-styles.css
# assets/section-header.css
# assets/section-footer.css
```

**Check 3: Not in .shopifyignore**
```bash
# Ensure CSS files aren't ignored
grep -r "\.css" .shopifyignore

# If found, remove the line
```

**Check 4: Valid File Names**
```
✅ VALID:
custom-styles.css
section-header.css
product-card.css

❌ INVALID:
custom styles.css (space)
section-header.CSS (must be lowercase)
styles/custom.css (subdirectory)
```

### CSS Not Loading on Page

**Check 1: Asset Tag Syntax**
```liquid
<!-- Correct -->
{{ 'custom-styles.css' | asset_url | stylesheet_tag }}

<!-- Incorrect (won't work) -->
<link href="custom-styles.css">
<link href="/assets/custom-styles.css">
```

**Check 2: Section Included in Template**
```liquid
<!-- In template -->
{% section 'header' %}

<!-- Verify section file exists -->
sections/header.liquid
```

**Check 3: Network Tab**
1. Open DevTools → Network
2. Reload page
3. Filter by "CSS"
4. Check for 404 errors or failed loads

### Liquid Syntax Errors

**Common mistakes:**
```liquid
<!-- ❌ Missing closing braces -->
{{ 'custom-styles.css' | asset_url | stylesheet_tag }

<!-- ❌ Wrong filter name -->
{{ 'custom-styles.css' | asset | stylesheet_tag }}

<!-- ✅ Correct -->
{{ 'custom-styles.css' | asset_url | stylesheet_tag }}
```

**Validation:**
```bash
# Run Shopify theme check
npm run lint:liquid

# Check specific file
shopify theme check sections/header.liquid
```

### CSS Conflicts

**Issue:** Global CSS overriding section CSS

**Solution:** Increase specificity with data attributes
```css
/* Global (low specificity) */
.button { background: blue; }

/* Section (high specificity) */
[data-section-type="header"] .button { 
  background: green; /* Wins */
}
```

**Issue:** Multiple sections with same classes

**Solution:** Use section-specific prefixes
```css
/* Header section */
[data-section-type="header"] .header__button { }

/* Footer section */
[data-section-type="footer"] .footer__button { }
```

### Performance Issues

**Issue:** Large CSS file slowing page load

**Solutions:**
1. Split into section-specific files
2. Remove unused styles
3. Minify CSS in production
4. Use critical CSS inline

**Check file size:**
```bash
ls -lh assets/*.css

# Target: < 50KB per file (uncompressed)
```

**Analyze CSS coverage:**
1. DevTools → Coverage tab
2. Reload page
3. Check unused CSS percentage
4. Remove unused styles

---

## Additional Resources

### Shopify Documentation

- [Theme Development](https://shopify.dev/themes)
- [Liquid Reference](https://shopify.dev/api/liquid)
- [Asset Filters](https://shopify.dev/api/liquid/filters/url-filters#asset_url)
- [Theme Check](https://shopify.dev/themes/tools/theme-check)

### Tools

- [Shopify CLI](https://shopify.dev/themes/tools/cli)
- [Theme Kit](https://shopify.dev/themes/tools/theme-kit) (legacy)
- [Liquid VS Code Extension](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode)

### Repository Files

- `README.md` - Project overview
- `SETUP.md` - Development setup
- `DEPLOYMENT_CHEATSHEET.md` - Quick deploy reference
- `.github/workflows/` - CI/CD automation

---

## Support

**Issues or Questions:**
1. Check this guide first
2. Review [SETUP.md](./SETUP.md)
3. Check GitHub Actions logs
4. Contact development team

**Repository:** [github.com/ksksrbiz-arch/unify-one-shopify-theme](https://github.com/ksksrbiz-arch/unify-one-shopify-theme)

---

**Document Version:** 1.0.0  
**Last Updated:** January 25, 2026  
**Maintained By:** PNW Enterprises
