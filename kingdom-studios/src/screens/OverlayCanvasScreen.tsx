import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    Modal,
    PanGestureHandler,
    State,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface OverlayElement {
    id: string;
    type: 'text' | 'scripture' | 'logo';
    content: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily: string;
}

interface CanvasTemplate {
    id: string;
    name: string;
    width: number;
    height: number;
    elements: OverlayElement[];
}

const OverlayCanvasScreen: React.FC = () => {
    const { isFaithMode } = useDualMode();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [overlayElements, setOverlayElements] = useState<OverlayElement[]>([]);
    const [selectedElement, setSelectedElement] = useState<OverlayElement | null>(null);
    const [showTextModal, setShowTextModal] = useState(false);
    const [showScriptureModal, setShowScriptureModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [currentText, setCurrentText] = useState('');
    const [currentFontSize, setCurrentFontSize] = useState(24);
    const [currentColor, setCurrentColor] = useState(KingdomColors.softWhite);

    const templates: CanvasTemplate[] = [
        {
            id: '1',
            name: 'Instagram Post',
            width: 1080,
            height: 1080,
            elements: [
                {
                    id: '1',
                    type: 'text',
                    content: 'Your Caption Here',
                    x: 50,
                    y: 50,
                    fontSize: 32,
                    color: KingdomColors.softWhite,
                    fontFamily: 'Sora',
                },
            ],
        },
        {
            id: '2',
            name: 'Instagram Story',
            width: 1080,
            height: 1920,
            elements: [
                {
                    id: '1',
                    type: 'text',
                    content: 'Story Text',
                    x: 50,
                    y: 100,
                    fontSize: 28,
                    color: KingdomColors.softWhite,
                    fontFamily: 'Sora',
                },
            ],
        },
        {
            id: '3',
            name: 'Pinterest Pin',
            width: 1000,
            height: 1500,
            elements: [
                {
                    id: '1',
                    type: 'text',
                    content: 'Pin Title',
                    x: 50,
                    y: 50,
                    fontSize: 36,
                    color: KingdomColors.softWhite,
                    fontFamily: 'EB Garamond',
                },
            ],
        },
    ];

    const faithScriptures = [
        "For I know the plans I have for you, declares the Lord...",
        "I can do all things through Christ who strengthens me.",
        "Be strong and courageous. Do not be afraid...",
        "The Lord is my shepherd, I shall not want.",
        "Trust in the Lord with all your heart...",
        "Let your light shine before others...",
        "In all things God works for the good...",
        "Faith is the substance of things hoped for...",
    ];

    const encouragementQuotes = [
        "You are capable of amazing things.",
        "Every moment is a new beginning.",
        "Your creativity knows no bounds.",
        "You have the power to inspire others.",
        "Trust your instincts and vision.",
        "Your work touches hearts and souls.",
        "You are making a difference.",
        "Your passion drives your success.",
    ];

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const addTextElement = () => {
        if (!currentText.trim()) {
            Alert.alert('Empty Text', 'Please enter some text to add.');
            return;
        }

        const newElement: OverlayElement = {
            id: Date.now().toString(),
            type: 'text',
            content: currentText,
            x: 50,
            y: 50 + overlayElements.length * 30,
            fontSize: currentFontSize,
            color: currentColor,
            fontFamily: 'Sora',
        };

        setOverlayElements([...overlayElements, newElement]);
        setCurrentText('');
        setShowTextModal(false);
    };

    const addScriptureElement = (scripture: string) => {
        const newElement: OverlayElement = {
            id: Date.now().toString(),
            type: 'scripture',
            content: scripture,
            x: 50,
            y: 50 + overlayElements.length * 40,
            fontSize: currentFontSize,
            color: KingdomColors.dustGold,
            fontFamily: 'EB Garamond',
        };

        setOverlayElements([...overlayElements, newElement]);
        setShowScriptureModal(false);
    };

    const addLogoElement = () => {
        const newElement: OverlayElement = {
            id: Date.now().toString(),
            type: 'logo',
            content: 'Kingdom Studios',
            x: 50,
            y: 50,
            fontSize: 24,
            color: KingdomColors.bronze,
            fontFamily: 'EB Garamond',
        };

        setOverlayElements([...overlayElements, newElement]);
    };

    const deleteElement = (elementId: string) => {
        setOverlayElements(overlayElements.filter(element => element.id !== elementId));
        setSelectedElement(null);
    };

    const applyTemplate = (template: CanvasTemplate) => {
        setOverlayElements(template.elements);
        setShowTemplateModal(false);
        Alert.alert('Template Applied', 'Template elements have been added to your canvas.');
    };

    const exportCanvas = () => {
        Alert.alert(
            'Export Canvas',
            isFaithMode
                ? 'Your creation has been blessed and is ready to share. May it inspire and uplift others.'
                : 'Canvas exported successfully! Ready to share on social media.'
        );
    };

    const TextModal = () => (
        <Modal
            visible={showTextModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {isFaithMode ? 'Add Inspired Text' : 'Add Text Overlay'}
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Text Content</Text>
                        <TextInput
                            style={styles.textInput}
                            value={currentText}
                            onChangeText={setCurrentText}
                            placeholder="Enter your text..."
                            multiline
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Font Size</Text>
                        <TextInput
                            style={styles.input}
                            value={currentFontSize.toString()}
                            onChangeText={(text) => setCurrentFontSize(parseInt(text) || 24)}
                            keyboardType="numeric"
                            placeholder="24"
                        />
                    </View>

                    <View style={styles.colorPicker}>
                        <Text style={styles.label}>Color</Text>
                        <View style={styles.colorOptions}>
                            {[KingdomColors.softWhite, KingdomColors.dustGold, KingdomColors.bronze, '#000000'].map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[styles.colorOption, { backgroundColor: color }, currentColor === color && styles.selectedColor]}
                                    onPress={() => setCurrentColor(color)}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowTextModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.primaryButton]}
                            onPress={addTextElement}
                        >
                            <Text style={[styles.modalButtonText, styles.primaryButtonText]}>Add Text</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const ScriptureModal = () => (
        <Modal
            visible={showScriptureModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Choose Scripture</Text>
                    <ScrollView style={styles.scriptureList}>
                        {faithScriptures.map((scripture, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.scriptureItem}
                                onPress={() => addScriptureElement(scripture)}
                            >
                                <Text style={styles.scriptureText}>{scripture}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setShowScriptureModal(false)}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const TemplateModal = () => (
        <Modal
            visible={showTemplateModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Choose Template</Text>
                    {templates.map((template) => (
                        <TouchableOpacity
                            key={template.id}
                            style={styles.templateItem}
                            onPress={() => applyTemplate(template)}
                        >
                            <Text style={styles.templateName}>{template.name}</Text>
                            <Text style={styles.templateSize}>
                                {template.width} x {template.height}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setShowTemplateModal(false)}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isFaithMode ? 'Overlay Canvas - Faith Mode' : 'Overlay Canvas'}
                </Text>
                <Text style={styles.subtitle}>
                    {isFaithMode
                        ? 'Create overlays that honor God and inspire others'
                        : 'Add text, scripture, and branding to your images'
                    }
                </Text>
            </View>

            <View style={styles.canvasContainer}>
                {!selectedImage ? (
                    <TouchableOpacity
                        style={styles.uploadArea}
                        onPress={pickImage}
                    >
                        <Ionicons name="image" size={48} color={KingdomColors.bronze} />
                        <Text style={styles.uploadText}>
                            {isFaithMode ? 'Upload Your Image to Begin' : 'Tap to Upload Image'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: selectedImage }} style={styles.canvasImage} />
                        {overlayElements.map((element) => (
                            <Text
                                key={element.id}
                                style={[
                                    styles.overlayText,
                                    {
                                        position: 'absolute',
                                        left: element.x,
                                        top: element.y,
                                        fontSize: element.fontSize,
                                        color: element.color,
                                        fontFamily: element.fontFamily,
                                    },
                                ]}
                                onPress={() => setSelectedElement(element)}
                            >
                                {element.content}
                            </Text>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.toolbar}>
                <TouchableOpacity
                    style={styles.toolButton}
                    onPress={pickImage}
                >
                    <Ionicons name="image" size={20} color={KingdomColors.softWhite} />
                    <Text style={styles.toolButtonText}>Image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.toolButton}
                    onPress={() => setShowTextModal(true)}
                >
                    <Ionicons name="text" size={20} color={KingdomColors.softWhite} />
                    <Text style={styles.toolButtonText}>Text</Text>
                </TouchableOpacity>

                {isFaithMode && (
                    <TouchableOpacity
                        style={styles.toolButton}
                        onPress={() => setShowScriptureModal(true)}
                    >
                        <Ionicons name="book" size={20} color={KingdomColors.softWhite} />
                        <Text style={styles.toolButtonText}>Scripture</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.toolButton}
                    onPress={addLogoElement}
                >
                    <Ionicons name="logo" size={20} color={KingdomColors.softWhite} />
                    <Text style={styles.toolButtonText}>Logo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.toolButton}
                    onPress={() => setShowTemplateModal(true)}
                >
                    <Ionicons name="grid" size={20} color={KingdomColors.softWhite} />
                    <Text style={styles.toolButtonText}>Template</Text>
                </TouchableOpacity>
            </View>

            {overlayElements.length > 0 && (
                <View style={styles.elementsPanel}>
                    <Text style={styles.panelTitle}>Overlay Elements</Text>
                    {overlayElements.map((element) => (
                        <View key={element.id} style={styles.elementItem}>
                            <Text style={styles.elementContent} numberOfLines={1}>
                                {element.content}
                            </Text>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteElement(element.id)}
                            >
                                <Ionicons name="trash" size={16} color={KingdomColors.bronze} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            {selectedImage && (
                <TouchableOpacity
                    style={styles.exportButton}
                    onPress={exportCanvas}
                >
                    <Ionicons name="share" size={20} color={KingdomColors.softWhite} />
                    <Text style={styles.exportButtonText}>
                        {isFaithMode ? 'Export & Bless' : 'Export Canvas'}
                    </Text>
                </TouchableOpacity>
            )}

            <TextModal />
            <ScriptureModal />
            <TemplateModal />
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
    canvasContainer: {
        margin: 20,
        aspectRatio: 1,
        backgroundColor: KingdomColors.dustGold,
        borderRadius: 10,
        overflow: 'hidden',
    },
    uploadArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        borderStyle: 'dashed',
        borderRadius: 10,
    },
    uploadText: {
        fontSize: 16,
        color: KingdomColors.bronze,
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'Sora',
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
    },
    canvasImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlayText: {
        position: 'absolute',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: KingdomColors.dustGold,
        marginHorizontal: 20,
        borderRadius: 10,
    },
    toolButton: {
        alignItems: 'center',
        padding: 10,
    },
    toolButtonText: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        marginTop: 5,
        fontFamily: 'Sora',
    },
    elementsPanel: {
        margin: 20,
        backgroundColor: KingdomColors.dustGold,
        borderRadius: 10,
        padding: 15,
    },
    panelTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 10,
        fontFamily: 'EB Garamond',
    },
    elementItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.bronze,
    },
    elementContent: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        flex: 1,
        fontFamily: 'Sora',
    },
    deleteButton: {
        padding: 5,
    },
    exportButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        margin: 20,
        borderRadius: 10,
    },
    exportButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 18,
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
    textInput: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: KingdomColors.matteBlack,
        minHeight: 80,
        textAlignVertical: 'top',
        fontFamily: 'Sora',
    },
    colorPicker: {
        marginBottom: 15,
    },
    colorOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    colorOption: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
    },
    selectedColor: {
        borderWidth: 3,
        borderColor: KingdomColors.softWhite,
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
    scriptureList: {
        maxHeight: 300,
    },
    scriptureItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.bronze,
    },
    scriptureText: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    templateItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.bronze,
    },
    templateName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'EB Garamond',
    },
    templateSize: {
        fontSize: 12,
        color: KingdomColors.softWhite,
        marginTop: 3,
        fontFamily: 'Sora',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    cancelButtonText: {
        color: KingdomColors.bronze,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Sora',
    },
});

export default OverlayCanvasScreen; 