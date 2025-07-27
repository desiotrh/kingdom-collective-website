import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Switch,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Breakthrough {
  id: string;
  type: 'salvation' | 'breakthrough' | 'testimony' | 'healing' | 'provision';
  title: string;
  description: string;
  personName?: string;
  date: Date;
  impact: 'low' | 'medium' | 'high';
  isPublic: boolean;
  tags: string[];
  prayerPoints?: string[];
  followUpNeeded: boolean;
  followUpDate?: Date;
}

interface SpiritualImpact {
  id: string;
  metric: string;
  value: number;
  target: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
}

interface PrayerRequest {
  id: string;
  request: string;
  requester: string;
  date: Date;
  status: 'active' | 'answered' | 'closed';
  answeredDate?: Date;
  testimony?: string;
}

interface ScripturePrompt {
  id: string;
  verse: string;
  context: string;
  application: string;
  date: Date;
  isActive: boolean;
}

const BreakthroughBoardScreen: React.FC = () => {
  const [breakthroughs, setBreakthroughs] = useState<Breakthrough[]>([]);
  const [spiritualImpact, setSpiritualImpact] = useState<SpiritualImpact[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [scripturePrompts, setScripturePrompts] = useState<ScripturePrompt[]>([]);
  const [selectedTab, setSelectedTab] = useState<'breakthroughs' | 'impact' | 'prayer' | 'scripture'>('breakthroughs');
  const [showBreakthroughModal, setShowBreakthroughModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [showScriptureModal, setShowScriptureModal] = useState(false);
  const [newBreakthrough, setNewBreakthrough] = useState<Partial<Breakthrough>>({});
  const [newPrayerRequest, setNewPrayerRequest] = useState<Partial<PrayerRequest>>({});
  const [newScripturePrompt, setNewScripturePrompt] = useState<Partial<ScripturePrompt>>({});

  // Mock data
  useEffect(() => {
    setBreakthroughs([
      {
        id: '1',
        type: 'salvation',
        title: 'New Believer in Christ',
        description: 'Someone accepted Jesus through our online ministry',
        personName: 'Sarah M.',
        date: new Date('2024-01-15'),
        impact: 'high',
        isPublic: true,
        tags: ['online', 'salvation', 'praise'],
        prayerPoints: ['Continued growth in faith', 'Discipleship opportunities'],
        followUpNeeded: true,
        followUpDate: new Date('2024-01-22')
      },
      {
        id: '2',
        type: 'breakthrough',
        title: 'Financial Provision',
        description: 'Unexpected provision came through for ministry needs',
        date: new Date('2024-01-10'),
        impact: 'medium',
        isPublic: false,
        tags: ['provision', 'faith', 'ministry'],
        prayerPoints: ['Stewardship wisdom', 'Continued provision'],
        followUpNeeded: false
      },
      {
        id: '3',
        type: 'testimony',
        title: 'Healing Testimony',
        description: 'Physical healing experienced during prayer',
        personName: 'John D.',
        date: new Date('2024-01-08'),
        impact: 'high',
        isPublic: true,
        tags: ['healing', 'prayer', 'testimony'],
        prayerPoints: ['Continued health', 'Sharing testimony'],
        followUpNeeded: true,
        followUpDate: new Date('2024-01-15')
      }
    ]);

    setSpiritualImpact([
      {
        id: '1',
        metric: 'Salvations',
        value: 12,
        target: 20,
        period: 'monthly',
        lastUpdated: new Date(),
        trend: 'up'
      },
      {
        id: '2',
        metric: 'Prayer Requests',
        value: 45,
        target: 50,
        period: 'monthly',
        lastUpdated: new Date(),
        trend: 'stable'
      },
      {
        id: '3',
        metric: 'Testimonies Shared',
        value: 8,
        target: 10,
        period: 'monthly',
        lastUpdated: new Date(),
        trend: 'up'
      },
      {
        id: '4',
        metric: 'Breakthroughs',
        value: 15,
        target: 25,
        period: 'monthly',
        lastUpdated: new Date(),
        trend: 'down'
      }
    ]);

    setPrayerRequests([
      {
        id: '1',
        request: 'Prayer for family member with health issues',
        requester: 'Anonymous',
        date: new Date('2024-01-20'),
        status: 'active'
      },
      {
        id: '2',
        request: 'Guidance for business decisions',
        requester: 'Mike S.',
        date: new Date('2024-01-18'),
        status: 'answered',
        answeredDate: new Date('2024-01-19'),
        testimony: 'God provided clear direction through prayer and scripture'
      }
    ]);

    setScripturePrompts([
      {
        id: '1',
        verse: 'Philippians 4:6-7',
        context: 'Anxiety and worry',
        application: 'Pray with thanksgiving, receive God\'s peace',
        date: new Date('2024-01-20'),
        isActive: true
      },
      {
        id: '2',
        verse: 'Proverbs 3:5-6',
        context: 'Decision making',
        application: 'Trust in the Lord, acknowledge Him in all ways',
        date: new Date('2024-01-19'),
        isActive: true
      }
    ]);
  }, []);

  const addBreakthrough = () => {
    if (!newBreakthrough.title || !newBreakthrough.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const breakthrough: Breakthrough = {
      id: Date.now().toString(),
      type: newBreakthrough.type || 'breakthrough',
      title: newBreakthrough.title,
      description: newBreakthrough.description,
      personName: newBreakthrough.personName,
      date: new Date(),
      impact: newBreakthrough.impact || 'medium',
      isPublic: newBreakthrough.isPublic || false,
      tags: newBreakthrough.tags || [],
      prayerPoints: newBreakthrough.prayerPoints,
      followUpNeeded: newBreakthrough.followUpNeeded || false,
      followUpDate: newBreakthrough.followUpDate
    };

    setBreakthroughs([...breakthroughs, breakthrough]);
    setNewBreakthrough({});
    setShowBreakthroughModal(false);
    Alert.alert('Success', 'Breakthrough recorded! Praise God!');
  };

  const addPrayerRequest = () => {
    if (!newPrayerRequest.request) {
      Alert.alert('Error', 'Please enter your prayer request');
      return;
    }

    const prayerRequest: PrayerRequest = {
      id: Date.now().toString(),
      request: newPrayerRequest.request,
      requester: newPrayerRequest.requester || 'Anonymous',
      date: new Date(),
      status: 'active'
    };

    setPrayerRequests([...prayerRequests, prayerRequest]);
    setNewPrayerRequest({});
    setShowPrayerModal(false);
    Alert.alert('Success', 'Prayer request added. We\'ll be praying!');
  };

  const addScripturePrompt = () => {
    if (!newScripturePrompt.verse || !newScripturePrompt.context) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const scripturePrompt: ScripturePrompt = {
      id: Date.now().toString(),
      verse: newScripturePrompt.verse,
      context: newScripturePrompt.context,
      application: newScripturePrompt.application || '',
      date: new Date(),
      isActive: true
    };

    setScripturePrompts([...scripturePrompts, scripturePrompt]);
    setNewScripturePrompt({});
    setShowScriptureModal(false);
    Alert.alert('Success', 'Scripture prompt added!');
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'low': return '#f44336';
      default: return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'salvation': return 'heart';
      case 'breakthrough': return 'flash';
      case 'testimony': return 'chatbubble-ellipses';
      case 'healing': return 'medical';
      case 'provision': return 'gift';
      default: return 'star';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      case 'stable': return 'remove';
      default: return 'remove';
    }
  };

  const renderBreakthroughs = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🙏 Breakthroughs ({breakthroughs.length})</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowBreakthroughModal(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Record Breakthrough</Text>
        </TouchableOpacity>
      </View>

      {breakthroughs.map(breakthrough => (
        <View key={breakthrough.id} style={styles.breakthroughCard}>
          <View style={styles.breakthroughHeader}>
            <View style={styles.breakthroughIcon}>
              <Ionicons name={getTypeIcon(breakthrough.type) as any} size={24} color="#667eea" />
            </View>
            <View style={styles.breakthroughInfo}>
              <Text style={styles.breakthroughTitle}>{breakthrough.title}</Text>
              <Text style={styles.breakthroughType}>{breakthrough.type}</Text>
              {breakthrough.personName && (
                <Text style={styles.breakthroughPerson}>{breakthrough.personName}</Text>
              )}
            </View>
            <View style={[styles.impactBadge, { backgroundColor: getImpactColor(breakthrough.impact) }]}>
              <Text style={styles.impactText}>{breakthrough.impact}</Text>
            </View>
          </View>
          <Text style={styles.breakthroughDescription}>{breakthrough.description}</Text>
          <Text style={styles.breakthroughDate}>{breakthrough.date.toLocaleDateString()}</Text>
          <View style={styles.breakthroughTags}>
            {breakthrough.tags.map(tag => (
              <Text key={tag} style={styles.tag}>{tag}</Text>
            ))}
          </View>
          {breakthrough.prayerPoints && breakthrough.prayerPoints.length > 0 && (
            <View style={styles.prayerPoints}>
              <Text style={styles.prayerPointsTitle}>Prayer Points:</Text>
              {breakthrough.prayerPoints.map((point, index) => (
                <Text key={index} style={styles.prayerPoint}>• {point}</Text>
              ))}
            </View>
          )}
          {breakthrough.followUpNeeded && (
            <View style={styles.followUp}>
              <Ionicons name="alert-circle" size={16} color="#FF9800" />
              <Text style={styles.followUpText}>Follow-up needed</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderSpiritualImpact = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📊 Spiritual Impact Metrics</Text>
      <Text style={styles.sectionDescription}>
        Track salvations, breakthroughs, testimonies, and spiritual growth
      </Text>

      {spiritualImpact.map(metric => (
        <View key={metric.id} style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricName}>{metric.metric}</Text>
            <View style={styles.metricTrend}>
              <Ionicons name={getTrendIcon(metric.trend) as any} size={16} color="#667eea" />
            </View>
          </View>
          <View style={styles.metricValues}>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricTarget}>/ {metric.target}</Text>
          </View>
          <View style={styles.metricProgress}>
            <View style={[styles.progressFill, { width: `${(metric.value / metric.target) * 100}%` }]} />
          </View>
          <Text style={styles.metricPeriod}>{metric.period}</Text>
        </View>
      ))}
    </View>
  );

  const renderPrayerRequests = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🙏 Prayer Requests ({prayerRequests.length})</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowPrayerModal(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Request</Text>
        </TouchableOpacity>
      </View>

      {prayerRequests.map(request => (
        <View key={request.id} style={styles.prayerCard}>
          <View style={styles.prayerHeader}>
            <Text style={styles.prayerRequester}>{request.requester}</Text>
            <Text style={styles.prayerStatus}>{request.status}</Text>
          </View>
          <Text style={styles.prayerRequest}>{request.request}</Text>
          <Text style={styles.prayerDate}>{request.date.toLocaleDateString()}</Text>
          {request.testimony && (
            <View style={styles.testimony}>
              <Text style={styles.testimonyTitle}>Praise Report:</Text>
              <Text style={styles.testimonyText}>{request.testimony}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderScripturePrompts = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📖 Scripture Prompts ({scripturePrompts.length})</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowScriptureModal(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Prompt</Text>
        </TouchableOpacity>
      </View>

      {scripturePrompts.map(prompt => (
        <View key={prompt.id} style={styles.scriptureCard}>
          <Text style={styles.scriptureVerse}>{prompt.verse}</Text>
          <Text style={styles.scriptureContext}>{prompt.context}</Text>
          {prompt.application && (
            <Text style={styles.scriptureApplication}>{prompt.application}</Text>
          )}
          <Text style={styles.scriptureDate}>{prompt.date.toLocaleDateString()}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>🙏 Breakthrough Board</Text>
        <Text style={styles.headerSubtitle}>Track salvations, breakthroughs, and spiritual impact</Text>
      </LinearGradient>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'breakthroughs' && styles.activeTab]}
          onPress={() => setSelectedTab('breakthroughs')}
        >
          <Ionicons name="heart" size={20} color={selectedTab === 'breakthroughs' ? '#667eea' : '#666'} />
          <Text style={[styles.tabText, selectedTab === 'breakthroughs' && styles.activeTabText]}>
            Breakthroughs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'impact' && styles.activeTab]}
          onPress={() => setSelectedTab('impact')}
        >
          <Ionicons name="analytics" size={20} color={selectedTab === 'impact' ? '#667eea' : '#666'} />
          <Text style={[styles.tabText, selectedTab === 'impact' && styles.activeTabText]}>
            Impact
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'prayer' && styles.activeTab]}
          onPress={() => setSelectedTab('prayer')}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color={selectedTab === 'prayer' ? '#667eea' : '#666'} />
          <Text style={[styles.tabText, selectedTab === 'prayer' && styles.activeTabText]}>
            Prayer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'scripture' && styles.activeTab]}
          onPress={() => setSelectedTab('scripture')}
        >
          <Ionicons name="book" size={20} color={selectedTab === 'scripture' ? '#667eea' : '#666'} />
          <Text style={[styles.tabText, selectedTab === 'scripture' && styles.activeTabText]}>
            Scripture
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{breakthroughs.length}</Text>
            <Text style={styles.statLabel}>Breakthroughs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{prayerRequests.length}</Text>
            <Text style={styles.statLabel}>Prayer Requests</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{scripturePrompts.length}</Text>
            <Text style={styles.statLabel}>Scripture Prompts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {spiritualImpact.reduce((sum, m) => sum + m.value, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Impact</Text>
          </View>
        </View>

        {/* Tab Content */}
        {selectedTab === 'breakthroughs' && renderBreakthroughs()}
        {selectedTab === 'impact' && renderSpiritualImpact()}
        {selectedTab === 'prayer' && renderPrayerRequests()}
        {selectedTab === 'scripture' && renderScripturePrompts()}

        {/* Breakthrough Modal */}
        <Modal
          visible={showBreakthroughModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowBreakthroughModal(false)}
        >
          <View style={styles.modalOverlay}>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitle}>Record Breakthrough</Text>
              
              <Text style={styles.inputLabel}>Breakthrough Type</Text>
              <View style={styles.radioGroup}>
                {['salvation', 'breakthrough', 'testimony', 'healing', 'provision'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.radioButton,
                      newBreakthrough.type === type && styles.radioButtonActive
                    ]}
                    onPress={() => setNewBreakthrough({ ...newBreakthrough, type: type as any })}
                  >
                    <Text style={styles.radioLabel}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                value={newBreakthrough.title}
                onChangeText={(text) => setNewBreakthrough({ ...newBreakthrough, title: text })}
                placeholder="e.g., New Believer in Christ"
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={newBreakthrough.description}
                onChangeText={(text) => setNewBreakthrough({ ...newBreakthrough, description: text })}
                placeholder="Describe what happened..."
                multiline
                textAlignVertical="top"
              />

              <Text style={styles.inputLabel}>Person Name (Optional)</Text>
              <TextInput
                style={styles.input}
                value={newBreakthrough.personName}
                onChangeText={(text) => setNewBreakthrough({ ...newBreakthrough, personName: text })}
                placeholder="Enter name if applicable"
              />

              <Text style={styles.inputLabel}>Impact Level</Text>
              <View style={styles.radioGroup}>
                {['low', 'medium', 'high'].map(impact => (
                  <TouchableOpacity
                    key={impact}
                    style={[
                      styles.radioButton,
                      newBreakthrough.impact === impact && styles.radioButtonActive
                    ]}
                    onPress={() => setNewBreakthrough({ ...newBreakthrough, impact: impact as any })}
                  >
                    <Text style={styles.radioLabel}>{impact}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Public Testimony</Text>
                <Switch
                  value={newBreakthrough.isPublic}
                  onValueChange={(value) => setNewBreakthrough({ ...newBreakthrough, isPublic: value })}
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Follow-up Needed</Text>
                <Switch
                  value={newBreakthrough.followUpNeeded}
                  onValueChange={(value) => setNewBreakthrough({ ...newBreakthrough, followUpNeeded: value })}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={addBreakthrough}
                >
                  <Text style={styles.modalButtonText}>Record Breakthrough</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowBreakthroughModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Prayer Request Modal */}
        <Modal
          visible={showPrayerModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowPrayerModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Prayer Request</Text>
              
              <Text style={styles.inputLabel}>Prayer Request</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                value={newPrayerRequest.request}
                onChangeText={(text) => setNewPrayerRequest({ ...newPrayerRequest, request: text })}
                placeholder="Share your prayer request..."
                multiline
                textAlignVertical="top"
              />

              <Text style={styles.inputLabel}>Your Name (Optional)</Text>
              <TextInput
                style={styles.input}
                value={newPrayerRequest.requester}
                onChangeText={(text) => setNewPrayerRequest({ ...newPrayerRequest, requester: text })}
                placeholder="Enter your name or leave anonymous"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={addPrayerRequest}
                >
                  <Text style={styles.modalButtonText}>Add Request</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowPrayerModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Scripture Prompt Modal */}
        <Modal
          visible={showScriptureModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowScriptureModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Scripture Prompt</Text>
              
              <Text style={styles.inputLabel}>Bible Verse</Text>
              <TextInput
                style={styles.input}
                value={newScripturePrompt.verse}
                onChangeText={(text) => setNewScripturePrompt({ ...newScripturePrompt, verse: text })}
                placeholder="e.g., Philippians 4:6-7"
              />

              <Text style={styles.inputLabel}>Context</Text>
              <TextInput
                style={styles.input}
                value={newScripturePrompt.context}
                onChangeText={(text) => setNewScripturePrompt({ ...newScripturePrompt, context: text })}
                placeholder="e.g., Anxiety and worry"
              />

              <Text style={styles.inputLabel}>Application (Optional)</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={newScripturePrompt.application}
                onChangeText={(text) => setNewScripturePrompt({ ...newScripturePrompt, application: text })}
                placeholder="How to apply this verse..."
                multiline
                textAlignVertical="top"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={addScripturePrompt}
                >
                  <Text style={styles.modalButtonText}>Add Prompt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowScriptureModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#667eea10',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  breakthroughCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  breakthroughHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakthroughIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  breakthroughInfo: {
    flex: 1,
  },
  breakthroughTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  breakthroughType: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  breakthroughPerson: {
    fontSize: 12,
    color: '#667eea',
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  impactText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  breakthroughDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  breakthroughDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  breakthroughTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#667eea',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  prayerPoints: {
    marginBottom: 8,
  },
  prayerPointsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  prayerPoint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  followUp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  followUpText: {
    fontSize: 12,
    color: '#FF9800',
  },
  metricCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  metricTrend: {
    padding: 4,
  },
  metricValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  metricTarget: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  metricProgress: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  metricPeriod: {
    fontSize: 12,
    color: '#666',
  },
  prayerCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  prayerRequester: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  prayerStatus: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  prayerRequest: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  prayerDate: {
    fontSize: 12,
    color: '#999',
  },
  testimony: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e8f5e8',
    borderRadius: 4,
  },
  testimonyTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  testimonyText: {
    fontSize: 12,
    color: '#666',
  },
  scriptureCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  scriptureVerse: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  scriptureContext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scriptureApplication: {
    fontSize: 12,
    color: '#667eea',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  scriptureDate: {
    fontSize: 12,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  radioButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  radioButtonActive: {
    borderColor: '#667eea',
    backgroundColor: '#667eea10',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BreakthroughBoardScreen; 