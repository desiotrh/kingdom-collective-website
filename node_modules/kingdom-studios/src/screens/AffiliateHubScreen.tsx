import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  Modal,
  FlatList,
  Share,
  Linking,
  Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KingdomColors } from '../constants/KingdomColors';
import { useAuth } from '../contexts/AuthContext';
import { AppMode } from '../types/spiritual';

interface AffiliateProgram {
  id: string;
  name: string;
  brand: string;
  description: string;
  commissionRate: number;
  commissionType: 'percentage' | 'fixed';
  cookieDuration: number; // days
  category: string;
  logoUrl: string;
  website: string;
  isActive: boolean;
  applicationStatus: 'pending' | 'approved' | 'rejected';
  joinedAt?: string;
  lastPayment?: string;
  totalEarnings: number;
  clickCount: number;
  conversionCount: number;
  paymentThreshold: number;
  paymentFrequency: 'weekly' | 'monthly' | 'quarterly';
  specialOffers?: string[];
  faithMode?: {
    ministry: boolean;
    christianValues: boolean;
    familyFriendly: boolean;
    charitableGiving: boolean;
  };
  encouragementMode?: {
    empowerment: boolean;
    selfCare: boolean;
    motivational: boolean;
    entrepreneurship: boolean;
  };
}

interface AffiliateLink {
  id: string;
  programId: string;
  originalUrl: string;
  affiliateUrl: string;
  customAlias?: string;
  title: string;
  description: string;
  createdAt: string;
  clicks: number;
  conversions: number;
  earnings: number;
  isActive: boolean;
  tags: string[];
}

interface AffiliateAnalytics {
  totalEarnings: number;
  monthlyEarnings: number;
  totalClicks: number;
  totalConversions: number;
  averageCommission: number;
  topPerformingProgram: string;
  conversionRate: number;
  pendingPayments: number;
}

