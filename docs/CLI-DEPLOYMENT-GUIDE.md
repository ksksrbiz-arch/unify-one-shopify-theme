# CLI Deployment Guide - PowerShell/Command Prompt

**Last Updated:** January 21, 2026  
**Theme:** UnifyOne Shopify Theme  
**Store:** 1commerce.shop

---

## 🚀 Quick Reference

### Deploy to Staging (Develop Branch)
```powershell
git add .
git commit -m "Update theme: [describe changes]"
git push origin develop
```

### Deploy to Production (Create Tag)
```powershell
git tag v1.0.1 -m "Release: [describe changes]"
git push origin v1.0.1
```

### Check Deployment Status
```powershell
git log --oneline -10
```

---

## 📋 Prerequisites

### 1. Install Required Tools

**Node.js 18+**
```powershell
# Check if installed
node --version

# If not, download from https://nodejs.org/
```

**Shopify CLI**
```powershell
npm install -g @shopify/cli @shopify/theme

# Verify installation
shopify version
```

**Git**
```powershell
# Check if installed
git --version

# If not, download from https://git-scm.com/
```

### 2. Configure Git

```powershell
# Set your Git user
git config --global user.name "Your Name"
git config --global user.email "your.email@pnwenterprises.com"

# Verify configuration
git config --global user.name
git config --global user.email
```

### 3. Clone the Repository

```powershell
# Navigate to your projects folder
cd C:\Users\YourUsername\Projects

# Clone the repository
git clone https://github.com/ksksrbiz-arch/unify-one-shopify-theme.git

# Enter the directory
cd unify-one-shopify-theme

# Install dependencies
npm install
```

---

## 🔐 GitHub Authentication

### Option 1: Personal Access Token (Recommended)

1. **Generate token:**
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `workflow`, `read:org`
   - Copy the token (save it somewhere safe!)

2. **Configure Git to use token:**
   ```powershell
   git config --global credential.helper wincred
   ```

3. **First push will prompt for credentials:**
   - Username: Your GitHub username
   - Password: Paste your personal access token

### Option 2: SSH Key (Advanced)

```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@pnwenterprises.com"

# When prompted, press Enter (default location)
# Set a passphrase (recommended)

# Add key to GitHub:
# 1. Go to GitHub → Settings → SSH and GPG keys
# 2. Click "New SSH key"
# 3. Copy contents of C:\Users\YourUsername\.ssh\id_ed25519.pub
# 4. Paste into GitHub

# Test connection
ssh -T git@github.com
```

---

## 📝 Common Workflows

### Workflow 1: Make a Small Update & Deploy to Staging

```powershell
# 1. Update a file (e.g., edit CSS)
# Open: assets/custom-styles.css
# Make your changes and save

# 2. Check what changed
git status

# Output should show modified files:
# modified:   assets/custom-styles.css

# 3. Add changes to staging area
git add .

# 4. Create a commit with a descriptive message
git commit -m "Update theme: improve button styles and spacing"

# 5. Push to develop branch (auto-deploys to staging)
git push origin develop

# 6. Watch GitHub Actions
# Visit: https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions
```

### Workflow 2: Add a New Section & Deploy to Staging

```powershell
# 1. Create new section file
new-item -Path "sections\testimonials.liquid" -ItemType File

# 2. Edit the file (add Liquid code)
# (Open in your editor, add content)

# 3. Check status
git status

# Output:
# Untracked files:
#   sections/testimonials.liquid

# 4. Add and commit
git add sections/testimonials.liquid
git commit -m "Add testimonials section with JSON schema"

# 5. Deploy
git push origin develop

# 6. Test in staging before production
```

### Workflow 3: Create Production Release

```powershell
# 1. Ensure everything is tested on staging
# Check: https://1commerce.shop (preview staging theme)
# Check: GitHub Actions for Lighthouse CI results

# 2. Create a version tag
git tag v1.0.1 -m "Release: Add testimonials section, improve button styles"

# 3. Push the tag to GitHub
git push origin v1.0.1

# 4. GitHub Actions automatically deploys to production
# Monitor: https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions

# 5. Verify production deployment
# Visit: https://1commerce.shop (live store)
```

### Workflow 4: Fix a Bug in Production

