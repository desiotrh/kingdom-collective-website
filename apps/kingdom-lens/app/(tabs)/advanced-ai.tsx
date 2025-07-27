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
    Image,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface StyleTransfer {
    id: string;
    name: string;
    category: 'Portrait' | 'Landscape' | 'Wedding' | 'Commercial' | 'Ministry';
    description: string;
    beforeImage: string;
    afterImage: string;
    styleStrength: number;
    processingTime: string;
    ministryThemed?: boolean;
}

interface BackgroundReplacement {
    id: string;
    name: string;
    originalBackground: string;
    newBackground: string;
    resultImage: string;
    technique: 'AI' | 'Manual' | 'Hybrid';
    quality: 'Excellent' | 'Good' | 'Fair';
    processingTime: string;
    useCase: string;
}

interface ExpressionEnhancement {
    id: string;
    name: string;
    originalImage: string;
    enhancedImage: string;
    enhancements: string[];
    subtlety: 'Very Subtle' | 'Subtle' | 'Moderate' | 'Enhanced';
    processingTime: string;
    ministryContext?: string;
}

interface DivineBeautyFilter {
    id: string;
    name: string;
    description: string;
    beforeImage: string;
    afterImage: string;
    scripture: string;
    effect: string;
    intensity: number;
}

export default function AdvancedAIScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [activeTab, setActiveTab] = useState<'style-transfer' | 'background-replacement' | 'expression-enhancement' | 'divine-beauty'>('style-transfer');
    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');

    // Mock data
    const [styleTransfers, setStyleTransfers] = useState<StyleTransfer[]>([
        {
            id: '1',
            name: 'Golden Hour Portrait',
            category: 'Portrait',
            description: 'Apply warm, golden lighting to portrait photos',
            beforeImage: 'https://example.com/before1.jpg',
            afterImage: 'https://example.com/after1.jpg',
            styleStrength: 0.8,
            processingTime: '2.3s',
            ministryThemed: false
        },
        {
            id: '2',
            name: 'Divine Light Effect',
            category: 'Ministry',
            description: 'Add heavenly light rays and warm glow for ministry photos',
            beforeImage: 'https://example.com/before2.jpg',
            afterImage: 'https://example.com/after2.jpg',
            styleStrength: 0.9,
            processingTime: '3.1s',
            ministryThemed: true
        },
        {
            id: '3',
            name: 'Wedding Elegance',
            category: 'Wedding',
            description: 'Sophisticated wedding photography style with soft lighting',
            beforeImage: 'https://example.com/before3.jpg',
            afterImage: 'https://example.com/after3.jpg',
            styleStrength: 0.7,
            processingTime: '2.8s',
            ministryThemed: false
        }
    ]);

    const [backgroundReplacements, setBackgroundReplacements] = useState<BackgroundReplacement[]>([
        {
            id: '1',
            name: 'Studio to Garden',
            originalBackground: 'https://example.com/studio.jpg',
            newBackground: 'https://example.com/garden.jpg',
            resultImage: 'https://example.com/result1.jpg',
            technique: 'AI',
            quality: 'Excellent',
            processingTime: '4.2s',
            useCase: 'Portrait session background enhancement'
        },
        {
            id: '2',
            name: 'Church Interior',
            originalBackground: 'https://example.com/plain.jpg',
            newBackground: 'https://example.com/church.jpg',
            resultImage: 'https://example.com/result2.jpg',
            technique: 'Hybrid',
            quality: 'Good',
            processingTime: '5.1s',
            useCase: 'Ministry event photography'
        }
    ]);

    const [expressionEnhancements, setExpressionEnhancements] = useState<ExpressionEnhancement[]>([
        {
            id: '1',
            name: 'Natural Smile Enhancement',
            originalImage: 'https://example.com/original1.jpg',
            enhancedImage: 'https://example.com/enhanced1.jpg',
            enhancements: ['Brightened eyes', 'Softened smile lines', 'Enhanced natural glow'],
            subtlety: 'Subtle',
            processingTime: '1.8s'
        },
        {
            id: '2',
            name: 'Joyful Expression',
            originalImage: 'https://example.com/original2.jpg',
            enhancedImage: 'https://example.com/enhanced2.jpg',
            enhancements: ['Enhanced smile', 'Brightened eyes', 'Added warmth'],
            subtlety: 'Moderate',
            processingTime: '2.1s',
            ministryContext: 'Baptism celebration photo'
        }
    ]);

    const [divineBeautyFilters, setDivineBeautyFilters] = useState<DivineBeautyFilter[]>([
        {
            id: '1',
            name: 'Heavenly Light',
            description: 'Add soft, divine light rays and warm glow',
            beforeImage: 'https://example.com/before_divine1.jpg',
            afterImage: 'https://example.com/after_divine1.jpg',
            scripture: 'Psalm 19:1 - "The heavens declare the glory of God"',
            effect: 'Warm light rays, enhanced glow',
            intensity: 0.8
        },
        {
            id: '2',
            name: 'Joy of the Lord',
            description: 'Enhance natural joy and radiance in expressions',
            beforeImage: 'https://example.com/before_divine2.jpg',
            afterImage: 'https://example.com/after_divine2.jpg',
            scripture: 'Nehemiah 8:10 - "The joy of the Lord is your strength"',
            effect: 'Enhanced smiles, brightened eyes',
            intensity: 0.7
        },
        {
            id: '3',
            name: 'Peace that Surpasses',
            description: 'Create serene, peaceful expressions and atmosphere',
            beforeImage: 'https://example.com/before_divine3.jpg',
            afterImage: 'https://example.com/after_divine3.jpg',
            scripture: 'Philippians 4:7 - "Peace that surpasses understanding"',
            effect: 'Softened features, peaceful expression',
            intensity: 0.6
        }
    ]);

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Divine AI Tools';
        } else if (encouragementMode) {
            return 'Advanced AI Features';
        }
        return 'AI Enhancement Tools';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'AI-powered tools for Kingdom photography';
        } else if (encouragementMode) {
            return 'Cutting-edge AI enhancement tools';
        }
        return 'Advanced AI-powered photo enhancement';
    };

    const getQualityColor = (quality: string) => {
        switch (quality) {
            case 'Excellent':
                return theme.colors.success;
            case 'Good':
                return theme.colors.primary;
            case 'Fair':
                return theme.colors.warning;
            default:
                return theme.colors.textSecondary;
        }
    };

    const getSubtletyColor = (subtlety: string) => {
        switch (subtlety) {
            case 'Very Subtle':
                return theme.colors.success;
            case 'Subtle':
                return theme.colors.primary;
            case 'Moderate':
                return theme.colors.warning;
            case 'Enhanced':
                return theme.colors.error;
            default:
                return theme.colors.textSecondary;
        }
    };

    const renderStyleTransferCard = ({ item }: { item: StyleTransfer }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={[styles.categoryBadge, { backgroundColor: theme.colors.info }]}>
                    <Text style={[styles.categoryText, { color: theme.colors.surface }]}>
                        {item.category}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                {item.description}
            </Text>

            <View style={styles.imageComparison}>
                <View style={styles.imageContainer}>
                    <Text style={[styles.imageLabel, { color: theme.colors.textSecondary }]}>
                        Before
                    </Text>
                    <View style={styles.imagePlaceholder}>
                        <Text style={[styles.imagePlaceholderText, { color: theme.colors.textSecondary }]}>
                            📷
                        </Text>
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Text style={[styles.imageLabel, { color: theme.colors.textSecondary }]}>
                        After
                    </Text>
                    <View style={styles.imagePlaceholder}>
                        <Text style={[styles.imagePlaceholderText, { color: theme.colors.textSecondary }]}>
                            ✨
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.metricsRow}>
                <View style={styles.metric}>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                        Style Strength
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
                        {(item.styleStrength * 100).toFixed(0)}%
                    </Text>
                </View>
                <View style={styles.metric}>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                        Processing Time
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
                        {item.processingTime}
                    </Text>
                </View>
            </View>

            {faithMode && item.ministryThemed && (
                <View style={styles.ministryBadge}>
                    <Text style={[styles.ministryBadgeText, { color: faithTheme.colors.primary }]}>
                        ✨ Ministry Themed
                    </Text>
                </View>
            )}

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('Apply Style', `Applying ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Apply Style
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

    const renderBackgroundReplacementCard = ({ item }: { item: BackgroundReplacement }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={[styles.qualityBadge, { backgroundColor: getQualityColor(item.quality) }]}>
                    <Text style={[styles.qualityText, { color: theme.colors.surface }]}>
                        {item.quality}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                {item.useCase}
            </Text>

            <View style={styles.backgroundComparison}>
                <View style={styles.imageContainer}>
                    <Text style={[styles.imageLabel, { color: theme.colors.textSecondary }]}>
                        Original
                    </Text>
                    <View style={styles.imagePlaceholder}>
                        <Text style={[styles.imagePlaceholderText, { color: theme.colors.textSecondary }]}>
                            🏠
                        </Text>
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Text style={[styles.imageLabel, { color: theme.colors.textSecondary }]}>
                        New Background
                    </Text>
                    <View style={styles.imagePlaceholder}>
                        <Text style={[styles.imagePlaceholderText, { color: theme.colors.textSecondary }]}>
                            🌸
                        </Text>
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Text style={[styles.imageLabel, { color: theme.colors.textSecondary }]}>
                        Result
                    </Text>
                    <View style={styles.imagePlaceholder}>
                        <Text style={[styles.imagePlaceholderText, { color: theme.colors.textSecondary }]}>
                            ✨
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.metricsRow}>
                <View style={styles.metric}>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                        Technique
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
                        {item.technique}
                    </Text>
                </View>
                <View style={styles.metric}>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                        Processing Time
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
                        {item.processingTime}
                    </Text>
                </View>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('Replace Background', `Processing ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Replace Background
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('View Result', `Opening ${item.name} result...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Result
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderExpressionEnhancementCard = ({ item }: { item: ExpressionEnhancement }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={[styles.subtletyBadge, { backgroundColor: getSubtletyColor(item.subtlety) }]}>
                    <Text style={[styles.subtletyText, { color: theme.colors.surface }]}>
                        {item.subtlety}
                    </Text>
                </View>
            </View>

            <View style={styles.imageComparison}>
                <View style={styles.imageContainer}>
                    <Text style={[styles.imageLabel, { color: theme.colors.textSecondary }]}>
                        Original
                    </Text>
                    <View style={styles.imagePlaceholder}>
                        <Text style={[styles.imagePlaceholderText, { color: theme.colors.textSecondary }]}>
                            😊
                        </Text>
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Text style={[styles.imageLabel, { color: theme.colors.textSecondary }]}>
                        Enhanced
                    </Text>
                    <View style={styles.imagePlaceholder}>
                        <Text style={[styles.imagePlaceholderText, { color: theme.colors.textSecondary }]}>
                            ✨
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.enhancementsContainer}>
                <Text style={[styles.enhancementsTitle, { color: theme.colors.text }]}>
                    ✨ Enhancements:
                </Text>
                {item.enhancements.map((enhancement, index) => (
                    <Text key={index} style={[styles.enhancement, { color: theme.colors.textSecondary }]}>
                        • {enhancement}
                    </Text>
                ))}
            </View>

            {faithMode && item.ministryContext && (
                <View style={styles.ministryContextContainer}>
                    <Text style={[styles.ministryContextTitle, { color: faithTheme.colors.primary }]}>
                        🙏 Ministry Context:
                    </Text>
                    <Text style={[styles.ministryContextText, { color: faithTheme.colors.textSecondary }]}>
                        {item.ministryContext}
                    </Text>
                </View>
            )}

            <Text style={[styles.processingTime, { color: theme.colors.textSecondary }]}>
                ⏱️ Processing: {item.processingTime}
            </Text>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('Enhance Expression', `Processing ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Enhance Expression
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('View Result', `Opening ${item.name} result...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Result
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderDivineBeautyCard = ({ item }: { item: DivineBeautyFilter }) => (
        <View style={[styles.card, { backgroundColor: faithTheme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: faithTheme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={[styles.intensityBadge, { backgroundColor: faithTheme.colors.primary }]}>
                    <Text style={[styles.intensityText, { color: faithTheme.colors.surface }]}>
                        {(item.intensity * 100).toFixed(0)}%
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardDescription, { color: faithTheme.colors.textSecondary }]}>
                {item.description}
            </Text>

            <View style={styles.imageComparison}>
                <View style={styles.imageContainer}>
                    <Text style={[styles.imageLabel, { color: faithTheme.colors.textSecondary }]}>
                        Before
                    </Text>
                    <View style={styles.imagePlaceholder}>
                        <Text style={[styles.imagePlaceholderText, { color: faithTheme.colors.textSecondary }]}>
                            📷
                        </Text>
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Text style={[styles.imageLabel, { color: faithTheme.colors.textSecondary }]}>
                        After
                    </Text>
                    <View style={styles.imagePlaceholder}>
                        <Text style={[styles.imagePlaceholderText, { color: faithTheme.colors.textSecondary }]}>
                            ✨
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.divineEffectContainer}>
                <Text style={[styles.divineEffectTitle, { color: faithTheme.colors.primary }]}>
                    ✨ Effect:
                </Text>
                <Text style={[styles.divineEffectText, { color: faithTheme.colors.textSecondary }]}>
                    {item.effect}
                </Text>
            </View>

            <Text style={[styles.scriptureText, { color: faithTheme.colors.primary }]}>
                📖 {item.scripture}
            </Text>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: faithTheme.colors.primary }]}
                    onPress={() => Alert.alert('Apply Divine Filter', `Applying ${item.name}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: faithTheme.colors.surface }]}>
                        Apply Divine Filter
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: faithTheme.colors.success }]}
                    onPress={() => Alert.alert('View Result', `Opening ${item.name} result...`)}
                >
                    <Text style={[styles.actionButtonText, { color: faithTheme.colors.surface }]}>
                        View Result
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'style-transfer':
                return (
                    <FlatList
                        data={styleTransfers}
                        renderItem={renderStyleTransferCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'background-replacement':
                return (
                    <FlatList
                        data={backgroundReplacements}
                        renderItem={renderBackgroundReplacementCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'expression-enhancement':
                return (
                    <FlatList
                        data={expressionEnhancements}
                        renderItem={renderExpressionEnhancementCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'divine-beauty':
                return faithMode ? (
                    <FlatList
                        data={divineBeautyFilters}
                        renderItem={renderDivineBeautyCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                            Divine beauty filters are available in Faith Mode
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
                        style={[styles.tab, activeTab === 'style-transfer' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('style-transfer')}
                    >
                        <Text style={[styles.tabText, activeTab === 'style-transfer' && { color: theme.colors.surface }]}>
                            🎨 Style Transfer
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'background-replacement' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('background-replacement')}
                    >
                        <Text style={[styles.tabText, activeTab === 'background-replacement' && { color: theme.colors.surface }]}>
                            🏠 Background
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'expression-enhancement' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('expression-enhancement')}
                    >
                        <Text style={[styles.tabText, activeTab === 'expression-enhancement' && { color: theme.colors.surface }]}>
                            😊 Expression
                        </Text>
                    </TouchableOpacity>
                    {faithMode && (
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'divine-beauty' && { backgroundColor: faithTheme.colors.primary }]}
                            onPress={() => setActiveTab('divine-beauty')}
                        >
                            <Text style={[styles.tabText, activeTab === 'divine-beauty' && { color: faithTheme.colors.surface }]}>
                                ✨ Divine Beauty
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
    imageComparison: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    backgroundComparison: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    imageContainer: {
        alignItems: 'center',
        flex: 1,
    },
    imageLabel: {
        fontSize: 12,
        marginBottom: 5,
        textAlign: 'center',
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        fontSize: 24,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    metric: {
        alignItems: 'center',
        flex: 1,
    },
    metricLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 'bold',
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
    qualityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    qualityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    subtletyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    subtletyText: {
        fontSize: 12,
        fontWeight: '600',
    },
    intensityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    intensityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    ministryBadge: {
        marginBottom: 15,
    },
    ministryBadgeText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    enhancementsContainer: {
        marginBottom: 15,
    },
    enhancementsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    enhancement: {
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
    processingTime: {
        fontSize: 13,
        marginBottom: 15,
    },
    divineEffectContainer: {
        marginBottom: 15,
    },
    divineEffectTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    divineEffectText: {
        fontSize: 13,
        lineHeight: 18,
    },
    scriptureText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
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