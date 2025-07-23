import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { KingdomColors } from '../../constants/KingdomColors';

const { width: screenWidth } = Dimensions.get('window');

interface VideoEffect {
    id: string;
    name: string;
    category: 'filter' | 'animation' | 'overlay' | 'text' | 'audio';
    icon: string;
    description: string;
    intensity: number;
    parameters: any;
    preview: string;
}

interface EffectsPanelProps {
    selectedTrack: any;
    onEffectApply: (effect: VideoEffect) => void;
}

const videoEffects: VideoEffect[] = [
    // Filter Effects
    {
        id: 'brightness',
        name: 'Brightness',
        category: 'filter',
        icon: '☀️',
        description: 'Adjust video brightness',
        intensity: 0.5,
        parameters: { value: 0, min: -1, max: 1 },
        preview: 'brightness_preview.jpg',
    },
    {
        id: 'contrast',
        name: 'Contrast',
        category: 'filter',
        icon: '🎨',
        description: 'Enhance video contrast',
        intensity: 0.5,
        parameters: { value: 0, min: -1, max: 1 },
        preview: 'contrast_preview.jpg',
    },
    {
        id: 'saturation',
        name: 'Saturation',
        category: 'filter',
        icon: '🌈',
        description: 'Adjust color saturation',
        intensity: 0.5,
        parameters: { value: 0, min: -1, max: 1 },
        preview: 'saturation_preview.jpg',
    },
    {
        id: 'blur',
        name: 'Blur',
        category: 'filter',
        icon: '🌫️',
        description: 'Apply blur effect',
        intensity: 0.3,
        parameters: { value: 0, min: 0, max: 1 },
        preview: 'blur_preview.jpg',
    },
    {
        id: 'vintage',
        name: 'Vintage',
        category: 'filter',
        icon: '📷',
        description: 'Apply vintage filter',
        intensity: 0.7,
        parameters: { value: 0, min: 0, max: 1 },
        preview: 'vintage_preview.jpg',
    },
    {
        id: 'black_white',
        name: 'Black & White',
        category: 'filter',
        icon: '⚫',
        description: 'Convert to black and white',
        intensity: 1.0,
        parameters: { value: 0, min: 0, max: 1 },
        preview: 'black_white_preview.jpg',
    },

    // Animation Effects
    {
        id: 'zoom_in',
        name: 'Zoom In',
        category: 'animation',
        icon: '🔍',
        description: 'Zoom in animation',
        intensity: 0.5,
        parameters: { startScale: 1, endScale: 1.2, duration: 2 },
        preview: 'zoom_in_preview.jpg',
    },
    {
        id: 'zoom_out',
        name: 'Zoom Out',
        category: 'animation',
        icon: '🔍',
        description: 'Zoom out animation',
        intensity: 0.5,
        parameters: { startScale: 1.2, endScale: 1, duration: 2 },
        preview: 'zoom_out_preview.jpg',
    },
    {
        id: 'pan_left',
        name: 'Pan Left',
        category: 'animation',
        icon: '⬅️',
        description: 'Pan camera left',
        intensity: 0.5,
        parameters: { startX: 0, endX: -0.2, duration: 2 },
        preview: 'pan_left_preview.jpg',
    },
    {
        id: 'pan_right',
        name: 'Pan Right',
        category: 'animation',
        icon: '➡️',
        description: 'Pan camera right',
        intensity: 0.5,
        parameters: { startX: 0, endX: 0.2, duration: 2 },
        preview: 'pan_right_preview.jpg',
    },
    {
        id: 'shake',
        name: 'Shake',
        category: 'animation',
        icon: '📱',
        description: 'Camera shake effect',
        intensity: 0.3,
        parameters: { intensity: 0.1, frequency: 10, duration: 1 },
        preview: 'shake_preview.jpg',
    },

    // Overlay Effects
    {
        id: 'glitch',
        name: 'Glitch',
        category: 'overlay',
        icon: '💻',
        description: 'Digital glitch effect',
        intensity: 0.4,
        parameters: { intensity: 0.1, frequency: 0.5 },
        preview: 'glitch_preview.jpg',
    },
    {
        id: 'vignette',
        name: 'Vignette',
        category: 'overlay',
        icon: '⭕',
        description: 'Darken edges',
        intensity: 0.6,
        parameters: { intensity: 0.5, radius: 0.8 },
        preview: 'vignette_preview.jpg',
    },
    {
        id: 'grain',
        name: 'Film Grain',
        category: 'overlay',
        icon: '🎞️',
        description: 'Add film grain texture',
        intensity: 0.3,
        parameters: { intensity: 0.2, scale: 1.0 },
        preview: 'grain_preview.jpg',
    },
    {
        id: 'light_leak',
        name: 'Light Leak',
        category: 'overlay',
        icon: '💡',
        description: 'Film light leak effect',
        intensity: 0.4,
        parameters: { intensity: 0.3, color: '#FF6B35' },
        preview: 'light_leak_preview.jpg',
    },

    // Text Effects
    {
        id: 'caption',
        name: 'Caption',
        category: 'text',
        icon: '📝',
        description: 'Add text caption',
        intensity: 1.0,
        parameters: { text: '', fontSize: 24, color: '#FFFFFF' },
        preview: 'caption_preview.jpg',
    },
    {
        id: 'title',
        name: 'Title',
        category: 'text',
        icon: '🎬',
        description: 'Add video title',
        intensity: 1.0,
        parameters: { text: '', fontSize: 32, color: '#FFFFFF' },
        preview: 'title_preview.jpg',
    },
    {
        id: 'subtitle',
        name: 'Subtitle',
        category: 'text',
        icon: '💬',
        description: 'Add subtitle text',
        intensity: 1.0,
        parameters: { text: '', fontSize: 18, color: '#FFFFFF' },
        preview: 'subtitle_preview.jpg',
    },

    // Audio Effects
    {
        id: 'echo',
        name: 'Echo',
        category: 'audio',
        icon: '🔊',
        description: 'Add echo effect',
        intensity: 0.4,
        parameters: { delay: 0.3, feedback: 0.5, mix: 0.3 },
        preview: 'echo_preview.jpg',
    },
    {
        id: 'reverb',
        name: 'Reverb',
        category: 'audio',
        icon: '🏛️',
        description: 'Add reverb effect',
        intensity: 0.5,
        parameters: { roomSize: 0.5, dampening: 0.5, mix: 0.3 },
        preview: 'reverb_preview.jpg',
    },
    {
        id: 'pitch_shift',
        name: 'Pitch Shift',
        category: 'audio',
        icon: '🎵',
        description: 'Change audio pitch',
        intensity: 0.5,
        parameters: { pitch: 0, min: -12, max: 12 },
        preview: 'pitch_shift_preview.jpg',
    },
];

