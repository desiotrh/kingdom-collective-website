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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface CreditCourse {
    id: string;
    title: string;
    description: string;
    modules: number;
    duration: string;
    price: number;
    students: number;
    rating: number;
    isActive: boolean;
    createdAt: Date;
}

interface DisputeLetter {
    id: string;
    type: 'charge-off' | 'late-payment' | 'inquiry' | 'balance' | 'account-status';
    title: string;
    template: string;
    variables: string[];
    isActive: boolean;
    createdAt: Date;
}

interface ServiceBundle {
    id: string;
    name: string;
    description: string;
    price: number;
    features: string[];
    isActive: boolean;
    sales: number;
    revenue: number;
    createdAt: Date;
}

const CreditEducationSuiteScreen: React.FC = () => {
    const [courses, setCourses] = useState<CreditCourse[]>([]);
    const [disputeLetters, setDisputeLetters] = useState<DisputeLetter[]>([]);
    const [serviceBundles, setServiceBundles] = useState<ServiceBundle[]>([]);
    const [selectedTab, setSelectedTab] = useState<'courses' | 'letters' | 'bundles'>('courses');
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showLetterModal, setShowLetterModal] = useState(false);
    const [showBundleModal, setShowBundleModal] = useState(false);
    const [newCourse, setNewCourse] = useState<Partial<CreditCourse>>({});
    const [newLetter, setNewLetter] = useState<Partial<DisputeLetter>>({});
    const [newBundle, setNewBundle] = useState<Partial<ServiceBundle>>({});

    useEffect(() => {
        setCourses([
            {
                id: '1',
                title: 'Credit Mastery Pro',
                description: 'Complete guide to understanding and improving your credit score',
                modules: 12,
                duration: '6 weeks',
                price: 197,
                students: 234,
                rating: 4.8,
                isActive: true,
                createdAt: new Date('2024-01-15')
            }
        ]);

        setDisputeLetters([
            {
                id: '1',
                type: 'charge-off',
                title: 'Charge-Off Dispute Letter',
                template: 'I am writing to dispute the following information in my credit report...',
                variables: ['creditor_name', 'account_number', 'dispute_reason'],
                isActive: true,
                createdAt: new Date('2024-01-15')
            }
        ]);

        setServiceBundles([
            {
                id: '1',
                name: 'Credit Repair Starter Pack',
                description: 'Essential tools for credit repair beginners',
                price: 97,
                features: [
                    'Credit Score Analysis',
                    '5 Dispute Letter Templates',
                    'Credit Monitoring Guide',
                    'Email Support'
                ],
                isActive: true,
                sales: 45,
                revenue: 4365,
                createdAt: new Date('2024-01-15')
            }
        ]);
    }, []);

    const addCourse = () => {
        if (!newCourse.title || !newCourse.description) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const course: CreditCourse = {
            id: Date.now().toString(),
            title: newCourse.title,
            description: newCourse.description,
            modules: newCourse.modules || 0,
            duration: newCourse.duration || '4 weeks',
            price: newCourse.price || 0,
            students: 0,
            rating: 0,
            isActive: true,
            createdAt: new Date()
        };

        setCourses([...courses, course]);
        setNewCourse({});
        setShowCourseModal(false);
        Alert.alert('Success', 'Course added successfully!');
    };

    const addDisputeLetter = () => {
        if (!newLetter.title || !newLetter.template) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const letter: DisputeLetter = {
            id: Date.now().toString(),
            type: newLetter.type || 'charge-off',
            title: newLetter.title,
            template: newLetter.template,
            variables: newLetter.variables || [],
            isActive: true,
            createdAt: new Date()
        };

        setDisputeLetters([...disputeLetters, letter]);
        setNewLetter({});
        setShowLetterModal(false);
        Alert.alert('Success', 'Dispute letter added successfully!');
    };

    const addServiceBundle = () => {
        if (!newBundle.name || !newBundle.description) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const bundle: ServiceBundle = {
            id: Date.now().toString(),
            name: newBundle.name,
            description: newBundle.description,
            price: newBundle.price || 0,
            features: newBundle.features || [],
            isActive: true,
            sales: 0,
            revenue: 0,
            createdAt: new Date()
        };

        setServiceBundles([...serviceBundles, bundle]);
        setNewBundle({});
        setShowBundleModal(false);
        Alert.alert('Success', 'Service bundle added successfully!');
    };

    const renderCourses = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📚 Credit Courses ({courses.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowCourseModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Course</Text>
                </TouchableOpacity>
            </View>

            {courses.map(course => (
                <View key={course.id} style={styles.courseCard}>
                    <View style={styles.courseHeader}>
                        <Text style={styles.courseTitle}>{course.title}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: course.isActive ? '#4CAF50' : '#f44336' }]}>
                            <Text style={styles.statusText}>{course.isActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                    </View>
                    <Text style={styles.courseDescription}>{course.description}</Text>
                    <View style={styles.courseMeta}>
                        <Text style={styles.courseModules}>{course.modules} modules</Text>
                        <Text style={styles.courseDuration}>{course.duration}</Text>
                        <Text style={styles.coursePrice}>${course.price}</Text>
                    </View>
                    <View style={styles.courseStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{course.students}</Text>
                            <Text style={styles.statLabel}>Students</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{course.rating}</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>${course.students * course.price}</Text>
                            <Text style={styles.statLabel}>Revenue</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderLetters = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📝 Dispute Letters ({disputeLetters.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowLetterModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Letter</Text>
                </TouchableOpacity>
            </View>

            {disputeLetters.map(letter => (
                <View key={letter.id} style={styles.letterCard}>
                    <View style={styles.letterHeader}>
                        <Text style={styles.letterTitle}>{letter.title}</Text>
                        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(letter.type) }]}>
                            <Text style={styles.typeText}>{letter.type.replace('-', ' ')}</Text>
                        </View>
                    </View>
                    <Text style={styles.letterTemplate}>{letter.template.substring(0, 100)}...</Text>
                    <View style={styles.variablesContainer}>
                        <Text style={styles.variablesTitle}>Variables:</Text>
                        {letter.variables.map((variable, index) => (
                            <View key={index} style={styles.variableBadge}>
                                <Text style={styles.variableText}>{variable}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );

    const renderBundles = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📦 Service Bundles ({serviceBundles.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowBundleModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Bundle</Text>
                </TouchableOpacity>
            </View>

            {serviceBundles.map(bundle => (
                <View key={bundle.id} style={styles.bundleCard}>
                    <View style={styles.bundleHeader}>
                        <Text style={styles.bundleTitle}>{bundle.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: bundle.isActive ? '#4CAF50' : '#f44336' }]}>
                            <Text style={styles.statusText}>{bundle.isActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                    </View>
                    <Text style={styles.bundleDescription}>{bundle.description}</Text>
                    <Text style={styles.bundlePrice}>${bundle.price}</Text>
                    <View style={styles.bundleFeatures}>
                        {bundle.features.map((feature, index) => (
                            <Text key={index} style={styles.featureItem}>• {feature}</Text>
                        ))}
                    </View>
                    <View style={styles.bundleStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{bundle.sales}</Text>
                            <Text style={styles.statLabel}>Sales</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>${bundle.revenue}</Text>
                            <Text style={styles.statLabel}>Revenue</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'charge-off': return '#f44336';
            case 'late-payment': return '#FF9800';
            case 'inquiry': return '#2196F3';
            case 'balance': return '#4CAF50';
            case 'account-status': return '#9C27B0';
            default: return '#666';
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>💳 Credit Education Suite</Text>
                <Text style={styles.headerSubtitle}>Create and sell credit repair tools and services</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'courses' && styles.activeTab]}
                    onPress={() => setSelectedTab('courses')}
                >
                    <Ionicons name="school" size={20} color={selectedTab === 'courses' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'courses' && styles.activeTabText]}>
                        Courses
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'letters' && styles.activeTab]}
                    onPress={() => setSelectedTab('letters')}
                >
                    <Ionicons name="document-text" size={20} color={selectedTab === 'letters' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'letters' && styles.activeTabText]}>
                        Letters
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'bundles' && styles.activeTab]}
                    onPress={() => setSelectedTab('bundles')}
                >
                    <Ionicons name="cube" size={20} color={selectedTab === 'bundles' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'bundles' && styles.activeTabText]}>
                        Bundles
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {selectedTab === 'courses' && renderCourses()}
                {selectedTab === 'letters' && renderLetters()}
                {selectedTab === 'bundles' && renderBundles()}

                {/* Course Modal */}
                <Modal
                    visible={showCourseModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowCourseModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Credit Course</Text>

                            <Text style={styles.inputLabel}>Course Title</Text>
                            <TextInput
                                style={styles.input}
                                value={newCourse.title}
                                onChangeText={(text) => setNewCourse({ ...newCourse, title: text })}
                                placeholder="Enter course title"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newCourse.description}
                                onChangeText={(text) => setNewCourse({ ...newCourse, description: text })}
                                placeholder="Enter course description..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Number of Modules</Text>
                            <TextInput
                                style={styles.input}
                                value={newCourse.modules?.toString()}
                                onChangeText={(text) => setNewCourse({ ...newCourse, modules: parseInt(text) || 0 })}
                                placeholder="Enter number of modules"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Duration</Text>
                            <TextInput
                                style={styles.input}
                                value={newCourse.duration}
                                onChangeText={(text) => setNewCourse({ ...newCourse, duration: text })}
                                placeholder="e.g., 4 weeks, 6 weeks"
                            />

                            <Text style={styles.inputLabel}>Price ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newCourse.price?.toString()}
                                onChangeText={(text) => setNewCourse({ ...newCourse, price: parseFloat(text) || 0 })}
                                placeholder="Enter price"
                                keyboardType="numeric"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addCourse}
                                >
                                    <Text style={styles.modalButtonText}>Add Course</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowCourseModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Letter Modal */}
                <Modal
                    visible={showLetterModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowLetterModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Dispute Letter</Text>

                            <Text style={styles.inputLabel}>Letter Title</Text>
                            <TextInput
                                style={styles.input}
                                value={newLetter.title}
                                onChangeText={(text) => setNewLetter({ ...newLetter, title: text })}
                                placeholder="Enter letter title"
                            />

                            <Text style={styles.inputLabel}>Type</Text>
                            <View style={styles.radioGroup}>
                                {['charge-off', 'late-payment', 'inquiry', 'balance', 'account-status'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newLetter.type === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewLetter({ ...newLetter, type: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type.replace('-', ' ')}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Template</Text>
                            <TextInput
                                style={[styles.input, { height: 120 }]}
                                value={newLetter.template}
                                onChangeText={(text) => setNewLetter({ ...newLetter, template: text })}
                                placeholder="Enter letter template..."
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addDisputeLetter}
                                >
                                    <Text style={styles.modalButtonText}>Add Letter</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowLetterModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Bundle Modal */}
                <Modal
                    visible={showBundleModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowBundleModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Service Bundle</Text>

                            <Text style={styles.inputLabel}>Bundle Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newBundle.name}
                                onChangeText={(text) => setNewBundle({ ...newBundle, name: text })}
                                placeholder="Enter bundle name"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newBundle.description}
                                onChangeText={(text) => setNewBundle({ ...newBundle, description: text })}
                                placeholder="Enter bundle description..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Price ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newBundle.price?.toString()}
                                onChangeText={(text) => setNewBundle({ ...newBundle, price: parseFloat(text) || 0 })}
                                placeholder="Enter price"
                                keyboardType="numeric"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addServiceBundle}
                                >
                                    <Text style={styles.modalButtonText}>Add Bundle</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowBundleModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
    courseCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    courseDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    courseMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    courseModules: {
        fontSize: 12,
        color: '#666',
    },
    courseDuration: {
        fontSize: 12,
        color: '#666',
    },
    coursePrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    courseStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#667eea',
    },
    statLabel: {
        fontSize: 10,
        color: '#666',
    },
    letterCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    letterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    letterTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    letterTemplate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    variablesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 4,
    },
    variablesTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    variableBadge: {
        backgroundColor: '#667eea',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    variableText: {
        fontSize: 10,
        color: '#fff',
    },
    bundleCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    bundleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bundleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bundleDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    bundlePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 8,
    },
    bundleFeatures: {
        marginBottom: 8,
    },
    featureItem: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    bundleStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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

export default CreditEducationSuiteScreen; 