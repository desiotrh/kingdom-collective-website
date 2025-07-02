import AnalyticsService from './AnalyticsService';

export class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  private analyticsService: AnalyticsService;

  private constructor() {
    this.analyticsService = AnalyticsService.getInstance();
  }

  public static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  // Content tracking
  public trackTestimonyShared(testimonyId: string, platform?: string): void {
    this.analyticsService.trackEvent('testimony_shared', 1, {
      type: 'content',
      testimonyId,
      platform,
      category: 'spiritual',
    });
  }

  public trackTestimonyViewed(testimonyId: string, platform?: string): void {
    this.analyticsService.trackEvent('testimony_viewed', 1, {
      type: 'view',
      testimonyId,
      platform,
      category: 'spiritual',
    });
  }

  public trackResourceAccessed(resourceId: string, category: string): void {
    this.analyticsService.trackEvent('resource_accessed', 1, {
      type: 'content',
      resourceId,
      category,
    });
  }

  public trackPrayerRequestSubmitted(): void {
    this.analyticsService.trackEvent('prayer_request_submitted', 1, {
      type: 'spiritual',
      category: 'prayer',
    });
  }

  public trackChallengeCompleted(challengeId: string, progress: number): void {
    this.analyticsService.trackEvent('challenge_completed', progress, {
      type: 'spiritual',
      challengeId,
      category: 'growth',
    });
  }

  // Engagement tracking
  public trackPostEngagement(postId: string, engagementType: 'like' | 'share' | 'comment', platform: string): void {
    this.analyticsService.trackEvent('post_engagement', 1, {
      type: 'engagement',
      postId,
      engagementType,
      platform,
    });
  }

  public trackContentReach(contentId: string, reach: number, platform: string): void {
    this.analyticsService.trackEvent('content_reach', reach, {
      type: 'reach',
      contentId,
      platform,
    });
  }

  public trackFollowerGrowth(platform: string, newFollowers: number): void {
    this.analyticsService.trackEvent('follower_growth', newFollowers, {
      type: 'followers',
      platform,
    });
  }

  // Business tracking
  public trackProductSale(productId: string, amount: number, platform?: string): void {
    this.analyticsService.trackEvent('product_sale', amount, {
      type: 'revenue',
      productId,
      platform,
      category: 'product',
    });
  }

  public trackAffiliateEarning(affiliateId: string, amount: number, platform?: string): void {
    this.analyticsService.trackEvent('affiliate_earning', amount, {
      type: 'revenue',
      affiliateId,
      platform,
      category: 'affiliate',
    });
  }

  public trackSponsorshipEarning(sponsorshipId: string, amount: number): void {
    this.analyticsService.trackEvent('sponsorship_earning', amount, {
      type: 'revenue',
      sponsorshipId,
      category: 'sponsorship',
    });
  }

  public trackSubscriptionPurchase(planId: string, amount: number): void {
    this.analyticsService.trackEvent('subscription_purchase', amount, {
      type: 'revenue',
      planId,
      category: 'subscription',
    });
  }

  // Link and conversion tracking
  public trackLinkClick(linkId: string, destination: string, platform?: string): void {
    this.analyticsService.trackEvent('link_click', 1, {
      type: 'click',
      linkId,
      destination,
      platform,
    });
  }

  public trackConversion(conversionType: string, value: number, source?: string): void {
    this.analyticsService.trackEvent('conversion', value, {
      type: 'conversion',
      conversionType,
      source,
    });
  }

  public trackBioLinkClick(linkType: string, destination: string): void {
    this.analyticsService.trackEvent('bio_link_click', 1, {
      type: 'click',
      linkType,
      destination,
      category: 'bio',
    });
  }

  // Content creation tracking
  public trackContentCreated(contentType: string, platform: string, hashtags?: string[]): void {
    this.analyticsService.trackEvent('content_created', 1, {
      type: 'content',
      contentType,
      platform,
      hashtags,
      category: 'creation',
    });
  }

  public trackHashtagUsed(hashtag: string, platform: string, reach?: number): void {
    this.analyticsService.trackEvent('hashtag_used', 1, {
      type: 'hashtag',
      hashtag,
      platform,
      reach,
    });
  }

  public trackTemplateUsed(templateId: string, category: string): void {
    this.analyticsService.trackEvent('template_used', 1, {
      type: 'content',
      templateId,
      category,
    });
  }

  public trackCalendarEventCreated(eventType: string, scheduledDate: string): void {
    this.analyticsService.trackEvent('calendar_event_created', 1, {
      type: 'scheduling',
      eventType,
      scheduledDate,
    });
  }

  // AI and automation tracking
  public trackAIAssistantQuery(queryType: string, category: string): void {
    this.analyticsService.trackEvent('ai_assistant_query', 1, {
      type: 'ai',
      queryType,
      category,
    });
  }

  public trackAIContentGenerated(contentType: string, wordCount: number): void {
    this.analyticsService.trackEvent('ai_content_generated', wordCount, {
      type: 'ai',
      contentType,
      category: 'generation',
    });
  }

  public trackAutomationUsed(automationType: string, platform: string): void {
    this.analyticsService.trackEvent('automation_used', 1, {
      type: 'automation',
      automationType,
      platform,
    });
  }

  // User journey tracking
  public trackScreenView(screenName: string, timeSpent?: number): void {
    this.analyticsService.trackEvent('screen_view', timeSpent || 1, {
      type: 'navigation',
      screenName,
    });
  }

  public trackFeatureUsed(featureName: string, duration?: number): void {
    this.analyticsService.trackEvent('feature_used', duration || 1, {
      type: 'feature',
      featureName,
    });
  }

  public trackOnboardingStep(step: string, completed: boolean): void {
    this.analyticsService.trackEvent('onboarding_step', completed ? 1 : 0, {
      type: 'onboarding',
      step,
    });
  }

  // Community and mentorship tracking
  public trackMentorshipRequest(mentorId: string, category: string): void {
    this.analyticsService.trackEvent('mentorship_request', 1, {
      type: 'mentorship',
      mentorId,
      category,
    });
  }

  public trackMentorshipSession(sessionId: string, duration: number): void {
    this.analyticsService.trackEvent('mentorship_session', duration, {
      type: 'mentorship',
      sessionId,
      category: 'session',
    });
  }

  public trackCommunityEngagement(engagementType: string, targetId: string): void {
    this.analyticsService.trackEvent('community_engagement', 1, {
      type: 'community',
      engagementType,
      targetId,
    });
  }

  // Error and performance tracking
  public trackError(errorType: string, errorMessage: string, screen?: string): void {
    this.analyticsService.trackEvent('error', 1, {
      type: 'error',
      errorType,
      errorMessage,
      screen,
    });
  }

  public trackPerformance(metric: string, value: number, context?: string): void {
    this.analyticsService.trackEvent('performance', value, {
      type: 'performance',
      metric,
      context,
    });
  }

  // Custom event tracking
  public trackCustomEvent(eventName: string, value: number, properties?: Record<string, any>): void {
    this.analyticsService.trackEvent(eventName, value, {
      type: 'custom',
      ...properties,
    });
  }
}

export default AnalyticsTracker;
