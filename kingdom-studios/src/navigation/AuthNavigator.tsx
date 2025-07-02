import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import CreatorDashboardScreen from '../screens/CreatorDashboardScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ContentGeneratorScreen from '../screens/ContentGeneratorScreen';
import ProductSyncScreen from '../screens/ProductSyncScreen';
import ForgeCommunityScreen from '../screens/ForgeCommunityScreen';
import SchedulingScreen from '../screens/SchedulingScreen';
import SponsorshipsScreen from '../screens/SponsorshipsScreen';
import SponsorshipRequestScreen from '../screens/SponsorshipRequestScreen';
import PricingScreen from '../screens/PricingScreen';
import AnalyticsOverviewScreen from '../screens/AnalyticsOverviewScreen';
import MonetizationScreen from '../screens/MonetizationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoadingScreen from '../screens/LoadingScreen';
import MultiPlatformPostScreen from '../screens/tools/MultiPlatformPostScreen';
import ContentLibraryScreen from '../screens/tools/ContentLibraryScreen';
import ScheduledPostsScreen from '../screens/tools/ScheduledPostsScreen';
import ProductDashboardScreen from '../screens/tools/ProductDashboardScreen';
import ProductDetailsScreen from '../screens/tools/ProductDetailsScreen';
import EditProductScreen from '../screens/tools/EditProductScreen';
import AddProductScreen from '../screens/tools/AddProductScreen';
import MentorshipHubScreen from '../screens/MentorshipHubScreen';
import MentorProfileScreen from '../screens/MentorProfileScreen';
import MentorshipRequestScreen from '../screens/MentorshipRequestScreen';
import MentorOnboardingScreen from '../screens/MentorOnboardingScreen';
import TeachingScreen from '../screens/TeachingScreen';
import TestimonyWallScreen from '../screens/TestimonyWallScreen';
import PrayerRoomScreen from '../screens/PrayerRoomScreen';
import ResourceLibraryScreen from '../screens/ResourceLibraryScreen';
import RefinersFireScreen from '../screens/RefinersFireScreen';
import MentorMatchingQuizScreen from '../screens/MentorMatchingQuizScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';
import HashtagManagerScreen from '../screens/HashtagManagerScreen';
import LinkInBioBuilderScreen from '../screens/LinkInBioBuilderScreen';
import DigitalProductManagerScreen from '../screens/DigitalProductManagerScreen';
import AffiliateHubScreen from '../screens/AffiliateHubScreen';
import ProductContentTemplatesScreen from '../screens/ProductContentTemplatesScreen';
import FaithContentCalendarScreen from '../screens/FaithContentCalendarScreen';
import AdvancedAnalyticsDashboardScreen from '../screens/AdvancedAnalyticsDashboardScreen';
import PodcastShortsHubScreen from '../screens/PodcastShortsHubScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ContentModerationScreen from '../screens/ContentModerationScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import FlagReviewScreen from '../screens/FlagReviewScreen';
import { ModerationAlertsScreen } from '../screens/ModerationAlertsScreen';
import { AdminSettingsScreen } from '../screens/AdminSettingsScreen';
import UserSuggestionScreen from '../screens/UserSuggestionScreen';
import VideoRecordingScreen from '../screens/VideoRecordingScreen';
import PhotoVideoFiltersScreen from '../screens/PhotoVideoFiltersScreen';
import VisualDiscoveryScreen from '../screens/VisualDiscoveryScreen';
import CanvaDesignToolScreen from '../screens/CanvaDesignToolScreen';
import EcommerceStoreBuilderScreen from '../screens/EcommerceStoreBuilderScreen';
import LeadMagnetBuilderScreen from '../screens/LeadMagnetBuilderScreen';
import AdLaunchToolScreen from '../screens/AdLaunchToolScreen';
import SalesFunnelBuilderScreen from '../screens/SalesFunnelBuilderScreen';
import EmailMarketingScreen from '../screens/EmailMarketingScreen';
import WebinarHostingScreen from '../screens/WebinarHostingScreen';
import SocialListeningScreen from '../screens/SocialListeningScreen';
import CRMScreen from '../screens/CRMScreen';
import WorkflowAutomationScreen from '../screens/WorkflowAutomationScreen';
import InfluencerOutreachScreen from '../screens/InfluencerOutreachScreen';
import AdminCouponManagerScreen from '../screens/AdminCouponManagerScreen';
import NotificationCenterScreen from '../screens/NotificationCenterScreen';
import TeamCollaborationScreen from '../screens/TeamCollaborationScreen';
import AdvancedAnalyticsHubScreen from '../screens/AdvancedAnalyticsHubScreen';
import LiveChatSupportScreen from '../screens/LiveChatSupportScreen';
import CommunityHubScreen from '../screens/CommunityHubScreen';
import AdvancedEcommerceScreen from '../screens/AdvancedEcommerceScreen';
import MobileOptimizationScreen from '../screens/MobileOptimizationScreen';
import FaithEnhancementHubScreen from '../screens/FaithEnhancementHubScreen';
import AdvancedProjectManagementScreen from '../screens/AdvancedProjectManagementScreen';
import MultiLanguageSupportScreen from '../screens/MultiLanguageSupportScreen';
import AdvancedSecurityCenterScreen from '../screens/AdvancedSecurityCenterScreen';
import APIIntegrationManagerScreen from '../screens/APIIntegrationManagerScreen';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { appState } = useApp();

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      {isAuthenticated ? (
        // User is signed in
        <>
          <Stack.Screen 
            name="CreatorDashboard" 
            component={CreatorDashboardScreen}
            options={{
              title: 'Creator Dashboard',
            }}
          />
          <Stack.Screen 
            name="ContentGenerator" 
            component={ContentGeneratorScreen}
            options={{
              title: 'Content Generator',
            }}
          />
          <Stack.Screen 
            name="ProductSync" 
            component={ProductSyncScreen}
            options={{
              title: 'Product Sync',
            }}
          />
          <Stack.Screen 
            name="ForgeCommunity" 
            component={ForgeCommunityScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Scheduling" 
            component={SchedulingScreen}
            options={{
              title: 'Scheduling',
            }}
          />
          <Stack.Screen 
            name="Sponsorships" 
            component={SponsorshipsScreen}
            options={{
              title: 'Sponsorships',
            }}
          />
          <Stack.Screen 
            name="AnalyticsOverview" 
            component={AnalyticsOverviewScreen}
            options={{
              title: 'Analytics',
            }}
          />
          <Stack.Screen 
            name="Monetization" 
            component={MonetizationScreen}
            options={{
              title: 'Monetization',
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              title: 'Settings',
            }}
          />
          <Stack.Screen 
            name="MultiPlatformPost" 
            component={MultiPlatformPostScreen}
            options={{
              title: 'Multi-Platform Post',
            }}
          />
          <Stack.Screen 
            name="ContentLibrary" 
            component={ContentLibraryScreen}
            options={{
              title: 'Content Library',
            }}
          />
          <Stack.Screen 
            name="ScheduledPosts" 
            component={ScheduledPostsScreen}
            options={{
              title: 'Scheduled Posts',
            }}
          />
          <Stack.Screen 
            name="ProductDashboard" 
            component={ProductDashboardScreen}
            options={{
              title: 'Product Dashboard',
            }}
          />
          <Stack.Screen 
            name="ProductDetails" 
            component={ProductDetailsScreen}
            options={{
              title: 'Product Details',
            }}
          />
          <Stack.Screen 
            name="EditProduct" 
            component={EditProductScreen}
            options={{
              title: 'Edit Product',
            }}
          />
          <Stack.Screen 
            name="AddProduct" 
            component={AddProductScreen}
            options={{
              title: 'Add Product',
            }}
          />
          <Stack.Screen 
            name="Onboarding" 
            component={OnboardingScreen}
            options={{
              title: 'Welcome',
            }}
          />
          <Stack.Screen 
            name="SponsorshipRequest" 
            component={SponsorshipRequestScreen}
            options={{
              title: 'Request Sponsorship',
            }}
          />
          <Stack.Screen 
            name="Pricing" 
            component={PricingScreen}
            options={{
              title: 'Pricing',
            }}
          />
          {/* Mentorship System Screens */}
          <Stack.Screen 
            name="MentorshipHub" 
            component={MentorshipHubScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="MentorProfile" 
            component={MentorProfileScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="MentorshipRequest" 
            component={MentorshipRequestScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="MentorOnboarding" 
            component={MentorOnboardingScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Teaching" 
            component={TeachingScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="TestimonyWall" 
            component={TestimonyWallScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="PrayerRoom" 
            component={PrayerRoomScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="ResourceLibrary" 
            component={ResourceLibraryScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="AIAssistant" 
            component={AIAssistantScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="HashtagManager" 
            component={HashtagManagerScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="LinkInBioBuilder" 
            component={LinkInBioBuilderScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="DigitalProductManager" 
            component={DigitalProductManagerScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="AffiliateHub" 
            component={AffiliateHubScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="ProductContentTemplates" 
            component={ProductContentTemplatesScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="FaithContentCalendar" 
            component={FaithContentCalendarScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="AdvancedAnalyticsDashboard" 
            component={AdvancedAnalyticsDashboardScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="PodcastShortsHub" 
            component={PodcastShortsHubScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="RefinersFireChallenge" 
            component={RefinersFireScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="MentorMatchingQuiz" 
            component={MentorMatchingQuizScreen}
            options={{
              headerShown: false,
            }}
          />
          {/* User Tools and Features */}
          <Stack.Screen 
            name="UserSuggestion" 
            component={UserSuggestionScreen}
            options={{
              title: 'App Suggestions',
            }}
          />
          <Stack.Screen 
            name="VideoRecording" 
            component={VideoRecordingScreen}
            options={{
              title: 'Video Recording',
            }}
          />
          <Stack.Screen 
            name="PhotoVideoFilters" 
            component={PhotoVideoFiltersScreen}
            options={{
              title: 'Photo & Video Filters',
            }}
          />
          <Stack.Screen 
            name="VisualDiscovery" 
            component={VisualDiscoveryScreen}
            options={{
              title: 'Visual Discovery',
            }}
          />
          <Stack.Screen 
            name="CanvaDesignTool" 
            component={CanvaDesignToolScreen}
            options={{
              title: 'Design Studio',
            }}
          />
          <Stack.Screen 
            name="EcommerceStoreBuilder" 
            component={EcommerceStoreBuilderScreen}
            options={{
              title: 'Store Builder',
            }}
          />
          <Stack.Screen 
            name="LeadMagnetBuilder" 
            component={LeadMagnetBuilderScreen}
            options={{
              title: 'Lead Magnet Builder',
            }}
          />
          <Stack.Screen 
            name="AdLaunchTool" 
            component={AdLaunchToolScreen}
            options={{
              title: 'Ad Launch Tool',
            }}
          />
          <Stack.Screen 
            name="SalesFunnelBuilder" 
            component={SalesFunnelBuilderScreen}
            options={{
              title: 'Sales Funnel Builder',
            }}
          />
          <Stack.Screen 
            name="EmailMarketing" 
            component={EmailMarketingScreen}
            options={{
              title: 'Email Marketing',
            }}
          />
          <Stack.Screen 
            name="WebinarHosting" 
            component={WebinarHostingScreen}
            options={{
              title: 'Webinar Hosting',
            }}
          />
          <Stack.Screen 
            name="SocialListening" 
            component={SocialListeningScreen}
            options={{
              title: 'Social Listening',
            }}
          />
          <Stack.Screen 
            name="CRM" 
            component={CRMScreen}
            options={{
              title: 'CRM',
            }}
          />
          <Stack.Screen 
            name="WorkflowAutomation" 
            component={WorkflowAutomationScreen}
            options={{
              title: 'Workflow Automation',
            }}
          />
          <Stack.Screen 
            name="InfluencerOutreach" 
            component={InfluencerOutreachScreen}
            options={{
              title: 'Influencer Outreach',
            }}
          />
          <Stack.Screen 
            name="NotificationCenter" 
            component={NotificationCenterScreen}
            options={{
              title: 'Notifications',
            }}
          />
          <Stack.Screen 
            name="TeamCollaboration" 
            component={TeamCollaborationScreen}
            options={{
              title: 'Team Collaboration',
            }}
          />
          <Stack.Screen 
            name="AdvancedAnalyticsHub" 
            component={AdvancedAnalyticsHubScreen}
            options={{
              title: 'Advanced Analytics',
            }}
          />
          <Stack.Screen 
            name="LiveChatSupport" 
            component={LiveChatSupportScreen}
            options={{
              title: 'Support',
            }}
          />
          <Stack.Screen 
            name="CommunityHub" 
            component={CommunityHubScreen}
            options={{
              title: 'Community',
            }}
          />
          <Stack.Screen 
            name="AdvancedEcommerce" 
            component={AdvancedEcommerceScreen}
            options={{
              title: 'E-commerce',
            }}
          />
          <Stack.Screen 
            name="MobileOptimization" 
            component={MobileOptimizationScreen}
            options={{
              title: 'Mobile & APIs',
            }}
          />
          <Stack.Screen 
            name="AdvancedProjectManagement" 
            component={AdvancedProjectManagementScreen}
            options={{
              title: 'Project Management',
            }}
          />
          <Stack.Screen 
            name="MultiLanguageSupport" 
            component={MultiLanguageSupportScreen}
            options={{
              title: 'Multi-Language',
            }}
          />
          <Stack.Screen 
            name="AdvancedSecurityCenter" 
            component={AdvancedSecurityCenterScreen}
            options={{
              title: 'Security Center',
            }}
          />
          <Stack.Screen 
            name="APIIntegrationManager" 
            component={APIIntegrationManagerScreen}
            options={{
              title: 'API Integrations',
            }}
          />
          {/* Admin Screens */}
          <Stack.Screen 
            name="AdminDashboard" 
            component={AdminDashboardScreen}
            options={{
              title: 'Admin Dashboard',
            }}
          />
          <Stack.Screen 
            name="ContentModeration" 
            component={ContentModerationScreen}
            options={{
              title: 'Content Moderation',
            }}
          />
          <Stack.Screen 
            name="UserManagement" 
            component={UserManagementScreen}
            options={{
              title: 'User Management',
            }}
          />
          <Stack.Screen 
            name="FlagReview" 
            component={FlagReviewScreen}
            options={{
              title: 'Review Flags',
            }}
          />
          <Stack.Screen 
            name="ModerationAlerts" 
            component={ModerationAlertsScreen}
            options={{
              title: 'Moderation Alerts',
            }}
          />
          <Stack.Screen 
            name="AdminSettings" 
            component={AdminSettingsScreen}
            options={{
              title: 'Admin Settings',
            }}
          />
          <Stack.Screen 
            name="AdminCouponManager" 
            component={AdminCouponManagerScreen}
            options={{
              title: 'Coupon Manager',
            }}
          />
        </>
      ) : (
        // User is not signed in
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              title: 'Welcome to Kingdom Studios',
            }}
          />
          <Stack.Screen 
            name="Onboarding" 
            component={OnboardingScreen}
            options={{
              title: 'Welcome',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
