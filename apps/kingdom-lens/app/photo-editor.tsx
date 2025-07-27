import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useDualMode } from '../../contexts/DualModeContext';

const { width, height } = Dimensions.get('window');

interface EditTool {
    id: string;
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
    category: 'basic' | 'faith' | 'ai' | 'advanced';
}

const editTools: EditTool[] = [
    // Basic Tools
    { id: 'crop', name: 'Crop', icon: 'crop', category: 'basic' },
    { id: 'rotate', name: 'Rotate', icon: 'sync', category: 'basic' },
    { id: 'brightness', name: 'Brightness', icon: 'sunny', category: 'basic' },
    { id: 'contrast', name: 'Contrast', icon: 'contrast', category: 'basic' },
    { id: 'saturation', name: 'Saturation', icon: 'color-palette', category: 'basic' },

    // Faith Tools
    { id: 'prophetic-lens', name: 'Prophetic Lens', icon: 'eye', category: 'faith' },
    { id: 'blessing-overlay', name: 'Blessing Overlay', icon: 'heart', category: 'faith' },
    { id: 'scripture-frame', name: 'Scripture Frame', icon: 'book', category: 'faith' },
    { id: 'worship-filter', name: 'Worship Filter', icon: 'musical-notes', category: 'faith' },

    // AI Tools
    { id: 'ai-enhance', name: 'AI Enhance', icon: 'sparkles', category: 'ai' },
    { id: 'background-remove', name: 'Remove Background', icon: 'cut', category: 'ai' },
    { id: 'object-remove', name: 'Remove Objects', icon: 'trash', category: 'ai' },
    { id: 'style-transfer', name: 'Style Transfer', icon: 'color-wand', category: 'ai' },

    // Advanced Tools
    { id: 'layers', name: 'Layers', icon: 'layers', category: 'advanced' },
    { id: 'masks', name: 'Masks', icon: 'shield', category: 'advanced' },
    { id: 'curves', name: 'Curves', icon: 'trending-up', category: 'advanced' },
    { id: 'histogram', name: 'Histogram', icon: 'bar-chart', category: 'advanced' },
];

