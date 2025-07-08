import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContentPost } from './firebaseService';
import firebaseService from './firebaseService';

export interface ScheduledPost extends ContentPost {
  scheduled: Date;
  platforms: string[];
  status: 'scheduled' | 'published' | 'failed' | 'draft';
  autoPost?: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
}

export interface ContentCalendar {
  date: string;
  posts: ScheduledPost[];
  suggestions?: string[];
}

class SchedulerService {
  private static instance: SchedulerService;
  private scheduledPosts: ScheduledPost[] = [];

  private constructor() {
    this.loadScheduledPosts();
  }

  static getInstance(): SchedulerService {
    if (!SchedulerService.instance) {
      SchedulerService.instance = new SchedulerService();
    }
    return SchedulerService.instance;
  }

  // Load scheduled posts from storage
  private async loadScheduledPosts(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('scheduledPosts');
      if (stored) {
        this.scheduledPosts = JSON.parse(stored).map((post: any) => ({
          ...post,
          scheduled: new Date(post.scheduled),
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        }));
      }
    } catch (error) {
      console.error('Error loading scheduled posts:', error);
    }
  }

  // Save scheduled posts to storage
  private async saveScheduledPosts(): Promise<void> {
    try {
      await AsyncStorage.setItem('scheduledPosts', JSON.stringify(this.scheduledPosts));
    } catch (error) {
      console.error('Error saving scheduled posts:', error);
    }
  }

  // Schedule a new post
  async schedulePost(post: Omit<ScheduledPost, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
    const scheduledPost: ScheduledPost = {
      ...post,
      id: Date.now().toString(),
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.scheduledPosts.push(scheduledPost);
    await this.saveScheduledPosts();
    
    // Save to Firebase
    await firebaseService.saveContentPost(scheduledPost);

    // Set up notification for post reminder
    this.scheduleNotification(scheduledPost);

    return scheduledPost.id!;
  }

  // Update scheduled post
  async updateScheduledPost(id: string, updates: Partial<ScheduledPost>): Promise<void> {
    const index = this.scheduledPosts.findIndex(post => post.id === id);
    if (index !== -1) {
      this.scheduledPosts[index] = {
        ...this.scheduledPosts[index],
        ...updates,
        updatedAt: new Date(),
      };
      await this.saveScheduledPosts();
    }
  }

  // Delete scheduled post
  async deleteScheduledPost(id: string): Promise<void> {
    this.scheduledPosts = this.scheduledPosts.filter(post => post.id !== id);
    await this.saveScheduledPosts();
  }

  // Get scheduled posts for a specific date range
  getScheduledPosts(startDate: Date, endDate: Date): ScheduledPost[] {
    return this.scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduled);
      return postDate >= startDate && postDate <= endDate;
    });
  }

  // Get calendar data for a month
  getCalendarData(month: number, year: number): ContentCalendar[] {
    const calendar: ContentCalendar[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      const dayPosts = this.scheduledPosts.filter(post => {
        const postDate = new Date(post.scheduled);
        return postDate.toISOString().split('T')[0] === dateString;
      });

      const suggestions = this.getContentSuggestions(date);

      calendar.push({
        date: dateString,
        posts: dayPosts,
        suggestions,
      });
    }

    return calendar;
  }

  // Get content suggestions for a specific date
  private getContentSuggestions(date: Date): string[] {
    const dayOfWeek = date.getDay();
    const suggestions: string[] = [];

    // Day-specific suggestions
    switch (dayOfWeek) {
      case 1: // Monday
        suggestions.push('Motivation Monday - Share an inspiring quote or story');
        break;
      case 2: // Tuesday
        suggestions.push('Tutorial Tuesday - Share a helpful tip or how-to');
        break;
      case 3: // Wednesday
        suggestions.push('Wisdom Wednesday - Share a life lesson or insight');
        break;
      case 4: // Thursday
        suggestions.push('Throwback Thursday - Share a memory or milestone');
        break;
      case 5: // Friday
        suggestions.push('Feature Friday - Showcase a product or achievement');
        break;
      case 6: // Saturday
        suggestions.push('Self-care Saturday - Share wellness or relaxation tips');
        break;
      case 0: // Sunday
        suggestions.push('Sunday Reflection - Share gratitude or weekly highlights');
        break;
    }

    // Month-specific suggestions
    const month = date.getMonth();
    if (month === 0) suggestions.push('New Year, New Goals content');
    if (month === 1) suggestions.push('Love and relationships content');
    if (month === 2) suggestions.push('Spring renewal and growth content');
    // Add more seasonal suggestions...

    return suggestions;
  }

  // Get optimal posting times based on analytics
  getOptimalPostingTimes(): { day: string; times: string[] }[] {
    // Mock data - replace with actual analytics
    return [
      { day: 'Monday', times: ['9:00 AM', '1:00 PM', '7:00 PM'] },
      { day: 'Tuesday', times: ['10:00 AM', '2:00 PM', '8:00 PM'] },
      { day: 'Wednesday', times: ['11:00 AM', '3:00 PM', '6:00 PM'] },
      { day: 'Thursday', times: ['9:00 AM', '1:00 PM', '7:00 PM'] },
      { day: 'Friday', times: ['12:00 PM', '4:00 PM', '8:00 PM'] },
      { day: 'Saturday', times: ['10:00 AM', '2:00 PM', '6:00 PM'] },
      { day: 'Sunday', times: ['11:00 AM', '3:00 PM', '7:00 PM'] },
    ];
  }

  // Schedule notification reminder
  private scheduleNotification(post: ScheduledPost): void {
    // Implementation would depend on your notification service
    // For now, we'll just log it
    console.log(`Notification scheduled for post: ${post.title} at ${post.scheduled}`);
  }

  // Auto-publish posts (this would be called by a background service)
  async processScheduledPosts(): Promise<void> {
    const now = new Date();
    const postsToPublish = this.scheduledPosts.filter(post => 
      post.status === 'scheduled' && 
      new Date(post.scheduled) <= now &&
      post.autoPost
    );

    for (const post of postsToPublish) {
      try {
        // Here you would integrate with actual social media APIs
        await this.publishToSocialMedia(post);
        
        await this.updateScheduledPost(post.id!, {
          status: 'published',
          publishedAt: now,
        });
      } catch (error) {
        console.error(`Failed to publish post ${post.id}:`, error);
        await this.updateScheduledPost(post.id!, {
          status: 'failed',
        });
      }
    }
  }

  // Publish to social media platforms
  private async publishToSocialMedia(post: ScheduledPost): Promise<void> {
    // Mock implementation - replace with actual social media API calls
    for (const platform of post.platforms) {
      console.log(`Publishing to ${platform}:`, post.content);
      
      // Here you would call the respective platform APIs:
      // - Instagram Graph API
      // - Twitter API
      // - Facebook Graph API
      // - LinkedIn API
      // etc.
    }
  }

  // Generate recurring posts
  async createRecurringPost(basePost: Omit<ScheduledPost, 'id' | 'createdAt' | 'updatedAt' | 'status'>, 
                           pattern: ScheduledPost['recurringPattern']): Promise<string[]> {
    if (!pattern) return [];

    const postIds: string[] = [];
    const startDate = new Date(basePost.scheduled);
    const endDate = pattern.endDate || new Date(startDate.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year default

    let currentDate = new Date(startDate);
    let instanceCount = 0;

    while (currentDate <= endDate && instanceCount < 52) { // Max 52 instances
      const recurringPost = {
        ...basePost,
        scheduled: new Date(currentDate),
        title: `${basePost.title} (${instanceCount + 1})`,
      };

      const postId = await this.schedulePost(recurringPost);
      postIds.push(postId);

      // Calculate next occurrence
      switch (pattern.frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + pattern.interval);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + (7 * pattern.interval));
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + pattern.interval);
          break;
      }

      instanceCount++;
    }

    return postIds;
  }

  // Get posting analytics
  getPostingAnalytics(): {
    totalScheduled: number;
    totalPublished: number;
    totalFailed: number;
    averageEngagement: number;
    bestPerformingTime: string;
  } {
    const totalScheduled = this.scheduledPosts.filter(p => p.status === 'scheduled').length;
    const totalPublished = this.scheduledPosts.filter(p => p.status === 'published').length;
    const totalFailed = this.scheduledPosts.filter(p => p.status === 'failed').length;

    return {
      totalScheduled,
      totalPublished,
      totalFailed,
      averageEngagement: 4.2, // Mock data
      bestPerformingTime: '7:00 PM', // Mock data
    };
  }
}

export default SchedulerService.getInstance();
