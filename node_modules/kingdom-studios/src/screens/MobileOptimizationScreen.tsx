import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Dimensions,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';

const { width, height } = Dimensions.get('window');

interface MobileFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'performance' | 'ui' | 'accessibility' | 'offline' | 'gestures';
  icon: string;
  status: 'active' | 'beta' | 'coming_soon';
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: string;
  target: string;
  status: 'good' | 'warning' | 'poor';
  description: string;
}

interface IntegrationAPI {
  id: string;
  name: string;
  description: string;
  category: 'social' | 'analytics' | 'payments' | 'storage' | 'ai' | 'automation';
  status: 'connected' | 'disconnected' | 'error';
  icon: string;
  lastSync?: Date;
  endpoints: number;
}

const MobileOptimizationScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  
  const [currentTab, setCurrentTab] = useState<'features' | 'performance' | 'integrations'>('features');
  const [mobileFeatures, setMobileFeatures] = useState<MobileFeature[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationAPI[]>([]);
  const [deviceInfo, setDeviceInfo] = useState({
    platform: Platform.OS,
    version: Platform.Version,
    screenWidth: width,
    screenHeight: height,
    isTablet: width > 768
  });

  useEffect(() => {
    loadMockData();
    checkDeviceCapabilities();
  }, [currentMode]);

  const loadMockData = () => {
    // Mock mobile features
    const mockFeatures: MobileFeature[] = [
      {
        id: '1',
        name: 'Offline Mode',
        description: currentMode === 'faith' 
          ? 'Access prayers, scriptures, and content without internet'
          : 'Work on content and access saved materials offline',
        enabled: true,
        category: 'offline',
        icon: 'cloud-off',
        status: 'active'
      },
      {
        id: '2',
        name: 'Gesture Navigation',
        description: 'Swipe gestures for quick navigation between features',
        enabled: true,
        category: 'gestures',
        icon: 'gesture',
        status: 'active'
      },
      {
        id: '3',
        name: 'Adaptive UI',
        description: 'Interface automatically adjusts for different screen sizes',
        enabled: true,
        category: 'ui',
        icon: 'adaptive-settings',
        status: 'active'
      },
      {
        id: '4',
        name: 'Voice Control',
        description: currentMode === 'faith'
          ? 'Voice commands for prayers and scripture reading'
          : 'Voice commands for content creation and navigation',
        enabled: false,
        category: 'accessibility',
        icon: 'mic',
        status: 'beta'
      },
      {
        id: '5',
        name: 'Haptic Feedback',
        description: 'Touch feedback for better user experience',
        enabled: true,
        category: 'ui',
        icon: 'vibration',
        status: 'active'
      },
      {
        id: '6',
        name: 'Background Sync',
        description: 'Sync data in background for seamless experience',
        enabled: true,
        category: 'performance',
        icon: 'sync',
        status: 'active'
      },
      {
        id: '7',
        name: 'Dark Mode Auto',
        description: 'Automatically switch based on time of day',
        enabled: false,
        category: 'ui',
        icon: 'dark-mode',
        status: 'coming_soon'
      },
      {
        id: '8',
        name: 'Smart Notifications',
        description: currentMode === 'faith'
          ? 'Intelligent prayer reminders and spiritual nudges'
          : 'AI-powered content suggestions and reminders',
        enabled: true,
        category: 'performance',
        icon: 'smart-toy',
        status: 'beta'
      }
    ];

    // Mock performance metrics
    const mockMetrics: PerformanceMetric[] = [
      {
        id: '1',
        name: 'App Launch Time',
        value: '1.2s',
        target: '< 2s',
        status: 'good',
        description: 'Time from tap to first meaningful content'
      },
      {
        id: '2',
        name: 'Memory Usage',
        value: '145MB',
        target: '< 200MB',
        status: 'good',
        description: 'Current RAM consumption'
      },
      {
        id: '3',
        name: 'Battery Impact',
        value: 'Low',
        target: 'Low',
        status: 'good',
        description: 'Impact on device battery life'
      },
      {
        id: '4',
        name: 'Network Efficiency',
        value: '89%',
        target: '> 85%',
        status: 'good',
        description: 'Data compression and caching effectiveness'
      },
      {
        id: '5',
        name: 'UI Responsiveness',
        value: '58 FPS',
        target: '> 55 FPS',
        status: 'good',
        description: 'Average frame rate during interactions'
      },
      {
        id: '6',
        name: 'Storage Usage',
        value: '2.3GB',
        target: '< 5GB',
        status: 'warning',
        description: 'Local storage consumption'
      }
    ];

    // Mock integrations
    const mockIntegrations: IntegrationAPI[] = [
      {
        id: '1',
        name: 'Facebook API',
        description: 'Post content and manage Facebook presence',
        category: 'social',
        status: 'connected',
        icon: 'facebook',
        lastSync: new Date(Date.now() - 300000),
        endpoints: 12
      },
      {
        id: '2',
        name: 'Instagram Business',
        description: 'Share stories, posts, and manage Instagram account',
        category: 'social',
        status: 'connected',
        icon: 'instagram',
        lastSync: new Date(Date.now() - 600000),
        endpoints: 8
      },
      {
        id: '3',
        name: 'Google Analytics',
        description: 'Track website and app analytics',
        category: 'analytics',
        status: 'connected',
        icon: 'analytics',
        lastSync: new Date(Date.now() - 900000),
        endpoints: 15
      },
      {
        id: '4',
        name: 'Stripe Payments',
        description: 'Process payments for digital products',
        category: 'payments',
        status: 'connected',
        icon: 'payment',
        lastSync: new Date(Date.now() - 1800000),
        endpoints: 6
      },
      {
        id: '5',
        name: 'YouTube API',
        description: 'Upload and manage YouTube content',
        category: 'social',
        status: 'error',
        icon: 'video-library',
        lastSync: new Date(Date.now() - 86400000),
        endpoints: 10
      },
      {
        id: '6',
        name: 'OpenAI API',
        description: 'AI-powered content generation and assistance',
        category: 'ai',
        status: 'connected',
        icon: 'psychology',
        lastSync: new Date(Date.now() - 120000),
        endpoints: 4
      },
      {
        id: '7',
        name: 'Mailchimp',
        description: 'Email marketing and automation',
        category: 'automation',
        status: 'disconnected',
        icon: 'mail',
        endpoints: 7
      },
      {
        id: '8',
        name: 'Cloudinary',
        description: 'Image and video storage and optimization',
        category: 'storage',
        status: 'connected',
        icon: 'cloud-upload',
        lastSync: new Date(Date.now() - 180000),
        endpoints: 9
      }
    ];

    setMobileFeatures(mockFeatures);
    setPerformanceMetrics(mockMetrics);
    setIntegrations(mockIntegrations);
  };

  const checkDeviceCapabilities = () => {
    // Check device-specific capabilities
    const capabilities = {
      hasNotch: height > 800 && Platform.OS === 'ios',
      supportsHaptics: Platform.OS === 'ios' || (Platform.OS === 'android' && typeof Platform.Version === 'number' && Platform.Version >= 26),
      supportsVoice: true, // Most modern devices support voice
      supportsBiometrics: Platform.OS === 'ios' || (Platform.OS === 'android' && typeof Platform.Version === 'number' && Platform.Version >= 23),
    };
    
    console.log('Device capabilities:', capabilities);
  };

  const toggleFeature = (featureId: string) => {
    setMobileFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
      case 'connected':
      case 'active':
        return colors.success;
      case 'warning':
      case 'beta':
        return colors.warning;
      case 'poor':
      case 'error':
      case 'disconnected':
        return colors.error;
      case 'coming_soon':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance':
        return 'speed';
      case 'ui':
        return 'palette';
      case 'accessibility':
        return 'accessibility';
      case 'offline':
        return 'cloud-off';
      case 'gestures':
        return 'gesture';
      case 'social':
        return 'share';
      case 'analytics':
        return 'analytics';
      case 'payments':
        return 'payment';
      case 'storage':
        return 'storage';
      case 'ai':
        return 'psychology';
      case 'automation':
        return 'automation';
      default:
        return 'settings';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return '1d+ ago';
  };

  const renderMobileFeature = (feature: MobileFeature) => (
    <View key={feature.id} style={[styles.featureCard, { backgroundColor: colors.surface }]}>
      <View style={styles.featureHeader}>
        <View style={styles.featureInfo}>
          <View style={[styles.featureIcon, { backgroundColor: colors.primary }]}>
            <MaterialIcons name={feature.icon as any} size={20} color="#FFFFFF" />
          </View>
          
          <View style={styles.featureDetails}>
            <View style={styles.featureNameRow}>
              <Text style={[styles.featureName, { color: colors.text }]}>
                {feature.name}
              </Text>
              <View style={[styles.featureStatus, { backgroundColor: getStatusColor(feature.status) }]}>
                <Text style={styles.featureStatusText}>{feature.status}</Text>
              </View>
            </View>
            
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              {feature.description}
            </Text>
          </View>
        </View>
        
        <Switch
          value={feature.enabled}
          onValueChange={() => toggleFeature(feature.id)}
          trackColor={{ false: colors.background, true: colors.primary }}
          thumbColor={feature.enabled ? '#FFFFFF' : colors.textSecondary}
          disabled={feature.status === 'coming_soon'}
        />
      </View>
    </View>
  );

  const renderPerformanceMetric = (metric: PerformanceMetric) => (
    <View key={metric.id} style={[styles.metricCard, { backgroundColor: colors.surface }]}>
      <View style={styles.metricHeader}>
        <Text style={[styles.metricName, { color: colors.text }]}>
          {metric.name}
        </Text>
        <View style={[styles.metricStatus, { backgroundColor: getStatusColor(metric.status) }]}>
          <Text style={styles.metricStatusText}>{metric.status}</Text>
        </View>
      </View>
      
      <Text style={[styles.metricValue, { color: colors.accent }]}>
        {metric.value}
      </Text>
      
      <Text style={[styles.metricTarget, { color: colors.textSecondary }]}>
        Target: {metric.target}
      </Text>
      
      <Text style={[styles.metricDescription, { color: colors.textSecondary }]}>
        {metric.description}
      </Text>
    </View>
  );

  const renderIntegration = (integration: IntegrationAPI) => (
    <TouchableOpacity key={integration.id} style={[styles.integrationCard, { backgroundColor: colors.surface }]}>
      <View style={styles.integrationHeader}>
        <View style={styles.integrationInfo}>
          <View style={[styles.integrationIcon, { backgroundColor: colors.primary }]}>
            <MaterialIcons name={integration.icon as any} size={20} color="#FFFFFF" />
          </View>
          
          <View style={styles.integrationDetails}>
            <View style={styles.integrationNameRow}>
              <Text style={[styles.integrationName, { color: colors.text }]}>
                {integration.name}
              </Text>
              <View style={[styles.integrationStatus, { backgroundColor: getStatusColor(integration.status) }]}>
                <View style={styles.integrationStatusDot} />
              </View>
            </View>
            
            <Text style={[styles.integrationDescription, { color: colors.textSecondary }]}>
              {integration.description}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.integrationFooter}>
        <View style={styles.integrationMeta}>
          <Text style={[styles.integrationEndpoints, { color: colors.textSecondary }]}>
            {integration.endpoints} endpoints
          </Text>
          
          {integration.lastSync && (
            <Text style={[styles.integrationSync, { color: colors.textSecondary }]}>
              Last sync: {formatRelativeTime(integration.lastSync)}
            </Text>
          )}
        </View>
        
        <TouchableOpacity style={[
          styles.integrationAction,
          { backgroundColor: integration.status === 'connected' ? colors.warning : colors.success }
        ]}>
          <Text style={styles.integrationActionText}>
            {integration.status === 'connected' ? 'Configure' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderDeviceInfo = () => (
    <View style={[styles.deviceInfoCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.deviceInfoTitle, { color: colors.text }]}>
        Device Information
      </Text>
      
      <View style={styles.deviceInfoGrid}>
        <View style={styles.deviceInfoItem}>
          <MaterialIcons name="phone-android" size={16} color={colors.textSecondary} />
          <Text style={[styles.deviceInfoText, { color: colors.textSecondary }]}>
            {deviceInfo.platform} {deviceInfo.version}
          </Text>
        </View>
        
        <View style={styles.deviceInfoItem}>
          <MaterialIcons name="aspect-ratio" size={16} color={colors.textSecondary} />
          <Text style={[styles.deviceInfoText, { color: colors.textSecondary }]}>
            {deviceInfo.screenWidth}x{deviceInfo.screenHeight}
          </Text>
        </View>
        
        <View style={styles.deviceInfoItem}>
          <MaterialIcons name="tablet" size={16} color={colors.textSecondary} />
          <Text style={[styles.deviceInfoText, { color: colors.textSecondary }]}>
            {deviceInfo.isTablet ? 'Tablet' : 'Phone'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {currentMode === 'faith' ? '📱 Mobile Optimization' : '📱 Mobile & APIs'}
        </Text>
        
        <TouchableOpacity style={[styles.refreshButton, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {[
          { key: 'features', label: 'Features', icon: 'tune' },
          { key: 'performance', label: 'Performance', icon: 'speed' },
          { key: 'integrations', label: 'APIs', icon: 'api' }
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
        {currentTab === 'features' && (
          <View style={styles.featuresContainer}>
            {renderDeviceInfo()}
            {mobileFeatures.map(renderMobileFeature)}
          </View>
        )}

        {currentTab === 'performance' && (
          <View style={styles.performanceContainer}>
            <View style={styles.performanceGrid}>
              {performanceMetrics.map(renderPerformanceMetric)}
            </View>
            
            <View style={[styles.optimizationCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.optimizationTitle, { color: colors.text }]}>
                {currentMode === 'faith' ? '⚡ Kingdom Optimization' : '⚡ Performance Tips'}
              </Text>
              
              <View style={styles.optimizationTip}>
                <MaterialIcons name="lightbulb" size={16} color={colors.accent} />
                <Text style={[styles.optimizationText, { color: colors.textSecondary }]}>
                  {currentMode === 'faith' 
                    ? 'Enable offline mode to access prayers and scriptures anytime'
                    : 'Enable background sync for seamless content updates'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {currentTab === 'integrations' && (
          <View style={styles.integrationsContainer}>
            {integrations.map(renderIntegration)}
          </View>
        )}
      </ScrollView>
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
  refreshButton: {
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
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  // Device Info Styles
  deviceInfoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  deviceInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  deviceInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  deviceInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceInfoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  // Features Styles
  featuresContainer: {
    gap: 12,
  },
  featureCard: {
    padding: 16,
    borderRadius: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureDetails: {
    flex: 1,
  },
  featureNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  featureStatus: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  featureStatusText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  // Performance Styles
  performanceContainer: {
    gap: 16,
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    width: (width - 44) / 2,
    padding: 16,
    borderRadius: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricName: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  metricStatus: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  metricStatusText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricTarget: {
    fontSize: 10,
    marginBottom: 4,
  },
  metricDescription: {
    fontSize: 10,
    lineHeight: 14,
  },
  optimizationCard: {
    padding: 16,
    borderRadius: 12,
  },
  optimizationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optimizationTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  optimizationText: {
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 8,
    flex: 1,
  },
  // Integrations Styles
  integrationsContainer: {
    gap: 12,
  },
  integrationCard: {
    padding: 16,
    borderRadius: 12,
  },
  integrationHeader: {
    marginBottom: 12,
  },
  integrationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  integrationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  integrationDetails: {
    flex: 1,
  },
  integrationNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  integrationName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  integrationStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  integrationStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  integrationDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  integrationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  integrationMeta: {
    flex: 1,
  },
  integrationEndpoints: {
    fontSize: 11,
    marginBottom: 2,
  },
  integrationSync: {
    fontSize: 10,
  },
  integrationAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  integrationActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default MobileOptimizationScreen;
