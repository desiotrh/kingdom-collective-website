/**
 * 🚀 Enhanced Features Screen - Ultimate Integration
 * All Phase 3 enhancements with tier-based access, faith mode, and guest limitations
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors } from '../constants/KingdomColors';

// Import all enhancement services
import { aiContentStudio2Service } from '../services/AIContentStudio2Service';
import { advancedCommunityService } from '../services/AdvancedCommunityService';
import { enterpriseFeaturesService } from '../services/EnterpriseFeaturesService';
import { advancedAnalyticsService } from '../services/advancedAnalyticsService';
import { mobileFirstService } from '../services/MobileFirstService';
import { advancedMonetizationService } from '../services/AdvancedMonetizationService';
import { securityComplianceService } from '../services/SecurityComplianceService';
import { integrationEcosystemService } from '../services/IntegrationEcosystemService';
import { advancedAIFeaturesService } from '../services/AdvancedAIFeaturesService';
import { performanceScalabilityService } from '../services/PerformanceScalabilityService';

const { width } = Dimensions.get('window');

interface EnhancementCategory {
    id: string;
    title: string;
    description: string;
    icon: string;
    tier: 'free' | 'pro' | 'enterprise';
    faithMode: boolean;
    services: EnhancementService[];
}

interface EnhancementService {
    id: string;
    name: string;
    description: string;
    status: 'available' | 'loading' | 'unavailable';
    tier: 'free' | 'pro' | 'enterprise';
    faithMode: boolean;
}

const EnhancedFeaturesScreen: React.FC = () => {
    const { user, isGuest } = useAuth();
    const { isFaithMode } = useFaithMode();
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [enhancementCategories, setEnhancementCategories] = useState<EnhancementCategory[]>([]);

    useEffect(() => {
        initializeEnhancements();
    }, [user, isFaithMode]);

    const initializeEnhancements = async () => {
        try {
            setLoading(true);

            // Set current user for all services
            const userId = user?.uid || 'guest';
            aiContentStudio2Service.setCurrentUser(userId);
            advancedCommunityService.setCurrentUser(userId);
            enterpriseFeaturesService.setCurrentUser(userId);
            advancedAnalyticsService.setCurrentUser(userId);
            mobileFirstService.setCurrentUser(userId);
            advancedMonetizationService.setCurrentUser(userId);
            securityComplianceService.setCurrentUser(userId);
            integrationEcosystemService.setCurrentUser(userId);
            advancedAIFeaturesService.setCurrentUser(userId);
            performanceScalabilityService.setCurrentUser(userId);

            // Initialize enhancement categories
            const categories: EnhancementCategory[] = [
                {
                    id: 'ai-image-studio',
                    title: 'AI Image Studio',
                    description: 'Fal.ai style image generation with faith-based content creation',
                    icon: '🎨',
                    tier: 'pro',
                    faithMode: true,
                    services: [
                        {
                            id: 'image-generation',
                            name: 'AI Image Generation',
                            description: 'Create stunning visuals with AI-powered image generation',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'avatar-creator',
                            name: 'Avatar Creator',
                            description: 'Generate realistic AI avatars and digital twins',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'faith-inspired-visuals',
                            name: 'Faith-Inspired Visuals',
                            description: 'Create prophetic and faith-based visual content',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                    ],
                },
                {
                    id: 'video-studio-recorder',
                    title: 'Video Studio Recorder',
                    description: 'Riverside.fm style recording with multi-guest support',
                    icon: '🎬',
                    tier: 'pro',
                    faithMode: true,
                    services: [
                        {
                            id: 'multi-guest-recording',
                            name: 'Multi-Guest Recording',
                            description: 'Record podcasts and interviews with multiple participants',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'studio-quality-audio',
                            name: 'Studio Quality Audio',
                            description: 'Professional audio recording with noise reduction',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'auto-transcription',
                            name: 'Auto Transcription',
                            description: 'Automatic speech-to-text conversion',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                    ],
                },
                {
                    id: 'ai-studio-2',
                    title: 'AI Content Studio 2.0',
                    description: 'Real-time optimization, multi-modal generation, contextual AI',
                    icon: '🎨',
                    tier: 'pro',
                    faithMode: true,
                    services: [
                        {
                            id: 'real-time-optimization',
                            name: 'Real-Time Content Optimization',
                            description: 'AI-powered content improvement suggestions',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'multi-modal-generation',
                            name: 'Multi-Modal AI Generation',
                            description: 'Text, image, video, and audio content creation',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'contextual-ai-assistant',
                            name: 'Contextual AI Assistant',
                            description: 'Personalized AI guidance for content creation',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'predictive-scoring',
                            name: 'Predictive Content Scoring',
                            description: 'AI-powered content performance predictions',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'ai-ab-testing',
                            name: 'AI-Powered A/B Testing',
                            description: 'Automated content optimization testing',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: true,
                        },
                    ],
                },
                {
                    id: 'advanced-community',
                    title: 'Advanced Community & Social',
                    description: 'Live streaming, challenges, mentorship, prayer network',
                    icon: '🌟',
                    tier: 'pro',
                    faithMode: true,
                    services: [
                        {
                            id: 'live-streaming',
                            name: 'Live Streaming Integration',
                            description: 'Real-time faith-based content streaming',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'community-challenges',
                            name: 'Community Challenges',
                            description: 'Faith-based community engagement activities',
                            status: 'available',
                            tier: 'free',
                            faithMode: true,
                        },
                        {
                            id: 'mentorship-marketplace',
                            name: 'Mentorship Marketplace',
                            description: 'Connect with faith-based mentors',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'prayer-network',
                            name: 'Prayer Network',
                            description: 'Community prayer request and support system',
                            status: 'available',
                            tier: 'free',
                            faithMode: true,
                        },
                    ],
                },
                {
                    id: 'enterprise-features',
                    title: 'Enterprise-Level Features',
                    description: 'Church management, non-profit tools, educational platform',
                    icon: '🏢',
                    tier: 'enterprise',
                    faithMode: true,
                    services: [
                        {
                            id: 'church-management',
                            name: 'Church Management Integration',
                            description: 'Complete church administration system',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: true,
                        },
                        {
                            id: 'non-profit-tools',
                            name: 'Non-Profit Tools',
                            description: 'Tools for faith-based organizations',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: true,
                        },
                        {
                            id: 'educational-platform',
                            name: 'Educational Platform',
                            description: 'Faith-based learning management system',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: true,
                        },
                        {
                            id: 'donation-tithing',
                            name: 'Donation & Tithing Integration',
                            description: 'Secure giving and financial management',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: true,
                        },
                    ],
                },
                {
                    id: 'advanced-analytics',
                    title: 'Advanced Analytics & Insights',
                    description: 'Spiritual growth, community impact, predictive insights',
                    icon: '📊',
                    tier: 'pro',
                    faithMode: true,
                    services: [
                        {
                            id: 'spiritual-growth-analytics',
                            name: 'Spiritual Growth Analytics',
                            description: 'Track and analyze spiritual development',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'community-impact-metrics',
                            name: 'Community Impact Metrics',
                            description: 'Measure community engagement and impact',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'predictive-audience-insights',
                            name: 'Predictive Audience Insights',
                            description: 'AI-powered audience behavior predictions',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: true,
                        },
                        {
                            id: 'competitive-intelligence',
                            name: 'Competitive Intelligence',
                            description: 'Market analysis and competitive insights',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: true,
                        },
                        {
                            id: 'roi-attribution',
                            name: 'ROI Attribution',
                            description: 'Track return on investment for all activities',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: true,
                        },
                    ],
                },
                {
                    id: 'mobile-first',
                    title: 'Mobile-First Enhancements',
                    description: 'Offline-first, PWA, advanced camera, voice controls',
                    icon: '📱',
                    tier: 'pro',
                    faithMode: false,
                    services: [
                        {
                            id: 'offline-first',
                            name: 'Offline-First Architecture',
                            description: 'Work seamlessly without internet connection',
                            status: 'available',
                            tier: 'pro',
                            faithMode: false,
                        },
                        {
                            id: 'pwa-support',
                            name: 'PWA Support',
                            description: 'Progressive Web App capabilities',
                            status: 'available',
                            tier: 'pro',
                            faithMode: false,
                        },
                        {
                            id: 'advanced-camera',
                            name: 'Advanced Camera Integration',
                            description: 'Faith-optimized camera features',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'voice-to-content',
                            name: 'Voice-to-Content',
                            description: 'Convert speech to faith-based content',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'gesture-controls',
                            name: 'Gesture Controls',
                            description: 'Faith-inspired gesture navigation',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                    ],
                },
                {
                    id: 'advanced-monetization',
                    title: 'Advanced Monetization',
                    description: 'Digital marketplace, subscriptions, affiliate network',
                    icon: '💰',
                    tier: 'pro',
                    faithMode: false,
                    services: [
                        {
                            id: 'digital-marketplace',
                            name: 'Digital Product Marketplace',
                            description: 'Sell faith-based digital products',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'subscription-management',
                            name: 'Subscription Management',
                            description: 'Manage recurring payments and memberships',
                            status: 'available',
                            tier: 'pro',
                            faithMode: false,
                        },
                        {
                            id: 'affiliate-network',
                            name: 'Affiliate Network',
                            description: 'Faith-based affiliate marketing system',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'crowdfunding',
                            name: 'Crowdfunding Integration',
                            description: 'Faith-based fundraising campaigns',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'merchandise-platform',
                            name: 'Merchandise Platform',
                            description: 'Sell faith-inspired merchandise',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                    ],
                },
                {
                    id: 'security-compliance',
                    title: 'Security & Compliance',
                    description: 'Data protection, content moderation, privacy controls',
                    icon: '🔒',
                    tier: 'enterprise',
                    faithMode: false,
                    services: [
                        {
                            id: 'advanced-data-protection',
                            name: 'Advanced Data Protection',
                            description: 'Enterprise-grade data security',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: false,
                        },
                        {
                            id: 'content-moderation-ai',
                            name: 'Content Moderation AI',
                            description: 'AI-powered content safety with faith focus',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'privacy-controls',
                            name: 'Privacy Controls',
                            description: 'Granular privacy and data control',
                            status: 'available',
                            tier: 'pro',
                            faithMode: false,
                        },
                        {
                            id: 'audit-trails',
                            name: 'Audit Trails',
                            description: 'Complete activity tracking and logging',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: false,
                        },
                        {
                            id: 'secure-collaboration',
                            name: 'Secure Collaboration',
                            description: 'Encrypted team collaboration tools',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: false,
                        },
                    ],
                },
                {
                    id: 'integration-ecosystem',
                    title: 'Integration Ecosystem',
                    description: 'Bible study, worship music, calendar, email, CRM',
                    icon: '🔗',
                    tier: 'pro',
                    faithMode: true,
                    services: [
                        {
                            id: 'bible-study-tools',
                            name: 'Bible Study Tools',
                            description: 'Comprehensive Bible study and devotionals',
                            status: 'available',
                            tier: 'free',
                            faithMode: true,
                        },
                        {
                            id: 'worship-music-library',
                            name: 'Worship Music Library',
                            description: 'Extensive faith-based music collection',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'calendar-integration',
                            name: 'Calendar Integration',
                            description: 'Faith event scheduling and management',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'email-marketing',
                            name: 'Email Marketing Integration',
                            description: 'Faith-focused email campaigns',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'crm-integration',
                            name: 'CRM Integration',
                            description: 'Faith-based customer relationship management',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: true,
                        },
                    ],
                },
                {
                    id: 'advanced-ai-features',
                    title: 'Advanced AI Features',
                    description: 'Personal AI coach, voice cloning, translation, accessibility',
                    icon: '🤖',
                    tier: 'enterprise',
                    faithMode: true,
                    services: [
                        {
                            id: 'personal-ai-coach',
                            name: 'Personal AI Coach',
                            description: 'Faith-based AI mentoring and guidance',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'voice-cloning-ethics',
                            name: 'Voice Cloning with Ethics',
                            description: 'Ethical voice replication for accessibility',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: true,
                        },
                        {
                            id: 'content-translation',
                            name: 'Content Translation',
                            description: 'Multi-language faith content translation',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'accessibility-ai',
                            name: 'Accessibility AI',
                            description: 'AI-powered accessibility features',
                            status: 'available',
                            tier: 'pro',
                            faithMode: false,
                        },
                        {
                            id: 'emotion-detection',
                            name: 'Emotion Detection',
                            description: 'AI emotion analysis for content optimization',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: true,
                        },
                    ],
                },
                {
                    id: 'performance-scalability',
                    title: 'Performance & Scalability',
                    description: 'Edge computing, real-time collaboration, caching, load balancing',
                    icon: '⚡',
                    tier: 'enterprise',
                    faithMode: false,
                    services: [
                        {
                            id: 'edge-computing',
                            name: 'Edge Computing Support',
                            description: 'Global edge network for optimal performance',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: false,
                        },
                        {
                            id: 'real-time-collaboration',
                            name: 'Real-Time Collaboration',
                            description: 'Live collaborative content creation',
                            status: 'available',
                            tier: 'pro',
                            faithMode: true,
                        },
                        {
                            id: 'advanced-caching',
                            name: 'Advanced Caching',
                            description: 'Intelligent content caching system',
                            status: 'available',
                            tier: 'pro',
                            faithMode: false,
                        },
                        {
                            id: 'intelligent-load-balancing',
                            name: 'Intelligent Load Balancing',
                            description: 'Tier-based load distribution',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: false,
                        },
                        {
                            id: 'disaster-recovery',
                            name: 'Disaster Recovery Systems',
                            description: 'Enterprise-grade backup and recovery',
                            status: 'available',
                            tier: 'enterprise',
                            faithMode: false,
                        },
                    ],
                },
            ];

            setEnhancementCategories(categories);
        } catch (error) {
            console.error('Initialize enhancements error:', error);
            Alert.alert('Error', 'Failed to load enhanced features');
        } finally {
            setLoading(false);
        }
    };

    const getUserTier = (): 'free' | 'pro' | 'enterprise' => {
        if (isGuest) return 'free';
        return user?.tier || 'free';
    };

    const canAccessService = (service: EnhancementService): boolean => {
        const userTier = getUserTier();
        const tierOrder = { free: 0, pro: 1, enterprise: 2 };

        // Check tier access
        if (tierOrder[userTier] < tierOrder[service.tier]) {
            return false;
        }

        // Check faith mode requirement
        if (service.faithMode && !isFaithMode) {
            return false;
        }

        return true;
    };

    const handleServicePress = (service: EnhancementService) => {
        if (!canAccessService(service)) {
            if (isGuest) {
                Alert.alert(
                    'Guest Access Limited',
                    'Please sign in to access this feature.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Sign In', onPress: () => {/* Navigate to sign in */ } }
                    ]
                );
            } else {
                Alert.alert(
                    'Upgrade Required',
                    `This feature requires ${service.tier} tier. Please upgrade your account.`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Upgrade', onPress: () => {/* Navigate to upgrade */ } }
                    ]
                );
            }
            return;
        }

        // Handle different service types
        switch (service.id) {
            case 'image-generation':
                // Navigate to AI Image Studio
                Alert.alert('AI Image Studio', 'Opening AI Image Studio...', [
                    { text: 'OK', onPress: () => {/* Navigate to AIImageStudioScreen */ } }
                ]);
                break;
            case 'avatar-creator':
                // Navigate to Avatar Creator
                Alert.alert('Avatar Creator', 'Opening Avatar Creator...', [
                    { text: 'OK', onPress: () => {/* Navigate to AvatarCreatorScreen */ } }
                ]);
                break;
            case 'faith-inspired-visuals':
                // Navigate to AI Image Studio with faith mode
                Alert.alert('Faith-Inspired Visuals', 'Opening AI Image Studio with faith mode...', [
                    { text: 'OK', onPress: () => {/* Navigate to AIImageStudioScreen with faith mode */ } }
                ]);
                break;
            case 'multi-guest-recording':
            case 'studio-quality-audio':
            case 'auto-transcription':
                // Navigate to Video Studio Recorder
                Alert.alert('Video Studio Recorder', 'Opening Video Studio Recorder...', [
                    { text: 'OK', onPress: () => {/* Navigate to VideoStudioRecorderScreen */ } }
                ]);
                break;
            default:
                Alert.alert(
                    'Feature Activated',
                    `${service.name} is now available for use.`,
                    [{ text: 'OK' }]
                );
        }
    };

    const renderServiceCard = (service: EnhancementService) => {
        const canAccess = canAccessService(service);
        const isGuestLimited = isGuest && service.tier !== 'free';

        return (
            <TouchableOpacity
                key={service.id}
                style={[
                    styles.serviceCard,
                    !canAccess && styles.serviceCardDisabled,
                    isGuestLimited && styles.serviceCardGuestLimited,
                ]}
                onPress={() => handleServicePress(service)}
                disabled={!canAccess}
            >
                <View style={styles.serviceHeader}>
                    <Text style={[
                        styles.serviceName,
                        !canAccess && styles.serviceNameDisabled,
                    ]}>
                        {service.name}
                    </Text>
                    {service.faithMode && (
                        <View style={styles.faithModeBadge}>
                            <Text style={styles.faithModeText}>Faith</Text>
                        </View>
                    )}
                </View>

                <Text style={[
                    styles.serviceDescription,
                    !canAccess && styles.serviceDescriptionDisabled,
                ]}>
                    {service.description}
                </Text>

                <View style={styles.serviceFooter}>
                    <View style={[styles.tierBadge, styles[`tier${service.tier}`]]}>
                        <Text style={styles.tierText}>{service.tier.toUpperCase()}</Text>
                    </View>

                    {!canAccess && (
                        <View style={styles.accessBadge}>
                            <Text style={styles.accessText}>
                                {isGuest ? 'Sign In Required' : 'Upgrade Required'}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderCategory = (category: EnhancementCategory) => {
        const canAccessCategory = getUserTier() === 'enterprise' ||
            (getUserTier() === 'pro' && category.tier !== 'enterprise') ||
            (getUserTier() === 'free' && category.tier === 'free');

        return (
            <View key={category.id} style={styles.categoryContainer}>
                <TouchableOpacity
                    style={[
                        styles.categoryHeader,
                        !canAccessCategory && styles.categoryHeaderDisabled,
                    ]}
                    onPress={() => setSelectedCategory(
                        selectedCategory === category.id ? null : category.id
                    )}
                >
                    <View style={styles.categoryTitleContainer}>
                        <Text style={styles.categoryIcon}>{category.icon}</Text>
                        <View style={styles.categoryTextContainer}>
                            <Text style={[
                                styles.categoryTitle,
                                !canAccessCategory && styles.categoryTitleDisabled,
                            ]}>
                                {category.title}
                            </Text>
                            <Text style={[
                                styles.categoryDescription,
                                !canAccessCategory && styles.categoryDescriptionDisabled,
                            ]}>
                                {category.description}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.categoryBadges}>
                        {category.faithMode && (
                            <View style={styles.faithModeBadge}>
                                <Text style={styles.faithModeText}>Faith</Text>
                            </View>
                        )}
                        <View style={[styles.tierBadge, styles[`tier${category.tier}`]]}>
                            <Text style={styles.tierText}>{category.tier.toUpperCase()}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {selectedCategory === category.id && canAccessCategory && (
                    <View style={styles.servicesContainer}>
                        {category.services.map(renderServiceCard)}
                    </View>
                )}

                {!canAccessCategory && (
                    <View style={styles.upgradePrompt}>
                        <Text style={styles.upgradeText}>
                            {isGuest
                                ? 'Sign in to access this category'
                                : `Upgrade to ${category.tier} tier to access this category`
                            }
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={KingdomColors.primary} />
                    <Text style={styles.loadingText}>Loading Enhanced Features...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🚀 Enhanced Features</Text>
                <Text style={styles.subtitle}>
                    {isGuest ? 'Guest Mode - Limited Access' : `${getUserTier().toUpperCase()} Tier`}
                </Text>
                {isFaithMode && (
                    <View style={styles.faithModeContainer}>
                        <Text style={styles.faithModeLabel}>Faith Mode Active</Text>
                    </View>
                )}
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.categoriesContainer}>
                    {enhancementCategories.map(renderCategory)}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        All features include tier-based access control and Faith Mode support
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: KingdomColors.text,
    },
    header: {
        padding: 20,
        backgroundColor: KingdomColors.surface,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.border,
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
        marginBottom: 8,
    },
    faithModeContainer: {
        backgroundColor: KingdomColors.faith,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    faithModeLabel: {
        color: KingdomColors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    categoriesContainer: {
        padding: 20,
    },
    categoryContainer: {
        marginBottom: 24,
        backgroundColor: KingdomColors.surface,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    categoryHeader: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryHeaderDisabled: {
        opacity: 0.6,
    },
    categoryTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    categoryTextContainer: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.text,
        marginBottom: 4,
    },
    categoryTitleDisabled: {
        color: KingdomColors.textSecondary,
    },
    categoryDescription: {
        fontSize: 14,
        color: KingdomColors.textSecondary,
    },
    categoryDescriptionDisabled: {
        color: KingdomColors.textTertiary,
    },
    categoryBadges: {
        flexDirection: 'row',
        gap: 8,
    },
    servicesContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    serviceCard: {
        backgroundColor: KingdomColors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: KingdomColors.border,
    },
    serviceCardDisabled: {
        opacity: 0.6,
    },
    serviceCardGuestLimited: {
        borderColor: KingdomColors.warning,
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: KingdomColors.text,
        flex: 1,
    },
    serviceNameDisabled: {
        color: KingdomColors.textSecondary,
    },
    serviceDescription: {
        fontSize: 14,
        color: KingdomColors.textSecondary,
        marginBottom: 12,
        lineHeight: 20,
    },
    serviceDescriptionDisabled: {
        color: KingdomColors.textTertiary,
    },
    serviceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tierBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tierfree: {
        backgroundColor: KingdomColors.success,
    },
    tierpro: {
        backgroundColor: KingdomColors.primary,
    },
    tierenterprise: {
        backgroundColor: KingdomColors.premium,
    },
    tierText: {
        color: KingdomColors.white,
        fontSize: 10,
        fontWeight: '600',
    },
    faithModeBadge: {
        backgroundColor: KingdomColors.faith,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    faithModeText: {
        color: KingdomColors.white,
        fontSize: 10,
        fontWeight: '600',
    },
    accessBadge: {
        backgroundColor: KingdomColors.warning,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    accessText: {
        color: KingdomColors.white,
        fontSize: 10,
        fontWeight: '600',
    },
    upgradePrompt: {
        padding: 20,
        alignItems: 'center',
    },
    upgradeText: {
        fontSize: 14,
        color: KingdomColors.textSecondary,
        textAlign: 'center',
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: KingdomColors.textTertiary,
        textAlign: 'center',
    },
});

export default EnhancedFeaturesScreen; 