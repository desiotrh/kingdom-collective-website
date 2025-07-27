import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Modal,
    TextInput,
    Alert,
    FlatList,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Question {
    id: string;
    type: 'short_text' | 'long_text' | 'multiple_choice';
    text: string;
    options?: string[];
    required: boolean;
}

interface Questionnaire {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    isTemplate: boolean;
    createdAt: string;
    shootId?: string;
}

export default function QuestionnaireBuilderScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
    const [newQuestionnaire, setNewQuestionnaire] = useState<Partial<Questionnaire>>({});
    const [newQuestion, setNewQuestion] = useState<Partial<Question>>({});
    const [questionOptions, setQuestionOptions] = useState<string[]>([]);
    const [newOption, setNewOption] = useState('');

    useEffect(() => {
        loadQuestionnaires();
    }, []);

    const loadQuestionnaires = async () => {
        try {
            const storedQuestionnaires = await AsyncStorage.getItem('@kingdom_lens_questionnaires');
            if (storedQuestionnaires) {
                setQuestionnaires(JSON.parse(storedQuestionnaires));
            }
        } catch (error) {
            console.error('Error loading questionnaires:', error);
        }
    };

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Divine Questions';
        } else if (encouragementMode) {
            return 'Questionnaire Builder';
        }
        return 'Questionnaire Builder';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Create questions that reveal His purpose';
        } else if (encouragementMode) {
            return 'Build questionnaires that connect deeply';
        }
        return 'Create custom questionnaires for clients';
    };

    const getQuestionTypeLabel = (type: string) => {
        switch (type) {
            case 'short_text':
                return 'Short Answer';
            case 'long_text':
                return 'Long Answer';
            case 'multiple_choice':
                return 'Multiple Choice';
            default:
                return 'Unknown';
        }
    };

    const getQuestionTypeIcon = (type: string) => {
        switch (type) {
            case 'short_text':
                return '📝';
            case 'long_text':
                return '📄';
            case 'multiple_choice':
                return '☑️';
            default:
                return '❓';
        }
    };

    const handleCreateQuestionnaire = async () => {
        if (!newQuestionnaire.title) {
            Alert.alert('Missing Title', 'Please enter a questionnaire title');
            return;
        }

        try {
            const questionnaire: Questionnaire = {
                id: Date.now().toString(),
                title: newQuestionnaire.title,
                description: newQuestionnaire.description || '',
                questions: [],
                isTemplate: newQuestionnaire.isTemplate || false,
                createdAt: new Date().toISOString(),
                shootId: newQuestionnaire.shootId,
            };

            const updatedQuestionnaires = [...questionnaires, questionnaire];
            setQuestionnaires(updatedQuestionnaires);
            await AsyncStorage.setItem('@kingdom_lens_questionnaires', JSON.stringify(updatedQuestionnaires));

            setSelectedQuestionnaire(questionnaire);
            setNewQuestionnaire({});
            setShowCreateModal(false);
            setShowQuestionModal(true);

            const successMessage = faithMode
                ? 'Questionnaire created with His guidance'
                : encouragementMode
                    ? 'Questionnaire created with intention'
                    : 'Questionnaire created successfully';

            Alert.alert('Success', successMessage);
        } catch (error) {
            console.error('Error creating questionnaire:', error);
            Alert.alert('Error', 'Failed to create questionnaire');
        }
    };

    const handleAddQuestion = async () => {
        if (!newQuestion.text || !newQuestion.type) {
            Alert.alert('Missing Information', 'Please enter question text and select type');
            return;
        }

        if (newQuestion.type === 'multiple_choice' && (!questionOptions || questionOptions.length < 2)) {
            Alert.alert('Missing Options', 'Multiple choice questions need at least 2 options');
            return;
        }

        try {
            const question: Question = {
                id: Date.now().toString(),
                text: newQuestion.text,
                type: newQuestion.type as 'short_text' | 'long_text' | 'multiple_choice',
                options: newQuestion.type === 'multiple_choice' ? questionOptions : undefined,
                required: newQuestion.required || false,
            };

            if (selectedQuestionnaire) {
                const updatedQuestionnaire = {
                    ...selectedQuestionnaire,
                    questions: [...selectedQuestionnaire.questions, question],
                };

                const updatedQuestionnaires = questionnaires.map(q =>
                    q.id === selectedQuestionnaire.id ? updatedQuestionnaire : q
                );
                setQuestionnaires(updatedQuestionnaires);
                setSelectedQuestionnaire(updatedQuestionnaire);
                await AsyncStorage.setItem('@kingdom_lens_questionnaires', JSON.stringify(updatedQuestionnaires));
            }

            setNewQuestion({});
            setQuestionOptions([]);
            setNewOption('');

            Alert.alert('Success', 'Question added successfully');
        } catch (error) {
            console.error('Error adding question:', error);
            Alert.alert('Error', 'Failed to add question');
        }
    };

    const handleAddOption = () => {
        if (newOption.trim()) {
            setQuestionOptions([...questionOptions, newOption.trim()]);
            setNewOption('');
        }
    };

    const handleRemoveOption = (index: number) => {
        setQuestionOptions(questionOptions.filter((_, i) => i !== index));
    };

    const renderQuestionnaireCard = ({ item }: { item: Questionnaire }) => (
        <TouchableOpacity
            style={[styles.questionnaireCard, { backgroundColor: theme.colors.surface }]}
            onPress={() => {
                setSelectedQuestionnaire(item);
                setShowQuestionModal(true);
            }}
        >
            <View style={styles.questionnaireHeader}>
                <Text style={[styles.questionnaireTitle, { color: theme.colors.text }]}>
                    {item.title}
                </Text>
                {item.isTemplate && (
                    <View style={[styles.templateBadge, { backgroundColor: theme.colors.primary }]}>
                        <Text style={[styles.templateText, { color: theme.colors.surface }]}>
                            Template
                        </Text>
                    </View>
                )}
            </View>

            <Text style={[styles.questionnaireDescription, { color: theme.colors.textSecondary }]}>
                {item.description || 'No description'}
            </Text>

            <Text style={[styles.questionnaireInfo, { color: theme.colors.textSecondary }]}>
                {item.questions.length} questions • Created {new Date(item.createdAt).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    );

    const renderQuestionItem = ({ item }: { item: Question }) => (
        <View style={[styles.questionItem, { backgroundColor: theme.colors.background }]}>
            <View style={styles.questionHeader}>
                <Text style={styles.questionTypeIcon}>{getQuestionTypeIcon(item.type)}</Text>
                <Text style={[styles.questionType, { color: theme.colors.textSecondary }]}>
                    {getQuestionTypeLabel(item.type)}
                </Text>
                {item.required && (
                    <Text style={[styles.requiredBadge, { color: theme.colors.error }]}>
                        Required
                    </Text>
                )}
            </View>

            <Text style={[styles.questionText, { color: theme.colors.text }]}>
                {item.text}
            </Text>

            {item.options && item.options.length > 0 && (
                <View style={styles.optionsContainer}>
                    {item.options.map((option, index) => (
                        <Text key={index} style={[styles.optionText, { color: theme.colors.textSecondary }]}>
                            • {option}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.watermark, { color: theme.colors.primary }]}>
                        {faithTheme.watermark}
                    </Text>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {getScreenTitle()}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        {getScreenSubtitle()}
                    </Text>
                </View>

                {/* Questionnaires List */}
                <View style={styles.questionnairesContainer}>
                    <View style={styles.questionnairesHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Questionnaires ({questionnaires.length})
                        </Text>
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                            onPress={() => setShowCreateModal(true)}
                        >
                            <Text style={[styles.addButtonText, { color: theme.colors.surface }]}>
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {questionnaires.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                                {faithMode
                                    ? 'No questionnaires yet. Create your first divine questions.'
                                    : encouragementMode
                                        ? 'No questionnaires yet. Create your first meaningful questions.'
                                        : 'No questionnaires yet. Create your first questionnaire.'}
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={questionnaires}
                            renderItem={renderQuestionnaireCard}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </ScrollView>

            {/* Create Questionnaire Modal */}
            <Modal
                visible={showCreateModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCreateModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                            {faithMode ? 'Create Divine Questions' : encouragementMode ? 'Create Questionnaire' : 'Create Questionnaire'}
                        </Text>

                        <TextInput
                            style={[styles.modalInput, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            placeholder="Questionnaire title"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newQuestionnaire.title}
                            onChangeText={(text) => setNewQuestionnaire({ ...newQuestionnaire, title: text })}
                        />

                        <TextInput
                            style={[styles.modalTextArea, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            placeholder="Description (optional)"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newQuestionnaire.description}
                            onChangeText={(text) => setNewQuestionnaire({ ...newQuestionnaire, description: text })}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.colors.secondary }]}
                                onPress={() => setShowCreateModal(false)}
                            >
                                <Text style={[styles.modalButtonText, { color: theme.colors.surface }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                                onPress={handleCreateQuestionnaire}
                            >
                                <Text style={[styles.modalButtonText, { color: theme.colors.surface }]}>
                                    Create
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add Question Modal */}
            <Modal
                visible={showQuestionModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowQuestionModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <ScrollView style={styles.modalScrollView}>
                        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                                {selectedQuestionnaire?.title || 'Add Questions'}
                            </Text>

                            <TextInput
                                style={[styles.modalInput, {
                                    backgroundColor: theme.colors.background,
                                    color: theme.colors.text,
                                    borderColor: theme.colors.border
                                }]}
                                placeholder="Question text"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={newQuestion.text}
                                onChangeText={(text) => setNewQuestion({ ...newQuestion, text })}
                            />

                            {/* Question Type Selection */}
                            <View style={styles.questionTypeContainer}>
                                <Text style={[styles.questionTypeLabel, { color: theme.colors.text }]}>
                                    Question Type:
                                </Text>
                                <View style={styles.questionTypeButtons}>
                                    <TouchableOpacity
                                        style={[
                                            styles.questionTypeButton,
                                            { backgroundColor: theme.colors.background },
                                            newQuestion.type === 'short_text' && { backgroundColor: theme.colors.primary }
                                        ]}
                                        onPress={() => setNewQuestion({ ...newQuestion, type: 'short_text' })}
                                    >
                                        <Text style={[
                                            styles.questionTypeButtonText,
                                            { color: newQuestion.type === 'short_text' ? theme.colors.surface : theme.colors.text }
                                        ]}>
                                            Short Text
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.questionTypeButton,
                                            { backgroundColor: theme.colors.background },
                                            newQuestion.type === 'long_text' && { backgroundColor: theme.colors.primary }
                                        ]}
                                        onPress={() => setNewQuestion({ ...newQuestion, type: 'long_text' })}
                                    >
                                        <Text style={[
                                            styles.questionTypeButtonText,
                                            { color: newQuestion.type === 'long_text' ? theme.colors.surface : theme.colors.text }
                                        ]}>
                                            Long Text
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.questionTypeButton,
                                            { backgroundColor: theme.colors.background },
                                            newQuestion.type === 'multiple_choice' && { backgroundColor: theme.colors.primary }
                                        ]}
                                        onPress={() => setNewQuestion({ ...newQuestion, type: 'multiple_choice' })}
                                    >
                                        <Text style={[
                                            styles.questionTypeButtonText,
                                            { color: newQuestion.type === 'multiple_choice' ? theme.colors.surface : theme.colors.text }
                                        ]}>
                                            Multiple Choice
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Multiple Choice Options */}
                            {newQuestion.type === 'multiple_choice' && (
                                <View style={styles.optionsContainer}>
                                    <Text style={[styles.optionsLabel, { color: theme.colors.text }]}>
                                        Options:
                                    </Text>
                                    {questionOptions.map((option, index) => (
                                        <View key={index} style={styles.optionRow}>
                                            <Text style={[styles.optionText, { color: theme.colors.text }]}>
                                                {index + 1}. {option}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => handleRemoveOption(index)}
                                                style={styles.removeOptionButton}
                                            >
                                                <Text style={[styles.removeOptionText, { color: theme.colors.error }]}>
                                                    ✕
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    <View style={styles.addOptionContainer}>
                                        <TextInput
                                            style={[styles.addOptionInput, {
                                                backgroundColor: theme.colors.background,
                                                color: theme.colors.text,
                                                borderColor: theme.colors.border
                                            }]}
                                            placeholder="Add option"
                                            placeholderTextColor={theme.colors.textSecondary}
                                            value={newOption}
                                            onChangeText={setNewOption}
                                        />
                                        <TouchableOpacity
                                            style={[styles.addOptionButton, { backgroundColor: theme.colors.primary }]}
                                            onPress={handleAddOption}
                                        >
                                            <Text style={[styles.addOptionButtonText, { color: theme.colors.surface }]}>
                                                Add
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: theme.colors.secondary }]}
                                    onPress={() => setShowQuestionModal(false)}
                                >
                                    <Text style={[styles.modalButtonText, { color: theme.colors.surface }]}>
                                        Done
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                                    onPress={handleAddQuestion}
                                >
                                    <Text style={[styles.modalButtonText, { color: theme.colors.surface }]}>
                                        Add Question
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Questions List */}
                            {selectedQuestionnaire && selectedQuestionnaire.questions.length > 0 && (
                                <View style={styles.questionsList}>
                                    <Text style={[styles.questionsListTitle, { color: theme.colors.text }]}>
                                        Current Questions:
                                    </Text>
                                    <FlatList
                                        data={selectedQuestionnaire.questions}
                                        renderItem={renderQuestionItem}
                                        keyExtractor={(item) => item.id}
                                        scrollEnabled={false}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    watermark: {
        fontSize: 24,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.8,
    },
    questionnairesContainer: {
        flex: 1,
    },
    questionnairesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyStateText: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
    questionnaireCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    questionnaireHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    questionnaireTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    templateBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    templateText: {
        fontSize: 12,
        fontWeight: '600',
    },
    questionnaireDescription: {
        fontSize: 14,
        marginBottom: 8,
    },
    questionnaireInfo: {
        fontSize: 12,
        opacity: 0.7,
    },
    questionItem: {
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    questionTypeIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    questionType: {
        fontSize: 12,
        fontWeight: '600',
        flex: 1,
    },
    requiredBadge: {
        fontSize: 10,
        fontWeight: '600',
    },
    questionText: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    optionsContainer: {
        marginTop: 8,
    },
    optionText: {
        fontSize: 12,
        marginBottom: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalScrollView: {
        flex: 1,
        width: '100%',
    },
    modalContent: {
        width: '90%',
        borderRadius: 12,
        padding: 20,
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalInput: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 12,
    },
    modalTextArea: {
        height: 80,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    questionTypeContainer: {
        marginBottom: 16,
    },
    questionTypeLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    questionTypeButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    questionTypeButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        marginHorizontal: 2,
    },
    questionTypeButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    optionsLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    removeOptionButton: {
        paddingHorizontal: 8,
    },
    removeOptionText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    addOptionContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    addOptionInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        fontSize: 14,
        marginRight: 8,
    },
    addOptionButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        justifyContent: 'center',
    },
    addOptionButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    questionsList: {
        marginTop: 20,
    },
    questionsListTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
}); 