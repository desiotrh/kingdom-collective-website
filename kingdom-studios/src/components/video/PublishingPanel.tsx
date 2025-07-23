import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Dimensions,
} from 'react-native';
import { KingdomColors } from '../../constants/KingdomColors';
import { ViralPrediction } from './ViralPrediction';

const { width: screenWidth } = Dimensions.get('window');

interface SocialPlatform {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    requirements: string[];
    maxDuration: number;
    aspectRatio: string;
}

interface PublishingPanelProps {
    viralScore: number | null;
    onPublish: (platform: string) => void;
    onViralPrediction: () => void;
}

const socialPlatforms: SocialPlatform[] = [
    {
        id: 'tiktok',
        name: 'TikTok',
        icon: '🎵',
        color: '#000000',
        description: 'Short-form video platform for creative content',
        requirements: ['Vertical video (9:16)', '15-60 seconds', 'Trending music', 'Engaging hook'],
        maxDuration: 60,
        aspectRatio: '9:16',
    },
    {
        id: 'instagram',
        name: 'Instagram Reels',
        icon: '📸',
        color: '#E4405F',
        description: 'Instagram\'s short video feature',
        requirements: ['Vertical video (9:16)', '15-90 seconds', 'High-quality content', 'Relevant hashtags'],
        maxDuration: 90,
        aspectRatio: '9:16',
    },
    {
        id: 'youtube',
        name: 'YouTube Shorts',
        icon: '📺',
        color: '#FF0000',
        description: 'YouTube\'s short-form video platform',
        requirements: ['Vertical video (9:16)', '15-60 seconds', 'Engaging content', 'SEO optimization'],
        maxDuration: 60,
        aspectRatio: '9:16',
    },
    {
        id: 'facebook',
        name: 'Facebook',
        icon: '📘',
        color: '#1877F2',
        description: 'Facebook video posts and stories',
        requirements: ['Various aspect ratios', 'Up to 240 minutes', 'Community engagement', 'Shareable content'],
        maxDuration: 14400, // 240 minutes
        aspectRatio: '16:9',
    },
];

