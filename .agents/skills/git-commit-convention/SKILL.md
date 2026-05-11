---
name: git-commit-convention
description: Generate concise, present-tense Git commit messages following conventional standards. Use when asked to "/commit", "commit my changes", "generate a commit message", or "format this commit".
---

# Git Commit Skill

Create well-formatted git commits following conventional commit standards.

## Behavior

1. Analyze staged changes with `git diff --staged`
2. Generate a conventional commit message
3. Use present tense (e.g., "add" instead of "added").
4. Keep it short: Aim for a subject line of 50 characters or less.
5. Create the commit with proper formatting

## Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Types

- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding or modifying tests
- chore: Maintenance tasks

## Example Output

```
feat(auth): add password reset functionality

- Add forgot password form
- Implement email verification flow
- Add password reset endpoint
```
