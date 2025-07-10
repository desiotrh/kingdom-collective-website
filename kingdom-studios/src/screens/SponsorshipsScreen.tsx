/**
 * Kingdom Studios Sponsorships Screen
 * Premium sponsorship dashboard with modern fintech-inspired design
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors, KingdomGradients, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';

const { width, height } = Dimensions.get('window');

interface Sponsorship {
  id: string;
  sponsorName: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Pending';
  value: string;
  category: string;
}

interface SponsorshipMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const mockSponsorships: Sponsorship[] = [
  {
    id: '1',
    sponsorName: 'Faith Apparel Co.',
    startDate: '2025-05-01',
    endDate: '2025-08-01',
    status: 'Active',
    value: '$2,500',
    category: 'Fashion & Lifestyle',
  },
  {
    id: '2',
    sponsorName: 'Blessed Media',
    startDate: '2025-01-01',
    endDate: '2025-04-01',
    status: 'Expired',
    value: '$1,800',
    category: 'Digital Media',
  },
  {
    id: '3',
    sponsorName: 'Kingdom Creators Network',
    startDate: '2025-07-01',
    endDate: '2025-10-01',
    status: 'Pending',
    value: '$3,200',
    category: 'Creator Economy',
  },
];

const metrics: SponsorshipMetric[] = [
  { title: 'Total Earnings', value: '$7,500', change: '+12%', isPositive: true },
  { title: 'Active Deals', value: '1', change: '0', isPositive: true },
  { title: 'Pending Requests', value: '3', change: '+2', isPositive: true },
  { title: 'Success Rate', value: '85%', change: '+5%', isPositive: true },
];

export default function SponsorshipsScreen() {
  const navigation = useNavigation();
  const { faithMode } = useFaithMode();

  const [sponsorships, setSponsorships] = useState<Sponsorship[]>(mockSponsorships);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Handle form input changes
  function handleInputChange(field: keyof typeof form, value: string) {
    setForm({ ...form, [field]: value });
  }

  // Handle submission of sponsorship request
  async function handleSubmitRequest() {
    if (!form.name.trim() || !form.email.trim()) {
      Alert.alert('Error', 'Please fill out your name and email.');
      return;
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert(
        'Request Sent',
        faithMode 
          ? 'Thank you for your sponsorship request. We will get back to you soon with blessings and next steps.'
          : 'Thank you for your sponsorship request. We will get back to you soon with next steps.'
      );
      setForm({ name: '', email: '', message: '' });
      setRequesting(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to send request. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return KingdomColors.accent.success;
      case 'Expired': return KingdomColors.text.muted;
      case 'Pending': return KingdomColors.gold.warm;
      default: return KingdomColors.text.secondary;
    }
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <View style={[styles.statusBadge, { borderColor: getStatusColor(status) }]}>
      <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
      <Text style={[styles.statusText, { color: getStatusColor(status) }]}>{status}</Text>
    </View>
  );

  const MetricCard = ({ metric }: { metric: SponsorshipMetric }) => (
    <BlurView intensity={20} style={styles.metricCard}>
      <LinearGradient
        colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.05)']}
        style={styles.metricGradient}
      >
        <Text style={styles.metricTitle}>{metric.title}</Text>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <View style={styles.metricChange}>
          <Text style={[styles.changeText, { color: metric.isPositive ? KingdomColors.accent.success : KingdomColors.accent.error }]}>
            {metric.change}
          </Text>
          <Text style={styles.changeLabel}>this month</Text>
        </View>
      </LinearGradient>
    </BlurView>
  );

  const SponsorshipCard = ({ sponsorship }: { sponsorship: Sponsorship }) => (
    <BlurView intensity={15} style={styles.sponsorshipCard}>
      <LinearGradient
        colors={['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.sponsorName}>{sponsorship.sponsorName}</Text>
            <Text style={styles.sponsorCategory}>{sponsorship.category}</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.sponsorValue}>{sponsorship.value}</Text>
            <StatusBadge status={sponsorship.status} />
          </View>
        </View>
        
        <View style={styles.cardDetails}>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Start Date</Text>
            <Text style={styles.dateValue}>{sponsorship.startDate}</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>End Date</Text>
            <Text style={styles.dateValue}>{sponsorship.endDate}</Text>
          </View>
        </View>
      </LinearGradient>
    </BlurView>
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <KingdomLogo size="medium" />
              <Text style={styles.title}>Sponsorships</Text>
            </View>
            <View style={styles.headerRight} />
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Welcome Section */}
            <BlurView intensity={10} style={styles.welcomeCard}>
              <LinearGradient
                colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 215, 0, 0.05)']}
                style={styles.welcomeGradient}
              >
                <Text style={styles.welcomeTitle}>
                  {faithMode ? '✨ Blessed Partnerships' : '🤝 Premium Partnerships'}
                </Text>
                <Text style={styles.welcomeDescription}>
                  {faithMode 
                    ? "Join a faith-filled community of creators and brands working together for God's glory and purpose."
                    : "Connect with premium brands and unlock new revenue opportunities in the creator economy."
                  }
                </Text>
              </LinearGradient>
            </BlurView>

            {/* Metrics Grid */}
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <View style={styles.metricsGrid}>
              {metrics.map((metric, index) => (
                <MetricCard key={index} metric={metric} />
              ))}
            </View>

            {/* Active Sponsorships */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Sponsorships</Text>
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => setRequesting(true)}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFC107', '#FF8F00'] as const}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.requestButtonText}>+ New Request</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {sponsorships.map(sponsorship => (
              <SponsorshipCard key={sponsorship.id} sponsorship={sponsorship} />
            ))}

            {/* Request Form */}
            {requesting && (
              <BlurView intensity={20} style={styles.formContainer}>
                <LinearGradient
                  colors={['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const}
                  style={styles.formGradient}
                >
                  <Text style={styles.formTitle}>Request New Sponsorship</Text>
                  
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                  >
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Full Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your name"
                        placeholderTextColor={KingdomColors.text.muted}
                        value={form.name}
                        onChangeText={text => handleInputChange('name', text)}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Email Address</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor={KingdomColors.text.muted}
                        keyboardType="email-address"
                        value={form.email}
                        onChangeText={text => handleInputChange('email', text)}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Message (Optional)</Text>
                      <TextInput
                        style={[styles.input, styles.messageInput]}
                        placeholder="Tell us about your brand partnership goals..."
                        placeholderTextColor={KingdomColors.text.muted}
                        multiline
                        numberOfLines={4}
                        value={form.message}
                        onChangeText={text => handleInputChange('message', text)}
                      />
                    </View>

                    {loading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={KingdomColors.gold.bright} />
                        <Text style={styles.loadingText}>Sending request...</Text>
                      </View>
                    ) : (
                      <View style={styles.formButtons}>
                        <TouchableOpacity
                          style={styles.submitButton}
                          onPress={handleSubmitRequest}
                        >
                          <LinearGradient
                            colors={['#FFD700', '#FFC107', '#FF8F00'] as const}
                            style={styles.buttonGradient}
                          >
                            <Text style={styles.buttonText}>Send Request</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => setRequesting(false)}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </KeyboardAvoidingView>
                </LinearGradient>
              </BlurView>
            )}

            {/* Contact Info */}
            <BlurView intensity={10} style={styles.contactCard}>
              <LinearGradient
                colors={['rgba(192, 192, 192, 0.1)', 'rgba(192, 192, 192, 0.05)']}
                style={styles.contactGradient}
              >
                <Text style={styles.contactTitle}>Need Assistance?</Text>
                <Text style={styles.contactDescription}>
                  {faithMode 
                    ? "Our team is here to bless you with guidance on sponsorship opportunities."
                    : "Our team is here to help you maximize your sponsorship potential."
                  }
                </Text>
                <TouchableOpacity style={styles.contactButton}>
                  <Text style={styles.contactEmail}>support@kingdomstudiosapp.com</Text>
                </TouchableOpacity>
              </LinearGradient>
            </BlurView>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

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
    color: KingdomColors.gold.bright,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeCard: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    ...KingdomShadows.gold,
  },
  welcomeGradient: {
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  welcomeDescription: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  metricCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.silver,
  },
  metricGradient: {
    padding: 16,
  },
  metricTitle: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  changeLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  requestButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  requestButtonText: {
    color: KingdomColors.text.inverse,
    fontWeight: 'bold',
    fontSize: 14,
  },
  sponsorshipCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sponsorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  sponsorCategory: {
    fontSize: 14,
    color: KingdomColors.text.muted,
  },
  valueContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  sponsorValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDetails: {
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    color: KingdomColors.text.muted,
  },
  dateValue: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    fontWeight: '500',
  },
  formContainer: {
    borderRadius: 20,
    marginTop: 24,
    overflow: 'hidden',
    ...KingdomShadows.gold,
  },
  formGradient: {
    padding: 24,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: KingdomColors.text.primary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: KingdomColors.text.secondary,
    marginTop: 12,
    fontSize: 16,
  },
  formButtons: {
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonText: {
    color: KingdomColors.text.inverse,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButtonText: {
    color: KingdomColors.text.secondary,
    fontWeight: '500',
    fontSize: 16,
  },
  contactCard: {
    borderRadius: 16,
    marginTop: 32,
    overflow: 'hidden',
  },
  contactGradient: {
    padding: 20,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  contactButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  contactEmail: {
    color: KingdomColors.gold.bright,
    fontWeight: '600',
    fontSize: 14,
  },
});
