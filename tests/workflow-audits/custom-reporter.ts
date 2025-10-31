/**
 * Custom Markdown Reporter for Workflow Audits
 * Generates detailed workflow_audit_results.md
 * Build with the Holy Spirit
 */

import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface AuditResult {
  component: string;
  expected: string;
  actual: string;
  status: 'pass' | 'fail';
  error?: string;
  screenshot?: string;
}

class WorkflowAuditReporter implements Reporter {
  private results: Map<string, AuditResult[]> = new Map();
  private startTime?: Date;
  private endTime?: Date;

  onBegin() {
    this.startTime = new Date();
    console.log('\n🔍 Starting Workflow Audit...\n');
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const projectName = test.parent.project()?.name || 'unknown';
    
    if (!this.results.has(projectName)) {
      this.results.set(projectName, []);
    }

    // Extract audit data from test annotations or title
    const auditData: AuditResult = {
      component: test.title,
      expected: this.extractExpected(test),
      actual: result.status === 'passed' ? 'Correct' : 'Failed',
      status: result.status === 'passed' ? 'pass' : 'fail',
      error: result.error?.message,
      screenshot: result.attachments.find(a => a.name === 'screenshot')?.path,
    };

    this.results.get(projectName)!.push(auditData);
  }

  onEnd(result: FullResult) {
    this.endTime = new Date();
    this.generateMarkdownReport();
    console.log('\n✅ Workflow Audit Complete!\n');
    console.log(`📄 Report: tests/reports/workflow_audit_results.md\n`);
  }

  private extractExpected(test: TestCase): string {
    // Try to extract from test title or annotations
    const match = test.title.match(/should navigate to (.+)/);
    return match ? match[1] : 'See test description';
  }

  private generateMarkdownReport() {
    const reportPath = path.join(process.cwd(), 'tests', 'reports', 'workflow_audit_results.md');
    
    let markdown = this.generateReportHeader();
    
    // Summary
    markdown += this.generateSummary();
    
    // Detailed results per app
    for (const [appName, results] of this.results.entries()) {
      markdown += this.generateAppSection(appName, results);
    }
    
    // Auto-fix suggestions
    markdown += this.generateAutoFixSuggestions();
    
    // Footer
    markdown += this.generateFooter();
    
    // Write to file
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, markdown, 'utf-8');
  }

  private generateReportHeader(): string {
    return `# Kingdom Studios - Workflow Audit Results

Build with the Holy Spirit 🙏

**Generated**: ${this.startTime?.toLocaleString()}  
**Duration**: ${this.getDuration()}

---

## Executive Summary

This report contains a comprehensive audit of all routes, buttons, workflows, and navigation paths across all Kingdom Studios applications.

`;
  }

  private generateSummary(): string {
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;

    for (const results of this.results.values()) {
      totalTests += results.length;
      totalPassed += results.filter(r => r.status === 'pass').length;
      totalFailed += results.filter(r => r.status === 'fail').length;
    }

    const passRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : '0';

    return `### Overall Results

| Metric | Count |
|--------|-------|
| Total Tests | ${totalTests} |
| ✅ Passed | ${totalPassed} |
| ❌ Failed | ${totalFailed} |
| Pass Rate | ${passRate}% |

---

`;
  }

  private generateAppSection(appName: string, results: AuditResult[]): string {
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const passRate = results.length > 0 ? ((passed / results.length) * 100).toFixed(2) : '0';

    let section = `## ${this.formatAppName(appName)}

**Status**: ${failed === 0 ? '✅ All Tests Passed' : `⚠️ ${failed} Test(s) Failed`}  
**Pass Rate**: ${passRate}% (${passed}/${results.length})

### Test Results

| Component | Expected Destination | Actual Destination | Status |
|-----------|---------------------|-------------------|--------|
`;

    for (const result of results) {
      const status = result.status === 'pass' ? '✅ Pass' : '❌ Fail';
      const actual = result.actual || (result.error ? 'Error' : 'Unknown');
      section += `| ${result.component} | ${result.expected} | ${actual} | ${status} |\n`;
    }

    // Add failed tests details
    const failedResults = results.filter(r => r.status === 'fail');
    if (failedResults.length > 0) {
      section += `\n### Failed Tests Details\n\n`;
      for (const result of failedResults) {
        section += `#### ❌ ${result.component}\n\n`;
        section += `- **Expected**: ${result.expected}\n`;
        section += `- **Actual**: ${result.actual}\n`;
        if (result.error) {
          section += `- **Error**: \`${result.error}\`\n`;
        }
        if (result.screenshot) {
          section += `- **Screenshot**: ${result.screenshot}\n`;
        }
        section += `\n`;
      }
    }

    section += `\n---\n\n`;
    return section;
  }

  private generateAutoFixSuggestions(): string {
    let suggestions = `## Auto-Fix Suggestions\n\n`;
    let hasSuggestions = false;

    for (const [appName, results] of this.results.entries()) {
      const failedResults = results.filter(r => r.status === 'fail');
      
      if (failedResults.length > 0) {
        hasSuggestions = true;
        suggestions += `### ${this.formatAppName(appName)}\n\n`;
        
        for (const result of failedResults) {
          suggestions += `#### ${result.component}\n\n`;
          suggestions += this.generateFixSuggestion(result);
          suggestions += `\n`;
        }
      }
    }

    if (!hasSuggestions) {
      suggestions += `✅ No fixes needed - all tests passed!\n\n`;
    }

    suggestions += `---\n\n`;
    return suggestions;
  }

  private generateFixSuggestion(result: AuditResult): string {
    let suggestion = `**Suggested Fix**:\n\n`;
    
    if (result.error?.includes('not found') || result.error?.includes('404')) {
      suggestion += `\`\`\`typescript
// Add missing route/component
// Expected: ${result.expected}
// Check navigation configuration and ensure route exists
\`\`\`\n\n`;
    } else if (result.error?.includes('redirect')) {
      suggestion += `\`\`\`typescript
// Fix redirect path
// Update redirect to: ${result.expected}
\`\`\`\n\n`;
    } else if (result.error?.includes('auth') || result.error?.includes('permission')) {
      suggestion += `\`\`\`typescript
// Check authentication/authorization
// Ensure proper auth flow to: ${result.expected}
\`\`\`\n\n`;
    } else {
      suggestion += `\`\`\`typescript
// Review navigation logic
// Component: ${result.component}
// Expected destination: ${result.expected}
\`\`\`\n\n`;
    }

    return suggestion;
  }

  private generateFooter(): string {
    return `## Next Steps

1. Review failed tests and implement suggested fixes
2. Re-run audit after fixes: \`npm run audit:workflows\`
3. Verify auto-fix suggestions work as expected
4. Update navigation documentation

---

**Report Generated**: ${this.endTime?.toLocaleString()}  
**Build with the Holy Spirit** 🙏
`;
  }

  private formatAppName(name: string): string {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getDuration(): string {
    if (!this.startTime || !this.endTime) return 'Unknown';
    const duration = this.endTime.getTime() - this.startTime.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
  }
}

export default WorkflowAuditReporter;

