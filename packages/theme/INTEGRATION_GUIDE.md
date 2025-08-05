# 🎨 Theme Integration Guide

## 🚀 **Quick Start: Integrate Shared Theme into Your App**

### **Step 1: Update Your App's Tailwind Config**

Replace your current `tailwind.config.js` with:

```javascript
// kingdom-voice/tailwind.config.js
const { getTailwindConfig } = require("../../../packages/theme");

module.exports = getTailwindConfig("voice");
```

```javascript
// kingdom-circle/tailwind.config.js
const { getTailwindConfig } = require("../../../packages/theme");

module.exports = getTailwindConfig("circle");
```

```javascript
// kingdom-lens/tailwind.config.js
const { getTailwindConfig } = require("../../../packages/theme");

module.exports = getTailwindConfig("lens");
```

```javascript
// kingdom-clips/tailwind.config.js
const { getTailwindConfig } = require("../../../packages/theme");

module.exports = getTailwindConfig("clips");
```

```javascript
// kingdom-launchpad/tailwind.config.js
const { getTailwindConfig } = require("../../../packages/theme");

module.exports = getTailwindConfig("launchpad");
```

### **Step 2: Update Your Components**

#### **Before (Old Way)**

```jsx
// Old component with hardcoded colors
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Click me
</button>
```

#### **After (New Way)**

```jsx
// New component with shared theme
<button className="bg-kingdom-gold hover:bg-voice-accent text-kingdom-dark px-4 py-2 rounded">
  Record Voice
</button>
```

### **Step 3: Use App-Specific Features**

Each app gets its own accent colors and animations:

#### **Kingdom Voice (Purple Accents)**

```jsx
<button className="bg-kingdom-gold hover:bg-voice-accent animate-voice-pulse">
  Record Voice
</button>
```

#### **Kingdom Circle (Green Accents)**

```jsx
<button className="bg-kingdom-gold hover:bg-community-primary animate-community-glow">
  Join Community
</button>
```

#### **Kingdom Lens (Cyan Accents)**

```jsx
<button className="bg-kingdom-gold hover:bg-media-accent animate-lens-focus">
  Take Photo
</button>
```

#### **Kingdom Clips (Red Accents)**

```jsx
<button className="bg-kingdom-gold hover:bg-video-primary animate-recording-pulse">
  Start Recording
</button>
```

#### **Kingdom Launchpad (Amber Accents)**

```jsx
<button className="bg-kingdom-gold hover:bg-launch-primary animate-launch-bounce">
  Launch App
</button>
```

## 🎯 **Available Colors**

### **Shared Brand Colors (All Apps)**

- `kingdom-gold` - Primary brand color
- `kingdom-dark` - Dark background
- `kingdom-darker` - Darker background
- `kingdom-orange` - Secondary brand color
- `kingdom-gold-light` - Light gold
- `kingdom-orange-light` - Light orange

### **App-Specific Colors**

#### **Kingdom Voice**

- `voice-accent` - Purple accent
- `voice-secondary` - Secondary purple

#### **Kingdom Circle**

- `community-primary` - Green accent
- `community-secondary` - Secondary green

#### **Kingdom Lens**

- `media-accent` - Cyan accent
- `media-secondary` - Secondary cyan

#### **Kingdom Clips**

- `video-primary` - Red accent
- `video-secondary` - Secondary red

#### **Kingdom Launchpad**

- `launch-primary` - Amber accent
- `launch-secondary` - Secondary amber

## 🎬 **Available Animations**

### **Shared Animations (All Apps)**

- `animate-fade-in` - Fade in animation
- `animate-slide-up` - Slide up animation
- `animate-pulse-slow` - Slow pulse
- `animate-glow` - Glow effect

### **App-Specific Animations**

#### **Kingdom Voice**

- `animate-voice-pulse` - Voice pulse animation
- `animate-voice-wave` - Voice wave animation
- `animate-voice-recording` - Recording animation

#### **Kingdom Circle**

- `animate-community-glow` - Community glow
- `animate-community-pulse` - Community pulse
- `animate-community-connect` - Connect animation

#### **Kingdom Lens**

- `animate-lens-focus` - Lens focus animation
- `animate-lens-shutter` - Shutter animation
- `animate-lens-zoom` - Zoom animation

#### **Kingdom Clips**

- `animate-recording-pulse` - Recording pulse
- `animate-video-play` - Video play animation
- `animate-video-pause` - Video pause animation

#### **Kingdom Launchpad**

- `animate-launch-bounce` - Launch bounce
- `animate-launch-glow` - Launch glow
- `animate-launch-spin` - Launch spin

## 🔧 **Migration Examples**

### **Migrating Existing Components**

#### **Button Migration**

```jsx
// OLD
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Submit
</button>

// NEW
<button className="bg-kingdom-gold hover:bg-voice-accent text-kingdom-dark px-4 py-2 rounded">
  Submit
</button>
```

#### **Card Migration**

```jsx
// OLD
<div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
  <h3 className="text-white font-bold">Title</h3>
  <p className="text-gray-300">Content</p>
</div>

// NEW
<div className="bg-kingdom-darker border border-voice-accent/20 rounded-lg p-6">
  <h3 className="text-white font-bold">Title</h3>
  <p className="text-white/70">Content</p>
</div>
```

#### **Input Migration**

```jsx
// OLD
<input className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded" />

// NEW
<input className="bg-kingdom-dark border border-voice-accent/30 text-white px-4 py-2 rounded focus:border-voice-accent" />
```

## 🎨 **Design Patterns**

### **Consistent Brand Elements**

- Always use `kingdom-gold` for primary actions
- Use `kingdom-dark` for backgrounds
- Use `kingdom-darker` for cards and surfaces

### **App-Specific Elements**

- Use app accent colors for hover states
- Use app-specific animations for interactions
- Maintain app personality through layout and content

### **Typography**

- Use shared font families: `font-sans`, `font-display`, `font-body`
- Use consistent text colors: `text-white`, `text-white/70`, `text-white/60`

## 🚀 **Benefits After Migration**

### **Brand Consistency**

- ✅ All apps share Kingdom Collective brand colors
- ✅ Consistent typography and spacing
- ✅ Unified animation patterns
- ✅ Professional, cohesive brand experience

### **App Individuality**

- ✅ Each app has unique accent colors
- ✅ Custom animations for app-specific features
- ✅ Different layouts and component styles
- ✅ App-specific personality and purpose

### **Developer Experience**

- ✅ Shared design tokens reduce duplication
- ✅ Easy to maintain and update brand elements
- ✅ Flexible system allows for customization
- ✅ Consistent development experience across apps

## 📋 **Migration Checklist**

- [ ] Update `tailwind.config.js` to use shared theme
- [ ] Replace hardcoded colors with theme colors
- [ ] Update button styles to use brand colors
- [ ] Add app-specific accent colors for hover states
- [ ] Implement app-specific animations
- [ ] Update typography to use shared font families
- [ ] Test all components with new theme
- [ ] Verify brand consistency across app
- [ ] Ensure app-specific personality is maintained

## 🎉 **Result**

After migration, your app will:

- **Look like part of the Kingdom Collective family** (brand consistency)
- **Maintain its unique personality** (app-specific styling)
- **Be easier to maintain** (shared design tokens)
- **Scale better** (flexible theme system)

---

**Need Help?** Check the examples in `packages/theme/examples/` for component patterns!
