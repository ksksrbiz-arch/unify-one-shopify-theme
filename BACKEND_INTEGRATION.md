# OneCommerce Backend Integration Guide

**Status**: Framework Ready | Awaiting Cloud Run Deployment  
**Last Updated**: January 21, 2026  
**Theme Version**: 1.0.0+backend-integration

---

## 🔗 Backend Architecture Overview

The UnifyOne Shopify Theme connects to a **Google Cloud Run API** that powers 19 revenue streams:

```
┌─────────────────────────────────────────────────────────────────┐
│         UnifyOne Shopify Theme (1commercesolutions.shop)                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  HTML/CSS/JS (custom-styles.css + theme.js)             │  │
│  │  Liquid Templates (product, collection, page, etc)      │  │
│  └──────────────────────┬──────────────────────────────────┘  │
│                         │ HTTPS API Calls                      │
└─────────────────────────┼──────────────────────────────────────┘
                          │
                   ┌──────┴──────┐
                   │ API Gateway │
                   │ (Cloud Run) │
                   └──────┬──────┘
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
        ▼                 ▼                  ▼
   ┌──────────┐    ┌───────────────┐  ┌──────────────┐
   │PostgreSQL│    │   Firestore   │  │ Secret Mgr   │
   │ (SQL DB) │    │ (Real-time)   │  │(Credentials) │
   └──────────┘    └───────────────┘  └──────────────┘
```

---

## 📡 19 Revenue Stream Endpoints

### Base URL (Production)
```
https://api.1commercesolutions.shop/v1
```

### Base URL (Staging - During Development)
```
https://staging-api.1commercesolutions.shop/v1
```

---

## 🏗️ Revenue Stream Endpoints

All endpoints return JSON and support CORS for theme access.

### 1️⃣ Core API
**Endpoint**: `/core-api`  
**Methods**: GET, POST, PUT, DELETE  
**Purpose**: Core transaction processing, product sync, inventory

```javascript
// theme.js example
fetch('https://api.1commercesolutions.shop/v1/core-api/products', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer ' + shopToken },
})
.then(res => res.json())
.then(data => console.log('Products:', data))
```

**Sub-endpoints**:
- `GET /core-api/products` - List all products
- `POST /core-api/products` - Create product
- `PUT /core-api/products/:id` - Update product
- `DELETE /core-api/products/:id` - Delete product
- `POST /core-api/orders` - Create order
- `GET /core-api/inventory` - Check inventory levels

---

### 2️⃣ SaaS Dashboard
**Endpoint**: `/saas-dashboard`  
**Methods**: GET, POST  
**Purpose**: Analytics, user metrics, revenue reporting

**Sub-endpoints**:
- `GET /saas-dashboard/metrics` - Overall metrics
- `GET /saas-dashboard/revenue` - Revenue breakdown
- `GET /saas-dashboard/users` - User statistics
- `POST /saas-dashboard/reports` - Generate custom reports

---

### 3️⃣ Affiliate Network
**Endpoint**: `/affiliate-network`  
**Methods**: GET, POST, PUT  
**Purpose**: Track affiliates, commissions, referral links

**Sub-endpoints**:
- `POST /affiliate-network/create-link` - Generate affiliate link
- `GET /affiliate-network/commissions` - View earned commissions
- `GET /affiliate-network/referrals` - Track referrals
- `PUT /affiliate-network/settings` - Update affiliate settings

---

### 4️⃣ Shopify Integration
**Endpoint**: `/shopify-integration`  
**Methods**: POST, GET  
**Purpose**: Two-way Shopify sync, webhooks, app embed

**Sub-endpoints**:
- `POST /shopify-integration/sync-products` - Sync product catalog
- `POST /shopify-integration/webhooks` - Register webhooks
- `GET /shopify-integration/status` - Check sync status

---

### 5️⃣ GoDaddy Sync
**Endpoint**: `/godaddy-sync`  
**Methods**: GET, POST, PUT  
**Purpose**: Domain registration, DNS, hosting sync

**Sub-endpoints**:
- `GET /godaddy-sync/domains` - List reseller domains
- `POST /godaddy-sync/register` - Register new domain
- `GET /godaddy-sync/pricing` - Get current pricing

---

### 6️⃣ OneCommerce Manager
**Endpoint**: `/onecommerce-manager`  
**Methods**: GET, POST, PUT, DELETE  
**Purpose**: Manage all 1commercesolutions.shop settings, users, stores

