# 🏛️ Kingdom Collective - Unified API Package

A unified API client for all Kingdom Collective apps that provides consistent authentication, caching, and error handling across all applications.

## 🚀 Quick Start

```bash
npm install @kingdom-collective/api
```

```typescript
import { apiClients } from '@kingdom-collective/api';

// Use app-specific client
const clipsApi = apiClients.clips;
const result = await clipsApi.uploadVideo(file, onProgress);
```

## 📦 Features

- **🔐 Unified Authentication**: Single JWT token system across all apps
- **💾 Smart Caching**: Automatic request caching with configurable TTL
- **🔄 Request Queuing**: Prevents duplicate requests
- **📱 App Identification**: Automatic app-specific headers and rate limiting
- **🛡️ Error Handling**: Consistent error responses and retry logic
- **📊 Analytics**: Built-in request tracking and monitoring

## 🎯 App-Specific Clients

### 🎬 Kingdom Clips
```typescript
import { apiClients } from '@kingdom-collective/api';

const clipsApi = apiClients.clips;

// Upload video
await clipsApi.uploadVideo(file, onProgress);

// Process video
await clipsApi.processVideo(videoId, {
  trim: { start: 0, end: 30 },
  filters: ['brightness', 'contrast'],
  captions: true
});

// Get video history
await clipsApi.getVideoHistory(page, limit);
```

### 🎤 Kingdom Voice
```typescript
import { apiClients } from '@kingdom-collective/api';

const voiceApi = apiClients.voice;

// Start recording
await voiceApi.startRecording();

// Transcribe audio
await voiceApi.transcribeAudio(audioFile, 'en');

// Save journal entry
await voiceApi.saveJournalEntry({
  title: 'My Journal Entry',
  content: 'Today was amazing...',
  mood: 'happy',
  tags: ['gratitude', 'blessing']
});
```

### 🚀 Kingdom Launchpad
```typescript
import { apiClients } from '@kingdom-collective/api';

const launchpadApi = apiClients.launchpad;

// Create product
await launchpadApi.createProduct({
  name: 'Faith-Based T-Shirt',
  description: 'Inspiring design...',
  price: 29.99,
  category: 'clothing',
  platform: 'etsy'
});

// Sync with platform
await launchpadApi.syncWithPlatform('etsy');
```

### 👥 Kingdom Circle
```typescript
import { apiClients } from '@kingdom-collective/api';

const circleApi = apiClients.circle;

// Create community post
await circleApi.createPost({
  title: 'Sharing My Testimony',
  content: 'God has been so good...',
  category: 'testimony',
  tags: ['blessing', 'gratitude']
});

// Get mentors
await circleApi.getMentors('business');
```

### 📸 Kingdom Lens
```typescript
import { apiClients } from '@kingdom-collective/api';

const lensApi = apiClients.lens;

// Upload photo
await lensApi.uploadPhoto(file, onProgress);

// Edit photo
await lensApi.editPhoto(photoId, {
  brightness: 1.2,
  contrast: 1.1,
  filters: ['vintage', 'warm']
});

// Create portfolio
await lensApi.createPortfolio({
  name: 'My Photography Portfolio',
  description: 'Faith-inspired photography',
  isPublic: true,
  category: 'nature'
});
```

### 🎬 Kingdom Studios
```typescript
import { apiClients } from '@kingdom-collective/api';

const studiosApi = apiClients.studios;

// Generate content
await studiosApi.generateContent(
  'Write a social media post about gratitude',
  'social-media-post',
  { tone: 'inspirational', platform: 'instagram' }
);

// Get content history
await studiosApi.getContentHistory(page, limit);

// Save content
await studiosApi.saveContent({
  title: 'Gratitude Post',
  content: 'Today I'm grateful for...',
  type: 'social-media-post',
  tags: ['gratitude', 'blessing']
});
```

## ⚙️ Configuration

### Environment Variables

