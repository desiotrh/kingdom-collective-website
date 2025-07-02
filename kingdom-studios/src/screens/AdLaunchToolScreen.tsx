import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Switch,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KingdomColors } from '../constants/KingdomColors';
import { useDualMode } from '../contexts/DualModeContext';

interface AdCampaign {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
  objective: 'traffic' | 'conversions' | 'awareness' | 'engagement';
  budget: number;
  duration: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  targetAudience: {
    ageMin: number;
    ageMax: number;
    interests: string[];
    locations: string[];
    gender: 'all' | 'male' | 'female';
  };
  createdAt: Date;
  performance?: {
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    spent: number;
  };
}

const AdLaunchToolScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    {
      id: '1',
      name: 'Faith-Based Course Launch',
      platform: 'facebook',
      objective: 'conversions',
      budget: 50,
      duration: 7,
      status: 'active',
      targetAudience: {
        ageMin: 25,
        ageMax: 55,
        interests: ['Christianity', 'Personal Development', 'Online Learning'],
        locations: ['United States', 'Canada'],
        gender: 'all',
      },
      createdAt: new Date(),
      performance: {
        impressions: 12500,
        clicks: 342,
        ctr: 2.74,
        cpc: 0.87,
        spent: 42.30,
      },
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<AdCampaign>>({
    name: '',
    platform: 'facebook',
    objective: 'conversions',
    budget: 25,
    duration: 7,
    targetAudience: {
      ageMin: 18,
      ageMax: 65,
      interests: [],
      locations: ['United States'],
      gender: 'all',
    },
  });

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: '#FF0000' },
  ];

  const objectives = [
    { id: 'traffic', name: 'Drive Traffic', description: 'Send people to your website or landing page' },
    { id: 'conversions', name: 'Conversions', description: 'Get people to take action on your website' },
    { id: 'awareness', name: 'Brand Awareness', description: 'Increase recognition of your brand' },
    { id: 'engagement', name: 'Engagement', description: 'Get more likes, comments, and shares' },
  ];

  const faithModePrompts = [
    "🙏 Let God guide your advertising strategy",
    "✨ Share your faith-based content with those who need it most",
    "💝 Use your platform to bless others through targeted outreach",
    "🌟 Trust in God's timing for your campaign success",
  ];

  const encouragementModePrompts = [
    "🚀 Launch your message to inspire and uplift others",
    "💪 Your content has the power to encourage someone today",
    "🌈 Spread positivity through strategic advertising",
    "✨ Reach those who need your encouraging message most",
  ];

  const getCurrentPrompt = () => {
    const prompts = currentMode === 'faith' ? faithModePrompts : encouragementModePrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const createCampaign = useCallback(() => {
    if (!newCampaign.name?.trim()) {
      Alert.alert('Error', 'Please enter a campaign name');
      return;
    }

    const campaign: AdCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      platform: newCampaign.platform!,
      objective: newCampaign.objective!,
      budget: newCampaign.budget!,
      duration: newCampaign.duration!,
      status: 'draft',
      targetAudience: newCampaign.targetAudience!,
      createdAt: new Date(),
    };

    setCampaigns(prev => [...prev, campaign]);
    setShowCreateModal(false);
    setNewCampaign({
      name: '',
      platform: 'facebook',
      objective: 'conversions',
      budget: 25,
      duration: 7,
      targetAudience: {
        ageMin: 18,
        ageMax: 65,
        interests: [],
        locations: ['United States'],
        gender: 'all',
      },
    });

    Alert.alert(
      'Campaign Created',
      'Your ad campaign has been created as a draft. Review and launch when ready!'
    );
  }, [newCampaign]);

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        return { ...campaign, status: newStatus };
      }
      return campaign;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'paused': return '#FF9800';
      case 'draft': return '#9E9E9E';
      case 'completed': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const renderCampaign = ({ item }: { item: AdCampaign }) => {
    const platform = platforms.find(p => p.id === item.platform);
    
    return (
      <View style={[styles.campaignCard, { backgroundColor: colors.surface }]}>
        <View style={styles.campaignHeader}>
          <View style={styles.campaignInfo}>
            <View style={styles.campaignTitleRow}>
              <Text style={[styles.campaignName, { color: colors.text }]}>
                {item.name}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.campaignMeta}>
              <Text style={[styles.platformText, { color: platform?.color }]}>
                {platform?.icon} {platform?.name}
              </Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                ${item.budget}/day • {item.duration} days
              </Text>
            </View>
          </View>
          <Switch
            value={item.status === 'active'}
            onValueChange={() => toggleCampaignStatus(item.id)}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor={item.status === 'active' ? '#fff' : '#f4f3f4'}
          />
        </View>

        {item.performance && (
          <View style={styles.performanceSection}>
            <Text style={[styles.performanceTitle, { color: colors.text }]}>
              Performance
            </Text>
            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: colors.text }]}>
                  {item.performance.impressions.toLocaleString()}
                </Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                  Impressions
                </Text>
              </View>
              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: colors.text }]}>
                  {item.performance.clicks}
                </Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                  Clicks
                </Text>
              </View>
              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: colors.text }]}>
                  {item.performance.ctr}%
                </Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                  CTR
                </Text>
              </View>
              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: colors.text }]}>
                  ${item.performance.spent}
                </Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                  Spent
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Ad Launch Tool
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Active Campaigns
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.accent }]}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.createButtonText}>+ Create Campaign</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={campaigns}
            renderItem={renderCampaign}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.campaignsList}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Start Tips
          </Text>
          <View style={[styles.tipsCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.tipText, { color: colors.text }]}>
              💡 Start with a small budget ($5-25/day) to test your audience
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              🎯 Use specific interests related to your niche for better targeting
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              📊 Monitor your campaigns daily and adjust based on performance
            </Text>
            <Text style={[styles.tipText, { color: colors.text }]}>
              🖼️ Use high-quality images or videos that reflect your brand
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Create Campaign Modal */}
      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
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
                Campaign Name
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
                value={newCampaign.name}
                onChangeText={(text) => setNewCampaign(prev => ({ ...prev, name: text }))}
                placeholder="Enter campaign name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Platform
              </Text>
              <View style={styles.platformGrid}>
                {platforms.map(platform => (
                  <TouchableOpacity
                    key={platform.id}
                    style={[
                      styles.platformOption,
                      { 
                        backgroundColor: newCampaign.platform === platform.id 
                          ? platform.color 
                          : colors.surface,
                        borderColor: platform.color,
                      }
                    ]}
                    onPress={() => setNewCampaign(prev => ({ ...prev, platform: platform.id as any }))}
                  >
                    <Text style={styles.platformIcon}>{platform.icon}</Text>
                    <Text style={[
                      styles.platformName,
                      { 
                        color: newCampaign.platform === platform.id 
                          ? '#fff' 
                          : colors.text 
                      }
                    ]}>
                      {platform.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Campaign Objective
              </Text>
              {objectives.map(objective => (
                <TouchableOpacity
                  key={objective.id}
                  style={[
                    styles.objectiveOption,
                    { 
                      backgroundColor: newCampaign.objective === objective.id 
                        ? colors.accent + '20' 
                        : colors.surface,
                      borderColor: newCampaign.objective === objective.id 
                        ? colors.accent 
                        : colors.border,
                    }
                  ]}
                  onPress={() => setNewCampaign(prev => ({ ...prev, objective: objective.id as any }))}
                >
                  <Text style={[styles.objectiveName, { color: colors.text }]}>
                    {objective.name}
                  </Text>
                  <Text style={[styles.objectiveDescription, { color: colors.textSecondary }]}>
                    {objective.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formSection, { flex: 1, marginRight: 10 }]}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  Daily Budget ($)
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  }]}
                  value={newCampaign.budget?.toString()}
                  onChangeText={(text) => setNewCampaign(prev => ({ 
                    ...prev, 
                    budget: parseInt(text) || 0 
                  }))}
                  placeholder="25"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={[styles.formSection, { flex: 1, marginLeft: 10 }]}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  Duration (days)
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  }]}
                  value={newCampaign.duration?.toString()}
                  onChangeText={(text) => setNewCampaign(prev => ({ 
                    ...prev, 
                    duration: parseInt(text) || 1 
                  }))}
                  placeholder="7"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={[styles.disclaimerCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.disclaimerTitle, { color: colors.text }]}>
                📋 Before Launching
              </Text>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                • Ensure your ad creative complies with platform guidelines{'\n'}
                • Set up proper tracking and conversion pixels{'\n'}
                • Test your landing page thoroughly{'\n'}
                • Review your targeting to avoid overspending
              </Text>
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
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  section: {
    marginBottom: 24,
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
  campaignsList: {
    gap: 12,
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
  campaignTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  campaignName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
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
  campaignMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  platformText: {
    fontSize: 14,
    fontWeight: '600',
  },
  metaText: {
    fontSize: 12,
  },
  performanceSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  tipsCard: {
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
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
  formRow: {
    flexDirection: 'row',
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
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  platformOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  platformIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '600',
  },
  objectiveOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 8,
  },
  objectiveName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  objectiveDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  disclaimerCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AdLaunchToolScreen;
