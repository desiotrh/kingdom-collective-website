# 🎬 Kingdom Studios - Migration to Unified API

This guide will help you migrate Kingdom Studios from individual API services to the unified API system.

## 🚀 **Quick Migration Steps**

### **Step 1: Install the Unified API Package**

```bash
cd kingdom-studios
npm install @kingdom-collective/api
```

### **Step 2: Update Environment Variables**

Add to your `.env` file:

```env
# Unified API Configuration
EXPO_PUBLIC_API_BASE_URL=https://api.kingdomcollective.pro
EXPO_PUBLIC_API_VERSION=v1

# App Identification
EXPO_PUBLIC_APP_NAME=kingdom-studios
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### **Step 3: Replace API Service Imports**

#### **Before (Old Way):**

```typescript
import { APIService } from "../services/apiService";
import { EnhancedAIService } from "../services/aiService";
import { databaseService } from "../services/databaseService";

const apiService = APIService.getInstance();
const aiService = EnhancedAIService.getInstance();
```

#### **After (New Way):**

```typescript
import { kingdomStudiosApi } from "../services/unifiedApiService";

// All API calls now go through the unified service
```

## 🔄 **Service Migration Map**

### **Authentication & User Management**

#### **Before:**

```typescript
// apiService.ts
const result = await apiService.login(email, password);
const user = await apiService.getCurrentUser();
await apiService.updateProfile(updates);
```

#### **After:**

```typescript
// unifiedApiService.ts
const result = await kingdomStudiosApi.login(email, password);
const user = await kingdomStudiosApi.getCurrentUser();
await kingdomStudiosApi.updateProfile(updates);
```

### **Content Generation**

#### **Before:**

```typescript
// aiService.ts
const result = await aiService.generateContent(
  userId,
  "social_post",
  prompt,
  options
);
```

#### **After:**

```typescript
// unifiedApiService.ts
const result = await kingdomStudiosApi.generateContent(
  prompt,
  "social",
  options
);
```

### **Subscription & Billing**

#### **Before:**

```typescript
// apiService.ts
const subscription = await apiService.getSubscription();
await apiService.createSubscription(tier, billingCycle);
```

#### **After:**

```typescript
// unifiedApiService.ts
const subscription = await kingdomStudiosApi.getSubscription();
await kingdomStudiosApi.createSubscription(tier, billingCycle);
```

### **Analytics & Tracking**

#### **Before:**

```typescript
// analyticsService.ts
const analytics = await analyticsService.getAnalytics(timeframe);
await analyticsService.trackEvent(event, properties);
```

#### **After:**

```typescript
// unifiedApiService.ts
const analytics = await kingdomStudiosApi.getAnalytics(timeframe);
await kingdomStudiosApi.trackEvent(event, properties);
```

## 📁 **File-by-File Migration**

### **1. Update Main App Entry Point**

#### **File: `App.tsx` or `_app.tsx`**

```typescript
// Before
import { APIService } from "./services/apiService";

// After
import { kingdomStudiosApi } from "./services/unifiedApiService";
```

### **2. Update Authentication Context**

#### **File: `contexts/AuthContext.tsx`**

```typescript
// Before
import { APIService } from "../services/apiService";

const apiService = APIService.getInstance();

// After
import { kingdomStudiosApi } from "../services/unifiedApiService";

// Replace all apiService calls with kingdomStudiosApi
```

### **3. Update Content Generation Screens**

#### **File: `screens/ContentGenerationScreen.tsx`**

```typescript
// Before
import { EnhancedAIService } from "../services/aiService";

const aiService = EnhancedAIService.getInstance();

// After
import { kingdomStudiosApi } from "../services/unifiedApiService";

// Replace aiService.generateContent with kingdomStudiosApi.generateContent
```

### **4. Update Subscription Management**

#### **File: `screens/SubscriptionScreen.tsx`**

```typescript
// Before
import { APIService } from "../services/apiService";

const apiService = APIService.getInstance();

// After
import { kingdomStudiosApi } from "../services/unifiedApiService";

// Replace all subscription-related calls
```

### **5. Update Analytics Dashboard**

#### **File: `screens/AnalyticsScreen.tsx`**

```typescript
// Before
import { AnalyticsService } from "../services/AnalyticsService";

const analyticsService = new AnalyticsService();

// After
import { kingdomStudiosApi } from "../services/unifiedApiService";

