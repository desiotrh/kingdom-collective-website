# 🎤 Kingdom Voice - Migration to Unified API

This guide will help you migrate Kingdom Voice from individual services to the unified API system.

## 🚀 **Quick Migration Steps**

### **Step 1: Install the Unified API Package**

```bash
cd apps/kingdom-voice
npm install @kingdom-collective/api
```

### **Step 2: Update Environment Variables**

Add to your `.env` file:

```env
# Unified API Configuration
EXPO_PUBLIC_API_BASE_URL=https://api.kingdomcollective.pro
EXPO_PUBLIC_API_VERSION=v1

# App Identification
EXPO_PUBLIC_APP_NAME=kingdom-voice
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### **Step 3: Replace Service Imports**

#### **Before (Old Way):**

```typescript
// Individual service imports
import { AudioService } from "../services/audioService";
import { JournalService } from "../services/journalService";
import { DevotionalService } from "../services/devotionalService";
```

#### **After (New Way):**

```typescript
import { kingdomVoiceApi } from "../services/unifiedApiService";

// All API calls now go through the unified service
```

## 🔄 **Service Migration Map**

### **Audio Recording & Transcription**

#### **Before:**

```typescript
// Manual audio recording
const recording = await audioService.startRecording();
const audioFile = await audioService.stopRecording();
const transcript = await audioService.transcribe(audioFile);
```

#### **After:**

```typescript
// unifiedApiService.ts
const recording = await kingdomVoiceApi.startRecording();
const audioFile = await kingdomVoiceApi.stopRecording(recording.recordingId);
const transcript = await kingdomVoiceApi.transcribeAudio(audioFile);
```

### **Journal Entries**

#### **Before:**

```typescript
// Individual journal service
await journalService.saveEntry(entry);
const entries = await journalService.getEntries();
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomVoiceApi.saveJournalEntry(entry);
const entries = await kingdomVoiceApi.getJournalEntries();
```

### **Devotional Generation**

#### **Before:**

```typescript
// Devotional service
const devotional = await devotionalService.generate(topic, scripture);
```

#### **After:**

```typescript
// unifiedApiService.ts
const devotional = await kingdomVoiceApi.generateDevotional(topic, scripture);
```

### **Dream Tracking**

#### **Before:**

```typescript
// Dream service
await dreamService.saveDream(dreamEntry);
const interpretation = await dreamService.interpret(dreamDescription);
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomVoiceApi.saveDreamEntry(dreamEntry);
const interpretation = await kingdomVoiceApi.interpretDream(
  dreamDescription,
  dreamType,
  emotions
);
```

### **Book Planning**

#### **Before:**

```typescript
// Book planner service
await bookPlannerService.saveEntry(entry);
const outline = await bookPlannerService.generateOutline(bookTitle, genre);
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomVoiceApi.saveBookPlannerEntry(entry);
const outline = await kingdomVoiceApi.generateBookOutline(
  bookTitle,
  genre,
  targetAudience,
  keyThemes
);
```

### **Podcast & Video Features**

#### **Before:**

```typescript
// Podcast service
await podcastService.saveEpisode(episode);
const episodes = await podcastService.getEpisodes();
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomVoiceApi.savePodcastEpisode(episode);
const episodes = await kingdomVoiceApi.getPodcastEpisodes();
```

## 📁 **File-by-File Migration**

### **1. Update Main App Entry Point**

#### **File: `App.tsx` or `_app.tsx`**

```typescript
// Before
import { AudioService } from "./services/audioService";
import { JournalService } from "./services/journalService";

// After
import { kingdomVoiceApi } from "./services/unifiedApiService";
```

### **2. Update Audio Recording Screens**

#### **File: `app/(tabs)/podcast-recording.tsx`**

```typescript
// Before
import { AudioService } from "../../services/audioService";

const audioService = new AudioService();

// After
import { kingdomVoiceApi } from "../../services/unifiedApiService";

// Replace recording logic
const recording = await kingdomVoiceApi.startRecording();
```

#### **File: `app/(tabs)/video-podcasting.tsx`**

```typescript
// Before
// Manual video recording logic

// After
import { kingdomVoiceApi } from "../../services/unifiedApiService";

// Use unified API for video recording
const recording = await kingdomVoiceApi.startRecording();
```

### **3. Update Journal Entry Screens**

#### **File: `app/(tabs)/new-entry.tsx`**

```typescript
// Before
import { JournalService } from "../../services/journalService";

const journalService = new JournalService();

// After
import { kingdomVoiceApi } from "../../services/unifiedApiService";

// Replace journal operations
await kingdomVoiceApi.saveJournalEntry(entry);
```

#### **File: `app/(tabs)/saved-entries.tsx`**

```typescript
// Before
import { JournalService } from "../../services/journalService";

const journalService = new JournalService();
const entries = await journalService.getEntries();

// After
import { kingdomVoiceApi } from "../../services/unifiedApiService";

