/**
 * Kingdom Studios Teaching Screen
 * Educational content and discipleship pathways
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';
import { DiscipleshipPathway } from '../types/mentorship';

const { width } = Dimensions.get('window');

interface TeachingCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  lessonsCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  faithBased: boolean;
}

const TeachingScreen = () => {
  const navigation = useNavigation();
  const { faithMode } = useFaithMode();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock teaching categories
  const categories: TeachingCategory[] = [
    {
      id: 'prayer',
      title: 'Prayer Life',
      icon: '🙏',
      description: faithMode ? 'Deepen your relationship with God through prayer' : 'Mindfulness and reflection practices',
      lessonsCount: 12,
      difficulty: 'beginner',
      faithBased: true,
    },
    {
      id: 'content',
      title: 'Content Creation',
      icon: '🎥',
      description: 'Master the art of creating engaging content',
      lessonsCount: 18,
      difficulty: 'intermediate',
      faithBased: false,
    },
    {
      id: 'business',
      title: 'Business Strategy',
      icon: '📈',
      description: 'Build and scale your creative business',
      lessonsCount: 15,
      difficulty: 'advanced',
      faithBased: false,
    },
    {
      id: 'scripture',
      title: 'Bible Study',
      icon: '📖',
      description: faithMode ? 'Study God\'s Word with guided lessons' : 'Study ancient wisdom texts',
      lessonsCount: 25,
      difficulty: 'beginner',
      faithBased: true,
    },
    {
      id: 'deliverance',
      title: 'Inner Healing',
      icon: '✨',
      description: faithMode ? 'Freedom from strongholds and inner healing' : 'Personal growth and healing',
      lessonsCount: 10,
      difficulty: 'intermediate',
      faithBased: true,
    },
    {
      id: 'branding',
      title: 'Brand Building',
      icon: '🎨',
      description: 'Create a compelling personal or business brand',
      lessonsCount: 14,
      difficulty: 'intermediate',
      faithBased: false,
    },
  ];

  // Mock discipleship pathways
  const pathways: DiscipleshipPathway[] = [
    {
      id: '1',
      title: faithMode ? 'New Believer\'s Journey' : 'Beginner\'s Path',
      description: faithMode ? 'Essential foundations for new believers' : 'Start your personal growth journey',
      icon: '🌱',
      category: 'spiritual',
      lessons: [],
      estimatedDuration: '4 weeks',
      difficulty: 'beginner',
      faithBased: faithMode,
      tags: faithMode ? ['salvation', 'prayer', 'bible'] : ['fundamentals', 'habits', 'growth'],
    },
    {
      id: '2',
      title: 'Content Creator Bootcamp',
      description: 'Complete guide to becoming a successful content creator',
      icon: '🚀',
      category: 'business',
      lessons: [],
      estimatedDuration: '8 weeks',
      difficulty: 'intermediate',
      faithBased: false,
      tags: ['content', 'strategy', 'monetization'],
    },
    {
      id: '3',
      title: faithMode ? 'Walking in Your Calling' : 'Purpose Discovery',
      description: faithMode ? 'Discover and walk in God\'s calling for your life' : 'Find your life purpose and calling',
      icon: '⭐',
      category: 'purpose',
      lessons: [],
      estimatedDuration: '6 weeks',
      difficulty: 'intermediate',
      faithBased: faithMode,
      tags: faithMode ? ['calling', 'purpose', 'ministry'] : ['purpose', 'vision', 'goals'],
    },
  ];

  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : categories.filter(cat => faithMode ? cat.faithBased : !cat.faithBased);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return KingdomColors.accent.success;
      case 'intermediate': return KingdomColors.gold.warm;
      case 'advanced': return KingdomColors.accent.error;
      default: return KingdomColors.gray;
    }
  };

  const renderCategoryCard = ({ item }: { item: TeachingCategory }) => (
    <TouchableOpacity style={styles.categoryCard} activeOpacity={0.8}>
      <LinearGradient
        colors={KingdomColors.gradients.cardBackground as any}
        style={styles.categoryGradient}
      >
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryIcon}>{item.icon}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
        </View>
        
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
        
        <View style={styles.categoryFooter}>
          <Text style={styles.lessonsCount}>{item.lessonsCount} lessons</Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start →</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderPathwayCard = ({ item }: { item: DiscipleshipPathway }) => (
    <TouchableOpacity style={styles.pathwayCard} activeOpacity={0.8}>
      <LinearGradient
        colors={KingdomColors.gradients.primary as any}
        style={styles.pathwayGradient}
      >
        <View style={styles.pathwayHeader}>
          <Text style={styles.pathwayIcon}>{item.icon}</Text>
          <Text style={styles.pathwayDuration}>{item.estimatedDuration}</Text>
        </View>
        
        <Text style={styles.pathwayTitle}>{item.title}</Text>
        <Text style={styles.pathwayDescription}>{item.description}</Text>
        
        <View style={styles.pathwayTags}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity style={styles.pathwayButton}>
          <Text style={styles.pathwayButtonText}>
            {faithMode ? '✝️ Begin Journey' : '🚀 Start Path'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={KingdomColors.gradients.royalGold as any}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <KingdomLogo size="small" />
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Title Section */}
          <BlurView intensity={20} style={styles.titleCard}>
            <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.titleContent}>
              <Text style={styles.title}>
                {faithMode ? '📚 Kingdom Teaching' : '🎓 Learning Center'}
              </Text>
              <Text style={styles.subtitle}>
                {faithMode 
                  ? 'Grow in wisdom and understanding through God\'s Word and practical teaching'
                  : 'Expand your knowledge and skills with expert-led courses and content'
                }
              </Text>
            </LinearGradient>
          </BlurView>

          {/* Mentorship CTA */}
          <BlurView intensity={20} style={styles.mentorshipCTA}>
            <LinearGradient colors={KingdomColors.gradients.accent as any} style={styles.mentorshipContent}>
              <View style={styles.mentorshipInfo}>
                <Text style={styles.mentorshipIcon}>
                  {faithMode ? '🙏' : '🤝'}
                </Text>
                <View style={styles.mentorshipText}>
                  <Text style={styles.mentorshipTitle}>
                    {faithMode ? 'Need Personal Guidance?' : 'Want 1-on-1 Help?'}
                  </Text>
                  <Text style={styles.mentorshipDesc}>
                    {faithMode 
                      ? 'Connect with a spirit-filled mentor for personalized discipleship'
                      : 'Get personalized guidance from experienced mentors'
                    }
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.mentorshipButton}
                onPress={() => navigation.navigate('MentorshipHub')}
              >
                <Text style={styles.mentorshipButtonText}>
                  {faithMode ? 'Find a Guide' : 'Find Mentor'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>

          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterTab, selectedCategory === 'all' && styles.filterTabActive]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.filterText, selectedCategory === 'all' && styles.filterTextActive]}>
                All Topics
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, selectedCategory === 'faith' && styles.filterTabActive]}
              onPress={() => setSelectedCategory('faith')}
            >
              <Text style={[styles.filterText, selectedCategory === 'faith' && styles.filterTextActive]}>
                {faithMode ? 'Spiritual' : 'Personal'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, selectedCategory === 'business' && styles.filterTabActive]}
              onPress={() => setSelectedCategory('business')}
            >
              <Text style={[styles.filterText, selectedCategory === 'business' && styles.filterTextActive]}>
                Business
              </Text>
            </TouchableOpacity>
          </View>

          {/* Learning Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {faithMode ? 'Teaching Categories' : 'Course Categories'}
            </Text>
            <FlatList
              data={filteredCategories}
              renderItem={renderCategoryCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.categoryRow}
              scrollEnabled={false}
            />
          </View>

          {/* Discipleship Pathways */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {faithMode ? 'Discipleship Pathways' : 'Learning Paths'}
            </Text>
            <Text style={styles.sectionDescription}>
              {faithMode 
                ? 'Structured journeys to help you grow in specific areas of faith and life'
                : 'Comprehensive learning journeys designed to take you from beginner to expert'
              }
            </Text>
            <FlatList
              data={pathways}
              renderItem={renderPathwayCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pathwaysContainer}
            />
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.black,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    fontSize: 24,
    color: KingdomColors.white,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    ...KingdomShadows.large,
  },
  titleContent: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: KingdomColors.lightGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  mentorshipCTA: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  mentorshipContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mentorshipInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mentorshipIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  mentorshipText: {
    flex: 1,
  },
  mentorshipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 4,
  },
  mentorshipDesc: {
    fontSize: 14,
    color: KingdomColors.lightGray,
  },
  mentorshipButton: {
    backgroundColor: KingdomColors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 12,
  },
  mentorshipButtonText: {
    color: KingdomColors.black,
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.darkGray,
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  filterTabActive: {
    backgroundColor: KingdomColors.gold.bright,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.lightGray,
  },
  filterTextActive: {
    color: KingdomColors.black,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: KingdomColors.lightGray,
    marginBottom: 20,
    lineHeight: 22,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  categoryGradient: {
    padding: 16,
    height: 180,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 32,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: KingdomColors.white,
    textTransform: 'uppercase',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 12,
    color: KingdomColors.lightGray,
    lineHeight: 16,
    flex: 1,
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  lessonsCount: {
    fontSize: 12,
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: KingdomColors.gold.bright,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: KingdomColors.black,
  },
  pathwaysContainer: {
    paddingRight: 20,
  },
  pathwayCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.large,
  },
  pathwayGradient: {
    padding: 20,
  },
  pathwayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pathwayIcon: {
    fontSize: 32,
  },
  pathwayDuration: {
    fontSize: 14,
    color: KingdomColors.lightGray,
    fontWeight: '600',
  },
  pathwayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 8,
  },
  pathwayDescription: {
    fontSize: 14,
    color: KingdomColors.lightGray,
    lineHeight: 20,
    marginBottom: 16,
  },
  pathwayTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: KingdomColors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: KingdomColors.primary.royalPurple,
    fontWeight: '600',
  },
  pathwayButton: {
    backgroundColor: KingdomColors.white,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  pathwayButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.primary.royalPurple,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default TeachingScreen;
