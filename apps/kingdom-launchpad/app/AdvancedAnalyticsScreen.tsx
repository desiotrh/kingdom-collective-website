import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Switch } from 'react-native';
import { Button } from '../../../packages/ui/Button';
import { Card } from '../../../packages/ui/Card';
import { Header } from '../../../packages/ui/Header';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Types
interface AdvancedMetric {
    id: string;
    name: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    category: string;
    description: string;
}

interface CompetitorAnalysis {
    competitor: string;
    followers: number;
    engagement: number;
    contentFrequency: number;
    topPerformingContent: string;
    growthRate: number;
    niche: string;
}

interface PredictiveInsight {
    id: string;
    type: 'growth' | 'content' | 'audience' | 'revenue';
    prediction: string;
    confidence: number;
    timeframe: string;
    actionItems: string[];
    impact: 'high' | 'medium' | 'low';
}

interface AudienceSegment {
    segment: string;
    size: number;
    engagement: number;
    growth: number;
    interests: string[];
    demographics: {
        age: string;
        location: string;
        gender: string;
    };
}

interface ContentPerformance {
    id: string;
    title: string;
    platform: string;
    engagement: number;
    reach: number;
    conversions: number;
    roi: number;
    category: string;
    publishDate: Date;
}

// Mock Data
const mockAdvancedMetrics: AdvancedMetric[] = [
    {
        id: '1',
        name: 'Audience Quality Score',
        value: 87,
        change: 12,
        trend: 'up',
        category: 'audience',
        description: 'Measures the quality and engagement of your audience'
    },
    {
        id: '2',
        name: 'Content Virality Index',
        value: 73,
        change: -5,
        trend: 'down',
        category: 'content',
        description: 'Predicts the viral potential of your content'
    },
    {
        id: '3',
        name: 'Revenue per Follower',
        value: 2.45,
        change: 18,
        trend: 'up',
        category: 'revenue',
        description: 'Average revenue generated per follower'
    },
    {
        id: '4',
        name: 'Brand Authority Score',
        value: 91,
        change: 8,
        trend: 'up',
        category: 'brand',
        description: 'Your authority and influence in your niche'
    }
];

const mockCompetitors: CompetitorAnalysis[] = [
    {
        competitor: 'Faithful Creator',
        followers: 125000,
        engagement: 4.2,
        contentFrequency: 3.5,
        topPerformingContent: 'Daily devotionals',
        growthRate: 12,
        niche: 'Christian lifestyle'
    },
    {
        competitor: 'Kingdom Business',
        followers: 89000,
        engagement: 5.1,
        contentFrequency: 2.8,
        topPerformingContent: 'Business tips with faith',
        growthRate: 18,
        niche: 'Faith-based business'
    },
    {
        competitor: 'Inspire Daily',
        followers: 210000,
        engagement: 3.8,
        contentFrequency: 4.2,
        topPerformingContent: 'Motivational quotes',
        growthRate: 9,
        niche: 'Inspiration'
    }
];

const mockPredictions: PredictiveInsight[] = [
    {
        id: '1',
        type: 'growth',
        prediction: 'Expected 25% follower growth in next 30 days',
        confidence: 87,
        timeframe: '30 days',
        actionItems: ['Post 3x daily', 'Engage with comments', 'Collaborate with similar creators'],
        impact: 'high'
    },
    {
        id: '2',
        type: 'content',
        prediction: 'Video content will perform 40% better than static posts',
        confidence: 92,
        timeframe: 'Next 2 weeks',
        actionItems: ['Create more video content', 'Focus on Reels and TikTok', 'Add captions to videos'],
        impact: 'high'
    },
    {
        id: '3',
        type: 'audience',
        prediction: 'Your audience will shift toward 25-34 age group',
        confidence: 78,
        timeframe: 'Next month',
        actionItems: ['Adjust content tone', 'Use more professional language', 'Focus on career content'],
        impact: 'medium'
    }
];

