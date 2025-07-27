import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MentorshipSession {
    id: string;
    clientName: string;
    email: string;
    sessionType: '1on1' | 'group' | 'package';
    packageId?: string;
    date: Date;
    duration: number;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    notes: string;
    goals: string[];
    amount: number;
    createdAt: Date;
}

interface MentorshipPackage {
    id: string;
    name: string;
    description: string;
    sessions: number;
    duration: number;
    price: number;
    isActive: boolean;
    sales: number;
    revenue: number;
    createdAt: Date;
}

interface ClientGoal {
    id: string;
    sessionId: string;
    goal: string;
    status: 'pending' | 'in-progress' | 'achieved';
    notes: string;
    createdAt: Date;
}

const MentorshipBookingScreen: React.FC = () => {
    const [sessions, setSessions] = useState<MentorshipSession[]>([]);
    const [packages, setPackages] = useState<MentorshipPackage[]>([]);
    const [goals, setGoals] = useState<ClientGoal[]>([]);
    const [selectedTab, setSelectedTab] = useState<'sessions' | 'packages' | 'calendar'>('sessions');
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [showPackageModal, setShowPackageModal] = useState(false);
    const [newSession, setNewSession] = useState<Partial<MentorshipSession>>({});
    const [newPackage, setNewPackage] = useState<Partial<MentorshipPackage>>({});

    useEffect(() => {
        setSessions([
            {
                id: '1',
                clientName: 'Sarah Johnson',
                email: 'sarah@example.com',
                sessionType: '1on1',
                date: new Date('2024-02-15T14:00:00'),
                duration: 60,
                status: 'scheduled',
                notes: 'First-time client, interested in faith-based business coaching',
                goals: ['Start a faith-based business', 'Build confidence in leadership'],
                amount: 200,
                createdAt: new Date('2024-01-20')
            }
        ]);

        setPackages([
            {
                id: '1',
                name: 'Faith Business Foundation',
                description: '4-session package for faith-based business startup',
                sessions: 4,
                duration: 60,
                price: 750,
                isActive: true,
                sales: 8,
                revenue: 6000,
                createdAt: new Date('2024-01-15')
            }
        ]);

        setGoals([
            {
                id: '1',
                sessionId: '1',
                goal: 'Start a faith-based business',
                status: 'in-progress',
                notes: 'Client has business idea, needs guidance on execution',
                createdAt: new Date('2024-01-20')
            }
        ]);
    }, []);

    const addSession = () => {
        if (!newSession.clientName || !newSession.email) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const session: MentorshipSession = {
            id: Date.now().toString(),
            clientName: newSession.clientName,
            email: newSession.email,
            sessionType: newSession.sessionType || '1on1',
            date: newSession.date || new Date(),
            duration: newSession.duration || 60,
            status: 'scheduled',
            notes: newSession.notes || '',
            goals: newSession.goals || [],
            amount: newSession.amount || 0,
            createdAt: new Date()
        };

        setSessions([...sessions, session]);
        setNewSession({});
        setShowSessionModal(false);
        Alert.alert('Success', 'Session booked successfully!');
    };

    const addPackage = () => {
        if (!newPackage.name || !newPackage.description) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const package_: MentorshipPackage = {
            id: Date.now().toString(),
            name: newPackage.name,
            description: newPackage.description,
            sessions: newPackage.sessions || 1,
            duration: newPackage.duration || 60,
            price: newPackage.price || 0,
            isActive: true,
            sales: 0,
            revenue: 0,
            createdAt: new Date()
        };

        setPackages([...packages, package_]);
        setNewPackage({});
        setShowPackageModal(false);
        Alert.alert('Success', 'Package created successfully!');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return '#2196F3';
            case 'completed': return '#4CAF50';
            case 'cancelled': return '#f44336';
            case 'rescheduled': return '#FF9800';
            default: return '#666';
        }
    };

    const renderSessions = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📅 Sessions ({sessions.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowSessionModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Book Session</Text>
                </TouchableOpacity>
            </View>

            {sessions.map(session => (
                <View key={session.id} style={styles.sessionCard}>
                    <View style={styles.sessionHeader}>
                        <Text style={styles.sessionTitle}>{session.clientName}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
                            <Text style={styles.statusText}>{session.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.sessionEmail}>{session.email}</Text>
                    <Text style={styles.sessionType}>{session.sessionType.toUpperCase()} • {session.duration} min</Text>
                    <Text style={styles.sessionDate}>{session.date.toLocaleDateString()} at {session.date.toLocaleTimeString()}</Text>
                    <Text style={styles.sessionAmount}>${session.amount}</Text>
                    {session.notes && (
                        <Text style={styles.sessionNotes}>{session.notes}</Text>
                    )}
                    {session.goals.length > 0 && (
                        <View style={styles.goalsSection}>
                            <Text style={styles.goalsTitle}>Goals:</Text>
                            {session.goals.map((goal, index) => (
                                <Text key={index} style={styles.goalItem}>• {goal}</Text>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </View>
    );

    const renderPackages = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📦 Packages ({packages.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowPackageModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Package</Text>
                </TouchableOpacity>
            </View>

            {packages.map(package_ => (
                <View key={package_.id} style={styles.packageCard}>
                    <View style={styles.packageHeader}>
                        <Text style={styles.packageTitle}>{package_.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: package_.isActive ? '#4CAF50' : '#f44336' }]}>
                            <Text style={styles.statusText}>{package_.isActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                    </View>
                    <Text style={styles.packageDescription}>{package_.description}</Text>
                    <View style={styles.packageMeta}>
                        <Text style={styles.packageSessions}>{package_.sessions} sessions</Text>
                        <Text style={styles.packageDuration}>{package_.duration} min each</Text>
                        <Text style={styles.packagePrice}>${package_.price}</Text>
                    </View>
                    <View style={styles.packageStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{package_.sales}</Text>
                            <Text style={styles.statLabel}>Sales</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>${package_.revenue}</Text>
                            <Text style={styles.statLabel}>Revenue</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderCalendar = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Calendar View</Text>
            <Text style={styles.sectionDescription}>
                Manage your mentorship schedule and availability
            </Text>

            <View style={styles.calendarCard}>
                <Text style={styles.calendarTitle}>Today's Sessions</Text>
                <Text style={styles.calendarDate}>{new Date().toLocaleDateString()}</Text>
                <Text style={styles.calendarCount}>{sessions.filter(s => s.status === 'scheduled').length} scheduled</Text>
            </View>

            <View style={styles.calendarCard}>
                <Text style={styles.calendarTitle}>This Week</Text>
                <Text style={styles.calendarCount}>{sessions.filter(s => s.status === 'scheduled').length} sessions</Text>
                <Text style={styles.calendarRevenue}>${sessions.filter(s => s.status === 'scheduled').reduce((sum, s) => sum + s.amount, 0)} revenue</Text>
            </View>

            <View style={styles.calendarCard}>
                <Text style={styles.calendarTitle}>Availability</Text>
                <TouchableOpacity style={styles.availabilityButton}>
                    <Text style={styles.availabilityButtonText}>Set Availability</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>🎯 Mentorship Booking</Text>
                <Text style={styles.headerSubtitle}>Manage 1:1 calls and group mentorship sessions</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'sessions' && styles.activeTab]}
                    onPress={() => setSelectedTab('sessions')}
                >
                    <Ionicons name="calendar" size={20} color={selectedTab === 'sessions' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'sessions' && styles.activeTabText]}>
                        Sessions
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'packages' && styles.activeTab]}
                    onPress={() => setSelectedTab('packages')}
                >
                    <Ionicons name="cube" size={20} color={selectedTab === 'packages' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'packages' && styles.activeTabText]}>
                        Packages
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'calendar' && styles.activeTab]}
                    onPress={() => setSelectedTab('calendar')}
                >
                    <Ionicons name="time" size={20} color={selectedTab === 'calendar' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'calendar' && styles.activeTabText]}>
                        Calendar
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {selectedTab === 'sessions' && renderSessions()}
                {selectedTab === 'packages' && renderPackages()}
                {selectedTab === 'calendar' && renderCalendar()}

                {/* Session Modal */}
                <Modal
                    visible={showSessionModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowSessionModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Book Mentorship Session</Text>

                            <Text style={styles.inputLabel}>Client Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newSession.clientName}
                                onChangeText={(text) => setNewSession({ ...newSession, clientName: text })}
                                placeholder="Enter client name"
                            />

                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={newSession.email}
                                onChangeText={(text) => setNewSession({ ...newSession, email: text })}
                                placeholder="Enter client email"
                                keyboardType="email-address"
                            />

                            <Text style={styles.inputLabel}>Session Type</Text>
                            <View style={styles.radioGroup}>
                                {['1on1', 'group', 'package'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newSession.sessionType === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewSession({ ...newSession, sessionType: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Duration (minutes)</Text>
                            <TextInput
                                style={styles.input}
                                value={newSession.duration?.toString()}
                                onChangeText={(text) => setNewSession({ ...newSession, duration: parseInt(text) || 0 })}
                                placeholder="Enter duration in minutes"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Amount ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newSession.amount?.toString()}
                                onChangeText={(text) => setNewSession({ ...newSession, amount: parseFloat(text) || 0 })}
                                placeholder="Enter session amount"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Notes</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newSession.notes}
                                onChangeText={(text) => setNewSession({ ...newSession, notes: text })}
                                placeholder="Enter session notes..."
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addSession}
                                >
                                    <Text style={styles.modalButtonText}>Book Session</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowSessionModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Package Modal */}
                <Modal
                    visible={showPackageModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowPackageModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Mentorship Package</Text>

                            <Text style={styles.inputLabel}>Package Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newPackage.name}
                                onChangeText={(text) => setNewPackage({ ...newPackage, name: text })}
                                placeholder="Enter package name"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newPackage.description}
                                onChangeText={(text) => setNewPackage({ ...newPackage, description: text })}
                                placeholder="Enter package description..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Number of Sessions</Text>
                            <TextInput
                                style={styles.input}
                                value={newPackage.sessions?.toString()}
                                onChangeText={(text) => setNewPackage({ ...newPackage, sessions: parseInt(text) || 0 })}
                                placeholder="Enter number of sessions"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Duration per Session (minutes)</Text>
                            <TextInput
                                style={styles.input}
                                value={newPackage.duration?.toString()}
                                onChangeText={(text) => setNewPackage({ ...newPackage, duration: parseInt(text) || 0 })}
                                placeholder="Enter duration per session"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Package Price ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newPackage.price?.toString()}
                                onChangeText={(text) => setNewPackage({ ...newPackage, price: parseFloat(text) || 0 })}
                                placeholder="Enter package price"
                                keyboardType="numeric"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addPackage}
                                >
                                    <Text style={styles.modalButtonText}>Create Package</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowPackageModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#667eea10',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    activeTabText: {
        color: '#667eea',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    sessionCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sessionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    sessionEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    sessionType: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    sessionDate: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    sessionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 8,
    },
    sessionNotes: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontStyle: 'italic',
    },
    goalsSection: {
        marginTop: 8,
    },
    goalsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    goalItem: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    packageCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    packageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    packageTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    packageDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    packageMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    packageSessions: {
        fontSize: 12,
        color: '#666',
    },
    packageDuration: {
        fontSize: 12,
        color: '#666',
    },
    packagePrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    packageStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#667eea',
    },
    statLabel: {
        fontSize: 10,
        color: '#666',
    },
    calendarCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    calendarTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    calendarDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    calendarCount: {
        fontSize: 14,
        color: '#667eea',
        fontWeight: 'bold',
    },
    calendarRevenue: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    availabilityButton: {
        backgroundColor: '#667eea',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    availabilityButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    radioGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
        gap: 8,
    },
    radioButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    radioButtonActive: {
        borderColor: '#667eea',
        backgroundColor: '#667eea10',
    },
    radioLabel: {
        fontSize: 14,
        color: '#333',
        textTransform: 'uppercase',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default MentorshipBookingScreen; 