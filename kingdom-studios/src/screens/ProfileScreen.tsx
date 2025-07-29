import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/UnifiedAuthContext';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useAppNavigation } from '../utils/navigationUtils';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';
import KingdomLogo from '../components/KingdomLogo';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  color: string;
}

interface Connection {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  isOnline: boolean;
}

interface Activity {
  id: string;
  type: 'post' | 'achievement' | 'connection';
  title: string;
  description: string;
  time: string;
  image?: string;
}

const ProfileScreen = () => {
  const { user } = useAuth();
  const { faithMode } = useFaithMode();
  const navigation = useAppNavigation();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for the profile
  const achievements: Achievement[] = [
    {
      id: '1',
      title: faithMode ? 'Kingdom Builder' : 'Top Creator',
      description: faithMode ? 'Shared 50+ faith-based posts' : 'Created 50+ engaging posts',
      icon: '👑',
      date: '2025-06',
      color: KingdomColors.gold.bright,
    },
    {
      id: '2',
      title: faithMode ? 'Community Shepherd' : 'Community Leader',
      description: faithMode ? 'Helped 100+ fellow believers' : 'Helped 100+ creators',
      icon: '🤝',
      date: '2025-05',
      color: KingdomColors.silver.bright,
    },
    {
      id: '3',
      title: faithMode ? 'Product Steward' : 'Product Expert',
      description: 'Successfully launched 25+ products',
      icon: '📦',
      date: '2025-04',
      color: KingdomColors.primary.royalPurple,
    },
  ];

  const connections: Connection[] = [
    { id: '1', name: 'Sarah Johnson', title: 'Faith-based Designer', isOnline: true },
    { id: '2', name: 'Michael Chen', title: 'Kingdom Entrepreneur', isOnline: false },
    { id: '3', name: 'Rachel Adams', title: 'Content Creator', isOnline: true },
    { id: '4', name: 'David Wilson', title: 'Business Coach', isOnline: false },
    { id: '5', name: 'Lisa Thompson', title: 'Social Media Expert', isOnline: true },
    { id: '6', name: 'James Rodriguez', title: 'Digital Marketer', isOnline: false },
  ];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'post',
      title: 'Shared a new product launch',
      description: faithMode ? 'God has blessed our new faith-inspired collection!' : 'Excited to announce our latest collection!',
      time: '2 hours ago',
      image: 'https://picsum.photos/300/200?random=1',
    },
    {
      id: '2',
      type: 'achievement',
      title: faithMode ? 'Earned Kingdom Builder badge' : 'Earned Top Creator badge',
      description: 'Reached 50 successful product launches',
      time: '1 day ago',
    },
    {
      id: '3',
      type: 'connection',
      title: 'Connected with Sarah Johnson',
      description: faithMode ? 'Another sister in faith joins the community' : 'New connection in the creator community',
      time: '3 days ago',
    },
  ];

  const renderProfileHeader = () => (
    <View style={styles.headerContainer}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[KingdomColors.primary.midnight, KingdomColors.primary.deepNavy]}
        style={styles.headerBackground}
      >
        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        {/* Large Profile Image */}
        <View style={styles.largeProfileImageContainer}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.largeProfileImage} />
          ) : (
            <LinearGradient
              colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
              style={styles.largeProfileImagePlaceholder}
            >
              <Text style={styles.largeProfileImageText}>
                {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </LinearGradient>
          )}
          {/* Online Status */}
          <View style={styles.onlineStatus} />
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {user?.displayName || 'Kingdom Creator'}
          </Text>
          <Text style={styles.profileTitle}>
            {faithMode ? 'Kingdom Entrepreneur & Faith-Based Creator' : 'Digital Creator & Entrepreneur'}
          </Text>

          {/* Location and Join Date */}
          <View style={styles.profileDetails}>
            <Text style={styles.profileDetail}>📍 Global Kingdom Community</Text>
            <Text style={styles.profileDetail}>📅 Joined January 2024</Text>
          </View>

          {/* Bio */}
          <Text style={styles.profileBio}>
            {faithMode
              ? "Building God's kingdom through digital innovation. Passionate about creating faith-inspired products that make a difference. ✨"
              : "Digital entrepreneur focused on creating innovative products and building communities. Always learning and growing. 🚀"
            }
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>127</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2.3K</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>856</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <LinearGradient
              colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>✏️ Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>📤 Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {['overview', 'achievements', 'connections', 'activity'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAchievementCard = ({ item }: { item: Achievement }) => (
    <View style={styles.achievementCard}>
      <LinearGradient
        colors={[`${item.color}20`, `${item.color}10`]}
        style={styles.achievementGradient}
      >
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementIcon}>{item.icon}</Text>
          <Text style={styles.achievementDate}>{item.date}</Text>
        </View>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
      </LinearGradient>
    </View>
  );

  const renderConnectionCard = ({ item }: { item: Connection }) => (
    <View style={styles.connectionCard}>
      <View style={styles.connectionImageContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.connectionImage} />
        ) : (
          <View style={styles.connectionImagePlaceholder}>
            <Text style={styles.connectionImageText}>
              {item.name.charAt(0)}
            </Text>
          </View>
        )}
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <Text style={styles.connectionName}>{item.name}</Text>
      <Text style={styles.connectionTitle}>{item.title}</Text>
      <TouchableOpacity style={styles.connectButton}>
        <Text style={styles.connectButtonText}>Message</Text>
      </TouchableOpacity>
    </View>
  );

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <View style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <View style={styles.activityIcon}>
          <Text style={styles.activityIconText}>
            {item.type === 'post' ? '📝' : item.type === 'achievement' ? '🏆' : '🤝'}
          </Text>
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activityDescription}>{item.description}</Text>
          <Text style={styles.activityTime}>{item.time}</Text>
        </View>
      </View>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.activityImage} />
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'achievements':
        return (
          <FlatList
            data={achievements}
            renderItem={renderAchievementCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.achievementRow}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'connections':
        return (
          <FlatList
            data={connections}
            renderItem={renderConnectionCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.connectionRow}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'activity':
        return (
          <FlatList
            data={activities}
            renderItem={renderActivityItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        );
      default: // overview
        return (
          <View style={styles.overviewContent}>
            {/* Quick Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Achievements</Text>
              <FlatList
                data={achievements.slice(0, 2)}
                renderItem={renderAchievementCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>

            {/* Top Connections */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Connections</Text>
              <FlatList
                data={connections.slice(0, 4)}
                renderItem={renderConnectionCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.connectionRow}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <FlatList
                data={activities.slice(0, 3)}
                renderItem={renderActivityItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        {renderTabBar()}
        <View style={styles.content}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    paddingBottom: 40,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: KingdomColors.opacity.gold10,
    top: -30,
    right: -30,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: KingdomColors.opacity.silver10,
    bottom: 20,
    left: -20,
  },
  profileCard: {
    marginTop: 120,
    marginHorizontal: 20,
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 24,
    padding: 24,
    ...KingdomShadows.elegant,
  },
  largeProfileImageContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginTop: -60,
    marginBottom: 20,
  },
  largeProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: KingdomColors.background.secondary,
  },
  largeProfileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: KingdomColors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeProfileImageText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
  onlineStatus: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: KingdomColors.background.secondary,
    bottom: 5,
    right: 5,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  profileTitle: {
    fontSize: 16,
    color: KingdomColors.text.muted,
    marginBottom: 12,
    textAlign: 'center',
  },
  profileDetails: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  profileDetail: {
    fontSize: 14,
    color: KingdomColors.text.muted,
  },
  profileBio: {
    fontSize: 15,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: KingdomColors.opacity.gold20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.gold,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
  },
  secondaryButton: {
    flex: 2,
    borderWidth: 2,
    borderColor: KingdomColors.silver.bright,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.silver.bright,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: KingdomColors.opacity.gold20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 18,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.background.secondary,
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 4,
    marginTop: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: KingdomColors.gold.bright,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.muted,
  },
  activeTabText: {
    color: KingdomColors.text.inverse,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  overviewContent: {
    gap: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 15,
  },
  achievementCard: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  achievementGradient: {
    padding: 20,
  },
  achievementRow: {
    justifyContent: 'space-between',
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementDate: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  achievementDescription: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    lineHeight: 20,
  },
  connectionCard: {
    flex: 1,
    margin: 8,
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    ...KingdomShadows.silver,
  },
  connectionRow: {
    justifyContent: 'space-between',
  },
  connectionImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  connectionImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
  },
  connectionImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: KingdomColors.primary.royalPurple,
    borderWidth: 2,
    borderColor: KingdomColors.gold.bright,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionImageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
  },
  onlineIndicator: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: KingdomColors.background.secondary,
    bottom: 2,
    right: 2,
  },
  connectionName: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  connectionTitle: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    marginBottom: 12,
    textAlign: 'center',
  },
  connectButton: {
    backgroundColor: KingdomColors.gold.bright,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  connectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
  },
  activityCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...KingdomShadows.silver,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KingdomColors.primary.royalPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginBottom: 8,
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: KingdomColors.text.muted,
  },
  activityImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginTop: 12,
  },
});

export default React.memo(ProfileScreen);
