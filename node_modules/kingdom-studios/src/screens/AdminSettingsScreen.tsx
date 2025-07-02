import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { ContentModerationSettings } from '../types/admin';
// import { AdminService } from '../services/AdminService'; // Commented until proper integration

interface AdminSettingsScreenProps {
  navigation: any;
}

export const AdminSettingsScreen: React.FC<AdminSettingsScreenProps> = ({ navigation }) => {
  const { currentMode } = useDualMode();
  const [settings, setSettings] = useState<ContentModerationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const colors = KingdomColors[currentMode];

  // Mock settings for development
  const mockSettings: ContentModerationSettings = {
    autoModeration: true,
    contentFilters: {
      profanity: true,
      spam: true,
      harassment: true,
      inappropriateContent: true,
      religionSensitive: true,
    },
    approvalRequired: {
      newUsers: false,
      testimonies: true,
      prayerRequests: false,
      communityPosts: false,
    },
    warningThresholds: {
      flagsBeforeWarning: 3,
      warningsBeforeSuspension: 2,
      suspensionDuration: 7,
    },
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual AdminService call
      // const settingsData = await AdminService.getModerationSettings();
      setSettings(mockSettings);
    } catch (error) {
      Alert.alert(
        currentMode === 'faith' ? 'Prayer Needed' : 'Error',
        currentMode === 'faith' 
          ? 'Lord, we need Your guidance in loading settings. Please try again.'
          : 'Failed to load admin settings. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      // TODO: Replace with actual AdminService call
      // await AdminService.updateModerationSettings(settings);
      Alert.alert(
        currentMode === 'faith' ? 'Blessed!' : 'Success',
        currentMode === 'faith' 
          ? 'Your settings have been updated by His grace!'
          : 'Settings have been successfully updated.'
      );
    } catch (error) {
      Alert.alert(
        currentMode === 'faith' ? 'Prayer Needed' : 'Error',
        currentMode === 'faith' 
          ? 'Lord, we need Your help in saving these settings.'
          : 'Failed to save settings. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const updateFilterSetting = (filter: keyof ContentModerationSettings['contentFilters'], value: boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      contentFilters: {
        ...settings.contentFilters,
        [filter]: value,
      },
    });
  };

  const updateApprovalSetting = (setting: keyof ContentModerationSettings['approvalRequired'], value: boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      approvalRequired: {
        ...settings.approvalRequired,
        [setting]: value,
      },
    });
  };

  const updateThreshold = (threshold: keyof ContentModerationSettings['warningThresholds'], value: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      warningThresholds: {
        ...settings.warningThresholds,
        [threshold]: value,
      },
    });
  };

  const renderSectionHeader = (title: string, subtitle?: string) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );

  const renderToggleSetting = (
    title: string,
    description: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon?: string
  ) => (
    <View style={[styles.settingRow, { backgroundColor: colors.surface }]}>
      <View style={styles.settingInfo}>
        {icon && (
          <Ionicons name={icon as any} size={20} color={colors.primary} style={styles.settingIcon} />
        )}
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? colors.surface : colors.textSecondary}
      />
    </View>
  );

  const renderThresholdSetting = (
    title: string,
    description: string,
    value: number,
    onDecrease: () => void,
    onIncrease: () => void,
    icon?: string
  ) => (
    <View style={[styles.settingRow, { backgroundColor: colors.surface }]}>
      <View style={styles.settingInfo}>
        {icon && (
          <Ionicons name={icon as any} size={20} color={colors.primary} style={styles.settingIcon} />
        )}
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>{description}</Text>
        </View>
      </View>
      <View style={styles.thresholdControls}>
        <TouchableOpacity
          style={[styles.thresholdButton, { backgroundColor: colors.primary }]}
          onPress={onDecrease}
        >
          <Ionicons name="remove" size={16} color={colors.surface} />
        </TouchableOpacity>
        <Text style={[styles.thresholdValue, { color: colors.text }]}>{value}</Text>
        <TouchableOpacity
          style={[styles.thresholdButton, { backgroundColor: colors.primary }]}
          onPress={onIncrease}
        >
          <Ionicons name="add" size={16} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!settings) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {currentMode === 'faith' ? 'Kingdom Settings' : 'Admin Settings'}
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {currentMode === 'faith' ? 'Seeking His wisdom...' : 'Loading settings...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {currentMode === 'faith' ? 'Kingdom Settings' : 'Admin Settings'}
        </Text>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={saveSettings}
          disabled={saving}
        >
          <Text style={[styles.saveButtonText, { color: colors.surface }]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* General Settings */}
        {renderSectionHeader(
          currentMode === 'faith' ? 'Divine Protection' : 'General Settings',
          currentMode === 'faith' 
            ? 'Guard our community with His wisdom'
            : 'Configure automatic moderation and safety features'
        )}

        {renderToggleSetting(
          currentMode === 'faith' ? 'Automatic Divine Protection' : 'Auto Moderation',
          currentMode === 'faith' 
            ? 'Let His algorithms protect our sacred space'
            : 'Enable automatic content filtering and moderation',
          settings.autoModeration,
          (value) => setSettings({ ...settings, autoModeration: value }),
          'shield-checkmark'
        )}

        {/* Content Filters */}
        {renderSectionHeader(
          currentMode === 'faith' ? 'Sacred Filters' : 'Content Filters',
          currentMode === 'faith' 
            ? 'Keep our community pure and holy'
            : 'Configure what content should be automatically filtered'
        )}

        {renderToggleSetting(
          currentMode === 'faith' ? 'Unholy Language Filter' : 'Profanity Filter',
          currentMode === 'faith' 
            ? 'Block language that dishonors God'
            : 'Automatically detect and filter profane language',
          settings.contentFilters.profanity,
          (value) => updateFilterSetting('profanity', value),
          'chatbubble-ellipses'
        )}

        {renderToggleSetting(
          currentMode === 'faith' ? 'Worldly Spam Protection' : 'Spam Detection',
          currentMode === 'faith' 
            ? 'Protect against deceptive worldly schemes'
            : 'Detect and block spam content automatically',
          settings.contentFilters.spam,
          (value) => updateFilterSetting('spam', value),
          'mail'
        )}

        {renderToggleSetting(
          currentMode === 'faith' ? 'Love & Kindness Enforcement' : 'Harassment Prevention',
          currentMode === 'faith' 
            ? 'Ensure all interactions reflect His love'
            : 'Automatically detect harassment and bullying',
          settings.contentFilters.harassment,
          (value) => updateFilterSetting('harassment', value),
          'heart'
        )}

        {renderToggleSetting(
          currentMode === 'faith' ? 'Purity Content Guard' : 'Inappropriate Content Filter',
          currentMode === 'faith' 
            ? 'Keep our community pure and family-friendly'
            : 'Filter inappropriate or adult content',
          settings.contentFilters.inappropriateContent,
          (value) => updateFilterSetting('inappropriateContent', value),
          'eye-off'
        )}

        {renderToggleSetting(
          currentMode === 'faith' ? 'Faith Sensitivity Guard' : 'Religion Sensitivity Filter',
          currentMode === 'faith' 
            ? 'Protect against attacks on our precious faith'
            : 'Detect content that may be insensitive to religious beliefs',
          settings.contentFilters.religionSensitive,
          (value) => updateFilterSetting('religionSensitive', value),
          'book'
        )}

        {/* Approval Requirements */}
        {renderSectionHeader(
          currentMode === 'faith' ? 'Elder Approval' : 'Content Approval',
          currentMode === 'faith' 
            ? 'Require shepherd review for sensitive content'
            : 'Configure what content requires manual approval'
        )}

        {renderToggleSetting(
          currentMode === 'faith' ? 'New Believer Review' : 'New User Approval',
          currentMode === 'faith' 
            ? 'Review content from new believers joining our flock'
            : 'Require approval for content from new users',
          settings.approvalRequired.newUsers,
          (value) => updateApprovalSetting('newUsers', value),
          'person-add'
        )}

        {renderToggleSetting(
          currentMode === 'faith' ? 'Testimony Blessing Review' : 'Testimony Approval',
          currentMode === 'faith' 
            ? 'Ensure testimonies honor God before sharing'
            : 'Require manual approval for user testimonies',
          settings.approvalRequired.testimonies,
          (value) => updateApprovalSetting('testimonies', value),
          'megaphone'
        )}

        {renderToggleSetting(
          currentMode === 'faith' ? 'Prayer Request Review' : 'Prayer Request Approval',
          currentMode === 'faith' 
            ? 'Review prayer requests for appropriateness'
            : 'Require approval for prayer requests',
          settings.approvalRequired.prayerRequests,
          (value) => updateApprovalSetting('prayerRequests', value),
          'hands-up'
        )}

        {renderToggleSetting(
          currentMode === 'faith' ? 'Community Fellowship Review' : 'Community Post Approval',
          currentMode === 'faith' 
            ? 'Review community posts before sharing'
            : 'Require approval for community posts',
          settings.approvalRequired.communityPosts,
          (value) => updateApprovalSetting('communityPosts', value),
          'people'
        )}

        {/* Warning Thresholds */}
        {renderSectionHeader(
          currentMode === 'faith' ? 'Correction Thresholds' : 'Warning Thresholds',
          currentMode === 'faith' 
            ? 'Set boundaries for disciplinary correction'
            : 'Configure warning and suspension thresholds'
        )}

        {renderThresholdSetting(
          currentMode === 'faith' ? 'Flags Before Gentle Correction' : 'Flags Before Warning',
          currentMode === 'faith' 
            ? 'Number of flags before sending a loving correction'
            : 'Number of flags before issuing a warning',
          settings.warningThresholds.flagsBeforeWarning,
          () => updateThreshold('flagsBeforeWarning', Math.max(1, settings.warningThresholds.flagsBeforeWarning - 1)),
          () => updateThreshold('flagsBeforeWarning', settings.warningThresholds.flagsBeforeWarning + 1),
          'flag'
        )}

        {renderThresholdSetting(
          currentMode === 'faith' ? 'Corrections Before Temporary Separation' : 'Warnings Before Suspension',
          currentMode === 'faith' 
            ? 'Number of corrections before temporary separation'
            : 'Number of warnings before suspension',
          settings.warningThresholds.warningsBeforeSuspension,
          () => updateThreshold('warningsBeforeSuspension', Math.max(1, settings.warningThresholds.warningsBeforeSuspension - 1)),
          () => updateThreshold('warningsBeforeSuspension', settings.warningThresholds.warningsBeforeSuspension + 1),
          'warning'
        )}

        {renderThresholdSetting(
          currentMode === 'faith' ? 'Separation Duration (Days)' : 'Suspension Duration (Days)',
          currentMode === 'faith' 
            ? 'Days of separation for reflection and prayer'
            : 'Default suspension duration in days',
          settings.warningThresholds.suspensionDuration,
          () => updateThreshold('suspensionDuration', Math.max(1, settings.warningThresholds.suspensionDuration - 1)),
          () => updateThreshold('suspensionDuration', settings.warningThresholds.suspensionDuration + 1),
          'time'
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 2,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  settingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  thresholdControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thresholdButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thresholdValue: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 32,
  },
});
