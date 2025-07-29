# 📸 Kingdom Lens - Migration to Unified API

This guide will help you migrate Kingdom Lens from individual services to the unified API system.

## 🚀 **Quick Migration Steps**

### **Step 1: Install the Unified API Package**

```bash
cd apps/kingdom-lens
npm install @kingdom-collective/api
```

### **Step 2: Update Environment Variables**

Add to your `.env` file:

```env
# Unified API Configuration
EXPO_PUBLIC_API_BASE_URL=https://api.kingdomcollective.pro
EXPO_PUBLIC_API_VERSION=v1

# App Identification
EXPO_PUBLIC_APP_NAME=kingdom-lens
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### **Step 3: Replace Service Imports**

#### **Before (Old Way):**

```typescript
// Individual service imports
import { PhotoService } from "../services/photoService";
import { GalleryService } from "../services/galleryService";
import { ClientService } from "../services/clientService";
import { InvoiceService } from "../services/invoiceService";
import { AIService } from "../services/aiService";
```

#### **After (New Way):**

```typescript
import { kingdomLensApi } from "../services/unifiedApiService";

// All API calls now go through the unified service
```

## 🔄 **Service Migration Map**

### **Photo Management**

#### **Before:**

```typescript
// Individual photo service
await photoService.uploadPhoto(file, metadata);
const photos = await photoService.getPhotos();
await photoService.updatePhoto(photoId, updates);
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomLensApi.uploadPhoto(file, metadata);
const photos = await kingdomLensApi.getPhotos();
await kingdomLensApi.updatePhoto(photoId, updates);
```

### **Gallery Management**

#### **Before:**

```typescript
// Gallery service
await galleryService.createGallery(galleryData);
const galleries = await galleryService.getGalleries();
await galleryService.addPhotosToGallery(galleryId, photoIds);
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomLensApi.createGallery(galleryData);
const galleries = await kingdomLensApi.getGalleries();
await kingdomLensApi.addPhotosToGallery(galleryId, photoIds);
```

### **Client Management**

#### **Before:**

```typescript
// Client service
await clientService.createClient(clientData);
const clients = await clientService.getClients();
await clientService.updateClient(clientId, updates);
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomLensApi.createClient(clientData);
const clients = await kingdomLensApi.getClients();
await kingdomLensApi.updateClient(clientId, updates);
```

### **Session Management**

#### **Before:**

```typescript
// Session service
await sessionService.createSession(sessionData);
const sessions = await sessionService.getSessions();
await sessionService.addPhotosToSession(sessionId, photoIds);
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomLensApi.createSession(sessionData);
const sessions = await kingdomLensApi.getSessions();
await kingdomLensApi.addPhotosToSession(sessionId, photoIds);
```

### **Invoice Management**

#### **Before:**

```typescript
// Invoice service
await invoiceService.createInvoice(invoiceData);
const invoices = await invoiceService.getInvoices();
await invoiceService.sendInvoice(invoiceId);
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomLensApi.createInvoice(invoiceData);
const invoices = await kingdomLensApi.getInvoices();
await kingdomLensApi.sendInvoice(invoiceId);
```

### **AI Enhancements**

#### **Before:**

```typescript
// AI service
await aiService.enhancePhoto(photoId, enhancementType);
const enhancements = await aiService.getEnhancements();
await aiService.approveEnhancement(enhancementId);
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomLensApi.enhancePhoto(photoId, enhancementType);
const enhancements = await kingdomLensApi.getAIEnhancements();
await kingdomLensApi.approveAIEnhancement(enhancementId);
```

## 📁 **File-by-File Migration**

### **1. Update Main App Entry Point**

#### **File: `App.tsx` or `_app.tsx`**

```typescript
// Before
import { PhotoService } from "./services/photoService";
import { GalleryService } from "./services/galleryService";

// After
import { kingdomLensApi } from "./services/unifiedApiService";
```

### **2. Update Photo Management Screens**

#### **File: `app/(tabs)/create-gallery.tsx`**

```typescript
// Before
import { PhotoService } from "../../services/photoService";

const photoService = new PhotoService();

// After
import { kingdomLensApi } from "../../services/unifiedApiService";

