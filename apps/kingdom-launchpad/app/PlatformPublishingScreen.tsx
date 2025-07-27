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
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface SocialPost {
    id: string;
    platform: 'instagram' | 'tiktok' | 'facebook' | 'pinterest' | 'youtube';
    type: 'post' | 'story' | 'reel' | 'video' | 'pin';
    content: string;
    image?: string;
    scheduledDate?: Date;
    isPublished: boolean;
    engagement: {
        likes: number;
        comments: number;
        shares: number;
        saves: number;
    };
    tags: string[];
    isFaithMode: boolean;
}

interface ContentTemplate {
    id: string;
    name: string;
    category: 'sales' | 'promo' | 'countdown' | 'testimonial' | 'scripture' | 'quote';
    platforms: string[];
    template: string;
    variables: string[];
    isFaithMode: boolean;
}

interface PublishingSchedule {
    id: string;
    name: string;
    platforms: string[];
    frequency: 'daily' | 'weekly' | 'custom';
    posts: SocialPost[];
    isActive: boolean;
    nextPostDate: Date;
}

interface BrandKit {
    id: string;
    name: string;
    colors: string[];
    fonts: string[];
    logo?: string;
    templates: ContentTemplate[];
}

const PlatformPublishingScreen: React.FC = () => {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [templates, setTemplates] = useState<ContentTemplate[]>([]);
    const [schedules, setSchedules] = useState<PublishingSchedule[]>([]);
    const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
    const [selectedTab, setSelectedTab] = useState<'publish' | 'templates' | 'schedule' | 'branding'>('publish');
    const [showPostModal, setShowPostModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [newPost, setNewPost] = useState<Partial<SocialPost>>({});
    const [newTemplate, setNewTemplate] = useState<Partial<ContentTemplate>>({});
    const [newSchedule, setNewSchedule] = useState<Partial<PublishingSchedule>>({});
    const [isFaithMode, setIsFaithMode] = useState(false);

    // Mock data
    useEffect(() => {
        setPosts([
            {
                id: '1',
                platform: 'instagram',
                type: 'post',
                content: '🚀 Launching my new faith-based business course! Join me on this journey of building with purpose. #KingdomBusiness #FaithBased #Entrepreneur',
                scheduledDate: new Date('2024-01-25'),
                isPublished: false,
                engagement: { likes: 0, comments: 0, shares: 0, saves: 0 },
                tags: ['#KingdomBusiness', '#FaithBased', '#Entrepreneur'],
                isFaithMode: true
            },
            {
                id: '2',
                platform: 'tiktok',
                type: 'video',
                content: 'Quick tip: Start your day with prayer before checking emails! 🙏 #FaithBasedBusiness #MorningRoutine',
                isPublished: true,
                engagement: { likes: 45, comments: 12, shares: 8, saves: 15 },
                tags: ['#FaithBasedBusiness', '#MorningRoutine'],
                isFaithMode: true
            }
        ]);

        setTemplates([
            {
                id: '1',
                name: 'Product Launch Announcement',
                category: 'sales',
                platforms: ['instagram', 'facebook'],
                template: '🎉 Exciting news! My new {product} is now live! {benefit} Get yours today! #NewProduct #Launch',
                variables: ['product', 'benefit'],
                isFaithMode: false
            },
            {
                id: '2',
                name: 'Scripture Inspiration',
                category: 'scripture',
                platforms: ['instagram', 'pinterest'],
                template: '"{scripture}" - {reference}\n\n{reflection} #FaithBased #Inspiration',
                variables: ['scripture', 'reference', 'reflection'],
                isFaithMode: true
            },
            {
                id: '3',
                name: 'Countdown to Launch',
                category: 'countdown',
                platforms: ['instagram', 'tiktok', 'facebook'],
                template: '⏰ Only {days} days until {launch}! Don\'t miss out on {offer}! #Countdown #Launch',
                variables: ['days', 'launch', 'offer'],
                isFaithMode: false
            }
        ]);

        setSchedules([
            {
                id: '1',
                name: 'Daily Inspiration',
                platforms: ['instagram', 'pinterest'],
                frequency: 'daily',
                posts: [],
                isActive: true,
                nextPostDate: new Date('2024-01-26')
            },
            {
                id: '2',
                name: 'Weekly Business Tips',
                platforms: ['facebook', 'linkedin'],
                frequency: 'weekly',
                posts: [],
                isActive: true,
                nextPostDate: new Date('2024-01-28')
            }
        ]);

        setBrandKits([
            {
                id: '1',
                name: 'Kingdom Brand',
                colors: ['#667eea', '#764ba2', '#f093fb'],
                fonts: ['Poppins', 'Playfair Display'],
                templates: []
            }
        ]);
    }, []);

    const generateAIContent = () => {
        const contentTypes = ['sales', 'promo', 'countdown', 'testimonial', 'scripture', 'quote'];
        const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];

        let generatedContent = '';
        let tags = [];

        switch (randomType) {
            case 'sales':
                generatedContent = '🔥 Limited time offer! My {product} is helping entrepreneurs build with purpose. Join {number} others who have transformed their business! #FaithBasedBusiness #Entrepreneur';
                tags = ['#FaithBasedBusiness', '#Entrepreneur', '#LimitedTime'];
                break;
            case 'scripture':
                generatedContent = '"Trust in the Lord with all your heart and lean not on your own understanding." - Proverbs 3:5\n\nWhen building your business, remember to seek God\'s guidance in every decision. #FaithBased #BusinessWisdom';
                tags = ['#FaithBased', '#BusinessWisdom', '#Proverbs'];
                break;
            case 'testimonial':
                generatedContent = '💬 "This course completely changed how I approach my business. Now I build with purpose and faith!" - {customer}\n\nReady to transform your business? #Testimonial #FaithBasedBusiness';
                tags = ['#Testimonial', '#FaithBasedBusiness', '#Transformation'];
                break;
            default:
                generatedContent = '🚀 Ready to take your business to the next level? Join our community of faith-based entrepreneurs! #KingdomBusiness #Growth';
                tags = ['#KingdomBusiness', '#Growth', '#Community'];
        }

        setNewPost({
            ...newPost,
            content: generatedContent,
            tags: tags,
            isFaithMode: isFaithMode
        });

        Alert.alert('AI Content Generated', 'Your content has been created! Review and customize as needed.');
    };

    const publishPost = () => {
        if (!newPost.content || !newPost.platform) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const post: SocialPost = {
            id: Date.now().toString(),
            platform: newPost.platform,
            type: newPost.type || 'post',
            content: newPost.content,
            image: newPost.image,
            scheduledDate: newPost.scheduledDate,
            isPublished: newPost.scheduledDate ? false : true,
            engagement: { likes: 0, comments: 0, shares: 0, saves: 0 },
            tags: newPost.tags || [],
            isFaithMode: newPost.isFaithMode || false
        };

        setPosts([...posts, post]);
        setNewPost({});
        setShowPostModal(false);
        Alert.alert('Success', post.scheduledDate ? 'Post scheduled!' : 'Post published!');
    };

    const createTemplate = () => {
        if (!newTemplate.name || !newTemplate.template) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const template: ContentTemplate = {
            id: Date.now().toString(),
            name: newTemplate.name,
            category: newTemplate.category || 'sales',
            platforms: newTemplate.platforms || [],
            template: newTemplate.template,
            variables: newTemplate.variables || [],
            isFaithMode: newTemplate.isFaithMode || false
        };

        setTemplates([...templates, template]);
        setNewTemplate({});
        setShowTemplateModal(false);
        Alert.alert('Success', 'Template created successfully!');
    };

    const createSchedule = () => {
        if (!newSchedule.name || !newSchedule.platforms) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const schedule: PublishingSchedule = {
            id: Date.now().toString(),
            name: newSchedule.name,
            platforms: newSchedule.platforms,
            frequency: newSchedule.frequency || 'daily',
            posts: [],
            isActive: true,
            nextPostDate: new Date()
        };

        setSchedules([...schedules, schedule]);
        setNewSchedule({});
        setShowScheduleModal(false);
        Alert.alert('Success', 'Schedule created successfully!');
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'instagram': return 'logo-instagram';
            case 'tiktok': return 'logo-tiktok';
            case 'facebook': return 'logo-facebook';
            case 'pinterest': return 'logo-pinterest';
            case 'youtube': return 'logo-youtube';
            default: return 'globe';
        }
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'instagram': return '#E4405F';
            case 'tiktok': return '#000000';
            case 'facebook': return '#1877F2';
            case 'pinterest': return '#BD081C';
            case 'youtube': return '#FF0000';
            default: return '#666';
        }
    };

    const renderPublishing = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📱 Platform Publishing ({posts.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowPostModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Post</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.faithModeToggle}>
                <Text style={styles.faithModeLabel}>Faith Mode</Text>
                <Switch
                    value={isFaithMode}
                    onValueChange={setIsFaithMode}
                    trackColor={{ false: '#767577', true: '#667eea' }}
                    thumbColor={isFaithMode ? '#fff' : '#f4f3f4'}
                />
            </View>

            {posts.map(post => (
                <View key={post.id} style={styles.postCard}>
                    <View style={styles.postHeader}>
                        <View style={styles.platformInfo}>
                            <Ionicons
                                name={getPlatformIcon(post.platform) as any}
                                size={20}
                                color={getPlatformColor(post.platform)}
                            />
                            <Text style={styles.platformName}>{post.platform}</Text>
                            <Text style={styles.postType}>{post.type}</Text>
                        </View>
                        <View style={styles.postStatus}>
                            {post.isPublished ? (
                                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                            ) : (
                                <Ionicons name="time" size={20} color="#FF9800" />
                            )}
                        </View>
                    </View>
                    <Text style={styles.postContent}>{post.content}</Text>
                    <View style={styles.postTags}>
                        {post.tags.map(tag => (
                            <Text key={tag} style={styles.tag}>{tag}</Text>
                        ))}
                    </View>
                    {post.engagement && (
                        <View style={styles.engagement}>
                            <Text style={styles.engagementText}>
                                ❤️ {post.engagement.likes} 💬 {post.engagement.comments}
                                🔄 {post.engagement.shares} 💾 {post.engagement.saves}
                            </Text>
                        </View>
                    )}
                    {post.isFaithMode && (
                        <View style={styles.faithBadge}>
                            <Ionicons name="heart" size={12} color="#E4405F" />
                            <Text style={styles.faithBadgeText}>Faith Mode</Text>
                        </View>
                    )}
                </View>
            ))}
        </View>
    );

    const renderTemplates = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📝 Content Templates ({templates.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowTemplateModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Template</Text>
                </TouchableOpacity>
            </View>

            {templates.map(template => (
                <View key={template.id} style={styles.templateCard}>
                    <View style={styles.templateHeader}>
                        <Text style={styles.templateName}>{template.name}</Text>
                        <Text style={styles.templateCategory}>{template.category}</Text>
                    </View>
                    <Text style={styles.templateContent}>{template.template}</Text>
                    <View style={styles.templatePlatforms}>
                        {template.platforms.map(platform => (
                            <Ionicons
                                key={platform}
                                name={getPlatformIcon(platform) as any}
                                size={16}
                                color={getPlatformColor(platform)}
                            />
                        ))}
                    </View>
                    {template.isFaithMode && (
                        <View style={styles.faithBadge}>
                            <Ionicons name="heart" size={12} color="#E4405F" />
                            <Text style={styles.faithBadgeText}>Faith Mode</Text>
                        </View>
                    )}
                </View>
            ))}
        </View>
    );

    const renderSchedules = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📅 Publishing Schedules ({schedules.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowScheduleModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Schedule</Text>
                </TouchableOpacity>
            </View>

            {schedules.map(schedule => (
                <View key={schedule.id} style={styles.scheduleCard}>
                    <View style={styles.scheduleHeader}>
                        <Text style={styles.scheduleName}>{schedule.name}</Text>
                        <Text style={styles.scheduleFrequency}>{schedule.frequency}</Text>
                    </View>
                    <View style={styles.schedulePlatforms}>
                        {schedule.platforms.map(platform => (
                            <Ionicons
                                key={platform}
                                name={getPlatformIcon(platform) as any}
                                size={16}
                                color={getPlatformColor(platform)}
                            />
                        ))}
                    </View>
                    <Text style={styles.scheduleNext}>
                        Next: {schedule.nextPostDate.toLocaleDateString()}
                    </Text>
                    <View style={styles.scheduleStatus}>
                        <View style={[styles.statusDot, { backgroundColor: schedule.isActive ? '#4CAF50' : '#f44336' }]} />
                        <Text style={styles.statusText}>{schedule.isActive ? 'Active' : 'Paused'}</Text>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderBranding = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 Brand Kits ({brandKits.length})</Text>
            <Text style={styles.sectionDescription}>
                Manage your brand colors, fonts, and templates
            </Text>

            {brandKits.map(kit => (
                <View key={kit.id} style={styles.brandCard}>
                    <Text style={styles.brandName}>{kit.name}</Text>
                    <View style={styles.brandColors}>
                        {kit.colors.map((color, index) => (
                            <View
                                key={index}
                                style={[styles.colorSwatch, { backgroundColor: color }]}
                            />
                        ))}
                    </View>
                    <View style={styles.brandFonts}>
                        {kit.fonts.map(font => (
                            <Text key={font} style={styles.fontName}>{font}</Text>
                        ))}
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
                <Text style={styles.headerTitle}>📱 Platform Publishing</Text>
                <Text style={styles.headerSubtitle}>Publish across all social platforms with AI assistance</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'publish' && styles.activeTab]}
                    onPress={() => setSelectedTab('publish')}
                >
                    <Ionicons name="send" size={20} color={selectedTab === 'publish' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'publish' && styles.activeTabText]}>
                        Publish
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'templates' && styles.activeTab]}
                    onPress={() => setSelectedTab('templates')}
                >
                    <Ionicons name="document-text" size={20} color={selectedTab === 'templates' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'templates' && styles.activeTabText]}>
                        Templates
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'schedule' && styles.activeTab]}
                    onPress={() => setSelectedTab('schedule')}
                >
                    <Ionicons name="calendar" size={20} color={selectedTab === 'schedule' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'schedule' && styles.activeTabText]}>
                        Schedule
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'branding' && styles.activeTab]}
                    onPress={() => setSelectedTab('branding')}
                >
                    <Ionicons name="color-palette" size={20} color={selectedTab === 'branding' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'branding' && styles.activeTabText]}>
                        Branding
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{posts.length}</Text>
                        <Text style={styles.statLabel}>Total Posts</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{templates.length}</Text>
                        <Text style={styles.statLabel}>Templates</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{schedules.length}</Text>
                        <Text style={styles.statLabel}>Schedules</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {posts.reduce((sum, p) => sum + p.engagement.likes + p.engagement.comments + p.engagement.shares, 0)}
                        </Text>
                        <Text style={styles.statLabel}>Total Engagement</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'publish' && renderPublishing()}
                {selectedTab === 'templates' && renderTemplates()}
                {selectedTab === 'schedule' && renderSchedules()}
                {selectedTab === 'branding' && renderBranding()}

                {/* Post Modal */}
                <Modal
                    visible={showPostModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowPostModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Social Post</Text>

                            <TouchableOpacity
                                style={styles.aiButton}
                                onPress={generateAIContent}
                            >
                                <Ionicons name="sparkles" size={20} color="#fff" />
                                <Text style={styles.aiButtonText}>Generate AI Content</Text>
                            </TouchableOpacity>

                            <Text style={styles.inputLabel}>Platform</Text>
                            <View style={styles.radioGroup}>
                                {['instagram', 'tiktok', 'facebook', 'pinterest', 'youtube'].map(platform => (
                                    <TouchableOpacity
                                        key={platform}
                                        style={[
                                            styles.radioButton,
                                            newPost.platform === platform && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewPost({ ...newPost, platform: platform as any })}
                                    >
                                        <Ionicons
                                            name={getPlatformIcon(platform) as any}
                                            size={16}
                                            color={getPlatformColor(platform)}
                                        />
                                        <Text style={styles.radioLabel}>{platform}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Post Type</Text>
                            <View style={styles.radioGroup}>
                                {['post', 'story', 'reel', 'video', 'pin'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newPost.type === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewPost({ ...newPost, type: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Content</Text>
                            <TextInput
                                style={[styles.input, { height: 120 }]}
                                value={newPost.content}
                                onChangeText={(text) => setNewPost({ ...newPost, content: text })}
                                placeholder="Write your post content..."
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.settingRow}>
                                <Text style={styles.settingLabel}>Faith Mode</Text>
                                <Switch
                                    value={newPost.isFaithMode}
                                    onValueChange={(value) => setNewPost({ ...newPost, isFaithMode: value })}
                                />
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={publishPost}
                                >
                                    <Text style={styles.modalButtonText}>Publish Post</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowPostModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Template Modal */}
                <Modal
                    visible={showTemplateModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowTemplateModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Content Template</Text>

                            <Text style={styles.inputLabel}>Template Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newTemplate.name}
                                onChangeText={(text) => setNewTemplate({ ...newTemplate, name: text })}
                                placeholder="e.g., Product Launch Announcement"
                            />

                            <Text style={styles.inputLabel}>Category</Text>
                            <View style={styles.radioGroup}>
                                {['sales', 'promo', 'countdown', 'testimonial', 'scripture', 'quote'].map(category => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.radioButton,
                                            newTemplate.category === category && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewTemplate({ ...newTemplate, category: category as any })}
                                    >
                                        <Text style={styles.radioLabel}>{category}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Template Content</Text>
                            <TextInput
                                style={[styles.input, { height: 100 }]}
                                value={newTemplate.template}
                                onChangeText={(text) => setNewTemplate({ ...newTemplate, template: text })}
                                placeholder="Use {variable} for dynamic content..."
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.settingRow}>
                                <Text style={styles.settingLabel}>Faith Mode</Text>
                                <Switch
                                    value={newTemplate.isFaithMode}
                                    onValueChange={(value) => setNewTemplate({ ...newTemplate, isFaithMode: value })}
                                />
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createTemplate}
                                >
                                    <Text style={styles.modalButtonText}>Create Template</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowTemplateModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Schedule Modal */}
                <Modal
                    visible={showScheduleModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowScheduleModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Publishing Schedule</Text>

                            <Text style={styles.inputLabel}>Schedule Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newSchedule.name}
                                onChangeText={(text) => setNewSchedule({ ...newSchedule, name: text })}
                                placeholder="e.g., Daily Inspiration"
                            />

                            <Text style={styles.inputLabel}>Frequency</Text>
                            <View style={styles.radioGroup}>
                                {['daily', 'weekly', 'custom'].map(frequency => (
                                    <TouchableOpacity
                                        key={frequency}
                                        style={[
                                            styles.radioButton,
                                            newSchedule.frequency === frequency && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewSchedule({ ...newSchedule, frequency: frequency as any })}
                                    >
                                        <Text style={styles.radioLabel}>{frequency}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createSchedule}
                                >
                                    <Text style={styles.modalButtonText}>Create Schedule</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowScheduleModal(false)}
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
    faithModeToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    faithModeLabel: {
        fontSize: 16,
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
    postCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    platformInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    platformName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textTransform: 'capitalize',
    },
    postType: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    postStatus: {
        padding: 4,
    },
    postContent: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    postTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    tag: {
        fontSize: 10,
        color: '#667eea',
        marginRight: 4,
        marginBottom: 2,
    },
    engagement: {
        marginBottom: 4,
    },
    engagementText: {
        fontSize: 12,
        color: '#666',
    },
    faithBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    faithBadgeText: {
        fontSize: 10,
        color: '#E4405F',
        fontWeight: 'bold',
    },
    templateCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    templateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    templateName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    templateCategory: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    templateContent: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    templatePlatforms: {
        flexDirection: 'row',
        gap: 8,
    },
    scheduleCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    scheduleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    scheduleName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    scheduleFrequency: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    schedulePlatforms: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    scheduleNext: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    scheduleStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        color: '#666',
    },
    brandCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    brandName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    brandColors: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    colorSwatch: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    brandFonts: {
        flexDirection: 'row',
        gap: 8,
    },
    fontName: {
        fontSize: 12,
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
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    aiButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#667eea',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    aiButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        gap: 4,
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
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    settingLabel: {
        fontSize: 16,
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

export default PlatformPublishingScreen; 