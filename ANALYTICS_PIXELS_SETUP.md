# OneCommerce Analytics & Pixels Setup Guide

**Last Updated**: January 21, 2026  
**Theme Version**: 1.0.0+analytics-pixels  
**Status**: ✅ Ready for Implementation

---

## 📊 Overview: Your Analytics Architecture

Your OneCommerce Shopify store integrates with **6 major advertising platforms** + **Shopify native analytics**:

```
┌─────────────────────────────────────────────────────────────┐
│           Shopify Store (1commerce.shop)                    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Custom Pixel │  │ GA4 + Google │  │ Meta Pixel   │      │
│  │  Events      │  │ YouTube Ads  │  │ (Facebook)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
├─────────┼──────────────────┼──────────────────┼──────────────┤
│  ┌──────┴──────┐  ┌───────┴──────┐  ┌──────┴───────┐       │
│  │ TikTok Ads  │  │ Pinterest    │  │ Snapchat     │       │
│  │ Conversion  │  │ Tag          │  │ Pixel        │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │    Shopify Native Analytics Dashboard               │    │
│  │    - Conversion funnel (Sessions → Purchases)       │    │
│  │    - Customer journey (Device, Location, Source)    │    │
│  │    - Revenue attribution (By channel, product)      │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Start: Install Apps

### Step 1: Install Shopify Apps (5 minutes)

Go to **Settings → Apps and integrations → App store** and install:

1. **[Google & YouTube](https://apps.shopify.com/google)** ✅ Priority 1
   - Covers: GA4 + Google Ads + YouTube remarketing
   - Automatic ecommerce event tracking
   - No additional setup needed

2. **[Facebook & Instagram by Meta](https://apps.shopify.com/facebook-ads)** ✅ Priority 1
   - Covers: Meta pixel + Facebook Ads + Instagram
   - Automatic product catalog sync
   - Automatic event tracking

3. **[TikTok for Shopify](https://apps.shopify.com/tiktok)** ✅ Priority 2
   - TikTok conversion tracking
   - TikTok Shop integration

4. **[Pinterest](https://apps.shopify.com/pinterest)** ✅ Priority 2
   - Pinterest conversion tracking
   - Rich pins support

5. **[Snapchat Ads](https://apps.shopify.com/snapchat-ads)** ✅ Priority 3
   - Snapchat pixel + conversion tracking

### Step 2: Create Custom Pixel for Advanced Tracking (10 minutes)

Go to **Settings → Customer events → Add custom pixel**:

**Pixel Name**: `UnifyOne Analytics Funnel`

**Pixel Code** (paste this):

```javascript
// ============================================
// UnifyOne Custom Analytics Pixel
// Tracks: section engagement, custom events
// ============================================

// 1. SECTION ENGAGEMENT TRACKING
window.addEventListener('load', function() {
  // Track when product sections come into view
  const productSections = document.querySelectorAll('[data-section-type="product"]');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.dataset.sectionId || 'unknown';
        const sectionName = entry.target.dataset.sectionName || 'Product Section';
        
        // Publish to analytics
        analytics.publish('section_viewed', {
          section_id: sectionId,
          section_name: sectionName,
          timestamp: new Date().toISOString(),
          scroll_depth: window.scrollY
        });
      }
    });
  }, { threshold: 0.5 });
  
  productSections.forEach(section => sectionObserver.observe(section));
});

// 2. BUTTON/CTA CLICK TRACKING
document.addEventListener('click', function(event) {
  const trackableElement = event.target.closest('[data-track-engagement]');
  
  if (trackableElement) {
    const section = trackableElement.closest('[data-section-id]');
    const action = trackableElement.dataset.trackEngagement;
    const sectionId = section ? section.dataset.sectionId : 'unknown';
    
    analytics.publish('cta_clicked', {
      action: action,
      section_id: sectionId,
      element_text: trackableElement.textContent,
      timestamp: new Date().toISOString()
    });
  }
});

// 3. CUSTOM ECOMMERCE EVENTS
analytics.subscribe('product_viewed', (event) => {
  console.log('Product viewed:', event);
  
  // Publish custom event for your backend
  analytics.publish('product_detail_viewed', {
    product_id: event.data?.productVariant?.id,
    product_name: event.data?.productVariant?.title,
    price: event.data?.productVariant?.price?.amount,
    currency: event.data?.productVariant?.price?.currencyCode
  });
});

analytics.subscribe('product_added_to_cart', (event) => {
  console.log('Item added to cart:', event);
  analytics.publish('cart_item_added', {
    product_id: event.data?.cartLine?.merchandise?.id,
    quantity: event.data?.cartLine?.quantity,
    price: event.data?.cartLine?.cost?.totalAmount?.amount
  });
});

