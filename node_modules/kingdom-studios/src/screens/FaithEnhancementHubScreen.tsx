import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

const { width } = Dimensions.get('window');

interface BibleStudyPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  currentDay: number;
  totalDays: number;
  category: 'beginner' | 'intermediate' | 'advanced' | 'topical';
  verses: string[];
}

interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'family' | 'ministry' | 'healing' | 'guidance' | 'thanksgiving';
  isPrivate: boolean;
  dateCreated: Date;
  isAnswered: boolean;
  answeredDate?: Date;
  tags: string[];
}

interface MinistryEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: 'service' | 'bible_study' | 'prayer_meeting' | 'fellowship' | 'outreach' | 'youth' | 'seniors';
  organizer: string;
  volunteers: string[];
  resources: string[];
  attendance?: number;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
}

interface DailyDevotional {
  id: string;
  date: Date;
  title: string;
  verse: string;
  verseReference: string;
  reflection: string;
  prayer: string;
  actionPoint: string;
}

const FaithEnhancementHubScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  
  const [currentTab, setCurrentTab] = useState<'devotional' | 'study' | 'prayer' | 'events'>('devotional');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'prayer' | 'event' | 'study'>('prayer');
  const [bibleStudyPlans, setBibleStudyPlans] = useState<BibleStudyPlan[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [ministryEvents, setMinistryEvents] = useState<MinistryEvent[]>([]);
  const [dailyDevotional, setDailyDevotional] = useState<DailyDevotional | null>(null);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock Bible study plans
    const mockStudyPlans: BibleStudyPlan[] = [
      {
        id: '1',
        title: 'Foundations of Faith',
        description: 'A 30-day journey through essential Christian beliefs and practices',
        duration: '30 days',
        progress: 60,
        currentDay: 18,
        totalDays: 30,
        category: 'beginner',
        verses: ['John 3:16', 'Romans 8:28', 'Philippians 4:13']
      },
      {
        id: '2',
        title: 'The Life of Jesus',
        description: 'Walk through the Gospels and discover the heart of Christ',
        duration: '40 days',
        progress: 25,
        currentDay: 10,
        totalDays: 40,
        category: 'intermediate',
        verses: ['Matthew 5:3-12', 'John 14:6', 'Luke 19:10']
      },
      {
        id: '3',
        title: 'Spiritual Warfare',
        description: 'Understanding our battle and victory in Christ',
        duration: '21 days',
        progress: 0,
        currentDay: 1,
        totalDays: 21,
        category: 'advanced',
        verses: ['Ephesians 6:10-18', '2 Corinthians 10:4', '1 John 4:4']
      }
    ];

    // Mock prayer requests
    const mockPrayerRequests: PrayerRequest[] = [
      {
        id: '1',
        title: 'Healing for Mom',
        description: 'Praying for complete healing and restoration for my mother\'s health',
        category: 'healing',
        isPrivate: false,
        dateCreated: new Date(Date.now() - 172800000),
        isAnswered: false,
        tags: ['healing', 'family', 'health']
      },
      {
        id: '2',
        title: 'Ministry Direction',
        description: 'Seeking God\'s guidance for the next steps in youth ministry',
        category: 'guidance',
        isPrivate: true,
        dateCreated: new Date(Date.now() - 86400000),
        isAnswered: false,
        tags: ['ministry', 'guidance', 'youth']
      },
      {
        id: '3',
        title: 'New Job Opportunity',
        description: 'Thankful for the new position God has opened up!',
        category: 'thanksgiving',
        isPrivate: false,
        dateCreated: new Date(Date.now() - 259200000),
        isAnswered: true,
        answeredDate: new Date(Date.now() - 86400000),
        tags: ['thanksgiving', 'provision', 'career']
      }
    ];

    // Mock ministry events
    const mockMinistryEvents: MinistryEvent[] = [
      {
        id: '1',
        title: 'Sunday Morning Service',
        description: 'Weekly worship service with communion',
        date: new Date(Date.now() + 259200000),
        time: '10:00 AM',
        location: 'Main Sanctuary',
        type: 'service',
        organizer: 'Pastor Sarah',
        volunteers: ['John', 'Mary', 'David'],
        resources: ['Sound system', 'Communion elements', 'Bulletins'],
        status: 'confirmed'
      },
      {
        id: '2',
        title: 'Youth Bible Study',
        description: 'Weekly Bible study for teenagers',
        date: new Date(Date.now() + 345600000),
        time: '7:00 PM',
        location: 'Youth Room',
        type: 'youth',
        organizer: 'Pastor Mark',
        volunteers: ['Lisa', 'Tom'],
        resources: ['Bibles', 'Study guides', 'Snacks'],
        status: 'confirmed'
      },
      {
        id: '3',
        title: 'Community Outreach',
        description: 'Serving at the local food bank',
        date: new Date(Date.now() + 604800000),
        time: '9:00 AM',
        location: 'Downtown Food Bank',
        type: 'outreach',
        organizer: 'Deacon Grace',
        volunteers: ['Paul', 'Ruth', 'Timothy'],
        resources: ['Transportation', 'Volunteer shirts'],
        status: 'planning'
      }
    ];

    // Mock daily devotional
    const mockDevotional: DailyDevotional = {
      id: '1',
      date: new Date(),
      title: 'Walking in Faith',
      verse: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
      verseReference: 'Hebrews 11:1',
      reflection: 'Faith is not about having all the answers, but trusting the One who does. Today, let us step forward in confidence, knowing that God\'s plan for us is good, pleasing, and perfect.',
      prayer: 'Heavenly Father, increase our faith today. Help us to trust in Your perfect timing and Your perfect plan, even when we cannot see the way forward. Give us courage to step out in faith.',
      actionPoint: 'Take one step of faith today - whether it\'s having a difficult conversation, starting something new, or simply trusting God with a worry.'
    };

    setBibleStudyPlans(mockStudyPlans);
    setPrayerRequests(mockPrayerRequests);
    setMinistryEvents(mockMinistryEvents);
    setDailyDevotional(mockDevotional);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beginner':
        return colors.success;
      case 'intermediate':
        return colors.info;
      case 'advanced':
        return colors.warning;
      case 'topical':
        return colors.accent;
      case 'healing':
        return colors.success;
      case 'guidance':
        return colors.info;
      case 'thanksgiving':
        return colors.accent;
      case 'family':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'service':
        return 'church';
      case 'bible_study':
        return 'menu-book';
      case 'prayer_meeting':
        return 'favorite';
      case 'fellowship':
        return 'groups';
      case 'outreach':
        return 'volunteer-activism';
      case 'youth':
        return 'child-friendly';
      case 'seniors':
        return 'elderly';
      default:
        return 'event';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  const renderDailyDevotional = () => (
    <ScrollView style={styles.devotionalContainer}>
      {dailyDevotional && (
        <View style={[styles.devotionalCard, { backgroundColor: colors.surface }]}>
          <View style={styles.devotionalHeader}>
            <Text style={[styles.devotionalTitle, { color: colors.text }]}>
              📖 {dailyDevotional.title}
            </Text>
            <Text style={[styles.devotionalDate, { color: colors.textSecondary }]}>
              {formatDate(dailyDevotional.date)}
            </Text>
          </View>
          
          <View style={[styles.verseCard, { backgroundColor: colors.primary }]}>
            <Text style={styles.verseText}>
              "{dailyDevotional.verse}"
            </Text>
            <Text style={styles.verseReference}>
              - {dailyDevotional.verseReference}
            </Text>
          </View>
          
          <View style={styles.devotionalSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🤲 Reflection
            </Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
              {dailyDevotional.reflection}
            </Text>
          </View>
          
          <View style={styles.devotionalSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🙏 Prayer
            </Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
              {dailyDevotional.prayer}
            </Text>
          </View>
          
          <View style={styles.devotionalSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              ⚡ Action Point
            </Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
              {dailyDevotional.actionPoint}
            </Text>
          </View>
          
          <View style={styles.devotionalActions}>
            <TouchableOpacity style={[styles.devotionalButton, { backgroundColor: colors.success }]}>
              <MaterialIcons name="check" size={16} color="#FFFFFF" />
              <Text style={styles.devotionalButtonText}>Complete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.devotionalButton, { backgroundColor: colors.info }]}>
              <MaterialIcons name="share" size={16} color="#FFFFFF" />
              <Text style={styles.devotionalButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderStudyPlan = (plan: BibleStudyPlan) => (
    <TouchableOpacity key={plan.id} style={[styles.studyCard, { backgroundColor: colors.surface }]}>
      <View style={styles.studyHeader}>
        <Text style={[styles.studyTitle, { color: colors.text }]}>
          {plan.title}
        </Text>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(plan.category) }]}>
          <Text style={styles.categoryText}>{plan.category}</Text>
        </View>
      </View>
      
      <Text style={[styles.studyDescription, { color: colors.textSecondary }]}>
        {plan.description}
      </Text>
      
      <View style={styles.studyProgress}>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressText, { color: colors.text }]}>
            Day {plan.currentDay} of {plan.totalDays}
          </Text>
          <Text style={[styles.progressPercent, { color: colors.accent }]}>
            {plan.progress}%
          </Text>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
          <View style={[
            styles.progressFill, 
            { width: `${plan.progress}%`, backgroundColor: colors.primary }
          ]} />
        </View>
      </View>
      
      <TouchableOpacity style={[styles.continueButton, { backgroundColor: colors.primary }]}>
        <MaterialIcons name="play-arrow" size={16} color="#FFFFFF" />
        <Text style={styles.continueButtonText}>Continue Study</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPrayerRequest = (prayer: PrayerRequest) => (
    <View key={prayer.id} style={[styles.prayerCard, { backgroundColor: colors.surface }]}>
      <View style={styles.prayerHeader}>
        <View style={styles.prayerInfo}>
          <Text style={[styles.prayerTitle, { color: colors.text }]}>
            {prayer.title}
          </Text>
          {prayer.isAnswered && (
            <MaterialIcons name="check-circle" size={16} color={colors.success} />
          )}
        </View>
        
        <View style={styles.prayerMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(prayer.category) }]}>
            <Text style={styles.categoryText}>{prayer.category}</Text>
          </View>
          {prayer.isPrivate && (
            <MaterialIcons name="lock" size={14} color={colors.warning} />
          )}
        </View>
      </View>
      
      <Text style={[styles.prayerDescription, { color: colors.textSecondary }]}>
        {prayer.description}
      </Text>
      
      <View style={styles.prayerTags}>
        {prayer.tags.map((tag, index) => (
          <View key={index} style={[styles.tag, { backgroundColor: colors.background }]}>
            <Text style={[styles.tagText, { color: colors.textSecondary }]}>
              #{tag}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.prayerFooter}>
        <Text style={[styles.prayerDate, { color: colors.textSecondary }]}>
          {formatRelativeTime(prayer.dateCreated)}
          {prayer.isAnswered && prayer.answeredDate && (
            <Text style={{ color: colors.success }}>
              {' • Answered '}
            </Text>
          )}
        </Text>
        
        <TouchableOpacity style={[styles.prayButton, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="favorite" size={14} color="#FFFFFF" />
          <Text style={styles.prayButtonText}>Pray</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMinistryEvent = (event: MinistryEvent) => (
    <TouchableOpacity key={event.id} style={[styles.eventCard, { backgroundColor: colors.surface }]}>
      <View style={styles.eventHeader}>
        <View style={[styles.eventIcon, { backgroundColor: colors.primary }]}>
          <MaterialIcons name={getEventTypeIcon(event.type) as any} size={20} color="#FFFFFF" />
        </View>
        
        <View style={styles.eventInfo}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {event.title}
          </Text>
          <Text style={[styles.eventOrganizer, { color: colors.textSecondary }]}>
            by {event.organizer}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getCategoryColor(event.status) }]}>
          <Text style={styles.statusText}>{event.status}</Text>
        </View>
      </View>
      
      <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
        {event.description}
      </Text>
      
      <View style={styles.eventDetails}>
        <View style={styles.eventDetailItem}>
          <MaterialIcons name="schedule" size={14} color={colors.textSecondary} />
          <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
            {formatDate(event.date)} at {event.time}
          </Text>
        </View>
        
        <View style={styles.eventDetailItem}>
          <MaterialIcons name="location-on" size={14} color={colors.textSecondary} />
          <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
            {event.location}
          </Text>
        </View>
        
        <View style={styles.eventDetailItem}>
          <MaterialIcons name="group" size={14} color={colors.textSecondary} />
          <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
            {event.volunteers.length} volunteers
          </Text>
        </View>
      </View>
      
      <View style={styles.eventActions}>
        <TouchableOpacity style={[styles.eventButton, { backgroundColor: colors.info }]}>
          <MaterialIcons name="edit" size={14} color="#FFFFFF" />
          <Text style={styles.eventButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.eventButton, { backgroundColor: colors.success }]}>
          <MaterialIcons name="volunteer-activism" size={14} color="#FFFFFF" />
          <Text style={styles.eventButtonText}>Volunteer</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Only show this screen in faith mode
  if (currentMode !== 'faith') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFaithMode}>
          <MaterialIcons name="church" size={64} color={colors.textSecondary} />
          <Text style={[styles.notFaithModeText, { color: colors.textSecondary }]}>
            Switch to Faith Mode to access ministry tools and spiritual resources
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          ⛪ Faith Enhancement Hub
        </Text>
        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowModal(true)}
        >
          <MaterialIcons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {[
          { key: 'devotional', label: 'Daily', icon: 'book' },
          { key: 'study', label: 'Study', icon: 'school' },
          { key: 'prayer', label: 'Prayer', icon: 'favorite' },
          { key: 'events', label: 'Ministry', icon: 'event' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              { backgroundColor: currentTab === tab.key ? colors.primary : 'transparent' }
            ]}
            onPress={() => setCurrentTab(tab.key as any)}
          >
            <MaterialIcons 
              name={tab.icon as any} 
              size={18} 
              color={currentTab === tab.key ? '#FFFFFF' : colors.textSecondary} 
            />
            <Text style={[
              styles.tabText,
              { color: currentTab === tab.key ? '#FFFFFF' : colors.textSecondary }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {currentTab === 'devotional' && renderDailyDevotional()}

        {currentTab === 'study' && (
          <ScrollView style={styles.studyContainer}>
            {bibleStudyPlans.map(renderStudyPlan)}
          </ScrollView>
        )}

        {currentTab === 'prayer' && (
          <ScrollView style={styles.prayerContainer}>
            {prayerRequests.map(renderPrayerRequest)}
          </ScrollView>
        )}

        {currentTab === 'events' && (
          <ScrollView style={styles.eventsContainer}>
            {ministryEvents.map(renderMinistryEvent)}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  notFaithMode: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  notFaithModeText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 20,
  },
  // Devotional Styles
  devotionalContainer: {
    flex: 1,
    padding: 16,
  },
  devotionalCard: {
    padding: 20,
    borderRadius: 12,
  },
  devotionalHeader: {
    marginBottom: 16,
  },
  devotionalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  devotionalDate: {
    fontSize: 12,
  },
  verseCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  verseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 8,
  },
  verseReference: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  devotionalSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  devotionalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  devotionalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  devotionalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Study Styles
  studyContainer: {
    flex: 1,
    padding: 16,
  },
  studyCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  studyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studyTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  studyDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  studyProgress: {
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Prayer Styles
  prayerContainer: {
    flex: 1,
    padding: 16,
  },
  prayerCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  prayerTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  prayerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prayerDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  prayerTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
  },
  prayerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prayerDate: {
    fontSize: 10,
  },
  prayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  prayButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  // Events Styles
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  eventOrganizer: {
    fontSize: 11,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  eventDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  eventDetails: {
    gap: 4,
    marginBottom: 12,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailText: {
    fontSize: 11,
    marginLeft: 4,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  eventButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },
  eventButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default FaithEnhancementHubScreen;
