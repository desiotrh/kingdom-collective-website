// Legal Education Hub - Mobile Screen Components
// Main education screen for Kingdom Stand mobile app

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  RefreshControl,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  stateSpecific: boolean;
  states: string[];
  thumbnail: string;
  isActive: boolean;
}

interface UserProgress {
  userId: string;
  courses: {
    [courseId: string]: {
      status: 'not_started' | 'in_progress' | 'completed' | 'certified';
      progress: number;
      timeSpent: number;
      lastAccessed: string;
    };
  };
  analytics: {
    totalTimeSpent: number;
    averageQuizScore: number;
    learningStreak: number;
    completionRate: number;
  };
}

const EducationScreen: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sample data - in production this would come from the education service
  const sampleCourses: Course[] = [
    {
      id: 'family-law-fundamentals',
      title: 'Family Law Fundamentals',
      description: 'Master the essential concepts of family law including divorce, custody, support, and property division.',
      shortDescription: 'Essential family law concepts for self-represented litigants.',
      duration: '4-5 hours',
      difficulty: 'beginner',
      category: 'family-law',
      stateSpecific: false,
      states: [],
      thumbnail: '/education/thumbnails/family-law-fundamentals.jpg',
      isActive: true
    },
    {
      id: 'california-family-law',
      title: 'California Family Law',
      description: 'Comprehensive guide to family law in California, covering divorce, custody, and support.',
      shortDescription: 'Complete family law guide for California residents.',
      duration: '6-8 hours',
      difficulty: 'intermediate',
      category: 'family-law',
      stateSpecific: true,
      states: ['CA'],
      thumbnail: '/education/thumbnails/california-family-law.jpg',
      isActive: true
    },
    {
      id: 'document-preparation',
      title: 'Legal Document Preparation',
      description: 'Learn how to prepare, complete, and file legal documents correctly.',
      shortDescription: 'Master legal document preparation and filing.',
      duration: '5-6 hours',
      difficulty: 'intermediate',
      category: 'document-preparation',
      stateSpecific: false,
      states: [],
      thumbnail: '/education/thumbnails/document-preparation.jpg',
      isActive: true
    }
  ];

  const sampleProgress: UserProgress = {
    userId: 'user123',
    courses: {
      'family-law-fundamentals': {
        status: 'in_progress',
        progress: 65,
        timeSpent: 180, // 3 hours
        lastAccessed: '2025-01-15T10:30:00Z'
      },
      'california-family-law': {
        status: 'not_started',
        progress: 0,
        timeSpent: 0,
        lastAccessed: ''
      },
      'document-preparation': {
        status: 'completed',
        progress: 100,
        timeSpent: 320, // 5 hours 20 minutes
        lastAccessed: '2025-01-14T16:45:00Z'
      }
    },
    analytics: {
      totalTimeSpent: 500, // 8 hours 20 minutes
      averageQuizScore: 85,
      learningStreak: 7,
      completionRate: 33
    }
  };

  const categories = [
    { id: 'all', name: 'All Courses', icon: 'library-outline' },
    { id: 'family-law', name: 'Family Law', icon: 'people-outline' },
    { id: 'divorce', name: 'Divorce', icon: 'document-text-outline' },
    { id: 'custody', name: 'Custody', icon: 'heart-outline' },
    { id: 'document-preparation', name: 'Documents', icon: 'folder-outline' }
  ];

  useEffect(() => {
    loadCourses();
    loadUserProgress();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      // In production: await educationService.getCourses()
      setCourses(sampleCourses);
    } catch (error) {
      Alert.alert('Error', 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      // In production: await educationService.getUserProgress(userId)
      setUserProgress(sampleProgress);
    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadCourses(), loadUserProgress()]);
    setRefreshing(false);
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && course.isActive;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return '#4CAF50';
    if (progress >= 50) return '#FF9800';
    return '#2196F3';
  };

  const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
    const progress = userProgress?.courses[course.id];
    
    return (
      <TouchableOpacity style={styles.courseCard} onPress={() => {/* Navigate to course */}}>
        <View style={styles.courseHeader}>
          <View style={styles.thumbnailContainer}>
            <Image 
              source={{ uri: course.thumbnail }} 
              style={styles.thumbnail}
              defaultSource={require('../../assets/images/course-placeholder.png')}
            />
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(course.difficulty) }]}>
              <Text style={styles.difficultyText}>{course.difficulty}</Text>
            </View>
          </View>
          
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDescription} numberOfLines={2}>
              {course.shortDescription}
            </Text>
            
            <View style={styles.courseMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.metaText}>{course.duration}</Text>
              </View>
              
              {course.stateSpecific && (
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>{course.states.join(', ')}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        {progress && progress.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercentage}>{progress.progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progress.progress}%`,
                    backgroundColor: getProgressColor(progress.progress)
                  }
                ]} 
              />
            </View>
            <View style={styles.progressMeta}>
              <Text style={styles.progressStatus}>
                {progress.status === 'completed' ? 'Completed' : 
                 progress.status === 'in_progress' ? 'In Progress' : 'Not Started'}
              </Text>
              {progress.timeSpent > 0 && (
                <Text style={styles.timeSpent}>
                  {Math.round(progress.timeSpent / 60)}h {progress.timeSpent % 60}m
                </Text>
              )}
            </View>
          </View>
        )}
        
        <View style={styles.courseActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
            <Text style={styles.actionButtonText}>
              {progress?.status === 'completed' ? 'Review' : 
               progress?.status === 'in_progress' ? 'Continue' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const StatsCard: React.FC = () => {
    if (!userProgress) return null;
    
    const { analytics } = userProgress;
    
    return (
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Learning Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(analytics.totalTimeSpent / 60)}h</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{analytics.learningStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{analytics.averageQuizScore}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{analytics.completionRate}%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Legal Education</Text>
          <Text style={styles.headerSubtitle}>Learn at your own pace</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={20} 
                color={selectedCategory === category.id ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats Card */}
        <StatsCard />

        {/* Courses */}
        <View style={styles.coursesSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Courses' : categories.find(c => c.id === selectedCategory)?.name}
          </Text>
          
          {filteredCourses.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="library-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No courses found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or category filter
              </Text>
            </View>
          ) : (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  coursesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 16,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  difficultyBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  courseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStatus: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  timeSpent: {
    fontSize: 12,
    color: '#666',
  },
  courseActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  primaryAction: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default EducationScreen;