analytics.subscribe('checkout_started', (event) => {
  console.log('Checkout started:', event);
  analytics.publish('checkout_initiated', {
    cart_total: event.data?.checkout?.totalPrice?.amount,
    line_items: event.data?.checkout?.lineItems?.length
  });
});

analytics.subscribe('checkout_completed', (event) => {
  console.log('Purchase completed:', event);
  analytics.publish('purchase_completed', {
    order_id: event.data?.checkout?.id,
    total_price: event.data?.checkout?.totalPrice?.amount,
    currency: event.data?.checkout?.currencyCode,
    line_items: event.data?.checkout?.lineItems?.length
  });
});

// 4. PAGE ENGAGEMENT METRICS
let pageStartTime = Date.now();
window.addEventListener('beforeunload', function() {
  const timeOnPage = (Date.now() - pageStartTime) / 1000; // seconds
  analytics.publish('page_engagement', {
    url: window.location.pathname,
    time_on_page: timeOnPage,
    scroll_depth: Math.round((window.scrollY / document.body.scrollHeight) * 100)
  });
});

console.log('✅ UnifyOne Analytics Pixel Loaded');
```

---

## 📈 Platform-Specific Setup

### Meta Pixel (Facebook & Instagram)

**Status**: ✅ Automatic via app

The **Facebook & Instagram by Meta** app automatically:
- ✅ Tracks page views
- ✅ Tracks product views
- ✅ Tracks add to cart events
- ✅ Tracks purchases (with conversion value)
- ✅ Syncs product catalog for dynamic ads

**To verify**: Go to **Settings → Apps and integrations → Facebook & Instagram → Pixel**

**Advanced**: Create custom audiences for retargeting:
1. In Facebook Ads Manager → Audiences → Create Audience → Custom Audience
2. Select "Shopify" as source
3. Select your store (1commerce.shop)
4. Create audience based on customers who viewed specific products

---

### Google Analytics 4 + Google Ads

**Status**: ✅ Automatic via app

The **Google & YouTube** app sets up:
- ✅ GA4 property (track sessions, page views, events)
- ✅ Google Ads conversion tracking
- ✅ YouTube remarketing list
- ✅ Google Shopping feed

**To access GA4 dashboard**: 
1. Go to **Settings → Apps and integrations → Google & YouTube → Analytics**
2. Click "View in Google Analytics"

**Create GA4 Conversion Funnels**:

1. In GA4 → Explore → Funnel exploration
2. Define your customer journey:
   ```
   Step 1: session_start
   Step 2: view_item (product page viewed)
   Step 3: add_to_cart
   Step 4: begin_checkout
   Step 5: purchase
   ```
3. This shows dropout at each stage
4. Identify where customers are leaving

---

### TikTok Pixel

**Status**: ✅ Automatic via app

The **TikTok for Shopify** app provides:
- ✅ TikTok pixel setup
- ✅ Automatic event tracking (page view, add to cart, purchase)
- ✅ Audience building for TikTok ads
- ✅ TikTok Shop integration (if eligible)

**To enable TikTok Shop** (optional, high-volume sellers):
1. Install TikTok for Shopify app
2. Go to **Settings → TikTok for Shopify → Shop Settings**
3. Follow onboarding (requires 100+ followers + account age)
4. Sync your product catalog

---

### Pinterest Tag

**Status**: ✅ Automatic via app

The **Pinterest for Shopify** app provides:
- ✅ Pinterest pixel
- ✅ Rich Pin support (enhanced product info)
- ✅ Conversion tracking
- ✅ Automated catalog sync

**To create Rich Pins**:
1. Go to **Settings → Pinterest → Rich Pins**
2. Enable "Product Catalog Rich Pins"
3. Verify in Pinterest Creator Hub

---

### Snapchat Pixel

**Status**: ✅ Automatic via app

The **Snapchat Ads for Shopify** app provides:
- ✅ Snapchat pixel
- ✅ Event tracking
- ✅ Audience building
- ✅ Snapchat Shop (if eligible)

---

### Microsoft Advertising (Bing) - Manual Setup

**If using Bing Ads** (optional), add custom pixel:

**Pixel Code**:
```javascript
(function(w,d,t,r,u){
  var f,n,i;
  w[u]=w[u]||[],f=function(){
    var o={ti:"YOUR_UET_TAG_ID"};
    o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")
  },
  n=d.createElement(t),n.src=r,n.async=1,
  n.onload=n.onreadystatechange=function(){
    var s=this.readyState;
    s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)
  },
  i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)
})(window,document,"script","//bat.bing.com/bat.js","uetq");

