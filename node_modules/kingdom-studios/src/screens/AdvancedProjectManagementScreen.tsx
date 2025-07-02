import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  dueDate: string;
  team: string[];
  tasks: Task[];
  tags: string[];
  budget: number;
  spent: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  projectId: string;
}

export default function AdvancedProjectManagementScreen() {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;

  const [selectedView, setSelectedView] = useState<'overview' | 'projects' | 'tasks' | 'timeline' | 'reports'>('overview');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    dueDate: '',
    budget: 0,
  });

  // Mock data
  const mockProjects: Project[] = [
    {
      id: '1',
      name: currentMode === 'faith' ? 'Ministry Website Redesign' : 'Brand Website Redesign',
      description: currentMode === 'faith' 
        ? 'Complete overhaul of church website with modern design and enhanced ministry features'
        : 'Complete overhaul of company website with modern design and enhanced user experience',
      status: 'active',
      priority: 'high',
      progress: 65,
      dueDate: '2024-03-15',
      team: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      tasks: [
        {
          id: 't1',
          title: 'UI/UX Design',
          description: 'Create wireframes and mockups',
          assignee: 'Jane Smith',
          status: 'completed',
          priority: 'high',
          dueDate: '2024-02-01',
          estimatedHours: 40,
          actualHours: 38,
          dependencies: [],
        },
        {
          id: 't2',
          title: 'Frontend Development',
          description: 'Implement responsive design',
          assignee: 'John Doe',
          status: 'in-progress',
          priority: 'high',
          dueDate: '2024-02-20',
          estimatedHours: 60,
          actualHours: 25,
          dependencies: ['t1'],
        },
      ],
      tags: currentMode === 'faith' ? ['ministry', 'website', 'design'] : ['business', 'website', 'design'],
      budget: 15000,
      spent: 9750,
    },
    {
      id: '2',
      name: currentMode === 'faith' ? 'Easter Campaign' : 'Q1 Marketing Campaign',
      description: currentMode === 'faith'
        ? 'Comprehensive Easter celebration and outreach campaign'
        : 'Comprehensive Q1 marketing and lead generation campaign',
      status: 'planning',
      priority: 'medium',
      progress: 25,
      dueDate: '2024-04-01',
      team: ['Sarah Wilson', 'Tom Brown'],
      tasks: [],
      tags: currentMode === 'faith' ? ['easter', 'outreach', 'campaign'] : ['marketing', 'leads', 'campaign'],
      budget: 8000,
      spent: 1200,
    },
  ];

  const mockMilestones: Milestone[] = [
    {
      id: 'm1',
      title: currentMode === 'faith' ? 'Ministry Site Launch' : 'Website Launch',
      description: 'Launch new website with enhanced features',
      dueDate: '2024-03-15',
      completed: false,
      projectId: '1',
    },
    {
      id: 'm2',
      title: currentMode === 'faith' ? 'Easter Event Planning' : 'Q1 Campaign Launch',
      description: currentMode === 'faith' ? 'Complete Easter event planning' : 'Launch Q1 marketing campaign',
      dueDate: '2024-04-01',
      completed: false,
      projectId: '2',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'active':
      case 'in-progress':
        return colors.info;
      case 'on-hold':
        return colors.warning;
      case 'planning':
      case 'todo':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return colors.error;
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.info;
      case 'low':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const createProject = () => {
    if (!newProject.name.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }
    
    Alert.alert('Success', 'Project created successfully!');
    setShowProjectModal(false);
    setNewProject({
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      dueDate: '',
      budget: 0,
    });
  };

  const renderOverview = () => (
    <ScrollView style={styles.content}>
      {/* Key Metrics */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {currentMode === 'faith' ? '📊 Ministry Overview' : '📊 Project Overview'}
        </Text>
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.metricValue, { color: colors.primary }]}>12</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Active Projects</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.metricValue, { color: colors.success }]}>85%</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Completion Rate</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.metricValue, { color: colors.warning }]}>23</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Pending Tasks</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.metricValue, { color: colors.info }]}>$45K</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Total Budget</Text>
          </View>
        </View>
      </View>

      {/* Recent Projects */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🎯 Recent Projects
        </Text>
        {mockProjects.slice(0, 3).map((project) => (
          <TouchableOpacity
            key={project.id}
            style={[styles.projectCard, { backgroundColor: colors.background }]}
            onPress={() => setSelectedProject(project)}
          >
            <View style={styles.projectHeader}>
              <Text style={[styles.projectName, { color: colors.text }]}>
                {project.name}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                <Text style={[styles.statusText, { color: colors.surface }]}>
                  {project.status}
                </Text>
              </View>
            </View>
            <Text style={[styles.projectDescription, { color: colors.textSecondary }]}>
              {project.description}
            </Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: colors.primary, width: `${project.progress}%` }
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                {project.progress}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Milestones */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🏆 Upcoming Milestones
        </Text>
        {mockMilestones.map((milestone) => (
          <View key={milestone.id} style={[styles.milestoneCard, { backgroundColor: colors.background }]}>
            <View style={styles.milestoneHeader}>
              <Ionicons
                name={milestone.completed ? 'checkmark-circle' : 'radio-button-off'}
                size={24}
                color={milestone.completed ? colors.success : colors.textSecondary}
              />
              <Text style={[styles.milestoneTitle, { color: colors.text }]}>
                {milestone.title}
              </Text>
            </View>
            <Text style={[styles.milestoneDate, { color: colors.textSecondary }]}>
              Due: {milestone.dueDate}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderProjects = () => (
    <ScrollView style={styles.content}>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            All Projects
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowProjectModal(true)}
          >
            <Ionicons name="add" size={20} color={colors.surface} />
            <Text style={[styles.addButtonText, { color: colors.surface }]}>
              New Project
            </Text>
          </TouchableOpacity>
        </View>
        
        {mockProjects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={[styles.projectCard, { backgroundColor: colors.background }]}
            onPress={() => setSelectedProject(project)}
          >
            <View style={styles.projectHeader}>
              <Text style={[styles.projectName, { color: colors.text }]}>
                {project.name}
              </Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(project.priority) }]}>
                <Text style={[styles.priorityText, { color: colors.surface }]}>
                  {project.priority}
                </Text>
              </View>
            </View>
            <Text style={[styles.projectDescription, { color: colors.textSecondary }]}>
              {project.description}
            </Text>
            <View style={styles.projectDetails}>
              <Text style={[styles.projectDetail, { color: colors.textSecondary }]}>
                Team: {project.team.length} members
              </Text>
              <Text style={[styles.projectDetail, { color: colors.textSecondary }]}>
                Budget: ${project.budget.toLocaleString()}
              </Text>
              <Text style={[styles.projectDetail, { color: colors.textSecondary }]}>
                Due: {project.dueDate}
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: colors.primary, width: `${project.progress}%` }
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                {project.progress}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderCreateProjectModal = () => (
    <Modal
      visible={showProjectModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowProjectModal(false)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {currentMode === 'faith' ? 'New Ministry Project' : 'New Project'}
          </Text>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={createProject}
          >
            <Text style={[styles.saveButtonText, { color: colors.surface }]}>Create</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Project Name</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text }]}
              value={newProject.name}
              onChangeText={(text) => setNewProject(prev => ({ ...prev, name: text }))}
              placeholder="Enter project name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text }]}
              value={newProject.description}
              onChangeText={(text) => setNewProject(prev => ({ ...prev, description: text }))}
              placeholder="Enter project description"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Priority</Text>
            <View style={styles.buttonGroup}>
              {['low', 'medium', 'high', 'urgent'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.selectionButton,
                    {
                      backgroundColor: newProject.priority === priority ? colors.primary : colors.surface,
                    }
                  ]}
                  onPress={() => setNewProject(prev => ({ ...prev, priority: priority as any }))}
                >
                  <Text
                    style={[
                      styles.selectionButtonText,
                      {
                        color: newProject.priority === priority ? colors.surface : colors.text,
                      }
                    ]}
                  >
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Budget ($)</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text }]}
              value={newProject.budget.toString()}
              onChangeText={(text) => setNewProject(prev => ({ ...prev, budget: parseInt(text) || 0 }))}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {currentMode === 'faith' ? '🏗️ Ministry Project Hub' : '🏗️ Project Management Hub'}
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {currentMode === 'faith' 
            ? 'Manage your ministry projects with divine organization'
            : 'Advanced project management and collaboration'
          }
        </Text>
      </View>

      {/* Navigation Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {[
          { key: 'overview', label: 'Overview', icon: 'home' },
          { key: 'projects', label: 'Projects', icon: 'folder' },
          { key: 'tasks', label: 'Tasks', icon: 'checkmark-circle' },
          { key: 'timeline', label: 'Timeline', icon: 'calendar' },
          { key: 'reports', label: 'Reports', icon: 'analytics' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              {
                backgroundColor: selectedView === tab.key ? colors.primary : colors.surface,
              }
            ]}
            onPress={() => setSelectedView(tab.key as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={selectedView === tab.key ? colors.surface : colors.text}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: selectedView === tab.key ? colors.surface : colors.text,
                }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'projects' && renderProjects()}
      {selectedView === 'tasks' && (
        <View style={[styles.placeholderContent, { backgroundColor: colors.surface }]}>
          <Ionicons name="checkmark-circle-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            Task management view coming soon
          </Text>
        </View>
      )}
      {selectedView === 'timeline' && (
        <View style={[styles.placeholderContent, { backgroundColor: colors.surface }]}>
          <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            Timeline view coming soon
          </Text>
        </View>
      )}
      {selectedView === 'reports' && (
        <View style={[styles.placeholderContent, { backgroundColor: colors.surface }]}>
          <Ionicons name="analytics-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            Reports view coming soon
          </Text>
        </View>
      )}

      {/* Modals */}
      {renderCreateProjectModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  tabsContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  projectCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  projectDescription: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  projectDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  projectDetail: {
    fontSize: 12,
    marginRight: 15,
    marginBottom: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  milestoneCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  milestoneDate: {
    fontSize: 14,
    marginLeft: 34,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  textArea: {
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
});
