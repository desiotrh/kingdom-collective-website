# ⚡ Quick Install - Kingdom Tools

**If you canceled the automated installation, here's the manual process:**

## 📦 Install Core Packages

### Option 1: All at Once (Kingdom Website)

```bash
cd kingdom-website

npm install --save-dev \
  husky \
  @commitlint/cli \
  @commitlint/config-conventional \
  lint-staged \
  bundlesize \
  depcheck \
  @lhci/cli \
  @axe-core/playwright \
  @axe-core/react
```

### Option 2: Step by Step (If Option 1 is slow)

```bash
cd kingdom-website

# Step 1: Git hooks
npm install --save-dev husky @commitlint/cli @commitlint/config-conventional

# Step 2: Code quality
npm install --save-dev lint-staged

# Step 3: Performance
npm install --save-dev bundlesize @lhci/cli

# Step 4: Testing
npm install --save-dev @axe-core/playwright @axe-core/react

# Step 5: Utilities
npm install --save-dev depcheck
```

## 🪝 Initialize Husky

```bash
cd ..  # Back to root
npm run prepare
```

## ✅ What's Already Configured

Even without installing npm packages, you already have:

- ✅ Git hooks configured (`.husky/*`)
- ✅ Commitlint config (`commitlint.config.js`)
- ✅ Lint-staged config (`.lintstagedrc.js`)
- ✅ Bundle budgets (`.bundlesizerc.json`)
- ✅ Lighthouse CI config (`.lighthouserc.json`)
- ✅ Dependabot config (`.github/dependabot.yml`)
- ✅ CODEOWNERS (`.github/CODEOWNERS`)
- ✅ CI/CD workflows (`.github/workflows/*`)
- ✅ NPM scripts in `package.json`

## 🚀 Test What Works Now

```bash
# These work without additional packages:
npm run test:quick       # Existing tests
npm run test:all         # All tests
npm run lint             # ESLint (already installed)
npm run format:check     # Prettier (already in kingdom-website)

# These need packages installed:
npm run bundlesize       # Needs: bundlesize package
npm run lighthouse       # Needs: @lhci/cli package
npm run check-unused     # Needs: depcheck package
```

## 📝 If You Want to Skip Package Installation

The configurations are **ready to go**. You can:

1. **Use CI/CD only**: GitHub Actions will run everything automatically
2. **Install later**: When you need a specific tool, install it then
3. **Use existing tools**: ESLint, Prettier, TypeScript already work

## ⚡ Minimal Setup (Just Git Hooks)

If you only want git hooks:

```bash
cd kingdom-website
npm install --save-dev husky @commitlint/cli @commitlint/config-conventional
cd ..
npm run prepare
```

That's it! Commit messages will be validated and code will be checked.

---

**Build with the Holy Spirit!** 🙏
