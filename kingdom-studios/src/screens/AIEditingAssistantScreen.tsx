import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    Image,
    FlatList,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ImageAnalysis {
    id: string;
    imageUrl: string;
    lightQuality: 'excellent' | 'good' | 'fair' | 'poor';
    clarity: 'sharp' | 'clear' | 'slightly-blurry' | 'blurry';
    style: 'portrait' | 'landscape' | 'documentary' | 'artistic';
    spiritualHighlight?: boolean;
    suggestedEdits: string[];
    appliedEdits: string[];
}

interface EditSuggestion {
    id: string;
    type: 'crop' | 'balance' | 'preset' | 'enhancement';
    description: string;
    impact: 'high' | 'medium' | 'low';
    applied: boolean;
}

const AIEditingAssistantScreen: React.FC = () => {
    const { isFaithMode } = useDualMode();
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [imageAnalyses, setImageAnalyses] = useState<ImageAnalysis[]>([]);
    const [selectedImage, setSelectedImage] = useState<ImageAnalysis | null>(null);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [batchEdits, setBatchEdits] = useState<string[]>([]);

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets) {
            const newImages = result.assets.map(asset => asset.uri);
            setUploadedImages([...uploadedImages, ...newImages]);
        }
    };

    const analyzeImages = () => {
        if (uploadedImages.length === 0) {
            Alert.alert('No Images', 'Please upload images to analyze.');
            return;
        }

        setIsAnalyzing(true);

        // Simulate AI analysis
        setTimeout(() => {
            const analyses: ImageAnalysis[] = uploadedImages.map((imageUrl, index) => ({
                id: Date.now().toString() + index,
                imageUrl,
                lightQuality: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
                clarity: ['sharp', 'clear', 'slightly-blurry', 'blurry'][Math.floor(Math.random() * 4)] as any,
                style: ['portrait', 'landscape', 'documentary', 'artistic'][Math.floor(Math.random() * 4)] as any,
                spiritualHighlight: isFaithMode && Math.random() > 0.7,
                suggestedEdits: [
                    'Adjust brightness +15%',
                    'Increase contrast +10%',
                    'Apply warm tone preset',
                    'Crop to rule of thirds',
                ],
                appliedEdits: [],
            }));

            setImageAnalyses(analyses);
            setIsAnalyzing(false);

            Alert.alert(
                'Analysis Complete',
                isFaithMode
                    ? 'AI has analyzed your images and identified spiritually-rich moments. May these edits enhance the beauty God has created.'
                    : 'AI analysis complete! Review suggestions and apply edits to enhance your images.'
            );
        }, 3000);
    };

    const applyEdit = (imageId: string, edit: string) => {
        setImageAnalyses(prev => prev.map(analysis =>
            analysis.id === imageId
                ? { ...analysis, appliedEdits: [...analysis.appliedEdits, edit] }
                : analysis
        ));
    };

    const applyBatchEdits = () => {
        if (batchEdits.length === 0) {
            Alert.alert('No Edits Selected', 'Please select edits to apply to all images.');
            return;
        }

        setImageAnalyses(prev => prev.map(analysis => ({
            ...analysis,
            appliedEdits: [...analysis.appliedEdits, ...batchEdits],
        })));

        setBatchEdits([]);
        setShowBatchModal(false);

        Alert.alert(
            'Batch Edits Applied',
            isFaithMode
                ? 'Your edits have been blessed and applied to all images. May they reflect the beauty of God\'s creation.'
                : 'Batch edits applied successfully to all images!'
        );
    };

    const exportGallery = () => {
        const editedCount = imageAnalyses.filter(analysis => analysis.appliedEdits.length > 0).length;
        Alert.alert(
            'Export Gallery',
            isFaithMode
                ? `Exported ${editedCount} blessed images. May they bring joy and inspiration to others.`
                : `Exported ${editedCount} edited images from your gallery.`
        );
    };

    const AnalysisModal = () => (
        <Modal
            visible={showAnalysisModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {selectedImage && (
                        <>
                            <Text style={styles.modalTitle}>Image Analysis</Text>

                            <Image source={{ uri: selectedImage.imageUrl }} style={styles.analysisImage} />

                            <View style={styles.analysisDetails}>
                                <View style={styles.analysisRow}>
                                    <Text style={styles.analysisLabel}>Light Quality:</Text>
                                    <View style={[
                                        styles.qualityIndicator,
                                        selectedImage.lightQuality === 'excellent' && styles.excellentQuality,
                                        selectedImage.lightQuality === 'good' && styles.goodQuality,
                                        selectedImage.lightQuality === 'fair' && styles.fairQuality,
                                        selectedImage.lightQuality === 'poor' && styles.poorQuality,
                                    ]}>
                                        <Text style={styles.qualityText}>{selectedImage.lightQuality}</Text>
                                    </View>
                                </View>

                                <View style={styles.analysisRow}>
                                    <Text style={styles.analysisLabel}>Clarity:</Text>
                                    <Text style={styles.analysisValue}>{selectedImage.clarity}</Text>
                                </View>

                                <View style={styles.analysisRow}>
                                    <Text style={styles.analysisLabel}>Style:</Text>
                                    <Text style={styles.analysisValue}>{selectedImage.style}</Text>
                                </View>

                                {selectedImage.spiritualHighlight && (
                                    <View style={styles.spiritualHighlight}>
                                        <Ionicons name="heart" size={20} color={KingdomColors.dustGold} />
                                        <Text style={styles.spiritualText}>Spiritually Rich Moment</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.suggestionsSection}>
                                <Text style={styles.suggestionsTitle}>Suggested Edits:</Text>
                                {selectedImage.suggestedEdits.map((edit, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.suggestionItem}
                                        onPress={() => {
                                            applyEdit(selectedImage.id, edit);
                                            Alert.alert('Edit Applied', `Applied: ${edit}`);
                                        }}
                                    >
                                        <Text style={styles.suggestionText}>{edit}</Text>
                                        <Ionicons name="checkmark-circle" size={20} color={KingdomColors.bronze} />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {selectedImage.appliedEdits.length > 0 && (
                                <View style={styles.appliedEdits}>
                                    <Text style={styles.appliedTitle}>Applied Edits:</Text>
                                    {selectedImage.appliedEdits.map((edit, index) => (
                                        <Text key={index} style={styles.appliedEdit}>• {edit}</Text>
                                    ))}
                                </View>
                            )}

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowAnalysisModal(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );

    const BatchEditModal = () => (
        <Modal
            visible={showBatchModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Batch Edit Options</Text>

                    <View style={styles.batchOptions}>
                        <TouchableOpacity
                            style={[
                                styles.batchOption,
                                batchEdits.includes('Brightness +10%') && styles.selectedBatchOption
                            ]}
                            onPress={() => {
                                if (batchEdits.includes('Brightness +10%')) {
                                    setBatchEdits(batchEdits.filter(edit => edit !== 'Brightness +10%'));
                                } else {
                                    setBatchEdits([...batchEdits, 'Brightness +10%']);
                                }
                            }}
                        >
                            <Text style={styles.batchOptionText}>Brightness +10%</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.batchOption,
                                batchEdits.includes('Contrast +15%') && styles.selectedBatchOption
                            ]}
                            onPress={() => {
                                if (batchEdits.includes('Contrast +15%')) {
                                    setBatchEdits(batchEdits.filter(edit => edit !== 'Contrast +15%'));
                                } else {
                                    setBatchEdits([...batchEdits, 'Contrast +15%']);
                                }
                            }}
                        >
                            <Text style={styles.batchOptionText}>Contrast +15%</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.batchOption,
                                batchEdits.includes('Warm Tone Preset') && styles.selectedBatchOption
                            ]}
                            onPress={() => {
                                if (batchEdits.includes('Warm Tone Preset')) {
                                    setBatchEdits(batchEdits.filter(edit => edit !== 'Warm Tone Preset'));
                                } else {
                                    setBatchEdits([...batchEdits, 'Warm Tone Preset']);
                                }
                            }}
                        >
                            <Text style={styles.batchOptionText}>Warm Tone Preset</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.batchOption,
                                batchEdits.includes('Sharpen +20%') && styles.selectedBatchOption
                            ]}
                            onPress={() => {
                                if (batchEdits.includes('Sharpen +20%')) {
                                    setBatchEdits(batchEdits.filter(edit => edit !== 'Sharpen +20%'));
                                } else {
                                    setBatchEdits([...batchEdits, 'Sharpen +20%']);
                                }
                            }}
                        >
                            <Text style={styles.batchOptionText}>Sharpen +20%</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowBatchModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.primaryButton]}
                            onPress={applyBatchEdits}
                        >
                            <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                                {isFaithMode ? 'Apply & Bless' : 'Apply to All'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderImageAnalysis = ({ item }: { item: ImageAnalysis }) => (
        <TouchableOpacity
            style={styles.analysisCard}
            onPress={() => {
                setSelectedImage(item);
                setShowAnalysisModal(true);
            }}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />

            <View style={styles.analysisInfo}>
                <View style={styles.analysisRow}>
                    <Text style={styles.analysisLabel}>Light:</Text>
                    <View style={[
                        styles.qualityIndicator,
                        item.lightQuality === 'excellent' && styles.excellentQuality,
                        item.lightQuality === 'good' && styles.goodQuality,
                        item.lightQuality === 'fair' && styles.fairQuality,
                        item.lightQuality === 'poor' && styles.poorQuality,
                    ]}>
                        <Text style={styles.qualityText}>{item.lightQuality}</Text>
                    </View>
                </View>

                <View style={styles.analysisRow}>
                    <Text style={styles.analysisLabel}>Clarity:</Text>
                    <Text style={styles.analysisValue}>{item.clarity}</Text>
                </View>

                {item.spiritualHighlight && (
                    <View style={styles.spiritualBadge}>
                        <Ionicons name="heart" size={12} color={KingdomColors.dustGold} />
                        <Text style={styles.spiritualBadgeText}>Spiritual</Text>
                    </View>
                )}

                {item.appliedEdits.length > 0 && (
                    <Text style={styles.appliedCount}>
                        {item.appliedEdits.length} edits applied
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isFaithMode ? 'AI Editing Assistant - Faith Mode' : 'AI Editing Assistant'}
                </Text>
                <Text style={styles.subtitle}>
                    {isFaithMode
                        ? 'Let AI help enhance the beauty God has created in your images'
                        : 'AI-powered editing suggestions to enhance your photography'
                    }
                </Text>
            </View>

            <View style={styles.uploadSection}>
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={pickImages}
                >
                    <Ionicons name="cloud-upload" size={24} color={KingdomColors.softWhite} />
                    <Text style={styles.uploadButtonText}>
                        {uploadedImages.length > 0
                            ? `Upload More Images (${uploadedImages.length} total)`
                            : 'Upload Gallery Images'
                        }
                    </Text>
                </TouchableOpacity>

                {uploadedImages.length > 0 && (
                    <TouchableOpacity
                        style={styles.analyzeButton}
                        onPress={analyzeImages}
                        disabled={isAnalyzing}
                    >
                        <Ionicons
                            name={isAnalyzing ? "hourglass" : "analytics"}
                            size={20}
                            color={KingdomColors.softWhite}
                        />
                        <Text style={styles.analyzeButtonText}>
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Images'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {imageAnalyses.length > 0 && (
                <View style={styles.analysesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>AI Analysis Results</Text>
                        <TouchableOpacity
                            style={styles.batchButton}
                            onPress={() => setShowBatchModal(true)}
                        >
                            <Ionicons name="layers" size={16} color={KingdomColors.softWhite} />
                            <Text style={styles.batchButtonText}>Batch Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={imageAnalyses}
                        renderItem={renderImageAnalysis}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.analysesList}
                    />

                    <TouchableOpacity
                        style={styles.exportButton}
                        onPress={exportGallery}
                    >
                        <Ionicons name="download" size={20} color={KingdomColors.softWhite} />
                        <Text style={styles.exportButtonText}>
                            {isFaithMode ? 'Export Blessed Gallery' : 'Export Gallery'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <AnalysisModal />
            <BatchEditModal />
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
    uploadSection: {
        padding: 20,
    },
    uploadButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    uploadButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    analyzeButton: {
        backgroundColor: KingdomColors.dustGold,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
    },
    analyzeButtonText: {
        color: KingdomColors.matteBlack,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    analysesSection: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'EB Garamond',
    },
    batchButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 6,
    },
    batchButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
        fontFamily: 'Sora',
    },
    analysesList: {
        marginBottom: 15,
    },
    analysisCard: {
        backgroundColor: KingdomColors.dustGold,
        borderRadius: 10,
        marginRight: 10,
        width: 150,
        overflow: 'hidden',
    },
    thumbnail: {
        width: 150,
        height: 100,
        resizeMode: 'cover',
    },
    analysisInfo: {
        padding: 10,
    },
    analysisRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3,
    },
    analysisLabel: {
        fontSize: 10,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    analysisValue: {
        fontSize: 10,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    qualityIndicator: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    excellentQuality: {
        backgroundColor: '#228B22',
    },
    goodQuality: {
        backgroundColor: '#32CD32',
    },
    fairQuality: {
        backgroundColor: '#FFD700',
    },
    poorQuality: {
        backgroundColor: '#FF6347',
    },
    qualityText: {
        fontSize: 8,
        color: KingdomColors.softWhite,
        fontWeight: 'bold',
        fontFamily: 'Sora',
    },
    spiritualBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    spiritualBadgeText: {
        fontSize: 8,
        color: KingdomColors.matteBlack,
        marginLeft: 2,
        fontFamily: 'Sora',
    },
    appliedCount: {
        fontSize: 8,
        color: KingdomColors.matteBlack,
        fontStyle: 'italic',
        marginTop: 3,
        fontFamily: 'Sora',
    },
    exportButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
    },
    exportButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
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
    analysisImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    analysisDetails: {
        marginBottom: 15,
    },
    spiritualHighlight: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: KingdomColors.dustGold,
        padding: 8,
        borderRadius: 6,
        marginTop: 8,
    },
    spiritualText: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginLeft: 5,
        fontWeight: 'bold',
        fontFamily: 'Sora',
    },
    suggestionsSection: {
        marginBottom: 15,
    },
    suggestionsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 10,
        fontFamily: 'Sora',
    },
    suggestionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: KingdomColors.dustGold,
        padding: 10,
        borderRadius: 6,
        marginBottom: 5,
    },
    suggestionText: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        flex: 1,
        fontFamily: 'Sora',
    },
    appliedEdits: {
        marginBottom: 15,
    },
    appliedTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    appliedEdit: {
        fontSize: 12,
        color: KingdomColors.softWhite,
        marginBottom: 2,
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
    batchOptions: {
        marginBottom: 20,
    },
    batchOption: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    selectedBatchOption: {
        backgroundColor: KingdomColors.bronze,
    },
    batchOptionText: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
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
});

export default AIEditingAssistantScreen; 