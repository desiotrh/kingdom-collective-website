import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    Animated,
    Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from 'packages/hooks/useFaithMode';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PrayerRequest {
    id: string;
    title: string;
    description: string;
    postedBy: string;
    timestamp: number;
    prayedCount: number;
    isAnswered: boolean;
    isUrgent: boolean;
    isMine: boolean;
    scripture?: string;
}

interface VoicePrayer {
    id: string;
    requestId: string;
    audioUri: string;
    postedBy: string;
    timestamp: number;
    duration: number;
    isOriginal: boolean;
}

interface VoicePrayerChain {
    id: string;
    requestId: string;
    prayers: VoicePrayer[];
    agreementCount: number;
    isActive: boolean;
}

type FilterType = 'all' | 'mine' | 'answered' | 'urgent';

export default function PrayerBoardScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { faithMode, encouragementMode } = useFaithMode();

    const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
    const [filter, setFilter] = useState<FilterType>('all');
    const [showNewRequestModal, setShowNewRequestModal] = useState(false);
    const [newRequest, setNewRequest] = useState({
        title: '',
        description: '',
        scripture: '',
        isUrgent: false,
    });
    const [fadeAnim] = useState(new Animated.Value(0));

    // Voice Prayer Chain State
    const [voicePrayerChains, setVoicePrayerChains] = useState<VoicePrayerChain[]>([]);
    const [showVoicePrayerModal, setShowVoicePrayerModal] = useState(false);
    const [selectedRequestForVoice, setSelectedRequestForVoice] = useState<PrayerRequest | null>(null);
    const [recording, setRecording] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const [recordingPermission, setRecordingPermission] = useState<boolean | null>(null);

    // Mock voice prayer chains data
    useEffect(() => {
        const mockChains: VoicePrayerChain[] = [
            {
                id: '1',
                requestId: '1',
                prayers: [
                    {
                        id: 'vp1',
                        requestId: '1',
                        audioUri: 'mock_audio_1.mp3',
                        postedBy: 'Sarah M.',
                        timestamp: Date.now() - 3600000,
                        duration: 45,
                        isOriginal: true,
                    },
                    {
                        id: 'vp2',
                        requestId: '1',
                        audioUri: 'mock_audio_2.mp3',
                        postedBy: 'Michael K.',
                        timestamp: Date.now() - 1800000,
                        duration: 38,
                        isOriginal: false,
                    },
                ],
                agreementCount: 2,
                isActive: true,
            },
            {
                id: '2',
                requestId: '3',
                prayers: [
                    {
                        id: 'vp3',
                        requestId: '3',
                        audioUri: 'mock_audio_3.mp3',
                        postedBy: 'Jennifer L.',
                        timestamp: Date.now() - 900000,
                        duration: 52,
                        isOriginal: true,
                    },
                ],
                agreementCount: 1,
                isActive: true,
            },
        ];
        setVoicePrayerChains(mockChains);
    }, []);

    // Mock data for testing
    useEffect(() => {
        const mockRequests: PrayerRequest[] = [
            {
                id: '1',
                title: 'Family Health',
                description: 'Praying for my family\'s health and strength during this season.',
                postedBy: 'Sarah M.',
                timestamp: Date.now() - 3600000,
                prayedCount: 12,
                isAnswered: false,
                isUrgent: false,
                isMine: true,
                scripture: 'Philippians 4:6-7',
            },
            {
                id: '2',
                title: 'Job Opportunity',
                description: 'Seeking guidance for a new job opportunity that could change our family\'s future.',
                postedBy: 'Michael K.',
                timestamp: Date.now() - 7200000,
                prayedCount: 8,
                isAnswered: true,
                isUrgent: false,
                isMine: false,
            },
            {
                id: '3',
                title: 'Emergency Surgery',
                description: 'My daughter needs emergency surgery tomorrow. Please pray for the doctors and her recovery.',
                postedBy: 'Jennifer L.',
                timestamp: Date.now() - 1800000,
                prayedCount: 25,
                isAnswered: false,
                isUrgent: true,
                isMine: false,
            },
        ];
        setPrayerRequests(mockRequests);
        loadPrayerRequests();
    }, []);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const loadPrayerRequests = async () => {
        try {
            const saved = await AsyncStorage.getItem('prayerRequests');
            if (saved) {
                setPrayerRequests(JSON.parse(saved));
            }
        } catch (error) {
            console.log('Error loading prayer requests:', error);
        }
    };

    const savePrayerRequests = async (requests: PrayerRequest[]) => {
        try {
            await AsyncStorage.setItem('prayerRequests', JSON.stringify(requests));
        } catch (error) {
            console.log('Error saving prayer requests:', error);
        }
    };

    const handlePray = (requestId: string) => {
        setPrayerRequests(prev => {
            const updated = prev.map(req =>
                req.id === requestId
                    ? { ...req, prayedCount: req.prayedCount + 1 }
                    : req
            );
            savePrayerRequests(updated);
            return updated;
        });
    };

    const handleMarkAnswered = (requestId: string) => {
        setPrayerRequests(prev => {
            const updated = prev.map(req =>
                req.id === requestId
                    ? { ...req, isAnswered: !req.isAnswered }
                    : req
            );
            savePrayerRequests(updated);
            return updated;
        });
    };

    const handlePostRequest = () => {
        if (!newRequest.title.trim() || !newRequest.description.trim()) {
            Alert.alert('Missing Information', 'Please fill in both title and description.');
            return;
        }

        const newPrayerRequest: PrayerRequest = {
            id: Date.now().toString(),
            title: newRequest.title,
            description: newRequest.description,
            postedBy: 'You',
            timestamp: Date.now(),
            prayedCount: 0,
            isAnswered: false,
            isUrgent: newRequest.isUrgent,
            isMine: true,
            scripture: newRequest.scripture || undefined,
        };

        setPrayerRequests(prev => {
            const updated = [newPrayerRequest, ...prev];
            savePrayerRequests(updated);
            return updated;
        });

        setNewRequest({ title: '', description: '', scripture: '', isUrgent: false });
        setShowNewRequestModal(false);
    };

    const filteredRequests = prayerRequests.filter(request => {
        switch (filter) {
            case 'mine':
                return request.isMine;
            case 'answered':
                return request.isAnswered;
            case 'urgent':
                return request.isUrgent;
            default:
                return true;
        }
    });

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    const getPrayerEmoji = () => {
        return faithMode ? '✝️' : '🙌';
    };

    const getAnsweredEmoji = () => {
        return faithMode ? '🙏' : '❤️';
    };

    // Voice Prayer Handlers
    const requestRecordingPermission = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            setRecordingPermission(status === 'granted');
            return status === 'granted';
        } catch (error) {
            console.log('Error requesting recording permission:', error);
            return false;
        }
    };

    const startRecording = async () => {
        if (!recordingPermission) {
            const granted = await requestRecordingPermission();
            if (!granted) {
                Alert.alert('Permission Required', 'Please grant microphone permission to record voice prayers.');
                return;
            }
        }

        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const recording = new Audio.Recording();
            await recording.prepareAsync();
            await recording.startAsync();
            setRecording(true);
        } catch (error) {
            console.log('Error starting recording:', error);
            Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
        }
    };

    const stopRecording = async () => {
        try {
            const recording = new Audio.Recording();
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(false);

            if (uri && selectedRequestForVoice) {
                const newVoicePrayer: VoicePrayer = {
                    id: Date.now().toString(),
                    requestId: selectedRequestForVoice.id,
                    audioUri: uri,
                    postedBy: 'You',
                    timestamp: Date.now(),
                    duration: 30, // Mock duration
                    isOriginal: false,
                };

                // Add to existing chain or create new one
                setVoicePrayerChains(prev => {
                    const existingChain = prev.find(chain => chain.requestId === selectedRequestForVoice.id);
                    if (existingChain) {
                        return prev.map(chain =>
                            chain.id === existingChain.id
                                ? {
                                    ...chain,
                                    prayers: [...chain.prayers, newVoicePrayer],
                                    agreementCount: chain.agreementCount + 1,
                                }
                                : chain
                        );
                    } else {
                        const newChain: VoicePrayerChain = {
                            id: Date.now().toString(),
                            requestId: selectedRequestForVoice.id,
                            prayers: [newVoicePrayer],
                            agreementCount: 1,
                            isActive: true,
                        };
                        return [...prev, newChain];
                    }
                });

                setShowVoicePrayerModal(false);
                setSelectedRequestForVoice(null);
            }
        } catch (error) {
            console.log('Error stopping recording:', error);
            setRecording(false);
        }
    };

    const playVoicePrayer = async (audioUri: string, prayerId: string) => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUri },
                { shouldPlay: true }
            );

            setSound(newSound);
            setCurrentlyPlaying(prayerId);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setCurrentlyPlaying(null);
                }
            });
        } catch (error) {
            console.log('Error playing voice prayer:', error);
            Alert.alert('Playback Error', 'Failed to play voice prayer. Please try again.');
        }
    };

    const stopPlayback = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
            setCurrentlyPlaying(null);
        }
    };

    const handleAddVoicePrayer = (request: PrayerRequest) => {
        setSelectedRequestForVoice(request);
        setShowVoicePrayerModal(true);
    };

    const getVoicePrayerChain = (requestId: string) => {
        return voicePrayerChains.find(chain => chain.requestId === requestId);
    };

    const renderVoicePrayerChain = (request: PrayerRequest) => {
        const chain = getVoicePrayerChain(request.id);
        if (!chain || chain.prayers.length === 0) return null;

        return (
            <View style={[styles.voiceChainContainer, { backgroundColor: colors.sand }]}>
                <View style={styles.voiceChainHeader}>
                    <Text style={[styles.voiceChainTitle, { color: colors.emerald }]}>
                        {faithMode ? '✝️ Voice Prayer Chain' : '🕊 Support Circle'}
                    </Text>
                    <Text style={[styles.voiceChainSubtitle, { color: colors.olive }]}>
                        {faithMode
                            ? `"Where two or more agree..." (${chain.agreementCount} voices)`
                            : `${chain.agreementCount} voices in agreement`
                        }
                    </Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.voiceChainScroll}>
                    {chain.prayers.map((prayer, index) => (
                        <View key={prayer.id} style={styles.voicePrayerItem}>
                            <TouchableOpacity
                                style={[
                                    styles.voicePrayerButton,
                                    {
                                        backgroundColor: currentlyPlaying === prayer.id ? colors.emerald : colors.card,
                                        borderColor: colors.olive,
                                    }
                                ]}
                                onPress={() => {
                                    if (currentlyPlaying === prayer.id) {
                                        stopPlayback();
                                    } else {
                                        playVoicePrayer(prayer.audioUri, prayer.id);
                                    }
                                }}
                            >
                                <Text style={[styles.voicePrayerIcon, { color: colors.olive }]}>
                                    {currentlyPlaying === prayer.id ? '⏸️' : '🎧'}
                                </Text>
                                <Text style={[styles.voicePrayerText, { color: colors.text }]}>
                                    {prayer.isOriginal ? 'Original' : 'Agreement'}
                                </Text>
                                <Text style={[styles.voicePrayerAuthor, { color: colors.olive }]}>
                                    {prayer.postedBy}
                                </Text>
                                <Text style={[styles.voicePrayerDuration, { color: colors.olive }]}>
                                    {prayer.duration}s
                                </Text>
                            </TouchableOpacity>

                            {index < chain.prayers.length - 1 && (
                                <Text style={[styles.voiceChainArrow, { color: colors.olive }]}>
                                    →
                                </Text>
                            )}
                        </View>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={[styles.addVoiceButton, { backgroundColor: colors.emerald }]}
                    onPress={() => handleAddVoicePrayer(request)}
                >
                    <Text style={[styles.addVoiceButtonText, { color: colors.cream }]}>
                        {faithMode ? '🎙️ Add My Voice' : '🎙️ Add My Support'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderPrayerCard = (request: PrayerRequest) => (
        <Animated.View
            key={request.id}
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: request.isAnswered ? colors.emerald : colors.olive,
                    borderWidth: request.isAnswered ? 2 : 1,
                    opacity: fadeAnim,
                },
                request.isAnswered && faithMode && styles.answeredCard,
            ]}
        >
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {request.title}
                </Text>
                {request.isUrgent && (
                    <View style={[styles.urgentBadge, { backgroundColor: colors.emerald }]}>
                        <Text style={[styles.urgentText, { color: colors.cream }]}>
                            {faithMode ? 'URGENT' : 'PRIORITY'}
                        </Text>
                    </View>
                )}
            </View>

            <Text style={[styles.cardDescription, { color: colors.text }]}>
                {request.description}
            </Text>

            {request.scripture && faithMode && (
                <View style={[styles.scriptureContainer, { backgroundColor: colors.sand }]}>
                    <Text style={[styles.scriptureText, { color: colors.emerald }]}>
                        📖 {request.scripture}
                    </Text>
                </View>
            )}

            <View style={styles.cardFooter}>
                <View style={styles.metaInfo}>
                    <Text style={[styles.postedBy, { color: colors.olive }]}>
                        {request.postedBy} • {formatTime(request.timestamp)}
                    </Text>
                    <Text style={[styles.prayedCount, { color: colors.emerald }]}>
                        {getPrayerEmoji()} {request.prayedCount}
                    </Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.prayButton, { backgroundColor: colors.emerald }]}
                        onPress={() => handlePray(request.id)}
                    >
                        <Text style={[styles.prayButtonText, { color: colors.cream }]}>
                            {faithMode ? 'Pray' : 'Support'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.answeredButton,
                            {
                                backgroundColor: request.isAnswered ? colors.emerald : 'transparent',
                                borderColor: colors.emerald,
                            },
                        ]}
                        onPress={() => handleMarkAnswered(request.id)}
                    >
                        <Text
                            style={[
                                styles.answeredButtonText,
                                { color: request.isAnswered ? colors.cream : colors.emerald },
                            ]}
                        >
                            {request.isAnswered ? getAnsweredEmoji() : 'Mark Answered'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {faithMode && (
                <View style={[styles.faithFooter, { backgroundColor: colors.sand }]}>
                    <Text style={[styles.faithText, { color: colors.emerald }]}>
                        Let's pray 🙏
                    </Text>
                </View>
            )}

            {/* Voice Prayer Chain */}
            {renderVoicePrayerChain(request)}
        </Animated.View>
    );

    const renderFilterButton = (filterType: FilterType, label: string) => (
        <TouchableOpacity
            style={[
                styles.filterButton,
                {
                    backgroundColor: filter === filterType ? colors.emerald : 'transparent',
                    borderColor: colors.emerald,
                },
            ]}
            onPress={() => setFilter(filterType)}
        >
            <Text
                style={[
                    styles.filterButtonText,
                    { color: filter === filterType ? colors.cream : colors.emerald },
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Text style={[styles.title, { color: colors.emerald }]}>
                    {faithMode ? 'Prayer Board' : 'Support Board'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.olive }]}>
                    {faithMode
                        ? 'Share and pray for needs in your circle.'
                        : 'Share and support each other in your circle.'
                    }
                </Text>

                <TouchableOpacity
                    style={[styles.newRequestButton, { backgroundColor: colors.emerald }]}
                    onPress={() => setShowNewRequestModal(true)}
                >
                    <Text style={[styles.newRequestButtonText, { color: colors.cream }]}>
                        {faithMode ? '✝️ New Prayer Request' : '🕊 New Support Request'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
            >
                {renderFilterButton('all', 'All')}
                {renderFilterButton('mine', 'Mine')}
                {renderFilterButton('answered', faithMode ? 'Answered' : 'Resolved')}
                {renderFilterButton('urgent', 'Urgent')}
            </ScrollView>

            {/* Prayer Requests */}
            <ScrollView style={styles.requestsContainer} showsVerticalScrollIndicator={false}>
                {filteredRequests.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyStateText, { color: colors.olive }]}>
                            {faithMode
                                ? 'No prayer requests yet. Be the first to share!'
                                : 'No support requests yet. Be the first to share!'
                            }
                        </Text>
                    </View>
                ) : (
                    filteredRequests.map(renderPrayerCard)
                )}
            </ScrollView>

            {/* New Request Modal */}
            <Modal
                visible={showNewRequestModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.emerald }]}>
                            {faithMode ? 'New Prayer Request' : 'New Support Request'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowNewRequestModal(false)}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.olive }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                            }]}
                            placeholder="Title"
                            placeholderTextColor={colors.olive}
                            value={newRequest.title}
                            onChangeText={(text) => setNewRequest(prev => ({ ...prev, title: text }))}
                        />

                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                            }]}
                            placeholder={faithMode
                                ? "Share your prayer request..."
                                : "Share your support request..."
                            }
                            placeholderTextColor={colors.olive}
                            value={newRequest.description}
                            onChangeText={(text) => setNewRequest(prev => ({ ...prev, description: text }))}
                            multiline
                            numberOfLines={4}
                        />

                        {faithMode && (
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: colors.card,
                                    color: colors.text,
                                    borderColor: colors.olive,
                                }]}
                                placeholder="Scripture reference (optional)"
                                placeholderTextColor={colors.olive}
                                value={newRequest.scripture}
                                onChangeText={(text) => setNewRequest(prev => ({ ...prev, scripture: text }))}
                            />
                        )}

                        <TouchableOpacity
                            style={[
                                styles.urgentToggle,
                                {
                                    backgroundColor: newRequest.isUrgent ? colors.emerald : 'transparent',
                                    borderColor: colors.emerald,
                                },
                            ]}
                            onPress={() => setNewRequest(prev => ({ ...prev, isUrgent: !prev.isUrgent }))}
                        >
                            <Text
                                style={[
                                    styles.urgentToggleText,
                                    { color: newRequest.isUrgent ? colors.cream : colors.emerald },
                                ]}
                            >
                                {faithMode ? '🚨 Mark as Urgent' : '🚨 Mark as Priority'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <View style={[styles.modalFooter, { backgroundColor: colors.card }]}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { borderColor: colors.olive }]}
                            onPress={() => setShowNewRequestModal(false)}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.olive }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.postButton, { backgroundColor: colors.emerald }]}
                            onPress={handlePostRequest}
                        >
                            <Text style={[styles.postButtonText, { color: colors.cream }]}>
                                {faithMode ? 'Post Prayer Request' : 'Post Support Request'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Voice Prayer Recording Modal */}
            <Modal
                visible={showVoicePrayerModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.emerald }]}>
                            {faithMode ? 'Record Voice Prayer' : 'Record Voice Support'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowVoicePrayerModal(false)}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.olive }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>
                        {selectedRequestForVoice && (
                            <View style={[styles.recordingRequestInfo, { backgroundColor: colors.sand }]}>
                                <Text style={[styles.recordingRequestTitle, { color: colors.emerald }]}>
                                    {selectedRequestForVoice.title}
                                </Text>
                                <Text style={[styles.recordingRequestDescription, { color: colors.text }]}>
                                    {selectedRequestForVoice.description}
                                </Text>
                            </View>
                        )}

                        <View style={styles.recordingContainer}>
                            <Text style={[styles.recordingInstructions, { color: colors.olive }]}>
                                {faithMode
                                    ? 'Record your voice prayer (30-60 seconds)'
                                    : 'Record your voice support (30-60 seconds)'
                                }
                            </Text>

                            <View style={styles.recordingControls}>
                                <TouchableOpacity
                                    style={[
                                        styles.recordButton,
                                        {
                                            backgroundColor: recording ? colors.emerald : colors.olive,
                                        }
                                    ]}
                                    onPress={recording ? stopRecording : startRecording}
                                >
                                    <Text style={[styles.recordButtonText, { color: colors.cream }]}>
                                        {recording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {recording && (
                                <View style={[styles.recordingIndicator, { backgroundColor: colors.emerald }]}>
                                    <Text style={[styles.recordingIndicatorText, { color: colors.cream }]}>
                                        🔴 Recording... Tap to stop
                                    </Text>
                                </View>
                            )}

                            <Text style={[styles.recordingHint, { color: colors.olive }]}>
                                {faithMode
                                    ? 'Speak your prayer with faith and agreement'
                                    : 'Speak your encouragement and support'
                                }
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Nunito_700SemiBold',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        fontFamily: 'Quicksand_400Regular',
    },
    newRequestButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
    },
    newRequestButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    filterContainer: {
        paddingVertical: 15,
    },
    filterContent: {
        paddingHorizontal: 20,
        gap: 10,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    requestsContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    answeredCard: {
        shadowColor: '#2F7766',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        fontFamily: 'Nunito_600SemiBold',
    },
    urgentBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    urgentText: {
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    cardDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    scriptureContainer: {
        padding: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    scriptureText: {
        fontSize: 12,
        fontStyle: 'italic',
        fontFamily: 'Quicksand_400Regular',
    },
    cardFooter: {
        marginTop: 8,
    },
    metaInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    postedBy: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    prayedCount: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    prayButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    prayButtonText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    answeredButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
    },
    answeredButtonText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    faithFooter: {
        marginTop: 12,
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    faithText: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Quicksand_400Regular',
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        fontFamily: 'Quicksand_400Regular',
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        fontFamily: 'Quicksand_400Regular',
        textAlignVertical: 'top',
        minHeight: 100,
    },
    urgentToggle: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    urgentToggleText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    postButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    postButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    // Voice Prayer Chain Styles
    voiceChainContainer: {
        marginTop: 12,
        padding: 12,
        borderRadius: 8,
    },
    voiceChainHeader: {
        marginBottom: 12,
    },
    voiceChainTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Nunito_600SemiBold',
    },
    voiceChainSubtitle: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    voiceChainScroll: {
        marginBottom: 12,
    },
    voicePrayerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    voicePrayerButton: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        minWidth: 80,
    },
    voicePrayerIcon: {
        fontSize: 16,
        marginBottom: 4,
    },
    voicePrayerText: {
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
        textAlign: 'center',
    },
    voicePrayerAuthor: {
        fontSize: 8,
        fontFamily: 'Quicksand_400Regular',
        textAlign: 'center',
    },
    voicePrayerDuration: {
        fontSize: 8,
        fontFamily: 'Quicksand_400Regular',
        textAlign: 'center',
    },
    voiceChainArrow: {
        fontSize: 16,
        marginHorizontal: 4,
    },
    addVoiceButton: {
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    addVoiceButtonText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    // Voice Prayer Recording Modal Styles
    recordingRequestInfo: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    recordingRequestTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        fontFamily: 'Nunito_600SemiBold',
    },
    recordingRequestDescription: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Quicksand_400Regular',
    },
    recordingContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    recordingInstructions: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Quicksand_400Regular',
    },
    recordingControls: {
        marginBottom: 20,
    },
    recordButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 25,
        alignItems: 'center',
    },
    recordButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    recordingIndicator: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 16,
    },
    recordingIndicatorText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    recordingHint: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: 'Quicksand_400Regular',
    },
}); 