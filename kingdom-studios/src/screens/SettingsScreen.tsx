import React, { useState, useEffect } from 'react';
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
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/UnifiedAuthContext';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useDualMode } from '../contexts/DualModeContext';
import { useAppNavigation } from '../utils/navigationUtils';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';
import KingdomLogo from '../components/KingdomLogo';
import ModeToggle from '../components/ModeToggle';
import { KingdomStudiosApiService } from '../services/unifiedApiService';

const { width } = Dimensions.get('window');

const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const { faithMode, setFaithMode } = useFaithMode();
  const {
    currentMode,
    userTier,
    modeConfig,
    getModeSpecificContent,
    isDualMode,
    setDualMode
  } = useDualMode();
  const navigation = useAppNavigation();
  const apiService = KingdomStudiosApiService.getInstance();

  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [apiConfig, setApiConfig] = useState<APIConfiguration>({
    openaiApiKey: '',
    openrouterApiKey: '',
    etsyApiKey: '',
    printifyApiKey: '',
    shopifyApiKey: '',
    shopifyStoreUrl: '',
    stripePublishableKey: '',
    mailchimpApiKey: '',
  });
  const [showApiKeys, setShowApiKeys] = useState(false);

  useEffect(() => {
    loadApiConfiguration();
  }, []);

  const loadApiConfiguration = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem('api_configuration');
      if (savedConfig) {
        setApiConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Error loading API configuration:', error);
    }
  };

  const saveApiConfiguration = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('api_configuration', JSON.stringify(apiConfig));
      Alert.alert('Success', 'API configuration saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save API configuration');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  interface APIConfiguration {
    openaiApiKey: string;
    openrouterApiKey: string;
    etsyApiKey: string;
    printifyApiKey: string;
    shopifyApiKey: string;
    shopifyStoreUrl: string;
    stripePublishableKey: string;
    mailchimpApiKey: string;
  }

  useEffect(() => {
    const fetchApiConfig = async () => {
      try {
        const configString = await AsyncStorage.getItem('apiConfig');
        if (configString) {
          const config = JSON.parse(configString);
          setApiConfig(config);
        }
      } catch (error) {
        console.error('Error fetching API config:', error);
      }
    };

    fetchApiConfig();
  }, []);

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
    const email = 'support@kingdomcollective.pro';
    const subject = 'Kingdom Studios App Support';
    const body = 'Hello Kingdom Studios Support Team,\n\nI need help with the Kingdom Studios app.\n\n';

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
    setLoading(true);
    try {
      await logout();
      // Clear all local data
      await AsyncStorage.clear();
      // Navigate to login screen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      // Call the unified API to delete the user
      await apiService.deleteUser();
      
      // Clear all local data
      await AsyncStorage.clear();
      
      // Log out the user
      await logout();
      
      // Navigate to login screen
      navigation.navigate('Login');
      
      Alert.alert(
        'Account Deleted',
        'Your account has been permanently deleted. Thank you for using Kingdom Studios.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Delete account error:', error);
      Alert.alert(
        'Error',
        'Failed to delete account. Please try again or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
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
        Need help? Contact our support team at support@kingdomcollective.pro
      </Text>
    </View>
  );

  const renderLegalSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Legal & Privacy</Text>

      <TouchableOpacity
        style={styles.legalButton}
        onPress={() => Linking.openURL('https://kingdomstudiosapp.com/terms')}
        activeOpacity={0.8}
      >
        <Text style={styles.legalButtonIcon}>📄</Text>
        <Text style={styles.legalButtonText}>Terms of Service</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.legalButton}
        onPress={() => Linking.openURL('https://kingdomstudiosapp.com/privacy')}
        activeOpacity={0.8}
      >
        <Text style={styles.legalButtonIcon}>🔒</Text>
        <Text style={styles.legalButtonText}>Privacy Policy</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
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
      
      <TouchableOpacity
        style={[styles.deleteAccountButton, deletingAccount && styles.deleteAccountButtonDisabled]}
        onPress={handleDeleteAccount}
        disabled={deletingAccount}
        activeOpacity={0.8}
      >
        <Text style={styles.deleteAccountButtonText}>
          {deletingAccount ? 'Deleting Account...' : 'Delete My Account'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDeleteAccountModal = () => (
    <Modal
      visible={showDeleteModal}
      transparent={true}
      animationType="fade"
      onRequestClose={cancelDeleteAccount}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Delete My Account</Text>
          <Text style={styles.modalBody}>
            Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data will be removed from our system.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelDeleteAccount}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmDeleteButton}
              onPress={confirmDeleteAccount}
            >
              <Text style={styles.confirmDeleteButtonText}>Yes, Delete My Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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

  const handleApiConfigChange = (key: keyof APIConfiguration, value: string) => {
    if (apiConfig) {
      const newConfig = { ...apiConfig, [key]: value };
      setApiConfig(newConfig);
      AsyncStorage.setItem('apiConfig', JSON.stringify(newConfig))
        .catch(error => console.error('Error saving API config:', error));
    }
  };

  const renderAPIConfigurationSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>API Configuration</Text>

      {apiConfig ? (
        <View style={styles.apiConfigContainer}>
          <TextInput
            style={styles.apiInput}
            placeholder="OpenAI API Key"
            placeholderTextColor="#666666"
            value={apiConfig.openaiApiKey}
            onChangeText={text => handleApiConfigChange('openaiApiKey', text)}
          />
          <TextInput
            style={styles.apiInput}
            placeholder="OpenRouter API Key"
            placeholderTextColor="#666666"
            value={apiConfig.openrouterApiKey}
            onChangeText={text => handleApiConfigChange('openrouterApiKey', text)}
          />
          <TextInput
            style={styles.apiInput}
            placeholder="Etsy API Key"
            placeholderTextColor="#666666"
            value={apiConfig.etsyApiKey}
            onChangeText={text => handleApiConfigChange('etsyApiKey', text)}
          />
          <TextInput
            style={styles.apiInput}
            placeholder="Printify API Key"
            placeholderTextColor="#666666"
            value={apiConfig.printifyApiKey}
            onChangeText={text => handleApiConfigChange('printifyApiKey', text)}
          />
          <TextInput
            style={styles.apiInput}
            placeholder="Shopify API Key"
            placeholderTextColor="#666666"
            value={apiConfig.shopifyApiKey}
            onChangeText={text => handleApiConfigChange('shopifyApiKey', text)}
          />
          <TextInput
            style={styles.apiInput}
            placeholder="Shopify Store URL"
            placeholderTextColor="#666666"
            value={apiConfig.shopifyStoreUrl}
            onChangeText={text => handleApiConfigChange('shopifyStoreUrl', text)}
          />
          <TextInput
            style={styles.apiInput}
            placeholder="Stripe Publishable Key"
            placeholderTextColor="#666666"
            value={apiConfig.stripePublishableKey}
            onChangeText={text => handleApiConfigChange('stripePublishableKey', text)}
          />
          <TextInput
            style={styles.apiInput}
            placeholder="Mailchimp API Key"
            placeholderTextColor="#666666"
            value={apiConfig.mailchimpApiKey}
            onChangeText={text => handleApiConfigChange('mailchimpApiKey', text)}
          />
        </View>
      ) : (
        <Text style={styles.noApiConfig}>
          No API configuration found. Please set up your API keys.
        </Text>
      )}
    </View>
  );

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await apiService.deleteUser();
      Alert.alert('Account Deleted', 'Your account has been deleted.');
      logout(); // Log out the user after successful deletion
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

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

        {/* Tier & Mode Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getModeSpecificContent('Kingdom Configuration', 'Creator Configuration')}
          </Text>

          {/* Current Tier Display */}
          <TouchableOpacity
            style={styles.tierCard}
            onPress={() => navigation.navigate('TierSystem')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[modeConfig.primaryColor, modeConfig.accentColor]}
              style={styles.tierGradient}
            >
              <View style={styles.tierContent}>
                <View style={styles.tierLeft}>
                  <Text style={styles.tierIcon}>
                    {userTier === 'free' ? '🌱' : userTier === 'creator' ? '⚡' : userTier === 'pro' ? '👑' : '🏛️'}
                  </Text>
                  <View style={styles.tierInfo}>
                    <Text style={styles.tierTitle}>
                      {userTier === 'free' ? getModeSpecificContent('Kingdom Starter', 'Creator Starter') :
                        userTier === 'creator' ? getModeSpecificContent('Kingdom Creator', 'Creator Pro') :
                          userTier === 'pro' ? getModeSpecificContent('Kingdom Leader', 'Creator Elite') :
                            getModeSpecificContent('Kingdom Enterprise', 'Creator Enterprise')}
                    </Text>
                    <Text style={styles.tierSubtitle}>
                      {userTier === 'free' ? 'Tap to upgrade your plan' : 'Current plan • Tap to manage'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.tierArrow}>→</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Mode Toggle */}
          <View style={styles.modeToggleSection}>
            <Text style={styles.settingSubtitle}>Content Mode</Text>
            <ModeToggle showDescription style={styles.modeToggle} />
            <Text style={styles.modeDescription}>
              {getModeSpecificContent(
                'Faith Mode includes biblical encouragement, scriptures, and Kingdom-focused language.',
                'Encouragement Mode provides universal wisdom and motivation with a clean, professional tone.'
              )}
            </Text>
          </View>

          {/* Dual Mode Setting */}
          {renderSettingCard(
            '🔄',
            'Dual Mode System',
            isDualMode ? 'Switch between Faith and Encouragement modes' : 'Enable mode switching',
            () => { },
            <Switch
              value={isDualMode}
              onValueChange={setDualMode}
              trackColor={{ false: KingdomColors.opacity.white20, true: KingdomColors.primary.royalPurple }}
              thumbColor={isDualMode ? KingdomColors.gold.bright : KingdomColors.silver.bright}
            />
          )}
        </View>

        {/* Legacy Faith Mode Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {faithMode ? 'Kingdom Settings' : 'App Settings'}
          </Text>

          {renderSettingCard(
            faithMode ? '🙏' : '⚙️',
            faithMode ? 'Kingdom Faith Mode' : 'Faith Mode',
            faithMode ? 'Receiving faith-based encouragement' : 'Enable faith-based guidance',
            () => { },
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
            'Terms of Service',
            'Read our terms and conditions',
            () => Linking.openURL('https://kingdomstudiosapp.com/terms').catch(() =>
              Alert.alert('Error', 'Unable to open Terms of Service')
            )
          )}

          {renderSettingCard(
            '🛡️',
            'Privacy Policy',
            'View our privacy policy',
            () => Linking.openURL('https://kingdomstudiosapp.com/privacy').catch(() =>
              Alert.alert('Error', 'Unable to open Privacy Policy')
            )
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

        {/* API Configuration Section */}
        {renderAPIConfigurationSection()}

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

      {/* Delete Account Modal */}
      {renderDeleteAccountModal()}
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
  // Tier Management Styles
  tierCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    ...KingdomShadows.medium,
  },
  tierGradient: {
    padding: 20,
  },
  tierContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tierLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tierIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  tierInfo: {
    flex: 1,
  },
  tierTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tierSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tierArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Mode Toggle Styles
  modeToggleSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  settingSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 12,
  },
  modeToggle: {
    marginBottom: 12,
  },
  modeDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
    textAlign: 'center',
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
  apiConfigContainer: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  apiInput: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: '#000000',
    color: '#ffffff',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  noApiConfig: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 12,
  },
  // Legal button styles
  legalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  legalButtonIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  legalButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1a202c',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  modalBody: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  modalButtonCancel: {
    backgroundColor: 'transparent',
    borderColor: '#3b82f6',
    borderWidth: 1,
  },
  modalButtonDelete: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  deleteAccountButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc2626',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  deleteAccountButtonDisabled: {
    opacity: 0.6,
  },
  deleteAccountButtonText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  confirmDeleteButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc2626',
    backgroundColor: '#dc2626',
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default React.memo(SettingsScreen);
