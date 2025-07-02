/**
 * Kingdom Studios Content Ideas Service
 * AI-powered content generation with biblical wisdom and marketing intelligence
 */

import { 
  ContentIdea, 
  SocialPlatform, 
  ContentType,
  SeasonalContext,
  MarketingGoal,
  UserPersonality,
  TrendingTopic
} from '../types/aiAssistant';
import { AppMode } from '../types/spiritual';

export class ContentIdeasService {
  private static instance: ContentIdeasService;
  
  public static getInstance(): ContentIdeasService {
    if (!ContentIdeasService.instance) {
      ContentIdeasService.instance = new ContentIdeasService();
    }
    return ContentIdeasService.instance;
  }

  /**
   * Generate personalized content ideas based on user profile and goals
   */
  public async generatePersonalizedContent(
    mode: AppMode,
    userProfile: UserPersonality,
    goals: MarketingGoal[],
    seasonalContext: SeasonalContext,
    platforms: SocialPlatform[]
  ): Promise<ContentIdea[]> {
    
    const ideas: ContentIdea[] = [];

    // Generate seasonal content
    const seasonalIdeas = this.generateSeasonalContent(mode, seasonalContext, platforms);
    ideas.push(...seasonalIdeas);

    // Generate goal-focused content
    const goalIdeas = this.generateGoalFocusedContent(mode, goals, userProfile, platforms);
    ideas.push(...goalIdeas);

    // Generate trending content opportunities
    const trendingIdeas = await this.generateTrendingContent(mode, platforms);
    ideas.push(...trendingIdeas);

    // Generate educational content
    const educationalIdeas = this.generateEducationalContent(mode, userProfile, platforms);
    ideas.push(...educationalIdeas);

    return ideas
      .sort((a, b) => b.expectedEngagement - a.expectedEngagement)
      .slice(0, 20);
  }

  /**
   * Get content ideas for specific holidays and observances
   */
  public getHolidayContent(
    mode: AppMode,
    holidayName: string,
    platforms: SocialPlatform[]
  ): ContentIdea[] {
    const holidayContentMap = this.getHolidayContentMap(mode);
    const holidayIdeas = holidayContentMap[holidayName.toLowerCase()] || [];

    return holidayIdeas.map(idea => ({
      title: idea.title || `${holidayName} Content`,
      description: idea.description || `Special content for ${holidayName}`,
      contentType: (idea.contentType as ContentType) || 'post',
      difficulty: idea.difficulty || 'medium',
      expectedEngagement: idea.expectedEngagement || 100,
      bibleConnection: idea.bibleConnection,
      platform: platforms,
      seasonalRelevance: `Perfect for ${holidayName}`,
      hashtags: this.generateHolidayHashtags(holidayName, mode)
    }));
  }

  /**
   * Generate viral content opportunities based on current trends
   */
  public async generateViralOpportunities(
    mode: AppMode,
    userNiche: string,
    platforms: SocialPlatform[]
  ): Promise<ContentIdea[]> {
    const viralFormats = this.getViralContentFormats();
    const trendingTopics = await this.getCurrentTrends(userNiche);

    const viralIdeas: ContentIdea[] = [];

    viralFormats.forEach(format => {
      trendingTopics.forEach(topic => {
        const idea = this.createViralContentIdea(format, topic, mode, platforms);
        viralIdeas.push(idea);
      });
    });

    return viralIdeas.slice(0, 10);
  }

  /**
   * Generate product-focused content ideas
   */
  public generateProductContent(
    mode: AppMode,
    productName: string,
    productType: string,
    platforms: SocialPlatform[]
  ): ContentIdea[] {
    const productContentTemplates = this.getProductContentTemplates(mode);
    
    return productContentTemplates.map(template => ({
      title: template.title.replace('{product}', productName),
      description: template.description.replace('{product}', productName),
      contentType: template.contentType,
      platform: platforms,
      difficulty: template.difficulty,
      expectedEngagement: template.baseEngagement + Math.floor(Math.random() * 200),
      hashtags: this.generateProductHashtags(productName, productType, mode),
      bibleConnection: mode === 'faith' ? template.bibleConnection : undefined
    }));
  }

