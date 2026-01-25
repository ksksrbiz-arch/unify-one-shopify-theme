# CSS Best Practices for Shopify Themes

Quick reference for CSS development with Shopify GitHub integration.

## File Organization

### ✅ DO
```
assets/
├── custom-styles.css          # Global styles
├── section-header.css         # Header section only
├── section-footer.css         # Footer section only
├── section-hero.css           # Hero section only
└── section-product-card.css   # Product card section
```

### ❌ DON'T
```
css/styles.css                 # Wrong directory
assets/css/styles.css          # Subdirectories not supported
custom styles.css              # Spaces in filename
```

## CSS Scoping

### ✅ DO - Section-Specific CSS
```css
/* In section-header.css */
[data-section-type="header"] .nav-link {
  color: var(--text-dark);
}

[data-section-type="header"] .header__logo {
  max-width: 200px;
}
```

### ❌ DON'T - Global Selectors in Section CSS
```css
/* This affects ALL .nav-link elements, not just header */
.nav-link {
  color: var(--text-dark);
}
```

## Liquid Integration

### ✅ DO - Use CSS Variables
```liquid
<!-- In theme.liquid -->
{% style %}
  :root {
    --primary-color: {{ settings.color_primary }};
    --font-base: {{ settings.font_body.family }};
  }
{% endstyle %}
```

```css
/* In custom-styles.css */
.button {
  background-color: var(--primary-color);
  font-family: var(--font-base);
}
```

### ❌ DON'T - Liquid in CSS Files
```css
/* This won't work - CSS files aren't processed by Liquid */
.button {
  background-color: {{ settings.color_primary }};
}
```

## Loading CSS

### ✅ DO - Use Shopify Filters
```liquid
<!-- Global CSS in theme.liquid -->
{{ 'custom-styles.css' | asset_url | stylesheet_tag }}

<!-- Section CSS in section file -->
{{ 'section-header.css' | asset_url | stylesheet_tag }}
```

### ❌ DON'T - Direct Links
```liquid
<!-- Won't work with CDN -->
<link rel="stylesheet" href="/assets/custom-styles.css">
<link rel="stylesheet" href="custom-styles.css">
```

## Responsive Design

### ✅ DO - Mobile-First or Desktop-First Consistently
```css
/* Mobile-First */
.grid {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### ❌ DON'T - Mix Approaches
```css
/* Confusing - mixing min-width and max-width */
@media (max-width: 768px) { }
@media (min-width: 1024px) { }
@media (max-width: 480px) { }
```

## Shopify Standard Breakpoints

Use these for consistency:
```css
/* Mobile: 320px - 767px (default) */
/* Tablet: 768px - 1023px */
@media (min-width: 768px) { }

/* Desktop: 1024px+ */
@media (min-width: 1024px) { }

/* Large Desktop: 1440px+ */
@media (min-width: 1440px) { }
```

## Naming Conventions

### ✅ DO - BEM (Block Element Modifier)
```css
/* Block */
.product-card { }

/* Element */
.product-card__image { }
.product-card__title { }
.product-card__price { }

/* Modifier */
.product-card--featured { }
.product-card--sale { }
```

### ❌ DON'T - Generic Names
```css
.card { }         /* Too generic */
.item { }         /* Too vague */
.container1 { }   /* Numbered containers */
```

## CSS Variables

### ✅ DO - Organized Variable System
```css
:root {
  /* Colors */
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  
  /* Typography */
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
}
```

### ❌ DON'T - Inline Values
```css
.button {
  padding: 12px 24px;      /* Use var(--space-md) */
  font-size: 16px;         /* Use var(--font-size-base) */
  background: #007bff;     /* Use var(--color-primary) */
}
```

## Performance

### ✅ DO
```css
/* Efficient selectors */
.nav-link { }
[data-section-type="header"] .nav-link { }

/* Optimize animations */
.button {
  transition: transform 0.2s ease;
  will-change: transform;
}
```

### ❌ DON'T
```css
/* Overly specific selectors */
body div.container ul.list li.item a.link { }

