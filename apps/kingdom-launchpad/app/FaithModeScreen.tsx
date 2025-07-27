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

interface PropheticPrompt {
    id: string;
    question: string;
    category: 'business' | 'content' | 'launch' | 'personal' | 'ministry';
    isActive: boolean;
    lastUsed: Date;
    responses: PropheticResponse[];
}

interface PropheticResponse {
    id: string;
    prompt: string;
    response: string;
    date: Date;
    impact: 'low' | 'medium' | 'high';
    actionTaken: string;
}

interface IntegrityCheck {
    id: string;
    type: 'pricing' | 'urgency' | 'ethics' | 'content' | 'marketing';
    title: string;
    description: string;
    isEnabled: boolean;
    lastTriggered: Date;
    warnings: IntegrityWarning[];
}

interface IntegrityWarning {
    id: string;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    date: Date;
    resolved: boolean;
}

interface ScriptureSuggestion {
    id: string;
    verse: string;
    context: string;
    application: string;
    category: 'business' | 'launch' | 'content' | 'prayer' | 'encouragement';
    isActive: boolean;
    lastUsed: Date;
}

interface PrayerSession {
    id: string;
    title: string;
    focus: string;
    duration: number; // in minutes
    date: Date;
    insights: string[];
    nextSteps: string[];
}