```powershell
# 1. Create a feature branch (not direct to develop)
git checkout -b bugfix/fix-cart-button

# 2. Make your fix
# Edit the file with the bug, test locally

# 3. Add and commit
git add .
git commit -m "Fix: Cart button not appearing on mobile"

# 4. Push feature branch
git push origin bugfix/fix-cart-button

# 5. Create Pull Request on GitHub
# GitHub will prompt you, or visit:
# https://github.com/ksksrbiz-arch/unify-one-shopify-theme/pull/new/bugfix/fix-cart-button

# 6. Once approved, merge to develop
git checkout develop
git merge bugfix/fix-cart-button
git push origin develop

# 7. After staging verification, release to production
git tag v1.0.2 -m "Fix: Cart button mobile display"
git push origin v1.0.2
```

---

## 🔍 Useful Commands Reference

### View Changes
```powershell
# Show modified files
git status

# Show differences in files
git diff

# Show only file names that changed
git diff --name-only

# Show last 10 commits
git log --oneline -10

# Show commits by specific person
git log --author="Keith skaggs" --oneline
```

### Undo Changes
```powershell
# Discard changes in a file (careful!)
git checkout -- assets/custom-styles.css

# Undo the last commit (keep changes)
git reset --soft HEAD~1

# Undo the last commit (discard changes)
git reset --hard HEAD~1

# Remove file from staging but keep changes
git reset HEAD assets/custom-styles.css
```

### Branch Management
```powershell
# List all branches
git branch -a

# Create new branch
git checkout -b feature/new-feature

# Switch to existing branch
git checkout develop

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

### Tag Management
```powershell
# List all tags
git tag

# Create annotated tag (recommended)
git tag v1.0.2 -m "Release version 1.0.2"

# Create lightweight tag
git tag v1.0.2

# Push specific tag
git push origin v1.0.2

# Push all tags
git push origin --tags

# Delete local tag
git tag -d v1.0.2

# Delete remote tag
git push origin --delete v1.0.2
```

### Syncing with Remote
```powershell
# Fetch latest from remote (no merge)
git fetch origin

# Pull latest from remote branch (fetch + merge)
git pull origin develop

# Push your commits to remote
git push origin develop

# Sync fork with upstream
git fetch upstream
git rebase upstream/main
```

### Advanced Git Commands

#### Stash (Temporarily Save Work)
```powershell
# Save current changes without committing
git stash save "Work in progress on product section"

# List all stashes
git stash list

# Apply latest stash and remove it
git stash pop

# Apply latest stash but keep it
git stash apply

# Drop a specific stash
git stash drop stash@{0}
```

**Use case:** You're editing theme files but need to urgently switch to fix a bug.

#### Cherry-pick (Apply Specific Commits)
```powershell
# Find the commit you need
git log --oneline features/bug-fix

# Apply that commit to current branch
git cherry-pick a1b2c3d

# Cherry-pick multiple commits
git cherry-pick commit1 commit2 commit3

# Cherry-pick without auto-commit
git cherry-pick -n a1b2c3d
```

**Use case:** Apply a critical bug fix from a feature branch to production without merging the entire feature.

#### Rebase (Keep Branch Updated)
```powershell
# Update feature branch with latest from develop
git checkout features/newsletter
git rebase develop

# Resolve conflicts if they occur
# Edit conflicting files, then:
git add .
git rebase --continue

# Or abort the rebase
git rebase --abort
```

**Use case:** Keep your feature branch synchronized with team changes before creating a PR.

#### Reflog (Recover Lost Commits)
```powershell
# View all recent Git actions
git reflog

# Checkout a lost commit
git checkout abc123

# Create branch from lost commit
git branch recover-work abc123
```

**Use case:** Accidentally deleted commits or reset too far - recover your work.

#### Interactive Rebase (Clean History)
```powershell
# Rebase last 5 commits interactively
git rebase -i HEAD~5

# In editor:
# - Change 'pick' to 'squash' to combine commits
# - Change 'pick' to 'edit' to modify commit
# - Reorder lines to reorder commits
# Save and exit

# After squashing, edit commit message
# Save and exit
```

**Use case:** Clean up multiple small commits into logical commits before creating PR.

#### Clean (Remove Untracked Files)
```powershell
# Preview what will be deleted
git clean -n

# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd

