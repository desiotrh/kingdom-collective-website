import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/Kingdom Stand Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Kingdom Stand</Text>
        <Text style={styles.tagline}>Prepared to stand — rooted in truth and honesty</Text>
      </View>

      <View style={styles.disclaimerCard}>
        <Text style={styles.disclaimerTitle}>⚖️ Important Legal Disclaimer</Text>
        <Text style={styles.disclaimerText}>
          Kingdom Stand provides legal information, not legal advice. We are not your attorney. For
          legal advice tailored to your situation, consult a licensed attorney. Criminal, immigration,
          and bankruptcy matters often require specialized counsel.
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Core Features</Text>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📄</Text>
          <Text style={styles.featureTitle}>Document Converter</Text>
          <Text style={styles.featureDescription}>Convert documents to court-ready PDF/A format with OCR and Bates stamping</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📝</Text>
          <Text style={styles.featureTitle}>Testimony Builder</Text>
          <Text style={styles.featureDescription}>Structure your testimony with AI guidance and exhibit references</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>⚖️</Text>
          <Text style={styles.featureTitle}>Trial Strategy</Text>
          <Text style={styles.featureDescription}>Organize opening, witnesses, testimony, and closing for court</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🧘</Text>
          <Text style={styles.featureTitle}>Grounding Exercises</Text>
          <Text style={styles.featureDescription}>Calm your nerves before court with guided exercises</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>💬</Text>
          <Text style={styles.featureTitle}>Community FAQ</Text>
          <Text style={styles.featureDescription}>Find answers to common legal questions with verified sources</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1020' },
  header: { alignItems: 'center', padding: 24 },
  logo: { width: 80, height: 80, marginBottom: 12 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginBottom: 4 },
  tagline: { color: '#FFFFFF', opacity: 0.8, fontSize: 14, textAlign: 'center' },
  disclaimerCard: { 
    backgroundColor: 'rgba(255,215,0,0.1)', 
    borderColor: 'rgba(255,215,0,0.3)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16, 
    margin: 16 
  },
  disclaimerTitle: { color: '#FFD700', fontWeight: '800', marginBottom: 8, fontSize: 16 },
  disclaimerText: { color: '#FFFFFF', opacity: 0.9, fontSize: 13, lineHeight: 18 },
  featuresContainer: { padding: 16 },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 16 },
  featureCard: { 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderColor: 'rgba(255,255,255,0.1)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12 
  },
  featureIcon: { fontSize: 24, marginBottom: 8 },
  featureTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  featureDescription: { color: '#FFFFFF', opacity: 0.8, fontSize: 13, lineHeight: 18 },
});
