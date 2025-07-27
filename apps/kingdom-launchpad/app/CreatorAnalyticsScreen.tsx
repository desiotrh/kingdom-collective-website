import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { Button } from '../../../packages/ui/Button';
import { Card } from '../../../packages/ui/Card';
import { Header } from '../../../packages/ui/Header';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

// Types
interface AnalyticsData {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    saves: number;
    platform: string;
    date: string;
}

interface TopPost {
    id: string;
    title: string;
    platform: string;
    views: number;
    likes: number;
    shares: number;
    date: string;
    roi?: number;
}

interface KingdomMetrics {
    savedTestimonies: number;
    messageCount: number;
    prayerRequests: number;
    livesTouched: number;
    soulsReached: number;
    prayersAnswered: number;
}

interface CompetitorData {
    name: string;
    followers: number;
    engagement: number;
    posts: number;
    niche: string;
}

interface AudienceDemographics {
    ageGroups: { [key: string]: number };
    locations: { [key: string]: number };
    interests: { [key: string]: number };
    platforms: { [key: string]: number };
}

interface Milestone {
    id: string;
    type: 'followers' | 'engagement' | 'revenue' | 'kingdom';
    title: string;
    description: string;
    achieved: boolean;
    date?: Date;
}

// Mock data
const generateMockData = (days: number): AnalyticsData[] => {
    const data: AnalyticsData[] = [];
    const platforms = ['TikTok', 'Instagram', 'Facebook', 'YouTube Shorts', 'Pinterest'];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        platforms.forEach(platform => {
            data.push({
                views: Math.floor(Math.random() * 10000) + 1000,
                likes: Math.floor(Math.random() * 500) + 50,
                shares: Math.floor(Math.random() * 100) + 10,
                comments: Math.floor(Math.random() * 50) + 5,
                saves: Math.floor(Math.random() * 200) + 20,
                platform,
                date: date.toISOString().split('T')[0]
            });
        });
    }

    return data;
};

const mockTopPosts: TopPost[] = [
    { id: '1', title: 'Faith in Business', platform: 'Instagram', views: 15420, likes: 892, shares: 156, date: '2024-01-15', roi: 2.4 },
    { id: '2', title: 'Kingdom Mindset', platform: 'TikTok', views: 12850, likes: 745, shares: 234, date: '2024-01-12', roi: 3.1 },
    { id: '3', title: 'God\'s Provision', platform: 'Facebook', views: 9870, likes: 623, shares: 89, date: '2024-01-10', roi: 1.8 }
];

const mockKingdomMetrics: KingdomMetrics = {
    savedTestimonies: 47,
    messageCount: 156,
    prayerRequests: 23,
    livesTouched: 892,
    soulsReached: 234,
    prayersAnswered: 18
};

const mockCompetitors: CompetitorData[] = [
    { name: 'FaithCreator1', followers: 125000, engagement: 4.2, posts: 156, niche: 'faith' },
    { name: 'KingdomBusiness', followers: 89000, engagement: 3.8, posts: 98, niche: 'business' },
    { name: 'InspireDaily', followers: 210000, engagement: 5.1, posts: 203, niche: 'inspiration' }
];

const mockAudienceDemographics: AudienceDemographics = {
    ageGroups: { '18-24': 25, '25-34': 35, '35-44': 22, '45+': 18 },
    locations: { 'USA': 45, 'Canada': 15, 'UK': 12, 'Australia': 8, 'Other': 20 },
    interests: { 'Faith': 40, 'Business': 25, 'Inspiration': 20, 'Lifestyle': 15 },
    platforms: { 'Instagram': 35, 'TikTok': 30, 'Facebook': 20, 'YouTube': 15 }
};

const mockMilestones: Milestone[] = [
    { id: '1', type: 'followers', title: '10K Followers', description: 'Reached 10,000 followers', achieved: true, date: new Date('2024-01-10') },
    { id: '2', type: 'engagement', title: '5% Engagement Rate', description: 'Achieved 5% average engagement', achieved: true, date: new Date('2024-01-15') },
    { id: '3', type: 'revenue', title: '$1K Monthly Revenue', description: 'Generated $1,000 in monthly revenue', achieved: false },
    { id: '4', type: 'kingdom', title: '100 Lives Touched', description: 'Directly impacted 100 lives', achieved: true, date: new Date('2024-01-20') }
];

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const MetricCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const MetricValue = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const MetricLabel = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
`;

const MetricRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const MetricItem = styled.View`
  flex: 1;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.silverGray + '20'};
  border-radius: 8px;
  margin: 0 ${({ theme }) => theme.spacing.sm}px;
