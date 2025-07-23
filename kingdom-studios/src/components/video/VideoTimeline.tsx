import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    PanGestureHandler,
    State,
    Dimensions,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    runOnJS,
} from 'react-native-reanimated';
import { KingdomColors } from '../../constants/KingdomColors';

const { width: screenWidth } = Dimensions.get('window');

interface VideoTrack {
    id: string;
    type: 'video' | 'audio' | 'text';
    source: string;
    startTime: number;
    duration: number;
    opacity: number;
    volume: number;
    effects: any[];
    position: { x: number; y: number };
    scale: number;
}

interface VideoTimelineProps {
    tracks: VideoTrack[];
    currentTime: number;
    selectedTrack: string | null;
    onTrackSelect: (trackId: string) => void;
    onTrackUpdate: (trackId: string, updates: Partial<VideoTrack>) => void;
    onTrackRemove: (trackId: string) => void;
    onTimeChange: (time: number) => void;
    onAddTrack: (track: Omit<VideoTrack, 'id'>) => void;
}

export const VideoTimeline = React.forwardRef<ScrollView, VideoTimelineProps>(
    ({ tracks, currentTime, selectedTrack, onTrackSelect, onTrackUpdate, onTrackRemove, onTimeChange, onAddTrack }, ref) => {
        const [zoom, setZoom] = useState(1);
        const [showAddTrackModal, setShowAddTrackModal] = useState(false);
        const [draggedTrack, setDraggedTrack] = useState<string | null>(null);
        const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

        const timelineWidth = screenWidth * zoom;
        const pixelsPerSecond = 50 * zoom;

        const playheadPosition = useSharedValue(currentTime * pixelsPerSecond);

        const playheadStyle = useAnimatedStyle(() => ({
            left: playheadPosition.value,
        }));

        const updatePlayhead = useCallback((time: number) => {
            playheadPosition.value = time * pixelsPerSecond;
        }, [pixelsPerSecond]);

        React.useEffect(() => {
            updatePlayhead(currentTime);
        }, [currentTime, updatePlayhead]);

        const onPlayheadGesture = useAnimatedGestureHandler({
            onStart: (_, context: any) => {
                context.startX = playheadPosition.value;
            },
            onActive: (event, context) => {
                const newPosition = context.startX + event.translationX;
                const newTime = Math.max(0, newPosition / pixelsPerSecond);
                playheadPosition.value = newTime * pixelsPerSecond;
                runOnJS(onTimeChange)(newTime);
            },
            onEnd: () => {
                // Gesture ended
            },
        });

        const renderTrack = (track: VideoTrack, index: number) => {
            const trackWidth = track.duration * pixelsPerSecond;
            const trackLeft = track.startTime * pixelsPerSecond;

            const onTrackGesture = useAnimatedGestureHandler({
                onStart: (_, context: any) => {
                    context.startX = trackLeft;
                    context.startY = index * 80;
                    runOnJS(setDraggedTrack)(track.id);
                },
                onActive: (event, context) => {
                    const newLeft = context.startX + event.translationX;
                    const newTime = Math.max(0, newLeft / pixelsPerSecond);
                    runOnJS(onTrackUpdate)(track.id, { startTime: newTime });
                },
                onEnd: () => {
                    runOnJS(setDraggedTrack)(null);
                },
            });

            const onResizeGesture = useAnimatedGestureHandler({
                onStart: (_, context: any) => {
                    context.startWidth = trackWidth;
                },
                onActive: (event, context) => {
                    const newWidth = context.startWidth + event.translationX;
                    const newDuration = Math.max(0.1, newWidth / pixelsPerSecond);
                    runOnJS(onTrackUpdate)(track.id, { duration: newDuration });
                },
                onEnd: () => {
                    // Resize ended
                },
            });

            return (
                <View key={track.id} style={styles.trackContainer}>
                    <View style={styles.trackHeader}>
                        <TouchableOpacity
                            style={[styles.trackSelectButton, selectedTrack === track.id && styles.selectedTrack]}
                            onPress={() => onTrackSelect(track.id)}
                        >
                            <Text style={styles.trackTypeText}>{track.type.toUpperCase()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.trackRemoveButton}
                            onPress={() => onTrackRemove(track.id)}
                        >
                            <Text style={styles.trackRemoveText}>×</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.trackContent}>
                        <PanGestureHandler onGestureEvent={onTrackGesture}>
                            <Animated.View
                                style={[
                                    styles.trackItem,
                                    {
                                        width: trackWidth,
                                        left: trackLeft,
                                        opacity: draggedTrack === track.id ? 0.7 : 1,
                                    },
                                    track.type === 'video' && styles.videoTrack,
                                    track.type === 'audio' && styles.audioTrack,
                                    track.type === 'text' && styles.textTrack,
                                ]}
                            >
                                <Text style={styles.trackDurationText}>
                                    {track.duration.toFixed(1)}s
                                </Text>

                                <PanGestureHandler onGestureEvent={onResizeGesture}>
                                    <Animated.View style={styles.resizeHandle} />
                                </PanGestureHandler>
                            </Animated.View>
                        </PanGestureHandler>
                    </View>
                </View>
            );
        };

        const renderTimeRuler = () => {
            const totalDuration = Math.max(...tracks.map(t => t.startTime + t.duration), 10);
            const rulerWidth = totalDuration * pixelsPerSecond;

            const timeMarks = [];
            for (let i = 0; i <= totalDuration; i += Math.max(1, Math.floor(totalDuration / 20))) {
                timeMarks.push(i);
            }

            return (
                <View style={styles.timeRuler}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ width: rulerWidth }}
                    >
                        {timeMarks.map((time) => (
                            <View key={time} style={styles.timeMark}>
                                <Text style={styles.timeMarkText}>{time}s</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            );
        };

        const renderAddTrackButton = () => (
            <TouchableOpacity
                style={styles.addTrackButton}
                onPress={() => setShowAddTrackModal(true)}
            >
                <Text style={styles.addTrackButtonText}>+ Add Track</Text>
            </TouchableOpacity>
        );

        const renderAddTrackModal = () => {
            if (!showAddTrackModal) return null;

            const trackTypes = [
                { type: 'video', label: 'Video Track', color: KingdomColors.primary },
                { type: 'audio', label: 'Audio Track', color: KingdomColors.secondary },
                { type: 'text', label: 'Text Overlay', color: KingdomColors.success },
            ];

            return (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Track</Text>
                        {trackTypes.map((trackType) => (
                            <TouchableOpacity
                                key={trackType.type}
                                style={[styles.modalOption, { borderColor: trackType.color }]}
                                onPress={() => {
                                    onAddTrack({
                                        type: trackType.type as 'video' | 'audio' | 'text',
                                        source: '',
                                        startTime: 0,
                                        duration: 5,
                                        opacity: 1,
                                        volume: 1,
                                        effects: [],
                                        position: { x: 0, y: 0 },
                                        scale: 1,
                                    });
                                    setShowAddTrackModal(false);
                                }}
                            >
                                <Text style={[styles.modalOptionText, { color: trackType.color }]}>
                                    {trackType.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => setShowAddTrackModal(false)}
                        >
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        };

        return (
            <View style={styles.container}>
                <View style={styles.toolbar}>
                    <View style={styles.zoomControls}>
                        <TouchableOpacity
                            style={styles.zoomButton}
                            onPress={() => setZoom(Math.max(0.5, zoom - 0.2))}
                        >
                            <Text style={styles.zoomButtonText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
                        <TouchableOpacity
                            style={styles.zoomButton}
                            onPress={() => setZoom(Math.min(3, zoom + 0.2))}
                        >
                            <Text style={styles.zoomButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.trackControls}>
                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => {/* Snap to grid */ }}
                        >
                            <Text style={styles.controlButtonText}>Snap</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => {/* Lock tracks */ }}
                        >
                            <Text style={styles.controlButtonText}>Lock</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    ref={ref}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.timelineContainer}
                >
                    <View style={styles.timelineContent}>
                        {renderTimeRuler()}

                        <View style={styles.tracksContainer}>
                            {tracks.map((track, index) => renderTrack(track, index))}
                            {renderAddTrackButton()}
                        </View>
                    </View>
                </ScrollView>

                <PanGestureHandler onGestureEvent={onPlayheadGesture}>
                    <Animated.View style={[styles.playhead, playheadStyle]} />
                </PanGestureHandler>

                {renderAddTrackModal()}
            </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.surface,
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: KingdomColors.dark,
    },
    zoomControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    zoomButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: KingdomColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    zoomButtonText: {
        color: KingdomColors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    zoomText: {
        color: KingdomColors.white,
        fontSize: 14,
        marginHorizontal: 8,
    },
    trackControls: {
        flexDirection: 'row',
    },
    controlButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: KingdomColors.secondary,
        marginLeft: 8,
    },
    controlButtonText: {
        color: KingdomColors.white,
        fontSize: 12,
    },
    timelineContainer: {
        flex: 1,
    },
    timelineContent: {
        minWidth: screenWidth,
    },
    timeRuler: {
        height: 30,
        backgroundColor: KingdomColors.dark,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.border,
    },
    timeMark: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
    },
    timeMarkText: {
        color: KingdomColors.textSecondary,
        fontSize: 10,
    },
    tracksContainer: {
        paddingVertical: 8,
    },
    trackContainer: {
        height: 80,
        marginBottom: 4,
    },
    trackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        height: 30,
    },
    trackSelectButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: KingdomColors.secondary,
    },
    selectedTrack: {
        backgroundColor: KingdomColors.primary,
    },
    trackTypeText: {
        color: KingdomColors.white,
        fontSize: 10,
        fontWeight: '600',
    },
    trackRemoveButton: {
        marginLeft: 'auto',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: KingdomColors.error,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trackRemoveText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    trackContent: {
        flex: 1,
        position: 'relative',
    },
    trackItem: {
        position: 'absolute',
        height: 40,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoTrack: {
        backgroundColor: KingdomColors.primary,
    },
    audioTrack: {
        backgroundColor: KingdomColors.secondary,
    },
    textTrack: {
        backgroundColor: KingdomColors.success,
    },
    trackDurationText: {
        color: KingdomColors.white,
        fontSize: 10,
        fontWeight: '600',
    },
    resizeHandle: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 8,
        backgroundColor: KingdomColors.white,
        borderRadius: 2,
    },
    addTrackButton: {
        height: 40,
        backgroundColor: KingdomColors.surface,
        borderWidth: 2,
        borderColor: KingdomColors.border,
        borderStyle: 'dashed',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    addTrackButtonText: {
        color: KingdomColors.textSecondary,
        fontSize: 14,
    },
    playhead: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: KingdomColors.error,
        zIndex: 1000,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
    },
    modalContent: {
        backgroundColor: KingdomColors.surface,
        borderRadius: 12,
        padding: 20,
        width: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.text,
        marginBottom: 16,
        textAlign: 'center',
    },
    modalOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 8,
    },
    modalOptionText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    modalCancelButton: {
        paddingVertical: 12,
        marginTop: 8,
    },
    modalCancelText: {
        color: KingdomColors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
    },
}); 