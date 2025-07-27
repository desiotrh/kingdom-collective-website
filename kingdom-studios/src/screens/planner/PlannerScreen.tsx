import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppNavigation } from '../../utils/navigationUtils';
import { useFaithMode } from '../../contexts/FaithModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { KingdomColors } from '../../constants/KingdomColors';
import { KingdomShadows } from '../../constants/KingdomShadows';
import KingdomLogo from '../../components/KingdomLogo';

const { width } = Dimensions.get('window');

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  type: 'content' | 'product' | 'marketing' | 'general';
  faithMode?: {
    title: string;
    description: string;
  };
}

interface PlannerTool {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string[];
  faithMode?: {
    title: string;
    description: string;
  };
}

const PlannerScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState<'kanban' | 'calendar' | 'tasks'>('kanban');

  const plannerTools: PlannerTool[] = [
    {
      id: 'kanban-board',
      title: faithMode ? 'Kingdom Kanban Board' : 'Kanban Board',
      description: faithMode
        ? 'Organize your Kingdom building tasks visually'
        : 'Visual task management with drag & drop',
      icon: '📋',
      gradient: [KingdomColors.primary.royalPurple, KingdomColors.gold.bright],
      faithMode: {
        title: 'Kingdom Kanban Board',
        description: 'Organize your Kingdom building tasks visually'
      }
    },
    {
      id: 'content-calendar',
      title: faithMode ? 'Faith Content Calendar' : 'Content Calendar',
      description: faithMode
        ? 'Plan your Kingdom content with purpose'
        : 'Schedule and plan your content strategy',
      icon: '📅',
      gradient: [KingdomColors.gold.warm, KingdomColors.primary.deepNavy],
      faithMode: {
        title: 'Faith Content Calendar',
        description: 'Plan your Kingdom content with purpose'
      }
    },
    {
      id: 'task-manager',
      title: faithMode ? 'Kingdom Task Manager' : 'Smart Task Manager',
      description: faithMode
        ? 'Manage tasks with Kingdom priorities'
        : 'AI-powered task prioritization and tracking',
      icon: '✅',
      gradient: [KingdomColors.accent.success, KingdomColors.primary.midnight],
      faithMode: {
        title: 'Kingdom Task Manager',
        description: 'Manage tasks with Kingdom priorities'
      }
    },
    {
      id: 'goal-tracker',
      title: faithMode ? 'Kingdom Goals Tracker' : 'Goal Achievement Tracker',
      description: faithMode
        ? 'Track your Kingdom building milestones'
        : 'Set and track your business goals',
      icon: '🎯',
      gradient: [KingdomColors.accent.info, KingdomColors.silver.bright],
      faithMode: {
        title: 'Kingdom Goals Tracker',
        description: 'Track your Kingdom building milestones'
      }
    },
  ];

  const tasks: Task[] = [
    {
      id: '1',
      title: faithMode ? 'Create Kingdom Post for Instagram' : 'Create Instagram Post',
      description: faithMode ? 'Design inspiring Kingdom content' : 'Design motivational content',
      status: 'todo',
      priority: 'high',
      dueDate: 'Today',
      type: 'content',
      faithMode: {
        title: 'Create Kingdom Post for Instagram',
        description: 'Design inspiring Kingdom content'
      }
    },
    {
      id: '2',
      title: faithMode ? 'Faith T-Shirt Design Review' : 'Product Design Review',
      description: 'Review and approve new designs',
      status: 'inProgress',
      priority: 'medium',
      dueDate: 'Tomorrow',
      type: 'product',
    },
    {
      id: '3',
      title: faithMode ? 'Kingdom Email Sequence' : 'Email Campaign',
      description: faithMode ? 'Write Kingdom-focused email series' : 'Write nurture email series',
      status: 'review',
      priority: 'high',
      dueDate: 'Friday',
      type: 'marketing',
      faithMode: {
        title: 'Kingdom Email Sequence',
        description: 'Write Kingdom-focused email series'
      }
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return KingdomColors.gray;
      case 'inProgress': return KingdomColors.accent.info;
      case 'review': return KingdomColors.gold.bright;
      case 'done': return KingdomColors.accent.success;
      default: return KingdomColors.gray;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return KingdomColors.accent.success;
      case 'medium': return KingdomColors.gold.bright;
      case 'high': return KingdomColors.accent.error;
      default: return KingdomColors.gray;
    }
  };

  const renderKanbanView = () => (
    <View style={styles.kanbanContainer}>
      <Text style={styles.sectionTitle}>
        {faithMode ? '📋 Kingdom Task Board' : '📋 Task Board'}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.kanbanColumns}>
          {['todo', 'inProgress', 'review', 'done'].map(status => (
            <View key={status} style={styles.kanbanColumn}>
              <View style={[styles.columnHeader, { backgroundColor: getStatusColor(status) }]}>
                <Text style={styles.columnTitle}>
                  {status === 'todo' && (faithMode ? 'Kingdom To-Do' : 'To Do')}
                  {status === 'inProgress' && 'In Progress'}
                  {status === 'review' && 'Review'}
                  {status === 'done' && (faithMode ? 'Kingdom Complete' : 'Done')}
                </Text>
                <Text style={styles.columnCount}>
                  {tasks.filter(task => task.status === status).length}
                </Text>
              </View>

              {tasks
                .filter(task => task.status === status)
                .map(task => (
                  <TouchableOpacity key={task.id} style={styles.taskCard}>
                    <Text style={styles.taskTitle}>
                      {faithMode && task.faithMode ? task.faithMode.title : task.title}
                    </Text>
                    <Text style={styles.taskDescription}>
                      {faithMode && task.faithMode ? task.faithMode.description : task.description}
                    </Text>
                    <View style={styles.taskMeta}>
                      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                        <Text style={styles.priorityText}>{task.priority}</Text>
                      </View>
                      <Text style={styles.taskDueDate}>{task.dueDate}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderCalendarView = () => (
    <View style={styles.calendarContainer}>
      <Text style={styles.sectionTitle}>
        {faithMode ? '📅 Kingdom Content Calendar' : '📅 Content Calendar'}
      </Text>
      <Text style={styles.sectionSubtitle}>
        {faithMode
          ? 'Plan your Kingdom content with divine purpose'
          : 'Strategic content planning and scheduling'}
      </Text>

      {/* Calendar Widget Placeholder */}
      <View style={styles.calendarWidget}>
        <LinearGradient
          colors={[KingdomColors.primary.royalPurple, KingdomColors.gold.bright]}
          style={styles.calendarGradient}
        >
          <Text style={styles.calendarIcon}>📅</Text>
          <Text style={styles.calendarTitle}>
            {faithMode ? 'Kingdom Calendar Widget' : 'Interactive Calendar'}
          </Text>
          <Text style={styles.calendarSubtitle}>Coming Soon!</Text>
        </LinearGradient>
      </View>

      {/* Upcoming Tasks */}
      <Text style={styles.upcomingTitle}>
        {faithMode ? '⚡ Upcoming Kingdom Tasks' : '⚡ Upcoming Tasks'}
      </Text>
      {tasks.slice(0, 3).map(task => (
        <View key={task.id} style={styles.upcomingTask}>
          <View style={styles.upcomingTaskInfo}>
            <Text style={styles.upcomingTaskTitle}>
              {faithMode && task.faithMode ? task.faithMode.title : task.title}
            </Text>
            <Text style={styles.upcomingTaskDate}>{task.dueDate}</Text>
          </View>
          <View style={[styles.taskStatusDot, { backgroundColor: getStatusColor(task.status) }]} />
        </View>
      ))}
    </View>
  );

  const renderTasksView = () => (
    <View style={styles.tasksContainer}>
      <Text style={styles.sectionTitle}>
        {faithMode ? '✅ Kingdom Task Manager' : '✅ Task Manager'}
      </Text>

      {/* Task Stats */}
      <View style={styles.taskStats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>
            {faithMode ? 'Kingdom Tasks' : 'Total Tasks'}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>High Priority</Text>
        </View>
      </View>

      {/* Task List */}
      {tasks.map(task => (
        <TouchableOpacity key={task.id} style={styles.taskListItem}>
          <View style={styles.taskListContent}>
            <Text style={styles.taskListTitle}>
              {faithMode && task.faithMode ? task.faithMode.title : task.title}
            </Text>
            <Text style={styles.taskListDescription}>
              {faithMode && task.faithMode ? task.faithMode.description : task.description}
            </Text>
            <View style={styles.taskListMeta}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                <Text style={styles.statusText}>{task.status}</Text>
              </View>
              <Text style={styles.taskListDate}>{task.dueDate}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (selectedView) {
      case 'kanban':
        return renderKanbanView();
      case 'calendar':
        return renderCalendarView();
      case 'tasks':
        return renderTasksView();
      default:
        return renderKanbanView();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.background.primary, KingdomColors.background.secondary]}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <KingdomLogo size="medium" />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {faithMode ? '📋 Kingdom Planner' : '📋 Content Planner Pro'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {faithMode ? 'Plan with Kingdom purpose' : 'Replace Notion & Trello'}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedView === 'kanban' && styles.activeTab]}
            onPress={() => setSelectedView('kanban')}
          >
            <Text style={[styles.tabText, selectedView === 'kanban' && styles.activeTabText]}>
              Kanban
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedView === 'calendar' && styles.activeTab]}
            onPress={() => setSelectedView('calendar')}
          >
            <Text style={[styles.tabText, selectedView === 'calendar' && styles.activeTabText]}>
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedView === 'tasks' && styles.activeTab]}
            onPress={() => setSelectedView('tasks')}
          >
            <Text style={[styles.tabText, selectedView === 'tasks' && styles.activeTabText]}>
              Tasks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {renderTabContent()}

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionIcon}>➕</Text>
                <Text style={styles.actionText}>
                  {faithMode ? 'Add Kingdom Task' : 'Add Task'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionIcon}>📅</Text>
                <Text style={styles.actionText}>Schedule Content</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionIcon}>🎯</Text>
                <Text style={styles.actionText}>
                  {faithMode ? 'Set Kingdom Goal' : 'Set Goal'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionText}>View Analytics</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerContent: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: KingdomColors.primary.royalPurple,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
  },
  activeTabText: {
    color: KingdomColors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  kanbanContainer: {
    flex: 1,
  },
  kanbanColumns: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  kanbanColumn: {
    width: 250,
    marginRight: 16,
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
  columnCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: KingdomColors.white,
    backgroundColor: KingdomColors.opacity.white20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  taskCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    ...KingdomShadows.small,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: KingdomColors.white,
    textTransform: 'uppercase',
  },
  taskDueDate: {
    fontSize: 10,
    color: KingdomColors.text.secondary,
  },
  calendarContainer: {
    flex: 1,
  },
  calendarWidget: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    ...KingdomShadows.medium,
  },
  calendarGradient: {
    padding: 40,
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 8,
  },
  calendarSubtitle: {
    fontSize: 14,
    color: KingdomColors.white,
    opacity: 0.9,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  upcomingTask: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: KingdomColors.background.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    ...KingdomShadows.small,
  },
  upcomingTaskInfo: {
    flex: 1,
  },
  upcomingTaskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 2,
  },
  upcomingTaskDate: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
  },
  taskStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  tasksContainer: {
    flex: 1,
  },
  taskStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    ...KingdomShadows.small,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
  taskListItem: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...KingdomShadows.small,
  },
  taskListContent: {
    flex: 1,
  },
  taskListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  taskListDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  taskListMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: KingdomColors.white,
    textTransform: 'uppercase',
  },
  taskListDate: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
  },
  quickActions: {
    marginTop: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: KingdomColors.gray,
    ...KingdomShadows.small,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    textAlign: 'center',
  },
});

export default PlannerScreen;
