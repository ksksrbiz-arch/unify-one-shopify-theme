/**
 * UnifyOne Shopify Theme - Main JavaScript
 * Last Updated: January 21, 2026
 */

(function() {
  'use strict';

  // ===========================================
  // UTILITY FUNCTIONS
  // ===========================================

  /**
   * DOM Query Helper
   */
  const $ = (selector) => {
    const element = document.querySelector(selector);
    return element ? [element] : [];
  };

  const $$ = (selector) => {
    return document.querySelectorAll(selector);
  };

  /**
   * Event Delegation
   */
  const on = (selector, event, callback) => {
    document.addEventListener(event, (e) => {
      if (e.target.matches(selector)) {
        callback(e);
      }
    });
  };

  /**
   * LocalStorage Manager
   * Note: get() does not check consent to avoid circular dependency
   * set() checks consent except for consent-related keys
   */
  const Storage = {
    get: (key, defaultValue = null) => {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
      } catch (e) {
        // Silent fail for storage errors
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        // Bypass consent check for consent-related keys to avoid circular dependency
        const consentKeys = ['cookie-consent', 'cookie-dismissed'];
        if (!consentKeys.includes(key)) {
          // For non-consent keys, check if consent exists directly
          const hasConsent = localStorage.getItem('cookie-consent');
          if (hasConsent !== 'true') {
            return;
          }
        }
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        // Silent fail for storage errors (quota exceeded, private mode, etc.)
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // Silent fail for storage errors
      }
    }
  };

  // ===========================================
  // COOKIE CONSENT
  // ===========================================

  const CookieConsent = {
    init() {
      if (!this.hasConsent() && !this.isDismissed()) {
        this.show();
      }
      this.setupListeners();
    },

    hasConsent() {
      return Storage.get('cookie-consent') === true;
    },

    isDismissed() {
      return Storage.get('cookie-dismissed') === true;
    },

    show() {
      const banner = document.getElementById('cookie-banner');
      if (banner) {
        banner.style.display = 'block';
      }
    },

    hide() {
      const banner = document.getElementById('cookie-banner');
      if (banner) {
        banner.style.display = 'none';
      }
    },

    setupListeners() {
      const acceptBtn = document.getElementById('cookie-accept');
      const declineBtn = document.getElementById('cookie-decline');

      if (acceptBtn) {
        acceptBtn.addEventListener('click', () => this.accept());
      }
      if (declineBtn) {
        declineBtn.addEventListener('click', () => this.decline());
      }
    },

    accept() {
      Storage.set('cookie-consent', true);
      this.hide();
      this.loadAnalytics();
    },

    decline() {
      Storage.set('cookie-dismissed', true);
      this.hide();
    },

    loadAnalytics() {
      // Load Google Analytics or other tracking scripts
      // TODO: Implement actual analytics loading (GA4, Meta Pixel, etc.)
    }
  };

  // ===========================================
  // MOBILE MENU
  // ===========================================

  const MobileMenu = {
    init() {
      this.setupToggle();
      this.setupCloseOnClick();
      this.setupAccessibility();
    },

    setupToggle() {
      const toggle = document.querySelector('[data-menu-toggle]');
      const menu = document.querySelector('[data-mobile-menu]');

      if (toggle && menu) {
        toggle.addEventListener('click', () => {
          const isOpen = menu.classList.toggle('is-open');
          toggle.classList.toggle('is-active');
          
          // Update ARIA attributes
          toggle.setAttribute('aria-expanded', isOpen);
          menu.setAttribute('aria-hidden', !isOpen);
          
          // Prevent body scroll when menu is open
          document.body.style.overflow = isOpen ? 'hidden' : '';
        });
      }
    },

    setupCloseOnClick() {
      const links = document.querySelectorAll('[data-mobile-menu] a');
      const menu = document.querySelector('[data-mobile-menu]');
      const toggle = document.querySelector('[data-menu-toggle]');
      
      links.forEach((link) => {
        link.addEventListener('click', () => {
          if (menu && toggle) {
            menu.classList.remove('is-open');
            toggle.classList.remove('is-active');
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
          }
        });
      });
    },

    setupAccessibility() {
      const menu = document.querySelector('[data-mobile-menu]');
      
      if (menu) {
        // Handle Escape key to close menu
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && menu.classList.contains('is-open')) {
            const toggle = document.querySelector('[data-menu-toggle]');
            if (toggle) {
              toggle.click();
            }
          }
        });
      }
    }
  };

  // ===========================================
  // PRODUCT IMAGE GALLERY
  // ===========================================

  const ProductGallery = {
    init() {
      const gallery = document.querySelector('[data-product-gallery]');
      if (gallery) {
        this.setupThumbnails();
      }
    },

    setupThumbnails() {
      const thumbnails = document.querySelectorAll('[data-gallery-thumbnail]');
      const mainImage = document.querySelector('[data-gallery-main-image]');

      thumbnails.forEach((thumb) => {
        thumb.addEventListener('click', () => {
          const src = thumb.dataset.galleryThumbnail;
          if (mainImage && src) {
            mainImage.src = src;
            mainImage.alt = thumb.alt;
            thumbnails.forEach((t) => t.classList.remove('is-active'));
            thumb.classList.add('is-active');
          }
        });
      });
    }
  };

  // ===========================================
  // CART FUNCTIONALITY
  // ===========================================

  const Cart = {
    addToCart(productId, quantity = 1, retries = 2) {
      const formData = new FormData();
      formData.append('id', productId);
      formData.append('quantity', quantity);

      return fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((json) => {
          this.updateCartCount();
          this.showNotification('Product added to cart');
          return json;
        })
        .catch((error) => {
          // Retry logic for network errors
          if (retries > 0) {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(this.addToCart(productId, quantity, retries - 1));
              }, 1000);
            });
          }
          this.showNotification('Unable to add product to cart. Please try again.', 'error');
          throw error;
        });
    },

    updateCartCount() {
      fetch('/cart.js')
        .then((response) => response.json())
        .then((json) => {
          const cartCount = document.querySelector('[data-cart-count]');
          if (cartCount) {
            cartCount.textContent = json.item_count;
          }
        });
    },

    showNotification(message, type = 'success') {
      // Validate notification type
      const validTypes = ['success', 'error', 'warning', 'info'];
      const notificationType = validTypes.includes(type) ? type : 'info';
      
      const notification = document.createElement('div');
      notification.className = `notification notification--${notificationType}`;
      notification.setAttribute('role', 'alert');
      notification.setAttribute('aria-live', 'polite');
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  };

  // ===========================================
  // LAZY LOADING
  // ===========================================

  const LazyLoad = {
    init() {
      const images = document.querySelectorAll('[data-lazy-load]');
      if ('IntersectionObserver' in window) {
        this.setupIntersectionObserver(images);
      } else {
        this.setupFallback(images);
      }
    },

    setupIntersectionObserver(images) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.lazyLoad;
            img.removeAttribute('data-lazy-load');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px' // Load images 50px before they enter viewport
      });

      images.forEach((img) => observer.observe(img));
    },

    setupFallback(images) {
      images.forEach((img) => {
        img.src = img.dataset.lazyLoad;
      });
    }
  };

  // ===========================================
  // INITIALIZATION
  // ===========================================

  document.addEventListener('DOMContentLoaded', () => {
    CookieConsent.init();
    MobileMenu.init();
    ProductGallery.init();
    LazyLoad.init();

    // Setup cart listeners
    document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = btn.dataset.addToCart;
        const quantity = parseInt(btn.dataset.quantity || 1, 10);
        
        // Shopify variant IDs are numeric strings (e.g., "12345678901")
        const isValidVariantId = /^\d+$/.test(productId);
        
        if (!productId || !isValidVariantId) {
          Cart.showNotification('Invalid product ID', 'error');
          return;
        }
        
        if (isNaN(quantity) || quantity < 1) {
          Cart.showNotification('Invalid quantity', 'error');
          return;
        }
        
        Cart.addToCart(productId, quantity);
      });
    });
  });

  // Expose to global scope if needed
  window.ThemeCart = Cart;
  window.ThemeStorage = Storage;
})();
