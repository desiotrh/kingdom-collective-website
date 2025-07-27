import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Modal,
    TextInput,
    Alert,
    FlatList,
    Dimensions,
    Switch,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface OfflineGallery {
    id: string;
    name: string;
    clientName: string;
    downloadDate: string;
    size: string;
    imageCount: number;
    lastViewed: string;
    status: 'Downloaded' | 'Downloading' | 'Available';
}

interface QuickEdit {
    id: string;
    imageName: string;
    originalPath: string;
    editedPath: string;
    edits: EditAction[];
    preset: string;
    createdAt: string;
}

interface EditAction {
    type: 'crop' | 'brightness' | 'contrast' | 'saturation' | 'filter';
    value: number;
    description: string;
}

interface VoiceNote {
    id: string;
    title: string;
    duration: string;
    filePath: string;
    shootId?: string;
    clientId?: string;
    notes: string;
    createdAt: string;
}

interface PrayerJournal {
    id: string;
    date: string;
    shootId?: string;
    clientId?: string;
    prayer: string;
    answer?: string;
    scripture: string;
    mood: 'Grateful' | 'Hopeful' | 'Challenged' | 'Joyful';
}

export default function MobileEnhancementsScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [activeTab, setActiveTab] = useState<'offline' | 'editing' | 'voice' | 'prayer'>('offline');
    const [offlineMode, setOfflineMode] = useState(true);
    const [autoDownload, setAutoDownload] = useState(false);
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
    const [showPrayerModal, setShowPrayerModal] = useState(false);

    // Mock data
    const [offlineGalleries, setOfflineGalleries] = useState<OfflineGallery[]>([
        {
            id: '1',
            name: 'Sarah Wedding Collection',
            clientName: 'Sarah Johnson',
            downloadDate: '2024-01-15',
            size: '2.3 GB',
            imageCount: 450,
            lastViewed: '2024-01-20',
            status: 'Downloaded'
        },
        {
            id: '2',
            name: 'Family Portrait Session',
            clientName: 'Michael Chen',
            downloadDate: '2024-01-18',
            size: '850 MB',
            imageCount: 120,
            lastViewed: '2024-01-19',
            status: 'Downloaded'
        },
        {
            id: '3',
            name: 'Senior Portrait Collection',
            clientName: 'Emily Rodriguez',
            downloadDate: '2024-01-20',
            size: '1.1 GB',
            imageCount: 200,
            lastViewed: '2024-01-21',
            status: 'Downloading'
        }
    ]);

    const [quickEdits, setQuickEdits] = useState<QuickEdit[]>([
        {
            id: '1',
            imageName: 'IMG_001.jpg',
            originalPath: '/photos/original/IMG_001.jpg',
            editedPath: '/photos/edited/IMG_001_edited.jpg',
            edits: [
                { type: 'brightness', value: 15, description: 'Increased brightness' },
                { type: 'contrast', value: 10, description: 'Enhanced contrast' },
                { type: 'filter', value: 0, description: 'Applied warm filter' }
            ],
            preset: 'Portrait Warm',
            createdAt: '2024-01-20 14:30'
        },
        {
            id: '2',
            imageName: 'IMG_002.jpg',
            originalPath: '/photos/original/IMG_002.jpg',
            editedPath: '/photos/edited/IMG_002_edited.jpg',
            edits: [
                { type: 'crop', value: 0, description: 'Cropped to square' },
                { type: 'saturation', value: -5, description: 'Reduced saturation' }
            ],
            preset: 'Instagram Square',
            createdAt: '2024-01-20 15:45'
        }
    ]);

    const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([
        {
            id: '1',
            title: 'Wedding Day Notes',
            duration: '2:34',
            filePath: '/voice/notes/wedding_notes.m4a',
            shootId: 'wedding-001',
            clientId: 'sarah-johnson',
            notes: 'Remember to capture first dance, cake cutting, and family photos',
            createdAt: '2024-01-15 09:30'
        },
        {
            id: '2',
            title: 'Location Scouting',
            duration: '1:45',
            filePath: '/voice/notes/location_scout.m4a',
            notes: 'Botanical gardens - best light at 4 PM, parking available',
            createdAt: '2024-01-18 16:20'
        }
    ]);

    const [prayerJournal, setPrayerJournal] = useState<PrayerJournal[]>([
        {
            id: '1',
            date: '2024-01-20',
            shootId: 'wedding-001',
            clientId: 'sarah-johnson',
            prayer: 'Pray for perfect weather and God\'s presence during the wedding',
            answer: 'Beautiful sunny day, couple was radiant with joy',
            scripture: 'Psalm 19:1 - "The heavens declare the glory of God"',
            mood: 'Grateful'
        },
        {
            id: '2',
            date: '2024-01-21',
            clientId: 'michael-chen',
            prayer: 'Pray for patience and creativity during family session with toddlers',
            scripture: 'Philippians 4:13 - "I can do all things through Christ"',
            mood: 'Hopeful'
        }
    ]);

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Mobile Ministry';
        } else if (encouragementMode) {
            return 'Mobile Enhancements';
        }
        return 'Mobile Tools';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Work anywhere with Kingdom purpose';
        } else if (encouragementMode) {
            return 'Enhanced mobile workflow';
        }
        return 'Mobile-first photography tools';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Downloaded':
                return theme.colors.success;
            case 'Downloading':
                return theme.colors.warning;
            case 'Available':
                return theme.colors.info;
            default:
                return theme.colors.textSecondary;
        }
    };

    const getMoodColor = (mood: string) => {
        switch (mood) {
            case 'Grateful':
                return theme.colors.success;
            case 'Hopeful':
                return theme.colors.primary;
            case 'Challenged':
                return theme.colors.warning;
            case 'Joyful':
                return theme.colors.info;
            default:
                return theme.colors.textSecondary;
        }
    };

    const renderOfflineGalleryCard = ({ item }: { item: OfflineGallery }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={[styles.statusText, { color: theme.colors.surface }]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                👤 {item.clientName}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📅 Downloaded: {item.downloadDate}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📊 {item.imageCount} images • {item.size}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                👁️ Last viewed: {item.lastViewed}
            </Text>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('View Gallery', `Opening ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Gallery
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Share Gallery', `Sharing ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Share Gallery
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderQuickEditCard = ({ item }: { item: QuickEdit }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.imageName}
                </Text>
                <View style={[styles.presetBadge, { backgroundColor: theme.colors.info }]}>
                    <Text style={[styles.presetText, { color: theme.colors.surface }]}>
                        {item.preset}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📅 Created: {item.createdAt}
            </Text>

            <View style={styles.editsContainer}>
                <Text style={[styles.editsTitle, { color: theme.colors.text }]}>
                    ✏️ Edits Applied:
                </Text>
                {item.edits.map((edit, index) => (
                    <Text key={index} style={[styles.editItem, { color: theme.colors.textSecondary }]}>
                        • {edit.description}
                    </Text>
                ))}
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('View Edit', `Opening ${item.imageName}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Edit
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Apply to Others', `Applying ${item.preset} to other images...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Apply to Others
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderVoiceNoteCard = ({ item }: { item: VoiceNote }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.title}
                </Text>
                <Text style={[styles.durationText, { color: theme.colors.primary }]}>
                    ⏱️ {item.duration}
                </Text>
            </View>

            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📅 {item.createdAt}
            </Text>
            {item.shootId && (
                <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                    📸 Shoot: {item.shootId}
                </Text>
            )}
            {item.clientId && (
                <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                    👤 Client: {item.clientId}
                </Text>
            )}

            {item.notes && (
                <Text style={[styles.cardNotes, { color: theme.colors.textSecondary }]}>
                    📝 {item.notes}
                </Text>
            )}

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('Play Note', `Playing ${item.title}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Play Note
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Share Note', `Sharing ${item.title}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Share Note
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPrayerCard = ({ item }: { item: PrayerJournal }) => (
        <View style={[styles.card, { backgroundColor: faithTheme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: faithTheme.colors.text }]}>
                    {item.date}
                </Text>
                <View style={[styles.moodBadge, { backgroundColor: getMoodColor(item.mood) }]}>
                    <Text style={[styles.moodText, { color: faithTheme.colors.surface }]}>
                        {item.mood}
                    </Text>
                </View>
            </View>

            {item.shootId && (
                <Text style={[styles.cardInfo, { color: faithTheme.colors.textSecondary }]}>
                    📸 Shoot: {item.shootId}
                </Text>
            )}
            {item.clientId && (
                <Text style={[styles.cardInfo, { color: faithTheme.colors.textSecondary }]}>
                    👤 Client: {item.clientId}
                </Text>
            )}

            <View style={styles.prayerContainer}>
                <Text style={[styles.prayerTitle, { color: faithTheme.colors.primary }]}>
                    🙏 Prayer:
                </Text>
                <Text style={[styles.prayerText, { color: faithTheme.colors.textSecondary }]}>
                    {item.prayer}
                </Text>
            </View>

            {item.answer && (
                <View style={styles.answerContainer}>
                    <Text style={[styles.answerTitle, { color: faithTheme.colors.success }]}>
                        ✨ Answer:
                    </Text>
                    <Text style={[styles.answerText, { color: faithTheme.colors.textSecondary }]}>
                        {item.answer}
                    </Text>
                </View>
            )}

            <Text style={[styles.scriptureText, { color: faithTheme.colors.primary }]}>
                📖 {item.scripture}
            </Text>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: faithTheme.colors.primary }]}
                    onPress={() => Alert.alert('Edit Prayer', `Editing prayer for ${item.date}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: faithTheme.colors.surface }]}>
                        Edit Prayer
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: faithTheme.colors.success }]}
                    onPress={() => Alert.alert('Share Testimony', `Sharing testimony for ${item.date}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: faithTheme.colors.surface }]}>
                        Share Testimony
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'offline':
                return (
                    <View style={styles.offlineContainer}>
                        <View style={styles.settingsContainer}>
                            <View style={styles.settingRow}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                                    Offline Mode
                                </Text>
                                <Switch
                                    value={offlineMode}
                                    onValueChange={setOfflineMode}
                                    trackColor={{ false: '#767577', true: theme.colors.primary }}
                                    thumbColor={offlineMode ? theme.colors.surface : '#f4f3f4'}
                                />
                            </View>
                            <View style={styles.settingRow}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                                    Auto Download
                                </Text>
                                <Switch
                                    value={autoDownload}
                                    onValueChange={setAutoDownload}
                                    trackColor={{ false: '#767577', true: theme.colors.primary }}
                                    thumbColor={autoDownload ? theme.colors.surface : '#f4f3f4'}
                                />
                            </View>
                        </View>

                        <FlatList
                            data={offlineGalleries}
                            renderItem={renderOfflineGalleryCard}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContainer}
                        />
                    </View>
                );
            case 'editing':
                return (
                    <FlatList
                        data={quickEdits}
                        renderItem={renderQuickEditCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'voice':
                return (
                    <View style={styles.voiceContainer}>
                        <TouchableOpacity
                            style={[styles.recordButton, { backgroundColor: theme.colors.primary }]}
                            onPress={() => setShowVoiceRecorder(true)}
                        >
                            <Text style={[styles.recordButtonText, { color: theme.colors.surface }]}>
                                🎤 Record New Note
                            </Text>
                        </TouchableOpacity>

                        <FlatList
                            data={voiceNotes}
                            renderItem={renderVoiceNoteCard}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContainer}
                        />
                    </View>
                );
            case 'prayer':
                return faithMode ? (
                    <View style={styles.prayerContainer}>
                        <TouchableOpacity
                            style={[styles.prayerButton, { backgroundColor: faithTheme.colors.primary }]}
                            onPress={() => setShowPrayerModal(true)}
                        >
                            <Text style={[styles.prayerButtonText, { color: faithTheme.colors.surface }]}>
                                ✨ Add Prayer Entry
                            </Text>
                        </TouchableOpacity>

                        <FlatList
                            data={prayerJournal}
                            renderItem={renderPrayerCard}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContainer}
                        />
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                            Prayer journal is available in Faith Mode
                        </Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    {getScreenTitle()}
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    {getScreenSubtitle()}
                </Text>
            </View>

            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'offline' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('offline')}
                    >
                        <Text style={[styles.tabText, activeTab === 'offline' && { color: theme.colors.surface }]}>
                            📱 Offline
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'editing' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('editing')}
                    >
                        <Text style={[styles.tabText, activeTab === 'editing' && { color: theme.colors.surface }]}>
                            ✏️ Quick Edit
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'voice' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('voice')}
                    >
                        <Text style={[styles.tabText, activeTab === 'voice' && { color: theme.colors.surface }]}>
                            🎤 Voice Notes
                        </Text>
                    </TouchableOpacity>
                    {faithMode && (
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'prayer' && { backgroundColor: faithTheme.colors.primary }]}
                            onPress={() => setActiveTab('prayer')}
                        >
                            <Text style={[styles.tabText, activeTab === 'prayer' && { color: faithTheme.colors.surface }]}>
                                🙏 Prayer Journal
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

            <View style={styles.content}>
                {renderTabContent()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
    },
    tabContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    cardInfo: {
        fontSize: 14,
        marginBottom: 5,
    },
    cardNotes: {
        fontSize: 13,
        fontStyle: 'italic',
        marginBottom: 15,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    presetBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    presetText: {
        fontSize: 12,
        fontWeight: '600',
    },
    durationText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    editsContainer: {
        marginBottom: 15,
    },
    editsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    editItem: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    prayerContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
    },
    prayerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    prayerText: {
        fontSize: 13,
        lineHeight: 18,
    },
    answerContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: 8,
    },
    answerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    answerText: {
        fontSize: 13,
        lineHeight: 18,
    },
    scriptureText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    moodBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    moodText: {
        fontSize: 12,
        fontWeight: '600',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    offlineContainer: {
        flex: 1,
    },
    settingsContainer: {
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    voiceContainer: {
        flex: 1,
    },
    recordButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    recordButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    prayerContainer: {
        flex: 1,
    },
    prayerButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    prayerButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyStateText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
}); 