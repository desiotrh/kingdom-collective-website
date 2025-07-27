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
    Image,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';

const { width, height } = Dimensions.get('window');

interface AIEnhancementTool {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'face' | 'background' | 'lighting' | 'creative' | 'video';
    intensity: number;
    isActive: boolean;
    options?: string[];
    faithMode?: {
        name: string;
        description: string;
    };
}

interface PhotoEnhancement {
    id: string;
    originalUrl: string;
    enhancedUrl: string;
    tools: AIEnhancementTool[];
    beforeAfter: boolean;
    faithMode?: {
        name: string;
        tools: AIEnhancementTool[];
    };
}

interface VideoEnhancement {
    id: string;
    originalUrl: string;
    enhancedUrl: string;
    tools: AIEnhancementTool[];
    duration: number;
    resolution: string;
}

const AIPhotographyEnhancementScreen: React.FC = () => {
    const { faithMode } = useFaithMode();
    const [enhancementTools, setEnhancementTools] = useState<AIEnhancementTool[]>([]);
    const [currentPhoto, setCurrentPhoto] = useState<PhotoEnhancement | null>(null);
    const [currentVideo, setCurrentVideo] = useState<VideoEnhancement | null>(null);
    const [showBeforeAfter, setShowBeforeAfter] = useState(false);
    const [showEnhancementModal, setShowEnhancementModal] = useState(false);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<'face' | 'background' | 'lighting' | 'creative' | 'video'>('face');
    const [showPoseSuggestions, setShowPoseSuggestions] = useState(false);
    const [showCompositionAssistant, setShowCompositionAssistant] = useState(false);
    const [voiceGuidedMode, setVoiceGuidedMode] = useState(false);

    const aiEnhancementTools: AIEnhancementTool[] = [
        // AI Face Retouching
        {
            id: 'face-retouching',
            name: faithMode ? 'Divine Beauty' : 'AI Face Retouching',
            description: faithMode
                ? 'Enhance natural beauty with gentle, loving care'
                : 'Smart skin smoothing, blemish removal, tone adjustment',
            icon: 'person',
            category: 'face',
            intensity: 50,
            isActive: false,
            options: ['Skin Smoothing', 'Blemish Removal', 'Tone Adjustment', 'Redness Reduction'],
            faithMode: {
                name: 'Divine Beauty',
                description: 'Enhance natural beauty with gentle, loving care'
            }
        },
        {
            id: 'teeth-whitening',
            name: faithMode ? 'Radiant Smile' : 'Teeth Whitening',
            description: faithMode
                ? 'Brighten smiles to reflect inner joy'
                : 'Natural teeth whitening and enhancement',
            icon: 'happy',
            category: 'face',
            intensity: 40,
            isActive: false,
            faithMode: {
                name: 'Radiant Smile',
                description: 'Brighten smiles to reflect inner joy'
            }
        },
        {
            id: 'eye-sharpening',
            name: faithMode ? 'Bright Eyes' : 'Eye Sharpening',
            description: faithMode
                ? 'Bring out the sparkle in eyes'
                : 'Enhance eye clarity and brightness',
            icon: 'eye',
            category: 'face',
            intensity: 35,
            isActive: false,
            faithMode: {
                name: 'Bright Eyes',
                description: 'Bring out the sparkle in eyes'
            }
        },
        {
            id: 'wrinkle-softening',
            name: faithMode ? 'Gentle Aging' : 'Wrinkle Softening',
            description: faithMode
                ? 'Respect natural aging while gentle enhancement'
                : 'Subtle wrinkle reduction while preserving character',
            icon: 'heart',
            category: 'face',
            intensity: 30,
            isActive: false,
            faithMode: {
                name: 'Gentle Aging',
                description: 'Respect natural aging while gentle enhancement'
            }
        },

        // AI Smile / Eye Swap
        {
            id: 'smile-swap',
            name: faithMode ? 'Joyful Expression' : 'AI Smile Swap',
            description: faithMode
                ? 'Generate natural smiles reflecting inner joy'
                : 'Replace closed eyes with open ones, generate smiles',
            icon: 'happy',
            category: 'face',
            intensity: 60,
            isActive: false,
            options: ['Subtle Smile', 'Big Smile', 'Natural Expression'],
            faithMode: {
                name: 'Joyful Expression',
                description: 'Generate natural smiles reflecting inner joy'
            }
        },
        {
            id: 'eye-swap',
            name: faithMode ? 'Bright Eyes' : 'AI Eye Swap',
            description: faithMode
                ? 'Open eyes to reveal inner light'
                : 'Replace closed eyes with open ones',
            icon: 'eye',
            category: 'face',
            intensity: 55,
            isActive: false,
            faithMode: {
                name: 'Bright Eyes',
                description: 'Open eyes to reveal inner light'
            }
        },

        // AI Head or Expression Swap
        {
            id: 'head-swap',
            name: faithMode ? 'Best Expression' : 'AI Head Swap',
            description: faithMode
                ? 'Choose the best expression from multiple shots'
                : 'Swap heads across photos, match lighting and angle',
            icon: 'swap-horizontal',
            category: 'face',
            intensity: 70,
            isActive: false,
            options: ['Best Headshot', 'Expression Match', 'Lighting Match'],
            faithMode: {
                name: 'Best Expression',
                description: 'Choose the best expression from multiple shots'
            }
        },

        // Face Slimming / Angle Correction
        {
            id: 'face-slimming',
            name: faithMode ? 'Natural Proportion' : 'Face Slimming',
            description: faithMode
                ? 'Enhance natural proportions with subtle adjustments'
                : 'Subtle face reshaping for flattering portraits',
            icon: 'resize',
            category: 'face',
            intensity: 25,
            isActive: false,
            faithMode: {
                name: 'Natural Proportion',
                description: 'Enhance natural proportions with subtle adjustments'
            }
        },
        {
            id: 'lens-distortion',
            name: faithMode ? 'Perfect Perspective' : 'Lens Distortion Correction',
            description: faithMode
                ? 'Correct perspective to show true beauty'
                : 'Fix wide angle distortion and perspective issues',
            icon: 'camera',
            category: 'face',
            intensity: 45,
            isActive: false,
            faithMode: {
                name: 'Perfect Perspective',
                description: 'Correct perspective to show true beauty'
            }
        },

        // Auto Background Cleanup
        {
            id: 'background-cleanup',
            name: faithMode ? 'Divine Cleanup' : 'Auto Background Cleanup',
            description: faithMode
                ? 'Remove distractions to focus on what matters'
                : 'Remove trash, people, cars with AI inpainting',
            icon: 'trash',
            category: 'background',
            intensity: 80,
            isActive: false,
            options: ['Remove Objects', 'Smart Fill', 'Context Aware'],
            faithMode: {
                name: 'Divine Cleanup',
                description: 'Remove distractions to focus on what matters'
            }
        },

        // AI Lighting Correction
        {
            id: 'lighting-correction',
            name: faithMode ? 'Perfect Light' : 'AI Lighting Correction',
            description: faithMode
                ? 'Perfect lighting to highlight God\'s creation'
                : 'Fix underexposed/blown-out images, simulate studio lighting',
            icon: 'sunny',
            category: 'lighting',
            intensity: 65,
            isActive: false,
            options: ['Exposure Fix', 'Studio Lighting', 'Natural Light Enhancement'],
            faithMode: {
                name: 'Perfect Light',
                description: 'Perfect lighting to highlight God\'s creation'
            }
        },

        // AI Video Enhancements
        {
            id: 'auto-color-grading',
            name: faithMode ? 'Cinematic Beauty' : 'Auto Color Grading',
            description: faithMode
                ? 'Create cinematic looks that tell stories'
                : 'Cinematic color profiles (ARRI, RED, A24, teal/orange)',
            icon: 'color-palette',
            category: 'video',
            intensity: 75,
            isActive: false,
            options: ['ARRI Look', 'RED Look', 'A24 Style', 'Teal/Orange', 'Custom'],
            faithMode: {
                name: 'Cinematic Beauty',
                description: 'Create cinematic looks that tell stories'
            }
        },
        {
            id: 'auto-reframe-stabilization',
            name: faithMode ? 'Steady Focus' : 'Auto Reframe & Stabilization',
            description: faithMode
                ? 'Keep focus steady on what matters most'
                : 'Crop and track subjects, AI stabilization',
            icon: 'crop',
            category: 'video',
            intensity: 70,
            isActive: false,
            options: ['Subject Tracking', 'Vertical Crop', 'Stabilization'],
            faithMode: {
                name: 'Steady Focus',
                description: 'Keep focus steady on what matters most'
            }
        },
        {
            id: 'lip-sync-fixer',
            name: faithMode ? 'Perfect Timing' : 'Lip Sync Fixer',
            description: faithMode
                ? 'Align audio perfectly with visual moments'
                : 'Fix misaligned audio in multicam edits',
            icon: 'mic',
            category: 'video',
            intensity: 85,
            isActive: false,
            faithMode: {
                name: 'Perfect Timing',
                description: 'Align audio perfectly with visual moments'
            }
        },
        {
            id: 'ai-subtitles',
            name: faithMode ? 'Clear Message' : 'AI Subtitles with Style',
            description: faithMode
                ? 'Make messages clear and beautiful'
                : 'Auto-transcribe with animated captions',
            icon: 'text',
            category: 'video',
            intensity: 60,
            isActive: false,
            options: ['Animated Captions', 'Brand Styling', 'Auto Transcription'],
            faithMode: {
                name: 'Clear Message',
                description: 'Make messages clear and beautiful'
            }
        },
        {
            id: 'eye-contact-adjuster',
            name: faithMode ? 'Direct Connection' : 'Video Eye Contact Adjuster',
            description: faithMode
                ? 'Create direct eye contact for authentic connection'
                : 'AI adjusts eyes to look directly into camera',
            icon: 'eye',
            category: 'video',
            intensity: 75,
            isActive: false,
            faithMode: {
                name: 'Direct Connection',
                description: 'Create direct eye contact for authentic connection'
            }
        },

        // Creative & Marketing Tools
        {
            id: 'product-mockup',
            name: faithMode ? 'Divine Design' : 'Product Mockup Generator',
            description: faithMode
                ? 'Show your designs in beautiful contexts'
                : 'AI replaces blank labels with your designs',
            icon: 'cube',
            category: 'creative',
            intensity: 80,
            isActive: false,
            options: ['Label Replacement', 'Context Matching', 'Brand Integration'],
            faithMode: {
                name: 'Divine Design',
                description: 'Show your designs in beautiful contexts'
            }
        },
        {
            id: 'thumbnail-composer',
            name: faithMode ? 'Perfect Preview' : 'Thumbnail Composer',
            description: faithMode
                ? 'Create perfect previews that draw attention'
                : 'Smart auto-crop, title overlay, color pop',
            icon: 'image',
            category: 'creative',
            intensity: 65,
            isActive: false,
            options: ['Auto Crop', 'Title Overlay', 'Color Pop', 'Brand Integration'],
            faithMode: {
                name: 'Perfect Preview',
                description: 'Create perfect previews that draw attention'
            }
        },
        {
            id: 'ai-avatar-generator',
            name: faithMode ? 'Digital Reflection' : 'AI Avatar/Digital Twin Generator',
            description: faithMode
                ? 'Create digital representations of your authentic self'
                : 'Use Fal.ai integration for creator branding',
            icon: 'person-circle',
            category: 'creative',
            intensity: 90,
            isActive: false,
            options: ['Fal.ai Integration', 'Custom Model', 'Brand Styling'],
            faithMode: {
                name: 'Digital Reflection',
                description: 'Create digital representations of your authentic self'
            }
        },
        {
            id: 'dynamic-templates',
            name: faithMode ? 'Inspired Templates' : 'Dynamic Templates',
            description: faithMode
                ? 'Create content that inspires and uplifts'
                : 'Auto-generate social media posts with trending styles',
            icon: 'layers',
            category: 'creative',
            intensity: 70,
            isActive: false,
            options: ['Carousel Posts', 'Reel Splits', 'Trending Styles'],
            faithMode: {
                name: 'Inspired Templates',
                description: 'Create content that inspires and uplifts'
            }
        },
    ];

    useEffect(() => {
        setEnhancementTools(aiEnhancementTools);
    }, [faithMode]);

    const toggleTool = (toolId: string) => {
        setEnhancementTools(prev =>
            prev.map(tool =>
                tool.id === toolId ? { ...tool, isActive: !tool.isActive } : tool
            )
        );
    };

    const updateIntensity = (toolId: string, value: number) => {
        setEnhancementTools(prev =>
            prev.map(tool =>
                tool.id === toolId ? { ...tool, intensity: value } : tool
            )
        );
    };

    const applyEnhancement = () => {
        const activeTools = enhancementTools.filter(tool => tool.isActive);
        if (activeTools.length === 0) {
            Alert.alert('No Tools Selected', 'Please select at least one enhancement tool.');
            return;
        }

        Alert.alert(
            faithMode ? 'Applying Divine Enhancement' : 'Applying AI Enhancement',
            `Processing ${activeTools.length} enhancement(s)...`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Simulate processing
                        setTimeout(() => {
                            Alert.alert(
                                'Enhancement Complete',
                                faithMode
                                    ? 'Your image has been enhanced with divine beauty!'
                                    : 'AI enhancement completed successfully!'
                            );
                        }, 2000);
                    }
                }
            ]
        );
    };

    const getFaithModeMessage = () => {
        if (!faithMode) return '';
        return 'Enhance your photography with AI tools that respect and celebrate natural beauty, guided by faith and love.';
    };

    const renderEnhancementTool = (tool: AIEnhancementTool) => (
        <TouchableOpacity
            key={tool.id}
            style={[
                styles.toolCard,
                tool.isActive && styles.toolCardActive,
                tool.category !== selectedCategory && styles.toolCardHidden
            ]}
            onPress={() => toggleTool(tool.id)}
        >
            <View style={styles.toolHeader}>
                <Ionicons
                    name={tool.icon as any}
                    size={24}
                    color={tool.isActive ? '#FFFFFF' : Colors.light.accent}
                />
                <View style={styles.toolInfo}>
                    <Text style={[
                        styles.toolName,
                        tool.isActive && styles.toolNameActive
                    ]}>
                        {faithMode && tool.faithMode ? tool.faithMode.name : tool.name}
                    </Text>
                    <Text style={[
                        styles.toolDescription,
                        tool.isActive && styles.toolDescriptionActive
                    ]}>
                        {faithMode && tool.faithMode ? tool.faithMode.description : tool.description}
                    </Text>
                </View>
                <Switch
                    value={tool.isActive}
                    onValueChange={() => toggleTool(tool.id)}
                    trackColor={{ false: '#E5E5E5', true: '#FFFFFF' }}
                    thumbColor={tool.isActive ? Colors.light.accent : '#666666'}
                />
            </View>

            {tool.isActive && (
                <View style={styles.toolControls}>
                    <Text style={styles.intensityLabel}>Intensity: {tool.intensity}%</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        value={tool.intensity}
                        onValueChange={(value) => updateIntensity(tool.id, value)}
                        minimumTrackTintColor={Colors.light.accent}
                        maximumTrackTintColor="#E5E5E5"
                        thumbStyle={styles.sliderThumb}
                    />
                    {tool.options && (
                        <View style={styles.optionsContainer}>
                            {tool.options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.optionButton}
                                    onPress={() => Alert.alert('Option Selected', option)}
                                >
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );

    const renderCategoryTabs = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
            {[
                { id: 'face', name: 'Face', icon: 'person' },
                { id: 'background', name: 'Background', icon: 'image' },
                { id: 'lighting', name: 'Lighting', icon: 'sunny' },
                { id: 'creative', name: 'Creative', icon: 'sparkles' },
                { id: 'video', name: 'Video', icon: 'videocam' },
            ].map(category => (
                <TouchableOpacity
                    key={category.id}
                    style={[
                        styles.categoryTab,
                        selectedCategory === category.id && styles.categoryTabActive
                    ]}
                    onPress={() => setSelectedCategory(category.id as any)}
                >
                    <Ionicons
                        name={category.icon as any}
                        size={20}
                        color={selectedCategory === category.id ? '#FFFFFF' : Colors.light.accent}
                    />
                    <Text style={[
                        styles.categoryTabText,
                        selectedCategory === category.id && styles.categoryTabTextActive
                    ]}>
                        {category.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderAIGuidanceTools = () => (
        <View style={styles.guidanceSection}>
            <Text style={styles.sectionTitle}>
                {faithMode ? 'Divine Guidance' : 'AI Guidance & Coaching'}
            </Text>

            <View style={styles.guidanceTools}>
                <TouchableOpacity
                    style={styles.guidanceTool}
                    onPress={() => setShowPoseSuggestions(true)}
                >
                    <Ionicons name="body" size={24} color={Colors.light.accent} />
                    <Text style={styles.guidanceToolName}>
                        {faithMode ? 'Pose Guidance' : 'Pose Suggestion Tool'}
                    </Text>
                    <Text style={styles.guidanceToolDescription}>
                        {faithMode
                            ? 'Get guidance for modest and beautiful poses'
                            : 'Real-time pose prompts for photo & video'
                        }
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.guidanceTool}
                    onPress={() => setShowCompositionAssistant(true)}
                >
                    <Ionicons name="grid" size={24} color={Colors.light.accent} />
                    <Text style={styles.guidanceToolName}>
                        {faithMode ? 'Divine Composition' : 'Shot Composition Assistant'}
                    </Text>
                    <Text style={styles.guidanceToolDescription}>
                        {faithMode
                            ? 'Perfect composition with divine proportions'
                            : 'Rule of thirds, golden ratio overlays'
                        }
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.guidanceTool}
                    onPress={() => setVoiceGuidedMode(!voiceGuidedMode)}
                >
                    <Ionicons name="mic" size={24} color={voiceGuidedMode ? '#28A745' : Colors.light.accent} />
                    <Text style={styles.guidanceToolName}>
                        {faithMode ? 'Voice-Guided Director' : 'Voice-Guided AI Director'}
                    </Text>
                    <Text style={styles.guidanceToolDescription}>
                        {faithMode
                            ? 'Speak to guide your photography with divine inspiration'
                            : 'Speak prompts to control camera settings'
                        }
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {faithMode ? 'Divine AI Enhancement' : 'AI Photography Enhancement'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {faithMode
                            ? 'Enhance your photography with AI tools that celebrate natural beauty and divine creation'
                            : 'Advanced AI tools for professional photography enhancement'
                        }
                    </Text>
                    {faithMode && (
                        <Text style={styles.faithMessage}>{getFaithModeMessage()}</Text>
                    )}
                </View>

                {renderCategoryTabs()}

                <View style={styles.toolsContainer}>
                    {enhancementTools
                        .filter(tool => tool.category === selectedCategory)
                        .map(renderEnhancementTool)
                    }
                </View>

                {renderAIGuidanceTools()}

                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={applyEnhancement}
                >
                    <LinearGradient
                        colors={[Colors.light.accent, '#4A90E2']}
                        style={styles.applyButtonGradient}
                    >
                        <Text style={styles.applyButtonText}>
                            {faithMode ? 'Apply Divine Enhancement' : 'Apply AI Enhancement'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>

            {/* Pose Suggestions Modal */}
            <Modal
                visible={showPoseSuggestions}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {faithMode ? 'Divine Pose Guidance' : 'Pose Suggestions'}
                        </Text>
                        <ScrollView style={styles.modalScrollView}>
                            {faithMode ? [
                                'Gentle prayer pose with hands together',
                                'Standing with arms open in gratitude',
                                'Sitting in quiet reflection',
                                'Walking in nature with joy',
                                'Family group in loving embrace'
                            ] : [
                                'Power pose for confidence',
                                'Natural candid expression',
                                'Elegant seated pose',
                                'Dynamic walking shot',
                                'Group composition tips'
                            ].map((pose, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.poseSuggestion}
                                    onPress={() => {
                                        Alert.alert('Pose Selected', pose);
                                        setShowPoseSuggestions(false);
                                    }}
                                >
                                    <Text style={styles.poseText}>{pose}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowPoseSuggestions(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Composition Assistant Modal */}
            <Modal
                visible={showCompositionAssistant}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {faithMode ? 'Divine Composition Guide' : 'Composition Assistant'}
                        </Text>
                        <ScrollView style={styles.modalScrollView}>
                            {[
                                'Rule of Thirds Overlay',
                                'Golden Ratio Spiral',
                                'Leading Lines Guide',
                                'Symmetry Grid',
                                'Depth of Field Calculator'
                            ].map((guide, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.compositionGuide}
                                    onPress={() => {
                                        Alert.alert('Guide Selected', guide);
                                        setShowCompositionAssistant(false);
                                    }}
                                >
                                    <Text style={styles.guideText}>{guide}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowCompositionAssistant(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.text,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 8,
    },
    faithMessage: {
        fontSize: 14,
        color: Colors.light.accent,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 8,
    },
    categoryTabs: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    categoryTab: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    categoryTabActive: {
        backgroundColor: Colors.light.accent,
        borderColor: Colors.light.accent,
    },
    categoryTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginLeft: 6,
    },
    categoryTabTextActive: {
        color: '#FFFFFF',
    },
    toolsContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    toolCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    toolCardActive: {
        backgroundColor: Colors.light.accent,
        borderColor: Colors.light.accent,
    },
    toolCardHidden: {
        display: 'none',
    },
    toolHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    toolInfo: {
        flex: 1,
        marginLeft: 12,
        marginRight: 12,
    },
    toolName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    toolNameActive: {
        color: '#FFFFFF',
    },
    toolDescription: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 18,
    },
    toolDescriptionActive: {
        color: '#FFFFFF',
        opacity: 0.9,
    },
    toolControls: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        paddingTop: 12,
    },
    intensityLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 12,
    },
    sliderThumb: {
        backgroundColor: Colors.light.accent,
        width: 20,
        height: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    optionButton: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    optionText: {
        fontSize: 12,
        color: Colors.light.text,
        fontWeight: '500',
    },
    guidanceSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 16,
    },
    guidanceTools: {
        gap: 12,
    },
    guidanceTool: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    guidanceToolName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 8,
        marginBottom: 4,
    },
    guidanceToolDescription: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 18,
    },
    applyButton: {
        marginHorizontal: 20,
        marginBottom: 24,
        borderRadius: 12,
        overflow: 'hidden',
    },
    applyButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 16,
        textAlign: 'center',
    },
    modalScrollView: {
        maxHeight: 300,
    },
    poseSuggestion: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    poseText: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 18,
    },
    compositionGuide: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    guideText: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 18,
    },
    closeButton: {
        backgroundColor: Colors.light.accent,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default AIPhotographyEnhancementScreen; 