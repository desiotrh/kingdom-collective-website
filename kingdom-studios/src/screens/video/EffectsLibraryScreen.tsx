import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { KingdomColors } from '../../constants/KingdomColors';
import { useDualMode } from '../../contexts/DualModeContext';

const { width } = Dimensions.get('window');

interface Effect {
    id: string;
    name: string;
    category: 'transition' | 'filter' | 'overlay' | 'animation';
    type: string;
    preview: string;
    isFaithMode?: boolean;
    isPremium?: boolean;
    parameters?: any;
}

interface EffectsLibraryScreenProps {
    navigation: any;
}

export default function EffectsLibraryScreen({ navigation }: EffectsLibraryScreenProps) {
    const { isFaithMode } = useDualMode();

    // State
    const [selectedCategory, setSelectedCategory] = useState<string>('transition');
    const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
    const [effects, setEffects] = useState<Effect[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadEffects();
    }, [selectedCategory, isFaithMode]);

    const loadEffects = () => {
        const allEffects: Effect[] = [
            // Transitions
            {
                id: 'fade',
                name: 'Fade',
                category: 'transition',
                type: 'fade',
                preview: 'fade_preview.gif',
            },
            {
                id: 'slide_left',
                name: 'Slide Left',
                category: 'transition',
                type: 'slide',
                preview: 'slide_left_preview.gif',
            },
            {
                id: 'slide_right',
                name: 'Slide Right',
                category: 'transition',
                type: 'slide',
                preview: 'slide_right_preview.gif',
            },
            {
                id: 'zoom_in',
                name: 'Zoom In',
                category: 'transition',
                type: 'zoom',
                preview: 'zoom_in_preview.gif',
            },
            {
                id: 'zoom_out',
                name: 'Zoom Out',
                category: 'transition',
                type: 'zoom',
                preview: 'zoom_out_preview.gif',
            },
            {
                id: 'glitch',
                name: 'Glitch',
                category: 'transition',
                type: 'glitch',
                preview: 'glitch_preview.gif',
                isPremium: true,
            },
            {
                id: 'morph',
                name: 'Morph',
                category: 'transition',
                type: 'morph',
                preview: 'morph_preview.gif',
                isPremium: true,
            },
            {
                id: 'wipe_up',
                name: 'Wipe Up',
                category: 'transition',
                type: 'wipe',
                preview: 'wipe_up_preview.gif',
            },
            {
                id: 'wipe_down',
                name: 'Wipe Down',
                category: 'transition',
                type: 'wipe',
                preview: 'wipe_down_preview.gif',
            },
            {
                id: 'dissolve',
                name: 'Dissolve',
                category: 'transition',
                type: 'dissolve',
                preview: 'dissolve_preview.gif',
            },
            {
                id: 'flip_horizontal',
                name: 'Flip Horizontal',
                category: 'transition',
                type: 'flip',
                preview: 'flip_h_preview.gif',
            },
            {
                id: 'flip_vertical',
                name: 'Flip Vertical',
                category: 'transition',
                type: 'flip',
                preview: 'flip_v_preview.gif',
            },
            {
                id: 'swipe_left',
                name: 'Swipe Left',
                category: 'transition',
                type: 'swipe',
                preview: 'swipe_left_preview.gif',
            },
            {
                id: 'swipe_right',
                name: 'Swipe Right',
                category: 'transition',
                type: 'swipe',
                preview: 'swipe_right_preview.gif',
            },
            {
                id: 'cross_fade',
                name: 'Cross Fade',
                category: 'transition',
                type: 'cross_fade',
                preview: 'cross_fade_preview.gif',
            },

            // Filters
            {
                id: 'brightness',
                name: 'Brightness',
                category: 'filter',
                type: 'brightness',
                preview: 'brightness_preview.jpg',
            },
            {
                id: 'contrast',
                name: 'Contrast',
                category: 'filter',
                type: 'contrast',
                preview: 'contrast_preview.jpg',
            },
            {
                id: 'saturation',
                name: 'Saturation',
                category: 'filter',
                type: 'saturation',
                preview: 'saturation_preview.jpg',
            },
            {
                id: 'vintage',
                name: 'Vintage',
                category: 'filter',
                type: 'vintage',
                preview: 'vintage_preview.jpg',
            },
            {
                id: 'black_white',
                name: 'Black & White',
                category: 'filter',
                type: 'black_white',
                preview: 'black_white_preview.jpg',
            },
            {
                id: 'sepia',
                name: 'Sepia',
                category: 'filter',
                type: 'sepia',
                preview: 'sepia_preview.jpg',
            },

            // Overlays
            {
                id: 'faith_glow',
                name: 'Faith Glow',
                category: 'overlay',
                type: 'glow',
                preview: 'faith_glow_preview.png',
                isFaithMode: true,
            },
            {
                id: 'cross_overlay',
                name: 'Cross Overlay',
                category: 'overlay',
                type: 'symbol',
                preview: 'cross_overlay_preview.png',
                isFaithMode: true,
            },
            {
                id: 'prayer_hands',
                name: 'Prayer Hands',
                category: 'overlay',
                type: 'symbol',
                preview: 'prayer_hands_preview.png',
                isFaithMode: true,
            },
            {
                id: 'inspiration_text',
                name: 'Inspiration Text',
                category: 'overlay',
                type: 'text',
                preview: 'inspiration_text_preview.png',
                isFaithMode: true,
            },
            {
                id: 'motivational_quote',
                name: 'Motivational Quote',
                category: 'overlay',
                type: 'text',
                preview: 'motivational_quote_preview.png',
            },
            {
                id: 'sparkle_effect',
                name: 'Sparkle Effect',
                category: 'overlay',
                type: 'particle',
                preview: 'sparkle_preview.gif',
            },
            {
                id: 'light_leak',
                name: 'Light Leak',
                category: 'overlay',
                type: 'light',
                preview: 'light_leak_preview.png',
            },

            // Animations
            {
                id: 'bounce',
                name: 'Bounce',
                category: 'animation',
                type: 'bounce',
                preview: 'bounce_preview.gif',
            },
            {
                id: 'fade_in',
                name: 'Fade In',
                category: 'animation',
                type: 'fade_in',
                preview: 'fade_in_preview.gif',
            },
            {
                id: 'slide_in',
                name: 'Slide In',
                category: 'animation',
                type: 'slide_in',
                preview: 'slide_in_preview.gif',
            },
            {
                id: 'scale_in',
                name: 'Scale In',
                category: 'animation',
                type: 'scale_in',
                preview: 'scale_in_preview.gif',
            },
            {
                id: 'rotate_in',
                name: 'Rotate In',
                category: 'animation',
                type: 'rotate_in',
                preview: 'rotate_in_preview.gif',
            },
        ];

        // Filter effects based on category and faith mode
        const filteredEffects = allEffects.filter(effect => {
            const categoryMatch = effect.category === selectedCategory;
            const faithModeMatch = isFaithMode ? (effect.isFaithMode !== false) : (effect.isFaithMode !== true);
            const searchMatch = effect.name.toLowerCase().includes(searchQuery.toLowerCase());

            return categoryMatch && faithModeMatch && searchMatch;
        });

        setEffects(filteredEffects);
    };

    const applyEffect = (effect: Effect) => {
        Alert.alert(
            'Apply Effect',
            `Apply "${effect.name}" to your timeline?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Apply',
                    onPress: () => {
                        // Here you would apply the effect to the timeline
                        Alert.alert('Success', `${effect.name} applied to timeline!`);
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const categories = [
        { id: 'transition', name: 'Transitions', icon: 'swap-horiz' },
        { id: 'filter', name: 'Filters', icon: 'filter' },
        { id: 'overlay', name: 'Overlays', icon: 'layers' },
        { id: 'animation', name: 'Animations', icon: 'animation' },
    ];

    const renderCategoryTab = (category: any) => (
        <TouchableOpacity
            key={category.id}
            style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.selectedCategoryTab,
            ]}
            onPress={() => setSelectedCategory(category.id)}
        >
            <MaterialIcons
                name={category.icon as any}
                size={20}
                color={selectedCategory === category.id ? KingdomColors.white : KingdomColors.text}
            />
            <Text
                style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.selectedCategoryText,
                ]}
            >
                {category.name}
            </Text>
        </TouchableOpacity>
    );

    const renderEffectCard = (effect: Effect) => (
        <TouchableOpacity
            key={effect.id}
            style={styles.effectCard}
            onPress={() => setSelectedEffect(effect)}
        >
            <View style={styles.effectPreview}>
                <Image
                    source={{ uri: `https://example.com/effects/${effect.preview}` }}
                    style={styles.previewImage}
                    defaultSource={require('../../assets/effect-placeholder.png')}
                />
                {effect.isPremium && (
                    <View style={styles.premiumBadge}>
                        <MaterialIcons name="star" size={12} color={KingdomColors.accent} />
                    </View>
                )}
                {effect.isFaithMode && (
                    <View style={styles.faithBadge}>
                        <FontAwesome5 name="cross" size={10} color={KingdomColors.faithPrimary} />
                    </View>
                )}
            </View>

            <View style={styles.effectInfo}>
                <Text style={styles.effectName}>{effect.name}</Text>
                <Text style={styles.effectType}>{effect.type}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={KingdomColors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Effects Library</Text>
                <TouchableOpacity>
                    <MaterialIcons name="search" size={24} color={KingdomColors.text} />
                </TouchableOpacity>
            </View>

            {/* Category Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryTabs}
            >
                {categories.map(renderCategoryTab)}
            </ScrollView>

            {/* Effects Grid */}
            <ScrollView style={styles.effectsContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.effectsGrid}>
                    {effects.map(renderEffectCard)}
                </View>
            </ScrollView>

            {/* Selected Effect Preview */}
            {selectedEffect && (
                <View style={styles.previewPanel}>
                    <View style={styles.previewHeader}>
                        <Text style={styles.previewTitle}>{selectedEffect.name}</Text>
                        <TouchableOpacity onPress={() => setSelectedEffect(null)}>
                            <MaterialIcons name="close" size={20} color={KingdomColors.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.previewContent}>
                        <Image
                            source={{ uri: `https://example.com/effects/${selectedEffect.preview}` }}
                            style={styles.largePreview}
                            defaultSource={require('../../assets/effect-placeholder.png')}
                        />

                        <View style={styles.previewControls}>
                            <TouchableOpacity
                                style={styles.previewButton}
                                onPress={() => {
                                    // Preview the effect
                                    Alert.alert('Preview', `Previewing ${selectedEffect.name}`);
                                }}
                            >
                                <MaterialIcons name="play-arrow" size={20} color={KingdomColors.white} />
                                <Text style={styles.previewButtonText}>Preview</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.previewButton, styles.applyButton]}
                                onPress={() => applyEffect(selectedEffect)}
                            >
                                <MaterialIcons name="check" size={20} color={KingdomColors.white} />
                                <Text style={styles.previewButtonText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: KingdomColors.text,
    },
    categoryTabs: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.border,
    },
    categoryTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: KingdomColors.surface,
    },
    selectedCategoryTab: {
        backgroundColor: KingdomColors.primary,
    },
    categoryText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        color: KingdomColors.text,
    },
    selectedCategoryText: {
        color: KingdomColors.white,
    },
    effectsContainer: {
        flex: 1,
        padding: 20,
    },
    effectsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    effectCard: {
        width: (width - 60) / 2,
        backgroundColor: KingdomColors.white,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: KingdomColors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    effectPreview: {
        position: 'relative',
        height: 120,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    premiumBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: KingdomColors.white,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    faithBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: KingdomColors.white,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    effectInfo: {
        padding: 12,
    },
    effectName: {
        fontSize: 14,
        fontWeight: '600',
        color: KingdomColors.text,
        marginBottom: 4,
    },
    effectType: {
        fontSize: 12,
        color: KingdomColors.textSecondary,
    },
    previewPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: KingdomColors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: KingdomColors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    previewTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: KingdomColors.text,
    },
    previewContent: {
        alignItems: 'center',
    },
    largePreview: {
        width: width - 80,
        height: 200,
        borderRadius: 12,
        marginBottom: 15,
    },
    previewControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    previewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: KingdomColors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    applyButton: {
        backgroundColor: KingdomColors.accent,
    },
    previewButtonText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 5,
    },
}); 