const entries = await kingdomVoiceApi.getJournalEntries();
```

### **4. Update Devotional Screens**

#### **File: `app/(tabs)/devotional-generator.tsx`**

```typescript
// Before
import { DevotionalService } from "../../services/devotionalService";

const devotionalService = new DevotionalService();

// After
import { kingdomVoiceApi } from "../../services/unifiedApiService";

const devotional = await kingdomVoiceApi.generateDevotional(topic, scripture);
```

#### **File: `app/(tabs)/devotional-export.tsx`**

```typescript
// Before
import { DevotionalService } from "../../services/devotionalService";

const devotionalService = new DevotionalService();

// After
import { kingdomVoiceApi } from "../../services/unifiedApiService";

const exportResult = await kingdomVoiceApi.exportDevotional(
  devotionalId,
  format
);
```

### **5. Update Book Planning Screens**

#### **File: `app/(tabs)/book-planner.tsx`**

```typescript
// Before
import { BookPlannerService } from "../../services/bookPlannerService";

const bookPlannerService = new BookPlannerService();

// After
import { kingdomVoiceApi } from "../../services/unifiedApiService";

const entries = await kingdomVoiceApi.getBookPlannerEntries();
const outline = await kingdomVoiceApi.generateBookOutline(
  bookTitle,
  genre,
  targetAudience,
  keyThemes
);
```

### **6. Update Dream Tracking Screens**

#### **File: `app/(tabs)/dream-tracker.tsx`**

```typescript
// Before
import { DreamService } from "../../services/dreamService";

const dreamService = new DreamService();

// After
import { kingdomVoiceApi } from "../../services/unifiedApiService";

await kingdomVoiceApi.saveDreamEntry(dreamEntry);
const interpretation = await kingdomVoiceApi.interpretDream(
  dreamDescription,
  dreamType,
  emotions
);
```

### **7. Update Declaration Builder**

#### **File: `app/(tabs)/declaration-builder.tsx`**

```typescript
// Before
import { DeclarationService } from "../../services/declarationService";

const declarationService = new DeclarationService();

// After
import { kingdomVoiceApi } from "../../services/unifiedApiService";

const declaration = await kingdomVoiceApi.generateDeclaration(
  topic,
  declarationType,
  scripture
);
```

### **8. Update Social Media Management**

#### **File: `app/(tabs)/social-media-management.tsx`**

```typescript
// Before
import { SocialMediaService } from "../../services/socialMediaService";

const socialMediaService = new SocialMediaService();

// After
import { kingdomVoiceApi } from "../../services/unifiedApiService";

const shareResult = await kingdomVoiceApi.shareToSocialMedia(
  contentId,
  platforms,
  message
);
const analytics = await kingdomVoiceApi.getSocialMediaAnalytics(timeframe);
```

### **9. Update AI Enhancements**

#### **File: `app/(tabs)/ai-enhancements.tsx`**

```typescript
// Before
import { AIService } from "../../services/aiService";

const aiService = new AIService();

// After
import { kingdomVoiceApi } from "../../services/unifiedApiService";

const enhancedContent = await kingdomVoiceApi.enhanceContent(
  content,
  enhancementType
);
const hashtags = await kingdomVoiceApi.generateHashtags(content, platform);
```

## 🔧 **Advanced Migration Patterns**

### **Error Handling**

#### **Before:**

```typescript
try {
  const result = await audioService.startRecording();
  // Handle success
} catch (error) {
  console.error("Audio Service Error:", error);
  // Handle error
}
```

#### **After:**

```typescript
try {
  const result = await kingdomVoiceApi.startRecording();
  // Handle success
} catch (error) {
  console.error("API Error:", error);
  // Error is automatically handled by the unified client
}
```

### **Audio Processing**

#### **Before:**

```typescript
// Manual audio processing
const audioFile = await audioService.record();
const transcript = await audioService.transcribe(audioFile);
const analysis = await audioService.analyze(audioFile);
```

#### **After:**

```typescript
// Unified API handles audio processing
const recording = await kingdomVoiceApi.startRecording();
const audioFile = await kingdomVoiceApi.stopRecording(recording.recordingId);
const transcript = await kingdomVoiceApi.transcribeAudio(audioFile);
const analysis = await kingdomVoiceApi.analyzeAudio(audioFile, "spiritual");
```

### **Content Generation**

#### **Before:**

```typescript
// Individual content generation services
const devotional = await devotionalService.generate(topic);
const declaration = await declarationService.generate(topic);
const bookOutline = await bookPlannerService.generateOutline(bookTitle);
```

#### **After:**

```typescript
// Unified API for all content generation
const devotional = await kingdomVoiceApi.generateDevotional(topic, scripture);
const declaration = await kingdomVoiceApi.generateDeclaration(
  topic,
  declarationType
);
const bookOutline = await kingdomVoiceApi.generateBookOutline(
  bookTitle,
  genre,
  targetAudience,
  keyThemes
);
```

## 🧪 **Testing the Migration**

### **1. Test Audio Recording**

```typescript
// Test audio recording
const recording = await kingdomVoiceApi.startRecording();
console.log("Recording started:", recording.recordingId);

