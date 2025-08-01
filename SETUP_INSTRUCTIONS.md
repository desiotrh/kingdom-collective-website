# 🚀 Kingdom Collective Website - Setup Instructions

## 📋 **Prerequisites**

- Node.js 18+ installed
- Git installed
- Stripe account with API keys
- (Optional) Beacons account for automated emails

## 🔧 **Environment Setup**

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Configure Environment Variables**

Copy the template and add your actual keys:

```bash
# Copy the template
cp env-template.txt .env.local

# Edit the file with your actual keys
nano .env.local  # or use your preferred editor
```

### 3. **Required Environment Variables**

Add these to your `.env.local` file:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key

# Base URL for your website
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Optional: Beacons Integration
BEACONS_FORM_URL=https://your-beacons-form-url.com
BEACONS_API_KEY=your_beacons_api_key_here
```

### 4. **Get Your Stripe Keys**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers → API keys**
3. Copy your **Publishable key** and **Secret key**
4. Add them to `.env.local`

## 🎯 **Features Included**

### ✅ **AI Bots Integration**
- 13 individual AI bot pages
- Kingdom-branded interactive demos
- Stripe checkout integration
- Feature-based add-ons system

### ✅ **Enhanced AI Assistant**
- Comprehensive responses about all Kingdom apps
- Conversation memory and context
- Quick action buttons

### ✅ **Stripe Integration**
- Secure checkout for AI bots
- Feature-based add-ons
- Order management system

### ✅ **User Dashboard**
- AI bots management
- Order history
- Notifications system

## 🚀 **Deployment**

### **Development**
```bash
npm run dev
```

### **Production**
```bash
npm run build
npm start
```

## 🔒 **Security Notes**

- ✅ `.env.local` is in `.gitignore` (never committed)
- ✅ API keys are only used server-side
- ✅ Stripe keys are properly secured
- ✅ No secrets in the repository

## 📞 **Support**

If you need help with setup or deployment, check the documentation in the `/docs` folder.

---

**🎉 Your Kingdom Collective website is ready to go live!** 