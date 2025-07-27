import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Switch } from 'react-native';
import { Button } from '../../../packages/ui/Button';
import { Card } from '../../../packages/ui/Card';
import { Header } from '../../../packages/ui/Header';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';

// Types
interface ContentIdea {
    id: string;
    title: string;
    description: string;
    category: 'faith' | 'business' | 'personal' | 'promo';
    platform: string;
    viralPotential: number;
    hashtags: string[];
    caption: string;
    aiGenerated: boolean;
}

interface TrendData {
    topic: string;
    category: string;
    growth: number;
    volume: number;
    relatedHashtags: string[];
}

interface CaptionOptimization {
    original: string;
    optimized: string;
    improvements: string[];
    engagementScore: number;
}

interface HashtagStrategy {
    primary: string[];
    secondary: string[];
    trending: string[];
    niche: string[];
    score: number;
}

interface CalendarSuggestion {
    date: Date;
    contentType: string;
    platform: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
}

// Mock data
const mockContentIdeas: ContentIdea[] = [
    {
        id: '1',
        title: 'Faith in Business Story',
        description: 'Share how your faith guides your business decisions',
        category: 'faith',
        platform: 'Instagram',
        viralPotential: 85,
        hashtags: ['#faith', '#business', '#kingdombusiness', '#testimony'],
        caption: 'When I started my business, I had no idea how faith would guide every decision. Here\'s what happened when I trusted God with my business... 🙏 #faith #business #kingdombusiness',
        aiGenerated: true
    },
    {
        id: '2',
        title: 'Behind the Scenes Reel',
        description: 'Show your daily routine with faith integration',
        category: 'personal',
        platform: 'TikTok',
        viralPotential: 92,
        hashtags: ['#reel', '#bts', '#faith', '#dailyroutine', '#viral'],
        caption: 'My morning routine: Prayer, coffee, and gratitude. What\'s yours? ☕️🙏 #reel #bts #faith #dailyroutine',
        aiGenerated: true
    },
    {
        id: '3',
        title: 'Business Tip with Scripture',
        description: 'Combine practical business advice with biblical wisdom',
        category: 'business',
        platform: 'LinkedIn',
        viralPotential: 78,
        hashtags: ['#entrepreneur', '#business', '#scripture', '#wisdom'],
        caption: 'Proverbs 16:3 says "Commit your work to the Lord." Here\'s how this applies to modern business... 💼 #entrepreneur #business #scripture',
        aiGenerated: true
    }
];

const mockTrends: TrendData[] = [
    { topic: 'Faith-based entrepreneurship', category: 'business', growth: 45, volume: 125000, relatedHashtags: ['#faithpreneur', '#kingdombusiness', '#faith'] },
    { topic: 'Daily devotionals', category: 'faith', growth: 32, volume: 89000, relatedHashtags: ['#devotional', '#dailyinspiration', '#faith'] },
    { topic: 'Christian lifestyle', category: 'personal', growth: 28, volume: 67000, relatedHashtags: ['#christianlifestyle', '#faith', '#lifestyle'] },
    { topic: 'Prayer requests', category: 'faith', growth: 38, volume: 95000, relatedHashtags: ['#prayer', '#prayerrequest', '#faith'] }
];

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const AICard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-left: 4px solid ${({ theme }) => theme.colors.gold};
`;

const AITitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const AIDescription = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const IdeaCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-left: 3px solid ${({ theme }) => theme.colors.gold};
`;

const IdeaTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const IdeaDescription = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ViralScore = styled.View<{ score: number }>`
  background-color: ${({ score }) =>
        score >= 90 ? '#10B981' :
            score >= 80 ? '#3B82F6' :
                score >= 70 ? '#F59E0B' :
                    '#6B7280'
    };
  border-radius: 12px;
  padding: 4px 8px;
  align-self: flex-start;
`;

const ViralScoreText = styled.Text`
  color: white;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: bold;
`;

const TrendCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
`;

const TrendInfo = styled.View`
  flex: 1;
`;

const TrendTopic = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const TrendStats = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
`;

const OptimizationCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const OptimizationHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const OptimizationTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const EngagementScore = styled.View<{ score: number }>`
  background-color: ${({ score }) =>
        score >= 90 ? '#10B981' :
            score >= 80 ? '#3B82F6' :
                score >= 70 ? '#F59E0B' :
                    '#6B7280'
    };
  border-radius: 8px;
  padding: 4px 8px;
`;

const EngagementScoreText = styled.Text`
  color: white;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: bold;
`;

const HashtagGroup = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const HashtagGroupTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 14px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const HashtagRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const HashtagChip = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${({ selected, theme }) => selected ? theme.colors.gold : theme.colors.silverGray + '20'};
  border-radius: 16px;
  padding: 4px 12px;
  margin-right: 8px;
  margin-bottom: 4px;
`;

const HashtagChipText = styled.Text<{ selected: boolean }>`
  color: ${({ selected, theme }) => selected ? theme.colors.cloudWhite : theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
`;

const CalendarSuggestionCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-left: 3px solid ${({ theme }) => theme.colors.sapphireBlue};
`;

const SuggestionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SuggestionTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const PriorityBadge = styled.View<{ priority: string }>`
  background-color: ${({ priority }) =>
        priority === 'high' ? '#EF4444' :
            priority === 'medium' ? '#F59E0B' :
                '#6B7280'
    };
  border-radius: 8px;
  padding: 2px 6px;
`;

const PriorityText = styled.Text`
  color: white;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 10px;
  font-weight: bold;
`;

const LoadingContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const LoadingText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const FaithModeBanner = styled.View`
  background-color: ${({ theme }) => theme.colors.gold + '30'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
`;

const FaithModeText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: bold;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

export default function AIContentAssistantScreen() {
    const { faithMode } = useFaithMode();
    const [loading, setLoading] = useState(false);
    const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>(mockContentIdeas);
    const [trends, setTrends] = useState<TrendData[]>(mockTrends);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
    const [showOptimization, setShowOptimization] = useState(false);
    const [currentCaption, setCurrentCaption] = useState('');
    const [optimizedCaption, setOptimizedCaption] = useState('');
    const [hashtagStrategy, setHashtagStrategy] = useState<HashtagStrategy | null>(null);
    const [calendarSuggestions, setCalendarSuggestions] = useState<CalendarSuggestion[]>([]);
    const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

    const generateContentIdeas = async () => {
        setLoading(true);
        // Mock AI generation
        setTimeout(() => {
            const newIdeas: ContentIdea[] = [
                {
                    id: Date.now().toString(),
                    title: 'Prayer in the Workplace',
                    description: 'How to integrate prayer into your daily work routine',
                    category: 'faith',
                    platform: 'Instagram',
                    viralPotential: 88,
                    hashtags: ['#prayer', '#workplace', '#faith', '#dailyroutine'],
                    caption: 'Prayer isn\'t just for Sunday. Here\'s how I pray throughout my workday... 🙏 #prayer #workplace #faith',
                    aiGenerated: true
                },
                {
                    id: (Date.now() + 1).toString(),
                    title: 'God\'s Provision Story',
                    description: 'Share a testimony of God\'s faithfulness in your business',
                    category: 'faith',
                    platform: 'TikTok',
                    viralPotential: 95,
                    hashtags: ['#testimony', '#godsprovision', '#faith', '#viral'],
                    caption: 'When I thought I was going under, God showed up. Here\'s my story... 💪 #testimony #godsprovision #faith',
                    aiGenerated: true
                }
            ];
            setContentIdeas([...contentIdeas, ...newIdeas]);
            setLoading(false);
        }, 2000);
    };

    const optimizeCaption = async (caption: string) => {
        setLoading(true);
        // Mock AI optimization
        setTimeout(() => {
            const optimized = caption + '\n\n' +
                (faithMode ? '🙏 Trusting God with every step. ' : '') +
                'What resonates with you? Share your thoughts below! 👇\n\n' +
                '#engagement #community #connection';

            setOptimizedCaption(optimized);
            setShowOptimization(true);
            setLoading(false);
        }, 1500);
    };

    const generateHashtagStrategy = async () => {
        setLoading(true);
        // Mock AI hashtag strategy
        setTimeout(() => {
            const strategy: HashtagStrategy = {
                primary: ['#faith', '#kingdombusiness', '#entrepreneur'],
                secondary: ['#blessed', '#grateful', '#motivation'],
                trending: ['#viral', '#trending', '#fyp'],
                niche: ['#christianentrepreneur', '#faithpreneur', '#kingdomminded'],
                score: 87
            };
            setHashtagStrategy(strategy);
            setLoading(false);
        }, 1000);
    };

    const generateCalendarSuggestions = async () => {
        setLoading(true);
        // Mock AI calendar suggestions
        setTimeout(() => {
            const suggestions: CalendarSuggestion[] = [
                {
                    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                    contentType: 'Devotional Post',
                    platform: 'Instagram',
                    reason: 'High engagement time for faith content',
                    priority: 'high'
                },
                {
                    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
                    contentType: 'Business Tip',
                    platform: 'LinkedIn',
                    reason: 'Professional audience most active',
                    priority: 'medium'
                },
                {
                    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                    contentType: 'Behind the Scenes',
                    platform: 'TikTok',
                    reason: 'Trending content type this week',
                    priority: 'high'
                }
            ];
            setCalendarSuggestions(suggestions);
            setLoading(false);
        }, 1500);
    };

    const handleHashtagSelection = (hashtag: string) => {
        setSelectedHashtags(prev =>
            prev.includes(hashtag)
                ? prev.filter(h => h !== hashtag)
                : [...prev, hashtag]
        );
    };

    const handleUseIdea = (idea: ContentIdea) => {
        Alert.alert(
            'Use Content Idea',
            `Would you like to use "${idea.title}" for your next post?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Use Idea',
                    onPress: () => {
                        // Navigate to content creation with pre-filled data
                        Alert.alert('Idea Applied', 'Content idea has been applied to your post!');
                    }
                }
            ]
        );
    };

    const getFilteredIdeas = () => {
        return contentIdeas.filter(idea => {
            const categoryMatch = selectedCategory === 'all' || idea.category === selectedCategory;
            const platformMatch = selectedPlatform === 'all' || idea.platform === selectedPlatform;
            return categoryMatch && platformMatch;
        });
    };

    const getFaithModeMessage = () => {
        return "AI is analyzing your content through a Kingdom lens, focusing on spiritual impact and Kingdom values.";
    };

    return (
        <Container>
            <Header>AI Content Assistant</Header>

            {faithMode && (
                <FaithModeBanner>
                    <Ionicons name="ios-prayer" size={24} color="#F59E0B" />
                    <FaithModeText>{getFaithModeMessage()}</FaithModeText>
                </FaithModeBanner>
            )}

            <AICard>
                <AITitle>🤖 AI-Powered Content Generation</AITitle>
                <AIDescription>
                    Generate viral content ideas, optimize captions, and discover trending topics with AI assistance.
                </AIDescription>
                <Button title="Generate New Ideas" onPress={generateContentIdeas} />
            </AICard>

            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                <Button
                    title="All Categories"
                    variant={selectedCategory === 'all' ? 'gold' : 'primary'}
                    onPress={() => setSelectedCategory('all')}
                    style={{ marginRight: 8, flex: 1 }}
                />
                <Button
                    title="Faith"
                    variant={selectedCategory === 'faith' ? 'gold' : 'primary'}
                    onPress={() => setSelectedCategory('faith')}
                    style={{ marginRight: 8, flex: 1 }}
                />
                <Button
                    title="Business"
                    variant={selectedCategory === 'business' ? 'gold' : 'primary'}
                    onPress={() => setSelectedCategory('business')}
                    style={{ flex: 1 }}
                />
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                <Button
                    title="All Platforms"
                    variant={selectedPlatform === 'all' ? 'gold' : 'primary'}
                    onPress={() => setSelectedPlatform('all')}
                    style={{ marginRight: 8, flex: 1 }}
                />
                <Button
                    title="Instagram"
                    variant={selectedPlatform === 'Instagram' ? 'gold' : 'primary'}
                    onPress={() => setSelectedPlatform('Instagram')}
                    style={{ marginRight: 8, flex: 1 }}
                />
                <Button
                    title="TikTok"
                    variant={selectedPlatform === 'TikTok' ? 'gold' : 'primary'}
                    onPress={() => setSelectedPlatform('TikTok')}
                    style={{ flex: 1 }}
                />
            </View>

            <Header>Content Ideas</Header>
            {getFilteredIdeas().map(idea => (
                <IdeaCard key={idea.id}>
                    <IdeaTitle>{idea.title}</IdeaTitle>
                    <IdeaDescription>{idea.description}</IdeaDescription>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <ViralScore score={idea.viralPotential}>
                            <ViralScoreText>{idea.viralPotential}% Viral</ViralScoreText>
                        </ViralScore>
                        <Text style={{ color: '#6B7280', fontSize: 12 }}>{idea.platform}</Text>
                    </View>
                    <Text style={{ color: '#374151', fontSize: 14, marginBottom: 8 }}>
                        {idea.caption}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                        {idea.hashtags.map(hashtag => (
                            <Text key={hashtag} style={{ color: '#3B82F6', fontSize: 12, marginRight: 8 }}>
                                {hashtag}
                            </Text>
                        ))}
                    </View>
                    <Button title="Use This Idea" onPress={() => handleUseIdea(idea)} />
                </IdeaCard>
            ))}

            <Header>Trending Topics</Header>
            {trends.map(trend => (
                <TrendCard key={trend.topic}>
                    <TrendInfo>
                        <TrendTopic>{trend.topic}</TrendTopic>
                        <TrendStats>
                            {trend.growth}% growth • {trend.volume.toLocaleString()} posts
                        </TrendStats>
                    </TrendInfo>
                    <Ionicons name="trending-up" size={20} color="#10B981" />
                </TrendCard>
            ))}

            <Header>Caption Optimization</Header>
            <Card>
                <Text style={{ color: '#374151', fontSize: 16, marginBottom: 8 }}>Enter your caption:</Text>
                <TextInput
                    value={currentCaption}
                    onChangeText={setCurrentCaption}
                    placeholder="Write your caption here..."
                    multiline
                    numberOfLines={4}
                    style={{ minHeight: 80, marginBottom: 16 }}
                />
                <Button title="Optimize Caption" onPress={() => optimizeCaption(currentCaption)} />
            </Card>

            <Header>Hashtag Strategy</Header>
            <Card>
                <Button title="Generate Hashtag Strategy" onPress={generateHashtagStrategy} />
                {hashtagStrategy && (
                    <View style={{ marginTop: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ color: '#374151', fontSize: 16, fontWeight: 'bold' }}>Strategy Score</Text>
                            <EngagementScore score={hashtagStrategy.score}>
                                <EngagementScoreText>{hashtagStrategy.score}%</EngagementScoreText>
                            </EngagementScore>
                        </View>

                        <HashtagGroup>
                            <HashtagGroupTitle>Primary Hashtags</HashtagGroupTitle>
                            <HashtagRow>
                                {hashtagStrategy.primary.map(hashtag => (
                                    <HashtagChip
                                        key={hashtag}
                                        selected={selectedHashtags.includes(hashtag)}
                                        onPress={() => handleHashtagSelection(hashtag)}
                                    >
                                        <HashtagChipText selected={selectedHashtags.includes(hashtag)}>{hashtag}</HashtagChipText>
                                    </HashtagChip>
                                ))}
                            </HashtagRow>
                        </HashtagGroup>

                        <HashtagGroup>
                            <HashtagGroupTitle>Secondary Hashtags</HashtagGroupTitle>
                            <HashtagRow>
                                {hashtagStrategy.secondary.map(hashtag => (
                                    <HashtagChip
                                        key={hashtag}
                                        selected={selectedHashtags.includes(hashtag)}
                                        onPress={() => handleHashtagSelection(hashtag)}
                                    >
                                        <HashtagChipText selected={selectedHashtags.includes(hashtag)}>{hashtag}</HashtagChipText>
                                    </HashtagChip>
                                ))}
                            </HashtagRow>
                        </HashtagGroup>

                        <HashtagGroup>
                            <HashtagGroupTitle>Trending Hashtags</HashtagGroupTitle>
                            <HashtagRow>
                                {hashtagStrategy.trending.map(hashtag => (
                                    <HashtagChip
                                        key={hashtag}
                                        selected={selectedHashtags.includes(hashtag)}
                                        onPress={() => handleHashtagSelection(hashtag)}
                                    >
                                        <HashtagChipText selected={selectedHashtags.includes(hashtag)}>{hashtag}</HashtagChipText>
                                    </HashtagChip>
                                ))}
                            </HashtagRow>
                        </HashtagGroup>
                    </View>
                )}
            </Card>

            <Header>Calendar Suggestions</Header>
            <Card>
                <Button title="Generate Schedule Suggestions" onPress={generateCalendarSuggestions} />
                {calendarSuggestions.map((suggestion, index) => (
                    <CalendarSuggestionCard key={index}>
                        <SuggestionHeader>
                            <SuggestionTitle>{suggestion.contentType}</SuggestionTitle>
                            <PriorityBadge priority={suggestion.priority}>
                                <PriorityText>{suggestion.priority.toUpperCase()}</PriorityText>
                            </PriorityBadge>
                        </SuggestionHeader>
                        <Text style={{ color: '#374151', fontSize: 14, marginBottom: 4 }}>
                            {suggestion.platform} • {suggestion.date.toLocaleDateString()}
                        </Text>
                        <Text style={{ color: '#6B7280', fontSize: 12 }}>
                            {suggestion.reason}
                        </Text>
                    </CalendarSuggestionCard>
                ))}
            </Card>

            {loading && (
                <LoadingContainer>
                    <ActivityIndicator size="large" color="#F59E0B" />
                    <LoadingText>AI is working its magic...</LoadingText>
                </LoadingContainer>
            )}

            {/* Caption Optimization Modal */}
            <Modal visible={showOptimization} animationType="slide" transparent>
                <ModalOverlay>
                    <ModalContent>
                        <ScrollView>
                            <Header>Caption Optimization</Header>

                            <OptimizationCard>
                                <OptimizationHeader>
                                    <OptimizationTitle>Original</OptimizationTitle>
                                </OptimizationHeader>
                                <Text style={{ color: '#374151', fontSize: 14, marginBottom: 16 }}>
                                    {currentCaption}
                                </Text>
                            </OptimizationCard>

                            <OptimizationCard>
                                <OptimizationHeader>
                                    <OptimizationTitle>Optimized</OptimizationTitle>
                                    <EngagementScore score={85}>
                                        <EngagementScoreText>85% Engagement</EngagementScoreText>
                                    </EngagementScore>
                                </OptimizationHeader>
                                <Text style={{ color: '#374151', fontSize: 14, marginBottom: 16 }}>
                                    {optimizedCaption}
                                </Text>
                            </OptimizationCard>

                            <Button title="Use Optimized Caption" onPress={() => setShowOptimization(false)} />
                            <Button title="Close" onPress={() => setShowOptimization(false)} style={{ marginTop: 8 }} />
                        </ScrollView>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </Container>
    );
} 