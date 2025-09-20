import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Video } from 'expo-av';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from 'packages/hooks/useFaithMode';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Post {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    caption: string;
    category: string;
    tags: string[];
    monetization: {
        tipsEnabled: boolean;
        paidAccess: boolean;
        productLink?: string;
        price?: number;
    };
    visibilityFlags: {
        mature: boolean;
        sensitive: boolean;
        spiritual: boolean;
    };
    engagement: {
        views: number;
        likes: number;
        shares: number;
        saves: number;
        comments: number;
        watchTimePercent: number;
        rewatches: number;
        profileClicks: number;
    };
    timestamp: Date;
    score: number;
    // Add live streaming support for everyone
    isLiveStream?: boolean;
    liveStreamData?: {
        viewerCount: number;
        isLive: boolean;
        startedAt: Date;
        title: string;
    };
}

type FeedTab = 'forYou' | 'trending' | 'recent' | 'faithFlow' | 'unfiltered' | 'liveNow';

interface FeedProps {
    posts: Post[];
    onPostPress: (post: Post) => void;
    onUserPress: (userId: string) => void;
    onLike: (postId: string) => void;
    onShare: (postId: string) => void;
    onSave: (postId: string) => void;
    onComment: (postId: string) => void;
    onTip: (postId: string) => void;
    onProductClick: (productLink: string) => void;
}

// Feed scoring algorithm
const scorePost = (post: Post): number => {
    const {
        watchTimePercent,
        rewatches,
        shares,
        saves,
        likes,
        comments,
        profileClicks
    } = post.engagement;

    return (
        (watchTimePercent * 2) +
        (rewatches * 1.5) +
        (shares * 2) +
        (saves * 1.5) +
        (likes * 1) +
        (comments * 1.25) +
        (profileClicks * 1.5)
    );
};

