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

interface EmailSubscriber {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    tags: string[];
    status: 'active' | 'unsubscribed' | 'bounced';
    subscribedAt: Date;
    lastEngagement?: Date;
    source: string;
}

interface EmailSequence {
    id: string;
    name: string;
    description: string;
    type: 'welcome' | 'pitch' | 'nurture' | 'post_purchase' | 'spiritual';
    isActive: boolean;
    emails: EmailTemplate[];
    trigger: 'immediate' | 'delayed' | 'conditional';
    delayHours?: number;
}

interface EmailTemplate {
    id: string;
    subject: string;
    content: string;
    delayHours: number;
    isActive: boolean;
    tags: string[];
    spiritualAddon?: boolean;
}

interface EmailCampaign {
    id: string;
    name: string;
    subject: string;
    content: string;
    status: 'draft' | 'scheduled' | 'sent' | 'paused';
    scheduledAt?: Date;
    sentAt?: Date;
    recipients: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
    tags: string[];
}

const EmailMarketingScreen: React.FC = () => {
    const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
    const [sequences, setSequences] = useState<EmailSequence[]>([]);
    const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
    const [selectedTab, setSelectedTab] = useState<'subscribers' | 'sequences' | 'campaigns' | 'templates'>('subscribers');
    const [showSubscriberModal, setShowSubscriberModal] = useState(false);
    const [showSequenceModal, setShowSequenceModal] = useState(false);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [newSubscriber, setNewSubscriber] = useState<Partial<EmailSubscriber>>({});
    const [newSequence, setNewSequence] = useState<Partial<EmailSequence>>({});
    const [newCampaign, setNewCampaign] = useState<Partial<EmailCampaign>>({});
    const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({});
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Mock data
    useEffect(() => {
        setSubscribers([
            {
                id: '1',
                email: 'john@example.com',
                firstName: 'John',
                lastName: 'Doe',
                tags: ['faith', 'business', 'course'],
                status: 'active',
                subscribedAt: new Date('2024-01-01'),
                lastEngagement: new Date('2024-01-20'),
                source: 'website'
            },
            {
                id: '2',
                email: 'sarah@example.com',
                firstName: 'Sarah',
                lastName: 'Smith',
                tags: ['faith', 'prayer'],
                status: 'active',
                subscribedAt: new Date('2024-01-05'),
                lastEngagement: new Date('2024-01-19'),
                source: 'social'
            }
        ]);

        setSequences([
            {
                id: '1',
                name: 'Welcome Series',
                description: 'Welcome new subscribers with faith-based encouragement',
                type: 'welcome',
                isActive: true,
                trigger: 'immediate',
                emails: [
                    {
                        id: '1',
                        subject: 'Welcome to the Kingdom! 🙏',
                        content: 'Welcome to our community of faith-driven entrepreneurs...',
                        delayHours: 0,
                        isActive: true,
                        tags: ['welcome', 'faith'],
                        spiritualAddon: true
                    },
                    {
                        id: '2',
                        subject: 'Your First Step in Kingdom Business',
                        content: 'Let\'s start your journey with purpose and clarity...',
                        delayHours: 24,
                        isActive: true,
                        tags: ['welcome', 'business'],
                        spiritualAddon: true
                    }
                ]
            },
            {
                id: '2',
                name: 'Course Launch Sequence',
                description: 'Promote new course launches with urgency and value',
                type: 'pitch',
                isActive: true,
                trigger: 'delayed',
                delayHours: 2,
                emails: [
                    {
                        id: '3',
                        subject: '🚀 New Course Launch: Kingdom Business Mastery',
                        content: 'I\'m excited to share something special with you...',
                        delayHours: 0,
                        isActive: true,
                        tags: ['launch', 'course'],
                        spiritualAddon: false
                    }
                ]
            }
        ]);

        setCampaigns([
            {
                id: '1',
                name: 'Weekly Encouragement',
                subject: '💪 This Week\'s Kingdom Inspiration',
                content: 'Here\'s your weekly dose of faith and business wisdom...',
                status: 'sent',
                sentAt: new Date('2024-01-20'),
                recipients: 1250,
                opened: 890,
                clicked: 156,
                unsubscribed: 12,
                tags: ['weekly', 'encouragement']
            }
        ]);
    }, []);

    const addSubscriber = () => {
        if (!newSubscriber.email) {
            Alert.alert('Error', 'Please enter an email address');
            return;
        }

        const subscriber: EmailSubscriber = {
            id: Date.now().toString(),
            email: newSubscriber.email,
            firstName: newSubscriber.firstName,
            lastName: newSubscriber.lastName,
            tags: selectedTags,
            status: 'active',
            subscribedAt: new Date(),
            source: newSubscriber.source || 'manual'
        };

        setSubscribers([...subscribers, subscriber]);
        setNewSubscriber({});
        setSelectedTags([]);
        setShowSubscriberModal(false);
        Alert.alert('Success', 'Subscriber added successfully!');
    };

    const createSequence = () => {
        if (!newSequence.name || !newSequence.description) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const sequence: EmailSequence = {
            id: Date.now().toString(),
            name: newSequence.name,
            description: newSequence.description,
            type: newSequence.type || 'welcome',
            isActive: newSequence.isActive || true,
            trigger: newSequence.trigger || 'immediate',
            delayHours: newSequence.delayHours,
            emails: []
        };

        setSequences([...sequences, sequence]);
        setNewSequence({});
        setShowSequenceModal(false);
        Alert.alert('Success', 'Sequence created successfully!');
    };

    const createCampaign = () => {
        if (!newCampaign.name || !newCampaign.subject || !newCampaign.content) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const campaign: EmailCampaign = {
            id: Date.now().toString(),
            name: newCampaign.name,
            subject: newCampaign.subject,
            content: newCampaign.content,
            status: 'draft',
            recipients: 0,
            opened: 0,
            clicked: 0,
            unsubscribed: 0,
            tags: selectedTags
        };

        setCampaigns([...campaigns, campaign]);
        setNewCampaign({});
        setSelectedTags([]);
        setShowCampaignModal(false);
        Alert.alert('Success', 'Campaign created successfully!');
    };

    const sendCampaign = (campaignId: string) => {
        const updatedCampaigns = campaigns.map(campaign =>
            campaign.id === campaignId
                ? { ...campaign, status: 'sent', sentAt: new Date(), recipients: subscribers.length }
                : campaign
        );
        setCampaigns(updatedCampaigns);
        Alert.alert('Success', 'Campaign sent successfully!');
    };

    const getOpenRate = (opened: number, recipients: number) => {
        return recipients > 0 ? ((opened / recipients) * 100).toFixed(2) : '0.00';
    };

    const getClickRate = (clicked: number, opened: number) => {
        return opened > 0 ? ((clicked / opened) * 100).toFixed(2) : '0.00';
    };

    const availableTags = ['faith', 'business', 'course', 'prayer', 'encouragement', 'launch', 'welcome', 'weekly'];

    const renderSubscribers = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📧 Subscribers ({subscribers.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowSubscriberModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Subscriber</Text>
                </TouchableOpacity>
            </View>

            {subscribers.map(subscriber => (
                <View key={subscriber.id} style={styles.subscriberCard}>
                    <View style={styles.subscriberHeader}>
                        <Text style={styles.subscriberEmail}>{subscriber.email}</Text>
                        <Text style={styles.subscriberStatus}>{subscriber.status}</Text>
                    </View>
                    <Text style={styles.subscriberName}>
                        {subscriber.firstName} {subscriber.lastName}
                    </Text>
                    <View style={styles.subscriberTags}>
                        {subscriber.tags.map(tag => (
                            <Text key={tag} style={styles.tag}>{tag}</Text>
                        ))}
                    </View>
                    <Text style={styles.subscriberDate}>
                        Joined: {subscriber.subscribedAt.toLocaleDateString()}
                    </Text>
                </View>
            ))}
        </View>
    );

    const renderSequences = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔄 Email Sequences ({sequences.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowSequenceModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Sequence</Text>
                </TouchableOpacity>
            </View>

            {sequences.map(sequence => (
                <View key={sequence.id} style={styles.sequenceCard}>
                    <View style={styles.sequenceHeader}>
                        <Text style={styles.sequenceName}>{sequence.name}</Text>
                        <Text style={styles.sequenceType}>{sequence.type}</Text>
                    </View>
                    <Text style={styles.sequenceDescription}>{sequence.description}</Text>
                    <View style={styles.sequenceMeta}>
                        <Text style={styles.sequenceEmails}>{sequence.emails.length} emails</Text>
                        <Text style={styles.sequenceTrigger}>{sequence.trigger}</Text>
                        {sequence.isActive && <Text style={styles.activeBadge}>Active</Text>}
                    </View>
                    <View style={styles.sequenceActions}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="eye" size={16} color="#2196F3" />
                            <Text style={styles.actionText}>View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="edit" size={16} color="#4CAF50" />
                            <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="play" size={16} color="#FF9800" />
                            <Text style={styles.actionText}>Activate</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderCampaigns = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📢 Email Campaigns ({campaigns.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowCampaignModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Campaign</Text>
                </TouchableOpacity>
            </View>

            {campaigns.map(campaign => (
                <View key={campaign.id} style={styles.campaignCard}>
                    <View style={styles.campaignHeader}>
                        <Text style={styles.campaignName}>{campaign.name}</Text>
                        <Text style={styles.campaignStatus}>{campaign.status}</Text>
                    </View>
                    <Text style={styles.campaignSubject}>{campaign.subject}</Text>
                    <View style={styles.campaignStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{campaign.recipients}</Text>
                            <Text style={styles.statLabel}>Sent</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{getOpenRate(campaign.opened, campaign.recipients)}%</Text>
                            <Text style={styles.statLabel}>Open Rate</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{getClickRate(campaign.clicked, campaign.opened)}%</Text>
                            <Text style={styles.statLabel}>Click Rate</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{campaign.unsubscribed}</Text>
                            <Text style={styles.statLabel}>Unsubscribed</Text>
                        </View>
                    </View>
                    <View style={styles.campaignActions}>
                        {campaign.status === 'draft' && (
                            <TouchableOpacity
                                style={styles.sendButton}
                                onPress={() => sendCampaign(campaign.id)}
                            >
                                <Ionicons name="send" size={16} color="#fff" />
                                <Text style={styles.sendButtonText}>Send</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="analytics" size={16} color="#2196F3" />
                            <Text style={styles.actionText}>Analytics</Text>
                        </TouchableOpacity>
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
                <Text style={styles.headerTitle}>📧 Email Marketing System</Text>
                <Text style={styles.headerSubtitle}>Automated sequences and spiritual encouragement</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'subscribers' && styles.activeTab]}
                    onPress={() => setSelectedTab('subscribers')}
                >
                    <Ionicons name="people" size={20} color={selectedTab === 'subscribers' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'subscribers' && styles.activeTabText]}>
                        Subscribers
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'sequences' && styles.activeTab]}
                    onPress={() => setSelectedTab('sequences')}
                >
                    <Ionicons name="refresh" size={20} color={selectedTab === 'sequences' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'sequences' && styles.activeTabText]}>
                        Sequences
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'campaigns' && styles.activeTab]}
                    onPress={() => setSelectedTab('campaigns')}
                >
                    <Ionicons name="mail" size={20} color={selectedTab === 'campaigns' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'campaigns' && styles.activeTabText]}>
                        Campaigns
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{subscribers.length}</Text>
                        <Text style={styles.statLabel}>Total Subscribers</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{sequences.length}</Text>
                        <Text style={styles.statLabel}>Active Sequences</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{campaigns.length}</Text>
                        <Text style={styles.statLabel}>Campaigns</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>24.5%</Text>
                        <Text style={styles.statLabel}>Avg Open Rate</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'subscribers' && renderSubscribers()}
                {selectedTab === 'sequences' && renderSequences()}
                {selectedTab === 'campaigns' && renderCampaigns()}

                {/* Subscriber Modal */}
                <Modal
                    visible={showSubscriberModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowSubscriberModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Subscriber</Text>

                            <Text style={styles.inputLabel}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                value={newSubscriber.email}
                                onChangeText={(text) => setNewSubscriber({ ...newSubscriber, email: text })}
                                placeholder="Enter email address"
                                keyboardType="email-address"
                            />

                            <Text style={styles.inputLabel}>First Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newSubscriber.firstName}
                                onChangeText={(text) => setNewSubscriber({ ...newSubscriber, firstName: text })}
                                placeholder="Enter first name"
                            />

                            <Text style={styles.inputLabel}>Last Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newSubscriber.lastName}
                                onChangeText={(text) => setNewSubscriber({ ...newSubscriber, lastName: text })}
                                placeholder="Enter last name"
                            />

                            <Text style={styles.inputLabel}>Tags</Text>
                            <View style={styles.tagSelector}>
                                {availableTags.map(tag => (
                                    <TouchableOpacity
                                        key={tag}
                                        style={[
                                            styles.tagOption,
                                            selectedTags.includes(tag) && styles.tagOptionSelected
                                        ]}
                                        onPress={() => {
                                            if (selectedTags.includes(tag)) {
                                                setSelectedTags(selectedTags.filter(t => t !== tag));
                                            } else {
                                                setSelectedTags([...selectedTags, tag]);
                                            }
                                        }}
                                    >
                                        <Text style={[
                                            styles.tagOptionText,
                                            selectedTags.includes(tag) && styles.tagOptionTextSelected
                                        ]}>
                                            {tag}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addSubscriber}
                                >
                                    <Text style={styles.modalButtonText}>Add Subscriber</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowSubscriberModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Sequence Modal */}
                <Modal
                    visible={showSequenceModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowSequenceModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Email Sequence</Text>

                            <Text style={styles.inputLabel}>Sequence Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newSequence.name}
                                onChangeText={(text) => setNewSequence({ ...newSequence, name: text })}
                                placeholder="e.g., Welcome Series"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newSequence.description}
                                onChangeText={(text) => setNewSequence({ ...newSequence, description: text })}
                                placeholder="Describe your email sequence..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Sequence Type</Text>
                            <View style={styles.radioGroup}>
                                {['welcome', 'pitch', 'nurture', 'post_purchase', 'spiritual'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newSequence.type === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewSequence({ ...newSequence, type: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type.replace('_', ' ')}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createSequence}
                                >
                                    <Text style={styles.modalButtonText}>Create Sequence</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowSequenceModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Campaign Modal */}
                <Modal
                    visible={showCampaignModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowCampaignModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Email Campaign</Text>

                            <Text style={styles.inputLabel}>Campaign Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newCampaign.name}
                                onChangeText={(text) => setNewCampaign({ ...newCampaign, name: text })}
                                placeholder="e.g., Weekly Encouragement"
                            />

                            <Text style={styles.inputLabel}>Subject Line</Text>
                            <TextInput
                                style={styles.input}
                                value={newCampaign.subject}
                                onChangeText={(text) => setNewCampaign({ ...newCampaign, subject: text })}
                                placeholder="Enter compelling subject line"
                            />

                            <Text style={styles.inputLabel}>Email Content</Text>
                            <TextInput
                                style={[styles.input, { height: 120 }]}
                                value={newCampaign.content}
                                onChangeText={(text) => setNewCampaign({ ...newCampaign, content: text })}
                                placeholder="Write your email content..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Tags</Text>
                            <View style={styles.tagSelector}>
                                {availableTags.map(tag => (
                                    <TouchableOpacity
                                        key={tag}
                                        style={[
                                            styles.tagOption,
                                            selectedTags.includes(tag) && styles.tagOptionSelected
                                        ]}
                                        onPress={() => {
                                            if (selectedTags.includes(tag)) {
                                                setSelectedTags(selectedTags.filter(t => t !== tag));
                                            } else {
                                                setSelectedTags([...selectedTags, tag]);
                                            }
                                        }}
                                    >
                                        <Text style={[
                                            styles.tagOptionText,
                                            selectedTags.includes(tag) && styles.tagOptionTextSelected
                                        ]}>
                                            {tag}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createCampaign}
                                >
                                    <Text style={styles.modalButtonText}>Create Campaign</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowCampaignModal(false)}
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
    subscriberCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    subscriberHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    subscriberEmail: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    subscriberStatus: {
        fontSize: 12,
        color: '#4CAF50',
        textTransform: 'capitalize',
    },
    subscriberName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    subscriberTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4,
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
    subscriberDate: {
        fontSize: 12,
        color: '#999',
    },
    sequenceCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    sequenceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    sequenceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    sequenceType: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    sequenceDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    sequenceMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sequenceEmails: {
        fontSize: 12,
        color: '#666',
    },
    sequenceTrigger: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    activeBadge: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    sequenceActions: {
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
    campaignCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    campaignHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    campaignName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    campaignStatus: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    campaignSubject: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    campaignStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 10,
        color: '#666',
    },
    campaignActions: {
        flexDirection: 'row',
        gap: 12,
    },
    sendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 4,
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
    tagSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
        gap: 8,
    },
    tagOption: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 16,
    },
    tagOptionSelected: {
        backgroundColor: '#667eea',
        borderColor: '#667eea',
    },
    tagOptionText: {
        fontSize: 14,
        color: '#666',
    },
    tagOptionTextSelected: {
        color: '#fff',
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

export default EmailMarketingScreen; 