import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
  Dimensions,
  Share
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAdvancedAnalytics } from '../hooks/useAdvancedAnalytics';
import type { AnalyticsTimeframe } from '../services/advancedAnalyticsService';

const { width } = Dimensions.get('window');

const AdvancedAnalyticsDashboard: React.FC = () => {
  const {
    dashboard,
    contentMetrics,
    socialMediaMetrics,
    emailMetrics,
    userEngagementMetrics,
    revenueMetrics,
    insights,
    recommendations,
    realtimeMetrics,
    isLoading,
    isLoadingRealtime,
    isExporting,
    error,
    selectedTimeframe,
    setTimeframe,
    getPresetTimeframes,
    exportAnalytics,
    refreshData,
    clearError
  } = useAdvancedAnalytics();

  const [showTimeframePicker, setShowTimeframePicker] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedMetricView, setSelectedMetricView] = useState<'overview' | 'content' | 'social' | 'email' | 'engagement' | 'revenue'>('overview');

  const presetTimeframes = getPresetTimeframes();

  const handleTimeframeSelect = (timeframe: AnalyticsTimeframe) => {
    setTimeframe(timeframe);
    setShowTimeframePicker(false);
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const exportData = await exportAnalytics(format, selectedTimeframe);
      if (exportData) {
        Alert.alert(
          'Export Successful',
          `Analytics data has been exported as ${format.toUpperCase()}`,
          [
            {
              text: 'Share',
              onPress: () => {
                Share.share({
                  message: `Analytics Report (${format.toUpperCase()}) - Generated on ${exportData.generatedAt.toLocaleDateString()}`,
                  title: 'Kingdom Studios Analytics Report'
                });
              }
            },
            { text: 'OK' }
          ]
        );
      }
    } catch (err) {
      Alert.alert('Export Failed', 'Unable to export analytics data. Please try again.');
    }
    setShowExportOptions(false);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getInsightIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'positive': return 'trending-up';
      case 'negative': return 'trending-down';
      default: return 'remove';
    }
  };

  const getInsightColor = (type: string): string => {
    switch (type) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#f44336';
      default: return '#FF9800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  const renderOverviewCards = () => (
    <View style={styles.cardsContainer}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="document-text" size={24} color="#FFFFFF" />
          <Text style={styles.cardTitle}>Content</Text>
        </View>
        <Text style={styles.cardValue}>{formatNumber(contentMetrics?.totalPosts || 0)}</Text>
        <Text style={styles.cardSubtitle}>
          {formatNumber(contentMetrics?.aiGeneratedPosts || 0)} AI Generated
        </Text>
      </LinearGradient>

      <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="share-social" size={24} color="#FFFFFF" />
          <Text style={styles.cardTitle}>Social Reach</Text>
        </View>
        <Text style={styles.cardValue}>
          {formatNumber(socialMediaMetrics?.platformBreakdown.reduce((sum, p) => sum + p.reach, 0) || 0)}
        </Text>
        <Text style={styles.cardSubtitle}>
          {socialMediaMetrics?.activePlatforms || 0} Active Platforms
        </Text>
      </LinearGradient>

      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="mail" size={24} color="#FFFFFF" />
          <Text style={styles.cardTitle}>Email</Text>
        </View>
        <Text style={styles.cardValue}>{formatNumber(emailMetrics?.totalSubscribers || 0)}</Text>
        <Text style={styles.cardSubtitle}>
          {(emailMetrics?.averageOpenRate || 0).toFixed(1)}% Open Rate
        </Text>
      </LinearGradient>

      <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="cash" size={24} color="#FFFFFF" />
          <Text style={styles.cardTitle}>Revenue</Text>
        </View>
        <Text style={styles.cardValue}>{formatCurrency(revenueMetrics?.totalRevenue || 0)}</Text>
        <Text style={styles.cardSubtitle}>
          {formatCurrency(revenueMetrics?.monthlyRecurringRevenue || 0)} MRR
        </Text>
      </LinearGradient>
    </View>
  );

  const renderInsights = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Key Insights</Text>
      {insights.map((insight, index) => (
        <View key={index} style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons 
              name={getInsightIcon(insight.type)} 
              size={20} 
              color={getInsightColor(insight.type)} 
            />
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={[styles.insightValue, { color: getInsightColor(insight.type) }]}>
              {insight.value}
            </Text>
          </View>
          <Text style={styles.insightDescription}>{insight.description}</Text>
        </View>
      ))}
    </View>
  );

  const renderRecommendations = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recommendations</Text>
      {recommendations.slice(0, 3).map((rec, index) => (
        <View key={index} style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(rec.priority) }]}>
              <Text style={styles.priorityText}>{rec.priority.toUpperCase()}</Text>
            </View>
            <Text style={styles.recommendationTitle}>{rec.title}</Text>
          </View>
          <Text style={styles.recommendationDescription}>{rec.description}</Text>
          <View style={styles.actionItems}>
            {rec.actionItems.slice(0, 2).map((action, actionIndex) => (
              <Text key={actionIndex} style={styles.actionItem}>• {action}</Text>
            ))}
          </View>
          <Text style={styles.expectedImpact}>Expected Impact: {rec.expectedImpact}</Text>
        </View>
      ))}
    </View>
  );

  const renderRealtimeMetrics = () => (
    <View style={styles.realtimeSection}>
      <View style={styles.realtimeHeader}>
        <Text style={styles.realtimeTitle}>Real-time Metrics</Text>
        <View style={styles.realtimeIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
      <View style={styles.realtimeCards}>
        <View style={styles.realtimeCard}>
          <Text style={styles.realtimeValue}>
            {formatNumber(userEngagementMetrics?.dailyActiveUsers || 0)}
          </Text>
          <Text style={styles.realtimeLabel}>Daily Active Users</Text>
        </View>
        <View style={styles.realtimeCard}>
          <Text style={styles.realtimeValue}>
            {formatNumber(socialMediaMetrics?.totalPosts || 0)}
          </Text>
          <Text style={styles.realtimeLabel}>Posts Today</Text>
        </View>
        <View style={styles.realtimeCard}>
          <Text style={styles.realtimeValue}>
            {(userEngagementMetrics?.averageSessionDuration || 0).toFixed(1)}m
          </Text>
          <Text style={styles.realtimeLabel}>Avg Session</Text>
        </View>
      </View>
    </View>
  );

  const renderTopContent = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Top Performing Content</Text>
      {contentMetrics?.topPerformingContent.slice(0, 3).map((content, index) => (
        <View key={content.id} style={styles.contentCard}>
          <View style={styles.contentRank}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
          <View style={styles.contentInfo}>
            <Text style={styles.contentText} numberOfLines={2}>
              {content.content}
            </Text>
            <Text style={styles.contentPlatform}>{content.platform}</Text>
          </View>
          <View style={styles.contentMetrics}>
            <Text style={styles.contentEngagement}>
              {formatNumber(content.engagement)} eng.
            </Text>
            <Text style={styles.contentReach}>
              {formatNumber(content.reach)} reach
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#f44336" />
        <Text style={styles.errorTitle}>Unable to Load Analytics</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={clearError}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerTitle}>Advanced Analytics</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowTimeframePicker(true)}
          >
            <Ionicons name="calendar" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowExportOptions(true)}
          >
            <Ionicons name="download" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={refreshData}
            disabled={isLoading}
          >
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshData}
            colors={['#667eea']}
          />
        }
      >
        {/* Real-time Metrics */}
        {renderRealtimeMetrics()}

        {/* Overview Cards */}
        {renderOverviewCards()}

        {/* Key Insights */}
        {renderInsights()}

        {/* Top Content */}
        {renderTopContent()}

        {/* Recommendations */}
        {renderRecommendations()}
      </ScrollView>

      {/* Timeframe Picker Modal */}
      <Modal visible={showTimeframePicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Timeframe</Text>
            {presetTimeframes.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={styles.timeframeOption}
                onPress={() => handleTimeframeSelect(preset.timeframe)}
              >
                <Text style={styles.timeframeOptionText}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTimeframePicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Export Options Modal */}
      <Modal visible={showExportOptions} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Export Analytics</Text>
            <TouchableOpacity
              style={styles.exportOption}
              onPress={() => handleExport('pdf')}
              disabled={isExporting}
            >
              <Ionicons name="document" size={24} color="#f44336" />
              <Text style={styles.exportOptionText}>Export as PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportOption}
              onPress={() => handleExport('csv')}
              disabled={isExporting}
            >
              <Ionicons name="grid" size={24} color="#4CAF50" />
              <Text style={styles.exportOptionText}>Export as CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportOption}
              onPress={() => handleExport('excel')}
              disabled={isExporting}
            >
              <Ionicons name="grid" size={24} color="#2196F3" />
              <Text style={styles.exportOptionText}>Export as Excel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowExportOptions(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10
  },
  headerButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8
  },
  content: {
    flex: 1,
    padding: 20
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  card: {
    width: (width - 50) / 2,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)'
  },
  realtimeSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  realtimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  realtimeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  realtimeIndicator: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 5
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50'
  },
  realtimeCards: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  realtimeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10
  },
  realtimeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  realtimeLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  insightCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1
  },
  insightValue: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  insightDescription: {
    fontSize: 12,
    color: '#666'
  },
  recommendationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  recommendationDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8
  },
  actionItems: {
    marginBottom: 8
  },
  actionItem: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2
  },
  expectedImpact: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500'
  },
  contentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },
  contentRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  contentInfo: {
    flex: 1,
    marginRight: 12
  },
  contentText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2
  },
  contentPlatform: {
    fontSize: 10,
    color: '#666'
  },
  contentMetrics: {
    alignItems: 'flex-end'
  },
  contentEngagement: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50'
  },
  contentReach: {
    fontSize: 10,
    color: '#666'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: width - 40,
    maxHeight: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center'
  },
  timeframeOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  timeframeOptionText: {
    fontSize: 16,
    color: '#333'
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  exportOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center'
  },
  modalCloseText: {
    fontSize: 16,
    color: '#666'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600'
  }
});

export default AdvancedAnalyticsDashboard;
