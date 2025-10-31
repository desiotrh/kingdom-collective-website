#!/usr/bin/env node

/**
 * Generate Comprehensive Workflow Audit Report
 * Consolidates all test results into markdown
 * Build with the Holy Spirit
 */

const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '../reports');
const OUTPUT_FILE = path.join(REPORTS_DIR, 'workflow_audit_results.md');
const JSON_RESULTS = path.join(REPORTS_DIR, 'playwright-results.json');

console.log('📊 Generating workflow audit report...\n');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Check if JSON results exist
if (!fs.existsSync(JSON_RESULTS)) {
  console.log('⚠️  No test results found. Run tests first:');
  console.log('   npm run audit:all\n');
  process.exit(1);
}

// Read test results
const results = JSON.parse(fs.readFileSync(JSON_RESULTS, 'utf-8'));

// Generate report
const report = generateMarkdownReport(results);

// Write report
fs.writeFileSync(OUTPUT_FILE, report, 'utf-8');

console.log(`✅ Report generated: ${OUTPUT_FILE}\n`);
console.log(`📄 Open: ${path.relative(process.cwd(), OUTPUT_FILE)}\n`);

function generateMarkdownReport(results) {
  const { suites, stats } = results;
  
  let markdown = `# Kingdom Studios - Workflow Audit Results

Build with the Holy Spirit 🙏

**Generated**: ${new Date().toLocaleString()}  
**Duration**: ${formatDuration(stats.duration)}

---

## Executive Summary

Comprehensive audit of all routes, buttons, workflows, and navigation paths across all Kingdom Studios applications.

### Overall Results

| Metric | Count |
|--------|-------|
| Total Tests | ${stats.expected} |
| ✅ Passed | ${stats.expected - stats.unexpected - stats.flaky} |
| ❌ Failed | ${stats.unexpected} |
| ⚠️  Flaky | ${stats.flaky} |
| ⏭️  Skipped | ${stats.skipped} |
| Pass Rate | ${calculatePassRate(stats)}% |

---

`;

  // Process each app
  const apps = groupByApp(suites);
  
  for (const [appName, appSuites] of Object.entries(apps)) {
    markdown += generateAppSection(appName, appSuites);
  }

  // Auto-fix suggestions
  markdown += generateAutoFixSuggestions(suites);

  // Footer
  markdown += `
## Next Steps

1. Review failed tests and implement suggested fixes
2. Re-run audit after fixes: \`npm run audit:all\`
3. Verify auto-fix suggestions work as expected
4. Update navigation documentation

---

## Running Audits

### All Apps
\`\`\`bash
npm run audit:all
\`\`\`

### Individual Apps
\`\`\`bash
npm run audit:kingdom-studios
npm run audit:circle
npm run audit:clips
npm run audit:launchpad
npm run audit:lens
npm run audit:stand
npm run audit:voice
npm run audit:website
\`\`\`

---

**Report Generated**: ${new Date().toLocaleString()}  
**Build with the Holy Spirit** 🙏
`;

  return markdown;
}

function groupByApp(suites) {
  const apps = {};
  
  function processSuite(suite) {
    if (suite.title.includes('Workflow Audit -')) {
      const appName = suite.title.replace('Workflow Audit -', '').trim();
      if (!apps[appName]) {
        apps[appName] = [];
      }
      apps[appName].push(suite);
    }
    
    if (suite.suites) {
      suite.suites.forEach(processSuite);
    }
  }
  
  suites.forEach(processSuite);
  return apps;
}