const mockAudienceSegments: AudienceSegment[] = [
    {
        segment: 'Faith Entrepreneurs',
        size: 4500,
        engagement: 6.2,
        growth: 15,
        interests: ['business', 'faith', 'entrepreneurship', 'leadership'],
        demographics: { age: '25-34', location: 'United States', gender: '60% Female' }
    },
    {
        segment: 'Christian Creators',
        size: 3200,
        engagement: 8.1,
        growth: 22,
        interests: ['content creation', 'faith', 'social media', 'ministry'],
        demographics: { age: '18-25', location: 'Global', gender: '70% Female' }
    },
    {
        segment: 'Business Professionals',
        size: 2800,
        engagement: 4.8,
        growth: 12,
        interests: ['career', 'leadership', 'productivity', 'networking'],
        demographics: { age: '30-45', location: 'United States', gender: '55% Male' }
    }
];

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const MetricCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-left: 4px solid ${({ theme }) => theme.colors.gold};
`;

const MetricHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const MetricName = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const MetricValue = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 24px;
  font-weight: bold;
`;

const MetricChange = styled.View<{ trend: 'up' | 'down' | 'stable' }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ trend }) =>
        trend === 'up' ? '#10B98120' :
            trend === 'down' ? '#EF444420' :
                '#6B728020'
    };
  padding: 4px 8px;
  border-radius: 12px;
`;

const MetricChangeText = styled.Text<{ trend: 'up' | 'down' | 'stable' }>`
  color: ${({ trend }) =>
        trend === 'up' ? '#10B981' :
            trend === 'down' ? '#EF4444' :
                '#6B7280'
    };
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: bold;
`;

const CompetitorCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
`;

const CompetitorInfo = styled.View`
  flex: 1;
`;

const CompetitorName = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const CompetitorStats = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
`;

const PredictionCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-left: 4px solid ${({ theme }) => theme.colors.gold};
`;

const PredictionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const PredictionTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const ConfidenceBadge = styled.View<{ confidence: number }>`
  background-color: ${({ confidence }) =>
        confidence >= 90 ? '#10B981' :
            confidence >= 80 ? '#3B82F6' :
                confidence >= 70 ? '#F59E0B' :
                    '#6B7280'
    };
  padding: 4px 8px;
  border-radius: 12px;
`;

const ConfidenceText = styled.Text`
  color: white;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: bold;
`;

const SegmentCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SegmentHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SegmentName = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const SegmentSize = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
`;

const FilterContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  flex-wrap: wrap;
`;

const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${({ active, theme }) =>
        active ? theme.colors.gold : theme.colors.silverGray + '20'
    };
  padding: 8px 16px;
  border-radius: 20px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const FilterText = styled.Text<{ active: boolean }>`
  color: ${({ active, theme }) =>
        active ? theme.colors.sapphireBlue : theme.colors.silverGray
    };
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
`;

