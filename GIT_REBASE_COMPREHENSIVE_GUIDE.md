# Git Rebase Comprehensive Guide

This guide provides a complete understanding of **git rebase**, covering what it is, when to use it, when git does it automatically, and when you need to do it manually.

---

## Table of Contents

1. [What is Git Rebase?](#what-is-git-rebase)
2. [When to Use Git Rebase](#when-to-use-git-rebase)
3. [When Git Rebases Automatically](#when-git-rebases-automatically)
4. [When You Need to Rebase Manually](#when-you-need-to-rebase-manually)
5. [Basic Rebase Commands](#basic-rebase-commands)
6. [Interactive Rebase](#interactive-rebase)
7. [Rebase vs Merge](#rebase-vs-merge)
8. [Git Cherry-Pick](#git-cherry-pick)
9. [Handling Conflicts During Rebase](#handling-conflicts-during-rebase)
10. [Best Practices and Golden Rules](#best-practices-and-golden-rules)
11. [Common Mistakes](#common-mistakes)
12. [Troubleshooting](#troubleshooting)
13. [Quick Reference](#quick-reference)

---

## What is Git Rebase?

**Git rebase** moves or replays commits from one branch onto another branch. Instead of creating a merge commit, rebase replays your commits on top of the target branch, creating a linear history.

### Visual Understanding

**Before Rebase:**

```
main:     A---B---C---D
                \
feature:         E---F---G
```

**After Rebase:**

```
main:     A---B---C---D
                      \
feature:               E'---F'---G' (replayed commits)
```

**Key Points:**

- Commits get new hashes (because parent changed)
- Commit messages stay the same (unless using interactive rebase)
- Creates linear, cleaner history

---

## When to Use Git Rebase

### 1. **Before Merging a Feature Branch**

Update your feature branch with latest main before merging:

```bash
git checkout feature-branch
git rebase main
```

### 2. **Cleaning Up Commit History**

Combine multiple small commits into one:

```bash
git rebase -i HEAD~5  # Interactive rebase
```

### 3. **Preparing for Code Review**

Clean up commits before creating pull request:

```bash
git checkout feature-branch
git rebase origin/main
git push --force-with-lease
```

---

## When Git Rebases Automatically

### 1. **Using `git pull --rebase`**

```bash
git pull --rebase origin main
```

Git automatically rebases your local commits on top of remote changes.

### 2. **Configured Pull Behavior**

```bash
# Set rebase as default
git config pull.rebase true

# Now regular git pull will rebase automatically
git pull
```

### 3. **GitHub/GitLab "Rebase and Merge" Button**

When you use the web interface "Rebase and merge" option, it rebases automatically.

---

## When You Need to Rebase Manually

### 1. **Standard Rebase Workflow**

```bash
git checkout feature-branch
git fetch origin
git rebase origin/main
```

### 2. **Interactive Rebase for History Cleanup**

```bash
git rebase -i HEAD~5  # Last 5 commits
git rebase -i main     # All commits since branching
```

**How to Save in GNU Nano:**

1. Edit the file - Change `pick` to `squash`, `reword`, `edit`, etc.
2. Save: `Ctrl + O`, then `Enter`
3. Exit: `Ctrl + X`
4. **Quick method:** `Ctrl + X`, then `Y`, then `Enter`

**Interactive rebase commands:**

- `pick` (or `p`) - use commit as-is
- `reword` (or `r`) - change commit message
- `edit` (or `e`) - modify commit content
- `squash` (or `s`) - combine with previous commit
- `fixup` (or `f`) - like squash but discard message
- `drop` (or `d`) - remove commit

### 3. **Rebasing After Conflicts**

```bash
git rebase main
# Resolve conflicts manually
git add file.txt
git rebase --continue
# OR abort
git rebase --abort
```

### 4. **Rebasing After Already Pushing**

```bash
git rebase main
git push --force-with-lease origin feature-branch
```

**⚠️ Warning:** Only do this if you're the only one working on the branch.

---

## Basic Rebase Commands

```bash
# Rebase current branch onto main
git rebase main

# Rebase onto remote main
git rebase origin/main

# Continue after resolving conflicts
git rebase --continue

# Abort rebase
git rebase --abort

# Skip current commit
git rebase --skip
```

---

## Interactive Rebase

### Common Scenarios

#### 1. Squash Multiple Commits

```bash
git rebase -i HEAD~5
```

**Change:**

```
pick abc123 Add login feature
squash def456 Fix typo
squash ghi789 Update comment
```

**Result:** One commit containing all changes.

#### 2. Reword Commit Messages

**Why Two Editor Sessions?**

- **First editor:** Shows compact list - mark which commits to reword
- **Second editor:** Shows full commit message - edit the actual message

**Process:**

1. Change `pick` to `reword` (or `r`) in first editor
2. Save and close
3. Git opens editor again with full commit message
4. Edit message, save and close
5. Repeat for each `reword` commit

**Example:**

```
# First editor
reword abc123 Fix bug
pick def456 Add feature

# Second editor (opens automatically)
Fix login authentication bug
# Edit and save
```

**Result:** Your feature-branch now has the new commit messages.

#### 3. Drop Commits

```bash
git rebase -i HEAD~5
```

**Change:**

```
pick abc123 Good commit
drop def456 Bad commit
pick ghi789 Another commit
```

**Result:** Bad commit removed from history.

---

## Rebase vs Merge

### Visual Comparison

**Merge:**

```
main:     A---B---C---D
                \       \
feature:         E---F---M (merge commit)
```

**Rebase:**

```
main:     A---B---C---D
                      \
feature:               E'---F' (linear history)
```

### Comparison Table

| Aspect            | Git Merge                     | Git Rebase                     |
| ----------------- | ----------------------------- | ------------------------------ |
| **History**       | Preserves branching structure | Creates linear history         |
| **Merge Commits** | Creates merge commit          | No merge commits               |
| **Commit Hashes** | Preserves original            | Creates new hashes             |
| **Risk Level**    | Low risk                      | Higher risk (rewrites history) |
| **When to Use**   | Public/shared branches        | Private feature branches       |

### When to Use Each

**Use Merge:**

- Merging into main/master
- Shared branches
- Public repositories

**Use Rebase:**

- Feature branches (before merging)
- Personal branches
- Before code review

### What Happens When You Pull (Merge) Then Create a Pull Request

**Scenario:** You pull main into your feature branch (without rebase), then create a PR.

**What happens:**

1. **You pull main into your feature branch:**

   ```bash
   git checkout feature-branch
   git pull origin main  # This does a MERGE, not rebase
   ```

2. **Git creates a merge commit:**

   ```
   main:     A---B---C---D
                \       \
   feature:      E---F---M (merge commit from pulling main)
   ```

3. **Your feature branch now has:**

   - Your original commits (E, F)
   - A merge commit (M) that combines main's changes
   - Both histories mixed together

4. **When you create a Pull Request:**

   **What the PR shows:**

   - Your feature commits (E, F)
   - The merge commit (M)
   - The PR diff includes:
     - Your changes
     - The merge commit (noise)
     - Potentially harder to review due to merge commits

   **Problems:**

   - ❌ **Messier history:** Merge commits clutter the PR
   - ❌ **Harder to review:** Reviewers see merge commits mixed with your changes
   - ❌ **Not linear:** The PR graph shows branching/merging instead of clean linear history
   - ❌ **May show conflicts:** If main changed significantly, the merge commit might include conflict resolution that makes the PR harder to understand

**Visual comparison:**

**With merge (what happens with pull):**

```
PR shows:
main:     A---B---C---D
                \       \
feature:         E---F---M---G
                      ↑
                   Merge commit visible in PR
```

**With rebase (cleaner):**

```
PR shows:
main:     A---B---C---D
                      \
feature:               E'---F'---G'
                      ↑
                   Clean linear history
```

**Bottom line:**

If you pull (merge) before creating a PR, the PR will include merge commits, making the history messier and harder to review. That's why many teams prefer rebasing before creating PRs — it keeps the PR history clean and linear.

---

## Git Cherry-Pick

**Git cherry-pick** is a command that allows you to apply specific commits from one branch to another branch. Unlike rebase (which moves all commits) or merge (which combines branches), cherry-pick lets you selectively copy individual commits.

### What is Git Cherry-Pick?

Cherry-pick takes a commit (or multiple commits) from one branch and applies it to your current branch, creating a new commit with the same changes but a different commit hash.

### Visual Understanding

**Before Cherry-Pick:**

```
main:        A---B---C---D
                    \
feature:             E---F---G
                          ↑
                    Want to copy F to main
```

**After Cherry-Pick:**

```
main:        A---B---C---D---F' (copied commit)
                    \
feature:             E---F---G (original unchanged)
```

**Key Points:**

- Original commit remains in source branch
- New commit is created in target branch (different hash)
- Only the selected commit(s) are copied
- Commit message is preserved (unless you edit it)

---

### How to Use Git Cherry-Pick

#### Basic Syntax

```bash
# Cherry-pick a single commit
git cherry-pick <commit-hash>

# Cherry-pick multiple commits
git cherry-pick <commit-hash-1> <commit-hash-2> <commit-hash-3>

# Cherry-pick a range of commits
git cherry-pick <start-hash>..<end-hash>  # Excludes start, includes end
git cherry-pick <start-hash>^..<end-hash> # Includes both start and end
```

#### Step-by-Step Process

1. **Find the commit hash:**

   ```bash
   # View commit history
   git log --oneline

   # Or view commits on another branch
   git log --oneline feature-branch
   ```

2. **Switch to target branch:**

   ```bash
   git checkout main
   ```

3. **Cherry-pick the commit:**

   ```bash
   git cherry-pick abc123
   ```

4. **Result:** The commit is now on your current branch.

#### Example Workflow

```bash
# 1. You're on main branch
git checkout main

# 2. View commits on feature branch
git log --oneline feature-branch
# Output:
# def456 Add new feature
# abc123 Fix critical bug  ← Want this one
# 789xyz Initial commit

# 3. Cherry-pick the bug fix
git cherry-pick abc123

# 4. Result: Bug fix is now on main
git log --oneline
# Output:
# abc123 Fix critical bug  ← Now on main
# ... previous commits
```

---

### When to Use Cherry-Pick

#### Use Case #1: Hotfix to Production

**Scenario:** A critical bug was fixed in a feature branch, but the feature isn't ready. You need the fix in production immediately.

```bash
# Bug fix is in feature-branch
git checkout main
git cherry-pick abc123  # The bug fix commit
git push origin main
```

**Why cherry-pick:** You only want the bug fix, not the entire feature branch.

#### Use Case #2: Backporting Fixes

**Scenario:** A bug was fixed in the latest version, but you need the fix in an older release branch.

```bash
# Fix is in main (v2.0)
git checkout release-v1.0
git cherry-pick abc123  # Apply fix to v1.0
```

**Why cherry-pick:** You want to apply a specific fix to multiple branches without merging everything.

#### Use Case #3: Selective Commit Application

**Scenario:** A feature branch has 10 commits, but only 2 are ready for main. You want those 2 commits now.

```bash
git checkout main
git cherry-pick abc123 def456  # Only these 2 commits
```

**Why cherry-pick:** You can selectively choose which commits to apply.

#### Use Case #4: Moving Commits Between Branches

**Scenario:** You accidentally committed to the wrong branch.

```bash
# Commit is on wrong-branch
git checkout correct-branch
git cherry-pick abc123  # Move commit here
git checkout wrong-branch
git reset --hard HEAD~1  # Remove from wrong branch
```

**Why cherry-pick:** Quick way to move a commit without complex rebasing.

#### Use Case #5: Applying Someone Else's Commit

**Scenario:** A teammate made a useful commit on their branch, and you want it on yours.

```bash
git checkout your-branch
git cherry-pick abc123  # Their commit hash
```

**Why cherry-pick:** You can incorporate specific work without merging entire branches.

---

### Cherry-Pick Options

#### 1. Edit Commit Message

```bash
git cherry-pick -e abc123  # Opens editor to edit message
```

#### 2. Cherry-Pick Without Committing

```bash
git cherry-pick -n abc123  # Applies changes but doesn't commit
# or
git cherry-pick --no-commit abc123

# Then you can review and commit manually
git add .
git commit -m "Custom message"
```

#### 3. Cherry-Pick Multiple Commits

```bash
# Cherry-pick 3 specific commits
git cherry-pick abc123 def456 ghi789

# Cherry-pick a range (excludes start, includes end)
git cherry-pick abc123..ghi789

# Cherry-pick a range (includes both)
git cherry-pick abc123^..ghi789
```

#### 4. Continue After Conflicts

```bash
# Resolve conflicts, then:
git add .
git cherry-pick --continue
```

#### 5. Abort Cherry-Pick

```bash
git cherry-pick --abort  # Cancel the operation
```

---

### Handling Conflicts During Cherry-Pick

Cherry-pick can create conflicts if the commit depends on code that doesn't exist in the target branch.

#### Conflict Resolution Process

1. **Cherry-pick creates conflict:**

   ```bash
   git cherry-pick abc123
   # CONFLICT (content): Merge conflict in file.txt
   ```

2. **Identify conflicted files:**

   ```bash
   git status
   ```

3. **Resolve conflicts manually:**

   Open the file and look for conflict markers:

   ```
   <<<<<<< HEAD
   Code from current branch (main)
   =======
   Code from cherry-picked commit
   >>>>>>> abc123 (Commit message)
   ```

4. **Resolve and continue:**

   ```bash
   git add file.txt
   git cherry-pick --continue
   ```

5. **Or abort:**

   ```bash
   git cherry-pick --abort
   ```

---

### Cherry-Pick vs Rebase vs Merge

| Aspect           | Cherry-Pick                   | Rebase                    | Merge                      |
| ---------------- | ----------------------------- | ------------------------- | -------------------------- |
| **What it does** | Copies specific commits       | Moves all commits         | Combines entire branches   |
| **Selectivity**  | ✅ Selective (choose commits) | ❌ All commits            | ❌ Entire branch           |
| **History**      | Creates new commits           | Rewrites history          | Preserves all history      |
| **Use case**     | Single/few commits            | Feature branch cleanup    | Integrating branches       |
| **Risk level**   | Low (only affects target)     | Medium (rewrites history) | Low (preserves everything) |

### When to Use Each

**Use Cherry-Pick when:**

- ✅ You need specific commits, not the whole branch
- ✅ Hotfixing production
- ✅ Backporting fixes
- ✅ Moving commits between branches

**Use Rebase when:**

- ✅ Cleaning up feature branch before merge
- ✅ Updating feature branch with latest main
- ✅ Creating linear history

**Use Merge when:**

- ✅ Integrating complete feature branches
- ✅ Preserving full history
- ✅ Merging into main/master

---

### Best Practices for Cherry-Pick

#### 1. **Always Test After Cherry-Picking**

```bash
git cherry-pick abc123
npm test  # Ensure nothing broke
```

#### 2. **Cherry-Pick Related Commits Together**

If commits depend on each other, cherry-pick them together:

```bash
# Good: Pick related commits together
git cherry-pick abc123 def456  # These depend on each other

# Bad: Picking one without the other
git cherry-pick abc123  # Missing dependency
```

#### 3. **Use `-n` to Review Before Committing**

```bash
git cherry-pick -n abc123
# Review changes
git diff
# If good, commit
git commit -m "Applied fix from feature branch"
```

#### 4. **Document Why You Cherry-Picked**

In your commit message or PR description, explain why you cherry-picked:

```bash
git cherry-pick -e abc123
# Edit message to: "Cherry-picked hotfix from feature-branch"
```

#### 5. **Avoid Cherry-Picking Already Merged Commits**

If a commit is already in the target branch (via merge), cherry-picking it again creates a duplicate. Check first:

```bash
git log --oneline main | grep "Fix bug"  # Check if already exists
```

---

### Common Cherry-Pick Scenarios

#### Scenario 1: Hotfix Workflow

```bash
# 1. Bug found in production
git checkout main
git pull origin main

# 2. Create hotfix branch
git checkout -b hotfix/critical-bug

# 3. Fix the bug
# ... make changes ...
git add .
git commit -m "Fix critical bug"

# 4. Merge to main
git checkout main
git merge hotfix/critical-bug
git push origin main

# 5. Also apply to feature branch
git checkout feature-branch
git cherry-pick abc123  # The hotfix commit
```

#### Scenario 2: Backporting

```bash
# Fix is in main (v2.0)
git log --oneline main
# abc123 Fix security vulnerability

# Apply to older version
git checkout release-v1.0
git cherry-pick abc123
git push origin release-v1.0
```

#### Scenario 3: Selective Feature Integration

```bash
# Feature branch has 5 commits, but only 2 are ready
git log --oneline feature-branch
# ghi789 Add feature part 3
# def456 Add feature part 2  ← Ready
# abc123 Add feature part 1  ← Ready
# 789xyz Setup

# Cherry-pick only the ready ones
git checkout main
git cherry-pick abc123 def456
```

---

### Common Mistakes with Cherry-Pick

#### Mistake #1: Cherry-Picking Already Merged Commits

```bash
# ❌ WRONG: Commit already in main via merge
git cherry-pick abc123  # Creates duplicate

# ✅ CORRECT: Check first
git log --oneline main | grep "commit message"
```

#### Mistake #2: Cherry-Picking Out of Order

```bash
# ❌ WRONG: Picking commit that depends on another
git cherry-pick def456  # This depends on abc123
# Missing dependency causes issues

# ✅ CORRECT: Pick in order or together
git cherry-pick abc123 def456
```

#### Mistake #3: Not Testing After Cherry-Pick

```bash
# ❌ WRONG: Push immediately
git cherry-pick abc123
git push

# ✅ CORRECT: Test first
git cherry-pick abc123
npm test
git push  # Only if tests pass
```

#### Mistake #4: Cherry-Picking Merge Commits

```bash
# ❌ WRONG: Cherry-picking a merge commit
git cherry-pick abc123  # If abc123 is a merge commit

# ✅ CORRECT: Cherry-pick the actual commits, not merge commits
# Find the commits that were merged
git log --oneline abc123^..abc123
```

---

### Troubleshooting Cherry-Pick

#### Issue #1: "Cherry-Pick Conflicts"

**Solution:** Resolve conflicts manually, then continue:

```bash
git cherry-pick abc123
# Resolve conflicts in files
git add .
git cherry-pick --continue
```

#### Issue #2: "Empty Cherry-Pick"

**Solution:** The commit is already in the target branch. Check:

```bash
git log --oneline | grep "commit message"
# If found, skip cherry-pick
```

#### Issue #3: "Cherry-Pick Failed"

**Solution:** Abort and investigate:

```bash
git cherry-pick --abort
git log --oneline <source-branch>  # Verify commit exists
git status  # Check for uncommitted changes
```

---

### Quick Reference: Cherry-Pick Commands

```bash
# Basic cherry-pick
git cherry-pick <commit-hash>

# Multiple commits
git cherry-pick <hash1> <hash2> <hash3>

# Range of commits
git cherry-pick <start>..<end>
git cherry-pick <start>^..<end>

# Options
git cherry-pick -e <hash>        # Edit commit message
git cherry-pick -n <hash>         # Don't commit yet
git cherry-pick --no-commit <hash> # Same as -n

# After conflicts
git cherry-pick --continue
git cherry-pick --abort
git cherry-pick --skip

# Find commit hash
git log --oneline
git log --oneline <branch-name>
```

---

## Handling Conflicts During Rebase

### Conflict Resolution Process

1. **Rebase starts:**

   ```bash
   git rebase main
   # CONFLICT (content): Merge conflict in file.txt
   ```

2. **Identify conflicted files:**

   ```bash
   git status
   ```

3. **Resolve conflicts:**
   Open file and look for conflict markers:

   ```
   <<<<<<< HEAD
   Code from main branch
   =======
   Your code from feature branch
   >>>>>>> abc123 (Your commit message)
   ```

   Edit to resolve, then:

   ```bash
   git add file.txt
   git rebase --continue
   ```

4. **If more conflicts:** Repeat steps 2-3 for each commit.

5. **Complete:**
   ```bash
   Successfully rebased and updated refs/heads/feature-branch.
   ```

### Aborting Rebase

```bash
git rebase --abort  # Returns to state before rebase
```

---

## Best Practices and Golden Rules

### Golden Rule #1: Never Rebase Public/Shared Branches

**Rule:** Never rebase branches that others are working on.

**Safe to rebase:**

- ✅ Your personal feature branches
- ✅ Branches only you work on
- ✅ Before creating pull request

**Never rebase:**

- ❌ main/master branch
- ❌ Branches others are using

### Golden Rule #2: Rebase Before Merging, Not After

```bash
# ✅ Good: Rebase feature branch
git checkout feature-branch
git rebase main
git checkout main
git merge feature-branch

# ❌ Bad: Rebase main
git checkout main
git rebase feature-branch  # DON'T DO THIS
```

### Golden Rule #3: Always Use `--force-with-lease`

```bash
# ✅ Good
git push --force-with-lease origin feature-branch

# ❌ Dangerous
git push --force origin feature-branch
```

### Best Practices

1. **Test after rebase:**

   ```bash
   git rebase main
   npm test  # Run tests
   ```

2. **Create backup before major rebases:**

   ```bash
   git branch backup-feature-branch
   git rebase main
   ```

3. **Rebase before code review:**
   ```bash
   git rebase -i main  # Clean up commits
   git push --force-with-lease
   ```

---

## Common Mistakes

### Mistake #1: Rebasing Main/Master Branch

```bash
# ❌ WRONG
git checkout main
git rebase feature-branch

# ✅ CORRECT
git checkout feature-branch
git rebase main
```

### Mistake #2: Force Pushing Without `--force-with-lease`

```bash
# ❌ DANGEROUS
git push --force origin feature-branch

# ✅ SAFER
git push --force-with-lease origin feature-branch
```

### Mistake #3: Not Testing After Rebase

```bash
# ❌ Without testing
git rebase main
git push --force-with-lease

# ✅ Test first
git rebase main
npm test
git push --force-with-lease  # Only if tests pass
```

### Mistake #4: Rebasing Branches Others Are Using

**Solution:** Coordinate with team or use merge instead.

### Mistake #5: Not Fetching Before Rebase

```bash
# ❌ Using stale local main
git rebase main

# ✅ Get latest first
git fetch origin
git rebase origin/main
```

---

## Troubleshooting

### Issue #1: "Rebase Conflicts That Won't Resolve"

**Solutions:**

1. Use merge tool:

   ```bash
   git mergetool
   ```

2. Accept one version entirely:

   ```bash
   # Keep theirs (main branch)
   git checkout --theirs file.txt
   git add file.txt
   git rebase --continue
   ```

3. Abort and use merge:
   ```bash
   git rebase --abort
   git merge main
   ```

### Issue #2: "Rebase Stuck in Interactive Mode"

**Solution:** Save and close editor:

- **Nano:** `Ctrl + O`, `Enter`, `Ctrl + X`
- **Vim:** `:wq` then `Enter`
- **VS Code:** Save (`Ctrl+S`) and close

### Issue #3: "Lost Commits After Rebase"

**Recovery:**

```bash
git reflog
git reset --hard HEAD@{2}  # Use number from reflog
```

### Issue #4: "Cannot Rebase: Uncommitted Changes"

**Solution:**

```bash
# Option 1: Commit changes
git add .
git commit -m "WIP"
git rebase main

# Option 2: Stash changes
git stash
git rebase main
git stash pop
```

### Issue #5: "Commit Messages Still Show Old Messages"

**Answer:** This is **NORMAL**! Regular rebase (`git rebase main`) does NOT change commit messages - it only replays them. To change messages, use interactive rebase (`git rebase -i main`) with `reword`.

### Issue #6: "Remote Rejected After Rebase"

**Solution:**

```bash
git fetch origin
git rebase origin/feature-branch
git push --force-with-lease
```

---

## Quick Reference

### When Git Rebases Automatically

1. ✅ `git pull --rebase` - Explicit flag
2. ✅ `git pull` - If `pull.rebase = true` configured
3. ✅ GitHub/GitLab "Rebase and merge" button

### When You Must Rebase Manually

1. ✅ Standard feature branch update: `git rebase main`
2. ✅ Interactive rebase: `git rebase -i HEAD~5`
3. ✅ Resolving conflicts: `git rebase --continue`
4. ✅ After already pushing: `git rebase main` + `git push --force-with-lease`

### Golden Rules

1. ⚠️ **Never rebase public/shared branches**
2. ⚠️ **Rebase before merging, not after**
3. ⚠️ **Always use `--force-with-lease` when force pushing**
4. ⚠️ **Test after rebase**
5. ⚠️ **Create backup branches before major rebases**

### Common Commands

```bash
# Basic rebase
git rebase main
git rebase origin/main

# Interactive rebase
git rebase -i HEAD~5
git rebase -i main

# Conflict resolution
git rebase --continue
git rebase --abort
git rebase --skip

# Force push after rebase
git push --force-with-lease origin branch-name

# Cherry-pick
git cherry-pick <commit-hash>
git cherry-pick <hash1> <hash2>
git cherry-pick <start>..<end>
git cherry-pick -e <hash>  # Edit message
git cherry-pick -n <hash>  # Don't commit yet
git cherry-pick --continue
git cherry-pick --abort
```

### Editor Commands (When Interactive Rebase Opens)

**GNU Nano:**

- Save: `Ctrl + O`, then `Enter`
- Exit: `Ctrl + X`
- Save and Exit: `Ctrl + X`, then `Y`, then `Enter`

**Vim/Vi:**

- Save and Exit: `:wq` then `Enter`
- Exit without saving: `:q!` then `Enter`

**VS Code:**

- Save: `Ctrl+S`
- Close: `Ctrl+W`

---

## Conclusion

Git rebase and cherry-pick are powerful tools for managing commit history and selectively applying changes.

**Key Takeaways:**

1. **Rebase rewrites history** - Use carefully
2. **Git rebases automatically** when you use `--rebase` flag or configure it
3. **You rebase manually** for most feature branch workflows
4. **Never rebase shared branches** - Only your feature branches
5. **Always test after rebase** - Ensure nothing broke
6. **Use `--force-with-lease`** - Safer than `--force`
7. **Cherry-pick is selective** - Use it to apply specific commits, not entire branches
8. **Cherry-pick creates new commits** - Original commits remain in source branch
9. **Use cherry-pick for hotfixes** - Quick way to apply critical fixes to multiple branches

**Remember:** When in doubt, create a backup branch and experiment. Git is forgiving if you know how to use reflog to recover!
