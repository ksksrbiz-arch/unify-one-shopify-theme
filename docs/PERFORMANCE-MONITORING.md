# Lighthouse CI Performance Monitoring Guide

**Last Updated:** January 21, 2026  
**Theme:** UnifyOne Shopify Theme  
**Store:** 1commerce.shop

---

## Overview

Lighthouse CI automatically tracks your Shopify theme's performance metrics on every deployment to staging. This ensures performance regressions are caught early before production releases.

### What Gets Measured

- **Performance** (85/100 threshold)
  - First Contentful Paint (FCP): < 2.0s
  - Largest Contentful Paint (LCP): < 2.5s
  - Cumulative Layout Shift (CLS): < 0.1
  - Total Blocking Time (TBT): < 300ms
  - Speed Index: < 3.0s

- **Accessibility** (90/100 threshold)
  - Color contrast ratios
  - Keyboard navigation
  - ARIA labels and roles
  - Form accessibility

- **Best Practices** (85/100 threshold)
  - Browser compatibility
  - Security headers
  - Image optimization
  - Deprecated API usage

- **SEO** (90/100 threshold)
  - Meta tags
  - Structured data
  - Mobile-friendly
  - Links crawlability

---

## How It Works

### Automatic Trigger

```mermaid
git push origin develop
    ↓
GitHub Actions (deploy-staging.yml)
    ↓
1. Deploy theme to staging
    ↓
2. Run Lighthouse CI (3 audit runs)
    ↓
3. Compare against budget thresholds
    ↓
4. Upload reports to temporary public storage
    ↓
5. Post results (warning/error)
```

### Audit Process

Each Lighthouse CI run:
1. **Audits 3 times** (averaging for consistency)
2. **Uses desktop profile** (simulating realistic conditions)
3. **Throttles network** (40ms RTT, 10Mbps throughput)
4. **Checks critical pages** (home, products, collections)
5. **Generates detailed report** with breakdowns

---

## Configuration Files

### `.github/workflows/deploy-staging.yml`

**Triggers on:** `git push origin develop`

```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://1commerce.shop/?preview_theme_id=${{ secrets.SHOPIFY_STAGING_THEME_ID }}
    uploadArtifacts: true
    temporaryPublicStorage: true
```

**Key settings:**
- `uploadArtifacts: true` - Saves Lighthouse reports
- `temporaryPublicStorage: true` - Makes reports publicly viewable
- `?preview_theme_id=` - Tests staging theme without publishing

### `lighthouserc.json`

**Performance budgets and assertions:**

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "throttling": {
          "rttMs": 40,
          "throughputKbps": 10240
        }
      }
    },
    "assert": {
      "categories:performance": ["error", {"minScore": 0.85}],
      "categories:accessibility": ["error", {"minScore": 0.90}],
      "categories:best-practices": ["error", {"minScore": 0.85}],
      "categories:seo": ["error", {"minScore": 0.90}],
      "first-contentful-paint": ["warn", {"maxNumericValue": 2000}],
      "largest-contentful-paint": ["warn", {"maxNumericValue": 2500}],
      "cumulative-layout-shift": ["warn", {"maxNumericValue": 0.1}],
      "total-blocking-time": ["warn", {"maxNumericValue": 300}]
    }
  }
}
```

---

## Viewing Performance Reports

### In GitHub Actions

1. **Go to:** Repository → Actions → Latest run
2. **Look for:** "Run Lighthouse CI" step
3. **Expand the step** to see audit summary
4. **View artifacts** for detailed JSON reports

### Public Reports

After deployment:

```bash
Lighthouse reports uploaded:
https://lhci.example.com/viewer

These are temporary (7 days)
Manual access via GitHub Actions logs
```

### Local Testing

```bash
# Install Lighthouse CLI
npm install -g @lhci/cli@latest

# Run locally against staging theme
lhci collect --config=lighthouserc.json --url="https://1commerce.shop/?preview_theme_id=STAGING_THEME_ID"

# View results
lhci view
```

---

## Interpreting Results

### Performance Score Breakdown

| Score | Status | Action |
|-------|--------|--------|
| 90-100 | ✅ Excellent | Keep it up |
| 75-89 | ⚠️ Warning | Review metrics |
| 50-74 | 🔴 Poor | Investigate |
| < 50 | 🚨 Critical | Block deployment |

### Core Web Vitals

**First Contentful Paint (FCP)**
- ✅ Good: < 1.8s
- ⚠️ Needs improvement: 1.8s - 3.0s
- 🔴 Poor: > 3.0s

**Largest Contentful Paint (LCP)**
- ✅ Good: < 2.5s
- ⚠️ Needs improvement: 2.5s - 4.0s
- 🔴 Poor: > 4.0s

**Cumulative Layout Shift (CLS)**
- ✅ Good: < 0.1
- ⚠️ Needs improvement: 0.1 - 0.25
- 🔴 Poor: > 0.25

---

## Common Performance Issues & Solutions

### Issue: High Largest Contentful Paint (LCP)

**Causes:**
- Large hero images not optimized
- Render-blocking CSS/JS
- Slow server response time

**Solutions:**
```css
/* Optimize hero images */
img {
  content-visibility: auto;
  fetch-priority: high; /* For LCP candidates */
}

