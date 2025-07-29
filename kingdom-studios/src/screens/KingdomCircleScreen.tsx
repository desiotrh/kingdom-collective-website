/**
 * ⚡ KINGDOM CIRCLE: JESUS-CENTERED COMMUNITY SCREEN ⚡
 * Complete Implementation — Alignment with Acts 2:42–47 Church Mandate
 * Focus: RELATIONSHIP with JESUS, not religion
 * Scripture Source: Holy Bible (66 books, Genesis–Revelation)
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Dimensions,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/UnifiedAuthContext';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

// Import all Kingdom Circle services
import { actsCommunityService } from '../services/KingdomCircleActsCommunityService';
import { scriptureService } from '../services/KingdomCircleScriptureService';
import { discipleshipService } from '../services/KingdomCircleDiscipleshipService';
import { faithModeService } from '../services/KingdomCircleFaithModeService';
import { accountabilityService } from '../services/KingdomCircleAccountabilityService';
import { genderSafetyService } from '../services/KingdomCircleGenderSafetyService';
import { localChurchService } from '../services/KingdomCircleLocalChurchService';

const { width } = Dimensions.get('window');

interface TabData {
    id: string;
    title: string;
    icon: string;
    requiresFaithMode?: boolean;
    requiresTier?: string;
}

const KingdomCircleScreen: React.FC = () => {
    const { user, userTier } = useAuth();
    const { isFaithMode } = useDualMode();
    const [activeTab, setActiveTab] = useState('acts-community');
    const [refreshing, setRefreshing] = useState(false);
    const [userGender, setUserGender] = useState<'male' | 'female' | null>(null);

    // State for different sections
    const [actsRooms, setActsRooms] = useState<any[]>([]);
    const [dailyBread, setDailyBread] = useState<any>(null);
    const [mentorshipTracks, setMentorshipTracks] = useState<any[]>([]);
    const [prayerRequests, setPrayerRequests] = useState<any[]>([]);
    const [altarMoments, setAltarMoments] = useState<any[]>([]);
    const [genderRooms, setGenderRooms] = useState<any[]>([]);
    const [localChurches, setLocalChurches] = useState<any[]>([]);
    const [prayerWalks, setPrayerWalks] = useState<any[]>([]);
    const [kingdomMeetups, setKingdomMeetups] = useState<any[]>([]);

    const tabs: TabData[] = [
        {
            id: 'acts-community',
            title: 'Acts Community',
            icon: '🏛️',
        },
        {
            id: 'scripture',
            title: 'Scripture First',
            icon: '📖',
        },
        {
            id: 'discipleship',
            title: 'Discipleship',
            icon: '👥',
        },
        {
            id: 'faith-mode',
            title: 'Faith Mode',
            icon: '🙏',
            requiresFaithMode: true,
        },
        {
            id: 'accountability',
            title: 'Accountability',
            icon: '🛡️',
        },
        {
            id: 'gender-safety',
            title: 'Gender Safety',
            icon: '🔒',
        },
        {
            id: 'local-church',
            title: 'Local Church',
            icon: '⛪',
        },
    ];

    useEffect(() => {
        loadUserGender();
        loadInitialData();
    }, []);

    const loadUserGender = async () => {
        if (user?.id) {
            try {
                const genderData = await genderSafetyService.getUserGender(user.id);
                setUserGender(genderData.gender);
            } catch (error) {
                console.error('Error loading user gender:', error);
            }
        }
    };

    const loadInitialData = async () => {
        try {
            // Load Acts Community data
            const teachingRooms = await actsCommunityService.getTeachingRooms();
            setActsRooms(teachingRooms);

            // Load Scripture data
            const bread = await scriptureService.getDailyBread();
            setDailyBread(bread);

            // Load Discipleship data
            if (user?.id) {
                const tracks = await discipleshipService.getMentorshipTracks(user.id);
                setMentorshipTracks(tracks);
            }

            // Load Faith Mode data (if in faith mode)
            if (isFaithMode && user?.id) {
                const prayers = await faithModeService.getPrayerHistory(user.id);
                setPrayerRequests(prayers);
            }

            // Load Accountability data
            if (user?.id) {
                const moments = await accountabilityService.getAltarMoments(user.id);
                setAltarMoments(moments);
            }

            // Load Gender Safety data
            if (userGender) {
                const rooms = await genderSafetyService.getGenderSpecificRooms(userGender);
                setGenderRooms(rooms);
            }

            // Load Local Church data
            const churches = await localChurchService.getVerifiedChurches();
            setLocalChurches(churches);

            // Load Prayer Walks
            const walks = await localChurchService.getPrayerWalkZones();
            setPrayerWalks(walks);

            // Load Kingdom Meetups
            if (userGender) {
                const meetups = await localChurchService.getKingdomMeetups(userGender);
                setKingdomMeetups(meetups);
            }
        } catch (error) {
            console.error('Error loading Kingdom Circle data:', error);
            Alert.alert('Error', 'Failed to load community data. Please try again.');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadInitialData();
        setRefreshing(false);
    };

    const renderActsCommunity = () => (
        <ScrollView style={styles.section}>
            <Text style={styles.sectionTitle}>Acts 2:42 Community</Text>
            <Text style={styles.sectionSubtitle}>
                "And they continued steadfastly in the apostles' doctrine and fellowship, in the breaking of bread, and in prayers."
            </Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Teaching Rooms</Text>
                {actsRooms.map((room) => (
                    <TouchableOpacity key={room.id} style={styles.roomItem}>
                        <Text style={styles.roomName}>{room.name}</Text>
                        <Text style={styles.roomDescription}>{room.description}</Text>
                        <Text style={styles.roomStats}>
                            {room.currentParticipants}/{room.maxParticipants} participants
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Fellowship Rooms</Text>
                <Text style={styles.cardDescription}>
                    Gender-separated spaces for genuine relationships and accountability
                </Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Join Fellowship Room</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>24/7 Prayer Rooms</Text>
                <Text style={styles.cardDescription}>
                    Persistent prayer rooms for continuous intercession
                </Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Enter Prayer Room</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderScriptureFirst = () => (
        <ScrollView style={styles.section}>
            <Text style={styles.sectionTitle}>Scripture First</Text>
            <Text style={styles.sectionSubtitle}>
                "Your word is a lamp to my feet and a light to my path." - Psalm 119:105
            </Text>

            {dailyBread && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Daily Bread</Text>
                    <Text style={styles.scriptureText}>"{dailyBread.scripturePassage.text}"</Text>
                    <Text style={styles.scriptureReference}>
                        {dailyBread.scripturePassage.book} {dailyBread.scripturePassage.chapter}:{dailyBread.scripturePassage.verse}
                    </Text>
                    <Text style={styles.devotionText}>{dailyBread.devotion}</Text>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Mark Complete</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Scripture Memory Challenges</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Join Challenge</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>AI Truth Guardrails</Text>
                <Text style={styles.cardDescription}>
                    All content is checked for biblical accuracy
                </Text>
            </View>
        </ScrollView>
    );

    const renderDiscipleship = () => (
        <ScrollView style={styles.section}>
            <Text style={styles.sectionTitle}>Discipleship & Growth</Text>
            <Text style={styles.sectionSubtitle}>
                "Go therefore and make disciples..." - Matthew 28:19
            </Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Mentorship Tracks</Text>
                {mentorshipTracks.map((track) => (
                    <TouchableOpacity key={track.id} style={styles.trackItem}>
                        <Text style={styles.trackName}>{track.title}</Text>
                        <Text style={styles.trackDescription}>{track.description}</Text>
                        <Text style={styles.trackProgress}>Progress: {track.progress}%</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Growth Pathways</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Start Growth Path</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Discipleship Triads</Text>
                <Text style={styles.cardDescription}>
                    Small groups of 3 for accountability and growth
                </Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Join Triad</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderFaithMode = () => {
        if (!isFaithMode) {
            return (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Faith Mode Required</Text>
                    <Text style={styles.sectionSubtitle}>
                        Enable Faith Mode to access prophetic and prayer features
                    </Text>
                </View>
            );
        }

        return (
            <ScrollView style={styles.section}>
                <Text style={styles.sectionTitle}>Faith Mode Tools</Text>
                <Text style={styles.sectionSubtitle}>
                    Prophetic and prayer features for faith mode users
                </Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>AI Prayer Builder</Text>
                    <Text style={styles.cardDescription}>
                        Scripture-based intercession with personalization
                    </Text>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Create Prayer</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Dream Tracker</Text>
                    <Text style={styles.cardDescription}>
                        Track and interpret dreams with biblical guidance
                    </Text>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Log Dream</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Spiritual Gift Tracker</Text>
                    <Text style={styles.cardDescription}>
                        Track and activate your spiritual gifts
                    </Text>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>View Gifts</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Prophetic Vault</Text>
                    <Text style={styles.cardDescription}>
                        Submit and test prophetic words
                    </Text>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Submit Word</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    const renderAccountability = () => (
        <ScrollView style={styles.section}>
            <Text style={styles.sectionTitle}>Accountability</Text>
            <Text style={styles.sectionSubtitle}>
                "Confess your trespasses to one another..." - James 5:16
            </Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Altar Moments</Text>
                {altarMoments.map((moment) => (
                    <TouchableOpacity key={moment.id} style={styles.momentItem}>
                        <Text style={styles.momentType}>{moment.type}</Text>
                        <Text style={styles.momentTitle}>{moment.title}</Text>
                        <Text style={styles.momentDescription}>{moment.description}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Create Altar Moment</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Covering Walls</Text>
                <Text style={styles.cardDescription}>
                    Prayer partners and accountability groups
                </Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Join Covering Wall</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Dispute Resolution</Text>
                <Text style={styles.cardDescription}>
                    Biblical conflict resolution (Matthew 18)
                </Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Submit Dispute</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderGenderSafety = () => (
        <ScrollView style={styles.section}>
            <Text style={styles.sectionTitle}>Gender Safety</Text>
            <Text style={styles.sectionSubtitle}>
                Biblical gender separation for safety and accountability
            </Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Gender-Specific Rooms</Text>
                {genderRooms.map((room) => (
                    <TouchableOpacity key={room.id} style={styles.roomItem}>
                        <Text style={styles.roomName}>{room.name}</Text>
                        <Text style={styles.roomDescription}>{room.description}</Text>
                        <Text style={styles.roomStats}>
                            {room.currentParticipants}/{room.maxParticipants} participants
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Gender-Specific Events</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>View Events</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Safety Reporting</Text>
                <Text style={styles.cardDescription}>
                    Report inappropriate behavior or gender violations
                </Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Submit Report</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderLocalChurch = () => (
        <ScrollView style={styles.section}>
            <Text style={styles.sectionTitle}>Local Church Integration</Text>
            <Text style={styles.sectionSubtitle}>
                Connecting with local churches and community outreach
            </Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Acts Church Directory</Text>
                {localChurches.map((church) => (
                    <TouchableOpacity key={church.id} style={styles.churchItem}>
                        <Text style={styles.churchName}>{church.name}</Text>
                        <Text style={styles.churchAddress}>{church.address}</Text>
                        <Text style={styles.churchPastor}>Pastor: {church.pastorName}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Prayer Walk Map</Text>
                {prayerWalks.map((zone) => (
                    <TouchableOpacity key={zone.id} style={styles.zoneItem}>
                        <Text style={styles.zoneName}>{zone.name}</Text>
                        <Text style={styles.zoneDescription}>{zone.description}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Join Prayer Walk</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Kingdom Meetups</Text>
                {kingdomMeetups.map((meetup) => (
                    <TouchableOpacity key={meetup.id} style={styles.meetupItem}>
                        <Text style={styles.meetupTitle}>{meetup.title}</Text>
                        <Text style={styles.meetupDescription}>{meetup.description}</Text>
                        <Text style={styles.meetupDate}>
                            {new Date(meetup.startDate).toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Create Meetup</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'acts-community':
                return renderActsCommunity();
            case 'scripture':
                return renderScriptureFirst();
            case 'discipleship':
                return renderDiscipleship();
            case 'faith-mode':
                return renderFaithMode();
            case 'accountability':
                return renderAccountability();
            case 'gender-safety':
                return renderGenderSafety();
            case 'local-church':
                return renderLocalChurch();
            default:
                return renderActsCommunity();
        }
    };

    const canAccessTab = (tab: TabData) => {
        if (tab.requiresFaithMode && !isFaithMode) return false;
        if (tab.requiresTier && userTier !== tab.requiresTier) return false;
        return true;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Kingdom Circle</Text>
                <Text style={styles.subtitle}>Jesus-Centered Community</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabContainer}
            >
                {tabs.map((tab) => {
                    const accessible = canAccessTab(tab);
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={[
                                styles.tab,
                                activeTab === tab.id && styles.activeTab,
                                !accessible && styles.disabledTab,
                            ]}
                            onPress={() => accessible && setActiveTab(tab.id)}
                            disabled={!accessible}
                        >
                            <Text style={styles.tabIcon}>{tab.icon}</Text>
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab.id && styles.activeTabText,
                                    !accessible && styles.disabledTabText,
                                ]}
                            >
                                {tab.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
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
    },
    tabContainer: {
        backgroundColor: KingdomColors.white,
        paddingVertical: 10,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: KingdomColors.lightGray,
        alignItems: 'center',
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
        marginBottom: 5,
    },
    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: KingdomColors.darkGray,
    },
    activeTabText: {
        color: KingdomColors.white,
    },
    disabledTabText: {
        color: KingdomColors.gray,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: KingdomColors.primary,
        marginBottom: 10,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: KingdomColors.darkGray,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    card: {
        backgroundColor: KingdomColors.white,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.primary,
        marginBottom: 10,
    },
    cardDescription: {
        fontSize: 14,
        color: KingdomColors.darkGray,
        marginBottom: 15,
    },
    button: {
        backgroundColor: KingdomColors.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: KingdomColors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    roomItem: {
        backgroundColor: KingdomColors.lightGray,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    roomName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.primary,
    },
    roomDescription: {
        fontSize: 14,
        color: KingdomColors.darkGray,
        marginTop: 5,
    },
    roomStats: {
        fontSize: 12,
        color: KingdomColors.gray,
        marginTop: 5,
    },
    scriptureText: {
        fontSize: 16,
        color: KingdomColors.primary,
        fontStyle: 'italic',
        marginBottom: 10,
    },
    scriptureReference: {
        fontSize: 14,
        color: KingdomColors.gray,
        marginBottom: 10,
    },
    devotionText: {
        fontSize: 14,
        color: KingdomColors.darkGray,
        marginBottom: 15,
    },
    trackItem: {
        backgroundColor: KingdomColors.lightGray,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    trackName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.primary,
    },
    trackDescription: {
        fontSize: 14,
        color: KingdomColors.darkGray,
        marginTop: 5,
    },
    trackProgress: {
        fontSize: 12,
        color: KingdomColors.gray,
        marginTop: 5,
    },
    momentItem: {
        backgroundColor: KingdomColors.lightGray,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    momentType: {
        fontSize: 12,
        color: KingdomColors.primary,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    momentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.primary,
        marginTop: 5,
    },
    momentDescription: {
        fontSize: 14,
        color: KingdomColors.darkGray,
        marginTop: 5,
    },
    churchItem: {
        backgroundColor: KingdomColors.lightGray,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    churchName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.primary,
    },
    churchAddress: {
        fontSize: 14,
        color: KingdomColors.darkGray,
        marginTop: 5,
    },
    churchPastor: {
        fontSize: 12,
        color: KingdomColors.gray,
        marginTop: 5,
    },
    zoneItem: {
        backgroundColor: KingdomColors.lightGray,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    zoneName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.primary,
    },
    zoneDescription: {
        fontSize: 14,
        color: KingdomColors.darkGray,
        marginTop: 5,
    },
    meetupItem: {
        backgroundColor: KingdomColors.lightGray,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    meetupTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.primary,
    },
    meetupDescription: {
        fontSize: 14,
        color: KingdomColors.darkGray,
        marginTop: 5,
    },
    meetupDate: {
        fontSize: 12,
        color: KingdomColors.gray,
        marginTop: 5,
    },
});

export default KingdomCircleScreen; 