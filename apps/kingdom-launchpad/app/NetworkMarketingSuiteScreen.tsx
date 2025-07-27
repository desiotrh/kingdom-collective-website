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

interface NetworkMarketingTool {
    id: string;
    name: string;
    type: 'funnel' | 'script' | 'bonus' | 'link' | 'training';
    description: string;
    content: string;
    isActive: boolean;
    usage: number;
    conversions: number;
    revenue: number;
    createdAt: Date;
}

interface OnboardingFunnel {
    id: string;
    name: string;
    steps: FunnelStep[];
    isActive: boolean;
    signups: number;
    conversions: number;
    revenue: number;
    createdAt: Date;
}

interface FunnelStep {
    id: string;
    title: string;
    type: 'landing' | 'video' | 'form' | 'offer' | 'thank-you';
    content: string;
    order: number;
}

interface BonusBundle {
    id: string;
    name: string;
    description: string;
    items: string[];
    value: number;
    isActive: boolean;
    downloads: number;
    createdAt: Date;
}

const NetworkMarketingSuiteScreen: React.FC = () => {
    const [tools, setTools] = useState<NetworkMarketingTool[]>([]);
    const [funnels, setFunnels] = useState<OnboardingFunnel[]>([]);
    const [bonusBundles, setBonusBundles] = useState<BonusBundle[]>([]);
    const [selectedTab, setSelectedTab] = useState<'tools' | 'funnels' | 'bonuses'>('tools');
    const [showToolModal, setShowToolModal] = useState(false);
    const [showFunnelModal, setShowFunnelModal] = useState(false);
    const [showBonusModal, setShowBonusModal] = useState(false);
    const [newTool, setNewTool] = useState<Partial<NetworkMarketingTool>>({});
    const [newFunnel, setNewFunnel] = useState<Partial<OnboardingFunnel>>({});
    const [newBonus, setNewBonus] = useState<Partial<BonusBundle>>({});

    useEffect(() => {
        setTools([
            {
                id: '1',
                name: 'Faith-Based Business Pitch',
                type: 'script',
                description: 'Script for presenting faith-based business opportunity',
                content: 'Hi! I wanted to share an amazing opportunity with you...',
                isActive: true,
                usage: 45,
                conversions: 12,
                revenue: 2400,
                createdAt: new Date('2024-01-15')
            }
        ]);

        setFunnels([
            {
                id: '1',
                name: 'Faith Business Onboarding',
                steps: [
                    {
                        id: '1',
                        title: 'Welcome Video',
                        type: 'video',
                        content: 'Introduction to faith-based business opportunity',
                        order: 1
                    },
                    {
                        id: '2',
                        title: 'Application Form',
                        type: 'form',
                        content: 'Collect prospect information',
                        order: 2
                    }
                ],
                isActive: true,
                signups: 23,
                conversions: 8,
                revenue: 1600,
                createdAt: new Date('2024-01-15')
            }
        ]);

        setBonusBundles([
            {
                id: '1',
                name: 'Faith Business Starter Pack',
                description: 'Essential tools for new faith-based entrepreneurs',
                items: [
                    'Business Planning Template',
                    'Scripture-Based Goal Setting',
                    'Prayer Journal Template',
                    'Marketing Strategy Guide'
                ],
                value: 297,
                isActive: true,
                downloads: 34,
                createdAt: new Date('2024-01-15')
            }
        ]);
    }, []);

    const addTool = () => {
        if (!newTool.name || !newTool.content) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const tool: NetworkMarketingTool = {
            id: Date.now().toString(),
            name: newTool.name,
            type: newTool.type || 'script',
            description: newTool.description || '',
            content: newTool.content,
            isActive: true,
            usage: 0,
            conversions: 0,
            revenue: 0,
            createdAt: new Date()
        };

        setTools([...tools, tool]);
        setNewTool({});
        setShowToolModal(false);
        Alert.alert('Success', 'Tool created successfully!');
    };

    const addFunnel = () => {
        if (!newFunnel.name) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const funnel: OnboardingFunnel = {
            id: Date.now().toString(),
            name: newFunnel.name,
            steps: [],
            isActive: true,
            signups: 0,
            conversions: 0,
            revenue: 0,
            createdAt: new Date()
        };

        setFunnels([...funnels, funnel]);
        setNewFunnel({});
        setShowFunnelModal(false);
        Alert.alert('Success', 'Funnel created successfully!');
    };

    const addBonusBundle = () => {
        if (!newBonus.name || !newBonus.description) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const bonus: BonusBundle = {
            id: Date.now().toString(),
            name: newBonus.name,
            description: newBonus.description,
            items: newBonus.items || [],
            value: newBonus.value || 0,
            isActive: true,
            downloads: 0,
            createdAt: new Date()
        };

        setBonusBundles([...bonusBundles, bonus]);
        setNewBonus({});
        setShowBonusModal(false);
        Alert.alert('Success', 'Bonus bundle created successfully!');
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'funnel': return 'git-branch';
            case 'script': return 'document-text';
            case 'bonus': return 'gift';
            case 'link': return 'link';
            case 'training': return 'school';
            default: return 'document';
        }
    };

    const renderTools = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🛠️ Marketing Tools ({tools.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowToolModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Tool</Text>
                </TouchableOpacity>
            </View>

            {tools.map(tool => (
                <View key={tool.id} style={styles.toolCard}>
                    <View style={styles.toolHeader}>
                        <Ionicons name={getTypeIcon(tool.type) as any} size={20} color="#667eea" />
                        <Text style={styles.toolTitle}>{tool.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: tool.isActive ? '#4CAF50' : '#f44336' }]}>
                            <Text style={styles.statusText}>{tool.isActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                    </View>
                    <Text style={styles.toolDescription}>{tool.description}</Text>
                    <Text style={styles.toolContent}>{tool.content.substring(0, 100)}...</Text>
                    <View style={styles.toolStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{tool.usage}</Text>
                            <Text style={styles.statLabel}>Usage</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{tool.conversions}</Text>
                            <Text style={styles.statLabel}>Conversions</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>${tool.revenue}</Text>
                            <Text style={styles.statLabel}>Revenue</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderFunnels = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔄 Onboarding Funnels ({funnels.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowFunnelModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Funnel</Text>
                </TouchableOpacity>
            </View>

            {funnels.map(funnel => (
                <View key={funnel.id} style={styles.funnelCard}>
                    <View style={styles.funnelHeader}>
                        <Text style={styles.funnelTitle}>{funnel.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: funnel.isActive ? '#4CAF50' : '#f44336' }]}>
                            <Text style={styles.statusText}>{funnel.isActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                    </View>
                    <Text style={styles.funnelSteps}>{funnel.steps.length} steps</Text>
                    <View style={styles.funnelStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{funnel.signups}</Text>
                            <Text style={styles.statLabel}>Signups</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{funnel.conversions}</Text>
                            <Text style={styles.statLabel}>Conversions</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>${funnel.revenue}</Text>
                            <Text style={styles.statLabel}>Revenue</Text>
                        </View>
                    </View>
                    <View style={styles.stepsSection}>
                        <Text style={styles.stepsTitle}>Steps:</Text>
                        {funnel.steps.map(step => (
                            <Text key={step.id} style={styles.stepItem}>• {step.title} ({step.type})</Text>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );

    const renderBonuses = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🎁 Bonus Bundles ({bonusBundles.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowBonusModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Bundle</Text>
                </TouchableOpacity>
            </View>

            {bonusBundles.map(bonus => (
                <View key={bonus.id} style={styles.bonusCard}>
                    <View style={styles.bonusHeader}>
                        <Text style={styles.bonusTitle}>{bonus.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: bonus.isActive ? '#4CAF50' : '#f44336' }]}>
                            <Text style={styles.statusText}>{bonus.isActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                    </View>
                    <Text style={styles.bonusDescription}>{bonus.description}</Text>
                    <Text style={styles.bonusValue}>Value: ${bonus.value}</Text>
                    <View style={styles.bonusItems}>
                        <Text style={styles.bonusItemsTitle}>Includes:</Text>
                        {bonus.items.map((item, index) => (
                            <Text key={index} style={styles.bonusItem}>• {item}</Text>
                        ))}
                    </View>
                    <View style={styles.bonusStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{bonus.downloads}</Text>
                            <Text style={styles.statLabel}>Downloads</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>🌐 Network Marketing Suite</Text>
                <Text style={styles.headerSubtitle}>Equip network marketers with duplication tools</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'tools' && styles.activeTab]}
                    onPress={() => setSelectedTab('tools')}
                >
                    <Ionicons name="construct" size={20} color={selectedTab === 'tools' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'tools' && styles.activeTabText]}>
                        Tools
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'funnels' && styles.activeTab]}
                    onPress={() => setSelectedTab('funnels')}
                >
                    <Ionicons name="git-branch" size={20} color={selectedTab === 'funnels' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'funnels' && styles.activeTabText]}>
                        Funnels
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'bonuses' && styles.activeTab]}
                    onPress={() => setSelectedTab('bonuses')}
                >
                    <Ionicons name="gift" size={20} color={selectedTab === 'bonuses' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'bonuses' && styles.activeTabText]}>
                        Bonuses
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {selectedTab === 'tools' && renderTools()}
                {selectedTab === 'funnels' && renderFunnels()}
                {selectedTab === 'bonuses' && renderBonuses()}

                {/* Tool Modal */}
                <Modal
                    visible={showToolModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowToolModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Marketing Tool</Text>

                            <Text style={styles.inputLabel}>Tool Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newTool.name}
                                onChangeText={(text) => setNewTool({ ...newTool, name: text })}
                                placeholder="Enter tool name"
                            />

                            <Text style={styles.inputLabel}>Type</Text>
                            <View style={styles.radioGroup}>
                                {['funnel', 'script', 'bonus', 'link', 'training'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newTool.type === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewTool({ ...newTool, type: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newTool.description}
                                onChangeText={(text) => setNewTool({ ...newTool, description: text })}
                                placeholder="Enter tool description..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Content</Text>
                            <TextInput
                                style={[styles.input, { height: 120 }]}
                                value={newTool.content}
                                onChangeText={(text) => setNewTool({ ...newTool, content: text })}
                                placeholder="Enter tool content..."
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addTool}
                                >
                                    <Text style={styles.modalButtonText}>Add Tool</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowToolModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Funnel Modal */}
                <Modal
                    visible={showFunnelModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowFunnelModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Onboarding Funnel</Text>

                            <Text style={styles.inputLabel}>Funnel Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newFunnel.name}
                                onChangeText={(text) => setNewFunnel({ ...newFunnel, name: text })}
                                placeholder="Enter funnel name"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addFunnel}
                                >
                                    <Text style={styles.modalButtonText}>Create Funnel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowFunnelModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Bonus Modal */}
                <Modal
                    visible={showBonusModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowBonusModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Bonus Bundle</Text>

                            <Text style={styles.inputLabel}>Bundle Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newBonus.name}
                                onChangeText={(text) => setNewBonus({ ...newBonus, name: text })}
                                placeholder="Enter bundle name"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newBonus.description}
                                onChangeText={(text) => setNewBonus({ ...newBonus, description: text })}
                                placeholder="Enter bundle description..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Value ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newBonus.value?.toString()}
                                onChangeText={(text) => setNewBonus({ ...newBonus, value: parseFloat(text) || 0 })}
                                placeholder="Enter bundle value"
                                keyboardType="numeric"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addBonusBundle}
                                >
                                    <Text style={styles.modalButtonText}>Create Bundle</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowBonusModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
    toolCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    toolHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    toolTitle: {
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
    },
    toolDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    toolContent: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    toolStats: {
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
    funnelCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    funnelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    funnelTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    funnelSteps: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    funnelStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    stepsSection: {
        marginTop: 8,
    },
    stepsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    stepItem: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    bonusCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    bonusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bonusTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bonusDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    bonusValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 8,
    },
    bonusItems: {
        marginBottom: 8,
    },
    bonusItemsTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    bonusItem: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    bonusStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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

export default NetworkMarketingSuiteScreen; 