function generateAppSection(appName, suites) {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  const tests = [];
  
  function collectTests(suite) {
    if (suite.specs) {
      suite.specs.forEach(spec => {
        tests.push(spec);
        if (spec.ok) passed++;
        else if (spec.tests[0]?.status === 'skipped') skipped++;
        else failed++;
      });
    }
    if (suite.suites) {
      suite.suites.forEach(collectTests);
    }
  }
  
  suites.forEach(collectTests);
  
  const total = passed + failed + skipped;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0';
  
  let section = `## ${appName}

**Status**: ${failed === 0 ? '✅ All Tests Passed' : `⚠️  ${failed} Test(s) Failed`}  
**Pass Rate**: ${passRate}% (${passed}/${total})

### Test Results

| Test | Status | Duration |
|------|--------|----------|
`;

  tests.forEach(test => {
    const status = test.ok ? '✅ Pass' : (test.tests[0]?.status === 'skipped' ? '⏭️  Skip' : '❌ Fail');
    const duration = formatDuration(test.tests[0]?.results[0]?.duration || 0);
    const title = test.title.length > 60 ? test.title.substring(0, 57) + '...' : test.title;
    section += `| ${title} | ${status} | ${duration} |\n`;
  });

  // Failed tests details
  const failedTests = tests.filter(t => !t.ok && t.tests[0]?.status !== 'skipped');
  if (failedTests.length > 0) {
    section += `\n### Failed Tests Details\n\n`;
    failedTests.forEach(test => {
      const error = test.tests[0]?.results[0]?.error;
      section += `#### ❌ ${test.title}\n\n`;
      if (error) {
        section += `**Error**: \`${error.message}\`\n\n`;
        if (error.stack) {
          section += `\`\`\`\n${error.stack.split('\n').slice(0, 5).join('\n')}\n\`\`\`\n\n`;
        }
      }
    });
  }

  section += `\n---\n\n`;
  return section;
}

function generateAutoFixSuggestions(suites) {
  let suggestions = `## Auto-Fix Suggestions\n\n`;
  let hasSuggestions = false;
  
  function findFailedTests(suite, appName) {
    const failed = [];
    
    function collect(s) {
      if (s.specs) {
        s.specs.forEach(spec => {
          if (!spec.ok && spec.tests[0]?.status !== 'skipped') {
            failed.push({ app: appName, test: spec });
          }
        });
      }
      if (s.suites) {
        s.suites.forEach(collect);
      }
    }
    
    collect(suite);
    return failed;
  }
  
  suites.forEach(suite => {
    if (suite.title.includes('Workflow Audit -')) {
      const appName = suite.title.replace('Workflow Audit -', '').trim();
      const failed = findFailedTests(suite, appName);
      
      if (failed.length > 0) {
        hasSuggestions = true;
        suggestions += `### ${appName}\n\n`;
        
        failed.forEach(({ test }) => {
          suggestions += `#### ${test.title}\n\n`;
          suggestions += generateFixSuggestion(test);
        });
      }
    }
  });
  
  if (!hasSuggestions) {
    suggestions += `✅ No fixes needed - all tests passed!\n\n`;
  }
  
  suggestions += `---\n\n`;
  return suggestions;
}

function generateFixSuggestion(test) {
  const error = test.tests[0]?.results[0]?.error?.message || '';
  let suggestion = `**Suggested Fix**:\n\n`;
  
  if (error.includes('not found') || error.includes('404')) {
    suggestion += `\`\`\`typescript
// Add missing route/component
// Test: ${test.title}
// Check navigation configuration and ensure route exists
\`\`\`\n\n`;
  } else if (error.includes('timeout')) {
    suggestion += `\`\`\`typescript
// Check if element exists and is visible
// Test: ${test.title}
// Increase timeout or verify selector
\`\`\`\n\n`;
  } else if (error.includes('expect')) {
    suggestion += `\`\`\`typescript
// Review assertion logic
// Test: ${test.title}
// Verify expected vs actual values
\`\`\`\n\n`;
  } else {
    suggestion += `\`\`\`typescript
// Review test implementation
// Test: ${test.title}
// Error: ${error}
\`\`\`\n\n`;
  }
  
  return suggestion;
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
}

function calculatePassRate(stats) {
  const total = stats.expected;
  const passed = total - stats.unexpected - stats.flaky;
  return total > 0 ? ((passed / total) * 100).toFixed(2) : '0';
}

