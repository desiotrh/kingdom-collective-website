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
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Colors } from '@/constants/Colors';
import AIReflectModal from '../../../../packages/ui/AIReflectModal';
import { getReflectPrompts } from '../../../../packages/utils/valuesStyle';

const { width } = Dimensions.get('window');

interface ImageGenerationOptions {
    style: 'realistic' | 'artistic' | 'prophetic' | 'faith-inspired';
    dimensions: '16:9' | '9:16' | '1:1' | '4:5' | 'custom';
    useCase: 'thumbnail' | 'intro' | 'outro' | 'prophetic' | 'social-media';
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

export default function AIImageStudioScreen() {
    const { faithMode, encouragementMode } = useFaithMode();

    const [prompt, setPrompt] = useState('');
    const [options, setOptions] = useState<ImageGenerationOptions>({
        style: 'faith-inspired',
        dimensions: '9:16', // Default to vertical for video content
        useCase: 'thumbnail',
        faithMode: faithMode,
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
    const [refinementLevel, setRefinementLevel] = useState(50);

    // Mock AI service for Kingdom Clips
    const [reflectVisible, setReflectVisible] = useState(false);

    const generateImage = async () => {
        if (!prompt.trim()) {
            Alert.alert('Prompt Required', 'Please enter a description for your image.');
            return;
        }

        setReflectVisible(true);
    };

    const doGenerateImage = async () => {
        setIsGenerating(true);

        try {
            // Enhanced prompt for video content creation
            let enhancedPrompt = prompt;
            if (options.faithMode) {
                enhancedPrompt = `Create a stunning video thumbnail: ${prompt}. Include elements of faith, hope, and Kingdom values. Make it eye-catching and spiritually meaningful for video content.`;
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

            // Generate mock image URL based on style
            const mockImages = {
                'realistic': 'https://picsum.photos/512/768?random=1',
                'artistic': 'https://picsum.photos/512/768?random=2',
                'prophetic': 'https://picsum.photos/512/768?random=3',
                'faith-inspired': 'https://picsum.photos/512/768?random=4',
            };

            const newImage: GeneratedImage = {
                id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                url: mockImages[options.style] || mockImages['faith-inspired'],
                prompt: enhancedPrompt,
                options: { ...options },
                createdAt: new Date(),
                metadata: {
                    generationTime: 3000,
                    model: 'fal-fast-sdxl',
                    cost: 0.01,
                },
            };

            setGeneratedImages(prev => [newImage, ...prev]);
            setSelectedImage(newImage);

            Alert.alert(
                'Image Generated!',
                'Your video thumbnail has been created successfully. You can now save, share, or use it for your video content.',
                [
                    { text: 'Use as Thumbnail', onPress: () => useAsThumbnail(newImage) },
                    { text: 'OK' }
                ]
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

    const useAsThumbnail = (image: GeneratedImage) => {
        Alert.alert(
            'Use as Thumbnail',
            'This image will be set as the thumbnail for your current video project.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Apply', onPress: () => {
                        // Here you would integrate with the video editor
                        Alert.alert('Success', 'Thumbnail applied to your video project!');
                    }
                }
            ]
        );
    };

    const saveImage = async (image: GeneratedImage) => {
        try {
            const result = await FileSystem.downloadAsync(
                image.url,
                FileSystem.documentDirectory + `kingdom_clips_thumbnail_${image.id}.jpg`
            );

            if (result.status === 200) {
                Alert.alert('Success', 'Thumbnail saved to your device!');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save thumbnail. Please try again.');
        }
    };

    const shareImage = async (image: GeneratedImage) => {
        try {
            await Share.share({
                url: image.url,
                message: `Check out this AI-generated thumbnail I created with Kingdom Clips: ${image.prompt}`,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share thumbnail. Please try again.');
        }
    };

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
        { value: 'thumbnail', label: 'Video Thumbnail', icon: '🎯' },
        { value: 'intro', label: 'Intro Screen', icon: '🎬' },
        { value: 'outro', label: 'Outro Screen', icon: '🏁' },
        { value: 'prophetic', label: 'Prophetic Visual', icon: '✨' },
        { value: 'social-media', label: 'Social Media', icon: '📱' },
    ];

    const renderPromptSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Describe Your Video Thumbnail</Text>
            <TextInput
                style={styles.promptInput}
                placeholder="Describe the thumbnail you want to create... (e.g., 'A powerful testimony thumbnail with faith symbols and uplifting colors')"
                value={prompt}
                onChangeText={setPrompt}
                multiline
                numberOfLines={3}
                placeholderTextColor={Colors.textSecondary}
            />
        </View>
    );

    const renderOptionsSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customize Your Thumbnail</Text>

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
            <Text style={styles.sectionTitle}>Generated Thumbnails</Text>
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
                                onPress={() => useAsThumbnail(image)}
                            >
                                <Text style={styles.actionButtonText}>🎯</Text>
                            </TouchableOpacity>
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>AI Thumbnail Studio</Text>
                    <Text style={styles.subtitle}>
                        Create stunning video thumbnails with AI-powered image generation
                    </Text>
                </View>

                {renderPromptSection()}
                {renderOptionsSection()}

                <View style={styles.generateSection}>
                    <TouchableOpacity
                        style={[
                            styles.generateButton,
                            isGenerating && styles.generateButtonDisabled
                        ]}
                        onPress={generateImage}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <ActivityIndicator color={Colors.white} size="small" />
                        ) : (
                            <Text style={styles.generateButtonText}>Generate Thumbnail</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {generatedImages.length > 0 && renderGeneratedImages()}
            </ScrollView>

            <AIReflectModal
              visible={reflectVisible}
              beforePrompts={getReflectPrompts(faithMode).before}
              onSkip={() => { setReflectVisible(false); doGenerateImage(); }}
              onConfirm={() => { setReflectVisible(false); doGenerateImage(); }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
    },
    promptInput: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: Colors.text,
        borderWidth: 1,
        borderColor: Colors.border,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
        marginTop: 16,
    },
    optionsContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    optionButton: {
        backgroundColor: Colors.surface,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        minWidth: 80,
    },
    optionButtonSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    optionIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    optionText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    optionTextSelected: {
        color: Colors.white,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    sliderTrack: {
        flex: 1,
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        marginHorizontal: 12,
        position: 'relative',
    },
    sliderFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    sliderThumb: {
        position: 'absolute',
        width: 20,
        height: 20,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        top: -8,
        marginLeft: -10,
    },
    sliderLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    generateSection: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    generateButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    generateButtonDisabled: {
        backgroundColor: Colors.textSecondary,
    },
    generateButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
    },
    imagesContainer: {
        flexDirection: 'row',
        marginTop: 12,
    },
    imageCard: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        marginRight: 16,
        padding: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    imageCardSelected: {
        borderColor: Colors.primary,
    },
    generatedImage: {
        width: 120,
        height: 160, // Taller for video thumbnails
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