# 👑 Kingdom Studios - Creator's Edge Toolkit

> "Build. Share. Thrive." — A faith-filled toolkit for digital creators and Kingdom entrepreneurs.

## 🎯 Overview

Kingdom Studios is a comprehensive mobile app designed to empower faith-based creators and entrepreneurs to manage products, create content, and share their message with excellence. Built with React Native and Expo, it provides a unified platform for content creation, product management, community engagement, and spiritual encouragement.

## ✨ Key Features

### 🔐 Authentication & Onboarding

- **Multi-Provider Authentication**: Google, Apple, Facebook, Email/Password via Firebase
- **Faith Mode Selection**: Choose between faith-based or general encouragement
- **Interactive Onboarding**: Step-by-step setup with welcome guide
- **Dual-Mode Experience**: Scripture-inspired content and secular motivation options

### 📦 Product Management System

- **Multi-Platform Support**: Etsy, Printify, Shopify integration
- **Complete CRUD Operations**: Add, edit, view, and manage products
- **Image Upload**: expo-image-picker integration for product photos
- **Search & Filter**: Advanced filtering by platform, tags, categories
- **Sync Status Tracking**: Real-time product synchronization status
- **Product Analytics**: Views, clicks, and sales tracking

### ✨ AI-Powered Content Creation

- **Multi-Platform Posting**: Instagram, TikTok, YouTube, Facebook, X, Pinterest, Threads, Lemon8, Truth Social
- **Auto-Caption Generation**: AI-powered captions with product integration
- **Smart Hashtag Creation**: Category and faith-based hashtag suggestions
- **Content Generator Modal**: Multiple content variations with one click
- **Platform Optimization**: Tailored content for each social platform
- **Faith Mode Integration**: Scripture-inspired copywriting

### 📚 Content Management

- **Content Library**: Centralized repository for all created content
- **Scheduled Posts**: Queue and manage upcoming publications
- **Draft Management**: Save and edit content before publishing
- **Publishing History**: Track performance of published content
- **Template System**: Reusable content templates

### 🤝 Community Features

- **Forge Community**: Faith-based creator discussions
- **Discussion Threads**: Topic-based community engagement
- **Prayer Requests**: Spiritual support within the community
- **Success Stories**: Share wins and testimonials
- **Mentorship**: Connect with experienced creators

### 💰 Monetization & Sponsorship

- **Sponsorship Requests**: Apply for Forge Access sponsorship
- **Tier Management**: Free, Pro, and Sponsored access levels
- **Contact Integration**: Direct communication with Desirea@ontheroadhomeministries.com
- **Auto-Activation**: Seamless sponsored access activation
- **Subscription Management**: Flexible pricing and upgrade options

### 📊 Analytics & Insights

- **Performance Metrics**: Impressions, engagement, reach tracking
- **Platform Analytics**: Performance breakdown by social platform
- **Growth Insights**: Follower and engagement growth trends
- **Content Performance**: Top-performing posts and content types
- **Revenue Tracking**: Product sales and conversion metrics

### ⚙️ Settings & Preferences

- **Faith Mode Toggle**: Switch between faith and general mode
- **Platform Preferences**: Set default social media platforms
- **Content Style**: Choose content tone and approach
- **Notification Settings**: Customize app notifications
- **Account Management**: Profile settings and account controls

## 🛠️ Technical Stack

### **Frontend**

- **Framework**: React Native with Expo (TypeScript)
- **Navigation**: @react-navigation/native-stack
- **State Management**: React Context API
- **UI Framework**: React Native built-in components
- **Image Handling**: expo-image-picker
- **Storage**: @react-native-async-storage/async-storage

### **Backend Services**

- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore (future)
- **File Storage**: Firebase Storage (future)
- **Cloud Functions**: Firebase Functions (future)

### **Development Tools**

