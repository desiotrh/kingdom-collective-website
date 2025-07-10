import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useDualMode } from '../../contexts/DualModeContext';
import { useTierSystem } from '../../contexts/TierSystemContext';

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  trialUsers: number;
  revenue: {
    monthly: number;
    yearly: number;
    total: number;
  };
  tierDistribution: Record<string, number>;
  churnRate: number;
  conversionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'upgrade' | 'downgrade' | 'trial_start' | 'trial_convert' | 'cancel';
  userId: string;
  userName: string;
  fromTier?: string;
  toTier?: string;
  timestamp: Date;
  amount?: number;
}

const AdminDashboardScreen: React.FC = () => {
  const { currentMode, colors } = useDualMode();
  const { availableTiers } = useTierSystem();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API calls
      // For now, using mock data
      const mockStats: AdminStats = {
        totalUsers: 12547,
        activeSubscriptions: 3421,
        trialUsers: 892,
        revenue: {
          monthly: 147560,
          yearly: 1654320,
          total: 1801880,
        },
        tierDistribution: {
          seed: 6234,
          rooted: 2143,
          commissioned: 987,
          mantled_pro: 234,
          kingdom_enterprise: 57,
        },
        churnRate: 4.2,
        conversionRate: 23.8,
      };

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'upgrade',
          userId: 'user_123',
          userName: 'John Smith',
          fromTier: 'rooted',
          toTier: 'commissioned',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          amount: 50,
        },
        {
          id: '2',
          type: 'trial_start',
          userId: 'user_456',
          userName: 'Sarah Johnson',
          toTier: 'commissioned',
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
        },
        {
          id: '3',
          type: 'trial_convert',
          userId: 'user_789',
          userName: 'David Wilson',
          fromTier: 'commissioned',
          toTier: 'commissioned',
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          amount: 500,
        },
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      Alert.alert('Error', 'Failed to load admin dashboard data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAdminData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'upgrade': return 'trending-up';
      case 'downgrade': return 'trending-down';
      case 'trial_start': return 'play-circle';
      case 'trial_convert': return 'check-circle';
      case 'cancel': return 'x-circle';
      default: return 'activity';
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'upgrade': return '#10B981';
      case 'downgrade': return '#F59E0B';
      case 'trial_start': return '#3B82F6';
      case 'trial_convert': return '#10B981';
      case 'cancel': return '#EF4444';
      default: return colors.text;
    }
  };

  if (isLoading && !stats) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading admin dashboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={currentMode === 'faith' ? ['#1E3A8A', '#3B82F6'] : ['#065F46', '#10B981']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Kingdom Studios Management</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Revenue Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenue Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {formatCurrency(stats?.revenue.monthly || 0)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Monthly Revenue
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {formatCurrency(stats?.revenue.yearly || 0)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Yearly Revenue
              </Text>
            </View>
          </View>
        </View>

        {/* User Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>User Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {stats?.totalUsers.toLocaleString() || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Users
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {stats?.activeSubscriptions.toLocaleString() || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Active Subscribers
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {stats?.trialUsers.toLocaleString() || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Trial Users
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {stats?.conversionRate || 0}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Trial Conversion
              </Text>
            </View>
          </View>
        </View>

        {/* Tier Distribution */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tier Distribution</Text>
          <View style={[styles.tierDistribution, { backgroundColor: colors.surface }]}>
            {Object.entries(stats?.tierDistribution || {}).map(([tierKey, count]) => {
              const tier = availableTiers[tierKey as keyof typeof availableTiers];
              if (!tier) return null;
              
              const percentage = ((count / (stats?.totalUsers || 1)) * 100).toFixed(1);
              
              return (
                <View key={tierKey} style={styles.tierRow}>
                  <View style={styles.tierInfo}>
                    <Text style={[styles.tierName, { color: colors.text }]}>
                      {tier.biblicalName}
                    </Text>
                    <Text style={[styles.tierCount, { color: colors.textSecondary }]}>
                      {count.toLocaleString()} users ({percentage}%)
                    </Text>
                  </View>
                  <View style={[styles.tierBar, { backgroundColor: colors.border }]}>
                    <View 
                      style={[
                        styles.tierBarFill, 
                        { 
                          backgroundColor: colors.primary,
                          width: `${percentage}%`,
                        }
                      ]} 
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          <View style={[styles.activityList, { backgroundColor: colors.surface }]}>
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Feather
                    name={getActivityIcon(activity.type)}
                    size={20}
                    color={getActivityColor(activity.type)}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityText, { color: colors.text }]}>
                    {activity.userName} 
                    {activity.type === 'upgrade' && ` upgraded from ${activity.fromTier} to ${activity.toTier}`}
                    {activity.type === 'downgrade' && ` downgraded from ${activity.fromTier} to ${activity.toTier}`}
                    {activity.type === 'trial_start' && ` started trial for ${activity.toTier}`}
                    {activity.type === 'trial_convert' && ` converted trial to ${activity.toTier}`}
                    {activity.type === 'cancel' && ` canceled subscription`}
                  </Text>
                  <View style={styles.activityMeta}>
                    <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                      {formatTimeAgo(activity.timestamp)}
                    </Text>
                    {activity.amount && (
                      <Text style={[styles.activityAmount, { color: colors.primary }]}>
                        {formatCurrency(activity.amount)}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => {/* Navigate to user management */}}
            >
              <MaterialIcons name="people" size={24} color={colors.primary} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>
                Manage Users
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => {/* Navigate to subscription management */}}
            >
              <MaterialIcons name="subscriptions" size={24} color={colors.primary} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>
                Subscriptions
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => {/* Navigate to discount management */}}
            >
              <MaterialIcons name="local-offer" size={24} color={colors.primary} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>
                Discounts
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => {/* Navigate to analytics */}}
            >
              <MaterialIcons name="analytics" size={24} color={colors.primary} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>
                Analytics
              </Text>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    padding: 24,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  tierDistribution: {
    padding: 16,
    borderRadius: 12,
  },
  tierRow: {
    marginBottom: 16,
  },
  tierInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tierName: {
    fontSize: 16,
    fontWeight: '600',
  },
  tierCount: {
    fontSize: 14,
  },
  tierBar: {
    height: 6,
    borderRadius: 3,
  },
  tierBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  activityList: {
    padding: 16,
    borderRadius: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 12,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: 150,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default AdminDashboardScreen;
