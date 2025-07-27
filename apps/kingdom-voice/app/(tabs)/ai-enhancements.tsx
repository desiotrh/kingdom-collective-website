import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    Alert,
    Switch,
    Slider,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

interface AIEnhancement {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'voice' | 'transcription' | 'translation' | 'content';
    isActive: boolean;
    intensity: number;
    options?: string[];
}

interface TranscriptionResult {
    id: string;
    timestamp: number;
    speaker: string;
    text: string;
    confidence: number;
    isEdited: boolean;
}

interface TranslationResult {
    id: string;
    originalText: string;
    translatedText: string;
    language: string;
    confidence: number;
}

const AIEnhancementsScreen: React.FC = () => {
    const [enhancements, setEnhancements] = useState<AIEnhancement[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'voice' | 'transcription' | 'translation' | 'content'>('voice');
    const [transcriptionResults, setTranscriptionResults] = useState<TranscriptionResult[]>([]);
    const [translationResults, setTranslationResults] = useState<TranslationResult[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const aiEnhancements: AIEnhancement[] = [
        // Voice Cleanup & Mastering
        {
            id: 'voice-cleanup',
            name: 'Voice Cleanup & Mastering',
            description: 'Automated background noise removal, EQ, compression',
            icon: 'mic',
            category: 'voice',
            isActive: false,
            intensity: 70,
            options: ['Noise Removal', 'EQ Enhancement', 'Compression', 'Normalization']
        },
        {
            id: 'filler-word-removal',
            name: 'Filler Word Removal',
            description: 'Remove "um," "like," and other filler words',
            icon: 'cut',
            category: 'voice',
            isActive: false,
            intensity: 50,
            options: ['Auto Remove', 'Manual Review', 'Custom Words', 'Preserve Context']
        },
        {
            id: 'voice-separation',
            name: 'Guest Voice Separation',
            description: 'Detect and separate different speakers',
            icon: 'people',
            category: 'voice',
            isActive: false,
            intensity: 80,
            options: ['Speaker Detection', 'Voice Isolation', 'Individual Tracks', 'Auto Labeling']
        },

        // Transcription & Text
        {
            id: 'voice-to-text',
            name: 'Voice-to-Text Transcription',
            description: 'AI-powered speech recognition with high accuracy',
            icon: 'text',
            category: 'transcription',
            isActive: false,
            intensity: 90,
            options: ['Real-time', 'Post-processing', 'Speaker Labels', 'Timestamps']
        },
        {
            id: 'ai-summary',
            name: 'AI Summary Generation',
            description: 'Auto-generated show notes, summaries, titles',
            icon: 'document-text',
            category: 'transcription',
            isActive: false,
            intensity: 75,
            options: ['Show Notes', 'Episode Summary', 'Key Points', 'Timestamps']
        },
        {
            id: 'auto-captions',
            name: 'Auto-Captioned Video Snippets',
            description: 'Create captioned clips for social media',
            icon: 'videocam',
            category: 'transcription',
            isActive: false,
            intensity: 60,
            options: ['Social Clips', 'Quote Overlays', 'Animated Text', 'Brand Styling']
        },

        // Translation
        {
            id: 'multi-language',
            name: 'Multi-Language Translation',
            description: 'Text & audio translation in multiple languages',
            icon: 'language',
            category: 'translation',
            isActive: false,
            intensity: 85,
            options: ['Text Translation', 'Audio Translation', 'Real-time', 'Offline Support']
        },
        {
            id: 'language-detection',
            name: 'Language Detection',
            description: 'Auto-detect language and translate accordingly',
            icon: 'globe',
            category: 'translation',
            isActive: false,
            intensity: 90,
            options: ['Auto Detect', 'Manual Select', 'Multiple Outputs', 'Quality Control']
        },

        // Content Intelligence
        {
            id: 'spiritual-keywords',
            name: 'Spiritual Keyword Detection',
            description: 'Auto-tagging themes like healing, breakthrough, Scripture',
            icon: 'heart',
            category: 'content',
            isActive: false,
            intensity: 70,
            options: ['Faith Themes', 'Scripture Tags', 'Emotional Analysis', 'Topic Tracking']
        },
        {
            id: 'emotion-analysis',
            name: 'Emotion & Delivery Analysis',
            description: 'Analyze tone, pacing, and emotional impact',
            icon: 'analytics',
            category: 'content',
            isActive: false,
            intensity: 65,
            options: ['Tone Analysis', 'Pacing Metrics', 'Impact Scoring', 'Delivery Tips']
        },
        {
            id: 'topic-tracking',
            name: 'Topic Tracking Over Time',
            description: 'Track how often you speak on specific themes',
            icon: 'trending-up',
            category: 'content',
            isActive: false,
            intensity: 80,
            options: ['Theme Frequency', 'Content Evolution', 'Audience Response', 'Growth Metrics']
        },
    ];

    useEffect(() => {
        setEnhancements(aiEnhancements);
    }, []);

    const toggleEnhancement = (enhancementId: string) => {
        setEnhancements(prev =>
            prev.map(enhancement =>
                enhancement.id === enhancementId ? { ...enhancement, isActive: !enhancement.isActive } : enhancement
            )
        );
    };

    const updateIntensity = (enhancementId: string, value: number) => {
        setEnhancements(prev =>
            prev.map(enhancement =>
                enhancement.id === enhancementId ? { ...enhancement, intensity: value } : enhancement
            )
        );
    };

    const processEnhancements = () => {
        const activeEnhancements = enhancements.filter(enhancement => enhancement.isActive);
        if (activeEnhancements.length === 0) {
            Alert.alert('No Enhancements Selected', 'Please select at least one AI enhancement to process.');
            return;
        }

        setIsProcessing(true);
        Alert.alert(
            'Processing AI Enhancements',
            `Processing ${activeEnhancements.length} enhancement(s)...`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        setTimeout(() => {
                            setIsProcessing(false);
                            generateSampleResults();
                            Alert.alert(
                                'Enhancement Complete',
                                'Your podcast has been enhanced with AI features!'
                            );
                        }, 3000);
                    }
                }
            ]
        );
    };

    const generateSampleResults = () => {
        // Sample transcription results
        const sampleTranscription: TranscriptionResult[] = [
            {
                id: '1',
                timestamp: 0,
                speaker: 'Host',
                text: 'Welcome to our podcast today. We\'re going to talk about spiritual growth.',
                confidence: 0.95,
                isEdited: false,
            },
            {
                id: '2',
                timestamp: 15,
                speaker: 'Guest',
                text: 'Thank you for having me. I\'m excited to share my testimony.',
                confidence: 0.92,
                isEdited: false,
            },
            {
                id: '3',
                timestamp: 30,
                speaker: 'Host',
                text: 'That\'s wonderful. Tell us about your breakthrough moment.',
                confidence: 0.88,
                isEdited: false,
            },
        ];

        // Sample translation results
        const sampleTranslation: TranslationResult[] = [
            {
                id: '1',
                originalText: 'Welcome to our podcast today.',
                translatedText: 'Bienvenidos a nuestro podcast hoy.',
                language: 'Spanish',
                confidence: 0.94,
            },
            {
                id: '2',
                originalText: 'We\'re going to talk about spiritual growth.',
                translatedText: 'Vamos a hablar sobre el crecimiento espiritual.',
                language: 'Spanish',
                confidence: 0.91,
            },
        ];

        setTranscriptionResults(sampleTranscription);
        setTranslationResults(sampleTranslation);
    };

    const renderEnhancement = (enhancement: AIEnhancement) => (
        <TouchableOpacity
            key={enhancement.id}
            style={[
                styles.enhancementCard,
                enhancement.isActive && styles.enhancementCardActive,
                enhancement.category !== selectedCategory && styles.enhancementCardHidden
            ]}
            onPress={() => toggleEnhancement(enhancement.id)}
        >
            <View style={styles.enhancementHeader}>
                <Ionicons
                    name={enhancement.icon as any}
                    size={24}
                    color={enhancement.isActive ? '#FFFFFF' : Colors.light.accent}
                />
                <View style={styles.enhancementInfo}>
                    <Text style={[
                        styles.enhancementName,
                        enhancement.isActive && styles.enhancementNameActive
                    ]}>
                        {enhancement.name}
                    </Text>
                    <Text style={[
                        styles.enhancementDescription,
                        enhancement.isActive && styles.enhancementDescriptionActive
                    ]}>
                        {enhancement.description}
                    </Text>
                </View>
                <Switch
                    value={enhancement.isActive}
                    onValueChange={() => toggleEnhancement(enhancement.id)}
                    trackColor={{ false: '#E5E5E5', true: '#FFFFFF' }}
                    thumbColor={enhancement.isActive ? Colors.light.accent : '#666666'}
                />
            </View>

            {enhancement.isActive && (
                <View style={styles.enhancementControls}>
                    <Text style={styles.intensityLabel}>Intensity: {enhancement.intensity}%</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        value={enhancement.intensity}
                        onValueChange={(value) => updateIntensity(enhancement.id, value)}
                        minimumTrackTintColor={Colors.light.accent}
                        maximumTrackTintColor="#E5E5E5"
                        thumbStyle={styles.sliderThumb}
                    />
                    {enhancement.options && (
                        <View style={styles.optionsContainer}>
                            {enhancement.options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.optionButton}
                                    onPress={() => Alert.alert('Option Selected', option)}
                                >
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );

    const renderCategoryTabs = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
            {[
                { id: 'voice', name: 'Voice', icon: 'mic' },
                { id: 'transcription', name: 'Transcription', icon: 'text' },
                { id: 'translation', name: 'Translation', icon: 'language' },
                { id: 'content', name: 'Content', icon: 'analytics' },
            ].map(category => (
                <TouchableOpacity
                    key={category.id}
                    style={[
                        styles.categoryTab,
                        selectedCategory === category.id && styles.categoryTabActive
                    ]}
                    onPress={() => setSelectedCategory(category.id as any)}
                >
                    <Ionicons
                        name={category.icon as any}
                        size={20}
                        color={selectedCategory === category.id ? '#FFFFFF' : Colors.light.accent}
                    />
                    <Text style={[
                        styles.categoryTabText,
                        selectedCategory === category.id && styles.categoryTabTextActive
                    ]}>
                        {category.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderTranscriptionResults = () => (
        <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Transcription Results</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {transcriptionResults.map((result) => (
                    <TouchableOpacity
                        key={result.id}
                        style={styles.transcriptionCard}
                        onPress={() => Alert.alert('Edit Transcription', 'Edit this transcription text')}
                    >
                        <View style={styles.transcriptionHeader}>
                            <Text style={styles.speakerName}>{result.speaker}</Text>
                            <Text style={styles.timestamp}>{result.timestamp}s</Text>
                            <Text style={styles.confidence}>{Math.round(result.confidence * 100)}%</Text>
                        </View>
                        <Text style={styles.transcriptionText}>{result.text}</Text>
                        {result.isEdited && (
                            <Text style={styles.editedBadge}>Edited</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderTranslationResults = () => (
        <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Translation Results</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {translationResults.map((result) => (
                    <TouchableOpacity
                        key={result.id}
                        style={styles.translationCard}
                    >
                        <Text style={styles.languageLabel}>{result.language}</Text>
                        <Text style={styles.originalText}>{result.originalText}</Text>
                        <Text style={styles.translatedText}>{result.translatedText}</Text>
                        <Text style={styles.confidence}>{Math.round(result.confidence * 100)}% accuracy</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>AI-Powered Enhancements</Text>
                    <Text style={styles.subtitle}>
                        Advanced AI tools for voice cleanup, transcription, and content analysis
                    </Text>
                </View>

                {renderCategoryTabs()}

                <View style={styles.enhancementsContainer}>
                    {enhancements
                        .filter(enhancement => enhancement.category === selectedCategory)
                        .map(renderEnhancement)
                    }
                </View>

                {selectedCategory === 'transcription' && renderTranscriptionResults()}
                {selectedCategory === 'translation' && renderTranslationResults()}

                <TouchableOpacity
                    style={styles.processButton}
                    onPress={processEnhancements}
                    disabled={isProcessing}
                >
                    <LinearGradient
                        colors={[Colors.light.accent, '#4A90E2']}
                        style={styles.processButtonGradient}
                    >
                        <Text style={styles.processButtonText}>
                            {isProcessing ? 'Processing...' : 'Process AI Enhancements'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.text,
        textAlign: 'center',
        lineHeight: 22,
    },
    categoryTabs: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    categoryTab: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    categoryTabActive: {
        backgroundColor: Colors.light.accent,
        borderColor: Colors.light.accent,
    },
    categoryTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginLeft: 6,
    },
    categoryTabTextActive: {
        color: '#FFFFFF',
    },
    enhancementsContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    enhancementCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    enhancementCardActive: {
        backgroundColor: Colors.light.accent,
        borderColor: Colors.light.accent,
    },
    enhancementCardHidden: {
        display: 'none',
    },
    enhancementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    enhancementInfo: {
        flex: 1,
        marginLeft: 12,
        marginRight: 12,
    },
    enhancementName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    enhancementNameActive: {
        color: '#FFFFFF',
    },
    enhancementDescription: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 18,
    },
    enhancementDescriptionActive: {
        color: '#FFFFFF',
        opacity: 0.9,
    },
    enhancementControls: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        paddingTop: 12,
    },
    intensityLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 12,
    },
    sliderThumb: {
        backgroundColor: Colors.light.accent,
        width: 20,
        height: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    optionButton: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    optionText: {
        fontSize: 12,
        color: Colors.light.text,
        fontWeight: '500',
    },
    resultsSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 16,
    },
    transcriptionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    transcriptionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    speakerName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.light.accent,
    },
    timestamp: {
        fontSize: 12,
        color: Colors.light.text,
    },
    confidence: {
        fontSize: 12,
        color: Colors.light.text,
    },
    transcriptionText: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 18,
    },
    editedBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.light.accent,
        marginTop: 8,
    },
    translationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    languageLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.light.accent,
        marginBottom: 8,
    },
    originalText: {
        fontSize: 14,
        color: Colors.light.text,
        marginBottom: 8,
        fontStyle: 'italic',
    },
    translatedText: {
        fontSize: 14,
        color: Colors.light.text,
        marginBottom: 8,
        fontWeight: '500',
    },
    processButton: {
        marginHorizontal: 20,
        marginBottom: 24,
        borderRadius: 12,
        overflow: 'hidden',
    },
    processButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    processButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default AIEnhancementsScreen; 