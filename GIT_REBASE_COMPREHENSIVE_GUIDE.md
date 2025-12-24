# Git Rebase Comprehensive Guide

This guide provides a complete understanding of **git rebase**, covering what it is, when to use it, when git does it automatically, and when you need to do it manually. No doubts left!

---

## Table of Contents

1. [What is Git Rebase?](#what-is-git-rebase)
2. [How Git Rebase Works Internally](#how-git-rebase-works-internally)
3. [When to Use Git Rebase](#when-to-use-git-rebase)
4. [When Git Rebases Automatically](#when-git-rebases-automatically)
5. [When You Need to Rebase Manually](#when-you-need-to-rebase-manually)
6. [Basic Rebase Commands](#basic-rebase-commands)
7. [Interactive Rebase](#interactive-rebase)
8. [Rebase vs Merge: Complete Comparison](#rebase-vs-merge-complete-comparison)
9. [Step-by-Step Rebase Workflows](#step-by-step-rebase-workflows)
10. [Handling Conflicts During Rebase](#handling-conflicts-during-rebase)
11. [Common Scenarios and Solutions](#common-scenarios-and-solutions)
12. [Best Practices and Golden Rules](#best-practices-and-golden-rules)
13. [Common Mistakes and How to Avoid Them](#common-mistakes-and-how-to-avoid-them)
14. [Troubleshooting Rebase Issues](#troubleshooting-rebase-issues)
15. [Advanced Rebase Techniques](#advanced-rebase-techniques)

---

## What is Git Rebase?

### Definition

**Git rebase** is a Git command that moves or replays commits from one branch onto another branch. Instead of creating a merge commit (like `git merge` does), rebase takes your commits and replays them on top of the target branch, creating a linear, cleaner history.

### Visual Understanding

#### Before Rebase (with merge):

```
main:     A---B---C---D
                \
feature:         E---F---G
                      \
merge:                 M (merge commit)
```

#### After Rebase:

```
main:     A---B---C---D
                      \
feature:               E'---F'---G' (replayed commits)
```

**Key Point:** The commits E, F, G are recreated as E', F', G' with new commit hashes because they now have different parent commits.

### Core Concept

Rebase essentially says: _"Take my changes and pretend I started working from the latest commit on the target branch, not from where I originally branched off."_

---

## How Git Rebase Works Internally

### Step-by-Step Process

1. **Identify the common ancestor**: Git finds the point where your branch diverged from the target branch.

2. **Temporarily remove your commits**: Git saves your commits but removes them from the branch.

3. **Fast-forward to target branch**: Git moves your branch pointer to the latest commit of the target branch.

4. **Replay commits one by one**: Git applies your commits sequentially on top of the target branch.

5. **Create new commits**: Each replayed commit gets a new hash because its parent changed.

### What Happens to Commit Hashes?

- **Original commits**: `E`, `F`, `G` (with hashes like `abc123`, `def456`, `ghi789`)
- **After rebase**: `E'`, `F'`, `G'` (with NEW hashes like `xyz111`, `uvw222`, `rst333`)

**Important:** The commit content stays the same, but the hash changes because the parent commit changed.

---

## When to Use Git Rebase

### 1. **Before Merging a Feature Branch**

**Scenario:** You've been working on a feature branch, and main has moved forward with new commits.

**Why:** Creates a linear history without unnecessary merge commits.

**Example:**

```bash
# You're on feature-branch
git checkout feature-branch

# Rebase onto main to get latest changes
git rebase main

# Now your feature branch is on top of latest main
# Ready to merge with clean history
```

### 2. **Keeping Feature Branches Up to Date**

**Scenario:** You're working on a long-lived feature branch, and you want to incorporate changes from main regularly.

**Why:** Ensures your feature works with the latest code and reduces merge conflicts later.

**Example:**

```bash
# Weekly sync with main
git checkout feature-branch
git fetch origin
git rebase origin/main
```

### 3. **Cleaning Up Commit History**

**Scenario:** You have multiple small commits like "fix typo", "fix another typo", "update comment" that should be combined.

**Why:** Creates a cleaner, more professional commit history.

**Example:**

```bash
# Interactive rebase to squash commits
git rebase -i HEAD~5  # Last 5 commits
```

### 4. **Resolving Conflicts Incrementally**

**Scenario:** You have conflicts with the target branch, and you want to resolve them commit-by-commit.

**Why:** Easier to understand what changed and why conflicts occurred.

**Example:**

```bash
git rebase main
# Conflicts occur at commit 2 of 3
# Resolve conflicts for that specific commit
# Continue rebase
```

### 5. **Preparing for Code Review**

**Scenario:** Before creating a pull request, you want to ensure your branch is clean and up-to-date.

**Why:** Reviewers see a clean, linear history that's easier to review.

**Example:**

```bash
git checkout feature-branch
git rebase origin/main
git push --force-with-lease
```

### 6. **Fixing Mistakes in Recent Commits**

**Scenario:** You want to modify, reorder, or remove recent commits.

**Why:** Interactive rebase allows you to edit commit history before it's shared.

**Example:**

```bash
# Edit last 3 commits
git rebase -i HEAD~3
```

---

## When Git Rebases Automatically

### 1. **Using `git pull --rebase`**

**What happens:** Git automatically rebases your local commits on top of the remote changes.

**Example:**

```bash
# You have local commits
git commit -m "Local work"

# Remote has new commits
git pull --rebase origin main

# Git automatically:
# 1. Fetches remote changes
# 2. Temporarily removes your local commits
# 3. Fast-forwards to remote main
# 4. Replays your commits on top
```

**When this happens:** Every time you explicitly use `--rebase` flag with pull.

### 2. **Configured Pull Behavior**

**What happens:** If you configure git to always rebase on pull, it happens automatically.

**Setup:**

```bash
# Set rebase as default for pull
git config pull.rebase true

# Or globally for all repos
git config --global pull.rebase true

# Now regular git pull will rebase automatically
git pull  # Automatically rebases instead of merging
```

**When this happens:** Every time you run `git pull` after configuration.

**Check current setting:**

```bash
git config pull.rebase
# Returns: true, false, or nothing (defaults to false)
```

### 3. **GitHub/GitLab "Rebase and Merge" Button**

**What happens:** When you use the web interface to merge a pull request with "Rebase and merge" option.

**Example:**

1. Create pull request on GitHub
2. Click "Rebase and merge" button
3. GitHub automatically rebases your branch onto main
4. Creates a linear history

**When this happens:** Only when you explicitly choose "Rebase and merge" in the UI (not the default).

### 4. **Git Hooks and Automation Scripts**

**What happens:** If you have git hooks or CI/CD scripts that run rebase commands.

**Example:**

```bash
# In a pre-push hook
#!/bin/bash
git rebase origin/main
```

**When this happens:** When the hook or script is triggered (e.g., before push).

### 5. **GitHub Actions / CI/CD Pipelines**

**What happens:** Automated workflows can rebase branches.

**Example:**

```yaml
# .github/workflows/rebase.yml
- name: Rebase branch
  run: git rebase main
```

**When this happens:** When the workflow runs (manually triggered or on events).

---

## When You Need to Rebase Manually

### 1. **Standard Rebase Workflow**

**When:** Most common scenario - updating your feature branch with latest main.

**Command:**

```bash
git checkout feature-branch
git fetch origin
git rebase origin/main
```

**Why manual:** Git doesn't know when you want to rebase - you must explicitly tell it.

### 2. **Interactive Rebase for History Cleanup**

**When:** You want to edit, squash, reorder, or remove commits.

**Command:**

```bash
git rebase -i HEAD~5  # Last 5 commits
git rebase -i main    # All commits since branching from main
git rebase -i abc123  # From specific commit hash
```

**Why manual:** You need to make decisions about which commits to modify.

**Interactive rebase opens an editor:**

```
pick abc123 First commit
pick def456 Second commit
pick ghi789 Third commit

# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# d, drop = remove commit
```

### 3. **Rebasing After Conflicts**

**When:** Conflicts occur during rebase - git pauses and waits for you.

**Process:**

```bash
git rebase main

# Conflict occurs - git pauses
# You see:
# CONFLICT (content): Merge conflict in file.txt
#
# You must manually:
# 1. Open file.txt and resolve conflicts
# 2. Stage resolved file
git add file.txt

# 3. Continue rebase
git rebase --continue

# OR abort if you want to stop
git rebase --abort
```

**Why manual:** Git cannot automatically resolve conflicts - you must decide how to merge changes.

### 4. **Rebasing Before First Push**

**When:** You've made commits locally and want to rebase before pushing.

**Command:**

```bash
git checkout feature-branch
git rebase main
git push origin feature-branch
```

**Why manual:** Standard workflow - git doesn't assume you want to rebase.

### 5. **Rebasing After Already Pushing**

**When:** You've already pushed a branch but want to rebase it.

**Warning:** This rewrites history that others might be using!

**Command:**

```bash
git rebase main
git push --force-with-lease origin feature-branch
```

**Why manual:** Force pushing is dangerous - git requires explicit confirmation.

**Why `--force-with-lease` instead of `--force`:**

- `--force`: Overwrites remote branch regardless of what's there
- `--force-with-lease`: Only overwrites if remote hasn't changed (safer)

### 6. **Rebasing Onto a Different Base**

**When:** You want to change which commit your branch is based on.

**Command:**

```bash
# Rebase onto a specific commit
git rebase --onto main feature-branch~3 feature-branch

# This means: take commits from feature-branch~3 to feature-branch
# and replay them onto main
```

**Why manual:** Complex operation requiring explicit specification.

### 7. **Rebasing to Remove Sensitive Data**

**When:** You accidentally committed passwords, API keys, or other sensitive data.

**Command:**

```bash
# Interactive rebase to edit the commit
git rebase -i HEAD~5
# Mark commit as 'edit'
# Remove sensitive data
git commit --amend
git rebase --continue
```

**Why manual:** Security-sensitive operation requiring careful review.

---

## Basic Rebase Commands

### Standard Rebase

```bash
# Rebase current branch onto main
git rebase main

# Rebase onto remote main
git rebase origin/main

# Rebase onto a specific commit
git rebase abc123
```

### Rebase with Options

```bash
# Continue rebase after resolving conflicts
git rebase --continue

# Abort rebase and return to original state
git rebase --abort

# Skip current commit (if you want to drop it)
git rebase --skip

# Show current rebase status
git rebase --show-current-patch
```

### Fetch and Rebase

```bash
# Fetch latest changes and rebase
git fetch origin
git rebase origin/main

# Or combine (if pull.rebase is configured)
git pull --rebase
```

---

## Interactive Rebase

### What is Interactive Rebase?

Interactive rebase (`git rebase -i`) allows you to modify commits before they're replayed. You can:

- **Pick**: Keep the commit as-is
- **Reword**: Change the commit message
- **Edit**: Modify the commit content
- **Squash**: Combine with previous commit
- **Fixup**: Like squash but discard message
- **Drop**: Remove the commit entirely

### Common Interactive Rebase Scenarios

#### 1. Squash Multiple Commits

**Goal:** Combine several small commits into one.

```bash
git rebase -i HEAD~5
```

**Editor shows:**

```
pick abc123 Add login feature
pick def456 Fix typo
pick ghi789 Update comment
pick jkl012 Another typo fix
pick mno345 Final cleanup
```

**Change to:**

```
pick abc123 Add login feature
squash def456 Fix typo
squash ghi789 Update comment
squash jkl012 Another typo fix
squash mno345 Final cleanup
```

**Result:** One commit "Add login feature" containing all changes.

#### 2. Reword Commit Messages

**Goal:** Fix typo in commit message or improve clarity.

```bash
git rebase -i HEAD~3
```

**Change:**

```
pick abc123 Fix bug
pick def456 Add feature
pick ghi789 Update docs
```

**To:**

```
reword abc123 Fix bug
pick def456 Add feature
pick ghi789 Update docs
```

**Result:** Git opens editor for each "reword" commit to edit message.

#### 3. Reorder Commits

**Goal:** Change the order of commits.

```bash
git rebase -i HEAD~4
```

**Original order:**

```
pick abc123 Commit 1
pick def456 Commit 2
pick ghi789 Commit 3
pick jkl012 Commit 4
```

**Reorder:**

```
pick def456 Commit 2
pick abc123 Commit 1
pick jkl012 Commit 4
pick ghi789 Commit 3
```

**Result:** Commits replayed in new order.

#### 4. Edit Commit Content

**Goal:** Modify files in a past commit.

```bash
git rebase -i HEAD~3
```

**Change:**

```
edit abc123 Add feature
pick def456 Fix bug
pick ghi789 Update docs
```

**Git stops at commit abc123:**

```bash
# Make your changes
git add file.txt
git commit --amend
git rebase --continue
```

#### 5. Drop Commits

**Goal:** Remove unwanted commits.

```bash
git rebase -i HEAD~5
```

**Change:**

```
pick abc123 Good commit
drop def456 Bad commit
pick ghi789 Another good commit
```

**Result:** Bad commit is removed from history.

### Interactive Rebase Tips

1. **Start small:** Practice with `HEAD~3` before larger rebases
2. **One operation at a time:** Don't try to do everything in one rebase
3. **Backup first:** Create a backup branch before major rebases
   ```bash
   git branch backup-branch
   git rebase -i HEAD~10
   ```

---

## Rebase vs Merge: Complete Comparison

### Visual Comparison

#### Merge Approach:

```
main:     A---B---C---D
                \       \
feature:         E---F---M (merge commit)
```

#### Rebase Approach:

```
main:     A---B---C---D
                      \
feature:               E'---F' (linear history)
```

### Detailed Comparison Table

| Aspect                  | Git Merge                           | Git Rebase                     |
| ----------------------- | ----------------------------------- | ------------------------------ |
| **History**             | Preserves exact branching structure | Creates linear history         |
| **Merge Commits**       | Creates merge commit                | No merge commits               |
| **Commit Hashes**       | Preserves original hashes           | Creates new hashes             |
| **Complexity**          | Simple, safe                        | More complex, rewrites history |
| **Conflict Resolution** | One merge conflict resolution       | Resolve conflicts per commit   |
| **When to Use**         | Public/shared branches              | Private feature branches       |
| **History Clarity**     | Can be messy with many branches     | Clean, linear, easy to read    |
| **Risk Level**          | Low risk                            | Higher risk (rewrites history) |
| **Collaboration**       | Safe for shared branches            | Dangerous for shared branches  |

### When to Use Merge

1. **Merging into main/master**: Preserves exact history
2. **Shared branches**: Others might be working on the branch
3. **Public repositories**: Don't rewrite public history
4. **When you want merge commits**: Some teams prefer explicit merge commits

### When to Use Rebase

1. **Feature branches**: Before merging into main
2. **Personal branches**: Only you are working on it
3. **Clean history**: Want linear, easy-to-read history
4. **Before code review**: Clean up commits before PR

### Hybrid Approach

Many teams use both:

- **Rebase** feature branches before merging
- **Merge** into main to preserve history
- Result: Clean history with preserved merge points

---

## Step-by-Step Rebase Workflows

### Workflow 1: Standard Feature Branch Rebase

**Scenario:** You've been working on a feature, and main has new commits.

```bash
# Step 1: Ensure you're on your feature branch
git checkout feature-branch

# Step 2: Fetch latest changes from remote
git fetch origin

# Step 3: Rebase onto latest main
git rebase origin/main

# Step 4: If conflicts occur, resolve them
# (See "Handling Conflicts" section)

# Step 5: Push your rebased branch
git push --force-with-lease origin feature-branch
```

### Workflow 2: Rebase Before Creating Pull Request

**Scenario:** You're ready to create a PR but want clean history.

```bash
# Step 1: Make sure main is up to date
git checkout main
git pull origin main

# Step 2: Switch to feature branch
git checkout feature-branch

# Step 3: Rebase onto main
git rebase main

# Step 4: Resolve any conflicts
git add .
git rebase --continue

# Step 5: Push rebased branch
git push --force-with-lease origin feature-branch

# Step 6: Create pull request
# (Now your PR shows clean, linear history)
```

### Workflow 3: Regular Sync with Main

**Scenario:** Long-lived feature branch that needs regular updates.

```bash
# Weekly sync routine
git checkout feature-branch

# Fetch latest
git fetch origin

# Rebase onto main
git rebase origin/main

# Test your feature still works
npm test  # or your test command

# Push if everything works
git push --force-with-lease origin feature-branch
```

### Workflow 4: Clean Up Commits Before Push

**Scenario:** You have messy commit history locally.

```bash
# Step 1: See your recent commits
git log --oneline -10

# Step 2: Interactive rebase to clean up
git rebase -i HEAD~10

# Step 3: In editor, squash/fixup/reword commits
# Save and close

# Step 4: If editing commits, git will pause
# Make changes, then:
git add .
git commit --amend
git rebase --continue

# Step 5: Push cleaned history
git push --force-with-lease origin feature-branch
```

### Workflow 5: Rebase After Pull Request Feedback

**Scenario:** You got feedback on PR and need to make changes.

```bash
# Step 1: Make changes locally
git checkout feature-branch
# Edit files
git add .
git commit -m "Address PR feedback"

# Step 2: Rebase to keep history clean
git rebase -i HEAD~2  # Include your new commit

# Step 3: Squash or reword as needed
# Step 4: Push
git push --force-with-lease origin feature-branch

# PR automatically updates with new commits
```

---

## Handling Conflicts During Rebase

### Understanding Rebase Conflicts

During rebase, conflicts occur when:

- The same file was modified in both branches
- Git cannot automatically determine which changes to keep

### Conflict Resolution Process

#### Step 1: Rebase Starts

```bash
git rebase main
```

**Output:**

```
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt
error: could not apply abc123... Your commit message
hint: Resolve all conflicts manually, mark them as resolved with
hint: "git add/rm <conflicted_files>", then run "git rebase --continue".
```

#### Step 2: Identify Conflicted Files

```bash
git status
```

**Shows:**

```
interactive rebase in progress; onto def456
Last command done (1 command done):
   pick abc123 Your commit message
No commands remaining.
You are currently rebasing branch 'feature' on 'def456'.
  (fix conflicts and then run "git rebase --continue")
  (use "git rebase --skip" to skip this commit)
  (use "git rebase --abort" to cancel the rebase)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   file.txt
```

#### Step 3: Open and Resolve Conflicts

Open `file.txt` and look for conflict markers:

```
<<<<<<< HEAD
Code from main branch
=======
Your code from feature branch
>>>>>>> abc123 (Your commit message)
```

**Resolve by:**

1. **Keeping both changes:**

```
Code from main branch
Your code from feature branch
```

2. **Keeping only main:**

```
Code from main branch
```

3. **Keeping only yours:**

```
Your code from feature branch
```

4. **Custom merge:**

```
Your merged version of the code
```

#### Step 4: Stage Resolved Files

```bash
git add file.txt
```

#### Step 5: Continue Rebase

```bash
git rebase --continue
```

**If more conflicts occur:** Repeat steps 2-5 for each conflicted commit.

#### Step 6: Complete Rebase

```bash
# When all conflicts resolved
Successfully rebased and updated refs/heads/feature-branch.
```

### Aborting Rebase

If conflicts are too complex or you want to start over:

```bash
git rebase --abort
```

**Result:** Returns to state before rebase started.

### Skipping a Commit

If you want to drop the commit causing conflict:

```bash
git rebase --skip
```

**Warning:** This permanently removes the commit from history.

### Conflict Resolution Tips

1. **One commit at a time:** Rebase resolves conflicts commit-by-commit
2. **Understand the context:** Read commit messages to understand changes
3. **Test after resolution:** Ensure code still works
4. **Use merge tools:** `git mergetool` opens visual merge tool
5. **Keep backup:** Create backup branch before rebase
   ```bash
   git branch backup-feature
   git rebase main
   ```

---

## Common Scenarios and Solutions

### Scenario 1: "I Already Pushed My Branch"

**Problem:** You want to rebase but already pushed to remote.

**Solution:**

```bash
# Rebase locally
git rebase main

# Force push (use --force-with-lease for safety)
git push --force-with-lease origin feature-branch
```

**Warning:** Only do this if:

- You're the only one working on the branch
- Or you've coordinated with your team

### Scenario 2: "Someone Else Pushed to My Branch"

**Problem:** You rebased locally, but someone else pushed commits to remote.

**Solution:**

```bash
# Fetch their changes
git fetch origin

# Rebase again to include their commits
git rebase origin/feature-branch

# Or merge their changes first
git merge origin/feature-branch
# Then rebase
git rebase main
```

**Better approach:** Coordinate with team or use merge instead.

### Scenario 3: "I Want to Undo a Rebase"

**Problem:** Rebase went wrong and you want to undo it.

**Solution:**

```bash
# Find the commit before rebase
git reflog

# Reset to that commit
git reset --hard HEAD@{2}  # Use number from reflog
```

**Or if you just finished rebase:**

```bash
git rebase --abort  # If still in rebase
# OR
git reset --hard ORIG_HEAD  # If rebase completed
```

### Scenario 4: "Rebase Takes Too Long"

**Problem:** Rebase is slow with many commits.

**Solution:**

```bash
# Use merge instead for this time
git merge main

# Or rebase in smaller chunks
git rebase -i HEAD~10  # Rebase last 10 commits
```

### Scenario 5: "I Want to Rebase Only Some Commits"

**Problem:** You want to rebase onto a different base commit.

**Solution:**

```bash
# Rebase onto specific commit
git rebase --onto main feature-branch~5 feature-branch

# This takes commits from feature-branch~5 to feature-branch
# and replays them onto main
```

### Scenario 6: "I Accidentally Rebased Main"

**Problem:** You rebased main branch (should never do this).

**Solution:**

```bash
# Immediately undo
git reflog
git reset --hard HEAD@{1}  # Before rebase

# Warn your team if you already pushed
# They'll need to reset their local main
```

### Scenario 7: "Rebase Created Duplicate Commits"

**Problem:** After rebase, you see duplicate commits.

**Cause:** You rebased onto a branch that already had your commits.

**Solution:**

```bash
# Check what happened
git log --oneline --graph --all

# If duplicates exist, use interactive rebase to remove them
git rebase -i main
# Drop duplicate commits
```

### Scenario 8: "I Want to Rebase But Keep Merge Commits"

**Problem:** You want linear history but preserve some merge commits.

**Solution:**

```bash
# Use --preserve-merges (deprecated) or --rebase-merges
git rebase --rebase-merges main
```

---

## Best Practices and Golden Rules

### Golden Rule #1: Never Rebase Public/Shared Branches

**Rule:** Never rebase branches that others are working on.

**Why:** Rebase rewrites history. If others have based work on your commits, their work will break.

**Safe to rebase:**

- ✅ Your personal feature branches
- ✅ Branches only you work on
- ✅ Before creating pull request

**Never rebase:**

- ❌ main/master branch
- ❌ Branches others are using
- ❌ Already-merged branches

### Golden Rule #2: Rebase Before Merging, Not After

**Rule:** Rebase your feature branch before merging into main.

**Why:** Creates clean history in main without affecting others.

**Workflow:**

```bash
# ✅ Good: Rebase feature branch
git checkout feature-branch
git rebase main
git checkout main
git merge feature-branch  # Fast-forward merge

# ❌ Bad: Rebase main
git checkout main
git rebase feature-branch  # DON'T DO THIS
```

### Golden Rule #3: Always Use `--force-with-lease` When Force Pushing

**Rule:** Use `--force-with-lease` instead of `--force` when pushing after rebase.

**Why:** Safer - only pushes if remote hasn't changed.

```bash
# ✅ Good
git push --force-with-lease origin feature-branch

# ❌ Dangerous
git push --force origin feature-branch
```

### Best Practice #1: Keep Feature Branches Short-Lived

**Practice:** Rebase frequently and merge quickly.

**Why:** Reduces conflicts and keeps history manageable.

**Routine:**

```bash
# Daily or before major work
git fetch origin
git rebase origin/main
```

### Best Practice #2: Test After Rebase

**Practice:** Always test your code after rebasing.

**Why:** Rebase can introduce issues, especially with conflicts.

```bash
git rebase main
npm test  # Run your tests
# Only push if tests pass
```

### Best Practice #3: Create Backup Branches

**Practice:** Create backup before major rebases.

**Why:** Easy recovery if something goes wrong.

```bash
git branch backup-feature-branch
git rebase main
# If something goes wrong:
git reset --hard backup-feature-branch
```

### Best Practice #4: Rebase One Feature at a Time

**Practice:** Don't rebase multiple unrelated features together.

**Why:** Easier to understand and resolve conflicts.

### Best Practice #5: Write Clear Commit Messages

**Practice:** Good commit messages make rebase easier.

**Why:** When conflicts occur, clear messages help understand changes.

### Best Practice #6: Rebase Before Code Review

**Practice:** Clean up commits before creating pull request.

**Why:** Reviewers see clean, logical commit history.

```bash
# Before PR
git rebase -i main  # Clean up commits
git push --force-with-lease
# Create PR
```

### Best Practice #7: Communicate with Team

**Practice:** Tell team when you're rebasing shared branches.

**Why:** Prevents conflicts and confusion.

**Example:**

```
Team chat: "Rebasing feature-branch, will force push in 10 min"
```

---

## Common Mistakes and How to Avoid Them

### Mistake #1: Rebasing Main/Master Branch

**Mistake:**

```bash
git checkout main
git rebase feature-branch  # ❌ WRONG
```

**Why it's bad:** Main is shared by everyone. Rebasing rewrites history others depend on.

**Correct approach:**

```bash
git checkout feature-branch
git rebase main  # ✅ CORRECT
git checkout main
git merge feature-branch
```

### Mistake #2: Force Pushing Without `--force-with-lease`

**Mistake:**

```bash
git push --force origin feature-branch  # ❌ DANGEROUS
```

**Why it's bad:** Overwrites remote branch even if others pushed changes.

**Correct approach:**

```bash
git push --force-with-lease origin feature-branch  # ✅ SAFER
```

### Mistake #3: Rebasing Already-Merged Branches

**Mistake:**

```bash
# Branch already merged to main
git checkout merged-feature
git rebase main  # ❌ UNNECESSARY
```

**Why it's bad:** Creates duplicate commits and confusion.

**Correct approach:** Don't rebase merged branches. They're done.

### Mistake #4: Not Testing After Rebase

**Mistake:**

```bash
git rebase main
git push --force-with-lease  # ❌ Without testing
```

**Why it's bad:** Rebase can break code, especially with conflicts.

**Correct approach:**

```bash
git rebase main
npm test  # ✅ Test first
git push --force-with-lease  # Only if tests pass
```

### Mistake #5: Rebasing Branches Others Are Using

**Mistake:**

```bash
# Teammate is also working on this branch
git rebase main
git push --force  # ❌ BREAKS TEAMMATE'S WORK
```

**Why it's bad:** Teammate's local branch becomes out of sync.

**Correct approach:**

- Coordinate with team
- Or use merge instead
- Or create your own branch

### Mistake #6: Aborting Rebase When Almost Done

**Mistake:**

```bash
# Resolved 8 of 10 conflicts
git rebase --abort  # ❌ WASTES WORK
```

**Why it's bad:** Loses all conflict resolution work.

**Correct approach:** Continue and finish:

```bash
git rebase --continue  # ✅ Finish the job
```

### Mistake #7: Interactive Rebase Without Understanding

**Mistake:**

```bash
git rebase -i HEAD~20  # ❌ Too many commits, unclear what to do
```

**Why it's bad:** Easy to make mistakes with many commits.

**Correct approach:**

```bash
git rebase -i HEAD~5  # ✅ Start small, learn gradually
```

### Mistake #8: Not Fetching Before Rebase

**Mistake:**

```bash
git rebase main  # ❌ Using stale local main
```

**Why it's bad:** Rebasing onto outdated branch defeats the purpose.

**Correct approach:**

```bash
git fetch origin  # ✅ Get latest
git rebase origin/main
```

### Mistake #9: Rebasing During Active Development

**Mistake:**

```bash
# In middle of coding
git rebase main  # ❌ Interrupts workflow
```

**Why it's bad:** Rebase can take time, especially with conflicts.

**Correct approach:** Rebase at natural break points:

- Before starting new feature
- Before creating PR
- End of day/week

### Mistake #10: Forgetting to Push After Rebase

**Mistake:**

```bash
git rebase main
# Forget to push
# Work continues on old remote version
```

**Why it's bad:** Local and remote diverge.

**Correct approach:**

```bash
git rebase main
git push --force-with-lease  # ✅ Push immediately
```

---

## Troubleshooting Rebase Issues

### Issue #1: "Rebase Conflicts That Won't Resolve"

**Symptoms:** Conflicts keep appearing, can't resolve.

**Solutions:**

1. **Use merge tool:**

```bash
git mergetool
```

2. **Accept one version entirely:**

```bash
# Keep theirs (main branch)
git checkout --theirs file.txt
git add file.txt
git rebase --continue

# Keep yours (feature branch)
git checkout --ours file.txt
git add file.txt
git rebase --continue
```

3. **Abort and use merge instead:**

```bash
git rebase --abort
git merge main  # Use merge for this time
```

### Issue #2: "Rebase Stuck in Interactive Mode"

**Symptoms:** Editor won't close, rebase paused.

**Solutions:**

1. **Save and close editor:**

   - In vim: `:wq` then Enter
   - In nano: `Ctrl+X`, then `Y`, then Enter
   - In VS Code: Save and close

2. **If editor won't close:**

```bash
# In another terminal
git rebase --abort
# Then try again with different editor
GIT_EDITOR=nano git rebase -i HEAD~5
```

### Issue #3: "Lost Commits After Rebase"

**Symptoms:** Commits disappeared after rebase.

**Recovery:**

```bash
# Find lost commits
git reflog

# See commit hashes and messages
# Reset to before rebase
git reset --hard HEAD@{5}  # Use number from reflog

# Or cherry-pick specific commits
git cherry-pick abc123
```

### Issue #4: "Rebase Created Empty Commits"

**Symptoms:** After rebase, some commits are empty.

**Cause:** Commits were already in target branch.

**Solution:**

```bash
# Interactive rebase to remove empty commits
git rebase -i main
# Drop empty commits in editor
```

### Issue #5: "Cannot Rebase: Uncommitted Changes"

**Symptoms:** Git won't start rebase.

**Error:** "Cannot rebase: You have uncommitted changes"

**Solution:**

```bash
# Option 1: Commit changes
git add .
git commit -m "WIP: Save current work"
git rebase main

# Option 2: Stash changes
git stash
git rebase main
git stash pop

# Option 3: Create new branch for changes
git checkout -b temp-branch
git add .
git commit -m "Changes"
git checkout feature-branch
git rebase main
```

### Issue #6: "Rebase Loop: Same Conflict Repeatedly"

**Symptoms:** Same conflict appears in every commit.

**Cause:** Conflict resolution wasn't applied correctly.

**Solution:**

```bash
# Abort rebase
git rebase --abort

# Use merge instead
git merge main

# Or resolve conflict once, then:
git add .
git commit --amend
git rebase --continue
```

### Issue #7: "Remote Rejected After Rebase"

**Symptoms:** Push rejected even with `--force-with-lease`.

**Error:** "Updates were rejected"

**Causes and Solutions:**

1. **Remote has new commits:**

```bash
git fetch origin
git rebase origin/feature-branch
git push --force-with-lease
```

2. **Branch protection rules:**

   - Check repository settings
   - May need admin override
   - Or use merge instead

3. **Someone else force-pushed:**

```bash
git fetch origin
git reset --hard origin/feature-branch
# Then rebase again
```

### Issue #8: "Rebase Takes Forever"

**Symptoms:** Rebase is very slow.

**Solutions:**

1. **Check what's happening:**

```bash
git rebase --show-current-patch
```

2. **Use merge for this time:**

```bash
git rebase --abort
git merge main
```

3. **Rebase in smaller chunks:**

```bash
git rebase -i HEAD~10  # Smaller number
```

### Issue #9: "Wrong Base Branch for Rebase"

**Symptoms:** Rebased onto wrong branch.

**Solution:**

```bash
# Abort if still in progress
git rebase --abort

# Or reset if completed
git reflog
git reset --hard HEAD@{2}  # Before wrong rebase

# Rebase onto correct branch
git rebase correct-branch
```

### Issue #10: "Git Says 'No Changes' After Rebase"

**Symptoms:** Rebase completes but no changes visible.

**Cause:** Your commits were already in target branch.

**Solution:** This is normal - your branch is now up to date. No action needed.

---

## Advanced Rebase Techniques

### Technique #1: Rebase Onto Different Base

**Use case:** Change which commit your branch starts from.

```bash
# Current state:
# main: A---B---C---D
# feature:     E---F---G

# Rebase feature commits onto C instead of B
git rebase --onto main~1 feature-branch~3 feature-branch

# Result: feature commits now based on C
```

### Technique #2: Rebase with Preserved Merges

**Use case:** Keep merge commits during rebase.

```bash
# Rebase but preserve merge structure
git rebase --rebase-merges main
```

### Technique #3: Rebase Only Specific Files

**Use case:** Rebase but keep some files from target branch.

```bash
# Rebase normally
git rebase main

# During conflict, use checkout to get file from main
git checkout --theirs important-file.txt
git add important-file.txt
git rebase --continue
```

### Technique #4: Rebase with Autosquash

**Use case:** Automatically squash fixup commits.

```bash
# Create fixup commit
git commit --fixup abc123

# Rebase with autosquash
git rebase -i --autosquash abc123~1
# Fixup commit automatically squashed into abc123
```

### Technique #5: Rebase with Exec Commands

**Use case:** Run tests after each commit during rebase.

```bash
git rebase -i main

# In editor, add 'exec' commands:
pick abc123 Commit 1
exec npm test
pick def456 Commit 2
exec npm test
```

### Technique #6: Rebase with Strategy Options

**Use case:** Control how conflicts are resolved.

```bash
# Prefer our changes
git rebase -X ours main

# Prefer their changes
git rebase -X theirs main

# Ignore whitespace
git rebase --ignore-whitespace main
```

### Technique #7: Rebase with Committer Date Preservation

**Use case:** Keep original commit dates.

```bash
git rebase --committer-date-is-author-date main
```

### Technique #8: Partial Rebase

**Use case:** Rebase only some commits.

```bash
# Rebase commits from feature-branch~5 to feature-branch~2
git rebase --onto main feature-branch~5 feature-branch~2
```

---

## Summary: Quick Reference

### When Git Rebases Automatically

1. ✅ `git pull --rebase` - Explicit flag
2. ✅ `git pull` - If `pull.rebase = true` configured
3. ✅ GitHub/GitLab "Rebase and merge" button
4. ✅ Git hooks/scripts that run rebase
5. ✅ CI/CD pipelines with rebase commands

### When You Must Rebase Manually

1. ✅ Standard feature branch update: `git rebase main`
2. ✅ Interactive rebase: `git rebase -i HEAD~5`
3. ✅ Resolving conflicts: `git rebase --continue`
4. ✅ Before first push: `git rebase main`
5. ✅ After already pushing: `git rebase main` + `git push --force-with-lease`
6. ✅ Rebase onto different base: `git rebase --onto`
7. ✅ Removing sensitive data: `git rebase -i` to edit

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

# Check rebase status
git rebase --show-current-patch
```

---

## Conclusion

Git rebase is a powerful tool for maintaining clean, linear commit history. Understanding when git does it automatically versus when you need to do it manually is crucial for effective version control.

**Key Takeaways:**

1. **Rebase rewrites history** - Use carefully
2. **Git rebases automatically** when you use `--rebase` flag or configure it
3. **You rebase manually** for most feature branch workflows
4. **Never rebase shared branches** - Only your feature branches
5. **Always test after rebase** - Ensure nothing broke
6. **Use `--force-with-lease`** - Safer than `--force`

With this guide, you should have no doubts about git rebase! Practice with small branches first, and you'll become comfortable with rebasing in no time.

---

**Remember:** When in doubt, create a backup branch and experiment. Git is forgiving if you know how to use reflog to recover!
