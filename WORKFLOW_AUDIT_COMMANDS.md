# Workflow Audit - Command Reference

Build with the Holy Spirit 🙏

**Quick command reference for workflow audits**

---

## 🚀 Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

---

## 🎯 Running Audits

### All Apps at Once

```bash
npm run audit:all
```

### Individual Apps

```bash
npm run audit:kingdom-studios   # Priority #1 - Main platform
npm run audit:circle            # Community & accountability
npm run audit:clips             # Short-form video
npm run audit:launchpad         # Project management
npm run audit:lens              # Content discovery
npm run audit:stand             # Advocacy platform
npm run audit:voice             # Journaling & devotional
npm run audit:website           # Marketing site
```

### Grep Patterns

```bash
npm run audit:workflows         # Grep "Workflow Audit"
```

---

## 📊 Viewing Results

### Generate Markdown Report

```bash
npm run audit:report
```

### Open HTML Report

```bash
npx playwright show-report tests/reports/playwright-html
```

### View Markdown Report

```bash
code tests/reports/workflow_audit_results.md
```

---

## 🎨 Advanced Playwright Commands

### Interactive UI Mode

```bash
npx playwright test --ui
```

### Debug Mode

```bash
npx playwright test --debug
```

### Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Specific Test

```bash
npx playwright test --grep "navigate"
npx playwright test --grep "auth"
npx playwright test --grep "form"
```

### Run Specific App

```bash
npx playwright test --project=kingdom-studios
npx playwright test --project=kingdom-circle
```

### Multiple Projects

```bash
npx playwright test --project=kingdom-studios --project=kingdom-circle
```

---

## 📁 File Locations

### Test Specs

```
tests/workflow-audits/
├── kingdom-studios.spec.ts
├── kingdom-circle.spec.ts
├── kingdom-clips.spec.ts
├── kingdom-launchpad.spec.ts
├── kingdom-lens.spec.ts
├── kingdom-stand.spec.ts
├── kingdom-voice.spec.ts
└── kingdom-website.spec.ts
```

### Reports

```
tests/reports/
├── workflow_audit_results.md    # Main report
├── playwright-results.json       # Raw JSON
└── playwright-html/              # Interactive HTML
    └── index.html
```

### Documentation

```
tests/workflow-audits/
├── README.md                    # Complete guide
├── QUICK_START.md              # Quick reference
└── custom-reporter.ts          # Reporter code
```

---

## 🔧 Configuration Files

- `playwright.config.ts` - Main Playwright config
- `package.json` - NPM scripts
- `tests/workflow-audits/generate-report.js` - Report generator

---

## 💡 Tips

### Before Running Tests

1. Start backend: `npm run dev:backend`
2. Start apps on their ports
3. Verify apps are accessible

### After Running Tests

1. Generate report: `npm run audit:report`
2. Review failures
3. Implement fixes
4. Re-run tests

### Debugging Failed Tests

1. Use `--debug` flag
2. Check screenshots in `tests/reports/screenshots/`
3. Review error messages in report
4. Use auto-fix suggestions

---

## 🎯 Default Ports

| App               | Port  |
| ----------------- | ----- |
| Backend API       | 3000  |
| Kingdom Studios   | 8081  |
| Kingdom Circle    | 8082  |
| Kingdom Clips     | 8083  |
| Kingdom Launchpad | 8084  |
| Kingdom Lens      | 8085  |
| Kingdom Stand     | 8086  |
| Kingdom Voice     | 8087  |
| Kingdom Website   | 19006 |

---

## 📚 Documentation

- [README.md](./tests/workflow-audits/README.md) - Complete guide
- [QUICK_START.md](./tests/workflow-audits/QUICK_START.md) - Quick start
- [WORKFLOW_AUDIT_SETUP.md](./WORKFLOW_AUDIT_SETUP.md) - Setup details

---

**Build with the Holy Spirit** 🙏