# Include ignored files (be careful!)
git clean -fdx
```

**Use case:** Remove temporary test files or reset working directory to clean state.

**📚 Complete Guide:** See [docs/GIT_WORKFLOW.md](../docs/GIT_WORKFLOW.md) for comprehensive examples and workflows.

---

## 🚨 Troubleshooting

### Issue: "fatal: not a git repository"

```powershell
# You're not in the project directory
cd C:\path\to\unify-one-shopify-theme

# Verify you're in correct directory
ls -la .git
```

### Issue: "Permission denied (publickey)"

```powershell
# SSH key not configured properly
# Use HTTPS instead:
git remote set-url origin https://github.com/ksksrbiz-arch/unify-one-shopify-theme.git

# Then use personal access token for authentication
```

### Issue: "Please tell me who you are" error

```powershell
# Configure git user
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Retry your command
```

### Issue: Changes not showing in GitHub

```powershell
# Verify remote is configured
git remote -v

# Output should show:
# origin  https://github.com/ksksrbiz-arch/unify-one-shopify-theme.git

# If empty, add remote:
git remote add origin https://github.com/ksksrbiz-arch/unify-one-shopify-theme.git

# Try push again
git push origin develop
```

### Issue: "rejected - non-fast-forward"

```powershell
# Someone pushed changes before you
# Pull their changes first
git pull origin develop

# Resolve any merge conflicts (they'll be marked in files)
# Then try pushing again
git push origin develop
```

---

## 🎯 Deployment Command Cheat Sheet

### Minimal Commands (Copy & Paste)

**For staging deployment:**
```powershell
git add . && git commit -m "Update: [your message]" && git push origin develop
```

**For production release:**
```powershell
git tag v1.0.1 -m "Release: [your message]" && git push origin v1.0.1
```

**Check status:**
```powershell
git status && git log --oneline -5
```

---

## 📊 Monitoring Deployments

### Via CLI

```powershell
# Watch GitHub Actions workflow (requires GitHub CLI)
# Install: https://cli.github.com/

gh workflow list
gh run list
gh run view [run-id]
```

### Via Browser

1. **Actions tab:** https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions
2. **Latest run** shows:
   - Deployment status ✅ or ❌
   - Lighthouse CI results
   - Any errors or warnings

---

## 🔄 Pulling Latest Changes

```powershell
# Before starting work, sync with team
git fetch origin
git pull origin develop

# Now you have the latest code
```

---

## 📚 Learning Resources

- **Git Basics:** https://git-scm.com/book/en/v2
- **GitHub Docs:** https://docs.github.com/
- **Shopify CLI:** https://shopify.dev/themes/tools/cli
- **Markdown Guide:** https://www.markdownguide.org/

---

## ✅ Safety Checklist

Before pushing to production:

- [ ] Code tested locally with `npm run dev`
- [ ] Changes reviewed on staging at https://1commerce.shop
- [ ] Lighthouse CI passed (check Actions tab)
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive tested
- [ ] Accessibility tested (keyboard navigation)
- [ ] Team reviewed changes
- [ ] Commit message is clear and descriptive

---

## 🎓 Examples by Scenario

### Scenario 1: Update CSS Colors

```powershell
# 1. Open assets/custom-styles.css in editor
# 2. Update :root color variables
# 3. Save file

# 4. In PowerShell:
cd C:\path\to\unify-one-shopify-theme
git add assets/custom-styles.css
git commit -m "Update: improve color contrast for accessibility"
git push origin develop

# 5. Check: https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions
```

### Scenario 2: Add New JavaScript Function

```powershell
# 1. Open assets/theme.js
# 2. Add your function
# 3. Save file

# 4. In PowerShell:
cd C:\path\to\unify-one-shopify-theme
git add assets/theme.js
git commit -m "Add: cart notification function"
git push origin develop

# 5. Verify in staging, then release:
git tag v1.0.3 -m "Add: cart notifications"
git push origin v1.0.3
```

### Scenario 3: Create New Section

```powershell
# 1. Create file: sections/video-hero.liquid
# 2. Add HTML and JSON schema
# 3. Save file

# 4. In PowerShell:
cd C:\path\to\unify-one-shopify-theme
git add sections/video-hero.liquid
git commit -m "Add: video hero section with Shopify admin customization"
git push origin develop

# 5. After QA approval:
git tag v1.0.4 -m "Add: video hero section"
git push origin v1.0.4
```

---

**Maintained by:** PNW Enterprises Development Team  
**Last Review:** January 21, 2026  
**Next Review:** February 21, 2026
