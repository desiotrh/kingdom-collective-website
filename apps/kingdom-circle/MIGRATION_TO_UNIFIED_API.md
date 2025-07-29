# ⭕ Kingdom Circle - Migration to Unified API

This guide will help you migrate Kingdom Circle from individual services to the unified API system.

## 🚀 **Quick Migration Steps**

### **Step 1: Install the Unified API Package**

```bash
cd apps/kingdom-circle
npm install @kingdom-collective/api
```

### **Step 2: Update Environment Variables**

Add to your `.env` file:

```env
# Unified API Configuration
EXPO_PUBLIC_API_BASE_URL=https://api.kingdomcollective.pro
EXPO_PUBLIC_API_VERSION=v1

# App Identification
EXPO_PUBLIC_APP_NAME=kingdom-circle
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### **Step 3: Replace Service Imports**

#### **Before (Old Way):**

```typescript
// Individual service imports
import { CommunityService } from "../services/communityService";
import { MentorshipService } from "../services/mentorshipService";
import { PrayerService } from "../services/prayerService";
import { AccountabilityService } from "../services/accountabilityService";
```

#### **After (New Way):**

```typescript
import { kingdomCircleApi } from "../services/unifiedApiService";

// All API calls now go through the unified service
```

## 🔄 **Service Migration Map**

### **User Management**

#### **Before:**

```typescript
// Individual user service
const user = await userService.getProfile();
await userService.updateProfile(updates);
const users = await userService.searchUsers(query);
```

#### **After:**

```typescript
// unifiedApiService.ts
const user = await kingdomCircleApi.getUserProfile();
await kingdomCircleApi.updateUserProfile(updates);
const users = await kingdomCircleApi.searchUsers(query);
```

### **Group Management**

#### **Before:**

```typescript
// Community service
await communityService.createGroup(groupData);
const groups = await communityService.getGroups();
await communityService.joinGroup(groupId);
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomCircleApi.createGroup(groupData);
const groups = await kingdomCircleApi.getGroups();
await kingdomCircleApi.joinGroup(groupId);
```

### **Prayer Requests**

#### **Before:**

```typescript
// Prayer service
await prayerService.createRequest(requestData);
const requests = await prayerService.getRequests();
await prayerService.markAsPrayed(requestId);
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomCircleApi.createPrayerRequest(requestData);
const requests = await kingdomCircleApi.getPrayerRequests();
await kingdomCircleApi.markPrayerAsPrayed(requestId);
```

### **Mentorship**

#### **Before:**

```typescript
// Mentorship service
const mentors = await mentorshipService.findMentors(focusAreas);
await mentorshipService.requestMentorship(mentorId, goals);
const relationships = await mentorshipService.getRelationships();
```

#### **After:**

```typescript
// unifiedApiService.ts
const mentors = await kingdomCircleApi.findMentors(focusAreas);
await kingdomCircleApi.requestMentorship(
  mentorId,
  goals,
  focusAreas,
  frequency
);
const relationships = await kingdomCircleApi.getMentorshipRelationships();
```

### **Accountability**

#### **Before:**

```typescript
// Accountability service
await accountabilityService.createCheckin(checkinData);
const checkins = await accountabilityService.getCheckins();
await accountabilityService.supportCheckin(checkinId);
```

#### **After:**

```typescript
// unifiedApiService.ts
await kingdomCircleApi.createAccountabilityCheckin(checkinData);
const checkins = await kingdomCircleApi.getAccountabilityCheckins();
await kingdomCircleApi.supportAccountabilityCheckin(checkinId);
```

## 📁 **File-by-File Migration**

### **1. Update Main App Entry Point**

#### **File: `App.tsx` or `_app.tsx`**

```typescript
// Before
import { CommunityService } from "./services/communityService";
import { MentorshipService } from "./services/mentorshipService";

// After
import { kingdomCircleApi } from "./services/unifiedApiService";
```

### **2. Update Circle Home Screen**

#### **File: `app/(tabs)/circle-home.tsx`**

```typescript
// Before
import { CommunityService } from "../../services/communityService";

const communityService = new CommunityService();

// After
import { kingdomCircleApi } from "../../services/unifiedApiService";

// Replace community operations
const groups = await kingdomCircleApi.getGroups();
const prayerRequests = await kingdomCircleApi.getPrayerRequests();
```

### **3. Update Profile Screen**

#### **File: `app/(tabs)/profile.tsx`**

```typescript
// Before
import { UserService } from "../../services/userService";

const userService = new UserService();

