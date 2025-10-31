# Quick Start Guide - Kingdom Studios App

Build with the Holy Spirit 🙏

---

## ⚡ 3-Step Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Backend

```bash
npm run dev:backend
```

### Step 3: Test It

```bash
npm run test:quick
```

✅ If you see "Status: PASSED ✅" - you're ready to go!

---

## 📋 Essential Commands

### Backend

```bash
npm run dev:backend     # Start backend on localhost:3000
```

### Testing

```bash
npm run test:quick      # Fast health check (30 seconds)
npm run test:all        # Run all tests
npm run test:watch      # Auto-rerun tests on changes
```

### Session Logging

```bash
npm run log:session     # Log current session
```

---

## 📚 Documentation

- **Setup Complete**: `SETUP_COMPLETE.md` - Full setup details
- **Testing Guide**: `testing/TESTING_GUIDE.md` - Complete testing documentation
- **Testing Quick Ref**: `testing/README.md` - Quick testing reference
- **Chat History**: `.chat-history/README.md` - Session logging guide

---

## 🎯 Daily Workflow

1. Start backend: `npm run dev:backend`
2. Verify: `npm run test:quick`
3. Develop...
4. Test: `npm run test:all`
5. Log session: `npm run log:session`

---

## 🆘 Problems?

### Backend won't start?

```bash
# Check port 3000
netstat -ano | findstr :3000

# Kill process if needed
Stop-Process -Id <PID> -Force

# Restart
npm run dev:backend
```

### Tests failing?

1. Is backend running? (`npm run dev:backend`)
2. Check `testing/TESTING_GUIDE.md` for detailed help

---

## ✅ What You Have

- ✅ Chat history tracking system
- ✅ Comprehensive localhost:3000 testing
- ✅ 12 new test commands
- ✅ Complete documentation
- ✅ Automated session logging
- ✅ Performance testing tools

---

**For complete details, see** `SETUP_COMPLETE.md`

Build with the Holy Spirit 🙏
