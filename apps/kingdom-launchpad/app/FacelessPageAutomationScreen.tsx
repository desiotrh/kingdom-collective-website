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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface FacelessPage {
    id: string;
    name: string;
    platform: 'tiktok' | 'instagram' | 'youtube';
    niche: string;
    followers: number;
    posts: number;
    engagement: number;
    revenue: number;
    isActive: boolean;
    autoPosting: boolean;
    affiliateLinks: AffiliateLink[];
    contentTemplates: ContentTemplate[];
    createdAt: Date;
}

interface AffiliateLink {
    id: string;
    name: string;
    url: string;
    clicks: number;
    conversions: number;
    revenue: number;
    isActive: boolean;
}

interface ContentTemplate {
    id: string;
    type: 'quote' | 'carousel' | 'story' | 'reel';
    content: string;
    hashtags: string[];
    isActive: boolean;
}

const FacelessPageAutomationScreen: React.FC = () => {
    const [pages, setPages] = useState<FacelessPage[]>([]);
    const [selectedTab, setSelectedTab] = useState<'pages' | 'content' | 'analytics'>('pages');
    const [showPageModal, setShowPageModal] = useState(false);
    const [newPage, setNewPage] = useState<Partial<FacelessPage>>({});

    useEffect(() => {
        setPages([
            {
                id: '1',
                name: 'Faith Quotes Daily',
                platform: 'tiktok',
                niche: 'faith',
                followers: 15420,
                posts: 89,
                engagement: 8.5,
                revenue: 1247,
                isActive: true,
                autoPosting: true,
                affiliateLinks: [
                    {
                        id: '1',
                        name: 'Prayer Journal',
                        url: 'https://amazon.com/prayer-journal',
                        clicks: 234,
                        conversions: 12,
                        revenue: 156,
                        isActive: true
                    }
                ],
                contentTemplates: [
                    {
                        id: '1',
                        type: 'quote',
                        content: 'Trust in the Lord with all your heart',
                        hashtags: ['#faith', '#trust', '#blessed'],
                        isActive: true
                    }
                ],
                createdAt: new Date('2024-01-15')
            }
        ]);
    }, []);

    const addPage = () => {
        if (!newPage.name || !newPage.platform || !newPage.niche) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const page: FacelessPage = {
            id: Date.now().toString(),
            name: newPage.name,
            platform: newPage.platform,
            niche: newPage.niche,
            followers: 0,
            posts: 0,
            engagement: 0,
            revenue: 0,
            isActive: true,
            autoPosting: false,
            affiliateLinks: [],
            contentTemplates: [],
            createdAt: new Date()
        };

        setPages([...pages, page]);
        setNewPage({});
        setShowPageModal(false);
        Alert.alert('Success', 'Page added successfully!');
    };

    const renderPages = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📱 Faceless Pages ({pages.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowPageModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Page</Text>
                </TouchableOpacity>
            </View>

            {pages.map(page => (
                <View key={page.id} style={styles.pageCard}>
                    <View style={styles.pageHeader}>
                        <Ionicons name={getPlatformIcon(page.platform)} size={24} color="#667eea" />
                        <Text style={styles.pageName}>{page.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: page.isActive ? '#4CAF50' : '#f44336' }]}>
                            <Text style={styles.statusText}>{page.isActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                    </View>
                    <Text style={styles.pageNiche}>{page.niche} • {page.platform}</Text>
                    <View style={styles.pageStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{page.followers.toLocaleString()}</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{page.posts}</Text>
                            <Text style={styles.statLabel}>Posts</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{page.engagement}%</Text>
                            <Text style={styles.statLabel}>Engagement</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>${page.revenue}</Text>
                            <Text style={styles.statLabel}>Revenue</Text>
                        </View>
                    </View>
                    <View style={styles.pageFeatures}>
                        <View style={[styles.featureBadge, { backgroundColor: page.autoPosting ? '#4CAF50' : '#FF9800' }]}>
                            <Text style={styles.featureText}>Auto-Posting: {page.autoPosting ? 'ON' : 'OFF'}</Text>
                        </View>
                        <Text style={styles.featureText}>Links: {page.affiliateLinks.length}</Text>
                        <Text style={styles.featureText}>Templates: {page.contentTemplates.length}</Text>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderContent = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Content Generation</Text>
            <Text style={styles.sectionDescription}>
                AI-powered content creation for faceless pages
            </Text>

            <View style={styles.contentCard}>
                <Text style={styles.contentTitle}>🎯 Quote Generator</Text>
                <Text style={styles.contentDescription}>
                    Generate viral quotes for your niche
                </Text>
                <TouchableOpacity style={styles.contentButton}>
                    <Text style={styles.contentButtonText}>Generate Quote</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentCard}>
                <Text style={styles.contentTitle}>🔄 Carousel Templates</Text>
                <Text style={styles.contentDescription}>
                    Create engaging carousel posts
                </Text>
                <TouchableOpacity style={styles.contentButton}>
                    <Text style={styles.contentButtonText}>Create Carousel</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentCard}>
                <Text style={styles.contentTitle}>📱 Story Templates</Text>
                <Text style={styles.contentDescription}>
                    Generate story content automatically
                </Text>
                <TouchableOpacity style={styles.contentButton}>
                    <Text style={styles.contentButtonText}>Create Story</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentCard}>
                <Text style={styles.contentTitle}>🎬 Reel Generator</Text>
                <Text style={styles.contentDescription}>
                    AI-powered reel content creation
                </Text>
                <TouchableOpacity style={styles.contentButton}>
                    <Text style={styles.contentButtonText}>Generate Reel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderAnalytics = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Page Analytics</Text>
            <Text style={styles.sectionDescription}>
                Performance metrics and insights
            </Text>

            <View style={styles.analyticsCard}>
                <Text style={styles.analyticsTitle}>📈 Growth Overview</Text>
                <View style={styles.analyticsStats}>
                    <View style={styles.analyticsStat}>
                        <Text style={styles.analyticsNumber}>15,420</Text>
                        <Text style={styles.analyticsLabel}>Total Followers</Text>
                    </View>
                    <View style={styles.analyticsStat}>
                        <Text style={styles.analyticsNumber}>8.5%</Text>
                        <Text style={styles.analyticsLabel}>Avg Engagement</Text>
                    </View>
                    <View style={styles.analyticsStat}>
                        <Text style={styles.analyticsNumber}>$1,247</Text>
                        <Text style={styles.analyticsLabel}>Total Revenue</Text>
                    </View>
                </View>
            </View>

            <View style={styles.analyticsCard}>
                <Text style={styles.analyticsTitle}>🔗 Affiliate Performance</Text>
                <View style={styles.affiliateStats}>
                    <Text style={styles.affiliateStat}>Total Clicks: 234</Text>
                    <Text style={styles.affiliateStat}>Conversions: 12</Text>
                    <Text style={styles.affiliateStat}>Revenue: $156</Text>
                    <Text style={styles.affiliateStat}>Conversion Rate: 5.1%</Text>
                </View>
            </View>
        </View>
    );

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'tiktok': return 'musical-notes';
            case 'instagram': return 'camera';
            case 'youtube': return 'play-circle';
            default: return 'globe';
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>🤖 Faceless Page Automation</Text>
                <Text style={styles.headerSubtitle}>Build and grow automated social media pages</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'pages' && styles.activeTab]}
                    onPress={() => setSelectedTab('pages')}
                >
                    <Ionicons name="phone-portrait" size={20} color={selectedTab === 'pages' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'pages' && styles.activeTabText]}>
                        Pages
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'content' && styles.activeTab]}
                    onPress={() => setSelectedTab('content')}
                >
                    <Ionicons name="create" size={20} color={selectedTab === 'content' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'content' && styles.activeTabText]}>
                        Content
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'analytics' && styles.activeTab]}
                    onPress={() => setSelectedTab('analytics')}
                >
                    <Ionicons name="analytics" size={20} color={selectedTab === 'analytics' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'analytics' && styles.activeTabText]}>
                        Analytics
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {selectedTab === 'pages' && renderPages()}
                {selectedTab === 'content' && renderContent()}
                {selectedTab === 'analytics' && renderAnalytics()}

                <Modal
                    visible={showPageModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowPageModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Faceless Page</Text>

                            <Text style={styles.inputLabel}>Page Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newPage.name}
                                onChangeText={(text) => setNewPage({ ...newPage, name: text })}
                                placeholder="Enter page name"
                            />

                            <Text style={styles.inputLabel}>Platform</Text>
                            <View style={styles.radioGroup}>
                                {['tiktok', 'instagram', 'youtube'].map(platform => (
                                    <TouchableOpacity
                                        key={platform}
                                        style={[
                                            styles.radioButton,
                                            newPage.platform === platform && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewPage({ ...newPage, platform: platform as any })}
                                    >
                                        <Text style={styles.radioLabel}>{platform}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Niche</Text>
                            <TextInput
                                style={styles.input}
                                value={newPage.niche}
                                onChangeText={(text) => setNewPage({ ...newPage, niche: text })}
                                placeholder="Enter niche (e.g., faith, business, health)"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addPage}
                                >
                                    <Text style={styles.modalButtonText}>Add Page</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowPageModal(false)}
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
    pageCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    pageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    pageName: {
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
    pageNiche: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    pageStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
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
    pageFeatures: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featureBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    featureText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
    },
    contentCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    contentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    contentDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    contentButton: {
        backgroundColor: '#667eea',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    contentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    analyticsCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    analyticsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    analyticsStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    analyticsStat: {
        alignItems: 'center',
    },
    analyticsNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#667eea',
    },
    analyticsLabel: {
        fontSize: 12,
        color: '#666',
    },
    affiliateStats: {
        gap: 4,
    },
    affiliateStat: {
        fontSize: 14,
        color: '#666',
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

export default FacelessPageAutomationScreen; 