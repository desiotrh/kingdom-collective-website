import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from '@/contexts/FaithModeContext';
import AIReflectModal from '../../../../packages/ui/AIReflectModal';
import { getReflectPrompts } from '../../../../packages/utils/valuesStyle';

interface Devotional {
    id: string;
    title: string;
    scripture?: string;
    body: string;
    prayer: string;
    prompt: string;
    faithMode: boolean;
    date: string;
}

const sampleScriptures = [
    'Psalm 46:10 - "Be still and know that I am God."',
    'Philippians 4:6-7 - "Do not be anxious about anything, but present your requests to God with thanksgiving."',
    'Jeremiah 29:11 - "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you."',
    'Isaiah 41:10 - "Fear not, for I am with you; be not dismayed, for I am your God."',
    'Romans 8:28 - "And we know that in all things God works for the good of those who love him."',
    'Matthew 11:28 - "Come to me, all you who are weary and burdened, and I will give you rest."',
];

export default function DevotionalGeneratorScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { isFaithMode, isEncouragementMode, FaithModeOverlay, EncouragementOverlay } = useFaithMode();

    const [promptType, setPromptType] = useState<'journal' | 'theme'>('journal');
    const [journalEntry, setJournalEntry] = useState('');
    const [customTheme, setCustomTheme] = useState('');
    const [selectedScripture, setSelectedScripture] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentDevotional, setCurrentDevotional] = useState<Devotional | null>(null);
    const [savedDevotionals, setSavedDevotionals] = useState<Devotional[]>([]);
  const [reflectVisible, setReflectVisible] = useState(false);

    // Load saved devotionals on mount
    useEffect(() => {
        loadSavedDevotionals();
    }, []);

    const loadSavedDevotionals = async () => {
        try {
            const saved = await AsyncStorage.getItem('saved_devotionals');
            if (saved) {
                setSavedDevotionals(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading saved devotionals:', error);
        }
    };

    const generateDevotional = async () => {
        const prompt = promptType === 'journal' ? journalEntry : customTheme;

        if (!prompt.trim()) {
            Alert.alert('Missing Input', 'Please enter a journal entry or theme for the devotional.');
            return;
        }

        setReflectVisible(true);
    };

    const doGenerateDevotional = async () => {
        const prompt = promptType === 'journal' ? journalEntry : customTheme;
        setIsGenerating(true);

        try {
            // Mock AI generation - replace with actual AI call
            const devotional = await mockGenerateDevotional(prompt, selectedScripture);
            setCurrentDevotional(devotional);
        } catch (error) {
            console.error('Error generating devotional:', error);
            Alert.alert('Error', 'Failed to generate devotional. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const mockGenerateDevotional = async (prompt: string, scripture?: string): Promise<Devotional> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const themes = [
            'Finding Peace in the Storm',
            'Trusting God\'s Plan',
            'The Power of Gratitude',
            'Walking in Faith',
            'God\'s Unfailing Love',
            'Finding Strength in Weakness',
        ];

        const prayers = [
            'Lord, help me to trust in Your plan and find peace in Your presence. Amen.',
            'Father, give me the strength to walk in faith and the wisdom to see Your hand at work. Amen.',
            'Thank You, Lord, for Your unfailing love and the peace that comes from knowing You. Amen.',
            'God, help me to find gratitude in every circumstance and trust in Your goodness. Amen.',
        ];

        const bodies = [
            `In the midst of ${prompt.toLowerCase().includes('struggle') ? 'your struggles' : 'life\'s challenges'}, remember that God is always with you. His love is constant, His grace is sufficient, and His peace is available to all who seek Him.`,

            `When we ${prompt.toLowerCase().includes('gratitude') ? 'practice gratitude' : 'face difficulties'}, we open our hearts to God\'s blessings. Every moment is an opportunity to see His hand at work in our lives.`,

            `God\'s love for you is unwavering. In every season of life, He remains faithful. Trust in His promises and find rest in His presence.`,
        ];

        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        const randomBody = bodies[Math.floor(Math.random() * bodies.length)];
        const randomPrayer = prayers[Math.floor(Math.random() * prayers.length)];

        return {
            id: Date.now().toString(),
            title: randomTheme,
            scripture: scripture || sampleScriptures[Math.floor(Math.random() * sampleScriptures.length)],
            body: randomBody,
            prayer: randomPrayer,
            prompt: prompt,
            faithMode: isFaithMode,
            date: new Date().toISOString(),
        };
    };

    const saveDevotional = async () => {
        if (!currentDevotional) return;

        try {
            const updatedDevotionals = [currentDevotional, ...savedDevotionals];
            await AsyncStorage.setItem('saved_devotionals', JSON.stringify(updatedDevotionals));
            setSavedDevotionals(updatedDevotionals);
            Alert.alert('Saved', 'Devotional has been saved to your library!');
        } catch (error) {
            console.error('Error saving devotional:', error);
            Alert.alert('Error', 'Failed to save devotional. Please try again.');
        }
    };

    const copyDevotional = async () => {
        if (!currentDevotional) return;

        const devotionalText = `${currentDevotional.title}\n\n${currentDevotional.scripture ? `${currentDevotional.scripture}\n\n` : ''}${currentDevotional.body}\n\nPrayer:\n${currentDevotional.prayer}`;

        try {
            await Share.share({
                message: devotionalText,
                title: currentDevotional.title,
            });
        } catch (error) {
            console.error('Error sharing devotional:', error);
        }
    };

    const regenerateDevotional = () => {
        if (promptType === 'journal' && !journalEntry.trim()) {
            Alert.alert('Missing Input', 'Please enter a journal entry to regenerate the devotional.');
            return;
        }
        if (promptType === 'theme' && !customTheme.trim()) {
            Alert.alert('Missing Input', 'Please enter a theme to regenerate the devotional.');
            return;
        }
        generateDevotional();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {isFaithMode ? '✝️ Devotional Generator' : 'Devotional Generator'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.charcoalInk }]}>
                        Transform your thoughts into meaningful devotionals
                    </Text>
                </View>

                {/* Input Section */}
                <View style={[styles.inputCard, { backgroundColor: colors.cream }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Generate Devotional
                    </Text>

                    {/* Prompt Type Selector */}
                    <View style={styles.promptTypeContainer}>
                        <TouchableOpacity
                            style={[
                                styles.promptTypeButton,
                                {
                                    backgroundColor: promptType === 'journal' ? colors.softGold : colors.skyBlue,
                                    borderColor: colors.softGold
                                }
                            ]}
                            onPress={() => setPromptType('journal')}
                        >
                            <Text style={[
                                styles.promptTypeText,
                                { color: promptType === 'journal' ? colors.cream : colors.charcoalInk }
                            ]}>
                                📖 Use Journal Entry
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.promptTypeButton,
                                {
                                    backgroundColor: promptType === 'theme' ? colors.softGold : colors.skyBlue,
                                    borderColor: colors.softGold
                                }
                            ]}
                            onPress={() => setPromptType('theme')}
                        >
                            <Text style={[
                                styles.promptTypeText,
                                { color: promptType === 'theme' ? colors.cream : colors.charcoalInk }
                            ]}>
                                ✍️ Write My Own Theme
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Input Field */}
                    <TextInput
                        style={[styles.inputField, {
                            backgroundColor: colors.background,
                            color: colors.charcoalInk,
                            borderColor: colors.softGold
                        }]}
                        placeholder={promptType === 'journal' ? 'Paste your journal entry here...' : 'Enter your theme here...'}
                        placeholderTextColor={colors.charcoalInk + '80'}
                        value={promptType === 'journal' ? journalEntry : customTheme}
                        onChangeText={promptType === 'journal' ? setJournalEntry : setCustomTheme}
                        multiline
                        textAlignVertical="top"
                    />

                    {/* Scripture Selector */}
                    <View style={styles.scriptureSection}>
                        <Text style={[styles.inputLabel, { color: colors.text }]}>
                            ✝️ Scripture Reference (Optional)
                        </Text>
                        <TextInput
                            style={[styles.scriptureInput, {
                                backgroundColor: colors.background,
                                color: colors.charcoalInk,
                                borderColor: colors.softGold
                            }]}
                            placeholder="Add a scripture reference..."
                            placeholderTextColor={colors.charcoalInk + '80'}
                            value={selectedScripture}
                            onChangeText={setSelectedScripture}
                        />
                    </View>

                    {/* Generate Button */}
                    <TouchableOpacity
                        style={[styles.generateButton, { backgroundColor: colors.softGold }]}
                        onPress={generateDevotional}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <ActivityIndicator color={colors.cream} />
                        ) : (
                            <Text style={[styles.generateButtonText, { color: colors.cream }]}>
                                ✨ Generate Devotional
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Generated Devotional */}
                {currentDevotional && (
                    <View style={[styles.devotionalCard, {
                        backgroundColor: colors.cream,
                        borderColor: isFaithMode ? colors.softGold : colors.skyBlue
                    }]}>
                        {isFaithMode && (
                            <View style={[styles.faithWatermark, { backgroundColor: colors.softGold }]}>
                                <Text style={[styles.faithWatermarkText, { color: colors.cream }]}>✝️</Text>
                            </View>
                        )}

                        <Text style={[styles.devotionalTitle, { color: colors.charcoalInk }]}>
                            {currentDevotional.title}
                        </Text>

                        {currentDevotional.scripture && (
                            <View style={[styles.scriptureCard, { backgroundColor: colors.skyBlue }]}>
                                <Text style={[styles.scriptureText, { color: colors.charcoalInk }]}>
                                    {currentDevotional.scripture}
                                </Text>
                            </View>
                        )}

                        <Text style={[styles.devotionalBody, { color: colors.charcoalInk }]}>
                            {currentDevotional.body}
                        </Text>

                        <View style={[styles.prayerSection, { backgroundColor: colors.warmBeige }]}>
                            <Text style={[styles.prayerLabel, { color: colors.charcoalInk }]}>
                                Prayer:
                            </Text>
                            <Text style={[styles.prayerText, { color: colors.charcoalInk }]}>
                                {currentDevotional.prayer}
                            </Text>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: colors.skyBlue }]}
                                onPress={copyDevotional}
                            >
                                <Text style={[styles.actionButtonText, { color: colors.charcoalInk }]}>
                                    📋 Copy
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: colors.mutedGreen }]}
                                onPress={saveDevotional}
                            >
                                <Text style={[styles.actionButtonText, { color: colors.charcoalInk }]}>
                                    💾 Save
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: colors.softGold }]}
                                onPress={regenerateDevotional}
                            >
                                <Text style={[styles.actionButtonText, { color: colors.cream }]}>
                                    🔄 Regenerate
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Saved Devotionals */}
                {savedDevotionals.length > 0 && (
                    <View style={styles.savedSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Saved Devotionals
                        </Text>

                        {savedDevotionals.slice(0, 3).map((devotional) => (
                            <TouchableOpacity
                                key={devotional.id}
                                style={[styles.savedDevotionalCard, {
                                    backgroundColor: colors.cream,
                                    borderColor: devotional.faithMode ? colors.softGold : colors.skyBlue
                                }]}
                            >
                                <Text style={[styles.savedDevotionalTitle, { color: colors.charcoalInk }]}>
                                    {devotional.title}
                                </Text>
                                <Text style={[styles.savedDevotionalDate, { color: colors.charcoalInk }]}>
                                    {new Date(devotional.date).toLocaleDateString()}
                                </Text>
                                {devotional.faithMode && (
                                    <View style={[styles.faithBadge, { backgroundColor: colors.softGold }]}>
                                        <Text style={[styles.faithBadgeText, { color: colors.cream }]}>
                                            ✝️ Faith
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Encouragement Message */}
                {isEncouragementMode && (
                    <View style={[styles.encouragementCard, { backgroundColor: colors.softPink }]}>
                        <Text style={[styles.encouragementTitle, { color: colors.charcoalInk }]}>
                            💝 Soft Voice of Truth
                        </Text>
                        <Text style={[styles.encouragementText, { color: colors.charcoalInk }]}>
                            Let your heart speak through your journaling, and watch as God transforms your words into wisdom.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Reflect Modal */}
            <AIReflectModal
              visible={reflectVisible}
              beforePrompts={getReflectPrompts(isFaithMode).before}
              onSkip={() => { setReflectVisible(false); doGenerateDevotional(); }}
              onConfirm={() => { setReflectVisible(false); doGenerateDevotional(); }}
            />

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
    inputCard: {
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'Playfair Display',
    },
    promptTypeContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    },
    promptTypeButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    promptTypeText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    inputField: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        minHeight: 100,
        fontFamily: 'Raleway',
        textAlignVertical: 'top',
    },
    scriptureSection: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    scriptureInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Raleway',
    },
    generateButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    generateButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    devotionalCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        position: 'relative',
    },
    faithWatermark: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    faithWatermarkText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    devotionalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'Playfair Display',
    },
    scriptureCard: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    scriptureText: {
        fontSize: 14,
        fontStyle: 'italic',
        lineHeight: 20,
        fontFamily: 'Raleway',
    },
    devotionalBody: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
        fontFamily: 'Raleway',
    },
    prayerSection: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    prayerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    prayerText: {
        fontSize: 14,
        fontStyle: 'italic',
        lineHeight: 20,
        fontFamily: 'Raleway',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    savedSection: {
        marginBottom: 30,
    },
    savedDevotionalCard: {
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
    savedDevotionalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Playfair Display',
    },
    savedDevotionalDate: {
        fontSize: 12,
        opacity: 0.7,
        fontFamily: 'Raleway',
    },
    faithBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    faithBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
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
}); 