export default function PhotoEditorScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { isFaithMode } = useDualMode();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [editHistory, setEditHistory] = useState<any[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentProject, setCurrentProject] = useState<any>(null);

    const imageRef = useRef<Image>(null);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
                addToHistory('Image Selected', result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Camera permission is required');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
                addToHistory('Photo Taken', result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const addToHistory = (action: string, data: any) => {
        setEditHistory(prev => [...prev, { action, data, timestamp: Date.now() }]);
    };

    const applyFaithTool = async (toolId: string) => {
        if (!selectedImage) {
            Alert.alert('No Image', 'Please select an image first');
            return;
        }

        setIsProcessing(true);

        try {
            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            let message = '';
            switch (toolId) {
                case 'prophetic-lens':
                    message = 'Prophetic lens applied - revealing God\'s perspective';
                    break;
                case 'blessing-overlay':
                    message = 'Blessing overlay added - spreading God\'s love';
                    break;
                case 'scripture-frame':
                    message = 'Scripture frame applied - God\'s word as foundation';
                    break;
                case 'worship-filter':
                    message = 'Worship filter applied - creating atmosphere of praise';
                    break;
            }

            addToHistory(message, { tool: toolId });
            Alert.alert('Faith Tool Applied', message);
        } catch (error) {
            Alert.alert('Error', 'Failed to apply faith tool');
        } finally {
            setIsProcessing(false);
        }
    };

    const applyAITool = async (toolId: string) => {
        if (!selectedImage) {
            Alert.alert('No Image', 'Please select an image first');
            return;
        }

        setIsProcessing(true);

        try {
            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 3000));

            let message = '';
            switch (toolId) {
                case 'ai-enhance':
                    message = 'AI enhancement applied - improved quality and clarity';
                    break;
                case 'background-remove':
                    message = 'Background removed - subject isolated';
                    break;
                case 'object-remove':
                    message = 'Objects removed - clean composition';
                    break;
                case 'style-transfer':
                    message = 'Style transfer applied - artistic transformation';
                    break;
            }

            addToHistory(message, { tool: toolId });
            Alert.alert('AI Tool Applied', message);
        } catch (error) {
            Alert.alert('Error', 'Failed to apply AI tool');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleToolPress = (tool: EditTool) => {
        setActiveTool(tool.id);

        if (tool.category === 'faith') {
            applyFaithTool(tool.id);
        } else if (tool.category === 'ai') {
            applyAITool(tool.id);
        } else {
            // Basic and advanced tools would open specific UI panels
            Alert.alert('Tool Selected', `${tool.name} tool activated`);
        }
    };

    const saveProject = async () => {
        if (!selectedImage) {
            Alert.alert('No Image', 'Please select an image first');
            return;
        }

        try {
            // Save project logic here
            Alert.alert('Success', 'Project saved successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to save project');
        }
    };

    const exportImage = async () => {
        if (!selectedImage) {
            Alert.alert('No Image', 'Please select an image first');
            return;
        }

        try {
            // Export logic here
            Alert.alert('Success', 'Image exported successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to export image');
        }
    };

    const renderToolCategory = (category: string) => {
        const tools = editTools.filter(tool => tool.category === category);

        return (
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} Tools
                </Text>
                <View style={styles.toolsGrid}>
                    {tools.map((tool) => (
                        <TouchableOpacity
                            key={tool.id}
                            style={[
                                styles.toolButton,
                                activeTool === tool.id && styles.activeToolButton
                            ]}
                            onPress={() => handleToolPress(tool)}
                            disabled={isProcessing}
                        >
                            <Ionicons
                                name={tool.icon}
                                size={24}
                                color={activeTool === tool.id ? '#fff' : '#333'}
                            />
                            <Text style={[
                                styles.toolText,
                                activeTool === tool.id && styles.activeToolText
                            ]}>
                                {tool.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={isFaithMode ? ['#4A90E2', '#7B68EE'] : ['#2C3E50', '#34495E']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Photo Editor</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={saveProject} style={styles.headerButton}>
                        <Ionicons name="save" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={exportImage} style={styles.headerButton}>
                        <Ionicons name="share" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content}>
                {/* Image Display Area */}
                <View style={styles.imageContainer}>
                    {selectedImage ? (
                        <Image
                            ref={imageRef}
                            source={{ uri: selectedImage }}
                            style={styles.selectedImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <Ionicons name="image" size={64} color="#ccc" />
                            <Text style={styles.placeholderText}>No image selected</Text>
                            <View style={styles.imageActions}>
                                <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                                    <Ionicons name="images" size={20} color="#fff" />
                                    <Text style={styles.imageButtonText}>Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={takePhoto} style={styles.imageButton}>
                                    <Ionicons name="camera" size={20} color="#fff" />
                                    <Text style={styles.imageButtonText}>Camera</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

                {/* Processing Indicator */}
                {isProcessing && (
                    <View style={styles.processingContainer}>
                        <Ionicons name="sync" size={24} color="#4A90E2" />
                        <Text style={styles.processingText}>Processing...</Text>
                    </View>
                )}

                {/* Faith Mode Highlight */}
                {isFaithMode && (
                    <View style={styles.faithModeBanner}>
                        <Ionicons name="heart" size={16} color="#E74C3C" />
                        <Text style={styles.faithModeText}>
                            Faith Mode Active - Tools enhanced with spiritual perspective
                        </Text>
                    </View>
                )}

                {/* Tool Categories */}
                <View style={styles.toolsContainer}>
                    {renderToolCategory('basic')}
                    {isFaithMode && renderToolCategory('faith')}
                    {renderToolCategory('ai')}
                    {renderToolCategory('advanced')}
                </View>

                {/* Edit History */}
                {editHistory.length > 0 && (
                    <View style={styles.historyContainer}>
                        <Text style={styles.historyTitle}>Edit History</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {editHistory.slice(-5).map((item, index) => (
                                <View key={index} style={styles.historyItem}>
                                    <Text style={styles.historyAction}>{item.action}</Text>
                                    <Text style={styles.historyTime}>
                                        {new Date(item.timestamp).toLocaleTimeString()}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    onPress={() => router.push('/projects')}
                    style={styles.bottomButton}
                >
                    <Ionicons name="folder" size={20} color="#333" />
                    <Text style={styles.bottomButtonText}>Projects</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('/clients')}
                    style={styles.bottomButton}
                >
                    <Ionicons name="people" size={20} color="#333" />
                    <Text style={styles.bottomButtonText}>Clients</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('/analytics')}
                    style={styles.bottomButton}
                >
                    <Ionicons name="analytics" size={20} color="#333" />
                    <Text style={styles.bottomButtonText}>Analytics</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerActions: {
        flexDirection: 'row',
    },
    headerButton: {
        padding: 8,
        marginLeft: 8,
    },
    content: {
        flex: 1,
    },
    imageContainer: {
        height: height * 0.4,
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    selectedImage: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    placeholderText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
        marginBottom: 20,
    },
    imageActions: {
        flexDirection: 'row',
        gap: 16,
    },
    imageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4A90E2',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    imageButtonText: {
        color: '#fff',
        marginLeft: 4,
        fontWeight: '500',
    },
    processingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    processingText: {
        marginLeft: 8,
        color: '#4A90E2',
        fontWeight: '500',
    },
    faithModeBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#E74C3C',
    },
    faithModeText: {
        marginLeft: 8,
        color: '#E74C3C',
        fontSize: 12,
        fontWeight: '500',
    },
    toolsContainer: {
        padding: 16,
    },
    categoryContainer: {
        marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    toolsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    toolButton: {
        width: (width - 64) / 4,
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    activeToolButton: {
        backgroundColor: '#4A90E2',
    },
    toolText: {
        fontSize: 10,
        color: '#333',
        marginTop: 4,
        textAlign: 'center',
    },
    activeToolText: {
        color: '#fff',
    },
    historyContainer: {
        padding: 16,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    historyItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginRight: 12,
        minWidth: 120,
    },
    historyAction: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
    historyTime: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
    },
    bottomBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    bottomButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    bottomButtonText: {
        fontSize: 12,
        color: '#333',
        marginTop: 4,
    },
}); 