  // Private helper methods

  private generateSeasonalContent(
    mode: AppMode,
    seasonalContext: SeasonalContext,
    platforms: SocialPlatform[]
  ): ContentIdea[] {
    const currentSeason = seasonalContext.currentSeason;
    const seasonalTemplates = this.getSeasonalContentTemplates(mode, currentSeason);

    return seasonalTemplates.map(template => ({
      title: template.title || `${currentSeason} Content`,
      description: template.description || `Seasonal content for ${currentSeason}`,
      contentType: (template.contentType as ContentType) || 'post',
      difficulty: template.difficulty || 'medium',
      expectedEngagement: template.expectedEngagement || 100,
      bibleConnection: template.bibleConnection,
      platform: platforms,
      hashtags: this.generateSeasonalHashtags(currentSeason, mode),
      seasonalRelevance: `Perfect for ${currentSeason} season`
    }));
  }

  private generateGoalFocusedContent(
    mode: AppMode,
    goals: MarketingGoal[],
    userProfile: UserPersonality,
    platforms: SocialPlatform[]
  ): ContentIdea[] {
    const activeGoals = goals.filter(goal => goal.status === 'active');
    const goalIdeas: ContentIdea[] = [];

    activeGoals.forEach(goal => {
      const goalContentType = this.getOptimalContentTypeForGoal(goal, userProfile);
      const idea: ContentIdea = {
        title: this.generateGoalTitle(goal, mode),
        description: this.generateGoalDescription(goal, mode),
        contentType: goalContentType,
        platform: platforms,
        difficulty: 'medium',
        expectedEngagement: 800 + Math.floor(Math.random() * 400),
        hashtags: this.generateGoalHashtags(goal, mode),
        bibleConnection: mode === 'faith' ? this.getGoalBibleVerse(goal) : undefined
      };
      goalIdeas.push(idea);
    });

    return goalIdeas;
  }

  private async generateTrendingContent(
    mode: AppMode,
    platforms: SocialPlatform[]
  ): Promise<ContentIdea[]> {
    const trendingTopics = await this.getCurrentTrends('digital_marketing');
    
    return trendingTopics.slice(0, 5).map(topic => ({
      title: `${mode === 'faith' ? 'Faith-Based' : 'Smart'} Take on ${topic.keyword}`,
      description: `Share your perspective on the trending topic: ${topic.keyword}`,
      contentType: 'post' as ContentType,
      platform: platforms,
      difficulty: 'easy',
      expectedEngagement: Math.floor(topic.trendScore * 10),
      hashtags: [topic.keyword, ...topic.relatedHashtags],
      seasonalRelevance: 'Trending now'
    }));
  }

  private generateEducationalContent(
    mode: AppMode,
    userProfile: UserPersonality,
    platforms: SocialPlatform[]
  ): ContentIdea[] {
    const educationalTopics = mode === 'faith' ? [
      'Biblical Business Principles',
      'Faith-Based Marketing Ethics',
      'Stewardship in Digital Age',
      'Kingdom Entrepreneurship',
      'Prayer in Business Decisions'
    ] : [
      'Digital Marketing Fundamentals',
      'Social Media Strategy',
      'Content Creation Tips',
      'Audience Engagement',
      'Brand Building Basics'
    ];

    return educationalTopics.map(topic => ({
      title: `${topic} 101`,
      description: `Educational series about ${topic.toLowerCase()}`,
      contentType: userProfile.contentTone === 'educational' ? 'carousel' : 'post' as ContentType,
      platform: platforms,
      difficulty: 'medium',
      expectedEngagement: 600 + Math.floor(Math.random() * 300),
      hashtags: this.generateEducationalHashtags(topic, mode),
      bibleConnection: mode === 'faith' ? this.getEducationalBibleVerse(topic) : undefined
    }));
  }

