import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';

export default function LensHomeScreen() {
  const { faithMode, encouragementMode } = useFaithMode();
  const theme = LightTheme; // For now, we'll use light theme
  const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

  const tools = [
    {
      id: 'mockup',
      title: 'Mockup Canvas',
      subtitle: 'Design & overlay tools',
      icon: '🎨',
      route: '/mockup-canvas',
    },
    {
      id: 'overlay',
      title: 'Overlay Builder',
      subtitle: 'Create custom overlays',
      icon: '✨',
      route: '/overlay-builder',
    },
    {
      id: 'planner',
      title: 'Photo Planner',
      subtitle: 'Plan your shoots',
      icon: '📅',
      route: '/photo-planner',
    },
    {
      id: 'sun',
      title: 'Sun Tracker',
      subtitle: 'Golden hour calculator',
      icon: '☀️',
      route: '/sun-tracker',
    },
    {
      id: 'business',
      title: 'Business Dashboard',
      subtitle: 'Track your photography business',
      icon: '📊',
      route: '/business-dashboard',
    },
    {
      id: 'invoice',
      title: 'Invoice Manager',
      subtitle: 'Create & send invoices',
      icon: '💰',
      route: '/invoice-manager',
    },
    {
      id: 'camera',
      title: 'Camera Settings',
      subtitle: 'Optimize your camera',
      icon: '📷',
      route: '/camera-settings',
    },
    {
      id: 'pose',
      title: 'Pose Prompts',
      subtitle: 'Get creative inspiration',
      icon: '👥',
      route: '/pose-prompts',
    },
  ];

  const getWelcomeMessage = () => {
    if (faithMode) {
      return 'Capture His light in every frame';
    } else if (encouragementMode) {
      return 'Capture identity, not perfection';
    }
    return 'Your creative vision, elevated';
  };

  const getSubtitle = () => {
    if (faithMode) {
      return 'Photograph with purpose and praise';
    } else if (encouragementMode) {
      return 'Your unique perspective matters';
    }
    return 'Professional tools for creative photographers';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.watermark, { color: theme.colors.primary }]}>
            {faithTheme.watermark}
          </Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Kingdom Lens
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {getSubtitle()}
          </Text>
        </View>

        {/* Welcome Message */}
        <View style={[styles.welcomeCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
            {getWelcomeMessage()}
          </Text>
          {faithMode && (
            <Text style={[styles.faithOverlay, { color: theme.colors.primary }]}>
              {faithTheme.overlayText}
            </Text>
          )}
        </View>

        {/* Tools Grid */}
        <View style={styles.toolsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Creative Tools
          </Text>
          <View style={styles.toolsGrid}>
            {tools.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={[styles.toolCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => {
                  // Navigation will be implemented later
                  console.log(`Navigate to ${tool.route}`);
                }}
              >
                <Text style={styles.toolIcon}>{tool.icon}</Text>
                <Text style={[styles.toolTitle, { color: theme.colors.text }]}>
                  {tool.title}
                </Text>
                <Text style={[styles.toolSubtitle, { color: theme.colors.textSecondary }]}>
                  {tool.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => console.log('Open Camera')}
            >
              <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                📷 Open Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
              onPress={() => console.log('Import Photo')}
            >
              <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                📁 Import Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mode Indicator */}
        <View style={[styles.modeIndicator, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.modeText, { color: theme.colors.textSecondary }]}>
            {faithMode ? 'Faith Mode' : encouragementMode ? 'Encouragement Mode' : 'Professional Mode'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  watermark: {
    fontSize: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'EB Garamond, serif',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Sora, sans-serif',
  },
  welcomeCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Sora, sans-serif',
  },
  faithOverlay: {
    fontSize: 14,
    fontStyle: 'italic',
    fontFamily: 'EB Garamond, serif',
  },
  toolsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'EB Garamond, serif',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toolIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Sora, sans-serif',
  },
  toolSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Sora, sans-serif',
  },
  quickActions: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Sora, sans-serif',
  },
  modeIndicator: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  modeText: {
    fontSize: 12,
    fontFamily: 'Sora, sans-serif',
  },
});
