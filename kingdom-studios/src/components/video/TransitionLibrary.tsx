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

interface Transition {
    id: string;
    name: string;
    type: 'fade' | 'slide' | 'zoom' | 'wipe' | 'glitch' | 'dissolve' | 'push' | 'flip';
    duration: number;
    direction?: 'left' | 'right' | 'up' | 'down' | 'in' | 'out';
    intensity?: number;
    preview: string;
    category: 'basic' | 'creative' | 'dramatic' | 'smooth';
}

const transitions: Transition[] = [
    // Basic Transitions
    {
        id: 'fade_in',
        name: 'Fade In',
        type: 'fade',
        duration: 0.5,
        direction: 'in',
        intensity: 1,
        preview: 'fade_in_preview.gif',
        category: 'basic',
    },
    {
        id: 'fade_out',
        name: 'Fade Out',
        type: 'fade',
        duration: 0.5,
        direction: 'out',
        intensity: 1,
        preview: 'fade_out_preview.gif',
        category: 'basic',
    },
    {
        id: 'slide_left',
        name: 'Slide Left',
        type: 'slide',
        duration: 0.6,
        direction: 'left',
        intensity: 1,
        preview: 'slide_left_preview.gif',
        category: 'basic',
    },
    {
        id: 'slide_right',
        name: 'Slide Right',
        type: 'slide',
        duration: 0.6,
        direction: 'right',
        intensity: 1,
        preview: 'slide_right_preview.gif',
        category: 'basic',
    },
    {
        id: 'slide_up',
        name: 'Slide Up',
        type: 'slide',
        duration: 0.6,
        direction: 'up',
        intensity: 1,
        preview: 'slide_up_preview.gif',
        category: 'basic',
    },
    {
        id: 'slide_down',
        name: 'Slide Down',
        type: 'slide',
        duration: 0.6,
        direction: 'down',
        intensity: 1,
        preview: 'slide_down_preview.gif',
        category: 'basic',
    },

    // Creative Transitions
    {
        id: 'zoom_in',
        name: 'Zoom In',
        type: 'zoom',
        duration: 0.8,
        direction: 'in',
        intensity: 1.5,
        preview: 'zoom_in_preview.gif',
        category: 'creative',
    },
    {
        id: 'zoom_out',
        name: 'Zoom Out',
        type: 'zoom',
        duration: 0.8,
        direction: 'out',
        intensity: 1.5,
        preview: 'zoom_out_preview.gif',
        category: 'creative',
    },
    {
        id: 'wipe_left',
        name: 'Wipe Left',
        type: 'wipe',
        duration: 0.7,
        direction: 'left',
        intensity: 1,
        preview: 'wipe_left_preview.gif',
        category: 'creative',
    },
    {
        id: 'wipe_right',
        name: 'Wipe Right',
        type: 'wipe',
        duration: 0.7,
        direction: 'right',
        intensity: 1,
        preview: 'wipe_right_preview.gif',
        category: 'creative',
    },
    {
        id: 'dissolve',
        name: 'Dissolve',
        type: 'dissolve',
        duration: 1.0,
        intensity: 1,
        preview: 'dissolve_preview.gif',
        category: 'creative',
    },

    // Dramatic Transitions
    {
        id: 'glitch',
        name: 'Glitch',
        type: 'glitch',
        duration: 0.4,
        intensity: 2,
        preview: 'glitch_preview.gif',
        category: 'dramatic',
    },
    {
        id: 'push_left',
        name: 'Push Left',
        type: 'push',
        duration: 0.8,
        direction: 'left',
        intensity: 1.2,
        preview: 'push_left_preview.gif',
        category: 'dramatic',
    },
    {
        id: 'push_right',
        name: 'Push Right',
        type: 'push',
        duration: 0.8,
        direction: 'right',
        intensity: 1.2,
        preview: 'push_right_preview.gif',
        category: 'dramatic',
    },
    {
        id: 'flip_horizontal',
        name: 'Flip Horizontal',
        type: 'flip',
        duration: 1.2,
        direction: 'left',
        intensity: 1,
        preview: 'flip_horizontal_preview.gif',
        category: 'dramatic',
    },
    {
        id: 'flip_vertical',
        name: 'Flip Vertical',
        type: 'flip',
        duration: 1.2,
        direction: 'up',
        intensity: 1,
        preview: 'flip_vertical_preview.gif',
        category: 'dramatic',
    },

    // Smooth Transitions
    {
        id: 'cross_fade',
        name: 'Cross Fade',
        type: 'fade',
        duration: 1.5,
        intensity: 0.8,
        preview: 'cross_fade_preview.gif',
        category: 'smooth',
    },
    {
        id: 'slide_cross',
        name: 'Slide Cross',
        type: 'slide',
        duration: 1.0,
        direction: 'left',
        intensity: 0.8,
        preview: 'slide_cross_preview.gif',
        category: 'smooth',
    },
    {
        id: 'zoom_smooth',
        name: 'Smooth Zoom',
        type: 'zoom',
        duration: 1.2,
        direction: 'in',
        intensity: 1.2,
        preview: 'zoom_smooth_preview.gif',
        category: 'smooth',
    },
    {
        id: 'wipe_smooth',
        name: 'Smooth Wipe',
        type: 'wipe',
        duration: 1.0,
        direction: 'right',
        intensity: 0.9,
        preview: 'wipe_smooth_preview.gif',
        category: 'smooth',
    },
];

