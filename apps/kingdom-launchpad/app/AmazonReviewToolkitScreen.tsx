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

interface AmazonReview {
    id: string;
    productName: string;
    productUrl: string;
    program: 'vine' | 'rebaid' | 'manual' | 'other';
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    reviewType: 'video' | 'text' | 'photo' | 'all';
    requirements: string;
    deadline: Date;
    compensation: string;
    createdAt: Date;
    uploadedFiles: ReviewFile[];
    pitchEmails: PitchEmail[];
}

interface ReviewFile {
    id: string;
    reviewId: string;
    fileUrl: string;
    fileType: 'video' | 'image' | 'text';
    description: string;
    uploadedAt: Date;
    isApproved: boolean;
}

interface PitchEmail {
    id: string;
    reviewId: string;
    recipient: string;
    subject: string;
    content: string;
    status: 'draft' | 'sent' | 'replied' | 'accepted';
    sentAt?: Date;
    repliedAt?: Date;
}

interface ProgramApplication {
    id: string;
    programName: string;
    programUrl: string;
    requirements: string;
    status: 'applied' | 'approved' | 'rejected' | 'active';
    appliedAt: Date;
    approvedAt?: Date;
    notes: string;
}

interface Testimonial {
    id: string;
    productName: string;
    reviewText: string;
    rating: number;
    platform: 'amazon' | 'website' | 'social';
    isRepurposed: boolean;
    repurposedContent: string[];
    createdAt: Date;
}