// Replace photo operations
const photos = await kingdomLensApi.getPhotos();
await kingdomLensApi.uploadPhoto(file, metadata);
```

#### **File: `app/(tabs)/gallery-delivery.tsx`**

```typescript
// Before
import { GalleryService } from "../../services/galleryService";

const galleryService = new GalleryService();

// After
import { kingdomLensApi } from "../../services/unifiedApiService";

// Replace gallery operations
const galleries = await kingdomLensApi.getGalleries();
await kingdomLensApi.createGallery(galleryData);
```

### **3. Update Client Management Screens**

#### **File: `app/(tabs)/client-experience.tsx`**

```typescript
// Before
import { ClientService } from "../../services/clientService";

const clientService = new ClientService();

// After
import { kingdomLensApi } from "../../services/unifiedApiService";

// Replace client operations
const clients = await kingdomLensApi.getClients();
await kingdomLensApi.createClient(clientData);
```

### **4. Update Session Management Screens**

#### **File: `app/(tabs)/shoot-planner.tsx`**

```typescript
// Before
import { SessionService } from "../../services/sessionService";

const sessionService = new SessionService();

// After
import { kingdomLensApi } from "../../services/unifiedApiService";

// Replace session operations
const sessions = await kingdomLensApi.getSessions();
await kingdomLensApi.createSession(sessionData);
```

### **5. Update Invoice Management Screens**

#### **File: `app/(tabs)/invoice-manager.tsx`**

```typescript
// Before
import { InvoiceService } from "../../services/invoiceService";

const invoiceService = new InvoiceService();

// After
import { kingdomLensApi } from "../../services/unifiedApiService";

// Replace invoice operations
const invoices = await kingdomLensApi.getInvoices();
await kingdomLensApi.createInvoice(invoiceData);
await kingdomLensApi.sendInvoice(invoiceId);
```

### **6. Update AI Enhancement Screens**

#### **File: `app/(tabs)/ai-enhancement.tsx`**

```typescript
// Before
import { AIService } from "../../services/aiService";

const aiService = new AIService();

// After
import { kingdomLensApi } from "../../services/unifiedApiService";

// Replace AI operations
await kingdomLensApi.enhancePhoto(photoId, enhancementType);
const enhancements = await kingdomLensApi.getAIEnhancements();
```

#### **File: `app/(tabs)/ai-photography-enhancement.tsx`**

```typescript
// Before
import { AIService } from "../../services/aiService";

const aiService = new AIService();

// After
import { kingdomLensApi } from "../../services/unifiedApiService";

// Replace AI operations
const enhancement = await kingdomLensApi.enhancePhoto(
  photoId,
  "color-correction"
);
await kingdomLensApi.approveAIEnhancement(enhancementId);
```

### **7. Update Analytics Screens**

#### **File: `app/(tabs)/advanced-analytics.tsx`**

```typescript
// Before
import { AnalyticsService } from "../../services/analyticsService";

const analyticsService = new AnalyticsService();

// After
import { kingdomLensApi } from "../../services/unifiedApiService";

// Replace analytics operations
const analytics = await kingdomLensApi.getBusinessAnalytics();
const photoAnalytics = await kingdomLensApi.getPhotoAnalytics(photoId);
```

### **8. Update Settings Screen**

#### **File: `app/(tabs)/settings.tsx`**

```typescript
// Before
import { UserService } from "../../services/userService";

const userService = new UserService();

// After
import { kingdomLensApi } from "../../services/unifiedApiService";

