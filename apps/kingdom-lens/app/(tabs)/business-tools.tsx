import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    Alert,
    Modal,
    TextInput,
    Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';

const { width, height } = Dimensions.get('window');

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'lead' | 'booked' | 'completed' | 'follow-up';
    sessionType: string;
    sessionDate: Date | null;
    notes: string;
    lastContact: Date;
    faithMode?: {
        name: string;
        notes: string;
    };
}

interface BookingLink {
    id: string;
    name: string;
    url: string;
    isActive: boolean;
    sessions: string[];
    expiresAt: Date | null;
}

interface Reminder {
    id: string;
    type: 'session-prep' | 'payment' | 'delivery' | 'follow-up';
    clientId: string;
    message: string;
    scheduledDate: Date;
    isSent: boolean;
    method: 'email' | 'sms';
}

const BusinessToolsScreen: React.FC = () => {
    const { faithMode } = useFaithMode();
    const [clients, setClients] = useState<Client[]>([]);
    const [bookingLinks, setBookingLinks] = useState<BookingLink[]>([]);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [showClientModal, setShowClientModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [activeTab, setActiveTab] = useState<'crm' | 'booking' | 'reminders'>('crm');

    // Mock data
    useEffect(() => {
        setClients([
            {
                id: '1',
                name: faithMode ? 'Sarah Johnson' : 'Sarah Johnson',
                email: 'sarah@example.com',
                phone: '(555) 123-4567',
                status: 'booked',
                sessionType: faithMode ? 'Family Portrait Session' : 'Family Portrait',
                sessionDate: new Date(Date.now() + 86400000 * 7),
                notes: faithMode ? 'Interested in outdoor family photos with natural light. Loves nature and wants to capture God\'s creation.' : 'Interested in outdoor family photos with natural light.',
                lastContact: new Date(Date.now() - 86400000 * 2),
                faithMode: {
                    name: 'Sarah Johnson',
                    notes: 'Interested in outdoor family photos with natural light. Loves nature and wants to capture God\'s creation.'
                }
            },
            {
                id: '2',
                name: faithMode ? 'Michael & Emily' : 'Michael & Emily',
                email: 'michael@example.com',
                phone: '(555) 987-6543',
                status: 'lead',
                sessionType: faithMode ? 'Engagement Session' : 'Engagement Session',
                sessionDate: null,
                notes: faithMode ? 'Newly engaged couple looking for romantic outdoor session. They want to celebrate their love story.' : 'Newly engaged couple looking for romantic outdoor session.',
                lastContact: new Date(Date.now() - 86400000 * 5),
                faithMode: {
                    name: 'Michael & Emily',
                    notes: 'Newly engaged couple looking for romantic outdoor session. They want to celebrate their love story.'
                }
            },
            {
                id: '3',
                name: faithMode ? 'Grace Williams' : 'Grace Williams',
                email: 'grace@example.com',
                phone: '(555) 456-7890',
                status: 'completed',
                sessionType: faithMode ? 'Senior Portrait Session' : 'Senior Portrait',
                sessionDate: new Date(Date.now() - 86400000 * 14),
                notes: faithMode ? 'High school senior who loves music and art. Wants creative, artistic portraits that reflect her personality and faith.' : 'High school senior who loves music and art. Wants creative, artistic portraits.',
                lastContact: new Date(Date.now() - 86400000 * 7),
                faithMode: {
                    name: 'Grace Williams',
                    notes: 'High school senior who loves music and art. Wants creative, artistic portraits that reflect her personality and faith.'
                }
            }
        ]);

        setBookingLinks([
            {
                id: '1',
                name: faithMode ? 'Family Portrait Booking' : 'Family Portrait Booking',
                url: 'https://kingdomlens.com/book/family',
                isActive: true,
                sessions: ['Family Portrait', 'Maternity', 'Newborn'],
                expiresAt: new Date(Date.now() + 86400000 * 30)
            },
            {
                id: '2',
                name: faithMode ? 'Engagement & Wedding' : 'Engagement & Wedding',
                url: 'https://kingdomlens.com/book/wedding',
                isActive: true,
                sessions: ['Engagement', 'Wedding', 'Bridal'],
                expiresAt: null
            }
        ]);

        setReminders([
            {
                id: '1',
                type: 'session-prep',
                clientId: '1',
                message: faithMode ? 'Your family portrait session is in 3 days! Remember to bring your favorite outfits and prepare your hearts for beautiful memories.' : 'Your family portrait session is in 3 days! Remember to bring your favorite outfits.',
                scheduledDate: new Date(Date.now() + 86400000 * 4),
                isSent: false,
                method: 'email'
            },
            {
                id: '2',
                type: 'payment',
                clientId: '2',
                message: faithMode ? 'Thank you for choosing us! Your session deposit is due. We\'re excited to capture your love story!' : 'Thank you for choosing us! Your session deposit is due.',
                scheduledDate: new Date(Date.now() + 86400000 * 2),
                isSent: false,
                method: 'sms'
            }
        ]);
    }, [faithMode]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'lead': return '#F59E0B';
            case 'booked': return '#10B981';
            case 'completed': return '#3B82F6';
            case 'follow-up': return '#8B5CF6';
            default: return '#64748B';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'lead': return faithMode ? 'New Lead' : 'Lead';
            case 'booked': return faithMode ? 'Booked' : 'Booked';
            case 'completed': return faithMode ? 'Completed' : 'Completed';
            case 'follow-up': return faithMode ? 'Follow Up' : 'Follow Up';
            default: return status;
        }
    };

    const createBookingLink = () => {
        const newLink: BookingLink = {
            id: Date.now().toString(),
            name: faithMode ? 'New Kingdom Session' : 'New Session',
            url: `https://kingdomlens.com/book/${Date.now()}`,
            isActive: true,
            sessions: ['Portrait', 'Family'],
            expiresAt: new Date(Date.now() + 86400000 * 30)
        };
        setBookingLinks([...bookingLinks, newLink]);
        setShowBookingModal(false);
    };

    const sendReminder = (reminderId: string) => {
        setReminders(reminders.map(r =>
            r.id === reminderId ? { ...r, isSent: true } : r
        ));
        Alert.alert(
            'Reminder Sent',
            faithMode ? 'Your message has been sent with love and care.' : 'Your reminder has been sent successfully.'
        );
    };

    const getFaithModeMessage = () => {
        const messages = [
            "Serve your clients with excellence and love.",
            "Every session is an opportunity to capture God's beauty.",
            "Build relationships that reflect Kingdom values.",
            "Your business is a ministry of capturing memories."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const renderClientCard = (client: Client) => (
        <TouchableOpacity
            key={client.id}
            style={styles.clientCard}
            onPress={() => {
                setSelectedClient(client);
                setShowClientModal(true);
            }}
        >
            <View style={styles.clientHeader}>
                <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>
                        {faithMode && client.faithMode ? client.faithMode.name : client.name}
                    </Text>
                    <Text style={styles.clientEmail}>{client.email}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(client.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(client.status) }]}>
                        {getStatusText(client.status)}
                    </Text>
                </View>
            </View>
            <Text style={styles.sessionType}>
                {faithMode && client.faithMode ? client.faithMode.notes : client.sessionType}
            </Text>
            {client.sessionDate && (
                <Text style={styles.sessionDate}>
                    Session: {client.sessionDate.toLocaleDateString()}
                </Text>
            )}
        </TouchableOpacity>
    );

    const renderBookingLink = (link: BookingLink) => (
        <View key={link.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
                <Text style={styles.bookingName}>{link.name}</Text>
                <Switch
                    value={link.isActive}
                    onValueChange={() => {
                        setBookingLinks(bookingLinks.map(l =>
                            l.id === link.id ? { ...l, isActive: !l.isActive } : l
                        ));
                    }}
                />
            </View>
            <Text style={styles.bookingUrl}>{link.url}</Text>
            <View style={styles.sessionsContainer}>
                {link.sessions.map(session => (
                    <View key={session} style={styles.sessionTag}>
                        <Text style={styles.sessionTagText}>{session}</Text>
                    </View>
                ))}
            </View>
            {link.expiresAt && (
                <Text style={styles.expiryDate}>
                    Expires: {link.expiresAt.toLocaleDateString()}
                </Text>
            )}
        </View>
    );

    const renderReminder = (reminder: Reminder) => {
        const client = clients.find(c => c.id === reminder.clientId);
        return (
            <View key={reminder.id} style={styles.reminderCard}>
                <View style={styles.reminderHeader}>
                    <Ionicons
                        name={reminder.method === 'email' ? 'mail' : 'chatbubble'}
                        size={20}
                        color="#3B82F6"
                    />
                    <Text style={styles.reminderType}>
                        {reminder.type === 'session-prep' ? 'Session Prep' :
                            reminder.type === 'payment' ? 'Payment' :
                                reminder.type === 'delivery' ? 'Delivery' : 'Follow Up'}
                    </Text>
                    <Text style={styles.reminderDate}>
                        {reminder.scheduledDate.toLocaleDateString()}
                    </Text>
                </View>
                <Text style={styles.reminderClient}>{client?.name}</Text>
                <Text style={styles.reminderMessage}>{reminder.message}</Text>
                {!reminder.isSent && (
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={() => sendReminder(reminder.id)}
                    >
                        <Text style={styles.sendButtonText}>Send Now</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {faithMode ? 'Kingdom Business Tools' : 'Business Tools'}
                </Text>
                {faithMode && (
                    <Text style={styles.faithMessage}>{getFaithModeMessage()}</Text>
                )}
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'crm' && styles.activeTab]}
                    onPress={() => setActiveTab('crm')}
                >
                    <Text style={[styles.tabText, activeTab === 'crm' && styles.activeTabText]}>
                        CRM
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'booking' && styles.activeTab]}
                    onPress={() => setActiveTab('booking')}
                >
                    <Text style={[styles.tabText, activeTab === 'booking' && styles.activeTabText]}>
                        Booking
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'reminders' && styles.activeTab]}
                    onPress={() => setActiveTab('reminders')}
                >
                    <Text style={[styles.tabText, activeTab === 'reminders' && styles.activeTabText]}>
                        Reminders
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {activeTab === 'crm' && (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Client Management</Text>
                            <TouchableOpacity style={styles.addButton}>
                                <Ionicons name="add" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        {clients.map(renderClientCard)}
                    </View>
                )}

                {activeTab === 'booking' && (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Booking Links</Text>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setShowBookingModal(true)}
                            >
                                <Ionicons name="add" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        {bookingLinks.map(renderBookingLink)}
                    </View>
                )}

                {activeTab === 'reminders' && (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Automated Reminders</Text>
                        </View>
                        {reminders.map(renderReminder)}
                    </View>
                )}
            </ScrollView>

            {/* Client Details Modal */}
            <Modal
                visible={showClientModal}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectedClient?.name}
                            </Text>
                            <TouchableOpacity onPress={() => setShowClientModal(false)}>
                                <Ionicons name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                        {selectedClient && (
                            <View>
                                <Text style={styles.modalLabel}>Email</Text>
                                <Text style={styles.modalValue}>{selectedClient.email}</Text>

                                <Text style={styles.modalLabel}>Phone</Text>
                                <Text style={styles.modalValue}>{selectedClient.phone}</Text>

                                <Text style={styles.modalLabel}>Session Type</Text>
                                <Text style={styles.modalValue}>{selectedClient.sessionType}</Text>

                                <Text style={styles.modalLabel}>Notes</Text>
                                <Text style={styles.modalValue}>
                                    {faithMode && selectedClient.faithMode ? selectedClient.faithMode.notes : selectedClient.notes}
                                </Text>

                                <TouchableOpacity style={styles.contactButton}>
                                    <Text style={styles.contactButtonText}>Contact Client</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Booking Link Modal */}
            <Modal
                visible={showBookingModal}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Create Booking Link</Text>
                            <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                                <Ionicons name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={styles.modalLabel}>Link Name</Text>
                            <TextInput style={styles.textInput} placeholder="Enter link name" />

                            <Text style={styles.modalLabel}>Sessions</Text>
                            <TextInput style={styles.textInput} placeholder="Portrait, Family, Wedding" />

                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={createBookingLink}
                            >
                                <Text style={styles.createButtonText}>Create Link</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        padding: 20,
        paddingBottom: 0,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    faithMessage: {
        fontSize: 16,
        color: '#64748B',
        fontStyle: 'italic',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#3B82F6',
    },
    tabText: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#3B82F6',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    addButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clientCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    clientHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    clientInfo: {
        flex: 1,
    },
    clientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    clientEmail: {
        fontSize: 14,
        color: '#64748B',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    sessionType: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
    },
    sessionDate: {
        fontSize: 12,
        color: '#64748B',
    },
    bookingCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bookingName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    bookingUrl: {
        fontSize: 14,
        color: '#3B82F6',
        marginBottom: 8,
    },
    sessionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    sessionTag: {
        backgroundColor: '#E0E7FF',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    sessionTagText: {
        fontSize: 12,
        color: '#3730A3',
    },
    expiryDate: {
        fontSize: 12,
        color: '#64748B',
    },
    reminderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    reminderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reminderType: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
        marginLeft: 8,
        flex: 1,
    },
    reminderDate: {
        fontSize: 12,
        color: '#64748B',
    },
    reminderClient: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    reminderMessage: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 12,
    },
    sendButton: {
        backgroundColor: '#10B981',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    modalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    modalValue: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 12,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 14,
    },
    contactButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: '#10B981',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BusinessToolsScreen; 