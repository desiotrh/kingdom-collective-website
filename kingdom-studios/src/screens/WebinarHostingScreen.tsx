import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { KingdomColors } from '../constants/KingdomColors';
import { useDualMode } from '../contexts/DualModeContext';

interface Webinar {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // minutes
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  registrations: number;
  attendees: number;
  platforms: string[];
  recordingUrl?: string;
  chatEnabled: boolean;
  registrationUrl: string;
  landingPageUrl: string;
  emailReminders: boolean;
  maxAttendees: number;
  isRecording: boolean;
}

interface WebinarTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  type: 'product-launch' | 'training' | 'demo' | 'ministry' | 'consultation';
  faithModeTitle?: string;
  faithModeDescription?: string;
}

const WebinarHostingScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'live' | 'recordings'>('upcoming');
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const [newWebinar, setNewWebinar] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    platforms: [] as string[],
    chatEnabled: true,
    emailReminders: true,
    maxAttendees: 100,
    isRecording: true,
  });

  const webinarTemplates: WebinarTemplate[] = currentMode === 'faith' ? [
    {
      id: '1',
      name: 'Ministry Launch Event',
      description: 'Introduce your ministry and calling to the community',
      duration: 90,
      type: 'ministry',
      faithModeTitle: 'Share God\'s Call on Your Life',
      faithModeDescription: 'A powerful platform to share your testimony and ministry vision'
    },
    {
      id: '2',
      name: 'Biblical Business Training',
      description: 'Teach Kingdom principles for business success',
      duration: 120,
      type: 'training',
      faithModeTitle: 'Kingdom Business Masterclass',
      faithModeDescription: 'Equip others with God-centered business strategies'
    },
    {
      id: '3',
      name: 'Faith-Based Product Launch',
      description: 'Launch your ministry product with Kingdom impact',
      duration: 75,
      type: 'product-launch',
      faithModeTitle: 'God-Inspired Product Reveal',
      faithModeDescription: 'Share how God led you to create this blessing'
    },
  ] : [
    {
      id: '1',
      name: 'Product Launch Event',
      description: 'Generate excitement for your new product or service',
      duration: 90,
      type: 'product-launch'
    },
    {
      id: '2',
      name: 'Training Masterclass',
      description: 'Share your expertise and build authority',
      duration: 120,
      type: 'training'
    },
    {
      id: '3',
      name: 'Demo & Consultation',
      description: 'Demonstrate your service and convert leads',
      duration: 60,
      type: 'demo'
    },
  ];

  useEffect(() => {
    loadWebinars();
  }, [currentMode]);

  const loadWebinars = () => {
    // Mock data - in real app, this would come from Firebase/API
    const mockWebinars: Webinar[] = currentMode === 'faith' ? [
      {
        id: '1',
        title: 'Building Your Kingdom Business',
        description: 'Learn how to start a business that honors God and serves others',
        date: '2024-07-15',
        time: '19:00',
        duration: 90,
        status: 'scheduled',
        registrations: 245,
        attendees: 0,
        platforms: ['zoom', 'youtube', 'facebook'],
        chatEnabled: true,
        registrationUrl: 'https://yourwebinar.com/kingdom-business',
        landingPageUrl: 'https://yourwebinar.com/kingdom-business-landing',
        emailReminders: true,
        maxAttendees: 500,
        isRecording: true,
      },
      {
        id: '2',
        title: 'Faith & Finances Masterclass',
        description: 'Biblical principles for financial stewardship and prosperity',
        date: '2024-07-08',
        time: '18:30',
        duration: 75,
        status: 'ended',
        registrations: 189,
        attendees: 134,
        platforms: ['zoom'],
        chatEnabled: true,
        registrationUrl: 'https://yourwebinar.com/faith-finances',
        landingPageUrl: 'https://yourwebinar.com/faith-finances-landing',
        emailReminders: true,
        maxAttendees: 300,
        isRecording: true,
        recordingUrl: 'https://recordings.com/faith-finances.mp4',
      },
    ] : [
      {
        id: '1',
        title: 'Digital Marketing Mastery',
        description: 'Scale your business with proven digital marketing strategies',
        date: '2024-07-15',
        time: '19:00',
        duration: 90,
        status: 'scheduled',
        registrations: 378,
        attendees: 0,
        platforms: ['zoom', 'youtube'],
        chatEnabled: true,
        registrationUrl: 'https://yourwebinar.com/marketing-mastery',
        landingPageUrl: 'https://yourwebinar.com/marketing-mastery-landing',
        emailReminders: true,
        maxAttendees: 1000,
        isRecording: true,
      },
    ];

    setWebinars(mockWebinars);
  };

  const createWebinar = () => {
    if (!newWebinar.title.trim() || !newWebinar.date || !newWebinar.time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const webinar: Webinar = {
      id: Date.now().toString(),
      title: newWebinar.title,
      description: newWebinar.description,
      date: newWebinar.date,
      time: newWebinar.time,
      duration: newWebinar.duration,
      status: 'scheduled',
      registrations: 0,
      attendees: 0,
      platforms: newWebinar.platforms,
      chatEnabled: newWebinar.chatEnabled,
      registrationUrl: `https://yourwebinar.com/${newWebinar.title.toLowerCase().replace(/\s+/g, '-')}`,
      landingPageUrl: `https://yourwebinar.com/${newWebinar.title.toLowerCase().replace(/\s+/g, '-')}-landing`,
      emailReminders: newWebinar.emailReminders,
      maxAttendees: newWebinar.maxAttendees,
      isRecording: newWebinar.isRecording,
    };

    setWebinars(prev => [webinar, ...prev]);
    setShowCreateModal(false);
    setNewWebinar({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
      platforms: [],
      chatEnabled: true,
      emailReminders: true,
      maxAttendees: 100,
      isRecording: true,
    });

    Alert.alert(
      'Webinar Created!',
      currentMode === 'faith' 
        ? 'Your Kingdom webinar has been scheduled! God will use this to impact lives.'
        : 'Your webinar has been scheduled successfully! Time to build your audience.'
    );
  };

  const useTemplate = (template: WebinarTemplate) => {
    setNewWebinar(prev => ({
      ...prev,
      title: currentMode === 'faith' && template.faithModeTitle ? template.faithModeTitle : template.name,
      description: currentMode === 'faith' && template.faithModeDescription ? template.faithModeDescription : template.description,
      duration: template.duration,
    }));
    setShowTemplateModal(false);
    setShowCreateModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return '#4CAF50';
      case 'scheduled': return '#FF9800';
      case 'ended': return '#2196F3';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getFilteredWebinars = () => {
    switch (selectedTab) {
      case 'upcoming':
        return webinars.filter(w => w.status === 'scheduled');
      case 'live':
        return webinars.filter(w => w.status === 'live');
      case 'recordings':
        return webinars.filter(w => w.status === 'ended' && w.recordingUrl);
      default:
        return webinars;
    }
  };

  const renderWebinar = ({ item }: { item: Webinar }) => (
    <View style={[styles.webinarCard, { backgroundColor: colors.surface }]}>
      <View style={styles.webinarHeader}>
        <View style={styles.webinarInfo}>
          <Text style={[styles.webinarTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={[styles.webinarDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
      </View>

      <View style={styles.webinarDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            📅 {item.date} at {item.time}
          </Text>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            ⏱️ {item.duration} min
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            👥 {item.registrations} registered
          </Text>
          {item.status === 'ended' && (
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              ✅ {item.attendees} attended
            </Text>
          )}
        </View>

        <View style={styles.platformTags}>
          {item.platforms.map((platform, index) => (
            <View key={index} style={[styles.platformTag, { backgroundColor: colors.accent + '20' }]}>
              <Text style={[styles.platformTagText, { color: colors.accent }]}>
                {platform}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.webinarActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { borderColor: colors.accent }]}
          onPress={() => Alert.alert('Edit Webinar', `Edit functionality for "${item.title}" coming soon!`)}
        >
          <Text style={[styles.actionButtonText, { color: colors.accent }]}>
            Edit
          </Text>
        </TouchableOpacity>
        
        {item.status === 'scheduled' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={() => Alert.alert('Start Webinar', `Starting "${item.title}" webinar...`)}
          >
            <Text style={styles.primaryButtonText}>
              Start Live
            </Text>
          </TouchableOpacity>
        )}

        {item.recordingUrl && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={() => Alert.alert('View Recording', `Opening recording for "${item.title}"`)}
          >
            <Text style={styles.primaryButtonText}>
              View Recording
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "🎥 Host webinars that bless and transform lives",
      "✨ Share Kingdom wisdom with the world",
      "🙏 Create digital spaces for spiritual growth",
      "💝 Use technology to advance God's Kingdom",
    ];

    const encouragementPrompts = [
      "🚀 Build your authority through powerful webinars",
      "💪 Connect with your audience on a deeper level",
      "🌟 Share your expertise and grow your business",
      "🎯 Convert leads into loyal customers",
    ];

    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {currentMode === 'faith' ? 'Kingdom Webinars' : 'Webinar Hosting'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['upcoming', 'live', 'recordings'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && [styles.activeTab, { backgroundColor: colors.accent }]
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabIcon,
              selectedTab === tab ? styles.activeTabText : { color: colors.textSecondary }
            ]}>
              {tab === 'upcoming' ? '📅' : tab === 'live' ? '🔴' : '📹'}
            </Text>
            <Text style={[
              styles.tabLabel,
              selectedTab === tab ? styles.activeTabText : { color: colors.textSecondary }
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.accent }]}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>
            + Create Webinar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.templateButton, { borderColor: colors.accent }]}
          onPress={() => setShowTemplateModal(true)}
        >
          <Text style={[styles.templateButtonText, { color: colors.accent }]}>
            📋 Templates
          </Text>
        </TouchableOpacity>
      </View>

      {/* Webinar List */}
      <FlatList
        data={getFilteredWebinars()}
        keyExtractor={(item) => item.id}
        renderItem={renderWebinar}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              {selectedTab === 'upcoming' && 'No upcoming webinars'}
              {selectedTab === 'live' && 'No live webinars'}
              {selectedTab === 'recordings' && 'No recordings available'}
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
              Create your first webinar to get started!
            </Text>
          </View>
        }
      />

      {/* Create Webinar Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create Webinar
            </Text>
            <TouchableOpacity onPress={createWebinar}>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Create
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Webinar Title *
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newWebinar.title}
                onChangeText={(text) => setNewWebinar(prev => ({ ...prev, title: text }))}
                placeholder={currentMode === 'faith' ? 
                  "Kingdom Business Breakthrough" : 
                  "Digital Marketing Masterclass"
                }
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Description
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newWebinar.description}
                onChangeText={(text) => setNewWebinar(prev => ({ ...prev, description: text }))}
                placeholder={currentMode === 'faith' ? 
                  "Learn how God wants to bless your business..." :
                  "Discover proven strategies to scale your business..."
                }
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formColumn, { marginRight: 10 }]}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  Date *
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  }]}
                  value={newWebinar.date}
                  onChangeText={(text) => setNewWebinar(prev => ({ ...prev, date: text }))}
                  placeholder="2024-07-15"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              
              <View style={styles.formColumn}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  Time *
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  }]}
                  value={newWebinar.time}
                  onChangeText={(text) => setNewWebinar(prev => ({ ...prev, time: text }))}
                  placeholder="19:00"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Duration (minutes)
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newWebinar.duration.toString()}
                onChangeText={(text) => setNewWebinar(prev => ({ ...prev, duration: parseInt(text) || 60 }))}
                placeholder="60"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>
                Enable Chat
              </Text>
              <Switch
                value={newWebinar.chatEnabled}
                onValueChange={(value) => setNewWebinar(prev => ({ ...prev, chatEnabled: value }))}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={newWebinar.chatEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>
                Record Webinar
              </Text>
              <Switch
                value={newWebinar.isRecording}
                onValueChange={(value) => setNewWebinar(prev => ({ ...prev, isRecording: value }))}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={newWebinar.isRecording ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                🎥 Webinar Tips
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                • Test your setup 15 minutes before going live{'\n'}
                • Prepare engaging slides and interactive elements{'\n'}
                • Have a clear call-to-action at the end{'\n'}
                • Follow up with attendees within 24 hours{'\n'}
                • Repurpose your webinar content for social media
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Template Selection Modal */}
      <Modal
        visible={showTemplateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTemplateModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Webinar Templates
            </Text>
            <View />
          </View>

          <ScrollView style={styles.modalContent}>
            {webinarTemplates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[styles.templateCard, { backgroundColor: colors.surface }]}
                onPress={() => useTemplate(template)}
              >
                <Text style={[styles.templateTitle, { color: colors.text }]}>
                  {currentMode === 'faith' && template.faithModeTitle ? template.faithModeTitle : template.name}
                </Text>
                <Text style={[styles.templateDescription, { color: colors.textSecondary }]}>
                  {currentMode === 'faith' && template.faithModeDescription ? template.faithModeDescription : template.description}
                </Text>
                <View style={styles.templateMeta}>
                  <Text style={[styles.templateDuration, { color: colors.accent }]}>
                    ⏱️ {template.duration} minutes
                  </Text>
                  <Text style={[styles.templateType, { color: colors.textSecondary }]}>
                    {template.type.replace('-', ' ')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  activeTab: {
    // backgroundColor applied dynamically
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  createButton: {
    flex: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  templateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
  },
  templateButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  webinarCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  webinarHeader: {
    marginBottom: 12,
  },
  webinarInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  webinarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  webinarDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  webinarDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  platformTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  platformTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  platformTagText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  webinarActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    borderWidth: 1,
  },
  primaryButton: {
    // backgroundColor applied dynamically
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 16,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  formColumn: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  templateCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  templateMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateDuration: {
    fontSize: 12,
    fontWeight: '600',
  },
  templateType: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
});

export default WebinarHostingScreen;
