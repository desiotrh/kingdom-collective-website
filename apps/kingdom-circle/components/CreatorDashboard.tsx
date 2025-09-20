import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from 'packages/hooks/useFaithMode';

const { width: screenWidth } = Dimensions.get('window');

interface CreatorEarnings {
    userId: string;
    month: string;
    totalGross: number;
    creatorKeep: number;
    platformShare: number;
    blessingPoolExtra?: number;
    withdrawalStatus: 'pending' | 'paid';
    payoutMethod: 'stripe' | 'paypal';
}

interface CreatorMilestones {
    views: number;
    engagement: number;
    shares: number;
    followers: number;
    earnings: number;
}

interface BlessingRequest {
    id: string;
    userId: string;
    need: string;
    amount: number;
    reason: string;
    videoLink?: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp: Date;
}

interface CreatorAnalytics {
    audienceGrowth: number;
    engagementRate: number;
    bestPostingTimes: string[];
    topPerformingContent: any[];
    geographicReach: CountryData[];
    demographicBreakdown: AgeGenderData;
    contentPerformance: ContentPerformanceData;
    revenueTrends: RevenueTrendData[];
}

interface CountryData {
    country: string;
    viewers: number;
    percentage: number;
}

interface AgeGenderData {
    ageGroups: { [key: string]: number };
    gender: { male: number; female: number; other: number };
}

interface ContentPerformanceData {
    bestCategories: string[];
    bestTags: string[];
    optimalLength: number;
    bestDays: string[];
    bestHours: string[];
}

interface RevenueTrendData {
    date: string;
    earnings: number;
    tips: number;
    products: number;
    events: number;
}

interface CommunityChallenge {
    id: string;
    title: string;
    description: string;
    duration: number;
    participants: number;
    reward: string;
    faithMode: boolean;
    category: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    userProgress?: number;
    userCompleted?: boolean;
}

interface ContentSuggestion {
    trendingTopics: string[];
    optimalPostingTimes: Date[];
    hashtagRecommendations: string[];
    contentIdeas: string[];
    audienceInsights: AudienceData;
    competitorAnalysis: CompetitorData[];
}

interface AudienceData {
    interests: string[];
    activeHours: string[];
    preferredContent: string[];
    engagementPatterns: string[];
}

interface CompetitorData {
    username: string;
    followers: number;
    engagementRate: number;
    topContent: string[];
    strategy: string[];
}

