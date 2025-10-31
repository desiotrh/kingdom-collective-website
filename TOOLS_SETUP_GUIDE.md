# 🛠️ Kingdom Collective Tools Setup Guide

**Build with the Holy Spirit** 🙏

This guide documents all the development tools installed as part of the Kingdom Manifesto implementation.

---

## 📋 Table of Contents

1. [Installed Tools Overview](#installed-tools-overview)
2. [Git Hooks (Husky)](#git-hooks-husky)
3. [Commit Standards (Commitlint)](#commit-standards-commitlint)
4. [Performance Budgets (Bundlesize)](#performance-budgets-bundlesize)
5. [Lighthouse CI](#lighthouse-ci)
6. [Dependency Management (Dependabot)](#dependency-management-dependabot)
7. [Code Ownership (CODEOWNERS)](#code-ownership-codeowners)
8. [CI/CD Workflows](#cicd-workflows)
9. [Available NPM Scripts](#available-npm-scripts)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Installed Tools Overview

| Tool              | Purpose                      | Priority  | Status        |
| ----------------- | ---------------------------- | --------- | ------------- |
| **Husky**         | Git hooks automation         | 🔴 HIGH   | ✅ Configured |
| **Commitlint**    | Commit message standards     | 🔴 HIGH   | ✅ Configured |
| **lint-staged**   | Pre-commit linting           | 🔴 HIGH   | ✅ Configured |
| **Bundlesize**    | Performance budgets          | 🔴 HIGH   | ✅ Configured |
| **Lighthouse CI** | Performance/SEO testing      | 🔴 HIGH   | ✅ Configured |
| **Dependabot**    | Automated dependency updates | 🟡 MEDIUM | ✅ Configured |
| **CODEOWNERS**    | Required code reviews        | 🟡 MEDIUM | ✅ Configured |
| **depcheck**      | Unused dependency detection  | 🟢 LOW    | ✅ Configured |
| **gitleaks**      | Secret scanning              | 🔴 HIGH   | ✅ CI Only    |

---

## 🪝 Git Hooks (Husky)

### What is Husky?

Husky enables Git hooks to run automated checks before commits and pushes, ensuring code quality.

### Installed Hooks

#### 1. **Pre-Commit Hook** (`.husky/pre-commit`)

Runs before every commit:

- ✅ Lints staged files (ESLint + Prettier)
- ✅ Type checks with TypeScript
- ❌ Blocks commit if checks fail

**What it checks:**

```bash
npx lint-staged  # Lints only staged files
npx tsc --noEmit # TypeScript type checking
```

#### 2. **Pre-Push Hook** (`.husky/pre-push`)

Runs before every push:

- ✅ Runs unit tests
- ✅ Verifies build succeeds
- ❌ Blocks push if tests/build fail

**What it checks:**

```bash
npm run test:quick  # Unit tests
npm run build       # Production build
```

#### 3. **Commit-Msg Hook** (`.husky/commit-msg`)

Runs when writing commit messages:

- ✅ Validates commit message format
- ❌ Blocks commit if format is invalid

**Valid commit formats:**

```
feat: add user authentication
fix: resolve login bug
docs: update README
style: format code with Prettier
refactor: restructure API routes
test: add unit tests for auth
chore: update dependencies
```

### Bypassing Hooks (Emergency Only)

**⚠️ WARNING**: Only bypass hooks with approval from lead developer.

```bash
# Skip pre-commit and commit-msg hooks
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

---

## 📝 Commit Standards (Commitlint)

### Configuration File

**Location**: `commitlint.config.js`

### Allowed Commit Types

| Type       | Purpose            | Example                               |
| ---------- | ------------------ | ------------------------------------- |
| `feat`     | New feature        | `feat: add payment processing`        |
| `fix`      | Bug fix            | `fix: resolve crash on login`         |
| `docs`     | Documentation      | `docs: update API guide`              |
| `style`    | Code formatting    | `style: apply Prettier formatting`    |
| `refactor` | Code restructuring | `refactor: simplify auth logic`       |
| `perf`     | Performance        | `perf: optimize image loading`        |
| `test`     | Tests              | `test: add coverage for API`          |
| `build`    | Build system       | `build: update webpack config`        |
| `ci`       | CI/CD changes      | `ci: add Lighthouse workflow`         |
| `chore`    | Maintenance        | `chore: update dependencies`          |
| `revert`   | Revert commit      | `revert: undo feature X`              |
| `security` | Security fixes     | `security: patch XSS vulnerability`   |
| `a11y`     | Accessibility      | `a11y: improve screen reader support` |

### Commit Message Rules

✅ **Good Examples:**

```bash
feat: add user authentication system
fix: resolve null pointer in payment flow
docs: update deployment guide with new steps
feat(api): add endpoint for user profile retrieval
fix(ui): correct button alignment on mobile devices
```

❌ **Bad Examples:**

```bash
Fixed stuff                    # Too vague, no type
Add new feature               # Should be: feat: add new feature
updated readme                # Should be: docs: update README
FEAT: add login               # Type must be lowercase
```

### Scope (Optional)

Add scope in parentheses for clarity:

```bash
feat(auth): add OAuth integration
fix(api): resolve CORS issue
docs(deployment): add Vercel guide
```

---

## 📊 Performance Budgets (Bundlesize)

### Configuration File

**Location**: `.bundlesizerc.json`

### Configured Budgets

| Asset Type         | Maximum Size | Compression |
| ------------------ | ------------ | ----------- |
| JavaScript bundles | 250 KB       | gzip        |
| CSS files          | 50 KB        | gzip        |

### How It Works

Bundlesize automatically checks your build output:

- ✅ **Pass**: Bundle within budget
- ❌ **Fail**: Bundle exceeds budget (blocks deployment in CI)

### Running Bundlesize

```bash
# Check bundle sizes against budget
npm run bundlesize

# Runs automatically in CI/CD pipeline
```

### What to Do If It Fails

1. **Analyze bundle**:

   ```bash
   npm run analyze  # Opens webpack bundle analyzer
   ```

2. **Common solutions**:
   - Code-split large components
   - Lazy-load routes
   - Tree-shake unused code
   - Replace large libraries with smaller alternatives

---

## 🚦 Lighthouse CI

### Configuration File

**Location**: `.lighthouserc.json`

### What It Tests

Lighthouse CI runs on every PR and push to main:

- 🚀 **Performance** (≥90 score required)
- ♿ **Accessibility** (≥90 score required)
- ✅ **Best Practices** (≥90 score required)
- 🔍 **SEO** (≥90 score required)

### Core Web Vitals Thresholds

| Metric                         | Threshold |
| ------------------------------ | --------- |
| First Contentful Paint (FCP)   | ≤ 1.5s    |
| Largest Contentful Paint (LCP) | ≤ 2.5s    |
| Cumulative Layout Shift (CLS)  | ≤ 0.1     |
| Total Blocking Time (TBT)      | ≤ 300ms   |
| Speed Index                    | ≤ 3.0s    |

### Running Lighthouse Locally

```bash
# Run Lighthouse CI
npm run lighthouse

# Open HTML report
npm run lighthouse:report
```

### Tested URLs

- `/` (Homepage)
- `/kingdom-stand`
- `/kingdom-circle`
- `/kingdom-clips`
- `/kingdom-launchpad`
- `/kingdom-lens`
- `/kingdom-voice`
- `/privacy`
- `/terms`

---

## 🤖 Dependency Management (Dependabot)

### Status: 🔴 DISABLED FOR DEVELOPMENT

**Location**: `.github/dependabot.yml.disabled`

### Why Disabled?

Dependabot is **intentionally disabled** during the development phase to:

- ✅ Keep development easy and consistent
- ✅ Avoid automated PR interruptions
- ✅ Let you control when to update dependencies
- ✅ Focus on building features, not dependency management

### When to Enable

**Enable Dependabot before production launch** to get:

- Automated security patches
- Weekly dependency updates
- Reduced maintenance burden

### How to Enable

```bash
# Step 1: Remove placeholder
rm .github/dependabot.yml

# Step 2: Activate configuration
mv .github/dependabot.yml.disabled .github/dependabot.yml

# Step 3: Push to GitHub
git add .github/dependabot.yml
git commit -m "chore: enable dependabot for production"
git push origin main
```

**Result**: Dependabot starts monitoring next Monday @ 9 AM

### What It Does (When Enabled)

Dependabot automatically:

- 📦 Checks for dependency updates weekly (Mondays @ 9 AM)
- 🔒 Creates PRs for security patches
- 🏷️ Labels PRs by category (dependencies, security, frontend, backend)
- ⏸️ Ignores major version updates (prevents breaking changes)
- ✅ Auto-merges patch updates after CI passes

### Configured Packages (When Enabled)

Updates tracked for:

- Root workspace
- `kingdom-website/`
- `kingdom-studios-backend/`
- `kingdom-studios/`
- All apps (`apps/kingdom-*`)
- All packages (`packages/*`)
- GitHub Actions

### Handling Dependabot PRs (When Enabled)

1. **Review the PR**:
   - Check CHANGELOG of updated package
   - Review breaking changes (if any)

2. **Run tests locally**:

   ```bash
   npm run test:all
   npm run build
   ```

3. **Approve and merge**:
   - If tests pass, approve the PR
   - Dependabot will auto-merge patch updates

### Manual Dependency Management (Current Approach)

While Dependabot is disabled, manage dependencies manually:

```bash
# Check for updates
npm run check-deps

# Check for unused dependencies
npm run check-unused

# Security audit
npm run security:scan

# Update when ready
npm update                    # Safe updates
npm audit fix                 # Fix vulnerabilities
```

---

## 👥 Code Ownership (CODEOWNERS)

### Configuration File

**Location**: `.github/CODEOWNERS`

### How It Works

CODEOWNERS enforces **required reviewers** on PRs:

- 🔒 Security files: `@kingdom-collective/devops-team` (2 approvals required)
- 🖥️ Backend: `@kingdom-collective/backend-team`
- 💻 Frontend: `@kingdom-collective/frontend-team`
- 📱 Mobile: `@kingdom-collective/mobile-team`
- 📊 Database: `@kingdom-collective/data-team`
- 📝 Docs: `@kingdom-collective/docs-team`
- 🧪 Tests: `@kingdom-collective/qa-team`

### Ownership Map

```
/.github/              → devops-team
/kingdom-studios-backend/ → backend-team
/kingdom-website/      → frontend-team
/apps/*                → frontend-team
/docs/*                → docs-team
/tests/*               → qa-team
```

### Creating GitHub Teams

1. Go to your GitHub organization settings
2. Navigate to **Teams**
3. Create teams as defined in CODEOWNERS
4. Add team members

---

## ⚙️ CI/CD Workflows

### Installed Workflows

#### 1. **CI/CD Pipeline** (`.github/workflows/ci.yml`)

**Triggers**: Push to `main`/`develop`, Pull Requests

**Jobs**:

- 🔒 Security audit
- 🎨 Lint & format check
- 📝 TypeScript type checking
- 🧪 Unit and integration tests
- 🏗️ Build verification
- 🎭 E2E tests (Playwright)

**Run time**: ~5-10 minutes

---

#### 2. **Lighthouse CI** (`.github/workflows/lighthouse.yml`)

**Triggers**: Push to `main`, Pull Requests

**Jobs**:

- 🚦 Lighthouse performance testing
- 📊 Comments PR with scores
- 📈 Uploads reports as artifacts

**Run time**: ~3-5 minutes

---

#### 3. **Security Scan** (`.github/workflows/security.yml`)

**Triggers**: Push, Pull Requests, Weekly schedule (Mondays @ 9 AM)

**Jobs**:

- 🔍 Secret scanning (gitleaks)
- 📦 Dependency vulnerability scan (npm audit + Snyk)
- 📋 SBOM generation
- 🛡️ Security headers check

**Run time**: ~2-4 minutes

---

#### 4. **Quarterly Audit** (`.github/workflows/quarterly-audit.yml`)

**Triggers**: Quarterly schedule (Jan 1, Apr 1, Jul 1, Oct 1 @ 9 AM UTC), Manual

**Jobs**:

- 🔍 Comprehensive security audit
- 🚦 Full Lighthouse scan
- ♿ Accessibility testing
- 🧪 Full test suite
- 📦 Unused dependency check
- 📝 Creates GitHub issue with findings

**Run time**: ~15-20 minutes

---

## 📜 Available NPM Scripts

### Core Scripts

```bash
# Development
npm run build           # Build kingdom-website for production
npm start               # Start kingdom-studios app
npm run start:backend   # Start backend server
npm run dev:backend     # Start backend in dev mode

# Mobile
npm run android         # Run on Android
npm run ios             # Run on iOS
npm run web             # Run web version
```

### Testing Scripts

```bash
# Unit & Integration Tests
npm run test:quick        # Fast health check
npm run test:health       # Health check tests
npm run test:api          # API endpoint tests
npm run test:integration  # Integration tests
npm run test:e2e          # End-to-end tests
npm run test:all          # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Generate coverage report
npm run test:a11y         # Accessibility tests

# Performance Tests
npm run test:load         # Load testing
npm run test:stress       # Stress testing
npm run test:performance  # Both load and stress
```

### Code Quality Scripts

```bash
# Linting & Formatting
npm run lint              # Run ESLint
npm run lint:fix          # Auto-fix ESLint errors
npm run format            # Format with Prettier
npm run format:check      # Check formatting
npm run typecheck         # TypeScript type check

# Performance & Security
npm run lighthouse        # Run Lighthouse CI
npm run lighthouse:report # Open Lighthouse report
npm run bundlesize        # Check bundle sizes
npm run check-deps        # Check all dependencies
npm run check-unused      # Find unused dependencies
npm run security:scan     # Security audit all packages
npm run security:fix      # Auto-fix security issues
```

### Audit Scripts

```bash
# Workflow Audits (Playwright)
npm run audit:workflows         # Run workflow audits
npm run audit:kingdom-studios   # Audit main app
npm run audit:circle            # Audit Kingdom Circle
npm run audit:clips             # Audit Kingdom Clips
npm run audit:launchpad         # Audit Kingdom Launchpad
npm run audit:lens              # Audit Kingdom Lens
npm run audit:stand             # Audit Kingdom Stand
npm run audit:voice             # Audit Kingdom Voice
npm run audit:website           # Audit website
npm run audit:all               # Audit all projects
npm run audit:report            # Generate audit report
```

---

## 🔧 Troubleshooting

### Husky Hooks Not Running

**Problem**: Git hooks don't execute

**Solution**:

```bash
# Reinstall Husky
npm run prepare

# Or manually
npx husky install

# Make hooks executable (Mac/Linux)
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
```

---

### Commitlint Fails on Valid Commit

**Problem**: Commit message rejected incorrectly

**Check**:

1. Type is lowercase: `feat` not `FEAT`
2. Colon after type: `feat:` not `feat -`
3. Space after colon: `feat: add` not `feat:add`
4. Subject is not empty

**Bypass (emergency only)**:

```bash
git commit --no-verify -m "your message"
```

---

### Bundlesize Exceeds Budget

**Problem**: `npm run bundlesize` fails

**Solutions**:

1. **Analyze bundle**:

   ```bash
   cd kingdom-website
   npm run analyze
   ```

2. **Common fixes**:
   - Implement code splitting
   - Lazy load heavy components
   - Use dynamic imports
   - Replace large libraries

3. **Temporary waiver** (document reason):
   - Update `.bundlesizerc.json` with higher limit
   - Add comment explaining why
   - Create issue to reduce size later

---

### Lighthouse CI Fails

**Problem**: Lighthouse scores below 90

**Debug locally**:

```bash
npm run lighthouse:report
```

**Common issues**:

- **Performance**: Large bundle, unoptimized images
- **Accessibility**: Missing alt text, poor contrast
- **SEO**: Missing meta tags, no sitemap
- **Best Practices**: HTTP instead of HTTPS

---

### Dependabot PRs Not Auto-Merging

**Problem**: Dependabot PRs stay open

**Checklist**:

1. ✅ All CI checks passed?
2. ✅ Required reviews approved?
3. ✅ Is it a patch update (not major)?
4. ✅ Dependabot settings allow auto-merge?

**Manual merge**:

```bash
# If all checks pass, merge via GitHub UI
```

---

### GitHub Actions Workflow Fails

**Problem**: CI/CD workflow errors

**Debug steps**:

1. Check workflow logs in GitHub Actions tab
2. Run the same command locally:
   ```bash
   npm ci
   npm run lint
   npm run typecheck
   npm run test:all
   npm run build
   ```
3. Fix issues locally
4. Push fixes

---

## 📚 Additional Resources

### Documentation

- [Husky Documentation](https://typicode.github.io/husky/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Conventional Commits Spec](https://www.conventionalcommits.org/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

### Kingdom Collective Standards

- `KINGDOM_MANIFESTO.md` - Complete manifesto
- `KINGDOM_AUDIT.md` - Latest audit results
- `docs/ROLLBACK_PROCEDURE.md` - Emergency rollback guide
- `docs/RUNBOOK.md` - Operational procedures

---

## 🙏 Spiritual Foundation

**"Unless the LORD builds the house, the builders labor in vain."** - Psalm 127:1

All these tools serve one purpose: **building with excellence for God's glory**.

- Every commit is a commitment to quality
- Every test is stewarding user trust
- Every optimization honors users' time
- Every security check protects God's people

**Build with the Holy Spirit.** 🙏👑

---

**Last Updated**: October 25, 2025  
**Maintained by**: Kingdom Collective Core Team
