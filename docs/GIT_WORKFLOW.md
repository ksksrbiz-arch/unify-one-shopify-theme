# Advanced Git Commands: Usage and Examples

Having a strong command of Git allows you to work with more flexibility and confidence. Below are some advanced commands that will improve your workflow as a developer on this project.

---

## 1. `git stash`

**Purpose:**  
Temporarily save your changes (work in progress) when you need to switch branches or pull new changes before you're ready to commit.

**Usage:**  
- Stash current changes:
  ```sh
  git stash
  ```
- Stash including untracked files:
  ```sh
  git stash -u
  ```
- List all stashes:
  ```sh
  git stash list
  ```
- Apply the latest stash:
  ```sh
  git stash apply
  ```
- Apply and remove the latest stash:
  ```sh
  git stash pop
  ```
- Stash with a descriptive message:
  ```sh
  git stash save "Work in progress on newsletter feature"
  ```
- Drop a specific stash:
  ```sh
  git stash drop stash@{0}
  ```

**Example scenario:**  
```sh
# You're working on a new feature but need to quickly fix a bug
# Save your unfinished work
git stash save "Newsletter form - incomplete validation"

# Switch branches and work on the bug fix
git checkout main
# Make your bug fix
git add .
git commit -m "fix: resolve cart calculation error"

# Later, return to your original branch
git checkout features/newsletter-form
git stash pop

# Your work in progress is restored
```

**Use case for this project:**
- You're editing `assets/custom-styles.css` but need to urgently deploy a hotfix
- You want to pull latest changes from `develop` without committing incomplete work
- You need to switch between multiple features quickly

---

## 2. `git cherry-pick`

**Purpose:**  
Apply specific commits from one branch onto another branch without merging the entire branch.

**Usage:**  
- Cherry-pick a single commit (use the commit SHA):
  ```sh
  git cherry-pick 1234abcd
  ```
- Cherry-pick a range of commits:
  ```sh
  git cherry-pick abc123..def456
  ```
- Cherry-pick multiple specific commits:
  ```sh
  git cherry-pick commit1 commit2 commit3
  ```
- Cherry-pick without committing (allows you to modify):
  ```sh
  git cherry-pick -n 1234abcd
  ```
- Abort a cherry-pick in progress:
  ```sh
  git cherry-pick --abort
  ```

**Example scenario:**  
```sh
# You made a critical bug fix on a feature branch
# But you need it in main immediately

# 1. Find the commit hash
git log --oneline features/new-checkout
# Output: a1b2c3d fix: correct price calculation for discounts

# 2. Switch to main branch
git checkout main

# 3. Cherry-pick the specific fix
git cherry-pick a1b2c3d

# 4. Push to trigger deployment
git push origin main

# The bug fix is now in main without merging the entire feature
```

**Use case for this project:**
- Apply a critical Liquid template fix to production without deploying untested features
- Copy a specific CSS improvement from one feature branch to another
- Backport a security fix to an older release tag

---

## 3. `git rebase`

**Purpose:**  
Reapply commits on top of another base branch, creating a linear history and making the commit log cleaner.

**Usage:**  
- Rebase current branch onto main:
  ```sh
  git rebase main
  ```
- Interactive rebase (squash, reorder, edit commits):
  ```sh
  git rebase -i HEAD~3
  ```
- Continue after resolving conflicts:
  ```sh
  git rebase --continue
  ```
- Abort a rebase:
  ```sh
  git rebase --abort
  ```

**Example scenario:**  
```sh
# Keep your feature branch up to date with main
git checkout features/product-gallery
git rebase main

# If conflicts occur:
# 1. Resolve conflicts in your editor
# 2. Stage the resolved files
git add .
# 3. Continue the rebase
git rebase --continue

# Clean up commit history before merging
git rebase -i HEAD~5
# In the editor, squash related commits together
```

**Use case for this project:**
- Keep your feature branch synchronized with `develop` or `main`
- Clean up commit history before creating a PR
- Combine multiple small commits (e.g., "fix typo", "fix typo again") into one meaningful commit

**⚠️ Important:** Never rebase commits that have been pushed to a shared branch. Only rebase local commits or feature branches you own.

---

## 4. `git reset`

**Purpose:**  
Undo commits by moving the branch pointer backward. Different modes affect working directory and staging area differently.

**Usage:**  
- Soft reset (keep changes staged):
  ```sh
  git reset --soft HEAD~1
  ```
- Mixed reset (keep changes unstaged) - default:
  ```sh
  git reset HEAD~1
  ```
