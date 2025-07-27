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
    Image,
    Dimensions,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Photographer {
    id: string;
    name: string;
    location: string;
    specialties: string[];
    experience: string;
    rating: number;
    portfolio: string[];
    available: boolean;
    faithBased: boolean;
    ministryFocus?: string[];
}

interface Mentorship {
    id: string;
    mentorId: string;
    menteeId: string;
    status: 'Requested' | 'Active' | 'Completed';
    startDate: string;
    endDate?: string;
    focus: string[];
    notes: string;
}

interface Collaboration {
    id: string;
    title: string;
    photographers: string[];
    projectType: string;
    status: 'Planning' | 'Active' | 'Completed';
    sharedGallery: string[];
    contracts: string[];
    folders: string[];
    ministryRelated: boolean;
}

export default function CommunityNetworkingScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [activeTab, setActiveTab] = useState<'network' | 'mentorship' | 'collaborations' | 'kingdom'>('network');
    const [showMentorshipModal, setShowMentorshipModal] = useState(false);
    const [selectedPhotographer, setSelectedPhotographer] = useState<Photographer | null>(null);

    // Mock data
    const [photographers, setPhotographers] = useState<Photographer[]>([
        {
            id: '1',
            name: 'Sarah Grace Photography',
            location: 'Nashville, TN',
            specialties: ['Wedding', 'Portrait', 'Event'],
            experience: '8 years',
            rating: 4.9,
            portfolio: ['https://example.com/portfolio1.jpg'],
            available: true,
            faithBased: true,
            ministryFocus: ['Church Events', 'Baptisms', 'Christian Weddings']
        },
        {
            id: '2',
            name: 'Michael Chen Studios',
            location: 'Austin, TX',
            specialties: ['Commercial', 'Real Estate', 'Portrait'],
            experience: '12 years',
            rating: 4.8,
            portfolio: ['https://example.com/portfolio2.jpg'],
            available: true,
            faithBased: false
        },
        {
            id: '3',
            name: 'Divine Moments Photography',
            location: 'Charlotte, NC',
            specialties: ['Wedding', 'Family', 'Ministry'],
            experience: '5 years',
            rating: 4.7,
            portfolio: ['https://example.com/portfolio3.jpg'],
            available: true,
            faithBased: true,
            ministryFocus: ['Church Services', 'Mission Trips', 'Christian Education']
        }
    ]);

    const [mentorships, setMentorships] = useState<Mentorship[]>([
        {
            id: '1',
            mentorId: '1',
            menteeId: 'current-user',
            status: 'Active',
            startDate: '2024-01-01',
            focus: ['Wedding Photography', 'Business Management'],
            notes: 'Weekly sessions focusing on wedding workflow and client management'
        }
    ]);

    const [collaborations, setCollaborations] = useState<Collaboration[]>([
        {
            id: '1',
            title: 'Spring Wedding Collection',
            photographers: ['1', '3'],
            projectType: 'Wedding Photography',
            status: 'Active',
            sharedGallery: ['https://example.com/gallery1.jpg'],
            contracts: ['contract1.pdf'],
            folders: ['Spring2024', 'Weddings'],
            ministryRelated: true
        },
        {
            id: '2',
            title: 'Church Event Coverage',
            photographers: ['1', '3'],
            projectType: 'Event Photography',
            status: 'Planning',
            sharedGallery: [],
            contracts: ['contract2.pdf'],
            folders: ['ChurchEvents'],
            ministryRelated: true
        }
    ]);

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Kingdom Community';
        } else if (encouragementMode) {
            return 'Photographer Network';
        }
        return 'Community & Networking';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Connect with fellow Kingdom photographers';
        } else if (encouragementMode) {
            return 'Build your professional network';
        }
        return 'Connect with other photographers';
    };

    const renderPhotographerCard = ({ item }: { item: Photographer }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <View style={styles.photographerInfo}>
                    <Text style={[styles.photographerName, { color: theme.colors.text }]}>
                        {item.name}
                    </Text>
                    <Text style={[styles.photographerLocation, { color: theme.colors.textSecondary }]}>
                        📍 {item.location}
                    </Text>
                </View>
                <View style={styles.ratingContainer}>
                    <Text style={[styles.rating, { color: theme.colors.primary }]}>
                        ⭐ {item.rating}
                    </Text>
                    <View style={[styles.availabilityBadge, { backgroundColor: item.available ? theme.colors.success : theme.colors.error }]}>
                        <Text style={[styles.availabilityText, { color: theme.colors.surface }]}>
                            {item.available ? 'Available' : 'Busy'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.specialtiesContainer}>
                {item.specialties.map((specialty, index) => (
                    <View key={index} style={[styles.specialtyTag, { backgroundColor: theme.colors.primary }]}>
                        <Text style={[styles.specialtyText, { color: theme.colors.surface }]}>
                            {specialty}
                        </Text>
                    </View>
                ))}
            </View>

            <Text style={[styles.experienceText, { color: theme.colors.textSecondary }]}>
                📸 {item.experience} experience
            </Text>

            {faithMode && item.faithBased && item.ministryFocus && (
                <View style={styles.ministryContainer}>
                    <Text style={[styles.ministryTitle, { color: faithTheme.colors.primary }]}>
                        🙏 Ministry Focus:
                    </Text>
                    {item.ministryFocus.map((focus, index) => (
                        <Text key={index} style={[styles.ministryFocus, { color: faithTheme.colors.textSecondary }]}>
                            • {focus}
                        </Text>
                    ))}
                </View>
            )}

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => {
                        setSelectedPhotographer(item);
                        setShowMentorshipModal(true);
                    }}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Request Mentorship
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('View Portfolio', `Opening ${item.name}'s portfolio...`)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        View Portfolio
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderMentorshipCard = ({ item }: { item: Mentorship }) => {
        const mentor = photographers.find(p => p.id === item.mentorId);
        return (
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        Mentorship with {mentor?.name}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={[styles.statusText, { color: theme.colors.surface }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                    📅 Started: {item.startDate}
                </Text>
                {item.endDate && (
                    <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                        📅 Ended: {item.endDate}
                    </Text>
                )}

                <View style={styles.focusContainer}>
                    <Text style={[styles.focusTitle, { color: theme.colors.text }]}>
                        🎯 Focus Areas:
                    </Text>
                    {item.focus.map((focus, index) => (
                        <Text key={index} style={[styles.focusItem, { color: theme.colors.textSecondary }]}>
                            • {focus}
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
                        onPress={() => Alert.alert('Schedule Session', 'Opening calendar for next session...')}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Schedule Session
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.info }]}
                        onPress={() => Alert.alert('View Progress', 'Opening mentorship progress...')}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            View Progress
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderCollaborationCard = ({ item }: { item: Collaboration }) => {
        const projectPhotographers = photographers.filter(p => item.photographers.includes(p.id));
        return (
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {item.title}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={[styles.statusText, { color: theme.colors.surface }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                    📸 {item.projectType}
                </Text>
                <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                    👥 {projectPhotographers.length} photographers
                </Text>

                {faithMode && item.ministryRelated && (
                    <View style={styles.ministryBadge}>
                        <Text style={[styles.ministryBadgeText, { color: faithTheme.colors.primary }]}>
                            ✨ Kingdom Collaboration
                        </Text>
                    </View>
                )}

                <View style={styles.collaborationStats}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            Gallery
                        </Text>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                            {item.sharedGallery.length}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            Contracts
                        </Text>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                            {item.contracts.length}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            Folders
                        </Text>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                            {item.folders.length}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => Alert.alert('View Project', `Opening ${item.title}...`)}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            View Project
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                        onPress={() => Alert.alert('Share Files', 'Opening file sharing...')}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Share Files
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderKingdomCollaborationCard = () => (
        <View style={[styles.kingdomCard, { backgroundColor: faithTheme.colors.surface }]}>
            <Text style={[styles.kingdomCardTitle, { color: faithTheme.colors.text }]}>
                ✨ Kingdom Collaborations
            </Text>
            <Text style={[styles.kingdomCardSubtitle, { color: faithTheme.colors.textSecondary }]}>
                Connect with photographers who share your faith and ministry vision
            </Text>

            <View style={styles.kingdomStats}>
                <View style={styles.kingdomStat}>
                    <Text style={[styles.kingdomStatValue, { color: faithTheme.colors.primary }]}>
                        {photographers.filter(p => p.faithBased).length}
                    </Text>
                    <Text style={[styles.kingdomStatLabel, { color: faithTheme.colors.textSecondary }]}>
                        Faith-Based Photographers
                    </Text>
                </View>
                <View style={styles.kingdomStat}>
                    <Text style={[styles.kingdomStatValue, { color: faithTheme.colors.primary }]}>
                        {collaborations.filter(c => c.ministryRelated).length}
                    </Text>
                    <Text style={[styles.kingdomStatLabel, { color: faithTheme.colors.textSecondary }]}>
                        Ministry Projects
                    </Text>
                </View>
            </View>

            <View style={styles.kingdomOpportunities}>
                <Text style={[styles.opportunitiesTitle, { color: faithTheme.colors.text }]}>
                    🎯 Ministry Opportunities:
                </Text>
                <Text style={[styles.opportunity, { color: faithTheme.colors.textSecondary }]}>
                    • Church event photography teams
                </Text>
                <Text style={[styles.opportunity, { color: faithTheme.colors.textSecondary }]}>
                    • Mission trip documentation
                </Text>
                <Text style={[styles.opportunity, { color: faithTheme.colors.textSecondary }]}>
                    • Christian wedding collaborations
                </Text>
                <Text style={[styles.opportunity, { color: faithTheme.colors.textSecondary }]}>
                    • Ministry portfolio development
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.kingdomActionButton, { backgroundColor: faithTheme.colors.primary }]}
                onPress={() => Alert.alert('Find Collaborators', 'Searching for Kingdom photographers...')}
            >
                <Text style={[styles.kingdomActionButtonText, { color: faithTheme.colors.surface }]}>
                    Find Kingdom Collaborators
                </Text>
            </TouchableOpacity>
        </View>
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Requested':
                return theme.colors.warning;
            case 'Active':
                return theme.colors.success;
            case 'Completed':
                return theme.colors.info;
            case 'Planning':
                return theme.colors.warning;
            default:
                return theme.colors.textSecondary;
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'network':
                return (
                    <FlatList
                        data={photographers}
                        renderItem={renderPhotographerCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'mentorship':
                return (
                    <FlatList
                        data={mentorships}
                        renderItem={renderMentorshipCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'collaborations':
                return (
                    <FlatList
                        data={collaborations}
                        renderItem={renderCollaborationCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'kingdom':
                return faithMode ? (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
                        {renderKingdomCollaborationCard()}
                    </ScrollView>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                            Kingdom collaborations are available in Faith Mode
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
                        style={[styles.tab, activeTab === 'network' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('network')}
                    >
                        <Text style={[styles.tabText, activeTab === 'network' && { color: theme.colors.surface }]}>
                            👥 Network
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'mentorship' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('mentorship')}
                    >
                        <Text style={[styles.tabText, activeTab === 'mentorship' && { color: theme.colors.surface }]}>
                            🎓 Mentorship
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'collaborations' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('collaborations')}
                    >
                        <Text style={[styles.tabText, activeTab === 'collaborations' && { color: theme.colors.surface }]}>
                            🤝 Collaborations
                        </Text>
                    </TouchableOpacity>
                    {faithMode && (
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'kingdom' && { backgroundColor: faithTheme.colors.primary }]}
                            onPress={() => setActiveTab('kingdom')}
                        >
                            <Text style={[styles.tabText, activeTab === 'kingdom' && { color: faithTheme.colors.surface }]}>
                                ✨ Kingdom
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
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    photographerInfo: {
        flex: 1,
    },
    photographerName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    photographerLocation: {
        fontSize: 14,
    },
    ratingContainer: {
        alignItems: 'flex-end',
    },
    rating: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    availabilityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    availabilityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    specialtiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    specialtyTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 5,
    },
    specialtyText: {
        fontSize: 12,
        fontWeight: '600',
    },
    experienceText: {
        fontSize: 14,
        marginBottom: 10,
    },
    ministryContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
    },
    ministryTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ministryFocus: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
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
    focusContainer: {
        marginBottom: 15,
    },
    focusTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    focusItem: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    ministryBadge: {
        marginBottom: 15,
    },
    ministryBadgeText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    collaborationStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
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
    kingdomCard: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    kingdomCardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    kingdomCardSubtitle: {
        fontSize: 14,
        marginBottom: 20,
    },
    kingdomStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    kingdomStat: {
        alignItems: 'center',
        flex: 1,
    },
    kingdomStatValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    kingdomStatLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    kingdomOpportunities: {
        marginBottom: 20,
    },
    opportunitiesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    opportunity: {
        fontSize: 14,
        marginBottom: 5,
        paddingLeft: 10,
    },
    kingdomActionButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    kingdomActionButtonText: {
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