interface TransitionLibraryProps {
    onTransitionAdd: (transition: Transition) => void;
}

export const TransitionLibrary: React.FC<TransitionLibraryProps> = ({ onTransitionAdd }) => {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'creative' | 'dramatic' | 'smooth'>('all');
    const [selectedTransition, setSelectedTransition] = useState<Transition | null>(null);
    const [previewMode, setPreviewMode] = useState(false);

    const categories = [
        { id: 'all', name: 'All', count: transitions.length },
        { id: 'basic', name: 'Basic', count: transitions.filter(t => t.category === 'basic').length },
        { id: 'creative', name: 'Creative', count: transitions.filter(t => t.category === 'creative').length },
        { id: 'dramatic', name: 'Dramatic', count: transitions.filter(t => t.category === 'dramatic').length },
        { id: 'smooth', name: 'Smooth', count: transitions.filter(t => t.category === 'smooth').length },
    ];

    const filteredTransitions = selectedCategory === 'all'
        ? transitions
        : transitions.filter(t => t.category === selectedCategory);

    const handleTransitionSelect = useCallback((transition: Transition) => {
        setSelectedTransition(transition);
        setPreviewMode(true);
    }, []);

    const handleTransitionApply = useCallback(() => {
        if (selectedTransition) {
            onTransitionAdd(selectedTransition);
            setSelectedTransition(null);
            setPreviewMode(false);
        }
    }, [selectedTransition, onTransitionAdd]);

    const renderTransitionPreview = (transition: Transition) => {
        return (
            <View style={styles.previewContainer}>
                <Image
                    source={{ uri: transition.preview }}
                    style={styles.previewImage}
                    resizeMode="cover"
                />
                <View style={styles.previewOverlay}>
                    <Text style={styles.previewText}>{transition.name}</Text>
                </View>
            </View>
        );
    };

    const renderTransitionCard = (transition: Transition) => (
        <TouchableOpacity
            key={transition.id}
            style={[
                styles.transitionCard,
                selectedTransition?.id === transition.id && styles.selectedCard,
            ]}
            onPress={() => handleTransitionSelect(transition)}
        >
            {renderTransitionPreview(transition)}
            <View style={styles.transitionInfo}>
                <Text style={styles.transitionName}>{transition.name}</Text>
                <Text style={styles.transitionDuration}>{transition.duration}s</Text>
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

    const renderSelectedTransitionDetails = () => {
        if (!selectedTransition) return null;

        return (
            <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>{selectedTransition.name}</Text>
                <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Type:</Text>
                    <Text style={styles.detailsValue}>{selectedTransition.type}</Text>
                </View>
                <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Duration:</Text>
                    <Text style={styles.detailsValue}>{selectedTransition.duration}s</Text>
                </View>
                <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Intensity:</Text>
                    <Text style={styles.detailsValue}>{selectedTransition.intensity}</Text>
                </View>
                {selectedTransition.direction && (
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Direction:</Text>
                        <Text style={styles.detailsValue}>{selectedTransition.direction}</Text>
                    </View>
                )}

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.previewButton}
                        onPress={() => setPreviewMode(!previewMode)}
                    >
                        <Text style={styles.previewButtonText}>
                            {previewMode ? 'Hide' : 'Show'} Preview
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleTransitionApply}
                    >
                        <Text style={styles.applyButtonText}>Apply Transition</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderCategoryFilter()}

            <ScrollView style={styles.transitionsContainer}>
                <View style={styles.transitionsGrid}>
                    {filteredTransitions.map(renderTransitionCard)}
                </View>
            </ScrollView>

            {selectedTransition && (
                <View style={styles.bottomPanel}>
                    {renderSelectedTransitionDetails()}
                </View>
            )}

            {previewMode && selectedTransition && (
                <View style={styles.previewModal}>
                    <View style={styles.previewModalContent}>
                        <Text style={styles.previewModalTitle}>Preview: {selectedTransition.name}</Text>
                        {renderTransitionPreview(selectedTransition)}
                        <TouchableOpacity
                            style={styles.closePreviewButton}
                            onPress={() => setPreviewMode(false)}
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
    transitionsContainer: {
        flex: 1,
        padding: 16,
    },
    transitionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    transitionCard: {
        width: (screenWidth - 48) / 2,
        backgroundColor: KingdomColors.surface,
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: KingdomColors.border,
    },
    selectedCard: {
        borderColor: KingdomColors.primary,
        borderWidth: 2,
    },
    previewContainer: {
        height: 100,
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    previewOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
    },
    previewText: {
        color: KingdomColors.white,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    transitionInfo: {
        padding: 12,
    },
    transitionName: {
        color: KingdomColors.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    transitionDuration: {
        color: KingdomColors.textSecondary,
        fontSize: 12,
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
        marginBottom: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailsLabel: {
        color: KingdomColors.textSecondary,
        fontSize: 14,
    },
    detailsValue: {
        color: KingdomColors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 16,
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
    closePreviewButton: {
        marginTop: 16,
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