import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

export default function DocumentsScreen() {
  const handleDocumentAction = (action: string) => {
    Alert.alert('Feature Coming Soon', `${action} functionality will be available in the next update.`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📄 Document Converter</Text>
        <Text style={styles.subtitle}>Convert documents to court-ready PDF/A format</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => handleDocumentAction('Court Print Ready')}
        >
          <Text style={styles.actionIcon}>⚖️</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Court Print Ready</Text>
            <Text style={styles.actionDescription}>PDF/A + OCR + 300dpi + normalized margins</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => handleDocumentAction('Print 3 Copies')}
        >
          <Text style={styles.actionIcon}>🖨️</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Print 3 Copies</Text>
            <Text style={styles.actionDescription}>Standard court filing requirement</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => handleDocumentAction('Email to Myself')}
        >
          <Text style={styles.actionIcon}>📧</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Email to Myself</Text>
            <Text style={styles.actionDescription}>Send processed document via email</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Supported Formats</Text>
        <View style={styles.formatGrid}>
          <View style={styles.formatCard}>
            <Text style={styles.formatTitle}>Input</Text>
            <Text style={styles.formatList}>JPG, PNG, HEIC{'\n'}DOC, DOCX, TXT{'\n'}RTF, HTML, CSV</Text>
          </View>
          <View style={styles.formatCard}>
            <Text style={styles.formatTitle}>Output</Text>
            <Text style={styles.formatList}>PDF{'\n'}PDF/A (court-compliant){'\n'}OCR searchable text</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Tools</Text>
        <View style={styles.toolsList}>
          <Text style={styles.toolItem}>• Merge multiple documents</Text>
          <Text style={styles.toolItem}>• Split and reorder pages</Text>
          <Text style={styles.toolItem}>• Rotate and compress</Text>
          <Text style={styles.toolItem}>• Bates/exhibit stamping</Text>
          <Text style={styles.toolItem}>• Auto cover sheet generation</Text>
          <Text style={styles.toolItem}>• Smart filename: CaseNo_Party_ExhibitX_Date.pdf</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1020' },
  header: { padding: 20, alignItems: 'center' },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginBottom: 8 },
  subtitle: { color: '#FFFFFF', opacity: 0.8, fontSize: 14, textAlign: 'center' },
  section: { margin: 16 },
  sectionTitle: { color: '#FFD700', fontSize: 18, fontWeight: '800', marginBottom: 12 },
  actionCard: { 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderColor: 'rgba(255,215,0,0.3)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionIcon: { fontSize: 24, marginRight: 12 },
  actionContent: { flex: 1 },
  actionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  actionDescription: { color: '#FFFFFF', opacity: 0.7, fontSize: 13 },
  formatGrid: { flexDirection: 'row', gap: 12 },
  formatCard: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderRadius: 12, 
    padding: 16 
  },
  formatTitle: { color: '#FFD700', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  formatList: { color: '#FFFFFF', opacity: 0.9, fontSize: 13, lineHeight: 18 },
  toolsList: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16 },
  toolItem: { color: '#FFFFFF', opacity: 0.9, fontSize: 13, lineHeight: 20, marginBottom: 4 },
});
