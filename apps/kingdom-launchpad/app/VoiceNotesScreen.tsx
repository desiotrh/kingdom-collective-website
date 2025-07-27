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
    Switch,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface VoiceNote {
    id: string;
    title: string;
    category: 'prayer' | 'brainstorm' | 'idea' | 'meeting' | 'reflection' | 'testimony';
    duration: number; // in seconds
    fileUrl: string;
    transcription: string;
    tags: string[];
    isFaithMode: boolean;
    insights: string[];
    actionItems: string[];
    createdAt: Date;
    lastModified: Date;
}

interface TranscriptionResult {
    id: string;
    noteId: string;
    text: string;
    confidence: number;
    timestamps: Timestamp[];
    isEdited: boolean;
}

interface Timestamp {
    start: number;
    end: number;
    text: string;
}

interface PrayerJournal {
    id: string;
    date: Date;
    prayerRequests: string[];
    answeredPrayers: string[];
    testimonies: string[];
    scriptureReflections: string[];
    gratitude: string[];
}

const VoiceNotesScreen: React.FC = () => {
    const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
    const [transcriptionResults, setTranscriptionResults] = useState<TranscriptionResult[]>([]);
    const [prayerJournals, setPrayerJournals] = useState<PrayerJournal[]>([]);
    const [selectedTab, setSelectedTab] = useState<'notes' | 'transcription' | 'prayer' | 'insights'>('notes');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showPrayerModal, setShowPrayerModal] = useState(false);
    const [newNote, setNewNote] = useState<Partial<VoiceNote>>({});
    const [newPrayerEntry, setNewPrayerEntry] = useState<Partial<PrayerJournal>>({});
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [selectedNote, setSelectedNote] = useState<VoiceNote | null>(null);

    // Mock data
    useEffect(() => {
        setVoiceNotes([
            {
                id: '1',
                title: 'Business Launch Ideas',
                category: 'brainstorm',
                duration: 180,
                fileUrl: 'https://example.com/audio1.mp3',
                transcription: 'Today I was thinking about launching a new course focused on faith-based business principles. The key insights include...',
                tags: ['business', 'launch', 'course', 'faith'],
                isFaithMode: true,
                insights: [
                    'Focus on serving others rather than just selling',
                    'Include prayer and scripture in the course content',
                    'Create a community aspect for ongoing support'
                ],
                actionItems: [
                    'Research similar courses in the market',
                    'Create course outline with faith integration',
                    'Set up prayer team for the launch'
                ],
                createdAt: new Date('2024-01-20'),
                lastModified: new Date('2024-01-20')
            },
            {
                id: '2',
                title: 'Morning Prayer',
                category: 'prayer',
                duration: 300,
                fileUrl: 'https://example.com/audio2.mp3',
                transcription: 'Lord, thank you for this new day. I pray for guidance in my business decisions today...',
                tags: ['prayer', 'morning', 'guidance'],
                isFaithMode: true,
                insights: [
                    'Need to trust God more in business decisions',
                    'Remember to pray before making important choices',
                    'Focus on Kingdom impact over profit'
                ],
                actionItems: [
                    'Start each day with prayer',
                    'Include prayer time in business planning',
                    'Share testimonies of God\'s guidance'
                ],
                createdAt: new Date('2024-01-19'),
                lastModified: new Date('2024-01-19')
            }
        ]);

        setTranscriptionResults([
            {
                id: '1',
                noteId: '1',
                text: 'Today I was thinking about launching a new course focused on faith-based business principles. The key insights include focusing on serving others rather than just selling, including prayer and scripture in the course content, and creating a community aspect for ongoing support.',
                confidence: 0.95,
                timestamps: [
                    { start: 0, end: 5, text: 'Today I was thinking' },
                    { start: 5, end: 10, text: 'about launching a new course' }
                ],
                isEdited: false
            }
        ]);

        setPrayerJournals([
            {
                id: '1',
                date: new Date('2024-01-20'),
                prayerRequests: [
                    'Guidance for the course launch',
                    'Wisdom in business decisions',
                    'Strength to serve others well'
                ],
                answeredPrayers: [
                    'God provided clarity on course structure',
                    'Received confirmation about pricing strategy'
                ],
                testimonies: [
                    'A student shared how the course changed their business approach'
                ],
                scriptureReflections: [
                    'Proverbs 3:5-6 - Trust in the Lord with all your heart'
                ],
                gratitude: [
                    'Thankful for the opportunity to serve others',
                    'Grateful for the team supporting this work'
                ]
            }
        ]);
    }, []);

    const startRecording = () => {
        setIsRecording(true);
        setRecordingDuration(0);
        // In a real app, you'd start actual audio recording here
        Alert.alert('Recording Started', 'Your voice note is being recorded. Tap stop when finished.');
    };

    const stopRecording = () => {
        setIsRecording(false);
        // In a real app, you'd stop recording and save the file here
        Alert.alert('Recording Stopped', 'Your voice note has been saved and is being transcribed.');
    };

    const createVoiceNote = () => {
        if (!newNote.title) {
            Alert.alert('Error', 'Please enter a title for your voice note');
            return;
        }

        const note: VoiceNote = {
            id: Date.now().toString(),
            title: newNote.title,
            category: newNote.category || 'idea',
            duration: recordingDuration,
            fileUrl: 'https://example.com/audio.mp3',
            transcription: 'Transcription will appear here...',
            tags: newNote.tags || [],
            isFaithMode: newNote.isFaithMode || false,
            insights: [],
            actionItems: [],
            createdAt: new Date(),
            lastModified: new Date()
        };

        setVoiceNotes([...voiceNotes, note]);
        setNewNote({});
        setShowNoteModal(false);
        Alert.alert('Success', 'Voice note created successfully!');
    };

    const addPrayerEntry = () => {
        const entry: PrayerJournal = {
            id: Date.now().toString(),
            date: new Date(),
            prayerRequests: newPrayerEntry.prayerRequests || [],
            answeredPrayers: newPrayerEntry.answeredPrayers || [],
            testimonies: newPrayerEntry.testimonies || [],
            scriptureReflections: newPrayerEntry.scriptureReflections || [],
            gratitude: newPrayerEntry.gratitude || []
        };

        setPrayerJournals([...prayerJournals, entry]);
        setNewPrayerEntry({});
        setShowPrayerModal(false);
        Alert.alert('Success', 'Prayer journal entry added!');
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'prayer': return 'heart';
            case 'brainstorm': return 'bulb';
            case 'idea': return 'lightbulb';
            case 'meeting': return 'people';
            case 'reflection': return 'book';
            case 'testimony': return 'chatbubble-ellipses';
            default: return 'mic';
        }
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderVoiceNotes = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🎤 Voice Notes ({voiceNotes.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowNoteModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>New Note</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.recordingSection}>
                <TouchableOpacity
                    style={[styles.recordButton, isRecording && styles.recordingButton]}
                    onPress={isRecording ? stopRecording : startRecording}
                >
                    <Ionicons
                        name={isRecording ? 'stop' : 'mic'}
                        size={24}
                        color="#fff"
                    />
                    <Text style={styles.recordButtonText}>
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </Text>
                </TouchableOpacity>
                {isRecording && (
                    <Text style={styles.recordingTime}>
                        {formatDuration(recordingDuration)}
                    </Text>
                )}
            </View>

            {voiceNotes.map(note => (
                <TouchableOpacity
                    key={note.id}
                    style={styles.noteCard}
                    onPress={() => setSelectedNote(note)}
                >
                    <View style={styles.noteHeader}>
                        <Ionicons name={getCategoryIcon(note.category) as any} size={20} color="#667eea" />
                        <Text style={styles.noteTitle}>{note.title}</Text>
                        <Text style={styles.noteDuration}>{formatDuration(note.duration)}</Text>
                    </View>
                    <Text style={styles.noteTranscription}>
                        {note.transcription.substring(0, 100)}...
                    </Text>
                    <View style={styles.noteMeta}>
                        <Text style={styles.noteCategory}>{note.category}</Text>
                        <Text style={styles.noteDate}>{note.createdAt.toLocaleDateString()}</Text>
                        {note.isFaithMode && (
                            <View style={styles.faithBadge}>
                                <Ionicons name="heart" size={12} color="#E4405F" />
                                <Text style={styles.faithBadgeText}>Faith</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.noteTags}>
                        {note.tags.map(tag => (
                            <Text key={tag} style={styles.tag}>{tag}</Text>
                        ))}
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderTranscription = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Transcription Results</Text>
            <Text style={styles.sectionDescription}>
                AI-powered transcription with editing capabilities
            </Text>

            {transcriptionResults.map(result => {
                const note = voiceNotes.find(n => n.id === result.noteId);
                return (
                    <View key={result.id} style={styles.transcriptionCard}>
                        <View style={styles.transcriptionHeader}>
                            <Text style={styles.transcriptionTitle}>{note?.title || 'Untitled'}</Text>
                            <Text style={styles.confidenceText}>{Math.round(result.confidence * 100)}% accurate</Text>
                        </View>
                        <Text style={styles.transcriptionText}>{result.text}</Text>
                        <View style={styles.transcriptionMeta}>
                            <Text style={styles.transcriptionDate}>{note?.createdAt.toLocaleDateString()}</Text>
                            <Text style={styles.transcriptionStatus}>
                                {result.isEdited ? 'Edited' : 'Auto-transcribed'}
                            </Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );

    const renderPrayerJournal = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🙏 Prayer Journal ({prayerJournals.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowPrayerModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Entry</Text>
                </TouchableOpacity>
            </View>

            {prayerJournals.map(journal => (
                <View key={journal.id} style={styles.journalCard}>
                    <Text style={styles.journalDate}>{journal.date.toLocaleDateString()}</Text>

                    {journal.prayerRequests.length > 0 && (
                        <View style={styles.journalSection}>
                            <Text style={styles.journalSectionTitle}>Prayer Requests:</Text>
                            {journal.prayerRequests.map((request, index) => (
                                <Text key={index} style={styles.journalItem}>• {request}</Text>
                            ))}
                        </View>
                    )}

                    {journal.answeredPrayers.length > 0 && (
                        <View style={styles.journalSection}>
                            <Text style={styles.journalSectionTitle}>Answered Prayers:</Text>
                            {journal.answeredPrayers.map((prayer, index) => (
                                <Text key={index} style={styles.journalItem}>• {prayer}</Text>
                            ))}
                        </View>
                    )}

                    {journal.testimonies.length > 0 && (
                        <View style={styles.journalSection}>
                            <Text style={styles.journalSectionTitle}>Testimonies:</Text>
                            {journal.testimonies.map((testimony, index) => (
                                <Text key={index} style={styles.journalItem}>• {testimony}</Text>
                            ))}
                        </View>
                    )}

                    {journal.scriptureReflections.length > 0 && (
                        <View style={styles.journalSection}>
                            <Text style={styles.journalSectionTitle}>Scripture Reflections:</Text>
                            {journal.scriptureReflections.map((reflection, index) => (
                                <Text key={index} style={styles.journalItem}>• {reflection}</Text>
                            ))}
                        </View>
                    )}

                    {journal.gratitude.length > 0 && (
                        <View style={styles.journalSection}>
                            <Text style={styles.journalSectionTitle}>Gratitude:</Text>
                            {journal.gratitude.map((item, index) => (
                                <Text key={index} style={styles.journalItem}>• {item}</Text>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </View>
    );

    const renderInsights = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 AI Insights</Text>
            <Text style={styles.sectionDescription}>
                AI-generated insights from your voice notes
            </Text>

            {voiceNotes.map(note =>
                note.insights.map((insight, index) => (
                    <View key={`${note.id}-${index}`} style={styles.insightCard}>
                        <Text style={styles.insightText}>{insight}</Text>
                        <Text style={styles.insightSource}>From: {note.title}</Text>
                    </View>
                ))
            )}

            {voiceNotes.map(note =>
                note.actionItems.map((action, index) => (
                    <View key={`${note.id}-action-${index}`} style={styles.actionCard}>
                        <Text style={styles.actionText}>{action}</Text>
                        <Text style={styles.actionSource}>From: {note.title}</Text>
                    </View>
                ))
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>🎤 Voice Notes</Text>
                <Text style={styles.headerSubtitle}>AI transcription, prayer journaling, and insights</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'notes' && styles.activeTab]}
                    onPress={() => setSelectedTab('notes')}
                >
                    <Ionicons name="mic" size={20} color={selectedTab === 'notes' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'notes' && styles.activeTabText]}>
                        Notes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'transcription' && styles.activeTab]}
                    onPress={() => setSelectedTab('transcription')}
                >
                    <Ionicons name="document-text" size={20} color={selectedTab === 'transcription' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'transcription' && styles.activeTabText]}>
                        Transcription
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'prayer' && styles.activeTab]}
                    onPress={() => setSelectedTab('prayer')}
                >
                    <Ionicons name="heart" size={20} color={selectedTab === 'prayer' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'prayer' && styles.activeTabText]}>
                        Prayer
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'insights' && styles.activeTab]}
                    onPress={() => setSelectedTab('insights')}
                >
                    <Ionicons name="bulb" size={20} color={selectedTab === 'insights' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'insights' && styles.activeTabText]}>
                        Insights
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{voiceNotes.length}</Text>
                        <Text style={styles.statLabel}>Voice Notes</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{transcriptionResults.length}</Text>
                        <Text style={styles.statLabel}>Transcriptions</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{prayerJournals.length}</Text>
                        <Text style={styles.statLabel}>Prayer Entries</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {voiceNotes.reduce((sum, n) => sum + n.insights.length, 0)}
                        </Text>
                        <Text style={styles.statLabel}>Insights</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'notes' && renderVoiceNotes()}
                {selectedTab === 'transcription' && renderTranscription()}
                {selectedTab === 'prayer' && renderPrayerJournal()}
                {selectedTab === 'insights' && renderInsights()}

                {/* Note Modal */}
                <Modal
                    visible={showNoteModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowNoteModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Voice Note</Text>

                            <Text style={styles.inputLabel}>Title</Text>
                            <TextInput
                                style={styles.input}
                                value={newNote.title}
                                onChangeText={(text) => setNewNote({ ...newNote, title: text })}
                                placeholder="Enter note title"
                            />

                            <Text style={styles.inputLabel}>Category</Text>
                            <View style={styles.radioGroup}>
                                {['prayer', 'brainstorm', 'idea', 'meeting', 'reflection', 'testimony'].map(category => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.radioButton,
                                            newNote.category === category && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewNote({ ...newNote, category: category as any })}
                                    >
                                        <Text style={styles.radioLabel}>{category}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.settingRow}>
                                <Text style={styles.settingLabel}>Faith Mode</Text>
                                <Switch
                                    value={newNote.isFaithMode}
                                    onValueChange={(value) => setNewNote({ ...newNote, isFaithMode: value })}
                                />
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createVoiceNote}
                                >
                                    <Text style={styles.modalButtonText}>Create Note</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowNoteModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Prayer Entry Modal */}
                <Modal
                    visible={showPrayerModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowPrayerModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Prayer Journal Entry</Text>

                            <Text style={styles.inputLabel}>Prayer Requests (Optional)</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newPrayerEntry.prayerRequests?.join('\n')}
                                onChangeText={(text) => setNewPrayerEntry({
                                    ...newPrayerEntry,
                                    prayerRequests: text.split('\n').filter(line => line.trim())
                                })}
                                placeholder="Enter prayer requests..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Answered Prayers (Optional)</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newPrayerEntry.answeredPrayers?.join('\n')}
                                onChangeText={(text) => setNewPrayerEntry({
                                    ...newPrayerEntry,
                                    answeredPrayers: text.split('\n').filter(line => line.trim())
                                })}
                                placeholder="Enter answered prayers..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Testimonies (Optional)</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newPrayerEntry.testimonies?.join('\n')}
                                onChangeText={(text) => setNewPrayerEntry({
                                    ...newPrayerEntry,
                                    testimonies: text.split('\n').filter(line => line.trim())
                                })}
                                placeholder="Enter testimonies..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Gratitude (Optional)</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newPrayerEntry.gratitude?.join('\n')}
                                onChangeText={(text) => setNewPrayerEntry({
                                    ...newPrayerEntry,
                                    gratitude: text.split('\n').filter(line => line.trim())
                                })}
                                placeholder="Enter gratitude items..."
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addPrayerEntry}
                                >
                                    <Text style={styles.modalButtonText}>Add Entry</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowPrayerModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#667eea10',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    activeTabText: {
        color: '#667eea',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    recordingSection: {
        alignItems: 'center',
        marginBottom: 16,
    },
    recordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginBottom: 8,
    },
    recordingButton: {
        backgroundColor: '#f44336',
    },
    recordButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    recordingTime: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f44336',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    noteCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    noteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    noteTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    noteDuration: {
        fontSize: 12,
        color: '#666',
    },
    noteTranscription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    noteMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    noteCategory: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    noteDate: {
        fontSize: 12,
        color: '#999',
    },
    faithBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    faithBadgeText: {
        fontSize: 10,
        color: '#E4405F',
        fontWeight: 'bold',
    },
    noteTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#667eea',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 4,
        marginBottom: 2,
    },
    transcriptionCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    transcriptionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    transcriptionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    confidenceText: {
        fontSize: 12,
        color: '#666',
    },
    transcriptionText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    transcriptionMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    transcriptionDate: {
        fontSize: 12,
        color: '#999',
    },
    transcriptionStatus: {
        fontSize: 12,
        color: '#666',
    },
    journalCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    journalDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    journalSection: {
        marginBottom: 12,
    },
    journalSectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    journalItem: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    insightCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    insightText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    insightSource: {
        fontSize: 12,
        color: '#666',
    },
    actionCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    actionText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    actionSource: {
        fontSize: 12,
        color: '#666',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    radioGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
        gap: 8,
    },
    radioButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    radioButtonActive: {
        borderColor: '#667eea',
        backgroundColor: '#667eea10',
    },
    radioLabel: {
        fontSize: 14,
        color: '#333',
        textTransform: 'capitalize',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    settingLabel: {
        fontSize: 16,
        color: '#333',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default VoiceNotesScreen; 