const audioFile = await kingdomVoiceApi.stopRecording(recording.recordingId);
console.log("Recording stopped:", audioFile.audioUrl);
```

### **2. Test Transcription**

```typescript
// Test audio transcription
const transcript = await kingdomVoiceApi.transcribeAudio(audioFile, "en", {
  faithMode: true,
  includeTimestamps: true,
});
console.log("Transcription:", transcript.text);
```

### **3. Test Journal Entries**

```typescript
// Test journal operations
const entry = await kingdomVoiceApi.saveJournalEntry({
  title: "My Journal Entry",
  content: "Today was amazing...",
  category: "journal",
  faithMode: true,
});

const entries = await kingdomVoiceApi.getJournalEntries();
console.log("Journal entries:", entries.entries.length);
```

### **4. Test Devotional Generation**

```typescript
// Test devotional generation
const devotional = await kingdomVoiceApi.generateDevotional(
  "Gratitude",
  "Psalm 100:4",
  "reflection"
);
console.log("Generated devotional:", devotional.devotional.title);
```

### **5. Test Dream Interpretation**

```typescript
// Test dream interpretation
const interpretation = await kingdomVoiceApi.interpretDream(
  "I was flying over a beautiful landscape",
  "encouragement",
  ["joy", "peace"]
);
console.log("Dream interpretation:", interpretation.interpretation);
```

### **6. Test Book Planning**

```typescript
// Test book planning
const outline = await kingdomVoiceApi.generateBookOutline(
  "Faith Journey",
  "Christian Living",
  "Young Adults",
  ["faith", "growth", "purpose"]
);
console.log("Book outline:", outline.outline);
```

### **7. Test Podcast Features**

```typescript
// Test podcast operations
const episode = await kingdomVoiceApi.savePodcastEpisode({
  title: "My First Podcast",
  description: "A faith-based podcast episode",
  audioUrl: "https://example.com/audio.mp3",
  duration: 1800,
  tags: ["faith", "inspiration"],
});

const episodes = await kingdomVoiceApi.getPodcastEpisodes();
console.log("Podcast episodes:", episodes.episodes.length);
```

### **8. Test Social Media Integration**

```typescript
// Test social media features
const shareResult = await kingdomVoiceApi.shareToSocialMedia(
  contentId,
  ["instagram", "twitter"],
  "Check out my latest devotional!"
);
console.log("Share result:", shareResult.success);

const analytics = await kingdomVoiceApi.getSocialMediaAnalytics("30d");
console.log("Social media analytics:", analytics);
```

## 🚨 **Breaking Changes**

### **1. Method Signature Changes**

#### **Audio Recording:**

- **Before:** `audioService.startRecording()`
- **After:** `kingdomVoiceApi.startRecording()`

#### **Journal Entries:**

- **Before:** `journalService.saveEntry(entry)`
- **After:** `kingdomVoiceApi.saveJournalEntry(entry)`

#### **Content Generation:**

- **Before:** `devotionalService.generate(topic)`
- **After:** `kingdomVoiceApi.generateDevotional(topic, scripture)`

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
console.log("API Config:", kingdomVoiceApi.getApiConfig());
console.log("Request Headers:", kingdomVoiceApi.getRequestHeaders());
```

### **Check API Statistics:**

```typescript
const stats = await kingdomVoiceApi.getApiStats();
console.log("API Stats:", stats);
```

### **Clear Cache When Needed:**

```typescript
// Clear cache for fresh data
kingdomVoiceApi.clearCache();
```

## ✅ **Migration Checklist**

- [ ] Install `@kingdom-collective/api` package
- [ ] Update environment variables
- [ ] Replace individual service imports with `unifiedApiService.ts`
- [ ] Update audio recording screens
- [ ] Update journal entry screens
- [ ] Update devotional screens
- [ ] Update book planning screens
- [ ] Update dream tracking screens
- [ ] Update declaration builder
- [ ] Update social media management
- [ ] Update AI enhancements
- [ ] Test audio recording functionality
- [ ] Test transcription functionality
- [ ] Test journal functionality
- [ ] Test devotional generation
- [ ] Test dream interpretation
- [ ] Test book planning
- [ ] Test podcast features
- [ ] Test social media integration
- [ ] Update error handling patterns
- [ ] Verify caching behavior
- [ ] Check performance improvements

## 🎯 **Next Steps**

1. **Complete Kingdom Voice migration**
2. **Test thoroughly in development**
3. **Deploy to staging environment**
4. **Monitor performance and errors**
5. **Move to next app (Kingdom Launchpad)**

---

**🎉 Your Kingdom Voice app is now using the unified API system!**

This migration will provide better performance, consistency, and maintainability across all your Kingdom apps.
