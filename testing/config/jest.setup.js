/**
 * Jest Setup File
 * Runs before all tests
 * Build with the Holy Spirit
 */

const path = require('path');
const fs = require('fs');

// Load test environment variables
const envPath = path.join(__dirname, 'test.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
}

// Set default test environment variables if not set
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.API_URL = process.env.API_URL || 'http://localhost:3000';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8081';

// Global test setup
beforeAll(() => {
  console.log('\n🙏 Build with the Holy Spirit\n');
  console.log(`Test Environment: ${process.env.NODE_ENV}`);
  console.log(`API URL: ${process.env.API_URL}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}\n`);
});

// Global test teardown
afterAll(() => {
  console.log('\n✨ Tests completed!\n');
});

// Increase timeout for all tests
jest.setTimeout(30000);

// Global test utilities
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

global.testHelpers = {
  generateTestEmail: () => `test_${Date.now()}@kingdom.test`,
  generateTestUser: () => ({
    email: `test_${Date.now()}@kingdom.test`,
    password: 'TestPassword123!',
    name: 'Test User'
  })
};

