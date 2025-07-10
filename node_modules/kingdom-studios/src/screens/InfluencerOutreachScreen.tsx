import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

interface Influencer {
  id: string;
  name: string;
  username: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter';
  profileImage: string;
  followers: number;
  engagement: number;
  niche: string[];
  location: string;
  averageViews: number;
  contactEmail?: string;
  rate?: number;
  lastPosted: string;
  verifiedPartner: boolean;
  faithBased?: boolean;
  collaborationHistory: number;
  responseRate: number;
}

interface OutreachCampaign {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'paused' | 'completed';
  influencersContacted: number;
  responses: number;
  collaborations: number;
  createdAt: Date;
}

interface OutreachMessage {
  id: string;
  influencerId: string;
  campaignId: string;
  subject: string;
  message: string;
  sentAt: Date;
  status: 'sent' | 'opened' | 'replied' | 'declined' | 'interested';
  response?: string;
  followUpCount: number;
}

const InfluencerOutreachScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  
  const [activeTab, setActiveTab] = useState<'discover' | 'campaigns' | 'messages' | 'analytics'>('discover');
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [campaigns, setCampaigns] = useState<OutreachCampaign[]>([]);
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  
  const [outreachForm, setOutreachForm] = useState({
    subject: '',
    message: '',
    campaignId: '',
  });

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    targetAudience: '',
    budget: 1000,
  });

  const niches = [
    'all', 'faith', 'lifestyle', 'business', 'fitness', 'beauty', 
    'technology', 'food', 'travel', 'fashion', 'parenting', 'education'
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: '#FF0000' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
  ];

  useEffect(() => {
    loadInfluencers();
    loadCampaigns();
    loadMessages();
  }, [currentMode]);

  const loadInfluencers = () => {
    // Mock data - in real app, this would come from influencer databases/APIs
    const mockInfluencers: Influencer[] = currentMode === 'faith' ? [
      {
        id: '1',
        name: 'Sarah Grace',
        username: '@sarahgraceministries',
        platform: 'instagram',
        profileImage: 'https://example.com/sarah.jpg',
        followers: 85000,
        engagement: 4.2,
        niche: ['faith', 'lifestyle', 'family'],
        location: 'Nashville, TN',
        averageViews: 12000,
        contactEmail: 'hello@sarahgraceministries.com',
        rate: 350,
        lastPosted: '2024-07-02',
        verifiedPartner: true,
        faithBased: true,
        collaborationHistory: 12,
        responseRate: 85,
      },
      {
        id: '2',
        name: 'Pastor Mike Johnson',
        username: '@pastormikej',
        platform: 'youtube',
        profileImage: 'https://example.com/mike.jpg',
        followers: 156000,
        engagement: 6.8,
        niche: ['faith', 'education', 'leadership'],
        location: 'Dallas, TX',
        averageViews: 45000,
        contactEmail: 'info@pastormikej.com',
        rate: 800,
        lastPosted: '2024-07-01',
        verifiedPartner: true,
        faithBased: true,
        collaborationHistory: 8,
        responseRate: 92,
      },
      {
        id: '3',
        name: 'Kingdom Entrepreneurs',
        username: '@kingdomentrepreneurs',
        platform: 'linkedin',
        profileImage: 'https://example.com/kingdom.jpg',
        followers: 45000,
        engagement: 3.5,
        niche: ['faith', 'business', 'entrepreneurship'],
        location: 'Online',
        averageViews: 8500,
        contactEmail: 'partnerships@kingdomentrepreneurs.com',
        rate: 275,
        lastPosted: '2024-07-02',
        verifiedPartner: false,
        faithBased: true,
        collaborationHistory: 5,
        responseRate: 68,
      },
    ] : [
      {
        id: '1',
        name: 'Emma Rodriguez',
        username: '@emmalifestyle',
        platform: 'instagram',
        profileImage: 'https://example.com/emma.jpg',
        followers: 120000,
        engagement: 5.1,
        niche: ['lifestyle', 'fashion', 'beauty'],
        location: 'Los Angeles, CA',
        averageViews: 18000,
        contactEmail: 'collabs@emmalifestyle.com',
        rate: 450,
        lastPosted: '2024-07-02',
        verifiedPartner: true,
        faithBased: false,
        collaborationHistory: 24,
        responseRate: 78,
      },
      {
        id: '2',
        name: 'Tech Review Central',
        username: '@techreviewcentral',
        platform: 'youtube',
        profileImage: 'https://example.com/tech.jpg',
        followers: 280000,
        engagement: 4.7,
        niche: ['technology', 'business', 'reviews'],
        location: 'San Francisco, CA',
        averageViews: 65000,
        contactEmail: 'business@techreviewcentral.com',
        rate: 1200,
        lastPosted: '2024-07-01',
        verifiedPartner: true,
        faithBased: false,
        collaborationHistory: 18,
        responseRate: 85,
      },
    ];

    setInfluencers(mockInfluencers);
  };

  const loadCampaigns = () => {
    // Mock data - in real app, this would come from Firebase/API
    const mockCampaigns: OutreachCampaign[] = currentMode === 'faith' ? [
      {
        id: '1',
        name: 'Kingdom Academy Launch',
        description: 'Faith-based online course promotion',
        targetAudience: 'Christian entrepreneurs and ministry leaders',
        budget: 5000,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-31'),
        status: 'active',
        influencersContacted: 12,
        responses: 8,
        collaborations: 5,
        createdAt: new Date('2024-06-15'),
      },
    ] : [
      {
        id: '1',
        name: 'Digital Creator Tools',
        description: 'Promoting new creator toolkit app',
        targetAudience: 'Content creators and social media influencers',
        budget: 8000,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-08-15'),
        status: 'active',
        influencersContacted: 25,
        responses: 18,
        collaborations: 12,
        createdAt: new Date('2024-06-20'),
      },
    ];

    setCampaigns(mockCampaigns);
  };

  const loadMessages = () => {
    // Mock data for outreach messages
    const mockMessages: OutreachMessage[] = [
      {
        id: '1',
        influencerId: '1',
        campaignId: '1',
        subject: currentMode === 'faith' ? 'Kingdom Partnership Opportunity' : 'Creator Collaboration Opportunity',
        message: 'Hi! We\'d love to collaborate on an exciting project...',
        sentAt: new Date('2024-07-01'),
        status: 'replied',
        response: 'This sounds amazing! I\'d love to learn more about the details.',
        followUpCount: 1,
      },
    ];

    setMessages(mockMessages);
  };

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "🤝 Build Kingdom partnerships that honor God",
      "✨ Connect with faith-driven influencers for His glory",
      "💝 Create collaborations that spread God's love",
      "🌟 Unite with others to amplify the Gospel message",
    ];

    const encouragementPrompts = [
      "🚀 Build powerful partnerships that amplify your reach",
      "💪 Connect with influencers who align with your values",
      "🌈 Create collaborations that inspire and motivate",
      "✨ Expand your network with meaningful relationships",
    ];

    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getPlatformColor = (platform: string) => {
    const platformData = platforms.find(p => p.id === platform);
    return platformData?.color || colors.accent;
  };

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         influencer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         influencer.niche.some(n => n.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesNiche = selectedNiche === 'all' || influencer.niche.includes(selectedNiche);
    return matchesSearch && matchesNiche;
  });

  const sendOutreach = () => {
    if (!selectedInfluencer || !outreachForm.subject.trim() || !outreachForm.message.trim()) {
      Alert.alert('Error', 'Please complete all fields');
      return;
    }

    const message: OutreachMessage = {
      id: Date.now().toString(),
      influencerId: selectedInfluencer.id,
      campaignId: outreachForm.campaignId || '1',
      subject: outreachForm.subject,
      message: outreachForm.message,
      sentAt: new Date(),
      status: 'sent',
      followUpCount: 0,
    };

    setMessages(prev => [...prev, message]);
    setShowOutreachModal(false);
    setOutreachForm({ subject: '', message: '', campaignId: '' });
    setSelectedInfluencer(null);

    Alert.alert(
      'Message Sent!',
      currentMode === 'faith' 
        ? 'Your Kingdom partnership message has been sent with blessings!'
        : 'Your collaboration message has been sent successfully!'
    );
  };

  const createCampaign = () => {
    if (!newCampaign.name.trim() || !newCampaign.description.trim()) {
      Alert.alert('Error', 'Please complete all required fields');
      return;
    }

    const campaign: OutreachCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      description: newCampaign.description,
      targetAudience: newCampaign.targetAudience,
      budget: newCampaign.budget,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'draft',
      influencersContacted: 0,
      responses: 0,
      collaborations: 0,
      createdAt: new Date(),
    };

    setCampaigns(prev => [...prev, campaign]);
    setShowCampaignModal(false);
    setNewCampaign({ name: '', description: '', targetAudience: '', budget: 1000 });

    Alert.alert('Campaign Created!', 'Your outreach campaign is ready to launch!');
  };

  const renderInfluencer = ({ item }: { item: Influencer }) => (
    <View style={[styles.influencerCard, { backgroundColor: colors.surface }]}>
      <View style={styles.influencerHeader}>
        <Image 
          source={{ uri: item.profileImage }} 
          style={styles.profileImage}
          defaultSource={{ uri: 'https://via.placeholder.com/60' }}
        />
        <View style={styles.influencerInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.influencerName, { color: colors.text }]}>
              {item.name}
            </Text>
            {item.verifiedPartner && (
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            )}
            {item.faithBased && currentMode === 'faith' && (
              <Text style={styles.faithBadge}>✝️</Text>
            )}
          </View>
          <Text style={[styles.username, { color: colors.textSecondary }]}>
            {item.username}
          </Text>
          <View style={styles.platformBadge}>
            <Text style={[styles.platformText, { color: getPlatformColor(item.platform) }]}>
              {platforms.find(p => p.id === item.platform)?.icon} {item.platform.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.influencerStats}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {formatNumber(item.followers)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Followers
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.engagement}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Engagement
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.responseRate}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Response
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            ${item.rate || 'TBD'}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Rate
          </Text>
        </View>
      </View>

      <View style={styles.nicheContainer}>
        {item.niche.slice(0, 3).map((niche, index) => (
          <View key={index} style={[styles.nicheTag, { backgroundColor: colors.accent + '20' }]}>
            <Text style={[styles.nicheText, { color: colors.accent }]}>
              {niche}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.influencerActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton, { borderColor: colors.accent }]}
          onPress={() => {
            Alert.alert('Profile Details', `View ${item.name}'s full profile and analytics`);
          }}
        >
          <Text style={[styles.actionButtonText, { color: colors.accent }]}>
            View Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.contactButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            setSelectedInfluencer(item);
            setOutreachForm(prev => ({
              ...prev,
              subject: currentMode === 'faith' 
                ? `Kingdom Partnership with ${item.name}` 
                : `Collaboration Opportunity with ${item.name}`,
            }));
            setShowOutreachModal(true);
          }}
        >
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCampaign = ({ item }: { item: OutreachCampaign }) => (
    <View style={[styles.campaignCard, { backgroundColor: colors.surface }]}>
      <View style={styles.campaignHeader}>
        <View style={styles.campaignInfo}>
          <Text style={[styles.campaignName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.campaignDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
          <Text style={[styles.campaignBudget, { color: colors.accent }]}>
            Budget: ${item.budget.toLocaleString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.campaignStats}>
        <View style={styles.campaignStat}>
          <Text style={[styles.campaignStatValue, { color: colors.text }]}>
            {item.influencersContacted}
          </Text>
          <Text style={[styles.campaignStatLabel, { color: colors.textSecondary }]}>
            Contacted
          </Text>
        </View>
        <View style={styles.campaignStat}>
          <Text style={[styles.campaignStatValue, { color: colors.text }]}>
            {item.responses}
          </Text>
          <Text style={[styles.campaignStatLabel, { color: colors.textSecondary }]}>
            Responses
          </Text>
        </View>
        <View style={styles.campaignStat}>
          <Text style={[styles.campaignStatValue, { color: colors.text }]}>
            {item.collaborations}
          </Text>
          <Text style={[styles.campaignStatLabel, { color: colors.textSecondary }]}>
            Active
          </Text>
        </View>
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'paused': return colors.warning;
      case 'completed': return colors.info;
      case 'draft': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case 'replied': return colors.success;
      case 'interested': return colors.success;
      case 'opened': return colors.warning;
      case 'declined': return colors.error;
      case 'sent': return colors.info;
      default: return colors.textSecondary;
    }
  };

  const renderMessage = ({ item }: { item: OutreachMessage }) => {
    const influencer = influencers.find(inf => inf.id === item.influencerId);
    
    return (
      <View style={[styles.messageCard, { backgroundColor: colors.surface }]}>
        <View style={styles.messageHeader}>
          <View style={styles.messageInfo}>
            <Text style={[styles.messageSubject, { color: colors.text }]}>
              {item.subject}
            </Text>
            <Text style={[styles.messageInfluencer, { color: colors.textSecondary }]}>
              To: {influencer?.name || 'Unknown'}
            </Text>
            <Text style={[styles.messageDate, { color: colors.textSecondary }]}>
              {item.sentAt.toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.messageStatusBadge, { backgroundColor: getMessageStatusColor(item.status) }]}>
            <Text style={styles.messageStatusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        
        {item.response && (
          <View style={[styles.responseContainer, { backgroundColor: colors.background }]}>
            <Text style={[styles.responseLabel, { color: colors.textSecondary }]}>
              Response:
            </Text>
            <Text style={[styles.responseText, { color: colors.text }]}>
              {item.response}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discover':
        return (
          <View>
            <View style={styles.filtersContainer}>
              <TextInput
                style={[styles.searchInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                placeholder="Search influencers..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.nicheFilters}>
                {niches.map(niche => (
                  <TouchableOpacity
                    key={niche}
                    style={[
                      styles.nicheFilter,
                      { 
                        backgroundColor: selectedNiche === niche ? colors.accent : colors.surface,
                        borderColor: colors.border,
                      }
                    ]}
                    onPress={() => setSelectedNiche(niche)}
                  >
                    <Text style={[
                      styles.nicheFilterText,
                      { color: selectedNiche === niche ? '#fff' : colors.text }
                    ]}>
                      {niche.charAt(0).toUpperCase() + niche.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <FlatList
              data={filteredInfluencers}
              renderItem={renderInfluencer}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.influencersList}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>🔍</Text>
                  <Text style={[styles.emptyStateText, { color: colors.text }]}>
                    No influencers found
                  </Text>
                  <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                    Try adjusting your search criteria
                  </Text>
                </View>
              }
            />
          </View>
        );

      case 'campaigns':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Outreach Campaigns
              </Text>
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: colors.accent }]}
                onPress={() => setShowCampaignModal(true)}
              >
                <Text style={styles.createButtonText}>+ Create</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={campaigns}
              renderItem={renderCampaign}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.campaignsList}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>📋</Text>
                  <Text style={[styles.emptyStateText, { color: colors.text }]}>
                    No campaigns yet
                  </Text>
                  <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                    Create your first outreach campaign!
                  </Text>
                </View>
              }
            />
          </View>
        );

      case 'messages':
        return (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📨</Text>
                <Text style={[styles.emptyStateText, { color: colors.text }]}>
                  No messages yet
                </Text>
                <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                  Start reaching out to influencers!
                </Text>
              </View>
            }
          />
        );

      case 'analytics':
        return (
          <View style={styles.analyticsContainer}>
            <Text style={[styles.comingSoonText, { color: colors.textSecondary }]}>
              Advanced analytics coming soon!{'\n\n'}
              You'll be able to track:{'\n'}
              • Campaign performance metrics{'\n'}
              • Response rates by platform{'\n'}
              • ROI and conversion tracking{'\n'}
              • Influencer performance scores{'\n'}
              • Cost per engagement analysis
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {currentMode === 'faith' ? 'Kingdom Partnerships' : 'Influencer Outreach'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['discover', 'campaigns', 'messages', 'analytics'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && [styles.activeTab, { backgroundColor: colors.accent }]
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab ? styles.activeTabText : { color: colors.textSecondary }
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      {/* Outreach Modal */}
      <Modal visible={showOutreachModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowOutreachModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Send Message
            </Text>
            <TouchableOpacity onPress={sendOutreach}>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Send
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Subject *
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={outreachForm.subject}
                onChangeText={(text) => setOutreachForm(prev => ({ ...prev, subject: text }))}
                placeholder="Enter subject line"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Message *
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={outreachForm.message}
                onChangeText={(text) => setOutreachForm(prev => ({ ...prev, message: text }))}
                placeholder={currentMode === 'faith' 
                  ? "Hi [Name],\n\nI hope this message finds you blessed! I'm reaching out about a potential Kingdom partnership that aligns with your ministry..."
                  : "Hi [Name],\n\nI hope you're doing well! I'm reaching out about an exciting collaboration opportunity that I think would be perfect for your audience..."
                }
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={8}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Campaign Modal */}
      <Modal visible={showCampaignModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCampaignModal(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create Campaign
            </Text>
            <TouchableOpacity onPress={createCampaign}>
              <Text style={[styles.saveText, { color: colors.accent }]}>
                Create
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Campaign Name *
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newCampaign.name}
                onChangeText={(text) => setNewCampaign(prev => ({ ...prev, name: text }))}
                placeholder={currentMode === 'faith' ? "Kingdom Product Launch" : "Creator Tool Promotion"}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Description *
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newCampaign.description}
                onChangeText={(text) => setNewCampaign(prev => ({ ...prev, description: text }))}
                placeholder="Describe your campaign goals and objectives"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Target Audience
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newCampaign.targetAudience}
                onChangeText={(text) => setNewCampaign(prev => ({ ...prev, targetAudience: text }))}
                placeholder="Who do you want to reach?"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Budget ($)
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newCampaign.budget.toString()}
                onChangeText={(text) => setNewCampaign(prev => ({ ...prev, budget: parseInt(text) || 0 }))}
                placeholder="1000"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeTab: {
    // backgroundColor applied dynamically
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  nicheFilters: {
    flexDirection: 'row',
  },
  nicheFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  nicheFilterText: {
    fontSize: 12,
    fontWeight: '600',
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
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  influencersList: {
    gap: 16,
  },
  influencerCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  influencerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  influencerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  influencerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  faithBadge: {
    fontSize: 14,
    marginLeft: 4,
  },
  username: {
    fontSize: 14,
    marginBottom: 4,
  },
  platformBadge: {
    alignSelf: 'flex-start',
  },
  platformText: {
    fontSize: 12,
    fontWeight: '600',
  },
  influencerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  nicheContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  nicheTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nicheText: {
    fontSize: 11,
    fontWeight: '600',
  },
  influencerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButton: {
    borderWidth: 1,
  },
  contactButton: {
    // backgroundColor applied dynamically
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  campaignsList: {
    gap: 16,
  },
  campaignCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  campaignDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  campaignBudget: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  campaignStat: {
    alignItems: 'center',
  },
  campaignStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  campaignStatLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  messagesList: {
    gap: 16,
  },
  messageCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  messageInfo: {
    flex: 1,
  },
  messageSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageInfluencer: {
    fontSize: 14,
    marginBottom: 2,
  },
  messageDate: {
    fontSize: 12,
  },
  messageStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  messageStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  responseContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20,
  },
  analyticsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 16,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  comingSoonText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    lineHeight: 24,
  },
});

export default React.memo(InfluencerOutreachScreen);
