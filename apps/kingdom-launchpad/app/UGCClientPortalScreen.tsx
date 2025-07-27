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
    Switch,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface UGCOrder {
    id: string;
    clientName: string;
    clientEmail: string;
    videoType: 'testimonial' | 'product-review' | 'tutorial' | 'lifestyle' | 'brand-story';
    tone: 'professional' | 'casual' | 'enthusiastic' | 'authentic' | 'faith-based';
    platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'linkedin';
    requirements: string;
    status: 'pending' | 'in-progress' | 'review' | 'delivered' | 'revision';
    budget: number;
    deadline: Date;
    createdAt: Date;
    deliveredFiles: UGCDelivery[];
    contracts: Contract[];
    invoices: Invoice[];
}

interface UGCDelivery {
    id: string;
    orderId: string;
    fileUrl: string;
    fileType: 'video' | 'image' | 'audio';
    description: string;
    uploadedAt: Date;
    isWatermarked: boolean;
    isFinal: boolean;
}

interface Contract {
    id: string;
    orderId: string;
    contractUrl: string;
    status: 'draft' | 'sent' | 'signed' | 'expired';
    sentAt: Date;
    signedAt?: Date;
}

interface Invoice {
    id: string;
    orderId: string;
    amount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    dueDate: Date;
    paidAt?: Date;
}

interface UGCClient {
    id: string;
    name: string;
    email: string;
    company: string;
    totalOrders: number;
    totalSpent: number;
    lastOrder: Date;
    isActive: boolean;
}

