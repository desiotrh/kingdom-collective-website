import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useSocialPostGenerator, useHashtagGenerator, useProductDescriptionGenerator } from '../hooks/useAIGeneration';
import { useAuth } from '../contexts/FirebaseAuthContext';

/**
 * 🤖 AI GENERATION TEST SCREEN
 * Test and demonstrate the AI service integration
 */

export const AIGenerationTestScreen: React.FC = () => {
  const { user } = useAuth();
  const [contentType, setContentType] = useState<'social' | 'hashtags' | 'product'>('social');
  const [prompt, setPrompt] = useState('');
  const [faithMode, setFaithMode] = useState(true);
  const [platform, setPlatform] = useState('Instagram');

  // AI Hooks
  const socialGenerator = useSocialPostGenerator();
  const hashtagGenerator = useHashtagGenerator();
  const productGenerator = useProductDescriptionGenerator();

  // Get current generator based on content type
  const getCurrentGenerator = () => {
    switch (contentType) {
      case 'social':
        return socialGenerator;
      case 'hashtags':
        return hashtagGenerator;
      case 'product':
        return productGenerator;
      default:
        return socialGenerator;
    }
  };

  const currentGenerator = getCurrentGenerator();

  // Load stats on mount and when user changes
  useEffect(() => {
    if (user) {
      currentGenerator.refreshStats();
    }
  }, [user]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt');
      return;
    }

    try {
      switch (contentType) {
        case 'social':
          await socialGenerator.generateSocialPost(prompt, platform, faithMode);
          break;
        case 'hashtags':
          await hashtagGenerator.generateHashtags(prompt, faithMode);
          break;
        case 'product':
          await productGenerator.generateProductDescription(prompt, faithMode);
          break;
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate content');
    }
  };

  const getPlaceholderText = () => {
    switch (contentType) {
      case 'social':
        return 'Describe your social media post idea...';
      case 'hashtags':
        return 'Describe your content or business niche...';
      case 'product':
        return 'Describe your product...';
      default:
        return 'Enter your prompt...';
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please log in to test AI generation</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🤖 AI Generation Test</Text>
        <Text style={styles.subtitle}>Test the enhanced AI service with tier limits</Text>
      </View>

      {/* Stats Display */}
      {currentGenerator.stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Usage Stats</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Tier:</Text>
            <Text style={styles.statsValue}>{currentGenerator.stats.tier.toUpperCase()}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>This Month:</Text>
            <Text style={styles.statsValue}>{currentGenerator.stats.thisMonth}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Remaining:</Text>
            <Text style={[styles.statsValue, { color: currentGenerator.stats.remainingGenerations > 0 ? '#10B981' : '#EF4444' }]}>
              {currentGenerator.stats.remainingGenerations}
            </Text>
          </View>
        </View>
      )}

      {/* Content Type Selector */}
      <View style={styles.section}>
        <Text style={styles.label}>Content Type</Text>
        <View style={styles.toggleContainer}>
          {(['social', 'hashtags', 'product'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.toggleButton,
                contentType === type && styles.toggleButtonActive,
              ]}
              onPress={() => setContentType(type)}
            >
              <Text style={[
                styles.toggleText,
                contentType === type && styles.toggleTextActive,
              ]}>
                {type === 'social' ? 'Social Post' : type === 'hashtags' ? 'Hashtags' : 'Product Desc'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Platform Selector (for social posts) */}
      {contentType === 'social' && (
        <View style={styles.section}>
          <Text style={styles.label}>Platform</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.toggleContainer}>
              {(['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok'] as const).map((platformOption) => (
                <TouchableOpacity
                  key={platformOption}
                  style={[
                    styles.toggleButton,
                    platform === platformOption && styles.toggleButtonActive,
                  ]}
                  onPress={() => setPlatform(platformOption)}
                >
                  <Text style={[
                    styles.toggleText,
                    platform === platformOption && styles.toggleTextActive,
                  ]}>
                    {platformOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Faith Mode Toggle */}
      <View style={styles.section}>
        <Text style={styles.label}>Faith Mode</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, faithMode && styles.toggleButtonActive]}
            onPress={() => setFaithMode(true)}
          >
            <Text style={[styles.toggleText, faithMode && styles.toggleTextActive]}>
              Kingdom Focus
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !faithMode && styles.toggleButtonActive]}
            onPress={() => setFaithMode(false)}
          >
            <Text style={[styles.toggleText, !faithMode && styles.toggleTextActive]}>
              Business Focus
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Prompt Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Prompt</Text>
        <TextInput
          style={styles.textInput}
          value={prompt}
          onChangeText={setPrompt}
          placeholder={getPlaceholderText()}
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.generateButton, currentGenerator.isGenerating && styles.generateButtonDisabled]}
        onPress={handleGenerate}
        disabled={currentGenerator.isGenerating}
      >
        {currentGenerator.isGenerating ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={styles.generateButtonText}>Generating...</Text>
          </View>
        ) : (
          <Text style={styles.generateButtonText}>Generate Content</Text>
        )}
      </TouchableOpacity>

      {/* Error Display */}
      {currentGenerator.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{currentGenerator.error}</Text>
        </View>
      )}

      {/* Generated Content */}
      {currentGenerator.content && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Generated Content:</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{currentGenerator.content}</Text>
          </View>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => {
              // Copy to clipboard functionality would go here
              Alert.alert('Copied!', 'Content copied to clipboard');
            }}
          >
            <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Refresh Stats Button */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={currentGenerator.refreshStats}
      >
        <Text style={styles.refreshButtonText}>Refresh Stats</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  statsContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 8,
  },
  statsLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  statsValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  picker: {
    color: '#FFFFFF',
    height: 50,
  },
  toggleContainer: {
    flexDirection: 'row' as const,
    borderRadius: 8,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: '#374151',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#1F2937',
    alignItems: 'center' as const,
  },
  toggleButtonActive: {
    backgroundColor: '#F97316',
  },
  toggleText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top' as const,
  },
  generateButton: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  generateButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  loadingContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  resultContainer: {
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  contentBox: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 12,
  },
  contentText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
  copyButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center' as const,
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  refreshButton: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 40,
  },
  refreshButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500' as const,
  },
});