- Hard reset (discard all changes):
  ```sh
  git reset --hard HEAD~1
  ```
- Reset to a specific commit:
  ```sh
  git reset --hard a1b2c3d
  ```

**Example scenario:**  
```sh
# You committed too early and want to add more changes
git reset --soft HEAD~1
# Your changes are still staged, add more changes
# Then commit everything together

# You want to undo the last commit but keep the changes
git reset HEAD~1
# Edit files as needed, then commit again

# You want to completely discard the last commit
git reset --hard HEAD~1
# ⚠️ WARNING: This permanently deletes your changes!
```

**Use case for this project:**
- Undo a commit made to the wrong branch
- Combine multiple commits before pushing
- Discard experimental changes to `assets/theme.js` that didn't work out

**⚠️ Important:** Be very careful with `--hard` as it permanently deletes uncommitted changes. Never reset commits that have been pushed to shared branches.

---

## 5. `git reflog`

**Purpose:**  
View a log of all ref updates (commits, checkouts, resets) - your safety net to recover "lost" commits.

**Usage:**  
- View reflog:
  ```sh
  git reflog
  ```
- View reflog for specific branch:
  ```sh
  git reflog show main
  ```

**Example scenario:**  
```sh
# Oops! You did a hard reset and lost important work
git reset --hard HEAD~3

# Find your lost commit
git reflog
# Output shows:
# a1b2c3d HEAD@{0}: reset: moving to HEAD~3
# d4e5f6g HEAD@{1}: commit: Add newsletter form validation
# ...

# Recover the lost commit
git checkout d4e5f6g
# Or create a branch from it
git branch recover-newsletter d4e5f6g
```

**Use case for this project:**
- Recover from accidental `git reset --hard`
- Find a deleted branch that had important theme customizations
- Restore a commit that was lost during a rebase gone wrong

---

## 6. `git bisect`

**Purpose:**  
Use binary search to find which commit introduced a bug.

**Usage:**  
- Start bisecting:
  ```sh
  git bisect start
  ```
- Mark current commit as bad:
  ```sh
  git bisect bad
  ```
- Mark a known good commit:
  ```sh
  git bisect good v1.0.0
  ```
- Test the commit, then mark it:
  ```sh
  git bisect good  # or git bisect bad
  ```
- End bisecting:
  ```sh
  git bisect reset
  ```

**Example scenario:**  
```sh
# Something broke between v1.0.0 and now
git bisect start
git bisect bad                    # Current version is broken
git bisect good v1.0.0            # v1.0.0 worked fine

# Git checks out a commit in the middle
# Test the theme (npm run dev, check the issue)
# If the issue exists:
git bisect bad
# If it doesn't:
git bisect good

# Repeat until Git finds the exact commit
# Output: "abc123 is the first bad commit"
git bisect reset
```

**Use case for this project:**
- Find which commit broke the mobile menu in `assets/theme.js`
- Identify when a CSS regression was introduced
- Locate the commit that caused performance degradation

---

## 7. `git worktree`

**Purpose:**  
Work on multiple branches simultaneously by checking them out in different directories.

**Usage:**  
- Add a new worktree:
  ```sh
  git worktree add ../hotfix-directory main
  ```
- List worktrees:
  ```sh
  git worktree list
  ```
- Remove a worktree:
  ```sh
  git worktree remove ../hotfix-directory
  ```

**Example scenario:**  
```sh
# You're developing a feature but need to make a quick hotfix
# Current directory: working on features/checkout-improvements

# Create a worktree for the hotfix
git worktree add ../hotfix-cart main

# In another terminal/window, navigate to the hotfix directory
cd ../hotfix-cart
# Make your fix
# Commit and push
git add .
git commit -m "fix: cart total calculation"
git push origin main

# Return to your original work - no need to stash or commit
cd ../unify-one-shopify-theme
# Continue working on your feature
```

**Use case for this project:**
- Work on a hotfix while keeping your feature branch work intact
- Review a PR locally while continuing development
- Test changes in staging and production branches side-by-side

---

## 8. `git clean`

**Purpose:**  
Remove untracked files from your working directory.

**Usage:**  
- Preview what will be deleted (dry run):
  ```sh
  git clean -n
  ```
- Remove untracked files:
  ```sh
  git clean -f
  ```
- Remove untracked files and directories:
  ```sh
  git clean -fd
  ```
- Include ignored files:
  ```sh
  git clean -fdx
  ```

**Example scenario:**  
```sh
# After experimenting, you have many temporary files
git status
# Shows: test.liquid, temp.css, backup/, etc.

# Preview what will be removed
git clean -n
# Shows list of files that will be deleted

# Remove untracked files
git clean -fd

# Remove everything including node_modules (be careful!)
git clean -fdx
```

