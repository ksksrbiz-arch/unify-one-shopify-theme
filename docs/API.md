# UnifyOne Theme - JavaScript API Documentation

## Overview

The UnifyOne theme exposes several JavaScript modules to the global `window` scope for use in custom scripts and apps.

## Global API

### `window.ThemeCart`

Cart management functionality.

#### Methods

##### `addToCart(productId, quantity, retries)`

Adds a product to the cart with automatic retry logic.

**Parameters:**
- `productId` (String|Number) - The variant ID to add to cart
- `quantity` (Number, optional) - Quantity to add (default: 1)
- `retries` (Number, optional) - Number of retry attempts on failure (default: 2)

**Returns:** Promise<Object> - Cart item data from Shopify API

**Example:**
```javascript
// Add product to cart
window.ThemeCart.addToCart('12345678', 2)
  .then(item => {
    console.log('Added to cart:', item);
  })
  .catch(error => {
    console.error('Failed to add to cart:', error);
  });
```

**Features:**
- Automatic retry on network failure (up to 2 times with 1s delay)
- Shows success/error notification to user
- Updates cart count in header
- Includes CSRF protection headers

##### `updateCartCount()`

Fetches current cart state and updates the cart count display.

**Example:**
```javascript
window.ThemeCart.updateCartCount();
```

##### `showNotification(message, type)`

Displays a temporary notification to the user.

**Parameters:**
- `message` (String) - Notification message
- `type` (String, optional) - One of: 'success', 'error', 'warning', 'info' (default: 'success')

**Example:**
```javascript
window.ThemeCart.showNotification('Item added!', 'success');
window.ThemeCart.showNotification('Something went wrong', 'error');
```

**Features:**
- Auto-dismisses after 3 seconds
- ARIA attributes for accessibility
- Type validation (invalid types default to 'info')

---

### `window.ThemeStorage`

Wrapper around localStorage with GDPR compliance and error handling.

#### Methods

##### `get(key, defaultValue)`

Retrieves a value from localStorage.

**Parameters:**
- `key` (String) - Storage key
- `defaultValue` (Any, optional) - Fallback value if key doesn't exist (default: null)

**Returns:** Any - Parsed JSON value or defaultValue

**Example:**
```javascript
const userPrefs = window.ThemeStorage.get('user-preferences', {});
```

##### `set(key, value)`

Stores a value in localStorage (requires cookie consent).

**Parameters:**
- `key` (String) - Storage key
- `value` (Any) - Value to store (will be JSON stringified)

**Example:**
```javascript
window.ThemeStorage.set('user-preferences', { theme: 'dark' });
```

**Important:** This method respects cookie consent. If the user hasn't consented, the value won't be stored.

##### `remove(key)`

Removes a value from localStorage.

**Parameters:**
- `key` (String) - Storage key to remove

**Example:**
```javascript
window.ThemeStorage.remove('user-preferences');
```

---

## Internal Modules

These modules are not exposed globally but are documented for theme development.

### CookieConsent

Manages cookie consent banner and GDPR compliance.

**Methods:**
- `init()` - Initialize consent banner
- `hasConsent()` - Check if user has given consent
- `accept()` - Accept cookies and load analytics
- `decline()` - Decline cookies
- `loadAnalytics()` - Load tracking scripts (placeholder)

### MobileMenu

Manages mobile navigation menu.

**Methods:**
- `init()` - Initialize mobile menu
- `setupToggle()` - Setup menu toggle button
- `setupCloseOnClick()` - Close menu when link clicked
- `setupAccessibility()` - Add keyboard navigation support

**Features:**
- ARIA attributes for screen readers
- Escape key to close
- Prevents body scroll when open
- Focus management

### ProductGallery

Manages product image gallery and thumbnails.

**Methods:**
- `init()` - Initialize gallery
- `setupThumbnails()` - Setup thumbnail click handlers

### LazyLoad

Lazy loads images for performance.

**Methods:**
- `init()` - Initialize lazy loading
- `setupIntersectionObserver(images)` - Use modern API
- `setupFallback(images)` - Fallback for old browsers

**Configuration:**
- Uses IntersectionObserver with 50px rootMargin
- Loads images before they enter viewport
- Graceful degradation for unsupported browsers

---

## Data Attributes

The theme uses data attributes for component initialization:

### Cart
- `[data-add-to-cart]` - Product variant ID to add
- `[data-quantity]` - Quantity to add (optional, default: 1)
- `[data-cart-count]` - Cart count display element

### Mobile Menu
- `[data-menu-toggle]` - Menu toggle button
- `[data-mobile-menu]` - Mobile menu container

### Gallery
- `[data-product-gallery]` - Gallery container
- `[data-gallery-thumbnail]` - Thumbnail images
- `[data-gallery-main-image]` - Main product image

### Lazy Loading
- `[data-lazy-load]` - Image src to load lazily

---

## Events

### DOMContentLoaded

All modules are initialized on `DOMContentLoaded`:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Modules are initialized here
});
```

---

## Custom Integration Examples

### Add to Cart from Custom Button

```html
<button 
  type="button"
  data-add-to-cart="12345678"
  data-quantity="2">
  Add to Cart
</button>
```

### Check Cookie Consent

```javascript
// Check if user has given consent
if (window.ThemeStorage.get('cookie-consent') === true) {
  // Load analytics or tracking
}
```

### Show Custom Notification

```javascript
// After custom action
window.ThemeCart.showNotification('Saved successfully!', 'success');
```

### Refresh Cart Count

```javascript
// After cart update via API
window.ThemeCart.updateCartCount();
```

---

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Graceful Degradation**: Falls back for older browsers
- **Required Features**: ES6, Fetch API, IntersectionObserver (with fallback)

---

## Security Considerations

1. **XSS Protection**: All user input is sanitized
2. **CSRF Protection**: X-Requested-With header on AJAX requests
3. **CSP**: Content Security Policy enforced
4. **GDPR Compliance**: Consent required for storage/tracking

---

## Performance Notes

- **Lazy Loading**: Images load 50px before viewport
- **Retry Logic**: Network failures retry 2 times with 1s delay
- **Error Handling**: Silent failures for storage quota/private mode
- **Minimal Dependencies**: Vanilla JavaScript, no jQuery

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- Cart management
- Cookie consent
- Mobile menu
- Product gallery
- Lazy loading
- Improved security and accessibility

---

For questions or issues, see [GitHub Issues](https://github.com/ksksrbiz-arch/unify-one-shopify-theme/issues).
