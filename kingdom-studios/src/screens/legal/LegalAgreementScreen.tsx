import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';

interface LegalAgreementProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const LegalAgreementScreen: React.FC<LegalAgreementProps> = ({ onAccept, onDecline }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const openTermsOfService = () => {
    Linking.openURL('https://kingdomstudiosapp.com/terms').catch(() => {
      Alert.alert('Error', 'Unable to open Terms of Service. Please try again later.');
    });
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://kingdomstudiosapp.com/privacy').catch(() => {
      Alert.alert('Error', 'Unable to open Privacy Policy. Please try again later.');
    });
  };

  const handleAccept = () => {
    if (termsAccepted && privacyAccepted) {
      onAccept();
    } else {
      Alert.alert(
        'Agreement Required',
        'Please accept both the Terms of Service and Privacy Policy to continue.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Kingdom Studios</Text>
          <Text style={styles.subtitle}>
            Before we begin, please review and accept our legal agreements.
          </Text>
        </View>

        <View style={styles.agreementSection}>
          <View style={styles.agreementItem}>
            <TouchableOpacity
              style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <View style={styles.agreementText}>
              <Text style={styles.agreementLabel}>
                I have read and agree to the{' '}
                <Text style={styles.link} onPress={openTermsOfService}>
                  Terms of Service
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.agreementItem}>
            <TouchableOpacity
              style={[styles.checkbox, privacyAccepted && styles.checkboxChecked]}
              onPress={() => setPrivacyAccepted(!privacyAccepted)}
            >
              {privacyAccepted && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <View style={styles.agreementText}>
              <Text style={styles.agreementLabel}>
                I have read and agree to the{' '}
                <Text style={styles.link} onPress={openPrivacyPolicy}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>What this means:</Text>
          <Text style={styles.infoText}>
            • We'll use your data to provide our services{'\n'}
            • We respect your privacy and won't sell your information{'\n'}
            • You own the content you create{'\n'}
            • We'll keep your account secure{'\n'}
            • You can delete your account anytime
          </Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactText}>
            Questions? Contact us at{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('mailto:support@kingdomcollective.pro')}
            >
              support@kingdomcollective.pro
            </Text>
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.acceptButton,
              (!termsAccepted || !privacyAccepted) && styles.acceptButtonDisabled
            ]}
            onPress={handleAccept}
            disabled={!termsAccepted || !privacyAccepted}
          >
            <Text style={styles.acceptButtonText}>Accept & Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
  },
  agreementSection: {
    marginBottom: 32,
  },
  agreementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#cbd5e0',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  agreementText: {
    flex: 1,
  },
  agreementLabel: {
    fontSize: 16,
    color: '#2d3748',
    lineHeight: 24,
  },
  link: {
    color: '#6366f1',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  infoSection: {
    backgroundColor: '#e6fffa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#234e52',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#285e61',
    lineHeight: 20,
  },
  contactSection: {
    marginBottom: 32,
  },
  contactText: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  acceptButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: '#cbd5e0',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  declineButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  declineButtonText: {
    color: '#4a5568',
    fontSize: 16,
    fontWeight: '500',
  },
});
