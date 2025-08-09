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
    TextInput,
    Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import AIReflectModal from '../../../../packages/ui/AIReflectModal';
import { getReflectPrompts } from '../../../../packages/utils/valuesStyle';

const { width, height } = Dimensions.get('window');

interface WorkflowTool {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'preset' | 'batch' | 'voice' | 'prompt';
    isActive: boolean;
    options?: string[];
    faithMode?: {
        name: string;
        description: string;
    };
}

interface Preset {
    id: string;
    name: string;
    description: string;
    category: string;
    isCustom: boolean;
    settings: any;
}

interface VoiceNote {
    id: string;
    timestamp: Date;
    duration: number;
    text: string;
    photoIds: string[];
    category: string;
}

const AIWorkflowToolsScreen: React.FC = () => {
    const { faithMode } = useFaithMode();
    const [workflowTools, setWorkflowTools] = useState<WorkflowTool[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'preset' | 'batch' | 'voice' | 'prompt'>('preset');
    const [showPresetModal, setShowPresetModal] = useState(false);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const [showPromptModal, setShowPromptModal] = useState(false);
    const [voiceRecording, setVoiceRecording] = useState(false);
    const [presets, setPresets] = useState<Preset[]>([]);
    const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
    const [reflectVisible, setReflectVisible] = useState(false);
    const [reflectAfterVisible, setReflectAfterVisible] = useState(false);

    const workflowToolsData: WorkflowTool[] = [
        // Smart Preset Matching
        {
            id: 'smart-preset-matching',
            name: faithMode ? 'Divine Preset Matching' : 'Smart Preset Matching',
            description: faithMode
                ? 'Match your style to create consistent, beautiful presets'
                : 'Upload reference image → app creates matching preset',
            icon: 'color-palette',
            category: 'preset',
            isActive: false,
            options: ['Upload Reference', 'Create Preset', 'Save Custom', 'Sell Presets'],
            faithMode: {
                name: 'Divine Preset Matching',
                description: 'Match your style to create consistent, beautiful presets'
            }
        },
        {
            id: 'preset-gallery',
            name: faithMode ? 'Preset Collection' : 'Preset Gallery',
            description: faithMode
                ? 'Browse and apply beautiful presets that enhance natural beauty'
                : 'Browse and apply custom presets',
            icon: 'images',
            category: 'preset',
            isActive: false,
            options: ['Faith Mode Presets', 'Natural Beauty', 'Studio Lighting', 'Outdoor Portraits'],
            faithMode: {
                name: 'Preset Collection',
                description: 'Browse and apply beautiful presets that enhance natural beauty'
            }
        },

        // Batch Editing
        {
            id: 'batch-editing',
            name: faithMode ? 'Batch Blessing' : 'Batch Editing with AI',
            description: faithMode
                ? 'Enhance multiple photos with consistent, loving care'
                : 'Adjust multiple photos based on best shot in set',
            icon: 'layers',
            category: 'batch',
            isActive: false,
            options: ['Select Best Shot', 'Apply to All', 'Custom Adjustments', 'Export Options'],
            faithMode: {
                name: 'Batch Blessing',
                description: 'Enhance multiple photos with consistent, loving care'
            }
        },
        {
            id: 'ai-crop-recommendations',
            name: faithMode ? 'Divine Cropping' : 'AI Crop Recommendations',
            description: faithMode
                ? 'Get AI suggestions for perfect composition and cropping'
                : 'AI recommends crops, presets, export sizes',
            icon: 'crop',
            category: 'batch',
            isActive: false,
            options: ['Auto Crop', 'Composition Guide', 'Export Sizes', 'Social Media'],
            faithMode: {
                name: 'Divine Cropping',
                description: 'Get AI suggestions for perfect composition and cropping'
            }
        },

        // Voice Note Integration
        {
            id: 'voice-notes',
            name: faithMode ? 'Voice Blessings' : 'Voice Note Integration',
            description: faithMode
                ? 'Record notes during shoots, tag to photos for client sessions'
                : 'Record notes during a shoot, tag to photos',
            icon: 'mic',
            category: 'voice',
            isActive: false,
            options: ['Record Note', 'Tag Photos', 'Transcribe', 'Organize'],
            faithMode: {
                name: 'Voice Blessings',
                description: 'Record notes during shoots, tag to photos for client sessions'
            }
        },
        {
            id: 'voice-to-text',
            name: faithMode ? 'Divine Transcription' : 'Voice-to-Text',
            description: faithMode
                ? 'Convert your voice notes to text with divine clarity'
                : 'Convert voice notes to searchable text',
            icon: 'text',
            category: 'voice',
            isActive: false,
            options: ['Auto Transcribe', 'Edit Text', 'Search Notes', 'Export'],
            faithMode: {
                name: 'Divine Transcription',
                description: 'Convert your voice notes to text with divine clarity'
            }
        },

        // AI Prompt Gallery
        {
            id: 'ai-prompt-gallery',
            name: faithMode ? 'Divine Prompts' : 'AI Prompt Gallery',
            description: faithMode
                ? 'Faith-based prompts for capturing moments of beauty and grace'
                : 'Curated prompts for different types of shoots',
            icon: 'bulb',
            category: 'prompt',
            isActive: false,
            options: ['Faith Mode', 'Portrait Prompts', 'Event Prompts', 'Custom'],
            faithMode: {
                name: 'Divine Prompts',
                description: 'Faith-based prompts for capturing moments of beauty and grace'
            }
        },
        {
            id: 'prompt-categories',
            name: faithMode ? 'Prompt Categories' : 'Prompt Categories',
            description: faithMode
                ? 'Organized prompts for different types of photography'
                : 'Organized prompts for different shoot types',
            icon: 'folder',
            category: 'prompt',
            isActive: false,
            options: ['Portraits', 'Events', 'Nature', 'Studio', 'Custom'],
            faithMode: {
                name: 'Prompt Categories',
                description: 'Organized prompts for different types of photography'
            }
        },
    ];

    const faithModePrompts = [
        'Capture moment of quiet prayer',
        'Show inner peace and joy',
        'Highlight natural beauty with grace',
        'Capture family love and connection',
        'Show gratitude and thankfulness',
        'Capture moments of worship',
        'Highlight God\'s creation in nature',
        'Show modesty and dignity',
        'Capture moments of service and love',
        'Show hope and faith in expression'
    ];

    const cleanModePrompts = [
        'Capture power pose in golden hour light',
        'Show confidence and strength',
        'Highlight natural beauty',
        'Capture authentic emotion',
        'Show connection and intimacy',
        'Capture movement and energy',
        'Highlight environmental portraits',
        'Show personality and character',
        'Capture candid moments',
        'Show artistic composition'
    ];

    useEffect(() => {
        setWorkflowTools(workflowToolsData);
    }, [faithMode]);

    const toggleTool = (toolId: string) => {
        setWorkflowTools(prev =>
            prev.map(tool =>
                tool.id === toolId ? { ...tool, isActive: !tool.isActive } : tool
            )
        );
    };

    const startVoiceRecording = () => {
        setVoiceRecording(true);
        Alert.alert(
            'Voice Recording Started',
            'Tap to stop recording when finished.',
            [
                {
                    text: 'Stop Recording',
                    onPress: () => {
                        setVoiceRecording(false);
                        const newNote: VoiceNote = {
                            id: `note_${Date.now()}`,
                            timestamp: new Date(),
                            duration: Math.floor(Math.random() * 60) + 10,
                            text: 'Sample voice note transcription...',
                            photoIds: [],
                            category: 'general'
                        };
                        setVoiceNotes(prev => [newNote, ...prev]);
                        Alert.alert('Voice Note Saved', 'Your voice note has been saved and transcribed.');
                    }
                }
            ]
        );
    };

    const createPreset = () => {
        setReflectVisible(true);
    };

    const doCreatePreset = () => {
        Alert.alert(
            'Create Preset',
            'Upload a reference image to create a matching preset.',
            [
                {
                    text: 'Upload Image', onPress: () => {
                        // Simulate preset creation
                        setTimeout(() => {
                            const newPreset: Preset = {
                                id: `preset_${Date.now()}`,
                                name: faithMode ? 'Divine Beauty Preset' : 'Custom Preset',
                                description: faithMode ? 'Enhances natural beauty with grace' : 'Custom color grading preset',
                                category: faithMode ? 'faith' : 'custom',
                                isCustom: true,
                                settings: {}
                            };
                            setPresets(prev => [newPreset, ...prev]);
                            Alert.alert('Preset Created', 'Your custom preset has been created and saved.');
                        }, 2000);
                    }
                },
                { text: 'Cancel' }
            ]
        );
    };

    const renderWorkflowTool = (tool: WorkflowTool) => (
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

            {tool.isActive && tool.options && (
                <View style={styles.optionsContainer}>
                    {tool.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.optionButton}
                            onPress={() => {
                                if (tool.id === 'voice-notes') {
                                    startVoiceRecording();
                                } else if (tool.id === 'smart-preset-matching') {
                                    createPreset();
                                } else {
                                    Alert.alert('Option Selected', option);
                                }
                            }}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );

    const renderCategoryTabs = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
            {[
                { id: 'preset', name: 'Presets', icon: 'color-palette' },
                { id: 'batch', name: 'Batch', icon: 'layers' },
                { id: 'voice', name: 'Voice', icon: 'mic' },
                { id: 'prompt', name: 'Prompts', icon: 'bulb' },
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

    const renderVoiceNotes = () => (
        <View style={styles.voiceNotesSection}>
            <Text style={styles.sectionTitle}>
                {faithMode ? 'Voice Blessings' : 'Voice Notes'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {voiceNotes.map((note) => (
                    <TouchableOpacity
                        key={note.id}
                        style={styles.voiceNoteCard}
                        onPress={() => Alert.alert('Voice Note', note.text)}
                    >
                        <Ionicons name="mic" size={20} color={Colors.light.accent} />
                        <Text style={styles.voiceNoteTime}>
                            {note.timestamp.toLocaleTimeString()}
                        </Text>
                        <Text style={styles.voiceNoteDuration}>
                            {note.duration}s
                        </Text>
                        <Text style={styles.voiceNoteText} numberOfLines={2}>
                            {note.text}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderPresets = () => (
        <View style={styles.presetsSection}>
            <Text style={styles.sectionTitle}>
                {faithMode ? 'Divine Presets' : 'Custom Presets'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {presets.map((preset) => (
                    <TouchableOpacity
                        key={preset.id}
                        style={styles.presetCard}
                        onPress={() => Alert.alert('Apply Preset', `Applying ${preset.name}`)}
                    >
                        <Ionicons name="color-palette" size={20} color={Colors.light.accent} />
                        <Text style={styles.presetName}>{preset.name}</Text>
                        <Text style={styles.presetDescription} numberOfLines={2}>
                            {preset.description}
                        </Text>
                        {preset.isCustom && (
                            <Text style={styles.customBadge}>Custom</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderPromptGallery = () => (
        <View style={styles.promptSection}>
            <Text style={styles.sectionTitle}>
                {faithMode ? 'Divine Prompts' : 'AI Prompt Gallery'}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {(faithMode ? faithModePrompts : cleanModePrompts).map((prompt, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.promptCard}
                        onPress={() => Alert.alert('Prompt Selected', prompt)}
                    >
                        <Ionicons name="bulb" size={20} color={Colors.light.accent} />
                        <Text style={styles.promptText}>{prompt}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {faithMode ? 'Divine Workflow Tools' : 'AI Workflow Tools'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {faithMode
                            ? 'Streamline your photography workflow with AI tools that enhance your creative process'
                            : 'Advanced AI tools to streamline your photography workflow'
                        }
                    </Text>
                </View>

                {renderCategoryTabs()}

                <View style={styles.toolsContainer}>
                    {workflowTools
                        .filter(tool => tool.category === selectedCategory)
                        .map(renderWorkflowTool)
                    }
                </View>

                {selectedCategory === 'voice' && renderVoiceNotes()}
                {selectedCategory === 'preset' && renderPresets()}
                {selectedCategory === 'prompt' && renderPromptGallery()}

                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => Alert.alert('Workflow Applied', 'Your workflow tools have been applied successfully!')}
                >
                    <LinearGradient
                        colors={[Colors.light.accent, '#4A90E2']}
                        style={styles.applyButtonGradient}
                    >
                        <Text style={styles.applyButtonText}>
                            {faithMode ? 'Apply Divine Workflow' : 'Apply Workflow Tools'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
            <AIReflectModal
              visible={reflectVisible}
              beforePrompts={getReflectPrompts(faithMode).before}
              onSkip={() => { setReflectVisible(false); doCreatePreset(); }}
              onConfirm={() => { setReflectVisible(false); doCreatePreset(); }}
            />
            <AIReflectModal
              visible={reflectAfterVisible}
              variant="after"
              prompts={getReflectPrompts(faithMode).after}
              faithToggleAvailable={faithMode}
              onFaithToggleChange={() => {}}
              onSkip={() => { setReflectAfterVisible(false); }}
              onConfirm={() => { setReflectAfterVisible(false); }}
            />
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
    voiceNotesSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    presetsSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    promptSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 16,
    },
    voiceNoteCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginRight: 16,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    voiceNoteTime: {
        fontSize: 12,
        color: Colors.light.text,
        marginTop: 4,
    },
    voiceNoteDuration: {
        fontSize: 12,
        color: Colors.light.accent,
        marginTop: 2,
    },
    voiceNoteText: {
        fontSize: 14,
        color: Colors.light.text,
        marginTop: 8,
        lineHeight: 18,
    },
    presetCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginRight: 16,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    presetName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 8,
        marginBottom: 4,
    },
    presetDescription: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 18,
    },
    customBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.light.accent,
        marginTop: 8,
    },
    promptCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    promptText: {
        fontSize: 14,
        color: Colors.light.text,
        marginLeft: 12,
        flex: 1,
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
});

export default AIWorkflowToolsScreen; 