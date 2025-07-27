import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

interface VideoPodcastSession {
    id: string;
    title: string;
    duration: number;
    participants: VideoParticipant[];
    recordingType: 'video-podcast' | 'live-stream' | 'interview' | 'devotional';
    faithMode: boolean;
    createdAt: Date;
    status: 'recording' | 'paused' | 'completed' | 'processing' | 'live-streaming';
    // Video features
    hdRecording: boolean;
    cameraSwitching: boolean;
    autoLayout: boolean;
    brandedOverlays: boolean;
    backgroundBlur: boolean;
    backgroundReplacement: boolean;
    liveChat: boolean;
}

interface VideoParticipant {
    id: string;
    name: string;
    role: 'host' | 'guest' | 'producer';
    videoTrack: VideoTrack;
    audioTrack: AudioTrack;
    isConnected: boolean;
    isRecording: boolean;
    cameraActive: boolean;
}

interface VideoTrack {
    id: string;
    participantId: string;
    quality: 'hd' | '4k';
    resolution: string;
    frameRate: number;
    isActive: boolean;
}

interface AudioTrack {
    id: string;
    participantId: string;
    quality: 'standard' | 'high' | 'studio';
    sampleRate: number;
    isActive: boolean;
}

interface BrandedOverlay {
    id: string;
    type: 'logo' | 'lower-thirds' | 'name-tag' | 'scripture';
    content: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    isActive: boolean;
}

