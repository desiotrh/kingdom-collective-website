/**
 * Social Media Management Screen
 * Main hub for managing social media connections and posting content
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSocialMedia } from '../hooks/useSocialMedia';
import { PostContent } from '../services/socialMediaService';

const { width } = Dimensions.get('window');

const SocialMediaManagementScreen: React.FC = () => {
  const {
    supportedPlatforms,
    connectedPlatforms,
    getAccountsForPlatform,
    addPlatformAccount,
    removePlatformAccount,
    setActiveAccount,
    getActiveAccount,
    connectPlatform,
    disconnectPlatform,
    postToMultiplePlatforms,
    schedulePost,
    scheduledPosts,
    cancelScheduledPost,
    isPosting,
    isConnecting,
    error,
    refreshData
  } = useSocialMedia();

  // Modal states
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedAccountIds, setSelectedAccountIds] = useState<{ [platformId: string]: string }>({});
  const [showAccountModal, setShowAccountModal] = useState<{ platformId: string | null }>({ platformId: null });

  // Post creation state
  const [postContent, setPostContent] = useState<PostContent>({
    text: '',
    hashtags: [],
    mentions: []
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date>(new Date());

  // Platform connection handler
  const handleConnectPlatform = async (platformId: string) => {
    try {
      // In a real implementation, this would open platform-specific OAuth flow
      const mockAuthData = {
        username: `user_${platformId}`,
        accountId: `account_${Date.now()}`,
        accessToken: `token_${Date.now()}`,
        refreshToken: `refresh_${Date.now()}`,
        expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
      };

      const success = await connectPlatform(platformId, mockAuthData);
      if (success) {
        setShowConnectModal(false);
        Alert.alert('Success', 'Platform connected successfully!');
      } else {
        Alert.alert('Error', 'Failed to connect platform');
      }
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Connection failed');
    }
  };

  // Platform disconnection handler
  const handleDisconnectPlatform = async (platformId: string) => {
    Alert.alert(
      'Disconnect Platform',
      'Are you sure you want to disconnect this platform?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            const success = await disconnectPlatform(platformId);
            if (success) {
              Alert.alert('Success', 'Platform disconnected');
            } else {
              Alert.alert('Error', 'Failed to disconnect platform');
            }
          }
        }
      ]
    );
  };

  // Add account handler
  const handleAddAccount = async (platformId: string) => {
    // In a real implementation, this would open platform-specific OAuth flow
    const mockAuthData = {
      username: `user_${platformId}_${Date.now()}`,
      accountId: `account_${Date.now()}`,
      accessToken: `token_${Date.now()}`,
      refreshToken: `refresh_${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600000)
    };
    await addPlatformAccount(platformId, mockAuthData);
    setShowAccountModal({ platformId: null });
  };

  // Remove account handler
  const handleRemoveAccount = async (platformId: string, accountId: string) => {
    await removePlatformAccount(platformId, accountId);
    // Remove from selected if it was active
    setSelectedAccountIds(prev => {
      const copy = { ...prev };
      if (copy[platformId] === accountId) delete copy[platformId];
      return copy;
    });
  };

  // Set active account handler
  const handleSetActiveAccount = (platformId: string, accountId: string) => {
    setActiveAccount(platformId, accountId);
    setSelectedAccountIds(prev => ({ ...prev, [platformId]: accountId }));
  };

  // Post creation handler
  const handleCreatePost = async () => {
    if (!postContent.text.trim()) {
      Alert.alert('Error', 'Please enter post content');
      return;
    }
    const selectedPlatforms = Object.keys(selectedAccountIds).filter(pid => selectedAccountIds[pid]);
    if (selectedPlatforms.length === 0) {
      Alert.alert('Error', 'Please select at least one account');
      return;
    }

    try {
      if (isScheduled) {
        // Schedule the post
        await schedulePost(postContent, selectedPlatforms, scheduledTime);
        Alert.alert('Success', 'Post scheduled successfully!');
      } else {
        // Post immediately
        const results = await postToMultiplePlatforms(postContent, selectedPlatforms);
        const successCount = results.filter(r => r.success).length;
        Alert.alert('Success', `Posted to ${successCount}/${results.length} platforms`);
      }

      // Reset form
      setPostContent({ text: '', hashtags: [], mentions: [] });
      setSelectedAccountIds({});
      setIsScheduled(false);
      setShowPostModal(false);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  // Platform toggle handler
  const togglePlatformSelection = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const renderPlatformCard = (platform: any) => {
    const accounts = getAccountsForPlatform(platform.id);
    return (
      <View key={platform.id} style={[styles.platformCard, accounts.length > 0 && styles.connectedPlatform]}>
        <View style={styles.platformHeader}>
          <Text style={styles.platformIcon}>{platform.icon}</Text>
          <View style={styles.platformInfo}>
            <Text style={styles.platformName}>{platform.name}</Text>
            {accounts.length === 0 && <Text style={styles.platformUsername}>No accounts connected</Text>}
          </View>
        </View>
        {accounts.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            {accounts.map(account => (
              <View key={account.accountId} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontWeight: selectedAccountIds[platform.id] === account.accountId ? 'bold' : 'normal' }}>
                  @{account.username} ({account.accountId})
                </Text>
                <TouchableOpacity
                  style={{ marginLeft: 8, backgroundColor: '#ef4444', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}
                  onPress={() => handleRemoveAccount(platform.id, account.accountId)}
                >
                  <Text style={{ color: '#fff', fontSize: 12 }}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginLeft: 8, backgroundColor: selectedAccountIds[platform.id] === account.accountId ? '#10B981' : '#3b82f6', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}
                  onPress={() => handleSetActiveAccount(platform.id, account.accountId)}
                >
                  <Text style={{ color: '#fff', fontSize: 12 }}>{selectedAccountIds[platform.id] === account.accountId ? 'Active' : 'Set Active'}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.connectButton]}
          onPress={() => setShowAccountModal({ platformId: platform.id })}
        >
          <Text style={styles.actionButtonText}>Add Account</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderScheduledPost = (post: any) => (
    <View key={post.id} style={styles.scheduledPostCard}>
      <View style={styles.scheduledPostHeader}>
        <Text style={styles.scheduledPostText} numberOfLines={2}>
          {post.content.text}
        </Text>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => cancelScheduledPost(post.id)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scheduledPostMeta}>
        <Text style={styles.scheduledTime}>
          {post.scheduledTime.toLocaleDateString()} at {post.scheduledTime.toLocaleTimeString()}
        </Text>
        <View style={styles.platformTags}>
          {post.platforms.map((platformId: string) => (
            <View key={platformId} style={styles.platformTag}>
              <Text style={styles.platformTagText}>
                {supportedPlatforms.find(p => p.id === platformId)?.name || platformId}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.title}>Social Media Hub</Text>
        <Text style={styles.subtitle}>
          Manage your platforms and create content
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => setShowPostModal(true)}
              disabled={connectedPlatforms.length === 0}
            >
              <Text style={styles.quickActionIcon}>✨</Text>
              <Text style={styles.quickActionText}>Create Post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={refreshData}
            >
              <Text style={styles.quickActionIcon}>🔄</Text>
              <Text style={styles.quickActionText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Connected Platforms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Connected Platforms ({connectedPlatforms.length})
          </Text>
          {connectedPlatforms.length === 0 ? (
            <Text style={styles.emptyText}>
              No platforms connected yet. Connect a platform to start posting!
            </Text>
          ) : (
            <View style={styles.platformGrid}>
              {connectedPlatforms.map(renderPlatformCard)}
            </View>
          )}
        </View>

        {/* Available Platforms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Platforms</Text>
          <View style={styles.platformGrid}>
            {supportedPlatforms.filter(p => !p.isConnected).map(renderPlatformCard)}
          </View>
        </View>

        {/* Scheduled Posts */}
        {scheduledPosts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Scheduled Posts ({scheduledPosts.length})
            </Text>
            {scheduledPosts.map(renderScheduledPost)}
          </View>
        )}
      </ScrollView>

      {/* Connect Platform Modal */}
      <Modal
        visible={showConnectModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConnectModal(false)}
      >
        <BlurView intensity={50} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Connect Platform</Text>
            <Text style={styles.modalSubtitle}>
              Connect your {selectedPlatform} account to start posting
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowConnectModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={() => selectedPlatform && handleConnectPlatform(selectedPlatform)}
                disabled={isConnecting}
              >
                <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Create Post Modal */}
      <Modal
        visible={showPostModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPostModal(false)}
      >
        <BlurView intensity={50} style={styles.modalOverlay}>
          <View style={styles.postModalContainer}>
            <Text style={styles.modalTitle}>Create Post</Text>

            <ScrollView style={styles.postForm}>
              {/* Post Content */}
              <Text style={styles.formLabel}>Content</Text>
              <TextInput
                style={styles.textArea}
                value={postContent.text}
                onChangeText={(text) => setPostContent(prev => ({ ...prev, text }))}
                placeholder="What's on your mind?"
                multiline
                numberOfLines={4}
              />

              {/* Platform Selection */}
              <Text style={styles.formLabel}>Select Accounts for Platforms</Text>
              <View style={styles.platformSelector}>
                {supportedPlatforms.map(platform => {
                  const accounts = getAccountsForPlatform(platform.id);
                  if (accounts.length === 0) return null;
                  return (
                    <View key={platform.id} style={{ marginBottom: 8 }}>
                      <Text style={{ fontWeight: 'bold' }}>{platform.name}</Text>
                      {accounts.map(account => (
                        <TouchableOpacity
                          key={account.accountId}
                          style={[
                            styles.platformSelectorItem,
                            selectedAccountIds[platform.id] === account.accountId && styles.selectedPlatform
                          ]}
                          onPress={() => handleSetActiveAccount(platform.id, account.accountId)}
                        >
                          <Text style={styles.platformIcon}>{platform.icon}</Text>
                          <Text style={styles.platformSelectorText}>@{account.username} ({account.accountId})</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  );
                })}
              </View>

              {/* Schedule Toggle */}
              <View style={styles.scheduleToggle}>
                <Text style={styles.formLabel}>Schedule Post</Text>
                <Switch
                  value={isScheduled}
                  onValueChange={setIsScheduled}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={isScheduled ? '#f5dd4b' : '#f4f3f4'}
                />
              </View>

              {/* Schedule Time (if enabled) */}
              {isScheduled && (
                <View style={styles.scheduleTime}>
                  <Text style={styles.formLabel}>Scheduled Time</Text>
                  <Text style={styles.timeDisplay}>
                    {scheduledTime.toLocaleDateString()} at {scheduledTime.toLocaleTimeString()}
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowPostModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleCreatePost}
                disabled={isPosting}
              >
                <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                  {isPosting ? 'Posting...' : isScheduled ? 'Schedule' : 'Post Now'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Add Account Modal */}
      <Modal
        visible={!!showAccountModal.platformId}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAccountModal({ platformId: null })}
      >
        <BlurView intensity={50} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Account</Text>
            <Text style={styles.modalSubtitle}>
              Connect a new account for {showAccountModal.platformId}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowAccountModal({ platformId: null })}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={() => showAccountModal.platformId && handleAddAccount(showAccountModal.platformId)}
              >
                <Text style={[styles.modalButtonText, styles.primaryButtonText]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  platformGrid: {
    gap: 16,
  },
  platformCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectedPlatform: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  platformUsername: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#3b82f6',
  },
  disconnectButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    padding: 20,
  },
  scheduledPostCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduledPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scheduledPostText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginRight: 12,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  scheduledPostMeta: {
    gap: 8,
  },
  scheduledTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  platformTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformTag: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  platformTagText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  postModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  postForm: {
    maxHeight: 400,
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  platformSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  platformSelectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  selectedPlatform: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  platformSelectorText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  scheduleToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  scheduleTime: {
    marginTop: 16,
  },
  timeDisplay: {
    fontSize: 14,
    color: '#6b7280',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
});

export default React.memo(SocialMediaManagementScreen);
