import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    Animated,
    Alert,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from '@/contexts/FaithModeContext';

interface Dream {
    id: string;
    title: string;
    description: string;
    mood: string;
    symbols: string;
    interpretation?: string;
    holySpiritInterpretation?: string;
    tags: string[];
    date: string;
    isInterpreted: boolean;
    faithMode: boolean;
}

const dreamTags = ['Dream', 'Vision', 'Warning', 'Encouragement'];
const dreamMoods = [
    { emoji: '😴', label: 'Peaceful', value: 'peaceful' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😊', label: 'Joyful', value: 'joyful' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
    { emoji: '🤔', label: 'Confused', value: 'confused' },
    { emoji: '😇', label: 'Blessed', value: 'blessed' },
    { emoji: '💪', label: 'Empowered', value: 'empowered' },
];

const { width } = Dimensions.get('window');

export default function DreamTrackerScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { isFaithMode, isEncouragementMode, FaithModeOverlay, EncouragementOverlay } = useFaithMode();

    const [dreams, setDreams] = useState<Dream[]>([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    const [newDream, setNewDream] = useState<Partial<Dream>>({
        title: '',
        description: '',
        mood: '',
        symbols: '',
        interpretation: '',
        holySpiritInterpretation: '',
        tags: [],
        faithMode: isFaithMode,
    });

    const moonAnimation = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(1)).current;

    // Load dreams on component mount
    useEffect(() => {
        loadDreams();
    }, []);

    // Moon animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(moonAnimation, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(moonAnimation, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const loadDreams = async () => {
        try {
            const dreamsData = await AsyncStorage.getItem('dreams');
            if (dreamsData) {
                setDreams(JSON.parse(dreamsData));
            }
        } catch (error) {
            console.error('Error loading dreams:', error);
        }
    };

    const saveDream = async () => {
        if (!newDream.title || !newDream.description) {
            Alert.alert('Missing Information', 'Please enter a title and description for your dream.');
            return;
        }

        try {
            const dream: Dream = {
                id: Date.now().toString(),
                title: newDream.title,
                description: newDream.description,
                mood: newDream.mood || '',
                symbols: newDream.symbols || '',
                interpretation: newDream.interpretation,
                holySpiritInterpretation: newDream.holySpiritInterpretation,
                tags: newDream.tags || [],
                date: new Date().toISOString(),
                isInterpreted: false,
                faithMode: isFaithMode,
            };

            const updatedDreams = [dream, ...dreams];
            await AsyncStorage.setItem('dreams', JSON.stringify(updatedDreams));
            setDreams(updatedDreams);

            // Reset form
            setNewDream({
                title: '',
                description: '',
                mood: '',
                symbols: '',
                interpretation: '',
                holySpiritInterpretation: '',
                tags: [],
                faithMode: isFaithMode,
            });

            setIsAddModalVisible(false);
            Alert.alert('Dream Saved', 'Your dream has been recorded successfully!');
        } catch (error) {
            console.error('Error saving dream:', error);
            Alert.alert('Error', 'Failed to save dream. Please try again.');
        }
    };

    const toggleTag = (tag: string) => {
        setNewDream(prev => ({
            ...prev,
            tags: prev.tags?.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...(prev.tags || []), tag]
        }));
    };

    const selectMood = (mood: string) => {
        setNewDream(prev => ({ ...prev, mood }));
    };

    const openDreamDetail = (dream: Dream) => {
        setSelectedDream(dream);
        setIsDetailModalVisible(true);
    };

    const toggleInterpretation = async (dreamId: string) => {
        const updatedDreams = dreams.map(dream =>
            dream.id === dreamId
                ? { ...dream, isInterpreted: !dream.isInterpreted }
                : dream
        );
        setDreams(updatedDreams);
        await AsyncStorage.setItem('dreams', JSON.stringify(updatedDreams));
    };

    const renderDreamCard = (dream: Dream) => (
        <TouchableOpacity
            key={dream.id}
            style={[styles.dreamCard, {
                backgroundColor: colors.cream,
                borderColor: dream.isInterpreted ? colors.softGold : colors.skyBlue
            }]}
            onPress={() => openDreamDetail(dream)}
            onPressIn={() => {
                Animated.timing(cardScale, {
                    toValue: 0.95,
                    duration: 100,
                    useNativeDriver: true,
                }).start();
            }}
            onPressOut={() => {
                Animated.timing(cardScale, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }).start();
            }}
        >
            <View style={styles.dreamCardHeader}>
                <Animated.Text
                    style={[
                        styles.moonIcon,
                        {
                            transform: [{
                                translateY: moonAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -5]
                                })
                            }]
                        }
                    ]}
                >
                    🌙
                </Animated.Text>
                <View style={styles.dreamCardInfo}>
                    <Text style={[styles.dreamTitle, { color: colors.charcoalInk }]}>
                        {dream.title}
                    </Text>
                    <Text style={[styles.dreamDate, { color: colors.charcoalInk }]}>
                        {new Date(dream.date).toLocaleDateString()}
                    </Text>
                </View>
                {dream.isInterpreted && (
                    <View style={[styles.interpretedBadge, { backgroundColor: colors.softGold }]}>
                        <Text style={[styles.interpretedBadgeText, { color: colors.cream }]}>
                            ✨ Interpreted
                        </Text>
                    </View>
                )}
            </View>

            <Text style={[styles.dreamPreview, { color: colors.charcoalInk }]}>
                {dream.description.substring(0, 100)}...
            </Text>

            {dream.mood && (
                <View style={styles.dreamMood}>
                    <Text style={styles.moodEmoji}>
                        {dreamMoods.find(m => m.value === dream.mood)?.emoji || '😴'}
                    </Text>
                </View>
            )}

            {dream.tags.length > 0 && (
                <View style={styles.dreamTags}>
                    {dream.tags.map(tag => (
                        <View key={tag} style={[styles.tagChip, { backgroundColor: colors.skyBlue }]}>
                            <Text style={[styles.tagChipText, { color: colors.charcoalInk }]}>
                                {tag}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {isFaithMode ? '✝️ Dream Tracker' : 'Dream Tracker'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.charcoalInk }]}>
                        Record and reflect on your dreams
                    </Text>
                </View>

                {/* Add Dream Button */}
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.softGold }]}
                    onPress={() => setIsAddModalVisible(true)}
                >
                    <Text style={[styles.addButtonText, { color: colors.cream }]}>
                        🌙 Add New Dream
                    </Text>
                </TouchableOpacity>

                {/* Dream Stats */}
                <View style={[styles.statsCard, { backgroundColor: colors.warmBeige }]}>
                    <Text style={[styles.statsTitle, { color: colors.charcoalInk }]}>
                        📊 Dream Insights
                    </Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: colors.charcoalInk }]}>
                                {dreams.length}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.charcoalInk }]}>
                                Dreams Recorded
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: colors.charcoalInk }]}>
                                {dreams.filter(d => d.isInterpreted).length}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.charcoalInk }]}>
                                Interpreted
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: colors.charcoalInk }]}>
                                {dreams.filter(d => d.faithMode).length}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.charcoalInk }]}>
                                Faith Dreams
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Dreams List */}
                <View style={styles.dreamsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Recent Dreams
                    </Text>

                    {dreams.length === 0 ? (
                        <View style={[styles.emptyState, { backgroundColor: colors.cream }]}>
                            <Text style={[styles.emptyStateIcon, { color: colors.charcoalInk }]}>
                                🌙
                            </Text>
                            <Text style={[styles.emptyStateTitle, { color: colors.charcoalInk }]}>
                                No Dreams Yet
                            </Text>
                            <Text style={[styles.emptyStateText, { color: colors.charcoalInk }]}>
                                Start recording your dreams to see them here
                            </Text>
                        </View>
                    ) : (
                        dreams.map(renderDreamCard)
                    )}
                </View>

                {/* Encouragement Message */}
                {isEncouragementMode && (
                    <View style={[styles.encouragementCard, { backgroundColor: colors.softPink }]}>
                        <Text style={[styles.encouragementTitle, { color: colors.charcoalInk }]}>
                            🌙 Write it down. Even if it's unclear now.
                        </Text>
                        <Text style={[styles.encouragementText, { color: colors.charcoalInk }]}>
                            Every dream is a message from your subconscious. Pay attention to the whispers of your soul.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Add Dream Modal */}
            <Modal
                visible={isAddModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsAddModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            Record Your Dream
                        </Text>

                        <ScrollView style={styles.modalScrollView}>
                            <TextInput
                                style={[styles.modalInput, {
                                    backgroundColor: colors.cream,
                                    color: colors.charcoalInk,
                                    borderColor: colors.softGold
                                }]}
                                placeholder="Dream title..."
                                value={newDream.title}
                                onChangeText={(text) => setNewDream({ ...newDream, title: text })}
                            />

                            <TextInput
                                style={[styles.modalTextArea, {
                                    backgroundColor: colors.cream,
                                    color: colors.charcoalInk,
                                    borderColor: colors.softGold
                                }]}
                                placeholder="Describe your dream in detail..."
                                value={newDream.description}
                                onChangeText={(text) => setNewDream({ ...newDream, description: text })}
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={[styles.inputLabel, { color: colors.text }]}>Mood After Waking</Text>
                            <View style={styles.moodContainer}>
                                {dreamMoods.map((mood) => (
                                    <TouchableOpacity
                                        key={mood.value}
                                        style={[
                                            styles.moodButton,
                                            {
                                                backgroundColor: newDream.mood === mood.value ? colors.softGold : colors.cream,
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

                            <TextInput
                                style={[styles.modalInput, {
                                    backgroundColor: colors.cream,
                                    color: colors.charcoalInk,
                                    borderColor: colors.softGold
                                }]}
                                placeholder="Symbols or highlights..."
                                value={newDream.symbols}
                                onChangeText={(text) => setNewDream({ ...newDream, symbols: text })}
                            />

                            <Text style={[styles.inputLabel, { color: colors.text }]}>Tags</Text>
                            <View style={styles.tagsContainer}>
                                {dreamTags.map((tag) => (
                                    <TouchableOpacity
                                        key={tag}
                                        style={[
                                            styles.tagButton,
                                            {
                                                backgroundColor: newDream.tags?.includes(tag) ? colors.softGold : colors.skyBlue,
                                                borderColor: colors.softGold
                                            }
                                        ]}
                                        onPress={() => toggleTag(tag)}
                                    >
                                        <Text style={[
                                            styles.tagText,
                                            { color: newDream.tags?.includes(tag) ? colors.cream : colors.charcoalInk }
                                        ]}>
                                            {tag}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TextInput
                                style={[styles.modalTextArea, {
                                    backgroundColor: colors.cream,
                                    color: colors.charcoalInk,
                                    borderColor: colors.softGold
                                }]}
                                placeholder="Your interpretation (optional)..."
                                value={newDream.interpretation}
                                onChangeText={(text) => setNewDream({ ...newDream, interpretation: text })}
                                multiline
                                textAlignVertical="top"
                            />

                            {isFaithMode && (
                                <>
                                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                                        ✝️ Holy Spirit Interpretation
                                    </Text>
                                    <TextInput
                                        style={[styles.modalTextArea, {
                                            backgroundColor: colors.cream,
                                            color: colors.charcoalInk,
                                            borderColor: colors.softGold
                                        }]}
                                        placeholder="What do you sense the Holy Spirit is revealing..."
                                        value={newDream.holySpiritInterpretation}
                                        onChangeText={(text) => setNewDream({ ...newDream, holySpiritInterpretation: text })}
                                        multiline
                                        textAlignVertical="top"
                                    />
                                </>
                            )}
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.skyBlue }]}
                                onPress={() => setIsAddModalVisible(false)}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.charcoalInk }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.softGold }]}
                                onPress={saveDream}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.cream }]}>
                                    Save Dream
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Dream Detail Modal */}
            <Modal
                visible={isDetailModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsDetailModalVisible(false)}
            >
                {selectedDream && (
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {selectedDream.title}
                            </Text>

                            <ScrollView style={styles.modalScrollView}>
                                <Text style={[styles.detailDate, { color: colors.charcoalInk }]}>
                                    {new Date(selectedDream.date).toLocaleDateString()}
                                </Text>

                                <Text style={[styles.detailSectionTitle, { color: colors.text }]}>
                                    Description
                                </Text>
                                <Text style={[styles.detailText, { color: colors.charcoalInk }]}>
                                    {selectedDream.description}
                                </Text>

                                {selectedDream.symbols && (
                                    <>
                                        <Text style={[styles.detailSectionTitle, { color: colors.text }]}>
                                            Symbols & Highlights
                                        </Text>
                                        <Text style={[styles.detailText, { color: colors.charcoalInk }]}>
                                            {selectedDream.symbols}
                                        </Text>
                                    </>
                                )}

                                {selectedDream.interpretation && (
                                    <>
                                        <Text style={[styles.detailSectionTitle, { color: colors.text }]}>
                                            Your Interpretation
                                        </Text>
                                        <Text style={[styles.detailText, { color: colors.charcoalInk }]}>
                                            {selectedDream.interpretation}
                                        </Text>
                                    </>
                                )}

                                {selectedDream.holySpiritInterpretation && (
                                    <>
                                        <Text style={[styles.detailSectionTitle, { color: colors.text }]}>
                                            ✝️ Holy Spirit Interpretation
                                        </Text>
                                        <Text style={[styles.detailText, { color: colors.charcoalInk }]}>
                                            {selectedDream.holySpiritInterpretation}
                                        </Text>
                                    </>
                                )}

                                {selectedDream.tags.length > 0 && (
                                    <>
                                        <Text style={[styles.detailSectionTitle, { color: colors.text }]}>
                                            Tags
                                        </Text>
                                        <View style={styles.detailTags}>
                                            {selectedDream.tags.map(tag => (
                                                <View key={tag} style={[styles.tagChip, { backgroundColor: colors.skyBlue }]}>
                                                    <Text style={[styles.tagChipText, { color: colors.charcoalInk }]}>
                                                        {tag}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </>
                                )}
                            </ScrollView>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: colors.skyBlue }]}
                                    onPress={() => setIsDetailModalVisible(false)}
                                >
                                    <Text style={[styles.modalButtonText, { color: colors.charcoalInk }]}>
                                        Close
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalButton, {
                                        backgroundColor: selectedDream.isInterpreted ? colors.mutedGreen : colors.softGold
                                    }]}
                                    onPress={() => toggleInterpretation(selectedDream.id)}
                                >
                                    <Text style={[styles.modalButtonText, { color: colors.cream }]}>
                                        {selectedDream.isInterpreted ? 'Mark Uninterpreted' : 'Mark Interpreted'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </Modal>

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
    scrollView: {
        flex: 1,
        padding: 20,
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
    addButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    statsCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'Playfair Display',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    statLabel: {
        fontSize: 12,
        opacity: 0.8,
        fontFamily: 'Raleway',
        textAlign: 'center',
    },
    dreamsSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'Playfair Display',
        textDecorationLine: 'underline',
    },
    dreamCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    dreamCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    moonIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    dreamCardInfo: {
        flex: 1,
    },
    dreamTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Playfair Display',
    },
    dreamDate: {
        fontSize: 12,
        opacity: 0.7,
        fontFamily: 'Raleway',
    },
    interpretedBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    interpretedBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Raleway',
    },
    dreamPreview: {
        fontSize: 14,
        opacity: 0.8,
        lineHeight: 20,
        fontFamily: 'Raleway',
        marginBottom: 8,
    },
    dreamMood: {
        marginBottom: 8,
    },
    moodEmoji: {
        fontSize: 16,
    },
    dreamTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    tagChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagChipText: {
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Raleway',
    },
    emptyState: {
        padding: 40,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    emptyStateIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    emptyStateText: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.8,
        fontFamily: 'Raleway',
    },
    encouragementCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
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
    encouragementText: {
        fontSize: 14,
        fontStyle: 'italic',
        lineHeight: 20,
        fontFamily: 'Raleway',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.9,
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
    modalScrollView: {
        maxHeight: 400,
        marginBottom: 20,
    },
    modalInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        fontFamily: 'Raleway',
    },
    modalTextArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        minHeight: 100,
        fontFamily: 'Raleway',
        textAlignVertical: 'top',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    moodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
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
        marginBottom: 16,
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
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    detailDate: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 16,
        fontFamily: 'Raleway',
    },
    detailSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    detailText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
        fontFamily: 'Raleway',
    },
    detailTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginBottom: 16,
    },
}); 