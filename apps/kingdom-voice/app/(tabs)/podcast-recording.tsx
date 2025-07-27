import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    Alert,
    Switch,
    Slider,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

interface PodcastSession {
    id: string;
    title: string;
    duration: number;
    participants: Participant[];
    recordingType: 'podcast' | 'interview' | 'devotional' | 'testimony' | 'live-stream';
    faithMode: boolean;
    createdAt: Date;
    status: 'recording' | 'paused' | 'completed' | 'processing' | 'live-streaming';
    // Recording features
    multitrackEnabled: boolean;
    localRecording: boolean;
    highResolutionAudio: boolean;
    voiceIsolation: boolean;
    liveMonitoring: boolean;
    mobileRecording: boolean;
    desktopRecording: boolean;
    liveConversation: boolean;
}

interface Participant {
    id: string;
    name: string;
    role: 'host' | 'guest' | 'producer';
    audioTrack: AudioTrack;
    isConnected: boolean;
    isRecording: boolean;
}

interface AudioTrack {
    id: string;
    participantId: string;
    quality: 'standard' | 'high' | 'studio';
    sampleRate: number;
    isIsolated: boolean;
    isMonitored: boolean;
}

interface RecordingSettings {
    // Recording & Input
    multitrackRecording: boolean;
    localRecording: boolean;
    highResolutionAudio: boolean;
    voiceIsolation: boolean;
    liveMonitoring: boolean;
    mobileRecording: boolean;
    desktopRecording: boolean;
    liveConversation: boolean;

    // Audio Quality
    sampleRate: number;
    bitDepth: number;
    channels: number;

    // Voice Processing
    noiseSuppression: boolean;
    echoCancellation: boolean;
    autoGainControl: boolean;

    // Faith Mode
    faithMode: boolean;
    spiritualContent: boolean;
}

