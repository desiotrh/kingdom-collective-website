import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    PanGestureHandler,
    State,
    Dimensions,
    Alert,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from 'packages/hooks/useFaithMode';
import PostCreator from '@/components/PostCreator';
import Feed from '@/components/Feed';
import { PostData } from '@/components/PostCreator';

interface EncouragementMessage {
    id: string;
    text: string;
    reference?: string;
    author?: string;
    timestamp: number;
}

const FAITH_MESSAGES: EncouragementMessage[] = [
    {
        id: '1',
        text: 'He restores my soul.',
        reference: 'Psalm 23:3',
        author: 'David',
        timestamp: Date.now() - 86400000,
    },
    {
        id: '2',
        text: 'I can do all things through Christ who strengthens me.',
        reference: 'Philippians 4:13',
        author: 'Paul',
        timestamp: Date.now() - 172800000,
    },
    {
        id: '3',
        text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
        reference: 'Joshua 1:9',
        author: 'Joshua',
        timestamp: Date.now() - 259200000,
    },
    {
        id: '4',
        text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
        reference: 'Jeremiah 29:11',
        author: 'Jeremiah',
        timestamp: Date.now() - 345600000,
    },
];

const ENCOURAGEMENT_MESSAGES: EncouragementMessage[] = [
    {
        id: '1',
        text: 'You\'re doing better than you think. Keep building.',
        author: 'Community',
        timestamp: Date.now() - 86400000,
    },
    {
        id: '2',
        text: 'Your potential is greater than your current circumstances.',
        author: 'Growth Circle',
        timestamp: Date.now() - 172800000,
    },
    {
        id: '3',
        text: 'Every step forward is progress, no matter how small.',
        author: 'Wellness Team',
        timestamp: Date.now() - 259200000,
    },
    {
        id: '4',
        text: 'You have the strength within you to overcome this challenge.',
        author: 'Support Network',
        timestamp: Date.now() - 345600000,
    },
];

const { width: screenWidth } = Dimensions.get('window');

