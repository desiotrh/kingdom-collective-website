import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Switch,
  Linking,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { app } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useAppNavigation } from '../utils/navigationUtils';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';

const { width } = Dimensions.get('window');

const SettingsScreen = () => {
  const { user } = useAuth();
  const { faithMode, setFaithMode } = useFaithMode();
  const navigation = useAppNavigation();
  const auth = getAuth(app);
  
  const [loading, setLoading] = useState(false);

  const handleFaithModeToggle = async (value: boolean) => {
    try {
      await setFaithMode(value);
      
      // Show feedback to user
      Alert.alert(
        'Faith Mode Updated',
        value 
          ? 'You will now receive faith-based encouragement throughout the app.' 
          : 'Faith Mode has been disabled. You will see neutral guidance.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error updating faith mode:', error);
      Alert.alert('Error', 'Failed to save setting. Please try again.');
    }
  };

  const handleContactSupport = () => {
    const email = 'Desirea@ontheroadhomeministries.com';
    const subject = 'Kingdom Studios App Support';
    const body = 'Hello Desirea,\n\nI need help with the Kingdom Studios app.\n\n';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert(
        'Email App Not Found',
        `Please send an email to:\n${email}`,
        [
          {
            text: 'Copy Email',
            onPress: () => {
              // In a real app, you'd use Clipboard API here
              Alert.alert('Email Address', email);
            }
          },
          { text: 'OK' }
        ]
      );
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await signOut(auth);
              Alert.alert('Success', 'Logged out successfully!');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getAppVersion = () => {
    return Constants.expoConfig?.version || Constants.manifest?.version || '1.0.0';
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Settings</Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderFaithModeSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Faith Mode</Text>
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Faith Mode</Text>
          <Text style={styles.settingDescription}>
            {faithMode 
              ? 'Receive faith-based encouragement and scripture throughout the app.'
              : 'Use the app in Creator Mode with neutral guidance.'
            }
          </Text>
        </View>
        <Switch
          value={faithMode}
          onValueChange={handleFaithModeToggle}
          trackColor={{ false: '#333333', true: '#3b82f6' }}
          thumbColor={faithMode ? '#ffffff' : '#cccccc'}
          ios_backgroundColor="#333333"
        />
      </View>
    </View>
  );

  const renderAccountSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account Information</Text>
      <View style={styles.accountInfo}>
        <View style={styles.accountRow}>
          <Text style={styles.accountLabel}>Name:</Text>
          <Text style={styles.accountValue}>
            {user?.displayName || 'Not set'}
          </Text>
        </View>
        <View style={styles.accountRow}>
          <Text style={styles.accountLabel}>Email:</Text>
          <Text style={styles.accountValue}>
            {user?.email || 'Not set'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => Alert.alert('Coming Soon', 'Edit Profile feature will be available soon!')}
          activeOpacity={0.8}
        >
          <Text style={styles.editProfileText}>Edit Profile (Coming Soon)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSupportSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact & Support</Text>
      <TouchableOpacity
        style={styles.supportButton}
        onPress={handleContactSupport}
        activeOpacity={0.8}
      >
        <Text style={styles.supportButtonIcon}>📧</Text>
        <Text style={styles.supportButtonText}>Contact Support</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
      <Text style={styles.supportDescription}>
        Need help? Reach out to Desirea for support with Kingdom Studios.
      </Text>
    </View>
  );

  const renderAppInfoSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>App Information</Text>
      <View style={styles.appInfo}>
        <Text style={styles.appInfoLabel}>Version:</Text>
        <Text style={styles.appInfoValue}>{getAppVersion()}</Text>
      </View>
    </View>
  );

  const renderLogoutSection = () => (
    <View style={styles.section}>
      <TouchableOpacity
        style={[styles.logoutButton, loading && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutButtonText}>
          {loading ? 'Logging out...' : 'Logout'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSettingCard = (icon: string, title: string, description: string, onPress: () => void, rightElement?: React.ReactNode) => (
    <TouchableOpacity style={styles.settingCard} onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={[KingdomColors.background.secondary, KingdomColors.primary.deepNavy]}
        style={styles.settingGradient}
      >
        <View style={styles.settingContent}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Text style={styles.settingEmoji}>{icon}</Text>
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{title}</Text>
              <Text style={styles.settingDescription}>{description}</Text>
            </View>
          </View>
          <View style={styles.settingRight}>
            {rightElement || <Text style={styles.settingArrow}>›</Text>}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header */}
      <LinearGradient
        colors={[KingdomColors.primary.midnight, KingdomColors.primary.deepNavy]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <KingdomLogo size="small" />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        
        <View style={styles.headerSpacer} />
      </LinearGradient>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileCard}>
            <LinearGradient
              colors={[KingdomColors.background.secondary, KingdomColors.primary.deepNavy]}
              style={styles.profileGradient}
            >
              <Image
                source={{ uri: user?.photoURL || 'https://picsum.photos/100/100?random=user' }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {user?.displayName || user?.email?.split('@')[0] || 'Kingdom Creator'}
                </Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
                <View style={styles.profileBadge}>
                  <Text style={styles.profileBadgeText}>
                    {faithMode ? '👑 Kingdom Member' : '✨ Creator'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Faith Mode Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {faithMode ? 'Kingdom Settings' : 'App Settings'}
          </Text>
          
          {renderSettingCard(
            faithMode ? '🙏' : '⚙️',
            faithMode ? 'Kingdom Faith Mode' : 'Faith Mode',
            faithMode ? 'Receiving faith-based encouragement' : 'Enable faith-based guidance',
            () => {},
            <Switch
              value={faithMode}
              onValueChange={handleFaithModeToggle}
              trackColor={{ false: KingdomColors.opacity.white20, true: KingdomColors.gold.bright }}
              thumbColor={faithMode ? KingdomColors.gold.warm : KingdomColors.silver.bright}
            />
          )}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {renderSettingCard(
            '👤',
            'Edit Profile',
            'Update your profile information',
            () => Alert.alert('Coming Soon', 'Profile editing coming soon!')
          )}
          
          {renderSettingCard(
            faithMode ? '✝️' : '🤝',
            faithMode ? 'Become a Forge Guide' : 'Become a Mentor',
            faithMode ? 'Share your calling to guide others' : 'Help others grow their skills',
            () => navigation.navigate('MentorOnboarding')
          )}
          
          {renderSettingCard(
            '🔔',
            'Notifications',
            'Manage your notification preferences',
            () => Alert.alert('Coming Soon', 'Notification settings coming soon!')
          )}
          
          {renderSettingCard(
            '🔒',
            'Privacy & Security',
            'Manage your privacy settings',
            () => Alert.alert('Coming Soon', 'Privacy settings coming soon!')
          )}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          {renderSettingCard(
            '📧',
            'Contact Support',
            'Get help from our team',
            handleContactSupport
          )}
          
          {renderSettingCard(
            '📋',
            'Terms & Conditions',
            'Read our terms and conditions',
            () => Alert.alert('Coming Soon', 'Terms & Conditions coming soon!')
          )}
          
          {renderSettingCard(
            '🛡️',
            'Privacy Policy',
            'View our privacy policy',
            () => Alert.alert('Coming Soon', 'Privacy Policy coming soon!')
          )}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.infoCard}>
            <LinearGradient
              colors={[KingdomColors.background.secondary, KingdomColors.primary.deepNavy]}
              style={styles.infoGradient}
            >
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Version</Text>
                <Text style={styles.infoValue}>{Constants.expoConfig?.version || '1.0.0'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Build</Text>
                <Text style={styles.infoValue}>{Constants.expoConfig?.extra?.buildNumber || '1'}</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={['#DC2626', '#B91C1C']}
              style={styles.logoutGradient}
            >
              <Text style={styles.logoutIcon}>👋</Text>
              <Text style={styles.logoutText}>
                {loading ? 'Logging out...' : 'Logout'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {/* Footer spacing */}
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  settingCard: {
    marginBottom: 12,
  },
  settingGradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingEmoji: {
    fontSize: 20,
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  settingRight: {
    alignItems: 'center',
  },
  settingArrow: {
    fontSize: 20,
    color: '#666666',
    fontWeight: '300',
  },
  headerCenter: {
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 24,
  },
  profileGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    alignSelf: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 8,
  },
  profileBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  profileBadgeText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  accountInfo: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountLabel: {
    fontSize: 16,
    color: '#cccccc',
    fontWeight: '500',
  },
  accountValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  editProfileButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 12,
  },
  supportButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  supportButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    flex: 1,
  },
  chevron: {
    fontSize: 20,
    color: '#666666',
    fontWeight: '300',
  },
  supportDescription: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 20,
  },
  appInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  appInfoLabel: {
    fontSize: 16,
    color: '#cccccc',
    fontWeight: '500',
  },
  appInfoValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 24,
  },
  infoGradient: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#cccccc',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dc2626',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  logoutGradient: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
  },
  logoutIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    height: 20,
  },
});

export default SettingsScreen;
