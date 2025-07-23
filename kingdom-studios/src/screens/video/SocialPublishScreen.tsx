import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    TextInput,
    Switch,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { KingdomColors } from '../../constants/KingdomColors';
import { useDualMode } from '../../contexts/DualModeContext';

const { width } = Dimensions.get('window');

interface Platform {
    id: string;
    name: string;
    icon: string;
    color: string;
    aspectRatio: string;
    maxDuration: number;
    requirements: string[];
}

interface PublishSettings {
    title: string;
    description: string;
    hashtags: string[];
    scheduledTime?: Date;
    isScheduled: boolean;
    crossPost: boolean;
    platforms: string[];
}

interface SocialPublishScreenProps {
    navigation: any;
}

export default function SocialPublishScreen({ navigation }: SocialPublishScreenProps) {
    const { isFaithMode } = useDualMode();

    // State
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [publishSettings, setPublishSettings] = useState<PublishSettings>({
        title: '',
        description: '',
        hashtags: [],
        isScheduled: false,
        crossPost: false,
        platforms: [],
    });
    const [isPublishing, setIsPublishing] = useState(false);
    const [viralScore, setViralScore] = useState(75);

    const platforms: Platform[] = [
        {
            id: 'tiktok',
            name: 'TikTok',
            icon: '🎵',
            color: '#000000',
            aspectRatio: '9:16',
            maxDuration: 60,
            requirements: ['Vertical video', 'High engagement', 'Trending audio'],
        },
        {
            id: 'instagram_reels',
            name: 'Instagram Reels',
            icon: '📱',
            color: '#E4405F',
            aspectRatio: '9:16',
            maxDuration: 90,
            requirements: ['Vertical video', 'High quality', 'Relevant hashtags'],
        },
        {
            id: 'youtube_shorts',
            name: 'YouTube Shorts',
            icon: '▶️',
            color: '#FF0000',
            aspectRatio: '9:16',
            maxDuration: 60,
            requirements: ['Vertical video', 'SEO optimized', 'Engaging content'],
        },
        {
            id: 'facebook',
            name: 'Facebook',
            icon: '📘',
            color: '#1877F2',
            aspectRatio: '16:9',
            maxDuration: 14400,
            requirements: ['High quality', 'Community engagement', 'Shareable content'],
        },
    ];

    const faithHashtags = [
        '#FaithOverFear',
        '#GodIsGood',
        '#Blessed',
        '#ChristianLife',
        '#KingdomClips',
        '#FaithContent',
        '#ChristianCreators',
        '#Inspiration',
    ];

    const encouragementHashtags = [
        '#KeepGoing',
        '#YouGotThis',
        '#Motivation',
        '#Inspiration',
        '#PositiveVibes',
        '#Encouragement',
        '#Success',
        '#Growth',
    ];

    const togglePlatform = (platformId: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(id => id !== platformId)
                : [...prev, platformId]
        );
    };

    const addHashtag = (hashtag: string) => {
        if (!publishSettings.hashtags.includes(hashtag)) {
            setPublishSettings(prev => ({
                ...prev,
                hashtags: [...prev.hashtags, hashtag],
            }));
        }
    };

    const removeHashtag = (hashtag: string) => {
        setPublishSettings(prev => ({
            ...prev,
            hashtags: prev.hashtags.filter(h => h !== hashtag),
        }));
    };

    const validateFormat = (platform: Platform) => {
        // This would check video format against platform requirements
        const isValid = true; // Mock validation
        return isValid;
    };

    const publishToPlatform = async (platformId: string) => {
        setIsPublishing(true);

        try {
            // Simulate publishing process
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert(
                'Success!',
                `Video published to ${platforms.find(p => p.id === platformId)?.name}!`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to publish video. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    const publishToAllPlatforms = async () => {
        setIsPublishing(true);

        try {
            for (const platformId of selectedPlatforms) {
                await publishToPlatform(platformId);
            }

            Alert.alert('Success!', 'Video published to all selected platforms!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to publish to some platforms. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    const renderPlatformCard = (platform: Platform) => {
        const isSelected = selectedPlatforms.includes(platform.id);
        const isValid = validateFormat(platform);

        return (
            <TouchableOpacity
                key={platform.id}
                style={[
                    styles.platformCard,
                    isSelected && styles.selectedPlatformCard,
                    !isValid && styles.invalidPlatformCard,
                ]}
                onPress={() => togglePlatform(platform.id)}
            >
                <View style={styles.platformHeader}>
                    <Text style={styles.platformIcon}>{platform.icon}</Text>
                    <Text style={[styles.platformName, { color: platform.color }]}>
                        {platform.name}
                    </Text>
                    {isSelected && (
                        <MaterialIcons name="check-circle" size={20} color={platform.color} />
                    )}
                </View>

                <View style={styles.platformDetails}>
                    <Text style={styles.platformDetail}>Aspect: {platform.aspectRatio}</Text>
                    <Text style={styles.platformDetail}>Max: {platform.maxDuration}s</Text>
                </View>

                {!isValid && (
                    <View style={styles.validationWarning}>
                        <MaterialIcons name="warning" size={16} color={KingdomColors.error} />
                        <Text style={styles.validationText}>Format not compatible</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderHashtagSuggestion = (hashtag: string) => (
        <TouchableOpacity
            key={hashtag}
            style={styles.hashtagSuggestion}
            onPress={() => addHashtag(hashtag)}
        >
            <Text style={styles.hashtagSuggestionText}>{hashtag}</Text>
            <MaterialIcons name="add" size={16} color={KingdomColors.primary} />
        </TouchableOpacity>
    );

    const renderSelectedHashtag = (hashtag: string) => (
        <View key={hashtag} style={styles.selectedHashtag}>
            <Text style={styles.selectedHashtagText}>{hashtag}</Text>
            <TouchableOpacity onPress={() => removeHashtag(hashtag)}>
                <MaterialIcons name="close" size={16} color={KingdomColors.white} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={KingdomColors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Publish to Social</Text>
                <TouchableOpacity>
                    <MaterialIcons name="settings" size={24} color={KingdomColors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Video Preview */}
                <View style={styles.previewSection}>
                    <Text style={styles.sectionTitle}>Video Preview</Text>
                    <View style={styles.videoPreview}>
                        <Image
                            source={{ uri: 'https://example.com/video-thumbnail.jpg' }}
                            style={styles.previewImage}
                            defaultSource={require('../../assets/video-placeholder.png')}
                        />
                        <View style={styles.previewOverlay}>
                            <Text style={styles.previewText}>Your Video</Text>
                        </View>
                    </View>

                    <View style={styles.viralScoreContainer}>
                        <Text style={styles.viralScoreLabel}>Viral Score</Text>
                        <View style={styles.viralScoreBar}>
                            <View
                                style={[
                                    styles.viralScoreFill,
                                    { width: `${viralScore}%` },
                                ]}
                            />
                        </View>
                        <Text style={styles.viralScoreText}>{viralScore}/100</Text>
                    </View>
                </View>

                {/* Platform Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Platforms</Text>
                    <View style={styles.platformsGrid}>
                        {platforms.map(renderPlatformCard)}
                    </View>
                </View>

                {/* Content Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Content Details</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Title</Text>
                        <TextInput
                            style={styles.textInput}
                            value={publishSettings.title}
                            onChangeText={(text) => setPublishSettings(prev => ({ ...prev, title: text }))}
                            placeholder="Enter video title..."
                            placeholderTextColor={KingdomColors.textSecondary}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            value={publishSettings.description}
                            onChangeText={(text) => setPublishSettings(prev => ({ ...prev, description: text }))}
                            placeholder="Enter video description..."
                            placeholderTextColor={KingdomColors.textSecondary}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                {/* Hashtags */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hashtags</Text>

                    <View style={styles.hashtagSuggestions}>
                        <Text style={styles.hashtagSectionTitle}>
                            {isFaithMode ? 'Faith Hashtags' : 'Encouragement Hashtags'}
                        </Text>
                        <View style={styles.hashtagGrid}>
                            {(isFaithMode ? faithHashtags : encouragementHashtags).map(renderHashtagSuggestion)}
                        </View>
                    </View>

                    {publishSettings.hashtags.length > 0 && (
                        <View style={styles.selectedHashtags}>
                            <Text style={styles.selectedHashtagsTitle}>Selected Hashtags</Text>
                            <View style={styles.selectedHashtagsGrid}>
                                {publishSettings.hashtags.map(renderSelectedHashtag)}
                            </View>
                        </View>
                    )}
                </View>

                {/* Publishing Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Publishing Options</Text>

                    <View style={styles.optionRow}>
                        <View style={styles.optionInfo}>
                            <MaterialIcons name="schedule" size={20} color={KingdomColors.text} />
                            <Text style={styles.optionLabel}>Schedule Post</Text>
                        </View>
                        <Switch
                            value={publishSettings.isScheduled}
                            onValueChange={(value) => setPublishSettings(prev => ({ ...prev, isScheduled: value }))}
                            trackColor={{ false: KingdomColors.border, true: KingdomColors.primary }}
                            thumbColor={KingdomColors.white}
                        />
                    </View>

                    <View style={styles.optionRow}>
                        <View style={styles.optionInfo}>
                            <MaterialIcons name="share" size={20} color={KingdomColors.text} />
                            <Text style={styles.optionLabel}>Cross-Post</Text>
                        </View>
                        <Switch
                            value={publishSettings.crossPost}
                            onValueChange={(value) => setPublishSettings(prev => ({ ...prev, crossPost: value }))}
                            trackColor={{ false: KingdomColors.border, true: KingdomColors.primary }}
                            thumbColor={KingdomColors.white}
                        />
                    </View>
                </View>

                {/* Faith Mode Enhancements */}
                {isFaithMode && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Faith Mode Enhancements</Text>
                        <View style={styles.faithEnhancements}>
                            <TouchableOpacity style={styles.faithEnhancement}>
                                <FontAwesome5 name="cross" size={16} color={KingdomColors.faithPrimary} />
                                <Text style={styles.faithEnhancementText}>Add Scripture Overlay</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.faithEnhancement}>
                                <FontAwesome5 name="pray" size={16} color={KingdomColors.faithPrimary} />
                                <Text style={styles.faithEnhancementText}>Prayer Caption</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.faithEnhancement}>
                                <FontAwesome5 name="church" size={16} color={KingdomColors.faithPrimary} />
                                <Text style={styles.faithEnhancementText}>Church Tag</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Publish Button */}
            <View style={styles.publishContainer}>
                <TouchableOpacity
                    style={[
                        styles.publishButton,
                        (selectedPlatforms.length === 0 || isPublishing) && styles.publishButtonDisabled,
                    ]}
                    onPress={publishToAllPlatforms}
                    disabled={selectedPlatforms.length === 0 || isPublishing}
                >
                    {isPublishing ? (
                        <>
                            <MaterialIcons name="hourglass-empty" size={20} color={KingdomColors.white} />
                            <Text style={styles.publishButtonText}>Publishing...</Text>
                        </>
                    ) : (
                        <>
                            <MaterialIcons name="publish" size={20} color={KingdomColors.white} />
                            <Text style={styles.publishButtonText}>
                                Publish to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
                            </Text>
                        </>
                    )}
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
    content: {
        flex: 1,
        padding: 20,
    },
    previewSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: KingdomColors.text,
        marginBottom: 15,
    },
    videoPreview: {
        height: 200,
        backgroundColor: KingdomColors.surface,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 15,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    previewOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewText: {
        color: KingdomColors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    viralScoreContainer: {
        alignItems: 'center',
    },
    viralScoreLabel: {
        fontSize: 14,
        color: KingdomColors.text,
        marginBottom: 8,
    },
    viralScoreBar: {
        width: '100%',
        height: 8,
        backgroundColor: KingdomColors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    viralScoreFill: {
        height: '100%',
        backgroundColor: KingdomColors.accent,
    },
    viralScoreText: {
        fontSize: 12,
        color: KingdomColors.textSecondary,
        marginTop: 5,
    },
    section: {
        marginBottom: 30,
    },
    platformsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    platformCard: {
        width: (width - 60) / 2,
        backgroundColor: KingdomColors.white,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: KingdomColors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedPlatformCard: {
        borderColor: KingdomColors.primary,
        borderWidth: 2,
    },
    invalidPlatformCard: {
        borderColor: KingdomColors.error,
        borderWidth: 1,
    },
    platformHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    platformIcon: {
        fontSize: 20,
    },
    platformName: {
        fontSize: 14,
        fontWeight: '600',
    },
    platformDetails: {
        marginBottom: 5,
    },
    platformDetail: {
        fontSize: 12,
        color: KingdomColors.textSecondary,
    },
    validationWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    validationText: {
        fontSize: 10,
        color: KingdomColors.error,
        marginLeft: 4,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        color: KingdomColors.text,
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: KingdomColors.white,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: KingdomColors.text,
        borderWidth: 1,
        borderColor: KingdomColors.border,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    hashtagSuggestions: {
        marginBottom: 20,
    },
    hashtagSectionTitle: {
        fontSize: 14,
        color: KingdomColors.text,
        marginBottom: 10,
    },
    hashtagGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    hashtagSuggestion: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: KingdomColors.surface,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    hashtagSuggestionText: {
        fontSize: 12,
        color: KingdomColors.text,
        marginRight: 5,
    },
    selectedHashtags: {
        marginTop: 15,
    },
    selectedHashtagsTitle: {
        fontSize: 14,
        color: KingdomColors.text,
        marginBottom: 10,
    },
    selectedHashtagsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    selectedHashtag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: KingdomColors.primary,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedHashtagText: {
        fontSize: 12,
        color: KingdomColors.white,
        marginRight: 5,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.border,
    },
    optionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionLabel: {
        fontSize: 14,
        color: KingdomColors.text,
        marginLeft: 10,
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
    publishContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: KingdomColors.border,
    },
    publishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: KingdomColors.primary,
        paddingVertical: 15,
        borderRadius: 12,
    },
    publishButtonDisabled: {
        backgroundColor: KingdomColors.border,
    },
    publishButtonText: {
        color: KingdomColors.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
}); 