export default function CreatorDashboard() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { faithMode } = useFaithMode();

    const [currentEarnings, setCurrentEarnings] = useState<CreatorEarnings | null>(null);
    const [milestones, setMilestones] = useState<CreatorMilestones>({
        views: 0,
        engagement: 0,
        shares: 0,
        followers: 0,
        earnings: 0,
    });
    const [blessingPoolOptIn, setBlessingPoolOptIn] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showBlessingRequestModal, setShowBlessingRequestModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [blessingRequest, setBlessingRequest] = useState({
        need: '',
        amount: '',
        reason: '',
        videoLink: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    // New state for enhanced features
    const [analytics, setAnalytics] = useState<CreatorAnalytics | null>(null);
    const [communityChallenges, setCommunityChallenges] = useState<CommunityChallenge[]>([]);
    const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion | null>(null);
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
    const [showChallengesModal, setShowChallengesModal] = useState(false);
    const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

    // Mock data for demonstration
    useEffect(() => {
        const mockEarnings: CreatorEarnings = {
            userId: 'user123',
            month: new Date().toISOString().slice(0, 7),
            totalGross: 1250.00,
            creatorKeep: 1125.00,
            platformShare: 125.00,
            blessingPoolExtra: 62.50,
            withdrawalStatus: 'pending',
            payoutMethod: 'stripe',
        };

        const mockMilestones: CreatorMilestones = {
            views: 15420,
            engagement: 2340,
            shares: 567,
            followers: 892,
            earnings: 1250,
        };

        // Enhanced analytics data - available to everyone
        const mockAnalytics: CreatorAnalytics = {
            audienceGrowth: 23.5,
            engagementRate: 8.7,
            bestPostingTimes: ['9:00 AM', '6:00 PM', '8:00 PM'],
            topPerformingContent: [
                { id: '1', title: 'Faith Testimony', views: 2500, engagement: 450 },
                { id: '2', title: 'Daily Encouragement', views: 1800, engagement: 320 },
                { id: '3', title: 'Prayer Request', views: 1200, engagement: 280 },
            ],
            geographicReach: [
                { country: 'United States', viewers: 8500, percentage: 55 },
                { country: 'Canada', viewers: 2100, percentage: 14 },
                { country: 'United Kingdom', viewers: 1800, percentage: 12 },
                { country: 'Australia', viewers: 1200, percentage: 8 },
                { country: 'Other', viewers: 1820, percentage: 11 },
            ],
            demographicBreakdown: {
                ageGroups: { '18-24': 25, '25-34': 35, '35-44': 22, '45+': 18 },
                gender: { male: 42, female: 55, other: 3 },
            },
            contentPerformance: {
                bestCategories: ['Faith & Spirituality', 'Family & Relationships', 'Health & Wellness'],
                bestTags: ['faith', 'family', 'inspiration', 'growth', 'truth'],
                optimalLength: 45,
                bestDays: ['Sunday', 'Wednesday', 'Friday'],
                bestHours: ['9:00 AM', '6:00 PM', '8:00 PM'],
            },
            revenueTrends: [
                { date: '2024-01', earnings: 850, tips: 600, products: 200, events: 50 },
                { date: '2024-02', earnings: 1100, tips: 750, products: 250, events: 100 },
                { date: '2024-03', earnings: 1250, tips: 900, products: 300, events: 50 },
            ],
        };

        // Community challenges - available to everyone
        const mockChallenges: CommunityChallenge[] = [
            {
                id: '1',
                title: faithMode ? '7-Day Prayer Challenge' : '7-Day Growth Challenge',
                description: faithMode 
                    ? 'Share daily prayers and testimonies for 7 days'
                    : 'Share daily growth insights for 7 days',
                duration: 7,
                participants: 1247,
                reward: faithMode ? 'Prayer Warrior Badge' : 'Growth Champion Badge',
                faithMode: true,
                category: 'Faith & Spirituality',
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isActive: true,
                userProgress: 3,
                userCompleted: false,
            },
            {
                id: '2',
                title: 'Family Connection Challenge',
                description: 'Share meaningful family moments and relationship insights',
                duration: 14,
                participants: 892,
                reward: 'Family Champion Badge',
                faithMode: false,
                category: 'Family & Relationships',
                startDate: new Date(),
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                isActive: true,
                userProgress: 0,
                userCompleted: false,
            },
            {
                id: '3',
                title: 'Truth Speaker Challenge',
                description: 'Share authentic, vulnerable content that speaks truth',
                duration: 30,
                participants: 567,
                reward: 'Truth Speaker Badge + $50 Bonus',
                faithMode: false,
                category: 'Lifestyle & Personal Growth',
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                isActive: true,
                userProgress: 0,
                userCompleted: false,
            },
        ];

        // AI content suggestions - available to everyone
        const mockSuggestions: ContentSuggestion = {
            trendingTopics: [
                faithMode ? 'Faith in difficult times' : 'Resilience in challenges',
                'Family relationships',
                'Personal growth',
                'Mental health awareness',
                'Community building',
            ],
            optimalPostingTimes: [
                new Date(Date.now() + 9 * 60 * 60 * 1000), // 9 AM
                new Date(Date.now() + 18 * 60 * 60 * 1000), // 6 PM
                new Date(Date.now() + 20 * 60 * 60 * 1000), // 8 PM
            ],
            hashtagRecommendations: [
                faithMode ? '#faith' : '#growth',
                '#family',
                '#truth',
                '#inspiration',
                '#community',
                '#authentic',
                '#vulnerable',
                '#real',
            ],
            contentIdeas: [
                faithMode ? 'Share a recent prayer answered' : 'Share a recent breakthrough',
                'Show behind-the-scenes of your daily routine',
                'Answer a question from your audience',
                'Share a lesson learned this week',
                'Show your workspace or creative process',
            ],
            audienceInsights: {
                interests: ['Faith', 'Family', 'Personal Development', 'Community', 'Authenticity'],
                activeHours: ['9:00 AM', '6:00 PM', '8:00 PM'],
                preferredContent: ['Testimonies', 'Daily Encouragement', 'Behind-the-scenes', 'Q&A'],
                engagementPatterns: ['Comments on vulnerable posts', 'Shares on inspirational content', 'Saves on practical tips'],
            },
            competitorAnalysis: [
                {
                    username: 'faithful_creator',
                    followers: 15000,
                    engagementRate: 12.5,
                    topContent: ['Daily prayers', 'Testimonies', 'Family moments'],
                    strategy: ['Post daily', 'Engage with comments', 'Share personal stories'],
                },
                {
                    username: 'growth_mindset',
                    followers: 22000,
                    engagementRate: 9.8,
                    topContent: ['Growth tips', 'Book reviews', 'Life lessons'],
                    strategy: ['Educational content', 'Interactive posts', 'Community engagement'],
                },
            ],
        };

        setCurrentEarnings(mockEarnings);
        setMilestones(mockMilestones);
        setBlessingPoolOptIn(true);
        setAnalytics(mockAnalytics);
        setCommunityChallenges(mockChallenges);
        setContentSuggestions(mockSuggestions);
    }, []);

    const handleWithdraw = async () => {
        if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid withdrawal amount.');
            return;
        }

        const amount = parseFloat(withdrawAmount);
        if (amount > (currentEarnings?.creatorKeep || 0)) {
            Alert.alert('Insufficient Funds', 'You cannot withdraw more than your available balance.');
            return;
        }

        setIsLoading(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            Alert.alert(
                faithMode ? 'Blessing Sent! 🙏' : 'Withdrawal Successful! 💰',
                faithMode
                    ? `Your withdrawal of $${amount.toFixed(2)} has been processed. May God bless your ministry!`
                    : `Your withdrawal of $${amount.toFixed(2)} has been processed and will arrive in 2-3 business days.`,
                [{ text: 'OK' }]
            );
            
            setWithdrawAmount('');
            setShowWithdrawModal(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to process withdrawal. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlessingRequest = async () => {
        if (!blessingRequest.need.trim() || !blessingRequest.amount.trim() || !blessingRequest.reason.trim()) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        const amount = parseFloat(blessingRequest.amount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount.');
            return;
        }

        setIsLoading(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            Alert.alert(
                faithMode ? 'Blessing Request Sent! 🙏' : 'Request Submitted! ✨',
                faithMode
                    ? 'Your blessing request has been submitted for review. We\'ll pray over it and respond within 48 hours.'
                    : 'Your request has been submitted for review. We\'ll respond within 48 hours.',
                [{ text: 'OK' }]
            );
            
            setBlessingRequest({
                need: '',
                amount: '',
                reason: '',
                videoLink: '',
            });
            setShowBlessingRequestModal(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to submit request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleBlessingPool = () => {
        setBlessingPoolOptIn(!blessingPoolOptIn);
        // In real app, this would update user settings
    };

    const renderEarningsCard = () => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
                {faithMode ? 'This Month\'s Blessings' : 'This Month\'s Earnings'}
            </Text>
            
            <View style={styles.earningsGrid}>
                <View style={styles.earningsItem}>
                    <Text style={[styles.earningsLabel, { color: colors.olive }]}>
                        {faithMode ? 'Total Blessings' : 'Gross Earnings'}
                    </Text>
                    <Text style={[styles.earningsAmount, { color: colors.emerald }]}>
                        ${currentEarnings?.totalGross.toFixed(2) || '0.00'}
                    </Text>
                </View>
                
                <View style={styles.earningsItem}>
                    <Text style={[styles.earningsLabel, { color: colors.olive }]}>
                        {faithMode ? 'Your Portion' : 'Your Share (90%)'}
                    </Text>
                    <Text style={[styles.earningsAmount, { color: colors.emerald }]}>
                        ${currentEarnings?.creatorKeep.toFixed(2) || '0.00'}
                    </Text>
                </View>
                
                <View style={styles.earningsItem}>
                    <Text style={[styles.earningsLabel, { color: colors.olive }]}>
                        {faithMode ? 'Platform Stewardship' : 'Platform Share (10%)'}
                    </Text>
                    <Text style={[styles.earningsAmount, { color: colors.olive }]}>
                        ${currentEarnings?.platformShare.toFixed(2) || '0.00'}
                    </Text>
                </View>
                
                {blessingPoolOptIn && (
                    <View style={styles.earningsItem}>
                        <Text style={[styles.earningsLabel, { color: colors.olive }]}>
                            {faithMode ? 'Blessing Pool (5%)' : 'Blessing Pool (5%)'}
                        </Text>
                        <Text style={[styles.earningsAmount, { color: colors.emerald }]}>
                            ${currentEarnings?.blessingPoolExtra?.toFixed(2) || '0.00'}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );

    const renderMilestonesCard = () => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
                {faithMode ? 'Your Ministry Impact' : 'Your Creator Milestones'}
            </Text>
            
            <View style={styles.milestonesGrid}>
                <View style={styles.milestoneItem}>
                    <Text style={[styles.milestoneNumber, { color: colors.emerald }]}>
                        {milestones.views.toLocaleString()}
                    </Text>
                    <Text style={[styles.milestoneLabel, { color: colors.olive }]}>
                        {faithMode ? 'Lives Touched' : 'Views'}
                    </Text>
                </View>
                
                <View style={styles.milestoneItem}>
                    <Text style={[styles.milestoneNumber, { color: colors.emerald }]}>
                        {milestones.engagement.toLocaleString()}
                    </Text>
                    <Text style={[styles.milestoneLabel, { color: colors.olive }]}>
                        {faithMode ? 'Hearts Moved' : 'Engagement'}
                    </Text>
                </View>
                
                <View style={styles.milestoneItem}>
                    <Text style={[styles.milestoneNumber, { color: colors.emerald }]}>
                        {milestones.shares.toLocaleString()}
                    </Text>
                    <Text style={[styles.milestoneLabel, { color: colors.olive }]}>
                        {faithMode ? 'Truth Shared' : 'Shares'}
                    </Text>
                </View>
                
                <View style={styles.milestoneItem}>
                    <Text style={[styles.milestoneNumber, { color: colors.emerald }]}>
                        {milestones.followers.toLocaleString()}
                    </Text>
                    <Text style={[styles.milestoneLabel, { color: colors.olive }]}>
                        {faithMode ? 'Disciples' : 'Followers'}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderActionButtons = () => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
                {faithMode ? 'Ministry Tools' : 'Creator Tools'}
            </Text>
            
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.emerald }]}
                    onPress={() => setShowWithdrawModal(true)}
                >
                    <Text style={[styles.actionButtonText, { color: colors.cream }]}>
                        💰 {faithMode ? 'Withdraw Blessings' : 'Withdraw Earnings'}
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.olive }]}
                    onPress={() => setShowBlessingRequestModal(true)}
                >
                    <Text style={[styles.actionButtonText, { color: colors.cream }]}>
                        🙏 {faithMode ? 'Request Blessing' : 'Request Help'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderBlessingPoolToggle = () => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.blessingPoolHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    💝 {faithMode ? 'Kingdom Blessing Pool' : 'Blessing Pool'}
                </Text>
                <TouchableOpacity
                    style={[
                        styles.toggle,
                        { backgroundColor: blessingPoolOptIn ? colors.emerald : colors.olive }
                    ]}
                    onPress={toggleBlessingPool}
                >
                    <View style={[
                        styles.toggleThumb,
                        { transform: [{ translateX: blessingPoolOptIn ? 20 : 0 }] }
                    ]} />
                </TouchableOpacity>
            </View>
            
            <Text style={[styles.blessingPoolDescription, { color: colors.olive }]}>
                {faithMode
                    ? 'Contribute an extra 5% to help other creators in need. "Give and it will be given to you."'
                    : 'Contribute an extra 5% to help other creators in need. Pay it forward!'
                }
            </Text>
            
            {blessingPoolOptIn && (
                <View style={styles.blessingPoolStats}>
                    <Text style={[styles.blessingPoolStat, { color: colors.emerald }]}>
                        This month: ${currentEarnings?.blessingPoolExtra?.toFixed(2) || '0.00'} contributed
                    </Text>
                    <Text style={[styles.blessingPoolStat, { color: colors.olive }]}>
                        Total helped: 23 creators
                    </Text>
                </View>
            )}
        </View>
    );

    const renderEnhancedAnalyticsCard = () => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    📊 Advanced Analytics
                </Text>
                <TouchableOpacity
                    style={[styles.viewAllButton, { backgroundColor: colors.emerald }]}
                    onPress={() => setShowAnalyticsModal(true)}
                >
                    <Text style={[styles.viewAllButtonText, { color: colors.cream }]}>
                        View All
                    </Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.analyticsGrid}>
                <View style={styles.analyticsItem}>
                    <Text style={[styles.analyticsNumber, { color: colors.emerald }]}>
                        {analytics?.audienceGrowth}%
                    </Text>
                    <Text style={[styles.analyticsLabel, { color: colors.olive }]}>
                        Audience Growth
                    </Text>
                </View>
                
                <View style={styles.analyticsItem}>
                    <Text style={[styles.analyticsNumber, { color: colors.emerald }]}>
                        {analytics?.engagementRate}%
                    </Text>
                    <Text style={[styles.analyticsLabel, { color: colors.olive }]}>
                        Engagement Rate
                    </Text>
                </View>
                
                <View style={styles.analyticsItem}>
                    <Text style={[styles.analyticsNumber, { color: colors.emerald }]}>
                        {analytics?.bestPostingTimes.length}
                    </Text>
                    <Text style={[styles.analyticsLabel, { color: colors.olive }]}>
                        Optimal Times
                    </Text>
                </View>
                
                <View style={styles.analyticsItem}>
                    <Text style={[styles.analyticsNumber, { color: colors.emerald }]}>
                        {analytics?.geographicReach.length}
                    </Text>
                    <Text style={[styles.analyticsLabel, { color: colors.olive }]}>
                        Countries Reached
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderCommunityChallengesCard = () => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    🏆 Community Challenges
                </Text>
                <TouchableOpacity
                    style={[styles.viewAllButton, { backgroundColor: colors.emerald }]}
                    onPress={() => setShowChallengesModal(true)}
                >
                    <Text style={[styles.viewAllButtonText, { color: colors.cream }]}>
                        View All
                    </Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.challengesContainer}>
                {communityChallenges.slice(0, 2).map((challenge) => (
                    <View key={challenge.id} style={[styles.challengeItem, { backgroundColor: colors.background }]}>
                        <View style={styles.challengeHeader}>
                            <Text style={[styles.challengeTitle, { color: colors.text }]}>
                                {challenge.title}
                            </Text>
                            <Text style={[styles.challengeReward, { color: colors.emerald }]}>
                                {challenge.reward}
                            </Text>
                        </View>
                        
                        <Text style={[styles.challengeDescription, { color: colors.olive }]}>
                            {challenge.description}
                        </Text>
                        
                        <View style={styles.challengeStats}>
                            <Text style={[styles.challengeStat, { color: colors.olive }]}>
                                {challenge.participants} participants
                            </Text>
                            <Text style={[styles.challengeStat, { color: colors.olive }]}>
                                {challenge.duration} days
                            </Text>
                        </View>
                        
                        {challenge.userProgress !== undefined && (
                            <View style={styles.progressContainer}>
                                <View style={[styles.progressBar, { backgroundColor: colors.olive }]}>
                                    <View 
                                        style={[
                                            styles.progressFill, 
                                            { 
                                                backgroundColor: colors.emerald,
                                                width: `${(challenge.userProgress / challenge.duration) * 100}%`
                                            }
                                        ]} 
                                    />
                                </View>
                                <Text style={[styles.progressText, { color: colors.olive }]}>
                                    {challenge.userProgress}/{challenge.duration} days
                                </Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );

    const renderAIContentSuggestionsCard = () => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    🤖 AI Content Suggestions
                </Text>
                <TouchableOpacity
                    style={[styles.viewAllButton, { backgroundColor: colors.emerald }]}
                    onPress={() => setShowSuggestionsModal(true)}
                >
                    <Text style={[styles.viewAllButtonText, { color: colors.cream }]}>
                        View All
                    </Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.suggestionsContainer}>
                <View style={styles.suggestionSection}>
                    <Text style={[styles.suggestionTitle, { color: colors.text }]}>
                        Trending Topics
                    </Text>
                    <View style={styles.tagsContainer}>
                        {contentSuggestions?.trendingTopics.slice(0, 3).map((topic, index) => (
                            <Text key={index} style={[styles.tag, { color: colors.emerald }]}>
                                #{topic.replace(/\s+/g, '')}
                            </Text>
                        ))}
                    </View>
                </View>
                
                <View style={styles.suggestionSection}>
                    <Text style={[styles.suggestionTitle, { color: colors.text }]}>
                        Content Ideas
                    </Text>
                    <Text style={[styles.suggestionText, { color: colors.olive }]}>
                        {contentSuggestions?.contentIdeas[0]}
                    </Text>
                </View>
                
                <View style={styles.suggestionSection}>
                    <Text style={[styles.suggestionTitle, { color: colors.text }]}>
                        Best Posting Times
                    </Text>
                    <Text style={[styles.suggestionText, { color: colors.olive }]}>
                        {contentSuggestions?.optimalPostingTimes.slice(0, 2).map(time => 
                            time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                        ).join(', ')}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
            {/* Header Message */}
            <View style={[styles.headerMessage, { backgroundColor: colors.emerald }]}>
                <Text style={[styles.headerMessageText, { color: colors.cream }]}>
                    {faithMode
                        ? 'Your voice matters here. We don\'t silence truth. We don\'t punish growth. We lift what\'s real.'
                        : 'Your voice matters here. We don\'t silence truth. We don\'t punish growth. We lift what\'s real.'
                    }
                </Text>
            </View>

            {/* Earnings Card */}
            {renderEarningsCard()}

            {/* Milestones Card */}
            {renderMilestonesCard()}

            {/* Action Buttons */}
            {renderActionButtons()}

            {/* Blessing Pool Toggle */}
            {renderBlessingPoolToggle()}

            {/* Enhanced Analytics Card - Available to Everyone */}
            {renderEnhancedAnalyticsCard()}

            {/* Community Challenges Card - Available to Everyone */}
            {renderCommunityChallengesCard()}

            {/* AI Content Suggestions Card - Available to Everyone */}
            {renderAIContentSuggestionsCard()}

            {/* Why 10% Explainer */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {faithMode ? 'Why 10% Platform Stewardship?' : 'Why 10% Platform Share?'}
                </Text>
                <Text style={[styles.explainerText, { color: colors.olive }]}>
                    {faithMode
                        ? 'We believe in the Kingdom principle of tithing. You keep 90% of everything you earn. We steward 10% to:\n\n• Cover platform hosting + video storage\n• Support creator payouts + tips\n• Fund our Blessing Pool for creators in need\n• Keep Kingdom Circle ad-free and independent\n\nWith enough members, 10% is more than enough.'
                        : 'You keep 90% of everything you earn. We use 10% to:\n\n• Cover platform hosting + video storage\n• Support creator payouts + tips\n• Fund our Blessing Pool for creators in need\n• Keep Kingdom Circle ad-free and independent\n\nWith enough members, 10% is more than enough.'
                    }
                </Text>
            </View>

            {/* Withdraw Modal */}
            <Modal visible={showWithdrawModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            {faithMode ? 'Withdraw Blessings' : 'Withdraw Earnings'}
                        </Text>
                        
                        <Text style={[styles.modalSubtitle, { color: colors.olive }]}>
                            Available: ${currentEarnings?.creatorKeep.toFixed(2) || '0.00'}
                        </Text>
                        
                        <TextInput
                            style={[styles.modalInput, { 
                                color: colors.text,
                                borderColor: colors.olive,
                                backgroundColor: colors.background
                            }]}
                            placeholder="Enter amount"
                            placeholderTextColor={colors.olive}
                            value={withdrawAmount}
                            onChangeText={setWithdrawAmount}
                            keyboardType="numeric"
                        />
                        
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowWithdrawModal(false)}
                            >
                                <Text style={[styles.cancelButtonText, { color: colors.olive }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.emerald }]}
                                onPress={handleWithdraw}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={colors.cream} />
                                ) : (
                                    <Text style={[styles.confirmButtonText, { color: colors.cream }]}>
                                        {faithMode ? 'Withdraw' : 'Withdraw'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Blessing Request Modal */}
            <Modal visible={showBlessingRequestModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <ScrollView style={styles.modalScrollView}>
                        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {faithMode ? 'Request a Blessing' : 'Request Help'}
                            </Text>
                            
                            <Text style={[styles.modalSubtitle, { color: colors.olive }]}>
                                {faithMode
                                    ? 'Share your need and let the community support you.'
                                    : 'Share your need and let the community support you.'
                                }
                            </Text>
                            
                            <TextInput
                                style={[styles.modalTextArea, { 
                                    color: colors.text,
                                    borderColor: colors.olive,
                                    backgroundColor: colors.background
                                }]}
                                placeholder={faithMode ? "What do you need?" : "What do you need?"}
                                placeholderTextColor={colors.olive}
                                value={blessingRequest.need}
                                onChangeText={(text) => setBlessingRequest(prev => ({ ...prev, need: text }))}
                                multiline
                                numberOfLines={3}
                            />
                            
                            <TextInput
                                style={[styles.modalInput, { 
                                    color: colors.text,
                                    borderColor: colors.olive,
                                    backgroundColor: colors.background
                                }]}
                                placeholder="Amount requested"
                                placeholderTextColor={colors.olive}
                                value={blessingRequest.amount}
                                onChangeText={(text) => setBlessingRequest(prev => ({ ...prev, amount: text }))}
                                keyboardType="numeric"
                            />
                            
                            <TextInput
                                style={[styles.modalTextArea, { 
                                    color: colors.text,
                                    borderColor: colors.olive,
                                    backgroundColor: colors.background
                                }]}
                                placeholder={faithMode ? "Why do you need this blessing?" : "Why do you need this help?"}
                                placeholderTextColor={colors.olive}
                                value={blessingRequest.reason}
                                onChangeText={(text) => setBlessingRequest(prev => ({ ...prev, reason: text }))}
                                multiline
                                numberOfLines={4}
                            />
                            
                            <TextInput
                                style={[styles.modalInput, { 
                                    color: colors.text,
                                    borderColor: colors.olive,
                                    backgroundColor: colors.background
                                }]}
                                placeholder="Optional: Video or testimony link"
                                placeholderTextColor={colors.olive}
                                value={blessingRequest.videoLink}
                                onChangeText={(text) => setBlessingRequest(prev => ({ ...prev, videoLink: text }))}
                            />
                            
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowBlessingRequestModal(false)}
                                >
                                    <Text style={[styles.cancelButtonText, { color: colors.olive }]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.emerald }]}
                                    onPress={handleBlessingRequest}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color={colors.cream} />
                                    ) : (
                                        <Text style={[styles.confirmButtonText, { color: colors.cream }]}>
                                            {faithMode ? 'Submit Request' : 'Submit Request'}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Enhanced Analytics Modal */}
            <Modal visible={showAnalyticsModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <ScrollView style={styles.modalScrollView}>
                        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Advanced Analytics
                            </Text>
                            <View style={styles.analyticsGrid}>
                                <View style={styles.analyticsItem}>
                                    <Text style={[styles.analyticsNumber, { color: colors.emerald }]}>
                                        {analytics?.audienceGrowth}%
                                    </Text>
                                    <Text style={[styles.analyticsLabel, { color: colors.olive }]}>
                                        Audience Growth
                                    </Text>
                                </View>
                                <View style={styles.analyticsItem}>
                                    <Text style={[styles.analyticsNumber, { color: colors.emerald }]}>
                                        {analytics?.engagementRate}%
                                    </Text>
                                    <Text style={[styles.analyticsLabel, { color: colors.olive }]}>
                                        Engagement Rate
                                    </Text>
                                </View>
                                <View style={styles.analyticsItem}>
                                    <Text style={[styles.analyticsNumber, { color: colors.emerald }]}>
                                        {analytics?.bestPostingTimes.length}
                                    </Text>
                                    <Text style={[styles.analyticsLabel, { color: colors.olive }]}>
                                        Optimal Times
                                    </Text>
                                </View>
                                <View style={styles.analyticsItem}>
                                    <Text style={[styles.analyticsNumber, { color: colors.emerald }]}>
                                        {analytics?.geographicReach.length}
                                    </Text>
                                    <Text style={[styles.analyticsLabel, { color: colors.olive }]}>
                                        Countries Reached
                                    </Text>
                                </View>
                            </View>
                            <Text style={[styles.modalSubtitle, { color: colors.olive }]}>
                                Detailed breakdown of your content performance, audience growth, and revenue trends.
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Community Challenges Modal */}
            <Modal visible={showChallengesModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <ScrollView style={styles.modalScrollView}>
                        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Community Challenges
                            </Text>
                            <View style={styles.challengesContainer}>
                                {communityChallenges.map((challenge) => (
                                    <View key={challenge.id} style={[styles.challengeItem, { backgroundColor: colors.background }]}>
                                        <View style={styles.challengeHeader}>
                                            <Text style={[styles.challengeTitle, { color: colors.text }]}>
                                                {challenge.title}
                                            </Text>
                                            <Text style={[styles.challengeReward, { color: colors.emerald }]}>
                                                {challenge.reward}
                                            </Text>
                                        </View>
                                        
                                        <Text style={[styles.challengeDescription, { color: colors.olive }]}>
                                            {challenge.description}
                                        </Text>
                                        
                                        <View style={styles.challengeStats}>
                                            <Text style={[styles.challengeStat, { color: colors.olive }]}>
                                                {challenge.participants} participants
                                            </Text>
                                            <Text style={[styles.challengeStat, { color: colors.olive }]}>
                                                {challenge.duration} days
                                            </Text>
                                        </View>
                                        
                                        {challenge.userProgress !== undefined && (
                                            <View style={styles.progressContainer}>
                                                <View style={[styles.progressBar, { backgroundColor: colors.olive }]}>
                                                    <View 
                                                        style={[
                                                            styles.progressFill, 
                                                            { 
                                                                backgroundColor: colors.emerald,
                                                                width: `${(challenge.userProgress / challenge.duration) * 100}%`
                                                            }
                                                        ]} 
                                                    />
                                                </View>
                                                <Text style={[styles.progressText, { color: colors.olive }]}>
                                                    {challenge.userProgress}/{challenge.duration} days
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                            <Text style={[styles.modalSubtitle, { color: colors.olive }]}>
                                Join community challenges to grow your audience and earn rewards.
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* AI Content Suggestions Modal */}
            <Modal visible={showSuggestionsModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <ScrollView style={styles.modalScrollView}>
                        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                AI Content Suggestions
                            </Text>
                            <View style={styles.suggestionsContainer}>
                                <View style={styles.suggestionSection}>
                                    <Text style={[styles.suggestionTitle, { color: colors.text }]}>
                                        Trending Topics
                                    </Text>
                                    <View style={styles.tagsContainer}>
                                        {contentSuggestions?.trendingTopics.map((topic, index) => (
                                            <Text key={index} style={[styles.tag, { color: colors.emerald }]}>
                                                #{topic.replace(/\s+/g, '')}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                                <View style={styles.suggestionSection}>
                                    <Text style={[styles.suggestionTitle, { color: colors.text }]}>
                                        Content Ideas
                                    </Text>
                                    <Text style={[styles.suggestionText, { color: colors.olive }]}>
                                        {contentSuggestions?.contentIdeas.join(', ')}
                                    </Text>
                                </View>
                                <View style={styles.suggestionSection}>
                                    <Text style={[styles.suggestionTitle, { color: colors.text }]}>
                                        Best Posting Times
                                    </Text>
                                    <Text style={[styles.suggestionText, { color: colors.olive }]}>
                                        {contentSuggestions?.optimalPostingTimes.map(time => 
                                            time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                                        ).join(', ')}
                                    </Text>
                                </View>
                            </View>
                            <Text style={[styles.modalSubtitle, { color: colors.olive }]}>
                                Get AI-powered content ideas and insights to grow your audience.
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    headerMessage: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    headerMessageText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 22,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    earningsGrid: {
        gap: 12,
    },
    earningsItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    earningsLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    earningsAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    milestonesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    milestoneItem: {
        flex: 1,
        minWidth: (screenWidth - 64) / 2,
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    milestoneNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    milestoneLabel: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    actionButtons: {
        gap: 12,
    },
    actionButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    blessingPoolHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    blessingPoolDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    blessingPoolStats: {
        gap: 4,
    },
    blessingPoolStat: {
        fontSize: 12,
        fontWeight: '500',
    },
    toggle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        padding: 2,
    },
    toggleThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    explainerText: {
        fontSize: 14,
        lineHeight: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalScrollView: {
        flex: 1,
        justifyContent: 'center',
    },
    modalContent: {
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    modalTextArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: 'transparent',
    },
    confirmButton: {
        borderWidth: 1,
        borderColor: 'transparent',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    viewAllButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    viewAllButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    analyticsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    analyticsItem: {
        flex: 1,
        minWidth: (screenWidth - 80) / 2,
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    analyticsNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    analyticsLabel: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    challengesContainer: {
        gap: 12,
    },
    challengeItem: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    challengeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    challengeTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    challengeReward: {
        fontSize: 12,
        fontWeight: '600',
    },
    challengeDescription: {
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
    },
    challengeStats: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    challengeStat: {
        fontSize: 12,
        fontWeight: '500',
    },
    progressContainer: {
        marginTop: 8,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        marginBottom: 4,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        textAlign: 'center',
    },
    suggestionsContainer: {
        gap: 16,
    },
    suggestionSection: {
        gap: 8,
    },
    suggestionTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    suggestionText: {
        fontSize: 14,
        lineHeight: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        fontSize: 12,
        fontWeight: '500',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
});