export default function CircleHomeScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { faithMode, encouragementMode } = useFaithMode();

    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [messages, setMessages] = useState<EncouragementMessage[]>([]);
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [showPostCreator, setShowPostCreator] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);

    // Animations
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const flameAnim = useRef(new Animated.Value(0)).current;

    // Auto-rotation timer
    useEffect(() => {
        const messages = faithMode ? FAITH_MESSAGES : ENCOURAGEMENT_MESSAGES;
        setMessages(messages);

        const interval = setInterval(() => {
            nextMessage();
        }, 24000); // 24 seconds for testing (24 hours in production)

        return () => clearInterval(interval);
    }, [faithMode]);

    // Flame animation for Faith Mode
    useEffect(() => {
        if (faithMode) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(flameAnim, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(flameAnim, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [faithMode]);

    // Post creation handler
    const handleCreatePost = async (postData: PostData) => {
        try {
            // In a real app, this would upload to backend
            const newPost = {
                id: `post_${Date.now()}`,
                userId: 'current_user',
                userName: 'You',
                userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                mediaUrl: postData.mediaUrl,
                mediaType: postData.mediaUrl.includes('.mp4') ? 'video' : 'image',
                caption: postData.caption,
                category: postData.category,
                tags: postData.tags,
                monetization: postData.monetization,
                visibilityFlags: postData.visibilityFlags,
                engagement: {
                    views: 0,
                    likes: 0,
                    shares: 0,
                    saves: 0,
                    comments: 0,
                    watchTimePercent: 0,
                    rewatches: 0,
                    profileClicks: 0,
                },
                timestamp: new Date(),
                score: 0,
            };

            setPosts(prev => [newPost, ...prev]);
            Alert.alert(
                faithMode ? 'Truth Shared! 🙏' : 'Post Created! ✨',
                faithMode
                    ? 'Your message has been shared with the community. May it bless others!'
                    : 'Your post has been shared with the community!'
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to create post. Please try again.');
        }
    };

    // Feed interaction handlers
    const handlePostPress = (post: any) => {
        // Handle post press - could open detailed view
        console.log('Post pressed:', post.id);
    };

    const handleUserPress = (userId: string) => {
        // Handle user profile press
        console.log('User pressed:', userId);
    };

    const handleLike = (postId: string) => {
        setPosts(prev => prev.map(post => 
            post.id === postId 
                ? { ...post, engagement: { ...post.engagement, likes: post.engagement.likes + 1 } }
                : post
        ));
    };

    const handleShare = (postId: string) => {
        setPosts(prev => prev.map(post => 
            post.id === postId 
                ? { ...post, engagement: { ...post.engagement, shares: post.engagement.shares + 1 } }
                : post
        ));
    };

    const handleSave = (postId: string) => {
        setPosts(prev => prev.map(post => 
            post.id === postId 
                ? { ...post, engagement: { ...post.engagement, saves: post.engagement.saves + 1 } }
                : post
        ));
    };

    const handleComment = (postId: string) => {
        // Handle comment action
        console.log('Comment on post:', postId);
    };

    const handleTip = (postId: string) => {
        Alert.alert(
            faithMode ? 'Bless Creator' : 'Tip Creator',
            faithMode
                ? 'This would open a blessing interface to support the creator.'
                : 'This would open a tipping interface to support the creator.'
        );
    };

    const handleProductClick = (productLink: string) => {
        Alert.alert('Product Link', `This would open: ${productLink}`);
    };

    const nextMessage = () => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -screenWidth,
                duration: 0,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        setCurrentIndex((prev) => (prev + 1) % messages.length);
    };

    const previousMessage = () => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: screenWidth,
                duration: 0,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
    };

    const handleSwipe = (direction: 'left' | 'right') => {
        if (direction === 'left') {
            nextMessage();
        } else {
            previousMessage();
        }
    };

    const handleTap = () => {
        setShowFullScreen(true);
        // Future: Add voice reading functionality
    };

    const currentMessage = messages[currentIndex];

    const renderEncouragementCard = () => {
        if (!currentMessage) return null;

        return (
            <Animated.View
                style={[
                    styles.encouragementCard,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.olive,
                        opacity: fadeAnim,
                        transform: [{ translateX: slideAnim }],
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.cardContent}
                    onPress={handleTap}
                    activeOpacity={0.8}
                >
                    {/* Faith Mode Flame Animation */}
                    {faithMode && (
                        <Animated.View
                            style={[
                                styles.flameOverlay,
                                {
                                    opacity: flameAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.3, 0.8],
                                    }),
                                },
                            ]}
                        >
                            <Text style={[styles.flameText, { color: colors.emerald }]}>
                                ✝️
                            </Text>
                        </Animated.View>
                    )}

                    {/* Message Content */}
                    <View style={styles.messageContainer}>
                        <Text style={[styles.messageText, { color: colors.text }]}>
                            {currentMessage.text}
                        </Text>

                        {faithMode && currentMessage.reference && (
                            <View style={[styles.referenceContainer, { backgroundColor: colors.sand }]}>
                                <Text style={[styles.referenceText, { color: colors.emerald }]}>
                                    — {currentMessage.reference}
                                </Text>
                                {currentMessage.author && (
                                    <Text style={[styles.authorText, { color: colors.olive }]}>
                                        {currentMessage.author}
                                    </Text>
                                )}
                            </View>
                        )}

                        {encouragementMode && currentMessage.author && (
                            <View style={[styles.authorContainer, { backgroundColor: colors.sand }]}>
                                <Text style={[styles.authorText, { color: colors.olive }]}>
                                    — {currentMessage.author}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Navigation Dots */}
                    <View style={styles.dotsContainer}>
                        {messages.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    {
                                        backgroundColor: index === currentIndex ? colors.emerald : colors.olive,
                                        opacity: index === currentIndex ? 1 : 0.3,
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.emerald }]}>
                    {faithMode ? 'Daily Encouragement' : 'Growth Feed'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.olive }]}>
                    {faithMode
                        ? 'Scripture to strengthen your faith.'
                        : 'Truth to build your confidence.'
                    }
                </Text>
            </View>

            {/* Social Media Feed */}
            <View style={styles.feedContainer}>
                {/* Create Post Button */}
                <TouchableOpacity
                    style={[styles.createPostButton, { backgroundColor: colors.emerald }]}
                    onPress={() => setShowPostCreator(true)}
                >
                    <Text style={[styles.createPostButtonText, { color: colors.cream }]}>
                        {faithMode ? '✝️ Share Your Truth' : '✨ Create Post'}
                    </Text>
                </TouchableOpacity>

                {/* Feed Component */}
                <Feed
                    posts={posts}
                    onPostPress={handlePostPress}
                    onUserPress={handleUserPress}
                    onLike={handleLike}
                    onShare={handleShare}
                    onSave={handleSave}
                    onComment={handleComment}
                    onTip={handleTip}
                    onProductClick={handleProductClick}
                />
            </View>

            {/* Post Creator Modal */}
            <PostCreator
                visible={showPostCreator}
                onClose={() => setShowPostCreator(false)}
                onSubmit={handleCreatePost}
            />

            {/* Full Screen Modal (Future Implementation) */}
            {showFullScreen && (
                <View style={[styles.fullScreenModal, { backgroundColor: colors.background }]}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowFullScreen(false)}
                    >
                        <Text style={[styles.closeButtonText, { color: colors.olive }]}>✕</Text>
                    </TouchableOpacity>
                    <View style={styles.fullScreenContent}>
                        <Text style={[styles.fullScreenTitle, { color: colors.emerald }]}>
                            {faithMode ? 'Scripture Reading' : 'Growth Message'}
                        </Text>
                        <Text style={[styles.fullScreenText, { color: colors.text }]}>
                            {currentMessage?.text}
                        </Text>
                        {faithMode && currentMessage?.reference && (
                            <Text style={[styles.fullScreenReference, { color: colors.emerald }]}>
                                {currentMessage.reference}
                            </Text>
                        )}
                        <Text style={[styles.fullScreenNote, { color: colors.olive }]}>
                            Voice reading coming soon...
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Nunito_700SemiBold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Quicksand_400Regular',
    },
    feedContainer: {
        flex: 1,
    },
    createPostButton: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    createPostButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    encouragementCard: {
        marginHorizontal: 20,
        borderRadius: 16,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        minHeight: 200,
        position: 'relative',
    },
    cardContent: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    flameOverlay: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
    },
    flameText: {
        fontSize: 24,
        fontFamily: 'Nunito_700SemiBold',
    },
    messageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    messageText: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 28,
        marginBottom: 16,
        fontFamily: 'Nunito_600SemiBold',
        paddingHorizontal: 8,
    },
    referenceContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 8,
    },
    referenceText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
        textAlign: 'center',
    },
    authorContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 8,
    },
    authorText: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        paddingHorizontal: 20,
    },
    navButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        minWidth: 100,
        alignItems: 'center',
    },
    navButtonText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    modeIndicator: {
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        marginHorizontal: 20,
    },
    modeText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    autoRotateText: {
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Quicksand_400Regular',
    },
    fullScreenModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    closeButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        padding: 12,
        zIndex: 1001,
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    fullScreenContent: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    fullScreenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        fontFamily: 'Nunito_700SemiBold',
        textAlign: 'center',
    },
    fullScreenText: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: 'Nunito_600SemiBold',
    },
    fullScreenReference: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        fontFamily: 'Nunito_600SemiBold',
        textAlign: 'center',
    },
    fullScreenNote: {
        fontSize: 14,
        fontStyle: 'italic',
        fontFamily: 'Quicksand_400Regular',
        textAlign: 'center',
    },
}); 