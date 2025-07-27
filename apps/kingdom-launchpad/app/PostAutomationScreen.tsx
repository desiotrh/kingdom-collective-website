import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, Switch, Dimensions } from 'react-native';
import { Button } from '../../../packages/ui/Button';
import { Card } from '../../../packages/ui/Card';
import { Header } from '../../../packages/ui/Header';
import { TextInput } from '../../../packages/ui/TextInput';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

// Types
interface PostData {
    id: string;
    caption: string;
    hashtags: string[];
    platforms: PlatformConfig[];
    scheduledDate: Date;
    status: 'draft' | 'scheduled' | 'posted';
    isAnointed?: boolean;
    abTestVariants?: ABTestVariant[];
    recycledFrom?: string;
}

interface PlatformConfig {
    name: string;
    enabled: boolean;
    caption: string;
    hashtags: string[];
    imageUrl?: string;
    videoUrl?: string;
    optimized?: boolean;
}

interface ABTestVariant {
    id: string;
    caption: string;
    hashtags: string[];
    performance?: {
        views: number;
        likes: number;
        shares: number;
    };
}

interface SmartHashtag {
    hashtag: string;
    score: number;
    category: string;
    trending: boolean;
}

// Constants
const PLATFORMS = [
    { name: 'TikTok', icon: 'logo-tiktok', color: '#000000', maxLength: 150, optimalTime: '7-9 PM' },
    { name: 'Instagram', icon: 'logo-instagram', color: '#E4405F', maxLength: 2200, optimalTime: '2-4 PM' },
    { name: 'Facebook', icon: 'logo-facebook', color: '#1877F2', maxLength: 63206, optimalTime: '1-3 PM' },
    { name: 'YouTube Shorts', icon: 'logo-youtube', color: '#FF0000', maxLength: 100, optimalTime: '6-8 PM' },
    { name: 'Pinterest', icon: 'logo-pinterest', color: '#BD081C', maxLength: 500, optimalTime: '8-11 PM' }
];

const PLATFORM_RULES = {
    TikTok: {
        hashtags: ['#fyp', '#viral', '#trending', '#faith', '#blessed'],
        tips: 'Keep it short, engaging, and use trending sounds',
        optimalLength: '15-60 seconds',
        format: 'Vertical video'
    },
    Instagram: {
        hashtags: ['#instagram', '#instagood', '#photooftheday', '#faith', '#blessed'],
        tips: 'Use high-quality images and engaging captions',
        optimalLength: 'Square or vertical',
        format: 'Image or video'
    },
    Facebook: {
        hashtags: ['#facebook', '#socialmedia', '#faith', '#community'],
        tips: 'Longer captions work well, focus on community',
        optimalLength: 'Any length',
        format: 'Text, image, or video'
    },
    'YouTube Shorts': {
        hashtags: ['#shorts', '#youtube', '#viral', '#faith', '#inspiration'],
        tips: 'Vertical video, under 60 seconds, engaging hook',
        optimalLength: '15-60 seconds',
        format: 'Vertical video'
    },
    Pinterest: {
        hashtags: ['#pinterest', '#inspiration', '#design', '#faith', '#lifestyle'],
        tips: 'Beautiful images, detailed descriptions, keywords',
        optimalLength: 'Any length',
        format: 'Image with description'
    }
};

