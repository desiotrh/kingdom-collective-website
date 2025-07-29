import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  ImageStyle,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useDualMode } from '../contexts/DualModeContext';
import { useAuth } from '../contexts/UnifiedAuthContext';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';
import KingdomLogo from '../components/KingdomLogo';
import ModeToggle from '../components/ModeToggle';
import { contentService, ContentStats } from '../services/contentService';
import { realTimeService, NotificationData } from '../services/realTimeService';
import { apiClient } from '../services/apiClient';
import { AnalyticsService } from '../services/AnalyticsService';

const { width } = Dimensions.get('window');

interface AnalyticsCardData {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  subtitle: string;
  icon: string;
}

interface TransactionData {
  id: string;
  name: string;
  platform: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  time: string;
  avatar: string;
}

const DashboardScreen = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('connecting');
  const { faithMode } = useFaithMode();
  const { currentMode, modeConfig, getModeSpecificContent } = useDualMode();
  const { user, logout, connectionStatus: authConnectionStatus } = useAuth();

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Load content statistics
      const statsResponse = await contentService.getStats();
      if (statsResponse.success) {
        setContentStats(statsResponse.data);
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle pull to refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, [loadDashboardData]);

  // Initialize real-time connection
  useEffect(() => {
    if (user && authConnectionStatus === 'online') {
      // Connect to real-time service
      realTimeService.connect(user.id);

      // Subscribe to notifications
      realTimeService.subscribeToNotifications((notification: NotificationData) => {
        setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
      });

      // Subscribe to connection status
      realTimeService.on('connectionStatus', (status: any) => {
        setConnectionStatus(status.status === 'connected' ? 'online' :
          status.status === 'connecting' ? 'connecting' : 'offline');
      });

      return () => {
        realTimeService.disconnect();
      };
    }
  }, [user, authConnectionStatus]);

  // Track dashboard view
  useEffect(() => {
    if (user) {
      AnalyticsService.getInstance().trackEvent('dashboard_viewed', 1, {
        faithMode: faithMode,
        userId: user.id,
      });
    }
  }, [user, faithMode]);

  // Mock analytics data
  const analyticsData: AnalyticsCardData[] = [
    {
      title: 'Total Revenue',
      value: '$24,575',
      change: '+2.1%',
      changeType: 'up',
      subtitle: 'This month',
      icon: '💰',
    },
    {
      title: faithMode ? 'Kingdom Impact' : 'Content Engagement',
      value: '94,475',
      change: '+15.3%',
      changeType: 'up',
      subtitle: 'Total interactions',
      icon: faithMode ? '👑' : '📈',
    },
    {
      title: 'Active Products',
      value: '156',
      change: '-3.2%',
      changeType: 'down',
      subtitle: 'Live listings',
      icon: '📦',
    },
    {
      title: faithMode ? 'Faithful Followers' : 'Community Members',
      value: '62,745',
      change: '+8.7%',
      changeType: 'up',
      subtitle: 'Growing community',
      icon: faithMode ? '🙏' : '👥',
    },
  ];

  // Mock transaction data
  const recentTransactions: TransactionData[] = [
    {
      id: '1',
      name: 'Faith Collection Sale',
      platform: 'Etsy',
      amount: '+$89.00',
      status: 'completed',
      time: '2 hours ago',
      avatar: 'https://picsum.photos/50/50?random=1',
    },
    {
      id: '2',
      name: 'Kingdom T-Shirt',
      platform: 'Printify',
      amount: '+$24.99',
      status: 'pending',
      time: '5 hours ago',
      avatar: 'https://picsum.photos/50/50?random=2',
    },
    {
      id: '3',
      name: 'Digital Course',
      platform: 'Kingdom Studios',
      amount: '+$127.00',
      status: 'completed',
      time: '1 day ago',
      avatar: 'https://picsum.photos/50/50?random=3',
    },
    {
      id: '4',
      name: 'Premium Membership',
      platform: 'Kingdom Studios',
      amount: '+$29.99',
      status: 'completed',
      time: '2 days ago',
      avatar: 'https://picsum.photos/50/50?random=4',
    },
  ];

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Track logout event
      if (user) {
        AnalyticsService.getInstance().trackEvent('user_logout', 1, {
          source: 'dashboard',
          faithMode: faithMode,
          userId: user.id,
        });
      }

      await logout();
      Alert.alert('Success', 'Logged out successfully!');
      // Navigation will be handled automatically by AuthNavigator
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalyticsCard = (data: AnalyticsCardData, index: number) => (
    <View key={index} style={[styles.analyticsCard, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}>
      <LinearGradient
        colors={[KingdomColors.background.secondary, KingdomColors.primary.deepNavy]}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{data.icon}</Text>
          <View style={[
            styles.changeIndicator,
            data.changeType === 'up' ? styles.changeUp :
              data.changeType === 'down' ? styles.changeDown :
                styles.changeNeutral
          ]}>
            <Text style={styles.changeText}>{data.change}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardValue}>{data.value}</Text>
          <Text style={styles.cardTitle}>{data.title}</Text>
          <Text style={styles.cardSubtitle}>{data.subtitle}</Text>
        </View>

        {/* Mini chart placeholder */}
        <View style={styles.miniChart}>
          {[...Array(7)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.chartBar,
                {
                  height: Math.random() * 30 + 10,
                  backgroundColor: data.changeType === 'up'
                    ? KingdomColors.gold.bright
                    : data.changeType === 'down'
                      ? '#EF4444'
                      : KingdomColors.silver.bright,
                }
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );

  const renderTransactionItem = (transaction: TransactionData) => (
    <View key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={styles.transactionAvatar}>
          <Image source={{ uri: transaction.avatar }} style={styles.avatarImage} />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>{transaction.name}</Text>
          <Text style={styles.transactionPlatform}>{transaction.platform}</Text>
        </View>
      </View>

      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, { color: transaction.amount.startsWith('+') ? '#10B981' : '#EF4444' }]}>
          {transaction.amount}
        </Text>
        <Text style={styles.transactionTime}>{transaction.time}</Text>
        <View style={[
          styles.statusBadge,
          transaction.status === 'completed' ? styles.statusCompleted :
            transaction.status === 'pending' ? styles.statusPending :
              styles.statusFailed
        ]}>
          <Text style={styles.statusText}>{transaction.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[KingdomColors.primary.midnight, KingdomColors.primary.deepNavy]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.userSection}>
              <View style={styles.userAvatarContainer}>
                <Text style={styles.userAvatarText}>
                  {user?.name ? user.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() : user?.email?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.welcomeText}>
                  {getModeSpecificContent('Kingdom Blessings', 'Welcome back')}
                </Text>
                <Text style={styles.userName}>
                  {user?.name || user?.email?.split('@')[0] || 'Creator'}
                </Text>
                {currentMode === 'faith' && (
                  <Text style={styles.faithModeIndicator}>✝️ Faith Mode</Text>
                )}
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <Text style={styles.notificationIcon}>🔔</Text>
                <View style={styles.notificationBadge} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={KingdomColors.text.primary} size="small" />
                ) : (
                  <Text style={styles.logoutIcon}>⚙️</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <KingdomLogo size="small" style={styles.headerLogo} />

          {/* Mode Toggle */}
          <ModeToggle compact style={styles.modeToggle} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={KingdomColors.primary.royalPurple}
          />
        }
      >
        {/* Analytics Cards Grid */}
        <View style={styles.analyticsSection}>
          <Text style={styles.sectionTitle}>
            {getModeSpecificContent('Kingdom Analytics', 'Creator Analytics')}
          </Text>
          <View style={styles.analyticsGrid}>
            {analyticsData.map((data, index) => renderAnalyticsCard(data, index))}
          </View>
        </View>

        {/* Monthly Progress Chart Card */}
        <View style={styles.chartSection}>
          <LinearGradient
            colors={[KingdomColors.background.secondary, KingdomColors.primary.deepNavy]}
            style={styles.chartCard}
          >
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Monthly Progress</Text>
              <Text style={styles.chartSubtitle}>Total Growth of 60%</Text>
            </View>

            {/* Circular Progress Chart */}
            <View style={styles.circularChart}>
              <View style={styles.chartCenter}>
                <Text style={styles.chartMainValue}>$94,475</Text>
                <Text style={styles.chartLabel}>Total Revenue</Text>
              </View>

              {/* Progress Indicators */}
              <View style={styles.progressIndicators}>
                <View style={styles.progressItem}>
                  <View style={[styles.progressDot, { backgroundColor: KingdomColors.gold.bright }]} />
                  <Text style={styles.progressLabel}>Products 60%</Text>
                </View>
                <View style={styles.progressItem}>
                  <View style={[styles.progressDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.progressLabel}>Services 21%</Text>
                </View>
                <View style={styles.progressItem}>
                  <View style={[styles.progressDot, { backgroundColor: KingdomColors.silver.bright }]} />
                  <Text style={styles.progressLabel}>Courses 19%</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sales</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {recentTransactions.map(renderTransactionItem)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient
                colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>📦</Text>
                <Text style={styles.quickActionText}>Add Product</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient
                colors={[KingdomColors.silver.bright, KingdomColors.silver.steel]}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>📊</Text>
                <Text style={styles.quickActionText}>Analytics</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient
                colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>👥</Text>
                <Text style={styles.quickActionText}>Community</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient
                colors={[KingdomColors.accent.success, '#059669']}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>⚙️</Text>
                <Text style={styles.quickActionText}>Settings</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  // Header Styles
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    gap: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
  } as ImageStyle,
  userAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: KingdomColors.primary.royalPurple,
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  faithModeIndicator: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: KingdomColors.opacity.white10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: KingdomColors.opacity.white10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 20,
  },
  headerLogo: {
    alignSelf: 'center',
    marginTop: 10,
  },
  modeToggle: {
    alignSelf: 'center',
    marginTop: 8,
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Section Styles
  analyticsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },

  // Analytics Grid
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analyticsCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  cardLeft: {
    marginRight: 6,
  },
  cardRight: {
    marginLeft: 6,
  },
  cardGradient: {
    padding: 16,
    minHeight: 140,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  changeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeUp: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  changeDown: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  changeNeutral: {
    backgroundColor: KingdomColors.opacity.white10,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.primary,
  },
  cardContent: {
    flex: 1,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    marginTop: 12,
  },
  chartBar: {
    width: 3,
    borderRadius: 2,
    opacity: 0.8,
  },

  // Chart Section
  chartSection: {
    marginTop: 24,
  },
  chartCard: {
    borderRadius: 20,
    padding: 20,
    ...KingdomShadows.elegant,
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.muted,
  },
  circularChart: {
    alignItems: 'center',
    gap: 20,
  },
  chartCenter: {
    alignItems: 'center',
    backgroundColor: KingdomColors.opacity.white10,
    borderRadius: 60,
    width: 120,
    height: 120,
    justifyContent: 'center',
  },
  chartMainValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  chartLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    marginTop: 4,
  },
  progressIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  progressItem: {
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 10,
    color: KingdomColors.text.muted,
  },

  // Transactions
  transactionsSection: {
    marginTop: 24,
  },
  transactionsList: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    ...KingdomShadows.silver,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 2,
  },
  transactionPlatform: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionTime: {
    fontSize: 11,
    color: KingdomColors.text.muted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusFailed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    textTransform: 'uppercase',
  },

  // Quick Actions
  quickActionsSection: {
    marginTop: 24,
    marginBottom: 40,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.gold,
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
    minHeight: 100,
    justifyContent: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    textAlign: 'center',
  },
});

export default DashboardScreen;