Add these to your app's `.env` file:

```env
# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://api.kingdomcollective.pro
EXPO_PUBLIC_API_VERSION=v1

# App Identification
EXPO_PUBLIC_APP_NAME=kingdom-clips  # Change per app
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Custom Client Setup

```typescript
import { SharedApiClient } from '@kingdom-collective/api';

class CustomApiClient extends SharedApiClient {
  protected getAppName(): string {
    return 'my-custom-app';
  }

  protected getAppVersion(): string {
    return '2.0.0';
  }
}

const customApi = new CustomApiClient();
```

## 🔧 Advanced Usage

### Caching Control

```typescript
// Disable caching for sensitive data
const result = await apiClient.get('/sensitive-data', {}, false);

// Clear cache
apiClient.clearCache();
```

### Error Handling

```typescript
try {
  const result = await clipsApi.uploadVideo(file);
  if (result.success) {
    console.log('Upload successful:', result.data);
  } else {
    console.error('Upload failed:', result.error);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### Request Headers

The client automatically includes these headers:

```typescript
{
  'x-app-id': 'kingdom-clips',
  'x-app-version': '1.0.0',
  'x-api-version': 'v1',
  'Authorization': 'Bearer your-jwt-token'
}
```

## 📊 Monitoring

### Cache Statistics

```typescript
const stats = apiClient.getCacheStats();
console.log('Cache size:', stats.size);
console.log('Cached keys:', stats.keys);
```

### Request Headers

```typescript
const headers = apiClient.getRequestHeaders();
console.log('Current headers:', headers);
```

## 🛡️ Security

- **App-specific rate limiting**: 1000 requests per 15 minutes per app
- **Automatic token refresh**: Handles expired JWT tokens
- **Request validation**: Input validation on all endpoints
- **App identification**: Each request is tagged with app info

## 🔄 Migration Guide

### From Individual APIs

Replace your existing API calls:

```typescript
// Before
import { firebaseService } from './firebaseService';
await firebaseService.uploadVideo(file);

// After
import { apiClients } from '@kingdom-collective/api';
await apiClients.clips.uploadVideo(file);
```

### From Firebase Direct

```typescript
// Before
import { db } from './firebase';
await addDoc(collection(db, 'videos'), videoData);

// After
import { apiClients } from '@kingdom-collective/api';
await apiClients.clips.uploadVideo(file);
```

## 📈 Performance

- **Request deduplication**: Prevents duplicate API calls
- **Smart caching**: 5-minute cache for GET requests
- **Connection pooling**: Reuses HTTP connections
- **Automatic retries**: Handles network failures

## 🐛 Troubleshooting

### Common Issues

1. **Authentication errors**: Check your JWT token
2. **Rate limiting**: Reduce request frequency
3. **Network errors**: Check internet connection
4. **File upload failures**: Verify file size limits

### Debug Mode

```typescript
// Enable debug logging
console.log('API Config:', apiClient.getApiConfig());
console.log('Request Headers:', apiClient.getRequestHeaders());
```

## 📚 API Reference

### SharedApiClient

- `get(endpoint, params?, useCache?)`: GET request
- `post(endpoint, data?)`: POST request
- `put(endpoint, data?)`: PUT request
- `delete(endpoint)`: DELETE request
- `uploadFile(endpoint, file, onProgress?)`: File upload
- `clearCache()`: Clear all cached data
- `clearQueue()`: Clear request queue

### App-Specific Clients

Each app has its own client with specialized methods:

- **KingdomClipsApiClient**: Video processing methods
- **KingdomVoiceApiClient**: Audio and journaling methods
- **KingdomLaunchpadApiClient**: Product management methods
- **KingdomCircleApiClient**: Community features methods
- **KingdomLensApiClient**: Photo editing methods
- **KingdomStudiosApiClient**: Content generation methods

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**🎉 Ready to unify your Kingdom apps with a single, powerful API client!** 