/**
 * Kingdom Studios Hashtag Analytics Service
 * Advanced hashtag optimization and viral content analysis
 */

import { 
  HashtagSuggestion, 
  HashtagPerformance, 
  SocialPlatform, 
  HashtagCategory,
  TrendingTopic,
} from '../types/aiAssistant';
import { AppMode } from '../types/spiritual';

export class HashtagAnalyticsService {
  private static instance: HashtagAnalyticsService;
  
  public static getInstance(): HashtagAnalyticsService {
    if (!HashtagAnalyticsService.instance) {
      HashtagAnalyticsService.instance = new HashtagAnalyticsService();
    }
    return HashtagAnalyticsService.instance;
  }

  /**
   * Get personalized hashtag suggestions based on content and user history
   */
  public async getPersonalizedHashtags(
    content: string,
    platform: SocialPlatform,
    mode: AppMode,
    userHistory?: HashtagPerformance[]
  ): Promise<HashtagSuggestion[]> {
    
    const contentKeywords = this.extractKeywords(content);
    const trendingHashtags = await this.getTrendingHashtags(platform);
    const personalizedTags = this.generatePersonalizedTags(contentKeywords, userHistory || []);
    
    const suggestions: HashtagSuggestion[] = [];
    
    // Add trending hashtags relevant to content
    const relevantTrending = trendingHashtags
      .filter(tag => this.isRelevantToContent(tag.keyword, contentKeywords))
      .slice(0, 5)
      .map(tag => ({
        hashtag: tag.keyword,
        platform,
        category: this.categorizeHashtag(tag.keyword, mode) as HashtagCategory,
        trendingScore: tag.trendScore,
        userAffinityScore: this.calculateUserAffinity(tag.keyword, userHistory || []),
        expectedEngagement: this.estimateEngagement(tag.keyword, platform),
        reasoning: `Trending with ${tag.trendScore}% popularity in your niche`
      }));
    
    suggestions.push(...relevantTrending);
    
    // Add niche-specific hashtags
    const nicheHashtags = this.getNicheHashtags(contentKeywords, platform, mode);
    suggestions.push(...nicheHashtags.slice(0, 8));
    
    // Add proven user hashtags
    const userFavorites = this.getUserTopHashtags(userHistory || [], platform);
    suggestions.push(...userFavorites.slice(0, 5));
    
    // Sort by expected performance
    return suggestions
      .sort((a, b) => (b.trendingScore * 0.4 + b.userAffinityScore * 0.6) - (a.trendingScore * 0.4 + a.userAffinityScore * 0.6))
      .slice(0, 30); // Instagram limit
  }

  /**
   * Analyze hashtag performance for user's content
   */
  public analyzeHashtagPerformance(
    hashtags: string[],
    engagementData: { likes: number; comments: number; shares: number; reach: number }
  ): HashtagPerformance[] {
    return hashtags.map(hashtag => ({
      hashtag,
      timesUsed: 1,
      avgEngagement: engagementData.likes + engagementData.comments + engagementData.shares,
      reachIncrease: this.calculateReachIncrease(hashtag, engagementData.reach),
      conversionRate: this.estimateConversionRate(hashtag),
      trendingScore: this.calculateTrendingScore(hashtag)
    }));
  }

  /**
   * Get seasonal hashtag recommendations
   */
  public getSeasonalHashtags(
    season: string,
    mode: AppMode,
    platform: SocialPlatform
  ): HashtagSuggestion[] {
    const seasonalTags = this.getSeasonalTagsData(season, mode);
    
    return seasonalTags.map(tag => ({
      hashtag: tag,
      platform,
      category: 'seasonal' as HashtagCategory,
      trendingScore: this.getSeasonalTrendingScore(tag, season),
      userAffinityScore: 0.7, // Default for seasonal content
      expectedEngagement: this.estimateEngagement(tag, platform),
      reasoning: `Perfect for ${season} content in ${mode} mode`
    }));
  }

  /**
   * Get viral hashtag opportunities
   */
  public async getViralOpportunities(
    niche: string,
    platform: SocialPlatform,
    mode: AppMode
  ): Promise<HashtagSuggestion[]> {
    const viralTags = await this.getViralHashtagsData(niche, platform);
    
    return viralTags.map(tag => ({
      hashtag: tag.hashtag,
      platform,
      category: 'trending' as HashtagCategory,
      trendingScore: tag.viralScore,
      userAffinityScore: tag.nicheRelevance,
      expectedEngagement: tag.avgEngagement,
      reasoning: `${tag.viralScore}% viral potential - ${tag.recentGrowth}% growth this week`
    }));
  }

