import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
    Animated,
    Dimensions,
    Switch,
    Clipboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from '@/contexts/FaithModeContext';

interface Declaration {
    id: string;
    title: string;
    body: string;
    tags: string[];
    faithMode: boolean;
    verse?: string;
    isDailyReminder: boolean;
    createdAt: string;
}

const { width: screenWidth } = Dimensions.get('window');

const preloadedThemes = [
    {
        id: '1',
        title: 'Identity in Christ',
        body: 'I am a child of God, fearfully and wonderfully made. I am chosen, loved, and called according to His purpose.',
        tags: ['Identity', 'Purpose'],
        faithMode: true,
        verse: '1 Peter 2:9 - But you are a chosen people, a royal priesthood, a holy nation, God\'s special possession.'
    },
    {
        id: '2',
        title: 'Voice of Breakthrough',
        body: 'My voice carries breakthrough. I speak life, truth, and victory. My words have power to change atmospheres.',
        tags: ['Voice', 'Breakthrough'],
        faithMode: true,
        verse: 'Proverbs 18:21 - The tongue has the power of life and death.'
    },
    {
        id: '3',
        title: 'Overcomer by Testimony',
        body: 'I overcome by the Word and my testimony. I am more than a conqueror through Christ who strengthens me.',
        tags: ['Victory', 'Overcoming'],
        faithMode: true,
        verse: 'Revelation 12:11 - They triumphed over him by the blood of the Lamb and by the word of their testimony.'
    },
    {
        id: '4',
        title: 'Walking in Love',
        body: 'I choose to walk in love today. I am patient, kind, and forgiving. Love covers all things.',
        tags: ['Love', 'Character'],
        faithMode: false
    },
    {
        id: '5',
        title: 'Abundant Life',
        body: 'I have come that they may have life, and have it to the full. I embrace the abundant life Jesus offers.',
        tags: ['Abundance', 'Life'],
        faithMode: true,
        verse: 'John 10:10 - I have come that they may have life, and have it to the full.'
    }
];

const availableTags = [
    'Identity', 'Purpose', 'Voice', 'Breakthrough', 'Victory', 'Overcoming',
    'Love', 'Character', 'Abundance', 'Life', 'Faith', 'Trust', 'Healing',
    'Strength', 'Peace', 'Joy', 'Gratitude', 'Forgiveness', 'Wisdom'
];

const aiPrompts = [
    'Create 5 biblical declarations for someone struggling with self-worth',
    'Create 5 biblical declarations for someone facing fear and anxiety',
    'Create 5 biblical declarations for someone seeking purpose and direction',
    'Create 5 biblical declarations for someone dealing with past hurts',
    'Create 5 biblical declarations for someone wanting to grow in faith'
];

