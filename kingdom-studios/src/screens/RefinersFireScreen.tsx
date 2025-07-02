import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KingdomColors } from '../constants/KingdomColors';
import { useAuth } from '../contexts/AuthContext';
import { AppMode } from '../types/spiritual';

const { width, height } = Dimensions.get('window');

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  tasks: ChallengeTask[];
  category: 'spiritual' | 'business' | 'personal';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  participants: number;
  completionRate: number;
  bibleVerse?: string;
  verseReference?: string;
  faithDescription?: string;
  encouragementDescription?: string;
}

interface ChallengeTask {
  id: string;
  title: string;
  description: string;
  type: 'prayer' | 'reading' | 'action' | 'reflection' | 'business' | 'content';
  duration: number; // minutes
  isCompleted: boolean;
  completedAt?: Date;
  progress: number;
  faithVersion?: string;
  encouragementVersion?: string;
}

interface UserProgress {
  challengeId: string;
  currentDay: number;
  completedTasks: string[];
  streak: number;
  totalPoints: number;
  startDate: Date;
  completionPercentage: number;
}

const RefinersFireScreen: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AppMode>('faith');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'spiritual' | 'business' | 'personal'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
    loadUserProgress();
  }, []);

  const loadChallenges = async () => {
    // Mock data - replace with Firebase call
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: mode === 'faith' ? '40 Days of Faith in Business' : '40 Days of Breakthrough',
        description: mode === 'faith' 
          ? 'Transform your business through spiritual principles and biblical wisdom'
          : 'Break through limitations with daily challenges and mindset shifts',
        duration: 40,
        category: 'business',
        difficulty: 'intermediate',
        participants: 1247,
        completionRate: 78,
        bibleVerse: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future."',
        verseReference: 'Jeremiah 29:11',
        faithDescription: 'Align your business practices with biblical principles while building a sustainable, God-honoring enterprise.',
        encouragementDescription: 'Push past your comfort zone and build the business of your dreams with proven strategies and mindset work.',
        tasks: [
          {
            id: 't1',
            title: mode === 'faith' ? 'Morning Prayer for Business' : 'Morning Intention Setting',
            description: mode === 'faith' 
              ? 'Spend 15 minutes in prayer asking God to guide your business decisions'
              : 'Set clear intentions for your business growth and visualize success',
            type: mode === 'faith' ? 'prayer' : 'reflection',
            duration: 15,
            isCompleted: false,
            progress: 0,
            faithVersion: 'Spend 15 minutes in prayer asking God to guide your business decisions',
            encouragementVersion: 'Set clear intentions for your business growth and visualize success'
          }
        ]
      },
      {
        id: '2',
        title: mode === 'faith' ? '21 Days of Scripture-Based Content' : '21 Days of Viral Content',
        description: mode === 'faith'
          ? 'Create compelling content that shares your faith while growing your audience'
          : 'Master the art of creating content that resonates and goes viral',
        duration: 21,
        category: 'business',
        difficulty: 'beginner',
        participants: 892,
        completionRate: 85,
        bibleVerse: '"Let your light shine before others, that they may see your good deeds and glorify your Father in heaven."',
        verseReference: 'Matthew 5:16',
        faithDescription: 'Learn to create content that glorifies God while building your brand and impacting lives.',
        encouragementDescription: 'Discover the secrets to creating content that captures attention and drives engagement.',
        tasks: []
      },
      {
        id: '3',
        title: mode === 'faith' ? '30 Days of Faithful Leadership' : '30 Days of Influence',
        description: mode === 'faith'
          ? 'Develop godly leadership skills for your business and ministry'
          : 'Build your influence and leadership presence in your industry',
        duration: 30,
        category: 'personal',
        difficulty: 'advanced',
        participants: 654,
        completionRate: 72,
        bibleVerse: '"Whoever wants to become great among you must be your servant"',
        verseReference: 'Matthew 20:26',
        faithDescription: 'Learn to lead with humility, integrity, and biblical wisdom in all areas of your life.',
        encouragementDescription: 'Develop the mindset and skills needed to become an influential leader in your field.',
        tasks: []
      }
    ];

    setChallenges(mockChallenges);
    setLoading(false);
  };

  const loadUserProgress = async () => {
    // Mock user progress data
    const mockProgress: UserProgress[] = [
      {
        challengeId: '1',
        currentDay: 12,
        completedTasks: ['t1'],
        streak: 8,
        totalPoints: 240,
        startDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        completionPercentage: 30
      }
    ];

    setUserProgress(mockProgress);
  };

  const joinChallenge = async (challenge: Challenge) => {
    Alert.alert(
      'Join Challenge',
      `Are you ready to commit to "${challenge.title}" for ${challenge.duration} days?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join',
          onPress: () => {
            const newProgress: UserProgress = {
              challengeId: challenge.id,
              currentDay: 1,
              completedTasks: [],
              streak: 0,
              totalPoints: 0,
              startDate: new Date(),
              completionPercentage: 0
            };
            setUserProgress([...userProgress, newProgress]);
            setActiveChallenge(challenge);
          }
        }
      ]
    );
  };

  const completeTask = async (taskId: string) => {
    if (!activeChallenge) return;

    const updatedProgress = userProgress.map(progress => {
      if (progress.challengeId === activeChallenge.id) {
        return {
          ...progress,
          completedTasks: [...progress.completedTasks, taskId],
          totalPoints: progress.totalPoints + 10,
          streak: progress.streak + 1,
          completionPercentage: Math.min(100, progress.completionPercentage + (100 / activeChallenge.tasks.length))
        };
      }
      return progress;
    });

    setUserProgress(updatedProgress);
  };

  const getFilteredChallenges = () => {
    if (selectedCategory === 'all') return challenges;
    return challenges.filter(challenge => challenge.category === selectedCategory);
  };

  const getUserChallengeProgress = (challengeId: string) => {
    return userProgress.find(progress => progress.challengeId === challengeId);
  };

  const renderModeToggle = () => (
    <View style={styles.modeToggle}>
      <TouchableOpacity
        style={[styles.modeButton, mode === 'faith' && styles.activeModeButton]}
        onPress={() => setMode('faith')}
      >
        <Ionicons 
          name="heart" 
          size={16} 
          color={mode === 'faith' ? KingdomColors.text.primary : KingdomColors.gold.bright} 
        />
        <Text style={[styles.modeButtonText, mode === 'faith' && styles.activeModeText]}>
          Faith Mode
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.modeButton, mode === 'encouragement' && styles.activeModeButton]}
        onPress={() => setMode('encouragement')}
      >
        <Ionicons 
          name="flash" 
          size={16} 
          color={mode === 'encouragement' ? KingdomColors.text.primary : KingdomColors.gold.bright} 
        />
        <Text style={[styles.modeButtonText, mode === 'encouragement' && styles.activeModeText]}>
          Encouragement Mode
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryFilter = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
      {['all', 'spiritual', 'business', 'personal'].map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.activeCategoryButton
          ]}
          onPress={() => setSelectedCategory(category as any)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category && styles.activeCategoryText
          ]}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderChallengeCard = (challenge: Challenge) => {
    const progress = getUserChallengeProgress(challenge.id);
    const isActive = progress !== undefined;

    return (
      <TouchableOpacity
        key={challenge.id}
        style={styles.challengeCard}
        onPress={() => isActive ? setActiveChallenge(challenge) : joinChallenge(challenge)}
      >
        <LinearGradient
          colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
          style={styles.challengeGradient}
        >
          <View style={styles.challengeHeader}>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDescription}>
                {mode === 'faith' ? challenge.faithDescription : challenge.encouragementDescription}
              </Text>
              <Text style={styles.challengeMeta}>
                {challenge.duration} days • {challenge.participants} participants • {challenge.completionRate}% completion
              </Text>
            </View>
            <View style={styles.challengeStats}>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
              </View>
              {isActive && progress && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>{Math.round(progress.completionPercentage)}%</Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${progress.completionPercentage}%` }
                      ]} 
                    />
                  </View>
                </View>
              )}
            </View>
          </View>

          {mode === 'faith' && challenge.bibleVerse && (
            <View style={styles.bibleVerseContainer}>
              <Text style={styles.bibleVerse}>"{challenge.bibleVerse}"</Text>
              <Text style={styles.verseReference}>- {challenge.verseReference}</Text>
            </View>
          )}

          <View style={styles.challengeFooter}>
            <TouchableOpacity
              style={[styles.actionButton, isActive && styles.continueButton]}
              onPress={() => isActive ? setActiveChallenge(challenge) : joinChallenge(challenge)}
            >
              <Ionicons 
                name={isActive ? "play" : "add"} 
                size={16} 
                color={KingdomColors.white} 
              />
              <Text style={styles.actionButtonText}>
                {isActive ? 'Continue' : 'Join Challenge'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderActiveChallenge = () => {
    if (!activeChallenge) return null;

    const progress = getUserChallengeProgress(activeChallenge.id);
    if (!progress) return null;

    return (
      <Modal
        visible={!!activeChallenge}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveChallenge(null)}>
              <Ionicons name="close" size={24} color={KingdomColors.text.muted} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{activeChallenge.title}</Text>
            <View />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.currentDay}</Text>
                <Text style={styles.statLabel}>Current Day</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.totalPoints}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
            </View>

            {mode === 'faith' && activeChallenge.bibleVerse && (
              <View style={styles.dailyVerse}>
                <Text style={styles.dailyVerseTitle}>Today's Verse</Text>
                <Text style={styles.bibleVerse}>"{activeChallenge.bibleVerse}"</Text>
                <Text style={styles.verseReference}>- {activeChallenge.verseReference}</Text>
              </View>
            )}

            <View style={styles.tasksSection}>
              <Text style={styles.sectionTitle}>Today's Tasks</Text>
              {activeChallenge.tasks.map(task => (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.taskCard,
                    progress.completedTasks.includes(task.id) && styles.completedTask
                  ]}
                  onPress={() => !progress.completedTasks.includes(task.id) && completeTask(task.id)}
                >
                  <View style={styles.taskContent}>
                    <Ionicons
                      name={progress.completedTasks.includes(task.id) ? "checkmark-circle" : "radio-button-off"}
                      size={24}
                      color={progress.completedTasks.includes(task.id) ? KingdomColors.accent.success : KingdomColors.text.muted}
                    />
                    <View style={styles.taskInfo}>
                      <Text style={[
                        styles.taskTitle,
                        progress.completedTasks.includes(task.id) && styles.completedTaskText
                      ]}>
                        {task.title}
                      </Text>
                      <Text style={styles.taskDescription}>
                        {mode === 'faith' ? task.faithVersion : task.encouragementVersion}
                      </Text>
                      <Text style={styles.taskDuration}>{task.duration} minutes</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
        style={styles.header}
      >
        <Text style={styles.title}>Refiner's Fire</Text>
        <Text style={styles.subtitle}>
          {mode === 'faith' 
            ? 'Transform through faith-based challenges' 
            : 'Breakthrough with powerful daily challenges'
          }
        </Text>
        {renderModeToggle()}
      </LinearGradient>

      <View style={styles.content}>
        {renderCategoryFilter()}
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {getFilteredChallenges().map(renderChallengeCard)}
        </ScrollView>
      </View>

      {renderActiveChallenge()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.white,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: KingdomColors.lightGray,
    marginBottom: 20,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeModeButton: {
    backgroundColor: KingdomColors.gold.bright,
  },
  modeButtonText: {
    color: KingdomColors.lightGray,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeModeText: {
    color: KingdomColors.white,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  categoryFilter: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: KingdomColors.lightGray,
  },
  activeCategoryButton: {
    backgroundColor: KingdomColors.gold.bright,
  },
  categoryButtonText: {
    color: KingdomColors.text.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: KingdomColors.text.primary,
  },
  challengeCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  challengeGradient: {
    padding: 20,
  },
  challengeHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  challengeInfo: {
    flex: 1,
    marginRight: 16,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: KingdomColors.lightGray,
    marginBottom: 8,
    lineHeight: 20,
  },
  challengeMeta: {
    fontSize: 12,
    color: KingdomColors.lightGray,
  },
  challengeStats: {
    alignItems: 'flex-end',
  },
  difficultyBadge: {
    backgroundColor: KingdomColors.gold.bright,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  difficultyText: {
    color: KingdomColors.white,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    color: KingdomColors.white,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: KingdomColors.gold.bright,
    borderRadius: 2,
  },
  bibleVerseContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  bibleVerse: {
    fontSize: 14,
    color: KingdomColors.white,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  verseReference: {
    fontSize: 12,
    color: KingdomColors.lightGray,
    textAlign: 'right',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.gold.bright,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  continueButton: {
    backgroundColor: KingdomColors.accent.success,
  },
  actionButtonText: {
    color: KingdomColors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: KingdomColors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.lightGray,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.primary.royalPurple,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    marginTop: 4,
  },
  dailyVerse: {
    backgroundColor: KingdomColors.lightGray,
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
  },
  dailyVerseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.primary.royalPurple,
    marginBottom: 12,
  },
  tasksSection: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: KingdomColors.white,
    borderWidth: 1,
    borderColor: KingdomColors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  completedTask: {
    backgroundColor: KingdomColors.lightGray,
    borderColor: KingdomColors.accent.success,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskInfo: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: KingdomColors.text.muted,
  },
  taskDescription: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginBottom: 8,
    lineHeight: 20,
  },
  taskDuration: {
    fontSize: 12,
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
});

export default RefinersFireScreen;
