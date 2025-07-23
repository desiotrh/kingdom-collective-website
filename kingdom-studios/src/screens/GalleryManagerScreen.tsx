import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Switch,
    Image,
    Modal,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface Gallery {
    id: string;
    title: string;
    clientName: string;
    shootDate: string;
    images: string[];
    isWatermarked: boolean;
    isPasswordProtected: boolean;
    password?: string;
    allowDownload: boolean;
    shareableLink: string;
    feedback: string;
    createdAt: Date;
}

const GalleryManagerScreen: React.FC = () => {
    const { isFaithMode } = useDualMode();
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [currentGallery, setCurrentGallery] = useState<Partial<Gallery>>({
        title: '',
        clientName: '',
        shootDate: '',
        images: [],
        isWatermarked: false,
        isPasswordProtected: false,
        password: '',
        allowDownload: true,
        feedback: '',
    });
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets) {
            const newImages = result.assets.map(asset => asset.uri);
            setCurrentGallery({
                ...currentGallery,
                images: [...(currentGallery.images || []), ...newImages],
            });
        }
    };

    const generateShareableLink = (galleryId: string) => {
        return `https://lens.kingdomstudios.app/gallery/${galleryId}`;
    };

    const handleCreateGallery = () => {
        if (!currentGallery.title || !currentGallery.clientName || currentGallery.images?.length === 0) {
            Alert.alert('Missing Information', 'Please fill in all required fields and upload at least one image.');
            return;
        }

        const newGallery: Gallery = {
            id: Date.now().toString(),
            title: currentGallery.title || '',
            clientName: currentGallery.clientName || '',
            shootDate: currentGallery.shootDate || '',
            images: currentGallery.images || [],
            isWatermarked: currentGallery.isWatermarked || false,
            isPasswordProtected: currentGallery.isPasswordProtected || false,
            password: currentGallery.password,
            allowDownload: currentGallery.allowDownload || true,
            shareableLink: generateShareableLink(Date.now().toString()),
            feedback: currentGallery.feedback || '',
            createdAt: new Date(),
        };

        setGalleries([newGallery, ...galleries]);
        setCurrentGallery({
            title: '',
            clientName: '',
            shootDate: '',
            images: [],
            isWatermarked: false,
            isPasswordProtected: false,
            password: '',
            allowDownload: true,
            feedback: '',
        });

        Alert.alert(
            'Gallery Created',
            isFaithMode
                ? 'Your gallery has been blessed and is ready to share. May it bring joy and inspiration to your client.'
                : 'Gallery created successfully! Ready to share with your client.'
        );
    };

    const handleGallerySelect = (gallery: Gallery) => {
        setSelectedGallery(gallery);
        setShowGalleryModal(true);
    };

    const handleFeedbackSubmit = (galleryId: string, feedback: string) => {
        setGalleries(galleries.map(gallery =>
            gallery.id === galleryId
                ? { ...gallery, feedback }
                : gallery
        ));
        Alert.alert('Feedback Saved', 'Thank you for your feedback!');
    };

    const UploadModal = () => (
        <Modal
            visible={showUploadModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {isFaithMode ? 'Upload Gallery Images' : 'Create New Gallery'}
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Gallery Title</Text>
                        <TextInput
                            style={styles.input}
                            value={currentGallery.title}
                            onChangeText={(text) => setCurrentGallery({ ...currentGallery, title: text })}
                            placeholder="Enter gallery title"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Client Name</Text>
                        <TextInput
                            style={styles.input}
                            value={currentGallery.clientName}
                            onChangeText={(text) => setCurrentGallery({ ...currentGallery, clientName: text })}
                            placeholder="Enter client name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Shoot Date</Text>
                        <TextInput
                            style={styles.input}
                            value={currentGallery.shootDate}
                            onChangeText={(text) => setCurrentGallery({ ...currentGallery, shootDate: text })}
                            placeholder="Enter shoot date"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={pickImages}
                    >
                        <Ionicons name="cloud-upload" size={24} color={KingdomColors.softWhite} />
                        <Text style={styles.uploadButtonText}>
                            {currentGallery.images?.length
                                ? `Upload More Images (${currentGallery.images.length} selected)`
                                : 'Select Images'
                            }
                        </Text>
                    </TouchableOpacity>

                    {currentGallery.images && currentGallery.images.length > 0 && (
                        <ScrollView horizontal style={styles.imagePreviewContainer}>
                            {currentGallery.images.map((image, index) => (
                                <Image key={index} source={{ uri: image }} style={styles.imagePreview} />
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.optionsContainer}>
                        <View style={styles.optionRow}>
                            <Text style={styles.optionLabel}>Add Watermark</Text>
                            <Switch
                                value={currentGallery.isWatermarked}
                                onValueChange={(value) => setCurrentGallery({ ...currentGallery, isWatermarked: value })}
                                trackColor={{ false: KingdomColors.dustGold, true: KingdomColors.bronze }}
                                thumbColor={KingdomColors.softWhite}
                            />
                        </View>

                        <View style={styles.optionRow}>
                            <Text style={styles.optionLabel}>Password Protect</Text>
                            <Switch
                                value={currentGallery.isPasswordProtected}
                                onValueChange={(value) => setCurrentGallery({ ...currentGallery, isPasswordProtected: value })}
                                trackColor={{ false: KingdomColors.dustGold, true: KingdomColors.bronze }}
                                thumbColor={KingdomColors.softWhite}
                            />
                        </View>

                        {currentGallery.isPasswordProtected && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentGallery.password}
                                    onChangeText={(text) => setCurrentGallery({ ...currentGallery, password: text })}
                                    placeholder="Enter password"
                                    secureTextEntry
                                />
                            </View>
                        )}

                        <View style={styles.optionRow}>
                            <Text style={styles.optionLabel}>Allow Downloads</Text>
                            <Switch
                                value={currentGallery.allowDownload}
                                onValueChange={(value) => setCurrentGallery({ ...currentGallery, allowDownload: value })}
                                trackColor={{ false: KingdomColors.dustGold, true: KingdomColors.bronze }}
                                thumbColor={KingdomColors.softWhite}
                            />
                        </View>
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowUploadModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.primaryButton]}
                            onPress={() => {
                                handleCreateGallery();
                                setShowUploadModal(false);
                            }}
                        >
                            <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                                {isFaithMode ? 'Create & Bless' : 'Create Gallery'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const GalleryViewModal = () => (
        <Modal
            visible={showGalleryModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {selectedGallery && (
                        <>
                            <Text style={styles.modalTitle}>{selectedGallery.title}</Text>
                            <Text style={styles.galleryInfo}>Client: {selectedGallery.clientName}</Text>
                            <Text style={styles.galleryInfo}>Date: {selectedGallery.shootDate}</Text>
                            <Text style={styles.galleryInfo}>Images: {selectedGallery.images.length}</Text>

                            <ScrollView horizontal style={styles.imagePreviewContainer}>
                                {selectedGallery.images.map((image, index) => (
                                    <Image key={index} source={{ uri: image }} style={styles.imagePreview} />
                                ))}
                            </ScrollView>

                            <View style={styles.galleryOptions}>
                                <Text style={styles.optionLabel}>Gallery Settings:</Text>
                                <Text style={styles.optionText}>
                                    Watermark: {selectedGallery.isWatermarked ? 'Yes' : 'No'}
                                </Text>
                                <Text style={styles.optionText}>
                                    Password Protected: {selectedGallery.isPasswordProtected ? 'Yes' : 'No'}
                                </Text>
                                <Text style={styles.optionText}>
                                    Downloads: {selectedGallery.allowDownload ? 'Enabled' : 'Disabled'}
                                </Text>
                            </View>

                            <View style={styles.feedbackSection}>
                                <Text style={styles.feedbackTitle}>
                                    {isFaithMode
                                        ? 'What image moved you most? Share your experience:'
                                        : 'Client Feedback:'
                                    }
                                </Text>
                                <TextInput
                                    style={styles.feedbackInput}
                                    value={selectedGallery.feedback}
                                    onChangeText={(text) => {
                                        if (selectedGallery) {
                                            handleFeedbackSubmit(selectedGallery.id, text);
                                        }
                                    }}
                                    placeholder={isFaithMode
                                        ? "Share how these images touched your heart..."
                                        : "Enter client feedback..."
                                    }
                                    multiline
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.shareButton}
                                onPress={() => {
                                    Alert.alert('Share Link', `Gallery link: ${selectedGallery.shareableLink}`);
                                }}
                            >
                                <Ionicons name="share" size={20} color={KingdomColors.softWhite} />
                                <Text style={styles.shareButtonText}>Share Gallery</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowGalleryModal(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isFaithMode ? 'Gallery Manager - Faith Mode' : 'Gallery Manager'}
                </Text>
                <Text style={styles.subtitle}>
                    {isFaithMode
                        ? 'Share your captured moments with love and intention'
                        : 'Upload and manage client galleries with professional options'
                    }
                </Text>
            </View>

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => setShowUploadModal(true)}
            >
                <Ionicons name="add-circle" size={24} color={KingdomColors.softWhite} />
                <Text style={styles.createButtonText}>
                    {isFaithMode ? 'Create New Gallery' : 'Upload Gallery'}
                </Text>
            </TouchableOpacity>

            {galleries.length > 0 && (
                <View style={styles.galleriesSection}>
                    <Text style={styles.sectionTitle}>Your Galleries</Text>
                    {galleries.map((gallery) => (
                        <TouchableOpacity
                            key={gallery.id}
                            style={styles.galleryCard}
                            onPress={() => handleGallerySelect(gallery)}
                        >
                            <View style={styles.galleryHeader}>
                                <Text style={styles.galleryTitle}>{gallery.title}</Text>
                                <View style={styles.galleryIcons}>
                                    {gallery.isWatermarked && (
                                        <Ionicons name="water" size={16} color={KingdomColors.bronze} />
                                    )}
                                    {gallery.isPasswordProtected && (
                                        <Ionicons name="lock-closed" size={16} color={KingdomColors.bronze} />
                                    )}
                                    {gallery.allowDownload && (
                                        <Ionicons name="download" size={16} color={KingdomColors.bronze} />
                                    )}
                                </View>
                            </View>

                            <Text style={styles.galleryClient}>Client: {gallery.clientName}</Text>
                            <Text style={styles.galleryDate}>Date: {gallery.shootDate}</Text>
                            <Text style={styles.galleryImages}>{gallery.images.length} images</Text>

                            {gallery.feedback && (
                                <View style={styles.feedbackPreview}>
                                    <Text style={styles.feedbackLabel}>Client Feedback:</Text>
                                    <Text style={styles.feedbackText} numberOfLines={2}>
                                        {gallery.feedback}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <UploadModal />
            <GalleryViewModal />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.matteBlack,
    },
    header: {
        padding: 20,
        backgroundColor: KingdomColors.bronze,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'EB Garamond',
    },
    subtitle: {
        fontSize: 16,
        color: KingdomColors.softWhite,
        marginTop: 5,
        fontFamily: 'Sora',
    },
    createButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        margin: 20,
        borderRadius: 10,
    },
    createButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    galleriesSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 15,
        fontFamily: 'EB Garamond',
    },
    galleryCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    galleryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    galleryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        fontFamily: 'EB Garamond',
    },
    galleryIcons: {
        flexDirection: 'row',
        gap: 5,
    },
    galleryClient: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    galleryDate: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    galleryImages: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    feedbackPreview: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: KingdomColors.bronze,
    },
    feedbackLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    feedbackText: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        fontStyle: 'italic',
        fontFamily: 'Sora',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: KingdomColors.matteBlack,
        padding: 20,
        borderRadius: 15,
        width: '90%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'EB Garamond',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    input: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    uploadButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    uploadButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    imagePreviewContainer: {
        maxHeight: 100,
        marginBottom: 15,
    },
    imagePreview: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    optionsContainer: {
        marginBottom: 15,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionLabel: {
        fontSize: 16,
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        flex: 0.48,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.bronze,
        fontFamily: 'Sora',
    },
    primaryButton: {
        backgroundColor: KingdomColors.bronze,
    },
    primaryButtonText: {
        color: KingdomColors.softWhite,
    },
    galleryInfo: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    galleryOptions: {
        marginVertical: 15,
    },
    optionText: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    feedbackSection: {
        marginVertical: 15,
    },
    feedbackTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 10,
        fontFamily: 'Sora',
    },
    feedbackInput: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        fontSize: 14,
        color: KingdomColors.matteBlack,
        minHeight: 80,
        textAlignVertical: 'top',
        fontFamily: 'Sora',
    },
    shareButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    shareButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    closeButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: KingdomColors.bronze,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Sora',
    },
});

export default GalleryManagerScreen; 