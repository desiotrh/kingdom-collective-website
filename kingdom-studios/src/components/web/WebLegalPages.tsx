import React from 'react';
import { TermsOfServiceScreen, PrivacyPolicyScreen } from '../../screens/legal/LegalPagesScreen';

// Web-specific wrapper for legal pages
export const WebTermsOfService = () => {
  return (
    <div style={webStyles.container}>
      <div style={webStyles.header}>
        <h1>Kingdom Studios App - Terms of Service</h1>
        <p>Effective Date: July 9, 2025</p>
      </div>
      <div style={webStyles.content}>
        <TermsOfServiceScreen />
      </div>
    </div>
  );
};

export const WebPrivacyPolicy = () => {
  return (
    <div style={webStyles.container}>
      <div style={webStyles.header}>
        <h1>Kingdom Studios App - Privacy Policy</h1>
        <p>Effective Date: July 9, 2025</p>
      </div>
      <div style={webStyles.content}>
        <PrivacyPolicyScreen />
      </div>
    </div>
  );
};

const webStyles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '2px solid #6366f1',
  },
  content: {
    lineHeight: 1.6,
  },
};
