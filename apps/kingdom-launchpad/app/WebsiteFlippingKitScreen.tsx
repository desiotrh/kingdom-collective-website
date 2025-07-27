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

interface Website {
    id: string;
    name: string;
    url: string;
    niche: string;
    seoScore: number;
    estimatedValue: number;
    monthlyTraffic: number;
    monthlyRevenue: number;
    age: number;
    status: 'analyzing' | 'ready' | 'listed' | 'sold';
    createdAt: Date;
    analysis: WebsiteAnalysis;
}

interface WebsiteAnalysis {
    seoScore: number;
    trafficScore: number;
    revenueScore: number;
    technicalScore: number;
    contentScore: number;
    backlinks: number;
    domainAuthority: number;
    pageSpeed: number;
    mobileFriendly: boolean;
    sslSecure: boolean;
    recommendations: string[];
}

interface DomainSuggestion {
    id: string;
    domain: string;
    availability: 'available' | 'taken' | 'premium';
    price?: number;
    score: number;
    keywords: string[];
}

const WebsiteFlippingKitScreen: React.FC = () => {
    const [websites, setWebsites] = useState<Website[]>([]);
    const [domainSuggestions, setDomainSuggestions] = useState<DomainSuggestion[]>([]);
    const [selectedTab, setSelectedTab] = useState<'websites' | 'domains' | 'tools'>('websites');
    const [showWebsiteModal, setShowWebsiteModal] = useState(false);
    const [newWebsite, setNewWebsite] = useState<Partial<Website>>({});

    useEffect(() => {
        setWebsites([
            {
                id: '1',
                name: 'Faith Business Hub',
                url: 'faithbusinesshub.com',
                niche: 'faith-business',
                seoScore: 78,
                estimatedValue: 8500,
                monthlyTraffic: 12400,
                monthlyRevenue: 450,
                age: 18,
                status: 'ready',
                createdAt: new Date('2024-01-15'),
                analysis: {
                    seoScore: 78,
                    trafficScore: 82,
                    revenueScore: 65,
                    technicalScore: 85,
                    contentScore: 72,
                    backlinks: 156,
                    domainAuthority: 32,
                    pageSpeed: 87,
                    mobileFriendly: true,
                    sslSecure: true,
                    recommendations: [
                        'Improve content quality',
                        'Add more backlinks',
                        'Optimize for mobile'
                    ]
                }
            }
        ]);

        setDomainSuggestions([
            {
                id: '1',
                domain: 'faithbusinesspro.com',
                availability: 'available',
                price: 12,
                score: 85,
                keywords: ['faith', 'business', 'pro']
            },
            {
                id: '2',
                domain: 'kingdomentrepreneur.com',
                availability: 'taken',
                score: 92,
                keywords: ['kingdom', 'entrepreneur']
            }
        ]);
    }, []);

    const addWebsite = () => {
        if (!newWebsite.name || !newWebsite.url) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const website: Website = {
            id: Date.now().toString(),
            name: newWebsite.name,
            url: newWebsite.url,
            niche: newWebsite.niche || 'general',
            seoScore: 0,
            estimatedValue: 0,
            monthlyTraffic: 0,
            monthlyRevenue: 0,
            age: 0,
            status: 'analyzing',
            createdAt: new Date(),
            analysis: {
                seoScore: 0,
                trafficScore: 0,
                revenueScore: 0,
                technicalScore: 0,
                contentScore: 0,
                backlinks: 0,
                domainAuthority: 0,
                pageSpeed: 0,
                mobileFriendly: false,
                sslSecure: false,
                recommendations: []
            }
        };

        setWebsites([...websites, website]);
        setNewWebsite({});
        setShowWebsiteModal(false);
        Alert.alert('Success', 'Website added for analysis!');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'analyzing': return '#FF9800';
            case 'ready': return '#4CAF50';
            case 'listed': return '#2196F3';
            case 'sold': return '#9C27B0';
            default: return '#666';
        }
    };

    const renderWebsites = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🌐 Websites ({websites.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowWebsiteModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Website</Text>
                </TouchableOpacity>
            </View>

            {websites.map(website => (
                <View key={website.id} style={styles.websiteCard}>
                    <View style={styles.websiteHeader}>
                        <Text style={styles.websiteName}>{website.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(website.status) }]}>
                            <Text style={styles.statusText}>{website.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.websiteUrl}>{website.url}</Text>
                    <Text style={styles.websiteNiche}>{website.niche}</Text>

                    <View style={styles.websiteStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{website.seoScore}</Text>
                            <Text style={styles.statLabel}>SEO Score</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>${website.estimatedValue.toLocaleString()}</Text>
                            <Text style={styles.statLabel}>Value</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{website.monthlyTraffic.toLocaleString()}</Text>
                            <Text style={styles.statLabel}>Traffic</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>${website.monthlyRevenue}</Text>
                            <Text style={styles.statLabel}>Revenue</Text>
                        </View>
                    </View>

                    <View style={styles.analysisSection}>
                        <Text style={styles.analysisTitle}>Analysis Results:</Text>
                        <View style={styles.analysisGrid}>
                            <Text style={styles.analysisItem}>Backlinks: {website.analysis.backlinks}</Text>
                            <Text style={styles.analysisItem}>Domain Authority: {website.analysis.domainAuthority}</Text>
                            <Text style={styles.analysisItem}>Page Speed: {website.analysis.pageSpeed}%</Text>
                            <Text style={styles.analysisItem}>Mobile: {website.analysis.mobileFriendly ? '✅' : '❌'}</Text>
                            <Text style={styles.analysisItem}>SSL: {website.analysis.sslSecure ? '✅' : '❌'}</Text>
                            <Text style={styles.analysisItem}>Age: {website.age} months</Text>
                        </View>
                    </View>

                    {website.analysis.recommendations.length > 0 && (
                        <View style={styles.recommendationsSection}>
                            <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                            {website.analysis.recommendations.map((rec, index) => (
                                <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </View>
    );

    const renderDomains = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 Domain Suggestions</Text>
            <Text style={styles.sectionDescription}>
                AI-powered domain name suggestions for your niche
            </Text>

            {domainSuggestions.map(domain => (
                <View key={domain.id} style={styles.domainCard}>
                    <View style={styles.domainHeader}>
                        <Text style={styles.domainName}>{domain.domain}</Text>
                        <View style={[styles.availabilityBadge, {
                            backgroundColor: domain.availability === 'available' ? '#4CAF50' :
                                domain.availability === 'taken' ? '#f44336' : '#FF9800'
                        }]}>
                            <Text style={styles.availabilityText}>{domain.availability}</Text>
                        </View>
                    </View>

                    <View style={styles.domainMeta}>
                        <Text style={styles.domainScore}>Score: {domain.score}/100</Text>
                        {domain.price && (
                            <Text style={styles.domainPrice}>${domain.price}/year</Text>
                        )}
                    </View>

                    <View style={styles.keywordsContainer}>
                        {domain.keywords.map((keyword, index) => (
                            <View key={index} style={styles.keywordBadge}>
                                <Text style={styles.keywordText}>{keyword}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );

    const renderTools = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛠️ Flipping Tools</Text>
            <Text style={styles.sectionDescription}>
                Professional tools for website flipping
            </Text>

            <View style={styles.toolCard}>
                <Text style={styles.toolTitle}>📊 SEO Score Analyzer</Text>
                <Text style={styles.toolDescription}>
                    Comprehensive SEO analysis with detailed recommendations
                </Text>
                <TouchableOpacity style={styles.toolButton}>
                    <Text style={styles.toolButtonText}>Analyze SEO</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.toolCard}>
                <Text style={styles.toolTitle}>💰 Value Estimator</Text>
                <Text style={styles.toolDescription}>
                    AI-powered website valuation based on traffic and revenue
                </Text>
                <TouchableOpacity style={styles.toolButton}>
                    <Text style={styles.toolButtonText}>Estimate Value</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.toolCard}>
                <Text style={styles.toolTitle}>📝 Listing Generator</Text>
                <Text style={styles.toolDescription}>
                    Generate professional listings for Flippa and other marketplaces
                </Text>
                <TouchableOpacity style={styles.toolButton}>
                    <Text style={styles.toolButtonText}>Create Listing</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.toolCard}>
                <Text style={styles.toolTitle}>🎯 Keyword Ranking Advisor</Text>
                <Text style={styles.toolDescription}>
                    Identify high-value keywords for your niche
                </Text>
                <TouchableOpacity style={styles.toolButton}>
                    <Text style={styles.toolButtonText}>Find Keywords</Text>
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
                <Text style={styles.headerTitle}>🏠 Website Flipping Kit</Text>
                <Text style={styles.headerSubtitle}>Analyze, value, and flip websites for profit</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'websites' && styles.activeTab]}
                    onPress={() => setSelectedTab('websites')}
                >
                    <Ionicons name="globe" size={20} color={selectedTab === 'websites' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'websites' && styles.activeTabText]}>
                        Websites
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'domains' && styles.activeTab]}
                    onPress={() => setSelectedTab('domains')}
                >
                    <Ionicons name="search" size={20} color={selectedTab === 'domains' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'domains' && styles.activeTabText]}>
                        Domains
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'tools' && styles.activeTab]}
                    onPress={() => setSelectedTab('tools')}
                >
                    <Ionicons name="construct" size={20} color={selectedTab === 'tools' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'tools' && styles.activeTabText]}>
                        Tools
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {selectedTab === 'websites' && renderWebsites()}
                {selectedTab === 'domains' && renderDomains()}
                {selectedTab === 'tools' && renderTools()}

                <Modal
                    visible={showWebsiteModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowWebsiteModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Website for Analysis</Text>

                            <Text style={styles.inputLabel}>Website Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newWebsite.name}
                                onChangeText={(text) => setNewWebsite({ ...newWebsite, name: text })}
                                placeholder="Enter website name"
                            />

                            <Text style={styles.inputLabel}>Website URL</Text>
                            <TextInput
                                style={styles.input}
                                value={newWebsite.url}
                                onChangeText={(text) => setNewWebsite({ ...newWebsite, url: text })}
                                placeholder="Enter website URL"
                            />

                            <Text style={styles.inputLabel}>Niche (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={newWebsite.niche}
                                onChangeText={(text) => setNewWebsite({ ...newWebsite, niche: text })}
                                placeholder="Enter niche (e.g., faith-business, health, tech)"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addWebsite}
                                >
                                    <Text style={styles.modalButtonText}>Add Website</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowWebsiteModal(false)}
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
    websiteCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    websiteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    websiteName: {
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
    websiteUrl: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    websiteNiche: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    websiteStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
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
    analysisSection: {
        marginBottom: 8,
    },
    analysisTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    analysisGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    analysisItem: {
        fontSize: 12,
        color: '#666',
    },
    recommendationsSection: {
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    recommendationsTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    recommendationItem: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    domainCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    domainHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    domainName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    availabilityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    availabilityText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    domainMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    domainScore: {
        fontSize: 14,
        color: '#667eea',
        fontWeight: 'bold',
    },
    domainPrice: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    keywordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    keywordBadge: {
        backgroundColor: '#667eea',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    keywordText: {
        fontSize: 10,
        color: '#fff',
    },
    toolCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    toolTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    toolDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    toolButton: {
        backgroundColor: '#667eea',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    toolButtonText: {
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

export default WebsiteFlippingKitScreen; 