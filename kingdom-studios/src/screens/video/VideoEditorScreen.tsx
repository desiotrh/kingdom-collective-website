import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Dimensions,
    Platform,
} from 'react-native';
import Video from 'react-native-video';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    runOnJS,
} from 'react-native-reanimated';
import { useAuth } from '../../contexts/AuthContext';
import { useDualMode } from '../../contexts/DualModeContext';
import { KingdomColors } from '../../constants/KingdomColors';
import { VideoTimeline } from '../../components/video/VideoTimeline';
import { TransitionLibrary } from '../../components/video/TransitionLibrary';
import { EffectsPanel } from '../../components/video/EffectsPanel';
import { ChromaKeyPanel } from '../../components/video/ChromaKeyPanel';
import { PublishingPanel } from '../../components/video/PublishingPanel';
import { ViralPrediction } from '../../components/video/ViralPrediction';
import { ProjectManager } from '../../components/video/ProjectManager';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { analyticsService } from '../../services/analyticsService';
import { videoService } from '../../services/videoService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

interface VideoProject {
    id: string;
    name: string;
    tracks: VideoTrack[];
    duration: number;
    aspectRatio: 'portrait' | 'square' | 'landscape';
    mode: 'faith' | 'encouragement';
    createdAt: Date;
    updatedAt: Date;
}

