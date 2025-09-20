# Kingdom Circle 2.0 - Complete Social Media Platform

## 🚀 **Platform Overview**

Kingdom Circle 2.0 is a **full-featured social media app for everyone**, not just believers. It provides free speech, real connection, and faith-powered encouragement while allowing creators of all backgrounds to speak truth, create boldly, and monetize fairly.

### **Core Values**

- **No shadowbanning, no suppression** — all voices welcome
- **Free speech and real connection**
- **Faith-powered encouragement** (optional)
- **Fair monetization** for creators
- **Equal access for all** — no paywalls, no feature restrictions

---

## 🎯 **Key Features**

### **1. Post Creation System**

- **Media Upload**: Photos and videos with camera/gallery support
- **Rich Captions**: Up to 2200 characters with formatting
- **Categories**: 11 predefined categories (Faith & Spirituality, Family & Relationships, etc.)
- **Tags**: Up to 5 custom tags with autocomplete
- **Enhanced Monetization Options** (Available to EVERYONE):
  - Tip Jar (enable/disable)
  - Product links
  - Subscription content
  - Event tickets
  - Coaching sessions
  - Affiliate links
  - Donation links
  - Merchandise links
- **Live Streaming** (Available to EVERYONE):
  - Go live anytime
  - No restrictions or fees
  - Public or private streams
  - Faith Mode integration
  - Real-time engagement
- **Visibility Flags**:
  - 18+ content warning
  - Sensitive topic flag
  - Spiritual/declaration flag

### **2. Advanced Feed Algorithm**

- **6 Feed Tabs**:
  - **For You**: Algorithm-based personalization
  - **Trending**: High-engagement content from last 24 hours
  - **Recent**: Chronological feed
  - **Faith Flow**: Faith-related content (when Faith Mode enabled)
  - **Live Now**: Live streaming content (available to everyone)
  - **Unfiltered**: All content, no filtering
- **Engagement Scoring**:
  - Watch time percentage (2x weight)
  - Rewatches (1.5x weight)
  - Shares (2x weight)
  - Saves (1.5x weight)
  - Likes (1x weight)
  - Comments (1.25x weight)
  - Profile clicks (1.5x weight)

### **3. Enhanced Creator Dashboard** (Available to EVERYONE)

- **Earnings Tracking**: Real-time gross earnings and creator share
- **90/10 Split**: Creators keep 90%, platform takes 10%
- **Blessing Pool**: Optional 5% contribution to help other creators
- **Withdrawal System**: Stripe/PayPal integration
- **Milestone Tracking**: Views, engagement, shares, followers
- **Advanced Analytics** (Available to EVERYONE):
  - Audience growth metrics
  - Engagement rate analysis
  - Best posting times
  - Geographic reach
  - Demographic breakdown
  - Content performance insights
  - Revenue trends
- **Creator Tools**: Withdraw earnings, request blessings
- **AI Content Suggestions** (Available to EVERYONE):
  - Trending topics analysis
  - Optimal posting time recommendations
  - Hashtag suggestions
  - Content ideas based on audience insights
  - Competitor analysis
  - Performance predictions
  - Seasonal trends

### **4. Community Challenges** (Available to EVERYONE)

- **Interactive Challenges**: Join community-wide challenges
- **Rewards & Badges**: Earn rewards for participation
- **Progress Tracking**: Visual progress indicators
- **Leaderboards**: Compete with other creators
- **Challenge Types**:
  - Faith-based challenges (Prayer, Scripture sharing)
  - Growth challenges (Personal development, Authenticity)
  - Family challenges (Connection, Relationships)
  - Truth-speaking challenges (Vulnerability, Authenticity)
- **Submission System**: Easy content submission for challenges
- **Community Support**: Connect with other participants

### **5. Faith Mode System**

- **Toggle Switch**: Enable/disable Faith Mode
- **Language Adaptation**: Spiritual vs. wellness terminology
- **Content Preferences**: Filter what you see, not what others post
- **Blessing Pool Integration**: Faith-based giving system
- **Creator Type**: Free vs. Pro creator status (no feature restrictions)

### **6. Safety & Anti-Spam**

- **Rate Limiting**:
  - New users: 3 DMs/hour, 5 posts/day
  - Established users: 50 DMs/hour, 20 posts/day
- **Spam Detection**: Auto-flagging of repeated content, links, promotional text
- **Shadowban System**: Automatic and manual moderation
- **Appeal Process**: Users can appeal visibility restrictions
- **Bot Detection**: Pattern recognition for automated behavior

