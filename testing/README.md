# Testing Suite - Kingdom Studios App

Build with the Holy Spirit 🙏

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Backend Server

```bash
npm run dev:backend
```

### 3. Run Quick Test

```bash
npm run test:quick
```

## Available Test Commands

### Quick Tests

```bash
npm run test:quick        # Fast health check (30 seconds)
npm run test:health       # Comprehensive health checks
```

### API Tests

```bash
npm run test:api          # All API endpoint tests
npm run test:localhost    # All localhost:3000 tests
```

### Integration Tests

```bash
npm run test:integration  # Frontend-backend integration
npm run test:e2e         # End-to-end user flows
```

### Performance Tests

```bash
npm run test:load        # Load testing (10 users, 60s)
npm run test:stress      # Stress testing (up to 100 users)
npm run test:performance # Both load and stress tests
```

### Comprehensive Tests

```bash
npm run test:all         # All functional tests
npm run test:watch       # Watch mode for development
```

## Test Structure

```
testing/
├── localhost/           # Localhost:3000 tests
│   ├── health-check.test.js
│   ├── api-endpoints.test.js
│   └── quick-test.js
├── integration/         # Integration tests
│   └── frontend-backend.test.js
├── e2e/                # End-to-end tests
│   └── user-flow.test.js
├── performance/        # Performance tests
│   ├── load-test.js
│   └── stress-test.js
├── config/             # Test configuration
│   ├── test.env
│   └── jest.setup.js
├── reports/            # Test reports (auto-generated)
└── TESTING_GUIDE.md   # Complete testing documentation
```

## Documentation

📖 **[Complete Testing Guide](./TESTING_GUIDE.md)** - Comprehensive documentation with:

- Detailed test explanations
- Troubleshooting guide
- Best practices
- Examples and use cases

## Quick Reference

### Before Running Tests

1. ✅ Backend running on `localhost:3000`
2. ✅ Database connected (if applicable)
3. ✅ Dependencies installed

### Test Execution Order

1. `npm run test:quick` - Verify server is running
2. `npm run test:localhost` - Test all API endpoints
3. `npm run test:integration` - Test frontend-backend
4. `npm run test:e2e` - Test user flows
5. `npm run test:performance` - Load/stress tests (optional)

### Troubleshooting

**Server not running?**

```bash
npm run dev:backend
```

**Port conflict?**

```powershell
netstat -ano | findstr :3000
Stop-Process -Id <PID> -Force
```

**Need help?**
See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed troubleshooting.

## Reports

All test reports are saved in `testing/reports/`:

- Test results (JSON)
- Performance metrics
- Coverage reports
- HTML reports

## Environment Configuration

Edit `testing/config/test.env` to customize:

- API URL
- Timeouts
- Performance test parameters
- Database settings

---

For complete documentation, see **[TESTING_GUIDE.md](./TESTING_GUIDE.md)**

Build with the Holy Spirit 🙏
