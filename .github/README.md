# Kingdom Collective GitHub Configuration

## 📁 Files in This Directory

### Active Configuration

- **CODEOWNERS** ✅ - Required code reviewers (active now)
- **workflows/** ✅ - 4 CI/CD workflows (active on push)

### Disabled for Development

- **dependabot.yml** 🔴 - **DISABLED** (see file for instructions)
- **dependabot.yml.disabled** 📋 - Full config (rename to enable)

---

## 🔴 Dependabot Status: DISABLED

**Why**: Development phase - keep dependencies consistent and avoid interruptions from automated update PRs.

**When to Enable**: Before production launch

**How to Enable**:

```bash
# 1. Delete the placeholder file
rm .github/dependabot.yml

# 2. Rename the config
mv .github/dependabot.yml.disabled .github/dependabot.yml

# 3. Push to GitHub
git add .github/dependabot.yml
git commit -m "chore: enable dependabot for production"
git push origin main
```

**What Happens When Enabled**:

- Weekly dependency update PRs (Mondays @ 9 AM)
- Monitors 10 workspaces
- Auto-labels PRs by category
- Ignores major version updates (stability)

---

## ✅ Active Now

### CODEOWNERS

**Purpose**: Enforces required code reviews  
**Teams**: 8 teams defined  
**Action Needed**: Create teams in GitHub organization

### CI/CD Workflows

1. **ci.yml** - Main pipeline (security, lint, typecheck, test, build, E2E)
2. **lighthouse.yml** - Performance testing (≥90 all categories)
3. **security.yml** - Secret scanning, npm audit, SBOM (weekly + on push)
4. **quarterly-audit.yml** - Comprehensive audits (Jan/Apr/Jul/Oct)

**Triggers**: Automatically on push to main or PR creation

---

**"Unless the LORD builds the house, the builders labor in vain."** - Psalm 127:1
