# Kingdom Studios - Workflow Audit System

Build with the Holy Spirit 🙏

---

## Overview

Comprehensive automated testing system that audits all routes, buttons, workflows, and navigation paths across all Kingdom Studios applications using Playwright.

### Applications Covered

1. **Kingdom Studios** - Main platform
2. **Kingdom Circle** - Community & accountability
3. **Kingdom Clips** - Short-form video content
4. **Kingdom Launchpad** - Project management
5. **Kingdom Lens** - Content discovery
6. **Kingdom Stand** - Advocacy platform
7. **Kingdom Voice** - Journaling & devotional
8. **Kingdom Website** - Marketing site

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
npx playwright install
```

### 2. Start Your Apps

Before running audits, ensure apps are running on their expected ports:

```bash
# Kingdom Studios
cd kingdom-studios && npm run start

# Kingdom Circle
cd apps/kingdom-circle && npm run start

# Kingdom Clips
cd apps/kingdom-clips && npm run start

# etc...
```

**Default Ports**:

- Kingdom Studios: `http://localhost:8081`
- Kingdom Circle: `http://localhost:8082`
- Kingdom Clips: `http://localhost:8083`
- Kingdom Launchpad: `http://localhost:8084`
- Kingdom Lens: `http://localhost:8085`
- Kingdom Stand: `http://localhost:8086`
- Kingdom Voice: `http://localhost:8087`
- Kingdom Website: `http://localhost:19006`

### 3. Run Audits

```bash
# All apps
npm run audit:all

# Individual apps
npm run audit:kingdom-studios
npm run audit:circle
npm run audit:clips
npm run audit:launchpad
npm run audit:lens
npm run audit:stand
npm run audit:voice
npm run audit:website
```

### 4. View Results

```bash
# Generate comprehensive report
npm run audit:report

# View report
code tests/reports/workflow_audit_results.md
```

---

## What Gets Tested

### 1. Navigation Tests ✅

- Home page navigation
- Main menu links
- Tab/section navigation
- Footer links
- Back/forward navigation

### 2. Route Protection 🔒

- Authentication redirects
- Protected route access
- Role-based access control
- Unauthorized access handling

### 3. Button Actions 🔘

- Click handlers
- Form submissions
- Modal triggers
- State changes

### 4. Workflow Tests 🔄

- Sign-up flow
- Login flow
- Content creation flow
- User profile updates
- Multi-step processes

### 5. Form Validation 📝

- Required field validation
- Input format validation
- Error message display
- Success state handling

### 6. Error Handling ⚠️

- 404 page display
- Error recovery
- Graceful degradation
- User feedback

### 7. Accessibility ♿

- Proper heading hierarchy
- ARIA labels
- Keyboard navigation
- Screen reader support

---

## Test Structure

### Spec Files

Each app has its own spec file:

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

### Test Organization

Tests are organized by category:

```typescript
test.describe("Workflow Audit - App Name", () => {
  // Navigation Tests
  test("should navigate to Home", async ({ page }) => {
    // ...
  });

  // Authentication Flow
  test("should display login page", async ({ page }) => {
    // ...
  });

  // Button Actions
  test("should verify all buttons", async ({ page }) => {
    // ...
  });

  // Form Validation
  test("should validate login form", async ({ page }) => {
    // ...
  });

  // Route Protection
  test("should protect dashboard routes", async ({ page }) => {
    // ...
  });
});
```

---

## Configuration

### Playwright Config

Location: `playwright.config.ts`

Key settings:

- Test timeout: 60 seconds
- Sequential execution (for accurate reporting)
- Screenshots on failure
- Video on failure
- HTML + JSON + Markdown reports

### Environment Variables

Create `.env.test` in project root:

```env
# App URLs
API_URL=http://localhost:3000
KINGDOM_STUDIOS_URL=http://localhost:8081
KINGDOM_CIRCLE_URL=http://localhost:8082
KINGDOM_CLIPS_URL=http://localhost:8083
KINGDOM_LAUNCHPAD_URL=http://localhost:8084
KINGDOM_LENS_URL=http://localhost:8085
KINGDOM_STAND_URL=http://localhost:8086
KINGDOM_VOICE_URL=http://localhost:8087
KINGDOM_WEBSITE_URL=http://localhost:19006

# Test Credentials
TEST_USER_EMAIL=test@kingdom.test
TEST_USER_PASSWORD=TestPassword123!
```

---

## Reports

### Generated Files

```
tests/reports/
├── workflow_audit_results.md     # Comprehensive markdown report
├── playwright-results.json        # Raw test results
├── playwright-html/               # HTML test report
│   └── index.html
└── screenshots/                   # Failure screenshots
    └── [test-name]-[timestamp].png
```

### Report Contents

The main report includes:

1. **Executive Summary** - Overall pass/fail statistics
2. **Per-App Results** - Detailed test results for each app
3. **Failed Tests** - Detailed error information
4. **Auto-Fix Suggestions** - Recommended fixes
5. **Next Steps** - Actions to take

---

## Common Commands

### Running Tests

