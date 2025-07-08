# Kingdom Studios API Setup Guide

This guide will walk you through setting up all the API integrations for Kingdom Studios. Follow the steps in order for the best experience.

## 🔧 Quick Setup

1. **Copy Environment File**

   ```bash
   cp .env.example .env
   ```

2. **Install Dependencies** (if not already done)

   ```bash
   npm install
   ```

3. **Follow the API setup sections below**

## 📋 API Setup Checklist

### ✅ Essential APIs (Required for core functionality)

- [ ] **Firebase** - Authentication & Database
- [ ] **OpenAI** - AI Content Generation
- [ ] **Stripe** - Payment Processing

### 🎯 Business APIs (For e-commerce features)

- [ ] **Etsy** - Handmade marketplace integration
- [ ] **Printify** - Print-on-demand products
- [ ] **Shopify** - E-commerce store integration

### 📊 Analytics APIs (For business insights)

- [ ] **Google Analytics 4** - Web/app analytics
- [ ] **Facebook Analytics** - Social media insights

### 📧 Marketing APIs (For email marketing)

- [ ] **ConvertKit** - Email marketing automation
- [ ] **Mailchimp** - Email marketing platform

---

## 🔥 Essential API Setup

### 1. Firebase (Authentication & Database)

**Why:** Core app functionality, user authentication, data storage

**Setup Steps:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "Kingdom Studios"
3. Enable Authentication with Email/Password and Google
4. Create a Firestore database
5. Get your config from Project Settings > General

**Add to .env:**

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=kingdom-studios.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=kingdom-studios
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=kingdom-studios.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 2. OpenAI (AI Content Generation)

**Why:** Powers all AI content generation features

**Setup Steps:**

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key
5. Set usage limits to control costs

**Add to .env:**

```env
EXPO_PUBLIC_OPENAI_API_KEY=sk-your_openai_key_here
```

**💡 Tip:** Start with a low usage limit ($5-10) to test the integration safely.

### 3. Stripe (Payment Processing)

**Why:** Handle subscriptions and one-time payments

**Setup Steps:**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account
3. Get your test keys from Developers > API Keys
4. For production, complete account verification and get live keys

**Add to .env:**

```env
# Test keys for development
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
EXPO_PUBLIC_STRIPE_SECRET_KEY=sk_test_your_key_here
```

---

## 🛒 E-commerce API Setup

### 4. Etsy API

**Why:** Sync handmade and faith-based products

**Setup Steps:**

1. Go to [Etsy Developers](https://www.etsy.com/developers/)
2. Create a new app
3. Get your API key

**Add to .env:**

```env
EXPO_PUBLIC_ETSY_API_KEY=your_etsy_key_here
```

### 5. Printify API

**Why:** Print-on-demand t-shirts and merchandise

**Setup Steps:**

1. Go to [Printify Developers](https://developers.printify.com/)
2. Create an account and get API access
3. Generate API token

**Add to .env:**

```env
EXPO_PUBLIC_PRINTIFY_API_KEY=your_printify_key_here
```

### 6. Shopify API

**Why:** Full e-commerce store integration

**Setup Steps:**

1. Create a Shopify Partner account
2. Create a development store
3. Create a private app with necessary permissions
4. Get API credentials

**Add to .env:**

```env
EXPO_PUBLIC_SHOPIFY_API_KEY=your_shopify_key_here
EXPO_PUBLIC_SHOPIFY_STORE_URL=your-store.myshopify.com
```

---

## 📊 Analytics API Setup

### 7. Google Analytics 4

**Why:** Track user behavior and app performance

**Setup Steps:**

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Set up data streams for iOS, Android, and Web
4. Get your Measurement ID

**Add to .env:**

```env
EXPO_PUBLIC_GA4_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID
```

### 8. Facebook Analytics

**Why:** Social media insights and pixel tracking

**Setup Steps:**

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Analytics
4. Get your App ID

**Add to .env:**

```env
EXPO_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

---

## 📧 Email Marketing Setup

### 9. ConvertKit

**Why:** Automated email sequences for creators

**Setup Steps:**

1. Go to [ConvertKit](https://app.convertkit.com/)
2. Sign up for an account
3. Go to Account Settings > Advanced Settings
4. Generate API key and secret

**Add to .env:**

```env
EXPO_PUBLIC_CONVERTKIT_API_KEY=your_convertkit_key
EXPO_PUBLIC_CONVERTKIT_API_SECRET=your_convertkit_secret
```

### 10. Mailchimp (Alternative)

**Why:** Alternative email marketing platform

**Setup Steps:**

1. Go to [Mailchimp](https://mailchimp.com/)
2. Create an account
3. Go to Account > Extras > API Keys
4. Generate a new API key

**Add to .env:**

```env
EXPO_PUBLIC_MAILCHIMP_API_KEY=your_mailchimp_key-us1
EXPO_PUBLIC_MAILCHIMP_SERVER_PREFIX=us1
```

---

## 🚀 Testing Your Setup

After adding your API keys, test each integration:

1. **Start the app:**

   ```bash
   npm start
   ```

2. **Test Features:**

   - ✅ Login/Register (Firebase)
   - ✅ Generate content (OpenAI)
   - ✅ Sync products (E-commerce APIs)
   - ✅ Process payment (Stripe)
   - ✅ Check analytics (Analytics APIs)

3. **Check Settings Screen:**
   - Go to Settings > API Configuration
   - Test each API connection
   - Green checkmarks = working properly

---

## 🔒 Security Best Practices

1. **Never commit .env file to git**

   ```bash
   # .env is already in .gitignore
   ```

2. **Use environment-specific keys:**

   - Development: Test/sandbox keys
   - Production: Live/production keys

3. **Set usage limits:**

   - OpenAI: Set monthly spending limits
   - Stripe: Set up fraud detection
   - APIs: Monitor usage regularly

4. **Rotate keys regularly:**
   - Change API keys every 3-6 months
   - Immediately if compromised

---

## 💡 Cost Management Tips

### Free Tiers Available:

- **Firebase:** 50k reads/day free
- **Stripe:** No monthly fees, 2.9% + 30¢ per transaction
- **Google Analytics:** Free for most usage
- **ConvertKit:** Free up to 1,000 subscribers

### Paid Services:

- **OpenAI:** ~$0.002 per 1k tokens (very affordable)
- **Printify:** Per-product costs
- **Etsy/Shopify:** Transaction fees

### Start Small:

1. Begin with free tiers
2. Add paid APIs as you scale
3. Monitor usage dashboards
4. Set up billing alerts

---

## 🆘 Troubleshooting

### Common Issues:

**"API key not found" errors:**

- Check .env file exists and has correct key names
- Restart Expo dev server after adding keys
- Verify no extra spaces in key values

**Firebase auth issues:**

- Enable Email/Password authentication in Firebase Console
- Add your domain to authorized domains
- Check Firebase project ID matches

**Payment issues:**

- Use Stripe test keys for development
- Check webhook endpoints are configured
- Verify Stripe account is activated

### Getting Help:

1. **Check app logs** in Expo dev tools
2. **Test API keys** in their respective dashboards
3. **Review API documentation** for each service
4. **Contact support** if issues persist

---

## 🎯 Next Steps

Once your APIs are configured:

1. **Set up backend endpoints** (next section)
2. **Configure analytics tracking** (next section)
3. **Test all features** thoroughly
4. **Deploy to staging** environment
5. **Beta test** with real users

**You're doing great! Each API you add makes Kingdom Studios more powerful! 🚀👑**
