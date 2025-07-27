/**
 * Kingdom Studios Private Prayer Room Screen
 * Private prayer space with prayer requests, encouragement, and faith-mode support
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useFaithMode } from '../contexts/FaithModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { KingdomShadows } from '../constants/KingdomShadows';
import KingdomLogo from '../components/KingdomLogo';
import { PrayerRequest, PRAYER_CATEGORIES } from '../types/spiritual';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface PrayerDisplayItem {
  id: string;
  title: string;
  description: string;
  category: string;
  isAnonymous: boolean;
  isUrgent: boolean;
  isPraisereport: boolean;
  prayerCount: number;
  encouragementCount: number;
  createdAt: string;
  status: 'active' | 'answered' | 'archived';
}

const PrayerRoomScreen = () => {
  const navigation = useNavigation();
  const { faithMode } = useFaithMode();

  const [prayerRequests, setPrayerRequests] = useState<PrayerDisplayItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<'requests' | 'personal' | 'praise'>('requests');
  const [refreshing, setRefreshing] = useState(false);
  const [newPrayerTitle, setNewPrayerTitle] = useState('');
  const [newPrayerDescription, setNewPrayerDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadPrayerRequests();
  }, [selectedTab]);

  const loadPrayerRequests = async () => {
    try {
      // Mock prayer requests data
      const mockRequests: PrayerDisplayItem[] = [
        {
          id: '1',
          title: faithMode ? 'Healing for my mother' : 'Support for family member',
          description: faithMode
            ? 'Please pray for my mother who is undergoing surgery. Believing God for complete healing and restoration.'
            : 'My family member is going through a difficult medical procedure. Please send positive thoughts.',
          category: 'healing',
          isAnonymous: false,
          isUrgent: true,
          isPraisereport: false,
          prayerCount: 47,
          encouragementCount: 12,
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          status: 'active',
        },
        {
          id: '2',
          title: faithMode ? 'Job provision' : 'Career opportunity',
          description: faithMode
            ? 'Trusting God for the right job opportunity. Praying for His perfect timing and provision.'
            : 'Looking for the right career opportunity. Hoping for good timing and the right fit.',
          category: 'provision',
          isAnonymous: true,
          isUrgent: false,
          isPraisereport: false,
          prayerCount: 23,
          encouragementCount: 8,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: 'active',
        },
        {
          id: '3',
          title: faithMode ? 'Praise Report: Job answered!' : 'Great news: New job!',
          description: faithMode
            ? 'God answered our prayers! I got the job I\'ve been praying for. His timing is perfect!'
            : 'Amazing news! I got the job I\'ve been hoping for. Everything worked out perfectly!',
          category: 'provision',
          isAnonymous: false,
          isUrgent: false,
          isPraisereport: true,
          prayerCount: 67,
          encouragementCount: 25,
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          status: 'answered',
        },
      ];

      // Filter based on selected tab
      let filteredRequests = mockRequests;
      if (selectedTab === 'praise') {
        filteredRequests = mockRequests.filter(r => r.isPraisereport);
      } else if (selectedTab === 'requests') {
        filteredRequests = mockRequests.filter(r => !r.isPraisereport);
      }

      setPrayerRequests(filteredRequests);
    } catch (error) {
      Alert.alert('Error', 'Failed to load prayer requests');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrayerRequests();
    setRefreshing(false);
  };

  const handlePrayForRequest = async (requestId: string) => {
    try {
      setPrayerRequests(prev => prev.map(r =>
        r.id === requestId
          ? { ...r, prayerCount: r.prayerCount + 1 }
          : r
      ));

      Alert.alert(
        faithMode ? 'Prayer Recorded' : 'Support Recorded',
        faithMode
          ? 'Your prayer has been recorded. May God bless your intercession.'
          : 'Your support has been recorded. Thank you for caring.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to record prayer');
    }
  };

  const handleSubmitPrayer = async () => {
    if (!newPrayerTitle.trim() || !newPrayerDescription.trim()) {
      Alert.alert('Required Fields', 'Please fill in both title and description');
      return;
    }

    try {
      const newRequest: PrayerDisplayItem = {
        id: Date.now().toString(),
        title: newPrayerTitle,
        description: newPrayerDescription,
        category: 'general',
        isAnonymous,
        isUrgent: false,
        isPraisereport: false,
        prayerCount: 0,
        encouragementCount: 0,
        createdAt: new Date().toISOString(),
        status: 'active',
      };

      setPrayerRequests(prev => [newRequest, ...prev]);
      setNewPrayerTitle('');
      setNewPrayerDescription('');
      setShowAddForm(false);

      Alert.alert(
        faithMode ? 'Prayer Request Submitted' : 'Request Submitted',
        faithMode
          ? 'Your prayer request has been shared with the community. May God answer according to His will.'
          : 'Your request has been shared with the community. Thank you for trusting us with this.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit prayer request');
    }
  };

  const renderPrayerCard = (item: PrayerDisplayItem) => (
    <View key={item.id} style={styles.prayerCard}>
      <LinearGradient
        colors={[KingdomColors.background.secondary, KingdomColors.background.tertiary]}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            {item.isPraisereport && (
              <View style={styles.praiseIndicator}>
                <Ionicons name="trophy" size={16} color={KingdomColors.gold.bright} />
                <Text style={styles.praiseText}>
                  {faithMode ? 'Praise Report' : 'Good News'}
                </Text>
              </View>
            )}
            {item.isUrgent && !item.isPraisereport && (
              <View style={styles.urgentIndicator}>
                <Ionicons name="warning" size={16} color="#EF4444" />
                <Text style={styles.urgentText}>Urgent</Text>
              </View>
            )}
          </View>
          <Text style={styles.timeStamp}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Text style={styles.prayerTitle}>{item.title}</Text>
        <Text style={styles.prayerDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.prayButton}
            onPress={() => handlePrayForRequest(item.id)}
          >
            <Ionicons
              name={faithMode ? "prism" : "heart"}
              size={18}
              color={KingdomColors.gold.bright}
            />
            <Text style={styles.prayButtonText}>
              {faithMode ? `Pray (${item.prayerCount})` : `Support (${item.prayerCount})`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.encourageButton}>
            <Ionicons name="chatbubble" size={18} color={KingdomColors.text.muted} />
            <Text style={styles.encourageButtonText}>{item.encouragementCount}</Text>
          </TouchableOpacity>

          {item.status === 'answered' && (
            <View style={styles.answeredIndicator}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text style={styles.answeredText}>
                {faithMode ? 'Answered' : 'Resolved'}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  const tabs = [
    {
      key: 'requests',
      label: faithMode ? 'Prayer Requests' : 'Support Requests',
      icon: 'hands-outline'
    },
    {
      key: 'praise',
      label: faithMode ? 'Praise Reports' : 'Good News',
      icon: 'celebration'
    },
    {
      key: 'personal',
      label: faithMode ? 'My Prayers' : 'My Requests',
      icon: 'person'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.background.primary, KingdomColors.background.secondary, KingdomColors.background.tertiary]}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={KingdomColors.text.primary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <KingdomLogo size="small" />
            <Text style={styles.headerTitle}>
              {faithMode ? 'Prayer Room' : 'Support Room'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Ionicons name="add" size={24} color={KingdomColors.gold.bright} />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                selectedTab === tab.key && styles.tabActive
              ]}
              onPress={() => setSelectedTab(tab.key as 'requests' | 'personal' | 'praise')}
            >
              <Ionicons
                name={tab.icon as any}
                size={20}
                color={selectedTab === tab.key ? KingdomColors.gold.bright : KingdomColors.text.muted}
              />
              <Text style={[
                styles.tabText,
                selectedTab === tab.key && styles.tabTextActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Prayer Verse */}
        {faithMode && (
          <View style={styles.verseContainer}>
            <BlurView intensity={20} style={styles.verseBlur}>
              <Text style={styles.verse}>
                "Do not be anxious about anything, but in every situation, by prayer and petition,
                with thanksgiving, present your requests to God." - Philippians 4:6
              </Text>
            </BlurView>
          </View>
        )}

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[KingdomColors.gold.bright]}
              tintColor={KingdomColors.gold.bright}
            />
          }
        >
          {prayerRequests.map(renderPrayerCard)}
        </ScrollView>

        {/* Add Prayer Form Modal */}
        {showAddForm && (
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <BlurView intensity={90} style={styles.modalBlur}>
              <View style={styles.modalContainer}>
                <LinearGradient
                  colors={[KingdomColors.background.secondary, KingdomColors.background.tertiary]}
                  style={styles.modalGradient}
                >
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {faithMode ? 'Submit Prayer Request' : 'Submit Support Request'}
                    </Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowAddForm(false)}
                    >
                      <Ionicons name="close" size={24} color={KingdomColors.text.primary} />
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.titleInput}
                    placeholder={faithMode ? "Prayer request title..." : "Request title..."}
                    placeholderTextColor={KingdomColors.text.muted}
                    value={newPrayerTitle}
                    onChangeText={setNewPrayerTitle}
                  />

                  <TextInput
                    style={styles.descriptionInput}
                    placeholder={faithMode ? "Share your prayer request..." : "Share your request..."}
                    placeholderTextColor={KingdomColors.text.muted}
                    value={newPrayerDescription}
                    onChangeText={setNewPrayerDescription}
                    multiline
                    numberOfLines={4}
                  />

                  <TouchableOpacity
                    style={styles.anonymousOption}
                    onPress={() => setIsAnonymous(!isAnonymous)}
                  >
                    <Ionicons
                      name={isAnonymous ? "checkbox" : "checkbox-outline"}
                      size={20}
                      color={KingdomColors.gold.bright}
                    />
                    <Text style={styles.anonymousText}>Submit anonymously</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitPrayer}
                  >
                    <Text style={styles.submitButtonText}>
                      {faithMode ? 'Submit Prayer' : 'Submit Request'}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </BlurView>
          </KeyboardAvoidingView>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: KingdomColors.text.primary,
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
  addButton: {
    padding: 8,
    backgroundColor: KingdomColors.background.overlay,
    borderRadius: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: KingdomColors.background.overlay,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: KingdomColors.gold.bright,
  },
  tabText: {
    color: KingdomColors.text.muted,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  tabTextActive: {
    color: KingdomColors.primary.midnight,
    fontWeight: '600',
  },
  verseContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  verseBlur: {
    padding: 16,
  },
  verse: {
    color: KingdomColors.text.primary,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  prayerCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...KingdomShadows.elegant,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  praiseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  praiseText: {
    color: KingdomColors.gold.bright,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  urgentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  timeStamp: {
    color: KingdomColors.text.muted,
    fontSize: 12,
  },
  prayerTitle: {
    color: KingdomColors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  prayerDescription: {
    color: KingdomColors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  prayButtonText: {
    color: KingdomColors.gold.bright,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  encourageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  encourageButtonText: {
    color: KingdomColors.text.muted,
    fontSize: 14,
    marginLeft: 4,
  },
  answeredIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answeredText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBlur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width - 40,
    maxHeight: height * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: KingdomColors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  titleInput: {
    backgroundColor: KingdomColors.background.overlay,
    borderRadius: 12,
    padding: 16,
    color: KingdomColors.text.primary,
    fontSize: 16,
    marginBottom: 16,
  },
  descriptionInput: {
    backgroundColor: KingdomColors.background.overlay,
    borderRadius: 12,
    padding: 16,
    color: KingdomColors.text.primary,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 16,
  },
  anonymousOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  anonymousText: {
    color: KingdomColors.text.secondary,
    fontSize: 16,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: KingdomColors.gold.bright,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: KingdomColors.primary.midnight,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default React.memo(PrayerRoomScreen);
