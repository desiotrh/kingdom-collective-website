import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';

export default function SunTrackerScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [selectedLocation, setSelectedLocation] = useState<string>('New York');
    const [selectedDate, setSelectedDate] = useState<string>('Today');

    const sunData = {
        sunrise: '6:45 AM',
        sunset: '4:30 PM',
        goldenHourStart: '3:30 PM',
        goldenHourEnd: '4:30 PM',
        blueHourStart: '5:45 AM',
        blueHourEnd: '6:15 AM',
    };

    const locations = [
        'New York',
        'Los Angeles',
        'Chicago',
        'Miami',
        'Seattle',
    ];

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Track His Light';
        } else if (encouragementMode) {
            return 'Track Perfect Light';
        }
        return 'Sun Tracker';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Find the perfect light for His glory';
        } else if (encouragementMode) {
            return 'Find the perfect light for your vision';
        }
        return 'Golden hour and blue hour calculator';
    };

    const handleLocationSelect = (location: string) => {
        setSelectedLocation(location);
        Alert.alert('Location Updated', `Now tracking sun data for ${location}`);
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        Alert.alert('Date Updated', `Now showing sun data for ${date}`);
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

                {/* Location Selector */}
                <View style={[styles.locationContainer, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Location
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {locations.map((location) => (
                            <TouchableOpacity
                                key={location}
                                style={[
                                    styles.locationButton,
                                    { backgroundColor: theme.colors.background },
                                    selectedLocation === location && { borderColor: theme.colors.primary, borderWidth: 2 }
                                ]}
                                onPress={() => handleLocationSelect(location)}
                            >
                                <Text style={[styles.locationText, { color: theme.colors.text }]}>
                                    {location}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Sun Data */}
                <View style={[styles.sunDataContainer, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Sun Data for {selectedLocation}
                    </Text>

                    {/* Sunrise/Sunset */}
                    <View style={styles.sunRow}>
                        <View style={styles.sunItem}>
                            <Text style={[styles.sunLabel, { color: theme.colors.textSecondary }]}>
                                Sunrise
                            </Text>
                            <Text style={[styles.sunTime, { color: theme.colors.text }]}>
                                {sunData.sunrise}
                            </Text>
                        </View>
                        <View style={styles.sunItem}>
                            <Text style={[styles.sunLabel, { color: theme.colors.textSecondary }]}>
                                Sunset
                            </Text>
                            <Text style={[styles.sunTime, { color: theme.colors.text }]}>
                                {sunData.sunset}
                            </Text>
                        </View>
                    </View>

                    {/* Golden Hour */}
                    <View style={[styles.goldenHourContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                        <Text style={[styles.goldenHourTitle, { color: theme.colors.primary }]}>
                            🌅 Golden Hour
                        </Text>
                        <View style={styles.goldenHourTimes}>
                            <Text style={[styles.goldenHourTime, { color: theme.colors.primary }]}>
                                Start: {sunData.goldenHourStart}
                            </Text>
                            <Text style={[styles.goldenHourTime, { color: theme.colors.primary }]}>
                                End: {sunData.goldenHourEnd}
                            </Text>
                        </View>
                    </View>

                    {/* Blue Hour */}
                    <View style={[styles.blueHourContainer, { backgroundColor: theme.colors.info + '20' }]}>
                        <Text style={[styles.blueHourTitle, { color: theme.colors.info }]}>
                            🌙 Blue Hour
                        </Text>
                        <View style={styles.blueHourTimes}>
                            <Text style={[styles.blueHourTime, { color: theme.colors.info }]}>
                                Start: {sunData.blueHourStart}
                            </Text>
                            <Text style={[styles.blueHourTime, { color: theme.colors.info }]}>
                                End: {sunData.blueHourEnd}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Photography Tips */}
                <View style={[styles.tipsContainer, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Photography Tips
                    </Text>
                    <View style={styles.tipItem}>
                        <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                            • Golden hour provides warm, soft light perfect for portraits
                        </Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                            • Blue hour creates dramatic cityscapes and landscapes
                        </Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                            • Arrive 30 minutes before golden hour for setup
                        </Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => Alert.alert('Reminder Set', 'Golden hour reminder set!')}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Set Reminder
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
                        onPress={() => Alert.alert('Calendar', 'Added to calendar!')}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Add to Calendar
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Faith Mode Message */}
                {faithMode && (
                    <View style={[styles.faithMessage, { backgroundColor: theme.colors.primary + '20' }]}>
                        <Text style={[styles.faithMessageText, { color: theme.colors.primary }]}>
                            "The heavens declare the glory of God" - Psalm 19:1
                        </Text>
                    </View>
                )}
            </ScrollView>
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
    locationContainer: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        fontFamily: 'EB Garamond, serif',
    },
    locationButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    locationText: {
        fontSize: 14,
        fontFamily: 'Sora, sans-serif',
    },
    sunDataContainer: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
    },
    sunRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    sunItem: {
        alignItems: 'center',
        flex: 1,
    },
    sunLabel: {
        fontSize: 12,
        marginBottom: 4,
        fontFamily: 'Sora, sans-serif',
    },
    sunTime: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Sora, sans-serif',
    },
    goldenHourContainer: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    goldenHourTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Sora, sans-serif',
    },
    goldenHourTimes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    goldenHourTime: {
        fontSize: 14,
        fontFamily: 'Sora, sans-serif',
    },
    blueHourContainer: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    blueHourTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Sora, sans-serif',
    },
    blueHourTimes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    blueHourTime: {
        fontSize: 14,
        fontFamily: 'Sora, sans-serif',
    },
    tipsContainer: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
    },
    tipItem: {
        marginBottom: 8,
    },
    tipText: {
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
    faithMessage: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
    },
    faithMessageText: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: 'EB Garamond, serif',
    },
}); 