export const EffectsPanel: React.FC<EffectsPanelProps> = ({
    selectedTrack,
    onEffectApply
}) => {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'filter' | 'animation' | 'overlay' | 'text' | 'audio'>('all');
    const [selectedEffect, setSelectedEffect] = useState<VideoEffect | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const categories = [
        { id: 'all', name: 'All Effects', count: videoEffects.length },
        { id: 'filter', name: 'Filters', count: videoEffects.filter(e => e.category === 'filter').length },
        { id: 'animation', name: 'Animations', count: videoEffects.filter(e => e.category === 'animation').length },
        { id: 'overlay', name: 'Overlays', count: videoEffects.filter(e => e.category === 'overlay').length },
        { id: 'text', name: 'Text', count: videoEffects.filter(e => e.category === 'text').length },
        { id: 'audio', name: 'Audio', count: videoEffects.filter(e => e.category === 'audio').length },
    ];

    const filteredEffects = selectedCategory === 'all'
        ? videoEffects
        : videoEffects.filter(e => e.category === selectedCategory);

    const handleEffectSelect = useCallback((effect: VideoEffect) => {
        setSelectedEffect(effect);
        setShowPreview(true);
    }, []);

    const handleEffectApply = useCallback(() => {
        if (selectedEffect) {
            onEffectApply(selectedEffect);
            setSelectedEffect(null);
            setShowPreview(false);
        }
    }, [selectedEffect, onEffectApply]);

    const renderEffectCard = (effect: VideoEffect) => (
        <TouchableOpacity
            key={effect.id}
            style={[
                styles.effectCard,
                selectedEffect?.id === effect.id && styles.selectedEffectCard,
            ]}
            onPress={() => handleEffectSelect(effect)}
        >
            <View style={styles.effectHeader}>
                <Text style={styles.effectIcon}>{effect.icon}</Text>
                <View style={styles.effectInfo}>
                    <Text style={styles.effectName}>{effect.name}</Text>
                    <Text style={styles.effectDescription}>{effect.description}</Text>
                </View>
            </View>

            <View style={styles.effectPreview}>
                <Image
                    source={{ uri: effect.preview }}
                    style={styles.effectPreviewImage}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.effectIntensity}>
                <Text style={styles.intensityLabel}>Intensity</Text>
                <View style={styles.intensityBar}>
                    <View
                        style={[
                            styles.intensityFill,
                            { width: `${effect.intensity * 100}%` }
                        ]}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderCategoryFilter = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryFilter}
            contentContainerStyle={styles.categoryFilterContent}
        >
            {categories.map((category) => (
                <TouchableOpacity
                    key={category.id}
                    style={[
                        styles.categoryButton,
                        selectedCategory === category.id && styles.selectedCategory,
                    ]}
                    onPress={() => setSelectedCategory(category.id as any)}
                >
                    <Text style={[
                        styles.categoryButtonText,
                        selectedCategory === category.id && styles.selectedCategoryText,
                    ]}>
                        {category.name} ({category.count})
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderSelectedEffectDetails = () => {
        if (!selectedEffect) return null;

        return (
            <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>{selectedEffect.name}</Text>
                <Text style={styles.detailsDescription}>{selectedEffect.description}</Text>

                <View style={styles.parameterContainer}>
                    <Text style={styles.parameterTitle}>Parameters:</Text>
                    {Object.entries(selectedEffect.parameters).map(([key, value]) => (
                        <View key={key} style={styles.parameterRow}>
                            <Text style={styles.parameterLabel}>{key}:</Text>
                            <Text style={styles.parameterValue}>{String(value)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.previewButton}
                        onPress={() => setShowPreview(!showPreview)}
                    >
                        <Text style={styles.previewButtonText}>
                            {showPreview ? 'Hide' : 'Show'} Preview
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleEffectApply}
                    >
                        <Text style={styles.applyButtonText}>Apply Effect</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderCategoryFilter()}

            <ScrollView style={styles.effectsContainer}>
                <View style={styles.effectsGrid}>
                    {filteredEffects.map(renderEffectCard)}
                </View>
            </ScrollView>

            {selectedEffect && (
                <View style={styles.bottomPanel}>
                    {renderSelectedEffectDetails()}
                </View>
            )}

            {showPreview && selectedEffect && (
                <View style={styles.previewModal}>
                    <View style={styles.previewModalContent}>
                        <Text style={styles.previewModalTitle}>Preview: {selectedEffect.name}</Text>
                        <Image
                            source={{ uri: selectedEffect.preview }}
                            style={styles.previewModalImage}
                            resizeMode="contain"
                        />
                        <TouchableOpacity
                            style={styles.closePreviewButton}
                            onPress={() => setShowPreview(false)}
                        >
                            <Text style={styles.closePreviewButtonText}>Close Preview</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.surface,
    },
    categoryFilter: {
        backgroundColor: KingdomColors.dark,
        paddingVertical: 8,
    },
    categoryFilterContent: {
        paddingHorizontal: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: KingdomColors.secondary,
        marginRight: 8,
    },
    selectedCategory: {
        backgroundColor: KingdomColors.primary,
    },
    categoryButtonText: {
        color: KingdomColors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    selectedCategoryText: {
        fontWeight: 'bold',
    },
    effectsContainer: {
        flex: 1,
        padding: 16,
    },
    effectsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    effectCard: {
        width: (screenWidth - 48) / 2,
        backgroundColor: KingdomColors.surface,
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: KingdomColors.border,
    },
    selectedEffectCard: {
        borderColor: KingdomColors.primary,
        borderWidth: 2,
    },
    effectHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    effectIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    effectInfo: {
        flex: 1,
    },
    effectName: {
        color: KingdomColors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    effectDescription: {
        color: KingdomColors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    effectPreview: {
        height: 80,
    },
    effectPreviewImage: {
        width: '100%',
        height: '100%',
    },
    effectIntensity: {
        padding: 12,
    },
    intensityLabel: {
        color: KingdomColors.textSecondary,
        fontSize: 10,
        marginBottom: 4,
    },
    intensityBar: {
        height: 4,
        backgroundColor: KingdomColors.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    intensityFill: {
        height: '100%',
        backgroundColor: KingdomColors.primary,
        borderRadius: 2,
    },
    bottomPanel: {
        backgroundColor: KingdomColors.dark,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: KingdomColors.border,
    },
    detailsContainer: {
        backgroundColor: KingdomColors.surface,
        borderRadius: 8,
        padding: 16,
    },
    detailsTitle: {
        color: KingdomColors.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    detailsDescription: {
        color: KingdomColors.textSecondary,
        fontSize: 14,
        marginBottom: 16,
    },
    parameterContainer: {
        marginBottom: 16,
    },
    parameterTitle: {
        color: KingdomColors.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    parameterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    parameterLabel: {
        color: KingdomColors.textSecondary,
        fontSize: 12,
    },
    parameterValue: {
        color: KingdomColors.text,
        fontSize: 12,
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    previewButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: KingdomColors.secondary,
        alignItems: 'center',
    },
    previewButtonText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: KingdomColors.primary,
        alignItems: 'center',
    },
    applyButtonText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    previewModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    previewModalContent: {
        backgroundColor: KingdomColors.surface,
        borderRadius: 12,
        padding: 20,
        width: screenWidth * 0.8,
        maxHeight: screenWidth * 0.8,
    },
    previewModalTitle: {
        color: KingdomColors.text,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    previewModalImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    closePreviewButton: {
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: KingdomColors.error,
        alignItems: 'center',
    },
    closePreviewButtonText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: '600',
    },
}); 