---

## 🏗️ **Technical Architecture**

### **Components**

- **PostCreator.tsx**: Complete post creation interface with live streaming
- **Feed.tsx**: Social media feed with algorithm and 6 tabs including live content
- **CreatorDashboard.tsx**: Enhanced monetization and creator tools
- **CommunityChallenges.tsx**: Interactive community challenges
- **ContentSuggestionService.ts**: AI-powered content suggestions
- **RateLimit.ts**: Anti-spam and safety middleware

### **Data Models**

```typescript
// Enhanced Post Schema
interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  caption: string;
  category: string;
  tags: string[];
  monetization: {
    tipsEnabled: boolean;
    paidAccess: boolean; // Always false - no restrictions
    productLink?: string;
    price?: number; // Always undefined - no paid content
    // Enhanced monetization for everyone
    subscriptionContent: boolean;
    exclusiveAccess: boolean;
    merchandiseLinks: string[];
    eventTickets: boolean;
    coachingSessions: boolean;
    affiliateLinks: string[];
    donationLinks: string[];
  };
  liveStreaming: {
    isLiveStream: boolean;
    title?: string;
    description?: string;
    scheduledTime?: Date;
    isPublic: boolean;
    allowComments: boolean;
    allowReactions: boolean;
    faithMode: boolean;
  };
  visibilityFlags: {
    mature: boolean;
    sensitive: boolean;
    spiritual: boolean;
  };
  engagement: {
    views: number;
    likes: number;
    shares: number;
    saves: number;
    comments: number;
    watchTimePercent: number;
    rewatches: number;
    profileClicks: number;
  };
  timestamp: Date;
  score: number;
  isLiveStream?: boolean;
  liveStreamData?: {
    viewerCount: number;
    isLive: boolean;
    startedAt: Date;
    title: string;
  };
}

// Enhanced Creator Earnings Schema
interface CreatorEarnings {
  userId: string;
  month: string;
  totalGross: number;
  creatorKeep: number;
  platformShare: number;
  blessingPoolExtra?: number;
  withdrawalStatus: "pending" | "paid";
  payoutMethod: "stripe" | "paypal";
}

// Community Challenge Schema
interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  participants: number;
  reward: string;
  faithMode: boolean;
  category: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  userProgress?: number;
  userCompleted?: boolean;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  leaderboard?: ChallengeLeaderboardEntry[];
  requirements: string[];
  tips: string[];
}

// AI Content Suggestions Schema
interface ContentSuggestion {
  trendingTopics: string[];
  optimalPostingTimes: Date[];
  hashtagRecommendations: string[];
  contentIdeas: string[];
  audienceInsights: AudienceData;
  competitorAnalysis: CompetitorData[];
  performancePredictions: PerformancePrediction[];
  seasonalTrends: SeasonalTrend[];
}
```

### **Navigation Structure**

```
📱 Kingdom Circle 2.0
├── 🏠 Home (Social Feed)
├── 🔍 Explore
├── 👥 Circle (Community)
├── 🔒 Forge (Groups)
├── 🙏 Prayer Board
├── ✅ Check-In
├── 👑 Creator Dashboard (Enhanced)
├── 🏆 Challenges (NEW)
└── ⚙️ Settings
```

---

## 💰 **Inclusive Monetization System**

### **Revenue Split**

- **Creator Share**: 90% of all earnings
- **Platform Share**: 10% for hosting, storage, payouts
- **Blessing Pool**: Optional 5% extra contribution

### **Earning Sources** (Available to EVERYONE)

1. **Tips**: Direct support from followers
2. **Product Sales**: Commission on linked products
3. **Subscription Content**: Premium content (no restrictions)
4. **Event Tickets**: Sell tickets to events
5. **Coaching Sessions**: Offer mentorship/coaching
6. **Affiliate Marketing**: Earn from affiliate links
7. **Donations**: Direct donation links
8. **Merchandise**: Sell your own products
9. **Blessing Pool**: Community support system

### **No Feature Restrictions**

- **Live Streaming**: Available to all users
- **Advanced Analytics**: Available to all creators
- **AI Content Suggestions**: Available to all creators
- **Community Challenges**: Available to all users
- **Enhanced Monetization**: All options available to everyone
- **Creator Tools**: Full access regardless of earnings

---

## 🛡️ **Safety & Moderation**

### **Content Flags**

