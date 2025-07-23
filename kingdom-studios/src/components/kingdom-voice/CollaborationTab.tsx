import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { KingdomColors } from '../../constants/KingdomColors';

const CollaborationTab = ({ faithMode, encouragementMode, testMode }) => {
    const [guestEmail, setGuestEmail] = useState('');
    const [invitedGuests, setInvitedGuests] = useState([]);
    const [prayerActive, setPrayerActive] = useState(false);
    const [voiceContent, setVoiceContent] = useState('');
    const [feedback, setFeedback] = useState([]);
    const [mentorshipRequested, setMentorshipRequested] = useState(false);
    const [mentorshipJoined, setMentorshipJoined] = useState(false);
    const [syncStatus, setSyncStatus] = useState('idle');

    const handleInviteGuest = () => {
        if (guestEmail) {
            setInvitedGuests([...invitedGuests, guestEmail]);
            setGuestEmail('');
        }
    };

    const handleStartPrayer = () => setPrayerActive(true);
    const handleEndPrayer = () => setPrayerActive(false);
    const handleShareContent = () => setFeedback([...feedback, 'Feedback: Great job!']);
    const handleRequestMentorship = () => setMentorshipRequested(true);
    const handleJoinMentorship = () => setMentorshipJoined(true);

    const handleSyncWithKingdomStudios = async () => {
        setSyncStatus('syncing');
        try {
            // Simulate sync with Kingdom Studios
            await new Promise(resolve => setTimeout(resolve, 2000));
            Alert.alert('Sync Complete', 'Content synced with Kingdom Studios successfully!');
            setSyncStatus('synced');
        } catch (error) {
            Alert.alert('Sync Failed', 'Failed to sync with Kingdom Studios');
            setSyncStatus('failed');
        }
    };

    const handleSyncWithCircle = async () => {
        setSyncStatus('syncing');
        try {
            // Simulate sync with Kingdom Circle
            await new Promise(resolve => setTimeout(resolve, 2000));
            Alert.alert('Sync Complete', 'Content shared with Kingdom Circle community!');
            setSyncStatus('synced');
        } catch (error) {
            Alert.alert('Sync Failed', 'Failed to sync with Kingdom Circle');
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
            <View style={styles.syncSection}>
                <TouchableOpacity
                    style={[styles.syncButton, { backgroundColor: getSyncButtonColor() }]}
                    onPress={handleSyncWithKingdomStudios}
                    disabled={syncStatus === 'syncing'}
                >
                    <Text style={styles.syncButtonText}>{getSyncButtonText()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.circleSyncButton}
                    onPress={handleSyncWithCircle}
                    disabled={syncStatus === 'syncing'}
                >
                    <Text style={styles.circleSyncButtonText}>Share with Kingdom Circle</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Invite Remote Guest</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="Guest email"
                    value={guestEmail}
                    onChangeText={setGuestEmail}
                />
                <Button title="Invite" onPress={handleInviteGuest} color={KingdomColors.primary} />
            </View>
            <FlatList
                data={invitedGuests}
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => <Text style={styles.guestItem}>{item}</Text>}
                ListEmptyComponent={<Text style={styles.emptyText}>No guests invited yet.</Text>}
            />

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Live Prayer Session</Text>
            <Button
                title={prayerActive ? 'End Prayer Session' : 'Start Prayer Session'}
                onPress={prayerActive ? handleEndPrayer : handleStartPrayer}
                color={prayerActive ? KingdomColors.danger : KingdomColors.primary}
            />
            <Text style={styles.prayerStatus}>{prayerActive ? 'Live prayer in progress...' : 'No active session.'}</Text>

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Share Voice Content & Get Feedback</Text>
            <TextInput
                style={styles.input}
                placeholder="Paste voice content link or description"
                value={voiceContent}
                onChangeText={setVoiceContent}
            />
            <Button title="Share & Request Feedback" onPress={handleShareContent} color={KingdomColors.primary} />
            <FlatList
                data={feedback}
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => <Text style={styles.feedbackItem}>{item}</Text>}
                ListEmptyComponent={<Text style={styles.emptyText}>No feedback yet.</Text>}
            />

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Mentorship</Text>
            <View style={styles.row}>
                <Button
                    title={mentorshipRequested ? 'Requested' : 'Request Mentorship'}
                    onPress={handleRequestMentorship}
                    color={mentorshipRequested ? KingdomColors.gray : KingdomColors.primary}
                    disabled={mentorshipRequested}
                />
                <Button
                    title={mentorshipJoined ? 'Joined' : 'Join Mentorship'}
                    onPress={handleJoinMentorship}
                    color={mentorshipJoined ? KingdomColors.success : KingdomColors.primary}
                    disabled={mentorshipJoined}
                />
            </View>

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
    syncSection: {
        marginBottom: 16,
    },
    syncButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    syncButtonText: {
        color: KingdomColors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    circleSyncButton: {
        backgroundColor: KingdomColors.secondary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    circleSyncButtonText: {
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
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: KingdomColors.gray,
        borderRadius: 8,
        padding: 8,
        marginRight: 8,
        color: KingdomColors.darkGray,
    },
    guestItem: {
        color: KingdomColors.primary,
        marginBottom: 4,
    },
    emptyText: {
        color: KingdomColors.gray,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    prayerStatus: {
        marginTop: 8,
        color: KingdomColors.primary,
        fontStyle: 'italic',
    },
    feedbackItem: {
        color: KingdomColors.success,
        marginBottom: 4,
    },
    modeNote: {
        marginTop: 20,
        fontStyle: 'italic',
        color: KingdomColors.gray,
        textAlign: 'center',
    },
});

export default CollaborationTab; 