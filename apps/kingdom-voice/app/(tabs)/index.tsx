import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from '@/contexts/FaithModeContext';

export default function JournalHomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isFaithMode, isEncouragementMode, FaithModeOverlay, EncouragementOverlay } = useFaithMode();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {isFaithMode ? '✝️ Kingdom Voice' : 'Kingdom Voice'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.charcoalInk }]}>
            Your sacred space for reflection
          </Text>
        </View>

        {/* Daily Devotional Card */}
        {isFaithMode && (
          <View style={[styles.devotionalCard, { backgroundColor: colors.softGold }]}>
            <Text style={[styles.devotionalTitle, { color: colors.cream }]}>
              Today's Reflection
            </Text>
            <Text style={[styles.devotionalText, { color: colors.cream }]}>
              "Be still and know that I am God." - Psalm 46:10
            </Text>
            <Text style={[styles.devotionalPrompt, { color: colors.cream }]}>
              How can you find stillness in your heart today?
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>

          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.skyBlue }]}>
              <Text style={[styles.actionIcon, { color: colors.charcoalInk }]}>✍️</Text>
              <Text style={[styles.actionTitle, { color: colors.charcoalInk }]}>New Entry</Text>
              <Text style={[styles.actionSubtitle, { color: colors.charcoalInk }]}>
                Start writing
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.warmBeige }]}>
              <Text style={[styles.actionIcon, { color: colors.charcoalInk }]}>💭</Text>
              <Text style={[styles.actionTitle, { color: colors.charcoalInk }]}>Dream Log</Text>
              <Text style={[styles.actionSubtitle, { color: colors.charcoalInk }]}>
                Record dreams
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.softPink }]}>
              <Text style={[styles.actionIcon, { color: colors.charcoalInk }]}>📖</Text>
              <Text style={[styles.actionTitle, { color: colors.charcoalInk }]}>Saved</Text>
              <Text style={[styles.actionSubtitle, { color: colors.charcoalInk }]}>
                View entries
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.mutedGreen }]}>
              <Text style={[styles.actionIcon, { color: colors.charcoalInk }]}>⚙️</Text>
              <Text style={[styles.actionTitle, { color: colors.charcoalInk }]}>Settings</Text>
              <Text style={[styles.actionSubtitle, { color: colors.charcoalInk }]}>
                Customize
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Entries */}
        <View style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Entries
          </Text>

          <View style={[styles.recentCard, { backgroundColor: colors.cream, borderColor: colors.softGold }]}>
            <Text style={[styles.recentDate, { color: colors.charcoalInk }]}>
              Today, 2:30 PM
            </Text>
            <Text style={[styles.recentTitle, { color: colors.charcoalInk }]}>
              Finding Peace in Chaos
            </Text>
            <Text style={[styles.recentPreview, { color: colors.charcoalInk }]}>
              Today I realized that peace isn't the absence of chaos, but the presence of God in the midst of it...
            </Text>
          </View>

          <View style={[styles.recentCard, { backgroundColor: colors.cream, borderColor: colors.softGold }]}>
            <Text style={[styles.recentDate, { color: colors.charcoalInk }]}>
              Yesterday, 9:15 AM
            </Text>
            <Text style={[styles.recentTitle, { color: colors.charcoalInk }]}>
              Morning Gratitude
            </Text>
            <Text style={[styles.recentPreview, { color: colors.charcoalInk }]}>
              Grateful for the simple moments - coffee, quiet, and the promise of a new day...
            </Text>
          </View>
        </View>

        {/* Encouragement Message */}
        {isEncouragementMode && (
          <View style={[styles.encouragementCard, { backgroundColor: colors.skyBlue }]}>
            <Text style={[styles.encouragementTitle, { color: colors.charcoalInk }]}>
              💝 This space is for clarity and healing
            </Text>
            <Text style={[styles.encouragementText, { color: colors.charcoalInk }]}>
              Write what you needed to hear today. Your voice matters.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Faith Mode Overlay */}
      {FaithModeOverlay}
      {EncouragementOverlay}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Playfair Display',
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.8,
    fontFamily: 'Raleway',
  },
  devotionalCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  devotionalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Playfair Display',
  },
  devotionalText: {
    fontSize: 16,
    marginBottom: 12,
    fontStyle: 'italic',
    fontFamily: 'Raleway',
  },
  devotionalPrompt: {
    fontSize: 14,
    opacity: 0.9,
    fontFamily: 'Raleway',
  },
  quickActions: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Playfair Display',
    textDecorationLine: 'underline',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Playfair Display',
  },
  actionSubtitle: {
    fontSize: 12,
    opacity: 0.8,
    fontFamily: 'Raleway',
  },
  recentSection: {
    marginBottom: 30,
  },
  recentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  recentDate: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
    fontFamily: 'Raleway',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Playfair Display',
  },
  recentPreview: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
    fontFamily: 'Raleway',
  },
  encouragementCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  encouragementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Playfair Display',
  },
  encouragementText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
    fontFamily: 'Raleway',
  },
});