analytics.subscribe('checkout_completed', (event) => {
  window.uetq = window.uetq || [];
  window.uetq.push('event', 'purchase', {
    revenue_value: event.data?.checkout?.totalPrice?.amount,
    currency: event.data?.checkout?.currencyCode
  });
});
```

**To find your UET Tag ID**:
1. Log into Microsoft Advertising
2. Go to Tools → Conversion Tracking → UET Tag
3. Copy your tag ID
4. Replace `YOUR_UET_TAG_ID` in code above

---

## 🔍 Shopify Native Analytics

### Access Built-in Dashboard

Go to **Analytics** in your Shopify Admin:

**Key Reports**:
- **Overview**: Total sales, orders, conversion rate, AOV
- **Sessions**: Traffic by device, location, traffic source
- **Products**: Top performers, revenue by product
- **Customers**: New vs returning, customer lifetime value
- **Channels**: Revenue by sales channel (Shopify, app, etc.)

### Build Custom Conversion Funnels

**Shopify Analytics → Reports → Create Report**:

1. **Conversion Funnel Report**:
   - Sessions (top)
   - Product page views
   - Add to cart
   - Checkout initiated
   - Checkout completed (bottom)
   - Each stage shows drop-off %

2. **Device-Specific Funnel**:
   - Filter by Mobile vs Desktop
   - Identify which device has higher conversion

3. **Traffic Source Funnel**:
   - Filter by Organic, Paid, Direct, Referral
   - See which source converts best

---

## 📊 Analytics Funnel: Complete Customer Journey

### Your Three-Stage Conversion Model

```
┌──────────────────────────────────────────────────────┐
│ STAGE 1: AWARENESS (Top of Funnel)                   │
├──────────────────────────────────────────────────────┤
│ Sources: Google Ads, TikTok, Pinterest, Facebook     │
│ Metric: Sessions, Impressions, Cost Per Click        │
│ Goal: Drive traffic to homepage                      │
│                                                      │
│ Track in: GA4 → Acquisition → All Traffic            │
│          TikTok Ads Mgr → Campaign Results            │
└────────────────────┬─────────────────────────────────┘
                     │ 30-40% of sessions
                     ↓
┌──────────────────────────────────────────────────────┐
│ STAGE 2: CONSIDERATION (Middle of Funnel)            │
├──────────────────────────────────────────────────────┤
│ Behavior: Browse products, read reviews, compare     │
│ Metric: Pages per session, avg session duration      │
│ Goal: Engage visitors with product content           │
│                                                      │
│ Track in: GA4 → Engagement → Pages & Screens         │
│          Custom pixel → section_viewed events        │
│          Shopify → Products → Browse behavior        │
└────────────────────┬─────────────────────────────────┘
                     │ 10-15% add to cart
                     ↓
┌──────────────────────────────────────────────────────┐
│ STAGE 3: CONVERSION (Bottom of Funnel)               │
├──────────────────────────────────────────────────────┤
│ Behavior: Add to cart → Checkout → Purchase          │
│ Metric: Cart abandonment %, checkout completion %    │
│ Goal: Minimize friction, increase AOV                │
│                                                      │
│ Track in: GA4 → Conversions → All Events             │
│          Meta Pixel → Purchase events                │
│          Shopify Analytics → Revenue, Orders         │
└──────────────────────────────────────────────────────┘
                     │ 2-3% complete purchase
                     ↓
              💰 REVENUE 💰
