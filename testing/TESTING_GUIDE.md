# Kingdom Studios App - Complete Testing Guide

Build with the Holy Spirit 🙏

## Table of Contents

1. [Quick Start](#quick-start)
2. [Testing Overview](#testing-overview)
3. [Localhost Testing](#localhost-testing)
4. [Test Types](#test-types)
5. [Running Tests](#running-tests)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## Quick Start

### Prerequisites

1. **Start Backend Server (Port 3000)**

   ```bash
   npm run dev:backend
   ```

2. **Start Frontend (Optional for integration tests)**
   ```bash
   npm run start
   ```

### Run Quick Health Check

```bash
npm run test:quick
```

### Run All Tests

```bash
npm run test:all
```

---

## Testing Overview

### Testing Structure

```
testing/
├── localhost/          # Localhost:3000 specific tests
│   ├── health-check.test.js
│   ├── api-endpoints.test.js
│   └── quick-test.js
├── integration/        # Frontend-backend integration
│   └── frontend-backend.test.js
├── e2e/               # End-to-end user flows
│   └── user-flow.test.js
├── performance/       # Load and stress tests
│   ├── load-test.js
│   └── stress-test.js
├── config/            # Test configurations
│   └── test.env
└── reports/           # Test reports (auto-generated)
```

### Test Categories

#### 1. Health Checks ✅

- Server connectivity
- Response times
- API availability

#### 2. API Tests 🔌

- Endpoint functionality
- Authentication
- Data validation
- Error handling

#### 3. Integration Tests 🔗

- Frontend-backend communication
- CORS configuration
- Data flow
- Error propagation

#### 4. E2E Tests 🎭

- Complete user journeys
- Registration flow
- Authentication flow
- User interactions

#### 5. Performance Tests 🚀

- Load testing
- Stress testing
- Response times
- Concurrent users

---

## Localhost Testing

### Port Configuration

- **Backend API**: `localhost:3000`
- **Frontend (Expo)**: `localhost:8081`
- **Web (Expo)**: `localhost:19006`

### Quick Localhost Test

```bash
# Fast health check
npm run test:quick

# Expected output:
# ✅ Server is running
# ⚡ Response time: 45ms
# ✅ JSON response confirmed
# Status: PASSED ✅
```

### Comprehensive Localhost Tests

```bash
# All localhost tests
npm run test:localhost

# Specific test suites
npm run test:health     # Health checks only
npm run test:api        # API endpoint tests
```

---

## Test Types

### 1. Health Check Tests

**Purpose**: Verify server is running and responsive

**Run**: `npm run test:health`

**Tests**:

- Server connectivity on port 3000
- Response time < 1 second
- Correct headers
- CORS configuration

**Example Output**:

```
✅ Backend server is healthy
⚡ Response time: 45ms
✅ Correct headers returned
✅ CORS configuration verified
```

---

### 2. API Endpoint Tests

**Purpose**: Test all API endpoints thoroughly

**Run**: `npm run test:api`

**Tests**:

- Authentication endpoints
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/me
  - POST /api/auth/logout
- Error handling
  - 404 Not Found
  - 401 Unauthorized
  - 400 Bad Request

**Example Output**:

```
✅ User registration successful
✅ User login successful
✅ Get current user successful
✅ 404 error handled correctly
```

---

### 3. Integration Tests

**Purpose**: Test frontend-backend integration

**Run**: `npm run test:integration`

**Tests**:

- API connectivity from frontend
- CORS headers
- Data format validation
- JSON request handling
- Error response format

**Example Output**:

```
✅ Frontend-Backend connectivity verified
✅ CORS configuration verified
✅ Data format verified
✅ Concurrent requests handled correctly
```

---

### 4. End-to-End Tests

**Purpose**: Test complete user flows

**Run**: `npm run test:e2e`

**Tests**:

- Complete registration flow
- Login → Access protected route → Logout
- Profile updates
- Error recovery

**Example Output**:

```
✅ Step 1 complete: User registered
✅ Step 2 complete: User logged in
✅ Step 3 complete: Accessed protected route
✅ Step 4 complete: Profile updated
✅ Step 5 complete: User logged out
```

---

### 5. Performance Tests

**Purpose**: Test system performance under load

#### Load Testing

```bash
npm run test:load
```

**Tests**:

- Normal load (10 concurrent users)
- 60 second duration
- Request throughput
- Response times
- Error rates

**Example Output**:

```
📊 Load Test Results:
Total Requests: 1,245
Requests/sec: 20.75
Latency (avg): 48ms
Latency (p99): 120ms
Throughput: 2.4 MB/s
Errors: 0
✅ Load test PASSED
```

#### Stress Testing

```bash
npm run test:stress
```

**Tests**:

- Gradual load increase
- Breaking point detection
- System recovery
- Max capacity determination

**Example Output**:

```
📈 Phase 1: Warm-up (10 connections)
  Requests/sec: 20.50
  Latency (avg): 45ms
  Errors: 0

📈 Phase 2: Normal load (25 connections)
  Requests/sec: 19.80
  Latency (avg): 62ms
  Errors: 0

📈 Phase 3: High load (50 connections)
  Requests/sec: 18.50
  Latency (avg): 135ms
  Errors: 0

✅ System handled all stress levels successfully!
Recommended max capacity: 100 concurrent users
```

---

## Running Tests

### Single Commands

```bash
# Quick health check
npm run test:quick

# All tests
npm run test:all

# Localhost only
npm run test:localhost

# Integration only
npm run test:integration

# E2E only
npm run test:e2e

# Performance only
npm run test:performance
```

### Sequential Testing

```bash
# 1. Quick check
npm run test:quick

# 2. If passed, run full localhost tests
npm run test:localhost

# 3. If passed, run integration tests
npm run test:integration

# 4. If passed, run E2E tests
npm run test:e2e

# 5. Finally, performance tests
npm run test:performance
```

### Watch Mode

```bash
# Auto-rerun tests on file changes
npm run test:watch
```

---

## Test Reports

### Location

All test reports are saved in `testing/reports/`

### Report Types

1. **JSON Reports** (`testing/reports/*.json`)
   - Detailed test results
   - Timestamps
   - Performance metrics

2. **Performance Reports**
   - Load test results
   - Stress test results
   - Phase-by-phase analysis

### Viewing Reports

```bash
# View latest test report
cat testing/reports/load-test-results.json

# View stress test results
cat testing/reports/stress-test-100-connections.json
```

---

## Troubleshooting

### Backend Not Running

**Error**: `Cannot connect to localhost:3000`

**Solution**:

```bash
# Start backend
npm run dev:backend

# Verify it's running
npm run test:quick
```

---

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution** (Windows PowerShell):

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with actual process ID)
Stop-Process -Id <PID> -Force

# Restart backend
npm run dev:backend
```

---

### Slow Response Times

**Issue**: Tests failing due to timeouts

**Solutions**:

1. Check backend server logs
2. Verify database connection
3. Check system resources
4. Increase timeout in `testing/config/test.env`

---

### Database Connection Issues

**Error**: MongoDB/Redis connection errors

**Solutions**:

1. Ensure database is running
2. Check connection string in `.env`
3. Verify network connectivity
4. Use test database for testing

---

## Best Practices

### 1. Always Run Quick Test First

```bash
npm run test:quick
```

This ensures the server is running before running comprehensive tests.

### 2. Run Tests in Sequence

Don't run stress tests while developing. Use this order:

1. Quick test
2. Health checks
3. API tests
4. Integration tests
5. E2E tests
6. Performance tests (only when needed)

### 3. Monitor Test Reports

Check the `testing/reports/` folder for detailed results.

### 4. Clean Test Data

E2E and integration tests create test users. Clean them periodically:

```bash
# Delete test users from database
# (Create cleanup script as needed)
```

### 5. Use Watch Mode During Development

```bash
npm run test:watch
```

Automatically reruns tests when files change.

### 6. Performance Testing Guidelines

- Run performance tests separately
- Don't run during active development
- Run on production-like environment
- Allow cooldown between tests

---

## Environment Variables

### Test Configuration

Edit `testing/config/test.env`:

```env
# API
API_URL=http://localhost:3000
API_TIMEOUT=30000

# Frontend
FRONTEND_URL=http://localhost:8081

# Performance
LOAD_TEST_USERS=10
LOAD_TEST_DURATION=60
STRESS_TEST_USERS=100
STRESS_TEST_DURATION=120
```

---

## Continuous Integration

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npm run test:quick
```

### CI/CD Pipeline

Add to your CI/CD configuration:

```yaml
test:
  script:
    - npm run test:all
```

---

## Next Steps

1. **Set up automated testing**: Configure CI/CD
2. **Add more test cases**: Expand coverage
3. **Monitor test metrics**: Track over time
4. **Optimize performance**: Based on test results

---

## Support

For issues or questions:

1. Check troubleshooting section
2. Review test reports
3. Check backend logs
4. Contact: desi@kingdomcollective.pro

---

**Remember**: Testing is a blessing that helps us build with excellence!

Build with the Holy Spirit 🙏
