import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';
import { useFaithMode } from '@/contexts/FaithModeContext';

const { width } = Dimensions.get('window');

interface SponsorshipRequest {
    name: string;
    email: string;
    message: string;
    sponsorType: string;
    photographyType: string;
    monthlyViews?: string;
    currentPlatforms: string[];
}

const SponsorshipScreen: React.FC = () => {
    const { faithMode } = useFaithMode();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<SponsorshipRequest>({
        name: '',
        email: '',
        message: '',
        sponsorType: '',
        photographyType: '',
        monthlyViews: '',
        currentPlatforms: [],
    });

    const sponsorTypes = [
        {
            id: 'church',
            label: 'Church/Ministry',
            description: 'A church or ministry wants to sponsor my visual ministry',
            icon: '⛪',
            faithMode: true,
        },
        {
            id: 'mentor',
            label: 'Mentor/Leader',
            description: 'A mentor or leader wants to support my creative journey',
            icon: '🌟',
            faithMode: true,
        },
        {
            id: 'business',
            label: 'Business Partner',
            description: 'A business partner or collaborator',
            icon: '🤝',
            faithMode: false,
        },
        {
            id: 'family',
            label: 'Family/Friend',
            description: 'Family member or friend sponsorship',
            icon: '❤️',
            faithMode: false,
        },
        {
            id: 'community',
            label: 'Community Support',
            description: 'Community or audience member support',
            icon: '👥',
            faithMode: false,
        },
        {
            id: 'other',
            label: 'Other',
            description: 'Other sponsorship arrangement',
            icon: '✨',
            faithMode: false,
        },
    ];

    const photographyTypes = [
        { id: 'portrait', label: 'Portrait', icon: '👤' },
        { id: 'wedding', label: 'Wedding', icon: '💒' },
        { id: 'landscape', label: 'Landscape', icon: '🏔️' },
        { id: 'street', label: 'Street', icon: '🏙️' },
        { id: 'wildlife', label: 'Wildlife', icon: '🦁' },
        { id: 'macro', label: 'Macro', icon: '🌸' },
        { id: 'documentary', label: 'Documentary', icon: '📷' },
        { id: 'commercial', label: 'Commercial', icon: '💼' },
        { id: 'fine-art', label: 'Fine Art', icon: '🎨' },
        { id: 'other', label: 'Other', icon: '✨' },
    ];

    const platforms = [
        { id: 'instagram', name: 'Instagram', icon: '📷' },
        { id: 'pinterest', name: 'Pinterest', icon: '📌' },
        { id: 'tiktok', name: 'TikTok', icon: '🎵' },
        { id: 'youtube', name: 'YouTube', icon: '📺' },
        { id: 'facebook', name: 'Facebook', icon: '📘' },
        { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
        { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
        { id: 'behance', name: 'Behance', icon: '🎨' },
        { id: 'dribbble', name: 'Dribbble', icon: '🏀' },
        { id: '500px', name: '500px', icon: '📸' },
        { id: 'other', name: 'Other', icon: '✨' },
    ];

    const handleSubmit = async () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.sponsorType || !formData.photographyType) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);
        try {
            const fullMessage = `
Sponsorship Request Details:

Name: ${formData.name}
Email: ${formData.email}
Sponsor Type: ${sponsorTypes.find(t => t.id === formData.sponsorType)?.label}
Photography Type: ${photographyTypes.find(t => t.id === formData.photographyType)?.label}
Monthly Views: ${formData.monthlyViews || 'Not specified'}
Current Platforms: ${formData.currentPlatforms.join(', ') || 'None specified'}

Message:
${formData.message || 'No additional message provided.'}

Requested on: ${new Date().toLocaleDateString()}
Faith Mode: ${faithMode ? 'Enabled' : 'Disabled'}
      `;

            // Mock API call - in real app, this would send to backend
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert(
                faithMode ? 'Prayer Sent! 🙏' : 'Request Sent! ✨',
                faithMode
                    ? 'Your sponsorship request has been sent to support@kingdomcollective.pro. Trust that God will provide the right sponsor for your visual ministry!'
                    : 'Your sponsorship request has been sent to support@kingdomcollective.pro. We\'ll help you find the right sponsor for your photography!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setFormData({
                                name: '',
                                email: '',
                                message: '',
                                sponsorType: '',
                                photographyType: '',
                                monthlyViews: '',
                                currentPlatforms: [],
                            });
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert(
                'Error',
                faithMode
                    ? 'Trust that God will work this out for good. Please try again.'
                    : 'Something went wrong. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePlatform = (platformId: string) => {
        setFormData(prev => ({
            ...prev,
            currentPlatforms: prev.currentPlatforms.includes(platformId)
                ? prev.currentPlatforms.filter(id => id !== platformId)
                : [...prev.currentPlatforms, platformId],
        }));
    };

    const renderSponsorTypeCard = (type: any) => (
        <TouchableOpacity
            key={type.id}
            style={[
                styles.sponsorTypeCard,
                formData.sponsorType === type.id && styles.selectedCard,
            ]}
            onPress={() => setFormData(prev => ({ ...prev, sponsorType: type.id }))}
        >
            <Text style={styles.sponsorTypeIcon}>{type.icon}</Text>
            <Text style={styles.sponsorTypeLabel}>{type.label}</Text>
            <Text style={styles.sponsorTypeDescription}>{type.description}</Text>
        </TouchableOpacity>
    );

    const renderPhotographyTypeCard = (type: any) => (
        <TouchableOpacity
            key={type.id}
            style={[
                styles.photographyTypeCard,
                formData.photographyType === type.id && styles.selectedCard,
            ]}
            onPress={() => setFormData(prev => ({ ...prev, photographyType: type.id }))}
        >
            <Text style={styles.photographyTypeIcon}>{type.icon}</Text>
            <Text style={styles.photographyTypeLabel}>{type.label}</Text>
        </TouchableOpacity>
    );

    const renderPlatformCard = (platform: any) => (
        <TouchableOpacity
            key={platform.id}
            style={[
                styles.platformCard,
                formData.currentPlatforms.includes(platform.id) && styles.selectedCard,
            ]}
            onPress={() => togglePlatform(platform.id)}
        >
            <Text style={styles.platformIcon}>{platform.icon}</Text>
            <Text style={styles.platformName}>{platform.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        {faithMode ? 'Visual Ministry Sponsorship' : 'Photography Sponsorship'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {faithMode
                            ? 'Request sponsorship to expand your visual ministry and share your creative testimony'
                            : 'Request sponsorship to grow your photography business and reach more clients'
                        }
                    </Text>
                </View>

                {/* Benefits Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sponsorship Benefits</Text>
                    <View style={styles.benefitsGrid}>
                        <View style={styles.benefitCard}>
                            <Ionicons name="camera" size={24} color="#9C27B0" />
                            <Text style={styles.benefitTitle}>Advanced AI Tools</Text>
                            <Text style={styles.benefitDescription}>Enhance your photos</Text>
                        </View>
                        <View style={styles.benefitCard}>
                            <Ionicons name="cloud-upload" size={24} color="#9C27B0" />
                            <Text style={styles.benefitTitle}>Cloud Storage</Text>
                            <Text style={styles.benefitDescription}>Store all your work</Text>
                        </View>
                        <View style={styles.benefitCard}>
                            <Ionicons name="analytics" size={24} color="#9C27B0" />
                            <Text style={styles.benefitTitle}>Client Analytics</Text>
                            <Text style={styles.benefitDescription}>Track your impact</Text>
                        </View>
                        <View style={styles.benefitCard}>
                            <Ionicons name="share-social" size={24} color="#9C27B0" />
                            <Text style={styles.benefitTitle}>Multi-Platform Publishing</Text>
                            <Text style={styles.benefitDescription}>Share everywhere</Text>
                        </View>
                    </View>
                </View>

                {/* Sponsor Type Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Who Would Sponsor You?</Text>
                    <View style={styles.sponsorTypesGrid}>
                        {sponsorTypes
                            .filter(type => !type.faithMode || faithMode)
                            .map(renderSponsorTypeCard)}
                    </View>
                </View>

                {/* Photography Type */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What Type of Photography Do You Do?</Text>
                    <View style={styles.photographyTypesGrid}>
                        {photographyTypes.map(renderPhotographyTypeCard)}
                    </View>
                </View>

                {/* Current Platforms */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Where Do You Currently Share?</Text>
                    <View style={styles.platformsGrid}>
                        {platforms.map(renderPlatformCard)}
                    </View>
                </View>

                {/* Form Fields */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tell Us About Yourself</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Name *</Text>
                        <TextInput
                            style={styles.textInput}
                            value={formData.name}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                            placeholder="Your name"
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email *</Text>
                        <TextInput
                            style={styles.textInput}
                            value={formData.email}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                            placeholder="your.email@example.com"
                            placeholderTextColor="#666"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Monthly Views (Optional)</Text>
                        <TextInput
                            style={styles.textInput}
                            value={formData.monthlyViews}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, monthlyViews: text }))}
                            placeholder="e.g., 10,000+ views"
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Additional Message</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            value={formData.message}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
                            placeholder={faithMode
                                ? "Share your vision for your visual ministry and how sponsorship would help you reach more souls..."
                                : "Share your vision for your photography and how sponsorship would help you reach more clients..."
                            }
                            placeholderTextColor="#666"
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <>
                                <Ionicons name="send" size={20} color="#FFFFFF" />
                                <Text style={styles.submitButtonText}>
                                    {faithMode ? 'Submit Prayer Request' : 'Submit Sponsorship Request'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Info Section */}
                <View style={styles.section}>
                    <BlurView intensity={15} style={styles.infoCard}>
                        <LinearGradient
                            colors={['rgba(156, 39, 176, 0.2)', 'rgba(156, 39, 176, 0.1)']}
                            style={styles.infoGradient}
                        >
                            <Text style={styles.infoTitle}>
                                {faithMode ? '🙏 About Visual Ministry Sponsorship' : '✨ About Photography Sponsorship'}
                            </Text>
                            <Text style={styles.infoText}>
                                {faithMode
                                    ? "Churches, mentors, and ministry leaders can sponsor your Kingdom Lens access. It's about community investing in visual ministers who are sharing the Gospel through their creative work."
                                    : "Mentors, businesses, and community leaders can sponsor your Kingdom Lens access. It's about investing in photographers who are making a positive impact through their visual art."
                                }
                            </Text>
                            <Text style={styles.infoContact}>
                                Questions? Contact us at support@kingdomcollective.pro
                            </Text>
                        </LinearGradient>
                    </BlurView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#CCCCCC',
        lineHeight: 22,
    },
    section: {
        padding: 20,
        paddingTop: 0,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    benefitsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    benefitCard: {
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(156, 39, 176, 0.3)',
    },
    benefitTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 8,
        textAlign: 'center',
    },
    benefitDescription: {
        fontSize: 12,
        color: '#CCCCCC',
        marginTop: 4,
        textAlign: 'center',
    },
    sponsorTypesGrid: {
        gap: 12,
    },
    sponsorTypeCard: {
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    selectedCard: {
        backgroundColor: 'rgba(156, 39, 176, 0.2)',
        borderColor: '#9C27B0',
    },
    sponsorTypeIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    sponsorTypeLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    sponsorTypeDescription: {
        fontSize: 14,
        color: '#CCCCCC',
        lineHeight: 18,
    },
    photographyTypesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    photographyTypeCard: {
        flex: 1,
        minWidth: '30%',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    photographyTypeIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    photographyTypeLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    platformsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    platformCard: {
        flex: 1,
        minWidth: '30%',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    platformIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    platformName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9C27B0',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    infoCard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    infoGradient: {
        padding: 20,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#CCCCCC',
        lineHeight: 20,
        marginBottom: 12,
    },
    infoContact: {
        fontSize: 14,
        color: '#9C27B0',
        fontWeight: '500',
    },
});

export default SponsorshipScreen; 