/* Defer non-critical CSS */
<link rel="preload" as="style" href="theme.css">
<link rel="stylesheet" href="theme.css" media="print" onload="this.media='all'">
```

### Issue: High Cumulative Layout Shift (CLS)

**Causes:**
- Missing image dimensions
- Late-loaded content
- Dynamically injected ads

**Solutions:**
```html
<!-- Always specify dimensions -->
<img src="image.jpg" width="800" height="600" alt="Description">

<!-- OR use aspect-ratio CSS -->
<style>
img {
  aspect-ratio: 16 / 9;
}
</style>
```

### Issue: Low Accessibility Score

**Causes:**
- Missing alt text
- Low color contrast
- Non-interactive elements styled as buttons

**Solutions:**
```html
<!-- Always include alt text -->
<img src="image.jpg" alt="Product name showing key features">

<!-- Use semantic HTML -->
<button class="btn">Add to Cart</button>

<!-- Ensure contrast: 4.5:1 for normal text -->
<p style="color: #626c7c; background: #fcfcf9;">Valid contrast</p>
```

---

## Adjusting Performance Thresholds

### When to Lower Thresholds

**Scenario:** Your theme uses heavy 3D product viewer  
**Action:** Lower performance threshold temporarily

```json
{
  "categories:performance": ["warn", {"minScore": 0.75}]
}
```

### When to Raise Thresholds

**Scenario:** You've optimized and want higher standards  
**Action:** Increase threshold

```json
{
  "categories:performance": ["error", {"minScore": 0.90}]
}
```

---

## CI/CD Integration

### Deployment Blocking

**Current:** Lighthouse failures are `warn` (non-blocking)

To make them blocking:

```yaml
# In deploy-staging.yml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  continue-on-error: false  # ← Block on failure
```

### Production Safety

**Recommendation:** Keep Lighthouse warnings as non-blocking on staging, but require manual approval before production deploy.

```yaml
# In deploy-production.yml (create if needed)
- name: Require QA Sign-Off
  run: |
    echo "⚠️  Manual approval required for production"
    echo "Check: Staging Lighthouse reports"
    echo "If performance is acceptable, proceed with tag"
```

---

## GitHub Secrets Required

Ensure these are configured (Settings → Secrets → Actions):

| Secret | Purpose | Example |
|--------|---------|----------|
| `SHOPIFY_THEME_TOKEN` | Deploy to staging theme | `shptka_xxxxx...` |
| `SHOPIFY_STAGING_THEME_ID` | Staging theme ID | `987654321` |

---

## Best Practices

### ✅ DO

- **Test real product pages** - Use actual products for accurate metrics
- **Run multiple audits** - 3 runs average out network variance
- **Review reports regularly** - Set a cadence (weekly, per release)
- **Fix warnings early** - Don't wait until they become errors
- **Document trade-offs** - If lowering threshold, explain why
- **Monitor trends** - Track performance over time

### ❌ DON'T

- **Ignore performance warnings** - Small regressions compound
- **Lower thresholds without investigation** - Find root cause first
- **Deploy without checking reports** - Review before production
- **Test only homepage** - Check product, collection, cart pages
- **Skip accessibility** - A11y is non-negotiable

---

## Performance Optimization Roadmap

### Phase 1: Foundation (Immediate)
- [ ] Image optimization (WebP, lazy loading)
- [ ] CSS critical path optimization
- [ ] Defer non-essential JavaScript
- [ ] Enable GZIP compression

### Phase 2: Enhancement (This Month)
- [ ] Implement Service Worker (offline support)
- [ ] Add resource hints (prefetch, preconnect)
- [ ] Optimize font loading (system fonts + 1-2 custom)
- [ ] Implement skeleton loaders

### Phase 3: Advanced (Next Quarter)
- [ ] Dynamic code splitting per page
- [ ] Progressive image loading
- [ ] API response caching
- [ ] CDN edge caching optimization

---

## Resources

- **Lighthouse Docs:** https://github.com/GoogleChrome/lighthouse-ci
- **Web Vitals Guide:** https://web.dev/vitals
- **Shopify Performance:** https://shopify.dev/themes/best-practices/performance
- **CSS Tips:** https://web.dev/performance
- **Accessibility:** https://www.a11y-101.com/

---

## Support & Escalation

**Workflow Failed?**
1. Check GitHub Actions logs: Repository → Actions → Latest run
2. Verify all secrets are configured correctly
3. Ensure staging theme ID is valid
4. Check theme files for Liquid syntax errors

**Performance Score Dropped?**
1. Compare current report vs previous report
2. Identify which metric changed
3. Use Chrome DevTools to profile locally
4. Implement fix and verify in new audit run

**Questions?**
Refer to dev team or Shopify documentation.

---

**Maintained by:** PNW Enterprises Development Team  
**Last Review:** January 21, 2026  
**Next Review:** February 21, 2026
