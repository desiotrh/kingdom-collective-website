# Localhost:3000 Testing Suite

Comprehensive testing configuration for Kingdom Studios App on localhost:3000

## Overview

This testing suite provides thorough local development testing capabilities including:

- API endpoint testing
- Frontend component testing
- Integration testing
- Performance testing
- End-to-end testing

## Quick Start

### 1. Start Backend (Port 3000)

```bash
npm run dev:backend
```

### 2. Start Frontend (Port 8081 - Expo default)

```bash
npm run start
```

### 3. Run Tests

```bash
# All localhost tests
npm run test:localhost

# Specific test suites
npm run test:api          # API endpoint tests
npm run test:integration  # Integration tests
npm run test:e2e         # End-to-end tests
npm run test:performance # Performance tests
```

## Testing Modes

### 1. API Testing

Tests all backend endpoints on localhost:3000

- Health checks
- Authentication
- CRUD operations
- Error handling

### 2. Integration Testing

Tests frontend-backend integration

- Data flow
- State management
- API calls from components

### 3. Performance Testing

Load and stress testing

- Response times
- Concurrent users
- Memory usage
- Database performance

### 4. E2E Testing

Full user flow testing

- User registration/login
- Content creation
- Navigation
- Form submissions

## Test Configuration

All test configurations are in `/testing/localhost/config/`

### Environment Setup

Create `.env.test` in project root:

```env
NODE_ENV=test
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:8081
TEST_TIMEOUT=30000
```

## Running Specific Tests

### Health Check

```bash
npm run test:health
```

### API Endpoints

```bash
npm run test:api:auth
npm run test:api:users
npm run test:api:content
```

### Performance

```bash
npm run test:load        # Load testing
npm run test:stress      # Stress testing
npm run test:spike       # Spike testing
```

## Test Reports

Test reports are generated in `/testing/reports/`

- HTML reports: `/testing/reports/html/`
- JSON results: `/testing/reports/json/`
- Coverage: `/testing/reports/coverage/`

## Continuous Testing

### Watch Mode

```bash
npm run test:watch
```

### Pre-commit Testing

Tests automatically run before git commits (configure in git hooks)

## Troubleshooting

### Backend Not Running

```bash
# Check if backend is running
curl http://localhost:3000/health

# Start backend
npm run dev:backend
```

### Port Conflicts

```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (Windows PowerShell)
Stop-Process -Id <PID> -Force
```

### Test Failures

1. Ensure backend is running on port 3000
2. Check database connectivity
3. Verify environment variables
4. Clear test cache: `npm run test:clear-cache`

---

Build with the Holy Spirit 🙏