const SMART_HASHTAGS: SmartHashtag[] = [
    { hashtag: '#faith', score: 95, category: 'faith', trending: true },
    { hashtag: '#blessed', score: 88, category: 'faith', trending: true },
    { hashtag: '#grateful', score: 82, category: 'personal', trending: false },
    { hashtag: '#entrepreneur', score: 78, category: 'business', trending: true },
    { hashtag: '#kingdombusiness', score: 85, category: 'business', trending: true },
    { hashtag: '#testimony', score: 90, category: 'faith', trending: true },
    { hashtag: '#viral', score: 75, category: 'promo', trending: true },
    { hashtag: '#trending', score: 72, category: 'promo', trending: true },
    { hashtag: '#inspiration', score: 80, category: 'personal', trending: false },
    { hashtag: '#motivation', score: 77, category: 'personal', trending: false }
];

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const PlatformCard = styled(Card) <{ enabled: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  opacity: ${({ enabled }) => enabled ? 1 : 0.6};
`;

const PlatformHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const PlatformInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const PlatformIcon = styled.View<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ color }) => color};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const PlatformName = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const CharacterCount = styled.Text<{ isOverLimit: boolean }>`
  color: ${({ isOverLimit, theme }) => isOverLimit ? '#EF4444' : theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const TipsBox = styled.View`
  background-color: ${({ theme }) => theme.colors.gold + '20'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const TipsText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-style: italic;
`;

const PreviewCard = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const PreviewHeader = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const PreviewText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  line-height: 20px;
`;

const HashtagSuggestion = styled.TouchableOpacity<{ score: number }>`
  background-color: ${({ score, theme }) =>
        score >= 90 ? theme.colors.gold + '30' :
            score >= 80 ? theme.colors.sapphireBlue + '20' :
                theme.colors.silverGray + '20'
    };
  border-radius: 6px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
`;

const HashtagText = styled.Text<{ score: number }>`
  color: ${({ score, theme }) =>
        score >= 90 ? theme.colors.sapphireBlue :
            score >= 80 ? theme.colors.sapphireBlue :
                theme.colors.silverGray
    };
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: ${({ score }) => score >= 90 ? 'bold' : 'normal'};
`;

const ScoreBadge = styled.View<{ score: number }>`
  background-color: ${({ score }) =>
        score >= 90 ? '#10B981' :
            score >= 80 ? '#3B82F6' :
                '#6B7280'
    };
  border-radius: 10px;
  padding: 2px 6px;
  margin-left: 4px;
`;

const ScoreText = styled.Text`
  color: white;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 10px;
  font-weight: bold;
`;

const ABTestCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border: 2px solid ${({ theme }) => theme.colors.gold};
`;

const ABTestHeader = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const RecycledContentBanner = styled.View`
  background-color: ${({ theme }) => theme.colors.sapphireBlue + '20'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
`;

const RecycledText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const CrossPlatformPreview = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const PlatformPreview = styled.View<{ platform: string }>`
  flex: 1;
  margin: 0 ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: 8px;
  background-color: ${({ platform }) => {
        switch (platform) {
            case 'TikTok': return '#000000';
            case 'Instagram': return '#E4405F';
            case 'Facebook': return '#1877F2';
            case 'YouTube Shorts': return '#FF0000';
            case 'Pinterest': return '#BD081C';
            default: return '#6B7280';
        }
    }};
`;

const PlatformPreviewText = styled.Text`
  color: white;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  line-height: 16px;
`;

const OptimizationBanner = styled.View`
  background-color: ${({ theme }) => theme.colors.gold + '30'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
`;

const OptimizationText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: bold;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const ScheduleSection = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ScheduleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const ScheduleLabel = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: bold;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  width: 90%;
  max-height: 80%;
`;

export default function PostAutomationScreen() {
    const { faithMode } = useFaithMode();
    const [mainCaption, setMainCaption] = useState('');
    const [mainHashtags, setMainHashtags] = useState('');
    const [platformConfigs, setPlatformConfigs] = useState<PlatformConfig[]>(
        PLATFORMS.map(platform => ({
            name: platform.name,
            enabled: true,
            caption: '',
            hashtags: []
        }))
    );
    const [scheduledDate, setScheduledDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isAnointed, setIsAnointed] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewPlatform, setPreviewPlatform] = useState<string>('');
    const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
    const [showABTesting, setShowABTesting] = useState(false);
    const [abTestVariants, setAbTestVariants] = useState<ABTestVariant[]>([]);
    const [recycledContent, setRecycledContent] = useState<string | null>(null);
    const [showCrossPlatformPreview, setShowCrossPlatformPreview] = useState(false);

    useEffect(() => {
        // Auto-populate platform captions when main caption changes
        setPlatformConfigs(prev => prev.map(config => ({
            ...config,
            caption: mainCaption
        })));
    }, [mainCaption]);

    const handlePlatformToggle = (platformName: string) => {
        setPlatformConfigs(prev => prev.map(config =>
            config.name === platformName
                ? { ...config, enabled: !config.enabled }
                : config
        ));
    };

    const handlePlatformCaptionChange = (platformName: string, caption: string) => {
        setPlatformConfigs(prev => prev.map(config =>
            config.name === platformName
                ? { ...config, caption }
                : config
        ));
    };

    const handlePlatformHashtagsChange = (platformName: string, hashtags: string) => {
        const hashtagArray = hashtags.split(',').map(tag => tag.trim()).filter(tag => tag);
        setPlatformConfigs(prev => prev.map(config =>
            config.name === platformName
                ? { ...config, hashtags: hashtagArray }
                : config
        ));
    };

    const getPlatformRules = (platformName: string) => {
        return PLATFORM_RULES[platformName as keyof typeof PLATFORM_RULES] || {
            hashtags: [],
            tips: 'Optimize for this platform'
        };
    };

    const getCharacterCount = (platformName: string) => {
        const platform = PLATFORMS.find(p => p.name === platformName);
        const config = platformConfigs.find(c => c.name === platformName);
        if (!platform || !config) return { current: 0, limit: 0 };

        const content = config.caption + ' ' + config.hashtags.join(' ');
        return {
            current: content.length,
            limit: platform.maxLength
        };
    };

    const getSmartHashtagSuggestions = (platformName: string) => {
        const platformRules = getPlatformRules(platformName);
        return SMART_HASHTAGS.filter(hashtag =>
            platformRules.hashtags.includes(hashtag.hashtag) ||
            hashtag.trending
        ).sort((a, b) => b.score - a.score);
    };

    const handleHashtagSuggestion = (hashtag: string) => {
        setMainHashtags(prev => {
            const hashtags = prev.split(',').map(tag => tag.trim()).filter(tag => tag);
            if (!hashtags.includes(hashtag)) {
                hashtags.push(hashtag);
            }
            return hashtags.join(', ');
        });
    };

    const handleABTestCreation = () => {
        const variants: ABTestVariant[] = [
            {
                id: '1',
                caption: mainCaption + '\n\n#viral #trending',
                hashtags: [...mainHashtags.split(',').map(tag => tag.trim()), 'viral', 'trending']
            },
            {
                id: '2',
                caption: mainCaption + '\n\nWhat do you think? 👇',
                hashtags: [...mainHashtags.split(',').map(tag => tag.trim()), 'engagement', 'community']
            },
            {
                id: '3',
                caption: mainCaption + '\n\nShare this if you agree! 🙏',
                hashtags: [...mainHashtags.split(',').map(tag => tag.trim()), 'share', 'faith']
            }
        ];
        setAbTestVariants(variants);
        setShowABTesting(true);
    };

    const handleContentRecycling = () => {
        // Mock recycled content
        const recycledOptions = [
            "God is faithful! 🙏\n\nRemember when you doubted? Look at how far you've come! #faithful #blessed",
            "Your obedience creates ripples of change. Keep showing up! 💪 #obedience #legacy",
            "Every post is a seed planted for eternity. Keep planting! 🌱 #seeds #kingdom"
        ];
        const recycled = recycledOptions[Math.floor(Math.random() * recycledOptions.length)];
        setRecycledContent(recycled);
        setMainCaption(recycled);
        Alert.alert('Content Recycled', 'Viral content from your archive has been adapted for today!');
    };

    const handlePlatformOptimization = (platformName: string) => {
        const platform = PLATFORMS.find(p => p.name === platformName);
        const config = platformConfigs.find(c => c.name === platformName);
        if (!platform || !config) return;

        // Mock optimization
        const optimizedCaption = config.caption + '\n\n' + getPlatformRules(platformName).tips;
        const optimizedHashtags = [...config.hashtags, ...getPlatformRules(platformName).hashtags.slice(0, 3)];

        setPlatformConfigs(prev => prev.map(c =>
            c.name === platformName
                ? { ...c, caption: optimizedCaption, hashtags: optimizedHashtags, optimized: true }
                : c
        ));

        Alert.alert('Optimized!', `${platformName} content has been optimized for maximum engagement!`);
    };

    const handleSchedule = () => {
        const enabledPlatforms = platformConfigs.filter(config => config.enabled);
        if (enabledPlatforms.length === 0) {
            Alert.alert('No Platforms Selected', 'Please select at least one platform to post to.');
            return;
        }

        if (!mainCaption.trim()) {
            Alert.alert('Missing Caption', 'Please enter a caption for your post.');
            return;
        }

        // Mock scheduling - in real app, this would send to backend
        Alert.alert(
            'Post Scheduled!',
            `Your post has been scheduled for ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString()}`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Reset form
                        setMainCaption('');
                        setMainHashtags('');
                        setPlatformConfigs(PLATFORMS.map(platform => ({
                            name: platform.name,
                            enabled: true,
                            caption: '',
                            hashtags: []
                        })));
                        setScheduledDate(new Date());
                        setIsAnointed(false);
                        setRecycledContent(null);
                    }
                }
            ]
        );
    };

    const getEncouragementMessage = () => {
        const enabledCount = platformConfigs.filter(config => config.enabled).length;
        if (enabledCount >= 4) {
            return "You're reaching multiple platforms! Your message will touch many lives.";
        } else if (enabledCount >= 2) {
            return "Strategic platform selection! You're building your Kingdom influence.";
        } else {
            return "Every post is an opportunity to share your light. Choose your platforms wisely.";
        }
    };

    const getAnointMessage = () => {
        return "Anoint this post with prayer before scheduling. Let the Holy Spirit guide your message.";
    };

    return (
        <Container>
            <Header>Multi-Platform Post Automation</Header>

            {faithMode && (
                <EncouragementBanner>
                    <EncouragementText>{getEncouragementMessage()}</EncouragementText>
                </EncouragementBanner>
            )}

            {recycledContent && (
                <RecycledContentBanner>
                    <Ionicons name="refresh" size={20} color="#3B82F6" />
                    <RecycledText>Content recycled from your viral archive</RecycledText>
                </RecycledContentBanner>
            )}

            <Card>
                <Header>Main Content</Header>

                <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: '#374151', fontSize: 16, marginBottom: 8 }}>Caption</Text>
                    <TextInput
                        value={mainCaption}
                        onChangeText={setMainCaption}
                        placeholder="Write your main caption here..."
                        multiline
                        numberOfLines={4}
                        style={{ minHeight: 80 }}
                    />
                </View>

                <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: '#374151', fontSize: 16, marginBottom: 8 }}>Hashtags</Text>
                    <TextInput
                        value={mainHashtags}
                        onChangeText={setMainHashtags}
                        placeholder="Enter hashtags separated by commas..."
                    />
                    <Button
                        title="Smart Hashtag Suggestions"
                        onPress={() => setShowHashtagSuggestions(true)}
                        style={{ marginTop: 8 }}
                    />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 16 }}>
                    <Button
                        title="A/B Test"
                        onPress={handleABTestCreation}
                        style={{ flex: 1, marginRight: 8 }}
                    />
                    <Button
                        title="Recycle Content"
                        onPress={handleContentRecycling}
                        style={{ flex: 1, marginLeft: 8 }}
                    />
                </View>
            </Card>

            <Header>Platform Configuration</Header>

            {platformConfigs.map((config) => {
                const platform = PLATFORMS.find(p => p.name === config.name);
                const rules = getPlatformRules(config.name);
                const charCount = getCharacterCount(config.name);

                return (
                    <PlatformCard key={config.name} enabled={config.enabled}>
                        <PlatformHeader>
                            <PlatformInfo>
                                <PlatformIcon color={platform?.color || '#6B7280'}>
                                    <Ionicons name={platform?.icon as any} size={16} color="white" />
                                </PlatformIcon>
                                <PlatformName>{config.name}</PlatformName>
                            </PlatformInfo>
                            <Switch
                                value={config.enabled}
                                onValueChange={() => handlePlatformToggle(config.name)}
                                trackColor={{ false: '#E5E7EB', true: '#F59E0B' }}
                                thumbColor={config.enabled ? '#F97316' : '#F3F4F6'}
                            />
                        </PlatformHeader>

                        {config.enabled && (
                            <>
                                <View style={{ marginBottom: 12 }}>
                                    <Text style={{ color: '#374151', fontSize: 14, marginBottom: 4 }}>
                                        Caption for {config.name}
                                    </Text>
                                    <TextInput
                                        value={config.caption}
                                        onChangeText={(text) => handlePlatformCaptionChange(config.name, text)}
                                        placeholder={`Write caption for ${config.name}...`}
                                        multiline
                                        numberOfLines={3}
                                    />
                                    <CharacterCount isOverLimit={charCount.current > charCount.limit}>
                                        {charCount.current}/{charCount.limit} characters
                                    </CharacterCount>
                                </View>

                                <View style={{ marginBottom: 12 }}>
                                    <Text style={{ color: '#374151', fontSize: 14, marginBottom: 4 }}>
                                        Hashtags for {config.name}
                                    </Text>
                                    <TextInput
                                        value={config.hashtags.join(', ')}
                                        onChangeText={(text) => handlePlatformHashtagsChange(config.name, text)}
                                        placeholder={`Enter hashtags for ${config.name}...`}
                                    />
                                </View>

                                <TipsBox>
                                    <TipsText>💡 {rules.tips}</TipsText>
                                    <TipsText>📏 Optimal: {rules.optimalLength}</TipsText>
                                    <TipsText>⏰ Best time: {platform?.optimalTime}</TipsText>
                                </TipsBox>

                                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                    <Button
                                        title="Preview"
                                        onPress={() => {
                                            setPreviewPlatform(config.name);
                                            setShowPreview(true);
                                        }}
                                        style={{ flex: 1, marginRight: 8 }}
                                    />
                                    <Button
                                        title="Optimize"
                                        onPress={() => handlePlatformOptimization(config.name)}
                                        style={{ flex: 1, marginLeft: 8 }}
                                    />
                                </View>
                            </>
                        )}
                    </PlatformCard>
                );
            })}

            <Button
                title="Cross-Platform Preview"
                onPress={() => setShowCrossPlatformPreview(true)}
                style={{ marginTop: 16 }}
            />

            <ScheduleSection>
                <Header>Schedule</Header>

                <ScheduleRow>
                    <ScheduleLabel>Post Date & Time</ScheduleLabel>
                    <Button
                        title={scheduledDate.toLocaleString()}
                        onPress={() => setShowDatePicker(true)}
                    />
                </ScheduleRow>

                {faithMode && (
                    <AnointBanner>
                        <Ionicons name="ios-prayer" size={24} color="#F59E0B" />
                        <AnointText>Anoint This Post</AnointText>
                        <Switch
                            value={isAnointed}
                            onValueChange={setIsAnointed}
                            trackColor={{ false: '#E5E7EB', true: '#F59E0B' }}
                            thumbColor={isAnointed ? '#F97316' : '#F3F4F6'}
                        />
                    </AnointBanner>
                )}

                <Button
                    title="Schedule Post"
                    onPress={handleSchedule}
                    style={{ marginTop: 16 }}
                />
            </ScheduleSection>

            {/* Smart Hashtag Suggestions Modal */}
            <Modal visible={showHashtagSuggestions} animationType="slide" transparent>
                <ModalOverlay>
                    <ModalContent>
                        <ScrollView>
                            <Header>Smart Hashtag Suggestions</Header>
                            <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 16 }}>
                                AI-powered hashtags ranked by engagement potential
                            </Text>
                            {SMART_HASHTAGS.map(hashtag => (
                                <HashtagSuggestion
                                    key={hashtag.hashtag}
                                    score={hashtag.score}
                                    onPress={() => handleHashtagSuggestion(hashtag.hashtag)}
                                >
                                    <HashtagText score={hashtag.score}>{hashtag.hashtag}</HashtagText>
                                    <ScoreBadge score={hashtag.score}>
                                        <ScoreText>{hashtag.score}</ScoreText>
                                    </ScoreBadge>
                                    {hashtag.trending && (
                                        <Ionicons name="trending-up" size={12} color="#F59E0B" style={{ marginLeft: 4 }} />
                                    )}
                                </HashtagSuggestion>
                            ))}
                            <Button title="Close" onPress={() => setShowHashtagSuggestions(false)} />
                        </ScrollView>
                    </ModalContent>
                </ModalOverlay>
            </Modal>

            {/* A/B Testing Modal */}
            <Modal visible={showABTesting} animationType="slide" transparent>
                <ModalOverlay>
                    <ModalContent>
                        <ScrollView>
                            <Header>A/B Testing</Header>
                            <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 16 }}>
                                Test different versions to see which performs best
                            </Text>
                            {abTestVariants.map((variant, index) => (
                                <ABTestCard key={variant.id}>
                                    <ABTestHeader>Variant {index + 1}</ABTestHeader>
                                    <PreviewText>{variant.caption}</PreviewText>
                                    <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 8 }}>
                                        {variant.hashtags.join(' ')}
                                    </Text>
                                </ABTestCard>
                            ))}
                            <Button title="Schedule A/B Test" onPress={() => setShowABTesting(false)} />
                            <Button title="Close" onPress={() => setShowABTesting(false)} style={{ marginTop: 8 }} />
                        </ScrollView>
                    </ModalContent>
                </ModalOverlay>
            </Modal>

            {/* Cross-Platform Preview Modal */}
            <Modal visible={showCrossPlatformPreview} animationType="slide" transparent>
                <ModalOverlay>
                    <ModalContent>
                        <ScrollView>
                            <Header>Cross-Platform Preview</Header>
                            <CrossPlatformPreview>
                                {platformConfigs.filter(c => c.enabled).map(config => (
                                    <PlatformPreview key={config.name} platform={config.name}>
                                        <PlatformPreviewText>{config.caption}</PlatformPreviewText>
                                        <PlatformPreviewText style={{ marginTop: 8, opacity: 0.8 }}>
                                            {config.hashtags.join(' ')}
                                        </PlatformPreviewText>
                                    </PlatformPreview>
                                ))}
                            </CrossPlatformPreview>
                            <Button title="Close" onPress={() => setShowCrossPlatformPreview(false)} />
                        </ScrollView>
                    </ModalContent>
                </ModalOverlay>
            </Modal>

            {/* Single Platform Preview Modal */}
            <Modal visible={showPreview} animationType="slide" transparent>
                <ModalOverlay>
                    <ModalContent>
                        <ScrollView>
                            <Header>Preview - {previewPlatform}</Header>

                            <PreviewCard>
                                <PreviewHeader>How your post will look:</PreviewHeader>
                                <PreviewText>
                                    {platformConfigs.find(c => c.name === previewPlatform)?.caption}
                                </PreviewText>
                                <PreviewText style={{ color: '#6B7280', marginTop: 8 }}>
                                    {platformConfigs.find(c => c.name === previewPlatform)?.hashtags.join(' ')}
                                </PreviewText>
                            </PreviewCard>

                            <Button
                                title="Close Preview"
                                onPress={() => setShowPreview(false)}
                            />
                        </ScrollView>
                    </ModalContent>
                </ModalOverlay>
            </Modal>

            {showDatePicker && (
                <DateTimePicker
                    value={scheduledDate}
                    mode="datetime"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                            setScheduledDate(selectedDate);
                        }
                    }}
                />
            )}
        </Container>
    );
} 