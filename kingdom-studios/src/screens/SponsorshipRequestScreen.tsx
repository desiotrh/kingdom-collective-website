import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAppNavigation } from '../utils/navigationUtils';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/UnifiedAuthContext';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';
import KingdomLogo from '../components/KingdomLogo';

const { width } = Dimensions.get('window');

const SponsorshipRequestScreen = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  const { requestSponsorship } = useApp();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    message: '',
    sponsorType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sponsorTypes = [
    {
      id: 'church',
      label: 'Church/Ministry',
      description: 'A church or ministry wants to sponsor me',
      icon: '⛪'
    },
    {
      id: 'mentor',
      label: 'Mentor/Leader',
      description: 'A mentor or leader wants to support my journey',
      icon: '🌟'
    },
    {
      id: 'business',
      label: 'Business Partner',
      description: 'A business partner or collaborator',
      icon: '🤝'
    },
    {
      id: 'family',
      label: 'Family/Friend',
      description: 'Family member or friend sponsorship',
      icon: '❤️'
    },
    {
      id: 'other',
      label: 'Other',
      description: 'Other sponsorship arrangement',
      icon: '✨'
    },
  ];

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.sponsorType) {
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

Message:
${formData.message || 'No additional message provided.'}

Requested on: ${new Date().toLocaleDateString()}
Faith Mode: ${faithMode ? 'Enabled' : 'Disabled'}
      `;

      await requestSponsorship(formData.email, fullMessage);

      Alert.alert(
        faithMode ? 'Prayer Sent! 🙏' : 'Request Sent! ✨',
        faithMode
          ? 'Your sponsorship request has been sent to support@kingdomcollective.pro. Trust that God will provide the right sponsor for your journey!'
          : 'Your sponsorship request has been sent to support@kingdomcollective.pro. We\'ll help you find the right sponsor for your creative journey!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
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

  const renderSponsorTypeCard = (type: typeof sponsorTypes[0]) => (
    <TouchableOpacity
      key={type.id}
      style={[
        styles.sponsorTypeCard,
        formData.sponsorType === type.id && styles.sponsorTypeCardSelected,
      ]}
      onPress={() => setFormData({ ...formData, sponsorType: type.id })}
      activeOpacity={0.8}
    >
      <BlurView intensity={15} style={styles.cardBlur}>
        <LinearGradient
          colors={
            formData.sponsorType === type.id
              ? ['rgba(255, 215, 0, 0.2)', 'rgba(255, 215, 0, 0.1)'] as const
              : ['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const
          }
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.sponsorTypeIcon}>{type.icon}</Text>
            <Text style={styles.sponsorTypeLabel}>{type.label}</Text>
          </View>
          <Text style={styles.sponsorTypeDescription}>{type.description}</Text>
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69'] as const}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <KingdomLogo size="small" />
              <Text style={styles.title}>Request Sponsorship</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Faith Message */}
            <BlurView intensity={10} style={styles.faithMessage}>
              <LinearGradient
                colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 215, 0, 0.05)'] as const}
                style={styles.faithGradient}
              >
                <Text style={styles.faithEmoji}>
                  {faithMode ? '🙏' : '✨'}
                </Text>
                <Text style={styles.faithText}>
                  {faithMode
                    ? "\"And my God will meet all your needs according to the riches of his glory in Christ Jesus.\" - Philippians 4:19"
                    : "Great things are ahead! Let's connect you with someone who believes in your vision."
                  }
                </Text>
              </LinearGradient>
            </BlurView>

            {/* What is Sponsorship */}
            <BlurView intensity={15} style={styles.infoSection}>
              <LinearGradient
                colors={['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const}
                style={styles.sectionGradient}
              >
                <Text style={styles.sectionTitle}>✨ What is Forge Sponsorship?</Text>
                <Text style={styles.infoText}>
                  {faithMode
                    ? "Forge Sponsorship allows churches, mentors, or supporters to cover your Kingdom Studios Pro access. It's about community investing in kingdom builders and creative entrepreneurs."
                    : "Forge Sponsorship allows mentors, businesses, or supporters to cover your Kingdom Studios Pro access. It's about community investing in creators and entrepreneurs."
                  }
                </Text>

                <View style={styles.benefitsList}>
                  <Text style={styles.benefitsTitle}>Premium Benefits Include:</Text>
                  <Text style={styles.benefitItem}>✓ Unlimited product management</Text>
                  <Text style={styles.benefitItem}>✓ Unlimited AI content generation</Text>
                  <Text style={styles.benefitItem}>✓ Advanced analytics & insights</Text>
                  <Text style={styles.benefitItem}>✓ Priority community access</Text>
                  <Text style={styles.benefitItem}>✓ Premium templates & tools</Text>
                </View>
              </LinearGradient>
            </BlurView>

            {/* Contact Information */}
            <BlurView intensity={15} style={styles.formSection}>
              <LinearGradient
                colors={['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const}
                style={styles.sectionGradient}
              >
                <Text style={styles.sectionTitle}>📋 Your Information</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Enter your full name"
                    placeholderTextColor={KingdomColors.text.muted}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="Enter your email"
                    placeholderTextColor={KingdomColors.text.muted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </LinearGradient>
            </BlurView>

            {/* Sponsor Type Selection */}
            <BlurView intensity={15} style={styles.formSection}>
              <LinearGradient
                colors={['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const}
                style={styles.sectionGradient}
              >
                <Text style={styles.sectionTitle}>🤝 Type of Sponsorship *</Text>
                <Text style={styles.sectionSubtitle}>Who might sponsor your access?</Text>

                <View style={styles.sponsorTypesContainer}>
                  {sponsorTypes.map(renderSponsorTypeCard)}
                </View>
              </LinearGradient>
            </BlurView>

            {/* Additional Message */}
            <BlurView intensity={15} style={styles.formSection}>
              <LinearGradient
                colors={['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const}
                style={styles.sectionGradient}
              >
                <Text style={styles.sectionTitle}>💬 Additional Message</Text>
                <Text style={styles.sectionSubtitle}>
                  {faithMode
                    ? "Share your heart and vision (optional)"
                    : "Tell us about your creative goals (optional)"
                  }
                </Text>

                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.message}
                  onChangeText={(text) => setFormData({ ...formData, message: text })}
                  placeholder={faithMode
                    ? "Share your testimony, goals, or why you're seeking sponsorship..."
                    : "Share your vision, goals, or why you're seeking sponsorship..."
                  }
                  placeholderTextColor={KingdomColors.text.muted}
                  multiline
                  numberOfLines={4}
                />
              </LinearGradient>
            </BlurView>

            {/* Contact Info */}
            <BlurView intensity={10} style={styles.contactInfo}>
              <LinearGradient
                colors={['rgba(192, 192, 192, 0.1)', 'rgba(192, 192, 192, 0.05)'] as const}
                style={styles.contactGradient}
              >
                <Text style={styles.contactTitle}>📞 Questions?</Text>
                <Text style={styles.contactText}>
                  Contact our support team at{' '}
                  <Text style={styles.contactEmail}>support@kingdomcollective.pro</Text>
                </Text>
              </LinearGradient>
            </BlurView>
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isSubmitting
                    ? ['#6B7280', '#4B5563'] as const
                    : ['#FFD700', '#FFC107', '#FF8F00'] as const
                }
                style={styles.submitGradient}
              >
                {isSubmitting ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color={KingdomColors.text.primary} size="small" />
                    <Text style={styles.submitButtonText}>Sending...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>
                    {faithMode ? 'Send Request 🙏' : 'Send Request ✨'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: KingdomColors.gold.bright,
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  faithMessage: {
    borderRadius: 20,
    marginVertical: 20,
    overflow: 'hidden',
    ...KingdomShadows.gold,
  },
  faithGradient: {
    padding: 20,
    alignItems: 'center',
  },
  faithEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  faithText: {
    fontSize: 14,
    color: KingdomColors.text.primary,
    lineHeight: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  infoSection: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  sectionGradient: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  benefitsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
    marginBottom: 12,
  },
  benefitItem: {
    fontSize: 14,
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  formSection: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: KingdomColors.text.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  sponsorTypesContainer: {
    gap: 12,
  },
  sponsorTypeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.silver,
  },
  cardBlur: {
    flex: 1,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sponsorTypeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sponsorTypeCardSelected: {
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
  },
  sponsorTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    flex: 1,
  },
  sponsorTypeDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
  },
  contactInfo: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  contactGradient: {
    padding: 20,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  contactEmail: {
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.gold,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default React.memo(SponsorshipRequestScreen);
