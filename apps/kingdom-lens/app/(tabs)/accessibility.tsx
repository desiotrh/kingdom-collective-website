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
    Switch,
    Dimensions,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Language {
    code: string;
    name: string;
    nativeName: string;
    status: 'Available' | 'Coming Soon' | 'Beta';
    scriptureSupport: boolean;
    audioSupport: boolean;
}

interface AccessibilityFeature {
    id: string;
    name: string;
    category: 'Visual' | 'Audio' | 'Motor' | 'Cognitive';
    description: string;
    enabled: boolean;
    settings: Record<string, any>;
}

interface CulturalEvent {
    id: string;
    name: string;
    culture: string;
    description: string;
    photographyTips: string[];
    prompts: string[];
    ministryContext?: string;
}

interface ScriptureTranslation {
    id: string;
    verse: string;
    language: string;
    translation: string;
    audioUrl?: string;
    pronunciation?: string;
}

export default function AccessibilityScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [activeTab, setActiveTab] = useState<'languages' | 'accessibility' | 'cultural' | 'scripture'>('languages');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    // Mock data
    const [languages, setLanguages] = useState<Language[]>([
        {
            code: 'en',
            name: 'English',
            nativeName: 'English',
            status: 'Available',
            scriptureSupport: true,
            audioSupport: true
        },
        {
            code: 'es',
            name: 'Spanish',
            nativeName: 'Español',
            status: 'Available',
            scriptureSupport: true,
            audioSupport: true
        },
        {
            code: 'fr',
            name: 'French',
            nativeName: 'Français',
            status: 'Available',
            scriptureSupport: true,
            audioSupport: false
        },
        {
            code: 'tl',
            name: 'Tagalog',
            nativeName: 'Tagalog',
            status: 'Coming Soon',
            scriptureSupport: false,
            audioSupport: false
        },
        {
            code: 'pt',
            name: 'Portuguese',
            nativeName: 'Português',
            status: 'Beta',
            scriptureSupport: true,
            audioSupport: false
        }
    ]);

    const [accessibilityFeatures, setAccessibilityFeatures] = useState<AccessibilityFeature[]>([
        {
            id: '1',
            name: 'Screen Reader Support',
            category: 'Visual',
            description: 'Full VoiceOver and TalkBack support for all app features',
            enabled: true,
            settings: { voiceSpeed: 1.0, voicePitch: 1.0 }
        },
        {
            id: '2',
            name: 'Large Text',
            category: 'Visual',
            description: 'Increase text size for better readability',
            enabled: false,
            settings: { textScale: 1.0, maxScale: 2.0 }
        },
        {
            id: '3',
            name: 'Voice Navigation',
            category: 'Motor',
            description: 'Navigate app using voice commands',
            enabled: false,
            settings: { commands: ['open', 'close', 'next', 'previous'] }
        },
        {
            id: '4',
            name: 'High Contrast',
            category: 'Visual',
            description: 'High contrast mode for better visibility',
            enabled: false,
            settings: { contrast: 'normal', brightness: 1.0 }
        },
        {
            id: '5',
            name: 'Reduced Motion',
            category: 'Cognitive',
            description: 'Reduce animations and motion effects',
            enabled: false,
            settings: { animations: false, transitions: false }
        }
    ]);

    const [culturalEvents, setCulturalEvents] = useState<CulturalEvent[]>([
        {
            id: '1',
            name: 'Quinceañera',
            culture: 'Hispanic',
            description: 'Traditional 15th birthday celebration',
            photographyTips: [
                'Capture the traditional dress and crown',
                'Include family and godparents in photos',
                'Document the ceremony and reception',
                'Focus on cultural elements and traditions'
            ],
            prompts: [
                'Traditional quinceañera dress',
                'Family portraits with cultural elements',
                'Ceremony and religious aspects',
                'Reception and celebration moments'
            ],
            ministryContext: 'Celebrate God\'s blessing of reaching this milestone'
        },
        {
            id: '2',
            name: 'Dedication Ceremony',
            culture: 'Christian',
            description: 'Baby dedication in church',
            photographyTips: [
                'Capture the pastor and family',
                'Include extended family members',
                'Document the prayer and blessing',
                'Focus on the spiritual significance'
            ],
            prompts: [
                'Pastor and family during dedication',
                'Prayer and blessing moments',
                'Extended family portraits',
                'Church ceremony atmosphere'
            ],
            ministryContext: 'Documenting the commitment to raise children in faith'
        },
        {
            id: '3',
            name: 'Wedding Ceremony',
            culture: 'Universal',
            description: 'Traditional wedding celebrations',
            photographyTips: [
                'Capture cultural wedding traditions',
                'Include family and community',
                'Document religious ceremonies',
                'Focus on cultural significance'
            ],
            prompts: [
                'Cultural wedding traditions',
                'Family and community involvement',
                'Religious ceremony elements',
                'Cultural celebration moments'
            ]
        }
    ]);

    const [scriptureTranslations, setScriptureTranslations] = useState<ScriptureTranslation[]>([
        {
            id: '1',
            verse: 'Psalm 19:1',
            language: 'Spanish',
            translation: 'Los cielos cuentan la gloria de Dios, y el firmamento anuncia la obra de sus manos.',
            audioUrl: 'https://example.com/psalm19_es.mp3',
            pronunciation: 'Los see-elos kwen-tan la glo-ree-ah de Dios'
        },
        {
            id: '2',
            verse: 'Philippians 4:13',
            language: 'French',
            translation: 'Je peux tout par celui qui me fortifie.',
            audioUrl: 'https://example.com/philippians4_fr.mp3',
            pronunciation: 'Je peux too par sel-ee ke me for-tee-fee'
        },
        {
            id: '3',
            verse: 'John 3:16',
            language: 'Tagalog',
            translation: 'Sapagkat gayon na lamang ang pagsinta ng Dios sa sanglibutan, na ibinigay niya ang kaniyang bugtong na Anak.',
            pronunciation: 'Sa-pag-kat ga-yon na la-mang ang pag-sin-ta ng Di-os'
        }
    ]);

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Kingdom Accessibility';
        } else if (encouragementMode) {
            return 'Accessibility & Inclusion';
        }
        return 'Accessibility';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Making Kingdom tools accessible to all';
        } else if (encouragementMode) {
            return 'Inclusive design for all users';
        }
        return 'Accessibility and inclusion features';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available':
                return theme.colors.success;
            case 'Coming Soon':
                return theme.colors.warning;
            case 'Beta':
                return theme.colors.info;
            default:
                return theme.colors.textSecondary;
        }
    };

    const renderLanguageCard = ({ item }: { item: Language }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name} ({item.nativeName})
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={[styles.statusText, { color: theme.colors.surface }]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.languageFeatures}>
                <View style={styles.languageFeature}>
                    <Text style={[styles.languageFeatureLabel, { color: theme.colors.textSecondary }]}>
                        📖 Scripture Support
                    </Text>
                    <View style={[styles.featureIndicator, { backgroundColor: item.scriptureSupport ? theme.colors.success : theme.colors.error }]}>
                        <Text style={[styles.featureIndicatorText, { color: theme.colors.surface }]}>
                            {item.scriptureSupport ? '✓' : '✗'}
                        </Text>
                    </View>
                </View>
                <View style={styles.languageFeature}>
                    <Text style={[styles.languageFeatureLabel, { color: theme.colors.textSecondary }]}>
                        🔊 Audio Support
                    </Text>
                    <View style={[styles.featureIndicator, { backgroundColor: item.audioSupport ? theme.colors.success : theme.colors.error }]}>
                        <Text style={[styles.featureIndicatorText, { color: theme.colors.surface }]}>
                            {item.audioSupport ? '✓' : '✗'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => {
                        setSelectedLanguage(item.code);
                        setShowLanguageModal(true);
                    }}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Select Language
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('View Details', `Opening ${item.name} details...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Details
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderAccessibilityCard = ({ item }: { item: AccessibilityFeature }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <Switch
                    value={item.enabled}
                    onValueChange={(value) => {
                        const updatedFeatures = accessibilityFeatures.map(feature =>
                            feature.id === item.id ? { ...feature, enabled: value } : feature
                        );
                        setAccessibilityFeatures(updatedFeatures);
                    }}
                    trackColor={{ false: '#767577', true: theme.colors.primary }}
                    thumbColor={item.enabled ? theme.colors.surface : '#f4f3f4'}
                />
            </View>

            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                {item.description}
            </Text>

            <View style={styles.categoryContainer}>
                <View style={[styles.categoryBadge, { backgroundColor: theme.colors.info }]}>
                    <Text style={[styles.categoryText, { color: theme.colors.surface }]}>
                        {item.category}
                    </Text>
                </View>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('Configure', `Configuring ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Configure
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Learn More', `Learning about ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Learn More
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCulturalCard = ({ item }: { item: CulturalEvent }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={[styles.cultureBadge, { backgroundColor: theme.colors.info }]}>
                    <Text style={[styles.cultureText, { color: theme.colors.surface }]}>
                        {item.culture}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                {item.description}
            </Text>

            <View style={styles.tipsContainer}>
                <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
                    📸 Photography Tips:
                </Text>
                {item.photographyTips.map((tip, index) => (
                    <Text key={index} style={[styles.tip, { color: theme.colors.textSecondary }]}>
                        • {tip}
                    </Text>
                ))}
            </View>

            <View style={styles.promptsContainer}>
                <Text style={[styles.promptsTitle, { color: theme.colors.text }]}>
                    💡 AI Prompts:
                </Text>
                {item.prompts.map((prompt, index) => (
                    <Text key={index} style={[styles.prompt, { color: theme.colors.textSecondary }]}>
                        • {prompt}
                    </Text>
                ))}
            </View>

            {faithMode && item.ministryContext && (
                <View style={styles.ministryContextContainer}>
                    <Text style={[styles.ministryContextTitle, { color: faithTheme.colors.primary }]}>
                        ✨ Ministry Context:
                    </Text>
                    <Text style={[styles.ministryContextText, { color: faithTheme.colors.textSecondary }]}>
                        {item.ministryContext}
                    </Text>
                </View>
            )}

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('View Guide', `Opening ${item.name} guide...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Guide
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Generate Prompts', `Generating prompts for ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Generate Prompts
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderScriptureCard = ({ item }: { item: ScriptureTranslation }) => (
        <View style={[styles.card, { backgroundColor: faithTheme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: faithTheme.colors.text }]}>
                    {item.verse}
                </Text>
                <View style={[styles.languageBadge, { backgroundColor: faithTheme.colors.primary }]}>
                    <Text style={[styles.languageText, { color: faithTheme.colors.surface }]}>
                        {item.language}
                    </Text>
                </View>
            </View>

            <Text style={[styles.translationText, { color: faithTheme.colors.textSecondary }]}>
                {item.translation}
            </Text>

            {item.pronunciation && (
                <Text style={[styles.pronunciationText, { color: faithTheme.colors.textSecondary }]}>
                    🔊 Pronunciation: {item.pronunciation}
                </Text>
            )}

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: faithTheme.colors.primary }]}
                    onPress={() => Alert.alert('Play Audio', `Playing ${item.verse} in ${item.language}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: faithTheme.colors.surface }]}>
                        Play Audio
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: faithTheme.colors.success }]}
                    onPress={() => Alert.alert('Share Verse', `Sharing ${item.verse}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: faithTheme.colors.surface }]}>
                        Share Verse
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'languages':
                return (
                    <FlatList
                        data={languages}
                        renderItem={renderLanguageCard}
                        keyExtractor={(item) => item.code}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'accessibility':
                return (
                    <FlatList
                        data={accessibilityFeatures}
                        renderItem={renderAccessibilityCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'cultural':
                return (
                    <FlatList
                        data={culturalEvents}
                        renderItem={renderCulturalCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'scripture':
                return faithMode ? (
                    <FlatList
                        data={scriptureTranslations}
                        renderItem={renderScriptureCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                            Scripture translations are available in Faith Mode
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
                        style={[styles.tab, activeTab === 'languages' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('languages')}
                    >
                        <Text style={[styles.tabText, activeTab === 'languages' && { color: theme.colors.surface }]}>
                            🌍 Languages
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'accessibility' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('accessibility')}
                    >
                        <Text style={[styles.tabText, activeTab === 'accessibility' && { color: theme.colors.surface }]}>
                            ♿ Accessibility
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'cultural' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('cultural')}
                    >
                        <Text style={[styles.tabText, activeTab === 'cultural' && { color: theme.colors.surface }]}>
                            🎭 Cultural
                        </Text>
                    </TouchableOpacity>
                    {faithMode && (
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'scripture' && { backgroundColor: faithTheme.colors.primary }]}
                            onPress={() => setActiveTab('scripture')}
                        >
                            <Text style={[styles.tabText, activeTab === 'scripture' && { color: faithTheme.colors.surface }]}>
                                📖 Scripture
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
    cardDescription: {
        fontSize: 14,
        marginBottom: 15,
        lineHeight: 20,
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
    languageFeatures: {
        marginBottom: 15,
    },
    languageFeature: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    languageFeatureLabel: {
        fontSize: 14,
    },
    featureIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureIndicatorText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    categoryContainer: {
        marginBottom: 15,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
    },
    cultureBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    cultureText: {
        fontSize: 12,
        fontWeight: '600',
    },
    tipsContainer: {
        marginBottom: 15,
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    tip: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    promptsContainer: {
        marginBottom: 15,
    },
    promptsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    prompt: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    ministryContextContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
    },
    ministryContextTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ministryContextText: {
        fontSize: 13,
        lineHeight: 18,
    },
    languageBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    languageText: {
        fontSize: 12,
        fontWeight: '600',
    },
    translationText: {
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    pronunciationText: {
        fontSize: 14,
        marginBottom: 15,
        fontStyle: 'italic',
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