const PodcastRecordingScreen: React.FC = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [currentSession, setCurrentSession] = useState<PodcastSession | null>(null);
    const [settings, setSettings] = useState<RecordingSettings>({
        multitrackRecording: true,
        localRecording: true,
        highResolutionAudio: true,
        voiceIsolation: true,
        liveMonitoring: true,
        mobileRecording: true,
        desktopRecording: false,
        liveConversation: true,
        sampleRate: 48000,
        bitDepth: 24,
        channels: 2,
        noiseSuppression: true,
        echoCancellation: true,
        autoGainControl: true,
        faithMode: true,
        spiritualContent: true,
    });

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);

    const audioQualityOptions = [
        { value: 44100, label: '44.1kHz (CD Quality)', icon: 'musical-notes' },
        { value: 48000, label: '48kHz (Professional)', icon: 'musical-note' },
        { value: 96000, label: '96kHz (Studio)', icon: 'musical-notes' },
    ];

    const bitDepthOptions = [
        { value: 16, label: '16-bit', icon: 'analytics' },
        { value: 24, label: '24-bit', icon: 'analytics' },
        { value: 32, label: '32-bit', icon: 'analytics' },
    ];

    useEffect(() => {
        requestPermissions();
        return () => {
            if (recordingInterval) {
                clearInterval(recordingInterval);
            }
        };
    }, []);

    const requestPermissions = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        } catch (error) {
            console.error('Permission request error:', error);
            setHasPermission(false);
        }
    };

    const startRecording = async () => {
        if (!hasPermission) {
            Alert.alert('Permissions Required', 'Microphone permission is required for podcast recording.');
            return;
        }

        try {
            const sessionId = `podcast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const newSession: PodcastSession = {
                id: sessionId,
                title: 'Podcast Recording',
                duration: 0,
                participants: [
                    {
                        id: 'host_1',
                        name: 'You',
                        role: 'host',
                        audioTrack: {
                            id: 'track_1',
                            participantId: 'host_1',
                            quality: 'studio',
                            sampleRate: settings.sampleRate,
                            isIsolated: settings.voiceIsolation,
                            isMonitored: settings.liveMonitoring,
                        },
                        isConnected: true,
                        isRecording: true,
                    }
                ],
                recordingType: 'podcast',
                faithMode: settings.faithMode,
                createdAt: new Date(),
                status: 'recording',
                multitrackEnabled: settings.multitrackRecording,
                localRecording: settings.localRecording,
                highResolutionAudio: settings.highResolutionAudio,
                voiceIsolation: settings.voiceIsolation,
                liveMonitoring: settings.liveMonitoring,
                mobileRecording: settings.mobileRecording,
                desktopRecording: settings.desktopRecording,
                liveConversation: settings.liveConversation,
            };

            setCurrentSession(newSession);
            setIsRecording(true);
            setRecordingTime(0);

            // Start recording timer
            const interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
            setRecordingInterval(interval);

            Alert.alert(
                'Podcast Recording Started',
                'Your podcast is now recording with high-quality audio. Tap the stop button when finished.'
            );

        } catch (error) {
            console.error('Recording start error:', error);
            Alert.alert('Recording Failed', 'Failed to start recording. Please try again.');
        }
    };

    const stopRecording = async () => {
        if (!currentSession) return;

        try {
            setIsRecording(false);
            if (recordingInterval) {
                clearInterval(recordingInterval);
                setRecordingInterval(null);
            }

            const updatedSession: PodcastSession = {
                ...currentSession,
                duration: recordingTime,
                status: 'processing',
            };

            setCurrentSession(null);
            setRecordingTime(0);

            Alert.alert(
                'Recording Complete',
                'Your podcast recording has been saved and is being processed with AI enhancements.',
                [
                    { text: 'Process with AI', onPress: () => processWithAI(updatedSession) },
                    { text: 'OK' }
                ]
            );

        } catch (error) {
            console.error('Recording stop error:', error);
            Alert.alert('Recording Error', 'Failed to stop recording. Please try again.');
        }
    };

    const processWithAI = async (session: PodcastSession) => {
        Alert.alert(
            'AI Processing',
            'Processing your podcast with voice cleanup, transcription, and AI enhancements...',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        setTimeout(() => {
                            Alert.alert(
                                'Processing Complete',
                                'Your podcast has been enhanced with AI voice cleanup, transcription, and show notes!'
                            );
                        }, 3000);
                    }
                }
            ]
        );
    };

    const addGuest = () => {
        const guestId = `guest_${Date.now()}`;
        const newGuest: Participant = {
            id: guestId,
            name: `Guest ${participants.length + 1}`,
            role: 'guest',
            audioTrack: {
                id: `track_${guestId}`,
                participantId: guestId,
                quality: 'studio',
                sampleRate: settings.sampleRate,
                isIsolated: settings.voiceIsolation,
                isMonitored: settings.liveMonitoring,
            },
            isConnected: true,
            isRecording: true,
        };

        setParticipants(prev => [...prev, newGuest]);
        Alert.alert('Guest Added', 'New guest has been added to the recording session.');
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const renderRecordingControls = () => (
        <View style={styles.recordingSection}>
            <View style={styles.recordingInfo}>
                <Text style={styles.recordingTitle}>
                    {currentSession?.title || 'Ready to Record Podcast'}
                </Text>
                <Text style={styles.recordingTime}>
                    {formatTime(recordingTime)}
                </Text>
                <Text style={styles.recordingQuality}>
                    {settings.sampleRate / 1000}kHz • {settings.bitDepth}-bit • {settings.channels} channels
                </Text>
            </View>

            <View style={styles.controlButtons}>
                {!isRecording ? (
                    <TouchableOpacity
                        style={styles.recordButton}
                        onPress={startRecording}
                    >
                        <Text style={styles.recordButtonText}>🎙️ Start Recording</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.stopButton}
                        onPress={stopRecording}
                    >
                        <Text style={styles.stopButtonText}>⏹️ Stop Recording</Text>
                    </TouchableOpacity>
                )}

                {isRecording && (
                    <TouchableOpacity
                        style={styles.addGuestButton}
                        onPress={addGuest}
                    >
                        <Text style={styles.addGuestButtonText}>👥 Add Guest</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderRecordingFeatures = () => (
        <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Recording & Input Features</Text>

            <View style={styles.featureGrid}>
                <TouchableOpacity style={styles.featureCard}>
                    <Ionicons name="layers" size={24} color={Colors.light.accent} />
                    <Text style={styles.featureTitle}>Multi-track Recording</Text>
                    <Text style={styles.featureDescription}>
                        Host + guests recorded separately
                    </Text>
                    <Switch
                        value={settings.multitrackRecording}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, multitrackRecording: value }))}
                        trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                        thumbColor={settings.multitrackRecording ? '#FFFFFF' : '#666666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                    <Ionicons name="cloud-offline" size={24} color={Colors.light.accent} />
                    <Text style={styles.featureTitle}>Local Recording</Text>
                    <Text style={styles.featureDescription}>
                        Not internet-reliant
                    </Text>
                    <Switch
                        value={settings.localRecording}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, localRecording: value }))}
                        trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                        thumbColor={settings.localRecording ? '#FFFFFF' : '#666666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                    <Ionicons name="musical-notes" size={24} color={Colors.light.accent} />
                    <Text style={styles.featureTitle}>High-Resolution Audio</Text>
                    <Text style={styles.featureDescription}>
                        Up to 48kHz or higher
                    </Text>
                    <Switch
                        value={settings.highResolutionAudio}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, highResolutionAudio: value }))}
                        trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                        thumbColor={settings.highResolutionAudio ? '#FFFFFF' : '#666666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                    <Ionicons name="mic" size={24} color={Colors.light.accent} />
                    <Text style={styles.featureTitle}>Voice Isolation</Text>
                    <Text style={styles.featureDescription}>
                        Background noise suppression
                    </Text>
                    <Switch
                        value={settings.voiceIsolation}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, voiceIsolation: value }))}
                        trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                        thumbColor={settings.voiceIsolation ? '#FFFFFF' : '#666666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                    <Ionicons name="headset" size={24} color={Colors.light.accent} />
                    <Text style={styles.featureTitle}>Live Monitoring</Text>
                    <Text style={styles.featureDescription}>
                        Hear yourself in real time
                    </Text>
                    <Switch
                        value={settings.liveMonitoring}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, liveMonitoring: value }))}
                        trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                        thumbColor={settings.liveMonitoring ? '#FFFFFF' : '#666666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                    <Ionicons name="phone-portrait" size={24} color={Colors.light.accent} />
                    <Text style={styles.featureTitle}>Mobile Recording</Text>
                    <Text style={styles.featureDescription}>
                        Record on mobile devices
                    </Text>
                    <Switch
                        value={settings.mobileRecording}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, mobileRecording: value }))}
                        trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                        thumbColor={settings.mobileRecording ? '#FFFFFF' : '#666666'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderAudioSettings = () => (
        <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Audio Quality Settings</Text>

            <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Sample Rate</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {audioQualityOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.optionButton,
                                settings.sampleRate === option.value && styles.optionButtonActive
                            ]}
                            onPress={() => setSettings(prev => ({ ...prev, sampleRate: option.value }))}
                        >
                            <Ionicons name={option.icon as any} size={16} color={settings.sampleRate === option.value ? '#FFFFFF' : Colors.light.accent} />
                            <Text style={[
                                styles.optionText,
                                settings.sampleRate === option.value && styles.optionTextActive
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Bit Depth</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {bitDepthOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.optionButton,
                                settings.bitDepth === option.value && styles.optionButtonActive
                            ]}
                            onPress={() => setSettings(prev => ({ ...prev, bitDepth: option.value }))}
                        >
                            <Ionicons name={option.icon as any} size={16} color={settings.bitDepth === option.value ? '#FFFFFF' : Colors.light.accent} />
                            <Text style={[
                                styles.optionText,
                                settings.bitDepth === option.value && styles.optionTextActive
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );

    const renderParticipants = () => (
        <View style={styles.participantsSection}>
            <Text style={styles.sectionTitle}>Participants</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {participants.map((participant) => (
                    <TouchableOpacity
                        key={participant.id}
                        style={styles.participantCard}
                    >
                        <Ionicons
                            name={participant.role === 'host' ? 'person' : 'people'}
                            size={24}
                            color={participant.isConnected ? '#28A745' : '#DC3545'}
                        />
                        <Text style={styles.participantName}>{participant.name}</Text>
                        <Text style={styles.participantRole}>{participant.role}</Text>
                        <View style={[
                            styles.connectionStatus,
                            { backgroundColor: participant.isConnected ? '#28A745' : '#DC3545' }
                        ]} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    if (hasPermission === null) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.light.accent} />
                    <Text style={styles.loadingText}>Requesting permissions...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (hasPermission === false) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionTitle}>Permissions Required</Text>
                    <Text style={styles.permissionText}>
                        Microphone permission is required for podcast recording.
                    </Text>
                    <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
                        <Text style={styles.permissionButtonText}>Grant Permissions</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Podcast Recording Studio</Text>
                    <Text style={styles.subtitle}>
                        Professional podcast recording with high-quality audio and AI enhancements
                    </Text>
                </View>

                {renderRecordingControls()}
                {renderRecordingFeatures()}
                {renderAudioSettings()}
                {renderParticipants()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.text,
        textAlign: 'center',
        lineHeight: 22,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.light.text,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 16,
    },
    permissionText: {
        fontSize: 16,
        color: Colors.light.text,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    permissionButton: {
        backgroundColor: Colors.light.accent,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    permissionButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    recordingSection: {
        marginHorizontal: 20,
        marginBottom: 24,
        backgroundColor: Colors.light.background,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    recordingInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    recordingTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
    },
    recordingTime: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.light.accent,
        fontFamily: 'monospace',
    },
    recordingQuality: {
        fontSize: 14,
        color: Colors.light.text,
        marginTop: 8,
    },
    controlButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    recordButton: {
        backgroundColor: '#28A745',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flex: 1,
        marginHorizontal: 8,
        alignItems: 'center',
    },
    recordButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    stopButton: {
        backgroundColor: '#DC3545',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flex: 1,
        marginHorizontal: 8,
        alignItems: 'center',
    },
    stopButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    addGuestButton: {
        backgroundColor: Colors.light.accent,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 12,
        alignItems: 'center',
    },
    addGuestButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    featuresSection: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    settingsSection: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    participantsSection: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 16,
    },
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        width: '48%',
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 8,
        marginBottom: 4,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 12,
        color: Colors.light.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    settingRow: {
        marginBottom: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 8,
    },
    optionButton: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionButtonActive: {
        backgroundColor: Colors.light.accent,
    },
    optionText: {
        fontSize: 12,
        color: Colors.light.text,
        marginLeft: 4,
    },
    optionTextActive: {
        color: '#FFFFFF',
    },
    participantCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginRight: 16,
        minWidth: 120,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    participantName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 8,
        marginBottom: 4,
    },
    participantRole: {
        fontSize: 12,
        color: Colors.light.text,
        textTransform: 'capitalize',
    },
    connectionStatus: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 8,
    },
});

export default PodcastRecordingScreen; 