export default function DeclarationBuilderScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { isFaithMode, isEncouragementMode, FaithModeOverlay, EncouragementOverlay } = useFaithMode();

    const [declaration, setDeclaration] = useState<Partial<Declaration>>({
        title: '',
        body: '',
        tags: [],
        faithMode: isFaithMode,
        isDailyReminder: false,
    });

    const [selectedVerse, setSelectedVerse] = useState<string>('');
    const [showVerseSelector, setShowVerseSelector] = useState(false);
    const [showPromptLibrary, setShowPromptLibrary] = useState(false);
    const [showAIGenerator, setShowAIGenerator] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedDeclarations, setGeneratedDeclarations] = useState<string[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const pulseAnimation = useRef(new Animated.Value(1)).current;
    const speakAnimation = useRef(new Animated.Value(0)).current;

    // Animate on load
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const availableVerses = [
        { reference: '1 Peter 2:9', text: 'But you are a chosen people, a royal priesthood, a holy nation, God\'s special possession.' },
        { reference: 'Proverbs 18:21', text: 'The tongue has the power of life and death.' },
        { reference: 'Revelation 12:11', text: 'They triumphed over him by the blood of the Lamb and by the word of their testimony.' },
        { reference: 'John 10:10', text: 'I have come that they may have life, and have it to the full.' },
        { reference: 'Romans 8:37', text: 'In all these things we are more than conquerors through him who loved us.' },
        { reference: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.' },
        { reference: '2 Corinthians 5:17', text: 'Therefore, if anyone is in Christ, the new creation has come.' },
        { reference: 'Ephesians 2:10', text: 'For we are God\'s handiwork, created in Christ Jesus to do good works.' },
    ];

    const saveDeclaration = async () => {
        if (!declaration.title || !declaration.body) {
            Alert.alert('Missing Information', 'Please fill in both title and body.');
            return;
        }

        try {
            const declarationId = Date.now().toString();
            const fullDeclaration: Declaration = {
                id: declarationId,
                title: declaration.title || 'Untitled Declaration',
                body: declaration.body || '',
                tags: declaration.tags || [],
                faithMode: isFaithMode,
                verse: selectedVerse,
                isDailyReminder: declaration.isDailyReminder || false,
                createdAt: new Date().toISOString(),
            };

            // Save to declarations list
            const declarationsKey = 'declarations';
            const existingDeclarations = await AsyncStorage.getItem(declarationsKey);
            const declarations = existingDeclarations ? JSON.parse(existingDeclarations) : [];
            declarations.unshift(fullDeclaration);
            await AsyncStorage.setItem(declarationsKey, JSON.stringify(declarations));

            Alert.alert('Declaration Saved', 'Your declaration has been saved successfully!');

            // Reset form
            setDeclaration({
                title: '',
                body: '',
                tags: [],
                faithMode: isFaithMode,
                isDailyReminder: false,
            });
            setSelectedVerse('');

        } catch (error) {
            console.error('Error saving declaration:', error);
            Alert.alert('Error', 'Failed to save declaration. Please try again.');
        }
    };

    const copyToClipboard = async () => {
        if (!declaration.title || !declaration.body) {
            Alert.alert('Missing Information', 'Please fill in both title and body.');
            return;
        }

        const textToCopy = `${declaration.title}\n\n${declaration.body}${selectedVerse ? `\n\n"${selectedVerse}"` : ''}`;

        try {
            await Clipboard.setString(textToCopy);
            Alert.alert('Copied!', 'Declaration copied to clipboard.');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            Alert.alert('Error', 'Failed to copy to clipboard.');
        }
    };

    const speakDeclaration = () => {
        if (!declaration.title || !declaration.body) {
            Alert.alert('Missing Information', 'Please fill in both title and body.');
            return;
        }

        setIsSpeaking(true);

        // Animate speaking
        Animated.loop(
            Animated.sequence([
                Animated.timing(speakAnimation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(speakAnimation, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Simulate speaking (replace with actual text-to-speech)
        setTimeout(() => {
            setIsSpeaking(false);
            Animated.loop(Animated.timing(speakAnimation, { toValue: 0, duration: 0 })).stop();
            Alert.alert('Declaration Spoken', 'Your declaration has been spoken out loud.');
        }, 3000);
    };

    const useTheme = (theme: any) => {
        setDeclaration({
            title: theme.title,
            body: theme.body,
            tags: theme.tags,
            faithMode: theme.faithMode,
            isDailyReminder: false,
        });
        if (theme.verse) {
            setSelectedVerse(`${theme.verse}`);
        }
        setShowPromptLibrary(false);
    };

    const generateAIDeclarations = async () => {
        if (!selectedPrompt) {
            Alert.alert('No Prompt Selected', 'Please select a prompt to generate declarations.');
            return;
        }

        setIsGenerating(true);

        try {
            // Simulate AI generation (replace with actual AI API)
            await new Promise(resolve => setTimeout(resolve, 2000));

            const mockDeclarations = [
                'I am fearfully and wonderfully made in the image of God.',
                'My worth is not determined by others, but by my Creator.',
                'I am chosen, loved, and called according to His purpose.',
                'I am a masterpiece, created for good works.',
                'I am valuable because God says I am valuable.'
            ];

            setGeneratedDeclarations(mockDeclarations);
            setShowAIGenerator(false);

            Alert.alert('Declarations Generated', '5 biblical declarations have been generated for you.');

        } catch (error) {
            console.error('Error generating declarations:', error);
            Alert.alert('Generation Error', 'Failed to generate declarations. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleTag = (tag: string) => {
        setDeclaration(prev => ({
            ...prev,
            tags: prev.tags?.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...(prev.tags || []), tag]
        }));
    };

    const selectVerse = (verse: string) => {
        setSelectedVerse(verse);
        setShowVerseSelector(false);
    };

    const renderThemeCard = (theme: any) => (
        <TouchableOpacity
            key={theme.id}
            style={[styles.themeCard, {
                backgroundColor: colors.cream,
                borderColor: theme.faithMode ? colors.softGold : colors.skyBlue,
                borderWidth: theme.faithMode ? 2 : 1,
            }]}
            onPress={() => useTheme(theme)}
        >
            <Text style={[styles.themeTitle, { color: colors.charcoalInk }]}>
                {theme.title}
            </Text>

            <Text style={[styles.themeBody, { color: colors.charcoalInk + 'CC' }]} numberOfLines={3}>
                {theme.body}
            </Text>

            {theme.verse && (
                <View style={[styles.themeVerse, { backgroundColor: colors.softGold + '20' }]}>
                    <Text style={[styles.themeVerseText, { color: colors.charcoalInk }]} numberOfLines={2}>
                        "{theme.verse}"
                    </Text>
                </View>
            )}

            <View style={styles.themeTags}>
                {theme.tags.map((tag: string, index: number) => (
                    <View key={index} style={[styles.themeTag, { backgroundColor: colors.skyBlue }]}>
                        <Text style={[styles.themeTagText, { color: colors.charcoalInk }]}>{tag}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {isFaithMode ? '✝️ Declaration Builder' : 'Declaration Builder'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.charcoalInk }]}>
                        {isEncouragementMode ? 'Speak truth into your life' : 'Create powerful declarations'}
                    </Text>
                </View>

                {/* Encouragement Message */}
                {isEncouragementMode && (
                    <View style={[styles.encouragementCard, { backgroundColor: colors.warmBeige }]}>
                        <Text style={[styles.encouragementTitle, { color: colors.charcoalInk }]}>
                            💝 Your Words Matter
                        </Text>
                        <Text style={[styles.encouragementText, { color: colors.charcoalInk }]}>
                            What you declare over your life has power. Choose your words wisely and speak life.
                        </Text>
                    </View>
                )}

                {/* Input Section */}
                <View style={[styles.inputCard, { backgroundColor: colors.cream }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Create Your Declaration
                    </Text>

                    {/* Title Input */}
                    <View style={styles.inputSection}>
                        <Text style={[styles.inputLabel, { color: colors.charcoalInk }]}>Title</Text>
                        <TextInput
                            style={[styles.titleInput, {
                                backgroundColor: colors.background,
                                color: colors.charcoalInk,
                                borderColor: colors.softGold
                            }]}
                            value={declaration.title}
                            onChangeText={(text) => setDeclaration(prev => ({ ...prev, title: text }))}
                            placeholder="e.g., Identity in Christ"
                            placeholderTextColor={colors.charcoalInk + '80'}
                        />
                    </View>

                    {/* Body Input */}
                    <View style={styles.inputSection}>
                        <Text style={[styles.inputLabel, { color: colors.charcoalInk }]}>Declaration</Text>
                        <TextInput
                            style={[styles.bodyInput, {
                                backgroundColor: colors.background,
                                color: colors.charcoalInk,
                                borderColor: colors.softGold
                            }]}
                            value={declaration.body}
                            onChangeText={(text) => setDeclaration(prev => ({ ...prev, body: text }))}
                            placeholder="Write your powerful declaration..."
                            placeholderTextColor={colors.charcoalInk + '80'}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Tags */}
                    <View style={styles.inputSection}>
                        <Text style={[styles.inputLabel, { color: colors.charcoalInk }]}>Tags (Optional)</Text>
                        <View style={styles.tagsContainer}>
                            {availableTags.map((tag) => (
                                <TouchableOpacity
                                    key={tag}
                                    style={[
                                        styles.tagButton,
                                        {
                                            backgroundColor: declaration.tags?.includes(tag) ? colors.softGold : colors.skyBlue,
                                            borderColor: colors.softGold
                                        }
                                    ]}
                                    onPress={() => toggleTag(tag)}
                                >
                                    <Text style={[
                                        styles.tagText,
                                        { color: declaration.tags?.includes(tag) ? colors.cream : colors.charcoalInk }
                                    ]}>
                                        {tag}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Faith Mode Verse */}
                    {isFaithMode && (
                        <View style={styles.inputSection}>
                            <Text style={[styles.inputLabel, { color: colors.charcoalInk }]}>
                                ✝️ Scripture Reference (Optional)
                            </Text>
                            <TouchableOpacity
                                style={[styles.verseButton, {
                                    backgroundColor: colors.background,
                                    borderColor: colors.softGold
                                }]}
                                onPress={() => setShowVerseSelector(true)}
                            >
                                <Text style={[styles.verseButtonText, { color: colors.charcoalInk }]}>
                                    {selectedVerse || 'Select a verse...'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Daily Reminder Toggle */}
                    <View style={styles.inputSection}>
                        <View style={styles.toggleRow}>
                            <Text style={[styles.toggleLabel, { color: colors.charcoalInk }]}>
                                Mark as Daily Reminder
                            </Text>
                            <Switch
                                value={declaration.isDailyReminder || false}
                                onValueChange={(value) => setDeclaration(prev => ({ ...prev, isDailyReminder: value }))}
                                trackColor={{ false: colors.skyBlue, true: colors.softGold }}
                                thumbColor={colors.cream}
                            />
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.skyBlue }]}
                        onPress={() => setShowPromptLibrary(true)}
                    >
                        <Text style={[styles.actionButtonText, { color: colors.charcoalInk }]}>
                            📚 Prompt Library
                        </Text>
                    </TouchableOpacity>

                    {isFaithMode && (
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.softGold }]}
                            onPress={() => setShowAIGenerator(true)}
                        >
                            <Text style={[styles.actionButtonText, { color: colors.cream }]}>
                                🤖 AI Generator
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Save and Copy Buttons */}
                <View style={styles.saveButtons}>
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: colors.softGold }]}
                        onPress={saveDeclaration}
                    >
                        <Text style={[styles.saveButtonText, { color: colors.cream }]}>
                            💾 Save Declaration
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.copyButton, { backgroundColor: colors.skyBlue }]}
                        onPress={copyToClipboard}
                    >
                        <Text style={[styles.copyButtonText, { color: colors.charcoalInk }]}>
                            📋 Copy to Clipboard
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Speak Declaration */}
                <TouchableOpacity
                    style={[
                        styles.speakButton,
                        {
                            backgroundColor: isSpeaking ? colors.softGold : colors.skyBlue,
                            transform: [{
                                scale: speakAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 1.1]
                                })
                            }]
                        }
                    ]}
                    onPress={speakDeclaration}
                    disabled={isSpeaking}
                >
                    <Text style={[styles.speakButtonText, { color: colors.cream }]}>
                        {isSpeaking ? '🔊 Speaking...' : '🔊 Speak Declaration'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Prompt Library Modal */}
            <Modal
                visible={showPromptLibrary}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowPromptLibrary(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Prompt Library
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowPromptLibrary(false)}
                            >
                                <Text style={[styles.closeButtonText, { color: colors.charcoalInk }]}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.themesList}>
                            {preloadedThemes.map(renderThemeCard)}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: colors.skyBlue }]}
                            onPress={() => setShowPromptLibrary(false)}
                        >
                            <Text style={[styles.modalButtonText, { color: colors.charcoalInk }]}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* AI Generator Modal */}
            <Modal
                visible={showAIGenerator}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAIGenerator(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                AI Declaration Generator
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowAIGenerator(false)}
                            >
                                <Text style={[styles.closeButtonText, { color: colors.charcoalInk }]}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.modalSubtitle, { color: colors.charcoalInk }]}>
                            Select a prompt to generate biblical declarations:
                        </Text>

                        <ScrollView style={styles.promptsList}>
                            {aiPrompts.map((prompt, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.promptOption,
                                        {
                                            backgroundColor: selectedPrompt === prompt ? colors.softGold : colors.cream,
                                            borderColor: colors.softGold
                                        }
                                    ]}
                                    onPress={() => setSelectedPrompt(prompt)}
                                >
                                    <Text style={[
                                        styles.promptText,
                                        { color: selectedPrompt === prompt ? colors.cream : colors.charcoalInk }
                                    ]}>
                                        {prompt}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: colors.softGold }]}
                            onPress={generateAIDeclarations}
                            disabled={isGenerating || !selectedPrompt}
                        >
                            <Text style={[styles.modalButtonText, { color: colors.cream }]}>
                                {isGenerating ? '🤖 Generating...' : '🤖 Generate Declarations'}
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
        marginBottom: 20,
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
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
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
    inputCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
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
    inputSection: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    titleInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Raleway',
    },
    bodyInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 120,
        fontFamily: 'Raleway',
        textAlignVertical: 'top',
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
    },
    verseButtonText: {
        fontSize: 14,
        fontFamily: 'Raleway',
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toggleLabel: {
        fontSize: 14,
        fontFamily: 'Raleway',
    },
    actionButtons: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    saveButtons: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 12,
    },
    saveButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    copyButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    copyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    speakButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    speakButtonText: {
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
    modalSubtitle: {
        fontSize: 14,
        marginBottom: 16,
        paddingHorizontal: 20,
        fontFamily: 'Raleway',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    themesList: {
        padding: 20,
        maxHeight: 400,
    },
    themeCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    themeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    themeBody: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
        fontFamily: 'Raleway',
    },
    themeVerse: {
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    themeVerseText: {
        fontSize: 12,
        fontStyle: 'italic',
        fontFamily: 'Raleway',
    },
    themeTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    themeTag: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    themeTagText: {
        fontSize: 10,
        fontFamily: 'Raleway',
    },
    promptsList: {
        padding: 20,
        maxHeight: 300,
    },
    promptOption: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    promptText: {
        fontSize: 14,
        fontFamily: 'Raleway',
    },
    versesList: {
        padding: 20,
        maxHeight: 300,
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
        padding: 16,
        margin: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
}); 