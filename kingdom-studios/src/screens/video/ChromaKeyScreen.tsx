import React, { useState, useRef } from 'react';
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

const { width, height } = Dimensions.get('window');

interface ChromaKeySettings {
    keyColor: string;
    tolerance: number;
    smoothness: number;
    spillSuppression: number;
    edgeFeather: number;
    backgroundType: 'video' | 'image' | 'solid';
    backgroundSource: string;
}

interface ChromaKeyScreenProps {
    navigation: any;
}

export default function ChromaKeyScreen({ navigation }: ChromaKeyScreenProps) {
    const { isFaithMode } = useDualMode();

    // State
    const [settings, setSettings] = useState<ChromaKeySettings>({
        keyColor: '#00FF00', // Green
        tolerance: 50,
        smoothness: 30,
        spillSuppression: 20,
        edgeFeather: 10,
        backgroundType: 'solid',
        backgroundSource: '',
    });

    const [isEnabled, setIsEnabled] = useState(false);
    const [previewMode, setPreviewMode] = useState<'original' | 'keyed' | 'final'>('original');
    const [selectedColor, setSelectedColor] = useState<string>('#00FF00');

    // Refs
    const videoRef = useRef<any>(null);

    const colorPresets = [
        { name: 'Green', value: '#00FF00', label: 'Standard Green' },
        { name: 'Blue', value: '#0000FF', label: 'Blue Screen' },
        { name: 'Red', value: '#FF0000', label: 'Red Screen' },
        { name: 'Yellow', value: '#FFFF00', label: 'Yellow Screen' },
        { name: 'Purple', value: '#800080', label: 'Purple Screen' },
        { name: 'Orange', value: '#FFA500', label: 'Orange Screen' },
    ];

    const backgroundOptions = [
        { id: 'solid', name: 'Solid Color', icon: 'palette' },
        { id: 'image', name: 'Image', icon: 'image' },
        { id: 'video', name: 'Video', icon: 'videocam' },
    ];

    const updateSetting = (key: keyof ChromaKeySettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const toggleChromaKey = () => {
        setIsEnabled(!isEnabled);
        Alert.alert(
            isEnabled ? 'Disable Chroma Key' : 'Enable Chroma Key',
            isEnabled ? 'Chroma key will be disabled' : 'Chroma key will be enabled',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: () => setIsEnabled(!isEnabled) },
            ]
        );
    };

    const applyChromaKey = () => {
        Alert.alert(
            'Apply Chroma Key',
            'Apply chroma key settings to your video?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Apply',
                    onPress: () => {
                        Alert.alert('Success', 'Chroma key applied to video!');
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const renderColorPreset = (preset: any) => (
        <TouchableOpacity
            key={preset.name}
            style={[
                styles.colorPreset,
                selectedColor === preset.value && styles.selectedColorPreset,
            ]}
            onPress={() => {
                setSelectedColor(preset.value);
                updateSetting('keyColor', preset.value);
            }}
        >
            <View
                style={[
                    styles.colorSwatch,
                    { backgroundColor: preset.value },
                ]}
            />
            <Text style={styles.colorName}>{preset.name}</Text>
            <Text style={styles.colorLabel}>{preset.label}</Text>
        </TouchableOpacity>
    );

    const renderSlider = (
        title: string,
        value: number,
        min: number,
        max: number,
        onValueChange: (value: number) => void,
        unit: string = '%'
    ) => (
        <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
                <Text style={styles.sliderTitle}>{title}</Text>
                <Text style={styles.sliderValue}>{value}{unit}</Text>
            </View>

            <View style={styles.sliderTrack}>
                <View style={styles.sliderFill}>
                    <View
                        style={[
                            styles.sliderThumb,
                            { left: `${((value - min) / (max - min)) * 100}%` },
                        ]}
                    />
                </View>

                <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabel}>{min}</Text>
                    <Text style={styles.sliderLabel}>{max}</Text>
                </View>
            </View>

            <View style={styles.sliderButtons}>
                <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => onValueChange(Math.max(min, value - 5))}
                >
                    <MaterialIcons name="remove" size={16} color={KingdomColors.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => onValueChange(Math.min(max, value + 5))}
                >
                    <MaterialIcons name="add" size={16} color={KingdomColors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderBackgroundOption = (option: any) => (
        <TouchableOpacity
            key={option.id}
            style={[
                styles.backgroundOption,
                settings.backgroundType === option.id && styles.selectedBackgroundOption,
            ]}
            onPress={() => updateSetting('backgroundType', option.id)}
        >
            <MaterialIcons
                name={option.icon as any}
                size={24}
                color={settings.backgroundType === option.id ? KingdomColors.white : KingdomColors.text}
            />
            <Text
                style={[
                    styles.backgroundOptionText,
                    settings.backgroundType === option.id && styles.selectedBackgroundOptionText,
                ]}
            >
                {option.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={KingdomColors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chroma Key</Text>
                <TouchableOpacity onPress={toggleChromaKey}>
                    <MaterialIcons
                        name={isEnabled ? 'visibility' : 'visibility-off'}
                        size={24}
                        color={isEnabled ? KingdomColors.primary : KingdomColors.text}
                    />
                </TouchableOpacity>
            </View>

            {/* Preview Area */}
            <View style={styles.previewContainer}>
                <View style={styles.previewHeader}>
                    <Text style={styles.previewTitle}>Preview</Text>
                    <View style={styles.previewModes}>
                        <TouchableOpacity
                            style={[
                                styles.previewMode,
                                previewMode === 'original' && styles.activePreviewMode,
                            ]}
                            onPress={() => setPreviewMode('original')}
                        >
                            <Text style={styles.previewModeText}>Original</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.previewMode,
                                previewMode === 'keyed' && styles.activePreviewMode,
                            ]}
                            onPress={() => setPreviewMode('keyed')}
                        >
                            <Text style={styles.previewModeText}>Keyed</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.previewMode,
                                previewMode === 'final' && styles.activePreviewMode,
                            ]}
                            onPress={() => setPreviewMode('final')}
                        >
                            <Text style={styles.previewModeText}>Final</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.previewArea}>
                    <Image
                        source={{ uri: 'https://example.com/sample-video-frame.jpg' }}
                        style={styles.previewImage}
                        defaultSource={require('../../assets/video-placeholder.png')}
                    />

                    {isEnabled && (
                        <View style={styles.chromaKeyOverlay}>
                            <Text style={styles.overlayText}>Chroma Key Active</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Settings */}
            <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
                {/* Color Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Color</Text>
                    <View style={styles.colorPresets}>
                        {colorPresets.map(renderColorPreset)}
                    </View>

                    <View style={styles.customColorContainer}>
                        <Text style={styles.customColorLabel}>Custom Color:</Text>
                        <View style={styles.customColorPicker}>
                            <View
                                style={[
                                    styles.customColorSwatch,
                                    { backgroundColor: selectedColor },
                                ]}
                            />
                            <Text style={styles.customColorValue}>{selectedColor}</Text>
                        </View>
                    </View>
                </View>

                {/* Chroma Key Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chroma Key Settings</Text>

                    {renderSlider(
                        'Tolerance',
                        settings.tolerance,
                        0,
                        100,
                        (value) => updateSetting('tolerance', value)
                    )}

                    {renderSlider(
                        'Smoothness',
                        settings.smoothness,
                        0,
                        100,
                        (value) => updateSetting('smoothness', value)
                    )}

                    {renderSlider(
                        'Spill Suppression',
                        settings.spillSuppression,
                        0,
                        100,
                        (value) => updateSetting('spillSuppression', value)
                    )}

                    {renderSlider(
                        'Edge Feather',
                        settings.edgeFeather,
                        0,
                        50,
                        (value) => updateSetting('edgeFeather', value)
                    )}
                </View>

                {/* Background Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Background</Text>
                    <View style={styles.backgroundOptions}>
                        {backgroundOptions.map(renderBackgroundOption)}
                    </View>

                    {settings.backgroundType === 'solid' && (
                        <View style={styles.solidColorContainer}>
                            <Text style={styles.solidColorLabel}>Background Color:</Text>
                            <View style={styles.solidColorPicker}>
                                <View
                                    style={[
                                        styles.solidColorSwatch,
                                        { backgroundColor: '#0000FF' },
                                    ]}
                                />
                                <Text style={styles.solidColorValue}>#0000FF</Text>
                            </View>
                        </View>
                    )}

                    {settings.backgroundType === 'image' && (
                        <TouchableOpacity style={styles.selectBackgroundButton}>
                            <MaterialIcons name="image" size={20} color={KingdomColors.primary} />
                            <Text style={styles.selectBackgroundText}>Select Background Image</Text>
                        </TouchableOpacity>
                    )}

                    {settings.backgroundType === 'video' && (
                        <TouchableOpacity style={styles.selectBackgroundButton}>
                            <MaterialIcons name="videocam" size={20} color={KingdomColors.primary} />
                            <Text style={styles.selectBackgroundText}>Select Background Video</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Faith Mode Enhancements */}
                {isFaithMode && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Faith Mode Enhancements</Text>
                        <View style={styles.faithEnhancements}>
                            <TouchableOpacity style={styles.faithEnhancement}>
                                <FontAwesome5 name="cross" size={16} color={KingdomColors.faithPrimary} />
                                <Text style={styles.faithEnhancementText}>Add Cross Overlay</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.faithEnhancement}>
                                <FontAwesome5 name="pray" size={16} color={KingdomColors.faithPrimary} />
                                <Text style={styles.faithEnhancementText}>Prayer Background</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.faithEnhancement}>
                                <FontAwesome5 name="church" size={16} color={KingdomColors.faithPrimary} />
                                <Text style={styles.faithEnhancementText}>Church Background</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Apply Button */}
            <View style={styles.applyContainer}>
                <TouchableOpacity style={styles.applyButton} onPress={applyChromaKey}>
                    <MaterialIcons name="check" size={20} color={KingdomColors.white} />
                    <Text style={styles.applyButtonText}>Apply Chroma Key</Text>
                </TouchableOpacity>
            </View>
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
    previewContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.border,
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
    previewModes: {
        flexDirection: 'row',
        backgroundColor: KingdomColors.surface,
        borderRadius: 20,
        padding: 2,
    },
    previewMode: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 18,
    },
    activePreviewMode: {
        backgroundColor: KingdomColors.primary,
    },
    previewModeText: {
        fontSize: 12,
        fontWeight: '500',
        color: KingdomColors.text,
    },
    previewArea: {
        height: 200,
        backgroundColor: KingdomColors.surface,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    chromaKeyOverlay: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: KingdomColors.primary + 'CC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    overlayText: {
        color: KingdomColors.white,
        fontSize: 10,
        fontWeight: '500',
    },
    settingsContainer: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: KingdomColors.text,
        marginBottom: 15,
    },
    colorPresets: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    colorPreset: {
        width: (width - 80) / 3,
        alignItems: 'center',
        padding: 10,
        backgroundColor: KingdomColors.white,
        borderRadius: 8,
        marginBottom: 10,
    },
    selectedColorPreset: {
        backgroundColor: KingdomColors.primary + '20',
        borderColor: KingdomColors.primary,
        borderWidth: 2,
    },
    colorSwatch: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginBottom: 5,
    },
    colorName: {
        fontSize: 12,
        fontWeight: '600',
        color: KingdomColors.text,
    },
    colorLabel: {
        fontSize: 10,
        color: KingdomColors.textSecondary,
    },
    customColorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    customColorLabel: {
        fontSize: 14,
        color: KingdomColors.text,
    },
    customColorPicker: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    customColorSwatch: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
    },
    customColorValue: {
        fontSize: 12,
        color: KingdomColors.textSecondary,
    },
    sliderContainer: {
        marginBottom: 20,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sliderTitle: {
        fontSize: 14,
        color: KingdomColors.text,
    },
    sliderValue: {
        fontSize: 14,
        fontWeight: '600',
        color: KingdomColors.primary,
    },
    sliderTrack: {
        height: 20,
        position: 'relative',
    },
    sliderFill: {
        height: 4,
        backgroundColor: KingdomColors.border,
        borderRadius: 2,
        position: 'relative',
    },
    sliderThumb: {
        position: 'absolute',
        width: 20,
        height: 20,
        backgroundColor: KingdomColors.primary,
        borderRadius: 10,
        top: -8,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    sliderLabel: {
        fontSize: 10,
        color: KingdomColors.textSecondary,
    },
    sliderButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    sliderButton: {
        padding: 8,
        marginHorizontal: 5,
        backgroundColor: KingdomColors.surface,
        borderRadius: 16,
    },
    backgroundOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    backgroundOption: {
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        backgroundColor: KingdomColors.surface,
    },
    selectedBackgroundOption: {
        backgroundColor: KingdomColors.primary,
    },
    backgroundOptionText: {
        marginTop: 5,
        fontSize: 12,
        color: KingdomColors.text,
    },
    selectedBackgroundOptionText: {
        color: KingdomColors.white,
    },
    solidColorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    solidColorLabel: {
        fontSize: 14,
        color: KingdomColors.text,
    },
    solidColorPicker: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    solidColorSwatch: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
    },
    solidColorValue: {
        fontSize: 12,
        color: KingdomColors.textSecondary,
    },
    selectBackgroundButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: KingdomColors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: KingdomColors.primary,
        borderStyle: 'dashed',
    },
    selectBackgroundText: {
        marginLeft: 8,
        fontSize: 14,
        color: KingdomColors.primary,
    },
    faithEnhancements: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    faithEnhancement: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: KingdomColors.faithPrimary + '20',
        borderRadius: 8,
        marginBottom: 8,
        width: (width - 80) / 2,
    },
    faithEnhancementText: {
        marginLeft: 8,
        fontSize: 12,
        color: KingdomColors.faithPrimary,
        fontWeight: '500',
    },
    applyContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: KingdomColors.border,
    },
    applyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: KingdomColors.primary,
        paddingVertical: 15,
        borderRadius: 12,
    },
    applyButtonText: {
        color: KingdomColors.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
}); 