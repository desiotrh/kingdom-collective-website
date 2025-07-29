import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from '@/contexts/FaithModeContext';
import { KingdomVoiceApiService } from '../../services/unifiedApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const {
        isFaithMode,
        isEncouragementMode,
        toggleFaithMode,
        toggleEncouragementMode
    } = useFaithMode();
    const apiService = KingdomVoiceApiService.getInstance();

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
                'Your account has been permanently deleted. Thank you for using Kingdom Voice.',
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
            title: 'Faith & Encouragement',
            items: [
                {
                    title: 'Faith Mode',
                    subtitle: 'Show faith-based elements and scripture',
                    type: 'toggle',
                    value: isFaithMode,
                    onToggle: toggleFaithMode,
                    icon: '✝️',
                },
                {
                    title: 'Encouragement Mode',
                    subtitle: 'Show encouraging messages and prompts',
                    type: 'toggle',
                    value: isEncouragementMode,
                    onToggle: toggleEncouragementMode,
                    icon: '💝',
                },
            ],
        },
        {
            title: 'App Settings',
            items: [
                {
                    title: 'Notifications',
                    subtitle: 'Daily journaling reminders',
                    type: 'toggle',
                    value: notificationsEnabled,
                    onToggle: setNotificationsEnabled,
                    icon: '🔔',
                },
                {
                    title: 'Auto Backup',
                    subtitle: 'Automatically save entries to cloud',
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
                    subtitle: 'Download all your entries',
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
        <View key={item.title} style={[styles.settingItem, { backgroundColor: colors.cream }]}>
            <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.charcoalInk }]}>
                        {item.title}
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.charcoalInk }]}>
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
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {isFaithMode ? '✝️ Settings' : 'Settings'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.charcoalInk }]}>
                        Customize your journaling experience
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
                        Kingdom Voice
                    </Text>
                    <Text style={[styles.appInfoVersion, { color: colors.charcoalInk }]}>
                        Version 1.0.0
                    </Text>
                    <Text style={[styles.appInfoDescription, { color: colors.charcoalInk }]}>
                        Your sacred space for reflection and growth
                    </Text>
                </View>

                {/* Faith Mode Message */}
                {isFaithMode && (
                    <View style={[styles.faithMessageCard, { backgroundColor: colors.softGold }]}>
                        <Text style={[styles.faithMessageTitle, { color: colors.cream }]}>
                            ✝️ Faith Mode Active
                        </Text>
                        <Text style={[styles.faithMessageText, { color: colors.cream }]}>
                            Your journaling experience is enhanced with faith-based elements and scripture.
                        </Text>
                    </View>
                )}

                {/* Encouragement Message */}
                {isEncouragementMode && (
                    <View style={[styles.encouragementCard, { backgroundColor: colors.skyBlue }]}>
                        <Text style={[styles.encouragementTitle, { color: colors.charcoalInk }]}>
                            💝 Encouragement Mode Active
                        </Text>
                        <Text style={[styles.encouragementText, { color: colors.charcoalInk }]}>
                            You'll see encouraging messages and prompts throughout your journaling journey.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Delete Account Modal */}
            <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
                onRequestClose={cancelDeleteAccount}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            Delete Account
                        </Text>
                        <Text style={[styles.modalText, { color: colors.charcoalInk }]}>
                            Are you sure you want to delete your account? This action cannot be undone.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.skyBlue }]}
                                onPress={confirmDeleteAccount}
                                disabled={deletingAccount}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.charcoalInk }]}>
                                    {deletingAccount ? 'Deleting...' : 'Delete Account'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.warmBeige }]}
                                onPress={cancelDeleteAccount}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.charcoalInk }]}>
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
        padding: 20,
    },
    header: {
        marginBottom: 30,
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    subtitle: {
        fontSize: 16,
        fontStyle: 'italic',
        opacity: 0.8,
        fontFamily: 'Raleway',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'Playfair Display',
        textDecorationLine: 'underline',
    },
    sectionContent: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Playfair Display',
    },
    settingSubtitle: {
        fontSize: 14,
        opacity: 0.7,
        fontFamily: 'Raleway',
    },
    arrowText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    appInfoCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    appInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Playfair Display',
    },
    appInfoVersion: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 8,
        fontFamily: 'Raleway',
    },
    appInfoDescription: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: 'Raleway',
    },
    faithMessageCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    faithMessageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    faithMessageText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Raleway',
    },
    encouragementCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    encouragementTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    encouragementText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Raleway',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Playfair Display',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Raleway',
    },
    modalButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Raleway',
    },
}); 