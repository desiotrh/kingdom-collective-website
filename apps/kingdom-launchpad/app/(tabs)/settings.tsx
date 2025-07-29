import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { KingdomLaunchpadApiService } from '../../services/unifiedApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const apiService = KingdomLaunchpadApiService.getInstance();

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [autoBackup, setAutoBackup] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);

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
                'Your account has been permanently deleted. Thank you for using Kingdom Launchpad.',
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

    const settingsSections = [
        {
            title: 'App Settings',
            items: [
                {
                    title: 'Notifications',
                    subtitle: 'Product launch and milestone alerts',
                    type: 'toggle',
                    value: notificationsEnabled,
                    onToggle: setNotificationsEnabled,
                    icon: '🔔',
                },
                {
                    title: 'Auto Backup',
                    subtitle: 'Automatically save products to cloud',
                    type: 'toggle',
                    value: autoBackup,
                    onToggle: setAutoBackup,
                    icon: '☁️',
                },
                {
                    title: 'Dark Mode',
                    subtitle: 'Use dark theme',
                    type: 'toggle',
                    value: darkMode,
                    onToggle: setDarkMode,
                    icon: '🌙',
                },
            ],
        },
        {
            title: 'Data & Privacy',
            items: [
                {
                    title: 'Export Data',
                    subtitle: 'Download all your products and analytics',
                    type: 'button',
                    icon: '📤',
                },
                {
                    title: 'Privacy Policy',
                    subtitle: 'Read our privacy policy',
                    type: 'button',
                    icon: '🔒',
                },
                {
                    title: 'Terms of Service',
                    subtitle: 'Read our terms of service',
                    type: 'button',
                    icon: '📄',
                },
            ],
        },
        {
            title: 'Support',
            items: [
                {
                    title: 'Help & FAQ',
                    subtitle: 'Get help with the app',
                    type: 'button',
                    icon: '❓',
                },
                {
                    title: 'Contact Us',
                    subtitle: 'Send us feedback',
                    type: 'button',
                    icon: '📧',
                },
                {
                    title: 'Rate App',
                    subtitle: 'Rate us on the app store',
                    type: 'button',
                    icon: '⭐',
                },
            ],
        },
        {
            title: 'Danger Zone',
            items: [
                {
                    title: 'Delete My Account',
                    subtitle: 'Permanently delete your account and all data',
                    type: 'button',
                    icon: '🗑️',
                    onPress: handleDeleteAccount,
                    danger: true,
                },
            ],
        },
    ];

    const renderSettingItem = (item: any) => (
        <TouchableOpacity
            key={item.title}
            style={[
                styles.settingItem,
                { backgroundColor: colors.cream },
                item.danger && styles.dangerItem
            ]}
            onPress={item.onPress}
            disabled={!item.onPress}
        >
            <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <View style={styles.settingText}>
                    <Text style={[
                        styles.settingTitle,
                        { color: item.danger ? '#dc2626' : colors.charcoalInk }
                    ]}>
                        {item.title}
                    </Text>
                    <Text style={[
                        styles.settingSubtitle,
                        { color: item.danger ? '#dc2626' : colors.charcoalInk }
                    ]}>
                        {item.subtitle}
                    </Text>
                </View>
            </View>

            {item.type === 'toggle' ? (
                <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: colors.skyBlue, true: colors.softGold }}
                    thumbColor={colors.cream}
                />
            ) : (
                <Text style={[styles.arrowText, { color: colors.charcoalInk }]}>›</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        🚀 Settings
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.charcoalInk }]}>
                        Customize your launchpad experience
                    </Text>
                </View>

                {/* Settings Sections */}
                {settingsSections.map((section) => (
                    <View key={section.title} style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {section.title}
                        </Text>

                        <View style={styles.sectionContent}>
                            {section.items.map(renderSettingItem)}
                        </View>
                    </View>
                ))}

                {/* App Info */}
                <View style={[styles.appInfoCard, { backgroundColor: colors.warmBeige }]}>
                    <Text style={[styles.appInfoTitle, { color: colors.charcoalInk }]}>
                        Kingdom Launchpad
                    </Text>
                    <Text style={[styles.appInfoVersion, { color: colors.charcoalInk }]}>
                        Version 1.0.0
                    </Text>
                    <Text style={[styles.appInfoDescription, { color: colors.charcoalInk }]}>
                        Your platform for launching products and building your kingdom
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
        </SafeAreaView>
    );
} 