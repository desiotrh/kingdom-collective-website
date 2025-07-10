import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import {
  ContentItem,
  Flag,
  AdminApiResponse,
  ModerationQueue,
} from '../types/admin';

interface ContentModerationScreenProps {
  navigation: any;
}

const ContentModerationScreen: React.FC<ContentModerationScreenProps> = ({ navigation }) => {
  const { isDualMode, currentMode } = useDualMode();
  const isFaithMode = currentMode === 'faith';
  const [queue, setQueue] = useState<ModerationQueue | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'flagged' | 'escalated'>('pending');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const [showModerationModal, setShowModerationModal] = useState(false);

  const currentColors = isDualMode 
    ? (isFaithMode ? KingdomColors.faith : KingdomColors.encouragement)
    : KingdomColors.default;

  useEffect(() => {
    loadModerationQueue();
  }, []);

  const loadModerationQueue = async () => {
    try {
      // Mock data for now
      const mockQueue: ModerationQueue = {
        pending: [
          {
            id: '1',
            type: 'testimony',
            title: 'My Faith Journey',
            content: 'This is a testimony about my faith journey...',
            authorId: 'user1',
            authorName: 'John Doe',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'pending',
            flagCount: 0,
            isApproved: false,
            tags: ['faith', 'testimony'],
            visibility: 'public',
          },
          {
            id: '2',
            type: 'prayer',
            title: 'Prayer Request for Healing',
            content: 'Please pray for my family member who is sick...',
            authorId: 'user2',
            authorName: 'Jane Smith',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            status: 'pending',
            flagCount: 0,
            isApproved: false,
            tags: ['prayer', 'healing'],
            visibility: 'community',
          },
        ],
        flagged: [
          {
            id: '3',
            type: 'post',
            title: 'Community Discussion',
            content: 'Some potentially inappropriate content...',
            authorId: 'user3',
            authorName: 'Mike Johnson',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            status: 'flagged',
            flagCount: 3,
            isApproved: false,
            tags: ['discussion'],
            visibility: 'public',
          },
        ],
        escalated: [
          {
            id: '4',
            reporterId: 'user4',
            reporterName: 'Sarah Wilson',
            targetId: 'content4',
            targetType: 'content',
            reason: 'harassment',
            description: 'This content contains harassment',
            severity: 'high',
            status: 'pending',
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
          },
        ],
        priority: [
          {
            id: '5',
            type: 'communityThreat',
            priority: 'high',
            title: 'Community Safety Alert',
            description: 'Multiple reports of inappropriate behavior',
            actionRequired: true,
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            isRead: false,
          },
        ],
      };
      
      setQueue(mockQueue);
    } catch (error) {
      console.error('Error loading moderation queue:', error);
      Alert.alert('Error', 'Failed to load moderation queue');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadModerationQueue();
  };

  const handleContentAction = async (contentId: string, action: 'approve' | 'reject' | 'flag') => {
    try {
      // Mock API call
      console.log(`${action} content ${contentId}`);
      
      // Remove from current queue
      if (queue) {
        const updatedQueue = { ...queue };
        if (selectedTab !== 'escalated') {
          updatedQueue[selectedTab] = (queue[selectedTab] as ContentItem[]).filter(item => 
            item.id !== contentId
          );
          setQueue(updatedQueue);
        }
      }

      Alert.alert('Success', `Content ${action}ed successfully`);
      setShowModerationModal(false);
      setSelectedContent(null);
      setModerationNotes('');
    } catch (error) {
      console.error(`Error ${action}ing content:`, error);
      Alert.alert('Error', `Failed to ${action} content`);
    }
  };

  const openModerationModal = (content: ContentItem) => {
    setSelectedContent(content);
    setShowModerationModal(true);
  };

  const renderTabButton = (tab: 'pending' | 'flagged' | 'escalated', label: string, count: number) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: selectedTab === tab ? currentColors.primary : 'transparent',
          borderColor: currentColors.primary,
        }
      ]}
      onPress={() => setSelectedTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        { color: selectedTab === tab ? currentColors.surface : currentColors.primary }
      ]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const renderContentCard = (item: ContentItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.contentCard, { borderColor: currentColors.border }]}
      onPress={() => openModerationModal(item)}
    >
      <View style={styles.contentHeader}>
        <View style={styles.contentMeta}>
          <Text style={[styles.contentType, { color: currentColors.primary }]}>
            {item.type.toUpperCase()}
          </Text>
          <Text style={[styles.contentTime, { color: currentColors.textSecondary }]}>
            {item.createdAt.toLocaleDateString()}
          </Text>
        </View>
        {item.flagCount > 0 && (
          <View style={[styles.flagBadge, { backgroundColor: currentColors.error }]}>
            <Text style={styles.flagBadgeText}>{item.flagCount} flags</Text>
          </View>
        )}
      </View>

      <Text style={[styles.contentTitle, { color: currentColors.text }]} numberOfLines={2}>
        {item.title}
      </Text>

      <Text style={[styles.contentPreview, { color: currentColors.textSecondary }]} numberOfLines={3}>
        {item.content}
      </Text>

      <View style={styles.contentFooter}>
        <Text style={[styles.contentAuthor, { color: currentColors.textSecondary }]}>
          By {item.authorName}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) }
        ]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return currentColors.warning;
      case 'flagged': return currentColors.error;
      case 'approved': return currentColors.success;
      case 'rejected': return currentColors.error;
      default: return currentColors.textSecondary;
    }
  };

  const renderModerationModal = () => (
    <Modal
      visible={showModerationModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowModerationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: currentColors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>
              Moderate Content
            </Text>
            <TouchableOpacity
              onPress={() => setShowModerationModal(false)}
              style={styles.closeButton}
            >
              <Text style={[styles.closeButtonText, { color: currentColors.textSecondary }]}>×</Text>
            </TouchableOpacity>
          </View>

          {selectedContent && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.contentDetails}>
                <Text style={[styles.modalSectionTitle, { color: currentColors.text }]}>
                  Content Details
                </Text>
                <Text style={[styles.modalContentTitle, { color: currentColors.primary }]}>
                  {selectedContent.title}
                </Text>
                <Text style={[styles.modalContentText, { color: currentColors.textSecondary }]}>
                  {selectedContent.content}
                </Text>
                
                <View style={styles.contentMetaInfo}>
                  <Text style={[styles.metaLabel, { color: currentColors.textSecondary }]}>
                    Author: {selectedContent.authorName}
                  </Text>
                  <Text style={[styles.metaLabel, { color: currentColors.textSecondary }]}>
                    Type: {selectedContent.type}
                  </Text>
                  <Text style={[styles.metaLabel, { color: currentColors.textSecondary }]}>
                    Created: {selectedContent.createdAt.toLocaleString()}
                  </Text>
                  <Text style={[styles.metaLabel, { color: currentColors.textSecondary }]}>
                    Flags: {selectedContent.flagCount}
                  </Text>
                </View>
              </View>

              <View style={styles.notesSection}>
                <Text style={[styles.modalSectionTitle, { color: currentColors.text }]}>
                  Moderation Notes
                </Text>
                <TextInput
                  style={[styles.notesInput, { 
                    borderColor: currentColors.border,
                    color: currentColors.text,
                    backgroundColor: currentColors.background,
                  }]}
                  value={moderationNotes}
                  onChangeText={setModerationNotes}
                  placeholder="Add moderation notes..."
                  placeholderTextColor={currentColors.textSecondary}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton, { backgroundColor: currentColors.success }]}
              onPress={() => selectedContent && handleContentAction(selectedContent.id, 'approve')}
            >
              <Text style={styles.actionButtonText}>✓ Approve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton, { backgroundColor: currentColors.error }]}
              onPress={() => selectedContent && handleContentAction(selectedContent.id, 'reject')}
            >
              <Text style={styles.actionButtonText}>✗ Reject</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.flagButton, { backgroundColor: currentColors.warning }]}
              onPress={() => selectedContent && handleContentAction(selectedContent.id, 'flag')}
            >
              <Text style={styles.actionButtonText}>🚩 Flag</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: currentColors.background }]}>
        <Text style={[styles.loadingText, { color: currentColors.text }]}>Loading Content Queue...</Text>
      </View>
    );
  }

  if (!queue) {
    return (
      <View style={[styles.container, styles.errorContainer, { backgroundColor: currentColors.background }]}>
        <Text style={[styles.errorText, { color: currentColors.error }]}>Failed to load content queue</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: currentColors.primary }]}
          onPress={loadModerationQueue}
        >
          <Text style={[styles.retryButtonText, { color: currentColors.surface }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentTabData = selectedTab === 'escalated' 
    ? [] // Escalated flags would need different rendering
    : queue[selectedTab] as ContentItem[];

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentColors.text }]}>
          {isDualMode && isFaithMode ? '✝️ Content Moderation' : '🛡️ Content Moderation'}
        </Text>
        <Text style={[styles.subtitle, { color: currentColors.textSecondary }]}>
          Review and moderate community content
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {renderTabButton('pending', 'Pending', queue.pending.length)}
        {renderTabButton('flagged', 'Flagged', queue.flagged.length)}
        {renderTabButton('escalated', 'Escalated', queue.escalated.length)}
      </View>

      {/* Content List */}
      <ScrollView
        style={styles.contentList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {currentTabData.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: currentColors.textSecondary }]}>
              No {selectedTab} content to review
            </Text>
          </View>
        ) : (
          currentTabData.map(renderContentCard)
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Moderation Modal */}
      {renderModerationModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentCard: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentType: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  contentTime: {
    fontSize: 12,
  },
  flagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  flagBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  contentPreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentAuthor: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 50,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
  },
  modalBody: {
    maxHeight: 400,
  },
  contentDetails: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalContentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  contentMetaInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 8,
  },
  metaLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  notesSection: {
    marginBottom: 20,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  approveButton: {},
  rejectButton: {},
  flagButton: {},
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default React.memo(ContentModerationScreen);
