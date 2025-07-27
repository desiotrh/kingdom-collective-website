import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    Modal,
    TextInput,
    PanGestureHandler,
    State,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    runOnJS,
    withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface FunnelStep {
    id: string;
    type: 'lead_magnet' | 'offer' | 'upsell' | 'thank_you' | 'checkout' | 'email_capture';
    title: string;
    description: string;
    position: { x: number; y: number };
    connections: string[];
    settings: {
        emailRequired?: boolean;
        paymentRequired?: boolean;
        redirectUrl?: string;
        template?: string;
    };
}

interface FunnelTemplate {
    id: string;
    name: string;
    description: string;
    steps: FunnelStep[];
    category: 'faith' | 'business' | 'course' | 'product';
    isCustom: boolean;
}

const FunnelBuilderScreen: React.FC = () => {
    const [funnels, setFunnels] = useState<FunnelTemplate[]>([]);
    const [currentFunnel, setCurrentFunnel] = useState<FunnelTemplate | null>(null);
    const [selectedStep, setSelectedStep] = useState<FunnelStep | null>(null);
    const [showStepModal, setShowStepModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [newFunnelName, setNewFunnelName] = useState('');
    const [draggedStep, setDraggedStep] = useState<FunnelStep | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: width - 40, height: height * 0.6 });

    // Pre-built templates
    const defaultTemplates: FunnelTemplate[] = [
        {
            id: 'faith-course',
            name: 'Faith-Based Course Funnel',
            description: 'Lead magnet → Course offer → Upsell → Thank you',
            category: 'faith',
            isCustom: false,
            steps: [
                {
                    id: 'step1',
                    type: 'lead_magnet',
                    title: 'Free Prayer Guide',
                    description: 'Download our 7-day prayer guide',
                    position: { x: 50, y: 50 },
                    connections: ['step2'],
                    settings: { emailRequired: true, template: 'prayer_guide' }
                },
                {
                    id: 'step2',
                    type: 'offer',
                    title: 'Kingdom Business Course',
                    description: 'Learn to build a business with Kingdom values',
                    position: { x: 250, y: 50 },
                    connections: ['step3'],
                    settings: { paymentRequired: true, template: 'course_offer' }
                },
                {
                    id: 'step3',
                    type: 'upsell',
                    title: '1:1 Coaching Session',
                    description: 'Get personalized guidance for your business',
                    position: { x: 450, y: 50 },
                    connections: ['step4'],
                    settings: { paymentRequired: true, template: 'coaching_upsell' }
                },
                {
                    id: 'step4',
                    type: 'thank_you',
                    title: 'Welcome to the Kingdom!',
                    description: 'Thank you for your purchase',
                    position: { x: 650, y: 50 },
                    connections: [],
                    settings: { template: 'faith_thank_you' }
                }
            ]
        },
        {
            id: 'product-launch',
            name: 'Product Launch Funnel',
            description: 'Email capture → Product offer → Upsell → Thank you',
            category: 'business',
            isCustom: false,
            steps: [
                {
                    id: 'step1',
                    type: 'email_capture',
                    title: 'Get Early Access',
                    description: 'Be the first to know when we launch',
                    position: { x: 50, y: 50 },
                    connections: ['step2'],
                    settings: { emailRequired: true, template: 'early_access' }
                },
                {
                    id: 'step2',
                    type: 'offer',
                    title: 'Product Launch',
                    description: 'Limited time offer - 50% off!',
                    position: { x: 250, y: 50 },
                    connections: ['step3'],
                    settings: { paymentRequired: true, template: 'product_launch' }
                },
                {
                    id: 'step3',
                    type: 'upsell',
                    title: 'Premium Bundle',
                    description: 'Get the complete package with bonuses',
                    position: { x: 450, y: 50 },
                    connections: ['step4'],
                    settings: { paymentRequired: true, template: 'premium_bundle' }
                },
                {
                    id: 'step4',
                    type: 'thank_you',
                    title: 'Thank You!',
                    description: 'Your order is confirmed',
                    position: { x: 650, y: 50 },
                    connections: [],
                    settings: { template: 'order_confirmation' }
                }
            ]
        }
    ];

    const stepTypes = [
        { type: 'lead_magnet', icon: 'gift', label: 'Lead Magnet', color: '#4CAF50' },
        { type: 'email_capture', icon: 'mail', label: 'Email Capture', color: '#2196F3' },
        { type: 'offer', icon: 'card', label: 'Offer', color: '#FF9800' },
        { type: 'checkout', icon: 'cart', label: 'Checkout', color: '#9C27B0' },
        { type: 'upsell', icon: 'trending-up', label: 'Upsell', color: '#F44336' },
        { type: 'thank_you', icon: 'heart', label: 'Thank You', color: '#E91E63' }
    ];

    const getStepIcon = (type: string) => {
        const stepType = stepTypes.find(st => st.type === type);
        return stepType?.icon || 'help-circle';
    };

    const getStepColor = (type: string) => {
        const stepType = stepTypes.find(st => st.type === type);
        return stepType?.color || '#9E9E9E';
    };

    const createNewFunnel = () => {
        if (!newFunnelName.trim()) {
            Alert.alert('Error', 'Please enter a funnel name');
            return;
        }

        const newFunnel: FunnelTemplate = {
            id: Date.now().toString(),
            name: newFunnelName,
            description: 'Custom funnel',
            category: 'business',
            isCustom: true,
            steps: []
        };

        setFunnels([...funnels, newFunnel]);
        setCurrentFunnel(newFunnel);
        setNewFunnelName('');
        setShowTemplateModal(false);
    };

    const duplicateFunnel = (template: FunnelTemplate) => {
        const duplicated: FunnelTemplate = {
            ...template,
            id: Date.now().toString(),
            name: `${template.name} (Copy)`,
            isCustom: true,
            steps: template.steps.map(step => ({
                ...step,
                id: `${step.id}_${Date.now()}`,
                connections: []
            }))
        };

        setFunnels([...funnels, duplicated]);
        setCurrentFunnel(duplicated);
        setShowTemplateModal(false);
    };

    const addStep = (type: string) => {
        if (!currentFunnel) return;

        const newStep: FunnelStep = {
            id: `step_${Date.now()}`,
            type: type as any,
            title: `New ${type.replace('_', ' ')}`,
            description: `Add description for ${type.replace('_', ' ')}`,
            position: { x: 50 + (currentFunnel.steps.length * 200), y: 50 },
            connections: [],
            settings: {}
        };

        const updatedFunnel = {
            ...currentFunnel,
            steps: [...currentFunnel.steps, newStep]
        };

        setCurrentFunnel(updatedFunnel);
        setFunnels(funnels.map(f => f.id === currentFunnel.id ? updatedFunnel : f));
    };

    const updateStep = (stepId: string, updates: Partial<FunnelStep>) => {
        if (!currentFunnel) return;

        const updatedSteps = currentFunnel.steps.map(step =>
            step.id === stepId ? { ...step, ...updates } : step
        );

        const updatedFunnel = { ...currentFunnel, steps: updatedSteps };
        setCurrentFunnel(updatedFunnel);
        setFunnels(funnels.map(f => f.id === currentFunnel.id ? updatedFunnel : f));
    };

    const deleteStep = (stepId: string) => {
        if (!currentFunnel) return;

        const updatedSteps = currentFunnel.steps.filter(step => step.id !== stepId);
        const updatedFunnel = { ...currentFunnel, steps: updatedSteps };
        setCurrentFunnel(updatedFunnel);
        setFunnels(funnels.map(f => f.id === currentFunnel.id ? updatedFunnel : f));
    };

    const connectSteps = (fromStepId: string, toStepId: string) => {
        if (!currentFunnel) return;

        const updatedSteps = currentFunnel.steps.map(step => {
            if (step.id === fromStepId) {
                return { ...step, connections: [...step.connections, toStepId] };
            }
            return step;
        });

        const updatedFunnel = { ...currentFunnel, steps: updatedSteps };
        setCurrentFunnel(updatedFunnel);
        setFunnels(funnels.map(f => f.id === currentFunnel.id ? updatedFunnel : f));
    };

    const saveFunnel = () => {
        if (!currentFunnel) return;

        const updatedFunnels = funnels.map(f =>
            f.id === currentFunnel.id ? currentFunnel : f
        );
        setFunnels(updatedFunnels);
        Alert.alert('Success', 'Funnel saved successfully!');
    };

    const renderStep = (step: FunnelStep) => {
        const translateX = useSharedValue(step.position.x);
        const translateY = useSharedValue(step.position.y);

        const animatedStyle = useAnimatedStyle(() => {
            return {
                transform: [
                    { translateX: translateX.value },
                    { translateY: translateY.value }
                ]
            };
        });

        const gestureHandler = useAnimatedGestureHandler({
            onStart: (_, context: any) => {
                context.startX = translateX.value;
                context.startY = translateY.value;
            },
            onActive: (event, context) => {
                translateX.value = context.startX + event.translationX;
                translateY.value = context.startY + event.translationY;
            },
            onEnd: () => {
                runOnJS(updateStep)(step.id, {
                    position: { x: translateX.value, y: translateY.value }
                });
            }
        });

        return (
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[styles.step, animatedStyle, { backgroundColor: getStepColor(step.type) }]}>
                    <TouchableOpacity
                        style={styles.stepContent}
                        onPress={() => {
                            setSelectedStep(step);
                            setShowStepModal(true);
                        }}
                    >
                        <Ionicons name={getStepIcon(step.type) as any} size={24} color="#fff" />
                        <Text style={styles.stepTitle}>{step.title}</Text>
                        <Text style={styles.stepDescription}>{step.description}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteStep(step.id)}
                    >
                        <Ionicons name="close-circle" size={20} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>
            </PanGestureHandler>
        );
    };

    const renderConnections = () => {
        if (!currentFunnel) return null;

        return currentFunnel.steps.map(step =>
            step.connections.map(connectionId => {
                const toStep = currentFunnel.steps.find(s => s.id === connectionId);
                if (!toStep) return null;

                const startX = step.position.x + 100;
                const startY = step.position.y + 50;
                const endX = toStep.position.x;
                const endY = toStep.position.y + 50;

                return (
                    <View
                        key={`${step.id}-${connectionId}`}
                        style={[
                            styles.connection,
                            {
                                left: startX,
                                top: startY,
                                width: endX - startX,
                                height: 2
                            }
                        ]}
                    />
                );
            })
        );
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>🎯 Funnel Builder</Text>
                <Text style={styles.headerSubtitle}>Create high-converting sales funnels</Text>
            </LinearGradient>

            <ScrollView style={styles.content}>
                {/* Template Selection */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>📋 Funnel Templates</Text>
                        <TouchableOpacity
                            style={styles.newButton}
                            onPress={() => setShowTemplateModal(true)}
                        >
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.newButtonText}>New Funnel</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateScroll}>
                        {defaultTemplates.map(template => (
                            <TouchableOpacity
                                key={template.id}
                                style={styles.templateCard}
                                onPress={() => duplicateFunnel(template)}
                            >
                                <Text style={styles.templateName}>{template.name}</Text>
                                <Text style={styles.templateDescription}>{template.description}</Text>
                                <View style={styles.templateMeta}>
                                    <Text style={styles.templateSteps}>{template.steps.length} steps</Text>
                                    <Text style={styles.templateCategory}>{template.category}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Current Funnel */}
                {currentFunnel && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>🎨 {currentFunnel.name}</Text>
                            <TouchableOpacity style={styles.saveButton} onPress={saveFunnel}>
                                <Ionicons name="save" size={20} color="#fff" />
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Canvas */}
                        <View style={[styles.canvas, { width: canvasSize.width, height: canvasSize.height }]}>
                            {renderConnections()}
                            {currentFunnel.steps.map(renderStep)}
                        </View>

                        {/* Step Types */}
                        <View style={styles.stepTypes}>
                            <Text style={styles.stepTypesTitle}>Add Steps:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {stepTypes.map(stepType => (
                                    <TouchableOpacity
                                        key={stepType.type}
                                        style={[styles.stepTypeButton, { backgroundColor: stepType.color }]}
                                        onPress={() => addStep(stepType.type)}
                                    >
                                        <Ionicons name={stepType.icon as any} size={20} color="#fff" />
                                        <Text style={styles.stepTypeLabel}>{stepType.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}

                {/* Step Configuration Modal */}
                <Modal
                    visible={showStepModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowStepModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            {selectedStep && (
                                <>
                                    <Text style={styles.modalTitle}>Configure Step</Text>

                                    <Text style={styles.inputLabel}>Title</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={selectedStep.title}
                                        onChangeText={(text) => updateStep(selectedStep.id, { title: text })}
                                        placeholder="Step title"
                                    />

                                    <Text style={styles.inputLabel}>Description</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={selectedStep.description}
                                        onChangeText={(text) => updateStep(selectedStep.id, { description: text })}
                                        placeholder="Step description"
                                        multiline
                                    />

                                    <View style={styles.settingRow}>
                                        <Text style={styles.settingLabel}>Email Required</Text>
                                        <TouchableOpacity
                                            style={[
                                                styles.toggle,
                                                { backgroundColor: selectedStep.settings.emailRequired ? '#4CAF50' : '#ccc' }
                                            ]}
                                            onPress={() => updateStep(selectedStep.id, {
                                                settings: { ...selectedStep.settings, emailRequired: !selectedStep.settings.emailRequired }
                                            })}
                                        >
                                            <Ionicons
                                                name={selectedStep.settings.emailRequired ? 'checkmark' : 'close'}
                                                size={16}
                                                color="#fff"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.settingRow}>
                                        <Text style={styles.settingLabel}>Payment Required</Text>
                                        <TouchableOpacity
                                            style={[
                                                styles.toggle,
                                                { backgroundColor: selectedStep.settings.paymentRequired ? '#4CAF50' : '#ccc' }
                                            ]}
                                            onPress={() => updateStep(selectedStep.id, {
                                                settings: { ...selectedStep.settings, paymentRequired: !selectedStep.settings.paymentRequired }
                                            })}
                                        >
                                            <Ionicons
                                                name={selectedStep.settings.paymentRequired ? 'checkmark' : 'close'}
                                                size={16}
                                                color="#fff"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setShowStepModal(false)}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>

                {/* New Funnel Modal */}
                <Modal
                    visible={showTemplateModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowTemplateModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create New Funnel</Text>

                            <Text style={styles.inputLabel}>Funnel Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newFunnelName}
                                onChangeText={setNewFunnelName}
                                placeholder="Enter funnel name"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createNewFunnel}
                                >
                                    <Text style={styles.modalButtonText}>Create</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowTemplateModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    newButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    newButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    templateScroll: {
        marginBottom: 8,
    },
    templateCard: {
        width: 200,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    templateName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    templateDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    templateMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    templateSteps: {
        fontSize: 12,
        color: '#999',
    },
    templateCategory: {
        fontSize: 12,
        color: '#999',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    canvas: {
        backgroundColor: '#f8f9fa',
        borderWidth: 2,
        borderColor: '#e9ecef',
        borderStyle: 'dashed',
        borderRadius: 8,
        position: 'relative',
        marginBottom: 16,
    },
    step: {
        position: 'absolute',
        width: 120,
        height: 80,
        borderRadius: 8,
        padding: 8,
    },
    stepContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginTop: 4,
    },
    stepDescription: {
        fontSize: 10,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.9,
    },
    deleteButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#f44336',
        borderRadius: 10,
    },
    connection: {
        position: 'absolute',
        backgroundColor: '#666',
        borderRadius: 1,
    },
    stepTypes: {
        marginTop: 16,
    },
    stepTypesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    stepTypeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 8,
    },
    stepTypeLabel: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    settingLabel: {
        fontSize: 16,
        color: '#333',
    },
    toggle: {
        width: 40,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default FunnelBuilderScreen; 