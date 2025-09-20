import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Modal,
    Image,
    Dimensions,
    Platform,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from 'packages/hooks/useFaithMode';

const { width: screenWidth } = Dimensions.get('window');

interface PostCreatorProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (postData: PostData) => void;
}

export interface PostData {
    mediaUrl: string;
    caption: string;
    category: string;
    tags: string[];
    monetization: {
        tipsEnabled: boolean;
        paidAccess: boolean; // Keep for compatibility but always false
        productLink?: string;
        price?: number; // Keep for compatibility but always undefined
        // Enhanced monetization options for everyone
        subscriptionContent: boolean;
        exclusiveAccess: boolean;
        merchandiseLinks: string[];
        eventTickets: boolean;
        coachingSessions: boolean;
        affiliateLinks: string[];
        donationLinks: string[];
    };
    visibilityFlags: {
        mature: boolean;
        sensitive: boolean;
        spiritual: boolean;
    };
    // Live streaming options for everyone
    liveStreaming: {
        isLiveStream: boolean;
        title?: string;
        description?: string;
        scheduledTime?: Date;
        isPublic: boolean;
        allowComments: boolean;
        allowReactions: boolean;
        faithMode: boolean;
    };
}

const CATEGORIES = [
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
    'Other'
];

const SUGGESTED_TAGS = [
    'faith', 'family', 'health', 'business', 'education', 'entertainment',
    'news', 'technology', 'lifestyle', 'community', 'inspiration', 'motivation',
    'truth', 'freedom', 'growth', 'wisdom', 'love', 'hope', 'courage'
];

