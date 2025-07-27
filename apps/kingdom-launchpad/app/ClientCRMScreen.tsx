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

interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status: 'active' | 'inactive' | 'prospect' | 'vip';
    totalSpent: number;
    lastPurchase?: Date;
    tags: string[];
    notes: string;
    goals: ClientGoal[];
    conversations: Conversation[];
    purchases: Purchase[];
    createdAt: Date;
}

interface ClientGoal {
    id: string;
    title: string;
    description: string;
    targetDate: Date;
    status: 'active' | 'completed' | 'cancelled';
    progress: number; // 0-100
}

interface Conversation {
    id: string;
    type: 'email' | 'phone' | 'meeting' | 'message';
    subject: string;
    content: string;
    date: Date;
    outcome?: string;
}

interface Purchase {
    id: string;
    productName: string;
    amount: number;
    date: Date;
    status: 'completed' | 'pending' | 'refunded';
    invoiceId?: string;
}

interface Contract {
    id: string;
    clientId: string;
    title: string;
    type: 'coaching' | 'consulting' | 'service' | 'product';
    amount: number;
    startDate: Date;
    endDate?: Date;
    status: 'draft' | 'sent' | 'signed' | 'completed';
    terms: string;
}

interface Invoice {
    id: string;
    clientId: string;
    contractId?: string;
    amount: number;
    dueDate: Date;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    items: InvoiceItem[];
    notes?: string;
}

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

