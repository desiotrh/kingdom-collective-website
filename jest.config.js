/**
 * Jest Configuration for Kingdom Studios App
 * Build with the Holy Spirit
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test match patterns
  testMatch: [
    '**/testing/**/*.test.js',
    '**/testing/**/*.spec.js'
  ],

  // Coverage configuration
  collectCoverage: false, // Enable with --coverage flag
  coverageDirectory: 'testing/reports/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Coverage collection patterns
  collectCoverageFrom: [
    'kingdom-studios-backend/src/**/*.js',
    'kingdom-studios/src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/*.config.js'
  ],

  // Test timeout
  testTimeout: 30000,

  // Verbose output
  verbose: true,

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/testing/config/jest.setup.js'],

  // Module paths
  moduleDirectories: ['node_modules', 'src'],

  // Transform files (if needed for TypeScript)
  transform: {
    '^.+\\.tsx?$': ['babel-jest', { rootMode: 'upward' }]
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/'
  ],

  // Reporter configuration
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Kingdom Studios Test Report',
        outputPath: 'testing/reports/test-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
        dateFormat: 'yyyy-mm-dd HH:MM:ss'
      }
    ]
  ]
};

