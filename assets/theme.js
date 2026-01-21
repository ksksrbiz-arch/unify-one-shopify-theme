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
   */
  const Storage = {
    get: (key, defaultValue = null) => {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
      } catch (e) {
        console.error('Storage.get error:', e);
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Storage.set error:', e);
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Storage.remove error:', e);
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
      console.log('Analytics loaded');
    }
  };

  // ===========================================
  // MOBILE MENU
  // ===========================================

  const MobileMenu = {
    init() {
      this.setupToggle();
      this.setupCloseOnClick();
    },

    setupToggle() {
      const toggle = document.querySelector('[data-menu-toggle]');
      const menu = document.querySelector('[data-mobile-menu]');

      if (toggle) {
        toggle.addEventListener('click', () => {
          menu.classList.toggle('is-open');
          toggle.classList.toggle('is-active');
        });
      }
    },

    setupCloseOnClick() {
      const links = document.querySelectorAll('[data-mobile-menu] a');
      links.forEach((link) => {
        link.addEventListener('click', () => {
          const menu = document.querySelector('[data-mobile-menu]');
          const toggle = document.querySelector('[data-menu-toggle]');
          menu.classList.remove('is-open');
          toggle.classList.remove('is-active');
        });
      });
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
    addToCart(productId, quantity = 1) {
      const formData = new FormData();
      formData.append('id', productId);
      formData.append('quantity', quantity);

      return fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('Item added to cart:', json);
          this.updateCartCount();
          this.showNotification('Product added to cart');
          return json;
        })
        .catch((error) => {
          console.error('Error adding to cart:', error);
          this.showNotification('Error adding to cart', 'error');
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
      const notification = document.createElement('div');
      notification.className = `notification notification--${type}`;
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
    console.log('UnifyOne theme initialized');
    CookieConsent.init();
    MobileMenu.init();
    ProductGallery.init();
    LazyLoad.init();

    // Setup cart listeners
    document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = btn.dataset.addToCart;
        const quantity = parseInt(btn.dataset.quantity || 1);
        Cart.addToCart(productId, quantity);
      });
    });
  });

  // Expose to global scope if needed
  window.ThemeCart = Cart;
  window.ThemeStorage = Storage;
})();