const AmazonReviewToolkitScreen: React.FC = () => {
    const [reviews, setReviews] = useState<AmazonReview[]>([]);
    const [applications, setApplications] = useState<ProgramApplication[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [selectedTab, setSelectedTab] = useState<'reviews' | 'applications' | 'testimonials' | 'resources'>('reviews');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [showTestimonialModal, setShowTestimonialModal] = useState(false);
    const [newReview, setNewReview] = useState<Partial<AmazonReview>>({});
    const [newApplication, setNewApplication] = useState<Partial<ProgramApplication>>({});
    const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({});

    // Mock data
    useEffect(() => {
        setReviews([
            {
                id: '1',
                productName: 'Faith-Based Business Course',
                productUrl: 'https://amazon.com/dp/B08XXXXX',
                program: 'vine',
                status: 'approved',
                reviewType: 'video',
                requirements: 'Create a 2-3 minute video review showing the course content and sharing personal results',
                deadline: new Date('2024-02-15'),
                compensation: 'Free course access + $50 gift card',
                createdAt: new Date('2024-01-20'),
                uploadedFiles: [
                    {
                        id: '1',
                        reviewId: '1',
                        fileUrl: 'https://example.com/review-video.mp4',
                        fileType: 'video',
                        description: 'Main review video',
                        uploadedAt: new Date('2024-01-25'),
                        isApproved: true
                    }
                ],
                pitchEmails: [
                    {
                        id: '1',
                        reviewId: '1',
                        recipient: 'vine@amazon.com',
                        subject: 'Vine Voice Application - Faith-Based Business Course',
                        content: 'I would love to review this faith-based business course...',
                        status: 'accepted',
                        sentAt: new Date('2024-01-21'),
                        repliedAt: new Date('2024-01-22')
                    }
                ]
            },
            {
                id: '2',
                productName: 'Prayer Journal Planner',
                productUrl: 'https://amazon.com/dp/B09XXXXX',
                program: 'rebaid',
                status: 'pending',
                reviewType: 'all',
                requirements: 'Text review with photos showing the journal quality and features',
                deadline: new Date('2024-02-20'),
                compensation: 'Product reimbursement',
                createdAt: new Date('2024-01-22'),
                uploadedFiles: [],
                pitchEmails: []
            }
        ]);

        setApplications([
            {
                id: '1',
                programName: 'Amazon Vine Voice',
                programUrl: 'https://vine.amazon.com',
                requirements: 'Active Amazon account, verified purchases, helpful reviews',
                status: 'approved',
                appliedAt: new Date('2024-01-15'),
                approvedAt: new Date('2024-01-20'),
                notes: 'Successfully approved for faith-based content reviews'
            },
            {
                id: '2',
                programName: 'Rebaid Review Program',
                programUrl: 'https://rebaid.com',
                requirements: 'Social media presence, review history, content creation skills',
                status: 'applied',
                appliedAt: new Date('2024-01-18'),
                notes: 'Application submitted, waiting for response'
            }
        ]);

        setTestimonials([
            {
                id: '1',
                productName: 'Faith-Based Business Course',
                reviewText: 'This course completely transformed how I approach business. The faith integration is authentic and practical.',
                rating: 5,
                platform: 'amazon',
                isRepurposed: true,
                repurposedContent: [
                    'Social media post: "Transformed my business approach with faith-based principles"',
                    'Website testimonial: "Authentic faith integration in business"',
                    'Email sequence: "How this course changed everything"'
                ],
                createdAt: new Date('2024-01-15')
            }
        ]);
    }, []);

    const addReview = () => {
        if (!newReview.productName || !newReview.program) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const review: AmazonReview = {
            id: Date.now().toString(),
            productName: newReview.productName,
            productUrl: newReview.productUrl || '',
            program: newReview.program,
            status: 'pending',
            reviewType: newReview.reviewType || 'all',
            requirements: newReview.requirements || '',
            deadline: newReview.deadline || new Date(),
            compensation: newReview.compensation || '',
            createdAt: new Date(),
            uploadedFiles: [],
            pitchEmails: []
        };

        setReviews([...reviews, review]);
        setNewReview({});
        setShowReviewModal(false);
        Alert.alert('Success', 'Review added successfully!');
    };

    const addApplication = () => {
        if (!newApplication.programName || !newApplication.programUrl) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const application: ProgramApplication = {
            id: Date.now().toString(),
            programName: newApplication.programName,
            programUrl: newApplication.programUrl,
            requirements: newApplication.requirements || '',
            status: 'applied',
            appliedAt: new Date(),
            notes: newApplication.notes || ''
        };

        setApplications([...applications, application]);
        setNewApplication({});
        setShowApplicationModal(false);
        Alert.alert('Success', 'Application added successfully!');
    };

    const addTestimonial = () => {
        if (!newTestimonial.productName || !newTestimonial.reviewText) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const testimonial: Testimonial = {
            id: Date.now().toString(),
            productName: newTestimonial.productName,
            reviewText: newTestimonial.reviewText,
            rating: newTestimonial.rating || 5,
            platform: newTestimonial.platform || 'amazon',
            isRepurposed: false,
            repurposedContent: [],
            createdAt: new Date()
        };

        setTestimonials([...testimonials, testimonial]);
        setNewTestimonial({});
        setShowTestimonialModal(false);
        Alert.alert('Success', 'Testimonial added successfully!');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FF9800';
            case 'approved': return '#4CAF50';
            case 'rejected': return '#f44336';
            case 'completed': return '#9C27B0';
            case 'applied': return '#2196F3';
            case 'active': return '#4CAF50';
            default: return '#666';
        }
    };

    const getProgramIcon = (program: string) => {
        switch (program) {
            case 'vine': return 'leaf';
            case 'rebaid': return 'star';
            case 'manual': return 'hand';
            default: return 'document';
        }
    };

    const renderReviews = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📝 Amazon Reviews ({reviews.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowReviewModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Review</Text>
                </TouchableOpacity>
            </View>

            {reviews.map(review => (
                <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                        <Ionicons name={getProgramIcon(review.program) as any} size={20} color="#667eea" />
                        <Text style={styles.reviewProduct}>{review.productName}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(review.status) }]}>
                            <Text style={styles.statusText}>{review.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.reviewProgram}>{review.program.toUpperCase()} • {review.reviewType}</Text>
                    <Text style={styles.reviewRequirements}>{review.requirements}</Text>
                    <View style={styles.reviewMeta}>
                        <Text style={styles.reviewCompensation}>{review.compensation}</Text>
                        <Text style={styles.reviewDeadline}>Due: {review.deadline.toLocaleDateString()}</Text>
                        <Text style={styles.reviewDate}>{review.createdAt.toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.reviewStats}>
                        <Text style={styles.statItem}>📁 {review.uploadedFiles.length} files</Text>
                        <Text style={styles.statItem}>📧 {review.pitchEmails.length} emails</Text>
                        <Text style={styles.statItem}>🔗 {review.productUrl ? 'Link' : 'No link'}</Text>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderApplications = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📋 Program Applications ({applications.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowApplicationModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Application</Text>
                </TouchableOpacity>
            </View>

            {applications.map(application => (
                <View key={application.id} style={styles.applicationCard}>
                    <View style={styles.applicationHeader}>
                        <Text style={styles.applicationName}>{application.programName}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) }]}>
                            <Text style={styles.statusText}>{application.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.applicationUrl}>{application.programUrl}</Text>
                    <Text style={styles.applicationRequirements}>{application.requirements}</Text>
                    <View style={styles.applicationMeta}>
                        <Text style={styles.applicationDate}>Applied: {application.appliedAt.toLocaleDateString()}</Text>
                        {application.approvedAt && (
                            <Text style={styles.approvedDate}>Approved: {application.approvedAt.toLocaleDateString()}</Text>
                        )}
                    </View>
                    {application.notes && (
                        <Text style={styles.applicationNotes}>{application.notes}</Text>
                    )}
                </View>
            ))}
        </View>
    );

    const renderTestimonials = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>💬 Testimonials ({testimonials.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowTestimonialModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Testimonial</Text>
                </TouchableOpacity>
            </View>

            {testimonials.map(testimonial => (
                <View key={testimonial.id} style={styles.testimonialCard}>
                    <View style={styles.testimonialHeader}>
                        <Text style={styles.testimonialProduct}>{testimonial.productName}</Text>
                        <View style={styles.ratingContainer}>
                            {[...Array(5)].map((_, i) => (
                                <Ionicons
                                    key={i}
                                    name={i < testimonial.rating ? 'star' : 'star-outline'}
                                    size={16}
                                    color="#FFD700"
                                />
                            ))}
                        </View>
                    </View>
                    <Text style={styles.testimonialText}>{testimonial.reviewText}</Text>
                    <View style={styles.testimonialMeta}>
                        <Text style={styles.testimonialPlatform}>{testimonial.platform}</Text>
                        <Text style={styles.testimonialDate}>{testimonial.createdAt.toLocaleDateString()}</Text>
                        <View style={[styles.repurposedBadge, { backgroundColor: testimonial.isRepurposed ? '#4CAF50' : '#FF9800' }]}>
                            <Text style={styles.repurposedBadgeText}>
                                {testimonial.isRepurposed ? 'Repurposed' : 'Not Repurposed'}
                            </Text>
                        </View>
                    </View>
                    {testimonial.isRepurposed && testimonial.repurposedContent.length > 0 && (
                        <View style={styles.repurposedContent}>
                            <Text style={styles.repurposedTitle}>Repurposed Content:</Text>
                            {testimonial.repurposedContent.map((content, index) => (
                                <Text key={index} style={styles.repurposedItem}>• {content}</Text>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </View>
    );

    const renderResources = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 Review Resources</Text>
            <Text style={styles.sectionDescription}>
                Tools and templates for Amazon reviews
            </Text>

            <View style={styles.resourceCard}>
                <Text style={styles.resourceTitle}>📧 Auto-Pitch Email Generator</Text>
                <Text style={styles.resourceDescription}>
                    Generate professional pitch emails for different review programs
                </Text>
                <TouchableOpacity style={styles.resourceButton}>
                    <Text style={styles.resourceButtonText}>Generate Email</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.resourceCard}>
                <Text style={styles.resourceTitle}>📝 Review Script Templates</Text>
                <Text style={styles.resourceDescription}>
                    Pre-written scripts for video and text reviews
                </Text>
                <TouchableOpacity style={styles.resourceButton}>
                    <Text style={styles.resourceButtonText}>View Templates</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.resourceCard}>
                <Text style={styles.resourceTitle}>🎬 Thumbnail Generator</Text>
                <Text style={styles.resourceDescription}>
                    Create eye-catching thumbnails for review videos
                </Text>
                <TouchableOpacity style={styles.resourceButton}>
                    <Text style={styles.resourceButtonText}>Create Thumbnail</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.resourceCard}>
                <Text style={styles.resourceTitle}>📊 Review Analytics</Text>
                <Text style={styles.resourceDescription}>
                    Track review performance and conversion rates
                </Text>
                <TouchableOpacity style={styles.resourceButton}>
                    <Text style={styles.resourceButtonText}>View Analytics</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>📦 Amazon Review Toolkit</Text>
                <Text style={styles.headerSubtitle}>Manage product reviews, program applications, and auto-pitch emails</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'reviews' && styles.activeTab]}
                    onPress={() => setSelectedTab('reviews')}
                >
                    <Ionicons name="document-text" size={20} color={selectedTab === 'reviews' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'reviews' && styles.activeTabText]}>
                        Reviews
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'applications' && styles.activeTab]}
                    onPress={() => setSelectedTab('applications')}
                >
                    <Ionicons name="clipboard" size={20} color={selectedTab === 'applications' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'applications' && styles.activeTabText]}>
                        Applications
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'testimonials' && styles.activeTab]}
                    onPress={() => setSelectedTab('testimonials')}
                >
                    <Ionicons name="chatbubble-ellipses" size={20} color={selectedTab === 'testimonials' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'testimonials' && styles.activeTabText]}>
                        Testimonials
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'resources' && styles.activeTab]}
                    onPress={() => setSelectedTab('resources')}
                >
                    <Ionicons name="library" size={20} color={selectedTab === 'resources' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'resources' && styles.activeTabText]}>
                        Resources
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{reviews.length}</Text>
                        <Text style={styles.statLabel}>Reviews</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{applications.length}</Text>
                        <Text style={styles.statLabel}>Applications</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{testimonials.length}</Text>
                        <Text style={styles.statLabel}>Testimonials</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {testimonials.filter(t => t.isRepurposed).length}
                        </Text>
                        <Text style={styles.statLabel}>Repurposed</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'reviews' && renderReviews()}
                {selectedTab === 'applications' && renderApplications()}
                {selectedTab === 'testimonials' && renderTestimonials()}
                {selectedTab === 'resources' && renderResources()}

                {/* Review Modal */}
                <Modal
                    visible={showReviewModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowReviewModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Amazon Review</Text>

                            <Text style={styles.inputLabel}>Product Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newReview.productName}
                                onChangeText={(text) => setNewReview({ ...newReview, productName: text })}
                                placeholder="Enter product name"
                            />

                            <Text style={styles.inputLabel}>Product URL</Text>
                            <TextInput
                                style={styles.input}
                                value={newReview.productUrl}
                                onChangeText={(text) => setNewReview({ ...newReview, productUrl: text })}
                                placeholder="Enter Amazon product URL"
                            />

                            <Text style={styles.inputLabel}>Program</Text>
                            <View style={styles.radioGroup}>
                                {['vine', 'rebaid', 'manual', 'other'].map(program => (
                                    <TouchableOpacity
                                        key={program}
                                        style={[
                                            styles.radioButton,
                                            newReview.program === program && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewReview({ ...newReview, program: program as any })}
                                    >
                                        <Text style={styles.radioLabel}>{program}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Review Type</Text>
                            <View style={styles.radioGroup}>
                                {['video', 'text', 'photo', 'all'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newReview.reviewType === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewReview({ ...newReview, reviewType: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Requirements</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newReview.requirements}
                                onChangeText={(text) => setNewReview({ ...newReview, requirements: text })}
                                placeholder="Enter review requirements..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Compensation</Text>
                            <TextInput
                                style={styles.input}
                                value={newReview.compensation}
                                onChangeText={(text) => setNewReview({ ...newReview, compensation: text })}
                                placeholder="Enter compensation details"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addReview}
                                >
                                    <Text style={styles.modalButtonText}>Add Review</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowReviewModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Application Modal */}
                <Modal
                    visible={showApplicationModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowApplicationModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Program Application</Text>

                            <Text style={styles.inputLabel}>Program Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newApplication.programName}
                                onChangeText={(text) => setNewApplication({ ...newApplication, programName: text })}
                                placeholder="Enter program name"
                            />

                            <Text style={styles.inputLabel}>Program URL</Text>
                            <TextInput
                                style={styles.input}
                                value={newApplication.programUrl}
                                onChangeText={(text) => setNewApplication({ ...newApplication, programUrl: text })}
                                placeholder="Enter program URL"
                            />

                            <Text style={styles.inputLabel}>Requirements</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newApplication.requirements}
                                onChangeText={(text) => setNewApplication({ ...newApplication, requirements: text })}
                                placeholder="Enter program requirements..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Notes</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newApplication.notes}
                                onChangeText={(text) => setNewApplication({ ...newApplication, notes: text })}
                                placeholder="Enter application notes..."
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addApplication}
                                >
                                    <Text style={styles.modalButtonText}>Add Application</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowApplicationModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Testimonial Modal */}
                <Modal
                    visible={showTestimonialModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowTestimonialModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Testimonial</Text>

                            <Text style={styles.inputLabel}>Product Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newTestimonial.productName}
                                onChangeText={(text) => setNewTestimonial({ ...newTestimonial, productName: text })}
                                placeholder="Enter product name"
                            />

                            <Text style={styles.inputLabel}>Review Text</Text>
                            <TextInput
                                style={[styles.input, { height: 120 }]}
                                value={newTestimonial.reviewText}
                                onChangeText={(text) => setNewTestimonial({ ...newTestimonial, reviewText: text })}
                                placeholder="Enter the testimonial text..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Rating</Text>
                            <View style={styles.radioGroup}>
                                {[1, 2, 3, 4, 5].map(rating => (
                                    <TouchableOpacity
                                        key={rating}
                                        style={[
                                            styles.radioButton,
                                            newTestimonial.rating === rating && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewTestimonial({ ...newTestimonial, rating })}
                                    >
                                        <Text style={styles.radioLabel}>{rating} Stars</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Platform</Text>
                            <View style={styles.radioGroup}>
                                {['amazon', 'website', 'social'].map(platform => (
                                    <TouchableOpacity
                                        key={platform}
                                        style={[
                                            styles.radioButton,
                                            newTestimonial.platform === platform && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewTestimonial({ ...newTestimonial, platform: platform as any })}
                                    >
                                        <Text style={styles.radioLabel}>{platform}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addTestimonial}
                                >
                                    <Text style={styles.modalButtonText}>Add Testimonial</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowTestimonialModal(false)}
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
    reviewCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    reviewProduct: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
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
        textTransform: 'capitalize',
    },
    reviewProgram: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    reviewRequirements: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    reviewMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    reviewCompensation: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    reviewDeadline: {
        fontSize: 12,
        color: '#666',
    },
    reviewDate: {
        fontSize: 12,
        color: '#999',
    },
    reviewStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        fontSize: 12,
        color: '#666',
    },
    applicationCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    applicationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    applicationName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    applicationUrl: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    applicationRequirements: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    applicationMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    applicationDate: {
        fontSize: 12,
        color: '#666',
    },
    approvedDate: {
        fontSize: 12,
        color: '#4CAF50',
    },
    applicationNotes: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    testimonialCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    testimonialHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    testimonialProduct: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    testimonialText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    testimonialMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    testimonialPlatform: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    testimonialDate: {
        fontSize: 12,
        color: '#999',
    },
    repurposedBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    repurposedBadgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    repurposedContent: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    repurposedTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    repurposedItem: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    resourceCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    resourceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    resourceDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    resourceButton: {
        backgroundColor: '#667eea',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    resourceButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
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

export default AmazonReviewToolkitScreen; 