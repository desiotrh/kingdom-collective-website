# 🎬 Kingdom Clips - Migration to Unified API

This guide will help you migrate Kingdom Clips from Firebase services to the unified API system.

## 🚀 **Quick Migration Steps**

### **Step 1: Install the Unified API Package**

```bash
cd apps/kingdom-clips
npm install @kingdom-collective/api
```

### **Step 2: Update Environment Variables**

Add to your `.env` file:

```env
# Unified API Configuration
EXPO_PUBLIC_API_BASE_URL=https://api.kingdomcollective.pro
EXPO_PUBLIC_API_VERSION=v1

# App Identification
EXPO_PUBLIC_APP_NAME=kingdom-clips
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### **Step 3: Replace Firebase Service Imports**

#### **Before (Old Way):**

```typescript
import { FirestoreService } from "../services/firestoreService";

const firestoreService = new FirestoreService();
```

#### **After (New Way):**

```typescript
import { kingdomClipsApi } from "../services/unifiedApiService";

// All API calls now go through the unified service
```

## 🔄 **Service Migration Map**

### **Video Upload & Processing**

#### **Before:**

```typescript
// firestoreService.ts
const clipData = await firestoreService.saveClipToCloud(clipData);
```

#### **After:**

```typescript
// unifiedApiService.ts
const uploadResult = await kingdomClipsApi.uploadVideo(file, onProgress);
const clipData = await kingdomClipsApi.saveClip(clipData);
```

### **Clip Management**

#### **Before:**

```typescript
// firestoreService.ts
const clips = await firestoreService.getClipsFromCloud();
await firestoreService.updateClipInCloud(clipData);
await firestoreService.deleteClipFromCloud(clipId);
```

#### **After:**

```typescript
// unifiedApiService.ts
const clips = await kingdomClipsApi.getClips();
await kingdomClipsApi.updateClip(clipId, updates);
await kingdomClipsApi.deleteClip(clipId);
```

### **Analytics & Tracking**

#### **Before:**

```typescript
// firestoreService.ts
await firestoreService.updateClipStats(clipId, stats);
await firestoreService.markAsSharedTestimony(clipId, true);
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomClipsApi.updateClipStats(clipId, stats);
await kingdomClipsApi.trackVideoView(videoId);
await kingdomClipsApi.markAsSharedTestimony(clipId, true);
```

## 📁 **File-by-File Migration**

### **1. Update Main App Entry Point**

#### **File: `App.tsx` or `_app.tsx`**

```typescript
// Before
import { FirestoreService } from "./services/firestoreService";

// After
import { kingdomClipsApi } from "./services/unifiedApiService";
```

### **2. Update Video Upload Screens**

#### **File: `screens/VideoUploadScreen.tsx`**

```typescript
// Before
import { FirestoreService } from "../services/firestoreService";

const firestoreService = new FirestoreService();

// After
import { kingdomClipsApi } from "../services/unifiedApiService";

// Replace upload logic
const uploadResult = await kingdomClipsApi.uploadVideo(file, (progress) => {
  console.log("Upload progress:", progress.percentage);
});
```

### **3. Update Clip Management Screens**

#### **File: `screens/ClipsScreen.tsx`**

```typescript
// Before
import { FirestoreService } from "../services/firestoreService";

const firestoreService = new FirestoreService();
const clips = await firestoreService.getClipsFromCloud();

// After
import { kingdomClipsApi } from "../services/unifiedApiService";

const clips = await kingdomClipsApi.getClips();
```

### **4. Update Video Processing Screens**

#### **File: `screens/VideoProcessingScreen.tsx`**

```typescript
// Before
// Manual processing logic

// After
import { kingdomClipsApi } from "../services/unifiedApiService";

const processingResult = await kingdomClipsApi.processVideo(videoId, {
  trim: { start: 0, end: 30 },
  filters: ["brightness", "contrast"],
  captions: true,
  faithMode: true,
});
```

### **5. Update Analytics Screens**

#### **File: `screens/AnalyticsScreen.tsx`**

```typescript
// Before
import { FirestoreService } from "../services/firestoreService";

const firestoreService = new FirestoreService();

// After
import { kingdomClipsApi } from "../services/unifiedApiService";

