# Deployment & Uptime Quick Reference

**For**: Production deployments with automatic health monitoring  
**Last Updated**: January 26, 2026

---

## 🚀 GitHub Codespaces Available!

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/ksksrbiz-arch/unify-one-shopify-theme)

Get a fully configured cloud development environment in seconds! → [Full Guide](./CODESPACES_SETUP.md)

---

## 🚀 Quick Deploy Workflow

### 1. Staging Deployment (Automatic)
```bash
# Make changes to theme files
git add .
git commit -m "Your change description"
git push origin main
```

**What happens:**
- ✅ Automatic deployment to staging
- ✅ Lighthouse performance checks
- ✅ Liquid/CSS/JS validation
- ⏱️ Ready for QA in ~2-3 minutes

---

### 2. Production Deployment (Tag-based)
```bash
# After QA approval
git tag v1.0.x -m "Release notes"
git push origin v1.0.x
```

**What happens:**
- ✅ Strict validation
- ✅ Deploy to production
- ✅ **Automatic health check (new!)**
  - Verifies homepage (HTTP 200)
  - Verifies CSS asset loading
  - Verifies JS asset loading
  - 30-second wait for CDN propagation
- ✅ GitHub Release created
- 🔔 Slack notification (if configured)

**Deployment fails if health check fails** ❌

---

## 🔍 Continuous Uptime Monitoring

### Automatic Health Checks
**Every 15 minutes**, the system checks:

| Endpoint | What's Checked |
|----------|----------------|
| Homepage | HTTP 200, response time |
| CSS Assets | Files accessible |
| JS Assets | Files accessible |
| Product Pages | Pages loading |
| Cart | Checkout accessible |

### When Issues Are Detected

**Automatic Response:**
1. 🚨 GitHub issue created (labels: `incident`, `uptime`, `critical`)
2. 🔔 Slack alert sent (if configured)
3. 📊 Detailed logs in GitHub Actions

**View monitoring status:**
- GitHub → Actions → "Production Uptime Monitoring"
- README badges show latest status

---

## 🚨 If Deployment Health Check Fails

### What You'll See
```
❌ Deployment verification failed!
Homepage: 500, CSS: 404, JS: 200
```

### Immediate Actions
1. **Check the workflow logs**
   - Actions → Deploy to Production → Latest run
   - Review the "Verify deployment health" step

2. **Verify store manually**
   - Visit https://1commerce.shop
   - Open browser console for errors
   - Check network tab for failed assets

3. **Common causes & fixes:**

   **CSS/JS 404 errors:**
   - Theme push didn't complete
   - Asset references broken
   - → Rollback or re-push

   **Homepage 500 error:**
   - Liquid template syntax error
   - → Check Shopify theme editor logs
   - → Review recent template changes

   **Slow response (timeout):**
   - CDN propagation delay
   - → Wait 60 seconds and check again
   - → May need to manually verify

---

## 📊 Monitoring Dashboard

### View Real-Time Status
```
Repository → Actions → Uptime Monitoring
```

**Each run shows:**
- ✅/❌ Status of each health check
- ⏱️ Response times
- 🕐 Check timestamp

### Open Incidents
```
Repository → Issues → Filter: label:incident
```

**Incident includes:**
- Failed check details
- Recommended actions
- Link to workflow run

---

## 🛠️ Manual Health Check

**Trigger immediate check:**
```bash
# Via GitHub CLI
gh workflow run uptime-monitoring.yml

# Or: Actions → Uptime Monitoring → Run workflow
```

**Use when:**
- After manual store configuration
- Testing monitoring system
- Investigating reported issues

---

## 🔐 Required Secrets

Make sure these are configured:

| Secret | Purpose |
|--------|---------|
| `SHOPIFY_THEME_TOKEN` | API access |
| `SHOPIFY_PRODUCTION_THEME_ID` | Production theme |
| `SHOPIFY_STAGING_THEME_ID` | Staging theme |
| `SLACK_WEBHOOK` | Notifications (optional) |

**Location**: Settings → Secrets and variables → Actions

---

## 📈 Uptime SLA Targets

| Metric | Target |
|--------|--------|
| Uptime | 99.9% |
| Response Time | < 3 seconds |
| Health Check Frequency | Every 15 min |
| Incident Response | < 15 min |

---

## 📞 Getting Help

**Production down?**
- Slack: #critical
- Tag: @on-call

**Questions about monitoring?**
- See: [UPTIME_MONITORING.md](./UPTIME_MONITORING.md)
- Slack: #dev-team

**Workflow issues?**
- Check: Actions tab for error logs
- Review: Recent commits

---

## 🎯 Best Practices

### Before Every Deployment
- [ ] Test on staging first
- [ ] Review Lighthouse reports
- [ ] Check for Liquid errors: `npm run lint`
- [ ] Ensure QA approval

### After Deployment
- [ ] Wait 2-3 minutes for CDN
- [ ] Check deployment verification passed
- [ ] Monitor first health check (within 15 min)
- [ ] Verify manually if critical changes

### If Issues Occur
- [ ] Check workflow logs first
- [ ] Review recent commits
- [ ] Consider rollback if critical
- [ ] Document in incident issue

---

**See also:**
- [UPTIME_MONITORING.md](./UPTIME_MONITORING.md) - Full monitoring guide
- [README.md](./README.md) - Repository overview
- [SETUP.md](./SETUP.md) - Development setup
