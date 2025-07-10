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
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

interface AutomationTrigger {
  id: string;
  type: 'time_based' | 'content_based' | 'engagement_based' | 'user_action';
  name: string;
  description: string;
  icon: string;
}

interface AutomationAction {
  id: string;
  type: 'post_content' | 'send_email' | 'add_tag' | 'send_notification' | 'update_crm';
  name: string;
  description: string;
  icon: string;
}

interface WorkflowAutomation {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  isActive: boolean;
  createdAt: Date;
  lastRun?: Date;
  runCount: number;
  status: 'active' | 'paused' | 'draft';
}

const WorkflowAutomationScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  
  const [workflows, setWorkflows] = useState<WorkflowAutomation[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowAutomation | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger: null as AutomationTrigger | null,
    actions: [] as AutomationAction[],
  });

  const triggers: AutomationTrigger[] = [
    {
      id: 'schedule',
      type: 'time_based',
      name: 'Scheduled Time',
      description: 'Run at specific times or intervals',
      icon: '⏰',
    },
    {
      id: 'new_post',
      type: 'content_based',
      name: 'New Content Published',
      description: 'Trigger when new content is posted',
      icon: '📝',
    },
    {
      id: 'follower_milestone',
      type: 'engagement_based',
      name: 'Follower Milestone',
      description: 'Run when follower count reaches target',
      icon: '🎯',
    },
    {
      id: 'user_signup',
      type: 'user_action',
      name: 'New User Signup',
      description: 'Trigger when someone joins your list',
      icon: '👋',
    },
  ];

  const actions: AutomationAction[] = [
    {
      id: 'auto_post',
      type: 'post_content',
      name: 'Post Content',
      description: 'Automatically post pre-written content',
      icon: '📤',
    },
    {
      id: 'send_welcome_email',
      type: 'send_email',
      name: 'Send Email',
      description: 'Send automated email to subscribers',
      icon: '📧',
    },
    {
      id: 'tag_user',
      type: 'add_tag',
      name: 'Add User Tag',
      description: 'Tag users for segmentation',
      icon: '🏷️',
    },
    {
      id: 'push_notification',
      type: 'send_notification',
      name: 'Send Notification',
      description: 'Push notification to app users',
      icon: '🔔',
    },
    {
      id: 'update_contact',
      type: 'update_crm',
      name: 'Update CRM',
      description: 'Update contact information in CRM',
      icon: '👤',
    },
  ];

  useEffect(() => {
    loadWorkflows();
  }, [currentMode]);

  const loadWorkflows = () => {
    // Mock data - in real app, this would come from Firebase/API
    const mockWorkflows: WorkflowAutomation[] = currentMode === 'faith' ? [
      {
        id: '1',
        name: 'Daily Scripture Share',
        description: 'Automatically post daily scripture verses with reflections',
        trigger: triggers[0], // Scheduled Time
        actions: [actions[0]], // Post Content
        isActive: true,
        createdAt: new Date('2024-06-01'),
        lastRun: new Date('2024-07-02'),
        runCount: 32,
        status: 'active',
      },
      {
        id: '2',
        name: 'New Believer Welcome',
        description: 'Send welcome email series to new faith-based subscribers',
        trigger: triggers[3], // New User Signup
        actions: [actions[1], actions[2]], // Send Email + Add Tag
        isActive: true,
        createdAt: new Date('2024-05-15'),
        lastRun: new Date('2024-07-01'),
        runCount: 28,
        status: 'active',
      },
    ] : [
      {
        id: '1',
        name: 'Growth Milestone Celebration',
        description: 'Celebrate follower milestones with thank you posts',
        trigger: triggers[2], // Follower Milestone
        actions: [actions[0], actions[3]], // Post Content + Send Notification
        isActive: true,
        createdAt: new Date('2024-06-10'),
        lastRun: new Date('2024-06-25'),
        runCount: 3,
        status: 'active',
      },
      {
        id: '2',
        name: 'Creator Onboarding Flow',
        description: 'Automated welcome sequence for new creators',
        trigger: triggers[3], // New User Signup
        actions: [actions[1], actions[2], actions[4]], // Send Email + Add Tag + Update CRM
        isActive: true,
        createdAt: new Date('2024-05-20'),
        lastRun: new Date('2024-07-02'),
        runCount: 45,
        status: 'active',
      },
    ];

    setWorkflows(mockWorkflows);
  };

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "🤖 Automate God's work with wisdom and purpose",
      "✨ Let technology serve His kingdom efficiently",
      "🙏 Create workflows that multiply your ministry impact",
      "💝 Use automation to bless more people with less effort",
    ];

    const encouragementPrompts = [
      "⚡ Automate your success and scale with confidence",
      "🚀 Work smarter, not harder with powerful workflows",
      "💪 Let automation handle the routine while you focus on growth",
      "🌟 Build systems that work around the clock for you",
    ];

    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const createWorkflow = () => {
    if (!newWorkflow.name.trim() || !newWorkflow.trigger || newWorkflow.actions.length === 0) {
      Alert.alert('Error', 'Please complete all workflow fields');
      return;
    }

    const workflow: WorkflowAutomation = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      trigger: newWorkflow.trigger,
      actions: newWorkflow.actions,
      isActive: true,
      createdAt: new Date(),
      runCount: 0,
      status: 'draft',
    };

    setWorkflows(prev => [...prev, workflow]);
    setShowCreateModal(false);
    setNewWorkflow({
      name: '',
      description: '',
      trigger: null,
      actions: [],
    });

    Alert.alert(
      'Workflow Created!',
      currentMode === 'faith' 
        ? 'Your Kingdom automation is ready to serve! Activate it when you\'re ready to start.'
        : 'Your automation workflow is ready to go! Activate it to start automating your success.'
    );
  };

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => {
      if (workflow.id === workflowId) {
        const newStatus = workflow.status === 'active' ? 'paused' : 'active';
        return { ...workflow, status: newStatus, isActive: newStatus === 'active' };
      }
      return workflow;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'paused': return colors.warning;
      case 'draft': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const renderWorkflow = ({ item }: { item: WorkflowAutomation }) => (
    <View style={[styles.workflowCard, { backgroundColor: colors.surface }]}>
      <View style={styles.workflowHeader}>
        <View style={styles.workflowInfo}>
          <View style={styles.workflowTitleRow}>
            <Text style={[styles.workflowName, { color: colors.text }]}>
              {item.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.workflowDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
        <Switch
          value={item.isActive}
          onValueChange={() => toggleWorkflowStatus(item.id)}
          trackColor={{ false: colors.border, true: colors.success }}
          thumbColor={item.isActive ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.workflowFlow}>
        <View style={[styles.triggerBox, { backgroundColor: colors.background }]}>
          <Text style={styles.triggerIcon}>{item.trigger.icon}</Text>
          <Text style={[styles.triggerName, { color: colors.text }]}>
            {item.trigger.name}
          </Text>
        </View>
        
        <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} style={styles.arrow} />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsContainer}>
          {item.actions.map((action, index) => (
            <View key={action.id} style={styles.actionFlow}>
              <View style={[styles.actionBox, { backgroundColor: colors.background }]}>
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={[styles.actionName, { color: colors.text }]}>
                  {action.name}
                </Text>
              </View>
              {index < item.actions.length - 1 && (
                <Ionicons name="arrow-forward" size={16} color={colors.textSecondary} style={styles.actionArrow} />
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.workflowStats}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.runCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Runs
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.lastRun ? item.lastRun.toLocaleDateString() : 'Never'}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Last Run
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.createdAt.toLocaleDateString()}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Created
          </Text>
        </View>
      </View>

      <View style={styles.workflowActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { borderColor: colors.accent }]}
          onPress={() => {
            setSelectedWorkflow(item);
            setShowEditModal(true);
          }}
        >
          <Text style={[styles.actionButtonText, { color: colors.accent }]}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.testButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            Alert.alert('Test Workflow', `Testing "${item.name}" workflow...`);
          }}
        >
          <Text style={styles.testButtonText}>Test Run</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTriggerOption = ({ item }: { item: AutomationTrigger }) => (
    <TouchableOpacity
      style={[
        styles.triggerOption,
        { 
          backgroundColor: colors.surface,
          borderColor: newWorkflow.trigger?.id === item.id ? colors.accent : colors.border,
        }
      ]}
      onPress={() => setNewWorkflow(prev => ({ ...prev, trigger: item }))}
    >
      <Text style={styles.triggerOptionIcon}>{item.icon}</Text>
      <View style={styles.triggerOptionInfo}>
        <Text style={[styles.triggerOptionName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.triggerOptionDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
      </View>
      {newWorkflow.trigger?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
      )}
    </TouchableOpacity>
  );

  const renderActionOption = ({ item }: { item: AutomationAction }) => (
    <TouchableOpacity
      style={[
        styles.actionOption,
        { 
          backgroundColor: colors.surface,
          borderColor: newWorkflow.actions.some(a => a.id === item.id) ? colors.accent : colors.border,
        }
      ]}
      onPress={() => {
        const isSelected = newWorkflow.actions.some(a => a.id === item.id);
        if (isSelected) {
          setNewWorkflow(prev => ({ 
            ...prev, 
            actions: prev.actions.filter(a => a.id !== item.id) 
          }));
        } else {
          setNewWorkflow(prev => ({ 
            ...prev, 
            actions: [...prev.actions, item] 
          }));
        }
      }}
    >
      <Text style={styles.actionOptionIcon}>{item.icon}</Text>
      <View style={styles.actionOptionInfo}>
        <Text style={[styles.actionOptionName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.actionOptionDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
      </View>
      {newWorkflow.actions.some(a => a.id === item.id) && (
        <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {currentMode === 'faith' ? 'Kingdom Workflows' : 'Workflow Automation'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your Workflows
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.accent }]}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.createButtonText}>+ Create</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={workflows}
            renderItem={renderWorkflow}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.workflowsList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🤖</Text>
                <Text style={[styles.emptyStateText, { color: colors.text }]}>
                  {currentMode === 'faith' ? 'No Kingdom workflows yet' : 'No automation workflows yet'}
                </Text>
                <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                  Create your first workflow to start automating!
                </Text>
              </View>
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Automation Tips
          </Text>
          <View style={[styles.tipsCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.tipText, { color: colors.text }]}>
              💡 Start with simple workflows and gradually add complexity
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              🎯 Test workflows thoroughly before activating them
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              📊 Monitor workflow performance and adjust as needed
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              🔄 Review and update triggers regularly for best results
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Create Workflow Modal */}
      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create Workflow
            </Text>
            <TouchableOpacity onPress={createWorkflow}>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Create
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Workflow Name *
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newWorkflow.name}
                onChangeText={(text) => setNewWorkflow(prev => ({ ...prev, name: text }))}
                placeholder={currentMode === 'faith' ? 
                  "Daily Scripture Automation" : 
                  "Growth Milestone Celebration"
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
                value={newWorkflow.description}
                onChangeText={(text) => setNewWorkflow(prev => ({ ...prev, description: text }))}
                placeholder="Describe what this workflow does"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Choose Trigger *
              </Text>
              <FlatList
                data={triggers}
                renderItem={renderTriggerOption}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.optionsList}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Choose Actions * (Select one or more)
              </Text>
              <FlatList
                data={actions}
                renderItem={renderActionOption}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.optionsList}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Modal (placeholder) */}
      <Modal visible={showEditModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Close
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Workflow
            </Text>
            <TouchableOpacity>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={[styles.comingSoonText, { color: colors.textSecondary }]}>
              Workflow editing features coming soon!{'\n\n'}
              You'll be able to:{'\n'}
              • Modify triggers and actions{'\n'}
              • Adjust timing and conditions{'\n'}
              • Add conditional logic{'\n'}
              • Test different scenarios
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
  workflowsList: {
    gap: 16,
  },
  workflowCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  workflowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workflowInfo: {
    flex: 1,
  },
  workflowTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  workflowName: {
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
  workflowDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  workflowFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  triggerBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  triggerIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  triggerName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  arrow: {
    marginHorizontal: 8,
  },
  actionsContainer: {
    flex: 1,
  },
  actionFlow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
    marginRight: 8,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionArrow: {
    marginRight: 8,
  },
  workflowStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  workflowActions: {
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
  testButton: {
    // backgroundColor applied dynamically
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
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
    marginBottom: 24,
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
  optionsList: {
    gap: 12,
  },
  triggerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  triggerOptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  triggerOptionInfo: {
    flex: 1,
  },
  triggerOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  triggerOptionDescription: {
    fontSize: 14,
  },
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  actionOptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionOptionInfo: {
    flex: 1,
  },
  actionOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionOptionDescription: {
    fontSize: 14,
  },
  comingSoonText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    lineHeight: 24,
  },
});

export default React.memo(WorkflowAutomationScreen);
