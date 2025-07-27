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

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    sessionType: string;
    status: 'New' | 'Consultation' | 'Booked' | 'Completed';
    lastContact: string;
    notes: string;
    prayerRequests?: string[];
}

interface Consultation {
    id: string;
    clientId: string;
    date: string;
    time: string;
    type: 'Video Call' | 'In-Person' | 'Phone';
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    notes: string;
    prayerRequests?: string[];
}

interface Questionnaire {
    id: string;
    title: string;
    questions: Question[];
    clientId: string;
    completed: boolean;
    responses: Record<string, string>;
}

interface Question {
    id: string;
    text: string;
    type: 'text' | 'multiple-choice' | 'rating' | 'image-upload';
    options?: string[];
    required: boolean;
}

interface MoodBoard {
    id: string;
    clientId: string;
    title: string;
    images: string[];
    notes: string;
    shared: boolean;
}

export default function ClientExperienceScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [activeTab, setActiveTab] = useState<'clients' | 'consultations' | 'questionnaires' | 'moodboards'>('clients');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showConsultationModal, setShowConsultationModal] = useState(false);
    const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Mock data
    const [clients, setClients] = useState<Client[]>([
        {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@email.com',
            phone: '(555) 123-4567',
            sessionType: 'Wedding',
            status: 'Consultation',
            lastContact: '2024-01-10',
            notes: 'Interested in outdoor ceremony and reception',
            prayerRequests: ['Pray for perfect weather', 'Bless their marriage']
        },
        {
            id: '2',
            name: 'Michael Chen',
            email: 'michael@email.com',
            phone: '(555) 987-6543',
            sessionType: 'Family Portrait',
            status: 'Booked',
            lastContact: '2024-01-12',
            notes: 'Family of 5, including 2 toddlers',
            prayerRequests: ['Pray for patience with kids', 'Capture their joy']
        }
    ]);

    const [consultations, setConsultations] = useState<Consultation[]>([
        {
            id: '1',
            clientId: '1',
            date: '2024-01-15',
            time: '2:00 PM',
            type: 'Video Call',
            status: 'Scheduled',
            notes: 'Discuss wedding timeline and locations',
            prayerRequests: ['Pray for clear communication', 'Guide our planning']
        }
    ]);

    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([
        {
            id: '1',
            title: 'Wedding Photography Preferences',
            clientId: '1',
            completed: false,
            questions: [
                {
                    id: '1',
                    text: 'What is your wedding date?',
                    type: 'text',
                    required: true
                },
                {
                    id: '2',
                    text: 'What style of photography do you prefer?',
                    type: 'multiple-choice',
                    options: ['Traditional', 'Photojournalistic', 'Artistic', 'Mixed'],
                    required: true
                },
                {
                    id: '3',
                    text: 'How would you rate the importance of candid moments?',
                    type: 'rating',
                    required: false
                }
            ],
            responses: {}
        }
    ]);

    const [moodBoards, setMoodBoards] = useState<MoodBoard[]>([
        {
            id: '1',
            clientId: '1',
            title: 'Wedding Vision Board',
            images: ['https://example.com/wedding1.jpg', 'https://example.com/wedding2.jpg'],
            notes: 'Rustic outdoor wedding with natural lighting',
            shared: true
        }
    ]);

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Divine Client Care';
        } else if (encouragementMode) {
            return 'Client Experience';
        }
        return 'Client Management';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Serve your clients with Kingdom love';
        } else if (encouragementMode) {
            return 'Create exceptional client experiences';
        }
        return 'Manage client relationships and consultations';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New':
                return theme.colors.info;
            case 'Consultation':
                return theme.colors.warning;
            case 'Booked':
                return theme.colors.success;
            case 'Completed':
                return theme.colors.textSecondary;
            default:
                return theme.colors.textSecondary;
        }
    };

    const renderClientCard = ({ item }: { item: Client }) => (
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

            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📧 {item.email}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📞 {item.phone}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📸 {item.sessionType}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                📅 Last Contact: {item.lastContact}
            </Text>

            {item.notes && (
                <Text style={[styles.cardNotes, { color: theme.colors.textSecondary }]}>
                    📝 {item.notes}
                </Text>
            )}

            {faithMode && item.prayerRequests && (
                <View style={styles.prayerContainer}>
                    <Text style={[styles.prayerTitle, { color: faithTheme.colors.primary }]}>
                        🙏 Prayer Requests:
                    </Text>
                    {item.prayerRequests.map((prayer, index) => (
                        <Text key={index} style={[styles.prayerText, { color: faithTheme.colors.textSecondary }]}>
                            • {prayer}
                        </Text>
                    ))}
                </View>
            )}

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => {
                        setSelectedClient(item);
                        setShowConsultationModal(true);
                    }}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Schedule Consultation
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => {
                        setSelectedClient(item);
                        setShowQuestionnaireModal(true);
                    }}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Send Questionnaire
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderConsultationCard = ({ item }: { item: Consultation }) => {
        const client = clients.find(c => c.id === item.clientId);
        return (
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {client?.name} - {item.type}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={[styles.statusText, { color: theme.colors.surface }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                    📅 {item.date} at {item.time}
                </Text>
                <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                    📞 {item.type}
                </Text>

                {item.notes && (
                    <Text style={[styles.cardNotes, { color: theme.colors.textSecondary }]}>
                        📝 {item.notes}
                    </Text>
                )}

                {faithMode && item.prayerRequests && (
                    <View style={styles.prayerContainer}>
                        <Text style={[styles.prayerTitle, { color: faithTheme.colors.primary }]}>
                            🙏 Prayer Requests:
                        </Text>
                        {item.prayerRequests.map((prayer, index) => (
                            <Text key={index} style={[styles.prayerText, { color: faithTheme.colors.textSecondary }]}>
                                • {prayer}
                            </Text>
                        ))}
                    </View>
                )}

                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => Alert.alert('Join Call', 'Starting video consultation...')}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Join Call
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.info }]}
                        onPress={() => Alert.alert('Share Screen', 'Opening screen sharing...')}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Share Screen
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderQuestionnaireCard = ({ item }: { item: Questionnaire }) => {
        const client = clients.find(c => c.id === item.clientId);
        return (
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {item.title}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: item.completed ? theme.colors.success : theme.colors.warning }]}>
                        <Text style={[styles.statusText, { color: theme.colors.surface }]}>
                            {item.completed ? 'Completed' : 'Pending'}
                        </Text>
                    </View>
                </View>

                <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                    👤 Client: {client?.name}
                </Text>
                <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                    ❓ Questions: {item.questions.length}
                </Text>

                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => Alert.alert('View Responses', 'Opening questionnaire responses...')}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            View Responses
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                        onPress={() => Alert.alert('Send Reminder', 'Sending questionnaire reminder...')}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Send Reminder
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderMoodBoardCard = ({ item }: { item: MoodBoard }) => {
        const client = clients.find(c => c.id === item.clientId);
        return (
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {item.title}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: item.shared ? theme.colors.success : theme.colors.info }]}>
                        <Text style={[styles.statusText, { color: theme.colors.surface }]}>
                            {item.shared ? 'Shared' : 'Private'}
                        </Text>
                    </View>
                </View>

                <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                    👤 Client: {client?.name}
                </Text>
                <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                    🖼️ Images: {item.images.length}
                </Text>

                {item.notes && (
                    <Text style={[styles.cardNotes, { color: theme.colors.textSecondary }]}>
                        📝 {item.notes}
                    </Text>
                )}

                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => Alert.alert('View Mood Board', 'Opening mood board...')}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            View Board
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                        onPress={() => Alert.alert('Share', 'Sharing mood board with client...')}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Share with Client
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'clients':
                return (
                    <FlatList
                        data={clients}
                        renderItem={renderClientCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'consultations':
                return (
                    <FlatList
                        data={consultations}
                        renderItem={renderConsultationCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'questionnaires':
                return (
                    <FlatList
                        data={questionnaires}
                        renderItem={renderQuestionnaireCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'moodboards':
                return (
                    <FlatList
                        data={moodBoards}
                        renderItem={renderMoodBoardCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
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
                        style={[styles.tab, activeTab === 'clients' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('clients')}
                    >
                        <Text style={[styles.tabText, activeTab === 'clients' && { color: theme.colors.surface }]}>
                            👥 Clients
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'consultations' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('consultations')}
                    >
                        <Text style={[styles.tabText, activeTab === 'consultations' && { color: theme.colors.surface }]}>
                            📞 Consultations
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'questionnaires' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('questionnaires')}
                    >
                        <Text style={[styles.tabText, activeTab === 'questionnaires' && { color: theme.colors.surface }]}>
                            📋 Questionnaires
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'moodboards' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('moodboards')}
                    >
                        <Text style={[styles.tabText, activeTab === 'moodboards' && { color: theme.colors.surface }]}>
                            🎨 Mood Boards
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.content}>
                {renderTabContent()}
            </View>

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                onPress={() => setShowAddModal(true)}
            >
                <Text style={[styles.fabText, { color: theme.colors.surface }]}>
                    +
                </Text>
            </TouchableOpacity>
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
        marginBottom: 10,
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
        marginBottom: 10,
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
    prayerContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
    },
    prayerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    prayerText: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
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
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    fabText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
}); 