import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { KingdomColors } from '../../constants/KingdomColors';

interface Course {
  id: string;
  title: string;
  description: string;
  modules: number;
  students: number;
  status: 'draft' | 'published' | 'archived';
  price: number;
  createdAt: string;
}

interface CourseModule {
  id: string;
  title: string;
  videoUrl?: string;
  documents: string[];
  quiz?: boolean;
  completed: boolean;
}

export default function CoursesScreen() {
  const [activeTab, setActiveTab] = useState<'courses' | 'create' | 'analytics'>('courses');
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Kingdom Entrepreneurship Foundations',
      description: 'Learn to build businesses that glorify God and impact the Kingdom',
      modules: 8,
      students: 156,
      status: 'published',
      price: 197,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Faith-Based Content Creation',
      description: 'Create content that inspires and transforms lives',
      modules: 6,
      students: 89,
      status: 'published',
      price: 97,
      createdAt: '2024-02-01',
    },
    {
      id: '3',
      title: 'Divine Marketing Strategies',
      description: 'Marketing principles aligned with Kingdom values',
      modules: 5,
      students: 0,
      status: 'draft',
      price: 147,
      createdAt: '2024-03-01',
    },
  ]);

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: 0,
  });

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const course: Course = {
      id: Date.now().toString(),
      title: newCourse.title,
      description: newCourse.description,
      modules: 0,
      students: 0,
      status: 'draft',
      price: newCourse.price,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCourses([...courses, course]);
    setNewCourse({ title: '', description: '', price: 0 });
    Alert.alert('Success', 'Course created successfully!');
    setActiveTab('courses');
  };

  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'published':
        return KingdomColors.accent.success;
      case 'draft':
        return KingdomColors.accent.warning;
      case 'archived':
        return KingdomColors.text.secondary;
      default:
        return KingdomColors.text.secondary;
    }
  };

  const renderCourseCard = (course: Course) => (
    <View key={course.id} style={styles.courseCard}>
      <View style={styles.courseHeader}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(course.status) }]}>
          <Text style={styles.statusText}>{course.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.courseDescription}>{course.description}</Text>
      
      <View style={styles.courseStats}>
        <View style={styles.statItem}>
          <Ionicons name="play-circle-outline" size={16} color={KingdomColors.text.secondary} />
          <Text style={styles.statText}>{course.modules} modules</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="people-outline" size={16} color={KingdomColors.text.secondary} />
          <Text style={styles.statText}>{course.students} students</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="cash-outline" size={16} color={KingdomColors.text.secondary} />
          <Text style={styles.statText}>${course.price}</Text>
        </View>
      </View>
      
      <View style={styles.courseActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color={KingdomColors.primary.royalPurple} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="analytics-outline" size={20} color={KingdomColors.primary.royalPurple} />
          <Text style={styles.actionText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="people-outline" size={20} color={KingdomColors.primary.royalPurple} />
          <Text style={styles.actionText}>Students</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCoursesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Courses</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setActiveTab('create')}
        >
          <Ionicons name="add" size={24} color={KingdomColors.background.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.overview}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewNumber}>{courses.filter(c => c.status === 'published').length}</Text>
          <Text style={styles.overviewLabel}>Published Courses</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewNumber}>{courses.reduce((sum, c) => sum + c.students, 0)}</Text>
          <Text style={styles.overviewLabel}>Total Students</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewNumber}>${courses.reduce((sum, c) => sum + (c.price * c.students), 0)}</Text>
          <Text style={styles.overviewLabel}>Revenue</Text>
        </View>
      </View>
      
      {courses.map(renderCourseCard)}
    </ScrollView>
  );

  const renderCreateTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.createCourseForm}>
        <Text style={styles.formTitle}>Create New Course</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Course Title *</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.input}>{newCourse.title || 'Enter course title...'}</Text>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description *</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <Text style={styles.input}>{newCourse.description || 'Enter course description...'}</Text>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Price ($)</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.input}>{newCourse.price || 'Enter price...'}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.createCourseButton} onPress={handleCreateCourse}>
          <Text style={styles.createCourseButtonText}>Create Course</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderAnalyticsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Course Analytics</Text>
      
      <View style={styles.analyticsGrid}>
        <View style={styles.analyticsCard}>
          <Ionicons name="trending-up" size={32} color={KingdomColors.primary.royalPurple} />
          <Text style={styles.analyticsNumber}>2,847</Text>
          <Text style={styles.analyticsLabel}>Total Views</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Ionicons name="checkmark-circle" size={32} color={KingdomColors.accent.success} />
          <Text style={styles.analyticsNumber}>78%</Text>
          <Text style={styles.analyticsLabel}>Completion Rate</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Ionicons name="star" size={32} color={KingdomColors.gold.bright} />
          <Text style={styles.analyticsNumber}>4.8</Text>
          <Text style={styles.analyticsLabel}>Avg Rating</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Ionicons name="cash" size={32} color={KingdomColors.accent.success} />
          <Text style={styles.analyticsNumber}>$12,456</Text>
          <Text style={styles.analyticsLabel}>Total Revenue</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'courses' && styles.activeTab]}
          onPress={() => setActiveTab('courses')}
        >
          <Ionicons 
            name="school-outline" 
            size={20} 
            color={activeTab === 'courses' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'courses' && styles.activeTabText]}>
            Courses
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}
        >
          <Ionicons 
            name="add-circle-outline" 
            size={20} 
            color={activeTab === 'create' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            Create
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
          onPress={() => setActiveTab('analytics')}
        >
          <Ionicons 
            name="analytics-outline" 
            size={20} 
            color={activeTab === 'analytics' ? KingdomColors.primary.royalPurple : KingdomColors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'courses' && renderCoursesTab()}
      {activeTab === 'create' && renderCreateTab()}
      {activeTab === 'analytics' && renderAnalyticsTab()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.default.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: KingdomColors.primary.royalPurple,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: KingdomColors.text.secondary,
  },
  activeTabText: {
    color: KingdomColors.primary.royalPurple,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  createButton: {
    backgroundColor: KingdomColors.primary.royalPurple,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  overviewCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    flex: 0.3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.primary.royalPurple,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
  courseCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: KingdomColors.background.primary,
  },
  courseDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
  },
  courseActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: KingdomColors.default.border,
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: KingdomColors.primary.royalPurple,
    fontWeight: '500',
  },
  createCourseForm: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
    borderRadius: 8,
    backgroundColor: KingdomColors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textAreaContainer: {
    minHeight: 80,
  },
  input: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
  },
  createCourseButton: {
    backgroundColor: KingdomColors.primary.royalPurple,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  createCourseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.background.primary,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  analyticsCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: KingdomColors.default.border,
  },
  analyticsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
});