**Sub-endpoints**:
- `GET /onecommerce-manager/stores` - List managed stores
- `POST /onecommerce-manager/stores` - Create new store
- `PUT /onecommerce-manager/settings` - Update store settings

---

### 7️⃣ Affiliate Code Generator
**Endpoint**: `/affiliate-codes`  
**Methods**: POST, GET  
**Purpose**: Create unique discount codes, track usage

**Sub-endpoints**:
- `POST /affiliate-codes/generate` - Generate new code
- `GET /affiliate-codes/active` - List active codes
- `GET /affiliate-codes/:code/analytics` - Track code usage

---

### 8️⃣ White-Label Hosting Platform
**Endpoint**: `/white-label-hosting`  
**Methods**: GET, POST, PUT  
**Purpose**: Reseller dashboard, instance management

**Sub-endpoints**:
- `GET /white-label-hosting/instances` - List hosted instances
- `POST /white-label-hosting/deploy` - Deploy new instance
- `GET /white-label-hosting/pricing` - Show pricing tiers

---

### 9️⃣ CDN Optimization
**Endpoint**: `/cdn-optimization`  
**Methods**: GET, POST  
**Purpose**: Image serving, caching, performance

**Sub-endpoints**:
- `GET /cdn-optimization/image` - Serve optimized image
- `POST /cdn-optimization/cache-clear` - Clear cache
- `GET /cdn-optimization/stats` - View CDN metrics

---

### 🔟 Analytics Engine
**Endpoint**: `/analytics-engine`  
**Methods**: POST, GET  
**Purpose**: Track events, conversions, user behavior

**Sub-endpoints**:
- `POST /analytics-engine/track` - Log event
- `GET /analytics-engine/events` - Retrieve events
- `GET /analytics-engine/conversions` - Get conversion data

---

### 1️⃣1️⃣ Package Deals
**Endpoint**: `/package-deals`  
**Methods**: GET, POST  
**Purpose**: Bundle products, wholesale pricing, volume discounts

**Sub-endpoints**:
- `GET /package-deals/available` - List available bundles
- `POST /package-deals/create` - Create new bundle
- `GET /package-deals/pricing` - Tiered pricing

---

### 1️⃣2️⃣ Mobile App Backend
**Endpoint**: `/mobile-app`  
**Methods**: GET, POST, PUT  
**Purpose**: REST API for iOS/Android, push notifications

**Sub-endpoints**:
- `POST /mobile-app/auth` - Mobile authentication
- `POST /mobile-app/push-notify` - Send push notifications
- `GET /mobile-app/config` - App configuration

---

### 1️⃣3️⃣ Payment Processor
**Endpoint**: `/payment-processor`  
**Methods**: POST, GET  
**Purpose**: Stripe, PayPal, crypto payments integration

**Sub-endpoints**:
- `POST /payment-processor/charge` - Process payment
- `POST /payment-processor/webhook` - Payment webhook
- `GET /payment-processor/status` - Check payment status

---

### 1️⃣4️⃣ Support Platform
**Endpoint**: `/support-platform`  
**Methods**: POST, GET  
**Purpose**: Tickets, live chat, knowledge base

**Sub-endpoints**:
- `POST /support-platform/tickets` - Create support ticket
- `GET /support-platform/kb` - Knowledge base articles
- `POST /support-platform/chat` - Send chat message

---

### 1️⃣5️⃣ Email Automation
**Endpoint**: `/email-automation`  
**Methods**: POST, GET  
**Purpose**: Welcome flows, order confirmations, recovery

**Sub-endpoints**:
- `POST /email-automation/trigger` - Trigger email workflow
- `POST /email-automation/subscribe` - Add to list
- `GET /email-automation/templates` - Available templates

---

### 1️⃣6️⃣ Marketplace
**Endpoint**: `/marketplace`  
**Methods**: GET, POST, PUT  
**Purpose**: Third-party integrations, app store

**Sub-endpoints**:
- `GET /marketplace/apps` - List available apps
- `POST /marketplace/install` - Install app
- `GET /marketplace/extensions` - Available extensions

---

### 1️⃣7️⃣ Consulting Services
**Endpoint**: `/consulting-services`  
**Methods**: GET, POST  
**Purpose**: Book consultants, manage bookings

**Sub-endpoints**:
- `GET /consulting-services/consultants` - List available consultants
- `GET /consulting-services/available-slots` - Check availability
- `POST /consulting-services/book` - Book consultation

