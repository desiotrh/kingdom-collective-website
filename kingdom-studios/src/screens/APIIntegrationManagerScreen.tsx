import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { useKingdomColors } from '../hooks/useKingdomColors';

interface APIIntegration {
  id: string;
  name: string;
  description: string;
  category: 'marketing' | 'payment' | 'communication' | 'analytics' | 'storage' | 'social' | 'ministry';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  icon: string;
  lastSync: string;
  apiCalls: number;
  rateLimit: number;
  enabled: boolean;
  config?: any;
}

interface APIKey {
  id: string;
  name: string;
  service: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string;
  active: boolean;
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  lastTriggered: string;
  successRate: number;
}

export default function APIIntegrationManagerScreen() {
  const { currentMode } = useDualMode();
  const colors = useKingdomColors();

  const [selectedView, setSelectedView] = useState<'integrations' | 'keys' | 'webhooks' | 'logs' | 'docs'>('integrations');
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<APIIntegration | null>(null);

  // Mock data
  const mockIntegrations: APIIntegration[] = [
    {
      id: '1',
      name: 'Mailchimp',
      description: 'Email marketing automation and audience management',
      category: 'marketing',
      status: 'connected',
      icon: 'mail',
      lastSync: '2024-01-15 14:30:00',
      apiCalls: 1250,
      rateLimit: 10000,
      enabled: true,
    },
    {
      id: '2',
      name: 'Stripe',
      description: 'Payment processing and subscription management',
      category: 'payment',
      status: 'connected',
      icon: 'card',
      lastSync: '2024-01-15 14:25:00',
      apiCalls: 890,
      rateLimit: 5000,
      enabled: true,
    },
    {
      id: '3',
      name: 'Twilio',
      description: 'SMS and voice communication services',
      category: 'communication',
      status: 'connected',
      icon: 'chatbubble',
      lastSync: '2024-01-15 14:20:00',
      apiCalls: 450,
      rateLimit: 2000,
      enabled: true,
    },
    {
      id: '4',
      name: 'Google Analytics',
      description: 'Website and app analytics tracking',
      category: 'analytics',
      status: 'connected',
      icon: 'analytics',
      lastSync: '2024-01-15 14:15:00',
      apiCalls: 2100,
      rateLimit: 15000,
      enabled: true,
    },
    {
      id: '5',
      name: 'AWS S3',
      description: 'Cloud storage for files and media',
      category: 'storage',
      status: 'connected',
      icon: 'cloud',
      lastSync: '2024-01-15 14:10:00',
      apiCalls: 3400,
      rateLimit: 50000,
      enabled: true,
    },
    {
      id: '6',
      name: 'Facebook Graph API',
      description: 'Social media integration and posting',
      category: 'social',
      status: 'error',
      icon: 'logo-facebook',
      lastSync: '2024-01-15 12:00:00',
      apiCalls: 0,
      rateLimit: 5000,
      enabled: false,
    },
    {
      id: '7',
      name: currentMode === 'faith' ? 'Bible API' : 'Content API',
      description: currentMode === 'faith' 
        ? 'Access to Bible verses and theological resources'
        : 'Content management and syndication',
      category: currentMode === 'faith' ? 'ministry' : 'marketing',
      status: 'connected',
      icon: currentMode === 'faith' ? 'book' : 'library',
      lastSync: '2024-01-15 13:45:00',
      apiCalls: 567,
      rateLimit: 3000,
      enabled: true,
    },
    {
      id: '8',
      name: 'Slack',
      description: 'Team communication and notifications',
      category: 'communication',
      status: 'disconnected',
      icon: 'logo-slack',
      lastSync: 'Never',
      apiCalls: 0,
      rateLimit: 1000,
      enabled: false,
    },
  ];

  const mockAPIKeys: APIKey[] = [
    {
      id: '1',
      name: 'Production API',
      service: 'Main Application',
      key: 'sk_live_********************',
      permissions: ['read', 'write', 'delete'],
      createdAt: '2024-01-01 10:00:00',
      lastUsed: '2024-01-15 14:30:00',
      active: true,
    },
    {
      id: '2',
      name: 'Development API',
      service: 'Testing Environment',
      key: 'sk_test_********************',
      permissions: ['read', 'write'],
      createdAt: '2024-01-05 15:30:00',
      lastUsed: '2024-01-14 09:15:00',
      active: true,
    },
    {
      id: '3',
      name: 'Analytics Integration',
      service: 'Google Analytics',
      key: 'ga_********************',
      permissions: ['read'],
      createdAt: '2024-01-10 12:00:00',
      lastUsed: '2024-01-15 14:15:00',
      active: true,
    },
  ];

  const mockWebhooks: WebhookEndpoint[] = [
    {
      id: '1',
      name: currentMode === 'faith' ? 'Ministry Event Notifications' : 'User Event Notifications',
      url: 'https://api.kingdom-studios.com/webhooks/events',
      events: ['user.created', 'user.updated', 'payment.completed'],
      secret: 'wh_********************',
      active: true,
      lastTriggered: '2024-01-15 14:20:00',
      successRate: 98.5,
    },
    {
      id: '2',
      name: 'Payment Processing',
      url: 'https://api.kingdom-studios.com/webhooks/payments',
      events: ['payment.succeeded', 'payment.failed', 'subscription.updated'],
      secret: 'wh_********************',
      active: true,
      lastTriggered: '2024-01-15 13:45:00',
      successRate: 99.2,
    },
    {
      id: '3',
      name: 'Security Alerts',
      url: 'https://api.kingdom-studios.com/webhooks/security',
      events: ['login.failed', 'breach.detected', 'unusual_activity'],
      secret: 'wh_********************',
      active: false,
      lastTriggered: '2024-01-12 08:30:00',
      successRate: 100,
    },
  ];

  const availableIntegrations = [
    { name: 'Zapier', description: 'Workflow automation between apps', category: 'marketing', icon: 'flash' },
    { name: 'HubSpot', description: 'CRM and marketing automation', category: 'marketing', icon: 'people' },
    { name: 'Salesforce', description: 'Enterprise CRM solution', category: 'marketing', icon: 'business' },
    { name: 'Discord', description: 'Community communication platform', category: 'communication', icon: 'logo-discord' },
    { name: 'YouTube API', description: 'Video content management', category: 'social', icon: 'logo-youtube' },
    { name: 'Instagram API', description: 'Social media automation', category: 'social', icon: 'logo-instagram' },
    { name: 'OpenAI API', description: 'AI-powered content generation', category: 'marketing', icon: 'bulb' },
    { name: 'Shopify', description: 'E-commerce platform integration', category: 'payment', icon: 'storefront' },
  ];

  if (currentMode === 'faith') {
    availableIntegrations.push(
      { name: 'Church Management System', description: 'Integrate with church databases', category: 'ministry', icon: 'home' },
      { name: 'Tithe.ly', description: 'Online giving and donation platform', category: 'payment', icon: 'heart' },
      { name: 'Planning Center', description: 'Ministry planning and coordination', category: 'ministry', icon: 'calendar' },
      { name: 'YouVersion Bible API', description: 'Bible verses and reading plans', category: 'ministry', icon: 'book' }
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return colors.success;
      case 'error':
        return colors.error;
      case 'pending':
        return colors.warning;
      case 'disconnected':
        return colors.text;
      default:
        return colors.text;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'pending':
        return 'time';
      case 'disconnected':
        return 'radio-button-off';
      default:
        return 'help-circle';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'marketing':
        return colors.primary;
      case 'payment':
        return colors.success;
      case 'communication':
        return colors.info;
      case 'analytics':
        return colors.accent;
      case 'storage':
        return '#9333EA';
      case 'social':
        return '#EF4444';
      case 'ministry':
        return '#F59E0B';
      default:
        return colors.text;
    }
  };

  const toggleIntegration = (integrationId: string) => {
    const integration = mockIntegrations.find(i => i.id === integrationId);
    Alert.alert(
      'Toggle Integration',
      `${integration?.name} has been ${integration?.enabled ? 'disabled' : 'enabled'}`
    );
  };

  const addIntegration = (integration: any) => {
    Alert.alert('Success', `${integration.name} integration has been added to your workspace`);
    setShowIntegrationModal(false);
  };

  const generateAPIKey = () => {
    Alert.alert(
      'Generate API Key',
      'This will create a new API key with specified permissions. Keep it secure!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: () => Alert.alert('Success', 'New API key generated successfully!') }
      ]
    );
    setShowAPIKeyModal(false);
  };

  const testWebhook = (webhookId: string) => {
    Alert.alert('Webhook Test', 'Test payload sent to webhook endpoint');
  };

  const renderIntegrations = () => (
    <ScrollView style={styles.content}>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Active Integrations
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowIntegrationModal(true)}
          >
            <Ionicons name="add" size={20} color={colors.surface} />
            <Text style={[styles.addButtonText, { color: colors.surface }]}>
              Add Integration
            </Text>
          </TouchableOpacity>
        </View>

        {/* Integration Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {['all', 'marketing', 'payment', 'communication', 'analytics', 'storage', 'social', ...(currentMode === 'faith' ? ['ministry'] : [])].map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, { backgroundColor: colors.background }]}
            >
              <Text style={[styles.categoryChipText, { color: colors.text }]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Integrations List */}
        {mockIntegrations.map((integration) => (
          <View key={integration.id} style={[styles.integrationCard, { backgroundColor: colors.background }]}>
            <View style={styles.integrationHeader}>
              <View style={styles.integrationInfo}>
                <View style={[styles.integrationIcon, { backgroundColor: getCategoryColor(integration.category) }]}>
                  <Ionicons name={integration.icon as any} size={24} color={colors.surface} />
                </View>
                <View style={styles.integrationDetails}>
                  <Text style={[styles.integrationName, { color: colors.text }]}>
                    {integration.name}
                  </Text>
                  <Text style={[styles.integrationDescription, { color: colors.text }]}>
                    {integration.description}
                  </Text>
                  <View style={styles.integrationMeta}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(integration.category) }]}>
                      <Text style={[styles.categoryBadgeText, { color: colors.surface }]}>
                        {integration.category}
                      </Text>
                    </View>
                    <Text style={[styles.lastSync, { color: colors.text }]}>
                      Last sync: {integration.lastSync}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.integrationControls}>
                <View style={styles.statusContainer}>
                  <Ionicons
                    name={getStatusIcon(integration.status) as any}
                    size={20}
                    color={getStatusColor(integration.status)}
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(integration.status) }]}>
                    {integration.status}
                  </Text>
                </View>
                <Switch
                  value={integration.enabled}
                  onValueChange={() => toggleIntegration(integration.id)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </View>
            </View>
            
            {/* Usage Stats */}
            <View style={styles.usageStats}>
              <View style={styles.usageStat}>
                <Text style={[styles.usageLabel, { color: colors.text }]}>API Calls</Text>
                <Text style={[styles.usageValue, { color: colors.text }]}>
                  {integration.apiCalls.toLocaleString()}
                </Text>
              </View>
              <View style={styles.usageStat}>
                <Text style={[styles.usageLabel, { color: colors.text }]}>Rate Limit</Text>
                <Text style={[styles.usageValue, { color: colors.text }]}>
                  {integration.rateLimit.toLocaleString()}
                </Text>
              </View>
              <View style={styles.usageProgressContainer}>
                <View style={[styles.usageProgressBar, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.usageProgressFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${(integration.apiCalls / integration.rateLimit) * 100}%`
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.usagePercentage, { color: colors.text }]}>
                  {Math.round((integration.apiCalls / integration.rateLimit) * 100)}%
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderAPIKeys = () => (
    <ScrollView style={styles.content}>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            API Keys
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.accent }]}
            onPress={() => setShowAPIKeyModal(true)}
          >
            <Ionicons name="key" size={20} color={colors.surface} />
            <Text style={[styles.addButtonText, { color: colors.surface }]}>
              Generate Key
            </Text>
          </TouchableOpacity>
        </View>

        {mockAPIKeys.map((apiKey) => (
          <View key={apiKey.id} style={[styles.apiKeyCard, { backgroundColor: colors.background }]}>
            <View style={styles.apiKeyHeader}>
              <View style={styles.apiKeyInfo}>
                <Text style={[styles.apiKeyName, { color: colors.text }]}>
                  {apiKey.name}
                </Text>
                <Text style={[styles.apiKeyService, { color: colors.text }]}>
                  {apiKey.service}
                </Text>
              </View>
              <View style={styles.apiKeyStatus}>
                <View style={[styles.statusDot, { backgroundColor: apiKey.active ? colors.success : colors.text }]} />
                <Text style={[styles.statusLabel, { color: colors.text }]}>
                  {apiKey.active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
            
            <View style={styles.apiKeyDetails}>
              <Text style={[styles.apiKeyValue, { color: colors.text }]}>
                {apiKey.key}
              </Text>
              <TouchableOpacity style={styles.copyButton}>
                <Ionicons name="copy" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.apiKeyMeta}>
              <View style={styles.permissions}>
                <Text style={[styles.permissionsLabel, { color: colors.text }]}>
                  Permissions:
                </Text>
                {apiKey.permissions.map((permission) => (
                  <View key={permission} style={[styles.permissionChip, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.permissionChipText, { color: colors.surface }]}>
                      {permission}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.apiKeyDate, { color: colors.text }]}>
                Last used: {apiKey.lastUsed}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderWebhooks = () => (
    <ScrollView style={styles.content}>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Webhook Endpoints
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.secondary }]}
            onPress={() => setShowWebhookModal(true)}
          >
            <Ionicons name="add" size={20} color={colors.surface} />
            <Text style={[styles.addButtonText, { color: colors.surface }]}>
              Add Webhook
            </Text>
          </TouchableOpacity>
        </View>

        {mockWebhooks.map((webhook) => (
          <View key={webhook.id} style={[styles.webhookCard, { backgroundColor: colors.background }]}>
            <View style={styles.webhookHeader}>
              <View style={styles.webhookInfo}>
                <Text style={[styles.webhookName, { color: colors.text }]}>
                  {webhook.name}
                </Text>
                <Text style={[styles.webhookUrl, { color: colors.text }]}>
                  {webhook.url}
                </Text>
              </View>
              <View style={styles.webhookControls}>
                <TouchableOpacity
                  style={[styles.testButton, { backgroundColor: colors.info }]}
                  onPress={() => testWebhook(webhook.id)}
                >
                  <Ionicons name="play" size={16} color={colors.surface} />
                  <Text style={[styles.testButtonText, { color: colors.surface }]}>
                    Test
                  </Text>
                </TouchableOpacity>
                <Switch
                  value={webhook.active}
                  onValueChange={() => Alert.alert('Webhook Updated', `${webhook.name} has been ${webhook.active ? 'disabled' : 'enabled'}`)}
                  trackColor={{ false: colors.border, true: colors.success }}
                  thumbColor={colors.surface}
                />
              </View>
            </View>
            
            <View style={styles.webhookEvents}>
              <Text style={[styles.eventsLabel, { color: colors.text }]}>
                Events:
              </Text>
              {webhook.events.map((event) => (
                <View key={event} style={[styles.eventChip, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.eventChipText, { color: colors.text }]}>
                    {event}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.webhookStats}>
              <View style={styles.webhookStat}>
                <Text style={[styles.statLabel, { color: colors.text }]}>
                  Success Rate
                </Text>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {webhook.successRate}%
                </Text>
              </View>
              <View style={styles.webhookStat}>
                <Text style={[styles.statLabel, { color: colors.text }]}>
                  Last Triggered
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {webhook.lastTriggered}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderAddIntegrationModal = () => (
    <Modal
      visible={showIntegrationModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowIntegrationModal(false)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Add Integration
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.modalContent}>
          <Text style={[styles.modalSubtitle, { color: colors.text }]}>
            Connect your favorite services and tools
          </Text>
          
          {availableIntegrations.map((integration, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.integrationOption, { backgroundColor: colors.surface }]}
              onPress={() => addIntegration(integration)}
            >
              <View style={[styles.integrationOptionIcon, { backgroundColor: getCategoryColor(integration.category) }]}>
                <Ionicons name={integration.icon as any} size={24} color={colors.surface} />
              </View>
              <View style={styles.integrationOptionInfo}>
                <Text style={[styles.integrationOptionName, { color: colors.text }]}>
                  {integration.name}
                </Text>
                <Text style={[styles.integrationOptionDescription, { color: colors.text }]}>
                  {integration.description}
                </Text>
              </View>
              <Ionicons name="add-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderAPIKeyModal = () => (
    <Modal
      visible={showAPIKeyModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAPIKeyModal(false)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Generate API Key
          </Text>
          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: colors.primary }]}
            onPress={generateAPIKey}
          >
            <Text style={[styles.generateButtonText, { color: colors.surface }]}>
              Generate
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Key Name
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="Enter a descriptive name"
              placeholderTextColor={colors.text}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Service
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="Service or application name"
              placeholderTextColor={colors.text}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Permissions
            </Text>
            {['read', 'write', 'delete', 'admin'].map((permission) => (
              <View key={permission} style={styles.permissionOption}>
                <Switch
                  value={permission === 'read'}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.surface}
                />
                <Text style={[styles.permissionOptionText, { color: colors.text }]}>
                  {permission.charAt(0).toUpperCase() + permission.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          🔌 API Integration Manager
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.text }]}>
          {currentMode === 'faith' 
            ? 'Connect your ministry tools and services seamlessly'
            : 'Manage third-party integrations and API connections'
          }
        </Text>
      </View>

      {/* Navigation Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {[
          { key: 'integrations', label: 'Integrations', icon: 'apps' },
          { key: 'keys', label: 'API Keys', icon: 'key' },
          { key: 'webhooks', label: 'Webhooks', icon: 'git-network' },
          { key: 'logs', label: 'Logs', icon: 'list' },
          { key: 'docs', label: 'Docs', icon: 'document-text' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              {
                backgroundColor: selectedView === tab.key ? colors.primary : colors.surface,
              }
            ]}
            onPress={() => setSelectedView(tab.key as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={selectedView === tab.key ? colors.surface : colors.text}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: selectedView === tab.key ? colors.surface : colors.text,
                }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {selectedView === 'integrations' && renderIntegrations()}
      {selectedView === 'keys' && renderAPIKeys()}
      {selectedView === 'webhooks' && renderWebhooks()}
      {selectedView === 'logs' && (
        <View style={[styles.placeholderContent, { backgroundColor: colors.surface }]}>
          <Ionicons name="list-outline" size={64} color={colors.text} />
          <Text style={[styles.placeholderText, { color: colors.text }]}>
            API logs and monitoring coming soon
          </Text>
        </View>
      )}
      {selectedView === 'docs' && (
        <View style={[styles.placeholderContent, { backgroundColor: colors.surface }]}>
          <Ionicons name="document-text-outline" size={64} color={colors.text} />
          <Text style={[styles.placeholderText, { color: colors.text }]}>
            API documentation coming soon
          </Text>
        </View>
      )}

      {/* Modals */}
      {renderAddIntegrationModal()}
      {renderAPIKeyModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  tabsContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  integrationCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  integrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  integrationInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  integrationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  integrationDetails: {
    flex: 1,
  },
  integrationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  integrationDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  integrationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 10,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lastSync: {
    fontSize: 12,
  },
  integrationControls: {
    alignItems: 'flex-end',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  usageStats: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 10,
  },
  usageStat: {
    marginRight: 20,
  },
  usageLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  usageValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  usageProgressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  usageProgressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  usageProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  usagePercentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  apiKeyCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  apiKeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  apiKeyInfo: {
    flex: 1,
  },
  apiKeyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  apiKeyService: {
    fontSize: 14,
  },
  apiKeyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 14,
  },
  apiKeyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  apiKeyValue: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: 8,
  },
  apiKeyMeta: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 10,
  },
  permissions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  permissionsLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  permissionChip: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 5,
  },
  permissionChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  apiKeyDate: {
    fontSize: 12,
  },
  webhookCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  webhookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  webhookInfo: {
    flex: 1,
  },
  webhookName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  webhookUrl: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  webhookControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 10,
  },
  testButtonText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
  },
  webhookEvents: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  eventsLabel: {
    fontSize: 14,
    marginRight: 10,
    marginBottom: 5,
  },
  eventChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  eventChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  webhookStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 10,
  },
  webhookStat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  generateButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  generateButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  integrationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  integrationOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  integrationOptionInfo: {
    flex: 1,
  },
  integrationOptionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  integrationOptionDescription: {
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  permissionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  permissionOptionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
});
