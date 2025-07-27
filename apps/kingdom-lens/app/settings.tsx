import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useDualMode } from '../../contexts/DualModeContext';

interface SettingItem {
    id: string;
    title: string;
    subtitle?: string;
    icon: keyof typeof Ionicons.glyphMap;
    type: 'toggle' | 'navigate' | 'action';
    category: 'account' | 'faith' | 'app' | 'privacy' | 'support';
    value?: boolean;
    action?: () => void;
}

const settingsItems: SettingItem[] = [
    // Account Settings
    {
        id: 'profile',
        title: 'Profile Settings',
        subtitle: 'Manage your account information',
        icon: 'person',
        type: 'navigate',
        category: 'account',
    },
    {
        id: 'subscription',
        title: 'Subscription',
        subtitle: 'Manage your plan and billing',
        icon: 'card',
        type: 'navigate',
        category: 'account',
    },
    {
        id: 'notifications',
        title: 'Notifications',
        subtitle: 'Configure push and email notifications',
        icon: 'notifications',
        type: 'navigate',
        category: 'account',
    },

    // Faith Settings
    {
        id: 'faith-mode',
        title: 'Faith Mode',
        subtitle: 'Enable faith-integrated features',
        icon: 'heart',
        type: 'toggle',
        category: 'faith',
        value: true,
    },
    {
        id: 'spiritual-preferences',
        title: 'Spiritual Preferences',
        subtitle: 'Customize faith-based features',
        icon: 'settings',
        type: 'navigate',
        category: 'faith',
    },
    {
        id: 'prayer-reminders',
        title: 'Prayer Reminders',
        subtitle: 'Get reminded to pray for clients',
        icon: 'time',
        type: 'toggle',
        category: 'faith',
        value: false,
    },
    {
        id: 'scripture-integration',
        title: 'Scripture Integration',
        subtitle: 'Include Bible verses in projects',
        icon: 'book',
        type: 'toggle',
        category: 'faith',
        value: true,
    },

    // App Settings
    {
        id: 'auto-backup',
        title: 'Auto Backup',
        subtitle: 'Automatically backup your projects',
        icon: 'cloud-upload',
        type: 'toggle',
        category: 'app',
        value: true,
    },
    {
        id: 'image-quality',
        title: 'Image Quality',
        subtitle: 'Set default image quality',
        icon: 'image',
        type: 'navigate',
        category: 'app',
    },
    {
        id: 'storage-management',
        title: 'Storage Management',
        subtitle: 'Manage local storage and cache',
        icon: 'folder',
        type: 'navigate',
        category: 'app',
    },
    {
        id: 'offline-mode',
        title: 'Offline Mode',
        subtitle: 'Work without internet connection',
        icon: 'wifi',
        type: 'toggle',
        category: 'app',
        value: false,
    },

    // Privacy Settings
    {
        id: 'data-privacy',
        title: 'Data Privacy',
        subtitle: 'Manage your data and privacy',
        icon: 'shield-checkmark',
        type: 'navigate',
        category: 'privacy',
    },
    {
        id: 'location-services',
        title: 'Location Services',
        subtitle: 'Use location for project tagging',
        icon: 'location',
        type: 'toggle',
        category: 'privacy',
        value: true,
    },
    {
        id: 'analytics-sharing',
        title: 'Analytics Sharing',
        subtitle: 'Share anonymous usage data',
        icon: 'analytics',
        type: 'toggle',
        category: 'privacy',
        value: false,
    },

    // Support
    {
        id: 'help-center',
        title: 'Help Center',
        subtitle: 'Get help and tutorials',
        icon: 'help-circle',
        type: 'navigate',
        category: 'support',
    },
    {
        id: 'contact-support',
        title: 'Contact Support',
        subtitle: 'Get in touch with our team',
        icon: 'chatbubble',
        type: 'navigate',
        category: 'support',
    },
    {
        id: 'feedback',
        title: 'Send Feedback',
        subtitle: 'Help us improve the app',
        icon: 'mail',
        type: 'action',
        category: 'support',
        action: () => Alert.alert('Feedback', 'Thank you for your feedback!'),
    },
];

