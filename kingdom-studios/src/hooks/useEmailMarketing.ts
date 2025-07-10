/**
 * Email Marketing React Hook
 * Provides easy access to email marketing functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  EmailMarketingService, 
  EmailSubscriber, 
  EmailTemplate, 
  EmailCampaign, 
  EmailAutomation,
  EmailAnalytics 
} from '../services/emailMarketingService';

interface UseEmailMarketingReturn {
  // Subscriber Management
  subscribers: EmailSubscriber[];
  addSubscriber: (subscriberData: Omit<EmailSubscriber, 'id' | 'subscribedAt' | 'status'>) => Promise<string>;
  unsubscribeSubscriber: (subscriberId: string) => Promise<boolean>;
  getSubscribersByStatus: (status: string) => EmailSubscriber[];
  addTagToSubscriber: (subscriberId: string, tag: string) => Promise<boolean>;
  
  // Template Management
  templates: EmailTemplate[];
  createTemplate: (templateData: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTemplate: (templateId: string, updates: Partial<EmailTemplate>) => Promise<boolean>;
  getTemplatesByCategory: (category: string) => EmailTemplate[];
  
  // Campaign Management
  campaigns: EmailCampaign[];
  createCampaign: (campaignData: Omit<EmailCampaign, 'id' | 'stats' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  sendCampaign: (campaignId: string) => Promise<boolean>;
  getCampaignsByStatus: (status: string) => EmailCampaign[];
  
  // Automation Management
  automations: EmailAutomation[];
  createAutomation: (automationData: Omit<EmailAutomation, 'id' | 'stats' | 'createdAt'>) => Promise<string>;
  
  // Analytics
  analytics: EmailAnalytics | null;
  refreshAnalytics: () => void;
  
  // Loading States
  isLoading: boolean;
  isCreating: boolean;
  isSending: boolean;
  
  // Error State
  error: string | null;
  
  // Utility
  refreshData: () => void;
}

export const useEmailMarketing = (): UseEmailMarketingReturn => {
  const [emailService] = useState(() => EmailMarketingService.getInstance());
  
  // Data State
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [automations, setAutomations] = useState<EmailAutomation[]>([]);
  const [analytics, setAnalytics] = useState<EmailAnalytics | null>(null);
  
  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Error State
  const [error, setError] = useState<string | null>(null);

  // Load all data
  const loadData = useCallback(() => {
    try {
      setSubscribers(emailService.getSubscribers());
      setTemplates(emailService.getTemplates());
      setCampaigns(emailService.getCampaigns());
      setAutomations(emailService.getAutomations());
      setAnalytics(emailService.getAnalytics());
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load email marketing data');
      setIsLoading(false);
    }
  }, [emailService]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Subscriber Management
  const addSubscriber = useCallback(async (
    subscriberData: Omit<EmailSubscriber, 'id' | 'subscribedAt' | 'status'>
  ): Promise<string> => {
    setIsCreating(true);
    setError(null);
    
    try {
      const subscriberId = await emailService.addSubscriber(subscriberData);
      setSubscribers(emailService.getSubscribers());
      setAnalytics(emailService.getAnalytics());
      return subscriberId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add subscriber';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, [emailService]);

  const unsubscribeSubscriber = useCallback(async (subscriberId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await emailService.unsubscribeSubscriber(subscriberId);
      if (success) {
        setSubscribers(emailService.getSubscribers());
        setAnalytics(emailService.getAnalytics());
      } else {
        setError('Failed to unsubscribe');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [emailService]);

  const getSubscribersByStatus = useCallback((status: string): EmailSubscriber[] => {
    return emailService.getSubscribers({ status });
  }, [emailService]);

  const addTagToSubscriber = useCallback(async (subscriberId: string, tag: string): Promise<boolean> => {
    try {
      const success = await emailService.addTagToSubscriber(subscriberId, tag);
      if (success) {
        setSubscribers(emailService.getSubscribers());
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add tag');
      return false;
    }
  }, [emailService]);

  // Template Management
  const createTemplate = useCallback(async (
    templateData: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    setIsCreating(true);
    setError(null);
    
    try {
      const templateId = await emailService.createTemplate(templateData);
      setTemplates(emailService.getTemplates());
      return templateId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create template';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, [emailService]);

  const updateTemplate = useCallback(async (
    templateId: string, 
    updates: Partial<EmailTemplate>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await emailService.updateTemplate(templateId, updates);
      if (success) {
        setTemplates(emailService.getTemplates());
      } else {
        setError('Failed to update template');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update template';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [emailService]);

  const getTemplatesByCategory = useCallback((category: string): EmailTemplate[] => {
    return emailService.getTemplates(category);
  }, [emailService]);

  // Campaign Management
  const createCampaign = useCallback(async (
    campaignData: Omit<EmailCampaign, 'id' | 'stats' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    setIsCreating(true);
    setError(null);
    
    try {
      const campaignId = await emailService.createCampaign(campaignData);
      setCampaigns(emailService.getCampaigns());
      setAnalytics(emailService.getAnalytics());
      return campaignId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create campaign';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, [emailService]);

  const sendCampaign = useCallback(async (campaignId: string): Promise<boolean> => {
    setIsSending(true);
    setError(null);
    
    try {
      const success = await emailService.sendCampaign(campaignId);
      if (success) {
        setCampaigns(emailService.getCampaigns());
        setAnalytics(emailService.getAnalytics());
      } else {
        setError('Failed to send campaign');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send campaign';
      setError(errorMessage);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [emailService]);

  const getCampaignsByStatus = useCallback((status: string): EmailCampaign[] => {
    return emailService.getCampaigns(status);
  }, [emailService]);

  // Automation Management
  const createAutomation = useCallback(async (
    automationData: Omit<EmailAutomation, 'id' | 'stats' | 'createdAt'>
  ): Promise<string> => {
    setIsCreating(true);
    setError(null);
    
    try {
      const automationId = await emailService.createAutomation(automationData);
      setAutomations(emailService.getAutomations());
      return automationId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create automation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, [emailService]);

  // Analytics
  const refreshAnalytics = useCallback(() => {
    setAnalytics(emailService.getAnalytics());
  }, [emailService]);

  // Utility function to refresh all data
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    // Subscriber Management
    subscribers,
    addSubscriber,
    unsubscribeSubscriber,
    getSubscribersByStatus,
    addTagToSubscriber,
    
    // Template Management
    templates,
    createTemplate,
    updateTemplate,
    getTemplatesByCategory,
    
    // Campaign Management
    campaigns,
    createCampaign,
    sendCampaign,
    getCampaignsByStatus,
    
    // Automation Management
    automations,
    createAutomation,
    
    // Analytics
    analytics,
    refreshAnalytics,
    
    // Loading States
    isLoading,
    isCreating,
    isSending,
    
    // Error State
    error,
    
    // Utility
    refreshData
  };
};

export default useEmailMarketing;