// After
import { kingdomCircleApi } from "../../services/unifiedApiService";

// Replace user operations
const profile = await kingdomCircleApi.getUserProfile();
await kingdomCircleApi.updateUserProfile(updates);
```

### **4. Update Prayer Board Screen**

#### **File: `app/(tabs)/prayer-board.tsx`**

```typescript
// Before
import { PrayerService } from "../../services/prayerService";

const prayerService = new PrayerService();

// After
import { kingdomCircleApi } from "../../services/unifiedApiService";

// Replace prayer operations
await kingdomCircleApi.createPrayerRequest(requestData);
const requests = await kingdomCircleApi.getPrayerRequests();
await kingdomCircleApi.markPrayerAsPrayed(requestId);
```

### **5. Update Accountability Check-in Screen**

#### **File: `app/(tabs)/accountability-checkin.tsx`**

```typescript
// Before
import { AccountabilityService } from "../../services/accountabilityService";

const accountabilityService = new AccountabilityService();

// After
import { kingdomCircleApi } from "../../services/unifiedApiService";

// Replace accountability operations
await kingdomCircleApi.createAccountabilityCheckin(checkinData);
const checkins = await kingdomCircleApi.getAccountabilityCheckins();
await kingdomCircleApi.supportAccountabilityCheckin(checkinId);
```

### **6. Update Forge Group Screen**

#### **File: `app/(tabs)/forge-group.tsx`**

```typescript
// Before
import { CommunityService } from "../../services/communityService";

const communityService = new CommunityService();

// After
import { kingdomCircleApi } from "../../services/unifiedApiService";

// Replace group operations
await kingdomCircleApi.createGroup(groupData);
const groups = await kingdomCircleApi.getGroups();
await kingdomCircleApi.joinGroup(groupId);
```

### **7. Update Settings Screen**

#### **File: `app/(tabs)/settings.tsx`**

```typescript
// Before
import { UserService } from "../../services/userService";

const userService = new UserService();

// After
import { kingdomCircleApi } from "../../services/unifiedApiService";

// Replace user operations
const profile = await kingdomCircleApi.getUserProfile();
await kingdomCircleApi.updateUserProfile(updates);
```

## 🔧 **Advanced Migration Patterns**

### **Error Handling**

#### **Before:**

```typescript
try {
  const result = await communityService.createGroup(groupData);
  // Handle success
} catch (error) {
  console.error("Community Service Error:", error);
  // Handle error
}
```

#### **After:**

```typescript
try {
  const result = await kingdomCircleApi.createGroup(groupData);
  // Handle success
} catch (error) {
  console.error("API Error:", error);
  // Error is automatically handled by the unified client
}
```

### **Real-time Updates**

#### **Before:**

```typescript
// Manual real-time updates
const unsubscribe = communityService.subscribeToUpdates(callback);
```

#### **After:**

```typescript
// Unified API handles real-time updates
const unsubscribe = kingdomCircleApi.subscribeToUpdates(callback);
```

### **Data Synchronization**

#### **Before:**

```typescript
// Manual data sync
await communityService.syncData();
await mentorshipService.syncData();
await prayerService.syncData();
```

#### **After:**

```typescript
// Unified API handles data synchronization
await kingdomCircleApi.syncData();
```

## 🧪 **Testing the Migration**

### **1. Test User Management**

```typescript
// Test user operations
const profile = await kingdomCircleApi.getUserProfile();
console.log("User profile:", profile.name);

await kingdomCircleApi.updateUserProfile({ bio: "Updated bio" });
console.log("Profile updated successfully");
```

### **2. Test Group Management**

```typescript
// Test group operations
const groups = await kingdomCircleApi.getGroups();
console.log("Groups:", groups.groups.length);

const newGroup = await kingdomCircleApi.createGroup({
  name: "Test Group",
  description: "A test group",
  category: "prayer",
  privacy: "public",
});
console.log("Group created:", newGroup.id);
```

### **3. Test Prayer Requests**

```typescript
// Test prayer operations
const request = await kingdomCircleApi.createPrayerRequest({
  title: "Test Prayer",
  description: "A test prayer request",
  category: "personal",
  urgency: "medium",
  isAnonymous: false,
});
console.log("Prayer request created:", request.id);

const requests = await kingdomCircleApi.getPrayerRequests();
console.log("Prayer requests:", requests.requests.length);
```

### **4. Test Mentorship**

```typescript
// Test mentorship operations
const mentors = await kingdomCircleApi.findMentors(["faith", "leadership"]);
console.log("Available mentors:", mentors.mentors.length);

