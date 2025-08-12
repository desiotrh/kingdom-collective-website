# 🚀 Stripe Features Setup Guide for Kingdom AI Bots

**Date:** December 2024  
**Status:** SETUP INSTRUCTIONS  
**Purpose:** Convert add-ons from separate products to Stripe Features

## 🎯 Overview

Instead of having separate products for each add-on, we'll use **Stripe Features** which are monetizable capabilities that can be linked to products. This provides a cleaner checkout experience and better analytics.

## 📋 Manual Setup Steps

### Step 1: Create Features in Stripe Dashboard

1. **Go to your Stripe Dashboard**
2. **Navigate to:** Products → Features
3. **Click "Create feature"** for each add-on

### Step 2: Create These 8 Features

#### 1. Custom Branding
- **Name:** Custom Branding
- **Description:** Custom colors, logo, and brand integration for your AI bot
- **Price:** $50
- **Category:** Customization

#### 2. VoiceBot Integration
- **Name:** VoiceBot Integration
- **Description:** Kingdom Voice integration for voice-enabled interactions
- **Price:** $75
- **Category:** Integration

#### 3. Dual Tone Toggle
- **Name:** Dual Tone Toggle
- **Description:** Faith + Marketplace tone switching capability
- **Price:** $40
- **Category:** Customization

#### 4. Memory Engine
- **Name:** Memory Engine
- **Description:** Custom trained FAQ and conversation memory system
- **Price:** $125
- **Category:** AI

#### 5. Embed Service
- **Name:** Embed Service
- **Description:** Professional installation and embedding service
- **Price:** $60
- **Category:** Service

#### 6. Basic Analytics
- **Name:** Basic Analytics
- **Description:** Google Tag, Zapier, and analytics integration
- **Price:** $100
- **Category:** Analytics

#### 7. Legal & Compliance
- **Name:** Legal & Compliance
- **Description:** Legal disclaimers and compliance documentation
- **Price:** $30
- **Category:** Legal

#### 8. Stripe/Zapier Setup
- **Name:** Stripe/Zapier Setup
- **Description:** Payment processor and automation setup service
- **Price:** $125
- **Category:** Integration

## 🔗 Step 3: Link Features to Bot Products

For each of your 14 AI bot products:

1. **Go to the bot product** (e.g., Sales Assistant Bot)
2. **Click "Add features"**
3. **Select relevant features** for that bot
4. **Set pricing** for each feature

### Recommended Feature Mapping

#### Sales Assistant Bot
- Custom Branding
- VoiceBot Integration
- Memory Engine
- Basic Analytics

#### Lead Generation Bot
- Custom Branding
- Dual Tone Toggle
- Memory Engine
- Basic Analytics

#### Customer Support Bot
- Custom Branding
- VoiceBot Integration
- Memory Engine
- Embed Service
- Basic Analytics

#### Faith Bot
- Custom Branding
- Dual Tone Toggle
- Memory Engine
- Legal & Compliance

#### Enhanced Sales Bot
- Custom Branding
- VoiceBot Integration
- Memory Engine
- Basic Analytics
- Stripe/Zapier Setup

## 📝 Step 4: Update Configuration

After creating features, update the template with actual IDs:

```json
{
  "features": {
    "custom_branding": {
      "name": "Custom Branding",
      "description": "Custom colors, logo, and brand integration for your AI bot",
      "price": 50,
      "category": "customization",
      "featureId": "feat_ACTUAL_STRIPE_ID",
      "priceId": "price_ACTUAL_STRIPE_ID"
    }
  }
}
```

## 🔧 Step 5: Update Checkout System

### Current Approach (Separate Products)
```typescript
const lineItems = [
  { price: botPriceId, quantity: 1 },
  { price: addonPriceId, quantity: 1 } // Separate product
];
```

### New Approach (Features)
```typescript
const session = await stripe.checkout.sessions.create({
  line_items: [{ price: botPriceId, quantity: 1 }],
  features: [
    { feature: 'feat_custom_branding_id' },
    { feature: 'feat_voicebot_integration_id' }
  ]
});
```

## 🎯 Benefits of Using Features

### ✅ **Cleaner Customer Experience**
- One product (bot) + multiple features (add-ons)
- Single checkout flow
- Better product organization

### ✅ **Better Analytics**
- See which features are most popular
- Track feature adoption rates
- Understand customer preferences

### ✅ **Easier Management**
- Features are tied to products
- Automatic entitlement tracking
- Simpler inventory management

## 📊 Feature Configuration Template

Use the generated `stripe-features-template.json` file to track your feature IDs:

```json
{
  "features": {
    "custom_branding": {
      "name": "Custom Branding",
      "description": "Custom colors, logo, and brand integration for your AI bot",
      "price": 50,
      "category": "customization",
      "featureId": "TO_BE_FILLED",
      "priceId": "TO_BE_FILLED"
    },
    "voicebot_integration": {
      "name": "VoiceBot Integration",
      "description": "Kingdom Voice integration for voice-enabled interactions",
      "price": 75,
      "category": "integration",
      "featureId": "TO_BE_FILLED",
      "priceId": "TO_BE_FILLED"
    }
  }
}
```

## 🎯 Next Steps

1. **Create features in Stripe Dashboard** using the instructions above
2. **Update the template** with actual feature IDs
3. **Link features to bot products** in Stripe Dashboard
4. **Update checkout system** to use features instead of separate products
5. **Test the feature-based checkout flow**

## 🚨 Important Notes

### ✅ **Feature vs Product Approach**
- **Features:** Linked to products, cleaner checkout
- **Products:** Separate items, more complex checkout

### ✅ **Entitlement Management**
- Features provide automatic entitlement tracking
- Easier to check if customer has access to specific features

### ✅ **Pricing Flexibility**
- Features can have different prices per product
- More flexible than fixed add-on products

---

**🎉 Once completed, your add-ons will be much cleaner and easier to manage!** 