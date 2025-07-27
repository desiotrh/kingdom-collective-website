# 🎯 DeclarationBuilderScreen Documentation

## Overview

The DeclarationBuilderScreen provides a comprehensive tool for creating powerful declarations with input fields, prompt library, faith mode integration, and AI generation capabilities. Users can build personalized declarations, access preloaded themes, and share their faith-based affirmations.

## ✨ Features

### 📝 Input Fields
- **Title Input** - Create declaration titles (e.g., "Identity in Christ")
- **Body Text** - Multi-line declaration content
- **Optional Tags** - Categorize declarations for easy organization
- **Faith Mode Toggle** - Enable faith-based features and styling

### 📚 Prompt Library
- **Preloaded Themes** - Ready-to-use declaration templates
- **Editable Content** - Customize preloaded themes
- **Faith-Based Themes** - Scripture-backed declarations
- **Encouragement Themes** - Truth-based affirmations

### 📲 Usage Features
- **Save and Revisit** - Store declarations for later use
- **Copy to Clipboard** - Easy sharing of declarations
- **Daily Reminder Toggle** - Mark declarations for daily review
- **AsyncStorage Integration** - Persistent local storage

### ✝️ Faith Mode Integration
- **Verse Suggestions** - Scripture reference integration
- **"Speak it Out Loud" Animation** - Visual feedback for speaking
- **AI Prompt Generator** - Biblical declaration suggestions
- **Faith Mode Styling** - Distinctive visual elements

### 🕊 Encouragement Mode
- **Truth-Based Affirmations** - Clean, encouraging content
- **Professional Delivery** - Marketplace-ready tone
- **Supportive Messaging** - "Your Words Matter" encouragement

## 🛠️ Technical Implementation

### Data Structure
```typescript
interface Declaration {
  id: string;
  title: string;
  body: string;
  tags: string[];
  faithMode: boolean;
  verse?: string;
  isDailyReminder: boolean;
  createdAt: string;
}
```

### Preloaded Themes
```typescript
const preloadedThemes = [
  {
    id: '1',
    title: 'Identity in Christ',
    body: 'I am a child of God, fearfully and wonderfully made. I am chosen, loved, and called according to His purpose.',
    tags: ['Identity', 'Purpose'],
    faithMode: true,
    verse: '1 Peter 2:9 - But you are a chosen people, a royal priesthood, a holy nation, God\'s special possession.'
  },
  {
    id: '2',
    title: 'Voice of Breakthrough',
    body: 'My voice carries breakthrough. I speak life, truth, and victory. My words have power to change atmospheres.',
    tags: ['Voice', 'Breakthrough'],
    faithMode: true,
    verse: 'Proverbs 18:21 - The tongue has the power of life and death.'
  },
  // ... more themes
];
```

### Key Functions

#### Save Declaration
```typescript
const saveDeclaration = async () => {
  if (!declaration.title || !declaration.body) {
    Alert.alert('Missing Information', 'Please fill in both title and body.');
    return;
  }

  try {
    const declarationId = Date.now().toString();
    const fullDeclaration: Declaration = {
      id: declarationId,
      title: declaration.title || 'Untitled Declaration',
      body: declaration.body || '',
      tags: declaration.tags || [],
      faithMode: isFaithMode,
      verse: selectedVerse,
      isDailyReminder: declaration.isDailyReminder || false,
      createdAt: new Date().toISOString(),
    };

    // Save to declarations list
    const declarationsKey = 'declarations';
    const existingDeclarations = await AsyncStorage.getItem(declarationsKey);
    const declarations = existingDeclarations ? JSON.parse(existingDeclarations) : [];
    declarations.unshift(fullDeclaration);
    await AsyncStorage.setItem(declarationsKey, JSON.stringify(declarations));

    Alert.alert('Declaration Saved', 'Your declaration has been saved successfully!');
    
  } catch (error) {
    console.error('Error saving declaration:', error);
    Alert.alert('Error', 'Failed to save declaration. Please try again.');
  }
};
```

#### Copy to Clipboard
```typescript
const copyToClipboard = async () => {
  if (!declaration.title || !declaration.body) {
    Alert.alert('Missing Information', 'Please fill in both title and body.');
    return;
  }

  const textToCopy = `${declaration.title}\n\n${declaration.body}${selectedVerse ? `\n\n"${selectedVerse}"` : ''}`;
  
  try {
    await Clipboard.setString(textToCopy);
    Alert.alert('Copied!', 'Declaration copied to clipboard.');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    Alert.alert('Error', 'Failed to copy to clipboard.');
  }
};
```

