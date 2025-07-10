import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

const { width } = Dimensions.get('window');

interface CommunityMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'member' | 'moderator' | 'elder' | 'leader' | 'admin';
  joinDate: Date;
  lastActive: Date;
  contributions: number;
  verified: boolean;
  ministry?: string;
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  image?: string;
  memberCount: number;
  category: string;
  isPrivate: boolean;
  created: Date;
  moderators: string[];
  tags: string[];
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: 'prayer' | 'study' | 'fellowship' | 'outreach' | 'worship' | 'general';
  organizer: string;
  attendees: string[];
  maxAttendees?: number;
  isOnline: boolean;
}

const CommunityHubScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  
  const [currentTab, setCurrentTab] = useState<'members' | 'groups' | 'events' | 'discussions'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);

  useEffect(() => {
    loadMockData();
  }, [currentMode]);

  const loadMockData = () => {
    // Mock community members
    const mockMembers: CommunityMember[] = [
      {
        id: '1',
        name: currentMode === 'faith' ? 'Pastor Sarah Williams' : 'Sarah Williams',
        role: 'leader',
        joinDate: new Date('2024-01-15'),
        lastActive: new Date(),
        contributions: 247,
        verified: true,
        ministry: currentMode === 'faith' ? 'Youth Ministry' : undefined
      },
      {
        id: '2',
        name: currentMode === 'faith' ? 'Brother Marcus Johnson' : 'Marcus Johnson',
        role: 'elder',
        joinDate: new Date('2024-02-20'),
        lastActive: new Date(Date.now() - 3600000),
        contributions: 189,
        verified: true,
        ministry: currentMode === 'faith' ? 'Worship Ministry' : undefined
      },
      {
        id: '3',
        name: currentMode === 'faith' ? 'Sister Grace Chen' : 'Grace Chen',
        role: 'moderator',
        joinDate: new Date('2024-03-10'),
        lastActive: new Date(Date.now() - 7200000),
        contributions: 156,
        verified: true,
        ministry: currentMode === 'faith' ? 'Prayer Ministry' : undefined
      },
      {
        id: '4',
        name: 'David Rodriguez',
        role: 'member',
        joinDate: new Date('2024-06-01'),
        lastActive: new Date(Date.now() - 86400000),
        contributions: 23,
        verified: false
      }
    ];

    // Mock community groups
    const mockGroups: CommunityGroup[] = [
      {
        id: '1',
        name: currentMode === 'faith' ? 'Young Adults Ministry' : 'Young Creators Circle',
        description: currentMode === 'faith' 
          ? 'A vibrant community for young adults seeking to grow in faith and fellowship'
          : 'A supportive group for young content creators to share and grow',
        memberCount: 127,
        category: currentMode === 'faith' ? 'Ministry' : 'Support',
        isPrivate: false,
        created: new Date('2024-01-01'),
        moderators: ['1', '2'],
        tags: currentMode === 'faith' ? ['ministry', 'youth', 'fellowship'] : ['creators', 'young', 'support']
      },
      {
        id: '2',
        name: currentMode === 'faith' ? 'Prayer Warriors' : 'Content Strategy Circle',
        description: currentMode === 'faith'
          ? 'Dedicated intercessors committed to lifting up our community in prayer'
          : 'Strategic discussions about content planning and optimization',
        memberCount: 89,
        category: currentMode === 'faith' ? 'Prayer' : 'Strategy',
        isPrivate: true,
        created: new Date('2024-02-15'),
        moderators: ['3'],
        tags: currentMode === 'faith' ? ['prayer', 'intercession', 'spiritual'] : ['strategy', 'content', 'planning']
      },
      {
        id: '3',
        name: currentMode === 'faith' ? 'Bible Study Fellowship' : 'Creative Collaboration',
        description: currentMode === 'faith'
          ? 'Weekly Bible studies and theological discussions for spiritual growth'
          : 'Collaborate on creative projects and share artistic inspirations',
        memberCount: 203,
        category: currentMode === 'faith' ? 'Study' : 'Creative',
        isPrivate: false,
        created: new Date('2024-03-01'),
        moderators: ['1', '3'],
        tags: currentMode === 'faith' ? ['bible', 'study', 'theology'] : ['creative', 'collaboration', 'art']
      }
    ];

    // Mock community events
    const mockEvents: CommunityEvent[] = [
      {
        id: '1',
        title: currentMode === 'faith' ? 'Weekly Prayer Meeting' : 'Weekly Creator Meetup',
        description: currentMode === 'faith'
          ? 'Join us for our weekly prayer meeting to seek God together'
          : 'Weekly meetup to discuss content strategies and network',
        date: new Date(Date.now() + 259200000), // 3 days from now
        time: '7:00 PM',
        location: currentMode === 'faith' ? 'Main Sanctuary' : 'Community Center',
        type: currentMode === 'faith' ? 'prayer' : 'general',
        organizer: 'Pastor Sarah Williams',
        attendees: ['1', '2', '3'],
        isOnline: false
      },
      {
        id: '2',
        title: currentMode === 'faith' ? 'Bible Study: Romans Chapter 8' : 'Content Creation Workshop',
        description: currentMode === 'faith'
          ? 'Deep dive into Romans 8 - Life in the Spirit'
          : 'Learn advanced content creation techniques and tools',
        date: new Date(Date.now() + 432000000), // 5 days from now
        time: '6:30 PM',
        location: 'Online',
        type: currentMode === 'faith' ? 'study' : 'general',
        organizer: 'Brother Marcus Johnson',
        attendees: ['1', '3', '4'],
        maxAttendees: 50,
        isOnline: true
      },
      {
        id: '3',
        title: currentMode === 'faith' ? 'Community Outreach Event' : 'Community Networking Event',
        description: currentMode === 'faith'
          ? 'Serving our local community with love and compassion'
          : 'Network with other creators and build valuable connections',
        date: new Date(Date.now() + 604800000), // 1 week from now
        time: '10:00 AM',
        location: currentMode === 'faith' ? 'Community Park' : 'Convention Center',
        type: currentMode === 'faith' ? 'outreach' : 'general',
        organizer: 'Sister Grace Chen',
        attendees: ['2', '4'],
        isOnline: false
      }
    ];

    setMembers(mockMembers);
    setGroups(mockGroups);
    setEvents(mockEvents);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return colors.error;
      case 'leader':
        return colors.primary;
      case 'elder':
        return colors.accent;
      case 'moderator':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return 'admin-panel-settings';
      case 'leader':
        return 'star';
      case 'elder':
        return 'verified';
      case 'moderator':
        return 'security';
      default:
        return 'person';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'prayer':
        return 'favorite';
      case 'study':
        return 'menu-book';
      case 'fellowship':
        return 'groups';
      case 'outreach':
        return 'volunteer-activism';
      case 'worship':
        return 'music-note';
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
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const renderMember = (member: CommunityMember) => (
    <TouchableOpacity key={member.id} style={[styles.memberCard, { backgroundColor: colors.surface }]}>
      <View style={styles.memberInfo}>
        <View style={[styles.memberAvatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.memberAvatarText}>
            {member.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        
        <View style={styles.memberDetails}>
          <View style={styles.memberNameRow}>
            <Text style={[styles.memberName, { color: colors.text }]}>
              {member.name}
            </Text>
            {member.verified && (
              <MaterialIcons name="verified" size={16} color={colors.success} />
            )}
          </View>
          
          <View style={styles.memberRole}>
            <MaterialIcons 
              name={getRoleIcon(member.role) as any} 
              size={14} 
              color={getRoleColor(member.role)} 
            />
            <Text style={[styles.memberRoleText, { color: getRoleColor(member.role) }]}>
              {member.role}
            </Text>
          </View>
          
          {member.ministry && (
            <Text style={[styles.memberMinistry, { color: colors.textSecondary }]}>
              {member.ministry}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.memberStats}>
        <Text style={[styles.memberLastActive, { color: colors.textSecondary }]}>
          {formatRelativeTime(member.lastActive)}
        </Text>
        <Text style={[styles.memberContributions, { color: colors.accent }]}>
          {member.contributions} posts
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderGroup = (group: CommunityGroup) => (
    <TouchableOpacity key={group.id} style={[styles.groupCard, { backgroundColor: colors.surface }]}>
      <View style={styles.groupHeader}>
        <View style={styles.groupInfo}>
          <Text style={[styles.groupName, { color: colors.text }]}>
            {group.name}
          </Text>
          {group.isPrivate && (
            <MaterialIcons name="lock" size={16} color={colors.warning} />
          )}
        </View>
        
        <Text style={[styles.groupCategory, { color: colors.accent }]}>
          {group.category}
        </Text>
      </View>
      
      <Text style={[styles.groupDescription, { color: colors.textSecondary }]}>
        {group.description}
      </Text>
      
      <View style={styles.groupFooter}>
        <Text style={[styles.groupMembers, { color: colors.text }]}>
          {group.memberCount} members
        </Text>
        
        <View style={styles.groupTags}>
          {group.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={[styles.groupTag, { backgroundColor: colors.background }]}>
              <Text style={[styles.groupTagText, { color: colors.textSecondary }]}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEvent = (event: CommunityEvent) => (
    <TouchableOpacity key={event.id} style={[styles.eventCard, { backgroundColor: colors.surface }]}>
      <View style={styles.eventHeader}>
        <View style={[styles.eventIcon, { backgroundColor: colors.primary }]}>
          <MaterialIcons 
            name={getEventTypeIcon(event.type) as any} 
            size={20} 
            color="#FFFFFF" 
          />
        </View>
        
        <View style={styles.eventInfo}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {event.title}
          </Text>
          <Text style={[styles.eventOrganizer, { color: colors.textSecondary }]}>
            by {event.organizer}
          </Text>
        </View>
        
        {event.isOnline && (
          <View style={[styles.onlineBadge, { backgroundColor: colors.success }]}>
            <Text style={styles.onlineText}>Online</Text>
          </View>
        )}
      </View>
      
      <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
        {event.description}
      </Text>
      
      <View style={styles.eventDetails}>
        <View style={styles.eventDetailItem}>
          <MaterialIcons name="schedule" size={16} color={colors.textSecondary} />
          <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
            {formatDate(event.date)} at {event.time}
          </Text>
        </View>
        
        <View style={styles.eventDetailItem}>
          <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
          <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
            {event.location}
          </Text>
        </View>
        
        <View style={styles.eventDetailItem}>
          <MaterialIcons name="group" size={16} color={colors.textSecondary} />
          <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
            {event.attendees.length} attending
            {event.maxAttendees && ` / ${event.maxAttendees}`}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={[styles.joinEventButton, { backgroundColor: colors.primary }]}>
        <Text style={styles.joinEventText}>
          {currentMode === 'faith' ? 'Join Event' : 'RSVP'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: colors.surface }]}>
          <TouchableOpacity onPress={() => setShowCreateModal(false)}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {currentMode === 'faith' ? 'Create Community Content' : 'Create New'}
          </Text>
          
          <TouchableOpacity>
            <Text style={[styles.modalSave, { color: colors.primary }]}>
              Create
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <TouchableOpacity style={[styles.createOption, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="group-add" size={24} color={colors.primary} />
            <Text style={[styles.createOptionText, { color: colors.text }]}>
              {currentMode === 'faith' ? 'Start a Ministry Group' : 'Create New Group'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.createOption, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="event" size={24} color={colors.primary} />
            <Text style={[styles.createOptionText, { color: colors.text }]}>
              {currentMode === 'faith' ? 'Organize an Event' : 'Create Event'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.createOption, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="forum" size={24} color={colors.primary} />
            <Text style={[styles.createOptionText, { color: colors.text }]}>
              {currentMode === 'faith' ? 'Start a Discussion' : 'Start Discussion'}
            </Text>
          </TouchableOpacity>
          
          {currentMode === 'faith' && (
            <>
              <TouchableOpacity style={[styles.createOption, { backgroundColor: colors.surface }]}>
                <MaterialIcons name="favorite" size={24} color={colors.primary} />
                <Text style={[styles.createOptionText, { color: colors.text }]}>
                  Request Prayer
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.createOption, { backgroundColor: colors.surface }]}>
                <MaterialIcons name="volunteer-activism" size={24} color={colors.primary} />
                <Text style={[styles.createOptionText, { color: colors.text }]}>
                  Plan Outreach
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.ministry && member.ministry.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {currentMode === 'faith' ? '⛪ Community Hub' : '🏘️ Community Hub'}
        </Text>
        
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowCreateModal(true)}
        >
          <MaterialIcons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <MaterialIcons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={currentMode === 'faith' ? 'Search community...' : 'Search community...'}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {[
          { key: 'members', label: currentMode === 'faith' ? 'Fellowship' : 'Members', icon: 'people' },
          { key: 'groups', label: currentMode === 'faith' ? 'Ministries' : 'Groups', icon: 'groups' },
          { key: 'events', label: 'Events', icon: 'event' },
          { key: 'discussions', label: currentMode === 'faith' ? 'Testimony' : 'Discussions', icon: 'forum' }
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
      <ScrollView style={styles.content}>
        {currentTab === 'members' && (
          <View style={styles.membersContainer}>
            {filteredMembers.map(renderMember)}
          </View>
        )}

        {currentTab === 'groups' && (
          <View style={styles.groupsContainer}>
            {filteredGroups.map(renderGroup)}
          </View>
        )}

        {currentTab === 'events' && (
          <View style={styles.eventsContainer}>
            {filteredEvents.map(renderEvent)}
          </View>
        )}

        {currentTab === 'discussions' && (
          <View style={styles.discussionsContainer}>
            <Text style={[styles.comingSoon, { color: colors.textSecondary }]}>
              {currentMode === 'faith' 
                ? 'Testimony sharing and discussions coming soon! 🙏'
                : 'Community discussions coming soon! 💬'}
            </Text>
          </View>
        )}
      </ScrollView>

      {renderCreateModal()}
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
  createButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
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
    paddingHorizontal: 12,
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
    padding: 16,
  },
  // Members Styles
  membersContainer: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberDetails: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
  memberRole: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  memberRoleText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  memberMinistry: {
    fontSize: 12,
  },
  memberStats: {
    alignItems: 'flex-end',
  },
  memberLastActive: {
    fontSize: 11,
    marginBottom: 2,
  },
  memberContributions: {
    fontSize: 11,
    fontWeight: '600',
  },
  // Groups Styles
  groupsContainer: {
    gap: 12,
  },
  groupCard: {
    padding: 16,
    borderRadius: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
  groupCategory: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  groupDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupMembers: {
    fontSize: 12,
    fontWeight: '600',
  },
  groupTags: {
    flexDirection: 'row',
    gap: 6,
  },
  groupTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  groupTagText: {
    fontSize: 10,
  },
  // Events Styles
  eventsContainer: {
    gap: 12,
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  eventOrganizer: {
    fontSize: 12,
  },
  onlineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  onlineText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    gap: 6,
    marginBottom: 16,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailText: {
    fontSize: 12,
    marginLeft: 6,
  },
  joinEventButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinEventText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Discussions Styles
  discussionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  comingSoon: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  createOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  createOptionText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default React.memo(CommunityHubScreen);
