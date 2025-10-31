# Workflow Audit - Quick Start

Build with the Holy Spirit 🙏

---

## ⚡ 3-Step Quick Start

### Step 1: Install

```bash
npm install
npx playwright install
```

### Step 2: Start Apps

```bash
# Start the apps you want to test
npm run dev:backend  # Backend on port 3000
npm run start        # Kingdom Studios on port 8081
```

### Step 3: Run Audit

```bash
# All apps
npm run audit:all

# Or individual app
npm run audit:kingdom-studios
```

---

## 📊 View Results

```bash
# Generate report
npm run audit:report

# View report
code tests/reports/workflow_audit_results.md

# Or open HTML report
npx playwright show-report tests/reports/playwright-html
```

---

## 🎯 Common Commands

```bash
# Individual app audits
npm run audit:kingdom-studios
npm run audit:circle
npm run audit:clips
npm run audit:launchpad
npm run audit:lens
npm run audit:stand
npm run audit:voice
npm run audit:website

# All at once
npm run audit:all

# Interactive UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug
```

---

## 🔍 What Gets Tested

- ✅ Navigation paths & links
- ✅ Button actions & forms
- ✅ Route protection & authentication
- ✅ Workflows (sign-up, login, etc.)
- ✅ Error handling (404, validation)
- ✅ Accessibility

---

## 📝 Default Ports

| App               | Port  |
| ----------------- | ----- |
| Kingdom Studios   | 8081  |
| Kingdom Circle    | 8082  |
| Kingdom Clips     | 8083  |
| Kingdom Launchpad | 8084  |
| Kingdom Lens      | 8085  |
| Kingdom Stand     | 8086  |
| Kingdom Voice     | 8087  |
| Kingdom Website   | 19006 |

---

## 🆘 Troubleshooting

### Tests failing?

1. Ensure apps are running on correct ports
2. Check if backend is running
3. Verify environment variables

### Need help?

See [README.md](./README.md) for complete documentation

---

**Build with the Holy Spirit** 🙏