  private getViralContentFormats(): Array<{
    name: string;
    engagement: number;
    platforms: SocialPlatform[];
  }> {
    return [
      { name: 'Before/After Transformation', engagement: 1500, platforms: ['instagram', 'tiktok'] },
      { name: 'Behind the Scenes', engagement: 1200, platforms: ['instagram', 'tiktok', 'youtube'] },
      { name: 'Quick Tips Carousel', engagement: 1000, platforms: ['instagram', 'linkedin'] },
      { name: 'Day in the Life', engagement: 1300, platforms: ['tiktok', 'instagram'] },
      { name: 'Myth Busting', engagement: 1100, platforms: ['tiktok', 'instagram', 'youtube'] }
    ];
  }

  private async getCurrentTrends(niche: string): Promise<TrendingTopic[]> {
    // Mock trending topics - in real app, fetch from APIs
    return [
      {
        keyword: '#DigitalDetox',
        platform: 'instagram',
        trendScore: 85,
        category: 'wellness',
        relevanceToUser: 0.8,
        relatedHashtags: ['#MindfulSocial', '#HealthyBoundaries', '#TechBalance']
      },
      {
        keyword: '#SmallBizSupport',
        platform: 'instagram',
        trendScore: 92,
        category: 'business',
        relevanceToUser: 0.95,
        relatedHashtags: ['#ShopSmall', '#LocalBusiness', '#EntrepreneurSupport']
      }
    ];
  }

  private createViralContentIdea(
    format: { name: string; engagement: number; platforms: SocialPlatform[] },
    topic: TrendingTopic,
    mode: AppMode,
    platforms: SocialPlatform[]
  ): ContentIdea {
    return {
      title: `${format.name}: ${topic.keyword} Edition`,
      description: `Create a ${format.name.toLowerCase()} style post about ${topic.keyword}`,
      contentType: format.name.includes('Carousel') ? 'carousel' : 'reel',
      platform: platforms.filter(p => format.platforms.includes(p)),
      difficulty: 'medium',
      expectedEngagement: format.engagement + topic.trendScore * 5,
      hashtags: [topic.keyword, ...topic.relatedHashtags],
      seasonalRelevance: 'Viral opportunity'
    };
  }

  private getSeasonalContentTemplates(mode: AppMode, season: string): Partial<ContentIdea>[] {
    const seasonalContent: Record<string, Record<AppMode, Partial<ContentIdea>[]>> = {
      spring: {
        faith: [
          {
            title: 'New Beginnings: God\'s Fresh Start',
            description: 'Share about new opportunities God is opening in your business',
            contentType: 'post',
            difficulty: 'easy',
            expectedEngagement: 850,
            bibleConnection: '2 Corinthians 5:17 - New creation in Christ'
          }
        ],
        encouragement: [
          {
            title: 'Spring Cleaning Your Business Goals',
            description: 'Review and refresh your business objectives for the new season',
            contentType: 'carousel',
            difficulty: 'medium',
            expectedEngagement: 900
          }
        ]
      },
      summer: {
        faith: [
          {
            title: 'Summer Ministry Opportunities',
            description: 'Share how your business serves others during summer',
            contentType: 'story',
            difficulty: 'easy',
            expectedEngagement: 750
          }
        ],
        encouragement: [
          {
            title: 'Summer Success Strategies',
            description: 'Tips for maintaining momentum during slower summer months',
            contentType: 'reel',
            difficulty: 'medium',
            expectedEngagement: 1100
          }
        ]
      },
      fall: {
        faith: [
          {
            title: 'Grateful for God\'s Provision',
            description: 'Thanksgiving post about how God has blessed your business',
            contentType: 'post',
            difficulty: 'easy',
            expectedEngagement: 950
          }
        ],
        encouragement: [
          {
            title: 'Harvesting Your Hard Work',
            description: 'Celebrate the results of your consistent efforts',
            contentType: 'carousel',
            difficulty: 'easy',
            expectedEngagement: 800
          }
        ]
      },
      winter: {
        faith: [
          {
            title: 'Waiting on God\'s Timing',
            description: 'Encouragement for those in slower business seasons',
            contentType: 'post',
            difficulty: 'easy',
            expectedEngagement: 820
          }
        ],
        encouragement: [
          {
            title: 'Year-End Reflection & Planning',
            description: 'Looking back at achievements and planning ahead',
            contentType: 'carousel',
            difficulty: 'medium',
            expectedEngagement: 900
          }
        ]
      }
    };

    return seasonalContent[season]?.[mode] || [];
  }

