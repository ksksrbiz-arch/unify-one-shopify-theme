# Production Uptime Monitoring & Incident Response Guide

**Store**: https://1commercesolutions.shop  
**Repository**: github.com/ksksrbiz-arch/unify-one-shopify-theme  
**Last Updated**: January 26, 2026

---

## 📊 Overview

This document describes the production uptime monitoring system for the UnifyOne Shopify theme. The system ensures constant availability and rapid incident response for the production environment.

---

## 🔍 Automated Health Monitoring

### Health Check Schedule
- **Frequency**: Every 15 minutes (24/7)
- **Workflow**: `.github/workflows/uptime-monitoring.yml`
- **Trigger**: Automated cron schedule + manual dispatch

### Monitored Endpoints

| Endpoint | Check Type | Success Criteria | Impact |
|----------|------------|------------------|--------|
| `https://1commercesolutions.shop/` | Homepage | HTTP 2xx/3xx (follows redirects), < 3s response | Critical |
| `https://1commercesolutions.shop/assets/custom-styles.css` | CSS Asset | HTTP 2xx/3xx (follows redirects, or fallback paths) | High |
| `https://1commercesolutions.shop/assets/theme.js` | JS Asset | HTTP 2xx/3xx (follows redirects, or fallback paths) | High |
| `https://1commercesolutions.shop/products` | Product Pages | HTTP 2xx/3xx/4xx (follows redirects; any client error such as 404 is acceptable) | High |
| `https://1commercesolutions.shop/cart` | Cart Functionality | HTTP 2xx/3xx (follows redirects) | Critical |

**Note**: The monitoring system follows HTTP redirects (301/302) and treats them as successful responses, as they indicate the site is operational and properly configured for redirects (e.g., HTTPS enforcement, www subdomain redirection, or custom domain setup).

### Health Status Levels

- **✅ Healthy**: All checks passing (0 failures)
- **⚠️ Degraded**: 1 check failing
- **🚨 Critical**: 2+ checks failing

---

## 🚨 Incident Response

### Automatic Incident Creation

When health checks fail, the system automatically:

1. **Creates GitHub Issue**
   - Label: `incident`, `uptime`, `critical`
   - Contains: Failed check details, timestamps, recommended actions
   - Only creates if no open incident exists

2. **Sends Slack Notification** (if configured)
   - Channel: Configured via `SLACK_WEBHOOK` secret
   - Contains: Health status, failed checks, direct link to store

3. **Logs Details**
   - All health check results logged in workflow run
   - Accessible via GitHub Actions → Uptime Monitoring

### Manual Health Check

Trigger immediate health check:
```bash
# Via GitHub UI
Actions → Uptime Monitoring → Run workflow

# Via GitHub CLI
gh workflow run uptime-monitoring.yml
```

---

## 🔧 Deployment Verification

### Post-Deployment Health Checks

Every production deployment automatically verifies:

1. **Homepage Accessibility** (HTTP 200)
2. **CSS Asset Loading** (HTTP 200)
3. **JS Asset Loading** (HTTP 200)

**Wait Time**: 30 seconds after deployment (for CDN propagation)

**Failure Action**: Deployment marked as failed, team notified

### Deployment Workflow
- **File**: `.github/workflows/deploy-production.yml`
- **Trigger**: Git tag push (`v*`)
- **Verification**: Built-in health check after deployment

---

## 📈 Monitoring Dashboard

### View Uptime Status

1. **GitHub Actions Dashboard**
   ```
   Repository → Actions → Uptime Monitoring
   ```
   - View latest health check results
   - Review historical check data
   - See failure patterns

2. **Recent Deployments**
   ```
   Repository → Actions → Deploy to Production
   ```
   - View deployment verification results
   - Check deployment success rate

3. **Open Incidents**
   ```
   Repository → Issues → Labels: incident, uptime
   ```
   - Active production incidents
   - Incident history and resolution

---

## 🛠️ Troubleshooting Guide

### Common Issues and Solutions

#### Issue: HTTP 301/302 Redirects Reported as Failures

**Likely Causes**:
- Store configured with custom domain that redirects
- HTTPS enforcement causing redirects
- www subdomain redirection
- Shopify domain configuration changes

**Solution**:
- As of the latest update, the monitoring system automatically follows redirects and treats them as successful responses
- HTTP 301/302 redirects are now considered valid, as they indicate the site is operational
- Alerts are triggered for connection failures and for any 4xx/5xx responses on homepage, cart, and asset checks; product page checks currently treat all 4xx responses as successful and alert only on non-2xx/3xx statuses

#### Issue: All Health Checks Failing

**Likely Causes**:
- Shopify platform outage
- Store temporarily offline
- DNS/CDN issues

**Actions**:
1. Check Shopify status: https://status.shopify.com/
2. Verify store admin access: https://1commercesolutions.myshopify.com/admin
3. Check DNS resolution: `nslookup 1commercesolutions.shop`
4. Contact Shopify support if platform issue

#### Issue: Asset Checks Failing

**Likely Causes**:
- Recent deployment broke asset references
- CDN cache issue
- Theme file corruption

**Actions**:
1. Review recent deployments in Actions tab
2. Check theme files in Shopify admin
3. Clear CDN cache (Shopify admin → Online Store → Themes)
4. Consider rollback to previous theme version

#### Issue: Single Page Failing

**Likely Causes**:
- Template error in specific liquid file
- Product/collection data issue
- App conflict

**Actions**:
1. Check specific page in browser (inspect console errors)
2. Review recent changes to affected template
3. Test in Shopify theme editor
4. Disable recently installed apps one-by-one

