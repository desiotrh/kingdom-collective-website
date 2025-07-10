/**
 * Email Marketing Management Screen
 * Complete email marketing hub for managing subscribers, campaigns, and templates
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useEmailMarketing } from '../hooks/useEmailMarketing';
import { EmailTemplate, EmailCampaign } from '../services/emailMarketingService';

const { width } = Dimensions.get('window');

const EmailMarketingManagementScreen: React.FC = () => {
  const {
    subscribers,
    templates,
    campaigns,
    automations,
    analytics,
    addSubscriber,
    createTemplate,
    createCampaign,
    sendCampaign,
    isLoading,
    isCreating,
    isSending,
    error,
    refreshData
  } = useEmailMarketing();

  // Modal states
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);

  // Form states
  const [subscriberForm, setSubscriberForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    source: 'manual',
    tags: [] as string[]
  });

  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    category: 'newsletter' as const,
    htmlContent: '',
    textContent: '',
    isActive: true
  });

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    subject: '',
    content: {
      html: '',
      text: ''
    },
    recipients: {
      type: 'all' as const,
      count: 0
    }
  });

  // Handle Add Subscriber
  const handleAddSubscriber = async () => {
    if (!subscriberForm.email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    try {
      await addSubscriber({
        email: subscriberForm.email,
        firstName: subscriberForm.firstName,
        lastName: subscriberForm.lastName,
        source: subscriberForm.source,
        tags: subscriberForm.tags,
        customFields: {}
      });

      setSubscriberForm({
        email: '',
        firstName: '',
        lastName: '',
        source: 'manual',
        tags: []
      });
      setShowAddSubscriberModal(false);
      Alert.alert('Success', 'Subscriber added successfully!');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to add subscriber');
    }
  };

  // Handle Create Template
  const handleCreateTemplate = async () => {
    if (!templateForm.name.trim() || !templateForm.subject.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await createTemplate({
        name: templateForm.name,
        subject: templateForm.subject,
        category: templateForm.category,
        htmlContent: templateForm.htmlContent,
        textContent: templateForm.textContent,
        isActive: templateForm.isActive,
        variables: []
      });

      setTemplateForm({
        name: '',
        subject: '',
        category: 'newsletter',
        htmlContent: '',
        textContent: '',
        isActive: true
      });
      setShowCreateTemplateModal(false);
      Alert.alert('Success', 'Template created successfully!');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create template');
    }
  };

  // Handle Create Campaign
  const handleCreateCampaign = async () => {
    if (!campaignForm.name.trim() || !campaignForm.subject.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await createCampaign({
        name: campaignForm.name,
        subject: campaignForm.subject,
        content: campaignForm.content,
        recipients: campaignForm.recipients,
        status: 'draft'
      });

      setCampaignForm({
        name: '',
        subject: '',
        content: {
          html: '',
          text: ''
        },
        recipients: {
          type: 'all',
          count: 0
        }
      });
      setShowCreateCampaignModal(false);
      Alert.alert('Success', 'Campaign created successfully!');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create campaign');
    }
  };

  // Handle Send Campaign
  const handleSendCampaign = async (campaignId: string, campaignName: string) => {
    Alert.alert(
      'Send Campaign',
      `Are you sure you want to send "${campaignName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          style: 'default',
          onPress: async () => {
            const success = await sendCampaign(campaignId);
            if (success) {
              Alert.alert('Success', 'Campaign sent successfully!');
            } else {
              Alert.alert('Error', 'Failed to send campaign');
            }
          }
        }
      ]
    );
  };

  const renderStatsCard = (title: string, value: string | number, subtitle?: string, color: string = '#3b82f6') => (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={styles.statsValue}>{value}</Text>
      {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderTemplateCard = (template: EmailTemplate) => (
    <View key={template.id} style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{template.name}</Text>
          <Text style={styles.itemSubtitle}>{template.subject}</Text>
          <View style={styles.itemMeta}>
            <Text style={styles.categoryTag}>{template.category}</Text>
            <Text style={styles.dateText}>
              {template.updatedAt.toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: template.isActive ? '#10B981' : '#6B7280' }
        ]} />
      </View>
    </View>
  );

  const renderCampaignCard = (campaign: EmailCampaign) => (
    <View key={campaign.id} style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{campaign.name}</Text>
          <Text style={styles.itemSubtitle}>{campaign.subject}</Text>
          <View style={styles.itemMeta}>
            <Text style={[styles.statusTag, { backgroundColor: getStatusColor(campaign.status) }]}>
              {campaign.status}
            </Text>
            <Text style={styles.dateText}>
              {campaign.createdAt.toLocaleDateString()}
            </Text>
          </View>
          {campaign.status === 'sent' && (
            <View style={styles.campaignStats}>
              <Text style={styles.statText}>Sent: {campaign.stats.sent}</Text>
              <Text style={styles.statText}>Opened: {campaign.stats.opened}</Text>
              <Text style={styles.statText}>Clicked: {campaign.stats.clicked}</Text>
            </View>
          )}
        </View>
        {campaign.status === 'draft' && (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => handleSendCampaign(campaign.id, campaign.name)}
            disabled={isSending}
          >
            <Text style={styles.sendButtonText}>
              {isSending ? 'Sending...' : 'Send'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'draft': return '#6B7280';
      case 'scheduled': return '#F59E0B';
      case 'sending': return '#3B82F6';
      case 'sent': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.title}>Email Marketing Hub</Text>
        <Text style={styles.subtitle}>
          Grow your audience and engage your community
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Analytics Overview */}
        {analytics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              {renderStatsCard('Total Subscribers', analytics.totalSubscribers, 'All time', '#10B981')}
              {renderStatsCard('Active Subscribers', analytics.activeSubscribers, 'Engaged', '#3B82F6')}
              {renderStatsCard('Total Campaigns', analytics.totalCampaigns, 'Created', '#F59E0B')}
              {renderStatsCard('Avg Open Rate', `${analytics.averageOpenRate.toFixed(1)}%`, 'Performance', '#8B5CF6')}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => setShowAddSubscriberModal(true)}
            >
              <Text style={styles.quickActionIcon}>👥</Text>
              <Text style={styles.quickActionText}>Add Subscriber</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => setShowCreateTemplateModal(true)}
            >
              <Text style={styles.quickActionIcon}>📝</Text>
              <Text style={styles.quickActionText}>Create Template</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => setShowCreateCampaignModal(true)}
            >
              <Text style={styles.quickActionIcon}>📧</Text>
              <Text style={styles.quickActionText}>New Campaign</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={refreshData}
            >
              <Text style={styles.quickActionIcon}>🔄</Text>
              <Text style={styles.quickActionText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Campaigns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recent Campaigns ({campaigns.length})
          </Text>
          {campaigns.length === 0 ? (
            <Text style={styles.emptyText}>
              No campaigns yet. Create your first campaign to get started!
            </Text>
          ) : (
            <View style={styles.itemsList}>
              {campaigns.slice(0, 5).map(renderCampaignCard)}
            </View>
          )}
        </View>

        {/* Email Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Email Templates ({templates.length})
          </Text>
          {templates.length === 0 ? (
            <Text style={styles.emptyText}>
              No templates yet. Create templates to speed up your campaigns!
            </Text>
          ) : (
            <View style={styles.itemsList}>
              {templates.slice(0, 5).map(renderTemplateCard)}
            </View>
          )}
        </View>

        {/* Subscriber Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Subscriber Statistics
          </Text>
          <View style={styles.subscriberStats}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Active Subscribers:</Text>
              <Text style={styles.statValue}>{subscribers.filter(s => s.status === 'active').length}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Unsubscribed:</Text>
              <Text style={styles.statValue}>{subscribers.filter(s => s.status === 'unsubscribed').length}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Growth Rate:</Text>
              <Text style={[styles.statValue, { color: analytics?.growthRate && analytics.growthRate > 0 ? '#10B981' : '#EF4444' }]}>
                {analytics?.growthRate ? `${analytics.growthRate.toFixed(1)}%` : '0%'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Subscriber Modal */}
      <Modal
        visible={showAddSubscriberModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddSubscriberModal(false)}
      >
        <BlurView intensity={50} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Subscriber</Text>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Email Address *</Text>
              <TextInput
                style={styles.textInput}
                value={subscriberForm.email}
                onChangeText={(text) => setSubscriberForm(prev => ({ ...prev, email: text }))}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>First Name</Text>
              <TextInput
                style={styles.textInput}
                value={subscriberForm.firstName}
                onChangeText={(text) => setSubscriberForm(prev => ({ ...prev, firstName: text }))}
                placeholder="Enter first name"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                value={subscriberForm.lastName}
                onChangeText={(text) => setSubscriberForm(prev => ({ ...prev, lastName: text }))}
                placeholder="Enter last name"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowAddSubscriberModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleAddSubscriber}
                disabled={isCreating}
              >
                <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                  {isCreating ? 'Adding...' : 'Add Subscriber'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Create Template Modal */}
      <Modal
        visible={showCreateTemplateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateTemplateModal(false)}
      >
        <BlurView intensity={50} style={styles.modalOverlay}>
          <View style={styles.largeModalContainer}>
            <Text style={styles.modalTitle}>Create Email Template</Text>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Template Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={templateForm.name}
                  onChangeText={(text) => setTemplateForm(prev => ({ ...prev, name: text }))}
                  placeholder="Enter template name"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Subject Line *</Text>
                <TextInput
                  style={styles.textInput}
                  value={templateForm.subject}
                  onChangeText={(text) => setTemplateForm(prev => ({ ...prev, subject: text }))}
                  placeholder="Enter email subject"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Email Content</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={templateForm.htmlContent}
                  onChangeText={(text) => setTemplateForm(prev => ({ ...prev, htmlContent: text, textContent: text }))}
                  placeholder="Enter your email content here..."
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formField}>
                <View style={styles.switchRow}>
                  <Text style={styles.formLabel}>Active Template</Text>
                  <Switch
                    value={templateForm.isActive}
                    onValueChange={(value) => setTemplateForm(prev => ({ ...prev, isActive: value }))}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowCreateTemplateModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleCreateTemplate}
                disabled={isCreating}
              >
                <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                  {isCreating ? 'Creating...' : 'Create Template'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Create Campaign Modal */}
      <Modal
        visible={showCreateCampaignModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateCampaignModal(false)}
      >
        <BlurView intensity={50} style={styles.modalOverlay}>
          <View style={styles.largeModalContainer}>
            <Text style={styles.modalTitle}>Create Email Campaign</Text>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Campaign Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={campaignForm.name}
                  onChangeText={(text) => setCampaignForm(prev => ({ ...prev, name: text }))}
                  placeholder="Enter campaign name"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Subject Line *</Text>
                <TextInput
                  style={styles.textInput}
                  value={campaignForm.subject}
                  onChangeText={(text) => setCampaignForm(prev => ({ ...prev, subject: text }))}
                  placeholder="Enter email subject"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Email Content</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={campaignForm.content.html}
                  onChangeText={(text) => setCampaignForm(prev => ({ 
                    ...prev, 
                    content: { html: text, text: text }
                  }))}
                  placeholder="Enter your email content here..."
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Recipients</Text>
                <Text style={styles.formHelpText}>
                  This campaign will be sent to all active subscribers ({subscribers.filter(s => s.status === 'active').length} subscribers)
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowCreateCampaignModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleCreateCampaign}
                disabled={isCreating}
              >
                <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                  {isCreating ? 'Creating...' : 'Create Campaign'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsCard: {
    flex: 1,
    minWidth: (width - 56) / 2,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  statsSubtitle: {
    fontSize: 10,
    color: '#9ca3af',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: (width - 56) / 2,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryTag: {
    fontSize: 10,
    color: '#3b82f6',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: '500',
  },
  statusTag: {
    fontSize: 10,
    color: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  campaignStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  statText: {
    fontSize: 10,
    color: '#6b7280',
  },
  sendButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  subscriberStats: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  largeModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalForm: {
    maxHeight: 400,
    marginBottom: 20,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formHelpText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
});

export default React.memo(EmailMarketingManagementScreen);
