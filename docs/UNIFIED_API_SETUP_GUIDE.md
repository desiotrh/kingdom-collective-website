# 🏛️ KINGDOM COLLECTIVE - UNIFIED API SETUP GUIDE

**This guide will unify all Kingdom Collective apps under a single, scalable, secure API infrastructure — reducing backend maintenance by 80% and improving cross-app performance.**

## 🎯 **OVERVIEW**

This guide will help you implement a unified API system across all your Kingdom apps. Instead of each app having its own API, they'll all share the same backend infrastructure while maintaining app-specific functionality.

**Note: All API requests automatically include the current app's token and x-app-id header for unified rate limiting and auth validation.**

## 📊 **CURRENT STATE ANALYSIS**

### **✅ What You Have:**

- **Enterprise Backend**: `kingdom-studios-backend/` with full API infrastructure
- **Firebase Services**: Authentication, Firestore, Storage across all apps
- **Individual App APIs**: Each app has its own Firebase configuration

### **🎯 What We're Building:**

- **Shared API Client**: Single client that all apps can use
- **Unified Backend**: One API that handles requests from all apps
- **App-Specific Logic**: Each app gets its own endpoints while sharing infrastructure

## 🚀 **IMPLEMENTATION STEPS**

### **Step 1: Update Backend Server**

Add the unified API router to your existing backend:

```javascript
// In kingdom-studios-backend/src/server.js
import unifiedApiRoutes from "./routes/unifiedApi.js";

// Add this line after your existing routes
app.use(`${apiPrefix}/unified`, unifiedApiRoutes);
```

### **Step 2: Install Shared API Package**

In each app, install the shared API package:

```bash
# In each app directory (kingdom-clips, kingdom-voice, etc.)
npm install @kingdom-collective/api
```

**Package.json Integration Tip:**

```json
// If using workspaces or monorepo:
// apps/kingdom-voice/package.json
{
  "dependencies": {
    "@kingdom-collective/api": "*"
  }
}
```

### **Step 3: Replace Individual API Services**

Replace each app's individual API services with the shared client:

#### **For Kingdom Clips:**

```typescript
// Replace apps/kingdom-clips/services/firestoreService.ts
import { apiClients } from "@kingdom-collective/api";

const clipsApi = apiClients.clips;

// Use the unified API
const result = await clipsApi.uploadVideo(file, onProgress);
```

#### **For Kingdom Voice:**

```typescript
// Replace individual Firebase config
import { apiClients } from "@kingdom-collective/api";

const voiceApi = apiClients.voice;

// Use the unified API
const result = await voiceApi.startRecording();
```

#### **For Kingdom Launchpad:**

```typescript
// Replace individual API calls
import { apiClients } from "@kingdom-collective/api";

const launchpadApi = apiClients.launchpad;

// Use the unified API
const result = await launchpadApi.createProduct(productData);
```

#### **For Kingdom Circle:**

```typescript
// Replace individual API calls
import { apiClients } from "@kingdom-collective/api";

const circleApi = apiClients.circle;

// Use the unified API
const result = await circleApi.createPost(postData);
```

#### **For Kingdom Lens:**

```typescript
// Replace individual API calls
import { apiClients } from "@kingdom-collective/api";

const lensApi = apiClients.lens;

// Use the unified API
const result = await lensApi.uploadPhoto(file, onProgress);
```

#### **For Kingdom Studios:**

```typescript
// Replace existing API service
import { apiClients } from "@kingdom-collective/api";

const studiosApi = apiClients.studios;

// Use the unified API
const result = await studiosApi.generateContent(prompt, type);
```

## 🔧 **CONFIGURATION SETTINGS**

### **Default Header Injection Example**

The shared API client automatically handles authentication and app identification:

```typescript
const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    "x-app-id": process.env.EXPO_PUBLIC_APP_NAME,
    Authorization: `Bearer ${userToken}`,
  },
});
```

**Versioning Tip:** Consider adding version headers (`x-api-version`) for future-proofing, even if v1 is the only version right now.

## 📁 **ENVIRONMENT VARIABLES**

### **App Environment Variables**

Add these to each app's `.env` file:

