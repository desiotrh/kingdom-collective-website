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

interface FreelanceService {
    id: string;
    title: string;
    description: string;
    category: 'writing' | 'design' | 'marketing' | 'consulting' | 'other';
    price: number;
    deliveryTime: string;
    revisions: number;
    isActive: boolean;
    orders: number;
    revenue: number;
    rating: number;
    createdAt: Date;
}

interface ClientContract {
    id: string;
    clientName: string;
    serviceId: string;
    projectTitle: string;
    amount: number;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    startDate: Date;
    dueDate: Date;
    milestones: Milestone[];
    createdAt: Date;
}

interface Milestone {
    id: string;
    title: string;
    description: string;
    amount: number;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: Date;
}

const FreelanceToolsetScreen: React.FC = () => {
    const [services, setServices] = useState<FreelanceService[]>([]);
    const [contracts, setContracts] = useState<ClientContract[]>([]);
    const [selectedTab, setSelectedTab] = useState<'services' | 'contracts' | 'portfolio'>('services');
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const [newService, setNewService] = useState<Partial<FreelanceService>>({});
    const [newContract, setNewContract] = useState<Partial<ClientContract>>({});

    useEffect(() => {
        setServices([
            {
                id: '1',
                title: 'Faith-Based Content Writing',
                description: 'Professional content writing for faith-based businesses and ministries',
                category: 'writing',
                price: 150,
                deliveryTime: '3-5 days',
                revisions: 2,
                isActive: true,
                orders: 12,
                revenue: 1800,
                rating: 4.9,
                createdAt: new Date('2024-01-15')
            }
        ]);

        setContracts([
            {
                id: '1',
                clientName: 'Kingdom Ministries',
                serviceId: '1',
                projectTitle: 'Website Content Creation',
                amount: 500,
                status: 'active',
                startDate: new Date('2024-01-20'),
                dueDate: new Date('2024-02-20'),
                milestones: [
                    {
                        id: '1',
                        title: 'Homepage Content',
                        description: 'Write compelling homepage copy',
                        amount: 200,
                        status: 'completed',
                        dueDate: new Date('2024-01-25')
                    },
                    {
                        id: '2',
                        title: 'About Page',
                        description: 'Create about page content',
                        amount: 150,
                        status: 'in-progress',
                        dueDate: new Date('2024-02-05')
                    }
                ],
                createdAt: new Date('2024-01-20')
            }
        ]);
    }, []);

    const addService = () => {
        if (!newService.title || !newService.description) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const service: FreelanceService = {
            id: Date.now().toString(),
            title: newService.title,
            description: newService.description,
            category: newService.category || 'other',
            price: newService.price || 0,
            deliveryTime: newService.deliveryTime || '1 week',
            revisions: newService.revisions || 1,
            isActive: true,
            orders: 0,
            revenue: 0,
            rating: 0,
            createdAt: new Date()
        };

        setServices([...services, service]);
        setNewService({});
        setShowServiceModal(false);
        Alert.alert('Success', 'Service added successfully!');
    };

    const addContract = () => {
        if (!newContract.clientName || !newContract.projectTitle) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const contract: ClientContract = {
            id: Date.now().toString(),
            clientName: newContract.clientName,
            serviceId: newContract.serviceId || '',
            projectTitle: newContract.projectTitle,
            amount: newContract.amount || 0,
            status: 'pending',
            startDate: new Date(),
            dueDate: newContract.dueDate || new Date(),
            milestones: [],
            createdAt: new Date()
        };

        setContracts([...contracts, contract]);
        setNewContract({});
        setShowContractModal(false);
        Alert.alert('Success', 'Contract added successfully!');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FF9800';
            case 'active': return '#4CAF50';
            case 'completed': return '#2196F3';
            case 'cancelled': return '#f44336';
            default: return '#666';
        }
    };

    const renderServices = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>💼 Services ({services.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowServiceModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Service</Text>
                </TouchableOpacity>
            </View>

            {services.map(service => (
                <View key={service.id} style={styles.serviceCard}>
                    <View style={styles.serviceHeader}>
                        <Text style={styles.serviceTitle}>{service.title}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: service.isActive ? '#4CAF50' : '#f44336' }]}>
                            <Text style={styles.statusText}>{service.isActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                    </View>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                    <View style={styles.serviceMeta}>
                        <Text style={styles.serviceCategory}>{service.category}</Text>
                        <Text style={styles.servicePrice}>${service.price}</Text>
                        <Text style={styles.serviceDelivery}>{service.deliveryTime}</Text>
                    </View>
                    <View style={styles.serviceStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{service.orders}</Text>
                            <Text style={styles.statLabel}>Orders</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>${service.revenue}</Text>
                            <Text style={styles.statLabel}>Revenue</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{service.rating}</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{service.revisions}</Text>
                            <Text style={styles.statLabel}>Revisions</Text>
                        </View>
                    </View>
                </View>
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
                    <Text style={styles.addButtonText}>Add Contract</Text>
                </TouchableOpacity>
            </View>

            {contracts.map(contract => (
                <View key={contract.id} style={styles.contractCard}>
                    <View style={styles.contractHeader}>
                        <Text style={styles.contractTitle}>{contract.projectTitle}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(contract.status) }]}>
                            <Text style={styles.statusText}>{contract.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.clientName}>{contract.clientName}</Text>
                    <Text style={styles.contractAmount}>${contract.amount}</Text>
                    <View style={styles.contractDates}>
                        <Text style={styles.dateText}>Start: {contract.startDate.toLocaleDateString()}</Text>
                        <Text style={styles.dateText}>Due: {contract.dueDate.toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.milestonesSection}>
                        <Text style={styles.milestonesTitle}>Milestones:</Text>
                        {contract.milestones.map(milestone => (
                            <View key={milestone.id} style={styles.milestoneItem}>
                                <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                                <Text style={styles.milestoneAmount}>${milestone.amount}</Text>
                                <View style={[styles.milestoneStatus, { backgroundColor: getStatusColor(milestone.status) }]}>
                                    <Text style={styles.milestoneStatusText}>{milestone.status}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );

    const renderPortfolio = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 Portfolio</Text>
            <Text style={styles.sectionDescription}>
                Showcase your best work and attract new clients
            </Text>

            <View style={styles.portfolioCard}>
                <Text style={styles.portfolioTitle}>📝 Content Writing</Text>
                <Text style={styles.portfolioDescription}>
                    Faith-based content for websites, blogs, and social media
                </Text>
                <TouchableOpacity style={styles.portfolioButton}>
                    <Text style={styles.portfolioButtonText}>View Samples</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.portfolioCard}>
                <Text style={styles.portfolioTitle}>🎨 Graphic Design</Text>
                <Text style={styles.portfolioDescription}>
                    Logos, social media graphics, and marketing materials
                </Text>
                <TouchableOpacity style={styles.portfolioButton}>
                    <Text style={styles.portfolioButtonText}>View Samples</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.portfolioCard}>
                <Text style={styles.portfolioTitle}>📈 Marketing Strategy</Text>
                <Text style={styles.portfolioDescription}>
                    Complete marketing strategies for faith-based businesses
                </Text>
                <TouchableOpacity style={styles.portfolioButton}>
                    <Text style={styles.portfolioButtonText}>View Samples</Text>
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
                <Text style={styles.headerTitle}>💼 Freelance Toolset</Text>
                <Text style={styles.headerSubtitle}>Manage services, contracts, and portfolio</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'services' && styles.activeTab]}
                    onPress={() => setSelectedTab('services')}
                >
                    <Ionicons name="briefcase" size={20} color={selectedTab === 'services' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'services' && styles.activeTabText]}>
                        Services
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
                    style={[styles.tab, selectedTab === 'portfolio' && styles.activeTab]}
                    onPress={() => setSelectedTab('portfolio')}
                >
                    <Ionicons name="images" size={20} color={selectedTab === 'portfolio' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'portfolio' && styles.activeTabText]}>
                        Portfolio
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {selectedTab === 'services' && renderServices()}
                {selectedTab === 'contracts' && renderContracts()}
                {selectedTab === 'portfolio' && renderPortfolio()}

                {/* Service Modal */}
                <Modal
                    visible={showServiceModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowServiceModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Freelance Service</Text>

                            <Text style={styles.inputLabel}>Service Title</Text>
                            <TextInput
                                style={styles.input}
                                value={newService.title}
                                onChangeText={(text) => setNewService({ ...newService, title: text })}
                                placeholder="Enter service title"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newService.description}
                                onChangeText={(text) => setNewService({ ...newService, description: text })}
                                placeholder="Enter service description..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Category</Text>
                            <View style={styles.radioGroup}>
                                {['writing', 'design', 'marketing', 'consulting', 'other'].map(category => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.radioButton,
                                            newService.category === category && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewService({ ...newService, category: category as any })}
                                    >
                                        <Text style={styles.radioLabel}>{category}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Price ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newService.price?.toString()}
                                onChangeText={(text) => setNewService({ ...newService, price: parseFloat(text) || 0 })}
                                placeholder="Enter price"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Delivery Time</Text>
                            <TextInput
                                style={styles.input}
                                value={newService.deliveryTime}
                                onChangeText={(text) => setNewService({ ...newService, deliveryTime: text })}
                                placeholder="e.g., 3-5 days, 1 week"
                            />

                            <Text style={styles.inputLabel}>Number of Revisions</Text>
                            <TextInput
                                style={styles.input}
                                value={newService.revisions?.toString()}
                                onChangeText={(text) => setNewService({ ...newService, revisions: parseInt(text) || 0 })}
                                placeholder="Enter number of revisions"
                                keyboardType="numeric"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addService}
                                >
                                    <Text style={styles.modalButtonText}>Add Service</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowServiceModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
                            <Text style={styles.modalTitle}>Add Client Contract</Text>

                            <Text style={styles.inputLabel}>Client Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newContract.clientName}
                                onChangeText={(text) => setNewContract({ ...newContract, clientName: text })}
                                placeholder="Enter client name"
                            />

                            <Text style={styles.inputLabel}>Project Title</Text>
                            <TextInput
                                style={styles.input}
                                value={newContract.projectTitle}
                                onChangeText={(text) => setNewContract({ ...newContract, projectTitle: text })}
                                placeholder="Enter project title"
                            />

                            <Text style={styles.inputLabel}>Amount ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newContract.amount?.toString()}
                                onChangeText={(text) => setNewContract({ ...newContract, amount: parseFloat(text) || 0 })}
                                placeholder="Enter contract amount"
                                keyboardType="numeric"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addContract}
                                >
                                    <Text style={styles.modalButtonText}>Add Contract</Text>
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
    serviceCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceTitle: {
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
    },
    serviceDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    serviceMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    serviceCategory: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    servicePrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    serviceDelivery: {
        fontSize: 12,
        color: '#666',
    },
    serviceStats: {
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
    clientName: {
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
    contractDates: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dateText: {
        fontSize: 12,
        color: '#666',
    },
    milestonesSection: {
        marginTop: 8,
    },
    milestonesTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    milestoneItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    milestoneTitle: {
        fontSize: 12,
        color: '#333',
        flex: 1,
    },
    milestoneAmount: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    milestoneStatus: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    milestoneStatusText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    portfolioCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    portfolioTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    portfolioDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    portfolioButton: {
        backgroundColor: '#667eea',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    portfolioButtonText: {
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

export default FreelanceToolsetScreen; 