const ClientCRMScreen: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedTab, setSelectedTab] = useState<'clients' | 'contracts' | 'invoices'>('clients');
    const [showClientModal, setShowClientModal] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [newClient, setNewClient] = useState<Partial<Client>>({});
    const [newContract, setNewContract] = useState<Partial<Contract>>({});
    const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({});

    // Mock data
    useEffect(() => {
        setClients([
            {
                id: '1',
                name: 'John Smith',
                email: 'john@example.com',
                phone: '+1-555-0123',
                status: 'active',
                totalSpent: 1250,
                lastPurchase: new Date('2024-01-15'),
                tags: ['vip', 'coaching', 'faith'],
                notes: 'Interested in 1:1 coaching sessions. Very engaged with faith-based content.',
                goals: [
                    {
                        id: '1',
                        title: 'Launch Online Course',
                        description: 'Create and launch a faith-based business course',
                        targetDate: new Date('2024-06-01'),
                        status: 'active',
                        progress: 65
                    }
                ],
                conversations: [
                    {
                        id: '1',
                        type: 'meeting',
                        subject: 'Initial Consultation',
                        content: 'Discussed business goals and faith integration',
                        date: new Date('2024-01-10'),
                        outcome: 'Scheduled follow-up coaching session'
                    }
                ],
                purchases: [
                    {
                        id: '1',
                        productName: 'Kingdom Business Course',
                        amount: 197,
                        date: new Date('2024-01-15'),
                        status: 'completed'
                    }
                ],
                createdAt: new Date('2024-01-01')
            },
            {
                id: '2',
                name: 'Sarah Johnson',
                email: 'sarah@example.com',
                status: 'prospect',
                totalSpent: 0,
                tags: ['prayer', 'freebie'],
                notes: 'Downloaded free prayer guide. Follow up needed.',
                goals: [],
                conversations: [
                    {
                        id: '2',
                        type: 'email',
                        subject: 'Prayer Guide Download',
                        content: 'Thank you for downloading our prayer guide!',
                        date: new Date('2024-01-20')
                    }
                ],
                purchases: [],
                createdAt: new Date('2024-01-20')
            }
        ]);

        setContracts([
            {
                id: '1',
                clientId: '1',
                title: '1:1 Coaching Agreement',
                type: 'coaching',
                amount: 500,
                startDate: new Date('2024-02-01'),
                endDate: new Date('2024-05-01'),
                status: 'signed',
                terms: 'Monthly coaching sessions focusing on business growth and faith integration.'
            }
        ]);

        setInvoices([
            {
                id: '1',
                clientId: '1',
                contractId: '1',
                amount: 500,
                dueDate: new Date('2024-02-15'),
                status: 'paid',
                items: [
                    {
                        id: '1',
                        description: '1:1 Coaching Session - February',
                        quantity: 1,
                        unitPrice: 500,
                        total: 500
                    }
                ]
            }
        ]);
    }, []);

    const addClient = () => {
        if (!newClient.name || !newClient.email) {
            Alert.alert('Error', 'Please fill in name and email');
            return;
        }

        const client: Client = {
            id: Date.now().toString(),
            name: newClient.name,
            email: newClient.email,
            phone: newClient.phone,
            status: newClient.status || 'prospect',
            totalSpent: 0,
            tags: newClient.tags || [],
            notes: newClient.notes || '',
            goals: [],
            conversations: [],
            purchases: [],
            createdAt: new Date()
        };

        setClients([...clients, client]);
        setNewClient({});
        setShowClientModal(false);
        Alert.alert('Success', 'Client added successfully!');
    };

    const createContract = () => {
        if (!newContract.title || !newContract.clientId || !newContract.amount) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const contract: Contract = {
            id: Date.now().toString(),
            title: newContract.title,
            clientId: newContract.clientId,
            type: newContract.type || 'coaching',
            amount: parseFloat(newContract.amount.toString()),
            startDate: newContract.startDate || new Date(),
            endDate: newContract.endDate,
            status: 'draft',
            terms: newContract.terms || ''
        };

        setContracts([...contracts, contract]);
        setNewContract({});
        setShowContractModal(false);
        Alert.alert('Success', 'Contract created successfully!');
    };

    const createInvoice = () => {
        if (!newInvoice.clientId || !newInvoice.amount) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const invoice: Invoice = {
            id: Date.now().toString(),
            clientId: newInvoice.clientId,
            contractId: newInvoice.contractId,
            amount: parseFloat(newInvoice.amount.toString()),
            dueDate: newInvoice.dueDate || new Date(),
            status: 'draft',
            items: newInvoice.items || []
        };

        setInvoices([...invoices, invoice]);
        setNewInvoice({});
        setShowInvoiceModal(false);
        Alert.alert('Success', 'Invoice created successfully!');
    };

    const getClientById = (id: string) => clients.find(c => c.id === id);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#4CAF50';
            case 'vip': return '#FF9800';
            case 'prospect': return '#2196F3';
            case 'inactive': return '#999';
            default: return '#666';
        }
    };

    const renderClients = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>👥 Clients ({clients.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowClientModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Client</Text>
                </TouchableOpacity>
            </View>

            {clients.map(client => (
                <TouchableOpacity
                    key={client.id}
                    style={styles.clientCard}
                    onPress={() => setSelectedClient(client)}
                >
                    <View style={styles.clientHeader}>
                        <Text style={styles.clientName}>{client.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(client.status) }]}>
                            <Text style={styles.statusText}>{client.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.clientEmail}>{client.email}</Text>
                    <View style={styles.clientMeta}>
                        <Text style={styles.clientSpent}>${client.totalSpent}</Text>
                        <Text style={styles.clientPurchases}>{client.purchases.length} purchases</Text>
                        <Text style={styles.clientGoals}>{client.goals.length} goals</Text>
                    </View>
                    <View style={styles.clientTags}>
                        {client.tags.map(tag => (
                            <Text key={tag} style={styles.tag}>{tag}</Text>
                        ))}
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderContracts = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📋 Contracts ({contracts.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowContractModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Contract</Text>
                </TouchableOpacity>
            </View>

            {contracts.map(contract => {
                const client = getClientById(contract.clientId);
                return (
                    <View key={contract.id} style={styles.contractCard}>
                        <View style={styles.contractHeader}>
                            <Text style={styles.contractTitle}>{contract.title}</Text>
                            <Text style={styles.contractStatus}>{contract.status}</Text>
                        </View>
                        <Text style={styles.contractClient}>{client?.name || 'Unknown Client'}</Text>
                        <Text style={styles.contractAmount}>${contract.amount}</Text>
                        <View style={styles.contractMeta}>
                            <Text style={styles.contractType}>{contract.type}</Text>
                            <Text style={styles.contractDate}>
                                {contract.startDate.toLocaleDateString()} - {contract.endDate?.toLocaleDateString() || 'Ongoing'}
                            </Text>
                        </View>
                        <View style={styles.contractActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="eye" size={16} color="#2196F3" />
                                <Text style={styles.actionText}>View</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="document" size={16} color="#4CAF50" />
                                <Text style={styles.actionText}>Generate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="mail" size={16} color="#FF9800" />
                                <Text style={styles.actionText}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}
        </View>
    );

    const renderInvoices = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>💰 Invoices ({invoices.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowInvoiceModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Invoice</Text>
                </TouchableOpacity>
            </View>

            {invoices.map(invoice => {
                const client = getClientById(invoice.clientId);
                return (
                    <View key={invoice.id} style={styles.invoiceCard}>
                        <View style={styles.invoiceHeader}>
                            <Text style={styles.invoiceId}>#{invoice.id}</Text>
                            <Text style={styles.invoiceStatus}>{invoice.status}</Text>
                        </View>
                        <Text style={styles.invoiceClient}>{client?.name || 'Unknown Client'}</Text>
                        <Text style={styles.invoiceAmount}>${invoice.amount}</Text>
                        <Text style={styles.invoiceDue}>Due: {invoice.dueDate.toLocaleDateString()}</Text>
                        <View style={styles.invoiceActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="eye" size={16} color="#2196F3" />
                                <Text style={styles.actionText}>View</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="document" size={16} color="#4CAF50" />
                                <Text style={styles.actionText}>Generate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="mail" size={16} color="#FF9800" />
                                <Text style={styles.actionText}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>👥 Client CRM</Text>
                <Text style={styles.headerSubtitle}>Manage clients, contracts, and invoices</Text>
            </LinearGradient>

            <View style={styles.tabs}>
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
                    style={[styles.tab, selectedTab === 'contracts' && styles.activeTab]}
                    onPress={() => setSelectedTab('contracts')}
                >
                    <Ionicons name="document-text" size={20} color={selectedTab === 'contracts' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'contracts' && styles.activeTabText]}>
                        Contracts
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'invoices' && styles.activeTab]}
                    onPress={() => setSelectedTab('invoices')}
                >
                    <Ionicons name="card" size={20} color={selectedTab === 'invoices' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'invoices' && styles.activeTabText]}>
                        Invoices
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{clients.length}</Text>
                        <Text style={styles.statLabel}>Total Clients</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{contracts.length}</Text>
                        <Text style={styles.statLabel}>Active Contracts</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{invoices.length}</Text>
                        <Text style={styles.statLabel}>Invoices</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            ${clients.reduce((sum, c) => sum + c.totalSpent, 0)}
                        </Text>
                        <Text style={styles.statLabel}>Total Revenue</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'clients' && renderClients()}
                {selectedTab === 'contracts' && renderContracts()}
                {selectedTab === 'invoices' && renderInvoices()}

                {/* Client Modal */}
                <Modal
                    visible={showClientModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowClientModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add New Client</Text>

                            <Text style={styles.inputLabel}>Name</Text>
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

                            <Text style={styles.inputLabel}>Phone (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={newClient.phone}
                                onChangeText={(text) => setNewClient({ ...newClient, phone: text })}
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.inputLabel}>Status</Text>
                            <View style={styles.radioGroup}>
                                {['prospect', 'active', 'vip', 'inactive'].map(status => (
                                    <TouchableOpacity
                                        key={status}
                                        style={[
                                            styles.radioButton,
                                            newClient.status === status && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewClient({ ...newClient, status: status as any })}
                                    >
                                        <Text style={styles.radioLabel}>{status}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Notes</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newClient.notes}
                                onChangeText={(text) => setNewClient({ ...newClient, notes: text })}
                                placeholder="Add client notes..."
                                multiline
                                textAlignVertical="top"
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

                {/* Contract Modal */}
                <Modal
                    visible={showContractModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowContractModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Contract</Text>

                            <Text style={styles.inputLabel}>Contract Title</Text>
                            <TextInput
                                style={styles.input}
                                value={newContract.title}
                                onChangeText={(text) => setNewContract({ ...newContract, title: text })}
                                placeholder="e.g., 1:1 Coaching Agreement"
                            />

                            <Text style={styles.inputLabel}>Client</Text>
                            <View style={styles.dropdown}>
                                {clients.map(client => (
                                    <TouchableOpacity
                                        key={client.id}
                                        style={[
                                            styles.dropdownOption,
                                            newContract.clientId === client.id && styles.dropdownOptionSelected
                                        ]}
                                        onPress={() => setNewContract({ ...newContract, clientId: client.id })}
                                    >
                                        <Text style={styles.dropdownOptionText}>{client.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Contract Type</Text>
                            <View style={styles.radioGroup}>
                                {['coaching', 'consulting', 'service', 'product'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newContract.type === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewContract({ ...newContract, type: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Amount ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newContract.amount?.toString()}
                                onChangeText={(text) => setNewContract({ ...newContract, amount: parseFloat(text) || 0 })}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Terms</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newContract.terms}
                                onChangeText={(text) => setNewContract({ ...newContract, terms: text })}
                                placeholder="Enter contract terms..."
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createContract}
                                >
                                    <Text style={styles.modalButtonText}>Create Contract</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowContractModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Invoice Modal */}
                <Modal
                    visible={showInvoiceModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowInvoiceModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Invoice</Text>

                            <Text style={styles.inputLabel}>Client</Text>
                            <View style={styles.dropdown}>
                                {clients.map(client => (
                                    <TouchableOpacity
                                        key={client.id}
                                        style={[
                                            styles.dropdownOption,
                                            newInvoice.clientId === client.id && styles.dropdownOptionSelected
                                        ]}
                                        onPress={() => setNewInvoice({ ...newInvoice, clientId: client.id })}
                                    >
                                        <Text style={styles.dropdownOptionText}>{client.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Amount ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newInvoice.amount?.toString()}
                                onChangeText={(text) => setNewInvoice({ ...newInvoice, amount: parseFloat(text) || 0 })}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Due Date</Text>
                            <TextInput
                                style={styles.input}
                                value={newInvoice.dueDate?.toLocaleDateString()}
                                placeholder="Select due date"
                                onFocus={() => {
                                    // In a real app, you'd show a date picker here
                                    setNewInvoice({ ...newInvoice, dueDate: new Date() });
                                }}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createInvoice}
                                >
                                    <Text style={styles.modalButtonText}>Create Invoice</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowInvoiceModal(false)}
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
        marginBottom: 4,
    },
    clientName: {
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
    clientEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    clientMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    clientSpent: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    clientPurchases: {
        fontSize: 12,
        color: '#666',
    },
    clientGoals: {
        fontSize: 12,
        color: '#666',
    },
    clientTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#667eea',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 4,
        marginBottom: 2,
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
        marginBottom: 4,
    },
    contractTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    contractStatus: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    contractClient: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    contractAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 8,
    },
    contractMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    contractType: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    contractDate: {
        fontSize: 12,
        color: '#666',
    },
    contractActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    actionText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
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
        marginBottom: 4,
    },
    invoiceId: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    invoiceStatus: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    invoiceClient: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    invoiceAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 4,
    },
    invoiceDue: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    invoiceActions: {
        flexDirection: 'row',
        gap: 12,
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
    dropdown: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 16,
    },
    dropdownOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownOptionSelected: {
        backgroundColor: '#667eea10',
    },
    dropdownOptionText: {
        fontSize: 14,
        color: '#333',
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

export default ClientCRMScreen; 