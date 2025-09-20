import { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

export default function PrepareScreen() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const preparationTools = [
    {
      id: 'testimony-builder',
      title: 'Testimony Builder',
      icon: '🎤',
      description: 'Structure your personal story with AI guidance',
      features: ['Guided Q&A', 'Exhibit references', 'Factual validation', 'Timeline organization'],
    },
    {
      id: 'witness-affidavit',
      title: 'Witness Affidavit Helper',
      icon: '📝',
      description: 'Create notarized witness statements',
      features: ['State templates', 'Notary guidance', 'Auto-format', 'Perjury warnings'],
    },
    {
      id: 'trial-strategy',
      title: 'Trial Strategy File',
      icon: '⚖️',
      description: 'Organize your entire court presentation',
      features: ['Opening statement', 'Witness questions', 'Closing prep', 'Courtroom mode'],
    },
  ];

  const courtroomTabs = [
    { id: 'opening', title: 'Opening', icon: '🎯' },
    { id: 'witnesses', title: 'Witnesses', icon: '👥' },
    { id: 'testimony', title: 'My Testimony', icon: '🎤' },
    { id: 'closing', title: 'Closing', icon: '⚖️' },
    { id: 'exhibits', title: 'Exhibits', icon: '📄' },
    { id: 'notes', title: 'Notes', icon: '📝' },
  ];

  const preCourtChecklist = [
    { task: 'Print 3 copies of all documents', completed: false },
    { task: 'Organize exhibits in order', completed: false },
    { task: 'Plan to arrive 30 minutes early', completed: false },
    { task: 'Review courthouse security rules', completed: false },
    { task: 'Practice opening statement', completed: false },
    { task: 'Review witness questions', completed: false },
  ];

  const handleToolLaunch = (toolId: string) => {
    Alert.alert(
      'Feature Coming Soon',
      `${preparationTools.find(t => t.id === toolId)?.title} will be available in the next update.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Trial Preparation</Text>
        <Text style={styles.subtitle}>Build your case strategy step by step</Text>
      </View>

      <View style={styles.disclaimerCard}>
        <Text style={styles.disclaimerTitle}>⚠️ Important Safeguards</Text>
        <Text style={styles.disclaimerText}>
          All tools create educational drafts only. Review carefully, keep testimony factual, 
          and remember that perjury is a crime. This is not legal advice.
        </Text>
      </View>

      <View style={styles.toolsSection}>
        <Text style={styles.sectionTitle}>Preparation Tools</Text>
        
        {preparationTools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.toolCard}
            onPress={() => handleToolLaunch(tool.id)}
          >
            <View style={styles.toolHeader}>
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              <View style={styles.toolInfo}>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </View>
            </View>
            <View style={styles.toolFeatures}>
              {tool.features.map((feature, index) => (
                <Text key={index} style={styles.toolFeature}>• {feature}</Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.courtroomSection}>
        <Text style={styles.sectionTitle}>Courtroom Mode Preview</Text>
        <Text style={styles.sectionSubtitle}>Large text, swipe navigation, distraction-free</Text>
        
        <View style={styles.tabsPreview}>
          {courtroomTabs.map((tab) => (
            <View key={tab.id} style={styles.tabPreview}>
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={styles.tabTitle}>{tab.title}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.checklistSection}>
        <Text style={styles.sectionTitle}>Pre-Court Checklist</Text>
        
        {preCourtChecklist.map((item, index) => (
          <View key={index} style={styles.checklistItem}>
            <View style={styles.checkbox}>
              <Text style={styles.checkboxText}>{item.completed ? '✅' : '☐'}</Text>
            </View>
            <Text style={styles.checklistText}>{item.task}</Text>
          </View>
        ))}
      </View>

      <View style={styles.afterCourtSection}>
        <Text style={styles.sectionTitle}>After Court Guide</Text>
        <View style={styles.afterCourtCard}>
          <Text style={styles.afterCourtTitle}>📋 Next Steps</Text>
          <Text style={styles.afterCourtText}>
            • Get written order from clerk{'\n'}
            • Calendar any deadlines{'\n'}
            • Review appeal timeline{'\n'}
            • Follow up on required actions
          </Text>
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
  
  disclaimerCard: { 
    backgroundColor: 'rgba(255,100,100,0.1)', 
    borderColor: 'rgba(255,100,100,0.3)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16, 
    margin: 16 
  },
  disclaimerTitle: { color: '#FF6464', fontWeight: '800', marginBottom: 8 },
  disclaimerText: { color: '#FFFFFF', opacity: 0.9, fontSize: 13, lineHeight: 18 },
  
  toolsSection: { margin: 16 },
  sectionTitle: { color: '#FFD700', fontSize: 18, fontWeight: '800', marginBottom: 12 },
  sectionSubtitle: { color: '#FFFFFF', opacity: 0.7, fontSize: 13, marginBottom: 12 },
  
  toolCard: { 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderColor: 'rgba(255,215,0,0.3)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12 
  },
  toolHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  toolIcon: { fontSize: 24, marginRight: 12 },
  toolInfo: { flex: 1 },
  toolTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  toolDescription: { color: '#FFFFFF', opacity: 0.8, fontSize: 13 },
  toolFeatures: {},
  toolFeature: { color: '#FFFFFF', opacity: 0.7, fontSize: 12, marginBottom: 2 },
  
  courtroomSection: { margin: 16 },
  tabsPreview: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tabPreview: { 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderRadius: 8, 
    padding: 12, 
    alignItems: 'center', 
    minWidth: 80 
  },
  tabIcon: { fontSize: 20, marginBottom: 4 },
  tabTitle: { color: '#FFFFFF', fontSize: 11, textAlign: 'center' },
  
  checklistSection: { margin: 16 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  checkbox: { width: 24, alignItems: 'center', marginRight: 12 },
  checkboxText: { fontSize: 16 },
  checklistText: { color: '#FFFFFF', fontSize: 14, flex: 1 },
  
  afterCourtSection: { margin: 16, marginBottom: 32 },
  afterCourtCard: { 
    backgroundColor: 'rgba(0,255,136,0.1)', 
    borderColor: 'rgba(0,255,136,0.3)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16 
  },
  afterCourtTitle: { color: '#00FF88', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  afterCourtText: { color: '#FFFFFF', opacity: 0.9, fontSize: 13, lineHeight: 20 },
});
