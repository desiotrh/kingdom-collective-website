import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    TextInput,
    Switch,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface EducationModule {
    id: string;
    title: string;
    description: string;
    category: 'launch' | 'business' | 'faith' | 'marketing' | 'technical';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number; // in minutes
    isCompleted: boolean;
    progress: number; // 0-100
    lessons: Lesson[];
    createdAt: Date;
}

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'text' | 'quiz' | 'exercise';
    duration: number;
    isCompleted: boolean;
    content: string;
}

interface LaunchBuilder {
    id: string;
    name: string;
    phase: 'planning' | 'prelaunch' | 'launch' | 'postlaunch';
    steps: LaunchStep[];
    targetDate: Date;
    isActive: boolean;
    progress: number;
}

interface LaunchStep {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    dueDate?: Date;
    category: 'content' | 'marketing' | 'technical' | 'spiritual';
}

interface CoachingFeedback {
    id: string;
    type: 'launch' | 'copy' | 'campaign' | 'spiritual';
    content: string;
    feedback: string;
    score: number; // 1-10
    suggestions: string[];
}

const LaunchEducationCenterScreen: React.FC = () => {
    const [modules, setModules] = useState<EducationModule[]>([]);
    const [launchBuilders, setLaunchBuilders] = useState<LaunchBuilder[]>([]);
    const [coachingFeedback, setCoachingFeedback] = useState<CoachingFeedback[]>([]);
    const [selectedTab, setSelectedTab] = useState<'education' | 'builder' | 'coaching'>('education');
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showBuilderModal, setShowBuilderModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedModule, setSelectedModule] = useState<EducationModule | null>(null);
    const [newModule, setNewModule] = useState<Partial<EducationModule>>({});
    const [newBuilder, setNewBuilder] = useState<Partial<LaunchBuilder>>({});
    const [feedbackContent, setFeedbackContent] = useState('');
    const [feedbackType, setFeedbackType] = useState<'launch' | 'copy' | 'campaign' | 'spiritual'>('launch');

    // Mock data
    useEffect(() => {
        setModules([
            {
                id: '1',
                title: 'Launch Mastery Fundamentals',
                description: 'Learn the core principles of successful product launches',
                category: 'launch',
                difficulty: 'beginner',
                duration: 120,
                isCompleted: false,
                progress: 65,
                lessons: [
                    {
                        id: '1',
                        title: 'Understanding Your Market',
                        type: 'video',
                        duration: 15,
                        isCompleted: true,
                        content: 'Learn how to identify and understand your target audience'
                    },
                    {
                        id: '2',
                        title: 'Creating Your Offer',
                        type: 'text',
                        duration: 20,
                        isCompleted: true,
                        content: 'How to craft compelling offers that convert'
                    },
                    {
                        id: '3',
                        title: 'Launch Timeline Planning',
                        type: 'exercise',
                        duration: 30,
                        isCompleted: false,
                        content: 'Plan your launch timeline step by step'
                    }
                ],
                createdAt: new Date('2024-01-01')
            },
            {
                id: '2',
                title: 'Faith-Based Business Growth',
                description: 'Integrate your faith with business growth strategies',
                category: 'faith',
                difficulty: 'intermediate',
                duration: 90,
                isCompleted: false,
                progress: 30,
                lessons: [
                    {
                        id: '4',
                        title: 'Kingdom Business Principles',
                        type: 'video',
                        duration: 25,
                        isCompleted: true,
                        content: 'Biblical principles for business success'
                    },
                    {
                        id: '5',
                        title: 'Prayer in Business',
                        type: 'text',
                        duration: 15,
                        isCompleted: false,
                        content: 'How to incorporate prayer into your business decisions'
                    }
                ],
                createdAt: new Date('2024-01-05')
            }
        ]);

        setLaunchBuilders([
            {
                id: '1',
                name: 'Course Launch 2024',
                phase: 'planning',
                steps: [
                    {
                        id: '1',
                        title: 'Market Research',
                        description: 'Research your target audience and competitors',
                        isCompleted: true,
                        category: 'marketing'
                    },
                    {
                        id: '2',
                        title: 'Content Creation',
                        description: 'Create your course content and materials',
                        isCompleted: false,
                        category: 'content'
                    },
                    {
                        id: '3',
                        title: 'Prayer and Preparation',
                        description: 'Spend time in prayer for guidance',
                        isCompleted: false,
                        category: 'spiritual'
                    }
                ],
                targetDate: new Date('2024-03-01'),
                isActive: true,
                progress: 33
            }
        ]);

        setCoachingFeedback([
            {
                id: '1',
                type: 'launch',
                content: 'I want to launch a faith-based business course for $197',
                feedback: 'Great idea! Consider adding a payment plan option and creating urgency with limited-time bonuses.',
                score: 8,
                suggestions: [
                    'Add 3 payment plan options',
                    'Include 30-day money-back guarantee',
                    'Create limited-time bonus content',
                    'Add testimonial section'
                ]
            }
        ]);
    }, []);

    const createModule = () => {
        if (!newModule.title || !newModule.description) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const module: EducationModule = {
            id: Date.now().toString(),
            title: newModule.title,
            description: newModule.description,
            category: newModule.category || 'launch',
            difficulty: newModule.difficulty || 'beginner',
            duration: newModule.duration || 60,
            isCompleted: false,
            progress: 0,
            lessons: [],
            createdAt: new Date()
        };

        setModules([...modules, module]);
        setNewModule({});
        setShowModuleModal(false);
        Alert.alert('Success', 'Education module created successfully!');
    };

    const createLaunchBuilder = () => {
        if (!newBuilder.name || !newBuilder.targetDate) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const builder: LaunchBuilder = {
            id: Date.now().toString(),
            name: newBuilder.name,
            phase: 'planning',
            steps: [
                {
                    id: '1',
                    title: 'Market Research',
                    description: 'Research your target audience and competitors',
                    isCompleted: false,
                    category: 'marketing'
                },
                {
                    id: '2',
                    title: 'Content Creation',
                    description: 'Create your product or service content',
                    isCompleted: false,
                    category: 'content'
                },
                {
                    id: '3',
                    title: 'Spiritual Preparation',
                    description: 'Pray and seek guidance for your launch',
                    isCompleted: false,
                    category: 'spiritual'
                }
            ],
            targetDate: newBuilder.targetDate,
            isActive: true,
            progress: 0
        };

        setLaunchBuilders([...launchBuilders, builder]);
        setNewBuilder({});
        setShowBuilderModal(false);
        Alert.alert('Success', 'Launch builder created successfully!');
    };

    const getCoachingFeedback = () => {
        if (!feedbackContent.trim()) {
            Alert.alert('Error', 'Please enter your content for feedback');
            return;
        }

        // Mock AI feedback
        const feedback: CoachingFeedback = {
            id: Date.now().toString(),
            type: feedbackType,
            content: feedbackContent,
            feedback: `Great ${feedbackType} content! Here are some suggestions to improve it...`,
            score: Math.floor(Math.random() * 4) + 7, // 7-10
            suggestions: [
                'Add more specific details',
                'Include a call-to-action',
                'Consider your target audience',
                'Add faith-based elements'
            ]
        };

        setCoachingFeedback([...coachingFeedback, feedback]);
        setFeedbackContent('');
        setShowFeedbackModal(false);
        Alert.alert('Success', 'AI feedback generated!');
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return '#4CAF50';
            case 'intermediate': return '#FF9800';
            case 'advanced': return '#f44336';
            default: return '#666';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'launch': return 'rocket';
            case 'business': return 'briefcase';
            case 'faith': return 'heart';
            case 'marketing': return 'megaphone';
            case 'technical': return 'code';
            default: return 'book';
        }
    };

    const renderEducationModules = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📚 Education Modules ({modules.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowModuleModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Module</Text>
                </TouchableOpacity>
            </View>

            {modules.map(module => (
                <TouchableOpacity
                    key={module.id}
                    style={styles.moduleCard}
                    onPress={() => setSelectedModule(module)}
                >
                    <View style={styles.moduleHeader}>
                        <View style={styles.moduleIcon}>
                            <Ionicons name={getCategoryIcon(module.category) as any} size={24} color="#667eea" />
                        </View>
                        <View style={styles.moduleInfo}>
                            <Text style={styles.moduleTitle}>{module.title}</Text>
                            <Text style={styles.moduleDescription}>{module.description}</Text>
                            <View style={styles.moduleMeta}>
                                <Text style={styles.moduleDuration}>{module.duration} min</Text>
                                <Text style={styles.moduleLessons}>{module.lessons.length} lessons</Text>
                                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(module.difficulty) }]}>
                                    <Text style={styles.difficultyText}>{module.difficulty}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.progressCircle}>
                            <Text style={styles.progressText}>{module.progress}%</Text>
                        </View>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${module.progress}%` }]} />
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderLaunchBuilders = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🚀 Launch Builders ({launchBuilders.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowBuilderModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Builder</Text>
                </TouchableOpacity>
            </View>

            {launchBuilders.map(builder => (
                <View key={builder.id} style={styles.builderCard}>
                    <View style={styles.builderHeader}>
                        <Text style={styles.builderName}>{builder.name}</Text>
                        <Text style={styles.builderPhase}>{builder.phase}</Text>
                    </View>
                    <Text style={styles.builderTarget}>Target: {builder.targetDate.toLocaleDateString()}</Text>
                    <View style={styles.builderProgress}>
                        <Text style={styles.builderProgressText}>{builder.progress}% Complete</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${builder.progress}%` }]} />
                        </View>
                    </View>
                    <View style={styles.builderSteps}>
                        {builder.steps.map(step => (
                            <View key={step.id} style={styles.stepItem}>
                                <Ionicons
                                    name={step.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                                    size={20}
                                    color={step.isCompleted ? '#4CAF50' : '#666'}
                                />
                                <Text style={[styles.stepTitle, step.isCompleted && styles.stepCompleted]}>
                                    {step.title}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );

    const renderCoachingMode = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🤖 AI Coaching Mode</Text>
            <Text style={styles.sectionDescription}>
                Get AI-powered feedback on your launches, copy, campaigns, and spiritual guidance
            </Text>

            <TouchableOpacity
                style={styles.feedbackButton}
                onPress={() => setShowFeedbackModal(true)}
            >
                <Ionicons name="chatbubble" size={24} color="#fff" />
                <Text style={styles.feedbackButtonText}>Get AI Feedback</Text>
            </TouchableOpacity>

            {coachingFeedback.map(feedback => (
                <View key={feedback.id} style={styles.feedbackCard}>
                    <View style={styles.feedbackHeader}>
                        <Text style={styles.feedbackType}>{feedback.type}</Text>
                        <Text style={styles.feedbackScore}>Score: {feedback.score}/10</Text>
                    </View>
                    <Text style={styles.feedbackContent}>{feedback.content}</Text>
                    <Text style={styles.feedbackResponse}>{feedback.feedback}</Text>
                    <View style={styles.suggestionsList}>
                        {feedback.suggestions.map((suggestion, index) => (
                            <Text key={index} style={styles.suggestion}>• {suggestion}</Text>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>🎓 Launch Education Center</Text>
                <Text style={styles.headerSubtitle}>Learn, build, and grow with AI guidance</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'education' && styles.activeTab]}
                    onPress={() => setSelectedTab('education')}
                >
                    <Ionicons name="school" size={20} color={selectedTab === 'education' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'education' && styles.activeTabText]}>
                        Education
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'builder' && styles.activeTab]}
                    onPress={() => setSelectedTab('builder')}
                >
                    <Ionicons name="construct" size={20} color={selectedTab === 'builder' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'builder' && styles.activeTabText]}>
                        Launch Builder
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'coaching' && styles.activeTab]}
                    onPress={() => setSelectedTab('coaching')}
                >
                    <Ionicons name="sparkles" size={20} color={selectedTab === 'coaching' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'coaching' && styles.activeTabText]}>
                        AI Coaching
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{modules.length}</Text>
                        <Text style={styles.statLabel}>Education Modules</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{launchBuilders.length}</Text>
                        <Text style={styles.statLabel}>Active Builders</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{coachingFeedback.length}</Text>
                        <Text style={styles.statLabel}>AI Feedback</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {modules.reduce((sum, m) => sum + m.progress, 0) / modules.length || 0}%
                        </Text>
                        <Text style={styles.statLabel}>Avg Progress</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'education' && renderEducationModules()}
                {selectedTab === 'builder' && renderLaunchBuilders()}
                {selectedTab === 'coaching' && renderCoachingMode()}

                {/* Module Modal */}
                <Modal
                    visible={showModuleModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowModuleModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Education Module</Text>

                            <Text style={styles.inputLabel}>Module Title</Text>
                            <TextInput
                                style={styles.input}
                                value={newModule.title}
                                onChangeText={(text) => setNewModule({ ...newModule, title: text })}
                                placeholder="e.g., Launch Mastery Fundamentals"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newModule.description}
                                onChangeText={(text) => setNewModule({ ...newModule, description: text })}
                                placeholder="Describe what students will learn..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Category</Text>
                            <View style={styles.radioGroup}>
                                {['launch', 'business', 'faith', 'marketing', 'technical'].map(category => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.radioButton,
                                            newModule.category === category && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewModule({ ...newModule, category: category as any })}
                                    >
                                        <Text style={styles.radioLabel}>{category}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Difficulty</Text>
                            <View style={styles.radioGroup}>
                                {['beginner', 'intermediate', 'advanced'].map(difficulty => (
                                    <TouchableOpacity
                                        key={difficulty}
                                        style={[
                                            styles.radioButton,
                                            newModule.difficulty === difficulty && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewModule({ ...newModule, difficulty: difficulty as any })}
                                    >
                                        <Text style={styles.radioLabel}>{difficulty}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Duration (minutes)</Text>
                            <TextInput
                                style={styles.input}
                                value={newModule.duration?.toString()}
                                onChangeText={(text) => setNewModule({ ...newModule, duration: parseInt(text) || 0 })}
                                placeholder="60"
                                keyboardType="numeric"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createModule}
                                >
                                    <Text style={styles.modalButtonText}>Create Module</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowModuleModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Builder Modal */}
                <Modal
                    visible={showBuilderModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowBuilderModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Launch Builder</Text>

                            <Text style={styles.inputLabel}>Launch Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newBuilder.name}
                                onChangeText={(text) => setNewBuilder({ ...newBuilder, name: text })}
                                placeholder="e.g., Course Launch 2024"
                            />

                            <Text style={styles.inputLabel}>Target Launch Date</Text>
                            <TextInput
                                style={styles.input}
                                value={newBuilder.targetDate?.toLocaleDateString()}
                                placeholder="Select target date"
                                onFocus={() => {
                                    // In a real app, you'd show a date picker here
                                    setNewBuilder({ ...newBuilder, targetDate: new Date() });
                                }}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createLaunchBuilder}
                                >
                                    <Text style={styles.modalButtonText}>Create Builder</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowBuilderModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Feedback Modal */}
                <Modal
                    visible={showFeedbackModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowFeedbackModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Get AI Coaching Feedback</Text>

                            <Text style={styles.inputLabel}>Feedback Type</Text>
                            <View style={styles.radioGroup}>
                                {['launch', 'copy', 'campaign', 'spiritual'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            feedbackType === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setFeedbackType(type as any)}
                                    >
                                        <Text style={styles.radioLabel}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Your Content</Text>
                            <TextInput
                                style={[styles.input, { height: 120 }]}
                                value={feedbackContent}
                                onChangeText={setFeedbackContent}
                                placeholder="Paste your content here for AI feedback..."
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={getCoachingFeedback}
                                >
                                    <Text style={styles.modalButtonText}>Get Feedback</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowFeedbackModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
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
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#667eea10',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    activeTabText: {
        color: '#667eea',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
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
    sectionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    moduleCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    moduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    moduleIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    moduleInfo: {
        flex: 1,
    },
    moduleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    moduleDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    moduleMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    moduleDuration: {
        fontSize: 12,
        color: '#666',
    },
    moduleLessons: {
        fontSize: 12,
        color: '#666',
    },
    difficultyBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    difficultyText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    progressCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
    },
    progressBar: {
        height: 4,
        backgroundColor: '#e9ecef',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    builderCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    builderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    builderName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    builderPhase: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    builderTarget: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    builderProgress: {
        marginBottom: 8,
    },
    builderProgressText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    builderSteps: {
        gap: 4,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepTitle: {
        fontSize: 14,
        color: '#333',
    },
    stepCompleted: {
        textDecorationLine: 'line-through',
        color: '#666',
    },
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#667eea',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    feedbackButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    feedbackCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    feedbackHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    feedbackType: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textTransform: 'capitalize',
    },
    feedbackScore: {
        fontSize: 12,
        color: '#666',
    },
    feedbackContent: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontStyle: 'italic',
    },
    feedbackResponse: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    suggestionsList: {
        gap: 4,
    },
    suggestion: {
        fontSize: 12,
        color: '#666',
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
    radioGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
        gap: 8,
    },
    radioButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    radioButtonActive: {
        borderColor: '#667eea',
        backgroundColor: '#667eea10',
    },
    radioLabel: {
        fontSize: 14,
        color: '#333',
        textTransform: 'capitalize',
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

export default LaunchEducationCenterScreen; 