```

---

## 🎯 Setting Up Your Funnel in Each Platform

### Google Analytics 4

**Funnel Exploration** (go to GA4 → Explore → Funnel exploration):

```
Step 1: event_name = page_view
Step 2: event_name = view_item
Step 3: event_name = add_to_cart
Step 4: event_name = begin_checkout
Step 5: event_name = purchase
```

**Insights**:
- See drop-off % between each step
- Which steps lose most users?
- Filter by device, traffic source, geography

### Meta Ads Manager

**Conversion Funnel** (Ads Manager → Insights → Conversion Value):

1. Set up conversion events:
   - ViewContent (product viewed)
   - AddToCart
   - InitiateCheckout
   - AddPaymentInfo
   - Purchase

2. Track funnel in Campaign Results:
   - See cost per purchase
   - Identify highest-ROI ads
   - Optimize based on conversion stage

### TikTok Ads Manager

**Campaign Analytics** (Ads Manager → Results → Conversion Data):

- Track conversion events automatically
- Create lookalike audiences from converters
- Optimize bids toward Purchase event

---

## 🔗 Connecting Analytics to Your Backend

### Send Analytics Events to Your OneCommerce API

In your `custom-pixel` code, add:

```javascript
// Send custom events to your backend
analytics.publish('purchase_completed', (event) => {
  // Also send to your OneCommerce API for deeper analysis
  fetch('https://api.1commerce.shop/v1/analytics-engine/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.ANALYTICS_API_KEY
    },
    body: JSON.stringify({
      event_type: 'purchase_completed',
      order_id: event.data?.checkout?.id,
      total_value: event.data?.checkout?.totalPrice?.amount,
      currency: event.data?.checkout?.currencyCode,
      timestamp: new Date().toISOString(),
      source: 'shopify'
    })
  });
});
```

This creates a feedback loop:
- **Shopify events** → Your OneCommerce analytics engine
- Your backend can then:
  - Calculate customer lifetime value
  - Predict churn
  - Generate personalized recommendations
  - Trigger email automation

---

## 📋 Setup Checklist

### Phase 1: Install Apps (15 minutes)

- [ ] Install Google & YouTube app
- [ ] Install Facebook & Instagram app
- [ ] Install TikTok for Shopify app
- [ ] Install Pinterest app
- [ ] Install Snapchat Ads app
- [ ] Verify each app shows "Connected" status

### Phase 2: Create Custom Pixel (10 minutes)

- [ ] Go to Settings → Customer events
- [ ] Create new custom pixel: "UnifyOne Analytics Funnel"
- [ ] Paste custom pixel code (from above)
- [ ] Test pixel fires on page load (check browser console)
- [ ] Verify events appear in Settings → Customer events → Activity

### Phase 3: Set Up Funnels (15 minutes)

- [ ] GA4: Create funnel with 5 steps (page view → purchase)
- [ ] Meta Ads Mgr: Set up conversion value tracking
- [ ] Shopify Analytics: View native conversion funnel
- [ ] TikTok Ads Mgr: Enable purchase event tracking

### Phase 4: Test & Verify (5 minutes)

- [ ] Make test purchase on staging
- [ ] Verify event appears in GA4 (within 24-48 hours)
- [ ] Verify event in Meta Pixel (Pixel tab in Ads Manager)
- [ ] Verify order appears in Shopify Analytics
- [ ] Check custom pixel fires (console.log confirmation)

### Phase 5: Connect to Backend (Optional)

- [ ] Add API calls to custom pixel
- [ ] Test events flowing to OneCommerce API
- [ ] Verify data appears in your analytics dashboard
- [ ] Set up webhooks for real-time processing

---

## 🐛 Troubleshooting

### Pixels Not Firing

**Problem**: Custom pixel code not loading

**Solution**:
1. Go to Settings → Customer events
2. Check "Status" column
3. If "Inactive", click to activate
4. Wait 5-10 minutes for propagation
5. Test again with new session

### GA4 Events Delayed

**Problem**: Events not showing in GA4 for hours

**Solution**:
- GA4 has **24-48 hour delay** for some events
- Use **Real-time** tab to see events as they fire (within seconds)
- In GA4 → Real-time → Events

### Meta Pixel Not Tracking Purchases

**Problem**: Conversion value not showing in Meta Ads Manager

**Solution**:
1. Verify Meta app is installed
2. Go to Settings → Apps and integrations → Facebook & Instagram
3. Click "Pixel"
4. Check "Connection Status" - should show Connected
5. Go to Facebook Ads Manager → Data Sources → Pixels
6. Verify pixel ID matches Shopify app
7. Make test purchase
8. Check Ads Manager → Events Manager → Recent Activity

---

## 📈 Dashboard Setup (Recommended)

### Create a Weekly Performance Report

**Tools**: 
- GA4 Custom Dashboard
- Meta Ads Manager Performance Summary
- Shopify Analytics Overview

**Key Metrics to Track**:

| Metric | Source | Target | Formula |
|--------|--------|--------|----------|
| Conversion Rate | GA4 | > 2% | Purchases / Sessions |
| Cost Per Acquisition (CPA) | Meta + GA4 | < $20 | Ad Spend / Purchases |
| Average Order Value (AOV) | Shopify | > $50 | Total Revenue / Orders |
| Return on Ad Spend (ROAS) | GA4 | > 3x | Revenue / Ad Spend |
| Cart Abandonment | Shopify | < 70% | (Add to Cart - Purchase) / Add to Cart |
| Customer Lifetime Value | Backend | Track | |

---

## 🚀 Next Steps

1. **Install all apps** (5-minute setup)
2. **Test with staging purchase** (verify events fire)
3. **Create custom pixel** (advanced tracking)
4. **Set up funnels** (understand customer journey)
5. **Connect to backend** (feed data to OneCommerce API)
6. **Monitor weekly** (adjust based on performance)

---

**Last Updated**: January 21, 2026  
**Maintained By**: PNW Enterprises Analytics Team  
**Status**: ✅ Implementation Ready