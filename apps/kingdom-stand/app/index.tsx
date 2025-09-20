import { Link } from 'expo-router';
import { Text, View, StyleSheet, Image } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Kingdom Stand Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Kingdom Stand</Text>
      <Text style={styles.tagline}>Prepared to stand — rooted in truth and honesty</Text>
      <View style={styles.card}>
        <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
        <Text style={styles.disclaimerText}>
          Kingdom Stand provides legal information, not legal advice. We are not your attorney. For
          legal advice tailored to your situation, consult a licensed attorney. Criminal, immigration,
          and bankruptcy matters often require specialized counsel.
        </Text>
      </View>
      <Link href="/(tabs)" style={styles.link}>Enter App</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1020', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { width: 128, height: 128, marginBottom: 16 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginBottom: 8 },
  tagline: { color: '#FFFFFF', opacity: 0.9, fontSize: 14, textAlign: 'center', marginBottom: 16 },
  card: { backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,215,0,0.4)', borderWidth: 1, borderRadius: 12, padding: 16, width: '100%', maxWidth: 560 },
  disclaimerTitle: { color: '#FFD700', fontWeight: '800', marginBottom: 8 },
  disclaimerText: { color: '#FFFFFF', opacity: 0.9, fontSize: 12, lineHeight: 18 },
  link: { color: '#FFD700', marginTop: 16 }
});


