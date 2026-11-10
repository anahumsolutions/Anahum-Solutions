# Contributing to Anahum Solutions

Thank you for your interest in contributing to the Anahum Solutions website.

This document defines the development standards, Git workflow, commit conventions, formatting rules, and Pull Request requirements that every contributor must follow.

All contributors are expected to read and follow these guidelines before making changes.

---

## 1. Contribution Principles

Every contribution should follow these principles:

- Maintain the existing design system and brand identity.
- Write clean, readable, and maintainable code.
- Follow the established project structure.
- Avoid unnecessary dependencies.
- Preserve responsive layouts and accessibility.
- Test changes before submitting a Pull Request.
- Never commit API keys, credentials, passwords, or environment secrets.

## 2. Getting Started

### Prerequisites

- Node.js 20 or later recommended.
- npm 9 or later.
- Git.
- A GitHub account.

### Clone the Repository

```bash
git clone https://github.com/anahumsolutions/Anahum-Solutions.git
```

Navigate into the project:

```bash
cd Anahum-Solutions
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

## 3. Branching Strategy

**Never work directly on the `main` branch.**

Every contribution must be developed in a separate branch.

Use the following branch naming conventions:

| Branch Prefix | Purpose                    | Example                      |
| ------------- | -------------------------- | ---------------------------- |
| `feat/`       | New features               | `feat/hero-animation`        |
| `fix/`        | Bug fixes                  | `fix/mobile-navigation`      |
| `refactor/`   | Code restructuring         | `refactor/header-components` |
| `style/`      | Visual and styling updates | `style/button-design`        |
| `docs/`       | Documentation changes      | `docs/update-readme`         |
| `perf/`       | Performance improvements   | `perf/image-optimization`    |
| `test/`       | Test-related changes       | `test/navigation-tests`      |
| `chore/`      | Maintenance tasks          | `chore/update-dependencies`  |

### Create a New Branch

Make sure your local `main` branch is up to date:

```bash
git switch main
git pull origin main
```

Create your working branch:

```bash
git switch -c feat/your-feature-name
```

Example:

```bash
git switch -c feat/hero-animation
```

Use lowercase letters and hyphens in branch names.

## 4. Commit Message Convention

This repository follows the **Conventional Commits** specification.

Every commit message must follow this structure:

```text
type: short description
```

### Accepted Commit Types

| Type       | Purpose                            |
| ---------- | ---------------------------------- |
| `feat`     | Introduce a new feature            |
| `fix`      | Fix a bug                          |
| `docs`     | Documentation changes              |
| `style`    | Formatting or styling changes      |
| `refactor` | Code restructuring                 |
| `perf`     | Performance improvements           |
| `test`     | Add or update tests                |
| `build`    | Build system or dependency changes |
| `ci`       | CI/CD configuration changes        |
| `chore`    | General maintenance                |
| `revert`   | Revert a previous commit           |

### Valid Commit Examples

```bash
git commit -m "feat: add hero animation"
git commit -m "fix: resolve mobile navigation issue"
git commit -m "docs: update contributing guidelines"
git commit -m "style: improve button spacing"
git commit -m "refactor: simplify animation logic"
git commit -m "perf: optimize image loading"
git commit -m "chore: update dependencies"
```

### Invalid Commit Examples

```text
updated files
changes done
new update
final changes
fix
my work
```

**Important:** Commit messages are automatically checked using Commitlint. Invalid commit messages will be rejected.

## 5. Code Formatting Standards

Prettier is used to maintain consistent formatting across the repository.

Before committing changes, run:

```bash
npm run format:check
```

To automatically format project files:

```bash
npm run format
```

Formatting is also checked automatically by Husky before commits and by GitHub Actions during Pull Requests.

Do not disable or bypass these checks.

## 6. Testing & Validation

Before submitting a Pull Request, make sure your changes work correctly.

Run the following commands:

### Check formatting

```bash
npm run format:check
```

### Run automated tests

```bash
npm test
```

Run this command when a test suite and test script are configured in the project.

### Verify the production build

```bash
npm run build
```

### Test locally

```bash
npm run dev
```

Check the following where relevant:

- Desktop and mobile responsiveness.
- Navigation and interactive elements.
- Animations and transitions.
- Browser console errors.
- Images, icons, and other assets.
- Existing functionality that could be affected by your changes.

All available automated checks must pass before submitting your Pull Request.

## 7. Push Your Branch

After completing your work, stage and commit your changes:

```bash
git add .
git commit -m "feat: describe your changes"
```

Push your branch to GitHub:

```bash
git push -u origin your-branch-name
```

Example:

```bash
git push -u origin feat/hero-animation
```

## 8. Pull Request Guidelines

All contributions targeting `main` must be submitted through a Pull Request.

### Creating a Pull Request

1. Open the Anahum Solutions repository on GitHub.
2. Select the Pull Requests tab.
3. Click New Pull Request.
4. Select your feature branch as the source.
5. Select `main` as the target branch.
6. Create the Pull Request.

### Pull Request Title

Use Conventional Commit-style titles.

Examples:

```text
feat: introduce new hero animation
fix: resolve responsive navigation issue
docs: improve project documentation
```

### Pull Request Description

Every Pull Request should explain:

- What has been changed?
- Why was the change necessary?
- Which files or sections were affected?
- How was the change tested?
- Are there any screenshots or visual references?

Link related issues or discussions where applicable.

### Pull Request Requirements

Before a Pull Request can be merged:

- It must target `main`.
- It must pass automated CI checks.
- Commit messages must follow Conventional Commits.
- Code formatting must pass.
- The production build must succeed.
- The changes must be reviewed and approved by the repository owner.

The repository owner is responsible for merging approved Pull Requests.

## 9. Automated GitHub Checks

GitHub Actions automatically runs on every Pull Request targeting `main`.

The CI workflow checks:

1. Dependency installation.
2. Code formatting.
3. Automated tests, when configured.
4. Production build.
5. Pull Request commit messages.

A Pull Request with failing required checks cannot be merged.

Do not bypass CI checks or force changes into `main.

## 10. Keeping Your Branch Updated

Before submitting or updating a Pull Request, synchronize your branch with the latest `main`:

```bash
git fetch origin
git merge origin/main
```

Resolve any merge conflicts, run the validation commands again, and push your updated branch.

## 11. Security Guidelines

Contributors must never commit:

- API keys or access tokens.
- Passwords or authentication credentials.
- Private SSH keys.
- `.env` files containing secrets.
- Private client information.
- Confidential business data.

Check `.gitignore` before staging files.

Report accidentally exposed credentials immediately so they can be revoked and rotated.

## 12. Questions & Contributions

If you have questions, encounter issues, or want to propose improvements, open a GitHub Issue or discuss the proposed changes with the Anahum Solutions team.

All contributions are subject to review and approval.

---

**Thank you for helping build Anahum Solutions.**

_Build thoughtfully. Automate intelligently. Ship responsibly._
