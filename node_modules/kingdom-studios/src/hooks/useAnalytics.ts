import { useCallback } from 'react';
import AnalyticsTracker from '../services/AnalyticsTracker';

export const useAnalytics = () => {
  const tracker = AnalyticsTracker.getInstance();

  // Content tracking hooks
  const trackTestimonyShared = useCallback((testimonyId: string, platform?: string) => {
    tracker.trackTestimonyShared(testimonyId, platform);
  }, [tracker]);

  const trackTestimonyViewed = useCallback((testimonyId: string, platform?: string) => {
    tracker.trackTestimonyViewed(testimonyId, platform);
  }, [tracker]);

  const trackResourceAccessed = useCallback((resourceId: string, category: string) => {
    tracker.trackResourceAccessed(resourceId, category);
  }, [tracker]);

  const trackPrayerRequestSubmitted = useCallback(() => {
    tracker.trackPrayerRequestSubmitted();
  }, [tracker]);

  const trackChallengeCompleted = useCallback((challengeId: string, progress: number) => {
    tracker.trackChallengeCompleted(challengeId, progress);
  }, [tracker]);

  // Engagement tracking hooks
  const trackPostEngagement = useCallback((postId: string, engagementType: 'like' | 'share' | 'comment', platform: string) => {
    tracker.trackPostEngagement(postId, engagementType, platform);
  }, [tracker]);

  const trackContentReach = useCallback((contentId: string, reach: number, platform: string) => {
    tracker.trackContentReach(contentId, reach, platform);
  }, [tracker]);

  const trackFollowerGrowth = useCallback((platform: string, newFollowers: number) => {
    tracker.trackFollowerGrowth(platform, newFollowers);
  }, [tracker]);

  // Business tracking hooks
  const trackProductSale = useCallback((productId: string, amount: number, platform?: string) => {
    tracker.trackProductSale(productId, amount, platform);
  }, [tracker]);

  const trackAffiliateEarning = useCallback((affiliateId: string, amount: number, platform?: string) => {
    tracker.trackAffiliateEarning(affiliateId, amount, platform);
  }, [tracker]);

  const trackSponsorshipEarning = useCallback((sponsorshipId: string, amount: number) => {
    tracker.trackSponsorshipEarning(sponsorshipId, amount);
  }, [tracker]);

  const trackSubscriptionPurchase = useCallback((planId: string, amount: number) => {
    tracker.trackSubscriptionPurchase(planId, amount);
  }, [tracker]);

  // Link and conversion tracking hooks
  const trackLinkClick = useCallback((linkId: string, destination: string, platform?: string) => {
    tracker.trackLinkClick(linkId, destination, platform);
  }, [tracker]);

  const trackConversion = useCallback((conversionType: string, value: number, source?: string) => {
    tracker.trackConversion(conversionType, value, source);
  }, [tracker]);

  const trackBioLinkClick = useCallback((linkType: string, destination: string) => {
    tracker.trackBioLinkClick(linkType, destination);
  }, [tracker]);

  // Content creation tracking hooks
  const trackContentCreated = useCallback((contentType: string, platform: string, hashtags?: string[]) => {
    tracker.trackContentCreated(contentType, platform, hashtags);
  }, [tracker]);

  const trackHashtagUsed = useCallback((hashtag: string, platform: string, reach?: number) => {
    tracker.trackHashtagUsed(hashtag, platform, reach);
  }, [tracker]);

  const trackTemplateUsed = useCallback((templateId: string, category: string) => {
    tracker.trackTemplateUsed(templateId, category);
  }, [tracker]);

  const trackCalendarEventCreated = useCallback((eventType: string, scheduledDate: string) => {
    tracker.trackCalendarEventCreated(eventType, scheduledDate);
  }, [tracker]);

  // AI and automation tracking hooks
  const trackAIAssistantQuery = useCallback((queryType: string, category: string) => {
    tracker.trackAIAssistantQuery(queryType, category);
  }, [tracker]);

  const trackAIContentGenerated = useCallback((contentType: string, wordCount: number) => {
    tracker.trackAIContentGenerated(contentType, wordCount);
  }, [tracker]);

  const trackAutomationUsed = useCallback((automationType: string, platform: string) => {
    tracker.trackAutomationUsed(automationType, platform);
  }, [tracker]);

  // User journey tracking hooks
  const trackScreenView = useCallback((screenName: string, timeSpent?: number) => {
    tracker.trackScreenView(screenName, timeSpent);
  }, [tracker]);

  const trackFeatureUsed = useCallback((featureName: string, duration?: number) => {
    tracker.trackFeatureUsed(featureName, duration);
  }, [tracker]);

  const trackOnboardingStep = useCallback((step: string, completed: boolean) => {
    tracker.trackOnboardingStep(step, completed);
  }, [tracker]);

  // Community and mentorship tracking hooks
  const trackMentorshipRequest = useCallback((mentorId: string, category: string) => {
    tracker.trackMentorshipRequest(mentorId, category);
  }, [tracker]);

  const trackMentorshipSession = useCallback((sessionId: string, duration: number) => {
    tracker.trackMentorshipSession(sessionId, duration);
  }, [tracker]);

  const trackCommunityEngagement = useCallback((engagementType: string, targetId: string) => {
    tracker.trackCommunityEngagement(engagementType, targetId);
  }, [tracker]);

  // Error and performance tracking hooks
  const trackError = useCallback((errorType: string, errorMessage: string, screen?: string) => {
    tracker.trackError(errorType, errorMessage, screen);
  }, [tracker]);

  const trackPerformance = useCallback((metric: string, value: number, context?: string) => {
    tracker.trackPerformance(metric, value, context);
  }, [tracker]);

  // Custom event tracking hook
  const trackCustomEvent = useCallback((eventName: string, value: number, properties?: Record<string, any>) => {
    tracker.trackCustomEvent(eventName, value, properties);
  }, [tracker]);

  return {
    // Content tracking
    trackTestimonyShared,
    trackTestimonyViewed,
    trackResourceAccessed,
    trackPrayerRequestSubmitted,
    trackChallengeCompleted,
    
    // Engagement tracking
    trackPostEngagement,
    trackContentReach,
    trackFollowerGrowth,
    
    // Business tracking
    trackProductSale,
    trackAffiliateEarning,
    trackSponsorshipEarning,
    trackSubscriptionPurchase,
    
    // Link and conversion tracking
    trackLinkClick,
    trackConversion,
    trackBioLinkClick,
    
    // Content creation tracking
    trackContentCreated,
    trackHashtagUsed,
    trackTemplateUsed,
    trackCalendarEventCreated,
    
    // AI and automation tracking
    trackAIAssistantQuery,
    trackAIContentGenerated,
    trackAutomationUsed,
    
    // User journey tracking
    trackScreenView,
    trackFeatureUsed,
    trackOnboardingStep,
    
    // Community and mentorship tracking
    trackMentorshipRequest,
    trackMentorshipSession,
    trackCommunityEngagement,
    
    // Error and performance tracking
    trackError,
    trackPerformance,
    
    // Custom event tracking
    trackCustomEvent,
  };
};
