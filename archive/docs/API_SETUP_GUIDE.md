# 🔑 Kingdom Studios App - API Key Setup Guide

## 🚀 **QUICK START (Minimum Required)**

To get the app running immediately, you only need **2 API keys**:

1. **Firebase** (Free) - For authentication and database
2. **OpenAI** (Paid) - For AI content generation

**Total cost to start: ~$20-50/month for OpenAI**

---

## 📋 **STEP-BY-STEP SETUP**

### **🔥 STEP 1: Firebase Setup (Required - FREE)**

Firebase provides authentication, database, and file storage.

#### **1.1 Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `kingdom-studios-dev`
4. Enable Google Analytics (optional)
5. Click "Create project"

#### **1.2 Enable Services**

1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable: Email/Password, Google, Facebook (optional)
2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (we'll secure it later)
3. **Storage**:
   - Go to Storage
   - Click "Get started"
   - Start in test mode

#### **1.3 Get Configuration**

1. Go to Project Settings (⚙️ icon)
2. Scroll down to "Your apps"
3. Click "Add app" > Web app (</>)
4. App nickname: "Kingdom Studios Web"
5. Copy the config values:

```javascript
// Copy these values to your .env.local file
const firebaseConfig = {
  apiKey: "your-api-key", // EXPO_PUBLIC_FIREBASE_API_KEY
  authDomain: "your-project.firebaseapp.com", // EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "your-project-id", // EXPO_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "your-project.appspot.com", // EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789", // EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc123", // EXPO_PUBLIC_FIREBASE_APP_ID
  measurementId: "G-ABC123", // EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};
```

---

### **🤖 STEP 2: OpenAI API (Required - PAID)**

OpenAI powers the AI content generation features.

#### **2.1 Create OpenAI Account**

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Name: "Kingdom Studios App"
6. Copy the key (starts with `sk-`)

#### **2.2 Add Billing**

1. Go to [Billing](https://platform.openai.com/account/billing)
2. Add payment method
3. Set usage limits (recommended: $50/month to start)

#### **2.3 Configuration**

```bash
EXPO_PUBLIC_OPENAI_API_KEY=sk-your_actual_openai_key_here
```

**Cost Estimate**: $20-50/month for moderate usage

---

### **📱 STEP 3: Social Media APIs (Optional)**

These enable posting to social platforms. Start with 1-2 platforms.

#### **🔵 Facebook/Instagram (FREE)**

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create app > "Consumer" > "Add Facebook Login"
3. App Settings > Basic:
   - Copy App ID and App Secret
4. Add Instagram Basic Display (for Instagram)

```bash
EXPO_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
EXPO_PUBLIC_FACEBOOK_APP_SECRET=your_facebook_app_secret
```

#### **🐦 Twitter (FREE TIER)**

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Apply for developer account
3. Create new app
4. Keys and tokens > API Key and Secret

```bash
EXPO_PUBLIC_TWITTER_API_KEY=your_twitter_api_key
EXPO_PUBLIC_TWITTER_API_SECRET=your_twitter_api_secret
```

#### **💼 LinkedIn (FREE)**

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create new app
3. Products > Add "Sign In with LinkedIn"
4. Auth > Copy Client ID and Secret

```bash
EXPO_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
EXPO_PUBLIC_LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

---

### **📧 STEP 4: Email Service (Optional)**

Choose **SendGrid** (recommended) for email marketing.

#### **📮 SendGrid Setup (FREE TIER)**

1. Go to [SendGrid](https://sendgrid.com/)
2. Sign up for free account (100 emails/day free)
3. Settings > API Keys > Create API Key
4. Choose "Full Access" or "Mail Send" only

```bash
EXPO_PUBLIC_SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
```

**Cost**: Free tier (100 emails/day), then $15/month

---

### **💳 STEP 5: Payment Processing (Optional)**

For subscription billing and payments.

#### **💰 Stripe Setup**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create account
3. Developers > API Keys
4. Copy "Publishable key" (starts with `pk_test_`)

```bash
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_test_key
```

**Cost**: 2.9% + 30¢ per transaction

---

## 🔧 **CONFIGURATION STEPS**

### **Step 1: Copy Environment Template**

```bash
cd kingdom-studios
cp .env.local.template .env.local
```

### **Step 2: Edit Your API Keys**

Open `.env.local` and replace the placeholder values:

```bash
# Replace with your actual Firebase config
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC_your_actual_firebase_key

# Replace with your actual OpenAI key
EXPO_PUBLIC_OPENAI_API_KEY=sk-your_actual_openai_key

# Add other keys as you get them...
```

### **Step 3: Test the Configuration**

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Test the app
npm run ios    # or
npm run android # or
npm run web
```

---

## ✅ **TESTING CHECKLIST**

After adding API keys, test these features:

### **🔥 Firebase Features**

- [ ] User registration works
- [ ] User login works
- [ ] Data saves to Firestore
- [ ] File upload works

### **🤖 OpenAI Features**

- [ ] AI content generation works
- [ ] Different content types work
- [ ] Streaming responses work

### **📱 Social Media (if configured)**

- [ ] Platform connection works
- [ ] Test post creation
- [ ] Scheduling works

### **📧 Email (if configured)**

- [ ] Send test email
- [ ] Campaign creation works

---

## 🚨 **SECURITY NOTES**

### **🔒 Keep API Keys Secret**

- Never commit `.env.local` to git
- Use different keys for development/production
- Rotate keys periodically

### **🛡️ Firebase Security**

- Set up proper Firestore security rules
- Enable App Check for production
- Use Firebase Auth for user verification

---

## 💰 **COST SUMMARY**

### **Minimum to Start**

- Firebase: **FREE** (generous free tier)
- OpenAI: **$20-50/month** (moderate usage)
- **Total: $20-50/month**

### **With All Features**

- Firebase: $25-100/month (paid tier)
- OpenAI: $50-200/month (heavy usage)
- SendGrid: $15-50/month (email marketing)
- Social APIs: FREE (most platforms)
- Stripe: 2.9% per transaction
- **Total: $90-350/month**

---

## 🚀 **READY TO LAUNCH?**

Once you have Firebase + OpenAI configured:

```bash
# Test everything works
npm start

# Deploy to staging
npm run deploy:staging

# Deploy to production (when ready)
npm run deploy:production
```

---

## 🆘 **NEED HELP?**

### **Common Issues**

1. **Firebase config errors**: Double-check all config values
2. **OpenAI rate limits**: Check your usage limits and billing
3. **CORS errors**: Make sure domains are whitelisted
4. **Social API errors**: Verify app permissions and URLs

### **Support Resources**

- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Expo Documentation](https://docs.expo.dev/)

---

**🎉 You're ready to launch the Kingdom Studios App! 🚀**