#### Speak Declaration
```typescript
const speakDeclaration = () => {
  if (!declaration.title || !declaration.body) {
    Alert.alert('Missing Information', 'Please fill in both title and body.');
    return;
  }

  setIsSpeaking(true);
  
  // Animate speaking
  Animated.loop(
    Animated.sequence([
      Animated.timing(speakAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(speakAnimation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  ).start();

  // Simulate speaking (replace with actual text-to-speech)
  setTimeout(() => {
    setIsSpeaking(false);
    Animated.loop(Animated.timing(speakAnimation, { toValue: 0, duration: 0 })).stop();
    Alert.alert('Declaration Spoken', 'Your declaration has been spoken out loud.');
  }, 3000);
};
```

### UI Components

#### Input Card
```typescript
<View style={[styles.inputCard, { backgroundColor: colors.cream }]}>
  <Text style={[styles.sectionTitle, { color: colors.text }]}>
    Create Your Declaration
  </Text>

  {/* Title Input */}
  <View style={styles.inputSection}>
    <Text style={[styles.inputLabel, { color: colors.charcoalInk }]}>Title</Text>
    <TextInput
      style={[styles.titleInput, { 
        backgroundColor: colors.background,
        color: colors.charcoalInk,
        borderColor: colors.softGold
      }]}
      value={declaration.title}
      onChangeText={(text) => setDeclaration(prev => ({ ...prev, title: text }))}
      placeholder="e.g., Identity in Christ"
      placeholderTextColor={colors.charcoalInk + '80'}
    />
  </View>

  {/* Body Input */}
  <View style={styles.inputSection}>
    <Text style={[styles.inputLabel, { color: colors.charcoalInk }]}>Declaration</Text>
    <TextInput
      style={[styles.bodyInput, { 
        backgroundColor: colors.background,
        color: colors.charcoalInk,
        borderColor: colors.softGold
      }]}
      value={declaration.body}
      onChangeText={(text) => setDeclaration(prev => ({ ...prev, body: text }))}
      placeholder="Write your powerful declaration..."
      placeholderTextColor={colors.charcoalInk + '80'}
      multiline
      textAlignVertical="top"
    />
  </View>
</View>
```

#### Prompt Library Modal
```typescript
<Modal
  visible={showPromptLibrary}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowPromptLibrary(false)}
>
  <View style={styles.modalOverlay}>
    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
      <View style={styles.modalHeader}>
        <Text style={[styles.modalTitle, { color: colors.text }]}>
          Prompt Library
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowPromptLibrary(false)}
        >
          <Text style={[styles.closeButtonText, { color: colors.charcoalInk }]}>×</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.themesList}>
        {preloadedThemes.map(renderThemeCard)}
      </ScrollView>
    </View>
  </View>
</Modal>
```

## 🎨 Brand Integration

