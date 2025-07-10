/**
 * Kingdom Studios Mentor Profile Screen
 * Detailed view of mentor information for mentee matching
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
  Image,
  Alert,
  ImageStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';
import { MentorProfile, Testimonial } from '../types/mentorship';

const { width, height } = Dimensions.get('window');

interface RouteParams {
  mentorId: string;
}

const MentorProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mentorId } = route.params as RouteParams;
  const { faithMode } = useFaithMode();
  const [loading, setLoading] = useState(false);

  // Mock mentor data - replace with API call
  const mentor: MentorProfile = {
    id: mentorId,
    userId: 'user123',
    displayName: 'Pastor Sarah Mitchell',
    profileImage: 'https://via.placeholder.com/120',
    isActive: true,
    categories: [
      { id: 'faith', name: 'Faith Journey', icon: '✝️', description: 'Spiritual growth and discipleship', faithBased: true },
      { id: 'prayer', name: 'Prayer Life', icon: '🙏', description: 'Developing deeper prayer habits', faithBased: true }
    ],
    bio: 'I\'ve been walking with Jesus for over 15 years and have had the privilege of mentoring young believers in their faith journey. My heart is to see people grow deeper in their relationship with Christ and discover their unique calling.',
    experience: '10+ years in ministry, certified biblical counselor, youth pastor for 5 years',
    giftings: ['Teaching', 'Encouragement', 'Prophecy', 'Pastoral Care'],
    availability: {
      days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      timeZone: 'EST',
      preferredTimes: ['6:00 PM - 9:00 PM', '9:00 AM - 12:00 PM']
    },
    rating: 4.9,
    totalMentees: 47,
    totalSessions: 156,
    specialties: ['Inner Healing', 'Prophetic Development', 'Leadership Training', 'Scripture Study'],
    testimonials: [
      {
        id: '1',
        fromUserId: 'user456',
        fromUserName: 'Jessica',
        rating: 5,
        message: 'Sarah helped me break through years of shame and step into my identity as a daughter of God. Her gentle spirit and prophetic insight were exactly what I needed.',
        category: 'Faith Journey',
        createdAt: '2024-01-15',
        isPublic: true
      },
      {
        id: '2',
        fromUserId: 'user789',
        fromUserName: 'Marcus',
        rating: 5,
        message: 'The prayer strategies Sarah taught me completely transformed my relationship with God. I finally understand what it means to have intimate conversation with the Father.',
        category: 'Prayer Life',
        createdAt: '2024-01-10',
        isPublic: true
      }
    ],
    joinedDate: '2023-06-01',
    lastActive: '2024-01-20',
    faithMode: true,
    contactPreference: 'chat'
  };

  const handleRequestMentorship = () => {
    Alert.alert(
      faithMode ? 'Request Spiritual Guidance' : 'Request Mentorship',
      faithMode 
        ? 'Would you like to connect with this mentor for spiritual guidance and growth?'
        : 'Would you like to request mentorship from this mentor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: faithMode ? 'Request Guidance' : 'Send Request',
          onPress: () => {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
              setLoading(false);
              Alert.alert(
                'Request Sent!',
                faithMode 
                  ? 'Your request for spiritual guidance has been sent. You\'ll hear back within 24 hours. God bless!'
                  : 'Your mentorship request has been sent. You\'ll receive a response within 24 hours.'
              );
            }, 1500);
          }
        }
      ]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Text key={i} style={[styles.star, i < Math.floor(rating) && styles.starFilled]}>
        ★
      </Text>
    ));
  };

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
          {/* Profile Header */}
          <BlurView intensity={20} style={styles.profileCard}>
            <LinearGradient
              colors={KingdomColors.gradients.cardBackground as any}
              style={styles.profileContent}
            >
              <View style={styles.profileImageContainer}>
                <Image 
                  source={{ uri: mentor.profileImage }} 
                  style={styles.profileImage as ImageStyle}
                />
                <View style={[styles.statusBadge, mentor.isActive && styles.activeBadge]}>
                  <Text style={styles.statusText}>
                    {mentor.isActive ? 'Available' : 'Busy'}
                  </Text>
                </View>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.mentorName}>{mentor.displayName}</Text>
                <View style={styles.ratingContainer}>
                  {renderStars(mentor.rating)}
                  <Text style={styles.ratingText}>
                    {mentor.rating} ({mentor.totalSessions} sessions)
                  </Text>
                </View>
                <Text style={styles.experience}>{mentor.experience}</Text>
              </View>
            </LinearGradient>
          </BlurView>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <BlurView intensity={20} style={styles.statCard}>
              <LinearGradient colors={KingdomColors.gradients.accent as any} style={styles.statContent}>
                <Text style={styles.statNumber}>{mentor.totalMentees}</Text>
                <Text style={styles.statLabel}>
                  {faithMode ? 'Disciples' : 'Mentees'}
                </Text>
              </LinearGradient>
            </BlurView>

            <BlurView intensity={20} style={styles.statCard}>
              <LinearGradient colors={KingdomColors.gradients.secondary as any} style={styles.statContent}>
                <Text style={styles.statNumber}>{mentor.totalSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </LinearGradient>
            </BlurView>

            <BlurView intensity={20} style={styles.statCard}>
              <LinearGradient colors={KingdomColors.gradients.tertiary as any} style={styles.statContent}>
                <Text style={styles.statNumber}>{mentor.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </LinearGradient>
            </BlurView>
          </View>

          {/* Bio Section */}
          <BlurView intensity={20} style={styles.sectionCard}>
            <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>
                {faithMode ? 'Heart & Calling' : 'About'}
              </Text>
              <Text style={styles.bioText}>{mentor.bio}</Text>
            </LinearGradient>
          </BlurView>

          {/* Giftings/Specialties */}
          <BlurView intensity={20} style={styles.sectionCard}>
            <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>
                {faithMode ? 'Spiritual Giftings' : 'Specialties'}
              </Text>
              <View style={styles.tagsContainer}>
                {(faithMode ? mentor.giftings : mentor.specialties).map((item, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{item}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </BlurView>

          {/* Categories */}
          <BlurView intensity={20} style={styles.sectionCard}>
            <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Mentorship Areas</Text>
              <View style={styles.categoriesContainer}>
                {mentor.categories.map((category, index) => (
                  <View key={category.id} style={styles.categoryCard}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </BlurView>

          {/* Availability */}
          <BlurView intensity={20} style={styles.sectionCard}>
            <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Availability</Text>
              <View style={styles.availabilityContainer}>
                <Text style={styles.availabilityLabel}>Days:</Text>
                <Text style={styles.availabilityText}>
                  {mentor.availability.days.join(', ')}
                </Text>
              </View>
              <View style={styles.availabilityContainer}>
                <Text style={styles.availabilityLabel}>Times:</Text>
                <Text style={styles.availabilityText}>
                  {mentor.availability.preferredTimes.join(', ')} ({mentor.availability.timeZone})
                </Text>
              </View>
            </LinearGradient>
          </BlurView>

          {/* Testimonials */}
          <BlurView intensity={20} style={styles.sectionCard}>
            <LinearGradient colors={KingdomColors.gradients.cardBackground as any} style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>
                {faithMode ? 'Testimonies' : 'Reviews'}
              </Text>
              {mentor.testimonials.map((testimonial, index) => (
                <View key={testimonial.id} style={styles.testimonialCard}>
                  <View style={styles.testimonialHeader}>
                    <Text style={styles.testimonialName}>{testimonial.fromUserName}</Text>
                    <View style={styles.testimonialRating}>
                      {renderStars(testimonial.rating)}
                    </View>
                  </View>
                  <Text style={styles.testimonialText}>{testimonial.message}</Text>
                  <Text style={styles.testimonialCategory}>{testimonial.category}</Text>
                </View>
              ))}
            </LinearGradient>
          </BlurView>

          {/* Request Button */}
          <TouchableOpacity 
            style={styles.requestButton} 
            onPress={handleRequestMentorship}
            disabled={loading}
          >
            <LinearGradient
              colors={KingdomColors.gradients.primary as any}
              style={styles.requestButtonGradient}
            >
              {loading ? (
                <Text style={styles.requestButtonText}>Sending...</Text>
              ) : (
                <Text style={styles.requestButtonText}>
                  {faithMode ? '✝️ Request Spiritual Guidance' : '🤝 Request Mentorship'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

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
  profileCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    ...KingdomShadows.large,
  },
  profileContent: {
    padding: 24,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: KingdomColors.gold.bright,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: KingdomColors.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: KingdomColors.green,
  },
  statusText: {
    color: KingdomColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  profileInfo: {
    alignItems: 'center',
  },
  mentorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  star: {
    fontSize: 20,
    color: KingdomColors.gray,
    marginRight: 2,
  },
  starFilled: {
    color: KingdomColors.gold.bright,
  },
  ratingText: {
    color: KingdomColors.lightGray,
    fontSize: 14,
    marginLeft: 8,
  },
  experience: {
    color: KingdomColors.lightGray,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.lightGray,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  sectionContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 16,
  },
  bioText: {
    color: KingdomColors.lightGray,
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: KingdomColors.darkGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: KingdomColors.purple,
  },
  tagText: {
    color: KingdomColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: KingdomColors.darkGray,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KingdomColors.purple,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryDescription: {
    color: KingdomColors.lightGray,
    fontSize: 14,
  },
  availabilityContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  availabilityLabel: {
    color: KingdomColors.gold.bright,
    fontSize: 16,
    fontWeight: '600',
    width: 80,
  },
  availabilityText: {
    color: KingdomColors.lightGray,
    fontSize: 16,
    flex: 1,
  },
  testimonialCard: {
    backgroundColor: KingdomColors.darkGray,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: KingdomColors.purple,
  },
  testimonialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testimonialName: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  testimonialRating: {
    flexDirection: 'row',
  },
  testimonialText: {
    color: KingdomColors.lightGray,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  testimonialCategory: {
    color: KingdomColors.gold.bright,
    fontSize: 12,
    fontWeight: '600',
  },
  requestButton: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.large,
  },
  requestButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  requestButtonText: {
    color: KingdomColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default React.memo(MentorProfileScreen);
