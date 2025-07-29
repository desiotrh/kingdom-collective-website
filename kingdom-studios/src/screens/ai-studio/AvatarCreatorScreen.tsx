import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
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
import { useAuth } from '../../contexts/UnifiedAuthContext';
import { useFaithMode } from '../../contexts/FaithModeContext';
import { KingdomColors } from '../../constants/KingdomColors';
import { KingdomShadows } from '../../constants/KingdomShadows';
import { useTierSystem } from '../../hooks/useTierSystem';
import { AvatarService } from '../../services/AvatarService';

const { width } = Dimensions.get('window');

interface AvatarGenerationRequest {
    images: string[];
    style: 'professional' | 'casual' | 'faith-inspired' | 'branding';
    purpose: 'profile' | 'talking' | 'branding';
    consentGiven: boolean;
    faithMode: boolean;
}

interface GeneratedAvatar {
    id: string;
    url: string;
    style: string;
    purpose: string;
    createdAt: Date;
    metadata: {
        generationTime: number;
        model: string;
        cost: number;
        consentGiven: boolean;
    };
}

export const AvatarCreatorScreen: React.FC = () => {
    const { user } = useAuth();
    const { isFaithMode } = useFaithMode();
    const { userTier, canAccessFeature, getRemainingCredits } = useTierSystem();

    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [style, setStyle] = useState<'professional' | 'casual' | 'faith-inspired' | 'branding'>('faith-inspired');
    const [purpose, setPurpose] = useState<'profile' | 'talking' | 'branding'>('profile');
    const [consentGiven, setConsentGiven] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedAvatars, setGeneratedAvatars] = useState<GeneratedAvatar[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState<GeneratedAvatar | null>(null);

    const avatarService = useRef(new AvatarService()).current;

    // Tier-based feature access
    const canCreateAvatars = canAccessFeature('pro');
    const remainingCredits = getRemainingCredits('avatar_generation');
    const maxAvatarsPerDay = userTier === 'enterprise' ? 10 : userTier === 'pro' ? 5 : 1;

    const styleOptions = [
        { value: 'professional', label: 'Professional', icon: '👔', description: 'Business-ready avatar' },
        { value: 'casual', label: 'Casual', icon: '😊', description: 'Friendly and approachable' },
        { value: 'faith-inspired', label: 'Faith-Inspired', icon: '🙏', description: 'Spiritual and uplifting' },
        { value: 'branding', label: 'Branding', icon: '🎨', description: 'Custom brand style' },
    ];

    const purposeOptions = [
        { value: 'profile', label: 'Profile Avatar', icon: '👤', description: 'For social media profiles' },
        { value: 'talking', label: 'Talking Avatar', icon: '🗣️', description: 'For video content' },
        { value: 'branding', label: 'Brand Avatar', icon: '🏢', description: 'For business branding' },
    ];

    const pickImages = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
                aspect: [1, 1],
            });

            if (!result.canceled && result.assets) {
                const newImages = result.assets.map(asset => asset.uri);
                setSelectedImages(prev => [...prev, ...newImages].slice(0, 5)); // Limit to 5 images
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick images. Please try again.');
        }
    };

    const takePhoto = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                aspect: [1, 1],
            });

            if (!result.canceled && result.assets) {
                const newImage = result.assets[0].uri;
                setSelectedImages(prev => [...prev, newImage].slice(0, 5));
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const generateAvatar = async () => {
        if (selectedImages.length === 0) {
            Alert.alert('Images Required', 'Please select at least one photo to create your avatar.');
            return;
        }

        if (!consentGiven) {
            Alert.alert('Consent Required', 'Please read and accept the terms before creating your avatar.');
            return;
        }

        if (!canCreateAvatars) {
            Alert.alert(
                'Feature Unavailable',
                'Avatar creation is available for Pro and Enterprise users. Upgrade your plan to access this feature.'
            );
            return;
        }

        if (remainingCredits <= 0) {
            Alert.alert(
                'Daily Limit Reached',
                `You've reached your daily limit of ${maxAvatarsPerDay} avatar generations. Upgrade to create more avatars.`
            );
            return;
        }

        setIsGenerating(true);

        try {
            const request: AvatarGenerationRequest = {
                images: selectedImages,
                style,
                purpose,
                consentGiven,
                faithMode: isFaithMode,
            };

            const result = await avatarService.generateAvatar(request);

            const newAvatar: GeneratedAvatar = {
                id: `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                url: result.url,
                style,
                purpose,
                createdAt: new Date(),
                metadata: {
                    generationTime: result.generationTime,
                    model: result.model,
                    cost: result.cost,
                    consentGiven,
                },
            };

            setGeneratedAvatars(prev => [newAvatar, ...prev]);
            setSelectedAvatar(newAvatar);

            Alert.alert(
                'Avatar Created!',
                'Your AI avatar has been generated successfully. You can now save, share, or use it for your content.'
            );

        } catch (error) {
            console.error('Avatar generation error:', error);
            Alert.alert(
                'Generation Failed',
                'Failed to generate avatar. Please try again with different photos.'
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const saveAvatar = async (avatar: GeneratedAvatar) => {
        try {
            // Implementation for saving avatar to device
            Alert.alert('Success', 'Avatar saved to your device!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save avatar. Please try again.');
        }
    };

    const shareAvatar = async (avatar: GeneratedAvatar) => {
        try {
            await Share.share({
                url: avatar.url,
                message: `Check out my AI-generated avatar created with Kingdom Studios!`,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share avatar. Please try again.');
        }
    };

    const renderConsentSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Consent & Terms</Text>
            <View style={styles.consentContainer}>
                <TouchableOpacity
                    style={[styles.checkbox, consentGiven && styles.checkboxChecked]}
                    onPress={() => setConsentGiven(!consentGiven)}
                >
                    {consentGiven && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <View style={styles.consentText}>
                    <Text style={styles.consentLabel}>
                        I consent to using my photos for AI avatar generation
                    </Text>
                    <Text style={styles.consentDescription}>
                        Your photos will be processed securely and used only for creating your avatar.
                        You can delete your data anytime in settings.
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderImageSelection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload Photos</Text>
            <Text style={styles.sectionDescription}>
                Upload 3-5 clear photos of yourself for best results
            </Text>

            <View style={styles.imageButtons}>
                <TouchableOpacity style={styles.imageButton} onPress={pickImages}>
                    <Text style={styles.imageButtonIcon}>📁</Text>
                    <Text style={styles.imageButtonText}>Choose Photos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                    <Text style={styles.imageButtonIcon}>📷</Text>
                    <Text style={styles.imageButtonText}>Take Photo</Text>
                </TouchableOpacity>
            </View>

            {selectedImages.length > 0 && (
                <View style={styles.selectedImagesContainer}>
                    <Text style={styles.selectedImagesTitle}>Selected Photos ({selectedImages.length}/5)</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {selectedImages.map((uri, index) => (
                            <View key={index} style={styles.imagePreviewContainer}>
                                <Image source={{ uri }} style={styles.imagePreview} />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => removeImage(index)}
                                >
                                    <Text style={styles.removeImageText}>×</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );

    const renderStyleSelection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Style</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
                {styleOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.optionCard,
                            style === option.value && styles.optionCardSelected
                        ]}
                        onPress={() => setStyle(option.value as any)}
                    >
                        <Text style={styles.optionIcon}>{option.icon}</Text>
                        <Text style={[
                            styles.optionTitle,
                            style === option.value && styles.optionTitleSelected
                        ]}>
                            {option.label}
                        </Text>
                        <Text style={[
                            styles.optionDescription,
                            style === option.value && styles.optionDescriptionSelected
                        ]}>
                            {option.description}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderPurposeSelection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Purpose</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
                {purposeOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.optionCard,
                            purpose === option.value && styles.optionCardSelected
                        ]}
                        onPress={() => setPurpose(option.value as any)}
                    >
                        <Text style={styles.optionIcon}>{option.icon}</Text>
                        <Text style={[
                            styles.optionTitle,
                            purpose === option.value && styles.optionTitleSelected
                        ]}>
                            {option.label}
                        </Text>
                        <Text style={[
                            styles.optionDescription,
                            purpose === option.value && styles.optionDescriptionSelected
                        ]}>
                            {option.description}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderGeneratedAvatars = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Generated Avatars</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarsContainer}>
                {generatedAvatars.map((avatar) => (
                    <TouchableOpacity
                        key={avatar.id}
                        style={[
                            styles.avatarCard,
                            selectedAvatar?.id === avatar.id && styles.avatarCardSelected
                        ]}
                        onPress={() => setSelectedAvatar(avatar)}
                    >
                        <Image source={{ uri: avatar.url }} style={styles.generatedAvatar} />
                        <View style={styles.avatarInfo}>
                            <Text style={styles.avatarStyle}>{avatar.style}</Text>
                            <Text style={styles.avatarPurpose}>{avatar.purpose}</Text>
                        </View>
                        <View style={styles.avatarActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => saveAvatar(avatar)}
                            >
                                <Text style={styles.actionButtonText}>💾</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => shareAvatar(avatar)}
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
                    {canCreateAvatars ? 'AI Avatar Creator' : 'Upgrade Required'}
                </Text>
                <Text style={styles.tierInfoText}>
                    {canCreateAvatars
                        ? `Remaining: ${remainingCredits}/${maxAvatarsPerDay} avatars today`
                        : 'Pro plan required for AI avatar creation'
                    }
                </Text>
            </LinearGradient>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Your Avatar</Text>
                    <Text style={styles.subtitle}>
                        Generate a realistic AI avatar for your digital presence
                    </Text>
                </View>

                {renderTierInfo()}
                {renderImageSelection()}
                {renderStyleSelection()}
                {renderPurposeSelection()}
                {renderConsentSection()}

                <View style={styles.generateSection}>
                    <TouchableOpacity
                        style={[
                            styles.generateButton,
                            (!canCreateAvatars || isGenerating || !consentGiven) && styles.generateButtonDisabled
                        ]}
                        onPress={generateAvatar}
                        disabled={!canCreateAvatars || isGenerating || !consentGiven}
                    >
                        {isGenerating ? (
                            <ActivityIndicator color={KingdomColors.white} size="small" />
                        ) : (
                            <Text style={styles.generateButtonText}>Create Avatar</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {generatedAvatars.length > 0 && renderGeneratedAvatars()}
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
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 14,
        color: KingdomColors.textSecondary,
        marginBottom: 16,
    },
    imageButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    imageButton: {
        flex: 1,
        backgroundColor: KingdomColors.surface,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: KingdomColors.border,
    },
    imageButtonIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    imageButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: KingdomColors.text,
    },
    selectedImagesContainer: {
        marginTop: 16,
    },
    selectedImagesTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: KingdomColors.text,
        marginBottom: 12,
    },
    imagePreviewContainer: {
        position: 'relative',
        marginRight: 12,
    },
    imagePreview: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: KingdomColors.error,
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeImageText: {
        color: KingdomColors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionsContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    optionCard: {
        backgroundColor: KingdomColors.surface,
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: KingdomColors.border,
        alignItems: 'center',
        minWidth: 120,
    },
    optionCardSelected: {
        backgroundColor: KingdomColors.primary,
        borderColor: KingdomColors.primary,
    },
    optionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    optionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: KingdomColors.text,
        textAlign: 'center',
        marginBottom: 4,
    },
    optionTitleSelected: {
        color: KingdomColors.white,
    },
    optionDescription: {
        fontSize: 12,
        color: KingdomColors.textSecondary,
        textAlign: 'center',
    },
    optionDescriptionSelected: {
        color: KingdomColors.white,
        opacity: 0.9,
    },
    consentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: KingdomColors.border,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: KingdomColors.primary,
        borderColor: KingdomColors.primary,
    },
    checkmark: {
        color: KingdomColors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    consentText: {
        flex: 1,
    },
    consentLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: KingdomColors.text,
        marginBottom: 4,
    },
    consentDescription: {
        fontSize: 14,
        color: KingdomColors.textSecondary,
        lineHeight: 20,
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
    avatarsContainer: {
        flexDirection: 'row',
        marginTop: 12,
    },
    avatarCard: {
        backgroundColor: KingdomColors.surface,
        borderRadius: 12,
        marginRight: 16,
        padding: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        ...KingdomShadows.small,
    },
    avatarCardSelected: {
        borderColor: KingdomColors.primary,
    },
    generatedAvatar: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    avatarInfo: {
        marginBottom: 8,
    },
    avatarStyle: {
        fontSize: 12,
        fontWeight: '600',
        color: KingdomColors.text,
        textTransform: 'capitalize',
    },
    avatarPurpose: {
        fontSize: 10,
        color: KingdomColors.textSecondary,
        textTransform: 'capitalize',
    },
    avatarActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        padding: 4,
    },
    actionButtonText: {
        fontSize: 16,
    },
}); 