#### Issue: Slow Response Times

**Likely Causes**:
- High traffic volume
- Unoptimized assets
- Third-party script delays

**Actions**:
1. Check Lighthouse CI reports in recent workflows
2. Review performance monitoring workflow results
3. Optimize large images/assets
4. Review and remove unnecessary third-party scripts

---

## 🔐 Required GitHub Secrets

Ensure these secrets are configured for uptime monitoring:

| Secret | Purpose | Required |
|--------|---------|----------|
| `SHOPIFY_STORE_NAME` | Store domain | Yes |
| `SHOPIFY_THEME_TOKEN` | API authentication | Yes |
| `SHOPIFY_PRODUCTION_THEME_ID` | Production theme ID | Yes |
| `SLACK_WEBHOOK` | Incident notifications | Optional |

**Configure at**: Repository Settings → Secrets and variables → Actions

---

## 📞 Escalation Path

### Priority Levels

**P0 - Critical** (All services down)
- **Response Time**: Immediate
- **Escalation**: On-call engineer via Slack #critical
- **Action**: Immediate investigation and rollback if needed

**P1 - High** (Major functionality impaired)
- **Response Time**: 15 minutes
- **Escalation**: Dev team via Slack #dev-alerts
- **Action**: Investigation within 30 minutes

**P2 - Medium** (Minor functionality impaired)
- **Response Time**: 1 hour
- **Escalation**: Dev team Slack
- **Action**: Fix in next deployment cycle

**P3 - Low** (Degraded performance)
- **Response Time**: Next business day
- **Escalation**: Via GitHub issue
- **Action**: Schedule for upcoming sprint

### Contact Information

- **Production Issues**: Slack #critical
- **Dev Team**: Slack #dev-team
- **On-Call Engineer**: Slack @on-call
- **GitHub Issues**: Tag @dev-lead

---

## 📝 Incident Response Checklist

When an incident occurs:

- [ ] **Assess Severity**
  - Review failed health checks
  - Determine impact scope
  - Assign priority level

- [ ] **Immediate Actions**
  - Check Shopify platform status
  - Verify store is accessible manually
  - Review recent deployments

- [ ] **Investigation**
  - Check workflow logs for errors
  - Review recent code changes
  - Test affected functionality

- [ ] **Resolution**
  - Apply fix or rollback
  - Verify health checks pass
  - Monitor for 30 minutes

- [ ] **Post-Incident**
  - Document root cause in GitHub issue
  - Update monitoring if needed
  - Share learnings with team
  - Close incident issue

---

## 🔄 Maintenance Windows

### Scheduled Maintenance
- **Frequency**: Quarterly
- **Duration**: 1-2 hours
- **Notification**: 1 week advance notice
- **Communication**: Email to stakeholders, Slack announcement

### Emergency Maintenance
- **Trigger**: Critical security patch or major incident
- **Notification**: Immediate via Slack
- **Status Updates**: Every 30 minutes during incident

---

## 📊 Uptime SLA

### Target Metrics
- **Uptime**: 99.9% (< 43 minutes downtime/month)
- **Response Time**: < 3 seconds (median)
- **Incident Response**: < 15 minutes (P0/P1)
- **Mean Time to Recovery**: < 2 hours

### Monitoring Frequency
- **Health Checks**: Every 15 minutes
- **Performance Checks**: Every deployment
- **Manual Audits**: Monthly

---

## 🎯 Best Practices

### For Developers

1. **Always test locally before deploying**
   ```bash
   npm run dev
   npm run lint
   ```

2. **Use staging environment first**
   - Push to `main` branch triggers staging deploy
   - Test thoroughly on staging
   - Only tag for production after QA approval

3. **Monitor post-deployment**
   - Watch deployment verification results
   - Check first health check after deploy
   - Keep Slack notifications enabled

4. **Write clear commit messages**
   - Helps during incident investigation
   - Include ticket/issue references

### For DevOps

1. **Review health check logs weekly**
   - Identify patterns or degradation
   - Proactive issue detection

2. **Test incident response quarterly**
   - Verify notification systems work
   - Practice rollback procedures

3. **Keep secrets updated**
   - Rotate API tokens regularly
   - Test after secret updates

4. **Monitor Shopify platform status**
   - Subscribe to Shopify status updates
   - Plan around known maintenance windows

---

## 🔗 Related Documentation

- [README.md](./README.md) - Repository overview
- [SETUP.md](./SETUP.md) - Development setup
- [DEPLOYMENT_CHEATSHEET.md](./DEPLOYMENT_CHEATSHEET.md) - Deployment guide
- [Performance Workflows](./.github/workflows/performance-monitoring.yml) - Performance checks

---

## 📈 Changelog

### January 28, 2026
- 🔧 Updated monitoring to follow HTTP redirects (301/302)
- ✨ Redirects now treated as successful responses
- 📊 Improved resilience for domain configuration changes
- 🛡️ Better handling of HTTPS enforcement and www subdomain redirects

### January 26, 2026
- ✨ Initial uptime monitoring system implemented
- 🚀 Automated health checks every 15 minutes
- 🚨 Automatic incident creation on failures
- ✅ Deployment verification added to production workflow
- 📚 Comprehensive incident response documentation

---

**Maintained By**: PNW Enterprises DevOps Team  
**Questions**: #dev-team Slack channel  
**Status Page**: [GitHub Actions - Uptime Monitoring](../../actions/workflows/uptime-monitoring.yml)
