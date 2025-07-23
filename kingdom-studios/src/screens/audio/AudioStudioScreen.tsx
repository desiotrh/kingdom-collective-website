import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
    Modal,
    Dimensions,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useTierSystem } from '../../contexts/TierSystemContext';
import { useDualMode } from '../../contexts/DualModeContext';
import { KingdomColors } from '../../constants/KingdomColors';

interface AudioTrack {
    id: string;
    title: string;
    duration: number;
    url: string;
    isPremium: boolean;
    category: 'worship' | 'background' | 'voiceover' | 'sound_effects';
    faithMode?: boolean;
}

interface AudioProject {
    id: string;
    name: string;
    tracks: AudioTrack[];
    duration: number;
    createdAt: Date;
}

const AudioStudioScreen: React.FC = () => {
    // State Management
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [currentProject, setCurrentProject] = useState<AudioProject | null>(null);
    const [selectedTracks, setSelectedTracks] = useState<AudioTrack[]>([]);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState<'mp3' | 'wav' | 'aac'>('mp3');
    const [voiceoverText, setVoiceoverText] = useState('');
    const [isGeneratingVoiceover, setIsGeneratingVoiceover] = useState(false);

    // Refs
    const recordingRef = useRef<Audio.Recording | null>(null);
    const playbackRef = useRef<Audio.Sound | null>(null);

    // Context
    const { currentTier, tierFeatures, checkFeatureAccess, trackUsage, getUsageStats } = useTierSystem();
    const { isFaithMode, faithModeConfig } = useDualMode();

    // Mock Audio Library
    const audioLibrary: AudioTrack[] = [
        {
            id: '1',
            title: 'Kingdom Worship',
            duration: 180,
            url: 'https://example.com/kingdom-worship.mp3',
            isPremium: true,
            category: 'worship',
            faithMode: true,
        },
        {
            id: '2',
            title: 'Encouraging Background',
            duration: 240,
            url: 'https://example.com/encouraging-bg.mp3',
            isPremium: false,
            category: 'background',
            faithMode: true,
        },
        {
            id: '3',
            title: 'Professional Voiceover',
            duration: 120,
            url: 'https://example.com/pro-voiceover.mp3',
            isPremium: true,
            category: 'voiceover',
        },
        {
            id: '4',
            title: 'Sound Effects Pack',
            duration: 60,
            url: 'https://example.com/sound-effects.mp3',
            isPremium: false,
            category: 'sound_effects',
        },
    ];

    // Initialize Audio
    useEffect(() => {
        setupAudio();
        return () => {
            cleanupAudio();
        };
    }, []);

    const setupAudio = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                staysActiveInBackground: true,
                playThroughEarpieceAndroid: false,
            });
        } catch (error) {
            console.error('Failed to setup audio:', error);
        }
    };

    const cleanupAudio = () => {
        if (recording) {
            recording.stopAndUnloadAsync();
        }
        if (sound) {
            sound.unloadAsync();
        }
    };

    // Recording Functions
    const startRecording = async () => {
        try {
            const hasAccess = await checkFeatureAccess('audio_recording');
            if (!hasAccess) {
                Alert.alert(
                    'Recording Not Available',
                    'Audio recording is available for Rooted tier and above. Upgrade to unlock this feature.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Upgrade', onPress: () => {/* Navigate to upgrade */ } },
                    ]
                );
                return;
            }

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
            recordingRef.current = recording;

            await trackUsage('audio_studio', 'recording_started');
        } catch (error) {
            console.error('Failed to start recording:', error);
            Alert.alert('Error', 'Failed to start recording');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setIsRecording(false);
            setRecording(null);
            recordingRef.current = null;

            if (uri) {
                // Add to project tracks
                const newTrack: AudioTrack = {
                    id: Date.now().toString(),
                    title: `Recording ${new Date().toLocaleTimeString()}`,
                    duration: 0, // Would calculate actual duration
                    url: uri,
                    isPremium: false,
                    category: 'voiceover',
                };

                if (currentProject) {
                    setCurrentProject({
                        ...currentProject,
                        tracks: [...currentProject.tracks, newTrack],
                    });
                }

                await trackUsage('audio_studio', 'recording_completed');
            }
        } catch (error) {
            console.error('Failed to stop recording:', error);
        }
    };

    // Playback Functions
    const playTrack = async (track: AudioTrack) => {
        try {
            const { sound } = await Audio.Sound.createAsync({ uri: track.url });
            setSound(sound);
            playbackRef.current = sound;
            await sound.playAsync();
        } catch (error) {
            console.error('Failed to play track:', error);
        }
    };

    const stopPlayback = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
            playbackRef.current = null;
        }
    };

    // Voiceover Generation
    const generateVoiceover = async () => {
        if (!voiceoverText.trim()) {
            Alert.alert('Error', 'Please enter text for voiceover generation');
            return;
        }

        const hasAccess = await checkFeatureAccess('ai_voiceover');
        if (!hasAccess) {
            Alert.alert(
                'AI Voiceover Not Available',
                'AI voiceover generation is available for Commissioned tier and above.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Upgrade', onPress: () => {/* Navigate to upgrade */ } },
                ]
            );
            return;
        }

        setIsGeneratingVoiceover(true);

        try {
            // Simulate AI voiceover generation
            await new Promise(resolve => setTimeout(resolve, 3000));

            const newTrack: AudioTrack = {
                id: Date.now().toString(),
                title: `AI Voiceover: ${voiceoverText.substring(0, 30)}...`,
                duration: Math.ceil(voiceoverText.length / 15), // Rough estimate
                url: 'https://example.com/ai-voiceover.mp3',
                isPremium: true,
                category: 'voiceover',
            };

            if (currentProject) {
                setCurrentProject({
                    ...currentProject,
                    tracks: [...currentProject.tracks, newTrack],
                });
            }

            setVoiceoverText('');
            await trackUsage('audio_studio', 'voiceover_generated');
        } catch (error) {
            console.error('Failed to generate voiceover:', error);
            Alert.alert('Error', 'Failed to generate voiceover');
        } finally {
            setIsGeneratingVoiceover(false);
        }
    };

    // Export Functions
    const exportProject = async () => {
        if (!currentProject || currentProject.tracks.length === 0) {
            Alert.alert('Error', 'No project to export');
            return;
        }

        const hasAccess = await checkFeatureAccess('audio_export');
        if (!hasAccess) {
            Alert.alert(
                'Export Not Available',
                'Audio export is available for Rooted tier and above.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Upgrade', onPress: () => {/* Navigate to upgrade */ } },
                ]
            );
            return;
        }

        try {
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert(
                'Export Complete',
                `Project exported as ${exportFormat.toUpperCase()} file`,
                [{ text: 'OK' }]
            );

            await trackUsage('audio_studio', 'project_exported');
        } catch (error) {
            console.error('Failed to export project:', error);
            Alert.alert('Error', 'Failed to export project');
        }
    };

    // Project Management
    const createNewProject = () => {
        const newProject: AudioProject = {
            id: Date.now().toString(),
            name: `Project ${new Date().toLocaleDateString()}`,
            tracks: [],
            duration: 0,
            createdAt: new Date(),
        };
        setCurrentProject(newProject);
    };

    const addTrackToProject = (track: AudioTrack) => {
        if (!currentProject) {
            createNewProject();
        }

        if (currentProject) {
            setCurrentProject({
                ...currentProject,
                tracks: [...currentProject.tracks, track],
            });
        }
    };

    // Render Functions
    const renderTrackItem = (track: AudioTrack) => {
        const isPremium = track.isPremium;
        const canAccess = !isPremium || currentTier !== 'seed';

        return (
            <TouchableOpacity
                key={track.id}
                style={[
                    styles.trackItem,
                    !canAccess && styles.trackItemLocked,
                ]}
                onPress={() => canAccess && addTrackToProject(track)}
                disabled={!canAccess}
            >
                <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle}>
                        {track.title}
                        {track.faithMode && isFaithMode && (
                            <Text style={styles.faithBadge}> ✝️</Text>
                        )}
                    </Text>
                    <Text style={styles.trackDuration}>
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </Text>
                </View>

                <View style={styles.trackActions}>
                    {isPremium && (
                        <View style={styles.premiumBadge}>
                            <Ionicons name="star" size={12} color={KingdomColors.gold} />
                            <Text style={styles.premiumText}>Premium</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.playButton}
                        onPress={() => canAccess && playTrack(track)}
                        disabled={!canAccess}
                    >
                        <Ionicons name="play" size={16} color={KingdomColors.white} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const renderProjectTracks = () => {
        if (!currentProject || currentProject.tracks.length === 0) {
            return (
                <View style={styles.emptyProject}>
                    <Ionicons name="musical-notes" size={48} color={KingdomColors.gray} />
                    <Text style={styles.emptyText}>No tracks in project</Text>
                    <Text style={styles.emptySubtext}>Add tracks from the library to get started</Text>
                </View>
            );
        }

        return (
            <View style={styles.projectTracks}>
                {currentProject.tracks.map((track, index) => (
                    <View key={track.id} style={styles.projectTrackItem}>
                        <Text style={styles.trackNumber}>{index + 1}</Text>
                        <View style={styles.trackInfo}>
                            <Text style={styles.trackTitle}>{track.title}</Text>
                            <Text style={styles.trackDuration}>
                                {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => {
                                setCurrentProject({
                                    ...currentProject,
                                    tracks: currentProject.tracks.filter(t => t.id !== track.id),
                                });
                            }}
                        >
                            <Ionicons name="close" size={16} color={KingdomColors.red} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={[KingdomColors.darkPurple, KingdomColors.black]}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>
                    {isFaithMode ? 'Kingdom Audio Studio' : 'Audio Studio'}
                </Text>
                <Text style={styles.headerSubtitle}>
                    Create professional audio content with {isFaithMode ? 'faith-inspired' : 'engaging'} tracks
                </Text>
            </LinearGradient>

            {/* Usage Stats */}
            <View style={styles.usageContainer}>
                <Text style={styles.usageTitle}>Monthly Usage</Text>
                <View style={styles.usageStats}>
                    <View style={styles.usageItem}>
                        <Text style={styles.usageLabel}>Downloads</Text>
                        <Text style={styles.usageValue}>
                            {getUsageStats().audioStudio?.downloads || 0} / {tierFeatures.audioStudio?.downloads || '∞'}
                        </Text>
                    </View>
                    <View style={styles.usageItem}>
                        <Text style={styles.usageLabel}>Projects</Text>
                        <Text style={styles.usageValue}>
                            {getUsageStats().audioStudio?.projects || 0} / {tierFeatures.audioStudio?.projects || '∞'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Recording Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Voice Recording</Text>
                <View style={styles.recordingContainer}>
                    <TouchableOpacity
                        style={[
                            styles.recordButton,
                            isRecording && styles.recordButtonActive,
                        ]}
                        onPress={isRecording ? stopRecording : startRecording}
                    >
                        <Ionicons
                            name={isRecording ? 'stop' : 'mic'}
                            size={24}
                            color={KingdomColors.white}
                        />
                        <Text style={styles.recordButtonText}>
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* AI Voiceover Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Voiceover Generation</Text>
                <View style={styles.voiceoverContainer}>
                    <TextInput
                        style={styles.voiceoverInput}
                        placeholder="Enter text for AI voiceover..."
                        placeholderTextColor={KingdomColors.gray}
                        value={voiceoverText}
                        onChangeText={setVoiceoverText}
                        multiline
                        numberOfLines={4}
                    />
                    <TouchableOpacity
                        style={[
                            styles.generateButton,
                            isGeneratingVoiceover && styles.generateButtonDisabled,
                        ]}
                        onPress={generateVoiceover}
                        disabled={isGeneratingVoiceover}
                    >
                        <Ionicons
                            name="sparkles"
                            size={16}
                            color={KingdomColors.white}
                        />
                        <Text style={styles.generateButtonText}>
                            {isGeneratingVoiceover ? 'Generating...' : 'Generate Voiceover'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Audio Library */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Audio Library</Text>
                <View style={styles.libraryContainer}>
                    {audioLibrary.map(renderTrackItem)}
                </View>
            </View>

            {/* Current Project */}
            <View style={styles.section}>
                <View style={styles.projectHeader}>
                    <Text style={styles.sectionTitle}>
                        {currentProject ? currentProject.name : 'No Active Project'}
                    </Text>
                    {!currentProject && (
                        <TouchableOpacity
                            style={styles.newProjectButton}
                            onPress={createNewProject}
                        >
                            <Ionicons name="add" size={16} color={KingdomColors.white} />
                            <Text style={styles.newProjectButtonText}>New Project</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {renderProjectTracks()}
            </View>

            {/* Export Section */}
            {currentProject && currentProject.tracks.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Export Project</Text>
                    <View style={styles.exportContainer}>
                        <View style={styles.formatSelector}>
                            <Text style={styles.formatLabel}>Export Format:</Text>
                            <View style={styles.formatButtons}>
                                {(['mp3', 'wav', 'aac'] as const).map((format) => (
                                    <TouchableOpacity
                                        key={format}
                                        style={[
                                            styles.formatButton,
                                            exportFormat === format && styles.formatButtonActive,
                                        ]}
                                        onPress={() => setExportFormat(format)}
                                    >
                                        <Text style={[
                                            styles.formatButtonText,
                                            exportFormat === format && styles.formatButtonTextActive,
                                        ]}>
                                            {format.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.exportButton}
                            onPress={exportProject}
                        >
                            <Ionicons name="download" size={16} color={KingdomColors.white} />
                            <Text style={styles.exportButtonText}>Export Project</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Export Modal */}
            <Modal
                visible={showExportModal}
                transparent
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Export Options</Text>
                        {/* Export options would go here */}
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowExportModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.black,
    },
    header: {
        padding: 20,
        paddingTop: 60,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: KingdomColors.white,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: KingdomColors.gray,
    },
    usageContainer: {
        margin: 20,
        padding: 16,
        backgroundColor: KingdomColors.darkGray,
        borderRadius: 12,
    },
    usageTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: KingdomColors.white,
        marginBottom: 12,
    },
    usageStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    usageItem: {
        alignItems: 'center',
    },
    usageLabel: {
        fontSize: 12,
        color: KingdomColors.gray,
        marginBottom: 4,
    },
    usageValue: {
        fontSize: 16,
        fontWeight: '600',
        color: KingdomColors.white,
    },
    section: {
        margin: 20,
        marginTop: 0,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: KingdomColors.white,
        marginBottom: 16,
    },
    recordingContainer: {
        alignItems: 'center',
    },
    recordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: KingdomColors.orange,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    recordButtonActive: {
        backgroundColor: KingdomColors.red,
    },
    recordButtonText: {
        color: KingdomColors.white,
        fontWeight: '600',
        marginLeft: 8,
    },
    voiceoverContainer: {
        gap: 12,
    },
    voiceoverInput: {
        backgroundColor: KingdomColors.darkGray,
        borderRadius: 8,
        padding: 12,
        color: KingdomColors.white,
        fontSize: 16,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: KingdomColors.purple,
        paddingVertical: 12,
        borderRadius: 8,
    },
    generateButtonDisabled: {
        opacity: 0.6,
    },
    generateButtonText: {
        color: KingdomColors.white,
        fontWeight: '600',
        marginLeft: 8,
    },
    libraryContainer: {
        gap: 12,
    },
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: KingdomColors.darkGray,
        padding: 16,
        borderRadius: 8,
    },
    trackItemLocked: {
        opacity: 0.5,
    },
    trackInfo: {
        flex: 1,
    },
    trackTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: KingdomColors.white,
        marginBottom: 4,
    },
    trackDuration: {
        fontSize: 14,
        color: KingdomColors.gray,
    },
    trackActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: KingdomColors.gold + '20',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    premiumText: {
        fontSize: 12,
        color: KingdomColors.gold,
        marginLeft: 4,
    },
    playButton: {
        backgroundColor: KingdomColors.purple,
        padding: 8,
        borderRadius: 20,
    },
    faithBadge: {
        color: KingdomColors.gold,
    },
    projectHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    newProjectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: KingdomColors.purple,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    newProjectButtonText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 4,
    },
    emptyProject: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: KingdomColors.darkGray,
        borderRadius: 12,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: KingdomColors.white,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: KingdomColors.gray,
        textAlign: 'center',
    },
    projectTracks: {
        gap: 8,
    },
    projectTrackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: KingdomColors.darkGray,
        padding: 12,
        borderRadius: 8,
    },
    trackNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: KingdomColors.orange,
        marginRight: 12,
        minWidth: 24,
    },
    removeButton: {
        padding: 4,
    },
    exportContainer: {
        gap: 16,
    },
    formatSelector: {
        gap: 8,
    },
    formatLabel: {
        fontSize: 16,
        color: KingdomColors.white,
        marginBottom: 8,
    },
    formatButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    formatButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: KingdomColors.darkGray,
    },
    formatButtonActive: {
        backgroundColor: KingdomColors.purple,
    },
    formatButtonText: {
        color: KingdomColors.gray,
        fontWeight: '500',
    },
    formatButtonTextActive: {
        color: KingdomColors.white,
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: KingdomColors.orange,
        paddingVertical: 12,
        borderRadius: 8,
    },
    exportButtonText: {
        color: KingdomColors.white,
        fontWeight: '600',
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: KingdomColors.darkGray,
        borderRadius: 12,
        padding: 24,
        width: '80%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: KingdomColors.white,
        marginBottom: 16,
    },
    modalButton: {
        backgroundColor: KingdomColors.purple,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    modalButtonText: {
        color: KingdomColors.white,
        fontWeight: '600',
    },
});

export default AudioStudioScreen; 