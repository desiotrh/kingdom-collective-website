/**
 * Kingdom Studios Mentorship Hub - "Forge Guides"
 * Connect with volunteer mentors for spiritual growth and creative development
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
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';
import { MENTORSHIP_CATEGORIES, MentorProfile, MentorshipCategory } from '../types/mentorship';

const { width } = Dimensions.get('window');

interface FeaturedMentor {
  id: string;
  name: string;
  category: string;
  rating: number;
  specialties: string[];
  profileImage?: string;
  bio: string;
  totalMentees: number;
}

const mockFeaturedMentors: FeaturedMentor[] = [
  {
    id: '1',
    name: 'Pastor Sarah',
    category: 'Faith Journey',
    rating: 4.9,
    specialties: ['Prayer', 'Discipleship', 'Inner Healing'],
    bio: 'Helping believers grow deeper in their relationship with Jesus for over 10 years.',
    totalMentees: 47,
  },
  {
    id: '2',
    name: 'Marcus Creative',
    category: 'Content Creation',
    rating: 4.8,
    specialties: ['Video Production', 'Social Media', 'Storytelling'],
    bio: 'Content creator with 500K+ followers sharing faith-based creative strategies.',
    totalMentees: 23,
  },
  {
    id: '3',
    name: 'Dr. Rebecca',
    category: 'Healing & Deliverance',
    rating: 5.0,
    specialties: ['Trauma Healing', 'Deliverance', 'Prophetic Ministry'],
    bio: 'Licensed counselor and deliverance minister helping people find freedom.',
    totalMentees: 31,
  },
];

export default function MentorshipHubScreen() {
  const navigation = useNavigation();
  const { faithMode } = useFaithMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const CategoryCard = ({ category }: { category: MentorshipCategory }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => setSelectedCategory(category.id)}
      activeOpacity={0.8}
    >
      <BlurView intensity={15} style={styles.categoryBlur}>
        <LinearGradient
          colors={
            selectedCategory === category.id
              ? ['rgba(255, 215, 0, 0.2)', 'rgba(255, 215, 0, 0.1)'] as const
              : ['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const
          }
          style={styles.categoryGradient}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
          {faithMode && category.faithBased && (
            <View style={styles.faithBadge}>
              <Text style={styles.faithBadgeText}>🙏 Faith-Based</Text>
            </View>
          )}
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );

  const MentorCard = ({ mentor }: { mentor: FeaturedMentor }) => (
    <TouchableOpacity
      style={styles.mentorCard}
      onPress={() => navigation.navigate('MentorProfile', { mentorId: mentor.id })}
      activeOpacity={0.8}
    >
      <BlurView intensity={15} style={styles.mentorBlur}>
        <LinearGradient
          colors={['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const}
          style={styles.mentorGradient}
        >
          <View style={styles.mentorHeader}>
            <View style={styles.mentorAvatar}>
              <Text style={styles.mentorInitials}>
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.mentorInfo}>
              <Text style={styles.mentorName}>{mentor.name}</Text>
              <Text style={styles.mentorCategory}>{mentor.category}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>
                <Text style={styles.ratingText}>{mentor.rating} ({mentor.totalMentees} mentees)</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.mentorBio}>{mentor.bio}</Text>
          
          <View style={styles.specialtiesContainer}>
            {mentor.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity style={styles.connectButton}>
            <LinearGradient
              colors={['#FFD700', '#FFC107'] as const}
              style={styles.connectGradient}
            >
              <Text style={styles.connectText}>Connect</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );

  const QuickAction = ({ icon, title, onPress }: { icon: string; title: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress} activeOpacity={0.8}>
      <BlurView intensity={10} style={styles.quickActionBlur}>
        <Text style={styles.quickActionIcon}>{icon}</Text>
        <Text style={styles.quickActionTitle}>{title}</Text>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69'] as const}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <KingdomLogo size="small" />
              <Text style={styles.title}>Forge Guides</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <BlurView intensity={10} style={styles.heroSection}>
              <LinearGradient
                colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 215, 0, 0.05)'] as const}
                style={styles.heroGradient}
              >
                <Text style={styles.heroTitle}>
                  {faithMode ? '🌟 Find Your Spiritual Guide' : '🚀 Accelerate Your Growth'}
                </Text>
                <Text style={styles.heroSubtitle}>
                  {faithMode 
                    ? "Connect with spirit-filled mentors who will walk alongside you in faith and creativity. Every believer needs a Paul, a Barnabas, and a Timothy."
                    : "Get personalized guidance from experienced creators and entrepreneurs. Learn faster, avoid mistakes, and achieve your goals."
                  }
                </Text>
              </LinearGradient>
            </BlurView>

            {/* Search Bar */}
            <BlurView intensity={15} style={styles.searchContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'] as const}
                style={styles.searchGradient}
              >
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search mentors, topics, or specialties..."
                  placeholderTextColor={KingdomColors.text.muted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </LinearGradient>
            </BlurView>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                <QuickAction 
                  icon="🙋‍♀️" 
                  title="Find a Mentor" 
                  onPress={() => navigation.navigate('FindMentor')} 
                />
                <QuickAction 
                  icon="🎓" 
                  title="Browse Courses" 
                  onPress={() => navigation.navigate('DiscipleshipPathways')} 
                />
                <QuickAction 
                  icon="👨‍🏫" 
                  title="Become a Guide" 
                  onPress={() => navigation.navigate('BecomeMentor')} 
                />
                <QuickAction 
                  icon="💬" 
                  title="My Sessions" 
                  onPress={() => navigation.navigate('MentorshipSessions')} 
                />
              </View>
            </View>

            {/* Categories */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Mentorship Categories</Text>
              <View style={styles.categoriesGrid}>
                {MENTORSHIP_CATEGORIES.filter(cat => !faithMode || cat.faithBased || !cat.faithBased).map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </View>
            </View>

            {/* Featured Mentors */}
            <View style={styles.featuredSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Featured Guides</Text>
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => navigation.navigate('AllMentors')}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.mentorsContainer}>
                {mockFeaturedMentors.map(mentor => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </View>
            </View>

            {/* Stats */}
            <BlurView intensity={15} style={styles.statsContainer}>
              <LinearGradient
                colors={['rgba(26, 26, 58, 0.8)', 'rgba(45, 27, 105, 0.6)'] as const}
                style={styles.statsGradient}
              >
                <Text style={styles.statsTitle}>Community Impact</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>247</Text>
                    <Text style={styles.statLabel}>Active Guides</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>1,523</Text>
                    <Text style={styles.statLabel}>Mentorship Sessions</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>98%</Text>
                    <Text style={styles.statLabel}>Success Rate</Text>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>

            {/* Call to Action */}
            <BlurView intensity={20} style={styles.ctaContainer}>
              <LinearGradient
                colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 215, 0, 0.1)'] as const}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaTitle}>
                  {faithMode ? '🔥 Ready to Grow in Faith?' : '🚀 Ready to Level Up?'}
                </Text>
                <Text style={styles.ctaSubtitle}>
                  {faithMode 
                    ? "Join thousands of believers who have found their calling through mentorship."
                    : "Join creators who've accelerated their growth with expert guidance."
                  }
                </Text>
                <TouchableOpacity 
                  style={styles.ctaButton}
                  onPress={() => navigation.navigate('FindMentor')}
                >
                  <LinearGradient
                    colors={['#FFD700', '#FFC107', '#FF8F00'] as const}
                    style={styles.ctaButtonGradient}
                  >
                    <Text style={styles.ctaButtonText}>Find Your Guide</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </BlurView>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: KingdomColors.gold.bright,
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    ...KingdomShadows.gold,
  },
  heroGradient: {
    padding: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  searchContainer: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: KingdomColors.text.primary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  viewAllText: {
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
  quickActionsSection: {
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.silver,
  },
  quickActionBlur: {
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    textAlign: 'center',
  },
  categoriesSection: {
    marginBottom: 32,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  categoryBlur: {
    flex: 1,
  },
  categoryGradient: {
    padding: 16,
    minHeight: 120,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    lineHeight: 16,
    flex: 1,
  },
  faithBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  faithBadgeText: {
    fontSize: 10,
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
  featuredSection: {
    marginBottom: 32,
  },
  mentorsContainer: {
    gap: 16,
  },
  mentorCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  mentorBlur: {
    flex: 1,
  },
  mentorGradient: {
    padding: 20,
  },
  mentorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mentorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: KingdomColors.gold.bright,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mentorInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  mentorCategory: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingStars: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  mentorBio: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  specialtyTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specialtyText: {
    fontSize: 12,
    color: KingdomColors.gold.bright,
    fontWeight: '500',
  },
  connectButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  connectGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  connectText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
  statsContainer: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  statsGradient: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    textAlign: 'center',
  },
  ctaContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    ...KingdomShadows.gold,
  },
  ctaGradient: {
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    minWidth: 200,
  },
  ctaButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
});
