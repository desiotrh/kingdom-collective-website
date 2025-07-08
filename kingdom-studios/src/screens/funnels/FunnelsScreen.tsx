import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppNavigation } from '../../utils/navigationUtils';
import { useFaithMode } from '../../contexts/FaithModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { KingdomColors, KingdomShadows } from '../../constants/KingdomColors';
import KingdomLogo from '../../components/KingdomLogo';

const { width } = Dimensions.get('window');

interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  type: 'ebook' | 'checklist' | 'template' | 'video' | 'course';
  downloads: number;
  conversions: number;
  status: 'active' | 'draft' | 'paused';
  faithMode?: {
    title: string;
    description: string;
  };
}

interface Funnel {
  id: string;
  name: string;
  type: 'leadMagnet' | 'sales' | 'webinar' | 'course';
  steps: number;
  conversionRate: number;
  revenue: string;
  status: 'active' | 'draft';
  faithMode?: {
    name: string;
  };
}

interface FunnelTool {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string[];
  comingSoon?: boolean;
  faithMode?: {
    title: string;
    description: string;
  };
}

const FunnelsScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'magnets' | 'funnels' | 'templates'>('overview');

  const funnelTools: FunnelTool[] = [
    {
      id: 'lead-magnet-builder',
      title: faithMode ? 'Kingdom Lead Magnet Builder' : 'Lead Magnet Builder',
      description: faithMode 
        ? 'Create powerful Kingdom resources that attract souls' 
        : 'Build irresistible freebies that convert visitors to leads',
      icon: '🧲',
      gradient: [KingdomColors.primary.royalPurple, KingdomColors.gold.bright],
      faithMode: {
        title: 'Kingdom Lead Magnet Builder',
        description: 'Create powerful Kingdom resources that attract souls'
      }
    },
    {
      id: 'landing-page-builder',
      title: faithMode ? 'Kingdom Landing Pages' : 'Landing Page Builder',
      description: faithMode 
        ? 'Design Kingdom-focused landing pages that inspire action' 
        : 'Create high-converting landing pages with drag & drop',
      icon: '📄',
      gradient: [KingdomColors.gold.warm, KingdomColors.primary.deepNavy],
      faithMode: {
        title: 'Kingdom Landing Pages',
        description: 'Design Kingdom-focused landing pages that inspire action'
      }
    },
    {
      id: 'email-automation',
      title: faithMode ? 'Kingdom Email Automation' : 'Email Automation',
      description: faithMode 
        ? 'Nurture souls with automated Kingdom-focused sequences' 
        : 'Set up automated email sequences that nurture leads',
      icon: '📧',
      gradient: [KingdomColors.accent.info, KingdomColors.silver.bright],
      faithMode: {
        title: 'Kingdom Email Automation',
        description: 'Nurture souls with automated Kingdom-focused sequences'
      }
    },
    {
      id: 'funnel-analytics',
      title: faithMode ? 'Kingdom Funnel Analytics' : 'Funnel Analytics',
      description: faithMode 
        ? 'Track Kingdom impact and conversion metrics' 
        : 'Advanced analytics and optimization insights',
      icon: '📊',
      gradient: [KingdomColors.accent.success, KingdomColors.primary.midnight],
      faithMode: {
        title: 'Kingdom Funnel Analytics',
        description: 'Track Kingdom impact and conversion metrics'
      }
    },
    {
      id: 'webinar-builder',
      title: faithMode ? 'Kingdom Webinar Studio' : 'Webinar Builder',
      description: faithMode 
        ? 'Host powerful Kingdom teaching webinars' 
        : 'Create and host automated webinar funnels',
      icon: '🎥',
      gradient: [KingdomColors.gold.amber, KingdomColors.primary.royalPurple],
      comingSoon: true,
      faithMode: {
        title: 'Kingdom Webinar Studio',
        description: 'Host powerful Kingdom teaching webinars'
      }
    },
    {
      id: 'membership-site',
      title: faithMode ? 'Kingdom Membership Site' : 'Membership Site Builder',
      description: faithMode 
        ? 'Build exclusive Kingdom communities and courses' 
        : 'Create subscription-based membership sites',
      icon: '🏰',
      gradient: [KingdomColors.primary.deepNavy, KingdomColors.gold.bright],
      comingSoon: true,
      faithMode: {
        title: 'Kingdom Membership Site',
        description: 'Build exclusive Kingdom communities and courses'
      }
    },
  ];

  const leadMagnets: LeadMagnet[] = [
    {
      id: '1',
      title: faithMode ? '30 Kingdom Affirmations for Entrepreneurs' : 'Success Mindset Checklist',
      description: faithMode 
        ? 'Powerful faith-based affirmations for Kingdom builders' 
        : 'Daily affirmations for entrepreneurial success',
      type: 'checklist',
      downloads: 1247,
      conversions: 89,
      status: 'active',
      faithMode: {
        title: '30 Kingdom Affirmations for Entrepreneurs',
        description: 'Powerful faith-based affirmations for Kingdom builders'
      }
    },
    {
      id: '2',
      title: faithMode ? 'Kingdom Business Plan Template' : 'Business Plan Template',
      description: faithMode 
        ? 'Build your business on Kingdom principles' 
        : 'Complete business plan template with examples',
      type: 'template',
      downloads: 856,
      conversions: 67,
      status: 'active',
      faithMode: {
        title: 'Kingdom Business Plan Template',
        description: 'Build your business on Kingdom principles'
      }
    },
    {
      id: '3',
      title: faithMode ? 'Faith & Finance: Kingdom Wealth Building' : 'Wealth Building eBook',
      description: faithMode 
        ? 'Biblical principles for building Kingdom wealth' 
        : 'Comprehensive guide to building wealth',
      type: 'ebook',
      downloads: 423,
      conversions: 34,
      status: 'draft',
      faithMode: {
        title: 'Faith & Finance: Kingdom Wealth Building',
        description: 'Biblical principles for building Kingdom wealth'
      }
    },
  ];

  const funnels: Funnel[] = [
    {
      id: '1',
      name: faithMode ? 'Kingdom Entrepreneur Funnel' : 'Entrepreneur Lead Funnel',
      type: 'leadMagnet',
      steps: 5,
      conversionRate: 23.4,
      revenue: '$2,340',
      status: 'active',
      faithMode: {
        name: 'Kingdom Entrepreneur Funnel'
      }
    },
    {
      id: '2',
      name: faithMode ? 'Faith-Based Business Course' : 'Business Mastery Course',
      type: 'course',
      steps: 8,
      conversionRate: 12.7,
      revenue: '$5,670',
      status: 'active',
      faithMode: {
        name: 'Faith-Based Business Course'
      }
    },
    {
      id: '3',
      name: faithMode ? 'Kingdom Mindset Webinar' : 'Success Mindset Webinar',
      type: 'webinar',
      steps: 6,
      conversionRate: 8.9,
      revenue: '$1,450',
      status: 'draft',
      faithMode: {
        name: 'Kingdom Mindset Webinar'
      }
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return KingdomColors.accent.success;
      case 'draft': return KingdomColors.gray;
      case 'paused': return KingdomColors.gold.bright;
      default: return KingdomColors.gray;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ebook': return '📚';
      case 'checklist': return '✅';
      case 'template': return '📋';
      case 'video': return '🎥';
      case 'course': return '🎓';
      case 'leadMagnet': return '🧲';
      case 'sales': return '💰';
      case 'webinar': return '🎥';
      default: return '📄';
    }
  };

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* Stats */}
      <View style={styles.statsGrid}>
        <LinearGradient
          colors={[KingdomColors.primary.royalPurple, KingdomColors.gold.bright]}
          style={styles.statCard}
        >
          <Text style={styles.statIcon}>🧲</Text>
          <Text style={styles.statValue}>2,526</Text>
          <Text style={styles.statLabel}>
            {faithMode ? 'Kingdom Leads' : 'Total Leads'}
          </Text>
          <Text style={styles.statChange}>+34.2%</Text>
        </LinearGradient>

        <LinearGradient
          colors={[KingdomColors.accent.success, KingdomColors.primary.deepNavy]}
          style={styles.statCard}
        >
          <Text style={styles.statIcon}>📊</Text>
          <Text style={styles.statValue}>18.4%</Text>
          <Text style={styles.statLabel}>Conversion Rate</Text>
          <Text style={styles.statChange}>+5.7%</Text>
        </LinearGradient>

        <LinearGradient
          colors={[KingdomColors.gold.warm, KingdomColors.primary.midnight]}
          style={styles.statCard}
        >
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statValue}>$9,460</Text>
          <Text style={styles.statLabel}>
            {faithMode ? 'Kingdom Revenue' : 'Funnel Revenue'}
          </Text>
          <Text style={styles.statChange}>+28.1%</Text>
        </LinearGradient>
      </View>

      {/* Funnel Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {faithMode ? '🛠️ Kingdom Funnel Tools' : '🛠️ Funnel Building Tools'}
        </Text>
        <View style={styles.toolsGrid}>
          {funnelTools.map(tool => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              onPress={() => {
                if (tool.comingSoon) {
                  Alert.alert('Coming Soon!', `${tool.title} will be available soon!`);
                } else {
                  Alert.alert('Open Tool', `Opening ${tool.title}`);
                }
              }}
            >
              <LinearGradient
                colors={tool.gradient as [string, string]}
                style={styles.toolGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.toolHeader}>
                  <Text style={styles.toolIcon}>{tool.icon}</Text>
                  {tool.comingSoon && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>Soon</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.toolTitle}>
                  {faithMode && tool.faithMode ? tool.faithMode.title : tool.title}
                </Text>
                <Text style={styles.toolDescription}>
                  {faithMode && tool.faithMode ? tool.faithMode.description : tool.description}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderLeadMagnets = () => (
    <View style={styles.magnetsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {faithMode ? '🧲 Kingdom Lead Magnets' : '🧲 Lead Magnets'}
        </Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {leadMagnets.map(magnet => (
        <TouchableOpacity key={magnet.id} style={styles.magnetCard}>
          <View style={styles.magnetContent}>
            <View style={styles.magnetHeader}>
              <Text style={styles.magnetIcon}>{getTypeIcon(magnet.type)}</Text>
              <View style={styles.magnetInfo}>
                <Text style={styles.magnetTitle}>
                  {faithMode && magnet.faithMode ? magnet.faithMode.title : magnet.title}
                </Text>
                <Text style={styles.magnetDescription}>
                  {faithMode && magnet.faithMode ? magnet.faithMode.description : magnet.description}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(magnet.status) }]}>
                <Text style={styles.statusText}>{magnet.status}</Text>
              </View>
            </View>
            <View style={styles.magnetStats}>
              <View style={styles.magnetStat}>
                <Text style={styles.magnetStatNumber}>{magnet.downloads}</Text>
                <Text style={styles.magnetStatLabel}>Downloads</Text>
              </View>
              <View style={styles.magnetStat}>
                <Text style={styles.magnetStatNumber}>{magnet.conversions}</Text>
                <Text style={styles.magnetStatLabel}>Conversions</Text>
              </View>
              <View style={styles.magnetStat}>
                <Text style={styles.magnetStatNumber}>
                  {((magnet.conversions / magnet.downloads) * 100).toFixed(1)}%
                </Text>
                <Text style={styles.magnetStatLabel}>CVR</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFunnels = () => (
    <View style={styles.funnelsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {faithMode ? '🔄 Kingdom Funnels' : '🔄 Sales Funnels'}
        </Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Build</Text>
        </TouchableOpacity>
      </View>

      {funnels.map(funnel => (
        <TouchableOpacity key={funnel.id} style={styles.funnelCard}>
          <View style={styles.funnelContent}>
            <View style={styles.funnelHeader}>
              <Text style={styles.funnelIcon}>{getTypeIcon(funnel.type)}</Text>
              <View style={styles.funnelInfo}>
                <Text style={styles.funnelName}>
                  {faithMode && funnel.faithMode ? funnel.faithMode.name : funnel.name}
                </Text>
                <Text style={styles.funnelType}>{funnel.type} • {funnel.steps} steps</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(funnel.status) }]}>
                <Text style={styles.statusText}>{funnel.status}</Text>
              </View>
            </View>
            <View style={styles.funnelMetrics}>
              <View style={styles.funnelMetric}>
                <Text style={styles.funnelMetricValue}>{funnel.conversionRate}%</Text>
                <Text style={styles.funnelMetricLabel}>Conversion</Text>
              </View>
              <View style={styles.funnelMetric}>
                <Text style={styles.funnelMetricValue}>{funnel.revenue}</Text>
                <Text style={styles.funnelMetricLabel}>Revenue</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTemplates = () => (
    <View style={styles.templatesContainer}>
      <Text style={styles.sectionTitle}>
        {faithMode ? '📋 Kingdom Funnel Templates' : '📋 Funnel Templates'}
      </Text>
      <Text style={styles.sectionSubtitle}>
        {faithMode 
          ? 'Pre-built Kingdom-focused funnel templates' 
          : 'Pre-built funnel templates for quick setup'}
      </Text>

      <View style={styles.templatesGrid}>
        <TouchableOpacity style={styles.templateCard}>
          <LinearGradient
            colors={[KingdomColors.primary.royalPurple, KingdomColors.gold.bright]}
            style={styles.templateGradient}
          >
            <Text style={styles.templateIcon}>🧲</Text>
            <Text style={styles.templateTitle}>
              {faithMode ? 'Kingdom Lead Magnet' : 'Lead Magnet Funnel'}
            </Text>
            <Text style={styles.templateDescription}>
              {faithMode ? 'Attract Kingdom builders' : 'Convert visitors to leads'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.templateCard}>
          <LinearGradient
            colors={[KingdomColors.gold.warm, KingdomColors.primary.deepNavy]}
            style={styles.templateGradient}
          >
            <Text style={styles.templateIcon}>🎓</Text>
            <Text style={styles.templateTitle}>
              {faithMode ? 'Kingdom Course Funnel' : 'Course Sales Funnel'}
            </Text>
            <Text style={styles.templateDescription}>
              {faithMode ? 'Sell Kingdom education' : 'Sell online courses'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.templateCard}>
          <LinearGradient
            colors={[KingdomColors.accent.success, KingdomColors.primary.midnight]}
            style={styles.templateGradient}
          >
            <Text style={styles.templateIcon}>🎥</Text>
            <Text style={styles.templateTitle}>
              {faithMode ? 'Kingdom Webinar' : 'Webinar Funnel'}
            </Text>
            <Text style={styles.templateDescription}>
              {faithMode ? 'Host Kingdom teachings' : 'Host automated webinars'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.templateCard}>
          <LinearGradient
            colors={[KingdomColors.accent.info, KingdomColors.silver.bright]}
            style={styles.templateGradient}
          >
            <Text style={styles.templateIcon}>🏰</Text>
            <Text style={styles.templateTitle}>
              {faithMode ? 'Kingdom Membership' : 'Membership Funnel'}
            </Text>
            <Text style={styles.templateDescription}>
              {faithMode ? 'Build Kingdom community' : 'Recurring membership'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverview();
      case 'magnets':
        return renderLeadMagnets();
      case 'funnels':
        return renderFunnels();
      case 'templates':
        return renderTemplates();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.background.primary, KingdomColors.background.secondary]}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <KingdomLogo size="medium" />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {faithMode ? '🔄 Kingdom Funnels' : '🔄 Funnel Builder Pro'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {faithMode ? 'Build Kingdom impact funnels' : 'Replace ConvertKit & Kajabi'}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabContainer}
        >
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'magnets' && styles.activeTab]}
            onPress={() => setSelectedTab('magnets')}
          >
            <Text style={[styles.tabText, selectedTab === 'magnets' && styles.activeTabText]}>
              Lead Magnets
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'funnels' && styles.activeTab]}
            onPress={() => setSelectedTab('funnels')}
          >
            <Text style={[styles.tabText, selectedTab === 'funnels' && styles.activeTabText]}>
              Funnels
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'templates' && styles.activeTab]}
            onPress={() => setSelectedTab('templates')}
          >
            <Text style={[styles.tabText, selectedTab === 'templates' && styles.activeTabText]}>
              Templates
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {renderTabContent()}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerContent: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginTop: 2,
  },
  tabScroll: {
    marginVertical: 16,
  },
  tabContainer: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: KingdomColors.background.secondary,
    borderWidth: 1,
    borderColor: KingdomColors.gray,
  },
  activeTab: {
    backgroundColor: KingdomColors.primary.royalPurple,
    borderColor: KingdomColors.primary.royalPurple,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.secondary,
  },
  activeTabText: {
    color: KingdomColors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  overviewContainer: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 60) / 3,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...KingdomShadows.medium,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: KingdomColors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: KingdomColors.primary.royalPurple,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  toolGradient: {
    padding: 16,
    minHeight: 120,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolIcon: {
    fontSize: 20,
  },
  comingSoonBadge: {
    backgroundColor: KingdomColors.opacity.white20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 8,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 4,
    lineHeight: 18,
  },
  toolDescription: {
    fontSize: 11,
    color: KingdomColors.white,
    opacity: 0.9,
    lineHeight: 14,
  },
  magnetsContainer: {
    flex: 1,
  },
  magnetCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...KingdomShadows.medium,
  },
  magnetContent: {
    flex: 1,
  },
  magnetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  magnetIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  magnetInfo: {
    flex: 1,
  },
  magnetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  magnetDescription: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
    lineHeight: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: KingdomColors.white,
    textTransform: 'uppercase',
  },
  magnetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  magnetStat: {
    alignItems: 'center',
  },
  magnetStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  magnetStatLabel: {
    fontSize: 10,
    color: KingdomColors.text.secondary,
    marginTop: 2,
  },
  funnelsContainer: {
    flex: 1,
  },
  funnelCard: {
    backgroundColor: KingdomColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...KingdomShadows.medium,
  },
  funnelContent: {
    flex: 1,
  },
  funnelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  funnelIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  funnelInfo: {
    flex: 1,
  },
  funnelName: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  funnelType: {
    fontSize: 12,
    color: KingdomColors.text.secondary,
  },
  funnelMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  funnelMetric: {
    alignItems: 'center',
  },
  funnelMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  funnelMetricLabel: {
    fontSize: 10,
    color: KingdomColors.text.secondary,
    marginTop: 2,
  },
  templatesContainer: {
    flex: 1,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    ...KingdomShadows.medium,
  },
  templateGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  templateIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 4,
    textAlign: 'center',
  },
  templateDescription: {
    fontSize: 11,
    color: KingdomColors.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default FunnelsScreen;