**Use case for this project:**
- Clean up temporary test files after theme development
- Remove auto-generated files not in `.gitignore`
- Reset your working directory to a pristine state

---

## Common Workflow Examples for UnifyOne Theme

### Scenario 1: Working on Multiple Features

```sh
# Start a new feature
git checkout -b features/mobile-menu-improvements
# Make changes to sections/header.liquid and assets/theme.js

# Urgent: Need to fix a bug on main
git stash save "Mobile menu improvements - in progress"
git checkout main
# Fix the bug, commit, push

# Return to feature work
git checkout features/mobile-menu-improvements
git stash pop
# Continue development
```

### Scenario 2: Keeping Feature Branch Updated

```sh
# Your feature branch is behind develop
git checkout features/newsletter-section
git fetch origin
git rebase origin/develop

# Resolve any conflicts
# Edit conflicting files
git add .
git rebase --continue

# Force push to update your PR (if already pushed)
git push --force-with-lease origin features/newsletter-section
```

### Scenario 3: Fixing a Production Bug Quickly

```sh
# Critical bug in production
git checkout main
git pull origin main

# Apply the fix from a feature branch
git cherry-pick a1b2c3d

# Or make the fix directly
# Edit files
git add .
git commit -m "fix: urgent - correct checkout calculation"

# Create emergency release
git tag v1.0.2 -m "Hotfix: checkout calculation"
git push origin v1.0.2
# This triggers production deployment
```

### Scenario 4: Cleaning Up Before PR

```sh
# You have 10 messy commits
git log --oneline -10

# Interactive rebase to clean up
git rebase -i HEAD~10

# In the editor, change 'pick' to 'squash' for commits to combine
# Save and exit
# Edit the combined commit message
# Save and exit

# Force push to update your PR
git push --force-with-lease origin features/your-feature
```

### Scenario 5: Recovering from Mistakes

```sh
# Accidentally deleted your branch
git reflog
# Find the commit before deletion
git branch recover-branch a1b2c3d

# Or accidentally reset too far
git reflog
git reset --hard HEAD@{5}
```

---

## Best Practices for This Project

### ✅ Do's:

1. **Stash before switching branches** to avoid conflicts
2. **Use descriptive stash messages** for easy identification
3. **Rebase feature branches** regularly to stay up to date
4. **Cherry-pick critical fixes** to production without waiting for feature completion
5. **Use reflog** as your safety net when things go wrong
6. **Clean commit history** before creating PRs (use interactive rebase)

### ❌ Don'ts:

1. **Never rebase shared branches** (main, develop) - only rebase your feature branches
2. **Never force push to main or develop** - only to your feature branches
3. **Don't use reset --hard** unless you're absolutely sure
4. **Avoid cherry-picking merge commits** - they can cause conflicts
5. **Don't clean with -fdx** unless you want to delete node_modules too

---

## Quick Reference Table

| Command | Use When | Danger Level |
|---------|----------|--------------|
| `git stash` | Temporarily save work | ✅ Safe |
| `git cherry-pick` | Apply specific commits | ⚠️ Medium (can cause conflicts) |
| `git rebase` | Update feature branch | ⚠️ Medium (don't rebase shared branches) |
| `git reset --soft` | Undo commit, keep changes | ✅ Safe |
| `git reset --hard` | Discard everything | 🔴 Dangerous |
| `git reflog` | Recover lost commits | ✅ Safe (read-only) |
| `git bisect` | Find bug-introducing commit | ✅ Safe |
| `git worktree` | Work on multiple branches | ✅ Safe |
| `git clean` | Remove untracked files | ⚠️ Medium (use -n first) |

---

## Additional Resources

- **Git Official Documentation**: https://git-scm.com/doc
- **Atlassian Git Tutorials**: https://www.atlassian.com/git/tutorials
- **Git Interactive Rebase Guide**: https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History
- **Oh Shit, Git!?!** (Recovery guide): https://ohshitgit.com/

---

## Questions or Issues?

If you encounter Git-related problems:
1. Check this guide for common solutions
2. Use `git reflog` to find your way back
3. Ask in the #dev-team Slack channel
4. Never force operations on shared branches

---

**Last Updated:** January 26, 2026  
**Maintained By:** PNW Enterprises Development Team  
**Related Docs:** [SETUP.md](../SETUP.md), [DEPLOYMENT_CHEATSHEET.md](../DEPLOYMENT_CHEATSHEET.md)
