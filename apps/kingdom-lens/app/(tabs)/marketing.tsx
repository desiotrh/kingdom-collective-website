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

interface SocialPost {
    id: string;
    platform: 'instagram' | 'pinterest' | 'tiktok';
    content: string;
    hashtags: string[];
    imageUrl: string;
    scheduledDate: Date;
    status: 'draft' | 'scheduled' | 'published';
    engagement: number;
    reach: number;
    faithMode?: {
        content: string;
        hashtags: string[];
    };
}

interface CaptionTemplate {
    id: string;
    name: string;
    template: string;
    mood: string;
    category: string;
    faithMode?: {
        name: string;
        template: string;
    };
}

interface MarketingCampaign {
    id: string;
    name: string;
    description: string;
    posts: SocialPost[];
    status: 'active' | 'paused' | 'completed';
    startDate: Date;
    endDate: Date;
}

const MarketingScreen: React.FC = () => {
    const { faithMode } = useFaithMode();
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'posts' | 'campaigns' | 'templates'>('posts');

    const captionTemplates: CaptionTemplate[] = [
        {
            id: '1',
            name: faithMode ? 'Divine Light' : 'Natural Light',
            template: faithMode
                ? 'Capturing God\'s perfect light in this beautiful moment. Every photo tells a story of His creation and love. #divinelight #faithphotography #kingdomlens'
                : 'Natural light creates the most beautiful moments. Every photo tells a story. #naturallight #photography #kingdomlens',
            mood: 'peaceful',
            category: 'lighting',
            faithMode: {
                name: 'Divine Light',
                template: 'Capturing God\'s perfect light in this beautiful moment. Every photo tells a story of His creation and love. #divinelight #faithphotography #kingdomlens'
            }
        },
        {
            id: '2',
            name: faithMode ? 'Family Blessings' : 'Family Love',
            template: faithMode
                ? 'Family is God\'s greatest gift. These moments of love and connection are pure blessings. #familyblessings #faithfamily #kingdomlens'
                : 'Family is everything. These moments of love and connection are priceless. #familylove #photography #kingdomlens',
            mood: 'warm',
            category: 'family',
            faithMode: {
                name: 'Family Blessings',
                template: 'Family is God\'s greatest gift. These moments of love and connection are pure blessings. #familyblessings #faithfamily #kingdomlens'
            }
        },
        {
            id: '3',
            name: faithMode ? 'Wedding Joy' : 'Wedding Magic',
            template: faithMode
                ? 'Two hearts becoming one in God\'s love. Every wedding is a celebration of His faithfulness. #weddingjoy #faithwedding #kingdomlens'
                : 'Two hearts becoming one. Every wedding is pure magic. #weddingmagic #photography #kingdomlens',
            mood: 'romantic',
            category: 'wedding',
            faithMode: {
                name: 'Wedding Joy',
                template: 'Two hearts becoming one in God\'s love. Every wedding is a celebration of His faithfulness. #weddingjoy #faithwedding #kingdomlens'
            }
        }
    ];

    useEffect(() => {
        setPosts([
            {
                id: '1',
                platform: 'instagram',
                content: faithMode
                    ? 'Capturing God\'s perfect light in this beautiful family moment. Every photo tells a story of His creation and love. #divinelight #faithphotography #kingdomlens #familyblessings'
                    : 'Natural light creates the most beautiful family moments. Every photo tells a story. #naturallight #photography #kingdomlens #familylove',
                hashtags: faithMode
                    ? ['#divinelight', '#faithphotography', '#kingdomlens', '#familyblessings']
                    : ['#naturallight', '#photography', '#kingdomlens', '#familylove'],
                imageUrl: 'https://picsum.photos/400/400?random=1',
                scheduledDate: new Date(Date.now() + 86400000 * 2),
                status: 'scheduled',
                engagement: 0,
                reach: 0,
                faithMode: {
                    content: 'Capturing God\'s perfect light in this beautiful family moment. Every photo tells a story of His creation and love. #divinelight #faithphotography #kingdomlens #familyblessings',
                    hashtags: ['#divinelight', '#faithphotography', '#kingdomlens', '#familyblessings']
                }
            },
            {
                id: '2',
                platform: 'pinterest',
                content: faithMode
                    ? 'Wedding photography that captures the divine love between two souls. Every moment is a blessing. #weddingjoy #faithwedding #kingdomlens'
                    : 'Wedding photography that captures the magic between two souls. Every moment is precious. #weddingmagic #photography #kingdomlens',
                hashtags: faithMode
                    ? ['#weddingjoy', '#faithwedding', '#kingdomlens']
                    : ['#weddingmagic', '#photography', '#kingdomlens'],
                imageUrl: 'https://picsum.photos/400/400?random=2',
                scheduledDate: new Date(Date.now() + 86400000 * 3),
                status: 'scheduled',
                engagement: 0,
                reach: 0,
                faithMode: {
                    content: 'Wedding photography that captures the divine love between two souls. Every moment is a blessing. #weddingjoy #faithwedding #kingdomlens',
                    hashtags: ['#weddingjoy', '#faithwedding', '#kingdomlens']
                }
            }
        ]);

        setCampaigns([
            {
                id: '1',
                name: faithMode ? 'Spring Blessings Campaign' : 'Spring Collection Campaign',
                description: faithMode
                    ? 'Celebrating God\'s renewal and beauty in spring family sessions'
                    : 'Celebrating renewal and beauty in spring family sessions',
                posts: [],
                status: 'active',
                startDate: new Date(Date.now()),
                endDate: new Date(Date.now() + 86400000 * 30)
            }
        ]);
    }, [faithMode]);

    const generatePost = () => {
        const newPost: SocialPost = {
            id: Date.now().toString(),
            platform: 'instagram',
            content: faithMode
                ? 'New gallery uploaded! Capturing God\'s beauty in every frame. #kingdomlens #faithphotography #divinelight'
                : 'New gallery uploaded! Capturing beauty in every frame. #kingdomlens #photography #naturallight',
            hashtags: faithMode
                ? ['#kingdomlens', '#faithphotography', '#divinelight']
                : ['#kingdomlens', '#photography', '#naturallight'],
            imageUrl: 'https://picsum.photos/400/400?random=' + Date.now(),
            scheduledDate: new Date(Date.now() + 86400000),
            status: 'draft',
            engagement: 0,
            reach: 0,
            faithMode: {
                content: 'New gallery uploaded! Capturing God\'s beauty in every frame. #kingdomlens #faithphotography #divinelight',
                hashtags: ['#kingdomlens', '#faithphotography', '#divinelight']
            }
        };
        setPosts([...posts, newPost]);
        setShowPostModal(false);
    };

    const schedulePost = (postId: string) => {
        setPosts(posts.map(p =>
            p.id === postId ? { ...p, status: 'scheduled' as const } : p
        ));
        Alert.alert(
            'Post Scheduled',
            faithMode ? 'Your post has been scheduled with love and care.' : 'Your post has been scheduled successfully.'
        );
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'instagram': return 'logo-instagram';
            case 'pinterest': return 'logo-pinterest';
            case 'tiktok': return 'logo-tiktok';
            default: return 'share-social';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft': return '#64748B';
            case 'scheduled': return '#F59E0B';
            case 'published': return '#10B981';
            default: return '#64748B';
        }
    };

    const getFaithModeMessage = () => {
        const messages = [
            "Share your photography ministry with the world.",
            "Every post is an opportunity to inspire and bless others.",
            "Let your work reflect God's beauty and love.",
            "Marketing with purpose, sharing with heart."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const renderPost = (post: SocialPost) => (
        <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
                <View style={styles.platformInfo}>
                    <Ionicons
                        name={getPlatformIcon(post.platform) as any}
                        size={20}
                        color="#3B82F6"
                    />
                    <Text style={styles.platformName}>
                        {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(post.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(post.status) }]}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </Text>
                </View>
            </View>

            <Text style={styles.postContent}>
                {faithMode && post.faithMode ? post.faithMode.content : post.content}
            </Text>

            <View style={styles.hashtagsContainer}>
                {(faithMode && post.faithMode ? post.faithMode.hashtags : post.hashtags).map(hashtag => (
                    <Text key={hashtag} style={styles.hashtag}>{hashtag}</Text>
                ))}
            </View>

            <Text style={styles.scheduledDate}>
                Scheduled: {post.scheduledDate.toLocaleDateString()}
            </Text>

            {post.status === 'draft' && (
                <TouchableOpacity
                    style={styles.scheduleButton}
                    onPress={() => schedulePost(post.id)}
                >
                    <Text style={styles.scheduleButtonText}>Schedule Post</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderCampaign = (campaign: MarketingCampaign) => (
        <View key={campaign.id} style={styles.campaignCard}>
            <View style={styles.campaignHeader}>
                <Text style={styles.campaignName}>{campaign.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#10B98120' }]}>
                    <Text style={[styles.statusText, { color: '#10B981' }]}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Text>
                </View>
            </View>
            <Text style={styles.campaignDescription}>{campaign.description}</Text>
            <Text style={styles.campaignDates}>
                {campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}
            </Text>
        </View>
    );

    const renderTemplate = (template: CaptionTemplate) => (
        <TouchableOpacity key={template.id} style={styles.templateCard}>
            <Text style={styles.templateName}>
                {faithMode && template.faithMode ? template.faithMode.name : template.name}
            </Text>
            <Text style={styles.templateMood}>{template.mood} • {template.category}</Text>
            <Text style={styles.templateText}>
                {faithMode && template.faithMode ? template.faithMode.template : template.template}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {faithMode ? 'Kingdom Marketing' : 'Marketing Automation'}
                </Text>
                {faithMode && (
                    <Text style={styles.faithMessage}>{getFaithModeMessage()}</Text>
                )}
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
                    onPress={() => setActiveTab('posts')}
                >
                    <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
                        Posts
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'campaigns' && styles.activeTab]}
                    onPress={() => setActiveTab('campaigns')}
                >
                    <Text style={[styles.tabText, activeTab === 'campaigns' && styles.activeTabText]}>
                        Campaigns
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'templates' && styles.activeTab]}
                    onPress={() => setActiveTab('templates')}
                >
                    <Text style={[styles.tabText, activeTab === 'templates' && styles.activeTabText]}>
                        Templates
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {activeTab === 'posts' && (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Social Media Posts</Text>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setShowPostModal(true)}
                            >
                                <Ionicons name="add" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        {posts.map(renderPost)}
                    </View>
                )}

                {activeTab === 'campaigns' && (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Marketing Campaigns</Text>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setShowCampaignModal(true)}
                            >
                                <Ionicons name="add" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        {campaigns.map(renderCampaign)}
                    </View>
                )}

                {activeTab === 'templates' && (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Caption Templates</Text>
                        </View>
                        {captionTemplates.map(renderTemplate)}
                    </View>
                )}
            </ScrollView>

            {/* Create Post Modal */}
            <Modal
                visible={showPostModal}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Create New Post</Text>
                            <TouchableOpacity onPress={() => setShowPostModal(false)}>
                                <Ionicons name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={styles.modalLabel}>Platform</Text>
                            <View style={styles.platformSelector}>
                                <TouchableOpacity style={styles.platformOption}>
                                    <Ionicons name="logo-instagram" size={24} color="#3B82F6" />
                                    <Text style={styles.platformText}>Instagram</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.platformOption}>
                                    <Ionicons name="logo-pinterest" size={24} color="#EF4444" />
                                    <Text style={styles.platformText}>Pinterest</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.platformOption}>
                                    <Ionicons name="logo-tiktok" size={24} color="#000000" />
                                    <Text style={styles.platformText}>TikTok</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.generateButton}
                                onPress={generatePost}
                            >
                                <Text style={styles.generateButtonText}>Generate Post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Create Campaign Modal */}
            <Modal
                visible={showCampaignModal}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Create Campaign</Text>
                            <TouchableOpacity onPress={() => setShowCampaignModal(false)}>
                                <Ionicons name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={styles.modalLabel}>Campaign Name</Text>
                            <TextInput style={styles.textInput} placeholder="Enter campaign name" />

                            <Text style={styles.modalLabel}>Description</Text>
                            <TextInput
                                style={[styles.textInput, { height: 80 }]}
                                placeholder="Describe your campaign"
                                multiline
                            />

                            <TouchableOpacity style={styles.createButton}>
                                <Text style={styles.createButtonText}>Create Campaign</Text>
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
    postCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    platformInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    platformName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
        marginLeft: 8,
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
    postContent: {
        fontSize: 14,
        color: '#1E293B',
        marginBottom: 8,
        lineHeight: 20,
    },
    hashtagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    hashtag: {
        fontSize: 12,
        color: '#3B82F6',
        marginRight: 8,
    },
    scheduledDate: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 12,
    },
    scheduleButton: {
        backgroundColor: '#10B981',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
    },
    scheduleButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    campaignCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    campaignHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    campaignName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    campaignDescription: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 8,
    },
    campaignDates: {
        fontSize: 12,
        color: '#64748B',
    },
    templateCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    templateName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    templateMood: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 8,
    },
    templateText: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
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
        marginBottom: 8,
    },
    platformSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    platformOption: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    platformText: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 14,
    },
    generateButton: {
        backgroundColor: '#8B5CF6',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    generateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: '#10B981',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MarketingScreen; 