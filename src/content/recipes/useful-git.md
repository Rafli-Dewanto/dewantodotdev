---
title: 'Useful Git Commands'
description: .
publishDate: 'Sep 08 2024'
isFeatured: false
seo:
  image:
    src: ''
    alt: ''
---

## squash n last commits

```bash
# Reset the current branch to the commit just before the last 12:
git reset --hard HEAD~12

# HEAD@{1} is where the branch was just before the previous command.
# This command sets the state of the index to be as it would just
# after a merge from that commit:
git merge --squash HEAD@{1}

# Commit those squashed changes.  The commit message will be helpfully
# prepopulated with the commit messages of all the squashed commits:
git commit
```

edit commit message (you can also use this command to squash n last commits)

```bash
git rebase -i HEAD~N
```

edit commit message ("update msg")

```bash
pick dc4de80 update ini harusnya dibawah
r 26c2cb3 update msg

# Rebase a2c229d..26c2cb3 onto a2c229d (2 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
#         create a merge commit using the original merge commit's
#         message (or the oneline, if no original merge commit was
#         specified); use -c <commit> to reword the commit message
# u, update-ref <ref> = track a placeholder for the <ref> to be updated
#                       to this position in the new commits. The <ref> is
#                       updated at the end of the rebase
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#

```

```bash
message updated

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Fri Mar 29 13:22:27 2024 +0700
#
# interactive rebase in progress; onto a2c229d
# Last commands done (2 commands done):
#    pick dc4de80 update ini harusnya dibawah
#    reword 26c2cb3 update msg
# No commands remaining.
# You are currently editing a commit while rebasing branch 'feature3' on 'a2c229d'.
#
# Changes to be committed:
#	modified:   file2.txt
#

```

```bash
commit 67bcdeafda30e65078f6d4f4c6c9da345b245912
Author: Rafli Dewanto <intern-rafli.dewanto@erajaya.com>
Date:   Fri Mar 29 13:22:27 2024 +0700

    message updated

commit dc4de80b273756d75f58ffc9a22fc098fb45dbfa
Author: Rafli Dewanto <intern-rafli.dewanto@erajaya.com>
Date:   Fri Mar 29 13:22:12 2024 +0700

    update ini harusnya dibawah

commit a2c229d67fbdedc25d29655c3f0242e1ea7044ea
Merge: ce52c30 924c42b
Author: Rafli Satya Dewanto <raflidewanto97@gmail.com>
Date:   Fri Mar 29 12:59:18 2024 +0700

    Merge pull request #1 from Rafli-Dewanto/feature

    update file 2

commit 924c42b9b2cb531edbc29491371695918591d443
Author: Rafli Dewanto <intern-rafli.dewanto@erajaya.com>
Date:   Fri Mar 29 12:58:48 2024 +0700

    update file 2

commit ce52c3042a266a4ffb4c1e26a14de9ed786601a4
Author: Rafli Dewanto <intern-rafli.dewanto@erajaya.com>
Date:   Fri Mar 29 12:56:17 2024 +0700

    init

```

## HEAD ~ ^

In Git version control, `HEAD`, `~`, and `^` are references used to navigate and specify commits in the repository. Here's what each of them means:

### HEAD

- **HEAD** is a pointer to the current branch reference. It points to the most recent commit on the branch you are currently working on.
- You can think of **HEAD** as the "current place" in the repository history where you are working.
- When you make a new commit, **HEAD** moves forward to this new commit.

### ~ (Tilde)

- The tilde `~` is used to indicate "first parent" commits in the commit history.
- `HEAD~` refers to the commit that is the parent of `HEAD`, i.e., the commit just before `HEAD`.
- You can chain tildes to move further back in history: `HEAD~2` refers to the grandparent of the `HEAD` commit (the parent of the parent), `HEAD~3` refers to the great-grandparent, and so on.

### ^ (Caret)

- The caret `^` is also used to indicate parent commits, but it provides more flexibility when dealing with merge commits.
- `HEAD^` refers to the first parent of `HEAD`, which is similar to `HEAD~`.
- `HEAD^2` refers to the second parent of `HEAD` in the case of a merge commit (a commit that has more than one parent). Merge commits have multiple parents because they are the result of combining two branches.

### Examples

- **HEAD^**: The first parent of `HEAD` (typically the same as `HEAD~1`).
- **HEAD~1** or **HEAD~**: The commit before the current `HEAD`.
- **HEAD~2**: The commit before the parent of the current `HEAD`.
- **HEAD^2**: The second parent of `HEAD` (relevant for merge commits).

### Practical Usage

- To view the commit history, you might use: `git log`.
- To reset to a previous commit (dangerous, as it alters history), you might use: `git reset --hard HEAD~1`.
- To create a new branch from a previous commit: `git checkout -b new-branch HEAD~2`.

These references allow you to traverse the commit history easily and perform various operations on specific commits.

## Undo stuff

In Git, there are several ways to undo a commit, depending on what you want to achieve. Here are some common ways:

### 1. **`git revert`**

This creates a new commit that undoes the changes from a previous commit, leaving the history intact. Use this when you want to preserve the commit history.

```bash
git revert <commit-hash>
```

### 2. **`git reset --hard`**

This resets the current branch to a specified commit and discards all changes, including uncommitted changes. This method is **destructive** because it alters the commit history.

```bash
git reset --hard <commit-hash>
```

### 3. **`git reset --soft`**

This resets the current branch to a specified commit but keeps the changes in the working directory and staging area. It's useful when you want to undo a commit but keep the changes for further modifications.

```bash
git reset --soft <commit-hash>
```

### 4. **`git reset --mixed`**

Similar to `--soft`, but it resets the index without changing the working directory. This means the changes are removed from the staging area but remain in the working directory.

```bash
git reset --mixed <commit-hash>
```

### 5. **`git checkout`**

If you want to temporarily go back to a previous commit without altering the history, you can use `checkout` to switch to a different commit.

```bash
git checkout <commit-hash>
```

This is useful for reviewing or testing past versions, but you can't commit changes on this detached `HEAD` state without creating a new branch.

### 6. **`git cherry-pick`**

You can use this command to undo a commit by applying the changes from a different commit or range of commits. You can use it to apply a specific commit again or revert one.

```bash
git cherry-pick <commit-hash>
```

### 7. **`git reset HEAD~1`**

If you want to undo the latest commit but keep your changes unstaged (so you can edit or stage them again), you can reset to the previous commit.

```bash
git reset HEAD~1
```

This will keep the changes in your working directory but remove the commit from history.

### 8. **`git reflog`**

If you've made changes that you're now regretting (like a `reset --hard`), `git reflog` can help you recover lost commits. This command shows a log of all `HEAD` movements, allowing you to reset to a previously lost commit.

```bash
git reflog
git reset --hard <commit-hash>
```

Each method serves a different purpose, so choose the one that suits your specific situation!
