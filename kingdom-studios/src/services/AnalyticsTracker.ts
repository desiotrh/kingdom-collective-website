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

  public trackAIContentGenerated(contentType: string, success: boolean, platform?: string): void {
    this.analyticsService.trackEvent('ai_content_generated', 1, {
      type: 'ai_generation',
      contentType,
      success,
      platform,
      category: 'content_creation',
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

  // Social Media tracking methods
  public trackSocialMediaPost(platform: string, contentType: string, metrics?: any): void {
    this.analyticsService.trackEvent('social_media_post', 1, {
      type: 'social_post',
      platform,
      contentType,
      metrics,
      category: 'social_media',
    });
  }

  public trackPlatformConnection(platform: string, success: boolean): void {
    this.analyticsService.trackEvent('platform_connection', 1, {
      type: 'connection',
      platform,
      success,
      category: 'social_media',
    });
  }

  public trackMultiPlatformPost(platforms: string[], contentType: string, results: any[]): void {
    const successCount = results.filter(r => r.success).length;
    this.analyticsService.trackEvent('multi_platform_post', successCount, {
      type: 'multi_post',
      platforms,
      contentType,
      results,
      successCount,
      totalCount: results.length,
      category: 'social_media',
    });
  }

  public trackScheduledPost(platforms: string[], scheduledTime: Date): void {
    this.analyticsService.trackEvent('post_scheduled', 1, {
      type: 'scheduling',
      platforms,
      scheduledTime: scheduledTime.toISOString(),
      category: 'social_media',
    });
  }

  public trackAIContentGeneration(contentType: string, platform?: string, success?: boolean): void {
    this.analyticsService.trackEvent('ai_content_generated', 1, {
      type: 'ai_generation',
      contentType,
      platform,
      success,
      category: 'content_creation',
    });
  }

  // Email Marketing tracking methods
  public trackEmailSubscription(source: string): void {
    this.analyticsService.trackEvent('email_subscription', 1, {
      type: 'subscription',
      source,
      category: 'email_marketing',
    });
  }

  public trackEmailUnsubscription(): void {
    this.analyticsService.trackEvent('email_unsubscription', 1, {
      type: 'unsubscription',
      category: 'email_marketing',
    });
  }

  public trackEmailTemplateCreated(category: string): void {
    this.analyticsService.trackEvent('email_template_created', 1, {
      type: 'template_creation',
      category,
      templateCategory: 'email_marketing',
    });
  }

  public trackEmailCampaignCreated(recipientCount: number): void {
    this.analyticsService.trackEvent('email_campaign_created', 1, {
      type: 'campaign_creation',
      recipientCount,
      category: 'email_marketing',
    });
  }

  public trackEmailCampaignSent(campaignId: string, recipientCount: number): void {
    this.analyticsService.trackEvent('email_campaign_sent', recipientCount, {
      type: 'campaign_sent',
      campaignId,
      recipientCount,
      category: 'email_marketing',
    });
  }

  public trackEmailAutomationCreated(triggerType: string, emailCount: number): void {
    this.analyticsService.trackEvent('email_automation_created', 1, {
      type: 'automation_creation',
      triggerType,
      emailCount,
      category: 'email_marketing',
    });
  }

  // Advanced Analytics Dashboard tracking
  public trackAnalyticsDashboardView(timeframe: any): void {
    this.analyticsService.trackEvent('analytics_dashboard_viewed', 1, {
      type: 'dashboard_view',
      timeframeDays: this.calculateTimeframeDays(timeframe),
      category: 'analytics',
    });
  }

  public trackAnalyticsExport(format: 'pdf' | 'csv' | 'excel', timeframe: any): void {
    this.analyticsService.trackEvent('analytics_exported', 1, {
      type: 'export',
      format,
      timeframeDays: this.calculateTimeframeDays(timeframe),
      category: 'analytics',
    });
  }

  public trackAnalyticsInsightViewed(insightType: string, category: string): void {
    this.analyticsService.trackEvent('analytics_insight_viewed', 1, {
      type: 'insight_view',
      insightType,
      category: 'analytics',
      subcategory: category,
    });
  }

  public trackAnalyticsRecommendationActioned(recommendationCategory: string, priority: string): void {
    this.analyticsService.trackEvent('analytics_recommendation_actioned', 1, {
      type: 'recommendation_action',
      recommendationCategory,
      priority,
      category: 'analytics',
    });
  }

  public trackRealtimeMetricsViewed(): void {
    this.analyticsService.trackEvent('realtime_metrics_viewed', 1, {
      type: 'realtime_view',
      category: 'analytics',
    });
  }

  public trackAnalyticsTimeframeChanged(newTimeframeDays: number): void {
    this.analyticsService.trackEvent('analytics_timeframe_changed', 1, {
      type: 'timeframe_change',
      timeframeDays: newTimeframeDays,
      category: 'analytics',
    });
  }

  public trackAnalyticsMetricFocused(metricType: 'content' | 'social' | 'email' | 'engagement' | 'revenue'): void {
    this.analyticsService.trackEvent('analytics_metric_focused', 1, {
      type: 'metric_focus',
      metricType,
      category: 'analytics',
    });
  }

  public trackAnalyticsChartInteraction(chartType: string, interactionType: string): void {
    this.analyticsService.trackEvent('analytics_chart_interaction', 1, {
      type: 'chart_interaction',
      chartType,
      interactionType,
      category: 'analytics',
    });
  }

  // Helper method to calculate timeframe in days
  private calculateTimeframeDays(timeframe: any): number {
    if (!timeframe || !timeframe.start || !timeframe.end) {
      return 30; // Default to 30 days
    }
    
    const start = new Date(timeframe.start);
    const end = new Date(timeframe.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
}

export default AnalyticsTracker;
