import React, { useState } from 'react';
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
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

interface CourseModule {
    id: string;
    title: string;
    description: string;
    type: 'video' | 'text' | 'quiz' | 'audio' | 'download';
    content: string;
    duration?: number; // in minutes
    isRequired: boolean;
    isLocked: boolean;
    unlockCondition?: 'previous_completed' | 'payment' | 'email' | 'custom';
    order: number;
    attachments?: string[];
    quizQuestions?: QuizQuestion[];
}

interface QuizQuestion {
    id: string;
    question: string;
    type: 'multiple_choice' | 'true_false' | 'text';
    options?: string[];
    correctAnswer: string;
    points: number;
}

interface Course {
    id: string;
    title: string;
    description: string;
    modules: CourseModule[];
    price: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CourseBuilderScreen: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
    const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseDescription, setNewCourseDescription] = useState('');
    const [newCoursePrice, setNewCoursePrice] = useState('');

    const moduleTypes = [
        { type: 'video', icon: 'videocam', label: 'Video Lesson', color: '#E91E63' },
        { type: 'text', icon: 'document-text', label: 'Text Lesson', color: '#2196F3' },
        { type: 'quiz', icon: 'help-circle', label: 'Quiz', color: '#FF9800' },
        { type: 'audio', icon: 'musical-notes', label: 'Audio Lesson', color: '#9C27B0' },
        { type: 'download', icon: 'download', label: 'Download', color: '#4CAF50' }
    ];

    const createNewCourse = () => {
        if (!newCourseName.trim() || !newCourseDescription.trim() || !newCoursePrice.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const newCourse: Course = {
            id: Date.now().toString(),
            title: newCourseName,
            description: newCourseDescription,
            modules: [],
            price: parseFloat(newCoursePrice),
            isPublished: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setCourses([...courses, newCourse]);
        setCurrentCourse(newCourse);
        setNewCourseName('');
        setNewCourseDescription('');
        setNewCoursePrice('');
        setShowCourseModal(false);
    };

    const addModule = (type: string) => {
        if (!currentCourse) return;

        const newModule: CourseModule = {
            id: Date.now().toString(),
            title: `New ${type} Module`,
            description: `Add description for ${type} module`,
            type: type as any,
            content: '',
            isRequired: true,
            isLocked: false,
            order: currentCourse.modules.length + 1
        };

        const updatedCourse = {
            ...currentCourse,
            modules: [...currentCourse.modules, newModule],
            updatedAt: new Date()
        };

        setCurrentCourse(updatedCourse);
        setCourses(courses.map(c => c.id === currentCourse.id ? updatedCourse : c));
    };

    const updateModule = (moduleId: string, updates: Partial<CourseModule>) => {
        if (!currentCourse) return;

        const updatedModules = currentCourse.modules.map(module =>
            module.id === moduleId ? { ...module, ...updates } : module
        );

        const updatedCourse = {
            ...currentCourse,
            modules: updatedModules,
            updatedAt: new Date()
        };

        setCurrentCourse(updatedCourse);
        setCourses(courses.map(c => c.id === currentCourse.id ? updatedCourse : c));
    };

    const deleteModule = (moduleId: string) => {
        if (!currentCourse) return;

        const updatedModules = currentCourse.modules.filter(module => module.id !== moduleId);
        const updatedCourse = {
            ...currentCourse,
            modules: updatedModules,
            updatedAt: new Date()
        };

        setCurrentCourse(updatedCourse);
        setCourses(courses.map(c => c.id === currentCourse.id ? updatedCourse : c));
    };

    const reorderModules = (fromIndex: number, toIndex: number) => {
        if (!currentCourse) return;

        const updatedModules = [...currentCourse.modules];
        const [movedModule] = updatedModules.splice(fromIndex, 1);
        updatedModules.splice(toIndex, 0, movedModule);

        // Update order numbers
        updatedModules.forEach((module, index) => {
            module.order = index + 1;
        });

        const updatedCourse = {
            ...currentCourse,
            modules: updatedModules,
            updatedAt: new Date()
        };

        setCurrentCourse(updatedCourse);
        setCourses(courses.map(c => c.id === currentCourse.id ? updatedCourse : c));
    };

    const saveCourse = () => {
        if (!currentCourse) return;

        const updatedCourses = courses.map(c =>
            c.id === currentCourse.id ? { ...currentCourse, updatedAt: new Date() } : c
        );
        setCourses(updatedCourses);
        Alert.alert('Success', 'Course saved successfully!');
    };

    const publishCourse = () => {
        if (!currentCourse) return;

        if (currentCourse.modules.length === 0) {
            Alert.alert('Error', 'Please add at least one module before publishing');
            return;
        }

        const updatedCourse = { ...currentCourse, isPublished: true, updatedAt: new Date() };
        setCurrentCourse(updatedCourse);
        setCourses(courses.map(c => c.id === currentCourse.id ? updatedCourse : c));
        Alert.alert('Success', 'Course published successfully!');
    };

    const pickVideo = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                return result.assets[0].uri;
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick video');
        }
        return null;
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
                return result.assets[0].uri;
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick document');
        }
        return null;
    };

    const renderModule = ({ item, index }: { item: CourseModule; index: number }) => {
        const moduleType = moduleTypes.find(mt => mt.type === item.type);

        return (
            <TouchableOpacity
                style={styles.moduleCard}
                onPress={() => {
                    setSelectedModule(item);
                    setShowModuleModal(true);
                }}
            >
                <View style={styles.moduleHeader}>
                    <View style={[styles.moduleIcon, { backgroundColor: moduleType?.color || '#999' }]}>
                        <Ionicons name={moduleType?.icon as any} size={20} color="#fff" />
                    </View>
                    <View style={styles.moduleInfo}>
                        <Text style={styles.moduleTitle}>{item.title}</Text>
                        <Text style={styles.moduleDescription}>{item.description}</Text>
                        <View style={styles.moduleMeta}>
                            <Text style={styles.moduleType}>{moduleType?.label}</Text>
                            {item.duration && <Text style={styles.moduleDuration}>{item.duration} min</Text>}
                            {item.isRequired && <Text style={styles.requiredBadge}>Required</Text>}
                            {item.isLocked && <Text style={styles.lockedBadge}>Locked</Text>}
                        </View>
                    </View>
                    <View style={styles.moduleActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => deleteModule(item.id)}
                        >
                            <Ionicons name="trash" size={16} color="#f44336" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                if (index > 0) reorderModules(index, index - 1);
                            }}
                        >
                            <Ionicons name="arrow-up" size={16} color="#666" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                if (index < currentCourse!.modules.length - 1) reorderModules(index, index + 1);
                            }}
                        >
                            <Ionicons name="arrow-down" size={16} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>📚 Course Builder</Text>
                <Text style={styles.headerSubtitle}>Create engaging online courses</Text>
            </LinearGradient>

            <ScrollView style={styles.content}>
                {/* Course Selection */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>📋 My Courses</Text>
                        <TouchableOpacity
                            style={styles.newButton}
                            onPress={() => setShowCourseModal(true)}
                        >
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.newButtonText}>New Course</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseScroll}>
                        {courses.map(course => (
                            <TouchableOpacity
                                key={course.id}
                                style={[styles.courseCard, currentCourse?.id === course.id && styles.selectedCourseCard]}
                                onPress={() => setCurrentCourse(course)}
                            >
                                <Text style={styles.courseName}>{course.title}</Text>
                                <Text style={styles.courseDescription}>{course.description}</Text>
                                <View style={styles.courseMeta}>
                                    <Text style={styles.courseModules}>{course.modules.length} modules</Text>
                                    <Text style={styles.coursePrice}>${course.price}</Text>
                                    {course.isPublished && <Text style={styles.publishedBadge}>Published</Text>}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Current Course */}
                {currentCourse && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>🎨 {currentCourse.title}</Text>
                            <View style={styles.courseActions}>
                                <TouchableOpacity style={styles.saveButton} onPress={saveCourse}>
                                    <Ionicons name="save" size={20} color="#fff" />
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                                {!currentCourse.isPublished && (
                                    <TouchableOpacity style={styles.publishButton} onPress={publishCourse}>
                                        <Ionicons name="globe" size={20} color="#fff" />
                                        <Text style={styles.publishButtonText}>Publish</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <Text style={styles.courseDescription}>{currentCourse.description}</Text>

                        {/* Module Types */}
                        <View style={styles.moduleTypes}>
                            <Text style={styles.moduleTypesTitle}>Add Module:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {moduleTypes.map(moduleType => (
                                    <TouchableOpacity
                                        key={moduleType.type}
                                        style={[styles.moduleTypeButton, { backgroundColor: moduleType.color }]}
                                        onPress={() => addModule(moduleType.type)}
                                    >
                                        <Ionicons name={moduleType.icon as any} size={20} color="#fff" />
                                        <Text style={styles.moduleTypeLabel}>{moduleType.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Modules List */}
                        <View style={styles.modulesSection}>
                            <Text style={styles.modulesTitle}>Modules ({currentCourse.modules.length})</Text>
                            <FlatList
                                data={currentCourse.modules.sort((a, b) => a.order - b.order)}
                                renderItem={renderModule}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                            />
                        </View>
                    </View>
                )}

                {/* Module Configuration Modal */}
                <Modal
                    visible={showModuleModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowModuleModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            {selectedModule && (
                                <>
                                    <Text style={styles.modalTitle}>Configure Module</Text>

                                    <Text style={styles.inputLabel}>Title</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={selectedModule.title}
                                        onChangeText={(text) => updateModule(selectedModule.id, { title: text })}
                                        placeholder="Module title"
                                    />

                                    <Text style={styles.inputLabel}>Description</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={selectedModule.description}
                                        onChangeText={(text) => updateModule(selectedModule.id, { description: text })}
                                        placeholder="Module description"
                                        multiline
                                    />

                                    {selectedModule.type === 'video' && (
                                        <>
                                            <Text style={styles.inputLabel}>Video Content</Text>
                                            <TouchableOpacity
                                                style={styles.uploadButton}
                                                onPress={async () => {
                                                    const videoUri = await pickVideo();
                                                    if (videoUri) {
                                                        updateModule(selectedModule.id, { content: videoUri });
                                                    }
                                                }}
                                            >
                                                <Ionicons name="videocam" size={20} color="#fff" />
                                                <Text style={styles.uploadButtonText}>Upload Video</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

                                    {selectedModule.type === 'text' && (
                                        <>
                                            <Text style={styles.inputLabel}>Text Content</Text>
                                            <TextInput
                                                style={[styles.input, { height: 120 }]}
                                                value={selectedModule.content}
                                                onChangeText={(text) => updateModule(selectedModule.id, { content: text })}
                                                placeholder="Enter your lesson content..."
                                                multiline
                                                textAlignVertical="top"
                                            />
                                        </>
                                    )}

                                    {selectedModule.type === 'download' && (
                                        <>
                                            <Text style={styles.inputLabel}>File Upload</Text>
                                            <TouchableOpacity
                                                style={styles.uploadButton}
                                                onPress={async () => {
                                                    const fileUri = await pickDocument();
                                                    if (fileUri) {
                                                        updateModule(selectedModule.id, { content: fileUri });
                                                    }
                                                }}
                                            >
                                                <Ionicons name="document" size={20} color="#fff" />
                                                <Text style={styles.uploadButtonText}>Upload File</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

                                    <View style={styles.settingRow}>
                                        <Text style={styles.settingLabel}>Required Module</Text>
                                        <Switch
                                            value={selectedModule.isRequired}
                                            onValueChange={(value) => updateModule(selectedModule.id, { isRequired: value })}
                                        />
                                    </View>

                                    <View style={styles.settingRow}>
                                        <Text style={styles.settingLabel}>Locked Module</Text>
                                        <Switch
                                            value={selectedModule.isLocked}
                                            onValueChange={(value) => updateModule(selectedModule.id, { isLocked: value })}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setShowModuleModal(false)}
                                    >
                                        <Text style={styles.closeButtonText}>Save & Close</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </Modal>

                {/* New Course Modal */}
                <Modal
                    visible={showCourseModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowCourseModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create New Course</Text>

                            <Text style={styles.inputLabel}>Course Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newCourseName}
                                onChangeText={setNewCourseName}
                                placeholder="Enter course name"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newCourseDescription}
                                onChangeText={setNewCourseDescription}
                                placeholder="Enter course description"
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Price ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newCoursePrice}
                                onChangeText={setNewCoursePrice}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createNewCourse}
                                >
                                    <Text style={styles.modalButtonText}>Create Course</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowCourseModal(false)}
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
    courseScroll: {
        marginBottom: 8,
    },
    courseCard: {
        width: 200,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    selectedCourseCard: {
        borderColor: '#667eea',
        backgroundColor: '#667eea10',
    },
    courseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    courseDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    courseMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    courseModules: {
        fontSize: 12,
        color: '#999',
    },
    coursePrice: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    publishedBadge: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    courseActions: {
        flexDirection: 'row',
        gap: 8,
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
    publishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    publishButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    moduleTypes: {
        marginBottom: 16,
    },
    moduleTypesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    moduleTypeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 8,
    },
    moduleTypeLabel: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    modulesSection: {
        marginTop: 16,
    },
    modulesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
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
    },
    moduleIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
    moduleType: {
        fontSize: 12,
        color: '#999',
    },
    moduleDuration: {
        fontSize: 12,
        color: '#999',
    },
    requiredBadge: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#FF9800',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    lockedBadge: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#f44336',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    moduleActions: {
        flexDirection: 'row',
        gap: 4,
    },
    actionButton: {
        padding: 4,
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
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    uploadButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
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

export default CourseBuilderScreen; 