- **18+ Content**: Mature content warning
- **Sensitive Topics**: Trigger warnings
- **Spiritual Content**: Faith-based declarations

### **Rate Limiting**

- **New Users**: Restricted activity to prevent spam
- **Established Users**: Higher limits based on account age
- **Automatic Detection**: Bot behavior recognition

### **Appeal System**

- **Shadowban Appeals**: Users can request review
- **Moderator Review**: Human oversight of automated decisions
- **Transparent Process**: Clear communication of decisions

---

## 🎨 **User Experience**

### **Dual Mode Support**

- **Faith Mode**: Spiritual language, prayer terminology, scripture integration
- **Encouragement Mode**: Wellness focus, support language, secular approach

### **Accessibility**

- **Haptic Feedback**: Tactile responses for interactions
- **Screen Reader Support**: Proper labeling and navigation
- **Color Contrast**: Accessible color schemes for both themes

### **Performance**

- **60fps Animations**: Smooth transitions and interactions
- **Lazy Loading**: Efficient content loading
- **Offline Support**: Core features work without internet

---

## 🔧 **Development Setup**

### **Installation**

```bash
cd apps/kingdom-circle
npm install
```

### **Dependencies Added**

- `expo-image-picker`: Media upload functionality
- `expo-camera`: Camera integration
- `expo-av`: Video playback support

### **Environment Variables**

```env
# Unified API Configuration
EXPO_PUBLIC_API_BASE_URL=https://api.kingdomcollective.pro
EXPO_PUBLIC_API_VERSION=v1

# App Identification
EXPO_PUBLIC_APP_NAME=kingdom-circle
EXPO_PUBLIC_APP_VERSION=2.0.0
```

### **Running the App**

```bash
# Development
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

---

## 📊 **Analytics & Metrics**

### **Engagement Tracking**

- **View Time**: Percentage of video watched
- **Rewatches**: Content viewed multiple times
- **Shares**: Content distribution
- **Saves**: Bookmarked content
- **Profile Clicks**: User discovery

### **Creator Analytics** (Available to EVERYONE)

- **Earnings**: Monthly revenue tracking
- **Audience Growth**: Follower acquisition
- **Content Performance**: Post engagement rates
- **Geographic Data**: User location insights
- **Demographic Breakdown**: Age, gender, location data
- **Behavioral Trends**: User engagement patterns
- **Competitor Analysis**: Market insights
- **Performance Predictions**: AI-powered forecasting

---

## 🚀 **Future Roadmap**

### **Phase 2 Features**

- **Enhanced Live Streaming**: Multi-guest streams, virtual events
- **Advanced Collaboration**: Co-creation tools, shared content
- **AI Content Moderation**: Enhanced safety systems
- **Virtual Reality**: Immersive content experiences

### **Phase 3 Features**

- **NFT Integration**: Digital asset creation
- **Metaverse Support**: Virtual reality experiences
- **Advanced Monetization**: Subscription models, merchandise
- **Global Expansion**: Multi-language support

---

## 🤝 **Community Guidelines**

### **Core Principles**

1. **Respect All Voices**: No censorship based on beliefs
2. **Authentic Content**: Encourage real, meaningful posts
3. **Supportive Environment**: Build each other up
4. **Fair Play**: No gaming the algorithm or spam
5. **Equal Opportunity**: All features available to everyone

### **Content Standards**

- **No Hate Speech**: Respectful discourse required
- **No Harassment**: Supportive community environment
- **No Spam**: Quality over quantity
- **Transparent Monetization**: Clear disclosure of paid content

---

## 🏆 **What Makes Kingdom Circle 2.0 Different**

### **Inclusive Design**

- **No Paywalls**: All features available to every user
- **No Feature Restrictions**: Advanced tools for everyone
- **Equal Opportunity**: Same monetization options for all creators
- **Community Focus**: Building together, not competing

### **Creator-First Approach**

- **90/10 Revenue Split**: Creators keep the majority
- **Transparent System**: Clear understanding of earnings
- **Supportive Tools**: AI suggestions, analytics, challenges
- **Fair Algorithm**: No shadowbanning or suppression

### **Faith Integration**

- **Optional Faith Mode**: Spiritual language when desired
- **Inclusive Community**: Welcoming to all beliefs
- **Blessing Pool**: Community support system
- **Authentic Expression**: Freedom to share truth

---

_"Unless the Lord builds the house, the builders labor in vain." - Psalm 127:1_

**Build your Kingdom with purpose, authority, and value.** 🏰✨