export default function SettingsScreen() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { isFaithMode, toggleFaithMode } = useDualMode();

    const [settings, setSettings] = useState(settingsItems);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = (id: string) => {
        setSettings(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, value: !item.value }
                    : item
            )
        );

        // Handle special cases
        if (id === 'faith-mode') {
            toggleFaithMode();
        }
    };

    const handleAction = (item: SettingItem) => {
        if (item.type === 'action' && item.action) {
            item.action();
        } else if (item.type === 'navigate') {
            // Navigate to specific settings page
            Alert.alert('Navigation', `Navigate to ${item.title}`);
        }
    };

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: signOut },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This action cannot be undone. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: () => {
                        Alert.alert('Account Deleted', 'Your account has been deleted.');
                    }
                },
            ]
        );
    };

    const renderSettingItem = (item: SettingItem) => (
        <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={() => handleAction(item)}
        >
            <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={20} color="#4A90E2" />
                </View>
                <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    {item.subtitle && (
                        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                    )}
                </View>
            </View>

            {item.type === 'toggle' ? (
                <Switch
                    value={item.id === 'faith-mode' ? isFaithMode : item.value}
                    onValueChange={() => handleToggle(item.id)}
                    trackColor={{ false: '#e0e0e0', true: '#4A90E2' }}
                    thumbColor="#fff"
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            )}
        </TouchableOpacity>
    );

    const renderCategory = (category: string, title: string) => {
        const categoryItems = settings.filter(item => item.category === category);

        return (
            <View key={category} style={styles.category}>
                <Text style={styles.categoryTitle}>{title}</Text>
                <View style={styles.categoryContent}>
                    {categoryItems.map(renderSettingItem)}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={isFaithMode ? ['#4A90E2', '#7B68EE'] : ['#2C3E50', '#34495E']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="search" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* User Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profileInfo}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{user?.displayName?.charAt(0) || 'U'}</Text>
                        </View>
                        <View style={styles.profileDetails}>
                            <Text style={styles.profileName}>{user?.displayName || 'User'}</Text>
                            <Text style={styles.profileEmail}>{user?.email}</Text>
                            {isFaithMode && (
                                <View style={styles.faithModeBadge}>
                                    <Ionicons name="heart" size={12} color="#E74C3C" />
                                    <Text style={styles.faithModeText}>Faith Mode Active</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Settings Categories */}
                {renderCategory('account', 'Account')}
                {renderCategory('faith', 'Faith & Spirituality')}
                {renderCategory('app', 'App Settings')}
                {renderCategory('privacy', 'Privacy & Security')}
                {renderCategory('support', 'Support')}

                {/* Account Actions */}
                <View style={styles.category}>
                    <Text style={styles.categoryTitle}>Account Actions</Text>
                    <View style={styles.categoryContent}>
                        <TouchableOpacity style={styles.dangerItem} onPress={handleSignOut}>
                            <View style={styles.settingLeft}>
                                <View style={[styles.iconContainer, styles.dangerIcon]}>
                                    <Ionicons name="log-out" size={20} color="#E74C3C" />
                                </View>
                                <View style={styles.settingContent}>
                                    <Text style={styles.dangerTitle}>Sign Out</Text>
                                    <Text style={styles.settingSubtitle}>Sign out of your account</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
                            <View style={styles.settingLeft}>
                                <View style={[styles.iconContainer, styles.dangerIcon]}>
                                    <Ionicons name="trash" size={20} color="#E74C3C" />
                                </View>
                                <View style={styles.settingContent}>
                                    <Text style={styles.dangerTitle}>Delete Account</Text>
                                    <Text style={styles.settingSubtitle}>Permanently delete your account</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appVersion}>Kingdom Lens v1.0.0</Text>
                    <Text style={styles.appCopyright}>© 2024 Kingdom Studios</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerActions: {
        flexDirection: 'row',
    },
    headerButton: {
        padding: 8,
    },
    content: {
        flex: 1,
    },
    profileSection: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 12,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileDetails: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    faithModeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    faithModeText: {
        fontSize: 10,
        color: '#E74C3C',
        marginLeft: 4,
        fontWeight: '500',
    },
    category: {
        marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 20,
        marginBottom: 12,
    },
    categoryContent: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    dangerIcon: {
        backgroundColor: '#FFF5F5',
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    dangerTitle: {
        fontSize: 16,
        color: '#E74C3C',
        marginBottom: 2,
    },
    dangerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    appVersion: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    appCopyright: {
        fontSize: 12,
        color: '#999',
    },
}); 