import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useDualMode } from '../../contexts/DualModeContext';
import { useTierSystem, TierType } from '../../contexts/TierSystemContext';

interface User {
  id: string;
  email: string;
  name: string;
  tier: TierType;
  status: 'active' | 'trial' | 'past_due' | 'canceled';
  joinDate: Date;
  lastActive: Date;
  trialEnd?: Date;
  subscriptionEnd?: Date;
  revenue: number;
  country: string;
}

interface UserFilter {
  tier?: TierType;
  status?: string;
  search?: string;
}

const AdminUserManagementScreen: React.FC = () => {
  const { currentMode, colors } = useDualMode();
  const { availableTiers, adminSetTier, adminApplyDiscount } = useTierSystem();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<UserFilter>({});
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountMonths, setDiscountMonths] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchText, selectedFilter]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      // Mock data for demonstration
      const mockUsers: User[] = [
        {
          id: 'user_001',
          email: 'john.smith@email.com',
          name: 'John Smith',
          tier: 'commissioned',
          status: 'active',
          joinDate: new Date('2023-01-15'),
          lastActive: new Date('2024-01-10'),
          subscriptionEnd: new Date('2024-02-15'),
          revenue: 500,
          country: 'US',
        },
        {
          id: 'user_002',
          email: 'sarah.johnson@email.com',
          name: 'Sarah Johnson',
          tier: 'rooted',
          status: 'trial',
          joinDate: new Date('2024-01-01'),
          lastActive: new Date('2024-01-09'),
          trialEnd: new Date('2024-01-15'),
          revenue: 0,
          country: 'CA',
        },
        {
          id: 'user_003',
          email: 'david.wilson@email.com',
          name: 'David Wilson',
          tier: 'mantled_pro',
          status: 'active',
          joinDate: new Date('2023-06-10'),
          lastActive: new Date('2024-01-08'),
          subscriptionEnd: new Date('2024-06-10'),
          revenue: 960,
          country: 'UK',
        },
        // Add more mock users...
      ];

      setUsers(mockUsers);
      
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    // Tier filter
    if (selectedFilter.tier) {
      filtered = filtered.filter(user => user.tier === selectedFilter.tier);
    }

    // Status filter
    if (selectedFilter.status) {
      filtered = filtered.filter(user => user.status === selectedFilter.status);
    }

    setFilteredUsers(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleUserPress = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleTierChange = async (userId: string, newTier: TierType) => {
    try {
      await adminSetTier(userId, newTier, 'Admin tier change');
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, tier: newTier } : user
      ));
      
      Alert.alert('Success', 'User tier updated successfully');
      setShowUserModal(false);
      
    } catch (error) {
      console.error('Error updating user tier:', error);
      Alert.alert('Error', 'Failed to update user tier');
    }
  };

  const handleApplyDiscount = async () => {
    if (!selectedUser || !discountPercent || !discountMonths) {
      Alert.alert('Error', 'Please fill in all discount fields');
      return;
    }

    try {
      await adminApplyDiscount(
        selectedUser.id,
        parseInt(discountPercent),
        parseInt(discountMonths)
      );
      
      Alert.alert('Success', 'Discount applied successfully');
      setShowDiscountModal(false);
      setDiscountPercent('');
      setDiscountMonths('');
      
    } catch (error) {
      console.error('Error applying discount:', error);
      Alert.alert('Error', 'Failed to apply discount');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'trial': return '#3B82F6';
      case 'past_due': return '#F59E0B';
      case 'canceled': return '#EF4444';
      default: return colors.textSecondary;
    }
  };

  const getTierColor = (tier: TierType) => {
    switch (tier) {
      case 'seed': return '#6B7280';
      case 'rooted': return '#059669';
      case 'commissioned': return '#DC2626';
      case 'mantled_pro': return '#7C3AED';
      case 'kingdom_enterprise': return '#1F2937';
      default: return colors.primary;
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading users...
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
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>
          {filteredUsers.length} of {users.length} users
        </Text>
      </LinearGradient>

      {/* Search and Filters */}
      <View style={[styles.searchSection, { backgroundColor: colors.surface }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
          <Feather name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search users by name or email..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              { backgroundColor: !selectedFilter.tier ? colors.primary : colors.border },
            ]}
            onPress={() => setSelectedFilter(prev => ({ ...prev, tier: undefined }))}
          >
            <Text style={[
              styles.filterChipText,
              { color: !selectedFilter.tier ? 'white' : colors.text },
            ]}>
              All Tiers
            </Text>
          </TouchableOpacity>
          
          {Object.values(availableTiers).map((tier) => (
            <TouchableOpacity
              key={tier.id}
              style={[
                styles.filterChip,
                { 
                  backgroundColor: selectedFilter.tier === tier.id 
                    ? colors.primary 
                    : colors.border 
                },
              ]}
              onPress={() => setSelectedFilter(prev => ({ 
                ...prev, 
                tier: prev.tier === tier.id ? undefined : tier.id 
              }))}
            >
              <Text style={[
                styles.filterChipText,
                { 
                  color: selectedFilter.tier === tier.id 
                    ? 'white' 
                    : colors.text 
                },
              ]}>
                {tier.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* User List */}
      <ScrollView
        style={styles.userList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredUsers.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={[styles.userCard, { backgroundColor: colors.surface }]}
            onPress={() => handleUserPress(user)}
          >
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {user.name}
                </Text>
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                  {user.email}
                </Text>
              </View>
              <View style={styles.userMeta}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(user.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(user.status) }
                  ]}>
                    {user.status}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.userDetails}>
              <View style={styles.userStat}>
                <Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
                  Tier
                </Text>
                <View style={[
                  styles.tierBadge,
                  { backgroundColor: getTierColor(user.tier) + '20' }
                ]}>
                  <Text style={[
                    styles.tierText,
                    { color: getTierColor(user.tier) }
                  ]}>
                    {availableTiers[user.tier]?.name || user.tier}
                  </Text>
                </View>
              </View>
              
              <View style={styles.userStat}>
                <Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
                  Revenue
                </Text>
                <Text style={[styles.userStatValue, { color: colors.text }]}>
                  {formatCurrency(user.revenue)}
                </Text>
              </View>
              
              <View style={styles.userStat}>
                <Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
                  Joined
                </Text>
                <Text style={[styles.userStatValue, { color: colors.text }]}>
                  {formatDate(user.joinDate)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* User Detail Modal */}
      <Modal
        visible={showUserModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              User Details
            </Text>
            <TouchableOpacity onPress={() => setShowUserModal(false)}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {selectedUser && (
            <ScrollView style={styles.modalContent}>
              <View style={[styles.modalSection, { backgroundColor: colors.surface }]}>
                <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
                  Basic Information
                </Text>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                  Name: {selectedUser.name}
                </Text>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                  Email: {selectedUser.email}
                </Text>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                  Country: {selectedUser.country}
                </Text>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                  Total Revenue: {formatCurrency(selectedUser.revenue)}
                </Text>
              </View>
              
              <View style={[styles.modalSection, { backgroundColor: colors.surface }]}>
                <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
                  Subscription Management
                </Text>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                  Current Tier: {availableTiers[selectedUser.tier]?.biblicalName}
                </Text>
                
                <Text style={[styles.modalSubtitle, { color: colors.text }]}>
                  Change Tier:
                </Text>
                <View style={styles.tierButtons}>
                  {Object.values(availableTiers).map((tier) => (
                    <TouchableOpacity
                      key={tier.id}
                      style={[
                        styles.tierButton,
                        { 
                          backgroundColor: selectedUser.tier === tier.id 
                            ? colors.primary 
                            : colors.border 
                        },
                      ]}
                      onPress={() => handleTierChange(selectedUser.id, tier.id)}
                      disabled={selectedUser.tier === tier.id}
                    >
                      <Text style={[
                        styles.tierButtonText,
                        { 
                          color: selectedUser.tier === tier.id 
                            ? 'white' 
                            : colors.text 
                        },
                      ]}>
                        {tier.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={[styles.modalSection, { backgroundColor: colors.surface }]}>
                <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
                  Actions
                </Text>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  onPress={() => setShowDiscountModal(true)}
                >
                  <Text style={styles.actionButtonText}>Apply Discount</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}
                  onPress={() => {
                    Alert.alert(
                      'Extend Trial',
                      'This feature will be implemented with backend integration'
                    );
                  }}
                >
                  <Text style={styles.actionButtonText}>Extend Trial</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                  onPress={() => {
                    Alert.alert(
                      'Suspend User',
                      'Are you sure you want to suspend this user?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Suspend', style: 'destructive' },
                      ]
                    );
                  }}
                >
                  <Text style={styles.actionButtonText}>Suspend User</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Discount Modal */}
      <Modal
        visible={showDiscountModal}
        animationType="slide"
        presentationStyle="formSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Apply Discount
            </Text>
            <TouchableOpacity onPress={() => setShowDiscountModal(false)}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={[styles.inputGroup, { backgroundColor: colors.surface }]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Discount Percentage (%)
              </Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="e.g., 25"
                placeholderTextColor={colors.textSecondary}
                value={discountPercent}
                onChangeText={setDiscountPercent}
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.inputGroup, { backgroundColor: colors.surface }]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Duration (months)
              </Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="e.g., 3"
                placeholderTextColor={colors.textSecondary}
                value={discountMonths}
                onChangeText={setDiscountMonths}
                keyboardType="numeric"
              />
            </View>
            
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={handleApplyDiscount}
            >
              <Text style={styles.applyButtonText}>Apply Discount</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  searchSection: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterScroll: {
    marginTop: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  userList: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  userMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userStat: {
    alignItems: 'center',
  },
  userStatLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  userStatValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  tierButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tierButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tierButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  applyButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminUserManagementScreen;
