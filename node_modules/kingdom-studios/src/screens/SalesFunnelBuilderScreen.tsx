import React, { useState, useCallback } from 'react';
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

interface FunnelStep {
  id: string;
  type: 'landing' | 'optin' | 'sales' | 'upsell' | 'thankyou' | 'email';
  title: string;
  description: string;
  url?: string;
  conversionRate?: number;
  isActive: boolean;
}

interface SalesFunnel {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused';
  steps: FunnelStep[];
  analytics: {
    totalVisitors: number;
    totalConversions: number;
    revenue: number;
    conversionRate: number;
  };
  createdAt: Date;
}

const SalesFunnelBuilderScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  
  const [funnels, setFunnels] = useState<SalesFunnel[]>([
    {
      id: '1',
      name: 'Faith-Based Course Launch',
      description: 'Complete funnel for digital course about spiritual growth',
      status: 'active',
      steps: [
        {
          id: '1',
          type: 'landing',
          title: 'Landing Page',
          description: 'Main course introduction page',
          url: 'https://yourdomain.com/course-landing',
          conversionRate: 15.4,
          isActive: true,
        },
        {
          id: '2',
          type: 'optin',
          title: 'Email Opt-in',
          description: 'Free chapter download',
          url: 'https://yourdomain.com/free-chapter',
          conversionRate: 42.8,
          isActive: true,
        },
        {
          id: '3',
          type: 'sales',
          title: 'Sales Page',
          description: 'Main course sales page',
          url: 'https://yourdomain.com/course-purchase',
          conversionRate: 8.2,
          isActive: true,
        },
        {
          id: '4',
          type: 'upsell',
          title: 'Upsell - Coaching Call',
          description: '1-on-1 coaching session offer',
          conversionRate: 12.5,
          isActive: true,
        },
        {
          id: '5',
          type: 'thankyou',
          title: 'Thank You Page',
          description: 'Course access and next steps',
          isActive: true,
        },
        {
          id: '6',
          type: 'email',
          title: 'Email Sequence',
          description: '7-day nurture sequence',
          isActive: true,
        },
      ],
      analytics: {
        totalVisitors: 2847,
        totalConversions: 234,
        revenue: 11750,
        conversionRate: 8.2,
      },
      createdAt: new Date(),
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFunnel, setSelectedFunnel] = useState<SalesFunnel | null>(null);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [newFunnel, setNewFunnel] = useState({
    name: '',
    description: '',
  });

  const stepTypes = [
    { id: 'landing', name: 'Landing Page', icon: '🎯', description: 'Main entry point for visitors' },
    { id: 'optin', name: 'Email Opt-in', icon: '📧', description: 'Capture email addresses' },
    { id: 'sales', name: 'Sales Page', icon: '💰', description: 'Present your main offer' },
    { id: 'upsell', name: 'Upsell', icon: '⬆️', description: 'Additional product offer' },
    { id: 'thankyou', name: 'Thank You', icon: '🙏', description: 'Post-purchase confirmation' },
    { id: 'email', name: 'Email Sequence', icon: '📬', description: 'Automated email nurture' },
  ];

  const funnelTemplates = [
    {
      id: 'course-launch',
      name: 'Digital Course Launch',
      description: 'Complete funnel for selling online courses',
      steps: ['landing', 'optin', 'sales', 'upsell', 'thankyou', 'email'],
    },
    {
      id: 'lead-magnet',
      name: 'Lead Magnet Funnel',
      description: 'Build your email list with valuable content',
      steps: ['landing', 'optin', 'thankyou', 'email'],
    },
    {
      id: 'webinar',
      name: 'Webinar Funnel',
      description: 'Promote and convert through webinars',
      steps: ['landing', 'optin', 'thankyou', 'sales', 'email'],
    },
    {
      id: 'coaching',
      name: 'Coaching Services',
      description: 'Sell high-ticket coaching programs',
      steps: ['landing', 'optin', 'sales', 'thankyou', 'email'],
    },
  ];

  const faithModePrompts = [
    "🙏 Build funnels that honor God and serve His people",
    "✨ Create pathways for spiritual transformation",
    "💝 Design experiences that bless and encourage others",
    "🌟 Let your sales process reflect Kingdom values",
  ];

  const encouragementModePrompts = [
    "🚀 Build funnels that inspire and empower",
    "💪 Create experiences that encourage action",
    "🌈 Design pathways for positive transformation",
    "✨ Guide people toward their breakthrough moments",
  ];

  const getCurrentPrompt = () => {
    const prompts = currentMode === 'faith' ? faithModePrompts : encouragementModePrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const createFunnel = useCallback(() => {
    if (!newFunnel.name.trim()) {
      Alert.alert('Error', 'Please enter a funnel name');
      return;
    }

    const funnel: SalesFunnel = {
      id: Date.now().toString(),
      name: newFunnel.name,
      description: newFunnel.description,
      status: 'draft',
      steps: [],
      analytics: {
        totalVisitors: 0,
        totalConversions: 0,
        revenue: 0,
        conversionRate: 0,
      },
      createdAt: new Date(),
    };

    setFunnels(prev => [...prev, funnel]);
    setShowCreateModal(false);
    setNewFunnel({ name: '', description: '' });

    Alert.alert(
      'Funnel Created',
      'Your sales funnel has been created. Add steps to get started!'
    );
  }, [newFunnel]);

  const toggleFunnelStatus = (funnelId: string) => {
    setFunnels(prev => prev.map(funnel => {
      if (funnel.id === funnelId) {
        const newStatus = funnel.status === 'active' ? 'paused' : 'active';
        return { ...funnel, status: newStatus };
      }
      return funnel;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'paused': return '#FF9800';
      case 'draft': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStepIcon = (type: string) => {
    const stepType = stepTypes.find(s => s.id === type);
    return stepType?.icon || '📄';
  };

  const renderFunnel = ({ item }: { item: SalesFunnel }) => (
    <View style={[styles.funnelCard, { backgroundColor: colors.surface }]}>
      <View style={styles.funnelHeader}>
        <View style={styles.funnelInfo}>
          <View style={styles.funnelTitleRow}>
            <Text style={[styles.funnelName, { color: colors.text }]}>
              {item.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.funnelDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
          <Text style={[styles.stepCount, { color: colors.textSecondary }]}>
            {item.steps.length} steps configured
          </Text>
        </View>
        <Switch
          value={item.status === 'active'}
          onValueChange={() => toggleFunnelStatus(item.id)}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={item.status === 'active' ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.funnelSteps}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item.steps.map((step, index) => (
            <View key={step.id} style={styles.stepFlow}>
              <View style={[styles.stepBox, { backgroundColor: colors.surface }]}>
                <Text style={styles.stepIcon}>{getStepIcon(step.type)}</Text>
                <Text style={[styles.stepTitle, { color: colors.text }]}>
                  {step.title}
                </Text>
                {step.conversionRate && (
                  <Text style={[styles.stepConversion, { color: colors.accent }]}>
                    {step.conversionRate}%
                  </Text>
                )}
              </View>
              {index < item.steps.length - 1 && (
                <Text style={[styles.stepArrow, { color: colors.textSecondary }]}>→</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.analyticsSection}>
        <Text style={[styles.analyticsTitle, { color: colors.text }]}>
          Performance
        </Text>
        <View style={styles.analyticsRow}>
          <View style={styles.analytic}>
            <Text style={[styles.analyticValue, { color: colors.text }]}>
              {item.analytics.totalVisitors.toLocaleString()}
            </Text>
            <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
              Visitors
            </Text>
          </View>
          <View style={styles.analytic}>
            <Text style={[styles.analyticValue, { color: colors.text }]}>
              {item.analytics.totalConversions}
            </Text>
            <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
              Conversions
            </Text>
          </View>
          <View style={styles.analytic}>
            <Text style={[styles.analyticValue, { color: colors.text }]}>
              ${item.analytics.revenue.toLocaleString()}
            </Text>
            <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
              Revenue
            </Text>
          </View>
          <View style={styles.analytic}>
            <Text style={[styles.analyticValue, { color: colors.text }]}>
              {item.analytics.conversionRate}%
            </Text>
            <Text style={[styles.analyticLabel, { color: colors.textSecondary }]}>
              CVR
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.funnelActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { borderColor: colors.accent }]}
          onPress={() => {
            setSelectedFunnel(item);
            setShowStepsModal(true);
          }}
        >
          <Text style={[styles.actionButtonText, { color: colors.accent }]}>
            Edit Steps
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton, { backgroundColor: colors.accent }]}
        >
          <Text style={styles.viewButtonText}>View Analytics</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTemplate = ({ item }: { item: typeof funnelTemplates[0] }) => (
    <TouchableOpacity
      style={[styles.templateCard, { backgroundColor: colors.surface }]}
      onPress={() => {
        // Create funnel from template
        const steps: FunnelStep[] = item.steps.map((stepType, index) => ({
          id: `${Date.now()}-${index}`,
          type: stepType as any,
          title: stepTypes.find(s => s.id === stepType)?.name || stepType,
          description: stepTypes.find(s => s.id === stepType)?.description || '',
          isActive: true,
        }));

        const newFunnelFromTemplate: SalesFunnel = {
          id: Date.now().toString(),
          name: item.name,
          description: item.description,
          status: 'draft',
          steps,
          analytics: {
            totalVisitors: 0,
            totalConversions: 0,
            revenue: 0,
            conversionRate: 0,
          },
          createdAt: new Date(),
        };

        setFunnels(prev => [...prev, newFunnelFromTemplate]);
        Alert.alert('Template Applied', `${item.name} funnel created successfully!`);
      }}
    >
      <Text style={[styles.templateName, { color: colors.text }]}>
        {item.name}
      </Text>
      <Text style={[styles.templateDescription, { color: colors.textSecondary }]}>
        {item.description}
      </Text>
      <View style={styles.templateSteps}>
        {item.steps.map((stepType, index) => (
          <Text key={index} style={styles.templateStepIcon}>
            {getStepIcon(stepType)}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Sales Funnel Builder
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your Funnels
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.accent }]}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.createButtonText}>+ Create Funnel</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={funnels}
            renderItem={renderFunnel}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.funnelsList}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Funnel Templates
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Start with proven funnel structures
          </Text>
          <FlatList
            data={funnelTemplates}
            renderItem={renderTemplate}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templatesList}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Funnel Building Tips
          </Text>
          <View style={[styles.tipsCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.tipText, { color: colors.text }]}>
              💡 Start with a proven template to save time
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              🎯 Focus on one clear goal per funnel step
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              📊 Test different versions to optimize conversions
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              📧 Include follow-up email sequences for nurturing
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              🔄 Review and update your funnels regularly
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Create Funnel Modal */}
      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create Funnel
            </Text>
            <TouchableOpacity onPress={createFunnel}>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Create
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Funnel Name
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newFunnel.name}
                onChangeText={(text) => setNewFunnel(prev => ({ ...prev, name: text }))}
                placeholder="Enter funnel name"
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
                value={newFunnel.description}
                onChangeText={(text) => setNewFunnel(prev => ({ ...prev, description: text }))}
                placeholder="Describe your funnel's purpose"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                🚀 Getting Started
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                After creating your funnel, you can:{'\n'}
                • Add and customize funnel steps{'\n'}
                • Connect your pages and forms{'\n'}
                • Set up email automation{'\n'}
                • Track performance analytics
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Steps Modal (placeholder for editing funnel steps) */}
      <Modal visible={showStepsModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowStepsModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Close
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Funnel Steps
            </Text>
            <TouchableOpacity>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={[styles.comingSoonText, { color: colors.textSecondary }]}>
              Step editor coming soon!{'\n'}
              For now, use templates to create your funnels.
            </Text>
          </View>
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
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  funnelsList: {
    gap: 16,
  },
  funnelCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  funnelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  funnelInfo: {
    flex: 1,
  },
  funnelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  funnelName: {
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
  funnelDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  stepCount: {
    fontSize: 12,
  },
  funnelSteps: {
    marginBottom: 16,
  },
  stepFlow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
    marginRight: 8,
  },
  stepIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepConversion: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  stepArrow: {
    fontSize: 16,
    marginRight: 8,
  },
  analyticsSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    marginBottom: 16,
  },
  analyticsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  funnelActions: {
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
  viewButton: {
    // backgroundColor applied dynamically
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  templatesList: {
    gap: 12,
    paddingRight: 20,
  },
  templateCard: {
    width: 200,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  templateName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16,
  },
  templateSteps: {
    flexDirection: 'row',
    gap: 4,
  },
  templateStepIcon: {
    fontSize: 16,
  },
  tipsCard: {
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
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
    height: 80,
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
  comingSoonText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    lineHeight: 24,
  },
});

export default React.memo(SalesFunnelBuilderScreen);
