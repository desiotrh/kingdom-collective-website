import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/UnifiedAuthContext';
import { useDualMode } from '../../contexts/DualModeContext';
import { KingdomColors } from '../../constants/KingdomColors';
import { liveStreamingService } from '../../services/kingdomCircle/LiveStreamingService';
import { mentorshipService } from '../../services/kingdomCircle/MentorshipService';
import { eventPlanningService } from '../../services/kingdomCircle/EventPlanningService';
import { anonymousSupportService } from '../../services/kingdomCircle/AnonymousSupportService';
import { groupLibraryService } from '../../services/kingdomCircle/GroupLibraryService';
import { aiCommunityService } from '../../services/kingdomCircle/AICommunityService';
import { faithModeService } from '../../services/kingdomCircle/FaithModeService';
import { monetizationService } from '../../services/kingdomCircle/MonetizationService';

const { width } = Dimensions.get('window');

interface TabData {
    id: string;
    title: string;
    icon: string;
    badge?: number;
    disabled?: boolean;
}

const KingdomCircleScreen: React.FC = () => {
    const { user, userTier } = useAuth();
    const { isFaithMode } = useDualMode();
    const [activeTab, setActiveTab] = useState('live-streaming');
    const [refreshing, setRefreshing] = useState(false);
    const [liveStreams, setLiveStreams] = useState<any[]>([]);
    const [mentorshipMatches, setMentorshipMatches] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [prayerRequests, setPrayerRequests] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
    const [faithFeatures, setFaithFeatures] = useState<any[]>([]);
    const [monetizationData, setMonetizationData] = useState<any>({});

    const tabs: TabData[] = [
        {
            id: 'live-streaming',
            title: 'Live Streaming',
            icon: '📺',
            badge: liveStreams.filter(s => s.status === 'live').length,
        },
        {
            id: 'mentorship',
            title: 'Mentorship',
            icon: '🤝',
            badge: mentorshipMatches.filter(m => m.status === 'active').length,
        },
        {
            id: 'events',
            title: 'Events',
            icon: '📅',
            badge: events.filter(e => e.status === 'published').length,
        },
        {
            id: 'prayer-support',
            title: 'Prayer & Support',
            icon: '🙏',
            badge: prayerRequests.filter(p => p.status === 'pending').length,
        },
        {
            id: 'resources',
            title: 'Resources',
            icon: '📚',
        },
        {
            id: 'ai-tools',
            title: 'AI Tools',
            icon: '🤖',
            disabled: userTier === 'guest',
        },
        {
            id: 'faith-features',
            title: 'Faith Features',
            icon: '✝️',
            disabled: !isFaithMode,
        },
        {
            id: 'monetization',
            title: 'Monetization',
            icon: '💰',
            disabled: userTier === 'guest',
        },
    ];

    useEffect(() => {
        loadData();
    }, [user, isFaithMode]);

    const loadData = async () => {
        try {
            // Load live streams
            const streams = await liveStreamingService.getActiveStreams(undefined, isFaithMode);
            setLiveStreams(streams);

            // Load mentorship data
            if (user) {
                const mentorDashboard = await mentorshipService.getMentorDashboard(user.id);
                const menteeDashboard = await mentorshipService.getMenteeDashboard(user.id);
                setMentorshipMatches([...mentorDashboard.activeMatches, ...menteeDashboard.activeMatches]);
            }

            // Load events
            const groupEvents = await eventPlanningService.searchEvents({
                faithMode: isFaithMode,
                isPublic: true,
            });
            setEvents(groupEvents);

            // Load prayer requests
            const requests = await anonymousSupportService.getPrayerRequests({
                faithMode: isFaithMode,
                isPublic: true,
            });
            setPrayerRequests(requests);

            // Load resources
            const groupResources = await groupLibraryService.getGroupResources('group_1', {
                faithMode: isFaithMode,
                isPublic: true,
            });
            setResources(groupResources);

            // Load AI suggestions
            if (userTier !== 'guest') {
                const suggestions = await aiCommunityService.generateContentSuggestions('group_1', 'Community engagement', isFaithMode);
                setAiSuggestions(suggestions);
            }

            // Load faith features
            if (isFaithMode) {
                const challenges = await faithModeService.getActiveChallenges(true);
                const encouragements = await faithModeService.getPublicPropheticEncouragements();
                setFaithFeatures([...challenges, ...encouragements]);
            }

            // Load monetization data
            if (userTier !== 'guest' && user) {
                const analytics = await monetizationService.getRevenueAnalytics(user.id, 'monthly');
                setMonetizationData(analytics);
            }
        } catch (error) {
            console.error('Error loading Kingdom Circle data:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const renderLiveStreamingTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Live Streams</Text>
                {liveStreams.length > 0 ? (
                    liveStreams.map(stream => (
                        <View key={stream.id} style={styles.card}>
                            <Text style={styles.cardTitle}>{stream.title}</Text>
                            <Text style={styles.cardDescription}>{stream.description}</Text>
                            <View style={styles.cardMeta}>
                                <Text style={styles.metaText}>👤 {stream.hostName}</Text>
                                <Text style={styles.metaText}>👥 {stream.viewerCount} viewers</Text>
                                <Text style={styles.metaText}>
                                    {stream.status === 'live' ? '🔴 LIVE' : '⏰ Scheduled'}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.buttonText}>
                                    {stream.status === 'live' ? 'Join Stream' : 'Set Reminder'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No active streams</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Scheduled Streams</Text>
                <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createButtonText}>+ Create New Stream</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderMentorshipTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Active Mentorships</Text>
                {mentorshipMatches.length > 0 ? (
                    mentorshipMatches.map(match => (
                        <View key={match.id} style={styles.card}>
                            <Text style={styles.cardTitle}>Mentorship Match</Text>
                            <Text style={styles.cardDescription}>
                                Compatibility: {match.compatibilityScore}%
                            </Text>
                            <View style={styles.cardMeta}>
                                <Text style={styles.metaText}>Status: {match.status}</Text>
                                <Text style={styles.metaText}>
                                    Faith Mode: {match.faithMode ? 'Yes' : 'No'}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.buttonText}>View Details</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No active mentorships</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Find Mentors</Text>
                <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createButtonText}>+ Browse Mentors</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderEventsTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                {events.length > 0 ? (
                    events.map(event => (
                        <View key={event.id} style={styles.card}>
                            <Text style={styles.cardTitle}>{event.title}</Text>
                            <Text style={styles.cardDescription}>{event.description}</Text>
                            <View style={styles.cardMeta}>
                                <Text style={styles.metaText}>📅 {new Date(event.startTime).toLocaleDateString()}</Text>
                                <Text style={styles.metaText}>👥 {event.currentAttendees}/{event.maxAttendees}</Text>
                                <Text style={styles.metaText}>
                                    {event.faithMode ? '✝️ Faith Event' : '🌍 General Event'}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.buttonText}>RSVP</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No upcoming events</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Create Event</Text>
                <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createButtonText}>+ Create New Event</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderPrayerSupportTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Prayer Requests</Text>
                {prayerRequests.length > 0 ? (
                    prayerRequests.map(request => (
                        <View key={request.id} style={styles.card}>
                            <Text style={styles.cardTitle}>{request.title}</Text>
                            <Text style={styles.cardDescription}>{request.description}</Text>
                            <View style={styles.cardMeta}>
                                <Text style={styles.metaText}>Priority: {request.urgency}</Text>
                                <Text style={styles.metaText}>🙏 {request.prayerCount} prayers</Text>
                                <Text style={styles.metaText}>
                                    {request.isAnonymous ? 'Anonymous' : request.userName}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.buttonText}>Pray for This</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No prayer requests</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Submit Prayer Request</Text>
                <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createButtonText}>+ Submit Request</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderResourcesTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Group Resources</Text>
                {resources.length > 0 ? (
                    resources.map(resource => (
                        <View key={resource.id} style={styles.card}>
                            <Text style={styles.cardTitle}>{resource.title}</Text>
                            <Text style={styles.cardDescription}>{resource.description}</Text>
                            <View style={styles.cardMeta}>
                                <Text style={styles.metaText}>📁 {resource.type}</Text>
                                <Text style={styles.metaText}>👁️ {resource.viewCount} views</Text>
                                <Text style={styles.metaText}>⬇️ {resource.downloadCount} downloads</Text>
                            </View>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.buttonText}>View Resource</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No resources available</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upload Resource</Text>
                <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createButtonText}>+ Upload Resource</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderAIToolsTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Content Suggestions</Text>
                {aiSuggestions.length > 0 ? (
                    aiSuggestions.map(suggestion => (
                        <View key={suggestion.id} style={styles.card}>
                            <Text style={styles.cardTitle}>{suggestion.title}</Text>
                            <Text style={styles.cardDescription}>{suggestion.content}</Text>
                            <View style={styles.cardMeta}>
                                <Text style={styles.metaText}>Confidence: {suggestion.confidence * 100}%</Text>
                                <Text style={styles.metaText}>🎯 {suggestion.targetAudience}</Text>
                            </View>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.buttonText}>Use Suggestion</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No AI suggestions available</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Tools</Text>
                <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createButtonText}>+ Generate Content</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderFaithFeaturesTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Devotional Challenges</Text>
                {faithFeatures.filter(f => f.type === 'daily-prayer').map(challenge => (
                    <View key={challenge.id} style={styles.card}>
                        <Text style={styles.cardTitle}>{challenge.title}</Text>
                        <Text style={styles.cardDescription}>{challenge.description}</Text>
                        <View style={styles.cardMeta}>
                            <Text style={styles.metaText}>⏱️ {challenge.duration} days</Text>
                            <Text style={styles.metaText}>👥 {challenge.currentParticipants} participants</Text>
                        </View>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.buttonText}>Join Challenge</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Prophetic Encouragement</Text>
                {faithFeatures.filter(f => f.type === 'ai-generated').map(encouragement => (
                    <View key={encouragement.id} style={styles.card}>
                        <Text style={styles.cardTitle}>Prophetic Word</Text>
                        <Text style={styles.cardDescription}>{encouragement.message}</Text>
                        <View style={styles.cardMeta}>
                            <Text style={styles.metaText}>Intensity: {encouragement.intensity}</Text>
                            <Text style={styles.metaText}>Category: {encouragement.category}</Text>
                        </View>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.buttonText}>Save Encouragement</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );

    const renderMonetizationTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Revenue Analytics</Text>
                {monetizationData.totalRevenue ? (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Monthly Overview</Text>
                        <View style={styles.analyticsGrid}>
                            <View style={styles.analyticsItem}>
                                <Text style={styles.analyticsValue}>${monetizationData.totalRevenue}</Text>
                                <Text style={styles.analyticsLabel}>Total Revenue</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={styles.analyticsValue}>{monetizationData.totalTransactions}</Text>
                                <Text style={styles.analyticsLabel}>Transactions</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={styles.analyticsValue}>${monetizationData.averageTransactionValue}</Text>
                                <Text style={styles.analyticsLabel}>Avg. Transaction</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={styles.analyticsValue}>{monetizationData.faithModePercentage}%</Text>
                                <Text style={styles.analyticsLabel}>Faith Mode</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.emptyText}>No revenue data available</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Monetization Tools</Text>
                <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createButtonText}>+ Create Service</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createButtonText}>+ Create Donation Button</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'live-streaming':
                return renderLiveStreamingTab();
            case 'mentorship':
                return renderMentorshipTab();
            case 'events':
                return renderEventsTab();
            case 'prayer-support':
                return renderPrayerSupportTab();
            case 'resources':
                return renderResourcesTab();
            case 'ai-tools':
                return renderAIToolsTab();
            case 'faith-features':
                return renderFaithFeaturesTab();
            case 'monetization':
                return renderMonetizationTab();
            default:
                return renderLiveStreamingTab();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Kingdom Circle</Text>
                <Text style={styles.subtitle}>
                    {isFaithMode ? 'Faith-Integrated Community Platform' : 'Community Platform'}
                </Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabBar}
                contentContainerStyle={styles.tabBarContent}
            >
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[
                            styles.tab,
                            activeTab === tab.id && styles.activeTab,
                            tab.disabled && styles.disabledTab,
                        ]}
                        onPress={() => !tab.disabled && setActiveTab(tab.id)}
                        disabled={tab.disabled}
                    >
                        <Text style={styles.tabIcon}>{tab.icon}</Text>
                        <Text style={[
                            styles.tabTitle,
                            activeTab === tab.id && styles.activeTabTitle,
                            tab.disabled && styles.disabledTabTitle,
                        ]}>
                            {tab.title}
                        </Text>
                        {tab.badge && tab.badge > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{tab.badge}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {renderTabContent()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.background,
    },
    header: {
        padding: 20,
        backgroundColor: KingdomColors.primary,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: KingdomColors.white,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: KingdomColors.white,
        textAlign: 'center',
        marginTop: 5,
        opacity: 0.9,
    },
    tabBar: {
        backgroundColor: KingdomColors.white,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.lightGray,
    },
    tabBarContent: {
        paddingHorizontal: 15,
    },
    tab: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: KingdomColors.lightGray,
        minWidth: 100,
    },
    activeTab: {
        backgroundColor: KingdomColors.primary,
    },
    disabledTab: {
        opacity: 0.5,
    },
    tabIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    tabTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: KingdomColors.darkGray,
        textAlign: 'center',
    },
    activeTabTitle: {
        color: KingdomColors.white,
    },
    disabledTabTitle: {
        color: KingdomColors.gray,
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: KingdomColors.accent,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: KingdomColors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    tabContent: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.darkGray,
        marginBottom: 15,
    },
    card: {
        backgroundColor: KingdomColors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: KingdomColors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.darkGray,
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: KingdomColors.gray,
        marginBottom: 12,
        lineHeight: 20,
    },
    cardMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    metaText: {
        fontSize: 12,
        color: KingdomColors.gray,
        marginRight: 12,
        marginBottom: 4,
    },
    actionButton: {
        backgroundColor: KingdomColors.primary,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    createButton: {
        backgroundColor: KingdomColors.accent,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    createButtonText: {
        color: KingdomColors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    emptyText: {
        fontSize: 16,
        color: KingdomColors.gray,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 20,
    },
    analyticsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    analyticsItem: {
        width: '48%',
        alignItems: 'center',
        marginBottom: 16,
    },
    analyticsValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.primary,
        marginBottom: 4,
    },
    analyticsLabel: {
        fontSize: 12,
        color: KingdomColors.gray,
        textAlign: 'center',
    },
});

export default KingdomCircleScreen; 