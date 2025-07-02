import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import {
  Flag,
  AdminApiResponse,
} from '../types/admin';

interface FlagReviewScreenProps {
  navigation: any;
}

const FlagReviewScreen: React.FC<FlagReviewScreenProps> = ({ navigation }) => {
  const { isDualMode, currentMode } = useDualMode();
  const isFaithMode = currentMode === 'faith';
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<Flag | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'high' | 'critical'>('pending');

  const currentColors = isDualMode 
    ? (isFaithMode ? KingdomColors.faith : KingdomColors.encouragement)
    : KingdomColors.default;

  // Mock flags data
  const mockFlags: Flag[] = [
    {
      id: '1',
      reporterId: 'user1',
      reporterName: 'John Doe',
      targetId: 'content1',
      targetType: 'content',
      reason: 'inappropriateContent',
      description: 'This content contains inappropriate language and doesn\'t align with community standards.',
      severity: 'medium',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      reporterId: 'user2',
      reporterName: 'Jane Smith',
      targetId: 'user3',
      targetType: 'user',
      reason: 'harassment',
      description: 'User has been sending harassing messages to multiple community members.',
      severity: 'high',
      status: 'pending',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: '3',
      reporterId: 'user4',
      reporterName: 'Mike Johnson',
      targetId: 'content2',
      targetType: 'content',
      reason: 'spam',
      description: 'Repetitive promotional content posted multiple times.',
      severity: 'low',
      status: 'pending',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      id: '4',
      reporterId: 'user5',
      reporterName: 'Sarah Wilson',
      targetId: 'content3',
      targetType: 'content',
      reason: 'religionInsensitive',
      description: 'Content contains material that could be offensive to faith-based community members.',
      severity: 'critical',
      status: 'pending',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
      id: '5',
      reporterId: 'user6',
      reporterName: 'Tom Brown',
      targetId: 'comment1',
      targetType: 'comment',
      reason: 'falseInformation',
      description: 'Comment spreads misinformation about health and wellness topics.',
      severity: 'high',
      status: 'reviewed',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      reviewedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      reviewedBy: 'Admin User',
      actionTaken: 'Content removed and user warned',
    },
  ];

  useEffect(() => {
    loadFlags();
  }, [selectedFilter]);

  const loadFlags = async () => {
    try {
      setFlags(mockFlags);
    } catch (error) {
      console.error('Error loading flags:', error);
      Alert.alert('Error', 'Failed to load flags');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFlags();
  };

  const handleFlagAction = async (flagId: string, action: 'resolve' | 'dismiss' | 'escalate') => {
    try {
      // Mock flag action
      console.log(`${action} flag ${flagId}`);
      
      // Update flag status
      setFlags(prevFlags => 
        prevFlags.map(flag => 
          flag.id === flagId 
            ? { 
                ...flag, 
                status: action === 'resolve' ? 'resolved' : action === 'dismiss' ? 'dismissed' : 'pending',
                reviewedAt: new Date(),
                reviewedBy: 'Current Admin',
                actionTaken: `Flag ${action}d by admin`
              }
            : flag
        )
      );

      Alert.alert('Success', `Flag ${action}d successfully`);
      setShowDetailModal(false);
      setSelectedFlag(null);
    } catch (error) {
      console.error(`Error ${action}ing flag:`, error);
      Alert.alert('Error', `Failed to ${action} flag`);
    }
  };

  const openFlagDetail = (flag: Flag) => {
    setSelectedFlag(flag);
    setShowDetailModal(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return currentColors.error;
      case 'high': return '#FF6B35';
      case 'medium': return currentColors.warning;
      case 'low': return '#4ADE80';
      default: return currentColors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return currentColors.warning;
      case 'reviewed': return currentColors.info;
      case 'resolved': return currentColors.success;
      case 'dismissed': return currentColors.textSecondary;
      default: return currentColors.textSecondary;
    }
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'spam': return '📧';
      case 'harassment': return '⚠️';
      case 'inappropriateContent': return '🚫';
      case 'falseInformation': return '❌';
      case 'copyrightViolation': return '©️';
      case 'religionInsensitive': return '✝️';
      case 'scamSuspicion': return '🚨';
      default: return '❓';
    }
  };

  const renderFilterButton = (filter: typeof selectedFilter, label: string, count: number) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: selectedFilter === filter ? currentColors.primary : 'transparent',
          borderColor: currentColors.primary,
        }
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        { color: selectedFilter === filter ? currentColors.surface : currentColors.primary }
      ]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const renderFlagCard = (flag: Flag) => (
    <TouchableOpacity
      key={flag.id}
      style={[styles.flagCard, { borderColor: currentColors.border }]}
      onPress={() => openFlagDetail(flag)}
    >
      <View style={styles.flagHeader}>
        <View style={styles.flagMeta}>
          <Text style={[styles.flagIcon, { color: currentColors.primary }]}>
            {getReasonIcon(flag.reason)}
          </Text>
          <View style={styles.flagInfo}>
            <Text style={[styles.flagReason, { color: currentColors.text }]}>
              {flag.reason.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </Text>
            <Text style={[styles.flagTime, { color: currentColors.textSecondary }]}>
              {flag.createdAt.toLocaleDateString()} • {flag.createdAt.toLocaleTimeString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.flagBadges}>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(flag.severity) }]}>
            <Text style={styles.badgeText}>{flag.severity.toUpperCase()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(flag.status) }]}>
            <Text style={styles.badgeText}>{flag.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.flagDescription, { color: currentColors.textSecondary }]} numberOfLines={2}>
        {flag.description}
      </Text>

      <View style={styles.flagFooter}>
        <Text style={[styles.flagReporter, { color: currentColors.textSecondary }]}>
          Reported by {flag.reporterName}
        </Text>
        <Text style={[styles.flagTarget, { color: currentColors.primary }]}>
          Target: {flag.targetType}
        </Text>
      </View>

      {flag.status !== 'pending' && flag.actionTaken && (
        <View style={[styles.actionTakenBadge, { backgroundColor: currentColors.success }]}>
          <Text style={styles.actionTakenText}>✓ {flag.actionTaken}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFlagDetailModal = () => (
    <Modal
      visible={showDetailModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowDetailModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: currentColors.surface }]}>
          {selectedFlag && (
            <>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: currentColors.text }]}>
                  Flag Details
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDetailModal(false)}
                  style={styles.closeButton}
                >
                  <Text style={[styles.closeButtonText, { color: currentColors.textSecondary }]}>×</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Reason</Text>
                  <Text style={[styles.detailValue, { color: currentColors.text }]}>
                    {getReasonIcon(selectedFlag.reason)} {selectedFlag.reason.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Severity</Text>
                  <Text style={[styles.detailValue, { color: getSeverityColor(selectedFlag.severity) }]}>
                    {selectedFlag.severity.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Status</Text>
                  <Text style={[styles.detailValue, { color: getStatusColor(selectedFlag.status) }]}>
                    {selectedFlag.status.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Description</Text>
                  <Text style={[styles.detailValue, { color: currentColors.text }]}>
                    {selectedFlag.description}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Reporter</Text>
                  <Text style={[styles.detailValue, { color: currentColors.text }]}>
                    {selectedFlag.reporterName}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Target</Text>
                  <Text style={[styles.detailValue, { color: currentColors.text }]}>
                    {selectedFlag.targetType} (ID: {selectedFlag.targetId})
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Reported At</Text>
                  <Text style={[styles.detailValue, { color: currentColors.text }]}>
                    {selectedFlag.createdAt.toLocaleString()}
                  </Text>
                </View>

                {selectedFlag.reviewedAt && (
                  <>
                    <View style={styles.detailSection}>
                      <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Reviewed At</Text>
                      <Text style={[styles.detailValue, { color: currentColors.text }]}>
                        {selectedFlag.reviewedAt.toLocaleString()}
                      </Text>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Reviewed By</Text>
                      <Text style={[styles.detailValue, { color: currentColors.text }]}>
                        {selectedFlag.reviewedBy}
                      </Text>
                    </View>

                    {selectedFlag.actionTaken && (
                      <View style={styles.detailSection}>
                        <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Action Taken</Text>
                        <Text style={[styles.detailValue, { color: currentColors.success }]}>
                          {selectedFlag.actionTaken}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </ScrollView>

              {selectedFlag.status === 'pending' && (
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: currentColors.success }]}
                    onPress={() => handleFlagAction(selectedFlag.id, 'resolve')}
                  >
                    <Text style={styles.actionButtonText}>✓ Resolve</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: currentColors.textSecondary }]}
                    onPress={() => handleFlagAction(selectedFlag.id, 'dismiss')}
                  >
                    <Text style={styles.actionButtonText}>✗ Dismiss</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: currentColors.error }]}
                    onPress={() => handleFlagAction(selectedFlag.id, 'escalate')}
                  >
                    <Text style={styles.actionButtonText}>⬆️ Escalate</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const filteredFlags = flags.filter(flag => {
    switch (selectedFilter) {
      case 'pending': return flag.status === 'pending';
      case 'high': return flag.severity === 'high';
      case 'critical': return flag.severity === 'critical';
      default: return true;
    }
  });

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentColors.text }]}>
          {isDualMode && isFaithMode ? '✝️ Flag Review' : '🚩 Flag Review'}
        </Text>
        <Text style={[styles.subtitle, { color: currentColors.textSecondary }]}>
          Review and resolve community flags
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All', flags.length)}
        {renderFilterButton('pending', 'Pending', flags.filter(f => f.status === 'pending').length)}
        {renderFilterButton('high', 'High Priority', flags.filter(f => f.severity === 'high').length)}
        {renderFilterButton('critical', 'Critical', flags.filter(f => f.severity === 'critical').length)}
      </View>

      {/* Flag List */}
      <ScrollView
        style={styles.flagList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: currentColors.text }]}>Loading flags...</Text>
          </View>
        ) : filteredFlags.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: currentColors.textSecondary }]}>
              No flags match the current filter
            </Text>
          </View>
        ) : (
          filteredFlags.map(renderFlagCard)
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Flag Detail Modal */}
      {renderFlagDetailModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  flagList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  flagCard: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
  },
  flagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  flagMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  flagInfo: {
    flex: 1,
  },
  flagReason: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  flagTime: {
    fontSize: 12,
  },
  flagBadges: {
    alignItems: 'flex-end',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  flagDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  flagFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flagReporter: {
    fontSize: 12,
  },
  flagTarget: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionTakenBadge: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  actionTakenText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
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
  detailSection: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FlagReviewScreen;
