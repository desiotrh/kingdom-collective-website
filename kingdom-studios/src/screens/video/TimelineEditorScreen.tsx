import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    PanGestureHandler,
    State,
    Dimensions,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { KingdomColors } from '../../constants/KingdomColors';
import { useDualMode } from '../../contexts/DualModeContext';

const { width, height } = Dimensions.get('window');

interface Track {
    id: string;
    type: 'video' | 'audio' | 'text';
    name: string;
    duration: number;
    startTime: number;
    endTime: number;
    volume: number;
    opacity: number;
    data: any;
}

interface TimelineEditorScreenProps {
    navigation: any;
}

export default function TimelineEditorScreen({ navigation }: TimelineEditorScreenProps) {
    const { isFaithMode } = useDualMode();

    // State
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(60); // 60 seconds default
    const [showRuler, setShowRuler] = useState(true);

    // Refs
    const timelineRef = useRef<ScrollView>(null);
    const playheadRef = useRef<View>(null);

    useEffect(() => {
        initializeTimeline();
    }, []);

    const initializeTimeline = () => {
        // Initialize with sample tracks
        const sampleTracks: Track[] = [
            {
                id: 'video_1',
                type: 'video',
                name: 'Main Video',
                duration: 30,
                startTime: 0,
                endTime: 30,
                volume: 1,
                opacity: 1,
                data: { url: 'sample_video.mp4' },
            },
            {
                id: 'audio_1',
                type: 'audio',
                name: 'Background Music',
                duration: 60,
                startTime: 0,
                endTime: 60,
                volume: 0.7,
                opacity: 1,
                data: { url: 'background_music.mp3' },
            },
            {
                id: 'text_1',
                type: 'text',
                name: 'Title Text',
                duration: 5,
                startTime: 10,
                endTime: 15,
                volume: 1,
                opacity: 1,
                data: { text: 'Faith Over Fear', style: 'title' },
            },
        ];
        setTracks(sampleTracks);
    };

    const addTrack = (type: Track['type']) => {
        const newTrack: Track = {
            id: `${type}_${Date.now()}`,
            type,
            name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            duration: 10,
            startTime: currentTime,
            endTime: currentTime + 10,
            volume: 1,
            opacity: 1,
            data: {},
        };
        setTracks(prev => [...prev, newTrack]);
    };

    const deleteTrack = (trackId: string) => {
        Alert.alert(
            'Delete Track',
            'Are you sure you want to delete this track?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setTracks(prev => prev.filter(track => track.id !== trackId));
                        if (selectedTrack === trackId) {
                            setSelectedTrack(null);
                        }
                    },
                },
            ]
        );
    };

    const updateTrack = (trackId: string, updates: Partial<Track>) => {
        setTracks(prev =>
            prev.map(track =>
                track.id === trackId ? { ...track, ...updates } : track
            )
        );
    };

    const togglePlayback = () => {
        setIsPlaying(!isPlaying);
    };

    const seekToTime = (time: number) => {
        setCurrentTime(Math.max(0, Math.min(time, duration)));
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderRuler = () => {
        const rulerMarks = [];
        const markInterval = zoomLevel >= 200 ? 1 : zoomLevel >= 100 ? 5 : 10;

        for (let i = 0; i <= duration; i += markInterval) {
            rulerMarks.push(
                <View key={i} style={styles.rulerMark}>
                    <Text style={styles.rulerText}>{formatTime(i)}</Text>
                </View>
            );
        }

        return (
            <View style={styles.ruler}>
                {rulerMarks}
            </View>
        );
    };

    const renderTrack = (track: Track) => {
        const isSelected = selectedTrack === track.id;
        const trackWidth = (track.duration / duration) * (width * (zoomLevel / 100));
        const trackLeft = (track.startTime / duration) * (width * (zoomLevel / 100));

        return (
            <View key={track.id} style={styles.trackContainer}>
                <View style={styles.trackHeader}>
                    <TouchableOpacity
                        style={[styles.trackName, isSelected && styles.selectedTrack]}
                        onPress={() => setSelectedTrack(track.id)}
                    >
                        <MaterialIcons
                            name={track.type === 'video' ? 'videocam' : track.type === 'audio' ? 'audiotrack' : 'text-fields'}
                            size={16}
                            color={KingdomColors.primary}
                        />
                        <Text style={styles.trackNameText}>{track.name}</Text>
                    </TouchableOpacity>

                    <View style={styles.trackControls}>
                        <TouchableOpacity
                            style={styles.trackControl}
                            onPress={() => updateTrack(track.id, { volume: track.volume > 0 ? 0 : 1 })}
                        >
                            <MaterialIcons
                                name={track.volume > 0 ? 'volume-up' : 'volume-off'}
                                size={16}
                                color={KingdomColors.text}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.trackControl}
                            onPress={() => deleteTrack(track.id)}
                        >
                            <MaterialIcons name="delete" size={16} color={KingdomColors.error} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.trackTimeline}>
                    <View
                        style={[
                            styles.trackClip,
                            {
                                width: trackWidth,
                                left: trackLeft,
                                opacity: track.opacity,
                            },
                            isSelected && styles.selectedClip,
                        ]}
                    >
                        <Text style={styles.clipText}>{track.name}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderPlayhead = () => {
        const playheadPosition = (currentTime / duration) * (width * (zoomLevel / 100));

        return (
            <View
                ref={playheadRef}
                style={[
                    styles.playhead,
                    { left: playheadPosition },
                ]}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={KingdomColors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Timeline Editor</Text>
                <TouchableOpacity>
                    <MaterialIcons name="settings" size={24} color={KingdomColors.text} />
                </TouchableOpacity>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <View style={styles.playbackControls}>
                    <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
                        <MaterialIcons
                            name={isPlaying ? 'pause' : 'play-arrow'}
                            size={24}
                            color={KingdomColors.white}
                        />
                    </TouchableOpacity>

                    <Text style={styles.timeDisplay}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </Text>
                </View>

                <View style={styles.zoomControls}>
                    <TouchableOpacity
                        style={styles.zoomButton}
                        onPress={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                    >
                        <MaterialIcons name="zoom-out" size={20} color={KingdomColors.text} />
                    </TouchableOpacity>

                    <Text style={styles.zoomText}>{zoomLevel}%</Text>

                    <TouchableOpacity
                        style={styles.zoomButton}
                        onPress={() => setZoomLevel(Math.min(300, zoomLevel + 25))}
                    >
                        <MaterialIcons name="zoom-in" size={20} color={KingdomColors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Timeline */}
            <View style={styles.timelineContainer}>
                {showRuler && renderRuler()}

                <ScrollView
                    ref={timelineRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.timelineScroll}
                >
                    <View style={styles.timelineContent}>
                        {tracks.map(renderTrack)}
                        {renderPlayhead()}
                    </View>
                </ScrollView>
            </View>

            {/* Track Controls */}
            <View style={styles.trackControls}>
                <TouchableOpacity
                    style={styles.addTrackButton}
                    onPress={() => addTrack('video')}
                >
                    <MaterialIcons name="videocam" size={20} color={KingdomColors.white} />
                    <Text style={styles.addTrackText}>Add Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.addTrackButton}
                    onPress={() => addTrack('audio')}
                >
                    <MaterialIcons name="audiotrack" size={20} color={KingdomColors.white} />
                    <Text style={styles.addTrackText}>Add Audio</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.addTrackButton}
                    onPress={() => addTrack('text')}
                >
                    <MaterialIcons name="text-fields" size={20} color={KingdomColors.white} />
                    <Text style={styles.addTrackText}>Add Text</Text>
                </TouchableOpacity>
            </View>

            {/* Properties Panel */}
            {selectedTrack && (
                <View style={styles.propertiesPanel}>
                    <Text style={styles.propertiesTitle}>Track Properties</Text>
                    <View style={styles.propertyRow}>
                        <Text style={styles.propertyLabel}>Volume:</Text>
                        <TouchableOpacity
                            style={styles.propertyValue}
                            onPress={() => {
                                const track = tracks.find(t => t.id === selectedTrack);
                                if (track) {
                                    updateTrack(selectedTrack, { volume: track.volume > 0 ? 0 : 1 });
                                }
                            }}
                        >
                            <Text>{tracks.find(t => t.id === selectedTrack)?.volume || 0}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: KingdomColors.text,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.border,
    },
    playbackControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playButton: {
        backgroundColor: KingdomColors.primary,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    timeDisplay: {
        fontSize: 14,
        color: KingdomColors.text,
        fontWeight: '500',
    },
    zoomControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    zoomButton: {
        padding: 5,
    },
    zoomText: {
        fontSize: 12,
        color: KingdomColors.text,
        marginHorizontal: 10,
    },
    timelineContainer: {
        flex: 1,
        backgroundColor: KingdomColors.surface,
    },
    ruler: {
        flexDirection: 'row',
        height: 30,
        backgroundColor: KingdomColors.surface,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.border,
    },
    rulerMark: {
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 60,
    },
    rulerText: {
        fontSize: 10,
        color: KingdomColors.textSecondary,
    },
    timelineScroll: {
        flex: 1,
    },
    timelineContent: {
        minWidth: width * 3, // 300% zoom max
        position: 'relative',
    },
    trackContainer: {
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.border,
    },
    trackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: KingdomColors.surface,
    },
    trackName: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    selectedTrack: {
        backgroundColor: KingdomColors.primary + '20',
        borderRadius: 4,
        padding: 4,
    },
    trackNameText: {
        marginLeft: 8,
        fontSize: 14,
        color: KingdomColors.text,
        fontWeight: '500',
    },
    trackControls: {
        flexDirection: 'row',
    },
    trackControl: {
        padding: 5,
        marginLeft: 5,
    },
    trackTimeline: {
        height: 40,
        position: 'relative',
        backgroundColor: KingdomColors.background,
    },
    trackClip: {
        position: 'absolute',
        height: 30,
        backgroundColor: KingdomColors.primary,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    selectedClip: {
        backgroundColor: KingdomColors.secondary,
        borderWidth: 2,
        borderColor: KingdomColors.accent,
    },
    clipText: {
        fontSize: 10,
        color: KingdomColors.white,
        fontWeight: '500',
    },
    playhead: {
        position: 'absolute',
        width: 2,
        height: '100%',
        backgroundColor: KingdomColors.accent,
        zIndex: 1000,
    },
    trackControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: KingdomColors.border,
    },
    addTrackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: KingdomColors.primary,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addTrackText: {
        color: KingdomColors.white,
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 5,
    },
    propertiesPanel: {
        padding: 20,
        backgroundColor: KingdomColors.surface,
        borderTopWidth: 1,
        borderTopColor: KingdomColors.border,
    },
    propertiesTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: KingdomColors.text,
        marginBottom: 10,
    },
    propertyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    propertyLabel: {
        fontSize: 14,
        color: KingdomColors.text,
    },
    propertyValue: {
        padding: 5,
        backgroundColor: KingdomColors.background,
        borderRadius: 4,
    },
}); 