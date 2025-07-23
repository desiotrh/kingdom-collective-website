import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { Ionicons } from '@expo/vector-icons';

interface SunData {
    sunrise: string;
    sunset: string;
    goldenHourStart: string;
    goldenHourEnd: string;
    blueHourStart: string;
    blueHourEnd: string;
    dayLength: string;
}

interface ShootSession {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    lightType: 'golden-hour' | 'blue-hour' | 'sunrise' | 'sunset' | 'daylight';
    notes: string;
}

const SunTrackerScreen: React.FC = () => {
    const { isFaithMode } = useDualMode();
    const [currentLocation, setCurrentLocation] = useState('New York, NY');
    const [sunData, setSunData] = useState<SunData>({
        sunrise: '06:30',
        sunset: '19:45',
        goldenHourStart: '18:15',
        goldenHourEnd: '19:45',
        blueHourStart: '05:45',
        blueHourEnd: '06:30',
        dayLength: '13h 15m',
    });
    const [scheduledSessions, setScheduledSessions] = useState<ShootSession[]>([]);
    const [showAddSessionModal, setShowAddSessionModal] = useState(false);
    const [newSession, setNewSession] = useState<Partial<ShootSession>>({
        title: '',
        date: '',
        time: '',
        location: '',
        lightType: 'golden-hour',
        notes: '',
    });

    const lightTypes = [
        { id: 'golden-hour', name: 'Golden Hour', icon: 'sunny', description: 'Warm, golden light' },
        { id: 'blue-hour', name: 'Blue Hour', icon: 'moon', description: 'Soft, blue light' },
        { id: 'sunrise', name: 'Sunrise', icon: 'sunny-outline', description: 'Fresh morning light' },
        { id: 'sunset', name: 'Sunset', icon: 'sunny', description: 'Dramatic evening light' },
        { id: 'daylight', name: 'Daylight', icon: 'partly-sunny', description: 'Bright natural light' },
    ];

    const faithScriptures = [
        "The Lord is my light and my salvation...",
        "Let there be light...",
        "You are the light of the world...",
        "The light shines in the darkness...",
        "In your light we see light...",
    ];

    const addSession = () => {
        if (!newSession.title || !newSession.date || !newSession.time) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        const session: ShootSession = {
            id: Date.now().toString(),
            title: newSession.title || '',
            date: newSession.date || '',
            time: newSession.time || '',
            location: newSession.location || '',
            lightType: newSession.lightType || 'golden-hour',
            notes: newSession.notes || '',
        };

        setScheduledSessions([session, ...scheduledSessions]);
        setNewSession({
            title: '',
            date: '',
            time: '',
            location: '',
            lightType: 'golden-hour',
            notes: '',
        });
        setShowAddSessionModal(false);

        Alert.alert(
            'Session Scheduled',
            isFaithMode
                ? 'Your session has been blessed and added to your calendar. May the light guide your creativity.'
                : 'Session scheduled successfully! Perfect timing for beautiful light.'
        );
    };

    const getCurrentScripture = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 8) {
            return "The Lord's mercies are new every morning...";
        } else if (hour >= 18 && hour < 21) {
            return "Evening and morning, and at noon, will I pray...";
        } else {
            return faithScriptures[Math.floor(Math.random() * faithScriptures.length)];
        }
    };

    const AddSessionModal = () => (
        <Modal
            visible={showAddSessionModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {isFaithMode ? 'Schedule Blessed Session' : 'Schedule Session'}
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Session Title</Text>
                        <TextInput
                            style={styles.input}
                            value={newSession.title}
                            onChangeText={(text) => setNewSession({ ...newSession, title: text })}
                            placeholder="Enter session title"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date</Text>
                        <TextInput
                            style={styles.input}
                            value={newSession.date}
                            onChangeText={(text) => setNewSession({ ...newSession, date: text })}
                            placeholder="MM/DD/YYYY"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Time</Text>
                        <TextInput
                            style={styles.input}
                            value={newSession.time}
                            onChangeText={(text) => setNewSession({ ...newSession, time: text })}
                            placeholder="HH:MM"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            value={newSession.location}
                            onChangeText={(text) => setNewSession({ ...newSession, location: text })}
                            placeholder="Enter location"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Light Type</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {lightTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.id}
                                    style={[
                                        styles.lightTypeButton,
                                        newSession.lightType === type.id && styles.selectedLightType
                                    ]}
                                    onPress={() => setNewSession({ ...newSession, lightType: type.id as any })}
                                >
                                    <Ionicons
                                        name={type.icon as any}
                                        size={20}
                                        color={newSession.lightType === type.id ? KingdomColors.softWhite : KingdomColors.bronze}
                                    />
                                    <Text style={[
                                        styles.lightTypeText,
                                        newSession.lightType === type.id && styles.selectedLightTypeText
                                    ]}>
                                        {type.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Notes</Text>
                        <TextInput
                            style={styles.textInput}
                            value={newSession.notes}
                            onChangeText={(text) => setNewSession({ ...newSession, notes: text })}
                            placeholder={isFaithMode
                                ? "Add prayer requests or spiritual notes..."
                                : "Add session notes..."
                            }
                            multiline
                        />
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowAddSessionModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.primaryButton]}
                            onPress={addSession}
                        >
                            <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                                {isFaithMode ? 'Schedule & Bless' : 'Schedule Session'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isFaithMode ? 'Sun Tracker - Faith Mode' : 'Sun Tracker'}
                </Text>
                <Text style={styles.subtitle}>
                    {isFaithMode
                        ? 'Track God\'s light and plan your sessions in His timing'
                        : 'Track optimal lighting conditions for your photography sessions'
                    }
                </Text>
            </View>

            {isFaithMode && (
                <View style={styles.scriptureOverlay}>
                    <Text style={styles.scriptureText}>{getCurrentScripture()}</Text>
                </View>
            )}

            <View style={styles.locationSection}>
                <Text style={styles.sectionTitle}>Current Location</Text>
                <Text style={styles.locationText}>{currentLocation}</Text>
                <Text style={styles.dateText}>
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>
            </View>

            <View style={styles.sunDataSection}>
                <Text style={styles.sectionTitle}>Today's Light Schedule</Text>

                <View style={styles.sunCard}>
                    <View style={styles.sunItem}>
                        <Ionicons name="sunny-outline" size={24} color={KingdomColors.bronze} />
                        <View style={styles.sunInfo}>
                            <Text style={styles.sunLabel}>Sunrise</Text>
                            <Text style={styles.sunTime}>{sunData.sunrise}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sunCard}>
                    <View style={styles.sunItem}>
                        <Ionicons name="sunny" size={24} color={KingdomColors.bronze} />
                        <View style={styles.sunInfo}>
                            <Text style={styles.sunLabel}>Sunset</Text>
                            <Text style={styles.sunTime}>{sunData.sunset}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sunCard}>
                    <View style={styles.sunItem}>
                        <Ionicons name="sunny" size={24} color={KingdomColors.dustGold} />
                        <View style={styles.sunInfo}>
                            <Text style={styles.sunLabel}>Golden Hour</Text>
                            <Text style={styles.sunTime}>{sunData.goldenHourStart} - {sunData.goldenHourEnd}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sunCard}>
                    <View style={styles.sunItem}>
                        <Ionicons name="moon" size={24} color={KingdomColors.bronze} />
                        <View style={styles.sunInfo}>
                            <Text style={styles.sunLabel}>Blue Hour</Text>
                            <Text style={styles.sunTime}>{sunData.blueHourStart} - {sunData.blueHourEnd}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sunCard}>
                    <View style={styles.sunItem}>
                        <Ionicons name="time" size={24} color={KingdomColors.bronze} />
                        <View style={styles.sunInfo}>
                            <Text style={styles.sunLabel}>Day Length</Text>
                            <Text style={styles.sunTime}>{sunData.dayLength}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.addSessionButton}
                onPress={() => setShowAddSessionModal(true)}
            >
                <Ionicons name="add-circle" size={24} color={KingdomColors.softWhite} />
                <Text style={styles.addSessionButtonText}>
                    {isFaithMode ? 'Schedule Blessed Session' : 'Schedule Session'}
                </Text>
            </TouchableOpacity>

            {scheduledSessions.length > 0 && (
                <View style={styles.sessionsSection}>
                    <Text style={styles.sectionTitle}>Scheduled Sessions</Text>
                    {scheduledSessions.map((session) => (
                        <View key={session.id} style={styles.sessionCard}>
                            <View style={styles.sessionHeader}>
                                <Text style={styles.sessionTitle}>{session.title}</Text>
                                <View style={styles.sessionIcons}>
                                    {lightTypes.find(lt => lt.id === session.lightType)?.icon && (
                                        <Ionicons
                                            name={lightTypes.find(lt => lt.id === session.lightType)?.icon as any}
                                            size={16}
                                            color={KingdomColors.bronze}
                                        />
                                    )}
                                </View>
                            </View>

                            <Text style={styles.sessionDate}>{session.date} at {session.time}</Text>
                            <Text style={styles.sessionLocation}>{session.location}</Text>
                            <Text style={styles.sessionLightType}>
                                {lightTypes.find(lt => lt.id === session.lightType)?.name}
                            </Text>

                            {session.notes && (
                                <View style={styles.sessionNotes}>
                                    <Text style={styles.notesLabel}>Notes:</Text>
                                    <Text style={styles.notesText}>{session.notes}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}

            <AddSessionModal />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.matteBlack,
    },
    header: {
        padding: 20,
        backgroundColor: KingdomColors.bronze,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'EB Garamond',
    },
    subtitle: {
        fontSize: 16,
        color: KingdomColors.softWhite,
        marginTop: 5,
        fontFamily: 'Sora',
    },
    scriptureOverlay: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        margin: 20,
        borderRadius: 10,
    },
    scriptureText: {
        fontSize: 16,
        color: KingdomColors.matteBlack,
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: 'EB Garamond',
    },
    locationSection: {
        padding: 20,
        backgroundColor: KingdomColors.dustGold,
        margin: 20,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 10,
        fontFamily: 'EB Garamond',
    },
    locationText: {
        fontSize: 18,
        color: KingdomColors.matteBlack,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    dateText: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        opacity: 0.8,
        fontFamily: 'Sora',
    },
    sunDataSection: {
        padding: 20,
    },
    sunCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    sunItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sunInfo: {
        marginLeft: 15,
        flex: 1,
    },
    sunLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    sunTime: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    addSessionButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        margin: 20,
        borderRadius: 10,
    },
    addSessionButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    sessionsSection: {
        padding: 20,
    },
    sessionCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sessionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        fontFamily: 'EB Garamond',
    },
    sessionIcons: {
        flexDirection: 'row',
        gap: 5,
    },
    sessionDate: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    sessionLocation: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    sessionLightType: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        fontStyle: 'italic',
        fontFamily: 'Sora',
    },
    sessionNotes: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: KingdomColors.bronze,
    },
    notesLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    notesText: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        fontStyle: 'italic',
        fontFamily: 'Sora',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: KingdomColors.matteBlack,
        padding: 20,
        borderRadius: 15,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'EB Garamond',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    input: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    textInput: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: KingdomColors.matteBlack,
        minHeight: 80,
        textAlignVertical: 'top',
        fontFamily: 'Sora',
    },
    lightTypeButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 10,
        minWidth: 80,
    },
    selectedLightType: {
        backgroundColor: KingdomColors.bronze,
    },
    lightTypeText: {
        fontSize: 12,
        color: KingdomColors.bronze,
        marginTop: 5,
        textAlign: 'center',
        fontFamily: 'Sora',
    },
    selectedLightTypeText: {
        color: KingdomColors.softWhite,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        flex: 0.48,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.bronze,
        fontFamily: 'Sora',
    },
    primaryButton: {
        backgroundColor: KingdomColors.bronze,
    },
    primaryButtonText: {
        color: KingdomColors.softWhite,
    },
});

export default SunTrackerScreen; 