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
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  joinedAt: Date;
  lastActive: Date;
  isOnline: boolean;
  permissions: {
    canCreateContent: boolean;
    canEditContent: boolean;
    canDeleteContent: boolean;
    canManageTeam: boolean;
    canAccessAnalytics: boolean;
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  assignedTo: string[];
  createdBy: string;
  createdAt: Date;
  progress: number;
  type: 'campaign' | 'content-series' | 'product-launch' | 'ministry-event';
  tags: string[];
}

interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
}

const TeamCollaborationScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;

  const [activeTab, setActiveTab] = useState<'projects' | 'team' | 'tasks'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [modalType, setModalType] = useState<'project' | 'task'>('project');
  
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    type: 'campaign' as Project['type'],
    priority: 'medium' as Project['priority'],
    dueDate: new Date(),
    assignedTo: [] as string[],
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    priority: 'medium' as Task['priority'],
    dueDate: new Date(),
  });

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('editor');

  useEffect(() => {
    loadData();
  }, [currentMode]);

  const loadData = () => {
    // Mock team members
    const mockTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'You (Owner)',
        email: 'owner@kingdomstudios.com',
        role: 'owner',
        joinedAt: new Date('2024-01-01'),
        lastActive: new Date(),
        isOnline: true,
        permissions: {
          canCreateContent: true,
          canEditContent: true,
          canDeleteContent: true,
          canManageTeam: true,
          canAccessAnalytics: true,
        },
      },
      {
        id: '2',
        name: currentMode === 'faith' ? 'Sarah (Ministry Partner)' : 'Sarah (Content Creator)',
        email: 'sarah@example.com',
        role: 'admin',
        joinedAt: new Date('2024-02-15'),
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isOnline: false,
        permissions: {
          canCreateContent: true,
          canEditContent: true,
          canDeleteContent: true,
          canManageTeam: true,
          canAccessAnalytics: true,
        },
      },
      {
        id: '3',
        name: currentMode === 'faith' ? 'Michael (Creative Servant)' : 'Michael (Designer)',
        email: 'michael@example.com',
        role: 'editor',
        joinedAt: new Date('2024-03-01'),
        lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isOnline: true,
        permissions: {
          canCreateContent: true,
          canEditContent: true,
          canDeleteContent: false,
          canManageTeam: false,
          canAccessAnalytics: false,
        },
      },
    ];

    // Mock projects
    const mockProjects: Project[] = currentMode === 'faith' ? [
      {
        id: '1',
        name: 'Easter Revival Campaign',
        description: 'Multi-platform campaign to share the resurrection message',
        status: 'active',
        priority: 'high',
        dueDate: new Date('2025-03-30'),
        assignedTo: ['2', '3'],
        createdBy: '1',
        createdAt: new Date('2025-01-15'),
        progress: 65,
        type: 'ministry-event',
        tags: ['easter', 'revival', 'social-media'],
      },
      {
        id: '2',
        name: 'Kingdom Business Academy Launch',
        description: 'Launch our faith-based entrepreneurship course',
        status: 'planning',
        priority: 'high',
        dueDate: new Date('2025-09-01'),
        assignedTo: ['1', '2'],
        createdBy: '1',
        createdAt: new Date('2025-06-01'),
        progress: 25,
        type: 'product-launch',
        tags: ['course', 'business', 'launch'],
      },
      {
        id: '3',
        name: 'Daily Devotional Content Series',
        description: '30-day devotional content for social media',
        status: 'review',
        priority: 'medium',
        dueDate: new Date('2025-08-01'),
        assignedTo: ['3'],
        createdBy: '2',
        createdAt: new Date('2025-06-15'),
        progress: 90,
        type: 'content-series',
        tags: ['devotional', 'daily', 'content'],
      },
    ] : [
      {
        id: '1',
        name: 'Summer Product Launch',
        description: 'Launch new productivity course for creators',
        status: 'active',
        priority: 'high',
        dueDate: new Date('2025-08-15'),
        assignedTo: ['2', '3'],
        createdBy: '1',
        createdAt: new Date('2025-06-01'),
        progress: 45,
        type: 'product-launch',
        tags: ['course', 'productivity', 'creators'],
      },
      {
        id: '2',
        name: 'Viral Content Challenge',
        description: '7-day challenge to create viral content',
        status: 'planning',
        priority: 'medium',
        dueDate: new Date('2025-08-01'),
        assignedTo: ['1', '3'],
        createdBy: '2',
        createdAt: new Date('2025-07-01'),
        progress: 15,
        type: 'campaign',
        tags: ['viral', 'challenge', 'engagement'],
      },
    ];

    // Mock tasks
    const mockTasks: Task[] = [
      {
        id: '1',
        projectId: '1',
        title: currentMode === 'faith' ? 'Create Easter sermon graphics' : 'Design product launch graphics',
        description: 'Design 10 social media graphics for the campaign',
        assignedTo: '3',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2025-07-10'),
        createdAt: new Date('2025-07-01'),
      },
      {
        id: '2',
        projectId: '1',
        title: currentMode === 'faith' ? 'Write resurrection testimonies' : 'Write email campaign copy',
        description: 'Create compelling copy for email sequences',
        assignedTo: '2',
        status: 'completed',
        priority: 'high',
        dueDate: new Date('2025-07-05'),
        createdAt: new Date('2025-06-30'),
        completedAt: new Date('2025-07-04'),
      },
      {
        id: '3',
        projectId: '2',
        title: currentMode === 'faith' ? 'Record Kingdom business testimonies' : 'Record course introduction videos',
        description: 'Create 5 introduction videos for the course',
        assignedTo: '1',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2025-07-20'),
        createdAt: new Date('2025-07-02'),
      },
    ];

    setTeamMembers(mockTeamMembers);
    setProjects(mockProjects);
    setTasks(mockTasks);
  };

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "🤝 Build God's Kingdom together through collaborative ministry",
      "✨ Unite in purpose for greater Kingdom impact",
      "🙏 Work together as the body of Christ",
      "💝 Multiply your ministry through faithful partnerships",
    ];

    const encouragementPrompts = [
      "🚀 Achieve more together than you ever could alone",
      "💪 Build unstoppable teams that create amazing results",
      "🌟 Collaborate your way to extraordinary success",
      "⚡ Turn teamwork into your competitive advantage",
    ];

    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const createProject = () => {
    if (!newProject.name.trim() || !newProject.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      status: 'planning',
      priority: newProject.priority,
      dueDate: newProject.dueDate,
      assignedTo: newProject.assignedTo,
      createdBy: '1',
      createdAt: new Date(),
      progress: 0,
      type: newProject.type,
      tags: [],
    };

    setProjects(prev => [project, ...prev]);
    setShowCreateModal(false);
    setNewProject({
      name: '',
      description: '',
      type: 'campaign',
      priority: 'medium',
      dueDate: new Date(),
      assignedTo: [],
    });

    Alert.alert(
      'Project Created!',
      currentMode === 'faith' 
        ? 'Your Kingdom project is ready for God\'s work!'
        : 'Your project is ready for success!'
    );
  };

  const inviteTeamMember = () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    // In real app, this would send an invitation
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('editor');

    Alert.alert(
      'Invitation Sent!',
      currentMode === 'faith' 
        ? `Kingdom invitation sent to ${inviteEmail}. May God bless this partnership!`
        : `Team invitation sent to ${inviteEmail}. They'll receive an email to join.`
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return colors.textSecondary;
      case 'active': return colors.accent;
      case 'review': return colors.warning;
      case 'completed': return colors.success;
      case 'todo': return colors.textSecondary;
      case 'in-progress': return colors.accent;
      default: return colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return colors.accent;
      case 'admin': return colors.warning;
      case 'editor': return colors.success;
      case 'viewer': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const renderProject = ({ item }: { item: Project }) => (
    <View style={[styles.projectCard, { backgroundColor: colors.surface }]}>
      <View style={styles.projectHeader}>
        <View style={styles.projectInfo}>
          <Text style={[styles.projectName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.projectDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.projectDetails}>
        <View style={styles.projectMeta}>
          <View style={[styles.priorityBadge, { borderColor: getPriorityColor(item.priority) }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
              {item.priority.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
            Due: {item.dueDate.toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
            Progress: {item.progress}%
          </Text>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { backgroundColor: colors.accent, width: `${item.progress}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.assignedContainer}>
          <Text style={[styles.assignedLabel, { color: colors.textSecondary }]}>
            Assigned to: {item.assignedTo.length} member(s)
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTeamMember = ({ item }: { item: TeamMember }) => (
    <View style={[styles.memberCard, { backgroundColor: colors.surface }]}>
      <View style={styles.memberInfo}>
        <View style={styles.memberHeader}>
          <View style={styles.memberNameRow}>
            <Text style={[styles.memberName, { color: colors.text }]}>
              {item.name}
            </Text>
            {item.isOnline && (
              <View style={[styles.onlineIndicator, { backgroundColor: colors.success }]} />
            )}
          </View>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) }]}>
            <Text style={styles.roleText}>{item.role.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={[styles.memberEmail, { color: colors.textSecondary }]}>
          {item.email}
        </Text>
        <Text style={[styles.lastActive, { color: colors.textSecondary }]}>
          {item.isOnline ? 'Online now' : `Last active: ${item.lastActive.toLocaleDateString()}`}
        </Text>
      </View>
    </View>
  );

  const renderTask = ({ item }: { item: Task }) => {
    const assignedMember = teamMembers.find(m => m.id === item.assignedTo);
    
    return (
      <View style={[styles.taskCard, { backgroundColor: colors.surface }]}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.replace('-', ' ').toUpperCase()}</Text>
          </View>
        </View>
        <Text style={[styles.taskDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
        <View style={styles.taskMeta}>
          <Text style={[styles.taskAssigned, { color: colors.textSecondary }]}>
            Assigned to: {assignedMember?.name || 'Unknown'}
          </Text>
          <Text style={[styles.taskDue, { color: colors.textSecondary }]}>
            Due: {item.dueDate.toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'projects': return '📋';
      case 'team': return '👥';
      case 'tasks': return '✅';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {currentMode === 'faith' ? 'Kingdom Collaboration' : 'Team Collaboration'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['projects', 'team', 'tasks'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && [styles.activeTab, { backgroundColor: colors.accent }]
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={styles.tabIcon}>{getTabIcon(tab)}</Text>
            <Text style={[
              styles.tabLabel,
              activeTab === tab ? styles.activeTabText : { color: colors.textSecondary }
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        {activeTab === 'projects' && (
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.accent }]}
            onPress={() => {
              setModalType('project');
              setShowCreateModal(true);
            }}
          >
            <Text style={styles.createButtonText}>+ New Project</Text>
          </TouchableOpacity>
        )}
        {activeTab === 'team' && (
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.accent }]}
            onPress={() => setShowInviteModal(true)}
          >
            <Text style={styles.createButtonText}>+ Invite Member</Text>
          </TouchableOpacity>
        )}
        {activeTab === 'tasks' && (
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.accent }]}
            onPress={() => {
              setModalType('task');
              setShowCreateModal(true);
            }}
          >
            <Text style={styles.createButtonText}>+ New Task</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'projects' && (
          <FlatList
            data={projects}
            renderItem={renderProject}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.contentList}
          />
        )}
        
        {activeTab === 'team' && (
          <FlatList
            data={teamMembers}
            renderItem={renderTeamMember}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.contentList}
          />
        )}
        
        {activeTab === 'tasks' && (
          <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.contentList}
          />
        )}
      </ScrollView>

      {/* Create Project/Task Modal */}
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
              {modalType === 'project' ? 'Create Project' : 'Create Task'}
            </Text>
            <TouchableOpacity onPress={createProject}>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Create
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                {modalType === 'project' ? 'Project Name' : 'Task Title'} *
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={modalType === 'project' ? newProject.name : newTask.title}
                onChangeText={(text) => {
                  if (modalType === 'project') {
                    setNewProject(prev => ({ ...prev, name: text }));
                  } else {
                    setNewTask(prev => ({ ...prev, title: text }));
                  }
                }}
                placeholder={currentMode === 'faith' ? 
                  (modalType === 'project' ? "Kingdom Business Launch" : "Create Easter graphics") : 
                  (modalType === 'project' ? "Summer Product Campaign" : "Design landing page")
                }
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Description *
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={modalType === 'project' ? newProject.description : newTask.description}
                onChangeText={(text) => {
                  if (modalType === 'project') {
                    setNewProject(prev => ({ ...prev, description: text }));
                  } else {
                    setNewTask(prev => ({ ...prev, description: text }));
                  }
                }}
                placeholder={currentMode === 'faith' ? 
                  "Describe how this project will advance God's Kingdom..." :
                  "Describe the project goals and deliverables..."
                }
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Invite Team Member Modal */}
      <Modal
        visible={showInviteModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowInviteModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {currentMode === 'faith' ? 'Invite Kingdom Partner' : 'Invite Team Member'}
            </Text>
            <TouchableOpacity onPress={inviteTeamMember}>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Send Invite
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Email Address *
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="colleague@example.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Role
              </Text>
              <View style={styles.roleOptions}>
                {(['viewer', 'editor', 'admin'] as const).map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      { 
                        backgroundColor: inviteRole === role ? colors.accent : colors.surface,
                        borderColor: colors.border,
                      }
                    ]}
                    onPress={() => setInviteRole(role)}
                  >
                    <Text style={[
                      styles.roleOptionText,
                      { color: inviteRole === role ? '#fff' : colors.text }
                    ]}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
  tabContainer: {
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
  projectCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
    marginRight: 12,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  projectDetails: {
    gap: 12,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: 12,
  },
  progressContainer: {
    gap: 4,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  assignedContainer: {
    // Empty for now
  },
  assignedLabel: {
    fontSize: 12,
  },
  memberCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  memberInfo: {
    // Empty for now
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  memberEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  lastActive: {
    fontSize: 12,
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskAssigned: {
    fontSize: 12,
  },
  taskDue: {
    fontSize: 12,
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
    height: 100,
    textAlignVertical: 'top',
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default React.memo(TeamCollaborationScreen);
