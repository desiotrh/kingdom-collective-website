import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Clipboard } from 'react-native';
import { KingdomColors } from '../constants/KingdomColors';
import { useAuth } from '../contexts/UnifiedAuthContext';
import { AppMode } from '../types/spiritual';

interface HashtagGroup {
  id: string;
  name: string;
  hashtags: string[];
  category: 'faith' | 'business' | 'lifestyle' | 'custom';
  isDefault: boolean;
  createdAt: string;
  usageCount: number;
}

interface HashtagSuggestion {
  hashtag: string;
  popularity: 'trending' | 'popular' | 'niche';
  relevance: number;
  category: string;
}

const HashtagManagerScreen: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AppMode>('faith');
  const [hashtagGroups, setHashtagGroups] = useState<HashtagGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<HashtagGroup | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<HashtagSuggestion[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newHashtags, setNewHashtags] = useState('');
  const [activeTab, setActiveTab] = useState<'my-groups' | 'suggestions' | 'trending'>('my-groups');

  useEffect(() => {
    loadHashtagGroups();
    loadSuggestions();
  }, [mode]);

  const loadHashtagGroups = () => {
    // Mock data - in real app, this would come from Firebase/API
    const mockGroups: HashtagGroup[] = [
      {
        id: '1',
        name: mode === 'faith' ? 'Faith & Purpose' : 'Motivation & Success',
        hashtags: mode === 'faith' 
          ? ['#faithbased', '#purposedriven', '#biblicalwisdom', '#godsplan', '#walkinfaith', '#blessedandfavored', '#kingdomlife', '#faithoverfear', '#godslove', '#spiritualgrowth']
          : ['#motivated', '#success', '#mindset', '#goals', '#hustle', '#inspire', '#achieve', '#grow', '#leadership', '#entrepreneur'],
        category: mode === 'faith' ? 'faith' : 'business',
        isDefault: true,
        createdAt: '2024-01-01',
        usageCount: 45
      },
      {
        id: '2',
        name: mode === 'faith' ? 'Business as Ministry' : 'Business Growth',
        hashtags: mode === 'faith'
          ? ['#businessasministry', '#faithfulentrepreneur', '#kingdombusiness', '#purposedrivenprofit', '#blessedtobless', '#faithandbusiness', '#stewardship', '#godlywealth', '#impactbusiness', '#missionminded']
          : ['#businessgrowth', '#entrepreneur', '#smallbusiness', '#startup', '#marketing', '#sales', '#strategy', '#innovation', '#networking', '#scaling'],
        category: 'business',
        isDefault: true,
        createdAt: '2024-01-01',
        usageCount: 32
      },
      {
        id: '3',
        name: mode === 'faith' ? 'Testimony & Transformation' : 'Personal Growth',
        hashtags: mode === 'faith'
          ? ['#testimony', '#transformed', '#godisgood', '#miraculous', '#breakthrough', '#delivered', '#newcreation', '#godsfaithfulness', '#victorious', '#overcomer']
          : ['#personalgrowth', '#transformation', '#selfimprovement', '#mindfulness', '#wellness', '#progress', '#journey', '#evolve', '#better', '#growth'],
        category: mode === 'faith' ? 'faith' : 'lifestyle',
        isDefault: true,
        createdAt: '2024-01-01',
        usageCount: 28
      }
    ];
    setHashtagGroups(mockGroups);
  };

  const loadSuggestions = () => {
    const mockSuggestions: HashtagSuggestion[] = mode === 'faith' ? [
      { hashtag: '#faithfulcreator', popularity: 'trending', relevance: 95, category: 'Faith' },
      { hashtag: '#kingdomentrepreneur', popularity: 'trending', relevance: 92, category: 'Business' },
      { hashtag: '#godlyinfluencer', popularity: 'popular', relevance: 88, category: 'Faith' },
      { hashtag: '#purposedrivenlife', popularity: 'popular', relevance: 85, category: 'Lifestyle' },
      { hashtag: '#blessedhandsmade', popularity: 'niche', relevance: 82, category: 'Business' }
    ] : [
      { hashtag: '#successmindset', popularity: 'trending', relevance: 95, category: 'Business' },
      { hashtag: '#entrepreneurlife', popularity: 'trending', relevance: 92, category: 'Business' },
      { hashtag: '#motivationalcontent', popularity: 'popular', relevance: 88, category: 'Motivation' },
      { hashtag: '#growthmindset', popularity: 'popular', relevance: 85, category: 'Personal' },
      { hashtag: '#businessowner', popularity: 'niche', relevance: 82, category: 'Business' }
    ];
    setSuggestions(mockSuggestions);
  };

  const createHashtagGroup = () => {
    if (!newGroupName.trim() || !newHashtags.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const hashtags = newHashtags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

    const newGroup: HashtagGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      hashtags,
      category: 'custom',
      isDefault: false,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    setHashtagGroups([...hashtagGroups, newGroup]);
    setNewGroupName('');
    setNewHashtags('');
    setIsCreateModalVisible(false);
  };

  const editHashtagGroup = () => {
    if (!selectedGroup || !newGroupName.trim() || !newHashtags.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const hashtags = newHashtags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

    const updatedGroups = hashtagGroups.map(group =>
      group.id === selectedGroup.id
        ? { ...group, name: newGroupName, hashtags }
        : group
    );

    setHashtagGroups(updatedGroups);
    setSelectedGroup(null);
    setNewGroupName('');
    setNewHashtags('');
    setIsEditModalVisible(false);
  };

  const deleteHashtagGroup = (groupId: string) => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this hashtag group?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHashtagGroups(hashtagGroups.filter(group => group.id !== groupId));
          }
        }
      ]
    );
  };

  const copyHashtagGroup = async (group: HashtagGroup) => {
    const hashtagString = group.hashtags.join(' ');
    Clipboard.setString(hashtagString);
    
    // Update usage count
    const updatedGroups = hashtagGroups.map(g =>
      g.id === group.id ? { ...g, usageCount: g.usageCount + 1 } : g
    );
    setHashtagGroups(updatedGroups);
    
    Alert.alert('Copied!', `${group.hashtags.length} hashtags copied to clipboard`);
  };

  const generateHashtagsFromAI = async (prompt: string) => {
    // Mock AI generation - in real app, this would call your AI service
    const faithBasedTags = ['#faithbased', '#purposedriven', '#blessedwork', '#kingdomimpact', '#godlyentrepreneur'];
    const businessTags = ['#entrepreneurship', '#businessgrowth', '#success', '#innovation', '#leadership'];
    
    const generatedTags = mode === 'faith' ? faithBasedTags : businessTags;
    setNewHashtags(generatedTags.join(', '));
  };

  const openCreateModal = () => {
    setNewGroupName('');
    setNewHashtags('');
    setIsCreateModalVisible(true);
  };

  const openEditModal = (group: HashtagGroup) => {
    setSelectedGroup(group);
    setNewGroupName(group.name);
    setNewHashtags(group.hashtags.join(', '));
    setIsEditModalVisible(true);
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
          color={mode === 'faith' ? KingdomColors.white : KingdomColors.gold.bright} 
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
          color={mode === 'encouragement' ? KingdomColors.white : KingdomColors.gold.bright} 
        />
        <Text style={[styles.modeButtonText, mode === 'encouragement' && styles.activeModeText]}>
          Encouragement Mode
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'my-groups' && styles.activeTab]}
        onPress={() => setActiveTab('my-groups')}
      >
        <Ionicons 
          name="folder" 
          size={20} 
          color={activeTab === 'my-groups' ? KingdomColors.gold.bright : KingdomColors.text.muted} 
        />
        <Text style={[styles.tabText, activeTab === 'my-groups' && styles.activeTabText]}>
          My Groups
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'suggestions' && styles.activeTab]}
        onPress={() => setActiveTab('suggestions')}
      >
        <Ionicons 
          name="bulb" 
          size={20} 
          color={activeTab === 'suggestions' ? KingdomColors.gold.bright : KingdomColors.text.muted} 
        />
        <Text style={[styles.tabText, activeTab === 'suggestions' && styles.activeTabText]}>
          Suggestions
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
        onPress={() => setActiveTab('trending')}
      >
        <Ionicons 
          name="trending-up" 
          size={20} 
          color={activeTab === 'trending' ? KingdomColors.gold.bright : KingdomColors.text.muted} 
        />
        <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText]}>
          Trending
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHashtagGroup = ({ item }: { item: HashtagGroup }) => (
    <View style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{item.name}</Text>
          <Text style={styles.groupMeta}>
            {item.hashtags.length} hashtags • Used {item.usageCount} times
          </Text>
        </View>
        <View style={styles.groupActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => copyHashtagGroup(item)}
          >
            <Ionicons name="copy" size={20} color={KingdomColors.gold.bright} />
          </TouchableOpacity>
          {!item.isDefault && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openEditModal(item)}
              >
                <Ionicons name="pencil" size={20} color={KingdomColors.text.muted} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => deleteHashtagGroup(item.id)}
              >
                <Ionicons name="trash" size={20} color={KingdomColors.accent.error} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.hashtagContainer}>
        {item.hashtags.slice(0, 6).map((hashtag, index) => (
          <View key={index} style={styles.hashtagTag}>
            <Text style={styles.hashtagText}>{hashtag}</Text>
          </View>
        ))}
        {item.hashtags.length > 6 && (
          <View style={styles.hashtagTag}>
            <Text style={styles.hashtagText}>+{item.hashtags.length - 6} more</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderSuggestion = ({ item }: { item: HashtagSuggestion }) => (
    <View style={styles.suggestionCard}>
      <View style={styles.suggestionHeader}>
        <Text style={styles.suggestionHashtag}>{item.hashtag}</Text>
        <View style={[
          styles.popularityBadge,
          {
            backgroundColor: 
              item.popularity === 'trending' ? KingdomColors.accent.success + '20' :
              item.popularity === 'popular' ? KingdomColors.gold.bright + '20' :
              KingdomColors.silver.bright + '20'
          }
        ]}>
          <Text style={[
            styles.popularityText,
            {
              color: 
                item.popularity === 'trending' ? KingdomColors.accent.success :
                item.popularity === 'popular' ? KingdomColors.gold.bright :
                KingdomColors.silver.steel
            }
          ]}>
            {item.popularity}
          </Text>
        </View>
      </View>
      <Text style={styles.suggestionCategory}>{item.category}</Text>
      <View style={styles.relevanceBar}>
        <View style={[styles.relevanceFill, { width: `${item.relevance}%` }]} />
      </View>
      <Text style={styles.relevanceText}>{item.relevance}% relevance</Text>
    </View>
  );

  const renderCreateEditModal = (isEdit: boolean) => (
    <Modal
      visible={isEdit ? isEditModalVisible : isCreateModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => isEdit ? setIsEditModalVisible(false) : setIsCreateModalVisible(false)}
          >
            <Ionicons name="close" size={24} color={KingdomColors.text.inverse} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {isEdit ? 'Edit Hashtag Group' : 'Create Hashtag Group'}
          </Text>
          <TouchableOpacity
            onPress={isEdit ? editHashtagGroup : createHashtagGroup}
            disabled={!newGroupName.trim() || !newHashtags.trim()}
          >
            <Text style={[
              styles.saveButton,
              (!newGroupName.trim() || !newHashtags.trim()) && styles.saveButtonDisabled
            ]}>
              {isEdit ? 'Save' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <Text style={styles.inputLabel}>Group Name</Text>
          <TextInput
            style={styles.textInput}
            value={newGroupName}
            onChangeText={setNewGroupName}
            placeholder="e.g., Faith & Business"
            placeholderTextColor={KingdomColors.text.muted}
          />

          <Text style={styles.inputLabel}>Hashtags (comma separated)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={newHashtags}
            onChangeText={setNewHashtags}
            placeholder="e.g., #faithbased, #entrepreneur, #blessed"
            placeholderTextColor={KingdomColors.text.muted}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={styles.aiGenerateButton}
            onPress={() => generateHashtagsFromAI(newGroupName)}
          >
            <LinearGradient
              colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
              style={styles.aiGenerateGradient}
            >
              <Ionicons name="sparkles" size={20} color={KingdomColors.white} />
              <Text style={styles.aiGenerateText}>Generate with AI</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
        style={styles.header}
      >
        <Text style={styles.title}>Hashtag Manager</Text>
        <Text style={styles.subtitle}>
          {mode === 'faith' 
            ? 'Organize hashtags for faith-based content' 
            : 'Manage hashtags for business growth'
          }
        </Text>
        {renderModeToggle()}
      </LinearGradient>

      {renderTabBar()}

      <View style={styles.content}>
        {activeTab === 'my-groups' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Hashtag Groups</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={openCreateModal}
              >
                <Ionicons name="add" size={24} color={KingdomColors.gold.bright} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={hashtagGroups}
              renderItem={renderHashtagGroup}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}

        {activeTab === 'suggestions' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Suggestions</Text>
              <TouchableOpacity onPress={loadSuggestions}>
                <Ionicons name="refresh" size={24} color={KingdomColors.gold.bright} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={suggestions}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.hashtag}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}

        {activeTab === 'trending' && (
          <View style={styles.comingSoon}>
            <Ionicons name="trending-up" size={64} color={KingdomColors.gold.bright} />
            <Text style={styles.comingSoonTitle}>Trending Hashtags</Text>
            <Text style={styles.comingSoonText}>
              Real-time trending hashtags coming soon!
            </Text>
          </View>
        )}
      </View>

      {renderCreateEditModal(false)}
      {renderCreateEditModal(true)}
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
    color: KingdomColors.text.secondary,
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
    color: KingdomColors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeModeText: {
    color: KingdomColors.white,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: KingdomColors.gold.bright,
  },
  tabText: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginLeft: 8,
    fontWeight: '500',
  },
  activeTabText: {
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KingdomColors.gold.bright + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingBottom: 100,
  },
  groupCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginBottom: 4,
  },
  groupMeta: {
    fontSize: 14,
    color: KingdomColors.text.muted,
  },
  groupActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtagTag: {
    backgroundColor: KingdomColors.gold.bright + '20',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  hashtagText: {
    fontSize: 12,
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
  suggestionCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionHashtag: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
  popularityBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  popularityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  suggestionCategory: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginBottom: 8,
  },
  relevanceBar: {
    height: 4,
    backgroundColor: KingdomColors.silver.light,
    borderRadius: 2,
    marginBottom: 4,
  },
  relevanceFill: {
    height: '100%',
    backgroundColor: KingdomColors.gold.bright,
    borderRadius: 2,
  },
  relevanceText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    textAlign: 'right',
  },
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginTop: 20,
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 16,
    color: KingdomColors.text.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: KingdomColors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
  },
  saveButtonDisabled: {
    color: KingdomColors.text.muted,
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: KingdomColors.text.inverse,
    borderWidth: 2,
    borderColor: KingdomColors.silver.light,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  aiGenerateButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
  },
  aiGenerateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  aiGenerateText: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default React.memo(HashtagManagerScreen);
