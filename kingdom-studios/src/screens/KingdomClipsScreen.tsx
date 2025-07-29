import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    Dimensions,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

// Import all services
import { aiVideoService } from '../services/aiVideoService';
import { collaborationService } from '../services/collaborationService';
import { audioService } from '../services/audioService';
import { socialBoostService } from '../services/socialBoostService';
import { faithService } from '../services/faithService';
import { analyticsService } from '../services/analyticsService';
import { monetizationService } from '../services/monetizationService';
import { performanceService } from '../services/performanceService';
import { uxService } from '../services/uxService';
import { communityService } from '../services/communityService';

// Import components
import { KingdomColors } from '../constants/KingdomColors';
import { useAuth } from '../contexts/UnifiedAuthContext';
import { useDualMode } from '../contexts/DualModeContext';

const { width, height } = Dimensions.get('window');

interface KingdomClipsScreenProps {
    navigation: any;
}

export default function KingdomClipsScreen({ navigation }: KingdomClipsScreenProps) {
    const { user } = useAuth();
    const { isFaithMode } = useDualMode();

    // State management
    const [activeTab, setActiveTab] = useState('editor');
    const [isLoading, setIsLoading] = useState(false);
    const [currentProject, setCurrentProject] = useState<any>(null);
    const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
    const [collaborationProjects, setCollaborationProjects] = useState<any[]>([]);
    const [communityChallenges, setCommunityChallenges] = useState<any[]>([]);
    const [featureRequests, setFeatureRequests] = useState<any[]>([]);
    const [onboardingFlow, setOnboardingFlow] = useState<any>(null);

    // Refs
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        initializeKingdomClips();
        loadOnboarding();
    }, []);

    const initializeKingdomClips = async () => {
        setIsLoading(true);
        try {
            // Initialize all services
            await Promise.all([
                loadCommunityChallenges(),
                loadFeatureRequests(),
                loadCollaborationProjects(),
            ]);
        } catch (error) {
            console.error('Kingdom Clips initialization failed:', error);
            Alert.alert('Initialization Error', 'Failed to load Kingdom Clips features');
        } finally {
            setIsLoading(false);
        }
    };

    const loadOnboarding = async () => {
        try {
            const flow = await uxService.startOnboarding('kingdom_clips_complete');
            setOnboardingFlow(flow);
        } catch (error) {
            console.error('Onboarding load failed:', error);
        }
    };

    const loadCommunityChallenges = async () => {
        try {
            const challenges = await communityService.getCommunityChallenges('active');
            setCommunityChallenges(challenges);
        } catch (error) {
            console.error('Community challenges load failed:', error);
        }
    };

    const loadFeatureRequests = async () => {
        try {
            const requests = await communityService.getFeatureRequests('under_review');
            setFeatureRequests(requests);
        } catch (error) {
            console.error('Feature requests load failed:', error);
        }
    };

    const loadCollaborationProjects = async () => {
        try {
            // This would load user's collaboration projects
            setCollaborationProjects([]);
        } catch (error) {
            console.error('Collaboration projects load failed:', error);
        }
    };

    const handleAIFeature = async (feature: string) => {
        setIsLoading(true);
        try {
            switch (feature) {
                case 'captions':
                    const captions = await aiVideoService.generateCaptions('video_url');
                    setAiSuggestions(prev => [...prev, { type: 'captions', data: captions }]);
                    break;
                case 'music':
                    const music = await aiVideoService.suggestMusic('video_url', 60);
                    setAiSuggestions(prev => [...prev, { type: 'music', data: music }]);
                    break;
                case 'thumbnails':
                    const thumbnails = await aiVideoService.generateThumbnails('video_url');
                    setAiSuggestions(prev => [...prev, { type: 'thumbnails', data: thumbnails }]);
                    break;
                case 'viral':
                    const viral = await aiVideoService.analyzeViralPotential('video_url');
                    setAiSuggestions(prev => [...prev, { type: 'viral', data: viral }]);
                    break;
                case 'hashtags':
                    const hashtags = await aiVideoService.getTrendingHashtags('faith content', 'tiktok');
                    setAiSuggestions(prev => [...prev, { type: 'hashtags', data: hashtags }]);
                    break;
            }
        } catch (error) {
            console.error('AI feature failed:', error);
            Alert.alert('AI Feature Error', 'Failed to process AI feature');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFaithFeature = async (feature: string) => {
        try {
            switch (feature) {
                case 'scripture':
                    const scriptures = await faithService.searchScriptures('hope', 'NIV');
                    Alert.alert('Scripture Found', `Found ${scriptures.length} relevant scriptures`);
                    break;
                case 'prayer':
                    const prayers = await faithService.getPrayerRequests('personal');
                    Alert.alert('Prayer Requests', `Found ${prayers.length} prayer requests`);
                    break;
                case 'worship':
                    const worship = await faithService.searchWorshipMusic('praise', 'worship');
                    Alert.alert('Worship Music', `Found ${worship.length} worship tracks`);
                    break;
            }
        } catch (error) {
            console.error('Faith feature failed:', error);
            Alert.alert('Faith Feature Error', 'Failed to load faith feature');
        }
    };

    const handleSocialBoost = async (feature: string) => {
        try {
            switch (feature) {
                case 'hashtags':
                    const hashtags = await socialBoostService.getTrendingHashtags('faith content', 'tiktok');
                    Alert.alert('Trending Hashtags', `Found ${hashtags.length} trending hashtags`);
                    break;
                case 'posting_times':
                    const times = await socialBoostService.getOptimalPostingTimes('tiktok', 'America/New_York', 'faith');
                    Alert.alert('Optimal Posting Times', `Found ${times.length} optimal times`);
                    break;
                case 'challenges':
                    const challenges = await socialBoostService.getCreatorChallenges();
                    Alert.alert('Creator Challenges', `Found ${challenges.length} active challenges`);
                    break;
            }
        } catch (error) {
            console.error('Social boost failed:', error);
            Alert.alert('Social Boost Error', 'Failed to load social features');
        }
    };

    const handleMonetization = async (feature: string) => {
        try {
            switch (feature) {
                case 'sponsorships':
                    const sponsorships = await monetizationService.getBrandSponsorships('faith');
                    Alert.alert('Brand Sponsorships', `Found ${sponsorships.length} sponsorship opportunities`);
                    break;
                case 'merchandise':
                    const merchandise = await monetizationService.getMerchandiseLinks('etsy', 'faith');
                    Alert.alert('Merchandise Links', `Found ${merchandise.length} merchandise items`);
                    break;
                case 'donations':
                    const donations = await monetizationService.getDonationTools('youth ministry');
                    Alert.alert('Donation Tools', `Found ${donations.length} donation campaigns`);
                    break;
            }
        } catch (error) {
            console.error('Monetization failed:', error);
            Alert.alert('Monetization Error', 'Failed to load monetization features');
        }
    };

    const handlePerformance = async (feature: string) => {
        try {
            switch (feature) {
                case 'cloud_render':
                    const capabilities = await performanceService.checkDeviceCapabilities();
                    Alert.alert('Device Capabilities', `Supports 4K: ${capabilities.supports4K}, 8K: ${capabilities.supports8K}`);
                    break;
                case 'batch_process':
                    Alert.alert('Batch Processing', 'Batch processing feature ready');
                    break;
                case 'auto_backup':
                    const backups = await performanceService.getAutoBackups();
                    Alert.alert('Auto Backups', `Found ${backups.length} backups`);
                    break;
            }
        } catch (error) {
            console.error('Performance feature failed:', error);
            Alert.alert('Performance Error', 'Failed to load performance features');
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'editor':
                return renderEditorTab();
            case 'ai':
                return renderAITab();
            case 'collaboration':
                return renderCollaborationTab();
            case 'faith':
                return renderFaithTab();
            case 'social':
                return renderSocialTab();
            case 'analytics':
                return renderAnalyticsTab();
            case 'monetization':
                return renderMonetizationTab();
            case 'performance':
                return renderPerformanceTab();
            case 'community':
                return renderCommunityTab();
            default:
                return renderEditorTab();
        }
    };

    const renderEditorTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Video Editor</Text>
            <Text style={styles.tabDescription}>
                Professional video editing with multi-track timeline, effects, and transitions
            </Text>

            <View style={styles.featureGrid}>
                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('TimelineEditor')}>
                    <MaterialIcons name="timeline" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Timeline Editor</Text>
                    <Text style={styles.featureDescription}>Multi-track video editing</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('EffectsLibrary')}>
                    <MaterialIcons name="filter" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Effects Library</Text>
                    <Text style={styles.featureDescription}>Transitions & effects</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('ChromaKey')}>
                    <MaterialIcons name="colorize" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Chroma Key</Text>
                    <Text style={styles.featureDescription}>Green screen effects</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('SocialPublish')}>
                    <MaterialIcons name="share" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Direct Publish</Text>
                    <Text style={styles.featureDescription}>Share to social platforms</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderAITab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>AI-Powered Features</Text>
            <Text style={styles.tabDescription}>
                Intelligent content enhancement with AI assistance
            </Text>

            <View style={styles.featureGrid}>
                <TouchableOpacity style={styles.featureCard} onPress={() => handleAIFeature('captions')}>
                    <MaterialIcons name="closed-caption" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Auto Captions</Text>
                    <Text style={styles.featureDescription}>Speech-to-text generation</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => handleAIFeature('music')}>
                    <MaterialIcons name="music-note" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Smart Music</Text>
                    <Text style={styles.featureDescription}>AI music selection</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => handleAIFeature('thumbnails')}>
                    <MaterialIcons name="image" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Auto Thumbnails</Text>
                    <Text style={styles.featureDescription}>Optimal thumbnail generation</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => handleAIFeature('viral')}>
                    <MaterialIcons name="trending-up" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Viral Prediction</Text>
                    <Text style={styles.featureDescription}>AI engagement analysis</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => handleAIFeature('hashtags')}>
                    <MaterialIcons name="tag" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Trending Hashtags</Text>
                    <Text style={styles.featureDescription}>AI hashtag suggestions</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('VoiceOverGenerator')}>
                    <MaterialIcons name="record-voice-over" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Voice Over</Text>
                    <Text style={styles.featureDescription}>AI voice generation</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCollaborationTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Collaboration Tools</Text>
            <Text style={styles.tabDescription}>
                Work together with other creators on video projects
            </Text>

            <View style={styles.featureGrid}>
                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('MultiUserEditing')}>
                    <MaterialIcons name="group" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Multi-User Editing</Text>
                    <Text style={styles.featureDescription}>Real-time collaboration</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('VersionHistory')}>
                    <MaterialIcons name="history" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Version History</Text>
                    <Text style={styles.featureDescription}>Track changes & rollback</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('TimelineComments')}>
                    <MaterialIcons name="comment" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Timeline Comments</Text>
                    <Text style={styles.featureDescription}>Feedback on timeline</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('RemoteRecording')}>
                    <MaterialIcons name="mic" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Remote Recording</Text>
                    <Text style={styles.featureDescription}>Record remotely</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFaithTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Faith & Encouragement</Text>
            <Text style={styles.tabDescription}>
                Faith-integrated features for spiritual content creation
            </Text>

            <View style={styles.featureGrid}>
                <TouchableOpacity style={styles.featureCard} onPress={() => handleFaithFeature('scripture')}>
                    <FontAwesome5 name="bible" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Scripture Search</Text>
                    <Text style={styles.featureDescription}>Find relevant verses</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => handleFaithFeature('prayer')}>
                    <FontAwesome5 name="pray" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Prayer Wall</Text>
                    <Text style={styles.featureDescription}>Share prayer requests</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => handleFaithFeature('worship')}>
                    <FontAwesome5 name="music" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Worship Music</Text>
                    <Text style={styles.featureDescription}>Faith-based background music</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('TestimonyTemplates')}>
                    <FontAwesome5 name="heart" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Testimony Templates</Text>
                    <Text style={styles.featureDescription}>Share your story</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('ChurchEvents')}>
                    <FontAwesome5 name="church" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Church Events</Text>
                    <Text style={styles.featureDescription}>Event promotion tools</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('FaithOverlays')}>
                    <FontAwesome5 name="cross" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Faith Overlays</Text>
                    <Text style={styles.featureDescription}>Spiritual text overlays</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderSocialTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Social & Viral Boosters</Text>
            <Text style={styles.tabDescription}>
                Tools to maximize your content's reach and engagement
            </Text>

            <View style={styles.featureGrid}>
                <TouchableOpacity style={styles.featureCard} onPress={() => handleSocialBoost('hashtags')}>
                    <MaterialIcons name="trending-up" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Trending Hashtags</Text>
                    <Text style={styles.featureDescription}>AI hashtag suggestions</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => handleSocialBoost('posting_times')}>
                    <MaterialIcons name="schedule" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Optimal Posting</Text>
                    <Text style={styles.featureDescription}>Best times to post</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => handleSocialBoost('challenges')}>
                    <MaterialIcons name="emoji-events" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Creator Challenges</Text>
                    <Text style={styles.featureDescription}>Weekly competitions</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('AutoCrop')}>
                    <MaterialIcons name="crop" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Auto Crop</Text>
                    <Text style={styles.featureDescription}>Platform optimization</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('InfluencerCollab')}>
                    <MaterialIcons name="people" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Influencer Collab</Text>
                    <Text style={styles.featureDescription}>Connect with creators</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('ViralAnalytics')}>
                    <MaterialIcons name="analytics" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Viral Analytics</Text>
                    <Text style={styles.featureDescription}>Performance insights</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderAnalyticsTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Advanced Analytics</Text>
            <Text style={styles.tabDescription}>
                Deep insights into your content performance and audience
            </Text>

            <View style={styles.featureGrid}>
                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('ViralForecast')}>
                    <MaterialIcons name="trending-up" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Viral Forecast</Text>
                    <Text style={styles.featureDescription}>AI engagement prediction</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('ABTesting')}>
                    <MaterialIcons name="compare" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>A/B Testing</Text>
                    <Text style={styles.featureDescription}>Compare content versions</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('AudienceInsights')}>
                    <MaterialIcons name="people" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Audience Insights</Text>
                    <Text style={styles.featureDescription}>Demographics & behavior</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('EngagementTracker')}>
                    <MaterialIcons name="track-changes" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Engagement Tracker</Text>
                    <Text style={styles.featureDescription}>Real-time metrics</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('ROICalculator')}>
                    <MaterialIcons name="attach-money" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>ROI Calculator</Text>
                    <Text style={styles.featureDescription}>Revenue tracking</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('PerformanceMetrics')}>
                    <MaterialIcons name="speed" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Performance Metrics</Text>
                    <Text style={styles.featureDescription}>System performance</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderMonetizationTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Monetization Tools</Text>
            <Text style={styles.tabDescription}>
                Turn your content into income with various monetization options
            </Text>

            <View style={styles.featureGrid}>
                <TouchableOpacity style={styles.featureCard} onPress={() => handleMonetization('sponsorships')}>
                    <MaterialIcons name="business" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Brand Sponsorships</Text>
                    <Text style={styles.featureDescription}>Partner with brands</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => handleMonetization('merchandise')}>
                    <MaterialIcons name="shopping-bag" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Merchandise Links</Text>
                    <Text style={styles.featureDescription}>Sell your products</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => handleMonetization('donations')}>
                    <MaterialIcons name="favorite" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Donation Tools</Text>
                    <Text style={styles.featureDescription}>Receive donations</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('PremiumTemplates')}>
                    <MaterialIcons name="star" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Premium Templates</Text>
                    <Text style={styles.featureDescription}>Sell your templates</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('CreatorMarketplace')}>
                    <MaterialIcons name="store" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Creator Marketplace</Text>
                    <Text style={styles.featureDescription}>Buy & sell assets</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('RevenueAnalytics')}>
                    <MaterialIcons name="analytics" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Revenue Analytics</Text>
                    <Text style={styles.featureDescription}>Track your earnings</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPerformanceTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Performance & Tech</Text>
            <Text style={styles.tabDescription}>
                Advanced technical features for professional content creation
            </Text>

            <View style={styles.featureGrid}>
                <TouchableOpacity style={styles.featureCard} onPress={() => handlePerformance('cloud_render')}>
                    <MaterialIcons name="cloud" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Cloud Rendering</Text>
                    <Text style={styles.featureDescription}>Remote processing</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => handlePerformance('batch_process')}>
                    <MaterialIcons name="queue" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Batch Processing</Text>
                    <Text style={styles.featureDescription}>Multiple projects</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => handlePerformance('auto_backup')}>
                    <MaterialIcons name="backup" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Auto Backup</Text>
                    <Text style={styles.featureDescription}>Project protection</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('OfflineEditing')}>
                    <MaterialIcons name="offline-pin" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Offline Editing</Text>
                    <Text style={styles.featureDescription}>Work without internet</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('4KSupport')}>
                    <MaterialIcons name="high-quality" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>4K/8K Support</Text>
                    <Text style={styles.featureDescription}>High-resolution editing</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('PerformanceOptimization')}>
                    <MaterialIcons name="tune" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Performance Optimization</Text>
                    <Text style={styles.featureDescription}>Speed up your workflow</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCommunityTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Community Platform</Text>
            <Text style={styles.tabDescription}>
                Connect with other creators and grow together
            </Text>

            <View style={styles.featureGrid}>
                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('WeeklyChallenges')}>
                    <MaterialIcons name="emoji-events" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Weekly Challenges</Text>
                    <Text style={styles.featureDescription}>Compete & win prizes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('Mentorship')}>
                    <MaterialIcons name="school" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Mentorship</Text>
                    <Text style={styles.featureDescription}>Learn from experts</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('ResourceLibrary')}>
                    <MaterialIcons name="library-books" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Resource Library</Text>
                    <Text style={styles.featureDescription}>Free assets & tools</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('CreatorSpotlight')}>
                    <MaterialIcons name="star" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Creator Spotlight</Text>
                    <Text style={styles.featureDescription}>Featured creators</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('FeatureRequests')}>
                    <MaterialIcons name="feedback" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Feature Requests</Text>
                    <Text style={styles.featureDescription}>Vote on new features</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('CommunityHub')}>
                    <MaterialIcons name="forum" size={24} color={KingdomColors.primary} />
                    <Text style={styles.featureTitle}>Community Hub</Text>
                    <Text style={styles.featureDescription}>Connect & collaborate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const tabs = [
        { id: 'editor', title: 'Editor', icon: 'edit' },
        { id: 'ai', title: 'AI Tools', icon: 'psychology' },
        { id: 'collaboration', title: 'Collaborate', icon: 'group' },
        { id: 'faith', title: 'Faith', icon: 'favorite' },
        { id: 'social', title: 'Social', icon: 'share' },
        { id: 'analytics', title: 'Analytics', icon: 'analytics' },
        { id: 'monetization', title: 'Monetize', icon: 'attach-money' },
        { id: 'performance', title: 'Performance', icon: 'speed' },
        { id: 'community', title: 'Community', icon: 'people' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={isFaithMode ? [KingdomColors.faithPrimary, KingdomColors.faithSecondary] : [KingdomColors.primary, KingdomColors.secondary]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Kingdom Clips</Text>
                    <Text style={styles.headerSubtitle}>
                        {isFaithMode ? 'Faith-Powered Video Creation' : 'Professional Video Editing'}
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.tabBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                            onPress={() => setActiveTab(tab.id)}
                        >
                            <MaterialIcons
                                name={tab.icon as any}
                                size={20}
                                color={activeTab === tab.id ? KingdomColors.white : KingdomColors.text}
                            />
                            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                                {tab.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {renderTabContent()}
            </ScrollView>

            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <MaterialIcons name="hourglass-empty" size={40} color={KingdomColors.white} />
                    <Text style={styles.loadingText}>Loading Kingdom Clips...</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.background,
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    headerContent: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: KingdomColors.white,
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: KingdomColors.white,
        opacity: 0.9,
    },
    tabBar: {
        backgroundColor: KingdomColors.white,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.border,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 4,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: KingdomColors.primary,
    },
    tabText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        color: KingdomColors.text,
    },
    activeTabText: {
        color: KingdomColors.white,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    tabContent: {
        marginBottom: 20,
    },
    tabTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: KingdomColors.text,
        marginBottom: 8,
    },
    tabDescription: {
        fontSize: 16,
        color: KingdomColors.textSecondary,
        marginBottom: 20,
        lineHeight: 24,
    },
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureCard: {
        width: (width - 60) / 2,
        backgroundColor: KingdomColors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: KingdomColors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: KingdomColors.text,
        marginTop: 8,
        marginBottom: 4,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 12,
        color: KingdomColors.textSecondary,
        textAlign: 'center',
        lineHeight: 16,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        color: KingdomColors.white,
        fontSize: 16,
        marginTop: 10,
    },
}); 