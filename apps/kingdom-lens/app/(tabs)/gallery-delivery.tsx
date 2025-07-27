import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    SafeAreaView,
    Alert,
    Image,
    FlatList,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GalleryData {
    id: string;
    name: string;
    description: string;
    password?: string;
    createdAt: string;
    imageCount: number;
    isProtected: boolean;
}

interface GalleryImage {
    id: string;
    uri: string;
    caption?: string;
    timestamp: string;
}

export default function GalleryDeliveryScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [galleries, setGalleries] = useState<GalleryData[]>([]);
    const [selectedGallery, setSelectedGallery] = useState<GalleryData | null>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [password, setPassword] = useState('');
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadGalleries();
    }, []);

    const loadGalleries = async () => {
        try {
            const storedGalleries = await AsyncStorage.getItem('@kingdom_lens_galleries');
            if (storedGalleries) {
                setGalleries(JSON.parse(storedGalleries));
            }
        } catch (error) {
            console.error('Error loading galleries:', error);
        }
    };

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Sacred Galleries';
        } else if (encouragementMode) {
            return 'Your Galleries';
        }
        return 'Gallery Delivery';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Share His light with those you trust';
        } else if (encouragementMode) {
            return 'Share your story with intention';
        }
        return 'View and share your galleries';
    };

    const getPasswordPrompt = () => {
        if (faithMode) {
            return 'For eyes the Lord has trusted';
        } else if (encouragementMode) {
            return 'This gallery is protected to honor their story';
        }
        return 'Enter password to unlock gallery';
    };

    const getUnlockButtonText = () => {
        if (faithMode) {
            return 'Unlock with Blessing';
        } else if (encouragementMode) {
            return 'Unlock Gallery';
        }
        return 'Unlock Gallery';
    };

    const handleGallerySelect = (gallery: GalleryData) => {
        setSelectedGallery(gallery);
        setPassword('');
        setIsUnlocked(false);

        if (!gallery.isProtected) {
            setIsUnlocked(true);
            loadGalleryImages(gallery.id);
        }
    };

    const handlePasswordSubmit = () => {
        if (!selectedGallery) return;

        if (password === selectedGallery.password) {
            setIsUnlocked(true);
            setPassword('');
            loadGalleryImages(selectedGallery.id);

            const successMessage = faithMode
                ? 'Gallery unlocked with His blessing'
                : encouragementMode
                    ? 'Gallery unlocked with intention'
                    : 'Gallery unlocked successfully';

            Alert.alert('Success', successMessage);
        } else {
            const errorMessage = faithMode
                ? 'Password incorrect. Trust in His timing.'
                : encouragementMode
                    ? 'Password incorrect. Try again with confidence.'
                    : 'Incorrect password';

            Alert.alert('Error', errorMessage);
            setPassword('');
        }
    };

    const loadGalleryImages = async (galleryId: string) => {
        setIsLoading(true);
        try {
            // Simulate loading images
            const mockImages: GalleryImage[] = [
                {
                    id: '1',
                    uri: 'https://via.placeholder.com/300x300',
                    caption: 'Beautiful moment captured',
                    timestamp: new Date().toISOString(),
                },
                {
                    id: '2',
                    uri: 'https://via.placeholder.com/300x300',
                    caption: 'Another precious memory',
                    timestamp: new Date().toISOString(),
                },
                {
                    id: '3',
                    uri: 'https://via.placeholder.com/300x300',
                    caption: 'Timeless beauty',
                    timestamp: new Date().toISOString(),
                },
            ];
            setGalleryImages(mockImages);
        } catch (error) {
            console.error('Error loading gallery images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToGalleries = () => {
        setSelectedGallery(null);
        setIsUnlocked(false);
        setPassword('');
        setGalleryImages([]);
    };

    const renderGalleryItem = ({ item }: { item: GalleryData }) => (
        <TouchableOpacity
            style={[styles.galleryCard, { backgroundColor: theme.colors.surface }]}
            onPress={() => handleGallerySelect(item)}
        >
            <View style={styles.galleryHeader}>
                <Text style={[styles.galleryName, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                {item.isProtected && (
                    <View style={[styles.protectedBadge, { backgroundColor: theme.colors.primary }]}>
                        <Text style={[styles.protectedText, { color: theme.colors.surface }]}>
                            🔒
                        </Text>
                    </View>
                )}
            </View>
            <Text style={[styles.galleryDescription, { color: theme.colors.textSecondary }]}>
                {item.description || 'No description'}
            </Text>
            <Text style={[styles.galleryInfo, { color: theme.colors.textSecondary }]}>
                {item.imageCount} images • Created {new Date(item.createdAt).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    );

    const renderImageItem = ({ item }: { item: GalleryImage }) => (
        <View style={[styles.imageCard, { backgroundColor: theme.colors.surface }]}>
            <Image source={{ uri: item.uri }} style={styles.galleryImage} />
            {item.caption && (
                <Text style={[styles.imageCaption, { color: theme.colors.textSecondary }]}>
                    {item.caption}
                </Text>
            )}
        </View>
    );

    if (selectedGallery && !isUnlocked) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.passwordContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBackToGalleries}
                    >
                        <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>
                            ← Back to Galleries
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.passwordContent}>
                        <Text style={[styles.watermark, { color: theme.colors.primary }]}>
                            {faithTheme.watermark}
                        </Text>
                        <Text style={[styles.galleryTitle, { color: theme.colors.text }]}>
                            {selectedGallery.name}
                        </Text>
                        <Text style={[styles.passwordPrompt, { color: theme.colors.textSecondary }]}>
                            {getPasswordPrompt()}
                        </Text>

                        <TextInput
                            style={[styles.passwordInput, {
                                backgroundColor: theme.colors.surface,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter password"
                            placeholderTextColor={theme.colors.textSecondary}
                            secureTextEntry
                            autoFocus
                        />

                        <TouchableOpacity
                            style={[styles.unlockButton, { backgroundColor: theme.colors.primary }]}
                            onPress={handlePasswordSubmit}
                        >
                            <Text style={[styles.unlockButtonText, { color: theme.colors.surface }]}>
                                {getUnlockButtonText()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    if (selectedGallery && isUnlocked) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.galleryHeader}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBackToGalleries}
                    >
                        <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>
                            ← Back to Galleries
                        </Text>
                    </TouchableOpacity>
                    <Text style={[styles.galleryTitle, { color: theme.colors.text }]}>
                        {selectedGallery.name}
                    </Text>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                            Loading gallery...
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={galleryImages}
                        renderItem={renderImageItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        contentContainerStyle={styles.galleryGrid}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.watermark, { color: theme.colors.primary }]}>
                        {faithTheme.watermark}
                    </Text>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {getScreenTitle()}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        {getScreenSubtitle()}
                    </Text>
                </View>

                {/* Galleries List */}
                <View style={styles.galleriesContainer}>
                    {galleries.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                                {faithMode
                                    ? 'No galleries yet. Create your first sacred space.'
                                    : encouragementMode
                                        ? 'No galleries yet. Create your first gallery with intention.'
                                        : 'No galleries yet. Create your first gallery.'}
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={galleries}
                            renderItem={renderGalleryItem}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    watermark: {
        fontSize: 24,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.8,
    },
    galleriesContainer: {
        flex: 1,
    },
    galleryCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    galleryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    galleryName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    protectedBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    protectedText: {
        fontSize: 12,
    },
    galleryDescription: {
        fontSize: 14,
        marginBottom: 8,
    },
    galleryInfo: {
        fontSize: 12,
        opacity: 0.7,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyStateText: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
    passwordContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    backButton: {
        paddingVertical: 16,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    passwordContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    galleryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    passwordPrompt: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        fontStyle: 'italic',
    },
    passwordInput: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        width: '100%',
        marginBottom: 24,
    },
    unlockButton: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    unlockButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    galleryHeader: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
    },
    galleryGrid: {
        padding: 8,
    },
    imageCard: {
        flex: 1,
        margin: 4,
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    galleryImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    imageCaption: {
        fontSize: 12,
        padding: 8,
        textAlign: 'center',
    },
}); 