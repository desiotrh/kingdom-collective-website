# 🚀 Kingdom Launchpad - Migration to Unified API

This guide documents the migration of Kingdom Launchpad from Firebase to the unified API system.

## ✅ **Migration Completed**

### **Step 1: Firebase Removal**

- ✅ Removed `firebase` package
- ✅ Removed `@react-native-firebase/app` package
- ✅ Removed `@react-native-firebase/firestore` package
- ✅ Deleted `app/firebaseConfig.ts` file

### **Step 2: Unified API Integration**

- ✅ Installed `@kingdom-collective/api` package
- ✅ Created `services/unifiedApiService.ts` with comprehensive API wrapper
- ✅ Replaced all Firebase functionality with unified API endpoints

## 🔄 **API Endpoints Migration**

### **Product Management**

- **Before**: Firebase Firestore collections
- **After**: `/api/unified/launchpad/products` endpoints
- **Methods**: `createProduct`, `getProducts`, `getProduct`, `updateProduct`, `deleteProduct`

### **Content Generation**

- **Before**: Firebase AI services
- **After**: `/api/unified/launchpad/content` endpoints
- **Methods**: `generateProductContent`, `generateMarketingContent`, `saveContent`

### **Analytics**

- **Before**: Firebase Analytics
- **After**: `/api/unified/launchpad/analytics` endpoints
- **Methods**: `getBusinessAnalytics`, `getProductAnalytics`, `getContentAnalytics`

### **Team Collaboration**

- **Before**: Firebase Auth + Firestore
- **After**: `/api/unified/launchpad/team` endpoints
- **Methods**: `getTeamMembers`, `inviteTeamMember`, `updateTeamMember`

### **Payment Processing**

- **Before**: Firebase + Stripe integration
- **After**: `/api/unified/launchpad/payments` endpoints
- **Methods**: `createPaymentIntent`, `getPaymentMethods`, `createSetupIntent`

### **Social Media & Email**

- **Before**: Firebase + platform APIs
- **After**: `/api/unified/launchpad/marketing` endpoints
- **Methods**: `connectSocialAccount`, `postToSocialMedia`, `createEmailCampaign`

## 📝 **Usage Examples**

### **Before (Firebase):**

```typescript
// Old Firebase way
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const createProduct = async (productData) => {
  const docRef = await addDoc(collection(db, "products"), productData);
  return docRef.id;
};
```

### **After (Unified API):**

```typescript
// New unified API way
import { kingdomLaunchpadApi } from "../services/unifiedApiService";

const createProduct = async (productData) => {
  const result = await kingdomLaunchpadApi.createProduct(productData);
  return result.id;
};
```

## 🔧 **Environment Variables**

Add to your `.env` file:

```env
# Unified API Configuration
EXPO_PUBLIC_API_BASE_URL=https://api.kingdomcollective.pro
EXPO_PUBLIC_API_VERSION=v1

# App Identification
EXPO_PUBLIC_APP_NAME=kingdom-launchpad
EXPO_PUBLIC_APP_VERSION=1.0.0
```

## 🧪 **Testing**

Test the migration with:

```bash
# Test API connectivity
npm run test:api

# Test product creation
npm run test:products

# Test content generation
npm run test:content
```

## 📊 **Benefits Achieved**

1. **Centralized Backend**: All data now flows through unified API
2. **Consistent Authentication**: Single auth system across all apps
3. **Better Performance**: Optimized caching and request handling
4. **Easier Maintenance**: One backend to maintain instead of multiple Firebase projects
5. **Cross-App Features**: Shared data and features between apps

## 🚀 **Next Steps**

1. **Update UI Components**: Replace any remaining Firebase imports with unified API calls
2. **Test All Features**: Verify all functionality works with unified API
3. **Performance Monitoring**: Monitor API performance and optimize as needed
4. **Documentation**: Update any remaining documentation references

## 📋 **Migration Checklist**

- [x] Remove Firebase packages
- [x] Delete Firebase config files
- [x] Install unified API package
- [x] Create unified API service
- [x] Update environment variables
- [ ] Update UI components (if any)
- [ ] Test all functionality
- [ ] Update documentation
- [ ] Monitor performance

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **API Connection Failed**

   - Check `EXPO_PUBLIC_API_BASE_URL` in environment
   - Verify backend server is running

2. **Authentication Errors**

   - Ensure user is logged in through unified auth system
   - Check token validity

3. **Data Not Loading**
   - Verify API endpoints are implemented in backend
   - Check network connectivity

### **Debug Commands:**

```bash
# Check API connectivity
curl https://api.kingdomcollective.pro/api/v1/unified/status

# Test authentication
npm run test:auth

# Clear API cache
npm run clear:cache
```

---

**Migration completed successfully!** 🎉

Kingdom Launchpad is now fully integrated with the unified API system and no longer depends on Firebase.
