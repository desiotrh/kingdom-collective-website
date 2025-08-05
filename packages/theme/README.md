# Kingdom Collective Design System

## 🎨 **Design Philosophy: Consistency ≠ Sameness**

This design system provides **shared brand elements** while allowing each app to maintain its **unique personality and style**.

## 🏗️ **How It Works**

### **Shared Elements (Consistency)**

- ✅ **Brand Colors**: Kingdom Collective brand colors (`kingdom-gold`, `kingdom-dark`, etc.)
- ✅ **Typography**: Consistent font families and sizing
- ✅ **Spacing**: Unified spacing system
- ✅ **Animations**: Shared animation patterns
- ✅ **Design Tokens**: Common variables and utilities

### **App-Specific Elements (Individuality)**

- 🎯 **Layout**: Unique layouts and component arrangements
- 🎯 **Component Styles**: Custom button styles, card designs, etc.
- 🎯 **App-Specific Features**: Specialized UI patterns for each app's purpose
- 🎯 **Content**: Different content and functionality

## 📱 **App-Specific Themes**

### **Kingdom Voice** 🎤

```javascript
// Voice-specific theme with purple accents
import { getAppTheme } from "@kingdom-collective/theme";

const voiceTheme = getAppTheme("voice");
// Uses: kingdom-gold (brand) + voice-accent (purple) + voice-specific animations
```

**Personality**: Audio-focused with purple accents for voice features

### **Kingdom Circle** 👥

```javascript
// Community-focused theme with green accents
const circleTheme = getAppTheme("circle");
// Uses: kingdom-gold (brand) + community-primary (green) + community animations
```

**Personality**: Community-focused with green accents for social features

### **Kingdom Lens** 📸

```javascript
// Media-focused theme with cyan accents
const lensTheme = getAppTheme("lens");
// Uses: kingdom-gold (brand) + media-accent (cyan) + lens-specific animations
```

**Personality**: Photo/media focused with cyan accents for visual content

### **Kingdom Clips** 🎬

```javascript
// Video-focused theme with red accents
const clipsTheme = getAppTheme("clips");
// Uses: kingdom-gold (brand) + video-primary (red) + recording animations
```

**Personality**: Video/content creation with red accents for recording

### **Kingdom Launchpad** 🚀

```javascript
// Launcher-focused theme with amber accents
const launchpadTheme = getAppTheme("launchpad");
// Uses: kingdom-gold (brand) + launch-primary (amber) + launch animations
```

**Personality**: App launcher with amber accents for launching actions

## 🔧 **Implementation Examples**

### **1. Using Shared Theme in an App**

```javascript
// In kingdom-voice/tailwind.config.js
const { getAppTheme } = require("@kingdom-collective/theme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      ...getAppTheme("voice"), // Gets voice-specific theme
      // Add app-specific customizations
      colors: {
        ...getAppTheme("voice").colors,
        "voice-special": "#your-custom-color",
      },
    },
  },
};
```

### **2. Component Using Shared + App-Specific Styles**

```jsx
// In any app component
function VoiceButton() {
  return (
    <button
      className="
      bg-kingdom-gold text-kingdom-dark    // Shared brand colors
      bg-voice-accent hover:bg-voice-secondary // App-specific colors
      animate-voice-pulse                   // App-specific animation
      rounded-lg px-4 py-2                 // App-specific styling
    "
    >
      Record Voice
    </button>
  );
}
```

### **3. Creating Custom App Theme**

```javascript
// In your app's theme configuration
import { createTheme } from "@kingdom-collective/theme";

const myAppTheme = createTheme({
  colors: {
    "my-app-primary": "#your-color",
    "my-app-secondary": "#your-color",
  },
  animation: {
    "my-app-special": "myAppSpecial 1s ease-in-out",
  },
});
```

## 🎯 **Benefits**

### **For Brand Consistency**

- ✅ All apps share Kingdom Collective brand colors
- ✅ Consistent typography and spacing
- ✅ Unified animation patterns
- ✅ Professional, cohesive brand experience

### **For App Individuality**

- ✅ Each app has unique accent colors
- ✅ Custom animations for app-specific features
- ✅ Different layouts and component styles
- ✅ App-specific personality and purpose

### **For Development**

- ✅ Shared design tokens reduce duplication
- ✅ Easy to maintain and update brand elements
- ✅ Flexible system allows for customization
- ✅ Consistent development experience across apps

## 🚀 **Getting Started**

1. **Install the theme package**:

   ```bash
   npm install @kingdom-collective/theme
   ```

2. **Configure your app's Tailwind**:

   ```javascript
   // tailwind.config.js
   const { getAppTheme } = require("@kingdom-collective/theme");

   module.exports = {
     content: ["./src/**/*.{js,ts,jsx,tsx}"],
     theme: {
       extend: getAppTheme("your-app-name"),
     },
   };
   ```

3. **Use in your components**:
   ```jsx
   // Mix shared and app-specific styles
   <div className="bg-kingdom-gold text-kingdom-dark bg-your-app-accent">
     Your content
   </div>
   ```

## 📋 **Available Themes**

- `voice` - Kingdom Voice (purple accents)
- `circle` - Kingdom Circle (green accents)
- `lens` - Kingdom Lens (cyan accents)
- `clips` - Kingdom Clips (red accents)
- `launchpad` - Kingdom Launchpad (amber accents)

## 🎨 **Color Palette**

### **Shared Brand Colors**

- `kingdom-gold` - Primary brand color
- `kingdom-dark` - Dark background
- `kingdom-orange` - Secondary brand color
- `kingdom-navy` - Dark navy

### **App-Specific Colors**

Each app gets its own accent colors while maintaining brand consistency.

---

**Result**: Each app looks like part of the Kingdom Collective family while maintaining its unique personality and purpose! 🎉