const relationship = await kingdomCircleApi.requestMentorship(
  mentorId,
  ["Spiritual growth", "Leadership skills"],
  ["faith", "leadership"],
  "weekly"
);
console.log("Mentorship requested:", relationship.relationshipId);
```

### **5. Test Accountability**

```typescript
// Test accountability operations
const checkin = await kingdomCircleApi.createAccountabilityCheckin({
  type: "weekly",
  title: "Weekly Check-in",
  description: "My weekly accountability check-in",
  goals: ["Read Bible daily", "Pray more"],
  progress: 75,
  challenges: ["Busy schedule"],
  victories: ["Completed daily reading"],
  prayerRequests: ["Strength to continue"],
  nextSteps: ["Set reminders"],
  isCompleted: false,
  dueDate: new Date().toISOString(),
});
console.log("Check-in created:", checkin.id);

const checkins = await kingdomCircleApi.getAccountabilityCheckins();
console.log("Accountability check-ins:", checkins.checkins.length);
```

### **6. Test Events**

```typescript
// Test event operations
const event = await kingdomCircleApi.createEvent({
  title: "Prayer Meeting",
  description: "Weekly prayer meeting",
  organizerId: "user123",
  organizerName: "John Doe",
  type: "prayer",
  location: "Virtual",
  isVirtual: true,
  virtualLink: "https://zoom.us/meeting",
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 3600000).toISOString(),
  tags: ["prayer", "community"],
  isRecurring: true,
  recurrencePattern: "weekly",
  isActive: true,
});
console.log("Event created:", event.id);

const events = await kingdomCircleApi.getEvents();
console.log("Events:", events.events.length);
```

### **7. Test Messaging**

```typescript
// Test messaging operations
const message = await kingdomCircleApi.sendMessage(
  recipientId,
  "Hello! How are you doing?",
  "text"
);
console.log("Message sent:", message.messageId);

const messages = await kingdomCircleApi.getMessages(recipientId);
console.log("Messages:", messages.messages.length);
```

### **8. Test Notifications**

```typescript
// Test notification operations
const notifications = await kingdomCircleApi.getNotifications();
console.log("Notifications:", notifications.notifications.length);

await kingdomCircleApi.markAllNotificationsAsRead();
console.log("All notifications marked as read");
```

## 🚨 **Breaking Changes**

### **1. Method Signature Changes**

#### **User Management:**

- **Before:** `userService.getProfile()`
- **After:** `kingdomCircleApi.getUserProfile()`

#### **Group Management:**

- **Before:** `communityService.createGroup(groupData)`
- **After:** `kingdomCircleApi.createGroup(groupData)`

#### **Prayer Requests:**

- **Before:** `prayerService.createRequest(requestData)`
- **After:** `kingdomCircleApi.createPrayerRequest(requestData)`

#### **Mentorship:**

- **Before:** `mentorshipService.findMentors(focusAreas)`
- **After:** `kingdomCircleApi.findMentors(focusAreas, location)`

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
console.log("API Config:", kingdomCircleApi.getApiConfig());
console.log("Request Headers:", kingdomCircleApi.getRequestHeaders());
```

### **Check API Statistics:**

```typescript
const stats = await kingdomCircleApi.getApiStats();
console.log("API Stats:", stats);
```

### **Clear Cache When Needed:**

```typescript
// Clear cache for fresh data
kingdomCircleApi.clearCache();
```

## ✅ **Migration Checklist**

- [ ] Install `@kingdom-collective/api` package
- [ ] Update environment variables
- [ ] Replace individual service imports with `unifiedApiService.ts`
- [ ] Update circle home screen
- [ ] Update profile screen
- [ ] Update prayer board screen
- [ ] Update accountability check-in screen
- [ ] Update forge group screen
- [ ] Update settings screen
- [ ] Test user management functionality
- [ ] Test group management functionality
- [ ] Test prayer requests functionality
- [ ] Test mentorship functionality
- [ ] Test accountability functionality
- [ ] Test events functionality
- [ ] Test messaging functionality
- [ ] Test notifications functionality
- [ ] Update error handling patterns
- [ ] Verify caching behavior
- [ ] Check performance improvements

## 🎯 **Next Steps**

1. **Complete Kingdom Circle migration**
2. **Test thoroughly in development**
3. **Deploy to staging environment**
4. **Monitor performance and errors**
5. **Move to final app (Kingdom Lens)**

---

**🎉 Your Kingdom Circle app is now using the unified API system!**

This migration will provide better performance, consistency, and maintainability across all your Kingdom apps.
