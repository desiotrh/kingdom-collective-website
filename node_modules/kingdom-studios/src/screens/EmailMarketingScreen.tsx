import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KingdomColors } from '../constants/KingdomColors';
import { useDualMode } from '../contexts/DualModeContext';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'welcome' | 'promotional' | 'nurture' | 'testimonial' | 'devotional';
  content: string;
  isActive: boolean;
  openRate: number;
  clickRate: number;
}

interface EmailSequence {
  id: string;
  name: string;
  description: string;
  trigger: 'signup' | 'purchase' | 'birthday' | 'manual';
  emails: EmailTemplate[];
  isActive: boolean;
  subscribers: number;
  totalSent: number;
  openRate: number;
  clickRate: number;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledDate?: Date;
  recipients: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  createdAt: Date;
}

interface EmailList {
  id: string;
  name: string;
  description: string;
  subscriberCount: number;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
}

const EmailMarketingScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  
  const [activeTab, setActiveTab] = useState<'campaigns' | 'sequences' | 'lists' | 'templates'>('campaigns');
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    scheduledDate: '',
  });

  useEffect(() => {
    loadData();
  }, [currentMode]);

  const loadData = () => {
    // Mock data - in real app, this would come from Firebase/API
    const mockCampaigns: EmailCampaign[] = currentMode === 'faith' ? [
      {
        id: '1',
        name: 'Weekly Faith Encouragement',
        subject: 'God\'s Promise for Your Week Ahead 🙏',
        content: 'Dear beloved, this week God has something beautiful planned for you...',
        status: 'sent',
        recipients: 1250,
        openRate: 42.5,
        clickRate: 8.3,
        unsubscribeRate: 0.2,
        createdAt: new Date('2024-07-01'),
      },
      {
        id: '2',
        name: 'New Product Launch - Prayer Journal',
        subject: 'Transform Your Prayer Life with This New Journal ✨',
        content: 'Exciting news! Our new Faith-Based Prayer Journal is here...',
        status: 'scheduled',
        scheduledDate: new Date('2024-07-08'),
        recipients: 890,
        openRate: 0,
        clickRate: 0,
        unsubscribeRate: 0,
        createdAt: new Date('2024-07-02'),
      },
    ] : [
      {
        id: '1',
        name: 'Monday Motivation',
        subject: 'Your Week of Success Starts Now! 💪',
        content: 'Ready to crush your goals this week? Here\'s your motivation...',
        status: 'sent',
        recipients: 980,
        openRate: 38.7,
        clickRate: 6.9,
        unsubscribeRate: 0.3,
        createdAt: new Date('2024-07-01'),
      },
    ];

    const mockSequences: EmailSequence[] = currentMode === 'faith' ? [
      {
        id: '1',
        name: 'New Believer Welcome Series',
        description: '7-day welcome sequence for new faith-based subscribers',
        trigger: 'signup',
        emails: [],
        isActive: true,
        subscribers: 156,
        totalSent: 1092,
        openRate: 55.2,
        clickRate: 12.4,
      },
    ] : [
      {
        id: '1',
        name: 'Creator Onboarding Flow',
        description: '5-day sequence to get creators started',
        trigger: 'signup',
        emails: [],
        isActive: true,
        subscribers: 203,
        totalSent: 1015,
        openRate: 48.6,
        clickRate: 9.8,
      },
    ];

    const mockLists: EmailList[] = [
      {
        id: '1',
        name: currentMode === 'faith' ? 'Faith-Based Creators' : 'Content Creators',
        description: currentMode === 'faith' ? 'Christian creators and entrepreneurs' : 'Digital creators and entrepreneurs',
        subscriberCount: 1250,
        isActive: true,
        tags: currentMode === 'faith' ? ['faith', 'ministry', 'business'] : ['content', 'marketing', 'business'],
        createdAt: new Date('2024-01-15'),
      },
    ];

    const mockTemplates: EmailTemplate[] = currentMode === 'faith' ? [
      {
        id: '1',
        name: 'Weekly Devotional',
        subject: 'Your Weekly Word from God 📖',
        type: 'devotional',
        content: 'Dear {firstName},\n\nThis week, God wants to remind you of His faithfulness...',
        isActive: true,
        openRate: 65.3,
        clickRate: 15.2,
      },
      {
        id: '2',
        name: 'Product Launch - Faith Edition',
        subject: 'God-Inspired Product Launch: {productName} 🌟',
        type: 'promotional',
        content: 'Beloved {firstName},\n\nGod has laid something beautiful on my heart to share with you...',
        isActive: true,
        openRate: 45.7,
        clickRate: 12.8,
      },
    ] : [
      {
        id: '1',
        name: 'Weekly Newsletter',
        subject: 'Your Weekly Dose of Inspiration 💫',
        type: 'nurture',
        content: 'Hey {firstName},\n\nHere\'s your weekly dose of motivation and insights...',
        isActive: true,
        openRate: 42.1,
        clickRate: 8.5,
      },
    ];

    setCampaigns(mockCampaigns);
    setSequences(mockSequences);
    setEmailLists(mockLists);
    setTemplates(mockTemplates);
  };

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "📧 Send emails that bless and inspire God's people",
      "✨ Create content that spreads Kingdom love",
      "💝 Connect hearts through faith-filled messages",
      "🙏 Use email to build God's community",
    ];

    const encouragementPrompts = [
      "🚀 Build relationships through powerful email marketing",
      "💪 Create campaigns that inspire and motivate",
      "🌈 Connect with your audience on a deeper level",
      "✨ Turn subscribers into your biggest fans",
    ];

    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const createCampaign = () => {
    if (!newCampaign.name.trim() || !newCampaign.subject.trim()) {
      Alert.alert('Error', 'Please enter campaign name and subject');
      return;
    }

    const campaign: EmailCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      subject: newCampaign.subject,
      content: newCampaign.content || 'Your email content here...',
      status: 'draft',
      recipients: 0,
      openRate: 0,
      clickRate: 0,
      unsubscribeRate: 0,
      createdAt: new Date(),
    };

    setCampaigns(prev => [...prev, campaign]);
    setShowCreateModal(false);
    setNewCampaign({ name: '', subject: '', content: '', scheduledDate: '' });

    Alert.alert(
      'Campaign Created!',
      'Your email campaign has been created as a draft. You can edit and schedule it anytime.'
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return '#4CAF50';
      case 'scheduled': return '#FF9800';
      case 'draft': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const renderCampaign = ({ item }: { item: EmailCampaign }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={styles.titleRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {item.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.cardSubject, { color: colors.textSecondary }]}>
            Subject: {item.subject}
          </Text>
          <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
            {item.status === 'scheduled' ? 
              `Scheduled: ${item.scheduledDate?.toLocaleDateString()}` :
              `Created: ${item.createdAt.toLocaleDateString()}`
            }
          </Text>
        </View>
      </View>

      {item.status === 'sent' && (
        <View style={styles.analyticsRow}>
          <View style={styles.analytic}>
            <Text style={[styles.analyticValue, { color: colors.text }]}>
              {item.recipients.toLocaleString()}
            </Text>
            <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
              Recipients
            </Text>
          </View>
          <View style={styles.analytic}>
            <Text style={[styles.analyticValue, { color: colors.text }]}>
              {item.openRate}%
            </Text>
            <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
              Opens
            </Text>
          </View>
          <View style={styles.analytic}>
            <Text style={[styles.analyticValue, { color: colors.text }]}>
              {item.clickRate}%
            </Text>
            <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
              Clicks
            </Text>
          </View>
          <View style={styles.analytic}>
            <Text style={[styles.analyticValue, { color: colors.text }]}>
              {item.unsubscribeRate}%
            </Text>
            <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
              Unsubs
            </Text>
          </View>
        </View>
      )}

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { borderColor: colors.accent }]}
          onPress={() => {
            Alert.alert('Edit Campaign', `Edit functionality for "${item.name}" coming soon!`);
          }}
        >
          <Text style={[styles.actionButtonText, { color: colors.accent }]}>
            {item.status === 'draft' ? 'Edit' : 'View'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            if (item.status === 'draft') {
              Alert.alert('Send Campaign', `Schedule or send "${item.name}" immediately?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Schedule', onPress: () => {} },
                { text: 'Send Now', onPress: () => {} },
              ]);
            } else {
              Alert.alert('Campaign Analytics', `View detailed analytics for "${item.name}"`);
            }
          }}
        >
          <Text style={styles.primaryButtonText}>
            {item.status === 'draft' ? 'Send' : 'Analytics'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSequence = ({ item }: { item: EmailSequence }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={styles.titleRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {item.name}
            </Text>
            <Switch
              value={item.isActive}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={item.isActive ? '#fff' : '#f4f3f4'}
            />
          </View>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
          <Text style={[styles.cardTrigger, { color: colors.accent }]}>
            Trigger: {item.trigger}
          </Text>
        </View>
      </View>

      <View style={styles.analyticsRow}>
        <View style={styles.analytic}>
          <Text style={[styles.analyticValue, { color: colors.text }]}>
            {item.subscribers}
          </Text>
          <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
            Subscribers
          </Text>
        </View>
        <View style={styles.analytic}>
          <Text style={[styles.analyticValue, { color: colors.text }]}>
            {item.totalSent.toLocaleString()}
          </Text>
          <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
            Total Sent
          </Text>
        </View>
        <View style={styles.analytic}>
          <Text style={[styles.analyticValue, { color: colors.text }]}>
            {item.openRate}%
          </Text>
          <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
            Opens
          </Text>
        </View>
        <View style={styles.analytic}>
          <Text style={[styles.analyticValue, { color: colors.text }]}>
            {item.clickRate}%
          </Text>
          <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
            Clicks
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { borderColor: colors.accent }]}
          onPress={() => {
            Alert.alert('Edit Sequence', `Edit email sequence functionality coming soon!`);
          }}
        >
          <Text style={[styles.actionButtonText, { color: colors.accent }]}>
            Edit Emails
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            Alert.alert('Sequence Analytics', `View detailed analytics for "${item.name}"`);
          }}
        >
          <Text style={styles.primaryButtonText}>Analytics</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmailList = ({ item }: { item: EmailList }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={styles.titleRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {item.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: item.isActive ? '#4CAF50' : '#9E9E9E' }]}>
              <Text style={styles.statusText}>{item.isActive ? 'ACTIVE' : 'INACTIVE'}</Text>
            </View>
          </View>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
          <View style={styles.tagContainer}>
            {item.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.accent + '20' }]}>
                <Text style={[styles.tagText, { color: colors.accent }]}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.listStats}>
        <View style={styles.listStat}>
          <Text style={[styles.listStatNumber, { color: colors.text }]}>
            {item.subscriberCount.toLocaleString()}
          </Text>
          <Text style={[styles.listStatLabel, { color: colors.textSecondary }]}>
            Subscribers
          </Text>
        </View>
        <View style={styles.listStat}>
          <Text style={[styles.listStatNumber, { color: colors.text }]}>
            {item.createdAt.toLocaleDateString()}
          </Text>
          <Text style={[styles.listStatLabel, { color: colors.textSecondary }]}>
            Created
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { borderColor: colors.accent }]}
          onPress={() => {
            Alert.alert('Manage List', `Manage subscribers for "${item.name}" coming soon!`);
          }}
        >
          <Text style={[styles.actionButtonText, { color: colors.accent }]}>
            Manage
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            Alert.alert('Send Campaign', `Send campaign to "${item.name}" list?`);
          }}
        >
          <Text style={styles.primaryButtonText}>Send Campaign</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTemplate = ({ item }: { item: EmailTemplate }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={styles.titleRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {item.name}
            </Text>
            <View style={[styles.templateTypeBadge, { backgroundColor: colors.accent + '20' }]}>
              <Text style={[styles.templateTypeText, { color: colors.accent }]}>
                {item.type}
              </Text>
            </View>
          </View>
          <Text style={[styles.cardSubject, { color: colors.textSecondary }]}>
            Subject: {item.subject}
          </Text>
          <Text style={[styles.templatePreview, { color: colors.textSecondary }]}>
            {item.content.substring(0, 100)}...
          </Text>
        </View>
      </View>

      <View style={styles.templateStats}>
        <View style={styles.templateStat}>
          <Text style={[styles.templateStatValue, { color: colors.text }]}>
            {item.openRate}%
          </Text>
          <Text style={[styles.templateStatLabel, { color: colors.textSecondary }]}>
            Avg Opens
          </Text>
        </View>
        <View style={styles.templateStat}>
          <Text style={[styles.templateStatValue, { color: colors.text }]}>
            {item.clickRate}%
          </Text>
          <Text style={[styles.templateStatLabel, { color: colors.textSecondary }]}>
            Avg Clicks
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { borderColor: colors.accent }]}
          onPress={() => {
            Alert.alert('Edit Template', `Edit template functionality coming soon!`);
          }}
        >
          <Text style={[styles.actionButtonText, { color: colors.accent }]}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            Alert.alert('Use Template', `Create campaign from "${item.name}" template?`);
          }}
        >
          <Text style={styles.primaryButtonText}>Use Template</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'campaigns':
        return (
          <FlatList
            data={campaigns}
            renderItem={renderCampaign}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentList}
          />
        );
      case 'sequences':
        return (
          <FlatList
            data={sequences}
            renderItem={renderSequence}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentList}
          />
        );
      case 'lists':
        return (
          <FlatList
            data={emailLists}
            renderItem={renderEmailList}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentList}
          />
        );
      case 'templates':
        return (
          <FlatList
            data={templates}
            renderItem={renderTemplate}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentList}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Email Marketing
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {[
          { key: 'campaigns', label: 'Campaigns', icon: '📧' },
          { key: 'sequences', label: 'Sequences', icon: '🔄' },
          { key: 'lists', label: 'Lists', icon: '👥' },
          { key: 'templates', label: 'Templates', icon: '📝' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && { backgroundColor: colors.accent + '20' }
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabLabel,
              { color: activeTab === tab.key ? colors.accent : colors.textSecondary }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            if (activeTab === 'campaigns') {
              setShowCreateModal(true);
            } else {
              Alert.alert('Coming Soon', `Create ${activeTab} functionality coming soon!`);
            }
          }}
        >
          <Text style={styles.createButtonText}>
            + Create {activeTab === 'campaigns' ? 'Campaign' : 
                     activeTab === 'sequences' ? 'Sequence' : 
                     activeTab === 'lists' ? 'List' : 'Template'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>

      {/* Create Campaign Modal */}
      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create Campaign
            </Text>
            <TouchableOpacity onPress={createCampaign}>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Create
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Campaign Name *
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newCampaign.name}
                onChangeText={(text) => setNewCampaign(prev => ({ ...prev, name: text }))}
                placeholder="Enter campaign name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Subject Line *
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newCampaign.subject}
                onChangeText={(text) => setNewCampaign(prev => ({ ...prev, subject: text }))}
                placeholder={currentMode === 'faith' ? 
                  "God's blessing for you today 🙏" : 
                  "Your weekly dose of inspiration ✨"
                }
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Email Content
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newCampaign.content}
                onChangeText={(text) => setNewCampaign(prev => ({ ...prev, content: text }))}
                placeholder={currentMode === 'faith' ? 
                  "Dear {firstName},\n\nGod has something beautiful to share with you today..." :
                  "Hey {firstName},\n\nI hope this email finds you thriving..."
                }
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={8}
              />
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                📧 Email Marketing Tips
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                • Use personalization like {'{firstName}'} for better engagement{'\n'}
                • Keep subject lines under 50 characters{'\n'}
                • Include a clear call-to-action{'\n'}
                • Test different send times for your audience{'\n'}
                • Always provide an unsubscribe option
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionBar: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  createButton: {
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentList: {
    gap: 16,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
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
  templateTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  templateTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardSubject: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 12,
  },
  cardTrigger: {
    fontSize: 12,
    fontWeight: '600',
  },
  templatePreview: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 12,
  },
  analytic: {
    alignItems: 'center',
  },
  analyticValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  analyticLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  listStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginBottom: 12,
  },
  listStat: {
    alignItems: 'center',
  },
  listStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  templateStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 12,
  },
  templateStat: {
    alignItems: 'center',
  },
  templateStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  templateStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardActions: {
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
    height: 120,
    textAlignVertical: 'top',
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
});

export default EmailMarketingScreen;
