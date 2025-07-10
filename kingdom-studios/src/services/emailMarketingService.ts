/**
 * Email Marketing Service
 * Handles email campaigns, subscriber management, and email automation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from './notificationService';
import { AnalyticsTracker } from './AnalyticsTracker';

// Email Marketing Types
export interface EmailSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscribedAt: Date;
  status: 'active' | 'unsubscribed' | 'bounced';
  tags: string[];
  customFields: Record<string, any>;
  lastEngagement?: Date;
  source: string; // Where they subscribed from
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  category: 'newsletter' | 'promotional' | 'welcome' | 'follow-up' | 'custom';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  previewImage?: string;
  variables: string[]; // Dynamic variables like {{firstName}}
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  templateId?: string;
  content: {
    html: string;
    text: string;
  };
  recipients: {
    type: 'all' | 'segment' | 'specific';
    segmentCriteria?: Record<string, any>;
    specificEmails?: string[];
    count: number;
  };
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  scheduledAt?: Date;
  sentAt?: Date;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailAutomation {
  id: string;
  name: string;
  trigger: {
    type: 'subscription' | 'tag_added' | 'date' | 'behavior';
    criteria: Record<string, any>;
  };
  emails: {
    templateId: string;
    delayDays: number;
    subject: string;
  }[];
  isActive: boolean;
  stats: {
    triggered: number;
    completed: number;
    optedOut: number;
  };
  createdAt: Date;
}

export interface EmailAnalytics {
  totalSubscribers: number;
  activeSubscribers: number;
  totalCampaigns: number;
  averageOpenRate: number;
  averageClickRate: number;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  growthRate: number;
  topPerformingCampaigns: EmailCampaign[];
  recentActivity: any[];
}

class EmailMarketingService {
  private static instance: EmailMarketingService;
  private subscribers: EmailSubscriber[] = [];
  private templates: EmailTemplate[] = [];
  private campaigns: EmailCampaign[] = [];
  private automations: EmailAutomation[] = [];
  private analyticsTracker: AnalyticsTracker;

  private constructor() {
    this.analyticsTracker = AnalyticsTracker.getInstance();
    this.loadData();
    this.initializeDefaultTemplates();
  }

  public static getInstance(): EmailMarketingService {
    if (!EmailMarketingService.instance) {
      EmailMarketingService.instance = new EmailMarketingService();
    }
    return EmailMarketingService.instance;
  }

  // Subscriber Management
  public async addSubscriber(subscriberData: Omit<EmailSubscriber, 'id' | 'subscribedAt' | 'status'>): Promise<string> {
    try {
      const subscriber: EmailSubscriber = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        subscribedAt: new Date(),
        status: 'active',
        ...subscriberData
      };

      this.subscribers.push(subscriber);
      await this.saveSubscribers();

      // Track subscription
      this.analyticsTracker.trackEmailSubscription(subscriber.source);

      // Send welcome notification
      await notificationService.sendLocalNotification({
        id: `new_subscriber_${Date.now()}`,
        title: 'New Email Subscriber! 📧',
        body: `${subscriber.firstName || subscriber.email} just subscribed to your email list`,
        data: { type: 'new_subscriber', subscriberId: subscriber.id }
      });

      return subscriber.id;
    } catch (error) {
      console.error('Error adding subscriber:', error);
      throw new Error('Failed to add subscriber');
    }
  }

  public async unsubscribeSubscriber(subscriberId: string): Promise<boolean> {
    try {
      const subscriber = this.subscribers.find(s => s.id === subscriberId);
      if (!subscriber) return false;

      subscriber.status = 'unsubscribed';
      await this.saveSubscribers();

      // Track unsubscription
      this.analyticsTracker.trackEmailUnsubscription();

      return true;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return false;
    }
  }

  public getSubscribers(filter?: { status?: string; tag?: string }): EmailSubscriber[] {
    let filtered = [...this.subscribers];

    if (filter?.status) {
      filtered = filtered.filter(s => s.status === filter.status);
    }

    if (filter?.tag) {
      filtered = filtered.filter(s => s.tags.includes(filter.tag!));
    }

    return filtered.sort((a, b) => b.subscribedAt.getTime() - a.subscribedAt.getTime());
  }

  public async addTagToSubscriber(subscriberId: string, tag: string): Promise<boolean> {
    try {
      const subscriber = this.subscribers.find(s => s.id === subscriberId);
      if (!subscriber) return false;

      if (!subscriber.tags.includes(tag)) {
        subscriber.tags.push(tag);
        await this.saveSubscribers();
      }

      return true;
    } catch (error) {
      console.error('Error adding tag:', error);
      return false;
    }
  }

  // Template Management
  public async createTemplate(templateData: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const template: EmailTemplate = {
        id: `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...templateData
      };

      this.templates.push(template);
      await this.saveTemplates();

      // Track template creation
      this.analyticsTracker.trackEmailTemplateCreated(template.category);

      return template.id;
    } catch (error) {
      console.error('Error creating template:', error);
      throw new Error('Failed to create template');
    }
  }

  public getTemplates(category?: string): EmailTemplate[] {
    let filtered = [...this.templates];

    if (category) {
      filtered = filtered.filter(t => t.category === category);
    }

    return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  public async updateTemplate(templateId: string, updates: Partial<EmailTemplate>): Promise<boolean> {
    try {
      const template = this.templates.find(t => t.id === templateId);
      if (!template) return false;

      Object.assign(template, { ...updates, updatedAt: new Date() });
      await this.saveTemplates();

      return true;
    } catch (error) {
      console.error('Error updating template:', error);
      return false;
    }
  }

  // Campaign Management
  public async createCampaign(campaignData: Omit<EmailCampaign, 'id' | 'stats' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const campaign: EmailCampaign = {
        id: `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        stats: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
          unsubscribed: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        ...campaignData
      };

      // Calculate recipient count
      if (campaign.recipients.type === 'all') {
        campaign.recipients.count = this.getSubscribers({ status: 'active' }).length;
      } else if (campaign.recipients.type === 'specific' && campaign.recipients.specificEmails) {
        campaign.recipients.count = campaign.recipients.specificEmails.length;
      }

      this.campaigns.push(campaign);
      await this.saveCampaigns();

      // Track campaign creation
      this.analyticsTracker.trackEmailCampaignCreated(campaign.recipients.count);

      return campaign.id;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw new Error('Failed to create campaign');
    }
  }

  public async sendCampaign(campaignId: string): Promise<boolean> {
    try {
      const campaign = this.campaigns.find(c => c.id === campaignId);
      if (!campaign || campaign.status !== 'draft') return false;

      campaign.status = 'sending';
      campaign.sentAt = new Date();

      // In a real implementation, this would integrate with email service provider
      // For now, we'll simulate the sending process
      await this.simulateEmailSending(campaign);

      campaign.status = 'sent';
      await this.saveCampaigns();

      // Track campaign sent
      this.analyticsTracker.trackEmailCampaignSent(campaign.id, campaign.stats.sent);

      // Send notification
      await notificationService.sendLocalNotification({
        id: `campaign_sent_${Date.now()}`,
        title: 'Campaign Sent! 📧',
        body: `"${campaign.name}" was sent to ${campaign.stats.sent} subscribers`,
        data: { type: 'campaign_sent', campaignId }
      });

      return true;
    } catch (error) {
      console.error('Error sending campaign:', error);
      return false;
    }
  }

  public getCampaigns(status?: string): EmailCampaign[] {
    let filtered = [...this.campaigns];

    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Email Automation
  public async createAutomation(automationData: Omit<EmailAutomation, 'id' | 'stats' | 'createdAt'>): Promise<string> {
    try {
      const automation: EmailAutomation = {
        id: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        stats: {
          triggered: 0,
          completed: 0,
          optedOut: 0,
        },
        createdAt: new Date(),
        ...automationData
      };

      this.automations.push(automation);
      await this.saveAutomations();

      // Track automation creation
      this.analyticsTracker.trackEmailAutomationCreated(automation.trigger.type, automation.emails.length);

      return automation.id;
    } catch (error) {
      console.error('Error creating automation:', error);
      throw new Error('Failed to create automation');
    }
  }

  public getAutomations(): EmailAutomation[] {
    return [...this.automations].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Analytics
  public getAnalytics(): EmailAnalytics {
    const activeSubscribers = this.getSubscribers({ status: 'active' });
    const totalSent = this.campaigns.reduce((sum, c) => sum + c.stats.sent, 0);
    const totalOpened = this.campaigns.reduce((sum, c) => sum + c.stats.opened, 0);
    const totalClicked = this.campaigns.reduce((sum, c) => sum + c.stats.clicked, 0);

    return {
      totalSubscribers: this.subscribers.length,
      activeSubscribers: activeSubscribers.length,
      totalCampaigns: this.campaigns.length,
      averageOpenRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
      averageClickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
      totalSent,
      totalOpened,
      totalClicked,
      growthRate: this.calculateGrowthRate(),
      topPerformingCampaigns: this.getTopPerformingCampaigns(),
      recentActivity: this.getRecentActivity(),
    };
  }

  // Private Methods
  private async simulateEmailSending(campaign: EmailCampaign): Promise<void> {
    // Simulate email sending with realistic stats
    const sent = campaign.recipients.count;
    const deliveryRate = 0.95; // 95% delivery rate
    const openRate = 0.25; // 25% open rate
    const clickRate = 0.05; // 5% click rate

    campaign.stats.sent = sent;
    campaign.stats.delivered = Math.floor(sent * deliveryRate);
    campaign.stats.opened = Math.floor(campaign.stats.delivered * openRate);
    campaign.stats.clicked = Math.floor(campaign.stats.delivered * clickRate);
    campaign.stats.bounced = sent - campaign.stats.delivered;
  }

  private calculateGrowthRate(): number {
    // Calculate subscriber growth rate over the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSubscribers = this.subscribers.filter(s => s.subscribedAt > thirtyDaysAgo);
    const previousSubscribers = this.subscribers.length - recentSubscribers.length;

    if (previousSubscribers === 0) return 100;
    return (recentSubscribers.length / previousSubscribers) * 100;
  }

  private getTopPerformingCampaigns(): EmailCampaign[] {
    return this.campaigns
      .filter(c => c.status === 'sent')
      .sort((a, b) => {
        const aRate = a.stats.sent > 0 ? a.stats.opened / a.stats.sent : 0;
        const bRate = b.stats.sent > 0 ? b.stats.opened / b.stats.sent : 0;
        return bRate - aRate;
      })
      .slice(0, 5);
  }

  private getRecentActivity(): any[] {
    const activity: any[] = [];

    // Add recent campaigns
    this.campaigns.slice(0, 5).forEach(campaign => {
      activity.push({
        type: 'campaign',
        action: `Campaign "${campaign.name}" ${campaign.status}`,
        timestamp: campaign.sentAt || campaign.createdAt,
        data: campaign
      });
    });

    // Add recent subscribers
    this.subscribers.slice(0, 5).forEach(subscriber => {
      activity.push({
        type: 'subscriber',
        action: `${subscriber.firstName || subscriber.email} subscribed`,
        timestamp: subscriber.subscribedAt,
        data: subscriber
      });
    });

    return activity.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  }

  private initializeDefaultTemplates(): void {
    if (this.templates.length === 0) {
      const defaultTemplates: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          name: 'Welcome Email',
          subject: 'Welcome to Kingdom Studios! 🙏',
          category: 'welcome',
          isActive: true,
          htmlContent: `
            <h1>Welcome {{firstName}}!</h1>
            <p>We're thrilled to have you join our faith-based creator community.</p>
            <p>Get ready to:</p>
            <ul>
              <li>Create inspiring content</li>
              <li>Connect with fellow believers</li>
              <li>Grow your ministry</li>
            </ul>
            <p>Blessings,<br>The Kingdom Studios Team</p>
          `,
          textContent: 'Welcome {{firstName}}! We\'re thrilled to have you join our faith-based creator community...',
          variables: ['firstName'],
        },
        {
          name: 'Weekly Newsletter',
          subject: 'Your Weekly Kingdom Update 📖',
          category: 'newsletter',
          isActive: true,
          htmlContent: `
            <h1>This Week in Faith</h1>
            <p>Hi {{firstName}},</p>
            <p>Here's what's happening this week in our community:</p>
            <div>{{weeklyContent}}</div>
            <p>Stay blessed!</p>
          `,
          textContent: 'This Week in Faith - Hi {{firstName}}, Here\'s what\'s happening this week...',
          variables: ['firstName', 'weeklyContent'],
        }
      ];

      defaultTemplates.forEach(template => {
        this.createTemplate(template);
      });
    }
  }

  // Storage Methods
  private async saveSubscribers(): Promise<void> {
    try {
      await AsyncStorage.setItem('email_subscribers', JSON.stringify(this.subscribers));
    } catch (error) {
      console.error('Error saving subscribers:', error);
    }
  }

  private async saveTemplates(): Promise<void> {
    try {
      await AsyncStorage.setItem('email_templates', JSON.stringify(this.templates));
    } catch (error) {
      console.error('Error saving templates:', error);
    }
  }

  private async saveCampaigns(): Promise<void> {
    try {
      await AsyncStorage.setItem('email_campaigns', JSON.stringify(this.campaigns));
    } catch (error) {
      console.error('Error saving campaigns:', error);
    }
  }

  private async saveAutomations(): Promise<void> {
    try {
      await AsyncStorage.setItem('email_automations', JSON.stringify(this.automations));
    } catch (error) {
      console.error('Error saving automations:', error);
    }
  }

  private async loadData(): Promise<void> {
    try {
      const [subscribers, templates, campaigns, automations] = await Promise.all([
        AsyncStorage.getItem('email_subscribers'),
        AsyncStorage.getItem('email_templates'),
        AsyncStorage.getItem('email_campaigns'),
        AsyncStorage.getItem('email_automations'),
      ]);

      if (subscribers) this.subscribers = JSON.parse(subscribers);
      if (templates) this.templates = JSON.parse(templates);
      if (campaigns) this.campaigns = JSON.parse(campaigns);
      if (automations) this.automations = JSON.parse(automations);
    } catch (error) {
      console.error('Error loading email marketing data:', error);
    }
  }
}

export { EmailMarketingService };
