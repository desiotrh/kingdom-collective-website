import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { KingdomColors } from '../constants/KingdomColors';
import { useDualMode } from '../contexts/DualModeContext';

const VideoRecordingScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  const navigation = useNavigation();

  const [isRecording, setIsRecording] = useState(false);

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "🙏 Share God's goodness through your authentic story",
      "✨ Let your faith shine through every frame",
      "💝 Create content that blesses and encourages others",
      "🌟 Use video to share Kingdom wisdom",
    ];
    
    const encouragementPrompts = [
      "🚀 Your story has the power to inspire others",
      "💪 Share your journey and encourage breakthrough",
      "🌈 Create content that lifts others up",
      "✨ Your authentic voice matters - share it boldly",
    ];
    
    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const startRecording = () => {
    setIsRecording(true);
    Alert.alert(
      'Recording Started',
      'Camera integration coming soon! This will include advanced video recording with faith/encouragement overlays.'
    );
  };

  const stopRecording = () => {
    setIsRecording(false);
    Alert.alert(
      'Recording Stopped',
      'Your video would be saved to the gallery with enhancement options.'
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Video Recording
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>

        {/* Camera Preview Placeholder */}
        <View style={[styles.cameraContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.cameraPlaceholder}>
            <Ionicons name="videocam" size={64} color={colors.textSecondary} />
            <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
              Camera integration coming soon!
            </Text>
            <Text style={[styles.placeholderSubtext, { color: colors.textSecondary }]}>
              This will include advanced video recording,{'\n'}
              faith/encouragement overlays, and editing tools.
            </Text>
          </View>
        </View>

        {/* Recording Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.flipButton, { backgroundColor: colors.surface }]}
          >
            <Ionicons name="camera-reverse" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.recordButton,
              { 
                backgroundColor: isRecording ? colors.error : colors.accent,
                borderColor: colors.text,
              }
            ]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons 
              name={isRecording ? "stop" : "radio-button-on"} 
              size={32} 
              color="#fff" 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.flashButton, { backgroundColor: colors.surface }]}
          >
            <Ionicons name="flash-off" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Video Enhancement Options */}
        <View style={styles.enhancementSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Video Enhancements (Coming Soon)
          </Text>
          
          <View style={styles.enhancementGrid}>
            <View style={[styles.enhancementCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="text" size={24} color={colors.accent} />
              <Text style={[styles.enhancementTitle, { color: colors.text }]}>
                Auto Subtitles
              </Text>
              <Text style={[styles.enhancementDescription, { color: colors.textSecondary }]}>
                AI-generated captions
              </Text>
            </View>

            <View style={[styles.enhancementCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="musical-notes" size={24} color={colors.accent} />
              <Text style={[styles.enhancementTitle, { color: colors.text }]}>
                Background Music
              </Text>
              <Text style={[styles.enhancementDescription, { color: colors.textSecondary }]}>
                Royalty-free tracks
              </Text>
            </View>

            <View style={[styles.enhancementCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="cut" size={24} color={colors.accent} />
              <Text style={[styles.enhancementTitle, { color: colors.text }]}>
                Smart Editing
              </Text>
              <Text style={[styles.enhancementDescription, { color: colors.textSecondary }]}>
                Auto trim & split
              </Text>
            </View>

            <View style={[styles.enhancementCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="color-palette" size={24} color={colors.accent} />
              <Text style={[styles.enhancementTitle, { color: colors.text }]}>
                Filters & Effects
              </Text>
              <Text style={[styles.enhancementDescription, { color: colors.textSecondary }]}>
                Professional filters
              </Text>
            </View>

            <View style={[styles.enhancementCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="layers" size={24} color={colors.accent} />
              <Text style={[styles.enhancementTitle, { color: colors.text }]}>
                Text Overlays
              </Text>
              <Text style={[styles.enhancementDescription, { color: colors.textSecondary }]}>
                Bible verses & quotes
              </Text>
            </View>

            <View style={[styles.enhancementCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="crop" size={24} color={colors.accent} />
              <Text style={[styles.enhancementTitle, { color: colors.text }]}>
                Multi-Format
              </Text>
              <Text style={[styles.enhancementDescription, { color: colors.textSecondary }]}>
                Square, vertical, horizontal
              </Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={[styles.tipsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.tipsTitle, { color: colors.text }]}>
            📹 Video Recording Tips
          </Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            • Record in good lighting for best quality{'\n'}
            • Keep videos under 60 seconds for better engagement{'\n'}
            • Tell a story with clear beginning, middle, and end{'\n'}
            • Use captions to make content accessible{'\n'}
            • Test your audio levels before recording{'\n'}
            • Consider your background and framing
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  cameraContainer: {
    height: 300,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
  },
  flashButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enhancementSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  enhancementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  enhancementCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  enhancementTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  enhancementDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  featureCard: {
    padding: 16,
    borderRadius: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default VideoRecordingScreen;
