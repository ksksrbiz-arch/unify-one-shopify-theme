# CSS Integration Testing Guide

This document provides quick testing steps to verify CSS integration via Shopify GitHub connector.

## Quick Test Checklist

### 1. Verify Files Sync from GitHub

**After pushing CSS changes to GitHub:**

```bash
# Check GitHub Actions workflow status
gh workflow list
gh run list --workflow=deploy-staging.yml

# View latest workflow run
gh run view
```

**In Shopify Admin:**
1. Go to **Online Store → Themes**
2. Check that theme shows "Connected from GitHub"
3. Note the last sync timestamp
4. Click **Actions → Preview** to test staging theme

### 2. Verify CSS Files Load

**Using Browser DevTools:**

1. Open staging theme preview
2. Press F12 to open DevTools
3. Go to **Network** tab
4. Refresh page
5. Filter by "CSS"
6. Verify these files load successfully:
   - `custom-styles.css` (global styles)
   - `section-header.css` (header section)
   - `section-footer.css` (footer section)

**Expected URLs:**
```
https://cdn.shopify.com/s/files/1/[store-id]/files/custom-styles.css
https://cdn.shopify.com/s/files/1/[store-id]/files/section-header.css
https://cdn.shopify.com/s/files/1/[store-id]/files/section-footer.css
```

### 3. Test CSS Scoping

**Global CSS Test:**
1. Open any page
2. Inspect a button element
3. Verify global button styles from `custom-styles.css` apply
4. Check Computed styles show CSS variables (e.g., `var(--primary-color)`)

**Section-Specific CSS Test:**
1. Inspect header navigation link
2. Verify styles come from `section-header.css`
3. Check selector uses `[data-section-type="header"]`
4. Confirm these styles DON'T apply to footer

**Testing Steps:**
```javascript
// In browser console:
// Check header section
document.querySelector('[data-section-type="header"]')

// Check footer section  
document.querySelector('[data-section-type="footer"]')

// Verify scoped CSS applies correctly
getComputedStyle(document.querySelector('[data-section-type="header"] .nav-link'))
```

### 4. Test Responsive Breakpoints

**Desktop (1440px):**
- Navigation should be horizontal
- All elements visible
- Maximum container width: 1200px

**Tablet (768px):**
- Navigation might stack or show menu toggle
- Container adapts to viewport
- Touch-friendly spacing

**Mobile (375px):**
- Mobile menu toggle visible
- Single column layout
- Optimized font sizes

**Testing:**
1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Test at each breakpoint
4. Verify no horizontal scroll

### 5. Test Liquid Variable Integration

**Via Theme Customizer:**
1. Go to **Online Store → Themes → Customize**
2. Open **Theme settings → Colors**
3. Change primary color
4. Verify change reflects immediately
5. Check that CSS variables update

**Via Code:**
```liquid
<!-- In theme.liquid, verify this pattern: -->
{% style %}
  :root {
    --primary-color: {{ settings.color_primary }};
  }
{% endstyle %}
```

### 6. Performance Check

**Lighthouse Test:**
```bash
# Run from command line
npx lighthouse https://1commerce.shop/?preview_theme_id=STAGING_ID \
  --only-categories=performance \
  --view

# Or check GitHub Actions Lighthouse CI report
```

**Manual Check:**
1. Open DevTools → Performance
2. Reload page
3. Check CSS loading time
4. Verify no render-blocking CSS
5. Total CSS size should be < 25KB (compressed)

### 7. Cache Busting Test

**Problem:** CSS changes not reflecting after GitHub sync

**Solution:**
```liquid
<!-- Add version parameter in theme.liquid -->
{{ 'custom-styles.css' | asset_url | append: '?v=' | append: 'now' | stylesheet_tag }}
```

**Test:**
1. Make CSS change
2. Push to GitHub
3. Wait for sync
4. Hard refresh browser (Ctrl+Shift+R)
5. Verify CSS change appears

### 8. Cross-Browser Testing

Test in these browsers:
- [ ] Chrome (latest)
- [ ] Safari (latest)  
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Android Chrome

**Quick test:**
```bash
# Use BrowserStack or similar service
# Or test locally on available devices
```

### 9. Accessibility Check

**Color Contrast:**
```javascript
// Check contrast ratio in DevTools
// Or use online tool: https://webaim.org/resources/contrastchecker/
```

**Focus States:**
1. Tab through navigation
2. Verify visible focus indicators
3. Test with keyboard only (no mouse)

**Screen Reader:**
1. Enable screen reader (VoiceOver on Mac, NVDA on Windows)
2. Navigate site
3. Verify semantic HTML and ARIA labels

## Common Issues & Solutions

### Issue: CSS not loading

**Check 1:** Verify file in `assets/` folder
```bash
ls -la assets/*.css
```

**Check 2:** Check Liquid syntax
```liquid
<!-- Correct -->
{{ 'custom-styles.css' | asset_url | stylesheet_tag }}

<!-- Incorrect -->
<link href="custom-styles.css">
```

**Check 3:** Clear browser cache
- Chrome: Ctrl+Shift+Delete
- Or use Incognito mode

### Issue: Section styles not applying

**Check 1:** Verify data attribute
```html
<header data-section-type="header">
```

**Check 2:** Check CSS selector specificity
```css
/* Higher specificity wins */
[data-section-type="header"] .nav-link { }
```

**Check 3:** Ensure section CSS is loaded
```liquid
{{ 'section-header.css' | asset_url | stylesheet_tag }}
```

### Issue: Styles conflicting

**Solution:** Use section-specific prefixes
```css
/* Header */
[data-section-type="header"] .header__nav { }

/* Footer */
[data-section-type="footer"] .footer__nav { }
```

## Automated Testing Commands

```bash
# Run all validations
npm run lint

# Lint Liquid files
npm run lint:liquid

# Test locally
npm run dev

# Deploy to staging
npm run deploy:staging
```

## Monitoring in Production

**Set up alerts for:**
1. CSS file size increase > 50KB
2. Failed GitHub sync
3. Lighthouse performance score < 90
4. 404 errors on CSS files

**GitHub Actions monitors:**
- CSS validation on every push
- Lighthouse CI on staging deployment
- Theme check for Liquid errors

## Quick Debug Commands

```bash
# Check CSS file paths
find assets -name "*.css"

# View CSS file sizes
ls -lh assets/*.css

# Search for Liquid in CSS
grep -r "{{" assets/*.css

# Verify .shopifyignore
cat .shopifyignore | grep -v "^#"

# Check git tracking
git ls-files assets/

# View last commit
git log -1 --stat
```

## Documentation References

- [CSS_INTEGRATION_GUIDE.md](./CSS_INTEGRATION_GUIDE.md) - Complete CSS integration guide
- [SETUP.md](./SETUP.md) - Development setup
- [README.md](./README.md) - Project overview
- [.github/workflows/deploy-staging.yml](./.github/workflows/deploy-staging.yml) - CI/CD pipeline

## Support

If tests fail:
1. Check this guide
2. Review CSS_INTEGRATION_GUIDE.md
3. Check GitHub Actions logs
4. Verify Shopify Admin sync status

---

**Last Updated:** January 25, 2026  
**Version:** 1.0.0
