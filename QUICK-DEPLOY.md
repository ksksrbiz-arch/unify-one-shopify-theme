# 🚀 Quick Deployment Reference

**Print this and keep it handy!**

---

## 📋 3-Step Staging Deploy

### PowerShell
```powershell
.\deploy-staging.ps1 "Your message here"
```

### Command Prompt
```cmd
deploy-staging.bat "Your message here"
```

### Manual (Git Commands)
```bash
git add .
git commit -m "Your message here"
git push origin develop
```

---

## 🚀 3-Step Production Deploy

### PowerShell
```powershell
.\deploy-production.ps1 -version 1.0.1 -message "Release: [description]"
```

### Command Prompt
```cmd
deploy-production.bat 1.0.1 "Release: [description]"
```

### Manual (Git Commands)
```bash
git tag v1.0.1 -m "Release: [description]"
git push origin v1.0.1
```

---

## 📄 Common Commit Messages

```
"Update: improve button styles"
"Add: testimonials section"
"Fix: cart button mobile display"
"Update: optimize hero image"
"Add: product reviews section"
"Fix: accessibility color contrast"
"Update: lighthouse performance optimization"
```

---

## 🔍 Check Status

```bash
# See what changed
git status

# See last 5 commits
git log --oneline -5

# See detailed changes
git diff
```

---

## 🔙 Undo Changes (If Needed)

```bash
# Discard all uncommitted changes
git checkout -- .

# Remove last commit (keep changes)
git reset --soft HEAD~1

# Remove last commit (discard changes) - CAREFUL!
git reset --hard HEAD~1
```

---

## 💬 Authentication Issues?

**PowerShell won't run scripts?**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**GitHub authentication error?**
1. Create Personal Access Token: https://github.com/settings/tokens
2. Copy the token
3. When prompted for password, paste the token

---

## 📀 File Locations

**CSS Styles:** `assets/custom-styles.css`  
**JavaScript:** `assets/theme.js`  
**Header Section:** `sections/header.liquid`  
**Footer Section:** `sections/footer.liquid`  
**Product Template:** `templates/product.liquid`  
**Theme Config:** `config/settings_schema.json`  

---

## 📊 After Deployment

### Check Staging (After git push)
```
1. Visit: https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions
2. Check latest run status
3. View Lighthouse CI results
4. Preview at: https://1commerce.shop
```

### Check Production (After git tag)
```
1. Visit: https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions
2. Verify production deployment completed
3. Check live store: https://1commerce.shop
4. Verify all changes visible
```

---

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|----------|
| Performance Score | ≥ 85/100 | ? |
| Accessibility Score | ≥ 90/100 | ? |
| Best Practices Score | ≥ 85/100 | ? |
| SEO Score | ≥ 90/100 | ? |
| LCP (Largest Contentful Paint) | < 2.5s | ? |
| FCP (First Contentful Paint) | < 2.0s | ? |
| CLS (Cumulative Layout Shift) | < 0.1 | ? |

Check full results: [Performance Monitoring Guide](./docs/PERFORMANCE-MONITORING.md)

---

## 🎄 Deployment Workflow

```
① Make changes to files
     ↑
② Stage changes (git add .)
     ↑
③ Commit changes (git commit -m "...")
     ↑
④ Push to develop (git push origin develop)
     ↑
⑤ Staging deployment auto-triggers
     ↑
⑥ GitHub Actions:
     - Validates Liquid
     - Deploys theme
     - Runs Lighthouse CI
     - Posts results
     ↑
⑦ Preview at https://1commerce.shop
     ↑
⑧ If approved, create tag (git tag v1.0.1 ...)
     ↑
⑨ Push tag (git push origin v1.0.1)
     ↑
⑩ Production deployment auto-triggers
     ↑
🌟 Live!
```

---

## 📃 Version Numbering

**Format:** `v[Major].[Minor].[Patch]`

```
v1.0.0  = First release
v1.0.1  = Bug fix
v1.1.0  = New feature
v2.0.0  = Major redesign
```

**Examples:**
```
v1.0.0  "Initial release"
v1.0.1  "Fix: cart button"
v1.1.0  "Add: testimonials section"
v1.1.1  "Fix: accessibility contrast"
v1.2.0  "Add: video hero section"
v2.0.0  "Major redesign with new layout"
```

---

## 📝 Useful Links

- **GitHub Repo:** https://github.com/ksksrbiz-arch/unify-one-shopify-theme
- **Store:** https://1commerce.shop
- **GitHub Actions:** https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions
- **Lighthouse Reports:** Check Actions tab for temporary public storage links
- **Shopify Admin:** https://1commerce.shop/admin

---

## 🎄 Need Help?

| Issue | Solution |
|-------|----------|
| PowerShell won't run script | `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Git not found | Install from https://git-scm.com/ |
| Shopify CLI not found | `npm install -g @shopify/cli @shopify/theme` |
| Not in git repo | `cd` to theme root directory |
| Push rejected | Run `git pull origin develop` first |
| Uncommitted changes | Run `git add . && git commit -m "..."` |
| Deployment failed | Check GitHub Actions logs for error |

---

**Last Updated:** January 21, 2026  
**Keep this handy for quick reference!** 📌
