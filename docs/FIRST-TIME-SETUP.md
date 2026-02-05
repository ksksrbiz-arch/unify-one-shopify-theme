# 🏹 First-Time CLI Setup Guide

**New to the project? Start here!** This guide walks you through setting up everything you need for the first time.

**Time Required:** 15-20 minutes  
**Difficulty:** Beginner-friendly  

---

## Step 1: Install Required Software

### Install Git

**Windows:**
1. Download from https://git-scm.com/
2. Run the installer (accept all defaults)
3. Restart your computer

**Verify installation:**
```cmd
git --version
```
Should output: `git version 2.x.x.windows.x`

### Install Node.js

**Windows:**
1. Download LTS version from https://nodejs.org/
2. Run the installer (accept all defaults)
3. Restart your computer

**Verify installation:**
```cmd
node --version
npm --version
```

### Install Shopify CLI

**PowerShell or Command Prompt:**
```cmd
npm install -g @shopify/cli @shopify/theme
```

**Verify installation:**
```cmd
shopify version
```

---

## Step 2: Configure Git

Tell Git who you are (required for commits):

```cmd
git config --global user.name "Your Full Name"
git config --global user.email "your.email@pnwenterprises.com"
```

**Verify:**
```cmd
git config --global user.name
git config --global user.email
```

---

## Step 3: Clone the Repository

### Open Command Prompt or PowerShell

**Windows + R** → Type `cmd` or `powershell` → Press Enter

### Navigate to Your Projects Folder

```cmd
cd C:\Users\YourUsername\Documents
mkdir Projects
cd Projects
```

### Clone the Repository

```cmd
git clone https://github.com/ksksrbiz-arch/unify-one-shopify-theme.git
cd unify-one-shopify-theme
```

### Install Dependencies

```cmd
npm install
```

**You'll see a lot of text—this is normal!** Just wait for it to finish.

---

## Step 4: GitHub Authentication

### Create a Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: `unify-one-shopify-theme-cli`
4. Select these scopes:
   - ☑️ `repo` (full access to private/public repos)
   - ☑️ `workflow` (update GitHub Actions workflows)