// Mock data for demonstration
const generateMockPosts = (): Post[] => {
    const categories = [
        'Faith & Spirituality',
        'Family & Relationships',
        'Health & Wellness',
        'Business & Career',
        'Education & Learning',
        'Entertainment & Culture',
        'News & Politics',
        'Technology & Innovation',
        'Lifestyle & Personal Growth',
        'Community & Service',
    ];

    const tags = [
        'faith', 'family', 'health', 'business', 'education', 'entertainment',
        'news', 'technology', 'lifestyle', 'community', 'inspiration', 'motivation',
        'truth', 'freedom', 'growth', 'wisdom', 'love', 'hope', 'courage'
    ];

    return Array.from({ length: 20 }, (_, index) => {
        const post: Post = {
            id: `post_${index}`,
            userId: `user_${Math.floor(Math.random() * 100)}`,
            userName: `Creator ${index + 1}`,
            userAvatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`,
            mediaUrl: `https://picsum.photos/400/600?random=${index}`,
            mediaType: Math.random() > 0.7 ? 'video' : 'image',
            caption: `This is post ${index + 1} with some meaningful content that could be about faith, family, or personal growth. ${Math.random() > 0.5 ? 'Sharing some truth and encouragement today!' : 'What do you think about this?'}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            tags: tags.slice(0, Math.floor(Math.random() * 5) + 1).sort(() => Math.random() - 0.5),
            monetization: {
                tipsEnabled: Math.random() > 0.6,
                paidAccess: false, // No paid posts - everyone has equal access
                productLink: Math.random() > 0.7 ? 'https://example.com/product' : undefined,
                price: undefined, // No paid content restrictions
            },
            visibilityFlags: {
                mature: Math.random() > 0.9,
                sensitive: Math.random() > 0.85,
                spiritual: Math.random() > 0.4,
            },
            engagement: {
                views: Math.floor(Math.random() * 10000) + 100,
                likes: Math.floor(Math.random() * 500) + 10,
                shares: Math.floor(Math.random() * 100) + 5,
                saves: Math.floor(Math.random() * 50) + 2,
                comments: Math.floor(Math.random() * 30) + 1,
                watchTimePercent: Math.random() * 100,
                rewatches: Math.floor(Math.random() * 10),
                profileClicks: Math.floor(Math.random() * 20),
            },
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            score: 0,
            // Add live streaming support for everyone
            isLiveStream: Math.random() > 0.95, // 5% chance of being live
            liveStreamData: Math.random() > 0.95 ? {
                viewerCount: Math.floor(Math.random() * 1000) + 50,
                isLive: true,
                startedAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000), // Started within last hour
                title: `Live: ${['Prayer Time', 'Testimony', 'Teaching', 'Q&A', 'Worship'][Math.floor(Math.random() * 5)]}`,
            } : undefined,
        };

        post.score = scorePost(post);
        return post;
    });
};

export default function Feed({
    posts: initialPosts,
    onPostPress,
    onUserPress,
    onLike,
    onShare,
    onSave,
    onComment,
    onTip,
    onProductClick,
}: FeedProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { faithMode } = useFaithMode();

    const [activeTab, setActiveTab] = useState<FeedTab>('forYou');
    const [posts, setPosts] = useState<Post[]>(initialPosts.length > 0 ? initialPosts : generateMockPosts());
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

    const flatListRef = useRef<FlatList>(null);

    // Filter posts based on active tab
    useEffect(() => {
        let filtered: Post[] = [...posts];

        switch (activeTab) {
            case 'forYou':
                // Algorithm-based sorting by score
                filtered.sort((a, b) => b.score - a.score);
                break;
            
            case 'trending':
                // Posts with high engagement in last 24 hours
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                filtered = filtered.filter(post => post.timestamp > oneDayAgo);
                filtered.sort((a, b) => b.engagement.shares - a.engagement.shares);
                break;
            
            case 'recent':
                // Most recent posts
                filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
                break;
            
            case 'faithFlow':
                // Faith-related content (spiritual flag or faith category)
                filtered = filtered.filter(post => 
                    post.visibilityFlags.spiritual || 
                    post.category === 'Faith & Spirituality' ||
                    post.tags.includes('faith')
                );
                filtered.sort((a, b) => b.score - a.score);
                break;
            
            case 'unfiltered':
                // All posts, no filtering
                filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
                break;

            case 'liveNow':
                // Live streaming content - available to everyone
                filtered = filtered.filter(post => post.isLiveStream && post.liveStreamData?.isLive);
                filtered.sort((a, b) => (b.liveStreamData?.viewerCount || 0) - (a.liveStreamData?.viewerCount || 0));
                break;
        }

        setFilteredPosts(filtered);
    }, [activeTab, posts]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            // Mock refresh - in real app, this would fetch new posts
            await new Promise(resolve => setTimeout(resolve, 1000));
            const newPosts = generateMockPosts();
            setPosts(newPosts);
        } catch (error) {
            console.error('Failed to refresh posts:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const renderTabButton = (tab: FeedTab, label: string, icon: string) => (
        <TouchableOpacity
            style={[
                styles.tabButton,
                activeTab === tab && { backgroundColor: colors.emerald }
            ]}
            onPress={() => setActiveTab(tab)}
        >
            <Text style={[
                styles.tabButtonText,
                { color: activeTab === tab ? colors.cream : colors.text }
            ]}>
                {icon} {label}
            </Text>
        </TouchableOpacity>
    );

    const renderPost = ({ item: post }: { item: Post }) => (
        <View style={[styles.postCard, { backgroundColor: colors.card }]}>
            {/* Post Header */}
            <View style={styles.postHeader}>
                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => onUserPress(post.userId)}
                >
                    <Image
                        source={{ uri: post.userAvatar }}
                        style={styles.userAvatar}
                    />
                    <View style={styles.userDetails}>
                        <Text style={[styles.userName, { color: colors.text }]}>
                            {post.userName}
                        </Text>
                        <Text style={[styles.postTime, { color: colors.olive }]}>
                            {formatTimeAgo(post.timestamp)}
                        </Text>
                    </View>
                </TouchableOpacity>
                
                <View style={styles.postFlags}>
                    {post.visibilityFlags.mature && (
                        <Text style={styles.flagBadge}>🔞</Text>
                    )}
                    {post.visibilityFlags.sensitive && (
                        <Text style={styles.flagBadge}>⚠️</Text>
                    )}
                    {post.visibilityFlags.spiritual && (
                        <Text style={styles.flagBadge}>✨</Text>
                    )}
                </View>
            </View>

            {/* Post Media */}
            <TouchableOpacity
                style={styles.mediaContainer}
                onPress={() => onPostPress(post)}
            >
                {post.mediaType === 'video' ? (
                    <Video
                        source={{ uri: post.mediaUrl }}
                        style={styles.media}
                        useNativeControls
                        resizeMode="cover"
                    />
                ) : (
                    <Image
                        source={{ uri: post.mediaUrl }}
                        style={styles.media}
                        resizeMode="cover"
                    />
                )}
                
                {/* Live Stream Badge - Available to everyone */}
                {post.isLiveStream && post.liveStreamData?.isLive && (
                    <View style={styles.liveBadge}>
                        <Text style={styles.liveBadgeText}>
                            🔴 LIVE {post.liveStreamData.viewerCount} watching
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Post Content */}
            <View style={styles.postContent}>
                <Text style={[styles.caption, { color: colors.text }]}>
                    {post.caption}
                </Text>
                
                {/* Tags */}
                {post.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {post.tags.map((tag, index) => (
                            <Text key={index} style={[styles.tag, { color: colors.emerald }]}>
                                #{tag}
                            </Text>
                        ))}
                    </View>
                )}

                {/* Category */}
                <Text style={[styles.category, { color: colors.olive }]}>
                    📂 {post.category}
                </Text>

                {/* Monetization */}
                {post.monetization.tipsEnabled && (
                    <TouchableOpacity
                        style={[styles.tipButton, { backgroundColor: colors.emerald }]}
                        onPress={() => onTip(post.id)}
                    >
                        <Text style={[styles.tipButtonText, { color: colors.cream }]}>
                            💝 {faithMode ? 'Bless Creator' : 'Tip Creator'}
                        </Text>
                    </TouchableOpacity>
                )}

                {post.monetization.productLink && (
                    <TouchableOpacity
                        style={[styles.productButton, { borderColor: colors.olive }]}
                        onPress={() => onProductClick(post.monetization.productLink!)}
                    >
                        <Text style={[styles.productButtonText, { color: colors.olive }]}>
                            🛍️ {faithMode ? 'View Resource' : 'View Product'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Engagement Actions */}
            <View style={styles.engagementActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onLike(post.id)}
                >
                    <Text style={[styles.actionIcon, { color: colors.emerald }]}>
                        ❤️
                    </Text>
                    <Text style={[styles.actionCount, { color: colors.text }]}>
                        {post.engagement.likes.toLocaleString()}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onComment(post.id)}
                >
                    <Text style={[styles.actionIcon, { color: colors.olive }]}>
                        💬
                    </Text>
                    <Text style={[styles.actionCount, { color: colors.text }]}>
                        {post.engagement.comments.toLocaleString()}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onShare(post.id)}
                >
                    <Text style={[styles.actionIcon, { color: colors.olive }]}>
                        📤
                    </Text>
                    <Text style={[styles.actionCount, { color: colors.text }]}>
                        {post.engagement.shares.toLocaleString()}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onSave(post.id)}
                >
                    <Text style={[styles.actionIcon, { color: colors.olive }]}>
                        🔖
                    </Text>
                    <Text style={[styles.actionCount, { color: colors.text }]}>
                        {post.engagement.saves.toLocaleString()}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Engagement Stats */}
            <View style={styles.engagementStats}>
                <Text style={[styles.statsText, { color: colors.olive }]}>
                    👁️ {post.engagement.views.toLocaleString()} views
                </Text>
                <Text style={[styles.statsText, { color: colors.olive }]}>
                    📊 Score: {post.score.toFixed(1)}
                </Text>
            </View>
        </View>
    );

    const formatTimeAgo = (timestamp: Date): string => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Tab Navigation */}
            <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {renderTabButton('forYou', 'For You', '🎯')}
                    {renderTabButton('trending', 'Trending', '🔥')}
                    {renderTabButton('recent', 'Recent', '🕒')}
                    {renderTabButton('faithFlow', faithMode ? 'Faith Flow' : 'Inspiration', '✨')}
                    {renderTabButton('liveNow', 'Live Now', '📺')}
                    {renderTabButton('unfiltered', 'Unfiltered', '🌐')}
                </ScrollView>
            </View>

            {/* Posts Feed */}
            <FlatList
                ref={flatListRef}
                data={filteredPosts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.emerald]}
                        tintColor={colors.emerald}
                    />
                }
                onEndReached={() => {
                    // Load more posts when reaching end
                    if (!loading) {
                        setLoading(true);
                        // Mock loading more posts
                        setTimeout(() => {
                            const morePosts = generateMockPosts();
                            setPosts(prev => [...prev, ...morePosts]);
                            setLoading(false);
                        }, 1000);
                    }
                }}
                onEndReachedThreshold={0.1}
                ListFooterComponent={
                    loading ? (
                        <View style={styles.loadingFooter}>
                            <ActivityIndicator size="large" color={colors.emerald} />
                            <Text style={[styles.loadingText, { color: colors.olive }]}>
                                Loading more posts...
                            </Text>
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyStateText, { color: colors.olive }]}>
                            {faithMode
                                ? 'No posts yet. Be the first to share your truth! 🙏'
                                : 'No posts yet. Be the first to share your story! ✨'
                            }
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    tabButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    postCard: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    postTime: {
        fontSize: 12,
    },
    postFlags: {
        flexDirection: 'row',
        gap: 4,
    },
    flagBadge: {
        fontSize: 16,
    },
    mediaContainer: {
        position: 'relative',
    },
    media: {
        width: '100%',
        height: 500,
    },
    paidBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    paidBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    postContent: {
        padding: 16,
    },
    caption: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    tag: {
        fontSize: 14,
        fontWeight: '500',
    },
    category: {
        fontSize: 12,
        marginBottom: 12,
    },
    tipButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 8,
    },
    tipButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    productButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    productButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    engagementActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionIcon: {
        fontSize: 20,
    },
    actionCount: {
        fontSize: 14,
        fontWeight: '500',
    },
    engagementStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    statsText: {
        fontSize: 12,
    },
    loadingFooter: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        fontSize: 14,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    liveBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(255,0,0,0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    liveBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});
