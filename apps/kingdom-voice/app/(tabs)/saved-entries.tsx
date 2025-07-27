import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    FlatList,
    Alert,
    Modal,
    Animated,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from '@/contexts/FaithModeContext';
import { router } from 'expo-router';

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
    isPinned?: boolean;
    entryType?: 'journal' | 'dream' | 'devotion';
}

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

const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Journal', value: 'journal' },
    { label: 'Dreams', value: 'dream' },
    { label: 'Devotions', value: 'devotion' },
];

const encouragementQuotes = [
    "Revisit what God already said.",
    "Your story is worth remembering.",
    "Every entry is a step toward healing.",
    "God's faithfulness is written in your words.",
    "Your journey is being documented for His glory.",
];

export default function SavedEntriesScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { isFaithMode, isEncouragementMode, FaithModeOverlay, EncouragementOverlay } = useFaithMode();

    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [showEntryModal, setShowEntryModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');

    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const slideAnimation = useRef(new Animated.Value(50)).current;

    // Load entries on mount
    useEffect(() => {
        loadEntries();
    }, []);

    // Filter entries when search or filter changes
    useEffect(() => {
        filterEntries();
    }, [entries, searchQuery, selectedFilter]);

    // Animate on load
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const loadEntries = async () => {
        try {
            setIsLoading(true);
            const entriesKey = 'journal_entries';
            const storedEntries = await AsyncStorage.getItem(entriesKey);

            if (storedEntries) {
                const parsedEntries: JournalEntry[] = JSON.parse(storedEntries);
                // Sort by date (newest first) and separate pinned entries
                const sortedEntries = parsedEntries
                    .filter(entry => !entry.isDraft)
                    .sort((a, b) => {
                        // Pinned entries first
                        if (a.isPinned && !b.isPinned) return -1;
                        if (!a.isPinned && b.isPinned) return 1;
                        // Then by date
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });

                setEntries(sortedEntries);
            }
        } catch (error) {
            console.error('Error loading entries:', error);
            Alert.alert('Error', 'Failed to load saved entries.');
        } finally {
            setIsLoading(false);
        }
    };

    const filterEntries = () => {
        let filtered = entries;

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(entry =>
                entry.title.toLowerCase().includes(query) ||
                entry.content.toLowerCase().includes(query) ||
                entry.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Apply type filter
        if (selectedFilter !== 'all') {
            filtered = filtered.filter(entry => {
                if (selectedFilter === 'dream') {
                    return entry.tags.includes('Dreams') || entry.title.toLowerCase().includes('dream');
                }
                if (selectedFilter === 'devotion') {
                    return entry.tags.includes('Prayer') || entry.faithMode || entry.verse;
                }
                if (selectedFilter === 'journal') {
                    return !entry.tags.includes('Dreams') && !entry.faithMode && !entry.verse;
                }
                return true;
            });
        }

        setFilteredEntries(filtered);
    };

    const getMoodEmoji = (mood: string) => {
        const moodOption = moodOptions.find(m => m.value === mood);
        return moodOption ? moodOption.emoji : '📝';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const togglePinEntry = async (entryId: string) => {
        try {
            const updatedEntries = entries.map(entry =>
                entry.id === entryId
                    ? { ...entry, isPinned: !entry.isPinned }
                    : entry
            );

            setEntries(updatedEntries);
            await AsyncStorage.setItem('journal_entries', JSON.stringify(updatedEntries));

            Alert.alert(
                'Entry Updated',
                'Entry pin status has been updated.'
            );
        } catch (error) {
            console.error('Error updating entry:', error);
            Alert.alert('Error', 'Failed to update entry.');
        }
    };

    const deleteEntry = async (entryId: string) => {
        Alert.alert(
            'Delete Entry',
            'Are you sure you want to delete this entry? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const updatedEntries = entries.filter(entry => entry.id !== entryId);
                            setEntries(updatedEntries);
                            await AsyncStorage.setItem('journal_entries', JSON.stringify(updatedEntries));

                            Alert.alert('Entry Deleted', 'The entry has been permanently deleted.');
                        } catch (error) {
                            console.error('Error deleting entry:', error);
                            Alert.alert('Error', 'Failed to delete entry.');
                        }
                    }
                }
            ]
        );
    };

    const editEntry = (entry: JournalEntry) => {
        // Navigate to new entry screen with entry data
        router.push({
            pathname: '/(tabs)/new-entry',
            params: { editEntry: JSON.stringify(entry) }
        });
    };

    const renderEntryCard = ({ item }: { item: JournalEntry }) => (
        <Animated.View
            style={[
                styles.entryCard,
                {
                    backgroundColor: colors.cream,
                    borderColor: item.faithMode ? colors.softGold : colors.skyBlue,
                    borderWidth: item.faithMode ? 2 : 1,
                    opacity: fadeAnimation,
                    transform: [{ translateY: slideAnimation }]
                }
            ]}
        >
            {/* Pin indicator */}
            {item.isPinned && (
                <View style={[styles.pinIndicator, { backgroundColor: colors.softGold }]}>
                    <Text style={[styles.pinText, { color: colors.cream }]}>📌</Text>
                </View>
            )}

            {/* Faith mode watermark */}
            {item.faithMode && (
                <View style={[styles.faithWatermark, { opacity: 0.1 }]}>
                    <Text style={[styles.faithWatermarkText, { color: colors.softGold }]}>✝️</Text>
                </View>
            )}

            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.entryTitle, { color: colors.charcoalInk }]} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={[styles.entryDate, { color: colors.charcoalInk + '80' }]}>
                        {formatDate(item.date)}
                    </Text>
                </View>

                <View style={styles.moodContainer}>
                    <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
                    {item.faithMode && (
                        <View style={[styles.faithBadge, { backgroundColor: colors.softGold }]}>
                            <Text style={[styles.faithBadgeText, { color: colors.cream }]}>✝️</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Content preview */}
            <Text style={[styles.contentPreview, { color: colors.charcoalInk + 'CC' }]} numberOfLines={3}>
                {item.content}
            </Text>

            {/* Tags */}
            {item.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    {item.tags.slice(0, 3).map((tag, index) => (
                        <View key={index} style={[styles.tagChip, { backgroundColor: colors.skyBlue }]}>
                            <Text style={[styles.tagText, { color: colors.charcoalInk }]}>{tag}</Text>
                        </View>
                    ))}
                    {item.tags.length > 3 && (
                        <Text style={[styles.moreTagsText, { color: colors.charcoalInk + '80' }]}>
                            +{item.tags.length - 3} more
                        </Text>
                    )}
                </View>
            )}

            {/* Verse preview */}
            {item.verse && (
                <View style={[styles.verseContainer, { backgroundColor: colors.softGold + '20' }]}>
                    <Text style={[styles.verseText, { color: colors.charcoalInk }]} numberOfLines={2}>
                        "{item.verse}"
                    </Text>
                </View>
            )}

            {/* Action buttons */}
            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.skyBlue }]}
                    onPress={() => setSelectedEntry(item)}
                >
                    <Text style={[styles.actionButtonText, { color: colors.charcoalInk }]}>👁️ View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.softGold }]}
                    onPress={() => editEntry(item)}
                >
                    <Text style={[styles.actionButtonText, { color: colors.cream }]}>✏️ Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.softGold + '40' }]}
                    onPress={() => togglePinEntry(item.id)}
                >
                    <Text style={[styles.actionButtonText, { color: colors.charcoalInk }]}>
                        {item.isPinned ? '📌 Unpin' : '📌 Pin'}
                    </Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );

    const renderEntryModal = () => (
        <Modal
            visible={showEntryModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowEntryModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    {selectedEntry && (
                        <>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>
                                    {selectedEntry.title}
                                </Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setShowEntryModal(false)}
                                >
                                    <Text style={[styles.closeButtonText, { color: colors.charcoalInk }]}>×</Text>
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.modalBody}>
                                <View style={styles.modalMeta}>
                                    <Text style={[styles.modalDate, { color: colors.charcoalInk + '80' }]}>
                                        {formatDate(selectedEntry.date)}
                                    </Text>
                                    <Text style={styles.modalMood}>{getMoodEmoji(selectedEntry.mood)}</Text>
                                    {selectedEntry.faithMode && (
                                        <View style={[styles.modalFaithBadge, { backgroundColor: colors.softGold }]}>
                                            <Text style={[styles.modalFaithBadgeText, { color: colors.cream }]}>Faith Mode</Text>
                                        </View>
                                    )}
                                </View>

                                <Text style={[styles.modalContent, { color: colors.charcoalInk }]}>
                                    {selectedEntry.content}
                                </Text>

                                {selectedEntry.verse && (
                                    <View style={[styles.modalVerse, { backgroundColor: colors.softGold + '20' }]}>
                                        <Text style={[styles.modalVerseText, { color: colors.charcoalInk }]}>
                                            "{selectedEntry.verse}"
                                        </Text>
                                    </View>
                                )}

                                {selectedEntry.tags.length > 0 && (
                                    <View style={styles.modalTags}>
                                        <Text style={[styles.modalTagsTitle, { color: colors.text }]}>Tags:</Text>
                                        <View style={styles.modalTagsContainer}>
                                            {selectedEntry.tags.map((tag, index) => (
                                                <View key={index} style={[styles.modalTagChip, { backgroundColor: colors.skyBlue }]}>
                                                    <Text style={[styles.modalTagText, { color: colors.charcoalInk }]}>{tag}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </ScrollView>

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.modalActionButton, { backgroundColor: colors.softGold }]}
                                    onPress={() => {
                                        setShowEntryModal(false);
                                        editEntry(selectedEntry);
                                    }}
                                >
                                    <Text style={[styles.modalActionButtonText, { color: colors.cream }]}>Edit Entry</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalActionButton, { backgroundColor: colors.skyBlue }]}
                                    onPress={() => {
                                        setShowEntryModal(false);
                                        togglePinEntry(selectedEntry.id);
                                    }}
                                >
                                    <Text style={[styles.modalActionButtonText, { color: colors.charcoalInk }]}>
                                        {selectedEntry.isPinned ? 'Unpin' : 'Pin Entry'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalActionButton, { backgroundColor: '#FF6B6B' }]}
                                    onPress={() => {
                                        setShowEntryModal(false);
                                        deleteEntry(selectedEntry.id);
                                    }}
                                >
                                    <Text style={[styles.modalActionButtonText, { color: colors.cream }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    {isFaithMode ? '✝️ Saved Entries' : 'Saved Entries'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.charcoalInk }]}>
                    {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
                </Text>
            </View>

            {/* Encouragement Message */}
            {isEncouragementMode && (
                <View style={[styles.encouragementCard, { backgroundColor: colors.warmBeige }]}>
                    <Text style={[styles.encouragementTitle, { color: colors.charcoalInk }]}>
                        💝 Daily Truth
                    </Text>
                    <Text style={[styles.encouragementText, { color: colors.charcoalInk }]}>
                        {encouragementQuotes[Math.floor(Math.random() * encouragementQuotes.length)]}
                    </Text>
                </View>
            )}

            {/* Search and Filter Bar */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.cream }]}>
                    <Text style={[styles.searchIcon, { color: colors.charcoalInk }]}>🔍</Text>
                    <TextInput
                        style={[styles.searchInput, { color: colors.charcoalInk }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search entries..."
                        placeholderTextColor={colors.charcoalInk + '80'}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.viewModeButton, { backgroundColor: colors.skyBlue }]}
                    onPress={() => setViewMode(viewMode === 'list' ? 'cards' : 'list')}
                >
                    <Text style={[styles.viewModeButtonText, { color: colors.charcoalInk }]}>
                        {viewMode === 'list' ? '📱 Cards' : '📋 List'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
            >
                {filterOptions.map((filter) => (
                    <TouchableOpacity
                        key={filter.value}
                        style={[
                            styles.filterTab,
                            {
                                backgroundColor: selectedFilter === filter.value ? colors.softGold : colors.cream,
                                borderColor: colors.softGold
                            }
                        ]}
                        onPress={() => setSelectedFilter(filter.value)}
                    >
                        <Text style={[
                            styles.filterTabText,
                            { color: selectedFilter === filter.value ? colors.cream : colors.charcoalInk }
                        ]}>
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Entries List */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text style={[styles.loadingText, { color: colors.charcoalInk }]}>
                        Loading your entries...
                    </Text>
                </View>
            ) : filteredEntries.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyIcon, { color: colors.charcoalInk + '40' }]}>📝</Text>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>
                        No entries found
                    </Text>
                    <Text style={[styles.emptyText, { color: colors.charcoalInk }]}>
                        {searchQuery || selectedFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Create your first journal entry to get started'
                        }
                    </Text>
                    {!searchQuery && selectedFilter === 'all' && (
                        <TouchableOpacity
                            style={[styles.createButton, { backgroundColor: colors.softGold }]}
                            onPress={() => router.push('/(tabs)/new-entry')}
                        >
                            <Text style={[styles.createButtonText, { color: colors.cream }]}>
                                Create First Entry
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <FlatList
                    data={filteredEntries}
                    renderItem={renderEntryCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.entriesList}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}

            {/* Entry Detail Modal */}
            {renderEntryModal()}

            {/* Faith Mode Overlay */}
            {FaithModeOverlay}
            {EncouragementOverlay}
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
        marginBottom: 4,
        fontFamily: 'Playfair Display',
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.8,
        fontFamily: 'Raleway',
    },
    encouragementCard: {
        margin: 20,
        marginTop: 0,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    encouragementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Playfair Display',
    },
    encouragementText: {
        fontSize: 14,
        fontStyle: 'italic',
        fontFamily: 'Raleway',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Raleway',
    },
    viewModeButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    viewModeButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    filterContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    filterTabText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        fontFamily: 'Raleway',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        fontFamily: 'Raleway',
    },
    createButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    entriesList: {
        padding: 20,
        paddingTop: 0,
    },
    separator: {
        height: 16,
    },
    entryCard: {
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        position: 'relative',
    },
    pinIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinText: {
        fontSize: 12,
    },
    faithWatermark: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -20 }, { translateY: -20 }],
    },
    faithWatermarkText: {
        fontSize: 40,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    titleContainer: {
        flex: 1,
        marginRight: 12,
    },
    entryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Playfair Display',
    },
    entryDate: {
        fontSize: 12,
        fontFamily: 'Raleway',
    },
    moodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    moodEmoji: {
        fontSize: 20,
    },
    faithBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    faithBadgeText: {
        fontSize: 10,
    },
    contentPreview: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
        fontFamily: 'Raleway',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 12,
        gap: 6,
    },
    tagChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Raleway',
    },
    moreTagsText: {
        fontSize: 10,
        fontFamily: 'Raleway',
    },
    verseContainer: {
        padding: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    verseText: {
        fontSize: 12,
        fontStyle: 'italic',
        fontFamily: 'Raleway',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 12,
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
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        fontFamily: 'Playfair Display',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    modalBody: {
        padding: 20,
    },
    modalMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    modalDate: {
        fontSize: 14,
        fontFamily: 'Raleway',
    },
    modalMood: {
        fontSize: 20,
    },
    modalFaithBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    modalFaithBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Raleway',
    },
    modalContent: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
        fontFamily: 'Raleway',
    },
    modalVerse: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    modalVerseText: {
        fontSize: 14,
        fontStyle: 'italic',
        fontFamily: 'Raleway',
    },
    modalTags: {
        marginBottom: 16,
    },
    modalTagsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    modalTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    modalTagChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    modalTagText: {
        fontSize: 12,
        fontFamily: 'Raleway',
    },
    modalActions: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
    },
    modalActionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalActionButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
}); 