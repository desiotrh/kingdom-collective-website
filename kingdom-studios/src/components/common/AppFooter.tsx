import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

interface AppFooterProps {
  style?: any;
  showAllLinks?: boolean;
}

export const AppFooter: React.FC<AppFooterProps> = ({ style, showAllLinks = true }) => {
  const openTermsOfService = () => {
    Linking.openURL('https://kingdomstudiosapp.com/terms').catch(() => {
      console.warn('Unable to open Terms of Service');
    });
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://kingdomstudiosapp.com/privacy').catch(() => {
      console.warn('Unable to open Privacy Policy');
    });
  };

  const openSupport = () => {
    Linking.openURL('mailto:support@kingdomstudiosapp.com').catch(() => {
      console.warn('Unable to open email client');
    });
  };

  const openWebsite = () => {
    Linking.openURL('https://kingdomstudiosapp.com').catch(() => {
      console.warn('Unable to open website');
    });
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={openTermsOfService} style={styles.link}>
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
        
        <Text style={styles.separator}>•</Text>
        
        <TouchableOpacity onPress={openPrivacyPolicy} style={styles.link}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
        
        {showAllLinks && (
          <>
            <Text style={styles.separator}>•</Text>
            <TouchableOpacity onPress={openSupport} style={styles.link}>
              <Text style={styles.linkText}>Support</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      
      {showAllLinks && (
        <TouchableOpacity onPress={openWebsite} style={styles.websiteLink}>
          <Text style={styles.websiteText}>kingdomstudiosapp.com</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.copyright}>
        © 2025 Kingdom Studios. All rights reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  link: {
    paddingHorizontal: 4,
  },
  linkText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    color: '#9ca3af',
    fontSize: 14,
    marginHorizontal: 8,
  },
  websiteLink: {
    marginBottom: 8,
  },
  websiteText: {
    color: '#4a5568',
    fontSize: 14,
    fontWeight: '600',
  },
  copyright: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
  },
});