const VideoPodcastingScreen: React.FC = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [currentSession, setCurrentSession] = useState<VideoPodcastSession | null>(null);
    const [settings, setSettings] = useState({
        hdRecording: true,
        cameraSwitching: true,
        autoLayout: true,
        brandedOverlays: true,
        backgroundBlur: true,
        backgroundReplacement: false,
        liveChat: true,
        faithMode: true,
    });

    const [participants, setParticipants] = useState<VideoParticipant[]>([]);
    const [overlays, setOverlays] = useState<BrandedOverlay[]>([]);
    const [selectedLayout, setSelectedLayout] = useState<'grid' | 'dynamic' | 'focus' | 'picture-in-picture'>('grid');

    const layoutOptions = [
        { id: 'grid', name: 'Grid Layout', icon: 'grid', description: 'Equal-sized participant grid' },
        { id: 'dynamic', name: 'Dynamic Switching', icon: 'swap-horizontal', description: 'Auto-switch based on speaker' },
        { id: 'focus', name: 'Focus Mode', icon: 'person', description: 'Large host, smaller guests' },
        { id: 'picture-in-picture', name: 'Picture-in-Picture', icon: 'resize', description: 'Main speaker with PiP guests' },
    ];

    const overlayTypes = [
        { id: 'logo', name: 'Logo Overlay', icon: 'image' },
        { id: 'lower-thirds', name: 'Lower Thirds', icon: 'text' },
        { id: 'name-tag', name: 'Name Tags', icon: 'person' },
        { id: 'scripture', name: 'Scripture Overlay', icon: 'book' },
    ];

    useEffect(() => {
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        try {
            // Simulate permission request
            setHasPermission(true);
        } catch (error) {
            console.error('Permission request error:', error);
            setHasPermission(false);
        }
    };

    const startRecording = async () => {
        if (!hasPermission) {
            Alert.alert('Permissions Required', 'Camera and microphone permissions are required for video podcasting.');
            return;
        }

        try {
            const sessionId = `video_podcast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const newSession: VideoPodcastSession = {
                id: sessionId,
                title: 'Video Podcast Session',
                duration: 0,
                participants: [
                    {
                        id: 'host_1',
                        name: 'You',
                        role: 'host',
                        videoTrack: {
                            id: 'video_1',
                            participantId: 'host_1',
                            quality: 'hd',
                            resolution: '1920x1080',
                            frameRate: 30,
                            isActive: true,
                        },
                        audioTrack: {
                            id: 'audio_1',
                            participantId: 'host_1',
                            quality: 'studio',
                            sampleRate: 48000,
                            isActive: true,
                        },
                        isConnected: true,
                        isRecording: true,
                        cameraActive: true,
                    }
                ],
                recordingType: 'video-podcast',
                faithMode: settings.faithMode,
                createdAt: new Date(),
                status: 'recording',
                hdRecording: settings.hdRecording,
                cameraSwitching: settings.cameraSwitching,
                autoLayout: settings.autoLayout,
                brandedOverlays: settings.brandedOverlays,
                backgroundBlur: settings.backgroundBlur,
                backgroundReplacement: settings.backgroundReplacement,
                liveChat: settings.liveChat,
            };

            setCurrentSession(newSession);
            setIsRecording(true);
            setRecordingTime(0);

            Alert.alert(
                'Video Podcast Started',
                'Your video podcast is now recording with HD quality and AI enhancements.'
            );

        } catch (error) {
            console.error('Recording start error:', error);
            Alert.alert('Recording Failed', 'Failed to start video podcast recording. Please try again.');
        }
    };

    const stopRecording = async () => {
        if (!currentSession) return;

        try {
            setIsRecording(false);

            const updatedSession: VideoPodcastSession = {
                ...currentSession,
                duration: recordingTime,
                status: 'processing',
            };

            setCurrentSession(null);
            setRecordingTime(0);

            Alert.alert(
                'Recording Complete',
                'Your video podcast has been saved and is being processed with AI enhancements.',
                [
                    { text: 'Process with AI', onPress: () => processVideoWithAI(updatedSession) },
                    { text: 'OK' }
                ]
            );

        } catch (error) {
            console.error('Recording stop error:', error);
            Alert.alert('Recording Error', 'Failed to stop recording. Please try again.');
        }
    };

    const processVideoWithAI = async (session: VideoPodcastSession) => {
        Alert.alert(
            'AI Video Processing',
            'Processing your video podcast with AI enhancements, auto-captions, and optimization...',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        setTimeout(() => {
                            Alert.alert(
                                'Processing Complete',
                                'Your video podcast has been enhanced with AI features!'
                            );
                        }, 3000);
                    }
                }
            ]
        );
    };

    const addOverlay = (type: string) => {
        const newOverlay: BrandedOverlay = {
            id: `overlay_${Date.now()}`,
            type: type as any,
            content: type === 'logo' ? 'Kingdom Voice' : type === 'scripture' ? 'John 3:16' : 'Sample Text',
            position: 'bottom-right',
            isActive: true,
        };
        setOverlays(prev => [...prev, newOverlay]);
        Alert.alert('Overlay Added', `${type} overlay has been added to your video.`);
    };

    const toggleBackgroundEffect = (effect: 'blur' | 'replacement') => {
        if (effect === 'blur') {
            setSettings(prev => ({ ...prev, backgroundBlur: !prev.backgroundBlur }));
        } else {
            setSettings(prev => ({ ...prev, backgroundReplacement: !prev.backgroundReplacement }));
        }
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
                    {currentSession?.title || 'Ready to Record Video Podcast'}
                </Text>
                <Text style={styles.recordingTime}>
                    {formatTime(recordingTime)}
                </Text>
                <Text style={styles.recordingQuality}>
                    HD • {settings.hdRecording ? '1920x1080' : '1280x720'} • 30fps
                </Text>
            </View>

            <View style={styles.controlButtons}>
                {!isRecording ? (
                    <TouchableOpacity
                        style={styles.recordButton}
                        onPress={startRecording}
                    >
                        <Text style={styles.recordButtonText}>🎥 Start Video Podcast</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.stopButton}
                        onPress={stopRecording}
                    >
                        <Text style={styles.stopButtonText}>⏹️ Stop Recording</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderVideoFeatures = () => (
        <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Video Podcasting Features</Text>

            <View style={styles.featureGrid}>
                <TouchableOpacity style={styles.featureCard}>
                    <Ionicons name="videocam" size={24} color={Colors.light.accent} />
                    <Text style={styles.featureTitle}>HD Video Recording</Text>
                    <Text style={styles.featureDescription}>
                        High-definition video recording
                    </Text>
                    <Switch
                        value={settings.hdRecording}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, hdRecording: value }))}
                        trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                        thumbColor={settings.hdRecording ? '#FFFFFF' : '#666666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                    <Ionicons name="swap-horizontal" size={24} color={Colors.light.accent} />
                    <Text style={styles.featureTitle}>Camera Switching</Text>
                    <Text style={styles.featureDescription}>
                        Automatic camera switching
                    </Text>
                    <Switch
                        value={settings.cameraSwitching}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, cameraSwitching: value }))}
                        trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                        thumbColor={settings.cameraSwitching ? '#FFFFFF' : '#666666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                    <Ionicons name="grid" size={24} color={Colors.light.accent} />
                    <Text style={styles.featureTitle}>Auto Layout</Text>
                    <Text style={styles.featureDescription}>
                        Dynamic layout switching
                    </Text>
                    <Switch
                        value={settings.autoLayout}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, autoLayout: value }))}
                        trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                        thumbColor={settings.autoLayout ? '#FFFFFF' : '#666666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                    <Ionicons name="image" size={24} color={Colors.light.accent} />
                    <Text style={styles.featureTitle}>Branded Overlays</Text>
                    <Text style={styles.featureDescription}>
                        Logos, lower thirds, name tags
                    </Text>
                    <Switch
                        value={settings.brandedOverlays}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, brandedOverlays: value }))}
                        trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                        thumbColor={settings.brandedOverlays ? '#FFFFFF' : '#666666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                    <Ionicons name="blur" size={24} color={Colors.light.accent} />
                    <Text style={styles.featureTitle}>Background Blur</Text>
                    <Text style={styles.featureDescription}>
                        AI-powered background blur
                    </Text>
                    <Switch
                        value={settings.backgroundBlur}
                        onValueChange={(value) => toggleBackgroundEffect('blur')}
                        trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                        thumbColor={settings.backgroundBlur ? '#FFFFFF' : '#666666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                    <Ionicons name="chatbubbles" size={24} color={Colors.light.accent} />
                    <Text style={styles.featureTitle}>Live Chat</Text>
                    <Text style={styles.featureDescription}>
                        Real-time viewer feedback
                    </Text>
                    <Switch
                        value={settings.liveChat}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, liveChat: value }))}
                        trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                        thumbColor={settings.liveChat ? '#FFFFFF' : '#666666'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderLayoutOptions = () => (
        <View style={styles.layoutSection}>
            <Text style={styles.sectionTitle}>Layout Options</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {layoutOptions.map((layout) => (
                    <TouchableOpacity
                        key={layout.id}
                        style={[
                            styles.layoutCard,
                            selectedLayout === layout.id && styles.layoutCardActive
                        ]}
                        onPress={() => setSelectedLayout(layout.id as any)}
                    >
                        <Ionicons
                            name={layout.icon as any}
                            size={24}
                            color={selectedLayout === layout.id ? '#FFFFFF' : Colors.light.accent}
                        />
                        <Text style={[
                            styles.layoutName,
                            selectedLayout === layout.id && styles.layoutNameActive
                        ]}>
                            {layout.name}
                        </Text>
                        <Text style={[
                            styles.layoutDescription,
                            selectedLayout === layout.id && styles.layoutDescriptionActive
                        ]}>
                            {layout.description}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderOverlayTools = () => (
        <View style={styles.overlaySection}>
            <Text style={styles.sectionTitle}>Branded Overlays</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {overlayTypes.map((overlay) => (
                    <TouchableOpacity
                        key={overlay.id}
                        style={styles.overlayButton}
                        onPress={() => addOverlay(overlay.id)}
                    >
                        <Ionicons name={overlay.icon as any} size={20} color={Colors.light.accent} />
                        <Text style={styles.overlayButtonText}>{overlay.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Video Podcasting Studio</Text>
                    <Text style={styles.subtitle}>
                        Professional video podcasting with HD recording and AI enhancements
                    </Text>
                </View>

                {renderRecordingControls()}
                {renderVideoFeatures()}
                {renderLayoutOptions()}
                {renderOverlayTools()}
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
    featuresSection: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    layoutSection: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    overlaySection: {
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
    layoutCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginRight: 16,
        minWidth: 150,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    layoutCardActive: {
        backgroundColor: Colors.light.accent,
    },
    layoutName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 8,
        marginBottom: 4,
        textAlign: 'center',
    },
    layoutNameActive: {
        color: '#FFFFFF',
    },
    layoutDescription: {
        fontSize: 12,
        color: Colors.light.text,
        textAlign: 'center',
    },
    layoutDescriptionActive: {
        color: '#FFFFFF',
        opacity: 0.9,
    },
    overlayButton: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 12,
        alignItems: 'center',
        minWidth: 100,
    },
    overlayButtonText: {
        fontSize: 12,
        color: Colors.light.text,
        marginTop: 4,
        textAlign: 'center',
    },
});

export default VideoPodcastingScreen; 