const analytics = await kingdomClipsApi.getVideoAnalytics(videoId);
```

## 🔧 **Advanced Migration Patterns**

### **Error Handling**

#### **Before:**

```typescript
try {
  const result = await firestoreService.saveClipToCloud(clipData);
  // Handle success
} catch (error) {
  console.error("Firebase Error:", error);
  // Handle error
}
```

#### **After:**

```typescript
try {
  const result = await kingdomClipsApi.saveClip(clipData);
  // Handle success
} catch (error) {
  console.error("API Error:", error);
  // Error is automatically handled by the unified client
}
```

### **File Uploads**

#### **Before:**

```typescript
// Manual file upload to Firebase Storage
const storageRef = ref(storage, `clips/${clipId}`);
await uploadBytes(storageRef, file);
```

#### **After:**

```typescript
// Unified API handles upload
const uploadResult = await kingdomClipsApi.uploadVideo(file, (progress) => {
  console.log("Upload progress:", progress.percentage);
});
```

### **Real-time Updates**

#### **Before:**

```typescript
// Firebase real-time listeners
const clipsRef = collection(db, "users", userId, "clips");
const unsubscribe = onSnapshot(clipsRef, (snapshot) => {
  // Handle real-time updates
});
```

#### **After:**

```typescript
// Polling or WebSocket-based updates
const checkStatus = async () => {
  const status = await kingdomClipsApi.getProcessingStatus(videoId);
  if (status.status === "completed") {
    // Handle completion
  }
};
```

## 🧪 **Testing the Migration**

### **1. Test Video Upload**

```typescript
// Test video upload
const file = { uri: "file://path/to/video.mp4", type: "video/mp4" };
const uploadResult = await kingdomClipsApi.uploadVideo(file, (progress) => {
  console.log("Upload progress:", progress.percentage);
});
console.log("Upload successful:", uploadResult.videoId);
```

### **2. Test Video Processing**

```typescript
// Test video processing
const processingResult = await kingdomClipsApi.processVideo(videoId, {
  trim: { start: 0, end: 30 },
  filters: ["brightness", "contrast"],
  captions: true,
  faithMode: true,
});
console.log("Processing started:", processingResult.status);
```

### **3. Test Clip Management**

```typescript
// Test clip operations
const clips = await kingdomClipsApi.getClips();
console.log("Clips loaded:", clips.clips.length);

const clip = await kingdomClipsApi.getClip(clipId);
console.log("Clip details:", clip.title);
```

### **4. Test Analytics**

```typescript
// Test analytics
const analytics = await kingdomClipsApi.getVideoAnalytics(videoId);
console.log("Video analytics:", analytics);

await kingdomClipsApi.trackVideoView(videoId);
await kingdomClipsApi.trackVideoEngagement(videoId, "like");
```

### **5. Test Faith Features**

```typescript
// Test faith-based features
const hashtags = await kingdomClipsApi.getFaithHashtags("gratitude");
console.log("Faith hashtags:", hashtags);

const caption = await kingdomClipsApi.generateFaithCaption(
  "A beautiful sunset",
  "inspirational"
);
console.log("Generated caption:", caption);
```

## 🚨 **Breaking Changes**

### **1. Method Signature Changes**

#### **Video Upload:**

- **Before:** Manual Firebase Storage upload
- **After:** `uploadVideo(file, onProgress)`

#### **Clip Management:**

- **Before:** `saveClipToCloud(clipData)`
- **After:** `saveClip(clipData)`

#### **Analytics:**

- **Before:** Manual stats updates
- **After:** `updateClipStats(clipId, stats)`

### **2. Response Format Changes**

#### **API Responses:**

- **Before:** Firebase document snapshots
- **After:** `{ success: boolean, data: any, error?: string }`

### **3. Real-time Updates:**

- **Before:** Firebase real-time listeners
- **After:** Polling or WebSocket-based updates

## 📊 **Performance Benefits**

### **Before Migration:**

- Direct Firebase calls
- Manual file upload handling
- No request deduplication
- Manual caching
- Inconsistent error handling

### **After Migration:**

- Unified API client
- Automatic file upload handling
- Request deduplication
- Smart caching (5-minute TTL)
- Consistent error handling
- App-specific rate limiting

## 🔍 **Monitoring & Debugging**

### **Enable Debug Logging:**

```typescript
// Add to your app initialization
console.log("API Config:", kingdomClipsApi.getApiConfig());
console.log("Request Headers:", kingdomClipsApi.getRequestHeaders());
```

### **Check API Statistics:**

```typescript
const stats = await kingdomClipsApi.getApiStats();
console.log("API Stats:", stats);
```

### **Clear Cache When Needed:**

```typescript
// Clear cache for fresh data
kingdomClipsApi.clearCache();
```

## ✅ **Migration Checklist**

- [ ] Install `@kingdom-collective/api` package
- [ ] Update environment variables
- [ ] Replace `firestoreService.ts` imports with `unifiedApiService.ts`
- [ ] Update video upload screens
- [ ] Update clip management screens
- [ ] Update video processing screens
- [ ] Update analytics screens
- [ ] Test video upload functionality
- [ ] Test video processing functionality
- [ ] Test clip management functionality
- [ ] Test analytics functionality
- [ ] Test faith-based features
- [ ] Update error handling patterns
- [ ] Test file uploads
- [ ] Verify caching behavior
- [ ] Check performance improvements

## 🎯 **Next Steps**

1. **Complete Kingdom Clips migration**
2. **Test thoroughly in development**
3. **Deploy to staging environment**
4. **Monitor performance and errors**
5. **Move to next app (Kingdom Voice)**

---

**🎉 Your Kingdom Clips app is now using the unified API system!**

This migration will provide better performance, consistency, and maintainability across all your Kingdom apps.