const UGCClientPortalScreen: React.FC = () => {
    const [ugcOrders, setUgcOrders] = useState<UGCOrder[]>([]);
    const [clients, setClients] = useState<UGCClient[]>([]);
    const [selectedTab, setSelectedTab] = useState<'orders' | 'clients' | 'deliveries' | 'contracts'>('orders');
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showClientModal, setShowClientModal] = useState(false);
    const [newOrder, setNewOrder] = useState<Partial<UGCOrder>>({});
    const [newClient, setNewClient] = useState<Partial<UGCClient>>({});
    const [selectedOrder, setSelectedOrder] = useState<UGCOrder | null>(null);

    // Mock data
    useEffect(() => {
        setUgcOrders([
            {
                id: '1',
                clientName: 'Sarah Johnson',
                clientEmail: 'sarah@faithbusiness.com',
                videoType: 'testimonial',
                tone: 'authentic',
                platform: 'instagram',
                requirements: 'Need a 60-second testimonial about how our course changed her business approach. Should include before/after results.',
                status: 'in-progress',
                budget: 500,
                deadline: new Date('2024-02-15'),
                createdAt: new Date('2024-01-20'),
                deliveredFiles: [
                    {
                        id: '1',
                        orderId: '1',
                        fileUrl: 'https://example.com/video1.mp4',
                        fileType: 'video',
                        description: 'First draft - testimonial video',
                        uploadedAt: new Date('2024-01-25'),
                        isWatermarked: true,
                        isFinal: false
                    }
                ],
                contracts: [
                    {
                        id: '1',
                        orderId: '1',
                        contractUrl: 'https://example.com/contract1.pdf',
                        status: 'signed',
                        sentAt: new Date('2024-01-21'),
                        signedAt: new Date('2024-01-22')
                    }
                ],
                invoices: [
                    {
                        id: '1',
                        orderId: '1',
                        amount: 500,
                        status: 'paid',
                        dueDate: new Date('2024-02-01'),
                        paidAt: new Date('2024-01-25')
                    }
                ]
            },
            {
                id: '2',
                clientName: 'Mike Davis',
                clientEmail: 'mike@kingdomcoaching.com',
                videoType: 'product-review',
                tone: 'enthusiastic',
                platform: 'tiktok',
                requirements: '30-second TikTok review of our business coaching program. Include specific results and call-to-action.',
                status: 'pending',
                budget: 300,
                deadline: new Date('2024-02-20'),
                createdAt: new Date('2024-01-22'),
                deliveredFiles: [],
                contracts: [],
                invoices: []
            }
        ]);

        setClients([
            {
                id: '1',
                name: 'Sarah Johnson',
                email: 'sarah@faithbusiness.com',
                company: 'Faith Business Solutions',
                totalOrders: 3,
                totalSpent: 1200,
                lastOrder: new Date('2024-01-20'),
                isActive: true
            },
            {
                id: '2',
                name: 'Mike Davis',
                email: 'mike@kingdomcoaching.com',
                company: 'Kingdom Coaching',
                totalOrders: 1,
                totalSpent: 300,
                lastOrder: new Date('2024-01-22'),
                isActive: true
            }
        ]);
    }, []);

    const createUGCOrder = () => {
        if (!newOrder.clientName || !newOrder.clientEmail || !newOrder.videoType) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const order: UGCOrder = {
            id: Date.now().toString(),
            clientName: newOrder.clientName,
            clientEmail: newOrder.clientEmail,
            videoType: newOrder.videoType,
            tone: newOrder.tone || 'professional',
            platform: newOrder.platform || 'instagram',
            requirements: newOrder.requirements || '',
            status: 'pending',
            budget: newOrder.budget || 0,
            deadline: newOrder.deadline || new Date(),
            createdAt: new Date(),
            deliveredFiles: [],
            contracts: [],
            invoices: []
        };

        setUgcOrders([...ugcOrders, order]);
        setNewOrder({});
        setShowOrderModal(false);
        Alert.alert('Success', 'UGC order created successfully!');
    };

    const addClient = () => {
        if (!newClient.name || !newClient.email) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const client: UGCClient = {
            id: Date.now().toString(),
            name: newClient.name,
            email: newClient.email,
            company: newClient.company || '',
            totalOrders: 0,
            totalSpent: 0,
            lastOrder: new Date(),
            isActive: true
        };

        setClients([...clients, client]);
        setNewClient({});
        setShowClientModal(false);
        Alert.alert('Success', 'Client added successfully!');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FF9800';
            case 'in-progress': return '#2196F3';
            case 'review': return '#9C27B0';
            case 'delivered': return '#4CAF50';
            case 'revision': return '#f44336';
            default: return '#666';
        }
    };

    const getVideoTypeIcon = (type: string) => {
        switch (type) {
            case 'testimonial': return 'chatbubble-ellipses';
            case 'product-review': return 'star';
            case 'tutorial': return 'school';
            case 'lifestyle': return 'heart';
            case 'brand-story': return 'book';
            default: return 'videocam';
        }
    };

    const renderOrders = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📹 UGC Orders ({ugcOrders.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowOrderModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>New Order</Text>
                </TouchableOpacity>
            </View>

            {ugcOrders.map(order => (
                <TouchableOpacity
                    key={order.id}
                    style={styles.orderCard}
                    onPress={() => setSelectedOrder(order)}
                >
                    <View style={styles.orderHeader}>
                        <Ionicons name={getVideoTypeIcon(order.videoType) as any} size={20} color="#667eea" />
                        <Text style={styles.orderClient}>{order.clientName}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                            <Text style={styles.statusText}>{order.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.orderType}>{order.videoType} • {order.tone} • {order.platform}</Text>
                    <Text style={styles.orderRequirements}>{order.requirements}</Text>
                    <View style={styles.orderMeta}>
                        <Text style={styles.orderBudget}>${order.budget}</Text>
                        <Text style={styles.orderDeadline}>Due: {order.deadline.toLocaleDateString()}</Text>
                        <Text style={styles.orderDate}>{order.createdAt.toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.orderStats}>
                        <Text style={styles.statItem}>📁 {order.deliveredFiles.length} files</Text>
                        <Text style={styles.statItem}>📄 {order.contracts.length} contracts</Text>
                        <Text style={styles.statItem}>💰 {order.invoices.length} invoices</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderClients = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>👥 UGC Clients ({clients.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowClientModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Client</Text>
                </TouchableOpacity>
            </View>

            {clients.map(client => (
                <View key={client.id} style={styles.clientCard}>
                    <View style={styles.clientHeader}>
                        <Text style={styles.clientName}>{client.name}</Text>
                        <View style={[styles.activeBadge, { backgroundColor: client.isActive ? '#4CAF50' : '#f44336' }]}>
                            <Text style={styles.activeBadgeText}>{client.isActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                    </View>
                    <Text style={styles.clientEmail}>{client.email}</Text>
                    <Text style={styles.clientCompany}>{client.company}</Text>
                    <View style={styles.clientStats}>
                        <View style={styles.clientStat}>
                            <Text style={styles.statNumber}>{client.totalOrders}</Text>
                            <Text style={styles.statLabel}>Orders</Text>
                        </View>
                        <View style={styles.clientStat}>
                            <Text style={styles.statNumber}>${client.totalSpent}</Text>
                            <Text style={styles.statLabel}>Spent</Text>
                        </View>
                        <View style={styles.clientStat}>
                            <Text style={styles.statNumber}>{client.lastOrder.toLocaleDateString()}</Text>
                            <Text style={styles.statLabel}>Last Order</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderDeliveries = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📦 Content Deliveries</Text>
            <Text style={styles.sectionDescription}>
                Manage delivered files and revisions
            </Text>

            {ugcOrders.map(order =>
                order.deliveredFiles.map(file => (
                    <View key={file.id} style={styles.deliveryCard}>
                        <View style={styles.deliveryHeader}>
                            <Ionicons name="videocam" size={20} color="#667eea" />
                            <Text style={styles.deliveryTitle}>{file.description}</Text>
                            <View style={[styles.finalBadge, { backgroundColor: file.isFinal ? '#4CAF50' : '#FF9800' }]}>
                                <Text style={styles.finalBadgeText}>{file.isFinal ? 'Final' : 'Draft'}</Text>
                            </View>
                        </View>
                        <Text style={styles.deliveryClient}>For: {order.clientName}</Text>
                        <Text style={styles.deliveryType}>{file.fileType} • {file.uploadedAt.toLocaleDateString()}</Text>
                        <View style={styles.deliveryMeta}>
                            <Text style={styles.watermarkText}>
                                {file.isWatermarked ? '🔒 Watermarked' : '✅ Clean'}
                            </Text>
                            <Text style={styles.fileUrl}>{file.fileUrl}</Text>
                        </View>
                    </View>
                ))
            )}
        </View>
    );

    const renderContracts = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📄 Contracts & Invoices</Text>
            <Text style={styles.sectionDescription}>
                Track contract status and payment
            </Text>

            {ugcOrders.map(order =>
                order.contracts.map(contract => (
                    <View key={contract.id} style={styles.contractCard}>
                        <View style={styles.contractHeader}>
                            <Text style={styles.contractTitle}>Contract for {order.clientName}</Text>
                            <View style={[styles.contractStatus, { backgroundColor: getStatusColor(contract.status) }]}>
                                <Text style={styles.contractStatusText}>{contract.status}</Text>
                            </View>
                        </View>
                        <Text style={styles.contractDate}>Sent: {contract.sentAt.toLocaleDateString()}</Text>
                        {contract.signedAt && (
                            <Text style={styles.contractSigned}>Signed: {contract.signedAt.toLocaleDateString()}</Text>
                        )}
                        <Text style={styles.contractUrl}>{contract.contractUrl}</Text>
                    </View>
                ))
            )}

            {ugcOrders.map(order =>
                order.invoices.map(invoice => (
                    <View key={invoice.id} style={styles.invoiceCard}>
                        <View style={styles.invoiceHeader}>
                            <Text style={styles.invoiceTitle}>Invoice for {order.clientName}</Text>
                            <View style={[styles.invoiceStatus, { backgroundColor: getStatusColor(invoice.status) }]}>
                                <Text style={styles.invoiceStatusText}>{invoice.status}</Text>
                            </View>
                        </View>
                        <Text style={styles.invoiceAmount}>${invoice.amount}</Text>
                        <Text style={styles.invoiceDue}>Due: {invoice.dueDate.toLocaleDateString()}</Text>
                        {invoice.paidAt && (
                            <Text style={styles.invoicePaid}>Paid: {invoice.paidAt.toLocaleDateString()}</Text>
                        )}
                    </View>
                ))
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>📹 UGC Client Portal</Text>
                <Text style={styles.headerSubtitle}>Manage User-Generated Content orders and delivery</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'orders' && styles.activeTab]}
                    onPress={() => setSelectedTab('orders')}
                >
                    <Ionicons name="videocam" size={20} color={selectedTab === 'orders' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'orders' && styles.activeTabText]}>
                        Orders
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'clients' && styles.activeTab]}
                    onPress={() => setSelectedTab('clients')}
                >
                    <Ionicons name="people" size={20} color={selectedTab === 'clients' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'clients' && styles.activeTabText]}>
                        Clients
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'deliveries' && styles.activeTab]}
                    onPress={() => setSelectedTab('deliveries')}
                >
                    <Ionicons name="folder" size={20} color={selectedTab === 'deliveries' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'deliveries' && styles.activeTabText]}>
                        Deliveries
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'contracts' && styles.activeTab]}
                    onPress={() => setSelectedTab('contracts')}
                >
                    <Ionicons name="document" size={20} color={selectedTab === 'contracts' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'contracts' && styles.activeTabText]}>
                        Contracts
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{ugcOrders.length}</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{clients.length}</Text>
                        <Text style={styles.statLabel}>Clients</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {ugcOrders.reduce((sum, order) => sum + order.deliveredFiles.length, 0)}
                        </Text>
                        <Text style={styles.statLabel}>Deliveries</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            ${ugcOrders.reduce((sum, order) => sum + order.budget, 0)}
                        </Text>
                        <Text style={styles.statLabel}>Revenue</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'orders' && renderOrders()}
                {selectedTab === 'clients' && renderClients()}
                {selectedTab === 'deliveries' && renderDeliveries()}
                {selectedTab === 'contracts' && renderContracts()}

                {/* Order Modal */}
                <Modal
                    visible={showOrderModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowOrderModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create UGC Order</Text>

                            <Text style={styles.inputLabel}>Client Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newOrder.clientName}
                                onChangeText={(text) => setNewOrder({ ...newOrder, clientName: text })}
                                placeholder="Enter client name"
                            />

                            <Text style={styles.inputLabel}>Client Email</Text>
                            <TextInput
                                style={styles.input}
                                value={newOrder.clientEmail}
                                onChangeText={(text) => setNewOrder({ ...newOrder, clientEmail: text })}
                                placeholder="Enter client email"
                                keyboardType="email-address"
                            />

                            <Text style={styles.inputLabel}>Video Type</Text>
                            <View style={styles.radioGroup}>
                                {['testimonial', 'product-review', 'tutorial', 'lifestyle', 'brand-story'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newOrder.videoType === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewOrder({ ...newOrder, videoType: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Tone</Text>
                            <View style={styles.radioGroup}>
                                {['professional', 'casual', 'enthusiastic', 'authentic', 'faith-based'].map(tone => (
                                    <TouchableOpacity
                                        key={tone}
                                        style={[
                                            styles.radioButton,
                                            newOrder.tone === tone && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewOrder({ ...newOrder, tone: tone as any })}
                                    >
                                        <Text style={styles.radioLabel}>{tone}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Platform</Text>
                            <View style={styles.radioGroup}>
                                {['tiktok', 'instagram', 'youtube', 'facebook', 'linkedin'].map(platform => (
                                    <TouchableOpacity
                                        key={platform}
                                        style={[
                                            styles.radioButton,
                                            newOrder.platform === platform && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewOrder({ ...newOrder, platform: platform as any })}
                                    >
                                        <Text style={styles.radioLabel}>{platform}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Requirements</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newOrder.requirements}
                                onChangeText={(text) => setNewOrder({ ...newOrder, requirements: text })}
                                placeholder="Describe the video requirements..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Budget ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newOrder.budget?.toString()}
                                onChangeText={(text) => setNewOrder({ ...newOrder, budget: parseInt(text) || 0 })}
                                placeholder="Enter budget amount"
                                keyboardType="numeric"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createUGCOrder}
                                >
                                    <Text style={styles.modalButtonText}>Create Order</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowOrderModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Client Modal */}
                <Modal
                    visible={showClientModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowClientModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add UGC Client</Text>

                            <Text style={styles.inputLabel}>Client Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newClient.name}
                                onChangeText={(text) => setNewClient({ ...newClient, name: text })}
                                placeholder="Enter client name"
                            />

                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={newClient.email}
                                onChangeText={(text) => setNewClient({ ...newClient, email: text })}
                                placeholder="Enter email address"
                                keyboardType="email-address"
                            />

                            <Text style={styles.inputLabel}>Company (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={newClient.company}
                                onChangeText={(text) => setNewClient({ ...newClient, company: text })}
                                placeholder="Enter company name"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addClient}
                                >
                                    <Text style={styles.modalButtonText}>Add Client</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowClientModal(false)}
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
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
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
    orderCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    orderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    orderClient: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
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
    orderType: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    orderRequirements: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    orderMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderBudget: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    orderDeadline: {
        fontSize: 12,
        color: '#666',
    },
    orderDate: {
        fontSize: 12,
        color: '#999',
    },
    orderStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        fontSize: 12,
        color: '#666',
    },
    clientCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    clientHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    clientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    activeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeBadgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    clientEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    clientCompany: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    clientStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    clientStat: {
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
    deliveryCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    deliveryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    deliveryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    finalBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    finalBadgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    deliveryClient: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    deliveryType: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    deliveryMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    watermarkText: {
        fontSize: 12,
        color: '#666',
    },
    fileUrl: {
        fontSize: 10,
        color: '#999',
    },
    contractCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    contractHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    contractTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    contractStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    contractStatusText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    contractDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    contractSigned: {
        fontSize: 12,
        color: '#4CAF50',
        marginBottom: 4,
    },
    contractUrl: {
        fontSize: 10,
        color: '#999',
    },
    invoiceCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    invoiceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    invoiceStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    invoiceStatusText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    invoiceAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 4,
    },
    invoiceDue: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    invoicePaid: {
        fontSize: 12,
        color: '#4CAF50',
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
        textTransform: 'capitalize',
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

export default UGCClientPortalScreen; 