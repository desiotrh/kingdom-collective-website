# 🎬 Kingdom Studios - Firebase Migration Tracker

This tracker lists every Firebase dependency in Kingdom Studios and maps it to the corresponding unified API endpoint.

## 📋 **Migration Overview**

**Total Firebase Dependencies**: 15+ files
**Estimated Migration Time**: 1-2 weeks
**Priority Order**: Auth → User Profiles → Products → Content → Storage → Analytics

---

## 🔐 **Phase 1: Authentication Migration**

### **Files to Migrate:**

1. `src/contexts/FirebaseAuthContext.tsx` ⭐ **HIGH PRIORITY**
2. `src/utils/authUtils.ts`
3. `src/config/firebase.ts`

### **Current Firebase Usage:**

```typescript
// Firebase Auth
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";
```

### **Unified API Replacement:**

```typescript
// Unified API Auth
import { kingdomStudiosApi } from "../services/unifiedApiService";

// Login
const result = await kingdomStudiosApi.login(email, password);

// Register
const result = await kingdomStudiosApi.register(email, password, displayName);

// Logout
await kingdomStudiosApi.logout();
```

### **Migration Steps:**

- [ ] Replace `FirebaseAuthContext` with `UnifiedAuthContext`
- [ ] Update all `useAuth()` imports
- [ ] Remove Firebase auth imports
- [ ] Test login/register/logout flows

---

## 👤 **Phase 2: User Profile Management**

### **Files to Migrate:**

1. `src/services/firebaseService.ts` (UserProfile methods)
2. `src/contexts/FirebaseAuthContext.tsx` (profile loading)
3. `src/screens/SettingsScreen.tsx`

### **Current Firebase Usage:**

```typescript
// Firebase User Profile
async createUserProfile(profile: UserProfile): Promise<void>
async getUserProfile(uid: string): Promise<UserProfile | null>
async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void>
```

### **Unified API Replacement:**

```typescript
// Unified API User Profile
const profile = await kingdomStudiosApi.getUserProfile();
await kingdomStudiosApi.updateUserProfile(updates);
```

### **Migration Steps:**

- [ ] Replace Firebase user profile methods
- [ ] Update profile loading in auth context
- [ ] Update settings screen
- [ ] Test profile CRUD operations

---

## 🛍️ **Phase 3: Product Management**

### **Files to Migrate:**

1. `src/services/firebaseService.ts` (Product methods)
2. `src/screens/products/ProductsScreen.tsx`
3. `src/contexts/ProductContext.tsx`

### **Current Firebase Usage:**

```typescript
// Firebase Products
async saveProduct(product: Product): Promise<string>
async getUserProducts(userId: string): Promise<Product[]>
```

### **Unified API Replacement:**

```typescript
// Unified API Products
const product = await kingdomStudiosApi.createProduct(productData);
const products = await kingdomStudiosApi.getProducts();
```

### **Migration Steps:**

- [ ] Replace Firebase product methods
- [ ] Update products screen
- [ ] Update product context
- [ ] Test product CRUD operations

---

## 📝 **Phase 4: Content Management**

### **Files to Migrate:**

1. `src/services/firebaseService.ts` (ContentPost methods)
2. `src/services/schedulerService.ts`
3. `src/services/socialMediaService.ts`

### **Current Firebase Usage:**

```typescript
// Firebase Content
async saveContentPost(post: ContentPost): Promise<string>
async getUserContentPosts(userId: string): Promise<ContentPost[]>
```

### **Unified API Replacement:**

```typescript
// Unified API Content
const post = await kingdomStudiosApi.saveGeneratedContent(contentData);
const posts = await kingdomStudiosApi.getContentHistory();
```

### **Migration Steps:**

- [ ] Replace Firebase content methods
- [ ] Update scheduler service
- [ ] Update social media service
- [ ] Test content CRUD operations

---

## 📁 **Phase 5: File Storage**

### **Files to Migrate:**

1. `src/services/firebaseService.ts` (Storage methods)
2. `src/screens/` (any file upload screens)

### **Current Firebase Usage:**

```typescript
// Firebase Storage
async uploadFile(uri: string, path: string): Promise<string>
async deleteFile(path: string): Promise<void>
```

### **Unified API Replacement:**

```typescript
// Unified API Storage
const result = await kingdomStudiosApi.uploadFile(file, onProgress);
await kingdomStudiosApi.deleteFile(fileId);
```