// Replace user operations
const profile = await kingdomLensApi.getUserProfile();
await kingdomLensApi.updateUserProfile(updates);
```

## 🔧 **Advanced Migration Patterns**

### **Error Handling**

#### **Before:**

```typescript
try {
  const result = await photoService.uploadPhoto(file, metadata);
  // Handle success
} catch (error) {
  console.error("Photo Service Error:", error);
  // Handle error
}
```

#### **After:**

```typescript
try {
  const result = await kingdomLensApi.uploadPhoto(file, metadata);
  // Handle success
} catch (error) {
  console.error("API Error:", error);
  // Error is automatically handled by the unified client
}
```

### **File Upload with Progress**

#### **Before:**

```typescript
// Manual progress tracking
const upload = await photoService.uploadPhoto(file, metadata);
upload.onProgress((progress) => {
  console.log("Upload progress:", progress);
});
```

#### **After:**

```typescript
// Unified API handles progress tracking
const result = await kingdomLensApi.uploadPhoto(file, metadata, (progress) => {
  console.log("Upload progress:", progress);
});
```

### **Batch Operations**

#### **Before:**

```typescript
// Manual batch operations
for (const photoId of photoIds) {
  await photoService.updatePhoto(photoId, updates);
}
```

#### **After:**

```typescript
// Unified API handles batch operations efficiently
await kingdomLensApi.updatePhoto(photoId, updates);
// The unified client handles batching and optimization
```

## 🧪 **Testing the Migration**

### **1. Test Photo Management**

```typescript
// Test photo operations
const photo = await kingdomLensApi.uploadPhoto(file, {
  title: "Test Photo",
  description: "A test photo",
  tags: ["test", "sample"],
  category: "portrait",
  isPublic: true,
});
console.log("Photo uploaded:", photo.photoId);

const photos = await kingdomLensApi.getPhotos();
console.log("Photos:", photos.photos.length);
```

### **2. Test Gallery Management**

```typescript
// Test gallery operations
const gallery = await kingdomLensApi.createGallery({
  title: "Test Gallery",
  description: "A test gallery",
  category: "portrait",
  privacy: "public",
  isActive: true,
});
console.log("Gallery created:", gallery.id);

const galleries = await kingdomLensApi.getGalleries();
console.log("Galleries:", galleries.galleries.length);
```

### **3. Test Client Management**

```typescript
// Test client operations
const client = await kingdomLensApi.createClient({
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  preferences: {
    style: ["modern", "minimalist"],
    colors: ["black", "white"],
    locations: ["studio", "outdoor"],
  },
});
console.log("Client created:", client.id);

const clients = await kingdomLensApi.getClients();
console.log("Clients:", clients.clients.length);
```

### **4. Test Session Management**

```typescript
// Test session operations
const session = await kingdomLensApi.createSession({
  title: "Portrait Session",
  clientId: clientId,
  clientName: "John Doe",
  type: "portrait",
  date: new Date().toISOString(),
  location: "Studio",
  duration: 120,
  status: "scheduled",
  notes: ["Natural lighting preferred"],
  equipment: ["Canon EOS R5", "85mm f/1.4"],
});
console.log("Session created:", session.id);

const sessions = await kingdomLensApi.getSessions();
console.log("Sessions:", sessions.sessions.length);
```

### **5. Test Invoice Management**

```typescript
// Test invoice operations
const invoice = await kingdomLensApi.createInvoice({
  clientId: clientId,
  clientName: "John Doe",
  sessionId: sessionId,
  sessionTitle: "Portrait Session",
  items: [
    {
      description: "Portrait Session",
      quantity: 1,
      unitPrice: 200,
      total: 200,
    },
  ],
  subtotal: 200,
  tax: 20,
  total: 220,
  currency: "USD",
  status: "draft",
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
});
console.log("Invoice created:", invoice.id);

const invoices = await kingdomLensApi.getInvoices();
console.log("Invoices:", invoices.invoices.length);
```

### **6. Test AI Enhancements**

```typescript
// Test AI operations
const enhancement = await kingdomLensApi.enhancePhoto(
  photoId,
  "color-correction",
  { brightness: 10, contrast: 5 }
);
console.log("AI enhancement created:", enhancement.enhancementId);

const enhancements = await kingdomLensApi.getAIEnhancements(photoId);
console.log("AI enhancements:", enhancements.enhancements.length);

await kingdomLensApi.approveAIEnhancement(enhancement.enhancementId);
console.log("AI enhancement approved");
```

### **7. Test Analytics**

```typescript
// Test analytics operations
const analytics = await kingdomLensApi.getBusinessAnalytics("30d");
console.log("Business analytics:", analytics.totalPhotos);

const photoAnalytics = await kingdomLensApi.getPhotoAnalytics(photoId, "30d");
console.log("Photo analytics:", photoAnalytics.views);