export const PublishingPanel: React.FC<PublishingPanelProps> = ({
    viralScore,
    onPublish,
    onViralPrediction,
}) => {
    const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
    const [showViralPrediction, setShowViralPrediction] = useState(false);
    const [publishingStatus, setPublishingStatus] = useState<string | null>(null);

    const handlePlatformSelect = useCallback((platform: SocialPlatform) => {
        setSelectedPlatform(platform);
    }, []);

    const handlePublish = useCallback(async (platformId: string) => {
        setPublishingStatus('publishing');

        try {
            await onPublish(platformId);
            setPublishingStatus('success');

            setTimeout(() => {
                setPublishingStatus(null);
            }, 3000);
        } catch (error) {
            setPublishingStatus('error');
            Alert.alert('Publishing Failed', 'There was an error publishing your video. Please try again.');
        }
    }, [onPublish]);

    const renderViralScore = () => (
        <View style={styles.viralScoreContainer}>
            <Text style={styles.viralScoreTitle}>Viral Prediction Score</Text>
            {viralScore !== null ? (
                <View style={styles.scoreDisplay}>
                    <Text style={styles.scoreValue}>{viralScore}</Text>
                    <Text style={styles.scoreLabel}>/ 100</Text>
                    <View style={styles.scoreBar}>
                        <View
                            style={[
                                styles.scoreFill,
                                { width: `${viralScore}%`, backgroundColor: getScoreColor(viralScore) }
                            ]}
                        />
                    </View>
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.predictButton}
                    onPress={onViralPrediction}
                >
                    <Text style={styles.predictButtonText}>Calculate Viral Score</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const getScoreColor = (score: number) => {
        if (score >= 80) return KingdomColors.success;
        if (score >= 60) return KingdomColors.warning;
        return KingdomColors.error;
    };

    const renderPlatformCard = (platform: SocialPlatform) => (
        <TouchableOpacity
            key={platform.id}
            style={[
                styles.platformCard,
                selectedPlatform?.id === platform.id && styles.selectedPlatformCard,
            ]}
            onPress={() => handlePlatformSelect(platform)}
        >
            <View style={styles.platformHeader}>
                <Text style={styles.platformIcon}>{platform.icon}</Text>
                <View style={styles.platformInfo}>
                    <Text style={styles.platformName}>{platform.name}</Text>
                    <Text style={styles.platformDescription}>{platform.description}</Text>
                </View>
            </View>

            <View style={styles.platformRequirements}>
                <Text style={styles.requirementsTitle}>Requirements:</Text>
                {platform.requirements.map((requirement, index) => (
                    <Text key={index} style={styles.requirementText}>• {requirement}</Text>
                ))}
            </View>

            <View style={styles.platformSpecs}>
                <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Max Duration:</Text>
                    <Text style={styles.specValue}>
                        {platform.maxDuration <= 60
                            ? `${platform.maxDuration}s`
                            : `${Math.floor(platform.maxDuration / 60)}m`
                        }
                    </Text>
                </View>
                <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Aspect Ratio:</Text>
                    <Text style={styles.specValue}>{platform.aspectRatio}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderPublishingOptions = () => (
        <View style={styles.publishingOptions}>
            <Text style={styles.sectionTitle}>Publishing Options</Text>

            <View style={styles.optionRow}>
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {/* Schedule post */ }}
                >
                    <Text style={styles.optionButtonText}>📅 Schedule Post</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {/* Save draft */ }}
                >
                    <Text style={styles.optionButtonText}>💾 Save Draft</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.optionRow}>
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {/* Cross-post */ }}
                >
                    <Text style={styles.optionButtonText}>🔄 Cross-Post</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {/* Analytics */ }}
                >
                    <Text style={styles.optionButtonText}>📊 Analytics</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPublishButton = () => {
        if (!selectedPlatform) return null;

        return (
            <View style={styles.publishContainer}>
                <Text style={styles.publishTitle}>
                    Publish to {selectedPlatform.name}
                </Text>

                <TouchableOpacity
                    style={[
                        styles.publishButton,
                        { backgroundColor: selectedPlatform.color },
                        publishingStatus === 'publishing' && styles.publishingButton,
                    ]}
                    onPress={() => handlePublish(selectedPlatform.id)}
                    disabled={publishingStatus === 'publishing'}
                >
                    <Text style={styles.publishButtonText}>
                        {publishingStatus === 'publishing'
                            ? 'Publishing...'
                            : `Publish to ${selectedPlatform.name}`
                        }
                    </Text>
                </TouchableOpacity>

                {publishingStatus === 'success' && (
                    <View style={styles.successMessage}>
                        <Text style={styles.successText}>✅ Published successfully!</Text>
                    </View>
                )}

                {publishingStatus === 'error' && (
                    <View style={styles.errorMessage}>
                        <Text style={styles.errorText}>❌ Publishing failed</Text>
                    </View>
                )}
            </View>
        );
    };

    const renderOptimizationTips = () => (
        <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>Optimization Tips</Text>

            <ScrollView style={styles.tipsList}>
                <View style={styles.tipItem}>
                    <Text style={styles.tipIcon}>🎯</Text>
                    <Text style={styles.tipText}>Hook viewers in the first 3 seconds</Text>
                </View>

                <View style={styles.tipItem}>
                    <Text style={styles.tipIcon}>📝</Text>
                    <Text style={styles.tipText}>Use trending hashtags and captions</Text>
                </View>

                <View style={styles.tipItem}>
                    <Text style={styles.tipIcon}>🎵</Text>
                    <Text style={styles.tipText}>Add trending music or sound effects</Text>
                </View>

                <View style={styles.tipItem}>
                    <Text style={styles.tipIcon}>👥</Text>
                    <Text style={styles.tipText}>Engage with comments and community</Text>
                </View>

                <View style={styles.tipItem}>
                    <Text style={styles.tipIcon}>⏰</Text>
                    <Text style={styles.tipText}>Post at peak engagement times</Text>
                </View>
            </ScrollView>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Publish Your Video</Text>
                <Text style={styles.subtitle}>
                    Share your Kingdom content across social platforms
                </Text>
            </View>

            {renderViralScore()}

            <View style={styles.platformsContainer}>
                <Text style={styles.sectionTitle}>Choose Platform</Text>
                {socialPlatforms.map(renderPlatformCard)}
            </View>

            {renderPublishingOptions()}
            {renderPublishButton()}
            {renderOptimizationTips()}

            {showViralPrediction && viralScore !== null && (
                <ViralPrediction
                    score={viralScore}
                    onClose={() => setShowViralPrediction(false)}
                    onImprove={() => {/* Show improvement suggestions */ }}
                />
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
    viralScoreContainer: {
        padding: 16,
        backgroundColor: KingdomColors.dark,
    },
    viralScoreTitle: {
        color: KingdomColors.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    scoreDisplay: {
        alignItems: 'center',
    },
    scoreValue: {
        color: KingdomColors.white,
        fontSize: 48,
        fontWeight: 'bold',
    },
    scoreLabel: {
        color: KingdomColors.textSecondary,
        fontSize: 16,
        marginBottom: 8,
    },
    scoreBar: {
        width: '100%',
        height: 8,
        backgroundColor: KingdomColors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    scoreFill: {
        height: '100%',
        borderRadius: 4,
    },
    predictButton: {
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: KingdomColors.primary,
        alignItems: 'center',
    },
    predictButtonText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    platformsContainer: {
        padding: 16,
    },
    sectionTitle: {
        color: KingdomColors.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    platformCard: {
        backgroundColor: KingdomColors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: KingdomColors.border,
    },
    selectedPlatformCard: {
        borderColor: KingdomColors.primary,
        borderWidth: 2,
    },
    platformHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    platformIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    platformInfo: {
        flex: 1,
    },
    platformName: {
        color: KingdomColors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    platformDescription: {
        color: KingdomColors.textSecondary,
        fontSize: 14,
        marginTop: 2,
    },
    platformRequirements: {
        marginBottom: 12,
    },
    requirementsTitle: {
        color: KingdomColors.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    requirementText: {
        color: KingdomColors.textSecondary,
        fontSize: 12,
        marginBottom: 2,
    },
    platformSpecs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    specItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    specLabel: {
        color: KingdomColors.textSecondary,
        fontSize: 12,
        marginRight: 4,
    },
    specValue: {
        color: KingdomColors.text,
        fontSize: 12,
        fontWeight: '600',
    },
    publishingOptions: {
        padding: 16,
    },
    optionRow: {
        flexDirection: 'row',
        marginBottom: 12,
        gap: 8,
    },
    optionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: KingdomColors.secondary,
        alignItems: 'center',
    },
    optionButtonText: {
        color: KingdomColors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    publishContainer: {
        padding: 16,
    },
    publishTitle: {
        color: KingdomColors.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    publishButton: {
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    publishingButton: {
        backgroundColor: KingdomColors.secondary,
    },
    publishButtonText: {
        color: KingdomColors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    successMessage: {
        marginTop: 12,
        padding: 12,
        backgroundColor: KingdomColors.success,
        borderRadius: 8,
        alignItems: 'center',
    },
    successText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    errorMessage: {
        marginTop: 12,
        padding: 12,
        backgroundColor: KingdomColors.error,
        borderRadius: 8,
        alignItems: 'center',
    },
    errorText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    tipsContainer: {
        padding: 16,
    },
    tipsList: {
        maxHeight: 200,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    tipIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    tipText: {
        color: KingdomColors.text,
        fontSize: 14,
        flex: 1,
    },
}); 