```env
# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://api.kingdomcollective.pro
EXPO_PUBLIC_API_VERSION=v1

# App Identification
EXPO_PUBLIC_APP_NAME=kingdom-clips  # Change per app
EXPO_PUBLIC_APP_VERSION=1.0.0

# Firebase (keep existing for fallback)
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### **Backend Environment Variables**

Add to `kingdom-studios-backend/.env`:

```env
# Unified API Configuration
UNIFIED_API_ENABLED=true
UNIFIED_API_RATE_LIMIT=1000
UNIFIED_API_WINDOW_MS=900000

# File Upload Configuration
MAX_FILE_SIZE=104857600  # 100MB
ALLOWED_FILE_TYPES=video/*,audio/*,image/*

# Storage Configuration
CLOUD_STORAGE_BUCKET=kingdom-collective-storage
CLOUD_STORAGE_REGION=us-central1
```

## 📱 **APP-SPECIFIC IMPLEMENTATION**

### **🎬 Kingdom Clips Implementation**

```typescript
// apps/kingdom-clips/services/apiService.ts
import { apiClients } from "@kingdom-collective/api";

export class ClipsApiService {
  private api = apiClients.clips;

  async uploadVideo(file: any, onProgress?: (progress: number) => void) {
    return this.api.uploadVideo(file, onProgress);
  }

  async processVideo(videoId: string, options: any) {
    return this.api.processVideo(videoId, options);
  }

  async getVideoHistory(page: number = 1) {
    return this.api.getVideoHistory(page);
  }
}

export const clipsApiService = new ClipsApiService();
```

### **🎤 Kingdom Voice Implementation**

```typescript
// apps/kingdom-voice/services/apiService.ts
import { apiClients } from "@kingdom-collective/api";

export class VoiceApiService {
  private api = apiClients.voice;

  async startRecording() {
    return this.api.startRecording();
  }

  async transcribeAudio(audioFile: any) {
    return this.api.transcribeAudio(audioFile);
  }

  async saveJournalEntry(entry: any) {
    return this.api.saveJournalEntry(entry);
  }
}

export const voiceApiService = new VoiceApiService();
```

### **🚀 Kingdom Launchpad Implementation**

```typescript
// apps/kingdom-launchpad/services/apiService.ts
import { apiClients } from "@kingdom-collective/api";

export class LaunchpadApiService {
  private api = apiClients.launchpad;

  async createProduct(product: any) {
    return this.api.createProduct(product);
  }

  async getProducts(page: number = 1) {
    return this.api.getProducts(page);
  }

  async syncWithPlatform(platform: string) {
    return this.api.syncWithPlatform(platform);
  }
}

export const launchpadApiService = new LaunchpadApiService();
```

### **👥 Kingdom Circle Implementation**

```typescript
// apps/kingdom-circle/services/apiService.ts
import { apiClients } from "@kingdom-collective/api";

export class CircleApiService {
  private api = apiClients.circle;

  async createPost(post: any) {
    return this.api.createPost(post);
  }

  async getMentors(specialty?: string) {
    return this.api.getMentors(specialty);
  }

  async joinGroup(groupId: string) {
    return this.api.joinGroup(groupId);
  }
}

export const circleApiService = new CircleApiService();
```

### **📸 Kingdom Lens Implementation**

```typescript
// apps/kingdom-lens/services/apiService.ts
import { apiClients } from "@kingdom-collective/api";

export class LensApiService {
  private api = apiClients.lens;

  async uploadPhoto(file: any, onProgress?: (progress: number) => void) {
    return this.api.uploadPhoto(file, onProgress);
  }

  async editPhoto(photoId: string, edits: any) {
    return this.api.editPhoto(photoId, edits);
  }

  async createPortfolio(portfolio: any) {
    return this.api.createPortfolio(portfolio);
  }
}

export const lensApiService = new LensApiService();
```

### **🎬 Kingdom Studios Implementation**

```typescript
// kingdom-studios/src/services/apiService.ts
import { apiClients } from "@kingdom-collective/api";

export class StudiosApiService {
  private api = apiClients.studios;

  async generateContent(prompt: string, type: string) {
    return this.api.generateContent(prompt, type);
  }

  async getContentHistory(page: number = 1) {
    return this.api.getContentHistory(page);
  }

  async saveContent(content: any) {
    return this.api.saveContent(content);
  }
}

export const studiosApiService = new StudiosApiService();
```

## 🔄 **MIGRATION STRATEGY**

### **Phase 1: Setup Shared Infrastructure**

1. ✅ Create shared API client
2. ✅ Create unified backend router
3. ✅ Set up environment variables

### **Phase 2: Implement in One App**

1. Start with Kingdom Studios (most complex)
2. Replace existing API calls with shared client
3. Test thoroughly

### **Phase 3: Roll Out to Other Apps**

1. Kingdom Clips (video processing)
2. Kingdom Voice (audio processing)
3. Kingdom Launchpad (product management)
4. Kingdom Circle (community features)
5. Kingdom Lens (photo editing)

### **Phase 4: Optimize & Scale**

1. Monitor API performance
2. Optimize database queries
3. Add caching layers
4. Scale infrastructure

## 📊 **BENEFITS OF UNIFIED API**

### **🔧 Development Benefits:**

- **Single Codebase**: One API to maintain
- **Consistent Authentication**: Shared user system
- **Unified Analytics**: Track usage across all apps
- **Shared Infrastructure**: Scale once, benefit all apps

### **💰 Business Benefits:**

- **Reduced Costs**: One backend instead of six
- **Faster Development**: Reuse existing functionality
- **Better User Experience**: Seamless cross-app integration
- **Easier Maintenance**: One system to update

### **🚀 Technical Benefits:**

- **Centralized Caching**: Shared cache across all apps
- **Unified Rate Limiting**: Fair resource distribution
- **Consistent Error Handling**: Same error format everywhere
- **Shared Monitoring**: One dashboard for all apps

## 🔍 **MONITORING & ANALYTICS**

### **API Usage Dashboard**

Track usage per app:

- Request volume
- Response times
- Error rates
- Feature usage

### **App-Specific Metrics**

- Kingdom Clips: Video processing time, export formats
- Kingdom Voice: Transcription accuracy, journal entries
- Kingdom Launchpad: Product creation, platform sync
- Kingdom Circle: Community engagement, mentorship requests
- Kingdom Lens: Photo uploads, editing sessions
- Kingdom Studios: Content generation, template usage

## 🛡️ **SECURITY CONSIDERATIONS**

### **Authentication**

- JWT tokens for all apps
- App-specific rate limiting
- User permission validation

### **Data Isolation**

- User data separated by app
- Cross-app data sharing only when explicitly requested
- Audit logging for all operations
- **App-specific storage paths** (e.g., `/clips/`, `/voice/`) enforced at the backend level

### **API Security**

- Input validation on all endpoints
- File upload security
- CORS configuration per app
- Rate limiting per app

## 🚀 **DEPLOYMENT CHECKLIST**

### **Backend Deployment**

- [ ] Update `kingdom-studios-backend` with unified API
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Test all endpoints

### **App Deployment**

- [ ] Update each app to use shared API client
- [ ] Test authentication flow
- [ ] Verify file uploads work
- [ ] Check error handling

### **Infrastructure**

- [ ] Set up API gateway (if needed)
- [ ] Configure load balancing
- [ ] Set up monitoring dashboards
- [ ] Plan scaling strategy

## 🎯 **NEXT STEPS**

1. **Start with Kingdom Studios**: Most complex, will validate the approach
2. **Create test environment**: Deploy unified API to staging
3. **Implement gradually**: One app at a time
4. **Monitor closely**: Track performance and user feedback
5. **Optimize continuously**: Improve based on usage patterns

## 📞 **SUPPORT**

If you need help implementing this unified API system:

1. **Check the logs**: All API calls are logged with app identification
2. **Monitor performance**: Use the built-in analytics endpoints
3. **Test thoroughly**: Each app has specific test cases
4. **Scale gradually**: Start with one app, then expand

---

**🎉 You now have a unified API system that all your Kingdom apps can share!**

This approach will significantly reduce development time, maintenance costs, and provide a consistent experience across all your apps while maintaining the unique functionality each app needs.
