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
    Modal,
    Switch,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';

const { width, height } = Dimensions.get('window');

interface FaithFeature {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'filter' | 'gallery' | 'inspiration' | 'premium';
    isActive: boolean;
    isPremium: boolean;
    options?: string[];
}

interface FaithFilter {
    id: string;
    name: string;
    description: string;
    scripture: string;
    aesthetic: string;
    isActive: boolean;
}

interface ClientGallery {
    id: string;
    name: string;
    clientName: string;
    sessionDate: Date;
    photoCount: number;
    isPublished: boolean;
    shareLink: string;
}

const PremiumFaithFeaturesScreen: React.FC = () => {
    const { faithMode } = useFaithMode();
    const [faithFeatures, setFaithFeatures] = useState<FaithFeature[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'filter' | 'gallery' | 'inspiration' | 'premium'>('filter');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [showInspirationModal, setShowInspirationModal] = useState(false);
    const [faithFilters, setFaithFilters] = useState<FaithFilter[]>([]);
    const [clientGalleries, setClientGalleries] = useState<ClientGallery[]>([]);
    const [spiritualInspiration, setSpiritualInspiration] = useState(false);

    const faithFeaturesData: FaithFeature[] = [
        // Faith Mode Filters
        {
            id: 'faith-mode-filters',
            name: 'Faith Mode Filters',
            description: 'Subtle lighting, purity aesthetic, scripture-based overlays',
            icon: 'heart',
            category: 'filter',
            isActive: false,
            isPremium: true,
            options: ['Purity Aesthetic', 'Scripture Overlays', 'Subtle Lighting', 'Modest Enhancement']
        },
        {
            id: 'divine-lighting',
            name: 'Divine Lighting',
            description: 'Enhance photos with heavenly light and warmth',
            icon: 'sunny',
            category: 'filter',
            isActive: false,
            isPremium: true,
            options: ['Golden Hour', 'Soft Glow', 'Natural Warmth', 'Heavenly Light']
        },
        {
            id: 'scripture-overlays',
            name: 'Scripture Overlays',
            description: 'Add meaningful scripture text to your photos',
            icon: 'book',
            category: 'filter',
            isActive: false,
            isPremium: true,
            options: ['Inspirational Quotes', 'Bible Verses', 'Faith Messages', 'Custom Text']
        },

        // Client Gallery Builder
        {
            id: 'client-gallery-builder',
            name: 'Client Gallery Builder',
            description: 'Export sessions as branded preview galleries with client watermarking',
            icon: 'images',
            category: 'gallery',
            isActive: false,
            isPremium: true,
            options: ['Branded Gallery', 'Client Watermarking', 'Share Link', 'Download Controls']
        },
        {
            id: 'feedback-tools',
            name: 'Feedback Tools',
            description: 'Client feedback and approval system for galleries',
            icon: 'chatbubbles',
            category: 'gallery',
            isActive: false,
            isPremium: true,
            options: ['Client Comments', 'Approval System', 'Revision Requests', 'Rating System']
        },
        {
            id: 'gallery-analytics',
            name: 'Gallery Analytics',
            description: 'Track gallery views, downloads, and client engagement',
            icon: 'analytics',
            category: 'gallery',
            isActive: false,
            isPremium: true,
            options: ['View Tracking', 'Download Stats', 'Client Engagement', 'Performance Reports']
        },

        // Spiritual Inspiration
        {
            id: 'spiritual-inspiration',
            name: 'Spiritual Inspiration Toggle',
            description: 'Includes scripture, affirmations, and prayer for creators',
            icon: 'pray',
            category: 'inspiration',
            isActive: false,
            isPremium: false,
            options: ['Daily Scripture', 'Prayer Prompts', 'Faith Affirmations', 'Meditation Guides']
        },
        {
            id: 'stress-relief',
            name: 'Stress Relief Tools',
            description: 'Tools for managing stress during long editing sessions',
            icon: 'leaf',
            category: 'inspiration',
            isActive: false,
            isPremium: false,
            options: ['Breathing Exercises', 'Meditation Timer', 'Calming Music', 'Prayer Timer']
        },
        {
            id: 'community-support',
            name: 'Community Support',
            description: 'Connect with other faith-based photographers',
            icon: 'people',
            category: 'inspiration',
            isActive: false,
            isPremium: false,
            options: ['Faith Community', 'Prayer Requests', 'Encouragement', 'Mentorship']
        },

        // Premium Features
        {
            id: 'advanced-ai',
            name: 'Advanced AI Features',
            description: 'Premium AI tools for professional photography',
            icon: 'sparkles',
            category: 'premium',
            isActive: false,
            isPremium: true,
            options: ['AI Retouching', 'Smart Cropping', 'Auto Enhancement', 'Batch Processing']
        },
        {
            id: 'priority-support',
            name: 'Priority Support',
            description: '24/7 priority customer support for premium users',
            icon: 'headset',
            category: 'premium',
            isActive: false,
            isPremium: true,
            options: ['24/7 Support', 'Priority Response', 'Video Calls', 'Custom Training']
        },
        {
            id: 'advanced-analytics',
            name: 'Advanced Analytics',
            description: 'Detailed analytics and business insights',
            icon: 'trending-up',
            category: 'premium',
            isActive: false,
            isPremium: true,
            options: ['Business Insights', 'Client Analytics', 'Revenue Tracking', 'Performance Reports']
        },
    ];

    const faithFilterPresets: FaithFilter[] = [
        {
            id: 'purity-filter',
            name: 'Purity Aesthetic',
            description: 'Enhance natural beauty with subtle, pure lighting',
            scripture: 'Psalm 139:14 - "I praise you because I am fearfully and wonderfully made"',
            aesthetic: 'Soft, natural lighting with gentle enhancement',
            isActive: false
        },
        {
            id: 'grace-filter',
            name: 'Grace & Dignity',
            description: 'Highlight inner grace and dignity in portraits',
            scripture: 'Proverbs 31:25 - "She is clothed with strength and dignity"',
            aesthetic: 'Elegant lighting with dignified composition',
            isActive: false
        },
        {
            id: 'joy-filter',
            name: 'Joy & Light',
            description: 'Capture inner joy and light in expressions',
            scripture: 'Psalm 16:11 - "You make known to me the path of life; you will fill me with joy"',
            aesthetic: 'Warm, uplifting lighting with joyful tones',
            isActive: false
        },
        {
            id: 'peace-filter',
            name: 'Peace & Serenity',
            description: 'Create peaceful, serene atmospheres',
            scripture: 'Philippians 4:7 - "The peace of God, which transcends all understanding"',
            aesthetic: 'Calm, soothing lighting with peaceful tones',
            isActive: false
        },
        {
            id: 'love-filter',
            name: 'Love & Connection',
            description: 'Emphasize love and connection in family photos',
            scripture: '1 Corinthians 13:4-7 - "Love is patient, love is kind"',
            aesthetic: 'Warm, intimate lighting with loving tones',
            isActive: false
        }
    ];

    useEffect(() => {
        setFaithFeatures(faithFeaturesData);
        setFaithFilters(faithFilterPresets);
    }, [faithMode]);

    const toggleFeature = (featureId: string) => {
        setFaithFeatures(prev =>
            prev.map(feature =>
                feature.id === featureId ? { ...feature, isActive: !feature.isActive } : feature
            )
        );
    };

    const toggleFilter = (filterId: string) => {
        setFaithFilters(prev =>
            prev.map(filter =>
                filter.id === filterId ? { ...filter, isActive: !filter.isActive } : filter
            )
        );
    };

    const createClientGallery = () => {
        Alert.alert(
            'Create Client Gallery',
            'Enter client details to create a branded gallery.',
            [
                {
                    text: 'Create Gallery', onPress: () => {
                        const newGallery: ClientGallery = {
                            id: `gallery_${Date.now()}`,
                            name: 'Client Session Gallery',
                            clientName: 'Sample Client',
                            sessionDate: new Date(),
                            photoCount: Math.floor(Math.random() * 50) + 10,
                            isPublished: false,
                            shareLink: `https://kingdomlens.app/gallery/${Date.now()}`
                        };
                        setClientGalleries(prev => [newGallery, ...prev]);
                        Alert.alert('Gallery Created', 'Client gallery has been created successfully!');
                    }
                },
                { text: 'Cancel' }
            ]
        );
    };

    const getSpiritualInspiration = () => {
        const inspirations = [
            'Take a moment to breathe and thank God for your creative gifts.',
            'Remember that every photo you take captures a moment of God\'s creation.',
            'Let your work reflect the beauty and love that God has placed in your heart.',
            'Trust in the Lord\'s guidance as you create beautiful images.',
            'Your photography can bring joy and inspiration to others.',
            'Take time to pray before starting your editing session.',
            'Remember that you are using your talents to glorify God.',
            'Let patience and love guide your creative process.',
            'Your work can be a blessing to families and individuals.',
            'Trust that God will provide the inspiration you need.'
        ];
        const randomInspiration = inspirations[Math.floor(Math.random() * inspirations.length)];
        Alert.alert('Spiritual Inspiration', randomInspiration);
    };

    const renderFaithFeature = (feature: FaithFeature) => (
        <TouchableOpacity
            key={feature.id}
            style={[
                styles.featureCard,
                feature.isActive && styles.featureCardActive,
                feature.category !== selectedCategory && styles.featureCardHidden
            ]}
            onPress={() => toggleFeature(feature.id)}
        >
            <View style={styles.featureHeader}>
                <Ionicons
                    name={feature.icon as any}
                    size={24}
                    color={feature.isActive ? '#FFFFFF' : Colors.light.accent}
                />
                <View style={styles.featureInfo}>
                    <Text style={[
                        styles.featureName,
                        feature.isActive && styles.featureNameActive
                    ]}>
                        {feature.name}
                    </Text>
                    <Text style={[
                        styles.featureDescription,
                        feature.isActive && styles.featureDescriptionActive
                    ]}>
                        {feature.description}
                    </Text>
                </View>
                <View style={styles.featureControls}>
                    {feature.isPremium && (
                        <Text style={styles.premiumBadge}>PRO</Text>
                    )}
                    <Switch
                        value={feature.isActive}
                        onValueChange={() => toggleFeature(feature.id)}
                        trackColor={{ false: '#E5E5E5', true: '#FFFFFF' }}
                        thumbColor={feature.isActive ? Colors.light.accent : '#666666'}
                    />
                </View>
            </View>

            {feature.isActive && feature.options && (
                <View style={styles.optionsContainer}>
                    {feature.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.optionButton}
                            onPress={() => {
                                if (feature.id === 'spiritual-inspiration') {
                                    getSpiritualInspiration();
                                } else if (feature.id === 'client-gallery-builder') {
                                    createClientGallery();
                                } else {
                                    Alert.alert('Option Selected', option);
                                }
                            }}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );

    const renderCategoryTabs = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
            {[
                { id: 'filter', name: 'Filters', icon: 'heart' },
                { id: 'gallery', name: 'Gallery', icon: 'images' },
                { id: 'inspiration', name: 'Inspiration', icon: 'pray' },
                { id: 'premium', name: 'Premium', icon: 'diamond' },
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

    const renderFaithFilters = () => (
        <View style={styles.filtersSection}>
            <Text style={styles.sectionTitle}>Faith Mode Filters</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {faithFilters.map((filter) => (
                    <TouchableOpacity
                        key={filter.id}
                        style={[
                            styles.filterCard,
                            filter.isActive && styles.filterCardActive
                        ]}
                        onPress={() => toggleFilter(filter.id)}
                    >
                        <View style={styles.filterHeader}>
                            <Text style={[
                                styles.filterName,
                                filter.isActive && styles.filterNameActive
                            ]}>
                                {filter.name}
                            </Text>
                            <Switch
                                value={filter.isActive}
                                onValueChange={() => toggleFilter(filter.id)}
                                trackColor={{ false: '#E5E5E5', true: Colors.light.accent }}
                                thumbColor={filter.isActive ? '#FFFFFF' : '#666666'}
                            />
                        </View>
                        <Text style={[
                            styles.filterDescription,
                            filter.isActive && styles.filterDescriptionActive
                        ]}>
                            {filter.description}
                        </Text>
                        <Text style={[
                            styles.scriptureText,
                            filter.isActive && styles.scriptureTextActive
                        ]}>
                            {filter.scripture}
                        </Text>
                        <Text style={[
                            styles.aestheticText,
                            filter.isActive && styles.aestheticTextActive
                        ]}>
                            Aesthetic: {filter.aesthetic}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderClientGalleries = () => (
        <View style={styles.galleriesSection}>
            <Text style={styles.sectionTitle}>Client Galleries</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {clientGalleries.map((gallery) => (
                    <TouchableOpacity
                        key={gallery.id}
                        style={styles.galleryCard}
                        onPress={() => Alert.alert('Gallery Details', `Gallery: ${gallery.name}\nClient: ${gallery.clientName}\nPhotos: ${gallery.photoCount}`)}
                    >
                        <Ionicons name="images" size={24} color={Colors.light.accent} />
                        <Text style={styles.galleryName}>{gallery.name}</Text>
                        <Text style={styles.galleryClient}>{gallery.clientName}</Text>
                        <Text style={styles.galleryPhotos}>{gallery.photoCount} photos</Text>
                        <Text style={styles.galleryDate}>
                            {gallery.sessionDate.toLocaleDateString()}
                        </Text>
                        {gallery.isPublished ? (
                            <Text style={styles.publishedBadge}>Published</Text>
                        ) : (
                            <Text style={styles.draftBadge}>Draft</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {faithMode ? 'Divine Premium Features' : 'Premium & Faith Features'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {faithMode
                            ? 'Advanced features that enhance your photography with faith and love'
                            : 'Premium features and faith-inspired tools for professional photography'
                        }
                    </Text>
                </View>

                {renderCategoryTabs()}

                <View style={styles.featuresContainer}>
                    {faithFeatures
                        .filter(feature => feature.category === selectedCategory)
                        .map(renderFaithFeature)
                    }
                </View>

                {selectedCategory === 'filter' && renderFaithFilters()}
                {selectedCategory === 'gallery' && renderClientGalleries()}

                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => Alert.alert('Features Applied', 'Your premium and faith features have been applied successfully!')}
                >
                    <LinearGradient
                        colors={[Colors.light.accent, '#4A90E2']}
                        style={styles.applyButtonGradient}
                    >
                        <Text style={styles.applyButtonText}>
                            {faithMode ? 'Apply Divine Features' : 'Apply Premium Features'}
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
        marginBottom: 8,
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
    featuresContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    featureCard: {
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
    featureCardActive: {
        backgroundColor: Colors.light.accent,
        borderColor: Colors.light.accent,
    },
    featureCardHidden: {
        display: 'none',
    },
    featureHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureInfo: {
        flex: 1,
        marginLeft: 12,
        marginRight: 12,
    },
    featureName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    featureNameActive: {
        color: '#FFFFFF',
    },
    featureDescription: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 18,
    },
    featureDescriptionActive: {
        color: '#FFFFFF',
        opacity: 0.9,
    },
    featureControls: {
        alignItems: 'flex-end',
    },
    premiumBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 4,
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
    filtersSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    galleriesSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 16,
    },
    filterCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    filterCardActive: {
        backgroundColor: Colors.light.accent,
        borderColor: Colors.light.accent,
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    filterName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    filterNameActive: {
        color: '#FFFFFF',
    },
    filterDescription: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 18,
        marginBottom: 8,
    },
    filterDescriptionActive: {
        color: '#FFFFFF',
        opacity: 0.9,
    },
    scriptureText: {
        fontSize: 12,
        color: Colors.light.accent,
        fontStyle: 'italic',
        marginBottom: 4,
    },
    scriptureTextActive: {
        color: '#FFFFFF',
        opacity: 0.8,
    },
    aestheticText: {
        fontSize: 12,
        color: Colors.light.text,
        opacity: 0.7,
    },
    aestheticTextActive: {
        color: '#FFFFFF',
        opacity: 0.7,
    },
    galleryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginRight: 16,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    galleryName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 8,
        marginBottom: 4,
    },
    galleryClient: {
        fontSize: 14,
        color: Colors.light.text,
        marginBottom: 4,
    },
    galleryPhotos: {
        fontSize: 12,
        color: Colors.light.accent,
        marginBottom: 4,
    },
    galleryDate: {
        fontSize: 12,
        color: Colors.light.text,
        marginBottom: 8,
    },
    publishedBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#28A745',
    },
    draftBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFC107',
    },
    applyButton: {
        marginHorizontal: 20,
        marginBottom: 24,
        borderRadius: 12,
        overflow: 'hidden',
    },
    applyButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default PremiumFaithFeaturesScreen; 