import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Image,
    Dimensions,
    Share,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../../contexts/AuthContext';
import { useFaithMode } from '../../contexts/FaithModeContext';
import { KingdomColors } from '../../constants/KingdomColors';
import { KingdomShadows } from '../../constants/KingdomShadows';
import { useTierSystem } from '../../hooks/useTierSystem';
import { AIImageService } from '../../services/AIImageService';

const { width } = Dimensions.get('window');

interface ImageGenerationOptions {
    style: 'realistic' | 'artistic' | 'prophetic' | 'faith-inspired';
    dimensions: '16:9' | '9:16' | '1:1' | '4:5' | 'custom';
    useCase: 'reels' | 'thumbnails' | 'mockups' | 'prophetic' | 'social-media';
    faithMode: boolean;
}

interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
    options: ImageGenerationOptions;
    createdAt: Date;
    metadata: {
        generationTime: number;
        model: string;
        cost: number;
    };
}

export const AIImageStudioScreen: React.FC = () => {
    const { user } = useAuth();
    const { isFaithMode } = useFaithMode();
    const { userTier, canAccessFeature, getRemainingCredits } = useTierSystem();

    const [prompt, setPrompt] = useState('');
    const [options, setOptions] = useState<ImageGenerationOptions>({
        style: 'faith-inspired',
        dimensions: '1:1',
        useCase: 'social-media',
        faithMode: isFaithMode,
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
    const [refinementLevel, setRefinementLevel] = useState(50);

    const aiImageService = useRef(new AIImageService()).current;

    // Tier-based feature access
    const canGenerateImages = canAccessFeature('pro');
    const remainingCredits = getRemainingCredits('image_generation');
    const maxImagesPerDay = userTier === 'enterprise' ? 100 : userTier === 'pro' ? 50 : 10;

    const styleOptions = [
        { value: 'realistic', label: 'Realistic', icon: '🎨' },
        { value: 'artistic', label: 'Artistic', icon: '🖼️' },
        { value: 'prophetic', label: 'Prophetic', icon: '✨' },
        { value: 'faith-inspired', label: 'Faith-Inspired', icon: '🙏' },
    ];

    const dimensionOptions = [
        { value: '16:9', label: 'Landscape (16:9)', icon: '📺' },
        { value: '9:16', label: 'Portrait (9:16)', icon: '📱' },
        { value: '1:1', label: 'Square (1:1)', icon: '⬜' },
        { value: '4:5', label: 'Instagram (4:5)', icon: '📸' },
    ];

    const useCaseOptions = [
        { value: 'reels', label: 'Reels', icon: '🎬' },
        { value: 'thumbnails', label: 'Thumbnails', icon: '🎯' },
        { value: 'mockups', label: 'Mockups', icon: '📱' },
        { value: 'prophetic', label: 'Prophetic', icon: '✨' },
        { value: 'social-media', label: 'Social Media', icon: '📱' },
    ];

    const generateImage = async () => {
        if (!prompt.trim()) {
            Alert.alert('Prompt Required', 'Please enter a description for your image.');
            return;
        }

        if (!canGenerateImages) {
            Alert.alert(
                'Feature Unavailable',
                'AI Image Generation is available for Pro and Enterprise users. Upgrade your plan to access this feature.'
            );
            return;
        }

        if (remainingCredits <= 0) {
            Alert.alert(
                'Daily Limit Reached',
                `You've reached your daily limit of ${maxImagesPerDay} image generations. Upgrade to generate more images.`
            );
            return;
        }

        setIsGenerating(true);

        try {
            // Enhanced prompt for faith-based content
            let enhancedPrompt = prompt;
            if (options.faithMode) {
                enhancedPrompt = `Create a beautiful, inspiring image: ${prompt}. Include elements of faith, hope, and Kingdom values. Make it uplifting and spiritually meaningful.`;
            }

            const result = await aiImageService.generateImage({
                prompt: enhancedPrompt,
                style: options.style,
                dimensions: options.dimensions,
                useCase: options.useCase,
                faithMode: options.faithMode,
                refinementLevel,
            });

            const newImage: GeneratedImage = {
                id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                url: result.url,
                prompt: enhancedPrompt,
                options: { ...options },
                createdAt: new Date(),
                metadata: {
                    generationTime: result.generationTime,
                    model: result.model,
                    cost: result.cost,
                },
            };

            setGeneratedImages(prev => [newImage, ...prev]);
            setSelectedImage(newImage);

            Alert.alert(
                'Image Generated!',
                'Your image has been created successfully. You can now save, share, or refine it further.'
            );

        } catch (error) {
            console.error('Image generation error:', error);
            Alert.alert(
                'Generation Failed',
                'Failed to generate image. Please try again with a different prompt.'
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const saveImage = async (image: GeneratedImage) => {
        try {
            const result = await FileSystem.downloadAsync(
                image.url,
                FileSystem.documentDirectory + `kingdom_studios_image_${image.id}.jpg`
            );

            if (result.status === 200) {
                Alert.alert('Success', 'Image saved to your device!');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save image. Please try again.');
        }
    };

    const shareImage = async (image: GeneratedImage) => {
        try {
            await Share.share({
                url: image.url,
                message: `Check out this AI-generated image I created with Kingdom Studios: ${image.prompt}`,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share image. Please try again.');
        }
    };

    const renderPromptSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Describe Your Image</Text>
            <TextInput
                style={styles.promptInput}
                placeholder="Describe the image you want to create... (e.g., 'A peaceful mountain landscape at sunrise with faith symbols')"
                value={prompt}
                onChangeText={setPrompt}
                multiline
                numberOfLines={3}
                placeholderTextColor={KingdomColors.textSecondary}
            />
        </View>
    );

    const renderOptionsSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customize Your Image</Text>

            {/* Style Selection */}
            <Text style={styles.optionLabel}>Style</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
                {styleOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.optionButton,
                            options.style === option.value && styles.optionButtonSelected
                        ]}
                        onPress={() => setOptions(prev => ({ ...prev, style: option.value as any }))}
                    >
                        <Text style={styles.optionIcon}>{option.icon}</Text>
                        <Text style={[
                            styles.optionText,
                            options.style === option.value && styles.optionTextSelected
                        ]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Dimensions Selection */}
            <Text style={styles.optionLabel}>Dimensions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
                {dimensionOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.optionButton,
                            options.dimensions === option.value && styles.optionButtonSelected
                        ]}
                        onPress={() => setOptions(prev => ({ ...prev, dimensions: option.value as any }))}
                    >
                        <Text style={styles.optionIcon}>{option.icon}</Text>
                        <Text style={[
                            styles.optionText,
                            options.dimensions === option.value && styles.optionTextSelected
                        ]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Use Case Selection */}
            <Text style={styles.optionLabel}>Use Case</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
                {useCaseOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.optionButton,
                            options.useCase === option.value && styles.optionButtonSelected
                        ]}
                        onPress={() => setOptions(prev => ({ ...prev, useCase: option.value as any }))}
                    >
                        <Text style={styles.optionIcon}>{option.icon}</Text>
                        <Text style={[
                            styles.optionText,
                            options.useCase === option.value && styles.optionTextSelected
                        ]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Refinement Slider */}
            <Text style={styles.optionLabel}>Refinement Level</Text>
            <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Basic</Text>
                <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${refinementLevel}%` }]} />
                    <TouchableOpacity
                        style={[styles.sliderThumb, { left: `${refinementLevel}%` }]}
                        onPressIn={() => {/* Add slider interaction */ }}
                    />
                </View>
                <Text style={styles.sliderLabel}>Advanced</Text>
            </View>
        </View>
    );

    const renderGeneratedImages = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Generated Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
                {generatedImages.map((image) => (
                    <TouchableOpacity
                        key={image.id}
                        style={[
                            styles.imageCard,
                            selectedImage?.id === image.id && styles.imageCardSelected
                        ]}
                        onPress={() => setSelectedImage(image)}
                    >
                        <Image source={{ uri: image.url }} style={styles.generatedImage} />
                        <View style={styles.imageActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => saveImage(image)}
                            >
                                <Text style={styles.actionButtonText}>💾</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => shareImage(image)}
                            >
                                <Text style={styles.actionButtonText}>📤</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderTierInfo = () => (
        <View style={styles.tierInfoContainer}>
            <LinearGradient
                colors={[KingdomColors.primary, KingdomColors.primaryDark]}
                style={styles.tierInfoGradient}
            >
                <Text style={styles.tierInfoTitle}>
                    {canGenerateImages ? 'AI Image Studio' : 'Upgrade Required'}
                </Text>
                <Text style={styles.tierInfoText}>
                    {canGenerateImages
                        ? `Remaining: ${remainingCredits}/${maxImagesPerDay} images today`
                        : 'Pro plan required for AI image generation'
                    }
                </Text>
            </LinearGradient>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>AI Image Studio</Text>
                    <Text style={styles.subtitle}>
                        Create stunning visuals with AI-powered image generation
                    </Text>
                </View>

                {renderTierInfo()}
                {renderPromptSection()}
                {renderOptionsSection()}

                <View style={styles.generateSection}>
                    <TouchableOpacity
                        style={[
                            styles.generateButton,
                            (!canGenerateImages || isGenerating) && styles.generateButtonDisabled
                        ]}
                        onPress={generateImage}
                        disabled={!canGenerateImages || isGenerating}
                    >
                        {isGenerating ? (
                            <ActivityIndicator color={KingdomColors.white} size="small" />
                        ) : (
                            <Text style={styles.generateButtonText}>Generate Image</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {generatedImages.length > 0 && renderGeneratedImages()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.background,
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
        color: KingdomColors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: KingdomColors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    tierInfoContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        ...KingdomShadows.medium,
    },
    tierInfoGradient: {
        padding: 16,
        alignItems: 'center',
    },
    tierInfoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.white,
        marginBottom: 4,
    },
    tierInfoText: {
        fontSize: 14,
        color: KingdomColors.white,
        opacity: 0.9,
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.text,
        marginBottom: 16,
    },
    promptInput: {
        backgroundColor: KingdomColors.surface,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: KingdomColors.text,
        borderWidth: 1,
        borderColor: KingdomColors.border,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: KingdomColors.text,
        marginBottom: 12,
        marginTop: 16,
    },
    optionsContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    optionButton: {
        backgroundColor: KingdomColors.surface,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: KingdomColors.border,
        alignItems: 'center',
        minWidth: 80,
    },
    optionButtonSelected: {
        backgroundColor: KingdomColors.primary,
        borderColor: KingdomColors.primary,
    },
    optionIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    optionText: {
        fontSize: 12,
        fontWeight: '600',
        color: KingdomColors.textSecondary,
        textAlign: 'center',
    },
    optionTextSelected: {
        color: KingdomColors.white,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    sliderTrack: {
        flex: 1,
        height: 4,
        backgroundColor: KingdomColors.border,
        borderRadius: 2,
        marginHorizontal: 12,
        position: 'relative',
    },
    sliderFill: {
        height: '100%',
        backgroundColor: KingdomColors.primary,
        borderRadius: 2,
    },
    sliderThumb: {
        position: 'absolute',
        width: 20,
        height: 20,
        backgroundColor: KingdomColors.primary,
        borderRadius: 10,
        top: -8,
        marginLeft: -10,
    },
    sliderLabel: {
        fontSize: 12,
        color: KingdomColors.textSecondary,
    },
    generateSection: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    generateButton: {
        backgroundColor: KingdomColors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        ...KingdomShadows.medium,
    },
    generateButtonDisabled: {
        backgroundColor: KingdomColors.textSecondary,
    },
    generateButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.white,
    },
    imagesContainer: {
        flexDirection: 'row',
        marginTop: 12,
    },
    imageCard: {
        backgroundColor: KingdomColors.surface,
        borderRadius: 12,
        marginRight: 16,
        padding: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        ...KingdomShadows.small,
    },
    imageCardSelected: {
        borderColor: KingdomColors.primary,
    },
    generatedImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    imageActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        padding: 8,
    },
    actionButtonText: {
        fontSize: 18,
    },
}); 