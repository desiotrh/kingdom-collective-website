import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from 'packages/hooks/useFaithMode';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationSettings {
    dailyCheckIn: boolean;
    weeklyRecap: boolean;
    prayerBoardPing: boolean;
    discipleshipPrompt: boolean;
    preferredTime: string;
    notificationsEnabled: boolean;
}

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { faithMode, encouragementMode } = useFaithMode();

    // State
    const [settings, setSettings] = useState<NotificationSettings>({
        dailyCheckIn: false,
        weeklyRecap: false,
        prayerBoardPing: false,
        discipleshipPrompt: false,
        preferredTime: '09:00',
        notificationsEnabled: false,
    });

    // Load settings on mount
    useEffect(() => {
        loadSettings();
        requestNotificationPermissions();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem('notificationSettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.log('Error loading notification settings:', error);
        }
    };

    const saveSettings = async (newSettings: NotificationSettings) => {
        try {
            await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
            setSettings(newSettings);
            updateNotifications(newSettings);
        } catch (error) {
            console.log('Error saving notification settings:', error);
        }
    };

    const requestNotificationPermissions = async () => {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please enable notifications in your device settings to receive reminders.',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Configure notification behavior
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: false,
                }),
            });
        } catch (error) {
            console.log('Error requesting notification permissions:', error);
        }
    };

    const updateNotifications = async (newSettings: NotificationSettings) => {
        try {
            // Cancel all existing notifications
            await Notifications.cancelAllScheduledNotificationsAsync();

            if (!newSettings.notificationsEnabled) return;

            const [hours, minutes] = newSettings.preferredTime.split(':').map(Number);

            // Daily Check-In Notification
            if (newSettings.dailyCheckIn) {
                await scheduleDailyNotification(
                    'daily-checkin',
                    faithMode
                        ? '✝️ The Lord is inviting you to reflect on your day.'
                        : '🕊 You\'re not alone. Take 2 minutes to center.',
                    faithMode
                        ? 'Time to check in with your Forge Group and seek God\'s guidance.'
                        : 'Time to check in with your Forge Group and celebrate your growth.',
                    hours,
                    minutes
                );
            }

            // Weekly Recap Notification
            if (newSettings.weeklyRecap) {
                await scheduleWeeklyNotification(
                    'weekly-recap',
                    faithMode
                        ? '✝️ Weekly reflection: How has God moved this week?'
                        : '🕊 Weekly reflection: What progress have you made?',
                    faithMode
                        ? 'Take time to reflect on God\'s faithfulness and your spiritual growth.'
                        : 'Take time to reflect on your achievements and areas for growth.',
                    hours,
                    minutes
                );
            }

            // Prayer Board Ping
            if (newSettings.prayerBoardPing) {
                await scheduleDailyNotification(
                    'prayer-board-ping',
                    faithMode
                        ? '✝️ Has that prayer been answered?'
                        : '🕊 Has that support request been resolved?',
                    faithMode
                        ? 'Check your prayer board and give thanks for answered prayers.'
                        : 'Check your support board and celebrate breakthroughs.',
                    hours + 2, // 2 hours after preferred time
                    minutes
                );
            }

            // Discipleship Prompt
            if (newSettings.discipleshipPrompt) {
                await scheduleDailyNotification(
                    'discipleship-prompt',
                    faithMode
                        ? '✝️ New Spirit-led lesson available'
                        : '🕊 New growth prompt available',
                    faithMode
                        ? 'A new lesson has been posted in your Forge Group.'
                        : 'A new growth prompt has been posted in your Forge Group.',
                    hours + 4, // 4 hours after preferred time
                    minutes
                );
            }
        } catch (error) {
            console.log('Error updating notifications:', error);
        }
    };

    const scheduleDailyNotification = async (
        identifier: string,
        title: string,
        body: string,
        hour: number,
        minute: number
    ) => {
        await Notifications.scheduleNotificationAsync({
            identifier,
            content: {
                title,
                body,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
                hour,
                minute,
                repeats: true,
            },
        });
    };

    const scheduleWeeklyNotification = async (
        identifier: string,
        title: string,
        body: string,
        hour: number,
        minute: number
    ) => {
        await Notifications.scheduleNotificationAsync({
            identifier,
            content: {
                title,
                body,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
                hour,
                minute,
                weekday: 1, // Monday
                repeats: true,
            },
        });
    };

    const handleToggleSetting = (key: keyof NotificationSettings) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        saveSettings(newSettings);
    };

    const handleTimeChange = (newTime: string) => {
        const newSettings = { ...settings, preferredTime: newTime };
        saveSettings(newSettings);
    };

    const testNotification = async () => {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: faithMode
                        ? '✝️ Test Notification'
                        : '🕊 Test Notification',
                    body: faithMode
                        ? 'This is a test of your notification settings in Faith Mode.'
                        : 'This is a test of your notification settings in Encouragement Mode.',
                    sound: 'default',
                },
                trigger: { seconds: 2 },
            });

            Alert.alert(
                'Test Notification',
                'A test notification will appear in 2 seconds.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.log('Error sending test notification:', error);
            Alert.alert('Error', 'Failed to send test notification.');
        }
    };

    const renderSettingItem = (
        key: keyof NotificationSettings,
        title: string,
        description: string,
        icon: string
    ) => (
        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingHeader}>
                <Text style={[styles.settingIcon, { color: colors.emerald }]}>
                    {icon}
                </Text>
                <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                        {title}
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.olive }]}>
                        {description}
                    </Text>
                </View>
            </View>
            <Switch
                value={settings[key] as boolean}
                onValueChange={() => handleToggleSetting(key)}
                trackColor={{ false: colors.olive, true: colors.emerald }}
                thumbColor={colors.cream}
            />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.emerald }]}>
                        {faithMode ? '✝️ Settings' : '🕊 Settings'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.olive }]}>
                        {faithMode
                            ? 'Adjust your preferences and spiritual journey settings.'
                            : 'Adjust your preferences and wellness journey settings.'
                        }
                    </Text>
                </View>

                {/* Notification Settings Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.emerald }]}>
                        {faithMode ? '✝️ Reminders & Notifications' : '🕊 Reminders & Notifications'}
                    </Text>

                    {/* Master Toggle */}
                    <View style={[styles.masterToggle, { backgroundColor: colors.card }]}>
                        <View style={styles.settingHeader}>
                            <Text style={[styles.settingIcon, { color: colors.emerald }]}>
                                🔔
                            </Text>
                            <View style={styles.settingText}>
                                <Text style={[styles.settingTitle, { color: colors.text }]}>
                                    Enable Notifications
                                </Text>
                                <Text style={[styles.settingDescription, { color: colors.olive }]}>
                                    Receive reminders and updates from your circle
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={settings.notificationsEnabled}
                            onValueChange={() => handleToggleSetting('notificationsEnabled')}
                            trackColor={{ false: colors.olive, true: colors.emerald }}
                            thumbColor={colors.cream}
                        />
                    </View>

                    {/* Individual Settings */}
                    {settings.notificationsEnabled && (
                        <>
                            {renderSettingItem(
                                'dailyCheckIn',
                                faithMode ? 'Daily Check-In' : 'Daily Reflection',
                                faithMode
                                    ? 'Remind me to reflect on my day and seek God\'s guidance'
                                    : 'Remind me to reflect on my day and celebrate growth',
                                faithMode ? '✝️' : '🕊'
                            )}

                            {renderSettingItem(
                                'weeklyRecap',
                                'Weekly Group Recap',
                                faithMode
                                    ? 'Weekly reflection on spiritual growth and answered prayers'
                                    : 'Weekly reflection on progress and breakthroughs',
                                '📅'
                            )}

                            {renderSettingItem(
                                'prayerBoardPing',
                                faithMode ? 'Prayer Board Ping' : 'Support Board Ping',
                                faithMode
                                    ? 'Check for answered prayers and give thanks'
                                    : 'Check for resolved support requests and celebrate',
                                faithMode ? '🙏' : '💪'
                            )}

                            {renderSettingItem(
                                'discipleshipPrompt',
                                faithMode ? 'Discipleship Prompt' : 'Growth Prompt',
                                faithMode
                                    ? 'New Spirit-led lessons and teachings available'
                                    : 'New growth prompts and insights available',
                                faithMode ? '📖' : '💡'
                            )}

                            {/* Time Preference */}
                            <View style={[styles.timeSetting, { backgroundColor: colors.card }]}>
                                <View style={styles.settingHeader}>
                                    <Text style={[styles.settingIcon, { color: colors.emerald }]}>
                                        🕰️
                                    </Text>
                                    <View style={styles.settingText}>
                                        <Text style={[styles.settingTitle, { color: colors.text }]}>
                                            Preferred Time
                                        </Text>
                                        <Text style={[styles.settingDescription, { color: colors.olive }]}>
                                            When would you like to receive notifications?
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[styles.timeButton, { backgroundColor: colors.emerald }]}
                                    onPress={() => {
                                        // In a real app, this would open a time picker
                                        Alert.alert(
                                            'Time Setting',
                                            'This would open a time picker in the full implementation.',
                                            [{ text: 'OK' }]
                                        );
                                    }}
                                >
                                    <Text style={[styles.timeButtonText, { color: colors.cream }]}>
                                        {settings.preferredTime}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Test Notification Button */}
                            <TouchableOpacity
                                style={[styles.testButton, { backgroundColor: colors.olive }]}
                                onPress={testNotification}
                            >
                                <Text style={[styles.testButtonText, { color: colors.cream }]}>
                                    🧪 Test Notification
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Mode Indicator */}
                <View style={[styles.modeIndicator, { backgroundColor: colors.card }]}>
                    <Text style={[styles.modeText, { color: colors.olive }]}>
                        {faithMode ? '✝️ Faith Mode Active' : '🕊 Encouragement Mode Active'}
                    </Text>
                    <Text style={[styles.modeDescription, { color: colors.olive }]}>
                        {faithMode
                            ? 'Notifications will use spiritual language and scripture references.'
                            : 'Notifications will use wellness language and growth-focused messaging.'
                        }
                    </Text>
                </View>
            </ScrollView>
        </View>
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
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Nunito_700SemiBold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Quicksand_400Regular',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        fontFamily: 'Nunito_600SemiBold',
    },
    masterToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    settingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        fontSize: 20,
        marginRight: 12,
        fontFamily: 'Nunito_700SemiBold',
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
        fontFamily: 'Nunito_600SemiBold',
    },
    settingDescription: {
        fontSize: 14,
        fontFamily: 'Quicksand_400Regular',
    },
    timeSetting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    timeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    timeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    testButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    testButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    modeIndicator: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    modeText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Nunito_600SemiBold',
    },
    modeDescription: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Quicksand_400Regular',
    },
}); 