export default function PostCreator({ visible, onClose, onSubmit }: PostCreatorProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { faithMode } = useFaithMode();

    const [postData, setPostData] = useState<PostData>({
        mediaUrl: '',
        caption: '',
        category: '',
        tags: [],
        monetization: {
            tipsEnabled: false,
            paidAccess: false, // Always false - no paid restrictions
            productLink: '',
            price: undefined, // Always undefined - no paid content
            // Enhanced monetization for everyone
            subscriptionContent: false,
            exclusiveAccess: false,
            merchandiseLinks: [],
            eventTickets: false,
            coachingSessions: false,
            affiliateLinks: [],
            donationLinks: [],
        },
        visibilityFlags: {
            mature: false,
            sensitive: false,
            spiritual: false,
        },
        liveStreaming: {
            isLiveStream: false,
            title: '',
            description: '',
            scheduledTime: undefined,
            isPublic: true,
            allowComments: true,
            allowReactions: true,
            faithMode: false,
        },
    });

    const [showCamera, setShowCamera] = useState(false);
    const [showTagInput, setShowTagInput] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const cameraRef = useRef<Camera>(null);

    const handleMediaUpload = async (type: 'camera' | 'gallery') => {
        try {
            let result;
            
            if (type === 'camera') {
                const { status } = await Camera.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Camera permission is required to take photos/videos.');
                    return;
                }
                setShowCamera(true);
                return;
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Gallery permission is required to select media.');
                    return;
                }

                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [9, 16],
                    quality: 0.8,
                });
            }

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                setPostData(prev => ({
                    ...prev,
                    mediaUrl: asset.uri,
                }));
                setMediaType(asset.type === 'video' ? 'video' : 'image');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to upload media. Please try again.');
        }
    };

    const takePhoto = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    aspect: [9, 16],
                });
                setPostData(prev => ({
                    ...prev,
                    mediaUrl: photo.uri,
                }));
                setMediaType('image');
                setShowCamera(false);
            } catch (error) {
                Alert.alert('Error', 'Failed to take photo. Please try again.');
            }
        }
    };

    const addTag = () => {
        if (newTag.trim() && postData.tags.length < 5) {
            const tag = newTag.trim().toLowerCase();
            if (!postData.tags.includes(tag)) {
                setPostData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tag],
                }));
            }
            setNewTag('');
            setShowTagInput(false);
        }
    };

    const removeTag = (tagToRemove: string) => {
        setPostData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove),
        }));
    };

    const handleSubmit = async () => {
        if (!postData.mediaUrl) {
            Alert.alert('Media Required', 'Please add a photo or video to your post.');
            return;
        }

        if (!postData.caption.trim()) {
            Alert.alert('Caption Required', 'Please add a caption to your post.');
            return;
        }

        if (!postData.category) {
            Alert.alert('Category Required', 'Please select a category for your post.');
            return;
        }

        if (postData.caption.length > 2200) {
            Alert.alert('Caption Too Long', 'Caption must be 2200 characters or less.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(postData);
            // Reset form
            setPostData({
                mediaUrl: '',
                caption: '',
                category: '',
                tags: [],
                monetization: {
                    tipsEnabled: false,
                    paidAccess: false, // Always false - no paid restrictions
                    productLink: '',
                    price: undefined, // Always undefined - no paid content
                    // Enhanced monetization for everyone
                    subscriptionContent: false,
                    exclusiveAccess: false,
                    merchandiseLinks: [],
                    eventTickets: false,
                    coachingSessions: false,
                    affiliateLinks: [],
                    donationLinks: [],
                },
                visibilityFlags: {
                    mature: false,
                    sensitive: false,
                    spiritual: false,
                },
                liveStreaming: {
                    isLiveStream: false,
                    title: '',
                    description: '',
                    scheduledTime: undefined,
                    isPublic: true,
                    allowComments: true,
                    allowReactions: true,
                    faithMode: false,
                },
            });
            setMediaType(null);
            onClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderMediaPreview = () => {
        if (!postData.mediaUrl) return null;

        return (
            <View style={styles.mediaPreview}>
                {mediaType === 'video' ? (
                    <Video
                        source={{ uri: postData.mediaUrl }}
                        style={styles.mediaContent}
                        useNativeControls
                        resizeMode="cover"
                    />
                ) : (
                    <Image
                        source={{ uri: postData.mediaUrl }}
                        style={styles.mediaContent}
                        resizeMode="cover"
                    />
                )}
                <TouchableOpacity
                    style={styles.removeMedia}
                    onPress={() => {
                        setPostData(prev => ({ ...prev, mediaUrl: '' }));
                        setMediaType(null);
                    }}
                >
                    <Text style={styles.removeMediaText}>✕</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.card }]}>
                    <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                        <Text style={[styles.headerButtonText, { color: colors.text }]}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {faithMode ? 'Share Your Truth' : 'Create Post'}
                    </Text>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        style={[styles.postButton, { backgroundColor: colors.emerald }]}
                    >
                        <Text style={[styles.postButtonText, { color: colors.cream }]}>
                            {isSubmitting ? 'Posting...' : 'Post Now'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Media Upload */}
                    {!postData.mediaUrl && (
                        <View style={[styles.uploadSection, { backgroundColor: colors.card }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Add Media
                            </Text>
                            <View style={styles.uploadButtons}>
                                <TouchableOpacity
                                    style={[styles.uploadButton, { backgroundColor: colors.emerald }]}
                                    onPress={() => handleMediaUpload('camera')}
                                >
                                    <Text style={[styles.uploadButtonText, { color: colors.cream }]}>
                                        📷 Camera
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.uploadButton, { backgroundColor: colors.olive }]}
                                    onPress={() => handleMediaUpload('gallery')}
                                >
                                    <Text style={[styles.uploadButtonText, { color: colors.cream }]}>
                                        📁 Gallery
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Media Preview */}
                    {renderMediaPreview()}

                    {/* Caption */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Caption
                        </Text>
                        <TextInput
                            style={[styles.captionInput, { 
                                color: colors.text,
                                borderColor: colors.olive,
                                backgroundColor: colors.background
                            }]}
                            placeholder={faithMode ? "Share your truth, testimony, or encouragement..." : "What's on your mind?"}
                            placeholderTextColor={colors.olive}
                            value={postData.caption}
                            onChangeText={(text) => setPostData(prev => ({ ...prev, caption: text }))}
                            multiline
                            maxLength={2200}
                            textAlignVertical="top"
                        />
                        <Text style={[styles.charCount, { color: colors.olive }]}>
                            {postData.caption.length}/2200
                        </Text>
                    </View>

                    {/* Category */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Category *
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.categoryContainer}>
                                {CATEGORIES.map((category) => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.categoryChip,
                                            postData.category === category && { backgroundColor: colors.emerald }
                                        ]}
                                        onPress={() => setPostData(prev => ({ ...prev, category }))}
                                    >
                                        <Text style={[
                                            styles.categoryText,
                                            { color: postData.category === category ? colors.cream : colors.text }
                                        ]}>
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Tags */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Tags (Optional)
                        </Text>
                        <View style={styles.tagsContainer}>
                            {postData.tags.map((tag) => (
                                <TouchableOpacity
                                    key={tag}
                                    style={[styles.tagChip, { backgroundColor: colors.emerald }]}
                                    onPress={() => removeTag(tag)}
                                >
                                    <Text style={[styles.tagText, { color: colors.cream }]}>
                                        #{tag} ✕
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            {postData.tags.length < 5 && (
                                <TouchableOpacity
                                    style={[styles.addTagButton, { borderColor: colors.olive }]}
                                    onPress={() => setShowTagInput(true)}
                                >
                                    <Text style={[styles.addTagText, { color: colors.olive }]}>
                                        + Add Tag
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {showTagInput && (
                            <View style={styles.tagInputContainer}>
                                <TextInput
                                    style={[styles.tagInput, { 
                                        color: colors.text,
                                        borderColor: colors.olive,
                                        backgroundColor: colors.background
                                    }]}
                                    placeholder="Enter tag..."
                                    placeholderTextColor={colors.olive}
                                    value={newTag}
                                    onChangeText={setNewTag}
                                    onSubmitEditing={addTag}
                                    autoFocus
                                />
                                <TouchableOpacity
                                    style={[styles.addTagConfirm, { backgroundColor: colors.emerald }]}
                                    onPress={addTag}
                                >
                                    <Text style={[styles.addTagConfirmText, { color: colors.cream }]}>
                                        Add
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Enhanced Monetization Options - Available to Everyone */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {faithMode ? 'Blessing & Support Options' : 'Monetization Options'}
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.olive }]}>
                            All features available to every creator - no restrictions!
                        </Text>
                        
                        {/* Tips */}
                        <TouchableOpacity
                            style={styles.monetizationOption}
                            onPress={() => setPostData(prev => ({
                                ...prev,
                                monetization: {
                                    ...prev.monetization,
                                    tipsEnabled: !prev.monetization.tipsEnabled
                                }
                            }))}
                        >
                            <Text style={[styles.monetizationText, { color: colors.text }]}>
                                {faithMode ? '💝 Enable Tip Jar' : '💰 Enable Tips'}
                            </Text>
                            <View style={[
                                styles.toggle,
                                { backgroundColor: postData.monetization.tipsEnabled ? colors.emerald : colors.olive }
                            ]}>
                                <View style={[
                                    styles.toggleThumb,
                                    { transform: [{ translateX: postData.monetization.tipsEnabled ? 20 : 0 }] }
                                ]} />
                            </View>
                        </TouchableOpacity>

                        {/* Product Links */}
                        <View style={styles.productLinkContainer}>
                            <TextInput
                                style={[styles.productLinkInput, { 
                                    color: colors.text,
                                    borderColor: colors.olive,
                                    backgroundColor: colors.background
                                }]}
                                placeholder={faithMode ? "Add a resource or product link..." : "Add product link (optional)"}
                                placeholderTextColor={colors.olive}
                                value={postData.monetization.productLink}
                                onChangeText={(text) => setPostData(prev => ({
                                    ...prev,
                                    monetization: { ...prev.monetization, productLink: text }
                                }))}
                            />
                        </View>

                        {/* Subscription Content */}
                        <TouchableOpacity
                            style={styles.monetizationOption}
                            onPress={() => setPostData(prev => ({
                                ...prev,
                                monetization: {
                                    ...prev.monetization,
                                    subscriptionContent: !prev.monetization.subscriptionContent
                                }
                            }))}
                        >
                            <Text style={[styles.monetizationText, { color: colors.text }]}>
                                {faithMode ? '📖 Exclusive Content' : '🔒 Premium Content'}
                            </Text>
                            <View style={[
                                styles.toggle,
                                { backgroundColor: postData.monetization.subscriptionContent ? colors.emerald : colors.olive }
                            ]}>
                                <View style={[
                                    styles.toggleThumb,
                                    { transform: [{ translateX: postData.monetization.subscriptionContent ? 20 : 0 }] }
                                ]} />
                            </View>
                        </TouchableOpacity>

                        {/* Event Tickets */}
                        <TouchableOpacity
                            style={styles.monetizationOption}
                            onPress={() => setPostData(prev => ({
                                ...prev,
                                monetization: {
                                    ...prev.monetization,
                                    eventTickets: !prev.monetization.eventTickets
                                }
                            }))}
                        >
                            <Text style={[styles.monetizationText, { color: colors.text }]}>
                                {faithMode ? '🎫 Event Registration' : '🎫 Event Tickets'}
                            </Text>
                            <View style={[
                                styles.toggle,
                                { backgroundColor: postData.monetization.eventTickets ? colors.emerald : colors.olive }
                            ]}>
                                <View style={[
                                    styles.toggleThumb,
                                    { transform: [{ translateX: postData.monetization.eventTickets ? 20 : 0 }] }
                                ]} />
                            </View>
                        </TouchableOpacity>

                        {/* Coaching Sessions */}
                        <TouchableOpacity
                            style={styles.monetizationOption}
                            onPress={() => setPostData(prev => ({
                                ...prev,
                                monetization: {
                                    ...prev.monetization,
                                    coachingSessions: !prev.monetization.coachingSessions
                                }
                            }))}
                        >
                            <Text style={[styles.monetizationText, { color: colors.text }]}>
                                {faithMode ? '🙏 Mentorship Sessions' : '🎓 Coaching Sessions'}
                            </Text>
                            <View style={[
                                styles.toggle,
                                { backgroundColor: postData.monetization.coachingSessions ? colors.emerald : colors.olive }
                            ]}>
                                <View style={[
                                    styles.toggleThumb,
                                    { transform: [{ translateX: postData.monetization.coachingSessions ? 20 : 0 }] }
                                ]} />
                            </View>
                        </TouchableOpacity>

                        {/* Affiliate Links */}
                        <View style={styles.productLinkContainer}>
                            <TextInput
                                style={[styles.productLinkInput, { 
                                    color: colors.text,
                                    borderColor: colors.olive,
                                    backgroundColor: colors.background
                                }]}
                                placeholder={faithMode ? "Add affiliate or partner links..." : "Add affiliate links (optional)"}
                                placeholderTextColor={colors.olive}
                                value={postData.monetization.affiliateLinks.join(', ')}
                                onChangeText={(text) => setPostData(prev => ({
                                    ...prev,
                                    monetization: { 
                                        ...prev.monetization, 
                                        affiliateLinks: text.split(',').map(link => link.trim()).filter(Boolean)
                                    }
                                }))}
                            />
                        </View>

                        {/* Donation Links */}
                        <View style={styles.productLinkContainer}>
                            <TextInput
                                style={[styles.productLinkInput, { 
                                    color: colors.text,
                                    borderColor: colors.olive,
                                    backgroundColor: colors.background
                                }]}
                                placeholder={faithMode ? "Add donation or support links..." : "Add donation links (optional)"}
                                placeholderTextColor={colors.olive}
                                value={postData.monetization.donationLinks.join(', ')}
                                onChangeText={(text) => setPostData(prev => ({
                                    ...prev,
                                    monetization: { 
                                        ...prev.monetization, 
                                        donationLinks: text.split(',').map(link => link.trim()).filter(Boolean)
                                    }
                                }))}
                            />
                        </View>
                    </View>

                    {/* Live Streaming Options - Available to Everyone */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            📺 Live Streaming Options
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.olive }]}>
                            Go live anytime - no restrictions, no fees!
                        </Text>
                        
                        <TouchableOpacity
                            style={styles.monetizationOption}
                            onPress={() => setPostData(prev => ({
                                ...prev,
                                liveStreaming: {
                                    ...prev.liveStreaming,
                                    isLiveStream: !prev.liveStreaming.isLiveStream
                                }
                            }))}
                        >
                            <Text style={[styles.monetizationText, { color: colors.text }]}>
                                {faithMode ? '📺 Start Live Stream' : '📺 Go Live'}
                            </Text>
                            <View style={[
                                styles.toggle,
                                { backgroundColor: postData.liveStreaming.isLiveStream ? colors.emerald : colors.olive }
                            ]}>
                                <View style={[
                                    styles.toggleThumb,
                                    { transform: [{ translateX: postData.liveStreaming.isLiveStream ? 20 : 0 }] }
                                ]} />
                            </View>
                        </TouchableOpacity>

                        {postData.liveStreaming.isLiveStream && (
                            <>
                                <TextInput
                                    style={[styles.captionInput, { 
                                        color: colors.text,
                                        borderColor: colors.olive,
                                        backgroundColor: colors.background,
                                        minHeight: 60
                                    }]}
                                    placeholder={faithMode ? "Live stream title..." : "Live stream title..."}
                                    placeholderTextColor={colors.olive}
                                    value={postData.liveStreaming.title}
                                    onChangeText={(text) => setPostData(prev => ({
                                        ...prev,
                                        liveStreaming: { ...prev.liveStreaming, title: text }
                                    }))}
                                />

                                <TextInput
                                    style={[styles.captionInput, { 
                                        color: colors.text,
                                        borderColor: colors.olive,
                                        backgroundColor: colors.background,
                                        minHeight: 80
                                    }]}
                                    placeholder={faithMode ? "Describe your live stream..." : "Describe your live stream..."}
                                    placeholderTextColor={colors.olive}
                                    value={postData.liveStreaming.description}
                                    onChangeText={(text) => setPostData(prev => ({
                                        ...prev,
                                        liveStreaming: { ...prev.liveStreaming, description: text }
                                    }))}
                                    multiline
                                    numberOfLines={3}
                                />

                                <TouchableOpacity
                                    style={styles.monetizationOption}
                                    onPress={() => setPostData(prev => ({
                                        ...prev,
                                        liveStreaming: {
                                            ...prev.liveStreaming,
                                            isPublic: !prev.liveStreaming.isPublic
                                        }
                                    }))}
                                >
                                    <Text style={[styles.monetizationText, { color: colors.text }]}>
                                        🌐 Public Stream
                                    </Text>
                                    <View style={[
                                        styles.toggle,
                                        { backgroundColor: postData.liveStreaming.isPublic ? colors.emerald : colors.olive }
                                    ]}>
                                        <View style={[
                                            styles.toggleThumb,
                                            { transform: [{ translateX: postData.liveStreaming.isPublic ? 20 : 0 }] }
                                        ]} />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.monetizationOption}
                                    onPress={() => setPostData(prev => ({
                                        ...prev,
                                        liveStreaming: {
                                            ...prev.liveStreaming,
                                            allowComments: !prev.liveStreaming.allowComments
                                        }
                                    }))}
                                >
                                    <Text style={[styles.monetizationText, { color: colors.text }]}>
                                        💬 Allow Comments
                                    </Text>
                                    <View style={[
                                        styles.toggle,
                                        { backgroundColor: postData.liveStreaming.allowComments ? colors.emerald : colors.olive }
                                    ]}>
                                        <View style={[
                                            styles.toggleThumb,
                                            { transform: [{ translateX: postData.liveStreaming.allowComments ? 20 : 0 }] }
                                        ]} />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.monetizationOption}
                                    onPress={() => setPostData(prev => ({
                                        ...prev,
                                        liveStreaming: {
                                            ...prev.liveStreaming,
                                            faithMode: !prev.liveStreaming.faithMode
                                        }
                                    }))}
                                >
                                    <Text style={[styles.monetizationText, { color: colors.text }]}>
                                        {faithMode ? '✝️ Faith Mode Stream' : '✨ Faith Mode Stream'}
                                    </Text>
                                    <View style={[
                                        styles.toggle,
                                        { backgroundColor: postData.liveStreaming.faithMode ? colors.emerald : colors.olive }
                                    ]}>
                                        <View style={[
                                            styles.toggleThumb,
                                            { transform: [{ translateX: postData.liveStreaming.faithMode ? 20 : 0 }] }
                                        ]} />
                                    </View>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {/* Visibility Flags */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Content Flags
                        </Text>
                        
                        {[
                            { key: 'mature', label: '18+ Content', icon: '🔞' },
                            { key: 'sensitive', label: 'Sensitive Topic', icon: '⚠️' },
                            { key: 'spiritual', label: faithMode ? 'Spiritual Declaration' : 'Inspirational', icon: '✨' }
                        ].map((flag) => (
                            <TouchableOpacity
                                key={flag.key}
                                style={styles.flagOption}
                                onPress={() => setPostData(prev => ({
                                    ...prev,
                                    visibilityFlags: {
                                        ...prev.visibilityFlags,
                                        [flag.key]: !prev.visibilityFlags[flag.key as keyof typeof prev.visibilityFlags]
                                    }
                                }))}
                            >
                                <Text style={[styles.flagText, { color: colors.text }]}>
                                    {flag.icon} {flag.label}
                                </Text>
                                <View style={[
                                    styles.toggle,
                                    { backgroundColor: postData.visibilityFlags[flag.key as keyof typeof postData.visibilityFlags] ? colors.emerald : colors.olive }
                                ]}>
                                    <View style={[
                                        styles.toggleThumb,
                                        { transform: [{ translateX: postData.visibilityFlags[flag.key as keyof typeof postData.visibilityFlags] ? 20 : 0 }] }
                                    ]} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Camera Modal */}
                <Modal visible={showCamera} animationType="slide">
                    <View style={styles.cameraContainer}>
                        <Camera
                            ref={cameraRef}
                            style={styles.camera}
                            type={CameraType.back}
                        >
                            <View style={styles.cameraControls}>
                                <TouchableOpacity
                                    style={styles.cameraButton}
                                    onPress={() => setShowCamera(false)}
                                >
                                    <Text style={styles.cameraButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.cameraButton, styles.captureButton]}
                                    onPress={takePhoto}
                                >
                                    <Text style={styles.captureButtonText}>📷</Text>
                                </TouchableOpacity>
                            </View>
                        </Camera>
                    </View>
                </Modal>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    headerButton: {
        padding: 8,
    },
    headerButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    postButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    uploadSection: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    uploadButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    uploadButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    uploadButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    mediaPreview: {
        position: 'relative',
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    mediaContent: {
        width: '100%',
        height: 400,
        borderRadius: 12,
    },
    removeMedia: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 20,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeMediaText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    section: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    captionInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: 4,
    },
    categoryContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    tagChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    tagText: {
        fontSize: 14,
        fontWeight: '500',
    },
    addTagButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    addTagText: {
        fontSize: 14,
        fontWeight: '500',
    },
    tagInputContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    tagInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        fontSize: 14,
    },
    addTagConfirm: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addTagConfirmText: {
        fontSize: 14,
        fontWeight: '600',
    },
    monetizationOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    monetizationText: {
        fontSize: 16,
        fontWeight: '500',
    },
    toggle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        padding: 2,
    },
    toggleThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    productLinkContainer: {
        marginTop: 12,
    },
    productLinkInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
    },
    flagOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    flagText: {
        fontSize: 16,
        fontWeight: '500',
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    cameraControls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    cameraButton: {
        padding: 16,
    },
    cameraButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    captureButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 40,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureButtonText: {
        fontSize: 32,
    },
    sectionSubtitle: {
        fontSize: 14,
        marginBottom: 12,
        fontStyle: 'italic',
    },
});