  // Private helper methods

  private extractKeywords(content: string): string[] {
    // Simple keyword extraction - in real app, use NLP
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3);
    
    return [...new Set(words)];
  }

  private async getTrendingHashtags(platform: SocialPlatform): Promise<TrendingTopic[]> {
    // Mock trending data - in real app, fetch from APIs
    const trendingData: Record<SocialPlatform, TrendingTopic[]> = {
      instagram: [
        { keyword: '#EntrepreneurLife', platform: 'instagram', trendScore: 92, category: 'business', relevanceToUser: 0.9, relatedHashtags: ['#BusinessOwner', '#Success'] },
        { keyword: '#FaithInBusiness', platform: 'instagram', trendScore: 88, category: 'faith', relevanceToUser: 0.95, relatedHashtags: ['#ChristianEntrepreneur', '#BlessedBusiness'] },
        { keyword: '#DigitalMarketing', platform: 'instagram', trendScore: 90, category: 'marketing', relevanceToUser: 0.85, relatedHashtags: ['#SocialMedia', '#ContentCreator'] }
      ],
      tiktok: [
        { keyword: '#SmallBusiness', platform: 'tiktok', trendScore: 95, category: 'business', relevanceToUser: 0.9, relatedHashtags: ['#SmallBizOwner', '#Entrepreneur'] },
        { keyword: '#FaithTok', platform: 'tiktok', trendScore: 87, category: 'faith', relevanceToUser: 0.92, relatedHashtags: ['#Christian', '#Faith'] }
      ],
      facebook: [],
      youtube: [],
      pinterest: [],
      twitter: [],
      linkedin: [],
      threads: [],
      lemon8: []
    };

    return trendingData[platform] || [];
  }

  private generatePersonalizedTags(keywords: string[], userHistory: HashtagPerformance[]): string[] {
    // Generate hashtags based on content keywords and user success patterns
    const personalizedTags: string[] = [];
    
    keywords.forEach(keyword => {
      personalizedTags.push(`#${keyword}`, `#${keyword}Success`, `#${keyword}Tips`);
    });

    return personalizedTags;
  }

  private isRelevantToContent(hashtag: string, keywords: string[]): boolean {
    const hashtagLower = hashtag.toLowerCase();
    return keywords.some(keyword => 
      hashtagLower.includes(keyword) || keyword.includes(hashtagLower.replace('#', ''))
    );
  }

  private categorizeHashtag(hashtag: string, mode: AppMode): string {
    const hashtagLower = hashtag.toLowerCase();
    
    if (mode === 'faith') {
      if (hashtagLower.includes('faith') || hashtagLower.includes('christian') || hashtagLower.includes('blessed')) {
        return 'faith';
      }
    }
    
    if (hashtagLower.includes('business') || hashtagLower.includes('entrepreneur')) {
      return 'business';
    }
    
    if (hashtagLower.includes('trending') || hashtagLower.includes('viral')) {
      return 'trending';
    }
    
    return 'niche';
  }

  private calculateUserAffinity(hashtag: string, userHistory: HashtagPerformance[]): number {
    const userHashtag = userHistory.find(h => h.hashtag === hashtag);
    if (userHashtag) {
      return Math.min(userHashtag.avgEngagement / 1000, 1); // Normalize to 0-1
    }
    return 0.5; // Default affinity for new hashtags
  }

  private estimateEngagement(hashtag: string, platform: SocialPlatform): number {
    // Mock engagement estimation - in real app, use ML models
    const basePlatformEngagement: Record<SocialPlatform, number> = {
      instagram: 800,
      tiktok: 1200,
      facebook: 500,
      youtube: 300,
      pinterest: 400,
      twitter: 600,
      linkedin: 700,
      threads: 450,
      lemon8: 350
    };

    const base = basePlatformEngagement[platform];
    const hashtagMultiplier = hashtag.includes('viral') ? 1.5 : 1;
    
    return Math.round(base * hashtagMultiplier * (0.8 + Math.random() * 0.4));
  }

  private getNicheHashtags(keywords: string[], platform: SocialPlatform, mode: AppMode): HashtagSuggestion[] {
    const nicheHashtags = mode === 'faith' ? [
      '#FaithBasedBusiness', '#ChristianEntrepreneur', '#KingdomBusiness', '#BlessedBusiness',
      '#FaithAndWork', '#ChristianLeader', '#StewardshipMindset', '#PurposeDriven',
      '#GodFirstBusiness', '#FaithfulEntrepreneur'
    ] : [
      '#WomenInBusiness', '#EntrepreneurMindset', '#BusinessOwner', '#SuccessStory',
      '#HustleAndHeart', '#BusinessTips', '#EntrepreneurLife', '#BusinessSuccess',
      '#WomenEntrepreneur', '#SmallBusinessOwner'
    ];

    return nicheHashtags.map(tag => ({
      hashtag: tag,
      platform,
      category: 'niche' as HashtagCategory,
      trendingScore: 70 + Math.random() * 25,
      userAffinityScore: 0.8,
      expectedEngagement: this.estimateEngagement(tag, platform),
      reasoning: `High-performing niche hashtag for ${mode} content`
    }));
  }

  private getUserTopHashtags(userHistory: HashtagPerformance[], platform: SocialPlatform): HashtagSuggestion[] {
    return userHistory
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .slice(0, 10)
      .map(performance => ({
        hashtag: performance.hashtag,
        platform,
        category: 'brand' as HashtagCategory,
        trendingScore: performance.trendingScore,
        userAffinityScore: 1, // Perfect affinity for user's own hashtags
        expectedEngagement: performance.avgEngagement,
        reasoning: `Your top performing hashtag with ${performance.avgEngagement} avg engagement`
      }));
  }

  private calculateReachIncrease(hashtag: string, totalReach: number): number {
    // Estimate reach increase from this specific hashtag
    return Math.round(totalReach * 0.1 * (0.8 + Math.random() * 0.4));
  }

  private estimateConversionRate(hashtag: string): number {
    // Mock conversion rate estimation
    if (hashtag.includes('sale') || hashtag.includes('offer')) {
      return 0.05 + Math.random() * 0.03;
    }
    return 0.01 + Math.random() * 0.02;
  }

  private calculateTrendingScore(hashtag: string): number {
    // Mock trending score calculation
    return 60 + Math.random() * 35;
  }

  private getSeasonalTagsData(season: string, mode: AppMode): string[] {
    const seasonalTags: Record<string, Record<AppMode, string[]>> = {
      spring: {
        faith: ['#NewBeginnings', '#SpringFaith', '#RenewalSeason', '#GrowthMindset', '#BloomWherePlanted'],
        encouragement: ['#SpringGoals', '#FreshStart', '#NewSeasonNewMe', '#SpringMotivation', '#GrowthMode']
      },
      summer: {
        faith: ['#SummerBlessings', '#VacationMode', '#RestInHim', '#SummerMinistry', '#FaithfulSummer'],
        encouragement: ['#SummerVibes', '#VacationGoals', '#SummerSuccess', '#HotGirlSummer', '#SummerHustle']
      },
      fall: {
        faith: ['#HarvestSeason', '#Grateful', '#FallFaith', '#SeasonOfThanks', '#AutumnBlessings'],
        encouragement: ['#FallGoals', '#HarvestTime', '#AutumnMotivation', '#SeasonOfSuccess', '#FallVibes']
      },
      winter: {
        faith: ['#WinterWisdom', '#QuietSeason', '#RestAndReflect', '#WinterFaith', '#NewYearFaith'],
        encouragement: ['#WinterGoals', '#NewYearNewMe', '#WinterMotivation', '#CozyVibes', '#EndOfYearPush']
      }
    };

    return seasonalTags[season]?.[mode] || [];
  }

  private getSeasonalTrendingScore(tag: string, season: string): number {
    // Seasonal hashtags trend higher during their season
    return 75 + Math.random() * 20;
  }

  private async getViralHashtagsData(niche: string, platform: SocialPlatform): Promise<{
    hashtag: string;
    viralScore: number;
    nicheRelevance: number;
    avgEngagement: number;
    recentGrowth: number;
  }[]> {
    // Mock viral hashtag data - in real app, analyze trending patterns
    return [
      {
        hashtag: '#ViralMoment',
        viralScore: 95,
        nicheRelevance: 0.8,
        avgEngagement: 2500,
        recentGrowth: 150
      },
      {
        hashtag: '#TrendingNow',
        viralScore: 88,
        nicheRelevance: 0.75,
        avgEngagement: 1800,
        recentGrowth: 120
      }
    ];
  }
}

export default HashtagAnalyticsService;