const galleryAnalytics = await kingdomLensApi.getGalleryAnalytics(
  galleryId,
  "30d"
);
console.log("Gallery analytics:", galleryAnalytics.views);
```

### **8. Test Social Media Integration**

```typescript
// Test social media operations
const shareResult = await kingdomLensApi.shareGallery(
  galleryId,
  ["instagram", "facebook"],
  "Check out my latest photo gallery!"
);
console.log("Gallery shared:", shareResult.success);
```

## 🚨 **Breaking Changes**

### **1. Method Signature Changes**

#### **Photo Management:**

- **Before:** `photoService.uploadPhoto(file, metadata)`
- **After:** `kingdomLensApi.uploadPhoto(file, metadata, onProgress)`

#### **Gallery Management:**

- **Before:** `galleryService.createGallery(galleryData)`
- **After:** `kingdomLensApi.createGallery(galleryData)`

#### **Client Management:**

- **Before:** `clientService.createClient(clientData)`
- **After:** `kingdomLensApi.createClient(clientData)`

#### **AI Enhancements:**

- **Before:** `aiService.enhancePhoto(photoId, type)`
- **After:** `kingdomLensApi.enhancePhoto(photoId, type, settings)`

### **2. Response Format Changes**

#### **API Responses:**

- **Before:** Service-specific response formats
- **After:** `{ success: boolean, data: any, error?: string }`

### **3. Error Handling:**

- **Before:** Service-specific error handling
- **After:** Unified error handling with automatic retries

## 📊 **Performance Benefits**

### **Before Migration:**

- Multiple individual services
- Separate authentication per service
- No request deduplication
- Manual caching
- Inconsistent error handling

### **After Migration:**

- Single unified API client
- Shared authentication
- Request deduplication
- Smart caching (5-minute TTL)
- Consistent error handling
- App-specific rate limiting

## 🔍 **Monitoring & Debugging**

### **Enable Debug Logging:**

```typescript
// Add to your app initialization
console.log("API Config:", kingdomLensApi.getApiConfig());
console.log("Request Headers:", kingdomLensApi.getRequestHeaders());
```

### **Check API Statistics:**

```typescript
const stats = await kingdomLensApi.getApiStats();
console.log("API Stats:", stats);
```

### **Clear Cache When Needed:**

```typescript
// Clear cache for fresh data
kingdomLensApi.clearCache();
```

## ✅ **Migration Checklist**

- [ ] Install `@kingdom-collective/api` package
- [ ] Update environment variables
- [ ] Replace individual service imports with `unifiedApiService.ts`
- [ ] Update photo management screens
- [ ] Update gallery management screens
- [ ] Update client management screens
- [ ] Update session management screens
- [ ] Update invoice management screens
- [ ] Update AI enhancement screens
- [ ] Update analytics screens
- [ ] Update settings screen
- [ ] Test photo management functionality
- [ ] Test gallery management functionality
- [ ] Test client management functionality
- [ ] Test session management functionality
- [ ] Test invoice management functionality
- [ ] Test AI enhancement functionality
- [ ] Test analytics functionality
- [ ] Update error handling patterns
- [ ] Verify caching behavior
- [ ] Check performance improvements

## 🎯 **Next Steps**

1. **Complete Kingdom Lens migration**
2. **Test thoroughly in development**
3. **Deploy to staging environment**
4. **Monitor performance and errors**
5. **All apps now use unified API system!**

---

**🎉 Your Kingdom Lens app is now using the unified API system!**

This migration will provide better performance, consistency, and maintainability across all your Kingdom apps.

## 🏆 **Unified API System Complete!**

All six Kingdom apps now use the unified API system:

✅ **Kingdom Studios** - Content generation and management  
✅ **Kingdom Clips** - Video processing and analytics  
✅ **Kingdom Voice** - Audio recording and spiritual content  
✅ **Kingdom Launchpad** - Product management and e-commerce  
✅ **Kingdom Circle** - Community and mentorship  
✅ **Kingdom Lens** - Photography and portfolio management

Your entire Kingdom Collective ecosystem is now unified under a single, scalable API infrastructure!