### **Migration Steps:**

- [ ] Replace Firebase storage methods
- [ ] Update file upload components
- [ ] Test file upload/download
- [ ] Verify file deletion

---

## 📊 **Phase 6: Analytics & Monitoring**

### **Files to Migrate:**

1. `src/services/PerformanceMonitoringService.ts`
2. `src/screens/` (analytics screens)

### **Current Firebase Usage:**

```typescript
// Firebase Analytics
// Send to your analytics service (Firebase, etc.)
```

### **Unified API Replacement:**

```typescript
// Unified API Analytics
await kingdomStudiosApi.trackEvent(eventName, properties);
const analytics = await kingdomStudiosApi.getAnalytics(period);
```

### **Migration Steps:**

- [ ] Replace Firebase analytics calls
- [ ] Update performance monitoring
- [ ] Test analytics tracking
- [ ] Verify analytics dashboard

---

## 🔧 **Phase 7: Configuration & Environment**

### **Files to Migrate:**

1. `src/config/firebase.ts`
2. `src/config/environment.ts`
3. `app.config.js` (Firebase config)

### **Current Firebase Usage:**

```typescript
// Firebase Config
const firebaseConfig = Environment.getFirebaseConfig();
const app = initializeApp(firebaseConfig);
```

### **Unified API Replacement:**

```typescript
// Unified API Config
const config = kingdomStudiosApi.getApiConfig();
```

### **Migration Steps:**

- [ ] Remove Firebase config files
- [ ] Update environment variables
- [ ] Remove Firebase from app.config.js
- [ ] Test configuration loading

---

## 🧹 **Phase 8: Cleanup**

### **Files to Remove:**

1. `src/config/firebase.ts`
2. `src/contexts/FirebaseAuthContext.tsx`
3. `src/services/firebaseService.ts`
4. `firebase.json`
5. `google-services.json`
6. `GoogleService-Info.plist`

### **Packages to Remove:**

```bash
npm uninstall firebase @react-native-firebase/app @react-native-firebase/analytics
```

### **Environment Variables to Remove:**

```env
# Remove these Firebase variables
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
```

---

## 📊 **Migration Progress Tracker**

### **Phase 1: Authentication**

- [ ] FirebaseAuthContext → UnifiedAuthContext
- [ ] authUtils.ts → unified API auth
- [ ] firebase.ts → unified API config
- **Status**: 🔄 **IN PROGRESS**

### **Phase 2: User Profiles**

- [ ] User profile CRUD operations
- [ ] Settings screen updates
- [ ] Profile loading in auth context
- **Status**: ⏳ **PENDING**

### **Phase 3: Product Management**

- [ ] Product CRUD operations
- [ ] Products screen updates
- [ ] Product context updates
- **Status**: ⏳ **PENDING**

### **Phase 4: Content Management**

- [ ] Content CRUD operations
- [ ] Scheduler service updates
- [ ] Social media service updates
- **Status**: ⏳ **PENDING**

### **Phase 5: File Storage**

- [ ] File upload/download operations
- [ ] File management components
- **Status**: ⏳ **PENDING**

### **Phase 6: Analytics**

- [ ] Analytics tracking
- [ ] Performance monitoring
- [ ] Analytics dashboard
- **Status**: ⏳ **PENDING**

### **Phase 7: Configuration**

- [ ] Remove Firebase config
- [ ] Update environment variables
- [ ] Update app.config.js
- **Status**: ⏳ **PENDING**

### **Phase 8: Cleanup**

- [ ] Remove Firebase files
- [ ] Remove Firebase packages
- [ ] Remove Firebase env vars
- **Status**: ⏳ **PENDING**

---

## 🎯 **Next Steps**

1. **Start with Phase 1 (Authentication)** - This is the foundation
2. **Test each phase thoroughly** before moving to the next
3. **Update all imports** when migrating each service
4. **Maintain backward compatibility** during transition
5. **Document any breaking changes**

## 🚨 **Breaking Changes to Watch For**

1. **Auth Context**: `useAuth()` return type changes
2. **User Profile**: Profile data structure changes
3. **Product Data**: Product schema changes
4. **Content Data**: Content schema changes
5. **File URLs**: Storage URL format changes

---

**Total Estimated Time**: 1-2 weeks
**Current Progress**: 0% (Kingdom Launchpad completed)
**Next Priority**: Phase 1 - Authentication Migration
