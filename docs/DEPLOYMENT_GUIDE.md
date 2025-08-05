# 🚀 Kingdom Apps Deployment Guide

## ✅ STEP 1: Web Apps (Next.js/Vercel) Setup Complete

All web apps have been configured with:

- ✅ Next.js 15.4.4
- ✅ Static export configuration (`output: "export"`)
- ✅ Vercel deployment files (`vercel.json`)
- ✅ Unoptimized images for static export

### Web Apps Ready for Deployment:

- `kingdom-clips` → clips.kingdomcollective.pro
- `kingdom-lens` → lens.kingdomcollective.pro
- `kingdom-circle` → circle.kingdomcollective.pro
- `kingdom-launchpad` → launchpad.kingdomcollective.pro
- `kingdom-voice` → voice.kingdomcollective.pro

## ✅ STEP 2: Mobile Apps (Expo) Setup Complete

All mobile apps have been configured with:

- ✅ Proper bundle identifiers for iOS/Android
- ✅ Production API URLs
- ✅ Expo Router configuration
- ✅ Static web output capability

### Mobile Apps Ready for Deployment:

- `apps/kingdom-clips` → pro.kingdomcollective.clips
- `apps/kingdom-lens` → pro.kingdomcollective.lens
- `apps/kingdom-circle` → pro.kingdomcollective.circle
- `apps/kingdom-launchpad` → pro.kingdomcollective.launchpad
- `apps/kingdom-voice` → pro.kingdomcollective.voice

## 🌐 WEB DEPLOYMENT COMMANDS

### For each web app, run:

```bash
# Navigate to web app directory
cd kingdom-clips  # (or lens, circle, launchpad, voice)

# Link to Vercel project
vercel link

# Deploy to production
vercel deploy --prod
```

### Subdomain Configuration:

- **clips.kingdomcollective.pro** → kingdom-clips
- **lens.kingdomcollective.pro** → kingdom-lens
- **circle.kingdomcollective.pro** → kingdom-circle
- **voice.kingdomcollective.pro** → kingdom-voice
- **launchpad.kingdomcollective.pro** → kingdom-launchpad

## 📱 MOBILE DEPLOYMENT COMMANDS

### For each mobile app, run:

```bash
# Navigate to mobile app directory
cd apps/kingdom-clips  # (or lens, circle, launchpad, voice)

# Install EAS CLI
npx expo install eas-cli

# Configure EAS build
eas build:configure

# Build for Android
eas build -p android

# Build for iOS
eas build -p ios

# Submit to stores (when ready)
eas submit -p android
eas submit -p ios
```

## 🔧 Environment Configuration

### Production API URLs:

All apps are configured to use: `https://api.kingdomcollective.pro`

### Environment Files Created:

- `apps/kingdom-clips/.env.production`
- `apps/kingdom-lens/.env.production`
- `apps/kingdom-circle/.env.production`
- `apps/kingdom-launchpad/.env.production`
- `apps/kingdom-voice/.env.production`

## 🧪 Validation Checklist

### Web Apps:

- [ ] Vercel deployment successful
- [ ] Subdomain accessible
- [ ] Login functionality works
- [ ] Content creation works
- [ ] Settings screen accessible

### Mobile Apps:

- [ ] EAS builds successful
- [ ] APK/IPA files generated
- [ ] App installs on devices
- [ ] Login functionality works
- [ ] Content creation works
- [ ] Settings screen accessible

## 📋 Quick Deployment Script

Run this PowerShell script to create all environment files:

```powershell
.\deploy-setup.ps1
```

## 🎯 Next Steps

1. **Deploy web apps to Vercel** using the commands above
2. **Build mobile apps** using EAS
3. **Test both web and mobile** versions
4. **Submit mobile apps** to App Store/Play Store
5. **Update main website** with links to subdomains

## 🔗 Integration Points

All apps are configured to use the unified API at `https://api.kingdomcollective.pro` for:

- User authentication
- Content management
- Data synchronization
- Analytics tracking

---

**Status**: ✅ All apps configured for dual deployment (web + mobile)
**Next Action**: Run deployment commands for each app
