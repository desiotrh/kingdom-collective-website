import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { KingdomColors } from '../../constants/KingdomColors';

const sampleEngagement = [
    { label: 'Total Plays', value: 1240 },
    { label: 'Unique Listeners', value: 870 },
    { label: 'Shares', value: 210 },
];
const sampleSpiritualImpact = [
    { label: 'Testimonies Shared', value: 32 },
    { label: 'Prayers Answered', value: 18 },
    { label: 'Scripture Engagements', value: 56 },
];
const sampleTags = [
    { tag: 'Healing', count: 12 },
    { tag: 'Provision', count: 7 },
    { tag: 'Salvation', count: 13 },
];
const samplePrayerResponses = [
    { user: 'Anna', response: 'Praise report: breakthrough!' },
    { user: 'James', response: 'Prayer answered for job.' },
];

const AnalyticsTab = ({ faithMode, encouragementMode, testMode }) => {
    const [syncStatus, setSyncStatus] = useState('idle');

    const handleSyncWithKingdomStudios = async () => {
        setSyncStatus('syncing');
        try {
            // Simulate sync with Kingdom Studios
            await new Promise(resolve => setTimeout(resolve, 2000));
            Alert.alert('Sync Complete', 'Analytics data synced with Kingdom Studios!');
            setSyncStatus('synced');
        } catch (error) {
            Alert.alert('Sync Failed', 'Failed to sync analytics data');
            setSyncStatus('failed');
        }
    };

    const getSyncButtonColor = () => {
        switch (syncStatus) {
            case 'syncing':
                return KingdomColors.warning;
            case 'synced':
                return KingdomColors.success;
            case 'failed':
                return KingdomColors.danger;
            default:
                return KingdomColors.primary;
        }
    };

    const getSyncButtonText = () => {
        switch (syncStatus) {
            case 'syncing':
                return 'Syncing...';
            case 'synced':
                return 'Synced ✓';
            case 'failed':
                return 'Sync Failed';
            default:
                return 'Sync Analytics with Kingdom Studios';
        }
    };

    return (
        <View style={styles.container}>
            {testMode && (
                <View style={styles.testModeBanner}>
                    <Text style={styles.testModeText}>TEST MODE: Sandbox features enabled</Text>
                </View>
            )}

            <Text style={styles.sectionTitle}>Sync Analytics Data</Text>
            <TouchableOpacity
                style={[styles.syncButton, { backgroundColor: getSyncButtonColor() }]}
                onPress={handleSyncWithKingdomStudios}
                disabled={syncStatus === 'syncing'}
            >
                <Text style={styles.syncButtonText}>{getSyncButtonText()}</Text>
            </TouchableOpacity>

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Voice Engagement</Text>
            <FlatList
                data={sampleEngagement}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.label}>{item.label}:</Text>
                        <Text style={styles.value}>{item.value}</Text>
                    </View>
                )}
            />

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Spiritual Impact Preview</Text>
            <FlatList
                data={sampleSpiritualImpact}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.label}>{item.label}:</Text>
                        <Text style={styles.value}>{item.value}</Text>
                    </View>
                )}
            />

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Testimony Tag Tracking</Text>
            <FlatList
                data={sampleTags}
                keyExtractor={(item) => item.tag}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.label}>{item.tag}:</Text>
                        <Text style={styles.value}>{item.count}</Text>
                    </View>
                )}
            />

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Prayer Responses</Text>
            <FlatList
                data={samplePrayerResponses}
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.label}>{item.user}:</Text>
                        <Text style={styles.value}>{item.response}</Text>
                    </View>
                )}
            />

            <Text style={styles.modeNote}>
                {faithMode ? 'Faith Mode Active' : encouragementMode ? 'Encouragement Mode Active' : 'Standard Mode'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    testModeBanner: {
        backgroundColor: KingdomColors.warning,
        padding: 6,
        borderRadius: 8,
        marginBottom: 10,
    },
    testModeText: {
        color: KingdomColors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.primary,
        marginBottom: 10,
    },
    syncButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    syncButtonText: {
        color: KingdomColors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: KingdomColors.lightGray,
        marginVertical: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    label: {
        fontSize: 16,
        color: KingdomColors.darkGray,
    },
    value: {
        fontWeight: 'bold',
        color: KingdomColors.primary,
    },
    modeNote: {
        marginTop: 20,
        fontStyle: 'italic',
        color: KingdomColors.gray,
        textAlign: 'center',
    },
});

export default AnalyticsTab; 