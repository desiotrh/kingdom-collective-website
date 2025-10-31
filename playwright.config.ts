/**
 * Playwright Configuration for Kingdom Studios Workflow Audits
 * Build with the Holy Spirit
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests/workflow-audits',
  
  // Timeout for each test
  timeout: 60 * 1000,
  
  // Test execution settings
  fullyParallel: false, // Run sequentially for accurate reporting
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'tests/reports/playwright-html', open: 'never' }],
    ['json', { outputFile: 'tests/reports/playwright-results.json' }],
    ['list'],
    ['./tests/workflow-audits/custom-reporter.ts'] // Custom reporter for markdown
  ],
  
  // Shared settings for all tests
  use: {
    // Base URL for apps
    baseURL: process.env.BASE_URL || 'http://localhost:8081',
    
    // Collect trace on first retry
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Action timeout
    actionTimeout: 10 * 1000,
    
    // Navigation timeout
    navigationTimeout: 30 * 1000,
  },

  // Configure projects for different apps
  projects: [
    {
      name: 'kingdom-studios',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8081',
      },
      testMatch: '**/kingdom-studios.spec.ts',
    },
    {
      name: 'kingdom-circle',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8082',
      },
      testMatch: '**/kingdom-circle.spec.ts',
    },
    {
      name: 'kingdom-clips',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8083',
      },
      testMatch: '**/kingdom-clips.spec.ts',
    },
    {
      name: 'kingdom-launchpad',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8084',
      },
      testMatch: '**/kingdom-launchpad.spec.ts',
    },
    {
      name: 'kingdom-lens',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8085',
      },
      testMatch: '**/kingdom-lens.spec.ts',
    },
    {
      name: 'kingdom-stand',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8086',
      },
      testMatch: '**/kingdom-stand.spec.ts',
    },
    {
      name: 'kingdom-voice',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8087',
      },
      testMatch: '**/kingdom-voice.spec.ts',
    },
    {
      name: 'kingdom-website',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:19006',
      },
      testMatch: '**/kingdom-website.spec.ts',
    },
  ],

  // Web server configuration (optional)
  // webServer: {
  //   command: 'npm run dev:all',
  //   port: 8081,
  //   timeout: 120 * 1000,
  //   reuseExistingServer: !process.env.CI,
  // },
});