5. Click "Generate token" at bottom
6. **COPY THE TOKEN** (you'll only see it once!)
7. Save it somewhere safe (password manager, private text file)

### Configure Git to Use Your Token

```cmd
git config --global credential.helper wincred
```

**Note:** Next time you push to GitHub, it will ask for:
- **Username:** Your GitHub username
- **Password:** Paste your token (not your actual GitHub password!)

---

## Step 5: Enable PowerShell Scripts (If Using PowerShell)

If you're using PowerShell and get an execution policy error:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Type `Y` and press Enter when prompted.

---

## Step 6: Test Your Setup

### Verify Everything Works

```cmd
# Check Git
git status
# Output should show: "On branch main"

# Check Node.js
node --version
# Output should show: v18.x.x or higher

# Check Shopify CLI
shopify version
# Output should show version number
```

### Run a Test Deployment (Staging)

**PowerShell:**
```powershell
.\deploy-staging.ps1 "Test deployment"
```

**Command Prompt:**
```cmd
deploy-staging.bat "Test deployment"
```

Watch for:
- ✅ "Changes staged"
- ✅ "Pushed successfully"
- Links to GitHub Actions

---

## Step 7: Learn Essential Git Commands

### Basic Commands (You Already Know)

```cmd
git add .                    # Stage all changes
git commit -m "message"      # Commit with message
git push origin main         # Push to main branch
git status                   # Check current status
```

### Advanced Commands (Level Up Your Skills)

#### Save Work Temporarily (Stash)

```cmd
# Save current work without committing
git stash push -m "Work in progress on header"

# List all saved work
git stash list

# Restore your work
git stash pop
```

**Example:** You're editing CSS but need to urgently fix a bug. Stash your CSS work, fix the bug, then restore your CSS changes.

#### Apply Specific Commits (Cherry-pick)

```cmd
# Find the commit you want
git log --oneline features/bug-fix

# Apply just that commit to current branch
git cherry-pick a1b2c3d
```

**Example:** You fixed a critical bug on a feature branch but need it in production immediately. Cherry-pick just that fix.

#### Keep Your Branch Updated (Rebase)

```cmd
# Update your feature branch with latest changes
git checkout features/your-feature
git rebase develop

# If conflicts occur, fix them then:
git add .
git rebase --continue
```

**Example:** The team pushed new changes to develop. Rebase to get those changes in your feature branch.

#### Undo Mistakes (Reset & Reflog)

```cmd
# Undo last commit but keep changes
git reset HEAD~1

# View history of all actions (even deleted commits)
git reflog

# Recover a lost commit
git checkout abc123
```

**Example:** You committed to wrong branch or want to recover deleted work.

**📚 Complete Guide:** See [docs/GIT_WORKFLOW.md](../docs/GIT_WORKFLOW.md) for detailed examples and all advanced commands.

---

## Step 8: Understanding the Workflow

### Basic Deployment Flow

```
1. Edit a file (CSS, JavaScript, Liquid)
   ⬇️
2. Stage changes: git add .
   ⬇️
3. Commit: git commit -m "Your message"
   ⬇️
4. Push to staging: git push origin develop
   ⬇️
5. GitHub Actions deploys automatically
   ⬇️
6. Verify in staging: https://1commercesolutions.shop
   ⬇️
7. Create tag: git tag v1.0.1 ...
   ⬇️
8. Push tag: git push origin v1.0.1
   ⬇️
9. GitHub Actions deploys to production
   ⬇️
🌟 Live!
```

---

## Common Issues & Solutions

### Issue: "git: command not found"

**Solution:**
```
1. Restart your computer (installer changes system PATH)
2. Open a NEW Command Prompt/PowerShell window
3. Try again
```

### Issue: "npm ERR! code EACCES"

**Solution (Windows):**
```cmd
npm install --global npm@latest
```

### Issue: "PowerShell: cannot be loaded because running scripts is disabled"

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: "fatal: could not read Username for 'https://github.com'"

**Solution:**
```
1. First time pushing? Git will prompt for credentials
2. Username: Your GitHub username
3. Password: Your personal access token (not GitHub password!)
4. Windows will save credentials for future use
```

### Issue: "Please tell me who you are"

**Solution:**
```cmd
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Next Steps

### After Setup, You're Ready To:

1. **Edit theme files** (CSS, JavaScript, Liquid templates)
2. **Deploy to staging** (for testing)
3. **View Lighthouse CI results** (performance metrics)
4. **Deploy to production** (after approval)

### Important Files to Know

| File | Purpose |
|------|----------|
| `assets/custom-styles.css` | All theme CSS |
| `assets/theme.js` | All theme JavaScript |
| `sections/` | Custom Shopify sections |
| `templates/` | Page templates |
| `snippets/` | Reusable components |
| `layout/theme.liquid` | Base HTML template |

### Useful Commands

```cmd
# See what you changed
git status

# See the changes in detail
git diff

# See commit history
git log --oneline -10

# Deploy to staging
.\deploy-staging.ps1 "Your message"

# Deploy to production
.\deploy-production.ps1 -version 1.0.1 -message "Release: ..."
```

---

## Quick Reference

### Your First Deployment

```cmd
# 1. Make a small change to a file
# 2. Save the file
# 3. Open Command Prompt/PowerShell in theme directory
# 4. Run:

git add .
git commit -m "Test deployment"
git push origin develop

# 5. Go to GitHub Actions to watch the deployment:
https://github.com/ksksrbiz-arch/unify-one-shopify-theme/actions

# 6. After ~5 minutes, preview staging:
https://1commercesolutions.shop
```

---

## Getting Help

**Command Prompt or PowerShell help?**
- Try: `git --help`
- Try: `npm --help`
- Search: StackOverflow + the error message

**Shopify or Liquid questions?**
- Shopify Docs: https://shopify.dev/themes
- Liquid Docs: https://shopify.dev/liquid

**Team help?**
- Slack: #dev-team
- Email: dev-team@pnwenterprises.com

---

## Checklist: Setup Complete?

- [ ] Git installed and configured
- [ ] Node.js installed
- [ ] Shopify CLI installed
- [ ] Repository cloned
- [ ] Dependencies installed (npm install)
- [ ] GitHub personal token created
- [ ] PowerShell execution policy updated (if needed)
- [ ] Test deployment successful
- [ ] Reviewed basic workflow
- [ ] Bookmarked [Quick Deploy Reference](../QUICK-DEPLOY.md)

---

## You're All Set! 🎉

You now have:
- ✅ Git configured
- ✅ Node.js ready
- ✅ Shopify CLI installed
- ✅ Repository cloned
- ✅ Deployment scripts ready

**Next:** Check out [QUICK-DEPLOY.md](../QUICK-DEPLOY.md) for quick commands!

---

**Questions?** Refer to:
- [CLI Deployment Guide](./CLI-DEPLOYMENT-GUIDE.md) - Detailed commands
- [Performance Monitoring](./PERFORMANCE-MONITORING.md) - Lighthouse CI
- [GitHub Issues](https://github.com/ksksrbiz-arch/unify-one-shopify-theme/issues) - Report problems

---

**Last Updated:** January 21, 2026  
**Maintained by:** PNW Enterprises Development Team