// Replace analytics calls with unified API
```

## 🔧 **Advanced Migration Patterns**

### **Error Handling**

#### **Before:**

```typescript
try {
  const result = await apiService.generateContent(prompt, type);
  if (result.success) {
    // Handle success
  } else {
    // Handle error
  }
} catch (error) {
  console.error("API Error:", error);
}
```

#### **After:**

```typescript
try {
  const result = await kingdomStudiosApi.generateContent(prompt, type);
  // Handle success
} catch (error) {
  console.error("API Error:", error);
  // Error is automatically handled by the unified client
}
```

### **File Uploads**

#### **Before:**

```typescript
// fileStorageService.ts
const result = await fileStorageService.uploadFile(file, onProgress);
```

#### **After:**

```typescript
// unifiedApiService.ts
const result = await kingdomStudiosApi.uploadFile(file, onProgress);
```

### **Caching**

#### **Before:**

```typescript
// cacheManager.ts
await cacheManager.set(key, data);
const data = await cacheManager.get(key);
```

#### **After:**

```typescript
// unifiedApiService.ts
// Caching is automatic with the unified client
// Clear cache when needed:
kingdomStudiosApi.clearCache();
```

## 🧪 **Testing the Migration**

### **1. Test Authentication**

```typescript
// Test login
const loginResult = await kingdomStudiosApi.login(email, password);
console.log("Login successful:", loginResult.user);

// Test user profile
const user = await kingdomStudiosApi.getCurrentUser();
console.log("User profile:", user);
```

### **2. Test Content Generation**

```typescript
// Test content generation
const result = await kingdomStudiosApi.generateContent(
  "Write a social media post about gratitude",
  "social",
  { tone: "inspirational", faithMode: true }
);
console.log("Generated content:", result.content);
```

### **3. Test File Upload**

```typescript
// Test file upload
const file = { uri: "file://path/to/file.jpg", type: "image/jpeg" };
const uploadResult = await kingdomStudiosApi.uploadFile(file, (progress) => {
  console.log("Upload progress:", progress);
});
console.log("Upload successful:", uploadResult.url);
```

### **4. Test Analytics**

```typescript
// Test analytics
const analytics = await kingdomStudiosApi.getAnalytics("30d");
console.log("Analytics data:", analytics);

// Test event tracking
await kingdomStudiosApi.trackEvent("content_generated", {
  type: "social_post",
  length: "short",
});
```

## 🚨 **Breaking Changes**

### **1. Method Signature Changes**

#### **Content Generation:**

- **Before:** `generateContent(userId, type, prompt, options)`
- **After:** `generateContent(prompt, type, options)`

#### **File Upload:**

- **Before:** `uploadFile(file, path, options)`
- **After:** `uploadFile(file, onProgress)`

### **2. Response Format Changes**

#### **API Responses:**

- **Before:** `{ success: boolean, data: any, error?: string }`
- **After:** `{ success: boolean, data: any, error?: string, statusCode: number }`

### **3. Error Handling:**

- **Before:** Check `response.success` and `response.error`
- **After:** Use try-catch blocks, errors are thrown automatically

## 📊 **Performance Benefits**

### **Before Migration:**

- Multiple API clients
- Separate authentication per service
- No request deduplication
- Manual caching
- Inconsistent error handling

### **After Migration:**

- Single unified API client
- Shared authentication
- Automatic request deduplication
- Smart caching (5-minute TTL)
- Consistent error handling
- App-specific rate limiting

## 🔍 **Monitoring & Debugging**

### **Enable Debug Logging:**

```typescript
// Add to your app initialization
console.log("API Config:", kingdomStudiosApi.getApiConfig());
console.log("Request Headers:", kingdomStudiosApi.getRequestHeaders());
```

### **Check API Statistics:**

```typescript
const stats = await kingdomStudiosApi.getApiStats();
console.log("API Stats:", stats);
```

### **Clear Cache When Needed:**

```typescript
// Clear cache for fresh data
kingdomStudiosApi.clearCache();
```

## ✅ **Migration Checklist**

- [ ] Install `@kingdom-collective/api` package
- [ ] Update environment variables
- [ ] Replace `apiService.ts` imports with `unifiedApiService.ts`
- [ ] Replace `aiService.ts` imports with unified API
- [ ] Update authentication context
- [ ] Update content generation screens
- [ ] Update subscription management
- [ ] Update analytics dashboard
- [ ] Test all major functionality
- [ ] Update error handling patterns
- [ ] Test file uploads
- [ ] Verify caching behavior
- [ ] Check performance improvements

## 🎯 **Next Steps**

1. **Complete Kingdom Studios migration**
2. **Test thoroughly in development**
3. **Deploy to staging environment**
4. **Monitor performance and errors**
5. **Move to next app (Kingdom Clips)**

---

**🎉 Your Kingdom Studios app is now using the unified API system!**

This migration will provide better performance, consistency, and maintainability across all your Kingdom apps.