```bash
# All apps at once
npm run audit:all

# Specific app
npm run audit:kingdom-studios

# With UI mode (interactive)
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed
```

### Viewing Reports

```bash
# Generate markdown report
npm run audit:report

# Open HTML report
npx playwright show-report tests/reports/playwright-html

# View JSON results
cat tests/reports/playwright-results.json | jq
```

### Filtering Tests

```bash
# Run only navigation tests
npx playwright test --grep "navigate"

# Run only protection tests
npx playwright test --grep "protect"

# Run all except specific test
npx playwright test --grep-invert "slow"
```

---

## Customization

### Adding New Tests

1. Open relevant spec file (e.g., `kingdom-studios.spec.ts`)
2. Add test within `test.describe` block:

```typescript
test("should perform new action", async ({ page }) => {
  await test.step("Description", async () => {
    // Your test code
    await page.goto("/your-route");
    await page.click('button[name="action"]');
    expect(page.url()).toContain("/expected-route");
  });
});
```

### Adding New App

1. Create spec file: `tests/workflow-audits/your-app.spec.ts`
2. Add to `playwright.config.ts`:

```typescript
{
  name: 'your-app',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:XXXX',
  },
  testMatch: '**/your-app.spec.ts',
}
```

3. Add script to `package.json`:

```json
"audit:your-app": "playwright test --project=your-app"
```

---

## Troubleshooting

### Tests Failing to Start

**Issue**: `Error: Cannot connect to localhost:XXXX`

**Solution**: Ensure the app is running on the correct port

```bash
cd your-app
npm run start
```

---

### Timeout Errors

**Issue**: `Test timeout of 60000ms exceeded`

**Solutions**:

1. Increase timeout in `playwright.config.ts`:

```typescript
timeout: 120 * 1000, // 2 minutes
```

2. Or in individual test:

```typescript
test("slow test", async ({ page }) => {
  test.setTimeout(120000);
  // ...
});
```

---

### Element Not Found

**Issue**: `Error: locator.click: Element not found`

**Solutions**:

1. Check if element exists:

```typescript
const button = page.getByRole("button", { name: /click me/i });
const exists = await button.isVisible({ timeout: 5000 }).catch(() => false);
if (exists) {
  await button.click();
}
```

2. Wait for element:

```typescript
await page.waitForSelector('button[name="action"]', { timeout: 10000 });
```

---

### Authentication Required

**Issue**: Tests failing because user not logged in

**Solution**: Add login fixture or setup:

```typescript
test.beforeEach(async ({ page }) => {
  // Login before each test
  await page.goto("/login");
  await page.fill('[name="email"]', "test@kingdom.test");
  await page.fill('[name="password"]', "password");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard");
});
```

---

## Best Practices

### 1. Use Proper Selectors

✅ **Good**: Role-based selectors

```typescript
page.getByRole("button", { name: /submit/i });
page.getByRole("link", { name: /home/i });
```

❌ **Bad**: CSS class selectors

```typescript
page.locator(".btn-submit");
page.locator("#home-link");
```

### 2. Handle Async Properly

✅ **Good**: Await all promises

```typescript
await page.goto("/");
await page.waitForLoadState("networkidle");
const text = await page.textContent("h1");
```

❌ **Bad**: Missing awaits

```typescript
page.goto("/");
const text = page.textContent("h1"); // Missing await!
```

### 3. Use Test Steps

✅ **Good**: Organized steps

```typescript
await test.step("Navigate to page", async () => {
  await page.goto("/");
});

await test.step("Fill form", async () => {
  await page.fill('[name="email"]', "test@test.com");
});
```

### 4. Handle Errors Gracefully

✅ **Good**: Try-catch or optional checks

```typescript
const button = page.getByRole("button");
const exists = await button.isVisible({ timeout: 5000 }).catch(() => false);
if (exists) {
  await button.click();
}
```

❌ **Bad**: Assume element exists

```typescript
await page.click("button"); // Will fail if not found
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/audit.yml`:

```yaml
name: Workflow Audit

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run audits
        run: npm run audit:all

      - name: Generate report
        if: always()
        run: npm run audit:report

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: audit-results
          path: tests/reports/
```

---

## Performance Tips

### 1. Run Tests in Parallel (Carefully)

```typescript
// playwright.config.ts
workers: 4, // Run 4 tests at once
```

**Note**: Be careful with parallel tests - some may interfere with each other.

### 2. Use Test Fixtures

Create reusable fixtures in `tests/fixtures.ts`:

```typescript
import { test as base } from "@playwright/test";

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login once
    await page.goto("/login");
    await page.fill('[name="email"]', "test@test.com");
    await page.fill('[name="password"]', "password");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");

    await use(page);
  },
});
```

### 3. Cache Test Data

Store test data between runs to speed up tests.

---

## Support

For issues or questions:

1. Check this README
2. Review test output and screenshots
3. Check [Playwright documentation](https://playwright.dev)
4. Contact: desi@kingdomcollective.pro

---

**Build with the Holy Spirit** 🙏

**Last Updated**: October 14, 2025  
**Version**: 1.0.0