/* Expensive properties in animations */
.button {
  transition: width 0.3s, height 0.3s, background 0.3s;
}

/* @import blocks rendering */
@import url('other-styles.css');
```

## File Size

### ✅ DO
- Keep individual CSS files < 50KB (uncompressed)
- Split large CSS into section-specific files
- Remove unused styles
- Use CSS minification in production

### ❌ DON'T
- Create one massive CSS file > 100KB
- Include unused vendor CSS
- Leave commented-out code in production

## Accessibility

### ✅ DO
```css
/* Visible focus states */
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
}

/* Sufficient contrast */
.button {
  background: #007bff;  /* 4.5:1 contrast ratio */
  color: #ffffff;
}
```

### ❌ DON'T
```css
/* Removing all focus styles */
*:focus {
  outline: none;  /* Bad for accessibility */
}

/* Low contrast */
.text {
  color: #999;  /* Poor contrast on white */
}
```

## Browser Compatibility

### ✅ DO
```css
/* Modern with fallbacks */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

@supports not (display: grid) {
  .grid {
    display: flex;
    flex-wrap: wrap;
  }
}
```

### ❌ DON'T
```css
/* No fallbacks for modern features */
.element {
  display: grid;  /* No fallback for old browsers */
}
```

## Comments

### ✅ DO
```css
/* ============================================
   SECTION NAME
   ============================================ */

/* Component explanation when needed */
.complex-component {
  /* Using absolute positioning for dropdown */
  position: absolute;
}
```

### ❌ DON'T
```css
/* Excessive comments */
.button { /* Button styling */ }
.button:hover { /* Hover state */ }

/* Commented out code (remove instead) */
/* .old-style { display: block; } */
```

## GitHub Integration

### ✅ DO
- Commit CSS with descriptive messages: `feat(css): add header responsive styles`
- Test in staging theme before production
- Use `.shopifyignore` to exclude non-theme files
- Version CSS for cache busting: `?v=1.0.0`

### ❌ DON'T
- Commit directly to production branch
- Skip staging testing
- Include source maps or dev files
- Forget to sync after changes

## Testing Checklist

Before pushing CSS to production:

- [ ] Validated CSS syntax
- [ ] Tested in Chrome, Safari, Firefox, Edge
- [ ] Tested on mobile devices
- [ ] Checked responsive breakpoints
- [ ] Verified color contrast (WCAG AA)
- [ ] Tested keyboard navigation
- [ ] Checked file sizes
- [ ] Cleared cache and retested
- [ ] Reviewed in staging theme
- [ ] Ran Lighthouse performance test

## Validation Commands

```bash
# Lint Liquid files
npm run lint:liquid

# Check CSS files
ls -lh assets/*.css

# Search for Liquid in CSS
grep -r "{{" assets/*.css

# Deploy to staging
npm run deploy:staging

# Run full validation
npm run build
```

## Common Mistakes

1. **Liquid syntax in CSS files** → Use CSS variables instead
2. **Missing data attributes** → Add `data-section-type` to sections
3. **Global styles in section CSS** → Use section scoping
4. **CSS in subdirectories** → Keep in `assets/` root
5. **No fallbacks** → Test in multiple browsers
6. **Poor specificity** → Use consistent naming conventions
7. **Large file sizes** → Split into smaller files
8. **Cache issues** → Use version parameters

## Resources

- [CSS_INTEGRATION_GUIDE.md](./CSS_INTEGRATION_GUIDE.md) - Complete integration guide
- [CSS_TESTING_GUIDE.md](./CSS_TESTING_GUIDE.md) - Testing procedures
- [Shopify Liquid CSS Filters](https://shopify.dev/api/liquid/filters#asset_url)
- [Shopify Theme Structure](https://shopify.dev/themes/architecture)

---

**Quick Reference**
- Global CSS: `assets/custom-styles.css`
- Section CSS: `assets/section-{name}.css`
- Load in Liquid: `{{ 'file.css' | asset_url | stylesheet_tag }}`
- Scope with: `[data-section-type="name"]`
- Test in: Staging theme first

---

**Last Updated:** January 25, 2026  
**Version:** 1.0.0
