import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';

export const TermsOfServiceScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.subtitle}>Kingdom Studios App</Text>
        <Text style={styles.date}>Last Updated: July 9, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using the Kingdom Studios App ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Service Description</Text>
          <Text style={styles.paragraph}>
            Kingdom Studios App is a comprehensive platform for content creation, community building, and spiritual growth. Our services include content generation tools, social media management, community features, and faith-based resources.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.paragraph}>
            To access certain features of our Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Acceptable Use</Text>
          <Text style={styles.paragraph}>
            You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
          </Text>
          <Text style={styles.bulletPoint}>• To violate any applicable laws or regulations</Text>
          <Text style={styles.bulletPoint}>• To transmit harmful, offensive, or inappropriate content</Text>
          <Text style={styles.bulletPoint}>• To infringe upon intellectual property rights</Text>
          <Text style={styles.bulletPoint}>• To harass, abuse, or harm other users</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Content and Intellectual Property</Text>
          <Text style={styles.paragraph}>
            Users retain ownership of content they create using our Service. By using our Service, you grant Kingdom Studios a non-exclusive license to use, display, and distribute your content as necessary to provide the Service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Privacy</Text>
          <Text style={styles.paragraph}>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Subscription and Payments</Text>
          <Text style={styles.paragraph}>
            Some features of our Service require a paid subscription. All fees are non-refundable unless otherwise stated. We reserve the right to change our pricing at any time with notice.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Third-Party Integrations</Text>
          <Text style={styles.paragraph}>
            Our Service may integrate with third-party platforms and APIs, including but not limited to social media platforms, payment processors, and content services. Your use of these integrations is subject to their respective terms of service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            The Service is provided "as is" without any representations or warranties. We disclaim all warranties, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            In no event shall Kingdom Studios be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Termination</Text>
          <Text style={styles.paragraph}>
            We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms of Service, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>support@kingdomstudiosapp.com</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Kingdom Studios App, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.subtitle}>Kingdom Studios App</Text>
        <Text style={styles.date}>Last Updated: July 9, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
          </Text>
          <Text style={styles.subSectionTitle}>Personal Information:</Text>
          <Text style={styles.bulletPoint}>• Name and email address</Text>
          <Text style={styles.bulletPoint}>• Profile information and preferences</Text>
          <Text style={styles.bulletPoint}>• Content you create and share</Text>
          <Text style={styles.bulletPoint}>• Communication preferences</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to provide, maintain, and improve our services:
          </Text>
          <Text style={styles.bulletPoint}>• To provide and operate our Service</Text>
          <Text style={styles.bulletPoint}>• To send you technical notices and support messages</Text>
          <Text style={styles.bulletPoint}>• To communicate with you about products, services, and events</Text>
          <Text style={styles.bulletPoint}>• To monitor and analyze trends and usage</Text>
          <Text style={styles.bulletPoint}>• To personalize your experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.paragraph}>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:
          </Text>
          <Text style={styles.bulletPoint}>• With service providers who assist in our operations</Text>
          <Text style={styles.bulletPoint}>• When required by law or to protect our rights</Text>
          <Text style={styles.bulletPoint}>• In connection with a merger or acquisition</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Third-Party Services</Text>
          <Text style={styles.paragraph}>
            Our Service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Your Rights</Text>
          <Text style={styles.paragraph}>
            Depending on your location, you may have certain rights regarding your personal information:
          </Text>
          <Text style={styles.bulletPoint}>• Access and portability of your data</Text>
          <Text style={styles.bulletPoint}>• Correction of inaccurate information</Text>
          <Text style={styles.bulletPoint}>• Deletion of your information</Text>
          <Text style={styles.bulletPoint}>• Objection to processing</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. International Data Transfers</Text>
          <Text style={styles.paragraph}>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>support@kingdomstudiosapp.com</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Kingdom Studios App, you consent to the collection and use of your information as described in this Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6366f1',
    textAlign: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
    marginBottom: 4,
    marginLeft: 16,
  },
  contactInfo: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
    marginTop: 8,
  },
  footer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