const FaithModeScreen: React.FC = () => {
    const [propheticPrompts, setPropheticPrompts] = useState<PropheticPrompt[]>([]);
    const [integrityChecks, setIntegrityChecks] = useState<IntegrityCheck[]>([]);
    const [scriptureSuggestions, setScriptureSuggestions] = useState<ScriptureSuggestion[]>([]);
    const [prayerSessions, setPrayerSessions] = useState<PrayerSession[]>([]);
    const [selectedTab, setSelectedTab] = useState<'prompts' | 'integrity' | 'scripture' | 'prayer'>('prompts');
    const [showPromptModal, setShowPromptModal] = useState(false);
    const [showPrayerModal, setShowPrayerModal] = useState(false);
    const [newPrompt, setNewPrompt] = useState<Partial<PropheticPrompt>>({});
    const [newPrayerSession, setNewPrayerSession] = useState<Partial<PrayerSession>>({});
    const [isFaithModeEnabled, setIsFaithModeEnabled] = useState(true);
    const [currentPrompt, setCurrentPrompt] = useState<PropheticPrompt | null>(null);

    // Mock data
    useEffect(() => {
        setPropheticPrompts([
            {
                id: '1',
                question: 'What message is heaven releasing for my business right now?',
                category: 'business',
                isActive: true,
                lastUsed: new Date('2024-01-20'),
                responses: [
                    {
                        id: '1',
                        prompt: 'What message is heaven releasing for my business right now?',
                        response: 'Focus on serving others with genuine love. Your business will grow as you prioritize Kingdom values over profit.',
                        date: new Date('2024-01-20'),
                        impact: 'high',
                        actionTaken: 'Revised pricing strategy to be more generous and service-focused'
                    }
                ]
            },
            {
                id: '2',
                question: 'What content should I create that will bless my audience?',
                category: 'content',
                isActive: true,
                lastUsed: new Date('2024-01-18'),
                responses: [
                    {
                        id: '2',
                        prompt: 'What content should I create that will bless my audience?',
                        response: 'Share your testimony of how faith guided your business decisions. People need to see real examples.',
                        date: new Date('2024-01-18'),
                        impact: 'medium',
                        actionTaken: 'Created a video series on faith-based business decisions'
                    }
                ]
            }
        ]);

        setIntegrityChecks([
            {
                id: '1',
                type: 'pricing',
                title: 'Pricing Ethics Check',
                description: 'Ensures your pricing is fair and not exploiting customers',
                isEnabled: true,
                lastTriggered: new Date('2024-01-15'),
                warnings: [
                    {
                        id: '1',
                        type: 'pricing',
                        message: 'Consider if your pricing truly reflects the value provided',
                        severity: 'medium',
                        date: new Date('2024-01-15'),
                        resolved: true
                    }
                ]
            },
            {
                id: '2',
                type: 'urgency',
                title: 'False Urgency Check',
                description: 'Prevents creating artificial scarcity or pressure',
                isEnabled: true,
                lastTriggered: new Date('2024-01-10'),
                warnings: []
            }
        ]);

        setScriptureSuggestions([
            {
                id: '1',
                verse: 'Proverbs 3:5-6',
                context: 'Trust in the Lord with all your heart and lean not on your own understanding',
                application: 'When making business decisions, seek God\'s guidance first',
                category: 'business',
                isActive: true,
                lastUsed: new Date('2024-01-20')
            },
            {
                id: '2',
                verse: 'Matthew 6:33',
                context: 'Seek first the kingdom of God and his righteousness',
                application: 'Prioritize Kingdom values in all your business activities',
                category: 'launch',
                isActive: true,
                lastUsed: new Date('2024-01-18')
            }
        ]);

        setPrayerSessions([
            {
                id: '1',
                title: 'Launch Preparation Prayer',
                focus: 'Seeking guidance for the upcoming product launch',
                duration: 30,
                date: new Date('2024-01-20'),
                insights: [
                    'Focus on serving rather than selling',
                    'Trust the timing God has set',
                    'Remember that success is measured by Kingdom impact'
                ],
                nextSteps: [
                    'Revise launch messaging to be more service-focused',
                    'Add prayer requests to launch sequence',
                    'Create content that shares testimonies'
                ]
            }
        ]);
    }, []);

    const askPropheticQuestion = () => {
        if (!currentPrompt) {
            Alert.alert('Error', 'Please select a prompt first');
            return;
        }

        // Mock AI response
        const responses = [
            'Focus on serving others with genuine love. Your business will grow as you prioritize Kingdom values over profit.',
            'Share your testimony of how faith guided your business decisions. People need to see real examples.',
            'Trust in God\'s timing. The right people will find you when the time is right.',
            'Create content that encourages and builds up your audience rather than just selling to them.',
            'Remember that your business is a ministry. Let that guide your decisions.'
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const response: PropheticResponse = {
            id: Date.now().toString(),
            prompt: currentPrompt.question,
            response: randomResponse,
            date: new Date(),
            impact: 'medium',
            actionTaken: ''
        };

        const updatedPrompt = {
            ...currentPrompt,
            responses: [...currentPrompt.responses, response],
            lastUsed: new Date()
        };

        setPropheticPrompts(propheticPrompts.map(p => p.id === currentPrompt.id ? updatedPrompt : p));
        setCurrentPrompt(null);

        Alert.alert('Holy Spirit Guidance', randomResponse);
    };

    const addPropheticPrompt = () => {
        if (!newPrompt.question) {
            Alert.alert('Error', 'Please enter your prophetic question');
            return;
        }

        const prompt: PropheticPrompt = {
            id: Date.now().toString(),
            question: newPrompt.question,
            category: newPrompt.category || 'business',
            isActive: true,
            lastUsed: new Date(),
            responses: []
        };

        setPropheticPrompts([...propheticPrompts, prompt]);
        setNewPrompt({});
        setShowPromptModal(false);
        Alert.alert('Success', 'Prophetic prompt added!');
    };

    const startPrayerSession = () => {
        if (!newPrayerSession.title || !newPrayerSession.focus) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const session: PrayerSession = {
            id: Date.now().toString(),
            title: newPrayerSession.title,
            focus: newPrayerSession.focus,
            duration: newPrayerSession.duration || 15,
            date: new Date(),
            insights: [],
            nextSteps: []
        };

        setPrayerSessions([...prayerSessions, session]);
        setNewPrayerSession({});
        setShowPrayerModal(false);
        Alert.alert('Prayer Session Started', 'Take time to pray and listen for guidance.');
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'business': return 'briefcase';
            case 'content': return 'document-text';
            case 'launch': return 'rocket';
            case 'personal': return 'person';
            case 'ministry': return 'heart';
            default: return 'help-circle';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return '#f44336';
            case 'medium': return '#FF9800';
            case 'low': return '#4CAF50';
            default: return '#666';
        }
    };

    const renderPropheticPrompts = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🙏 Prophetic Prompts ({propheticPrompts.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowPromptModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Prompt</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionDescription}>
                Ask the Holy Spirit for guidance in your business decisions
            </Text>

            {propheticPrompts.map(prompt => (
                <TouchableOpacity
                    key={prompt.id}
                    style={styles.promptCard}
                    onPress={() => setCurrentPrompt(prompt)}
                >
                    <View style={styles.promptHeader}>
                        <Ionicons name={getCategoryIcon(prompt.category) as any} size={20} color="#667eea" />
                        <Text style={styles.promptCategory}>{prompt.category}</Text>
                        <Text style={styles.promptDate}>{prompt.lastUsed.toLocaleDateString()}</Text>
                    </View>
                    <Text style={styles.promptQuestion}>{prompt.question}</Text>
                    <Text style={styles.promptResponses}>{prompt.responses.length} responses</Text>
                    {prompt.responses.length > 0 && (
                        <Text style={styles.lastResponse}>
                            "{prompt.responses[prompt.responses.length - 1].response.substring(0, 100)}..."
                        </Text>
                    )}
                </TouchableOpacity>
            ))}

            {currentPrompt && (
                <Modal
                    visible={!!currentPrompt}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setCurrentPrompt(null)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Ask for Guidance</Text>
                            <Text style={styles.promptQuestion}>{currentPrompt.question}</Text>

                            <TouchableOpacity
                                style={styles.prayerButton}
                                onPress={askPropheticQuestion}
                            >
                                <Ionicons name="heart" size={20} color="#fff" />
                                <Text style={styles.prayerButtonText}>Ask Holy Spirit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setCurrentPrompt(null)}
                            >
                                <Text style={styles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );

    const renderIntegrityChecks = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛡️ Kingdom Integrity Checks</Text>
            <Text style={styles.sectionDescription}>
                Ensure your business practices align with Kingdom values
            </Text>

            {integrityChecks.map(check => (
                <View key={check.id} style={styles.integrityCard}>
                    <View style={styles.integrityHeader}>
                        <Text style={styles.integrityTitle}>{check.title}</Text>
                        <Switch
                            value={check.isEnabled}
                            onValueChange={(value) => {
                                setIntegrityChecks(integrityChecks.map(c =>
                                    c.id === check.id ? { ...c, isEnabled: value } : c
                                ));
                            }}
                        />
                    </View>
                    <Text style={styles.integrityDescription}>{check.description}</Text>
                    <Text style={styles.integrityLastTriggered}>
                        Last checked: {check.lastTriggered.toLocaleDateString()}
                    </Text>
                    {check.warnings.length > 0 && (
                        <View style={styles.warningsList}>
                            {check.warnings.map(warning => (
                                <View key={warning.id} style={styles.warningItem}>
                                    <View style={[styles.severityDot, { backgroundColor: getSeverityColor(warning.severity) }]} />
                                    <Text style={styles.warningMessage}>{warning.message}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </View>
    );

    const renderScriptureSuggestions = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📖 Scripture Suggestions</Text>
            <Text style={styles.sectionDescription}>
                Biblical wisdom for your business decisions
            </Text>

            {scriptureSuggestions.map(scripture => (
                <View key={scripture.id} style={styles.scriptureCard}>
                    <Text style={styles.scriptureVerse}>{scripture.verse}</Text>
                    <Text style={styles.scriptureContext}>{scripture.context}</Text>
                    <Text style={styles.scriptureApplication}>{scripture.application}</Text>
                    <View style={styles.scriptureMeta}>
                        <Text style={styles.scriptureCategory}>{scripture.category}</Text>
                        <Text style={styles.scriptureDate}>{scripture.lastUsed.toLocaleDateString()}</Text>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderPrayerSessions = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🙏 Prayer Sessions ({prayerSessions.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowPrayerModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Start Session</Text>
                </TouchableOpacity>
            </View>

            {prayerSessions.map(session => (
                <View key={session.id} style={styles.prayerCard}>
                    <View style={styles.prayerHeader}>
                        <Text style={styles.prayerTitle}>{session.title}</Text>
                        <Text style={styles.prayerDuration}>{session.duration} min</Text>
                    </View>
                    <Text style={styles.prayerFocus}>{session.focus}</Text>
                    <Text style={styles.prayerDate}>{session.date.toLocaleDateString()}</Text>

                    {session.insights.length > 0 && (
                        <View style={styles.insightsSection}>
                            <Text style={styles.insightsTitle}>Insights Received:</Text>
                            {session.insights.map((insight, index) => (
                                <Text key={index} style={styles.insight}>• {insight}</Text>
                            ))}
                        </View>
                    )}

                    {session.nextSteps.length > 0 && (
                        <View style={styles.nextStepsSection}>
                            <Text style={styles.nextStepsTitle}>Next Steps:</Text>
                            {session.nextSteps.map((step, index) => (
                                <Text key={index} style={styles.nextStep}>• {step}</Text>
                            ))}
                        </View>
                    )}
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
                <Text style={styles.headerTitle}>🙏 Faith Mode</Text>
                <Text style={styles.headerSubtitle}>Spiritual guidance for your business journey</Text>
            </LinearGradient>

            <View style={styles.faithModeToggle}>
                <Text style={styles.faithModeLabel}>Faith Mode Enabled</Text>
                <Switch
                    value={isFaithModeEnabled}
                    onValueChange={setIsFaithModeEnabled}
                    trackColor={{ false: '#767577', true: '#667eea' }}
                    thumbColor={isFaithModeEnabled ? '#fff' : '#f4f3f4'}
                />
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'prompts' && styles.activeTab]}
                    onPress={() => setSelectedTab('prompts')}
                >
                    <Ionicons name="chatbubble-ellipses" size={20} color={selectedTab === 'prompts' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'prompts' && styles.activeTabText]}>
                        Prompts
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'integrity' && styles.activeTab]}
                    onPress={() => setSelectedTab('integrity')}
                >
                    <Ionicons name="shield-checkmark" size={20} color={selectedTab === 'integrity' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'integrity' && styles.activeTabText]}>
                        Integrity
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'scripture' && styles.activeTab]}
                    onPress={() => setSelectedTab('scripture')}
                >
                    <Ionicons name="book" size={20} color={selectedTab === 'scripture' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'scripture' && styles.activeTabText]}>
                        Scripture
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'prayer' && styles.activeTab]}
                    onPress={() => setSelectedTab('prayer')}
                >
                    <Ionicons name="heart" size={20} color={selectedTab === 'prayer' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'prayer' && styles.activeTabText]}>
                        Prayer
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{propheticPrompts.length}</Text>
                        <Text style={styles.statLabel}>Prophetic Prompts</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{integrityChecks.length}</Text>
                        <Text style={styles.statLabel}>Integrity Checks</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{scriptureSuggestions.length}</Text>
                        <Text style={styles.statLabel}>Scripture Suggestions</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{prayerSessions.length}</Text>
                        <Text style={styles.statLabel}>Prayer Sessions</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'prompts' && renderPropheticPrompts()}
                {selectedTab === 'integrity' && renderIntegrityChecks()}
                {selectedTab === 'scripture' && renderScriptureSuggestions()}
                {selectedTab === 'prayer' && renderPrayerSessions()}

                {/* Prompt Modal */}
                <Modal
                    visible={showPromptModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowPromptModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Prophetic Prompt</Text>

                            <Text style={styles.inputLabel}>Question for Holy Spirit</Text>
                            <TextInput
                                style={[styles.input, { height: 100 }]}
                                value={newPrompt.question}
                                onChangeText={(text) => setNewPrompt({ ...newPrompt, question: text })}
                                placeholder="Ask the Holy Spirit for guidance..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Category</Text>
                            <View style={styles.radioGroup}>
                                {['business', 'content', 'launch', 'personal', 'ministry'].map(category => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.radioButton,
                                            newPrompt.category === category && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewPrompt({ ...newPrompt, category: category as any })}
                                    >
                                        <Text style={styles.radioLabel}>{category}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addPropheticPrompt}
                                >
                                    <Text style={styles.modalButtonText}>Add Prompt</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowPromptModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Prayer Session Modal */}
                <Modal
                    visible={showPrayerModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowPrayerModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Start Prayer Session</Text>

                            <Text style={styles.inputLabel}>Session Title</Text>
                            <TextInput
                                style={styles.input}
                                value={newPrayerSession.title}
                                onChangeText={(text) => setNewPrayerSession({ ...newPrayerSession, title: text })}
                                placeholder="e.g., Launch Preparation Prayer"
                            />

                            <Text style={styles.inputLabel}>Prayer Focus</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newPrayerSession.focus}
                                onChangeText={(text) => setNewPrayerSession({ ...newPrayerSession, focus: text })}
                                placeholder="What are you seeking guidance for?"
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Duration (minutes)</Text>
                            <TextInput
                                style={styles.input}
                                value={newPrayerSession.duration?.toString()}
                                onChangeText={(text) => setNewPrayerSession({ ...newPrayerSession, duration: parseInt(text) || 15 })}
                                placeholder="15"
                                keyboardType="numeric"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={startPrayerSession}
                                >
                                    <Text style={styles.modalButtonText}>Start Session</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowPrayerModal(false)}
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
    faithModeToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    faithModeLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
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
    promptCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    promptHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    promptCategory: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    promptDate: {
        fontSize: 10,
        color: '#999',
        marginLeft: 'auto',
    },
    promptQuestion: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    promptResponses: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    lastResponse: {
        fontSize: 12,
        color: '#667eea',
        fontStyle: 'italic',
    },
    integrityCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    integrityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    integrityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    integrityDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    integrityLastTriggered: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    warningsList: {
        gap: 4,
    },
    warningItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    severityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    warningMessage: {
        fontSize: 12,
        color: '#666',
    },
    scriptureCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    scriptureVerse: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    scriptureContext: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    scriptureApplication: {
        fontSize: 12,
        color: '#667eea',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    scriptureMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scriptureCategory: {
        fontSize: 10,
        color: '#666',
        textTransform: 'capitalize',
    },
    scriptureDate: {
        fontSize: 10,
        color: '#999',
    },
    prayerCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    prayerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    prayerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    prayerDuration: {
        fontSize: 12,
        color: '#666',
    },
    prayerFocus: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    prayerDate: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    insightsSection: {
        marginBottom: 8,
    },
    insightsTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    insight: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    nextStepsSection: {
        marginBottom: 8,
    },
    nextStepsTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    nextStep: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
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
    prayerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#667eea',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    prayerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
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

export default FaithModeScreen; 