  private getHolidayContentMap(mode: AppMode): Record<string, Partial<ContentIdea>[]> {
    const holidayContent: Record<string, Record<AppMode, Partial<ContentIdea>[]>> = {
      'new year': {
        faith: [
          {
            title: 'New Year, New Faith Journey',
            description: 'Share your spiritual and business goals for the new year',
            contentType: 'post',
            difficulty: 'easy',
            expectedEngagement: 1200
          }
        ],
        encouragement: [
          {
            title: 'New Year, New Opportunities',
            description: 'Motivational post about fresh starts and new goals',
            contentType: 'reel',
            difficulty: 'easy',
            expectedEngagement: 1300
          }
        ]
      },
      'easter': {
        faith: [
          {
            title: 'Resurrection Power in Business',
            description: 'How Easter themes apply to overcoming business challenges',
            contentType: 'post',
            difficulty: 'medium',
            expectedEngagement: 950
          }
        ],
        encouragement: [
          {
            title: 'Spring Renewal & Fresh Starts',
            description: 'Easter season motivation for new beginnings',
            contentType: 'post',
            difficulty: 'easy',
            expectedEngagement: 800
          }
        ]
      }
    };

    // Return the content for the specific mode
    const modeSpecificContent: Record<string, Partial<ContentIdea>[]> = {};
    Object.keys(holidayContent).forEach(holiday => {
      modeSpecificContent[holiday] = holidayContent[holiday][mode] || [];
    });

    return modeSpecificContent;
  }

  private getProductContentTemplates(mode: AppMode): Array<{
    title: string;
    description: string;
    contentType: ContentType;
    difficulty: 'easy' | 'medium' | 'hard';
    baseEngagement: number;
    bibleConnection?: string;
  }> {
    return mode === 'faith' ? [
      {
        title: 'How {product} Honors God',
        description: 'Share the faith-based principles behind your {product}',
        contentType: 'post',
        difficulty: 'medium',
        baseEngagement: 800,
        bibleConnection: 'Colossians 3:23 - Work as unto the Lord'
      },
      {
        title: 'Behind the Scenes: Creating {product}',
        description: 'Show your process of creating {product} with prayer and intention',
        contentType: 'story',
        difficulty: 'easy',
        baseEngagement: 650
      }
    ] : [
      {
        title: 'Why I Created {product}',
        description: 'Share the problem your {product} solves and your inspiration',
        contentType: 'post',
        difficulty: 'medium',
        baseEngagement: 900
      },
      {
        title: '{product} Success Stories',
        description: 'Feature customer testimonials and transformations',
        contentType: 'carousel',
        difficulty: 'medium',
        baseEngagement: 1100
      }
    ];
  }

  private generateHolidayHashtags(holiday: string, mode: AppMode): string[] {
    const baseHashtags = [`#${holiday.replace(' ', '')}`, `#Holiday${holiday.split(' ')[0]}`];
    
    if (mode === 'faith') {
      baseHashtags.push('#FaithAndBusiness', '#ChristianEntrepreneur', '#BlessedBusiness');
    } else {
      baseHashtags.push('#BusinessMotivation', '#EntrepreneurLife', '#SuccessMindset');
    }
    
    return baseHashtags;
  }

