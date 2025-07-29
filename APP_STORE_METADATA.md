# 📱 Kingdom Apps - App Store & Google Play Metadata

## 🎬 **Kingdom Clips**

### **App Store Metadata:**
- **App Name**: Kingdom Clips
- **Subtitle**: Video Content Creator
- **Category**: Photo & Video
- **Keywords**: video editing, content creation, social media, AI, faith-based, clips, reels, tiktok, instagram, youtube
- **Age Rating**: 4+
- **Support Email**: support@kingdomcollective.pro
- **Privacy Policy**: https://kingdomcollective.pro/privacy
- **Terms of Service**: https://kingdomcollective.pro/terms

### **Google Play Metadata:**
- **App Name**: Kingdom Clips - Video Content Creator
- **Category**: Photography
- **Short Description**: Transform your videos into viral clips with AI-powered editing
- **Full Description**: [Use description from APP_STORE_DESCRIPTIONS.md]
- **Content Rating**: Everyone
- **Support Email**: support@kingdomcollective.pro

### **Bundle Identifiers:**
- **iOS**: com.kingdomcollective.clips
- **Android**: com.kingdomcollective.clips

---

## 📸 **Kingdom Lens**

### **App Store Metadata:**
- **App Name**: Kingdom Lens
- **Subtitle**: Photography & Design Studio
- **Category**: Photo & Video
- **Keywords**: photography, camera, design, AI editing, professional, faith-based, mockups, business
- **Age Rating**: 4+
- **Support Email**: support@kingdomcollective.pro
- **Privacy Policy**: https://kingdomcollective.pro/privacy
- **Terms of Service**: https://kingdomcollective.pro/terms

### **Google Play Metadata:**
- **App Name**: Kingdom Lens - Photography & Design Studio
- **Category**: Photography
- **Short Description**: Professional photography tools with AI editing
- **Full Description**: [Use description from APP_STORE_DESCRIPTIONS.md]
- **Content Rating**: Everyone
- **Support Email**: support@kingdomcollective.pro

### **Bundle Identifiers:**
- **iOS**: com.kingdomcollective.lens
- **Android**: com.kingdomcollective.lens

---

## 👥 **Kingdom Circle**

### **App Store Metadata:**
- **App Name**: Kingdom Circle
- **Subtitle**: Community & Accountability
- **Category**: Social Networking
- **Keywords**: community, prayer, accountability, faith-based, groups, support, spiritual growth
- **Age Rating**: 4+
- **Support Email**: support@kingdomcollective.pro
- **Privacy Policy**: https://kingdomcollective.pro/privacy
- **Terms of Service**: https://kingdomcollective.pro/terms

### **Google Play Metadata:**
- **App Name**: Kingdom Circle - Community & Accountability
- **Category**: Social
- **Short Description**: Build meaningful connections through prayer and accountability
- **Full Description**: [Use description from APP_STORE_DESCRIPTIONS.md]
- **Content Rating**: Everyone
- **Support Email**: support@kingdomcollective.pro

### **Bundle Identifiers:**
- **iOS**: com.kingdomcollective.circle
- **Android**: com.kingdomcollective.circle

---

## 🎙️ **Kingdom Voice**

### **App Store Metadata:**
- **App Name**: Kingdom Voice
- **Subtitle**: Audio Content Creator
- **Category**: Music & Audio
- **Keywords**: podcasting, audio recording, voice-to-text, content creation, faith-based, transcription, audio editing
- **Age Rating**: 4+
- **Support Email**: support@kingdomcollective.pro
- **Privacy Policy**: https://kingdomcollective.pro/privacy
- **Terms of Service**: https://kingdomcollective.pro/terms

### **Google Play Metadata:**
- **App Name**: Kingdom Voice - Audio Content Creator
- **Category**: Music & Audio
- **Short Description**: Create podcasts, voice notes, and audio content with AI transcription
- **Full Description**: [Use description from APP_STORE_DESCRIPTIONS.md]
- **Content Rating**: Everyone
- **Support Email**: support@kingdomcollective.pro