`;

const FilterBar = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${({ active, theme }) => active ? theme.colors.sapphireBlue : theme.colors.silverGray};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: 6px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const FilterText = styled.Text<{ active: boolean }>`
  color: ${({ active, theme }) => active ? theme.colors.cloudWhite : theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
`;

const KingdomBanner = styled.View`
  background-color: ${({ theme }) => theme.colors.gold + '30'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const KingdomTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const KingdomText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  text-align: center;
  font-style: italic;
`;

const EncouragementBanner = styled.View`
  background-color: ${({ theme }) => theme.colors.sapphireBlue + '20'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const EncouragementText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  text-align: center;
  font-weight: bold;
`;

const TopPostCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const PostHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const PostTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: bold;
`;

const PostPlatform = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
`;

const PostStats = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StatItem = styled.View`
  align-items: center;
`;

const StatValue = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: bold;
`;

const StatLabel = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 10px;
`;

const ExportButton = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.sapphireBlue};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: 8px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const ExportText = styled.Text`
  color: ${({ theme }) => theme.colors.cloudWhite};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: bold;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const MilestoneCard = styled(Card) <{ achieved: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-left: 4px solid ${({ achieved, theme }) => achieved ? theme.colors.gold : theme.colors.silverGray};
`;

const MilestoneTitle = styled.Text<{ achieved: boolean }>`
  color: ${({ achieved, theme }) => achieved ? theme.colors.sapphireBlue : theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const MilestoneDescription = styled.Text<{ achieved: boolean }>`
  color: ${({ achieved, theme }) => achieved ? theme.colors.sapphireBlue : theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
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

const DemographicsCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const DemographicsTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const DemographicsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const DemographicsLabel = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
`;

const DemographicsValue = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: bold;
`;

const NotificationBanner = styled.View`
  background-color: ${({ theme }) => theme.colors.gold + '30'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
`;

const NotificationText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: bold;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

export default function CreatorAnalyticsScreen() {
    const { faithMode } = useFaithMode();
    const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90'>('30');
    const [platformFilter, setPlatformFilter] = useState<string>('all');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
    const [topPosts, setTopPosts] = useState<TopPost[]>(mockTopPosts);
    const [kingdomMetrics, setKingdomMetrics] = useState<KingdomMetrics>(mockKingdomMetrics);
    const [competitors, setCompetitors] = useState<CompetitorData[]>(mockCompetitors);
    const [audienceDemographics, setAudienceDemographics] = useState<AudienceDemographics>(mockAudienceDemographics);
    const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
    const [showNotifications, setShowNotifications] = useState(true);
    const [showCompetitors, setShowCompetitors] = useState(false);
    const [showDemographics, setShowDemographics] = useState(false);

    useEffect(() => {
        // Generate mock data based on time filter
        const days = parseInt(timeFilter);
        setAnalyticsData(generateMockData(days));
    }, [timeFilter]);

    useEffect(() => {
        // Check for new milestones
        const newMilestones = milestones.filter(m => !m.achieved);
        if (newMilestones.length > 0) {
            setShowNotifications(true);
        }
    }, [milestones]);

    const getTotalMetrics = () => {
        const filteredData = platformFilter === 'all'
            ? analyticsData
            : analyticsData.filter(d => d.platform === platformFilter);

        return filteredData.reduce((acc, data) => ({
            views: acc.views + data.views,
            likes: acc.likes + data.likes,
            shares: acc.shares + data.shares,
            comments: acc.comments + data.comments,
            saves: acc.saves + data.saves
        }), { views: 0, likes: 0, shares: 0, comments: 0, saves: 0 });
    };

    const getGrowthData = () => {
        const filteredData = platformFilter === 'all'
            ? analyticsData
            : analyticsData.filter(d => d.platform === platformFilter);

        // Group by date and sum metrics
        const dailyTotals = filteredData.reduce((acc, data) => {
            const date = data.date;
            if (!acc[date]) {
                acc[date] = { views: 0, likes: 0, shares: 0, comments: 0, saves: 0 };
            }
            acc[date].views += data.views;
            acc[date].likes += data.likes;
            acc[date].shares += data.shares;
            acc[date].comments += data.comments;
            acc[date].saves += data.saves;
            return acc;
        }, {} as Record<string, any>);

        const sortedDates = Object.keys(dailyTotals).sort();
        return {
            labels: sortedDates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [
                {
                    data: sortedDates.map(date => dailyTotals[date].views),
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    strokeWidth: 2
                }
            ]
        };
    };

    const getTopPostsData = () => {
        return {
            labels: topPosts.map(post => post.platform),
            datasets: [
                {
                    data: topPosts.map(post => post.views)
                }
            ]
        };
    };

    const getROIData = () => {
        return {
            labels: topPosts.map(post => post.title.substring(0, 10) + '...'),
            datasets: [
                {
                    data: topPosts.map(post => post.roi || 0)
                }
            ]
        };
    };

    const getDemographicsData = () => {
        return {
            labels: Object.keys(audienceDemographics.ageGroups),
            datasets: [
                {
                    data: Object.values(audienceDemographics.ageGroups)
                }
            ]
        };
    };

    const handleExport = () => {
        Alert.alert(
            'Export Analytics',
            'Your analytics data has been exported to CSV format.',
            [{ text: 'OK' }]
        );
    };

    const handleMilestoneAchievement = (milestoneId: string) => {
        setMilestones(prev => prev.map(m =>
            m.id === milestoneId ? { ...m, achieved: true, date: new Date() } : m
        ));
        Alert.alert('Milestone Achieved!', 'Congratulations on reaching this milestone!');
    };

    const getEncouragementMessage = () => {
        const totalViews = getTotalMetrics().views;
        if (totalViews > 100000) {
            return "You've reached over 100K views! Your message is touching countless lives.";
        } else if (totalViews > 50000) {
            return "50K+ views! You're building a powerful Kingdom influence.";
        } else if (totalViews > 10000) {
            return "10K+ views! Every view represents a life you're impacting.";
        } else {
            return "Every view matters. You're planting seeds that will grow into mighty trees.";
        }
    };

    const getKingdomMessage = () => {
        return "Do not despise small beginnings. Your faithfulness in small things prepares you for greater things.";
    };

    const getPerformancePrediction = () => {
        const totalViews = getTotalMetrics().views;
        const growthRate = 1.15; // 15% monthly growth
        const predictedViews = Math.round(totalViews * growthRate);
        return `Based on current trends, you're projected to reach ${predictedViews.toLocaleString()} views next month!`;
    };

    const totalMetrics = getTotalMetrics();
    const growthData = getGrowthData();
    const topPostsData = getTopPostsData();
    const roiData = getROIData();
    const demographicsData = getDemographicsData();

    return (
        <Container>
            <Header>Creator Analytics Dashboard</Header>

            {faithMode && (
                <KingdomBanner>
                    <KingdomTitle>Kingdom ROI</KingdomTitle>
                    <KingdomText>{getKingdomMessage()}</KingdomText>
                </KingdomBanner>
            )}

            <EncouragementBanner>
                <EncouragementText>{getEncouragementMessage()}</EncouragementText>
            </EncouragementBanner>

            {showNotifications && (
                <NotificationBanner>
                    <Ionicons name="notifications" size={24} color="#F59E0B" />
                    <NotificationText>New milestone achieved!</NotificationText>
                    <TouchableOpacity onPress={() => setShowNotifications(false)}>
                        <Ionicons name="close" size={20} color="#6B7280" />
                    </TouchableOpacity>
                </NotificationBanner>
            )}

            <FilterBar>
                <FilterButton
                    active={timeFilter === '7'}
                    onPress={() => setTimeFilter('7')}
                >
                    <FilterText active={timeFilter === '7'}>7 Days</FilterText>
                </FilterButton>
                <FilterButton
                    active={timeFilter === '30'}
                    onPress={() => setTimeFilter('30')}
                >
                    <FilterText active={timeFilter === '30'}>30 Days</FilterText>
                </FilterButton>
                <FilterButton
                    active={timeFilter === '90'}
                    onPress={() => setTimeFilter('90')}
                >
                    <FilterText active={timeFilter === '90'}>90 Days</FilterText>
                </FilterButton>
            </FilterBar>

            <FilterBar>
                <FilterButton
                    active={platformFilter === 'all'}
                    onPress={() => setPlatformFilter('all')}
                >
                    <FilterText active={platformFilter === 'all'}>All Platforms</FilterText>
                </FilterButton>
                {['TikTok', 'Instagram', 'Facebook', 'YouTube Shorts', 'Pinterest'].map(platform => (
                    <FilterButton
                        key={platform}
                        active={platformFilter === platform}
                        onPress={() => setPlatformFilter(platform)}
                    >
                        <FilterText active={platformFilter === platform}>{platform}</FilterText>
                    </FilterButton>
                ))}
            </FilterBar>

            <MetricCard>
                <Header>Overview</Header>
                <MetricRow>
                    <MetricItem>
                        <MetricValue>{totalMetrics.views.toLocaleString()}</MetricValue>
                        <MetricLabel>Views</MetricLabel>
                    </MetricItem>
                    <MetricItem>
                        <MetricValue>{totalMetrics.likes.toLocaleString()}</MetricValue>
                        <MetricLabel>Likes</MetricLabel>
                    </MetricItem>
                    <MetricItem>
                        <MetricValue>{totalMetrics.shares.toLocaleString()}</MetricValue>
                        <MetricLabel>Shares</MetricLabel>
                    </MetricItem>
                </MetricRow>
                <MetricRow>
                    <MetricItem>
                        <MetricValue>{totalMetrics.comments.toLocaleString()}</MetricValue>
                        <MetricLabel>Comments</MetricLabel>
                    </MetricItem>
                    <MetricItem>
                        <MetricValue>{totalMetrics.saves.toLocaleString()}</MetricValue>
                        <MetricLabel>Saves</MetricLabel>
                    </MetricItem>
                    <MetricItem>
                        <MetricValue>{Math.round((totalMetrics.likes / totalMetrics.views) * 100 * 100) / 100}%</MetricValue>
                        <MetricLabel>Engagement</MetricLabel>
                    </MetricItem>
                </MetricRow>
            </MetricCard>

            {faithMode && (
                <MetricCard>
                    <Header>Kingdom Impact</Header>
                    <MetricRow>
                        <MetricItem>
                            <MetricValue>{kingdomMetrics.savedTestimonies}</MetricValue>
                            <MetricLabel>Saved Testimonies</MetricLabel>
                        </MetricItem>
                        <MetricItem>
                            <MetricValue>{kingdomMetrics.messageCount}</MetricValue>
                            <MetricLabel>Messages Shared</MetricLabel>
                        </MetricItem>
                        <MetricItem>
                            <MetricValue>{kingdomMetrics.prayerRequests}</MetricValue>
                            <MetricLabel>Prayer Requests</MetricLabel>
                        </MetricItem>
                    </MetricRow>
                    <MetricRow>
                        <MetricItem>
                            <MetricValue>{kingdomMetrics.livesTouched}</MetricValue>
                            <MetricLabel>Lives Touched</MetricLabel>
                        </MetricItem>
                        <MetricItem>
                            <MetricValue>{kingdomMetrics.soulsReached}</MetricValue>
                            <MetricLabel>Souls Reached</MetricLabel>
                        </MetricItem>
                        <MetricItem>
                            <MetricValue>{kingdomMetrics.prayersAnswered}</MetricValue>
                            <MetricLabel>Prayers Answered</MetricLabel>
                        </MetricItem>
                    </MetricRow>
                </MetricCard>
            )}

            <MetricCard>
                <Header>Growth Over Time</Header>
                <LineChart
                    data={growthData}
                    width={Dimensions.get('window').width - 48}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#3B82F6'
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </MetricCard>

            <MetricCard>
                <Header>Content ROI Performance</Header>
                <BarChart
                    data={roiData}
                    width={Dimensions.get('window').width - 48}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </MetricCard>

            <MetricCard>
                <Header>Top 3 Posts</Header>
                {topPosts.map((post, index) => (
                    <TopPostCard key={post.id}>
                        <PostHeader>
                            <PostTitle>{post.title}</PostTitle>
                            <PostPlatform>{post.platform}</PostPlatform>
                        </PostHeader>
                        <PostStats>
                            <StatItem>
                                <StatValue>{post.views.toLocaleString()}</StatValue>
                                <StatLabel>Views</StatLabel>
                            </StatItem>
                            <StatItem>
                                <StatValue>{post.likes.toLocaleString()}</StatValue>
                                <StatLabel>Likes</StatLabel>
                            </StatItem>
                            <StatItem>
                                <StatValue>{post.shares.toLocaleString()}</StatValue>
                                <StatLabel>Shares</StatLabel>
                            </StatItem>
                            <StatItem>
                                <StatValue>{post.roi?.toFixed(1)}x</StatValue>
                                <StatLabel>ROI</StatLabel>
                            </StatItem>
                        </PostStats>
                    </TopPostCard>
                ))}
            </MetricCard>

            <Button
                title="View Competitors"
                onPress={() => setShowCompetitors(true)}
                style={{ marginBottom: 16 }}
            />

            <Button
                title="Audience Demographics"
                onPress={() => setShowDemographics(true)}
                style={{ marginBottom: 16 }}
            />

            <MetricCard>
                <Header>Milestones</Header>
                {milestones.map(milestone => (
                    <MilestoneCard key={milestone.id} achieved={milestone.achieved}>
                        <MilestoneTitle achieved={milestone.achieved}>{milestone.title}</MilestoneTitle>
                        <MilestoneDescription achieved={milestone.achieved}>{milestone.description}</MilestoneDescription>
                        {milestone.achieved && milestone.date && (
                            <Text style={{ color: '#10B981', fontSize: 12, marginTop: 4 }}>
                                Achieved: {milestone.date.toLocaleDateString()}
                            </Text>
                        )}
                    </MilestoneCard>
                ))}
            </MetricCard>

            <MetricCard>
                <Header>Performance Prediction</Header>
                <Text style={{ color: '#374151', fontSize: 16, textAlign: 'center', padding: 16 }}>
                    {getPerformancePrediction()}
                </Text>
            </MetricCard>

            <TouchableOpacity onPress={handleExport}>
                <ExportButton>
                    <Ionicons name="download-outline" size={20} color="white" />
                    <ExportText>Export to CSV</ExportText>
                </ExportButton>
            </TouchableOpacity>

            {/* Competitors Modal */}
            <Modal visible={showCompetitors} animationType="slide" transparent>
                <ModalOverlay>
                    <ModalContent>
                        <ScrollView>
                            <Header>Competitor Benchmarks</Header>
                            {competitors.map(competitor => (
                                <CompetitorCard key={competitor.name}>
                                    <CompetitorInfo>
                                        <CompetitorName>{competitor.name}</CompetitorName>
                                        <CompetitorStats>
                                            {competitor.followers.toLocaleString()} followers • {competitor.engagement}% engagement • {competitor.posts} posts
                                        </CompetitorStats>
                                    </CompetitorInfo>
                                    <Ionicons name="trending-up" size={20} color="#10B981" />
                                </CompetitorCard>
                            ))}
                            <Button title="Close" onPress={() => setShowCompetitors(false)} />
                        </ScrollView>
                    </ModalContent>
                </ModalOverlay>
            </Modal>

            {/* Demographics Modal */}
            <Modal visible={showDemographics} animationType="slide" transparent>
                <ModalOverlay>
                    <ModalContent>
                        <ScrollView>
                            <Header>Audience Demographics</Header>

                            <DemographicsCard>
                                <DemographicsTitle>Age Groups</DemographicsTitle>
                                {Object.entries(audienceDemographics.ageGroups).map(([age, percentage]) => (
                                    <DemographicsRow key={age}>
                                        <DemographicsLabel>{age}</DemographicsLabel>
                                        <DemographicsValue>{percentage}%</DemographicsValue>
                                    </DemographicsRow>
                                ))}
                            </DemographicsCard>

                            <DemographicsCard>
                                <DemographicsTitle>Top Locations</DemographicsTitle>
                                {Object.entries(audienceDemographics.locations).map(([location, percentage]) => (
                                    <DemographicsRow key={location}>
                                        <DemographicsLabel>{location}</DemographicsLabel>
                                        <DemographicsValue>{percentage}%</DemographicsValue>
                                    </DemographicsRow>
                                ))}
                            </DemographicsCard>

                            <DemographicsCard>
                                <DemographicsTitle>Interests</DemographicsTitle>
                                {Object.entries(audienceDemographics.interests).map(([interest, percentage]) => (
                                    <DemographicsRow key={interest}>
                                        <DemographicsLabel>{interest}</DemographicsLabel>
                                        <DemographicsValue>{percentage}%</DemographicsValue>
                                    </DemographicsRow>
                                ))}
                            </DemographicsCard>

                            <Button title="Close" onPress={() => setShowDemographics(false)} />
                        </ScrollView>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </Container>
    );
} 