const AffiliateHubScreen: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AppMode>('faith');
  const [activeTab, setActiveTab] = useState<'programs' | 'links' | 'analytics' | 'discover'>('programs');
  const [programs, setPrograms] = useState<AffiliateProgram[]>([]);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [analytics, setAnalytics] = useState<AffiliateAnalytics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateLinkModalVisible, setIsCreateLinkModalVisible] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<AffiliateProgram | null>(null);
  const [newLink, setNewLink] = useState({
    originalUrl: '',
    title: '',
    description: '',
    customAlias: '',
    tags: [] as string[],
  });

  const categories = [
    'all',
    'digital-products',
    'courses',
    'books',
    'software',
    'faith-based',
    'lifestyle',
    'business-tools',
    'marketing',
    'wellness',
  ];

  useEffect(() => {
    loadPrograms();
    loadLinks();
    loadAnalytics();
  }, [mode]);

  const loadPrograms = () => {
    // Mock data - in real app, this would come from Firebase/API
    const mockPrograms: AffiliateProgram[] = mode === 'faith' ? [
      {
        id: '1',
        name: 'Kingdom Business Academy',
        brand: 'KBA',
        description: 'Faith-based business training and courses',
        commissionRate: 30,
        commissionType: 'percentage',
        cookieDuration: 60,
        category: 'courses',
        logoUrl: 'https://example.com/kba-logo.png',
        website: 'https://kingdombusinessacademy.com',
        isActive: true,
        applicationStatus: 'approved',
        joinedAt: '2024-01-15',
        totalEarnings: 1250.00,
        clickCount: 847,
        conversionCount: 23,
        paymentThreshold: 100,
        paymentFrequency: 'monthly',
        specialOffers: ['New Year 40% off', 'Easter Special'],
        faithMode: {
          ministry: true,
          christianValues: true,
          familyFriendly: true,
          charitableGiving: true,
        },
      },
      {
        id: '2',
        name: 'Christian Book Publishers',
        brand: 'CBP',
        description: 'Inspirational and biblical literature',
        commissionRate: 15,
        commissionType: 'percentage',
        cookieDuration: 30,
        category: 'books',
        logoUrl: 'https://example.com/cbp-logo.png',
        website: 'https://christianbookpublishers.com',
        isActive: true,
        applicationStatus: 'approved',
        joinedAt: '2024-02-01',
        totalEarnings: 680.50,
        clickCount: 432,
        conversionCount: 18,
        paymentThreshold: 50,
        paymentFrequency: 'monthly',
        faithMode: {
          ministry: true,
          christianValues: true,
          familyFriendly: true,
          charitableGiving: false,
        },
      },
      {
        id: '3',
        name: 'Faith-Tech Software',
        brand: 'FTS',
        description: 'Church management and ministry software',
        commissionRate: 25,
        commissionType: 'percentage',
        cookieDuration: 90,
        category: 'software',
        logoUrl: 'https://example.com/fts-logo.png',
        website: 'https://faithtechsoftware.com',
        isActive: true,
        applicationStatus: 'pending',
        totalEarnings: 0,
        clickCount: 0,
        conversionCount: 0,
        paymentThreshold: 200,
        paymentFrequency: 'monthly',
        faithMode: {
          ministry: true,
          christianValues: true,
          familyFriendly: true,
          charitableGiving: false,
        },
      },
    ] : [
      {
        id: '4',
        name: 'Entrepreneur Mastery Hub',
        brand: 'EMH',
        description: 'Business growth and marketing courses',
        commissionRate: 35,
        commissionType: 'percentage',
        cookieDuration: 45,
        category: 'courses',
        logoUrl: 'https://example.com/emh-logo.png',
        website: 'https://entrepreneurmasteryhub.com',
        isActive: true,
        applicationStatus: 'approved',
        joinedAt: '2024-01-20',
        totalEarnings: 2150.00,
        clickCount: 1250,
        conversionCount: 35,
        paymentThreshold: 100,
        paymentFrequency: 'monthly',
        encouragementMode: {
          empowerment: true,
          selfCare: false,
          motivational: true,
          entrepreneurship: true,
        },
      },
      {
        id: '5',
        name: 'Digital Marketing Pro',
        brand: 'DMP',
        description: 'Advanced marketing tools and software',
        commissionRate: 40,
        commissionType: 'percentage',
        cookieDuration: 60,
        category: 'software',
        logoUrl: 'https://example.com/dmp-logo.png',
        website: 'https://digitalmarketingpro.com',
        isActive: true,
        applicationStatus: 'approved',
        joinedAt: '2024-02-10',
        totalEarnings: 890.25,
        clickCount: 567,
        conversionCount: 12,
        paymentThreshold: 150,
        paymentFrequency: 'monthly',
        encouragementMode: {
          empowerment: true,
          selfCare: false,
          motivational: true,
          entrepreneurship: true,
        },
      },
      {
        id: '6',
        name: 'Self-Care Essentials',
        brand: 'SCE',
        description: 'Wellness and self-care products',
        commissionRate: 20,
        commissionType: 'percentage',
        cookieDuration: 30,
        category: 'wellness',
        logoUrl: 'https://example.com/sce-logo.png',
        website: 'https://selfcareessentials.com',
        isActive: true,
        applicationStatus: 'approved',
        joinedAt: '2024-03-01',
        totalEarnings: 445.80,
        clickCount: 298,
        conversionCount: 8,
        paymentThreshold: 75,
        paymentFrequency: 'monthly',
        encouragementMode: {
          empowerment: true,
          selfCare: true,
          motivational: true,
          entrepreneurship: false,
        },
      },
    ];

    setPrograms(mockPrograms);
  };

  const loadLinks = () => {
    // Mock data - in real app, this would come from Firebase/API
    const mockLinks: AffiliateLink[] = [
      {
        id: '1',
        programId: '1',
        originalUrl: 'https://kingdombusinessacademy.com/courses/startup-guide',
        affiliateUrl: 'https://kingdombusinessacademy.com/courses/startup-guide?ref=user123',
        customAlias: 'faith-startup-guide',
        title: 'Faith-Based Startup Guide',
        description: 'Complete guide to starting a God-centered business',
        createdAt: '2024-06-01',
        clicks: 245,
        conversions: 8,
        earnings: 375.00,
        isActive: true,
        tags: ['startup', 'faith', 'business'],
      },
      {
        id: '2',
        programId: '2',
        originalUrl: 'https://christianbookpublishers.com/books/prayer-journal',
        affiliateUrl: 'https://christianbookpublishers.com/books/prayer-journal?ref=user123',
        customAlias: 'daily-prayer-journal',
        title: 'Daily Prayer Journal',
        description: 'Beautiful prayer journal for daily devotions',
        createdAt: '2024-06-15',
        clicks: 189,
        conversions: 12,
        earnings: 142.50,
        isActive: true,
        tags: ['prayer', 'journal', 'devotion'],
      },
    ];

    setLinks(mockLinks);
  };

  const loadAnalytics = () => {
    // Mock analytics data
    const mockAnalytics: AffiliateAnalytics = {
      totalEarnings: 3456.55,
      monthlyEarnings: 892.30,
      totalClicks: 2847,
      totalConversions: 78,
      averageCommission: 44.31,
      topPerformingProgram: mode === 'faith' ? 'Kingdom Business Academy' : 'Entrepreneur Mastery Hub',
      conversionRate: 2.74,
      pendingPayments: 245.80,
    };

    setAnalytics(mockAnalytics);
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const createAffiliateLink = () => {
    if (!selectedProgram || !newLink.originalUrl || !newLink.title) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const affiliateLink: AffiliateLink = {
      id: Date.now().toString(),
      programId: selectedProgram.id,
      originalUrl: newLink.originalUrl,
      affiliateUrl: `${newLink.originalUrl}?ref=user123`,
      customAlias: newLink.customAlias || undefined,
      title: newLink.title,
      description: newLink.description,
      createdAt: new Date().toISOString(),
      clicks: 0,
      conversions: 0,
      earnings: 0,
      isActive: true,
      tags: newLink.tags,
    };

    setLinks(prev => [affiliateLink, ...prev]);
    setIsCreateLinkModalVisible(false);
    setNewLink({
      originalUrl: '',
      title: '',
      description: '',
      customAlias: '',
      tags: [],
    });
    setSelectedProgram(null);

    Alert.alert('Success', 'Affiliate link created successfully!');
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setString(text);
    Alert.alert('Copied', 'Link copied to clipboard!');
  };

  const shareLink = async (link: AffiliateLink) => {
    try {
      await Share.share({
        message: `Check out this amazing ${link.title}: ${link.affiliateUrl}`,
        url: link.affiliateUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const applyToProgram = (program: AffiliateProgram) => {
    // In real app, this would send application to affiliate network
    Alert.alert(
      'Application Submitted',
      `Your application to ${program.name} has been submitted. You'll receive a notification when it's reviewed.`
    );
  };

  const renderProgramCard = ({ item: program }: { item: AffiliateProgram }) => (
    <View style={styles.programCard}>
      <View style={styles.programHeader}>
        <Image source={{ uri: program.logoUrl }} style={styles.programLogo} />
        <View style={styles.programInfo}>
          <Text style={styles.programName}>{program.name}</Text>
          <Text style={styles.programBrand}>{program.brand}</Text>
          <View style={styles.commissionBadge}>
            <Text style={styles.commissionText}>
              {program.commissionRate}{program.commissionType === 'percentage' ? '%' : '$'} Commission
            </Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={[
            styles.statusText,
            { color: program.applicationStatus === 'approved' ? KingdomColors.accent.success : 
                     program.applicationStatus === 'pending' ? KingdomColors.accent.warning :
                     KingdomColors.accent.error }
          ]}>
            {program.applicationStatus.charAt(0).toUpperCase() + program.applicationStatus.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.programDescription}>{program.description}</Text>

      <View style={styles.programStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{program.totalEarnings.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{program.clickCount}</Text>
          <Text style={styles.statLabel}>Clicks</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{program.conversionCount}</Text>
          <Text style={styles.statLabel}>Conversions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{program.cookieDuration}d</Text>
          <Text style={styles.statLabel}>Cookie</Text>
        </View>
      </View>

      <View style={styles.programActions}>
        {program.applicationStatus === 'approved' ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setSelectedProgram(program);
              setIsCreateLinkModalVisible(true);
            }}
          >
            <Text style={styles.primaryButtonText}>Create Link</Text>
          </TouchableOpacity>
        ) : program.applicationStatus === 'pending' ? (
          <View style={styles.pendingButton}>
            <Text style={styles.pendingButtonText}>Application Pending</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => applyToProgram(program)}
          >
            <Text style={styles.primaryButtonText}>Apply Now</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => Linking.openURL(program.website)}
        >
          <Ionicons name="open-outline" size={16} color={KingdomColors.gold.bright} />
          <Text style={styles.secondaryButtonText}>Visit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLinkCard = ({ item: link }: { item: AffiliateLink }) => {
    const program = programs.find(p => p.id === link.programId);
    const conversionRate = link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(1) : '0';

    return (
      <View style={styles.linkCard}>
        <View style={styles.linkHeader}>
          <View style={styles.linkInfo}>
            <Text style={styles.linkTitle}>{link.title}</Text>
            <Text style={styles.linkProgram}>{program?.name}</Text>
            {link.customAlias && (
              <Text style={styles.linkAlias}>/{link.customAlias}</Text>
            )}
          </View>
          <View style={styles.linkActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => copyToClipboard(link.affiliateUrl)}
            >
              <Ionicons name="copy-outline" size={20} color={KingdomColors.gold.bright} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => shareLink(link)}
            >
              <Ionicons name="share-outline" size={20} color={KingdomColors.gold.bright} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.linkDescription}>{link.description}</Text>

        <View style={styles.linkStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{link.clicks}</Text>
            <Text style={styles.statLabel}>Clicks</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{link.conversions}</Text>
            <Text style={styles.statLabel}>Conversions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{conversionRate}%</Text>
            <Text style={styles.statLabel}>Rate</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${link.earnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>

        <View style={styles.linkTags}>
          {link.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderAnalytics = () => {
    if (!analytics) return null;

    return (
      <ScrollView style={styles.analyticsContainer}>
        <View style={styles.analyticsHeader}>
          <Text style={styles.analyticsTitle}>
            {mode === 'faith' ? '🙏 Ministry Earnings' : '💪 Empowerment Earnings'}
          </Text>
          <Text style={styles.analyticsSubtitle}>Track your affiliate success</Text>
        </View>

        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>${analytics.totalEarnings.toFixed(2)}</Text>
            <Text style={styles.analyticsLabel}>Total Earnings</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>${analytics.monthlyEarnings.toFixed(2)}</Text>
            <Text style={styles.analyticsLabel}>This Month</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>{analytics.totalClicks.toLocaleString()}</Text>
            <Text style={styles.analyticsLabel}>Total Clicks</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>{analytics.totalConversions}</Text>
            <Text style={styles.analyticsLabel}>Conversions</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>{analytics.conversionRate}%</Text>
            <Text style={styles.analyticsLabel}>Conversion Rate</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>${analytics.pendingPayments.toFixed(2)}</Text>
            <Text style={styles.analyticsLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.topPerformer}>
          <Text style={styles.topPerformerTitle}>🏆 Top Performing Program</Text>
          <Text style={styles.topPerformerName}>{analytics.topPerformingProgram}</Text>
          <Text style={styles.topPerformerEarnings}>
            Avg. ${analytics.averageCommission.toFixed(2)} per conversion
          </Text>
        </View>
      </ScrollView>
    );
  };

  const renderDiscoverPrograms = () => {
    const suggestedPrograms = mode === 'faith' ? [
      {
        name: 'Bible Study Tools Pro',
        category: 'Software',
        commission: '25%',
        description: 'Advanced Bible study and sermon preparation software',
        values: ['Ministry', 'Biblical'],
      },
      {
        name: 'Christian Entrepreneur Course',
        category: 'Course',
        commission: '40%',
        description: 'Learn to build God-honoring businesses',
        values: ['Business', 'Faith'],
      },
      {
        name: 'Worship Music Library',
        category: 'Digital Product',
        commission: '30%',
        description: 'Royalty-free worship music for churches',
        values: ['Worship', 'Ministry'],
      },
    ] : [
      {
        name: 'Business Growth Accelerator',
        category: 'Course',
        commission: '45%',
        description: 'Scale your business with proven strategies',
        values: ['Entrepreneurship', 'Growth'],
      },
      {
        name: 'Productivity Mastery Suite',
        category: 'Software',
        commission: '35%',
        description: 'Time management and productivity tools',
        values: ['Productivity', 'Success'],
      },
      {
        name: 'Wellness & Balance Program',
        category: 'Course',
        commission: '28%',
        description: 'Achieve work-life balance and wellness',
        values: ['Self-Care', 'Balance'],
      },
    ];

    return (
      <ScrollView style={styles.discoverContainer}>
        <View style={styles.discoverHeader}>
          <Text style={styles.discoverTitle}>
            {mode === 'faith' ? '✨ Discover Faith-Aligned Programs' : '🚀 Discover Empowerment Programs'}
          </Text>
          <Text style={styles.discoverSubtitle}>
            {mode === 'faith' 
              ? 'Programs that align with your Christian values'
              : 'Programs that support personal and business growth'
            }
          </Text>
        </View>

        {suggestedPrograms.map((program, index) => (
          <View key={index} style={styles.suggestedProgramCard}>
            <View style={styles.suggestedProgramHeader}>
              <Text style={styles.suggestedProgramName}>{program.name}</Text>
              <View style={styles.commissionBadge}>
                <Text style={styles.commissionText}>{program.commission}</Text>
              </View>
            </View>
            <Text style={styles.suggestedProgramCategory}>{program.category}</Text>
            <Text style={styles.suggestedProgramDescription}>{program.description}</Text>
            
            <View style={styles.valuesBadges}>
              {program.values.map((value: string, idx: number) => (
                <View key={idx} style={styles.valueBadge}>
                  <Text style={styles.valueBadgeText}>{value}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>Learn More</Text>
              <Ionicons name="arrow-forward" size={16} color={KingdomColors.gold.bright} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={mode === 'faith' 
          ? [KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]
          : [KingdomColors.gold.bright, KingdomColors.gold.warm]
        }
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {mode === 'faith' ? '🤝 Affiliate Ministry Hub' : '💼 Affiliate Business Hub'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {mode === 'faith' 
              ? 'Earn while sharing kingdom values'
              : 'Monetize your audience with purpose'
            }
          </Text>
          
          <TouchableOpacity
            style={styles.modeToggle}
            onPress={() => setMode(mode === 'faith' ? 'encouragement' : 'faith')}
          >
            <Text style={styles.modeToggleText}>
              Switch to {mode === 'faith' ? 'Encouragement' : 'Faith'} Mode
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['programs', 'links', 'analytics', 'discover'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Ionicons
              name={
                tab === 'programs' ? 'business-outline' :
                tab === 'links' ? 'link-outline' :
                tab === 'analytics' ? 'stats-chart-outline' :
                'search-outline'
              }
              size={20}
              color={activeTab === tab ? KingdomColors.white : KingdomColors.silver.light}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'programs' && (
        <View style={styles.content}>
          {/* Search and Filter */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={KingdomColors.silver.steel} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search affiliate programs..."
                placeholderTextColor={KingdomColors.silver.steel}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.activeCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.activeCategoryButtonText
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredPrograms}
            renderItem={renderProgramCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {activeTab === 'links' && (
        <View style={styles.content}>
          <View style={styles.linksHeader}>
            <Text style={styles.sectionTitle}>My Affiliate Links</Text>
            <TouchableOpacity
              style={styles.addLinkButton}
              onPress={() => setIsCreateLinkModalVisible(true)}
            >
              <Ionicons name="add" size={20} color={KingdomColors.white} />
              <Text style={styles.addLinkButtonText}>Create Link</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={links}
            renderItem={renderLinkCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {activeTab === 'analytics' && renderAnalytics()}

      {activeTab === 'discover' && renderDiscoverPrograms()}

      {/* Create Link Modal */}
      <Modal
        visible={isCreateLinkModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Affiliate Link</Text>
            <TouchableOpacity
              onPress={() => setIsCreateLinkModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={KingdomColors.text.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Select Program *</Text>
            <TouchableOpacity
              style={styles.programSelector}
              onPress={() => {
                // In real app, this would open a program picker
                Alert.alert('Select Program', 'Choose from your approved affiliate programs');
              }}
            >
              <Text style={styles.programSelectorText}>
                {selectedProgram ? selectedProgram.name : 'Choose a program...'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={KingdomColors.silver.steel} />
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Original URL *</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/product"
              placeholderTextColor={KingdomColors.silver.steel}
              value={newLink.originalUrl}
              onChangeText={(text) => setNewLink(prev => ({ ...prev, originalUrl: text }))}
            />

            <Text style={styles.inputLabel}>Link Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="My Amazing Product Recommendation"
              placeholderTextColor={KingdomColors.silver.steel}
              value={newLink.title}
              onChangeText={(text) => setNewLink(prev => ({ ...prev, title: text }))}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe why you recommend this product..."
              placeholderTextColor={KingdomColors.silver.steel}
              value={newLink.description}
              onChangeText={(text) => setNewLink(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.inputLabel}>Custom Alias (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="my-recommendation"
              placeholderTextColor={KingdomColors.silver.steel}
              value={newLink.customAlias}
              onChangeText={(text) => setNewLink(prev => ({ ...prev, customAlias: text }))}
            />

            <TouchableOpacity style={styles.createButton} onPress={createAffiliateLink}>
              <LinearGradient
                colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
                style={styles.createButtonGradient}
              >
                <Text style={styles.createButtonText}>Create Affiliate Link</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: KingdomColors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
  },
  modeToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeToggleText: {
    color: KingdomColors.white,
    fontWeight: '600',
  },
  tabContainer: {
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
    gap: 8,
  },
  activeTab: {
    backgroundColor: KingdomColors.gold.bright,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.muted,
  },
  activeTabText: {
    color: KingdomColors.white,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.silver.platinum,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: KingdomColors.text.primary,
  },
  categoryFilter: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: KingdomColors.silver.platinum,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeCategoryButton: {
    backgroundColor: KingdomColors.gold.bright,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.muted,
  },
  activeCategoryButtonText: {
    color: KingdomColors.white,
  },
  listContainer: {
    padding: 16,
  },
  programCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  programLogo: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  programInfo: {
    flex: 1,
    marginLeft: 16,
  },
  programName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  programBrand: {
    fontSize: 14,
    color: KingdomColors.silver.steel,
    marginBottom: 8,
  },
  commissionBadge: {
    backgroundColor: KingdomColors.gold.bright,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  commissionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: KingdomColors.silver.platinum,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  programDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  programStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: KingdomColors.silver.steel,
    marginTop: 2,
  },
  programActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: KingdomColors.gold.bright,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  pendingButton: {
    flex: 1,
    backgroundColor: KingdomColors.silver.light,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  pendingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.silver.steel,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.silver.platinum,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
  },
  linksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  addLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KingdomColors.gold.bright,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addLinkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  linkCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  linkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  linkProgram: {
    fontSize: 14,
    color: KingdomColors.silver.steel,
    marginBottom: 2,
  },
  linkAlias: {
    fontSize: 12,
    color: KingdomColors.gold.bright,
    fontFamily: 'monospace',
  },
  linkActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: KingdomColors.silver.platinum,
  },
  linkDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  linkStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  linkTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: KingdomColors.silver.platinum,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: KingdomColors.text.muted,
    fontWeight: '500',
  },
  analyticsContainer: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  analyticsHeader: {
    padding: 20,
    backgroundColor: KingdomColors.white,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  analyticsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  analyticsSubtitle: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  analyticsCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
  topPerformer: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  topPerformerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
  },
  topPerformerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.gold.bright,
    marginBottom: 4,
  },
  topPerformerEarnings: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
  },
  discoverContainer: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  discoverHeader: {
    padding: 20,
    backgroundColor: KingdomColors.white,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  discoverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  discoverSubtitle: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    textAlign: 'center',
  },
  suggestedProgramCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  suggestedProgramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  suggestedProgramName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
    flex: 1,
  },
  suggestedProgramCategory: {
    fontSize: 14,
    color: KingdomColors.silver.steel,
    marginBottom: 12,
  },
  suggestedProgramDescription: {
    fontSize: 14,
    color: KingdomColors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  valuesBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  valueBadge: {
    backgroundColor: KingdomColors.gold.bright,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  valueBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: KingdomColors.white,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: KingdomColors.silver.platinum,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  learnMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.gold.bright,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: KingdomColors.white,
    borderBottomWidth: 1,
    borderBottomColor: KingdomColors.silver.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: KingdomColors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: KingdomColors.text.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: KingdomColors.white,
    borderWidth: 1,
    borderColor: KingdomColors.silver.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: KingdomColors.text.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  programSelector: {
    backgroundColor: KingdomColors.white,
    borderWidth: 1,
    borderColor: KingdomColors.silver.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programSelectorText: {
    fontSize: 16,
    color: KingdomColors.text.primary,
  },
  createButton: {
    marginTop: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  createButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.white,
  },
});

export default React.memo(AffiliateHubScreen);
