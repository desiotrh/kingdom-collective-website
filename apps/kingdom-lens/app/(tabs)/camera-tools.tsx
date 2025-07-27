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
    Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';

const { width, height } = Dimensions.get('window');

interface CompositionGuide {
    id: string;
    name: string;
    description: string;
    icon: string;
    isActive: boolean;
    faithMode?: {
        name: string;
        description: string;
    };
}

interface LightingAnalysis {
    type: 'backlight' | 'overexposure' | 'underexposure' | 'perfect';
    message: string;
    recommendation: string;
    severity: 'warning' | 'error' | 'info';
}

interface SceneStyle {
    id: string;
    name: string;
    mood: string;
    preset: string;
    confidence: number;
    tags: string[];
}

const CameraToolsScreen: React.FC = () => {
    const { faithMode } = useFaithMode();
    const [activeGuides, setActiveGuides] = useState<string[]>(['rule-of-thirds']);
    const [lightingAnalysis, setLightingAnalysis] = useState<LightingAnalysis | null>(null);
    const [detectedStyle, setDetectedStyle] = useState<SceneStyle | null>(null);
    const [showCompositionModal, setShowCompositionModal] = useState(false);
    const [showLightingModal, setShowLightingModal] = useState(false);

    const compositionGuides: CompositionGuide[] = [
        {
            id: 'rule-of-thirds',
            name: faithMode ? 'Divine Proportion' : 'Rule of Thirds',
            description: faithMode
                ? 'Align your subject with God\'s perfect proportions'
                : 'Divide frame into thirds for balanced composition',
            icon: 'grid',
            isActive: true,
            faithMode: {
                name: 'Divine Proportion',
                description: 'Align your subject with God\'s perfect proportions'
            }
        },
        {
            id: 'golden-ratio',
            name: faithMode ? 'Golden Ratio' : 'Golden Ratio',
            description: faithMode
                ? 'The mathematical beauty found in creation'
                : 'Natural proportion for harmonious composition',
            icon: 'infinite',
            isActive: false,
            faithMode: {
                name: 'Golden Ratio',
                description: 'The mathematical beauty found in creation'
            }
        },
        {
            id: 'leading-lines',
            name: faithMode ? 'Guiding Lines' : 'Leading Lines',
            description: faithMode
                ? 'Let lines guide the viewer\'s eye to your subject'
                : 'Use natural lines to direct viewer attention',
            icon: 'arrow-forward',
            isActive: false,
            faithMode: {
                name: 'Guiding Lines',
                description: 'Let lines guide the viewer\'s eye to your subject'
            }
        },
        {
            id: 'symmetry',
            name: faithMode ? 'Perfect Balance' : 'Symmetry',
            description: faithMode
                ? 'Create perfect balance in your composition'
                : 'Mirror elements for balanced composition',
            icon: 'copy',
            isActive: false,
            faithMode: {
                name: 'Perfect Balance',
                description: 'Create perfect balance in your composition'
            }
        },
        {
            id: 'framing',
            name: faithMode ? 'Natural Frame' : 'Framing',
            description: faithMode
                ? 'Use nature\'s frames to highlight your subject'
                : 'Frame your subject with natural elements',
            icon: 'square',
            isActive: false,
            faithMode: {
                name: 'Natural Frame',
                description: 'Use nature\'s frames to highlight your subject'
            }
        }
    ];

    const lightingTypes = [
        {
            type: 'backlight' as const,
            message: faithMode ? 'Subject may be in shadow - consider God\'s light from behind' : 'Subject may be in shadow',
            recommendation: 'Adjust exposure or use fill flash',
            severity: 'warning' as const
        },
        {
            type: 'overexposure' as const,
            message: faithMode ? 'Too much light - find the perfect balance' : 'Image may be overexposed',
            recommendation: 'Reduce exposure or use ND filter',
            severity: 'warning' as const
        },
        {
            type: 'perfect' as const,
            message: faithMode ? 'Perfect lighting - God\'s creation at its best' : 'Perfect lighting conditions',
            recommendation: 'Capture this moment',
            severity: 'info' as const
        }
    ];

    const sceneStyles: SceneStyle[] = [
        {
            id: 'airy',
            name: faithMode ? 'Heavenly Light' : 'Airy & Bright',
            mood: 'peaceful',
            preset: 'faith_airy',
            confidence: 92,
            tags: ['bright', 'soft', 'peaceful', 'faith']
        },
        {
            id: 'cinematic',
            name: faithMode ? 'Epic Story' : 'Cinematic',
            mood: 'dramatic',
            preset: 'faith_cinematic',
            confidence: 87,
            tags: ['dramatic', 'contrast', 'story', 'faith']
        },
        {
            id: 'vintage',
            name: faithMode ? 'Timeless Beauty' : 'Vintage',
            mood: 'nostalgic',
            preset: 'faith_vintage',
            confidence: 78,
            tags: ['warm', 'nostalgic', 'timeless', 'faith']
        }
    ];

    const toggleGuide = (guideId: string) => {
        if (activeGuides.includes(guideId)) {
            setActiveGuides(activeGuides.filter(id => id !== guideId));
        } else {
            setActiveGuides([...activeGuides, guideId]);
        }
    };

    const analyzeLighting = () => {
        // Simulate lighting analysis
        const randomLighting = lightingTypes[Math.floor(Math.random() * lightingTypes.length)];
        setLightingAnalysis(randomLighting);
        setShowLightingModal(true);
    };

    const detectSceneStyle = () => {
        // Simulate scene style detection
        const randomStyle = sceneStyles[Math.floor(Math.random() * sceneStyles.length)];
        setDetectedStyle(randomStyle);
    };

    const getFaithModeMessage = () => {
        const messages = [
            "Capture God's creation with perfect composition.",
            "Let His light guide your photographic vision.",
            "Every frame tells a story of divine beauty.",
            "Compose with purpose, shoot with passion."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const renderCompositionGuide = (guide: CompositionGuide) => (
        <TouchableOpacity
            key={guide.id}
            style={[
                styles.guideCard,
                activeGuides.includes(guide.id) && styles.activeGuideCard
            ]}
            onPress={() => toggleGuide(guide.id)}
        >
            <View style={styles.guideHeader}>
                <Ionicons
                    name={guide.icon as any}
                    size={24}
                    color={activeGuides.includes(guide.id) ? '#3B82F6' : '#64748B'}
                />
                <Switch
                    value={activeGuides.includes(guide.id)}
                    onValueChange={() => toggleGuide(guide.id)}
                    trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
                    thumbColor={activeGuides.includes(guide.id) ? '#FFFFFF' : '#FFFFFF'}
                />
            </View>
            <Text style={styles.guideName}>
                {faithMode && guide.faithMode ? guide.faithMode.name : guide.name}
            </Text>
            <Text style={styles.guideDescription}>
                {faithMode && guide.faithMode ? guide.faithMode.description : guide.description}
            </Text>
        </TouchableOpacity>
    );

    const renderLightingAnalysis = () => (
        <View style={styles.lightingCard}>
            <View style={styles.lightingHeader}>
                <Ionicons name="sunny" size={24} color="#F59E0B" />
                <Text style={styles.lightingTitle}>Lighting Analysis</Text>
            </View>
            <TouchableOpacity style={styles.analyzeButton} onPress={analyzeLighting}>
                <Text style={styles.analyzeButtonText}>Analyze Current Scene</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSceneDetection = () => (
        <View style={styles.sceneCard}>
            <View style={styles.sceneHeader}>
                <Ionicons name="sparkles" size={24} color="#8B5CF6" />
                <Text style={styles.sceneTitle}>Scene Style Detection</Text>
            </View>
            <TouchableOpacity style={styles.detectButton} onPress={detectSceneStyle}>
                <Text style={styles.detectButtonText}>Detect Style & Mood</Text>
            </TouchableOpacity>
            {detectedStyle && (
                <View style={styles.detectedStyle}>
                    <Text style={styles.styleName}>{detectedStyle.name}</Text>
                    <Text style={styles.styleConfidence}>{detectedStyle.confidence}% confidence</Text>
                    <View style={styles.styleTags}>
                        {detectedStyle.tags.map(tag => (
                            <View key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
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
                        {faithMode ? 'Divine Camera Tools' : 'Camera Tools'}
                    </Text>
                    {faithMode && (
                        <Text style={styles.faithMessage}>{getFaithModeMessage()}</Text>
                    )}
                </View>

                {/* Composition Guides */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Composition Guides</Text>
                    <Text style={styles.sectionDescription}>
                        {faithMode
                            ? 'Use divine proportions to create perfect compositions'
                            : 'Professional composition guides for better photos'
                        }
                    </Text>
                    {compositionGuides.map(renderCompositionGuide)}
                </View>

                {/* Lighting Analysis */}
                <View style={styles.section}>
                    {renderLightingAnalysis()}
                </View>

                {/* Scene Style Detection */}
                <View style={styles.section}>
                    {renderSceneDetection()}
                </View>

                {/* Quick Tips */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Tips</Text>
                    <View style={styles.tipsContainer}>
                        <View style={styles.tip}>
                            <Ionicons name="bulb" size={20} color="#10B981" />
                            <Text style={styles.tipText}>
                                {faithMode
                                    ? 'Golden hour is God\'s perfect lighting'
                                    : 'Golden hour provides the best natural light'
                                }
                            </Text>
                        </View>
                        <View style={styles.tip}>
                            <Ionicons name="eye" size={20} color="#3B82F6" />
                            <Text style={styles.tipText}>
                                {faithMode
                                    ? 'Let your subject\'s eyes tell the story'
                                    : 'Focus on the eyes for engaging portraits'
                                }
                            </Text>
                        </View>
                        <View style={styles.tip}>
                            <Ionicons name="triangle" size={20} color="#F59E0B" />
                            <Text style={styles.tipText}>
                                {faithMode
                                    ? 'Use triangles to create divine balance'
                                    : 'Triangular compositions create visual stability'
                                }
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Lighting Analysis Modal */}
            <Modal
                visible={showLightingModal}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Lighting Analysis</Text>
                            <TouchableOpacity onPress={() => setShowLightingModal(false)}>
                                <Ionicons name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                        {lightingAnalysis && (
                            <View>
                                <View style={[
                                    styles.analysisCard,
                                    styles[`${lightingAnalysis.severity}Card`]
                                ]}>
                                    <Ionicons
                                        name={lightingAnalysis.severity === 'error' ? 'warning' : 'information-circle'}
                                        size={24}
                                        color={lightingAnalysis.severity === 'error' ? '#EF4444' : '#3B82F6'}
                                    />
                                    <Text style={styles.analysisMessage}>{lightingAnalysis.message}</Text>
                                    <Text style={styles.analysisRecommendation}>{lightingAnalysis.recommendation}</Text>
                                </View>
                            </View>
                        )}
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
    guideCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    activeGuideCard: {
        borderColor: '#3B82F6',
        backgroundColor: '#EFF6FF',
    },
    guideHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    guideName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    guideDescription: {
        fontSize: 14,
        color: '#64748B',
    },
    lightingCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    lightingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    lightingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginLeft: 8,
    },
    analyzeButton: {
        backgroundColor: '#F59E0B',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    analyzeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sceneCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    sceneHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sceneTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginLeft: 8,
    },
    detectButton: {
        backgroundColor: '#8B5CF6',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    detectButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    detectedStyle: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 12,
    },
    styleName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    styleConfidence: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 8,
    },
    styleTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#E0E7FF',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 12,
        color: '#3730A3',
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
        padding: 20,
        width: '100%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    analysisCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    warningCard: {
        backgroundColor: '#FEF3C7',
        borderColor: '#F59E0B',
        borderWidth: 1,
    },
    errorCard: {
        backgroundColor: '#FEE2E2',
        borderColor: '#EF4444',
        borderWidth: 1,
    },
    infoCard: {
        backgroundColor: '#DBEAFE',
        borderColor: '#3B82F6',
        borderWidth: 1,
    },
    analysisMessage: {
        fontSize: 16,
        color: '#1E293B',
        marginLeft: 8,
        flex: 1,
        marginBottom: 8,
    },
    analysisRecommendation: {
        fontSize: 14,
        color: '#64748B',
        marginLeft: 32,
    },
});

export default CameraToolsScreen; 