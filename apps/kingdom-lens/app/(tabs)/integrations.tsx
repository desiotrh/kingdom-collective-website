import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Modal,
    TextInput,
    Alert,
    FlatList,
    Switch,
    Dimensions,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Integration {
    id: string;
    name: string;
    category: 'Church' | 'Wedding' | 'Real Estate' | 'Ministry';
    status: 'Connected' | 'Available' | 'Coming Soon';
    description: string;
    features: string[];
    apiKey?: string;
    lastSync?: string;
    ministryRelated?: boolean;
}

interface ChurchEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    type: 'Baptism' | 'Wedding' | 'Service' | 'Event';
    location: string;
    photographer: string;
    notes: string;
    ministryMode: boolean;
}

interface WeddingPlanner {
    id: string;
    coupleName: string;
    weddingDate: string;
    planner: string;
    venue: string;
    photographer: string;
    timeline: string[];
    notes: string;
    syncStatus: 'Synced' | 'Pending' | 'Error';
}

interface RealEstateProject {
    id: string;
    propertyAddress: string;
    propertyType: string;
    mlsNumber: string;
    photographer: string;
    shootDate: string;
    images: number;
    exportStatus: 'Ready' | 'Processing' | 'Completed';
}

export default function IntegrationsScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [activeTab, setActiveTab] = useState<'integrations' | 'church' | 'weddings' | 'realestate' | 'ministry'>('integrations');
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

    // Mock data
    const [integrations, setIntegrations] = useState<Integration[]>([
        {
            id: '1',
            name: 'Planning Center',
            category: 'Church',
            status: 'Connected',
            description: 'Sync church events and manage ministry photography',
            features: ['Event sync', 'Member directory', 'Calendar integration'],
            lastSync: '2024-01-20 14:30',
            ministryRelated: true
        },
        {
            id: '2',
            name: 'HoneyBook',
            category: 'Wedding',
            status: 'Connected',
            description: 'Wedding planning and client management',
            features: ['Client portal', 'Contract management', 'Payment processing'],
            lastSync: '2024-01-19 16:45',
            ministryRelated: false
        },
        {
            id: '3',
            name: 'Zola',
            category: 'Wedding',
            status: 'Available',
            description: 'Wedding registry and planning platform',
            features: ['Registry sync', 'Guest management', 'Timeline planning'],
            ministryRelated: false
        },
        {
            id: '4',
            name: 'MLS Export Tool',
            category: 'Real Estate',
            status: 'Connected',
            description: 'Export photos to MLS with proper formatting',
            features: ['Auto watermarking', 'Size optimization', 'Batch export'],
            lastSync: '2024-01-21 09:15',
            ministryRelated: false
        }
    ]);

    const [churchEvents, setChurchEvents] = useState<ChurchEvent[]>([
        {
            id: '1',
            title: 'Baptism Service',
            date: '2024-02-15',
            time: '10:00 AM',
            type: 'Baptism',
            location: 'Main Sanctuary',
            photographer: 'Sarah Grace',
            notes: 'Capture baptism moments and family reactions',
            ministryMode: true
        },
        {
            id: '2',
            title: 'Wedding Ceremony',
            date: '2024-03-20',
            time: '2:00 PM',
            type: 'Wedding',
            location: 'Garden Chapel',
            photographer: 'Michael Chen',
            notes: 'Christian wedding with prayer and worship',
            ministryMode: true
        }
    ]);

    const [weddingPlanners, setWeddingPlanners] = useState<WeddingPlanner[]>([
        {
            id: '1',
            coupleName: 'Sarah & John',
            weddingDate: '2024-06-15',
            planner: 'Elegant Events',
            venue: 'Botanical Gardens',
            photographer: 'Sarah Grace',
            timeline: ['2:00 PM - Ceremony', '3:30 PM - Photos', '5:00 PM - Reception'],
            notes: 'Christian ceremony with traditional elements',
            syncStatus: 'Synced'
        }
    ]);

    const [realEstateProjects, setRealEstateProjects] = useState<RealEstateProject[]>([
        {
            id: '1',
            propertyAddress: '123 Oak Street, Nashville, TN',
            propertyType: 'Single Family Home',
            mlsNumber: 'MLS123456',
            photographer: 'Michael Chen',
            shootDate: '2024-01-20',
            images: 45,
            exportStatus: 'Completed'
        },
        {
            id: '2',
            propertyAddress: '456 Pine Avenue, Nashville, TN',
            propertyType: 'Townhouse',
            mlsNumber: 'MLS789012',
            photographer: 'Michael Chen',
            shootDate: '2024-01-21',
            images: 38,
            exportStatus: 'Ready'
        }
    ]);

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Kingdom Integrations';
        } else if (encouragementMode) {
            return 'Platform Integrations';
        }
        return 'Integrations';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Connect your ministry with Kingdom tools';
        } else if (encouragementMode) {
            return 'Connect with your favorite platforms';
        }
        return 'Connect with external platforms';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Connected':
                return theme.colors.success;
            case 'Available':
                return theme.colors.info;
            case 'Coming Soon':
                return theme.colors.warning;
            default:
                return theme.colors.textSecondary;
        }
    };

    const renderIntegrationCard = ({ item }: { item: Integration }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={[styles.statusText, { color: theme.colors.surface }]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                {item.description}
            </Text>

            <View style={styles.categoryContainer}>
                <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary }]}>
                    <Text style={[styles.categoryText, { color: theme.colors.surface }]}>
                        {item.category}
                    </Text>
                </View>
                {item.ministryRelated && faithMode && (
                    <View style={[styles.ministryBadge, { backgroundColor: faithTheme.colors.primary }]}>
                        <Text style={[styles.ministryText, { color: faithTheme.colors.surface }]}>
                            ✨ Ministry
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.featuresContainer}>
                <Text style={[styles.featuresTitle, { color: theme.colors.text }]}>
                    🔧 Features:
                </Text>
                {item.features.map((feature, index) => (
                    <Text key={index} style={[styles.feature, { color: theme.colors.textSecondary }]}>
                        • {feature}
                    </Text>
                ))}
            </View>

            {item.lastSync && (
                <Text style={[styles.syncText, { color: theme.colors.textSecondary }]}>
                    🔄 Last sync: {item.lastSync}
                </Text>
            )}

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => {
                        setSelectedIntegration(item);
                        setShowConnectModal(true);
                    }}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        {item.status === 'Connected' ? 'Manage' : 'Connect'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('View Details', `Opening ${item.name} details...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Details
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderChurchEventCard = ({ item }: { item: ChurchEvent }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.title}
                </Text>
                <View style={[styles.eventTypeBadge, { backgroundColor: theme.colors.info }]}>
                    <Text style={[styles.eventTypeText, { color: theme.colors.surface }]}>
                        {item.type}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📅 {item.date} at {item.time}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📍 {item.location}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📸 {item.photographer}
            </Text>

            {item.notes && (
                <Text style={[styles.cardNotes, { color: theme.colors.textSecondary }]}>
                    📝 {item.notes}
                </Text>
            )}

            {faithMode && item.ministryMode && (
                <View style={styles.ministryModeContainer}>
                    <Text style={[styles.ministryModeTitle, { color: faithTheme.colors.primary }]}>
                        ✨ Ministry Mode Active
                    </Text>
                    <Text style={[styles.ministryModeText, { color: faithTheme.colors.textSecondary }]}>
                        Special overlays and settings for ministry photography
                    </Text>
                </View>
            )}

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('View Event', `Opening ${item.title}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Event
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Sync Calendar', `Syncing ${item.title} to calendar...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Sync Calendar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderWeddingPlannerCard = ({ item }: { item: WeddingPlanner }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.coupleName}
                </Text>
                <View style={[styles.syncBadge, { backgroundColor: getStatusColor(item.syncStatus) }]}>
                    <Text style={[styles.syncText, { color: theme.colors.surface }]}>
                        {item.syncStatus}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                💒 {item.weddingDate}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                👰 Planner: {item.planner}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📍 Venue: {item.venue}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📸 Photographer: {item.photographer}
            </Text>

            <View style={styles.timelineContainer}>
                <Text style={[styles.timelineTitle, { color: theme.colors.text }]}>
                    ⏰ Timeline:
                </Text>
                {item.timeline.map((event, index) => (
                    <Text key={index} style={[styles.timelineEvent, { color: theme.colors.textSecondary }]}>
                        • {event}
                    </Text>
                ))}
            </View>

            {item.notes && (
                <Text style={[styles.cardNotes, { color: theme.colors.textSecondary }]}>
                    📝 {item.notes}
                </Text>
            )}

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('View Details', `Opening ${item.coupleName} details...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Details
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Sync Timeline', `Syncing timeline for ${item.coupleName}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Sync Timeline
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderRealEstateCard = ({ item }: { item: RealEstateProject }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.propertyAddress}
                </Text>
                <View style={[styles.exportBadge, { backgroundColor: getStatusColor(item.exportStatus) }]}>
                    <Text style={[styles.exportText, { color: theme.colors.surface }]}>
                        {item.exportStatus}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                🏠 {item.propertyType}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                🏷️ MLS: {item.mlsNumber}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📸 {item.photographer}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📅 {item.shootDate}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                🖼️ {item.images} images
            </Text>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('View Project', `Opening ${item.propertyAddress}...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Project
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Export to MLS', `Exporting ${item.propertyAddress} to MLS...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Export to MLS
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderMinistryModeCard = () => (
        <View style={[styles.ministryCard, { backgroundColor: faithTheme.colors.surface }]}>
            <Text style={[styles.ministryCardTitle, { color: faithTheme.colors.text }]}>
                ✨ Ministry Mode
            </Text>
            <Text style={[styles.ministryCardSubtitle, { color: faithTheme.colors.textSecondary }]}>
                Special features for ministry photography
            </Text>

            <View style={styles.ministryFeatures}>
                <View style={styles.ministryFeature}>
                    <Text style={[styles.ministryFeatureTitle, { color: faithTheme.colors.primary }]}>
                        🎭 Ministry Overlays
                    </Text>
                    <Text style={[styles.ministryFeatureText, { color: faithTheme.colors.textSecondary }]}>
                        Special overlays for baptisms, church events, and ministry activities
                    </Text>
                </View>

                <View style={styles.ministryFeature}>
                    <Text style={[styles.ministryFeatureTitle, { color: faithTheme.colors.primary }]}>
                        📖 Scripture Integration
                    </Text>
                    <Text style={[styles.ministryFeatureText, { color: faithTheme.colors.textSecondary }]}>
                        Add scripture verses and ministry messages to photos
                    </Text>
                </View>

                <View style={styles.ministryFeature}>
                    <Text style={[styles.ministryFeatureTitle, { color: faithTheme.colors.primary }]}>
                        🙏 Prayer Tracking
                    </Text>
                    <Text style={[styles.ministryFeatureText, { color: faithTheme.colors.textSecondary }]}>
                        Track prayer requests and ministry impact
                    </Text>
                </View>

                <View style={styles.ministryFeature}>
                    <Text style={[styles.ministryFeatureTitle, { color: faithTheme.colors.primary }]}>
                        ⛪ Church Software Sync
                    </Text>
                    <Text style={[styles.ministryFeatureText, { color: faithTheme.colors.textSecondary }]}>
                        Integrate with Planning Center and other church management tools
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.ministryActionButton, { backgroundColor: faithTheme.colors.primary }]}
                onPress={() => Alert.alert('Enable Ministry Mode', 'Enabling special ministry features...')}
            >
                <Text style={[styles.ministryActionButtonText, { color: faithTheme.colors.surface }]}>
                    Enable Ministry Mode
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'integrations':
                return (
                    <FlatList
                        data={integrations}
                        renderItem={renderIntegrationCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'church':
                return (
                    <FlatList
                        data={churchEvents}
                        renderItem={renderChurchEventCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'weddings':
                return (
                    <FlatList
                        data={weddingPlanners}
                        renderItem={renderWeddingPlannerCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'realestate':
                return (
                    <FlatList
                        data={realEstateProjects}
                        renderItem={renderRealEstateCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'ministry':
                return faithMode ? (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
                        {renderMinistryModeCard()}
                    </ScrollView>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                            Ministry Mode is available in Faith Mode
                        </Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    {getScreenTitle()}
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    {getScreenSubtitle()}
                </Text>
            </View>

            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'integrations' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('integrations')}
                    >
                        <Text style={[styles.tabText, activeTab === 'integrations' && { color: theme.colors.surface }]}>
                            🔗 Integrations
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'church' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('church')}
                    >
                        <Text style={[styles.tabText, activeTab === 'church' && { color: theme.colors.surface }]}>
                            ⛪ Church
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'weddings' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('weddings')}
                    >
                        <Text style={[styles.tabText, activeTab === 'weddings' && { color: theme.colors.surface }]}>
                            💒 Weddings
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'realestate' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('realestate')}
                    >
                        <Text style={[styles.tabText, activeTab === 'realestate' && { color: theme.colors.surface }]}>
                            🏠 Real Estate
                        </Text>
                    </TouchableOpacity>
                    {faithMode && (
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'ministry' && { backgroundColor: faithTheme.colors.primary }]}
                            onPress={() => setActiveTab('ministry')}
                        >
                            <Text style={[styles.tabText, activeTab === 'ministry' && { color: faithTheme.colors.surface }]}>
                                ✨ Ministry
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

            <View style={styles.content}>
                {renderTabContent()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
    },
    tabContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    cardDescription: {
        fontSize: 14,
        marginBottom: 15,
        lineHeight: 20,
    },
    cardInfo: {
        fontSize: 14,
        marginBottom: 5,
    },
    cardNotes: {
        fontSize: 13,
        fontStyle: 'italic',
        marginBottom: 15,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    categoryContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
    },
    ministryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ministryText: {
        fontSize: 12,
        fontWeight: '600',
    },
    featuresContainer: {
        marginBottom: 15,
    },
    featuresTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    feature: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    syncText: {
        fontSize: 13,
        marginBottom: 15,
    },
    eventTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    eventTypeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    ministryModeContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
    },
    ministryModeTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ministryModeText: {
        fontSize: 13,
        lineHeight: 18,
    },
    timelineContainer: {
        marginBottom: 15,
    },
    timelineTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    timelineEvent: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    syncBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    exportBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    exportText: {
        fontSize: 12,
        fontWeight: '600',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    ministryCard: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    ministryCardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ministryCardSubtitle: {
        fontSize: 14,
        marginBottom: 20,
    },
    ministryFeatures: {
        marginBottom: 20,
    },
    ministryFeature: {
        marginBottom: 15,
    },
    ministryFeatureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ministryFeatureText: {
        fontSize: 14,
        lineHeight: 20,
    },
    ministryActionButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    ministryActionButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyStateText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
}); 