export const VideoEditorScreen: React.FC = () => {
    const { user } = useAuth();
    const { mode, isFaithMode } = useDualMode();
    const [currentProject, setCurrentProject] = useState<VideoProject | null>(null);
    const [tracks, setTracks] = useState<VideoTrack[]>([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRendering, setIsRendering] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
    const [activePanel, setActivePanel] = useState<'timeline' | 'transitions' | 'effects' | 'chroma' | 'publishing'>('timeline');
    const [viralScore, setViralScore] = useState<number | null>(null);
    const [showViralPrediction, setShowViralPrediction] = useState(false);

    const videoRef = useRef<Video>(null);
    const timelineRef = useRef<ScrollView>(null);

    // Initialize new project
    useEffect(() => {
        if (!currentProject) {
            const newProject: VideoProject = {
                id: `project_${Date.now()}`,
                name: `Kingdom Clips Project ${new Date().toLocaleDateString()}`,
                tracks: [],
                duration: 0,
                aspectRatio: 'portrait',
                mode: isFaithMode ? 'faith' : 'encouragement',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setCurrentProject(newProject);
            setTracks(newProject.tracks);
        }
    }, [currentProject, isFaithMode]);

    // Save project periodically
    useEffect(() => {
        if (currentProject) {
            const saveProject = async () => {
                try {
                    await videoService.saveProject({
                        ...currentProject,
                        tracks,
                        updatedAt: new Date(),
                    });
                } catch (error) {
                    console.error('Failed to save project:', error);
                }
            };

            const saveInterval = setInterval(saveProject, 30000); // Save every 30 seconds
            return () => clearInterval(saveInterval);
        }
    }, [currentProject, tracks]);

    // Track analytics
    useEffect(() => {
        analyticsService.trackEvent('video_editor_opened', {
            userId: user?.uid,
            mode,
            projectId: currentProject?.id,
        });
    }, []);

    const addTrack = useCallback((track: Omit<VideoTrack, 'id'>) => {
        const newTrack: VideoTrack = {
            ...track,
            id: `track_${Date.now()}_${Math.random()}`,
        };
        setTracks(prev => [...prev, newTrack]);
        setSelectedTrack(newTrack.id);
    }, []);

    const updateTrack = useCallback((trackId: string, updates: Partial<VideoTrack>) => {
        setTracks(prev => prev.map(track =>
            track.id === trackId ? { ...track, ...updates } : track
        ));
    }, []);

    const removeTrack = useCallback((trackId: string) => {
        setTracks(prev => prev.filter(track => track.id !== trackId));
        if (selectedTrack === trackId) {
            setSelectedTrack(null);
        }
    }, [selectedTrack]);

    const playVideo = useCallback(() => {
        setIsPlaying(true);
        videoRef.current?.seek(currentTime);
    }, [currentTime]);

    const pauseVideo = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const seekTo = useCallback((time: number) => {
        setCurrentTime(time);
        videoRef.current?.seek(time);
    }, []);

    const onProgress = useCallback((data: any) => {
        setCurrentTime(data.currentTime);
    }, []);

    const renderVideo = useCallback(async () => {
        if (!currentProject || tracks.length === 0) {
            Alert.alert('No Content', 'Please add at least one video track to render.');
            return;
        }

        setIsRendering(true);
        try {
            const renderData = {
                projectId: currentProject.id,
                tracks,
                duration: Math.max(...tracks.map(t => t.startTime + t.duration)),
                aspectRatio: currentProject.aspectRatio,
                mode: currentProject.mode,
            };

            const result = await videoService.renderVideo(renderData);

            // Calculate viral score
            const score = await videoService.predictViralScore(result.videoUrl);
            setViralScore(score);
            setShowViralPrediction(true);

            analyticsService.trackEvent('video_rendered', {
                userId: user?.uid,
                projectId: currentProject.id,
                duration: renderData.duration,
                trackCount: tracks.length,
                viralScore: score,
            });

            Alert.alert('Success', 'Video rendered successfully!', [
                { text: 'OK', onPress: () => setShowViralPrediction(true) },
            ]);
        } catch (error) {
            console.error('Rendering failed:', error);
            Alert.alert('Rendering Failed', 'There was an error rendering your video. Please try again.');
        } finally {
            setIsRendering(false);
        }
    }, [currentProject, tracks, user]);

    const publishToSocial = useCallback(async (platform: string) => {
        if (!currentProject) return;

        try {
            const publishData = {
                projectId: currentProject.id,
                platform,
                mode: currentProject.mode,
                viralScore,
            };

            const result = await videoService.publishToSocial(publishData);

            analyticsService.trackEvent('video_published', {
                userId: user?.uid,
                projectId: currentProject.id,
                platform,
                viralScore,
            });

            Alert.alert('Published!', `Your video has been published to ${platform}.`, [
                { text: 'Copy Link', onPress: () => {/* Copy link logic */ } },
                { text: 'OK' },
            ]);
        } catch (error) {
            console.error('Publishing failed:', error);
            Alert.alert('Publishing Failed', `Failed to publish to ${platform}. Please try again.`);
        }
    }, [currentProject, viralScore, user]);

    const renderPanel = () => {
        switch (activePanel) {
            case 'timeline':
                return (
                    <VideoTimeline
                        tracks={tracks}
                        currentTime={currentTime}
                        selectedTrack={selectedTrack}
                        onTrackSelect={setSelectedTrack}
                        onTrackUpdate={updateTrack}
                        onTrackRemove={removeTrack}
                        onTimeChange={seekTo}
                        onAddTrack={addTrack}
                        ref={timelineRef}
                    />
                );
            case 'transitions':
                return (
                    <TransitionLibrary
                        onTransitionAdd={(transition) => {
                            // Add transition to selected track
                            if (selectedTrack) {
                                updateTrack(selectedTrack, {
                                    effects: [...tracks.find(t => t.id === selectedTrack)?.effects || [], transition],
                                });
                            }
                        }}
                    />
                );
            case 'effects':
                return (
                    <EffectsPanel
                        selectedTrack={tracks.find(t => t.id === selectedTrack)}
                        onEffectApply={(effect) => {
                            if (selectedTrack) {
                                updateTrack(selectedTrack, {
                                    effects: [...tracks.find(t => t.id === selectedTrack)?.effects || [], effect],
                                });
                            }
                        }}
                    />
                );
            case 'chroma':
                return (
                    <ChromaKeyPanel
                        selectedTrack={tracks.find(t => t.id === selectedTrack)}
                        onChromaKeyApply={(chromaKey) => {
                            if (selectedTrack) {
                                updateTrack(selectedTrack, {
                                    effects: [...tracks.find(t => t.id === selectedTrack)?.effects || [], chromaKey],
                                });
                            }
                        }}
                    />
                );
            case 'publishing':
                return (
                    <PublishingPanel
                        viralScore={viralScore}
                        onPublish={publishToSocial}
                        onViralPrediction={() => setShowViralPrediction(true)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Kingdom Clips Editor</Text>
                <View style={styles.headerControls}>
                    <TouchableOpacity
                        style={[styles.modeButton, isFaithMode && styles.faithMode]}
                        onPress={() => {/* Toggle mode */ }}
                    >
                        <Text style={styles.modeText}>{isFaithMode ? 'Faith' : 'Encouragement'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {/* Save project */ }}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.previewContainer}>
                <View style={styles.videoContainer}>
                    {tracks.length > 0 ? (
                        <Video
                            ref={videoRef}
                            source={{ uri: tracks[0].source }}
                            style={styles.video}
                            paused={!isPlaying}
                            onProgress={onProgress}
                            onEnd={() => setIsPlaying(false)}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>Add video tracks to preview</Text>
                        </View>
                    )}
                </View>

                <View style={styles.playbackControls}>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={isPlaying ? pauseVideo : playVideo}
                    >
                        <Text style={styles.controlButtonText}>
                            {isPlaying ? '⏸️' : '▶️'}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.timeText}>
                        {Math.floor(currentTime)}s / {Math.floor(Math.max(...tracks.map(t => t.startTime + t.duration)) || 0}s
                    </Text>
                </View>
            </View>

            <View style={styles.toolbar}>
                <TouchableOpacity
                    style={[styles.toolButton, activePanel === 'timeline' && styles.activeTool]}
                    onPress={() => setActivePanel('timeline')}
                >
                    <Text style={styles.toolButtonText}>Timeline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toolButton, activePanel === 'transitions' && styles.activeTool]}
                    onPress={() => setActivePanel('transitions')}
                >
                    <Text style={styles.toolButtonText}>Transitions</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toolButton, activePanel === 'effects' && styles.activeTool]}
                    onPress={() => setActivePanel('effects')}
                >
                    <Text style={styles.toolButtonText}>Effects</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toolButton, activePanel === 'chroma' && styles.activeTool]}
                    onPress={() => setActivePanel('chroma')}
                >
                    <Text style={styles.toolButtonText}>Chroma Key</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toolButton, activePanel === 'publishing' && styles.activeTool]}
                    onPress={() => setActivePanel('publishing')}
                >
                    <Text style={styles.toolButtonText}>Publish</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.panelContainer}>
                {renderPanel()}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.renderButton, isRendering && styles.renderingButton]}
                    onPress={renderVideo}
                    disabled={isRendering}
                >
                    {isRendering ? (
                        <LoadingSpinner size="small" color={KingdomColors.white} />
                    ) : (
                        <Text style={styles.renderButtonText}>Render Video</Text>
                    )}
                </TouchableOpacity>
            </View>

            {showViralPrediction && viralScore !== null && (
                <ViralPrediction
                    score={viralScore}
                    onClose={() => setShowViralPrediction(false)}
                    onImprove={() => {/* Show improvement suggestions */ }}
                />
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: KingdomColors.primary,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.white,
    },
    headerControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modeButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: KingdomColors.secondary,
        marginRight: 8,
    },
    faithMode: {
        backgroundColor: KingdomColors.faith,
    },
    modeText: {
        color: KingdomColors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    saveButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: KingdomColors.success,
    },
    saveButtonText: {
        color: KingdomColors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    previewContainer: {
        height: screenHeight * 0.3,
        backgroundColor: KingdomColors.dark,
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    placeholderText: {
        color: KingdomColors.textSecondary,
        fontSize: 16,
    },
    playbackControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: KingdomColors.dark,
    },
    controlButton: {
        padding: 8,
        marginHorizontal: 8,
    },
    controlButtonText: {
        fontSize: 24,
    },
    timeText: {
        color: KingdomColors.white,
        fontSize: 14,
        marginLeft: 16,
    },
    toolbar: {
        flexDirection: 'row',
        backgroundColor: KingdomColors.surface,
        paddingVertical: 8,
    },
    toolButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTool: {
        backgroundColor: KingdomColors.primary,
    },
    toolButtonText: {
        color: KingdomColors.text,
        fontSize: 12,
        fontWeight: '600',
    },
    panelContainer: {
        flex: 1,
        backgroundColor: KingdomColors.surface,
    },
    footer: {
        padding: 16,
        backgroundColor: KingdomColors.surface,
    },
    renderButton: {
        backgroundColor: KingdomColors.primary,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    renderingButton: {
        backgroundColor: KingdomColors.secondary,
    },
    renderButtonText: {
        color: KingdomColors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 