- **Build Tool**: Expo CLI
- **Language**: TypeScript
- **Version Control**: Git
- **Code Editor**: VS Code with GitHub Copilot

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS testing)
- Android Studio (for Android testing)

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd kingdom-studios
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file in the root directory
   cp .env.example .env
   # Add your Firebase configuration
   ```

4. **Start the development server**

   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on different platforms**

   ```bash
   # Web
   npm run web

   # iOS
   npm run ios

   # Android
   npm run android
   ```

## 📱 App Structure

```
kingdom-studios/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ContentGeneratorModal.tsx
│   │   ├── WelcomeGuide.tsx
│   │   └── QuickActionsWidget.tsx
│   ├── contexts/            # Global state management
│   │   ├── AppContext.tsx
│   │   ├── AuthContext.tsx
│   │   ├── FaithModeContext.tsx
│   │   └── ProductContext.tsx
│   ├── navigation/          # App navigation
│   │   └── AuthNavigator.tsx
│   ├── screens/            # Main app screens
│   │   ├── tools/          # Content creation tools
│   │   │   ├── ProductDashboardScreen.tsx
│   │   │   ├── AddProductScreen.tsx
│   │   │   ├── EditProductScreen.tsx
│   │   │   ├── ProductDetailsScreen.tsx
│   │   │   ├── MultiPlatformPostScreen.tsx
│   │   │   ├── ContentLibraryScreen.tsx
│   │   │   └── ScheduledPostsScreen.tsx
│   │   ├── AnalyticsOverviewScreen.tsx
│   │   ├── ContentGeneratorScreen.tsx
│   │   ├── CreatorDashboardScreen.tsx
│   │   ├── ForgeCommunityScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── PricingScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── SponsorshipRequestScreen.tsx
│   │   └── SponsorshipsScreen.tsx
│   ├── types/              # TypeScript type definitions
│   │   └── navigation.ts
│   ├── utils/              # Utility functions
│   │   ├── authUtils.ts
│   │   └── navigationUtils.ts
│   └── config/             # App configuration
│       └── firebase.ts
├── assets/                 # Static assets
├── App.tsx                # Root component
├── app.config.js          # Expo configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Design System

### **Color Palette**

- **Primary Background**: #000000 (Pure Black)
- **Secondary Background**: #1f2937 (Dark Gray)
- **Accent Color**: #f97316 (Orange)
- **Text Primary**: #ffffff (White)
- **Text Secondary**: #9ca3af (Light Gray)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)

### **Typography**

- **Headers**: Bold, clean fonts
- **Body Text**: Regular weight, high readability
- **Faith Content**: Italic styling for verses and inspiration

### **Components**

- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Rounded, consistent sizing
- **Inputs**: Clean borders, focus states
- **Faith Banners**: Orange left border, subtle background

## 🙏 Faith Mode Features

### **Scripture Integration**

- Dynamic verse banners throughout the app
- Context-appropriate biblical encouragement
- Faith-based copywriting for all content

### **Community Aspects**

- Prayer request functionality
- Christian entrepreneur networking
- Ministry-focused discussions

### **Content Creation**

- Scripture-inspired captions
- Faith-based hashtag suggestions
- Kingdom business messaging

## 📋 User Journeys

### **New User Onboarding**

1. Download app and create account
2. Choose Faith Mode preference
3. Complete guided onboarding
4. View welcome guide
5. Start with first product or content creation

### **Content Creator Flow**

1. Navigate to Products → Add new product
2. Upload image, fill details, select platform
3. Go to Multi-Platform Post → Generate content
4. Use AI generator for caption variations
5. Select platforms and publish/schedule

### **Community Engagement**

1. Visit Forge Community
2. Browse discussion threads
3. Share testimonies or ask questions
4. Connect with other faith-based creators

### **Sponsorship Application**

1. Visit Sponsorships → Request Access
2. Fill application form
3. Submit to Desirea@ontheroadhomeministries.com
4. Receive activation notification
5. Access premium features

## 🔮 Future Enhancements

### **Phase 2 Features**

- Direct social media API integrations
- Advanced AI content generation (OpenAI/Replicate)
- Real-time collaboration tools
- Advanced analytics dashboard

### **Phase 3 Features**

- Payment processing (Stripe integration)
- Live streaming capabilities
- Advanced scheduling algorithms
- Cross-platform synchronization

### **Phase 4 Features**

- AI coaching and recommendations
- Advanced community features
- Marketplace integration
- API for third-party developers

## 📞 Support & Contact

### **Technical Support**

- **Email**: support@kingdomstudios.app
- **Documentation**: [docs.kingdomstudios.app]

### **Sponsorship Inquiries**

- **Contact**: Desirea@ontheroadhomeministries.com
- **Subject**: Kingdom Studios Sponsorship Request

### **Community**

- **Discord**: [Kingdom Studios Community]
- **Social Media**: @KingdomStudiosApp

## 📜 License

This project is proprietary software. All rights reserved.

## 🎉 Acknowledgments

- **Desirea** - Vision and ministry leadership
- **Faith-based creator community** - Inspiration and feedback
- **Open source community** - Technical foundations

---

**"Whatever you do, work at it with all your heart, as working for the Lord" - Colossians 3:23**

_Build something beautiful for His glory._ ✨
