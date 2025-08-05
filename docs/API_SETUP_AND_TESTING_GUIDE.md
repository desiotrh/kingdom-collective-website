# 🚀 API Setup & Testing Guide - Pre-Deployment

## 📋 **Phase 1: API Configuration**

### **1.1 Required APIs (Priority 1)**

#### **Firebase Setup (Core)**

```bash
# 1. Get Firebase Config
# Go to Firebase Console → Project Settings → General → Your Apps
# Copy the config object for each app

# 2. Update environment files
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=kingdom-studios-dev.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=kingdom-studios-dev
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=kingdom-studios-dev.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

#### **OpenAI API (AI Features)**

```bash
# 1. Get OpenAI API Key
# Go to https://platform.openai.com/api-keys
# Create new API key

# 2. Update environment files
EXPO_PUBLIC_OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_API_KEY=sk-your_openai_api_key_here
```

#### **Stripe (Payments)**

```bash
# 1. Get Stripe Keys
# Go to Stripe Dashboard → Developers → API Keys
# Use test keys for development

# 2. Update environment files
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### **1.2 Optional APIs (Priority 2)**

#### **Social Media APIs**

```bash
# Instagram
EXPO_PUBLIC_INSTAGRAM_APP_ID=your_instagram_app_id
EXPO_PUBLIC_INSTAGRAM_APP_SECRET=your_instagram_app_secret

# Twitter
EXPO_PUBLIC_TWITTER_API_KEY=your_twitter_api_key
EXPO_PUBLIC_TWITTER_API_SECRET=your_twitter_api_secret
EXPO_PUBLIC_TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# Facebook
EXPO_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

#### **Analytics APIs**

```bash
# Google Analytics
EXPO_PUBLIC_GA4_MEASUREMENT_ID=your_ga4_measurement_id
EXPO_PUBLIC_GA4_API_SECRET=your_ga4_api_secret

# Mixpanel
EXPO_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
```

## 🧪 **Phase 2: Testing Checklist**

### **2.1 Backend Testing**

#### **Start Backend Server**

```bash
cd kingdom-studios-backend
npm install
npm run dev
```

#### **Test API Endpoints**

```bash
# Health Check
curl http://localhost:3000/health

# Authentication
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Content Generation
curl -X POST http://localhost:3000/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{"platform":"instagram","contentType":"post","prompt":"faith-based content"}'
```

### **2.2 Frontend Testing**

#### **Test Each App**

```bash
# Kingdom Studios
cd kingdom-studios
npm install
expo start --web

# Kingdom Clips
cd apps/kingdom-clips
npm install
expo start --web

# Kingdom Voice
cd apps/kingdom-voice
npm install
expo start --web

# Kingdom Launchpad
cd apps/kingdom-launchpad
npm install
expo start --web

# Kingdom Circle
cd apps/kingdom-circle
npm install
expo start --web

# Kingdom Lens
cd apps/kingdom-lens
npm install
expo start --web
```

### **2.3 Integration Testing**

#### **Test Authentication Flow**

- [ ] User registration
- [ ] User login
- [ ] Token storage
- [ ] Logout functionality
- [ ] Password reset

#### **Test Content Generation**

- [ ] Platform selection (Instagram, Facebook, LinkedIn, TikTok, Twitter)
- [ ] Content types (posts, captions, reels, threads)
- [ ] Faith mode integration
- [ ] AI response quality

#### **Test Payment Integration**

- [ ] Stripe payment flow
- [ ] Subscription management
- [ ] Webhook handling
- [ ] Payment success/failure scenarios

#### **Test File Upload**

- [ ] Image upload to Firebase Storage
- [ ] Video upload functionality
- [ ] File size limits
- [ ] File type validation

## 🔧 **Phase 3: Environment Setup**

### **3.1 Create Environment Files**

#### **For Kingdom Studios (Main App)**

```bash
cd kingdom-studios
cp env-template.txt .env.local
# Edit .env.local with your actual API keys
```

#### **For Backend**

```bash
cd kingdom-studios-backend
cp env-template.txt .env
# Edit .env with your actual API keys
```

#### **For Each App**

```bash
# Repeat for each app
cd apps/kingdom-clips
cp env-template.txt .env.local
# Edit with API keys
```

### **3.2 Firebase Project Setup**

#### **Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: `kingdom-studios-dev`
3. Enable Authentication (Email/Password, Google, Facebook)
4. Enable Firestore Database
5. Enable Storage
6. Enable Functions

#### **Configure Firebase for Each App**

```bash
# For each app directory
firebase init
# Select: Hosting, Firestore, Functions, Storage
# Use project: kingdom-studios-dev
```

## 🚀 **Phase 4: Quick Test Commands**

### **4.1 Test Backend**

```bash
cd kingdom-studios-backend
npm test
npm run test:coverage
```

### **4.2 Test Frontend**

```bash
cd kingdom-studios
npm test
expo start --web
# Test in browser
```

### **4.3 Test API Connections**

```bash
# Test OpenAI
node test-openai.js

# Test Firebase
node test-firebase.js

# Test Stripe
node test-stripe.js
```

## ✅ **Phase 5: Deployment Readiness Checklist**

### **5.1 API Configuration**

- [ ] Firebase project created and configured
- [ ] OpenAI API key obtained and tested
- [ ] Stripe account created and test keys configured
- [ ] All environment variables set
- [ ] Social media APIs configured (optional)

### **5.2 Testing Complete**

- [ ] Backend server running and responding
- [ ] All apps building and running
- [ ] Authentication flow working
- [ ] Content generation working
- [ ] Payment flow working
- [ ] File upload working

### **5.3 Security & Performance**

- [ ] Environment variables secured
- [ ] API rate limits configured
- [ ] Error handling implemented
- [ ] Performance monitoring set up

## 🎯 **Next Steps After Testing**

1. **Fix any issues** found during testing
2. **Update environment variables** for production
3. **Deploy to Firebase** (apps and backend)
4. **Deploy to Vercel** (website)
5. **Monitor and optimize** performance

## 📞 **Need Help?**

If you encounter issues during setup:

1. Check the error logs
2. Verify API keys are correct
3. Ensure all dependencies are installed
4. Test each component individually
5. Check network connectivity

**Ready to start testing?** Let's begin with the API configuration! 🚀