---

### 1️⃣8️⃣ Training Academy
**Endpoint**: `/training-academy`  
**Methods**: GET, POST  
**Purpose**: Course management, progress tracking

**Sub-endpoints**:
- `GET /training-academy/courses` - List courses
- `GET /training-academy/progress` - User progress
- `POST /training-academy/enroll` - Enroll in course

---

### 1️⃣9️⃣ Enterprise Tier
**Endpoint**: `/enterprise-tier`  
**Methods**: GET, POST, PUT  
**Purpose**: SLA agreements, dedicated support, custom features

**Sub-endpoints**:
- `GET /enterprise-tier/sla` - SLA details
- `POST /enterprise-tier/upgrade` - Upgrade to enterprise
- `GET /enterprise-tier/features` - Enterprise features

---

## ⚙️ Environment Configuration

Create `.env.local` in theme root (NOT committed to Git):

```env
# Backend API Configuration
BACKEND_API_BASE_URL=https://api.1commercesolutions.shop/v1
BACKEND_API_STAGING_URL=https://staging-api.1commercesolutions.shop/v1
BACKEND_ENVIRONMENT=production

# API Authentication
BACKEND_API_KEY=sk_live_xxxxxxxxxxxxx
BACKEND_API_SECRET=sk_secret_xxxxxxxxxxxxx

# Analytics
ANALYTICS_TRACKING_ID=ua_xxxxxxxxxxxxx

# Feature Flags
ENABLE_AFFILIATE_NETWORK=true
ENABLE_WHITE_LABEL_HOSTING=true
ENABLE_MOBILE_APP=true
ENABLE_CONSULTING=true
ENABLE_ACADEMY=true
```

---

## 🔐 Security Best Practices

### API Key Storage
- Store keys in GitHub Secrets, NOT in code
- Rotate keys quarterly
- Use service account credentials for automation

### CORS Configuration
Backend should allow:
```
Access-Control-Allow-Origin: https://1commercesolutions.shop
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key
```

### Rate Limiting
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1674345600
```

---

## 🧪 Testing Backend Connectivity

### Health Check (Always Available)
```bash
curl https://api.1commercesolutions.shop/v1/health
# Response:
# { "status": "healthy", "timestamp": "2026-01-21T06:14:00Z" }
```

### Test Core API
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.1commercesolutions.shop/v1/core-api/products
```

### Test Analytics
```bash
curl -X POST https://api.1commercesolutions.shop/v1/analytics-engine/track \
  -H "Content-Type: application/json" \
  -d '{"event":"page_view","timestamp":"2026-01-21T06:14:00Z"}'
```

---

## 📚 Ready-to-Extend Liquid Sections

These sections are pre-built to accept backend endpoints:

1. **hero.liquid** → Connect to `/saas-dashboard/banners`
2. **product-display.liquid** → Connect to `/core-api/products`
3. **footer.liquid** → Add affiliate links from `/affiliate-network`
4. **newsletter.liquid** → Connect to `/email-automation/subscribe`
5. **booking.liquid** → Connect to `/consulting-services/book`

Each section has comments showing WHERE to add API calls.

---

## 🔄 Webhooks Ready to Implement

When backend is live, add these webhooks to your Cloud Run service:

```json
{
  "webhooks": [
    {
      "topic": "product/created",
      "endpoint": "/v1/core-api/webhooks/product-created"
    },
    {
      "topic": "product/updated",
      "endpoint": "/v1/core-api/webhooks/product-updated"
    },
    {
      "topic": "order/created",
      "endpoint": "/v1/core-api/webhooks/order-created"
    },
    {
      "topic": "order/paid",
      "endpoint": "/v1/payment-processor/webhooks/payment-received"
    }
  ]
}
```

---

## ✅ Pre-Launch Checklist

- [ ] Cloud Run API deployed and running
- [ ] PostgreSQL database initialized
- [ ] Firestore collections created
- [ ] API keys generated and in GitHub Secrets
- [ ] CORS headers configured
- [ ] Rate limiting enabled
- [ ] SSL/TLS certificates installed
- [ ] Health check passing
- [ ] All 19 endpoints tested
- [ ] Staging environment ready for QA
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented

---

**Last Updated**: January 21, 2026  
**Maintained By**: PNW Enterprises Development Team  
**Status**: ✅ Framework Ready | ⏳ Awaiting Cloud Run Deployment