### **Bundle Identifiers:**
- **iOS**: com.kingdomcollective.voice
- **Android**: com.kingdomcollective.voice

---

## 🚀 **Kingdom Launchpad**

### **App Store Metadata:**
- **App Name**: Kingdom Launchpad
- **Subtitle**: Business & Product Creator
- **Category**: Business
- **Keywords**: business, entrepreneurship, digital products, AI, faith-based, marketing, analytics, product creation
- **Age Rating**: 4+
- **Support Email**: support@kingdomcollective.pro
- **Privacy Policy**: https://kingdomcollective.pro/privacy
- **Terms of Service**: https://kingdomcollective.pro/terms

### **Google Play Metadata:**
- **App Name**: Kingdom Launchpad - Business & Product Creator
- **Category**: Business
- **Short Description**: Launch your digital products with AI-powered tools
- **Full Description**: [Use description from APP_STORE_DESCRIPTIONS.md]
- **Content Rating**: Everyone
- **Support Email**: support@kingdomcollective.pro

### **Bundle Identifiers:**
- **iOS**: com.kingdomcollective.launchpad
- **Android**: com.kingdomcollective.launchpad

---

## 📋 **Required Assets**

### **App Icons:**
- **iOS**: 1024x1024 PNG (required)
- **Android**: 512x512 PNG (adaptive icon)
- **Web**: 192x192 PNG (favicon)

### **Screenshots:**
- **iOS**: 6.7" iPhone (1290x2796), 6.5" iPhone (1242x2688), 5.5" iPhone (1242x2208)
- **Android**: 16:9 aspect ratio (1080x1920 minimum)
- **Web**: 1280x720 minimum

### **Screenshot Requirements:**
1. **Main feature showcase** - Highlight core functionality
2. **Faith Mode toggle** - Show dual-mode capability
3. **AI features** - Demonstrate AI-powered tools
4. **Community features** - Show social elements (where applicable)
5. **Analytics/Progress** - Display tracking and insights

---

## 🔒 **Privacy & Compliance**

### **Required Permissions:**
- **Camera**: For photo/video content creation
- **Microphone**: For audio recording and voice features
- **Photo Library**: For importing and saving content
- **Storage**: For saving user-generated content

### **Privacy Policy Requirements:**
- Data collection and usage
- User rights (access, deletion, portability)
- Third-party services
- Data retention policies
- Children's privacy (COPPA compliance)

### **Terms of Service Requirements:**
- User-generated content policies
- Prohibited content guidelines
- Intellectual property rights
- Limitation of liability
- Dispute resolution

---

## 🧪 **Test Accounts**

### **Apple App Store:**
- **Email**: testuser@kingdomcollective.pro
- **Password**: TestUser2024!
- **Instructions**: Use this account to explore all features

### **Google Play Store:**
- **Email**: testuser@kingdomcollective.pro
- **Password**: TestUser2024!
- **Instructions**: Use this account to explore all features

---

## 📱 **Build Configuration**

### **EAS Build Commands:**
```bash
# iOS Production Build
eas build -p ios --profile production

# Android Production Build
eas build -p android --profile production

# Web Static Export
npm run build && npm run export
```

### **Version Management:**
- **iOS**: Use buildNumber in app.json
- **Android**: Use versionCode in app.json
- **Web**: Use version in package.json

---

## ✅ **Compliance Checklist**

### **Apple App Store:**
- [ ] Unique bundle identifiers
- [ ] Proper permission descriptions
- [ ] 1024x1024 app icon
- [ ] Screenshots for all device sizes
- [ ] Privacy policy and terms links
- [ ] Age rating appropriate
- [ ] No restricted content
- [ ] App Tracking Transparency (if needed)

### **Google Play Store:**
- [ ] Unique package names
- [ ] Target API Level 34+
- [ ] Content rating appropriate
- [ ] Privacy policy and terms links
- [ ] App signing configured
- [ ] Accessibility labels added
- [ ] No device check bypass

### **General:**
- [ ] Test accounts created
- [ ] Support email configured
- [ ] Error handling implemented
- [ ] Accessibility features added
- [ ] User data deletion flow
- [ ] Offline functionality tested 