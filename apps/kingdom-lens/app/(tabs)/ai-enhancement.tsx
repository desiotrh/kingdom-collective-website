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
    Slider,
    Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';

const { width, height } = Dimensions.get('window');

interface EnhancementTool {
    id: string;
    name: string;
    description: string;
    icon: string;
    intensity: number;
    isActive: boolean;
    faithMode?: {
        name: string;
        description: string;
    };
}

interface PhotoEnhancement {
    id: string;
    originalUrl: string;
    enhancedUrl: string;
    tools: EnhancementTool[];
    beforeAfter: boolean;
    faithMode?: {
        name: string;
        tools: EnhancementTool[];
    };
}

const AIEnhancementScreen: React.FC = () => {
    const { faithMode } = useFaithMode();
    const [enhancementTools, setEnhancementTools] = useState<EnhancementTool[]>([]);
    const [currentPhoto, setCurrentPhoto] = useState<PhotoEnhancement | null>(null);
    const [showBeforeAfter, setShowBeforeAfter] = useState(false);
    const [showEnhancementModal, setShowEnhancementModal] = useState(false);
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const tools: EnhancementTool[] = [
        {
            id: 'object-cleanup',
            name: faithMode ? 'Divine Cleanup' : 'Object Cleanup',
            description: faithMode
                ? 'Remove distractions and let God\'s beauty shine through'
                : 'Remove unwanted objects and distractions from photos',
            icon: 'trash',
            intensity: 50,
            isActive: false,
            faithMode: {
                name: 'Divine Cleanup',
                description: 'Remove distractions and let God\'s beauty shine through'
            }
        },
        {
            id: 'skin-smoothing',
            name: faithMode ? 'Gentle Touch' : 'Skin Smoothing',
            description: faithMode
                ? 'Enhance natural beauty with gentle, loving care'
                : 'Smooth skin while preserving natural texture',
            icon: 'hand-left',
            intensity: 30,
            isActive: false,
            faithMode: {
                name: 'Gentle Touch',
                description: 'Enhance natural beauty with gentle, loving care'
            }
        },
        {
            id: 'background-balance',
            name: faithMode ? 'Light Balance' : 'Background Balance',
            description: faithMode
                ? 'Perfect the lighting to highlight God\'s creation'
                : 'Balance background lighting and shadows',
            icon: 'sunny',
            intensity: 40,
            isActive: false,
            faithMode: {
                name: 'Light Balance',
                description: 'Perfect the lighting to highlight God\'s creation'
            }
        },
        {
            id: 'shadow-recovery',
            name: faithMode ? 'Shadow Recovery' : 'Shadow Recovery',
            description: faithMode
                ? 'Bring light to the shadows, revealing hidden beauty'
                : 'Recover details from dark shadows',
            icon: 'contrast',
            intensity: 60,
            isActive: false,
            faithMode: {
                name: 'Shadow Recovery',
                description: 'Bring light to the shadows, revealing hidden beauty'
            }
        },
        {
            id: 'heavenly-touch',
            name: faithMode ? 'Heavenly Touch' : 'One-Tap Enhancement',
            description: faithMode
                ? 'Apply God\'s perfect enhancement with one touch'
                : 'Apply perfect enhancement with one tap',
            icon: 'sparkles',
            intensity: 100,
            isActive: false,
            faithMode: {
                name: 'Heavenly Touch',
                description: 'Apply God\'s perfect enhancement with one touch'
            }
        }
    ];

    useEffect(() => {
        setEnhancementTools(tools);
    }, [faithMode]);

    const toggleTool = (toolId: string) => {
        setEnhancementTools(tools.map(tool =>
            tool.id === toolId ? { ...tool, isActive: !tool.isActive } : tool
        ));
    };

    const updateIntensity = (toolId: string, value: number) => {
        setEnhancementTools(tools.map(tool =>
            tool.id === toolId ? { ...tool, intensity: value } : tool
        ));
    };

    const applyHeavenlyTouch = () => {
        Alert.alert(
            faithMode ? 'Heavenly Touch Applied' : 'Enhancement Applied',
            faithMode
                ? 'God\'s perfect enhancement has been applied to your photo.'
                : 'Perfect enhancement has been applied to your photo.',
            [{ text: 'OK' }]
        );
    };

    const enhancePhoto = () => {
        const activeTools = enhancementTools.filter(tool => tool.isActive);
        if (activeTools.length === 0) {
            Alert.alert(
                'No Tools Selected',
                'Please select at least one enhancement tool.',
                [{ text: 'OK' }]
            );
            return;
        }

        setShowEnhancementModal(true);
        // Simulate enhancement process
        setTimeout(() => {
            setShowEnhancementModal(false);
            Alert.alert(
                'Enhancement Complete',
                faithMode
                    ? 'Your photo has been enhanced with divine care and attention.'
                    : 'Your photo has been enhanced successfully.',
                [{ text: 'OK' }]
            );
        }, 2000);
    };

    const getFaithModeMessage = () => {
        const messages = [
            "Enhance photos with God's perfect touch.",
            "Let AI reveal the beauty in every image.",
            "Transform ordinary moments into divine memories.",
            "Every photo deserves to shine with God's light."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const renderTool = (tool: EnhancementTool) => (
        <View key={tool.id} style={styles.toolCard}>
            <View style={styles.toolHeader}>
                <View style={styles.toolInfo}>
                    <Ionicons
                        name={tool.icon as any}
                        size={24}
                        color={tool.isActive ? '#3B82F6' : '#64748B'}
                    />
                    <View style={styles.toolText}>
                        <Text style={styles.toolName}>
                            {faithMode && tool.faithMode ? tool.faithMode.name : tool.name}
                        </Text>
                        <Text style={styles.toolDescription}>
                            {faithMode && tool.faithMode ? tool.faithMode.description : tool.description}
                        </Text>
                    </View>
                </View>
                <Switch
                    value={tool.isActive}
                    onValueChange={() => toggleTool(tool.id)}
                    trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
                    thumbColor={tool.isActive ? '#FFFFFF' : '#FFFFFF'}
                />
            </View>

            {tool.isActive && (
                <View style={styles.intensityContainer}>
                    <Text style={styles.intensityLabel}>Intensity: {tool.intensity}%</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        value={tool.intensity}
                        onValueChange={(value) => updateIntensity(tool.id, value)}
                        minimumTrackTintColor="#3B82F6"
                        maximumTrackTintColor="#E2E8F0"
                        thumbStyle={{ backgroundColor: '#3B82F6' }}
                    />
                </View>
            )}
        </View>
    );

    const renderBeforeAfter = () => (
        <View style={styles.beforeAfterContainer}>
            <View style={styles.beforeAfterHeader}>
                <Text style={styles.beforeAfterTitle}>Before & After</Text>
                <TouchableOpacity onPress={() => setShowBeforeAfter(!showBeforeAfter)}>
                    <Ionicons
                        name={showBeforeAfter ? 'eye-off' : 'eye'}
                        size={24}
                        color="#3B82F6"
                    />
                </TouchableOpacity>
            </View>

            {showBeforeAfter && (
                <View style={styles.beforeAfterImages}>
                    <View style={styles.imageContainer}>
                        <Text style={styles.imageLabel}>Before</Text>
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="image" size={48} color="#E2E8F0" />
                            <Text style={styles.placeholderText}>Original Photo</Text>
                        </View>
                    </View>
                    <View style={styles.imageContainer}>
                        <Text style={styles.imageLabel}>After</Text>
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="sparkles" size={48} color="#8B5CF6" />
                            <Text style={styles.placeholderText}>Enhanced Photo</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {faithMode ? 'Divine AI Enhancement' : 'AI Photo Enhancement'}
                    </Text>
                    {faithMode && (
                        <Text style={styles.faithMessage}>{getFaithModeMessage()}</Text>
                    )}
                </View>

                {/* Heavenly Touch Quick Action */}
                <View style={styles.heavenlyTouchCard}>
                    <LinearGradient
                        colors={faithMode ? ['#8B5CF6', '#3B82F6'] : ['#3B82F6', '#1E40AF']}
                        style={styles.heavenlyTouchGradient}
                    >
                        <View style={styles.heavenlyTouchContent}>
                            <Ionicons name="sparkles" size={32} color="#FFFFFF" />
                            <Text style={styles.heavenlyTouchTitle}>
                                {faithMode ? 'Heavenly Touch' : 'One-Tap Enhancement'}
                            </Text>
                            <Text style={styles.heavenlyTouchDescription}>
                                {faithMode
                                    ? 'Apply God\'s perfect enhancement instantly'
                                    : 'Apply perfect enhancement instantly'
                                }
                            </Text>
                            <TouchableOpacity
                                style={styles.heavenlyTouchButton}
                                onPress={applyHeavenlyTouch}
                            >
                                <Text style={styles.heavenlyTouchButtonText}>
                                    {faithMode ? 'Apply Heavenly Touch' : 'Apply Enhancement'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

                {/* Enhancement Tools */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Enhancement Tools</Text>
                    <Text style={styles.sectionDescription}>
                        {faithMode
                            ? 'Choose tools to enhance your photos with divine care'
                            : 'Choose tools to enhance your photos professionally'
                        }
                    </Text>
                    {enhancementTools.map(renderTool)}
                </View>

                {/* Before & After */}
                {renderBeforeAfter()}

                {/* Quick Tips */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Enhancement Tips</Text>
                    <View style={styles.tipsContainer}>
                        <View style={styles.tip}>
                            <Ionicons name="bulb" size={20} color="#10B981" />
                            <Text style={styles.tipText}>
                                {faithMode
                                    ? 'Start with Heavenly Touch for perfect results'
                                    : 'Start with One-Tap Enhancement for perfect results'
                                }
                            </Text>
                        </View>
                        <View style={styles.tip}>
                            <Ionicons name="eye" size={20} color="#3B82F6" />
                            <Text style={styles.tipText}>
                                {faithMode
                                    ? 'Use Gentle Touch for natural beauty enhancement'
                                    : 'Use Skin Smoothing for natural beauty enhancement'
                                }
                            </Text>
                        </View>
                        <View style={styles.tip}>
                            <Ionicons name="sunny" size={20} color="#F59E0B" />
                            <Text style={styles.tipText}>
                                {faithMode
                                    ? 'Light Balance perfects God\'s natural lighting'
                                    : 'Background Balance perfects natural lighting'
                                }
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Apply Enhancement Button */}
                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={enhancePhoto}
                >
                    <Text style={styles.applyButtonText}>
                        {faithMode ? 'Apply Divine Enhancement' : 'Apply Enhancement'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Enhancement Progress Modal */}
            <Modal
                visible={showEnhancementModal}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {faithMode ? 'Applying Divine Enhancement' : 'Applying Enhancement'}
                            </Text>
                        </View>
                        <View style={styles.progressContainer}>
                            <Ionicons name="sparkles" size={48} color="#8B5CF6" />
                            <Text style={styles.progressText}>
                                {faithMode
                                    ? 'Enhancing your photo with divine care...'
                                    : 'Enhancing your photo...'
                                }
                            </Text>
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
    scrollView: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 24,
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
    heavenlyTouchCard: {
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
    },
    heavenlyTouchGradient: {
        padding: 24,
    },
    heavenlyTouchContent: {
        alignItems: 'center',
    },
    heavenlyTouchTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 12,
        marginBottom: 8,
    },
    heavenlyTouchDescription: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    heavenlyTouchButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    heavenlyTouchButtonText: {
        color: '#3B82F6',
        fontSize: 16,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 16,
    },
    toolCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    toolHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    toolInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    toolText: {
        marginLeft: 12,
        flex: 1,
    },
    toolName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    toolDescription: {
        fontSize: 14,
        color: '#64748B',
    },
    intensityContainer: {
        marginTop: 12,
    },
    intensityLabel: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    beforeAfterContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    beforeAfterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    beforeAfterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    beforeAfterImages: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imageContainer: {
        flex: 1,
        marginHorizontal: 4,
    },
    imageLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: 8,
    },
    imagePlaceholder: {
        height: 120,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    placeholderText: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 8,
    },
    tipsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    tip: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    tipText: {
        fontSize: 14,
        color: '#64748B',
        marginLeft: 8,
        flex: 1,
    },
    applyButton: {
        backgroundColor: '#10B981',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
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
        padding: 24,
        alignItems: 'center',
        maxWidth: 300,
    },
    modalHeader: {
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        textAlign: 'center',
    },
    progressContainer: {
        alignItems: 'center',
    },
    progressText: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 16,
    },
});

export default AIEnhancementScreen; 