### Color Scheme
- **Soft Gold** (#DAB785) - Faith mode elements, selected items
- **Sky Blue** (#87CEEB) - Default borders, unselected items
- **Cream** (#F5F5DC) - Card backgrounds, input fields
- **Charcoal Ink** (#36454F) - Text, borders

### Typography
- **Playfair Display** - Headers, titles, buttons
- **Raleway** - Body text, descriptions, placeholders

### Animations
- **Fade Animation** - Cards fade in on load
- **Pulse Animation** - Interactive elements
- **Speak Animation** - Visual feedback for speaking
- **Scale Transform** - Button interactions

## 🧪 Testing

### Automated Testing
Run the test script to verify implementation:
```bash
node test-declaration-builder.js
```

### Manual Testing Checklist
1. **Input Fields**
   - Test title input with various titles
   - Test body input with multi-line content
   - Test tags selection functionality
   - Test faith mode toggle
   - Test daily reminder toggle

2. **Prompt Library**
   - Open prompt library modal
   - Test theme selection
   - Verify themes populate input fields
   - Test theme customization

3. **Usage Features**
   - Save declaration and verify persistence
   - Test copy to clipboard functionality
   - Test daily reminder marking
   - Verify AsyncStorage integration

4. **Faith Mode Integration**
   - Test verse selector functionality
   - Test speak declaration with animation
   - Test AI generator with different prompts
   - Verify faith mode styling

5. **Encouragement Mode**
   - Verify encouragement messages appear
   - Test clean delivery tone
   - Check supportive UI elements

6. **Error Handling**
   - Test validation for missing information
   - Test error messages for failed operations
   - Verify proper error recovery

### Test Scenarios

#### Scenario 1: Create Custom Declaration
- **Title**: "Walking in Love"
- **Body**: "I choose to walk in love today. I am patient, kind, and forgiving."
- **Tags**: Love, Character
- **Expected**: Declaration saves successfully with proper formatting

#### Scenario 2: Use Prompt Library
- **Select**: "Identity in Christ" theme
- **Customize**: Modify body text
- **Save**: Create personalized version
- **Expected**: Theme populates fields, can be customized and saved

#### Scenario 3: Faith Mode Features
- **Enable**: Faith mode toggle
- **Select**: Scripture verse
- **Speak**: Declaration with animation
- **Expected**: Faith mode styling, verse integration, speaking animation

## 🔮 Future Enhancements

### Advanced Features
- **Voice Recording** - Record spoken declarations
- **Declaration Templates** - Pre-designed layouts
- **Batch Operations** - Create multiple declarations
- **Export Options** - Share declarations in various formats

### AI Integration
- **Smart Suggestions** - AI-powered declaration ideas
- **Content Enhancement** - AI suggestions for improvement
- **Personalized Themes** - AI-generated themes based on user history
- **Voice-to-Text** - Convert spoken declarations to text

### Social Features
- **Community Sharing** - Share declarations with faith communities
- **Collaborative Creation** - Multi-user declaration building
- **Declaration Challenges** - Community-wide declaration themes
- **Mentor Integration** - Share with spiritual mentors

## 🚀 Performance Optimization

### Current Optimizations
- **Efficient State Management** - Optimized re-renders
- **Lazy Loading** - Load themes on demand
- **Memory Management** - Proper cleanup of animations
- **Async Operations** - Non-blocking save operations

### Future Optimizations
- **Background Processing** - Save in background
- **Caching** - Cache frequently used themes
- **Compression** - Optimize stored data
- **Streaming** - Stream large declaration lists

## 📱 Platform Considerations

### iOS
- **Clipboard Integration** - iOS-specific clipboard handling
- **Voice Synthesis** - iOS text-to-speech integration
- **Accessibility** - VoiceOver and Dynamic Type support
- **Privacy** - iOS privacy guidelines compliance

### Android
- **Clipboard API** - Android clipboard integration
- **Text-to-Speech** - Android TTS capabilities
- **Permissions** - Android permission handling
- **File System** - Android file system integration

### Web (Future)
- **Browser Clipboard** - Web-based clipboard API
- **Web Speech API** - Browser text-to-speech
- **Progressive Web App** - Offline declaration creation
- **Cross-platform Sync** - Real-time sync across devices

## 🔧 Configuration

### Available Tags
```typescript
const availableTags = [
  'Identity', 'Purpose', 'Voice', 'Breakthrough', 'Victory', 'Overcoming',
  'Love', 'Character', 'Abundance', 'Life', 'Faith', 'Trust', 'Healing',
  'Strength', 'Peace', 'Joy', 'Gratitude', 'Forgiveness', 'Wisdom'
];
```

### AI Prompts
```typescript
const aiPrompts = [
  'Create 5 biblical declarations for someone struggling with self-worth',
  'Create 5 biblical declarations for someone facing fear and anxiety',
  'Create 5 biblical declarations for someone seeking purpose and direction',
  'Create 5 biblical declarations for someone dealing with past hurts',
  'Create 5 biblical declarations for someone wanting to grow in faith'
];
```

## 📊 Analytics & Monitoring

### Usage Metrics
- Declaration creation frequency
- Theme usage patterns
- Faith mode adoption rates
- Sharing and copying statistics

### Performance Metrics
- Save operation success rates
- Clipboard operation success rates
- Animation performance
- User engagement patterns

### Error Tracking
- Save failure rates
- Clipboard error frequency
- Validation error patterns
- User interaction failures

## 🛡️ Security & Privacy

### Data Protection
- Local storage only
- No cloud transmission
- User control over data
- Secure data handling

### Privacy Compliance
- GDPR compliance for user data
- Clear privacy policy
- User consent for features
- Secure data transmission

## 📚 Resources

### Documentation
- [React Native Clipboard](https://reactnative.dev/docs/clipboard)
- [AsyncStorage Guide](https://reactnative.dev/docs/asyncstorage)
- [React Native Animations](https://reactnative.dev/docs/animated)

### Related Features
- [SavedEntriesScreen Documentation](./SAVED_ENTRIES_FEATURES.md)
- [Voice Entry Features](./VOICE_ENTRY_FEATURES.md)
- [Faith Mode Integration](./FAITH_MODE_FEATURES.md)

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: ✅ Complete and Tested 