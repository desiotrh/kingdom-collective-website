// Legal Education Hub - Course Detail Screen
// Detailed view of individual courses with modules and progress

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedTime: number;
  isCompleted: boolean;
  timeSpent: number;
  progress: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail: string;
  modules: CourseModule[];
  prerequisites: string[];
  learningObjectives: string[];
  certificate: {
    available: boolean;
    requirements: string[];
    validFor: string;
  };
}

interface CourseDetailScreenProps {
  route: {
    params: {
      courseId: string;
    };
  };
  navigation: any;
}

const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Sample course data - in production this would come from the education service
  const sampleCourse: Course = {
    id: 'family-law-fundamentals',
    title: 'Family Law Fundamentals',
    description: 'Master the essential concepts of family law including divorce, custody, support, and property division. Perfect for beginners starting their legal journey.',
    duration: '4-5 hours',
    difficulty: 'beginner',
    category: 'family-law',
    thumbnail: '/education/thumbnails/family-law-fundamentals.jpg',
    modules: [
      {
        id: 'module-1',
        title: 'Introduction to Family Law',
        description: 'Understanding the basics of family law and court systems.',
        order: 1,
        estimatedTime: 45,
        isCompleted: false,
        timeSpent: 0,
        progress: 0
      },
      {
        id: 'module-2',
        title: 'Understanding Divorce',
        description: 'Learn about different types of divorce and the divorce process.',
        order: 2,
        estimatedTime: 60,
        isCompleted: true,
        timeSpent: 55,
        progress: 100
      },
      {
        id: 'module-3',
        title: 'Child Custody and Support',
        description: 'Understanding custody laws and child support calculations.',
        order: 3,
        estimatedTime: 75,
        isCompleted: false,
        timeSpent: 25,
        progress: 33
      }
    ],
    prerequisites: [],
    learningObjectives: [
      'Understand basic family law concepts and terminology',
      'Identify different types of divorce and their implications',
      'Learn the typical divorce process timeline',
      'Recognize key legal terms used in family court'
    ],
    certificate: {
      available: true,
      requirements: ['Complete all modules', 'Pass quiz with 70% or higher'],
      validFor: '1 year'
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      // In production: await educationService.getCourse(courseId)
      setCourse(sampleCourse);
    } catch (error) {
      Alert.alert('Error', 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getModuleStatus = (module: CourseModule) => {
    if (module.isCompleted) return 'completed';
    if (module.progress > 0) return 'in_progress';
    return 'not_started';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#FF9800';
      default: return '#E0E0E0';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'in_progress': return 'play-circle';
      default: return 'ellipse-outline';
    }
  };

  const ModuleCard: React.FC<{ module: CourseModule }> = ({ module }) => {
    const status = getModuleStatus(module);
    
    return (
      <TouchableOpacity 
        style={styles.moduleCard}
        onPress={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
      >
        <View style={styles.moduleHeader}>
          <View style={styles.moduleIcon}>
            <Ionicons 
              name={getStatusIcon(status)} 
              size={24} 
              color={getStatusColor(status)} 
            />
          </View>
          
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.moduleDescription} numberOfLines={2}>
              {module.description}
            </Text>
            
            <View style={styles.moduleMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.metaText}>{module.estimatedTime}m</Text>
              </View>
              
              {module.timeSpent > 0 && (
                <View style={styles.metaItem}>
                  <Ionicons name="play-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>{module.timeSpent}m spent</Text>
                </View>
              )}
            </View>
          </View>
          
          <Ionicons 
            name={selectedModule === module.id ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#666" 
          />
        </View>
        
        {selectedModule === module.id && (
          <View style={styles.moduleDetails}>
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressPercentage}>{module.progress}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${module.progress}%`,
                      backgroundColor: getStatusColor(status)
                    }
                  ]} 
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>
                {status === 'completed' ? 'Review' : 
                 status === 'in_progress' ? 'Continue' : 'Start Module'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading course...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Course not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const completedModules = course.modules.filter(m => m.isCompleted).length;
  const totalModules = course.modules.length;
  const overallProgress = Math.round((completedModules / totalModules) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons name="bookmark-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Course Hero */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: course.thumbnail }} 
            style={styles.heroImage}
            defaultSource={require('../../assets/images/course-placeholder.png')}
          />
          
          <View style={styles.heroContent}>
            <View style={styles.difficultyContainer}>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(course.difficulty) }]}>
                <Text style={styles.difficultyText}>{course.difficulty}</Text>
              </View>
            </View>
            
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDescription}>{course.description}</Text>
            
            <View style={styles.courseMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.metaText}>{course.duration}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Ionicons name="library-outline" size={20} color="#666" />
                <Text style={styles.metaText}>{totalModules} modules</Text>
              </View>
              
              {course.certificate.available && (
                <View style={styles.metaItem}>
                  <Ionicons name="ribbon-outline" size={20} color="#666" />
                  <Text style={styles.metaText}>Certificate</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Overall Progress</Text>
              <Text style={styles.progressPercentage}>{overallProgress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${overallProgress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {completedModules} of {totalModules} modules completed
            </Text>
          </View>
        </View>

        {/* Learning Objectives */}
        <View style={styles.objectivesSection}>
          <Text style={styles.sectionTitle}>What You'll Learn</Text>
          <View style={styles.objectivesList}>
            {course.learningObjectives.map((objective, index) => (
              <View key={index} style={styles.objectiveItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.objectiveText}>{objective}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Course Modules */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>Course Modules</Text>
          {course.modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </View>

        {/* Certificate Information */}
        {course.certificate.available && (
          <View style={styles.certificateSection}>
            <Text style={styles.sectionTitle}>Certificate</Text>
            <View style={styles.certificateCard}>
              <View style={styles.certificateHeader}>
                <Ionicons name="ribbon" size={32} color="#FFD700" />
                <Text style={styles.certificateTitle}>Completion Certificate</Text>
              </View>
              <Text style={styles.certificateDescription}>
                Earn a certificate upon successful completion of this course
              </Text>
              <View style={styles.requirementsList}>
                <Text style={styles.requirementsTitle}>Requirements:</Text>
                {course.certificate.requirements.map((requirement, index) => (
                  <Text key={index} style={styles.requirementItem}>• {requirement}</Text>
                ))}
              </View>
              <Text style={styles.validityText}>
                Certificate valid for {course.certificate.validFor}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              {overallProgress === 100 ? 'Review Course' : 
               overallProgress > 0 ? 'Continue Learning' : 'Start Course'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="share-outline" size={20} color="#2196F3" />
            <Text style={styles.secondaryButtonText}>Share Course</Text>
          </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  bookmarkButton: {
    padding: 8,
  },
  heroSection: {
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  heroImage: {
    width: width,
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  heroContent: {
    padding: 20,
  },
  difficultyContainer: {
    marginBottom: 12,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 32,
  },
  courseDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  courseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  progressSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  objectivesSection: {
    padding: 20,
  },
  objectivesList: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  objectiveText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    lineHeight: 20,
  },
  modulesSection: {
    padding: 20,
  },
  moduleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  moduleIcon: {
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  moduleMeta: {
    flexDirection: 'row',
  },
  moduleDetails: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  progressContainer: {
    marginBottom: 16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  certificateSection: {
    padding: 20,
  },
  certificateCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginLeft: 12,
  },
  certificateDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  requirementsList: {
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  validityText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  actionSection: {
    padding: 20,
    paddingBottom: 40,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginLeft: 8,
  },
});

export default CourseDetailScreen;
