# Kingdom Collective - Complete Project Structure

## 🏗️ Project Overview

This is a comprehensive monorepo containing all Kingdom Collective applications, tools, and resources. The project has been organized for maximum clarity and maintainability.

## 📁 Project Structure

```
Kingdom Studios App/
├── 📱 kingdom-website/              # Main website (Next.js)
├── 📱 kingdom-studios/              # Main mobile app (React Native/Expo)
├── 🔧 kingdom-studios-backend/      # Backend API (Express.js)
├── 📱 kingdom-studios-app/          # Alternative app version
├── 🤖 ai-bots/                      # AI bot implementations
├── 📱 apps/                         # Individual app implementations
├── 📦 packages/                     # Shared packages and libraries
├── 📚 docs/                         # Documentation and scripts
├── 🎨 assets/                       # Images, videos, media files
├── ⚙️ scripts/                      # Build and deployment scripts
├── ⚙️ config/                       # Configuration files
└── 📄 [Root config files]
```

## 🚀 Quick Start

### Website Development

```bash
cd kingdom-website
npm install
npm run dev
```

### Mobile App Development

```bash
cd kingdom-studios
npm install
npx expo start
```

### Backend Development

```bash
cd kingdom-studios-backend
npm install
npm start
```

## 📱 Applications

### Main Applications

- **kingdom-website**: Next.js website with AI bots and app showcases
- **kingdom-studios**: React Native mobile app (main version)
- **kingdom-studios-backend**: Express.js backend API

### Individual Apps (in `apps/` directory)

- **kingdom-voice**: Voice recording and devotional app
- **kingdom-launchpad**: App launcher and management
- **kingdom-circle**: Community and social features
- **kingdom-lens**: Photo and media sharing
- **kingdom-clips**: Video and content creation

### AI Bots (in `ai-bots/` directory)

- **sales-bot**: Sales automation chatbot
- **customer-support**: Customer service bot
- **faith-bot**: Faith-based conversation bot
- **onboarding-bot**: User onboarding assistant
- **lead-gen**: Lead generation bot
- **job-app-bot**: Job application assistant
- **course-explainer**: Educational content bot
- **booking-bot**: Appointment scheduling bot
- **enhanced-sales-bot**: Advanced sales automation

## 📦 Shared Packages (in `packages/` directory)

- **api**: Shared API client
- **admin-dashboard**: Admin interface components
- **client**: Frontend client utilities
- **server**: Backend server utilities
- **hooks**: React hooks
- **ui**: UI components
- **constants**: Shared constants
- **theme**: Design system and theming

## 📚 Documentation

All documentation is organized in the `docs/` directory:

- Setup guides
- Implementation documentation
- API documentation
- Deployment guides
- AI bot scripts and templates

## 🎨 Assets

All media files are organized in the `assets/` directory:

- Logo files
- Icons and images
- Video backgrounds
- App store assets

## ⚙️ Scripts

Build and deployment scripts are in the `scripts/` directory:

- PowerShell scripts for Windows
- Shell scripts for Unix/Linux
- Deployment automation
- Environment setup

## 🔧 Configuration

Important configuration files remain in the root:

- `package.json`: Root package configuration
- `vercel.json`: Vercel deployment config
- `eas.json`: Expo Application Services config
- `app.config.js`: App configuration
- `tsconfig.json`: TypeScript configuration

## 🚀 Deployment

### Website Deployment

```bash
cd kingdom-website
npm run build
# Deploy to Vercel
```

### Mobile App Deployment

```bash
cd kingdom-studios
eas build --platform all
eas submit
```

### Backend Deployment

```bash
cd kingdom-studios-backend
npm run deploy
```

## 🔄 Development Workflow

1. **Feature Development**: Work in the appropriate app directory
2. **Shared Code**: Use packages in `packages/` for shared functionality
3. **Documentation**: Update docs in `docs/` directory
4. **Assets**: Add media files to `assets/` directory
5. **Deployment**: Use scripts in `scripts/` directory

## 📋 Project Status

✅ **Website**: Fully functional with AI bots and app showcases
✅ **Mobile App**: React Native app with all features
✅ **Backend**: Express.js API with unified authentication
✅ **AI Bots**: Multiple specialized chatbots
✅ **Individual Apps**: Complete implementations in apps/
✅ **Documentation**: Comprehensive guides and scripts
✅ **Assets**: All media files organized
✅ **Scripts**: Build and deployment automation

## 🤝 Contributing

1. Work in the appropriate directory for your changes
2. Update documentation in `docs/` if needed
3. Use shared packages for common functionality
4. Follow the established project structure
5. Test all components before committing

## 📞 Support

For questions or issues:

- Check the `docs/` directory for guides
- Review the individual app README files
- Contact the development team

---

**Last Updated**: August 2025
**Project Status**: Production Ready
**Organization**: Complete ✅
