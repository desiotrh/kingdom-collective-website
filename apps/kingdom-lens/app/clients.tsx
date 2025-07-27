import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useDualMode } from '../../contexts/DualModeContext';

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    status: 'active' | 'inactive' | 'pending';
    projects: number;
    totalSpent: number;
    lastContact: string;
    faithPreferences?: string[];
    notes: string;
}

const mockClients: Client[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@church.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://example.com/avatar1.jpg',
        status: 'active',
        projects: 5,
        totalSpent: 2500,
        lastContact: '2024-01-15',
        faithPreferences: ['Christian weddings', 'Baptism ceremonies'],
        notes: 'Prefers natural lighting and candid shots. Very spiritual family.',
    },
    {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@studio.com',
        phone: '+1 (555) 234-5678',
        avatar: 'https://example.com/avatar2.jpg',
        status: 'active',
        projects: 3,
        totalSpent: 1800,
        lastContact: '2024-01-10',
        faithPreferences: ['Corporate events', 'Portrait sessions'],
        notes: 'Professional headshots and corporate events. Appreciates faith-based approach.',
    },
    {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily@family.com',
        phone: '+1 (555) 345-6789',
        avatar: 'https://example.com/avatar3.jpg',
        status: 'pending',
        projects: 1,
        totalSpent: 800,
        lastContact: '2024-01-08',
        faithPreferences: ['Family portraits', 'Children photography'],
        notes: 'New client. Interested in family sessions with faith elements.',
    },
];

export default function ClientsScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { isFaithMode } = useDualMode();

    const [clients, setClients] = useState<Client[]>(mockClients);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
    const [showAddClient, setShowAddClient] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#27AE60';
            case 'inactive': return '#E74C3C';
            case 'pending': return '#F39C12';
            default: return '#95A5A6';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Active';
            case 'inactive': return 'Inactive';
            case 'pending': return 'Pending';
            default: return 'Unknown';
        }
    };

    const addNewClient = () => {
        setShowAddClient(true);
    };

    const handleClientPress = (client: Client) => {
        setSelectedClient(client);
    };

    const sendMessage = (client: Client) => {
        Alert.alert('Send Message', `Send message to ${client.name}?`);
    };

    const scheduleSession = (client: Client) => {
        Alert.alert('Schedule Session', `Schedule session with ${client.name}?`);
    };

    const renderClientCard = ({ item }: { item: Client }) => (
        <TouchableOpacity
            style={styles.clientCard}
            onPress={() => handleClientPress(item)}
        >
            <View style={styles.clientHeader}>
                <View style={styles.clientInfo}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.clientDetails}>
                        <Text style={styles.clientName}>{item.name}</Text>
                        <Text style={styles.clientEmail}>{item.email}</Text>
                        <View style={styles.statusContainer}>
                            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.clientStats}>
                    <Text style={styles.statNumber}>{item.projects}</Text>
                    <Text style={styles.statLabel}>Projects</Text>
                    <Text style={styles.statNumber}>${item.totalSpent}</Text>
                    <Text style={styles.statLabel}>Spent</Text>
                </View>
            </View>

            {isFaithMode && item.faithPreferences && (
                <View style={styles.faithPreferences}>
                    <Ionicons name="heart" size={14} color="#E74C3C" />
                    <Text style={styles.faithPreferencesText}>
                        {item.faithPreferences.join(', ')}
                    </Text>
                </View>
            )}

            <View style={styles.clientActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => sendMessage(item)}
                >
                    <Ionicons name="chatbubble" size={16} color="#4A90E2" />
                    <Text style={styles.actionText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => scheduleSession(item)}
                >
                    <Ionicons name="calendar" size={16} color="#27AE60" />
                    <Text style={styles.actionText}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="ellipsis-horizontal" size={16} color="#666" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={isFaithMode ? ['#4A90E2', '#7B68EE'] : ['#2C3E50', '#34495E']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Client Portal</Text>
                <TouchableOpacity onPress={addNewClient} style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>

            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['all', 'active', 'inactive', 'pending'].map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filterButton,
                                filterStatus === status && styles.activeFilterButton
                            ]}
                            onPress={() => setFilterStatus(status as any)}
                        >
                            <Text style={[
                                styles.filterText,
                                filterStatus === status && styles.activeFilterText
                            ]}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredClients}
                renderItem={renderClientCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.clientsList}
                showsVerticalScrollIndicator={false}
            />

            {/* Faith Mode Stats */}
            {isFaithMode && (
                <View style={styles.faithStats}>
                    <Text style={styles.faithStatsTitle}>Faith-Based Insights</Text>
                    <View style={styles.faithStatsGrid}>
                        <View style={styles.faithStat}>
                            <Text style={styles.faithStatNumber}>
                                {clients.filter(c => c.faithPreferences).length}
                            </Text>
                            <Text style={styles.faithStatLabel}>Faith-Focused Clients</Text>
                        </View>
                        <View style={styles.faithStat}>
                            <Text style={styles.faithStatNumber}>
                                {clients.filter(c => c.status === 'active').length}
                            </Text>
                            <Text style={styles.faithStatLabel}>Active Relationships</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Client Detail Modal */}
            {selectedClient && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedClient.name}</Text>
                            <TouchableOpacity onPress={() => setSelectedClient(null)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>Contact Information</Text>
                                <Text style={styles.modalText}>Email: {selectedClient.email}</Text>
                                <Text style={styles.modalText}>Phone: {selectedClient.phone}</Text>
                            </View>

                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>Project Statistics</Text>
                                <Text style={styles.modalText}>Total Projects: {selectedClient.projects}</Text>
                                <Text style={styles.modalText}>Total Spent: ${selectedClient.totalSpent}</Text>
                                <Text style={styles.modalText}>Last Contact: {selectedClient.lastContact}</Text>
                            </View>

                            {isFaithMode && selectedClient.faithPreferences && (
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Faith Preferences</Text>
                                    {selectedClient.faithPreferences.map((pref, index) => (
                                        <Text key={index} style={styles.modalText}>• {pref}</Text>
                                    ))}
                                </View>
                            )}

                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>Notes</Text>
                                <Text style={styles.modalText}>{selectedClient.notes}</Text>
                            </View>
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalActionButton}>
                                <Ionicons name="chatbubble" size={16} color="#fff" />
                                <Text style={styles.modalActionText}>Send Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalActionButton}>
                                <Ionicons name="calendar" size={16} color="#fff" />
                                <Text style={styles.modalActionText}>Schedule Session</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    addButton: {
        padding: 8,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    filterContainer: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    activeFilterButton: {
        backgroundColor: '#4A90E2',
    },
    filterText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#fff',
    },
    clientsList: {
        paddingHorizontal: 20,
    },
    clientCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    clientHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    clientInfo: {
        flexDirection: 'row',
        flex: 1,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    clientDetails: {
        flex: 1,
    },
    clientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    clientEmail: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#666',
    },
    clientStats: {
        alignItems: 'flex-end',
    },
    statNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    faithPreferences: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    faithPreferencesText: {
        fontSize: 12,
        color: '#E74C3C',
        marginLeft: 4,
        fontStyle: 'italic',
    },
    clientActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    actionText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    faithStats: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    faithStatsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    faithStatsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    faithStat: {
        alignItems: 'center',
    },
    faithStatNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    faithStatLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '90%',
        maxHeight: '80%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    modalBody: {
        padding: 20,
    },
    modalSection: {
        marginBottom: 20,
    },
    modalSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    modalActions: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    modalActionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4A90E2',
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    modalActionText: {
        color: '#fff',
        marginLeft: 4,
        fontWeight: '500',
    },
}); 