  private generateSeasonalHashtags(season: string, mode: AppMode): string[] {
    const seasonalBase = [`#${season}2024`, `#${season}Vibes`, `#${season}Goals`];
    
    if (mode === 'faith') {
      seasonalBase.push('#FaithSeason', '#GodsSeason', '#BlessedSeason');
    } else {
      seasonalBase.push('#SeasonOfSuccess', '#NewSeasonNewMe', '#SeasonalStrategy');
    }
    
    return seasonalBase;
  }

  private generateGoalHashtags(goal: MarketingGoal, mode: AppMode): string[] {
    const goalType = goal.targetMetric.toLowerCase();
    const baseHashtags = [`#${goalType}Goals`, '#GoalGetter', '#Progress'];
    
    if (mode === 'faith') {
      baseHashtags.push('#FaithfulGoals', '#GodsWill', '#TrustTheProcess');
    } else {
      baseHashtags.push('#SuccessJourney', '#GoalDigger', '#MakeItHappen');
    }
    
    return baseHashtags;
  }

  private generateProductHashtags(productName: string, productType: string, mode: AppMode): string[] {
    const productHashtags = [
      `#${productName.replace(/\s+/g, '')}`,
      `#${productType}`,
      '#NewProduct',
      '#BusinessOwner'
    ];
    
    if (mode === 'faith') {
      productHashtags.push('#FaithBasedProduct', '#KingdomBusiness');
    } else {
      productHashtags.push('#EntrepreneurLife', '#ProductLaunch');
    }
    
    return productHashtags;
  }

  private generateEducationalHashtags(topic: string, mode: AppMode): string[] {
    const topicHashtag = `#${topic.replace(/\s+/g, '')}`;
    const baseHashtags = [topicHashtag, '#Education', '#Tips', '#Learning'];
    
    if (mode === 'faith') {
      baseHashtags.push('#BiblicalBusiness', '#FaithBasedEducation');
    } else {
      baseHashtags.push('#BusinessEducation', '#SkillBuilding');
    }
    
    return baseHashtags;
  }

  private getOptimalContentTypeForGoal(goal: MarketingGoal, userProfile: UserPersonality): ContentType {
    if (goal.targetMetric.includes('engagement')) {
      return userProfile.visualPreferences === 'creative' ? 'reel' : 'carousel';
    }
    if (goal.targetMetric.includes('reach')) {
      return 'story';
    }
    return 'post';
  }

  private generateGoalTitle(goal: MarketingGoal, mode: AppMode): string {
    const faithTitles = [
      `Trusting God with My ${goal.targetMetric} Goals`,
      `Faith Over Fear: Pursuing ${goal.targetMetric}`,
      `How Prayer Changed My ${goal.targetMetric}`
    ];
    
    const encouragementTitles = [
      `My Journey to ${goal.targetMetric} Success`,
      `Why I'm Committed to ${goal.targetMetric}`,
      `The Strategy Behind My ${goal.targetMetric} Goals`
    ];
    
    const titles = mode === 'faith' ? faithTitles : encouragementTitles;
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private generateGoalDescription(goal: MarketingGoal, mode: AppMode): string {
    return mode === 'faith'
      ? `Share your faith journey in pursuing ${goal.targetMetric} goals, including how God is leading you`
      : `Document your strategic approach to achieving ${goal.targetMetric} goals and inspire others`;
  }

  private getGoalBibleVerse(goal: MarketingGoal): string {
    const verses = [
      'Philippians 4:13 - I can do all things through Christ',
      'Jeremiah 29:11 - God has plans to prosper you',
      'Proverbs 16:3 - Commit your work to the Lord'
    ];
    return verses[Math.floor(Math.random() * verses.length)];
  }

  private getEducationalBibleVerse(topic: string): string {
    return 'Proverbs 27:17 - Iron sharpens iron, so one person sharpens another';
  }
}

export default ContentIdeasService;
