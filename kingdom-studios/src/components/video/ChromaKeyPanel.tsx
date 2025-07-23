import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    Dimensions,
} from 'react-native';
import { KingdomColors } from '../../constants/KingdomColors';
import { ImagePicker } from '../../components/common/ImagePicker';
import { ColorPicker } from '../../components/common/ColorPicker';

const { width: screenWidth } = Dimensions.get('window');

interface ChromaKeySettings {
    enabled: boolean;
    keyColor: string;
    tolerance: number;
    smoothness: number;
    backgroundImage?: string;
    backgroundVideo?: string;
    backgroundType: 'image' | 'video' | 'color';
    backgroundColor: string;
}

interface ChromaKeyPanelProps {
    selectedTrack: any;
    onChromaKeyApply: (chromaKey: ChromaKeySettings) => void;
}

export const ChromaKeyPanel: React.FC<ChromaKeyPanelProps> = ({
    selectedTrack,
    onChromaKeyApply
}) => {
    const [chromaKeySettings, setChromaKeySettings] = useState<ChromaKeySettings>({
        enabled: false,
        keyColor: '#00FF00', // Green
        tolerance: 0.3,
        smoothness: 0.5,
        backgroundType: 'image',
        backgroundColor: '#000000',
    });

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    const backgroundOptions = [
        { id: 'image', name: 'Image Background', icon: '🖼️' },
        { id: 'video', name: 'Video Background', icon: '🎬' },
        { id: 'color', name: 'Solid Color', icon: '🎨' },
    ];

    const handleKeyColorChange = useCallback((color: string) => {
        setChromaKeySettings(prev => ({
            ...prev,
            keyColor: color,
        }));
    }, []);

    const handleToleranceChange = useCallback((value: number) => {
        setChromaKeySettings(prev => ({
            ...prev,
            tolerance: value,
        }));
    }, []);

    const handleSmoothnessChange = useCallback((value: number) => {
        setChromaKeySettings(prev => ({
            ...prev,
            smoothness: value,
        }));
    }, []);

    const handleBackgroundTypeChange = useCallback((type: 'image' | 'video' | 'color') => {
        setChromaKeySettings(prev => ({
            ...prev,
            backgroundType: type,
        }));
    }, []);

    const handleBackgroundImageSelect = useCallback((imageUri: string) => {
        setChromaKeySettings(prev => ({
            ...prev,
            backgroundImage: imageUri,
        }));
        setShowImagePicker(false);
    }, []);

    const handleBackgroundVideoSelect = useCallback((videoUri: string) => {
        setChromaKeySettings(prev => ({
            ...prev,
            backgroundVideo: videoUri,
        }));
        setShowImagePicker(false);
    }, []);

    const handleApplyChromaKey = useCallback(() => {
        if (!chromaKeySettings.enabled) {
            Alert.alert('Enable Chroma Key', 'Please enable chroma key before applying.');
            return;
        }

        if (chromaKeySettings.backgroundType === 'image' && !chromaKeySettings.backgroundImage) {
            Alert.alert('Select Background', 'Please select a background image.');
            return;
        }

        if (chromaKeySettings.backgroundType === 'video' && !chromaKeySettings.backgroundVideo) {
            Alert.alert('Select Background', 'Please select a background video.');
            return;
        }

        onChromaKeyApply(chromaKeySettings);
        Alert.alert('Success', 'Chroma key settings applied successfully!');
    }, [chromaKeySettings, onChromaKeyApply]);

    const renderColorPicker = () => (
        <View style={styles.colorPickerContainer}>
            <Text style={styles.sectionTitle}>Key Color Selection</Text>
            <TouchableOpacity
                style={[styles.colorButton, { backgroundColor: chromaKeySettings.keyColor }]}
                onPress={() => setShowColorPicker(true)}
            >
                <Text style={styles.colorButtonText}>Select Key Color</Text>
            </TouchableOpacity>

            <View style={styles.presetColors}>
                <Text style={styles.presetTitle}>Preset Colors:</Text>
                {['#00FF00', '#00FFFF', '#FF00FF', '#FFFF00', '#FF0000', '#0000FF'].map((color) => (
                    <TouchableOpacity
                        key={color}
                        style={[styles.presetColor, { backgroundColor: color }]}
                        onPress={() => handleKeyColorChange(color)}
                    />
                ))}
            </View>
        </View>
    );

    const renderToleranceSlider = () => (
        <View style={styles.sliderContainer}>
            <Text style={styles.sectionTitle}>Tolerance</Text>
            <Text style={styles.sliderValue}>{Math.round(chromaKeySettings.tolerance * 100)}%</Text>
            <View style={styles.sliderTrack}>
                <TouchableOpacity
                    style={[
                        styles.sliderThumb,
                        { left: `${chromaKeySettings.tolerance * 100}%` }
                    ]}
                    onPress={() => {/* Slider interaction */ }}
                />
            </View>
            <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Low</Text>
                <Text style={styles.sliderLabel}>High</Text>
            </View>
        </View>
    );

    const renderSmoothnessSlider = () => (
        <View style={styles.sliderContainer}>
            <Text style={styles.sectionTitle}>Smoothness</Text>
            <Text style={styles.sliderValue}>{Math.round(chromaKeySettings.smoothness * 100)}%</Text>
            <View style={styles.sliderTrack}>
                <TouchableOpacity
                    style={[
                        styles.sliderThumb,
                        { left: `${chromaKeySettings.smoothness * 100}%` }
                    ]}
                    onPress={() => {/* Slider interaction */ }}
                />
            </View>
            <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Sharp</Text>
                <Text style={styles.sliderLabel}>Smooth</Text>
            </View>
        </View>
    );

    const renderBackgroundOptions = () => (
        <View style={styles.backgroundContainer}>
            <Text style={styles.sectionTitle}>Background Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {backgroundOptions.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[
                            styles.backgroundOption,
                            chromaKeySettings.backgroundType === option.id && styles.selectedBackgroundOption,
                        ]}
                        onPress={() => handleBackgroundTypeChange(option.id as any)}
                    >
                        <Text style={styles.backgroundOptionIcon}>{option.icon}</Text>
                        <Text style={styles.backgroundOptionText}>{option.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {chromaKeySettings.backgroundType === 'image' && (
                <TouchableOpacity
                    style={styles.selectBackgroundButton}
                    onPress={() => setShowImagePicker(true)}
                >
                    <Text style={styles.selectBackgroundButtonText}>
                        {chromaKeySettings.backgroundImage ? 'Change Background Image' : 'Select Background Image'}
                    </Text>
                </TouchableOpacity>
            )}

            {chromaKeySettings.backgroundType === 'video' && (
                <TouchableOpacity
                    style={styles.selectBackgroundButton}
                    onPress={() => setShowImagePicker(true)}
                >
                    <Text style={styles.selectBackgroundButtonText}>
                        {chromaKeySettings.backgroundVideo ? 'Change Background Video' : 'Select Background Video'}
                    </Text>
                </TouchableOpacity>
            )}

            {chromaKeySettings.backgroundType === 'color' && (
                <TouchableOpacity
                    style={[styles.colorButton, { backgroundColor: chromaKeySettings.backgroundColor }]}
                    onPress={() => {/* Open color picker for background */ }}
                >
                    <Text style={styles.colorButtonText}>Select Background Color</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderPreview = () => (
        <View style={styles.previewContainer}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewFrame}>
                {selectedTrack?.source ? (
                    <Image
                        source={{ uri: selectedTrack.source }}
                        style={styles.previewImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.previewPlaceholder}>
                        <Text style={styles.previewPlaceholderText}>No video selected</Text>
                    </View>
                )}

                {chromaKeySettings.enabled && (
                    <View style={styles.chromaKeyOverlay}>
                        <Text style={styles.chromaKeyOverlayText}>Chroma Key Active</Text>
                    </View>
                )}
            </View>
        </View>
    );

    const renderControls = () => (
        <View style={styles.controlsContainer}>
            <TouchableOpacity
                style={[
                    styles.toggleButton,
                    chromaKeySettings.enabled && styles.toggleButtonActive,
                ]}
                onPress={() => setChromaKeySettings(prev => ({ ...prev, enabled: !prev.enabled }))}
            >
                <Text style={[
                    styles.toggleButtonText,
                    chromaKeySettings.enabled && styles.toggleButtonTextActive,
                ]}>
                    {chromaKeySettings.enabled ? 'Chroma Key ON' : 'Chroma Key OFF'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.previewButton}
                onPress={() => setPreviewMode(!previewMode)}
            >
                <Text style={styles.previewButtonText}>
                    {previewMode ? 'Hide' : 'Show'} Live Preview
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyChromaKey}
            >
                <Text style={styles.applyButtonText}>Apply Chroma Key</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chroma Key (Green Screen)</Text>
                <Text style={styles.subtitle}>
                    Remove backgrounds and replace with custom content
                </Text>
            </View>

            {renderControls()}
            {renderColorPicker()}
            {renderToleranceSlider()}
            {renderSmoothnessSlider()}
            {renderBackgroundOptions()}
            {renderPreview()}

            {showColorPicker && (
                <ColorPicker
                    initialColor={chromaKeySettings.keyColor}
                    onColorSelect={handleKeyColorChange}
                    onClose={() => setShowColorPicker(false)}
                />
            )}

            {showImagePicker && (
                <ImagePicker
                    onImageSelect={handleBackgroundImageSelect}
                    onVideoSelect={handleBackgroundVideoSelect}
                    onClose={() => setShowImagePicker(false)}
                    allowVideo={chromaKeySettings.backgroundType === 'video'}
                />
            )}

            {previewMode && (
                <View style={styles.livePreviewModal}>
                    <View style={styles.livePreviewContent}>
                        <Text style={styles.livePreviewTitle}>Live Chroma Key Preview</Text>
                        <View style={styles.livePreviewFrame}>
                            {/* Live preview implementation */}
                            <Text style={styles.livePreviewText}>Live preview coming soon...</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.closePreviewButton}
                            onPress={() => setPreviewMode(false)}
                        >
                            <Text style={styles.closePreviewButtonText}>Close Preview</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.surface,
    },
    header: {
        padding: 16,
        backgroundColor: KingdomColors.primary,
    },
    title: {
        color: KingdomColors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        color: KingdomColors.white,
        fontSize: 14,
        marginTop: 4,
    },
    controlsContainer: {
        padding: 16,
        gap: 12,
    },
    toggleButton: {
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: KingdomColors.secondary,
        alignItems: 'center',
    },
    toggleButtonActive: {
        backgroundColor: KingdomColors.success,
    },
    toggleButtonText: {
        color: KingdomColors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    toggleButtonTextActive: {
        fontWeight: 'bold',
    },
    previewButton: {
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
    colorPickerContainer: {
        padding: 16,
    },
    sectionTitle: {
        color: KingdomColors.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    colorButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    colorButtonText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    presetColors: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    presetTitle: {
        color: KingdomColors.textSecondary,
        fontSize: 14,
        marginRight: 8,
    },
    presetColor: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: KingdomColors.white,
    },
    sliderContainer: {
        padding: 16,
    },
    sliderValue: {
        color: KingdomColors.text,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    sliderTrack: {
        height: 4,
        backgroundColor: KingdomColors.border,
        borderRadius: 2,
        position: 'relative',
    },
    sliderThumb: {
        position: 'absolute',
        top: -6,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: KingdomColors.primary,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    sliderLabel: {
        color: KingdomColors.textSecondary,
        fontSize: 12,
    },
    backgroundContainer: {
        padding: 16,
    },
    backgroundOption: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: KingdomColors.surface,
        marginRight: 12,
        alignItems: 'center',
        minWidth: 100,
    },
    selectedBackgroundOption: {
        backgroundColor: KingdomColors.primary,
    },
    backgroundOptionIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    backgroundOptionText: {
        color: KingdomColors.text,
        fontSize: 12,
        textAlign: 'center',
    },
    selectBackgroundButton: {
        marginTop: 12,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: KingdomColors.secondary,
        alignItems: 'center',
    },
    selectBackgroundButtonText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    previewContainer: {
        padding: 16,
    },
    previewFrame: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: KingdomColors.dark,
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    previewPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewPlaceholderText: {
        color: KingdomColors.textSecondary,
        fontSize: 16,
    },
    chromaKeyOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: KingdomColors.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    chromaKeyOverlayText: {
        color: KingdomColors.white,
        fontSize: 10,
        fontWeight: '600',
    },
    livePreviewModal: {
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
    livePreviewContent: {
        backgroundColor: KingdomColors.surface,
        borderRadius: 12,
        padding: 20,
        width: screenWidth * 0.9,
        maxHeight: screenWidth * 0.9,
    },
    livePreviewTitle: {
        color: KingdomColors.text,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    livePreviewFrame: {
        width: '100%',
        height: 300,
        backgroundColor: KingdomColors.dark,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    livePreviewText: {
        color: KingdomColors.textSecondary,
        fontSize: 16,
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