import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { KingdomColors } from '../../constants/KingdomColors';

const MonetizationTab = ({ faithMode, encouragementMode, testMode }) => {
    const [coachingSession, setCoachingSession] = useState('');
    const [contentList, setContentList] = useState([]);
    const [contentUpload, setContentUpload] = useState('');
    const [donationLink, setDonationLink] = useState('');
    const [syncStatus, setSyncStatus] = useState('idle');

    const handleSetupCoaching = () => {
        if (coachingSession) {
            Alert.alert('Success', 'Voice coaching session set up!');
            setCoachingSession('');
        }
    };

    const handleUploadContent = () => {
        if (contentUpload) {
            setContentList([...contentList, contentUpload]);
            setContentUpload('');
        }
    };

    const handleSetupDonation = () => {
        if (donationLink) {
            Alert.alert('Success', 'Donation tool set up!');
            setDonationLink('');
        }
    };

    const handleSyncWithKingdomStudios = async () => {
        setSyncStatus('syncing');
        try {
            // Simulate sync with Kingdom Studios
            await new Promise(resolve => setTimeout(resolve, 2000));
            Alert.alert('Sync Complete', 'Monetization features synced with Kingdom Studios!');
            setSyncStatus('synced');
        } catch (error) {
            Alert.alert('Sync Failed', 'Failed to sync with Kingdom Studios');
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
                return 'Sync with Kingdom Studios';
        }
    };

    return (
        <View style={styles.container}>
            {testMode && (
                <View style={styles.testModeBanner}>
                    <Text style={styles.testModeText}>TEST MODE: Sandbox features enabled</Text>
                </View>
            )}

            <Text style={styles.sectionTitle}>Sync with Kingdom Studios</Text>
            <TouchableOpacity
                style={[styles.syncButton, { backgroundColor: getSyncButtonColor() }]}
                onPress={handleSyncWithKingdomStudios}
                disabled={syncStatus === 'syncing'}
            >
                <Text style={styles.syncButtonText}>{getSyncButtonText()}</Text>
            </TouchableOpacity>

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Setup Voice Coaching Session</Text>
            <TextInput
                style={styles.input}
                placeholder="Describe your coaching session"
                value={coachingSession}
                onChangeText={setCoachingSession}
            />
            <Button title="Setup Coaching" onPress={handleSetupCoaching} color={KingdomColors.primary} />

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Upload & List Content</Text>
            <TextInput
                style={styles.input}
                placeholder="Content title or link"
                value={contentUpload}
                onChangeText={setContentUpload}
            />
            <Button title="Upload Content" onPress={handleUploadContent} color={KingdomColors.primary} />
            <FlatList
                data={contentList}
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => <Text style={styles.contentItem}>{item}</Text>}
                ListEmptyComponent={<Text style={styles.emptyText}>No content uploaded yet.</Text>}
            />

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Donation Tool Setup</Text>
            <TextInput
                style={styles.input}
                placeholder="Donation link or instructions"
                value={donationLink}
                onChangeText={setDonationLink}
            />
            <Button title="Setup Donation Tool" onPress={handleSetupDonation} color={KingdomColors.primary} />

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
    input: {
        borderWidth: 1,
        borderColor: KingdomColors.gray,
        borderRadius: 8,
        padding: 8,
        marginBottom: 10,
        color: KingdomColors.darkGray,
    },
    contentItem: {
        color: KingdomColors.primary,
        marginBottom: 4,
    },
    emptyText: {
        color: KingdomColors.gray,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    modeNote: {
        marginTop: 20,
        fontStyle: 'italic',
        color: KingdomColors.gray,
        textAlign: 'center',
    },
});

export default MonetizationTab; 