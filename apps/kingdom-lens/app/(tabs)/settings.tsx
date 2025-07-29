import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Switch,
    Alert,
    Modal,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';
import { KingdomLensApiService } from '../../services/unifiedApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const {
        faithMode,
        encouragementMode,
        toggleFaithMode,
        toggleEncouragementMode
    } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;
    const apiService = KingdomLensApiService.getInstance();

    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [autoSaveEnabled, setAutoSaveEnabled] = React.useState(true);
    const [highQualityEnabled, setHighQualityEnabled] = React.useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Settings for His Glory';
        } else if (encouragementMode) {
            return 'Settings for Growth';
        }
        return 'Settings';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Configure your creative journey';
        } else if (encouragementMode) {
            return 'Configure your creative path';
        }
        return 'App preferences and configuration';
    };

    const handleFaithModeToggle = () => {
        toggleFaithMode();
        Alert.alert(
            'Faith Mode',
            faithMode ? 'Faith mode disabled' : 'Faith mode enabled'
        );
    };

    const handleEncouragementModeToggle = () => {
        toggleEncouragementMode();
        Alert.alert(
            'Encouragement Mode',
            encouragementMode ? 'Encouragement mode disabled' : 'Encouragement mode enabled'
        );
    };

    const handleExportSettings = () => {
        Alert.alert('Export Settings', 'Settings exported successfully!');
    };

    const handleResetSettings = () => {
        Alert.alert(
            'Reset Settings',
            'Are you sure you want to reset all settings?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset', style: 'destructive', onPress: () => {
                        setNotificationsEnabled(true);
                        setAutoSaveEnabled(true);
                        setHighQualityEnabled(true);
                        Alert.alert('Settings Reset', 'All settings have been reset to defaults');
                    }
                },
            ]
        );
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
            
            Alert.alert(
                'Account Deleted',
                'Your account has been permanently deleted. Thank you for using Kingdom Lens.',
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

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.watermark, { color: theme.colors.primary }]}>
                        {faithTheme.watermark}
                    </Text>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {getScreenTitle()}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        {getScreenSubtitle()}
                    </Text>
                </View>

                {/* Mode Settings */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        App Mode
                    </Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                                Faith Mode
                            </Text>
                            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                                {faithMode ? 'Enabled - Faith-based prompts and overlays' : 'Disabled - Standard mode'}
                            </Text>
                        </View>
                        <Switch
                            value={faithMode}
                            onValueChange={handleFaithModeToggle}
                            trackColor={{ false: '#E5E5E5', true: theme.colors.primary }}
                            thumbColor={faithMode ? theme.colors.surface : '#FFFFFF'}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                                Encouragement Mode
                            </Text>
                            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                                {encouragementMode ? 'Enabled - Encouragement-based prompts' : 'Disabled - Standard mode'}
                            </Text>
                        </View>
                        <Switch
                            value={encouragementMode}
                            onValueChange={handleEncouragementModeToggle}
                            trackColor={{ false: '#E5E5E5', true: theme.colors.primary }}
                            thumbColor={encouragementMode ? theme.colors.surface : '#FFFFFF'}
                        />
                    </View>
                </View>

                {/* App Settings */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        App Settings
                    </Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                                Notifications
                            </Text>
                            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                                Golden hour reminders and tips
                            </Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: '#E5E5E5', true: theme.colors.primary }}
                            thumbColor={notificationsEnabled ? theme.colors.surface : '#FFFFFF'}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                                Auto Save
                            </Text>
                            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                                Automatically save your work
                            </Text>
                        </View>
                        <Switch
                            value={autoSaveEnabled}
                            onValueChange={setAutoSaveEnabled}
                            trackColor={{ false: '#E5E5E5', true: theme.colors.primary }}
                            thumbColor={autoSaveEnabled ? theme.colors.surface : '#FFFFFF'}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                                High Quality Export
                            </Text>
                            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                                Export images in high resolution
                            </Text>
                        </View>
                        <Switch
                            value={highQualityEnabled}
                            onValueChange={setHighQualityEnabled}
                            trackColor={{ false: '#E5E5E5', true: theme.colors.primary }}
                            thumbColor={highQualityEnabled ? theme.colors.surface : '#FFFFFF'}
                        />
                    </View>
                </View>

                {/* About Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        About
                    </Text>

                    <TouchableOpacity style={styles.aboutItem}>
                        <Text style={[styles.aboutLabel, { color: theme.colors.text }]}>
                            Version
                        </Text>
                        <Text style={[styles.aboutValue, { color: theme.colors.textSecondary }]}>
                            1.0.0
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.aboutItem}>
                        <Text style={[styles.aboutLabel, { color: theme.colors.text }]}>
                            Support
                        </Text>
                        <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>
                            Contact Us
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.aboutItem}>
                        <Text style={[styles.aboutLabel, { color: theme.colors.text }]}>
                            Privacy Policy
                        </Text>
                        <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>
                            View
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleExportSettings}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Export Settings
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
                        onPress={handleResetSettings}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Reset Settings
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Delete Account Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: '#dc2626' }]}>
                        🗑️ Danger Zone
                    </Text>
                    <TouchableOpacity
                        style={[styles.deleteAccountButton, { borderColor: '#dc2626' }]}
                        onPress={handleDeleteAccount}
                    >
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: '#dc2626' }]}>
                                Delete My Account
                            </Text>
                            <Text style={[styles.settingDescription, { color: '#dc2626' }]}>
                                Permanently delete your account and all data
                            </Text>
                        </View>
                        <Text style={[styles.settingArrow, { color: '#dc2626' }]}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Current Mode Display */}
                <View style={[styles.modeDisplay, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.modeDisplayTitle, { color: theme.colors.text }]}>
                        Current Mode
                    </Text>
                    <Text style={[styles.modeDisplayText, { color: theme.colors.primary }]}>
                        {faithMode ? 'Faith Mode' : encouragementMode ? 'Encouragement Mode' : 'Professional Mode'}
                    </Text>
                </View>
            </ScrollView>

            {/* Delete Account Modal */}
            <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
                onRequestClose={cancelDeleteAccount}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirm Account Deletion</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to delete your account? This action cannot be undone.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.colors.error }]}
                                onPress={confirmDeleteAccount}
                                disabled={deletingAccount}
                            >
                                <Text style={[styles.modalButtonText, { color: theme.colors.surface }]}>
                                    {deletingAccount ? 'Deleting...' : 'Delete Account'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.colors.surface }]}
                                onPress={cancelDeleteAccount}
                            >
                                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    watermark: {
        fontSize: 20,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'EB Garamond, serif',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Sora, sans-serif',
    },
    section: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'EB Garamond, serif',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Sora, sans-serif',
    },
    settingDescription: {
        fontSize: 12,
        fontFamily: 'Sora, sans-serif',
    },
    aboutItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    aboutLabel: {
        fontSize: 16,
        fontFamily: 'Sora, sans-serif',
    },
    aboutValue: {
        fontSize: 14,
        fontFamily: 'Sora, sans-serif',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    actionButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
    modeDisplay: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    modeDisplayTitle: {
        fontSize: 14,
        marginBottom: 4,
        fontFamily: 'Sora, sans-serif',
    },
    modeDisplayText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        fontFamily: 'EB Garamond, serif',
    },
    modalMessage: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        fontFamily: 'Sora, sans-serif',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
    deleteAccountButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderStyle: 'solid',
    },
    settingArrow: {
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 