export default function AdvancedAnalyticsScreen() {
    const { faithMode } = useFaithMode();
    const [loading, setLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showCompetitorDetails, setShowCompetitorDetails] = useState(false);
    const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorAnalysis | null>(null);

    const filters = [
        { id: 'all', label: 'All Metrics' },
        { id: 'audience', label: 'Audience' },
        { id: 'content', label: 'Content' },
        { id: 'revenue', label: 'Revenue' },
        { id: 'brand', label: 'Brand' }
    ];

    const getFilteredMetrics = () => {
        if (selectedFilter === 'all') return mockAdvancedMetrics;
        return mockAdvancedMetrics.filter(metric => metric.category === selectedFilter);
    };

    const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up': return 'trending-up';
            case 'down': return 'trending-down';
            case 'stable': return 'remove';
        }
    };

    const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
        switch (impact) {
            case 'high': return '#10B981';
            case 'medium': return '#F59E0B';
            case 'low': return '#6B7280';
        }
    };

    const handleCompetitorPress = (competitor: CompetitorAnalysis) => {
        setSelectedCompetitor(competitor);
        setShowCompetitorDetails(true);
    };

    const getFaithModeMessage = () => {
        const messages = [
            "Your analytics reflect Kingdom impact, not just numbers.",
            "Every metric tells a story of lives touched and hearts changed.",
            "Your growth is measured in souls reached, not just followers gained.",
            "The data shows your faithfulness is bearing fruit."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    return (
        <Container>
            <Header>Advanced Analytics</Header>

            {faithMode && (
                <Card style={{ marginBottom: 16, backgroundColor: '#FEF3C7' }}>
                    <Text style={{
                        color: '#92400E',
                        fontFamily: 'System',
                        fontSize: 16,
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}>
                        {getFaithModeMessage()}
                    </Text>
                </Card>
            )}

            <FilterContainer>
                {filters.map(filter => (
                    <FilterButton
                        key={filter.id}
                        active={selectedFilter === filter.id}
                        onPress={() => setSelectedFilter(filter.id)}
                    >
                        <FilterText active={selectedFilter === filter.id}>
                            {filter.label}
                        </FilterText>
                    </FilterButton>
                ))}
            </FilterContainer>

            {/* Advanced Metrics */}
            <Text style={{
                color: '#1E293B',
                fontFamily: 'System',
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 16
            }}>
                Advanced Metrics
            </Text>

            {getFilteredMetrics().map(metric => (
                <MetricCard key={metric.id}>
                    <MetricHeader>
                        <MetricName>{metric.name}</MetricName>
                        <MetricChange trend={metric.trend}>
                            <Ionicons
                                name={getTrendIcon(metric.trend) as any}
                                size={12}
                                color={metric.trend === 'up' ? '#10B981' : metric.trend === 'down' ? '#EF4444' : '#6B7280'}
                            />
                            <MetricChangeText trend={metric.trend}>
                                {metric.change > 0 ? '+' : ''}{metric.change}%
                            </MetricChangeText>
                        </MetricChange>
                    </MetricHeader>
                    <MetricValue>{metric.value}</MetricValue>
                    <Text style={{
                        color: '#64748B',
                        fontFamily: 'System',
                        fontSize: 14,
                        marginTop: 8
                    }}>
                        {metric.description}
                    </Text>
                </MetricCard>
            ))}

            {/* Competitor Analysis */}
            <Text style={{
                color: '#1E293B',
                fontFamily: 'System',
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 24,
                marginBottom: 16
            }}>
                Competitor Analysis
            </Text>

            {mockCompetitors.map((competitor, index) => (
                <CompetitorCard key={index}>
                    <CompetitorInfo>
                        <CompetitorName>{competitor.competitor}</CompetitorName>
                        <CompetitorStats>
                            {competitor.followers.toLocaleString()} followers • {competitor.engagement}% engagement
                        </CompetitorStats>
                        <CompetitorStats>
                            Growth: {competitor.growth}% • {competitor.niche}
                        </CompetitorStats>
                    </CompetitorInfo>
                    <TouchableOpacity onPress={() => handleCompetitorPress(competitor)}>
                        <Ionicons name="chevron-forward" size={20} color="#64748B" />
                    </TouchableOpacity>
                </CompetitorCard>
            ))}

            {/* Predictive Insights */}
            <Text style={{
                color: '#1E293B',
                fontFamily: 'System',
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 24,
                marginBottom: 16
            }}>
                AI Predictions
            </Text>

            {mockPredictions.map(prediction => (
                <PredictionCard key={prediction.id}>
                    <PredictionHeader>
                        <PredictionTitle>
                            {prediction.type.charAt(0).toUpperCase() + prediction.type.slice(1)} Prediction
                        </PredictionTitle>
                        <ConfidenceBadge confidence={prediction.confidence}>
                            <ConfidenceText>{prediction.confidence}%</ConfidenceText>
                        </ConfidenceBadge>
                    </PredictionHeader>
                    <Text style={{
                        color: '#1E293B',
                        fontFamily: 'System',
                        fontSize: 16,
                        marginBottom: 8
                    }}>
                        {prediction.prediction}
                    </Text>
                    <Text style={{
                        color: '#64748B',
                        fontFamily: 'System',
                        fontSize: 12,
                        marginBottom: 12
                    }}>
                        Timeframe: {prediction.timeframe}
                    </Text>
                    <Text style={{
                        color: '#1E293B',
                        fontFamily: 'System',
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginBottom: 8
                    }}>
                        Action Items:
                    </Text>
                    {prediction.actionItems.map((item, index) => (
                        <Text key={index} style={{
                            color: '#64748B',
                            fontFamily: 'System',
                            fontSize: 12,
                            marginBottom: 4
                        }}>
                            • {item}
                        </Text>
                    ))}
                </PredictionCard>
            ))}

            {/* Audience Segments */}
            <Text style={{
                color: '#1E293B',
                fontFamily: 'System',
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 24,
                marginBottom: 16
            }}>
                Audience Segments
            </Text>

            {mockAudienceSegments.map((segment, index) => (
                <SegmentCard key={index}>
                    <SegmentHeader>
                        <SegmentName>{segment.segment}</SegmentName>
                        <SegmentSize>{segment.size.toLocaleString()} followers</SegmentSize>
                    </SegmentHeader>
                    <Text style={{
                        color: '#64748B',
                        fontFamily: 'System',
                        fontSize: 14,
                        marginBottom: 8
                    }}>
                        Engagement: {segment.engagement}% • Growth: {segment.growth}%
                    </Text>
                    <Text style={{
                        color: '#64748B',
                        fontFamily: 'System',
                        fontSize: 12,
                        marginBottom: 4
                    }}>
                        Demographics: {segment.demographics.age} • {segment.demographics.location}
                    </Text>
                    <Text style={{
                        color: '#64748B',
                        fontFamily: 'System',
                        fontSize: 12
                    }}>
                        Interests: {segment.interests.join(', ')}
                    </Text>
                </SegmentCard>
            ))}

            {/* Competitor Details Modal */}
            <Modal
                visible={showCompetitorDetails}
                animationType="slide"
                transparent={true}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}>
                    <Card style={{ width: '100%', maxHeight: '80%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{
                                color: '#1E293B',
                                fontFamily: 'System',
                                fontSize: 20,
                                fontWeight: 'bold'
                            }}>
                                {selectedCompetitor?.competitor}
                            </Text>
                            <TouchableOpacity onPress={() => setShowCompetitorDetails(false)}>
                                <Ionicons name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        {selectedCompetitor && (
                            <ScrollView>
                                <Text style={{
                                    color: '#1E293B',
                                    fontFamily: 'System',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    marginBottom: 8
                                }}>
                                    Key Metrics
                                </Text>
                                <Text style={{ color: '#64748B', fontFamily: 'System', fontSize: 14, marginBottom: 16 }}>
                                    Followers: {selectedCompetitor.followers.toLocaleString()}{'\n'}
                                    Engagement Rate: {selectedCompetitor.engagement}%{'\n'}
                                    Content Frequency: {selectedCompetitor.contentFrequency} posts/week{'\n'}
                                    Growth Rate: {selectedCompetitor.growth}%{'\n'}
                                    Niche: {selectedCompetitor.niche}
                                </Text>

                                <Text style={{
                                    color: '#1E293B',
                                    fontFamily: 'System',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    marginBottom: 8
                                }}>
                                    Top Performing Content
                                </Text>
                                <Text style={{ color: '#64748B', fontFamily: 'System', fontSize: 14, marginBottom: 16 }}>
                                    {selectedCompetitor.topPerformingContent}
                                </Text>

                                <Button
                                    title="Analyze Content Strategy"
                                    onPress={() => {
                                        Alert.alert('Analysis', 'Detailed content strategy analysis coming soon!');
                                        setShowCompetitorDetails(false);
                                    }}
                                />
                            </ScrollView>
                        )}
                    </Card>
                </View>
            </Modal>
        </Container>
    );
} 