import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Alert,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from '@/contexts/FaithModeContext';

interface JournalEntry {
    id: string;
    title: string;
    content: string;
    mood: string;
    tags: string[];
    date: string;
    faithMode: boolean;
    verse?: string;
    isDraft: boolean;
}

const availableTags = [
    'Identity', 'Healing', 'Prayer', 'Gratitude', 'Growth',
    'Struggle', 'Victory', 'Family', 'Work', 'Dreams'
];

const availableVerses = [
    { reference: 'Psalm 46:10', text: 'Be still and know that I am God.' },
    { reference: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but present your requests to God with thanksgiving.' },
    { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.' },
    { reference: 'Isaiah 41:10', text: 'Fear not, for I am with you; be not dismayed, for I am your God.' },
    { reference: 'Romans 8:28', text: 'And we know that in all things God works for the good of those who love him.' },
];

const moodOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Peaceful', value: 'peaceful' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '🤔', label: 'Thoughtful', value: 'thoughtful' },
    { emoji: '😇', label: 'Blessed', value: 'blessed' },
    { emoji: '💪', label: 'Strong', value: 'strong' },
];

export default function NewEntryScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { isFaithMode, isEncouragementMode, FaithModeOverlay, EncouragementOverlay } = useFaithMode();

    const [entry, setEntry] = useState<Partial<JournalEntry>>({
        title: '',
        content: '',
        mood: '',
        tags: [],
        faithMode: isFaithMode,
        verse: '',
    });

    const [selectedVerse, setSelectedVerse] = useState<string>('');
    const [showVerseSelector, setShowVerseSelector] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Voice recording states
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [transcribedText, setTranscribedText] = useState('');
    const [showTranscriptionModal, setShowTranscriptionModal] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordingPermission, setRecordingPermission] = useState(false);

    const saveButtonOpacity = useRef(new Animated.Value(0)).current;
    const glowAnimation = useRef(new Animated.Value(0)).current;
    const pulseAnimation = useRef(new Animated.Value(1)).current;

    // Request recording permission on mount
    useEffect(() => {
        requestRecordingPermission();
    }, []);

    // Autosave every 15 seconds
    useEffect(() => {
        const autosaveInterval = setInterval(() => {
            if (entry.title || entry.content) {
                saveDraft();
            }
        }, 15000);

        return () => clearInterval(autosaveInterval);
    }, [entry]);

    // Show save button when content changes
    useEffect(() => {
        if (entry.title || entry.content) {
            Animated.timing(saveButtonOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(saveButtonOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [entry.title, entry.content]);

    // Recording timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const requestRecordingPermission = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            setRecordingPermission(status === 'granted');
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant microphone permission to use voice recording.');
            }
        } catch (error) {
            console.error('Error requesting recording permission:', error);
        }
    };

    const startRecording = async () => {
        if (!recordingPermission) {
            await requestRecordingPermission();
            return;
        }

        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
            setIsRecording(true);
            setRecordingTime(0);

            // Start pulse animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnimation, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnimation, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

        } catch (error) {
            console.error('Error starting recording:', error);
            Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        try {
            setIsRecording(false);
            Animated.loop(Animated.timing(pulseAnimation, { toValue: 1, duration: 0 })).stop();

            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);

            if (uri) {
                // Mock transcription - replace with actual speech-to-text API
                await mockTranscribeAudio(uri);
            }

        } catch (error) {
            console.error('Error stopping recording:', error);
            Alert.alert('Recording Error', 'Failed to stop recording. Please try again.');
        }
    };

    const mockTranscribeAudio = async (uri: string) => {
        // Simulate transcription delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock transcribed text based on recording time
        const mockTexts = [
            "Today I felt really grateful for the small moments of peace in my day. God's presence was so evident in the quiet times.",
            "I'm learning to trust God more with my future. It's not always easy, but I know He has a plan for me.",
            "The Lord reminded me today that His love is constant, even when I don't feel it. I'm so thankful for His faithfulness.",
            "I had a challenging day, but I'm choosing to focus on the blessings instead of the difficulties.",
            "God is teaching me patience through this season. I'm learning to wait on His timing.",
        ];

        const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
        setTranscribedText(randomText);
        setShowTranscriptionModal(true);
    };

    const handleTranscriptionEdit = (text: string) => {
        setTranscribedText(text);
    };

    const insertTranscription = (mode: 'append' | 'replace') => {
        if (mode === 'append') {
            const currentContent = entry.content || '';
            const separator = currentContent ? '\n\n' : '';
            setEntry(prev => ({
                ...prev,
                content: currentContent + separator + transcribedText
            }));
        } else {
            setEntry(prev => ({
                ...prev,
                content: transcribedText
            }));
        }

        setShowTranscriptionModal(false);
        setTranscribedText('');

        // Faith mode blessing
        if (isFaithMode) {
            Alert.alert(
                'Blessing Added',
                'Your voice entry has been blessed. "Let the redeemed of the Lord say so" - Psalm 107:2'
            );
        }
    };

    const saveDraft = async () => {
        try {
            const draftKey = 'journal_draft';
            const draftData = {
                ...entry,
                date: new Date().toISOString(),
                isDraft: true,
            };
            await AsyncStorage.setItem(draftKey, JSON.stringify(draftData));
            setLastSaved(new Date());
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    };

    const saveEntry = async () => {
        setIsSaving(true);
        try {
            const entryId = Date.now().toString();
            const fullEntry: JournalEntry = {
                id: entryId,
                title: entry.title || 'Untitled Entry',
                content: entry.content || '',
                mood: entry.mood || '',
                tags: entry.tags || [],
                date: new Date().toISOString(),
                faithMode: isFaithMode,
                verse: selectedVerse,
                isDraft: false,
            };

            // Save to entries list
            const entriesKey = 'journal_entries';
            const existingEntries = await AsyncStorage.getItem(entriesKey);
            const entries = existingEntries ? JSON.parse(existingEntries) : [];
            entries.unshift(fullEntry);
            await AsyncStorage.setItem(entriesKey, JSON.stringify(entries));

            // Clear draft
            await AsyncStorage.removeItem('journal_draft');

            // Animate save button
            Animated.sequence([
                Animated.timing(glowAnimation, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnimation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            Alert.alert('Entry Saved', 'Your journal entry has been saved successfully!');

            // Reset form
            setEntry({
                title: '',
                content: '',
                mood: '',
                tags: [],
                faithMode: isFaithMode,
                verse: '',
            });
            setSelectedVerse('');

        } catch (error) {
            console.error('Error saving entry:', error);
            Alert.alert('Error', 'Failed to save entry. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleTag = (tag: string) => {
        setEntry(prev => ({
            ...prev,
            tags: prev.tags?.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...(prev.tags || []), tag]
        }));
    };

    const selectMood = (mood: string) => {
        setEntry(prev => ({ ...prev, mood }));
    };

    const selectVerse = (verse: string) => {
        setSelectedVerse(verse);
        setShowVerseSelector(false);
    };

    const formatRecordingTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            {isFaithMode ? '✝️ New Entry' : 'New Entry'}
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.charcoalInk }]}>
                            {isEncouragementMode ? 'Write what you needed to hear' : 'Express your thoughts'}
                        </Text>
                        {lastSaved && (
                            <Text style={[styles.lastSaved, { color: colors.charcoalInk }]}>
                                Last saved: {lastSaved.toLocaleTimeString()}
                            </Text>
                        )}
                    </View>

                    {/* Voice Recording Section */}
                    <View style={[styles.voiceSection, { backgroundColor: colors.cream }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            🎙️ Voice Entry
                        </Text>

                        <View style={styles.voiceControls}>
                            <TouchableOpacity
                                style={[
                                    styles.recordButton,
                                    {
                                        backgroundColor: isRecording ? colors.softGold : colors.skyBlue,
                                        transform: [{ scale: pulseAnimation }]
                                    }
                                ]}
                                onPress={isRecording ? stopRecording : startRecording}
                            >
                                <Text style={[styles.recordButtonText, { color: colors.cream }]}>
                                    {isRecording ? '⏹️ Stop Recording' : '🎤 Record Voice Entry'}
                                </Text>
                            </TouchableOpacity>

                            {isRecording && (
                                <View style={styles.recordingInfo}>
                                    <Text style={[styles.recordingTime, { color: colors.charcoalInk }]}>
                                        {formatRecordingTime(recordingTime)}
                                    </Text>
                                    <Text style={[styles.recordingStatus, { color: colors.charcoalInk }]}>
                                        Recording...
                                    </Text>
                                </View>
                            )}
                        </View>

                        {isEncouragementMode && (
                            <Text style={[styles.encouragementText, { color: colors.charcoalInk }]}>
                                💝 Your voice matters. Speak your story.
                            </Text>
                        )}
                    </View>

                    {/* Title Input */}
                    <View style={styles.inputSection}>
                        <Text style={[styles.inputLabel, { color: colors.text }]}>Title</Text>
                        <TextInput
                            style={[styles.titleInput, {
                                backgroundColor: colors.cream,
                                color: colors.charcoalInk,
                                borderColor: colors.softGold
                            }]}
                            value={entry.title}
                            onChangeText={(text) => setEntry(prev => ({ ...prev, title: text }))}
                            placeholder="Give your entry a title..."
                            placeholderTextColor={colors.charcoalInk + '80'}
                        />
                    </View>

                    {/* Content Input */}
                    <View style={styles.inputSection}>
                        <Text style={[styles.inputLabel, { color: colors.text }]}>Your Thoughts</Text>
                        <TextInput
                            style={[styles.contentInput, {
                                backgroundColor: colors.cream,
                                color: colors.charcoalInk,
                                borderColor: colors.softGold
                            }]}
                            value={entry.content}
                            onChangeText={(text) => setEntry(prev => ({ ...prev, content: text }))}
                            placeholder="Start writing your thoughts..."
                            placeholderTextColor={colors.charcoalInk + '80'}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Mood Selector */}
                    <View style={styles.inputSection}>
                        <Text style={[styles.inputLabel, { color: colors.text }]}>How are you feeling?</Text>
                        <View style={styles.moodContainer}>
                            {moodOptions.map((mood) => (
                                <TouchableOpacity
                                    key={mood.value}
                                    style={[
                                        styles.moodButton,
                                        {
                                            backgroundColor: entry.mood === mood.value ? colors.softGold : colors.cream,
                                            borderColor: colors.softGold
                                        }
                                    ]}
                                    onPress={() => selectMood(mood.value)}
                                >
                                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                    <Text style={[styles.moodLabel, { color: colors.charcoalInk }]}>
                                        {mood.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Tags Selector */}
                    <View style={styles.inputSection}>
                        <Text style={[styles.inputLabel, { color: colors.text }]}>Tags</Text>
                        <View style={styles.tagsContainer}>
                            {availableTags.map((tag) => (
                                <TouchableOpacity
                                    key={tag}
                                    style={[
                                        styles.tagButton,
                                        {
                                            backgroundColor: entry.tags?.includes(tag) ? colors.softGold : colors.skyBlue,
                                            borderColor: colors.softGold
                                        }
                                    ]}
                                    onPress={() => toggleTag(tag)}
                                >
                                    <Text style={[
                                        styles.tagText,
                                        { color: entry.tags?.includes(tag) ? colors.cream : colors.charcoalInk }
                                    ]}>
                                        {tag}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Faith Mode Verse Selector */}
                    {isFaithMode && (
                        <View style={styles.inputSection}>
                            <Text style={[styles.inputLabel, { color: colors.text }]}>
                                ✝️ Add Scripture (Optional)
                            </Text>
                            <TouchableOpacity
                                style={[styles.verseButton, {
                                    backgroundColor: colors.cream,
                                    borderColor: colors.softGold
                                }]}
                                onPress={() => setShowVerseSelector(true)}
                            >
                                <Text style={[styles.verseButtonText, { color: colors.charcoalInk }]}>
                                    {selectedVerse || 'Select a verse...'}
                                </Text>
                            </TouchableOpacity>

                            {selectedVerse && (
                                <View style={[styles.selectedVerseCard, { backgroundColor: colors.softGold }]}>
                                    <Text style={[styles.selectedVerseText, { color: colors.cream }]}>
                                        {selectedVerse}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setSelectedVerse('')}
                                        style={styles.removeVerseButton}
                                    >
                                        <Text style={[styles.removeVerseText, { color: colors.cream }]}>×</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Encouragement Message */}
                    {isEncouragementMode && (
                        <View style={[styles.encouragementCard, { backgroundColor: colors.warmBeige }]}>
                            <Text style={[styles.encouragementTitle, { color: colors.charcoalInk }]}>
                                💝 Daily Truth
                            </Text>
                            <Text style={[styles.encouragementText, { color: colors.charcoalInk }]}>
                                You are heard. Your story matters. Every word you write is a step toward healing.
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* Floating Save Button */}
                <Animated.View
                    style={[
                        styles.floatingSaveButton,
                        {
                            opacity: saveButtonOpacity,
                            backgroundColor: colors.softGold,
                            transform: [{
                                scale: glowAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 1.1]
                                })
                            }]
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.saveButtonContent}
                        onPress={saveEntry}
                        disabled={isSaving}
                    >
                        <Text style={[styles.saveButtonText, { color: colors.cream }]}>
                            {isSaving ? 'Saving...' : 'Save Entry'}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Transcription Modal */}
                <Modal
                    visible={showTranscriptionModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowTranscriptionModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Review Your Voice Entry
                            </Text>

                            <TextInput
                                style={[styles.transcriptionInput, {
                                    backgroundColor: colors.cream,
                                    color: colors.charcoalInk,
                                    borderColor: colors.softGold
                                }]}
                                value={transcribedText}
                                onChangeText={handleTranscriptionEdit}
                                multiline
                                textAlignVertical="top"
                                placeholder="Edit your transcribed text..."
                            />

                            <View style={styles.transcriptionButtons}>
                                <TouchableOpacity
                                    style={[styles.transcriptionButton, { backgroundColor: colors.skyBlue }]}
                                    onPress={() => insertTranscription('append')}
                                >
                                    <Text style={[styles.transcriptionButtonText, { color: colors.charcoalInk }]}>
                                        📝 Append to Entry
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.transcriptionButton, { backgroundColor: colors.softGold }]}
                                    onPress={() => insertTranscription('replace')}
                                >
                                    <Text style={[styles.transcriptionButtonText, { color: colors.cream }]}>
                                        ✨ Replace Entry
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.skyBlue }]}
                                onPress={() => setShowTranscriptionModal(false)}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.charcoalInk }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Verse Selector Modal */}
                {showVerseSelector && (
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Select a Verse
                            </Text>

                            <ScrollView style={styles.versesList}>
                                {availableVerses.map((verse) => (
                                    <TouchableOpacity
                                        key={verse.reference}
                                        style={[styles.verseOption, { backgroundColor: colors.cream }]}
                                        onPress={() => selectVerse(`${verse.reference} - ${verse.text}`)}
                                    >
                                        <Text style={[styles.verseReference, { color: colors.charcoalInk }]}>
                                            {verse.reference}
                                        </Text>
                                        <Text style={[styles.verseText, { color: colors.charcoalInk }]}>
                                            {verse.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.skyBlue }]}
                                onPress={() => setShowVerseSelector(false)}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.charcoalInk }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Faith Mode Overlay */}
                {FaithModeOverlay}
                {EncouragementOverlay}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 20,
        paddingBottom: 100, // Space for floating button
    },
    header: {
        marginBottom: 30,
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    subtitle: {
        fontSize: 16,
        fontStyle: 'italic',
        opacity: 0.8,
        fontFamily: 'Raleway',
    },
    lastSaved: {
        fontSize: 12,
        opacity: 0.6,
        fontFamily: 'Raleway',
        marginTop: 8,
    },
    voiceSection: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'Playfair Display',
    },
    voiceControls: {
        alignItems: 'center',
        marginBottom: 16,
    },
    recordButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    recordButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    recordingInfo: {
        alignItems: 'center',
        marginTop: 12,
    },
    recordingTime: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    recordingStatus: {
        fontSize: 14,
        opacity: 0.8,
        fontFamily: 'Raleway',
    },
    encouragementText: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: 'Raleway',
    },
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    titleInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Raleway',
    },
    contentInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        minHeight: 200,
        fontFamily: 'Raleway',
        lineHeight: 24,
    },
    moodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    moodButton: {
        width: '48%',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    moodEmoji: {
        fontSize: 20,
        marginBottom: 4,
    },
    moodLabel: {
        fontSize: 12,
        fontFamily: 'Raleway',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
    },
    tagText: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Raleway',
    },
    verseButton: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    verseButtonText: {
        fontSize: 14,
        fontFamily: 'Raleway',
    },
    selectedVerseCard: {
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedVerseText: {
        fontSize: 12,
        fontStyle: 'italic',
        flex: 1,
        fontFamily: 'Raleway',
    },
    removeVerseButton: {
        paddingHorizontal: 8,
    },
    removeVerseText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    encouragementCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    encouragementTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    floatingSaveButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonContent: {
        padding: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '90%',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Playfair Display',
    },
    transcriptionInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
        minHeight: 150,
        fontFamily: 'Raleway',
        textAlignVertical: 'top',
    },
    transcriptionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 8,
    },
    transcriptionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    transcriptionButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    versesList: {
        maxHeight: 300,
        marginBottom: 20,
    },
    verseOption: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#DAB785',
    },
    verseReference: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Playfair Display',
    },
    verseText: {
        fontSize: 12,
        fontStyle: 'italic',
        lineHeight: 16,
        fontFamily: 'Raleway',
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
}); 