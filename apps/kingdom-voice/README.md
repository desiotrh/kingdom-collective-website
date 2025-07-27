# Kingdom Voice - Journaling App

A warm, intimate journaling app designed for reflection, healing, and spiritual growth.

## 🎨 Brand & Design

### Colors
- **Soft Gold**: #DAB785
- **Sky Blue**: #CDE7F0  
- **Cream**: #FAF5EF
- **Charcoal Ink**: #3B3B3B

### Fonts
- **Headers**: Playfair Display
- **Body**: Raleway Light

### Design Philosophy
- Warm, intimate, handwritten feel
- Breathable layouts with soft transitions
- Rounded cards and pastel highlights
- Underlined section headers

## 📱 Screens

### 1. JournalHomeScreen
- Daily devotional card (Faith Mode)
- Quick action buttons for common tasks
- Recent entries preview
- Encouragement messages
- Faith mode cross watermark

### 2. NewEntryScreen  
- Rich text editor with warm styling
- Mood tracker with emoji selection
- Writing prompts and tips
- Faith mode scripture cards
- Auto-save functionality

### 3. SavedEntriesScreen
- Grid layout of saved entries
- Filter by all/faith/recent
- Entry stats and insights
- Faith entry badges
- Export and sharing options

### 4. DreamTrackerScreen
- Dream logging with categories
- Lucid dream tracking
- Dream interpretation cards
- Dream journaling tips
- Mood and emotion tracking

### 5. SettingsScreen
- Faith Mode toggle
- Encouragement Mode toggle
- Notification preferences
- Data export options
- Privacy and support links

## ✝️ Faith Mode Features

### Faith Mode ON:
- Cross watermark in background
- Daily devotional cards
- Scripture integration
- Faith entry badges
- Kingdom-focused prompts

### Encouragement Mode (Default):
- "Write what you needed to hear"
- "This space is for clarity and healing"
- Encouraging prompts and messages
- Healing-focused journaling tips

## 🛠 Technical Implementation

### Context & State Management
- `FaithModeContext` for faith/encouragement modes
- AsyncStorage for local data persistence
- Ready for Firestore cloud sync

### Navigation
- Bottom tab navigation
- Smooth transitions between screens
- Faith mode visual overlays

### Styling
- Custom color palette implementation
- Brand font loading (Playfair Display, Raleway)
- Responsive design with proper spacing
- Shadow and elevation effects

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on device/simulator:
   ```bash
   npm run ios
   # or
   npm run android
   ```

## 📋 Testing Checklist

- [ ] Navigation between all screens
- [ ] Faith Mode toggle and visual changes
- [ ] Encouragement Mode messages
- [ ] Brand fonts loading correctly
- [ ] Color palette applied consistently
- [ ] Touch interactions and haptics
- [ ] Text input and form functionality
- [ ] Modal dialogs and overlays

## 🔮 Next Steps

1. **Data Persistence**: Implement AsyncStorage for local saving
2. **Cloud Sync**: Add Firestore integration
3. **Rich Text**: Enhanced text editor with formatting
4. **Analytics**: Track journaling habits and insights
5. **Export**: PDF and text export functionality
6. **Backup**: Cloud backup and restore features
7. **Themes**: Additional color themes and customization
8. **Sharing**: Share entries (with privacy controls)
9. **Reminders**: Smart journaling reminders
10. **Community**: Optional faith community features

## 🎯 Core Values

- **Intimacy**: Personal, private journaling space
- **Healing**: Focus on emotional and spiritual growth  
- **Faith**: Optional faith-based elements and scripture
- **Encouragement**: Positive, uplifting messaging
- **Simplicity**: Clean, distraction-free interface

---

Built with ❤️ for the Kingdom Studios ecosystem
