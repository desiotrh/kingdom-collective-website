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
  Switch,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import {
  User,
  UserManagementFilters,
  BulkAction,
  AdminApiResponse,
  UserRole,
  AccountStatus,
} from '../types/admin';

interface UserManagementScreenProps {
  navigation: any;
}

const UserManagementScreen: React.FC<UserManagementScreenProps> = ({ navigation }) => {
  const { isDualMode, currentMode } = useDualMode();
  const isFaithMode = currentMode === 'faith';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<UserManagementFilters>({
    sortBy: 'created',
    sortOrder: 'desc',
  });

  const currentColors = isDualMode 
    ? (isFaithMode ? KingdomColors.faith : KingdomColors.encouragement)
    : KingdomColors.default;

  // Mock users data
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      displayName: 'John Doe',
      role: 'user',
      isVerified: true,
      accountStatus: 'active',
      createdAt: new Date('2024-01-15'),
      lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      flagCount: 0,
      warningCount: 0,
      subscriptionTier: 'pro',
      faithMode: true,
      encouragementMode: false,
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      displayName: 'Jane Smith',
      role: 'creator',
      isVerified: true,
      accountStatus: 'active',
      createdAt: new Date('2024-01-20'),
      lastLoginAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      flagCount: 1,
      warningCount: 0,
      subscriptionTier: 'enterprise',
      faithMode: false,
      encouragementMode: true,
    },
    {
      id: '3',
      email: 'mike.johnson@example.com',
      displayName: 'Mike Johnson',
      role: 'mentor',
      isVerified: true,
      accountStatus: 'suspended',
      createdAt: new Date('2024-01-10'),
      lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      flagCount: 3,
      warningCount: 2,
      subscriptionTier: 'basic',
      faithMode: true,
      encouragementMode: true,
    },
    {
      id: '4',
      email: 'sarah.wilson@example.com',
      displayName: 'Sarah Wilson',
      role: 'moderator',
      isVerified: true,
      accountStatus: 'active',
      createdAt: new Date('2023-12-05'),
      lastLoginAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      flagCount: 0,
      warningCount: 0,
      subscriptionTier: 'pro',
      faithMode: true,
      encouragementMode: false,
    },
  ];

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      // Mock API call
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const handleBulkAction = async (action: BulkAction) => {
    try {
      // Mock bulk action
      console.log('Performing bulk action:', action);
      
      Alert.alert('Success', `Bulk action ${action.type} completed successfully`);
      setSelectedUsers(new Set());
      setShowBulkActions(false);
      loadUsers(); // Refresh data
    } catch (error) {
      console.error('Error performing bulk action:', error);
      Alert.alert('Error', 'Failed to perform bulk action');
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      // Mock user action
      console.log(`${action} user ${userId}`);
      
      Alert.alert('Success', `User ${action}ed successfully`);
      setShowUserModal(false);
      setSelectedUser(null);
      loadUsers(); // Refresh data
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      Alert.alert('Error', `Failed to ${action} user`);
    }
  };

  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const getStatusColor = (status: AccountStatus) => {
    switch (status) {
      case 'active': return currentColors.success;
      case 'suspended': return currentColors.warning;
      case 'banned': return currentColors.error;
      case 'pending': return currentColors.info;
      case 'deactivated': return currentColors.textSecondary;
      default: return currentColors.textSecondary;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': 
      case 'superAdmin': return currentColors.error;
      case 'moderator': return currentColors.warning;
      case 'mentor': return currentColors.info;
      case 'creator': return currentColors.primary;
      case 'user': return currentColors.textSecondary;
      default: return currentColors.textSecondary;
    }
  };

  const renderUserCard = (user: User) => (
    <TouchableOpacity
      key={user.id}
      style={[styles.userCard, { borderColor: currentColors.border }]}
      onPress={() => openUserModal(user)}
      onLongPress={() => toggleUserSelection(user.id)}
    >
      <View style={styles.userCardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={[styles.userName, { color: currentColors.text }]}>
              {user.displayName}
            </Text>
            {selectedUsers.has(user.id) && (
              <View style={[styles.selectedBadge, { backgroundColor: currentColors.primary }]}>
                <Text style={styles.selectedBadgeText}>✓</Text>
              </View>
            )}
          </View>
          <Text style={[styles.userEmail, { color: currentColors.textSecondary }]}>
            {user.email}
          </Text>
        </View>
        
        <View style={styles.userBadges}>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
            <Text style={styles.badgeText}>{user.role.toUpperCase()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.accountStatus) }]}>
            <Text style={styles.badgeText}>{user.accountStatus.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.userStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: currentColors.textSecondary }]}>Flags</Text>
          <Text style={[styles.statValue, { color: user.flagCount > 0 ? currentColors.error : currentColors.text }]}>
            {user.flagCount}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: currentColors.textSecondary }]}>Warnings</Text>
          <Text style={[styles.statValue, { color: user.warningCount > 0 ? currentColors.warning : currentColors.text }]}>
            {user.warningCount}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: currentColors.textSecondary }]}>Tier</Text>
          <Text style={[styles.statValue, { color: currentColors.primary }]}>
            {user.subscriptionTier}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: currentColors.textSecondary }]}>Last Login</Text>
          <Text style={[styles.statValue, { color: currentColors.text }]}>
            {user.lastLoginAt.toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.userModes}>
        <Text style={[styles.modesLabel, { color: currentColors.textSecondary }]}>Modes:</Text>
        {user.faithMode && (
          <View style={[styles.modeBadge, { backgroundColor: KingdomColors.faith.primary }]}>
            <Text style={styles.modeText}>✝️ Faith</Text>
          </View>
        )}
        {user.encouragementMode && (
          <View style={[styles.modeBadge, { backgroundColor: KingdomColors.encouragement.primary }]}>
            <Text style={styles.modeText}>💪 Encouragement</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderBulkActionsModal = () => (
    <Modal
      visible={showBulkActions}
      transparent
      animationType="slide"
      onRequestClose={() => setShowBulkActions(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: currentColors.surface }]}>
          <Text style={[styles.modalTitle, { color: currentColors.text }]}>
            Bulk Actions ({selectedUsers.size} users)
          </Text>
          
          <View style={styles.bulkActionButtons}>
            <TouchableOpacity
              style={[styles.bulkActionButton, { backgroundColor: currentColors.warning }]}
              onPress={() => handleBulkAction({
                type: 'suspend',
                userIds: Array.from(selectedUsers),
                reason: 'Bulk suspension',
                duration: 7,
              })}
            >
              <Text style={styles.bulkActionText}>⏸️ Suspend (7 days)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.bulkActionButton, { backgroundColor: currentColors.error }]}
              onPress={() => handleBulkAction({
                type: 'ban',
                userIds: Array.from(selectedUsers),
                reason: 'Bulk ban',
              })}
            >
              <Text style={styles.bulkActionText}>🚫 Ban</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.bulkActionButton, { backgroundColor: currentColors.info }]}
              onPress={() => handleBulkAction({
                type: 'warn',
                userIds: Array.from(selectedUsers),
                reason: 'Bulk warning',
              })}
            >
              <Text style={styles.bulkActionText}>⚠️ Warn</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.bulkActionButton, { backgroundColor: currentColors.success }]}
              onPress={() => handleBulkAction({
                type: 'verify',
                userIds: Array.from(selectedUsers),
                reason: 'Bulk verification',
              })}
            >
              <Text style={styles.bulkActionText}>✅ Verify</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: currentColors.textSecondary }]}
            onPress={() => setShowBulkActions(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderUserModal = () => (
    <Modal
      visible={showUserModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowUserModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: currentColors.surface }]}>
          {selectedUser && (
            <>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: currentColors.text }]}>
                  User Details
                </Text>
                <TouchableOpacity
                  onPress={() => setShowUserModal(false)}
                  style={styles.closeButton}
                >
                  <Text style={[styles.closeButtonText, { color: currentColors.textSecondary }]}>×</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.userDetails}>
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Name</Text>
                  <Text style={[styles.detailValue, { color: currentColors.text }]}>
                    {selectedUser.displayName}
                  </Text>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Email</Text>
                  <Text style={[styles.detailValue, { color: currentColors.text }]}>
                    {selectedUser.email}
                  </Text>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Role</Text>
                  <Text style={[styles.detailValue, { color: getRoleColor(selectedUser.role) }]}>
                    {selectedUser.role}
                  </Text>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Status</Text>
                  <Text style={[styles.detailValue, { color: getStatusColor(selectedUser.accountStatus) }]}>
                    {selectedUser.accountStatus}
                  </Text>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Created</Text>
                  <Text style={[styles.detailValue, { color: currentColors.text }]}>
                    {selectedUser.createdAt.toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: currentColors.textSecondary }]}>Last Login</Text>
                  <Text style={[styles.detailValue, { color: currentColors.text }]}>
                    {selectedUser.lastLoginAt.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.userActionButtons}>
                  {selectedUser.accountStatus === 'active' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: currentColors.warning }]}
                      onPress={() => handleUserAction(selectedUser.id, 'suspend')}
                    >
                      <Text style={styles.actionButtonText}>⏸️ Suspend</Text>
                    </TouchableOpacity>
                  )}
                  
                  {selectedUser.accountStatus !== 'banned' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: currentColors.error }]}
                      onPress={() => handleUserAction(selectedUser.id, 'ban')}
                    >
                      <Text style={styles.actionButtonText}>🚫 Ban</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: currentColors.info }]}
                    onPress={() => handleUserAction(selectedUser.id, 'warn')}
                  >
                    <Text style={styles.actionButtonText}>⚠️ Warn</Text>
                  </TouchableOpacity>
                  
                  {!selectedUser.isVerified && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: currentColors.success }]}
                      onPress={() => handleUserAction(selectedUser.id, 'verify')}
                    >
                      <Text style={styles.actionButtonText}>✅ Verify</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentColors.text }]}>
          {isDualMode && isFaithMode ? '✝️ User Management' : '👥 User Management'}
        </Text>
        <Text style={[styles.subtitle, { color: currentColors.textSecondary }]}>
          Manage user accounts and permissions
        </Text>
      </View>

      {/* Search and Actions */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { 
            borderColor: currentColors.border,
            color: currentColors.text,
            backgroundColor: currentColors.surface,
          }]}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search users..."
          placeholderTextColor={currentColors.textSecondary}
        />
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: currentColors.primary }]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Text style={[styles.filterButtonText, { color: currentColors.surface }]}>
              🔍 Filter
            </Text>
          </TouchableOpacity>
          
          {selectedUsers.size > 0 && (
            <TouchableOpacity
              style={[styles.bulkButton, { backgroundColor: currentColors.warning }]}
              onPress={() => setShowBulkActions(true)}
            >
              <Text style={[styles.bulkButtonText, { color: currentColors.surface }]}>
                ⚡ Bulk ({selectedUsers.size})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* User List */}
      <ScrollView
        style={styles.userList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.userCount, { color: currentColors.textSecondary }]}>
          {filteredUsers.length} users found
        </Text>
        
        {filteredUsers.map(renderUserCard)}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modals */}
      {renderBulkActionsModal()}
      {renderUserModal()}
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
  searchContainer: {
    padding: 20,
    paddingTop: 0,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bulkButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  bulkButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  userList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCount: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  userCard: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
  },
  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  selectedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  selectedBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
  },
  userBadges: {
    alignItems: 'flex-end',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
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
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  userModes: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  modesLabel: {
    fontSize: 12,
    marginRight: 8,
  },
  modeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  modeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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
  bulkActionButtons: {
    marginBottom: 20,
  },
  bulkActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  bulkActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userDetails: {
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
  userActionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default React.memo(UserManagementScreen);
